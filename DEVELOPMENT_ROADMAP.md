# Development Roadmap

## Immediate Improvements

1. Repair text encoding

Some older imported files and labels show mojibake such as `KerÃ¤nen`. The app should use UTF-8 consistently, or use ASCII labels where mathematical notation is not essential.

2. Strengthen ABC Laboratory

The new `ABC Laboratory` mode should become the central explanation of the 3-letter impossibility result. Useful additions:

- a heatmap of rejected extensions by word length,
- a toggle between "all squares" and "only suffix checked after append",
- a compact proof panel explaining why length 8 is decisive,
- export of survivor and failure lists as plain text.

3. Add a Parikh Vector Plot

Represent cumulative letter counts as a path:

- for `{a,b,c}`, use a triangular or 3D simplex projection,
- for `{a,b,c,d}`, use paired projections or a diamond-lattice walk,
- highlight repeated adjacent frequency patterns.

4. Add Morphism Microscope

The `g85` mode should allow inspection of:

- `g85(a)`, `g85(b)`, `g85(c)`, `g85(d)`,
- letter counts inside each 85-letter image,
- cyclic permutation relationship,
- block boundaries after each iteration.

5. Add Keranen-Style Walks

The saved source material references 2D walks such as:

- `a = left`,
- `b = right`,
- `c = down`,
- `d = up`.

This should become a dedicated canvas mode because it connects the app directly to Keranen's "Structures, Graphics and Music" approach.

## Research-Focused Extensions

## Near-Miss Explorer

Search for adjacent blocks whose Parikh vectors almost match. This is useful because near misses show where the word nearly fails and may reveal structural pressure inside long valid words.

Suggested output:

- position,
- half length,
- vector difference,
- highlighted word segment,
- local visual zoom.

## Forbidden or Unfavourable Factors

Keranen's later material studies factors that make extension difficult. Add a mode where a user can paste a word and ask:

- can it be extended left?
- can it be extended right?
- which letters fail and why?
- what is the shortest forced Abelian square?

## Ternary Relaxed Case

Some Keranen material studies ternary words where period-1 Abelian squares may be allowed while longer Abelian squares are avoided. This is not the same as the 1992 four-letter theorem. Keep this distinction explicit in the UI.

## Agent Rules

Future agents should preserve these boundaries:

- Do not imply that 3 letters can produce an infinite fully Abelian square-free word.
- Do not replace Keranen's `g85` word unless citing and documenting a different morphism.
- Do not mix ordinary square-free words with Abelian square-free words without explaining the difference.
- Keep experimental generated examples separate from proven constructions.
- Prefer small, inspectable algorithms over opaque visual effects.

## Verification Ideas

Before accepting future changes:

- Confirm that `ABC Laboratory` reports zero valid length-8 words.
- Confirm that appending a letter only needs suffix checking during incremental construction.
- Confirm that full selected-word inspection scans all factors, not only suffixes.
- Confirm that `g85(a)` has length 85.
- Confirm that `g85(b)`, `g85(c)`, and `g85(d)` are cyclic permutations.
