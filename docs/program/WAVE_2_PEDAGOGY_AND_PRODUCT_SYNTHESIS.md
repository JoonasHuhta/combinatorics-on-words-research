# Wave 2 — Pedagogy and Product Synthesis

**Wave:** 2 (Abelisk product line, Mäkelä tutorial, records section)
**Produced:** 2026-08-06
**Produced by:** program bootstrap architect session, read-only
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §5.2, §6, §7
**Status:** `ACCEPTED_WITH_DECISIONS` by the project owner, 2026-08-06; revised
accordingly

Nothing here authorizes implementation. ABELISK v3 is now `ACCEPTED` as the
**product-design authority** — that fixes which document is authoritative, not that
any of it may be built. Each build step still requires a bounded task.

No feature from a superseded plan has been restored automatically.

---

## Owner decisions recorded at the Wave 2 review (2026-08-06)

| # | Decision |
|---|---|
| 1 | **ABELISK v3 ACCEPTED** as active product-design authority. Supersession of v2 ratified, `effective: true`. **v2 SUPERSEDED.** Foundation document reclassified **HISTORICAL / REFERENCE** |
| 2 | **OD-10 resolved** — English is the canonical source language for new public product, pedagogy, website and structured content. Delivery language may still be Finnish. Existing Finnish sources are **not** bulk-translated during bootstrap |
| 3 | **OD-11 resolved** — layered structure: four-letter Classic Abelisk as the solved, puzzle-generative foundation; ternary Mäkelä Door / Research Chamber as explicitly open mathematics. Three binding constraints, §14 |
| 4 | **Four-layer verifier architecture preserved.** The shared core must support Abelisk's stronger requirements; the tutorial may use a strict subset |
| 5 | **Motor accessibility restored as an active requirement.** Recorded as an accessibility correction, **not** a restoration of superseded game scope |
| 6 | **Pedagogical claims are design hypotheses only.** Four wording labels now required |
| 7 | **At least one transfer task required** in the first pedagogy pilot |
| 8 | **"Veikko's rule" prohibited** as a canonical mathematical name for FORBID4 |
| 9 | **g85, additive-alphabet and claim-ID relationships stay conditional** until verified |

**Preservation rule attached to decision 1:** superseded documents remain preserved
unchanged in `docs/plans/intake/`. Their ideas may be reused **only when explicitly
selected by a later approved task**. Removed mechanics are never restored
automatically.

---

## 0. Document identity

All five Wave 2 checksums match Appendix A exactly.

| Heading | SHA-256 | Lines | Match |
|---|---|---:|---|
| ABELISK v3 — Logic Puzzle, Brand, and Web Implementation Plan | `2f4f2464908bbd5890caf496270289eb361dda9c99f368c94e0f2bdf82011214` | 1903 | yes |
| Mäkelä's Conjecture Interactive Tutorial — Pedagogical Design Plan | `3327ae0afe51efa1bfbcf7f6b5d934d485e4f3a147cb39f9fb15a80396a3bf6a` | 2304 | yes |
| Spec: Kokeellinen ennätyshaku -osio nettisivulle | `41e18d426eaf557555acb3cc598acc0894a63b3817b3028ec734121aad54940d` | 153 | yes |
| ABELISK v2 — Refined Game, Terminology, and Web Implementation Plan | `57be8be237a80361a52597fce29f7254ee9a26ba22bef9517a9eaaf22113a4a2` | 1612 | yes |
| ABELISK — Game Design, Discovery, and Insight System | `8c18bf96ad5fb4fa13c8ea57121beab445bdefe24b5b3d364ce7bccf9699a070` | 2018 | yes |

**A filename defect worth recording.** The v3 document's own header reads
`Suggested repository path: docs/game-design/ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN.md`
— the v2 filename, inside the document that supersedes v2. This is exactly why the
bootstrap instruction to treat filenames as opaque and identify by heading and
checksum matters. Nothing was renamed.

---

## 1. The active Abelisk product direction

# **ABELISK v3 is the active direction.**

**Basis for supersession, quoted from the primary document** (v3, line 14):

```text
Supersedes: ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN.md
```

All three conditions in bootstrap §19 are now satisfied: explicit statement (v3
line 14), owner approval (2026-08-06), and a registry record.

v3 does **not** claim to supersede the foundation document. The foundation's
reclassification to `HISTORICAL / REFERENCE` was made by owner decision, not by
declared supersession — the distinction is preserved in the registry.

| Document | Role | Registry status |
|---|---|---|
| ABELISK v3 | Active product-design authority | **`ACCEPTED`** |
| ABELISK v2 | Superseded design input, preserved | **`SUPERSEDED`** |
| ABELISK foundation | Design archive, not implementation authority | **`HISTORICAL` / `REFERENCE`** |

`SUPERSEDED` does not mean deleted. v2 stays in `docs/plans/intake/` unchanged. Since
v3 contains v2's text in full (§2.2), nothing is lost by building from v3.

---

## 2. What v2 actually removed, and what v3 actually restored

The bootstrap document warns: *"The refined product deliberately removed some excess
complexity. Do not merge all mechanics from older plans back into v3 automatically."*

Reading all three confirms the warning but **relocates where the reduction happened**.

### 2.1 The reduction was foundation → v2, not v2 → v3

A section-by-section comparison shows v2 dropped the following from the foundation
document, wholesale:

```text
§4.1–4.25   twenty-five named puzzle mechanic families
§5          the five-layer hint ladder (Hint 0 atmosphere … Hint 5 full explanation)
§6          ten named insights I1–I10 and per-puzzle target_insights
§7          the six-chamber narrative (Surface / Inventory / Sum / Cipher /
            Deep Chamber / Open Door)
§8          meta-game: chamber map, insight constellation, Obstruction Atlas,
            research notebook, message archive
§9          six difficulty tiers and the three-axis difficulty label
§10         adaptive puzzle sequencing
§11         Notes mode as a full candidate system with reason tags
§12         explanation-on-demand (four post-solve views)
§13         the puzzle generation pipeline
§17–18      daily puzzle, shareable result, classroom room code, community
            submissions, level editor, educational creator mode
§20–21      sonification and visual-metaphor systems
§22         research-integrity gameplay (claim cards, manifest, checkpoint,
            complexity, citation puzzles)
§23         collaborative classroom roles
§19         achievements
```

v2 replaced all of it with four chambers, four verbs, eight moments, and seven glyphs.
That is the deliberate restraint the bootstrap document refers to.

### 2.2 v3 restored exactly two things, and added three

**Restored from the foundation's space** (deliberately, with new design work):

| Restored | Foundation origin | v3 form |
|---|---|---|
| Named deduction techniques | §4.3 Forced Cell Deduction, §6 insights | §6 — five named techniques: Echo Block, Last Symbol, **Shadow Difference**, Double Lock, Echo Chain |
| Daily puzzle | §17.1 | §1 — "one Daily puzzle" |

**New in v3, present in neither predecessor:**

| New | Where |
|---|---|
| Brand meaning, public title, and trademark caution | §3 |
| The four-symbol Classic Abelisk / ternary Mäkelä's Door split | §4 |
| Logical-trace requirement and the blind-branching rejection rule | §23 |
| The six-point puzzle-quality test | §6.5 |
| "How the puzzle unfolded" post-solve deduction path | §34 |

**Everything else in v3 is textually identical to v2** — terminology, product
hierarchy, eight moments, four verbs, feedback, seven glyphs, cipher/sealed
distinction, the 85-cell chapters, the append/hole-fill/full distinction, web
architecture, technology choice, HTML shell, state, events, engine, both verifiers,
the puzzle schema, rendering, styling, animation, accessibility, persistence, i18n,
tests, migration, first sprint, postponed features, and the final design statement.

**Consequence for the supersession rule.** v3 removes nothing from v2. Approving the
supersession therefore costs no v2 content; it only records which document is
authoritative when they are textually identical.

### 2.3 Reusable historical ideas that do not regain authority

These are recorded so they are findable, **not** reinstated. None may be built without
a separate owner-approved task.

| Idea | Foundation § | Why it is worth keeping findable |
|---|---|---|
| Two Oracles (two checkers disagree; decide which witness proves invalidity, and whether both used the same definition) | §4.18 | Directly dramatizes `EPISTEMIC_DISCIPLINE.md` §5 and the project's own rejection #10 in `KNOWLEDGE_STATE.md` — "the independence axis was wrong" |
| Proof or Evidence? (sort claim cards into example / bounded exact result / heuristic / proof / not enough information) | §4.22 | The single closest match to the project's own two-level ledger, expressed as a game mechanic |
| Counterexample Hunt, including "every D40-valid path is globally valid" and "longer finite words imply an infinite word" as targets | §4.16 | Both listed hypotheses are ones the project has itself had to refute |
| Minimal Obstruction and the Obstruction Atlas | §4.23–4.24 | Aligns with a research line the project already recognizes (`OPEN_RESEARCH_QUESTIONS.md` B-series) |
| Motor accessibility: large targets, switch-control compatibility, no precision dragging | §24.5 | **v2 and v3 both dropped this.** Their accessibility test lists cover keyboard, screen reader, reduced motion, zoom and color, but not motor or switch control. This is a genuine regression, not merely a deferred feature |
| Five-layer hint ladder | §5 | v3 keeps `hintLevel` capped at 4 in the reducer but describes no ladder; the foundation's is the only worked design |

**Owner ruling on the motor-accessibility row (2026-08-06):** it is **restored as an
active requirement**, recorded explicitly as an *accessibility correction, not a
restoration of superseded game scope*. That distinction is what keeps the
no-automatic-restoration rule intact — the other five rows in this table remain
findable-but-inactive and each still needs a task that names it.

The active minimum is now:

```text
large interaction targets
full keyboard operation
no mandatory precision dragging
switch-compatible interaction where practical
alternative controls for drag or timed actions
reduced-motion support preserving all information
```

---

## 3. Plan cards

### PLAN-ABELISK-003

```yaml
plan_id: PLAN-ABELISK-003
source_file: docs/plans/intake/ABELISK_V3_LOGIC_PUZZLE_BRAND_AND_WEB_IMPLEMENTATION_PLAN.md
source_sha256: 2f4f2464908bbd5890caf496270289eb361dda9c99f368c94e0f2bdf82011214
title: ABELISK v3 — Logic Puzzle, Brand, and Web Implementation Plan
document_type: [product-specification, pedagogical-design, implementation]
status_in_source: "refined product, puzzle-design, brand, and implementation specification"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [education, infrastructure]
depends_on: [shared abelian core, PLAN-EDU-001 for shared engine and witness policy]
conflicts_with: []
supersedes: [PLAN-ABELISK-002]        # declared by source, pending owner approval
superseded_by: []
owner_decisions_required: [OD-10, OD-11]
candidate_tasks:
  - extract the three-layer verifier as pure functions with differential tests
  - author the six-item first sprint content
  - puzzle schema v2 + offline validator
do_not_implement_directly:
  - the 85-cell Master Abelisk (v3 itself says do not begin with it)
  - any claim that the 85-cell sequence derives from g85 (unverified, see §7)
  - "Cipher Vault" wording implying a cryptographic method
summary: >
  The active Abelisk direction. Adds a genuine logic-puzzle layer (five named
  deduction techniques, logical trace, blind-branching rejection) on top of v2's
  restrained product, plus brand work and a deliberate split between a replayable
  four-symbol Classic Abelisk and a ternary Mäkelä's Door.
```

**Its strongest contribution** is §6.5's six-point puzzle-quality test — validity,
uniqueness, logical solvability, insight, economy, clarity — combined with §23's rule
that a puzzle solvable only by blind branching is **rejected** from Daily and Pure
Logic. That converts "is this a good puzzle" from taste into a checkable property.

**Two internal defects found on reading.**

1. §5.4 requires an `intended_break_in` block in every puzzle, but §22's puzzle schema
   example does not contain the field. A schema built from §22 alone would silently
   omit a required item.
2. §23 contains an orphan heading — `For Cipher Vault deduction puzzles:` followed by
   nothing, then `For Free Play:`. In v2 §20.1 that heading carried the content
   `solution count must equal 1`. The requirement survives in v3's earlier sentence,
   so nothing is lost mathematically, but the file has an editing artifact.

**An apparent tension that resolves.** §1 excludes "procedural puzzle generation in
the browser" and §33 postpones "procedural generation", yet §1 requires "one Daily
puzzle" and "one curated puzzle archive". These are compatible: §23.2 places
uniqueness checking in Node during development or CI, so Daily puzzles may be
generated or authored **offline** and shipped as data. The exclusion is of in-browser
generation only. Worth stating because a reader of §33 alone would conclude Daily is
impossible.

---

### PLAN-EDU-001

```yaml
plan_id: PLAN-EDU-001
source_file: docs/plans/intake/MAKELA_CONJECTURE_INTERACTIVE_TUTORIAL_DESIGN.md
source_sha256: 3327ae0afe51efa1bfbcf7f6b5d934d485e4f3a147cb39f9fb15a80396a3bf6a
title: Mäkelä's Conjecture Interactive Tutorial — Pedagogical Design Plan
document_type: [pedagogical-design]
status_in_source: "pedagogical and interaction-design specification"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [education, research]
depends_on: [shared abelian core, claim ID scheme]
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-10]
candidate_tasks:
  - MVP 1 concept prototype (scenes 0-5, 7-8, 11)
  - plain-text route with no loss of mathematical content
  - deterministic scripted examples with IDs and unit tests
do_not_implement_directly:
  - MVP 5 project integration (needs the claim ID scheme, OD-7)
  - any classroom data collection (needs an ethics protocol)
summary: >
  A twelve-scene, 8-12 minute discovery narrative from one letter to an open
  problem, with four audience modes, a help ladder, WCAG 2.2 AA accessibility,
  a complete plain-text equivalent, and five staged MVPs. The most
  epistemically careful of the education documents.
```

**It polices mathematical wording better than any other Wave 2 document.** §10.4:

```text
Allowed:      A fixed interval count can be obtained in constant time
              using prefix sums.
Not allowed:  The complete Abelian-square check is O(1).
```

§9.4 forbids framing a learner's short word as progress toward the conjecture, with
the explicit anti-example `You are 0.0001% closer to proving it.` §24 Failure 6 makes
"suggesting finite records approach infinity" a named design failure. All three align
with `AGENTS.md` rule 16.

**§10.1 states the project class exactly**, and it matches `MATH_CLAIMS.md` row 4:

```text
alphabet: {a,b,c}
forbidden: Abelian squares with half-length K >= 2
allowed: aa, bb, cc
```

**Its §29 references are pedagogical, not mathematical**, and the document says so
itself: *"They do not validate mathematical claims about Mäkelä's conjecture."* Five
external sources are cited with URLs (CAST UDL 3.0, W3C WCAG 2.2, EEF feedback
guidance, and two IES practice guides). **None has been opened by this session.**
Under `AGENTS.md` rule 1 they must be fetched and quoted before being reproduced into
any project file — the rule is about citation discipline, not about whether the claim
is mathematical.

---

### PLAN-RECORDS-001

```yaml
plan_id: PLAN-RECORDS-001
source_file: docs/plans/intake/RECORDS_SECTION_SPEC.md
source_sha256: 41e18d426eaf557555acb3cc598acc0894a63b3817b3028ec734121aad54940d
title: "Spec: Kokeellinen ennätyshaku -osio nettisivulle"
language: Finnish
document_type: [product-specification, implementation]
status_in_source: "spec, addressed to an AI or developer implementing the section"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [research, education, infrastructure]
depends_on: [independent verifier with a separate code path]
conflicts_with: []
superseded_in_part_by: [OD-4]         # its /todistukset route, not its content
supersedes: []
superseded_by: []
owner_decisions_required: []
candidate_tasks:
  - AA2F / AA2FR structural separation in any records presentation
  - per-record metadata schema with SHA-256 and verification state
  - the independent-checker requirement as a testable rule
do_not_implement_directly:
  - the /todistukset route (superseded by the OD-4 route decision)
  - the term "Veikon sääntö" for FORBID4 (see section 7)
summary: >
  153 lines, Finnish, and the most epistemically precise document in Wave 2.
  Requires the experimental record search to live on its own URL with a
  permanent disclaimer, forbids ranking AA2F and AA2FR in one table, mandates an
  independently coded verifier plus SHA-256 per published word, and explicitly
  corrects a misleading O(1) comment in the project's own code.
```

**Summarized in English, not translated**, per bootstrap §18. The Finnish disclaimer
text in its §4 is left in place; it is a calibrated artifact and translating it is a
separate reviewed task.

**Three requirements that exceed what the other Wave 2 documents ask for:**

1. **§1 — AA2F and AA2FR must never share a ranking.** AA2FR is a strict subset of
   AA2F (it adds the FORBID4 constraint), so a shorter AA2FR word is not a worse
   result — it is a different problem. The spec requires a mandatory `Luokka` (class)
   column and physically separate tables, "not one combined ranking sorted by length
   alone". This is `EPISTEMIC_DISCIPLINE.md` §4 stated as a UI requirement.
2. **§2.1 — the independent checker must not share a code path**, and must count all
   three letters explicitly rather than inferring the third from the other two, *even
   though that shortcut is mathematically valid*, precisely to keep the
   implementations independent. This is stricter than v3's differential tests, which
   compare two functions inside one module.
3. **§3a — the code comment "Full O(1) Abelian Square Check" is misleading and must
   not be repeated on the site.** The spec gives the correct figures: O(n) per
   appended letter, O(n²) for a full construction, and notes that a 2500-symbol word
   is roughly three million checks in the best case where the search never backtracks.

**§3c is a small but unusual contribution:** it requires explaining that a quiet
progress log does not mean the search is stuck — the log updates at most once per
second and only on a new depth record, while checkpoints write once per minute per
worker regardless. That is an honest anti-misreading measure for live output.

---

### PLAN-ABELISK-002

```yaml
plan_id: PLAN-ABELISK-002
source_file: docs/plans/intake/ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN.md
source_sha256: 57be8be237a80361a52597fce29f7254ee9a26ba22bef9517a9eaaf22113a4a2
title: ABELISK v2 — Refined Game, Terminology, and Web Implementation Plan
document_type: [product-specification, implementation]
status_in_source: "refined product and implementation specification"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [education, infrastructure]
depends_on: []
conflicts_with: []
supersedes: [PLAN-ABELISK-001]        # in practice, by reduction; NOT declared in text
superseded_by: [PLAN-ABELISK-003]     # declared by v3, pending owner approval
owner_decisions_required: []
candidate_tasks: []
do_not_implement_directly:
  - anything; implement from v3, which contains v2 in full
summary: >
  The restraint document. Its contribution is what it removed: it cut roughly
  twenty-five mechanic families, the hint ladder, the meta-game, difficulty
  tiers, adaptive sequencing, generation, community features and achievements
  down to four chambers, four verbs, eight moments and seven glyphs. v3
  contains its entire text.
```

**Note on its supersession of the foundation.** v2 contains no `Supersedes:` line. Its
relationship to the foundation document is one of drastic reduction, not declared
supersession. Under bootstrap §19 that is **not** sufficient to mark the foundation
superseded, and this synthesis does not do so.

---

### PLAN-ABELISK-001

```yaml
plan_id: PLAN-ABELISK-001
source_file: docs/plans/intake/ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM.md
source_sha256: 8c18bf96ad5fb4fa13c8ea57121beab445bdefe24b5b3d364ce7bccf9699a070
title: ABELISK — Game Design, Discovery, and Insight System
document_type: [pedagogical-design, product-specification]
status_in_source: "gameplay, pedagogy, narrative, and systems-design specification"
proposed_program_status: PROPOSED
authority_level: proposal / design archive
missions: [education]
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []                     # NOT superseded by declaration
owner_decisions_required: []
candidate_tasks: []
do_not_implement_directly:
  - all twenty-five mechanic families
  - the meta-game, difficulty tiers, adaptive sequencing, generation pipeline,
    community features and achievements
  - anything at all without a separate owner-approved task
summary: >
  The idea archive. Twenty-five puzzle mechanic families, ten named insights, a
  five-layer hint ladder, a six-chamber narrative, and a research-integrity
  gameplay section that is the closest any document comes to turning the
  project's own epistemic protocol into playable content. Deliberately reduced
  by v2 and not restored by v3.
```

---

## 4. The smallest testable learner experience

The tutorial and Abelisk v3 converge on the **same** minimal sequence, arrived at
independently. This is the strongest shared-dependency finding in Wave 2.

| Step | Tutorial (MVP 1, scenes 0–5) | Abelisk v3 (§32 first sprint) |
|---|---|---|
| 1 | one letter `a` | one symbol |
| 2 | alphabet appears | — |
| 3 | `ab \| ab` → "square" | `ab \| ab` |
| 4 | `ab \| ba` → "Abelian square" | `ab \| ba` |
| 5 | count columns → Parikh vector | one count comparison |
| 6 | — | one repair |
| 7 | (scene 11) finite vs infinite | (moment 8) can this continue forever? |

**The smallest testable learner experience is therefore:**

```text
one letter
→ ab|ab                       exact repeat
→ ab|ba                       same inventory, different order
→ side-by-side letter counts
→ one repair                  change a symbol to break it
→ the finite-versus-infinite question
```

Six beats. Both documents insist it is enough, and both explicitly forbid starting
with the 85-cell puzzle. It is testable because every step has a checkable learner
outcome in the tutorial's §15 checkpoints A–E.

**What makes it testable rather than merely small:** the tutorial's §15 exit
reflection ("explain Mäkelä's conjecture in one or two sentences") and its five
checkpoints give pass/fail criteria that do not depend on engagement metrics.

---

## 5. The minimum viable puzzle set

v3 §32 defines it, and it is smaller than the foundation's fifteen:

```text
1  one symbol
2  ab|ab
3  ab|ba
4  one count comparison
5  one repair
6  the sealed phrase ORDER CAN LIE
```

Plus one puzzle file (`ABELISK-001.json`) and one test file
(`tests/abelisk-engine.test.js`).

**Constraints the set must satisfy before it may be called curated** (v3 §6.5, §23):

```text
validity              the final structure obeys the declared rule
uniqueness            solution count matches solutionPolicy exactly
logical solvability   a documented deduction sequence solves it, no guessing
insight               at least one nontrivial deduction
economy               little repetitive filler
clarity               each forced move can be explained
```

and, from §23, a puzzle solvable only by blind branching is **excluded** from Daily
and Pure Logic — it may still appear in Free Play, Research Sandbox, or Master.

**A wording rule that applies to all six:** v3 §23 and v2 §20.1 both state *do not
call one sequence "the solution" unless uniqueness was checked.* With a six-cell
puzzle it is tempting to skip the check. The rule says otherwise.

---

## 6. The required mathematical verifier architecture

Three Wave 2 documents specify verifiers independently, and they compose into four
layers, not three. This is the most implementation-relevant finding in Wave 2.

### Layer 1 — Full reference verifier

Every start position × every half-length × every complete block pair.
v3 §19 `findAllAbelianViolations(cells, {alphabetSize, minHalfLength})`;
tutorial §10.3 and §17.2 `verifyWholeWord`; records spec §2.1.

This is written **first** and is the trusted reference. Optimization comes later.

### Layer 2 — Append-only incremental checker

v3 §20 `findNewEndingViolations`; tutorial Scene 9.

The mathematical justification, stated identically in v3 §12.1 and tutorial Scene 9:

> When a valid word is extended by one new letter, every newly created violation must
> end at that new letter.

A suffix-only checker is therefore **sufficient for append mode** — and only for
append mode. The tutorial adds the pedagogically important second half: *its beginning
may be very far away.*

### Layer 3 — Changed-index (hole-filling) checker

v3 §21 `findNewViolationsTouchingIndex`. **Required by Abelisk, not by the tutorial.**

v3 §12.2 states the reason precisely:

> When the player fills an empty cell in the middle, a newly completed violation may
> begin before the cell and end after it. A suffix-only checker is not sufficient.

This asymmetry is a real architectural fact: the tutorial is append-only, so its
engine is a strict subset of Abelisk's. **The shared core must be Abelisk's, not the
tutorial's** — building the tutorial's engine first and extending it later would mean
discovering Layer 3 after the interface is committed.

### Layer 4 — Independent checker on a separate code path

**This layer appears only in the records spec (§2.1), and it is the one the other two
documents do not ask for.**

Requirements, as written:

```text
- written separately from the search algorithm, not the same code path
  (otherwise a bug in the checking logic appears identically in both the
   search and the "independent" check)
- counts all three letters directly for every window pair
- does NOT infer the third letter's count from the other two, even though the
  shortcut is mathematically valid — kept separate deliberately, for independence
- for AA2FR words, checks all six FORBID4 patterns separately
```

**Why this matters beyond the records section.** v3 §30.2 and v2 §27.2 specify
differential tests between the incremental and reference verifiers — but both live in
the same module and were written by the same author against the same understanding.
`EPISTEMIC_DISCIPLINE.md` §5 requires a check that "must use a different code path
than the one that produced the claim", and `KNOWLEDGE_STATE.md` §4 records rejection
#10: a definition-level verifier that "worked flawlessly but did not reach its own
target — the independence axis was wrong."

The records spec is the only Wave 2 document that gets this right. Any shared-core
task should adopt its formulation.

### Rule configuration is data, never inferred

v3 §18.2 and v2 §15.2, identical:

```js
Mäkelä ternary:        { type: "ABELIAN", alphabetSize: 3, minHalfLength: 2 }
Classic four-letter:   { type: "ABELIAN", alphabetSize: 4, minHalfLength: 1 }
Additive:              { type: "ADDITIVE", values: [0,1,2,6], minHalfLength: 1 }
```

> Never infer the rule only from the displayed palette.

`minHalfLength: 2` is exactly what makes `aa`, `bb`, `cc` legal in Mäkelä mode, and
`minHalfLength: 1` is what forbids them in classical square-free mode. Both v2 and v3
list `K=1 allowed in Mäkelä mode` and `K=1 forbidden in classical square-free mode`
as required test cases.

### Complexity wording — three independent documents agree

| Source | Statement |
|---|---|
| v3 §20 / v2 §17 | "one fixed comparison: O(1) with prefix sums; all half-lengths after one append: O(n)" |
| Tutorial §10.4 | allowed: constant time for a fixed interval with prefix sums. **Not** allowed: "the complete Abelian-square check is O(1)" |
| Records spec §3a | one letter appended to an n-word costs O(n); a full construction is O(n²); the code comment "Full O(1) Abelian Square Check" is misleading and must not be repeated |

Three documents, written for three different audiences, converge on the same
correction. That convergence is itself evidence the correction is right.

---

## 7. Claims and terminology requiring mathematical verification

Listed as required checks. **None was resolved in this wave**, and no claim wording or
status was changed.

### 7.1 "Veikon sääntö" for FORBID4 — conflicts with the ledger

The records spec §1 names FORBID4 the *"FORBID4-sääntö / 'Veikon sääntö'"* —
Veikko's rule, after V. Keränen.

`MATH_CLAIMS.md` row 9 forbids exactly this framing. Its wording, and the reason:
all six strings do appear in Keränen's 2006 `reducedWordList4` tables, but the paper
lists them among dozens of other four-letter words **and does not single these six out
as any named set**. The row's closing instruction is not to present FORBID4 as
Keränen's set.

Row 41 adds a second problem: FORBID4 is a **heuristic, not a rule** — it occurs 2,820
times in the project's own record word, so a global ban would make that record
impossible.

So the name is wrong twice over: wrong attribution, and wrong category. The six
strings themselves match row 9 exactly and are not in question.

**Owner ruling (2026-08-06): "Veikko's rule" is prohibited as a canonical
mathematical name.** FORBID4 must be described as **the project-specific FORBID4 set**
or **the FORBID4 heuristic**, unless a primary source establishes another attribution.

The condition for changing this is specific: a primary source that singles out these
six strings as a named set. Keränen's 2006 paper does not — that is what row 9
records. The intake document is not edited; the ruling governs what may reach a public
surface.

### 7.2 The 85-cell Master Abelisk and g85

v3 §11.4 and v2 §8.4 both say *"If the sequence is inspired by a real 85-letter
mathematical construction"* — conditional, and correctly so.

The obvious candidate is Keränen's `g85`, `MATH_CLAIMS.md` row 3, which is `PRIMARY`
(Level 2), verified character-by-character against `morphisms.js`'s `G85_A`.

**What is not established:** whether the puzzle's 85 cells actually derive from
`g85(a)`, and if so what was preserved and what was altered for play. v3 §11.4 already
requires disclosing the exact relationship, the source, a claim ID, what is preserved
and what was modified — but nobody has yet checked that a relationship exists.

Both documents also warn against describing it as *"the fundamental building block of
the Abelian universe"* outside clearly fictional narration. That phrasing is
presumably in the current implementation; it was not audited here.

### 7.3 The additive alphabet `{0, 1, 2, 6}`

v3 §18.2 and v2 §15.2 both configure additive mode with `values: [0, 1, 2, 6]`.

`MATH_CLAIMS.md` row 54 records the additive alphabet sweep by affine class, resolving
11 of 31 classes — meaning 11 classes are known **not** to host an infinite
additively-square-free word.

**Required check before building the additive sandbox:** which affine class
`{0,1,2,6}` falls into, and whether it is among the resolved-impossible ones. If it
is, the sandbox would be built on an alphabet already known to die, which is fine as a
teaching example but must be labeled as such rather than presented as open
exploration. This was not determined here.

### 7.4 The claim ID scheme does not exist

Tutorial §17.4 uses `DEF-ABELIAN-SQUARE-0001`; v3 §22 puzzle schema has
`source.claimIds: []`; tutorial §10.5 requires every knowledge statement to carry a
claim ID, status, source and last-reviewed date.

`MATH_CLAIMS.md` uses **numeric row numbers**, not `DEF-*` or `CLAIM-*` identifiers.
Under the OD-7 decision (ledger is sole claim authority; all registries are generated,
read-only, provenance-bearing and CI-verified), any ID scheme must be a **generated
mapping onto ledger rows**, never a second namespace with its own entries.

This is a dependency, not a conflict: the education and product work cannot cite
claims until the generated mapping exists.

### 7.5 Statements that were checked and are consistent

| Statement | Checked against | Result |
|---|---|---|
| Mäkelä rule: `{a,b,c}`, forbid K ≥ 2, allow `aa`/`bb`/`cc` | `MATH_CLAIMS.md` row 4 | consistent |
| AA2FR is a strict subset of AA2F | `EPISTEMIC_DISCIPLINE.md` §4 | consistent |
| The six FORBID4 strings | `MATH_CLAIMS.md` row 9 | identical set |
| "A long finite result is not an infinite proof" | `AGENTS.md` rule 16 | consistent, in all three documents |
| Complexity wording | records spec §3a, tutorial §10.4, v3 §20 | mutually consistent |

---

## 8. Accessibility and learner-data requirements

### 8.1 Accessibility — the shared floor

| Requirement | Tutorial | Abelisk v3 | Foundation |
|---|---|---|---|
| Target standard | WCAG 2.2 AA (§12) | not named (§27) | not named (§24) |
| Full keyboard operation | §12.1 | §27, §30.5 | §24.5 |
| Screen-reader live region with witness text | §12.2 | §27 | — |
| Reduced motion, information preserved | §12.3 | §26.1 | §24.2 |
| Not color alone | §12.5 | §27 | §24.1 |
| 200% zoom | — | §30.5 | — |
| Plain-text / no-JS route | §19 (`/tutorial/plain`) | §13 (`plain/index.html`) | — |
| Pause / replay / skip | §12.4 | — | — |
| **Motor: large targets, switch control, no precision dragging** | — | — | **§24.5 only** |
| Cognitive: one concept at a time, glossary, no time pressure | §2.1 | — | §24.3 |

**Two gaps, both recorded rather than fixed:**

- **Motor accessibility exists only in the foundation document.** v2 dropped it and v3
  did not restore it. Since v3 is the active direction, the active plan has no
  switch-control or large-target requirement. This is the one case in Wave 2 where the
  reduction from foundation to v2 removed something that should probably return.
- **WCAG 2.2 AA is named only by the tutorial.** If it is the project standard, it
  should be stated once for all learner-facing surfaces rather than per document.

### 8.2 Learner data — fully consistent across all three, no conflict

All three documents independently arrive at the same position.

**Permitted** (tutorial §16, foundation §25): anonymous scene/interaction events —
`scene_started`, `hint_requested`, `classification_attempt`, `violation_explained`,
`prediction_made`, `rule_revised`, `finite_infinite_answer`.

**Forbidden by default** (tutorial §16, v3 §28, foundation §25):

```text
names                     school identity           student IDs
exact free-text answers   precise location          persistent cross-site profiles
classroom identifiers     identifiable assessment records
```

**v3 §28 adds a storage rule:** `localStorage` holds game state only, and personal
identity, free-text student answers and classroom identifiers are not saved "without a
separate consent design".

**Both escalation clauses agree:** tutorial §16 — "If classroom research is conducted,
use a separate ethics and consent protocol." Foundation §25 measures insight, not
completion. This matches PLAN-GOV-001 §18 and PLAN-CHARTER-001 §10's requirement for a
pedagogical ethics protocol before any formal learner study.

**Nothing here requires an owner decision.** The three documents, two governance plans
from Wave 1, and the safe default all agree.

---

## 9. Pedagogical evidence still missing

This section exists because the owner asked for learner outcomes and transfer, not
engagement. The honest answer is that **no learner-outcome evidence exists at all.**

| Question | Status |
|---|---|
| Does the tutorial teach Abelian equivalence? | No data. §23's user testing is a plan, not a result |
| Does it improve evidence calibration (finite vs infinite)? | No data. This is PLAN-CHARTER-001's EDU-H1, an unregistered hypothesis |
| Does authentic replication beat a simulated worksheet? | No data. EDU-H2, likewise unregistered |
| **Does the idea transfer to a new alphabet?** | **No data, and no instrument.** Foundation §25 asks this exact question; nothing in the tutorial or v3 measures it |
| Do learners use fewer guesses over time? | No data. Foundation §25 proposes the measure; v3 dropped it |
| Are the eight-moment and twelve-scene arcs the right granularity? | No data |

**What exists instead** is design-guiding literature (tutorial §29: UDL, WCAG, EEF
feedback, IES practice guides) — which supports the *design method*, not the claim
that this particular artifact teaches.

**The distinction that must be maintained**, using PLAN-REPO-001 §17.11's three
labels:

```text
design intention      what these plans have
pilot observation     what user testing would produce
formal study result   what EDU-H1 / EDU-H2 would require
```

A statement like "this game teaches research literacy" is an **empirical educational
claim**. It is not established by the thoughtfulness of the design, and under
`AGENTS.md` rule 7 it may not appear as a finding anywhere without a ledger entry.

**Transfer is the specific gap.** Every checkpoint in the tutorial's §15 tests
recognition within the taught alphabet and the taught rule. Not one tests whether a
learner can apply Abelian equivalence to an unseen alphabet, an unseen half-length, or
the additive variant. If transfer is the actual educational goal — and the foundation
document says it is — then the current assessment design cannot detect success.

### 9.1 Owner rulings, 2026-08-06

**All current pedagogical claims are design hypotheses only.** There is no evidence
that Abelisk or the tutorial produces the intended learning or transfer outcomes.

Future wording must distinguish four things that the Wave 2 documents currently blur:

```text
intended learning outcome     what the design aims at
design rationale              why the design expects it to work
usability observation         what was seen when someone used it
measured learning result      what an instrumented study established
```

Only the fourth is evidence. The plans currently contain the first two, and nothing
else.

**At least one transfer task is required in the first pedagogy pilot.** The learner
must demonstrate the idea in a genuinely new case. Acceptable forms:

```text
a different alphabet
different symbols or colours
a novel pair of blocks
explaining why a finite example does not establish an infinite construction
```

This closes the gap identified above: the tutorial's five checkpoints all test
recognition inside the taught case, so a pilot built on them alone could report
success while measuring nothing about transfer. The fourth form is notable — it makes
evidence calibration itself the transfer target, which is the outcome this project has
the strongest reason to care about.

---

## 10. Dependencies shared with the Mäkelä tutorial

Seven shared dependencies. Building either product first without agreeing these would
force a rewrite of the second.

| # | Shared item | Tutorial | Abelisk v3 | Agreement |
|---|---|---|---|---|
| 1 | Abelian verifier core | §17.2 | §19–21 | **Same mathematics, different signatures** — tutorial takes `word: string`, v3 takes `cells` + rule object. One must win |
| 2 | Deterministic witness policy | Scene 6 | §8.3 | **Identical**: shortest new violation, then earliest start. Highest-value agreement in Wave 2 |
| 3 | Witness data shape | §17.2 `Violation` | §19 violation object | Compatible: both carry start, halfLength, both blocks, both Parikh vectors. v3 adds `middle` and `end` |
| 4 | Reduced motion + information preservation | §12.3 | §26.1 | Identical requirement |
| 5 | Plain-text / no-JS route | §19 | §13 | Same pattern, two routes |
| 6 | Claim ID scheme | §10.5, §17.4 | §22 `source.claimIds` | Both depend on it; **it does not exist** (§7.4) |
| 7 | Content files separate from rendering | §17.4 | §29 | Identical principle |

**The one real conflict is #1.** The tutorial's engine is append-only; Abelisk needs
the changed-index layer for hole-filling. If the shared core is built from the
tutorial's API, Layer 3 has to be retrofitted. **The core should be built to Abelisk's
shape, with the tutorial consuming a subset.**

This matches PLAN-WEB-001's Phase 3, which names Word Builder, Tree Search and Abelisk
as the first consumers of the extracted core and requires them to agree with the new
reference verifier.

---

## 11. Product design vs pedagogy vs mathematics vs implementation

The owner asked for this distinction explicitly. Wave 2's documents mix all four, and
separating them changes who may approve what.

| Layer | What it decides | Who approves | Wave 2 content |
|---|---|---|---|
| **Mathematics** | rule definitions, verifier correctness, complexity claims, what a finite result proves | ledger + owner (`AGENTS.md` rule 5) | Mäkelä rule statement; AA2F/AA2FR; append vs hole-fill vs full; complexity wording; FORBID4's status |
| **Pedagogy** | scene order, when a term is revealed, help ladder, checkpoints, misconceptions, accessibility | pedagogical review (PLAN-REPO-001 §10.4) — **not** mathematical review alone | 12 scenes; 8 moments; prediction-before-reveal; fading support; §14.5 misconception guide |
| **Product design** | name, brand, chambers, glyphs, reward model, difficulty, what is postponed | owner | ABELISK / Hidden Echoes; echo terminology; seven glyphs; Cipher Vault; four chambers |
| **Implementation** | routes, file layout, state shape, event model, schema, tests, persistence | bounded task + code review | `/abelisk/`; reducer; schema v2; localStorage keys; test matrix |

**Why the separation matters here.** v3 §6's five deduction techniques look like
product design but are **pedagogical claims** — that a named technique produces a
better learning moment than unnamed trial and error. PLAN-REPO-001 §10.4 says a
mathematical review is not enough for that; it needs review for conceptual load,
misconceptions and evidence literacy. Nobody has done that review.

Conversely, the "echo / hidden echo / weight echo" terminology looks pedagogical but
is a **mathematics-adjacent** decision, because it maps fictional vocabulary onto
`ordinary square` / `Abelian square` / `additive square`. Both v2 and v3 handle it
correctly: *"Do not use it as a replacement for the mathematical term"*, with the
reveal `The Abelisk calls this a hidden echo. Mathematicians call it an Abelian
square.`

---

## 12. Unresolved naming and brand decisions

| # | Item | Status |
|---|---|---|
| 1 | `ABELISK` as the game name | v3 §2.4 keeps it and explicitly rejects generic alternatives (Abelian Puzzle, Parikh Game, Square-Free Logic). Not contested by any document |
| 2 | Public title `ABELISK — Hidden Echoes` / `ABELISK — Piilokaikujen arvoitus` | Recommended by v3 §2.2. **Decided (owner, 2026-08-07):** public title is `ABELISK — Hidden Echoes` |
| 3 | Trademark / app-store / domain / social-handle search | v3 §2.3 requires it **before any independent commercial release**. No release is proposed, so this is a precondition on a hypothetical, not an open decision. **Not done** |
| 4 | `Cipher Vault` | Retained by v3 §10.3 with a mandatory caveat: the pattern is a key that unseals text; **do not claim a novel cryptographic method** |
| 5 | `Veikon sääntö` for FORBID4 | **Must not be used** — conflicts with ledger rows 9 and 41 (§7.1) |
| 6 | Master puzzle chapter names (The Surface / The Shadow / Broken Order / Long Memory / The Question) | Interface chapters only. Both v2 §8.1 and v3 §11.1 state they are **not** a claimed mathematical decomposition |
| 7 | `Museum of Mistakes` / `The Graveyard` / `Negative Results & Research Lessons` | **Settled** by OD-4 in Wave 1 |
| 8 | `/todistukset` route from the records spec | **Superseded** by OD-4's English route structure; records belong under `/evidence/records/` |

---

## 13. Recommendations that must remain proposals

Nothing in Wave 2 is authorized. These are the items that would do the most damage if
an implementer read them as approved.

| # | Item | Why it must not be built yet |
|---|---|---|
| 1 | The 85-cell Master Abelisk | v3 §32 itself says do not begin with it; and its relationship to `g85` is unverified (§7.2) |
| 2 | Any statement that the master puzzle derives from Keränen's construction | Unverified. `AGENTS.md` rule 1 |
| 3 | Additive sandbox with `{0,1,2,6}` | Affine class not checked against ledger row 54 (§7.3) |
| 4 | Daily puzzle, curated archive, community submissions, level editor | v3 §33 postpones the last two; Daily depends on an offline generation and validation pipeline that does not exist |
| 5 | Any classroom deployment collecting learner data | Needs the ethics protocol (PLAN-CHARTER-001 §10, PLAN-GOV-001 §18) |
| 6 | Claim-ID wiring in tutorial or puzzle files | The generated mapping does not exist (§7.4, OD-7) |
| 7 | Restoring any of the foundation's 25 mechanic families | Deliberately cut by v2, not restored by v3 (§2) |
| 8 | The five deduction techniques as a pedagogical claim | They are unreviewed pedagogically (§11) |
| 9 | Citing the tutorial's §29 pedagogical sources | Not opened by this session (`AGENTS.md` rule 1) |
| 10 | Publishing any record word | Requires the Layer 4 independent checker plus SHA-256 plus verification state (§6, records spec §2) |

---

## 14. Owner decisions arising from Wave 2 — both now decided

Full text in `OWNER_DECISIONS_REQUIRED.md`.

### OD-10 — canonical language. **DECIDED: English canonical.**

The conflict was between PLAN-REPO-001 §7.3 (English canonical source, tracked
translations) and two Finnish-first product designs (`<html lang="fi">`,
`story.fi.json` first, "Finnish first, English equivalent", the Finnish disclaimer).

The ruling separates the two axes that were being conflated:

```text
canonical source   English          which file is edited and reviewed
delivery language  may be Finnish   what a learner sees first
```

**Scope limit:** this governs **new** content. Existing Finnish source documents are
not bulk-translated during bootstrap; later migration needs a separately approved,
reviewed process. This prevents OD-10 becoming a back door into the translation
campaign OD-5 has not authorized.

**Effect on the Wave 2 plans:** their content-file *ordering* needs re-expressing;
their *delivery* design is unaffected.

### OD-11 — solved or open mathematics. **DECIDED: layered.**

```text
Classic Abelisk                  four-letter setting — stable, solved,
                                 puzzle-generative foundation

Mäkelä Door / Research Chamber   ternary setting — the open problem,
                                 introduced explicitly as open mathematics
```

Three binding constraints attached:

1. The game must **never** imply that solving a finite puzzle, reaching Master mode,
   or producing a long finite word solves or supports the infinite conjecture.
2. The four-letter and ternary settings must be **visually and terminologically
   distinguished**.
3. The solved case is the **foundation**, not a substitute — the open problem is a
   named chamber the player reaches.

Constraint 1 is `AGENTS.md` rule 16 restated as a product requirement, and it
forecloses exactly the failure the tutorial's §9.4 and §24 Failure 6 already name.

---

## 15. What Wave 2 deliberately did not do

- **Wave 3 was not started.** The conjecture pipeline, record-hunting pipeline,
  dictionary backtracker, cut-and-certify plan and Java COW guide remain unread. In
  particular, the records spec (PLAN-RECORDS-001) has obvious dependencies on the
  record-hunting pipeline; those are **not** assessed here.
- **No claim wording or status was changed.** §7's items are recorded as required
  checks.
- **No feature was restored** from the foundation document or v2.
- **No file outside `docs/program/` was edited.** The `Veikon sääntö` problem and the
  misleading `O(1)` code comment are recorded, not corrected.
- **No plan was renamed or moved.**
- `node tests/test.js` and `node scripts/check-claims-drift.js` were **not run**.

---

## 16. Checkpoint questions — answered

Answered by the project owner on 2026-08-06; recorded so the next session does not
re-ask them.

| # | Question | Answer |
|---|---|---|
| 1 | Is v3 the active direction, and is the supersession approved? | **Yes.** v3 `ACCEPTED`; supersession `effective: true`; v2 `SUPERSEDED` |
| 2 | Should the foundation be marked `REFERENCE`? | **Yes** — `HISTORICAL / REFERENCE`, by owner decision rather than by declared supersession |
| 3 | Is the four-layer verifier architecture accepted, including Layer 4? | **Yes**, all four layers, preserved as the shared-core requirement |
| 4 | Should the core be built to Abelisk's shape rather than the tutorial's? | **Yes.** The core supports Abelisk's stronger requirements; the tutorial uses a strict subset |
| 5 | Should motor accessibility be restored? | **Yes**, as an accessibility correction — explicitly not a restoration of game scope |
| 6 | OD-10 and OD-11? | **Both decided.** See §14 |
| 7 | May the agent continue to Wave 3? | **Yes**, after these updates were applied |

Three further rulings were made that the checkpoint questions did not cover:
pedagogical claims are design hypotheses only with four required wording labels (§9.1);
a transfer task is mandatory in the first pilot (§9.1); and "Veikko's rule" is
prohibited as a canonical name (§7.1).
