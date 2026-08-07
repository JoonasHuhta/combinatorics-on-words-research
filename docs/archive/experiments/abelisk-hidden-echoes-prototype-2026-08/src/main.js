/**
 * ABELISK — Hidden Echoes
 * Main entry point and game orchestrator.
 *
 * Prototype: scratch/antigravity-abelisk-prototype
 * This is NOT production code.
 */

import { createInitialState, reduce } from './state.js';
import { renderArrival, renderScene, renderPuzzleMode } from './renderer.js';
import { STORY_SCENES } from './story.js';
import { generatePrototypePuzzle, solvePuzzle } from './puzzle.js';
import * as engine from './engine.js';

// Expose engine to renderer for verification calls
window._abeliskEngine = engine;

const root = document.getElementById('abelisk-root');
let state = createInitialState();

function dispatch(event) {
  // Handle special events that need side effects
  if (event.type === 'STORY_COMPLETE') {
    // Generate a puzzle and transition
    const puzzle = generatePrototypePuzzle();
    if (puzzle) {
      state = reduce(state, {
        type: 'START_PUZZLE',
        initial: puzzle.initial,
        solution: puzzle.solution,
        holes: puzzle.holes,
        rule: puzzle.rule,
        breakIn: puzzle.breakIn
      });
    } else {
      // Fallback: just show completion
      state = reduce(state, { type: 'ENTER_STORY_COMPLETE' });
    }
    render();
    return;
  }

  if (event.type === 'NEW_PUZZLE') {
    const puzzle = generatePrototypePuzzle();
    if (puzzle) {
      state = reduce(state, {
        type: 'START_PUZZLE',
        initial: puzzle.initial,
        solution: puzzle.solution,
        holes: puzzle.holes,
        rule: puzzle.rule,
        breakIn: puzzle.breakIn
      });
    }
    render();
    return;
  }

  // Standard state transition
  state = reduce(state, event);

  // Post-transition checks
  if (event.type === 'PLACE_SYMBOL') {
    // Check for violations
    const violations = engine.findAllViolations(state.puzzleCells, state.puzzleRule);
    // Only show violations where all cells in range are filled
    const activeViolations = violations.filter(v =>
      state.puzzleCells.slice(v.start, v.end).every(c => c !== null)
    );
    state = reduce(state, { type: 'SET_VIOLATIONS', violations: activeViolations });

    // Check completion
    const allFilled = state.puzzleCells.every(c => c !== null);
    if (allFilled && activeViolations.length === 0) {
      state = reduce(state, { type: 'PUZZLE_COMPLETE' });
    }
  }

  render();
}

function render() {
  switch (state.route) {
    case 'arrival':
      renderArrival(root, dispatch);
      break;

    case 'story': {
      const scene = STORY_SCENES[state.sceneIndex];
      if (!scene) {
        // End of story
        dispatch({ type: 'STORY_COMPLETE' });
        return;
      }
      renderScene(root, scene, state, dispatch);
      break;
    }

    case 'puzzle':
      renderPuzzleMode(root, state, dispatch);
      break;

    case 'complete':
      root.innerHTML = `
        <div class="scene" style="text-align: center; padding-top: 4rem;">
          <h2 class="scene-title">The Abelisk remembers.</h2>
          <p class="scene-text" style="margin-top: 1rem;">
            You have discovered surface echoes, hidden echoes, and the open question at the heart of combinatorics on words.
          </p>
          <div class="glyph-progress" style="margin-top: 2rem;">
            ${Array.from({ length: state.totalGlyphs }, (_, i) =>
              `<div class="glyph${state.restoredGlyphs.includes(i) ? ' restored' : ''}"></div>`
            ).join('')}
          </div>
        </div>
      `;
      break;
  }
}

// Initial render
render();
