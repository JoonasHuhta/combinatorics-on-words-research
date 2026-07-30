'use strict';

/**
 * unavoidable-factors.js
 * ----------------------
 * Factors that EVERY infinite word of the container language must contain,
 * hence that every possible witness to Makela's conjecture must contain.
 *
 * WHY THIS EXISTS
 * ---------------
 * OPEN_RESEARCH_QUESTIONS.md B7. The K in [2,5] container is a relaxation of
 * the aa2f language (MATH_CLAIMS.md rows 51-52), so every Makela witness lives
 * inside it. Anything true of all infinite container words is therefore a
 * NECESSARY CONDITION on every witness, whatever route eventually produces one.
 *
 * Rows 51-52 gave necessary conditions on letter FREQUENCIES, and recorded
 * honestly that the interval [1/11, 3/4] is too wide to prune candidates
 * usefully. This module asks a sharper question with the same machinery: which
 * FACTORS are forced? A statement of the form "every witness contains uvw" is
 * structural rather than statistical, and it is the first result of that shape
 * this project can produce.
 *
 * THE CRITERION, AND WHY IT IS EXACT
 * ----------------------------------
 * A factor u is AVOIDABLE if some infinite container word omits it. Delete
 * every state whose window contains u; an infinite word avoiding u exists
 * exactly when the surviving graph still has a cycle. So
 *
 *     u is unavoidable  <=>  the u-free subgraph is acyclic.
 *
 * Both directions are finite and exact. Acyclicity is decided by an iterative
 * DFS colouring, not by a depth bound, so nothing here is a heuristic.
 *
 * The window is the limit of the method: states carry only 9 letters, so this
 * decides factors of length at most the memory. Longer factors need a larger
 * container, whose cost grows as 3^(2k-1) (row 52).
 *
 * WHAT A RESULT MEANS
 * -------------------
 * Unavoidable in the CONTAINER implies unavoidable in every subset of it,
 * including the aa2f language and any witness. The converse fails: a factor
 * avoidable in the container may still be unavoidable in aa2f, because aa2f is
 * smaller. This module therefore produces necessary conditions only, and never
 * licenses the phrase "aa2f must contain u" - only "every container word, and
 * hence every witness, must contain u".
 *
 * Usage:  node unavoidable-factors.js [--kmax 5] [--maxlen 6]
 */

const sc = require('./sft-container.js');

const LETTERS = 'abc';

// ---------------------------------------------------------------------------
// Factor occurrence inside a state window
// ---------------------------------------------------------------------------

function stateWord(container, stateIndex) {
  const code = container.states[stateIndex];
  const w = new Array(container.m);
  let c = code;
  for (let i = container.m - 1; i >= 0; i--) { w[i] = c % 3; c = Math.floor(c / 3); }
  return w;
}

/**
 * All state windows as LETTER strings, materialised once.
 * The container stores symbols as digits 0..2; factors are written over
 * {a,b,c}, so the conversion happens here and only here.
 */
function allStateWords(container) {
  const out = new Array(container.adj.length);
  for (let i = 0; i < out.length; i++) {
    out[i] = stateWord(container, i).map(d => LETTERS[d]).join('');
  }
  return out;
}

// ---------------------------------------------------------------------------
// Acyclicity of the subgraph that avoids a factor
// ---------------------------------------------------------------------------

/**
 * True when the subgraph induced by `keep` contains a cycle. Iterative
 * three-colour DFS; no recursion, so state count is not a stack limit.
 */
function hasCycle(adj, keep) {
  const n = adj.length;
  const colour = new Uint8Array(n);          // 0 white, 1 grey, 2 black
  const iter = new Int32Array(n);
  const stack = new Int32Array(n + 1);
  for (let s = 0; s < n; s++) {
    if (!keep[s] || colour[s] !== 0) continue;
    let top = 0;
    stack[top] = s; colour[s] = 1; iter[s] = 0;
    while (top >= 0) {
      const v = stack[top];
      if (iter[v] < adj[v].length) {
        const w = adj[v][iter[v]++];
        if (!keep[w]) continue;
        if (colour[w] === 1) return true;    // back edge
        if (colour[w] === 0) { colour[w] = 1; iter[w] = 0; stack[++top] = w; }
      } else {
        colour[v] = 2; top--;
      }
    }
  }
  return false;
}

/**
 * Decide one factor. Returns { unavoidable, keptStates } and, when the factor
 * is avoidable, a witness cycle proving it.
 */
function decideFactor(container, words, u) {
  const n = container.adj.length;
  const keep = new Uint8Array(n);
  let kept = 0;
  for (let i = 0; i < n; i++) {
    if (container.alive[i] && !words[i].includes(u)) { keep[i] = 1; kept++; }
  }
  const cyclic = kept > 0 && hasCycle(container.adj, keep);
  return { unavoidable: !cyclic, keptStates: kept };
}

/** An explicit cycle in the u-free subgraph, as proof that u is avoidable. */
function avoidingCycle(container, words, u) {
  const n = container.adj.length;
  const keep = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (container.alive[i] && !words[i].includes(u)) keep[i] = 1;
  const colour = new Uint8Array(n), iter = new Int32Array(n), parent = new Int32Array(n).fill(-1);
  const stack = new Int32Array(n + 1);
  for (let s = 0; s < n; s++) {
    if (!keep[s] || colour[s] !== 0) continue;
    let top = 0; stack[top] = s; colour[s] = 1; iter[s] = 0;
    while (top >= 0) {
      const v = stack[top];
      if (iter[v] < container.adj[v].length) {
        const w = container.adj[v][iter[v]++];
        if (!keep[w]) continue;
        if (colour[w] === 1) {
          const cyc = [w];
          for (let x = v; x !== w && x !== -1; x = parent[x]) cyc.push(x);
          cyc.reverse();
          return cyc.map(i => words[i]);
        }
        if (colour[w] === 0) { colour[w] = 1; iter[w] = 0; parent[w] = v; stack[++top] = w; }
      } else { colour[v] = 2; top--; }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Enumeration of candidate factors, reduced by S3
// ---------------------------------------------------------------------------

const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

function canonicalFactor(u) {
  let best = null;
  for (const p of PERMS) {
    const img = u.split('').map(ch => LETTERS[p[LETTERS.indexOf(ch)]]).join('');
    if (best === null || img < best) best = img;
  }
  return best;
}

/** Factors of the container language of a given length, up to S3. */
function containerFactors(container, words, len) {
  const seen = new Set();
  for (const w of words) {
    for (let i = 0; i + len <= w.length; i++) seen.add(w.slice(i, i + len));
  }
  const canon = new Set();
  for (const f of seen) canon.add(canonicalFactor(f));
  return [...canon].sort();
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls(container, words) {
  const notes = [];

  // 1. Single letters must be unavoidable. Row 51 established there is no
  //    infinite container word over two letters, which says exactly that
  //    omitting one letter kills the language. Different code path, same fact.
  for (const c of LETTERS) {
    const r = decideFactor(container, words, c);
    if (!r.unavoidable) throw new Error(`letter ${c} came out avoidable, contradicting row 51's binary result`);
  }
  notes.push('every single letter is unavoidable, agreeing with row 51 by a different code path');

  // 2. An avoidable factor must come with an explicit cycle that avoids it.
  //    A verdict of "avoidable" is worthless without the witness.
  let checked = 0;
  for (const u of containerFactors(container, words, 2)) {
    const r = decideFactor(container, words, u);
    if (r.unavoidable) continue;
    const cyc = avoidingCycle(container, words, u);
    if (!cyc) throw new Error(`factor ${u} reported avoidable but no avoiding cycle could be exhibited`);
    for (const s of cyc) if (s.includes(u)) throw new Error(`avoiding cycle for ${u} contains ${u}`);
    checked++;
  }
  if (checked === 0) throw new Error('no avoidable length-2 factor found; the control exercised nothing');
  notes.push(`every avoidable length-2 factor carries an explicit avoiding cycle (${checked} checked)`);

  // 3. Monotonicity. If u is unavoidable then so is every factor of u:
  //    a word containing u contains all of them.
  const un3 = containerFactors(container, words, 3).filter(u => decideFactor(container, words, u).unavoidable);
  for (const u of un3) {
    for (let i = 0; i < u.length - 1; i++) {
      const sub = u.slice(i, i + 2);
      if (!decideFactor(container, words, sub).unavoidable) {
        throw new Error(`${u} is unavoidable but its factor ${sub} is not; the criterion is inconsistent`);
      }
    }
  }
  notes.push(`unavoidability is inherited by subfactors, checked on ${un3.length} length-3 case(s)`);

  // 4. A factor that occurs in no state must come out AVOIDABLE, and the
  //    direction matters: "unavoidable" means every infinite word contains it,
  //    so something contained by no word is avoidable, not vacuously forced.
  //    Written the other way round on the first attempt; the control caught it.
  const absent = 'aaaa';
  if (words.some(w => w.includes(absent))) throw new Error('control factor unexpectedly occurs; pick another');
  const r = decideFactor(container, words, absent);
  if (r.unavoidable) throw new Error(`${absent} occurs in no state yet was reported unavoidable`);
  if (r.keptStates !== words.filter((_, i) => container.alive[i]).length) {
    throw new Error('removing an absent factor changed the state count');
  }
  notes.push(`a factor occurring nowhere (${absent}) is avoidable and leaves the graph untouched`);

  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  let kmax = 5, maxlen = 6;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--kmax') kmax = parseInt(args[++i], 10);
    else if (args[i] === '--maxlen') maxlen = parseInt(args[++i], 10);
  }

  console.log(`=== unavoidable-factors: what every K in [2,${kmax}] container word must contain ===\n`);

  const container = sc.buildContainer(kmax);
  const words = allStateWords(container);
  for (const n of runControls(container, words)) console.log(`[CONTROL] ${n}`);
  console.log('');
  console.log(`container memory ${container.m}, states ${container.states.length}, essential ${words.filter((_, i) => container.alive[i]).length}\n`);

  const summary = [];
  for (let len = 1; len <= Math.min(maxlen, container.m); len++) {
    const cands = containerFactors(container, words, len);
    const unav = [];
    const t0 = Date.now();
    for (const u of cands) {
      if (decideFactor(container, words, u).unavoidable) unav.push(u);
    }
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    summary.push({ len, cands: cands.length, unav: unav.length });
    console.log(`length ${len}: ${cands.length} factor classes up to S3, ${unav.length} unavoidable   [${dt}s]`);
    if (unav.length && unav.length <= 24) {
      console.log(`   ${unav.join(' ')}`);
    } else if (unav.length) {
      console.log(`   ${unav.slice(0, 24).join(' ')} ... (${unav.length - 24} more)`);
    }
  }

  console.log('\nA factor listed above occurs in EVERY infinite word of this container, hence in');
  console.log('every possible witness to Makela\'s conjecture. The converse does not hold: a');
  console.log('factor avoidable here may still be unavoidable in the smaller aa2f language.');
  console.log(`Coverage: factors of length at most the container memory (${container.m}).`);
}

if (require.main === module) {
  main();
}

module.exports = { allStateWords, hasCycle, decideFactor, avoidingCycle, canonicalFactor, containerFactors, runControls };
