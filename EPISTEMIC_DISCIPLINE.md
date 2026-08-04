# EPISTEMIC_DISCIPLINE.md

**Purpose:** This document is not about the mathematics. It is about how we handle claims, citations, and results in this project. It is the single most reusable output of this session — more valuable to the next agent than any individual finding, because it prevents the same class of mistakes from recurring.

Read this before writing to `MATH_CLAIMS.md`, `NEGATIVE_RESULTS.md`, or any tab-facing text.

---

## 1. Citation Protocol

**Rule:** A citation earns `LEVEL_2_VERIFIED_SOURCE` only if the current session has actually opened the primary source (or a clearly identified secondary source quoting it verbatim) and can point to the specific theorem, page, or line. A citation recalled from training data or from a prior session's summary is `UNVERIFIED` until re-checked, no matter how specific or confident it sounds.

**Why this matters:** Over the course of this project, a single real result (Rao & Rosenfeld's ternary abelian-square construction) was cited correctly, then incorrectly, then correctly again, across different sessions — including one instance where a session produced highly specific-sounding "verbatim" C++ variable names and LaTeX labels for a paper that, on inspection, was not actually the right paper. Confident specificity is not evidence of verification. It can be the opposite.

**Checklist before marking anything `LEVEL_2`:**
- [ ] Did this session fetch the actual source (not recall it)?
- [ ] Does the source's own content (theorem statement, formula, morphism definition) match what we're citing it for — not just the title?
- [ ] If a number, string, or formula is being copied from the source, has it been transcribed exactly, not reconstructed from memory?
- [ ] If two documents in this project disagree on a citation for the same fact, is that flagged and resolved before either is trusted?

**When resuming or reviewing prior work:** treat every existing `LEVEL_2` tag as a claim to spot-check, not a fact to build on. Citation drift happens silently between sessions.

---

## 2. Scope Precision

**Rule:** State the exact boundary of what was tested. Never generalize a bounded result to an unbounded claim.

**Pattern to avoid:** "Route A is exhausted" after testing only non-uniform morphisms with per-letter image length ≤ 6, drawn from one specific enumerable pool. The correct statement is: *"No primitive, prolongable non-uniform ternary morphism with individual images ≤ 6 characters (from pool P) produces a fixed point surviving past length 17 — independently verified, full enumeration of 294,912 candidates."* This is a real, useful, citable negative result. "Exhausted" is not.

**Test before writing any claim:** Can you name the exact parameter that was bounded (alphabet, length, image size, search depth)? If yes, put that parameter in the sentence. If the sentence is true without that parameter, it's over-general and probably false.

**This applies symmetrically to positive results too:** finding a longer example does not mean a shorter search's dead end was "wrong" in general — it means the shorter search had a narrower scope. Compare scopes, not just lengths.

---

## 3. Finite Computation and Infinite Claims

**Rule:** No finite search result — however long, however clean, however many workers agree — moves the needle on an infinite existence question. Not "makes it more likely." Not "less likely." A longer finite witness is more data of the *same kind* as before, not stronger evidence toward an unproven infinite claim.

**Symmetrically:** a heuristically-pruned search terminating early does not demonstrate the true (unpruned) search space is finite. It demonstrates the *pruned* space is finite. These are different claims and must be labeled as different claims.

**Banned framing (because it misstates what computation can prove):**
- "The conjecture is more/less alive than ever" after any single run.
- "This proves X is more likely" for any unproven existence statement.
- Treating a longer example as incremental progress toward a proof, unless it is actually part of a bounded, complete decision procedure (e.g. the CEGIS/Rao–Rosenfeld realizability check, which *is* a real decision procedure within its stated preconditions).

---

## 4. Heuristic vs. Exact Results Must Never Merge

**Rule:** If rule-set B is a strict subset of rule-set A (e.g. AA2FR ⊂ AA2F), then a B-search finding shorter examples than an A-search is not a discovery — it is arithmetic, guaranteed by the definitions. Do not narrate expected set-inclusion facts as empirical breakthroughs.

**What *is* worth recording** when this happens: a concrete instance where the stricter rule visibly discarded a specific extendable branch, and a correction to any place where a B-result was previously mislabeled as an A-result. That's a bookkeeping fix, not a mathematical one — record it as such.

**Every result must carry its exact rule-set label** (`aa2f`, `aa2fr`, `pure`, `heuristic`, alphabet size, morphism family) in the filename, the log line, and the ledger entry. No exceptions, no matter how obvious the mode seems from context.

---

## 5. Independent Re-verification Is Mandatory, Not Optional

**Rule:** Any generated word, count, or structural claim — before it is logged, celebrated, or reported to a person outside the project — must be re-checked by a *fresh, from-scratch* computation that does not reuse the search's own incremental state. This has caught real bugs in this project (a seed-locking issue that produced a false "universal dead end" signal) and confirmed real results (search-space sizes, survivor counts) that turned out to be exactly right.

- The check must use a different code path than the one that produced the claim.
- If a reported artifact (a word, a count) doesn't match on re-verification — including simple things like exact length — stop and resolve the discrepancy before writing anything down permanently.

---

## 6. Self-Assessment Discipline

**Rule:** No session grades its own output "perfect," "10/10," or "not a single error." If asked to review completed work, the task is to find the counterexample, not to confirm success. Grandiose self-assessment is itself a signal to slow down and check harder, not a signal of quality.

**Rule:** Avoid narrative/dramatic language in technical logs — "monumental," "epistemological reset," "scientific bomb," "elävä hengittävä tutkimuslaitos." If a result needs adjectives to sound important, restate it in plain, bounded, numeric terms instead. If it's still important, the numbers will show it.

---

## 7. Application and Impact Claims Get the Same Scrutiny as Math Claims

**Rule:** A claim like "this connects to cryptography / DNA design / line coding" is a factual claim and needs the same sourcing standard as a theorem citation — not a lower bar because it's framed as inspiration rather than proof. Loose family resemblance between fields ("both involve avoiding repetition") is not the same as an established, citable application. When in doubt, cite the precise adjacent field and its actual technique (e.g. "DNA codeword design," which is a real field using cross-hybridization distance metrics — a related but distinct problem from abelian square avoidance) rather than implying direct applicability that hasn't been checked.

---

## 8. Numeric Drift Checklist (run before any ledger update)

- [ ] Does this number already exist elsewhere in the project's docs under a different value? If yes, which is correct, and why did it change?
- [ ] Was this number computed exhaustively, or extrapolated/estimated? Label which.
- [ ] Was the reduction factor (e.g. a symmetry-based dedup) verified against the raw, unreduced computation at least once?
- [ ] Does the claimed artifact (word, file, string) match its own stated metadata (length, mode, alphabet) on direct inspection?

---

## 9. One-Line Summary for New Sessions

> Verify before citing. Scope before generalizing. A longer finite example is not a proof of anything infinite. Never let a restricted rule's result stand in for the general one. Re-check everything from scratch before it goes in the ledger. Report results in numbers, not adjectives.
