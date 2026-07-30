'use strict';

/**
 * sft-container.js
 * ----------------
 * The K in [2,kmax] CONTAINER of Makela's problem, analyzed exactly.
 *
 * WHY THIS EXISTS
 * ---------------
 * The open part of Makela's conjecture concerns abelian squares of
 * half-length K in [2,5] (MATH_CLAIMS.md rows 4, 7b). An abelian square with
 * K <= kmax spans at most 2*kmax letters, so the language "avoid ONLY
 * K in [2,kmax]" is a finite-window constraint, and EVERY witness of
 * Makela's conjecture - whatever route produces it - is an infinite word
 * inside this container for every kmax. The container therefore yields
 * necessary conditions for all attack routes at once
 * (OPEN_RESEARCH_QUESTIONS.md B6). Growing kmax shows whether those
 * conditions tighten as constraints accumulate.
 *
 * WHAT IS COMPUTED
 * ----------------
 * De Bruijn presentation with memory m = 2*kmax - 1:
 *   states = ternary m-words with no abelian square of half-length in
 *            [2, kmax-1] (a K=kmax square needs 2*kmax > m letters);
 *   edge u -> v when u,v overlap in m-1 letters and the 2*kmax-word
 *            u+last(v) is not itself an abelian square with K=kmax. Every
 *            factor of length <= m of that word lies inside u or inside v,
 *            so this single check is complete.
 * A word of length n >= m avoids all K in [2,kmax] squares if and only if
 * its m-windows are states and consecutive windows are edges. The graph is
 * essentialized, decomposed into SCCs, and the exact min/max cycle means of
 * each letter's indicator weight are computed with Karp's algorithm in
 * integer arithmetic.
 *
 * Any Cesaro limit point of prefix letter frequencies of any right-infinite
 * container word lies in [min cycle mean, max cycle mean] over the SCCs:
 * the tail of the path stays in one SCC, and a long walk decomposes into
 * simple cycles plus a remainder of length < |SCC|.
 *
 * WHAT A RESULT MEANS
 * -------------------
 * This is an analysis of a RELAXATION. It yields necessary conditions for
 * Makela witnesses, never sufficient ones (NEGATIVE_RESULTS.md item 2: an
 * SCC does not prove an infinite aa2f word).
 *
 * SELF-VERIFICATION (module refuses to report if any fails)
 * ---------------------------------------------------------
 *   - S3 closure of the state set; per-letter intervals must coincide
 *   - Karp's lambda* re-verified independently by Bellman-Ford: no negative
 *     cycle at lambda*, and a zero-mean cycle exists (achievability)
 *   - path-count DP vs direct DFS enumeration of [2,kmax]-free words (two
 *     independent code paths) must agree at n = m+3 and m+4
 *   - positive control: the 25,379-letter Keranen aa2f record word (avoids
 *     ALL K >= 2, hence a fortiori every container constraint) must trace
 *     as a path through the graph; skips cleanly when the gitignored file
 *     is absent, same pattern as word-anatomy.js
 *   - negative control: a 2*kmax-word rejected during edge construction
 *     purely by the K=kmax check is asserted to be a K=kmax abelian square
 *     with NO smaller violation, and to be refused by traceWord
 *
 * Usage:  node sft-container.js [--kmax 5]
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function codeToWord(code, len) {
  const w = new Array(len);
  for (let i = len - 1; i >= 0; i--) { w[i] = code % 3; code = Math.floor(code / 3); }
  return w;
}

/** Any abelian square with half-length in [klo, khi] inside the array? */
function hasAbelianSquare(w, klo, khi) {
  const n = w.length;
  for (let K = klo; K <= khi; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let da = 0, db = 0, dc = 0;
      for (let j = i; j < i + K; j++) { const c = w[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = i + K; j < i + 2 * K; j++) { const c = w[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      if (da === 0 && db === 0 && dc === 0) return true;
    }
  }
  return false;
}

function gcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a === 0 ? 1 : a; }

// ---------------------------------------------------------------------------
// Container construction
// ---------------------------------------------------------------------------

function buildContainer(kmax = 5) {
  if (kmax < 3) throw new Error('kmax must be at least 3');
  const m = 2 * kmax - 1;
  const raw = Math.pow(3, m);
  if (raw > 5e7) throw new Error(`memory ${m} means ${raw} raw states - measure and redesign before attempting`);
  const powPrev = Math.pow(3, m - 1);

  const stateIdx = new Int32Array(raw).fill(-1);
  const states = [];
  for (let code = 0; code < raw; code++) {
    if (!hasAbelianSquare(codeToWord(code, m), 2, kmax - 1)) {
      stateIdx[code] = states.length;
      states.push(code);
    }
  }
  const n = states.length;

  // Edges; record one sample rejected purely by the K=kmax check.
  const adj = new Array(n);
  let sampleRejected = null;
  let kmaxRejections = 0;
  for (let i = 0; i < n; i++) {
    const code = states[i];
    const suffix = code % powPrev;
    const out = [];
    for (let s = 0; s < 3; s++) {
      const ncode = suffix * 3 + s;
      if (stateIdx[ncode] === -1) continue;
      const w2k = codeToWord(code, m); w2k.push(s);
      let da = 0, db = 0, dc = 0;
      for (let j = 0; j < kmax; j++) { const c = w2k[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = kmax; j < 2 * kmax; j++) { const c = w2k[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      if (da === 0 && db === 0 && dc === 0) {
        kmaxRejections++;
        if (sampleRejected === null) sampleRejected = w2k.slice();
        continue;
      }
      out.push(stateIdx[ncode]);
    }
    adj[i] = out;
  }

  // Essentialize.
  const alive = new Uint8Array(n).fill(1);
  let changed = true;
  while (changed) {
    changed = false;
    const indeg = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      if (!alive[i]) continue;
      let outd = 0;
      for (const j of adj[i]) if (alive[j]) { outd++; indeg[j]++; }
      if (outd === 0) { alive[i] = 0; changed = true; }
    }
    for (let i = 0; i < n; i++) {
      if (alive[i] && indeg[i] === 0) { alive[i] = 0; changed = true; }
    }
  }

  return { kmax, m, raw, powPrev, states, stateIdx, adj, alive, sampleRejected, kmaxRejections };
}

// ---------------------------------------------------------------------------
// Tarjan SCC (iterative)
// ---------------------------------------------------------------------------

function tarjanSCC(nodeList, adj, alive) {
  const n = adj.length;
  const index = new Int32Array(n).fill(-1);
  const low = new Int32Array(n);
  const onStack = new Uint8Array(n);
  const comp = new Int32Array(n).fill(-1);
  const stack = [];
  let idx = 0, ncomp = 0;

  for (const root of nodeList) {
    if (index[root] !== -1) continue;
    const callStack = [[root, 0]];
    while (callStack.length > 0) {
      const frame = callStack[callStack.length - 1];
      const v = frame[0];
      if (frame[1] === 0) {
        index[v] = low[v] = idx++;
        stack.push(v); onStack[v] = 1;
      }
      let advanced = false;
      while (frame[1] < adj[v].length) {
        const w = adj[v][frame[1]++];
        if (!alive[w]) continue;
        if (index[w] === -1) { callStack.push([w, 0]); advanced = true; break; }
        else if (onStack[w] && index[w] < low[v]) low[v] = index[w];
      }
      if (advanced) continue;
      if (low[v] === index[v]) {
        for (;;) {
          const w = stack.pop(); onStack[w] = 0; comp[w] = ncomp;
          if (w === v) break;
        }
        ncomp++;
      }
      callStack.pop();
      if (callStack.length > 0) {
        const parent = callStack[callStack.length - 1][0];
        if (low[v] < low[parent]) low[parent] = low[v];
      }
    }
  }
  return { comp, ncomp };
}

// ---------------------------------------------------------------------------
// Karp minimum cycle mean, exact integers, with independent verification
// ---------------------------------------------------------------------------

/**
 * Min cycle mean of integer edge weights (each in {-1,0,1}) inside one SCC.
 * Edges as flat arrays eu[], ev[], ew[] with local vertex ids.
 * Returns { num, den } in lowest terms.
 */
function karpMinCycleMean(nv, eu, ev, ew) {
  if (nv > 30000) throw new Error('Karp table would not fit Int16 - implement Howard first, do not weaken exactness');
  const INF = 31000;
  const ne = eu.length;
  // D[k*nv + v]; |D| <= nv < 31000 for weights in {-1,0,1}.
  const D = new Int16Array((nv + 1) * nv).fill(INF);
  D[0] = 0; // source = local vertex 0
  for (let k = 1; k <= nv; k++) {
    const prev = (k - 1) * nv, cur = k * nv;
    for (let e = 0; e < ne; e++) {
      const du = D[prev + eu[e]];
      if (du === INF) continue;
      const cand = du + ew[e];
      if (cand < D[cur + ev[e]]) D[cur + ev[e]] = cand;
    }
  }
  let bestNum = 0, bestDen = 0;
  for (let v = 0; v < nv; v++) {
    if (D[nv * nv + v] === INF) continue;
    let vNum = 0, vDen = 0;
    for (let k = 0; k < nv; k++) {
      if (D[k * nv + v] === INF) continue;
      const num = D[nv * nv + v] - D[k * nv + v], den = nv - k;
      if (vDen === 0 || num * vDen > vNum * den) { vNum = num; vDen = den; }
    }
    if (vDen === 0) continue;
    if (bestDen === 0 || vNum * bestDen < bestNum * vDen) { bestNum = vNum; bestDen = vDen; }
  }
  if (bestDen === 0) throw new Error('Karp: SCC contains no cycle reachable with exact-length walks');
  const g = gcd(Math.abs(bestNum), bestDen);
  return { num: bestNum / g, den: bestDen / g };
}

/**
 * Independent verification of a claimed min cycle mean p/q: with integer
 * weights w*q - p, Bellman-Ford must find no negative cycle (optimality)
 * and the zero-reduced-cost subgraph must contain a cycle (achievability).
 */
function verifyMinCycleMean(nv, eu, ev, ew, num, den) {
  const ne = eu.length;
  const W = new Float64Array(ne);
  for (let e = 0; e < ne; e++) W[e] = ew[e] * den - num;
  const dist = new Float64Array(nv).fill(0);
  for (let it = 0; it < nv; it++) {
    let changed = false;
    for (let e = 0; e < ne; e++) {
      const cand = dist[eu[e]] + W[e];
      if (cand < dist[ev[e]]) { dist[ev[e]] = cand; changed = true; }
    }
    if (!changed) break;
  }
  for (let e = 0; e < ne; e++) {
    if (dist[eu[e]] + W[e] < dist[ev[e]]) {
      throw new Error(`cycle-mean verification failed: a cycle with mean below ${num}/${den} exists`);
    }
  }
  // Achievability: cycle within edges of zero reduced cost.
  const zAdj = new Array(nv).fill(null).map(() => []);
  for (let e = 0; e < ne; e++) {
    if (dist[eu[e]] + W[e] === dist[ev[e]]) zAdj[eu[e]].push(ev[e]);
  }
  const color = new Uint8Array(nv);
  let found = false;
  for (let s = 0; s < nv && !found; s++) {
    if (color[s] !== 0) continue;
    const st = [[s, 0]];
    color[s] = 1;
    while (st.length > 0 && !found) {
      const fr = st[st.length - 1];
      if (fr[1] < zAdj[fr[0]].length) {
        const w = zAdj[fr[0]][fr[1]++];
        if (color[w] === 1) { found = true; break; }
        if (color[w] === 0) { color[w] = 1; st.push([w, 0]); }
      } else { color[fr[0]] = 2; st.pop(); }
    }
  }
  if (!found) throw new Error(`cycle-mean verification failed: no cycle attains mean ${num}/${den}`);
}

// ---------------------------------------------------------------------------
// Frequency intervals over all nontrivial SCCs
// ---------------------------------------------------------------------------

function frequencyIntervals(container) {
  const { states, adj, alive } = container;
  const n = adj.length;
  const liveNodes = [];
  for (let i = 0; i < n; i++) if (alive[i]) liveNodes.push(i);
  const { comp, ncomp } = tarjanSCC(liveNodes, adj, alive);

  const members = new Array(ncomp).fill(null).map(() => []);
  for (const v of liveNodes) members[comp[v]].push(v);

  const sccResults = [];
  for (let c = 0; c < ncomp; c++) {
    const vs = members[c];
    if (vs.length === 0) continue;
    const localId = new Map(vs.map((v, i) => [v, i]));
    const eu = [], ev = [], letters = [];
    for (const v of vs) {
      for (const w of adj[v]) {
        if (!alive[w] || comp[w] !== c) continue;
        eu.push(localId.get(v)); ev.push(localId.get(w)); letters.push(states[w] % 3);
      }
    }
    if (eu.length === 0) continue; // trivial SCC, cannot host a path tail
    const euA = Int32Array.from(eu), evA = Int32Array.from(ev);
    const res = { size: vs.length, edges: eu.length, perLetter: [] };
    for (let x = 0; x < 3; x++) {
      const wPos = new Int8Array(eu.length), wNeg = new Int8Array(eu.length);
      for (let e = 0; e < eu.length; e++) { const b = letters[e] === x ? 1 : 0; wPos[e] = b; wNeg[e] = -b; }
      const lo = karpMinCycleMean(vs.length, euA, evA, wPos);
      verifyMinCycleMean(vs.length, euA, evA, wPos, lo.num, lo.den);
      const hiNeg = karpMinCycleMean(vs.length, euA, evA, wNeg);
      verifyMinCycleMean(vs.length, euA, evA, wNeg, hiNeg.num, hiNeg.den);
      res.perLetter.push({ lo, hi: { num: -hiNeg.num, den: hiNeg.den } });
    }
    sccResults.push(res);
  }
  return sccResults;
}

// ---------------------------------------------------------------------------
// Word membership and counting (two independent code paths)
// ---------------------------------------------------------------------------

/** Trace a letter string through the graph. Returns -1 or failure position. */
function traceWord(str, container) {
  const { stateIdx, adj, states, m, powPrev } = container;
  const sym = [];
  for (const ch of str) {
    const c = ch.charCodeAt(0) - 97;
    if (c < 0 || c > 2) continue;
    sym.push(c);
  }
  if (sym.length < m) throw new Error('word shorter than memory');
  let code = 0;
  for (let i = 0; i < m; i++) code = code * 3 + sym[i];
  if (stateIdx[code] === -1) return m - 1;
  let cur = stateIdx[code];
  for (let i = m; i < sym.length; i++) {
    const ncode = (states[cur] % powPrev) * 3 + sym[i];
    if (stateIdx[ncode] === -1) return i;
    const nxt = stateIdx[ncode];
    if (!adj[cur].includes(nxt)) return i;
    cur = nxt;
  }
  return -1;
}

/** Count [2,kmax]-free words of length n via DP over the graph. */
function countViaDP(n, container) {
  const { adj, m } = container;
  const nv = adj.length;
  let cnt = new Float64Array(nv).fill(1);
  for (let t = m; t < n; t++) {
    const next = new Float64Array(nv);
    for (let v = 0; v < nv; v++) {
      if (cnt[v] === 0) continue;
      for (const w of adj[v]) next[w] += cnt[v];
    }
    cnt = next;
  }
  let total = 0;
  for (let v = 0; v < nv; v++) total += cnt[v];
  if (total >= 2 ** 53) throw new Error('DP count exceeds exact float53 range');
  return total;
}

/** Count [2,kmax]-free words of length n by direct DFS (independent path). */
function countViaDFS(n, kmax = 5) {
  let count = 0;
  const w = new Array(n);
  function ok(len) {
    for (let K = 2; K <= kmax; K++) {
      if (len < 2 * K) break;
      let da = 0, db = 0, dc = 0;
      for (let j = len - 2 * K; j < len - K; j++) { const c = w[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = len - K; j < len; j++) { const c = w[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      if (da === 0 && db === 0 && dc === 0) return false;
    }
    return true;
  }
  function rec(len) {
    if (len === n) { count++; return; }
    for (let s = 0; s < 3; s++) {
      w[len] = s;
      if (ok(len + 1)) rec(len + 1);
    }
  }
  rec(0);
  return count;
}

// ---------------------------------------------------------------------------
// Binary sub-alphabet question (OPEN_RESEARCH_QUESTIONS B6.3)
// ---------------------------------------------------------------------------

function binarySubAlphabetCycle(container) {
  const { states, adj, m } = container;
  const n = adj.length;
  const binary = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    let code = states[i], usesC = false;
    for (let j = 0; j < m; j++) { if (code % 3 === 2) { usesC = true; break; } code = Math.floor(code / 3); }
    binary[i] = usesC ? 0 : 1;
  }
  const color = new Uint8Array(n);
  for (let s = 0; s < n; s++) {
    if (!binary[s] || color[s] !== 0) continue;
    const st = [[s, 0]];
    color[s] = 1;
    while (st.length > 0) {
      const fr = st[st.length - 1];
      const v = fr[0];
      let advanced = false;
      while (fr[1] < adj[v].length) {
        const w = adj[v][fr[1]++];
        if (!binary[w]) continue;
        if (color[w] === 1) return true;
        if (color[w] === 0) { color[w] = 1; st.push([w, 0]); advanced = true; break; }
      }
      if (!advanced) { color[v] = 2; st.pop(); }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls(container) {
  const { states, stateIdx, adj, alive, m, kmax, sampleRejected } = container;

  // S3 closure of the state set (all 6 permutations, complete check).
  const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  for (const p of perms) {
    let ok = 0;
    for (const code of states) {
      let out = 0;
      const w = codeToWord(code, m);
      for (let j = 0; j < m; j++) out = out * 3 + p[w[j]];
      if (stateIdx[out] !== -1) ok++;
    }
    if (ok !== states.length) throw new Error('S3 closure violated: permuted state missing');
  }

  // Negative control: a word rejected during edge construction purely by the
  // K=kmax check must be a clean K=kmax abelian square with no smaller
  // violation, and traceWord must refuse it.
  if (sampleRejected === null) throw new Error('no edge was rejected by the K=kmax check - construction is suspect');
  if (!hasAbelianSquare(sampleRejected, kmax, kmax)) throw new Error('negative control is not a K=kmax abelian square');
  if (hasAbelianSquare(sampleRejected, 2, kmax - 1)) throw new Error('negative control unexpectedly contains a smaller square');
  const negStr = sampleRejected.map(c => 'abc'[c]).join('');
  if (traceWord(negStr, container) === -1) throw new Error('negative control traced as container word');

  // Positive control: the Keranen record word traces fully; skips cleanly
  // when the gitignored file is absent (same pattern as word-anatomy.js).
  const kf = path.join(__dirname, 'keranen_25379.txt');
  let keranenLength = 0;
  if (fs.existsSync(kf)) {
    const kw = fs.readFileSync(kf, 'utf8').trim();
    const fail = traceWord(kw, container);
    if (fail !== -1) throw new Error(`Keranen word rejected at position ${fail} - container or word is wrong`);
    keranenLength = kw.length;
  }

  // Counting cross-check: DP over the graph vs direct DFS.
  for (const n of [m + 3, m + 4]) {
    const a = countViaDP(n, container);
    const b = countViaDFS(n, kmax);
    if (a !== b) throw new Error(`count mismatch at n=${n}: DP ${a} vs DFS ${b}`);
  }

  let essential = 0;
  for (let i = 0; i < adj.length; i++) if (alive[i]) essential++;
  return { statesCount: states.length, essential, keranenLength };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function fmt(f) { return `${f.num}/${f.den} = ${(f.num / f.den).toFixed(6)}`; }

function main() {
  const args = process.argv.slice(2);
  let kmax = 5;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--kmax') kmax = parseInt(args[++i], 10);
  }

  console.log(`=== sft-container: the K in [2,${kmax}] container of Makela's problem ===\n`);

  const container = buildContainer(kmax);
  const ctrl = runControls(container);
  console.log(`[CONTROL] S3 closure of states holds (all 6 permutations)`);
  console.log(`[CONTROL] negative control (pure K=${kmax} square from edge construction) rejected`);
  if (ctrl.keranenLength > 0) {
    console.log(`[CONTROL] Keranen ${ctrl.keranenLength}-letter aa2f word traces through all ${ctrl.keranenLength - container.m} windows`);
  } else {
    console.log(`[CONTROL] SKIPPED: keranen_25379.txt not present (gitignored author data)`);
  }
  console.log(`[CONTROL] word counts agree between graph DP and direct DFS at n = ${container.m + 3}, ${container.m + 4}\n`);

  console.log(`memory: ${container.m}; states (no K in [2,${kmax - 1}] square): ${ctrl.statesCount} of ${container.raw}`);
  console.log(`essential states (on candidate bi-infinite paths): ${ctrl.essential}`);

  const t0 = Date.now();
  const sccs = frequencyIntervals(container);
  console.log(`nontrivial SCCs in the essential part: ${sccs.length} (interval computation ${(((Date.now() - t0)) / 1000).toFixed(1)}s)`);
  for (const s of sccs) {
    console.log(`  SCC: ${s.size} states, ${s.edges} internal edges`);
    for (let x = 0; x < 3; x++) {
      console.log(`    letter ${'abc'[x]}: frequency in [${fmt(s.perLetter[x].lo)}, ${fmt(s.perLetter[x].hi)}] (Karp + Bellman-Ford verified)`);
    }
    const same = s.perLetter.every(pl =>
      pl.lo.num === s.perLetter[0].lo.num && pl.lo.den === s.perLetter[0].lo.den &&
      pl.hi.num === s.perLetter[0].hi.num && pl.hi.den === s.perLetter[0].hi.den);
    if (!same) throw new Error('S3 symmetry violated: per-letter intervals differ');
    console.log(`    per-letter intervals coincide, as S3 symmetry requires`);
  }

  const binaryCycle = binarySubAlphabetCycle(container);
  console.log(`\nbinary sub-alphabet: infinite [2,${kmax}]-free word over two letters ${binaryCycle ? 'EXISTS (cycle found)' : 'does not exist (no cycle in the binary restriction)'}`);

  console.log('\nword counts in the container language (exact, graph DP):');
  const ns = [...new Set([container.m, container.m + 1, 12, 15, 20, 25, 30])].filter(n => n >= container.m).sort((a, b) => a - b);
  for (const n of ns) {
    console.log(`  n=${n}: ${countViaDP(n, container)}`);
  }

  console.log('\nReminder: this is a relaxation. Its intervals and cycles are necessary');
  console.log('conditions for any Makela witness, never sufficient ones. See MATH_CLAIMS.md.');
}

if (require.main === module) {
  main();
}

module.exports = { buildContainer, runControls, frequencyIntervals, traceWord, countViaDP, countViaDFS, binarySubAlphabetCycle, hasAbelianSquare, tarjanSCC, karpMinCycleMean, verifyMinCycleMean };
