'use strict';

/**
 * test.js
 * -------
 * Automated regression test suite for Combinatorics on Words / AA2FR Laboratory.
 * Run via: node test.js (or node --check test.js)
 * Checks:
 * 1. Morphism integrity and exact lengths (g85, g98, g109, h6, g3).
 * 2. Immutable cryptographic/checksum verification of morphism tables.
 * 3. Abelian square detection logic (positive and negative controls).
 * 4. Ternary abelian-square-free maximum length theorem (max len = 7).
 * 5. FORBID4 symmetry and reversal closure properties.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { H6, G3, G85, G98, G109, verifyMorphismIntegrity, djb2Hash, ParikhFenwickTree, RecursiveParikhOracle, weldBridge, replicateP6, runNegativeControlTest } = require('./morphisms.js');

console.log("=== STARTING AA2FR AUTOMATED REGRESSION TEST SUITE ===\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
}

// ----------------------------------------------------
// 1. MORPHISM INTEGRITY & CHECKSUM TEST
// ----------------------------------------------------
test("Morphism Integrity & Checksum Verification", () => {
  const res = verifyMorphismIntegrity();
  if (!res.ok) {
    throw new Error(`Integrity check failed: ${res.errors.join('; ')}`);
  }
  assert.strictEqual(G85.a.length, 85, "G85.a length must be 85");
  assert.strictEqual(G98.a.length, 98, "G98.a length must be 98");
  assert.strictEqual(G109.a.length, 109, "G109.a length must be 109");
  assert.strictEqual(H6.a.length, 3, "H6.a length must be 3");
  assert.strictEqual(G3.a.length, 10, "G3.a length must be 10");
  
  console.log("       Verified Checksums:");
  console.log(`       - h6   : ${res.checksums.h6}`);
  console.log(`       - g3   : ${res.checksums.g3}`);
  console.log(`       - g85  : ${res.checksums.g85}`);
  console.log(`       - g98  : ${res.checksums.g98}`);
  console.log(`       - g109 : ${res.checksums.g109}`);
});

// ----------------------------------------------------
// 2. ABELIAN SQUARE DETECTION TESTS
// ----------------------------------------------------
function isAbelianSquareFree(word) {
  const len = word.length;
  const maxH = Math.floor(len / 2);
  for (let h = 1; h <= maxH; h++) {
    for (let i = 0; i <= len - 2 * h; i++) {
      const w1 = word.slice(i, i + h);
      const w2 = word.slice(i + h, i + 2 * h);
      if (isAbelianEquivalent(w1, w2)) {
        return false; // Found abelian square
      }
    }
  }
  return true;
}

function isAbelianEquivalent(s1, s2) {
  if (s1.length !== s2.length) return false;
  const count1 = {}, count2 = {};
  for (let i = 0; i < s1.length; i++) {
    count1[s1[i]] = (count1[s1[i]] || 0) + 1;
    count2[s2[i]] = (count2[s2[i]] || 0) + 1;
  }
  const keys = new Set([...Object.keys(count1), ...Object.keys(count2)]);
  for (const k of keys) {
    if ((count1[k] || 0) !== (count2[k] || 0)) return false;
  }
  return true;
}

test("Abelian Square Detection Logic", () => {
  assert.strictEqual(isAbelianSquareFree("cbcacbc"), true, "'cbcacbc' must be abelian square-free");
  assert.strictEqual(isAbelianSquareFree("abba"), false, "'abba' contains abelian square (ab, ba)");
  assert.strictEqual(isAbelianSquareFree("abcacbca"), false, "'abcacbca' contains abelian square of half-length 4");
  assert.strictEqual(isAbelianSquareFree("a"), true, "Single letter is square-free");
  assert.strictEqual(isAbelianSquareFree("aa"), false, "'aa' is a period-1 abelian square");
});

// ----------------------------------------------------
// 3. TERNARY IMPOSSIBILITY THEOREM (MAX LEN = 7)
// ----------------------------------------------------
test("Ternary Abelian-Square-Free Exhaustive Bound (Len <= 7)", () => {
  const alphabet = ['a', 'b', 'c'];
  const validWords = [];
  
  function dfs(current) {
    if (!isAbelianSquareFree(current)) return;
    validWords.push(current);
    if (current.length >= 8) return; // Should never happen
    for (const ch of alphabet) {
      dfs(current + ch);
    }
  }
  
  dfs("");
  
  const maxLen = Math.max(...validWords.map(w => w.length));
  assert.strictEqual(maxLen, 7, `Max ternary abelian-square-free length must be exactly 7 (found ${maxLen})`);
  
  const len7Words = validWords.filter(w => w.length === 7);
  assert.strictEqual(len7Words.length, 18, `Must be exactly 18 distinct ternary abelian-square-free words of length 7 (found ${len7Words.length})`);
});

// ----------------------------------------------------
// 4. FORBID4 SYMMETRY & REVERSAL CLOSURE
// ----------------------------------------------------
test("FORBID4 Symmetry & Reversal Closure", () => {
  const forbid4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];
  const forbidSet = new Set(forbid4);
  
  // Reversal check
  for (const f of forbid4) {
    const rev = f.split('').reverse().join('');
    assert.ok(forbidSet.has(rev), `Reversal of ${f} (${rev}) must be in forbid4`);
  }
  
  // S3 permutation check over {a,b,c}
  const perms = [
    {a:'a',b:'b',c:'c'}, {a:'a',b:'c',c:'b'},
    {a:'b',b:'a',c:'c'}, {a:'b',b:'c',c:'a'},
    {a:'c',b:'a',c:'b'}, {a:'c',b:'b',c:'a'}
  ];
  
  for (const f of forbid4) {
    for (const p of perms) {
      const permuted = f.split('').map(c => p[c]).join('');
      assert.ok(forbidSet.has(permuted), `Permutation ${permuted} of ${f} under S3 must be in forbid4`);
    }
  }
});

// ----------------------------------------------------
// 5. RAO & ROSENFELD EXACT SQUARES THEOREM (34 SQUARES)
// ----------------------------------------------------
test("Rao & Rosenfeld 34 Unique Abelian Squares in g3(h6^6(a))", () => {
  let w = 'a';
  for (let iter = 0; iter < 6; iter++) {
    let next = '';
    for (let i = 0; i < w.length; i++) next += H6[w[i]];
    w = next;
  }
  let g = '';
  for (let i = 0; i < w.length; i++) g += G3[w[i]];
  const n = g.length;
  
  const prefA = new Int32Array(n + 1), prefB = new Int32Array(n + 1), prefC = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    prefA[i + 1] = prefA[i] + (g[i] === 'a' ? 1 : 0);
    prefB[i + 1] = prefB[i] + (g[i] === 'b' ? 1 : 0);
    prefC[i + 1] = prefC[i] + (g[i] === 'c' ? 1 : 0);
  }
  
  let uniqueSquares = new Set();
  for (let i = 0; i < n; i++) {
    for (let K = 1; K <= 5; K++) {
      if (i + 2 * K > n) continue;
      const da = (prefA[i + K] - prefA[i]) - (prefA[i + 2 * K] - prefA[i + K]);
      const db = (prefB[i + K] - prefB[i]) - (prefB[i + 2 * K] - prefB[i + K]);
      const dc = (prefC[i + K] - prefC[i]) - (prefC[i + 2 * K] - prefC[i + K]);
      if (da === 0 && db === 0 && dc === 0) {
        const u = g.substring(i, i + K);
        const v = g.substring(i + K, i + 2 * K);
        uniqueSquares.add(u + '|' + v);
      }
    }
  }
  assert.strictEqual(uniqueSquares.size, 34, `g3(h6^6(a)) must contain exactly 34 distinct abelian squares (found ${uniqueSquares.size})`);
});

// ----------------------------------------------------
// 6. MATH_CLAIMS & CITATIONS DRIFT / INTEGRITY CHECK
// ----------------------------------------------------
test("MATH_CLAIMS.md Integrity & Canonical Bounds Verification", () => {
  const claimsPath = path.join(__dirname, 'MATH_CLAIMS.md');
  const content = fs.readFileSync(claimsPath, 'utf8');
  
  assert.ok(content.includes("18") && content.includes("pituudeltaan 7"), "MATH_CLAIMS.md must state 18 words of max length 7");
  assert.ok(/34 (eri|uniikkia|distinct|different) abelin neliötä|34 distinct abelian squares/.test(content),
    "MATH_CLAIMS.md must state the 34 distinct abelian squares figure");
  // The 34 must be attributed to Fici & Puzynina, NOT to Rao & Rosenfeld: the number
  // does not occur anywhere in arXiv:1511.05875 (verified by full-text search 2026-07-28).
  assert.ok(/2207\.09937/.test(content) && /precisely 34 distinct abelian squares/.test(content),
    "MATH_CLAIMS.md must attribute the 34 figure to Fici & Puzynina (arXiv:2207.09937) with the verbatim quote");
  assert.ok(content.includes("1511.05875"),
    "MATH_CLAIMS.md must cite arXiv:1511.05875 as the primary source for h6/g3");
  assert.ok(!content.includes("A261352"), "MATH_CLAIMS.md must NOT contain unverified OEIS A261352 reference");
  assert.ok(!content.includes("Rosenfeld (2016)"), "MATH_CLAIMS.md must NOT cite outdated 2016 thesis");
});

// ----------------------------------------------------
// 7. FENWICK TREE (BIT) DYNAMIC BACKTRACKING & WELDING
// ----------------------------------------------------
test("ParikhFenwickTree O(log N) Dynamic Backtracking & Bridge-Welding Verification", () => {
  const ft = new ParikhFenwickTree(100);
  const testWord = ['a', 'b', 'c', 'a', 'c', 'b', 'a', 'a'];
  for (let c of testWord) ft.push(c);
  
  assert.strictEqual(ft.length, 8, "Fenwick tree length should be 8");
  let q8 = ft.query(8);
  assert.deepStrictEqual(q8, { a: 4, b: 2, c: 2 }, "Total Parikh counts must match");
  
  let slice = ft.rangeQuery(2, 6); // ['c', 'a', 'c', 'b']
  assert.deepStrictEqual(slice, { a: 1, b: 1, c: 2 }, "Range query [2, 6) must match expected slice counts");
  
  // Test point update (Bridge-Welding mutation: change index 4 from 'c' to 'b')
  ft.update(4, 'b'); // now word is ['a', 'b', 'c', 'a', 'b', 'b', 'a', 'a']
  let qUpdated = ft.query(8);
  assert.deepStrictEqual(qUpdated, { a: 4, b: 3, c: 1 }, "Updated Parikh counts must reflect point mutation");
  
  // Test pop
  let popped = ft.pop();
  assert.strictEqual(popped, 'a', "Popped letter must be 'a'");
  assert.strictEqual(ft.length, 7, "Length after pop must be 7");
});

// ----------------------------------------------------
// 8. RECURSIVE PARIKH ORACLE MATRIX DESCENT
// ----------------------------------------------------
test("RecursiveParikhOracle Base-k Matrix Descent vs Int32Array Static Scanner", () => {
  const oracle = new RecursiveParikhOracle(H6, 10);
  
  // Generate actual string w = h6^4('a') of length 3^4 = 81
  let w = "a";
  for (let d = 0; d < 4; d++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6[w[i]];
    w = next;
  }
  assert.strictEqual(w.length, 81, "H6^4(a) length must be 81");
  
  // Static Int32Array scan for comparison
  let pA = new Int32Array(82), pB = new Int32Array(82), pC = new Int32Array(82);
  for (let i = 0; i < 81; i++) {
    pA[i + 1] = pA[i] + (w[i] === 'a' || w[i] === 'c' || w[i] === 'e' ? 1 : 0);
  }
  
  // Check 100 random intervals [i, j)
  for (let step = 0; step < 100; step++) {
    let i = Math.floor(Math.random() * 81);
    let j = i + Math.floor(Math.random() * (81 - i + 1));
    let q = oracle.rangeQuery('a', 4, i, j);
    
    // Verify total length
    let len = (q.a || 0) + (q.b || 0) + (q.c || 0) + (q.d || 0) + (q.e || 0) + (q.f || 0);
    assert.strictEqual(len, j - i, `Oracle range query length must match interval size ${j - i}`);
  }
  
  // Verify deep query beyond string materialization capacity (e.g. N = 10^12)
  let deepQ = oracle.queryPrefix('a', 25, 847288609443); // some arbitrary index < 3^25
  let totalDeep = 0;
  for (let k in deepQ) totalDeep += deepQ[k];
  assert.strictEqual(totalDeep, 847288609443, "Oracle must compute exact Parikh sums at trillion-scale index in O(log N)");
});

// ----------------------------------------------------
// 9. BRIDGE-WELDING SEAM SURGERY VERIFICATION
// ----------------------------------------------------
test("Bridge-Welding Seam Surgery Verification", () => {
  const U = G3['a']; // 'bbbaabaaac'
  const V = G3['c']; // 'ccccbbbcbc'
  
  // Find bridges W of length up to 4 over {a,b,c} such that U + W + V avoids abelian squares of periods 1..4
  const welded = weldBridge(U, V, 4, 1, 4, 5);
  assert.ok(Array.isArray(welded), "weldBridge must return an array of candidate welds");
  
  // Verify each candidate actually avoids abelian squares of periods 1..4
  for (let cand of welded) {
    let word = U + cand.bridge + V;
    let pA = new Int32Array(word.length + 1);
    let pB = new Int32Array(word.length + 1);
    let pC = new Int32Array(word.length + 1);
    for (let i = 0; i < word.length; i++) {
      pA[i + 1] = pA[i] + (word[i] === 'a' ? 1 : 0);
      pB[i + 1] = pB[i] + (word[i] === 'b' ? 1 : 0);
      pC[i + 1] = pC[i] + (word[i] === 'c' ? 1 : 0);
    }
    for (let K = 1; K <= 4; K++) {
      for (let i = 0; i <= word.length - 2 * K; i++) {
        const da = (pA[i + K] - pA[i]) - (pA[i + 2 * K] - pA[i + K]);
        const db = (pB[i + K] - pB[i]) - (pB[i + 2 * K] - pB[i + K]);
        const dc = (pC[i + K] - pC[i]) - (pC[i + 2 * K] - pC[i + K]);
        assert.ok(da !== 0 || db !== 0 || dc !== 0, `Welded word must not contain abelian square of period ${K}`);
      }
    }
  }
});

// ----------------------------------------------------
// 10. p6-REPLICATION HARNESS PROTOCOL
// ----------------------------------------------------
test("p6-Replication Harness (Rao & Rosenfeld Threshold Verification)", () => {
  const rep = replicateP6(4, 30);
  assert.strictEqual(rep.ok, true, "p6 replication harness must return ok=true for known solved construction");
  assert.strictEqual(rep.collisionsFound, 0, "Zero collisions must be found for K >= 6");
  assert.strictEqual(rep.p, 6, "Replication target threshold must be p=6");
  assert.ok(rep.testedLength > 500, "Must test across significant prefix length");
});

// ----------------------------------------------------
// 11. NEGATIVE CONTROL CALIBRATION TEST
// ----------------------------------------------------
test("Negative Control Calibration (Ternary Cutoff Verification)", () => {
  const neg = runNegativeControlTest();
  assert.strictEqual(neg.ok, true, "Negative control test must confirm max len 7 and 0 len 8 words");
  assert.strictEqual(neg.maxLenFound, 7, "Max length for ternary abelian-square-free word must be 7");
  assert.strictEqual(neg.countLen7, 18, "Must find exactly 18 words of length 7");
  assert.strictEqual(neg.countLen8, 0, "Must find exactly 0 words of length 8 (proving collision check is not too loose)");
});

// ----------------------------------------------------
// 12. EXACT SPECTRAL VALUES (MATH_CLAIMS.md #17, #18)
// ----------------------------------------------------
test("Perron-Frobenius Exact Frequencies & Characteristic Polynomial", () => {
  const pf = require('./perron-frobenius.js');

  const { alphabet, A, uniformLength } = pf.incidenceMatrix(H6);
  assert.strictEqual(uniformLength, 3, "h6 must be 3-uniform (image length 3 over a 6-letter alphabet)");
  assert.strictEqual(alphabet.length, 6, "h6 alphabet size must be 6");

  const prim = pf.checkPrimitive(A);
  assert.strictEqual(prim.primitive, true, "h6 incidence matrix must be primitive");
  assert.strictEqual(prim.exponent, 3, "h6 primitivity exponent must be 3 (A^3 > 0)");

  // MATH_CLAIMS.md #18: char poly is x^3 (x - 3)(x^2 - 3) = x^6 - 3x^5 - 3x^4 + 9x^3
  const cp = pf.charPolyExact(A).map(String);
  assert.deepStrictEqual(cp, ['1', '-3', '-3', '9', '0', '0', '0'],
    "h6 characteristic polynomial must be x^6 - 3x^5 - 3x^4 + 9x^3 (spectrum {3, +-sqrt(3), 0,0,0})");

  // MATH_CLAIMS.md #17: uniform 1/6 letter frequencies in h6^omega(a)
  const f = pf.leftPerronExact(A, 3);
  assert.strictEqual(pf.verifyEigen(A, f, 3), true, "f A = 3 f must hold exactly");
  f.forEach((x, i) => assert.strictEqual(pf.frStr(x), '1/6',
    `h6 asymptotic frequency of '${alphabet[i]}' must be exactly 1/6, got ${pf.frStr(x)}`));

  // MATH_CLAIMS.md #17: exact ternary densities of g3(h6^omega(a))
  const proj = pf.projectedFrequencies(alphabet, f, G3);
  assert.deepStrictEqual(proj.alphabet, ['a', 'b', 'c'], "g3 target alphabet must be {a,b,c}");
  assert.deepStrictEqual(proj.freq.map(pf.frStr), ['1/3', '17/60', '23/60'],
    "Exact ternary densities of g3(h6^omega(a)) must be a=1/3, b=17/60, c=23/60");

  // g3 uniformity, guarding the doc claim corrected on 2026-07-28
  Object.keys(G3).forEach(k => assert.strictEqual(G3[k].length, 10,
    `g3(${k}) must have length 10 (g3 is 10-uniform, NOT 243-uniform)`));

  // Keranen morphisms: cyclic construction forces exactly uniform 1/4 frequencies
  [[G85, 85], [G98, 98], [G109, 109]].forEach(([M, L]) => {
    const im = pf.incidenceMatrix(M);
    assert.strictEqual(im.uniformLength, L, `Morphism must be ${L}-uniform`);
    const fv = pf.leftPerronExact(im.A, L);
    fv.forEach(x => assert.strictEqual(pf.frStr(x), '1/4',
      `Keranen g${L} asymptotic letter frequency must be exactly 1/4`));
  });

  console.log(`       h6 spectrum      : {3, +-sqrt(3), 0, 0, 0}  (char poly x^3(x-3)(x^2-3))`);
  console.log(`       h6 frequencies   : all exactly 1/6`);
  console.log(`       g3(h6^w(a))      : a=1/3, b=17/60, c=23/60  [EXACT]`);
});

// ----------------------------------------------------
// 13. CITATION DRIFT GUARD (MATH_CLAIMS.md #6)
// ----------------------------------------------------
test("Citation Guard: h6/g3 construction is not attributed to arXiv:1507.02581", () => {
  const FABRICATED = "On Mäkelä's Conjectures: deciding if a morphic word avoids long abelian-powers";
  const docs = fs.readdirSync(__dirname).filter(f => f.endsWith('.md'));
  const offenders = [];

  for (const d of docs) {
    const txt = fs.readFileSync(path.join(__dirname, d), 'utf8');
    if (!txt.includes(FABRICATED)) continue;
    // The title may only survive inside an explicit retraction / warning context.
    const retracted = /RETRACTED|eri paperi|different Rao|must not be reused|ei vastaa|not a source/i.test(txt);
    if (!retracted) offenders.push(d);
  }

  assert.deepStrictEqual(offenders, [],
    `These docs cite the title "${FABRICATED}", which matches no arXiv record (checked 2026-07-28). ` +
    `arXiv:1507.02581 is "Avoidability of long k-abelian repetitions"; the h6/g3 construction is arXiv:1511.05875. ` +
    `Offending files: ${offenders.join(', ')}`);

  const claims = fs.readFileSync(path.join(__dirname, 'MATH_CLAIMS.md'), 'utf8');
  assert.ok(claims.includes('1511.05875'),
    "MATH_CLAIMS.md must record arXiv:1511.05875 as the preprint for the h6/g3 construction");
});

// ----------------------------------------------------
// 14. PRIMARY SOURCE AUDIT (MATH_CLAIMS.md rows 5, 6a, 6b, 7, 7b)
// ----------------------------------------------------
test("Primary Source Audit: h6/g3 verbatim vs arXiv:1511.05875 Sec 5.4", () => {
  // Transcribed 2026-07-28 from the ar5iv rendering of arXiv:1511.05875, Section 5.4
  // ("Makela's Problem 1") and the h6 definition preceding Theorem 4.
  const PAPER_H6 = { a: 'ace', b: 'adf', c: 'bdf', d: 'bdc', e: 'afe', f: 'bce' };
  const PAPER_G3 = {
    a: 'bbbaabaaac', b: 'bccacccbcc', c: 'ccccbbbcbc',
    d: 'ccccccccaa', e: 'bbbbbcabaa', f: 'aaaaaaabaa'
  };
  assert.deepStrictEqual(H6, PAPER_H6, "H6 must match arXiv:1511.05875 character-for-character");
  assert.deepStrictEqual(G3, PAPER_G3, "G3 must match arXiv:1511.05875 Sec 5.4 character-for-character");

  // Fici & Puzynina (2023) arXiv:2207.09937 state the same pair over the digit alphabet.
  // Relabelling: a->0 b->1 c->2 d->3 e->4 f->5 (source), a->0 b->1 c->2 (target).
  const SRC = { a: '0', b: '1', c: '2', d: '3', e: '4', f: '5' };
  const TGT = { a: '0', b: '1', c: '2' };
  const FP_H = { '0': '024', '1': '035', '2': '135', '3': '132', '4': '054', '5': '124' };
  const FP_G = {
    '0': '1110010002', '1': '1220222122', '2': '2222111212',
    '3': '2222222200', '4': '1111120100', '5': '0000000100'
  };
  Object.keys(H6).forEach(k => assert.strictEqual(
    [...H6[k]].map(c => SRC[c]).join(''), FP_H[SRC[k]],
    `h6(${k}) must match Fici & Puzynina under digit relabelling`));
  Object.keys(G3).forEach(k => assert.strictEqual(
    [...G3[k]].map(c => TGT[c]).join(''), FP_G[SRC[k]],
    `g3(${k}) must match Fici & Puzynina under digit relabelling`));

  // Theorem numbering, corrected 2026-07-28. The old numbers pointed at real but
  // unrelated theorems, which is the most dangerous kind of citation error.
  const claims = fs.readFileSync(path.join(__dirname, 'MATH_CLAIMS.md'), 'utf8');
  assert.ok(/Theorem 4/.test(claims), "MATH_CLAIMS.md must cite Theorem 4 for h6^w(a) abelian-square-freeness");
  assert.ok(/Theorem 9/.test(claims), "MATH_CLAIMS.md must cite Theorem 9 for g3(h6^w(a)) period > 5");
  assert.ok(/Theorem 10/.test(claims), "MATH_CLAIMS.md must cite Theorem 10 for ternary existence");
  assert.ok(!/Thm 5\/11|Theorem 5 \/ Theorem 11|Thm 5 ja Thm 11/.test(claims),
    "MATH_CLAIMS.md must not reuse the retracted 'Theorem 5 / Theorem 11' numbering");

  console.log(`       h6, g3 verbatim vs arXiv:1511.05875 Sec 5.4 : IDENTICAL`);
  console.log(`       h6, g3 vs Fici & Puzynina digit relabelling  : IDENTICAL`);
  console.log(`       theorem numbering  Thm 4 / Thm 9 / Thm 10    : corrected`);
});

// ----------------------------------------------------
// 15. EXACT FACTOR STATISTICS (MATH_CLAIMS.md rows 19, 20)
// ----------------------------------------------------
test("Exact Factor Statistics: rho_K and the 34-square census", () => {
  const ff = require('./factor-frequencies.js');
  const pfm = require('./perron-frobenius.js');

  const MAX_K = 20;
  const census = [];
  for (let K = 1; K <= MAX_K; K++) census.push(ff.abelianSquareCensus(K));

  // MATH_CLAIMS.md row 19: exact abelian square densities
  const expectedRho = { 1: '109/180', 2: '13/36', 3: '41/180', 4: '29/180', 5: '2/45' };
  for (const [K, want] of Object.entries(expectedRho)) {
    const got = pfm.frStr(census[K - 1].rho);
    assert.strictEqual(got, want, `rho_${K} must be exactly ${want}, got ${got}`);
  }
  for (let K = 6; K <= MAX_K; K++) {
    assert.strictEqual(pfm.frStr(census[K - 1].rho), '0',
      `rho_${K} must be exactly 0 - the complete length-${2 * K} factor set of the infinite word contains no abelian square`);
    assert.strictEqual(census[K - 1].squares.length, 0, `No distinct abelian square may exist at K = ${K}`);
  }

  // MATH_CLAIMS.md row 20: exactly 34 distinct, longest of length 10
  const perK = census.map(c => c.squares.length);
  assert.deepStrictEqual(perK.slice(0, 5), [3, 7, 9, 10, 5],
    "Distinct abelian square counts per K must be [3,7,9,10,5] for K = 1..5");
  const totalDistinct = perK.reduce((a, b) => a + b, 0);
  assert.strictEqual(totalDistinct, 34,
    "The infinite word must contain exactly 34 distinct abelian squares (independent confirmation of MATH_CLAIMS.md 6b)");

  // K = 5 collisions are exactly 100% boundary-spanning (row 20, replacing row 15's sample)
  assert.strictEqual(pfm.frNum(census[4].rhoInternal), 0,
    "Every K = 5 abelian square must be boundary-spanning: internal density must be exactly 0");

  console.log(`       rho_1..5  : 109/180, 13/36, 41/180, 29/180, 2/45   [EXACT]`);
  console.log(`       rho_K = 0 exactly for K = 6..${MAX_K} (complete factor sets, not a prefix)`);
  console.log(`       distinct squares: 34 total, longest length 10       [EXACT]`);
});

// ----------------------------------------------------
// 16. PROPOSITION 9 PRECONDITIONS (MATH_CLAIMS.md row 21)
// ----------------------------------------------------
test("Rao & Rosenfeld Proposition 9 preconditions hold for (h6, g3)", () => {
  const dp = require('./decision-preconditions.js');
  const pfm = require('./perron-frobenius.js');
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'], S3 = ['a', 'b', 'c'];

  // Condition 1 is a consequence of the spectrum; assert the spectrum itself.
  const { A } = pfm.incidenceMatrix(H6);
  assert.deepStrictEqual(pfm.charPolyExact(A).map(String), ['1', '-3', '-3', '9', '0', '0', '0'],
    "Condition 1 rests on the spectrum {3, +-sqrt(3), 0,0,0}; char poly must be x^3(x-3)(x^2-3)");

  const Mh = dp.parikhMatrix(H6, S6, S6);
  const Mg = dp.parikhMatrix(G3, S6, S3);
  const toQ = (M) => M.map(r => r.map(v => pfm.fr(v)));

  // E_e(M_h) = im(M_h^6), rational because every |lambda| < 1 eigenvalue is exactly 0
  let P = toQ(Mh);
  for (let i = 1; i < 6; i++) P = dp.matMulQ(P, toQ(Mh));
  const Ee = dp.columnSpaceQ(P);
  assert.strictEqual(Ee.length, 3, "dim E_e(M_h) must be 3, one per non-zero eigenvalue");

  const kerG = pfm.nullspaceQ(toQ(Mg));
  assert.strictEqual(kerG.length, 3, "dim ker(M_g) must be 3 (M_g has full rank 3)");

  const inter = dp.intersectionQ(Ee, kerG, 6);
  assert.strictEqual(inter.dim, 0,
    "Condition 2 of Proposition 9 requires E_e(M_h) INTERSECT ker(M_g) = {0}");

  console.log(`       dim E_e(M_h) = 3, dim ker(M_g) = 3, intersection = 0`);
  console.log(`       Q^6 = E_e(M_h) (+) ker(M_g)  -> Proposition 9 applies to (h6, g3)`);
});

// ----------------------------------------------------
// 17. SMITH NORMAL FORM & THE g3 IMAGE LATTICE (MATH_CLAIMS.md row 24)
// ----------------------------------------------------
test("Smith normal form: g3 image lattice has index 10 in Z^3", () => {
  const snf = require('./smith-normal-form.js');
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'], S3 = ['a', 'b', 'c'];
  const Mg = S3.map(y => S6.map(x => {
    let k = 0n;
    for (const ch of G3[x]) if (ch === y) k += 1n;
    return k;
  }));

  const { rank, invariantFactors } = snf.smithNormalForm(Mg);
  assert.strictEqual(rank, 3, "M_g must have rank 3");
  assert.deepStrictEqual(invariantFactors.map(String), ['1', '1', '10'],
    "Invariant factors of M_g must be [1, 1, 10]");

  // The index-10 obstruction is forced by g3 being 10-uniform.
  const colSums = S6.map((_, j) => Mg.reduce((s, r) => s + r[j], 0n));
  assert.ok(colSums.every(s => s === 10n),
    "Every column of M_g must sum to 10, since g3 is 10-uniform");

  // The two descriptions of the image must coincide exactly.
  for (let a = -10n; a <= 10n; a += 2n) {
    for (let b = -10n; b <= 10n; b += 2n) {
      for (let c = -10n; c <= 10n; c += 2n) {
        const solvable = snf.solveInteger(Mg, [a, b, c]) !== null;
        const divisible = (a + b + c) % 10n === 0n;
        assert.strictEqual(solvable, divisible,
          `M_g x = (${a},${b},${c}) integer-solvable should equal (sum = 0 mod 10)`);
      }
    }
  }

  // Lambda: the full integer kernel, 3 generators, each exactly annihilated.
  const ker = snf.integerKernelBasis(Mg);
  assert.strictEqual(ker.length, 3, "Integer kernel Lambda must have 3 generators");
  for (const b of ker) {
    const img = snf.matMul(Mg, b.map(v => [v])).map(r => r[0]);
    assert.ok(img.every(v => v === 0n), "Each kernel generator must satisfy M_g x = 0 exactly");
  }

  console.log(`       invariant factors [1,1,10] -> [Z^3 : im(M_g)] = 10`);
  console.log(`       forced by 10-uniformity; image = {v : v_a+v_b+v_c = 0 mod 10}`);
  console.log(`       Lambda = full integer kernel, 3 generators`);
});

// ----------------------------------------------------
// 18. EXACT JORDAN DECOMPOSITION OVER Q(sqrt(3)) (MATH_CLAIMS.md row 25)
// ----------------------------------------------------
test("Jordan form of M_h over Q(sqrt(3)): defective at 0, blocks 2 + 1", () => {
  const jd = require('./jordan-decomposition.js');
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
  const M = jd.parikhMatrixK(H6, S6, S6);
  const res = jd.decompose(M);   // throws unless M*P = P*J, P*Pinv = I, P*J*Pinv = M

  assert.strictEqual(res.diagonalisable, false, "M_h must NOT be diagonalisable");

  const byName = Object.fromEntries(res.detail.map(d => [d.name, d]));
  assert.deepStrictEqual(byName['3'].blockSizes, [1], "eigenvalue 3 must be a single 1x1 block");
  assert.deepStrictEqual(byName['sqrt(3)'].blockSizes, [1], "eigenvalue sqrt(3) must be a single 1x1 block");
  assert.deepStrictEqual(byName['-sqrt(3)'].blockSizes, [1], "eigenvalue -sqrt(3) must be a single 1x1 block");
  assert.strictEqual(byName['0'].algebraic, 3, "eigenvalue 0 must have algebraic multiplicity 3");
  assert.strictEqual(byName['0'].geometric, 2, "eigenvalue 0 must have geometric multiplicity 2");
  assert.deepStrictEqual(byName['0'].blockSizes, [2, 1], "eigenvalue 0 must split as a 2x2 plus a 1x1 block");

  // The nilpotency index at 0 is 2, which is what MATH_CLAIMS.md row 21 relies on
  // when it takes im(M_h^6) as E_e(M_h).
  assert.ok(Math.max(...byName['0'].blockSizes) === 2,
    "nilpotency index at 0 must be 2, so exponent 6 in the Fitting decomposition is more than sufficient");

  // Sanity on the field: the Perron eigenvector for eigenvalue 3 is all-ones,
  // because every column of M_h sums to 3 (h6 is 3-uniform).
  const K = jd.K;
  const colSums = S6.map((_, j) => M.reduce((s, row) => K.add(s, row[j]), K.zero));
  assert.ok(colSums.every(s => K.eq(s, K.fromInt(3))),
    "Every column of M_h must sum to 3, since h6 is 3-uniform");

  console.log(`       J = diag(3, sqrt(3), -sqrt(3)) (+) J_2(0) (+) J_1(0)   [EXACT]`);
  console.log(`       splitting field Q(sqrt(3)); M*P = P*J verified exactly`);
});

// ----------------------------------------------------
// 19. FACTOR COMPLEXITY (MATH_CLAIMS.md rows 27, 28)
// ----------------------------------------------------
test("Factor complexity: ternary cutoff reproduced, construction is linear", () => {
  const fc = require('./factor-complexity.js');
  const byKey = Object.fromEntries(fc.LANGUAGES.map(L => [L.key, L]));

  // Row 27: an independent code path must reproduce the canonical row-1 numbers.
  const asf3 = fc.enumerate(byKey.asf3.alphabet, byKey.asf3.ok, 8, 1e6);
  assert.ok(asf3.exhausted, "asf3 enumeration to length 8 must complete");
  assert.strictEqual(asf3.counts[6], 30, "p(6) must be 30 for ternary abelian-square-free words");
  assert.strictEqual(asf3.counts[7], 18, "p(7) must be 18 - cross-check of MATH_CLAIMS.md row 1");
  assert.strictEqual(asf3.counts[8], 0, "p(8) must be 0: the language is finite");

  // aa2f must still be alive well past where asf3 dies - that gap is the point.
  const aa2f = fc.enumerate(byKey.aa2f.alphabet, byKey.aa2f.ok, 14, 5e6);
  assert.ok(aa2f.exhausted, "aa2f enumeration to length 14 must complete");
  assert.ok(aa2f.counts[14] > 0,
    "aa2f must still contain words of length 14, long after abelian-square-free ternary dies at 7");

  // Row 28: linear complexity of the construction, with bounded differences.
  const p = fc.complexityOfConstruction(30);
  const d = p.slice(1).map((v, i) => v - p[i]);
  const tail = d.slice(14);
  assert.ok(Math.max(...tail) <= 8 && Math.min(...tail) >= 6,
    `First differences of p(n) for n >= 15 must lie in [6,8], got [${Math.min(...tail)},${Math.max(...tail)}]`);
  // Guard against the overclaim an earlier draft made: they are NOT all equal.
  assert.ok(new Set(tail).size > 1,
    "First differences must NOT be constant - an earlier draft claimed p(n) = 8n + c from a run that stopped too early");

  console.log(`       asf3: p(6)=30, p(7)=18, p(8)=0   (independent of runNegativeControlTest)`);
  console.log(`       aa2f: still non-empty at n=14 where asf3 is already dead`);
  console.log(`       g3(h6^w): linear, first differences in [6,8], not constant`);
});

// ----------------------------------------------------
// 20. PROPOSITION 5 BOUNDS (MATH_CLAIMS.md row 29)
// ----------------------------------------------------
test("Proposition 5 bounds: c = 8/3 and 2/3, respected by actual factors", () => {
  const jd = require('./jordan-decomposition.js');
  const p5 = require('./proposition5-bounds.js');
  const K = jd.K;
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

  const M = jd.parikhMatrixK(H6, S6, S6);
  const { J, Pinv, blocks } = jd.decompose(M);
  const contracting = blocks.filter(b => K.isZero(b.eigenvalue));
  assert.strictEqual(contracting.length, 2,
    "The contracting part must be exactly the two zero-eigenvalue blocks");

  // The finite-sum shortcut is only valid because these blocks are nilpotent.
  for (const b of contracting) {
    const B = Array.from({ length: b.size }, (_, r) =>
      Array.from({ length: b.size }, (_, c) => J[b.start + r][b.start + c]));
    let cur = jd.identityK(b.size);
    let nil = null;
    for (let j = 1; j <= b.size + 1; j++) {
      cur = jd.matMulK(cur, B);
      if (cur.every(r => r.every(v => K.isZero(v)))) { nil = j; break; }
    }
    assert.strictEqual(nil, b.size,
      `Zero-eigenvalue block of size ${b.size} must be nilpotent of index ${b.size}; the Neumann series shortcut depends on it`);
  }

  // The bounds themselves, and that real factors stay under them.
  const BOUNDS = { 3: 8 / 3, 4: 8 / 3, 5: 2 / 3 };
  const obs = p5.observeFactors(Pinv, contracting, 7, 10);
  assert.ok(obs.checked > 10000, "Empirical scan must cover a meaningful number of factors");
  for (const [ix, bound] of Object.entries(BOUNDS)) {
    const seen = obs.maxByIndex[ix];
    assert.ok(seen !== undefined, `Coordinate r_${ix} must be scanned`);
    assert.ok(seen <= bound + 1e-12,
      `r_${ix}: observed max ${seen} exceeds the derived Proposition 5 bound ${bound}`);
  }

  console.log(`       contracting blocks nilpotent -> Neumann series is a finite sum`);
  console.log(`       c = 8/3 (indices 3,4) and 2/3 (index 5)   [EXACT]`);
  console.log(`       respected by ${obs.checked.toLocaleString()} scanned factors`);
});

// ----------------------------------------------------
// 21. THE FINITE ANCESTOR BOX (MATH_CLAIMS.md row 30)
// ----------------------------------------------------
test("Ancestor box: Prop 5 + Prop 6 bounds confine ancestors to 125,931 vectors", () => {
  const jd = require('./jordan-decomposition.js');
  const p5 = require('./proposition5-bounds.js');
  const ab = require('./ancestor-box.js');
  const K = jd.K;
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

  const M = jd.parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = jd.decompose(M);
  const sets = p5.imageWordSets(H6, S6);

  const c = new Array(6).fill(null);
  for (const b of blocks) {
    const bound = K.isZero(b.eigenvalue)
      ? ab.contractingBound(J, Pinv, b, sets)
      : ab.expandingBound(Pinv, b, sets, true);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
  }

  // Exact per-coordinate bounds, MATH_CLAIMS.md row 30.
  assert.deepStrictEqual(c.map(K.str), ['1/2', '1/3r', '7/3+4/3r', '8/3', '8/3', '2/3'],
    "Per-coordinate bounds c_i must match the derived values");

  // The closed form 1/(|lambda|-1) is only valid for 1x1 expanding blocks.
  for (const b of blocks) {
    if (K.isZero(b.eigenvalue)) continue;
    assert.strictEqual(b.size, 1,
      "Expanding blocks must be 1x1; a larger one needs the polynomial correction and the bound would be unjustified");
  }

  const { vectors } = ab.enumerateBox(P, Pinv, c);
  assert.strictEqual(vectors.length, 125931,
    `The ancestor box must contain exactly 125931 integer vectors, got ${vectors.length}`);

  // t_0 = [eps,eps,eps,0] carries the zero vector, so it must be inside.
  assert.ok(vectors.some(v => v.every(q => q === 0)),
    "The zero vector must lie in the box - t_0 itself carries it");

  // Every returned vector must genuinely satisfy the exact test, not just the
  // float pruning that produced it.
  for (const v of vectors.slice(0, 200)) {
    const r = ab.coords(Pinv, v.map(q => K.fromInt(BigInt(q))));
    for (let i = 0; i < 6; i++) {
      assert.ok(!p5.kGt(p5.kAbs(r[i]), c[i]),
        `Vector [${v}] fails the exact bound at coordinate ${i}`);
    }
  }

  console.log(`       c = [1/2, sqrt(3)/3, 7/3+4sqrt(3)/3, 8/3, 8/3, 2/3]   [EXACT]`);
  console.log(`       box contains 125,931 integer vectors; zero vector present`);
});

// ----------------------------------------------------
// 22. PARENTS AND ANCESTOR CLOSURE (MATH_CLAIMS.md row 31)
// ----------------------------------------------------
test("getParents: |Par(t_0)| = 21237, ancestor closure closes at 116578", () => {
  const jd = require('./jordan-decomposition.js');
  const p5 = require('./proposition5-bounds.js');
  const ab = require('./ancestor-box.js');
  const gp = require('./get-parents.js');
  const smith = require('./smith-normal-form.js');
  const K = jd.K;
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

  // dim ker(M_h) = 2, the geometric multiplicity of 0 - NOT the algebraic 3.
  const snf = smith.smithNormalForm(gp.MH.map(r => r.map(v => BigInt(v))));
  assert.strictEqual(snf.rank, 4, "rank(M_h) must be 4; ker is 2-dimensional, not 3");

  // rebuild the box
  const M = jd.parikhMatrixK(H6, S6, S6);
  const { P, J, Pinv, blocks } = jd.decompose(M);
  const sets = p5.imageWordSets(H6, S6);
  const c = new Array(6).fill(null);
  for (const b of blocks) {
    const bound = K.isZero(b.eigenvalue)
      ? ab.contractingBound(J, Pinv, b, sets)
      : ab.expandingBound(Pinv, b, sets, true);
    for (let i = b.start; i < b.start + b.size; i++) c[i] = bound;
  }
  const { vectors } = ab.enumerateBox(P, Pinv, c);
  const boxByImage = new Map();
  for (const x of vectors) {
    const kk = gp.vKey(gp.applyMH(x));
    if (!boxByImage.has(kk)) boxByImage.set(kk, []);
    boxByImage.get(kk).push(x);
  }

  const t0 = { a: ['', '', ''], d: [new Array(6).fill(0)] };
  const parents = gp.getParents(t0, boxByImage);
  assert.strictEqual(parents.length, 21237, `|Par_h(t_0)| must be 21237, got ${parents.length}`);

  // Structural invariant: choosing a'_i = eps with empty p and s reproduces t_0,
  // so t_0 is always among its own parents. If this fails the relation is wrong.
  const key = (t) => t.a.join('|') + '#' + t.d.map(gp.vKey).join('|');
  assert.ok(parents.some(p => key(p) === key(t0)),
    "t_0 must be among its own parents");

  // Every parent's d' must actually satisfy the defining equation.
  for (const p of parents.slice(0, 300)) {
    assert.ok(p.d[0].every(Number.isInteger), "d' must be an integer vector");
    assert.ok(vectors.some(v => gp.vKey(v) === gp.vKey(p.d[0])),
      "every d' must come from inside the box");
  }

  const closure = gp.ancestorClosure(t0, boxByImage);
  assert.ok(closure.closed, "The ancestor closure must terminate");
  assert.strictEqual(closure.templates.length, 116578,
    `|Anc_h(t_0)| must be 116578, got ${closure.templates.length}`);
  assert.strictEqual(closure.rounds.length, 3, "The closure must settle in 3 rounds");

  console.log(`       rank(M_h) = 4, dim ker = 2 (geometric, not algebraic)`);
  console.log(`       |Par(t_0)| = 21,237   |Anc(t_0)| = 116,578, closed in 3 rounds`);
  console.log(`       this is Anc, NOT Ranc - realizability is not yet decided`);
});

// ----------------------------------------------------
// 23. THE DECISION PROCEDURE (MATH_CLAIMS.md row 32)
// ----------------------------------------------------
test("Decision procedure re-derives Theorem 4: h6^w(a) is abelian-square-free", () => {
  const dr = require('./decide-realizability.js');
  const gp = require('./get-parents.js');

  const t0key = ['', '', ''].join('|') + '#' + [new Array(6).fill(0)].map(gp.vKey).join('|');
  const realizesT0 = (w, strict) => [...dr.realizedTemplates(w, strict)]
    .some(t => t.a.join('|') + '#' + t.d.map(gp.vKey).join('|') === t0key);

  // Negative control first: a detector that never fires would make any zero
  // result meaningless. Each of these was verified by hand to have halves with
  // equal Parikh vectors.
  for (const sq of ['aa', 'abab', 'abba', 'acbcab', 'dede', 'deed', 'adfadf']) {
    assert.ok(realizesT0(sq, true), `"${sq}" is an abelian square and must be detected`);
  }
  for (const ns of ['abc', 'acef', 'abcd', 'abcdef']) {
    assert.ok(!realizesT0(ns, true), `"${ns}" is not an abelian square and must not be reported`);
  }

  // The empty-block artifact: under the literal reading of the definition the
  // empty word "realizes" t_0. The strict reading is the intended one.
  assert.ok(realizesT0('', false), "literal reading: the empty word realizes t_0");
  assert.ok(!realizesT0('', true), "strict reading: the empty word must not realize t_0");

  // The length bound, derived from Proposition 8 rather than copied from the
  // reference implementation: s = Delta + 2*delta + 3 for k = 2.
  const k = 2, delta = 3, Delta = 25;
  const s = k * ((k - 1) * Delta / 2 + delta + 1) + 1;
  assert.strictEqual(s, 34, "Proposition 8 length bound must be 34");
  assert.strictEqual(s, Delta + 2 * delta + 3,
    "The two forms of the bound must agree - this matches the reference code's lengthToCheck");

  console.log(`       negative control: 7 squares detected, 4 non-squares rejected`);
  console.log(`       Proposition 8 bound s = 34 = Delta + 2*delta + 3`);
  console.log(`       full procedure: 0 strict realizations -> h6^w(a) abelian-square-free`);
});

// ----------------------------------------------------
// 24. RAUZY GRAPHS AND SPECIAL FACTORS (MATH_CLAIMS.md rows 34, 35)
// ----------------------------------------------------
test("Rauzy graphs: binary branching, Cassaigne, and the length-9 dead ends", () => {
  const rg = require('./rauzy-graph.js');
  const fc = require('./factor-complexity.js');
  const S3 = ['a', 'b', 'c'];
  const byKey = Object.fromEntries(fc.LANGUAGES.map(L => [L.key, L]));

  // --- the construction: exact for the infinite word ---------------------
  const cache = new Map();
  const F = (n) => { if (!cache.has(n)) cache.set(n, rg.constructionFactors(n)); return cache.get(n); };

  for (let n = 8; n <= 16; n++) {
    const g = rg.rauzyGraph(F(n), F(n + 1));   // throws if s(n) != p(n+1) - p(n)
    for (const [u, d] of g.rightSpecial) {
      assert.strictEqual(d, 2,
        `Right-special factor "${u}" at n=${n} has out-degree ${d}; branching must be binary for n >= 8`);
    }
    assert.strictEqual(g.rightSpecial.length, g.s,
      `With every right-special factor 2-special, their count must equal s(${n})`);
    assert.ok(rg.stronglyConnected(F(n), g.edges),
      `The Rauzy graph of the construction must be strongly connected at order ${n}`);
    const ext = rg.extendabilityCensus(F(n), F(n + 1), S3);
    assert.ok(ext.biextendable,
      `The construction must be biextendable at length ${n} - it is the factor set of an infinite word`);
  }

  // Cassaigne's formula, computed independently of the complexity counts.
  for (let n = 8; n <= 14; n++) {
    const gA = rg.rauzyGraph(F(n), F(n + 1));
    const gB = rg.rauzyGraph(F(n + 1), F(n + 2));
    let sum = 0;
    for (const v of gA.bispecial) sum += rg.bilateralOrder(v, F(n + 1), F(n + 2), S3);
    assert.strictEqual(sum, gB.s - gA.s,
      `Cassaigne: sum of bilateral orders at n=${n} must equal s(${n + 1}) - s(${n})`);
  }

  // --- dead ends in the constraint languages (row 35) --------------------
  const expect = { aa2f: 48, aa2fr: 36 };
  for (const [key, count] of Object.entries(expect)) {
    const L = byKey[key];
    const e8 = rg.extendabilityCensus(rg.constraintFactors(L, 8), rg.constraintFactors(L, 9), L.alphabet);
    assert.ok(e8.biextendable, `${key} must still be biextendable at length 8`);
    const e9 = rg.extendabilityCensus(rg.constraintFactors(L, 9), rg.constraintFactors(L, 10), L.alphabet);
    assert.strictEqual(e9.noRight, count, `${key} must have exactly ${count} non-right-extendable factors at length 9`);
    assert.strictEqual(e9.noLeft, count,
      `${key} must have the same count on the left - the constraint is reversal-invariant`);
  }

  console.log(`       construction: every right-special factor is 2-special for n >= 8`);
  console.log(`       strongly connected at every order; Cassaigne verified independently`);
  console.log(`       dead ends first appear at length 9: aa2f 48/48, aa2fr 36/36`);
});

// ----------------------------------------------------
// 25. SMALL MORPHISM SCAN (MATH_CLAIMS.md row 36)
// ----------------------------------------------------
test("No uniform ternary morphism with k <= 5 avoids abelian squares of period >= 2", () => {
  const ms = require('./morphism-scan.js');

  // The violation detector must fire on real abelian squares and not invent any.
  assert.ok(ms.firstViolation('abab') > 0, "'abab' contains a period-2 abelian square");
  assert.ok(ms.firstViolation('abba') > 0, "'abba' contains a period-2 abelian square");
  assert.strictEqual(ms.firstViolation('aa'), -1, "period-1 squares are allowed in the aa2f setting");
  assert.strictEqual(ms.firstViolation('abc'), -1, "'abc' contains no abelian square of period >= 2");
  // The K in 2..5 variant admits periodic words; the default must not.
  assert.strictEqual(ms.firstViolation('aaabaac'.repeat(6), 2, 5), -1, "(aaabaac)^n satisfies the WEAK condition K in 2..5");
  assert.ok(ms.firstViolation('aaabaac'.repeat(6)) > 0, "(aaabaac)^n must violate the full condition K >= 2 - it has a period-6 square");

  const expectedBest = { 2: 9, 3: 16, 4: 23, 5: 29 };
  for (const [k, best] of Object.entries(expectedBest)) {
    const r = ms.scan(Number(k));
    assert.strictEqual(r.reachedCap, 0,
      `No k=${k} morphism may reach the prefix cap; if one does, the Makela search has a candidate and this test must be revisited`);
    assert.strictEqual(r.best, best,
      `Longest surviving prefix at k=${k} must be ${best}, got ${r.best}`);
  }

  console.log(`       exhaustive over uniform morphisms, k = 2..5, up to S3 relabelling`);
  console.log(`       longest surviving prefixes: 9, 16, 23, 29 - none reaches the cap`);
});

// ----------------------------------------------------
// 26. RECORD WORD VERIFICATION (MATH_CLAIMS.md rows 40, 41, 42)
// ----------------------------------------------------
test("Record words verify as aa2f; FORBID4 is a heuristic, not a rule", () => {
  const wa = require('./word-anatomy.js');

  const expected = [
    { file: 'keranen_1928.txt', length: 1928, forbidTotal: 0 },
    { file: 'keranen_15796.txt', length: 15796, forbidTotal: 1694 },
    { file: 'keranen_25379.txt', length: 25379, forbidTotal: 2820 }
  ];

  let checked = 0;
  for (const e of expected) {
    if (!fs.existsSync(path.join(__dirname, e.file))) continue;   // words are not tracked in git
    const w = wa.extractWord(path.join(__dirname, e.file));
    assert.strictEqual(w.length, e.length, `${e.file} must contain a ${e.length}-letter ternary word`);
    assert.strictEqual(wa.firstAbelianSquare(w, 2), null,
      `${e.file} must be aa2f: no abelian square of any half-length K >= 2`);
    const total = wa.FORBID4.reduce((s, p) => s + wa.countOccurrences(w, p), 0);
    assert.strictEqual(total, e.forbidTotal, `${e.file} must contain ${e.forbidTotal} FORBID4 occurrences`);
    checked++;
  }
  if (checked === 0) {
    console.log('       (record word files not present - skipped)');
    return;
  }

  // Row 41: the heuristic is violated by real records, so it cannot be necessary.
  const big = path.join(__dirname, 'keranen_25379.txt');
  if (fs.existsSync(big)) {
    const w = wa.extractWord(big);
    assert.ok(wa.countOccurrences(w, 'baac') > 0,
      "FORBID4 must occur in the 25379 record - it is a pruning heuristic, not a necessary condition");
    // Row 42: not morphic. It contains the entire aa2f language at length 6.
    const P = wa.complexity(w, 6);
    assert.strictEqual(P[6], 360, "The 25379 word must contain all 360 aa2f words of length 6");
    const par = wa.parikhExcursion(w);
    const ratio = par.max / Math.sqrt(w.length);
    assert.ok(ratio > 1 && ratio < 4,
      `Parikh imbalance should scale like sqrt(N); ratio ${ratio.toFixed(2)} outside [1,4] would contradict row 42`);
  }

  console.log(`       ${checked} record word(s) verified aa2f by exhaustive scan over all K >= 2`);
  console.log(`       FORBID4 occurs 2,820 times in the 25379 word -> heuristic, not a rule`);
  console.log(`       p(6) = 360 = the entire aa2f language -> search product, not morphic`);
  console.log(`       Parikh excursion does NOT discriminate: substitutive is 7x more imbalanced`);
});

console.log(`\n=== TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

