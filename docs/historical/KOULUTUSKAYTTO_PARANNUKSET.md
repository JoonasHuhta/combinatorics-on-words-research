# Educational Improvement Notes

## Goal

The application is already useful as a research-oriented visual lab. For teaching, the main challenge is cognitive load: a first-time student sees 14 tabs, several research terms, and multiple related but distinct rule systems.

The best educational improvements are the ones that make the calculation visible.

## Improvements Already Implemented

### Parikh Lens

The Try It tab now includes a Parikh Lens. It compares two adjacent blocks, shows their letter-count bars, and states whether the blocks form an Abelian square.

This is the strongest introductory teaching component because it directly answers: "Why does order not matter?"

### AA2FR Obstruction Explanation

The AA2FR Extension Lab now pauses on failed extensions and explains the failure:

- longer Abelian square: shows both halves and their Parikh vectors;
- forbid4 violation: highlights the forbidden factor.

### AA2FR Challenge Mode

The 40-letter Challenge mode asks the learner to find the only legal right extension. Wrong answers become teachable moments because the same obstruction panel explains the failure.

### Abelian Snake

The Snake game turns word construction into an interactive survival problem. It is useful for engagement, but it should remain mathematically grounded through the suffix split and Parikh balance panels.

## Recommended Next Educational Feature

### Student Mode

Add a Student Mode toggle that filters the interface into a guided sequence:

1. Try It: Parikh Lens
2. ABC Impossibility Lab
3. Keranen g85 Morphism
4. Morphism Microscope
5. Square Heat Map
6. AA2FR Extension Lab

Advanced tabs such as Morphism Design Lab, Unfavorable Factor Explorer, and full AA2FR search controls can remain available behind an "Advanced" toggle.

## Step-by-Step Collision Anatomy

The existing obstruction panel should become a staged explanation:

1. "The algorithm tried to append `x`."
2. "It checked this suffix/prefix."
3. "It split the factor into two halves."
4. "It computed both Parikh vectors."
5. "The vectors match, so this is an Abelian square."
6. "The branch is rejected."

This would make backtracking understandable without requiring the learner to read the code.

## Terminology Tooltips

Terms that should have short tooltip definitions:

- Parikh vector
- Abelian square
- Abelian equivalence
- morphism
- uniform morphism
- cyclic permutation
- `g85`
- AA2F
- AA2FR
- forbid4
- unfavorable factor

Tooltips should use examples, not only formal definitions.

## Puzzle Ideas

### Find the Error

Show a word with one Abelian square and ask the student to identify the two adjacent halves.

### Fill the Blanks

Give a partial word with blanks and ask the student to complete it without creating an Abelian square.

### One Legal Extension

Generalize the current AA2FR Challenge mode to shorter beginner examples before the 40-letter challenge.

## What Not to Prioritize Yet

- Neural-network suggestions: useful only after collecting structured search data.
- Leaderboards: require backend validation.
- 3D visualizations: likely to be decorative unless tied to a clear mathematical coordinate system.
- Large modular code split: useful eventually, but the current project intentionally avoids dependencies and multi-file drift.

## Teaching Message

The strongest story is:

1. Abelian squares are about matching letter counts, not exact order.
2. Three letters fail very quickly under the full rule.
3. Four letters work because Keranen found a highly structured morphism.
4. Relaxed ternary settings such as AA2F/AA2FR are experimental search spaces, not the same theorem.
