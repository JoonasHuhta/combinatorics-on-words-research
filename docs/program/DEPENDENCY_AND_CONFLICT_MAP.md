# Dependency and Conflict Map

**Wave:** 4
**Produced:** 2026-08-06
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §8.3

§8.3 requires six relationship kinds to be distinguished. They are kept strictly
separate below, because the failure mode this map exists to prevent is treating a
recommended ordering as a hard dependency, or a topic conflict as a rejected plan.

```text
HARD DEPENDENCY          B cannot be correct or safe without A
RECOMMENDED ORDERING     B is cheaper, safer, or better informed after A
CONCEPTUAL OVERLAP       A and B address the same idea without competing
DIRECT CONTRADICTION     A and B cannot both be implemented as written
SUPERSESSION             A replaces B as authority
INDEPENDENT WORKSTREAM   no relationship; may proceed in parallel
```

---

## 1. Hard dependencies

A hard dependency means implementing the dependent item without the prerequisite
produces something incorrect, unsafe, or unpublishable — not merely suboptimal.

| # | Dependent | Prerequisite | Nature | Source |
|---|---|---|---|---|
| H1 | **All computational, experimental, publication, redistribution, and research use of the D40 dataset** | **OD-2 resolved** | The D40 source dictionary is the file with unresolved provenance | verified, Wave 3 §3.3 |
| H2 | PLAN-DICT-001 | the dataset | §5.1 names it as its source | declared |
| H3 | PLAN-JAVA-001's `compile-dict` | the dataset | §19.1, §31 invoke it by path | declared |
| H4 | Any published record | Layer-4 independent verifier | PLAN-REC-001 §8, PLAN-RECORDS-001 §2.1, `AGENTS.md` 17 | declared |
| H5 | Any published record | `MATH_CLAIMS.md` row | `AGENTS.md` rule 7 | canonical |
| H6 | PLAN-REC-001 harvest output | PLAN-CONJ-001 | Only formal conjectures enter the conjecture pipeline | declared |
| H7 | PLAN-REC-001 records page | PLAN-RECORDS-001 | §37 Phase 8 names it as the UI spec | declared |
| H8 | Claim IDs in tutorial and puzzle files | generated ledger export | OD-7: registries are generated, never a second authority | decided |
| H9 | Abelisk shared core | changed-index verifier (Layer 3) | Tutorial is append-only; Abelisk is not | decided, Wave 2 |
| H10 | Cut-and-Certify Phases 5–9 | E1 + E2 zero mismatches | Its own Gate A | declared |
| H11 | Public recruitment | OD-1 decided | PLAN-WEB-001 §11.2 | declared |
| H12 | Any campaign | stop rules defined **before** it runs | PLAN-REC-001 §18 | declared |
| H13 | Record citing the Java engine | OD-13 implementation | Provenance would reference unobtainable software | decided |

**H1 is the structurally important one.** It is a *rights* dependency masquerading as
a technical one, and it gates more downstream work than any other single item.

### H1 — explicit exclusion

The prohibition covers **use** of the dataset. It does **not** cover looking at it in
order to find out what it is.

```text
BLOCKED by OD-2        computational use   compiling, verifying rows, symmetry audit
                       experimental use    any search, graph construction, replay
                       publication         claims, releases, benchmarks, campaigns
                       redistribution      copying or uploading it anywhere
                       research use        any D40-derived result

NOT BLOCKED            read-only provenance preservation and tracing (TASK-0001)
                       recording checksum, size, line count, filename
                       structural counts computed without compiling
                       enumerating which files depend on it
                       producing decision-ready findings for OD-2
```

This exclusion exists because the alternative is circular: OD-2 cannot be decided
without provenance evidence, and provenance evidence cannot be gathered if OD-2 blocks
looking. The read-only task is the escape from that loop, and it is explicitly
approved in the OD-2 owner direction (*"a bounded provenance task must exist before any
D40-dependent research campaign"*).

---

## 2. Recommended ordering

Not blocking. Doing these out of order costs rework, not correctness.

| # | Later | Earlier | Why |
|---|---|---|---|
| R1 | Website shell (PLAN-WEB-001 Phase 5) | mathematical core extraction (Phase 3) | The core has no framework dependency; deciding the shell first decides the least urgent thing first |
| R2 | Artifact-denylist CI contents | rights and artifact inventory | The denylist is only as good as the inventory behind it |
| R3 | Full conjecture lifecycle | B16 golden-control pilot | PLAN-CONJ-001 §20: if the known history does not fit the record model, fix the model first |
| R4 | Abelisk 85-cell Master | small journey working | v3 §32: "Do not begin with the 85-cell puzzle" |
| R5 | Broad Discussions promotion | moderation load observed | PLAN-GOV-001 §24 Phase 2 |
| R6 | Toolchain adoption (OD-8) | math-core extraction | decided: defer, reconsider after |
| R7 | Any pedagogy pilot | transfer task designed | decided, Wave 2: the current checkpoints cannot detect transfer |

---

## 3. Conceptual overlap — composition, not duplication

Five promotion ladders exist across the intake. They operate on **different object
types** and compose into one system.

| Ladder | Object | Source |
|---|---|---|
| IDEA → CANDIDATE → TESTED → REPRODUCED → REVIEWED → ACCEPTED → ARCHIVED | a contribution | PLAN-GOV-001 §7 |
| LEAD → OBSERVED → FORMALIZED → CHALLENGE_READY → … → PROOF_AUDITED | a claim | PLAN-CONJ-001 §4.1 |
| telemetry → lead → bounded observation → formal conjecture | an observation | PLAN-REC-001 §16.2 |
| CANDIDATE → VERIFIED_WORD → PROJECT_RECORD → SUPERSEDED_RECORD | a word | PLAN-REC-001 §3.2 |
| IDEA → … → HEURISTIC_ONLY → SOUND_PRUNING_PROVED | a pruning rule | PLAN-CUT-001 §29 |

**Shared invariant:** no object changes status without an explicit promotion event.
This is PLAN-PLATFORM-001 §37's "no silent authority transfer" generalized.

Other genuine overlaps that are not conflicts: browser-computation labelling (all
plans agree); immutable vs living links (PLAN-WEB-001 §8.3, PLAN-REPO-001 §9.3);
contamination tracking (PLAN-REPO-001 §12.4 for AI, PLAN-REC-001 §31 for records,
`AGENTS.md` 13 for seeds).

---

## 4. Direct contradictions

All seven from earlier waves are now resolved. Two further items are recorded because
they are contradictions with *canonical authority*, not between plans.

### 4.1 Between plans — resolved

| # | Topic | Positions | Resolution |
|---|---|---|---|
| C1 | Top-level website structure | PLAN-WEB-001 / PLAN-REPO-001 vs PLAN-PLATFORM-001 §27 | **OD-4: A** |
| C2 | Museum of Mistakes placement | `/learn/museum-of-mistakes/` vs top level | **OD-4: under `/learn/`** |
| C3 | Claim authority | ledger-only vs `research/claims/` registries | **OD-7: ledger sole authority** |
| C4 | Licensing | MIT + cite-please vs 0BSD + CC0 | **OD-3: defer** |
| C5 | Attention allocation | bootstrap 60/30/10 vs charter 30/20/15/10/10/10/5 | **OD-9: 60/30/10 to 2026-09-06** |
| C6 | `NEXT_STEP.md` | authority file vs replaced | **OD-6: keep, add `CURRENT_FOCUS.md`** |
| C7 | `R0–R5` labels | reproducibility vs independence | **OD-12: split into `REP` / `IND`** |
| C8 | Content language | English canonical vs Finnish-first designs | **OD-10: English canonical, Finnish delivery permitted** |
| C9 | Flagship mathematics | solved four-letter vs open ternary | **OD-11: layered** |

### 4.2 Against canonical authority — one resolved, one open

| # | Item | Conflict | Status |
|---|---|---|---|
| C10 | PLAN-REPO-001 Phase 5 ledger translation campaign | `AGENTS.md` rule 8 permits row translation only when the row is touched anyway | **OPEN — OD-5.** Rule 8 governs until amended |
| C11 | PLAN-RECORDS-001 "Veikon sääntö" | `MATH_CLAIMS.md` row 9 forbids presenting FORBID4 as Keränen's set; row 41 records it as a heuristic | **RESOLVED** — prohibited as a canonical name |

---

## 5. Supersession

| Superseded | By | Basis | Effective |
|---|---|---|---|
| PLAN-ABELISK-002 | PLAN-ABELISK-003 | declared in v3 line 14; owner-ratified 2026-08-06 | **yes** |
| PLAN-RECORDS-001's `/todistukset` route | OD-4 route structure | owner decision | yes — route only; content unaffected |
| PLAN-JAVA-001 §34's "revision 1.1" text | OD-13 constraint: use v1.2 | owner decision | yes |

**Not superseded:** PLAN-ABELISK-001 is `HISTORICAL / REFERENCE` by owner
reclassification, **not** by declared supersession. No Wave 1 or Wave 3 document
declares supersession of any other.

`SUPERSEDED` never means deleted. Superseded material stays in
`docs/plans/intake/` unchanged, and its ideas may be reused **only when explicitly
selected by a later approved task**.

---

## 6. Independent workstreams

May proceed in parallel; no cross-blocking.

```text
repository safety and rights      OD-1, OD-2, denylist CI, artifact inventory
mathematical research            CEGIS Route A (current authority), Cut-and-Certify E1/E2
verification and research SW     TASK-GOV, Layer-4 verifier, record registry
Abelisk and pedagogy             v3 first sprint, tutorial MVP 1
AI evaluation                    provenance labels, contamination ledger, incident log
community and open participation .github/, health files, Discussions
```

Two cross-cutting caveats: the **rights** stream gates public exposure of every other
stream, and the **verification** stream produces the Layer-4 checker that the record
and research streams both require.

---

## 7. The dependency picture in one diagram

```text
                    OD-1 (history)          OD-2 (dataset)
                         |                        |
                         | gates                  | gates USE of the dataset:
                         |                        | computational, experimental,
                         |                        | publication, redistribution,
                         v                        v research
                  public recruitment         D40 USE
                  public campaigns           - compilation, audit
                         |                   - 39-state graph
                         |                   - hard/order/defect modes
                         |                   - record replay, seam rigidity
                         |                   - Cut-and-Certify Phase 5
                         |                   - CEGIS/Route C priors
                         |                        |
   ======================+========================+=====================
                         |                        |
   UNBLOCKED TODAY:      |                        |
                         |                        |
   D40 provenance preservation and tracing -------+  read-only; explicitly
      (TASK-0001) produces the evidence OD-2 needs   excluded from the OD-2
                                                     prohibition
                         |                        |
   Cut-and-Certify E1 ---+                        |
      produces a structurally different           |
      detector = Layer-4 candidate ---------------+--> unblocks H4
                                                  |
   B16 golden-control pilot -----> validates PLAN-CONJ-001's record model
   artifact-denylist CI ---------> prevents recurrence under any OD-1 option
   TASK-GOV --------------------> removes the verifyAa2fr ambiguity
   D40 provenance preservation --> the input OD-2 needs to be decidable
```

**Reading of the diagram:** two unresolved rights decisions sit above almost
everything with public exposure, but a meaningful amount of correctness and
verification work sits entirely below them and can start now.

---

## 8. Blocked routes, with the exact blocker

**Not blocked:** read-only provenance preservation and tracing of the D40 dataset
(TASK-0001). See §1's H1 exclusion.

| Route | Blocker | Reversible once unblocked? |
|---|---|---|
| D40 compilation, audit, graph, hard/order/defect modes | OD-2 | yes |
| Record replay through the dictionary; seam rigidity | OD-2 | yes |
| Cut-and-Certify Phase 5 (D40 integration) | OD-2 + Gate A | yes |
| Dictionary-derived CEGIS / Route C priors | OD-2 | yes |
| `scratch/dict_backtracker.js` for certification | verifier defect (verified) | yes, after fix |
| The 2107-letter candidate | artifact not obtained | yes |
| Public recruitment campaign | OD-1 | — |
| Ledger translation campaign | OD-5 / `AGENTS.md` rule 8 | — |
| Citing the physics or hardness papers | `AGENTS.md` rule 1 — none opened | yes, after opening |
| Boundary signatures as hard pruning | requires proof, not evidence | — |
| Records citing the Java engine | OD-13 implementation | yes |
