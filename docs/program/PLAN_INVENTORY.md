# Plan Inventory

**Wave:** 4
**Produced:** 2026-08-06
**Instruction source:** `docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md` §8.1
**Machine-readable counterpart:** `docs/program/PLAN_REGISTRY.yaml`

Human-readable inventory of all 15 intake documents. Identity is by SHA-256 and
first-level heading; filenames are treated as opaque. All 15 checksums match
Appendix A of the bootstrap document exactly.

No intake document was renamed, moved, or edited in any wave.

---

## 1. The inventory

| ID | Title | Type | Source status | Program status | Missions | Depends on | Supersession | Owner decisions | Next review |
|---|---|---|---|---|---|---|---|---|---|
| PLAN-WEB-001 | Sustainable Web Architecture, Refactor, Naming, and GitHub Integration Plan | architecture, implementation | implementation roadmap | `PROPOSED` | infra, edu, research, community | — | — | OD-1, OD-4, OD-8 | unscheduled |
| PLAN-REPO-001 | Repository–Website Integration, Audience, Language, and AI Implementation Plan | strategy, architecture, governance | proposed plan | `PROPOSED` | infra, edu, research, ai, community | PLAN-WEB-001 *(declared)* | — | OD-4, OD-5, OD-6, OD-7 | unscheduled |
| PLAN-GOV-001 | Open Participation and Evidence Governance Plan | governance | proposed governance plan | `PROPOSED` | community, research, edu, ai | — | — | OD-9 | unscheduled |
| PLAN-PLATFORM-001 | Open Research, Education, and AI Platform Plan | strategy, governance | strategic plan | `PROPOSED` | research, edu, ai, community, infra | — | — | OD-3, OD-4, OD-7 | unscheduled |
| PLAN-CHARTER-001 | Research Frontier, Community Growth, and Forward-Motion Charter | strategy, research-program | strategic charter | `PROPOSED` | research, edu, community, ai | — | — | OD-9 | unscheduled |
| PLAN-ABELISK-003 | ABELISK v3 — Logic Puzzle, Brand, and Web Implementation Plan | product-spec, pedagogy, implementation | refined product spec | **`ACCEPTED`** | edu, infra | PLAN-EDU-001 *(inferred)* | **supersedes PLAN-ABELISK-002, effective** | — *(OD-10, OD-11 resolved)* | unscheduled |
| PLAN-EDU-001 | Mäkelä's Conjecture Interactive Tutorial — Pedagogical Design Plan | pedagogical-design | design spec | `PROPOSED` | edu, research | PLAN-ABELISK-003 *(inferred)* | — | — *(OD-10 resolved)* | unscheduled |
| PLAN-RECORDS-001 | Spec: Kokeellinen ennätyshaku -osio nettisivulle *(fi)* | product-spec, implementation | spec to implementer | `PROPOSED` | research, edu, infra | — | route superseded by OD-4 | — | unscheduled |
| PLAN-ABELISK-002 | ABELISK v2 — Refined Game, Terminology, and Web Implementation Plan | product-spec, implementation | refined product spec | **`SUPERSEDED`** | edu, infra | — | **superseded by PLAN-ABELISK-003** | — | — |
| PLAN-ABELISK-001 | ABELISK — Game Design, Discovery, and Insight System | pedagogy, product-spec | systems-design spec | **`HISTORICAL` / `REFERENCE`** | edu | — | not superseded by declaration | — | — |
| PLAN-CONJ-001 | Conjecture Research Pipeline *(fi)* | research-program, governance | awaiting adoption | `PROPOSED` | research, community | — | — | — *(OD-12 resolved)* | unscheduled |
| PLAN-REC-001 | Record Hunting and Research Harvest Pipeline | research-program, implementation | ready for implementation | `PROPOSED` | research, infra, community | PLAN-CONJ-001, PLAN-RECORDS-001 *(declared)* | — | **OD-2** | unscheduled |
| PLAN-DICT-001 | Dictionary-Accelerated Backtracking Research and Development Plan | software-audit, research-program | audit + roadmap | `PROPOSED` **BLOCKED** | research, infra | PLAN-REC-001, PLAN-CONJ-001 *(declared)* | — | **OD-2** | unscheduled |
| PLAN-CUT-001 | Cut-and-Certify Research Plan for Abelian-Square Avoidance | research-program | exploratory | `PROPOSED` | research | — | — | — | unscheduled |
| PLAN-JAVA-001 | Java COW Backtracker v1.2 — Complete User and Research Guide | software-guide | audited revision 1.2 | `PROPOSED` → **`REFERENCE`** proposed | research | PLAN-DICT-001 *(inferred)* | — | — *(OD-13 resolved)* | unscheduled |

---

## 2. Status distribution

```text
ACCEPTED                1    PLAN-ABELISK-003
SUPERSEDED              1    PLAN-ABELISK-002
HISTORICAL/REFERENCE    1    PLAN-ABELISK-001
PROPOSED               12    everything else
    of which BLOCKED    1    PLAN-DICT-001 (on OD-2)
```

**Twelve of fifteen plans remain `PROPOSED`.** That is the intended state after
bootstrap. Detail is not approval, and reviewing a plan is not accepting it.

---

## 3. Identity and checksums

| ID | SHA-256 | Lines | Lang |
|---|---|---:|---|
| PLAN-WEB-001 | `92c56d8f30c54c4d29bdc1c01ac1bd0a097a23fedc68b1feab2dd51253f4eeb7` | 2444 | en |
| PLAN-REPO-001 | `616715299c24caf98fb997e7dd5737a5420b0318862dbde076214fde9ce81397` | 2782 | en |
| PLAN-GOV-001 | `b6741ef33f58c31e5c44a39c58869e191271881efa9758bd51a919720791c6d1` | 2181 | en |
| PLAN-PLATFORM-001 | `913372ac82593d8fa121ae9ccbed51709d153bfa520f2d9cf7227c514a1c8912` | 1745 | en |
| PLAN-CHARTER-001 | `7d4283e8a43776afb505e7aea616d590c2df92a87ede711cc26aba371f185efa` | 2158 | en |
| PLAN-ABELISK-003 | `2f4f2464908bbd5890caf496270289eb361dda9c99f368c94e0f2bdf82011214` | 1903 | en |
| PLAN-EDU-001 | `3327ae0afe51efa1bfbcf7f6b5d934d485e4f3a147cb39f9fb15a80396a3bf6a` | 2304 | en |
| PLAN-RECORDS-001 | `41e18d426eaf557555acb3cc598acc0894a63b3817b3028ec734121aad54940d` | 153 | **fi** |
| PLAN-ABELISK-002 | `57be8be237a80361a52597fce29f7254ee9a26ba22bef9517a9eaaf22113a4a2` | 1612 | en |
| PLAN-ABELISK-001 | `8c18bf96ad5fb4fa13c8ea57121beab445bdefe24b5b3d364ce7bccf9699a070` | 2018 | en |
| PLAN-CONJ-001 | `27b57cbc68cdfbf65eb54a72bdfa23fe324c7854e97c6f63aad26048913cde18` | 1384 | **fi** |
| PLAN-REC-001 | `854c47592c966cc02b8f74d3af75bc83fb5733d6c83405961df6592f29ea5492` | 1567 | en |
| PLAN-DICT-001 | `a20707dbbc4755d9453afe5a3e874dbe371ade92a8eb15c2e688f606381de474` | 1642 | en |
| PLAN-CUT-001 | `b46e776f84397bdee900287cfa2e72dcde2178e87f8217c96cf603a98c4e8a22` | 1926 | en |
| PLAN-JAVA-001 | `c240e31f98d428d850b134bcbdd246cec874b7c6674467da585253642974bcce` | 1849 | en |

Two documents are Finnish. Under OD-10 they are **existing** sources, so they are not
bulk-translated during bootstrap; their later migration needs a separately approved
process.

A sixteenth intake file, `java-cow-backtracker-v1.2-checksums.txt` (329 bytes), is a
checksum sidecar, not a plan, and is not inventoried as one.

---

## 4. Known document defects

Recorded, not corrected. No intake document was edited.

| Plan | Defect |
|---|---|
| PLAN-ABELISK-003 | Header names the **v2** filename as its suggested path; §5.4 requires `intended_break_in` metadata that §22's schema omits; §23 has an orphan heading with no body |
| PLAN-REC-001 | §6's schema example presents the **unverified** 2107-letter candidate as `PROJECT_RECORD` / `independently_verified`; §39 task 2 instructs editing an intake document |
| PLAN-JAVA-001 | §34's recommended provenance text names **revision 1.1**, the revision carrying the checkpoint/resume defect fixed in 1.2 |
| PLAN-RECORDS-001 | Uses "Veikon sääntö" for FORBID4 — prohibited as a canonical name |
| PLAN-REPO-001 | §6.1's root-file list omits five files that exist and lists two that do not |
