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

### Phase 7: Scientific Research Architecture

Transform the application from an interactive visualizer into a reliable, layered scientific instrument.

**1. Layered Architecture & Research Modes**
Decouple Search Engine from Research Decisions:
`Experiment Manager -> Strategy Engine -> Search Engine -> Validation Engine -> Analytics Engine -> Research Notebook`

Introduce Application-level **Research Modes**:
- **Explorer**: Fast interactive exploration and visualization.
- **Experiment**: Repeatable experiments and strategy comparisons.
- **Discovery**: Long-running background data mining and hypothesis generation.
- **Benchmark**: Automated algorithmic performance comparisons.

**2. Distributed Worker Pool & Job Scheduler**
- Replace static workers with a dynamic `WorkerPool` using `navigator.hardwareConcurrency`.
- Implement a **Job Scheduler** and **Job Queue** to keep all CPU cores at 100% utilization during experiments (e.g., distributing random seeds across workers).

**3. Strategy Engine Plugin System**
- Extract search logic into a modular `SearchStrategy` interface (`initialize`, `selectLetter`, `onDeadEnd`, `onBacktrack`, `statistics`).
- Implement strategies: **DFS**, **Priority Queue**, **Beam Search**, **Adaptive**, **Monte Carlo**, **Hybrid**.

**4. Experiment Scheduler & Strategy Benchmark**
- UI to define large-scale experiments (e.g., 500 runs, compare DFS vs Priority Queue, random seeds).
- Automatically generate comparative **Strategy Benchmark** reports (Average Length, Max Length, Dead Ends, Runtime).

**5. Advanced Research Notebook & Database**
- Upgrade Notebook to a persistent experiment database.
- Store detailed experiment metadata, allow JSON/CSV export, and enable cross-experiment comparisons.

**6. Three-Tier AI Avoidance**
- When structural traps are detected, allow the researcher to select how the engine reacts:
  - **Observe**: Just log the trap (no effect on search).
  - **Assist**: Deprioritize the trap branch (test last).
  - **Avoid**: Prune the branch completely.

### Phase 8: Mathematical Discovery Engine

The ultimate goal of the platform: transition from *finding long words* to *discovering new mathematical phenomena*.

**Automated Hypothesis Generation:**
- "Suffix `abcbca` appeared 271 times. Dead-end probability 98%. Hypothesis: Structural attractor. Confidence: 0.97."
- "Parikh imbalance 0.083 always preceded long successful branches. Confidence: 0.92."
- "New structural family discovered: `abcaacbc...` (Occurrences: 143, Max length: 611). Suggested classification: Candidate structural motif."

The engine will act as a mathematical research assistant, finding statistical correlations between Parikh imbalances, structural traps, and branch viability.

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
