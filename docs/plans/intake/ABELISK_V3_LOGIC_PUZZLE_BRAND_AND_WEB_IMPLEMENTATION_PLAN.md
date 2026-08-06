# ABELISK v3 — Logic Puzzle, Brand, and Web Implementation Plan

## A small, beautiful mystery game that teaches structural repetition through discovery

**Suggested repository path:**  
`docs/game-design/ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN.md`

**Status:** refined product, puzzle-design, brand, and implementation specification  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Target:** static GitHub Pages site, dependency-light JavaScript  
**Primary aim:** a calm, rewarding, replayable logic game that teaches structural repetition through discovery

**Supersedes:** `ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN.md`

---

# 1. Final recommendation

Keep the name:

# **ABELISK**

Keep the gameplay word:

# **Echo**

But define it carefully.

Use `echo` as the Abelisk’s fictional language for a structural repetition.

Do not use it as a replacement for the mathematical term.

The reveal should eventually say:

> The Abelisk calls this a hidden echo.  
> Mathematicians call it an Abelian square.

The refined product should be small but replayable:

```text
one guided story
one Daily puzzle
one curated puzzle archive
one optional Master Abelisk
one Mäkelä's Door
one optional laboratory
```

It should not initially contain:

- dozens of mechanics;
- a large achievement system;
- procedural puzzle generation in the browser;
- daily streaks;
- currencies;
- competitive leaderboards;
- a complicated account system;
- four equally prominent tabs;
- several simultaneous explanations.

The player should remember:

```text
the quiet opening
the first hidden echo
the moment the counts match
the distant long-range reveal
the question: can this continue forever?
```

---

# 2. Is “echo” the right term?

## 1.1 Strengths

`Echo` is:

- short;
- intuitive;
- easy to animate;
- easy to sonify;
- memorable;
- suitable for a mysterious artifact;
- easy to translate into Finnish as `kaiku`;
- understandable before formal mathematics.

It naturally communicates:

```text
something returns
something repeats
the structure responds
```

## 1.2 Risk

An ordinary echo suggests an identical copy in the same order.

An Abelian square may contain the same inventory in a different order:

```text
ab | ba
```

If the game simply says:

> This is an echo.

some players may incorrectly believe that the sequence itself repeated exactly.

## 1.3 Alternatives considered

| Term | Strength | Weakness | Recommendation |
|---|---|---|---|
| Echo | immediate and human | may imply identical order | keep as umbrella |
| Resonance | suggests same structure, not exact copy | abstract and physics-heavy | use as animation verb |
| Shadow | good metaphor for Parikh counts | unclear as main rule | use for count visualization |
| Reflection | visually elegant | implies reversal | avoid as main term |
| Balance | accessible | too narrow and may suggest equal frequencies | use only in clues |
| Signature | precise-sounding | technical and cold | use in research mode |
| Pattern | broad | not distinctive | supporting word only |

## 1.4 Final terminology system

### Echo

The fictional umbrella term for a forbidden structural repetition.

### Surface echo

An exact repeated block:

```text
ab | ab
```

Formal term:

```text
ordinary square
```

### Hidden echo

Two adjacent blocks with the same inventory but possibly different order:

```text
ab | ba
```

Formal term:

```text
Abelian square
```

### Weight echo

Two adjacent blocks with the same numerical sum.

Formal term:

```text
additive square
```

### Resonance

Use only as a verb or visual state:

```text
The cells resonate.
The Abelisk is resonating.
```

### Parikh shadow

Optional visual metaphor for the count vector:

```text
ab and ba cast the same shadow: (1,1,0)
```

This terminology preserves mystery while leading cleanly to correct mathematics.

---


# 3. Brand meaning and final naming decision

## 2.1 Meaning of the name

`ABELISK` is best understood as:

```text
ABELIAN + OBELISK
```

The name combines:

- Abelian structure;
- an ancient inscribed monument;
- layered chambers;
- hidden rules;
- a long vertical form;
- a sealed message;
- gradual restoration.

The canonical explanation may be:

> **ABELISK — an obelisk governed by Abelian laws.**

Finnish:

> **Abelisk — abelisten lakien hallitsema obeliski.**

## 2.2 Recommended public title

Use:

# **ABELISK — Hidden Echoes**

Finnish subtitle:

# **ABELISK — Piilokaikujen arvoitus**

The subtitle explains the experience while preserving the mysterious main name.

## 2.3 Naming caution

`Abelisk` should be treated as the project game name, not as a mathematical term.

Before any independent commercial release, perform:

- trademark search;
- app-store search;
- domain search;
- game-title search;
- social-handle search.

For the open research website, the subtitle improves discoverability and reduces ambiguity.

## 2.4 Final name decision

Keep `ABELISK`.

Its slight ambiguity is an advantage in a mystery game.

Do not rename it to a generic title such as:

```text
Abelian Puzzle
Parikh Game
Square-Free Logic
```

Those names explain the topic but lose the artifact identity.

---

# 4. Product hierarchy

The current modes should not be presented as four equal tabs to first-time players.

Use this hierarchy.

## 2.1 Main entrance

Primary button:

```text
Enter the Abelisk
```

This begins the guided story.

## 2.2 After the guided journey

Reveal a simple chamber menu:

```text
Story
Free Play
Master Abelisk
Laboratory
```

### Story

The carefully authored learning journey.

### Free Play

Construct or repair sequences using the discovered rule.

### Master Abelisk

The optional long 85-cell puzzle, divided into chapters.

### Laboratory

Contains the existing specialist modes:

```text
Classic colors
Additive research sandbox
Puzzle archive
Technical views
```

The additive mode should not interrupt the central Abelian story.

## Main puzzle language versus research doorway

For the replayable Sudoku-like puzzle system, use a four-symbol alphabet where it produces richer and more controllable authored puzzles:

```text
a, b, c, d
```

For the deepest research chamber, switch deliberately to Mäkelä's ternary rule:

```text
a, b, c
aa, bb, cc allowed
all longer Abelian squares forbidden
```

This separation is useful:

```text
Classic Abelisk
= stable replayable logic puzzle

Mäkelä's Door
= authentic open mathematical question
```

The UI must make the rule change explicit.

---

# 5. The beautiful minimum

The first public version should contain eight authored moments.

## Moment 1 — One symbol

```text
a
```

## Moment 2 — Exact repeat

```text
ab | ab
```

Name:

```text
surface echo
```

## Moment 3 — Hidden repeat

```text
ab | ba
```

Name:

```text
hidden echo
```

## Moment 4 — Count shadow

```text
left:  a1 b1
right: a1 b1
```

Reveal:

```text
Parikh vector
```

## Moment 5 — Repair

Change one symbol to break the echo.

## Moment 6 — Forced placement

Two symbols create echoes; one remains valid.

## Moment 7 — Long-range reveal

A new symbol completes a distant echo and the view zooms out.

## Moment 8 — Mäkelä’s door

Allow:

```text
aa
bb
cc
```

forbid all longer hidden echoes, then ask:

```text
Can this continue forever?
```

This is enough for a memorable core experience.

---


# 6. The logic-puzzle core

Abelisk can become as replayable as Sudoku only if puzzles are solved through named deductions rather than repeated trial and error.

The main design target is:

> Every authored puzzle should contain at least one satisfying logical breakthrough.

The player should be able to say:

```text
I did not guess.
I saw why this symbol had to be here.
```

## 5.1 The first five official deduction techniques

### Technique A — Echo Block

A candidate symbol is impossible because it would create a surface or hidden echo.

Example:

```text
ab | ba
```

Player reasoning:

> `a` cannot be placed here because the two adjacent blocks would have the same inventory.

### Technique B — Last Symbol

All other symbols are excluded.

Example:

```text
a → echo
b → echo
c → valid
```

This is Abelisk's equivalent of a Sudoku single.

### Technique C — Shadow Difference

Two nearly completed blocks differ in only one inventory component.

Example:

```text
left:  a2 b1 c1
right: a2 b1 c?
```

The player identifies which symbol would complete a forbidden match.

This should become Abelisk's signature deduction.

### Technique D — Double Lock

Two different echo scales exclude two different symbols.

Example:

```text
short echo excludes a
long echo excludes b
therefore c is forced
```

This creates the strongest early "aha" moment.

### Technique E — Echo Chain

One forced placement creates the next forced placement.

Example:

```text
c
→ a becomes impossible in the next cell
→ b is forced
→ another long echo is prevented
```

## 5.2 Technique visibility

Do not teach all techniques at the beginning.

Reveal the name only after the player has used the idea.

Example:

> You used two different echo lengths to eliminate two symbols.  
> This technique is called a **Double Lock**.

## 5.3 Puzzle solvability requirement

For Pure Logic and Daily puzzles:

- no guessing is required;
- a documented sequence of supported deductions exists;
- uniqueness is checked;
- the intended break-in is recorded;
- the puzzle is independently validated.

## 5.4 Intended break-in metadata

Each puzzle should include:

```yaml
intended_break_in:
  technique: DOUBLE_LOCK
  cell: 14
  explanation:
    fi: "Lyhyt kaiku sulkee pois a:n ja pitkä kaiku b:n."
    en: "A short echo excludes a and a long echo excludes b."
```

## 5.5 Puzzle-quality test

A curated puzzle should pass:

1. **Validity** — the final structure obeys the declared rule.
2. **Uniqueness** — the declared number of solutions is correct.
3. **Logical solvability** — supported deductions solve it without guessing.
4. **Insight** — at least one nontrivial deduction exists.
5. **Economy** — the puzzle contains little repetitive filler.
6. **Clarity** — the reason for each forced move can be explained.

---

# 7. Core interaction verbs

Restrict the main journey to four verbs:

```text
NOTICE
MARK
PLACE
REVEAL
```

## Notice

Observe a sequence and predict where the structure reacts.

## Mark

Select or bracket two adjacent blocks.

## Place

Choose one symbol for an empty cell.

## Reveal

Open the next layer of explanation or message.

This simplicity matters.

The player should not need to learn:

- drag modes;
- multiple currencies;
- inventory screens;
- complex toolbars;
- several note systems;

before understanding the mathematical idea.

---

# 8. Feedback behavior

## 5.1 Use a calm response

Do not use:

- aggressive shaking;
- loud alarms;
- large red failure banners;
- “wrong” as the only message.

Use:

1. a soft paired pulse;
2. a bracket around the two blocks;
3. a short message:

```text
A hidden echo formed.
```

4. an optional explanation button.

## 5.2 Beginner and advanced behavior

### Guided mode

When a player places an invalid symbol:

- show the echo;
- explain it;
- offer `Undo`.

Do not immediately erase the move before the learner sees what happened.

### Free Play

Allow the invalid state to remain temporarily.

Show:

```text
1 unresolved echo
```

The player may inspect and repair it.

This supports experimentation.

## 5.3 Deterministic witness policy

When several violations appear, show:

1. the shortest new violation;
2. then the earliest start position;
3. allow `Show other echoes`.

A deterministic policy makes explanations and tests reproducible.

---

# 9. Rewards

Do not use a conventional score as the main reward.

Use **restoration**.

## 6.1 Seven glyphs

The Abelisk contains seven dark glyphs.

Each major insight restores one:

```text
Exact repetition
Hidden inventory
Count shadow
Repair
Deduction
Long memory
Open question
```

## 6.2 What restoration changes

A restored glyph may:

- illuminate;
- add one quiet musical note;
- reveal one phrase fragment;
- unlock one visual representation.

The reward is tied to understanding.

## 6.3 Progress wording

Avoid:

```text
Progress: 42%
```

Prefer:

```text
3 of 7 glyphs restored
```

For the master puzzle:

```text
Chapter 2 of 5
18 of 85 cells resolved
```

---

# 10. Cipher versus sealed message

The current product uses “Cipher” and “Decrypt.”

This needs one conceptual distinction.

## 7.1 Sealed message

A message is gradually revealed when correct cells are resolved.

This is a narrative reward.

It is not necessarily a cryptographic cipher.

Use wording:

```text
Restore the pattern to unseal the message.
```

## 7.2 True cipher

A true cipher requires the solved symbols to mathematically determine the plaintext through a defined transformation.

This can be added later.

## 7.3 Recommendation for v2

Use:

```text
Cipher Vault
```

as the chamber name, but explain:

> The pattern acts as the key that unlocks the sealed text.

Do not claim a novel cryptographic method.

## 7.4 Do not display plaintext in advance

Unsolved cells should not show grey plaintext letters.

Use:

```text
·
?
sealed glyph
```

When the structural cell is resolved, reveal the associated plaintext character.

This creates a clear causal experience.

---

# 11. The 85-cell Master Abelisk

The long puzzle should be optional and calm.

## 8.1 Divide it into five visual chapters

Example:

```text
I   The Surface
II  The Shadow
III Broken Order
IV  Long Memory
V   The Question
```

These are interface chapters unless a mathematical decomposition is separately justified.

## 8.2 Preserve global structure

The full 85-cell sequence remains one puzzle.

The chapters provide:

- navigation;
- checkpoints;
- visual focus;
- narrative pacing.

## 8.3 Avoid overwhelming the player

At any moment show:

- the active chapter;
- a small minimap;
- one current objective;
- one hint button;
- the symbol palette.

Do not show every control at once.

## 8.4 Completion note

If the sequence is inspired by a real 85-letter mathematical construction, reveal after completion:

- the exact relationship;
- the mathematical source;
- a claim ID;
- what the puzzle preserves;
- what was modified for play.

Avoid describing it as “the fundamental building block of the Abelian universe” outside clearly fictional narration.

---

# 12. Critical mathematical distinction: append mode versus hole-filling mode

This is essential for correct code.

## 9.1 Append mode

When the player only appends a symbol to the right of an already valid word:

> every newly created violation must end at the new final symbol.

A suffix-only incremental checker is mathematically sufficient.

## 9.2 Hole-filling mode

When the player fills an empty cell in the middle:

> a newly completed violation may begin before the cell and end after it.

A suffix-only checker is not sufficient.

The program must inspect every newly completed candidate block pair that contains the edited position.

## 9.3 Full verification

A separate full verifier must inspect:

- every start position;
- every half-length;
- every complete pair of blocks.

This distinction should exist in both code and tests.

---

# 13. Recommended web architecture

The current site is static and the main application is already large.

Do not place the complete Abelisk v2 implementation into one more inline block inside the main HTML file.

Create a standalone route:

```text
/abelisk/
```

Recommended files:

```text
abelisk/
  index.html
  abelisk.css

  src/
    main.js
    state.js
    renderer.js
    accessibility.js
    storage.js
    i18n.js

    engine/
      abelian.js
      additive.js
      violations.js
      solver.js

    content/
      story.fi.json
      story.en.json
      puzzles/
        ABELISK-001.json
        ABELISK-002.json
        MASTER-085.json

  plain/
    index.html

tests/
  abelisk-engine.test.js
  abelisk-puzzles.test.js
  abelisk-resume.test.js
  abelisk-dom.test.js
```

The main website should link to the route:

```html
<a href="./abelisk/">Enter the Abelisk</a>
```

This gives the experience:

- visual focus;
- faster maintenance;
- independent testing;
- simpler code ownership;
- less risk to the existing explorer.

---

# 14. Technology choice

Use standards-based browser JavaScript.

Recommended:

```text
HTML
CSS
ES modules
DOM buttons
JSON content
Node-based tests
```

A new framework is not required.

Reasons:

- the repository already uses static GitHub Pages;
- the game state is manageable;
- the mathematical core benefits from pure functions;
- accessibility is easier with semantic DOM than canvas;
- dependency count stays small.

Use `<canvas>` only for optional decorative effects or a minimap.

Do not use canvas for the main interactive cells.

---

# 15. HTML shell

Example:

```html
<!doctype html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Abelisk</title>
  <link rel="stylesheet" href="./abelisk.css">
</head>
<body>
  <main id="abelisk-root">
    <noscript>
      Abelisk tarvitsee JavaScriptin.
      <a href="./plain/">Avaa tekstimuotoinen tutoriaali.</a>
    </noscript>
  </main>

  <div id="abelisk-live" class="sr-only" aria-live="polite"></div>

  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

# 16. Game state

Use one serializable state object.

```js
const initialState = {
  schemaVersion: 2,

  language: "fi",
  route: "story",
  sceneId: "ONE_SYMBOL",
  chamberId: "STORY",
  puzzleId: "ABELISK-001",
  puzzleVersion: 1,

  cells: [],
  selectedSymbol: null,
  notes: {},
  history: [],

  hintLevel: 0,
  activeViolationId: null,
  revealedMessageCells: [],

  restoredGlyphs: [],
  discoveredInsights: [],

  reducedMotion: false,
  soundEnabled: false,
  status: "PLAYING"
};
```

State must contain data, not DOM elements.

---

# 17. Event model

Use a reducer or equivalent pure state transition.

Events:

```text
START_STORY
CONTINUE_SCENE
SELECT_SYMBOL
PLACE_SYMBOL
CLEAR_CELL
UNDO
REDO
REQUEST_HINT
MARK_BLOCK
OPEN_EXPLANATION
COMPLETE_PUZZLE
RESTORE_GLYPH
CHANGE_LANGUAGE
SET_REDUCED_MOTION
```

Example:

```js
export function reduce(state, event) {
  switch (event.type) {
    case "SELECT_SYMBOL":
      return { ...state, selectedSymbol: event.symbol };

    case "UNDO":
      return undo(state);

    case "REQUEST_HINT":
      return {
        ...state,
        hintLevel: Math.min(state.hintLevel + 1, 4)
      };

    default:
      return state;
  }
}
```

Keep mathematical checking outside the reducer.

---

# 18. Mathematical engine

## 15.1 Representation

Use integers internally:

```text
a = 0
b = 1
c = 2
d = 3
empty = null
```

Display labels are separate.

## 15.2 Rule configuration

```js
const rule = {
  type: "ABELIAN",
  alphabetSize: 3,
  minHalfLength: 2
};
```

Classic four-letter square-free mode may use:

```js
{
  type: "ABELIAN",
  alphabetSize: 4,
  minHalfLength: 1
}
```

Additive mode:

```js
{
  type: "ADDITIVE",
  values: [0, 1, 2, 6],
  minHalfLength: 1
}
```

Never infer the rule only from the displayed palette.

---

# 19. Reference verifier

Write the whole-word verifier first.

```js
export function findAllAbelianViolations(cells, {
  alphabetSize,
  minHalfLength
}) {
  const violations = [];
  const n = cells.length;

  for (let start = 0; start < n; start++) {
    for (
      let halfLength = minHalfLength;
      start + 2 * halfLength <= n;
      halfLength++
    ) {
      const end = start + 2 * halfLength;

      if (!isComplete(cells, start, end)) {
        continue;
      }

      const left = countRange(
        cells,
        start,
        start + halfLength,
        alphabetSize
      );

      const right = countRange(
        cells,
        start + halfLength,
        end,
        alphabetSize
      );

      if (sameCounts(left, right)) {
        violations.push({
          start,
          middle: start + halfLength,
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
```

This is the trusted browser reference for puzzle-sized words.

Optimization comes later.

---

# 20. Incremental append checker

For Free Play append mode:

```js
export function findNewEndingViolations(
  cells,
  {
    alphabetSize,
    minHalfLength
  }
) {
  const n = cells.length;
  const violations = [];

  for (
    let halfLength = minHalfLength;
    2 * halfLength <= n;
    halfLength++
  ) {
    const start = n - 2 * halfLength;
    const middle = n - halfLength;

    const left = countRange(
      cells,
      start,
      middle,
      alphabetSize
    );

    const right = countRange(
      cells,
      middle,
      n,
      alphabetSize
    );

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
```

This checker may later use prefix sums.

The public complexity description must remain:

```text
one fixed comparison: O(1) with prefix sums
all half-lengths after one append: O(n)
```

---

# 21. Middle-cell checker

For filling a hole:

```js
export function findNewViolationsTouchingIndex(
  cells,
  changedIndex,
  rule
) {
  return findAllViolations(cells, rule).filter(violation =>
    violation.start <= changedIndex &&
    changedIndex < violation.end
  );
}
```

This simple reference implementation is suitable for short puzzles.

A later optimized implementation may enumerate only relevant intervals, but it must be tested against this version.

---

# 22. Puzzle data schema

The current two-array format is too small for the refined game.

Use a versioned schema.

```json
{
  "schemaVersion": 2,
  "id": "ABELISK-004",
  "version": 1,

  "title": {
    "fi": "Piilokaiku",
    "en": "Hidden Echo"
  },

  "mode": "HOLE_FILL",

  "alphabet": [
    { "id": 0, "label": "a", "shape": "circle" },
    { "id": 1, "label": "b", "shape": "diamond" },
    { "id": 2, "label": "c", "shape": "triangle" }
  ],

  "rule": {
    "type": "ABELIAN",
    "minHalfLength": 2
  },

  "initialCells": [0, 1, null, 0],
  "solutionCells": [0, 1, 2, 0],

  "solutionPolicy": "UNIQUE",
  "targetInsight": "HIDDEN_ECHO",

  "message": {
    "kind": "SEALED",
    "text": {
      "fi": "JÄRJESTYS VOI HÄMÄTÄ",
      "en": "ORDER CAN LIE"
    },
    "unlock": "ON_COMPLETE"
  },

  "hints": [
    {
      "level": 1,
      "fi": "Kaksi vierekkäistä ryhmää yrittää vastata toisiaan.",
      "en": "Two neighboring groups are trying to match."
    }
  ],

  "source": {
    "kind": "PROJECT_AUTHORED",
    "claimIds": []
  }
}
```

---

# 23. Puzzle validation

Puzzle files must be validated before publication.

For every puzzle:

- alphabet IDs are valid;
- initial cells fit the alphabet;
- the declared solution satisfies the rule;
- fixed clues match the solution;
- the solution count matches `solutionPolicy`;
- message unlock indices are valid;
- hints do not contradict the solution;
- the target insight is declared;
- mathematical source metadata is present when needed.

## 20.1 Uniqueness and logical trace

For Cipher Vault, Daily, and Pure Logic deduction puzzles:

```text
solution count must equal 1
```

The offline solver should also emit a logical trace:

```yaml
steps:
  - technique: ECHO_BLOCK
    cell: 7
    eliminated: a

  - technique: SHADOW_DIFFERENCE
    cell: 12
    forced: c

  - technique: DOUBLE_LOCK
    cell: 18
    forced: b
```

If the solver can finish only through blind branching, the puzzle is not accepted into Daily or Pure Logic.

It may still appear in:

```text
Free Play
Research Sandbox
Master challenge
```

For Cipher Vault deduction puzzles:


For Free Play:

```text
multiple solutions are expected
```

Do not call one sequence “the solution” unless uniqueness was checked.

## 20.2 Offline solver

Run uniqueness checks in Node during development or CI.

Do not solve the 85-cell puzzle from scratch every time the page loads.

---

# 24. Rendering architecture

Use small render functions.

```text
renderApp
renderHeader
renderStoryScene
renderPuzzle
renderCell
renderPalette
renderEchoOverlay
renderHint
renderMessage
renderGlyphProgress
```

Example:

```js
export function renderCell(cell, index, state) {
  const button = document.createElement("button");

  button.className = "abelisk-cell";
  button.type = "button";
  button.dataset.index = String(index);

  button.setAttribute(
    "aria-label",
    cellAriaLabel(cell, index, state)
  );

  button.textContent =
    cell === null ? "" : state.alphabet[cell].label;

  return button;
}
```

Prefer clear DOM replacement or targeted updates over complicated implicit mutation.

---

# 25. Styling

Use CSS custom properties.

```css
:root {
  --abelisk-bg: #f7f9fc;
  --abelisk-panel: #ffffff;
  --abelisk-text: #162033;
  --abelisk-muted: #64748b;
  --abelisk-accent: #477cf6;
  --abelisk-success: #2bbf83;
  --abelisk-warning: #d99a28;
  --abelisk-cell-size: 3rem;
}
```

## 22.1 Visual restraint

Use:

- one main accent color;
- white or pale panels;
- stable letter colors;
- one green restoration color;
- one warm echo highlight.

Avoid several competing gradients and glows.

## 22.2 Responsive cell grid

```css
.abelisk-grid {
  display: grid;
  grid-template-columns:
    repeat(var(--columns), minmax(2.4rem, 3rem));
  gap: 0.4rem;
  justify-content: center;
}
```

For narrow screens:

```css
@media (max-width: 600px) {
  .abelisk-grid {
    grid-template-columns:
      repeat(var(--mobile-columns), minmax(2.1rem, 1fr));
  }
}
```

## 22.3 Focus

```css
.abelisk-cell:focus-visible,
.abelisk-symbol:focus-visible,
.abelisk-action:focus-visible {
  outline: 3px solid #111827;
  outline-offset: 3px;
}
```

---

# 26. Animation

Use CSS classes or the Web Animations API.

The main animation is paired resonance:

1. first block pulses;
2. second block pulses;
3. both remain bracketed;
4. count shadows appear on request.

Do not constantly animate every solved cell.

## 23.1 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

Also provide a visible toggle.

The static reduced-motion version must preserve:

- block boundaries;
- matching count labels;
- active-cell state.

---

# 27. Accessibility

Use semantic controls.

Each cell is a button.

Each symbol is a button.

The active puzzle has a heading.

Violation feedback uses an `aria-live` region.

Example:

> Hidden echo found from cells 3 to 6.  
> Left block a b. Right block b a.  
> Both contain one a and one b.

Do not use color as the only symbol identity.

Each symbol should have:

- letter;
- stable shape;
- accessible name.

---

# 28. Persistence

Use `localStorage` only for local game state.

Key:

```text
abelisk:v2:<puzzle-id>:<puzzle-version>
```

Save:

- cells;
- history;
- restored glyphs;
- scene;
- accessibility preferences.

Do not save:

- personal identity;
- free-text student answers;
- classroom identifiers;

without a separate consent design.

## 25.1 Version mismatch

When puzzle version changes:

- do not silently apply old state;
- offer `Restart updated puzzle`;
- preserve completed-glyph history separately if appropriate.

---

# 29. Internationalization

Do not hard-code Finnish and English inside rendering logic.

Use content files:

```text
story.fi.json
story.en.json
```

Code requests:

```js
t("story.hiddenEcho.reveal")
```

Keep mathematical symbols and internal IDs language-neutral.

Translations should preserve:

- claim status;
- mathematical scope;
- difference between echo and Abelian square.

---

# 30. Tests

## 27.1 Mathematical tests

- ordinary square examples;
- non-ordinary Abelian squares;
- non-examples;
- half-length boundary;
- `K=1` allowed in Mäkelä mode;
- `K=1` forbidden in classical square-free mode;
- hole placement in the middle;
- overlapping violations;
- additive examples;
- invalid symbols.

## 27.2 Differential tests

For all short sequences up to a feasible length:

```text
incremental append checker
vs.
whole-word reference verifier
```

For random partial puzzles:

```text
touching-index checker
vs.
whole-word verifier filtered by index
```

## 27.3 Puzzle tests

- declared solution valid;
- uniqueness correct;
- initial state does not contradict fixed clues;
- every hint references an existing structural fact;
- every revealed message index valid;
- master puzzle checksum stable.

## 27.4 State tests

- undo;
- redo;
- save;
- resume;
- version change;
- scene progression;
- hint progression.

## 27.5 Accessibility tests

At minimum:

- keyboard-only walkthrough;
- focus visibility;
- screen-reader labels;
- reduced motion;
- 200% zoom;
- no-color test.

---

# 31. Migration from the current implementation

## Step 1 — Freeze the current Abelisk

Tag or preserve the current version.

Do not refactor and redesign simultaneously without a reference point.

## Step 2 — Extract the mathematical rules

Move the current checker into pure functions with tests.

Do this before changing visuals.

## Step 3 — Create `/abelisk/` as a standalone route

Build the eight-moment guided journey separately.

Link it from the current page.

## Step 4 — Convert one current puzzle

Convert one small Classic or Cipher puzzle into schema v2.

Validate its solution and uniqueness.

## Step 5 — Build the sealed-message reveal

Remove visible grey plaintext from unsolved cells.

Reveal text only through resolved structure.

## Step 6 — Add Free Play

Reuse the same engine.

## Step 7 — Convert the 85-cell puzzle

Only after the small journey works.

Divide it into interface chapters and add checkpoints.

## Step 8 — Move additive mode into Laboratory

Keep it available but outside the main learning arc.

---

# 32. First implementation sprint

A realistic first sprint should produce:

```text
/abelisk/index.html
/abelisk/abelisk.css
/abelisk/src/main.js
/abelisk/src/state.js
/abelisk/src/renderer.js
/abelisk/src/engine/abelian.js
/abelisk/src/content/story.fi.json
/abelisk/src/content/puzzles/ABELISK-001.json
/tests/abelisk-engine.test.js
```

The first playable content:

1. one symbol;
2. `ab|ab`;
3. `ab|ba`;
4. one count comparison;
5. one repair;
6. the phrase:

```text
ORDER CAN LIE
```

Do not begin with the 85-cell puzzle.

---

# 33. Features deliberately postponed

Do not include in the first refined release:

- user accounts;
- global rankings;
- daily streaks;
- a public level editor;
- procedural generation;
- online multiplayer;
- complex analytics;
- collectible cosmetic inventory;
- full research dashboard;
- AI-generated hints;
- cryptographic claims;
- real-time cloud saves.

These may be reconsidered only after the core experience is tested with learners.

---

# 34. Success criteria

The refined Abelisk succeeds when a first-time player can say:

> An exact repeat is one kind of echo.

> A hidden echo can have the same letters in a different order.

> The game checks the inventory of the two halves.

> Mathematicians call that an Abelian square.

> Mäkelä asks whether all longer ones can be avoided forever using three letters.

The player should also understand:

> A long finite result is not the same as an infinite proof.

After each curated puzzle, offer:

```text
How the puzzle unfolded
```

This optional view shows the player's or canonical deduction path:

```text
Cell 7  — Last Symbol
Cell 12 — Shadow Difference
Cell 18 — Double Lock
Cell 19 — Echo Chain
```

Technical success requires:

- correct append and hole-filling checks;
- independently tested full verification;
- validated puzzle files;
- no unsupported uniqueness claims;
- accessible DOM interaction;
- resumable local state;
- separation from the existing large page;
- no regression in the main research explorer.

---

# 35. Final design statement

Keep `echo`.

It is the right word for the game because it is:

```text
simple
mysterious
visual
audible
memorable
```

But let the game refine its meaning.

```text
At first:
an echo looks like a copy.

Then:
an echo survives a change of order.

Finally:
the player understands that the Abelisk is responding
not to appearance,
but to preserved structure.
```

The finished game should be elegant enough that the interface almost disappears.

There is a sequence.

There is a quiet response.

There is a pattern the player did not see before.

Then there is an idea.

That idea is the reward.

The Sudoku-level design test is:

> After the solution is seen, does it feel inevitable?

A strong Abelisk puzzle should create exactly that feeling.
