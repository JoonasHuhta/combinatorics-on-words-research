const fs = require('fs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// ---------------------------------------------------------
// WORKER THREAD LOGIC
// ---------------------------------------------------------
if (!isMainThread) {
    const { seed, targetLength, searchOrder } = workerData;

    const MAX_LEN = 20000; 
    
    const word = new Uint8Array(MAX_LEN);
    const prefixA = new Int32Array(MAX_LEN + 1);
    const prefixB = new Int32Array(MAX_LEN + 1);
    const prefixC = new Int32Array(MAX_LEN + 1);
    const choiceStack = new Uint8Array(MAX_LEN + 1);
    
    function charToInt(c) {
        if (c === 'a') return 0;
        if (c === 'b') return 1;
        if (c === 'c') return 2;
        return 3;
    }

    function intToChar(i) {
        if (i === 0) return 'a';
        if (i === 1) return 'b';
        if (i === 2) return 'c';
        return 'd';
    }

    // Initialize seed
    let currentLength = 0;
    for (let i = 0; i < seed.length; i++) {
        const c = charToInt(seed[i]);
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        prefixC[currentLength + 1] = prefixC[currentLength] + (c === 2 ? 1 : 0);
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
        if (choiceIdx === 4) {
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
        prefixC[currentLength + 1] = prefixC[currentLength] + (c === 2 ? 1 : 0);
        
        currentLength++;
        stepCount++;
        
        let isValid = true;
        
        // Full O(1) Abelian Square Check for ALL block sizes
        const len = currentLength;
        for (let blockSize = 1; blockSize <= (len >> 1); ++blockSize) {
            const rA = prefixA[len] - prefixA[len - blockSize];
            const rB = prefixB[len] - prefixB[len - blockSize];
            const rC = prefixC[len] - prefixC[len - blockSize];
            const lA = prefixA[len - blockSize] - prefixA[len - 2 * blockSize];
            const lB = prefixB[len - blockSize] - prefixB[len - 2 * blockSize];
            const lC = prefixC[len - blockSize] - prefixC[len - 2 * blockSize];
            
            if (rA === lA && rB === lB && rC === lC) {
                isValid = false;
                break;
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
    // Use a clean seed over 4 letters
    const seed = args[0] || "abacaba";
    const targetLength = parseInt(args[1] || "2000", 10);
    const outputPath = `record_word_${targetLength}.txt`;

    console.log(`--- Industrial Backtracker v6 (4-letter O(1)) ---`);
    console.log(`Target: ${targetLength} chars`);
    console.log(`Seed:   ${seed}`);
    
    // Select 6 random permutations out of the 24 possible to keep worker count sane
    const orders = [
        [0, 1, 2, 3],
        [1, 2, 3, 0],
        [2, 3, 0, 1],
        [3, 0, 1, 2],
        [0, 3, 2, 1],
        [3, 2, 1, 0]
    ];
    
    let activeWorkers = orders.length;
    let globalMaxDepth = seed.length;
    const startSolve = Date.now();
    let winnerFound = false;

    // Check if initial seed is valid
    const seedCheckWord = new Uint8Array(seed.length);
    const seedPrefixA = new Int32Array(seed.length + 1);
    const seedPrefixB = new Int32Array(seed.length + 1);
    const seedPrefixC = new Int32Array(seed.length + 1);
    for (let i = 0; i < seed.length; i++) {
        let c = 0;
        if (seed[i] === 'b') c = 1;
        if (seed[i] === 'c') c = 2;
        if (seed[i] === 'd') c = 3;
        seedCheckWord[i] = c;
        seedPrefixA[i + 1] = seedPrefixA[i] + (c === 0 ? 1 : 0);
        seedPrefixB[i + 1] = seedPrefixB[i] + (c === 1 ? 1 : 0);
        seedPrefixC[i + 1] = seedPrefixC[i] + (c === 2 ? 1 : 0);
        
        for (let blockSize = 1; blockSize <= ((i + 1) >> 1); ++blockSize) {
            const rA = seedPrefixA[i + 1] - seedPrefixA[i + 1 - blockSize];
            const rB = seedPrefixB[i + 1] - seedPrefixB[i + 1 - blockSize];
            const rC = seedPrefixC[i + 1] - seedPrefixC[i + 1 - blockSize];
            const lA = seedPrefixA[i + 1 - blockSize] - seedPrefixA[i + 1 - 2 * blockSize];
            const lB = seedPrefixB[i + 1 - blockSize] - seedPrefixB[i + 1 - 2 * blockSize];
            const lC = seedPrefixC[i + 1 - blockSize] - seedPrefixC[i + 1 - 2 * blockSize];
            
            if (rA === lA && rB === lB && rC === lC) {
                console.error(`ERROR: The provided seed '${seed}' contains an abelian square of K=${blockSize} at position ${i+1}.`);
                process.exit(1);
            }
        }
    }

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

        worker.on('error', (err) => {
            console.error(`Worker error: ${err}`);
        });
    }
}
