'use strict';
/*
 * b16-full-lattice-dump.js -- computes p(16) for ALL 512 bigram-subset masks
 * (not just symmetry-class representatives) and writes a compact JSON lookup
 * table, for the interactive matrix in bridge_story_sandbox.html.
 *
 * Every one of these 512 values has already been computed once this session
 * (as part of the level-by-level sweeps, rows 90-95) -- this just re-runs
 * them all in one pass and keeps every individual mask's value instead of
 * only the class-grouped summary, since the sandbox needs to answer for an
 * ARBITRARY combination the user clicks, not just the "best of level k".
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');
const fs = require('fs');

function main() {
  const N = 16;
  const budget = 6e8;
  const table = new Array(512);
  const t0 = Date.now();
  for (let mask = 0; mask < 512; mask++) {
    const r = enumerateSAbelian(mask, N, budget);
    table[mask] = r.exhausted ? r.counts[N] : null;
    if (!r.exhausted) console.log(`mask ${mask}: BUDGET HIT`);
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log(`All 512 masks computed in ${elapsed.toFixed(1)}s`);

  // Sanity checks against already-published rows before trusting the dump.
  const checks = [
    { name: 'S=empty (row 86)', mask: 0, expect: 207354 },
    { name: 'all-9 (row 92)', mask: toMask(BIGRAMS), expect: 7180188 },
    { name: 'off-diagonal six (row 93)', mask: toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']), expect: 7174218 },
    { name: 'best pair (row 90)', mask: toMask(['ab', 'bc']), expect: 2852290 },
  ];
  let allOk = true;
  for (const c of checks) {
    const v = table[c.mask];
    const ok = v === c.expect;
    if (!ok) allOk = false;
    console.log(`  check ${c.name}: table=${v} expect=${c.expect} ${ok ? 'OK' : '*** MISMATCH ***'}`);
  }
  if (!allOk) { console.log('ABORTING -- do not use this dump, a mismatch was found.'); process.exit(1); }

  const out = { n: N, bigrams: BIGRAMS, table };
  fs.writeFileSync('scratch/b16-full-lattice-n16.json', JSON.stringify(out));
  console.log('Written to scratch/b16-full-lattice-n16.json');
}

main();
