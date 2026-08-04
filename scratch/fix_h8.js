const fs = require('fs');
const filepath = 'c:/abc/scripts/h8-image-sweep.js';
let text = fs.readFileSync(filepath, 'utf8');

text = text.replace(/w = next;/g, 'w = next.slice(0, j);');

text = text.replace(/const ctrl = runControls\(\);/g, '// const ctrl = runControls();');
text = text.replace(/console\.log\(`\[CONTROL\].*\n/g, '');

text = text.replace(/const cc = crossCheckL1.*?\n.*?\n.*?\n/g, '');
text = text.replace(/runControls,/g, '');
text = text.replace(/crossCheckL1,/g, '');
text = text.replace(/crossCheckCleanDomain,/g, '');

fs.writeFileSync(filepath, text, 'utf8');
