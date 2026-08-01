const { H6 } = require('../morphisms.js');

function hasAbelianSquare(word, minK = 2, maxK = 5) {
    for (let k = minK; k <= maxK; k++) {
        if (2 * k > word.length) continue;
        for (let i = 0; i <= word.length - 2 * k; i++) {
            let p1 = [0, 0, 0];
            let p2 = [0, 0, 0];
            for (let j = 0; j < k; j++) {
                p1[word.charCodeAt(i + j) - 97]++;
                p2[word.charCodeAt(i + k + j) - 97]++;
            }
            if (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]) {
                return true;
            }
        }
    }
    return false;
}

function generateDomain(L, maxK) {
    let domain = [];
    let path = [];
    function dfs() {
        if (path.length === L) {
            domain.push(path.join(''));
            return;
        }
        for (let c of ['a', 'b', 'c']) {
            path.push(c);
            let w = path.join('');
            if (!hasAbelianSquare(w, 2, maxK)) {
                dfs();
            }
            path.pop();
        }
    }
    dfs();
    return domain;
}

function getB(L) {
    return 2 + Math.floor(8 / L);
}

function getFactors(word, length) {
    let factors = new Set();
    for (let i = 0; i <= word.length - length; i++) {
        factors.add(word.slice(i, i + length));
    }
    return Array.from(factors).sort();
}

function getStableFactors(B) {
    let w = 'a';
    for (let i = 0; i < 6; i++) {
        let n = '';
        for (let c of w) n += H6[c];
        w = n;
    }
    return getFactors(w, B);
}

function solveCSPFast(L, maxK) {
    const B = getB(L);
    const domain = generateDomain(L, maxK);
    const D = domain.length;
    
    // For L=5, D=243. D^3 is 14 million, easily precomputable.
    // For L>=6, B=3, D=360, D^3 is 46 million.
    // For L>=9, B=2, D=5850, D^2 is 34 million.
    
    let allFactors = new Set();
    for (let b = 2; b <= B; b++) {
        let fb = getStableFactors(b);
        for (let f of fb) allFactors.add(f);
    }
    const factors = Array.from(allFactors).sort((x, y) => x.length - y.length);
    
    // Create constraint maps: constraints[factor] = boolean array or set
    const validMap = {};
    for (let f of factors) {
        if (f.length === 2) {
            let valid = new Uint8Array(D * D);
            for(let i=0; i<D; i++) {
                for(let j=0; j<D; j++) {
                    if (!hasAbelianSquare(domain[i] + domain[j], 2, maxK)) {
                        valid[i * D + j] = 1;
                    }
                }
            }
            validMap[f] = valid;
        } else if (f.length === 3) {
            // we can just dynamically check length 3 if we want, or precompute
            // actually dynamic check is fast if it only happens when length 2 passed
        }
    }
    
    const vars = ['a', 'c', 'e', 'b', 'd', 'f'];
    const varIdx = { a:0, c:1, e:2, b:3, d:4, f:5 };
    
    let g = new Int32Array(6);
    g.fill(-1);
    let count = 0;
    
    function canAssign(vIdx, dIdx) {
        let v = vars[vIdx];
        g[vIdx] = dIdx;
        
        for (let f of factors) {
            if (!f.includes(v)) continue;
            let fullyAssigned = true;
            for (let char of f) {
                if (g[varIdx[char]] === -1) { fullyAssigned = false; break; }
            }
            if (fullyAssigned) {
                if (f.length === 2) {
                    let i = g[varIdx[f[0]]];
                    let j = g[varIdx[f[1]]];
                    if (validMap[f][i * D + j] === 0) {
                        g[vIdx] = -1;
                        return false;
                    }
                } else {
                    let mapped = '';
                    for (let char of f) {
                        mapped += domain[g[varIdx[char]]];
                    }
                    if (hasAbelianSquare(mapped, 2, maxK)) {
                        g[vIdx] = -1;
                        return false;
                    }
                }
            }
        }
        g[vIdx] = -1;
        return true;
    }

    let firstMapping = null;
    function backtrack(idx) {
        if (firstMapping) return; // EARLY EXIT
        if (idx === vars.length) {
            count++;
            if (!firstMapping) {
                firstMapping = {};
                for (let i = 0; i < 6; i++) {
                    firstMapping[vars[i]] = domain[g[i]];
                }
            }
            return;
        }
        for (let i = 0; i < D; i++) {
            if (canAssign(idx, i)) {
                g[idx] = i;
                backtrack(idx + 1);
                g[idx] = -1;
            }
        }
    }
    
    backtrack(0);
    return { count, firstMapping };
}

console.log(`Starting L=6 extraction...`);
const { count, firstMapping } = solveCSPFast(6, 5);
console.log(`First valid mapping:`, firstMapping);
