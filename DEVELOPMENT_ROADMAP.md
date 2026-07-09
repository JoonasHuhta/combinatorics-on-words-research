# Development Roadmap

## Recently Completed

- Renamed the visible tabs so they better match the actual workflows.
- Added Parikh Lens to Try It mode.
- Reused Parikh Lens inside the AA2FR obstruction explanation panel.
- Added AA2FR "pause on collision" explanations.
- Added 40-letter AA2FR Challenge mode with single legal right-extension puzzles.
- Added a shared AA2F/AA2FR validation layer for full, prefix, and suffix scans.
- Improved Concept Graph layout with ring initialization, collision separation, margins, and wrapped labels.
- Added Abelian Snake as a playable tab.
- Completed Square Heat Map with hover inspection.
- Added Morphism Design Lab for experimental four-letter morphisms.

## Highest-Value Next Improvements

### 1. Student Mode

Create a learning path that reduces the 14-tab interface for first-time users.

Suggested stages:

1. Parikh vectors and adjacent block comparison.
2. Abelian squares and the length-8 wall over `{a,b,c}`.
3. Keranen's four-letter `g85` construction.
4. Heat maps and near misses.
5. AA2F/AA2FR relaxed ternary experiments.

This should be implemented as a UI filter, not as separate pages.

### 2. Step-by-Step Collision Anatomy

Extend the existing AA2FR obstruction panel into a staged explanation:

1. The algorithm appends a letter.
2. It selects candidate adjacent halves.
3. It computes both Parikh vectors.
4. It detects equality or a forbidden factor.
5. It rejects the extension and backtracks.

The same staged component could later be used in Try It and Abelian Snake.

### 3. Research Notebook

Add localStorage-based persistence for experiments:

- saved words,
- saved morphism definitions,
- AA2FR challenge attempts,
- best Snake words,
- heat-map snapshots or parameters.

Keep it local and dependency-free.

### 4. Constraint-Filling Mode

Add a puzzle/research mode where users fill blanks in a word pattern:

```text
a b _ c _ _ a ...
```

The app should validate partial assignments and explain which blank choices cause an Abelian square or AA2FR forbidden factor.

## Research-Oriented Extensions

### Evolution Lab

Implement a Web Worker based search for long AA2F/AA2FR words or candidate morphisms. The worker should report:

- generation/iteration,
- best word or morphism,
- longest valid prefix,
- failure reason,
- common fatal factors.

This should be presented as a search algorithm, not as a black-box "AI" result.

### Factor Statistics

For AA2F/AA2FR searches, record which short factors commonly lead to dead ends. This would support both the educational Challenge mode and real research exploration.

### Heat Map Improvements

- Add a side-by-side view comparing `g85`, a random word, and a user word.
- Add filtering by half-length ranges.
- Add export of red/yellow cell coordinates.

## Lower Priority / Caution

- 3D word-space visualizations may be attractive, but they risk becoming decorative unless backed by meaningful coordinates.
- TensorFlow.js or neural-network suggestions should wait until the app has collected enough structured search data.
- Leaderboards require backend validation and should not be added to the current static app without a separate design.

## Verification Ideas

Before accepting future changes:

- Confirm that ABC Impossibility Lab has zero valid length-8 extensions.
- Confirm that incremental appends use suffix checks, while full-word inspection scans all factors.
- Confirm that `g85(a)` has length 85.
- Confirm that AA2FR Challenge can find a 40-letter challenge.
- Confirm that all tab buttons still open the intended view.
- Run `node --check` on the extracted script section.
- Run `git diff --check`.
