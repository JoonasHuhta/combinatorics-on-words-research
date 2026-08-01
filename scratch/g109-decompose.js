'use strict';
/*
 * g109-decompose.js -- checks the project's G109_A against the STRUCTURAL FORMULA
 * given in the primary source, rather than against another copy of the string.
 *
 * Source: V. Keranen, "A powerful abelian square-free substitution over 4 letters",
 * Theoretical Computer Science 410 (2009) 3893-3900, Section 4, equation (1),
 * read from the author's own PDF on 2026-08-01.
 *
 * The paper does NOT publish a single morphism named "g109". It publishes a
 * SUBSTITUTION sigma_109 with twelve image words A_1..A_12 for the letter a, each of
 * the form
 *
 *     A_i = p16 w4 u27 w3 s59
 *
 * with p16, u27, s59 FIXED and (w4, w3) ranging over
 *     {abcd, abdc, adbc, dabc} x {acd, adc, cad}
 * "taken in the natural lexicographical order".
 *
 * So the question this script answers is not "is our string intact" (that is what the
 * djb2 checksum already does) but "is our string one of the twelve the paper defines,
 * and if so WHICH ONE". Those are different questions and only the second one can
 * raise the row above Level 1.
 */

const { G109 } = require('../src/morphisms.js');

// --- transcribed character-by-character from equation (1) of the paper ---
const P16 = 'abcacdcbcdcadcdb';
const U27 = 'badacdadbdcdbdabdbcbabcbdcb';
const S59 = 'bdcdadcdbcbabcbdcbcacdcacbadabcbdcbcadbabcbabdbcdbdadbdcbca';
const W4_SET = ['abcd', 'abdc', 'adbc', 'dabc'];
const W3_SET = ['acd', 'adc', 'cad'];

function fail(msg) { console.log('  FAIL: ' + msg); process.exitCode = 1; }

console.log('Fixed factors transcribed from TCS 410 (2009) eq. (1):');
console.log(`  p16 = ${P16}   (len ${P16.length}, paper says 16)`);
console.log(`  u27 = ${U27}   (len ${U27.length}, paper says 27)`);
console.log(`  s59 = ${S59}   (len ${S59.length}, paper says 59)`);
if (P16.length !== 16) fail('p16 length');
if (U27.length !== 27) fail('u27 length');
if (S59.length !== 59) fail('s59 length');

// Build all twelve A_i in the paper's stated order.
const A = [];
for (const w4 of W4_SET) for (const w3 of W3_SET) A.push({ w4, w3, word: P16 + w4 + U27 + w3 + S59 });
console.log(`\nBuilt ${A.length} image words A_1..A_12, each of length ${A[0].word.length} (paper: modulus 109).`);
if (A[0].word.length !== 109) fail('assembled length is not 109');

const ours = G109.a;
console.log(`\nProject's G109(a): length ${ours.length}`);

const hit = A.findIndex(x => x.word === ours);
if (hit === -1) {
  fail('project G109(a) matches NONE of the twelve A_i defined by the paper');
  // localise the first difference against the closest candidate
  let best = 0, bestScore = -1;
  A.forEach((x, i) => {
    let s = 0;
    while (s < 109 && x.word[s] === ours[s]) s++;
    if (s > bestScore) { bestScore = s; best = i; }
  });
  console.log(`  closest is A_${best + 1} (w4=${A[best].w4}, w3=${A[best].w3}), first difference at index ${bestScore}`);
  console.log(`  paper  : ...${A[best].word.slice(Math.max(0, bestScore - 10), bestScore + 10)}...`);
  console.log(`  project: ...${ours.slice(Math.max(0, bestScore - 10), bestScore + 10)}...`);
} else {
  console.log(`  EXACT MATCH with A_${hit + 1}  (w4 = "${A[hit].w4}", w3 = "${A[hit].w3}")`);
  console.log(`  decomposition: p16 | w4 | u27 | w3 | s59`);
  console.log(`                 ${ours.slice(0,16)} | ${ours.slice(16,20)} | ${ours.slice(20,47)} | ${ours.slice(47,50)} | ${ours.slice(50)}`);
  console.log(`\n  => the project's "g109" is the paper's g109,${hit + 1}: ONE of twelve endomorphisms,`);
  console.log(`     not "the" g109. The paper's headline object is the SUBSTITUTION sigma_109.`);
}

// The paper states the Parikh matrix of sigma_109's image words explicitly.
const PAPER_PSI = [[21,31,29,28],[28,21,31,29],[29,28,21,31],[31,29,28,21]];
const L = ['a','b','c','d'];
console.log('\nParikh check against the paper\'s stated matrix (rows psi(A),psi(B),psi(C),psi(D)):');
let parikhOk = true;
for (let r = 0; r < 4; r++) {
  const w = G109[L[r]];
  const v = L.map(ch => [...w].filter(c => c === ch).length);
  const want = PAPER_PSI[r];
  const same = v.every((x, i) => x === want[i]);
  if (!same) parikhOk = false;
  console.log(`  psi(g109(${L[r]})) = [${v.join(',')}]   paper: [${want.join(',')}]   ${same ? 'match' : '*** MISMATCH ***'}`);
}
if (!parikhOk) fail('Parikh vectors disagree with the paper');

// All twelve share one Parikh vector -- that is what "commutatively functional" means.
const psis = new Set(A.map(x => L.map(ch => [...x.word].filter(c => c === ch).length).join(',')));
console.log(`\nDistinct Parikh vectors among A_1..A_12: ${psis.size} -> ${psis.size === 1 ? 'all twelve are commutatively equivalent, as "commutatively functional" requires' : '*** more than one, contradicts the paper ***'}`);
console.log(`  the shared vector is [${[...psis][0]}]`);

// And the cyclic-permutation property the project's code assumes.
const phi = { a:'b', b:'c', c:'d', d:'a' };
const cyc = s => [...s].map(c => phi[c]).join('');
console.log('\nCyclic property g109(phi(x)) = phi(g109(x)) (paper, Sec. 4):');
for (const x of L) {
  const ok = G109[phi[x]] === cyc(G109[x]);
  console.log(`  x=${x}: ${ok ? 'holds' : '*** FAILS ***'}`);
  if (!ok) fail(`cyclic property fails at ${x}`);
}
