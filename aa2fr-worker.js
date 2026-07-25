// c:\\abc\\aa2fr-worker.js
// AA2FR Experimental Mathematics Laboratory - Search Engine Worker

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
let prefixPacked = new Int32Array(MAX_DEPTH); // a=0, b=1, c=65536 (2^16)

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
