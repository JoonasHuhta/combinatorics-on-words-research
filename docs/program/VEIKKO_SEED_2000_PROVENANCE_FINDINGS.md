# `scratch/veikko_seed_2000.txt` Provenance Findings

**Produced by:** a bounded, read-only provenance investigation conducted in-session
(no task number assigned; not part of TASK-0001/OD-2's D40 dataset investigation,
though related — see §6).
**Produced:** 2026-08-07
**Status:** findings only. **This document does not resolve provenance or rights for
this file.** It records what was established, what was not, and binds specific
downstream statuses that follow directly from the unresolved state. No further
provenance search was performed after this document's evidence was gathered, per
instruction.

Full investigative evidence is reproduced in condensed form below; the raw
commands and outputs were reviewed in full during the investigation (`AGENTS.md`
rule 9 — a summary is not evidence that a command's raw output was read; it was).

---

## 1. What is known

| # | Fact | Confidence | Evidence |
|---|---|---|---|
| 1 | `scratch/veikko_seed_2000.txt`: SHA-256 `d4bbfe45ef729ee97b77c5b88be77fd539db1f5973f3b72636d7d57d3e64b9f7`, 1901 bytes (1900 ternary `{a,b,c}` characters + one trailing `\n`) | Established, directly measured | `sha256sum`, direct read |
| 2 | This exact content has **never** been a Git object in this repository — checked as the current content (with trailing `\n`) and as the trimmed content (without it), both via `git hash-object` followed by `git cat-file -t`; both lookups failed (`fatal: could not get object info`) | Established | `git hash-object` + `git cat-file -t`, both variants |
| 3 | The filename and the string `veikko_seed` have never appeared in any commit on any branch, including inside comments or removed code — checked with `git log --all -p -S"veikko_seed"` (pickaxe search across full history) | Established | `git log --all -p -S"veikko_seed"`, empty result |
| 4 | No tracked revision of `scratch/backtracker.js` ever hardcoded a reference to `1900` | Established | `git log --all -p -S"1900" -- scratch/backtracker.js`, empty result |
| 5 | Filesystem birth time: 2026-08-04 13:31:27, essentially simultaneous (within 9 seconds) with `record_word_2500_pure.txt`'s creation and `scratch/run_pure_2000.log`'s creation — the seed was consumed by a `--pure` run almost immediately after being written, not reused from an old file | Established, filesystem metadata | `stat`, cross-checked against the run log's own self-reported "Time Taken: 0.949 seconds" |
| 6 | `record_word_2500_pure.txt` and `record_word_5000_pure.txt` are both **exact, verified prefix-descendants** of this seed (the seed is a literal prefix of both files' content); the two are **not** in a chain with each other — `record_word_2500_pure.txt` is not a prefix of `record_word_5000_pure.txt` — both independently extend the shared seed via different backtracking branches | Established, direct string comparison | `String.prototype.startsWith` on all three files |
| 7 | `progressive_log.txt` (79 total entries, full range 532–4972, corrected from an earlier partial read) contains **zero** entries of length 1–1899 that are a prefix of the seed. The only entries related to the seed are 31 entries of length ≥2514 that are the seed's own known downstream run's telemetry (exact numeric match against `run_pure_5000_from_1900.log`'s worker-depth lines, same order) | Established, checked against all 79 entries, not a sample | Full-file parse, cross-referenced against the run log |
| 8 | `datasets/README.md` (tracked, committed) attributes the D40 dataset to "Veikko Keränen" by name | Established as a repository-internal claim, consistent with the existing `OD-2-PROVENANCE-FINDINGS.md` finding #5 | Direct read |
| 9 | A bounded, read-only, literal-text comparison (47 non-overlapping 40-character windows from the seed, exact-line match via `grep -x -F`, no permutation/mirror expansion, no dictionary compilation — within the `DEPENDENCY_AND_CONFLICT_MAP.md` §1 H1 exclusion for read-only provenance tracing) found **47/47 (100%)** of the windows present as exact lines in the D40 dataset | Established, direct measurement | `grep -x -F -f` against the dataset, single pass |
| 10 | The 100% match in fact #9 **does not discriminate** between a self-generated and an externally-derived seed: the project's own open, `NOT_VERIFIED` "rolling-hash boundary"/lossiness question (tracked in `PLAN_REGISTRY.yaml`, `PROGRAM_MAP.md`) concerns exactly whether D40 is comprehensive enough that *any* valid long aa2fr witness — regardless of origin — would show this same match rate | Established as a limitation of fact #9's inferential power, not a separate empirical claim | Reasoning from `scratch/check_lossiness.js`'s own stated purpose and the cited program documents |
| 11 | `scratch/backtracker.cpp` (tracked, commit `edb9aad`) is a separate, dictionary-*dependent* tool with its own distinct hardcoded default seed (different content from this file) whose own comment states a dictionary "belong[ing]" to Veikko must be supplied; this establishes institutional precedent for dictionary-derived seeds elsewhere in this codebase, but does **not** itself link to this specific file | Established as context; explicitly not treated as a direct link | Direct read of `scratch/backtracker.cpp` |

## 2. What is not known

| # | Gap | Why it matters |
|---|---|---|
| 1 | How the 1900-character content was actually produced — no incremental construction trail exists anywhere in this repository's own logs (fact #7), and no git history exists for it at all (facts #2–#4) | This is the central open question; nothing recoverable from inside the repository closes it |
| 2 | Whether the content derives from Veikko Keränen's D40 dictionary, from his private material, from an independent in-project pure search that simply left no log trace, or from some other source entirely | Facts #9–#10 leave this genuinely undetermined, not merely under-evidenced in one direction |
| 3 | Whether "discovered entirely in `--pure` mode from a neutral seed" (`AGENTS.md` rule 13's compliant path) describes this seed's history | Directly gates whether the two downstream files may ever be described as independently, exhaustively discovered |
| 4 | Whether redistribution of this file, or of its two downstream descendants, is permitted | Contingent on gap #2; unresolved because the origin is unresolved |

Per `AGENTS.md` rule 4, "I am not sure where this came from" is the accurate and
required statement here, not a placeholder for later precision.

---

## 3. Binding status declarations

These are the repository's permanent record of this investigation's outcome. They
bind until a future, separately-conducted investigation changes them — this
document does not expire on its own and is not superseded by silence.

| Item | Status |
|---|---|
| `scratch/veikko_seed_2000.txt` | `PROVENANCE_UNRESOLVED` |
| `AGENTS.md` rule 13 compliance (seed hygiene) | `NOT_ESTABLISHED` |
| Redistribution / rights | `NOT_ESTABLISHED` |
| `record_word_2500_pure.txt` | mathematically valid as far as current internal checks show, but `NOT_LEDGER_READY` |
| `record_word_5000_pure.txt` | mathematically valid as far as current internal checks show, but `NOT_LEDGER_READY` |

**`NOT_ESTABLISHED` is not the same as `VIOLATED` or `DENIED`.** It means the
available evidence does not permit either a positive or a negative determination —
see §4 for why these are not the same claim.

---

## 4. Four distinguished axes

Collapsing these into one status is exactly the failure mode `RESEARCH_CONTEXT.md`
warns "this project has repeatedly had to correct." They are kept separate here on
purpose.

### 4.1 Mathematical validity — **established, unaffected by the rest of this document**

Both `record_word_2500_pure.txt` and `record_word_5000_pure.txt`:
- contain all six FORBID4 patterns (`baac`, `caab`, `abbc`, `cbba`, `accb`, `bcca`),
  which is only possible under non-heuristic search — internal evidence, independent
  of the run logs, that the FORBID4 pruning heuristic was genuinely disabled for
  the portion of the search that produced them;
- were each independently re-verified by `backtracker.js`'s own `verifyAa2fr`
  function on a separate code path from the search itself (`run_pure_2000.log`:
  *"Independent verification PASSED"*; `run_pure_5000_from_1900.log`: same) —
  noting precisely that this is a **self-contained** double-check within one
  program, not an externally independent verifier in the stronger sense
  `AGENTS.md` rule 17 and the four-layer verifier architecture (`PLAN_REGISTRY.yaml`
  `standards.verifier_architecture`) describe.

**Nothing in this document casts doubt on either file being a genuine, valid
ternary word containing no abelian square of length ≥ 2.** That property is a fact
about the string itself and does not depend on how the string was produced.

### 4.2 Discovery provenance — **`PROVENANCE_UNRESOLVED`**

See §1–§2. Not established in either direction.

### 4.3 Redistribution rights — **`NOT_ESTABLISHED`**

Contingent entirely on 4.2. If the seed's origin is eventually traced to Keränen's
material, rights would plausibly need the same `RIGHTS_AND_PROVENANCE_UNRESOLVED`
treatment OD-2 already applies to the D40 dataset (`OWNER_DECISIONS_REQUIRED.md`,
OD-2). If traced to an in-project pure discovery, no rights question would exist at
all. Neither has been established, so no default is assumed here.

### 4.4 Ledger status — **`NOT_LEDGER_READY`**

Independent of 4.1: mathematical validity is a precondition for ledger-readiness,
not a sufficient condition. `AGENTS.md` rule 7 requires every claim to carry a
`MATH_CLAIMS.md` row with a stated verification level; a row cannot be written
truthfully while discovery method and rights are both open, because the row's own
description (e.g. "exhaustive pure-mode result from a neutral seed") would itself
be an unverified — and on current evidence, unsupportable — claim.

---

## 5. Binding constraints going forward

```text
Neither record_word_2500_pure.txt nor record_word_5000_pure.txt may be described,
    in any file, commit message, or discussion, as "independently discovered from
    a neutral seed" or as an "exhaustive pure-mode result" without this document's
    status being resolved first. The mathematical validity (§4.1) may be stated;
    the discovery-method framing may not.

Neither file, nor scratch/veikko_seed_2000.txt itself, may be used to seed any
    further --pure (or heuristic) search, cited in MATH_CLAIMS.md, published,
    released, or used in any recruitment or benchmark context, until §3's
    PROVENANCE_UNRESOLVED and NOT_ESTABLISHED statuses are resolved.

This applies by the same reasoning AGENTS.md rule 13 states directly: reusing an
    artifact of unresolved discovery method as a further seed compounds the
    unresolved question rather than closing it.
```

None of the three files (`scratch/veikko_seed_2000.txt`,
`record_word_2500_pure.txt`, `record_word_5000_pure.txt`) is deleted, moved, or
retracked by this document. They remain exactly where and as they were.

---

## 6. Relationship to OD-2

This is a **separate finding from** `docs/program/OD-2-PROVENANCE-FINDINGS.md`,
which concerns the tracked D40 dataset file specifically. The two share the same
attributed name ("Veikko Keränen") and the same class of unresolved
rights-and-provenance question, but this document does **not** assert that
`scratch/veikko_seed_2000.txt` is D40-derived — §1 fact #10 explains precisely why
that inference is not supportable from the evidence gathered. If OD-2 is resolved
in a way that bears on this file (for example, if provenance tracing under OD-2
independently surfaces this seed), that resolution does not automatically transfer
here; a resolution specific to this file would still be needed.

---

## 7. What this document does not do

```text
does not resolve provenance
does not resolve rights
does not modify MATH_CLAIMS.md
does not delete, move, or retrack any file
does not authorize any further search, comparison, or reuse of the seed
does not open a new owner decision (OD-#) — that remains the owner's call
```

---

## 8. Verification

### Baseline (captured before this file was created)

```text
$ git status --short
?? checkpoint_worker_0.json
?? checkpoint_worker_1.json
?? checkpoint_worker_2.json
?? checkpoint_worker_3.json
?? checkpoint_worker_4.json
?? checkpoint_worker_5.json
?? progressive_log.txt
?? record_word_100.txt
?? record_word_1000.txt
?? record_word_200.txt
?? record_word_2000.txt
?? record_word_2500_pure.txt
?? record_word_5000_pure.txt
?? scratch/check_lossiness.js
?? scratch/run_pure_2000.log
?? scratch/run_pure_5000.log
?? scratch/run_pure_5000_from_1900.log
?? scratch/run_pure_a_10000.log
?? scratch/run_pure_a_3000.log
?? scratch/strict_validator.js
?? scratch/veikko_seed_2000.txt
```

Twenty-one pre-existing untracked files, none of them this document.

### Required test outputs

`node tests/test.js` and `node scripts/check-claims-drift.js` — recorded in the
commit that accompanies this document; both must show no change from the
pre-existing baseline, since this document touches no code, no data, and no
`MATH_CLAIMS.md` row.

---

## 9. Final result table

Per `AGENTS.md` rule 11.

| Requirement | Result |
|---|---|
| `scratch/veikko_seed_2000.txt` status recorded | `PROVENANCE_UNRESOLVED` — §3 |
| `AGENTS.md` rule 13 compliance recorded | `NOT_ESTABLISHED` — §3, §4.2 |
| Redistribution/rights status recorded | `NOT_ESTABLISHED` — §3, §4.3 |
| `record_word_2500_pure.txt` status recorded | valid internally, `NOT_LEDGER_READY` — §3, §4.4 |
| `record_word_5000_pure.txt` status recorded | valid internally, `NOT_LEDGER_READY` — §3, §4.4 |
| "Independently discovered from a neutral seed" framing prohibited until resolved | §5 |
| Reuse as a further research seed prohibited until resolved | §5 |
| Mathematical validity, discovery provenance, redistribution rights, and ledger status kept as four distinct axes | §4 |
| `MATH_CLAIMS.md` not modified | Confirmed — no such file touched |
| No file deleted or moved | Confirmed — §5, §7 |
| Both test commands run and read in full after this change | §8 |
