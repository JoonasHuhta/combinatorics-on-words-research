/**
 * Industrial Backtracker for Mäkelä's Conjecture (aa2f / aa2fr)
 * 
 * USAGE:
 *   node scratch/backtracker.js [seed] [targetLength] [--resume] [--pure]
 * 
 * EXAMPLES:
 *   node scratch/backtracker.js a 2500
 *     - Starts search from "a" up to 2500 characters using the fast FORBID4 heuristic.
 * 
 *   node scratch/backtracker.js keranen_1928.txt 3000
 *     - Loads a known prefix from a file and continues the search up to 3000 chars.
 * 
 *   node scratch/backtracker.js a 2500 --resume
 *     - Resumes a previously interrupted run from the `checkpoint_worker_X.json` files.
 * 
 *   node scratch/backtracker.js a 2500 --pure
 *     - RUNS IN PURE MÄKELÄ MODE. Disables the FORBID4 empirical heuristic.
 *     - Mathematically exhaustive and complete, but significantly slower.
 *     - Use this for scientifically certified record attempts.
 */

const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ---------------------------------------------------------
// WORKER THREAD LOGIC
// ---------------------------------------------------------
if (!isMainThread) {
    const { seed, targetLength, searchOrder, pureMode } = workerData;

    const MAX_LEN = 30000; 
    
    if (targetLength > MAX_LEN) {
        parentPort.postMessage({ type: 'error', msg: `targetLength (${targetLength}) exceeds MAX_LEN (${MAX_LEN})` });
        return;
    }

    const word = new Uint8Array(MAX_LEN);
    const prefixA = new Int32Array(MAX_LEN + 1);
    const prefixB = new Int32Array(MAX_LEN + 1);
    const choiceStack = new Uint8Array(MAX_LEN + 1);
    
    function charToInt(c) {
        if (c === 'a') return 0;
        if (c === 'b') return 1;
        return 2; // c
    }

    function intToChar(i) {
        if (i === 0) return 'a';
        if (i === 1) return 'b';
        return 'c';
    }

    // Restore from checkpoint if available, otherwise use seed
    let currentLength = 0;
    let initialChoiceStack = null;
    let baseSeed = seed;

    if (workerData.checkpoint) {
        baseSeed = workerData.checkpoint.word;
        initialChoiceStack = workerData.checkpoint.choiceStack;
    } else {
        // If seed is a valid file path, read it
        if (fs.existsSync(seed)) {
            baseSeed = fs.readFileSync(seed, 'utf8').trim();
        }
    }

    if (baseSeed.length > MAX_LEN) {
        parentPort.postMessage({ type: 'error', msg: `Seed length (${baseSeed.length}) exceeds MAX_LEN (${MAX_LEN})` });
        return;
    }
    if (baseSeed.length >= targetLength) {
        parentPort.postMessage({ type: 'error', msg: 'Seed length is already >= targetLength' });
        return;
    }

    for (let i = 0; i < baseSeed.length; i++) {
        const c = charToInt(baseSeed[i]);
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        
        if (initialChoiceStack && i < initialChoiceStack.length) {
            choiceStack[i] = initialChoiceStack[i];
        } else {
            // Seed characters are fixed, they have no other branches in this run
            choiceStack[i] = 4; // Marker so it exhausts search if it backtracks past seed
        }
        currentLength++;
    }

    let maxDepthReached = currentLength;
    let stepCount = 0;
    let lastLogTime = Date.now();
    let lastCheckpointTime = Date.now();

    let minLength = workerData.checkpoint ? 0 : baseSeed.length;

    while (currentLength >= minLength) {
        if (currentLength >= targetLength) {
            let resultStr = "";
            for (let i = 0; i < currentLength; i++) resultStr += intToChar(word[i]);
            parentPort.postMessage({ type: 'success', word: resultStr });
            return;
        }

        const choiceIdx = choiceStack[currentLength];
        if (choiceIdx >= 3) {
            // Backtrack
            choiceStack[currentLength] = 0;
            currentLength--;
            continue;
        }

        choiceStack[currentLength]++;
        const c = searchOrder[choiceIdx];
        
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        
        currentLength++;
        stepCount++;
        
        let isValid = true;
        const len = currentLength;

        // FORBID4 Check (length 4 exact matches)
        // Only run if NOT in pure mode
        if (!pureMode && len >= 4) {
            const w1 = word[len - 4];
            const w2 = word[len - 3];
            const w3 = word[len - 2];
            const w4 = word[len - 1];
            if (
                (w1 === 1 && w2 === 0 && w3 === 0 && w4 === 2) ||
                (w1 === 2 && w2 === 0 && w3 === 0 && w4 === 1) ||
                (w1 === 0 && w2 === 1 && w3 === 1 && w4 === 2) ||
                (w1 === 2 && w2 === 1 && w3 === 1 && w4 === 0) ||
                (w1 === 0 && w2 === 2 && w3 === 2 && w4 === 1) ||
                (w1 === 1 && w2 === 2 && w3 === 2 && w4 === 0)
            ) {
                isValid = false;
            }
        }

        // Full O(1) Abelian Square Check for K >= 2 (Mäkelä aa2f constraint)
        if (isValid) {
            for (let blockSize = 2; blockSize <= (len >> 1); ++blockSize) {
                const rA = prefixA[len] - prefixA[len - blockSize];
                const rB = prefixB[len] - prefixB[len - blockSize];
                const lA = prefixA[len - blockSize] - prefixA[len - 2 * blockSize];
                const lB = prefixB[len - blockSize] - prefixB[len - 2 * blockSize];
                
                if (rA === lA && rB === lB) {
                    isValid = false;
                    break;
                }
            }
        }

        if (isValid) {
            if (currentLength > maxDepthReached) {
                maxDepthReached = currentLength;
                
                if (Date.now() - lastLogTime > 1000) {
                    let logStr = "";
                    for (let i = 0; i < currentLength; i++) logStr += intToChar(word[i]);
                    parentPort.postMessage({ type: 'progress', depth: maxDepthReached, word: logStr });
                    lastLogTime = Date.now();
                }
            }
            if (Date.now() - lastCheckpointTime > 60000) {
                let currentWordStr = "";
                for (let i = 0; i < currentLength; i++) currentWordStr += intToChar(word[i]);
                parentPort.postMessage({ 
                    type: 'checkpoint', 
                    state: {
                        word: currentWordStr,
                        choiceStack: Array.from(choiceStack.subarray(0, currentLength)),
                        pureMode: pureMode
                    }
                });
                lastCheckpointTime = Date.now();
            }
        } else {
            currentLength--;
        }
    }

    parentPort.postMessage({ type: 'exhausted', maxDepth: maxDepthReached });
} 
// ---------------------------------------------------------
// MAIN THREAD LOGIC
// ---------------------------------------------------------
else {
    const args = process.argv.slice(2);
    const isResume = args.includes("--resume");
    const isPure = args.includes("--pure");
    const posArgs = args.filter(a => a !== "--resume" && a !== "--pure");
    const seed = posArgs[0] || "a";
    const targetLength = parseInt(posArgs[1] || "3000", 10);
    const modeStr = isPure ? "pure" : "heuristic";
    const outputPath = `record_word_${targetLength}_${modeStr}.txt`;

    console.log(`--- Industrial Backtracker v9 (aa2fr Mode) ---`);
    console.log(`Target: ${targetLength} chars`);
    console.log(`Seed:   ${seed}`);
    console.log(`Mode:   ${isPure ? 'PURE (Exhaustive, FORBID4 disabled)' : 'HEURISTIC (FORBID4 enabled for speed)'}`);
    console.log(`Rules:  Ternary {a,b,c}, Abelian Squares K >= 2 forbidden.`);
    
    const orders = [
        [0, 1, 2], [0, 2, 1],
        [1, 0, 2], [1, 2, 0],
        [2, 0, 1], [2, 1, 0]
    ];
    
    let activeWorkers = orders.length;
    let globalMaxDepth = seed.length;
    const startSolve = Date.now();
    let winnerFound = false;

    // Helper function for independent verification
    function verifyAa2fr(word, pureMode) {
        if (!pureMode) {
            const forbid4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];
            for (const f of forbid4) {
                if (word.includes(f)) return false;
            }
        }

        const pA = new Int32Array(word.length + 1);
        const pB = new Int32Array(word.length + 1);
        const pC = new Int32Array(word.length + 1);
        for (let i = 0; i < word.length; i++) {
            pA[i + 1] = pA[i] + (word[i] === 'a' ? 1 : 0);
            pB[i + 1] = pB[i] + (word[i] === 'b' ? 1 : 0);
            pC[i + 1] = pC[i] + (word[i] === 'c' ? 1 : 0);
        }

        for (let len = 2; len <= Math.floor(word.length / 2); len++) {
            for (let i = 0; i <= word.length - 2 * len; i++) {
                const lA = pA[i + len] - pA[i];
                const lB = pB[i + len] - pB[i];
                const lC = pC[i + len] - pC[i];
                const rA = pA[i + 2 * len] - pA[i + len];
                const rB = pB[i + 2 * len] - pB[i + len];
                const rC = pC[i + 2 * len] - pC[i + len];
                
                if (lA === rA && lB === rB && lC === rC) {
                    return false;
                }
            }
        }
        return true;
    }

    for (let i = 0; i < orders.length; i++) {
        let checkpoint = null;
        const checkpointFile = `checkpoint_worker_${i}.json`;
        if (isResume && fs.existsSync(checkpointFile)) {
            checkpoint = JSON.parse(fs.readFileSync(checkpointFile, 'utf8'));
            if (checkpoint.pureMode !== undefined && checkpoint.pureMode !== isPure) {
                console.error(`FATAL: Worker ${i} checkpoint pureMode (${checkpoint.pureMode}) does not match CLI pureMode (${isPure}).`);
                console.error("Please ensure you use the exact same --pure flag as the original run when resuming.");
                process.exit(1);
            }
            console.log(`Resuming Worker ${i} from checkpoint...`);
        }

        const worker = new Worker(__filename, {
            workerData: { seed, targetLength, searchOrder: orders[i], checkpoint, pureMode: isPure }
        });

        worker.on('message', (msg) => {
            if (winnerFound) return;
            
            if (msg.type === 'progress') {
                if (msg.depth > globalMaxDepth) {
                    globalMaxDepth = msg.depth;
                    process.stdout.write(`\r[Worker ${i}] Depth: ${globalMaxDepth} ... `);
                    fs.appendFileSync("progressive_log.txt", `Length ${globalMaxDepth}:\n${msg.word}\n\n`);
                }
            } else if (msg.type === 'checkpoint') {
                fs.writeFileSync(checkpointFile, JSON.stringify(msg.state));
            } else if (msg.type === 'success') {
                winnerFound = true;
                console.log(`\n\n>>> RECORD ATTAINED BY WORKER ${i} <<<`);
                console.log(`Time Taken: ${(Date.now() - startSolve) / 1000} seconds.`);
                
                console.log(`Starting independent mathematical verification...`);
                if (!verifyAa2fr(msg.word, isPure)) {
                    console.error("FATAL: INDEPENDENT VERIFICATION FAILED! The generated word is invalid.");
                    process.exit(1);
                }
                console.log(`Independent verification PASSED.`);
                
                fs.writeFileSync(outputPath, msg.word);
                console.log(`Record saved to: ${outputPath}`);
                process.exit(0);
            } else if (msg.type === 'exhausted') {
                activeWorkers--;
                console.log(`\n[Worker ${i}] Exhausted search space (Max depth: ${msg.maxDepth}).`);
                if (activeWorkers === 0) {
                    console.log(`\nAll workers exhausted without finding target length.`);
                    console.log(`Global max depth reached: ${globalMaxDepth}`);
                }
            } else if (msg.type === 'error') {
                console.error(`\n${msg.msg}`);
                process.exit(1);
            }
        });
    }
}
