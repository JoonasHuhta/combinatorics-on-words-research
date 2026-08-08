const fs = require('fs');
let c = fs.readFileSync('c:\\abc\\explore.html', 'utf8');
c = c.replace(/&amp;#(\d+);/g, '&#$1;');
fs.writeFileSync('c:\\abc\\explore.html', c);
console.log('done');
