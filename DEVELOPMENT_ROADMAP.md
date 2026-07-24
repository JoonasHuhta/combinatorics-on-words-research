# Development Roadmap

## Recently Completed

- **Phase 6: AA2FR Experimental Research Platform (Ternary)**
  - Decoupled Search Engine into a Web Worker (`aa2fr-worker.js`).
  - Implemented $\mathcal{O}(1)$ Integer Parikh Packing and Prefix Sums.
  - Built the **Predictive Search Analyzer** ("Chess Engine" lookahead).
  - Built the **Hypothesis Engine** (Automated statistical trap detection).
  - Built the **Research Notebook** (LocalStorage persistence for paths and traps).
  - Added Quick Start Guide modal.
- Renamed the visible tabs so they better match the actual workflows.
- Added Parikh Lens to Try It mode.
- Reused Parikh Lens inside the AA2FR obstruction explanation panel.
- Added 40-letter AA2FR Challenge mode with single legal right-extension puzzles.
- Improved Concept Graph layout with ring initialization, collision separation.
- Added Abelian Snake as a playable tab.
- Completed Square Heat Map with hover inspection.
- Added Morphism Design Lab for experimental four-letter morphisms.

## Highest-Value Next Improvements

### 1. Strategy Comparison Matrix (Phase 7)

Now that the Research Notebook and Worker Engine are active, we should implement alternative search algorithms and compare them side-by-side:
- **Depth First Search (DFS)** (Current)
- **Best First Search (Priority Queue)**
- **Beam Search**
- **Gavrilenko Parikh Balance Heuristic**

The Research Notebook should be able to graph the performance (Max Length vs Time) of these different strategies for a given seed word.

### 2. Distributed Web Worker Search

We can spawn multiple `aa2fr-worker.js` instances, assign them different branches (e.g., `a...`, `b...`, `c...`), and have them report back to the main thread simultaneously. This will drastically speed up exploration and allow for deeper Hypothesis generation.

### 3. Student Mode

Create a learning path that reduces the 14-tab interface for first-time users.
Suggested stages:
1. Parikh vectors and adjacent block comparison.
2. Abelian squares and the length-8 wall over `{a,b,c}`.
3. Keranen's four-letter `g85` construction.
4. Heat maps and near misses.
5. AA2F/AA2FR relaxed ternary experiments.

This should be implemented as a UI filter, not as separate pages.

### 4. Constraint-Filling Mode

Add a puzzle/research mode where users fill blanks in a word pattern:
```text
a b _ c _ _ a ...
```
The app should validate partial assignments and explain which blank choices cause an Abelian square or AA2FR forbidden factor.

## Research-Oriented Extensions

### Machine Learning / Motif Extrapolation
Now that the Hypothesis Engine catches structural traps (e.g., `bcca` causes 50x expected dead ends), we can implement a simple Markov Chain or Neural Network inside TensorFlow.js that predicts the "Trap Probability" of a sequence before the DFS even explores it.

### Heat Map Improvements
- Add a side-by-side view comparing `g85`, a random word, and a user word.
- Add filtering by half-length ranges.
- Add export of red/yellow cell coordinates.

## Lower Priority / Caution
- 3D word-space visualizations may be attractive, but they risk becoming decorative unless backed by meaningful coordinates.
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
