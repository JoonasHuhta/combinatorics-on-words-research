'use strict';
/*
 * g98-check.js -- tests a claim the primary source makes AGAINST this project's data.
 *
 * Source: V. Keranen, "A powerful abelian square-free substitution over 4 letters",
 * TCS 410 (2009) 3893-3900, p. 3894, read from the author's own PDF 2026-08-01:
 *
 *   "This g98, in itself, is not an abelian square-free endomorphism, as it does
 *    not preserve abelian square-freeness for all words (starting already from
 *    the length 7)."
 *
 * The project currently lists g98 alongside g85 and g109 as one of the morphisms
 * establishing avoidability on 4 letters (MATH_CLAIMS.md row 3, morphisms.js
 * metadata). If Keranen is right, that framing is wrong, and there must exist an
 * abelian-square-free word w over {a,b,c,d} with |w| = 7 such that g98(w) contains
 * an abelian square. This script looks for one exhaustively.
 *
 * A morphism g is a-2-free iff g(w) is a-2-free for every a-2-free w. So a single
 * counterexample settles it. We also confirm there is NO counterexample at lengths
 * 1..6, which is the "starting already from the length 7" half of the claim.
 */

const { G98, G85 } = require('../src/morphisms.js');
const SIG = ['a', 'b', 'c', 'd'];

function hasAbelianSquare(w) {
  const n = w.length;
  const pre = { a: new Int32Array(n + 1), b: new Int32Array(n + 1), c: new Int32Array(n + 1), d: new Int32Array(n + 1) };
  for (let i = 0; i < n; i++) {
    for (const s of SIG) pre[s][i + 1] = pre[s][i];
    pre[w[i]][i + 1]++;
  }
  for (let K = 1; K * 2 <= n; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let eq = true;
      for (const s of SIG) {
        if ((pre[s][i + K] - pre[s][i]) !== (pre[s][i + 2 * K] - pre[s][i + K])) { eq = false; break; }
      }
      if (eq) return { K, at: i };
    }
  }
  return null;
}

function image(g, w) { let o = ''; for (const c of w) o += g[c]; return o; }

// enumerate all a-2-free words over 4 letters by length
function a2fWords(len) {
  const out = [];
  (function dfs(w) {
    if (w.length === len) { out.push(w); return; }
    for (const c of SIG) {
      const nw = w + c;
      if (!hasAbelianSquare(nw)) dfs(nw);
    }
  })('');
  return out;
}

function probe(name, g, maxLen) {
  console.log(`\n=== ${name} ===`);
  let firstBadLen = null;
  for (let L = 1; L <= maxLen; L++) {
    const words = a2fWords(L);
    let bad = null;
    for (const w of words) {
      const v = hasAbelianSquare(image(g, w));
      if (v) { bad = { w, v }; break; }
    }
    console.log(`  |w| = ${L}: ${words.length} a-2-free preimages, ` +
      (bad ? `*** FIRST FAILURE: w = ${bad.w}, image has abelian square K=${bad.v.K} at ${bad.v.at}` : 'all images a-2-free'));
    if (bad && firstBadLen === null) { firstBadLen = L; break; }
  }
  return firstBadLen;
}

// g98: the paper says it fails, first at length 7.
const g98Bad = probe('g98  (Keranen 2002; TCS 2009 says NOT a-2-free, "starting already from the length 7")', G98, 8);
// g85: the paper says it IS a-2-free (Carpi verified it independently). Positive control.
const g85Bad = probe('g85  (Keranen ICALP 1992; a-2-free -- POSITIVE CONTROL, must show no failure)', G85, 7);

console.log('\n--- verdict ---');
console.log(`g98 first failing preimage length : ${g98Bad === null ? 'none found up to 8' : g98Bad}`);
console.log(`  paper says                      : 7`);
console.log(`  ${g98Bad === 7 ? 'AGREES with the primary source, to the exact length.' : 'DOES NOT agree -- investigate before changing any row.'}`);
console.log(`g85 first failing preimage length : ${g85Bad === null ? 'none up to 7 (as required -- control passes)' : '*** ' + g85Bad + ' -- CONTROL FAILED, the checker is wrong, ignore the g98 result ***'}`);
