const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ---------------------------------------------------------
// WORKER THREAD LOGIC
// ---------------------------------------------------------
if (!isMainThread) {
    const { seed, targetLength, dictionaryPath, searchOrder } = workerData;

    const MAX_LEN = 20000; 
    
    const word = new Uint8Array(MAX_LEN);
    const prefixA = new Int32Array(MAX_LEN + 1);
    const prefixB = new Int32Array(MAX_LEN + 1);
    const hashStack = new BigInt64Array(MAX_LEN + 1);
    const choiceStack = new Uint8Array(MAX_LEN + 1);
    
    const validFactors = new Set();
    let dictWordLen = 0;
    
    function charToInt(c) {
        if (c === 'a') return 0;
        if (c === 'b') return 1;
        return 2;
    }

    function intToChar(i) {
        if (i === 0) return 'a';
        if (i === 1) return 'b';
        return 'c';
    }

    try {
        const fileContent = fs.readFileSync(dictionaryPath, 'utf8');
        const lines = fileContent.split(/\r?\n/);
        for (let line of lines) {
            line = line.trim();
            if (line.length > 0) {
                if (dictWordLen === 0) dictWordLen = line.length;
                let hash = 0n;
                for (let i = 0; i < line.length; i++) {
                    hash = hash * 3n + BigInt(charToInt(line[i]));
                }
                validFactors.add(hash);
            }
        }
    } catch (err) {
        parentPort.postMessage({ type: 'error', msg: `Worker failed to load dictionary: ${err.message}` });
        process.exit(1);
    }

    const DYNAMIC_MIN_BLOCK = Math.floor(dictWordLen / 2) + 1;
    const POWER_3_N_MINUS_1 = 3n ** BigInt(dictWordLen - 1);

    // Initialize seed securely
    let currentLength = 0;
    for (let i = 0; i < seed.length; i++) {
        const c = charToInt(seed[i]);
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        
        if (currentLength >= dictWordLen) {
            const oldChar = BigInt(word[currentLength - dictWordLen]);
            const prevHash = hashStack[currentLength - 1];
            hashStack[currentLength] = (prevHash - oldChar * POWER_3_N_MINUS_1) * 3n + BigInt(c);
        } else {
            const prevHash = currentLength === 0 ? 0n : hashStack[currentLength - 1];
            hashStack[currentLength] = prevHash * 3n + BigInt(c);
        }
        currentLength++;
    }

    let maxDepthReached = currentLength;
    let stepCount = 0;
    let lastLogTime = Date.now();

    while (currentLength >= seed.length) {
        if (currentLength >= targetLength) {
            let resultStr = "";
            for (let i = 0; i < currentLength; i++) resultStr += intToChar(word[i]);
            parentPort.postMessage({ type: 'success', word: resultStr });
            return;
        }

        const choiceIdx = choiceStack[currentLength];
        if (choiceIdx === 3) {
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
        
        if (currentLength >= dictWordLen) {
            const oldChar = BigInt(word[currentLength - dictWordLen]);
            const prevHash = hashStack[currentLength - 1];
            hashStack[currentLength] = (prevHash - oldChar * POWER_3_N_MINUS_1) * 3n + BigInt(c);
        } else {
            const prevHash = currentLength === 0 ? 0n : hashStack[currentLength - 1];
            hashStack[currentLength] = prevHash * 3n + BigInt(c);
        }
        
        currentLength++;
        stepCount++;
        
        let isValid = true;
        
        // 1. Dictionary Filter
        if (currentLength >= dictWordLen) {
            if (!validFactors.has(hashStack[currentLength - 1])) {
                isValid = false;
            }
        }
        
        // 2. Macro-filter
        if (isValid && currentLength > dictWordLen) {
            const len = currentLength;
            for (let blockSize = DYNAMIC_MIN_BLOCK; blockSize <= (len >> 1); ++blockSize) {
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
    const seed = args[0] || "bbcccacbcccaaabaaacaaabbbaaacccabcbbbabb";
    const targetLength = parseInt(args[1] || "2000", 10);
    const dictionaryPath = "dictionary.txt";
    const outputPath = `record_word_${targetLength}.txt`;

    console.log(`--- Industrial Backtracker v4 ---`);
    console.log(`Target: ${targetLength} chars`);
    console.log(`Seed:   ${seed}`);
    
    const orders = [
        [0, 1, 2], [0, 2, 1],
        [1, 0, 2], [1, 2, 0],
        [2, 0, 1], [2, 1, 0]
    ];
    
    let activeWorkers = orders.length;
    let globalMaxDepth = seed.length;
    const startSolve = Date.now();
    let winnerFound = false;

    for (let i = 0; i < orders.length; i++) {
        const worker = new Worker(__filename, {
            workerData: { seed, targetLength, dictionaryPath, searchOrder: orders[i] }
        });

        worker.on('message', (msg) => {
            if (winnerFound) return;
            
            if (msg.type === 'progress') {
                if (msg.depth > globalMaxDepth) {
                    globalMaxDepth = msg.depth;
                    process.stdout.write(`\r[Worker ${i}] Depth: ${globalMaxDepth} ... `);
                    // AppendFileSync is synchronous and safe.
                    fs.appendFileSync("progressive_log.txt", `Length ${globalMaxDepth}:\n${msg.word}\n\n`);
                }
            } else if (msg.type === 'success') {
                winnerFound = true;
                console.log(`\n\n>>> RECORD SHATTERED BY WORKER ${i} <<<`);
                console.log(`Time Taken: ${(Date.now() - startSolve) / 1000} seconds.`);
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

        worker.on('error', (err) => {
            console.error(`Worker error: ${err}`);
        });
    }
}
