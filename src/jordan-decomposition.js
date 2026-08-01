'use strict';

/**
 * jordan-decomposition.js
 * -----------------------
 * Exact arithmetic in the real quadratic field Q(sqrt(3)), generic linear algebra
 * over that field, and the exact spectral decomposition of M_h for h6.
 *
 * WHY Q(sqrt(3))
 * --------------
 * MATH_CLAIMS.md row 18: the characteristic polynomial of M_h factors as
 *
 *     x^3 (x - 3) (x^2 - 3)
 *
 * so the eigenvalues are 0 (algebraic multiplicity 3), 3, and +-sqrt(3). The
 * splitting field is therefore exactly Q(sqrt(3)) - no larger extension is
 * needed, and no floating point is needed either. Every eigenvector below has
 * coordinates of the form p + q*sqrt(3) with p, q rational, represented exactly.
 *
 * WHY COMPUTE IT RATHER THAN PORT IT
 * ----------------------------------
 * The authors' reference implementation (MATH_CLAIMS.md row 22) does NOT compute
 * a Jordan decomposition: its P and J are hardcoded constants. Rather than copy
 * numbers whose derivation we cannot see, we derive the decomposition here and
 * verify it against M_h itself. That makes the result checkable rather than
 * trusted, and it means a future comparison against their constants is a genuine
 * cross-check between two independent derivations instead of a transcription.
 *
 * WHAT IS PROVED HERE, AND WHAT IS NOT
 * ------------------------------------
 * All output is Level 1 (COMPUTED): exact, self-verified, derived in this project,
 * no external source consulted for the linear algebra. The verification performed
 * is M_h * P = P * J and P * P^{-1} = I, both exactly over Q(sqrt(3)).
 *
 * Usage:  node jordan-decomposition.js
 */

const pf = require('./perron-frobenius.js');
const { fr, frAdd, frSub, frMul, frDiv, frStr } = pf;

const Q0 = fr(0n), Q1 = fr(1n);
const qIsZero = (x) => x.n === 0n;
const qNeg = (x) => fr(-x.n, x.d);

/* ================================================================== *
 * 1. THE FIELD Q(sqrt(3))
 * ================================================================== *
 * An element is a + b*sqrt(3) with a, b rational, stored as {a, b}.
 * sqrt(3) is irrational, so a + b*sqrt(3) = 0 iff a = b = 0. That fact is what
 * makes zero-testing exact, and it is what inversion relies on below.
 */

const K = {
  make: (a, b = Q0) => ({ a, b }),
  fromInt: (n) => ({ a: fr(BigInt(n)), b: Q0 }),
  fromQ: (q) => ({ a: q, b: Q0 }),
  zero: { a: Q0, b: Q0 },
  one: { a: Q1, b: Q0 },
  sqrt3: { a: Q0, b: Q1 },

  add: (x, y) => ({ a: frAdd(x.a, y.a), b: frAdd(x.b, y.b) }),
  sub: (x, y) => ({ a: frSub(x.a, y.a), b: frSub(x.b, y.b) }),
  neg: (x) => ({ a: qNeg(x.a), b: qNeg(x.b) }),

  // (a + b r)(c + d r) = (ac + 3bd) + (ad + bc) r,  r = sqrt(3), r^2 = 3
  mul: (x, y) => ({
    a: frAdd(frMul(x.a, y.a), frMul(fr(3n), frMul(x.b, y.b))),
    b: frAdd(frMul(x.a, y.b), frMul(x.b, y.a))
  }),

  // Norm N(a + b r) = a^2 - 3 b^2. Zero only when a = b = 0, since sqrt(3) is
  // irrational: a^2 = 3 b^2 with b != 0 would make sqrt(3) = |a/b| rational.
  norm: (x) => frSub(frMul(x.a, x.a), frMul(fr(3n), frMul(x.b, x.b))),

  inv: (x) => {
    const N = K.norm(x);
    if (qIsZero(N)) throw new Error(`Division by zero in Q(sqrt(3)): ${K.str(x)}`);
    return { a: frDiv(x.a, N), b: frDiv(qNeg(x.b), N) };
  },
  div: (x, y) => K.mul(x, K.inv(y)),

  isZero: (x) => qIsZero(x.a) && qIsZero(x.b),
  eq: (x, y) => qIsZero(frSub(x.a, y.a)) && qIsZero(frSub(x.b, y.b)),

  str: (x) => {
    if (qIsZero(x.b)) return frStr(x.a);
    const bs = frStr(x.b);
    const rad = bs === '1' ? 'r' : bs === '-1' ? '-r' : `${bs}r`;
    if (qIsZero(x.a)) return rad;
    return `${frStr(x.a)}${bs.startsWith('-') ? '' : '+'}${rad}`;
  }
};

/* ================================================================== *
 * 2. LINEAR ALGEBRA OVER Q(sqrt(3))
 * ================================================================== */

const matMulK = (A, B) => {
  const n = A.length, k = B.length, m = B[0].length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: m }, (_, j) => {
      let s = K.zero;
      for (let t = 0; t < k; t++) s = K.add(s, K.mul(A[i][t], B[t][j]));
      return s;
    })
  );
};

const identityK = (n) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? K.one : K.zero)));

const matEqK = (A, B) =>
  A.length === B.length && A.every((r, i) => r.every((v, j) => K.eq(v, B[i][j])));

/** Reduced row echelon form over Q(sqrt(3)). */
function rrefK(Min) {
  const R = Min.map(r => r.map(x => ({ a: x.a, b: x.b })));
  const rows = R.length, cols = R[0].length;
  const pivots = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = -1;
    for (let i = r; i < rows; i++) if (!K.isZero(R[i][c])) { p = i; break; }
    if (p === -1) continue;
    [R[r], R[p]] = [R[p], R[r]];
    const inv = K.inv(R[r][c]);
    for (let j = c; j < cols; j++) R[r][j] = K.mul(R[r][j], inv);
    for (let i = 0; i < rows; i++) {
      if (i === r || K.isZero(R[i][c])) continue;
      const f = R[i][c];
      for (let j = c; j < cols; j++) R[i][j] = K.sub(R[i][j], K.mul(f, R[r][j]));
    }
    pivots.push(c);
    r++;
  }
  return { R, pivots };
}

/** Nullspace basis over Q(sqrt(3)), as column vectors. */
function nullspaceK(M) {
  const cols = M[0].length;
  const { R, pivots } = rrefK(M);
  const free = [];
  for (let c = 0; c < cols; c++) if (!pivots.includes(c)) free.push(c);
  return free.map(fc => {
    const v = new Array(cols).fill(K.zero);
    v[fc] = K.one;
    pivots.forEach((pc, i) => { v[pc] = K.neg(R[i][fc]); });
    return v;
  });
}

/** Inverse over Q(sqrt(3)) via augmented elimination; throws if singular. */
function inverseK(M) {
  const n = M.length;
  const aug = M.map((row, i) => [...row.map(x => ({ a: x.a, b: x.b })), ...identityK(n)[i]]);
  const { R, pivots } = rrefK(aug);
  if (pivots.length !== n || pivots.some((p, i) => p !== i)) {
    throw new Error('Matrix is singular over Q(sqrt(3)); no inverse.');
  }
  return R.map(row => row.slice(n));
}

/* ================================================================== *
 * 3. SPECTRAL DECOMPOSITION OF M_h
 * ================================================================== */

/** M[j][i] = |phi(i)|_j, the paper's column-vector convention. */
function parikhMatrixK(phi, source, target) {
  return target.map(y => source.map(x => {
    let k = 0n;
    for (const ch of phi[x]) if (ch === y) k += 1n;
    return K.fromInt(k);
  }));
}

/** Matrix power over Q(sqrt(3)); power 0 gives the identity. */
function matPowK(M, p) {
  let R = identityK(M.length);
  for (let i = 0; i < p; i++) R = matMulK(R, M);
  return R;
}

/** Apply a matrix to a column vector. */
const applyK = (M, v) => M.map(row => row.reduce((s, x, j) => K.add(s, K.mul(x, v[j])), K.zero));

/** Rank of a set of column vectors of length n. */
function rankOfColumns(cols, n) {
  if (cols.length === 0) return 0;
  const M = Array.from({ length: n }, (_, i) => cols.map(c => c[i]));
  return rrefK(M).pivots.length;
}

/**
 * Greedily pick vectors from `candidates` that are linearly independent of
 * `existing` and of each other. Returns the newly added vectors.
 */
function extendIndependent(existing, candidates, n, want) {
  const chosen = [];
  let cur = [...existing];
  let rank = rankOfColumns(cur, n);
  for (const c of candidates) {
    if (chosen.length >= want) break;
    const trial = [...cur, c];
    const r = rankOfColumns(trial, n);
    if (r > rank) { cur = trial; rank = r; chosen.push(c); }
  }
  return chosen;
}

/**
 * Exact Jordan chains for one eigenvalue.
 *
 * Uses the standard kernel-dimension ladder. With d_i = dim ker(N^i), N = M - lambda I,
 * the number of Jordan blocks of size exactly i is  2 d_i - d_{i-1} - d_{i+1}.
 * Chains are built top-down: at level L we take vectors of ker(N^L) that are
 * independent of ker(N^{L-1}) together with the members of already-built longer
 * chains that have descended to this level, and generate a chain by applying N.
 *
 * @returns {{chains: Array<Array>, dims: number[], blockSizes: number[]}}
 */
function jordanChains(M, lambda, algebraicMult) {
  const n = M.length;
  const N = M.map((row, i) => row.map((v, j) => (i === j ? K.sub(v, lambda) : v)));

  // kernel dimension ladder, d_0 = 0
  const kernels = [[]];
  const dims = [0];
  for (let i = 1; ; i++) {
    const basis = nullspaceK(matPowK(N, i));
    kernels.push(basis);
    dims.push(basis.length);
    if (basis.length === algebraicMult) break;
    if (basis.length === dims[i - 1]) {
      throw new Error(`Kernel ladder for eigenvalue ${K.str(lambda)} stalled at dimension ${basis.length} < algebraic multiplicity ${algebraicMult}.`);
    }
    if (i > n) throw new Error('Kernel ladder exceeded matrix size.');
  }
  const r = dims.length - 1;                     // index of the eigenvalue

  const chains = [];
  for (let level = r; level >= 1; level--) {
    // vectors of already-built longer chains that currently sit at this level
    const descended = chains
      .filter(ch => ch.length > level)
      .map(ch => ch[ch.length - level]);         // chain stored top-first
    const base = [...kernels[level - 1], ...descended];
    const blocksAtThisSize = 2 * dims[level] - dims[level - 1] - (dims[level + 1] ?? dims[level]);
    if (blocksAtThisSize <= 0) continue;
    const starts = extendIndependent(base, kernels[level], n, blocksAtThisSize);
    if (starts.length < blocksAtThisSize) {
      throw new Error(`Could not find ${blocksAtThisSize} independent chain starts at level ${level}.`);
    }
    for (const v of starts) {
      const chain = [v];                          // top-first: v, Nv, N^2 v, ...
      let cur = v;
      for (let s = 1; s < level; s++) { cur = applyK(N, cur); chain.push(cur); }
      chains.push(chain);
    }
  }

  const blockSizes = chains.map(c => c.length).sort((a, b) => b - a);
  const total = blockSizes.reduce((a, b) => a + b, 0);
  if (total !== algebraicMult) {
    throw new Error(`Jordan chains for ${K.str(lambda)} total ${total}, expected ${algebraicMult}.`);
  }
  return { chains, dims, blockSizes };
}

/**
 * Exact Jordan decomposition of M_h for h6 over Q(sqrt(3)).
 *
 * Returns { P, J, Pinv, detail, blocks }. Verified before return:
 *   M * P = P * J,  P * P^{-1} = I,  and  P * J * P^{-1} = M,
 * all exactly over Q(sqrt(3)). Throws rather than returning a bad decomposition.
 */
function decompose(M) {
  const n = M.length;

  // Eigenvalues from the characteristic polynomial x^3 (x - 3)(x^2 - 3).
  const spectrum = [
    { name: '3', value: K.fromInt(3), algebraic: 1 },
    { name: 'sqrt(3)', value: K.sqrt3, algebraic: 1 },
    { name: '-sqrt(3)', value: K.neg(K.sqrt3), algebraic: 1 },
    { name: '0', value: K.zero, algebraic: 3 }
  ];

  const columns = [];
  const blocks = [];
  const detail = [];

  for (const ev of spectrum) {
    const A = M.map((row, i) => row.map((v, j) => (i === j ? K.sub(v, ev.value) : v)));
    const geometric = nullspaceK(A).length;
    const { chains, blockSizes } = jordanChains(M, ev.value, ev.algebraic);
    detail.push({ name: ev.name, algebraic: ev.algebraic, geometric, blockSizes });

    for (const chain of chains) {
      // Jordan basis order is eigenvector first: N^{L-1}v, ..., Nv, v
      const ordered = [...chain].reverse();
      const start = columns.length;
      ordered.forEach(v => columns.push(v));
      blocks.push({ eigenvalue: ev.value, name: ev.name, start, size: ordered.length });
    }
  }

  if (columns.length !== n) {
    throw new Error(`Assembled ${columns.length} Jordan basis vectors, expected ${n}.`);
  }

  const P = Array.from({ length: n }, (_, i) => columns.map(c => c[i]));
  const J = Array.from({ length: n }, () => new Array(n).fill(K.zero));
  for (const b of blocks) {
    for (let k = 0; k < b.size; k++) {
      J[b.start + k][b.start + k] = b.eigenvalue;
      if (k > 0) J[b.start + k - 1][b.start + k] = K.one;   // superdiagonal
    }
  }

  // ---- verification, exact ------------------------------------------------
  if (!matEqK(matMulK(M, P), matMulK(P, J))) {
    throw new Error('Jordan decomposition failed its own check: M*P != P*J.');
  }
  const Pinv = inverseK(P);                        // throws if P is singular
  if (!matEqK(matMulK(P, Pinv), identityK(n))) throw new Error('P * P^{-1} != I.');
  if (!matEqK(matMulK(matMulK(P, J), Pinv), M)) throw new Error('P * J * P^{-1} != M.');

  const diagonalisable = blocks.every(b => b.size === 1);
  return { P, J, Pinv, detail, blocks, diagonalisable };
}

/* ================================================================== *
 * 4. REPORT
 * ================================================================== */

const fmtK = (M, w = 12) =>
  M.map(r => '  [' + r.map(v => K.str(v).padStart(w)).join(' ') + ' ]').join('\n');

function main() {
  const { H6 } = require('./morphisms.js');
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
  const line = '='.repeat(78);

  console.log('');
  console.log('EXACT SPECTRAL DECOMPOSITION OF M_h OVER Q(sqrt(3))');
  console.log('Exact field arithmetic. r denotes sqrt(3). No floating point.');
  console.log('');

  // Guard: the whole choice of field rests on the characteristic polynomial.
  const { A: Arow } = pf.incidenceMatrix(H6);
  const cp = pf.charPolyExact(Arow).map(String).join(',');
  if (cp !== '1,-3,-3,9,0,0,0') {
    throw new Error(`Characteristic polynomial is [${cp}], not x^3(x-3)(x^2-3). Q(sqrt(3)) may no longer be the splitting field; refusing to continue.`);
  }
  console.log(line);
  console.log('SPLITTING FIELD   [EXACT]');
  console.log(line);
  console.log('  char poly det(xI - M_h) = x^6 - 3x^5 - 3x^4 + 9x^3 = x^3 (x - 3)(x^2 - 3)');
  console.log('  roots: 0 (multiplicity 3), 3, +sqrt(3), -sqrt(3)');
  console.log('  splitting field = Q(sqrt(3)); no larger extension is required.');
  console.log('');

  const M = parikhMatrixK(H6, S6, S6);
  const res = decompose(M);

  console.log(line);
  console.log('EIGENSPACE DIMENSIONS   [EXACT]');
  console.log(line);
  console.log('  eigenvalue     algebraic   geometric   Jordan block sizes');
  for (const d of res.detail) {
    const flag = d.algebraic === d.geometric ? '' : '   <- DEFECTIVE';
    console.log(`  ${d.name.padEnd(14)} ${String(d.algebraic).padStart(6)} ${String(d.geometric).padStart(11)}   ${d.blockSizes.join(' + ')}${flag}`);
  }
  console.log('');

  if (!res.diagonalisable) {
    console.log('  M_h is NOT diagonalisable. The zero eigenvalue carries algebraic');
    console.log('  multiplicity 3 but geometric multiplicity 2, so its generalised');
    console.log('  eigenspace splits as a 2x2 Jordan block plus a 1x1 block. A genuine');
    console.log('  Jordan form is required and is computed below via kernel chains.');
    console.log('');
    console.log('  This is worth stating plainly because it is the first result in this');
    console.log('  project that a diagonalisation shortcut would have silently got wrong,');
    console.log('  and it explains why the reference implementation hardcodes P and J');
    console.log('  instead of computing an eigenbasis (MATH_CLAIMS.md row 22).');
    console.log('');
    console.log('  It does NOT affect MATH_CLAIMS.md row 21: the Fitting decomposition');
    console.log('  E_e(M_h) = im(M_h^6) needs only that every |lambda| < 1 eigenvalue is');
    console.log('  zero and that the exponent exceeds the nilpotency index, which is 2');
    console.log('  here. Defectiveness at 0 changes the basis, not the subspace.');
    console.log('');
  }

  console.log(line);
  console.log('J, Jordan form   [EXACT]');
  console.log(line);
  console.log(fmtK(res.J, 10));
  console.log('');
  console.log('  blocks: ' + res.blocks.map(b => `${b.name} (size ${b.size}) at rows ${b.start}-${b.start + b.size - 1}`).join(', '));
  console.log('');

  console.log(line);
  console.log('P, eigenvectors as columns   [EXACT]');
  console.log(line);
  console.log(fmtK(res.P));
  console.log('');
  console.log('  column order matches the diagonal of J above.');
  console.log('');

  console.log(line);
  console.log('VERIFICATION   [EXACT]');
  console.log(line);
  console.log('  M_h * P = P * J           verified exactly over Q(sqrt(3))');
  console.log('  P * P^{-1} = I            verified exactly');
  console.log('  P * J * P^{-1} = M_h      verified exactly');
  console.log('');
  console.log('  These are identities in exact field arithmetic, not numerical');
  console.log('  agreement to a tolerance. decompose() throws rather than returning');
  console.log('  a decomposition that fails any of them.');
  console.log('');
  console.log('  SCOPE: this supplies the P and J that Proposition 9 needs, derived');
  console.log('  rather than copied. It does not implement Proposition 9 and computes');
  console.log('  no parent set. See MATH_CLAIMS.md rows 18, 21, 22.');
  console.log('');
}

if (require.main === module) main();

module.exports = { K, rrefK, nullspaceK, inverseK, matMulK, identityK, matEqK, parikhMatrixK, decompose };
