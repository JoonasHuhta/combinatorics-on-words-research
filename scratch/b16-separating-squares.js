'use strict';

/**
 * b16-separating-squares.js
 * -------------------------
 * A "separating square" is a word UV with |U| = |V| = K such that
 *   (1) U and V have the same letter counts (Parikh vector),
 *   (2) U and V have the same counts of all 6 OFF-diagonal bigrams
 *       (ab, ac, ba, bc, ca, cb),
 *   (3) U and V differ in at least one DIAGONAL bigram count (aa, bb, cc).
 * Such a word is forbidden in the "Golden Six" language but allowed in All-9.
 * The set of separating squares is exactly the difference between the two
 * constraints, so it is the whole content of L_G6 subsetneq L_All9.
 *
 * EXPERIMENT 1 (structure): brute-force check of a proposed structure theorem
 * generalising MATH_CLAIMS.md row 99's row/column-sum accounting:
 *
 *   For a ternary word W of length K, the bigram matrix M satisfies
 *     rowsum(x) = count_W(x) - [last(W) = x]
 *     colsum(y) = count_W(y) - [first(W) = y]
 *   so, given the letter counts and the 6 off-diagonal entries,
 *     M_xx = count(x) - [last = x] - (off-diagonal entries of row x)
 *          = count(x) - [first = x] - (off-diagonal entries of column x).
 *   Hence for U, V with (1) and (2):
 *     diag(U) - diag(V) = e_{last(V)} - e_{last(U)} = e_{first(V)} - e_{first(U)}.
 *   CLAIM: UV is a separating square  <=>  first(U) = last(U) = p,
 *   first(V) = last(V) = q, and p != q; and then the diagonal mismatch is
 *   exactly +1 on M_pp and -1 on M_qq (third diagonal equal).
 *   COROLLARY: no separating square exists for K <= 3.
 *
 * EXPERIMENT 2 (embeddability): does the word Theorem 65 / Rao & Rosenfeld
 * Theorem 2 actually produces -- h2 applied once to g85^2(a), the same
 * 36,125-symbol word as MATH_CLAIMS.md row 85's positive control -- contain
 * any separating square?  If it does NOT, that single word is simultaneously
 * All-9-square-free and Golden-Six-square-free, i.e. it is direct evidence
 * that an infinite Golden-Six-square-free ternary word exists.  If it DOES,
 * the first occurrence is a concrete witness of what G6 forbids and All-9
 * does not, inside the only known infinite construction.
 *
 * Usage: node scratch/b16-separating-squares.js [maxK_exp1] [maxK_exp2]
 */

const { g85Power, applyH2 } = require('../scripts/theorem65-positive-control.js');

const OFFDIAG = [1, 2, 3, 5, 6, 7]; // indices x*3+y with x != y
const DIAG = [0, 4, 8];

// ---------------------------------------------------------------- experiment 1

/** Letter counts and full 3x3 bigram counts of a ternary word (array of 0..2). */
function profile(w) {
  const let3 = [0, 0, 0];
  const big9 = new Array(9).fill(0);
  for (let i = 0; i < w.length; i++) {
    let3[w[i]]++;
    if (i > 0) big9[w[i - 1] * 3 + w[i]]++;
  }
  return { let3, big9, first: w[0], last: w[w.length - 1] };
}

function experiment1(maxK) {
  console.log('=== EXPERIMENT 1: structure of separating squares (brute force) ===');
  console.log('K   | pairs(U,V) matching Parikh+6 off-diag | of those, separating | theorem violations');
  let firstK = null;
  let totalViolations = 0;

  for (let K = 1; K <= maxK; K++) {
    const N = Math.pow(3, K);
    const profs = new Array(N);
    for (let code = 0; code < N; code++) {
      const w = new Array(K);
      let c = code;
      for (let i = K - 1; i >= 0; i--) { w[i] = c % 3; c = Math.floor(c / 3); }
      profs[code] = profile(w);
    }

    let matching = 0, separating = 0, violations = 0;
    for (let a = 0; a < N; a++) {
      const P = profs[a];
      for (let b = 0; b < N; b++) {
        const Q = profs[b];
        // (1) same letter counts
        if (P.let3[0] !== Q.let3[0] || P.let3[1] !== Q.let3[1] || P.let3[2] !== Q.let3[2]) continue;
        // (2) same 6 off-diagonal bigram counts
        let ok = true;
        for (const B of OFFDIAG) if (P.big9[B] !== Q.big9[B]) { ok = false; break; }
        if (!ok) continue;
        matching++;
        // (3) diagonal mismatch?
        let sep = false;
        for (const B of DIAG) if (P.big9[B] !== Q.big9[B]) { sep = true; break; }
        if (sep) separating++;

        // --- the claimed characterisation
        const predicted = (P.first === P.last) && (Q.first === Q.last) && (P.last !== Q.last);
        if (predicted !== sep) violations++;

        // --- the claimed shape of the mismatch: diag(U)-diag(V) = e_{last V} - e_{last U}
        if (sep) {
          for (let x = 0; x < 3; x++) {
            const expected = (Q.last === x ? 1 : 0) - (P.last === x ? 1 : 0);
            if (P.big9[x * 3 + x] - Q.big9[x * 3 + x] !== expected) violations++;
          }
        }
        if (sep && firstK === null) firstK = K;
      }
    }
    totalViolations += violations;
    console.log(`${String(K).padStart(3)} | ${String(matching).padStart(37)} | ${String(separating).padStart(20)} | ${String(violations).padStart(18)}`);
  }

  console.log(`\nShortest K admitting a separating square: ${firstK === null ? 'none found' : firstK} (word length ${firstK === null ? '-' : 2 * firstK})`);
  console.log(`Total theorem violations over K = 1..${maxK}: ${totalViolations}`);

  // list the shortest separating squares explicitly
  if (firstK !== null) {
    const K = firstK, N = Math.pow(3, K);
    const words = [];
    for (let code = 0; code < N; code++) {
      const w = new Array(K);
      let c = code;
      for (let i = K - 1; i >= 0; i--) { w[i] = c % 3; c = Math.floor(c / 3); }
      words.push(w);
    }
    const found = [];
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
      const P = profile(words[a]), Q = profile(words[b]);
      if (P.let3.some((v, i) => v !== Q.let3[i])) continue;
      if (OFFDIAG.some(B => P.big9[B] !== Q.big9[B])) continue;
      if (!DIAG.some(B => P.big9[B] !== Q.big9[B])) continue;
      found.push(words[a].join('') + words[b].join(''));
    }
    console.log(`Shortest separating squares (K = ${K}): ${found.length} of them, e.g. ${found.slice(0, 8).join(', ')}`);
  }
  console.log('');
}

// ---------------------------------------------------------------- experiment 2

/** Scan a ternary string for separating squares, K in [minK, maxK]. */
function scanSeparating(word, minK, maxK) {
  const n = word.length;
  const w = new Int8Array(n);
  for (let i = 0; i < n; i++) w[i] = word.charCodeAt(i) - 48;

  const pL = [new Int32Array(n + 1), new Int32Array(n + 1), new Int32Array(n + 1)];
  const pB = Array.from({ length: 9 }, () => new Int32Array(n + 1));
  for (let i = 0; i < n; i++) {
    for (let L = 0; L < 3; L++) pL[L][i + 1] = pL[L][i];
    for (let B = 0; B < 9; B++) pB[B][i + 1] = pB[B][i];
    pL[w[i]][i + 1]++;
    if (i > 0) pB[w[i - 1] * 3 + w[i]][i + 1]++;
  }
  // bigram count of window [s,e) = pB[e] - pB[s+1]

  let checked = 0;
  for (let K = minK; K <= maxK; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      const s = i, m = i + K, e = i + 2 * K;
      checked++;
      if (pL[0][m] - pL[0][s] !== pL[0][e] - pL[0][m]) continue;
      if (pL[1][m] - pL[1][s] !== pL[1][e] - pL[1][m]) continue;
      if (pL[2][m] - pL[2][s] !== pL[2][e] - pL[2][m]) continue;
      let ok = true;
      for (const B of OFFDIAG) {
        if (pB[B][m] - pB[B][s + 1] !== pB[B][e] - pB[B][m + 1]) { ok = false; break; }
      }
      if (!ok) continue;
      // it is a Golden-Six square. Is it also an All-9 square (i.e. not separating)?
      let allNine = true;
      for (const B of DIAG) {
        if (pB[B][m] - pB[B][s + 1] !== pB[B][e] - pB[B][m + 1]) { allNine = false; break; }
      }
      return { found: true, i, K, separating: !allNine, checked, factor: word.slice(s, e) };
    }
  }
  return { found: false, checked };
}

function experiment2(maxK) {
  console.log('=== EXPERIMENT 2: does the Theorem 65 construction contain a Golden-Six square? ===');
  const src = g85Power(2);
  const img = applyH2(src);
  console.log(`source g85^2(a): ${src.length} symbols over {a,b,c,d}`);
  console.log(`image h2(g85^2(a)): ${img.length} symbols over {0,1,2}`);
  const cap = Math.min(maxK, Math.floor(img.length / 2));
  const t0 = Date.now();
  const res = scanSeparating(img, 2, cap);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  if (!res.found) {
    console.log(`NO Golden-Six square found for K in [2, ${cap}] (${res.checked.toLocaleString()} windows, ${dt}s).`);
    console.log('=> within this bounded window, the Theorem 65 word is Golden-Six-square-free as well as All-9-square-free.');
  } else {
    console.log(`FIRST Golden-Six square: position ${res.i}, K = ${res.K}, separating (All-9-legal) = ${res.separating}`);
    console.log(`factor: ${res.factor.length <= 200 ? res.factor : res.factor.slice(0, 200) + '...'}`);
    console.log(`(${res.checked.toLocaleString()} windows examined, ${dt}s)`);
  }
  console.log('');
}

const maxK1 = parseInt(process.argv[2] || '7', 10);
const maxK2 = parseInt(process.argv[3] || '18000', 10);
experiment1(maxK1);
experiment2(maxK2);
