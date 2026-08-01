'use strict';

/**
 * parikh-block-filter.js
 * -----------------------
 * RECONSTRUCTION, 2026-08-01 (second attempt in this handoff). The original
 * script that produced MATH_CLAIMS.md row 80's numbers (320,352 survivors at
 * 903 differences; 295,836 at 6,779 differences) was lost when the session
 * that wrote it was interrupted before committing. This is a fresh
 * independent implementation of the SAME reduction described in row 80's
 * text, not a restoration of the original code. Its own numbers are
 * therefore a new measurement, cross-checked against row 80's reported
 * figures as a regression target, not assumed to reproduce them exactly.
 *
 * THE REDUCTION (row 80, quoted): "if an abelian square starts at a block
 * boundary and has half-length K = mL, both halves are whole runs of m
 * blocks, so the square exists iff M_g . d = 0", where M_g is the 3x6
 * matrix whose column j is Psi(g(letter j)) in Z^3 (composition of L into
 * 3 parts) and d = Psi(h6[b..b+m)) - Psi(h6[b+m..b+2m)) in Z^6.
 *
 * A candidate g (assignment of one composition-of-L profile to each of the
 * 6 letters a..f) is ELIMINATED if M_g . d = 0 for ANY tested difference d
 * (a block-aligned square is then guaranteed to exist). It SURVIVES the
 * filter if M_g . d != 0 for every tested d -- survival is NOT proof of
 * avoidance (row 82: non-aligned squares are invisible to this method by
 * construction), only "not eliminated by this necessary condition".
 *
 * METHOD: meet-in-the-middle per difference d. Split the 6 letters into
 * {a,b,c} and {d,e,f}. For each d, the 15^3 = 3,375 partial sums over each
 * half are precomputed; M_g.d = 0 iff the two halves' partial sums are
 * exact negatives. This turns an O(15^6 x |diffs|) computation into
 * O(15^3 x |diffs|), letting the search run in seconds instead of hours.
 *
 * POSITIVE CONTROL: g3 (L=10, from morphisms.js, Theorem 9) must survive
 * every tested difference, because Theorem 9 proves g3(h6^omega(a)) has no
 * abelian square of period > 5 at all -- so in particular no block-aligned
 * one. The script refuses to report anything if this control fails.
 *
 * Usage: node scripts/parikh-block-filter.js [L] [mMax] [--out=file]
 */

const path = require('path');
const fs = require('fs');
const { H6, G3 } = require('../src/morphisms.js');

const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
const S3 = ['a', 'b', 'c'];

function h6Power(n) {
  let w = 'a';
  for (let i = 0; i < n; i++) {
    let next = '';
    for (const c of w) next += H6[c];
    w = next;
  }
  return w;
}

/** All compositions of L into 3 non-negative parts, as [na,nb,nc]. */
function compositions(L) {
  const out = [];
  for (let na = 0; na <= L; na++) {
    for (let nb = 0; nb <= L - na; nb++) {
      out.push([na, nb, L - na - nb]);
    }
  }
  return out;
}

/** Parikh vector (over S3) of a string. */
function parikh3(word) {
  const v = [0, 0, 0];
  for (const ch of word) v[S3.indexOf(ch)]++;
  return v;
}

/**
 * Distinct Parikh differences d(b,m) = Psi(w[b..b+m)) - Psi(w[b+m..b+2m))
 * over Z^6 (alphabet a..f), for m = 2..mMax, taken from w = h6^n(a).
 */
function collectDifferences(w, mMax) {
  const prefix = Array.from({ length: w.length + 1 }, () => null);
  prefix[0] = new Int32Array(6);
  for (let i = 0; i < w.length; i++) {
    const v = prefix[i].slice();
    v[S6.indexOf(w[i])]++;
    prefix[i + 1] = v;
  }
  const span = (i, j) => {
    const a = prefix[i], b = prefix[j];
    const r = new Int32Array(6);
    for (let k = 0; k < 6; k++) r[k] = b[k] - a[k];
    return r;
  };
  const seen = new Map();
  for (let m = 2; m <= mMax; m++) {
    for (let b = 0; b + 2 * m <= w.length; b++) {
      const d1 = span(b, b + m);
      const d2 = span(b + m, b + 2 * m);
      const d = new Int32Array(6);
      let allZero = true;
      for (let k = 0; k < 6; k++) { d[k] = d1[k] - d2[k]; if (d[k] !== 0) allZero = false; }
      if (allZero) {
        throw new Error(`All-zero difference at b=${b}, m=${m}: h6^omega itself would contain a block-level abelian square, contradicting row 5. Refusing to continue.`);
      }
      seen.set(d.join(','), d);
    }
  }
  return Array.from(seen.values());
}

/** M_g . d for a specific candidate assignment (array of 6 profile-index refs into `profiles`). */
function applyMgD(profiles, assignment, d) {
  const r = [0, 0, 0];
  for (let j = 0; j < 6; j++) {
    const col = profiles[assignment[j]];
    const dj = d[j];
    if (dj === 0) continue;
    r[0] += col[0] * dj; r[1] += col[1] * dj; r[2] += col[2] * dj;
  }
  return r;
}

function runFilter(L, mMax, iterN) {
  const w = h6Power(iterN);
  console.log(`h6^${iterN}(a): ${w.length} symbols`);

  const diffs = collectDifferences(w, mMax);
  console.log(`distinct differences (m=2..${mMax}): ${diffs.length}`);

  const profiles = compositions(L); // length D = C(L+2,2)
  const D = profiles.length;
  console.log(`L=${L}: per-letter domain size D=${D}, full matrix space D^6=${D ** 6}`);

  // ---- Positive control: g3 must survive every difference -----------------
  const mg3 = S6.map(l => parikh3ForG3(l));
  function parikh3ForG3(letter) {
    // g3 is length-10 per letter; project onto {a,b,c} counts directly.
    const v = [0, 0, 0];
    for (const ch of G3[letter]) v[S3.indexOf(ch)]++;
    return v;
  }
  for (const d of diffs) {
    const r = [0, 0, 0];
    for (let j = 0; j < 6; j++) {
      const dj = d[j]; if (dj === 0) continue;
      r[0] += mg3[j][0] * dj; r[1] += mg3[j][1] * dj; r[2] += mg3[j][2] * dj;
    }
    if (r[0] === 0 && r[1] === 0 && r[2] === 0) {
      throw new Error('POSITIVE CONTROL FAILED: g3 was eliminated by the filter, contradicting Theorem 9. Refusing to report survivors.');
    }
  }
  console.log('positive control: g3 survives every tested difference (as required by Theorem 9). OK.');

  // ---- Meet-in-the-middle over all candidate matrices ----------------------
  const H1 = [0, 1, 2]; // a,b,c
  const H2 = [3, 4, 5]; // d,e,f
  const D3 = D * D * D;
  const eliminated = new Uint8Array(D ** 6);

  const t0 = Date.now();
  for (const d of diffs) {
    // Partial sums over H1: index -> [x,y,z]
    const map = new Map();
    let idx = 0;
    for (let i0 = 0; i0 < D; i0++) {
      const c0 = profiles[i0], d0 = d[H1[0]];
      for (let i1 = 0; i1 < D; i1++) {
        const c1 = profiles[i1], d1 = d[H1[1]];
        for (let i2 = 0; i2 < D; i2++) {
          const c2 = profiles[i2], d2 = d[H1[2]];
          const x = c0[0] * d0 + c1[0] * d1 + c2[0] * d2;
          const y = c0[1] * d0 + c1[1] * d1 + c2[1] * d2;
          const z = c0[2] * d0 + c1[2] * d1 + c2[2] * d2;
          const key = x + ',' + y + ',' + z;
          let arr = map.get(key);
          if (!arr) { arr = []; map.set(key, arr); }
          arr.push(idx);
          idx++;
        }
      }
    }
    idx = 0;
    for (let i3 = 0; i3 < D; i3++) {
      const c3 = profiles[i3], d3 = d[H2[0]];
      for (let i4 = 0; i4 < D; i4++) {
        const c4 = profiles[i4], d4 = d[H2[1]];
        for (let i5 = 0; i5 < D; i5++) {
          const c5 = profiles[i5], d5 = d[H2[2]];
          const x = c3[0] * d3 + c4[0] * d4 + c5[0] * d5;
          const y = c3[1] * d3 + c4[1] * d4 + c5[1] * d5;
          const z = c3[2] * d3 + c4[2] * d4 + c5[2] * d5;
          const targetKey = (-x) + ',' + (-y) + ',' + (-z);
          const matches = map.get(targetKey);
          if (matches) {
            const base2 = (i3 * D + i4) * D + i5;
            for (const h1idx of matches) {
              const full = h1idx * D3 + base2;
              eliminated[full] = 1;
            }
          }
          idx++;
        }
      }
    }
  }
  const elapsedS = (Date.now() - t0) / 1000;

  let survivors = 0;
  const total = D ** 6;
  for (let i = 0; i < total; i++) if (!eliminated[i]) survivors++;

  console.log(`filter ran in ${elapsedS.toFixed(1)}s`);
  console.log(`survivors: ${survivors} / ${total} (${(100 * survivors / total).toFixed(2)}%)`);

  return { L, mMax, iterN, D, profiles, diffCount: diffs.length, total, survivors, eliminated, elapsedS };
}

function multinomial4(profile) {
  const fact = [1, 1, 2, 6, 24];
  const [na, nb, nc] = profile;
  return fact[profile.reduce((a, b) => a + b, 0)] / (fact[na] * fact[nb] * fact[nc]);
}

function main() {
  const args = process.argv.slice(2);
  const L = parseInt(args[0] || '4', 10);
  const mMax = parseInt(args[1] || '120', 10);
  const iterN = parseInt(args[2] || '9', 10);
  const outArg = args.find(a => a.startsWith('--out='));
  const outFile = outArg ? outArg.split('=')[1] : path.join(__dirname, '..', 'scratch', `s_large_l${L}_survivors.json`);

  const result = runFilter(L, mMax, iterN);

  // Extract survivor assignments (as 6 indices into `profiles`) and their
  // string-coding counts (multinomial per letter, product across letters).
  const D = result.D;
  const D3 = D * D * D;
  const survivorList = [];
  let totalStringCodings = 0;
  const multi = result.profiles.map(multinomial4);
  for (let full = 0; full < result.total; full++) {
    if (result.eliminated[full]) continue;
    const i0 = Math.floor(full / (D3 * D * D));
    let rem = full % (D3 * D * D);
    const i1 = Math.floor(rem / (D3 * D));
    rem = rem % (D3 * D);
    const i2 = Math.floor(rem / D3);
    rem = rem % D3;
    const i3 = Math.floor(rem / (D * D));
    rem = rem % (D * D);
    const i4 = Math.floor(rem / D);
    const i5 = rem % D;
    const assignment = [i0, i1, i2, i3, i4, i5];
    survivorList.push(assignment);
    totalStringCodings += multi[i0] * multi[i1] * multi[i2] * multi[i3] * multi[i4] * multi[i5];
  }

  console.log(`total concrete string codings consistent with survivors: ${totalStringCodings}`);

  const out = {
    generatedAt: new Date().toISOString(),
    note: 'Independent reconstruction of MATH_CLAIMS.md row 80/82\'s Parikh-block filter (original script lost). Not a restoration -- a fresh computation. Cross-check against row 80/82 figures before trusting for any claim.',
    L: result.L, mMax: result.mMax, iterN: result.iterN,
    diffCount: result.diffCount,
    domainSize: D,
    profiles: result.profiles,
    totalMatrices: result.total,
    survivorCount: result.survivors,
    totalStringCodings,
    elapsedS: result.elapsedS,
    survivors: survivorList
  };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(out));
  console.log(`written: ${outFile}`);
}

if (require.main === module) main();

module.exports = { h6Power, compositions, collectDifferences, applyMgD, multinomial4 };
