'use strict';

/**
 * b16-sevens.js
 * -------------
 * B16 lattice level 7: the 36 = C(9,7) seven-element bigram subsets.
 * Same engine as b16-sixes.js etc. Completes the lattice toward n=16 alongside
 * b16-eights.js (level 9 = all-9 is already known, row 92).
 *
 * Usage: node scripts/b16-sevens.js [maxN] [budget]
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('./b16-bigram-lattice.js');

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function rec(start) {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < arr.length; i++) {
      cur.push(arr[i]);
      rec(i + 1);
      cur.pop();
    }
  }
  rec(0);
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const maxN = parseInt(args[0] || '16', 10);
  const budget = parseFloat(args[1] || '6e8');

  const sets = combinations(BIGRAMS, 7);
  console.log(`B16 sevens: ${sets.length} seven-element subsets, maxN=${maxN}, budget=${budget}`);
  console.log('');

  const results = [];
  const t0 = Date.now();
  for (const s of sets) {
    const r = enumerateSAbelian(toMask(s), maxN, budget);
    results.push({ s, r });
    if (!r.exhausted) console.log(`  {${s.join(',')}}: BUDGET HIT, no exact value`);
  }
  const elapsed = (Date.now() - t0) / 1000;
  console.log(`all ${sets.length} sevens run in ${elapsed.toFixed(1)}s`);
  console.log('');

  const byValue = new Map();
  for (const { s, r } of results) {
    if (!r.exhausted) continue;
    const v = r.counts[maxN];
    if (!byValue.has(v)) byValue.set(v, []);
    byValue.get(v).push(s.join(''));
  }
  const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);
  console.log(`Distinct p(${maxN}) values among the ${sets.length} sevens: ${sortedValues.length}`);
  let total = 0;
  for (const v of sortedValues) {
    const members = byValue.get(v);
    total += members.length;
    console.log(`  p(${maxN})=${v}  (${members.length} sevens): ${members.slice(0, 5).join(', ')}${members.length > 5 ? ' ...' : ''}`);
  }
  console.log(`class sizes sum to ${total} (expected ${sets.length})`);
  console.log('');
  console.log('For reference: p_empty(16)=207354, p_sixes_max(16)=7174218 (row 93), p_all9(16)=7180188 (row 92).');
}

if (require.main === module) main();

module.exports = { combinations };
