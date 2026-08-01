'use strict';

/**
 * claims-export.js
 * ----------------
 * Turns MATH_CLAIMS.md into machine-readable claims.json, and enforces that
 * every number anyone quotes from this project can be traced to a ledger row.
 *
 * WHY THIS EXISTS
 * ---------------
 * UI_UX_PLAN.md item 1: the recurring failure is that figures get COPIED out
 * of the ledger into prose, posters and pages, after which the drift checker
 * can only police the copies. On 2026-07-30 an externally produced infographic
 * about this project stated a record word length of "~2 026". No such claim
 * exists anywhere in the repository; every occurrence of 2026 in the ledger is
 * a DATE. The figure was not wrong so much as sourceless, and nothing in the
 * pipeline could have caught it, because the poster was written by hand.
 *
 * The fix is to invert the direction. The ledger declares which of its figures
 * are quotable, each with the row it comes from. This module verifies that the
 * declared value actually occurs in that row's text and emits claims.json.
 * Anything rendering project figures reads that file. A figure that is not in
 * it cannot be displayed, so an unsourced number becomes structurally
 * impossible rather than merely discouraged.
 *
 * WHAT IS DELIBERATELY NOT DONE
 * -----------------------------
 * No attempt is made to mine arbitrary numbers out of prose. That would invent
 * a second, fuzzier authority next to the ledger, which is the exact failure
 * this project keeps correcting. The ledger states what is quotable; this
 * module only checks and transports.
 *
 * As of 2026-07-31 this also syncs an embedded copy into index.html's
 * <script id="claims-data"> block, so the page can bind figures and status
 * badges (data-claim-key / data-claim-status attributes) without a server or
 * fetch() -- opening the file directly still works, and the embedded copy
 * cannot silently drift because this script overwrites it every run and
 * check-claims-drift.js verifies it matches.
 *
 * Usage:  node claims-export.js [--out claims.json] [--check]
 */

const fs = require('fs');
const path = require('path');

const LEDGER = path.join(__dirname, '..', 'MATH_CLAIMS.md');
const INDEX_HTML = path.join(__dirname, '..', 'index.html');
const VALID_STATUS = ['PRIMARY', 'COMPUTED', 'INDIRECT', 'REJECTED'];

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/** Split a markdown table row on unescaped pipes. */
function splitRow(line) {
  const cells = [];
  let cur = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '\\') { cur += line[i] + (line[++i] || ''); continue; }
    if (c === '|') { cells.push(cur); cur = ''; continue; }
    cur += c;
  }
  cells.push(cur);
  return cells.map(s => s.trim()).filter((_, i, a) => i !== 0 && i !== a.length - 1);
}

function parseLedger(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/^\| \d+[a-c]? \|/.test(line)) continue;
    const cells = splitRow(line);
    if (cells.length < 6) {
      throw new Error(`ledger row ${cells[0]} has ${cells.length} columns, expected at least 6`);
    }
    const [id, claim, source, statusCell, checked, traced] = cells;
    const status = VALID_STATUS.find(s => statusCell.includes(s));
    if (!status) throw new Error(`ledger row ${id} has no recognised status: ${statusCell.slice(0, 60)}`);
    rows.push({
      id, claim, source, status,
      statusRaw: statusCell,
      lastChecked: checked,
      lastTraced: traced,
      notes: cells.slice(6).join(' | ')
    });
  }
  if (rows.length === 0) throw new Error('no rows parsed from MATH_CLAIMS.md; the table format changed');
  return rows;
}

/** Quotable facts are declared inside an HTML comment block in the ledger. */
function parseQuotable(text) {
  const m = text.match(/<!--\s*QUOTABLE_FACTS\s*([\s\S]*?)QUOTABLE_FACTS\s*-->/);
  if (!m) return [];
  let parsed;
  try {
    parsed = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`QUOTABLE_FACTS block is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(parsed)) throw new Error('QUOTABLE_FACTS must be a JSON array');
  return parsed;
}

// ---------------------------------------------------------------------------
// The check that gives the file its value
// ---------------------------------------------------------------------------

/**
 * Every declared fact must name an existing row, and its value must actually
 * occur in that row. Without this the block would be just another place to
 * type a number into.
 */
function verifyQuotable(facts, rows) {
  const byId = new Map(rows.map(r => [r.id, r]));
  const seen = new Set();
  for (const f of facts) {
    for (const k of ['key', 'value', 'row', 'label']) {
      if (typeof f[k] !== 'string' || f[k] === '') {
        throw new Error(`quotable fact ${JSON.stringify(f)} is missing a non-empty "${k}"`);
      }
    }
    if (seen.has(f.key)) throw new Error(`duplicate quotable key "${f.key}"`);
    seen.add(f.key);

    const row = byId.get(f.row);
    if (!row) throw new Error(`quotable "${f.key}" cites row ${f.row}, which does not exist`);
    if (row.status === 'REJECTED') {
      throw new Error(`quotable "${f.key}" cites row ${f.row}, which is REJECTED and must never be quoted`);
    }
    const haystack = `${row.claim} ${row.notes}`;
    if (f.display !== undefined && (typeof f.display !== 'string' || f.display === '')) {
      throw new Error(`quotable "${f.key}" has a non-string or empty "display"`);
    }
    if (!haystack.includes(f.value)) {
      throw new Error(`quotable "${f.key}" declares value "${f.value}" but that string does not occur in row ${f.row}`);
    }
  }
  return facts.length;
}

// ---------------------------------------------------------------------------
// index.html sync
// ---------------------------------------------------------------------------

const CLAIMS_SCRIPT_RE = /(<script id="claims-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

/** Every data-claim-status / data-claim-key reference must resolve, so a
 *  binding attribute can never silently point at nothing. Script blocks are
 *  excluded: the binding code's own comments name these attributes as
 *  documentation, which is not a real usage (same exemption
 *  check-claims-drift.js applies to entities and LaTeX). */
function verifyHtmlBindings(html, data) {
  const byId = new Set(data.rows.map(r => r.id));
  const byKey = new Set(data.quotable.map(f => f.key));
  const markup = html.split(/(<script[\s\S]*?<\/script>)/g)
    .filter(seg => !/^<script/i.test(seg))
    .join('');
  const issues = [];
  for (const m of markup.matchAll(/data-claim-status="([^"]+)"/g)) {
    if (!byId.has(m[1])) issues.push(`data-claim-status="${m[1]}" cites a row that does not exist`);
  }
  for (const m of markup.matchAll(/data-claim-key="([^"]+)"/g)) {
    if (!byKey.has(m[1])) issues.push(`data-claim-key="${m[1]}" cites a quotable key that does not exist`);
  }
  return issues;
}

/** Returns the index.html text with the embedded claims-data block replaced
 *  by a fresh export, or throws if the marker block is missing. */
function syncedHtml(html, data) {
  if (!CLAIMS_SCRIPT_RE.test(html)) {
    throw new Error('index.html has no <script id="claims-data"> block to sync');
  }
  const issues = verifyHtmlBindings(html, data);
  if (issues.length) throw new Error('index.html has dangling claim bindings:\n  ' + issues.join('\n  '));
  return html.replace(CLAIMS_SCRIPT_RE, (_, open, _old, close) => open + JSON.stringify(data) + close);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function build() {
  const text = fs.readFileSync(LEDGER, 'utf8');
  const rows = parseLedger(text);
  const facts = parseQuotable(text);
  verifyQuotable(facts, rows);

  const counts = {};
  for (const s of VALID_STATUS) counts[s] = rows.filter(r => r.status === s).length;

  return {
    generatedFrom: 'MATH_CLAIMS.md',
    note: 'Derived file. MATH_CLAIMS.md is the authority; regenerate rather than edit.',
    rowCount: rows.length,
    statusCounts: counts,
    quotable: facts,
    rows
  };
}

function runControls() {
  const notes = [];
  const data = build();

  // 1. Every row carries the six mandatory fields.
  for (const r of data.rows) {
    if (!r.claim) throw new Error(`row ${r.id} has an empty claim`);
    if (!r.source) throw new Error(`row ${r.id} has an empty source`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.lastChecked)) {
      throw new Error(`row ${r.id} has a malformed "last checked" date: ${r.lastChecked}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.lastTraced)) {
      throw new Error(`row ${r.id} has a malformed "last traced" date: ${r.lastTraced}`);
    }
  }
  notes.push(`all ${data.rowCount} rows carry a claim, a source, a status and two dates`);

  // 2. Retractions are never quotable. This is the register's whole point.
  const rejected = data.rows.filter(r => r.status === 'REJECTED').map(r => r.id);
  for (const f of data.quotable) {
    if (rejected.includes(f.row)) throw new Error(`quotable "${f.key}" cites REJECTED row ${f.row}`);
  }
  notes.push(`${rejected.length} REJECTED row(s) present and none of them is quotable`);

  // 3. Declared values genuinely occur in their rows.
  notes.push(`${data.quotable.length} quotable figure(s), each verified to occur in the row it cites`);

  // 4. A figure absent from the ledger must be refused. This is the case the
  //    2026-07-30 infographic would have failed: a record length of "2 026"
  //    that appears nowhere as a length.
  const byId = new Map(data.rows.map(r => [r.id, r]));
  let refused = false;
  try {
    verifyQuotable([{ key: 'fake', value: '2 026', row: data.rows[0].id, label: 'invented' }], data.rows);
  } catch (e) { refused = /does not occur/.test(e.message); }
  if (!refused) throw new Error('an invented figure was not refused; the check is not doing anything');
  notes.push('an invented figure is refused rather than exported');

  // 5. index.html's embedded copy, if present, must reference only real rows
  //    and keys. This does not require the block to be in sync (main() does
  //    that); it only requires that nothing in it dangles.
  if (fs.existsSync(INDEX_HTML)) {
    const html = fs.readFileSync(INDEX_HTML, 'utf8');
    const issues = verifyHtmlBindings(html, data);
    if (issues.length) throw new Error('index.html has dangling claim bindings:\n  ' + issues.join('\n  '));
    notes.push(`index.html's claim bindings (data-claim-status / data-claim-key) all resolve`);
  }

  return { notes, data };
}

function main() {
  const args = process.argv.slice(2);
  // Default output is the REPO ROOT, not __dirname -- this module moved into
  // src/ during the 2026-07-30 layout restructure, and __dirname changed
  // meaning under it. Root claims.json is a published artifact (checked into
  // git, sits next to index.html and poster.html); writing it into src/ by
  // accident left a stale, silently-diverging copy at the root with no test
  // that compared its rowCount against MATH_CLAIMS.md. Caught 2026-08-01.
  let out = path.join(__dirname, '..', 'claims.json'), checkOnly = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') out = path.resolve(args[++i]);
    else if (args[i] === '--check') checkOnly = true;
  }

  console.log('=== claims-export: MATH_CLAIMS.md as machine-readable data ===\n');
  const { notes, data } = runControls();
  for (const n of notes) console.log(`[CONTROL] ${n}`);

  console.log(`\nrows: ${data.rowCount}`);
  for (const [s, n] of Object.entries(data.statusCounts)) console.log(`  ${s.padEnd(9)} ${n}`);
  if (data.quotable.length) {
    console.log('\nquotable figures (the only ones a page may display):');
    for (const f of data.quotable) console.log(`  ${f.key.padEnd(28)} ${String(f.display || f.value).padEnd(14)} row ${f.row.padStart(3)}  ${f.label}`);
  } else {
    console.log('\nno quotable figures declared yet; add a QUOTABLE_FACTS block to MATH_CLAIMS.md');
  }

  if (!checkOnly) {
    fs.writeFileSync(out, JSON.stringify(data, null, 1));
    console.log(`\nwritten to ${path.basename(out)}`);

    if (fs.existsSync(INDEX_HTML)) {
      const html = fs.readFileSync(INDEX_HTML, 'utf8');
      const synced = syncedHtml(html, data);
      if (synced !== html) {
        fs.writeFileSync(INDEX_HTML, synced);
        console.log('index.html claims-data block resynced');
      } else {
        console.log('index.html claims-data block already in sync');
      }
    }
  }
  console.log('\nA page may display a figure only if it appears above. The ledger decides what is');
  console.log('quotable; this file only checks and transports it.');
}

if (require.main === module) {
  main();
}

module.exports = { parseLedger, parseQuotable, verifyQuotable, build, runControls, syncedHtml, verifyHtmlBindings, VALID_STATUS };

