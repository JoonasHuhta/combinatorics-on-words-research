'use strict';

/**
 * b16-quints.js
 * -------------
 * B16 deepened to level 5: the 126 = C(9,5) five-element subsets of the bigram
 * lattice. Same DFS engine (`b16-bigram-lattice.js`'s `enumerateSAbelian`),
 * same minK=2, same exhaustive-to-n=16 standard.
 *
 * Purpose: Track if five-element constraints jump toward the all-9 asymptote.
 *
 * Usage: node scripts/b16-quints.js [maxN] [budget]
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('./b16-bigram-lattice.js');

function allQuints() {
  const out = [];
  for (let i = 0; i < BIGRAMS.length; i++)
    for (let j = i + 1; j < BIGRAMS.length; j++)
      for (let k = j + 1; k < BIGRAMS.length; k++)
        for (let l = k + 1; l < BIGRAMS.length; l++)
          for (let m = l + 1; m < BIGRAMS.length; m++)
            out.push([BIGRAMS[i], BIGRAMS[j], BIGRAMS[k], BIGRAMS[l], BIGRAMS[m]]);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '16', 10);
  const budget = parseFloat(args[1] || '6e8');

  const quints = allQuints();
  console.log(`B16 quints: ${quints.length} five-element subsets, maxN=${maxN}, budget=${budget}`);
  console.log('');

  const results = [];
  const t0 = Date.now();
  for (const q of quints) {
    const r = enumerateSAbelian(toMask(q), maxN, budget);
    results.push({ quint: q, r });
    if (!r.exhausted) {
      console.log(`  {${q.join(',')}}: BUDGET HIT, no exact value`);
    }
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log(`all ${quints.length} quints run in ${elapsed.toFixed(1)}s`);
  console.log('');

  // Group by p(maxN) to find symmetry classes empirically.
  const byValue = new Map();
  for (const { quint, r } of results) {
    if (!r.exhausted) continue;
    const v = r.counts[maxN];
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(quint.join(''));
  }
  const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);
  console.log(`Distinct p(${maxN}) values among the 126 quints: ${sortedValues.length}`);
  for (const v of sortedValues) {
    const members = byValue.get(v);
    console.log(`  p(${maxN})=${v}  (${members.length} quints): ${members.slice(0, 5).join(', ')}${members.length > 5 ? ' ...' : ''}`);
  }
  console.log('');

  // Reference points from row 91, for calibration.
  console.log('For reference:');
  console.log('p_empty(16) = 207354');
  console.log('p_quads_max(16) = 17163924 (largest quad class)');
  console.log('p_all9(16) = 26151102');
}

if (require.main === module) main();

module.exports = { allQuints };
