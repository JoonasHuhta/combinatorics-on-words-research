'use strict';

/**
 * install-git-hooks.js
 * ---------------------
 * Copies scripts/git-hooks/pre-commit into .git/hooks/pre-commit. Git never
 * tracks .git/hooks/ itself, so every fresh clone (and every new shared
 * worktree pointed at this repo) needs this run once before the hook is
 * actually active. Idempotent: safe to run again after the hook source
 * changes.
 *
 * Usage: node scripts/install-git-hooks.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const src = path.join(repoRoot, 'scripts', 'git-hooks', 'pre-commit');
const hooksDir = execSync('git rev-parse --git-path hooks', { cwd: repoRoot, encoding: 'utf8' }).trim();
const dest = path.isAbsolute(hooksDir) ? path.join(hooksDir, 'pre-commit') : path.join(repoRoot, hooksDir, 'pre-commit');

if (!fs.existsSync(src)) {
  console.error(`source hook not found: ${src}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
try { fs.chmodSync(dest, 0o755); } catch (e) { /* chmod is a no-op on some Windows filesystems; git bash still honours the shebang */ }

console.log(`installed: ${dest}`);
console.log('pre-commit now runs scripts/check-claims-drift.js on every commit,');
console.log('and node tests/test.js when MATH_CLAIMS.md / src / scripts / tests change.');
