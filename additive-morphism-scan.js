'use strict';

/**
 * additive-morphism-scan.js
 * --------------------------
 * Exhaustive scan of small uniform morphisms over a 4-letter integer alphabet
 * against the additive condition: does the fixed point avoid additive squares
 * of EVERY half-length K >= 1?
 *
 * WHY THIS EXISTS
 * ---------------
 * additive-sweep.js (MATH_CLAIMS.md row 54) resolved 11 of 31 affine classes
 * by exhaustive search on the true language, and left 20 open. Row 66
 * (Freedman, arXiv:1304.1829) explains the asymmetry cleanly: Freedman's
 * length-61 forcing bound applies only to BALANCED (Sidon: a+d=b+c) 4-letter
 * alphabets. For UNBALANCED alphabets no finite bound is known, and a cheap
 * diagnostic (2026-07-30, scratchpad) found every one of the 20 open classes
 * still producing longer witnesses at a node budget of 1e8 with no sign of
 * flattening - unlike the 10 balanced classes, which all exhausted within a
 * few million nodes. That is evidence, not proof (see morphism-scan.js's own
 * warning about reading structure into a growing-with-effort curve, and
 * MATH_CLAIMS.md row 37). Blind deeper DFS cannot settle infinitude either
 * way - see NEGATIVE_RESULTS.md item 2 (SCC/deep-search survival is not a
 * proof of an infinite word).
 *
 * The one method this project has that CAN settle infinitude outright is a
 * periodic rule: if some uniform morphism has a fixed point that provably
 * avoids every additive square forever, that IS an infinite witness. This
 * module asks the cheap, decisive question first, exactly as morphism-scan.js
 * did for the abelian case: is anything there at sizes small enough to
 * enumerate outright?
 *
 * WHAT WOULD IT MEAN IF SOMETHING SURVIVES
 * -----------------------------------------
 * A morphism whose fixed point avoids additive squares up to the prefix cap
 * is BOUNDED EVIDENCE, never a proof - identical framing to
 * morphism-scan.js's own caveat. Turning bounded evidence into a proof needs
 * an exact decision procedure. As of 2026-07-30 one exists for the ADDITIVE
 * case too, but only for morphisms satisfying Theorem 2.4's affine hypothesis
 * (additive-affine-decision.js, MATH_CLAIMS.md rows 72-74) - a narrow
 * subclass, measured at 0.006-0.021% of this module's own uniform search
 * space (row 73). A morphism from THIS scan that survives to the cap is not
 * automatically covered: it must independently satisfy Theorem 2.4's
 * hypotheses (affine image lengths and sums, invertible matrix, eigenvalues
 * of modulus > 1) before additive-affine-decision.js applies to it.
 *
 * WHAT WOULD IT MEAN IF NOTHING SURVIVES
 * ----------------------------------------
 * A clean negative statement, exhaustive up to the tested k, exactly in the
 * shape of MATH_CLAIMS.md row 36. It does not touch non-uniform morphisms
 * (a strictly larger space) or larger k.
 *
 * COVERAGE, STATED PRECISELY
 * ---------------------------
 * Uniform morphisms h: {a,b,c,d} -> {a,b,c,d}^k, k given on the command line.
 * h(a) must begin with the symbol 'a' (fixed-point requirement - a fixed
 * point beginning with symbol x needs h(x) to begin with x). Each h(x) must
 * itself be additive-square-free as a standalone word, since it is a prefix
 * or factor of the fixed point whenever that letter occurs (guaranteed for
 * primitive morphisms). No symmetry reduction is applied beyond fixing the
 * seed: additive equivalence over an arbitrary integer alphabet has no
 * letter-relabelling symmetry in general (unlike the ternary abelian case's
 * S3), only the affine symmetry additive-sweep.js already uses to classify
 * alphabets - and that symmetry acts on the ALPHABET, not on a fixed
 * morphism's letter roles, so it does not reduce this search further.
 *
 * Usage:  node additive-morphism-scan.js --alphabet 0,1,2,5 [--maxk 4] [--cap 400]
 */

const SYM = 'abcd';

// ---------------------------------------------------------------------------
// Additive-square check, restated independently from additive-sweep.js
// ---------------------------------------------------------------------------

/**
 * First position (end index) at which an additive square of half-length
 * >= minK completes in the value sequence, or -1 if none. Scans by end
 * position exactly as morphism-scan.js's firstViolation does, so "surviving
 * prefix" means the same thing in both modules.
 */
function firstViolation(values, minK = 1) {
  const n = values.length;
  const ps = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) ps[i + 1] = ps[i] + values[i];
  for (let e = 2 * minK; e <= n; e++) {
    const top = e >> 1;
    for (let K = minK; K <= top; K++) {
      const i = e - 2 * K;
      if (ps[i + K] - ps[i] === ps[e] - ps[i + K]) return e;
    }
  }
  return -1;
}

function toValues(symWord, valueOf) {
  const out = new Array(symWord.length);
  for (let i = 0; i < symWord.length; i++) out[i] = valueOf[symWord[i]];
  return out;
}

// ---------------------------------------------------------------------------
// Fixed-point survival
// ---------------------------------------------------------------------------

function survivingPrefix(images, valueOf, cap) {
  let w = 'a';
  for (let iter = 0; iter < 16; iter++) {
    let next = '';
    for (const ch of w) { next += images[ch]; if (next.length > cap) break; }
    w = next.slice(0, cap);
    const v = firstViolation(toValues(w, valueOf), 1);
    if (v >= 0) return v - 1;
    if (w.length >= cap) return cap;
    if (w.length === 1) return 1;
  }
  return w.length;
}

// ---------------------------------------------------------------------------
// Enumeration
// ---------------------------------------------------------------------------

function* words(k, prefix) {
  if (prefix.length === k) { yield prefix; return; }
  for (const c of SYM) yield* words(k, prefix + c);
}

function scan(k, valueOf, cap, budgetTriples) {
  const clean = [];
  const cleanA = [];
  for (const w of words(k, '')) {
    if (firstViolation(toValues(w, valueOf), 1) < 0) {
      clean.push(w);
      if (w[0] === 'a') cleanA.push(w);
    }
  }
  const totalCombos = cleanA.length * Math.pow(clean.length, 3);
  if (totalCombos > budgetTriples) {
    return { k, skipped: true, rawSpace: Math.pow(4, k), clean: clean.length, cleanA: cleanA.length, totalCombos };
  }

  let best = 0, bestM = null, tested = 0, reachedCap = 0;
  for (const wa of cleanA) {
    for (const wb of clean) {
      for (const wc of clean) {
        for (const wd of clean) {
          tested++;
          const images = { a: wa, b: wb, c: wc, d: wd };
          const s = survivingPrefix(images, valueOf, cap);
          if (s >= cap) reachedCap++;
          if (s > best) { best = s; bestM = images; }
        }
      }
    }
  }
  return { k, rawSpace: Math.pow(4, k), clean: clean.length, cleanA: cleanA.length, tested, best, bestM, reachedCap };
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];

  // 1. firstViolation must include K=1 (literal repeated letter), since
  //    additive-sweep.js's definition does and results must agree.
  const valueOf = { a: 0, b: 1, c: 2, d: 5 };
  if (firstViolation([0, 0], 1) !== 2) throw new Error('K=1 (equal adjacent letters) must be caught as an additive square');
  if (firstViolation([0, 1, 2, 3], 1) !== -1) throw new Error('a strictly increasing run must not be flagged');
  notes.push('K=1 additive squares (repeated letters) are caught, matching additive-sweep.js\'s definition');

  // 2. Cross-check against additive-sweep.js's own checker on random-ish words.
  const as = require('./additive-sweep.js');
  const samples = ['abcabc', 'abcdabcd', 'aabc', 'abccba', 'abdc', 'dcba'];
  for (const w of samples) {
    const vals = toValues(w, valueOf);
    const mine = firstViolation(vals, 1) !== -1;
    const theirs = as.hasAdditiveSquareFull(vals);
    if (mine !== theirs) throw new Error(`disagreement with additive-sweep.js on "${w}": mine=${mine} theirs=${theirs}`);
  }
  notes.push(`agrees with additive-sweep.js's definitional checker on ${samples.length} sample words`);

  // 3. Ternary positive control is not directly available (this module is
  //    4-letter only), so instead verify: an alphabet with a repeated value
  //    forced by construction is caught at k=1 trivially (every single-letter
  //    morphism image must itself be additive-square-free; a length-1 image
  //    can never violate K=1, but a length>=2 image with a repeated letter
  //    must be excluded from `clean`).
  const cleanCheck = [...words(2, '')].filter(w => firstViolation(toValues(w, valueOf), 1) < 0);
  const hasDoubles = cleanCheck.some(w => w[0] === w[1]);
  if (hasDoubles) throw new Error('a length-2 clean word contains a repeated letter, which is itself a K=1 additive square');
  notes.push(`length-2 clean-word filtering correctly excludes all repeated-letter words (${cleanCheck.length}/16 pass)`);

  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  let alphabet = [0, 1, 2, 5], maxk = 4, cap = 400, budgetTriples = 5e6;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--alphabet') alphabet = args[++i].split(',').map(Number);
    else if (args[i] === '--maxk') maxk = parseInt(args[++i], 10);
    else if (args[i] === '--cap') cap = parseInt(args[++i], 10);
    else if (args[i] === '--budget') budgetTriples = Number(args[++i]);
  }
  if (alphabet.length !== 4) throw new Error('this module is for 4-letter alphabets only');
  const sorted = [...alphabet].sort((a, b) => a - b);
  const valueOf = { a: sorted[0], b: sorted[1], c: sorted[2], d: sorted[3] };
  const balanced = (valueOf.a + valueOf.d === valueOf.b + valueOf.c);

  console.log('=== additive-morphism-scan: uniform morphisms over a 4-letter integer alphabet ===\n');
  for (const n of runControls()) console.log(`[CONTROL] ${n}`);
  console.log('');
  console.log(`alphabet {${sorted.join(',')}}  (a=${valueOf.a} b=${valueOf.b} c=${valueOf.c} d=${valueOf.d}), balanced=${balanced}`);
  console.log(`condition: fixed point avoids additive squares of EVERY half-length K >= 1`);
  console.log(`prefix cap ${cap}, per-k combination budget ${budgetTriples.toExponential(0)}\n`);

  console.log('  k   raw space   clean images   h(a) choices   quadruples tested   best prefix   reached cap');
  console.log('  ' + '-'.repeat(96));
  const results = [];
  for (let k = 2; k <= maxk; k++) {
    const t0 = Date.now();
    const r = scan(k, valueOf, cap, budgetTriples);
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    results.push(r);
    if (r.skipped) {
      console.log(`  ${r.k}  SKIPPED: ${r.totalCombos.toExponential(1)} combinations exceeds budget ${budgetTriples.toExponential(0)} (clean=${r.clean}, cleanA=${r.cleanA})`);
      continue;
    }
    console.log('  ' + String(r.k).padStart(1) +
      String(r.rawSpace.toExponential(1)).padStart(12) +
      String(r.clean).padStart(15) +
      String(r.cleanA).padStart(15) +
      String(r.tested.toLocaleString()).padStart(21) +
      String(r.best).padStart(14) +
      String(r.reachedCap).padStart(14) +
      `   [${dt}s]`);
    if (r.bestM) console.log(`       best: a->${r.bestM.a}  b->${r.bestM.b}  c->${r.bestM.c}  d->${r.bestM.d}`);
  }

  console.log('');
  const tested = results.filter(r => !r.skipped);
  const anySurvived = tested.some(r => r.reachedCap > 0);
  console.log('='.repeat(78));
  console.log('RESULT');
  console.log('='.repeat(78));
  if (anySurvived) {
    console.log('  A morphism reached the prefix cap. This is BOUNDED EVIDENCE, not a proof');
    console.log('  of an infinite fixed point. Check first whether it satisfies Theorem 2.4\'s');
    console.log('  affine hypothesis (morphismMatrix in additive-affine-decision.js throws if');
    console.log('  not) - if it does, that module DECIDES the question exactly. If not, escalate');
    console.log('  the cap and verify the witness independently before claiming more.');
  } else if (tested.length > 0) {
    console.log(`  NO uniform morphism with 2 <= k <= ${tested[tested.length - 1].k} over {${sorted.join(',')}} has a`);
    console.log('  fixed point avoiding additive squares of any half-length K >= 1.');
    console.log('  Best surviving prefixes: ' + tested.map(r => `k=${r.k}: ${r.best}`).join('   '));
    console.log('');
    console.log('  This is an exhaustive finite statement about uniform morphisms up to the');
    console.log('  tested k, over this one alphabet. It says nothing about larger k, non-uniform');
    console.log('  morphisms, or other alphabets.');
  } else {
    console.log('  Nothing was tested within budget; raise --budget or lower --maxk.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { firstViolation, survivingPrefix, scan, runControls };
