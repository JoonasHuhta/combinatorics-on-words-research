'use strict';

const { BIGRAMS, toMask } = require('../scripts/b16-bigram-lattice.js');

function codeToWord(code, len) {
  const w = new Array(len);
  for (let i = len - 1; i >= 0; i--) { w[i] = code % 3; code = Math.floor(code / 3); }
  return w;
}

function hasSAbelianSquare(w, klo, khi, mask) {
  const n = w.length;
  for (let K = klo; K <= khi; K++) {
    for (let i = 0; i + 2 * K <= n; i++) {
      let da = 0, db = 0, dc = 0;
      for (let j = i; j < i + K; j++) { const c = w[j]; if (c === 0) da++; else if (c === 1) db++; else dc++; }
      for (let j = i + K; j < i + 2 * K; j++) { const c = w[j]; if (c === 0) da--; else if (c === 1) db--; else dc--; }
      
      if (da !== 0 || db !== 0 || dc !== 0) continue;
      
      let bigramMatch = true;
      for (let B = 0; B < 9; B++) {
        if (!(mask & (1 << B))) continue;
        
        let count1 = 0;
        for(let j = i; j < i + K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count1++;
        }
        
        let count2 = 0;
        for(let j = i + K; j < i + 2 * K - 1; j++) {
            if (w[j] * 3 + w[j+1] === B) count2++;
        }
        
        if (count1 !== count2) {
            bigramMatch = false;
            break;
        }
      }
      
      if (bigramMatch) return true;
    }
  }
  return false;
}

function buildContainer(kmax, mask) {
  const m = 2 * kmax - 1;
  const raw = Math.pow(3, m);
  const powPrev = Math.pow(3, m - 1);

  const stateIdx = new Int32Array(raw).fill(-1);
  const states = [];
  for (let code = 0; code < raw; code++) {
    if (!hasSAbelianSquare(codeToWord(code, m), 2, kmax - 1, mask)) {
      stateIdx[code] = states.length;
      states.push(code);
    }
  }
  const n = states.length;

  const adj = new Array(n);
  for (let i = 0; i < n; i++) {
    const code = states[i];
    const suffix = code % powPrev;
    const out = [];
    for (let s = 0; s < 3; s++) {
      const ncode = suffix * 3 + s;
      if (stateIdx[ncode] === -1) continue;
      const w2k = codeToWord(code, m); w2k.push(s);
      
      if (!hasSAbelianSquare(w2k, kmax, kmax, mask)) {
          out.push(stateIdx[ncode]);
      }
    }
    adj[i] = out;
  }

  const alive = new Uint8Array(n).fill(1);
  let changed = true;
  while (changed) {
    changed = false;
    const indeg = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      if (!alive[i]) continue;
      let outd = 0;
      for (const j of adj[i]) if (alive[j]) { outd++; indeg[j]++; }
      if (outd === 0) { alive[i] = 0; changed = true; }
    }
    for (let i = 0; i < n; i++) {
      if (alive[i] && indeg[i] === 0) { alive[i] = 0; changed = true; }
    }
  }
  
  const aliveNodes = [];
  for (let i = 0; i < n; i++) {
      if (alive[i]) {
          aliveNodes.push(i);
      }
  }
  
  return { raw, valid: n, essential: aliveNodes.length };
}

function pruneCheck(mask, startK, endK) {
    console.log('--- Pruning Check ---');
    for (let kmax = startK; kmax <= endK; kmax++) {
        console.log('Building container for kmax = ' + kmax);
        console.time('build');
        const c = buildContainer(kmax, mask);
        console.timeEnd('build');
        console.log('Raw: ' + c.raw + ', Valid: ' + c.valid + ', Essential: ' + c.essential);
        if (c.essential === 0) {
            console.log('*** ESSENTIAL GRAPH IS EMPTY AT KMAX = ' + kmax + ' ***');
            console.log('No infinite word exists!');
            break;
        }
    }
}

const mask6 = toMask(['ab', 'ac', 'ba', 'bc', 'ca', 'cb']);
pruneCheck(mask6, 8, 9);
