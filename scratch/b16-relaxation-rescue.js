const fs = require('fs');
const { toMask } = require('../scripts/b16-bigram-lattice.js');

const candidate = fs.readFileSync('scratch/candidate-2107.txt', 'utf8').trim();
const w_init = Array.from(candidate).map(c => c.charCodeAt(0) - 97);

// Function to check if the current word has a suffix S-abelian square of period K > 1
function hasSuffixSquare(w, mask) {
    const n = w.length;
    const maxK = Math.floor(n / 2);
    
    // Check all possible periods K >= 2 (since aa2f allows K=1)
    for (let K = 2; K <= maxK; K++) {
        const mid = n - K;
        const start = n - 2 * K;
        
        let da = 0, db = 0, dc = 0;
        for (let i = start; i < mid; i++) {
            const c = w[i];
            if (c === 0) da++; else if (c === 1) db++; else dc++;
        }
        for (let i = mid; i < n; i++) {
            const c = w[i];
            if (c === 0) da--; else if (c === 1) db--; else dc--;
        }
        
        if (da !== 0 || db !== 0 || dc !== 0) continue; // Letter counts mismatch
        
        // If mask === 0, we found a 1-abelian square.
        if (mask === 0) return true;
        
        // Letter counts match, check bigrams
        let bigramMatch = true;
        for (let B = 0; B < 9; B++) {
            if (!(mask & (1 << B))) continue; // Only check bigrams in the mask
            
            let count1 = 0;
            for (let i = start; i < mid - 1; i++) {
                if (w[i] * 3 + w[i+1] === B) count1++;
            }
            // Add the cross-boundary bigram if needed, but wait: 
            // 2-abelian equivalence means internal bigram counts match.
            // As fixed in Row 92, we compare internal counts.
            
            let count2 = 0;
            for (let i = mid; i < n - 1; i++) {
                if (w[i] * 3 + w[i+1] === B) count2++;
            }
            
            if (count1 !== count2) {
                bigramMatch = false;
                break;
            }
        }
        
        if (bigramMatch) return true; // Found an S-abelian square
    }
    
    return false;
}

function dfsExtend(w, targetLen, mask, maxSolutions = 1) {
    let solutions = [];
    
    function dfs() {
        if (solutions.length >= maxSolutions) return;
        if (w.length === targetLen) {
            solutions.push(w.slice());
            return;
        }
        
        for (let c = 0; c < 3; c++) {
            w.push(c);
            if (!hasSuffixSquare(w, mask)) {
                dfs();
            }
            w.pop();
        }
    }
    
    dfs();
    return solutions;
}

const masksToTest = [
    { name: "aa2f (S=empty)", mask: 0 },
    { name: "Golden Six", mask: toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']) },
    { name: "Kahdeksikko (All-9 minus aa)", mask: toMask(['ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']) },
    { name: "All-9", mask: 511 }
];

const EXTENSION_LENGTH = 500;
const targetLen = w_init.length + EXTENSION_LENGTH;

console.log(`Starting with 2107-letter candidate...`);
console.log(`Attempting to extend to length ${targetLen} (+${EXTENSION_LENGTH} letters)\n`);

for (const t of masksToTest) {
    console.log(`Testing extension under rules: ${t.name}`);
    const w = w_init.slice();
    
    const start = Date.now();
    const solutions = dfsExtend(w, targetLen, t.mask, 1);
    const elapsed = Date.now() - start;
    
    if (solutions.length > 0) {
        console.log(`  -> SUCCESS! Found extension in ${elapsed}ms`);
        const ext = solutions[0].slice(w_init.length);
        const chars = ext.map(c => String.fromCharCode(97 + c)).join('');
        console.log(`  -> Extension: ${chars}`);
    } else {
        console.log(`  -> FAILED. Dead end reached in ${elapsed}ms`);
    }
    console.log('');
}
