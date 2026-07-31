const { G85 } = require('../morphisms.js');

// Generate 2nd iterate of G85 starting from 'a'
let w = 'a';
for (let i = 0; i < 2; i++) {
  let next = '';
  for (let j = 0; j < w.length; j++) {
    next += G85[w[j]];
  }
  w = next;
}
console.log(`Generated G85 word of length ${w.length}`);

// Generate all 36 surjections {a,b,c,d} -> {0,1,2}
const inputs = ['a', 'b', 'c', 'd'];
const pairs = [
  ['a', 'b'], ['a', 'c'], ['a', 'd'],
  ['b', 'c'], ['b', 'd'], ['c', 'd']
];
const outputsList = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]
];

const surjections = [];
for (const pair of pairs) {
  const remaining = inputs.filter(x => !pair.includes(x));
  for (const outs of outputsList) {
    const map = {};
    map[pair[0]] = outs[0];
    map[pair[1]] = outs[0];
    map[remaining[0]] = outs[1];
    map[remaining[1]] = outs[2];
    surjections.push(map);
  }
}

console.log(`Generated ${surjections.length} surjections`);

function hasAbelianSquareFast(arr) {
  const n = arr.length;
  // K is half-length. Test up to n/2.
  // We check smallest K first to find out where the structure breaks locally
  for (let K = 2; K <= Math.floor(n / 2); K++) {
    let c0_left = 0, c1_left = 0, c2_left = 0;
    let c0_right = 0, c1_right = 0, c2_right = 0;
    
    // init K-windows at i=0
    for(let i=0; i<K; i++) {
        const cl = arr[i];
        if (cl===0) c0_left++; else if (cl===1) c1_left++; else c2_left++;
        const cr = arr[i+K];
        if (cr===0) c0_right++; else if (cr===1) c1_right++; else c2_right++;
    }
    
    if (c0_left === c0_right && c1_left === c1_right && c2_left === c2_right) return {K, pos: 0};
    
    for (let i = 1; i <= n - 2*K; i++) {
       // shift left window
       const out_l = arr[i-1];
       if (out_l===0) c0_left--; else if (out_l===1) c1_left--; else c2_left--;
       const in_l = arr[i+K-1];
       if (in_l===0) c0_left++; else if (in_l===1) c1_left++; else c2_left++;
       
       // shift right window
       const out_r = arr[i+K-1];
       if (out_r===0) c0_right--; else if (out_r===1) c1_right--; else c2_right--;
       const in_r = arr[i+2*K-1];
       if (in_r===0) c0_right++; else if (in_r===1) c1_right++; else c2_right++;
       
       if (c0_left === c0_right && c1_left === c1_right && c2_left === c2_right) return {K, pos: i};
    }
  }
  return false;
}

let surviveCount = 0;
for (let i = 0; i < surjections.length; i++) {
  const map = surjections[i];
  const projected = new Uint8Array(w.length);
  for (let j = 0; j < w.length; j++) projected[j] = map[w[j]];
  
  const fail = hasAbelianSquareFast(projected);
  if (!fail) {
    console.log(`Surjection ${JSON.stringify(map)} SURVIVED!`);
    surviveCount++;
  } else {
    console.log(`Surjection ${JSON.stringify(map)} FAILED at K=${fail.K}, pos=${fail.pos}`);
  }
}

console.log(`\nTotal survived: ${surviveCount} / 36`);
