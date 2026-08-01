const { H6, G3 } = require('../morphisms.js');

function hasAbelianSquare(word, minK = 2, maxK = 5) {
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
                return true;
            }
        }
    }
    return false;
}

function getFactors(word, length) {
    let factors = new Set();
    for (let i = 0; i <= word.length - length; i++) {
        factors.add(word.slice(i, i + length));
    }
    return Array.from(factors).sort();
}

let w = 'a';
for (let i = 0; i < 6; i++) {
    let n = '';
    for (let c of w) n += H6[c];
    w = n;
}
const B10 = 2 + Math.floor(8 / 10); // B(10) = 2
const factors10 = getFactors(w, B10);

console.log("Testing G3...");
let g3Valid = true;
for (let f of factors10) {
    let mapped = '';
    for (let char of f) {
        mapped += G3[char];
    }
    if (hasAbelianSquare(mapped, 2, 5)) {
        console.log(`G3 rejected! Factor '${f}' maps to '${mapped}', which contains an abelian square K in [2,5].`);
        g3Valid = false;
        break;
    }
}
if (g3Valid) {
    console.log("ERROR: G3 was accepted!");
}

