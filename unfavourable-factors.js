'use strict';

/**
 * unfavourable-factors.js
 * -----------------------
 * Keranen's open question about unfavourable factors, made computable.
 *
 * THE QUESTION, verbatim
 * ----------------------
 *   "...an unfavourable a-2-free word cannot be continued infinitely long to the
 *    left and to the right without necessarily creating an abelian square at some
 *    point. However, it might well be possible to extend such a word boundlessly
 *    to one direction, say to the right, without producing any abelian squares.
 *    Experiments support this conjecture but the existence of such unfavourable
 *    factors remains an open question."
 *   - V. Keranen, "Suppression of Unfavourable Factors in Pattern Avoidance",
 *     International Mathematica Symposium, Avignon 2006 (MATH_CLAIMS.md row 38)
 *
 * So: is there a word that extends boundlessly to the right, yet cannot occur as
 * a proper factor inside any infinite a-2-free word?
 *
 * WHY ONE DIRECTION IS A PROOF AND THE OTHER IS NOT
 * -------------------------------------------------
 * For a factorial, finitely-branching language, define
 *
 *   leftDepth(u)  = the largest m such that some v with |v| = m has v.u in L
 *   rightDepth(u) = the largest m such that some v with |v| = m has u.v in L
 *
 * If leftDepth(u) is FINITE, then u cannot be continued infinitely to the left,
 * so it cannot sit inside a bi-infinite a-2-free word: u is UNFAVOURABLE, and
 * this is a proof, not an observation. The witness is the exhausted search tree.
 *
 * The other direction is weaker. rightDepth(u) reaching the cap is evidence of
 * boundless right extension, not proof of it - by Konig's lemma the extension
 * tree being infinite would settle it, but a finite search cannot establish that
 * the tree is infinite. This file therefore reports:
 *
 *   PROVEN unfavourable          leftDepth finite
 *   CANDIDATE for Keranen's word leftDepth finite AND rightDepth >= cap
 *
 * and never claims the second is settled. A candidate would still need its right
 * extension shown infinite by other means - a morphism, or a cycle argument in
 * the language rather than in a capped search.
 *
 * The asymmetry is deliberate: a finite computation can refute boundlessness but
 * cannot confirm it.
 *
 * RELATION TO MATH_CLAIMS.md ROW 35
 * ---------------------------------
 * Row 35 counts factors with no ONE-step extension. That is the depth-0 case of
 * leftDepth. Keranen's notion is about infinite extension and is strictly
 * stronger, so those counts are not counts of unfavourable factors and row 38
 * says so. This file computes the stronger notion.
 *
 * Usage:
 *   node unfavourable-factors.js              # ternary aa2f, validation run
 *   node unfavourable-factors.js --a2free     # four letters, full a-2-freeness
 *                                             # (Keranen's actual setting)
 *   node unfavourable-factors.js --n 9 --cap 60
 */

/* ---------------------------------------------------------------- *
 * Languages
 * ---------------------------------------------------------------- */

/**
 * Suffix test: given that w[0..len-2] is in the language, is w[0..len-1]?
 * minK = 1 gives full a-2-freeness; minK = 2 gives the aa2f setting.
 */
function makeSuffixTest(A, minK) {
  return function ok(word, len, pre) {
    const half = len >> 1;
    for (let k = minK; k <= half; k++) {
      let equal = true;
      for (let s = 0; s < A; s++) {
        if ((pre[s][len - k] - pre[s][len - 2 * k]) !== (pre[s][len] - pre[s][len - k])) { equal = false; break; }
      }
      if (equal) return false;
    }
    return true;
  };
}

/** Is w in the language? Full check from scratch. */
function inLanguage(w, A, minK, alphabet) {
  const n = w.length;
  const pre = Array.from({ length: A }, () => new Int32Array(n + 1));
  for (let i = 0; i < n; i++) {
    const c = alphabet.indexOf(w[i]);
    for (let s = 0; s < A; s++) pre[s][i + 1] = pre[s][i] + (s === c ? 1 : 0);
  }
  const ok = makeSuffixTest(A, minK);
  for (let len = 1; len <= n; len++) if (!ok(null, len, pre)) return false;
  return true;
}

/** All words of length n in the language. */
function factorsOfLength(n, alphabet, minK) {
  const A = alphabet.length;
  const ok = makeSuffixTest(A, minK);
  const out = [];
  const word = new Int32Array(n + 1);
  const pre = Array.from({ length: A }, () => new Int32Array(n + 2));
  const rec = (len) => {
    if (len === n) { out.push(Array.from(word.slice(0, n), c => alphabet[c]).join('')); return; }
    for (let c = 0; c < A; c++) {
      word[len] = c;
      for (let s = 0; s < A; s++) pre[s][len + 1] = pre[s][len] + (s === c ? 1 : 0);
      if (ok(word, len + 1, pre)) rec(len + 1);
    }
  };
  rec(0);
  return out;
}

/* ---------------------------------------------------------------- *
 * Extension depth
 * ---------------------------------------------------------------- */

/**
 * How far can u be extended on the given side before every branch dies?
 * Returns cap if the search reaches it, which is evidence and not proof.
 * Returns a value < cap only when the tree was EXHAUSTED, which is proof.
 */
function extensionDepth(u, side, alphabet, minK, cap) {
  const A = alphabet.length;
  let best = 0;
  const rec = (w, depth) => {
    if (depth > best) best = depth;
    if (best >= cap) return true;                       // hit the cap
    for (const c of alphabet) {
      const next = side === 'right' ? w + c : c + w;
      if (!inLanguage(next, A, minK, alphabet)) continue;
      if (rec(next, depth + 1)) return true;
    }
    return false;
  };
  rec(u, 0);
  return best;
}

/* ---------------------------------------------------------------- *
 * Report
 * ---------------------------------------------------------------- */

function main() {
  const argv = process.argv.slice(2);
  const arg = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? Number(argv[i + 1]) : d; };
  const a2free = argv.includes('--a2free');

  const alphabet = a2free ? ['a', 'b', 'c', 'd'] : ['a', 'b', 'c'];
  const minK = a2free ? 1 : 2;
  const N = arg('--n', a2free ? 8 : 9);
  const CAP = arg('--cap', 40);

  const line = '='.repeat(78);
  console.log('');
  console.log('UNFAVOURABLE FACTORS - KERANEN\'S OPEN QUESTION');
  console.log(line);
  console.log(`  alphabet         : {${alphabet.join(',')}}`);
  console.log(`  condition        : no abelian square of half-length K >= ${minK}` +
    (minK === 1 ? '   (full a-2-freeness, Keranen\'s setting)' : '   (aa2f, validation run)'));
  console.log(`  factor length n  : ${N}`);
  console.log(`  extension cap    : ${CAP}`);
  console.log('');

  const factors = factorsOfLength(N, alphabet, minK);
  console.log(`  factors of length ${N} : ${factors.length.toLocaleString()}`);
  if (factors.length === 0) { console.log('  language is empty at this length.'); return; }

  const t0 = Date.now();
  const rows = [];
  for (const u of factors) {
    const L = extensionDepth(u, 'left', alphabet, minK, CAP);
    const R = extensionDepth(u, 'right', alphabet, minK, CAP);
    rows.push({ u, L, R });
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  const provenUnfav = rows.filter(r => r.L < CAP || r.R < CAP);
  const leftDies = rows.filter(r => r.L < CAP);
  const rightDies = rows.filter(r => r.R < CAP);
  const candidates = rows.filter(r => r.L < CAP && r.R >= CAP);
  const mirror = rows.filter(r => r.R < CAP && r.L >= CAP);

  console.log(`  scanned in ${secs}s`);
  console.log('');
  console.log(line);
  console.log('RESULT');
  console.log(line);
  console.log(`  left extension exhausted  (PROVEN unfavourable)   : ${leftDies.length.toLocaleString()}`);
  console.log(`  right extension exhausted (PROVEN unfavourable)   : ${rightDies.length.toLocaleString()}`);
  console.log(`  either side exhausted     (PROVEN unfavourable)   : ${provenUnfav.length.toLocaleString()}`);
  console.log('');
  console.log(`  CANDIDATES - left dies, right reaches the cap     : ${candidates.length.toLocaleString()}`);
  console.log(`  mirror image - right dies, left reaches the cap   : ${mirror.length.toLocaleString()}`);
  console.log('');

  if (candidates.length > 0) {
    console.log('  Examples (word, left depth before exhaustion, right depth reached):');
    for (const r of candidates.slice(0, 10)) {
      console.log(`    ${r.u}   left dies at ${r.L}   right >= ${r.R}`);
    }
    console.log('');
    console.log('  WHAT THIS IS. Each of these is PROVEN unfavourable: its left extension');
    console.log('  tree was exhausted, so it cannot sit inside a bi-infinite a-2-free word.');
    console.log(`  Its right extension reached the cap of ${CAP}, which is EVIDENCE of boundless`);
    console.log('  right extension and NOT proof. Keranen\'s question asks for a word that is');
    console.log('  genuinely boundlessly right-extendable, and a capped search cannot');
    console.log('  establish that. Raising --cap raises the evidence, never the proof.');
    console.log('');
    console.log('  To settle one of these, exhibit an infinite right extension by other');
    console.log('  means - a morphism whose fixed point has it as a prefix, or a cycle');
    console.log('  argument in the language itself rather than in a capped tree.');
  } else {
    console.log('  No candidate at this length and cap. Every factor whose left extension');
    console.log('  dies also has a dying right extension, and vice versa - the two-sided');
    console.log('  symmetry the reversal-invariance of the condition would predict.');
  }
  console.log('');
  const sym = leftDies.length === rightDies.length;
  console.log(`  left/right counts equal: ${sym ? 'yes' : 'NO'}` +
    `   (expected yes - the abelian-square condition is invariant under reversal)`);
  if (!sym) {
    console.log('  A mismatch here would mean the extension search is wrong, not that the');
    console.log('  language is asymmetric. Investigate before reading anything else.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { factorsOfLength, extensionDepth, inLanguage };
