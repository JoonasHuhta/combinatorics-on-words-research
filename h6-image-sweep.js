'use strict';

/**
 * h6-image-sweep.js
 * -----------------
 * Exhaustive sweep of ROUTE (c) at small sizes: uniform morphisms
 * g: {a..f} -> {a,b,c}^L applied to the fixed point h6^omega(a), asking
 * whether the image avoids abelian squares of half-length K in [2,5].
 *
 * WHY THIS EXISTS
 * ---------------
 * The Rao & Rosenfeld construction reaches the ternary alphabet only as an
 * image g3(h6^omega(a)), and that image fails exactly on the open window
 * K in [2,5] (the 34 squares, MATH_CLAIMS.md rows 6a/6b, 7b). Route (a)
 * - ternary fixed points - is swept by morphism-scan.js. This module sweeps
 * the complementary route: keep the base word h6^omega(a) fixed (its full
 * abelian-square-freeness is re-derived in-house, MATH_CLAIMS.md row 32)
 * and vary the morphism applied to it. g3 itself is 10-uniform; the space
 * of 10-uniform maps (3^60) is CEGIS territory, but L = 1..3 is enumerable
 * outright, and knowing whether those strata are empty is the same cheap,
 * decisive question morphism-scan.js answered for route (a).
 *
 * COVERAGE, STATED PRECISELY
 * --------------------------
 * The sweep is exhaustive over UNIFORM maps with |g(x)| = L for all six
 * letters, L given on the command line. NOT covered: non-uniform maps,
 * L >= 4, erasing maps (L = 0 for some letter), or any base word other
 * than h6^omega(a).
 *
 * Target-alphabet relabelling (S3) does not affect abelian squares, so by
 * default only canonical representatives are swept: the first emitted
 * symbol is 'a' and the first emitted symbol differing from 'a' is 'b'.
 * Every map is a relabelling of exactly one canonical map. --nosym
 * disables the reduction (used by the built-in L=1 cross-check).
 *
 * WHAT A RESULT MEANS
 * -------------------
 * A violation found in the image of the prefix h6^depth(a) is conclusive
 * for that candidate: the prefix is a prefix of the fixed point, so the
 * violation occurs in the infinite image too. Zero violations in the
 * window is bounded evidence only ("no violation in the first N symbols"),
 * never a proof; survivors are automatically re-tested in a larger window
 * and with a wider K range, and anything still standing needs the exact
 * machinery (decision-preconditions.js and the Proposition 9 route) before
 * any stronger wording is allowed.
 *
 * Usage:  node h6-image-sweep.js [--depth 7] [--L 1,2,3] [--budget 500000000] [--nosym]
 */

const { H6, G3, verifyMorphismIntegrity } = require('./morphisms.js');

const SIX = 'abcdef';
const THREE = 'abc';
const KLO = 2, KHI = 5;

// ---------------------------------------------------------------------------
// Base word
// ---------------------------------------------------------------------------

function h6Prefix(depth) {
  let w = [0];
  for (let it = 0; it < depth; it++) {
    const next = new Array(w.length * 3);
    let j = 0;
    for (let i = 0; i < w.length; i++) {
      const img = H6[SIX[w[i]]];
      next[j++] = img.charCodeAt(0) - 97;
      next[j++] = img.charCodeAt(1) - 97;
      next[j++] = img.charCodeAt(2) - 97;
    }
    w = next;
  }
  return Uint8Array.from(w);
}

/** First-occurrence order of the six letters in the base word. */
function firstOccurrenceOrder(x) {
  const first = new Array(6).fill(-1);
  for (let i = 0; i < x.length; i++) {
    if (first[x[i]] === -1) first[x[i]] = i;
  }
  if (first.includes(-1)) throw new Error('base prefix does not contain all six letters; increase depth');
  const order = [0, 1, 2, 3, 4, 5].sort((p, q) => first[p] - first[q]);
  return { order, first };
}

// ---------------------------------------------------------------------------
// Direct scanner (independent of the DFS; also used for cross-checks)
// ---------------------------------------------------------------------------

/**
 * Applies `images` (array of 6 symbol arrays over 0..2) to x and scans the
 * image for abelian squares with half-length K in [klo, khi], by end
 * position. Returns the number of symbols emitted when the first violation
 * completes, or -1 if none in the whole image.
 */
function directScan(x, images, klo, khi) {
  let total = 0;
  for (let i = 0; i < 6; i++) total = Math.max(total, images[i].length);
  total = x.length * total;
  const pa = new Int32Array(total + 1);
  const pb = new Int32Array(total + 1);
  const pc = new Int32Array(total + 1);
  let p = 0;
  for (let xp = 0; xp < x.length; xp++) {
    const img = images[x[xp]];
    for (let s = 0; s < img.length; s++) {
      const sym = img[s];
      pa[p + 1] = pa[p] + (sym === 0 ? 1 : 0);
      pb[p + 1] = pb[p] + (sym === 1 ? 1 : 0);
      pc[p + 1] = pc[p] + (sym === 2 ? 1 : 0);
      p++;
      for (let K = klo; K <= khi; K++) {
        if (p < 2 * K) break;
        const da = (pa[p - K] - pa[p - 2 * K]) - (pa[p] - pa[p - K]);
        if (da !== 0) continue;
        const db = (pb[p - K] - pb[p - 2 * K]) - (pb[p] - pb[p - K]);
        if (db !== 0) continue;
        const dc = (pc[p - K] - pc[p - 2 * K]) - (pc[p] - pc[p - K]);
        if (dc === 0) return p;
      }
    }
  }
  return -1;
}

// ---------------------------------------------------------------------------
// Canonicalization under S3 relabelling of the target alphabet
// ---------------------------------------------------------------------------

function canonicalize(x, images) {
  // Determine the relabelling from the emission order of symbols.
  let s0 = -1, s1 = -1;
  outer:
  for (let xp = 0; xp < x.length; xp++) {
    const img = images[x[xp]];
    for (let s = 0; s < img.length; s++) {
      const sym = img[s];
      if (s0 === -1) s0 = sym;
      else if (sym !== s0 && s1 === -1) { s1 = sym; break outer; }
    }
  }
  const pi = new Array(3).fill(-1);
  if (s0 !== -1) pi[s0] = 0;
  if (s1 !== -1) pi[s1] = 1;
  let nextFree = (s1 === -1) ? 1 : 2;
  for (let t = 0; t < 3; t++) if (pi[t] === -1) pi[t] = nextFree++;
  return images.map(img => img.map(sym => pi[sym]));
}

// ---------------------------------------------------------------------------
// DFS sweep over uniform maps, assignment in first-occurrence order
// ---------------------------------------------------------------------------

function enumerateImages(L) {
  const out = [];
  const total = Math.pow(3, L);
  for (let code = 0; code < total; code++) {
    const img = new Array(L);
    let c = code;
    for (let s = L - 1; s >= 0; s--) { img[s] = c % 3; c = Math.floor(c / 3); }
    out.push(img);
  }
  return out;
}

/**
 * Exhaustive DFS over uniform maps g with |g| = L, testing images of x.
 * Returns { candidatesCompleted, pruneEvents, survivors, maxViolationPos,
 *           bestImages, symbolsAppended, aborted }.
 */
function sweepDFS(x, L, { canonical = true, budget = 5e8 } = {}) {
  const { order, first } = firstOccurrenceOrder(x);
  // limits[m] = length of the x-prefix scannable after assigning order[0..m]
  const limits = new Array(6);
  for (let m = 0; m < 5; m++) limits[m] = first[order[m + 1]];
  limits[5] = x.length;

  const allImages = enumerateImages(L);
  const maxImageLen = x.length * L;
  const pa = new Int32Array(maxImageLen + 1);
  const pb = new Int32Array(maxImageLen + 1);
  const pc = new Int32Array(maxImageLen + 1);
  const assigned = new Array(6).fill(null);

  const res = {
    L, depth: null, window: maxImageLen,
    candidatesCompleted: 0, pruneEvents: 0, survivors: [],
    maxViolationPos: -1, bestImages: null,
    symbolsAppended: 0, aborted: false
  };

  // phase: 0 = nothing emitted yet, 1 = 'a' seen but no 'b', 2 = free.
  function emit(xpFrom, xpTo, p, phase) {
    // Returns { p, phase, violation } scanning positions [xpFrom, xpTo).
    for (let xp = xpFrom; xp < xpTo; xp++) {
      const img = assigned[x[xp]];
      for (let s = 0; s < img.length; s++) {
        const sym = img[s];
        // phase 0: nothing emitted, only 'a' legal. phase 1: only 'a's so
        // far, 'a' or 'b' legal. phase 2: 'b' seen, all symbols legal.
        if (canonical && phase < 2) {
          if (phase === 0) {
            if (sym !== 0) return { p, phase, violation: 'noncanonical' };
            phase = 1;
          } else {
            if (sym === 2) return { p, phase, violation: 'noncanonical' };
            if (sym === 1) phase = 2;
          }
        }
        pa[p + 1] = pa[p] + (sym === 0 ? 1 : 0);
        pb[p + 1] = pb[p] + (sym === 1 ? 1 : 0);
        pc[p + 1] = pc[p] + (sym === 2 ? 1 : 0);
        p++;
        res.symbolsAppended++;
        for (let K = KLO; K <= KHI; K++) {
          if (p < 2 * K) break;
          const da = (pa[p - K] - pa[p - 2 * K]) - (pa[p] - pa[p - K]);
          if (da !== 0) continue;
          const db = (pb[p - K] - pb[p - 2 * K]) - (pb[p] - pb[p - K]);
          if (db !== 0) continue;
          const dc = (pc[p - K] - pc[p - 2 * K]) - (pc[p] - pc[p - K]);
          if (dc === 0) return { p, phase, violation: 'square' };
        }
      }
    }
    return { p, phase, violation: null };
  }

  function assign(m, xpDone, p, phase) {
    if (res.aborted) return;
    if (m === 6) {
      res.candidatesCompleted++;
      res.survivors.push(assigned.map(img => img.map(sym => THREE[sym]).join('')));
      return;
    }
    for (const img of allImages) {
      if (res.symbolsAppended > budget) { res.aborted = true; return; }
      assigned[order[m]] = img;
      const r = emit(xpDone, limits[m], p, phase);
      if (r.violation === 'square') {
        res.pruneEvents++;
        if (r.p > res.maxViolationPos) {
          res.maxViolationPos = r.p;
          res.bestImages = assigned.map(a => (a ? a.map(sym => THREE[sym]).join('') : '?'));
        }
      } else if (r.violation === null) {
        assign(m + 1, limits[m], r.p, r.phase);
      }
      // 'noncanonical' branches are represented by their canonical relabelling.
      if (res.aborted) return;
    }
    assigned[order[m]] = null;
  }

  assign(0, 0, 0, canonical ? 0 : 2);
  return res;
}

// ---------------------------------------------------------------------------
// Built-in controls: this module refuses to report if any of these fail.
// ---------------------------------------------------------------------------

function symbolsFromString(str) {
  return str.split('').map(ch => ch.charCodeAt(0) - 97);
}

function runControls() {
  const integ = verifyMorphismIntegrity();
  if (!integ.ok) throw new Error('morphisms.js integrity: ' + integ.errors.join('; '));

  // Control 1: first-occurrence order in h6^omega(a) is a,c,e,b,d,f at 0..5.
  const x2 = h6Prefix(2);
  const { order, first } = firstOccurrenceOrder(x2);
  const got = order.map(c => SIX[c]).join('');
  if (got !== 'acebdf' || order.some(c => first[c] !== order.indexOf(c))) {
    throw new Error(`first-occurrence control failed: order ${got}, positions ${order.map(c => first[c])}`);
  }

  // Control 2: the 34-square census of g3(h6^6(a)) (same definition as test.js
  // test 5: distinct u|v with K in [1,5]) must reproduce exactly 34.
  const x6 = h6Prefix(6);
  let gw = '';
  for (let i = 0; i < x6.length; i++) gw += G3[SIX[x6[i]]];
  const n = gw.length;
  const qa = new Int32Array(n + 1), qb = new Int32Array(n + 1), qc = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    qa[i + 1] = qa[i] + (gw[i] === 'a' ? 1 : 0);
    qb[i + 1] = qb[i] + (gw[i] === 'b' ? 1 : 0);
    qc[i + 1] = qc[i] + (gw[i] === 'c' ? 1 : 0);
  }
  const uniq = new Set();
  for (let i = 0; i < n; i++) {
    for (let K = 1; K <= 5; K++) {
      if (i + 2 * K > n) continue;
      const da = (qa[i + K] - qa[i]) - (qa[i + 2 * K] - qa[i + K]);
      const db = (qb[i + K] - qb[i]) - (qb[i + 2 * K] - qb[i + K]);
      const dc = (qc[i + K] - qc[i]) - (qc[i + 2 * K] - qc[i + K]);
      if (da === 0 && db === 0 && dc === 0) uniq.add(gw.substring(i, i + K) + '|' + gw.substring(i + K, i + 2 * K));
    }
  }
  if (uniq.size !== 34) throw new Error(`g3 census control failed: ${uniq.size} distinct squares, expected 34`);

  // Control 3: negative control. The all-'a' map at L=1 must die when the
  // 4th symbol completes the K=2 square aa|aa.
  const allA = [[0], [0], [0], [0], [0], [0]];
  const death = directScan(x6, allA, KLO, KHI);
  if (death !== 4) throw new Error(`negative control failed: all-'a' map died at ${death}, expected 4`);

  // Control 4 (g3 context, informational + sanity): g3's own image must die
  // inside the open window K in [2,5] - that failure is the whole problem.
  const g3Images = [G3.a, G3.b, G3.c, G3.d, G3.e, G3.f].map(symbolsFromString);
  const g3Death = directScan(x6, g3Images, KLO, KHI);
  if (g3Death === -1) throw new Error('g3 control failed: no K in [2,5] square found, contradicting the 34-square census');

  return { g3Death, censusSize: uniq.size };
}

/**
 * L=1 cross-check: the DFS with symmetry reduction must agree with a direct,
 * independently coded full enumeration of all 3^6 = 729 maps.
 */
function crossCheckL1(depth) {
  const x = h6Prefix(depth);

  // Direct full enumeration.
  const full = [];
  for (let code = 0; code < 729; code++) {
    const images = [];
    let c = code;
    for (let i = 0; i < 6; i++) { images.push([c % 3]); c = Math.floor(c / 3); }
    full.push({ images, death: directScan(x, images, KLO, KHI) });
  }

  // Orbit constancy: every map must die exactly where its canonical form dies.
  const canonDeath = new Map();
  for (const f of full) {
    const key = canonicalize(x, f.images).map(i => i.join('')).join(',');
    if (!canonDeath.has(key)) canonDeath.set(key, []);
    canonDeath.get(key).push(f.death);
  }
  for (const [key, deaths] of canonDeath) {
    if (new Set(deaths).size !== 1) {
      throw new Error(`orbit constancy failed for canonical class ${key}: deaths ${[...new Set(deaths)]}`);
    }
  }

  // DFS agreement on survivors and on the maximal first-violation position.
  const dfs = sweepDFS(x, 1, { canonical: true });
  const fullSurvivors = full.filter(f => f.death === -1).length;
  const dfsSurvivors = dfs.survivors.length;
  const fullMax = Math.max(...full.filter(f => f.death !== -1).map(f => f.death));
  if (fullSurvivors === 0 && dfsSurvivors !== 0) throw new Error('cross-check: DFS reports survivors the full sweep does not');
  if (fullSurvivors !== 0) {
    // Survivor counts must relate by orbit expansion; verify via canonical keys.
    const survKeys = new Set(full.filter(f => f.death === -1)
      .map(f => canonicalize(x, f.images).map(i => i.join('')).join(',')));
    if (survKeys.size !== dfsSurvivors) {
      throw new Error(`cross-check: ${survKeys.size} canonical survivor classes vs DFS ${dfsSurvivors}`);
    }
  }
  if (dfs.maxViolationPos !== fullMax) {
    throw new Error(`cross-check: DFS max violation ${dfs.maxViolationPos} vs full ${fullMax}`);
  }
  return { classes: canonDeath.size, fullSurvivors, dfsSurvivors, maxViolationPos: fullMax };
}

// ---------------------------------------------------------------------------
// Survivor escalation
// ---------------------------------------------------------------------------

function escalateSurvivor(imagesStr, depth) {
  const images = imagesStr.map(symbolsFromString);
  const deeper = Math.min(depth + 3, 10);
  const xBig = h6Prefix(deeper);
  const smallK = directScan(xBig, images, KLO, KHI);
  const largeK = directScan(xBig, images, 6, 100);
  return { deeperDepth: deeper, windowSymbols: xBig.length * images[0].length, smallK, largeK };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { depth: 7, Ls: [1, 2], budget: 5e8, canonical: true };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--depth') opt.depth = parseInt(args[++i], 10);
    else if (args[i] === '--L') opt.Ls = args[++i].split(',').map(Number);
    else if (args[i] === '--budget') opt.budget = Number(args[++i]);
    else if (args[i] === '--nosym') opt.canonical = false;
  }

  console.log('=== h6-image-sweep: route (c), uniform images of h6^omega(a) ===\n');

  const ctrl = runControls();
  console.log(`[CONTROL] morphisms.js integrity ok; first-occurrence order a,c,e,b,d,f at 0..5`);
  console.log(`[CONTROL] g3 census reproduced: ${ctrl.censusSize} distinct abelian squares (K in [1,5]) in g3(h6^6(a))`);
  console.log(`[CONTROL] negative control: all-'a' map dies at symbol 4`);
  console.log(`[CONTROL] g3 itself first violates K in [2,5] at image symbol ${ctrl.g3Death} - that residue is the open problem\n`);

  const cc = crossCheckL1(Math.min(opt.depth, 6));
  console.log(`[CONTROL] L=1 cross-check: ${cc.classes} canonical classes cover all 729 maps; orbit-constant deaths;`);
  console.log(`          DFS agrees with direct enumeration (survivor classes ${cc.dfsSurvivors}, max violation ${cc.maxViolationPos})\n`);

  const x = h6Prefix(opt.depth);
  console.log(`Base word: h6^${opt.depth}(a), ${x.length} letters. Test: abelian squares, K in [${KLO},${KHI}], scanned by end position.\n`);

  for (const L of opt.Ls) {
    const t0 = Date.now();
    const r = sweepDFS(x, L, { canonical: opt.canonical, budget: opt.budget });
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    const cov = opt.canonical ? 'canonical representatives (all 3^' + (6 * L) + ' maps up to S3 relabelling)' : 'all maps, no symmetry reduction';
    console.log(`--- L = ${L} (${cov}) ---`);
    if (r.aborted) {
      console.log(`    INCOMPLETE: budget of ${opt.budget} appended symbols exhausted after ${dt}s.`);
      console.log(`    No exhaustiveness claim may be made for L = ${L} from this run.\n`);
      continue;
    }
    console.log(`    completed candidates reaching full window: ${r.candidatesCompleted}`);
    console.log(`    pruned candidate classes (first violation inside window): ${r.pruneEvents}`);
    console.log(`    survivors with no violation in the ${r.window}-symbol window: ${r.survivors.length}`);
    console.log(`    latest first-violation at image symbol ${r.maxViolationPos}` +
      (r.bestImages ? ` (a:${r.bestImages[0]} b:${r.bestImages[1]} c:${r.bestImages[2]} d:${r.bestImages[3]} e:${r.bestImages[4]} f:${r.bestImages[5]})` : ''));
    console.log(`    work: ${r.symbolsAppended} symbols appended, ${dt}s`);
    for (const s of r.survivors) {
      console.log(`    SURVIVOR (bounded evidence only): a:${s[0]} b:${s[1]} c:${s[2]} d:${s[3]} e:${s[4]} f:${s[5]}`);
      const esc = escalateSurvivor(s, opt.depth);
      console.log(`      escalation: depth ${esc.deeperDepth}, window ${esc.windowSymbols} symbols; ` +
        `K in [2,5]: ${esc.smallK === -1 ? 'no violation in window' : 'violation at ' + esc.smallK}; ` +
        `K in [6,100]: ${esc.largeK === -1 ? 'no violation in window' : 'violation at ' + esc.largeK}`);
      console.log(`      next step for any standing survivor: decision-preconditions.js (Proposition 9 route); no stronger wording before that.`);
    }
    console.log('');
  }

  console.log('Reminder: violations are conclusive for the infinite image; absence of violations');
  console.log('is bounded evidence in the stated window only. See MATH_CLAIMS.md before quoting.');
}

if (require.main === module) {
  main();
}

module.exports = { h6Prefix, firstOccurrenceOrder, directScan, canonicalize, sweepDFS, runControls, crossCheckL1, KLO, KHI };
