# Development Roadmap

## Recently Completed

- **Stage 7: Scientific Validation & Replication Lab (Phase 1 & Rigorous Repairs)**
  - Migrated all formal verification modules (Module A: S3 Symmetry Control, Module B: h6 Bounded Audit, Module C: g3 Boundary Scan, Module D: Comparative Benchmark & L12 Seed Suite) into the high-speed Web Worker (`aa2fr-worker.js`).
  - **P0 6-Coordinate Parikh Repair & API Sync**: Upgraded Module B ($h_6$ bounded audit) to check all 6 coordinates ($a$–$f$), preventing false positive Abelian square detections. Fully synchronized Worker–UI payloads (`timeGenMs`, `timeScanMs`, `runs`, property naming conventions).
  - Implemented responsive cancellation controls with real-time worker progress bars and cooperative yielding (`isJobCancelled` checks).
  - Built the **Geometric Audit Area Map** visualization (canvas rendering the exact inspected right-triangle domain $\{ (i, K) \mid i + 2K \le N \}$, heat map densities for $K \le 5$, and explicit un-audited gray realms).
  - Built the **Interactive Boundary Zoom ($K=2..5$)** and **Sample Inspector Box** with clickable inspection buttons that open occurrence Parikh vectors in the Parikh Lens.
  - Upgraded S3 Symmetry Control with canonical `summarySignature` calculation ("6/6 matched") across search trees and algebraic set invariance verification.
  - Implemented the comparative **L12 Test Suite** across 10 frozen initial seeds, reporting total realized nodes across seeds, depth progression curves sampled every 1,000 nodes, and a stacked rejection breakdown (`FORBID4 only`, `square only`, `both` + `minSquareK`).
  - **Mathematical Rigor & Wording Precision**: Corrected description of "30 abelian square-free words of length 7" (30 distinct words in total across all 6 S3 alphabet permutations, corresponding to 5 canonical symmetry orbits), defined missing `G109_A` / `G109` constants in UI, and updated descriptions of `g85` and `g109` to accurately describe their role as uniform endomorphisms preserving abelian square-freedom over 4 letters.

- **Phase 6: AA2FR Experimental Research Platform (Ternary)**
  - Decoupled Search Engine into a Web Worker (`aa2fr-worker.js`) with high-speed $\mathcal{O}(1)$ Integer Parikh Packing and Prefix Sums.
  - Built the **Predictive Search Analyzer** ("Chess Engine" lookahead).
  - Built the **Search Pruning Heuristics Engine** (formerly Hypothesis Engine; automated statistical dead-end and trap detection without claiming proof).
  - Built **Module D: Fair Comparative Benchmark (`aa2f` vs. `aa2fr`)** for side-by-side controlled algorithmic evaluation under identical budgets ($1,000,000$ nodes).
  - Optimized V8 Garbage Collection in Web Worker by replacing string concatenation loops with single array slices and $O(1)$ dependent substring slicing.
  - Built the **Heuristics & Observation Log** (LocalStorage persistence for paths and heuristic rules).
  - Added Quick Start Guide modal and scientific methodology documentation.
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

**1. Strict Layered Architecture**
Search Engine must never make research decisions. Raw data is sacred.
`Experiment Manager -> Strategy Engine -> Search Engine -> Raw Events -> Analytics -> Research Database -> Hypothesis Engine -> Strategy Advisor`

**2. Five Research Modes**
- **Explorer**: Fast interactive exploration and visualization.
- **Experiment**: Repeatable experiments and strategy comparisons.
- **Validation**: Strict reproduction of published results with exact seeds and settings.
- **Discovery**: Long-running background data mining and neutral hypothesis generation.
- **Benchmark**: Automated algorithmic performance comparisons.

**3. Dynamic WorkerPool & Hierarchical Job Scheduler**
- User-selectable worker count (Auto, 2, 4, 6, 8, 12). Auto = `min(navigator.hardwareConcurrency - 1, 8)`.
- Hierarchical Job Queue: `Experiment -> Run -> Job -> Task` (e.g. AA2FR Benchmark -> Run 15 -> Seed abc -> Task DFS).

**4. Strategy Plugin System**
- Extract search logic into a modular `SearchStrategy` interface (`initialize`, `selectLetter`, `onDeadEnd`, `onBacktrack`, `onRecord`, `statistics`, **`explainDecision`**).
- `explainDecision` is crucial for explainability (e.g., "Selected 'b' | Reason: Lowest Parikh imbalance | Score: 0.031").

**5. Research Database & Advanced Benchmarks**
- Upgrade Notebook to a persistent relational-style **Research Database** (Experiments, Runs, Jobs, Observations, Trap motifs, Hypotheses).
- Version-controlled notebook entries (Status: Candidate, Confirmed, Rejected).
- Deep Benchmark Metrics: Average length, Median length, Max, Min, Std dev, Nodes/sec, Trap frequency, Peak memory, CPU time.

**6. Three-Tier AI Avoidance**
- When structural traps are detected, allow the researcher to select how the engine reacts without corrupting raw data:
  - **Observe**: Just log the trap (no effect on search).
  - **Assist**: Deprioritize the trap branch (test last).
  - **Avoid**: Prune the branch completely.

**7. Total Determinism**
- Store exact configurations for every run: Experiment ID, Random seed, Strategy version, Software version, Worker count, Browser, Timestamp.

### Phase 8: Mathematical Discovery Engine

The platform will transition to an automated mathematical assistant, utilizing careful scientific terminology.

**Neutral Automated Hypothesis Generation:**
- "Observed correlation: Suffix `abcbca` appeared 271 times. Dead-end probability 98%. Confidence: 0.97. Requires independent validation."
- "Candidate structural motif discovered: `abcaacbc...` (Occurrences: 143, Max length: 611)."

The engine will find statistical correlations between Parikh imbalances, structural traps, and branch viability, proposing candidates for the researcher.

### Phase 9: Morphism Discovery Lab

Move beyond searching the space of words to searching the space of **rules**.
- **Pipeline:** `Candidate Morphism Generator -> Test -> Analyze -> Rank -> Store`
- Automatically generate and test new n-uniform morphisms over ternary/quaternary alphabets to see if they avoid specific families of Abelian squares.
- Focus on extending Veikko Keränen's traditions of finding infinite words through morphism construction.

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
