/**
 * ABELISK Mathematical Engine
 *
 * Reference verifier for Abelian square detection.
 * This is the trusted, simple, correct implementation.
 * Do NOT optimize before testing.
 *
 * Supports:
 * - Full whole-word verification (all start positions, all half-lengths)
 * - Hole-filling mode (violations touching a specific index)
 * - Append mode (violations ending at the final position)
 */

/**
 * Count occurrences of each symbol in cells[start..end)
 * @param {Array} cells - array of integers (0,1,2,...) or null
 * @param {number} start
 * @param {number} end
 * @param {number} alphabetSize
 * @returns {number[]} counts array
 */
export function countRange(cells, start, end, alphabetSize) {
  const counts = new Array(alphabetSize).fill(0);
  for (let i = start; i < end; i++) {
    if (cells[i] !== null && cells[i] !== undefined) {
      counts[cells[i]]++;
    }
  }
  return counts;
}

/**
 * Check if all cells in [start, end) are filled (not null)
 */
function isComplete(cells, start, end) {
  for (let i = start; i < end; i++) {
    if (cells[i] === null || cells[i] === undefined) return false;
  }
  return true;
}

/**
 * Check if two count arrays are identical
 */
function sameCounts(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Find ALL Abelian square violations in a word.
 *
 * @param {Array} cells - array of integers or null
 * @param {Object} rule - { alphabetSize, minHalfLength }
 * @returns {Array} violations: [{ start, middle, end, halfLength, leftCounts, rightCounts }]
 */
export function findAllViolations(cells, rule) {
  const violations = [];
  const n = cells.length;
  const { alphabetSize, minHalfLength } = rule;

  for (let start = 0; start < n; start++) {
    for (
      let halfLength = minHalfLength;
      start + 2 * halfLength <= n;
      halfLength++
    ) {
      const middle = start + halfLength;
      const end = start + 2 * halfLength;

      if (!isComplete(cells, start, end)) continue;

      const left = countRange(cells, start, middle, alphabetSize);
      const right = countRange(cells, middle, end, alphabetSize);

      if (sameCounts(left, right)) {
        violations.push({
          start,
          middle,
          end,
          halfLength,
          leftCounts: left,
          rightCounts: right
        });
      }
    }
  }

  return violations;
}

/**
 * Find violations touching a specific cell index.
 * Used for hole-filling mode.
 */
export function findViolationsTouchingIndex(cells, index, rule) {
  return findAllViolations(cells, rule).filter(
    v => v.start <= index && index < v.end
  );
}

/**
 * Find violations ending at the current word length.
 * Used for append mode.
 */
export function findNewEndingViolations(cells, rule) {
  const n = cells.length;
  const violations = [];
  const { alphabetSize, minHalfLength } = rule;

  for (
    let halfLength = minHalfLength;
    2 * halfLength <= n;
    halfLength++
  ) {
    const start = n - 2 * halfLength;
    const middle = n - halfLength;

    if (!isComplete(cells, start, n)) continue;

    const left = countRange(cells, start, middle, alphabetSize);
    const right = countRange(cells, middle, n, alphabetSize);

    if (sameCounts(left, right)) {
      violations.push({
        start,
        middle,
        end: n,
        halfLength,
        leftCounts: left,
        rightCounts: right
      });
    }
  }

  return violations;
}

/**
 * Check if placing symbol at index would create any violation.
 * Returns the list of violations that would be created.
 */
export function wouldCreateViolation(cells, index, symbol, rule) {
  const testCells = [...cells];
  testCells[index] = symbol;
  return findViolationsTouchingIndex(testCells, index, rule);
}

/**
 * For a given empty cell, determine which symbols are valid (create no violations).
 */
export function validSymbolsForCell(cells, index, rule) {
  const valid = [];
  for (let sym = 0; sym < rule.alphabetSize; sym++) {
    const violations = wouldCreateViolation(cells, index, sym, rule);
    if (violations.length === 0) {
      valid.push(sym);
    }
  }
  return valid;
}

/**
 * Check if the entire word is Abelian-square-free.
 */
export function isAbelianSquareFree(cells, rule) {
  return findAllViolations(cells, rule).length === 0;
}
