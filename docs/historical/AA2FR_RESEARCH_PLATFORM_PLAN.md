# AA2FR Experimental Mathematics Laboratory

## Research Platform Architecture & Development Plan

> **Mission**: Transform the AA2FR Extension Lab into an experimental mathematics laboratory whose primary purpose is to generate reproducible evidence, discover structural regularities, formulate new hypotheses, and support the eventual development of a mathematical theory of relaxed Abelian square avoidance over ternary alphabets.

> **Design Principle**: The purpose of every feature is to increase mathematical insight rather than visual complexity.

---

## Table of Contents

1. [Mathematical Status Hierarchy](#1-mathematical-status-hierarchy)
2. [Research Integrity](#2-research-integrity)
3. [Current State Analysis](#3-current-state-analysis)
4. [Source Material Inventory](#4-source-material-inventory)
5. [Research Questions (RQ0–RQ8)](#5-research-questions-rq0rq8)
6. [Platform Architecture](#6-platform-architecture)
7. [Core Modules](#7-core-modules)
8. [Performance Layer](#8-performance-layer)
9. [Implementation Phases](#9-implementation-phases)
10. [Verification Plan](#10-verification-plan)
11. [Open Questions](#11-open-questions)

---

## 1. Mathematical Status Hierarchy

Every claim, feature, and result in the platform must be classified:

### Level A — Established Mathematics (Peer-Reviewed Literature)

| Fact | Source |
|------|--------|
| Abelian squares are avoidable on 4 letters | Keränen 1992 (ICALP) |
| Every ternary word of length ≥ 8 contains an abelian square | Pleasants 1970 |
| The g85 endomorphism preserves a-2-freeness | Keränen 1992 |
| Parikh vector equivalence ⟺ abelian equivalence | Definition |
| A "powerful" a-2-free substitution over 4 letters exists | Keränen 2009 (TCS) |
| Carpi's test validates morphism a-2-freeness | Carpi 1993 |

### Level B — Experimental Observations (Reproducible but Unproven)

| Observation | Source |
|-------------|--------|
| Branching factor tends to collapse at certain word lengths | Computational experiments |
| Certain short factors ("traps") kill extensions in both directions | Keränen 2010 (MJ) |
| The forbid4 set {baac, caab, abbc, cbba, accb, bcca} enables longer ternary extensions | Computational experiments |
| uv²X and uxv²X structural near-misses appear at specific positions | Screenshots in latest/ |
| Integer Parikh packing (a:0, b:1, c:65536) enables O(1) abelian checks | CUDA Prompts document |
| 6-phase rotational search bypasses local traps | CUDA Prompts document |

### REJECTED / UNVERIFIED SECONDARY CLAIMS (Pending Primary Audit)

| Claim / Observation | Status / Reason |
|---------------------|-----------------|
| Long AA2F ternary words exist (record: 25,379 letters) | **REJECTED / UNVERIFIED**: Mentioned on Keränen's webpage (algebra.fi/keranen/...), but primary Gavrilenko 2017 thesis/paper is not available or audited in `latest/`. |
| Parikh-balanced words tend to extend further (Gavrilenko heuristic) | **REJECTED / UNVERIFIED**: Secondary claim lacking primary source verification in `latest/`. |

### Level C — Research Hypotheses (To Be Tested)

| Hypothesis | Status |
|------------|--------|
| Parikh imbalance predicts future dead ends | Untested |
| Adaptive letter ordering outperforms fixed ordering | Untested |
| Successful search paths cluster into distinct families | Untested |
| Obstruction types can be automatically classified into a small taxonomy | Untested |
| AA2FR admits a mathematical characterization beyond computation | Open conjecture |
| Trap motifs have a finite, classifiable structure | Untested |
| Enhanced Carpi's test (1–2 blocks) is sufficient for most morphisms | Keränen 2005 conjecture |

> IMPORTANT: Every experimental conclusion produced by the platform must clearly indicate its mathematical status level (A, B, or C). The platform must never present Level B or C results as established mathematics.

---

## 2. Research Integrity

Every experimental conclusion must satisfy:

| Principle | Implementation |
|-----------|---------------|
| **Reproducible** | Every experiment stores its complete configuration (seed, strategy, mode, parameters) so it can be re-run identically |
| **Statistically supported** | No claim from fewer than 30 runs; confidence intervals required |
| **Independent of random seed** | Results must hold across multiple seeds, not just cherry-picked examples |
| **Conjecture ≠ Theorem** | UI clearly labels Level B/C findings with appropriate disclaimers |
| **Raw data preserved** | All search datasets exportable as JSON for external analysis |
| **Deterministic replay** | Any search can be replayed step-by-step to verify correctness |

---

## 3. Current State Analysis

### What Exists (in index.html, lines ~3268–3653)

| Component | Status | Assessment |
|-----------|--------|------------|
| DFS backtracking search (aa2frStep, aa2frLoop) | Working | Correct but unoptimized, runs on main thread |
| AA2F/AA2FR mode selection | Working | forbid4 = {baac, caab, abbc, cbba, accb, bcca} |
| Left/right extension direction | Working | — |
| 40-letter Challenge mode | Working | Finds windows with exactly 1 legal extension |
| Obstruction panel (renderParikhLens) | Working | Shows final result, not step-by-step |
| "Pause on collision" | Working | — |
| Shared validation (validateWordConstraints) | Working | Supports full/prefix/suffix scan modes |
| Statistics (length, max, nodes, backtracks) | Working | Basic counters only |

### Key Problems

| Problem | Impact | Root Cause |
|---------|--------|------------|
| **Main thread execution** | UI freezes during long searches | No Web Worker |
| **O(N²) Parikh computation** | Slow for long words | getParikh(slice(...)) recomputes from scratch every time |
| **GC overhead** | Performance degrades over time | New objects created every validation call |
| **Fixed a→b→c ordering** | Misses longer words | No heuristic guidance |
| **No data collection** | Cannot answer research questions | No analytics infrastructure |
| **No experiment batching** | Cannot do statistical analysis | Single-run only |
| **No persistence** | Progress lost on refresh | No localStorage/export |

---

## 4. Source Material Inventory

### latest/ — Research Papers and Data

| File | Type | Key Contribution to Platform |
|------|------|------------------------------|
| 11_VK_ICALP1992_...pdf | Keränen's foundational paper | Level A mathematical foundation; g85 morphism |
| 33_VK_TCS_...pdf | "Powerful" substitution paper | New morphism structures for testing |
| 37_VK_TheMathematicaJournal_2010.pdf | Unfavorable factors / trap analysis | Trap factor database; pruning strategies |
| 32_VK_CADE2007_...pdf | Mathematica in pattern avoidance | Computational verification techniques |
| 5_Letters_Pleasants_1969.pdf | 3-letter impossibility proof | Theoretical boundary; demo material |
| Aleksandr Gavrilenko - main.pdf | Parallel Rust engine + Parikh heuristic | Priority queue BFS; Score = L² - U³·27/(8L); record 25,379-letter word |
| Conjecture_EnhancedCarpi'sTest.pdf | 1/2-block morphism verification | Faster morphism testing |
| ConstructingAbelianSquare-Free...pdf | Mattila's polynomial inequality method | Algebraic construction alternative |
| Reconstructing Combinatorics and CUDA Prompts.pdf | GPU techniques | Integer packing, base-3 encoding, 6-phase rotation, stochastic DFS |
| Screenshots (3× JPG) | Visual pattern evidence | uv²X, uxv²X near-miss patterns in long words |

### teoria/ — Theoretical Notes

| Content | Relevance |
|---------|-----------|
| Project memo (Keränen history, Thue→Erdős→Pleasants→Keränen) | Historical context, visualization strategies |
| New ideas and prompts | Blueprint for backtracking animation, L-system fractal, knowledge graph |
| Extended theory parts I/II/III | a-2-free properties, endomorphism structures, DT0L languages |
| Research compilation | Career summary, publication list, growth rates |

### nettisivu/ — Web Archives

| Content | Relevance |
|---------|-----------|
| Bilateral extension data (length 40, extension 46) | Pre-computed extension datasets |
| Graphics of a-2-free words over 4 letters | Visual reference for morphism structure |
| Trap factor illustrations | Unfavorable word analysis |
| Near-miss analysis (UXV vs UV patterns) | Fragility analysis in long words |
| Mathematica notebook exports (g98, endomorphism search) | Algorithm reference implementations |

---

## 5. Research Questions (RQ0–RQ8)

---

### RQ0: Can we verify that the search engine is mathematically correct?

> This is the foundation. All other research depends on it.

#### Goals
- Verify the Parikh vector computation is correct for all inputs
- Verify the forbid4 check catches exactly the 6 forbidden factors
- Verify the abelian square detector finds all squares with half-length ≥ 2
- Verify the prefix/suffix scan optimization produces identical results to full scan
- Enable deterministic replay of any search

#### Algorithms
- **Exhaustive brute-force comparator**: For words up to length 20, run both the optimized validator and a naive O(N³) brute-force checker. Every result must match.
- **Deterministic replay engine**: Record the random seed and every decision point. Replay must produce identical state at every step.

#### Metrics
- Validation agreement rate (must be 100%)
- Replay fidelity (bit-exact match at every step)

#### Experiments
- Generate all ternary words of length 8–15 and verify each contains an abelian square (Pleasants confirmation)
- Validate the 15,796-letter preset word is genuinely AA2F (full scan)
- Validate the 25,379-letter Gavrilenko word against the same validator

---

### RQ1: Short-square frequency and localization profile in $g_3(h_6^\omega(a))$

> **The Direct Mäkelä Attack & Localization Profile**: Instead of searching for an asymptotic "fade-out" to zero, this investigation measures the exact positive stationary frequency level that boundary squares ($K=2..5$) converge to, and localizes their generation mechanisms.

#### What We Want to Understand
In a fixed morphic word generated by a primitive substitution like $g_3(h_6^\omega(a))$, any finite factor that appears once repeats uniformly and regularly (by syndeticity / uniform recurrence). Therefore, existing short squares cannot genuinely "fade to zero" as prefix length $N$ grows; rather, their density converges to a stationary positive constant.
- **Stationary Frequency Profile**: At what positive frequency density $\rho_K$ does each boundary period $K \in \{2, 3, 4, 5\}$ stabilize across massive prefixes?
- **Localization Profile**: Are these boundary collisions generated **internally** within single 10-letter $g_3$ images, or do they arise strictly across **image boundaries** (joining adjacent $g_3$ blocks)? This spatial breakdown is the foundational prerequisite for any targeted "morphism surgery" or pruning sitemap.
- **Morphism Surgery Research Gate**: Modifying a $g_3$ image or removing letters to eliminate $K=2..5$ collisions can inadvertently create NEW abelian squares, including long ones ($K > 5$). Therefore, K>5 freedom is not preserved automatically; every candidate $g_3^*$ must be subjected to full boundary and unbounded verification or explicitly labeled an "empirical candidate".

#### Algorithms & Data Structures
- **Single-Pass Checkpoint Scanner**: Scans a single massive prefix ($N$) once from left to right, recording occurrence histograms at logarithmic checkpoints during the same continuous run.
- **Overflow-Free O(1) Prefix-Sum Turbo**: To support multimillion-letter scans without 32-bit integer overflow or Parikh bit-packing collisions, the engine maintains three separate `Uint32Array` (or `Float64Array`) cumulative sum arrays (`prefixA`, `prefixB`, `prefixC`). Comparing two adjacent $K$-length windows takes exactly three $O(1)$ subtractions and equality checks.
- **Image Boundary vs. Internal Classifier**: For every square found, checks whether the span $[i, i+2K)$ falls entirely within a single 10-char $g_3$ image block ($\lfloor i/10 \rfloor === \lfloor (i+2K-1)/10 \rfloor$) or spans across a block boundary.
- **Period K=1 Wording Calibration**: Clearly distinguishes between $K=1$ (trivial period-1 squares like `aa` or `bb`, which are allowed under AA2F and Mäkelä's question) and $K \in \{2, 3, 4, 5\}$ (the target boundary realm).

#### Metrics
- **Exact Stationary Density** $\rho_K(N) = \frac{\text{count of abelian squares of half-length } K \text{ in prefix } N}{N - 2K + 1}$ (using the exact denominator of possible starting positions).
- **Internal vs. Boundary Split**: Percentage of occurrences generated internally vs. across boundaries.

#### Visualizations
- **Stationary Convergence Log-Log Plot**: Prefix length $N$ on x-axis vs exact density $\rho_K(N)$ on y-axis, illustrating convergence to positive horizontal asymptotes for $K=2..5$.
- **Localization Split Bar Chart**: Showing internal vs. boundary breakdown for each half-length.

#### Source Material
- Rao & Rosenfeld, *"Avoiding two consecutive blocks of same size and same sum over $\mathbb{Z}^2$"* (arXiv:1511.05875, 2015; publication venue recorded in `MATH_CLAIMS.md` #6): $h_6^\omega(a)$ abelian-square-free, and $g_3(h_6^\omega(a))$ avoids $K > 5$. **Theorem numbers deliberately omitted** — the "Theorem 5" / "Theorem 11" numbering used in earlier drafts of this repository has never been checked against the published PDF and is not a citable claim (see `AGENTS.md` rule 1). Note `arXiv:1507.02581` is a *different* Rao & Rosenfeld paper (*"Avoidability of long $k$-abelian repetitions"*) and is not a source for this construction.
- Keränen TCS 2009 / MJ 2010: Morphism substitutions and Carpi validation protocols.

---

### RQ2: Why do AA2FR words eventually become difficult to extend?

#### What We Want to Understand
At what point and why does the search space narrow? Is it gradual or sudden? Is there a critical length?

#### Algorithms
- **Branching Factor Tracker**: At each extension step, count how many of {a, b, c} are legal. Store as time series.
- **Horizon Scanner**: Before choosing a letter, look ahead k steps for each option and measure subtree depth. Reveals "seemingly open but doomed" situations.

#### Metrics
- B(n) = branching factor at word length n (averaged over last 100 steps)
- D_max(n) = maximum subtree depth from horizon scan
- **Compression ratio** = backtracks in last 100 steps / successful extensions in last 100 steps

#### Visualizations
- **Branching Factor Timeline**: Line chart, x = word length, y = B(n). Collapse toward 1.0 predicts approaching dead end.
- **Pressure Gradient**: Color map on each letter of the word: green = 3 options at that point, yellow = 2, red = 1 (forced choice).

#### Experiments
- Run 100 searches from different seeds. Plot average B(n) → find critical length where search space systematically narrows.
- Compare AA2F vs AA2FR modes: how much earlier does forbid4 cause narrowing?

---

### RQ3: Which local structures correlate most strongly with dead ends?

#### What We Want to Understand
Can the last 5–15 letters of a word predict an upcoming dead end?

#### Algorithms
- **Dead-End Suffix Collector**: At every terminal dead end, save the last k letters (k = 5, 8, 10, 12, 15).
- **Suffix Frequency Analyzer**: Count n-gram frequencies in dead ends vs. successful extensions.
- **Discriminant Factor Finder**: Find suffixes where P(dead end | suffix) ≥ 0.9.

#### Metrics
- **Danger Score** D(s) = P(dead end | s) / P(success | s) for each n-gram
- **Top-k dangerous factors**: Auto-maintained ranking

#### Visualizations
- **Danger Factor Leaderboard**: Real-time ranked list of the 20 most dangerous suffixes with their D(s) values.
- **Suffix Heat Map**: 2D grid of suffix n-grams, color-coded by dead-end probability.

#### Data Collection
- Every dead end logged: {depth, suffix_8, suffix_15, parikh_state, branching_history_last_10}
- Accumulates naturally during searches → long-term research data

---

### RQ4: Which Parikh imbalance predicts future collisions?

#### What We Want to Understand
Gavrilenko's heuristic assumes balanced words are safer. Can we prove this empirically?

#### Algorithms
- **Parikh Balance Tracker**: At every step, compute deviation from ideal (1/3, 1/3, 1/3):
  U(w) = sqrt(sum over x in {a,b,c} of ((|w|_x / |w|) - 1/3)²)
- **Predictive Correlation Engine**: Compute correlation between U(w) and backtrack density in the next k steps.

#### Metrics
- U(n) = Parikh imbalance at length n (real-time)
- ρ(U, backtrack rate) = Pearson correlation coefficient
- **Critical U***: Threshold beyond which backtrack density jumps significantly

#### Visualizations
- **Parikh Balance Evolution**: Three lines (one per letter) showing proportions over time, oscillating around 33.3%.
- **Parikh–Backtrack Scatter**: Each point = one step, x = U, y = backtrack density in next 50 steps.

#### Experiments
- Run identical searches with (A) fixed a→b→c ordering and (B) Gavrilenko's heuristic. Compare achieved lengths and U(n) curve shapes.
- Find U*: threshold after which search always dies within reasonable time.

---

### RQ5: Are there recurring "trap motifs" that appear before every failure?

#### What We Want to Understand
Keränen (2010) identified trap factors whose extension dies in both directions. Can the lab automate their discovery?

#### Algorithms
- **Bidirectional Trap Tester**: Input a short word w. Test right and left extension each up to N steps. If both die → trap.
- **Trap Motif Miner**: Collect all suffixes preceding dead ends in the last 100 backtracks. Find overrepresented n-grams via χ² test.
- **Motif Causality Analyzer**: For each discovered trap motif, run explainAA2FViolation → classify which half-length or forbid4 pattern kills it.

#### Metrics
- **Trap density** = discovered traps per 1,000 extension steps
- **Trap motif diversity** = how many distinct trap types vs. repeated instances

#### Visualizations
- **Trap Factor Atlas**: Map of known trap factors, grouped by length and failure type. New discoveries highlighted during search.

#### Source Material
- Keränen MJ 2010: "Suppression of Unfavorable Factors" — provides known trap factor examples
- nettisivu/ illustrations of unfavorable word extensions

---

### RQ6: Can the search algorithm learn better branching heuristics from previous searches?

#### What We Want to Understand
Is it possible to adaptively improve letter ordering based on accumulated search data?

#### Algorithms
- **Adaptive Letter Ordering**: Maintain suffix-specific table: "when last k letters are s, which letter historically led to the deepest subtree?" Update on every backtrack.
- **Taboo List**: When suffix + letter combination leads to dead end, mark as taboo for T steps.
- **Strategy A/B Testing**: Run two parallel searches (different strategies) and compare in real time.

#### Metrics
- **Learning efficiency** = (length achieved with adaptive) / (length achieved with fixed) on same seed
- **Taboo hit rate** = how often the taboo list prevents a dead end

#### Visualizations
- **Strategy Comparison Panel**: Two parallel searches side by side, same seed, different strategies. Real-time comparison of length, backtrack density, branching factor.

#### Experiments
- 50 runs fixed vs. 50 runs adaptive → statistical comparison of achieved length distributions (Wilcoxon rank-sum test).

---

### RQ7: Can successful search paths be clustered into families?

#### What We Want to Understand
Do long AA2FR words always come from the "same direction" or are there multiple fertile regions in the search space?

#### Algorithms
- **Path Fingerprinting**: Each successful search (length > threshold) encoded as Parikh trajectory. Compute pairwise distances.
- **Cluster Detector**: DBSCAN or k-means clustering on successful path fingerprints.

#### Metrics
- **Number of clusters** K
- **Intra-cluster variance** vs. inter-cluster distance
- **Parikh trajectory similarity** between successful paths

#### Visualizations
- **Path Family Map**: 2D projection (PCA) of successful paths, colored by cluster.
- **Representative Words**: Each cluster's most typical word shown for full analysis.

#### Prerequisites
- Requires Experiment Manager (batch runs) and Search Dataset to accumulate enough successful paths.

---

### RQ8: Can we automatically classify obstruction types?

#### What We Want to Understand
Is there a small taxonomy that covers all dead ends?

#### Algorithms
- **Obstruction Taxonomizer**: For every collision, record: half-length h, position in word (start/middle/end), which Parikh component caused equality, forbid4 vs. abelian square.
- **Automatic Clustering**: Group obstructions by feature vector. Find dominant types.

#### Metrics
- **Obstruction distribution by half-length h**: Histogram
- **Obstruction "heat"**: Which half-lengths dominate at different word lengths?
- **Forbid4 vs. abelian square ratio**: What fraction of dead ends are caused by each?

#### Visualizations
- **Obstruction Taxonomy Tree**: Hierarchical diagram — top level: forbid4 / abelian square, sub-level: half-length, then specific Parikh collision types.
- **Half-Length Histogram**: Real-time histogram updating during search.

---

## 6. Platform Architecture

### Design Principle: Separate Research from UI

```
Research Core
  (Research questions, mathematical status, integrity)

Experiment Engine
  (Batch runs, configurations, reproducibility)

Search Engine
  (DFS, heuristics, strategies, Web Worker)

Analytics Engine
  (Metrics, correlations, statistical tests)

Data Layer
  (Search datasets, discovery log, hypothesis tracker)

Visualization Engine
  (Charts, replay, taxonomy trees — driven by data)

UI
  (Controls, panels, layout — thinnest possible layer)
```

**UI changes. Research does not.**

The UI is the thinnest layer. All intelligence lives in the engines above it.

### Web Worker Architecture

```
Main Thread                          Web Worker
                                     
UI Controls ──── postMessage ────→   Search Engine
                                     ├─ Validation (Parikh, forbid4)
Analytics UI ←── postMessage ────    ├─ Strategy Layer
                                     ├─ Data Collection
Replay UI   ←── postMessage ────     └─ Evolution Events
                                     
Experiment  ──── postMessage ────→   Batch Runner
Dashboard   ←── postMessage ────     └─ Statistical Aggregator
```

**Commands (Main → Worker):**
- start(config) — seed, mode, strategy, analytics options
- pause, resume, step, stop
- set_strategy(params) — change heuristic mid-search
- run_experiment(batch_config) — launch batch of N runs

**Data (Worker → Main):**
- state_update — current word, length, stats (every 100ms)
- analytics_batch — metrics, obstruction logs (every 500ms)
- evolution_event — search tree nodes (successes + backtracks)
- milestone — new record, trap found, interesting pattern
- experiment_result — completed run summary
- experiment_complete — full batch statistics

---

## 7. Core Modules

---

### 7.1 Search Analytics (The Heart of the Platform)

> The platform's purpose is NOT to search for words. Its purpose is to produce analytics about the search process.

#### Real-Time Metrics Dashboard

| Metric | Description | Serves RQ |
|--------|-------------|-----------|
| Branching Factor B(n) | Average legal options, last 100 steps | RQ1 |
| Compression Ratio | Backtracks / successes, last 100 steps | RQ1 |
| Parikh Balance U(n) | Deviation from (1/3, 1/3, 1/3) | RQ3 |
| Dead-End Suffix Top-20 | Most dangerous suffixes by D(s) | RQ2 |
| Obstruction h-distribution | Half-length histogram | RQ7 |
| Collision Density | Collisions per 100 steps | RQ1, RQ3 |
| Search Entropy | How "random" the search tree looks | RQ5, RQ6 |
| Letter Distribution | Cumulative proportions | RQ3 |
| Trap Motif Count | Discovered trap factors | RQ4 |
| Factor Frequency Top-k | Most common short factors in current word | RQ2, RQ4 |
| Average Subtree Depth | Mean depth of explored subtrees | RQ1, RQ5 |
| Success Probability | Estimated probability of extending further | RQ1 |

#### Per-Step Data Record

Every search step produces a structured record:

```
{
  "step": 45231,
  "depth": 892,
  "letter": "b",
  "result": "valid",
  "branching": 2,
  "parikh_balance": 0.0043,
  "parikh_a": 298, "parikh_b": 297, "parikh_c": 297,
  "suffix_8": "bcababca",
  "suffix_15": "abcbcababcababca",
  "obstruction": null
}
```

Failed steps include obstruction detail:

```
{
  "step": 45232,
  "depth": 892,
  "letter": "c",
  "result": "backtrack",
  "branching": 0,
  "obstruction": {
    "type": "abelian_square",
    "half_length": 7,
    "position": 885,
    "parikh_match": {"a": 3, "b": 2, "c": 2}
  }
}
```

---

### 7.2 Evolution Replay

> Show the entire search process, not just the final word. The researcher sees for the first time where the search algorithm actually spends its time.

#### Concept

Evolution Replay records every search decision and presents the search tree as a visual structure — like a Git commit tree or game tree explorer.

```
root
 ├─ a ✓
 │  ├─ ab ✓
 │  │  ├─ aba ✓
 │  │  │  ├─ abaa ✗ (abelian square, h=2)
 │  │  │  ├─ abab ✗ (abelian square, h=2)
 │  │  │  └─ abac ✓ → [continues deeper...]
 │  │  ├─ abb ✗ 
 │  │  └─ abc ✓ → ...
 │  └─ ac ✓ → ...
 ├─ b ✓ → ...
 └─ c ✓ → ...
```

#### Interaction
- **Zoom in**: Click a node → see subtree structure in detail
- **Zoom out**: See overview where color = subtree depth
- **Timeline slider**: Scrub forward/backward through the search, watching the tree grow
- **Node inspection**: Click any node → see word state, Parikh vector, branching factor, obstruction at that moment
- **"Hot zones"**: Automatic highlighting of regions where the search spent the most time (most backtracks)
- **Search path animation**: Replay the search progression, adjustable speed

#### What This Reveals
- Where the search spends its time (hot zones)
- Depth vs. breadth patterns
- Tree symmetry or asymmetry
- How different strategies produce differently shaped trees

#### Storage Strategy
Full trees can be enormous (millions of nodes). Three tiers:

| Depth | Storage |
|-------|---------|
| ≤ 100 | Every node recorded |
| 100–500 | Backtracks and milestones only |
| > 500 | Statistical summaries per 100-step window |

---

### 7.3 Experiment Manager

> Research requires not one search, but hundreds. This module makes batch experimentation a first-class operation.

#### Experiment Configuration

```
Experiment: "Adaptive vs Fixed"

Runs:           500
Mode:           aa2fr
Direction:      right
Seed strategy:  random / fixed
Max depth:      5000
Strategy A:     fixed (a→b→c)
Strategy B:     gavrilenko
Output:         JSON
Summary:        CSV
Statistics:     enabled
Analytics:      full

[Run]  [Pause]  [Cancel]
```

#### Batch Execution
- Runs sequentially in Web Worker (or round-robin if multiple Workers)
- Each run stores its complete result in the Search Dataset
- Progress bar with estimated time remaining
- Real-time aggregation of results as runs complete

#### Output
- Per-run JSON: full search record
- Summary CSV: one row per run (seed, strategy, max_length, backtracks, parikh_final, time_ms)
- Aggregate statistics: mean, median, std, confidence intervals

---

### 7.4 Statistical Engine

> No claim without statistical support.

#### Available Tests

| Test | Purpose | Use Case |
|------|---------|----------|
| Pearson correlation | Linear relationship | U vs. backtrack rate |
| Spearman correlation | Monotonic relationship | Suffix danger score vs. depth |
| Bootstrap confidence interval | Uncertainty estimation | Mean achieved length |
| Wilcoxon rank-sum | Compare two distributions | Strategy A vs. Strategy B |
| χ² test | Overrepresentation | Trap motif frequency |
| Effect size (Cohen's d) | Practical significance | Strategy improvement magnitude |
| Permutation test | Non-parametric comparison | Small sample experiments |

#### Automatic Analysis

After each batch experiment completes:
1. Compute descriptive statistics (mean, median, std, min, max, quartiles)
2. If comparing two strategies → Wilcoxon test + effect size
3. If analyzing correlations → Pearson/Spearman with confidence intervals
4. Generate summary report with Level B/C classification

---

### 7.5 Hypothesis Manager

> The platform tracks hypotheses as first-class research objects.

#### Hypothesis Record

```
Hypothesis H-017

Claim:   High Parikh imbalance (U > 0.05) predicts dead end within 200 steps
Status:  Testing
Evidence: 32 experiments
Support: 28/32 (87.5%)
Confidence: 0.71 (bootstrap 95% CI)
Level:   C → approaching B
Last updated: 2026-07-24

Related RQ: RQ3
Related experiments: E-041, E-042, E-055
Related discoveries: D-0012
```

#### Workflow
1. Researcher formulates hypothesis (manually or suggested by analytics)
2. Platform designs experiment to test it
3. Results update evidence count and confidence
4. Status progresses: Proposed → Testing → Supported / Refuted / Inconclusive
5. Sufficiently supported hypotheses graduate from Level C to Level B

---

### 7.6 Search Dataset

> All searches must be preserved as structured research data.

#### Per-Run Record

```
{
  "run_id": "R-0391",
  "experiment_id": "E-042",
  "timestamp": "2026-07-24T12:05:00Z",
  "config": {
    "mode": "aa2fr",
    "direction": "right",
    "strategy": "adaptive",
    "seed_word": "abac"
  },
  "results": {
    "max_length": 982,
    "total_steps": 245891,
    "total_backtracks": 120392,
    "final_parikh": {"a": 328, "b": 327, "c": 327},
    "final_balance": 0.0018,
    "duration_ms": 14520
  },
  "analytics_summary": {
    "avg_branching": 1.73,
    "avg_subtree_depth": 4.2,
    "collision_density": 0.58,
    "top_obstruction_h": 4,
    "top_danger_suffix": "bcababca"
  }
}
```

#### Storage
- localStorage for current session data (capped at reasonable size)
- JSON export/import for long-term persistence and external analysis (Python, Mathematica)
- CSV export for summary tables

---

### 7.7 Discovery Log

> Research produces unexpected findings. They must not be lost.

#### Discovery Record

```
Discovery D-0043

Description: Unexpected trap motif "bcabcabc" kills both directions within 12 steps consistently
Frequency: 41 occurrences across 200 runs
First seen: Experiment E-031, Run R-0187
Confirmed: No (needs bidirectional test)
Level: C

Related RQ: RQ4
Related hypotheses: H-023
Notes: Resembles Keränen's trap factors but shorter. May be a new class.
```

#### Automatic Discovery Detection
- **Anomaly detector**: Flags when a suffix appears in dead ends at ≥ 5× expected frequency
- **Record breaker**: Logs when a new maximum word length is achieved
- **Pattern detector**: Flags unusual Parikh trajectories or branching factor patterns
- **All auto-discoveries require manual confirmation** before advancing beyond Level C

---

## 8. Performance Layer

These optimizations serve the research goals — faster search = more data = better answers.

### 8.1 Web Worker Search Engine

New file: aa2fr-worker.js

Contains the complete search engine, validation logic, data collection, and batch runner. Communicates with main thread via postMessage.

### 8.2 Prefix-Sum Parikh Vectors

Replace per-call getParikh(slice(...)) with cumulative prefix sums:
- Compute P[i] for each index once
- Any range [l, r) Parikh vector = P[r] - P[l] → O(1) per comparison
- Changes per-step complexity from O(N²) to O(N)

### 8.3 Integer Parikh Packing

From CUDA Prompts: encode letter counts as single integers:
  a → 0,  b → 1,  c → 65536 (= 2^16)
Region letter sum = one integer. Two regions are abelian equivalent ⟺ their sums are equal. One === comparison replaces three counter comparisons.

### 8.4 Gavrilenko's Parikh Balance Heuristic

Replace fixed a→b→c with scored ordering:
  Score(w + x) = |w|² - (U(w+x)³ · 27) / (8 · |w|)

Letter producing highest score is tried first. Available as selectable strategy alongside fixed ordering.

### 8.5 6-Phase Rotation

From CUDA Prompts: when backtrack counter exceeds threshold (e.g., 50,000 steps without new record), automatically rotate to next alphabet permutation: abc → cba → bac → bca → cab → acb.

Optional stochastic 3% branch pruning at deep levels.

---

## 9. Implementation Phases

### Phase 1 — Morphism Extension & Lightweight MVP Analytics (Foundation)

> Before building complex 5-phase infrastructure, we evaluate whether existing uniform morphisms already provide a pathway or obstruction ceiling, alongside lightweight MVP logging.

| Task | Serves |
|------|--------|
| Web Worker architecture + postMessage API | All RQs |
| Tab 16 Module C: $g_3(h_6^\omega(a))$ Density Fade Ratio scanner ($K=2..5$) | RQ1 |
| Uniform endomorphism seed exploration ($h_6/g_3$, $g_{85}$, $g_{109}$) | RQ1 |
| Lightweight JSON log export + core timeline charts | Phase 1 MVP |
| Prefix-sum Parikh + integer packing | Performance |
| Strategy layer (fixed / Gavrilenko / rotation) | RQ4, RQ6 |
| RQ0 validation suite | RQ0 |

**Output**: Immediate evaluation of the direct Mäkelä attack (Density Fade Ratio) and a lightweight research engine before heavy infrastructure expansion.

### Phase 2 — Search Analytics Dashboard

> Make collected data visible.

| Task | Serves |
|------|--------|
| Real-time metrics panel (12 metrics) | RQ1, RQ3 |
| Dead-end suffix leaderboard | RQ2 |
| Obstruction taxonomy histograms | RQ7 |
| Parikh–Backtrack scatter plot | RQ3 |
| Branching factor timeline | RQ1 |
| Data export (JSON/CSV) | All RQs |

**Output**: Live dashboard exposing the search process.

### Phase 3 — Evolution Replay

> Visualize the search tree.

| Task | Serves |
|------|--------|
| Search tree recording mechanism (tiered storage) | All RQs |
| Tree visualization (diagram + color coding) | RQ1, RQ5 |
| Timeline slider (scrub forward/backward) | RQ1 |
| Node inspection (click → see state) | All RQs |
| "Hot zone" automatic detection | RQ1, RQ5 |

**Output**: Researchers can see where the algorithm spends its time.

### Phase 4 — Experiment Infrastructure

> Scale from single searches to statistical research.

| Task | Serves |
|------|--------|
| Experiment Manager (batch configuration + execution) | All RQs |
| Search Dataset (structured storage + export) | All RQs |
| Statistical Engine (tests + confidence intervals) | RQ3, RQ5 |
| Hypothesis Manager (tracking + evidence) | All RQs |
| Discovery Log (anomaly detection + manual confirmation) | RQ2, RQ4 |

**Output**: Full experimental research workflow.

### Phase 5 — Research Tools

> Targeted tools for specific research questions.

| Task | Serves |
|------|--------|
| Trap Factor Inspector (bidirectional testing) | RQ4 |
| Strategy Comparison Panel (parallel A/B searches) | RQ5 |
| Adaptive letter ordering | RQ5 |
| Path fingerprinting + clustering | RQ6 |
| Pleasants demo (3-letter impossibility) | Context |
| Step-by-step obstruction anatomy | RQ7, Pedagogy |

**Output**: Specialized tools for answering each research question.

---

## 10. Verification Plan

### Automated Tests (Phase 1)

| Test | Method | Pass Criterion |
|------|--------|----------------|
| Parikh correctness | Compare prefix-sum vs. naive on 1000 random words | 100% agreement |
| Integer packing correctness | All 3-letter words to length 20 | 100% agreement |
| forbid4 completeness | Test all 3⁴ = 81 length-4 ternary words | Exactly 6 flagged |
| Suffix scan equivalence | Compare suffix scan vs. full scan on 500 words | 100% agreement |
| Web Worker communication | Start/pause/step/stop + data receipt | All commands functional |
| Pleasants verification | All ternary words of length 8 contain abelian square | 100% confirmed |
| Preset validation | Full scan of 15,796-letter word | 0 violations |
| Deterministic replay | Run search, replay, compare state at every step | Bit-exact |

### Research Validation (Phase 2+)

| Test | Method |
|------|--------|
| Branching factor accuracy | Manual computation on first 10 steps vs. reported value |
| Metrics mathematical correctness | B(n) ∈ [0,3], U(n) ≥ 0, collision density ∈ [0,1] |
| Statistical engine | Known datasets with known statistics → verify computation |
| Experiment reproducibility | Same config + same seed → identical results |

---

## 11. Decisions (Finalized 2026-07-24)

### Decision 1: Research Priority Order
**RQ0 → RQ1 (Morphism Extension & Density Fade Ratio K=2..5) → Lightweight MVP Analytics (Phase 1) → Deep DFS Analytics (RQ2–RQ8)**

- **RQ0 first** — without a verified validator, all data is unreliable.
- **RQ1 second (The Direct Mäkelä Attack)** — before building a massive 5-phase DFS analytics infrastructure, we evaluate whether existing uniform morphisms ($h_6/g_3$, $g_{85}$, $g_{109}$) already provide a pathway or negative ceiling for $K \in \{2,3,4,5\}$. Tab 16 Module C (Density Fade Ratio) is our primary tool here: if obstruction density trends toward zero on long prefixes, it suggests a constructive pathway; if it asymptotes to a positive constant, it provides a valuable negative theorem.
- **Lightweight MVP Analytics (Phase 1)** — basic JSON logging and core timeline charts to support empirical exploration before heavy infrastructure investment.
- **RQ2–RQ8 (Deep Analytics Phases 2–5)** — only after knowing whether the uniform morphism extension path is open or blocked do we decide how much complex statistical, clustering, and automated hypothesis infrastructure is actually required.

### Decision 2: Evolution Replay Storage
**Option B — Tiered storage**

| Depth | Stored | Rationale |
|-------|--------|-----------|
| ≤ 200 | Every node | Details are instructive and data is small |
| 200–1000 | Backtracks + milestones only | What matters is *where* the search turned |
| > 1000 | Statistical summary per 200 steps | Individual nodes meaningless; trends matter |

Option A (everything) would produce ~10 MB per search, making 500-run batches = 5 GB. Option C (interesting only) loses too much context. Option B balances insight with practicality.

### Decision 3: Experiment Scale
**Start with 50 runs, scale to 200 for publishable results**

- 50 runs for quick iteration and initial comparisons
- 200 runs for Wilcoxon test statistical power and bootstrap CIs
- 500+ only if 200-run result is borderline (p ≈ 0.05)
- Experiment Manager allows adding more runs — no need to collect everything at once

### Decision 4: JSON Export
**Yes, in Phase 1 immediately**

Technically trivial (JSON.stringify + download link) but research-critical. Enables:
- Python analysis (pandas, matplotlib, scipy.stats)
- Mathematica analysis (natural connection to project history)
- Sharing results with collaborators
- Long-term data preservation beyond localStorage limits

### Decision 5: Hypothesis Manager Scope
**Hybrid: manual entry + automatic suggestions**

Phased rollout:
1. Phase 4 start: Manual — researcher records hypothesis, links experiment, updates status
2. Phase 4 continuation: Auto-suggestions — analytics engine proposes hypotheses when it detects correlations (e.g., "U > 0.06 correlates with dead ends, ρ = 0.73 — create hypothesis?")
3. Researcher confirms or dismisses — auto-suggestions never activate without human confirmation

Follows Research Integrity: machine proposes, human decides.

### Decision 6: File Architecture
**Separate JS files, modular structure**

```
index.html          ← UI structure and thin controller
aa2fr-worker.js     ← Search Engine + Validation + Data Collection (Web Worker)
aa2fr-analytics.js  ← Analytics Engine + Statistical Engine
aa2fr-experiment.js ← Experiment Manager + Hypothesis Manager + Dataset
aa2fr-ui.js         ← Visualization Engine + Evolution Replay renderer
```

Rationale:
- index.html is already 196 KB — adding more makes it unmaintainable
- Web Worker requires a separate file by design
- Analytics and experiment logic are DOM-independent modules
- Follows architecture principle: "UI changes. Research does not."

---

## 12. Strategic Research Roadmap & Epistemological Calibration (Added 2026-07-27)

Following empirical data validation and third-party AI peer review, the research roadmap and future architectural horizons are calibrated as follows:

### 12.1 Priority Order & Epistemological Discipline
The platform strictly adheres to the following sequence of research priorities:
1. **Current Audit Claims & Boundary Localization Precision:** Ensuring that every empirical statement differentiates between full avoidance and boundary-spanning avoidance.
2. **Reproducible Search & Independent Verification:** Strengthening the dual-validator architecture (reference vs optimized integer-packed prefix-sum validators).
3. **Formal Proof Bridges (Lean 4 / SAT):** Automating theorem generation for bounded, decidable subclasses before attempting infinite general conjectures.
4. **Targeted GPU Acceleration:** Deploying WebGPU/CUDA compute shaders *only* where algorithmically appropriate (data-parallel Parikh verification, not divergent DFS).
5. **Offline Autonomous Reporting (CLI Mode):** Confining autonomous long-running research agents to optional Node.js CLI execution to preserve browser zero-install integrity.
6. **Aperiodic Order (2D/3D Quasicrystals):** Treating higher-dimensional substitution systems as a long-term theoretical vision rather than near-term UI features.

> **CRITICAL RULE (MATH_CLAIMS.md Exclusivity):** No "finding" (*löydös*), "proof" (*todistettu*), or absolute conclusion may appear in any document (including brainstorms, vision papers, or roadmap summaries) without a corresponding registered entry in `MATH_CLAIMS.md`. Any statement not backed by an active claim ledger entry must be explicitly phrased as a hypothesis or negative observation (e.g., *"the scanner found no candidate within this bounded space"*, never *"the scanner proved"*).

### 12.2 Seam Surgery Precision & Sequential Transducers (Bimachines)
Recent empirical audits of $g_3(h_6^\omega(a))$ reveal a critical distinction between $K=5$ and shorter lengths:

| Length ($K$) | Total Collisions | Boundary-Spanning Fraction (10-char seam) | Internal Fraction (within single block) |
|---|---|---|---|
| 2 | 70,874 | 35.4% | 64.6% |
| 3 | 44,604 | 48.8% | 51.2% |
| 4 | 31,669 | 79.4% | 20.6% |
| 5 | 8,775 | **100.0%** | **0.0%** |

- **Mathematical Calibration:** For $K=5$, collisions are 100% boundary-spanning, confirming that standard $g_3'$ seam surgery targets the exact locus of failure. However, for $K \in \{2,3,4\}$, between 20.6% and 64.6% of collisions occur *internally* within a single 10-character image block. Therefore, seam surgery alone cannot eliminate all $K=1..4$ collisions—only the boundary-spanning fraction.
- **Algorithmic Path:** To achieve true non-uniform (boundary-dependent) substitution without uncontrolled L-system explosion, future surgery engines must implement a **bounded-context sequential transducer (or bimachine)**. A bimachine inspects a finite left and right neighbor window ($a_{-1} a_0 a_{+1}$) to deterministically select a variable-length substitution block ($|g(a)| \in \{9, 10, 11\}$), forming a decidable and searchable mathematical structure.

### 12.3 WebGPU / CUDA Compute Architecture (Warp Divergence vs. Data Parallelism)
While massive parallelism (e.g., "100 million candidates/sec") is mathematically desirable, GPU architecture dictates a strict division of labor:
- **Data-Parallel Parikh Queries (GPU-Optimal):** Evaluating fixed-window Parikh vectors across millions of independent candidates is data-parallel. Using integer Parikh packing (encoding $a \rightarrow 0, b \rightarrow 1, c \rightarrow 65536$) and prefix sums, WebGPU shaders can evaluate window equivalence across massive candidate pools at full streaming multiprocessor (SM) memory bandwidth.
- **State-Dependent Backtracking DFS (GPU-Hostile):** Exhaustive DFS tree search is branching and state-dependent. Executing DFS inside GPU threads causes severe **warp divergence**: threads within the same 32-thread warp take different execution branches at different search depths, forcing the hardware to serialize execution and destroying GPU performance gains.
- **Conclusion:** WebGPU/CUDA acceleration will be targeted exclusively at Phase 1 candidate pre-filtering and stationary density grid generation, leaving tree backtracking to CPU Web Workers.

### 12.4 Architectural Tension: Zero-Install Browser Hub vs. Autonomous Overnight Lab
- **The Conflict:** The foundational vision of this project is the **"Zero-Install Global Hub"** principle: all computation occurs 100% locally within client-side browser Web Workers without requiring backend server infrastructure, Python sidecars, or command-line installation.
- **Resolution:** An "Overnight Autonomous Researcher-in-the-Loop" (running continuous LLM hypotheses and background validation loops) cannot execute inside a sleeping browser session without violating this core architectural promise. Therefore, autonomous overnight research is classified as an **architectural paradigm shift** requiring an optional, standalone Node.js/CLI backend (`agy` / CLI mode), strictly separated from the zero-install web application.

### 12.5 Cryptographic Integrity Ledger (djb2 vs. SHA-256)
- The canonical `djb2` hash ledger in `morphisms.js` ($h_6$: `914e2f31`, $g_3$: `428a0fcd`, $g_{85}$: `2d49c2ad`, etc.) was designed to catch accidental copy-paste errors, truncation, or refactoring corruption during software development. For this documented purpose, `djb2` is 100% sufficient and mathematically sound.
- Upgrading to standard SHA-256 (via Web Crypto API `crypto.subtle.digest`) is adopted as a forward-looking hardening measure for external data export, but does not imply any flaw in the legacy `djb2` verification ledger.

### 12.6 Higher-Dimensional Quasicrystals (Aperiodic Order)
- Extending 1D Abelian square avoidance to 2D grids ($\mathbb{Z}^2$) or 3D lattices ($\mathbb{Z}^3$) connects formal language theory to **Aperiodic Order and Mathematical Quasicrystals** (cut-and-project schemes, substitution tilings, and diffraction spectra as established by Michael Baake, Uwe Grimm, et al.).
- **Calibration:** Avoiding combinatorial 1D Abelian squares is not yet physically identical to avoiding 3D acoustic or photonic wave resonances. Higher-dimensional tilings remain a long-term theoretical frontier, to be explored via specialized offline synthesis tools rather than immediate browser UI widgets.

---

*Document version: 2026-07-27T23:50*
*Status: APPROVED — Strategic Roadmap Calibrated*
