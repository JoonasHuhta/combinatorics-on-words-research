'use strict';

const { coords } = require('./bounds-arbitrary.js');

/**
 * Enumerate the finite ancestor box using numeric floats with a safety margin.
 * P and Pinv may contain complex numbers if eigenvalues were complex.
 * The variables c are the numerical bounds per coordinate.
 */
function enumerateBoxNum(P, Pinv, c) {
  const n = P.length;
  const ranges = [];
  
  // Calculate bounding ranges |x_j| <= sum_i |P_{ji}| c_i
  for (let j = 0; j < n; j++) {
    let b = 0;
    for (let i = 0; i < n; i++) {
      let mod = 0;
      if (typeof P[j][i] === 'object' && P[j][i] !== null) {
        mod = Math.sqrt(P[j][i].re*P[j][i].re + P[j][i].im*P[j][i].im);
      } else {
        mod = Math.abs(P[j][i]);
      }
      b += mod * c[i];
    }
    // Add 1 to range for safety against float inaccuracies
    ranges.push(Math.floor(b + 1e-5) + 1);
  }

  const out = [];
  const x = new Array(n).fill(0);
  let visited = 0;
  
  const EPS = 1e-9;
  
  // A simple un-pruned recursive enumeration, or slightly pruned.
  // Since n=3 for ternary, it's small enough that a naive bounding loop is very fast.
  const rec = (j) => {
    if (j === n) {
      visited++;
      const r = coords(Pinv, x);
      let inBox = true;
      for (let i = 0; i < n; i++) {
        if (r[i].mod > c[i] + EPS) {
          inBox = false;
          break;
        }
      }
      if (inBox) {
        out.push([...x]);
      }
      return;
    }
    
    for (let val = -ranges[j]; val <= ranges[j]; val++) {
      x[j] = val;
      rec(j + 1);
    }
    x[j] = 0;
  };
  
  rec(0);
  
  // Sort or just return
  return { vectors: out, ranges, visited };
}

module.exports = { enumerateBoxNum };
