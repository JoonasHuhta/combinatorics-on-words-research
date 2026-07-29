'use strict';

/**
 * morphism-scan.js
 * ----------------
 * Exhaustive scan of small uniform ternary morphisms against the Makela
 * condition: does the fixed point avoid abelian squares of half-length 2..5?
 *
 * WHY THIS EXISTS
 * ---------------
 * Before designing a search architecture for morphism space, the first question
 * is empirical and cheap: is anything there at sizes we can enumerate outright?
 * If the reachable strata are empty, that fact determines what any search must
 * be built to do, and it is far more informative than an architecture diagram.
 *
 * The answer for k <= 6 is no, and the numbers below say how the failure scales.
 *
 * COVERAGE, STATED PRECISELY
 * --------------------------
 * The scan is exhaustive over UNIFORM morphisms with |h(a)| = |h(b)| = |h(c)| = k.
 * Two restrictions are used and both are justified rather than convenient:
 *
 *   - h(a) must begin with 'a'. A fixed point of h beginning with letter x
 *     requires h(x) to begin with x, and the ternary alphabet is symmetric under
 *     relabelling, so fixing the seed to 'a' loses nothing up to S3 permutation.
 *   - h(a) must itself contain no abelian square of half-length 2..5, since it is
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
 * Position at which the first abelian square of half-length 2..5 completes,
 * or -1 if there is none.
 */
function firstViolation(w) {
  const n = w.length;
  const pa = new Int32Array(n + 1), pb = new Int32Array(n + 1), pc = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    pa[i + 1] = pa[i] + (w[i] === 'a' ? 1 : 0);
    pb[i + 1] = pb[i] + (w[i] === 'b' ? 1 : 0);
    pc[i + 1] = pc[i] + (w[i] === 'c' ? 1 : 0);
  }
  for (let K = 2; K <= 5; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      if (pa[i + K] - pa[i] !== pa[i + 2 * K] - pa[i + K]) continue;
      if (pb[i + K] - pb[i] !== pb[i + 2 * K] - pb[i + K]) continue;
      if (pc[i + K] - pc[i] !== pc[i + 2 * K] - pc[i + K]) continue;
      return i + 2 * K;
    }
  }
  return -1;
}

/** Longest clean prefix of the fixed point, capped at CAP. */
function survivingPrefix(wa, wb, wc) {
  const img = { a: wa, b: wb, c: wc };
  let w = 'a';
  for (let iter = 0; iter < 12; iter++) {
    let next = '';
    for (const ch of w) { next += img[ch]; if (next.length > CAP) break; }
    w = next.slice(0, CAP);
    const v = firstViolation(w);
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

function scan(k) {
  const cleanA = [];
  for (const w of words(k, 'a')) if (firstViolation(w) < 0) cleanA.push(w);
  const cleanAll = [...words(k, '')].filter(w => firstViolation(w) < 0);

  let best = 0, bestM = null, tested = 0, reachedCap = 0;
  for (const wa of cleanA) {
    for (const wb of cleanAll) {
      for (const wc of cleanAll) {
        tested++;
        const s = survivingPrefix(wa, wb, wc);
        if (s >= CAP) reachedCap++;
        if (s > best) { best = s; bestM = [wa, wb, wc]; }
      }
    }
  }
  return { k, rawSpace: Math.pow(3, 3 * k - 1), cleanA: cleanA.length, cleanAll: cleanAll.length, tested, best, bestM, reachedCap };
}

function main() {
  const maxK = parseInt(process.argv[2], 10) || 6;
  console.log('');
  console.log('EXHAUSTIVE SCAN OF UNIFORM TERNARY MORPHISMS');
  console.log('Condition: the fixed point avoids abelian squares of half-length 2..5.');
  console.log(`Prefix cap ${CAP}. Exhaustive up to S3 relabelling; uniform morphisms only.`);
  console.log('');
  console.log('  k   raw space   h(a) clean   images clean   triples tested   best prefix   reached cap');
  console.log('  ' + '-'.repeat(86));
  const results = [];
  for (let k = 2; k <= maxK; k++) {
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
    console.log(`  NO uniform ternary morphism with k <= ${maxK} has a fixed point avoiding`);
    console.log('  abelian squares of half-length 2..5. Every one fails at a finite prefix.');
    console.log('');
    console.log('  The best surviving prefix grows with k:');
    console.log('    ' + results.map(r => `k=${r.k}: ${r.best}`).join('   '));
    console.log('');
    console.log('  This is an exhaustive finite statement about uniform morphisms up to');
    console.log(`  k = ${maxK}. It says nothing about larger k, and nothing about non-uniform`);
    console.log('  morphisms. See MATH_CLAIMS.md row 36 and OPEN_RESEARCH_QUESTIONS.md A1.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { firstViolation, survivingPrefix, scan };
