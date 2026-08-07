const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('C:/abc/index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("jsdomError", (error) => {
  console.error("JSDOM Error:", error.message, error.stack);
});
virtualConsole.on("error", (error) => {
    console.error("Console Error:", error);
});

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost', virtualConsole });
console.log('JSDOM loaded.');
setTimeout(() => {
    console.log('Finished testing.');
}, 2000);
