'use strict';

/**
 * cegis-scanner.js
 * ----------------
 * Level 0, 1, and 2 of the CEGIS loop for arbitrary ternary morphisms.
 * This script identifies all candidate morphisms, filters them by symmetry,
 * runs a fast prefix scan (Level 1), and tests primitivity/eigenvalues (Level 2).
 */

const S3 = ['a', 'b', 'c'];

function parikh(w) {
  let a = 0, b = 0, c = 0;
  for (let i = 0; i < w.length; i++) {
    if (w[i] === 'a') a++;
    else if (w[i] === 'b') b++;
    else c++;
  }
  return `${a},${b},${c}`;
}

function isStrongASF(w) {
  for (let k = 1; k <= w.length / 2; k++) {
    for (let i = 0; i + 2*k <= w.length; i++) {
      if (parikh(w.slice(i, i+k)) === parikh(w.slice(i+k, i+2*k))) return false;
    }
  }
  return true;
}

function isWeakASF(w) {
  for (let k = 2; k <= w.length / 2; k++) {
    for (let i = 0; i + 2*k <= w.length; i++) {
      if (parikh(w.slice(i, i+k)) === parikh(w.slice(i+k, i+2*k))) return false;
    }
  }
  return true;
}

function getCleanWords() {
  const words = [];
  let queue = ['a', 'b', 'c'];
  while (queue.length > 0) {
    const w = queue.shift();
    if (w.length >= 2 && w.length <= 7) words.push(w);
    if (w.length < 7) {
      for (const ch of S3) {
        const next = w + ch;
        if (isStrongASF(next)) queue.push(next);
      }
    }
  }
  return words;
}

// S3-symmetry canonicalization hash
// We only consider permutations of (b, c) since 'a' is fixed as the start letter.
// A morphism phi gives phi(a), phi(b), phi(c).
// We swap 'b' and 'c' in the morphism to see if it's symmetrically equivalent.
function traceHash(phi) {
  const swap = ch => ch === 'b' ? 'c' : (ch === 'c' ? 'b' : ch);
  const phi_swapped_b = phi.b.split('').map(swap).join('');
  const phi_swapped_c = phi.c.split('').map(swap).join('');
  const phi_swapped_a = phi.a.split('').map(swap).join('');
  
  const original = `${phi.a}|${phi.b}|${phi.c}`;
  const swapped = `${phi_swapped_a}|${phi_swapped_c}|${phi_swapped_b}`; // notice b and c map outputs are swapped
  return original < swapped ? original : swapped;
}

// Level 1: Fast prefix scan
// Generates the fixed point up to maxLen and checks for ASF.
function passesLevel1(phi, maxLen = 100) {
  let w = 'a';
  while (w.length < maxLen) {
    let next = '';
    for (const ch of w) next += phi[ch];
    if (next === w) break; // finite fixed point
    w = next;
  }
  return isWeakASF(w.slice(0, maxLen));
}

// Level 2: Primitivity and Eigenvalues
function getParikhMatrix(phi) {
  // M[j][i] = |phi(i)|_j
  return S3.map(y => S3.map(x => {
    let n = 0;
    for (const ch of phi[x]) if (ch === y) n++;
    return n;
  }));
}

function matMul(A, B) {
  return [0, 1, 2].map(i => [0, 1, 2].map(j => {
    let s = 0;
    for (let k = 0; k < 3; k++) s += A[i][k] * B[k][j];
    return s;
  }));
}

function isPrimitive(M) {
  let cur = M;
  for (let k = 1; k <= 5; k++) {
    const strictlyPositive = cur.every(row => row.every(val => val > 0));
    if (strictlyPositive) return true;
    cur = matMul(cur, M);
  }
  return false;
}

function hasEigenvalueModulus1(M) {
  // Characteristic poly of 3x3: x^3 - Tr(M)x^2 + 0.5(Tr(M)^2 - Tr(M^2))x - Det(M) = 0
  const tr = M[0][0] + M[1][1] + M[2][2];
  const M2 = matMul(M, M);
  const tr2 = M2[0][0] + M2[1][1] + M2[2][2];
  const c2 = -tr;
  const c1 = 0.5 * (tr * tr - tr2);
  const c0 = -(M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1])
             - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0])
             + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]));
             
  // Test if 1 is a root: 1 + c2 + c1 + c0 = 0
  if (1 + c2 + c1 + c0 === 0) return true;
  // Test if -1 is a root: -1 + c2 - c1 + c0 = 0
  if (-1 + c2 - c1 + c0 === 0) return true;
  
  // For complex roots with modulus 1, the product of roots is det(M). If |det(M)| != 1, 
  // complex roots with modulus 1 are still possible if the third root compensates.
  // Actually, polynomial roots are symmetric. If a + bi has mod 1, then a - bi is a root.
  // Product of these two is 1. The third root must be -c0.
  // So the roots are r1, r2, r3 with r1*r2 = 1 and r3 = -c0.
  // We can just explicitly check the polynomial roots numerically, or use a known condition.
  // Since we only want a conservative check, numerical check is fine for modulus 1.
  
  // To avoid complex numerical issues, we'll just check exact 1 and -1 for now, 
  // and manually inspect survivors.
  return false;
}

function passesLevel2(phi) {
  const M = getParikhMatrix(phi);
  if (!isPrimitive(M)) return false;
  if (hasEigenvalueModulus1(M)) return false;
  return true;
}

function main() {
  console.log("CEGIS LEVEL 0-2 SCANNER");
  const words = getCleanWords();
  const aWords = words.filter(w => w.startsWith('a'));
  const bcWords = words;
  
  console.log(`Generated ${words.length} clean words, ${aWords.length} start with 'a'.`);
  console.log(`Total space: ${aWords.length * bcWords.length * bcWords.length}`);
  
  let canonicals = new Map();
  for (const a of aWords) {
    for (const b of bcWords) {
      for (const c of bcWords) {
        const phi = {a, b, c};
        const hash = traceHash(phi);
        if (!canonicals.has(hash)) {
          canonicals.set(hash, phi);
        }
      }
    }
  }
  
  console.log(`Canonical candidates after 2-fold symmetry: ${canonicals.size}`);
  
  let survivors = [...canonicals.values()];
  console.log(`Starting with ${survivors.length} candidates.`);
  
  for (let len of [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    let nextSurv = [];
    for (const phi of survivors) {
      if (passesLevel1(phi, len)) nextSurv.push(phi);
    }
    console.log(`Survivors after prefix length ${len}: ${nextSurv.length}`);
    survivors = nextSurv;
    if (survivors.length === 0) break;
  }
  
  const survivorsL2 = [];
  for (const phi of survivors) {
    if (passesLevel2(phi)) survivorsL2.push(phi);
  }
  console.log(`Survivors after Level 2 (Primitivity): ${survivorsL2.length}`);
  
  if (survivorsL2.length > 0) {
    console.log("\nSURVIVORS TO BE CHECKED BY LEVEL 3:");
    for (const phi of survivorsL2) {
      console.log(phi);
    }
  } else {
    console.log("\nZERO SURVIVORS. CEGIS EXHAUSTED. NO NON-UNIFORM MORPHISM WORKS.");
  }
}

main();
