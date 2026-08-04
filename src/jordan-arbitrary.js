'use strict';

const math = require('mathjs');

/**
 * Numerically compute the eigendecomposition of a 3x3 matrix M.
 * Returns { P, Pinv, eigenvalues }.
 * Assumes the matrix is diagonalizable.
 */
function decompose(M) {
  const ans = math.eigs(M);
  const eigenvalues = ans.values;
  const vectors = []; // math.eigs returns eigenvectors as array of { value, vector }
  for (const ev of ans.eigenvectors) {
    vectors.push(ev.vector);
  }
  
  // Format as native arrays. mathjs returns eigenvectors as rows of P^T or P depending on version, 
  // actually 'vector' is the column vector but push adds it as a row. We need vectors to be columns.
  const P = math.transpose(vectors);
  
  // Check diagonalizability/invertibility
  let Pinv;
  try {
    Pinv = math.inv(P); 
    const det = math.det(P);
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is nearly singular (defective).');
    }
  } catch (e) {
    throw new Error('Matrix is not invertible or defective.');
  }

  // Parse eigenvalues into simple objects
  const parsedEigs = [];
  for (let i = 0; i < eigenvalues.length; i++) {
    const val = eigenvalues[i];
    let re = val, im = 0;
    if (typeof val === 'object' && val.re !== undefined) {
      re = val.re;
      im = val.im;
    }
    const modulus = Math.sqrt(re * re + im * im);
    parsedEigs.push({ index: i, re, im, modulus });
  }

  return { P: math.matrix(P).toArray(), Pinv: math.matrix(Pinv).toArray(), eigenvalues: parsedEigs };
}

module.exports = { decompose };
