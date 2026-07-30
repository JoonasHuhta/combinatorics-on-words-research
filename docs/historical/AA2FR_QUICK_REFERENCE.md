# AA2FR Research Platform — Quick Reference Card

## Mission
> Transform the AA2FR Extension Lab into an experimental mathematics laboratory
> whose primary purpose is to generate reproducible evidence, discover structural
> regularities, formulate new hypotheses, and support the eventual development
> of a mathematical theory of relaxed Abelian square avoidance over ternary alphabets.

## Design Principle
> The purpose of every feature is to increase mathematical insight
> rather than visual complexity.

---

## Mathematical Status Levels

| Level | Meaning | Example |
|-------|---------|---------|
| **A** | Peer-reviewed, proven | Keränen 1992, Pleasants 1970 |
| **B** | Reproducible experiment | 25,379-letter record, trap factors |
| **C** | Untested hypothesis | Parikh balance predicts dead ends |

---

## Research Questions

| RQ | Question | Priority |
|----|----------|----------|
| **RQ0** | Can we verify the search engine is correct? | **Must-have** |
| **RQ1** | Why do AA2FR words become hard to extend? | High |
| **RQ2** | Which local structures correlate with dead ends? | High |
| **RQ3** | Which Parikh imbalance predicts collisions? | High |
| **RQ4** | Are there recurring trap motifs? | High |
| **RQ5** | Can the algorithm learn better heuristics? | Medium |
| **RQ6** | Can successful paths be clustered? | Medium |
| **RQ7** | Can obstruction types be classified? | Medium |
| **RQ8** | Can AA2FR be characterized mathematically? | Long-term goal |

---

## Architecture (Top to Bottom)

```
Research Core         ← questions, integrity, status levels
Experiment Engine     ← batch runs, reproducibility
Search Engine         ← DFS, heuristics, Web Worker
Analytics Engine      ← metrics, correlations, stats
Data Layer            ← datasets, hypotheses, discoveries
Visualization Engine  ← charts, replay, trees
UI                    ← thinnest layer, controls only
```

---

## Core Modules

1. **Search Analytics** — The heart. 12+ real-time metrics. Per-step data records.
2. **Evolution Replay** — Search tree as visual structure. Timeline scrubber. Hot zones.
3. **Experiment Manager** — Batch 50–500 runs. Compare strategies. CSV/JSON output.
4. **Statistical Engine** — Pearson, Spearman, Wilcoxon, bootstrap CI, χ², Cohen's d.
5. **Hypothesis Manager** — Track claims. Evidence count. Status progression.
6. **Search Dataset** — Structured per-run records. Export for Python/Mathematica.
7. **Discovery Log** — Anomaly detection. Manual confirmation. Research journal.

---

## Performance Optimizations

| Technique | Source | Effect |
|-----------|--------|--------|
| Web Worker | Architecture | UI never freezes |
| Prefix-sum Parikh | Algorithm | O(N²) → O(N) |
| Integer packing (a:0, b:1, c:2¹⁶) | CUDA Prompts | 1 comparison vs. 3 |
| Gavrilenko heuristic | Thesis | Longer words found |
| 6-phase rotation | CUDA Prompts | Escapes local traps |

---

## Implementation Phases

| Phase | What | Output |
|-------|------|--------|
| 1 | Instrumented search engine | Data-collecting Worker |
| 2 | Search Analytics dashboard | Live metrics visible |
| 3 | Evolution Replay | Search tree visualization |
| 4 | Experiment infrastructure | Batch runs + statistics |
| 5 | Research tools | RQ-specific instruments |

---

## Key Source Materials (latest/)

| Document | Key Idea |
|----------|----------|
| Gavrilenko thesis | Priority queue + Parikh balance → 25,379 letters |
| CUDA Prompts | Integer packing, rotation, stochastic DFS |
| Keränen MJ 2010 | Trap factors, unfavorable factor suppression |
| Mattila 2002 | Polynomial inequalities for algebraic construction |
| Enhanced Carpi's Test | 1/2-block morphism verification |
| Pleasants 1969 | 3-letter impossibility (length ≥ 8) |

---

## Research Integrity Rules

- Reproducible (full config stored)
- Statistically supported (≥ 30 runs, confidence intervals)
- Seed-independent (multiple seeds, not cherry-picked)
- Conjecture ≠ Theorem (Level B/C labeled)
- Raw data preserved (JSON export)
- Deterministic replay (step-by-step verification)

---

*Full plan: AA2FR_RESEARCH_PLATFORM_PLAN.md*
*Version: 2026-07-24*
