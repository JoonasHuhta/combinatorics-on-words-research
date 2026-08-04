const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ---------------------------------------------------------
// WORKER THREAD LOGIC
// ---------------------------------------------------------
if (!isMainThread) {
    const { seed, targetLength, searchOrder } = workerData;

    const MAX_LEN = 30000; 
    
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

    // Initialize seed
    let currentLength = 0;
    for (let i = 0; i < seed.length; i++) {
        const c = charToInt(seed[i]);
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
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
        
        currentLength++;
        stepCount++;
        
        let isValid = true;
        const len = currentLength;

        // FORBID4 Check (length 4 exact matches)
        // FORBID4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca']
        // mapped: 1002, 2001, 0112, 2110, 0221, 1220
        if (len >= 4) {
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
    const seed = args[0] || "a";
    const targetLength = parseInt(args[1] || "3000", 10);
    const outputPath = `record_word_${targetLength}.txt`;

    console.log(`--- Industrial Backtracker v7 (aa2fr Mode) ---`);
    console.log(`Target: ${targetLength} chars`);
    console.log(`Seed:   ${seed}`);
    console.log(`Rules:  Ternary {a,b,c}, Abelian Squares K >= 2 forbidden, FORBID4 banned.`);
    
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
            workerData: { seed, targetLength, searchOrder: orders[i] }
        });

        worker.on('message', (msg) => {
            if (winnerFound) return;
            
            if (msg.type === 'progress') {
                if (msg.depth > globalMaxDepth) {
                    globalMaxDepth = msg.depth;
                    process.stdout.write(`\r[Worker ${i}] Depth: ${globalMaxDepth} ... `);
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
    }
}
