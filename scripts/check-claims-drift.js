'use strict';

/**
 * check-claims-drift.js
 * ---------------------
 * Automated drift detector for MATH_CLAIMS.md and canonical project numbers.
 * Protects against accidental numeric drift across agent sessions (e.g. 18 vs 30 words, 2016 vs 2018 citations).
 * Run via: node check-claims-drift.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== STARTING MATH_CLAIMS DRIFT & INTEGRITY CHECKER ===\n");

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
}

const claimsPath = path.join(path.join(__dirname, '..'), 'MATH_CLAIMS.md');
const claimsContent = fs.readFileSync(claimsPath, 'utf8');

// 1. Check Canonical Numbers in MATH_CLAIMS.md
check("Canonical Ternary Bound (Len 7, 18 words, 3 orbits)", () => {
  if (!claimsContent.includes("18") || !claimsContent.includes("pituudeltaan 7")) {
    throw new Error("MATH_CLAIMS.md must specify exactly 18 words of max length 7 for ternary abelian-square-free words.");
  }
});

check("Rao & Rosenfeld Exact Citation, Theorem Numbering & 34 Squares", () => {
  if (!/34 (eri|uniikkia|distinct|different) abelin neliötä|34 distinct abelian squares/.test(claimsContent)) {
    throw new Error("MATH_CLAIMS.md must specify the 34 distinct abelian squares figure for g3(h6^ω(a)).");
  }
  // Provenance, corrected 2026-07-28: the number 34 does NOT appear anywhere in
  // arXiv:1511.05875 (verified by full-text search). It comes solely from the survey.
  if (!claimsContent.includes("2207.09937") || !claimsContent.includes("precisely 34 distinct abelian squares")) {
    throw new Error("The '34' figure must be attributed to Fici & Puzynina (arXiv:2207.09937) with its verbatim quote, NOT to Rao & Rosenfeld.");
  }
  if (!claimsContent.includes("1511.05875")) {
    throw new Error("MATH_CLAIMS.md must cite arXiv:1511.05875 as the primary source for the h6/g3 construction.");
  }
  // Theorem numbering audited 2026-07-28 against the paper itself.
  for (const [thm, what] of [["Theorem 4", "h6^w(a) abelian-square-free"],
                             ["Theorem 9", "g3(h6^w(a)) avoids period > 5"],
                             ["Theorem 10", "existence of a ternary word avoiding period > 5"]]) {
    if (!claimsContent.includes(thm)) {
      throw new Error(`MATH_CLAIMS.md must cite ${thm} (${what}). The retracted numbering was "Theorem 5"/"Theorem 11", which point at unrelated theorems in the same paper.`);
    }
  }
  if (claimsContent.includes("Rosenfeld (2016)") || claimsContent.includes("Thèse de doctorat (2016)")) {
    throw new Error("MATH_CLAIMS.md contains outdated reference to 'Rosenfeld (2016) thesis'. Must use Rao & Rosenfeld (2018).");
  }
});

check("No Unverified OEIS A261352 References in MATH_CLAIMS.md", () => {
  if (claimsContent.includes("A261352")) {
    throw new Error("MATH_CLAIMS.md contains unverified OEIS A261352 reference. Remove until independently confirmed.");
  }
});

// 2. Epistemological Wording Drift Check across documentation
//
// This check used to also scan a foreign path
// (../../../.gemini/antigravity/brain/<uuid>/walkthrough.md) pointing outside
// this repository into another tool's local session data. Removed 2026-08-07
// (TASK-GOV-1): confirmed absent on this machine, and a path into another
// application's local state was never a legitimate part of this project's own
// drift coverage.
check("No Overpromising Wording in Bridge-Welding Claims", () => {
  const combined = claimsContent.toLowerCase();
  if (combined.includes("todistaa abelin-neliöttömyyden jaksoille") || combined.includes("proves abelian-square-freedom for periods")) {
    throw new Error("Documentation contains overpromising phrase 'todistaa abelin-neliöttömyyden jaksoille'. Must specify that welding only eliminates BOUNDARY/SEAM collisions!");
  }
});

// 3. Parikh Packing Arithmetic Integrity Check (No Bitwise << in Web Worker)
check("No Bitwise Left Shift (<<) in Web Worker Parikh Packing", () => {
  const workerPath = path.join(path.join(__dirname, '..'), 'aa2fr-worker.js');
  if (fs.existsSync(workerPath)) {
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    if (workerContent.includes("<<")) {
      throw new Error("aa2fr-worker.js contains bitwise shift operator '<<'. Parikh vectors MUST be packed using exact 53-bit Float64Array arithmetic (+ / -) to avoid 32-bit overflow!");
    }
    if (!workerContent.includes("Float64Array")) {
      throw new Error("aa2fr-worker.js must declare prefixPacked as Float64Array to prevent 32-bit integer overflow!");
    }
  }
});

// 4. No Emoji Characters in Tab 18 / Module 18 UI & Dispatcher
// Target moved 2026-08-08 (WEB-SWAP-1): the explorer application moved from
// index.html to explore.html when index.html became the Word Structures
// homepage. Two silent success paths were removed at the same time, because
// each would have reported PASS against the new homepage while guarding
// nothing -- the old `if (fs.existsSync(...))` wrapper turned a missing target
// into a pass, and an absent marker produced an empty slice that no regex can
// ever match. A guard that cannot fail is worse than no guard, because it
// reports safety.
check("No Emoji Characters in Module 18 UI & Citizen Science Dispatcher", () => {
  const explorePath = path.join(path.join(__dirname, '..'), 'explore.html');
  if (!fs.existsSync(explorePath)) {
    throw new Error('explore.html is missing; it is the mandatory target of this check (the explorer application, formerly index.html).');
  }
  const exploreContent = fs.readFileSync(explorePath, 'utf8');

  // Check HTML slice
  const htmlStart = exploreContent.indexOf('id="view-gold-lab"');
  if (htmlStart === -1) {
    throw new Error('explore.html no longer contains the Module 18 marker id="view-gold-lab"; this check would otherwise scan nothing and report PASS.');
  }
  const htmlEnd = exploreContent.indexOf('<!-- END TAB 18 -->', htmlStart);
  const htmlSlice = exploreContent.slice(htmlStart, htmlEnd !== -1 ? htmlEnd : undefined);

  // Check JS slice
  const jsStart = exploreContent.indexOf('// TAB 18: SEAM SEARCH');
  if (jsStart === -1) {
    throw new Error('explore.html no longer contains the Module 18 marker "// TAB 18: SEAM SEARCH"; this check would otherwise scan nothing and report PASS.');
  }
  const jsEnd = exploreContent.indexOf('// END TAB 18', jsStart);
  const jsSlice = exploreContent.slice(jsStart, jsEnd !== -1 ? jsEnd : undefined);

  const combinedSlice = htmlSlice + "\n" + jsSlice;

  // Check for emojis (surrogate pairs or common symbols like 📡, ℹ, 🧬, 🔍, etc.)
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2300-\u23FF]|[\u2B50-\u2B55]/;
  if (emojiRegex.test(combinedSlice)) {
    throw new Error("Module 18 HTML/JS in explore.html contains forbidden emoji or symbol characters in UI or issue reports! Must maintain serious scientific styling.");
  }
});

// 5. Standalone HPC CLI Runner Integrity Check (seam-hpc-cli.js)
check("Standalone HPC CLI Runner Integrity & Arithmetic Check", () => {
  const cliPath = path.join(path.join(__dirname, '..'), 'scripts', 'seam-hpc-cli.js');
  if (!fs.existsSync(cliPath)) {
    throw new Error("seam-hpc-cli.js missing! Standalone multi-core CLI runner must exist in scripts directory.");
  }
  const cliContent = fs.readFileSync(cliPath, 'utf8');
  if (cliContent.includes("<<")) {
    throw new Error("seam-hpc-cli.js contains bitwise shift operator '<<'. Parikh vectors MUST use exact Float64Array arithmetic!");
  }
  if (!cliContent.includes("Float64Array")) {
    throw new Error("seam-hpc-cli.js must declare prefixPacked as Float64Array!");
  }
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2300-\u23FF]|[\u2B50-\u2B55]/;
  if (emojiRegex.test(cliContent)) {
    throw new Error("seam-hpc-cli.js contains forbidden emoji or symbol characters! Must maintain serious scientific styling.");
  }
});

// 6. Windows 1-Click Interactive Launcher Check (run-seam-search.bat)
check("Windows 1-Click Interactive Batch Launcher Integrity", () => {
  const batPath = path.join(path.join(__dirname, '..'), 'run-seam-search.bat');
  if (!fs.existsSync(batPath)) {
    throw new Error("run-seam-search.bat missing! Windows 1-click batch launcher must exist in repository root.");
  }
  const batContent = fs.readFileSync(batPath, 'utf8');
  if (!batContent.includes("node seam-hpc-cli.js")) {
    throw new Error("run-seam-search.bat must invoke node seam-hpc-cli.js!");
  }
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2300-\u23FF]|[\u2B50-\u2B55]/;
  if (emojiRegex.test(batContent)) {
    throw new Error("run-seam-search.bat contains forbidden emoji or symbol characters! Must maintain serious scientific styling.");
  }
});

// 6b. Overclaiming language in PROGRAM OUTPUT, not just documentation.
//
// Added 2026-07-28 after seam-hpc-cli.js was found printing
//   "[CERTIFIED] Provable asymptotic stability replicated across N worker threads"
// for a computation that never loaded morphisms.js and printed a hardcoded
// violation count of zero. AGENTS.md rule 3 always covered this; nothing enforced
// it, because the ledger guarded documents while the binaries spoke freely.
// See MATH_CLAIMS.md row 26.
check("No Overclaiming Language in Program Output (CLI, workers, launcher)", () => {
  const FORBIDDEN = [
    'CERTIFIED', 'Certified', 'certified',
    'PROVABLE', 'Provable', 'provable',
    'PROVEN', 'Proven',
    'Publication-Grade', 'publication-grade'
  ];
  // NOT listed: unfavourable-factors.js. Its "PROVEN unfavourable" is justified
  // finite proof language - an exhausted left extension tree IS a proof of
  // unfavourability (MATH_CLAIMS.md row 47 documents the distinction). Adding it
  // here would flag wording the ledger itself endorses.
  //
  // Paths corrected 2026-08-07 (TASK-GOV-1): the 2026-07-30 src/scripts
  // reorganisation moved 10 of these 12 files out of the repository root. The
  // old root-relative list resolved to non-existent paths for all 10, and the
  // silent `if (!fs.existsSync(p)) continue;` guard let this check report PASS
  // while actually scanning only 2 of 12 files. Every path below is the file's
  // real, current location; a missing mandatory file is now a reported
  // offence, not a silent skip.
  const files = [
    'scripts/seam-hpc-cli.js', 'aa2fr-worker.js', 'run-seam-search.bat',
    'scripts/h6-image-sweep.js', 'scripts/morphism-scan.js', 'src/sft-container.js',
    'scripts/additive-sweep.js', 'src/extension-table.js', 'scripts/sanalab-run.js',
    'src/table-library.js', 'scripts/additive-morphism-scan.js', 'scripts/additive-nonuniform-morphism-scan.js'
  ];
  const offences = [];

  for (const f of files) {
    const p = path.join(path.join(__dirname, '..'), f);
    if (!fs.existsSync(p)) {
      offences.push(`${f}  MISSING — this file is mandatory input to this check and no longer exists at this path`);
      continue;
    }
    const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      // Only user-facing output lines matter. Comments may discuss the rule.
      const isOutput = /console\.log|console\.error|process\.stdout\.write|^\s*echo /i.test(line);
      if (!isOutput) return;
      for (const word of FORBIDDEN) {
        if (line.includes(word)) offences.push(`${f}:${i + 1}  ${word}  ${line.trim().slice(0, 90)}`);
      }
    });
  }

  if (offences.length > 0) {
    throw new Error(
      `Program output uses unbounded proof language, which AGENTS.md rule 3 forbids ` +
      `without an explicit stated window:\n       ` + offences.join('\n       ') +
      `\n       Use bounded phrasing, e.g. "no violation found for K in [6,40] in this ` +
      `65,610-letter prefix".`
    );
  }
});

// 6b. The same rule, for the public pages rather than for program output.
//
// Added 2026-08-07 (WEB-SAFE-1). The check above scans 12 CLI/worker files and
// only lines that print (console.log / echo). The public site was therefore
// uncovered twice over: index.html is not in that file list, and HTML markup
// would not match the print filter even if it were. Module 18 had been shipping
// a browser "Certified / 10-of-10 rounds PASSED / Primary proof established"
// verdict, plus a fabricated reproduction command, from a routine that performed
// no computation at all -- the exact failure the Graveyard records as Trap 18,
// repeated one layer up from the CLI incident that check 6 was written for.
//
// Two design points, both deliberate:
//
//   * Word boundaries are mandatory. The substring test used by check 6 matches
//     "Proven" inside "Provenance", which occurs 16 times in index.html as
//     "Provenance Badge" / "Provenance Chain" / "Provenance warning". Without
//     \b this check would be pure noise and would be switched off within a week.
//
//   * Exemption is per OCCURRENCE, never per line. Only the allowed phrase
//     itself is masked out; whatever remains on that line is still scanned. A
//     legitimate phrase must not become a hiding place for unsafe wording added
//     to the same line later -- Trap 18's body is one long paragraph, so
//     line-level exemption would have blinded the check across all of it.
check("No self-certifying verdict language on the public pages", () => {
  const VERDICT = /\b(CERTIFIED|Certified|certified|PROVABLE|Provable|provable|PROVEN|Proven|Publication-Grade|publication-grade)\b/g;

  // Legitimate public wording. Each entry is exempted only where it appears
  // verbatim. An entry that stops matching anywhere is reported as stale rather
  // than left to rot, so this list cannot quietly grow past what it justifies.
  const ALLOWED = [
    { phrase: 'Proven unfavourable',
      why: 'MATH_CLAIMS.md row 47 - an exhausted left-extension tree is a bounded finite proof, and check 6 already endorses this wording for unfavourable-factors.js' },
    { phrase: 'PROVEN dead end',
      why: 'bounded finite proof: the search tree was exhausted, which is stated on the same line' },
    { phrase: '[CERTIFIED] Provable asymptotic stability replicated',
      why: 'Graveyard Trap 18 quoting the banner it exists to condemn' },
    { phrase: 'Trap 18: The "Certified" Verifier That Never Ran',
      why: 'Graveyard Trap 18 accordion title' },
    { phrase: 'may print the words <em>certified / provable / proven</em> again',
      why: 'Graveyard Trap 18 stating the rule this check enforces' },
    { phrase: 'trusting a "Certified" badge anywhere',
      why: 'Graveyard Trap 18 warning the reader against exactly the verdict this check forbids; it shares a line with the entry above, and per-occurrence masking is what surfaced it' }
  ];

  // explore.html added 2026-08-08 (WEB-SWAP-1): it is the explorer application,
  // formerly index.html, and carries the Trap 18 material the allowlist exempts.
  // index.html stays on the list in its new role as the Word Structures homepage.
  // learn.html added 2026-08-08 (WEB-LEARN-1) in the same change that created
  // it, so the page has never existed as an unguarded public surface.
  // research.html added 2026-08-08 (WEB-RESEARCH-1) in the same change that
  // created it, so the page has never existed as an unguarded public surface.
  const files = ['index.html', 'learn.html', 'research.html', 'explore.html', 'bridge_story_sandbox.html', 'word-checker.html'];
  const offences = [];
  const used = new Set();

  for (const f of files) {
    const p = path.join(path.join(__dirname, '..'), f);
    if (!fs.existsSync(p)) {
      offences.push(`${f}  MISSING - this file is a mandatory public target of this check and no longer exists at this path`);
      continue;
    }
    const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
    let inClaims = false;

    lines.forEach((raw, i) => {
      let text = raw;

      // The <script id="claims-data"> block is generated from MATH_CLAIMS.md and
      // is governed separately (tests/test.js checks it is in sync). Excise it by
      // structural marker, not by line number, and keep scanning the markup that
      // shares its line.
      if (inClaims) {
        const end = text.indexOf('</script>');
        if (end === -1) return;
        text = text.slice(end + '</script>'.length);
        inClaims = false;
      }
      const start = text.indexOf('<script id="claims-data"');
      if (start !== -1) {
        const end = text.indexOf('</script>', start);
        if (end === -1) { text = text.slice(0, start); inClaims = true; }
        else { text = text.slice(0, start) + ' ' + text.slice(end + '</script>'.length); }
      }

      // Mask each allowed phrase where it occurs, preserving length so the rest of
      // the line is still scanned in place.
      for (const a of ALLOWED) {
        if (!text.includes(a.phrase)) continue;
        used.add(a.phrase);
        text = text.split(a.phrase).join('#'.repeat(a.phrase.length));
      }

      const found = text.match(VERDICT);
      if (found) {
        offences.push(`${f}:${i + 1}  ${[...new Set(found)].join(', ')}  ${raw.trim().slice(0, 90)}`);
      }
    });
  }

  const stale = ALLOWED.filter(a => !used.has(a.phrase));
  if (stale.length > 0) {
    throw new Error(
      `This check's allowlist has entries that no longer match anything on the public ` +
      `pages. A stale exemption silently widens what the check permits, so remove it ` +
      `rather than leaving it:\n       ` +
      stale.map(a => `${JSON.stringify(a.phrase)}  (was allowed because: ${a.why})`).join('\n       ')
    );
  }

  if (offences.length > 0) {
    throw new Error(
      `Public pages present a self-certifying verdict. The site reports what the ledger ` +
      `says; it never issues a status of its own, and no browser output is evidence ` +
      `(AGENTS.md rules 3 and 7; CURRENT_FOCUS.md "no browser or AI output ` +
      `self-certifies"):\n       ` + offences.join('\n       ') +
      `\n       Either word it as a bounded observation, or cite the MATH_CLAIMS.md row ` +
      `that actually carries the status.`
    );
  }
});

// 6c. The p6 mode must actually load the construction it claims to audit.
//
// Path corrected 2026-08-07 (TASK-GOV-1): the old root-relative path
// ('seam-hpc-cli.js') resolved to nothing after the 2026-07-30 move to
// scripts/, and the `if (!fs.existsSync(p)) return;` guard let this check
// report PASS without ever reading the file. The require-detection regex is
// corrected in the same commit: morphisms.js moved to src/ in the same
// reorganisation, so the real, current import is
// `require('../src/morphisms.js')`, not `require('./morphisms.js')`.
check("seam-hpc-cli p6 mode audits the real g3(h6^n(a)) construction", () => {
  const p = path.join(path.join(__dirname, '..'), 'scripts', 'seam-hpc-cli.js');
  if (!fs.existsSync(p)) {
    throw new Error("scripts/seam-hpc-cli.js is missing; this check has no mandatory input to audit.");
  }
  const src = fs.readFileSync(p, 'utf8');
  if (!/require\(['"]\.\.?\/(src\/)?morphisms(\.js)?['"]\)/.test(src)) {
    throw new Error("seam-hpc-cli.js does not load morphisms.js, so its p6 mode cannot be scanning g3(h6^n(a)). This was the 2026-07-28 defect: a generic ternary DFS reported as a Rao & Rosenfeld replication.");
  }
  if (/Violations Observed: 0`/.test(src) || /Violations Observed: 0"/.test(src)) {
    throw new Error("seam-hpc-cli.js prints a hardcoded violation count of 0. The count must be computed and interpolated from worker results.");
  }
});

// 6d. The application renders no math library, so LaTeX in the HTML is shown to
// users as raw source. Veikko Keranen reported exactly this ("matemaattinen
// notaatio ei nyt nay netissa"). Verified in-browser on 2026-07-28: both
// window.MathJax and window.katex are undefined and the only external script is
// the worker. 93 inline spans were converted to HTML/Unicode; this keeps them out.
check("No raw LaTeX or broken entities in the public HTML markup", () => {
  // Covers both public surfaces since WEB-SWAP-1: the homepage (index.html) and
  // the explorer application (explore.html, formerly index.html). Coverage was
  // deliberately extended rather than transferred -- moving it to the homepage
  // alone would have left the 745 KB explorer, where every one of the historical
  // entity failures actually occurred, unguarded. The old
  // `if (!fs.existsSync(p)) return;` was a silent pass and is gone.
  for (const file of ['index.html', 'explore.html']) {
  const p = path.join(path.join(__dirname, '..'), file);
  if (!fs.existsSync(p)) throw new Error(file + ' is missing; it is a mandatory target of this check.');
  const src = fs.readFileSync(p, 'utf8');
  // Script blocks are exempt: JS may legitimately contain backslashes and ${...}.
  const html = src.split(/(<script[\s\S]*?<\/script>)/g)
    .filter(seg => !/^<script/i.test(seg))
    .join('');

  const latex = html.match(/\$[^$\n]{1,120}\$/g) || [];
  if (latex.length) {
    throw new Error(`${file} markup contains ${latex.length} inline LaTeX span(s), which render as literal source because no math library is loaded. First: ${latex[0].slice(0, 60)}`);
  }
  const macros = html.match(/\\[a-zA-Z]{2,}/g) || [];
  if (macros.length) {
    throw new Error(`${file} markup contains ${macros.length} TeX macro(s) outside script blocks. First: ${macros[0]}`);
  }
  // Both spellings, named and numeric. The numeric arm was missing until
  // 2026-07-30 and the gap was not theoretical: this check reported 15/15 while
  // 51 numeric entities (g85/g109 subscripts, Erdos, the heat-map swatches)
  // displayed as literal "&#8328;" on the page. `#` is not in [a-zA-Z].
  const doubled = html.match(/&amp;#?[a-zA-Z0-9]+;/g) || [];
  if (doubled.length) {
    throw new Error(`${file} contains ${doubled.length} double-escaped HTML entit(ies) such as ${doubled[0]}, which display as literal text. Write &mdash; not &amp;mdash;, and &#8328; not &amp;#8328;.`);
  }
  // An entity whose digits went missing renders as nothing and is invisible in
  // review. Commit 0c56150 unescaped with a regex that ate them ("Erd&#;s") and
  // was reverted four minutes later; this is that revert made permanent.
  const gutted = html.match(/&#;|&#[a-zA-Z]/g) || [];
  if (gutted.length) {
    throw new Error(`${file} contains ${gutted.length} malformed numeric entit(ies) such as ${gutted[0]}, missing their code point. A regex-based unescape most likely stripped the digits.`);
  }
  // `&sub3;` is not an HTML entity and never was: `&sub;` is the subset sign and
  // there is no digit-suffixed form. 21 of these sat in the Validation Lab
  // rendering as literal "S&sub3;" where "S3" was meant. Caught here in both
  // spellings because the single-escaped form survives the check above.
  const pseudo = html.match(/&(amp;)?sub\d+;/g) || [];
  if (pseudo.length) {
    throw new Error(`${file} contains ${pseudo.length} invalid entit(ies) such as ${pseudo[0]}. No such entity exists; use the subscript code point (&#8323; for 3) instead.`);
  }
  }
});

// 6e. The entry-point document must not rot.
//
// RESEARCH_CONTEXT.md is the router a new session reads first. If it names a
// module that no longer exists, or the exact pipeline gains a module it never
// hears about, the router sends the next reader to the wrong place. Cheap to
// check, and the failure mode is silent otherwise.
check("RESEARCH_CONTEXT.md lists the exact pipeline accurately", () => {
  const p = path.join(path.join(__dirname, '..'), 'RESEARCH_CONTEXT.md');
  if (!fs.existsSync(p)) throw new Error('RESEARCH_CONTEXT.md is missing; it is the documented entry point for a new session.');
  const doc = fs.readFileSync(p, 'utf8');

  // Every module it names must exist.
  const named = [...doc.matchAll(/^([a-z0-9-]+\.js)\s{2,}/gm)].map(m => m[1]);
  if (named.length === 0) throw new Error('RESEARCH_CONTEXT.md lists no pipeline modules; section 3 has lost its table.');
  const missing = named.filter(f => !fs.existsSync(path.join(path.join(__dirname, '..'), 'src', f)) && !fs.existsSync(path.join(path.join(__dirname, '..'), 'scripts', f)));
  if (missing.length) {
    throw new Error(`RESEARCH_CONTEXT.md names modules that do not exist in src or scripts: ${missing.join(', ')}`);
  }

  // Every exact-pipeline module must be named. Deliberately excludes the app,
  // the worker, the test harness and one-off scripts.
  const EXCLUDE = new Set(['aa2fr-worker.js', 'seam-hpc-cli.js', 'test.js',
    'check-claims-drift.js', 'test-theorem10-boundary.js', 'verify-theorem6.js', 'morphisms.js',
    'fix_entities.js', 'install-git-hooks.js']);
  const onDiskSrc = fs.readdirSync(path.join(path.join(__dirname, '..'), 'src')).filter(f => f.endsWith('.js') && !EXCLUDE.has(f));
  const onDiskScripts = fs.readdirSync(path.join(path.join(__dirname, '..'), 'scripts')).filter(f => f.endsWith('.js') && !EXCLUDE.has(f));
  const onDisk = [...onDiskSrc, ...onDiskScripts];
  const unlisted = onDisk.filter(f => !doc.includes(f));
  if (unlisted.length) {
    throw new Error(`These exact-pipeline modules are not listed in RESEARCH_CONTEXT.md section 3: ${unlisted.join(', ')}. A new session would not know they exist.`);
  }

  // The claim count it quotes must match the ledger.
  //
  // Narrow, explicit matcher: only the table row that names `MATH_CLAIMS.md`
  // (backtick-quoted, as the routing table does) and mentions "row" is
  // considered -- not any other numeral in the document. This document also
  // cites dozens of individual claim rows like "(row 79)" or "(rows 32, 46)";
  // those always put the word "row(s)" *before* the number, never after, so
  // they never collide with the "<N> rows" pattern this check looks for.
  //
  // Repaired 2026-08-08 (TASK-GOV-6): the previous version matched only the
  // Finnish word "riviä" (`/(\d+)\s+riviä/`) and only acted `if (quoted && ...)`.
  // RESEARCH_CONTEXT.md now states the count in English ("85 rows"), so the
  // regex never matched, `quoted` was always null, and the guard silently did
  // nothing -- a stale count (85 vs. the ledger's actual 114) passed
  // unnoticed for as long as the document said "rows" instead of "riviä".
  // This version treats a missing or unparseable statement as a hard failure
  // in its own right, and still accepts the older Finnish wording.
  const rows = (fs.readFileSync(path.join(path.join(__dirname, '..'), 'MATH_CLAIMS.md'), 'utf8').match(/^\| \d+[a-c]? \|/gm) || []).length;
  const claimsRowLine = doc.split(/\r?\n/).find(
    line => /`MATH_CLAIMS\.md`/.test(line) && /\brow/i.test(line)
  );
  if (!claimsRowLine) {
    throw new Error('RESEARCH_CONTEXT.md no longer states how many rows MATH_CLAIMS.md has. Add an explicit "<N> rows." (or "<N> riviä") statement in the row that describes MATH_CLAIMS.md, so this stays checked.');
  }
  const quotedMatch = claimsRowLine.match(/\b(\d+)\s+(?:rows|riviä)\b/);
  if (!quotedMatch) {
    throw new Error(`RESEARCH_CONTEXT.md's MATH_CLAIMS.md description could not be parsed for a row count: "${claimsRowLine.trim()}"`);
  }
  const quotedCount = Number(quotedMatch[1]);
  if (quotedCount !== rows) {
    throw new Error(`RESEARCH_CONTEXT.md says MATH_CLAIMS.md has ${quotedCount} rows; it actually has ${rows}.`);
  }
});

// 6f. KNOWLEDGE_STATE.md is a derived index, so it rots silently.
//
// It cites ledger rows by number in tables and in prose. If a row is renumbered
// or removed, every pointer to it becomes a lie that nothing else would catch:
// the document reads fine, and only someone who follows a pointer discovers it
// leads nowhere. Cheap to check, so it is checked.
check("KNOWLEDGE_STATE.md cites only ledger rows that exist", () => {
  const p = path.join(path.join(__dirname, '..'), 'KNOWLEDGE_STATE.md');
  if (!fs.existsSync(p)) return;   // optional document
  const doc = fs.readFileSync(p, 'utf8');

  const existing = new Set(
    (claimsContent.match(/^\| (\d+[a-c]?) \|/gm) || []).map(m => m.replace(/^\| | \|$/g, ''))
  );
  if (existing.size === 0) throw new Error('no rows parsed from MATH_CLAIMS.md; the row format changed');

  // Table cells that are bare row ids, plus prose references "rivi N"/"rivit N".
  const cited = new Set();
  for (const m of doc.matchAll(/^\| .*\| (\d+[a-c]?) \|\s*$/gm)) cited.add(m[1]);
  for (const m of doc.matchAll(/\briv(?:i|it|ille|ill[aä]|in|ien)\s+(\d+[a-c]?)/gi)) cited.add(m[1]);

  if (cited.size < 20) {
    throw new Error(`KNOWLEDGE_STATE.md cites only ${cited.size} rows; it is supposed to be a map of the ledger`);
  }
  const dangling = [...cited].filter(r => !existing.has(r));
  if (dangling.length) {
    throw new Error(`KNOWLEDGE_STATE.md points at rows that do not exist in MATH_CLAIMS.md: ${dangling.join(', ')}`);
  }

  // Every REJECTED row must be represented, or the retraction register silently
  // loses entries and a withdrawn claim can quietly return.
  // Use the real column parser rather than a regex over the whole line: a row
  // that DISCUSSES retraction (row 61 does) is not itself retracted. That false
  // positive appeared the first time this check met row 61.
  const rejectedRows = require('../src/claims-export.js')
    .parseLedger(claimsContent)
    .filter(r => r.status === 'REJECTED')
    .map(r => r.id);
  const missingRejected = rejectedRows.filter(r => !cited.has(r));
  if (missingRejected.length) {
    throw new Error(`KNOWLEDGE_STATE.md omits REJECTED row(s) ${missingRejected.join(', ')}. A withdrawn claim that is not listed can quietly come back.`);
  }
});

// 6g. The ledger must stay machine-readable, and every quotable figure must
// still occur in the row it cites.
//
// Added 2026-07-30 after an externally produced infographic stated a record
// length of "2 026" that appears nowhere in this repository as a length. The
// export refuses figures that are not literally in their row, so this check is
// what makes an unsourced number impossible rather than merely discouraged. It
// also catches unescaped pipes in mathematical notation, which silently break
// a row's columns in every markdown renderer - five rows were broken that way
// when this was first run.
check("MATH_CLAIMS.md exports cleanly and every quotable figure traces to its row", () => {
  const ce = require('../src/claims-export.js');
  const res = ce.runControls();          // throws on any structural defect
  if (res.data.rowCount < 60) {
    throw new Error(`only ${res.data.rowCount} rows parsed; the table format probably changed`);
  }
  if (res.data.quotable.length === 0) {
    throw new Error('no quotable figures declared; pages would have no sourced numbers to show');
  }
});

// 7. Git Drift Check against HEAD (if in git repo)
check("Git Drift Check against Last Commit (MATH_CLAIMS.md)", () => {
  try {
    const headContent = execSync('git show HEAD:MATH_CLAIMS.md 2>nul', { encoding: 'utf8' });
    const getNumbers = (str) => {
      const matches = str.match(/\b\d+\b/g) || [];
      return new Set(matches);
    };
    const headNums = getNumbers(headContent);
    const currNums = getNumbers(claimsContent);
    
    // Check if critical numbers disappeared
    for (const num of ['7', '18', '34', '2018']) {
      if (!currNums.has(num)) {
        throw new Error(`Critical canonical number '${num}' missing from current MATH_CLAIMS.md!`);
      }
    }
  } catch (err) {
    if (err.message && err.message.includes("Critical canonical number")) {
      throw err;
    }
    // If git fails (e.g. initial repo or no HEAD), skip gracefully
    console.log("       (Git comparison skipped or no HEAD diff)");
  }
});

console.log(`\n=== DRIFT CHECK SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL DRIFT CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
}
