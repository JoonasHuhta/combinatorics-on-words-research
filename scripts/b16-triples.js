'use strict';

/**
 * b16-triples.js
 * -------------
 * B16 deepened to level 3: the 84 = C(9,3) three-element subsets of the bigram
 * lattice. Same DFS engine (`b16-bigram-lattice.js`'s `enumerateSAbelian`),
 * same minK=2, same exhaustive-to-n=16 standard as pairs and singletons.
 *
 * Purpose: Track if three-element constraints begin jumping toward the all-9
 * asymptote, or if they establish another plateau.
 *
 * Usage: node scripts/b16-triples.js [maxN] [budget]
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('./b16-bigram-lattice.js');

function allTriples() {
  const out = [];
  for (let i = 0; i < BIGRAMS.length; i++)
    for (let j = i + 1; j < BIGRAMS.length; j++)
      for (let k = j + 1; k < BIGRAMS.length; k++)
        out.push([BIGRAMS[i], BIGRAMS[j], BIGRAMS[k]]);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '16', 10);
  const budget = parseFloat(args[1] || '6e8');

  const triples = allTriples();
  console.log(`B16 triples: ${triples.length} three-element subsets, maxN=${maxN}, budget=${budget}`);
  console.log('');

  const results = [];
  const t0 = Date.now();
  for (const t of triples) {
    const r = enumerateSAbelian(toMask(t), maxN, budget);
    results.push({ triple: t, r });
    if (!r.exhausted) {
      console.log(`  {${t.join(',')}}: BUDGET HIT, no exact value`);
    }
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log(`all ${triples.length} triples run in ${elapsed.toFixed(1)}s`);
  console.log('');

  // Group by p(maxN) to find symmetry classes empirically.
  const byValue = new Map();
  for (const { triple, r } of results) {
    if (!r.exhausted) continue;
    const v = r.counts[maxN];
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(triple.join(''));
  }
  const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);
  console.log(`Distinct p(${maxN}) values among the 84 triples: ${sortedValues.length}`);
  for (const v of sortedValues) {
    const members = byValue.get(v);
    console.log(`  p(${maxN})=${v}  (${members.length} triples): ${members.slice(0, 5).join(', ')}${members.length > 5 ? ' ...' : ''}`);
  }
  console.log('');

  // Reference points from row 86, for calibration.
  console.log('For reference:');
  console.log('p_empty(16) = 207354');
  console.log('p_pairs_max(16) = 6410640 (largest pair class)');
  console.log('p_all9(16) = 26151102');
}

if (require.main === module) main();

module.exports = { allTriples };
