'use strict';

/**
 * additive-nonuniform-morphism-scan.js
 * -------------------------------------
 * Exhaustive scan of small NON-UNIFORM morphisms over a 4-letter integer
 * alphabet against the additive condition: does the fixed point avoid
 * additive squares of EVERY half-length K >= 1?
 *
 * WHY THIS EXISTS
 * ----------------
 * additive-morphism-scan.js (MATH_CLAIMS.md row 67) exhausted the UNIFORM
 * case up to k=4 over six unbalanced alphabets, entirely negative. The same
 * row records the reason not to push uniform further: Cassaigne et al.'s
 * 2013 construction for additive CUBES, phi_{a,b,c,d} (a->ac, b->dc, c->b,
 * d->ab), extracted verbatim from the Lietard-Rosenfeld preprint, is
 * explicitly NON-uniform - image lengths 2, 2, 1, 2. Uniform morphisms are
 * very likely the wrong search space for additive squares too.
 *
 * This module generalises additive-morphism-scan.js from a single k to a
 * LENGTH PROFILE (La, Lb, Lc, Ld), one length per letter, and searches every
 * profile up to a given maximum length. The uniform case is the special
 * profile La=Lb=Lc=Ld=k, so this module's own regression control is that it
 * must reproduce additive-morphism-scan.js's uniform results exactly when
 * restricted to a uniform profile - see runControls().
 *
 * WHAT WOULD IT MEAN IF SOMETHING SURVIVES
 * -------------------------------------------
 * Identical caveat to additive-morphism-scan.js: bounded evidence, never a
 * proof. As of 2026-07-30 an exact decision procedure exists for the
 * ADDITIVE case, but only for morphisms satisfying Theorem 2.4's affine
 * hypothesis (additive-affine-decision.js, MATH_CLAIMS.md rows 72-74) -
 * length AND weighted sum both linear in the letter's own value, which a
 * non-uniform (by construction, variable-length) morphism need not have.
 * A survivor here must be checked against that hypothesis independently.
 *
 * COVERAGE, STATED PRECISELY
 * ----------------------------
 * All morphisms h: {a,b,c,d} -> {a,b,c,d}^+ where |h(a)|=La, |h(b)|=Lb,
 * |h(c)|=Lc, |h(d)|=Ld, each length between 1 and the given maxLen, with
 * La >= 2 (a length-1 h(a) forces h(a)="a" exactly - a degenerate, constant
 * fixed point that teaches nothing). h(a) must begin with 'a'; every h(x)
 * must itself be additive-square-free as a standalone word. NOT covered:
 * lengths above maxLen, non-primitive combinations that were skipped for
 * budget, and alphabets not tested. Each profile's own combinatorial cost is
 * checked against a budget before it is run, and the run reports exactly
 * which profiles were skipped so "exhaustive" never silently becomes
 * "exhaustive except where it was expensive".
 *
 * Usage:  node additive-nonuniform-morphism-scan.js --alphabet 0,1,2,5
 *                                                     [--maxlen 3] [--cap 400]
 */

const SYM = 'abcd';

// ---------------------------------------------------------------------------
// Additive-square check (restated independently, matching additive-sweep.js
// and additive-morphism-scan.js's own restatements)
// ---------------------------------------------------------------------------

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
// Fixed-point survival (non-uniform: images differ in length)
// ---------------------------------------------------------------------------

function survivingPrefix(images, valueOf, cap) {
  let w = 'a';
  for (let iter = 0; iter < 24; iter++) {
    let next = '';
    for (const ch of w) { next += images[ch]; if (next.length > cap) break; }
    w = next.slice(0, cap);
    const v = firstViolation(toValues(w, valueOf), 1);
    if (v >= 0) return v - 1;
    if (w.length >= cap) return cap;
    if (w.length === 1 && images[w] === w) return 1; // fixed at a single letter: no growth left
  }
  return w.length;
}

// ---------------------------------------------------------------------------
// Clean-image tables, shared across all length profiles
// ---------------------------------------------------------------------------

function* words(len, prefix) {
  if (prefix.length === len) { yield prefix; return; }
  for (const c of SYM) yield* words(len, prefix + c);
}

/** clean[len] = all additive-square-free words of that length. Computed once. */
function buildCleanTables(maxLen, valueOf) {
  const clean = { 0: [] };
  for (let len = 1; len <= maxLen; len++) {
    clean[len] = [...words(len, '')].filter(w => firstViolation(toValues(w, valueOf), 1) < 0);
  }
  return clean;
}

// ---------------------------------------------------------------------------
// Length-profile enumeration
// ---------------------------------------------------------------------------

function* profiles(maxLen) {
  for (let La = 2; La <= maxLen; La++) {
    for (let Lb = 1; Lb <= maxLen; Lb++) {
      for (let Lc = 1; Lc <= maxLen; Lc++) {
        for (let Ld = 1; Ld <= maxLen; Ld++) {
          yield [La, Lb, Lc, Ld];
        }
      }
    }
  }
}

function scanProfile(profile, clean, valueOf, cap, budget) {
  const [La, Lb, Lc, Ld] = profile;
  const cleanA = clean[La].filter(w => w[0] === 'a');
  const cB = clean[Lb], cC = clean[Lc], cD = clean[Ld];
  const combos = cleanA.length * cB.length * cC.length * cD.length;
  if (combos === 0) return { profile, empty: true, combos: 0 };
  if (combos > budget) return { profile, skipped: true, combos };

  let best = 0, bestM = null, tested = 0, reachedCap = 0;
  for (const wa of cleanA) {
    for (const wb of cB) {
      for (const wc of cC) {
        for (const wd of cD) {
          tested++;
          const images = { a: wa, b: wb, c: wc, d: wd };
          const s = survivingPrefix(images, valueOf, cap);
          if (s >= cap) reachedCap++;
          if (s > best) { best = s; bestM = images; }
        }
      }
    }
  }
  return { profile, combos, tested, best, bestM, reachedCap };
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];
  const valueOf = { a: 0, b: 1, c: 2, d: 5 };

  // 1. Basic definitional sanity, shared with the uniform module.
  if (firstViolation([4, 4], 1) !== 2) throw new Error('K=1 additive square must be caught');
  if (firstViolation([0, 1, 5, 6], 1) !== -1) throw new Error('a square-free sequence must not be flagged');
  notes.push('K=1 additive squares are caught, matching additive-sweep.js\'s definition');

  // 2. THE regression control: a uniform profile (k,k,k,k) must reproduce
  //    additive-morphism-scan.js's own scan(k, ...) results exactly, since
  //    that is a special case of this module's search space.
  const ams = require('./additive-morphism-scan.js');
  const clean = buildCleanTables(3, valueOf);
  for (const k of [2, 3]) {
    const uniform = ams.scan(k, valueOf, 400, 5e6);
    const nonUniform = scanProfile([k, k, k, k], clean, valueOf, 400, 5e6);
    if (uniform.tested !== nonUniform.tested) {
      throw new Error(`k=${k}: uniform tested ${uniform.tested} vs non-uniform profile tested ${nonUniform.tested}`);
    }
    if (uniform.best !== nonUniform.best) {
      throw new Error(`k=${k}: uniform best ${uniform.best} vs non-uniform profile best ${nonUniform.best}`);
    }
    if (uniform.reachedCap !== nonUniform.reachedCap) {
      throw new Error(`k=${k}: reachedCap mismatch ${uniform.reachedCap} vs ${nonUniform.reachedCap}`);
    }
  }
  notes.push('uniform profiles (k,k,k,k) reproduce additive-morphism-scan.js\'s own scan() exactly for k=2,3');

  // 3. The Cassaigne profile (2,2,1,2) - the one this module exists to reach
  //    - must be enumerable and its clean-image counts must be internally
  //    consistent (length-1 images: exactly the 4 single symbols, all
  //    trivially additive-square-free alone).
  if (clean[1].length !== 4) throw new Error(`length-1 clean words must be all 4 symbols, got ${clean[1].length}`);
  notes.push('length-1 images are exactly the 4 single symbols, as required for the Cassaigne-style (2,2,1,2) profile');

  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  let alphabet = [0, 1, 2, 5], maxLen = 3, cap = 400, budget = 3e6;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--alphabet') alphabet = args[++i].split(',').map(Number);
    else if (args[i] === '--maxlen') maxLen = parseInt(args[++i], 10);
    else if (args[i] === '--cap') cap = parseInt(args[++i], 10);
    else if (args[i] === '--budget') budget = Number(args[++i]);
  }
  if (alphabet.length !== 4) throw new Error('this module is for 4-letter alphabets only');
  const sorted = [...alphabet].sort((a, b) => a - b);
  const valueOf = { a: sorted[0], b: sorted[1], c: sorted[2], d: sorted[3] };

  console.log('=== additive-nonuniform-morphism-scan: length-profile search over a 4-letter alphabet ===\n');
  for (const n of runControls()) console.log(`[CONTROL] ${n}`);
  console.log('');
  console.log(`alphabet {${sorted.join(',')}}  (a=${valueOf.a} b=${valueOf.b} c=${valueOf.c} d=${valueOf.d})`);
  console.log(`condition: fixed point avoids additive squares of EVERY half-length K >= 1`);
  console.log(`profile lengths 1..${maxLen} (La >= 2), prefix cap ${cap}, per-profile budget ${budget.toExponential(0)}\n`);

  const t0 = Date.now();
  const clean = buildCleanTables(maxLen, valueOf);
  const results = [];
  let skippedCount = 0, emptyCount = 0, totalTested = 0;
  let globalBest = 0, globalBestProfile = null, globalBestM = null;
  let anySurvived = false;

  for (const p of profiles(maxLen)) {
    const r = scanProfile(p, clean, valueOf, cap, budget);
    if (r.empty) { emptyCount++; continue; }
    if (r.skipped) { skippedCount++; results.push(r); continue; }
    totalTested += r.tested;
    if (r.best > globalBest) { globalBest = r.best; globalBestProfile = r.profile; globalBestM = r.bestM; }
    if (r.reachedCap > 0) anySurvived = true;
    results.push(r);
  }
  const dt = ((Date.now() - t0) / 1000).toFixed(1);

  const testedProfiles = results.filter(r => !r.skipped);
  console.log(`profiles enumerated: ${emptyCount + testedProfiles.length + skippedCount}  (empty: ${emptyCount}, tested: ${testedProfiles.length}, skipped over budget: ${skippedCount})`);
  console.log(`total morphisms tested across all profiles: ${totalTested.toLocaleString()}   [${dt}s]\n`);

  if (skippedCount > 0) {
    console.log('SKIPPED profiles (combination count exceeded budget - NOT covered by this run):');
    for (const r of results.filter(x => x.skipped)) {
      console.log(`  (${r.profile.join(',')})  combos=${r.combos.toExponential(1)}`);
    }
    console.log('');
  }

  console.log(`best surviving prefix overall: ${globalBest}` + (globalBestProfile ? `  at profile (${globalBestProfile.join(',')})` : ''));
  if (globalBestM) console.log(`  a->${globalBestM.a}  b->${globalBestM.b}  c->${globalBestM.c}  d->${globalBestM.d}`);

  console.log('');
  console.log('='.repeat(78));
  console.log('RESULT');
  console.log('='.repeat(78));
  if (anySurvived) {
    console.log('  A morphism reached the prefix cap. This is BOUNDED EVIDENCE, not a proof');
    console.log('  of an infinite fixed point. As of 2026-07-30 an exact decision procedure');
    console.log('  exists for morphisms satisfying Theorem 2.4\'s affine hypothesis');
    console.log('  (additive-affine-decision.js, MATH_CLAIMS.md rows 72-74) - check that first.');
    console.log('  If it does not apply, escalate the cap and verify independently.');
  } else if (skippedCount === 0) {
    console.log(`  NO non-uniform morphism with per-letter lengths 1..${maxLen} (h(a) length >= 2)`);
    console.log(`  over {${sorted.join(',')}} has a fixed point avoiding additive squares of any`);
    console.log('  half-length K >= 1. This is an EXHAUSTIVE finite statement: every profile');
    console.log('  in range was tested, none skipped over budget.');
  } else {
    console.log(`  NO surviving morphism found among the ${testedProfiles.length} profiles that were`);
    console.log(`  tested, but ${skippedCount} profile(s) were skipped over the combination budget.`);
    console.log('  This is NOT an exhaustive statement - raise --budget to close the gap.');
  }
  console.log('');
}

if (require.main === module) main();

module.exports = { firstViolation, survivingPrefix, buildCleanTables, profiles, scanProfile, runControls };
