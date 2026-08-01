'use strict';

/**
 * word-anatomy.js
 * ---------------
 * Verification and structural analysis of supplied record words.
 *
 * Doubles as the record registry Keranen asked for in his feedback: every
 * claimed word is re-checked against the property it claims before any
 * conclusion is drawn from it. The project has been burned by this once - a
 * shipped 40-letter "aa2fr" example turned out to contain three forbidden
 * factors and three abelian squares - so verification comes first and analysis
 * second, in that order, every time.
 *
 * WHAT IS MEASURED AND WHY
 * ------------------------
 *  1. Does the word actually satisfy aa2f (no abelian square of half-length
 *     K >= 2)? Exhaustive over all K and all positions. O(n^2) and worth it.
 *  2. FORBID4 occurrences. The set is the project's own pruning heuristic
 *     (MATH_CLAIMS.md row 9); whether real record words obey it is a fact about
 *     the heuristic, not about the words.
 *  3. Factor complexity p(n), compared against the complete aa2f language.
 *     Near-saturation means the word explores the language broadly; linear
 *     growth would mean it is substitutive. These are very different objects and
 *     the distinction decides whether reverse-engineering a morphism from the
 *     word is worth attempting at all.
 *  4. Maximum pairwise Parikh imbalance, compared against sqrt(N). A morphic
 *     word's imbalance grows like N^(log|lambda_2|/log lambda_1); an
 *     unconstrained walk grows like sqrt(N).
 *
 * Usage:  node word-anatomy.js datasets/keranen_25379.txt [more files...]
 *
 * Record words live in datasets/ and are gitignored: they are the authors'
 * data, verified here but never redistributed. resolveDataFile() also accepts
 * the repository root, where they used to sit before the 2026-07-30 tidy-up,
 * so an existing local checkout keeps working.
 */

const fs = require('fs');
const fc = require('./factor-complexity.js');

const FORBID4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];

/** First abelian square of half-length >= minK, or null. Exhaustive. */
function firstAbelianSquare(w, minK = 2) {
  const n = w.length;
  const pa = new Int32Array(n + 1), pb = new Int32Array(n + 1), pc = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    pa[i + 1] = pa[i] + (w[i] === 'a' ? 1 : 0);
    pb[i + 1] = pb[i] + (w[i] === 'b' ? 1 : 0);
    pc[i + 1] = pc[i] + (w[i] === 'c' ? 1 : 0);
  }
  for (let K = minK; K <= n >> 1; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      if (pa[i + K] - pa[i] !== pa[i + 2 * K] - pa[i + K]) continue;
      if (pb[i + K] - pb[i] !== pb[i + 2 * K] - pb[i + K]) continue;
      if (pc[i + K] - pc[i] !== pc[i + 2 * K] - pc[i + K]) continue;
      return { K, pos: i };
    }
  }
  return null;
}

function countOccurrences(w, pat) {
  let c = 0, i = -1;
  while ((i = w.indexOf(pat, i + 1)) !== -1) c++;
  return c;
}

function complexity(w, maxN) {
  const P = [];
  for (let n = 1; n <= maxN; n++) {
    const s = new Set();
    for (let i = 0; i + n <= w.length; i++) s.add(w.substr(i, n));
    P[n] = s.size;
  }
  return P;
}

function parikhExcursion(w) {
  let a = 0, b = 0, c = 0, max = 0, at = 0;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    if (ch === 'a') a++; else if (ch === 'b') b++; else c++;
    const m = Math.max(Math.abs(a - b), Math.abs(b - c), Math.abs(a - c));
    if (m > max) { max = m; at = i; }
  }
  return { final: { a, b, c }, max, at };
}

function extractWord(path) {
  const runs = fs.readFileSync(path, 'utf8').match(/[abc]{100,}/g);
  if (!runs) throw new Error(`${path} contains no ternary run of length >= 100.`);
  return runs.sort((x, y) => y.length - x.length)[0];
}

function analyse(path, langP, maxN) {
  const w = extractWord(path);
  const violation = firstAbelianSquare(w, 2);
  const forbid = FORBID4.map(p => countOccurrences(w, p));
  const P = complexity(w, maxN);
  const par = parikhExcursion(w);
  return {
    file: path.replace(/^.*[\\/]/, ''),
    length: w.length,
    aa2f: violation === null,
    violation,
    forbid,
    forbidTotal: forbid.reduce((x, y) => x + y, 0),
    aa2fr: violation === null && forbid.every(c => c === 0),
    P, par,
    saturation: [6, 10, maxN].map(n => ({ n, pct: 100 * P[n] / Math.min(langP[n], w.length - n + 1) }))
  };
}

function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) { console.log('usage: node word-anatomy.js <file> [file...]'); return; }
  const MAXN = 14;

  // complete aa2f language, for the saturation comparison
  const lang = fc.LANGUAGES.find(L => L.key === 'aa2f');
  const langCounts = fc.enumerate(lang.alphabet, lang.ok, MAXN, 2e7);
  if (!langCounts.exhausted) throw new Error('aa2f language enumeration did not complete; saturation figures would be meaningless.');
  const langP = langCounts.counts;

  const line = '='.repeat(78);
  console.log('');
  console.log('RECORD WORD VERIFICATION AND ANATOMY');
  console.log('Verification first: no conclusion is drawn from a word that has not been checked.');
  console.log('');
  console.log(line);
  console.log('1. VERIFICATION');
  console.log(line);
  console.log('  file                    length   aa2f?   aa2fr?   first violation   FORBID4 total');
  console.log('  ' + '-'.repeat(76));
  const all = [];
  for (const f of files) {
    const r = analyse(f, langP, MAXN);
    all.push(r);
    console.log('  ' + r.file.padEnd(23) + String(r.length).padStart(7) +
      (r.aa2f ? '   yes  ' : '   NO   ') + (r.aa2fr ? '   yes  ' : '   no   ') +
      (r.violation ? `  K=${r.violation.K}@${r.violation.pos}`.padEnd(18) : '  -'.padEnd(18)) +
      String(r.forbidTotal).padStart(10));
  }
  console.log('');
  const bad = all.filter(r => !r.aa2f);
  if (bad.length) {
    console.log(`  ${bad.length} word(s) FAIL the aa2f property. Nothing below applies to them.`);
    console.log('');
  }

  console.log(line);
  console.log('2. FORBID4 - is it a rule or a heuristic?');
  console.log(line);
  for (const r of all) {
    if (!r.aa2f) continue;
    console.log(`  ${r.file.padEnd(23)} ` + FORBID4.map((p, i) => `${p}:${r.forbid[i]}`).join(' '));
  }
  console.log('');
  const withForbid = all.filter(r => r.aa2f && r.forbidTotal > 0);
  if (withForbid.length) {
    console.log('  FORBID4 factors DO occur in verified aa2f record words, so the set is a');
    console.log('  search-pruning heuristic and not a necessary condition. See MATH_CLAIMS.md');
    console.log('  row 9 and row 40. The near-uniform split across the six is expected: the');
    console.log('  set is closed under S3 relabelling and reversal.');
  }
  console.log('');

  console.log(line);
  console.log('3. FACTOR COMPLEXITY p(n) AGAINST THE COMPLETE aa2f LANGUAGE');
  console.log(line);
  console.log('   n ' + all.map(r => r.file.slice(8, 14).padStart(9)).join('') + '   language   max possible');
  for (let n = 1; n <= MAXN; n++) {
    console.log('  ' + String(n).padStart(2) + ' ' +
      all.map(r => String(r.P[n]).padStart(9)).join('') +
      String(langP[n]).padStart(11) + String(Math.min(...all.map(r => r.length)) - n + 1).padStart(15));
  }
  console.log('');
  for (const r of all) {
    console.log(`  ${r.file.padEnd(23)} saturation: ` + r.saturation.map(s => `n=${s.n}: ${s.pct.toFixed(1)}%`).join('   '));
  }
  console.log('');
  console.log('  Reading: a substitutive word has LINEAR complexity - g3(h6^w(a)) has');
  console.log('  p(14) = 138 (MATH_CLAIMS.md row 28). These words are orders of magnitude');
  console.log('  above that and track the language itself, so they are search products, not');
  console.log('  algebraic generators. Searching them for a generating morphism is therefore');
  console.log('  not expected to find one.');
  console.log('');

  console.log(line);
  console.log('4. PARIKH EXCURSION');
  console.log(line);
  console.log('  file                    max pairwise imbalance   sqrt(N)   ratio');
  for (const r of all) {
    const s = Math.sqrt(r.length);
    console.log('  ' + r.file.padEnd(23) + String(r.par.max).padStart(18) + s.toFixed(0).padStart(11) + (r.par.max / s).toFixed(2).padStart(9));
  }
  console.log('');
  console.log('  A ratio roughly constant across lengths means the imbalance scales like');
  console.log('  sqrt(N), which is unconstrained-walk behaviour rather than the bounded or');
  console.log('  structured excursion a block substitution would produce.');
  console.log('');
}

if (require.main === module) main();

/**
 * Locate a gitignored data file. Looks in datasets/ first, then the repository
 * root where the record words lived before the 2026-07-30 reorganisation.
 * Returns null when absent, so every caller can skip cleanly rather than fail.
 */
function resolveDataFile(name) {
  const path_ = require('path'), fs_ = require('fs');
  for (const dir of ['datasets', '.']) {
    const p = path_.join(__dirname, dir, name);
    if (fs_.existsSync(p)) return p;
  }
  return null;
}

module.exports = { firstAbelianSquare, countOccurrences, complexity, parikhExcursion, extractWord, analyse, resolveDataFile, FORBID4 };
