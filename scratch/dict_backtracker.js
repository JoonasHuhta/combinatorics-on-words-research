/**
 * Dictionary-Accelerated Backtracker (aa2fr / Rata 2)
 * 
 * Uses Veikko's 100MB CUDA-pruned dictionary to filter paths in O(1) time
 * using a rolling base-3 BigInt hash and binary search on a SharedArrayBuffer.
 * 
 * Memory usage: ~300 MB for the SharedArrayBuffer, accessible by all worker threads!
 */

const fs = require('fs');
const readline = require('readline');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const DICT_FILE = 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt';
const MAX_LEN = 30000; 

// Precomputed BigInts
const P3_39 = 4052555153018976267n; // 3n ** 39n

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

const perms = [
    [0, 1, 2], [0, 2, 1],
    [1, 0, 2], [1, 2, 0],
    [2, 0, 1], [2, 1, 0]
];

// Binary search in a sorted BigUint64Array
function binarySearch(arr, size, target) {
    let left = 0;
    let right = size - 1;
    while (left <= right) {
        const mid = (left + right) >> 1;
        const val = arr[mid];
        if (val === target) return true;
        if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}

if (isMainThread) {
    const args = process.argv.slice(2);
    const seed = args[0] || "a";
    const targetLength = parseInt(args[1] || "2500", 10);
    
    console.log(`--- Dictionary-Accelerated Backtracker (Rata 2) ---`);
    console.log(`Target: ${targetLength} chars`);
    console.log(`Seed:   ${seed}`);
    
    if (!fs.existsSync(DICT_FILE)) {
        console.error(`FATAL: Dictionary file not found at ${DICT_FILE}`);
        process.exit(1);
    }
    
    if (targetLength > MAX_LEN) {
        console.error(`FATAL: targetLength (${targetLength}) exceeds MAX_LEN (${MAX_LEN}).`);
        process.exit(1);
    }
    
    console.log(`\n[Main] Loading dictionary and generating variants...`);
    const startLoad = Date.now();
    
    // Allocate buffer for up to 3 million lines * 12 variants
    // 36M entries * 8 bytes = 288 MB
    const maxEntries = 36000000;
    const buffer = new SharedArrayBuffer(maxEntries * 8);
    const dictArr = new BigUint64Array(buffer);
    let dictSize = 0;

    const fileStream = fs.createReadStream(DICT_FILE);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    rl.on('line', (line) => {
        line = line.trim();
        if (line.length !== 40) return;
        
        // Convert to ints
        const baseWord = new Uint8Array(40);
        for(let i=0; i<40; i++) baseWord[i] = charToInt(line[i]);

        for (let p = 0; p < perms.length; p++) {
            const perm = perms[p];
            let fwdHash = 0n;
            let revHash = 0n;
            let mult = 1n; // 3^0
            
            // Build fwd Hash
            for(let i=0; i<40; i++) {
                fwdHash = fwdHash * 3n + BigInt(perm[baseWord[i]]);
            }
            
            // Build rev Hash (reverse of fwd)
            for(let i=39; i>=0; i--) {
                revHash = revHash * 3n + BigInt(perm[baseWord[i]]);
            }
            
            dictArr[dictSize++] = fwdHash;
            dictArr[dictSize++] = revHash;
        }
    });

    rl.on('close', () => {
        console.log(`[Main] Generated ${dictSize} total variants in ${(Date.now() - startLoad)/1000}s.`);
        console.log(`[Main] Sorting SharedArrayBuffer (zero-copy)...`);
        
        const sortStart = Date.now();
        // Sort the populated portion of the array
        const activeSubarray = dictArr.subarray(0, dictSize);
        activeSubarray.sort();
        console.log(`[Main] Sorting finished in ${(Date.now() - sortStart)/1000}s.`);

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
        function verifyAa2fr(word) {
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
        
        console.log(`[Main] Spawning ${activeWorkers} workers...\n`);
        
        for (let i = 0; i < orders.length; i++) {
            const worker = new Worker(__filename, {
                workerData: { 
                    seed, 
                    targetLength, 
                    searchOrder: orders[i], 
                    dictBuffer: buffer,
                    dictSize: dictSize
                }
            });

            worker.on('message', (msg) => {
                if (winnerFound) return;
                
                if (msg.type === 'progress') {
                    if (msg.depth > globalMaxDepth) {
                        globalMaxDepth = msg.depth;
                        process.stdout.write(`\r[Worker ${i}] Depth: ${globalMaxDepth} ... `);
                    }
                } else if (msg.type === 'success') {
                    winnerFound = true;
                    console.log(`\n\n>>> RECORD ATTAINED BY WORKER ${i} <<<`);
                    console.log(`Time Taken: ${(Date.now() - startSolve) / 1000} seconds.`);
                    
                    console.log(`Starting independent mathematical verification...`);
                    if (!verifyAa2fr(msg.word)) {
                        console.error("FATAL: INDEPENDENT VERIFICATION FAILED! The generated word is invalid.");
                        process.exit(1);
                    }
                    console.log(`Independent verification PASSED.`);
                    
                    const outPath = `record_word_${targetLength}_dict_heuristic.txt`;
                    fs.writeFileSync(outPath, msg.word);
                    console.log(`Saved to ${outPath}`);
                    process.exit(0);
                } else if (msg.type === 'exhausted') {
                    activeWorkers--;
                    console.log(`\n[Worker ${i}] Exhausted search space (Max depth: ${msg.maxDepth}).`);
                    if (activeWorkers === 0) {
                        console.log(`\nAll workers exhausted. Global max depth: ${globalMaxDepth}`);
                    }
                } else if (msg.type === 'error') {
                    console.error(`\n${msg.msg}`);
                    process.exit(1);
                }
            });
        }
    });

} else {
    // ---------------- WORKER THREAD ----------------
    const { seed, targetLength, searchOrder, dictBuffer, dictSize } = workerData;
    const dictArr = new BigUint64Array(dictBuffer);
    
    const word = new Uint8Array(MAX_LEN);
    const prefixA = new Int32Array(MAX_LEN + 1);
    const prefixB = new Int32Array(MAX_LEN + 1);
    const choiceStack = new Uint8Array(MAX_LEN + 1);
    
    let currentLength = 0;
    
    // Convert seed
    let baseSeed = seed;
    if (fs.existsSync(seed)) {
        baseSeed = fs.readFileSync(seed, 'utf8').trim();
    }
    
    // Initialize state
    let rollingHash = 0n;
    
    for (let i = 0; i < baseSeed.length; i++) {
        const c = charToInt(baseSeed[i]);
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        
        choiceStack[i] = 4; // Locked
        currentLength++;
        
        // Build initial hash if length >= 40
        if (currentLength <= 40) {
            rollingHash = rollingHash * 3n + BigInt(c);
        } else {
            const oldChar = BigInt(word[currentLength - 41]);
            rollingHash = (rollingHash - oldChar * P3_39) * 3n + BigInt(c);
        }
    }
    
    let maxDepthReached = currentLength;
    let lastLogTime = Date.now();
    let minLength = baseSeed.length;
    
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
            const droppedChar = BigInt(word[currentLength - 1]);
            
            currentLength--;
            
            // Revert rolling hash
            if (currentLength >= 40) {
                const incomingChar = BigInt(word[currentLength - 40]);
                rollingHash = (rollingHash - droppedChar) / 3n + incomingChar * P3_39;
            }
            continue;
        }

        choiceStack[currentLength]++;
        const c = searchOrder[choiceIdx];
        
        word[currentLength] = c;
        prefixA[currentLength + 1] = prefixA[currentLength] + (c === 0 ? 1 : 0);
        prefixB[currentLength + 1] = prefixB[currentLength] + (c === 1 ? 1 : 0);
        
        // Update hash
        if (currentLength < 40) {
            rollingHash = rollingHash * 3n + BigInt(c);
        } else {
            const oldChar = BigInt(word[currentLength - 40]);
            rollingHash = (rollingHash - oldChar * P3_39) * 3n + BigInt(c);
        }
        
        currentLength++;
        let isValid = true;

        // DICTIONARY CHECK (O(1) with Binary Search on BigUint64Array)
        if (currentLength >= 40) {
            if (!binarySearch(dictArr, dictSize, rollingHash)) {
                isValid = false;
            }
        }

        // FULL AA2F CHECK
        if (isValid) {
            const len = currentLength;
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
                    parentPort.postMessage({ type: 'progress', depth: maxDepthReached });
                    lastLogTime = Date.now();
                }
            }
        } else {
            // Need to revert hash since we backtrack immediately
            const droppedChar = BigInt(c);
            currentLength--;
            if (currentLength >= 40) {
                const incomingChar = BigInt(word[currentLength - 40]);
                rollingHash = (rollingHash - droppedChar) / 3n + incomingChar * P3_39;
            } else {
                rollingHash = (rollingHash - droppedChar) / 3n;
            }
        }
    }
    
    parentPort.postMessage({ type: 'exhausted', maxDepth: maxDepthReached });
}
