'use strict';

/**
 * extension-table.js
 * ------------------
 * Extension-depth tables: exact language invariants that double as SOUND
 * pruning oracles, and that persist and transfer between runs.
 *
 * WHY THIS EXISTS
 * ---------------
 * SANALAB_PLAN.md 5d states the residue principle: a run that leaves nothing
 * a later run can consume is wasted computation. This module is the first
 * concrete residue. An extension-depth table is simultaneously
 *
 *   - exact knowledge: maxExt(u) is a language invariant, the same notion as
 *     the extension depth of unfavourable-factors.js (MATH_CLAIMS.md row 47),
 *   - a sound pruning oracle that preserves both the longest word and the
 *     exhaustion verdict, and
 *   - transferable across an entire affine class at zero search cost.
 *
 * THE SOUNDNESS ARGUMENT (must hold, or every exhaustion verdict collapses)
 * ------------------------------------------------------------------------
 * Let P be a word and u its length-h suffix. Then u.v is a FACTOR of P.v for
 * every v, so any additive square occurring in u.v also occurs in P.v.
 * Contrapositive: P.v additive-square-free implies u.v additive-square-free.
 * Hence
 *        { v : P.v square-free }  subset of  { v : u.v square-free }
 * and therefore  maxExt(P) <= maxExt(u).
 *
 * So len(P) + maxExt(u) is an admissible upper bound on the length of any word
 * extending P. Pruning a branch when that bound cannot beat the best word found
 * so far is branch-and-bound with an admissible bound: it removes only branches
 * proved incapable of improving the answer, so the reported longest word and
 * the exhaustion verdict are both unchanged. Verified by control, not assumed.
 *
 * AFFINE TRANSFER
 * ---------------
 * Additive-square-freeness is invariant under x -> a*x + b with a != 0
 * (MATH_CLAIMS.md row 54, additive-sweep.js). A table therefore transfers to
 * any affine image by relabelling its keys, with no search at all. One table
 * serves a whole affine class; the control asserts the transferred table is
 * identical to the directly computed one.
 *
 * WHAT A CAPPED ENTRY MEANS
 * -------------------------
 * maxExt is computed with a cap. An entry that reaches the cap, or that a
 * budget-limited build never finished, is stored as UNKNOWN and yields no
 * pruning. Unknown is always safe: it weakens the oracle, never the verdict.
 *
 * Usage:  node extension-table.js [--alphabet 0,1,2,3] [--h 10] [--cap 70]
 *                                 [--out table.json]
 */

const fs = require('fs');
const path = require('path');

const UNKNOWN = null;   // JSON-friendly stand-in for "no bound known"

// ---------------------------------------------------------------------------
// Core language predicate, shared with additive-sweep.js by definition, not
// by import: this file states the condition independently so a defect in one
// does not silently propagate to the other.
// ---------------------------------------------------------------------------

function endsCleanFactory(ps) {
  return function (len) {
    for (let K = 1; 2 * K <= len; K++) {
      if (ps[len - K] - ps[len - 2 * K] === ps[len] - ps[len - K]) return false;
    }
    return true;
  };
}

/** All additive-square-free words of length h over A. */
function squareFreeWords(A, h) {
  const out = [];
  const w = new Int32Array(h);
  const ps = new Int32Array(h + 1);
  const ok = endsCleanFactory(ps);
  (function rec(len) {
    if (len === h) { out.push(Array.from(w)); return; }
    for (const s of A) {
      w[len] = s; ps[len + 1] = ps[len] + s;
      if (ok(len + 1)) rec(len + 1);
    }
  })(0);
  return out;
}

/**
 * maxExt(u): the greatest number of letters appendable to u, treating u as a
 * standalone word. Returns { depth, capped, nodes }; `capped` means the search
 * hit the cap or the budget, so the value is a lower bound, not a bound.
 */
function maxExtension(A, u, cap, budget) {
  const total = u.length + cap;
  const w = new Int32Array(total + 1);
  const ps = new Int32Array(total + 2);
  for (let i = 0; i < u.length; i++) { w[i] = u[i]; ps[i + 1] = ps[i] + u[i]; }
  const ok = endsCleanFactory(ps);
  let depth = 0, nodes = 0, capped = false;
  (function rec(len) {
    const ext = len - u.length;
    if (ext > depth) depth = ext;
    if (ext === cap) { capped = true; return; }
    for (const s of A) {
      if (++nodes > budget) { capped = true; return; }
      w[len] = s; ps[len + 1] = ps[len] + s;
      if (ok(len + 1)) { rec(len + 1); if (capped) return; }
    }
  })(u.length);
  return { depth, capped, nodes };
}

// ---------------------------------------------------------------------------
// Table construction, transfer, persistence
// ---------------------------------------------------------------------------

function buildTable(A, h, cap, opts = {}) {
  const budget = opts.budget || 1e9;
  const words = squareFreeWords(A, h);
  const entries = new Map();
  let nodes = 0, known = 0;
  for (const u of words) {
    const r = maxExtension(A, u, cap, opts.perWordBudget || 5e8);
    nodes += r.nodes;
    entries.set(u.join(','), r.capped ? UNKNOWN : r.depth);
    if (!r.capped) known++;
    if (nodes > budget) {
      // Remaining words stay absent, which reads as UNKNOWN: safe.
      return { A: A.slice(), h, cap, entries, nodes, size: words.length, known, complete: false };
    }
  }
  return { A: A.slice(), h, cap, entries, nodes, size: words.length, known, complete: true };
}

/** Table for the affine image a*A + b, obtained by relabelling keys only. */
function affineImage(table, a, b) {
  if (a === 0) throw new Error('affine image requires a != 0');
  const entries = new Map();
  for (const [key, v] of table.entries) {
    entries.set(key.split(',').map(x => a * Number(x) + b).join(','), v);
  }
  return {
    A: table.A.map(x => a * x + b).sort((x, y) => x - y),
    h: table.h, cap: table.cap, entries,
    nodes: 0, size: table.size, known: table.known, complete: table.complete,
    derivedFrom: { A: table.A.slice(), a, b }
  };
}

function serialize(table) {
  return JSON.stringify({
    alphabet: table.A, h: table.h, cap: table.cap,
    size: table.size, known: table.known, complete: table.complete,
    nodes: table.nodes,
    derivedFrom: table.derivedFrom || null,
    entries: Object.fromEntries(table.entries)
  });
}

function deserialize(json) {
  const o = typeof json === 'string' ? JSON.parse(json) : json;
  return {
    A: o.alphabet, h: o.h, cap: o.cap, size: o.size, known: o.known,
    complete: o.complete, nodes: o.nodes, derivedFrom: o.derivedFrom,
    entries: new Map(Object.entries(o.entries))
  };
}

// ---------------------------------------------------------------------------
// Search, with and without the oracle
// ---------------------------------------------------------------------------

function search(A, cap, budget, table) {
  const h = table ? table.h : 0;
  const w = new Int32Array(cap + 1);
  const ps = new Int32Array(cap + 2);
  const ok = endsCleanFactory(ps);
  let longest = 0, witness = [], nodes = 0, prunes = 0, exhausted = true;
  (function rec(len) {
    if (len > longest) { longest = len; witness = Array.from(w.slice(0, len)); }
    if (len === cap) { exhausted = false; return; }
    if (table && len >= h) {
      const m = table.entries.get(Array.from(w.slice(len - h, len)).join(','));
      // Absent or UNKNOWN yields no pruning, which is always safe.
      if (m !== undefined && m !== UNKNOWN && len + m <= longest) { prunes++; return; }
    }
    for (const s of A) {
      if (++nodes > budget) { exhausted = false; return; }
      w[len] = s; ps[len + 1] = ps[len] + s;
      if (ok(len + 1)) { rec(len + 1); if (!exhausted) return; }
    }
  })(0);
  return { longest, witness, nodes, prunes, exhausted };
}

// ---------------------------------------------------------------------------
// Controls. The module throws rather than reporting anything if these fail.
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];
  const A = [0, 1, 2, 3], H = 8, CAP = 70;
  const table = buildTable(A, H, CAP);

  // 1. The bound itself, tested against directly computed extensions. This is
  //    the load-bearing claim: if maxExt(prefix) ever exceeds the table value
  //    for its suffix, every exhaustion verdict built on the oracle is void.
  {
    let tested = 0;
    const w = new Int32Array(40), ps = new Int32Array(42);
    const ok = endsCleanFactory(ps);
    (function rec(len) {
      if (tested >= 400) return;
      if (len > H + 2) {
        const suffix = Array.from(w.slice(len - H, len)).join(',');
        const bound = table.entries.get(suffix);
        if (bound !== undefined && bound !== UNKNOWN) {
          const actual = maxExtension(A, Array.from(w.slice(0, len)), CAP, 1e8);
          if (!actual.capped && actual.depth > bound) {
            throw new Error(`soundness violated: prefix of length ${len} extends by ${actual.depth}, suffix bound says ${bound}`);
          }
          tested++;
        }
      }
      if (len === 16) return;
      for (const s of A) {
        w[len] = s; ps[len + 1] = ps[len] + s;
        if (ok(len + 1)) rec(len + 1);
        if (tested >= 400) return;
      }
    })(0);
    if (tested < 100) throw new Error(`soundness control only exercised ${tested} prefixes; too few to be meaningful`);
    notes.push(`bound maxExt(prefix) <= maxExt(suffix) held on ${tested} directly computed prefixes`);
  }

  // 2. The oracle must not change the answer.
  {
    const base = search(A, 200, 1e9, null);
    const pruned = search(A, 200, 1e9, table);
    if (base.longest !== pruned.longest || base.exhausted !== pruned.exhausted) {
      throw new Error(`oracle changed the answer: ${base.longest}/${base.exhausted} vs ${pruned.longest}/${pruned.exhausted}`);
    }
    if (pruned.nodes >= base.nodes) throw new Error('oracle pruned nothing; the table is not being consulted');
    notes.push(`oracle preserves longest ${base.longest} and exhaustion, cutting search nodes ${base.nodes} -> ${pruned.nodes}`);
  }

  // 3. Affine transfer must equal direct computation, entry for entry.
  {
    const moved = affineImage(table, 3, -5);
    const direct = buildTable(table.A.map(x => 3 * x - 5), H, CAP);
    if (moved.entries.size !== direct.entries.size) {
      throw new Error(`affine transfer size ${moved.entries.size} vs direct ${direct.entries.size}`);
    }
    for (const [k, v] of direct.entries) {
      if (moved.entries.get(k) !== v) throw new Error(`affine transfer differs at ${k}: ${moved.entries.get(k)} vs ${v}`);
    }
    notes.push(`affine transfer reproduces ${direct.entries.size} entries exactly, at zero search cost`);
  }

  // 4. Round-trip through JSON must be lossless.
  {
    const back = deserialize(serialize(table));
    if (back.entries.size !== table.entries.size) throw new Error('serialisation lost entries');
    for (const [k, v] of table.entries) {
      if (back.entries.get(k) !== v) throw new Error(`serialisation changed ${k}`);
    }
    notes.push('serialisation round-trips without loss');
  }

  // 5. Ternary positive control, tied to MATH_CLAIMS.md row 1: over three
  //    letters every length-7 word has extension depth 0, and there are 18.
  {
    const t3 = buildTable([0, 1, 2], 7, 20);
    if (t3.size !== 18) throw new Error(`ternary control: ${t3.size} words of length 7, expected 18 (row 1)`);
    for (const [k, v] of t3.entries) {
      if (v !== 0) throw new Error(`ternary control: word ${k} reports extension depth ${v}, expected 0`);
    }
    notes.push('ternary control: all 18 words of length 7 have extension depth 0 (row 1)');
  }

  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { alphabet: [0, 1, 2, 3], h: 10, cap: 70, out: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--alphabet') opt.alphabet = args[++i].split(',').map(Number);
    else if (args[i] === '--h') opt.h = parseInt(args[++i], 10);
    else if (args[i] === '--cap') opt.cap = parseInt(args[++i], 10);
    else if (args[i] === '--out') opt.out = args[++i];
  }

  console.log('=== extension-table: reusable extension-depth tables and their pruning oracle ===\n');

  for (const n of runControls()) console.log(`[CONTROL] ${n}`);
  console.log('');

  const A = opt.alphabet;
  const t0 = Date.now();
  const table = buildTable(A, opt.h, opt.cap);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`alphabet {${A.join(',')}}, window h=${opt.h}, cap=${opt.cap}`);
  console.log(`  entries: ${table.size} square-free words of length ${opt.h}`);
  console.log(`  with a known bound: ${table.known} (${(100 * table.known / table.size).toFixed(1)}%); the rest prune nothing`);
  console.log(`  build cost: ${table.nodes} nodes, ${dt}s, complete=${table.complete}`);

  const base = search(A, 300, 2e8, null);
  const pruned = search(A, 300, 2e8, table);
  console.log(`\nsearch without the oracle: longest ${base.longest}, ${base.nodes} nodes, exhausted=${base.exhausted}`);
  console.log(`search with the oracle   : longest ${pruned.longest}, ${pruned.nodes} nodes, ${pruned.prunes} prunes, exhausted=${pruned.exhausted}`);
  if (base.exhausted && pruned.exhausted) {
    console.log(`  search nodes reduced by ${(base.nodes / Math.max(1, pruned.nodes)).toFixed(1)}x; build cost is paid once and reused`);
  }

  if (opt.out) {
    fs.writeFileSync(path.resolve(opt.out), serialize(table));
    console.log(`\ntable written to ${opt.out} (${table.entries.size} entries). It transfers to every`);
    console.log(`affine image of this alphabet by key relabelling, with no further search.`);
  }

  console.log('\nA table is a residue, not a result: it makes later runs cheaper and is itself an');
  console.log('exact invariant. Unknown entries never prune, so they weaken the oracle and never');
  console.log('the verdict. See MATH_CLAIMS.md before quoting any number from here.');
}

if (require.main === module) {
  main();
}

module.exports = {
  UNKNOWN, squareFreeWords, maxExtension, buildTable, affineImage,
  serialize, deserialize, search, runControls
};
