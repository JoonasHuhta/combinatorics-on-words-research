# Development Roadmap

## Completed Improvements

- **[DONE] Morphism Microscope:** Added as Tab 9. Allows inspection of g85 and g98.
- **[DONE] Near-Miss Explorer:** Added as Tab 12 (Heat Map). Visualizes Abelian squares and near misses.
- **[DONE] Keranen-Style Walks:** Added as Tab 4 (2D Walk). 
- **[DONE] Repair text encoding:** Mojibake fixed across tabs.

## Immediate Improvements

1. Strengthen ABC Laboratory

The new `ABC Laboratory` mode should become the central explanation of the 3-letter impossibility result. Useful additions:

- a heatmap of rejected extensions by word length,
- a toggle between "all squares" and "only suffix checked after append",
- a compact proof panel explaining why length 8 is decisive,
- export of survivor and failure lists as plain text.

2. Add a Parikh Vector Plot

Represent cumulative letter counts as a path:

- for `{a,b,c}`, use a triangular or 3D simplex projection,
- for `{a,b,c,d}`, use paired projections or a diamond-lattice walk,
- highlight repeated adjacent frequency patterns.

## Research-Focused Extensions

1. [PLANNED] Gamification: Matopeli (Abelian Snake)

Turn the Abelian Square-Free construction into a Snake game. Player steers a snake to eat letters (a, b, c, d) that do NOT form Abelian squares when appended to the body.

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
