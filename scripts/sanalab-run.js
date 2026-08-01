'use strict';

/**
 * sanalab-run.js
 * --------------
 * Resumable, certified search runs: the second half of the residue principle.
 *
 * WHY THIS EXISTS
 * ---------------
 * SANALAB_PLAN.md 5d defines wasted computation as a run that leaves nothing a
 * later run can consume. Extension tables (extension-table.js, MATH_CLAIMS.md
 * row 55) are one residue, but they were measured NOT to help record hunting
 * (NEGATIVE_RESULTS.md item 8), because branch-and-bound cannot prune when the
 * best keeps improving. The mechanism that does help records is different and
 * simpler: a budget-limited run must leave the exact point it stopped at, so
 * the next run continues instead of restarting. Ten runs of 1e8 nodes then
 * cover what one run of 1e9 would, across sessions and machines.
 *
 * THE SEARCH STATE, AND WHY IT IS EXACTLY RESUMABLE
 * -------------------------------------------------
 * The search is a depth-first walk of the prefix tree of the language. Its
 * complete state is the current path w[0..depth-1] together with, for each
 * level, the index of the next letter to try. Nothing else influences the
 * remainder of the walk, so serialising those two arrays reproduces the run
 * exactly. Written iteratively rather than recursively for that reason: the
 * recursion stack IS the checkpoint, so it must be an explicit object.
 *
 * The control that matters: a run split into k budget slices must produce the
 * same longest word, the same node count and the same terminal state as one
 * unsplit run. Asserted for 2-way and 3-way splits, not assumed.
 *
 * THREE TERMINAL STATES, NO OTHERS (SANALAB_PLAN.md 5c)
 * -----------------------------------------------------
 *   COMPLETE - the tree was walked to the end. The upper bound is decided:
 *              no word longer than `longest` exists over this alphabet.
 *   PARTIAL  - budget or length cap reached. Nothing is decided beyond the
 *              verified lower bound, and the checkpoint says exactly where
 *              the walk stopped.
 *   FAILED   - a control did not hold. No result from the run may be used.
 * A crashed process is distinguishable from all three: its event log has no
 * RUN_END record, and the last CHECKPOINT event states how far it got.
 *
 * Usage:
 *   node sanalab-run.js --alphabet 0,1,2,3 --budget 200000 --state s.json
 *   node sanalab-run.js --alphabet 0,1,2,3 --budget 200000 --state s.json --resume
 *   node sanalab-run.js --selftest
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Language predicate, stated here from the definition
// ---------------------------------------------------------------------------

/** True when the length-`len` prefix has no additive square ending at its end. */
function endsClean(ps, len) {
  for (let K = 1; 2 * K <= len; K++) {
    if (ps[len - K] - ps[len - 2 * K] === ps[len] - ps[len - K]) return false;
  }
  return true;
}

/** Definition-level check of a whole word, for witness verification. */
function hasAdditiveSquare(word) {
  const n = word.length;
  for (let k = 1; 2 * k <= n; k++) {
    for (let i = 0; i + 2 * k <= n; i++) {
      let s1 = 0, s2 = 0;
      for (let t = 0; t < k; t++) s1 += word[i + t];
      for (let t = 0; t < k; t++) s2 += word[i + k + t];
      if (s1 === s2) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Resumable iterative search
// ---------------------------------------------------------------------------

function freshState(A, cap) {
  return {
    alphabet: A.slice(), cap,
    w: [], idx: [0], depth: 0,
    longest: 0, witness: [],
    nodes: 0, hitCap: false, status: 'PARTIAL'
  };
}

/**
 * Advance the walk by at most `budget` nodes. Mutates and returns `state`.
 * Terminal status is COMPLETE when the tree is finished, PARTIAL otherwise.
 */
function advance(state, budget) {
  const A = state.alphabet, q = A.length, cap = state.cap;
  const w = state.w, idx = state.idx;
  // Prefix sums are derived, never stored: the word determines them.
  const ps = new Int32Array(cap + 2);
  for (let i = 0; i < state.depth; i++) ps[i + 1] = ps[i] + w[i];

  let depth = state.depth;
  let spent = 0;

  for (;;) {
    if (idx[depth] >= q) {
      if (depth === 0) { state.status = 'COMPLETE'; break; }
      depth--;
      idx[depth]++;
      continue;
    }
    if (spent >= budget) { state.status = 'PARTIAL'; break; }

    const s = A[idx[depth]];
    spent++; state.nodes++;
    w[depth] = s;
    ps[depth + 1] = ps[depth] + s;

    if (endsClean(ps, depth + 1)) {
      depth++;
      if (depth > state.longest) {
        state.longest = depth;
        state.witness = w.slice(0, depth);
      }
      if (depth === cap) {
        state.hitCap = true;
        depth--;
        idx[depth]++;
        continue;
      }
      idx[depth] = 0;
    } else {
      idx[depth]++;
    }
  }

  state.depth = depth;
  state.w = w.slice(0, Math.max(depth, 0));
  state.idx = idx.slice(0, depth + 1);
  return state;
}

/** Convenience: run to completion or budget in one call from scratch. */
function runFromScratch(A, cap, budget) {
  return advance(freshState(A, cap), budget);
}

// ---------------------------------------------------------------------------
// Events, checkpoints, certificate
// ---------------------------------------------------------------------------

function gitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: __dirname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (e) {
    return 'unknown';
  }
}

class EventLog {
  constructor(file) {
    this.file = file || null;
    this.lines = [];
  }
  emit(type, payload) {
    const rec = JSON.stringify(Object.assign({ t: new Date().toISOString(), event: type }, payload));
    this.lines.push(rec);
    if (this.file) fs.appendFileSync(this.file, rec + '\n');
    return rec;
  }
}

function saveState(file, state) {
  fs.writeFileSync(path.resolve(file), JSON.stringify(state));
}

function loadState(file) {
  const s = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  if (!Array.isArray(s.alphabet) || !Array.isArray(s.idx)) throw new Error('checkpoint is malformed');
  return s;
}

function certificate(state, extra = {}) {
  return Object.assign({
    module: 'sanalab-run',
    commit: gitCommit(),
    alphabet: state.alphabet,
    lengthCap: state.cap,
    status: state.status,
    nodesTotal: state.nodes,
    longest: state.longest,
    witness: state.witness,
    witnessVerified: !hasAdditiveSquare(state.witness),
    hitLengthCap: state.hitCap,
    upperBoundDecided: state.status === 'COMPLETE' && !state.hitCap
  }, extra);
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function runControls() {
  const notes = [];
  const A = [0, 1, 2, 3], CAP = 200;

  // 1. The iterative walk must agree with a plain recursive search.
  {
    let recLongest = 0, recNodes = 0;
    const w = new Int32Array(CAP + 1), ps = new Int32Array(CAP + 2);
    (function rec(len) {
      if (len > recLongest) recLongest = len;
      if (len === CAP) return;
      for (const s of A) {
        recNodes++;
        w[len] = s; ps[len + 1] = ps[len] + s;
        if (endsClean(ps, len + 1)) rec(len + 1);
      }
    })(0);
    const it = runFromScratch(A, CAP, 1e9);
    if (it.status !== 'COMPLETE') throw new Error('iterative walk did not complete on {0,1,2,3}');
    if (it.longest !== recLongest) throw new Error(`longest differs: iterative ${it.longest}, recursive ${recLongest}`);
    if (it.nodes !== recNodes) throw new Error(`node count differs: iterative ${it.nodes}, recursive ${recNodes}`);
    notes.push(`iterative walk matches a recursive search exactly: longest ${it.longest}, ${it.nodes} nodes`);
  }

  // 2. Resumption must be exact. A split run must equal an unsplit one in
  //    longest word, node count and terminal status. This is the whole point.
  {
    const whole = runFromScratch(A, CAP, 1e9);
    for (const slices of [2, 3, 7]) {
      const per = Math.ceil(whole.nodes / slices) - 3;   // deliberately uneven
      let st = freshState(A, CAP), rounds = 0;
      while (st.status !== 'COMPLETE') {
        st = advance(st, per);
        st = JSON.parse(JSON.stringify(st));            // force a real round-trip
        rounds++;
        if (rounds > slices + 10) throw new Error('resumption is not converging');
      }
      if (st.longest !== whole.longest) throw new Error(`resumed longest ${st.longest} vs whole ${whole.longest}`);
      if (st.nodes !== whole.nodes) throw new Error(`resumed nodes ${st.nodes} vs whole ${whole.nodes}`);
      if (JSON.stringify(st.witness) !== JSON.stringify(whole.witness)) throw new Error('resumed witness differs');
    }
    notes.push(`resuming across 2, 3 and 7 budget slices reproduces the unsplit run exactly (${whole.nodes} nodes)`);
  }

  // 3. A PARTIAL run must not claim a decided upper bound.
  {
    const st = runFromScratch(A, CAP, 1000);
    if (st.status !== 'PARTIAL') throw new Error('a 1000-node run over {0,1,2,3} should be PARTIAL');
    const cert = certificate(st);
    if (cert.upperBoundDecided) throw new Error('a PARTIAL run must never report a decided upper bound');
    if (!cert.witnessVerified) throw new Error('a PARTIAL run must still carry a verified witness');
    notes.push('a PARTIAL run reports no decided upper bound and still carries a verified witness');
  }

  // 4. Checkpoint serialisation must round-trip losslessly.
  {
    const st = runFromScratch(A, CAP, 5000);
    const back = JSON.parse(JSON.stringify(st));
    const a = advance(JSON.parse(JSON.stringify(st)), 1e9);
    const b = advance(back, 1e9);
    if (a.longest !== b.longest || a.nodes !== b.nodes) throw new Error('serialisation changed the continuation');
    notes.push('a serialised checkpoint continues identically to the in-memory one');
  }

  // 5. Ternary positive control, tied to MATH_CLAIMS.md row 1.
  {
    const st = runFromScratch([0, 1, 2], 40, 1e8);
    if (st.status !== 'COMPLETE' || st.longest !== 7) {
      throw new Error(`ternary control: status ${st.status}, longest ${st.longest}, expected COMPLETE and 7`);
    }
    if (hasAdditiveSquare(st.witness)) throw new Error('ternary control witness contains an additive square');
    notes.push('ternary control: the walk completes with longest 7 and a verified witness (row 1)');
  }

  return notes;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const opt = { alphabet: [0, 1, 2, 3], cap: 300, budget: 1e7, state: null, resume: false, log: null, selftest: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--alphabet') opt.alphabet = args[++i].split(',').map(Number);
    else if (args[i] === '--cap') opt.cap = parseInt(args[++i], 10);
    else if (args[i] === '--budget') opt.budget = Number(args[++i]);
    else if (args[i] === '--state') opt.state = args[++i];
    else if (args[i] === '--resume') opt.resume = true;
    else if (args[i] === '--log') opt.log = args[++i];
    else if (args[i] === '--selftest') opt.selftest = true;
  }

  console.log('=== sanalab-run: resumable search with per-run certificates ===\n');
  for (const n of runControls()) console.log(`[CONTROL] ${n}`);
  console.log('');
  if (opt.selftest) return;

  const log = new EventLog(opt.log);
  let state;
  if (opt.resume && opt.state && fs.existsSync(path.resolve(opt.state))) {
    state = loadState(opt.state);
    if (state.alphabet.join(',') !== opt.alphabet.join(',')) {
      throw new Error(`checkpoint is for alphabet {${state.alphabet}}, not {${opt.alphabet}}`);
    }
    console.log(`resuming from ${opt.state}: ${state.nodes} nodes already spent, longest so far ${state.longest}`);
  } else {
    state = freshState(opt.alphabet, opt.cap);
    console.log(`starting a fresh walk over {${opt.alphabet.join(',')}}, length cap ${opt.cap}`);
  }

  log.emit('RUN_START', {
    alphabet: opt.alphabet, cap: opt.cap, budget: opt.budget,
    commit: gitCommit(), resumedFrom: opt.resume ? opt.state : null,
    nodesBefore: state.nodes
  });

  const before = state.nodes, t0 = Date.now();
  advance(state, opt.budget);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);

  const cert = certificate(state, { nodesThisRun: state.nodes - before, seconds: Number(dt) });
  if (!cert.witnessVerified) {
    log.emit('RUN_END', { status: 'FAILED', reason: 'witness failed the definition check' });
    throw new Error('witness failed the definition check; no result from this run may be used');
  }
  log.emit('CHECKPOINT', { nodes: state.nodes, depth: state.depth, longest: state.longest });
  log.emit('RUN_END', cert);

  console.log(`\nstatus: ${state.status}   nodes this run: ${state.nodes - before}   total: ${state.nodes}   ${dt}s`);
  console.log(`lower bound: a word of length ${state.longest} exists (witness verified from the definition)`);
  if (cert.upperBoundDecided) {
    console.log(`upper bound: DECIDED - the walk finished, so no word of length ${state.longest + 1} exists over {${opt.alphabet.join(',')}}`);
  } else if (state.status === 'COMPLETE' && state.hitCap) {
    console.log(`upper bound: not decided - the walk finished only because the length cap ${opt.cap} was reached`);
  } else {
    console.log(`upper bound: not decided - budget spent. Nothing is claimed beyond the lower bound.`);
  }

  if (opt.state) {
    saveState(opt.state, state);
    console.log(`\ncheckpoint written to ${opt.state}. Re-run with --resume to continue from exactly here;`);
    console.log(`resumption is exact, so k runs of budget B cover what one run of k*B would.`);
  } else {
    console.log(`\nno --state given, so this run leaves no residue. That is the one thing the`);
    console.log(`residue principle asks you not to do (SANALAB_PLAN.md 5d).`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  endsClean, hasAdditiveSquare, freshState, advance, runFromScratch,
  saveState, loadState, certificate, EventLog, runControls
};
