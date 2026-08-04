'use strict';

/**
 * b16-spectral-csr.js
 * ----------------------
 * Computes exact Collatz-Wielandt upper bounds on the asymptotic growth rate
 * of the B16 "Golden Six" language vs the All-9 language, using a sequence of
 * finite SFT containers for square lengths up to kmax.
 *
 * O(essential) memory optimization:
 * - Uses DFS to generate ONLY valid nodes, avoiding O(3^m) memory bottleneck.
 * - Flat arrays (CSR style) for adjacency.
 * - Binary search for O(log N) state resolution without a massive lookup table.
 */

const { BIGRAMS, toMask } = require('../scripts/b16-bigram-lattice.js');

function hasSAbelianSquare(w, n, klo, khi, mask) {
  for (let K = klo; K <= khi; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let da = 0, db = 0, dc = 0;
      for (let j = i; j < i + K; j++) { const c = w[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = i + K; j < i + 2 * K; j++) { const c = w[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      
      if (da !== 0 || db !== 0 || dc !== 0) continue;
      
      let bigramMatch = true;
      for (let B = 0; B < 9; B++) {
        if (!(mask & (1 << B))) continue;
        
        let count1 = 0;
        for(let j = i; j < i + K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count1++;
        }
        
        let count2 = 0;
        for(let j = i + K; j < i + 2 * K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count2++;
        }
        
        if (count1 !== count2) {
            bigramMatch = false;
            break;
        }
      }
      
      if (bigramMatch) return true;
    }
  }
  return false;
}

function wordToCode(w, len) {
    let c = 0;
    for (let i = 0; i < len; i++) {
        c = c * 3 + w[i];
    }
    return c;
}

function binarySearch(arr, val, maxLen) {
    let lo = 0;
    let hi = maxLen - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (arr[mid] === val) return mid;
        if (arr[mid] < val) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

function buildContainerCSR(kmax, mask) {
    const m = 2 * kmax - 1;
    const powPrev = Math.pow(3, m - 1);
    
    // Pass 1: DFS to find valid states
    console.log(`    Pass 1: DFS to find valid states of length ${m}...`);
    const w = new Int32Array(m + 1); // +1 to test extensions safely
    
    let capacity = 100000;
    let states = new Int32Array(capacity);
    let stateCount = 0;
    
    function dfs(depth) {
        if (depth > 1) {
            // Optimization: we only check squares ending at depth.
            // If the prefix has a square, it would have been caught earlier.
            // So we only check K up to depth/2.
            const maxK = Math.min(kmax - 1, Math.floor(depth / 2));
            if (maxK >= 2) {
                // We just do the full check on the prefix up to depth.
                // It's fast enough for small m.
                if (hasSAbelianSquare(w, depth, 2, maxK, mask)) return;
            }
        }
        
        if (depth === m) {
            if (stateCount === capacity) {
                const nstates = new Int32Array(capacity * 2);
                nstates.set(states);
                states = nstates;
                capacity *= 2;
            }
            states[stateCount++] = wordToCode(w, m);
            return;
        }
        
        for (let c = 0; c < 3; c++) {
            w[depth] = c;
            dfs(depth + 1);
        }
    }
    
    dfs(0);
    
    // Trim states
    const finalStates = new Int32Array(stateCount);
    for(let i=0; i<stateCount; i++) finalStates[i] = states[i];
    states = finalStates; // Now it's exact size and already sorted
    
    console.log(`    Found ${stateCount} valid states.`);
    
    // Pass 2: Build CSR edges
    console.log(`    Pass 2: Building edges & essentializing...`);
    const edges = new Int32Array(stateCount * 3);
    const edgeCount = new Int8Array(stateCount);
    
    for (let i = 0; i < stateCount; i++) {
        const code = states[i];
        const suffix = code % powPrev;
        
        // Decode code to w
        let temp = code;
        for (let idx = m - 1; idx >= 0; idx--) { w[idx] = temp % 3; temp = Math.floor(temp / 3); }
        
        let outDeg = 0;
        for (let s = 0; s < 3; s++) {
            const ncode = suffix * 3 + s;
            const destIdx = binarySearch(states, ncode, stateCount);
            if (destIdx !== -1) {
                w[m] = s;
                // Only need to check the newly formed length kmax squares
                if (!hasSAbelianSquare(w, m + 1, kmax, kmax, mask)) {
                    edges[i * 3 + outDeg] = destIdx;
                    outDeg++;
                }
            }
        }
        edgeCount[i] = outDeg;
    }
    
    // Essentialization in-place using flat arrays
    const alive = new Uint8Array(stateCount).fill(1);
    let changed = true;
    while (changed) {
        changed = false;
        const indeg = new Int32Array(stateCount);
        for (let i = 0; i < stateCount; i++) {
            if (!alive[i]) continue;
            let outd = 0;
            const cnt = edgeCount[i];
            for (let e = 0; e < cnt; e++) {
                const j = edges[i * 3 + e];
                if (alive[j]) { outd++; indeg[j]++; }
            }
            if (outd === 0) { alive[i] = 0; changed = true; }
        }
        for (let i = 0; i < stateCount; i++) {
            if (alive[i] && indeg[i] === 0) { alive[i] = 0; changed = true; }
        }
    }
    
    // Compaction
    const newIdx = new Int32Array(stateCount).fill(-1);
    let essentialCount = 0;
    for (let i = 0; i < stateCount; i++) {
        if (alive[i]) newIdx[i] = essentialCount++;
    }
    
    const compactEdges = new Int32Array(essentialCount * 3);
    const compactEdgeCount = new Int8Array(essentialCount);
    
    for (let i = 0; i < stateCount; i++) {
        if (!alive[i]) continue;
        const nI = newIdx[i];
        let outd = 0;
        const cnt = edgeCount[i];
        for (let e = 0; e < cnt; e++) {
            const j = edges[i * 3 + e];
            if (alive[j]) {
                compactEdges[nI * 3 + outd] = newIdx[j];
                outd++;
            }
        }
        compactEdgeCount[nI] = outd;
    }
    
    return { 
        raw: Math.pow(3, m), 
        valid: stateCount, 
        essential: essentialCount, 
        edges: compactEdges, 
        edgeCount: compactEdgeCount 
    };
}

function powerIterationFloat(edges, edgeCount, n, iterations = 2000) {
    if (n === 0) return { lower: 0, upper: 0 };
    
    let x = new Float64Array(n).fill(1.0);
    let lower = 0;
    let upper = 0;
    
    console.log(`    Running power iteration (${iterations} steps)...`);
    for (let iter = 0; iter < iterations; iter++) {
        if (iter > 0 && iter % 500 === 0) {
            console.log(`      ... step ${iter} / ${iterations} (L: ${lower.toFixed(6)}, U: ${upper.toFixed(6)})`);
        }
        
        const y = new Float64Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            const val = x[i];
            const cnt = edgeCount[i];
            for (let e = 0; e < cnt; e++) {
                const j = edges[i * 3 + e];
                y[j] += val; 
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
        
        for (let i = 0; i < n; i++) {
            x[i] = y[i] / maxSum;
        }
    }
    console.log(`      ... done! Final float bounds: [${lower.toFixed(6)}, ${upper.toFixed(6)}]`);
    return { lower, upper, x };
}

function exactCollatzWielandt(edges, edgeCount, n, float_x) {
    if (n === 0) return { minN: 0n, minD: 1n, maxN: 0n, maxD: 1n };
    
    console.log(`    Running exact Collatz-Wielandt bounding with BigInt64...`);
    const SCALE = 100000000000000;
    const v = new BigInt64Array(n);
    for (let i = 0; i < n; i++) {
        v[i] = BigInt(Math.max(1, Math.round(float_x[i] * SCALE)));
    }
    
    const y = new BigInt64Array(n);
    console.log(`      ... pushing BigInt forward along edges...`);
    for (let i = 0; i < n; i++) {
        if (i > 0 && i % 5000000 === 0) console.log(`        ... processed ${i}/${n} nodes`);
        const val = v[i];
        const cnt = edgeCount[i];
        for (let e = 0; e < cnt; e++) {
            const j = edges[i * 3 + e];
            y[j] += val;
        }
    }
    
    console.log(`      ... finding exact min/max bounds...`);
    let minN = y[0], minD = v[0];
    let maxN = y[0], maxD = v[0];
    
    for (let i = 1; i < n; i++) {
        const num = y[i];
        const den = v[i];
        if (num * minD < minN * den) {
            minN = num; minD = den;
        }
        if (num * maxD > maxN * den) {
            maxN = num; maxD = den;
        }
    }
    
    console.log(`      ... exact bounding complete.`);
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
    console.log(`All-9 Mask:      ${mask9}`);
    console.log("--------------------------------------------------");
    console.log(`[kmax = ${kmax}] (m = ${2*kmax - 1})`);
    
    const start_time = Date.now();
    
    // Golden Six
    console.log(`\nBuilding Golden Six SFT...`);
    const c6 = buildContainerCSR(kmax, mask6);
    console.log(`  Golden Six | Raw: ${c6.raw}, Valid: ${c6.valid}, Essential: ${c6.essential}`);
    console.log(`  Memory: ${formatMemoryUsage(process.memoryUsage())}`);
    
    const bounds6_float = powerIterationFloat(c6.edges, c6.edgeCount, c6.essential, 3000);
    const bounds6_exact = exactCollatzWielandt(c6.edges, c6.edgeCount, c6.essential, bounds6_float.x);
    const L6 = Number(bounds6_exact.minN) / Number(bounds6_exact.minD);
    const U6 = Number(bounds6_exact.maxN) / Number(bounds6_exact.maxD);
    console.log(`  Golden Six | Exact Bounds (float rep): [${L6.toFixed(6)}, ${U6.toFixed(6)}]`);
    
    // Free C6 memory explicitly (helps GC)
    c6.edges = null; c6.edgeCount = null;
    
    // All-9
    console.log(`\nBuilding All-9 SFT...`);
    const c9 = buildContainerCSR(kmax, mask9);
    console.log(`  All-9      | Raw: ${c9.raw}, Valid: ${c9.valid}, Essential: ${c9.essential}`);
    console.log(`  Memory: ${formatMemoryUsage(process.memoryUsage())}`);
    
    const bounds9_float = powerIterationFloat(c9.edges, c9.edgeCount, c9.essential, 3000);
    const bounds9_exact = exactCollatzWielandt(c9.edges, c9.edgeCount, c9.essential, bounds9_float.x);
    const L9 = Number(bounds9_exact.minN) / Number(bounds9_exact.minD);
    const U9 = Number(bounds9_exact.maxN) / Number(bounds9_exact.maxD);
    console.log(`  All-9      | Exact Bounds (float rep): [${L9.toFixed(6)}, ${U9.toFixed(6)}]`);
    
    console.log("\n--------------------------------------------------");
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
