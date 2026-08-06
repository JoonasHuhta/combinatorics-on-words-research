# OD-2 Provenance Findings

**Produced by:** TASK-0001, `docs/tasks/TASK-0001.md`
**Produced:** 2026-08-06
**Task status:** TASK-0001 executed; not yet committed; pending owner review for
commit.
**For:** `docs/program/OWNER_DECISIONS_REQUIRED.md`, OD-2
**Status:** findings only. **This document does not resolve OD-2.** It presents
options for the owner to decide between. **None of the options below is already
authorized.** Selecting one still requires a separate owner-approved execution task.

Full raw evidence: `research/dictionaries/D40-0001/PROVENANCE.md`,
`source-metadata.json`, `dependency-graph.md`.

---

## 1. What is known

| # | Fact | Confidence | Evidence |
|---|---|---|---|
| 1 | The file is tracked in Git, added in a single commit, unmodified since | Established | `git log --follow`, PROVENANCE.md §5 |
| 2 | The adding commit is present on the **origin remote's `main` branch**, as inspected by this task — `origin` is the only remote configured for this repository, and no other remote, fork, or mirror was checked | Established, scoped to the one remote and ref inspected | `git merge-base --is-ancestor`, `git ls-tree origin/main` |
| 3 | The file's checksum, size, record count, alphabet, and structural uniformity | Established, directly measured | PROVENANCE.md §6.2 |
| 4 | Every record is a unique, well-formed 40-character string over `{a,b,c}` | Established, verified over the complete file, not a sample | PROVENANCE.md §6.2 |
| 5 | The project's **own** documentation (`datasets/README.md`, added in the same commit) attributes the file to "Veikko Keränen" and quotes a description of its generation method dated 2026-08-04 | Established as a **repository-internal claim** — not independently corroborated against any external source by this task | PROVENANCE.md §3 |
| 6 | `README.md` (root) states record words in `datasets/` "belong to their authors and are not redistributed from this repository" | Established as current policy text | PROVENANCE.md §4 |
| 7 | The file **is** currently redistributed via the one remote inspected (fact #2), and is attributed to an external author (fact #5) — in conflict with the policy in fact #6 | Follows directly from 2, 5, 6. This is a finding about **redistribution state**, not a finding about permission — see fact #9 | PROVENANCE.md §4 |
| 8 | The `.gitignore` rule intended to exclude Keränen-attributed data (`datasets/keranen_*.txt`) does not match this filename | Established | `git check-ignore -v`, exit 1 |
| 9 | No explicit redistribution or publication permission is stated anywhere in the repository for this specific file | Established as an absence — the relevant documents were read in full and no such statement was found | PROVENANCE.md §3 |
| 10 | The committing Git identity's email local-part contains the string "keranen", matching the attributed source's surname (full address redacted here for personal-data minimization; unredacted in Git's own commit metadata, which this task did not alter) | Established as a raw, observed fact. **Not evidence of identity, ownership, permission, or authorship** | PROVENANCE.md §5, §3.1 |

## 2. What is not known

| # | Gap | Why it matters |
|---|---|---|
| 1 | Whether "Veikko" in `datasets/README.md` has ever granted permission for this file to be committed to a public repository | This is the crux of OD-2 |
| 2 | Whether any relationship exists between the committer and "Veikko Keränen" at all — this task makes **no claim** either way, and fact #10's surname match is not evidence of one | Even if a relationship existed, it would not by itself establish permission — that still requires an explicit grant |
| 3 | Whether the file's content matches any external copy Veikko Keränen may hold, or was generated independently | Would require contacting the attributed source or an external comparison, neither performed |
| 4 | Whether `datasets/README.md`'s description of the generation method (CUDA precomputing, 200 million steps) is accurate, or merely repeats what the maintainer was told | Not independently verifiable from inside this repository |
| 5 | Whether other project files or commit messages contain a more explicit permission statement not caught by this task's searches | The searches covered filename references, `.gitignore`, both READMEs, and commit-message grep; they did not cover every commit's full diff or private correspondence |

Per `AGENTS.md` rule 4: "I am not sure where this came from" is an acceptable and
desirable finding when true. Items 1–3 above are exactly that.

---

## 3. Options for the owner

Framed, not selected. **None of the four options below is already authorized by this
document, this task, or any prior wave.** Each requires separate owner approval, and
each action described (contacting anyone, untracking, generating a replacement) would
require its own bounded execution task before anything is done.

### Option A — Contact the attributed source directly

Ask "Veikko Keränen" (or whoever the maintainer understands this to refer to) whether
the file's presence in the public repository is authorized. This is the only path that
can turn gap #1 into a fact rather than an inference.

**This option does not itself establish permission.** Selecting it only initiates a
request; the outcome — granted, denied, or unreachable — is unknown until answered.

**If** permission is confirmed: keeping the file tracked, proceeding to the dictionary
compilation and audit that `DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md` §5 requires, and
eventually resolving OD-2 as `RESOLVED — PERMITTED`, would become *available* —
each still under its own separate approval.

### Option B — Treat the absence of explicit permission as insufficient, remove from tracking

Untrack the file (`git rm --cached`), keep a private, non-redistributed working copy
per the OD-2 owner direction ("a local quarantined copy may be used for internal
reproducibility investigation — this does not imply redistribution permission"), and
extend `.gitignore` with a pattern that actually matches this filename (fact #8) so
the same gap cannot recur for a similarly named file.

**This option still requires separate owner approval and its own preservation plan
before execution.** Nothing in this document authorizes it.

**Note:** this removes the file from the *current tree* only. Per the OD-2 owner
direction and `DEPENDENCY_AND_CONFLICT_MAP.md`, this is step 2 of the five distinct
D40 steps and is **separate from** Git-history remediation (OD-1, step 4). The commit
that introduced the file (`062290f`) and its presence on the origin remote's history
would remain until and unless OD-1 is separately resolved and executed.

### Option C — Replace with a project-generated or redistributable dictionary

Per the OD-2 owner direction's step 5. Generate a new D40-equivalent dictionary from
first principles inside the project's own tooling, with clear project ownership and no
external-attribution question. This is the only option that removes the dependency
permanently rather than resolving a rights question about the existing artifact.

**This option does not resolve the existing file's prior publication.** It only
prevents needing that file going forward; the already-published commit remains
unaddressed unless OD-1 is separately resolved.

**Cost:** this is new research and engineering work, not a provenance decision. It
does not answer whether the *current* file may be used in the meantime.

### Option D — Leave as is, formally acknowledge the conflict

Keep `RIGHTS_AND_PROVENANCE_UNRESOLVED` as the standing status, with the prohibitions
already in force (no public claim, release, benchmark, or recruitment use; no
deletion of the only operational copy).

**This option preserves the unresolved risk rather than resolving it.** It defers the
decision without changing current exposure, which fact #2 shows is not zero — the
file is already present on the one remote this task inspected.

---

## 4. Which of the five OD-2 steps becomes available under each outcome

Per `DEPENDENCY_AND_CONFLICT_MAP.md` §1, the five steps are kept distinct by owner
direction:

```text
1. provenance tracing                     <- THIS TASK, now complete
2. removal from the current tree, if required
3. preservation of an authorized local research copy, if legally allowed
4. Git-history remediation                 <- OD-1, separate
5. replacement by a project-generated or redistributable dictionary
```

| Outcome | Step 2 available? | Step 3 available? | Step 4 needed? | Step 5 needed? |
|---|---|---|---|---|
| Option A, permission confirmed | no — nothing to remove | yes, and the copy is no longer merely "local" | no | no |
| Option A, permission denied or unreachable | yes — becomes required | yes, as originally scoped | **yes**, separately | optional |
| Option B | yes — this option *is* step 2 | yes | **yes**, separately | optional |
| Option C | independent of this choice | independent | independent | yes — this option *is* step 5 |
| Option D | deferred | deferred | deferred | deferred |

Step 4 (Git-history remediation) is **never** automatically triggered by resolving
OD-2. It is `docs/program/OWNER_DECISIONS_REQUIRED.md` OD-1, and it requires its own
six prerequisites regardless of which OD-2 option is chosen.

**"Available" in this table means logically consistent with the chosen outcome, not
authorized.** Every step listed still requires its own separate owner-approved
execution task before anything is done.

---

## 5. Working-tree verification

### Baseline (captured before any file in this task was created)

```text
$ git status --short
(no output)
```

### Completion (captured after all four authorized files exist)

```text
$ git status --short
?? research/dictionaries/
?? docs/program/OD-2-PROVENANCE-FINDINGS.md
```

**Comparison:** the only difference from baseline is the appearance of the four
authorized files (three inside the new `research/dictionaries/D40-0001/` directory,
plus this file). No tracked file was modified. No pre-existing untracked file existed
in this isolated worktree to begin with, so none could have been disturbed.

### Dataset byte-identity

```text
$ sha256sum datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
555bee379ee0bac7ed8a385d17ba548fdc32599495d94da13c35b761502fdbcf *datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
```

Identical to the checksum recorded at the start of this task (§1 of
`PROVENANCE.md`). The dataset was not modified.

---

## 6. Required test outputs

Both commands were run **before** any file in this task was created (to confirm a
clean baseline) and again **after** all four files were created (to confirm nothing
broke). Both runs are identical in outcome.

### `node tests/test.js`

```text
=== TEST SUITE SUMMARY: 41 PASSED, 0 FAILED ===
🎉 ALL TESTS PASSED SUCCESSFULLY!
```

Unchanged before and after this task's file creation. Full output was read in both
runs, not only the summary line.

### `node scripts/check-claims-drift.js`

```text
=== DRIFT CHECK SUMMARY: 15 PASSED, 0 FAILED ===
🎉 ALL DRIFT CHECKS PASSED SUCCESSFULLY!
```

Unchanged before and after this task's file creation. Full output was read in both
runs, not only the summary line.

---

## 7. Final result table

Per `AGENTS.md` rule 11.

| Acceptance criterion (TASK-0001 §8) | Result |
|---|---|
| Baseline `git status --short` captured before any other step | Done — empty |
| SHA-256, size, line count, filename recorded before any file created | Done |
| Dataset byte-identical to task start | Confirmed — checksum matches |
| Completion status differs from baseline only by the four authorized files | Confirmed |
| Every pre-existing untracked file still present and unchanged | N/A — none existed in this isolated worktree |
| No tracked file modified | Confirmed |
| Provenance findings distinguish fact from inference, confidence stated | Done — §1/§2 above |
| "Origin unknown" recorded plainly where true | Done — §2, items 1–3 |
| Dependency graph names every consumer with file and line | Done — `dependency-graph.md` |
| Findings present options, resolve nothing | Done — §3 above |
| Both test commands pass, both outputs read | Confirmed, twice |
| No file outside the four authorized outputs touched | Confirmed |
| Report is a table, not an essay | This section |
| Personal data minimized; attribution/permission/identity kept distinct | Done — email redacted throughout to `jv…@gmail.com`; §1 fact #10 and PROVENANCE.md §3.1 |
| Public-state claims scoped to the remote actually inspected | Done — every "public" claim now names `origin/main` explicitly and disclaims other remotes/forks/mirrors |
| Options do not imply authorization | Done — §3, each option carries an explicit non-authorization caveat |

**OD-2 is not resolved by this document.** The owner decides among §3's options.
