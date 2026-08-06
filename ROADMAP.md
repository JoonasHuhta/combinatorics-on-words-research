# Roadmap

**Status:** approved program roadmap, bootstrap phase
**Created:** 2026-08-06 (Wave 4)
**Authority:** `docs/program/PROGRAM_MAP.md`, `docs/program/OWNER_DECISIONS_REQUIRED.md`
**Current focus:** `CURRENT_FOCUS.md`
**Research authority:** `NEXT_STEP.md` — unchanged by this roadmap

This roadmap organizes work into six parallel workstreams with work-in-progress
limits. It does **not** activate every plan. Twelve of fifteen intake plans remain
`PROPOSED`, and appearing in a workstream below does not make an item authorized —
each still requires a bounded task specification.

---

## 1. Priority constraints

These bind every workstream and are not negotiable within the roadmap.

```text
1   unresolved rights and provenance block all computational, experimental,
    publication, redistribution and research use of the D40 dataset.
    Read-only provenance preservation and tracing is explicitly excluded.
2   claim authority remains singular — MATH_CLAIMS.md
3   no browser or AI output self-certifies
4   finite records do not support an infinite-existence claim
5   independent verification (IND) is a separate axis from reproducibility (REP)
6   Abelisk v3 is active; v2 is superseded; the foundation document is
    historical / reference
7   English is canonical for new public structured content
8   motor accessibility is an active requirement
9   pedagogical effectiveness is currently an untested hypothesis
10  Java COW Backtracker v1.2 is the reference version
11  CEGIS Route A remains the current research authority unless the owner
    explicitly changes NEXT_STEP.md
```

---

## 2. Work-in-progress limits

Adopted instead of activating plans. Percentages expire; WIP limits do not.

```text
2026-08-06 → 2026-09-06          bootstrap allocation (OD-9)
    60%  safety and shared foundations
    30%  research
    10%  documentation and review

from 2026-09-06                   work-in-progress limits (PLAN-CHARTER-001 §5.1)
    max 3 active research lines
    max 2 active infrastructure projects
    max 2 active educational / community pilots
```

Additional standing limits, from PLAN-WEB-001 §30:

```text
one active architecture epic
maximum two active feature migrations
one public release at least every four weeks
```

**Current active count: zero.** `TASK-0001` is *selected*, not active. No
implementation task is described as active anywhere until the owner explicitly
authorizes it.

---

## 3. Workstreams

### WS-1 — Repository safety and rights

**Why first:** it gates public exposure of every other workstream, and two of its
items cannot be retrofitted.

| Item | State | Blocker |
|---|---|---|
| **TASK-0001** — preserve and trace the D40 dataset provenance | **`SELECTED — AWAITING OWNER AUTHORIZATION`** | not authorized |
| Artifact-denylist CI + strengthened `.gitignore` | ready | needs repo admin |
| Rights and artifact inventory across tree, branches, tags, history | ready | — |
| OD-1 remediation plan (six prerequisites) | blocked | owner decision |
| Removal from current tree, if required | blocked | OD-2 outcome |
| Authorized local research copy, if legally allowed | blocked | OD-2 outcome |
| Git-history remediation | blocked | **OD-1, separate from OD-2** |
| Replacement by a project-generated or redistributable dictionary | blocked | OD-2 outcome |

The five D40 steps are kept distinct **by owner direction**, because collapsing
provenance tracing into history remediation converts a reversible triage into an
irreversible rewrite.

### WS-2 — Mathematical research

**Authority:** `NEXT_STEP.md`. This roadmap does not reprioritize research.

| Item | State |
|---|---|
| CEGIS Route A (`docs/plans/CEGIS_ROUTE_A_ARCHITECTURE.md`) | **current research authority** |
| Route A length-7 exhaustion independent verification | carried over |
| Route B (h8) algebraic exclusion verification | carried over |
| Pin down L\* at L=5, L=6 | carried over; measure a sample first |
| Cut-and-Certify E1 → E2 | ready; Gate A for its line |
| B16 golden-control pilot | ready |
| All D40-derived research | **blocked on OD-2** |

### WS-3 — Verification and research software

**Why it matters:** it produces the Layer-4 checker that WS-1 and WS-2 both need.

| Item | State |
|---|---|
| `TASK-GOV` — disambiguate verifier names and contracts | candidate |
| Mark `scratch/dict_backtracker.js` non-certifying | ready |
| Layer-4 independent verifier with mutation tests | ready |
| Verify or refute the rolling-hash boundary claim | ready |
| Record registry with persistent IDs, checksums, AA2F/AA2FR separated | ready |
| `REP` / `IND` level definitions (OD-12) | ready |
| Java engine migration and v1.2 release | **deferred** — OD-13, org does not exist |

### WS-4 — Abelisk and pedagogy

| Item | State |
|---|---|
| Mathematical core extraction (four layers, Abelisk shape) | ready — highest-leverage technical item |
| Abelisk v3 first sprint (six authored moments) | ready |
| Tutorial MVP 1 (scenes 0–5, 7–8, 11) | ready |
| Transfer task design for the first pilot | **required before any pilot** |
| Accessibility floor including motor requirements | binding on all of the above |
| 85-cell Master | **conditional** — pending `g85` verification |
| Daily puzzle, archive, level editor | deferred |

### WS-5 — AI evaluation

| Item | State |
|---|---|
| Provenance labels (origin × review status) | ready |
| Contamination ledger | ready |
| AI incident log | ready |
| Benchmark and holdout design | proposal only |

Standing rule: an AI-generated checker is not independent merely because it came from
another session. Independence is argued in terms of code lineage, algorithmic
independence, shared test data, shared assumptions, and model exposure.

### WS-6 — Community and open participation

**Gated:** broad promotion waits on OD-1.

| Item | State |
|---|---|
| `.github/` issue forms and PR template | ready — needs repo admin |
| `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md` | ready |
| Branch protection and required checks | ready — needs repo admin |
| Discussions, unadvertised | ready |
| Broad recruitment campaign | **blocked on OD-1** |
| Credit and authorship policy | ready |

---

## 4. Sequence, not schedule

Deliberately no dates beyond the OD-9 allocation window. Ordering is by dependency.

```text
NOW          TASK-0001 (WS-1)

NEXT         artifact-denylist CI            WS-1, independent of OD-1/OD-2
             TASK-GOV                        WS-3, removes a verifier ambiguity
             mark dict_backtracker.js non-certifying   WS-3

THEN         Layer-4 verifier + mutation tests         WS-3
             Cut-and-Certify E1 → E2                   WS-2, produces a Layer-4 candidate
             mathematical core extraction              WS-4

LATER        record registry                  needs Layer-4 verifier
             B16 golden-control pilot         validates the conjecture record model
             community health files + .github/         needs repo admin

GATED        computational, experimental, publication, redistribution
             and research use of the D40 dataset       OD-2
                 NOT gated: read-only provenance preservation and
                 tracing (TASK-0001)
             public recruitment               OD-1
             ledger translation               OD-5
             website shell                    after core extraction
             Java migration                   OD-13, org does not exist
```

---

## 5. Stop and review

**2026-09-06 — end of the bootstrap allocation window.** Re-decide OD-9 against WIP
limits. Do not renew percentages by default.

**Per PLAN-WEB-001 §30:** pause any architecture work that produces none of lower bug
risk, faster load, stable links, evidence traceability, contributor usability,
accessibility, or feature parity.

**Per PLAN-REC-001 §18:** every research campaign defines stop rules and a
resurrection condition **before** it runs. A campaign without them cannot acquire them
afterwards, because the decision to continue will already have been made under sunk
cost.

**Per PLAN-CHARTER-001 §35.3, quarterly:** *which research line would we stop if it
belonged to someone else?*

---

## 6. What this roadmap does not do

- It does not activate any plan. Twelve remain `PROPOSED`.
- It does not reprioritize research. `NEXT_STEP.md` holds that authority.
- It does not authorize implementation of anything, including `TASK-0001`.
- It does not resolve OD-1, OD-2, or OD-5.
- It does not set dates beyond the OD-9 window.
