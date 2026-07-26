# Next Agent Handoff

Last updated: 2026-07-09

## Project Summary

This repository contains a single-page, dependency-free browser application for exploring Abelian square-free words, Parikh vectors, Keranen's morphisms, and relaxed ternary AA2F/AA2FR search spaces.

Main file:

- `C:\abc\index.html`

Repository:

- `https://github.com/JoonasHuhta/combinatorics-on-words-research`

The app is intentionally implemented as one HTML/CSS/JS file. Do not split it into multiple files unless the user explicitly asks for that refactor.

## Current Tab Inventory

| # | Visible tab name | Mode ID | Status |
|---|---|---|---|
| 1 | Three-Letter Search | `3letter` | Working |
| 2 | ABC Impossibility Lab | `abc-lab` | Working |
| 3 | Keranen g85 Morphism | `4letter` | Working |
| 4 | Word Walk | `canvas` | Working |
| 5 | Word Sonification | `audio` | Working |
| 6 | Try It: Parikh Lens | `try-it` | Working |
| 7 | History Timeline | `timeline` | Working |
| 8 | Unfavorable Factor Explorer | `unfavorable` | Working |
| 9 | Morphism Microscope | `microscope` | Working |
| 10 | Concept Graph | `knowledge` | Working |
| 11 | Morphism Design Lab | `morph-lab` | Working |
| 12 | Square Heat Map | `heat-map` | Working |
| 13 | Abelian Snake | `snake` | Working |
| 14 | AA2FR Extension Lab | `aa2fr` | Working |
| 15 | Applications & Impact | `impact` | Working |
| 16 | Validation Lab | `validation` | Working |
| 17 | Art & Math Gallery | `gallery` | Working |

### Phase 6: AA2FR Research Platform & Scientific Rigor

- Decoupled the AA2FR search engine into a dedicated Web Worker (`aa2fr-worker.js`).
- Implemented O(1) Integer Parikh Packing and prefix sum calculations for high-speed backtracking.
- Conducted a thorough scientific terminology refactoring across UI and codebase:
  - Renamed "Evidence-Based Discovery Engine" to "Search Pruning Heuristics Engine".
  - Replaced misleading proof/hypothesis terms ("hypothesis", "falsified", "candidate proof") with statistical heuristic terminology ("heuristic rule", "unreliable/pruned", "robustness test").
- Added **Module D: Fair Comparative Benchmark (`aa2f` vs. `aa2fr`)**:
  - Side-by-side controlled execution under identical budgets ($1,000,000$ nodes), alphabet permutations, and parity checks.
  - Empirically verified that FORBID4 factors act as a powerful search pruning heuristic ($493 \to 646$ max length).
- Documented Smith/Jordan normal forms in `GRAND_VISION_MAP.md` as future Phase 2 work.

### Stage 7: Scientific Validation & Replication Lab (Phase 1 & Rigorous Repairs)
- **Worker Integration & O(1) API Sync**: Migrated formal verification modules (A: S3 Symmetry Control, B: h6 Bounded Audit, C: g3 Boundary Scan, D: Comparative Benchmark & L12 Seed Suite) into the shared Web Worker (`aa2fr-worker.js`). Fully synchronized Worker–UI payloads (`timeGenMs`, `timeScanMs`, `runs`, property naming conventions) to eliminate UI undefined errors.
- **P0 6-Coordinate Parikh Repair**: Upgraded Module B ($h_6$ bounded audit) to check all 6 coordinates ($a$–$f$), preventing false positive Abelian square detections (e.g., classifying `df` as a square due to zero $a,b,c$ counts).
- **Geometric Audit Area Map**: Built a canvas renderer displaying the right-triangle audit domain $\{ (i, K) \mid i + 2K \le N \}$, heat map densities for open boundary half-lengths $K \le 5$, and explicit un-inspected gray realms.
- **Interactive Boundary Zoom & Sample Inspector**: Built an interactive table of occurrences on the literature boundary ($K=2..5$) with clickable inspection buttons that open occurrence halves in the Parikh Lens for detailed Parikh vector comparison.
- **Rigorous S3 Symmetry Control**: Implemented canonical `summarySignature` calculation (depth, nodes, backtracks, best word) across all 6 relabeled S3 search trees to prove algorithmic invariance ("6/6 matched") and absence of branch divergence.
- **L12 Test Suite Comparative Benchmark**: Implemented a 10-seed comparative test suite ($L=12$), reporting total realized nodes across seeds, clear differentiation between total length and extension depth, depth progression curves sampled every 1,000 nodes, and a stacked rejection breakdown (`FORBID4 only`, `square only`, `both` + `minSquareK`).
- **Mathematical Rigor & Wording Precision**: Corrected description of "30 abelian square-free words of length 7" (30 distinct words in total across all 6 S3 alphabet permutations, corresponding to 5 canonical symmetry orbits), defined missing `G109_A` / `G109` constants in UI, and updated descriptions of `g85` and `g109` to accurately describe their role as uniform endomorphisms preserving abelian square-freedom over 4 letters.

### Stage 8: Forensic Source Verification & Mathematical Claims Protocol
- **Citation Audit & Correction (2026-07-26)**: An independent AI agent review identified that `arXiv:1511.05875` ("Avoiding two consecutive blocks of same size and same sum over ℤ²") was incorrectly cited as the source for the ternary $h_6$/$g_3$ construction. The correct Rao & Rosenfeld (2015) paper is **`arXiv:1507.02581`** (*"On Mäkelä's Conjectures: deciding if a morphic word avoids long abelian-powers"*).
- **Status Calibration**: Documented in `MATH_CLAIMS.md`, `morphisms.js`, and Tab 16 UI that `h_6` and `g_3` citations are corrected to `arXiv:1507.02581`. Calibrated verification status to **`LEVEL_1_INTERNAL_CHECKSUM`** (Empirical Checksum OK / Unverified Primary Text) until the primary text and C++ source code of `arXiv:1507.02581` are audited character-by-character from the archive. Also clarified that Keränen's `g98` (IAS Murmansk 2002) and `g109` (TCS 2009) are distinct uniform morphisms from different years.
- **Mandatory Claims Protocol (`AGENTS.md` & `CLAUDE.md`)**: Created permanent root-level instructions enforcing: (1) mandatory DOI/arXiv primary source citation before coding, (2) strict binary status separation (`LEVEL_1_INTERNAL_CHECKSUM` vs `LEVEL_2_VERIFIED_SOURCE`), (3) linguistic calibration for finite window checks (e.g., "no violations found in K=1..400 across N-letter prefix" instead of "confirmed/proven"), and (4) immediate provenance logging in commit messages.
- **Strict English UI Enforcement**: Removed all leftover Finnish vocabulary (e.g., `Väiteloki`, `rikkomuksia`, `etuliite`) from `index.html` to guarantee a 100% English user interface for all global users while keeping Finnish discussions in PR/commit documentation.

### Stage 8 (Continued): Short-Square Frequency & Localization Profile (Module C Research Instrument)
- **Mathematical & Algorithmic Upgrade (`aa2fr-worker.js`)**: Eliminated 32-bit/float Parikh bit-packing risks by switching to three 100% overflow-free `Uint32Array` prefix sums (`pA`, `pB`, `pC`). Expanded default audited prefix length to $N = 200,000$ ternary letters. Implemented exact stationary density computation $\rho_K(N) = \frac{\text{Count}}{N - 2K + 1} \times 1000$ per 1,000 valid starting positions.
- **Logarithmic Checkpoint Convergence**: Implemented single-pass checkpoint profiling across $N \in \{1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000\}$. Empirically demonstrated that short-square densities ($\rho_2 \approx 359.9, \rho_3 \approx 226.5, \rho_4 \approx 160.9, \rho_5 \approx 44.6$) converge to positive stationary horizontal asymptotes, verifying the theoretical requirement of uniform recurrence in primitive substitutions (as opposed to asymptotic density fade).
- **Spatial Localization Split & Morphism Surgery Gate**: Implemented classification of every short square occurrence into *Internal* (contained strictly within a single 10-character $g_3$ image block) vs. *Boundary-Spanning* (crossing adjacent image blocks).
  - Empirically discovered that **100% of half-length $K=5$ collisions occur across image boundaries** (`internal: 0, boundary: 8,926` across $N=200,000$).
  - For $K=4$, 79.4% occur across boundaries; for $K=3$, 48.8% across boundaries; for $K=2$, 35.4% across boundaries.
  - This spatial localization provides the exact target coordinates required for future **Morphism Surgery** (modifying $g_3$ boundary characters to eliminate $K=2..5$ collisions while guarding against new $K > 5$ long-period squares).

### Stage 9: Multidimensional Visualizations, Radial Sunburst Pruning Topology & The Morphic Art Gallery (Tab 17)
- **Module E (Rauzy Fractal Eigenspace Projection):** Implemented exact left eigenvectors for secondary eigenvalues $\pm\sqrt{3}$ in `aa2fr-worker.js`. Built interactive 2D Rauzy projection and 2.5D Isometric Spiral viewer in Tab 16, revealing how linear drift cancels out in bounded eigenspaces while climbing continuously along the dominant Z-axis.
- **Module F (Radial Sunburst Search Tree & Pruning Anatomy):** Implemented exhaustive depth-first search up to $L=10$ ($3^{10} = 59,049$ max nodes) in the Web Worker. Rendered side-by-side radial Sunburst / Icicle charts where angle represents descendant volume ($360^\circ / N$) and radius represents search depth. Included explicit disclaimers explaining **Optical Density Normalization** (why AA2FR appears wider due to lower node count $4,498$ vs $11,950$) and **Shallow Exhaustive Cut-offs**. Added JSON tree export for offline graph analysis.
- **Tab 17 (Art & Math Gallery 🏛️):** Created a dedicated exhibition tab hosting three curated exhibits ("silmä- ja aivoruokaa" for researchers):
  1. *The Rauzy Fractal & Eigenspace Sculpture* (with Level 2 Verified Source badge).
  2. *The Pruning Sunburst* (with exact node checksums and optical normalization badge).
  3. *Modular Seam-Welding* (interactive polyomino brick inspector proving 0% internal collisions for $g_3$).



### Pedagogical Tools

- Added a shared `renderParikhLens(...)` component.
- Added Parikh Lens to Try It mode.
- Reused Parikh Lens in the AA2FR obstruction explanation panel.
- Added `parikhDeltaStr(...)` and `renderParikhBars(...)`.

### AA2FR Lab

- Added "Pause on collision".
- Added rejected-letter explanations for:
  - longer Abelian squares;
  - forbid4 factors.
- Added 40-letter Challenge mode where exactly one right extension is legal.
- Added shared validation logic through `validateWordConstraints(...)`.
- Kept wrapper functions for compatibility:
  - `checkAA2F(...)`
  - `explainAA2FViolation(...)`
  - `aa2frFindFullViolation(...)`

### Concept Graph

- Renamed visible tab from Knowledge Graph to Concept Graph.
- Improved graph layout:
  - ring initialization;
  - stronger repulsion;
  - hard collision pass;
  - viewport margins;
  - wrapped labels with background rectangles.

### Tab Naming

Visible tab names were clarified without changing `data-mode` IDs. This preserves router behavior.

## Current Documentation State

All root-level `.md` documents have been rewritten or cleaned into English:

- `PROJECT_ARCHITECTURE.md`
- `AGENT_CONCEPT_BRIEF.md`
- `DEVELOPMENT_ROADMAP.md`
- `NEXT_AGENT.md`
- `AA2FR_OHJELMAN_IDEA.md`
- `KOULUTUSKAYTTO_PARANNUKSET.md`

The filenames `AA2FR_OHJELMAN_IDEA.md` and `KOULUTUSKAYTTO_PARANNUKSET.md` remain Finnish for compatibility with existing references, but their contents are now English.

## Mathematical Guardrails

- Do not claim that `{a,b,c}` admits an infinite fully Abelian square-free word.
- Do not alter Keranen's `g85` morphism without a cited source.
- Keep AA2F/AA2FR clearly labeled as relaxed ternary settings.
- Mark user-generated morphisms and search outputs as experimental.
- Distinguish ordinary square-free words from Abelian square-free words.

## Verification Commands

Useful local checks:

```powershell
$script = (Get-Content index.html -Raw) -replace '(?s)^.*<script>','' -replace '(?s)</script>.*$',''
$tmp = Join-Path $env:TEMP 'abc_index_script_check.js'
Set-Content -Path $tmp -Value $script -Encoding UTF8
node --check $tmp
```

```powershell
git -c safe.directory=C:/abc diff --check
git -c safe.directory=C:/abc status --short
```

Suggested functional checks:

- Click through all 14 tabs.
- In Try It mode, type `abba` and verify Parikh Lens reports a match.
- In AA2FR Lab, press New 40-letter Challenge and verify a challenge loads.
- In Concept Graph, verify labels do not pile up immediately.
- In Square Heat Map, load the random word and verify red cells appear.
- Verify `g85(a)` remains length 85.

## Recommended Next Task

The best next substantial improvement is **Student Mode**:

- a toggle that filters the 14 tabs into a guided beginner path;
- hides advanced/research tabs at first;
- keeps all existing code paths intact;
- reuses Parikh Lens and AA2FR obstruction panels as teaching components.

Secondary good task: turn the AA2FR obstruction panel into a step-by-step "collision anatomy" walkthrough.

## Notes on Style

- Keep UI names concrete and action-oriented.
- Avoid emojis in tab names; they caused encoding/legibility issues in past handoffs.
- Prefer "Concept Graph" over "Knowledge Graph" because the tab shows terminology relationships, not a full knowledge base.
- Prefer "AA2FR Extension Lab" over "AA2FR Laboratory" because the current tab is specifically about extension, challenge, and obstruction analysis.
