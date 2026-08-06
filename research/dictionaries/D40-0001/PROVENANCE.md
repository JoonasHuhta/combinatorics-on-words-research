# PROVENANCE.md — D40 source dataset

**Produced by:** TASK-0001, `docs/tasks/TASK-0001.md`
**Produced:** 2026-08-06
**Task status:** TASK-0001 executed; not yet committed; pending owner review for
commit.
**Scope:** read-only evidence preservation and provenance tracing.
**Status:** the dataset's rights status remains `RIGHTS_AND_PROVENANCE_UNRESOLVED`
(OD-2, `docs/program/OWNER_DECISIONS_REQUIRED.md`). This document does not resolve
that decision — it produces the evidence OD-2 needs.

No dictionary compilation, symmetry audit, or AA2FR verification was performed. All
of that remains blocked by OD-2.

---

## 1. Identity

| Field | Value |
|---|---|
| Path | `datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` |
| SHA-256 | `555bee379ee0bac7ed8a385d17ba548fdc32599495d94da13c35b761502fdbcf` |
| Size | 100,931,542 bytes |
| Records | 2,403,132 (see §2 for the discrepancy with `wc -l`) |
| Record length | exactly 40 characters, uniform over the complete file |
| Alphabet | `{a, b, c}`, zero violations found over the complete file |
| Duplicate records | 0 |
| Line ending | CRLF |

---

## 2. Structural facts, and one resolved discrepancy

`wc -l` reports 2,403,131 newlines. `awk` reports 2,403,132 records. The file's final
record has no trailing newline, so `wc -l` (which counts newline characters) undercounts
by exactly one relative to the true record count. **The correct record count is
2,403,132**, confirmed by two independent counting methods that agree once the
convention difference is understood.

A second apparent discrepancy was investigated and resolved: `head -1 file | wc -c`
initially appeared to show 42 bytes for a "40-letter" record. This is explained by the
CRLF line ending (`\r\n` = 2 bytes) plus the 40 content characters = 42 bytes for the
line including its terminator. The content itself is exactly 40 characters, confirmed
by `awk '{print length($0)}'` over every line in the file (which reads the CR as part
of the line under some tools' conventions, but the explicit `sort | uniq -c` count
below unambiguously shows every measured length as 40).

---

## 3. Attribution claimed in the repository's own record

`datasets/README.md` was added in the same commit as the dataset file
(`062290f`) and states, verbatim:

> Tämä on Veikko Keräsen massiivinen 40 merkin "jatkettavien" (extendable) sanojen
> sanakirja, jota käytetään `backtracker_v3.cpp` -ohjelmassa ja sen variaatioissa.
>
> ### Alkuperä ja laskentamenetelmä (Veikon kuvaus 4.8.2026):
> This is the dictionary used by the backtracker_v3.cpp program and its variants,
> which contains all pruned aa2fr words of length 40. Pruning means that each word in
> question has been simultaneously extended to the right and left by words of length
> 80 in CUDA precomputing, preserving the aa2fr property, using a maximum of 200
> million steps. No undecided cases remained, so the dictionary is complete in that
> respect. Naturally, pruning was done on a set of words from which all permutations
> (renamings) and all structural mirror images had first been removed.

This is the project's **own** attribution and description, dated 2026-08-04, quoting
someone referred to as "Veikko". It has **not** been independently corroborated by
this task against any external source — no such source was contacted or opened. It is
recorded here as a repository-internal claim, not as a verified fact.

**No redistribution or publication permission is stated anywhere in this text.** The
README describes origin and generation method, and separately assesses the
dictionary's scientific status (a heuristic aid, shown on 2026-08-04 to prune away
some genuinely valid AA2F continuations) — it does not address whether the raw
dictionary file itself may be committed to a public repository.

### 3.1 Four distinct things this task does not conflate

This section repeatedly touches four different questions, and they are kept
explicitly separate:

| Question | What this task found |
|---|---|
| **Attribution** — whose work is this claimed to be? | "Veikko Keränen", per the project's own `datasets/README.md` |
| **Generation method** — how was it claimed to be produced? | CUDA-based pruning, quoted verbatim in §3 above, not independently reproduced or verified |
| **Committer identity** — who added the file to this repository? | See §5 — a Git identity, recorded without interpretation |
| **Redistribution permission** — is committing and publishing it authorized? | **Not established either way.** No statement granting or denying it was found |

Attribution to an author, and evidence about generation method, are not evidence of
redistribution permission. Nothing in this document should be read as establishing
permission from any of the other three facts.

---

## 4. A conflict with the project's own stated policy

`README.md` (repository root), section "Sources and licence":

> The literature in `papers/` and the record words in `datasets/` belong to their
> authors and are not redistributed from this repository.

The dataset file:

- is attributed, in the project's own words, to an external author ("Veikko
  Keränen");
- is tracked in Git;
- is present in the commit history reachable from the **origin remote's `main`
  branch**, which is publicly readable on GitHub (confirmed, §5 — this is the only
  remote configured for this repository and the only one this task inspected; no
  fork, mirror, or other remote was checked);
- is therefore **already redistributed** via that remote, as far as this task could
  verify.

This is a direct conflict between a stated policy and the actual repository state, as
observed on the one remote inspected. It is recorded as a fact, not resolved.
Resolving it is OD-2's job. This finding is about **redistribution state**, not about
permission — see §3.1.

---

## 5. Git history

The file was added in exactly one commit and has not been modified since.

```text
git log --all --follow --oneline -- 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt'
  062290f Docs: Update epistemological policies and add Veikko's dictionary with notes

git log --all --diff-filter=A --follow --format='%H %ai %s' -- 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt'
  062290f7eaf4113cdcfcb5b04197694bf9030cc6 2026-08-04 14:28:49 +0300 Docs: Update epistemological policies and add Veikko's dictionary with notes

git log --all --oneline --grep="AllPermsMirs|ex80ms200M|LetLen40" -i
  (no output — no other commit message references this file)
```

**The commit is present on the origin remote's `main` branch, as inspected by this
task.** `git merge-base --is-ancestor 062290f origin/main` exits 0 (true), and
`git ls-tree -r origin/main --name-only` includes the file path. This was verified
against the locally cached `origin/main` ref, not by a fresh network fetch during this
task. `origin` is the only remote configured for this repository (§6.3). **This finding
is scoped to that one remote and ref** — no other remote, fork, mirror, or currently
live public URL was checked, and this finding must not be generalized beyond what was
inspected.

**The `.gitignore` rule intended to exclude Keränen-attributed data does not match
this filename.** The existing rule is `datasets/keranen_*.txt` /
`keranen_*.txt`, which requires the filename to *start* with `keranen_`. This file's
name is `aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt`, which does not match.
`git check-ignore -v` confirms the file is not ignored (exit code 1). This may explain
why it was committed despite the project's general pattern of excluding Keränen's
data — the exclusion rule's naming assumption did not anticipate this filename.

The committing author's Git identity is `JoonasHuhta <jv…@gmail.com>` (email redacted
for personal-data minimization; the full address is present in the repository's own
Git commit metadata and is not reproduced here) — the same identity used across the
repository's entire history, including its first commit (2026-07-07). `CITATION.cff`
names the sole software author as "Huhta, Joonas". The redacted email's local part
contains the string "keranen", which matches the surname attributed to the
dictionary's source.

**This task does not interpret that fact, and it must not be treated as evidence of
identity, ownership, permission, or authorship.** No claim about a relationship
between the committer and "Veikko Keränen" is made or implied here. The observation is
recorded — in this minimized form — solely because it is directly observable in the
repository's own history and may be relevant to whoever resolves OD-2. It is not, by
itself, evidence that redistribution is or is not permitted.

---

## 6. Appendix — command output and transcripts

Preserved per `AGENTS.md` rule 9: a summary of what a command did is not evidence
that it did it. §6.1 and §6.2 are raw, unaltered command output. §6.3 is a
**personal-data-redacted transcript** — see its note below for exactly what was
redacted and what was not.

### 6.1 Baseline working-tree state (Step 0, before any file was created)

```text
$ git status --short
(no output — the isolated worktree was clean)
```

### 6.2 Checksum, size, structure

```text
$ sha256sum datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
555bee379ee0bac7ed8a385d17ba548fdc32599495d94da13c35b761502fdbcf *datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt

$ stat datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
  File: datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
  Size: 100931542   Blocks: 98568      IO Block: 65536  regular file
Access: 2026-08-06 21:15:15.584711000 +0300
Modify: 2026-08-06 21:13:03.969030100 +0300
Change: 2026-08-06 21:13:03.969030100 +0300
 Birth: 2026-08-06 21:13:03.929504200 +0300

$ wc -l datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
2403131 datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt

$ head -1 datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
aaabaaacaaabbbaaacccaaabacbcccaaacbbbacc

$ tail -1 datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
cccbcccacccbbbcccaaacccbcabaaacccabbbcaa
(no trailing newline)

$ awk '{ print length($0) }' datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt | sort | uniq -c
2403132 40

$ tr -d '\r' < datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt | tr -d 'abc\n' | wc -c
0

$ tr -d '\r' < datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt | sort | uniq -d | wc -l
0

$ head -c 90 datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt | xxd | head -6
00000000: 6161 6162 6161 6163 6161 6162 6262 6161  aaabaaacaaabbbaa
00000010: 6163 6363 6161 6162 6163 6263 6363 6161  acccaaabacbcccaa
00000020: 6163 6262 6261 6363 0d0a 6161 6162 6161  acbbbacc..aaabaa
00000030: 6163 6161 6162 6262 6161 6163 6363 6161  acaaabbbaaacccaa
00000040: 6162 6163 6263 6363 6161 6163 6262 6263  abacbcccaaacbbbc
00000050: 6163 0d0a 6161 6162 6161                 ac..aaabaa
```

### 6.3 Git tracing — personal-data-redacted transcript

**This is not raw command output.** It is a redacted transcript, and the following is
true of it:

- every command below was executed in full, and its **complete** output was reviewed
  by this task before this transcript was written;
- the **only** redaction applied is the Git author email address, shown as
  `jv…@gmail.com` in place of the full address, wherever it appeared;
- **no factual value used by any finding in this document** — checksum, byte size,
  record count, commit SHA, timestamp, commit message, or file path — was altered by
  this redaction;
- **the unredacted email address is not preserved anywhere in this repository's
  documentation.** It remains only in Git's own commit metadata (which predates this
  task and which this task did not alter, add to, or remove).

```text
$ git log --all --follow --oneline -- 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt'
062290f Docs: Update epistemological policies and add Veikko's dictionary with notes

$ git log --all --diff-filter=A --follow --format='%H %ai %s' -- 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt'
062290f7eaf4113cdcfcb5b04197694bf9030cc6 2026-08-04 14:28:49 +0300 Docs: Update epistemological policies and add Veikko's dictionary with notes

$ git log --all --oneline --grep="AllPermsMirs|ex80ms200M|LetLen40" -i
(no output)

$ git show -s --format='%H%n%an <%ae>%n%ai%n%n%B' 062290f
062290f7eaf4113cdcfcb5b04197694bf9030cc6
JoonasHuhta <jv…@gmail.com>
2026-08-04 14:28:49 +0300

Docs: Update epistemological policies and add Veikko's dictionary with notes

$ git show --stat 062290f
 AGENTS.md                                          |      10 +
 datasets/README.md                                 |      17 +
 ...fr3LetLen40ex80ms200MextendableAllPermsMirs.txt | 2403132 +++++++++++++++++
 3 files changed, 2403159 insertions(+)

$ git log --all --reverse --format='%H %an <%ae> %ai %s' | head -3
3e5565d20bbdfeca912fa0a8325fefbae40020c6 JoonasHuhta <jv…@gmail.com> 2026-07-07 21:05:31 +0300 Initialize Keranen visual laboratory
5a4eaf37aedce678d4f559aa2723b300f957cdd2 JoonasHuhta <jv…@gmail.com> 2026-07-08 13:01:02 +0300 Save working state with 8 tabs (Try It, Timeline, Unfavorable) before refactoring
61af245a38ace105778904733607e2c3c6e5ffa8 JoonasHuhta <jv…@gmail.com> 2026-07-08 13:05:04 +0300 Fix note legend and update architecture docs

$ git remote -v
origin  https://github.com/JoonasHuhta/combinatorics-on-words-research.git (fetch)
origin  https://github.com/JoonasHuhta/combinatorics-on-words-research.git (push)

$ git merge-base --is-ancestor 062290f origin/main ; echo exit=$?
exit=0

$ git ls-tree -r origin/main --name-only | grep AllPermsMirs
datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt

$ git check-ignore -v datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt ; echo exit=$?
exit=1
```

### 6.4 Completion working-tree state

See `docs/program/OD-2-PROVENANCE-FINDINGS.md` §5 for the completion `git status
--short` output and the baseline comparison.
