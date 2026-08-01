'use strict';

/**
 * b16-pairs.js
 * -------------
 * B16 deepened one level: the 36 = C(9,2) two-element subsets of the bigram
 * lattice (row 86 measured only the 0-, 1- and 9-element points). Same DFS
 * engine (`b16-bigram-lattice.js`'s `enumerateSAbelian`), same minK=2, same
 * exhaustive-to-n=16 standard as row 86.
 *
 * Purpose: locate whether the "interesting" part of the lattice sits near
 * the bottom (a small S already behaves close to S=all-9) or the top (only
 * large S departs from singleton behaviour) -- row 86 could not tell from
 * three points alone.
 *
 * Usage: node scripts/b16-pairs.js [maxN] [budget]
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('./b16-bigram-lattice.js');

function allPairs() {
  const out = [];
  for (let i = 0; i < BIGRAMS.length; i++)
    for (let j = i + 1; j < BIGRAMS.length; j++)
      out.push([BIGRAMS[i], BIGRAMS[j]]);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '16', 10);
  const budget = parseFloat(args[1] || '6e8');

  const pairs = allPairs();
  console.log(`B16 pairs: ${pairs.length} two-element subsets, maxN=${maxN}, budget=${budget}`);
  console.log('');

  const results = [];
  const t0 = Date.now();
  for (const [x, y] of pairs) {
    const r = enumerateSAbelian(toMask([x, y]), maxN, budget);
    results.push({ pair: [x, y], r });
    if (!r.exhausted) {
      console.log(`  {${x},${y}}: BUDGET HIT, no exact value`);
    }
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log(`all ${pairs.length} pairs run in ${elapsed.toFixed(1)}s`);
  console.log('');

  // Group by p(maxN) to find symmetry classes empirically.
  const byValue = new Map();
  for (const { pair, r } of results) {
    if (!r.exhausted) continue;
    const v = r.counts[maxN];
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(pair.join(''));
  }
  const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);
  console.log(`Distinct p(${maxN}) values among the 36 pairs: ${sortedValues.length}`);
  for (const v of sortedValues) {
    const members = byValue.get(v);
    console.log(`  p(${maxN})=${v}  (${members.length} pairs): ${members.join(', ')}`);
  }
  console.log('');

  // Reference points from row 86, for calibration.
  console.log('For reference (row 86): p_empty(16)=207354, p_diag-singleton(16)=1677616,');
  console.log('p_offdiag-singleton(16)=1907202, p_all9(16)=26151102.');
}

if (require.main === module) main();

module.exports = { allPairs };
