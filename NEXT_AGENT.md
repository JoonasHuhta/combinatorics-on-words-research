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
- **Forensic Primary Source Discovery (Level 2 Source Verified)**: Extracted and examined the C++ verification source code attached to Theorem 6 in Rao & Rosenfeld (2015, `arXiv:1511.05875`). Confirmed that both `h6` (`firstmorphism`: `a:ace, b:adf, c:bdf, d:bdc, e:afe, f:bce`) and `g3` (`vector<string> h`: `h[0]=bbbaabaaac, h[3]=ccccccccaa...`) appear verbatim in the original 2015 arXiv C++ verification package!
- **Resolved Title/Citation Confusion**: Documented in `MATH_CLAIMS.md`, `morphisms.js`, and Tab 16 UI that previous citations to SIAM J. Discrete Math 2018 were a title misattribution; the correct primary source for these exact ternary/hex morphisms is arXiv:1511.05875 Theorem 6 and its C++ code. Elevated `h6` and `g3` verification status from Level 1 Empirical to **`LEVEL_2_VERIFIED_SOURCE`** across the entire repository.
- **Mandatory Claims Protocol (`AGENTS.md` & `CLAUDE.md`)**: Created permanent root-level instructions enforcing: (1) mandatory DOI/arXiv primary source citation before coding, (2) strict binary status separation (`LEVEL_1_INTERNAL_CHECKSUM` vs `LEVEL_2_VERIFIED_SOURCE`), (3) linguistic calibration for finite window checks (e.g., "no violations found in K=1..400 across N-letter prefix" instead of "confirmed/proven"), and (4) immediate provenance logging in commit messages.
- **Strict English UI Enforcement**: Removed all leftover Finnish vocabulary (e.g., `Väiteloki`, `rikkomuksia`, `etuliite`) from `index.html` to guarantee a 100% English user interface for all global users while keeping Finnish discussions in PR/commit documentation.


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
