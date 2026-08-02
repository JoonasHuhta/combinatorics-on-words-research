'use strict';

/**
 * b16-spectral-radius.js
 * ----------------------
 * Computes exact Collatz-Wielandt upper bounds on the asymptotic growth rate
 * of the B16 "Golden Six" language vs the All-9 language, using a sequence of
 * finite SFT containers for square lengths up to kmax.
 *
 * This implements the strict mathematical proof strategy from implementation_plan.md.
 */

const { BIGRAMS, toMask } = require('../scripts/b16-bigram-lattice.js');

function codeToWord(code, len) {
  const w = new Array(len);
  for (let i = len - 1; i >= 0; i--) { w[i] = code % 3; code = Math.floor(code / 3); }
  return w;
}

function hasSAbelianSquare(w, klo, khi, mask) {
  const n = w.length;
  for (let K = klo; K <= khi; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let da = 0, db = 0, dc = 0;
      for (let j = i; j < i + K; j++) { const c = w[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = i + K; j < i + 2 * K; j++) { const c = w[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      
      if (da !== 0 || db !== 0 || dc !== 0) continue;
      
      // Letters match. Now check bigrams in the mask.
      let bigramMatch = true;
      for (let B = 0; B < 9; B++) {
        if (!(mask & (1 << B))) continue;
        
        // Count bigram B in first window
        let count1 = 0;
        for(let j = i; j < i + K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count1++;
        }
        
        // Count bigram B in second window
        let count2 = 0;
        for(let j = i + K; j < i + 2 * K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count2++;
        }
        
        if (count1 !== count2) {
            bigramMatch = false;
            break;
        }
      }
      
      if (bigramMatch) return true; // Found an S-abelian square
    }
  }
  return false;
}

function buildContainer(kmax, mask) {
  const m = 2 * kmax - 1;
  const raw = Math.pow(3, m);
  const powPrev = Math.pow(3, m - 1);

  const stateIdx = new Int32Array(raw).fill(-1);
  const states = [];
  for (let code = 0; code < raw; code++) {
    if (!hasSAbelianSquare(codeToWord(code, m), 2, kmax - 1, mask)) {
      stateIdx[code] = states.length;
      states.push(code);
    }
  }
  const n = states.length;

  const adj = new Array(n);
  for (let i = 0; i < n; i++) {
    const code = states[i];
    const suffix = code % powPrev;
    const out = [];
    for (let s = 0; s < 3; s++) {
      const ncode = suffix * 3 + s;
      if (stateIdx[ncode] === -1) continue;
      const w2k = codeToWord(code, m); w2k.push(s);
      
      if (!hasSAbelianSquare(w2k, kmax, kmax, mask)) {
          out.push(stateIdx[ncode]);
      }
    }
    adj[i] = out;
  }

  // Essentialize
  const alive = new Uint8Array(n).fill(1);
  let changed = true;
  while (changed) {
    changed = false;
    const indeg = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      if (!alive[i]) continue;
      let outd = 0;
      for (const j of adj[i]) if (alive[j]) { outd++; indeg[j]++; }
      if (outd === 0) { alive[i] = 0; changed = true; }
    }
    for (let i = 0; i < n; i++) {
      if (alive[i] && indeg[i] === 0) { alive[i] = 0; changed = true; }
    }
  }
  
  // Compact the adjacency list to only alive nodes
  const aliveNodes = [];
  const oldToNew = new Int32Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
      if (alive[i]) {
          oldToNew[i] = aliveNodes.length;
          aliveNodes.push(i);
      }
  }
  
  const compactAdj = new Array(aliveNodes.length);
  for (let i = 0; i < aliveNodes.length; i++) {
      const oldIdx = aliveNodes[i];
      const outs = [];
      for(const j of adj[oldIdx]) {
          if (alive[j]) outs.push(oldToNew[j]);
      }
      compactAdj[i] = outs;
  }

  return { raw, valid: n, essential: aliveNodes.length, adj: compactAdj };
}

function powerIterationFloat(adj, iterations = 2000) {
    const n = adj.length;
    if (n === 0) return { lower: 0, upper: 0 };
    
    let x = new Float64Array(n).fill(1.0);
    let lower = 0;
    let upper = 0;
    
    for (let iter = 0; iter < iterations; iter++) {
        const y = new Float64Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            const val = x[i];
            for (let j = 0; j < adj[i].length; j++) {
                y[adj[i][j]] += val; // Push forward (x^T A) -> actually this means x_{k+1} = A^T x_k.
                // Wait! If y is the new state, and adj[i] are the destinations FROM i,
                // then y[j] += x[i] means y = A^T x where A_ij is edge from i to j.
                // The dominant eigenvalue of A is the same as A^T.
            }
        }
        
        let minRatio = Infinity;
        let maxRatio = -Infinity;
        let maxSum = 0;
        
        for (let i = 0; i < n; i++) {
            const ratio = y[i] / x[i];
            if (ratio < minRatio) minRatio = ratio;
            if (ratio > maxRatio) maxRatio = ratio;
            if (y[i] > maxSum) maxSum = y[i];
        }
        
        lower = minRatio;
        upper = maxRatio;
        
        // Normalize to prevent overflow and keep values in good precision range
        for (let i = 0; i < n; i++) {
            x[i] = y[i] / maxSum;
        }
    }
    
    return { lower, upper, x };
}

function exactCollatzWielandt(adj, float_x) {
    const n = adj.length;
    if (n === 0) return { minN: 0n, minD: 1n, maxN: 0n, maxD: 1n };
    
    // Scale float_x by 1e14 to preserve precision and convert to BigInt
    // Math.max(1, ...) ensures no zero components, which would break division.
    // By Perron-Frobenius, on an essential (strongly connected) graph, the true eigenvector has no zeroes.
    const SCALE = 100000000000000;
    const v = new BigInt64Array(n);
    for (let i = 0; i < n; i++) {
        v[i] = BigInt(Math.max(1, Math.round(float_x[i] * SCALE)));
    }
    
    const y = new BigInt64Array(n);
    for (let i = 0; i < n; i++) {
        const val = v[i];
        for (let j = 0; j < adj[i].length; j++) {
            y[adj[i][j]] += val;
        }
    }
    
    let minN = y[0], minD = v[0];
    let maxN = y[0], maxD = v[0];
    
    for (let i = 1; i < n; i++) {
        const num = y[i];
        const den = v[i];
        // min = Math.min(min, num/den) <=> num/den < minN/minD <=> num * minD < minN * den
        if (num * minD < minN * den) {
            minN = num; minD = den;
        }
        // max = Math.max(max, num/den) <=> num/den > maxN/maxD <=> num * maxD > maxN * den
        if (num * maxD > maxN * den) {
            maxN = num; maxD = den;
        }
    }
    
    return { minN, minD, maxN, maxD };
}

function formatMemoryUsage(mem) {
    return `RSS: ${Math.round(mem.rss / 1024 / 1024)}MB, Heap Total: ${Math.round(mem.heapTotal / 1024 / 1024)}MB, Heap Used: ${Math.round(mem.heapUsed / 1024 / 1024)}MB`;
}

function main() {
    const args = process.argv.slice(2);
    const kmax = parseInt(args[0] || '8', 10);
    
    const mask6 = toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']);
    const mask9 = 511; // All-9
    
    console.log(`Golden Six Mask: ${mask6}`);
    console.log(`All-9 Mask: ${mask9}`);
    console.log("--------------------------------------------------");
    console.log(`[kmax = ${kmax}] (m = ${2*kmax - 1})`);
    
    const start_time = Date.now();
    
    // Golden Six
    console.log(`\nBuilding Golden Six SFT...`);
    const c6 = buildContainer(kmax, mask6);
    console.log(`  Golden Six | Raw: ${c6.raw}, Valid: ${c6.valid}, Essential: ${c6.essential}`);
    console.log(`  Memory: ${formatMemoryUsage(process.memoryUsage())}`);
    
    const bounds6_float = powerIterationFloat(c6.adj, 3000);
    const bounds6_exact = exactCollatzWielandt(c6.adj, bounds6_float.x);
    const L6 = Number(bounds6_exact.minN) / Number(bounds6_exact.minD);
    const U6 = Number(bounds6_exact.maxN) / Number(bounds6_exact.maxD);
    console.log(`  Golden Six | Exact Bounds (float rep): [${L6.toFixed(6)}, ${U6.toFixed(6)}]`);
    console.log(`  Memory after Golden Six CW: ${formatMemoryUsage(process.memoryUsage())}`);
    
    // All-9
    console.log(`\nBuilding All-9 SFT...`);
    const c9 = buildContainer(kmax, mask9);
    console.log(`  All-9      | Raw: ${c9.raw}, Valid: ${c9.valid}, Essential: ${c9.essential}`);
    console.log(`  Memory: ${formatMemoryUsage(process.memoryUsage())}`);
    
    const bounds9_float = powerIterationFloat(c9.adj, 3000);
    const bounds9_exact = exactCollatzWielandt(c9.adj, bounds9_float.x);
    const L9 = Number(bounds9_exact.minN) / Number(bounds9_exact.minD);
    const U9 = Number(bounds9_exact.maxN) / Number(bounds9_exact.maxD);
    console.log(`  All-9      | Exact Bounds (float rep): [${L9.toFixed(6)}, ${U9.toFixed(6)}]`);
    console.log(`  Memory after All-9 CW: ${formatMemoryUsage(process.memoryUsage())}`);
    
    console.log("\n--------------------------------------------------");
    // Exact rational comparison: U6 < L9 <=> U6.maxN / U6.maxD < L9.minN / L9.minD
    if (bounds6_exact.maxN * bounds9_exact.minD < bounds9_exact.minN * bounds6_exact.maxD) {
        console.log(`*** EXACT RATIONAL SEPARATION REACHED AT kmax=${kmax} ***`);
        console.log(`Golden Six SFT relaxation STRICTLY bounded below All-9 (proven exactly with BigInt ℚ).`);
    } else {
        console.log(`No strict separation proven at kmax=${kmax}.`);
        console.log(`G6 Upper bound: ${U6}`);
        console.log(`All-9 Lower bound: ${L9}`);
    }
    
    console.log(`Total time: ${(Date.now() - start_time) / 1000}s`);
}

main();
