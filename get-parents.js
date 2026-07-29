'use strict';

/**
 * get-parents.js
 * --------------
 * Par_h(t) and the ancestor closure Anc_h(t), computed exactly for h6.
 *
 * DEFINITION, verbatim (arXiv:1511.05875, ar5iv rendering read 2026-07-28)
 * -----------------------------------------------------------------------
 *   "We say that t' is a parent by h of t if there are p_1, s_1, ..., p_{k+1},
 *    s_{k+1} in Sigma* such that:
 *      - for all i in {1,...,k+1},  h(a'_i) = p_i a_i s_i,
 *      - for all i in {1,...,k-1},  d_i = M_h d'_i + Psi(s_{i+1} p_{i+2})
 *                                          - Psi(s_i p_{i+1})."
 *
 *   "Note that, by definition, for any t' in Par_h(t) if t' is realizable by h
 *    then t is realizable by h."
 *
 *   "A template t is an ancestor of a template t' if there exists n >= 1 and a
 *    sequence of templates t' = t_1, t_2, ..., t_n = t such that for any i,
 *    t_{i+1} is a parent of t_i."
 *
 * WHY THE BOX IS NOT OPTIONAL
 * ---------------------------
 * Reading the second condition backwards to find d'_i means solving
 *
 *     M_h d'_i = d_i - Psi(s_{i+1} p_{i+2}) + Psi(s_i p_{i+1})
 *
 * over the integers. M_h is SINGULAR here, so the solution set is either empty or
 * an entire coset of the integer kernel: infinitely many d'_i satisfy the
 * equation. What makes Par_h(t) finite is intersecting that coset with the
 * Proposition 5 / Proposition 6 box (MATH_CLAIMS.md row 30). Without the box this
 * function would not terminate, and that is precisely the role the box plays in
 * the paper's argument.
 *
 * The kernel is 2-dimensional, not 3. Eigenvalue 0 has ALGEBRAIC multiplicity 3
 * but GEOMETRIC multiplicity 2, because the block structure is J_2(0) + J_1(0)
 * (MATH_CLAIMS.md row 25), and dim ker(M_h) is the geometric multiplicity. So
 * rank(M_h) = 4. A first draft of this comment said 3, conflating the two
 * multiplicities - the exact distinction row 25 exists to record. The runtime
 * computes the rank from the Smith normal form rather than trusting any comment.
 *
 * HOW THE SOLVING IS DONE
 * -----------------------
 * The box is already enumerated exactly (125,931 vectors). Rather than solving
 * each system separately, the box is indexed once by its image under M_h. Then
 * "all d' in the box with M_h d' = v" is a single hash lookup, and it is exact by
 * construction: every candidate came from the box and satisfies the equation by
 * the key it was filed under. No integer solver is invoked in the inner loop.
 *
 * SCOPE
 * -----
 * This computes parents and the ancestor closure. It does NOT decide
 * realizability - membership in Anc_h(t) does not mean a template is realized by
 * an actual factor. Deciding that is the remaining step of the procedure, and
 * the paper handles it under "Comparing to the factors". Level 1 (COMPUTED):
 * the definitions are Level 2, the arithmetic is ours.
 *
 * Usage:  node get-parents.js
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const ab = require('./ancestor-box.js');
const { K, parikhMatrixK, decompose } = jd;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
const N = 6;

/* ---------------------------------------------------------------- *
 * Integer helpers
 * ---------------------------------------------------------------- */

/** M[j][i] = |h(i)|_j, integers. */
const MH = S6.map(y => S6.map(x => {
  let n = 0;
  for (const ch of H6[x]) if (ch === y) n++;
  return n;
}));

const applyMH = (v) => MH.map(row => row.reduce((s, m, j) => s + m * v[j], 0));

const parikh = (w) => {
  const v = new Array(N).fill(0);
  for (const ch of w) v[S6.indexOf(ch)]++;
  return v;
};

const vAdd = (a, b) => a.map((x, i) => x + b[i]);
const vSub = (a, b) => a.map((x, i) => x - b[i]);
const vKey = (v) => v.join(',');

/* ---------------------------------------------------------------- *
 * The (a', p, s) options for one template position
 * ---------------------------------------------------------------- *
 * We need every way to write h(a') = p . a . s.
 *
 *  - a' = epsilon gives h(a') = epsilon, which forces a = epsilon and p = s = eps.
 *  - a = epsilon and a' a letter: any split of h(a') into p . s.
 *  - a a letter and a' a letter: any position of h(a') carrying that letter.
 */
function positionOptions(a) {
  const out = [];
  if (a === '') {
    out.push({ aPrime: '', p: '', s: '' });
    for (const x of S6) {
      const img = H6[x];
      for (let j = 0; j <= img.length; j++) {
        out.push({ aPrime: x, p: img.slice(0, j), s: img.slice(j) });
      }
    }
  } else {
    for (const x of S6) {
      const img = H6[x];
      for (let j = 0; j < img.length; j++) {
        if (img[j] === a) out.push({ aPrime: x, p: img.slice(0, j), s: img.slice(j + 1) });
      }
    }
  }
  return out;
}

/* ---------------------------------------------------------------- *
 * Parents
 * ---------------------------------------------------------------- */

/**
 * @param {{a: string[], d: number[][]}} t   k-template: k+1 letters, k-1 vectors
 * @param {Map<string, number[][]>} boxByImage  M_h x -> list of x, over the box
 * @returns {Array} deduplicated parent templates
 */
function getParents(t, boxByImage) {
  const k = t.a.length - 1;
  const optionsPerPosition = t.a.map(positionOptions);
  const parents = new Map();

  const choice = new Array(t.a.length);

  const recurse = (idx) => {
    if (idx < t.a.length) {
      for (const opt of optionsPerPosition[idx]) {
        choice[idx] = opt;
        recurse(idx + 1);
      }
      return;
    }

    // all p_i, s_i fixed; solve for each d'_i
    const dPrimeChoices = [];
    for (let i = 0; i < k - 1; i++) {
      // paper indices are 1-based: d_i = M_h d'_i + Psi(s_{i+1} p_{i+2}) - Psi(s_i p_{i+1})
      const s_i = choice[i].s, p_i1 = choice[i + 1].p;
      const s_i1 = choice[i + 1].s, p_i2 = choice[i + 2].p;
      const v = vAdd(vSub(t.d[i], parikh(s_i1 + p_i2)), parikh(s_i + p_i1));
      const sols = boxByImage.get(vKey(v));
      if (!sols || sols.length === 0) return;      // no d'_i inside the box
      dPrimeChoices.push(sols);
    }

    // cartesian product over the d'_i (for k = 2 there is exactly one)
    const emit = (i, acc) => {
      if (i === dPrimeChoices.length) {
        const aPrime = choice.map(c => c.aPrime);
        const key = aPrime.join('|') + '#' + acc.map(vKey).join('|');
        if (!parents.has(key)) parents.set(key, { a: aPrime, d: acc.map(v => v.slice()) });
        return;
      }
      for (const d of dPrimeChoices[i]) emit(i + 1, [...acc, d]);
    };
    emit(0, []);
  };

  recurse(0);
  return [...parents.values()];
}

/** Ancestor closure: repeatedly take parents until nothing new appears. */
function ancestorClosure(t0, boxByImage, maxRounds = 50) {
  const key = (t) => t.a.join('|') + '#' + t.d.map(vKey).join('|');
  const seen = new Map([[key(t0), t0]]);
  let frontier = [t0];
  const rounds = [];

  for (let round = 1; round <= maxRounds; round++) {
    const next = [];
    for (const t of frontier) {
      for (const p of getParents(t, boxByImage)) {
        const kp = key(p);
        if (!seen.has(kp)) { seen.set(kp, p); next.push(p); }
      }
    }
    rounds.push({ round, discovered: next.length, total: seen.size });
    if (next.length === 0) return { templates: [...seen.values()], rounds, closed: true };
    frontier = next;
  }
  return { templates: [...seen.values()], rounds, closed: false };
}

/* ---------------------------------------------------------------- *
 * Report
 * ---------------------------------------------------------------- */

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('PARENTS AND ANCESTORS OF THE ABELIAN-SQUARE TEMPLATE');
  console.log('Rao & Rosenfeld arXiv:1511.05875. Exact integer arithmetic.');
  console.log('');

  // ---- rebuild the box -----------------------------------------------------
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

  console.log(line);
  console.log('SETUP');
  console.log(line);
  console.log(`  box size (MATH_CLAIMS.md row 30)      : ${vectors.length.toLocaleString()} integer vectors`);

  // rank of M_h decides how many solutions each equation has
  const smith = require('./smith-normal-form.js');
  const MHbig = MH.map(r => r.map(v => BigInt(v)));
  const snf = smith.smithNormalForm(MHbig);
  console.log(`  rank(M_h)                             : ${snf.rank} of ${N}`);
  console.log(`  dim ker(M_h)                          : ${N - snf.rank}`);
  console.log(`  invariant factors of M_h              : [${snf.invariantFactors.join(', ')}]`);
  console.log('');
  console.log('  M_h is singular, so M_h d\' = v has either no solution or a whole');
  console.log(`  ${N - snf.rank}-dimensional lattice of them. Par_h(t) is finite only because the`);
  console.log('  box confines d\'. That is what the box is for.');
  console.log('');
  console.log(`  Note dim ker = ${N - snf.rank}, not 3: eigenvalue 0 has algebraic multiplicity 3 but`);
  console.log('  geometric multiplicity 2, since its blocks are J_2(0) + J_1(0) (row 25).');
  console.log('');

  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = vKey(applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }
  console.log(`  distinct images M_h x over the box     : ${boxByImage.size.toLocaleString()}`);
  let maxFib = 0;
  for (const arr of boxByImage.values()) if (arr.length > maxFib) maxFib = arr.length;
  console.log(`  largest fibre (vectors sharing an image): ${maxFib}`);
  console.log('');

  // ---- the target ----------------------------------------------------------
  const t0 = { a: ['', '', ''], d: [new Array(N).fill(0)] };
  console.log(line);
  console.log('TARGET  t_0 = [eps, eps, eps, 0]   (k = 2, i.e. abelian squares)');
  console.log(line);
  const opts = positionOptions('');
  console.log(`  ways to write h(a') = p . eps . s per position: ${opts.length}`);
  console.log(`  combinations over the ${t0.a.length} positions              : ${Math.pow(opts.length, t0.a.length).toLocaleString()}`);
  console.log('');

  const t1 = Date.now();
  const parents = getParents(t0, boxByImage);
  console.log(`  |Par_h(t_0)| = ${parents.length.toLocaleString()}   (${Date.now() - t1} ms)`);
  console.log('');
  console.log('  first few parents (letters, then d\'_1):');
  for (const p of parents.slice(0, 8)) {
    console.log(`    [${p.a.map(x => x === '' ? 'eps' : x).join(', ')}]  d' = [${p.d[0].join(', ')}]`);
  }
  console.log('');

  // t_0 must be its own parent: taking a'_i = eps and all p, s empty reproduces it
  const selfKey = t0.a.join('|') + '#' + t0.d.map(vKey).join('|');
  const hasSelf = parents.some(p => p.a.join('|') + '#' + p.d.map(vKey).join('|') === selfKey);
  console.log(`  t_0 is among its own parents: ${hasSelf ? 'yes' : 'no'}` +
    `   (expected yes - a'_i = eps with empty p, s reproduces t_0)`);
  if (!hasSelf) throw new Error('t_0 is not among its own parents; the parent relation is implemented wrongly.');
  console.log('');

  // ---- the closure ---------------------------------------------------------
  console.log(line);
  console.log('ANCESTOR CLOSURE  Anc_h(t_0)');
  console.log(line);
  const t2 = Date.now();
  const closure = ancestorClosure(t0, boxByImage);
  console.log('  round   newly discovered   cumulative');
  for (const r of closure.rounds) {
    console.log(`  ${String(r.round).padStart(5)}   ${String(r.discovered).padStart(16)}   ${String(r.total).padStart(10)}`);
  }
  console.log('');
  if (closure.closed) {
    console.log(`  CLOSED after ${closure.rounds.length} rounds: |Anc_h(t_0)| = ${closure.templates.length.toLocaleString()}   (${((Date.now() - t2) / 1000).toFixed(1)}s)`);
  } else {
    console.log(`  NOT CLOSED within the round limit; ${closure.templates.length.toLocaleString()} templates so far.`);
  }
  console.log('');

  console.log(line);
  console.log('WHAT THIS IS AND IS NOT');
  console.log(line);
  console.log('  Anc_h(t_0) is the set of templates from which t_0 can be reached by');
  console.log('  repeated parenthood, restricted to the box. The paper\'s criterion is');
  console.log('    "a template t is realized by a word from Fact_inf(h) if and only if');
  console.log('     Ranc_h(t) is not empty"');
  console.log('  where Ranc is the REALIZABLE ancestors. This computes Anc, not Ranc.');
  console.log('');
  console.log('  Membership here does not mean a template is realized by any actual');
  console.log('  factor. Filtering Anc down to Ranc is the remaining step, and until it');
  console.log('  is done nothing here says anything about abelian-square-freeness.');
  console.log('');
}

if (require.main === module) main();

module.exports = { MH, applyMH, parikh, positionOptions, getParents, ancestorClosure, vKey };
