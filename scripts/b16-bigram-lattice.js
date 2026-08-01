'use strict';

/**
 * b16-bigram-lattice.js
 * -----------------------
 * OPEN_RESEARCH_QUESTIONS.md B16: the bigram-subset lattice between 1-abelian
 * (Makela, S = empty set) and 2-abelian (Theorem 65, S = all 9 bigrams)
 * equivalence. For S subseteq {aa,ab,ac,ba,bb,bc,ca,cb,cc}, S-abelian
 * equivalence of two equal-length words requires the same letter counts AND
 * the same count of every bigram in S. This script computes the exact factor
 * complexity p_S(n) of the ternary language avoiding S-abelian squares of
 * period >= 2 (Makela's own minK=2 condition, inherited unchanged), for
 * S = empty set, each of the 9 singletons, and S = all 9.
 *
 * WHY THIS REPAIRS STEP 2 AT THE ROOT (NEXT_STEP.md, row 85's own limit):
 * row 85 validated a 2-abelian checker on a DIFFERENT construction (h2 applied
 * once to g85) than the one this project's ~15 exhaustive negatives actually
 * use (raw ternary DFS under 1-abelian equivalence, e.g. `factor-complexity.js`
 * row 27). This script reuses that EXACT DFS machinery (`enumerate`'s suffix-
 * test structure) with only the equivalence predicate swapped, so a passing
 * S = all 9 result validates the search machinery the project's negative
 * results actually depend on -- not a different implementation.
 *
 * Usage: node scripts/b16-bigram-lattice.js [maxN] [budget]
 */

const BIGRAMS = ['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc'];
const LETTERS = ['a', 'b', 'c'];

/** Bitmask over BIGRAMS' indices for a given subset S (array of bigram strings). */
function toMask(S) {
  let m = 0;
  for (const bg of S) {
    const idx = BIGRAMS.indexOf(bg);
    if (idx < 0) throw new Error(`not a bigram: ${bg}`);
    m |= (1 << idx);
  }
  return m;
}

/**
 * Exact p_S(n) by exhaustive DFS with pruning, S given as a bitmask over
 * BIGRAMS. minK = 2 throughout (Makela's own condition: period-1 squares
 * "00","11","22" are allowed; only K >= 2 is forbidden).
 */
function enumerateSAbelian(mask, maxN, nodeBudget) {
  const counts = new Array(maxN + 1).fill(0);
  counts[0] = 1;

  const preLetter = Array.from({ length: 3 }, () => new Int32Array(maxN + 2));
  const preBigram = Array.from({ length: 9 }, () => new Int32Array(maxN + 2));
  const word = new Int32Array(maxN + 2);

  let nodes = 0;
  let budgetHit = false;

  function violatesAt(len, k) {
    // window1 = [len-2k, len-k), window2 = [len-k, len)
    const s = len - 2 * k, m = len - k, e = len;
    for (let L = 0; L < 3; L++) {
      if ((preLetter[L][m] - preLetter[L][s]) !== (preLetter[L][e] - preLetter[L][m])) return false;
    }
    for (let B = 0; B < 9; B++) {
      if (!(mask & (1 << B))) continue;
      if ((preBigram[B][m] - preBigram[B][s]) !== (preBigram[B][e] - preBigram[B][m])) return false;
    }
    return true;
  }

  function suffixOk(len) {
    const half = Math.floor(len / 2);
    for (let k = 2; k <= half; k++) {
      if (violatesAt(len, k)) return false;
    }
    return true;
  }

  function dfs(len) {
    if (budgetHit) return;
    if (len === maxN) return;
    for (let c = 0; c < 3; c++) {
      if (++nodes > nodeBudget) { budgetHit = true; return; }
      word[len] = c;
      for (let L = 0; L < 3; L++) preLetter[L][len + 1] = preLetter[L][len] + (L === c ? 1 : 0);
      for (let B = 0; B < 9; B++) preBigram[B][len + 1] = preBigram[B][len];
      if (len > 0) {
        const bIdx = word[len - 1] * 3 + c;
        preBigram[bIdx][len + 1]++;
      }
      if (suffixOk(len + 1)) {
        counts[len + 1]++;
        dfs(len + 1);
        if (budgetHit) return;
      }
    }
  }
  dfs(0);

  const completeUpTo = budgetHit ? -1 : maxN;
  return { counts, completeUpTo, nodes, exhausted: !budgetHit };
}

/** From-definition (slow) S-abelian equivalence, for cross-checking. */
function isSAbelianEqual(u, v, S) {
  if (u.length !== v.length) return false;
  const count = (s) => {
    const letters = { a: 0, b: 0, c: 0 };
    for (const ch of s) letters[ch]++;
    const bigrams = {};
    for (let i = 0; i + 1 < s.length; i++) {
      const bg = s[i] + s[i + 1];
      bigrams[bg] = (bigrams[bg] || 0) + 1;
    }
    return { letters, bigrams };
  };
  const cu = count(u), cv = count(v);
  for (const l of LETTERS) if (cu.letters[l] !== cv.letters[l]) return false;
  for (const bg of S) if ((cu.bigrams[bg] || 0) !== (cv.bigrams[bg] || 0)) return false;
  return true;
}

const ROW27_AA2F = [1, 3, 9, 27, 66, 162, 360, 786, 1572, 3114, 5850, 11070, 20454];

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '12', 10);
  const budget = parseFloat(args[1] || '3e7');

  console.log(`B16: S-abelian-square-free ternary language, minK=2, maxN=${maxN}, budget=${budget}`);
  console.log('');

  // ---- Validation 1: S = empty must reproduce row 27's aa2f figures exactly.
  const empty = enumerateSAbelian(0, maxN, budget);
  console.log(`S = {} (1-abelian / Makela's aa2f): complete up to n=${empty.completeUpTo}, nodes=${empty.nodes}`);
  console.log(`  p(n) = [${empty.counts.slice(0, empty.completeUpTo + 1).join(', ')}]`);
  const cmpLen = Math.min(ROW27_AA2F.length, empty.completeUpTo + 1);
  let row27Match = true;
  for (let n = 0; n < cmpLen; n++) if (empty.counts[n] !== ROW27_AA2F[n]) row27Match = false;
  console.log(`  matches MATH_CLAIMS.md row 27's aa2f figures (n=0..${cmpLen - 1}): ${row27Match ? 'YES' : 'NO -- STOP, do not trust anything below'}`);
  if (!row27Match) process.exit(1);
  console.log('');

  // ---- Validation 2: S = all 9 must NOT die (Theorem 65 guarantees existence).
  const all9 = enumerateSAbelian(toMask(BIGRAMS), maxN, budget);
  console.log(`S = all 9 (2-abelian / Theorem 65): complete up to n=${all9.completeUpTo}, nodes=${all9.nodes}, exhausted=${all9.exhausted}`);
  if (all9.exhausted) {
    console.log(`  p(n) = [${all9.counts.slice(0, all9.completeUpTo + 1).join(', ')}]`);
  } else {
    console.log(`  BUDGET HIT before n=${maxN} completed -- per this project's convention (factor-complexity.js),`);
    console.log(`  no p(n) value is reported as exact when the budget is hit, including small n, because which`);
    console.log(`  subtrees are safely closed is not cheap to determine. Re-run with a larger budget or smaller maxN.`);
  }
  console.log(`  did NOT die (the search kept branching, did not run out of continuations): ${all9.exhausted ? (all9.counts[all9.completeUpTo] > 0 ? 'consistent with Theorem 65' : 'DIES -- contradicts Theorem 65, stop and check the implementation') : 'budget hit while still branching -- also consistent with Theorem 65, not yet confirmed exhaustively'}`);
  console.log('');

  // ---- The 9 singletons.
  console.log('The 9 singletons:');
  const singletonResults = {};
  for (const bg of BIGRAMS) {
    const r = enumerateSAbelian(toMask([bg]), maxN, budget);
    singletonResults[bg] = r;
    if (!r.exhausted) {
      console.log(`  S = {${bg}}: BUDGET HIT, no exact p(n) reportable (same convention as above)`);
      continue;
    }
    const died = r.counts[maxN] === 0 && maxN > 0 && r.counts[maxN - 1] > 0 ? 'DIES' : 'survives to maxN';
    console.log(`  S = {${bg}}: complete up to n=${r.completeUpTo}, p(${maxN})=${r.counts[maxN]}, ${died}`);
  }
  console.log('');

  // ---- Monotonicity check: S subset S' means S-abelian equivalence is
  // COARSER (identifies MORE pairs as equivalent), so MORE potential squares
  // are caught, so avoidance is HARDER and the language is a SUBSET:
  // p_S(n) <= p_S'(n) whenever S subset S'. Concretely: p_empty(n) <=
  // p_{singleton}(n) <= p_all9(n) for every n where all three are known.
  console.log("Monotonicity check (p_{} <= p_{singleton} <= p_all9, each n where all three known):");
  let monotoneOk = true;
  const upTo = Math.min(empty.completeUpTo, all9.completeUpTo === -1 ? maxN : all9.completeUpTo, maxN);
  for (let n = 0; n <= upTo; n++) {
    for (const bg of BIGRAMS) {
      const r = singletonResults[bg];
      const pS = n <= r.completeUpTo ? r.counts[n] : null;
      if (pS === null) continue;
      if (empty.counts[n] > pS) { monotoneOk = false; console.log(`  VIOLATION: p_{}(n=${n})=${empty.counts[n]} > p_{${bg}}(n=${n})=${pS}`); }
      if (all9.completeUpTo >= n && pS > all9.counts[n]) { monotoneOk = false; console.log(`  VIOLATION: p_{${bg}}(n=${n})=${pS} > p_all9(n=${n})=${all9.counts[n]}`); }
    }
  }
  console.log(monotoneOk ? '  monotonicity holds at every checked n' : '  MONOTONICITY VIOLATED -- see above');
}

if (require.main === module) main();

module.exports = { BIGRAMS, toMask, enumerateSAbelian, isSAbelianEqual };
