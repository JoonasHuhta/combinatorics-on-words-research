'use strict';
/*
 * h8-verify.js -- independent corroboration of Rao & Rosenfeld arXiv:1511.05875
 * Section 5.1 / Theorem 5, run 2026-08-01.
 *
 * The paper makes three checkable side claims about h8 beyond Theorem 5 itself:
 *   (i)   "its matrix is invertible"
 *   (ii)  "it has 4 eigenvalues of absolute value less than 1"
 *   (iii) the abelian-square-free word is a fixed point of (h8)^2, and v1 of the
 *         preprint names the starting letter as e -- i.e. (h8)^2 is prolongable on e.
 *
 * None of these is Theorem 5. They are cheap, independently checkable, and if any
 * of them failed it would mean the transcribed table is wrong. That is the point:
 * this is a transcription check with teeth, not a proof of Theorem 5.
 *
 * Theorem 5 itself is NOT proven here. What is checked is a bounded window:
 * "no abelian square with K in [1, KMAX] in an N-symbol prefix".
 */

const { H8 } = require('../src/morphisms.js');

const SIGMA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const IDX = Object.fromEntries(SIGMA.map((c, i) => [c, i]));

// ---------------------------------------------------------------- incidence matrix
// (M_h)_{a,b} = |h(b)|_a  -- the convention stated in arXiv:1511.05875 Sec. 2.
function incidenceMatrix(h) {
  const n = SIGMA.length;
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const b of SIGMA) {
    for (const ch of h[b]) M[IDX[ch]][IDX[b]] += 1;
  }
  return M;
}

// ------------------------------------------------- exact integer characteristic poly
// Faddeev-LeVerrier. For an integer matrix every coefficient is an integer, so this
// stays exact in BigInt: no floating point anywhere on the coefficient path.
function charPolyBigInt(M) {
  const n = M.length;
  const B = M.map(r => r.map(v => BigInt(v)));
  let Mk = Array.from({ length: n }, () => new Array(n).fill(0n));
  const c = new Array(n + 1).fill(0n);
  c[0] = 1n;
  for (let k = 1; k <= n; k++) {
    // Mk = B * Mk + c[k-1] * I
    const prod = Array.from({ length: n }, () => new Array(n).fill(0n));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0n;
        for (let t = 0; t < n; t++) s += B[i][t] * Mk[t][j];
        prod[i][j] = s;
      }
    }
    for (let i = 0; i < n; i++) prod[i][i] += c[k - 1];
    Mk = prod;
    // c[k] = -trace(B*Mk)/k
    let tr = 0n;
    for (let i = 0; i < n; i++) {
      let s = 0n;
      for (let t = 0; t < n; t++) s += B[i][t] * Mk[t][i];
      tr += s;
    }
    if (tr % BigInt(k) !== 0n) throw new Error(`Faddeev-LeVerrier lost integrality at k=${k}`);
    c[k] = -(tr / BigInt(k));
  }
  // c = [1, c1, ..., cn] for lambda^n + c1 lambda^(n-1) + ... + cn
  return c;
}

// -------------------------------------------------------- Durand-Kerner root finding
function polyRoots(coeffs) {
  const n = coeffs.length - 1;
  const a = coeffs.map(Number);
  const evalP = (zr, zi) => {
    let r = 0, i = 0;
    for (let k = 0; k <= n; k++) {
      const nr = r * zr - i * zi + a[k];
      const ni = r * zi + i * zr;
      r = nr; i = ni;
    }
    return [r, i];
  };
  let zr = [], zi = [];
  for (let k = 0; k < n; k++) {
    const ang = (2 * Math.PI * k) / n + 0.35;
    zr.push(0.9 * Math.cos(ang));
    zi.push(0.9 * Math.sin(ang));
  }
  for (let iter = 0; iter < 20000; iter++) {
    let moved = 0;
    for (let k = 0; k < n; k++) {
      let [pr, pi] = evalP(zr[k], zi[k]);
      let dr = 1, di = 0;
      for (let j = 0; j < n; j++) {
        if (j === k) continue;
        const ur = zr[k] - zr[j], ui = zi[k] - zi[j];
        const nr = dr * ur - di * ui, ni = dr * ui + di * ur;
        dr = nr; di = ni;
      }
      const den = dr * dr + di * di;
      if (den < 1e-300) continue;
      const qr = (pr * dr + pi * di) / den;
      const qi = (pi * dr - pr * di) / den;
      zr[k] -= qr; zi[k] -= qi;
      moved = Math.max(moved, Math.hypot(qr, qi));
    }
    if (moved < 1e-14) break;
  }
  return zr.map((r, k) => ({ re: r, im: zi[k], abs: Math.hypot(r, zi[k]) }));
}

// ------------------------------------------------------------------ abelian squares
// Exhaustive over all start positions and all K in [1, KMAX], via prefix sums.
function firstAbelianSquare(w, KMAX) {
  const n = w.length;
  const S = SIGMA.length;
  const pre = Array.from({ length: S }, () => new Int32Array(n + 1));
  for (let i = 0; i < n; i++) {
    for (let s = 0; s < S; s++) pre[s][i + 1] = pre[s][i];
    pre[IDX[w[i]]][i + 1] += 1;
  }
  for (let K = 1; K <= KMAX; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let eq = true;
      for (let s = 0; s < S; s++) {
        if ((pre[s][i + K] - pre[s][i]) !== (pre[s][i + 2 * K] - pre[s][i + K])) { eq = false; break; }
      }
      if (eq) return { K, at: i };
    }
  }
  return null;
}

function applyOnce(h, w) {
  let out = '';
  for (const ch of w) out += h[ch];
  return out;
}

// ------------------------------------------------------------------------- run
function main() {
  const M = incidenceMatrix(H8);
  console.log('h8 =', JSON.stringify(H8));
  console.log('\nM_h8 (rows = letters a..h, (M)_{a,b} = |h(b)|_a):');
  for (let i = 0; i < 8; i++) console.log('  ' + SIGMA[i] + ' | ' + M[i].join(' '));

  const cp = charPolyBigInt(M);
  const n = 8;
  // det(M) = (-1)^n * constant term
  const det = (n % 2 === 0 ? 1n : -1n) * cp[n];
  console.log('\nCharacteristic polynomial (exact, BigInt), lambda^8 + ... :');
  console.log('  coeffs =', cp.map(String).join(', '));
  console.log('  det(M_h8) =', det.toString(), det !== 0n ? '  -> INVERTIBLE (claim i holds)' : '  -> SINGULAR (claim i FAILS)');

  const roots = polyRoots(cp);
  roots.sort((x, y) => x.abs - y.abs);
  console.log('\nEigenvalues (Durand-Kerner on the exact char. poly; moduli are FLOATING POINT):');
  for (const r of roots) {
    console.log(`  ${r.re >= 0 ? ' ' : ''}${r.re.toFixed(6)} ${r.im >= 0 ? '+' : '-'} ${Math.abs(r.im).toFixed(6)}i   |lambda| = ${r.abs.toFixed(6)}`);
  }
  const nSmall = roots.filter(r => r.abs < 1 - 1e-9).length;
  const nUnit = roots.filter(r => Math.abs(r.abs - 1) < 1e-9).length;
  console.log(`\n  eigenvalues with |lambda| < 1 : ${nSmall}   ${nSmall === 4 ? '-> 4, matches the paper (claim ii holds)' : '-> DOES NOT match the paper\'s "4"'}`);
  console.log(`  eigenvalues with |lambda| = 1 : ${nUnit}   ${nUnit === 0 ? '-> none, so Theorem 1/Corollary 1 apply' : '-> PRESENT, decision procedure would not apply'}`);

  // The paper's own reported bound is for "the eigenvalue ~ (0.33292, 0.67077)".
  const target = roots.find(r => Math.abs(Math.abs(r.re) - 0.33292) < 2e-4 && Math.abs(Math.abs(r.im) - 0.67077) < 2e-4);
  console.log(`  paper names an eigenvalue ~(0.33292, 0.67077): ${target ? 'FOUND at ' + target.re.toFixed(5) + ' , ' + Math.abs(target.im).toFixed(5) : 'NOT FOUND'}`);

  // ---- claim (iii): (h8)^2 prolongable on e
  const H8sq = {};
  for (const c of SIGMA) H8sq[c] = applyOnce(H8, H8[c]);
  console.log('\n(h8)^2 =', JSON.stringify(H8sq));
  const prolongable = SIGMA.filter(c => H8sq[c][0] === c);
  console.log('  letters x with (h8)^2(x) starting in x:', prolongable.length ? prolongable.join(', ') : '(none)');
  const h8Prolongable = SIGMA.filter(c => H8[c][0] === c);
  console.log('  letters x with h8(x) starting in x    :', h8Prolongable.length ? h8Prolongable.join(', ') : '(none) -- so h8 itself has NO fixed point, as the paper implies');

  // ---- bounded abelian-square check on the fixed point of (h8)^2 from e
  let w = 'e';
  while (w.length < 200000) {
    const next = applyOnce(H8sq, w);
    if (next.length === w.length) break;
    w = next;
  }
  const KMAX = 3000;
  console.log(`\nFixed point of (h8)^2 from e: generated ${w.length} symbols; prefix = ${w.slice(0, 60)}...`);
  const viol = firstAbelianSquare(w, KMAX);
  console.log(`  exhaustive abelian-square scan, all start positions, K in [1, ${KMAX}]:`);
  console.log(viol
    ? `  *** VIOLATION at position ${viol.at}, K = ${viol.K} -- contradicts Theorem 5, transcription is WRONG`
    : `  no abelian square found in this ${w.length}-symbol prefix for K in [1, ${KMAX}]`);

  // ---- negative control: the scanner must catch a planted violation
  const perturbed = w.slice(0, 5000).split('');
  perturbed[1234] = perturbed[1234] === 'a' ? 'b' : 'a';
  const negCtl = firstAbelianSquare(perturbed.join(''), KMAX);
  console.log(`  negative control (one symbol flipped at index 1234 of a 5000-prefix): ${negCtl ? `caught, K=${negCtl.K} at ${negCtl.at}` : 'NOT CAUGHT -- scanner is broken, ignore the result above'}`);
}

main();
