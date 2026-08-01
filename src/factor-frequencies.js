'use strict';

/**
 * factor-frequencies.js
 * ---------------------
 * EXACT factor statistics of the infinite word g3(h6^omega(a)), computed
 * algebraically. No prefix scanning anywhere in the pipeline.
 *
 * WHY THIS IS STRONGER THAN A PREFIX SCAN
 * ---------------------------------------
 * A scan of an N-letter prefix can only ever establish a LOWER bound on the set
 * of factors ("we found 34") and can never rule out a 35th occurring further out.
 * This script instead enumerates the COMPLETE factor set of the infinite word for
 * each length, so statements like "there are exactly 34 distinct abelian squares"
 * and "there is no abelian square of period K" become exact statements about the
 * infinite word rather than observations bounded by a search window.
 *
 * METHOD
 * ------
 * Write u = h6^omega(a), a fixed point of the 3-uniform primitive substitution h6,
 * and T = g3(u), where g3 is 10-uniform.
 *
 *   Step 1  L_m := the exact set of length-m factors of u.
 *           Let S_n = length-m factors of h6^n(a). Every length-m factor of h6(w)
 *           lies inside h6(v) for some length-M factor v of w, where
 *           M = ceil((k-1+m)/k), k = 3. Hence S_{n+1} is a function of the
 *           M-factors of h6^n(a). Since M <= m for all m >= 1, the M-factor set is
 *           determined by the m-factor set (as prefixes), so S_n = S_{n+1} implies
 *           S_{n+1} = S_{n+2}, and therefore S_n = L_m. Single-step stabilisation
 *           is thus a decisive termination criterion, not a heuristic cut-off.
 *
 *   Step 2  The m-block substitution theta_m on the alphabet L_m:
 *             theta_m(v) = ( h6(v)[j .. j+m-1] )_{j = 0..k-1}
 *           is k-uniform, so its dominant eigenvalue is exactly k = 3 and the
 *           normalised left Perron eigenvector gives the EXACT frequencies of every
 *           length-m factor of u, as reduced rationals.
 *
 *   Step 3  Every position of T sits at some offset j in [0,10) inside g3(u_p).
 *           A length-L factor of T starting there is contained in g3(v) for the
 *           length-m3 factor v of u starting at p, m3 = ceil((9+L)/10). Hence
 *
 *             freq_T(w) = (1/10) * sum_{v in L_m3} freq_u(v) * #{ j : g3(v)[j..j+L-1] = w }
 *
 *           Exact, rational, and complete: every factor of T is produced exactly once
 *           per (v, j) pair, and the frequencies sum to 1 (asserted at runtime).
 *
 *   Step 4  rho_K = sum of freq_T(w) over all length-2K factors w that are abelian
 *           squares. Exact rational. A factor is classified INTERNAL if it fits
 *           inside one 10-letter g3 image block (j + L <= 10), else BOUNDARY.
 *
 * EPISTEMOLOGICAL STATUS (AGENTS.md)
 * ----------------------------------
 * All outputs are Level 1 (COMPUTED): derived in this project, exactly, with no
 * external source consulted. They are exact statements about an infinite word,
 * which is a different and stronger thing than a finite empirical window - but it
 * is still Level 1, because nobody has checked whether the same numbers appear in
 * the literature. See MATH_CLAIMS.md rows 17-20.
 *
 * Usage:
 *   node factor-frequencies.js            # rho_K report and the distinct-square census
 *   node factor-frequencies.js --maxk 30  # also certify absence of squares for K = 6..30
 *   node factor-frequencies.js --json
 */

const { H6, G3 } = require('./morphisms.js');
const pf = require('./perron-frobenius.js');
const { fr, frAdd, frMul, frDiv, frStr, frNum } = pf;

const FR0 = fr(0n), FR1 = fr(1n);
const K_H6 = 3;    // h6 is 3-uniform
const K_G3 = 10;   // g3 is 10-uniform

/* ------------------------------------------------------------------ *
 * Step 1: exact factor set L_m of the fixed point h6^omega(a)
 * ------------------------------------------------------------------ */

function factorsOfWord(w, m) {
  const s = new Set();
  for (let i = 0; i + m <= w.length; i++) s.add(w.slice(i, i + m));
  return s;
}

const setsEqual = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

/**
 * Exact length-m factor set of h6^omega(a).
 * Terminates on single-step stabilisation, which is decisive - see header.
 */
function factorSet(m, maxIter = 40) {
  let w = 'a';
  let prev = null;
  for (let n = 1; n <= maxIter; n++) {
    let next = '';
    for (const ch of w) next += H6[ch];
    w = next;
    if (w.length < m) continue;
    const cur = factorsOfWord(w, m);
    if (prev && setsEqual(prev, cur)) {
      return { set: cur, stabilisedAt: n, witnessLength: w.length };
    }
    prev = cur;
  }
  throw new Error(`Factor set of length ${m} did not stabilise within ${maxIter} iterations.`);
}

/* ------------------------------------------------------------------ *
 * Step 2: m-block substitution -> exact factor frequencies
 * ------------------------------------------------------------------ */

/** Image of an m-block v under the induced m-block substitution theta_m. */
function blockImages(v, m) {
  let img = '';
  for (const ch of v) img += H6[ch];
  const out = [];
  for (let j = 0; j < K_H6; j++) out.push(img.slice(j, j + m));
  return out;
}

/**
 * Exact frequencies of every length-m factor of h6^omega(a), as reduced rationals.
 * Returns a Map factor -> rational.
 */
function exactFactorFrequencies(m) {
  const { set, stabilisedAt } = factorSet(m);
  const blocks = [...set].sort();
  const index = new Map(blocks.map((b, i) => [b, i]));
  const n = blocks.length;

  // incidence matrix of theta_m: A[i][j] = # occurrences of block j in theta_m(block i)
  const A = Array.from({ length: n }, () => new Array(n).fill(0n));
  blocks.forEach((v, i) => {
    for (const img of blockImages(v, m)) {
      const j = index.get(img);
      if (j === undefined) {
        throw new Error(`theta_${m} produced block "${img}" outside the computed factor set - the set was not closed, which contradicts the stabilisation argument.`);
      }
      A[i][j] += 1n;
    }
  });

  const prim = pf.checkPrimitive(A);
  const f = pf.leftPerronExact(A, K_H6);
  if (!pf.verifyEigen(A, f, K_H6)) throw new Error(`Eigenvector verification failed for theta_${m}.`);

  const freq = new Map();
  blocks.forEach((b, i) => freq.set(b, f[i]));
  return { freq, blocks, primitive: prim, stabilisedAt, matrixSize: n };
}

/* ------------------------------------------------------------------ *
 * Step 3: push through g3 -> exact ternary factor frequencies
 * ------------------------------------------------------------------ */

/**
 * Exact frequencies of every length-L factor of T = g3(h6^omega(a)).
 * Also records, per factor, how much of its frequency comes from occurrences
 * that lie strictly inside a single g3 image block.
 */
function ternaryFactorFrequencies(L) {
  const m3 = Math.ceil((K_G3 - 1 + L) / K_G3);
  const { freq: f6, matrixSize, stabilisedAt } = exactFactorFrequencies(m3);

  const total = new Map();     // ternary factor -> rational frequency
  const internal = new Map();  // ternary factor -> rational frequency from internal occurrences
  const tenth = fr(1n, BigInt(K_G3));

  for (const [v, fv] of f6) {
    let img = '';
    for (const ch of v) img += G3[ch];
    for (let j = 0; j < K_G3; j++) {
      const w = img.slice(j, j + L);
      if (w.length < L) throw new Error(`g3 image too short for offset ${j}, length ${L}; m3 = ${m3} is wrong.`);
      const contrib = frMul(fv, tenth);
      total.set(w, frAdd(total.get(w) || FR0, contrib));
      if (j + L <= K_G3) internal.set(w, frAdd(internal.get(w) || FR0, contrib));
    }
  }

  // exact identity check: frequencies of all length-L factors must sum to 1
  let s = FR0;
  for (const x of total.values()) s = frAdd(s, x);
  if (frStr(s) !== '1') throw new Error(`Length-${L} factor frequencies sum to ${frStr(s)}, expected exactly 1.`);

  return { L, m3, total, internal, matrixSize, stabilisedAt };
}

/* ------------------------------------------------------------------ *
 * Step 4: abelian squares
 * ------------------------------------------------------------------ */

const parikh = (s) => {
  let a = 0, b = 0, c = 0;
  for (const ch of s) { if (ch === 'a') a++; else if (ch === 'b') b++; else c++; }
  return a + ',' + b + ',' + c;
};

const isAbelianSquare = (w) => {
  const K = w.length / 2;
  return parikh(w.slice(0, K)) === parikh(w.slice(K));
};

function abelianSquareCensus(K) {
  const { total, internal, m3, matrixSize } = ternaryFactorFrequencies(2 * K);
  const squares = [];
  let rho = FR0, rhoInternal = FR0, rhoBoundary = FR0;

  for (const [w, f] of total) {
    if (!isAbelianSquare(w)) continue;
    const fi = internal.get(w) || FR0;
    const fb = fr(f.n * fi.d - fi.n * f.d, f.d * fi.d);
    squares.push({ word: w, freq: f, internal: fi, boundary: fb });
    rho = frAdd(rho, f);
    rhoInternal = frAdd(rhoInternal, fi);
    rhoBoundary = frAdd(rhoBoundary, fb);
  }
  squares.sort((x, y) => frNum(y.freq) - frNum(x.freq) || x.word.localeCompare(y.word));
  return { K, squares, rho, rhoInternal, rhoBoundary, m3, matrixSize, factorCount: total.size };
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const pad = (s, n) => { s = String(s); return s + ' '.repeat(Math.max(0, n - s.length)); };
const padL = (s, n) => { s = String(s); return ' '.repeat(Math.max(0, n - s.length)) + s; };

function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes('--json');
  const mi = argv.indexOf('--maxk');
  const maxK = mi >= 0 ? parseInt(argv[mi + 1], 10) : 12;

  const line = '='.repeat(78);
  const results = [];
  for (let K = 1; K <= maxK; K++) results.push(abelianSquareCensus(K));

  if (asJson) {
    console.log(JSON.stringify(results.map(r => ({
      K: r.K, rho: frStr(r.rho), rhoDecimal: frNum(r.rho),
      internal: frStr(r.rhoInternal), boundary: frStr(r.rhoBoundary),
      distinct: r.squares.length, factorCount: r.factorCount,
      squares: r.squares.map(s => ({ word: s.word, freq: frStr(s.freq) }))
    })), null, 2));
    return;
  }

  console.log('');
  console.log('EXACT FACTOR STATISTICS OF g3(h6^omega(a))');
  console.log('Algebraic, exact rational arithmetic. No prefix scanning.');
  console.log('Every row below is a statement about the INFINITE word.');
  console.log('');
  console.log(line);
  console.log('ABELIAN SQUARE DENSITY rho_K   [EXACT]');
  console.log(line);
  console.log('rho_K = the asymptotic density of positions at which an abelian square');
  console.log('of half-length K begins. Per 1000 positions for comparison with the');
  console.log('empirical Stage 8 figures.');
  console.log('');
  console.log('  K  distinct    rho_K (exact)          per 1000     internal   boundary');
  console.log('  ' + '-'.repeat(72));
  for (const r of results) {
    const per1000 = frNum(r.rho) * 1000;
    const intPct = frNum(r.rho) === 0 ? '-' : (frNum(r.rhoInternal) / frNum(r.rho) * 100).toFixed(1) + '%';
    const bndPct = frNum(r.rho) === 0 ? '-' : (frNum(r.rhoBoundary) / frNum(r.rho) * 100).toFixed(1) + '%';
    console.log(`  ${padL(r.K, 2)}  ${padL(r.squares.length, 8)}    ${pad(frStr(r.rho), 20)}  ${padL(per1000.toFixed(4), 9)}   ${padL(intPct, 8)}   ${padL(bndPct, 8)}`);
  }
  console.log('');

  const nonzero = results.filter(r => r.squares.length > 0);
  const maxKwithSquares = nonzero.length ? Math.max(...nonzero.map(r => r.K)) : 0;
  const totalDistinct = results.reduce((a, r) => a + r.squares.length, 0);
  const distinctKge2 = results.filter(r => r.K >= 2).reduce((a, r) => a + r.squares.length, 0);

  console.log(line);
  console.log('DISTINCT ABELIAN SQUARE CENSUS   [EXACT]');
  console.log(line);
  console.log(`  Distinct abelian squares, K = 1..${maxK} : ${totalDistinct}`);
  console.log(`  Of which K >= 2                     : ${distinctKge2}`);
  console.log(`  Largest K carrying any square       : ${maxKwithSquares}`);
  console.log(`  Longest abelian square              : length ${2 * maxKwithSquares}`);
  console.log('');
  console.log(`  For every K in ${maxKwithSquares + 1}..${maxK} the complete set of length-2K factors of the`);
  console.log(`  infinite word was enumerated and none is an abelian square. This is an`);
  console.log(`  exact statement about the infinite word, not a prefix observation.`);
  console.log('');
  console.log('  Compare MATH_CLAIMS.md 6b (Fici & Puzynina, arXiv:2207.09937):');
  console.log('  "This word contains precisely 34 distinct abelian squares, the longest');
  console.log('   of which has length 10."');
  console.log(`  -> this computation: ${totalDistinct} distinct, longest length ${2 * maxKwithSquares}` +
    `  ${totalDistinct === 34 && maxKwithSquares === 5 ? '[MATCH]' : '[MISMATCH - investigate]'}`);
  console.log('');

  console.log(line);
  console.log('THE SQUARES THEMSELVES   [EXACT]');
  console.log(line);
  for (const r of results) {
    if (!r.squares.length) continue;
    console.log(`  K = ${r.K}  (${r.squares.length} distinct, ${r.factorCount} length-${2 * r.K} factors in total)`);
    for (const s of r.squares) {
      const loc = frNum(s.internal) === 0 ? 'boundary-only'
        : frNum(s.boundary) === 0 ? 'internal-only' : 'mixed';
      console.log(`    ${pad(s.word.slice(0, r.K) + '|' + s.word.slice(r.K), 24)} freq ${pad(frStr(s.freq), 18)} ${loc}`);
    }
    console.log('');
  }
  console.log('Reading: "internal" means the occurrence fits inside a single 10-letter g3');
  console.log('image block; "boundary" means it straddles two blocks. The split is exact,');
  console.log('replacing the sampled percentages recorded in MATH_CLAIMS.md 11 and 15.');
  console.log('');
}

if (require.main === module) main();

module.exports = {
  factorSet, exactFactorFrequencies, ternaryFactorFrequencies,
  abelianSquareCensus, isAbelianSquare
};
