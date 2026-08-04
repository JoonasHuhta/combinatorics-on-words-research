# AGENT WORKFLOW & MATHEMATICAL CLAIMS PROTOCOL
*(This document is mandatory reading and must be followed by every AI agent and developer working in this repository.)*

## Mathematical claims protocol (mandatory for every session)

1. **CITE BEFORE YOU CODE:** if you are about to write an author/year/journal/theorem-number citation into any file (code, MD, UI text), you must first fetch and open that source (DOI/arXiv identifier) and quote briefly (max ~15 words) the exact passage the claim comes from. "I recall someone saying..." or a second-hand paraphrase (e.g. another website's description of the paper) is NOT sufficient as a primary source — it is a secondary source and must be labelled as such.

2. **TWO LEVELS, NEVER ONE:** every morphism/constant/claim in `MATH_CLAIMS.md` gets exactly one of the following statuses, never implicitly either:
   - `LEVEL_1_INTERNAL_CHECKSUM`: proves only that the data has not changed between commits. Does NOT prove external correctness.
   - `LEVEL_2_VERIFIED_SOURCE`: someone has opened the primary source and compared it character by character / sentence by sentence. Requires a URL/DOI + date + a short quote stored next to the claim.
   The default for new data is ALWAYS Level 1, never Level 2, unless verification has just happened and is documented.

3. **LANGUAGE CALIBRATION for finite checks:** use phrasing like "no violations found in [a,b]" or "in an N-symbol prefix" — never "confirmed", "proven", "certified" without an exact, bounded window stated right next to it.

4. **PROVENANCE IS RECORDED IMMEDIATELY, NOT AFTERWARDS:** when you generate, extract, or derive a string/constant from any source (another paper, a website, your own search or mining), write in the SAME commit message exactly where it came from and how confident you are. "I am not sure where this came from" is an acceptable and desirable sentence in a commit message when it is true — better than a fabricated precision that later has to be unpicked forensically.

5. **HUMAN APPROVAL BEFORE COMMIT/PUSH** whenever a change touches `MATH_CLAIMS.md`, `morphisms.js`'s canonical data, or any UI text presenting a scientific claim or badge status. Routine bug fixes (e.g. data-type overflow fixes) that do not depend on an external source may be committed independently.

6. **PERIODIC RE-VERIFICATION:** as Level 1 claims accumulate, do not let them sit forever as an "empirical" default that nobody ever tries to raise to Level 2. Add a "last attempted to trace: [date]" column to the claims ledger so it is visible which claims have gone stale without anyone even trying.

7. **THE LEDGER HAS EXCLUSIVE RIGHTS (NO UNCLAIMED FINDINGS IN PROSE):** no mathematical or empirical "finding", "proven" claim, or absolute conclusion may appear in any documentation (even in brainstorming, vision, or planning papers) without a matching entry and status in `MATH_CLAIMS.md`. If a claim is not registered in the ledger, it is only a proposal or a preliminary hypothesis, and the text must be written strictly accordingly (e.g. *"the scanner found no candidate in this bounded search space"*, never *"the scanner proved"*).

8. **RECORDING LANGUAGE IS ENGLISH:** all new documentation, code comments, commit messages, module output, and ledger rows are written in **English**. The reason is research-driven, not stylistic: the field's literature, citations, and any prospective collaborators are English-speaking, and a claim an outsider cannot read is not verifiable. **Discussion with the maintainer is conducted in Finnish** — this rule governs the recorded trail, not the interaction. **Migration:** documents previously written in Finnish are translated as they get touched anyway, for other reasons. `MATH_CLAIMS.md` is translated **one row at a time, only when that row is touched anyway — never as a mass translation.** Calibrated language ("no violations in [a,b]") is exactly what a mass translation loses, and that calibration is the ledger's entire value. Citations always remain in their original language.

9. **NO RAW LOG, NO PROOF:** a summary of what a command or script did is not evidence that it did it. When reporting a computation's result — in a ledger row, a commit message, or to the maintainer — the raw output (or a representative excerpt of it) must actually have been read, not paraphrased from memory of what the code was supposed to print. This rule exists because of a concrete failure: `MATH_CLAIMS.md` row 105 (2026-08-02) described a Hankel-rank computation on two specific sequences that its own cited script never performed — the script ran, produced output, and the row was written from what the script was *supposed* to do rather than what its output actually showed. It was caught only when someone opened the script itself, not the summary of it.

10. **INTERFACE CONTRACT BEFORE CODE:** before editing any file that already has readers depending on its current shape (a UI, a public API, another module's `require()`), state up front what the change does *not* alter — e.g. "this does not change the slide count, the color variables, or any function signature `enumerateSAbelian` callers rely on." This is a scope fence, not a formality: it is the difference between a targeted fix and an incidental rewrite that quietly changes behavior nobody asked to change.

11. **FINAL REPORTS ARE TABLES, NOT ESSAYS:** a session or task's closing summary is reported as rows of `Claim | Source | Reproduced? | Matches?` (or the equivalent for the task at hand), not narrative prose. A table cannot smuggle in an unearned "we did it" — every cell has to be either true or empty. Free-text summaries are where overclaiming has repeatedly crept in; a table structurally forbids the sentence that isn't backed by a specific, checkable cell.

12. **THE LINTER IS MANDATORY, NOT A REMINDER:** `node scripts/check-claims-drift.js` (and `node tests/test.js` when `MATH_CLAIMS.md`, `src/`, `scripts/`, or `tests/` change) run automatically as a pre-commit hook (`scripts/git-hooks/pre-commit`, installed once per clone via `node scripts/install-git-hooks.js` — see `CONTRIBUTING.md`). A rule stated in prose can be forgotten under context pressure; this cannot silently be skipped without `git commit --no-verify`, which is itself a decision that must be explained if taken.

13. **SEED HYGIENE FOR PURE RUNS:** Never seed a `--pure` run with the exact output word of a heuristic run. Use either a short/neutral seed (e.g. "a") or another long seed that was itself discovered entirely in `--pure` mode from a neutral seed. This prevents locking the algorithm into paths arbitrarily restricted by past heuristics.

14. **EXPLICIT MODE LABELING:** Every output filename and log entry must explicitly state the rule used (e.g., `_pure` vs `_heuristic` / `_aa2fr`). Pure (AA2F) and restricted (AA2FR) results must never be mixed or ambiguously labeled.

15. **EXHAUSTION REPORTING MUST STATE BOUNDS:** Every "exhausted search space" report must explicitly state whether the search was permitted to backtrack below the initial seed (`minLength=0`) or if the seed was locked (`minLength=seed.length`). A search exhaustion with a locked long seed is a local dead end, not a global one.

16. **A LONGER FINITE WORD IS NOT PROOF OF AN INFINITE ONE:** Finding a longer valid finite sequence does not make the existence of an infinite sequence "more likely". It is strictly just a longer finite example. Do not use hyperbolic framing (e.g., "the conjecture is stronger than ever") when referring to finite records.

17. **INDEPENDENT POST-CHECK IS MANDATORY:** Every claimed record must be validated by an independent checker (e.g. `verifyAa2fr`) that verifies the word post-generation. Never skip this check assuming the generation code is flawless.
