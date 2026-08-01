'use strict';

/**
 * step1_string_level.js
 * -----------------------
 * Step 1's FIFTH attempt at pinning L* = min{ L : S_large(L) > 0 } (see
 * NEXT_STEP.md's 2026-08-01 handoff). The first three attempts (raw DFS
 * twice, a bounded-Kmax CSP) failed to finish at L=4. The fourth, algebraic
 * attempt (row 80/82, reconstructed in `parikh-block-filter.js` after the
 * original script was lost) is CLOSED as a general method: it cannot decide
 * non-block-aligned squares, only block-aligned ones. What it DID produce is
 * a 38.6x-reduced candidate set: 295,836 surviving Parikh-profile matrices,
 * corresponding to 2,331,710,688 concrete string codings (out of the full
 * 81^6 = 282,429,536,481) -- a defined, finite, but still very large task.
 *
 * WHAT THIS SCRIPT DOES, PRECISELY: seeds a string-level abelian-square
 * check (a "drop oracle": stop building a candidate's image the moment a
 * violation for ANY K in [minK,maxK] is found) with ONLY the codings
 * consistent with a Parikh-filter survivor -- not a fresh raw enumeration,
 * which NEGATIVE_RESULTS.md SS14 forbids as a fifth search variant.
 *
 * SAFETY: this script does NOT run the full 2.33 billion candidates by
 * default. `--sample N` measures wall-clock time on the first N concrete
 * candidates (drawn across survivors, not just the first survivor) and
 * extrapolates. Only `--full` runs everything, and it prints the
 * extrapolate-first estimate before starting regardless.
 *
 * Usage:
 *   node scripts/step1_string_level.js --sample 20000 [--minK 6] [--maxK 40] [--iterN 6]
 *   node scripts/step1_string_level.js --full [--minK 6] [--maxK 40] [--iterN 6]
 */

const fs = require('fs');
const path = require('path');
const { H6 } = require('../src/morphisms.js');

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];

function h6Power(n) {
  let w = 'a';
  for (let i = 0; i < n; i++) {
    let next = '';
    for (const c of w) next += H6[c];
    w = next;
  }
  return w;
}

/** All 81 ternary strings of length 4, grouped by their (na,nb,nc) profile key. */
function buildRealizationTable() {
  const table = new Map();
  const chars = ['a', 'b', 'c'];
  for (let i0 = 0; i0 < 3; i0++)
    for (let i1 = 0; i1 < 3; i1++)
      for (let i2 = 0; i2 < 3; i2++)
        for (let i3 = 0; i3 < 3; i3++) {
          const s = chars[i0] + chars[i1] + chars[i2] + chars[i3];
          const na = (s.match(/a/g) || []).length;
          const nb = (s.match(/b/g) || []).length;
          const nc = 4 - na - nb;
          const key = na + ',' + nb + ',' + nc;
          let arr = table.get(key);
          if (!arr) { arr = []; table.set(key, arr); }
          arr.push(s);
        }
  return table;
}

/**
 * Drop-oracle check: does `image` contain an abelian square with half-length
 * K in [minK, maxK]? Scans left to right, checking only squares that END at
 * the current position (so every square is tested exactly once), and
 * returns as soon as one is found -- the "drop" the DFS was named for.
 * Kept for use on a fully materialized string (e.g. self-tests).
 */
function findAbelianSquare(image, minK, maxK) {
  const len = image.length;
  const pa = new Int32Array(len + 1), pb = new Int32Array(len + 1);
  for (let i = 0; i < len; i++) {
    const ch = image[i];
    pa[i + 1] = pa[i] + (ch === 'a' ? 1 : 0);
    pb[i + 1] = pb[i] + (ch === 'b' ? 1 : 0);
  }
  for (let e = 2 * minK; e <= len; e++) {
    const kMax = Math.min(maxK, Math.floor(e / 2));
    for (let K = minK; K <= kMax; K++) {
      const s = e - 2 * K, m = e - K;
      if ((pa[m] - pa[s]) !== (pa[e] - pa[m])) continue;
      if ((pb[m] - pb[s]) !== (pb[e] - pb[m])) continue;
      // third letter's counts follow automatically (both halves length K)
      return { violated: true, K, pos: s };
    }
  }
  return { violated: false };
}

/**
 * Incremental version: appends `image` onto reusable prefix-sum scratch
 * buffers (pa, pb, sized for the caller's max needed length) and checks
 * only the NEW positions as they are appended, returning as soon as a
 * square is found -- so a candidate that dies at symbol 70 never pays for
 * building or scanning symbols 71..972. `pa`/`pb` are 1-indexed prefix
 * arrays (pa[0]=0); `startLen` is how many symbols are already valid in
 * them (0 for a fresh candidate).
 */
function extendAndCheck(pa, pb, startLen, image, minK, maxK) {
  let len = startLen;
  for (let i = 0; i < image.length; i++) {
    const ch = image[i];
    len++;
    pa[len] = pa[len - 1] + (ch === 'a' ? 1 : 0);
    pb[len] = pb[len - 1] + (ch === 'b' ? 1 : 0);
    if (len < 2 * minK) continue;
    const kMax = Math.min(maxK, Math.floor(len / 2));
    for (let K = minK; K <= kMax; K++) {
      const s = len - 2 * K, m = len - K;
      if ((pa[m] - pa[s]) !== (pa[len] - pa[m])) continue;
      if ((pb[m] - pb[s]) !== (pb[len] - pb[m])) continue;
      return { violated: true, K, pos: s, len };
    }
  }
  return { violated: false, len };
}

/** Generator over concrete codings for one survivor tuple, letters a..f in order. */
function* realizationsFor(assignment, profiles, table) {
  const perLetter = assignment.map(pi => table.get(profiles[pi].join(',')));
  const idx = new Array(6).fill(0);
  while (true) {
    yield perLetter.map((arr, j) => arr[idx[j]]);
    let k = 5;
    while (k >= 0) {
      idx[k]++;
      if (idx[k] < perLetter[k].length) break;
      idx[k] = 0; k--;
    }
    if (k < 0) return;
  }
}

function buildImage(gArr, w) {
  const parts = new Array(w.length);
  for (let i = 0; i < w.length; i++) parts[i] = gArr[S6.indexOf(w[i])];
  return parts.join('');
}

function main() {
  const args = process.argv.slice(2);
  const get = (flag, def) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : def;
  };
  const sampleN = args.includes('--full') ? Infinity : parseInt(get('--sample', '20000'), 10);
  const minK = parseInt(get('--minK', '6'), 10);
  const maxK = parseInt(get('--maxK', '40'), 10);
  const iterN = parseInt(get('--iterN', '6'), 10);
  const survivorFile = get('--survivors', path.join(__dirname, '..', 'scratch', 's_large_l4_survivors.json'));

  console.log(`loading survivors from ${survivorFile}`);
  const data = JSON.parse(fs.readFileSync(survivorFile, 'utf8'));
  console.log(`${data.survivorCount} survivor Parikh profiles, ${data.totalStringCodings} concrete string codings total`);

  const w = h6Power(iterN);
  console.log(`h6^${iterN}(a): ${w.length} blocks -> image length ${w.length * 4} symbols at L=4`);
  console.log(`checking K in [${minK}, ${maxK}] (needs >= ${2 * maxK} symbols; have ${w.length * 4})`);
  if (w.length * 4 < 2 * maxK) throw new Error('iterN too small for the requested maxK -- increase --iterN.');

  const table = buildRealizationTable();
  const maxLen = w.length * 4;
  const pa = new Int32Array(maxLen + 1), pb = new Int32Array(maxLen + 1);

  let tested = 0;
  let violated = 0;
  let survivedOracle = 0; // candidates that passed the FULL check -- would be a major finding
  let violationLenSum = 0; // for reporting how early violations typically hit
  const t0 = Date.now();

  outer:
  for (const assignment of data.survivors) {
    for (const gArr of realizationsFor(assignment, data.profiles, table)) {
      if (tested >= sampleN) break outer;
      pa[0] = 0; pb[0] = 0;
      let result = { violated: false, len: 0 };
      for (let i = 0; i < w.length; i++) {
        const block = gArr[S6.indexOf(w[i])];
        result = extendAndCheck(pa, pb, result.len, block, minK, maxK);
        if (result.violated) break;
      }
      tested++;
      if (result.violated) { violated++; violationLenSum += result.len; }
      else {
        survivedOracle++;
        const gMap = {}; S6.forEach((l, j) => gMap[l] = gArr[j]);
        console.log(`*** ORACLE SURVIVOR (no K in [${minK},${maxK}] square found): g = ${JSON.stringify(gMap)}`);
      }
    }
  }
  if (violated > 0) console.log(`mean length at first violation: ${(violationLenSum / violated).toFixed(1)} symbols (of ${maxLen} available)`);
  const elapsedS = (Date.now() - t0) / 1000;
  const nsPerCandidate = tested > 0 ? (elapsedS * 1e9) / tested : NaN;

  console.log('');
  console.log(`tested: ${tested}`);
  console.log(`violated (eliminated): ${violated}`);
  console.log(`survived this oracle (K in [${minK},${maxK}] only -- NOT proof of full avoidance): ${survivedOracle}`);
  console.log(`elapsed: ${elapsedS.toFixed(2)}s, ${nsPerCandidate.toFixed(0)} ns/candidate`);

  if (sampleN !== Infinity) {
    const totalCandidates = data.totalStringCodings;
    const estTotalS = (nsPerCandidate * totalCandidates) / 1e9;
    console.log('');
    console.log(`EXTRAPOLATION to the full ${totalCandidates} candidates:`);
    console.log(`  estimated total time: ${estTotalS.toFixed(0)}s = ${(estTotalS / 3600).toFixed(2)}h = ${(estTotalS / 86400).toFixed(2)} days`);
    console.log(`  (measured on a sample of ${tested}; NEXT_STEP.md's own lesson -- a sample`);
    console.log(`   underestimated the true rate twice before, at k=5 and k=6 additive runs --`);
    console.log(`   so treat this as a lower bound on the true time, not a promise.)`);
  }
}

if (require.main === module) main();

module.exports = { h6Power, buildRealizationTable, findAbelianSquare, extendAndCheck, realizationsFor };
