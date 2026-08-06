# Wave 1 — Governance and Architecture Synthesis

**Wave:** 1 (the five platform, architecture, and governance plans)
**Produced:** 2026-08-06
**Produced by:** program bootstrap architect session, read-only
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §5.1, §6, §7
**Status:** `ACCEPTED_WITH_CORRECTIONS` by the project owner, 2026-08-06; revised
accordingly — **stop after Wave 1 is intentional**

Nothing in this document authorizes implementation. Every plan reviewed here has
status `PROPOSED`. Detail is not approval.

---

## 0. Document identity

The bootstrap document's Appendix A lists the intake filenames with a `(1)` suffix.
On disk, 14 of the 15 files carry that suffix stripped; only
`RESEARCH_FRONTIER_COMMUNITY_FORWARD_MOTION_CHARTER_V1 (1).md` retains it. Filenames
were therefore treated as opaque, as instructed, and identity was established by
SHA-256 and first-level heading.

**All five Wave 1 checksums match Appendix A exactly.**

| Heading | SHA-256 | Lines | Match |
|---|---|---:|---|
| Sustainable Web Architecture, Refactor, Naming, and GitHub Integration Plan | `92c56d8f30c54c4d29bdc1c01ac1bd0a097a23fedc68b1feab2dd51253f4eeb7` | 2444 | yes |
| Repository–Website Integration, Audience, Language, and AI Implementation Plan | `616715299c24caf98fb997e7dd5737a5420b0318862dbde076214fde9ce81397` | 2782 | yes |
| Open Participation and Evidence Governance Plan | `b6741ef33f58c31e5c44a39c58869e191271881efa9758bd51a919720791c6d1` | 2181 | yes |
| Open Research, Education, and AI Platform Plan | `913372ac82593d8fa121ae9ccbed51709d153bfa520f2d9cf7227c514a1c8912` | 1745 | yes |
| Research Frontier, Community Growth, and Forward-Motion Charter | `7d4283e8a43776afb505e7aea616d590c2df92a87ede711cc26aba371f185efa` | 2158 | yes |

Nothing was renamed or moved.

---

## 1. Plan cards

### PLAN-WEB-001

```yaml
plan_id: PLAN-WEB-001
source_file: docs/plans/intake/SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN.md
source_sha256: 92c56d8f30c54c4d29bdc1c01ac1bd0a097a23fedc68b1feab2dd51253f4eeb7
title: Sustainable Web Architecture, Refactor, Naming, and GitHub Integration Plan
document_type: [architecture, implementation]
status_in_source: "implementation roadmap and architecture policy"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [infrastructure, education, research, community]
depends_on: []
conflicts_with: [PLAN-PLATFORM-001]
supersedes: []
superseded_by: []
owner_decisions_required: [OD-1, OD-4, OD-8]
candidate_tasks:
  - audit external artifacts and Git history (its Issue 2, P0)
  - add artifact-denylist CI (its Issue 3, P0)
  - audit self-certifying wording in the browser page (its Issue 1, P0)
  - baseline screenshots and smoke tests for the current page (its Issue 4, P0)
do_not_implement_directly:
  - Vite / TypeScript / Preact adoption (OD-8)
  - Git-history rewriting (OD-1)
  - the 19-to-7 route migration, before the core and claims pipeline exist
summary: >
  Ten-phase strangler refactor from one large HTML page to a static modular
  monolith. Deliberately puts repository safety and browser-report honesty ahead
  of visible redesign, and states its own progress limits (one active
  architecture epic; pause any refactor that produces no measurable benefit).
  Its Phase 0 ordering agrees with the bootstrap document's ordering.
```

**What it explicitly forbids or postpones.** Rewriting all CSS at once; introducing a
server or microservices; converting research scripts into packages; retiring the
legacy page before feature parity; continuing the migration at day 90 merely because
a plan exists.

**Its strongest contribution.** §5 is the only place in the intake that resolves the
naming question honestly: `The Graveyard` is reserved for `NECESSARY` closures,
`Museum of Mistakes` for pedagogical curation of actual errors, and
`Negative Results & Research Lessons` becomes the authoritative umbrella. This
directly respects the NECESSARY / BOUNDED / CONTEXTUAL finality classification that
`NEGATIVE_RESULTS.md` already carries.

**Where it must be read against repository authority.** §17 states `MATH_CLAIMS.md`
remains authoritative "unless the project formally replaces it". That qualifier is
the seam where PLAN-PLATFORM-001 proposes a parallel registry — see OD-7.

---

### PLAN-REPO-001

```yaml
plan_id: PLAN-REPO-001
source_file: docs/plans/intake/REPOSITORY_WEBSITE_AUDIENCE_LANGUAGE_AND_AI_IMPLEMENTATION_PLAN.md
source_sha256: 616715299c24caf98fb997e7dd5737a5420b0318862dbde076214fde9ce81397
title: Repository–Website Integration, Audience, Language, and AI Implementation Plan
document_type: [strategy, architecture, implementation, governance]
status_in_source: "proposed implementation plan"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [infrastructure, education, research, ai, community]
depends_on: [PLAN-WEB-001]
conflicts_with: [PLAN-PLATFORM-001]
supersedes: []
superseded_by: []
owner_decisions_required: [OD-4, OD-5, OD-6, OD-7]
candidate_tasks:
  - create docs/README.md and per-area indexes
  - create a repository language inventory with a disposition per item
  - README audience-doorway redesign
  - specify the website-to-GitHub link contract (living vs immutable links)
do_not_implement_directly:
  - batch translation of MATH_CLAIMS.md (OD-5, conflicts with AGENTS.md rule 8)
  - replacing NEXT_STEP.md (OD-6)
  - the large docs/ and web/ directory restructure, before indexes exist
summary: >
  "One evidence core, several audience-specific views." Nine audiences, each with
  an entry point and a next action, including the AI coding agent as an explicitly
  operational — not public — audience. Contains the intake's clearest statement of
  build-time-only GitHub integration (no runtime API calls) and the living-versus-
  immutable link distinction.
```

**Its self-declared companion** is PLAN-WEB-001, and the two agree on the website
information architecture. They do not agree with PLAN-PLATFORM-001 (OD-4).

**Where it conflicts with canonical authority.** §7.4 correctly forbids *one
unreviewed automated bulk translation* of the ledger, and §7.5 gives a careful
ten-step per-row procedure — but Phase 5 then schedules a prioritized migration
campaign ("`MATH_CLAIMS.md` headings and metadata; highest-load active claim rows;
…"). `AGENTS.md` rule 8 permits translation of a row **only when that row is touched
anyway**. A campaign that touches rows *in order to translate them* is a different
policy, however careful its per-row method. Recorded as OD-5. AGENTS.md wins unless
the owner amends rule 8.

**Its §6.1 root-file list omits** `NEXT_STEP.md`, `EPISTEMIC_DISCIPLINE.md`,
`THE_BRIDGE_STORY.md`, `THE_BRIDGE_STORY_EXTENDED.md` and
`BACKTRACKER_ARCHITECTURE.md`, while listing `CURRENT_FOCUS.md` and `ROADMAP.md`,
which do not exist. Adopting the list literally would silently demote five present
files, one of which (`EPISTEMIC_DISCIPLINE.md`) is a truth file.

---

### PLAN-GOV-001

```yaml
plan_id: PLAN-GOV-001
source_file: docs/plans/intake/OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN.md
source_sha256: b6741ef33f58c31e5c44a39c58869e191271881efa9758bd51a919720791c6d1
title: Open Participation and Evidence Governance Plan
document_type: [governance]
status_in_source: "proposed governance and implementation plan"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [community, research, education, ai]
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-9]
candidate_tasks:
  - write CREDIT_AND_AUTHORSHIP_POLICY.md
  - add CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md
  - add issue forms and a pull-request template
  - add branch protection and required checks
  - update CONTRIBUTING.md with the three-layer participation model
do_not_implement_directly:
  - broad public recruitment, before the rights review in OD-1 is settled
  - the full role hierarchy, before any contributors exist
summary: >
  "Open contribution, curated acceptance." Three layers (open discussion /
  reviewable submissions / canonical evidence core), six review classes scaled to
  risk, and an explicit evidence-promotion pipeline
  IDEA → CANDIDATE → TESTED → REPRODUCED → REVIEWED → ACCEPTED → ARCHIVED.
  Its §23 "minimum viable governance" is deliberately much smaller than the rest
  of the document.
```

**The least conflicted document in Wave 1.** It proposes no architecture, no
licensing change, and no restructuring of canonical files. It extends
`CONTRIBUTING.md` and `AGENTS.md` rule 5 rather than competing with them.

**Two provisions that are more than administrative:**

- §6 Class 5 quarantines exceptional scientific claims from normal website claims and
  states "The repository must never imply that a merge alone constitutes peer review."
- §13.1 states an AI-generated checker is not independent merely because it was
  generated in another session, and requires independence to be argued in terms of
  code lineage, algorithmic independence, shared test data, shared assumptions, and
  model exposure. This is the same distinction `EPISTEMIC_DISCIPLINE.md` §5 makes and
  that `KNOWLEDGE_STATE.md` records as rejection #10 ("the independence axis was
  wrong").

**Its own stated constraint:** §10.5, do not promise review capacity that does not
exist; §24 Phase 2, enable Discussions but do not yet advertise broadly.

---

### PLAN-PLATFORM-001

```yaml
plan_id: PLAN-PLATFORM-001
source_file: docs/plans/intake/OPEN_RESEARCH_EDUCATION_AI_PLATFORM_PLAN.md
source_sha256: 913372ac82593d8fa121ae9ccbed51709d153bfa520f2d9cf7227c514a1c8912
title: Open Research, Education, and AI Platform Plan
document_type: [strategy, governance]
status_in_source: "strategic implementation plan"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [research, education, ai, community, infrastructure]
depends_on: []
conflicts_with: [PLAN-WEB-001, PLAN-REPO-001]
supersedes: []
superseded_by: []
owner_decisions_required: [OD-3, OD-4, OD-7]
candidate_tasks:
  - evidence-passport schema
  - reproducibility levels R0-R5 as a labelling vocabulary
  - content-type firewall vocabulary for website statements
  - AI contamination ledger
do_not_implement_directly:
  - relicensing to 0BSD + CC0 (OD-3, needs a contributor-rights audit)
  - the research/claims/ registry family (OD-7, risks a second claim authority)
  - its top-level website structure (OD-4, contradicts PLAN-WEB-001)
summary: >
  "One evidence core, three missions: discover, teach, train." Contributes the
  evidence passport, the claim lineage graph, the content-type firewall, the
  R0-R5 reproducibility ladder, and the discovery-versus-frozen-validation corpus
  separation. Also contains the intake's two most consequential proposals:
  a licensing change and a parallel claims registry.
```

**Its most valuable single rule** is §37, "No silent authority transfer": no statement
gains authority merely by moving from chat, code comment, notebook, issue, website,
lesson, or AI corpus into another project surface. That is a generalization of
`AGENTS.md` rule 7 to every surface, and it costs nothing to adopt as wording.

**Three direct contradictions with PLAN-WEB-001 and PLAN-REPO-001:**

1. **Top-level website structure.** §27 proposes
   `Home / Research / Learn / AI Lab / Records / Challenges / Evidence / About`.
   PLAN-WEB-001 §3 and PLAN-REPO-001 §5 propose
   `Home / Learn / Explore / Research / Evidence / Abelisk / Community`.
   Abelisk has no top-level route in PLAN-PLATFORM-001; AI Lab and Challenges have no
   top-level route in the other two. Recorded as OD-4.
2. **Museum of Mistakes location.** §12 places it at top-level `/museum-of-mistakes`;
   PLAN-WEB-001 §5.2 places it at `/learn/museum-of-mistakes/` explicitly *below* the
   authoritative umbrella, precisely so a memorable name cannot replace a
   classification.
3. **Claims authority.** §5.1 proposes `research/claims/` plus a `claims.json` family
   as core registries. PLAN-WEB-001 §17 keeps `MATH_CLAIMS.md` authoritative. Two
   sources of truth is the failure mode `RESEARCH_CONTEXT.md` opens by warning about.
   Recorded as OD-7.

**Licensing.** §3.3 recommends `Code: 0BSD` / `documentation and datasets: CC0 1.0`,
and §3.2 notes that the conventional MIT + CC BY alternative "does not fully match the
stated 'reference only occasionally' preference". The repository is currently MIT and
its `README.md` asks users to cite specific ledger rows. §3.3 adds its own precondition
— "confirm that all currently committed material can legally be relicensed". Recorded
as OD-3.

---

### PLAN-CHARTER-001

```yaml
plan_id: PLAN-CHARTER-001
source_file: "docs/plans/intake/RESEARCH_FRONTIER_COMMUNITY_FORWARD_MOTION_CHARTER_V1 (1).md"
source_sha256: 7d4283e8a43776afb505e7aea616d590c2df92a87ede711cc26aba371f185efa
title: Research Frontier, Community Growth, and Forward-Motion Charter
document_type: [strategy, research-program]
status_in_source: "strategic research and community charter"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [research, education, community, ai]
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-9]
candidate_tasks:
  - docs/RESEARCH_PROGRAM_MAP.md (dependency tree, not a flat question list)
  - the Next Executable Question field as a required tail on every active line
  - proof-carrying computation standard (certificate families)
do_not_implement_directly:
  - COW-H1..H14, EDU-H1..H2, AI-H1..H2 — project hypotheses, not literature claims
  - the 12-session literature seminar, before its sources are traced
  - its portfolio allocation (OD-9, conflicts with the bootstrap document)
summary: >
  A long-term operating system for a project whose central conjecture may stay
  open indefinitely. Contributes the forward-motion cycle
  (READ → FORMALIZE → CHALLENGE → COMPUTE → VERIFY → INTERPRET → TEACH → INVITE
  → ARCHIVE → REVIEW), a seven-lane research portfolio with work-in-progress
  limits, and the progress-substitution rule for blocked lines.
```

**It polices its own authority better than any other Wave 1 document.** §43 separates
literature-derived guidance from project-specific proposals and states outright that
"Project hypotheses must be entered into the conjecture pipeline before being
presented as research claims." §15.3, §16.3, §17.3 each label their hypotheses as
original project hypotheses and attach kill conditions.

**Two rules that are directly usable at zero cost:**

- §36, the Next Executable Question rule: if the `next_executable_question` block
  cannot be written for a research line, the idea is not ready for active status.
- §35.3, the quarterly question: "Which research line would we stop if it belonged to
  someone else?"

**Where it needs source discipline before use.** §25 and §45 name specific literature
(Eyidoğan/Göral/Tanısalı 2026 template-sieve preprint; Radoszewski et al. on hardness;
Ochem & Pinlou on entropy compression; Henshall & Shallit; Mousavi). None of these
appear in `LITERATURE_COVERAGE.md` as opened. §25 itself says "Do not rely on title or
abstract alone for implementation." Under `AGENTS.md` rule 1, none may be cited in any
project file before being fetched and quoted.

**One numeric conflict.** §5's portfolio allocation (30/20/15/10/10/10/5) and the
bootstrap document's §11 allocation (60% repository safety / 30% research / 10% docs)
cannot both hold. Recorded as OD-9.

---

## 2. What all five agree on

Agreement across five independently written documents is the strongest signal Wave 1
produces. These recommendations require no arbitration, though they still require
owner activation.

1. **Browser computation is never authoritative.** All five require an explicit label,
   and PLAN-WEB-001 §7 and PLAN-GOV-001 §4.7 both require generated reports to open
   with an unreviewed marker. This aligns with `MATH_CLAIMS.md` row 26, which records
   the concrete failure that motivates it.
2. **Evidence promotion must be an explicit event, never a side effect of moving text
   between surfaces.** Stated as a pipeline in PLAN-GOV-001 §7, as the no-silent-
   authority-transfer rule in PLAN-PLATFORM-001 §37, as a promotion gap in
   PLAN-REPO-001 §17.10, and as the forward-motion cycle in PLAN-CHARTER-001 §3.
3. **Independence must be argued, not asserted** — particularly for AI-generated
   checkers.
4. **Structured contribution surfaces before broad recruitment**: Discussions, issue
   forms, PR template, branch protection, required CI.
5. **Immutable links for evidence, living links for guidance**, labelled differently
   in the UI.
6. **Corrections are part of the record**, with a user-facing channel, never silent
   deletion or redirect.
7. **Stop-and-evaluate gates.** Every plan sets one: PLAN-WEB-001 at day 90 with
   progress limits, PLAN-REPO-001 at day 90 with seven outcome questions, PLAN-GOV-001
   at six months, PLAN-CHARTER-001 quarterly per line.

---

## 3. Direct contradictions

Conflicts are recorded at **topic** level. A topic conflict does not make a plan
rejectable as a whole — PLAN-PLATFORM-001 conflicts with PLAN-WEB-001 on three
topics while contributing the evidence passport, the reproducibility ladder and the
no-silent-authority-transfer rule, none of which is contested by anyone.

| # | Topic | Positions | Decision | Status |
|---|---|---|---|---|
| 1 | Top-level website structure | PLAN-WEB-001 / PLAN-REPO-001 vs PLAN-PLATFORM-001 §27 | OD-4 | **decided — A** |
| 2 | Museum of Mistakes placement | `/learn/museum-of-mistakes/` vs top-level `/museum-of-mistakes` | OD-4 | **decided — under `/learn/`** |
| 3 | Claim authority | ledger-only vs parallel `research/claims/` registries | OD-7 | **decided — ledger sole authority** |
| 4 | Ledger translation | `AGENTS.md` rule 8 vs PLAN-REPO-001 Phase 5 campaign | OD-5 | open — option D drafted |
| 5 | Licensing | MIT + cite-please vs 0BSD + CC0 | OD-3 | **decided — defer** |
| 6 | Attention allocation | bootstrap 60/30/10 vs charter 30/20/15/10/10/10/5 | OD-9 | **decided — 60/30/10 to 2026-09-06** |
| 7 | `NEXT_STEP.md` | authority file #4 vs replaced by three new files | OD-6 | **decided — keep, add `CURRENT_FOCUS.md`** |

---

## 4. Irreversible or hard-to-reverse decisions hidden inside Wave 1

Listed because a phased plan can make an irreversible step look like step 3 of 10.

- **Git-history rewriting** (PLAN-WEB-001 §11, Phase 0). Changes every commit SHA and
  invalidates SHA references already written into `MATH_CLAIMS.md` and `NEXT_STEP.md`.
  OD-1.
- **Relicensing** (PLAN-PLATFORM-001 §3.3). CC0 in particular cannot be withdrawn from
  material already released under it. OD-3.
- **Public recruitment.** PLAN-WEB-001 §11.2 states the rights work "should be
  completed before actively recruiting many contributors", and history rewriting
  becomes far more disruptive once external clones exist. Ordering matters, and the
  two plans that propose recruitment phases do not both restate this dependency.
- **Adopting a build step** (OD-8). `README.md` currently states "No dependencies, no
  `npm install`, no build step" as a property of the project; a contributor who
  cloned on that basis is affected by the change.

---

## 5. Git and rights risks — verified, not quoted

Verification detail is in `AUTHORITY_MAP.md` §8.4. In summary:

- Copyrighted PDFs were added and later deleted; both commits remain reachable on
  `main`, so the blobs are still retrievable.
- The 2026-07-31 rewrite recorded in `.gitignore` covered four non-PDF files only.
- One record-word dataset file is currently tracked.
- No `.github/` exists, so no artifact-denylist CI can currently reject a repeat.

**The repository is already public.** Containment cannot undo prior exposure: anyone
who has cloned already holds the blobs. What remediation can still do is stop further
distribution from the canonical remote, prevent recurrence, and put the project in a
defensible position. It cannot make the material never have been public.

Two separable P0 tasks follow, and the second does **not** wait for the first:

1. **Artifact-denylist CI.** The cheapest risk reduction available and the only fully
   reversible one. Prevents recurrence without touching history. Independent of OD-1.
2. **Dataset provenance triage** for
   `datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt`. Its provenance is
   unresolved and the file is tracked in a public repository. Unlike the history
   question, this is fixable today with `git rm --cached` plus a `.gitignore` line.
   Tracked as OD-2, preliminary direction: quarantine until traced.

---

## 6. Minimum repository bootstrap that all five plans support

Offered as the intersection, not as a recommendation to start:

```text
1. artifact-denylist CI + strengthened .gitignore     (prevents recurrence, reversible)
2. .github/ issue forms + PR template                 (no canonical file touched)
3. CODE_OF_CONDUCT.md, SECURITY.md, SUPPORT.md        (no canonical file touched)
4. branch protection + required checks on main        (reversible setting)
5. baseline capture of the current browser page       (pure measurement)
6. make CLAUDE.md a router to AGENTS.md               (AUTHORITY_MAP §8.1)
```

Items 1–5 are drawn from the plans. Item 6 is this session's own finding, not any
plan's proposal, and is listed separately for that reason.

**Item 6 was changed at owner review.** The first draft proposed syncing `CLAUDE.md`
to `AGENTS.md`'s 17 rules. That fix recreates the same drift the moment `AGENTS.md`
gains rule 18. The durable form is a short mandatory router — "read and obey
`AGENTS.md` in full; this file must not duplicate or abbreviate its numbered rules" —
plus a drift check that fails if a numbered rule body reappears in `CLAUDE.md`. One
canonical rule set, mechanically enforced, instead of two copies maintained by
discipline.

**What these six do and do not require.** All six are reversible, and none touches
`MATH_CLAIMS.md`, `src/`, `scripts/`, `tests/`, or the research pipeline. None
requires resolving the irreversible owner decisions.

They are not, however, decision-free. Corrected at owner review:

- items 2 and 4 require GitHub repository or organisation administration rights, and
  a settled answer to who holds them;
- item 1's denylist contents depend partly on the rights and artifact inventory that
  OD-1 and OD-2 also need;
- item 6 modifies a canonical governance file and, in the router form, implies a new
  `check-claims-drift.js` check.

**Each still requires an approved bounded task specification before it is started.**
"Does not need an irreversible decision" is not the same as "may be started without
authorization".

---

## 7. What Wave 1 deliberately did not do

- No Wave 2 documents were read (Abelisk v1/v2/v3, Mäkelä tutorial, records spec).
  Their supersession relationships are therefore **unassessed**, including the
  v3-supersedes-v2 case the bootstrap document flags.
- No Wave 3 documents were read (conjecture pipeline, record-hunting pipeline,
  dictionary backtracker, cut-and-certify, Java COW guide).
- No roadmap, no plan inventory, no dependency-and-conflict map, no `TASK-0001.md`.
  Those are Wave 4.
- `node tests/test.js` and `node scripts/check-claims-drift.js` were **not run**. No
  statement here should be read as confirming the repository's current test status.

---

## 8. First human checkpoint — answered

Per the bootstrap document §24. Answered by the project owner on 2026-08-06; recorded
here so the next session does not re-ask them.

| # | Question | Answer |
|---|---|---|
| 1 | Is the authority map correct? | With corrections: authority is now classified **by domain**, not as one undifferentiated "truth" group |
| 2 | Did the session distinguish plans from canonical rules? | Yes |
| 3 | Is repository safety correctly placed before website redesign? | Yes |
| 4 | Which decisions remain open? | OD-1, OD-2, OD-5. Six others decided — see `OWNER_DECISIONS_REQUIRED.md` |
| 5 | May the agent continue to Wave 2? | Yes, after these corrections were applied |

Two further corrections were made that the checkpoint questions did not cover:

- an inference drawn from `MATH_CLAIMS.md` **token occurrence counts** was withdrawn;
  a row-aware census is required before any statement about the Level 1 / Level 2
  proportion;
- `NEGATIVE_RESULTS.md`, `LITERATURE_COVERAGE.md` and `OPEN_RESEARCH_QUESTIONS.md`
  were reclassified from "derived files" to **domain registers constrained by the
  ledger** — each is authoritative within its own domain.
