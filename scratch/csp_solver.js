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
    const f6 = getFactors(w, B);
    
    w = 'a';
    for (let i = 0; i < 8; i++) {
        let n = '';
        for (let c of w) n += H6[c];
        w = n;
    }
    const f8 = getFactors(w, B);
    
    if (f6.length !== f8.length) {
        throw new Error(`Instability in factor extraction: H6^6 has ${f6.length} but H6^8 has ${f8.length}`);
    }
    return f8;
}

function solveCSP(L, maxK) {
    const B = getB(L);
    const domain = generateDomain(L, maxK);
    
    let allFactors = new Set();
    for (let b = 2; b <= B; b++) {
        let fb = getStableFactors(b);
        for (let f of fb) allFactors.add(f);
    }
    const factors = Array.from(allFactors).sort((x, y) => x.length - y.length);
    
    // Ordered to maximize early checks:
    // H6 has factors like ac, ce, eb, bd, df, fa
    // Let's use an order that adds connected variables: a, c, e, b, d, f
    const vars = ['a', 'c', 'e', 'b', 'd', 'f'];
    let g = {};
    let count = 0;
    
    function canAssign(v, word) {
        g[v] = word;
        for (let f of factors) {
            // Only check factors that actually contain the newly assigned variable `v`
            if (!f.includes(v)) continue;
            
            let fullyAssigned = true;
            for (let char of f) {
                if (!g[char]) { fullyAssigned = false; break; }
            }
            if (fullyAssigned) {
                let mapped = '';
                for (let char of f) {
                    mapped += g[char];
                }
                if (hasAbelianSquare(mapped, 2, maxK)) {
                    delete g[v];
                    return false;
                }
            }
        }
        delete g[v];
        return true;
    }

    function backtrack(varIndex) {
        if (varIndex === vars.length) {
            count++;
            return;
        }
        let v = vars[varIndex];
        for (let val of domain) {
            if (canAssign(v, val)) {
                g[v] = val;
                backtrack(varIndex + 1);
                delete g[v];
            }
        }
    }
    
    backtrack(0);
    return count;
}

for (let L of [3, 4, 5]) {
    const c = solveCSP(L, 5);
    // Since there are 6 permutations of the alphabet {a,b,c}
    console.log(`L=${L} valid g's: ${c}, canonical classes: ${c / 6}`);
}
