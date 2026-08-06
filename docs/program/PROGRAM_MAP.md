# Program Map

**Wave:** 4
**Produced:** 2026-08-06
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §7, §8

This map exists to keep ten different kinds of statement from being read as the same
kind. That confusion — a proposal read as a decision, an audit hypothesis read as a
verified fact, a plan read as authority — is the specific failure the bootstrap layer
was built to prevent.

---

## 1. Canonical authority

Authoritative **within its stated domain only**. Apparent contradictions across
domains require interpretation, not automatic precedence.

| Domain | Files |
|---|---|
| Mathematical | `MATH_CLAIMS.md` — the sole authority for every claim |
| Epistemic and contribution policy | `AGENTS.md` (17 rules), `EPISTEMIC_DISCIPLINE.md` |
| Current work | `NEXT_STEP.md`, and `CURRENT_FOCUS.md` for the bootstrap period |
| Legal and citation metadata | `LICENSE` (MIT), `CITATION.cff` |
| Repository safety configuration | `.gitignore` — rules authoritative, comments may be stale |

**Derived views** (generated; the ledger wins): `KNOWLEDGE_STATE.md`, `claims.json`,
`index.html`'s embedded claims block.

**Domain registers** (maintained, constrained by the ledger, authoritative in their own
domain): `NEGATIVE_RESULTS.md`, `LITERATURE_COVERAGE.md`,
`OPEN_RESEARCH_QUESTIONS.md`.

**Routing:** `RESEARCH_CONTEXT.md`, `README.md`, `CONTRIBUTING.md`.

---

## 2. Accepted owner decisions

Ten decided, three open. Full text in `OWNER_DECISIONS_REQUIRED.md`.

| # | Decision | Outcome |
|---|---|---|
| OD-1 | Git-history rewrite | **OPEN** — needs a controlled remediation plan; six prerequisites listed |
| OD-2 | Tracked D40 dataset | **OPEN**, with binding direction: `RIGHTS_AND_PROVENANCE_UNRESOLVED` |
| OD-3 | Relicensing | Defer pending rights and contributor audit |
| OD-4 | Website structure | Home / Learn / Explore / Research / Evidence / Abelisk / Community |
| OD-5 | Ledger translation | **OPEN** — option D drafted; rule 8 governs until amended |
| OD-6 | `NEXT_STEP.md` | Keep; add a short `CURRENT_FOCUS.md` |
| OD-7 | Claim authority | `MATH_CLAIMS.md` sole authority; all registries generated, read-only, CI-verified |
| OD-8 | Build step | Defer; reconsider after math-core extraction |
| OD-9 | Attention allocation | 60/30/10 to 2026-09-06, then WIP limits |
| OD-10 | Content language | English canonical source; Finnish delivery permitted; no bulk translation of existing sources |
| OD-11 | Flagship mathematics | Layered: four-letter foundation, ternary Research Chamber |
| OD-12 | Evidence scales | `REP-0…5` and `IND-0…5`, reported separately, never combined |
| OD-13 | Java engine location | `word-structures/java-cow-backtracker`, release `v1.2`; implementation deferred |

---

## 3. Accepted product direction

**ABELISK v3 is the active product-design authority.** Accepted 2026-08-06.

Binding constraints attached:

```text
four-letter Classic Abelisk and ternary Mäkelä Door must be
    visually and terminologically distinguished

the game must never imply that finishing a puzzle, reaching Master mode,
    or producing a long finite word solves or supports the infinite conjecture

motor accessibility is an active requirement

the 85-cell Master concept remains CONDITIONAL pending g85 verification
```

Accepted cross-cutting standards:

- **Four-layer verifier architecture** — full reference, append-only incremental,
  changed-index, and an independent full verifier on a genuinely separate code path.
  The shared core is built to Abelisk's shape; the tutorial uses a strict subset.
- **Accessibility floor** — large targets, full keyboard, no mandatory precision
  dragging, switch-compatible where practical, alternatives for drag/timed actions,
  reduced motion preserving all information.
- **Pedagogical claims are design hypotheses only**, with four required wording
  labels, and a transfer task mandatory in the first pilot.

---

## 4. Proposed plans

Twelve of fifteen. Reviewed, not accepted. **Detail is not approval.**

PLAN-WEB-001, PLAN-REPO-001, PLAN-GOV-001, PLAN-PLATFORM-001, PLAN-CHARTER-001,
PLAN-EDU-001, PLAN-RECORDS-001, PLAN-CONJ-001, PLAN-REC-001, PLAN-DICT-001 *(blocked)*,
PLAN-CUT-001, PLAN-JAVA-001 *(reclassification to `REFERENCE` proposed)*.

---

## 5. Historical or superseded material

| Item | Status | Rule |
|---|---|---|
| PLAN-ABELISK-002 | `SUPERSEDED` by v3, effective | Preserved unchanged; contained in full within v3 |
| PLAN-ABELISK-001 | `HISTORICAL` / `REFERENCE` | Design archive; ~25 mechanic families deliberately cut by v2 and not restored |
| `docs/historical/` | historical | Outdated plans, partly-corrected citations |
| PLAN-RECORDS-001 `/todistukset` | route superseded | Content unaffected |

**Reuse rule:** ideas from superseded or historical material may be reused **only when
explicitly selected by a later approved task**. Removed mechanics are never restored
automatically. The single exception made so far — motor accessibility — was recorded
explicitly as an *accessibility correction, not a restoration of game scope*.

---

## 6. Verified repository facts

Established by direct inspection during the bootstrap. Each is checkable.

| Fact | How verified |
|---|---|
| Copyrighted PDFs remain retrievable from `main`'s history (`latest/Keranen.pdf` added `aeff280`, deleted `b69f829`, both reachable) | `git log --diff-filter` |
| The 2026-07-31 history rewrite covered four **non-PDF** files only | `.gitignore` comment |
| `datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` is tracked; `.gitignore` covers only `datasets/keranen_*.txt` | `git ls-files`, `.gitignore` |
| That file **is** the D40 source dictionary | PLAN-DICT-001 §5.1, PLAN-JAVA-001 §19.1 |
| `scratch/dict_backtracker.js`'s `verifyAa2fr` does **not** check FORBID4 (zero references in file) | direct code inspection |
| `scratch/backtracker.js`'s `verifyAa2fr` **does** check FORBID4 | direct code inspection |
| Java v1.2 artifacts (zip, jar, `SOURCE_AUDIT_REPORT.md`) are absent from the repo | filesystem search |
| No `.github/`, `docs/adr/`, `CURRENT_FOCUS.md`, `ROADMAP.md` existed at bootstrap | filesystem |
| `CLAUDE.md` carries rules 1–8; `AGENTS.md` carries 17 | file comparison |
| `MATH_CLAIMS.md` highest row number is 110; `RESEARCH_CONTEXT.md` says 85 | file inspection |
| `index.html` contains self-certifying vocabulary (7× `CERTIFIED`, 4× `Provable`, 1× `publication-grade`) | case-sensitive count — **occurrence count, not a violation count** |
| All 15 intake checksums match Appendix A | `sha256sum` |

---

## 7. Unverified audit hypotheses

**Not facts.** Recorded so they are not promoted by repetition.

| Hypothesis | Source | Status |
|---|---|---|
| Rolling-hash corruption at the 40→39 backtrack boundary | PLAN-DICT-001 §2.1 | `NOT_VERIFIED` — needs a constructed trace |
| The dictionary may be symmetry-expanded twice | PLAN-DICT-001 §2.5 | `NOT_VERIFIED` — needs the quarantined dataset |
| The `"Full O(1) Abelian Square Check"` comment exists in project code | PLAN-RECORDS-001 §3a, PLAN-DICT-001 §2.6 | asserted; comment not located |
| Java v1.2 self-test suite contents | PLAN-JAVA-001 §6 | not verifiable — artifacts absent |
| The 85-cell Master derives from `g85` | PLAN-ABELISK-003 §11.4 (conditional) | unverified; must stay conditional |
| `{0,1,2,6}`'s affine class vs ledger row 54 | PLAN-ABELISK-003 §18.2 | unchecked |
| Whether each `index.html` occurrence is a self-certifying badge | Wave 0 | not audited case by case |

---

## 8. Blocked research routes

See `DEPENDENCY_AND_CONFLICT_MAP.md` §8 for the full table with blockers. In summary:
**all D40-dependent work** (OD-2), **public recruitment** (OD-1), **the ledger
translation campaign** (OD-5 / rule 8), **`dict_backtracker.js` for certification**
(verified defect), **the 2107-letter candidate** (artifact not obtained), and
**anything citing the five untraced sources** (`AGENTS.md` rule 1).

---

## 9. Executable next questions

Unblocked, bounded, and falsifiable today.

| # | Question | Why it is ready |
|---|---|---|
| E1 | Does prefix-path arithmetic-progression detection agree exhaustively with Parikh-block detection? | No dictionary, no unopened literature, no long search; produces a structurally different detector = Layer-4 candidate |
| E2 | Does a crossing-only join verifier agree with full verification? | Follows E1; Gate A for the whole Cut-and-Certify line |
| B16 | Does the already-resolved row-99 result fit the conjecture record model without creating a second truth source? | Process test on a settled result; failure is informative |
| CEGIS Route A | *(current-work authority — `NEXT_STEP.md` 2026-08-04)* | Owner-designated research priority; unchanged by this bootstrap |

---

## 10. Implementation tasks requiring separate approval

Nothing in Waves 0–4 authorizes implementation. Each item below needs its own bounded
task specification, even where no owner decision blocks it.

```text
TASK-0001   preserve and trace the D40 dataset provenance        [specified]
TASK-GOV    disambiguate verifier names and contracts            [candidate]
            artifact-denylist CI + strengthened .gitignore
            .github/ issue forms, PR template, health files
            branch protection and required checks
            baseline capture of the current browser page
            CLAUDE.md as a router to AGENTS.md + drift check
            record registry with persistent IDs and checksums
            Layer-4 independent verifier with mutation tests
            Cut-and-Certify E1, then E2
            B16 golden-control pilot
            mathematical core extraction
            Java engine migration and v1.2 release            [OD-13, deferred]
```

Two reminders that apply to all of them: *"does not need an irreversible decision"* is
not the same as *"may be started without authorization"*; and several require GitHub
repository or organisation administration rights that must be settled first.
