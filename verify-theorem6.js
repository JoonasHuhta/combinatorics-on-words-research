'use strict';

/**
 * verify-theorem6.js
 * ------------------
 * Verifies Theorem 6 of Rao & Rosenfeld (arXiv:1511.05875) using the exact
 * bounded ancestor closure method from Proposition 8.
 * 
 * Theorem 6 states that h6^omega(a) avoids abelian squares modulo Phi, where:
 * Phi : a->(1,0,0), b->(1,1,1), c->(1,2,1), d->(1,0,1), e->(1,2,0), f->(1,1,0)
 * 
 * Instead of starting the ancestor closure from a single template t_0 with d=0,
 * we start from the set of all templates t_0 with Phi(d) = 0 that lie within
 * the theoretical bounding box.
 */

const { H6 } = require('./morphisms.js');
const jd = require('./jordan-decomposition.js');
const p5 = require('./proposition5-bounds.js');
const ab = require('./ancestor-box.js');
const gp = require('./get-parents.js');
const ff = require('./factor-frequencies.js');
const { K, parikhMatrixK, decompose } = jd;
const { realizedTemplates, l1 } = require('./decide-realizability.js');

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
const N = 6;

const parikh = gp.parikh;
const vKey = gp.vKey;

const phi = [
    [1, 1, 1, 1, 1, 1], // x-painot
    [0, 1, 2, 0, 2, 1], // y-painot
    [0, 1, 1, 1, 0, 0]  // z-painot
];

function applyPhi(v) {
    if (!v) return v;
    return [
        phi[0].reduce((sum, w, i) => sum + w * v[i], 0),
        phi[1].reduce((sum, w, i) => sum + w * v[i], 0),
        phi[2].reduce((sum, w, i) => sum + w * v[i], 0)
    ];
}

function isPhiZero(v) {
    const pv = applyPhi(v);
    return pv[0] === 0 && pv[1] === 0 && pv[2] === 0;
}

function main() {
  const line = '='.repeat(78);
  console.log('');
  console.log('DECIDING WHETHER h6^omega(a) REALIZES ANY SQUARE MODULO PHI (THEOREM 6)');
  console.log('Rao & Rosenfeld arXiv:1511.05875, Proposition 8 & Theorem 6. Exact throughout.');
  console.log('');

  // ---- rebuild box, parents, ancestors ------------------------------------
  const M = parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = decompose(M);
  const sets = p5.imageWordSets(H6, S6);
  const c = new Array(N).fill(null);
  for (const b of blocks) {
    const bound = K.isZero(b.eigenvalue)
      ? ab.contractingBound(J, Pinv, b, sets)
      : ab.expandingBound(Pinv, b, sets, true);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
  }
  const { vectors } = ab.enumerateBox(P, Pinv, c);
  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = vKey(gp.applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }

  // Target templates are all [eps, eps, eps, d] where Phi(d) = 0 AND d is in the box.
  const S0_vectors = vectors.filter(x => isPhiZero(x));
  
  console.log(line);
  console.log(`INITIAL TARGET SET S0 (Templates modulo Phi = 0 within the box)`);
  console.log(line);
  console.log(`  Total vectors in bounding box: ${vectors.length.toLocaleString()}`);
  console.log(`  Vectors with Phi(d) = 0:       ${S0_vectors.length.toLocaleString()}`);
  if (S0_vectors.length === 0) {
      console.log('  No templates in the box map to 0 under Phi. Theorem holds trivially.');
      return;
  }
  
  // Custom ancestor closure for multiple starting templates
  let S = [];
  let inS = new Set();
  let queue = [];
  
  function enqueue(t) {
      const key = t.a.join('|') + '#' + t.d.map(vKey).join('|');
      if (!inS.has(key)) {
          inS.add(key);
          S.push(t);
          queue.push(t);
      }
  }

  for (const d of S0_vectors) {
      enqueue({ a: ['', '', ''], d: [d] });
  }

  console.log(`\nComputing ancestor closure for ${S0_vectors.length} starting templates...`);
  
  let steps = 0;
  while (queue.length > 0) {
      if (steps++ > 1000000) {
          throw new Error("Ancestor closure did not terminate within 1M steps. Set is unbounded.");
      }
      const t = queue.shift();
      const parents = gp.getParents(t, boxByImage);
      for (const p of parents) {
          enqueue(p);
      }
  }

  console.log(line);
  console.log('THE SET S   (Proposition 8 allows any S with Ranc <= S <= Anc)');
  console.log(line);
  console.log(`  S = Anc_h(S0), computed exactly : ${S.length.toLocaleString()} templates`);
  console.log('');

  // ---- the length bound ---------------------------------------------------
  const k = 2;
  const delta = Math.max(...S6.map(a => H6[a].length));
  let deltaMax = 0;
  for (const t of S) for (const d of t.d) { const v = l1(d); if (v > deltaMax) deltaMax = v; }
  const s = k * ((k - 1) * deltaMax / 2 + delta + 1) + 1;

  console.log(line);
  console.log('THE LENGTH BOUND s');
  console.log(line);
  console.log(`  k                                  = ${k}   (abelian squares)`);
  console.log(`  delta = max_a |h(a)|               = ${delta}   (h6 is 3-uniform)`);
  console.log(`  Delta = max_{t in S} ||d_1||_1     = ${deltaMax}`);
  console.log(`  s = k((k-1) Delta/2 + delta + 1)+1 = ${s}`);
  console.log('');

  // ---- enumerate the factors ----------------------------------------------
  console.log(line);
  console.log(`FACTORS OF Fact_inf(h6) OF LENGTH <= ${s}   [EXACT, complete factor sets]`);
  console.log(line);
  const longest = ff.factorSet(s);
  const allFactors = new Set();
  for (const f of longest.set) {
    for (let i = 0; i < f.length; i++) {
      for (let j = i; j <= f.length; j++) allFactors.add(f.slice(i, j));
    }
  }
  console.log(`  length-${s} factors                : ${longest.set.size}`);
  console.log(`  all factors of length <= ${s}      : ${allFactors.size.toLocaleString()}`);
  console.log('');

  // ---- the search ---------------------------------------------------------
  // Re-build the inS set for fast lookup
  inS = new Set(S.map(t => t.a.join('|') + '#' + t.d.map(vKey).join('|')));

  console.log(line);
  console.log('SEARCH: does any such factor realize a template of S ?');
  console.log(line);
  const runSearch = (requireNonEmpty) => {
    const found = [];
    let checked = 0;
    for (const w of allFactors) {
      for (const t of realizedTemplates(w, requireNonEmpty)) {
        checked++;
        const key = t.a.join('|') + '#' + t.d.map(vKey).join('|');
        if (inS.has(key)) found.push({ word: w, template: t });
      }
    }
    return { found, checked };
  };

  const t1 = Date.now();
  const strict = runSearch(true); // use strict by default as established
  const elapsed = ((Date.now() - t1) / 1000).toFixed(1);

  console.log(`  decompositions examined : ${strict.checked.toLocaleString()}   (${elapsed}s)`);
  console.log('');
  console.log(`  standard reading (w_i non-empty)   : ${strict.found.length} realizations`);
  console.log('');

  const hits = strict.found;

  if (hits.length > 0) {
    console.log('  Examples:');
    for (const h of hits.slice(0, 5)) {
      console.log(`    "${h.word}" realizes [${h.template.a.map(x => x || 'eps').join(', ')}], d = [${h.template.d[0].join(',')}]`);
    }
    console.log('');
    console.log(line);
    console.log('CONCLUSION');
    console.log(line);
    console.log('  Theorem 6 FAILS. We found a realization.');
  } else {
    console.log(line);
    console.log('CONCLUSION');
    console.log(line);
    console.log(`  No factor of length <= ${s} realizes any template of S.`);
    console.log('');
    console.log('  This means NO factor of Fact_inf(h6) realizes any template in S0.');
    console.log('  Since S0 covers all templates [eps, eps, eps, d] where Phi(d) = 0,');
    console.log('  h6^omega(a) CONTAINS NO ABELIAN SQUARES MODULO PHI.');
    console.log('');
    console.log('  This is the paper\'s Theorem 6. Verified (Level 2).');
  }
  console.log('');
}

if (require.main === module) main();
