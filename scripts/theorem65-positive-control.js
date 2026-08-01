'use strict';

/**
 * theorem65-positive-control.js
 * -------------------------------
 * Step 2's positive control, rebuilt around the shape row 84 traced from the
 * primary source (Rao & Rosenfeld, arXiv:1507.02581, Theorem 2): h2 is a
 * 5-uniform morphism {0,1,2,3} -> {0,1,2}*, applied ONCE (not iterated to a
 * fixed point) to an existing infinite abelian-square-free word over four
 * letters. Quoted verbatim from the source: "If w is an infinite
 * square-free-abelian word over four letters, h2(w) is a ternary word which
 * avoid 2-abelian-squares of period at least 2."
 *
 * This script builds that construction using this project's own g85 (row 3,
 * Keranen's 85-letter 4-alphabet morphism, already Level-2-verified) as the
 * source word w, applies h2, and checks for 2-abelian squares of period >= 2
 * over a finite prefix. Theorem 2 guarantees NONE exist at any period -- so
 * this is a genuine positive control: the project's own scanning apparatus
 * is being asked to recover a result that is known, from a primary source,
 * to be there. NEXT_STEP.md Step 2 flagged the ORIGINAL control (uniform
 * ternary morphisms, k <= 6, k-abelian equivalence) as searching the wrong
 * space entirely; this one searches the space Theorem 2 actually describes.
 *
 * 2-abelian equivalence, as this project defines it (OPEN_RESEARCH_QUESTIONS.md
 * A3): two equal-length words are 2-abelian equivalent iff they have the same
 * count of every length-1 factor (letters) AND every length-2 factor
 * (bigrams, 9 of them over a ternary alphabet).
 *
 * Usage: node scripts/theorem65-positive-control.js [iterations] [maxK]
 */

const { G85 } = require('../src/morphisms.js');

const SRC = ['a', 'b', 'c', 'd']; // g85's alphabet, mapped to h2's {0,1,2,3}
const TGT = ['0', '1', '2'];      // h2's target alphabet

// h2, quoted verbatim from arXiv:1507.02581 (row 84):
//   h2(0) = 00021, h2(1) = 00111, h2(2) = 01121, h2(3) = 01221
const H2 = { a: '00021', b: '00111', c: '01121', d: '01221' };

function g85Power(n) {
  let w = 'a';
  for (let i = 0; i < n; i++) {
    let next = '';
    for (const c of w) next += G85[c];
    w = next;
  }
  return w;
}

function applyH2(w) {
  const parts = new Array(w.length);
  for (let i = 0; i < w.length; i++) parts[i] = H2[w[i]];
  return parts.join('');
}

/**
 * Fast incremental 2-abelian-square scan, sliding-window prefix sums.
 * Checks every (i, K) with minK <= K <= maxK for whether image[i..i+K) and
 * image[i+K..i+2K) are 2-abelian equivalent (same letter counts, same
 * bigram counts). Returns the first violation found, or none.
 */
function scan2AbelianSquares(word, minK, maxK) {
  const n = word.length;
  const letterIdx = { '0': 0, '1': 1, '2': 2 };
  // prefix[i][letter] and prefix[i][bigram] as flat arrays for speed.
  const pLetter = [new Int32Array(n + 1), new Int32Array(n + 1), new Int32Array(n + 1)];
  // bigrams: 3x3 = 9, indexed bigramIdx = a*3+b
  const pBigram = Array.from({ length: 9 }, () => new Int32Array(n + 1));
  for (let i = 0; i < n; i++) {
    for (let L = 0; L < 3; L++) pLetter[L][i + 1] = pLetter[L][i];
    for (let B = 0; B < 9; B++) pBigram[B][i + 1] = pBigram[B][i];
    pLetter[letterIdx[word[i]]][i + 1]++;
    if (i > 0) {
      const bIdx = letterIdx[word[i - 1]] * 3 + letterIdx[word[i]];
      pBigram[bIdx][i + 1]++;
    }
  }
  const letterCount = (s, e) => [0, 1, 2].map(L => pLetter[L][e] - pLetter[L][s]);
  const bigramCount = (s, e) => {
    // bigrams strictly inside [s,e): positions s+1..e-1 contribute via pBigram
    // (pBigram[i+1] counts the bigram ending at i, i.e. (word[i-1],word[i]))
    const arr = new Array(9);
    for (let B = 0; B < 9; B++) arr[B] = pBigram[B][e] - pBigram[B][s + 1];
    return arr;
  };

  for (let K = minK; K <= maxK; K++) {
    for (let s = 0; s + 2 * K <= n; s++) {
      const m = s + K, e = s + 2 * K;
      const l1 = letterCount(s, m), l2 = letterCount(m, e);
      if (l1[0] !== l2[0] || l1[1] !== l2[1] || l1[2] !== l2[2]) continue;
      const b1 = bigramCount(s, m), b2 = bigramCount(m, e);
      let equal = true;
      for (let B = 0; B < 9; B++) if (b1[B] !== b2[B]) { equal = false; break; }
      if (equal) return { violated: true, K, pos: s };
    }
  }
  return { violated: false };
}

/** Slow, from-definition 2-abelian equivalence check, for cross-checking. */
function is2AbelianEqual(u, v) {
  if (u.length !== v.length) return false;
  const count = (s, len) => {
    const letters = { '0': 0, '1': 0, '2': 0 };
    const bigrams = {};
    for (let i = 0; i < s.length; i++) letters[s[i]]++;
    for (let i = 0; i + 1 < s.length; i++) {
      const bg = s[i] + s[i + 1];
      bigrams[bg] = (bigrams[bg] || 0) + 1;
    }
    return { letters, bigrams };
  };
  const cu = count(u), cv = count(v);
  for (const l of ['0', '1', '2']) if (cu.letters[l] !== cv.letters[l]) return false;
  const allBigrams = new Set([...Object.keys(cu.bigrams), ...Object.keys(cv.bigrams)]);
  for (const bg of allBigrams) if ((cu.bigrams[bg] || 0) !== (cv.bigrams[bg] || 0)) return false;
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const iterations = parseInt(args[0] || '2', 10);
  const maxK = parseInt(args[1] || '2000', 10);

  const w = g85Power(iterations);
  console.log(`g85^${iterations}(a): ${w.length} symbols`);
  const image = applyH2(w);
  console.log(`h2(g85^${iterations}(a)): ${image.length} symbols`);

  // Sanity: image alphabet is exactly {0,1,2}.
  if (!/^[012]+$/.test(image)) throw new Error('h2 image contains an unexpected symbol.');

  const t0 = Date.now();
  const result = scan2AbelianSquares(image, 2, maxK);
  const elapsedS = (Date.now() - t0) / 1000;

  console.log(`scanned K in [2, ${maxK}] over ${image.length} symbols in ${elapsedS.toFixed(2)}s`);
  if (result.violated) {
    console.log(`VIOLATION FOUND: K=${result.K} at position ${result.pos}`);
    console.log('This would contradict Theorem 2 (arXiv:1507.02581) -- check the');
    console.log('implementation (2-abelian equivalence definition, h2 table, or the');
    console.log('scan itself) before concluding the theorem is wrong.');
  } else {
    console.log(`POSITIVE CONTROL PASSED: no 2-abelian square found for K in [2, ${maxK}].`);
    console.log('This is the result Theorem 2 guarantees at every period, over a finite window.');
  }

  // Independent cross-check: fast scanner vs. slow from-definition checker,
  // sampled, before trusting the fast result.
  console.log('\ncross-check: fast scanner vs. slow from-definition checker (sampled)...');
  let checked = 0, mismatches = 0;
  const sampleKs = [2, 3, 5, 10, 50, 200];
  for (const K of sampleKs) {
    if (2 * K > image.length) continue;
    for (let s = 0; s + 2 * K <= image.length; s += Math.max(1, Math.floor(image.length / 500))) {
      const u = image.slice(s, s + K), v = image.slice(s + K, s + 2 * K);
      const slow = is2AbelianEqual(u, v);
      checked++;
      if (slow) {
        mismatches++; // fast scanner claims none exist; any slow "equal" at a tested (s,K) is a mismatch
        console.log(`  MISMATCH at K=${K}, s=${s}: slow checker found equivalence, fast scanner did not report it`);
      }
    }
  }
  console.log(`cross-check: ${checked} (K,s) pairs sampled, ${mismatches} mismatches`);

  // Negative control: perturb one symbol near the start and confirm SOME
  // violation appears somewhere in a small local window (not a guarantee at
  // every perturbation, but a sanity check that the checker can fire at all).
  console.log('\nnegative control: single-symbol perturbations...');
  let caughtCount = 0, triedCount = 0;
  const localWindow = Math.min(4000, image.length);
  for (let pos = 0; pos < 50; pos++) {
    for (const ch of ['0', '1', '2']) {
      if (image[pos] === ch) continue;
      const perturbed = image.slice(0, pos) + ch + image.slice(pos + 1, localWindow);
      const r = scan2AbelianSquares(perturbed, 2, Math.min(200, maxK));
      triedCount++;
      if (r.violated) caughtCount++;
    }
  }
  console.log(`negative control: ${caughtCount}/${triedCount} single-symbol perturbations produced a 2-abelian square within K<=200 of a ${localWindow}-symbol window`);
}

if (require.main === module) main();

module.exports = { g85Power, applyH2, scan2AbelianSquares, is2AbelianEqual, H2 };
