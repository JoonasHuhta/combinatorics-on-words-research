'use strict';

const { BIGRAMS, toMask, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');

const MAX_N = 22;

const maskAll9 = toMask(BIGRAMS);
const maskG6 = toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']);

console.log("Computing All-9 up to n=22...");
const resAll9 = enumerateSAbelian(maskAll9, MAX_N, 1e11);
console.log("Computing G6 up to n=22...");
const resG6 = enumerateSAbelian(maskG6, MAX_N, 1e11);

const countsAll9 = resAll9.counts;
const countsG6 = resG6.counts;

// Append n=23 from MATH_CLAIMS.md Row 101
countsAll9[23] = 5455985058;
countsG6[23] = 5427312294;

console.log("n | p_All9(n) | p_G6(n) | d_n | Delta d_n");
console.log("---------------------------------------------------------");

let prev_d = null;

for (let n = 2; n <= 23; n++) {
    const pA = countsAll9[n];
    const pG = countsG6[n];
    
    if (!pA || !pG) continue;
    
    const dn = Math.log(pG) - Math.log(pA);
    let delta_dn = "";
    if (prev_d !== null) {
        delta_dn = (dn - prev_d).toFixed(6);
    }
    
    console.log(`${n.toString().padStart(2)} | ${pA.toString().padStart(12)} | ${pG.toString().padStart(12)} | ${dn.toFixed(6)} | ${delta_dn}`);
    
    prev_d = dn;
}
