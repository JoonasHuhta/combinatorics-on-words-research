'use strict';

/**
 * proposition5-bounds.js
 * ----------------------
 * Exact bounds c_i from Rao & Rosenfeld, arXiv:1511.05875, Proposition 5.
 *
 * THE STATEMENT (verbatim, read from the ar5iv rendering on 2026-07-28)
 * --------------------------------------------------------------------
 *   Proposition 5. "For any i such that |lambda_{b(i)}| < 1,
 *   { |r_i(Psi(w))| : w in Fact_inf(h) } is bounded."
 *
 * Notation, following the paper: r(x) = P^{-1} x is the coordinate vector of x in
 * the Jordan basis; r_i is its i-th coordinate; b(i) is the Jordan block that
 * index i belongs to; B(i) is that block as a matrix.
 *
 * WHY THIS BOUND IS THE GATE FOR EVERYTHING DOWNSTREAM
 * ----------------------------------------------------
 * The paper's own summary of the subsection says it plainly:
 *   "We show that for any vector x appearing on a realizable ancestor of any
 *    template t_0 and any i, |r_i(x)| is bounded ... It implies that there are
 *    finitely many such integer vectors, since columns of P form a basis of C^n."
 * Finiteness of the ancestor set is what makes the whole decision procedure
 * terminate. Without c_i there is no box to enumerate, and getParents() has no
 * region to search.
 *
 * THE PROOF, AND THE SHORTCUT h6 HANDS US
 * ---------------------------------------
 * Every factor w of the infinite word desubstitutes as
 *
 *   w = ( prod_{j=0}^{l-1} h^j(s_j) ) . h^l(w') . ( prod_{j=l-1}^{0} h^j(p_j) )
 *
 * with s_j a suffix of some image, p_j a prefix of some image, w' a factor of a
 * single image. Applying r and restricting to the block gives
 *
 *   r(Psi(w))[i_s..i_e] = sum_{j=0}^{l-1} B(i)^j r(Psi(s_j p_j))[i_s..i_e]
 *                       + B(i)^l r(Psi(w'))[i_s..i_e]
 *
 * The paper closes the argument with "Since lim_{l->inf} (sum_{j=0}^{l} B(i)^j)
 * exists", i.e. a Neumann series that converges because the spectral radius is
 * below 1.
 *
 * For h6 the contracting eigenvalue is not merely small, it is exactly 0
 * (MATH_CLAIMS.md rows 18, 25). Its blocks are therefore NILPOTENT: B^j = 0 once
 * j reaches the block size. The infinite series is a finite sum, and the bound
 * comes out as an exact element of Q(sqrt(3)) rather than a numerical estimate of
 * a limit. This is a property of h6, not a general simplification, and the script
 * asserts nilpotency before using it.
 *
 * WHAT IS COMPUTED
 * ----------------
 *   c_i  =  ( sum_{j>=0} ||B^j|| ) * max_{s,p} |r_i(Psi(s p))|
 *         + ( max_{l>=0} ||B^l|| ) * max_{w'} |r_i(Psi(w'))|
 *
 * with all three finite sets - suffixes of images, prefixes of images, factors of
 * images - enumerated exhaustively. Each s_j, p_j is chosen independently per j,
 * so the sum is bounded term by term; that is why the max is taken over the sets
 * rather than over a single decomposition.
 *
 * EPISTEMOLOGICAL SCOPE
 * ---------------------
 * This computes an UPPER BOUND satisfying Proposition 5 for our constants. It is
 * not claimed to be the least such bound, and a loose bound is sound here - it
 * only enlarges the box that getParents() must search. Level 1 (COMPUTED):
 * the proposition is Level 2 (row 7b), the arithmetic is ours.
 *
 * Usage:  node proposition5-bounds.js
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const { K, matMulK, identityK, inverseK, parikhMatrixK, decompose } = jd;
const pf = require('./perron-frobenius.js');
const { fr, frStr } = pf;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

/* ---------------------------------------------------------------- *
 * Exact sign and comparison in Q(sqrt(3))
 * ---------------------------------------------------------------- *
 * For x = a + b*sqrt(3) with a, b rational, sign(x) is exactly decidable:
 * if a and b share a sign the answer is immediate; otherwise compare a^2 with
 * 3b^2, which is a comparison of rationals. No floating point is involved, so
 * "the maximum" below is the true maximum and not a numerically-chosen one.
 */
function kSign(x) {
  const a = x.a, b = x.b;
  const aZero = a.n === 0n, bZero = b.n === 0n;
  if (aZero && bZero) return 0;
  if (bZero) return a.n < 0n ? -1 : 1;
  if (aZero) return b.n < 0n ? -1 : 1;
  const aPos = a.n > 0n, bPos = b.n > 0n;
  if (aPos && bPos) return 1;
  if (!aPos && !bPos) return -1;
  // mixed signs: compare a^2 against 3 b^2
  const a2 = a.n * a.n * b.d * b.d;
  const b2 = 3n * b.n * b.n * a.d * a.d;
  if (a2 === b2) return 0;
  const aBigger = a2 > b2;
  return aPos ? (aBigger ? 1 : -1) : (aBigger ? -1 : 1);
}

const kAbs = (x) => (kSign(x) < 0 ? K.neg(x) : x);
const kGt = (x, y) => kSign(K.sub(x, y)) > 0;
const kNum = (x) => Number(x.a.n) / Number(x.a.d) + Math.sqrt(3) * (Number(x.b.n) / Number(x.b.d));

/* ---------------------------------------------------------------- *
 * The three finite word sets of the desubstitution
 * ---------------------------------------------------------------- */

function imageWordSets(phi, alphabet) {
  const suffixes = new Set(['']);
  const prefixes = new Set(['']);
  const factors = new Set(['']);
  for (const a of alphabet) {
    const img = phi[a];
    for (let i = 0; i <= img.length; i++) {
      prefixes.add(img.slice(0, i));
      suffixes.add(img.slice(i));
      for (let j = i; j <= img.length; j++) factors.add(img.slice(i, j));
    }
  }
  return {
    suffixes: [...suffixes].sort(),
    prefixes: [...prefixes].sort(),
    factors: [...factors].sort()
  };
}

/** Parikh vector of a word over S6, as a Q(sqrt(3)) column vector. */
const psi = (w) => S6.map(y => {
  let n = 0n;
  for (const ch of w) if (ch === y) n += 1n;
  return K.fromInt(n);
});

/* ---------------------------------------------------------------- *
 * Bounds
 * ---------------------------------------------------------------- */

const pad = (s, n) => String(s).padEnd(n);

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('EXACT PROPOSITION 5 BOUNDS FOR (h6, g3)');
  console.log('Rao & Rosenfeld arXiv:1511.05875, Prop. 5. Exact Q(sqrt(3)) arithmetic.');
  console.log('');

  const M = parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = decompose(M);

  // ---- identify the contracting indices ----------------------------------
  console.log(line);
  console.log('CONTRACTING INDICES: those i with |lambda_{b(i)}| < 1   [EXACT]');
  console.log(line);
  const contracting = blocks.filter(b => K.isZero(b.eigenvalue));
  const nonContracting = blocks.filter(b => !K.isZero(b.eigenvalue));
  console.log('  block            eigenvalue   indices     |lambda| < 1 ?');
  for (const b of blocks) {
    const idx = `${b.start}..${b.start + b.size - 1}`;
    const isC = K.isZero(b.eigenvalue);
    console.log(`  size ${b.size}           ${pad(b.name, 12)} ${pad(idx, 11)} ${isC ? 'yes' : 'no'}`);
  }
  console.log('');
  console.log('  The only eigenvalue of modulus below 1 is 0 itself: the others are');
  console.log('  3 and +-sqrt(3), all of modulus > 1 (MATH_CLAIMS.md row 18). So the');
  console.log('  contracting part is exactly the generalised 0-eigenspace, and the');
  console.log('  blocks B(i) there are NILPOTENT rather than merely contracting.');
  console.log('');

  const results = [];

  for (const b of contracting) {
    console.log(line);
    console.log(`BLOCK at indices ${b.start}..${b.start + b.size - 1}, eigenvalue ${b.name}, size ${b.size}`);
    console.log(line);

    // B(i): the Jordan block itself
    const B = Array.from({ length: b.size }, (_, r) =>
      Array.from({ length: b.size }, (_, c) => J[b.start + r][b.start + c]));

    // powers of B until they vanish; assert nilpotency rather than assume it
    const powers = [identityK(b.size)];
    let cur = identityK(b.size);
    let nilpotencyIndex = null;
    for (let j = 1; j <= b.size + 1; j++) {
      cur = matMulK(cur, B);
      if (cur.every(r => r.every(v => K.isZero(v)))) { nilpotencyIndex = j; break; }
      powers.push(cur.map(r => r.slice()));
    }
    if (nilpotencyIndex === null) {
      throw new Error(`Block at ${b.start} is not nilpotent within ${b.size + 1} steps; the finite-sum shortcut does not apply and the Neumann series must be summed instead.`);
    }
    console.log(`  B is nilpotent with index ${nilpotencyIndex}: B^${nilpotencyIndex} = 0.`);
    console.log(`  So sum_{j>=0} B^j = ${powers.map((_, j) => (j === 0 ? 'I' : `B^${j}`)).join(' + ')} exactly,`);
    console.log(`  a finite sum. No limit is approximated.`);
    console.log('');

    // row-sum (infinity) operator norm of each power, exact in Q(sqrt(3))
    const normInf = (Mx) => {
      let best = K.zero;
      for (const row of Mx) {
        let s = K.zero;
        for (const v of row) s = K.add(s, kAbs(v));
        if (kGt(s, best)) best = s;
      }
      return best;
    };
    let sumNorms = K.zero, maxNorm = K.zero;
    for (const Pw of powers) {
      const nrm = normInf(Pw);
      sumNorms = K.add(sumNorms, nrm);
      if (kGt(nrm, maxNorm)) maxNorm = nrm;
    }
    console.log(`  sum_j ||B^j||_inf = ${K.str(sumNorms)}   max_j ||B^j||_inf = ${K.str(maxNorm)}`);
    console.log('');

    // ---- the three finite word sets ---------------------------------------
    const sets = imageWordSets(H6, S6);
    console.log(`  Suff(h): ${sets.suffixes.length} words   Pref(h): ${sets.prefixes.length} words   Fact(h): ${sets.factors.length} words`);

    // r(Psi(x)) restricted to this block, max absolute coordinate
    const blockCoords = (word) => {
      const v = psi(word);
      const r = Pinv.map(row => row.reduce((s, x, j) => K.add(s, K.mul(x, v[j])), K.zero));
      return r.slice(b.start, b.start + b.size);
    };
    const maxCoordOver = (words) => {
      let best = K.zero, arg = null;
      for (const w of words) {
        for (const c of blockCoords(w)) {
          const a = kAbs(c);
          if (kGt(a, best)) { best = a; arg = w; }
        }
      }
      return { best, arg };
    };

    // s_j and p_j are chosen independently per j, so bound |r(Psi(s p))| over all pairs
    const pairs = [];
    for (const s of sets.suffixes) for (const p of sets.prefixes) pairs.push(s + p);
    const Msp = maxCoordOver(pairs);
    const Mw = maxCoordOver(sets.factors);

    console.log(`  max over s.p pairs (${pairs.length} of them) of |r_i(Psi(s p))| = ${K.str(Msp.best)}   at "${Msp.arg}"`);
    console.log(`  max over w' in Fact(h)          of |r_i(Psi(w'))|  = ${K.str(Mw.best)}   at "${Mw.arg}"`);
    console.log('');

    const c = K.add(K.mul(sumNorms, Msp.best), K.mul(maxNorm, Mw.best));
    console.log(`  c_i = (sum_j ||B^j||) * ${K.str(Msp.best)} + (max_j ||B^j||) * ${K.str(Mw.best)}`);
    console.log(`      = ${K.str(c)}`);
    console.log(`      = ${kNum(c).toFixed(9)}   (decimal, for reading only)`);
    console.log('');
    results.push({ block: b, bound: c });
  }

  // ---- summary ------------------------------------------------------------
  console.log(line);
  console.log('RESULT');
  console.log(line);
  let overall = K.zero;
  for (const r of results) {
    console.log(`  indices ${r.block.start}..${r.block.start + r.block.size - 1}:  c_i = ${K.str(r.bound)}  = ${kNum(r.bound).toFixed(6)}`);
    if (kGt(r.bound, overall)) overall = r.bound;
  }
  console.log('');
  console.log(`  Uniform bound over all contracting coordinates: ${K.str(overall)} = ${kNum(overall).toFixed(6)}`);
  console.log('');
  console.log('  Meaning: for every factor w of the infinite word and every contracting');
  console.log('  coordinate i, |r_i(Psi(w))| stays below this. Together with the');
  console.log('  complementary bound on the expanding coordinates, this confines the');
  console.log('  realizable ancestors to a finite box - which is what makes the parent');
  console.log('  enumeration terminate.');
  console.log('');
  console.log('  SCOPE: an upper bound satisfying Proposition 5 for these constants, not');
  console.log('  claimed to be the least one. A loose bound is sound here; it only');
  console.log('  enlarges the region getParents() has to search. The proposition itself');
  console.log('  is Level 2 (MATH_CLAIMS.md row 7b); this arithmetic is Level 1.');
  console.log('');
  // ---- empirical check of the derived bounds ------------------------------
  console.log(line);
  console.log('EMPIRICAL CHECK   [not evidence for the bound - a bug detector for it]');
  console.log(line);
  const obs = observeFactors(Pinv, contracting, 9, 12);
  console.log(`  scanned ${obs.checked.toLocaleString()} factors of h6^9(a) (lengths 1..12)`);
  let allRespected = true;
  for (const r of results) {
    for (let i = r.block.start; i < r.block.start + r.block.size; i++) {
      const seen = obs.maxByIndex[i];
      const ok = seen <= kNum(r.bound) + 1e-12;
      if (!ok) allRespected = false;
      console.log(`  r_${i}: observed max ${seen.toFixed(9)}  vs bound ${kNum(r.bound).toFixed(9)}  ${ok ? 'respected' : 'VIOLATED'}` +
        (ok ? `   (slack x${(kNum(r.bound) / (seen || 1)).toFixed(2)})` : ''));
    }
  }
  console.log('');
  if (!allRespected) {
    throw new Error('A derived bound was violated by an actual factor. Either the bound derivation or the Jordan basis is wrong; do not use these values.');
  }
  console.log('  All derived bounds hold on the scanned factors. The bounds are loose,');
  console.log('  which is expected: they come from a worst-case sum of operator norms and');
  console.log('  from taking each max independently. Looseness is sound - it only widens');
  console.log('  the enumeration box - but a tighter bound would make getParents() cheaper.');
  console.log('');
  console.log('  This scan is a bug detector, not support for the bounds. The bounds are');
  console.log('  a consequence of Proposition 5 applied to our exact Jordan data; a finite');
  console.log('  scan could never establish them.');
  console.log('');
  console.log('  NOT DONE YET: the expanding-side bound and getParents() itself.');
  console.log('');
}

/**
 * Observed maximum of |r_i(Psi(w))| over the factors of h6^depth(a) up to a
 * given length, for the contracting coordinates only.
 */
function observeFactors(Pinv, contracting, depth, maxLen) {
  let w = 'a';
  for (let i = 0; i < depth; i++) {
    let n = '';
    for (const ch of w) n += H6[ch];
    w = n;
  }
  const pre = S6.map(() => new Int32Array(w.length + 1));
  for (let i = 0; i < w.length; i++) {
    for (let s = 0; s < 6; s++) pre[s][i + 1] = pre[s][i] + (S6[s] === w[i] ? 1 : 0);
  }
  const indices = [];
  for (const b of contracting) for (let i = b.start; i < b.start + b.size; i++) indices.push(i);

  const maxByIndex = {};
  indices.forEach(i => { maxByIndex[i] = 0; });
  let checked = 0;

  for (let len = 1; len <= maxLen; len++) {
    for (let i = 0; i + len <= w.length; i++) {
      const v = S6.map((_, s) => K.fromInt(BigInt(pre[s][i + len] - pre[s][i])));
      for (const ix of indices) {
        const row = Pinv[ix];
        let acc = K.zero;
        for (let j = 0; j < 6; j++) acc = K.add(acc, K.mul(row[j], v[j]));
        const a = kNum(kAbs(acc));
        if (a > maxByIndex[ix]) maxByIndex[ix] = a;
      }
      checked++;
    }
  }
  return { maxByIndex, checked, wordLength: w.length };
}

if (require.main === module) main();

module.exports = { kSign, kAbs, kGt, kNum, imageWordSets, psi, observeFactors };
