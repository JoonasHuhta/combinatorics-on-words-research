'use strict';
/*
 * b16-independent-check.js -- INDEPENDENT cross-check of scripts/b16-bigram-lattice.js
 * after its 2026-08-02 "fix" (commit 90b7052), run 2026-08-02 by a second session
 * asked to verify "The Bridge Story" before it goes into index.html's UI.
 *
 * Method: a from-scratch, brute-force implementation that does NOT reuse
 * enumerateSAbelian's prefix-sum machinery at all. It builds every word directly,
 * slices out the two candidate half-words as actual substrings, and computes their
 * letter- and bigram-multisets from those substrings using naive counting. This is
 * the definitional check the project's own standard calls for (RESEARCH_ARCHITECT.md
 * 4: "cross-check with two code paths").
 *
 * It is deliberately simple and slow -- correctness over speed -- and is only run
 * up to a small n where brute force is still fast, then compared against
 * enumerateSAbelian's counts at the same n.
 */

const path = require('path');
const { BIGRAMS, toMask, enumerateSAbelian } = require(path.join(__dirname, '..', 'scripts', 'b16-bigram-lattice.js'));

function bigramMultiset(s) {
  const m = {};
  for (let i = 0; i + 1 < s.length; i++) {
    const bg = s[i] + s[i + 1];
    m[bg] = (m[bg] || 0) + 1;
  }
  return m;
}
function letterMultiset(s) {
  const m = { a: 0, b: 0, c: 0 };
  for (const ch of s) m[ch]++;
  return m;
}
function sAbelianEqual(u, v, S) {
  if (u.length !== v.length) return false;
  const lu = letterMultiset(u), lv = letterMultiset(v);
  for (const l of ['a', 'b', 'c']) if (lu[l] !== lv[l]) return false;
  const bu = bigramMultiset(u), bv = bigramMultiset(v);
  for (const bg of S) if ((bu[bg] || 0) !== (bv[bg] || 0)) return false;
  return true;
}

// Brute-force p_S(n): every ternary word of length n, definitional check on every
// (start, K) window pair directly on substrings -- no prefix sums anywhere.
function bruteForceP(S, n) {
  const alphabet = ['a', 'b', 'c'];
  let count = 0;
  function isSAvoiding(w) {
    const len = w.length;
    for (let K = 2; K * 2 <= len; K++) {
      for (let start = 0; start + 2 * K <= len; start++) {
        const u = w.slice(start, start + K);
        const v = w.slice(start + K, start + 2 * K);
        if (sAbelianEqual(u, v, S)) return false; // forbidden S-abelian square found
      }
    }
    return true;
  }
  function dfs(w) {
    if (w.length === n) { count++; return; }
    for (const c of alphabet) {
      const nw = w + c;
      if (isSAvoiding(nw)) dfs(nw);
    }
  }
  dfs('');
  return count;
}

function main() {
  const N = 10; // brute force is exponential-ish; 10 is fast (seconds) and discriminating
  const cases = [
    { name: 'S = {} (1-abelian)', S: [] },
    { name: 'S = all 9 (2-abelian)', S: BIGRAMS },
    { name: 'S = {aa} (diagonal singleton)', S: ['aa'] },
    { name: 'S = {ab} (off-diagonal singleton)', S: ['ab'] },
    { name: 'S = off-diagonal six {ab,ac,ba,bc,ca,cb}', S: ['ab', 'ac', 'ba', 'bc', 'ca', 'cb'] },
    { name: 'S = diagonal three {aa,bb,cc}', S: ['aa', 'bb', 'cc'] },
  ];

  console.log(`Brute-force, definitional, independent implementation. n = ${N}.\n`);
  let allMatch = true;
  for (const { name, S } of cases) {
    const bf = bruteForceP(S, N);
    const eng = enumerateSAbelian(toMask(S), N, 1e9);
    const engVal = eng.exhausted ? eng.counts[N] : 'BUDGET HIT';
    const match = bf === engVal;
    if (!match) allMatch = false;
    console.log(`${name}`);
    console.log(`  brute force p(${N})            = ${bf}`);
    console.log(`  enumerateSAbelian p(${N})       = ${engVal}   ${match ? '<- MATCH' : '<- *** MISMATCH ***'}`);
  }
  console.log(`\nOverall: ${allMatch ? 'the fixed enumerateSAbelian AGREES with an independent brute-force definitional check at n=${N}, for every case tried' : '*** DISAGREEMENT FOUND -- do not trust rows 90-93 until resolved ***'}`);
}

main();
