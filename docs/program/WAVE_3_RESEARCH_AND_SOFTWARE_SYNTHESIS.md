# Wave 3 — Research Pipeline and Software Synthesis

**Wave:** 3 (conjecture pipeline, record hunting, dictionary backtracker, Cut-and-Certify, Java COW Backtracker v1.2)
**Produced:** 2026-08-06
**Produced by:** program bootstrap architect session, read-only
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §5.3, §6, §7
**Status:** `ACCEPTED_WITH_DECISIONS` by the project owner, 2026-08-06; revised
accordingly

Nothing here authorizes implementation. No pipeline or tool was built or run. No long
search was executed. No claim wording or status was changed.

---

## Owner decisions recorded at the Wave 3 review (2026-08-06)

### Findings accepted and preserved

| # | Finding |
|---|---|
| 1 | The tracked D40 dataset is **not** an isolated hygiene issue; it is a dependency of several proposed research tools and routes |
| 2 | `scratch/dict_backtracker.js` **must not be treated as an AA2FR verifier** in its current form — its `verifyAa2fr` does not check FORBID4 |
| 3 | The name `verifyAa2fr` is **ambiguous across code paths**. `AGENTS.md` rule 17 must not cite it without identifying the exact implementation and verified semantics |
| 4 | Java COW Backtracker v1.2 is an **audited reference implementation** — not a proposed design, and not an automatic research priority |
| 5 | **v1.1 must not be recommended or cited** as the current reference version; its checkpoint/resume defect was corrected in v1.2 |
| 6 | Cut-and-Certify E1 is the nearest executable question **among the Wave 3 intake plans**, and does **not** replace `NEXT_STEP.md` / CEGIS Route A as current-work authority |
| 7 | The rolling-hash boundary claim remains **`NOT_VERIFIED`** |

### Decisions

- **OD-2 — kept formally OPEN**, with binding owner direction now operative:
  `RIGHTS_AND_PROVENANCE_UNRESOLVED`; no public claim, release, benchmark or
  recruitment use; preserve checksum, filename, size and dependency graph **before**
  changing tracking; **do not delete the only operational copy**; a local quarantined
  copy may be used for internal reproducibility only; a bounded provenance task must
  precede any D40-dependent campaign; **OD-1 stays separate**.
- **OD-12 — DECIDED.** Split the axes: `REP-0…5` for reproducibility and preservation,
  `IND-0…5` for verifier independence, **reported separately**, with no combined score.
- **OD-13 — DECIDED.** Target architecture approved:
  `word-structures/java-cow-backtracker`, immutable release `v1.2`, with the main
  repository holding a pinned reference, checksum, usage documentation and the tool's
  scientific role. **Implementation deferred**; nothing moves until the organization
  exists.

### New bounded task candidate

**`TASK-GOV — Disambiguate verifier names and contracts.`** Required result:

```text
every verifier has a unique implementation identity
its checked property is explicit
AA2F and AA2FR are never conflated
FORBID4 coverage is machine-testable
AGENTS.md rule 17 points to an exact verifier contract,
    not an ambiguous function name
```

`AGENTS.md` was **not** edited in this wave.

---

## 0. Document identity

All five Wave 3 checksums match Appendix A exactly.

| Heading | SHA-256 | Lines | Lang | Match |
|---|---|---:|---|---|
| Conjecture Research Pipeline | `27b57cbc68cdfbf65eb54a72bdfa23fe324c7854e97c6f63aad26048913cde18` | 1384 | fi | yes |
| Record Hunting and Research Harvest Pipeline | `854c47592c966cc02b8f74d3af75bc83fb5733d6c83405961df6592f29ea5492` | 1567 | en | yes |
| Dictionary-Accelerated Backtracking Research and Development Plan | `a20707dbbc4755d9453afe5a3e874dbe371ade92a8eb15c2e688f606381de474` | 1642 | en | yes |
| Cut-and-Certify Research Plan for Abelian-Square Avoidance | `b46e776f84397bdee900287cfa2e72dcde2178e87f8217c96cf603a98c4e8a22` | 1926 | en | yes |
| Java COW Backtracker v1.2 — Complete User and Research Guide | `c240e31f98d428d850b134bcbdd246cec874b7c6674467da585253642974bcce` | 1849 | en | yes |

A sixth intake file, `java-cow-backtracker-v1.2-checksums.txt` (329 bytes), is not a
plan. It is a checksum sidecar naming three artifacts — see §4.2.

---

## 1. Purpose and authority of each document

The five documents sit at **four different authority levels**, and conflating them is
the main risk this wave addresses.

| Document | Kind | Authority | Targets |
|---|---|---|---|
| Conjecture pipeline | process design | **proposal** — a lifecycle for knowledge | all research lines |
| Record hunting | process design | **proposal** — a lifecycle for artifacts | AA2F / AA2FR finite words |
| Dictionary backtracker | **code audit** + roadmap | **audit findings are checkable facts**; the roadmap is a proposal | `scratch/backtracker.js`, `scratch/dict_backtracker.js` |
| Cut-and-Certify | exploratory research | **proposal**, self-labelled exploratory | a new, untested line |
| Java COW v1.2 guide | **software reference** | **documents an existing audited artifact**, not a proposal | `java-cow-backtracker-v1.2` |

The bootstrap document's warning applies precisely here: *a technical guide is not
automatically a mandate to prioritize that tool.* The Java guide describes what the
software **does**; that is a fact about an artifact, not an argument that record
hunting should be the project's focus.

---

## 2. Plan cards

### PLAN-CONJ-001

```yaml
plan_id: PLAN-CONJ-001
source_file: docs/plans/intake/CONJECTURE_RESEARCH_PIPELINE.md
source_sha256: 27b57cbc68cdfbf65eb54a72bdfa23fe324c7854e97c6f63aad26048913cde18
title: Conjecture Research Pipeline
language: fi
document_type: [research-program, governance]
status_in_source: "suunnitelma / käyttöönottoa odottava"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [research, community]
depends_on: []
conflicts_with: [PLAN-PLATFORM-001]      # R0-R5 label collision, see section 6
supersedes: []
superseded_by: []
owner_decisions_required: [OD-12]
candidate_tasks:
  - register B16 as the golden-control pilot (its section 20)
  - versioned definition cards DEF-AA2F-1 / DEF-AA2FR-1
  - run-manifest schema with a not_checked field
do_not_implement_directly:
  - research/conjectures/ as anything resembling a second claims authority
  - the full 10-state lifecycle before the B16 pilot proves the record model
summary: >
  A full lifecycle from observation to independently challenged result:
  LEAD -> OBSERVED -> FORMALIZED -> CHALLENGE_READY -> {REJECTED,
  SURVIVED_BOUNDED_TESTS, RESOLVED_BOUNDED, PROVED_INTERNAL} ->
  EXTERNALLY_REPLICATED -> PROOF_AUDITED. Contributes versioned definitions, the
  discovery/challenge separation, counterexample minimization, and proof
  obligations.
```

**Its §1.1 self-limitation is the reason it is safe to accept in principle.** A
conjecture record may say *"this claim was formalized and survived these precisely
bounded tests"*; it may **not** say *"this is a project-confirmed mathematical
result."* When a reportable result appears, an approved `MATH_CLAIMS.md` row is
created and the conjecture record points at it. **The ledger always wins.** This is
OD-7 already satisfied by design.

**Its §2.2 list of things that are not new knowledge** is the sharpest statement of
project discipline anywhere in the intake, and every item maps to a recorded project
failure:

```text
a longer finite word as evidence of infinite existence
a better record without a verified artifact
a DFS "tunnel" or "phase transition" without an invariant counterpart
a large percentage from the same data the rule was found in
a statistical confidence percentage for a mathematical truth
agreement between several AI agents
many tests, if the tests share the same faulty core code
precise text citing a source that has not been opened
```

**Its §1 authority table repeats the `AGENTS.md` / `CLAUDE.md` conflation** already
recorded in `AUTHORITY_MAP.md` §8.1.

---

### PLAN-REC-001

```yaml
plan_id: PLAN-REC-001
source_file: docs/plans/intake/RECORD_HUNTING_RESEARCH_PIPELINE.md
source_sha256: 854c47592c966cc02b8f74d3af75bc83fb5733d6c83405961df6592f29ea5492
title: Record Hunting and Research Harvest Pipeline
document_type: [research-program, implementation]
status_in_source: "design proposal / ready for implementation"
proposed_program_status: PROPOSED
authority_level: proposal
missions: [research, infrastructure, community]
depends_on: [PLAN-CONJ-001, PLAN-RECORDS-001]   # declared: "Related plans"
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-2]
candidate_tasks:
  - research/records/records.yml with persistent REC- identifiers
  - scripts/verify-record-word.js with mutation tests
  - records-check.js in warning mode
do_not_implement_directly:
  - its section 39 task 2, which instructs editing an intake document
  - publishing any word before Layer-4 verification and permission
summary: >
  Two linked but never merged pipelines: a RECORD pipeline that manages
  artifacts and a RESEARCH HARVEST pipeline that manages knowledge. Contributes
  the record frontier, the lineage graph, the negative frontier, maximality
  certificates, contamination tracking, adversarial verifier mutation testing,
  and stop rules with resurrection conditions.
```

**Its four strongest original contributions**, none of which appears elsewhere:

1. **The record frontier (§11)** — keeping only the champion creates severe survivor
   bias. Ten near-record words from different regions may be worth more than one
   longest word, because they answer *are all records descendants of one branch?*
2. **The negative frontier (§14)** — maximal words that cannot be extended, minimal
   dead suffixes, minimal invalid seams. §14.2 argues these may be worth more than the
   record, and the argument holds: a minimal negative object can expose a missing
   condition or kill a proof strategy, while a longer positive word proves existence
   at one length.
3. **Contamination and feedback tracking (§31)** — once records are public, later
   searches seed from them, and a descendant record can be mistaken for independent
   rediscovery. This is `AGENTS.md` rule 13 (seed hygiene) generalized to the public
   record.
4. **Adversarial verifier testing (§32)** — a verifier that only ever sees valid
   records has untested blind spots. Mutate valid words and require rejection *for the
   correct reason*.

**Two defects.**

- **§6's schema example is a live-looking entry for an unverified word.** It shows
  `length: 2107`, `status: PROJECT_RECORD`, `verification.status:
  independently_verified`, `claim_rows: [108]`. `NEXT_STEP.md` records the 2107-letter
  candidate as a **private, unverified GPU-search report, blocked on obtaining the
  actual string**, against a project-verified record of 1928 (`MATH_CLAIMS.md` row
  40). The example must never be copied into a real registry.
- **§39 task 2 instructs updating `RECORDS_SECTION_SPEC.md`** — editing an intake
  document. Prohibited during bootstrap.

---

### PLAN-DICT-001

```yaml
plan_id: PLAN-DICT-001
source_file: docs/plans/intake/DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md
source_sha256: a20707dbbc4755d9453afe5a3e874dbe371ade92a8eb15c2e688f606381de474
title: Dictionary-Accelerated Backtracking Research and Development Plan
document_type: [software-audit, research-program, implementation]
status_in_source: "implementation plan / code audit / research roadmap"
proposed_program_status: PROPOSED
authority_level: audit findings are checkable; roadmap is a proposal
missions: [research, infrastructure]
depends_on: [PLAN-REC-001, PLAN-CONJ-001]        # declared
blocked_by: [OD-2]                               # its source dictionary is the quarantined dataset
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-2]
candidate_tasks:
  - dictionary provenance audit and immutable D40-0001 manifest
  - small-window calibration (its section 26)
do_not_implement_directly:
  - any scientific use of the JS prototypes before the audit fixes land
    (its own Phase 0: "freeze scientific use")
  - hard-D40 results labelled as unrestricted AA2FR
summary: >
  A code audit of the two JavaScript prototypes plus a roadmap turning the
  40-letter dictionary into an audited local-language artifact, a 39-state
  graph, and a set of soundness-labelled search modes. Introduces AA2FR-D40 as a
  named third language with the safe inclusion AA2FR-D40 subset-of AA2FR.
```

**One audit finding was verified directly against the code in this session**, rather
than relayed:

> §2.2: *"The dictionary implementation's `verifyAa2fr` function checks abelian
> squares but does not check the six FORBID4 patterns. It is therefore an AA2F
> verifier under an AA2FR name."*

Inspection of the two files:

| File | `verifyAa2fr` signature | Checks FORBID4? | FORBID4 mentions in file |
|---|---|---|---|
| `scratch/backtracker.js` | `verifyAa2fr(word, pureMode)` | **yes**, when `!pureMode` | 6 |
| `scratch/dict_backtracker.js` | `verifyAa2fr(word)` | **no** | **0** |

**The audit finding is confirmed for `dict_backtracker.js`.** The function computes
`pA`, `pB`, `pC` prefix sums and scans `len` from 2 — a correct AA2F check — and the
file contains no FORBID4 string anywhere. `backtracker.js`'s version is correct.

This has a consequence for a truth file. See §8.1.

**The second audit finding — the rolling-hash boundary bug (§2.1)** — was **not**
verified in this session. It concerns backtracking across the 40→39 boundary and
would require constructing a trace. It is recorded as an unverified audit claim.

**Its §2.6 correction of "O(1)" and "zero allocation"** is the fourth independent
statement of this correction across the intake.

---

### PLAN-CUT-001

```yaml
plan_id: PLAN-CUT-001
source_file: docs/plans/intake/CUT_AND_CERTIFY_RESEARCH_PLAN.md
source_sha256: b46e776f84397bdee900287cfa2e72dcde2178e87f8217c96cf603a98c4e8a22
title: Cut-and-Certify Research Plan for Abelian-Square Avoidance
document_type: [research-program]
status_in_source: "exploratory research plan"
proposed_program_status: PROPOSED
authority_level: proposal, self-labelled exploratory
missions: [research]
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: []
candidate_tasks:
  - E1 prefix-path equivalence (see section 9 — closest executable question)
  - E2 exact join equivalence
do_not_implement_directly:
  - hard pruning from any boundary signature (its own Gate E)
  - citing arXiv:2408.07818, 2503.01800, 2602.04407 or 2107.09206 before opening
summary: >
  A methodologically-inspired exploratory line. Reformulates Abelian squares as
  forbidden three-term arithmetic progressions in the prefix-Parikh path, then
  builds segment/join certificates, an obligation coverage ledger, and an
  adversarial search for insufficient boundary signatures.
```

**It polices its own analogy better than any other document in the intake.** §1.1
states what the physics source actually says; §1.2 labels the project inferences as
inferences; §1.3 lists seven things it explicitly does **not** claim, including *"that
Mäkelä's conjecture is related to Hilbert's Sixth Problem"* and *"that a finite
sufficient boundary state exists"*. §38 closes by stating the prefix-path,
hypergraph, signature, certificate and experiment proposals are project-specific and
not attributed to the physics sources.

This is exactly the discipline `EPISTEMIC_DISCIPLINE.md` §7 demands of application and
impact claims, applied pre-emptively.

**Its §3.2 reformulation is mathematically checkable and correct as stated:**

```text
factor at s with half-length K is an Abelian square
  <=>  P(s+K) - P(s) = P(s+2K) - P(s+K)
  <=>  P(s) + P(s+2K) = 2 P(s+K)
```

i.e. a three-term arithmetic progression in the prefix-Parikh path at `s, s+K, s+2K`.
This is a restatement of the definition, not a new result, and the document treats it
as such — §3.5 explicitly warns that it *"does not automatically yield a faster
algorithm"* and points at the 3SUM-style hardness literature.

**One subtle interaction, recorded because it is easy to miss.** §3.3 introduces
reduced coordinates `Q(i) = (i, A(i), B(i))`, dropping the `c` count as redundant. The
records spec (PLAN-RECORDS-001 §2.1) requires the *independent* verifier to count all
three letters directly and **not** infer the third, *even though the shortcut is
mathematically valid*, purely to keep implementations independent. Both are correct;
they must not be the same implementation. A Cut-and-Certify reference detector using
reduced coordinates is fine — but it cannot then serve as the Layer-4 independent
checker.

---

### PLAN-JAVA-001

```yaml
plan_id: PLAN-JAVA-001
source_file: docs/plans/intake/JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md
source_sha256: c240e31f98d428d850b134bcbdd246cec874b7c6674467da585253642974bcce
sidecar: docs/plans/intake/java-cow-backtracker-v1.2-checksums.txt
title: Java COW Backtracker v1.2 — Complete User and Research Guide
document_type: [software-guide]
status_in_source: "Complete User and Research Guide; Audited revision: 1.2"
proposed_program_status: REFERENCE          # proposed classification, section 4
authority_level: documents an existing artifact; NOT a prioritization mandate
missions: [research]
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: [OD-13]
candidate_tasks: []
do_not_implement_directly:
  - its section 34 citation text, which names revision 1.1 (see section 4.3)
  - any compile-dict invocation against the quarantined dataset (OD-2)
summary: >
  Operating manual for an existing, source-audited Java engine. Five explicitly
  soundness-labelled search modes, three worker modes, IndependentVerifier
  separate from the search predicate, tested checkpoint-resume equivalence, run
  manifests, and a self-test suite. The artifacts themselves are not in this
  repository.
```

---

## 3. Overlaps and hard dependencies

Declared dependencies (from the documents' own headers) and inferred ones are kept
separate.

```text
                       PLAN-CONJ-001
                    (knowledge lifecycle)
                            ^
                            | promoted observations
                            |
   PLAN-REC-001  ---------- +
 (artifact lifecycle)       |
        ^                   |
        | UI spec           | harvest
        |                   |
 PLAN-RECORDS-001    PLAN-DICT-001 ------> blocked by OD-2
   (Wave 2, records         |
    section UI)             | modes implemented by
                            v
                     PLAN-JAVA-001
                   (existing artifact)

   PLAN-CUT-001 ---- independent; touches D40 only at its Phase 5
```

### 3.1 Hard dependencies

| From | To | Nature |
|---|---|---|
| PLAN-REC-001 | PLAN-CONJ-001 | Declared. Its harvest §16.2 ends at "formal conjecture"; only formal conjectures enter the conjecture pipeline |
| PLAN-REC-001 | PLAN-RECORDS-001 | Declared. §37 Phase 8: *"Use the existing `RECORDS_SECTION_SPEC.md` as the UI specification"* |
| PLAN-DICT-001 | PLAN-REC-001, PLAN-CONJ-001 | Declared as "Related plans"; its §32 output routing sends verified words to the record registry and promoted leads to the conjecture registry |
| PLAN-DICT-001 | **the quarantined dataset** | **Hard block.** See §3.3 |
| PLAN-JAVA-001 | PLAN-DICT-001 | Inferred and strong. The Java engine's five modes are exactly the dictionary plan's §4.1–4.5 |

### 3.2 Conceptual overlap that is not duplication

All four process documents define a promotion ladder. They are **not** competing —
they operate on different objects:

| Document | Ladder | Object |
|---|---|---|
| PLAN-CONJ-001 §4.1 | LEAD → OBSERVED → FORMALIZED → CHALLENGE_READY → … | a claim |
| PLAN-REC-001 §16.2 | telemetry → lead → bounded observation → formal conjecture | an observation |
| PLAN-REC-001 §3.2 | CANDIDATE → VERIFIED_WORD → PROJECT_RECORD → … | a word |
| PLAN-CUT-001 §29 | IDEA → … → HEURISTIC_ONLY → SOUND_PRUNING_PROVED | a pruning rule |
| PLAN-GOV-001 §7 (Wave 1) | IDEA → CANDIDATE → TESTED → REPRODUCED → REVIEWED → ACCEPTED | a contribution |

Five ladders, five object types, one shared principle: **no object changes status
without an explicit promotion event.** They compose rather than collide.

### 3.3 The dependency that blocks an entire line

`PLAN-DICT-001` §5.1 names its source dictionary:

```text
aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt
```

`PLAN-JAVA-001` §19.1 and §31 invoke it as
`datasets\aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt`.

**This is the file in OD-2** — currently tracked in a public repository with
unresolved provenance, preliminary direction *quarantine until traced*.

Consequently **every D40-dependent activity is blocked on OD-2**: dictionary
compilation, the D40 audit, the 39-state graph, hard/order/defect search modes,
record replay through the dictionary, seam rigidity, Cut-and-Certify Phase 5, and the
dictionary-derived CEGIS priors.

This was not visible in Wave 2, where OD-2 looked like an isolated hygiene item. It is
the single highest-leverage open decision in the whole program: one unresolved
provenance question gates a large fraction of the research roadmap.

---

## 4. The correct role of Java COW Backtracker v1.2

### 4.1 It is the audited reference implementation, and it is *not* a proposal

The guide documents an artifact that already exists and has been source-audited. Its
§6 self-test suite includes items that are direct answers to `PLAN-DICT-001`'s audit
findings:

| Java v1.2 has | Dictionary plan asks for |
|---|---|
| 100,000 randomized append/backtrack rolling-hash operations | §2.1 required property test |
| exhaustive incremental-vs-independent validator comparison, lengths 0–9 | §2.2 standalone verifier |
| 10,000 fixed-width base-3 encode/decode round trips | §3.3 round-trip tests |
| five modes: `aa2f-exact`, `aa2fr-exact`, `aa2fr-d40-hard`, `aa2fr-d40-order`, `aa2fr-d40-defect` | §4.1–4.5, name for name |
| `partition` worker mode with disjoint subtrees | §2.7 partition mode |
| checkpoint bound to run ID, mode, seed checksum, dictionary checksum | §30 safe checkpoint format |
| `EXHAUSTED` vs `BUDGET_EXHAUSTED` as distinct statuses | §19 interpretation limits |
| separate `verify` command in a fresh process | §31 separate search and certification |

**Therefore: the dictionary plan's audit does not target the Java engine.** It targets
`scratch/backtracker.js` and `scratch/dict_backtracker.js` — two JavaScript prototypes
that exist in this repository. Two different codebases. Reading the audit as a
criticism of the Java engine would be a straightforward category error.

### 4.2 The artifacts are not in this repository

Verified: no `java-cow-backtracker*` directory, no `.jar`, no `SOURCE_AUDIT_REPORT.md`.
The intake contains only the guide and a checksum sidecar naming three files that are
absent:

```text
8ad1ba75…  java-cow-backtracker-v1.2.zip
62cdc183…  java-cow-backtracker-v1.2/build/cow-backtracker.jar
7bf021e0…  java-cow-backtracker-v1.2/SOURCE_AUDIT_REPORT.md
```

The checksums are useful — they pin identity if the artifacts are produced — but
today they pin nothing that can be checked. Whether the engine becomes a vendored
part of the repository or stays an external release artifact is **OD-13**.

Also recorded: the guide names the main class `fi.joonashuhta.cowsearch.Main`, so the
Java engine is the maintainer's own work, not third-party. That simplifies OD-13's
rights dimension but not its archival one.

### 4.3 A software-version identity defect in the guide

**§34's recommended provenance text says "revision 1.1":**

> *"The finite word was found using Java COW Backtracker revision 1.1 in
> `aa2fr-d40-order` mode…"*

The guide is for revision **1.2**, and §15.4 documents a resume-correctness bug that
existed in 1.1 and was fixed in 1.2: revision 1.1 advanced the candidate-choice index
before acquiring the global node permit, so a checkpoint could mark an unattempted
branch as consumed.

Copying §34 verbatim would attribute a result to the revision with the known
checkpoint defect. Given that `PLAN-CONJ-001` §11.2 and §19.1 both make software
version binding a correctness requirement, this is not a typo to wave through — it is
exactly the drift those sections exist to prevent.

### 4.4 Is any older tool or guide superseded?

**No supersession is declared anywhere in Wave 3, and none is asserted here.**

The relationship is layered, not sequential:

| Artifact | Location | Status |
|---|---|---|
| Java COW Backtracker v1.2 | external, checksummed | audited reference implementation |
| `scratch/backtracker.js` | in repo | prototype; correct FORBID4 handling |
| `scratch/dict_backtracker.js` | in repo | prototype; **verifier defect confirmed** |
| `scratch/backtracker.cpp` | in repo | C++ engine; the guide's §25 independent cross-check path |

`PLAN-DICT-001` §32 already routes prototypes to `scratch/` — which is exactly where
they are. The correct action is not to declare the JS prototypes superseded but to
**mark `dict_backtracker.js` as not usable for certification** until its verifier is
fixed, which its own Phase 0 ("freeze scientific use") already requires.

---

## 5. Exact modes versus heuristic modes

This is the clearest agreement in Wave 3 and the most important thing to preserve.

| Mode | Rule set | Exhaustion means | Class |
|---|---|---|---|
| `aa2f-exact` | AA2F | no continuation to target below the fixed seed, in AA2F | **exact** |
| `aa2fr-exact` | AA2F + FORBID4 | same, in AA2FR | **exact** |
| `aa2fr-d40-order` | AA2FR decides validity; D40 orders branches only | same, in AA2FR — dictionary affects order only | **exact** |
| `aa2fr-d40-defect` | AA2FR + at most *d* windows outside D40 | exhaustion **inside the defect budget** | bounded/heuristic |
| `aa2fr-d40-hard` | AA2FR + every 40-window in D40 | exhaustion **only in AA2FR-D40** | **heuristic w.r.t. AA2FR** |

Three qualifiers apply to every row:

1. **`EXHAUSTED` ≠ `BUDGET_EXHAUSTED`.** A budgeted stop is inconclusive about
   existence. The Java engine reports these as distinct statuses.
2. **A locked seed bounds the result.** `AGENTS.md` rule 15 requires every exhaustion
   report to state whether backtracking below the seed was permitted. The Java guide's
   §12.2 is explicit: *"The seed is treated as a locked prefix."* So every Java
   exhaustion is a **local** dead end unless the seed is `a`.
3. **`portfolio` mode is not a partition.** Six workers with different letter orders
   search the *same* rooted tree. The guide §10.2 says so; the dictionary plan §2.7
   says so. Only `partition` gives disjoint coverage.

**The language chain, and it must never be flattened:**

```text
AA2FR-D40  ⊆  AA2FR  ⊆  AA2F
```

Absence from D40 means *absent from this dictionary version* — never *mathematically
invalid*. All four relevant documents state this independently.

---

## 6. The R0–R5 collision — two incompatible scales, same labels

**PLAN-CONJ-001 §15.3** and **PLAN-PLATFORM-001 §25** (Wave 1) both define levels
`R0`–`R5`. They are **different scales**:

| Level | PLAN-PLATFORM-001 §25 (reproducibility) | PLAN-CONJ-001 §15.3 (independence) |
|---|---|---|
| R0 | described; no runnable artifact | same program, same environment |
| R1 | artifact available | clean clone, same program |
| R2 | internally reproducible from a clean checkout | different CLI or data structure, same core library |
| R3 | independently reimplemented | different implementation, same mathematical method |
| R4 | externally replicated | different method or representation |
| R5 | formally or proof audited | proof or formal verification not needing the original search |

They overlap in spirit and diverge in detail — R2 is "clean checkout reproduces" in
one and "different CLI, shared core" in the other. If both are implemented, a record
labelled `R3` is ambiguous, and the ambiguity lands precisely on the axis the project
has already been burned by (`KNOWLEDGE_STATE.md` rejection #10: *"the independence
axis was wrong"*).

Recorded as **OD-12**. It is cheap to fix now and expensive after the labels are in
metadata.

---

## 7. What constitutes a publishable record

Assembled from PLAN-REC-001 §8, PLAN-RECORDS-001 §2, PLAN-JAVA-001 §24, and
`AGENTS.md` rules 14, 15 and 17. All four agree; nothing below is invented here.

```text
1  the exact word, stored — not only its length or checksum
2  persistent identifier REC-<CLASS>-NNNN, never reused
3  explicit language class: AA2F or AA2FR, never a merged ranking
4  SHA-256 of the artifact file
5  independent verification on a SEPARATE code path (Layer 4, section 8)
       all positions, all half-lengths K >= 2,
       all three letter counts computed directly,
       FORBID4 checked separately in AA2FR mode
6  a fresh-process re-verification, not the search's own certification alone
7  run manifest: commit, mode, worker mode, seed + seed checksum, budgets,
       dictionary ID + checksum where applicable, result status
8  explicit mode label in the filename and every log line (AGENTS rule 14)
9  provenance: finder, provider, verifier, date, permission to publish
10 maximality status: extendable / right-maximal / two-sided maximal / unknown
11 lineage: is this an extension of an existing record, or independent?
12 a MATH_CLAIMS.md row when a number is published
13 the permanent experimental disclaimer on the page
```

**Item 5 is the one most likely to be skipped, and item 11 the one most likely to be
faked without meaning to.** A record produced by seeding from a published record is a
descendant, not an independent rediscovery (PLAN-REC-001 §31) — and `AGENTS.md` rule
13 already forbids seeding a `--pure` run from a heuristic run's output.

**Never published:** an unverified candidate as a record; a merged AA2F/AA2FR
leaderboard; the unqualified phrase "world record" (PLAN-REC-001 §3.3 — the default is
*longest word independently verified by this project*).

---

## 8. Required independent verification

### 8.1 The Layer-4 requirement, and a truth-file problem

Wave 2 established a four-layer verifier architecture, with **Layer 4 = an independent
full verifier on a genuinely separate code path**. Wave 3 supplies the operational
detail (PLAN-REC-001 §8, PLAN-RECORDS-001 §2.1) and, unexpectedly, a problem.

**`AGENTS.md` rule 17 reads:**

> *"Every claimed record must be validated by an independent checker (e.g.
> `verifyAa2fr`) that verifies the word post-generation."*

Two functions in this repository carry that name, and they are not equivalent:

| File | Checks FORBID4? |
|---|---|
| `scratch/backtracker.js` | yes |
| `scratch/dict_backtracker.js` | **no** — file contains zero FORBID4 references |

So the rule's own example is ambiguous, and one referent **cannot** validate an AA2FR
record. A session following rule 17 literally, using the dictionary prototype, would
certify an AA2FR record with an AA2F checker and report it as independently verified.

**This requires an owner-approved correction to `AGENTS.md`.** It touches a truth file,
so it is recorded here rather than performed — the same treatment given to the
`CLAUDE.md` router in `AUTHORITY_MAP.md` §8.1. It is not raised as an owner *decision*
because there is nothing to decide: the rule's example is wrong and the fix is
mechanical.

### 8.2 Independence is a property to be argued, never assumed

Ranked from weakest to strongest, as the documents themselves frame it:

```text
same function, called twice                        not independent
different CLI, same core predicate                 not independent (CONJ 8.2 states this)
IndependentVerifier inside the Java engine         stronger than trusting the DFS
                                                   predicate, but same codebase,
                                                   same language, same author
fresh process, same jar                            catches state reuse, not logic errors
C++ engine verifying a Java result                 different implementation, different
                                                   language  <-- the real Layer 4
external researcher's own implementation           strongest available
```

PLAN-CONJ-001 §8.2 is explicit: *renaming variables or calling the same core library
from a different CLI is not an independent check.* PLAN-REC-001 §8.4 requires each
verification report to **disclose** the shared code between search, verifier, anatomy
analyzer and website exporter.

PLAN-CUT-001 §18.3 adds the sharpest practical rule found anywhere in the intake:
Java and C++ *"should not copy the same loop structure verbatim"* — one may enumerate
by endpoint and *K*, the other by centre and radius, and they must still cover the
same obligation set. Structural diversity in the enumeration, not just a second file.

---

## 9. The research line closest to an executable next question

# **Cut-and-Certify experiment E1, then E2.**

**E1 — prefix-path equivalence.** Implement Abelian-square detection twice: once as
standard Parikh-block comparison, once as the arithmetic-progression condition
`P(s) + P(s+2K) = 2P(s+K)`. Compare exhaustively over all ternary words up to a
feasible length. Acceptance: identical validity, identical first violation, identical
`start` and `K`.

**Why this and not the alternatives:**

| Criterion | E1 |
|---|---|
| Blocked by OD-2 (dataset)? | **No** — needs no dictionary |
| Blocked by OD-1 (history)? | No |
| Needs unopened literature? | No — the reformulation is a restatement of the definition |
| Needs new infrastructure? | No |
| Runtime | short exhaustive; no long search |
| Falsifiable | yes, and a mismatch is immediately informative |
| Produces a reusable artifact | yes — a second, structurally different detector, which is a genuine Layer-4 candidate |

That last row is the decisive one. E1 does not merely test an idea; it **produces the
independent code path** that §8 says every published record needs, and it produces it
by a different mathematical route rather than by retyping the same loop.

**E2 — exact join equivalence** follows immediately: compare a full verifier on `L+R`
against child certificates plus a crossing-only join verifier, on exhaustive short
pairs and deliberately corrupted joins. Acceptance: zero mismatches. Its §35 Gate A
makes E1 and E2 the gate for everything else in that line, which is the correct
ordering.

**Runner-up, and it is close:** `PLAN-CONJ-001` §20's B16 golden-control pilot —
registering the already-resolved eight-bigrams-force-the-ninth result (`MATH_CLAIMS.md`
row 99) through the full conjecture lifecycle. It is a process test rather than a
mathematical one, but it has the same virtue: it is cheap, unblocked, and its failure
mode is informative. §20 states the criterion well — *if this history does not fit the
record model without creating a second source of truth, the model must be fixed before
any open conjecture uses it.*

**Note on `NEXT_STEP.md`.** The 2026-08-04 handoff names CEGIS Route A as the highest
research priority. That is the **current-work authority** and Wave 3 does not
override it. E1 is offered as the line closest to executable *among the five Wave 3
documents*, which is the question asked.

---

## 10. Lines that should remain paused or exploratory

| Line | Recommended state | Reason |
|---|---|---|
| **All D40 work** — compilation, audit, graph, hard/order/defect modes, seam studies | **BLOCKED** | Source dictionary is the OD-2 file. Not a research judgement; a rights one |
| `dict_backtracker.js` for any certification | **FROZEN** | Verifier defect confirmed (§2, PLAN-DICT-001). Its own Phase 0 requires this |
| Cut-and-Certify Phases 5–9 | **PAUSED behind Gate A** | Its own §35: proceed only if E1 and E2 show zero mismatches |
| Boundary signatures as pruning | **HEURISTIC_ONLY, permanently until proved** | PLAN-CUT-001 §29: cannot become `SOUND_PRUNING_PROVED` through empirical success alone |
| Obligation-state model (§11) | **EXPLORATORY** | The document says the complete future-relevant state may grow with word length, and that discovering no small sufficient state exists would itself be a useful negative result |
| Record campaigns for length alone | **PAUSED** | PLAN-REC-001 §18: campaigns need stop rules *before* execution, and none exists |
| The 2107-letter candidate | **BLOCKED on the artifact** | `NEXT_STEP.md`: private, unverified, string not obtained. `REPORTED_EXTERNAL_RECORD` at most |
| Full conjecture-pipeline lifecycle | **PAUSED behind the B16 pilot** | §20's own gate |
| Anything citing the physics or hardness papers | **BLOCKED on `AGENTS.md` rule 1** | §11 below |

---

## 11. Claims requiring source tracing or mathematical verification

**None was resolved in this wave.**

### 11.1 Untraced sources named in Wave 3

| Source | Named in | Status |
|---|---|---|
| Deng, Hani, Ma — arXiv:2408.07818 | PLAN-CUT-001 §38 | not opened |
| Deng, Hani, Ma — arXiv:2503.01800 | §38 | not opened |
| Bodineau, Gallagher, Saint-Raymond, Simonella — arXiv:2602.04407 | §38 | not opened |
| Sandbox Physics popular article | §38 | **secondary source**; `AGENTS.md` rule 1 requires it be labelled as such |
| Radoszewski, Rytter, Straszyński, Waleń, Zuba — arXiv:2107.09206, ESA 2021 | §38, and PLAN-CHARTER-001 §45 (Wave 1) | **not opened, named twice across waves** |

The hardness paper is the one that matters mathematically: PLAN-CUT-001 §3.5 uses it
to caution against expecting subquadratic detection. That caution is currently resting
on an unopened source. `LITERATURE_COVERAGE.md` does not record it as opened.

### 11.2 Claims about the project's own code

| Claim | Status |
|---|---|
| `dict_backtracker.js`'s `verifyAa2fr` omits FORBID4 | **VERIFIED this session** by direct inspection |
| Rolling-hash corruption at the 40→39 backtrack boundary | **not verified** — requires constructing a trace |
| Dictionary may be symmetry-expanded twice | **not verified** — requires the dataset, which is quarantined |
| The `"Full O(1) Abelian Square Check"` comment is misleading | asserted by PLAN-RECORDS-001 §3a and PLAN-DICT-001 §2.6; the comment's presence was not located this session |
| Java v1.2 self-test contents | **not verifiable** — artifacts absent from the repo |

### 11.3 Terminology

`PLAN-DICT-001` §1.2 and `PLAN-JAVA-001` §2.4 both describe FORBID4 neutrally as *six
forbidden length-four factors*, with no attribution. **Both comply with the Wave 2
ruling** prohibiting "Veikko's rule". Only PLAN-RECORDS-001 uses the prohibited term.

---

## 12. Reproducibility, checkpoints, and software identity

### 12.1 Checkpoint and resume correctness

`PLAN-JAVA-001` §15.3 describes the strongest resume test in the intake:

```text
one uninterrupted deterministic single-worker run
    vs.
the same run stopped at a fixed node budget, checkpointed, and resumed

requires: same final word AND same total node count
```

The guide states plainly why this matters: it is *"materially stronger than merely
checking that a checkpoint can be serialized and read."* A serialization round-trip
proves the file format works; only the equivalence test proves no branch was skipped
or repeated.

**Honestly declared limitations (§27):** single-checkpoint resume only, no
whole-campaign resume, no shutdown hook on Ctrl+C, periodic checkpoints written only
after accepted extensions so a rejection-heavy interval leaves the checkpoint behind
the in-memory state, and a checkpoint write failure is logged but does not terminate
the search.

The repository's own six untracked `checkpoint_worker_*.json` files come from the JS
prototype, not the Java engine, and are covered by process question P-2.

### 12.2 Software-version identity

Three requirements converge: `PLAN-CONJ-001` §11.2 (results bind to definition
version, commit, and verifier version), `PLAN-DICT-001` §23 (immutable dictionary
versions; never edit a binary in place), `PLAN-JAVA-001` §19.6 (versioned dictionary
paths; never silently replace one used by an earlier run).

Against that standard, three identity gaps exist today: the guide's §34 names the
wrong revision (§4.3); the checksummed Java artifacts are absent (§4.2); and no
dictionary version identifier exists yet, because compilation is blocked by OD-2.

### 12.3 Negative-result preservation

Wave 3 extends `NEGATIVE_RESULTS.md` rather than competing with it:

- PLAN-REC-001 §14 — the **negative frontier**: maximal words, minimal dead suffixes,
  minimal invalid seams, smallest counterexamples to heuristics.
- PLAN-CONJ-001 §9.2 — a good rejection must answer at least one of: which assumption
  was missing; which data property misled; was the pattern an artefact of the search
  rather than the mathematics; is there a smaller corrected claim; does it close a
  whole proof strategy; can it become a regression test.
- PLAN-CONJ-001 §19.18 — reuses the existing `NECESSARY` / `BOUNDED` / `CONTEXTUAL`
  finality classes and adds a **resurrection condition** per record.
- PLAN-CUT-001 §31 — *"A negative conclusion should be documented rather than
  hidden."*

---

## 13. What must be completed before a public research campaign

Assembled across all three waves. Ordered by dependency, not by effort.

```text
RIGHTS AND SAFETY
  1. OD-2 resolved — the D40 source dictionary's provenance                [BLOCKS D40]
  2. OD-1 decided — Git-history remediation plan, or a documented decision  [BLOCKS
     recruitment; PLAN-WEB-001 section 11.2]
  3. artifact-denylist CI                                                   [independent]

CORRECTNESS
  4. dict_backtracker.js verifier fixed, or the file marked non-certifying
  5. rolling-hash boundary claim verified or refuted
  6. AGENTS.md rule 17's verifyAa2fr example corrected      [owner-approved task]
  7. a Layer-4 independent verifier exists and is mutation-tested

IDENTITY
  8. OD-13 decided — where the Java engine lives and how it is archived
  9. the revision 1.1 / 1.2 citation defect corrected before any provenance text
     is copied
 10. OD-12 decided — one R0-R5 scale, not two

PROCESS
 11. record registry with persistent IDs, checksums, and AA2F/AA2FR separated
 12. stop rules and a resurrection condition defined BEFORE any campaign runs
 13. B16 registered as the conjecture-pipeline golden control
 14. run manifests including a not_checked field

PUBLIC SURFACE
 15. the permanent experimental disclaimer, and no merged leaderboard
 16. no "world record" phrasing without documented priority basis
 17. no page element expressing "progress toward proof"
```

Items 1, 2 and 12 are the ones that cannot be retrofitted. A campaign run without stop
rules cannot have them applied afterwards, because the decision to continue will
already have been made under sunk cost — which is precisely what PLAN-REC-001 §18.3
says the rule exists to prevent.

---

## 14. Owner decisions arising from Wave 3

Two, both genuinely new. Detail in `OWNER_DECISIONS_REQUIRED.md`.

- **OD-12 — one R0–R5 scale.** PLAN-PLATFORM-001 §25 and PLAN-CONJ-001 §15.3 define
  the same labels differently (§6). Cheap now, expensive once the labels reach record
  and conjecture metadata.
- **OD-13 — where the Java COW Backtracker lives.** The guide is in the repository;
  the checksummed artifacts are not. Vendored, external release artifact, or
  reconstructed from source? Interacts with OD-1 (history size) and OD-3 (licensing).

**Not raised as owner decisions**, because nothing is in dispute — but each needs an
approved task: correcting `AGENTS.md` rule 17's example (§8.1); correcting the
revision 1.1 citation text (§4.3); and marking `dict_backtracker.js` non-certifying.

---

## 15. What Wave 3 deliberately did not do

- **No Wave 4.** No roadmap, plan inventory, dependency-and-conflict map, program map,
  `CURRENT_FOCUS.md`, or `TASK-0001.md`.
- **No long searches.** No `search`, no `compile-dict`, no exhaustive run. The only
  code executed was reading two prototype functions and counting string occurrences.
- **No implementation** of any pipeline, verifier, registry, or schema.
- **No claim wording or status changed.** §11's items are recorded as required checks.
- **No files edited outside `docs/program/`.** The `verifyAa2fr` defect, the revision
  1.1 citation defect, and the `AGENTS.md` rule 17 ambiguity are recorded, not fixed.
- **No intake document renamed or moved.** PLAN-REC-001 §39 task 2 explicitly asks for
  an intake edit; it was not performed.
- **No source opened.** The five untraced references in §11.1 remain untraced.
- `node tests/test.js` and `node scripts/check-claims-drift.js` were **not run**.

---

## 16. Checkpoint questions for the owner

1. Is the four-authority-level classification (§1) correct — in particular, that the
   Java guide is a **reference**, not a prioritization mandate?
2. Is it accepted that OD-2 blocks the entire D40 line (§3.3), making it the
   highest-leverage open decision in the program?
3. Should `scratch/dict_backtracker.js` be marked non-certifying immediately, ahead of
   any other Wave 3 work?
4. Is the `AGENTS.md` rule 17 correction (§8.1) approved as a bounded task?
5. Is Cut-and-Certify E1 accepted as the closest executable next question among the
   Wave 3 lines (§9) — noting that `NEXT_STEP.md`'s CEGIS Route A remains the
   current-work authority?
6. OD-12 and OD-13: decide, defer, or leave open?
7. May the agent proceed to Wave 4?
