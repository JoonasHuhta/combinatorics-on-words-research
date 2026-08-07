/**
 * ABELISK State Management
 *
 * Pure state + reducer pattern. No DOM references in state.
 */

export function createInitialState() {
  return {
    route: 'arrival',         // 'arrival' | 'story' | 'puzzle' | 'complete'
    sceneIndex: 0,
    scenePhase: 'initial',    // 'initial' | 'revealed' | 'interacting' | 'complete'

    // Puzzle state
    puzzleCells: [],
    puzzleSolution: [],
    puzzleHoles: [],
    puzzleRule: null,
    selectedSymbol: null,
    violations: [],
    puzzleComplete: false,
    puzzleBreakIn: null,

    // Progress
    restoredGlyphs: [],       // glyph indices
    totalGlyphs: 7,

    // Story-scene interaction state
    repairWord: null,
    repairSelectedCell: null,
    forcedWord: null,
    previewSymbol: null,

    // Accessibility
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
}

export function reduce(state, event) {
  switch (event.type) {
    case 'ENTER_ABELISK':
      return { ...state, route: 'story', sceneIndex: 1, scenePhase: 'initial' };

    case 'ADVANCE_SCENE':
      return {
        ...state,
        sceneIndex: state.sceneIndex + 1,
        scenePhase: 'initial',
        repairWord: null,
        repairSelectedCell: null,
        forcedWord: null,
        previewSymbol: null
      };

    case 'REVEAL_SCENE':
      return { ...state, scenePhase: 'revealed' };

    case 'COMPLETE_SCENE':
      return { ...state, scenePhase: 'complete' };

    case 'RESTORE_GLYPH':
      if (state.restoredGlyphs.includes(event.glyphIndex)) return state;
      return {
        ...state,
        restoredGlyphs: [...state.restoredGlyphs, event.glyphIndex]
      };

    case 'START_PUZZLE':
      return {
        ...state,
        route: 'puzzle',
        puzzleCells: [...event.initial],
        puzzleSolution: event.solution,
        puzzleHoles: event.holes,
        puzzleRule: event.rule,
        puzzleBreakIn: event.breakIn || null,
        selectedSymbol: null,
        violations: [],
        puzzleComplete: false
      };

    case 'SELECT_SYMBOL':
      return { ...state, selectedSymbol: event.symbol };

    case 'PLACE_SYMBOL':
      if (!state.puzzleHoles.includes(event.index)) return state;
      const newCells = [...state.puzzleCells];
      newCells[event.index] = event.symbol;
      return { ...state, puzzleCells: newCells };

    case 'CLEAR_CELL':
      if (!state.puzzleHoles.includes(event.index)) return state;
      const cleared = [...state.puzzleCells];
      cleared[event.index] = null;
      return { ...state, puzzleCells: cleared, violations: [], puzzleComplete: false };

    case 'SET_VIOLATIONS':
      return { ...state, violations: event.violations };

    case 'SELECT_SYMBOL':
      return { ...state, selectedSymbol: event.symbol };

    case 'SET_REPAIR_WORD':
      return { ...state, repairWord: [...event.word], repairSelectedCell: null };

    case 'SELECT_REPAIR_CELL':
      return { ...state, repairSelectedCell: event.index };

    case 'SET_FORCED_WORD':
      return { ...state, forcedWord: [...event.word], previewSymbol: null };

    case 'PREVIEW_SYMBOL':
      return { ...state, previewSymbol: event.symbol };

    case 'CLEAR_PREVIEW':
      return { ...state, previewSymbol: null };

    case 'ENTER_STORY_COMPLETE':
      return { ...state, route: 'complete' };

    default:
      return state;
  }
}
