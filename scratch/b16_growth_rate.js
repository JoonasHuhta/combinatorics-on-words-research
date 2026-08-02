const { BIGRAMS, toMask, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');

function computeGrowthRates(mask, maxN) {
  const r = enumerateSAbelian(mask, maxN, 1e9);
  const p = r.counts;
  const rates = [];
  for (let n = 2; n <= maxN; n++) {
    if (p[n-1] === 0) {
      rates.push(0);
    } else {
      rates.push(p[n] / p[n-1]);
    }
  }
  return { counts: p, rates };
}

function main() {
  const maxN = 16;
  console.log(`B16 Growth Rate Analysis (maxN = ${maxN})\n`);

  // 0-element (empty)
  let res = computeGrowthRates(0, maxN);
  console.log("S = Empty (1-abelian)");
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");

  // 1-element (singletons)
  console.log("S = Singleton ('aa') [Diagonal class]");
  res = computeGrowthRates(toMask(['aa']), maxN);
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");

  console.log("S = Singleton ('ab') [Off-diagonal class]");
  res = computeGrowthRates(toMask(['ab']), maxN);
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");

  // 2-element (pairs)
  console.log("S = Pair ({'aa', 'bb'})");
  res = computeGrowthRates(toMask(['aa', 'bb']), maxN);
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");

  console.log("S = Pair ({'aa', 'ab'})");
  res = computeGrowthRates(toMask(['aa', 'ab']), maxN);
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");

  // 9-element (all-9)
  console.log("S = All-9 (2-abelian)");
  res = computeGrowthRates(511, maxN);
  console.log("  counts:", res.counts.slice(1).join(", "));
  console.log("  rates: ", res.rates.map(x => x.toFixed(4)).join(", "));
  console.log("");
}

main();
