// Faithful copy of scratch/csp_solver.js's solveCSP, exported (no side-effect
// loop), used only to check what the ALREADY-VALIDATED (L=3,4,5 match row 49
// exactly) algorithm actually gives at L=6 - since neither original scratch
// file (csp_solver.js loops only over [3,4,5]; csp_solver_fast.js exits after
// the first solution) can produce the reported 1,200,636 count.
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
            if (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]) return true;
        }
    }
    return false;
}
function generateDomain(L, maxK) {
    let domain = [];
    let path = [];
    function dfs() {
        if (path.length === L) { domain.push(path.join('')); return; }
        for (let c of ['a', 'b', 'c']) {
            path.push(c);
            if (!hasAbelianSquare(path.join(''), 2, maxK)) dfs();
            path.pop();
        }
    }
    dfs();
    return domain;
}
function getB(L) { return 2 + Math.floor(8 / L); }
function getFactors(word, length) {
    let factors = new Set();
    for (let i = 0; i <= word.length - length; i++) factors.add(word.slice(i, i + length));
    return Array.from(factors).sort();
}
function getStableFactors(B) {
    let w = 'a';
    for (let i = 0; i < 6; i++) { let n = ''; for (let c of w) n += H6[c]; w = n; }
    const f6 = getFactors(w, B);
    w = 'a';
    for (let i = 0; i < 8; i++) { let n = ''; for (let c of w) n += H6[c]; w = n; }
    const f8 = getFactors(w, B);
    if (f6.length !== f8.length) throw new Error(`Instability: H6^6 has ${f6.length} but H6^8 has ${f8.length}`);
    return f8;
}
function solveCSP(L, maxK, { collectSurvivors = false } = {}) {
    const B = getB(L);
    const domain = generateDomain(L, maxK);
    let allFactors = new Set();
    for (let b = 2; b <= B; b++) { let fb = getStableFactors(b); for (let f of fb) allFactors.add(f); }
    const factors = Array.from(allFactors).sort((x, y) => x.length - y.length);
    const vars = ['a', 'c', 'e', 'b', 'd', 'f'];
    let g = {};
    let count = 0;
    const survivors = [];
    function canAssign(v, word) {
        g[v] = word;
        for (let f of factors) {
            if (!f.includes(v)) continue;
            let fullyAssigned = true;
            for (let char of f) { if (!g[char]) { fullyAssigned = false; break; } }
            if (fullyAssigned) {
                let mapped = ''; for (let char of f) mapped += g[char];
                if (hasAbelianSquare(mapped, 2, maxK)) { delete g[v]; return false; }
            }
        }
        delete g[v];
        return true;
    }
    function backtrack(varIndex) {
        if (varIndex === vars.length) {
            count++;
            if (collectSurvivors) survivors.push({ a: g.a, b: g.b, c: g.c, d: g.d, e: g.e, f: g.f });
            return;
        }
        let v = vars[varIndex];
        for (let val of domain) {
            if (canAssign(v, val)) { g[v] = val; backtrack(varIndex + 1); delete g[v]; }
        }
    }
    backtrack(0);
    return { count, B, domainSize: domain.length, factorsUsed: factors.length, survivors };
}
module.exports = { solveCSP, getB, generateDomain, getStableFactors };
