'use strict';

const math = require('mathjs');

/**
 * Bounds calculation using numerical diagonalisation.
 * For an arbitrary ternary morphism.
 */

function imageWordSets(phi, alphabet) {
  const suffixes = new Set(['']);
  const prefixes = new Set(['']);
  const factors = new Set(['']);
  for (const a of alphabet) {
    const img = phi[a];
    for (let i = 0; i <= img.length; i++) {
      prefixes.add(img.slice(0, i));
      suffixes.add(img.slice(i));
      for (let j = i; j <= img.length; j++) factors.add(img.slice(i, j));
    }
  }
  return {
    suffixes: [...suffixes].sort(),
    prefixes: [...prefixes].sort(),
    factors: [...factors].sort()
  };
}

const psi = (w, alphabet) => {
  const v = new Array(alphabet.length).fill(0);
  for (let i = 0; i < w.length; i++) {
    const idx = alphabet.indexOf(w[i]);
    if (idx !== -1) v[idx]++;
  }
  return v;
};

// Evaluate the coordinate r_i(x) using Pinv
const coords = (Pinv, v) => {
  const r = new Array(Pinv.length).fill(0);
  for (let i = 0; i < Pinv.length; i++) {
    let re = 0, im = 0;
    for (let j = 0; j < v.length; j++) {
      const p = Pinv[i][j];
      if (typeof p === 'object' && p !== null && p.re !== undefined) {
        re += p.re * v[j];
        im += p.im * v[j];
      } else {
        re += p * v[j];
      }
    }
    r[i] = { re, im, mod: Math.sqrt(re*re + im*im) };
  }
  return r;
};

/**
 * Calculate the bound c_i for a contracting eigenvalue (modulus < 1)
 */
function contractingBoundNum(eig, Pinv, sets, alphabet) {
  // Since we assume diagonalizability, the block B is just [lambda].
  // So ||B^j|| = |lambda|^j.
  // sum_{j>=0} ||B^j|| = 1 / (1 - |lambda|)
  // max_{j>=0} ||B^j|| = 1 (at j=0)
  
  if (eig.modulus >= 1) throw new Error('Not a contracting eigenvalue');
  
  const sumN = 1 / (1 - eig.modulus);
  const maxN = 1;
  
  const i = eig.index;
  const rowCoordMod = (w) => coords(Pinv, psi(w, alphabet))[i].mod;
  
  const maxOver = (words) => {
    let best = 0;
    for (const w of words) {
      const c = rowCoordMod(w);
      if (c > best) best = c;
    }
    return best;
  };
  
  const pairs = [];
  for (const s of sets.suffixes) for (const p of sets.prefixes) pairs.push(s + p);
  
  return sumN * maxOver(pairs) + maxN * maxOver(sets.factors);
}

/**
 * Calculate the bound c_i for an expanding eigenvalue (modulus > 1)
 */
function expandingBoundNum(eig, Pinv, sets, alphabet) {
  // B is [lambda]. B^{-m} has eigenvalue 1/lambda.
  // ||B^{-m}|| = (1 / |lambda|)^m
  // sum_{m>=1} ||B^{-m}|| = (1/|lambda|) / (1 - 1/|lambda|) = 1 / (|lambda| - 1)
  
  if (eig.modulus <= 1) throw new Error('Not an expanding eigenvalue');
  
  const geom = 1 / (eig.modulus - 1);
  
  const i = eig.index;
  const rowCoord = (w) => coords(Pinv, psi(w, alphabet))[i]; // need complex values for difference
  
  const pairs = [];
  for (const s of sets.suffixes) for (const p of sets.prefixes) pairs.push(s + p);
  
  // D_i = max_{s,p,s',p'} |r_i(s'p') - r_i(sp)|
  // Since r_i is complex, we just compute all points and find the max distance between any two.
  const points = [];
  for (const w of pairs) points.push(rowCoord(w));
  
  let D = 0;
  for (let a = 0; a < points.length; a++) {
    for (let b = 0; b < points.length; b++) {
      const dre = points[a].re - points[b].re;
      const dim = points[a].im - points[b].im;
      const dist = Math.sqrt(dre*dre + dim*dim);
      if (dist > D) D = dist;
    }
  }
  
  return geom * D;
}

module.exports = { imageWordSets, psi, coords, contractingBoundNum, expandingBoundNum };
