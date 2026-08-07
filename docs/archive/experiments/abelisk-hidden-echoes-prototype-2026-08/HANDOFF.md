# ABELISK Prototype Handoff

## A. WHAT TO COMPARE

Compare:
1. current public Abelisk implementation in `index.html`
2. this prototype
3. ABELISK V3 (`ABELISK_V3_LOGIC_PUZZLE_BRAND_AND_WEB_IMPLEMENTATION_PLAN`)
4. ABELISK V2 (`ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN`)
5. Gameplay / Discovery / Insight design document (`ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM`)

## B. STRONGEST PROTOTYPE IDEAS

### Atmosphere / Visual Restraint
- **What it addresses:** Replaces noisy technical UI with a calm, mysterious aesthetic that treats mathematics as an ancient structure.
- **Why it may be worth preserving:** It successfully elevates a combinatorial problem into a premium puzzle experience without compromising the underlying math.
- **What remains unverified:** Whether this aesthetic holds up for complex, multi-layered puzzles or large grids.

### Chamber I–III Tutorial Pacing
- **What it addresses:** The steep learning curve of understanding abelian squares.
- **Why it may be worth preserving:** Gradually exposing length-1 echoes, then length-n echoes, then explicit counting makes the concept intuitive before asking the player to act on it.
- **What remains unverified:** If players retain this understanding during the more complex deduction phases.

### Select-cell → Choose-symbol Interaction (Repair)
- **What it addresses:** Clear, unambiguous editing of the puzzle structure.
- **Why it may be worth preserving:** It maps perfectly to touch screens and keyboard focus, cleanly separating the "where" (grid) from the "what" (palette).
- **What remains unverified:** Speed and ergonomics for advanced players filling many cells rapidly.

### Ghost Symbol Preview
- **What it addresses:** Fear of making a mistake by allowing the player to visualize the symbol before committing to it.
- **Why it may be worth preserving:** It naturally bridges the visual gap between the palette and the grid.
- **What remains unverified:** Mobile hover/preview interactions.

### Double Lock
- **What it addresses:** Establishing advanced logic techniques (similar to Sudoku techniques) that give the player deterministic strategies.
- **Why it may be worth preserving:** It turns brute-force guessing into elegant, satisfying deduction.
- **What remains unverified:** How often Double Locks occur naturally in larger generated puzzles.

### Witness Visualization
- **What it addresses:** The opacity of why a sequence fails the abelian-square-free rule.
- **Why it may be worth preserving:** Explicitly bracketing the two halves and detailing their inventory counts provides irrefutable, pedagogical proof of the violation.
- **What remains unverified:** How this scales visually for very long echoes.

### Precomputed Puzzle Approach
- **What it addresses:** The blocking, multi-second delay caused by synchronous client-side combinatorial generation.
- **Why it may be worth preserving:** Instantly providing a verified puzzle respects the player's time and prevents UI freezing.
- **What remains unverified:** The pipeline required to generate, verify, and store enough puzzles for a full game.

### Clearer Word vs Palette Hierarchy
- **What it addresses:** Visual blurring between interactive grids and the symbol selection tools.
- **Why it may be worth preserving:** Subtly framing the grid while spacing out the palette immediately communicates the interaction model without relying on clunky labels.
- **What remains unverified:** How this framing handles dynamic layout changes.

## C. KNOWN WEAKNESSES / OPEN QUESTIONS

- some tutorial scenes may still be text-heavy
- touch behavior needs real-device testing
- screen-reader behavior needs real assistive-technology testing
- 3-letter strict → 4-letter strict → 3-letter relaxed transition may confuse
- Mäkelä's Door wording needs canonical claim review
- replayability has not been user tested broadly
- prototype code has not been production-reviewed

## D. DO NOT INFER

Do not treat:
- Gemini/Claude self-assessments as user evidence
- prototype success messages as research claims
- finite puzzle examples as evidence for infinite existence
- this snapshot as approved canonical architecture

## E. CLAUDE REVIEW QUESTIONS

Ask Claude later to classify each major element as:
- KEEP FROM CURRENT
- KEEP FROM PROTOTYPE
- MERGE
- REJECT
- OWNER DECISION

And review separately:
- mathematical correctness
- UX / pedagogy
- accessibility
- architecture
- claim safety
- production readiness

## F. FILE INVENTORY

- `index.html`: The prototype entry point.
- `abelisk.css`: Complete styling, aesthetic definitions, and layout.
- `src/main.js`: Root setup and central event dispatching.
- `src/state.js`: Immutable state management (`createInitialState`, `reduce`).
- `src/renderer.js`: DOM rendering logic, updating the screen based on state.
- `src/story.js`: The definition of all tutorial chambers, texts, and rule constraints.
- `src/puzzle.js`: Puzzle definition, validation, and precomputed prototype setups.
- `src/engine.js`: Pure mathematical core (finding violations, verifying abelian-square-free status).
- `test-double-lock.js`: A scratch script used during development to find Double Lock examples.
- `README.md`: High-level overview of the experimental snapshot.
- `HANDOFF.md`: This document, bridging the prototype to the next phase.

## G. SNAPSHOT NOTE

Git cannot reconstruct the internal development history because the entire prototype directory is currently untracked. Do not invent authorship per file or feature.
