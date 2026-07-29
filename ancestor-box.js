'use strict';

/**
 * ancestor-box.js
 * ---------------
 * The finite box that confines every realizable ancestor of the abelian-square
 * template, computed exactly for (h6, g3).
 *
 * This closes the bounding half of Rao & Rosenfeld's decision procedure
 * (arXiv:1511.05875). Proposition 5 bounds the contracting coordinates,
 * Proposition 6 bounds the expanding ones; together they give a bounded region,
 * and because the columns of P are a basis, only finitely many integer vectors
 * lie inside. That finite set is the search space getParents() has to walk.
 *
 * DEFINITIONS, quoted verbatim (ar5iv rendering, read 2026-07-28)
 * ---------------------------------------------------------------
 * Template:
 *   "A k-template is a (2k)-tuple t = [a_1, ..., a_{k+1}, d_1, ..., d_{k-1}]
 *    where a_i in Sigma union {epsilon} and d_i in Z^n. A word
 *    w = a_1 w_1 a_2 w_2 ... w_k a_{k+1} ... is a realization of ... t if for all
 *    i in {1,...,k-1}, Psi(w_{i+1}) - Psi(w_i) = d_i."
 *
 * The target:
 *   "A word is then an abelian k-th power if and only if it realizes the
 *    k-template [epsilon, ..., epsilon, 0, ..., 0]."
 *
 * So for abelian SQUARES, k = 2 and the template is t_0 = [eps, eps, eps, 0].
 * Its only vector is the zero vector - which kills a whole term of the bound
 * below, and is why the abelian-square case is cheaper than a general template.
 *
 * Why the box decides anything:
 *   "a template t is realized by a word from Fact_inf(h) if and only if
 *    Ranc_h(t) is not empty."
 *
 * PROPOSITION 6, verbatim:
 *   "For every i such that |lambda_{b(i)}| > 1, for every template t_0,
 *    { |r_i(x)| : x in X_{t_0} } is bounded."
 *
 * Its proof rearranges the same desubstitution used in Proposition 5 and then
 * notes "we know that B(i) is invertible", so
 *
 *   r(x)[block] = B^{-l} r(x_0)[block] + sum_{m=1..l} B^{-m} r(...)[block]
 *
 * and the series converges because |lambda| > 1 makes ||B^{-m}|| decay.
 *
 * THE SHAPE OF OUR CASE
 * ---------------------
 * Every expanding block of M_h is 1x1 - the eigenvalues 3, +sqrt(3), -sqrt(3)
 * are simple (MATH_CLAIMS.md row 25). So ||B^{-m}|| = |lambda|^{-m} exactly and
 *
 *   sum_{m>=1} |lambda|^{-m} = 1 / (|lambda| - 1)
 *
 * in closed form, with no polynomial correction from Jordan nilpotents. For
 * lambda = 3 that is 1/2; for |lambda| = sqrt(3) it is 1/(sqrt(3)-1) =
 * (sqrt(3)+1)/2, which stays inside Q(sqrt(3)). The whole bound is therefore an
 * exact field element. A larger expanding block would need the polynomial factor
 * and this file refuses to run rather than pretend otherwise.
 *
 * SCOPE
 * -----
 * Upper bounds, not least ones, and a SUPERSET of the realizable ancestors -
 * which is exactly what the procedure needs, since a superset that is finite is
 * what makes enumeration terminate. Level 1 (COMPUTED): Propositions 5 and 6 are
 * Level 2 (MATH_CLAIMS.md rows 7b, 29), the arithmetic here is ours.
 *
 * Usage:  node ancestor-box.js
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const { K, matMulK, identityK, parikhMatrixK, decompose } = jd;
const { kAbs, kGt, kNum, imageWordSets, psi } = p5;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

/* ---------------------------------------------------------------- *
 * Helpers
 * ---------------------------------------------------------------- */

/** |lambda| as an exact element of Q(sqrt(3)). */
const kModulus = (lam) => (p5.kSign(lam) < 0 ? K.neg(lam) : lam);

/** Row-sum operator norm, exact. */
function normInf(M) {
  let best = K.zero;
  for (const row of M) {
    let s = K.zero;
    for (const v of row) s = K.add(s, kAbs(v));
    if (kGt(s, best)) best = s;
  }
  return best;
}

/** r(v) = P^{-1} v, the coordinates of v in the Jordan basis. */
const coords = (Pinv, v) => Pinv.map(row => row.reduce((s, x, j) => K.add(s, K.mul(x, v[j])), K.zero));

const pad = (s, n) => String(s).padEnd(n);

/* ---------------------------------------------------------------- *
 * The two halves of the bound
 * ---------------------------------------------------------------- */

/** Proposition 5: contracting coordinates. Nilpotent here, so a finite sum. */
function contractingBound(J, Pinv, block, sets) {
  const B = Array.from({ length: block.size }, (_, r) =>
    Array.from({ length: block.size }, (_, c) => J[block.start + r][block.start + c]));

  const powers = [identityK(block.size)];
  let cur = identityK(block.size);
  let nil = null;
  for (let j = 1; j <= block.size + 1; j++) {
    cur = matMulK(cur, B);
    if (cur.every(r => r.every(v => K.isZero(v)))) { nil = j; break; }
    powers.push(cur.map(r => r.slice()));
  }
  if (nil === null) throw new Error(`Contracting block at ${block.start} is not nilpotent; the finite-sum form does not apply.`);

  let sumN = K.zero, maxN = K.zero;
  for (const Pw of powers) {
    const n = normInf(Pw);
    sumN = K.add(sumN, n);
    if (kGt(n, maxN)) maxN = n;
  }

  const blockCoord = (w) => coords(Pinv, psi(w)).slice(block.start, block.start + block.size);
  const maxOver = (words) => {
    let best = K.zero;
    for (const w of words) for (const c of blockCoord(w)) { const a = kAbs(c); if (kGt(a, best)) best = a; }
    return best;
  };
  const pairs = [];
  for (const s of sets.suffixes) for (const p of sets.prefixes) pairs.push(s + p);

  return K.add(K.mul(sumN, maxOver(pairs)), K.mul(maxN, maxOver(sets.factors)));
}

/**
 * Proposition 6: expanding coordinates.
 *
 *   |r_i(x)| <= ||B^{-l}|| * |r_i(x_0)| + ( sum_{m>=1} ||B^{-m}|| ) * D_i
 *
 * with D_i the largest |r_i(Psi(s'p') - Psi(sp))| over the finite word sets.
 * For t_0 = [eps,eps,eps,0] the only vector is zero, so the first term vanishes.
 * ||B^{-l}|| <= 1 for all l >= 0 anyway, since |lambda| > 1.
 */
function expandingBound(Pinv, block, sets, x0IsZero) {
  if (block.size !== 1) {
    throw new Error(`Expanding block at ${block.start} has size ${block.size}. The closed form sum_{m>=1} |lambda|^-m = 1/(|lambda|-1) is only valid for 1x1 blocks; a larger block needs the polynomial correction from the Jordan nilpotent part. Refusing to return a bound that has not been derived.`);
  }
  const lam = block.eigenvalue;
  const mod = kModulus(lam);
  const denom = K.sub(mod, K.one);
  if (p5.kSign(denom) <= 0) throw new Error(`|lambda| = ${K.str(mod)} is not > 1 for an expanding block.`);
  const geom = K.div(K.one, denom);      // sum_{m>=1} |lambda|^{-m}

  const i = block.start;
  const rowCoord = (w) => coords(Pinv, psi(w))[i];
  const pairs = [];
  for (const s of sets.suffixes) for (const p of sets.prefixes) pairs.push(s + p);

  // D_i = max |r_i(u) - r_i(v)| over the pair set = (max r_i) - (min r_i)
  let hi = null, lo = null;
  for (const w of pairs) {
    const c = rowCoord(w);
    if (hi === null || kGt(c, hi)) hi = c;
    if (lo === null || kGt(lo, c)) lo = c;
  }
  const D = K.sub(hi, lo);

  const bound = K.mul(geom, D);
  return x0IsZero ? bound : K.add(bound, K.one);  // ||B^{-l}|| <= 1 times |r_i(x_0)|
}

/* ---------------------------------------------------------------- *
 * Enumerating the box
 * ---------------------------------------------------------------- */

/**
 * All integer vectors x in Z^6 with |r_i(x)| <= c_i for every i.
 *
 * Bounded because P is a basis: |x_j| <= sum_i |P_{ji}| c_i gives an explicit
 * integer search range, and every candidate is then filtered by the exact
 * per-coordinate test. No floating point decides membership.
 */
function enumerateBox(P, Pinv, c) {
  const n = P.length;
  const ranges = [];
  for (let j = 0; j < n; j++) {
    let b = K.zero;
    for (let i = 0; i < n; i++) b = K.add(b, K.mul(kAbs(P[j][i]), c[i]));
    ranges.push(Math.floor(kNum(b) + 1e-9));
  }

  // The bounding box of a parallelepiped is far larger than the parallelepiped,
  // so enumerating (2R+1)^6 raw points does not terminate in reasonable time.
  // Prune with interval arithmetic: after fixing a prefix of x, bound the range
  // each r_i can still reach and drop the branch when it cannot come back inside
  // [-c_i, c_i].
  //
  // Pruning uses float64 with a safety margin so it can only ever be too
  // permissive, never too aggressive - a wrongly kept branch costs time, a
  // wrongly pruned one would lose a vector. Acceptance is decided exactly.
  const EPS = 1e-9;
  const PinvNum = Pinv.map(row => row.map(kNum));
  const cNum = c.map(kNum);
  // tail[i][j] = sum over columns >= j of |Pinv[i][col]| * range[col]
  const tail = PinvNum.map(row => {
    const t = new Array(n + 1).fill(0);
    for (let j = n - 1; j >= 0; j--) t[j] = t[j + 1] + Math.abs(row[j]) * ranges[j];
    return t;
  });

  const out = [];
  const x = new Array(n).fill(0);
  const partial = new Array(n).fill(0);   // partial[i] = sum_{j fixed} Pinv[i][j] x_j

  const inBoxExact = () => {
    const v = x.map(q => K.fromInt(BigInt(q)));
    const r = coords(Pinv, v);
    for (let i = 0; i < n; i++) if (kGt(kAbs(r[i]), c[i])) return false;
    return true;
  };

  let visited = 0;
  const rec = (j) => {
    if (j === n) { visited++; if (inBoxExact()) out.push([...x]); return; }
    for (let val = -ranges[j]; val <= ranges[j]; val++) {
      x[j] = val;
      const saved = partial.slice();
      let feasible = true;
      for (let i = 0; i < n; i++) {
        partial[i] += PinvNum[i][j] * val;
        if (Math.abs(partial[i]) - tail[i][j + 1] > cNum[i] + EPS) { feasible = false; }
      }
      if (feasible) rec(j + 1);
      for (let i = 0; i < n; i++) partial[i] = saved[i];
    }
    x[j] = 0;
  };
  rec(0);
  return { vectors: out, ranges, visited };
}

/* ---------------------------------------------------------------- *
 * Report
 * ---------------------------------------------------------------- */

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('THE FINITE ANCESTOR BOX FOR THE ABELIAN-SQUARE TEMPLATE');
  console.log('Rao & Rosenfeld arXiv:1511.05875, Propositions 5 and 6. Exact Q(sqrt(3)).');
  console.log('');

  const M = parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = decompose(M);
  const sets = imageWordSets(H6, S6);

  console.log(line);
  console.log('TARGET TEMPLATE');
  console.log(line);
  console.log('  Abelian squares are k = 2, so t_0 = [eps, eps, eps, 0].');
  console.log('  Its only vector is the zero vector, which removes the |r_i(x_0)| term');
  console.log('  from the Proposition 6 bound. A general template would carry it.');
  console.log('');

  const c = new Array(6).fill(null);
  console.log(line);
  console.log('PER-COORDINATE BOUNDS c_i   [EXACT]');
  console.log(line);
  console.log('   i   eigenvalue   block   side          c_i                 decimal');
  for (const b of blocks) {
    const contracting = K.isZero(b.eigenvalue);
    const bound = contracting
      ? contractingBound(J, Pinv, b, sets)
      : expandingBound(Pinv, b, sets, true);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
    for (let i = b.start; i < b.start + b.size; i++) {
      console.log(`  ${pad(i, 4)} ${pad(b.name, 12)} ${pad(b.size, 7)} ${pad(contracting ? 'contracting' : 'expanding', 13)} ${pad(K.str(bound), 18)} ${kNum(bound).toFixed(6)}`);
    }
  }
  console.log('');
  console.log('  contracting: Proposition 5, nilpotent blocks, finite sum I + B');
  console.log('  expanding  : Proposition 6, 1x1 blocks, sum_{m>=1} |lambda|^-m = 1/(|lambda|-1)');
  console.log('               = 1/2 for lambda = 3, and (sqrt(3)+1)/2 for |lambda| = sqrt(3)');
  console.log('');

  console.log(line);
  console.log('THE BOX   [EXACT membership test, no floating point]');
  console.log(line);
  const { vectors, ranges } = enumerateBox(P, Pinv, c);
  console.log(`  coordinate search ranges from |x_j| <= sum_i |P_ji| c_i : [${ranges.join(', ')}]`);
  console.log(`  integer vectors x in Z^6 satisfying |r_i(x)| <= c_i for all i : ${vectors.length}`);
  console.log('');
  if (vectors.length <= 40) {
    for (const v of vectors) console.log('    [' + v.map(q => String(q).padStart(3)).join(' ') + ' ]');
  } else {
    for (const v of vectors.slice(0, 12)) console.log('    [' + v.map(q => String(q).padStart(3)).join(' ') + ' ]');
    console.log(`    ... and ${vectors.length - 12} more`);
  }
  console.log('');

  // sanity: the zero vector must be in the box, since t_0 itself is an ancestor of itself
  const hasZero = vectors.some(v => v.every(q => q === 0));
  if (!hasZero) throw new Error('The zero vector is not in the box, but t_0 = [eps,eps,eps,0] carries it. The bound is wrong.');
  console.log(`  zero vector present: yes  (required - t_0 itself carries it)`);
  console.log('');

  console.log(line);
  console.log('WHAT THIS IS');
  console.log(line);
  console.log(`  A finite SUPERSET of the vectors that can appear on a realizable ancestor`);
  console.log(`  of t_0. Finiteness is the whole point: "a template t is realized by a word`);
  console.log(`  from Fact_inf(h) if and only if Ranc_h(t) is not empty", and the ancestor`);
  console.log(`  walk can only be decided if the region it lives in is finite.`);
  console.log('');
  console.log(`  ${vectors.length} candidate vectors is the search space getParents() must walk,`);
  console.log(`  not the answer. Membership here does NOT mean a vector is realizable - most`);
  console.log(`  will not be. Deciding that is the remaining work.`);
  console.log('');
  console.log('  These are upper bounds, not least ones (MATH_CLAIMS.md rows 29, 30). A');
  console.log('  tighter bound would shrink this set; a loose one only costs time.');
  console.log('');
  console.log('  NOT A COMPARISON WITH THE PAPER. arXiv:1511.05875 reports that a certain');
  console.log('  template "has at most 16214 parents by g3 realizable by h6". That counts');
  console.log('  PARENTS THROUGH g3 of one template, after a realizability filter. What is');
  console.log('  counted here is the box of candidate VECTORS for ancestors under h6,');
  console.log('  before any realizability test. The two numbers measure different things');
  console.log('  and should not be expected to agree. Treating 16214 as a target for this');
  console.log('  figure would be a category error.');
  console.log('');
  console.log('  NOT DONE: getParents() itself, and the comparison against actual factors.');
  console.log('');
}

if (require.main === module) main();

module.exports = { contractingBound, expandingBound, enumerateBox, normInf, coords, kModulus };
