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
let suffixDeadEndCounts = new Map();

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

  getOrder(counts, len) {
    return this.letters;
  }

  step(engine) {
    this.stats.steps++;
    
    if (this.currentDepth >= this.stack.length) {
      this.stack.push({
        tryIdx: 0,
        validBranches: 0,
        order: this.getOrder(engine.letterCounts, engine.wordLen)
      });
    }
    
    let frame = this.stack[this.currentDepth];
    
    if (frame.tryIdx >= frame.order.length) {
      // Exhausted this node
      this.stats.backtracks++;
      this.stats.stepsSinceNewRecord++;
      this.onBacktrack(this.currentDepth);
      engine.emitEvent('backtrack', { from_depth: this.currentDepth });
      
      if (this.currentDepth === 0) {
        return false; // Search complete
      }
      
      engine.popLetter();
      this.stack.pop();
      this.currentDepth--;
      return true; // continue
    }
    
    let letter = frame.order[frame.tryIdx++];
    this.lastDecision = `Selected '${letter}'`;
    
    engine.pushLetter(letter);
    let obs = engine.validateWordConstraints(false);
    
    let resultStr = 'valid';
    let s8 = engine.getSuffix(8);
    let dangerScore = s8.length >= 4 ? (engine.suffixDeadEndCounts.get(s8) || 0) : 0;
    
    if (obs) {
      resultStr = 'dead_end';
      engine.recordObstruction(obs);
      if (s8.length >= 4) engine.suffixDeadEndCounts.set(s8, dangerScore + 1);
      
      this.onDeadEnd(letter, obs);
      engine.emitEvent('node', { 
        depth: this.currentDepth + 1, 
        letter, 
        result: resultStr,
        branching: frame.validBranches,
        danger_score: dangerScore + 1,
        obstruction: obs 
      });
      engine.popLetter();
    } else {
      frame.validBranches++;
      this.currentDepth++;
      if (engine.wordLen > engine.maxLen) {
        engine.maxLen = engine.wordLen;
        this.stats.stepsSinceNewRecord = 0;
        this.onRecord(engine.maxLen);
        self.postMessage({ type: 'milestone', length: engine.maxLen, word: engine.getSuffix(50) });
        engine.emitEvent('milestone', { depth: this.currentDepth, max_length: engine.maxLen });
      }
      engine.emitEvent('node', { 
        depth: this.currentDepth, 
        letter, 
        result: resultStr,
        branching: frame.validBranches,
        danger_score: dangerScore,
        obstruction: null
      });
    }
    return true;
  }
  
  onDeadEnd(letter, obs) {}
  onBacktrack(depth) {}
  onRecord(len) {}
  
  statistics() { return this.stats; }
  explainDecision() { return this.lastDecision; }
}

class DFSStrategy extends SearchStrategy {
  getOrder(counts, len) {
    this.lastDecision = `DFS default order`;
    return this.letters;
  }
}

class PriorityParikhStrategy extends SearchStrategy {
  getOrder(counts, len) {
    let order = [...this.letters];
    let scores = {};
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
    return order;
  }
}

// -------------------------------------------------------------------------
// SEARCH ENGINE (STATE MANAGER)
// -------------------------------------------------------------------------

const Engine = {
  letterCounts: { a:0, b:0, c:0 },
  wordLen: 0,
  maxLen: 0,
  suffixDeadEndCounts: new Map(),
  
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
      parikh: { ...letterCounts },
      strategy: config.strategy,
      decision: activeStrategy.explainDecision()
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
      if (config.mode) config.mode = config.mode.toLowerCase();
      wordArr = [];
      wordLen = 0;
      Engine.maxLen = 0;
      letterCounts = { a: 0, b: 0, c: 0 };
      obstructionCounts = {};
      Engine.suffixDeadEndCounts = new Map();
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
          activeStrategy.stack.push({ tryIdx: 0, validBranches: 1, order: activeStrategy.getOrder(letterCounts, wordLen) });
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

  wordArr = [];
  wordLen = 0;
  letterCounts = {a:0, b:0, c:0};
  
  // Test 1: Forbid4 check
  config.mode = 'AA2FR';
  let testWordsForbid = [
    { w: ['b','a','a','c'], expect: true },
    { w: ['a','b','b','c'], expect: true },
    { w: ['a','b','a','c'], expect: false }
  ];
  
  for (let t of testWordsForbid) {
    wordLen = 0;
    for (let c of t.w) pushLetter(c);
    let v = validateWordConstraints(true);
    assert((v !== null) === t.expect, `Forbid4 check for ${t.w.join('')}`);
  }
  
  // Test 2: Abelian square check
  let testWordsAbelian = [
    { w: ['a','b','a','b'], expect: true }, // len 4, half 2 (ab ab)
    { w: ['a','b','c','b','a','c'], expect: true }, // (abc bac)
    { w: ['a','b','c','a'], expect: false }
  ];
  
  for (let t of testWordsAbelian) {
    wordLen = 0;
    for (let c of t.w) pushLetter(c);
    let v = validateWordConstraints(true);
    assert((v !== null) === t.expect, `Abelian square check for ${t.w.join('')}`);
  }
  
  // Restore state
  wordArr = oldArr;
  wordLen = oldLen;
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

  return results;
}
