# Project Architecture

## Overview

This project is a dependency-free interactive browser laboratory for Abelian square-free words and related constructions from Veikko Keranen's work. The application lives in a single file, `index.html`, and uses only browser-native APIs: DOM, Canvas, and Web Audio.

The app has two roles:

- teach the core ideas: Parikh vectors, Abelian equivalence, Abelian squares, and why three letters fail;
- support exploratory research workflows: morphism inspection, heat maps, unfavorable factors, AA2F/AA2FR extension experiments, and challenge-style obstruction analysis.

## Mathematical Boundaries

- A word contains an **Abelian square** if it has an adjacent factor `uv` where `|u| = |v|` and `u` and `v` have the same Parikh vector.
- Over `{a,b,c}`, fully Abelian square-free words are finite only; every word of length 8 contains an Abelian square.
- Keranen's 1992 `g85` morphism proves that an infinite Abelian square-free word exists over `{a,b,c,d}`.
- The AA2F/AA2FR ternary tools are experimental relaxed-rule tools. They must not be described as solving the fully Abelian square-free ternary problem.

## Single-File Architecture

`index.html` contains:

- all HTML panels and tab controls;
- all CSS;
- core Parikh and Abelian-square utilities;
- the tab router, `switchMode(newMode)`;
- Canvas tools for tree search, walks, heat maps, the concept graph, and Snake;
- the Web Audio sonification tool.

This structure is intentional. Do not split the app into separate JS/CSS files unless the user explicitly approves it. Small internal refactors inside `index.html` are preferred.

## Core Utilities

- `getParikh(word)`: counts letters in a string or array.
- `parikhEqual(p1, p2, alphabet)`: compares Parikh vectors over an alphabet.
- `findAbelianSquare(word, alphabet)`: full scan for an Abelian square.
- `findSuffixAbelianSquare(word, alphabet)`: suffix-only scan for incremental appends.
- `validateWordConstraints(wordArr, opts)`: shared validation layer for full, prefix, and suffix checks, including AA2FR forbidden factors.
- `renderParikhLens(data)`: shared pedagogical renderer for comparing two adjacent blocks.

## Current Tabs

| # | Visible tab name | Mode ID | Purpose |
|---|---|---|---|
| 1 | Three-Letter Search | `3letter` | Animated backtracking search over `{a,b,c}`. |
| 2 | ABC Impossibility Lab | `abc-lab` | Exhaustive finite enumeration showing why length 8 fails. |
| 3 | Keranen g85 Morphism | `4letter` | Iterates Keranen's 85-uniform four-letter morphism. |
| 4 | Word Walk | `canvas` | Draws a long word as a compact directional 2D walk. |
| 5 | Word Sonification | `audio` | Maps letters and morphism blocks to sound. |
| 6 | Try It: Parikh Lens | `try-it` | Manual word construction with live square checks and Parikh Lens. |
| 7 | History Timeline | `timeline` | Historical route from Erdos's question to Keranen's result. |
| 8 | Unfavorable Factor Explorer | `unfavorable` | Tests how far a seed can extend before hitting forced squares. |
| 9 | Morphism Microscope | `microscope` | Inspects `g85` and `g98` images, lengths, and Parikh vectors. |
| 10 | Concept Graph | `knowledge` | Interactive graph of concepts and relationships. |
| 11 | Morphism Design Lab | `morph-lab` | User-defined experimental morphism evaluator. |
| 12 | Square Heat Map | `heat-map` | Visualizes Abelian squares and near misses by position and half-length. |
| 13 | Abelian Snake | `snake` | Game mode where each eaten letter appends to the word. |
| 14 | AA2FR Extension Lab | `aa2fr` | Ternary AA2F/AA2FR extension, challenge, and obstruction lab. |

## Router Checklist for New Tabs

When adding a tab:

1. Add a `.mode-tab` entry with a stable `data-mode`.
2. Add a `view-<mode>` panel.
3. Add the view ID to the hide list in `switchMode`.
4. Add a `switchMode` branch to show the view and configure controls.
5. Ensure long-running loops are paused when leaving the tab.
6. Run `node --check` on the extracted script section.

## Verification Checklist

Before committing UI or logic changes:

- `node --check` on the extracted script from `index.html`.
- `git diff --check`.
- Verify all 14 tabs can be reached without JavaScript errors.
- Verify `g85(a)` remains length 85.
- Verify the ABC lab still reports no valid extension to length 8.
- Verify AA2FR Challenge can find a 40-letter challenge.
- Verify the Concept Graph labels remain readable after layout changes.

## Documentation Map

- `PROJECT_ARCHITECTURE.md`: technical overview and tab inventory.
- `AGENT_CONCEPT_BRIEF.md`: project goals and mathematical guardrails.
- `DEVELOPMENT_ROADMAP.md`: prioritized future work.
- `NEXT_AGENT.md`: latest handoff and implementation notes.
- `AA2FR_OHJELMAN_IDEA.md`: AA2F/AA2FR lab design and mathematical context.
- `KOULUTUSKAYTTO_PARANNUKSET.md`: education-focused improvement ideas.
