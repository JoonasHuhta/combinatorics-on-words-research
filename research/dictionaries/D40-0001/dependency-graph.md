# Dependency graph — D40 source dataset

**Produced by:** TASK-0001
**Produced:** 2026-08-06
**Task status:** TASK-0001 executed; not yet committed; pending owner review for
commit.
**Method:** repository-wide text search for the exact filename and its pattern,
excluding `.git` and `node_modules`; read-only.
**Rights status of the dataset this graph describes:**
`RIGHTS_AND_PROVENANCE_UNRESOLVED` (OD-2) — unaffected by this document.

Every consumer found is listed with file and line. No consumer was executed.

---

## 1. Direct consumers (name the exact filename)

| Consumer | File : Line | Nature |
|---|---|---|
| Documentation | `datasets/README.md:5` | Describes the file, its origin, and its scientific status |
| JavaScript prototype | `scratch/dict_backtracker.js:14` | `const DICT_FILE = 'datasets/aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt';` — hardcoded path |
| Intake plan (proposal, unimplemented) | `docs/plans/intake/DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md` §5.1 | Names the file as the manifest's `source_file` field in its proposed dictionary provenance schema |
| Intake plan (proposal, unimplemented) | `docs/plans/intake/JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md` §19.1, §31 | Invokes `compile-dict --input datasets\aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt` as example usage for an external, currently absent artifact |

---

## 2. Checked and found NOT to be a direct consumer

| Candidate | File | Finding |
|---|---|---|
| `src/word-anatomy.js` | line 31, 33, 215 | References `datasets/` generically for **record words** (e.g. `keranen_25379.txt`) via a `resolveDataFile()` helper. Does **not** name this dictionary file. Recorded here to show it was checked, not assumed. |

---

## 3. Consumer status, cross-referenced against Wave 3 findings

| Consumer | Status |
|---|---|
| `scratch/dict_backtracker.js` | Its `verifyAa2fr` function was found in Wave 3 to omit FORBID4 checking, and it was accepted by the owner that this file **must not be treated as an AA2FR verifier** in its current form. It reads this dataset directly but has not been run by this task. |
| `docs/plans/intake/DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md` | `PROPOSED`, and explicitly `BLOCKED` in the plan registry on OD-2. No code from this plan has been implemented. |
| `docs/plans/intake/JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md` | Documents an audited reference implementation whose artifacts are **not present in this repository** (see `docs/program/OWNER_DECISIONS_REQUIRED.md` OD-13). The `compile-dict` invocation it describes cannot currently be run from this repository at all. |

---

## 4. What this graph does not establish

This is a **textual name-match search**, not a call graph or a runtime trace. It does
not establish:

- whether any of these consumers has ever actually been executed against this file;
- whether the file is referenced indirectly (e.g. via a generic glob over `datasets/`
  with no filename literal);
- whether any external tooling outside this repository consumes it.

No such indirect consumer was found by the generic `datasets/` search in
`src/` and `scripts/` performed for this task (see §2 — only `word-anatomy.js`
matched, and it was ruled out as unrelated).
