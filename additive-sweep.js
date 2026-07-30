'use strict';

/**
 * additive-sweep.js
 * -----------------
 * Certified exhaustive sweep of ADDITIVE-SQUARE-FREE languages over finite
 * integer alphabets, one verdict per affine equivalence class.
 *
 * WHY THIS EXISTS
 * ---------------
 * "Is Z uniformly 2-repetitive" - can additive squares be avoided over a
 * finite subset of Z - is a sourced open problem (MATH_CLAIMS.md row 53,
 * OPEN_RESEARCH_QUESTIONS.md A6). The question is about WHICH alphabets
 * work, so the natural computation is a sweep over alphabets, and for each
 * one a single decidable question: is the additive-square-free language
 * over it finite?
 *
 * If the search exhausts, the answer is definitive for that alphabet: no
 * additive-square-free word beyond the stated length exists, so the alphabet
 * cannot host an infinite one. If the search reaches its budget, nothing is
 * decided and the run says so.
 *
 * WHY THE CONTAINER MACHINERY IS NOT USED HERE
 * --------------------------------------------
 * sft-container.js analyses the windowed relaxation "avoid K in [2,kmax]"
 * and yields necessary conditions (rows 51-52). Measured 2026-07-30: for
 * four-letter integer alphabets that relaxation does not die at any kmax
 * whose cost |A|^(2*kmax-1) is reachable, whereas the exhaustive search on
 * the TRUE language terminates in seconds for many alphabets. Elimination is
 * a search question, not a container question. See SANALAB_PLAN.md 3b.
 *
 * AFFINE SYMMETRY
 * ---------------
 * Additive-square-freeness is invariant under x -> a*x + b (a != 0): two
 * blocks of equal length L with sums S1, S2 satisfy S1 = S2 exactly when
 * a*S1 + b*L = a*S2 + b*L. Alphabets are therefore swept up to affine
 * equivalence, canonical form being min 0, gcd of elements 1, and
 * lexicographically minimal against the reflection x -> max - x. The
 * reduction is also a control: representatives of one class must produce
 * identical verdicts.
 *
 * THREE-LAYER VERIFICATION (SANALAB_PLAN.md 6b.2)
 * -----------------------------------------------
 *   Layer 1, property invariants - the only layer reaching full length:
 *     affine invariance of the verdict, reversal invariance of the witness,
 *     and the containment additive-square-free => abelian-square-free.
 *   Layer 2, independent implementation at the same performance class:
 *     level-by-level BFS that re-checks every extension IN FULL. The primary
 *     path is a DFS that only checks squares ending at the newly appended
 *     position - valid solely because the prefix is already square-free.
 *     Layer 2 makes no such inference, so it tests exactly that step.
 *     (Prefix sums are shared arithmetic, not a shared inference; the
 *     load-bearing difference is full re-scan versus suffix-only scan.)
 *   Layer 3, definition-level reference: hasAdditiveSquareFull scans every
 *     block pair directly from the definition and verifies each witness.
 *
 * THE TWO HALVES OF A VERDICT COST DIFFERENT AMOUNTS (SANALAB_PLAN.md 6b.3)
 * ------------------------------------------------------------------------
 * "longest >= L" is established by exhibiting one word and is verified here
 * directly from the definition. "longest <= L" requires the exhaustive
 * search and rests on it. The report states both separately, and every
 * eliminated class emits its witness.
 *
 * Usage:  node additive-sweep.js [--letters 4] [--span 8] [--cap 200]
 *                                [--budget 100000000] [--quick]
 */

// ---------------------------------------------------------------------------
// Alphabet enumeration up to affine equivalence
// ---------------------------------------------------------------------------

function gcd2(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
function gcdAll(xs) { let g = 0; for (const x of xs) g = gcd2(g, x); return g || 1; }

function lexLess(a, b) {
  for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return a[i] < b[i]; }
  return false;
}

/** Canonical representative of the affine class of A. */
function canonicalForm(A) {
  const sorted = Array.from(new Set(A)).sort((x, y) => x - y);
  const shifted = sorted.map(x => x - sorted[0]);
  const g = gcdAll(shifted.slice(1));
  const scaled = shifted.map(x => x / g);
  const mx = scaled[scaled.length - 1];
  const reflected = scaled.map(x => mx - x).sort((x, y) => x - y);
  return lexLess(reflected, scaled) ? reflected : scaled;
}

/** All canonical alphabets with `letters` elements and max element <= span. */
function canonicalAlphabets(letters, span) {
  const out = [];
  const pick = new Array(letters - 1);
  (function choose(start, depth) {
    if (depth === letters - 1) {
      const A = [0, ...pick];
      const canon = canonicalForm(A);
      if (canon.length === A.length && canon.join(',') === A.join(',')) out.push(A);
      return;
    }
    for (let v = start; v <= span; v++) { pick[depth] = v; choose(v + 1, depth + 1); }
  })(1, 0);
  return out;
}

// ---------------------------------------------------------------------------
// Layer 3: definition-level check. Every block pair, no shortcuts.
// ---------------------------------------------------------------------------

function hasAdditiveSquareFull(word) {
  const n = word.length;
  for (let k = 1; 2 * k <= n; k++) {
    for (let i = 0; i + 2 * k <= n; i++) {
      let s1 = 0, s2 = 0;
      for (let t = 0; t < k; t++) s1 += word[i + t];
      for (let t = 0; t < k; t++) s2 += word[i + k + t];
      if (s1 === s2) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Primary path: DFS checking only squares that end at the appended position
// ---------------------------------------------------------------------------

function sweepDFS(A, cap, nodeBudget) {
  const q = A.length;
  const w = new Int32Array(cap + 1);
  const ps = new Int32Array(cap + 2);
  let longest = 0, nodes = 0, exhausted = true, witness = [];

  function endsClean(len) {
    for (let K = 1; 2 * K <= len; K++) {
      if (ps[len - K] - ps[len - 2 * K] === ps[len] - ps[len - K]) return false;
    }
    return true;
  }

  function rec(len) {
    if (len > longest) { longest = len; witness = Array.from(w.slice(0, len)); }
    if (len === cap) { exhausted = false; return; }
    for (let s = 0; s < q; s++) {
      if (++nodes > nodeBudget) { exhausted = false; return; }
      w[len] = A[s];
      ps[len + 1] = ps[len] + A[s];
      if (endsClean(len + 1)) {
        rec(len + 1);
        if (!exhausted) return;
      }
    }
  }

  ps[0] = 0;
  rec(0);
  return { exhausted, longest, witness, nodes };
}

// ---------------------------------------------------------------------------
// Layer 2: independent level-by-level BFS, full re-check of every extension
// ---------------------------------------------------------------------------

function sweepBFS(A, cap, widthBudget) {
  let level = [[]];                 // the empty word
  let n = 0;
  const counts = [1];
  while (n < cap) {
    const next = [];
    for (const word of level) {
      for (const s of A) {
        const cand = word.concat([s]);
        if (!hasAdditiveSquareFull(cand)) next.push(cand);
        if (next.length > widthBudget) {
          return { exhausted: false, longest: null, counts, reason: 'width budget' };
        }
      }
    }
    n++;
    counts.push(next.length);
    if (next.length === 0) {
      return { exhausted: true, longest: n - 1, counts, witness: level[0] };
    }
    level = next;
  }
  return { exhausted: false, longest: null, counts, reason: 'length cap' };
}

// ---------------------------------------------------------------------------
// Layer 1: property invariants (reach full length, need no second path)
// ---------------------------------------------------------------------------

/** Abelian-square-free count over a q-letter alphabet, for the containment control. */
function abelianFreeCount(q, N) {
  const pref = [];
  for (let i = 0; i < q; i++) pref.push(new Int32Array(N + 2));
  const w = new Int32Array(N + 1);
  let count = 0;
  function ok(len) {
    for (let K = 1; 2 * K <= len; K++) {
      let same = true;
      for (let c = 0; c < q; c++) {
        if ((pref[c][len - K] - pref[c][len - 2 * K]) !== (pref[c][len] - pref[c][len - K])) { same = false; break; }
      }
      if (same) return false;
    }
    return true;
  }
  function rec(len) {
    if (len === N) { count++; return; }
    for (let s = 0; s < q; s++) {
      w[len] = s;
      for (let c = 0; c < q; c++) pref[c][len + 1] = pref[c][len] + (s === c ? 1 : 0);
      if (ok(len + 1)) rec(len + 1);
    }
  }
  rec(0);
  return count;
}

function countDFS(A, N) {
  const q = A.length;
  const w = new Int32Array(N + 1);
  const ps = new Int32Array(N + 2);
  let count = 0;
  function endsClean(len) {
    for (let K = 1; 2 * K <= len; K++) {
      if (ps[len - K] - ps[len - 2 * K] === ps[len] - ps[len - K]) return false;
    }
    return true;
  }
  function rec(len) {
    if (len === N) { count++; return; }
    for (let s = 0; s < q; s++) {
      w[len] = A[s];
      ps[len + 1] = ps[len] + A[s];
      if (endsClean(len + 1)) rec(len + 1);
    }
  }
  ps[0] = 0;
  rec(0);
  return count;
}

// ---------------------------------------------------------------------------
// Controls. The module throws rather than reporting anything if these fail.
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];

  // Positive control, ties to MATH_CLAIMS.md row 1: every three-letter integer
  // alphabet must exhaust with longest word 7, and 18 words at length 7.
  for (const A of [[0, 1, 2], [0, 1, 3], [0, 2, 3], [0, 1, 4]]) {
    const r = sweepDFS(A, 40, 1e7);
    if (!r.exhausted) throw new Error(`ternary control: search over ${JSON.stringify(A)} did not exhaust`);
    if (r.longest !== 7) throw new Error(`ternary control: longest ${r.longest} over ${JSON.stringify(A)}, expected 7`);
    const c7 = countDFS(A, 7);
    if (c7 !== 18) throw new Error(`ternary control: ${c7} words of length 7 over ${JSON.stringify(A)}, expected 18 (row 1)`);
  }
  notes.push('three-letter alphabets exhaust at longest 7 with 18 words of length 7 (row 1)');

  // Layer 2 cross-check: BFS must agree with DFS on longest, and on counts.
  for (const A of [[0, 1, 2], [0, 1, 3, 4]]) {
    const d = sweepDFS(A, 60, 1e8);
    const b = sweepBFS(A, 60, 2e6);
    if (!b.exhausted) throw new Error(`BFS cross-check did not exhaust over ${JSON.stringify(A)}`);
    if (b.longest !== d.longest) {
      throw new Error(`BFS/DFS disagree over ${JSON.stringify(A)}: ${b.longest} vs ${d.longest}`);
    }
    for (let n = 1; n <= Math.min(9, b.counts.length - 1); n++) {
      const cd = countDFS(A, n);
      if (cd !== b.counts[n]) throw new Error(`count mismatch at n=${n} over ${JSON.stringify(A)}: DFS ${cd} vs BFS ${b.counts[n]}`);
    }
  }
  notes.push('independent BFS (full re-check) agrees with DFS on longest and on counts');

  // Layer 1a: affine invariance of counts, including negative scaling.
  for (const A of [[0, 1, 3, 4], [0, 1, 2, 5]]) {
    const base = countDFS(A, 8);
    for (const [a, b] of [[1, 7], [3, 0], [-1, 4], [5, -2]]) {
      const A2 = A.map(x => a * x + b);
      if (countDFS(A2, 8) !== base) {
        throw new Error(`affine invariance violated for ${JSON.stringify(A)} under x -> ${a}x+${b}`);
      }
      if (canonicalForm(A2).join(',') !== canonicalForm(A).join(',')) {
        throw new Error(`canonicalForm not affine-invariant for ${JSON.stringify(A)} under x -> ${a}x+${b}`);
      }
    }
  }
  notes.push('affine invariance holds for counts and for the canonical form (incl. negative scaling)');

  // Layer 1b: reversal invariance, word by word, from the definition.
  {
    const A = [0, 1, 3, 4], N = 8;
    const w = new Array(N);
    let checked = 0;
    (function gen(pos) {
      if (pos === N) {
        const f = hasAdditiveSquareFull(w);
        const r = hasAdditiveSquareFull(w.slice().reverse());
        if (f !== r) throw new Error(`reversal invariance violated at ${w.join('')}`);
        checked++;
        return;
      }
      for (const s of A) { w[pos] = s; gen(pos + 1); }
    })(0);
    notes.push(`reversal invariance holds for all ${checked} words of length ${N} over {0,1,3,4}`);
  }

  // Layer 1c: containment. Same Parikh vector implies same sum, so an
  // additive-square-free word is abelian-square-free.
  for (const N of [3, 5, 7]) {
    const add = countDFS([0, 1, 2], N), abel = abelianFreeCount(3, N);
    if (add > abel) throw new Error(`containment violated at n=${N}: additive ${add} > abelian ${abel}`);
  }
  notes.push('containment additive-square-free subset of abelian-square-free holds for n = 3, 5, 7');

  // Negative control: the definition-level checker must catch a planted square.
  if (!hasAdditiveSquareFull([0, 3, 1, 2])) throw new Error('negative control: 0 3 | 1 2 has equal sums and was not caught');
  if (hasAdditiveSquareFull([0, 1, 3])) throw new Error('negative control: 0 1 3 is additive-square-free but was rejected');
  notes.push('definition-level checker accepts and rejects the planted controls');

  return notes;
}

// ---------------------------------------------------------------------------
// Sweep
// ---------------------------------------------------------------------------

function verdictFor(A, cap, budget, opts = {}) {
  const d = sweepDFS(A, cap, budget);
  const res = { A, exhausted: d.exhausted, longest: d.longest, witness: d.witness, nodes: d.nodes };

  // The lower bound "a word of length `longest` exists over A" carries its
  // witness for EVERY class, decided or not (SANALAB_PLAN.md 6b.3): the word
  // is re-checked straight from the definition, so record hunting and
  // elimination share one verification standard.
  if (hasAdditiveSquareFull(d.witness)) {
    throw new Error(`witness over ${JSON.stringify(A)} contains an additive square`);
  }
  if (d.witness.length !== d.longest) {
    throw new Error(`witness length ${d.witness.length} does not match longest ${d.longest}`);
  }
  res.witnessVerified = true;

  if (d.exhausted) {
    // Layer 1: an affine image must produce an identical verdict.
    if (!opts.skipAffine) {
      const A2 = A.map(x => 3 * x - 5);
      const d2 = sweepDFS(A2, cap, budget);
      if (!d2.exhausted || d2.longest !== d.longest) {
        throw new Error(`affine verdict mismatch for ${JSON.stringify(A)}: ${d.longest} vs ${d2.longest} under x -> 3x-5`);
      }
      res.affineChecked = true;
    }

    // Layer 2: independent BFS, when its width stays affordable.
    if (!opts.skipBFS) {
      const b = sweepBFS(A, cap, opts.widthBudget || 3e5);
      if (b.exhausted) {
        if (b.longest !== d.longest) {
          throw new Error(`BFS/DFS verdict mismatch for ${JSON.stringify(A)}: ${b.longest} vs ${d.longest}`);
        }
        res.bfsConfirmed = true;
      } else {
        res.bfsConfirmed = false;
        res.bfsReason = b.reason;
      }
    }
  }
  return res;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { letters: 4, span: 8, cap: 200, budget: 1e8, quick: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--letters') opt.letters = parseInt(args[++i], 10);
    else if (args[i] === '--span') opt.span = parseInt(args[++i], 10);
    else if (args[i] === '--cap') opt.cap = parseInt(args[++i], 10);
    else if (args[i] === '--budget') opt.budget = Number(args[++i]);
    else if (args[i] === '--quick') opt.quick = true;
  }
  if (opt.quick) { opt.span = 5; opt.budget = 1e7; }

  console.log('=== additive-sweep: additive-square-free languages over integer alphabets ===\n');

  const notes = runControls();
  for (const n of notes) console.log(`[CONTROL] ${n}`);
  console.log('');

  const alphabets = canonicalAlphabets(opt.letters, opt.span);
  console.log(`${opt.letters}-letter alphabets, max element <= ${opt.span}, up to affine equivalence: ${alphabets.length} classes`);
  console.log(`search cap ${opt.cap}, node budget ${opt.budget}\n`);

  const eliminated = [], open = [];
  for (const A of alphabets) {
    const t0 = Date.now();
    const r = verdictFor(A, opt.cap, opt.budget);
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    const tag = `A={${A.join(',')}}`.padEnd(16);
    if (r.exhausted) {
      eliminated.push(r);
      const marks = [
        r.witnessVerified ? 'witness verified from definition' : null,
        r.affineChecked ? 'affine image agrees' : null,
        r.bfsConfirmed ? 'independent BFS agrees' : `BFS not run to completion (${r.bfsReason})`
      ].filter(Boolean).join('; ');
      console.log(`  ${tag} search exhausted: no additive-square-free word of length ${r.longest + 1} exists.`);
      console.log(`  ${''.padEnd(16)}   longest = ${r.longest}  [${marks}]  [${r.nodes} nodes, ${dt}s]`);
      console.log(`  ${''.padEnd(16)}   witness: ${r.witness.join(A.some(x => x > 9) ? ' ' : '')}`);
    } else {
      open.push(r);
      console.log(`  ${tag} not decided: budget or cap reached [${r.nodes} nodes, ${dt}s]`);
      console.log(`  ${''.padEnd(16)}   lower bound: a word of length ${r.longest} exists (witness verified from definition)`);
      console.log(`  ${''.padEnd(16)}   witness: ${r.witness.join(A.some(x => x > 9) ? ' ' : '')}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  classes with the search exhausted : ${eliminated.length} of ${alphabets.length}`);
  console.log(`  classes not decided in this budget: ${open.length} of ${alphabets.length}`);
  if (eliminated.length) {
    const byLen = eliminated.map(r => r.longest).sort((a, b) => a - b);
    console.log(`  longest words among exhausted classes: min ${byLen[0]}, max ${byLen[byLen.length - 1]}`);
  }
  if (open.length) {
    const lows = open.map(r => r.longest).sort((a, b) => a - b);
    console.log(`  verified lower bounds among undecided classes: min ${lows[0]}, max ${lows[lows.length - 1]}`);
  }
  console.log('\nAn exhausted search decides its alphabet: no additive-square-free word beyond the');
  console.log('stated length exists over it, so it cannot host an infinite one. A budget-limited');
  console.log('run decides nothing beyond its verified lower bound. Every lower bound carries a');
  console.log('definition-checked witness; upper bounds rest on the exhaustive search, whose');
  console.log('coverage is the node budget stated above. Report records with the effort spent:');
  console.log('record growth against effort alone is a sample-size artefact (MATH_CLAIMS row 37).');
}

if (require.main === module) {
  main();
}

module.exports = {
  canonicalForm, canonicalAlphabets, hasAdditiveSquareFull,
  sweepDFS, sweepBFS, countDFS, abelianFreeCount, runControls, verdictFor
};
