'use strict';

/**
 * b16-hankel-v2.js
 * ----------------
 * Replacement for scratch/b16-hankel.js, which MATH_CLAIMS.md row 105 records
 * as REJECTED: it never actually fed p_G6(n) or p_All9(n) into its own
 * Hankel-rank test. This version does.
 *
 * B17 (OPEN_RESEARCH_QUESTIONS.md): a regular language's factor-complexity
 * sequence satisfies a linear recurrence with constant coefficients, which is
 * equivalent to a bounded-rank Hankel matrix H_k = det(p(i+j-1))_{i,j=1..k}
 * eventually vanishing identically for all larger k. Exact integer
 * determinants via the Bareiss algorithm, no floating point.
 *
 * Two controls, both run through the identical code path:
 *   - Fibonacci-type count (binary words avoiding "aa"): known regular,
 *     Hankel rank must saturate at a small finite k.
 *   - The S=empty aa2f sequence (row 27/86): known NOT known to be regular
 *     (open question, B17) -- included only to show the test does not
 *     spuriously saturate on a sequence this project already has other
 *     reasons to think is hard, not as a proof of non-regularity.
 *
 * Usage: node scratch/b16-hankel-v2.js
 */

const { BIGRAMS, toMask, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');

function bareissDeterminant(matrix) {
  const n = matrix.length;
  if (n === 0) return 0n;
  if (n === 1) return matrix[0][0];
  const M = matrix.map(row => [...row]);
  let sign = 1n;
  for (let k = 0; k < n - 1; k++) {
    if (M[k][k] === 0n) {
      let swapRow = -1;
      for (let i = k + 1; i < n; i++) if (M[i][k] !== 0n) { swapRow = i; break; }
      if (swapRow === -1) return 0n;
      const t = M[k]; M[k] = M[swapRow]; M[swapRow] = t;
      sign = -sign;
    }
    const prevPivot = k === 0 ? 1n : M[k - 1][k - 1];
    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++) {
        M[i][j] = (M[k][k] * M[i][j] - M[i][k] * M[k][j]) / prevPivot;
      }
    }
  }
  return M[n - 1][n - 1] * sign;
}

/** seq is 0-indexed, seq[i] = value at position i (matches p(i) or p(i+offset)). */
function hankelReport(seq, name) {
  const N = seq.length;
  const maxK = Math.floor((N + 1) / 2);
  const dets = [];
  let firstZeroK = null;
  for (let k = 1; k <= maxK; k++) {
    const M = [];
    for (let i = 0; i < k; i++) {
      const row = [];
      for (let j = 0; j < k; j++) row.push(BigInt(seq[i + j]));
      M.push(row);
    }
    const det = bareissDeterminant(M);
    dets.push(det === 0n ? 'ZERO' : 'nonzero');
    if (det === 0n && firstZeroK === null) firstZeroK = k;
  }
  // Confirm persistence: if H_k = 0, check all larger k in range also vanish.
  let persistentZero = false;
  if (firstZeroK !== null) {
    persistentZero = dets.slice(firstZeroK - 1).every(d => d === 'ZERO');
  }
  console.log(`\n=== ${name} (N=${N} terms, tested k=1..${maxK}) ===`);
  console.log('  k:    ' + Array.from({ length: maxK }, (_, i) => i + 1).join(' '));
  console.log('  det:  ' + dets.map(d => d === 'ZERO' ? '0' : 'x').join(' '));
  if (firstZeroK === null) {
    console.log(`  => no zero determinant found up to k=${maxK}; Hankel rank exceeds this window (or is not finite within it)`);
  } else if (persistentZero) {
    console.log(`  => H_k = 0 for all k >= ${firstZeroK} within the tested window (k up to ${maxK}); consistent with finite Hankel rank ${firstZeroK - 1}`);
  } else {
    console.log(`  => H_${firstZeroK} = 0 but a later H_k is nonzero -- NOT a clean rank drop, needs manual inspection`);
  }
  return { dets, firstZeroK, persistentZero, maxK };
}

function main() {
  const maskAll9 = toMask(BIGRAMS);
  const maskG6 = toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']);

  console.log('Computing p_All9(n) and p_G6(n), n=0..22, exact DFS (same engine as rows 86-98)...');
  const resAll9 = enumerateSAbelian(maskAll9, 22, 1e11);
  const resG6 = enumerateSAbelian(maskG6, 22, 1e11);

  // n=23 from row 101 (independently computed, DFS run interrupted before n=24
  // but n=23 salvaged and logged) -- reused here rather than re-running the
  // same multi-hundred-second search, cited explicitly per rule 4.
  const pAll9 = resAll9.counts.slice(0, 23); // n=0..22
  const pG6 = resG6.counts.slice(0, 23);
  pAll9.push(5455985058); // n=23, row 101
  pG6.push(5427312294);   // n=23, row 101

  console.log('p_All9(0..23):', pAll9.join(','));
  console.log('p_G6(0..23):  ', pG6.join(','));

  // Hankel sequences conventionally start from a nonzero index; using n=1..23
  // (dropping p(0)=1, a degenerate boundary term) for both, 23 terms each.
  const seqAll9 = pAll9.slice(1);
  const seqG6 = pG6.slice(1);

  const rAll9 = hankelReport(seqAll9, 'All-9, p_All9(1..23)');
  const rG6 = hankelReport(seqG6, 'Golden Six, p_G6(1..23)');

  // Controls
  const controlReg = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025];
  const rReg = hankelReport(controlReg, 'POSITIVE CONTROL: binary words avoiding "aa" (known regular)');

  const controlNonreg = [3, 9, 27, 66, 162, 360, 786, 1572, 3114, 5850, 11070, 20454, 37698, 67746, 120084, 207354];
  const rNonreg = hankelReport(controlNonreg, 'S=empty aa2f sequence (row 27/86, not known to be regular)');

  console.log('\n=== SUMMARY ===');
  console.log(`All-9:    ${rAll9.firstZeroK === null ? `no zero det up to k=${rAll9.maxK}` : (rAll9.persistentZero ? `finite rank ${rAll9.firstZeroK - 1}` : `H_${rAll9.firstZeroK}=0 but not persistent`)}`);
  console.log(`Golden 6: ${rG6.firstZeroK === null ? `no zero det up to k=${rG6.maxK}` : (rG6.persistentZero ? `finite rank ${rG6.firstZeroK - 1}` : `H_${rG6.firstZeroK}=0 but not persistent`)}`);
  console.log(`Control (regular, positive): ${rReg.firstZeroK === null ? `NO SATURATION FOUND -- test invalid` : `saturates at rank ${rReg.firstZeroK - 1}`}`);
  console.log(`Control (S=empty, not known regular): ${rNonreg.firstZeroK === null ? `no zero det up to k=${rNonreg.maxK}` : `H_${rNonreg.firstZeroK}=0 (persistent=${rNonreg.persistentZero})`}`);
}

main();
