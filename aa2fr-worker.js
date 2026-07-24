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
// SEARCH STRATEGIES
// -------------------------------------------------------------------------

function getUValue(counts, total) {
  if (total === 0) return 0;
  let sum = 0;
  for (let c of Object.values(counts)) {
    let diff = (c / total) - (1/3);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function getLetterOrder() {
  if (config.strategy === 'fixed') {
    return letters;
  } else if (config.strategy === 'rotation') {
    return PERMUTATIONS[currentPermutationIdx];
  } else if (config.strategy === 'gavrilenko') {
    let order = [...letters];
    let scores = {};
    for (let l of order) {
      let counts = { ...letterCounts };
      counts[l]++;
      let wLen = wordLen + 1;
      let u = getUValue(counts, wLen);
      // Score(w + x) = |w|² - (U(w+x)³ * 27) / (8 * |w|)
      scores[l] = (wordLen * wordLen) - ((Math.pow(u, 3) * 27) / (8 * (wordLen || 1)));
    }
    order.sort((a, b) => scores[b] - scores[a]); // descending
    return order;
  }
  return letters;
}

// -------------------------------------------------------------------------
// DFS SEARCH ENGINE
// -------------------------------------------------------------------------

function recordObstruction(obs) {
  if (!obs) return;
  let key = obs.half_length;
  obstructionCounts[key] = (obstructionCounts[key] || 0) + 1;
}

function emitEvent(type, data) {
  if (type === 'node' && currentDepth > 200) return;
  if (type === 'backtrack' && currentDepth > 1000) return;
  
  evolutionBuffer.push({ type, ...data });
}

function getSuffix(len) {
  if (wordLen === 0) return '';
  let start = Math.max(0, wordLen - len);
  return wordArr.slice(start, wordLen).join('');
}

function searchStep() {
  stats.steps++;
  
  if (currentDepth >= stack.length) {
    stack.push({
      order: getLetterOrder(),
      tryIdx: 0,
      validBranches: 0
    });
  }
  
  let frame = stack[currentDepth];
  
  if (frame.tryIdx >= frame.order.length) {
    // Backtrack
    stats.backtracks++;
    stats.stepsSinceNewRecord++;
    
    // Rotation strategy check
    if (config.strategy === 'rotation' && stats.stepsSinceNewRecord > 50000) {
      currentPermutationIdx = (currentPermutationIdx + 1) % PERMUTATIONS.length;
      stats.stepsSinceNewRecord = 0;
    }
    
    emitEvent('backtrack', { from_depth: currentDepth });
    
    if (currentDepth === 0) {
      // Exhausted
      isRunning = false;
      self.postMessage({ type: 'exhausted' });
      return false;
    }
    
    popLetter();
    stack.pop();
    currentDepth--;
    return true; // continue
  }
  
  let letter = frame.order[frame.tryIdx];
  frame.tryIdx++;
  
  pushLetter(letter);
  let obs = validateWordConstraints(false);
  
  let resultStr = 'valid';
  if (obs) {
    resultStr = 'dead_end';
    recordObstruction(obs);
    popLetter();
  } else {
    frame.validBranches++;
    currentDepth++;
    if (wordLen > maxLen) {
      maxLen = wordLen;
      stats.stepsSinceNewRecord = 0;
      self.postMessage({ type: 'milestone', length: maxLen, word: getSuffix(50) });
      emitEvent('milestone', { depth: currentDepth, max_length: maxLen });
    }
    emitEvent('node', { depth: currentDepth, letter, result: resultStr });
  }
  
  if (config.analyticsEnabled) {
    analyticsBuffer.push({
      step: stats.steps,
      depth: currentDepth,
      letter: letter,
      result: resultStr,
      branching: frame.validBranches,
      parikh_balance: getUValue(letterCounts, wordLen),
      parikh_a: letterCounts.a,
      parikh_b: letterCounts.b,
      parikh_c: letterCounts.c,
      suffix_8: getSuffix(8),
      suffix_15: getSuffix(15),
      obstruction: obs
    });
  }
  
  return true;
}

function searchLoop() {
  if (!isRunning || isPaused) return;
  
  let now = Date.now();
  let maxSteps = 10000;
  
  for (let i = 0; i < maxSteps; i++) {
    if (!searchStep()) return;
  }
  
  now = Date.now();
  
  if (now - lastStateSendTime > 100) {
    self.postMessage({
      type: 'state_update',
      word: getSuffix(300),
      length: wordLen,
      stats: { ...stats },
      parikh: { ...letterCounts },
      strategy: config.strategy
    });
    lastStateSendTime = now;
  }
  
  if (now - lastAnalyticsSendTime > 500) {
    if (analyticsBuffer.length > 0) {
      self.postMessage({ type: 'analytics_batch', data: analyticsBuffer });
      analyticsBuffer = [];
    }
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
      // Normalize mode to lowercase for consistent comparison
      if (config.mode) config.mode = config.mode.toLowerCase();
      wordArr = [];
      wordLen = 0;
      maxLen = 0;
      stack = [];
      currentDepth = 0;
      currentPermutationIdx = 0;
      letterCounts = { a: 0, b: 0, c: 0 };
      obstructionCounts = {};
      suffixDeadEndCounts = new Map();
      analyticsBuffer = [];
      evolutionBuffer = [];
      branchingHistory = [];
      backtrackHistory = [];
      lastAnalyticsSendTime = Date.now();
      lastStateSendTime = Date.now();
      stats = { steps: 0, backtracks: 0, deadEnds: 0, startTime: Date.now(), lastYieldTime: Date.now(), stepsSinceNewRecord: 0 };
      
      if (config.seed) {
        let seedChars = typeof config.seed === 'string' ? config.seed.split('') : config.seed;
        for (let char of seedChars) {
          pushLetter(char);
        }
        currentDepth = wordLen;
        maxLen = wordLen;
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
        searchStep();
        self.postMessage({
          type: 'state_update',
          word: getSuffix(300),
          length: wordLen,
          stats: { ...stats },
          parikh: { ...letterCounts },
          strategy: config.strategy
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
  }
};

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
