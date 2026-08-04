'use strict';

const fs = require('fs');
const { decideASF } = require('../src/decide-arbitrary-realizability.js');

const S3 = ['a', 'b', 'c'];

// 1. Generator: Proportional Parikh vectors
function* generateMorphisms() {
  // Base Parikh vectors (sum 2 or 3) that are not just single letters
  const baseVectors = [
    [1, 1, 0], [1, 0, 1], [0, 1, 1], // Sum 2
    [1, 1, 1], // Sum 3
    [2, 1, 0], [2, 0, 1], [1, 2, 0], [1, 0, 2], [0, 2, 1], [0, 1, 2] // Sum 3
  ];

  const multipliers = [1, 2, 3, 4, 5, 6]; // Lengths up to 12 if sum=2

  function* wordsWithParikh(v, currentWord = '') {
    if (v[0] === 0 && v[1] === 0 && v[2] === 0) {
      yield currentWord;
      return;
    }
    for (let i = 0; i < 3; i++) {
      if (v[i] > 0) {
        const nextV = [...v];
        nextV[i]--;
        yield* wordsWithParikh(nextV, currentWord + S3[i]);
      }
    }
  }

  for (const v of baseVectors) {
    const sum = v[0] + v[1] + v[2];
    for (const ka of multipliers) {
      for (const kb of multipliers) {
        for (const kc of multipliers) {
          if (ka * sum > 12 || kb * sum > 12 || kc * sum > 12) continue;
          
          // Generate all valid words for h(a), h(b), h(c)
          const waIter = [...wordsWithParikh([ka * v[0], ka * v[1], ka * v[2]])];
          const wbIter = [...wordsWithParikh([kb * v[0], kb * v[1], kb * v[2]])];
          const wcIter = [...wordsWithParikh([kc * v[0], kc * v[1], kc * v[2]])];

          for (const ha of waIter) {
            if (ha[0] !== 'a') continue; // Enforce starting with 'a' for fixed point
            
            // Fast abelian square check on ha, hb, hc individually
            if (hasAbelianSquare(ha)) continue;

            for (const hb of wbIter) {
              if (hasAbelianSquare(hb)) continue;
              for (const hc of wcIter) {
                if (hasAbelianSquare(hc)) continue;
                yield { a: ha, b: hb, c: hc };
              }
            }
          }
        }
      }
    }
  }
}

function hasAbelianSquare(w) {
  for (let len = 1; len <= Math.floor(w.length / 2); len++) {
    for (let i = 0; i <= w.length - 2 * len; i++) {
      const u = w.slice(i, i + len);
      const v = w.slice(i + len, i + 2 * len);
      if (isAbelianEq(u, v)) return true;
    }
  }
  return false;
}

function isAbelianEq(u, v) {
  const counts = { a: 0, b: 0, c: 0 };
  for (let i = 0; i < u.length; i++) {
    counts[u[i]]++;
    counts[v[i]]--;
  }
  return counts.a === 0 && counts.b === 0 && counts.c === 0;
}

// 2. Fast prefix scan
function fastPrefixScan(phi, maxLen) {
  let w = 'a';
  while (w.length < maxLen) {
    let next = '';
    for (const ch of w) next += phi[ch];
    if (next === w) break; // Infinite loop or finite fixed point
    w = next;
  }
  // Trim to maxLen
  w = w.slice(0, maxLen);
  return !hasAbelianSquare(w);
}

// Main CEGIS Loop
async function runCEGIS() {
  console.log('Starting Route A CEGIS Loop...');
  let totalGenerated = 0;
  let passedScan = 0;
  let passedDecision = 0;

  const generator = generateMorphisms();
  
  for (const phi of generator) {
    totalGenerated++;
    
    // Level 1: Fast Prefix Scan
    if (!fastPrefixScan(phi, 300)) {
      continue;
    }
    passedScan++;

    console.log(`\nCandidate passed scan: a->${phi.a}, b->${phi.b}, c->${phi.c}`);

    // Level 3: Decision Engine
    try {
      const result = decideASF(phi, S3);
      if (result.asf) {
        console.log('!!! ABELIAN-SQUARE-FREE MORPHISM FOUND !!!');
        console.log(phi);
        passedDecision++;
        fs.appendFileSync('ROUTE_A_SUCCESS.txt', JSON.stringify(phi) + '\n');
        break; // Stop on first success for now
      } else {
        console.log(`Counterexample found: ${result.counterexample.word}`);
      }
    } catch (err) {
      console.log(`Decision error for a->${phi.a}: ${err.message}`);
    }
  }

  console.log(`\nCEGIS Run Complete.`);
  console.log(`Total Generated: ${totalGenerated}`);
  console.log(`Passed Scan: ${passedScan}`);
  console.log(`Proven ASF: ${passedDecision}`);
}

runCEGIS().catch(console.error);
