const { H6 } = require('../morphisms.js');
const fs = require('fs');

const g6 = {
  a: 'aaabaa',
  c: 'acabbc',
  e: 'ccbaac',
  b: 'ccaaab',
  d: 'cccbba',
  f: 'ccbbbc'
};

function hasAbelianSquare(word, minK, maxK) {
    for (let k = minK; k <= maxK; k++) {
        if (2 * k > word.length) continue;
        for (let i = 0; i <= word.length - 2 * k; i++) {
            let p1 = [0, 0, 0];
            let p2 = [0, 0, 0];
            for (let j = 0; j < k; j++) {
                p1[word.charCodeAt(i + j) - 97]++;
                p2[word.charCodeAt(i + k + j) - 97]++;
            }
            if (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]) {
                return { found: true, k: k, index: i, str: word.substring(i, i + 2*k) };
            }
        }
    }
    return { found: false };
}

console.log("Generating h6^omega(a) to 10,000 blocks...");
let w = 'a';
for (let i = 0; i < 6; i++) {
    let n = '';
    for (let char of w) n += H6[char];
    w = n;
}
console.log(`Block string length: ${w.length}`);

console.log("Projecting with g6...");
let projected = '';
for (let char of w) {
    projected += g6[char];
}
console.log(`Projected string length: ${projected.length}`);

console.log("Scanning for abelian squares K in [2, 100] (covers small + some large)...");
const result = hasAbelianSquare(projected, 2, 100);

if (result.found) {
    console.log(`[FAILED] Abelian square found at index ${result.index} with half-period K=${result.k}`);
    console.log(`Square: ${result.str}`);
} else {
    console.log(`[PASSED] NO ABELIAN SQUARES K in [2, 100] FOUND!`);
}

// Check Parikh injectivity
const vectors = new Set();
for (const key in g6) {
    const v = [0,0,0];
    for (let char of g6[key]) v[char.charCodeAt(0) - 97]++;
    vectors.add(v.join(','));
}
console.log(`Parikh vectors in g6: ${vectors.size} (Expected 6 for injectivity)`);
