'use strict';

/**
 * table-library.js
 * ----------------
 * Persistent store for extension-depth tables, keyed by affine class.
 *
 * WHY THIS EXISTS
 * ---------------
 * NEGATIVE_RESULTS.md item 9 measured the uncomfortable fact: building a
 * pruning table costs about one full search, so a single run gains nothing
 * from it (1.00x). MATH_CLAIMS.md row 55 measured the other half: a table is
 * worth 84-89x on search nodes, and it transfers across an entire affine class
 * by relabelling keys, at zero search cost. Those two facts only combine into
 * a benefit if tables outlive the run that built them. This module is that
 * persistence, and it is the last piece of the residue principle
 * (SANALAB_PLAN.md 5d).
 *
 * KEYING
 * ------
 * A table is stored once per (canonical affine representative, h, cap). A
 * request for any alphabet A is served by
 *   1. canonicalising A to C and recording the affine map C -> A,
 *   2. loading or building the table for C,
 *   3. relabelling its keys through that map.
 * Step 3 performs no search, so the first alphabet in a class pays and every
 * other member of the class is free. For four letters with max element <= 8
 * that is 31 canonical classes covering every affine image of them.
 *
 * THE MAP FROM CANONICAL FORM BACK TO THE REQUESTED ALPHABET
 * ----------------------------------------------------------
 * canonicalForm shifts the minimum to 0, divides by the gcd of the
 * differences, and takes the lexicographically smaller of the result and its
 * reflection. Inverting that gives A = alpha*C + beta with
 *     no reflection:  alpha = g,   beta = min(A)
 *     reflection:     alpha = -g,  beta = g*max(scaled) + min(A)
 * A control asserts alpha*C + beta reproduces A exactly, for reflected,
 * scaled, shifted and negated alphabets. If that map were wrong, every served
 * table would be silently wrong, so it is checked rather than trusted.
 *
 * INTEGRITY
 * ---------
 * Each stored record carries provenance (commit, build cost, completeness) and
 * a djb2 checksum over its canonically ordered entries, using the project's
 * existing checksum (morphisms.js) rather than a second convention. A record
 * whose checksum does not match is refused, not repaired: a corrupted oracle
 * would silently weaken every verdict built on it.
 *
 * Unknown entries never prune (extension-table.js), so an incomplete cached
 * table is safe to serve. It is still marked incomplete, and a request that
 * needs a complete table can say so.
 *
 * Usage:  node table-library.js [--dir tables] [--alphabet 0,1,3,4]
 *                               [--h 8] [--cap 70] [--demo]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const et = require('./extension-table.js');
const { canonicalForm } = require('./additive-sweep.js');
const { djb2Hash } = require('./morphisms.js');

const FORMAT = 'sanalab-extension-table/1';
const DEFAULT_DIR = path.join(__dirname, 'tables');

// ---------------------------------------------------------------------------
// Affine keying
// ---------------------------------------------------------------------------

function gcd2(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }

/**
 * For alphabet A returns { canon, alpha, beta } with alpha*canon + beta = A
 * as sets, canon being the canonical affine representative.
 */
function canonicalMap(A) {
  const sorted = Array.from(new Set(A)).sort((x, y) => x - y);
  const min = sorted[0];
  const shifted = sorted.map(x => x - min);
  let g = 0;
  for (const x of shifted.slice(1)) g = gcd2(g, x);
  if (g === 0) g = 1;
  const scaled = shifted.map(x => x / g);
  const M = scaled[scaled.length - 1];
  const reflected = scaled.map(x => M - x).sort((x, y) => x - y);

  let usesReflection = false;
  for (let i = 0; i < scaled.length; i++) {
    if (reflected[i] !== scaled[i]) { usesReflection = reflected[i] < scaled[i]; break; }
  }
  const canon = usesReflection ? reflected : scaled;
  const alpha = usesReflection ? -g : g;
  const beta = usesReflection ? g * M + min : min;

  // Never trust the derivation; check it here, every time. It is cheap.
  const rebuilt = canon.map(x => alpha * x + beta).sort((x, y) => x - y);
  if (rebuilt.join(',') !== sorted.join(',')) {
    throw new Error(`canonicalMap is wrong for {${sorted}}: ${alpha}*{${canon}}+${beta} = {${rebuilt}}`);
  }
  const viaSweep = canonicalForm(A).join(',');
  if (canon.join(',') !== viaSweep) {
    throw new Error(`canonicalMap disagrees with additive-sweep canonicalForm: {${canon}} vs {${viaSweep}}`);
  }
  return { canon, alpha, beta };
}

// ---------------------------------------------------------------------------
// Records: serialisation, checksum, storage
// ---------------------------------------------------------------------------

function gitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: __dirname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) { return 'unknown'; }
}

/** Canonical text of the entries, so the checksum does not depend on key order. */
function entriesDigest(entries) {
  const keys = Array.from(entries.keys()).sort();
  let s = '';
  for (const k of keys) {
    const v = entries.get(k);
    s += k + ':' + (v === et.UNKNOWN || v === null ? 'U' : v) + ';';
  }
  return djb2Hash(s).toString(16);
}

function recordFor(canon, table) {
  return {
    format: FORMAT,
    canonical: canon,
    h: table.h,
    cap: table.cap,
    size: table.size,
    known: table.known,
    complete: table.complete,
    buildNodes: table.nodes,
    commit: gitCommit(),
    created: new Date().toISOString(),
    checksum: entriesDigest(table.entries),
    entries: Object.fromEntries(Array.from(table.entries.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1)))
  };
}

function verifyRecord(rec) {
  if (rec.format !== FORMAT) throw new Error(`unknown table format ${rec.format}`);
  const entries = new Map(Object.entries(rec.entries));
  const digest = entriesDigest(entries);
  if (digest !== rec.checksum) {
    throw new Error(`table checksum mismatch for {${rec.canonical}} h=${rec.h}: stored ${rec.checksum}, computed ${digest}`);
  }
  if (entries.size !== rec.size) throw new Error(`table for {${rec.canonical}} declares ${rec.size} entries but holds ${entries.size}`);
  return entries;
}

function fileFor(dir, canon, h, cap) {
  return path.join(dir, `A${canon.join('-')}_h${h}_cap${cap}.json`);
}

function store(dir, canon, table) {
  fs.mkdirSync(dir, { recursive: true });
  const file = fileFor(dir, canon, table.h, table.cap);
  fs.writeFileSync(file, JSON.stringify(recordFor(canon, table), null, 0));
  return file;
}

function loadRecord(dir, canon, h, cap) {
  const file = fileFor(dir, canon, h, cap);
  if (!fs.existsSync(file)) return null;
  const rec = JSON.parse(fs.readFileSync(file, 'utf8'));
  const entries = verifyRecord(rec);
  return {
    A: rec.canonical, h: rec.h, cap: rec.cap, entries,
    size: rec.size, known: rec.known, complete: rec.complete,
    nodes: 0, buildNodes: rec.buildNodes, commit: rec.commit
  };
}

// ---------------------------------------------------------------------------
// The one function callers need
// ---------------------------------------------------------------------------

/**
 * Table for alphabet A at window h and cap. Builds the canonical table if the
 * library lacks it, then relabels to A. Returns { table, source, searchNodes }
 * where source is 'built' (paid now) or 'library' (paid earlier, or by another
 * member of the same affine class).
 */
function get(A, h, cap, opts = {}) {
  const dir = opts.dir || DEFAULT_DIR;
  const { canon, alpha, beta } = canonicalMap(A);

  let canonTable = null, source = 'library';
  if (!opts.forceBuild) canonTable = loadRecord(dir, canon, h, cap);
  if (!canonTable) {
    canonTable = et.buildTable(canon, h, cap, opts.buildOpts || {});
    if (opts.store !== false) store(dir, canon, canonTable);
    source = 'built';
  }
  const searchNodes = source === 'built' ? canonTable.nodes : 0;

  const isIdentity = alpha === 1 && beta === 0;
  const table = isIdentity ? canonTable : et.affineImage(canonTable, alpha, beta);
  return { table, canon, alpha, beta, source, searchNodes };
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls(opts = {}) {
  const notes = [];
  const dir = opts.dir || fs.mkdtempSync(path.join(require('os').tmpdir(), 'tablib-'));

  // 1. The canonical map must reproduce the requested alphabet, including
  //    reflected, scaled, shifted and negated cases.
  {
    const cases = [
      [0, 1, 3, 4], [4, 3, 1, 0], [-2, 3, 13, 18], [0, 3, 9, 12],
      [0, 2, 3, 4], [7, 8, 10, 11], [0, 1, 2, 4], [-5, -4, -2, -1],
      [0, 1, 2], [10, 20, 30]
    ];
    for (const A of cases) {
      const { canon, alpha, beta } = canonicalMap(A);   // throws if inconsistent
      const sorted = Array.from(new Set(A)).sort((x, y) => x - y);
      const rebuilt = canon.map(x => alpha * x + beta).sort((x, y) => x - y);
      if (rebuilt.join(',') !== sorted.join(',')) throw new Error(`map failed for {${A}}`);
    }
    notes.push(`canonical map reproduces all ${cases.length} test alphabets, reflections and scalings included`);
  }

  // 2. A library hit must equal a direct build, entry for entry, and cost no
  //    search. This is the claim the whole module exists to make.
  {
    const A = [0, 1, 2, 3], h = 7, cap = 40;
    const first = get(A, h, cap, { dir, forceBuild: true });
    if (first.source !== 'built' || first.searchNodes === 0) throw new Error('the first request should have built the table');
    const second = get(A, h, cap, { dir });
    if (second.source !== 'library') throw new Error('the second request should have been served from the library');
    if (second.searchNodes !== 0) throw new Error('a library hit must cost no search');
    if (second.table.entries.size !== first.table.entries.size) throw new Error('library hit has a different size');
    for (const [k, v] of first.table.entries) {
      if (second.table.entries.get(k) !== v) throw new Error(`library hit differs at ${k}`);
    }
    notes.push(`a library hit reproduces the built table exactly at zero search cost (${first.searchNodes} nodes saved)`);
  }

  // 3. Serving an affine sibling must equal building for it directly.
  {
    const h = 7, cap = 40;
    const sibling = [-2, 1, 4, 7];                    // 3*{0,1,2,3} - 2
    const served = get(sibling, h, cap, { dir });
    if (served.searchNodes !== 0) throw new Error('an affine sibling of a cached class must cost no search');
    const direct = et.buildTable(Array.from(new Set(sibling)).sort((a, b) => a - b), h, cap);
    if (served.table.entries.size !== direct.entries.size) throw new Error('sibling size differs from a direct build');
    for (const [k, v] of direct.entries) {
      if (served.table.entries.get(k) !== v) throw new Error(`sibling differs from a direct build at ${k}`);
    }
    notes.push('an affine sibling is served from the same stored table and matches a direct build entry for entry');
  }

  // 4. A tampered record must be refused, not repaired.
  {
    const A = [0, 1, 2, 3], h = 7, cap = 40;
    const file = fileFor(dir, canonicalMap(A).canon, h, cap);
    const rec = JSON.parse(fs.readFileSync(file, 'utf8'));
    const firstKey = Object.keys(rec.entries)[0];
    const backup = rec.entries[firstKey];
    rec.entries[firstKey] = (backup === null ? 0 : backup + 1);
    fs.writeFileSync(file, JSON.stringify(rec));
    let refused = false;
    try { loadRecord(dir, canonicalMap(A).canon, h, cap); } catch (e) { refused = /checksum/.test(e.message); }
    if (!refused) throw new Error('a tampered table was accepted');
    rec.entries[firstKey] = backup;
    fs.writeFileSync(file, JSON.stringify(rec));
    if (!loadRecord(dir, canonicalMap(A).canon, h, cap)) throw new Error('the restored table should load again');
    notes.push('a single altered entry is caught by the checksum and the record is refused');
  }

  // 5. The served table must still be a sound oracle: it must not change the
  //    answer of a search it prunes. Ties back to MATH_CLAIMS row 55.
  {
    const A = [0, 1, 2, 3];
    const { table } = get(A, 8, 70, { dir });
    const base = et.search(A, 200, 1e9, null);
    const pruned = et.search(A, 200, 1e9, table);
    if (base.longest !== pruned.longest || base.exhausted !== pruned.exhausted) {
      throw new Error('a library-served table changed the answer');
    }
    if (pruned.nodes >= base.nodes) throw new Error('a library-served table pruned nothing');
    notes.push(`a library-served table preserves longest ${base.longest} and cuts nodes ${base.nodes} -> ${pruned.nodes}`);
  }

  // 6. Ternary positive control, tied to MATH_CLAIMS.md row 1.
  {
    const { table } = get([0, 1, 2], 7, 20, { dir });
    if (table.entries.size !== 18) throw new Error(`ternary control: ${table.entries.size} words of length 7, expected 18 (row 1)`);
    for (const [k, v] of table.entries) if (v !== 0) throw new Error(`ternary control: ${k} has depth ${v}, expected 0`);
    notes.push('ternary control: the stored table holds all 18 words of length 7, every one with depth 0 (row 1)');
  }

  if (!opts.dir) fs.rmSync(dir, { recursive: true, force: true });
  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { dir: DEFAULT_DIR, alphabet: [0, 1, 3, 4], h: 8, cap: 70, demo: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir') opt.dir = path.resolve(args[++i]);
    else if (args[i] === '--alphabet') opt.alphabet = args[++i].split(',').map(Number);
    else if (args[i] === '--h') opt.h = parseInt(args[++i], 10);
    else if (args[i] === '--cap') opt.cap = parseInt(args[++i], 10);
    else if (args[i] === '--demo') opt.demo = true;
  }

  console.log('=== table-library: extension-depth tables stored once per affine class ===\n');
  for (const n of runControls()) console.log(`[CONTROL] ${n}`);
  console.log('');

  if (opt.demo) {
    // The payback that NEGATIVE_RESULTS item 9 says a single run never sees.
    const A = [0, 1, 2, 3];
    const siblings = [[0, 1, 2, 3], [4, 3, 1, 0], [-2, 1, 4, 7], [0, 5, 10, 15], [100, 101, 102, 103], [0, 2, 3, 4]];
    const demoDir = path.join(opt.dir, 'demo');
    fs.rmSync(demoDir, { recursive: true, force: true });
    console.log(`payback demonstration, window h=${opt.h}, cap=${opt.cap}`);
    let withLibrary = 0, withoutLibrary = 0;
    const classCost = new Map();
    for (const S of siblings) {
      const r = get(S, opt.h, opt.cap, { dir: demoDir });
      withLibrary += r.searchNodes;
      // The honest counterfactual: without a library, EVERY request builds its
      // own class's table, so the alternative cost is that class's build cost
      // charged once per request - not one class's cost multiplied by anything.
      const key = r.canon.join(',');
      if (!classCost.has(key)) classCost.set(key, r.source === 'built' ? r.searchNodes : et.buildTable(r.canon, opt.h, opt.cap).nodes);
      withoutLibrary += classCost.get(key);
      console.log(`  {${String(S.join(',')).padEnd(16)}} -> class {${key}}  x -> ${r.alpha}x+${r.beta}   ${r.source.padEnd(7)} ${r.searchNodes} search nodes`);
    }
    console.log(`\n  ${siblings.length} requests over ${classCost.size} distinct classes`);
    console.log(`  search nodes with the library   : ${withLibrary}`);
    console.log(`  search nodes without it         : ${withoutLibrary}   (each request builds its own class)`);
    console.log(`  saved: ${withoutLibrary - withLibrary} nodes, ${(withoutLibrary / Math.max(1, withLibrary)).toFixed(2)}x`);
    console.log(`\n  Read this carefully: the saving equals the cost of the repeated classes only.`);
    console.log(`  A class requested once saves nothing (NEGATIVE_RESULTS item 9 still holds), and a`);
    console.log(`  class that is expensive to build stays expensive the first time. The library`);
    console.log(`  converts row 55's 84-89x from a claim about one search into a claim about a`);
    console.log(`  workload - and only for workloads that revisit a class.`);
    fs.rmSync(demoDir, { recursive: true, force: true });
    return;
  }

  const t0 = Date.now();
  const r = get(opt.alphabet, opt.h, opt.cap, { dir: opt.dir });
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`alphabet {${opt.alphabet.join(',')}} belongs to class {${r.canon.join(',')}} via x -> ${r.alpha}x+${r.beta}`);
  console.log(`  served ${r.source}, ${r.searchNodes} search nodes, ${dt}s`);
  console.log(`  entries ${r.table.entries.size}, with a known bound ${r.table.known}, complete=${r.table.complete}`);
  console.log(`  library directory: ${opt.dir}`);
  console.log('\nThe first alphabet in a class pays; every affine image of it is then free.');
  console.log('Unknown entries never prune, so an incomplete cached table stays safe to use.');
}

if (require.main === module) {
  main();
}

module.exports = { canonicalMap, entriesDigest, recordFor, verifyRecord, fileFor, store, loadRecord, get, runControls, DEFAULT_DIR };
