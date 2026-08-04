'use strict';
const { decideASF } = require('./src/decide-arbitrary-realizability.js');

const phi = {
  a: 'abc',
  b: 'bca',
  c: 'cab'
};

const S3 = ['a', 'b', 'c'];

try {
  const result = decideASF(phi, S3);
  console.log(result);
} catch (e) {
  console.error(e);
}
