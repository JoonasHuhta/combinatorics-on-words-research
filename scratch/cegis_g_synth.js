const { H6 } = require('../morphisms.js');

let h6_word = 'a';
for(let i=0; i<4; i++) {
    let next = '';
    for(let j=0; j<h6_word.length; j++) next += H6[h6_word[j]];
    h6_word = next;
}
// h6_word length = 6^4 = 1296.

const L = 10;
const MAX_K = 5; // avoid squares up to K=5 for the initial synthesis
const TARGET_SOLUTIONS = 10;
const MAX_NODES = 500000000;

// Find the first occurrence of each letter to define the variable order
const first_occ = {};
for(let i=0; i<h6_word.length; i++) {
    if(first_occ[h6_word[i]] === undefined) {
        first_occ[h6_word[i]] = i;
    }
}
const letters = Object.keys(first_occ).sort((a,b) => first_occ[a] - first_occ[b]);
console.log("Letter discovery order in h6:", letters);

const var_order = [];
for(const l of letters) {
    for(let i=0; i<L; i++) {
        var_order.push({ letter: l, pos: i });
    }
}

const g_map = {};
for(const l of letters) {
    g_map[l] = new Int8Array(L).fill(-1);
}

const image = new Int8Array(h6_word.length * L);
const pref = Array.from({length: image.length + 1}, () => new Int32Array(3));
let image_len = 0;

let nodes = 0;
let solutions = [];
let max_depth_reached = 0;

function search(var_idx, max_val_used) {
    if (solutions.length >= TARGET_SOLUTIONS) return;
    if (nodes > MAX_NODES) return;
    
    if (var_idx > max_depth_reached) {
        max_depth_reached = var_idx;
        if (max_depth_reached % 5 === 0) {
            console.log(`[+] Max depth reached: ${max_depth_reached} / 60 (image length: ${image_len})`);
        }
    }
    
    if (var_idx === var_order.length) {
        // Found a solution!
        const sol = {};
        for(const l of letters) {
            sol[l] = Array.from(g_map[l]).join('');
        }
        solutions.push(sol);
        console.log("\n[!!!] FOUND SOLUTION:");
        console.log(sol);
        return;
    }
    
    nodes++;
    if (nodes % 50000000 === 0) {
        console.log(`... ${nodes / 1000000}M nodes searched, current max depth: ${max_depth_reached}`);
    }

    const { letter, pos } = var_order[var_idx];
    const max_val = Math.min(2, max_val_used + 1);
    
    for (let val = 0; val <= max_val; val++) {
        g_map[letter][pos] = val;
        
        let old_len = image_len;
        let ok = true;
        
        while (image_len < image.length) {
            const h_idx = Math.floor(image_len / L);
            const g_pos = image_len % L;
            const h_char = h6_word[h_idx];
            const char_val = g_map[h_char][g_pos];
            
            if (char_val === -1) break;
            
            image[image_len] = char_val;
            pref[image_len+1][0] = pref[image_len][0];
            pref[image_len+1][1] = pref[image_len][1];
            pref[image_len+1][2] = pref[image_len][2];
            pref[image_len+1][char_val]++;
            
            const end = image_len;
            for (let K = 2; K <= MAX_K; K++) {
                if (end + 1 >= 2 * K) {
                    const mid = end + 1 - K;
                    const start = end + 1 - 2*K;
                    if (pref[end+1][0] - pref[mid][0] === pref[mid][0] - pref[start][0] &&
                        pref[end+1][1] - pref[mid][1] === pref[mid][1] - pref[start][1] &&
                        pref[end+1][2] - pref[mid][2] === pref[mid][2] - pref[start][2]) {
                        ok = false;
                        break;
                    }
                }
            }
            if (!ok) break;
            image_len++;
        }
        
        if (ok) {
            search(var_idx + 1, Math.max(max_val_used, val));
        }
        
        image_len = old_len;
    }
    g_map[letter][pos] = -1;
}

console.log(`Starting search (MAX_K=${MAX_K})...`);
const startTime = Date.now();
search(0, -1);
console.log(`\nSearch finished in ${(Date.now() - startTime)/1000}s`);
console.log(`Total nodes: ${nodes}`);
if (solutions.length === 0) {
    console.log("NO SOLUTIONS FOUND. Try lowering MAX_K or it's an empty stratum.");
}
