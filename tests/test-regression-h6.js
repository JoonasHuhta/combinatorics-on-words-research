'use strict';
const assert = require('assert');
const { H6 } = require('../src/morphisms.js');
const { decideMorphism } = require('../src/decide-arbitrary-realizability.js');

function runRegression() {
  console.log("Running regression test on H6 using the arbitrary decision engine...");
  const t1 = Date.now();
  const S6 = ['a', 'b', 'c', 'd', 'e', 'f'];
  
  const result = decideMorphism(H6, S6, 'a');
  
  const elapsed = ((Date.now() - t1) / 1000).toFixed(1);
  console.log(`Execution finished in ${elapsed}s`);
  console.log(result);

  assert.strictEqual(result.realizable, false, "H6 should not realize the abelian-square template (realizable=false)");
  assert.strictEqual(result.s_bound, 34, "H6 s bound should be 34");
  
  // From MATH_CLAIMS.md
  assert.strictEqual(result.boxVectorsCount, 125931, "Ancestor box size must be 125,931");
  assert.strictEqual(result.ancestorTemplatesCount, 116578, "Ancestor templates must be 116,578");
  
  console.log("Regression test passed! The generalized engine perfectly matches H6 baseline.");
}

if (require.main === module) runRegression();
