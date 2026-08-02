'use strict';

/**
 * b16-eights.js
 * -------------
 * B16 lattice level 8: the 9 = C(9,8) eight-element bigram subsets (each one
 * is "all 9 bigrams minus one"). Completes the lattice's n=16 sweep together
 * with b16-sevens.js -- level 9 (all-9) is already known (row 92).
 *
 * Usage: node scripts/b16-eights.js [maxN] [budget]
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('./b16-bigram-lattice.js');

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '16', 10);
  const budget = parseFloat(args[1] || '6e8');

  const sets = BIGRAMS.map(missing => BIGRAMS.filter(b => b !== missing));
  console.log(`B16 eights: ${sets.length} eight-element subsets (each = all-9 minus one), maxN=${maxN}, budget=${budget}`);
  console.log('');

  const results = [];
  const t0 = Date.now();
  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    const missing = BIGRAMS[i];
    const r = enumerateSAbelian(toMask(s), maxN, budget);
    results.push({ missing, r });
    console.log(`  all-9 minus {${missing}}: p(${maxN})=${r.exhausted ? r.counts[maxN] : 'BUDGET HIT'}`);
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log('');
  console.log(`all ${sets.length} eights run in ${elapsed.toFixed(1)}s`);
  console.log('');
  console.log('For reference: p_empty(16)=207354, p_sixes_max(16)=7174218 (row 93), p_all9(16)=7180188 (row 92).');
}

if (require.main === module) main();
