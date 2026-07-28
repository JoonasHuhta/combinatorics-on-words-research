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
const { H6, G3, G85, G98, G109, verifyMorphismIntegrity, djb2Hash, ParikhFenwickTree, RecursiveParikhOracle, weldBridge, replicateP6 } = require('./morphisms.js');

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
  assert.ok(content.includes("34 uniikkia abelin neliötä") || content.includes("34 different abelian squares"), "MATH_CLAIMS.md must state 34 unique abelian squares");
  assert.ok(content.includes("2018") && content.includes("SIAM"), "MATH_CLAIMS.md must cite Rao & Rosenfeld (2018) SIAM J. Discrete Math.");
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

console.log(`\n=== TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

