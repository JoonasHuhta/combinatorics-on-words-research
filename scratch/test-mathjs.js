'use strict';
const math = require('mathjs');

const M = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const ans = math.eigs(M);
console.log('Values:', ans.values);
console.log('Vectors (should be columns):');
console.log(ans.eigenvectors);

const P = [];
for (const v of ans.eigenvectors) {
  P.push(v.vector);
}
console.log(P);
