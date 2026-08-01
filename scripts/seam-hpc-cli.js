#!/usr/bin/env node
/**
 * ============================================================================
 * SEAM SEARCH & VERIFICATION ENGINE — STANDALONE HPC CLI RUNNER
 * ============================================================================
 * An autonomous, zero-dependency Node.js High-Performance Computing (HPC)
 * command-line tool for discovering abelian-square-free connecting bridges across
 * word boundaries and replicating combinatorial thresholds (Rao & Rosenfeld, 2018).
 *
 * Designed for multi-core desktop workstations and server clusters, circumventing
 * browser sandbox memory limits and background thread throttling.
 *
 * USAGE EXAMPLES:
 *   node seam-hpc-cli.js --mode=p6 --workers=8 --iterations=10
 *   node seam-hpc-cli.js --mode=weld --u=bbbaabaaac --v=ccccbbbcbc --maxLen=10
 *   node seam-hpc-cli.js --mode=neg --workers=4
 *   node seam-hpc-cli.js --help
 * ============================================================================
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ============================================================================
// WORKER THREAD EXECUTION ENGINE (Runs when spawned as worker)
// ============================================================================
if (!isMainThread) {
  const { mode, taskData, threadId } = workerData;
  const MAX_DEPTH = 5000;
  
  // Exact Float64Array arithmetic packing (a=0, b=1, c=65536)
  const prefixA = new Int32Array(MAX_DEPTH);
  const prefixB = new Int32Array(MAX_DEPTH);
  const prefixC = new Int32Array(MAX_DEPTH);
  const prefixPacked = new Float64Array(MAX_DEPTH);

  function getParikh(l, r) {
    if (l === 0) return [prefixA[r - 1], prefixB[r - 1], prefixC[r - 1]];
    return [prefixA[r - 1] - prefixA[l - 1], prefixB[r - 1] - prefixB[l - 1], prefixC[r - 1] - prefixC[l - 1]];
  }

  function getPacked(l, r) {
    if (l === 0) return prefixPacked[r - 1];
    return prefixPacked[r - 1] - prefixPacked[l - 1];
  }

  function checkAbelian(l1, r1, l2, r2) {
    if (getPacked(l1, r1) !== getPacked(l2, r2)) return false;
    const v1 = getParikh(l1, r1);
    const v2 = getParikh(l2, r2);
    return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
  }

  /**
   * minK exists because the seam blocks are g3 images, which contain doubled
   * letters by construction (g3(a) = bbbaabaaac starts "bbb"). Scanning from
   * k = 1 rejects every such block instantly as a period-1 abelian square, so
   * the default weld invocation could never return a bridge - it was structurally
   * guaranteed to print zero. minK = 2 is the aa2f setting of Makela's question,
   * where period-1 squares are permitted. See MATH_CLAIMS.md rows 4 and 26.
   */
  function checkSuffixAbelianFree(wordLen, maxK = 0, minK = 1) {
    const limit = maxK > 0 ? Math.min(Math.floor(wordLen / 2), maxK) : Math.floor(wordLen / 2);
    for (let k = minK; k <= limit; k++) {
      if (checkAbelian(wordLen - 2 * k, wordLen - k, wordLen - k, wordLen)) {
        return false;
      }
    }
    return true;
  }

  if (mode === 'neg') {
    // Negative Control: Exhaustive scan of length <= 8 ternary words
    let nodes = 0;
    let foundLen7 = 0;
    let foundLen8 = 0;

    function dfsNeg(len) {
      nodes++;
      if ((nodes % 5000) === 0) {
        parentPort.postMessage({ type: 'progress', nodes, threadId });
      }
      if (len === 7) foundLen7++;
      if (len === 8) { foundLen8++; return; }
      
      for (let c = 0; c < 3; c++) {
        const valPacked = (c === 0) ? 0 : ((c === 1) ? 1 : 65536);
        prefixA[len] = (len === 0 ? 0 : prefixA[len-1]) + (c === 0 ? 1 : 0);
        prefixB[len] = (len === 0 ? 0 : prefixB[len-1]) + (c === 1 ? 1 : 0);
        prefixC[len] = (len === 0 ? 0 : prefixC[len-1]) + (c === 2 ? 1 : 0);
        prefixPacked[len] = (len === 0 ? 0 : prefixPacked[len-1]) + valPacked;
        
        if (checkSuffixAbelianFree(len + 1)) {
          dfsNeg(len + 1);
        }
      }
    }
    dfsNeg(0);
    parentPort.postMessage({ type: 'done', nodes, result: { foundLen7, foundLen8 }, threadId });
  } 
  else if (mode === 'weld') {
    // Seam Bridge Welding
    const { u, v, maxBridgeLen, minK } = taskData;
    let nodes = 0;
    let validBridges = [];

    // Pre-populate U
    for (let i = 0; i < u.length; i++) {
      const ch = u[i];
      const c = (ch === 'a') ? 0 : ((ch === 'b') ? 1 : 2);
      const valPacked = (c === 0) ? 0 : ((c === 1) ? 1 : 65536);
      prefixA[i] = (i === 0 ? 0 : prefixA[i-1]) + (c === 0 ? 1 : 0);
      prefixB[i] = (i === 0 ? 0 : prefixB[i-1]) + (c === 1 ? 1 : 0);
      prefixC[i] = (i === 0 ? 0 : prefixC[i-1]) + (c === 2 ? 1 : 0);
      prefixPacked[i] = (i === 0 ? 0 : prefixPacked[i-1]) + valPacked;
    }

    function testSeam(currentBridge) {
      const full = u + currentBridge + v;
      for (let i = u.length; i < full.length; i++) {
        const ch = full[i];
        const c = (ch === 'a') ? 0 : ((ch === 'b') ? 1 : 2);
        const valPacked = (c === 0) ? 0 : ((c === 1) ? 1 : 65536);
        prefixA[i] = prefixA[i-1] + (c === 0 ? 1 : 0);
        prefixB[i] = prefixB[i-1] + (c === 1 ? 1 : 0);
        prefixC[i] = prefixC[i-1] + (c === 2 ? 1 : 0);
        prefixPacked[i] = prefixPacked[i-1] + valPacked;
        
        if (!checkSuffixAbelianFree(i + 1, 0, minK)) return false;
      }
      return true;
    }

    /**
     * Is U + bridge free of abelian squares? Added 2026-07-28.
     *
     * Abelian-square-freeness is prefix-closed: if U + bridge already contains a
     * square, no extension of bridge can remove it. Without this test the search
     * was a full 3^maxBridgeLen enumeration, which is why it needed many cores to
     * finish. morphisms.js weldBridge() has always pruned here; the parallel
     * runner did not, and was therefore asymptotically worse than the forty-line
     * function it was supposed to scale up.
     */
    function prefixClean(bridge) {
      const s = u + bridge;
      for (let i = u.length; i < s.length; i++) {
        const ch = s[i];
        const c = (ch === 'a') ? 0 : ((ch === 'b') ? 1 : 2);
        const valPacked = (c === 0) ? 0 : ((c === 1) ? 1 : 65536);
        prefixA[i] = prefixA[i-1] + (c === 0 ? 1 : 0);
        prefixB[i] = prefixB[i-1] + (c === 1 ? 1 : 0);
        prefixC[i] = prefixC[i-1] + (c === 2 ? 1 : 0);
        prefixPacked[i] = prefixPacked[i-1] + valPacked;
        if (!checkSuffixAbelianFree(i + 1, 0, minK)) return false;
      }
      return true;
    }

    // Diagnostic: is the given U itself abelian-square-free? The search assumes
    // it is, and silently returning "no bridges" for a dirty U would be misleading.
    let uClean = true;
    for (let i = 1; i <= u.length; i++) {
      if (!checkSuffixAbelianFree(i, 0, minK)) { uClean = false; break; }
    }

    function dfsWeld(bridge, depth) {
      nodes++;
      if ((nodes % 1000) === 0) {
        parentPort.postMessage({ type: 'progress', nodes, threadId });
      }
      if (!prefixClean(bridge)) return;        // prefix-closed: prune the whole subtree
      if (testSeam(bridge)) {
        validBridges.push(bridge);
        parentPort.postMessage({ type: 'candidate', bridge, threadId });
      }
      if (depth >= maxBridgeLen) return;

      for (const ch of ['a', 'b', 'c']) {
        dfsWeld(bridge + ch, depth + 1);
      }
    }
    dfsWeld('', 0);
    parentPort.postMessage({ type: 'done', nodes, result: { validBridges, uClean }, threadId });
  }
  else if (mode === 'p6') {
    // ------------------------------------------------------------------------
    // Bounded audit of g3(h6^n(a)) for abelian squares of half-length K >= 6.
    //
    // REWRITTEN 2026-07-28. The previous implementation of this mode did not
    // load morphisms.js at all: it ran a generic ternary DFS with an arbitrary
    // node cap, incremented its "passed" counter unconditionally, and the caller
    // printed a hardcoded violation count of 0 under a "CERTIFIED / Provable"
    // banner. None of that was a replication of anything. See MATH_CLAIMS.md
    // row 26 for the full record.
    //
    // What this does now: generates the actual word g3(h6^n(a)) and scans a
    // disjoint band of half-lengths K per worker, reporting the real number of
    // abelian squares found and the position of the first one.
    //
    // SCOPE: this is a FINITE audit of one prefix. Rao & Rosenfeld's Theorem 9
    // is a statement about the infinite word and is not re-proved here. For an
    // exact statement about the infinite word see factor-frequencies.js, which
    // enumerates complete factor sets instead of scanning a prefix.
    // ------------------------------------------------------------------------
    const { H6, G3 } = require('../src/morphisms.js');
    const { iterations, maxK, kOffset, kStride } = taskData;

    let w = 'a';
    for (let i = 0; i < iterations; i++) {
      let next = '';
      for (const ch of w) next += H6[ch];
      w = next;
    }
    let word = '';
    for (const ch of w) word += G3[ch];

    const n = word.length;
    const pA = new Int32Array(n + 1);
    const pB = new Int32Array(n + 1);
    const pC = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) {
      pA[i + 1] = pA[i] + (word[i] === 'a' ? 1 : 0);
      pB[i + 1] = pB[i] + (word[i] === 'b' ? 1 : 0);
      pC[i + 1] = pC[i] + (word[i] === 'c' ? 1 : 0);
    }

    let nodes = 0;
    let violations = 0;
    let firstViolation = null;
    const kChecked = [];

    for (let K = 6 + kOffset; K <= maxK; K += kStride) {
      kChecked.push(K);
      for (let i = 0; i + 2 * K <= n; i++) {
        nodes++;
        if ((nodes % 200000) === 0) parentPort.postMessage({ type: 'progress', nodes, threadId });
        if (pA[i + K] - pA[i] !== pA[i + 2 * K] - pA[i + K]) continue;
        if (pB[i + K] - pB[i] !== pB[i + 2 * K] - pB[i + K]) continue;
        if (pC[i + K] - pC[i] !== pC[i + 2 * K] - pC[i + K]) continue;
        violations++;
        if (firstViolation === null) {
          firstViolation = { K, position: i, factor: word.slice(i, i + 2 * K) };
        }
      }
    }

    parentPort.postMessage({
      type: 'done',
      nodes,
      result: { violations, firstViolation, kChecked, wordLength: n, iterations },
      threadId
    });
  }
  process.exit(0);
}

// ============================================================================
// MAIN THREAD ORCHESTRATOR (CLI & HPC Dispatcher)
// ============================================================================
function printBanner() {
  console.log("============================================================================");
  console.log("   SEAM SEARCH -- STANDALONE MULTI-CORE CLI RUNNER   ");
  console.log("   Finite combinatorial searches over words. Results are bounded by the     ");
  console.log("   search limits printed below; see MATH_CLAIMS.md for what is established. ");
  console.log("============================================================================");
  console.log(`[SYS] Host Architecture : ${os.arch()} | Platform: ${os.platform()} | Node: ${process.version}`);
  console.log(`[SYS] Available Cores   : ${os.cpus().length} logical CPU threads`);
  console.log(`[SYS] Memory Budget     : ${(os.totalmem() / 1e9).toFixed(2)} GB RAM`);
  console.log("----------------------------------------------------------------------------\n");
}

function printHelp() {
  printBanner();
  console.log("COMMAND-LINE ARGUMENTS:");
  console.log("  --mode=<weld|p6|neg>   Execution mode:");
  console.log("                           weld : exhaustive search for a bridge X with U.X.V");
  console.log("                                  free of abelian squares");
  console.log("                           p6   : bounded scan of g3(h6^n(a)) for abelian squares");
  console.log("                                  of half-length K >= 6");
  console.log("                           neg  : exhaustive ternary cutoff control at length 7/8");
  console.log("  --u=<string>           Left boundary block U (default: bbbaabaaac)");
  console.log("  --v=<string>           Right boundary block V (default: ccccbbbcbc)");
  console.log("  --maxLen=<number>      weld: maximum bridge length (default: 8)");
  console.log("  --depth=<number>       p6: h6 iterations; word length is 10 * 3^depth (default: 9)");
  console.log("  --maxK=<number>        p6: largest half-length to scan (default: 40)");
  console.log("  --workers=<number>     Parallel worker threads (default: CPU core count)");
  console.log("  --help                 Display this help\n");
  console.log("EXAMPLES:");
  console.log("  node seam-hpc-cli.js --mode=weld --u=bbbaabaaac --v=ccccbbbcbc --maxLen=10");
  console.log("  node seam-hpc-cli.js --mode=p6 --depth=9 --maxK=40 --workers=8");
  console.log("  node seam-hpc-cli.js --mode=neg\n");
  console.log("WHAT THESE MODES DO AND DO NOT SHOW:");
  console.log("  neg  is exhaustive over all ternary words of the given length, so its");
  console.log("       result is complete for lengths 7 and 8.");
  console.log("  weld is exhaustive over bridges up to --maxLen, so 'no bridge found' is");
  console.log("       complete for that bound and says nothing beyond it.");
  console.log("  p6   scans one finite prefix. It cannot prove anything about the infinite");
  console.log("       word. For exact statements about the infinite word use");
  console.log("       'node factor-frequencies.js', which enumerates complete factor sets.\n");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'weld',
    u: 'bbbaabaaac',
    v: 'ccccbbbcbc',
    maxLen: 8,
    workers: Math.max(1, Math.min(os.cpus().length, 16)),
    depth: 9,        // p6: h6 iteration count; word length is 10 * 3^depth
    maxK: 40,        // p6: largest half-length to scan
    // weld: smallest half-length treated as a violation.
    // Default 6, because the default U and V are g3 images and those contain
    // abelian squares at K = 2..5 by construction: g3(a) = bbbaabaaac contains
    // "baab", a period-2 square, and the construction only ever claimed to avoid
    // K > 5 (MATH_CLAIMS.md 6a, 6b). Asking for a seam with no square at K >= 2
    // between two blocks that each already contain one is unsatisfiable, so the
    // old behaviour of scanning from K = 1 made the default run print zero for a
    // reason that had nothing to do with the seam. K >= 6 is the regime where the
    // question is both meaningful and open.
    minK: 6,
    help: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') config.help = true;
    else if (arg.startsWith('--mode=')) config.mode = arg.split('=')[1];
    else if (arg.startsWith('--u=')) config.u = arg.split('=')[1];
    else if (arg.startsWith('--v=')) config.v = arg.split('=')[1];
    else if (arg.startsWith('--maxLen=')) config.maxLen = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--workers=')) config.workers = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--depth=')) config.depth = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--maxK=')) config.maxK = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--minK=')) config.minK = parseInt(arg.split('=')[1], 10);
    // --iterations was the old p6 flag. It counted identical repeated passes and
    // meant nothing; accepted as an alias for --depth so old commands still run.
    else if (arg.startsWith('--iterations=')) config.depth = parseInt(arg.split('=')[1], 10);
  }
  return config;
}

async function runHpcSearch(config) {
  printBanner();
  console.log(`[INIT] Execution Mode  : ${config.mode.toUpperCase()}`);
  console.log(`[INIT] Parallel Threads: ${config.workers} worker threads spawned simultaneously`);
  if (config.mode === 'weld') {
    console.log(`[INIT] Left Block (U)  : ${config.u} (length ${config.u.length})`);
    console.log(`[INIT] Right Block (V) : ${config.v} (length ${config.v.length})`);
    console.log(`[INIT] Max Bridge Len  : ${config.maxLen}`);
    console.log(`[INIT] Half-lengths    : K >= ${config.minK} counted as violations` +
      (config.minK > 1 ? `  (period-1 squares like 'aa' are ALLOWED - the aa2f setting)` : `  (strict: even 'aa' is a violation)`));
  } else if (config.mode === 'p6') {
    console.log(`[INIT] h6 iterations   : ${config.depth}  (word length = 10 * 3^${config.depth} = ${(10 * Math.pow(3, config.depth)).toLocaleString()})`);
    console.log(`[INIT] Half-lengths    : K = 6 .. ${config.maxK}, split across workers in disjoint bands`);
  }
  console.log("----------------------------------------------------------------------------\n");

  const startTime = performance.now();
  let totalNodes = 0;
  let activeWorkers = 0;
  let allBridges = new Set();
  let completedThreads = 0;
  const perThreadNodes = new Map();

  const progressInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    const speed = elapsed > 0 ? Math.floor(totalNodes / elapsed) : 0;
    const mem = (process.memoryUsage().heapUsed / 1e6).toFixed(1);
    process.stdout.write(`\r[BUSY] Time: ${elapsed.padStart(6)}s | Total Nodes: ${totalNodes.toLocaleString().padStart(12)} | Rate: ${speed.toLocaleString().padStart(9)} /s | Heap: ${mem} MB`);
  }, 200);

  const workerPromises = [];
  const numWorkers = config.mode === 'neg' ? 1 : config.workers; // Neg control runs deterministic exhaustive bound

  for (let i = 0; i < numWorkers; i++) {
    workerPromises.push(new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: {
          mode: config.mode,
          taskData: {
            u: config.u,
            v: config.v,
            maxBridgeLen: config.maxLen,
            minK: config.minK,
            // p6: every worker builds the same word but scans a DISJOINT band of
            // half-lengths, so the parallelism does real work instead of
            // repeating an identical deterministic pass N times.
            iterations: config.depth,
            maxK: config.maxK,
            kOffset: i,
            kStride: numWorkers
          },
          threadId: i + 1
        }
      });

      activeWorkers++;

      worker.on('message', (msg) => {
        if (msg.type === 'progress') {
          // Workers report their own cumulative count; different modes post at
          // different intervals, so accumulate per thread rather than assuming
          // a fixed increment (the previous fixed "+= 1000" under-reported p6
          // by a factor of 5 and would now be wrong by 200).
          const prev = perThreadNodes.get(msg.threadId) || 0;
          totalNodes += (msg.nodes - prev);
          perThreadNodes.set(msg.threadId, msg.nodes);
        } else if (msg.type === 'candidate') {
          allBridges.add(msg.bridge);
          process.stdout.write(`\n[CANDIDATE] Thread #${msg.threadId} found bridge: [ ${msg.bridge} ] (Length: ${msg.bridge.length})\n`);
        } else if (msg.type === 'done') {
          const prevDone = perThreadNodes.get(msg.threadId) || 0;
          totalNodes += (msg.nodes - prevDone);   // delta, not a second full add
          perThreadNodes.set(msg.threadId, msg.nodes);
          completedThreads++;
          resolve(msg.result);
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }));
  }

  const results = await Promise.all(workerPromises);
  clearInterval(progressInterval);

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  const avgSpeed = totalTime > 0 ? Math.floor(totalNodes / totalTime) : 0;

  console.log(`\n\n============================================================================`);
  console.log(`   EXECUTION COMPLETED IN ${totalTime} SECONDS (${totalNodes.toLocaleString()} NODES EVALUATED)   `);
  console.log(`   Average Throughput: ${avgSpeed.toLocaleString()} nodes/sec across ${numWorkers} cores`);
  console.log(`============================================================================\n`);

  if (config.mode === 'weld') {
    const bridgesArr = Array.from(allBridges).sort((a, b) => a.length - b.length);
    if (results[0] && results[0].uClean === false) {
      console.log(`[WARNING] U already contains an abelian square of half-length K >= ${config.minK},`);
      console.log(`          so no bridge can succeed: the violation is inside U, not at the seam.`);
      console.log(`          Either fix U or raise --minK.\n`);
    }
    console.log(`[RESULT] Bridges X with U.X.V free of abelian squares, |X| <= ${config.maxLen}: ${bridgesArr.length}`);
    if (bridgesArr.length > 0) {
      console.log(`[RESULT] Shortest such bridge: [ ${bridgesArr[0]} ] (length ${bridgesArr[0].length})`);
      console.log(`\n--- REPORT TEMPLATE (paste into a GitHub issue if you want this checked) ---`);
      console.log(`Title: Seam bridge candidate for (${config.u}) . X . (${config.v})`);
      console.log(`Body : Bridge '${bridgesArr[0]}' gives U.X.V with no abelian square of`);
      console.log(`       half-length K in [${config.minK}, floor(|U.X.V|/2)]. Squares of half-length`);
      console.log(`       below ${config.minK} were NOT counted. Exhaustive over |X| <= ${config.maxLen}.`);
      console.log(`       Runner: seam-hpc-cli.js --mode=weld, ${totalTime}s, ${numWorkers} threads.`);
      console.log(`       This is a finite check on one concatenation. It is not a statement`);
      console.log(`       about any infinite word and has not been independently verified.`);
      console.log(`--------------------------------------------------------------------------\n`);
    } else {
      console.log(`[RESULT] No bridge of length <= ${config.maxLen} works. Try a larger --maxLen.\n`);
    }
  } else if (config.mode === 'neg') {
    const r = results[0];
    console.log(`[RESULT] Negative control, exhaustive enumeration over {a,b,c}:`);
    console.log(`         - abelian-square-free words of length 7: ${r.foundLen7} (expected 18)`);
    console.log(`         - abelian-square-free words of length 8: ${r.foundLen8} (expected 0)`);
    if (r.foundLen7 === 18 && r.foundLen8 === 0) {
      console.log(`[OK]     Matches the expected exact cutoff. The enumeration is exhaustive over`);
      console.log(`         all ternary words, so this settles lengths 7 and 8 completely.`);
      console.log(`         See MATH_CLAIMS.md row 1.\n`);
    } else {
      console.log(`[FAILURE] Counts do not match. The square test is wrong, or the enumeration is.\n`);
    }
  } else if (config.mode === 'p6') {
    const violations = results.reduce((s, r) => s + r.violations, 0);
    const kAll = results.flatMap(r => r.kChecked).sort((a, b) => a - b);
    const wordLength = results[0] ? results[0].wordLength : 0;
    const first = results.map(r => r.firstViolation).filter(Boolean)[0];

    console.log(`[RESULT] Bounded audit of g3(h6^${config.depth}(a)):`);
    console.log(`         - word length                    : ${wordLength.toLocaleString()} letters`);
    console.log(`         - half-lengths scanned           : K = ${kAll[0]} .. ${kAll[kAll.length - 1]} (${kAll.length} values, disjoint per worker)`);
    console.log(`         - abelian squares found          : ${violations}`);
    if (violations === 0) {
      console.log(`\n[OK]     No abelian square of half-length K in [${kAll[0]}, ${kAll[kAll.length - 1]}] occurs in this`);
      console.log(`         ${wordLength.toLocaleString()}-letter prefix.`);
      console.log(`\n         What this is NOT: this is a finite scan of one prefix. It does not`);
      console.log(`         prove anything about the infinite word, and it does not reprove`);
      console.log(`         Rao & Rosenfeld's Theorem 9 (MATH_CLAIMS.md row 6a). For an exact`);
      console.log(`         statement about the infinite word, run:`);
      console.log(`             node factor-frequencies.js --maxk 40`);
      console.log(`         which enumerates complete factor sets instead of scanning.\n`);
    } else {
      console.log(`\n[FAILURE] Found ${violations} abelian square(s) at K >= 6, which contradicts`);
      console.log(`          Theorem 9. Either morphisms.js has drifted or the scan is wrong.`);
      if (first) {
        console.log(`          First: K = ${first.K} at position ${first.position}`);
        console.log(`          Factor: ${first.factor.slice(0, 40)}${first.factor.length > 40 ? '...' : ''}`);
      }
      console.log(`          Run 'node test.js' before trusting any other output.\n`);
    }
  }
}

// Execute CLI
const cliConfig = parseArgs();
if (cliConfig.help) {
  printHelp();
  process.exit(0);
} else {
  runHpcSearch(cliConfig).catch((err) => {
    console.error(`\n[FATAL ERROR] Search execution failed:`, err);
    process.exit(1);
  });
}
