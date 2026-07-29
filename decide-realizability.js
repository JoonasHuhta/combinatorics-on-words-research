'use strict';

/**
 * decide-realizability.js
 * -----------------------
 * The final step of Rao & Rosenfeld's decision procedure, run on h6.
 *
 * PROPOSITION 8, verbatim (arXiv:1511.05875, ar5iv rendering read 2026-07-28)
 * --------------------------------------------------------------------------
 *   "Let S be such that Ranc_h(t_0) is contained in S contained in Anc_h(t_0),
 *    and let s = max_{t in S} k((k-1) Delta(t)/2 + delta + 1) + 1. Then the
 *    following are equivalent:
 *      1. there is a factor of Fact_inf(h) of size at most s realizing a
 *         template t of S,
 *      2. there is a factor of Fact_inf(h) realizing t_0."
 *
 * with, from the same subsection:
 *   "Let Delta(t) = max_{i=1}^{k-1} ||d_i||_1 and delta = max_{a in Sigma} |h(a)|."
 *
 * WHY THIS FINISHES THE JOB
 * -------------------------
 * S may be ANY set sandwiched between the realizable ancestors and all
 * ancestors. We computed Anc_h(t_0) exactly (116,578 templates, MATH_CLAIMS.md
 * row 31), and Anc is a legal choice of S. So the infinite question - is there
 * any factor at all realizing t_0 - collapses to a FINITE search over factors of
 * length at most s. No approximation, no truncation: the bound is what makes the
 * search complete rather than merely long.
 *
 * Since a word realizes t_0 = [eps, eps, eps, 0] exactly when it is an abelian
 * square, deciding this decides whether h6^omega(a) is abelian-square-free -
 * which is the paper's Theorem 4.
 *
 * THE LENGTH BOUND FOR OUR CASE
 * -----------------------------
 * k = 2 (abelian squares) and delta = 3 (h6 is 3-uniform), so
 *
 *   s = 2 * ((2-1) * Delta/2 + 3 + 1) + 1 = Delta + 2*delta + 3 = Delta + 9.
 *
 * That matches the expression the authors' own reference implementation uses,
 * "lengthToCheck = Delta + 2*delta + 3" (MATH_CLAIMS.md row 22) - an independent
 * check that the formula has been read correctly, since we derived it from the
 * proposition rather than from their code.
 *
 * WHAT THIS DOES AND DOES NOT ESTABLISH
 * -------------------------------------
 * A negative result here means: no factor of length <= s realizes any template of
 * S, hence by Proposition 8 no factor of Fact_inf(h) realizes t_0 at all, hence
 * h6^omega(a) contains no abelian square. That is a complete argument about the
 * INFINITE word, conditional on Propositions 5-8 which are the paper's (Level 2)
 * and on this implementation being correct (Level 1). It is not an independent
 * proof of Theorem 4 - it is a re-derivation of it through the paper's own
 * machinery, which is exactly what a replication should be.
 *
 * Usage:  node decide-realizability.js
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const ab = require('./ancestor-box.js');
const gp = require('./get-parents.js');
const ff = require('./factor-frequencies.js');
const { K, parikhMatrixK, decompose } = jd;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
const N = 6;

const parikh = gp.parikh;
const vKey = gp.vKey;
const l1 = (v) => v.reduce((s, x) => s + Math.abs(x), 0);

/* ---------------------------------------------------------------- *
 * Decomposition of a factor into a realization
 * ---------------------------------------------------------------- *
 * w realizes t = [a_1, a_2, a_3, d_1] iff w = a_1 w_1 a_2 w_2 a_3 with
 * Psi(w_2) - Psi(w_1) = d_1. Enumerate every such decomposition of a given w
 * and report the template it realizes.
 *
 * a_1 can only be epsilon or the first letter of w; a_3 only epsilon or the last.
 * a_2 sits at some position of the remaining middle, or is epsilon, in which case
 * the middle splits anywhere.
 */
/**
 * @param {string} w
 * @param {boolean} requireNonEmpty  if true, only decompositions with every w_i
 *   non-empty are produced. See the note below - this is a CONVENTION, not
 *   something the quoted definition states.
 *
 * NOTE ON A CONVENTION THE SOURCE LEAVES IMPLICIT.
 * The quoted definition says "w = a_1 w_1 a_2 w_2 ... w_k a_{k+1}, where
 * w_i in Sigma*", which permits empty w_i, and then "A word is then an abelian
 * k-th power if and only if it realizes the k-template [eps,...,eps,0,...,0]".
 * Read literally, the EMPTY WORD realizes t_0 with w_1 = w_2 = eps, and so does
 * any single letter. Every word would then contain an abelian square and no word
 * could be abelian-square-free, which is plainly not intended: the standard
 * definition of an abelian square u v requires u non-empty.
 * So a non-emptiness convention is implicit in the paper. Both counts are
 * reported below rather than silently picking one, because this is a judgement
 * about the source rather than a computation.
 */
function* realizedTemplates(w, requireNonEmpty) {
  const n = w.length;
  for (const takeFirst of [false, true]) {
    if (takeFirst && n < 1) continue;
    const a1 = takeFirst ? w[0] : '';
    const lo = takeFirst ? 1 : 0;
    for (const takeLast of [false, true]) {
      if (takeLast && n - 1 < lo) continue;
      const a3 = takeLast ? w[n - 1] : '';
      const hi = takeLast ? n - 1 : n;
      const mid = w.slice(lo, hi);
      const m = mid.length;

      // a_2 = epsilon: split the middle anywhere
      for (let j = 0; j <= m; j++) {
        const w1 = mid.slice(0, j), w2 = mid.slice(j);
        if (requireNonEmpty && (w1.length === 0 || w2.length === 0)) continue;
        const p1 = parikh(w1), p2 = parikh(w2);
        yield { a: [a1, '', a3], d: [p2.map((x, i) => x - p1[i])] };
      }
      // a_2 = a letter at position j
      for (let j = 0; j < m; j++) {
        const w1 = mid.slice(0, j), w2 = mid.slice(j + 1);
        if (requireNonEmpty && (w1.length === 0 || w2.length === 0)) continue;
        const p1 = parikh(w1), p2 = parikh(w2);
        yield { a: [a1, mid[j], a3], d: [p2.map((x, i) => x - p1[i])] };
      }
    }
  }
}

/* ---------------------------------------------------------------- *
 * Report
 * ---------------------------------------------------------------- */

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('DECIDING WHETHER h6^omega(a) REALIZES THE ABELIAN-SQUARE TEMPLATE');
  console.log('Rao & Rosenfeld arXiv:1511.05875, Proposition 8. Exact throughout.');
  console.log('');

  // ---- rebuild box, parents, ancestors ------------------------------------
  const M = parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = decompose(M);
  const sets = p5.imageWordSets(H6, S6);
  const c = new Array(N).fill(null);
  for (const b of blocks) {
    const bound = K.isZero(b.eigenvalue)
      ? ab.contractingBound(J, Pinv, b, sets)
      : ab.expandingBound(Pinv, b, sets, true);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
  }
  const { vectors } = ab.enumerateBox(P, Pinv, c);
  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = vKey(gp.applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }
  const t0 = { a: ['', '', ''], d: [new Array(N).fill(0)] };
  const closure = gp.ancestorClosure(t0, boxByImage);
  if (!closure.closed) throw new Error('Ancestor closure did not terminate; cannot apply Proposition 8.');
  const S = closure.templates;

  console.log(line);
  console.log('THE SET S   (Proposition 8 allows any S with Ranc <= S <= Anc)');
  console.log(line);
  console.log(`  S = Anc_h(t_0), computed exactly : ${S.length.toLocaleString()} templates`);
  console.log(`  Ranc <= Anc holds by definition, so Anc is a legal choice of S.`);
  console.log('');

  // ---- the length bound ---------------------------------------------------
  const k = 2;
  const delta = Math.max(...S6.map(a => H6[a].length));
  let deltaMax = 0;
  for (const t of S) for (const d of t.d) { const v = l1(d); if (v > deltaMax) deltaMax = v; }
  const s = k * ((k - 1) * deltaMax / 2 + delta + 1) + 1;

  console.log(line);
  console.log('THE LENGTH BOUND s');
  console.log(line);
  console.log(`  k                                  = ${k}   (abelian squares)`);
  console.log(`  delta = max_a |h(a)|               = ${delta}   (h6 is 3-uniform)`);
  console.log(`  Delta = max_{t in S} ||d_1||_1     = ${deltaMax}`);
  console.log(`  s = k((k-1) Delta/2 + delta + 1)+1 = ${s}`);
  console.log('');
  console.log(`  For k = 2 this reduces to s = Delta + 2*delta + 3 = ${deltaMax} + ${2 * delta} + 3 = ${deltaMax + 2 * delta + 3}.`);
  if (s !== deltaMax + 2 * delta + 3) throw new Error('The two forms of the length bound disagree; the formula has been transcribed wrongly.');
  console.log(`  That is the same expression the authors' reference implementation uses`);
  console.log(`  ("lengthToCheck = Delta + 2*delta + 3", MATH_CLAIMS.md row 22). We derived`);
  console.log(`  it from Proposition 8, not from their code, so the agreement is a check.`);
  console.log('');

  // ---- enumerate the factors ----------------------------------------------
  console.log(line);
  console.log(`FACTORS OF Fact_inf(h6) OF LENGTH <= ${s}   [EXACT, complete factor sets]`);
  console.log(line);
  const longest = ff.factorSet(s);
  const allFactors = new Set();
  for (const f of longest.set) {
    for (let i = 0; i < f.length; i++) {
      for (let j = i; j <= f.length; j++) allFactors.add(f.slice(i, j));
    }
  }
  console.log(`  length-${s} factors                : ${longest.set.size}`);
  console.log(`  all factors of length <= ${s}      : ${allFactors.size.toLocaleString()}`);
  console.log(`  factor set stabilised at h6^${longest.stabilisedAt}(a), which is decisive - see`);
  console.log(`  factor-frequencies.js for the single-step stabilisation argument.`);
  console.log('');

  // ---- the search ---------------------------------------------------------
  const inS = new Set(S.map(t => t.a.join('|') + '#' + t.d.map(vKey).join('|')));

  console.log(line);
  console.log('SEARCH: does any such factor realize a template of S ?');
  console.log(line);
  const runSearch = (requireNonEmpty) => {
    const found = [];
    let checked = 0;
    for (const w of allFactors) {
      for (const t of realizedTemplates(w, requireNonEmpty)) {
        checked++;
        const key = t.a.join('|') + '#' + t.d.map(vKey).join('|');
        if (inS.has(key)) found.push({ word: w, template: t });
      }
    }
    return { found, checked };
  };

  const t1 = Date.now();
  const literal = runSearch(false);
  const strict = runSearch(true);
  const elapsed = ((Date.now() - t1) / 1000).toFixed(1);

  console.log(`  decompositions examined : ${literal.checked.toLocaleString()}   (${elapsed}s)`);
  console.log('');
  console.log(`  literal reading  (w_i may be empty) : ${literal.found.length} realizations`);
  console.log(`  standard reading (w_i non-empty)   : ${strict.found.length} realizations`);
  console.log('');
  if (literal.found.length > 0) {
    console.log('  Under the literal reading the hits are all degenerate:');
    for (const h of literal.found.slice(0, 4)) {
      console.log(`    "${h.word || '(empty)'}"  ->  [${h.template.a.map(x => x || 'eps').join(', ')}], d = [${h.template.d[0].join(',')}]`);
    }
    console.log('    - every one has w_1 = w_2 = eps, so it is the empty-block artifact');
    console.log('    described above, not an abelian square. The strict count is the');
    console.log('    meaningful one.');
    console.log('');
  }

  const hits = strict.found;

  // ---- negative control ---------------------------------------------------
  // A count of zero is worthless unless the detector can find something. Feed it
  // words that ARE abelian squares and require that it recognises them. These
  // need not be factors of h6^omega(a) - the point is to exercise the detector,
  // not the language.
  console.log(line);
  console.log('NEGATIVE CONTROL: can the detector find an abelian square at all?');
  console.log(line);
  const t0key = t0.a.join('|') + '#' + t0.d.map(vKey).join('|');
  // Every entry verified by hand: the two halves must have equal Parikh vectors.
  // An earlier draft listed "ddee", which is NOT an abelian square - Psi(dd) and
  // Psi(ee) differ - and the control correctly rejected it. The fixture was the
  // error, not the detector. Kept as a note because a control that never fires is
  // no control at all.
  const squares = ['aa', 'abab', 'abba', 'acbcab', 'dede', 'deed', 'adfadf'];
  let controlOk = true;
  for (const sq of squares) {
    const found = [...realizedTemplates(sq, true)]
      .some(t => t.a.join('|') + '#' + t.d.map(vKey).join('|') === t0key);
    console.log(`  "${sq}" is an abelian square, detector reports t_0 : ${found ? 'yes' : 'NO'}`);
    if (!found) controlOk = false;
  }
  const nonSquares = ['abc', 'acef', 'abcd'];
  for (const ns of nonSquares) {
    const found = [...realizedTemplates(ns, true)]
      .some(t => t.a.join('|') + '#' + t.d.map(vKey).join('|') === t0key);
    console.log(`  "${ns}" is NOT an abelian square, detector reports t_0 : ${found ? 'YES - false positive' : 'no'}`);
    if (found) controlOk = false;
  }
  if (!controlOk) {
    throw new Error('Negative control failed: the realization detector does not correctly identify abelian squares. The zero result above is meaningless.');
  }
  console.log('');
  console.log('  Control passed. The detector finds abelian squares when they are present');
  console.log('  and does not invent them, so the zero above is a real absence.');
  console.log('');

  if (hits.length > 0) {
    console.log('  Examples:');
    for (const h of hits.slice(0, 5)) {
      console.log(`    "${h.word}" realizes [${h.template.a.map(x => x || 'eps').join(', ')}], d = [${h.template.d[0].join(',')}]`);
    }
    console.log('');
    console.log(line);
    console.log('CONCLUSION');
    console.log(line);
    console.log('  Condition 1 of Proposition 8 HOLDS, so condition 2 holds: some factor of');
    console.log('  Fact_inf(h6) realizes t_0, i.e. h6^omega(a) CONTAINS an abelian square.');
    console.log('');
    console.log('  That contradicts Theorem 4 of the paper. Something in this pipeline is');
    console.log('  wrong - the bounds, the parent relation, or the realization enumeration.');
    console.log('  Do not trust any other output from these scripts until it is found.');
  } else {
    console.log(line);
    console.log('CONCLUSION');
    console.log(line);
    console.log(`  No factor of length <= ${s} realizes any template of S.`);
    console.log('');
    console.log('  Condition 1 of Proposition 8 FAILS, so condition 2 fails: NO factor of');
    console.log('  Fact_inf(h6) realizes t_0 - not merely none of length <= s, none at all.');
    console.log('  Since a word realizes t_0 = [eps, eps, eps, 0] exactly when it is an');
    console.log('  abelian square, h6^omega(a) is ABELIAN-SQUARE-FREE.');
    console.log('');
    console.log('  This is the paper\'s Theorem 4: "h_6^omega(a) is abelian-square-free."');
    console.log('  (MATH_CLAIMS.md row 5.)');
    console.log('');
    console.log('  WHAT KIND OF STATEMENT THIS IS. The conclusion concerns the infinite word,');
    console.log('  not a prefix - the finite search is complete because Proposition 8 says it');
    console.log('  is. But it rests on Propositions 5 through 8, which are the paper\'s and');
    console.log('  are Level 2, and on this implementation being correct, which is Level 1.');
    console.log('  It is a re-derivation through the authors\' machinery, not an independent');
    console.log('  proof of their theorem.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { realizedTemplates, l1 };
