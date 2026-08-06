# Authority Map

**Wave:** 0 (repository authority)
**Produced:** 2026-08-06
**Produced by:** program bootstrap architect session, read-only
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §3, §7
**Status:** revised after owner review, 2026-08-06 (`ACCEPTED_WITH_CORRECTIONS`)

This map states which files are authoritative and over what, which define current
work, which are generated, which are registers, which are proposals, and which are
historical. It also lists the conflicts found while reading them, which require owner
review.

No file was edited to produce this map. No claim wording or claim status was touched.

---

## 1. Authoritative files, by domain

> A file is authoritative only within the domain stated below. Apparent
> contradictions across domains require interpretation rather than automatic
> precedence.

This distinction was added at owner review. The previous draft placed
`MATH_CLAIMS.md`, `AGENTS.md`, `LICENSE`, `CITATION.cff` and `.gitignore` in one
undifferentiated "truth" group and asserted that any contradiction of any of them was
simply wrong. That is too strong: `.gitignore` is a technical policy file whose own
comments can go stale, and `CITATION.cff` fixes citation metadata rather than every
fact about authorship.

### 1.1 Mathematical authority

| File | Authority over | Notes |
|---|---|---|
| `MATH_CLAIMS.md` | Every external and internal mathematical claim the project uses | 110 numbered rows (highest row number seen: 110). Predominantly Finnish; migration is row-by-row by policy, not neglect — see `AGENTS.md` rule 8 |

No mathematical statement is authoritative anywhere else in the repository. This is
the one domain where the "contradiction means wrong" rule holds without
qualification.

### 1.2 Epistemic and contribution policy

| File | Authority over | Notes |
|---|---|---|
| `AGENTS.md` | The claims and verification protocol; how any agent or human may contribute | 17 numbered rules |
| `EPISTEMIC_DISCIPLINE.md` | How citations, scope, and self-assessment are handled | 9 sections; consistent with `AGENTS.md`, more discursive |

### 1.3 Legal and citation metadata

| File | Authority over | Notes |
|---|---|---|
| `LICENSE` | Legal terms of use | MIT, Copyright (c) 2026 Joonas Huhta |
| `CITATION.cff` | Citation metadata — how the project is cited | Authoritative for the citation record, not for every authorship or credit question |

### 1.4 Repository safety configuration

| File | Authority over | Notes |
|---|---|---|
| `.gitignore` | What may not enter the repository | Carries provenance comments, including a record of a 2026-07-31 history rewrite. The **rules** are authoritative and enforced by Git; the **comments** are documentation and may be stale |

### 1.5 Verification-status token counts in `MATH_CLAIMS.md`

Counted by matching status tokens across the whole file, not by parsing one column:

```text
COMPUTED                   87
PRIMARY                    32
REJECTED                   15
INDIRECT                    6
LEVEL_2_VERIFIED_SOURCE     1
```

**These token counts are a rough diagnostic only.** They do not establish the number,
weight, or independence level of the ledger's current claims. A single row may emit
several tokens (a row retracted and later reinstated carries both `REJECTED` and
`PRIMARY`); `PRIMARY` and `COMPUTED` are not mutually exclusive within a row; and
token frequency says nothing about a claim's research weight. A **row-aware status
census** is required before drawing any conclusion about the proportion of externally
sourced versus internally computed knowledge.

The previous draft inferred from these counts that "the project's mathematical
position rests overwhelmingly on its own Level 1 computations". That inference is
withdrawn here: it may well be true, but it does not follow from these numbers, and a
census has not been run.

---

## 2. Files that define current work

| File | Role | Notes |
|---|---|---|
| `NEXT_STEP.md` | Where to continue and what is not worth doing | 666 lines. Structured as stacked handoffs, newest first (2026-08-04, 2026-08-02, 2026-08-01…), each stating that it supersedes the sections below where they conflict |
| `docs/plans/CEGIS_ROUTE_A_ARCHITECTURE.md` | The architecture the newest handoff points to | Referenced as the highest-priority research target by the 2026-08-04 handoff |

`CURRENT_FOCUS.md` **does not exist.** Several intake plans assume it does.

---

## 3. Generated views, domain registers, and routing documents

The previous draft filed all of these under "derived files — the ledger always wins".
Owner review corrected this: a generated export and a maintained register are not the
same kind of object, even though both are constrained by the ledger.

### 3.1 Generated / derived views

Mechanically produced. If one disagrees with `MATH_CLAIMS.md`, the ledger is right and
the view is stale.

| File | Generated from | Notes |
|---|---|---|
| `KNOWLEDGE_STATE.md` | `MATH_CLAIMS.md` | States explicitly: "This is a derived index, not a source of truth" |
| `claims.json` | `MATH_CLAIMS.md` via `src/claims-export.js` | Gitignored; regenerate, never edit |
| `index.html`'s embedded claims block | `MATH_CLAIMS.md` via the same exporter | Synced by `claims-export.js` |

### 3.2 Domain registers, constrained by the ledger

These are **maintained**, not generated. Each is authoritative within its own domain,
and none may state a mathematical claim that lacks a ledger row.

| File | Authoritative for | Constrained by | Lines |
|---|---|---|---|
| `NEGATIVE_RESULTS.md` | What has been tried and failed, and its finality class (NECESSARY / BOUNDED / CONTEXTUAL) | Any mathematical claim inside an entry belongs to the ledger | 390 |
| `LITERATURE_COVERAGE.md` | Which sources have been opened and which have not; which search space has been swept | The mathematical content of a source belongs to the ledger | 166 |
| `OPEN_RESEARCH_QUESTIONS.md` | What is open (A–C), and the rejection register with reasons (D) | Whether a question is *closed* is a ledger matter | 561 |

The distinction matters in practice. A source's *opened / not opened* status is
`LITERATURE_COVERAGE.md`'s own authority — `MATH_CLAIMS.md` records what a source
says, not whether anyone has read it. Treating these registers as mere exports would
lose that.

### 3.3 Routing documents

| File | Role |
|---|---|
| `RESEARCH_CONTEXT.md` | Entry point and reading order. States explicitly: "This file is a router, not a copy" |

---

## 4. Onboarding and outward-facing files

`README.md`, `CONTRIBUTING.md`, `RESEARCH_CONTEXT.md`.

These files orient contributors and route them toward authoritative material. They
should not be cited as mathematical evidence unless they explicitly point to a
canonical claim or primary source. `RESEARCH_CONTEXT.md` is simultaneously the first
file a new session reads and a routing document — its authority is over the reading
order, not over any figure it repeats.

---

## 5. Plans — proposals, not authority

| Location | Contents |
|---|---|
| `docs/plans/` | Living plans: `SANALAB_PLAN.md`, `UI_UX_PLAN.md`, `SKILLS_PLAN.md`, `RESEARCH_ARCHITECT.md`, `PROJECT_ARCHITECTURE.md`, `CEGIS_ROUTE_A_ARCHITECTURE.md`, `LAB_VISION_2035.md` |
| `docs/plans/intake/` | The 15 imported planning documents plus one checksum file. Status: **all PROPOSED**, none accepted |
| `docs/program/` | This bootstrap layer |

A plan may propose architecture, experiments, features, policies. A plan may not
override the ledger, current mathematical definitions, source status, or the accepted
epistemic rules.

---

## 6. Historical — do not rely on without re-checking the ledger

`docs/historical/` — `AA2FR_RESEARCH_PLATFORM_PLAN.md`, `NEXT_AGENT.md`,
`SEAM_ENGINE_RESEARCH_MANUAL.md`, `COMPUTATIONAL_DISCOVERY_LAB_PLAN.md`,
`AA2FR_QUICK_REFERENCE.md`, `AA2FR_OHJELMAN_IDEA.md`,
`KOULUTUSKAYTTO_PARANNUKSET.md`, `DEVELOPMENT_ROADMAP.md`, `GRAND_VISION_MAP.md`,
`AGENT_CONCEPT_BRIEF.md`.

`RESEARCH_CONTEXT.md` §2 states these contain outdated plans and partly-corrected
citations. The folder name carries the warning structurally.

---

## 7. Executable authority

| Command | Guards |
|---|---|
| `node tests/test.js` | The mathematics |
| `node scripts/check-claims-drift.js` | Claims, citations, and UI text |

`AGENTS.md` rule 12 makes both mandatory as a pre-commit hook, installed once per
clone via `node scripts/install-git-hooks.js`. `CONTRIBUTING.md` rule 4 adds that both
outputs must be **read**, not just their pass/fail line.

Neither command was run in this wave. This session is read-only and did not verify
that they currently pass.

---

## 8. Conflicts requiring owner review

### 8.1 `CLAUDE.md` is a stale subset of `AGENTS.md`

`AGENTS.md` contains 17 numbered rules. `CLAUDE.md` contains rules 1–8 only, with
identical wording for those eight. The following are **absent** from the file an agent
loads automatically at session start:

```text
 9  NO RAW LOG, NO PROOF
10  INTERFACE CONTRACT BEFORE CODE
11  FINAL REPORTS ARE TABLES, NOT ESSAYS
12  THE LINTER IS MANDATORY, NOT A REMINDER
13  SEED HYGIENE FOR PURE RUNS
14  EXPLICIT MODE LABELING
15  EXHAUSTION REPORTING MUST STATE BOUNDS
16  A LONGER FINITE WORD IS NOT PROOF OF AN INFINITE ONE
17  INDEPENDENT POST-CHECK IS MANDATORY
```

Rules 9 and 16 each exist because of a specific recorded failure. An agent that reads
only `CLAUDE.md` is not carrying the lessons those rules encode.

**Recommended remedy — a router, not a copy.** The previous draft recommended syncing
`CLAUDE.md` to all 17 rules. Owner review rejected that as a fix that recreates the
same drift later: two copies of a numbered rule set will diverge again the next time
`AGENTS.md` gains a rule. The durable form is:

```markdown
# Claude Code instructions

Read and obey `AGENTS.md` in full before making any change.

`AGENTS.md` is the canonical agent and contributor protocol.
This file must not duplicate or abbreviate its numbered rules.
```

Paired with a `check-claims-drift.js` check that fails if `CLAUDE.md` reintroduces a
numbered rule body. This converts a recurring documentation-sync obligation into a
mechanically enforced invariant, which is the same move `AGENTS.md` rule 12 already
makes for the linter itself.

Listed here rather than performed: Waves 0–4 change no files outside `docs/program/`.

### 8.2 `RESEARCH_CONTEXT.md` is stale in two counted figures

- It states `MATH_CLAIMS.md` has **85 rows**. The ledger's highest row number is
  **110**. `NEXT_STEP.md`'s 2026-08-02 handoff already records 99 rows, so the drift
  predates this session.
- It states "The root holds the eight `.md` files the table above lists, plus three".
  The root holds **fifteen** `.md` files.

`RESEARCH_CONTEXT.md` is a derived router, so this is drift in a derived file, not a
claim error. `NEXT_STEP.md`'s 2026-08-01 entry records that a previous instance of
exactly this drift was caught by `check-claims-drift.js` and asks whether a further
automated guard should exist. That question is still open.

### 8.3 Self-certifying wording in `index.html`

Plan 1 (`SUSTAINABLE_WEB_ARCHITECTURE…`) §7 asserts the browser page can generate
self-certifying reports. The wording is present:

```text
index.html        CERTIFIED           7
index.html        Certified           6
index.html        Provable            4
index.html        certified           6
index.html        provable            3
index.html        publication-grade   1
poster.html       certified           1
```

**What this does and does not establish.** These are occurrence counts from a
case-sensitive text search. Whether each occurrence is a self-certifying badge, a
quotation of a retracted banner, or descriptive prose was **not** audited case by
case in this wave. The count is a reason to audit, not a count of violations.

Context worth carrying into that audit: `MATH_CLAIMS.md` row 26 records that
`check-claims-drift.js` gained checks 6b/6c, which fail the build if any *program*
prints *certified / provable / proven / publication-grade*. The checker's `index.html`
checks that were read in this wave concern inline LaTeX and HTML entities. Whether
the program-output guard also covers the browser page's own markup was not
determined.

### 8.4 Copyrighted material remains in reachable Git history

This is stated in Plan 1 §11 as something "the project's own current handoff
documentation reports". It was verified directly rather than taken from the plan:

```text
latest/Keranen.pdf   added   in commit aeff280
                     deleted in commit b69f829  ("untrack research data and the
                                                  copyrighted PDF committed by mistake")
```

Both commits remain in reachable history on `main`, so the blob is still retrievable
from a clone. Fourteen files under `latest/` show the same add-then-delete pattern,
including Keränen's ICALP 1992 and TCS papers, Pleasants (1969), and a Gavrilenko
PDF. `datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` was added the same
way and is **currently tracked**; `.gitignore` covers only `datasets/keranen_*.txt`.

`.gitignore` records that a history rewrite on 2026-07-31 "purged 4 previously tracked
non-PDF files that slipped past the old `papers/*.pdf`-only rule". The PDFs above were
not covered by that rewrite.

The decision on whether to rewrite history belongs to the owner and is recorded in
`OWNER_DECISIONS_REQUIRED.md` (decision 1), including the counter-cost: the ledger and
`NEXT_STEP.md` cite commit SHAs, which a rewrite invalidates.

### 8.5 Files the intake plans assume exist, which do not

Verified absent: `.github/` (no workflows, no issue templates, no PR template),
`docs/adr/`, `CURRENT_FOCUS.md`, `ROADMAP.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
`SUPPORT.md`, `LICENSES.md`, `CONTRIBUTORS.md`.

`research/` exists but holds two files, one of which is a PDF excluded by `.gitignore`.

### 8.6 Language status of `MATH_CLAIMS.md`

The ledger's header and most rows are in Finnish. This is **policy, not drift**:
`AGENTS.md` rule 8 states the ledger is translated one row at a time, only when that
row is touched anyway, never as a mass translation, because calibrated wording is
exactly what bulk translation loses.

Plan 2 proposes a prioritized batch migration campaign. That is a conflict with
canonical authority, recorded as `OWNER_DECISIONS_REQUIRED.md` decision 5.

---

## 9. Reading order for a new session

Unchanged from `RESEARCH_CONTEXT.md` §2, with one addition:

```text
RESEARCH_CONTEXT.md      router
AGENTS.md                the protocol — all 17 rules, not CLAUDE.md's 8
KNOWLEDGE_STATE.md       what is known and closed
MATH_CLAIMS.md           the sole authority for any claim
NEXT_STEP.md             where to continue
```
