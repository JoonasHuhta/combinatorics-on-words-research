# ABELISK — Hidden Echoes
## Experimental Prototype Snapshot

### Status
- experimental
- untracked scratch prototype
- not canonical
- not production
- not mathematically authoritative

### Purpose
To test whether ABELISK can become a small, beautiful, mysterious, mathematically honest, replayable logic-puzzle experience.

### Current player journey
1. **Arrival**: Establishes atmosphere and the "Double" rule.
2. **Surface Echo**: Introduces adjacent repetitions (length 1).
3. **Hidden Echo**: Introduces abelian squares (length > 1) via the same inventory rule.
4. **Count Reveal**: Makes the mathematical inventory explicit.
5. **Repair**: Introduces interaction grammar (select cell -> choose symbol to break an echo).
6. **Deduction (First Light)**: Introduces forced placement and hole-filling.
7. **Double Lock**: Introduces advanced deduction where two overlapping echoes eliminate all but one symbol.
8. **Long Range**: Tests recognizing long-range hidden echoes.
9. **Mäkelä's Door**: Ties the abstract mathematics to the core research narrative.
10. **Final Puzzle**: An interactive, precomputed unique-solution puzzle.

### Key experimental interaction ideas
- **Repair interaction grammar**: Select a cell, then choose a symbol from a palette to edit the structure.
- **Ghost Symbol Preview**: Hovering over the palette previews the symbol in the active cell.
- **Double Lock**: Advanced logic deduction where two overlapping echoes constrain the cell's valid symbols.
- **Visual witness feedback**: Drawing precise brackets and inventory counts to explain why a word contains an echo.
- **Word/palette visual hierarchy**: Using framing and spacing to distinguish the puzzle structure from the tools.
- **Precomputed puzzle set**: Supplying mathematically verified small puzzles instantly to bypass heavy client-side generation.

### Technical architecture
- `index.html`: Main HTML entry point containing the game container.
- `abelisk.css`: Complete styling, layout, typography, animations, and visual hierarchy.
- `src/main.js`: Main orchestration and event dispatch logic.
- `src/state.js`: Immutable state transitions (reducers) for navigation and puzzle states.
- `src/renderer.js`: Pure DOM manipulation that turns the current state into visual HTML elements and interactive buttons.
- `src/story.js`: Declarative definition of all tutorial scenes, texts, and initial words.
- `src/puzzle.js`: Puzzle management and precomputed mathematically verified prototype puzzles.
- `src/engine.js`: Pure mathematical logic for detecting violations (abelian squares) and calculating valid symbols.
- `test-double-lock.js`: Utility script to find scenarios for the Double Lock tutorial.

### Explicit non-goals
- no framework (e.g., React, Vue)
- no canonical research integration
- no production deployment
- no claim-ledger authority
- no finished puzzle generator

### Safety note
All mathematical claims shown in production must later be checked against canonical project evidence before reuse.
