const { H6, G3 } = require('../morphisms.js');

// 1. Generate h6^6(a)
let h6_word = Object.keys(H6)[0]; // usually 'a'
for (let i = 0; i < 6; i++) {
  let next = '';
  for (let j = 0; j < h6_word.length; j++) {
    next += H6[h6_word[j]];
  }
  h6_word = next;
}
console.log(`[+] Generated h6^6(${Object.keys(H6)[0]}), length: ${h6_word.length}`);

// 2. Generate g3(h6^6(a))
let w = '';
// Keep track of which h6 letter generated which g3 block for tracing
const sourceLetters = [];
for (let i = 0; i < h6_word.length; i++) {
  const block = G3[h6_word[i]];
  w += block;
  for (let k = 0; k < block.length; k++) {
    sourceLetters.push(h6_word[i]);
  }
}
console.log(`[+] Generated g3(h6^6(a)), length: ${w.length}`);

// 3. Find unique abelian squares for K in [1, 5]
const L = w.length;
const uniqueSquares = new Map(); // key -> { K, occurrences: [] }

function getParikh(str) {
    const counts = {a:0, b:0, c:0};
    for(let i=0; i<str.length; i++) {
        if(counts[str[i]] !== undefined) counts[str[i]]++;
    }
    return `${counts.a},${counts.b},${counts.c}`;
}

for (let K = 1; K <= 5; K++) {
    for (let i = 0; i <= L - 2*K; i++) {
        const left = w.substring(i, i+K);
        const right = w.substring(i+K, i+2*K);
        
        if (getParikh(left) === getParikh(right)) {
            const sq = left + right;
            if (!uniqueSquares.has(sq)) {
                uniqueSquares.set(sq, { K, occurrences: [] });
            }
            uniqueSquares.get(sq).occurrences.push(i);
        }
    }
}

console.log(`[+] Found ${uniqueSquares.size} UNIQUE abelian squares in total.`);

// 4. Analyze phase and boundaries
const squaresByK = {1:[], 2:[], 3:[], 4:[], 5:[]};

for (const [sq, data] of uniqueSquares.entries()) {
    squaresByK[data.K].push({ sq, occs: data.occurrences });
}

for (let K = 1; K <= 5; K++) {
    console.log(`\n=== K = ${K} (${squaresByK[K].length} unique squares) ===`);
    for (const item of squaresByK[K]) {
        // Just analyze the FIRST occurrence to see the structure
        const firstIdx = item.occs[0];
        const phaseStart = firstIdx % 10;
        const phaseEnd = (firstIdx + 2*K) % 10;
        const spansBoundary = (phaseStart + 2*K > 10);
        
        const src1 = sourceLetters[firstIdx];
        const src2 = sourceLetters[firstIdx + 2*K - 1];
        
        let type = spansBoundary ? "WELD (spans blocks)" : "INTERNAL (inside 1 block)";
        console.log(`Square: ${item.sq}`);
        console.log(`  Occurrences: ${item.occs.length} (first at idx ${firstIdx})`);
        console.log(`  Phase: starts at ${phaseStart}, ends at ${phaseEnd}. Type: ${type}`);
        if (spansBoundary) {
             const blockIdx1 = Math.floor(firstIdx / 10);
             const blockIdx2 = Math.floor((firstIdx + 2*K - 1) / 10);
             const crossing = w.substring(blockIdx1 * 10, (blockIdx2 + 1) * 10);
             console.log(`  Crossing H6 letters: ${h6_word.substring(blockIdx1, blockIdx2+1)}`);
        } else {
             console.log(`  H6 letter: ${src1}`);
        }
    }
}
