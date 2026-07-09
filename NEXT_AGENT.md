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

## Recent Work Completed

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
