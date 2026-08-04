const { BIGRAMS, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');
const math = require('mathjs');

const reps = [0,1,2,3,6,7,10,11,12,13,14,15,17,19,20,21,22,23,27,28,29,30,31,38,39,45,46,47,53,55,63,78,84,85,86,87,94,98,99,102,103,110,113,115,117,118,119,121,125,126,238,245,273,275,279,283,285,287,311,319,371,375];

function getHankelMatrix(seq, m) {
    let H = [];
    for (let i = 0; i < m; i++) {
        let row = [];
        for (let j = 0; j < m; j++) {
            row.push(math.fraction(seq[i + j]));
        }
        H.push(row);
    }
    return H;
}

function computeRank(matrix) {
    let m = matrix.length;
    if (m === 0) return 0;
    let rank = 0;
    for (let col = 0; col < m; col++) {
        let pivotRow = -1;
        for (let row = rank; row < m; row++) {
            if (!math.equal(matrix[row][col], 0)) {
                pivotRow = row;
                break;
            }
        }
        if (pivotRow !== -1) {
            let temp = matrix[rank];
            matrix[rank] = matrix[pivotRow];
            matrix[pivotRow] = temp;
            let pivotVal = matrix[rank][col];
            for (let j = col; j < m; j++) {
                matrix[rank][j] = math.divide(matrix[rank][j], pivotVal);
            }
            for (let row = rank + 1; row < m; row++) {
                let factor = matrix[row][col];
                if (!math.equal(factor, 0)) {
                    for (let j = col; j < m; j++) {
                        matrix[row][j] = math.subtract(matrix[row][j], math.multiply(factor, matrix[rank][j]));
                    }
                }
            }
            rank++;
        }
    }
    return rank;
}

function maskToString(mask) {
    const active = [];
    for (let i = 0; i < 9; i++) {
        if ((mask & (1 << i))) active.push(BIGRAMS[i]);
    }
    return `{${active.join(',')}}`;
}

function run() {
    const maxN = 16;
    const budget = 5e7;
    
    console.log(`Running systematic sweep on ${reps.length} equivalence classes up to N=${maxN}...`);
    
    const results = [];
    
    for (const mask of reps) {
        const r = enumerateSAbelian(mask, maxN, budget);
        const seq = r.counts.slice(1, r.completeUpTo + 1); // Drop p(0)
        
        let hankelRanks = [];
        for (let m = 1; m <= Math.floor(seq.length / 2); m++) {
            let H = getHankelMatrix(seq, m);
            hankelRanks.push(computeRank(H));
        }
        
        // Is it saturated? 
        // We consider it saturated if the last two ranks are the same, and not full rank.
        // Actually, if it's less than max possible rank, it might be saturating.
        let isSaturated = false;
        let finalRank = hankelRanks.length > 0 ? hankelRanks[hankelRanks.length - 1] : 0;
        if (hankelRanks.length >= 2) {
            if (hankelRanks[hankelRanks.length - 1] === hankelRanks[hankelRanks.length - 2]) {
                isSaturated = true;
            }
        }
        
        let rate = 0;
        if (r.completeUpTo >= 2) {
            rate = r.counts[r.completeUpTo] / r.counts[r.completeUpTo - 1];
        }
        
        results.push({
            mask,
            desc: maskToString(mask),
            completeUpTo: r.completeUpTo,
            seq,
            hankelRanks,
            isSaturated,
            finalRank,
            rate
        });
    }
    
    // Sort by rate descending
    results.sort((a, b) => b.rate - a.rate);
    
    console.log("\nResults (sorted by empirical growth rate at max reachable N):");
    console.log("Mask | Description | N | p(N)/p(N-1) | Hankel Ranks | Saturated?");
    console.log("-".repeat(90));
    
    for (const res of results) {
        const rateStr = res.rate.toFixed(4);
        const satStr = res.isSaturated ? "YES" : "NO";
        console.log(`${res.mask.toString().padStart(4)} | ${res.desc.padEnd(30)} | ${res.completeUpTo} | ${rateStr} | [${res.hankelRanks.join(',')}] | ${satStr}`);
    }
    
    // Suggest candidates for deeper N if any high-rate ones are unsaturated
    console.log("\nTop unsaturated candidates for deeper N:");
    let topUnsat = results.filter(r => !r.isSaturated && r.rate >= 2.5).slice(0, 5);
    for (const res of topUnsat) {
        console.log(`  Mask ${res.mask}: ${res.desc} (Rate: ${res.rate.toFixed(4)}, Ranks: [${res.hankelRanks.join(',')}])`);
    }
    if (topUnsat.length === 0) console.log("  None found > 2.5.");
}

run();
