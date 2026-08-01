'use strict';

/**
 * morphism-scan.js
 * ----------------
 * Exhaustive scan of small uniform ternary morphisms against the Makela
 * condition: does the fixed point avoid abelian squares of EVERY half-length K >= 2?
 *
 * WHY THIS EXISTS
 * ---------------
 * Before designing a search architecture for morphism space, the first question
 * is empirical and cheap: is anything there at sizes we can enumerate outright?
 * If the reachable strata are empty, that fact determines what any search must
 * be built to do, and it is far more informative than an architecture diagram.
 *
 * The answer for k <= 6 is no.
 *
 * WHAT THE MAXIMUM DOES NOT TELL YOU
 * ----------------------------------
 * The longest surviving prefix is tempting to extrapolate. Do not. It is an
 * extreme-value artefact of sample size: max ~ 2.29 ln(N) - 3.67 with R^2 =
 * 0.99875 over k = 2..6, where N is the number of morphisms tested (MATH_CLAIMS.md
 * row 37). The maximum is reached by 2, 4 and 8 morphisms out of 95,832,
 * 1,417,176 and 15,552,000 respectively - a handful of outliers in a fast-decaying
 * distribution. Continuing to k = 7..9 will produce roughly 40, 45, 50 whatever
 * the mathematics does, so neither a bend nor a jump in that curve is evidence
 * about the uniform route.
 *
 * The informative statistic is the decay of the survival distribution, which is
 * structural if it is independent of k. That has not been measured yet.
 *
 * COVERAGE, STATED PRECISELY
 * --------------------------
 * The scan is exhaustive over UNIFORM morphisms with |h(a)| = |h(b)| = |h(c)| = k.
 * Two restrictions are used and both are justified rather than convenient:
 *
 *   - h(a) must begin with 'a'. A fixed point of h beginning with letter x
 *     requires h(x) to begin with x, and the ternary alphabet is symmetric under
 *     relabelling, so fixing the seed to 'a' loses nothing up to S3 permutation.
 *   - h(a) must itself contain no such abelian square, since it is
 *     a prefix of the fixed point. Same for h(b) and h(c), which are factors of
 *     the fixed point whenever b and c occur - and under primitivity they do.
 *
 * NOT COVERED: non-uniform morphisms, where |h(a)|, |h(b)|, |h(c)| may differ.
 * That is a strictly larger space and this scan says nothing about it.
 *
 * The prefix cap means "survives" is bounded evidence, not a proof of an infinite
 * fixed point. Nothing reached the cap, so the distinction has not yet mattered.
 *
 * Usage:  node morphism-scan.js [maxK]
 */

const A = ['a', 'b', 'c'];
const CAP = 400;

/**
 * Position at which the first abelian square of half-length >= minK completes,
 * or -1 if there is none. Scans by END position so the return value is the
 * earliest violation, which is what "surviving prefix" means.
 *
 * WHY minK DEFAULTS TO 2 AND NOT A BOUNDED RANGE
 * ----------------------------------------------
 * A first version of this file used K in {2,3,4,5} only, reasoning that K >= 6
 * "is solved" by Rao & Rosenfeld. That reasoning is wrong. They solved K >= 6 by
 * exhibiting ONE construction; a candidate morphism has to avoid every K >= 2 on
 * its own. The restricted condition is far weaker, and it admits periodic words:
 * (aaabaac)^n satisfies it while having an abelian square of half-length 6 at
 * position 2, verified directly. Under the restricted condition the k=7 scan
 * reported 16,970 morphisms reaching the prefix cap, and the best of them was
 * the constant morphism a,b,c -> aaabaac, whose fixed point is exactly that
 * periodic word. Whether all 16,970 are periodic was not checked; one such
 * example is enough to disqualify the condition.
 *
 * Makela's condition is every K >= 2, and that is the default here. The bounded
 * variant is kept because a negative result under the WEAKER condition is a
 * stronger statement - see MATH_CLAIMS.md row 36.
 */
function firstViolation(w, minK = 2, maxK = Infinity) {
  const n = w.length;
  const pa = new Int32Array(n + 1), pb = new Int32Array(n + 1), pc = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    pa[i + 1] = pa[i] + (w[i] === 'a' ? 1 : 0);
    pb[i + 1] = pb[i] + (w[i] === 'b' ? 1 : 0);
    pc[i + 1] = pc[i] + (w[i] === 'c' ? 1 : 0);
  }
  for (let e = 2 * minK; e <= n; e++) {
    const top = Math.min(maxK, e >> 1);
    for (let K = minK; K <= top; K++) {
      const i = e - 2 * K;
      if (pa[i + K] - pa[i] !== pa[e] - pa[i + K]) continue;
      if (pb[i + K] - pb[i] !== pb[e] - pb[i + K]) continue;
      if (pc[i + K] - pc[i] !== pc[e] - pc[i + K]) continue;
      return e;
    }
  }
  return -1;
}

/** Longest clean prefix of the fixed point, capped at CAP. */
function survivingPrefix(wa, wb, wc, minK = 2, maxK = Infinity) {
  const img = { a: wa, b: wb, c: wc };
  let w = 'a';
  for (let iter = 0; iter < 12; iter++) {
    let next = '';
    for (const ch of w) { next += img[ch]; if (next.length > CAP) break; }
    w = next.slice(0, CAP);
    const v = firstViolation(w, minK, maxK);
    if (v >= 0) return v - 1;
    if (w.length >= CAP) return CAP;
    if (w.length === 1) return 1;
  }
  return w.length;
}

function* words(k, prefix) {
  if (prefix.length === k) { yield prefix; return; }
  for (const c of A) yield* words(k, prefix + c);
}

function scan(k, minK = 2, maxK = Infinity) {
  const cleanA = [];
  for (const w of words(k, 'a')) if (firstViolation(w, minK, maxK) < 0) cleanA.push(w);
  const cleanAll = [...words(k, '')].filter(w => firstViolation(w, minK, maxK) < 0);

  let best = 0, bestM = null, tested = 0, reachedCap = 0;
  for (const wa of cleanA) {
    for (const wb of cleanAll) {
      for (const wc of cleanAll) {
        tested++;
        const s = survivingPrefix(wa, wb, wc, minK, maxK);
        if (s >= CAP) reachedCap++;
        if (s > best) { best = s; bestM = [wa, wb, wc]; }
      }
    }
  }
  return { k, rawSpace: Math.pow(3, 3 * k - 1), cleanA: cleanA.length, cleanAll: cleanAll.length, tested, best, bestM, reachedCap };
}

function main() {
  const upTo = parseInt(process.argv[2], 10) || 6;
  console.log('');
  console.log('EXHAUSTIVE SCAN OF UNIFORM TERNARY MORPHISMS');
  console.log('Condition: the fixed point avoids abelian squares of EVERY half-length K >= 2.');
  console.log(`Prefix cap ${CAP}. Exhaustive up to S3 relabelling; uniform morphisms only.`);
  console.log('');
  console.log('  k   raw space   h(a) clean   images clean   triples tested   best prefix   reached cap');
  console.log('  ' + '-'.repeat(86));
  const results = [];
  for (let k = 2; k <= upTo; k++) {
    const r = scan(k);
    results.push(r);
    console.log('  ' + String(r.k).padStart(1) +
      String(r.rawSpace.toExponential(1)).padStart(12) +
      String(r.cleanA).padStart(13) +
      String(r.cleanAll).padStart(15) +
      String(r.tested.toLocaleString()).padStart(17) +
      String(r.best).padStart(14) +
      String(r.reachedCap).padStart(14));
    if (r.bestM) console.log(`       best: a->${r.bestM[0]}  b->${r.bestM[1]}  c->${r.bestM[2]}`);
  }
  console.log('');
  const anySurvived = results.some(r => r.reachedCap > 0);
  console.log('='.repeat(78));
  console.log('RESULT');
  console.log('='.repeat(78));
  if (anySurvived) {
    console.log('  A morphism reached the prefix cap. Feed it to decide-realizability.js -');
    console.log('  the cap is bounded evidence, not a proof of an infinite fixed point.');
  } else {
    console.log(`  NO uniform ternary morphism with k <= ${upTo} has a fixed point avoiding`);
    console.log('  abelian squares of any half-length K >= 2. Every one fails at a finite prefix.');
    console.log('');
    console.log('  The best surviving prefix grows with k:');
    console.log('    ' + results.map(r => `k=${r.k}: ${r.best}`).join('   '));
    console.log('');
    console.log('  This is an exhaustive finite statement about uniform morphisms up to');
    console.log(`  k = ${upTo}. It says nothing about larger k, and nothing about non-uniform`);
    console.log('  morphisms. See MATH_CLAIMS.md row 36 and OPEN_RESEARCH_QUESTIONS.md A1.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { firstViolation, survivingPrefix, scan };
