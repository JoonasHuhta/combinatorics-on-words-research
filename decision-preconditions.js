'use strict';

/**
 * decision-preconditions.js
 * -------------------------
 * Exact verification of the hypotheses under which Rao & Rosenfeld's decision
 * procedure applies to the ternary construction g3(h6^omega(a)).
 *
 * WHAT IS BEING CHECKED, AND WHY IT MATTERS
 * -----------------------------------------
 * Rao & Rosenfeld, arXiv:1511.05875, Proposition 9 (quoted verbatim):
 *
 *   "If M_h has no eigenvalue of absolute value 1 and E_e(M_h) INTERSECT ker(M_g)
 *    = {0}, then for any template t' one can compute a finite set S that contains
 *    any template realizable by h and parent of t' by g."
 *
 * This is the gate for the whole "morphic image" branch of their algorithm - the
 * branch that produces Theorem 9 (g3(h6^omega(a)) has no abelian square of period
 * more than 5). If the hypotheses fail, the finite parent set does not exist and
 * the method does not apply. Before implementing anything downstream, we verify
 * that the construction we actually have in morphisms.js satisfies them.
 *
 * See MATH_CLAIMS.md rows 6a, 7b, 18.
 *
 * CONVENTIONS
 * -----------
 * The paper acts on Parikh vectors as COLUMN vectors: Psi(h(u)) = M_h Psi(u).
 * So M_h[j][i] = number of occurrences of letter j in h(i) - the transpose of the
 * row-convention matrix used in perron-frobenius.js. M_g is 3 x 6 for g3.
 *
 * WHY E_e IS EXACTLY COMPUTABLE HERE
 * ----------------------------------
 * E_e(M_h) is the expanding subspace: the sum of generalised eigenspaces for the
 * eigenvalues of modulus >= 1 (in this paper's usage, the non-contracting part).
 * In general that is not a rational subspace. Here it is, because of the spectrum
 * we derived exactly in MATH_CLAIMS.md row 18:
 *
 *     char poly of h6 = x^3 (x - 3) (x^2 - 3),  spectrum {3, +-sqrt(3), 0, 0, 0}
 *
 * Every NON-ZERO eigenvalue has modulus > 1 (3 and sqrt(3)), and every eigenvalue
 * of modulus < 1 is exactly 0. By the Fitting decomposition
 *
 *     Q^6 = ker(M^n) (+) im(M^n)   for n >= (nilpotency index)
 *
 * the eventual image im(M_h^6) is precisely the sum of generalised eigenspaces for
 * the non-zero eigenvalues, which here is exactly E_e(M_h). So E_e is the column
 * space of an integer matrix power and can be computed over Q with no floating
 * point and no algebraic number handling. This is a property of h6, not a general
 * technique - the script asserts the spectrum before relying on it.
 *
 * Usage:  node decision-preconditions.js
 */

const { H6, G3 } = require('./morphisms.js');
const pf = require('./perron-frobenius.js');
const { fr, frAdd, frSub, frMul, frStr, rrefQ, nullspaceQ } = pf;

const FR0 = fr(0n), FR1 = fr(1n);

/* ---------------------------------------------------------------- *
 * Exact rational matrix helpers
 * ---------------------------------------------------------------- */

const toQ = (M) => M.map(r => r.map(v => fr(v)));

function matMulQ(A, B) {
  const n = A.length, m = B[0].length, k = B.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: m }, (_, j) => {
      let s = FR0;
      for (let t = 0; t < k; t++) s = frAdd(s, frMul(A[i][t], B[t][j]));
      return s;
    })
  );
}

/** Column space basis of a rational matrix, as an array of column vectors. */
function columnSpaceQ(M) {
  const rows = M.length, cols = M[0].length;
  const { pivots } = rrefQ(M);
  return pivots.map(c => Array.from({ length: rows }, (_, i) => M[i][c]));
}

/** Assemble column vectors into a matrix. */
const colsToMatrix = (cols, rows) =>
  Array.from({ length: rows }, (_, i) => cols.map(c => c[i]));

/**
 * Dimension of U INTERSECT V for subspaces given by bases of column vectors.
 * Solve [B1 | -B2] [x; y] = 0. Because B1 and B2 have independent columns, the
 * map (x,y) -> B1 x is injective on that nullspace, so the intersection has
 * exactly the nullity as its dimension.
 */
function intersectionQ(basis1, basis2, ambientDim) {
  if (basis1.length === 0 || basis2.length === 0) return { dim: 0, vectors: [] };
  const M = Array.from({ length: ambientDim }, (_, i) => [
    ...basis1.map(c => c[i]),
    ...basis2.map(c => frSub(FR0, c[i]))
  ]);
  const ns = nullspaceQ(M);
  const vectors = ns.map(sol => {
    const x = sol.slice(0, basis1.length);
    return Array.from({ length: ambientDim }, (_, i) => {
      let s = FR0;
      basis1.forEach((c, j) => { s = frAdd(s, frMul(x[j], c[i])); });
      return s;
    });
  });
  return { dim: ns.length, vectors };
}

/* ---------------------------------------------------------------- *
 * Build the paper's matrices
 * ---------------------------------------------------------------- */

/** M[j][i] = |phi(i)|_j  (column-vector convention, as in the paper). */
function parikhMatrix(phi, sourceAlphabet, targetAlphabet) {
  return targetAlphabet.map(y =>
    sourceAlphabet.map(x => {
      let n = 0n;
      for (const ch of phi[x]) if (ch === y) n += 1n;
      return n;
    })
  );
}

/* ---------------------------------------------------------------- *
 * Report
 * ---------------------------------------------------------------- */

const pad = (s, n) => { s = String(s); return s + ' '.repeat(Math.max(0, n - s.length)); };

function main() {
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
  const S3 = ['a', 'b', 'c'];
  const line = '='.repeat(78);

  console.log('');
  console.log('PRECONDITIONS FOR RAO & ROSENFELD PROPOSITION 9');
  console.log('arXiv:1511.05875 - exact rational arithmetic, no floating point');
  console.log('');

  const Mh = parikhMatrix(H6, S6, S6);   // 6 x 6
  const Mg = parikhMatrix(G3, S6, S3);   // 3 x 6

  // ---- Condition 1: M_h has no eigenvalue of absolute value 1 -------------
  console.log(line);
  console.log('CONDITION 1: M_h has no eigenvalue of absolute value 1   [EXACT]');
  console.log(line);

  // charPolyExact takes the row-convention matrix; the transpose has the same
  // characteristic polynomial, so either orientation gives the same spectrum.
  const { A: Arow } = pf.incidenceMatrix(H6);
  const cp = pf.charPolyExact(Arow);
  const cpStr = cp.map(String).join(',');
  console.log(`  char poly det(xI - M_h) = ${pf.polyToString(cp)}`);
  if (cpStr !== '1,-3,-3,9,0,0,0') {
    throw new Error(`Unexpected characteristic polynomial [${cpStr}]. The rationality argument for E_e below depends on the spectrum being {3, +-sqrt(3), 0,0,0}; refusing to continue.`);
  }
  console.log('  factors as x^3 (x - 3)(x^2 - 3), so the spectrum is exactly');
  console.log('    0 (algebraic multiplicity 3),  3,  +sqrt(3),  -sqrt(3)');
  console.log('  moduli: 0, 0, 0, 3, sqrt(3), sqrt(3)');
  console.log('  sqrt(3) != 1 because 3 != 1, and 3 != 1, and 0 != 1.');
  console.log('  => CONDITION 1 HOLDS (no eigenvalue of modulus 1).');
  console.log('');
  console.log('  Note this is exactly the fact the paper leans on when it writes');
  console.log('  "using the bounds on the 3 null eigenvalues of h6": the contracting');
  console.log('  directions of M_h are precisely the three zero eigenvalues.');
  console.log('');

  // ---- E_e(M_h) as the eventual image ------------------------------------
  console.log(line);
  console.log('E_e(M_h), the non-contracting subspace   [EXACT]');
  console.log(line);
  let P = toQ(Mh);
  for (let i = 1; i < 6; i++) P = matMulQ(P, toQ(Mh));   // M_h^6
  const Ee = columnSpaceQ(P);
  console.log(`  E_e(M_h) = im(M_h^6)   (Fitting: valid because every non-zero`);
  console.log(`  eigenvalue has modulus > 1 and every |lambda| < 1 eigenvalue is 0)`);
  console.log(`  dim E_e(M_h) = ${Ee.length}`);
  // sanity: dim E_e must equal the number of non-zero eigenvalues counted with
  // multiplicity, i.e. 3 (namely 3, +sqrt(3), -sqrt(3))
  if (Ee.length !== 3) {
    throw new Error(`dim E_e = ${Ee.length}, expected 3 (one for each of 3, +sqrt(3), -sqrt(3)).`);
  }
  console.log('  matches the 3 non-zero eigenvalues counted with multiplicity.');
  console.log('');

  // ---- ker(M_g) -----------------------------------------------------------
  console.log(line);
  console.log('ker(M_g) for g = g3   [EXACT]');
  console.log(line);
  const kerG = nullspaceQ(toQ(Mg));
  const kerCols = kerG.map(v => v);
  console.log('  M_g (3 x 6), rows a,b,c, columns a..f:');
  Mg.forEach((row, i) => console.log(`    ${S3[i]}  ` + row.map(v => pad(v, 5)).join('')));
  console.log(`  rank(M_g) = ${3 - 0 - (3 - (6 - kerG.length))}  (from dim ker = ${kerG.length}: rank = 6 - ${kerG.length} = ${6 - kerG.length})`);
  console.log(`  dim ker(M_g) = ${kerG.length}`);
  console.log('');

  // ---- Condition 2: the intersection --------------------------------------
  console.log(line);
  console.log('CONDITION 2: E_e(M_h) INTERSECT ker(M_g) = {0}   [EXACT]');
  console.log(line);
  const inter = intersectionQ(Ee, kerCols, 6);
  console.log(`  dim E_e(M_h)              = ${Ee.length}`);
  console.log(`  dim ker(M_g)              = ${kerG.length}`);
  console.log(`  ambient dimension         = 6`);
  console.log(`  dim of the intersection   = ${inter.dim}`);
  if (inter.dim === 0) {
    console.log('  => CONDITION 2 HOLDS (trivial intersection).');
  } else {
    console.log('  => CONDITION 2 FAILS. Basis of the intersection:');
    inter.vectors.forEach(v => console.log('     [' + v.map(frStr).join(', ') + ']'));
  }
  console.log('');
  console.log(`  Note ${Ee.length} + ${kerG.length} = ${Ee.length + kerG.length} = 6, so the two subspaces are`);
  console.log(`  complementary: Q^6 = E_e(M_h) (+) ker(M_g). The intersection being`);
  console.log(`  trivial is therefore equivalent to the sum being everything, and both`);
  console.log(`  are verified above by exact rank computation.`);
  console.log('');

  // ---- Verdict ------------------------------------------------------------
  const ok = inter.dim === 0;
  console.log(line);
  console.log('VERDICT');
  console.log(line);
  console.log(`  Condition 1 (no eigenvalue of modulus 1) : ${'HOLDS'}`);
  console.log(`  Condition 2 (trivial intersection)       : ${ok ? 'HOLDS' : 'FAILS'}`);
  console.log('');
  if (ok) {
    console.log('  Proposition 9 applies to the pair (h6, g3). The finite parent set S');
    console.log('  used in the proof of Theorem 9 therefore exists for this construction.');
    console.log('');
    console.log('  EPISTEMOLOGICAL LIMIT: this verifies the HYPOTHESES of Proposition 9');
    console.log('  for our constants. It does not implement the proposition, does not');
    console.log('  compute any parent set, and does not re-prove Theorem 9. It establishes');
    console.log('  that the downstream algorithm is applicable here - nothing more.');
  } else {
    console.log('  Proposition 9 does NOT apply as stated. Either the constants in');
    console.log('  morphisms.js differ from the paper, or the convention used here is');
    console.log('  wrong. Do not build the decision procedure on this pair until resolved.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { parikhMatrix, matMulQ, columnSpaceQ, intersectionQ };
