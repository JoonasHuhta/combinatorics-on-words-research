// c:\\abc\\aa2fr-worker.js
// AA2FR Experimental Mathematics Laboratory - Search Engine Worker

function aa2frWorkerMain() {
if (typeof self === 'undefined') { var self = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this); }
// -------------------------------------------------------------------------
// STATE & CONFIGURATION
// -------------------------------------------------------------------------

let isRunning = false;
let isPaused = false;
let config = {
  seed: '',
  mode: 'aa2fr',
  direction: 'right',
  strategy: 'fixed',
  analyticsEnabled: true
};

let strategyParams = {};

// DFS State
let wordArr = [];
let wordLen = 0;
let maxLen = 0;
let stack = [];
let currentDepth = 0;

// Prefix-sum arrays for O(1) Parikh vector queries
// Allocate enough for max depth, e.g., 50000
const MAX_DEPTH = 50000;
let prefixA = new Int32Array(MAX_DEPTH);
let prefixB = new Int32Array(MAX_DEPTH);
let prefixC = new Int32Array(MAX_DEPTH);
let prefixPacked = new Float64Array(MAX_DEPTH); // a=0, b=1, c=65536 (2^16), Float64 avoids 32-bit overflow up to 2^53

let letters = ['a', 'b', 'c'];
const FORBID4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];

// Stats
let stats = {
  steps: 0,
  backtracks: 0,
  deadEnds: 0,
  startTime: 0,
  lastYieldTime: 0,
  stepsSinceNewRecord: 0
};

// Analytics Data Collection
let analyticsBuffer = [];
let evolutionBuffer = [];
let lastAnalyticsSendTime = 0;
let lastStateSendTime = 0;

// Running aggregates
let branchingHistory = [];
let backtrackHistory = [];
let letterCounts = { a: 0, b: 0, c: 0 };
let obstructionCounts = {};
let engineConfig = {};

// Motif Tracking (Evidence-Based Discovery Engine)
let motifStats = new Map(); // key -> { occ:0, dead:0, surv:0, branchSum:0, depthSum:0, maxLen:0, parikhU:0 }
let parikhTrajectory = [];

// Strategies state
const PERMUTATIONS = [
  ['a','b','c'], ['c','b','a'], ['b','a','c'],
  ['b','c','a'], ['c','a','b'], ['a','c','b']
];
let currentPermutationIdx = 0;

// -------------------------------------------------------------------------
// STAGE 11 DYNAMIC ALGORITHMIC LABORATORY TOOLS
// -------------------------------------------------------------------------

class ParikhFenwickTree {
  constructor(size) {
    this.size = size;
    this.treeA = new Int32Array(size + 1);
    this.treeB = new Int32Array(size + 1);
    this.treeC = new Int32Array(size + 1);
    this.word = new Array(size).fill('');
  }
  add(idx, deltaA, deltaB, deltaC) {
    for (++idx; idx <= this.size; idx += idx & -idx) {
      this.treeA[idx] += deltaA;
      this.treeB[idx] += deltaB;
      this.treeC[idx] += deltaC;
    }
  }
  setLetter(idx, char) {
    let old = this.word[idx];
    if (old === char) return;
    let dA = (char === 'a' ? 1 : 0) - (old === 'a' ? 1 : 0);
    let dB = (char === 'b' ? 1 : 0) - (old === 'b' ? 1 : 0);
    let dC = (char === 'c' ? 1 : 0) - (old === 'c' ? 1 : 0);
    this.word[idx] = char;
    this.add(idx, dA, dB, dC);
  }
  query(idx) {
    let sumA = 0, sumB = 0, sumC = 0;
    for (; idx > 0; idx -= idx & -idx) {
      sumA += this.treeA[idx];
      sumB += this.treeB[idx];
      sumC += this.treeC[idx];
    }
    return { a: sumA, b: sumB, c: sumC };
  }
  rangeQuery(L, R) {
    let right = this.query(R);
    let left = this.query(L);
    return { a: right.a - left.a, b: right.b - left.b, c: right.c - left.c };
  }
  isAbelianSquare(idx, K) {
    if (idx < 2 * K) return false;
    let right = this.rangeQuery(idx - K, idx);
    let left = this.rangeQuery(idx - 2 * K, idx - K);
    return right.a === left.a && right.b === left.b && right.c === left.c;
  }
}

class RecursiveParikhOracle {
  constructor(morphismMap, maxDepth = 40) {
    this.map = morphismMap;
    this.alphabet = Object.keys(morphismMap).sort();
    this.maxDepth = maxDepth;
    this.precomputed = [];
    this._precompute();
  }
  _precompute() {
    let level0 = {};
    for (let c of this.alphabet) {
      level0[c] = {};
      for (let a of this.alphabet) level0[c][a] = 0;
      level0[c][c] = 1;
    }
    this.precomputed.push(level0);
    this._ensureDepth(this.maxDepth);
  }
  _ensureDepth(targetDepth) {
    while (this.precomputed.length <= targetDepth) {
      let d = this.precomputed.length;
      let prev = this.precomputed[d - 1];
      let curr = {};
      for (let c of this.alphabet) {
        let vec = {};
        for (let a of this.alphabet) vec[a] = 0;
        let img = this.map[c];
        for (let i = 0; i < img.length; i++) {
          let childChar = img[i];
          let childVec = prev[childChar];
          for (let a of this.alphabet) vec[a] += (childVec[a] || 0);
        }
        curr[c] = vec;
      }
      this.precomputed.push(curr);
    }
  }
  _addVec(target, source) {
    for (let k in source) target[k] = (target[k] || 0) + source[k];
  }
  queryPrefix(letter, depth, L) {
    this._ensureDepth(depth);
    let res = {};
    for (let a of this.alphabet) res[a] = 0;
    if (L <= 0) return res;
    let totalSize = 0;
    for (let k in this.precomputed[depth][letter]) totalSize += this.precomputed[depth][letter][k];
    if (L >= totalSize) {
      this._addVec(res, this.precomputed[depth][letter]);
      return res;
    }
    if (depth === 0) return res;
    let img = this.map[letter];
    let rem = L;
    for (let i = 0; i < img.length; i++) {
      if (rem <= 0) break;
      let childChar = img[i];
      let childSize = 0;
      for (let k in this.precomputed[depth - 1][childChar]) childSize += this.precomputed[depth - 1][childChar][k];
      if (rem >= childSize) {
        this._addVec(res, this.precomputed[depth - 1][childChar]);
        rem -= childSize;
      } else {
        let sub = this.queryPrefix(childChar, depth - 1, rem);
        this._addVec(res, sub);
        rem = 0;
        break;
      }
    }
    return res;
  }
  rangeQuery(letter, depth, i, j) {
    if (i < 0) i = 0;
    if (j < i) j = i;
    let right = this.queryPrefix(letter, depth, j);
    let left = this.queryPrefix(letter, depth, i);
    let res = {};
    for (let a of this.alphabet) res[a] = (right[a] || 0) - (left[a] || 0);
    return res;
  }
}

function weldBridge(U, V, maxBridgeLen = 6, minPeriod = 1, maxPeriod = 5, maxResults = 10) {
  const alphabet = ['a', 'b', 'c'];
  const results = [];
  function hasAbelianSquare(s) {
    const len = s.length;
    const pA = new Int32Array(len + 1);
    const pB = new Int32Array(len + 1);
    const pC = new Int32Array(len + 1);
    for (let i = 0; i < len; i++) {
      pA[i + 1] = pA[i] + (s[i] === 'a' ? 1 : 0);
      pB[i + 1] = pB[i] + (s[i] === 'b' ? 1 : 0);
      pC[i + 1] = pC[i] + (s[i] === 'c' ? 1 : 0);
    }
    for (let K = minPeriod; K <= maxPeriod; K++) {
      for (let i = 0; i <= len - 2 * K; i++) {
        const da = (pA[i + K] - pA[i]) - (pA[i + 2 * K] - pA[i + K]);
        if (da !== 0) continue;
        const db = (pB[i + K] - pB[i]) - (pB[i + 2 * K] - pB[i + K]);
        if (db !== 0) continue;
        const dc = (pC[i + K] - pC[i]) - (pC[i + 2 * K] - pC[i + K]);
        if (dc === 0) return true;
      }
    }
    return false;
  }
  if (!hasAbelianSquare(U + V)) {
    results.push({ bridge: "", word: U + V, length: 0 });
    if (results.length >= maxResults) return results;
  }
  function dfs(currentW) {
    if (results.length >= maxResults) return;
    if (hasAbelianSquare(U + currentW)) return;
    if (!hasAbelianSquare(U + currentW + V)) {
      results.push({ bridge: currentW, word: U + currentW + V, length: currentW.length });
      if (results.length >= maxResults) return;
    }
    if (currentW.length >= maxBridgeLen) return;
    for (let c of alphabet) {
      dfs(currentW + c);
      if (results.length >= maxResults) return;
    }
  }
  for (let c of alphabet) dfs(c);
  return results;
}

function replicateP6(iterations = 4, maxK = 30) {
  let w = "a";
  for (let d = 0; d < iterations; d++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6[w[i]];
    w = next;
  }
  let g = "";
  for (let i = 0; i < w.length; i++) g += G3[w[i]];
  const len = g.length;
  const pA = new Int32Array(len + 1);
  const pB = new Int32Array(len + 1);
  const pC = new Int32Array(len + 1);
  for (let i = 0; i < len; i++) {
    pA[i + 1] = pA[i] + (g[i] === 'a' ? 1 : 0);
    pB[i + 1] = pB[i] + (g[i] === 'b' ? 1 : 0);
    pC[i + 1] = pC[i] + (g[i] === 'c' ? 1 : 0);
  }
  let collisionsFound = 0;
  for (let K = 6; K <= maxK; K++) {
    for (let i = 0; i <= len - 2 * K; i++) {
      const da = (pA[i + K] - pA[i]) - (pA[i + 2 * K] - pA[i + K]);
      if (da !== 0) continue;
      const db = (pB[i + K] - pB[i]) - (pB[i + 2 * K] - pB[i + K]);
      if (db !== 0) continue;
      const dc = (pC[i + K] - pC[i]) - (pC[i + 2 * K] - pC[i + K]);
      if (dc === 0) collisionsFound++;
    }
  }
  return {
    ok: collisionsFound === 0,
    p: 6,
    testedLength: len,
    maxPeriodChecked: maxK,
    collisionsFound,
    status: collisionsFound === 0 ? "p=6 replication verified (0 collisions for K >= 6)" : `FAILED: found ${collisionsFound} collisions for K >= 6`
  };
}

function runNegativeControlTest() {
  const chars = ['a', 'b', 'c'];
  let maxLenFound = 0;
  let countLen7 = 0;
  let countLen8 = 0;
  
  function isASFree(w) {
    const len = w.length;
    for (let K = 1; K <= Math.floor(len / 2); K++) {
      let ca = 0, cb = 0, cc = 0;
      for (let j = 0; j < K; j++) {
        const ch = w[len - 2 * K + j];
        if (ch === 'a') ca++; else if (ch === 'b') cb++; else if (ch === 'c') cc++;
      }
      for (let j = 0; j < K; j++) {
        const ch = w[len - K + j];
        if (ch === 'a') ca--; else if (ch === 'b') cb--; else if (ch === 'c') cc--;
      }
      if (ca === 0 && cb === 0 && cc === 0) return false;
    }
    return true;
  }

  function dfs(w) {
    if (w.length > maxLenFound) maxLenFound = w.length;
    if (w.length === 7) countLen7++;
    if (w.length === 8) { countLen8++; return; }
    for (const c of chars) {
      if (isASFree(w + c)) dfs(w + c);
    }
  }

  dfs("");
  
  return {
    ok: maxLenFound === 7 && countLen7 === 18 && countLen8 === 0,
    maxLenFound,
    countLen7,
    countLen8,
    status: (maxLenFound === 7 && countLen7 === 18 && countLen8 === 0) 
      ? "NEGATIVE CONTROL PASSED: Exact ternary cutoff at length 7 verified (18 words of len 7, 0 words of len 8)" 
      : `FAILED: max length ${maxLenFound}, len 7 count ${countLen7}, len 8 count ${countLen8}`
  };
}

// -------------------------------------------------------------------------
// CORE VALIDATION ENGINE
// -------------------------------------------------------------------------

// Helper to push a letter and update prefix sums
function pushLetter(char) {
  wordArr[wordLen] = char;

  let valA = 0, valB = 0, valC = 0, valPacked = 0;
  if (char === 'a') { valA = 1; valPacked = 0; letterCounts.a++; }
  else if (char === 'b') { valB = 1; valPacked = 1; letterCounts.b++; }
  else if (char === 'c') { valC = 1; valPacked = 65536; letterCounts.c++; }

  let pA = wordLen === 0 ? 0 : prefixA[wordLen - 1];
  let pB = wordLen === 0 ? 0 : prefixB[wordLen - 1];
  let pC = wordLen === 0 ? 0 : prefixC[wordLen - 1];
  let pPacked = wordLen === 0 ? 0 : prefixPacked[wordLen - 1];

  prefixA[wordLen] = pA + valA;
  prefixB[wordLen] = pB + valB;
  prefixC[wordLen] = pC + valC;
  prefixPacked[wordLen] = pPacked + valPacked;

  wordLen++;
}

// Helper to pop a letter
function popLetter() {
  if (wordLen === 0) return;
  wordLen--;
  let char = wordArr[wordLen];
  if (char === 'a') letterCounts.a--;
  else if (char === 'b') letterCounts.b--;
  else if (char === 'c') letterCounts.c--;
}

// Get the last `len` characters of the current word as a string
function getSuffix(len) {
  if (wordLen === 0 || len <= 0) return '';
  return wordArr.slice(Math.max(0, wordLen - len), wordLen).join('');
}

// Record an obstruction for analytics
function recordObstruction(obs) {
  let key = obs.type + ':' + (obs.half_length || 0);
  obstructionCounts[key] = (obstructionCounts[key] || 0) + 1;
}

// Emit an evolution event for the analytics pipeline
function emitEvent(type, data) {
  if (!config.analyticsEnabled) return;
  evolutionBuffer.push({ type, ...data, step: stats.steps, wordLen });
  if (evolutionBuffer.length > 200) {
    self.postMessage({ type: 'evolution_batch', events: evolutionBuffer });
    evolutionBuffer = [];
  }
}

function getParikh(l, r) {
  if (l === 0) {
    return [prefixA[r - 1], prefixB[r - 1], prefixC[r - 1]];
  }
  return [
    prefixA[r - 1] - prefixA[l - 1],
    prefixB[r - 1] - prefixB[l - 1],
    prefixC[r - 1] - prefixC[l - 1]
  ];
}

function getPacked(l, r) {
  if (l === 0) return prefixPacked[r - 1];
  return prefixPacked[r - 1] - prefixPacked[l - 1];
}

function checkAbelian(l1, r1, l2, r2) {
  let p1 = getPacked(l1, r1);
  let p2 = getPacked(l2, r2);
  if (p1 !== p2) return false;

  // Verify with full Parikh
  let v1 = getParikh(l1, r1);
  let v2 = getParikh(l2, r2);
  return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
}

function validateWordConstraints(checkFull = false) {
  let n = wordLen;
  if (n === 0) return null;

  // Normalize mode comparison to lowercase
  let mode = config.mode.toLowerCase();

  // 1. Forbidden factor check (aa2fr only)
  if (mode === 'aa2fr' && n >= 4) {
    if (checkFull) {
      for (let i = 0; i <= n - 4; i++) {
        let sub = wordArr[i] + wordArr[i+1] + wordArr[i+2] + wordArr[i+3];
        if (FORBID4.includes(sub)) return { type: 'forbid4', position: i, half_length: 2 };
      }
    } else {
      // Only check positions that include the new letter
      if (config.direction === 'right') {
        // New letter is at n-1; check 4-grams ending at or containing n-1
        for (let i = Math.max(0, n - 4); i <= n - 4; i++) {
          let sub = wordArr[i] + wordArr[i+1] + wordArr[i+2] + wordArr[i+3];
          if (FORBID4.includes(sub)) return { type: 'forbid4', position: i, half_length: 2 };
        }
      } else {
        // New letter is at 0; check 4-grams starting at 0
        if (n >= 4) {
          let sub = wordArr[0] + wordArr[1] + wordArr[2] + wordArr[3];
          if (FORBID4.includes(sub)) return { type: 'forbid4', position: 0, half_length: 2 };
        }
      }
    }
  }

  // 2. Abelian Square Detection
  // minHalfLen = 2 because period-1 abelian squares (e.g., 'aa') are allowed in AA2F/AA2FR
  const minHalfLen = 2;
  let maxH = Math.floor(n / 2);

  if (checkFull) {
    for (let h = minHalfLen; h <= maxH; h++) {
      for (let i = 0; i <= n - 2*h; i++) {
        if (checkAbelian(i, i+h, i+h, i+2*h)) {
          return { type: 'abelian_square', half_length: h, position: i };
        }
      }
    }
  } else {
    // Suffix scan (right extension): the new letter is at position n-1.
    // We need to check all abelian squares whose second half includes position n-1.
    // A square at position i with half-length h occupies [i, i+2h).
    // For the second half [i+h, i+2h) to include n-1: i+h <= n-1 and i+2h >= n.
    // This means i+2h = n (square ends exactly at n) since we only added one letter.
    // So: start = n - 2*h for each h.
    //
    // Prefix scan (left extension): the new letter is at position 0.
    // We need squares whose first half includes position 0.
    // So: start = 0 for each h.
    for (let h = minHalfLen; h <= maxH; h++) {
      if (config.direction === 'right') {
        let start = n - 2 * h;
        if (start < 0) continue;
        if (checkAbelian(start, start + h, start + h, start + 2 * h)) {
          return { type: 'abelian_square', half_length: h, position: start };
        }
      } else {
        // Left extension: check squares starting at position 0
        if (2 * h <= n) {
          if (checkAbelian(0, h, h, 2 * h)) {
            return { type: 'abelian_square', half_length: h, position: 0 };
          }
        }
      }
    }
  }

  return null;
}

// -------------------------------------------------------------------------
// SEARCH STRATEGIES (PLUGIN SYSTEM)
// -------------------------------------------------------------------------

class SearchStrategy {
  constructor(config) {
    this.config = config;
    this.letters = ['a', 'b', 'c'];
    this.stats = { steps: 0, backtracks: 0, stepsSinceNewRecord: 0 };
    this.lastDecision = "Initialized";
  }

  initialize(wordArr) {
    this.stack = [];
    this.currentDepth = wordArr.length;
    if (this.currentDepth === 0) {
      this.stack.push({ tryIdx: 0, validBranches: 0, order: this.getOrder(null) });
    }
  }

  getOrder(engine) {
    return this.applyAISupport(this.letters, engine);
  }

  applyAISupport(order, engine) {
    if (!this.config.aiSupport || this.config.aiSupport === 'observe') return order;

    // Evaluate danger of each letter based on motif stats
    let scoredLetters = order.map(l => {
      engine.pushLetter(l);
      let dangerScore = 0;
      let minM = engineConfig.motifRange ? engineConfig.motifRange[0] : 4;
      let maxM = engineConfig.motifRange ? engineConfig.motifRange[1] : 8;
      let baseSuf = engine.getSuffix(maxM);

      for (let len = minM; len <= maxM; len++) {
        let suf = baseSuf.length >= len ? baseSuf.slice(-len) : '';
        if (suf.length === len) {
          let stat = motifStats.get(suf);
          if (stat) {
            let probDead = stat.dead / stat.occ;
            dangerScore += probDead * (len / 4); // weight longer motifs more
          }
        }
      }
      engine.popLetter();
      return { l, ds: dangerScore };
    });

    if (this.config.aiSupport === 'avoid') {
      // Prune known dead ends
      let safe = scoredLetters.filter(x => x.ds === 0).map(x => x.l);
      return safe.length > 0 ? safe : [];
    } else if (this.config.aiSupport === 'assist') {
      // Deprioritize dangerous moves
      scoredLetters.sort((a, b) => a.ds - b.ds);
      return scoredLetters.map(x => x.l);
    }

    return order;
  }

  updateMotifStats(engine, result, branching, subtreeDepth, maxContinuation) {
    let minM = engineConfig.motifRange ? engineConfig.motifRange[0] : 4;
    let maxM = engineConfig.motifRange ? engineConfig.motifRange[1] : 8;
    let baseSuf = engine.getSuffix(maxM);

    for (let len = minM; len <= maxM; len++) {
      let suf = baseSuf.length >= len ? baseSuf.slice(-len) : '';
      if (suf.length === len) {
        if (!motifStats.has(suf)) {
          motifStats.set(suf, { occ: 0, dead: 0, surv: 0, branchSum: 0, depthSum: 0, maxLen: 0, parikhU: 0 });
        }
        let stat = motifStats.get(suf);
        stat.occ++;
        stat.branchSum += branching;
        stat.depthSum += subtreeDepth;
        if (maxContinuation > stat.maxLen) stat.maxLen = maxContinuation;

        if (result === 'dead_end') stat.dead++;
        else if (result === 'survived') stat.surv++; // Only count actual deep survival, not immediate backtrack

        // Calculate U
        let u = 0;
        let counts = {a:0, b:0, c:0};
        for (let i = 0; i < suf.length; i++) counts[suf[i]]++;
        for (let key of ['a','b','c']) {
          let diff = (counts[key] / suf.length) - (1/3);
          u += diff * diff;
        }
        stat.parikhU = Math.sqrt(u);
      }
    }
  }

  step(engine) {
    this.stats.steps++;

    if (this.currentDepth >= this.stack.length) {
      this.stack.push({
        tryIdx: 0,
        validBranches: 0,
        order: this.getOrder(engine),
        maxDepthReached: this.currentDepth
      });
    }

    let frame = this.stack[this.currentDepth];

    if (frame.tryIdx >= frame.order.length) {
      // Backtrack
      let subtreeDepth = frame.maxDepthReached - this.currentDepth;

      // We know this node resulted in a backtrack eventually.
      // If validBranches == 0, it was an immediate dead end for all children.
      this.updateMotifStats(engine, frame.validBranches === 0 ? 'dead_end' : 'survived', frame.validBranches, subtreeDepth, frame.maxDepthReached);

      this.stats.backtracks++;
      this.stats.stepsSinceNewRecord++;
      this.onBacktrack(this.currentDepth);
      engine.emitEvent('backtrack', { from_depth: this.currentDepth });

      if (this.currentDepth === 0) {
        return false; // Search complete
      }

      engine.popLetter();
      this.stack.pop();
      if (this.currentDepth > 0) {
        this.stack[this.currentDepth - 1].maxDepthReached = Math.max(this.stack[this.currentDepth - 1].maxDepthReached, frame.maxDepthReached);
      }
      this.currentDepth--;
      return true; // continue
    }

    let letter = frame.order[frame.tryIdx++];
    this.lastDecision = `Selected '${letter}'`;

    engine.pushLetter(letter);
    let obs = engine.validateWordConstraints(false);

    let resultStr = 'valid';
    let ds = 0;

    if (obs) {
      resultStr = 'dead_end';
      engine.recordObstruction(obs);
      this.updateMotifStats(engine, 'dead_end', 0, 0, this.currentDepth + 1);

      this.onDeadEnd(letter, obs);
      engine.emitEvent('node', {
        depth: this.currentDepth + 1,
        letter,
        result: resultStr,
        branching: frame.validBranches,
        danger_score: ds,
        obstruction: obs
      });
      engine.popLetter();
      return true; // continue
    }

    frame.validBranches++;
    this.currentDepth++;

    if (this.currentDepth > this.maxDepthReached) {
      this.maxDepthReached = this.currentDepth;
      frame.maxDepthReached = Math.max(frame.maxDepthReached || 0, this.currentDepth);
      engine.maxLen = Math.max(engine.maxLen, engine.wordLen);
      if (this.currentDepth > 100) { this.stats.stepsSinceNewRecord = 0;
        this.onRecord(engine.maxLen);
        self.postMessage({ type: 'milestone', length: engine.maxLen, word: engine.getSuffix(50) });
        engine.emitEvent('milestone', { depth: this.currentDepth, max_length: engine.maxLen });
      }
    }

    engine.emitEvent('node', {
      depth: this.currentDepth,
      letter,
      result: resultStr,
      branching: frame.validBranches,
      danger_score: ds,
      obstruction: null
    });
    return true;
  }

  onDeadEnd(letter, obs) {}
  onBacktrack(depth) {}
  onRecord(len) {}

  statistics() { return this.stats; }
  explainDecision() { return this.lastDecision; }
}

class DFSStrategy extends SearchStrategy {
  getOrder(engine) {
    this.lastDecision = `DFS default order`;
    return this.applyAISupport([...this.letters], engine);
  }
}

class PriorityParikhStrategy extends SearchStrategy {
  getOrder(engine) {
    let order = [...this.letters];
    let scores = {};
    let counts = engine.letterCounts;
    let len = engine.wordLen;
    for (let l of order) {
      let c = { ...counts };
      c[l]++;
      let wLen = len + 1;
      let u = 0;
      for (let key of ['a','b','c']) {
        let diff = (c[key] / wLen) - (1/3);
        u += diff * diff;
      }
      u = Math.sqrt(u);
      scores[l] = (len * len) - ((Math.pow(u, 3) * 27) / (8 * (len || 1)));
    }
    order.sort((a, b) => scores[b] - scores[a]);
    this.lastDecision = `Parikh balance priority (Best: ${order[0]})`;
    return this.applyAISupport(order, engine);
  }
}

// -------------------------------------------------------------------------
// SEARCH ENGINE (STATE MANAGER)
// -------------------------------------------------------------------------

const Engine = {
  suffixDeadEndCounts: new Map(),
  startTime: 0,

  // Use getters so strategies always see live global state
  get letterCounts() { return letterCounts; },
  get wordLen() { return wordLen; },
  get maxLen() { return maxLen; },
  set maxLen(v) { maxLen = v; },

  pushLetter: function(l) { pushLetter(l); },
  popLetter: function() { popLetter(); },
  validateWordConstraints: function(isFull) { return validateWordConstraints(isFull); },
  getSuffix: function(len) { return getSuffix(len); },
  recordObstruction: function(obs) { recordObstruction(obs); },
  emitEvent: function(type, data) { emitEvent(type, data); }
};

let activeStrategy = null;

function searchLoop() {
  if (!isRunning || isPaused) return;

  let maxSteps = 10000;
  for (let i = 0; i < maxSteps; i++) {
    if (!activeStrategy.step(Engine)) {
      isRunning = false;
      self.postMessage({ type: 'exhausted' });
      return;
    }
  }

  let now = Date.now();
  if (now - lastStateSendTime > 100) {
    let stats = activeStrategy.statistics();
    self.postMessage({
      type: 'state_update',
      word: wordArr.slice(0, wordLen),
      length: wordLen,
      stats: { steps: stats.steps, backtracks: stats.backtracks, deadEnds: 0, startTime: Engine.startTime, stepsSinceNewRecord: stats.stepsSinceNewRecord },
      motifStats: Array.from(motifStats.entries()).map(x => ({ motif: x[0], stats: x[1] })),
      parikhTrajectory: parikhTrajectory,
      strategy: activeStrategy.explainDecision()
    });
    lastStateSendTime = now;
  }

  if (now - lastAnalyticsSendTime > 500) {
    if (evolutionBuffer.length > 0) {
      self.postMessage({ type: 'evolution_batch', events: evolutionBuffer });
      evolutionBuffer = [];
    }
    lastAnalyticsSendTime = now;
  }

  setTimeout(searchLoop, 0);
}

// -------------------------------------------------------------------------
// POSTMESSAGE API
// -------------------------------------------------------------------------

let isJobCancelled = false;

self.onmessage = function(e) {
  const msg = e.data;

  switch (msg.cmd) {
    case 'start':
      config = { ...config, ...msg.config };
      engineConfig = msg.config;
      if (config.mode) config.mode = config.mode.toLowerCase();
      wordArr = [];
      wordLen = 0;
      Engine.maxLen = 0;
      letterCounts = { a: 0, b: 0, c: 0 };
      obstructionCounts = {};
      motifStats.clear();
      parikhTrajectory = [];
      analyticsBuffer = [];
      evolutionBuffer = [];
      branchingHistory = [];
      backtrackHistory = [];
      lastAnalyticsSendTime = Date.now();
      lastStateSendTime = Date.now();
      Engine.startTime = Date.now();

      if (config.strategy === 'gavrilenko' || config.strategy === 'parikh_balance') {
        activeStrategy = new PriorityParikhStrategy(config);
      } else {
        activeStrategy = new DFSStrategy(config);
      }
      activeStrategy.initialize(wordArr);

      if (config.seed) {
        for (let char of config.seed) {
          Engine.pushLetter(char);
          activeStrategy.currentDepth++;
          activeStrategy.stack.push({ tryIdx: 0, validBranches: 1, order: activeStrategy.getOrder(letterCounts, wordLen), maxDepthReached: activeStrategy.currentDepth });
        }
      }

      isRunning = true;
      isPaused = false;
      searchLoop();
      break;

    case 'pause':
      isPaused = true;
      break;

    case 'resume':
      if (isRunning && isPaused) {
        isPaused = false;
        searchLoop();
      }
      break;

    case 'step':
      if (isRunning) {
        activeStrategy.step(Engine);
        let stats = activeStrategy.statistics();
        self.postMessage({
          type: 'state_update',
          word: Engine.getSuffix(300),
          length: Engine.wordLen,
          stats: { steps: stats.steps, backtracks: stats.backtracks, deadEnds: 0, startTime: Engine.startTime, stepsSinceNewRecord: stats.stepsSinceNewRecord },
          parikh: { ...letterCounts },
          strategy: config.strategy,
          decision: activeStrategy.explainDecision()
        });
      }
      break;

    case 'stop':
      isRunning = false;
      break;

    case 'set_strategy':
      config.strategy = msg.strategy;
      strategyParams = msg.params || {};
      break;

    case 'validate':
      // RQ0 Validation
      let oldWordArr = wordArr.slice();
      let oldWordLen = wordLen;

      wordArr = msg.wordArr || [];
      wordLen = 0;
      let tempCounts = { a:0, b:0, c:0 };
      let oldCounts = { ...letterCounts };
      letterCounts = tempCounts;

      for (let i = 0; i < wordArr.length; i++) {
        pushLetter(wordArr[i]);
      }
      let oldConfig = { ...config };
      config.mode = msg.mode || 'AA2FR';

      let res = validateWordConstraints(true);

      // Restore
      wordArr = oldWordArr;
      wordLen = oldWordLen;
      config = oldConfig;
      letterCounts = oldCounts;

      for (let i = 0; i < wordLen; i++) {
        let char = wordArr[i];
        let valA = (char === 'a') ? 1 : 0;
        let valB = (char === 'b') ? 1 : 0;
        let valC = (char === 'c') ? 1 : 0;
        let valPacked = valA * 0 + valB * 1 + valC * 65536;
        prefixA[i] = (i === 0 ? 0 : prefixA[i-1]) + valA;
        prefixB[i] = (i === 0 ? 0 : prefixB[i-1]) + valB;
        prefixC[i] = (i === 0 ? 0 : prefixC[i-1]) + valC;
        prefixPacked[i] = (i === 0 ? 0 : prefixPacked[i-1]) + valPacked;
      }

      self.postMessage({ type: 'validation_result', valid: res === null, violations: res });
      break;

    case 'export':
      self.postMessage({
        type: 'export_data',
        data: {
          word: wordArr.slice(0, wordLen).join(''),
          length: wordLen,
          stats: stats,
          obstructions: obstructionCounts,
          letterCounts: letterCounts
        }
      });
      break;

    case 'run_rq0_tests':
      self.postMessage({ type: 'rq0_results', results: runRQ0Tests() });
      break;

    case 'predictive_analyze':
      let result = runPredictiveAnalysis(msg.wordArr, msg.options);
      self.postMessage({ type: 'predictive_result', id: msg.id, result: result });
      break;

    case 'cancel_job':
      isJobCancelled = true;
      self.postMessage({ type: 'job_cancelled' });
      break;

    case 'val_audit_h6':
      startAuditH6(msg.limitK || 400);
      break;

    case 'val_audit_g3':
      startAuditG3(msg.limitK || 500);
      break;

    case 'val_bench_symmetry':
      runSymmetryCheck(msg.limitNodes || 20000);
      break;

    case 'val_bench_seeds':
      runSeedSuiteBenchmark(msg.limitNodes || 25000);
      break;

    case 'val_benchmark':
      let benchResults = runValidationBenchmark(msg.limit || 100000);
      self.postMessage({ type: 'val_benchmark_results', results: benchResults });
      break;

    case 'val_rauzy_fractal':
      startRauzyFractal(msg.iterations || 10);
      break;

    case 'val_sunburst_tree':
      startSunburstTree(msg.depth || 10);
      break;

    case 'val_observatory_data':
      startObservatoryAnalysis(msg.options || {});
      break;

    case 'val_p6_replicate':
      let repRes = replicateP6(msg.iterations || 4, msg.maxK || 30);
      self.postMessage({ type: 'val_p6_replicate_results', results: repRes });
      break;

    case 'val_bridge_weld':
      let weldRes = weldBridge(msg.u || G3['a'], msg.v || G3['c'], msg.maxBridgeLen || 6, msg.minPeriod || 1, msg.maxPeriod || 5, msg.maxResults || 10);
      self.postMessage({ type: 'val_bridge_weld_results', results: weldRes });
      break;

    case 'val_neg_control':
      let negRes = runNegativeControlTest();
      self.postMessage({ type: 'val_neg_control_results', results: negRes });
      break;
  }
};

// -------------------------------------------------------------------------
// PREDICTIVE SEARCH ANALYZER (PHASE 6)
// -------------------------------------------------------------------------
function runPredictiveAnalysis(baseWordArr, options) {
  let maxDepth = options.depth || 5;
  let maxNodes = options.maxNodes || 5000;

  // Save current state
  let savedWordArr = wordArr.slice(0, wordLen);
  let savedWordLen = wordLen;
  let savedLetterCounts = { ...letterCounts };

  // Set up isolated state
  wordArr = [];
  wordLen = 0;
  letterCounts = { a: 0, b: 0, c: 0 };

  // Initialize with base word
  for (let c of baseWordArr) {
    pushLetter(c);
  }

  let nodesExplored = 0;
  let deadEnds = 0;
  let totalValidDepths = 0;
  let localStack = [];
  let depth = 0;

  let outcomes = 0;

  // Start search
  localStack.push({ order: ['a','b','c'], tryIdx: 0, validBranches: 0 });

  while (depth >= 0 && nodesExplored < maxNodes) {
    let frame = localStack[depth];
    if (frame.tryIdx >= frame.order.length) {
      // Backtrack
      localStack.pop();
      depth--;
      if (depth >= 0) popLetter();
      continue;
    }

    let letter = frame.order[frame.tryIdx];
    frame.tryIdx++;

    nodesExplored++;
    pushLetter(letter);
    let obs = validateWordConstraints(false);

    if (obs || depth >= maxDepth - 1) {
      outcomes++;
      if (obs) {
        deadEnds++;
        totalValidDepths += depth; // depth represents the length of the valid prefix added
      } else {
        totalValidDepths += (depth + 1);
        frame.validBranches++;
      }
      popLetter();
    } else {
      frame.validBranches++;
      depth++;
      localStack.push({ order: ['a','b','c'], tryIdx: 0, validBranches: 0 });
    }
  }

  // Restore original state
  wordArr = [];
  wordLen = 0;
  letterCounts = { a: 0, b: 0, c: 0 };
  for (let c of savedWordArr) {
    pushLetter(c);
  }

  return {
    nodesExplored,
    deadEnds,
    deadEndProbability: outcomes > 0 ? (deadEnds / outcomes) : 0,
    averageSubtreeDepth: outcomes > 0 ? (totalValidDepths / outcomes) : 0
  };
}

// -------------------------------------------------------------------------
// RQ0 VALIDATION SUITE
// -------------------------------------------------------------------------

function runRQ0Tests() {
  let results = [];

  function assert(condition, testName) {
    results.push({ test: testName, passed: !!condition });
  }

  // Save state
  let oldArr = wordArr.slice();
  let oldLen = wordLen;
  let oldConfig = { ...config };
  let oldCounts = { ...letterCounts };
  let oldMaxLen = Engine.maxLen;

  wordArr = [];
  wordLen = 0;
  letterCounts = {a:0, b:0, c:0};

  config.mode = 'AA2FR';
  config.direction = 'right';

  // Helper for tests
  function runTest(tests, name) {
    for (let t of tests) {
      wordLen = 0;
      letterCounts = { a: 0, b: 0, c: 0 };
      for (let c of t.w) pushLetter(c);
      let v = validateWordConstraints(true);
      assert((v !== null) === t.expect, `${name} for ${t.w.join('')}`);
    }
  }

  // 1. Forbid4 check (exact matches)
  runTest([
    { w: ['b','a','a','c'], expect: true },
    { w: ['c','a','a','b'], expect: true },
    { w: ['a','b','b','c'], expect: true },
    { w: ['c','b','b','a'], expect: true },
    { w: ['a','c','c','b'], expect: true },
    { w: ['b','c','c','a'], expect: true },
    { w: ['a','b','a','c'], expect: false }
  ], 'Forbid4');

  // 2. Abelian square check
  runTest([
    { w: ['a','b','a','b'], expect: true }, // len 4, half 2 (ab ab)
    { w: ['a','b','c','b','a','c'], expect: true }, // (abc bac)
    { w: ['a','b','c','a'], expect: false }
  ], 'Abelian square');

  // 3. Period-1 squares (should pass)
  runTest([
    { w: ['a','a'], expect: false },
    { w: ['b','b'], expect: false },
    { w: ['c','c'], expect: false }
  ], 'Period-1 squares allowed');

  // 4. Boundary cases
  runTest([
    { w: [], expect: false }, // empty
    { w: ['a'], expect: false }, // single
    { w: ['b'], expect: false },
    { w: ['c'], expect: false }
  ], 'Boundary cases');

  // 5. Embedded violations
  runTest([
    { w: ['a','b','c','b','a','a','c','a','b','c'], expect: true }, // baac embedded
    { w: ['a','c','b','a','b','a','b','c','a'], expect: true }, // abab embedded
    { w: ['a','b','c','a','b','a'], expect: false } // clean
  ], 'Embedded violations');

  // 6. Left extension test
  config.direction = 'left';
  runTest([
    { w: ['b','a','a','c'], expect: true },
    { w: ['c','a','a','b'], expect: true },
    { w: ['a','b','a','b'], expect: true },
    { w: ['a','b','c','b','a','c'], expect: true },
    { w: ['a','b','c','a'], expect: false }
  ], 'Left-extension');
  config.direction = 'right';

  // 7. Deterministic state test (Mini-DFS)
  wordArr = [];
  wordLen = 0;
  letterCounts = { a: 0, b: 0, c: 0 };
  Engine.maxLen = 0;

  let dfsSteps = 0;
  let dfsBacktracks = 0;
  pushLetter('a'); dfsSteps++;
  pushLetter('b'); dfsSteps++;
  pushLetter('c'); dfsSteps++;
  Engine.maxLen = Math.max(Engine.maxLen, wordLen);
  assert(Engine.wordLen === 3 && Engine.maxLen === 3 && Engine.letterCounts.a === 1 && Engine.letterCounts.b === 1 && Engine.letterCounts.c === 1, 'DFS step 1: abc state valid');

  pushLetter('b'); dfsSteps++;
  Engine.maxLen = Math.max(Engine.maxLen, wordLen);

  pushLetter('a'); dfsSteps++;
  Engine.maxLen = Math.max(Engine.maxLen, wordLen);

  pushLetter('c'); dfsSteps++;
  let obs = validateWordConstraints(false);
  assert(obs !== null && obs.type === 'abelian_square' && obs.half_length === 3, 'DFS step 6: abcbac abelian square detected');
  dfsBacktracks++;
  popLetter();

  assert(Engine.wordLen === 5 && Engine.maxLen === 5 && Engine.letterCounts.c === 1 && letterCounts.c === 1 && wordLen === 5, 'DFS step 7: state restored exactly after pop');

  // Restore state
  wordArr = oldArr;
  wordLen = oldLen;
  config = oldConfig;
  letterCounts = oldCounts;
  Engine.maxLen = oldMaxLen;
  for (let i = 0; i < wordLen; i++) {
    let char = wordArr[i];
    let valA = (char === 'a') ? 1 : 0;
    let valB = (char === 'b') ? 1 : 0;
    let valC = (char === 'c') ? 1 : 0;
    let valPacked = valA * 0 + valB * 1 + valC * 65536;
    prefixA[i] = (i === 0 ? 0 : prefixA[i-1]) + valA;
    prefixB[i] = (i === 0 ? 0 : prefixB[i-1]) + valB;
    prefixC[i] = (i === 0 ? 0 : prefixC[i-1]) + valC;
    prefixPacked[i] = (i === 0 ? 0 : prefixPacked[i-1]) + valPacked;
  }

  return results;
}

// -------------------------------------------------------------------------
// STAGE 7: SCIENTIFIC VALIDATION LAB & EMPIRICAL BENCHMARK SUITE
// -------------------------------------------------------------------------

const SEED_SUITE_L12 = [
  { id: "seed_1", word: "aaabaaacaaab", prng_seed: 0, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aaabaaacaaab" },
  { id: "seed_2", word: "aaabcaaabbba", prng_seed: 96, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aaabcaaabbba" },
  { id: "seed_3", word: "aaabcccabbbc", prng_seed: 192, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aaabcccabbbc" },
  { id: "seed_4", word: "aabaaacccbac", prng_seed: 288, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aabaaacccbac" },
  { id: "seed_5", word: "aabbbcbacaaa", prng_seed: 384, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aabbbcbacaaa" },
  { id: "seed_6", word: "aabcccbbbabc", prng_seed: 480, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aabcccbbbabc" },
  { id: "seed_7", word: "aabcccaaabcc", prng_seed: 576, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aabcccaaabcc" },
  { id: "seed_8", word: "aabbbcacccbb", prng_seed: 672, method: "PRNG-uniform-strided-DFS", canonical_orbit: "aabbbcacccbb" },
  { id: "seed_9", word: "abacabbbccca", prng_seed: 768, method: "PRNG-uniform-strided-DFS", canonical_orbit: "abacabbbccca" },
  { id: "seed_10", word: "abbbacbaaacc", prng_seed: 864, method: "PRNG-uniform-strided-DFS", canonical_orbit: "abbbacbaaacc" }
];

function verifyForbid4Symmetry() {
  const revSet = FORBID4.map(s => s.split('').reverse().join('')).sort().join(',');
  const origSet = [...FORBID4].sort().join(',');
  return {
    isSymmetric: revSet === origSet,
    origSet,
    revSet,
    verified: "reverse(FORBID4) == FORBID4"
  };
}

function canonicalizeWord(w) {
  let map = {}, nextCode = 97, res = '';
  for (let c of w) {
    if (!map[c]) map[c] = String.fromCharCode(nextCode++);
    res += map[c];
  }
  return res;
}

// Module B: h6 Bounded Prefix Audit (Worker Chunked)
function startAuditH6(maxK = 400) {
  isJobCancelled = false;
  const tGenStart = performance.now();
  self.postMessage({ type: 'val_progress', module: 'B', phase: 'generation', progress: 0, status: 'Generating h6 prefix (N=59,049)...' });

  const H6_MAP = { a: 'ace', b: 'adf', c: 'bdf', d: 'bdc', e: 'afe', f: 'bce' };
  let w = "a";
  for (let iter = 0; iter < 10; iter++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6_MAP[w[i]];
    w = next;
  }
  const wordArrLocal = w.split('');
  const N = wordArrLocal.length;
  const timeGenMs = performance.now() - tGenStart;

  self.postMessage({ type: 'val_progress', module: 'B', phase: 'prefix_sums', progress: 5, status: 'Building O(1) Parikh prefix sums for 6 alphabet letters {a..f}...' });

  const pA = new Int32Array(N + 1);
  const pB = new Int32Array(N + 1);
  const pC = new Int32Array(N + 1);
  const pD = new Int32Array(N + 1);
  const pE = new Int32Array(N + 1);
  const pF = new Int32Array(N + 1);

  for (let i = 0; i < N; i++) {
    let ch = wordArrLocal[i];
    pA[i+1] = pA[i] + (ch === 'a' ? 1 : 0);
    pB[i+1] = pB[i] + (ch === 'b' ? 1 : 0);
    pC[i+1] = pC[i] + (ch === 'c' ? 1 : 0);
    pD[i+1] = pD[i] + (ch === 'd' ? 1 : 0);
    pE[i+1] = pE[i] + (ch === 'e' ? 1 : 0);
    pF[i+1] = pF[i] + (ch === 'f' ? 1 : 0);
  }

  let totalPairs = 0;
  for (let k = 1; k <= maxK; k++) {
    if (N >= 2 * k) totalPairs += (N - 2 * k + 1);
  }

  let currentK = 1;
  let checkedPairs = 0;
  let foundSquares = [];
  const tScanStart = performance.now();

  function scanChunk() {
    if (isJobCancelled) return;
    const chunkEndTime = performance.now() + 15;

    while (currentK <= maxK && performance.now() < chunkEndTime) {
      const k = currentK;
      const maxI = N - 2 * k;
      for (let i = 0; i <= maxI; i++) {
        if (isJobCancelled) return;
        if (pA[i+k] - pA[i] === pA[i+2*k] - pA[i+k] &&
            pB[i+k] - pB[i] === pB[i+2*k] - pB[i+k] &&
            pC[i+k] - pC[i] === pC[i+2*k] - pC[i+k] &&
            pD[i+k] - pD[i] === pD[i+2*k] - pD[i+k] &&
            pE[i+k] - pE[i] === pE[i+2*k] - pE[i+k] &&
            pF[i+k] - pF[i] === pF[i+2*k] - pF[i+k]) {
          foundSquares.push({ halfLen: k, start: i, str: wordArrLocal.slice(i, i + 2*k).join('') });
        }
      }
      checkedPairs += (maxI >= 0 ? maxI + 1 : 0);
      currentK++;
    }

    const pct = parseFloat(((checkedPairs / totalPairs) * 100).toFixed(1));
    self.postMessage({ type: 'val_progress', module: 'B', phase: 'scanning', progress: pct, checkedPairs, totalPairs, currentK: Math.min(currentK, maxK) });

    if (currentK <= maxK) {
      setTimeout(scanChunk, 0);
    } else {
      const timeScanMs = performance.now() - tScanStart;
      self.postMessage({
        type: 'val_h6_results',
        results: {
          prefixLen: N,
          auditedLen: N,
          maxK,
          checkedPairs,
          totalPairs,
          squaresFound: foundSquares,
          squares: foundSquares,
          timeGenMs: parseFloat(timeGenMs.toFixed(1)),
          timeScanMs: parseFloat(timeScanMs.toFixed(1)),
          timeMs: parseFloat((timeGenMs + timeScanMs).toFixed(1)),
          forbid4Symmetry: verifyForbid4Symmetry(),
          status: foundSquares.length === 0 ? 'PASS' : 'FAIL',
          message: foundSquares.length === 0 ? `Bounded audit completed: no discrepancy observed within scope (N=${N.toLocaleString()}, K <= ${maxK}).` : `Found ${foundSquares.length} unexpected abelian squares!`
        }
      });
    }
  }

  setTimeout(scanChunk, 0);
}

// Module C: g3(h6^ω(a)) Bounded Prefix Audit & Density Grid
function startAuditG3(maxK = 500) {
  isJobCancelled = false;
  const tGenStart = performance.now();
  self.postMessage({ type: 'val_progress', module: 'C', phase: 'generation', progress: 0, status: 'Generating g3(h6) prefix (N=590,490)...' });

  const H6_MAP = { a: 'ace', b: 'adf', c: 'bdf', d: 'bdc', e: 'afe', f: 'bce' };
  const G3_MAP = { a: 'bbbaabaaac', b: 'bccacccbcc', c: 'ccccbbbcbc', d: 'ccccccccaa', e: 'bbbbbcabaa', f: 'aaaaaaabaa' };

  // Hard blocking guard condition: verify all 6 g3 images are exactly 10 characters long
  for (const k in G3_MAP) {
    if (G3_MAP[k].length !== 10) {
      self.postMessage({
        type: 'val_g3_results',
        error: `CRITICAL GUARD FAILURE: g3(${k}) image length is ${G3_MAP[k].length} (expected exactly 10). Morphism integrity verification failed.`
      });
      return;
    }
  }

  let w = "a";
  for (let iter = 0; iter < 10; iter++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6_MAP[w[i]];
    w = next;
  }
  let tern = "";
  for (let i = 0; i < w.length; i++) tern += G3_MAP[w[i]];
  const N_total = tern.length;
  const N_audit = Math.min(N_total, 200000); // 200,000 letter audit for deep stationary convergence profile
  const wordArrLocal = tern.slice(0, N_audit).split('');
  const timeGenMs = performance.now() - tGenStart;

  self.postMessage({ type: 'val_progress', module: 'C', phase: 'prefix_sums', progress: 5, status: `Building O(1) Uint32Array Parikh prefix sums for N=${N_audit.toLocaleString()}...` });

  const pA = new Uint32Array(N_audit + 1);
  const pB = new Uint32Array(N_audit + 1);
  const pC = new Uint32Array(N_audit + 1);
  for (let i = 0; i < N_audit; i++) {
    let ch = wordArrLocal[i];
    let vA = (ch === 'a') ? 1 : 0;
    let vB = (ch === 'b') ? 1 : 0;
    let vC = (ch === 'c') ? 1 : 0;
    pA[i+1] = pA[i] + vA;
    pB[i+1] = pB[i] + vB;
    pC[i+1] = pC[i] + vC;
  }

  let totalPairs = 0;
  for (let k = 1; k <= maxK; k++) {
    if (N_audit >= 2 * k) totalPairs += (N_audit - 2 * k + 1);
  }

  let currentK = 1;
  let checkedPairs = 0;
  let period1Count = 0;
  let boundarySquares = { 2: [], 3: [], 4: [], 5: [] };
  let countGt5 = 0;
  let allSquares = [];

  // 50x50 density grid for UI rendering (binX: position 0..49999 in 1000s, binY: K 1..500 in 10s)
  const densityGrid = [];
  for (let bx = 0; bx < 50; bx++) {
    densityGrid[bx] = [];
    for (let by = 0; by < 50; by++) {
      densityGrid[bx][by] = { count: 0, samples: [] };
    }
  }

  const tScanStart = performance.now();

  function scanChunkG3() {
    if (isJobCancelled) return;
    const chunkEndTime = performance.now() + 15;

    while (currentK <= maxK && performance.now() < chunkEndTime) {
      const k = currentK;
      const maxI = N_audit - 2 * k;
      for (let i = 0; i <= maxI; i++) {
        if (isJobCancelled) return;
        let a1 = pA[i+k] - pA[i], a2 = pA[i+2*k] - pA[i+k];
        if (a1 === a2) {
          let b1 = pB[i+k] - pB[i], b2 = pB[i+2*k] - pB[i+k];
          if (b1 === b2) {
            let c1 = pC[i+k] - pC[i], c2 = pC[i+2*k] - pC[i+k];
            if (c1 === c2) {
              if (k === 1) {
                period1Count++;
              } else {
                const u = wordArrLocal.slice(i, i+k).join('');
                const v = wordArrLocal.slice(i+k, i+2*k).join('');
                // Check if occurrence is strictly internal to a single 10-char g3 image block
                const isInternal = (Math.floor(i / 10) === Math.floor((i + 2*k - 1) / 10));
                const sqObj = { i, k, start: i, halfLen: k, str: u + v, u, v, isInternal };
                allSquares.push(sqObj);

                if (k >= 2 && k <= 5) {
                  boundarySquares[k].push(sqObj);
                } else if (k > 5) {
                  countGt5++;
                }
                let bx = Math.min(49, Math.floor((i / N_audit) * 50));
                let by = Math.min(49, Math.floor(((k - 1) / maxK) * 50));
                densityGrid[bx][by].count++;
                if (densityGrid[bx][by].samples.length < 3) {
                  densityGrid[bx][by].samples.push(sqObj);
                }
              }
            }
          }
        }
      }
      checkedPairs += (maxI >= 0 ? maxI + 1 : 0);
      currentK++;
    }

    const pct = parseFloat(((checkedPairs / totalPairs) * 100).toFixed(1));
    self.postMessage({ type: 'val_progress', module: 'C', phase: 'scanning', progress: pct, checkedPairs, totalPairs, currentK: Math.min(currentK, maxK) });

    if (currentK <= maxK) {
      setTimeout(scanChunkG3, 0);
    } else {
      const timeScanMs = performance.now() - tScanStart;

      // Compute Logarithmic Checkpoint Profile across N_audit
      const cpLengths = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000].filter(len => len <= N_audit);
      const checkpointProfile = cpLengths.map(cpLen => {
        const row = { N: cpLen, densities: {}, counts: {} };
        let totalCnt = 0;
        for (let k = 2; k <= 5; k++) {
          const validStarts = Math.max(1, cpLen - 2 * k + 1);
          const cnt = (boundarySquares[k] || []).filter(sq => sq.i <= cpLen - 2 * k).length;
          row.counts[k] = cnt;
          row.densities[k] = parseFloat(((cnt / validStarts) * 1000).toFixed(3));
          totalCnt += cnt;
        }
        row.totalCount = totalCnt;
        const avgValidStarts = Math.max(1, cpLen - 7);
        row.totalDensity = parseFloat(((totalCnt / avgValidStarts) * 1000).toFixed(3));
        return row;
      });

      // Compute Localization Split (Internal vs Boundary) for each K=2..5
      const localizationSplit = {};
      for (let k = 2; k <= 5; k++) {
        const list = boundarySquares[k] || [];
        const intCnt = list.filter(sq => sq.isInternal).length;
        const bndCnt = list.length - intCnt;
        localizationSplit[k] = {
          total: list.length,
          internal: intCnt,
          boundary: bndCnt,
          internalPct: list.length > 0 ? parseFloat(((intCnt / list.length) * 100).toFixed(1)) : 0,
          boundaryPct: list.length > 0 ? parseFloat(((bndCnt / list.length) * 100).toFixed(1)) : 0
        };
      }

      self.postMessage({
        type: 'val_g3_results',
        results: {
          prefixLen: N_total,
          auditedLen: N_audit,
          N_total,
          N_audit,
          maxK,
          checkedPairs,
          totalPairs,
          period1Count,
          boundarySquares,
          densityGrid,
          checkpointProfile,
          localizationSplit,
          forbiddenRealmCount: countGt5,
          countGt5,
          squaresFound: allSquares,
          squares: allSquares,
          timeGenMs: parseFloat(timeGenMs.toFixed(1)),
          timeScanMs: parseFloat(timeScanMs.toFixed(1)),
          timeMs: parseFloat((timeGenMs + timeScanMs).toFixed(1)),
          forbid4Symmetry: verifyForbid4Symmetry(),
          status: countGt5 === 0 ? 'PASS' : 'FAIL',
          message: countGt5 === 0 ? `No squares observed in range K > 5, within the audited prefix (N=${N_audit.toLocaleString()}) and window (K <= ${maxK}).` : `Found ${countGt5} unexpected squares with K > 5!`
        }
      });
    }
  }

  setTimeout(scanChunkG3, 0);
}

// Module D: S3 Symmetry Control
function runSymmetryCheck(maxNodes = 20000) {
  isJobCancelled = false;
  self.postMessage({ type: 'val_progress', module: 'D_sym', progress: 0, status: 'Running S3 Symmetry Control across 6 permutations...' });

  const perms = [
    { name: '(a,b,c)', order: ['a','b','c'] },
    { name: '(a,c,b)', order: ['a','c','b'] },
    { name: '(b,a,c)', order: ['b','a','c'] },
    { name: '(b,c,a)', order: ['b','c','a'] },
    { name: '(c,a,b)', order: ['c','a','b'] },
    { name: '(c,b,a)', order: ['c','b','a'] }
  ];

  const runs = [];
  const traceHashes = [];

  for (let idx = 0; idx < perms.length; idx++) {
    if (isJobCancelled) return;
    const p = perms[idx];
    self.postMessage({ type: 'val_progress', module: 'D_sym', progress: Math.floor(((idx + 1) / 6) * 100), status: `Evaluating S3 orbit: ${p.name}...` });

    let res = runSingleScientificBench('aa2fr', maxNodes, p.order, '');
    let canonBest = canonicalizeWord(res.bestWord);
    let summarySig = `${canonBest}|depth:${res.maxDepth}|nodes:${res.candidateNodes}|valid:${res.validExtensions}|back:${res.actualBacktracks}|rej:${res.rejections.total}`;
    traceHashes.push(summarySig);
    runs.push({
      permName: p.name,
      order: p.order,
      canonicalWord: canonBest,
      canonicalBestWord: canonBest,
      rawWord: res.bestWord.slice(0, 40) + (res.bestWord.length > 40 ? '...' : ''),
      maxDepth: res.maxDepth,
      candidateNodes: res.candidateNodes,
      nodes: res.candidateNodes,
      validExtensions: res.validExtensions,
      actualBacktracks: res.actualBacktracks,
      backtracks: res.actualBacktracks,
      traceHash: summarySig,
      summarySignature: summarySig,
      minSquareK: 'N/A'
    });
  }

  const allMatched = new Set(traceHashes).size === 1;
  self.postMessage({
    type: 'val_bench_symmetry_results',
    results: {
      matched: allMatched,
      traceHash: traceHashes[0],
      summarySignature: traceHashes[0],
      canonicalWord: runs[0].canonicalWord,
      limitNodes: maxNodes,
      runs,
      forbid4Symmetry: verifyForbid4Symmetry(),
      status: allMatched ? 'PASS' : 'FAIL',
      summary: allMatched ? "6/6 invariant summary signatures matched. S3 symmetry and determinism verified." : "❌ SYMMETRY VIOLATION DETECTED: summary signatures diverged across S3 permutations!"
    }
  });
}

// Module D: Shared Seed Suite Benchmark (L=12)
function runSeedSuiteBenchmark(maxNodes = 25000) {
  isJobCancelled = false;
  self.postMessage({ type: 'val_progress', module: 'D_seeds', progress: 0, status: 'Executing warmup run...' });

  // Warmup
  runSingleScientificBench('aa2f', 500, ['a','b','c'], SEED_SUITE_L12[0].word);
  runSingleScientificBench('aa2fr', 500, ['a','b','c'], SEED_SUITE_L12[0].word);

  const suiteResults = [];
  let totalRealizedNodes = 0;

  for (let idx = 0; idx < SEED_SUITE_L12.length; idx++) {
    if (isJobCancelled) return;
    const seedObj = SEED_SUITE_L12[idx];
    const pct = Math.floor(((idx + 1) / SEED_SUITE_L12.length) * 100);
    self.postMessage({ type: 'val_progress', module: 'D_seeds', progress: pct, status: `Evaluating seed ${idx + 1}/10: "${seedObj.word}"...` });

    let resAA2F = runSingleScientificBench('aa2f', maxNodes, ['a','b','c'], seedObj.word);
    if (isJobCancelled) return;
    let resAA2FR = runSingleScientificBench('aa2fr', maxNodes, ['a','b','c'], seedObj.word);

    totalRealizedNodes += (resAA2F.candidateNodes + resAA2FR.candidateNodes);
    suiteResults.push({
      seedId: seedObj.id,
      seedWord: seedObj.word,
      seed: seedObj,
      aa2f: resAA2F,
      aa2fr: resAA2FR
    });
  }

  self.postMessage({
    type: 'val_bench_seeds_results',
    results: {
      seedSuiteVersion: "1.0-L12-frozen",
      nodeBudgetPerSeed: maxNodes,
      totalRealizedNodes,
      forbid4Symmetry: verifyForbid4Symmetry(),
      runs: suiteResults,
      timestamp: new Date().toISOString(),
      runId: 'bench_' + Date.now().toString(36),
      summary: "Comparison illustrates search behavior within the shared state space permitted by AA2FR."
    }
  });
}

function runSingleScientificBench(mode, maxNodes, alphabetPerm, seedStr) {
  config.mode = mode;
  config.direction = 'right';
  wordArr = seedStr.split('');
  wordLen = seedStr.length;
  const seedLen = seedStr.length;

  prefixA[0] = 0; prefixB[0] = 0; prefixC[0] = 0; prefixPacked[0] = 0;
  for (let i = 0; i < seedLen; i++) {
    let char = wordArr[i];
    let valA = (char === 'a') ? 1 : 0;
    let valB = (char === 'b') ? 1 : 0;
    let valC = (char === 'c') ? 1 : 0;
    let valPacked = valA * 0 + valB * 1 + valC * 65536;
    prefixA[i+1] = prefixA[i] + valA;
    prefixB[i+1] = prefixB[i] + valB;
    prefixC[i+1] = prefixC[i] + valC;
    prefixPacked[i+1] = prefixPacked[i] + valPacked;
  }

  let bestWord = seedStr;
  let maxLen = seedLen;
  let candidateNodes = 0;
  let validExtensions = 0;
  let actualBacktracks = 0;
  let rejForbid4Only = 0, rejSquareOnly = 0, rejBoth = 0;
  let minSquareK = null;
  let triggeredKSet = new Set();
  const depthCurve = [{ nodes: 0, depth: 0 }];

  const t0 = performance.now();
  const chunkEndTime = performance.now() + 10000; // run synchronously for single bench run

  // We use standard backtracking DFS
  const alphabet = alphabetPerm;
  const letterIdx = new Int32Array(maxNodes + 100);
  letterIdx[seedLen] = 0;

  while (candidateNodes < maxNodes) {
    if (isJobCancelled) break;
    if (wordLen > maxLen) {
      maxLen = wordLen;
      bestWord = wordArr.slice(0, wordLen).join('');
    }

    if (letterIdx[wordLen] < 3) {
      let ch = alphabet[letterIdx[wordLen]];
      letterIdx[wordLen]++;
      wordArr[wordLen] = ch;
      wordLen++;
      candidateNodes++;

      let valA = (ch === 'a') ? 1 : 0;
      let valB = (ch === 'b') ? 1 : 0;
      let valC = (ch === 'c') ? 1 : 0;
      let valPacked = valA * 0 + valB * 1 + valC * 65536;
      prefixA[wordLen] = prefixA[wordLen - 1] + valA;
      prefixB[wordLen] = prefixB[wordLen - 1] + valB;
      prefixC[wordLen] = prefixC[wordLen - 1] + valC;
      prefixPacked[wordLen] = prefixPacked[wordLen - 1] + valPacked;

      // Scientific constraint check (exact overlap classification)
      let n = wordLen;
      let hasForbid4 = false;
      if (mode === 'aa2fr' && n >= 4) {
        let sub = wordArr[n-4] + wordArr[n-3] + wordArr[n-2] + wordArr[n-1];
        if (FORBID4.includes(sub)) hasForbid4 = true;
      }

      let sqList = [];
      const minHalfLen = 2;
      let maxH = Math.floor(n / 2);
      for (let h = minHalfLen; h <= maxH; h++) {
        let start = n - 2 * h;
        if (start < 0) continue;
        if (checkAbelian(start, start + h, start + h, start + 2 * h)) {
          sqList.push(h);
        }
      }

      let isValid = (!hasForbid4 && sqList.length === 0);
      if (isValid) {
        validExtensions++;
        letterIdx[wordLen] = 0;
      } else {
        wordLen--;
        if (hasForbid4 && sqList.length === 0) rejForbid4Only++;
        else if (!hasForbid4 && sqList.length > 0) rejSquareOnly++;
        else if (hasForbid4 && sqList.length > 0) rejBoth++;

        for (let k of sqList) {
          triggeredKSet.add(k);
          if (minSquareK === null || k < minSquareK) minSquareK = k;
        }
      }

      if (candidateNodes % 1000 === 0) {
        depthCurve.push({ nodes: candidateNodes, depth: maxLen - seedLen });
      }
    } else {
      if (wordLen === seedLen) break;
      wordLen--;
      actualBacktracks++;
    }
  }

  if (depthCurve[depthCurve.length - 1].nodes !== candidateNodes) {
    depthCurve.push({ nodes: candidateNodes, depth: maxLen - seedLen });
  }

  const timeMs = parseFloat((performance.now() - t0).toFixed(2));
  return {
    mode: mode.toUpperCase(),
    permName: '(' + alphabetPerm.join(',') + ')',
    candidateNodes,
    nodes: candidateNodes,
    validExtensions,
    actualBacktracks,
    backtracks: actualBacktracks,
    maxDepth: maxLen - seedLen,
    maxLen: maxLen,
    bestWord: bestWord,
    timeMs,
    rejections: {
      forbid4Only: rejForbid4Only,
      squareOnly: rejSquareOnly,
      both: rejBoth,
      forbid4_only: rejForbid4Only,
      square_only: rejSquareOnly,
      total: rejForbid4Only + rejSquareOnly + rejBoth,
      minSquareK: minSquareK,
      triggeredKSet: Array.from(triggeredKSet).sort((a, b) => a - b)
    },
    depthCurve,
    progression: depthCurve
  };
}

// -------------------------------------------------------------------------
// STAGE 9: RAUZY FRACTAL EIGENSPACE PROJECTION (MODULE E)
// -------------------------------------------------------------------------
function startRauzyFractal(iterations = 10) {
  self.postMessage({ type: 'val_progress', module: 'E', progress: 5, status: `Generating h6 fixed point (iterations=${iterations})...` });

  const H6_MAP = { a: 'ace', b: 'adf', c: 'bdf', d: 'bdc', e: 'afe', f: 'bce' };
  let word = 'a';
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (let j = 0; j < word.length; j++) next += H6_MAP[word[j]];
    word = next;
  }

  const N = word.length;
  self.postMessage({ type: 'val_progress', module: 'E', progress: 30, status: `Projecting ${N.toLocaleString()} Parikh vectors onto secondary eigenspaces ±√3...` });

  // Exact left eigenvectors of h6 incidence matrix for eigenvalues +√3 and -√3
  const w_pos = [0.35042, -0.09390, -0.35042, -0.60695, 0.60695, 0.09390];
  const w_neg = [0.16700, -0.62325, -0.16700, 0.28925, -0.28925, 0.62325];

  const points = new Float32Array(N * 4); // [X, Y, Z, charIdx]
  const counts = [0, 0, 0, 0, 0, 0];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (let t = 0; t < N; t++) {
    let ch = word.charCodeAt(t) - 97; // a=0..f=5
    counts[ch]++;

    let x = 0, y = 0;
    for (let j = 0; j < 6; j++) {
      x += counts[j] * w_pos[j];
      y += counts[j] * w_neg[j];
    }
    let z = (t / N) * 300 - 150; // dominant eigenvalue 3 growth axis (-150 to +150)

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    let idx = t * 4;
    points[idx] = x;
    points[idx + 1] = y;
    points[idx + 2] = z;
    points[idx + 3] = ch;
  }

  self.postMessage({
    type: 'val_rauzy_results',
    results: {
      iterations,
      totalPoints: N,
      minX: minX.toFixed(2),
      maxX: maxX.toFixed(2),
      minY: minY.toFixed(2),
      maxY: maxY.toFixed(2),
      eigenvalues: ['3 (dominant linear growth)', '+√3 (secondary contracting)', '-√3 (secondary contracting)'],
      points: points.buffer
    }
  }, [points.buffer]);
}

// -------------------------------------------------------------------------
// STAGE 9: RADIAL SUNBURST SEARCH TREE & PRUNING ANATOMY (MODULE F)
// -------------------------------------------------------------------------
function startSunburstTree(maxDepth = 10) {
  self.postMessage({ type: 'val_progress', module: 'F', progress: 10, status: `Executing exhaustive DFS tree traversal to depth ${maxDepth}...` });

  const forbid4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];
  function f4(w) {
    for (let i = 0; i < forbid4.length; i++) if (w.endsWith(forbid4[i])) return true;
    return false;
  }
  function sq(w) {
    let len = w.length;
    for (let k = 2; k <= Math.floor(len / 2); k++) {
      let c1 = [0, 0, 0], c2 = [0, 0, 0];
      for (let i = 0; i < k; i++) {
        c1[w.charCodeAt(len - 2 * k + i) - 97]++;
        c2[w.charCodeAt(len - k + i) - 97]++;
      }
      if (c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2]) return true;
    }
    return false;
  }

  function buildDFSTree(useForbid4) {
    let validNodes = 0, terminalDeadEnds = 0;
    let reasons = { forbid4: 0, square: 0, both: 0, valid: 0 };

    function dfs(w, d) {
      validNodes++;
      reasons.valid++;
      let node = { w, d, reason: 'valid', children: [] };
      if (d === maxDepth) return node;

      let validChildrenCount = 0;
      for (let ch of ['a', 'b', 'c']) {
        let nw = w + ch;
        let isF4 = useForbid4 ? f4(nw) : false;
        let isSq = sq(nw);

        if (!isF4 && !isSq) {
          validChildrenCount++;
          node.children.push(dfs(nw, d + 1));
        } else {
          let r = 'square';
          if (isF4 && isSq) { r = 'both'; reasons.both++; }
          else if (isF4) { r = 'forbid4'; reasons.forbid4++; }
          else { r = 'square'; reasons.square++; }
          node.children.push({ w: nw, d: d + 1, reason: r, children: [] });
        }
      }
      if (validChildrenCount === 0) terminalDeadEnds++;
      return node;
    }

    let root = dfs('', 0);
    return {
      root,
      validNodes,
      terminalDeadEnds,
      deadEndPercentage: ((terminalDeadEnds / validNodes) * 100).toFixed(3) + '%',
      reasons
    };
  }

  self.postMessage({ type: 'val_progress', module: 'F', progress: 50, status: 'Computing AA2F reference tree (depth 10)...' });
  const treeAA2F = buildDFSTree(false);

  self.postMessage({ type: 'val_progress', module: 'F', progress: 80, status: 'Computing AA2FR extension tree (depth 10)...' });
  const treeAA2FR = buildDFSTree(true);

  self.postMessage({
    type: 'val_sunburst_results',
    results: {
      depth: maxDepth,
      aa2f: treeAA2F,
      aa2fr: treeAA2FR,
      timestamp: new Date().toISOString(),
      disclaimer: "Optical Density Notice: In radial charts, sector width is normalized by node budget (360° / N). AA2FR appears wider/calmer because it has fewer nodes (4,498 vs 11,950), an optical consequence of normalization rather than structural calmness."
    }
  });
}

// -------------------------------------------------------------------------
// GALLERY RESEARCH OBSERVATORY ENGINE (PHASE 7)
// -------------------------------------------------------------------------
function startObservatoryAnalysis(options = {}) {
  isJobCancelled = false;
  const H6_MAP = { a: 'ace', b: 'adf', c: 'bdf', d: 'bdc', e: 'afe', f: 'bce' };
  const G3_MAP = options.customG3Map || { a: 'bbbaabaaac', b: 'bccacccbcc', c: 'ccccbbbcbc', d: 'ccccccccaa', e: 'bbbbbcabaa', f: 'aaaaaaabaa' };

  // Generate w = h6^6(a) (729 letters), then g = g3(w) (7,290 letters)
  let w = "a";
  for (let iter = 0; iter < 6; iter++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6_MAP[w[i]];
    w = next;
  }
  let w5 = "a";
  for (let iter = 0; iter < 5; iter++) {
    let next = "";
    for (let i = 0; i < w5.length; i++) next += H6_MAP[w5[i]];
    w5 = next;
  }

  let g = "";
  for (let i = 0; i < w.length; i++) {
    const img = G3_MAP[w[i]] || G3_MAP['a'];
    g += img;
  }

  const n = g.length;
  const prefA = new Int32Array(n + 1);
  const prefB = new Int32Array(n + 1);
  const prefC = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) {
    prefA[i + 1] = prefA[i] + (g[i] === 'a' ? 1 : 0);
    prefB[i + 1] = prefB[i] + (g[i] === 'b' ? 1 : 0);
    prefC[i + 1] = prefC[i] + (g[i] === 'c' ? 1 : 0);
  }

  const maxScanPos = Math.min(n, options.maxPos || 2500);
  const maxK = options.maxK || 35;
  const gridNorms = new Uint8Array(maxScanPos * maxK);
  const nearMisses = [];
  const seamCollisions = [];

  for (let i = 0; i < maxScanPos; i++) {
    if (isJobCancelled) return;
    for (let K = 1; K <= maxK; K++) {
      if (i + 2 * K > n) continue;
      const da = (prefA[i + K] - prefA[i]) - (prefA[i + 2 * K] - prefA[i + K]);
      const db = (prefB[i + K] - prefB[i]) - (prefB[i + 2 * K] - prefB[i + K]);
      const dc = (prefC[i + K] - prefC[i]) - (prefC[i + 2 * K] - prefC[i + K]);
      const norm = Math.abs(da) + Math.abs(db) + Math.abs(dc);
      gridNorms[i * maxK + (K - 1)] = Math.min(255, norm);

      const isBoundary = (i % 10 !== 0) || ((i + K) % 10 !== 0) || ((i + 2 * K) % 10 !== 0);
      const g3Idx = Math.floor(i / 10);
      const h6Parent = w[g3Idx] || '?';
      const h6ParentIdx = Math.floor(i / 30);
      const h6Grandparent = w5[h6ParentIdx] || '?';

      if (norm === 0) {
        seamCollisions.push({
          id: `sq_${i}_${K}`,
          i: i,
          K: K,
          norm: 0,
          delta: [da, db, dc],
          leftStr: g.substring(i, i + Math.min(K, 15)) + (K > 15 ? '...' : ''),
          rightStr: g.substring(i + K, i + Math.min(2 * K, i + K + 15)) + (K > 15 ? '...' : ''),
          isBoundary: isBoundary,
          g3BlockIdx: g3Idx,
          h6ParentLetter: h6Parent,
          h6ParentBlockIdx: h6ParentIdx,
          h6GrandparentLetter: h6Grandparent
        });
      } else if (norm <= 4) {
        nearMisses.push({
          id: `nm_${i}_${K}`,
          i: i,
          K: K,
          norm: norm,
          delta: [da, db, dc],
          leftStr: g.substring(i, i + Math.min(K, 15)) + (K > 15 ? '...' : ''),
          rightStr: g.substring(i + K, i + Math.min(2 * K, i + K + 15)) + (K > 15 ? '...' : ''),
          isBoundary: isBoundary,
          g3BlockIdx: g3Idx,
          h6ParentLetter: h6Parent,
          h6ParentBlockIdx: h6ParentIdx,
          h6GrandparentLetter: h6Grandparent
        });
      }
    }
  }

  nearMisses.sort((a, b) => a.norm - b.norm || b.K - a.K);
  const topNearMisses = nearMisses.slice(0, 20);
  const topCollisions = seamCollisions.slice(0, 20);

  self.postMessage({
    type: 'val_observatory_results',
    results: {
      maxScanPos: maxScanPos,
      maxK: maxK,
      gridNorms: Array.from(gridNorms),
      nearMisses: topNearMisses,
      seamCollisions: topCollisions,
      totalNearMisses: nearMisses.length,
      totalCollisions: seamCollisions.length,
      timestamp: new Date().toISOString()
    }
  });
}

// Legacy wrappers for backwards compatibility
function runValidationBenchmark(limit) {
  return runSeedSuiteBenchmark(limit);
}
function runSingleBench(mode, maxNodes, alphabetPerm, permName) {
  return runSingleScientificBench(mode, maxNodes, alphabetPerm, '');
}

} // end aa2frWorkerMain

if (typeof window !== 'undefined') {
  window.aa2frWorkerMain = aa2frWorkerMain;
} else {
  aa2frWorkerMain();
}
