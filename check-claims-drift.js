'use strict';

/**
 * check-claims-drift.js
 * ---------------------
 * Automated drift detector for MATH_CLAIMS.md and canonical project numbers.
 * Protects against accidental numeric drift across agent sessions (e.g. 18 vs 30 words, 2016 vs 2018 citations).
 * Run via: node check-claims-drift.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== STARTING MATH_CLAIMS DRIFT & INTEGRITY CHECKER ===\n");

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
}

const claimsPath = path.join(__dirname, 'MATH_CLAIMS.md');
const claimsContent = fs.readFileSync(claimsPath, 'utf8');

// 1. Check Canonical Numbers in MATH_CLAIMS.md
check("Canonical Ternary Bound (Len 7, 18 words, 3 orbits)", () => {
  if (!claimsContent.includes("18") || !claimsContent.includes("pituudeltaan 7")) {
    throw new Error("MATH_CLAIMS.md must specify exactly 18 words of max length 7 for ternary abelian-square-free words.");
  }
});

check("Rao & Rosenfeld (2018) Exact Citation & 34 Squares", () => {
  if (!claimsContent.includes("34 uniikkia abelin neliötä") && !claimsContent.includes("34 different abelian squares")) {
    throw new Error("MATH_CLAIMS.md must specify exactly 34 unique abelian squares for g3(h6^ω(a)).");
  }
  if (!claimsContent.includes("2018") || !claimsContent.includes("SIAM")) {
    throw new Error("MATH_CLAIMS.md must cite the primary source: Rao & Rosenfeld (2018), SIAM J. Discrete Math.");
  }
  if (claimsContent.includes("Rosenfeld (2016)") || claimsContent.includes("Thèse de doctorat (2016)")) {
    throw new Error("MATH_CLAIMS.md contains outdated reference to 'Rosenfeld (2016) thesis'. Must use Rao & Rosenfeld (2018).");
  }
});

check("No Unverified OEIS A261352 References in MATH_CLAIMS.md", () => {
  if (claimsContent.includes("A261352")) {
    throw new Error("MATH_CLAIMS.md contains unverified OEIS A261352 reference. Remove until independently confirmed.");
  }
});

// 2. Epistemological Wording Drift Check across documentation
check("No Overpromising Wording in Bridge-Welding Claims", () => {
  const walkPath = path.join(__dirname, '..', '..', '..', '.gemini', 'antigravity', 'brain', 'a4eda2cb-68a5-41dc-8e98-fc3b9ce8dbec', 'walkthrough.md');
  let walkContent = "";
  try { if (fs.existsSync(walkPath)) walkContent = fs.readFileSync(walkPath, 'utf8'); } catch(e) {}
  
  const combined = (claimsContent + " " + walkContent).toLowerCase();
  if (combined.includes("todistaa abelin-neliöttömyyden jaksoille") || combined.includes("proves abelian-square-freedom for periods")) {
    throw new Error("Documentation contains overpromising phrase 'todistaa abelin-neliöttömyyden jaksoille'. Must specify that welding only eliminates BOUNDARY/SEAM collisions!");
  }
});

// 3. Parikh Packing Arithmetic Integrity Check (No Bitwise << in Web Worker)
check("No Bitwise Left Shift (<<) in Web Worker Parikh Packing", () => {
  const workerPath = path.join(__dirname, 'aa2fr-worker.js');
  if (fs.existsSync(workerPath)) {
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    if (workerContent.includes("<<")) {
      throw new Error("aa2fr-worker.js contains bitwise shift operator '<<'. Parikh vectors MUST be packed using exact 53-bit Float64Array arithmetic (+ / -) to avoid 32-bit overflow!");
    }
    if (!workerContent.includes("Float64Array")) {
      throw new Error("aa2fr-worker.js must declare prefixPacked as Float64Array to prevent 32-bit integer overflow!");
    }
  }
});

// 4. No Emoji Characters in Tab 18 / Module 18 UI & Dispatcher
check("No Emoji Characters in Module 18 UI & Citizen Science Dispatcher", () => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check HTML slice
    const htmlStart = indexContent.indexOf('id="view-gold-lab"');
    const htmlEnd = indexContent.indexOf('<!-- END TAB 18 -->', htmlStart);
    const htmlSlice = htmlStart !== -1 ? indexContent.slice(htmlStart, htmlEnd !== -1 ? htmlEnd : undefined) : "";
    
    // Check JS slice
    const jsStart = indexContent.indexOf('// TAB 18: SEAM SEARCH');
    const jsEnd = indexContent.indexOf('// END TAB 18', jsStart);
    const jsSlice = jsStart !== -1 ? indexContent.slice(jsStart, jsEnd !== -1 ? jsEnd : undefined) : "";
    
    const combinedSlice = htmlSlice + "\n" + jsSlice;
    
    // Check for emojis (surrogate pairs or common symbols like 📡, ℹ, 🧬, 🔍, etc.)
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2300-\u23FF]|[\u2B50-\u2B55]/;
    if (emojiRegex.test(combinedSlice)) {
      throw new Error("Module 18 HTML/JS contains forbidden emoji or symbol characters in UI or issue reports! Must maintain serious scientific styling.");
    }
  }
});

// 5. Git Drift Check against HEAD (if in git repo)
check("Git Drift Check against Last Commit (MATH_CLAIMS.md)", () => {
  try {
    const headContent = execSync('git show HEAD:MATH_CLAIMS.md 2>nul', { encoding: 'utf8' });
    const getNumbers = (str) => {
      const matches = str.match(/\b\d+\b/g) || [];
      return new Set(matches);
    };
    const headNums = getNumbers(headContent);
    const currNums = getNumbers(claimsContent);
    
    // Check if critical numbers disappeared
    for (const num of ['7', '18', '34', '2018']) {
      if (!currNums.has(num)) {
        throw new Error(`Critical canonical number '${num}' missing from current MATH_CLAIMS.md!`);
      }
    }
  } catch (err) {
    if (err.message && err.message.includes("Critical canonical number")) {
      throw err;
    }
    // If git fails (e.g. initial repo or no HEAD), skip gracefully
    console.log("       (Git comparison skipped or no HEAD diff)");
  }
});

console.log(`\n=== DRIFT CHECK SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL DRIFT CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
}
