# Negative Results and Rejected Hypotheses (Graveyard of Ideas)

This document is an archive of research lines, ideas, and hypotheses that have been tested and **proven wrong or insufficient**.

In mathematics and algorithmics, dead ends are as valuable as successes. Documenting them saves future researchers (and AIs) weeks of wasted work, and keeps the project from going in circles.

**The bar for logging here is deliberately low.** This also includes an idea that *worked* but was not worth it (§9), an idea that worked in the wrong place (§8), and a working method that turned out to be wrong even though its output was correct (§10). A dead end does not mean a mistake — it means measured information about which direction is not worth taking.

---

## Index, newest first

The numbering is permanent (it is referenced elsewhere), so the order of
novelty is here rather than in the document's body. Skim this before
proposing anything.

| Date | # | What collapsed | In one sentence |
|---|---|---|---|
| 2026-07-31 | [§16](#16-keränens-g85-projection-to-three-letters) | $g_{85}$'s 4$\to$3 projection | All 36 surjections collapsed immediately at length K=2; the structure does not condense. |
| 2026-07-31 | [§15](#15-ai-epistemology-and-going-in-circles) | AI epistemology | An AI is an executor of finite tests, not a mathematical oracle; free-form ideas are often just flawed analogies |
| 2026-07-30 | [§14](#14-the-shape-of-the-growth-curve-as-a-predictor-of-approaching-exhaustion) | Growth-curve shape as a predictor of exhaustion | A three-point budget curve was noise across 20 classes, predicted nothing |
| 2026-07-30 | [§13](#13-partial-corroboration-as-full-confirmation) | Partial corroboration as full | Four matching fields out of five felt like confirmation; the unchecked DOI did not exist |
| 2026-07-30 | [§12](#12-up-and-down--transferring-an-ordering-heuristic-to-the-aa2f-search) | Transferring the Up-and-Down ordering to aa2f search | Works dramatically in its own setting, loses in aa2f — the technique is setting-specific |
| 2026-07-30 | [§11](#11-a-free-search-engine-summary-as-a-source-methodological-dead-end) | A search-engine summary as a source | The summary gave a literal claim with an author's name and figures; neither was in the original |
| 2026-07-30 | [§10](#10-a-pure-definition-level-verifier-as-an-independent-checker-methodological-dead-end) | A definition-level verifier as an independent checker | Worked flawlessly but did not reach its own target |
| 2026-07-30 | [§9](#9-net-gain-from-a-pruning-table-in-a-single-run) | Net gain from a pruning table in a single run | 1.00× — the value is exclusively in reuse |
| 2026-07-30 | [§8](#8-extendability-table-as-a-record-hunt-accelerator) | Table as a record-hunt accelerator | Same longest word, pruned and unpruned |
| 2026-07-30 | [§7](#7-container-relaxation-as-an-elimination-tool-for-additive-squares) | Container as an additive elimination tool | Did not die at reachable window sizes |
| earlier | §6 | "Rosetta filter" | Would reject 88% of legal continuations |
| earlier | §5 | FORBID4 as a universal rule | Occurs 2,820 times in the record word |
| earlier | §4 | Parikh imbalance as small | Measured the opposite |
| earlier | §3 | Reverse-engineering the record word | There is no structure to extract |
| earlier | §2 | Rauzy SCC as proof of infiniteness | Local condition, global problem |
| earlier | §1 | Morphism scanning k = 7…9 | A logarithm of sample size |

---

## 1. Scanning Uniform Morphisms ($k=7..9$)
**Hypothesis:** If we test ever-larger uniform morphism lengths ($k=7, 8, 9...$), we will eventually find a fixed point that avoids abelian squares of half-length $K \ge 2$.
**Why it was shot down:**
- A regression analysis was run on the survival-length maxima for $k=2..6$. The result showed an almost perfect fit ($R^2 = 0.998$) to the formula $max \approx 2.29 \cdot \ln N$, where $N$ is the number of morphisms tested.
- **Conclusion:** the growth of the maximum length is not a structural signal that the problem is being solved, but purely a **sample-size artifact** (the tail of a statistical distribution). Searching at larger $k$ without a new structural idea is a waste of computational resources.

## 2. The Rauzy Graph's Strongly Connected Component (SCC) as Proof
**Hypothesis:** If we find a Strongly Connected Component (SCC) in the Rauzy graph of a constraint language (e.g. abelian square-free) at window $n$, we have proven that the language is infinite.
**Why it was shot down:**
- Avoiding abelian squares requires global control of Parikh balance, which cannot be packed into a finite memory window. A Rauzy graph of length $n$ only guarantees that no squares arise **up to length $n$**. That is a local, not a global, property.
- **Conclusion:** the Rauzy graph and its SCC are excellent *heuristic pre-filters*, but they have no absolute proof value (Level 2). Proving infiniteness requires finding the generating rule of the language (a morphism) and feeding it into an exact verification engine (e.g. `decide-realizability.js`).

## 3. Reverse-Engineering the "Record Word" (Morphism Mining)
**Hypothesis:** The 25,379-character word found by Keränen and Gavrilenko is so long that there must be an algebraic rule behind it (e.g. a block substitution or morphism). With desktop computing power we can extract (reverse-engineer) that rule from the word.
**Why it was shot down:**
- The word's factor complexity $p(n)$ was measured. A morphic word's complexity must grow linearly ($p(n) \le C \cdot n$). Keränen's 25k word has $p(15) = 14,502$, i.e. it grows exponentially, following the growth of the whole $aa2f$ language.
- **Conclusion:** the word is a pure product of an optimized depth-first search (DFS / random walk). It has massive topological entropy. There is no rule ("DNA") to reverse-engineer, because none exists.

## 4. Morphisms' Parikh Imbalance is Small
**Hypothesis:** A word produced by an algebraic rule (morphism) is so synchronized that its Parikh imbalance (the difference between the most and least frequent letter) stays tightly bounded, e.g. $< 10$.
**Why it was shot down:**
- Empirical measurement showed exactly the opposite. The genuine morphic word ($g_3(h_6^\omega(a))$) produced a Parikh imbalance of **2,298** at length 25,379. Keränen's DFS-search word had a corresponding imbalance of only **322**.
- **Conclusion:** when a morphism's transition matrix has an eigenvalue $|\lambda| > 1$ (as in $h_6$'s case, $|\lambda_2| = \sqrt{3}$), the imbalance grows theoretically without bound, at rate $\sqrt{N}$. In this respect the morphism is "more imbalanced" than a well-pruned DFS walk.

## 5. FORBID4 Factors Are Universally Lethal
**Hypothesis:** The six "dead-end factors" found by the project's DFS search (`baac`, `caab`, `abbc`, `cbba`, `accb`, `bcca`) inevitably lead to death, and should be hard-coded as a rule excluded from all searches.
**Why it was shot down:**
- Analyzing the 25,379-character survivor word showed that each of these six FORBID4 factors occurs in the word hundreds of times (e.g. `accb` 501 times).
- **Conclusion:** FORBID4 is lethal only in a narrow, specific search space. If we banned them globally from future AI searches or optimizers, we would make finding the 25,000-character word *mathematically impossible*.

## 6. Data-Driven Smart DFS ("Rosetta Filter")
**Hypothesis:** Since the 25k word survived, we can extract from it all the used $N$-length sub-words as an "allowed dictionary", and filter all future depth-first searches (DFS) through it.
**Why it was shot down:**
- The 25,379-character word uses a total of 14,502 unique factors at length 15. The number of legal 15-length factors in the whole $aa2f$ language is 120,084.
- **Conclusion:** the filter would throw away 88% of fully legal continuation paths just because Keränen's search *happened* not to hit them. This would lead to overfitting and would more likely act as a ceiling than a springboard. A pure empirical record hunt is worth avoiding in any case, since our goal is an exact, infinite proof (Level 2).

---

*Items 7–10 logged 2026-07-30 (the `sanalab` development session). All four are measured, not guessed; the figures are in the claims ledger rows 51–55.*

## 7. Container Relaxation as an Elimination Tool for Additive Squares
**Hypothesis:** The same de Bruijn container machinery that produced the frequency bounds and SCC structure on the abelian side (rows 51–52) works on the additive side as **elimination**: growing the window K ∈ [2,kmax], the container eventually dies, and a dead container would prove that an alphabet cannot avoid additive squares.
**Why it was shot down:**
- The container's cost grows as |A|^(2·kmax−1). With four letters, kmax = 7 already gives tens of millions of raw states, and at reachable kmax values the container **did not die** for a single four-letter alphabet.
- Meanwhile, an exhaustive DFS on the **actual** language finished in seconds for several alphabet classes (row 54).
- **Conclusion:** elimination is a search question, not a container question. The container remains the right tool for what it is good at — necessary conditions and structure — but the relaxation is too loose to die where the actual language dies. More generally: **a relaxation's death is strong evidence, but a relaxation cannot be tightened arbitrarily without an exponential cost.** The change of direction is logged in `SANALAB_PLAN.md` 3b.

## 8. Extendability Table as a Record-Hunt Accelerator
**Hypothesis:** Since the extendability-depth table is a sound pruning oracle and reduces search nodes 84–89× in elimination (row 55), it should also help with the **record hunt** — i.e. finding longer words at the same budget for unresolved alphabet classes.
**Why it was shot down:**
- Measured on classes {0,1,2,5} and {0,1,3,5}, at budgets 2·10⁶ and 10⁷: pruned and unpruned search gave **exactly the same longest word** (78/81 and 76/83), even though thousands of prunings occurred.
- The reason is structural: branch-and-bound only prunes branches that **cannot beat the current best**. When the language does not end, the best keeps growing, and pruning never hits the record path.
- The table's informativeness and cost grow together: h = 7 → 0.7% of entries got a finite bound (62M nodes), h = 8 → 6.0% (162M), h = 10 → 96.3% (1.2 billion). **Every case costs more than the entire search budget.**
- **Conclusion:** the oracle is an **elimination tool, not a record tool**. Pruning that relies on "this branch cannot be better" is useless when something better keeps turning up. The record hunt needs a different kind of aid (e.g. search order), and that is a heuristic, not an invariant.

## 9. Net Gain from a Pruning Table in a Single Run
**Hypothesis:** A sound pruning oracle that reduces search nodes by nearly a hundredfold speeds up the run correspondingly.
**Why it was shot down:**
- Building the table requires, in practice, the same tree traversal as the search itself: {0,1,2,3} search nodes 751,156 vs. the table's 725,960; {0,1,3,4} 2,638,908 vs. 2,611,320. The total cost is **1.00×**.
- **Conclusion:** the benefit is **exclusively in reuse** — for the same alphabet again, at a deeper cap, or for another representative of the affine class (the transfer costs 0 search nodes). This is `SANALAB_PLAN.md` 5d's residual principle, and also its warning: **the value of a residual must always be measured over reuse, not within a single run.** A speedup figure without the construction cost is a misleading way to report.

## 10. A Pure Definition-Level Verifier as an Independent Checker (methodological dead end)
**Hypothesis:** To maximize independence, the verification prompt given to another model is best constrained as tightly as possible — banning graphs, automata, and dynamic programming guarantees a structurally different implementation.
**Why it was shot down:**
- The ban forced exhaustive generation, whose cost is |A|^N. With four letters that covers roughly N ≤ 10, while the results to be verified are at lengths 50–62.
- **So the verifier could never check the very result the computation was done for** — even though it worked flawlessly and matched on every value tested.
- **Conclusion:** the right axis of independence is not "dumb vs. smart" but **a different algorithmic idea in the same performance class**. The corrected specification (a level-by-level breadth-first search that checks every extension completely from scratch) is in `SANALAB_PLAN.md` 6b.1, and it is in use in `additive-sweep.js`. General lesson: **two implementations only cover what the slower one reaches**, so verification needs a third layer — property invariants that hold at full length (6b.2).

## 11. A Free Search-Engine Summary as a Source (methodological dead end)
*Logged 2026-07-30.*

**Hypothesis:** a search engine's generated summary is good enough as a *lead*, which can be marked untraced and traced later. The risk is managed, because the mark prevents its use.

**Why it was shot down:**
- The summary gave a literal, plausible claim with an author's name and figures: *"Freedman has shown that the longest word over {a,b,c,d} with the condition a+d = b+c that avoids additive squares has length ≤ 60."* It matched the project's own row 54's balanced classes and the value 60 perfectly — so perfectly that it felt like confirmation.
- Thorough tracing on 2026-07-30: **the name "Freedman" does not appear in Fici & Puzynina's survey at all** (the full text was extracted from the PDF and searched), and the number 60 is not in §8.4. No origin was found anywhere.
- **The damage had already been done before the tracing.** The claim steered two sessions' priorities: it was marked on the critical path in two documents, and row 54 was written with the caveat "this may be a replication" — a caveat with no basis whatsoever.
- **Conclusion:** marking something untraced prevents *citing* it but does not prevent the claim from **steering the work order**, and that is the costly effect. Rule: a search-engine summary is not a lead but **noise, until it has been located in some openable document**. It may be logged as a *question* ("does such a result exist?"), never as the *form of a claim* with an author's name and figures. The same applies to any language-model-generated summary of a source it has not opened — including this agent.
- **What the tracing produced anyway:** a stronger delimitation than the sought claim would have (row 58). That does not undo the lesson; a lucky side effect does not make the method right.

## 12. "Up and Down" — Transferring an Ordering Heuristic to the aa2f Search
*Logged 2026-07-30. See `MATH_CLAIMS.md` row 60.*

**Hypothesis:** the alternating priority ordering reported in Lietard's thesis, which dramatically increased the length of an additively cube-free word over {0,1,2,3}, transfers to the project's aa2f record search. The reasoning seemed strong: both are deep languages, and `NEGATIVE_RESULTS.md` §8 had already ruled out pruning but left the **ordering** open.

**Why it was shot down:**
- A controlled measurement in the technique's **own** setting confirmed that it works: on additive cubes {0,1,2,3} with budget 10⁶, fixed order reached 24,396 and alternating reached the length cap of 300,000. So the technique is not bad.
- In aa2f it **lost clearly**: at budget 2·10⁷, fixed order 2,034, alternating 619 and 1,764. An ordering favoring the rarest letter also lost (1,111).
- **Conclusion:** the technique is setting-specific, not general. Candidate explanation (hypothesis): alternation counters *drift*, and aa2f's failure mode is apparently not drift. This is independently supported by row 42 — Parikh imbalance does not discriminate in aa2f, so balancing it cannot steer the search.
- **The methodological lesson, which matters more here than the result:** my first measurement was done in the wrong setting (additive squares) and would, on its own, have led to concluding that *the technique does not work*. A controlled test in its own setting refuted that. **A technique borrowed from the literature must be tested first where it comes from** — otherwise you are measuring the transfer, not the method, and rejecting a working idea for the wrong reason.

## 13. Partial Corroboration as Full Confirmation
*Logged 2026-07-30. See `MATH_CLAIMS.md` row 23.*

**Hypothesis:** when a retracted source reference is found in an independent bibliography and **the volume, number, pages, and year match**, the reference is corroborated and the retraction can be reversed.

**Why it was shot down:**
- This is exactly what was done for row 23 earlier the same day: Fici & Puzynina's bibliography gave four matching fields, and the row was raised from `REJECTED` → `INDIRECT`.
- **The DOI was not checked.** A few hours later the DOI registry revealed that the identifier in the ledger, `10.1137/16M1087493`, **does not exist at all** (Crossref 404), and the correct one is `10.1137/17M1149377`.
- Four correct fields out of five felt like confirmation. It was precisely the field left unchecked that was wrong.
- **An embarrassing detail that must be recorded:** the wrong identifier disappeared from the ledger only when the cell was rewritten — **by accident, not as the result of a check**. The row did not improve through diligence but through luck.
- **Conclusion:** **corroboration covers only the fields actually compared, not the record as a whole.** When a reference is restored from retraction, each field must be checked separately and the checked fields named. Persistent identifiers (DOI, arXiv ID) must be checked against the registry, because they are exactly the fields a human or a model cannot assess by eye — a wrong year is noticed, a wrong DOI is not.

## 14. The Shape of the Growth Curve as a Predictor of Approaching Exhaustion
*Logged 2026-07-30. See `additive-morphism-scan.js`, `OPEN_RESEARCH_QUESTIONS.md` B10.*

**Hypothesis:** as the budget is increased (10⁶ → 10⁷ → 10⁸), the shape of the growth of the longest word found (leveling off vs. accelerating vs. steady) would predict which of the unresolved unbalanced alphabet classes is closest to exhaustion, and would guide where to deepen the search first.

**Why it was shot down:**
- Run for all 20 open classes at three budget levels, and the growth shape was classified by the two consecutive differences. The result was noisy: classes fell into "leveling off", "accelerating", and "steady growth" groups with no detectable relationship to other properties (e.g. the size of the imbalance).
- A three-point growth curve is too short to separate genuine structure from sampling noise — the same basic problem as the sample-size artifact of row 37, now measured on a different variable.
- **Conclusion:** the diagnostic was not used for prioritization. Instead, the project moved directly to a method that can actually settle infiniteness in either direction — a morphism search (`additive-morphism-scan.js`) — because no shape of a DFS growth curve can ever prove an infinite language (§2's lesson generalized to a new context).

## 15. AI Epistemology and Going in Circles
*Logged 2026-07-31. A consolidating methodological observation.*

**Hypothesis (earlier working method):** an AI agent can genuinely generate new theoretical breakthroughs (such as MCTS, applying Roth's theorem, HD0L projection, holography) when asked for "genuinely new ideas we have not thought of". Such proposals are worth treating as possible solution paths to Mäkelä's conjecture.

**Why it was shot down:**
- An AI's training data is based on linguistic and semantic associations, not mathematical invariants. When an AI is asked for a new idea without constraints, it produces **flawed analogies**:
  - Example 1: "Apply Roth's density theorem to prefix sums" $\to$ Roth's theorem concerns *sets* without repetition, a prefix sum is a *sequence*.
  - Example 2: "Use MCTS navigation" $\to$ this only measures the efficiency of the search program, and can never prove infiniteness. It still only produces a finite word (see §2, §3, §14).
  - Example 3: "Project additive squares with an HD0L morphism" $\to$ the additive condition is a scalar (a sum), while the abelian condition (where the projection worked) is a 6D vector. The degrees of freedom do not transfer.
- **The AI goes in circles**, because it names the same underlying mistake (e.g. finite search) with ever-new terms (Toeplitz mining, MCTS, blind DFS) without understanding that the mathematical kill condition is the same for all of them.

**Conclusion and the correct way to use it (mechanism):**
- An AI **must NOT** be used as a mathematical oracle from which open directions are requested.
- An AI is a **relentless executor of finite tests**.
- Idea-evaluation mechanism: an idea must be an **invariant formulation** that can be turned into a **finite computation**.
- Every new idea must have an explicit **kill condition** stated right at the start. If an idea cannot be coded and disproven (killed) within 5 minutes of coding and computing time, it is not a valid research idea for this project. For example, CEGIS morphism synthesis (ORQ section E8) or Keränen's $g_{85}$'s three-letter projection (E7) are correctly formulated AI tasks, because they are clearly bounded and finitely executable.

## 16. Keränen's g85 Projection to Three Letters
*Logged 2026-07-31. See `OPEN_RESEARCH_QUESTIONS.md` E7, `scratch/g85_projection_test.js`*

**Hypothesis:** Keränen's $g_{85}$'s fixed point is completely abelian-square-free over a 4-letter alphabet. Since Mäkelä's conjecture over a 3-letter alphabet *allows* trivial squares (i.e. abelian squares of period K=1), it might be possible that by projecting $g_{85}$ to three letters (merging two letters), the resulting abelian squares would only be those allowed K=1 squares, and K $\ge$ 2 squares would be avoided.

**Why it was shot down:**
- All 36 possible surjections from the 4-letter alphabet to the 3-letter one were generated and tested up to $g_{85}$'s second iteration (length 7225).
- **The kill condition was met immediately:** none of the 36 surjections survived. Every projection produced an abelian square of period **K = 2** immediately at the start of the word (positions 0, 1, 2, 4, 9, or 27 depending on the surjection).
- **Conclusion:** $g_{85}$'s abelian-square-freeness fundamentally relies on its ability to exploit all four degrees of freedom jointly. The structure cannot be "compressed" into three dimensions in a way that preserves balance even in short (K=2) windows. The attempt to find a 3-letter solution by shrinking the 4-letter solution is a proven dead end.

## 17. A Clean-Slate Search for a 10-Character Uniform Coding (g') for h6's Image Collapses into a Dead End
*Logged 2026-07-31. See `scratch/cegis_g_synth.js`*

**Idea:** build a CEGIS-based, character-by-character DFS search looking for a pure $g': \Sigma_6 \to \Sigma_3^{10}$ coding that would avoid abelian squares (even at periods $K \in [2,5]$, where the original $g_3$ fails). This would have been a pure solution to the original Rao & Rosenfeld $h_6$ base.
**Implementation:** `cegis_g_synth.js` was run first with `MAX_K=7` and then with the looser condition `MAX_K=5`, pruning prefixes on the fly, letter by letter, in first-occurrence order.
**Result (kill condition met):** bounded exhaustion. The search went through 500 million branches and reached a construction depth of 59/60 (i.e. it attempted to place the last letter, $f$), but kept backtracking entire letters ($f$ and $d$), never finding a single complete 60-character assignment that survived.
**Conclusion:** the space $3^{60}$ is, under these conditions (avoiding even $K \in [2,5]$), extremely hostile. It is possible that *no* 10-uniform coding can avoid small squares in $h_6$'s structure without other compromises. The original $g_3$'s success (0 squares for $K \ge 6$) is an exceptional property not found by systematic "clean-slate" search. The search should be constrained to strongly coupled local mutations, or non-uniform codings should be allowed.
