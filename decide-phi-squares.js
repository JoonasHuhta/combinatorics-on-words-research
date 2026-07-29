'use strict';

/**
 * decide-phi-squares.js
 * ---------------------
 * The decision procedure run on squares modulo Phi - Rao & Rosenfeld's
 * Theorem 6 - using the target set that Proposition 11 actually specifies.
 *
 * This is the corrected successor to verify-theorem6.js, which selected its
 * targets by filtering a box that was not valid for them (MATH_CLAIMS.md row 43,
 * REJECTED). The target set now comes from proposition11-targets.js (row 45).
 *
 * THE TARGET
 *   "Theorem 6. h6^omega(a) does not contains squares modulo Phi."
 * with Phi from Sec 5.2:
 *   a->(1,0,0) b->(1,1,1) c->(1,2,1) d->(1,0,1) e->(1,2,0) f->(1,1,0)
 *
 * A square modulo Phi is w_1 w_2 with Phi(w_1) = Phi(w_2), i.e. the template
 * [eps, eps, eps, d] with F_Phi d = 0 and d = Psi(w_2) - Psi(w_1).
 *
 * Note that the first row of F_Phi is all ones, so the first coordinate of
 * Phi(w) is |w|. Equal Phi therefore forces equal lengths, exactly as equal
 * Parikh vectors do in the abelian case. The halves of a Phi-square are the same
 * length without that having to be imposed separately.
 *
 * THE ZERO TARGET IS INCLUDED. Any abelian square is a Phi-square, so d = 0 is a
 * legitimate target here even though Theorem 4 already rules it out. Including it
 * keeps this verification self-contained rather than resting on Theorem 4.
 *
 * WHAT A NEGATIVE RESULT MEANS
 * By Proposition 8, if no factor of length <= s realises any template of S, then
 * no factor of Fact_inf(h6) realises any of them at all, hence h6^omega(a)
 * contains no square modulo Phi. That is a statement about the infinite word,
 * conditional on Propositions 4-8 and 11 (the paper's, Level 2) and on this
 * implementation (Level 1). A re-derivation through the authors' machinery, not
 * an independent proof - the same standing as row 32.
 *
 * Usage:  node decide-phi-squares.js
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const ab = require('./ancestor-box.js');
const gp = require('./get-parents.js');
const dr = require('./decide-realizability.js');
const ff = require('./factor-frequencies.js');
const p11 = require('./proposition11-targets.js');
const { K, parikhMatrixK, decompose } = jd;

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
const N = 6;
const vKey = gp.vKey;
const l1 = (v) => v.reduce((s, x) => s + Math.abs(x), 0);

const applyFPhi = (d) => p11.F_PHI.map(row => row.reduce((s, m, i) => s + Number(m) * d[i], 0));

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('DECIDING WHETHER h6^omega(a) CONTAINS A SQUARE MODULO PHI (THEOREM 6)');
  console.log('Target set from Proposition 11. Propositions 5, 6, 8 as before.');
  console.log('');

  // ---- targets ------------------------------------------------------------
  const t11 = p11.targetSet();
  const targets = [new Array(N).fill(0), ...t11.targets];   // zero included, see header
  for (const d of targets) {
    const img = applyFPhi(d);
    if (!img.every(v => v === 0)) throw new Error(`Target [${d}] does not satisfy F_Phi d = 0.`);
  }
  console.log(line);
  console.log('TARGET SET S_0');
  console.log(line);
  console.log(`  from Proposition 11, non-zero  : ${t11.targets.length}`);
  console.log(`  plus the zero vector           : 1   (every abelian square is a Phi-square)`);
  console.log(`  total target templates         : ${targets.length}`);
  console.log(`  all verified to satisfy F_Phi d = 0.`);
  console.log('');

  // ---- box and parent machinery, identical to the abelian run -------------
  const M = parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = decompose(M);
  const sets = p5.imageWordSets(H6, S6);
  const c = new Array(N).fill(null);
  for (const b of blocks) {
    const bound = K.isZero(b.eigenvalue)
      ? ab.contractingBound(J, Pinv, b, sets)
      : ab.expandingBound(Pinv, b, sets, null);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
  }
  const { vectors } = ab.enumerateBox(P, Pinv, c);
  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = vKey(gp.applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }

  // ---- ancestor closure over all targets ----------------------------------
  console.log(line);
  console.log('ANCESTOR CLOSURE OVER ALL TARGETS');
  console.log(line);
  const key = (t) => t.a.join('|') + '#' + t.d.map(vKey).join('|');
  const seen = new Map();
  let frontier = [];
  for (const d of targets) {
    const t = { a: ['', '', ''], d: [d] };
    seen.set(key(t), t);
    frontier.push(t);
  }
  const t0 = Date.now();
  let closed = false;
  for (let round = 1; round <= 60; round++) {
    const next = [];
    for (const t of frontier) {
      for (const p of gp.getParents(t, boxByImage)) {
        const kp = key(p);
        if (!seen.has(kp)) { seen.set(kp, p); next.push(p); }
      }
    }
    console.log(`  round ${String(round).padStart(2)}: discovered ${String(next.length).padStart(8)}   cumulative ${seen.size.toLocaleString()}`);
    if (next.length === 0) { closed = true; break; }
    frontier = next;
  }
  if (!closed) throw new Error('Ancestor closure did not terminate; Proposition 8 cannot be applied.');
  const S = [...seen.values()];
  console.log(`  CLOSED: |S| = ${S.length.toLocaleString()}   (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  console.log('');

  // ---- Proposition 8 length bound -----------------------------------------
  const k = 2;
  const delta = Math.max(...S6.map(a => H6[a].length));
  let Delta = 0;
  for (const t of S) for (const d of t.d) { const v = l1(d); if (v > Delta) Delta = v; }
  const s = k * ((k - 1) * Delta / 2 + delta + 1) + 1;
  console.log(line);
  console.log('PROPOSITION 8 LENGTH BOUND');
  console.log(line);
  console.log(`  Delta = max ||d||_1 over S : ${Delta}`);
  console.log(`  delta = max |h(a)|         : ${delta}`);
  console.log(`  s = Delta + 2*delta + 3    : ${s}`);
  if (s !== Delta + 2 * delta + 3) throw new Error('The two forms of the length bound disagree.');
  console.log('');

  // ---- factors and the search ---------------------------------------------
  const longest = ff.factorSet(s);
  const allFactors = new Set();
  for (const f of longest.set) {
    for (let i = 0; i < f.length; i++) for (let j = i; j <= f.length; j++) allFactors.add(f.slice(i, j));
  }
  console.log(line);
  console.log(`SEARCH OVER ALL FACTORS OF LENGTH <= ${s}`);
  console.log(line);
  console.log(`  complete length-${s} factor set : ${longest.set.size}   (stabilised at h6^${longest.stabilisedAt})`);
  console.log(`  all factors of length <= ${s}   : ${allFactors.size.toLocaleString()}`);

  const inS = new Set(S.map(key));
  const hits = [];
  let checked = 0;
  const t1 = Date.now();
  for (const w of allFactors) {
    for (const t of dr.realizedTemplates(w, true)) {     // non-empty halves
      checked++;
      if (inS.has(key(t))) hits.push({ word: w, template: t });
    }
  }
  console.log(`  decompositions examined        : ${checked.toLocaleString()}   (${((Date.now() - t1) / 1000).toFixed(1)}s)`);
  console.log(`  realizations found             : ${hits.length}`);
  console.log('');

  // ---- negative control ---------------------------------------------------
  console.log(line);
  console.log('NEGATIVE CONTROL: can the detector find a Phi-square at all?');
  console.log(line);
  const phiOfWord = (w) => {
    const d = new Array(N).fill(0);
    for (const ch of w) d[S6.indexOf(ch)]++;
    return applyFPhi(d);
  };
  const isPhiSquare = (w) => {
    if (w.length % 2) return false;
    const h = w.length / 2;
    const A = phiOfWord(w.slice(0, h)), B = phiOfWord(w.slice(h));
    return A.every((v, i) => v === B[i]);
  };
  let ok = true;
  for (const w of ['aa', 'abab', 'adfadf', 'bcbc']) {
    const yes = isPhiSquare(w);
    console.log(`  "${w}" is a Phi-square : ${yes ? 'yes' : 'NO'}`);
    if (!yes) ok = false;
  }
  for (const w of ['ab', 'ac', 'abc']) {
    const yes = w.length % 2 === 0 && isPhiSquare(w);
    console.log(`  "${w}" is NOT a Phi-square, detector says : ${yes ? 'YES - false positive' : 'no'}`);
    if (yes) ok = false;
  }
  if (!ok) throw new Error('Negative control failed; a zero result would be meaningless.');
  console.log('  Control passed.');
  console.log('');

  console.log(line);
  console.log('CONCLUSION');
  console.log(line);
  if (hits.length === 0) {
    console.log(`  No factor of length <= ${s} realises any template of S.`);
    console.log('');
    console.log('  By Proposition 8, no factor of Fact_inf(h6) realises any of them at all,');
    console.log('  so h6^omega(a) contains NO SQUARE MODULO PHI. That is Theorem 6.');
    console.log('');
    console.log('  Standing: a re-derivation through the authors\' machinery, resting on');
    console.log('  Propositions 4-8 and 11 (Level 2) and on this implementation (Level 1).');
    console.log('  Not an independent proof of their theorem. Same standing as row 32.');
  } else {
    console.log(`  ${hits.length} realization(s) found, which contradicts Theorem 6.`);
    for (const h of hits.slice(0, 5)) {
      console.log(`    "${h.word}" -> d = [${h.template.d[0].join(',')}]`);
    }
    console.log('  Something in this pipeline is wrong. Do not trust any other output.');
  }
  console.log('');
}

if (require.main === module) main();
module.exports = { applyFPhi };
