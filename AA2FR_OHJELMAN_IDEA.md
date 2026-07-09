# AA2FR Extension Lab

## Purpose

The AA2FR Extension Lab is Tab 14 of the application. It is a ternary experimental workspace for studying relaxed Abelian-square-free words over `{a,b,c}`.

It is not a proof that fully Abelian square-free infinite ternary words exist. The tab works with relaxed rules:

- **AA2F**: Abelian squares with half-length 1, such as `aa`, `bb`, and `cc`, are allowed; longer Abelian squares are forbidden.
- **AA2FR**: AA2F plus a restriction that forbids six length-4 factors.

The lab is meant to make the search process inspectable: when an extension fails, the app shows the exact obstruction.

## Core Definitions

| Term | Meaning |
|---|---|
| Parikh vector | The letter-count vector of a word, for example `abca` has `(a:2, b:1, c:1)`. |
| Abelian equivalence | Two words have the same Parikh vector. |
| Abelian square | Adjacent equal-length blocks `u v` with the same Parikh vector. |
| AA2F | Ternary relaxed setting where period-1 Abelian squares are allowed, but longer Abelian squares are forbidden. |
| AA2FR | AA2F plus the six forbidden length-4 factors. |
| forbid4 | `{baac, caab, abbc, cbba, accb, bcca}`. |

## Current UI

The tab currently provides:

- a mode selector: `aa2f` or `aa2fr`;
- an extension direction selector: left or right;
- editable base word input;
- example loaders for a 40-letter AA2FR word and a longer AA2F word;
- Start, Pause, and Step controls;
- a speed slider;
- live statistics: current length, maximum length, nodes explored, and backtracks;
- "Pause on collision";
- an obstruction explanation panel;
- a 40-letter Challenge mode.

## Obstruction Explanation

When a tested letter fails, the app stores the rejected candidate before removing the letter. The explanation panel then shows one of two cases.

### Longer Abelian Square

The panel shows:

- the candidate word with the two adjacent halves highlighted;
- the half length;
- both Parikh vectors as bar charts;
- a clear "MATCH" conclusion when both halves have the same Parikh vector.

This uses the shared `renderParikhLens(...)` component.

### Forbidden Length-4 Factor

If the failure is caused by AA2FR rather than AA2F, the panel highlights the forbidden factor and lists the six forbid4 patterns.

## Challenge Mode

The Challenge mode loads a valid 40-letter AA2FR word for which exactly one of `a`, `b`, or `c` can be appended on the right.

The user guesses the legal letter:

- a correct answer reports the unique legal extension;
- a wrong answer opens the same obstruction panel used by the automatic search.

This is both a teaching tool and a useful way to inspect local search pressure.

## Validation Architecture

The AA2FR code uses a shared validation layer:

- `validateWordConstraints(wordArr, opts)`: scans full words, prefixes, or suffixes.
- `explainAA2FViolation(wordArr, isLeft, mode)`: suffix/prefix explanation for incremental extension.
- `aa2frFindFullViolation(wordArr, mode)`: full validation for challenge selection.
- `aa2frRightExtensionOptions(wordArr, mode)`: evaluates `a`, `b`, and `c` as right extensions.

The incremental search uses prefix/suffix checks because only the newly touched end can create a new obstruction. Full scans are used when selecting challenge seed words.

## Research Boundary

The current tab is an exploratory tool. It can find long examples, local constraints, and instructive failures, but it does not prove an infinite ternary fully Abelian square-free word.

Any generated word, user-discovered pattern, or candidate rule should be labeled experimental unless it is backed by a proof or a cited source.

## Relation to the Full App

AA2FR Extension Lab is one of 14 tabs:

1. Three-Letter Search
2. ABC Impossibility Lab
3. Keranen g85 Morphism
4. Word Walk
5. Word Sonification
6. Try It: Parikh Lens
7. History Timeline
8. Unfavorable Factor Explorer
9. Morphism Microscope
10. Concept Graph
11. Morphism Design Lab
12. Square Heat Map
13. Abelian Snake
14. AA2FR Extension Lab

## References and Local Sources

- Keranen, V. (1992). *Abelian squares are avoidable on 4 letters.* ICALP 1992, LNCS 623.
- Local source material in `teoria/`.
- Saved Keranen pages and notebooks in `nettisivu/`.
