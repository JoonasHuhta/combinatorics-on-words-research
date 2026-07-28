'use strict';

/**
 * smith-normal-form.js
 * --------------------
 * Exact Smith normal form over Z, with unimodular transforms, in BigInt.
 * No external dependencies, no floating point anywhere.
 *
 * WHY THIS IS HERE
 * ----------------
 * Rao & Rosenfeld's Proposition 9 (arXiv:1511.05875) needs two lattice
 * computations, both standard consequences of the Smith normal form:
 *
 *   "We use the Smith decomposition of M_g to get the matrix B, whose columns
 *    form a basis of Lambda."          [ Lambda = ker(M_g) INTERSECT Z^kappa ]
 *
 *   "if such a solution exists, then d_m is in x_0 + Lambda, and x_0 can be
 *    found with the Smith decomposition of M_g."
 *
 * So: an INTEGER kernel basis, and a particular INTEGER solution of M x = v.
 * Both are provided below. Their reference implementation
 * (CheckingTheTwoTheorems.cpp, MATH_CLAIMS.md row 22) implements Smith in-file
 * for the same reason.
 *
 * Note the distinction from perron-frobenius.js: nullspaceQ there returns a basis
 * of the RATIONAL nullspace. That is not enough here. The rational kernel says
 * which directions exist; the lattice basis says which integer points are
 * actually reachable, and Parikh vectors are integer vectors.
 *
 * DEFINITION
 * ----------
 * For an integer matrix M there exist unimodular U (m x m) and V (n x n) with
 *
 *     U M V = D,   D diagonal,   d_1 | d_2 | ... | d_r,   d_i > 0,  rest zero.
 *
 * Unimodular means integer with determinant +-1, hence integer-invertible. The
 * d_i are the invariant factors and are unique; U and V are not.
 *
 * VERIFICATION
 * ------------
 * Every call verifies its own output before returning: U M V = D is recomputed
 * exactly, |det U| = |det V| = 1 is checked by fraction-free (Bareiss)
 * elimination, and the divisibility chain is asserted. A silent wrong answer
 * from this file would poison everything downstream, so it refuses to return one.
 *
 * Usage:  node smith-normal-form.js        # self-test and a worked example
 */

/* ---------------------------------------------------------------- *
 * BigInt matrix helpers
 * ---------------------------------------------------------------- */

const babs = (a) => (a < 0n ? -a : a);

const identity = (n) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1n : 0n)));

const clone = (M) => M.map(r => r.slice());

function matMul(A, B) {
  const n = A.length, k = B.length, m = B[0].length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: m }, (_, j) => {
      let s = 0n;
      for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
      return s;
    })
  );
}

const matEqual = (A, B) =>
  A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((v, j) => v === B[i][j]));

/**
 * Exact determinant of an integer matrix by the Bareiss fraction-free algorithm.
 * All intermediate values stay integers, so there is no rational blow-up and no
 * rounding. Returns a BigInt.
 */
function determinant(M) {
  const n = M.length;
  if (n === 0) return 1n;
  const A = clone(M);
  let sign = 1n, prev = 1n;
  for (let k = 0; k < n - 1; k++) {
    if (A[k][k] === 0n) {
      let swap = -1;
      for (let i = k + 1; i < n; i++) if (A[i][k] !== 0n) { swap = i; break; }
      if (swap === -1) return 0n;
      [A[k], A[swap]] = [A[swap], A[k]];
      sign = -sign;
    }
    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++) {
        A[i][j] = (A[i][j] * A[k][k] - A[i][k] * A[k][j]) / prev;
      }
      A[i][k] = 0n;
    }
    prev = A[k][k];
  }
  return sign * A[n - 1][n - 1];
}

/* ---------------------------------------------------------------- *
 * Elementary operations, mirrored into the transform matrices
 * ---------------------------------------------------------------- *
 * Invariant maintained throughout: U * M_original * V = M_current.
 * A row operation on M is a left multiplication, so it is applied to U too.
 * A column operation is a right multiplication, so it is applied to V.
 */

const rowSwap = (M, i, j) => { [M[i], M[j]] = [M[j], M[i]]; };
const rowAddMul = (M, i, t, q) => { for (let c = 0; c < M[i].length; c++) M[i][c] -= q * M[t][c]; };
const rowNegate = (M, i) => { for (let c = 0; c < M[i].length; c++) M[i][c] = -M[i][c]; };

const colSwap = (M, i, j) => { for (const row of M) [row[i], row[j]] = [row[j], row[i]]; };
const colAddMul = (M, j, t, q) => { for (const row of M) row[j] -= q * row[t]; };
const colNegate = (M, j) => { for (const row of M) row[j] = -row[j]; };

/* ---------------------------------------------------------------- *
 * Smith normal form
 * ---------------------------------------------------------------- */

/**
 * @param {bigint[][]} Min  integer matrix (m x n), not modified
 * @returns {{U, D, V, rank, invariantFactors}}
 */
function smithNormalForm(Min) {
  const m = Min.length;
  if (m === 0) return { U: [], D: [], V: [], rank: 0, invariantFactors: [] };
  const n = Min[0].length;

  const D = clone(Min);
  const U = identity(m);
  const V = identity(n);

  let t = 0;
  const limit = Math.min(m, n);

  while (t < limit) {
    // locate a pivot of minimal absolute value in the active submatrix
    let pi = -1, pj = -1, best = 0n;
    for (let i = t; i < m; i++) {
      for (let j = t; j < n; j++) {
        const v = babs(D[i][j]);
        if (v !== 0n && (pi === -1 || v < best)) { best = v; pi = i; pj = j; }
      }
    }
    if (pi === -1) break;                       // active submatrix is entirely zero

    if (pi !== t) { rowSwap(D, t, pi); rowSwap(U, t, pi); }
    if (pj !== t) { colSwap(D, t, pj); colSwap(V, t, pj); }

    // clear row t and column t; may take several passes because reducing one
    // can reintroduce entries in the other
    let cleared = false;
    while (!cleared) {
      for (let i = t + 1; i < m; i++) {
        if (D[i][t] === 0n) continue;
        const q = D[i][t] / D[t][t];            // BigInt division truncates toward zero
        rowAddMul(D, i, t, q);
        rowAddMul(U, i, t, q);
        if (D[i][t] !== 0n) {                   // remainder non-zero: smaller pivot found
          rowSwap(D, t, i); rowSwap(U, t, i);
        }
      }
      for (let j = t + 1; j < n; j++) {
        if (D[t][j] === 0n) continue;
        const q = D[t][j] / D[t][t];
        colAddMul(D, j, t, q);
        colAddMul(V, j, t, q);
        if (D[t][j] !== 0n) {
          colSwap(D, t, j); colSwap(V, t, j);
        }
      }
      cleared = true;
      for (let i = t + 1; i < m; i++) if (D[i][t] !== 0n) { cleared = false; break; }
      if (cleared) for (let j = t + 1; j < n; j++) if (D[t][j] !== 0n) { cleared = false; break; }
    }

    // enforce the divisibility chain: d_t must divide every remaining entry.
    // If it does not, fold the offending row into row t and redo this pivot;
    // the pivot strictly decreases in absolute value, so this terminates.
    let violation = false;
    for (let i = t + 1; i < m && !violation; i++) {
      for (let j = t + 1; j < n; j++) {
        if (D[i][j] % D[t][t] !== 0n) {
          rowAddMul(D, t, i, -1n);
          rowAddMul(U, t, i, -1n);
          violation = true;
          break;
        }
      }
    }
    if (violation) continue;                    // same t, new pass

    if (D[t][t] < 0n) { rowNegate(D, t); rowNegate(U, t); }
    t++;
  }

  const rank = t;
  const invariantFactors = [];
  for (let i = 0; i < rank; i++) invariantFactors.push(D[i][i]);

  // ---- self-verification; refuse to return a wrong answer -------------------
  if (!matEqual(matMul(matMul(U, Min), V), D)) {
    throw new Error('Smith normal form failed its own check: U*M*V != D.');
  }
  const du = determinant(U), dv = determinant(V);
  if (babs(du) !== 1n) throw new Error(`U is not unimodular: det(U) = ${du}.`);
  if (babs(dv) !== 1n) throw new Error(`V is not unimodular: det(V) = ${dv}.`);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && D[i][j] !== 0n) throw new Error(`D is not diagonal at (${i},${j}).`);
    }
  }
  for (let i = 0; i + 1 < rank; i++) {
    if (invariantFactors[i + 1] % invariantFactors[i] !== 0n) {
      throw new Error(`Divisibility chain broken: d_${i + 1} = ${invariantFactors[i]} does not divide d_${i + 2} = ${invariantFactors[i + 1]}.`);
    }
  }

  return { U, D, V, rank, invariantFactors };
}

/* ---------------------------------------------------------------- *
 * Lattice applications
 * ---------------------------------------------------------------- */

/**
 * Basis of the integer kernel { x in Z^n : M x = 0 }, as an array of column
 * vectors. These span the lattice Lambda in Proposition 9.
 *
 * From U M V = D: M x = 0 <=> D y = 0 where x = V y. D is diagonal with the
 * first `rank` entries non-zero, so y is free exactly on coordinates >= rank,
 * and the kernel lattice is generated by the corresponding columns of V.
 * Those columns are part of a unimodular matrix, so they are a genuine lattice
 * basis, not merely a spanning set of the rational kernel.
 */
function integerKernelBasis(M) {
  const { V, rank } = smithNormalForm(M);
  if (V.length === 0) return [];
  const n = V.length;
  const basis = [];
  for (let j = rank; j < n; j++) basis.push(V.map(row => row[j]));

  for (const b of basis) {                      // verify M b = 0 exactly
    const prod = matMul(M, b.map(v => [v]));
    if (prod.some(r => r[0] !== 0n)) throw new Error('Computed kernel vector does not satisfy M x = 0.');
  }
  return basis;
}

/**
 * A particular integer solution of M x = v, or null if none exists.
 * Every integer solution is then x_0 + (integer combination of the kernel basis).
 *
 * From U M V = D: M x = v <=> D y = U v with x = V y. Coordinate i < rank forces
 * y_i = (Uv)_i / d_i, which must divide exactly; coordinates i >= rank force
 * (Uv)_i = 0 or the system is unsolvable over Z (and indeed over Q).
 */
function solveInteger(M, v) {
  const { U, D, V, rank } = smithNormalForm(M);
  const m = M.length, n = M[0].length;
  if (v.length !== m) throw new Error(`Right-hand side has length ${v.length}, expected ${m}.`);

  const Uv = matMul(U, v.map(x => [x])).map(r => r[0]);
  const y = new Array(n).fill(0n);
  for (let i = 0; i < rank; i++) {
    const d = D[i][i];
    if (Uv[i] % d !== 0n) return null;           // no integer solution
    y[i] = Uv[i] / d;
  }
  for (let i = rank; i < m; i++) if (Uv[i] !== 0n) return null;  // inconsistent

  const x = matMul(V, y.map(q => [q])).map(r => r[0]);
  const check = matMul(M, x.map(q => [q])).map(r => r[0]);
  if (!check.every((q, i) => q === v[i])) throw new Error('Computed solution does not satisfy M x = v.');
  return x;
}

/* ---------------------------------------------------------------- *
 * Self-test
 * ---------------------------------------------------------------- */

const fmt = (M) => M.map(r => '  [' + r.map(v => String(v).padStart(6)).join(' ') + ' ]').join('\n');

function selfTest() {
  const line = '='.repeat(78);
  console.log('');
  console.log('SMITH NORMAL FORM - EXACT INTEGER LATTICE TOOLKIT');
  console.log('BigInt throughout. Every result is verified before it is returned.');
  console.log('');

  // -- property-based randomised testing ------------------------------------
  // Deliberately property-based rather than compared against quoted "known"
  // Smith forms: the defining properties are checkable here, whereas a table of
  // expected values would be an unsourced claim.
  console.log(line);
  console.log('PROPERTY TEST: 400 pseudo-random integer matrices');
  console.log(line);
  let seed = 20260728;
  const rnd = (lo, hi) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return lo + (seed % (hi - lo + 1));
  };
  let checked = 0;
  for (let trial = 0; trial < 400; trial++) {
    const m = rnd(1, 5), n = rnd(1, 5);
    const M = Array.from({ length: m }, () => Array.from({ length: n }, () => BigInt(rnd(-9, 9))));
    const { rank } = smithNormalForm(M);          // throws on any property failure
    const ker = integerKernelBasis(M);
    if (ker.length !== n - rank) {
      throw new Error(`Kernel rank mismatch: got ${ker.length} generators, expected n - rank = ${n - rank}.`);
    }
    checked++;
  }
  console.log(`  ${checked} matrices: U*M*V = D, |det U| = |det V| = 1, D diagonal,`);
  console.log(`  divisibility chain intact, dim ker = n - rank.  All passed.`);
  console.log('');

  // -- solveInteger round trip ----------------------------------------------
  console.log(line);
  console.log('PROPERTY TEST: integer solving round trip');
  console.log(line);
  let solved = 0, unsolvable = 0;
  for (let trial = 0; trial < 200; trial++) {
    const m = rnd(1, 4), n = rnd(1, 4);
    const M = Array.from({ length: m }, () => Array.from({ length: n }, () => BigInt(rnd(-6, 6))));
    const xTrue = Array.from({ length: n }, () => BigInt(rnd(-5, 5)));
    const v = matMul(M, xTrue.map(q => [q])).map(r => r[0]);
    const x = solveInteger(M, v);                 // must succeed: v is in the image
    if (x === null) throw new Error('solveInteger returned null for a system built from a known integer solution.');
    solved++;
    // and a deliberately inconsistent system, when one can be constructed
    const ker = integerKernelBasis(M.map(r => r.slice()));
    if (ker.length < n) {
      const bad = v.map((q, i) => q + (i === 0 ? 1n : 0n));
      if (solveInteger(M, bad) === null) unsolvable++;
    }
  }
  console.log(`  ${solved}/200 solvable systems recovered an integer solution.`);
  console.log(`  ${unsolvable} perturbed systems correctly reported as having no integer solution.`);
  console.log('');

  // -- the matrix that actually matters -------------------------------------
  console.log(line);
  console.log('APPLICATION: M_g for g3, the matrix Proposition 9 needs');
  console.log(line);
  const { G3 } = require('./morphisms.js');
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'], S3 = ['a', 'b', 'c'];
  const Mg = S3.map(y => S6.map(x => {
    let k = 0n;
    for (const ch of G3[x]) if (ch === y) k += 1n;
    return k;
  }));
  console.log('  M_g (3 x 6), rows a,b,c, columns a..f:');
  console.log(fmt(Mg));
  const snf = smithNormalForm(Mg);
  console.log(`  rank              = ${snf.rank}`);
  console.log(`  invariant factors = [${snf.invariantFactors.join(', ')}]`);
  // The invariant factors describe the IMAGE lattice, not the kernel. With
  // rank 3 into Z^3, the index of the image in Z^3 is the product of the d_i.
  const index = snf.invariantFactors.reduce((a, b) => a * b, 1n);
  console.log(`  index [Z^3 : im(M_g)]  = ${index}`);
  console.log('');
  if (index !== 1n) {
    console.log(`  => M_g does NOT map Z^6 onto Z^3. Its image is a sublattice of index ${index}.`);
    console.log('     There IS a divisibility obstruction, and solveInteger() must return null');
    console.log('     for targets outside the image. An implementation of Proposition 9 that');
    console.log('     assumed surjectivity would silently admit unrealisable parents.');
    console.log('');
    console.log(`     The obstruction is forced by uniformity, not accidental: g3 is`);
    console.log(`     10-uniform, so every column of M_g sums to 10, hence for any x the`);
    console.log(`     coordinate sum of M_g x is 10 * (sum of x) and is divisible by 10.`);
    console.log(`     The image therefore lies in { v in Z^3 : v_a + v_b + v_c = 0 mod 10 },`);
    console.log(`     a sublattice of index exactly 10 - which is the ${index} computed above.`);
    const colSums = S6.map((_, j) => Mg.reduce((s, row) => s + row[j], 0n));
    const uniform = colSums.every(s => s === 10n);
    console.log(`     column sums of M_g = [${colSums.join(', ')}]  ->  all equal 10: ${uniform ? 'yes' : 'NO'}`);
    if (!uniform) throw new Error('g3 column sums are not all 10, contradicting 10-uniformity.');
    // confirm the two descriptions of the image coincide
    const inImage = (v) => solveInteger(Mg, v) !== null;
    const sumDivisible = (v) => (v[0] + v[1] + v[2]) % 10n === 0n;
    for (let a = -12n; a <= 12n; a += 3n) {
      for (let b = -12n; b <= 12n; b += 3n) {
        for (let c = -12n; c <= 12n; c += 3n) {
          if (inImage([a, b, c]) !== sumDivisible([a, b, c])) {
            throw new Error(`Image characterisation disagrees at (${a},${b},${c}).`);
          }
        }
      }
    }
    console.log(`     verified on a 9^3 grid: M_g x = v is integer-solvable exactly when`);
    console.log(`     v_a + v_b + v_c = 0 mod 10.  The two descriptions agree everywhere.`);
  }
  console.log('');
  const ker = integerKernelBasis(Mg);
  console.log(`  integer kernel basis, ${ker.length} generators (Lambda in Proposition 9):`);
  ker.forEach(b => console.log('    [' + b.map(v => String(v).padStart(5)).join(' ') + ' ]'));
  console.log('');
  console.log('  Cross-check against perron-frobenius.js: the rational nullspace of M_g has');
  console.log('  dimension 3 (MATH_CLAIMS.md row 21), and the lattice basis above has the same');
  console.log('  cardinality. It is the FULL integer kernel, not a finite-index sublattice of');
  console.log('  it, because it consists of columns of the unimodular V. That holds regardless');
  console.log('  of the invariant factors - those constrain the image, not the kernel.');
  console.log('');
  console.log('  SCOPE: this file provides the lattice primitives Proposition 9 calls for.');
  console.log('  It does not implement Proposition 9 and computes no parent set.');
  console.log('');
}

if (require.main === module) selfTest();

module.exports = {
  smithNormalForm, integerKernelBasis, solveInteger,
  determinant, matMul, identity
};
