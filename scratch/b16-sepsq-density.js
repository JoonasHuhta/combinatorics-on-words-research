'use strict';
// Density of separating squares inside the Theorem 65 word h2(g85^2(a)).
const { g85Power, applyH2 } = require('../scripts/theorem65-positive-control.js');
const OFFDIAG = [1,2,3,5,6,7], DIAG = [0,4,8];
const img = applyH2(g85Power(2));
const n = img.length;
const w = new Int8Array(n);
for (let i=0;i<n;i++) w[i]=img.charCodeAt(i)-48;
const pL=[new Int32Array(n+1),new Int32Array(n+1),new Int32Array(n+1)];
const pB=Array.from({length:9},()=>new Int32Array(n+1));
for(let i=0;i<n;i++){for(let L=0;L<3;L++)pL[L][i+1]=pL[L][i];for(let B=0;B<9;B++)pB[B][i+1]=pB[B][i];pL[w[i]][i+1]++;if(i>0)pB[w[i-1]*3+w[i]][i+1]++;}
let total=0, all9=0, byK=new Map(), starts=new Set();
const maxK=Math.floor(n/2);
for(let K=2;K<=maxK;K++){
  for(let i=0;i+2*K<=n;i++){
    const s=i,m=i+K,e=i+2*K;
    if(pL[0][m]-pL[0][s]!==pL[0][e]-pL[0][m])continue;
    if(pL[1][m]-pL[1][s]!==pL[1][e]-pL[1][m])continue;
    if(pL[2][m]-pL[2][s]!==pL[2][e]-pL[2][m])continue;
    let ok=true;for(const B of OFFDIAG){if(pB[B][m]-pB[B][s+1]!==pB[B][e]-pB[B][m+1]){ok=false;break;}}
    if(!ok)continue;
    total++; starts.add(i); byK.set(K,(byK.get(K)||0)+1);
    let a9=true;for(const B of DIAG){if(pB[B][m]-pB[B][s+1]!==pB[B][e]-pB[B][m+1]){a9=false;break;}}
    if(a9)all9++;
  }
}
console.log(`word length ${n}`);
console.log(`Golden-Six squares (occurrences): ${total}`);
console.log(`  of which also All-9 squares (would contradict Theorem 65): ${all9}`);
console.log(`  hence separating squares: ${total-all9}`);
console.log(`distinct start positions carrying at least one: ${starts.size} (${(100*starts.size/n).toFixed(2)}% of positions)`);
const ks=[...byK.entries()].sort((a,b)=>a[0]-b[0]);
console.log(`K range: ${ks[0][0]} .. ${ks[ks.length-1][0]}`);
console.log('occurrences by K (first 20): ' + ks.slice(0,20).map(([k,c])=>`K=${k}:${c}`).join(' '));
// mean gap between consecutive start positions
const sorted=[...starts].sort((a,b)=>a-b);
let maxgap=0;for(let i=1;i<sorted.length;i++)maxgap=Math.max(maxgap,sorted[i]-sorted[i-1]);
console.log(`largest gap between consecutive carrying positions: ${maxgap}; first: ${sorted[0]}, last: ${sorted[sorted.length-1]}`);
