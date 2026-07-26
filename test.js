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
const { H6, G3, G85, G98, G109, verifyMorphismIntegrity, djb2Hash } = require('./morphisms.js');

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

console.log(`\n=== TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}
