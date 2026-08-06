# Current Focus

**Updated:** 2026-08-06
**Review due:** 2026-09-06 (end of the bootstrap allocation window)
**Full roadmap:** `ROADMAP.md` · **Research authority:** `NEXT_STEP.md`

---

## One active epic

# Repository safety and rights (WS-1)

## One selected task

# `TASK-0001` — Preserve and trace the D40 dataset provenance

**Status: `SELECTED — AWAITING OWNER AUTHORIZATION`**

Specification: `docs/tasks/TASK-0001.md`

The task is specified and selected. It is **not active**, **not authorized**, and
**not started**. Selection is not authorization. No implementation task is described
as active anywhere until the owner explicitly authorizes it.

When authorized, it runs in an **isolated Git worktree on a dedicated task branch** —
never in the shared worktree.

---

## Why now

`datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` is tracked in a public
repository, its provenance is unresolved, and Wave 3 established that it **is** the
D40 source dictionary. One unresolved rights question therefore gates dictionary
compilation, the 39-state graph, three of five search modes, record replay, seam
rigidity, Cut-and-Certify Phase 5, and the dictionary-derived CEGIS priors.

It is also the cheapest open item: preserving the evidence and tracing one file's
origin is bounded work that adds files and changes nothing.

The owner direction is explicit: **preserve checksum, filename, size and the known
dependency graph before repository tracking is changed**, and **do not delete the only
operational copy**.

---

## Do not start

```text
Git-history remediation                 OD-1 — separate decision, six prerequisites
Any D40 compilation, audit, or search   OD-2 — status RIGHTS_AND_PROVENANCE_UNRESOLVED
Removal of the dataset from the tree    depends on TASK-0001's output
Ledger translation                      OD-5 — AGENTS.md rule 8 governs until amended
Public recruitment                      OD-1
Website shell or toolchain adoption     OD-8 — after math-core extraction
Java engine migration                   OD-13 — organization does not exist yet
Editing AGENTS.md                       TASK-GOV is a candidate, not approved
Any pedagogy pilot                      transfer task not yet designed
The 85-cell Master puzzle               conditional on g85 verification
Restoring mechanics from Abelisk v2 or the foundation document
```

---

## Stop condition

Stop `TASK-0001` and report if any of the following occurs:

- provenance tracing reveals third-party ownership with **no** redistribution
  permission — this escalates to OD-1 rather than continuing;
- the file's checksum does not match what any prior record states;
- the operational copy is found to be the only copy in existence;
- the task would require changing repository tracking, deleting anything, or touching
  Git history — all three are **out of scope**;
- an acceptance criterion cannot be objectively tested.

---

## Standing constraints

```text
MATH_CLAIMS.md is the sole claim authority
no browser or AI output self-certifies
a finite record never supports an infinite-existence claim
REP (reproducibility) and IND (independence) are reported separately
Abelisk v3 active · v2 superseded · foundation historical/reference
English canonical for new public structured content
motor accessibility is an active requirement
pedagogical effectiveness is an untested hypothesis
Java COW Backtracker v1.2 is the reference version, never v1.1
CEGIS Route A remains the research authority unless NEXT_STEP.md changes
```

---

## Open owner decisions

| # | Subject |
|---|---|
| OD-1 | Git-history remediation — needs a controlled plan |
| OD-2 | D40 dataset rights and provenance — direction recorded, decision open |
| OD-5 | Ledger translation — option D drafted, needs an `AGENTS.md` rule 8 amendment |

Ten others are decided. See `docs/program/OWNER_DECISIONS_REQUIRED.md`.
