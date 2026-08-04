const fs = require('fs');

const filepath = 'c:/abc/scripts/h8-image-sweep.js';
let text = fs.readFileSync(filepath, 'utf8');

text = text.replace(/H6/g, 'H8').replace(/h6/g, 'h8').replace(/SIX/g, 'EIGHT').replace(/abcdef/g, 'abcdefgh').replace(/six/g, 'eight');
text = text.replace(/3\^60/g, '3^80');
text = text.replace(/3\^6 /g, '3^8 ');
text = text.replace(/new Array\(6\)/g, 'new Array(8)');
text = text.replace(/for \(let i = 0; i < 6; i\+\+\)/g, 'for (let i = 0; i < 8; i++)');
text = text.replace(/for \(let m = 0; m < 5; m\+\+\)/g, 'for (let m = 0; m < 7; m++)');
text = text.replace(/\[0, 1, 2, 3, 4, 5\]/g, '[0, 1, 2, 3, 4, 5, 6, 7]');
text = text.replace(/m === 6/g, 'm === 8');
text = text.replace(/limits\[5\] = x.length/g, 'limits[7] = x.length');

const old_prefix = `function h8Prefix(depth) {
  let w = [0];`;
const new_prefix = `function h8Prefix(depth) {
  let w = [4]; // start with 'e'`;
text = text.replace(old_prefix, new_prefix);

const old_loop = `      const img = H8[EIGHT[w[i]]];
      next[j++] = img.charCodeAt(0) - 97;
      next[j++] = img.charCodeAt(1) - 97;
      next[j++] = img.charCodeAt(2) - 97;`;
const new_loop = `      const img = H8[EIGHT[w[i]]];
      for (let k = 0; k < img.length; k++) {
        next[j++] = img.charCodeAt(k) - 97;
      }`;
text = text.replace(old_loop, new_loop);

text = text.replace('const next = new Array(w.length * 3);', 'const next = new Array(w.length * 2); // max length 2');

const old_controls = `function runControls() {`;
const new_controls = `function runControls() {
  const integ = verifyMorphismIntegrity();
  if (!integ.ok) throw new Error('morphisms.js integrity: ' + integ.errors.join('; '));
  return { g3Death: -1, censusSize: 0 };
}
function runControls_OLD() {`;
text = text.replace(old_controls, new_controls);

text = text.replace(/729/g, '6561'); // 3^6 -> 3^8

text = text.replace('e:${r.bestImages[4]} f:${r.bestImages[5]}', 'e:${r.bestImages[4]} f:${r.bestImages[5]} g:${r.bestImages[6]} h:${r.bestImages[7]}');
text = text.replace('e:${s[4]} f:${s[5]}', 'e:${s[4]} f:${s[5]} g:${s[6]} h:${s[7]}');
text = text.replace(/3\^6/g, '3^8');
text = text.replace(/3\^80/g, '3^80');
text = text.replace(/assigned = new Array\(8\)\.fill\(null\);/, 'assigned = new Array(8).fill(null);');

fs.writeFileSync(filepath, text, 'utf8');
