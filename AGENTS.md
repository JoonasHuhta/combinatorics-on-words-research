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
