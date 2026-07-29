'use strict';

/**
 * proposition11-targets.js
 * ------------------------
 * The finite target set for squares modulo Phi, built by the construction
 * Proposition 11 actually specifies.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * An earlier attempt (verify-theorem6.js, retracted in MATH_CLAIMS.md row 43)
 * produced a target set by filtering the ancestor box of the template
 * [eps,eps,eps,0] for vectors with Phi(d) = 0. That box is a bound for a single
 * template with x_0 = 0 and is not valid for targets with d != 0, and ker(Phi)
 * over Z is an infinite lattice: in the cube |d_i| <= 6 alone, 741 integer
 * vectors satisfy Phi(d) = 0 while only 25 lie in the box. Selecting targets by
 * membership in that box assumed the answer.
 *
 * PROPOSITION 11, verbatim (arXiv:1511.05875 Sec 4.2, ar5iv, read 2026-07-29)
 * --------------------------------------------------------------------------
 *   "If M_h has no eigenvalue of absolute value 1 and E_e(M_h) INTERSECT ker(Phi)
 *    = {0} then one can compute a finite set of templates S such that each k-th
 *    power modulo Phi in Fact_inf(h) is a realization of a template in S.
 *
 *    Proof. One wants to compute the set S of all realizable templates
 *    t = [eps, ..., eps, d_1, ..., d_{k-1}] such that F_Phi d_i = 0. This set is
 *    finite, and we can compute a finite super-set of it exactly as in
 *    Proposition 9 using Smith normal form of F_Phi and Proposition 4 to bound
 *    the coefficients of the elements of the basis."
 *
 * with, from the same subsection: "Let the matrix F_Phi be such that for all w,
 * Phi(w) = F_Phi Psi(w)."
 *
 * THE CONSTRUCTION, AS IMPLEMENTED
 * --------------------------------
 *  1. Lambda = ker(F_Phi) INTERSECT Z^6, with an integer basis B from the Smith
 *     normal form (smith-normal-form.js). Every candidate d is d = B x for some
 *     integer coefficient vector x, so the search is over x, not over d.
 *
 *  2. A realizable d has its CONTRACTING coordinates bounded by Proposition 5 -
 *     these are the same c_i already computed in proposition5-bounds.js, and
 *     they apply to d because d = Psi(w_2) - Psi(w_1) is a difference of Parikh
 *     vectors of factors. Let Q be the rows of P^{-1} with |lambda| < 1, so
 *
 *         || Q B x ||^2 <= sum over contracting i of c_i^2  =:  c.
 *
 *  3. E_e(M_h) INTERSECT ker(Phi) = {0} forces QB to have full column rank, so
 *     QB is left-invertible and
 *
 *         || x || <= || (QB)^+ || * sqrt(c)
 *
 *     which bounds the coefficients and makes the candidate set finite.
 *
 * The paper reaches the same conclusion through Proposition 4, which bounds
 * ||Mx|| between the extreme eigenvalues of M*M. A pseudo-inverse norm is used
 * here instead because it avoids computing eigenvalues of a matrix over
 * Q(sqrt(3)) and gives a bound of the same kind. It may be looser; looseness only
 * enlarges the enumeration, exactly as with the boxes in ancestor-box.js.
 *
 * STATUS
 * ------
 * This builds the TARGET SET. Running the decision procedure on it - closure,
 * Proposition 8 length bound, factor comparison - is the next step and is NOT
 * done here. Nothing in this file establishes Theorem 6.
 *
 * Usage:  node proposition11-targets.js
 */

const pf = require('./perron-frobenius.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const ab = require('./ancestor-box.js');
const dp = require('./decision-preconditions.js');
const snf = require('./smith-normal-form.js');
const { H6 } = require('./morphisms.js');
const K = jd.K;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

/** Phi from arXiv:1511.05875 Sec 5.2, as F_Phi with Phi(w) = F_Phi Psi(w). */
const PHI_COLS = { a: [1, 0, 0], b: [1, 1, 1], c: [1, 2, 1], d: [1, 0, 1], e: [1, 2, 0], f: [1, 1, 0] };
const F_PHI = [0, 1, 2].map(r => S6.map(x => BigInt(PHI_COLS[x][r])));

const toQ = (M) => M.map(r => r.map(v => pf.fr(v)));
const kNum = p5.kNum;

/**
 * Finite superset of the target vectors d with F_Phi d = 0 that can occur on a
 * realizable template. Returns { targets, kernelBasis, radius, hypothesis }.
 */
function targetSet() {
  // ---- hypothesis of Proposition 11, checked not assumed ------------------
  const MH = dp.parikhMatrix(H6, S6, S6);
  let Q6 = toQ(MH);
  for (let i = 1; i < 6; i++) Q6 = dp.matMulQ(Q6, toQ(MH));
  const Ee = dp.columnSpaceQ(Q6);                       // = im(M_h^6), see row 21
  const kerPhiQ = pf.nullspaceQ(toQ(F_PHI));
  const inter = dp.intersectionQ(Ee, kerPhiQ, 6);
  if (inter.dim !== 0) {
    throw new Error(`E_e(M_h) INTERSECT ker(Phi) has dimension ${inter.dim}, not 0. Proposition 11 does not apply and no finite target set follows.`);
  }

  // ---- 1. integer kernel basis of F_Phi, via Smith normal form ------------
  const B = snf.integerKernelBasis(F_PHI);              // array of column vectors
  const kappa = B.length;
  if (kappa === 0) throw new Error('ker(F_Phi) is trivial; there are no non-zero targets.');

  // ---- 2. Proposition 5 bounds on the contracting coordinates -------------
  const M = jd.parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = jd.decompose(M);
  const sets = p5.imageWordSets(H6, S6);
  const contracting = [];
  for (const b of blocks) {
    if (!K.isZero(b.eigenvalue)) continue;
    const bound = ab.contractingBound(J, Pinv, b, sets);
    for (let i = b.start; i < b.start + b.size; i++) contracting.push({ i, bound });
  }
  // c = sum of squares of the contracting bounds
  let cSq = 0;
  for (const { bound } of contracting) cSq += Math.pow(kNum(bound), 2);

  // ---- 3. QB and its pseudo-inverse norm ---------------------------------
  // Q = the contracting rows of P^{-1}; QB is (#contracting) x kappa.
  const QB = contracting.map(({ i }) =>
    B.map(col => {
      let s = K.zero;
      for (let j = 0; j < 6; j++) s = K.add(s, K.mul(Pinv[i][j], K.fromInt(col[j])));
      return s;
    }));
  const QBnum = QB.map(r => r.map(kNum));

  // smallest singular value of QB, from the eigenvalues of (QB)^T (QB).
  // kappa is 3 here, so this is a 3x3 symmetric eigenproblem; solved via the
  // characteristic polynomial with a numeric root finder. The result is used
  // only to size the enumeration, and every candidate is re-tested exactly.
  const G = Array.from({ length: kappa }, (_, a) =>
    Array.from({ length: kappa }, (_, b2) =>
      QBnum.reduce((s, row) => s + row[a] * row[b2], 0)));
  const tr = G.reduce((s, r, i) => s + r[i], 0);
  const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const minor = (m, k) => {
    const idx = [0, 1, 2].filter(x => x !== k);
    return m[idx[0]][idx[0]] * m[idx[1]][idx[1]] - m[idx[0]][idx[1]] * m[idx[1]][idx[0]];
  };
  const c2 = minor(G, 0) + minor(G, 1) + minor(G, 2);
  const c3 = det3(G);
  // eigenvalues of G solve  mu^3 - tr mu^2 + c2 mu - c3 = 0, solved by bisection
  const cubic = (a, b, c, d) => {
    const out = [];
    for (let g = 0; g <= 4000; g++) {
      const x0 = g * (tr / 4000 + 1e-9);
      const f0 = a * x0 ** 3 + b * x0 ** 2 + c * x0 + d;
      const x1 = (g + 1) * (tr / 4000 + 1e-9);
      const f1 = a * x1 ** 3 + b * x1 ** 2 + c * x1 + d;
      if (f0 === 0) out.push(x0);
      else if (f0 * f1 < 0) {
        let lo = x0, hi = x1;
        for (let it = 0; it < 200; it++) {
          const mid = (lo + hi) / 2;
          const fm = a * mid ** 3 + b * mid ** 2 + c * mid + d;
          if ((a * lo ** 3 + b * lo ** 2 + c * lo + d) * fm <= 0) hi = mid; else lo = mid;
        }
        out.push((lo + hi) / 2);
      }
    }
    return out;
  };
  const eig = cubic(1, -tr, c2, -c3).filter(v => v > 1e-12);
  if (eig.length === 0) throw new Error('(QB)^T (QB) has no positive eigenvalue; QB is rank deficient, contradicting the hypothesis check above.');
  const muMin = Math.min(...eig);

  // ||QBx||^2 >= muMin ||x||^2  =>  ||x|| <= sqrt(c / muMin)
  const radius = Math.sqrt(cSq / muMin);

  // ---- enumerate x in the ball, keep d = Bx that satisfy the exact test ----
  const R = Math.floor(radius) + 1;
  const targets = [];
  const x = new Array(kappa).fill(0);
  const rec = (j) => {
    if (j === kappa) {
      const d = new Array(6).fill(0);
      for (let t = 0; t < kappa; t++) for (let i = 0; i < 6; i++) d[i] += x[t] * Number(B[t][i]);
      if (d.every(v => v === 0)) return;                       // zero target is the abelian case
      // exact test: contracting coordinates must respect the Proposition 5 bounds
      const dv = d.map(v => K.fromInt(BigInt(v)));
      for (const { i, bound } of contracting) {
        let r = K.zero;
        for (let jj = 0; jj < 6; jj++) r = K.add(r, K.mul(Pinv[i][jj], dv[jj]));
        if (p5.kGt(p5.kAbs(r), bound)) return;
      }
      targets.push(d);
      return;
    }
    for (let v = -R; v <= R; v++) { x[j] = v; rec(j + 1); }
    x[j] = 0;
  };
  rec(0);

  return { targets, kernelBasis: B, kappa, contracting, cSq, muMin, radius, R, QB };
}

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('PROPOSITION 11 TARGET SET FOR SQUARES MODULO PHI');
  console.log('arXiv:1511.05875 Sec 4.2. Construction as specified, not by filtering a box.');
  console.log('');

  const r = targetSet();

  console.log(line);
  console.log('CONSTRUCTION');
  console.log(line);
  console.log(`  hypothesis E_e(M_h) INTERSECT ker(Phi) = {0}   : verified`);
  console.log(`  integer kernel basis of F_Phi, kappa           : ${r.kappa}`);
  r.kernelBasis.forEach(b => console.log('     [' + b.map(v => String(v).padStart(4)).join(' ') + ' ]'));
  console.log(`  contracting coordinates and Prop 5 bounds      : ` +
    r.contracting.map(c => `r_${c.i} <= ${K.str(c.bound)}`).join(',  '));
  console.log(`  c = sum of squares of those bounds             : ${r.cSq.toFixed(6)}`);
  console.log(`  smallest eigenvalue of (QB)^T (QB)            : ${r.muMin.toFixed(9)}`);
  console.log(`  radius ||x|| <= sqrt(c / mu_min)              : ${r.radius.toFixed(6)}  -> integer range +-${r.R}`);
  console.log('');
  console.log(line);
  console.log('RESULT');
  console.log(line);
  console.log(`  finite target set, non-zero d with F_Phi d = 0 : ${r.targets.length}`);
  if (r.targets.length <= 40) {
    r.targets.forEach(d => console.log('     [' + d.map(v => String(v).padStart(4)).join(' ') + ' ]'));
  } else {
    r.targets.slice(0, 12).forEach(d => console.log('     [' + d.map(v => String(v).padStart(4)).join(' ') + ' ]'));
    console.log(`     ... and ${r.targets.length - 12} more`);
  }
  console.log('');
  console.log('  This is a SUPERSET of the realizable targets, which is what the procedure');
  console.log('  needs. It replaces the 25 vectors that verify-theorem6.js selected by');
  console.log('  filtering the wrong box (MATH_CLAIMS.md row 43).');
  console.log('');
  console.log('  NOT DONE HERE: the ancestor closure over this set, the Proposition 8');
  console.log('  length bound and the factor comparison. Nothing above establishes');
  console.log('  Theorem 6.');
  console.log('');
}

if (require.main === module) main();

module.exports = { targetSet, F_PHI };
