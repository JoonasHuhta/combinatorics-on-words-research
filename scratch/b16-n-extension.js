'use strict';
/*
 * b16-n-extension.js -- extends the B16 lattice's key comparison points past
 * n=16, to test row 95's open question: is the off-diagonal six's 99.92%
 * near-saturation an n=16 window artifact, or does it hold up further out?
 *
 * Pre-measured cost (this session): all-9 at n=20 took 81.4s, growth factor
 * ~2.6-2.7x per step in both time and node count. Target n=22 (~9 min for the
 * most expensive mask); stop earlier per-mask if a step exceeds ~10 min.
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');

const CASES = [
  { name: 'all-9', S: BIGRAMS },
  { name: 'best eight (all-9 minus {aa})', S: BIGRAMS.filter(b => b !== 'aa') },
  { name: 'best seven ({aa,ab,ac,ba,bc,ca,cb})', S: ['aa', 'ab', 'ac', 'ba', 'bc', 'ca', 'cb'] },
  { name: 'off-diagonal six ({ab,ac,ba,bc,ca,cb})', S: ['ab', 'ac', 'ba', 'bc', 'ca', 'cb'] },
  { name: 'best quint ({ab,ac,ba,bc,ca})', S: ['ab', 'ac', 'ba', 'bc', 'ca'] },
];

const MAX_N = 22;
const PER_STEP_TIME_LIMIT_MS = 12 * 60 * 1000; // 12 min ceiling per single enumerateSAbelian call

function main() {
  console.log(`B16 n-extension: pushing key masks from n=16 to n=${MAX_N}\n`);
  const table = {}; // name -> {n: p(n)}
  for (const { name, S } of CASES) {
    table[name] = {};
    const mask = toMask(S);
    console.log(`=== ${name} ===`);
    for (let n = 16; n <= MAX_N; n++) {
      const t0 = Date.now();
      const r = enumerateSAbelian(mask, n, 2e10);
      const dt = Date.now() - t0;
      table[name][n] = r.exhausted ? r.counts[n] : null;
      console.log(`  n=${n}: p(n)=${r.exhausted ? r.counts[n] : 'BUDGET HIT'}  nodes=${r.nodes}  ${(dt / 1000).toFixed(1)}s`);
      if (dt > PER_STEP_TIME_LIMIT_MS) { console.log(`  (stopping this mask, step exceeded time ceiling)`); break; }
    }
    console.log('');
  }

  console.log('=== Ratio to all-9, by n ===');
  for (let n = 16; n <= MAX_N; n++) {
    const all9 = table['all-9'][n];
    if (all9 === undefined) continue;
    const parts = [];
    for (const { name } of CASES) {
      const v = table[name][n];
      if (v === undefined) continue;
      parts.push(`${name}=${v === null ? 'BUDGET' : (100 * v / all9).toFixed(4) + '%'}`);
    }
    console.log(`  n=${n}: ${parts.join('  |  ')}`);
  }
}

main();
