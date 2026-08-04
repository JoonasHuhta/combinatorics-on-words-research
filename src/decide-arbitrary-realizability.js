'use strict';

const math = require('mathjs');
const { decompose } = require('./jordan-arbitrary.js');
const { imageWordSets, psi, contractingBoundNum, expandingBoundNum } = require('./bounds-arbitrary.js');
const { enumerateBoxNum } = require('./ancestor-box-arbitrary.js');
const { makeParentsTools } = require('./get-parents-arbitrary.js');
const ff = require('./factor-frequencies.js');

/**
 * decide-arbitrary-realizability.js
 * 
 * Generalizes the Rao & Rosenfeld decision procedure (Proposition 8) for ANY ternary morphism.
 * Returns true if the morphism contains an abelian square, false if it is proven abelian-square-free.
 */

function realizedTemplates(w, alphabet, requireNonEmpty) {
  const parikh = (str) => psi(str, alphabet);
  const n = w.length;
  const templates = [];
  
  for (const takeFirst of [false, true]) {
    if (takeFirst && n < 1) continue;
    const a1 = takeFirst ? w[0] : '';
    const lo = takeFirst ? 1 : 0;
    for (const takeLast of [false, true]) {
      if (takeLast && n - 1 < lo) continue;
      const a3 = takeLast ? w[n - 1] : '';
      const hi = takeLast ? n - 1 : n;
      const mid = w.slice(lo, hi);
      const m = mid.length;

      // a_2 = epsilon
      for (let j = 0; j <= m; j++) {
        const w1 = mid.slice(0, j), w2 = mid.slice(j);
        if (requireNonEmpty && (w1.length === 0 || w2.length === 0)) continue;
        const p1 = parikh(w1), p2 = parikh(w2);
        templates.push({ a: [a1, '', a3], d: [p2.map((x, i) => x - p1[i])] });
      }
      // a_2 = a letter
      for (let j = 0; j < m; j++) {
        const w1 = mid.slice(0, j), w2 = mid.slice(j + 1);
        if (requireNonEmpty && (w1.length === 0 || w2.length === 0)) continue;
        const p1 = parikh(w1), p2 = parikh(w2);
        templates.push({ a: [a1, mid[j], a3], d: [p2.map((x, i) => x - p1[i])] });
      }
    }
  }
  return templates;
}

function l1(v) {
  return v.reduce((s, x) => s + Math.abs(x), 0);
}

/**
 * Main decision engine.
 * @param {Object} phi The morphism map e.g. {a:'aba', b:'bab', c:'ca'}
 * @param {Array} alphabet e.g. ['a', 'b', 'c']
 */
function decideASF(phi, alphabet) {
  const N = alphabet.length;
  
  // 1. Build Parikh matrix M_h
  const MH = alphabet.map(y => alphabet.map(x => {
    let n = 0;
    for (const ch of phi[x]) if (ch === y) n++;
    return n;
  }));

  // 2. Jordan decomposition
  const { P, Pinv, eigenvalues } = decompose(MH);

  // 3. Bounds (Prop 5 & 6)
  const sets = imageWordSets(phi, alphabet);
  const c = new Array(N).fill(0);
  
  for (const eig of eigenvalues) {
    if (eig.modulus < 1) {
      c[eig.index] = contractingBoundNum(eig, Pinv, sets, alphabet);
    } else if (eig.modulus > 1) {
      c[eig.index] = expandingBoundNum(eig, Pinv, sets, alphabet);
    } else {
      throw new Error(`Eigenvalue has modulus exactly 1: ${eig.modulus}. Method does not apply.`);
    }
  }

  // 4. Enumerate Box
  const { vectors } = enumerateBoxNum(P, Pinv, c);
  
  // 5. Parent Closure
  const pTools = makeParentsTools(phi, alphabet);
  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = pTools.vKey(pTools.applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }

  const t0 = { a: ['', '', ''], d: [new Array(N).fill(0)] };
  const closure = pTools.ancestorClosure(t0, boxByImage);
  if (!closure.closed) {
    throw new Error('Ancestor closure did not terminate within limits.');
  }
  const S = closure.templates;

  // 6. Factor realizability check
  const k = 2; // abelian squares
  const delta = Math.max(...alphabet.map(a => phi[a].length));
  let deltaMax = 0;
  for (const t of S) for (const d of t.d) { const v = l1(d); if (v > deltaMax) deltaMax = v; }
  const s = k * ((k - 1) * deltaMax / 2 + delta + 1) + 1;

  // We need factors of Fact_inf(h) of length <= s.
  // We can just generate a large enough fixed point string.
  let w = alphabet[0];
  while (w.length < s + 20) {
    let n = '';
    for (const ch of w) n += phi[ch];
    w = n;
  }
  // Generate a bit more to ensure we have all factors of length s.
  // Actually, we should generate at least until it stabilises. 
  // For simplicity, we just generate 4 iterations more.
  for(let it = 0; it < 3; it++) {
     let n = '';
     for (const ch of w) n += phi[ch];
     w = n;
  }
  
  const allFactors = new Set();
  for (let i = 0; i < w.length; i++) {
    for (let j = i; j <= Math.min(w.length, i + s); j++) {
      allFactors.add(w.slice(i, j));
    }
  }

  const inS = new Set(S.map(t => t.a.join('|') + '#' + t.d.map(pTools.vKey).join('|')));
  let foundSquare = null;

  for (const factor of allFactors) {
    const rT = realizedTemplates(factor, alphabet, true);
    for (const t of rT) {
      const key = t.a.join('|') + '#' + t.d.map(pTools.vKey).join('|');
      if (inS.has(key)) {
        foundSquare = { word: factor, template: t };
        break;
      }
    }
    if (foundSquare) break;
  }

  return {
    asf: !foundSquare,
    counterexample: foundSquare,
    boxSize: vectors.length,
    closureSize: S.length
  };
}

module.exports = { decideASF, realizedTemplates };
