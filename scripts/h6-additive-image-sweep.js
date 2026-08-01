'use strict';

/**
 * h6-additive-image-sweep.js
 * ---------------------------
 * Additive analogue of route (c) (h6-image-sweep.js), for OPEN_RESEARCH_QUESTIONS.md B13.
 *
 * h6^omega(a) is the SAME fixed 6-letter morphism used throughout the
 * abelian side (MATH_CLAIMS.md row 5), unchanged. This module sweeps uniform
 * integer codings g: {a..f} -> V^L (V a 4-integer alphabet) and asks whether
 * g(h6^omega(a)) avoids additive squares of ANY half-length K >= 1.
 *
 * WHY THE VALUE FUNCTION DIFFERS FROM h6-image-sweep.js
 * -------------------------------------------------------
 * The abelian sweep only needs K in [2,5]: g3 itself already solves K >= 6
 * (MATH_CLAIMS.md row 7), so that is the only open window. Nothing on the
 * additive side has solved any K yet -- Question 3 (row 63) is open for
 * every half-length -- so this sweep tests all K >= 1.
 *
 * WHY THERE IS NO SYMMETRY REDUCTION
 * ------------------------------------
 * h6-image-sweep.js reduces the search 6x via S3 relabelling of the ternary
 * target alphabet, because abelian squares are invariant under any
 * permutation of the target letters. Additive squares are NOT invariant
 * under an arbitrary relabelling of a fixed integer alphabet (permuting
 * {0,1,2,5} changes sums); only affine transforms of the whole alphabet
 * preserve additive-square status, and that does not reduce a coding search
 * over a FIXED alphabet the way S3 does here. So this sweeps the full space
 * at each L, pruned only by early violations and by restricting to
 * per-letter images that are themselves additive-square-free ("clean").
 *
 * COVERAGE, STATED PRECISELY
 * ---------------------------
 * Exhaustive over uniform codings g with |g(x)| = L for all six letters, one
 * fixed alphabet V, L given on the command line. NOT covered: non-uniform
 * codings, other auxiliary morphisms (h6 is fixed), varying the auxiliary
 * alphabet SIZE (B13's original framing), or any L not run.
 *
 * Usage: node h6-additive-image-sweep.js [--depth 7] [--L 1,2,3,4,5,6] [--alphabet 0,1,2,5] [--budget 5e10]
 */

const { h6Prefix, firstOccurrenceOrder } = require('./h6-image-sweep.js');

function enumerateImages(L, A) {
  const out = [];
  const total = Math.pow(A, L);
  for (let code = 0; code < total; code++) {
    const img = new Array(L);
    let c = code;
    for (let s = L - 1; s >= 0; s--) { img[s] = c % A; c = Math.floor(c / A); }
    out.push(img);
  }
  return out;
}

/** True if img (indices into V) is itself additive-square-free as a standalone word. */
function isClean(img, V) {
  const n = img.length;
  const ps = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) ps[i + 1] = ps[i] + V[img[i]];
  for (let e = 2; e <= n; e++) {
    for (let K = 1; K <= e >> 1; K++) {
      const i = e - 2 * K;
      if (ps[i + K] - ps[i] === ps[e] - ps[i + K]) return false;
    }
  }
  return true;
}

/**
 * Exhaustive DFS over uniform codings g: {a..f} -> V^L, testing g(x) for
 * additive squares of any half-length K >= 1 by end position, assignment in
 * first-occurrence order (same variable-ordering heuristic as
 * h6-image-sweep.js, no symmetry reduction -- see header).
 */
function sweepDFS(x, L, V, { budget = 5e10 } = {}) {
  const { order, first } = firstOccurrenceOrder(x);
  const limits = new Array(6);
  for (let m = 0; m < 5; m++) limits[m] = first[order[m + 1]];
  limits[5] = x.length;

  const allImages = enumerateImages(L, V.length).filter(img => isClean(img, V));
  const maxImageLen = x.length * L;
  const ps = new Int32Array(maxImageLen + 1);
  const assigned = new Array(6).fill(null);

  const res = {
    L, window: maxImageLen, candidatesCompleted: 0, pruneEvents: 0,
    survivors: [], maxViolationPos: -1, bestImages: null,
    symbolsAppended: 0, aborted: false,
    cleanImages: allImages.length, rawImages: Math.pow(V.length, L)
  };

  function emit(xpFrom, xpTo, p) {
    for (let xp = xpFrom; xp < xpTo; xp++) {
      const img = assigned[x[xp]];
      for (let s = 0; s < img.length; s++) {
        ps[p + 1] = ps[p] + V[img[s]];
        p++;
        res.symbolsAppended++;
        for (let K = 1; 2 * K <= p; K++) {
          const i = p - 2 * K;
          if (ps[i + K] - ps[i] === ps[p] - ps[i + K]) return { p, violation: true };
        }
      }
    }
    return { p, violation: false };
  }

  function assign(m, xpDone, p) {
    if (res.aborted) return;
    if (m === 6) {
      res.candidatesCompleted++;
      if (res.survivors.length < 20) res.survivors.push(assigned.map(img => img.join(',')));
      return;
    }
    for (const img of allImages) {
      if (res.symbolsAppended > budget) { res.aborted = true; return; }
      assigned[order[m]] = img;
      const r = emit(xpDone, limits[m], p);
      if (r.violation) {
        res.pruneEvents++;
        if (r.p > res.maxViolationPos) {
          res.maxViolationPos = r.p;
          res.bestImages = assigned.map(a => (a ? a.join(',') : '?'));
        }
      } else {
        assign(m + 1, limits[m], r.p);
      }
      if (res.aborted) return;
    }
    assigned[order[m]] = null;
  }

  assign(0, 0, 0);
  return res;
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];
  const V = [0, 1, 2, 5];

  // Cross-check: per-letter clean-image counts must match the independently
  // written candidate generator in additive-affine-decision.js's test
  // harness lineage (row 77's own corroboration) for the same alphabet.
  const expected = { 1: 4, 2: 12, 3: 36, 4: 96, 5: 264, 6: 638 };
  const x = h6Prefix(2);
  for (const [L, exp] of Object.entries(expected)) {
    const clean = enumerateImages(Number(L), V.length).filter(img => isClean(img, V)).length;
    if (clean !== exp) throw new Error(`clean-image count mismatch at L=${L}: got ${clean}, expected ${exp}`);
  }
  notes.push('clean-image counts at L=1..6 match the independently derived counts (row 77)');

  // Negative control: an all-zero coding must die immediately (K=1 square:
  // two adjacent equal letters both mapping to value 0 -> sum 0 = sum 0).
  const allZero = [[0], [0], [0], [0], [0], [0]];
  const w = h6Prefix(2);
  let died = -1;
  {
    const ps = [0];
    for (let i = 0; i < w.length; i++) ps.push(ps[i] + V[allZero[w[i]][0]]);
    for (let p = 2; p <= ps.length - 1 && died === -1; p++) {
      for (let K = 1; 2 * K <= p; K++) {
        const i = p - 2 * K;
        if (ps[i + K] - ps[i] === ps[p] - ps[i + K]) { died = p; break; }
      }
    }
  }
  if (died !== 2) throw new Error(`negative control failed: all-zero coding died at ${died}, expected 2`);
  notes.push('negative control: all-zero coding dies at symbol 2 (K=1 square)');

  return { notes };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { depth: 7, Ls: [1, 2, 3, 4, 5, 6], V: [0, 1, 2, 5], budget: 5e10 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--depth') opt.depth = parseInt(args[++i], 10);
    else if (args[i] === '--L') opt.Ls = args[++i].split(',').map(Number);
    else if (args[i] === '--alphabet') opt.V = args[++i].split(',').map(Number);
    else if (args[i] === '--budget') opt.budget = Number(args[++i]);
  }

  console.log('=== h6-additive-image-sweep: additive analogue of route (c), B13 ===\n');
  const { notes } = runControls();
  for (const n of notes) console.log(`[CONTROL] ${n}`);
  console.log('');

  const x = h6Prefix(opt.depth);
  console.log(`Base word: h6^${opt.depth}(a), ${x.length} letters. Alphabet V={${opt.V}}. Test: additive squares, K >= 1.\n`);

  for (const L of opt.Ls) {
    const t0 = Date.now();
    const r = sweepDFS(x, L, opt.V, { budget: opt.budget });
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`--- L = ${L} ---`);
    console.log(`    clean images per letter: ${r.cleanImages} of ${r.rawImages} raw`);
    if (r.aborted) {
      console.log(`    INCOMPLETE: budget of ${opt.budget} appended symbols exhausted after ${dt}s.`);
      console.log(`    No exhaustiveness claim may be made for L = ${L} from this run.\n`);
      continue;
    }
    console.log(`    completed candidates reaching full window: ${r.candidatesCompleted}`);
    console.log(`    pruned candidate classes (first violation inside window): ${r.pruneEvents}`);
    console.log(`    survivors: ${r.survivors.length}`);
    console.log(`    latest first-violation at image symbol ${r.maxViolationPos}` +
      (r.bestImages ? ` (a:${r.bestImages[0]} b:${r.bestImages[1]} c:${r.bestImages[2]} d:${r.bestImages[3]} e:${r.bestImages[4]} f:${r.bestImages[5]})` : ''));
    console.log(`    work: ${r.symbolsAppended} symbols appended, ${dt}s`);
    for (const s of r.survivors) {
      console.log(`    SURVIVOR (bounded evidence only, not decided): a:${s[0]} b:${s[1]} c:${s[2]} d:${s[3]} e:${s[4]} f:${s[5]}`);
    }
    console.log('');
  }

  console.log('Reminder: a violation is conclusive for the infinite image. Absence of violations');
  console.log('is bounded evidence in the stated window only. See MATH_CLAIMS.md row 77.');
}

if (require.main === module) {
  main();
}

module.exports = { sweepDFS, isClean, enumerateImages, runControls };
