# Owner Decisions Required

**Wave:** 0–1
**Produced:** 2026-08-06
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §8.4
**Status:** OD-1…OD-9 revised after Wave 1 owner review; OD-10 and OD-11 added by
Wave 2, both open — six decided, five open

Only decisions that cannot safely be delegated are listed.

The first draft left all nine open. At owner review, six were resolved and three were
kept open with revised recommendations. Decisions recorded below as `DECIDED` were
made **by the project owner**, not by this session; where a decision is `OPEN`, no
option has been chosen and none has been acted on.

Nothing below has been implemented. Recording a decision here does not authorize the
work it implies — that still requires a bounded task specification.

Scope note: these arise from Waves 0 and 1 only. Waves 2 and 3 have not been read and
will add more.

---

## Status summary

| # | Subject | Status | Outcome |
|---|---|---|---|
| OD-1 | Git-history rewrite | **OPEN** | Needs a controlled remediation plan; P0 risk task, not a "someday" question |
| OD-2 | Tracked dataset provenance | **OPEN** | Option C preliminarily indicated: quarantine until traced |
| OD-3 | Relicensing to 0BSD + CC0 | **DECIDED** | C — defer pending rights and contributor audit |
| OD-4 | Top-level website structure | **DECIDED** | A — the PLAN-WEB / PLAN-REPO structure |
| OD-5 | Ledger translation vs `AGENTS.md` rule 8 | **OPEN** | New option D drafted; requires a deliberate rule-8 amendment |
| OD-6 | Replace `NEXT_STEP.md` | **DECIDED** | B — add `CURRENT_FOCUS.md`, leave `NEXT_STEP.md` intact |
| OD-7 | Claim authority | **DECIDED** | A — `MATH_CLAIMS.md` remains sole claim authority |
| OD-8 | Build step (Vite/TS/Preact) | **DECIDED** | C now; reconsider A after math-core extraction |
| OD-9 | Attention allocation | **DECIDED** | A for a one-month bootstrap period, then WIP limits |
| OD-10 | Canonical language for content files | **DECIDED** | A — English canonical source; other languages tracked translations |
| OD-11 | Solved or open mathematics under the flagship product | **DECIDED** | Layered: four-letter foundation, ternary Research Chamber, no implied progress |

| OD-12 | One R0–R5 scale, not two | **DECIDED** | Split the axes: `REP-0…5` and `IND-0…5`, reported separately |
| OD-13 | Where the Java COW Backtracker lives | **DECIDED** | Target architecture approved; implementation deferred to a migration task |

Scope by wave: OD-1…OD-9 arose from Waves 0–1. OD-10 and OD-11 arose from Wave 2 and
were decided at the Wave 2 review. OD-12 and OD-13 arose from Wave 3 and were decided
at the Wave 3 review. All 15 intake documents have now been reviewed, so no further
wave will add decisions.

**Status after Wave 3: ten decided, three open (OD-1, OD-2, OD-5).**

> **OD-2 is deliberately kept formally open**, but it now carries a recorded owner
> direction that is operative immediately. See OD-2.

> **OD-2 has become the highest-leverage open decision in the programme.** Wave 3
> established that the file with unresolved provenance *is* the D40 source dictionary,
> so a single rights question now gates the entire dictionary-backtracker research
> line. See OD-2 and `WAVE_3_RESEARCH_AND_SOFTWARE_SYNTHESIS.md` §3.3.

---

## OD-1 — Rewrite Git history to remove copyrighted material?

**Status: OPEN — needs a controlled remediation plan.** This is no longer framed as
"could this be considered someday". It is a P0 risk task whose *execution* is gated on
inventory and preparation, not on further deliberation.

**Question.** Copyrighted PDFs remain retrievable from `main`'s history. Should the
history be rewritten, or should the exposure be documented and contained instead?

**The repository is already public.** This was understated in the first draft and is
the single most important framing correction: containment cannot undo prior exposure.
Anyone who has cloned the repository already holds the blobs, and nothing done now
retrieves them. What remediation can still achieve is (a) stopping further
distribution from the canonical remote, (b) preventing recurrence, and (c) putting the
project in a defensible position. It cannot achieve "the material was never public".

**Why it matters.** Verified directly, not taken from a plan:
`latest/Keranen.pdf` was added in commit `aeff280` and deleted in `b69f829`
("untrack research data and the copyrighted PDF committed by mistake"). Both commits
remain reachable, so the blob is still retrievable from any clone. Thirteen further
files under `latest/` show the same pattern, including Keränen's ICALP 1992 and TCS
2009 papers, Pleasants (1969), and a Gavrilenko PDF. `.gitignore` records that a
history rewrite on 2026-07-31 purged four *non-PDF* files; the PDFs were not covered.

**The counter-cost, which is specific to this project.** A rewrite changes every
commit SHA. `MATH_CLAIMS.md` and `NEXT_STEP.md` cite SHAs as provenance — `90b7052`
(the B16 engine-bug fix behind rows 87/89/90/94), `c5d5d6a`, `f7376d4`. Those
references become dangling. `AGENTS.md` rule 4 makes provenance a first-class
obligation, so breaking it is a real cost, not a cosmetic one.

**Options.**

| | Option | Reversible |
|---|---|---|
| A | Rewrite history now, with backup, an old-to-new SHA map, and a pass over every SHA cited in the ledger | no |
| B | Do not rewrite yet; immediately prevent recurrence, pause active recruitment and major redistribution, document the known exposure, and prepare a controlled rewrite plan | yes |
| C | Rewrite **before** external clone and contributor counts grow materially | defers the same irreversible step, but on a stated trigger |

Option B's wording was corrected at owner review. The first draft said "keep the
repository private-facing until decided", which misdescribed the situation — the
repository is already public, so B is containment and preparation, not concealment.
Option C's trigger was likewise inverted in the first draft ("rewrite only when
external clones exist in number"); the intent is to act *before* that point, since a
rewrite gets harder as clones multiply.

**Cost of postponing.** Rises with clone count. PLAN-WEB-001 §11.2 states the work
"should be completed before actively recruiting many contributors". Postponing past a
recruitment campaign converts a solvable problem into an unsolvable one.

**Prerequisites before any rewrite is executed.** A rewrite is not authorized until
all of these exist:

```text
1. a complete inventory of every path to be purged, across branches and tags
2. a complete list of every commit SHA cited anywhere in the repository
   (MATH_CLAIMS.md and NEXT_STEP.md are known to cite 90b7052, c5d5d6a, f7376d4)
3. a planned old-to-new SHA mapping, and a decision on how cited SHAs are repaired
4. an administrative backup made and verified
5. GitHub Pages, any organisation transfer, and any external mirror accounted for
6. a merge freeze, and notice to anyone holding a clone
```

**Note.** The artifact-denylist CI is independent of this decision and prevents
recurrence under any option. It should not wait for OD-1.

---

## OD-2 — Is `datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` redistributable?

**Question.** This record-word file is currently **tracked**. `.gitignore` covers only
`datasets/keranen_*.txt`, so this one is not excluded by the existing rule.

**Why it matters.** `README.md` states the record words in `datasets/` "belong to
their authors and are not redistributed from this repository". If that applies to this
file, the current tree contradicts the README. If it does not — if this file is the
project's own output — the README's blanket statement is too broad and should be
narrowed.

**Options.** (A) Project-owned, keep tracked, narrow the README wording.
(B) Third-party, untrack and extend `.gitignore`; folds into OD-1.
(C) Provenance unknown — record that honestly per `AGENTS.md` rule 4 and treat as (B)
until traced.

**Preliminary direction (owner review): (C) — provenance unknown, quarantine until
traced.** This does not trigger a history rewrite. It means redistribution of the file
is not assumed to be permitted while its provenance is unresolved.

**Reversible:** untracking is reversible; the history question is OD-1.

**Cost of postponing: moderate to high** while the file remains publicly tracked and
its provenance is unresolved. The first draft said "low now"; that was wrong. A
file of unknown provenance sitting tracked in a public repository is an active
exposure, not a dormant one, and unlike OD-1 it is fixable today by a single
`git rm --cached` plus a `.gitignore` line. This should be a separate P0 triage task,
not an item that waits for OD-1.

### Escalation after Wave 3 — this is now a research blocker, not only a rights item

Wave 3 established that this file **is the D40 source dictionary**.
`DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md` §5.1 names it as its source, and
`JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md` §19.1 and §31 invoke it directly:

```bat
java -Xmx2g -jar build\cow-backtracker.jar compile-dict ^
  --input datasets\aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt ...
```

Everything downstream of the dictionary is therefore blocked on this decision:

```text
dictionary compilation and provenance audit
the 39-letter state graph
aa2fr-d40-hard / -order / -defect search modes
known-record replay through the dictionary
seam-rigidity and forced-corridor measurements
Cut-and-Certify Phase 5 (D40 integration)
dictionary-derived priors for Route A CEGIS and Route C ranking
```

**This makes OD-2 the highest-leverage open decision in the programme.** It was
recorded in Wave 2 as an isolated hygiene item; it is not one. A single unresolved
provenance question gates a large fraction of the research roadmap, and it is
resolvable by tracing one file's origin.

Note also that resolving it *permissively* does not unblock everything: the dictionary
still needs the provenance audit, symmetry-closure check and immutable manifest that
`DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md` §5 requires before scientific use.

### Owner direction, 2026-08-06 — operative while OD-2 remains open

The decision stays **OPEN**, but the following is recorded as binding now:

**Status label:** `RIGHTS_AND_PROVENANCE_UNRESOLVED`.

**Prohibited until provenance and redistribution rights are resolved:**

```text
using the dataset as the basis of a new public claim
using it in a release
using it in a published benchmark
using it in a recruitment campaign
```

**Required before repository tracking is changed:**

```text
preserve the current checksum
preserve the filename
preserve the size
preserve the known dependency graph
```

**Explicit protections:**

- **Do not delete the only operational copy.**
- A **local quarantined copy may be used for internal reproducibility
  investigation** — this does **not** imply redistribution permission.
- A bounded provenance task must exist **before** any D40-dependent research
  campaign.
- **OD-1 remains a separate decision.** Rights triage and history remediation are not
  the same operation and must not be bundled.

**The Wave 4 roadmap must keep these five steps distinct**, because collapsing them is
how a reversible triage turns into an irreversible history rewrite:

```text
1. provenance tracing
2. removal from the current tree, if required
3. preservation of an authorized local research copy, if legally allowed
4. Git-history remediation                                    [= OD-1, separate]
5. replacement by a project-generated or redistributable dictionary
```

Step 5 is the only one that permanently removes the dependency. Steps 1–3 are
reversible; step 4 is not.

---

## OD-3 — Relicense to 0BSD + CC0, or keep MIT?

**Question.** PLAN-PLATFORM-001 §3.3 recommends `0BSD` for code and `CC0 1.0` for
documentation and project-generated datasets. The repository is MIT.

**Why it matters.** The README asks users to cite the specific `MATH_CLAIMS.md` row a
result comes from — a scholarly request that survives either license, but reads very
differently under CC0. PLAN-PLATFORM-001 §3.2 concedes that MIT + CC BY "does not
fully match the stated 'reference only occasionally' preference", so this is a genuine
question about what the project wants, not a technicality. §3.3 attaches its own
precondition: confirm that all currently committed material can legally be
relicensed — which is entangled with OD-1 and OD-2.

**Options.** (A) 0BSD + CC0 as recommended. (B) Keep MIT, add a `LICENSES.md`
clarifying documentation and data. (C) Defer until the contributor-rights audit
exists.

**DECIDED (owner, 2026-08-06): C — defer pending the rights and contributor audit.**
No relicensing now. The audit that OD-1 and OD-2 require is the same audit this
decision waits on, so the three are naturally sequenced.

**Reversible:** **no** in the outward direction. CC0 cannot be withdrawn from material
already released under it — which is precisely why deferring costs nothing and acting
early cannot be undone.
**Cost of postponing:** low. Nothing else in the program depends on it.

---

## OD-4 — Which top-level website structure?

**Question.** Two incompatible structures are proposed.

```text
PLAN-WEB-001 §3 and PLAN-REPO-001 §5
  Home / Learn / Explore / Research / Evidence / Abelisk / Community

PLAN-PLATFORM-001 §27
  Home / Research / Learn / AI Lab / Records / Challenges / Evidence / About
```

**Why it matters.** Abelisk has no top-level route in the second; AI Lab and
Challenges have none in the first. The choice determines URL slugs, and every plan
also requires old links to keep working — so the structure is expensive to change once
published and cited. The related sub-question is whether `Museum of Mistakes` sits at
`/learn/museum-of-mistakes/` beneath the authoritative umbrella (PLAN-WEB-001 §5.2) or
at top level (PLAN-PLATFORM-001 §12).

**Options.** (A) The two-plan majority structure. (B) The platform structure.
(C) A merge — but a merge is a third design and should be recorded as such, not
presented as a compromise.

**DECIDED (owner, 2026-08-06): A — the PLAN-WEB-001 / PLAN-REPO-001 structure.**

```text
Home
Learn
Explore
Research
Evidence
Abelisk
Community
```

Consequences recorded with the decision:

- **AI Lab is not a top-level route.** It lives under `Research` or `Evidence`.
  PLAN-PLATFORM-001's AI-transparency content is accepted; its promotion of AI Lab to
  primary navigation is not.
- **Museum of Mistakes sits at `/learn/museum-of-mistakes/`**, beneath the
  authoritative umbrella, not at top level.
- **The authoritative research umbrella is `Negative Results & Research Lessons`**,
  with `The Graveyard` reserved for entries classified `NECESSARY`. This is
  PLAN-WEB-001 §5.2's naming hierarchy, and it is what preserves the NECESSARY /
  BOUNDED / CONTEXTUAL finality classification `NEGATIVE_RESULTS.md` already carries.
  A memorable name may sit above a precise classification; it may not replace it.
- **Records and Challenges** are not top-level routes; their content belongs under
  `Evidence` and `Community` respectively.

**Reversible:** the code is; the published URLs are not, cheaply.
**Cost of postponing:** now none — decided. Unblocks PLAN-WEB-001 Phase 5 when that
phase is separately authorized.

---

## OD-5 — Does the ledger translation campaign override `AGENTS.md` rule 8?

**Question.** `AGENTS.md` rule 8 states `MATH_CLAIMS.md` is translated **one row at a
time, only when that row is touched anyway — never as a mass translation**, because
"calibrated language is exactly what a mass translation loses, and that calibration is
the ledger's entire value."

PLAN-REPO-001 Phase 5 schedules a prioritized migration: headings and metadata, then
"highest-load active claim rows", then the rest. Its §7.5 gives a careful ten-step
per-row procedure and §7.4 explicitly forbids one unreviewed bulk translation.

**Why it matters.** The plan's method is good. The conflict is not about method but
about *trigger*: rule 8 translates a row because the row was being edited anyway; the
plan translates a row because translation is the task. That is a different policy, and
`AGENTS.md` is a truth file while the plan is a proposal.

**Status: OPEN.** Owner review rejected both poles. Pure (A) stalls the English-first
goal indefinitely; an unconstrained campaign risks exactly what rule 8 protects.

**Options.** (A) Rule 8 stands; the plan's Phase 5 is rejected as written and its
§7.5 procedure is retained for use when a row is touched. (B) Amend rule 8 to permit
reviewed batches, with the amendment recorded in `AGENTS.md` and the reason stated.
(C) Amend rule 8 for the header and column metadata only, leaving row bodies under the
original rule.

**(D) — new, drafted at owner review, and the current front-runner.**

> Permit small, reviewed translation batches under a dedicated translation protocol.
> Each row is translated individually, diff-reviewed against the original, and claim
> meaning and status may not change. The original Finnish wording remains recoverable
> in Git history or in an archival field.

The distinction option D holds onto:

```text
controlled migration      not      bulk translation
small batch               not      whole-file pass
row-level review          not      spot check
no semantic edits         not      "improved" wording
status never changes      not      recalibration in passing
```

**What option D requires before it may be used.** A deliberate, recorded amendment to
`AGENTS.md` rule 8. This is the point: rule 8 is a truth file, and a plan may not
override it silently. Changing it is legitimate; changing it by implication is not.
The amendment must state the new trigger, the batch size limit, the review
requirement, and where the original Finnish is preserved.

Until that amendment exists, **rule 8 as written governs** and no translation campaign
may begin.

**Reversible:** a wrongly translated calibrated row is recoverable from Git but may not
be *noticed*, which is the actual risk. This is why the diff-review requirement in (D)
is not a formality.
**Cost of postponing:** low mathematically — the ledger being in Finnish blocks nothing
internally — but it is the main obstacle to the English-first collaboration goal, so
the cost is to outside legibility, which is the reason the goal exists.

---

## OD-6 — Replace `NEXT_STEP.md` with `CURRENT_FOCUS.md` + `ROADMAP.md` + `docs/handoffs/`?

**Question.** PLAN-REPO-001 §14.3 proposes replacing the "continuously growing"
`NEXT_STEP.md`. The bootstrap document also assumes `CURRENT_FOCUS.md` will exist.

**Why it matters.** `NEXT_STEP.md` is authority file #4 in `RESEARCH_CONTEXT.md`'s
reading order and the file every handoff prompt points a new session at. It is 666
lines of stacked handoffs, each declaring that it supersedes the ones below where they
conflict. The stacking is genuinely hard to read — and it is also the project's
research memory, including the record that a script was lost between sessions and had
to be reimplemented. Splitting it must preserve that trail.

**Options.** (A) Split as proposed, moving each dated handoff to
`docs/handoffs/YYYY-MM-DD-*.md` unchanged and leaving `NEXT_STEP.md` as a pointer.
(B) Add `CURRENT_FOCUS.md` as a short new file and leave `NEXT_STEP.md` intact.
(C) Keep as is.

**DECIDED (owner, 2026-08-06): B.** Create a short `CURRENT_FOCUS.md`. Do **not** yet
split or replace `NEXT_STEP.md`. Archiving the handoffs into `docs/handoffs/` remains
available later, once the current-focus file has proved itself in use.

This gives the bootstrap layer the file it needs without touching a live authority
file, and it preserves the research memory `NEXT_STEP.md` carries — including records
such as a script lost between sessions and reimplemented, which a careless split would
strand.

**Reversible:** yes.
**Cost of postponing:** now none for the current-focus file. The archival split stays
deferred at low cost.

---

## OD-7 — Does `MATH_CLAIMS.md` remain the sole claim authority?

**Question.** PLAN-PLATFORM-001 §5.1 proposes `research/claims/`, `research/evidence/`
and a `claims.json` / `evidence.json` / `records.json` registry family as "core
registries". PLAN-WEB-001 §17 states `MATH_CLAIMS.md` remains authoritative "unless
the project formally replaces it".

**Why it matters.** This is the highest-risk decision in the set, and the least
obviously risky on first reading, because both plans sound compatible. They are not.
`RESEARCH_CONTEXT.md` opens by stating that two sources of truth "is exactly the
failure mode this project has repeatedly had to correct", and `NEXT_STEP.md` records a
concrete instance: `claims-export.js`'s output path silently broke in the 2026-07-30
layout move, leaving a stale root `claims.json` (85 rows) diverging from the ledger
(86 rows) with no test catching it.

A registry family is fine as a **generated export**. It is dangerous as a **parallel
authority**. The plans do not clearly say which is intended.

**Options.** (A) Ledger stays sole authority; every registry is generated, carries a
do-not-edit notice and a source commit, and CI fails if it diverges. (B) Formally
replace the ledger with structured registries — a large migration with its own rights
of review. (C) Defer.

**DECIDED (owner, 2026-08-06): A. `MATH_CLAIMS.md` remains the sole claim authority.**
This is the most important architectural decision in the set, and it was resolved
immediately rather than deferred, because the ambiguity itself is what causes drift.

Every JSON and registry form is therefore, without exception:

```text
generated                  never hand-edited
read-only                  carries a do-not-edit notice
provenance-bearing         records generator version and source commit
CI-verified                the build fails if the generated output diverges
                           from the ledger
```

`research/claims/` as a **parallel authority** is rejected. `research/claims/` as a
**generated export** is permitted under the four conditions above.

Precedent this decision rests on, from the project's own record: `claims-export.js`'s
default output path silently broke in the 2026-07-30 layout move, leaving a stale root
`claims.json` (85 rows) diverging from the ledger (86 rows) with no test catching it.
The fourth condition — CI verification of divergence — exists because of that failure,
not as a general principle.

**Reversible:** (A) yes. (B) hard.
**Cost of postponing:** now none — decided.

---

## OD-8 — Adopt a build step (Vite + TypeScript + Preact)?

**Question.** PLAN-WEB-001 §14 recommends Vite, TypeScript in strict mode, Preact,
Vitest and Playwright. PLAN-REPO-001 assumes the same `web/` structure.

**Why it matters.** `README.md` currently states, as a property of the project: "No
dependencies, no `npm install`, no build step. Node (any reasonably recent version)
and a browser are enough." `RESEARCH_CONTEXT.md` §2 gives a related argument for *not*
splitting the exact pipeline into subfolders — that it would mean guessing at
interfaces not yet known — and cites `SANALAB_PLAN.md`'s principle 4. Adopting a
toolchain is a different question from the pipeline layout, but it is the same kind of
question, and the project has a stated position on it.

Both plans confine the toolchain to `web/` and leave the Node research pipeline
dependency-free. That containment is what makes the decision tractable.

**Options.** (A) Adopt in `web/` only; the research pipeline stays dependency-free and
the README is updated to say so precisely. (B) No build step; modularize with plain ES
modules. (C) Defer until after the mathematical core extraction, which does not need a
framework.

**DECIDED (owner, 2026-08-06): C now; reconsider A after the mathematical-core
extraction.** Order of work: pure mathematical core, data, and tests first. When a new
web shell is genuinely begun, Vite + TypeScript + Preact is a reasonable choice at
that point. The Node research pipeline stays dependency-free either way.

The reasoning is that the core extraction — PLAN-WEB-001's Phase 3, and the
highest-leverage technical item in the whole intake — has no framework dependency at
all. Deciding the toolchain first would be deciding the least urgent thing first.

**Reversible:** expensive once features are ported — which is the argument for
deciding it late, not early.
**Cost of postponing:** none. Nothing before Phase 5 requires it.

---

## OD-9 — Which attention allocation governs?

**Question.** Two incompatible allocations are proposed.

```text
Bootstrap document §11
  60% repository safety and shared foundations
  30% current mathematical research
  10% documentation and review

PLAN-CHARTER-001 §5
  30% main mathematical research
  20% exact finite results and certificates
  15% algorithms and software correctness
  10% literature and formalization
  10% education
  10% community and replication
   5% AI evaluation infrastructure
```

**Why it matters.** These are not two views of the same thing. The bootstrap
allocation is a temporary bootstrap-phase split that expects to be revised after a
month; the charter allocation is a steady-state research portfolio in which
infrastructure is a minority activity. Adopting the charter's numbers during the
bootstrap would leave the rights and safety work unfinished; adopting the bootstrap's
numbers permanently is precisely the "infrastructure trap" PLAN-WEB-001 §30 and
`KNOWLEDGE_STATE.md` §8 both warn about — the latter noting that the marginal benefit
of infrastructure in this project has been measured and is decreasing.

**Options.** (A) Bootstrap 60/30/10 for a bounded period, then re-decide.
(B) Charter allocation now. (C) Neither; use the work-in-progress limits
(PLAN-CHARTER-001 §5.1: at most 3 research lines, 2 infrastructure projects, 2
pilots) instead of percentages.

**DECIDED (owner, 2026-08-06): A, for a bounded bootstrap period.**

```text
2026-08-06 – 2026-09-06
  60%  safety and shared foundations
  30%  research
  10%  documentation and review
```

**After 2026-09-06, switch to work-in-progress limits** rather than renewing
percentages:

```text
max 3 active research lines
max 2 active infrastructure projects
max 2 active educational / community pilots
```

Percentages are not maintained indefinitely, for a stated reason: they are hard to
measure honestly, whereas a WIP limit is either respected or visibly not. The
percentage split is a bootstrap-phase instrument with an expiry date; the WIP limits
(PLAN-CHARTER-001 §5.1) are the steady state.

**Reversible:** yes.
**Cost of postponing:** now none — decided, with an end date that forces the
re-decision rather than letting the bootstrap split become permanent by default. That
default is exactly the infrastructure trap PLAN-WEB-001 §30 and `KNOWLEDGE_STATE.md`
§8 both warn about.

---

## OD-10 — Canonical language for website and product content files?

**Status: OPEN.** Raised by Wave 2.

**Question.** PLAN-REPO-001 §7.3, whose English-first policy is already accepted,
requires every localized item to carry:

```yaml
key: learn.makela.open_question
source_language: en
source_revision: 7
translations:
  fi:
    status: REVIEWED
    source_revision: 7
```

— that is, an **English canonical source** with Finnish tracked as a translation
against a source revision. Both Wave 2 product documents are Finnish-first:

| Evidence | Where |
|---|---|
| `<html lang="fi">` in the shipped shell | Abelisk v3 §15, v2 §12 |
| Finnish `noscript` text | same |
| `story.fi.json` listed before `story.en.json` | v3 §13, §29 |
| "Language strategy: Finnish first, English equivalent" | Tutorial header |
| Finnish `fi` key first in every puzzle title, hint and message | v3 §22 schema |
| Entire records spec, including its mandatory disclaimer text | PLAN-RECORDS-001 |

**Why it matters.** These are not the same question, and conflating them is what
causes translation drift:

```text
delivery language     which language a learner sees first    → may be Finnish
canonical source      which language is edited and reviewed  → policy says English
```

A Finnish-first *delivery* is fully compatible with an English *canonical source*. A
Finnish-first *authoring* workflow is not — it inverts the revision tracking, and
PLAN-REPO-001 §17.1 warns that a stale translation of scientific wording is worse than
no translation, because the learner cannot tell it is stale.

The tutorial makes this concrete: its scenes carry calibrated statements
(`OPEN PROBLEM`, "a valid finite word of length one million exists"). If the Finnish
is canonical and the English is generated from it, the calibration review happens in
Finnish while the international audience reads an untracked derivative.

**Options.**

| | Option | Effect |
|---|---|---|
| A | English canonical, Finnish a tracked translation | Matches accepted policy; requires re-authoring the Wave 2 content plans' language ordering |
| B | Finnish canonical for learner-facing content, English canonical for everything else | Matches the product plans; requires a stated exception to §7.3 with a reason |
| C | English canonical for any string carrying a mathematical or claim-bearing statement; Finnish canonical permitted for purely narrative strings | Splits by risk rather than by surface |

**DECIDED (owner, 2026-08-06): A.**

> English is the canonical source language for new public product, pedagogy, website,
> and structured content files. Finnish and other languages are maintained as tracked
> translations. **The delivery language may be Finnish even when the canonical source
> is English.**

The last sentence is the operative one: it separates the two axes that were being
conflated. A Finnish-first learner experience is fully permitted; what changes is
which file is edited and reviewed first.

**Scope limit, and it matters.** This governs **new** content. Existing Finnish source
documents are **not** to be bulk-translated during bootstrap. Their later migration
requires a separately approved, reviewed process — the same principle `AGENTS.md`
rule 8 applies to the ledger, now stated for documents generally. This keeps OD-10
from becoming a back door into the translation campaign that OD-5 has not authorized.

**Consequences for the Wave 2 plans.** The Abelisk and tutorial content-file ordering
(`story.fi.json` before `story.en.json`, `<html lang="fi">`, "Finnish first") is an
authoring-order question, not a delivery question. The plans need their language
ordering re-expressed; their delivery design is unaffected.

**Note.** The records spec's Finnish disclaimer falls under the scope limit above: it
is an existing calibrated artifact, not new content, and is not translated during
bootstrap.

---

## OD-11 — Does the flagship replayable product sit on solved or open mathematics?

**Status: OPEN.** Raised by Wave 2.

**Question.** Abelisk v3 §4 splits the product deliberately:

```text
Classic Abelisk     four symbols a,b,c,d
                    "stable replayable logic puzzle"

Mäkelä's Door       ternary a,b,c; aa,bb,cc allowed; longer squares forbidden
                    "authentic open mathematical question"
```

**Why it matters, and it is not a UI question.** The two sit on opposite sides of the
project's own knowledge boundary:

| | Mathematical status | Ledger |
|---|---|---|
| Four letters, Abelian-square-free | **Solved** — infinite words exist (Keränen) | row 3, `PRIMARY` Level 2 |
| Ternary, Mäkelä's condition | **Open** for K = 2…5 | row 4, `PRIMARY` Level 2 |

So the flagship replayable experience — the one designed for Sudoku-like return
visits, the Daily puzzle, the curated archive — would rest on settled mathematics,
while the open problem the laboratory actually exists to attack becomes an optional
side chamber.

**The case for v3's split.** It is defensible and possibly correct. A replayable
puzzle needs a rule with reliable, authorable solution structure; a four-symbol
alphabet gives richer and more controllable puzzles, as §4 says. Building the Daily
puzzle on an open problem would mean authoring puzzles inside a space nobody can
characterize.

**The case against.** The project's three missions are discover, teach, train. If the
most-played surface teaches a solved problem, the education mission drifts from the
research mission — precisely the "audience drift" PLAN-REPO-001 §17.2 warns about, and
exactly what PLAN-CHARTER-001 §37's two-way teaching rule exists to prevent
("every educational activity should point back to current research evidence").

**Options.** (A) Accept v3's split as written, with the UI making the rule change
explicit as §4 requires. (B) Make the ternary Mäkelä rule the flagship and treat the
four-symbol mode as a training ground. (C) Accept the split but require every Classic
Abelisk session to surface a route into Mäkelä's Door, so the solved case is
explicitly a doorway rather than a destination.

**DECIDED (owner, 2026-08-06): a layered structure — option A with the option C
safeguard made mandatory.**

```text
Classic Abelisk          four-letter setting
                         the stable, solved, puzzle-generative foundation

Mäkelä Door /            ternary setting
Research Chamber         introduces the open problem EXPLICITLY as open mathematics
```

**Three binding constraints attached to the decision:**

1. **The game must never imply** that solving a finite puzzle, reaching Master mode,
   or producing a long finite word solves or provides evidence for the infinite
   conjecture. This is `AGENTS.md` rule 16 as a product requirement, and it forecloses
   the exact failure the tutorial's §9.4 and §24 Failure 6 already name.
2. **The four-letter and ternary settings must be visually and terminologically
   distinguished.** v3 §4 already requires the UI to make the rule change explicit;
   this raises it from a UI note to a binding constraint, and extends it to
   terminology.
3. The layering answers the mission-drift objection directly: the solved case is the
   **foundation**, and the open problem is a named chamber the player reaches, not an
   optional aside.

**Reversible:** the alphabet is a rule-config value, so the engine cost is low. The
authored puzzle content is **not** cheaply reversible — puzzles authored for four
symbols do not transfer to three. Deciding before authoring begins was the cheap
moment, and it has been taken.

---

## OD-12 — One R0–R5 scale, or two?

**Status: OPEN.** Raised by Wave 3.

**Question.** Two intake documents define levels `R0`–`R5`, with the same labels and
different meanings.

| Level | PLAN-PLATFORM-001 §25 — *reproducibility* | PLAN-CONJ-001 §15.3 — *independence* |
|---|---|---|
| R0 | described; no runnable artifact | same program, same environment |
| R1 | artifact available | clean clone, same program |
| R2 | internally reproducible from a clean checkout | different CLI or data structure, **same core library** |
| R3 | independently reimplemented | different implementation, same mathematical method |
| R4 | externally replicated | different method or representation |
| R5 | formally or proof audited | proof or formal verification not needing the original search |

**Why it matters.** The two scales measure genuinely different things — *can this be
re-run?* versus *how independent is the check?* — and they diverge most at R2, where
one means "clean checkout reproduces" and the other means "different CLI, shared core"
(which PLAN-CONJ-001 §8.2 elsewhere says is **not** an independent check at all).

If both reach metadata, a record or conjecture labelled `R3` is ambiguous on exactly
the axis this project has already been burned by: `KNOWLEDGE_STATE.md` §4 rejection
#10 records a verifier that "worked flawlessly but did not reach its own target — the
independence axis was wrong."

**Options.**

| | Option | Effect |
|---|---|---|
| A | One scale, renamed by dimension — e.g. `REPRO-0…5` and `INDEP-0…5` | Both concepts survive; ambiguity impossible |
| B | Adopt PLAN-CONJ-001's independence ladder as the single `R` scale; express reproducibility as separate boolean fields | Fewer labels; loses the reproducibility gradient |
| C | Adopt PLAN-PLATFORM-001's reproducibility ladder as `R`; express independence as a separate disclosure per PLAN-REC-001 §8.4 | Fewer labels; independence becomes prose rather than a level |

**DECIDED (owner, 2026-08-06): A — separate the two axes. `R0–R5` must not be used for
both meanings.**

```text
REP-0 … REP-5     reproducibility and preservation
IND-0 … IND-5     verifier independence
```

**The two scores must be reported separately.** A result may have high reproducibility
and weak independence, or the reverse. **No combined score may hide that
distinction** — and no single letter may be reused for both.

This is the axis the project has already been burned on: `KNOWLEDGE_STATE.md` §4
rejection #10 records a verifier that "worked flawlessly but did not reach its own
target — the independence axis was wrong." A high `REP` score would not have caught
that. A separate `IND` score is what makes the failure visible.

**Wave 4 constraint:** Wave 4 may propose exact definitions for each level, but must
**not** silently replace existing labels outside `docs/program/`. Any relabelling of
material already using `R0–R5` is a separate approved task.

**Reversible:** yes today; expensive once labels are written into record and
conjecture metadata and into published challenge packets.
**Cost of postponing:** now none — decided before either registry exists, which was
the cheap moment.

---

## OD-13 — Where does the Java COW Backtracker live?

**Status: OPEN.** Raised by Wave 3.

**Question.** `JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md` documents an existing,
source-audited engine, and the intake includes a checksum sidecar naming three
artifacts. **None of them is in this repository:**

```text
8ad1ba75…  java-cow-backtracker-v1.2.zip
62cdc183…  java-cow-backtracker-v1.2/build/cow-backtracker.jar
7bf021e0…  java-cow-backtracker-v1.2/SOURCE_AUDIT_REPORT.md
```

Verified absent: no `java-cow-backtracker*` directory, no `.jar`, no
`SOURCE_AUDIT_REPORT.md`.

**Why it matters.** The guide is the project's most detailed software reference and the
engine is the intended producer of publishable records — yet the repository documents
a tool it does not contain. Three consequences:

1. **The audit cannot be inspected.** `SOURCE_AUDIT_REPORT.md` is cited as the basis
   for calling revision 1.2 "audited". Nobody working from this repository can read it.
2. **The checksums pin nothing today.** They are valuable *if* the artifacts appear;
   right now they assert identity for files that cannot be checked.
3. **Reproducibility requires the source.** `PLAN-CONJ-001` §11.2 binds every result to
   a definition version, a commit, and a verifier version. A result produced by an
   engine outside version control cannot satisfy that.

**Mitigating fact:** the main class is `fi.joonashuhta.cowsearch.Main`, so the engine is
the maintainer's own work. The rights dimension is therefore simple; the archival and
reproducibility dimensions are not.

**Options.**

| | Option | Trade-off |
|---|---|---|
| A | Vendor the Java source into the repository (not the jar) | Full reproducibility and inspectable audit; adds a second language and a build to a repo that currently has no build step |
| B | Keep it external; publish it as a tagged release artifact with checksums, and reference the release from the guide | Keeps the repo dependency-free; reproducibility depends on the release surviving |
| C | Vendor source **and** `SOURCE_AUDIT_REPORT.md`, keep binaries out entirely | Inspectable audit and rebuildable engine; binaries never enter history |

**DECIDED (owner, 2026-08-06): a separate canonical repository with immutable versioned
releases. Approved as target architecture; implementation deferred.**

```text
canonical source repository   word-structures/java-cow-backtracker
immutable versioned release   v1.2
release artifacts             source archive, JAR, audit report,
                              checksums, release notes

the main research repository stores
    a pinned version reference
    the release checksum
    usage documentation
    the scientific role of the tool
```

**Two constraints attached:**

1. **The main repository must not imply that checksums alone constitute an available
   or independently inspectable artifact.** This is the defect Wave 3 found: three
   checksums are present, all three files are absent, and a reader could reasonably
   conclude the audit had been made available. Wherever the checksums appear, the
   availability status must appear beside them.
2. **The main-repository documentation must use version 1.2, not revision 1.1.** This
   supersedes the guide's §34 provenance text, which names the revision carrying the
   checkpoint/resume defect that 1.2 fixed.

**Implementation is deferred.** Until the Word Structures GitHub organization exists,
**do not move or publish anything automatically.** This is an approved target, not an
authorization to migrate; the move belongs to a bounded migration-and-release task.

**Interacts with:** OD-1 (nothing new enters this repository's history, so the target
architecture does not enlarge the remediation problem), OD-3 (licensing of the
released source), and OD-8 (a Java build in a separate repository, distinct from the
web-toolchain question).

**Reversible:** yes — nothing is moved yet, and the pinned-reference model can be
replaced by vendoring later if the organization does not materialize.
**Cost of postponing implementation:** rises the moment a record is published citing
the engine, because the provenance chain would reference software nobody can obtain or
rebuild. That is a gate on publication, not on the current work.

---

## Two process questions, separate from the decisions above

**P-1 — Branch policy for this bootstrap.** The bootstrap document §16 states the
bootstrap must not run directly on an unprotected `main` and recommends
`chore/program-bootstrap`. This session ran on `main`. It did **not** create a branch,
because project memory records that several Claude Code windows work this worktree
concurrently, and switching branches under another session is more disruptive than
four uncommitted new files. The four Wave 0/1 documents are new files under
`docs/program/`; nothing existing was modified. How they should be branched and
committed is the owner's call.

**P-2 — Working-tree state.** The tree is not clean. Untracked: six
`checkpoint_worker_*.json`, seven `record_word_*.txt` / `progressive_log.txt`, and
several `scratch/` files. Some appear to be research outputs that may belong in the
record, and some appear to be transient. They should be triaged before any branch or
history operation, not swept.
