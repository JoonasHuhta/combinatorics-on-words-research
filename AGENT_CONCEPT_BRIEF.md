# Agent Concept Brief

## Purpose

This project is an interactive visual laboratory for Abelian square-free words, centered on Veikko Keranen's work and especially the 1992 four-letter construction. It should help a viewer understand how simple letters become:

- a search tree,
- a sequence,
- a collection of Parikh vectors,
- a morphic construction,
- a visual or musical structure,
- and, in the AA2F/AA2FR setting, an experimental search object.

The application should not be a gallery of finished strings. Its value is that it exposes the calculation: what is being compared, why a branch fails, and how local frequency constraints shape global structure.

## Mathematical Anchor

An Abelian square is a factor `uv` where `u` and `v` are adjacent, have equal length, and contain the same number of each letter. For example, `abba` is an Abelian square because `ab` and `ba` have the same Parikh vector.

Known boundaries used by the app:

- Fully Abelian square-free words over `{a,b,c}` are finite; length 8 is impossible.
- Keranen's `g85` morphism proves that four letters are enough for an infinite Abelian square-free word.
- AA2F and AA2FR are relaxed ternary settings where period-1 Abelian squares may be allowed; they must be labeled as experimental and must not be confused with the fully Abelian square-free ternary problem.

## Current Program Shape

The main app is `index.html`. It is intentionally dependency-free:

- DOM for controls and text;
- Canvas for tree search, walks, heat maps, graph layouts, and the Snake game;
- Web Audio for sonification;
- plain JavaScript for search, validation, and morphism logic.

The current app has 14 tabs:

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

## Design Principle

Every visualization should answer at least one of these questions:

- What is the computer comparing right now?
- Why did this branch fail?
- What structure appears when the word becomes too long to read directly?
- How does adding the fourth letter change the search landscape?
- Which claims are proven facts, and which are experimental observations?

Avoid decorative features that do not expose calculation, structure, or comparison.

## Agent Rules

- Do not claim that three letters admit an infinite fully Abelian square-free word.
- Do not replace or alter Keranen's `g85` morphism without a documented source.
- Keep ordinary square-free and Abelian square-free notions distinct.
- Label user-designed morphisms, AA2FR searches, and generated examples as experimental unless a proof is present.
- Prefer small, inspectable algorithms over opaque "AI" claims.
- Use local source material first when adding research claims.

## Source Material

- `teoria/`: Finnish project notes and theory summaries.
- `nettisivu/`: saved Keranen web pages, exported notebook HTML files, images, and examples.
- `PROJECT_ARCHITECTURE.md`: current app structure.
- `NEXT_AGENT.md`: latest handoff notes.
