'use strict';

/**
 * perron-frobenius.js
 * -------------------
 * Exact spectral instrument for substitution morphisms.
 *
 * WHAT THIS COMPUTES (and at what epistemic level):
 *
 *   [EXACT]   Incidence (abelianization) matrix A, A[i][j] = |phi(i)|_j
 *   [EXACT]   Primitivity of A (boolean powers, Wielandt bound k <= (n-1)^2 + 1)
 *   [EXACT]   Dominant eigenvalue lambda_1 for k-uniform morphisms (lambda_1 = k, by row sums)
 *   [EXACT]   Left Perron eigenvector f (f A = lambda_1 f), as reduced rationals,
 *             normalized to sum 1 = asymptotic letter frequencies of phi^omega(seed)
 *   [EXACT]   Characteristic polynomial of A (integer coefficients, Faddeev-LeVerrier over Q)
 *   [NUMERIC] Roots of the characteristic polynomial (Durand-Kerner, float64)
 *   [EXACT]   Projected letter frequencies under a second morphism g (e.g. g3 o h6^omega)
 *   [EMPIRIC] Cross-check against actually generated finite prefixes
 *
 * EPISTEMOLOGICAL NOTE (AGENTS.md rule 3):
 * The frequency vector is an EXACT asymptotic statement about the infinite fixed point,
 * derived algebraically. It is NOT an empirical extrapolation. The empirical cross-check
 * at the end is a bug-detector for this script, not evidence for the frequencies.
 *
 * The subdominant eigenvalue modulus |lambda_2| is reported because it governs the
 * balance / discrepancy of the fixed point: Parikh vector deviations from the ideal
 * frequency line grow like N^(log|lambda_2| / log lambda_1) when |lambda_2| > 1, and stay
 * bounded (C-balanced) when |lambda_2| < 1. Abelian-square-freeness is a statement about
 * Parikh vector differences, so this exponent bounds how far the construction can drift.
 * This connection is stated here as motivation; it is NOT registered as a project claim.
 *
 * Usage:
 *   node perron-frobenius.js              # full report for h6, g3 o h6, g85, g98, g109
 *   node perron-frobenius.js --json       # machine-readable output
 */

const { H6, G3, G85, G98, G109 } = require('./morphisms.js');

/* ==========================================================================
 * 1. EXACT RATIONAL ARITHMETIC (BigInt numerator / denominator, always reduced)
 * ========================================================================== */

function bgcd(a, b) {
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}

/** Reduced rational. d is always > 0. */
function fr(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) throw new Error('Rational with zero denominator');
  if (d < 0n) { n = -n; d = -d; }
  const g = bgcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}

const FR0 = fr(0n), FR1 = fr(1n);

const frAdd = (x, y) => fr(x.n * y.d + y.n * x.d, x.d * y.d);
const frSub = (x, y) => fr(x.n * y.d - y.n * x.d, x.d * y.d);
const frMul = (x, y) => fr(x.n * y.n, x.d * y.d);
const frDiv = (x, y) => {
  if (y.n === 0n) throw new Error('Rational division by zero');
  return fr(x.n * y.d, x.d * y.n);
};
const frNeg = (x) => fr(-x.n, x.d);
const frIsZero = (x) => x.n === 0n;
const frEq = (x, y) => x.n === y.n && x.d === y.d;
const frStr = (x) => (x.d === 1n ? `${x.n}` : `${x.n}/${x.d}`);
const frNum = (x) => Number(x.n) / Number(x.d);

/* ==========================================================================
 * 2. INCIDENCE MATRIX
 * ========================================================================== */

/**
 * Builds the incidence (abelianization) matrix of an endomorphism.
 * Convention: A[i][j] = number of occurrences of letter j in phi(letter i).
 * With this convention the letter-COUNT vector is a ROW vector c, evolving as
 * c_{n+1} = c_n A, so the frequency vector is the LEFT eigenvector: f A = lambda f.
 *
 * @param {Object<string,string>} phi  map letter -> image word
 * @returns {{alphabet: string[], A: bigint[][], uniformLength: number|null}}
 */
function incidenceMatrix(phi) {
  const alphabet = Object.keys(phi).sort();
  const idx = Object.fromEntries(alphabet.map((c, i) => [c, i]));
  const n = alphabet.length;

  const A = Array.from({ length: n }, () => new Array(n).fill(0n));
  for (let i = 0; i < n; i++) {
    const img = phi[alphabet[i]];
    for (const ch of img) {
      if (!(ch in idx)) {
        throw new Error(`Image of '${alphabet[i]}' contains '${ch}', which is outside the domain alphabet {${alphabet.join(',')}}. Use projectedFrequencies() for non-endomorphisms.`);
      }
      A[i][idx[ch]] += 1n;
    }
  }

  const lengths = alphabet.map(c => phi[c].length);
  const uniformLength = lengths.every(L => L === lengths[0]) ? lengths[0] : null;

  return { alphabet, A, uniformLength };
}

/* ==========================================================================
 * 3. PRIMITIVITY (exact, boolean powers)
 * ========================================================================== */

/**
 * A non-negative square matrix is primitive iff some power is strictly positive.
 * Wielandt: if primitive, A^k > 0 for some k <= (n-1)^2 + 1. So the bound is decisive:
 * failing up to that exponent is a PROOF of non-primitivity, not merely a timeout.
 */
function checkPrimitive(A) {
  const n = A.length;
  const bound = (n - 1) * (n - 1) + 1;
  // boolean matrix, seeded from the support of A
  let B = A.map(row => row.map(v => v > 0n));
  const allPositive = (M) => M.every(row => row.every(v => v));

  if (allPositive(B)) return { primitive: true, exponent: 1, wielandtBound: bound };

  const base = B.map(r => r.slice());
  for (let k = 2; k <= bound; k++) {
    const C = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) {
      for (let t = 0; t < n; t++) {
        if (!B[i][t]) continue;
        for (let j = 0; j < n; j++) if (base[t][j]) { C[i][j] = true; }
      }
    }
    B = C;
    if (allPositive(B)) return { primitive: true, exponent: k, wielandtBound: bound };
  }
  return { primitive: false, exponent: null, wielandtBound: bound };
}

/* ==========================================================================
 * 4. EXACT NULLSPACE OVER Q  ->  LEFT PERRON EIGENVECTOR
 * ========================================================================== */

/** Exact reduced row echelon form over Q. Returns {R, pivots}. */
function rrefQ(M) {
  const rows = M.length, cols = M[0].length;
  const R = M.map(r => r.map(x => fr(x.n, x.d)));
  const pivots = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = -1;
    for (let i = r; i < rows; i++) if (!frIsZero(R[i][c])) { p = i; break; }
    if (p === -1) continue;
    [R[r], R[p]] = [R[p], R[r]];
    const inv = frDiv(FR1, R[r][c]);
    for (let j = c; j < cols; j++) R[r][j] = frMul(R[r][j], inv);
    for (let i = 0; i < rows; i++) {
      if (i === r || frIsZero(R[i][c])) continue;
      const f = R[i][c];
      for (let j = c; j < cols; j++) R[i][j] = frSub(R[i][j], frMul(f, R[r][j]));
    }
    pivots.push(c);
    r++;
  }
  return { R, pivots };
}

/** Basis of the nullspace of a rational matrix, as arrays of rationals. */
function nullspaceQ(M) {
  const cols = M[0].length;
  const { R, pivots } = rrefQ(M);
  const free = [];
  for (let c = 0; c < cols; c++) if (!pivots.includes(c)) free.push(c);

  return free.map(fc => {
    const v = new Array(cols).fill(FR0);
    v[fc] = FR1;
    for (let i = 0; i < pivots.length; i++) v[pivots[i]] = frNeg(R[i][fc]);
    return v;
  });
}

/**
 * Exact left Perron eigenvector, normalized so components sum to 1.
 * Only valid when lambda is known exactly. For k-uniform morphisms lambda_1 = k
 * because every row of A sums to k, so A * 1 = k * 1 and (Perron-Frobenius for
 * primitive matrices) k is the strictly dominant eigenvalue.
 *
 * Solves f A = lambda f  <=>  (A^T - lambda I) f^T = 0.
 */
function leftPerronExact(A, lambda) {
  const n = A.length;
  const lam = fr(BigInt(lambda));
  // build (A^T - lambda I) over Q
  const M = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let v = fr(A[j][i]);                  // transpose
      if (i === j) v = frSub(v, lam);
      return v;
    })
  );

  const basis = nullspaceQ(M);
  if (basis.length === 0) {
    throw new Error(`lambda = ${lambda} is not an eigenvalue of A (empty eigenspace).`);
  }
  if (basis.length > 1) {
    throw new Error(`Eigenspace for lambda = ${lambda} has dimension ${basis.length}; Perron eigenvalue must be simple. Matrix is likely not primitive.`);
  }

  let v = basis[0];
  let sum = v.reduce((acc, x) => frAdd(acc, x), FR0);
  if (frIsZero(sum)) throw new Error('Eigenvector components sum to zero; cannot normalize to a probability vector.');
  v = v.map(x => frDiv(x, sum));

  // sign fix: frequencies must be non-negative
  if (v.some(x => x.n < 0n)) {
    if (v.every(x => x.n <= 0n)) v = v.map(frNeg);
    else throw new Error('Eigenvector has mixed signs after normalization; input is not a valid non-negative Perron vector.');
  }
  return v;
}

/** Independent verification: recompute f A and compare against lambda * f, exactly. */
function verifyEigen(A, f, lambda) {
  const n = A.length;
  const lam = fr(BigInt(lambda));
  for (let j = 0; j < n; j++) {
    let s = FR0;
    for (let i = 0; i < n; i++) s = frAdd(s, frMul(f[i], fr(A[i][j])));
    if (!frEq(s, frMul(lam, f[j]))) return false;
  }
  return true;
}

/* ==========================================================================
 * 5. EXACT CHARACTERISTIC POLYNOMIAL (Faddeev-LeVerrier over Q)
 * ========================================================================== */

/**
 * Returns coefficients [c_n, c_{n-1}, ..., c_0] of det(x*I - A), highest degree first.
 * For an integer matrix all coefficients are integers; we assert that.
 */
function charPolyExact(A) {
  const n = A.length;
  const Aq = A.map(r => r.map(v => fr(v)));
  const I = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? FR1 : FR0)));

  const matMul = (X, Y) => Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let s = FR0;
      for (let t = 0; t < n; t++) s = frAdd(s, frMul(X[i][t], Y[t][j]));
      return s;
    })
  );
  const trace = (X) => X.reduce((acc, row, i) => frAdd(acc, row[i]), FR0);

  const coeffs = [FR1];            // c_n = 1
  let M = I.map(r => r.slice());   // M_1 = I
  for (let k = 1; k <= n; k++) {
    const AM = matMul(Aq, M);
    const ck = frNeg(frDiv(trace(AM), fr(BigInt(k))));
    coeffs.push(ck);
    if (k < n) {
      M = AM.map((row, i) => row.map((v, j) => (i === j ? frAdd(v, ck) : v)));
    }
  }

  return coeffs.map(c => {
    if (c.d !== 1n) throw new Error(`Non-integer characteristic polynomial coefficient ${frStr(c)} for an integer matrix; arithmetic bug.`);
    return c.n;
  });
}

function polyToString(coeffs) {
  const n = coeffs.length - 1;
  const parts = [];
  for (let i = 0; i <= n; i++) {
    const c = coeffs[i];
    if (c === 0n) continue;
    const p = n - i;
    const a = c < 0n ? -c : c;
    const sign = c < 0n ? '-' : '+';
    let term = (a === 1n && p > 0) ? '' : `${a}`;
    if (p > 1) term += `x^${p}`;
    else if (p === 1) term += 'x';
    parts.push((parts.length === 0 ? (c < 0n ? '-' : '') : ` ${sign} `) + term);
  }
  return parts.join('') || '0';
}

/* ==========================================================================
 * 6. NUMERIC ROOTS (Durand-Kerner) -- explicitly float64, explicitly non-exact
 * ========================================================================== */

const cAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cDiv = (a, b) => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const cAbs = (a) => Math.hypot(a.re, a.im);

/** Roots of a monic polynomial given as BigInt coefficients, highest degree first. */
function polyRootsNumeric(coeffs, iterations = 800) {
  const n = coeffs.length - 1;
  const c = coeffs.map(Number);
  const lead = c[0];
  const evalAt = (z) => {
    let acc = { re: 0, im: 0 };
    for (let i = 0; i <= n; i++) acc = cAdd(cMul(acc, z), { re: c[i] / lead, im: 0 });
    return acc;
  };

  // classic 0.4 + 0.9i seed spread
  let roots = [];
  let z = { re: 0.4, im: 0.9 };
  let cur = { re: 1, im: 0 };
  for (let i = 0; i < n; i++) { roots.push(cur); cur = cMul(cur, z); }

  for (let it = 0; it < iterations; it++) {
    let maxDelta = 0;
    for (let i = 0; i < n; i++) {
      let denom = { re: 1, im: 0 };
      for (let j = 0; j < n; j++) if (j !== i) denom = cMul(denom, cSub(roots[i], roots[j]));
      if (cAbs(denom) < 1e-300) continue;
      const delta = cDiv(evalAt(roots[i]), denom);
      roots[i] = cSub(roots[i], delta);
      maxDelta = Math.max(maxDelta, cAbs(delta));
    }
    if (maxDelta < 1e-14) break;
  }
  return roots.sort((a, b) => cAbs(b) - cAbs(a));
}

/* ==========================================================================
 * 7. PROJECTION THROUGH A SECOND MORPHISM (non-endomorphism allowed)
 * ========================================================================== */

/**
 * Given exact letter frequencies f over the source alphabet of a morphism g,
 * returns the exact letter frequencies of g applied to that infinite word.
 *
 * density(y) = ( sum_x f_x * |g(x)|_y ) / ( sum_x f_x * |g(x)| )
 *
 * The denominator is the mean image length; it is required whenever g is
 * non-uniform, and reduces to |g(x)| when g is uniform.
 */
function projectedFrequencies(sourceAlphabet, f, g) {
  const target = [...new Set(Object.values(g).join(''))].sort();
  const num = Object.fromEntries(target.map(y => [y, FR0]));
  let den = FR0;

  sourceAlphabet.forEach((x, i) => {
    const img = g[x];
    if (img === undefined) throw new Error(`Morphism g has no image for source letter '${x}'.`);
    den = frAdd(den, frMul(f[i], fr(BigInt(img.length))));
    const counts = Object.fromEntries(target.map(y => [y, 0n]));
    for (const ch of img) counts[ch] += 1n;
    for (const y of target) num[y] = frAdd(num[y], frMul(f[i], fr(counts[y])));
  });

  if (frIsZero(den)) throw new Error('Mean image length is zero.');
  return { alphabet: target, freq: target.map(y => frDiv(num[y], den)) };
}

/* ==========================================================================
 * 8. EMPIRICAL CROSS-CHECK (bug detector for the algebra above)
 * ========================================================================== */

function iterateMorphism(phi, seed, depth) {
  let w = seed;
  for (let i = 0; i < depth; i++) {
    let next = '';
    for (const ch of w) next += phi[ch];
    w = next;
  }
  return w;
}

function empiricalFreq(word, alphabet) {
  const counts = Object.fromEntries(alphabet.map(c => [c, 0]));
  for (const ch of word) if (ch in counts) counts[ch]++;
  return alphabet.map(c => counts[c] / word.length);
}

/* ==========================================================================
 * 9. REPORTING
 * ========================================================================== */

function analyze(name, phi, opts = {}) {
  const { alphabet, A, uniformLength } = incidenceMatrix(phi);
  const prim = checkPrimitive(A);

  const out = {
    name,
    alphabet,
    incidence: A.map(r => r.map(Number)),
    uniformLength,
    primitive: prim,
    lambda1: null,
    lambda1Level: null,
    freqExact: null,
    charPoly: null,
    rootsNumeric: null
  };

  const charPoly = charPolyExact(A);
  out.charPoly = charPoly.map(String);
  out.charPolyString = polyToString(charPoly);
  out.rootsNumeric = polyRootsNumeric(charPoly).map(r => ({ re: r.re, im: r.im, abs: cAbs(r) }));

  if (uniformLength !== null) {
    out.lambda1 = uniformLength;
    out.lambda1Level = 'EXACT (row sums of A are all equal to the uniform image length)';
    const f = leftPerronExact(A, uniformLength);
    if (!verifyEigen(A, f, uniformLength)) throw new Error(`Eigenvector verification failed for ${name}.`);
    out.freqExact = f;
  } else {
    out.lambda1Level = 'NOT COMPUTED EXACTLY (non-uniform morphism; exact lambda_1 requires algebraic-number handling)';
  }

  if (opts.seed && out.freqExact) {
    const depth = opts.depth ?? 8;
    const w = iterateMorphism(phi, opts.seed, depth);
    out.empirical = {
      seed: opts.seed,
      depth,
      length: w.length,
      freq: empiricalFreq(w, alphabet)
    };
  }

  return out;
}

function pad(s, n) { s = String(s); return s + ' '.repeat(Math.max(0, n - s.length)); }

function printReport(res) {
  const line = '='.repeat(78);
  console.log(line);
  console.log(`MORPHISM: ${res.name}`);
  console.log(line);
  console.log(`Alphabet          : {${res.alphabet.join(', ')}}  (n = ${res.alphabet.length})`);
  console.log(`Uniform           : ${res.uniformLength !== null ? `yes, ${res.uniformLength}-uniform` : 'no'}`);
  console.log(`Primitive         : ${res.primitive.primitive ? `yes (A^${res.primitive.exponent} > 0)` : `NO (checked up to Wielandt bound ${res.primitive.wielandtBound} -- this is decisive)`}`);
  console.log('');
  console.log('Incidence matrix A[i][j] = |phi(i)|_j   [EXACT]');
  console.log('      ' + res.alphabet.map(c => pad(c, 5)).join(''));
  res.incidence.forEach((row, i) => {
    console.log(`  ${pad(res.alphabet[i], 4)}` + row.map(v => pad(v, 5)).join(''));
  });
  console.log('');
  console.log(`Characteristic polynomial det(xI - A)   [EXACT]`);
  console.log(`  ${res.charPolyString}`);
  console.log('');
  console.log('Eigenvalues (Durand-Kerner, float64)   [NUMERIC -- not a certified bound]');
  res.rootsNumeric.forEach((r, i) => {
    const im = Math.abs(r.im) < 1e-9 ? '' : ` ${r.im >= 0 ? '+' : '-'} ${Math.abs(r.im).toFixed(9)}i`;
    console.log(`  lambda_${i + 1} = ${r.re.toFixed(9)}${im}      |lambda| = ${r.abs.toFixed(9)}`);
  });

  if (res.rootsNumeric.length > 1) {
    const l1 = res.rootsNumeric[0].abs;
    const l2 = res.rootsNumeric[1].abs;
    const exponent = Math.log(l2) / Math.log(l1);
    console.log('');
    console.log(`  |lambda_2| / |lambda_1| = ${(l2 / l1).toFixed(9)}`);
    console.log(`  discrepancy exponent log|lambda_2|/log|lambda_1| = ${exponent.toFixed(9)}`);
    console.log(`  -> ${l2 < 1 ? 'bounded Parikh deviation (balanced regime, |lambda_2| < 1)' : `Parikh deviation grows ~ N^${exponent.toFixed(4)} (|lambda_2| > 1)`}`);
    console.log('     [NUMERIC observation about this matrix; not a registered project claim]');
  }

  if (res.freqExact) {
    console.log('');
    console.log(`Left Perron eigenvector, f A = ${res.lambda1} f, normalized sum = 1   [EXACT]`);
    console.log(`  lambda_1 = ${res.lambda1}   (${res.lambda1Level})`);
    res.alphabet.forEach((c, i) => {
      console.log(`  freq(${c}) = ${pad(frStr(res.freqExact[i]), 14)} = ${frNum(res.freqExact[i]).toFixed(12)}`);
    });
    const sum = res.freqExact.reduce((a, x) => frAdd(a, x), FR0);
    console.log(`  sum      = ${frStr(sum)}   [exact identity check]`);
  } else {
    console.log('');
    console.log(`Left Perron eigenvector: ${res.lambda1Level}`);
  }

  if (res.empirical) {
    console.log('');
    console.log(`Empirical cross-check: ${res.empirical.seed} -> phi^${res.empirical.depth}, length ${res.empirical.length}   [EMPIRIC, bug detector only]`);
    res.alphabet.forEach((c, i) => {
      const e = res.empirical.freq[i];
      const x = frNum(res.freqExact[i]);
      console.log(`  ${c}: empirical ${e.toFixed(12)}   exact ${x.toFixed(12)}   |diff| ${Math.abs(e - x).toExponential(3)}`);
    });
  }
  console.log('');
}

/* ==========================================================================
 * 10. MAIN
 * ========================================================================== */

function main() {
  const asJson = process.argv.includes('--json');
  const results = {};

  // --- h6: the 6-letter driver of the Rao & Rosenfeld ternary construction ---
  const h6 = analyze('h6  (Sigma_6 -> Sigma_6, see MATH_CLAIMS.md row 5)', H6, { seed: 'a', depth: 11 });
  results.h6 = h6;

  // --- projection through g3 into the ternary alphabet ---
  let proj = null;
  if (h6.freqExact) {
    proj = projectedFrequencies(h6.alphabet, h6.freqExact, G3);

    // empirical cross-check of the projection
    const w6 = iterateMorphism(H6, 'a', 11);
    let w3 = '';
    for (const ch of w6) w3 += G3[ch];
    const emp = empiricalFreq(w3, proj.alphabet);

    results.g3_of_h6 = {
      alphabet: proj.alphabet,
      freqExact: proj.freq.map(frStr),
      empirical: emp,
      empiricalLength: w3.length
    };
  }

  // --- Keranen's 4-letter morphisms, for contrast ---
  results.g85 = analyze('g85 (Keranen 1992, see MATH_CLAIMS.md row 3)', G85, { seed: 'a', depth: 3 });
  results.g98 = analyze('g98 (Keranen 2002)', G98, { seed: 'a', depth: 2 });
  results.g109 = analyze('g109 (Keranen 2009)', G109, { seed: 'a', depth: 2 });

  if (asJson) {
    console.log(JSON.stringify(results, (k, v) => (typeof v === 'bigint' ? String(v) : v), 2));
    return;
  }

  console.log('');
  console.log('PERRON-FROBENIUS SPECTRAL REPORT');
  console.log('Exact rational arithmetic (BigInt). No external dependencies.');
  console.log('Morphism constants read from morphisms.js (checksum-locked).');
  console.log('');

  printReport(h6);

  if (proj) {
    const line = '='.repeat(78);
    console.log(line);
    console.log('PROJECTION: g3( h6^omega(a) )  -- ternary letter frequencies');
    console.log(line);
    console.log('g3 is not an endomorphism (Sigma_6 -> Sigma_3*), so it has no fixed point');
    console.log('and no eigenvector of its own. Its output frequencies are the h6 frequencies');
    console.log('pushed through the image letter counts, weighted by image length:');
    console.log('   density(y) = sum_x f_x * |g3(x)|_y  /  sum_x f_x * |g3(x)|');
    console.log('');
    console.log('Image letter counts of g3   [EXACT]');
    console.log('        ' + proj.alphabet.map(c => pad(c, 6)).join('') + 'len');
    h6.alphabet.forEach(x => {
      const img = G3[x];
      const counts = proj.alphabet.map(y => [...img].filter(ch => ch === y).length);
      console.log(`  g3(${x}) ` + counts.map(v => pad(v, 6)).join('') + img.length + `   "${img}"`);
    });
    console.log('');
    console.log('Exact asymptotic ternary frequencies   [EXACT]');
    proj.alphabet.forEach((y, i) => {
      console.log(`  freq(${y}) = ${pad(frStr(proj.freq[i]), 14)} = ${frNum(proj.freq[i]).toFixed(12)}`);
    });
    const s = proj.freq.reduce((a, x) => frAdd(a, x), FR0);
    console.log(`  sum      = ${frStr(s)}   [exact identity check]`);
    console.log('');
    const r = results.g3_of_h6;
    console.log(`Empirical cross-check on g3(h6^11(a)), length ${r.empiricalLength}   [EMPIRIC, bug detector only]`);
    proj.alphabet.forEach((y, i) => {
      const e = r.empirical[i];
      const x = frNum(proj.freq[i]);
      console.log(`  ${y}: empirical ${e.toFixed(12)}   exact ${x.toFixed(12)}   |diff| ${Math.abs(e - x).toExponential(3)}`);
    });
    console.log('');
    console.log('Reading: the exact values are asymptotic statements about the infinite word.');
    console.log('The finite prefix differs by a boundary term; the empirical column exists to');
    console.log('catch coding errors in this script, not to support the exact values.');
    console.log('');
  }

  printReport(results.g85);
  printReport(results.g98);
  printReport(results.g109);
}

if (require.main === module) main();

module.exports = {
  fr, frAdd, frSub, frMul, frDiv, frStr, frNum,
  rrefQ, nullspaceQ,
  incidenceMatrix, checkPrimitive, leftPerronExact, verifyEigen,
  charPolyExact, polyToString, polyRootsNumeric,
  projectedFrequencies, iterateMorphism, empiricalFreq, analyze
};
