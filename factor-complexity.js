'use strict';

/**
 * factor-complexity.js
 * --------------------
 * Exact factor complexity p(n) for the languages this project actually studies,
 * side by side. One table that shows why four letters is the answer and three is
 * not, in numbers rather than assertion.
 *
 * WHAT p(n) IS
 * ------------
 * p_L(n) = the number of distinct words of length n in the language L. All the
 * languages here are factorial - a factor of an abelian-square-free word is
 * itself abelian-square-free - so p(n) is simultaneously "words of length n in L"
 * and "distinct length-n factors occurring in L". That coincidence is what makes
 * the comparison meaningful.
 *
 * WHY THIS IS THE RIGHT INSTRUMENT, AND THE ONE THE PROJECT LACKED
 * ---------------------------------------------------------------
 * An earlier design in this repository proposed profiling DFS branching factors
 * and "extinction ratios" per depth. Those are properties of the SEARCH ORDER,
 * not of the mathematics: permute the letter preference and every number changes.
 * p(n) is an invariant of the language. It answers the same intuitive question -
 * where does the constraint start to bite - with a quantity that does not move
 * when the implementation does.
 *
 * EPISTEMOLOGY (AGENTS.md rules 3 and 7)
 * --------------------------------------
 * Each p(n) printed below is EXACT: the enumeration for that length ran to
 * completion. Lengths where the budget ran out are not printed at all, rather
 * than printed with a caveat, so no partial count can ever be mistaken for a
 * total. The growth ratios p(n+1)/p(n) are observations over a finite window and
 * are labelled as such - they are NOT estimates of a limit, and no growth rate is
 * claimed. See MATH_CLAIMS.md rows 27, 28.
 *
 * Usage:
 *   node factor-complexity.js               # default budget
 *   node factor-complexity.js --budget 3e7  # larger exhaustive window
 */

const { H6, G3 } = require('./morphisms.js');

/* ------------------------------------------------------------------ *
 * Language definitions
 * ------------------------------------------------------------------ *
 * Each language is given by an alphabet plus a suffix test: given that
 * w[0..len-2] is already in the language, is w[0..len-1] still in it?
 * Every constraint here is suffix-checkable, which is what makes DFS with
 * pruning both correct and complete.
 */

const FORBID4 = new Set(['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca']);

/**
 * Counts words of each length by exhaustive DFS with pruning.
 *
 * Returns { counts, completeUpTo, nodes, exhausted } where counts[n] is exact
 * for every n <= completeUpTo. A length is reported only when the entire subtree
 * for that length was explored, so a truncated run yields fewer rows, never
 * wrong ones.
 */
function enumerate(alphabet, suffixOk, maxN, nodeBudget) {
  const A = alphabet.length;
  const counts = new Array(maxN + 1).fill(0);
  counts[0] = 1;

  // per-letter prefix sums, one Int32Array per symbol
  const pre = Array.from({ length: A }, () => new Int32Array(maxN + 2));
  const word = new Int32Array(maxN + 2);

  let nodes = 0;
  let budgetHit = false;
  // depthClosed[n] = true once every word of length n has been enumerated
  let deepestStarted = 0;

  function dfs(len) {
    if (budgetHit) return;
    if (len > deepestStarted) deepestStarted = len;
    if (len === maxN) return;
    for (let c = 0; c < A; c++) {
      if (++nodes > nodeBudget) { budgetHit = true; return; }
      word[len] = c;
      for (let s = 0; s < A; s++) pre[s][len + 1] = pre[s][len] + (s === c ? 1 : 0);
      if (suffixOk(word, len + 1, pre, A)) {
        counts[len + 1]++;
        dfs(len + 1);
        if (budgetHit) return;
      }
    }
  }
  dfs(0);

  // If the budget was hit, counts at and below the deepest fully-closed level are
  // still unreliable, because the abort happened mid-traversal. Be conservative:
  // report nothing when truncated except the lengths already provably complete,
  // which we cannot identify cheaply - so on truncation we report up to the
  // largest n whose subtree we can guarantee, namely none beyond the abort point.
  const completeUpTo = budgetHit ? -1 : maxN;
  return { counts, completeUpTo, nodes, exhausted: !budgetHit };
}

/** Is the length-len suffix free of abelian squares with half-length >= minK? */
function noAbelianSquare(word, len, pre, A, minK) {
  const half = Math.floor(len / 2);
  for (let k = minK; k <= half; k++) {
    let equal = true;
    for (let s = 0; s < A; s++) {
      if ((pre[s][len - k] - pre[s][len - 2 * k]) !== (pre[s][len] - pre[s][len - k])) {
        equal = false;
        break;
      }
    }
    if (equal) return false;
  }
  return true;
}

const LETTERS3 = ['a', 'b', 'c'];

function noForbid4(word, len) {
  if (len < 4) return true;
  const s = LETTERS3[word[len - 4]] + LETTERS3[word[len - 3]] +
            LETTERS3[word[len - 2]] + LETTERS3[word[len - 1]];
  return !FORBID4.has(s);
}

const LANGUAGES = [
  {
    key: 'free3',
    label: 'all ternary words',
    note: 'p(n) = 3^n, the unconstrained baseline',
    alphabet: ['a', 'b', 'c'],
    ok: () => true
  },
  {
    key: 'asf3',
    label: 'abelian-square-free, 3 letters',
    note: 'dies at length 7 - MATH_CLAIMS.md row 1',
    alphabet: ['a', 'b', 'c'],
    ok: (w, l, p, A) => noAbelianSquare(w, l, p, A, 1)
  },
  {
    key: 'aa2f',
    label: 'aa2f, 3 letters (Makela, OPEN)',
    note: 'period-1 squares allowed, K >= 2 forbidden - MATH_CLAIMS.md row 4',
    alphabet: ['a', 'b', 'c'],
    ok: (w, l, p, A) => noAbelianSquare(w, l, p, A, 2)
  },
  {
    key: 'aa2fr',
    label: 'aa2fr = aa2f + FORBID4',
    note: 'project variant - MATH_CLAIMS.md row 9',
    alphabet: ['a', 'b', 'c'],
    ok: (w, l, p, A) => noForbid4(w, l) && noAbelianSquare(w, l, p, A, 2)
  },
  {
    key: 'asf4',
    label: 'abelian-square-free, 4 letters',
    note: 'Keranen 1992 - MATH_CLAIMS.md row 3',
    alphabet: ['a', 'b', 'c', 'd'],
    ok: (w, l, p, A) => noAbelianSquare(w, l, p, A, 1)
  }
];

/* ------------------------------------------------------------------ *
 * g3(h6^omega(a)) via complete factor sets, not enumeration
 * ------------------------------------------------------------------ */

function complexityOfConstruction(maxN) {
  const ff = require('./factor-frequencies.js');
  const out = [];
  for (let n = 1; n <= maxN; n++) {
    out.push(ff.ternaryFactorFrequencies(n).total.size);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Rigorous upper bound on the growth rate (Fekete)
 * ------------------------------------------------------------------ *
 * Every language here is factorial: a factor of a member is a member. A word of
 * length m+n is determined by its length-m prefix and its length-n suffix, both
 * of which must themselves be in the language, so
 *
 *     p(m+n) <= p(m) p(n).
 *
 * log p is therefore subadditive, and Fekete's lemma gives
 *
 *     lim_n p(n)^(1/n) = inf_n p(n)^(1/n).
 *
 * The limit being an INFIMUM is the useful part: p(n)^(1/n) is a rigorous UPPER
 * BOUND on the growth rate for every single n, not an estimate that might be
 * approached from either side. So exact factor counts, which this file already
 * computes, convert directly into a theorem-shaped bound.
 *
 * This replaces the observed ratio p(n+1)/p(n) as the headline quantity. That
 * ratio is an observation over a finite window with no proven relation to the
 * limit - the report says so - whereas the bound below holds unconditionally.
 * The two are far apart here because Fekete convergence is slow; the honest
 * reading is that we have a real bound and a much smaller conjectural value,
 * and the gap between them is not yet closed.
 */
function growthUpperBound(counts, maxN) {
  let bound = Infinity, at = 0;
  for (let n = 1; n <= maxN; n++) {
    if (!counts[n]) continue;
    const v = Math.pow(counts[n], 1 / n);
    if (v < bound) { bound = v; at = n; }
  }
  // Submultiplicativity is a theorem, but assert it on the data anyway: a
  // violation would mean the enumeration is wrong, not that Fekete is.
  for (let m = 1; m <= maxN; m++) {
    for (let n = 1; m + n <= maxN; n++) {
      if (counts[m + n] > counts[m] * counts[n]) {
        throw new Error(`p(${m + n}) = ${counts[m + n]} exceeds p(${m}) p(${n}) = ${counts[m] * counts[n]}. The language is not factorial or the enumeration is wrong.`);
      }
    }
  }
  return { bound, at };
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const padL = (s, n) => String(s).padStart(n);

function main() {
  const argv = process.argv.slice(2);
  const bi = argv.indexOf('--budget');
  const BUDGET = bi >= 0 ? Number(argv[bi + 1]) : 2e7;
  const line = '='.repeat(78);

  console.log('');
  console.log('FACTOR COMPLEXITY p(n) ACROSS THE LANGUAGES OF THIS PROJECT');
  console.log(`Exhaustive enumeration, node budget ${BUDGET.toExponential(0)} per language.`);
  console.log('Every printed p(n) is EXACT. Lengths whose enumeration did not finish');
  console.log('are omitted entirely rather than shown with a caveat.');
  console.log('');

  // find, per language, the largest maxN that completes within budget
  const results = {};
  for (const L of LANGUAGES) {
    let best = null;
    for (let maxN = 4; maxN <= 60; maxN++) {
      const r = enumerate(L.alphabet, L.ok, maxN, BUDGET);
      if (!r.exhausted) break;
      best = { maxN, counts: r.counts, nodes: r.nodes };
    }
    results[L.key] = best;
  }

  const construction = complexityOfConstruction(45);

  // ---- the table --------------------------------------------------------
  console.log(line);
  console.log('p(n), number of distinct words of length n   [EXACT where shown]');
  console.log(line);
  const cols = [...LANGUAGES.map(L => L.key), 'g3(h6^w)'];
  console.log('   n  ' + cols.map(c => padL(c, 13)).join(''));
  console.log('  ' + '-'.repeat(74));
  const maxRow = Math.max(...Object.values(results).map(r => (r ? r.maxN : 0)), 20);
  for (let n = 1; n <= Math.min(maxRow, 24); n++) {
    const cells = LANGUAGES.map(L => {
      const r = results[L.key];
      if (!r || n > r.maxN) return padL('.', 13);
      return padL(r.counts[n].toLocaleString(), 13);
    });
    const c = n <= construction.length ? padL(construction[n - 1].toLocaleString(), 13) : padL('.', 13);
    console.log('  ' + padL(n, 2) + '  ' + cells.join('') + c);
  }
  console.log('');
  console.log('  "." means the exhaustive enumeration for that length did not complete');
  console.log('  within the node budget, so no number is claimed. Raise --budget to extend.');
  console.log('');

  // ---- per-language reading --------------------------------------------
  console.log(line);
  console.log('WHAT EACH COLUMN SHOWS');
  console.log(line);
  for (const L of LANGUAGES) {
    const r = results[L.key];
    console.log(`  ${L.label}`);
    console.log(`    ${L.note}`);
    if (!r) { console.log('    (no length completed within budget)\n'); continue; }
    const last = r.counts[r.maxN];
    if (last === 0) {
      let died = r.maxN;
      while (died > 0 && r.counts[died] === 0) died--;
      console.log(`    LANGUAGE IS FINITE: p(${died + 1}) = 0. Longest word has length ${died},`);
      console.log(`    and there are exactly ${r.counts[died]} of them.`);
    } else {
      const ratios = [];
      for (let n = Math.max(2, r.maxN - 4); n < r.maxN; n++) {
        if (r.counts[n] > 0) ratios.push(r.counts[n + 1] / r.counts[n]);
      }
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      const g = growthUpperBound(r.counts, r.maxN);
      console.log(`    still growing at n = ${r.maxN}: p(${r.maxN}) = ${last.toLocaleString()}`);
      console.log(`    growth rate <= ${g.bound.toFixed(6)}   [RIGOROUS UPPER BOUND, from p(${g.at})^(1/${g.at})]`);
      console.log(`      by Fekete: p is submultiplicative, so lim p(n)^(1/n) = inf p(n)^(1/n),`);
      console.log(`      hence every p(n)^(1/n) bounds the growth rate from above unconditionally.`);
      console.log(`    observed ratio p(n+1)/p(n) over the last few lengths: ${avg.toFixed(4)}`);
      console.log(`      [OBSERVATION only, no proven relation to the limit. The gap between`);
      console.log(`       ${avg.toFixed(4)} and the bound ${g.bound.toFixed(4)} is not closed - Fekete converges slowly.]`);
    }
    console.log('');
  }

  console.log('  g3(h6^omega(a))');
  console.log('    the Rao & Rosenfeld ternary construction - MATH_CLAIMS.md rows 6a, 20');
  const diffs = [];
  for (let i = 1; i < construction.length; i++) diffs.push(construction[i] - construction[i - 1]);
  const settled = diffs.slice(14);
  const lo = Math.min(...settled), hi = Math.max(...settled);
  console.log(`    p(${construction.length}) = ${construction[construction.length - 1]}`);
  console.log(`    first differences p(n+1) - p(n) for n >= 15: between ${lo} and ${hi}`);
  console.log(`      ${settled.join(', ')}`);
  console.log(`    So the growth is LINEAR - bounded first differences - but the differences`);
  console.log(`    do NOT settle to a single value in the range computed: they alternate`);
  console.log(`    between ${lo} and ${hi}. Do not read this as p(n) = ${hi}n + c.`);
  console.log(`    Computed from COMPLETE FACTOR SETS of the infinite word, not by`);
  console.log(`    enumeration and not from a prefix, so each p(n) is exact for the`);
  console.log(`    infinite word. The bound on the differences is an observation over`);
  console.log(`    the computed range only.`);
  console.log('');
  console.log('    This is the qualitative gap that matters: every other column here grows');
  console.log('    exponentially or dies, while a word that actually realises the constraint');
  console.log('    forever has only linearly many factors. Very few words avoid the pattern,');
  console.log('    and the ones that do are highly structured rather than generic.');
  console.log('');

  // ---- the point --------------------------------------------------------
  console.log(line);
  console.log('THE COMPARISON');
  console.log(line);
  const asf3 = results['asf3'], asf4 = results['asf4'], aa2f = results['aa2f'];
  if (asf3 && asf4) {
    console.log('  Three letters, abelian-square-free : finite. The language stops.');
    console.log('  Four letters, abelian-square-free  : still growing where the budget ends.');
    console.log('  That gap is the whole subject. Keranen 1992 settles four letters by');
    console.log('  exhibiting g85; row 1 settles three by exhaustion. Nothing here is new -');
    console.log('  the value is that both facts are now visible as one quantity.');
  }
  if (aa2f) {
    console.log('');
    console.log('  aa2f sits between them, and that is exactly why Makela\'s question is open:');
    console.log('  relaxing only the period-1 squares turns a language that dies at length 7');
    console.log(`  into one still growing at length ${aa2f.maxN}. Whether it is infinite is unknown.`);
    console.log('  Rao & Rosenfeld report reaching length 450 by computer search; words of');
    console.log('  length 25,379 are known (MATH_CLAIMS.md rows 4, 14). Exhaustive enumeration');
    console.log('  as done here cannot reach those lengths and is not trying to - it measures');
    console.log('  how many words exist, not how long one can be made.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { enumerate, noAbelianSquare, LANGUAGES, complexityOfConstruction };
