# Agent Concept Brief: Keranen ABC Visual Laboratory

## Purpose

This project is an interactive visual study tool for Veikko Keranen's work on Abelian square-free words. It should help a viewer understand how simple letters such as `a`, `b`, and `c` become a computational object: a search space, a sequence, a set of frequency vectors, and eventually a visual or musical structure.

The program is not only a gallery of finished words. Its main value is showing how the computer calculates:

- it extends a word one letter at a time,
- it compares adjacent blocks,
- it converts blocks into Parikh vectors,
- it rejects a branch when two adjacent vectors match,
- it contrasts the failed 3-letter case with Keranen's 4-letter construction.

## Mathematical Anchor

An Abelian square is a word `uv` where `u` and `v` are adjacent, have the same length, and contain the same number of each letter. The order can differ. For example, `abba` is an Abelian square because `ab` and `ba` have the same Parikh vector.

For the 3-letter alphabet `{a,b,c}`, infinite Abelian square-free words do not exist. In fact, every 3-letter word of length 8 contains an Abelian square.

Keranen's 1992 result shows that the 4-letter alphabet `{a,b,c,d}` is enough. The construction uses a uniform morphism usually called `g85`, where every letter expands to an 85-letter word and the images of `b`, `c`, and `d` are cyclic permutations of the image of `a`.

## Current Program Shape

The main app is `index.html`. It is intentionally dependency-free and uses only browser-native APIs:

- DOM for controls and text,
- Canvas for condensed visual structure,
- Web Audio for sonification,
- plain JavaScript for search and morphism logic.

The current modes are:

- `3 Letters (Tree Search)`: animated backtracking over `{a,b,c}`.
- `ABC Laboratory`: finite exhaustive enumeration showing why length 8 fails.
- `4 Letters (Morphism g85)`: expands the current word using Keranen's morphism.
- `Condensed 2D View`: draws long words as compact colored dots.
- `Sonification`: maps letters to tones.

## Design Principle

Every visualization should answer one of these questions:

- What is the computer comparing right now?
- Why did this branch fail?
- What structure appears when the word becomes too long to read?
- How does adding the fourth letter change the computational landscape?
- Which features are proven facts and which are experimental observations?

Avoid adding decorative visuals that do not expose calculation, structure, or comparison.

## Source Material

Use the local material first:

- `teoria/` contains Finnish research summaries and project notes.
- `nettisivu/` contains saved Keranen web pages, exported notebooks, images, and examples.
- `PROJECT_ARCHITECTURE.md` describes the original app architecture.

When adding research claims, prefer primary sources in `nettisivu/` or cited Keranen papers. Mark experimental or AI-generated hypotheses clearly.
