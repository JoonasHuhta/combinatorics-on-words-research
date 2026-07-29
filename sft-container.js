'use strict';

/**
 * sft-container.js
 * ----------------
 * The K in [2,5] CONTAINER of Makela's problem, analyzed exactly.
 *
 * WHY THIS EXISTS
 * ---------------
 * The open part of Makela's conjecture concerns abelian squares of
 * half-length K in [2,5] (MATH_CLAIMS.md rows 4, 7b). An abelian square with
 * K <= 5 spans at most 10 letters, so the language "avoid ONLY K in [2,5]"
 * is a finite-window constraint, and EVERY witness of Makela's conjecture -
 * whatever route produces it - is an infinite word inside this container.
 * The container is therefore the one object that yields necessary conditions
 * for all attack routes at once (OPEN_RESEARCH_QUESTIONS.md B6).
 *
 * WHAT IS COMPUTED
 * ----------------
 * De Bruijn presentation with memory 9:
 *   states = ternary 9-words with no abelian square of half-length 2..4
 *            (a K=5 square needs 10 letters and cannot fit in 9);
 *   edge u -> v when u,v overlap in 8 letters and the 10-word u+last(v) is
 *            not itself an abelian square with K=5. Every factor of length
 *            <= 9 of the 10-word lies inside u or inside v, so this single
 *            check is complete.
 * A word of length n >= 9 avoids all K in [2,5] squares if and only if its
 * 9-windows are states and its consecutive windows are edges. The graph is
 * essentialized (iterated removal of in/out-degree-0 states), decomposed
 * into SCCs, and the exact min/max cycle means of each letter's indicator
 * weight are computed with Karp's algorithm in integer arithmetic.
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
 * SCC does not prove an infinite aa2f word). The frequency interval is a
 * pruning theorem: any candidate whose letter frequencies fall outside it
 * cannot be a witness.
 *
 * SELF-VERIFICATION (module refuses to report if any fails)
 * ---------------------------------------------------------
 *   - S3 closure of states and edges; per-letter intervals must coincide
 *   - Karp's lambda* re-verified independently by Bellman-Ford: no negative
 *     cycle at lambda*, and a zero-mean cycle exists (achievability)
 *   - path-count DP vs direct DFS enumeration of [2,5]-free words (two
 *     independent code paths) must agree at n = 12 and 13
 *   - positive control: the 25,379-letter Keranen aa2f record word (avoids
 *     ALL K >= 2, hence a fortiori the container constraint) must trace as
 *     a path through the graph, all 25,370 windows
 *   - negative control: aabbcbcbaa (a K=5 abelian square by construction)
 *     must be rejected
 *
 * Usage:  node sft-container.js
 */

const fs = require('fs');
const path = require('path');

const M = 9;                 // de Bruijn memory
const NSTATES_RAW = 19683;   // 3^9

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

// ---------------------------------------------------------------------------
// Container construction
// ---------------------------------------------------------------------------

function buildContainer() {
  // States
  const stateIdx = new Int32Array(NSTATES_RAW).fill(-1);
  const states = [];
  for (let code = 0; code < NSTATES_RAW; code++) {
    if (!hasAbelianSquare(codeToWord(code, M), 2, 4)) {
      stateIdx[code] = states.length;
      states.push(code);
    }
  }
  const n = states.length;

  // Edges: u -> (u drop first letter) + s, unless the 10-word is a K=5 square.
  const POW8 = Math.pow(3, 8);
  const adj = new Array(n);
  for (let i = 0; i < n; i++) {
    const code = states[i];
    const suffix = code % POW8;
    const out = [];
    for (let s = 0; s < 3; s++) {
      const ncode = suffix * 3 + s;
      if (stateIdx[ncode] === -1) continue;
      const w10 = codeToWord(code, M); w10.push(s);
      let da = 0, db = 0, dc = 0;
      for (let j = 0; j < 5; j++) { const c = w10[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = 5; j < 10; j++) { const c = w10[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      if (da === 0 && db === 0 && dc === 0) continue;
      out.push(stateIdx[ncode]);
    }
    adj[i] = out;
  }

  // Essentialize: keep only states on bi-infinite paths' candidates
  // (iterated trimming of out-degree-0 and in-degree-0 states).
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

  return { states, stateIdx, adj, alive };
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
    // iterative Tarjan
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
 * Min cycle mean of integer edge weights inside one SCC.
 * vertices: array of global vertex ids; edges: [from, to, weight] (local ids).
 * Returns { num, den } in lowest terms. Throws if the SCC has no cycle.
 */
function karpMinCycleMean(nv, edges) {
  const INF = 0x3f3f3f3f;
  // D[k*nv + v], k = 0..nv
  const D = new Int32Array((nv + 1) * nv).fill(INF);
  D[0] = 0; // source = local vertex 0
  for (let k = 1; k <= nv; k++) {
    const prev = (k - 1) * nv, cur = k * nv;
    for (const [u, v, w] of edges) {
      if (D[prev + u] === INF) continue;
      const cand = D[prev + u] + w;
      if (cand < D[cur + v]) D[cur + v] = cand;
    }
  }
  // lambda* = min over v of max over k of (D_n(v) - D_k(v)) / (n - k)
  let bestNum = 0, bestDen = 0; // empty
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

function gcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a === 0 ? 1 : a; }

/**
 * Independent verification of a claimed min cycle mean p/q:
 * with integer weights w*q - p, Bellman-Ford must find no negative cycle
 * (optimality) and the zero-reduced-cost subgraph must contain a cycle
 * (achievability). Throws on failure.
 */
function verifyMinCycleMean(nv, edges, num, den) {
  const W = edges.map(([u, v, w]) => [u, v, w * den - num]);
  const dist = new Float64Array(nv).fill(0); // 0-init: detects any negative cycle
  for (let it = 0; it < nv; it++) {
    let changed = false;
    for (const [u, v, w] of W) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of W) {
    if (dist[u] + w < dist[v]) {
      throw new Error(`cycle-mean verification failed: a cycle with mean < ${num}/${den} exists`);
    }
  }
  // Achievability: cycle within edges of zero reduced cost.
  const zAdj = new Array(nv).fill(null).map(() => []);
  for (const [u, v, w] of W) {
    if (dist[u] + w === dist[v]) zAdj[u].push(v);
  }
  const color = new Uint8Array(nv); // 0 white, 1 gray, 2 black
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

  // group by component; a component is nontrivial if it has an internal edge
  const members = new Array(ncomp).fill(null).map(() => []);
  for (const v of liveNodes) members[comp[v]].push(v);

  const sccResults = [];
  for (let c = 0; c < ncomp; c++) {
    const vs = members[c];
    if (vs.length === 0) continue;
    const localId = new Map(vs.map((v, i) => [v, i]));
    let internal = 0;
    const edgesByLetter = [[], [], []]; // weight = 1 if appended letter == x
    const edgesNegByLetter = [[], [], []];
    for (const v of vs) {
      for (const w of adj[v]) {
        if (!alive[w] || comp[w] !== c) continue;
        internal++;
        const letter = states[w] % 3;
        for (let x = 0; x < 3; x++) {
          const wt = letter === x ? 1 : 0;
          edgesByLetter[x].push([localId.get(v), localId.get(w), wt]);
          edgesNegByLetter[x].push([localId.get(v), localId.get(w), -wt]);
        }
      }
    }
    if (internal === 0) continue; // trivial SCC, cannot host a path tail
    const res = { size: vs.length, edges: internal, perLetter: [] };
    for (let x = 0; x < 3; x++) {
      const lo = karpMinCycleMean(vs.length, edgesByLetter[x]);
      verifyMinCycleMean(vs.length, edgesByLetter[x], lo.num, lo.den);
      const hiNeg = karpMinCycleMean(vs.length, edgesNegByLetter[x]);
      verifyMinCycleMean(vs.length, edgesNegByLetter[x], hiNeg.num, hiNeg.den);
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
  const { stateIdx, adj, states } = container;
  const sym = [];
  for (const ch of str) {
    const c = ch.charCodeAt(0) - 97;
    if (c < 0 || c > 2) continue; // ignore whitespace/other
    sym.push(c);
  }
  if (sym.length < M) throw new Error('word shorter than memory');
  let code = 0;
  for (let i = 0; i < M; i++) code = code * 3 + sym[i];
  if (stateIdx[code] === -1) return M - 1;
  let cur = stateIdx[code];
  const POW8 = Math.pow(3, 8);
  for (let i = M; i < sym.length; i++) {
    const ncode = (states[cur] % POW8) * 3 + sym[i];
    if (stateIdx[ncode] === -1) return i;
    const nxt = stateIdx[ncode];
    if (!adj[cur].includes(nxt)) return i;
    cur = nxt;
  }
  return -1;
}

/** Count [2,5]-free words of length n via DP over the graph. */
function countViaDP(n, container) {
  const { adj } = container;
  const nv = adj.length;
  let cnt = new Float64Array(nv).fill(1); // every state = one word of length 9
  for (let t = M; t < n; t++) {
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

/** Count [2,5]-free words of length n by direct DFS (independent path). */
function countViaDFS(n) {
  let count = 0;
  const w = new Array(n);
  function ok(len) {
    // check squares K in [2,5] ending at position len-1
    for (let K = 2; K <= 5; K++) {
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
  // Does any infinite [2,5]-free word over a 2-letter sub-alphabet exist?
  // By S3 symmetry it suffices to test {a,b}: restrict to states whose 9
  // letters avoid 'c' and to edges appending 'a' or 'b', then look for a cycle.
  const { states, adj } = container;
  const n = adj.length;
  const binary = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    let code = states[i], usesC = false;
    for (let j = 0; j < M; j++) { if (code % 3 === 2) { usesC = true; break; } code = Math.floor(code / 3); }
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
  const { states, stateIdx, adj, alive } = container;

  // S3 closure of the state set and edge set.
  const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function permCode(code, p) {
    let out = 0;
    const w = codeToWord(code, M);
    for (let j = 0; j < M; j++) out = out * 3 + p[w[j]];
    return out;
  }
  for (const p of perms) {
    for (let i = 0; i < states.length; i += 97) { // stride sample plus full closure check below
      if (stateIdx[permCode(states[i], p)] === -1) throw new Error('S3 closure violated for states');
    }
  }
  // full closure count check (cheap and complete): permuted set must be the same set
  for (const p of perms) {
    let ok = 0;
    for (const code of states) if (stateIdx[permCode(code, p)] !== -1) ok++;
    if (ok !== states.length) throw new Error('S3 closure violated: permuted state missing');
  }

  // Negative control: an explicit K=5 abelian square must be rejected.
  const neg = 'aabbcbcbaa';
  const negSym = neg.split('').map(ch => ch.charCodeAt(0) - 97);
  if (!hasAbelianSquare(negSym, 5, 5)) throw new Error('negative control is not a K=5 abelian square');
  if (traceWord(neg + 'abc', container) === -1) throw new Error('negative control traced as container word');

  // Positive control: the Keranen record word traces fully. The record files
  // are gitignored (author's data, not redistributed), so like word-anatomy.js
  // this control skips cleanly when the file is absent - and says so.
  const kf = path.join(__dirname, 'keranen_25379.txt');
  let keranenLength = 0;
  if (fs.existsSync(kf)) {
    const kw = fs.readFileSync(kf, 'utf8').trim();
    const fail = traceWord(kw, container);
    if (fail !== -1) throw new Error(`Keranen word rejected at position ${fail} - container or word is wrong`);
    keranenLength = kw.length;
  }

  // Counting cross-check: DP over the graph vs direct DFS, n = 12 and 13.
  for (const n of [12, 13]) {
    const a = countViaDP(n, container);
    const b = countViaDFS(n);
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
  console.log('=== sft-container: the K in [2,5] container of Makela\'s problem ===\n');

  const container = buildContainer();
  const ctrl = runControls(container);
  console.log(`[CONTROL] S3 closure of states holds (all 6 permutations)`);
  console.log(`[CONTROL] negative control aabbcbcbaa (K=5 square) rejected`);
  if (ctrl.keranenLength > 0) {
    console.log(`[CONTROL] Keranen ${ctrl.keranenLength}-letter aa2f word traces through all ${ctrl.keranenLength - M} windows`);
  } else {
    console.log(`[CONTROL] SKIPPED: keranen_25379.txt not present (gitignored author data)`);
  }
  console.log(`[CONTROL] word counts agree between graph DP and direct DFS at n = 12, 13\n`);

  console.log(`states (9-words, no K in [2,4] square): ${ctrl.statesCount} of ${NSTATES_RAW}`);
  console.log(`essential states (on candidate bi-infinite paths): ${ctrl.essential}`);

  const sccs = frequencyIntervals(container);
  console.log(`nontrivial SCCs in the essential part: ${sccs.length}`);
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
  console.log(`\nbinary sub-alphabet: infinite [2,5]-free word over two letters ${binaryCycle ? 'EXISTS (cycle found)' : 'does not exist (no cycle in the binary restriction)'}`);

  console.log('\nword counts in the container language (exact, graph DP):');
  for (const n of [9, 10, 12, 15, 20, 25, 30]) {
    console.log(`  n=${n}: ${countViaDP(n, container)}`);
  }

  console.log('\nReminder: this is a relaxation. Its intervals and cycles are necessary');
  console.log('conditions for any Makela witness, never sufficient ones. See MATH_CLAIMS.md.');
}

if (require.main === module) {
  main();
}

module.exports = { buildContainer, runControls, frequencyIntervals, traceWord, countViaDP, countViaDFS, binarySubAlphabetCycle, hasAbelianSquare, tarjanSCC, karpMinCycleMean, verifyMinCycleMean };
