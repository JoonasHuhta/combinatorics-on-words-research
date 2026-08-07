/**
 * ABELISK Puzzle Generator & Authored Puzzles
 *
 * Generates small, unique-solution hole-filling puzzles
 * using brute-force enumeration. This is correct for puzzle-sized words.
 *
 * Also contains hand-verified authored puzzles for the prototype.
 */

import { findAllViolations, validSymbolsForCell, isAbelianSquareFree } from './engine.js';

const LABELS = ['a', 'b', 'c', 'd'];

/**
 * Generate all abelian-square-free words of given length over given alphabet.
 */
function generateAllASFWords(length, rule) {
  const results = [];
  const word = new Array(length).fill(0);

  function backtrack(pos) {
    if (pos === length) {
      if (isAbelianSquareFree(word, rule)) {
        results.push([...word]);
      }
      return;
    }
    for (let sym = 0; sym < rule.alphabetSize; sym++) {
      word[pos] = sym;
      // Early pruning: check violations ending at pos
      let ok = true;
      for (let halfLen = rule.minHalfLength; 2 * halfLen <= pos + 1; halfLen++) {
        const start = pos + 1 - 2 * halfLen;
        const middle = start + halfLen;
        let match = true;
        const counts = new Array(rule.alphabetSize).fill(0);
        for (let i = start; i < middle; i++) counts[word[i]]++;
        for (let i = middle; i <= pos; i++) counts[word[i]]--;
        for (let i = 0; i < rule.alphabetSize; i++) {
          if (counts[i] !== 0) { match = false; break; }
        }
        if (match) { ok = false; break; }
      }
      if (ok) backtrack(pos + 1);
    }
  }

  backtrack(0);
  return results;
}

/**
 * Create a puzzle by masking cells from a known good word.
 * Returns null if no unique-solution puzzle found with the given hole count.
 */
function createPuzzleFromWord(solution, numHoles, rule) {
  const n = solution.length;
  const indices = [];
  for (let i = 0; i < n; i++) indices.push(i);

  // Try random subsets of indices to mask
  // For small puzzles, try all combinations
  const combos = combinations(indices, numHoles);

  for (const holes of combos) {
    const initial = [...solution];
    for (const h of holes) initial[h] = null;

    // Count solutions
    const solutions = [];
    fillAndCount(initial, 0, rule, solutions, 3); // stop after finding 3
    if (solutions.length === 1) {
      // Check if there's a deductive break-in
      // (at least one cell where only 1 symbol is valid given the partial state)
      let hasBreakIn = false;
      for (const h of holes) {
        const valid = validSymbolsForCell(initial, h, rule);
        if (valid.length === 1) {
          hasBreakIn = true;
          break;
        }
      }
      if (hasBreakIn) {
        return { initial, solution, holes, rule };
      }
    }
  }
  return null;
}

function fillAndCount(cells, startIdx, rule, solutions, maxSolutions) {
  if (solutions.length >= maxSolutions) return;

  // Find first empty cell from startIdx
  let emptyIdx = -1;
  for (let i = startIdx; i < cells.length; i++) {
    if (cells[i] === null) { emptyIdx = i; break; }
  }

  if (emptyIdx === -1) {
    // All filled — check validity
    if (isAbelianSquareFree(cells, rule)) {
      solutions.push([...cells]);
    }
    return;
  }

  for (let sym = 0; sym < rule.alphabetSize; sym++) {
    cells[emptyIdx] = sym;
    // Quick check: any violation touching this cell?
    const violations = findAllViolations(cells, rule);
    const hasViolation = violations.some(v =>
      v.start <= emptyIdx && emptyIdx < v.end &&
      // Only count violations where all cells in range are filled
      cells.slice(v.start, v.end).every(c => c !== null)
    );
    if (!hasViolation) {
      fillAndCount(cells, emptyIdx + 1, rule, solutions, maxSolutions);
    }
    cells[emptyIdx] = null;
  }
}

function combinations(arr, k) {
  const result = [];
  function combine(start, combo) {
    if (combo.length === k) { result.push([...combo]); return; }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  }
  combine(0, []);
  return result;
}

/**
 * Generate one good puzzle for the prototype.
 * Returns { initial, solution, holes, rule, breakIn }
 */
export function generatePrototypePuzzle() {
  const PRECOMPUTED = [
    {"initial":[3,1,2,null,1,2,null,1],"solution":[3,1,2,0,1,2,3,1],"holes":[3,6],"rule":{"alphabetSize":4,"minHalfLength":1},"breakIn":{"cell":3,"forcedSymbol":0,"forcedLabel":"a","technique":"DOUBLE_LOCK","eliminations":[{"symbol":1,"label":"b","technique":"DOUBLE_LOCK","violation":{"start":2,"middle":4,"end":6,"halfLength":2,"leftCounts":[0,1,1,0],"rightCounts":[0,1,1,0]}},{"symbol":2,"label":"c","technique":"DOUBLE_LOCK","violation":{"start":1,"middle":3,"end":5,"halfLength":2,"leftCounts":[0,1,1,0],"rightCounts":[0,1,1,0]}},{"symbol":3,"label":"d","technique":"ECHO_BLOCK","violation":{"start":0,"middle":3,"end":6,"halfLength":3,"leftCounts":[0,1,1,1],"rightCounts":[0,1,1,1]}}]}},
    {"initial":[1,2,1,null,0,null,0,1],"solution":[1,2,1,3,0,2,0,1],"holes":[3,5],"rule":{"alphabetSize":4,"minHalfLength":1},"breakIn":{"cell":3,"forcedSymbol":3,"forcedLabel":"d","technique":"DOUBLE_LOCK","eliminations":[{"symbol":0,"label":"a","technique":"ECHO_BLOCK","violation":{"start":3,"middle":4,"end":5,"halfLength":1,"leftCounts":[1,0,0,0],"rightCounts":[1,0,0,0]}},{"symbol":1,"label":"b","technique":"ECHO_BLOCK","violation":{"start":2,"middle":3,"end":4,"halfLength":1,"leftCounts":[0,1,0,0],"rightCounts":[0,1,0,0]}},{"symbol":2,"label":"c","technique":"ECHO_BLOCK","violation":{"start":0,"middle":2,"end":4,"halfLength":2,"leftCounts":[0,1,1,0],"rightCounts":[0,1,1,0]}}]}}
  ];
  // Select a random precomputed puzzle
  return PRECOMPUTED[Math.floor(Math.random() * PRECOMPUTED.length)];
}

function findBreakIn(puzzle) {
  for (const h of puzzle.holes) {
    const valid = validSymbolsForCell(puzzle.initial, h, puzzle.rule);
    if (valid.length === 1) {
      // Find which symbols are eliminated and why
      const eliminations = [];
      for (let sym = 0; sym < puzzle.rule.alphabetSize; sym++) {
        if (!valid.includes(sym)) {
          const testCells = [...puzzle.initial];
          testCells[h] = sym;
          const violations = findAllViolations(testCells, puzzle.rule);
          const relevant = violations.filter(v => v.start <= h && h < v.end);
          if (relevant.length > 0) {
            const v = relevant[0];
            let technique = 'ECHO_BLOCK';
            if (relevant.length >= 2) technique = 'DOUBLE_LOCK';
            eliminations.push({
              symbol: sym,
              label: LABELS[sym],
              technique,
              violation: v
            });
          }
        }
      }

      return {
        cell: h,
        forcedSymbol: valid[0],
        forcedLabel: LABELS[valid[0]],
        technique: eliminations.length >= 2 ? 'DOUBLE_LOCK' : 'LAST_SYMBOL',
        eliminations
      };
    }
  }
  return null;
}

/**
 * Analyze the deduction path for a puzzle.
 * Returns an array of steps: { cell, technique, forced, eliminations }
 */
export function solvePuzzle(puzzle) {
  const cells = [...puzzle.initial];
  const steps = [];
  let progress = true;

  while (progress) {
    progress = false;
    for (const h of puzzle.holes) {
      if (cells[h] !== null) continue;
      const valid = validSymbolsForCell(cells, h, puzzle.rule);
      if (valid.length === 1) {
        cells[h] = valid[0];
        steps.push({
          cell: h,
          forced: valid[0],
          label: LABELS[valid[0]],
          technique: 'LAST_SYMBOL'
        });
        progress = true;
      } else if (valid.length === 0) {
        // No valid symbol — puzzle state is contradictory
        return { steps, solvable: false };
      }
    }
  }

  const allFilled = cells.every(c => c !== null);
  return { steps, solvable: allFilled, cells };
}
