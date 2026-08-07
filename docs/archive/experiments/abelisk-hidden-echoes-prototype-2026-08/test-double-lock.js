import { findAllViolations } from './src/engine.js';

const rule = { alphabetSize: 3, minHalfLength: 1 };
const L = ['a', 'b', 'c'];
const baseWord = [2, 1, 2, 0, 2, 1, null]; // c b c a c b _

console.log("Deterministic Verification for Double Lock: c b c a c b _");
console.log("Rule: Classic Abelisk (minHalfLength=1)\n");

for (let sym = 0; sym < 3; sym++) {
  const w = [...baseWord];
  w[6] = sym;
  const violations = findAllViolations(w, rule);
  console.log(`Candidate ${L[sym]} -> ${w.map(x => L[x]).join('')}`);
  if (violations.length === 0) {
    console.log('  Violations: 0 (No echoes created)');
  } else {
    violations.forEach(v => {
      const left = w.slice(v.start, v.middle).map(x => L[x]).join('');
      const right = w.slice(v.middle, v.end).map(x => L[x]).join('');
      console.log(`  Violation: ${left} | ${right} at [${v.start}, ${v.end}], halfLen: ${v.halfLength}`);
    });
  }
  console.log();
}
