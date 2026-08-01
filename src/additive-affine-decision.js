'use strict';

/**
 * additive-affine-decision.js
 * ----------------------------
 * A decision procedure for additive k-power-freeness of affine morphic words.
 *
 * THEOREM 2.4, verbatim (Andrade & Mol, "Avoiding abelian and additive powers
 * in rich words", arXiv:2408.15390, fetched 2026-07-30, attributed there to
 * Currie, Mol, Rampersad & Shallit, arXiv:2111.07857):
 *   "Let f:X*->X* be a strictly growing affine morphism such that f is
 *    prolongable on a. If Mf is invertible and every eigenvalue lambda of Mf
 *    satisfies |lambda|>1, then it is possible to decide whether or not
 *    f^omega(a) is additive k-power-free."
 * Affine means: for all x in X, |f(x)| = a+bx and sum f(x) = c+dx, with
 * Mf = [[a,b],[c,d]]. See MATH_CLAIMS.md row 72.
 *
 * WHAT THIS IS
 * ------------
 * A line-by-line port of the reference implementation, not a re-derivation:
 * github.com/lgmol/Additive-Powers-Decision-Algorithm, "Additive k-power
 * Algorithm.py" (555 lines, fetched in full via curl 2026-07-30, since a
 * summarizing fetch had silently dropped the exact case studies once
 * already -- see MATH_CLAIMS.md row 73's correction). Function names below
 * track the Python source (Parents, AncestorsPure/Outer, MainPure/Outer) so
 * the port can be checked against it directly rather than trusted on faith.
 *
 * VALIDATION
 * ----------
 * selfTest() below runs the source script's own five case studies verbatim
 * and requires all five to return true. The largest (CMRS 2021, MainOuter)
 * additionally asserts the exact intermediate ancestor counts the paper's
 * own proof reports: 17,056 initial h-parents, 48 new in one generation,
 * 17,104 total. Matching those exact numbers from an independent
 * implementation is stronger evidence than matching the final boolean alone.
 *
 * SCOPE, STATED PLAINLY
 * ----------------------
 * This module DECIDES additive k-power-freeness for morphisms satisfying
 * Theorem 2.4's hypotheses. It does not search for such morphisms -- that is
 * additive-nonuniform-morphism-scan.js's job, whose header comment claiming
 * "no exact decision procedure exists yet for the additive condition" is now
 * stale and has been corrected alongside this file (MATH_CLAIMS.md row 74).
 * Eligibility (how many project morphisms satisfy the hypotheses) was
 * measured separately in MATH_CLAIMS.md row 73 and is not repeated here.
 */

function isFactor(u, w) {
  const m = u.length, n = w.length;
  if (m > n) return false;
  outer: for (let i = 0; i <= n - m; i++) {
    for (let j = 0; j < m; j++) if (w[i + j] !== u[j]) continue outer;
    return true;
  }
  return false;
}
function containsAll(U, w) { return U.every(u => isFactor(u, w)); }

function factorsOf(s, n) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i <= s.length - n; i++) {
    const f = s.slice(i, i + n);
    const key = f.join(',');
    if (!seen.has(key)) { seen.add(key); out.push(f); }
  }
  return out;
}

// Returns a factor of w that is an additive k-power under weights WT, or null.
function additiveKPower(w, k, WT) {
  const n = w.length;
  const W = [0];
  let T = 0;
  for (let i = 0; i < n; i++) { T += WT[w[i]]; W.push(T); }
  for (let r = 1; r <= Math.floor(n / k); r++) {
    for (let i = 0; i <= n - k * r; i++) {
      const sums = [];
      for (let j = 1; j <= k; j++) sums.push(W[i + j * r] - W[i + (j - 1) * r]);
      if (sums.every(s => s === sums[0])) return w.slice(i, i + r * k);
    }
  }
  return null;
}

function weightedSum(w, WT) { let s = 0; for (const x of w) s += WT[x]; return s; }
function sigma(w, WT) { return [w.length, weightedSum(w, WT)]; }

// splits[i] for i < A: all (prefix, letter i, suffix, source-image-index)
// triples where letter i occurs in some image of f. splits[A]: the same for
// the empty center (-1), including the fully-empty split with source -1.
function splitsOf(f, A, WT) {
  const splits = [];
  for (let i = 0; i <= A; i++) splits.push([]);
  for (let i = 0; i < f.length; i++) {
    const w = f[i];
    for (let j = 0; j < w.length; j++) {
      const c = w[j];
      if (c < A) splits[c].push([sigma(w.slice(0, j), WT), c, sigma(w.slice(j + 1), WT), i]);
    }
  }
  splits[A].push([sigma([], WT), -1, sigma([], WT), -1]);
  for (let i = 0; i < f.length; i++) {
    const w = f[i];
    for (let j = 0; j <= w.length; j++) {
      splits[A].push([sigma(w.slice(0, j), WT), -1, sigma(w.slice(j), WT), i]);
    }
  }
  return splits;
}

function applyMorphism(f, w) { let out = []; for (const c of w) out = out.concat(f[c]); return out; }
function iterMorphism(f, w, p) { for (let i = 0; i < p; i++) w = applyMorphism(f, w); return w; }

function omegaFactorsPure(g, a, n) {
  const factors = [];
  const seen = new Set();
  let w = [a];
  while (w.length < n) w = applyMorphism(g, w);
  let newF = [w.slice(0, n)];
  seen.add(newF[0].join(','));
  factors.push(newF[0]);
  while (newF.length) {
    const oldF = newF; newF = [];
    for (const u of oldF) {
      for (const x of factorsOf(applyMorphism(g, u), n)) {
        const key = x.join(',');
        if (!seen.has(key)) { seen.add(key); factors.push(x); newF.push(x); }
      }
    }
  }
  return factors;
}

function omegaFactorsOuter(g, h, a, n) {
  const factors = [];
  const seen = new Set();
  for (const u of omegaFactorsPure(g, a, n)) {
    for (const w of factorsOf(applyMorphism(h, u), n)) {
      const key = w.join(',');
      if (!seen.has(key)) { seen.add(key); factors.push(w); }
    }
  }
  return factors;
}

// Smallest j such that f^j(a) contains every length-n factor of f^omega(a).
function iterateNeeded(f, a, n) {
  const factors = omegaFactorsPure(f, a, n);
  let w = [a], j = 0;
  while (true) {
    j++;
    w = applyMorphism(f, w);
    if (containsAll(factors, w)) return j;
  }
}

// M_f for an affine morphism f (image lengths and weighted sums both linear
// in the letter's own integer value), or throws if f is not affine.
function morphismMatrix(f, WT) {
  const lens = f.map(w => w.length);
  for (let i = 0; i < lens.length - 2; i++) {
    if (lens[i] - lens[i + 1] !== lens[i + 1] - lens[i + 2]) {
      throw new Error("This Morphism doesn't have a linear relation between its lengths");
    }
  }
  // Reference: A = len(f[0]) - 2*f.index(f[0]), C = sums[0] - 2*f.index(f[0]).
  // Python's f.index(f[0]) always returns 0 (it finds f[0] at its own position),
  // so both subtracted terms vanish identically; ported as that constant.
  const B_ = lens[1] - lens[0];
  const A_ = lens[0];
  const sums = f.map(w => weightedSum(w, WT));
  for (let j = 0; j < sums.length - 2; j++) {
    if (sums[j] - sums[j + 1] !== sums[j + 1] - sums[j + 2]) {
      throw new Error("This Morphism doesn't have a linear relation between the sums of digits");
    }
  }
  const D_ = sums[1] - sums[0];
  const C_ = sums[0];
  return [[A_, B_], [C_, D_]];
}

// The adjugate of a 2x2 matrix: swap the diagonal, negate the off-diagonal.
function swapMatrix(m) {
  const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
  return [[d, -b], [-c, a]];
}

function deltaOf(t, k) {
  let max = 0;
  for (let m = k + 1; m < t.length; m++) if (t[m][0] >= max) max = t[m][0];
  return max;
}

function boundB(delta_t, k, f) {
  let W_f = 0;
  for (const w of f) W_f = Math.max(w.length, W_f);
  return k + 2 + k * (W_f - 2) + Math.floor(((k - 1) * k) / 2) * delta_t;
}

function vecAdd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
function vecSub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function matVec(m, x) { return [m[0][0] * x[0] + m[0][1] * x[1], m[1][0] * x[0] + m[1][1] * x[1]]; }

// All f-parents of additive k-template t (Rao & Rosenfeld-style ancestor
// step, specialized to the 2x2 affine matrix per Theorem 2.4/Corollary 11).
function parentsOf(t, k, f, A, WT) {
  let oldParents = [[[], []]];
  const splits = splitsOf(f, A, WT);
  const m0 = morphismMatrix(f, WT);
  const det_m = m0[0][0] * m0[1][1] - m0[0][1] * m0[1][0];
  const m = swapMatrix(m0);

  for (let i = 0; i <= k; i++) {
    const newParents = [];
    for (const S of oldParents) {
      for (const split of splits[t[i] === -1 ? A : t[i]]) {
        const newS = [S[0].slice(), S[1].slice()];
        newS[0].push(split);
        if (i < 2) {
          newParents.push(newS);
        } else {
          const b = vecSub(vecAdd(newS[0][i - 1][2], newS[0][i][0]), vecAdd(newS[0][i - 2][2], newS[0][i - 1][0]));
          const x = vecSub(t[k + 1 + i - 2], b);
          const D = matVec(m, x);
          if (D[0] % det_m === 0 && D[1] % det_m === 0) {
            newS[1].push([D[0] / det_m, D[1] / det_m]);
            newParents.push(newS);
          }
        }
      }
    }
    oldParents = newParents;
  }

  // T = source-letter index of each of the k+1 splits, then the k-1 D-vectors.
  const parentsSet = new Map();
  for (const S of oldParents) {
    const T = S[0].map(s => s[3]).concat(S[1]);
    const key = JSON.stringify(T);
    if (!parentsSet.has(key)) parentsSet.set(key, T);
  }
  return parentsSet;
}

function ancestorsPure(T0, k, f, A, WT, log) {
  let Ancestors = parentsOf(T0, k, f, A, WT);
  let prevAncestors = Ancestors;
  if (log) console.log(`  initial template has ${Ancestors.size} parents`);
  let i = 0;
  while (true) {
    i++;
    const newAncestors = new Map();
    for (const [, Tkey] of prevAncestors) {
      for (const [key, val] of parentsOf(Tkey, k, f, A, WT)) {
        if (!Ancestors.has(key)) newAncestors.set(key, val);
      }
    }
    if (newAncestors.size === 0) {
      if (log) console.log(`  generation ${i + 1}: no new ancestors, total ${Ancestors.size} after ${i} generation(s)`);
      break;
    }
    if (log) console.log(`  generation ${i + 1}: ${newAncestors.size} new ancestors`);
    for (const [key, val] of newAncestors) Ancestors.set(key, val);
    prevAncestors = newAncestors;
  }
  return { Ancestors, i };
}

function ancestorsOuter(T0, k, g, Ag, WTg, h, Ah, WTh, log) {
  let Ancestors = parentsOf(T0, k, h, Ah, WTh);
  let prevAncestors = Ancestors;
  if (log) console.log(`  initial template has ${Ancestors.size} h-parents`);
  let i = 0;
  while (true) {
    const newAncestors = new Map();
    for (const [, Tkey] of prevAncestors) {
      for (const [key, val] of parentsOf(Tkey, k, g, Ag, WTg)) {
        if (!Ancestors.has(key)) newAncestors.set(key, val);
      }
    }
    if (newAncestors.size === 0) {
      if (log) console.log(`  generation ${i + 1}: no new ancestors, total ${Ancestors.size} after ${i} generation(s)`);
      break;
    }
    if (log) console.log(`  generation ${i + 1}: ${newAncestors.size} new ancestors`);
    for (const [key, val] of newAncestors) Ancestors.set(key, val);
    prevAncestors = newAncestors;
    i++;
  }
  return { Ancestors, i };
}

function buildT0(k) {
  const t = [];
  for (let i = 0; i <= k; i++) t.push(-1);
  for (let i = 0; i < k - 1; i++) t.push([0, 0]);
  return t;
}

// Decides whether g^omega(a) is additive k-power-free, for g affine and
// satisfying Theorem 2.4's hypotheses (caller's responsibility to check;
// morphismMatrix throws if g is not affine, but does not check eigenvalues).
function mainPure(k, g, A, WT, a, log = false) {
  const t = buildT0(k);
  const B_g = boundB(deltaOf(t, k), k, g);
  if (log) console.log(`Initial check: B_g=${B_g}, examine factors of length ${B_g - 1}`);
  for (const factor of omegaFactorsPure(g, a, B_g - 1)) {
    const power = additiveKPower(factor, k, WT);
    if (power) { if (log) console.log(`  additive ${k}-power found: ${power}`); return false; }
  }
  if (log) console.log('Initial check clean. Computing ancestors...');
  const { Ancestors, i } = ancestorsPure(t, k, g, A, WT, log);
  let maxDelta = 0;
  for (const [, T] of Ancestors) { const d = deltaOf(T, k); if (d > maxDelta) maxDelta = d; }
  const z = boundB(maxDelta, k, g);
  if (log) console.log(`max_delta=${maxDelta}, B_M=${z}`);
  const j = iterateNeeded(g, a, z - 1);
  const prefix = iterMorphism(g, [a], i + j);
  const power = additiveKPower(prefix, k, WT);
  if (log) console.log(power === null
    ? `g^${i + j}(${a}) is additive ${k}-power-free -> TRUE`
    : `g^${i + j}(${a}) has additive ${k}-power: ${power} -> FALSE`);
  return power === null;
}

// Decides whether h(g^omega(a)) is additive k-power-free, for h affine.
function mainOuter(k, g, Ag, WTg, h, Ah, WTh, a, log = false) {
  const t = buildT0(k);
  const B_h = boundB(deltaOf(t, k), k, h);
  if (log) console.log(`Initial check: B_h=${B_h}, examine factors of length ${B_h - 1}`);
  for (const factor of omegaFactorsOuter(g, h, a, B_h - 1)) {
    const power = additiveKPower(factor, k, WTh);
    if (power) { if (log) console.log(`  additive ${k}-power found: ${power}`); return false; }
  }
  if (log) console.log('Initial check clean. Computing ancestors...');
  const { Ancestors, i } = ancestorsOuter(t, k, g, Ag, WTg, h, Ah, WTh, log);
  let maxDelta = 0;
  for (const [, T] of Ancestors) { const d = deltaOf(T, k); if (d > maxDelta) maxDelta = d; }
  const z = boundB(maxDelta, k, g);
  if (log) console.log(`max_delta=${maxDelta}, B_M=${z}`);
  const j = iterateNeeded(g, a, z - 1);
  const prefix = applyMorphism(h, iterMorphism(g, [a], i + j));
  const power = additiveKPower(prefix, k, WTh);
  if (log) console.log(power === null
    ? `h(g^${i + j}(${a})) is additive ${k}-power-free -> TRUE`
    : `h(g^${i + j}(${a})) has additive ${k}-power: ${power} -> FALSE`);
  return power === null;
}

// Reproduces the reference implementation's own five case studies. Throws on
// any mismatch rather than returning a pass/fail flag: a silent wrong answer
// here is worse than a crash, since everything built on this module trusts it.
function selfTest() {
  const cases = [
    { name: 'Dekking 1979', expect: true,
      run: () => mainPure(4, [[0,0,0,1],[0,1,1]], 2, [0,1], 0) },
    { name: 'Currie & Aberkane 2009', expect: true,
      run: () => mainPure(4, [
        [0,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,0,1,1,0,0,0,1,0],
        [1,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,1,1,0,1],
      ], 2, [0,1], 0) },
    { name: 'Andrade & Mol Prop 3.1', expect: true,
      run: () => mainPure(5, [[0,0,0,0,1],[0,1,1,0,1]], 2, [0,1], 0) },
    { name: 'Andrade & Mol Prop 4.1', expect: true,
      run: () => mainPure(4, [[1,0,0,0,1],[1,0,1,2,1,0,1],[1,0,1,2,2,2,1,0,1]], 3, [0,1,2], 1) },
  ];

  const results = [];
  for (const c of cases) {
    const got = c.run();
    if (got !== c.expect) throw new Error(`selfTest FAILED: ${c.name} returned ${got}, expected ${c.expect}`);
    results.push(`${c.name}: ${got}`);
  }

  // The composed case separately, asserting the paper's own intermediate
  // counts (17,056 / 48 new / 17,104 total), not just the final boolean.
  const t0 = buildT0(4);
  const { Ancestors: Anc, i } = ancestorsOuter(t0, 4,
    [[0,0,1],[0,1,2],[2,1,2]], 3, [0,1,2],
    [[0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,1,0,0,0,1,1],
     [0,0,0,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1],
     [0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1]], 2, [0,1], false);
  const initial = parentsOf(t0, 4, [[0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,1,0,0,0,1,1],
     [0,0,0,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1],
     [0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1]], 2, [0,1]).size;
  if (initial !== 17056) throw new Error(`selfTest FAILED: CMRS 2021 initial h-parents = ${initial}, expected 17056`);
  if (Anc.size !== 17104) throw new Error(`selfTest FAILED: CMRS 2021 total ancestors = ${Anc.size}, expected 17104`);
  const got5 = mainOuter(4, [[0,0,1],[0,1,2],[2,1,2]], 3, [0,1,2],
    [[0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,1,0,0,0,1,1],
     [0,0,0,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1],
     [0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1]], 2, [0,1], 0);
  if (got5 !== true) throw new Error(`selfTest FAILED: CMRS 2021 returned ${got5}, expected true`);
  results.push(`CMRS 2021 (composed): true, ${initial} initial h-parents, ${Anc.size} total ancestors after ${i} generation(s)`);

  return results;
}

function main() {
  console.log('additive-affine-decision.js: reproducing the reference implementation\'s five case studies\n');
  const t0 = Date.now();
  const results = selfTest();
  for (const r of results) console.log('  ' + r);
  console.log(`\nAll five case studies match. [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
}

if (require.main === module) main();

module.exports = { mainPure, mainOuter, additiveKPower, morphismMatrix, selfTest };
