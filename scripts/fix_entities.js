const fs = require('fs');
let c = fs.readFileSync('c:\\abc\\index.html', 'utf8');
c = c.replace(/&amp;#(\d+);/g, '&#$1;');
fs.writeFileSync('c:\\abc\\index.html', c);
console.log('done');
