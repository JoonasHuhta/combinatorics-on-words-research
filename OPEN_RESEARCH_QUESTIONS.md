# Open Research Questions

**Updated:** 2026-07-29
**Purpose:** to separate (A) the field's genuine open problems with sources, (B) the project's own questions that are actually computable, and (C) questions that *sound* like research but measure the implementation rather than the mathematics.

This document follows `AGENTS.md`'s rule 7: no "finding" appears here without a corresponding row in `MATH_CLAIMS.md`. Questions may appear here — answers may not.

---

## A. Open problems from the literature

These are sourced and open. Quotes read from the ar5iv rendering on 2026-07-28.

### A1. Mäkelä's conjecture — the project's main goal

> *"There exists an infinite ternary word whose only abelian squares are 00, 11, 22."*
> — Fici & Puzynina (2023), arXiv:2207.09937, **Conjecture 20**

Equivalently (Rao & Rosenfeld, arXiv:1511.05875, **Problem 1**): *"Can you avoid abelian squares of the form uv where |u| ≥ 2 over three letters?"*

**Status:** open for half-lengths K = 2…5. K > 5 is solved affirmatively (`MATH_CLAIMS.md` row 7).

**Why exactly 2…5 is open — a sourced structural reason.** Rao & Rosenfeld's decision procedure (§3) decides avoidance of abelian powers **for pure morphic words at all periods**. For morphic **images** g(h^ω) it decides only **large** periods (Proposition 9). In this construction the ternary word is obtained only as a projection of the 6-letter one, and the projection loses decidability at small periods. See `MATH_CLAIMS.md` row 7b.

**What this means for the attack direction:** the route is not "search for longer words". The longest known aa2f words are 25,379 characters, and any finite word is a finite observation. Routes: (a) a ternary morphism whose *fixed point* — not a projection — avoids periods ≥ 2, in which case §3's procedure applies directly; (b) an extension of the decision procedure to small periods for images; or (c) keep h₆^ω(a) fixed and vary the morphism g applied to it — Theorem 4 (row 32) carries the base word, and for each candidate, small periods are factors of bounded length and large periods are Prop 9's territory (`decision-preconditions.js`). Route (c)'s uniform layer L ≤ 5 has been swept exhaustively and is empty (`MATH_CLAIMS.md` row 49, B5 below); what remains are L ≥ 6, non-uniform maps, and CEGIS-guided search (E2).

### A2. Abelian repetition threshold

> *"The authors found lower and upper bounds for abelian repetition thresholds, some of which are conjectured to be tight."*
> — Fici & Puzynina (2023), arXiv:2207.09937

**Status:** partially open. The field exists and is named; it does not need to be reinvented, but it has genuine gaps.

**Note.** The ordinary (non-abelian) **Dejean's conjecture is proven**, not open:

> *"The famous Dejean's conjecture dating back to 1972 stated that RT(3) = 7/4, RT(4) = 7/5, and RT(d) = d/(d−1) for every d > 5. The conjecture has been proved in a series of papers — the last cases have been proved independently by Rampersad and Currie, and Rao."*

Any plan that promises to "find RT(n) values" relies on outdated information. The abelian version is a different matter and is partially open.

### A3. The k-abelian hierarchy — the nearest solved neighbour

> *"One can avoid 3-abelian-squares of period at least 3 in infinite binary words, **2-abelian-squares of period at least 2 in infinite ternary words**, and 2-abelian squares of period more than 63 in infinite binary words."*
> — Fici & Puzynina (2023), **Theorem 65**

The middle item is **exactly A1** with the abelian equivalence replaced by 2-abelian — and it is **solved affirmatively**. This is the only known way to measure *how much* strengthening the equivalence costs. The project has no k-abelian module.

### A4. Unfavourable factors — one-sided extendability

> *"…an unfavourable a-2-free word cannot be continued infinitely long to the left and to the right without necessarily creating an abelian square at some point. **However, it might well be possible to extend such a word boundlessly to one direction, say to the right, without producing any abelian squares. Experiments support this conjecture but the existence of such unfavourable factors remains an open question.**"*
> — V. Keränen, *"Suppression of Unfavourable Factors in Pattern Avoidance"*, International Mathematica Symposium, Avignon, 2006

**Question:** does there exist an a-2-free word that can be extended without bound to the right, yet still never occurs as a proper factor inside any infinite a-2-free word?

**Why this suits the project exceptionally well:** it is a Rauzy-graph question, and the machinery exists (`rauzy-graph.js`). A word is boundlessly extendable to the right exactly when it is on an infinite path in the graph — i.e. when it can reach some cycle. A word is unfavourable if it is not on an infinite path in **both** directions. The difference between these two sets is exactly what Keränen asks, and it is finitely computable for each length.

**Caveat:** Keränen's question concerns four letters (Σ₄) and full a-2-freeness. The project's measurement at row 35 concerns three letters and the aa2f condition, and is not the same thing. See `MATH_CLAIMS.md` row 38 — row 35's dead-end counts are **not** counts of unfavourable factors.

### A5. Untraced: the minimum number of distinct 2-abelian squares in a binary word

A claim has appeared in discussion, *"5 ≤ g(2) ≤ 734"*, as Problem 4.9 of Rosenfeld's thesis. **Neither the number 734 nor the notation g(2) is found in Fici & Puzynina's survey**, and the thesis has not been opened in the project. The claim is **untraced** and must not be used before someone reads the original. If it holds, it is an attractive target: the binary search space is smaller than the ternary one, and the current tools would transfer almost directly.

### A6. Additive squares: is ℤ uniformly 2-repetitive? (traced 2026-07-30)

> *"A long standing question asks whether ℤ is uniformly 2-repetitive [Justin 1972, Pirillo and Varricchio, 1994]"*
> — Rao & Rosenfeld, arXiv:1511.05875, abstract (opened 2026-07-30)

That is: does there exist an infinite sequence over a finite subset of ℤ that avoids two consecutive blocks of equal length and equal sum (additive squares)? **Open**, at least as of the source's date. Known context:

- **Cubes solved:** *"there exists an infinite word over the alphabet {0, 1, 3, 4} containing no three consecutive blocks of the same size and the same sum"* — Cassaigne, Currie, Schaeffer & Shallit, arXiv:1106.5204, abstract (opened 2026-07-30). Same abstract: *"This answers an open problem of Pirillo and Varricchio from 1994."* From the full text (ar5iv, 2026-07-30): the square question was posed by Halbeisen & Hungerbühler (2000): *"They asked (in our terminology) if it is possible to avoid additive squares."*
- **ℤ² solved — and the solution is the project's core source:** arXiv:1511.05875's actual title is *"Avoiding two consecutive blocks of same size and same sum over ℤ²"*, its main result is *"ℤ² is not uniformly 2-repetitive"*, and the abstract connects it directly to the project's main problem: *"this problem is related to a question from Mäkelä in combinatorics on words and we answer to a weak version of it."* **The project's template/ancestor machinery was thus originally built precisely for the additive-square problem** — the additive instance (`SANALAB_PLAN.md`) is not a neighbouring problem but a return to the core source's own parent problem.

**Project status:** an alphabet sweep exists (`additive-sweep.js`) and the first results are at row **54**; follow-up questions are **B9** below.

See `MATH_CLAIMS.md` row 53. Secondary observation without an opened source (MUST NOT be used before tracing): the search output contained a claim attributed to Freedman about 4-letter alphabets a+d=b+c and a length bound ≤ 60, plus a recent 2025 variation paper (arXiv:2506.21200) — the latter suggests the main question was still open as of 2025, but neither has been opened.

### A7. Sources to open, including other languages (tracing queue, 2026-07-30)

The field's literature is **mostly in English**, but not entirely — and right now the critical path's tip is in French. Queue of sources to open, most important first. All identifiers read from Fici & Puzynina's (2023) bibliography on 2026-07-30 (see `MATH_CLAIMS.md` row 58).

| # | Source | Language | Why |
|---|---|---|---|
| 1 | ~~F. Lietard, M. Rosenfeld. *Avoidability of additive cubes over alphabets of four numbers.* DLT 2020~~ **OPENED 2026-07-30** (open preprint `lirmm.fr/~mrosenfeld/LieRos.pdf`; DOI `10.1007/978-3-030-48516-0_15`) | English | **Closed, see row 63.** Concerns cubes; states the square question as open (Question 3); does not contain an alphabet classification for squares. Row 54 is not superseded by it |
| 2 | ~~F. Lietard. *Évitabilité de puissances additives en combinatoire des mots.* PhD thesis, Université de Lorraine, 2020~~ **OPENED 2026-07-30** | **French** | **Closed, see row 65.** Contains no alphabet classification for squares, but traced Brown & Freedman 1987 and gave the form of its claim, which the project's data partly confirms and partly refutes |
| 3 | M. Rao. *On some generalizations of abelian power avoidability.* TCS 601:39–46, 2015 | English | Minimum alphabet size 3 for additive cubes |
| 4 | Rosenfeld's PhD thesis | French (likely) | A5's untraced `g(2)` claim |
| 5 | **T. C. Brown & A. R. Freedman, *"Arithmetic progressions in lacunary sets"*, Rocky Mountain J. Math. **17**(3):587–596, 1987** — reference traced 2026-07-30 | English | **The most critical unopened source.** According to the thesis, they proved the balanced-alphabet case; the project's data confirms the qualitative claim but refutes the cited constant of 50 (row 65). Only the original can tell which form is theirs |

**Answer to the question "should sources in other languages be sought":** yes, but not as a broad survey, rather **targeted, following the citation chain**. This field's French branch is genuine (Dejean's original work, the Lorraine school), and it is found in the bibliographies of English-language papers — not by a separate language sweep. There are Russian- and Finnish-language traces in the project's history (IAS Murmansk 2002, row 3), but they have not been needed since English versions exist.

**Rule:** language is not a reason to leave a source unopened. A quote is kept in its original language, and a translation is marked as a translation.

---

## B. The project's own questions that are actually computable

These are not open problems from the literature. They are finite computational tasks with a unique answer, and the project's machinery suffices for them.

### B1. Is the FORBID4 set minimal?

`{baac, caab, abbc, cbba, accb, bcca}` is not from the literature — it is the project's own (`MATH_CLAIMS.md` row 9). The question **whether some proper subset is equally effective** is finite: 2⁶ = 64 subsets, and factor complexity is computed for each with `factor-complexity.js`'s machinery. The answer is a unique number, not an opinion.

Refinement: "effectiveness" must be defined by an invariant. The growth-rate upper bound (B2) works; "how far a DFS gets" does not, because it depends on search order.

### B2. The aa2f language's growth rate

Current state: **growth rate ≤ 1.9915** (a tight upper bound, `MATH_CLAIMS.md` row 33). The observed ratio is ~1.60, but it has no proven connection to the limiting value. **The gap 1.60 ↔ 1.99 is open.**

Narrowing it from above requires larger n or something better than Fekete's argument — this is genuine incremental work, and distributed exact p(n) computation is a direct route to it (every new p(n) is a theorem-shaped upper bound, section F).

**Narrowing it from below is not incremental work but the whole conjecture:** by König's lemma, any proven p(n) ≥ 1 for all n is equivalent to the existence of an infinite aa2f word (`MATH_CLAIMS.md` row 50). Lower-bound work is therefore an attempt to prove the conjecture and must not be scheduled as "narrowing the bound".

### B3. Unavoidable sets

"Are there motifs such that passing through them always leads to a dead end" is, in the literature, the **unavoidable set** concept. The unavoidability of a finite set is decidable. This is a generalization of B1 and is best formulated with that vocabulary, not a new one.

### B4. Rauzy graphs and right-extendability

The differences p(n+1) − p(n) in factor complexity count the number of **right-special factors**. This is a language invariant and it explains *where* the constraint bites. For g₃(h₆^ω(a)), the differences lie between 6…8 (`MATH_CLAIMS.md` row 28) — but their **structure** is unexplored.

### B5. Route (c): at what L do the small window and large periods stop excluding each other?

`MATH_CLAIMS.md` row 49: for uniform maps g: Σ₆ → Σ₃^L, L ≤ 5, [2,5]-avoiders exist (35 / 685 / 7,019 classes for L = 3/4/5) but **every one of them violates K ∈ [6,100] by symbol 44 at the latest** — and conversely g₃ (L=10) avoids all K ≥ 6 but hits 34 squares at small periods. Questions that are finite and invariant:

1. **The smallest L at which some class survives both windows.** ~~L = 6 is 3³⁶ maps — no longer naively enumerable~~ **outdated as of 2026-07-31 (row 78):** the locality of the [2,5] window (K ≤ 5 fits in 10 symbols) turns the problem into a finite CSP, not a 3^(6L) search, and L=6 is now decided exhaustively under this reformulation: **200,106 canonical classes** avoid K ∈ [2,5]. ~~Item 1 remains entirely open: none of these has been escalated to K ≥ 6~~ **escalation done 2026-08-01: all 200,106 canonical classes tested against K ∈ [6,100]; all 200,106 die, 0 survivors, latest first-violation at symbol 71.** Converting to block units, the latest death is at 12.0 / 9.3 / 8.8 / 11.8 blocks for L = 3/4/5/6 — essentially constant, i.e. the failure is a local seam phenomenon that does not become harder to hit as L grows.

   **But item 1 is now open in a different and more serious way (row 79).** The complementary set S_large(L) — codings avoiding only the LARGE periods, ignoring K ∈ [2,5] entirely — was never measured, and is **empty for L = 1, 2, 3**. So at L=3 the finding "all 35 small-window survivors die at large K" measures nothing about the tension between the windows: nothing at all survives the large half at that L. **S_large(4), S_large(5), S_large(6) are unknown** (L=4 hit the budget wall twice), so rows 49 and 78 are neither known to be vacuous nor known to be informative. Establishing the threshold L* = min{ L : S_large(L) > 0 } is now the prerequisite for interpreting any route (c) result. We know L* ≤ 10, since g₃ ∈ S_large(10) and Theorem 9 (row 6a) proves it avoids **all** K ≥ 6.
2. **Why does avoiding [2,5] force g(a)=g(b) at L=3 (35/35) but no longer at L=4 (601/685)?** In h₆'s images, a→ace and b→adf share their first letter; is the explanation here or elsewhere — computable by examining where the violations arise.
3. **The non-uniform layer:** the smallest total image length |g(a)|+…+|g(f)| at which both windows survive.

A survivor **may not** be called a candidate until both windows have been checked AND Prop 9's preconditions (`decision-preconditions.js`) have been run for the pair (h₆, g).

### B6. The K ∈ [2,5] container language is a finite-type constraint — its structure is exactly computable

Mäkelä's open part concerns half-lengths 2…5, and an abelian square of half-length ≤ 5 fits in a 10-character window. The language "avoid *only* K ∈ [2,5]" is therefore a finite-window constraint, and every Mäkelä witness lives inside it.

**Questions 1–3 have been computed** (`sft-container.js`, results at `MATH_CLAIMS.md` **row 51**): one non-trivial SCC (2,844 states), letter frequencies necessarily in [1/11, 3/4], no binary tail. The interval is wide, so its pruning power in E1 use is modest — it is nonetheless the first necessary condition covering every attack route.

**Follow-up that remains open:**

1. ~~Do the intervals tighten as constraints are added?~~ **Computed for K=6** (`MATH_CLAIMS.md` row 52): the interval **does not tighten** — [1/11, 3/4] is stable from 5 → 6 even though the language strictly shrinks. Extension to K ∈ [2,7] (memory 13) requires Howard's algorithm: the state count exceeds the Karp table's Int16 limit. Exactness must not be weakened — a floating-point approximation is acceptable only if the result is verified rationally (row 51's Bellman–Ford pattern carries over unchanged).
2. **Where does the stability break?** A periodic word with period p always contains a K=p square, so individual extremal cycles inevitably die as the window grows — stability requires new, longer cycles with the same average at every level. The smallest kmax at which the upper bound drops below 3/4 (or the lower bound rises above 1/11) is a well-defined number, and every level is a finite computation.
3. **The SCC's fine structure:** synchronizing words, periodicity (gcd of cycles), and where Keränen's word's path runs relative to the SCC's "edges" (states with only one continuation).

Caveat: this is a **relaxation** analysis. It gives necessary conditions, never sufficient ones (cf. `NEGATIVE_RESULTS.md` §2: an SCC does not prove an infinite aa2f word).

### B7. The container language's unavoidable factors — COMPUTED 2026-07-30, answer negative (row 62)

**Question:** which factors (up to length 9) occur in every infinite [2,5]-free word — i.e. in every possible Mäkelä witness? "u is unavoidable" ⟺ the container graph with all states containing u removed is acyclic; a finite check per factor (`sft-container.js`'s state filtering + cycle detection, both already exist).

- **Validation:** single letters must turn out unavoidable (consistent with row 51(b)'s binary-tail result, a different code path); for a non-unavoidable factor an explicit avoiding cycle is exhibited.
- **Expected ledger sentence:** *"The container language's unavoidable factors up to length ℓ are exactly ⟨set⟩ (N of them); every Mäkelä witness contains them."*
- **Kill condition:** not needed — a finite computation, a unique answer; "letters only" is also logged.
- **Effort:** one session. **Impact 3–4.**

**Result (row 62): no factor of length ≥ 2 is unavoidable** — neither in the K ∈ [2,5] container (1,016 classes up to length 9) nor in the K ∈ [2,6] container (3,837 classes up to length 11). Only individual letters. The hoped-for *"every witness contains factor X"* statement does not exist. **The question is closed within this window.** This is a third independent measurement of the same fact: the container is a loose relaxation (cf. rows 51 and 52). **Consequence: it is not worth searching the container for more necessary conditions.** The same question remains open for the aa2f language itself, which is a proper subset of the container — necessary factors may still exist there, but aa2f is not a finite-type language and this method cannot be applied to it directly.

### B9. Balanced alphabets — why is the dichotomy so clean? (row 54)

In row 54's sweep, **every** balanced alphabet (of the form {0, p, q, p+q}) terminated, and no unresolved class was balanced. Questions that are finite and invariant:

1. **Does the dichotomy hold at a wider span?** Every new span is a finite computation with the same module. The first balanced class that does **not** terminate would break the pattern; the first unbalanced class that terminates would extend the exception list ({0,1,2,4} is so far the only one).
2. **Is 60 the ceiling for balanced alphabets?** Values run 50 → 55 → 58 → 60 as (p,q) grow further apart, and stop at 60. Does a balanced alphabet exist whose longest word is > 60?
3. **A candidate structural explanation — to be tested, not assumed.** A balanced alphabet is the sumset {0,p} + {0,q}, so a letter is p·x + q·y with x,y ∈ {0,1}: the alphabet is a projection of {0,1}² ⊂ ℤ². With sufficiently independent p, q, sums are equal exactly when **both binary coordinates** match, so an additive square in the ℤ-word corresponds to a simultaneous abelian square in two binary projections. This connects directly to row 53 (ℤ² solved). **A falsifiable prediction:** if the explanation holds, a balanced alphabet's result should depend only on whether p and q are "sufficiently independent", not on their size — and (1,2)'s outlier value of 50 is explained by q = 2p. Testable by comparing classes with the same dependency structure but different size.

**Update 2026-07-30 (row 66):** Freedman's proven general bound (61, for all balanced i.e. Sidon alphabets) settles item 2's question exhaustively from the literature side — 60 is, per the literature, a general ceiling, not merely this project's own span≤8 observation. Items 1 and 3 remain open: the structural explanation (item 3) is now testable against Freedman's proof technique, which is a different question from more computation.

### B10. Non-uniform morphism search for additive squares — PARTIALLY COMPUTED 2026-07-30 (row 68)

**Question:** does there exist a non-uniform morphism whose fixed point completely avoids additive squares (at all K ≥ 1) over some unbalanced four-letter alphabet?

**Why exactly this, and not more uniform search:** `additive-morphism-scan.js` (row 67) exhausted the uniform case at k ≤ 4 with six unbalanced alphabets — negatively, but exhaustively. The Cassaigne et al. (2013) construction for additive **cubes** is provably **non-uniform** (φ_{a,b,c,d}: a→ac, b→dc, c→b, d→ab, lengths 2,2,1,2), extracted directly from the Lietard & Rosenfeld preprint. This was a strong prior expectation that uniform would be the wrong search space for squares too.

**Result (row 68):** `additive-nonuniform-morphism-scan.js` generalized the search to length profiles (La,Lb,Lc,Ld) ∈ [1,4]⁴ (La ≥ 2), including the Cassaigne-type (2,2,1,2) profile as one of 192. Exhaustive and negative on four alphabets ({0,1,2,5}, {0,1,6,8}, {0,3,4,8}, {0,2,4,7}), ~117M morphisms per alphabet. **Cassaigne-type non-uniformity alone is therefore not sufficient** — at least not in this window.

**The remaining 16 classes run 2026-07-30 (row 69):** item 2 below is now closed. All 20 open unbalanced classes have been run through this module, exhaustively and negatively. **This closes the 4→4 morphism form for length profiles up to 4 across the entire unbalanced range**, not just four samples anymore.

**Remains open:**
1. **Longer profiles** (maxlen > 4) — cost grows fast, measure before promising. **Kill condition §14 has now triggered twice:** 20/20 classes negative with no signal. Do not deepen the same search without a new structural idea.
2. ~~16 other unbalanced classes~~ — **done 2026-07-30, row 69.**
3. **Structurally different constructions** — Cassaigne's own φ_{a,b,c,d} is defined over ℂ and not restricted to four fixed symbols the same way this search is; an entirely different morphism form may be needed (e.g. a larger auxiliary alphabet, like the h₆→g₃ construction on the abelian side). **Raised as its own item, B13**, because after two negative rounds the most likely explanation is not "there are no morphisms" but "the search space is the wrong shape".
- **Validation:** the three-layer pattern was met — a regression control against the uniform case (`additive-morphism-scan.js`) is independent proof of the generalization's correctness.
- **Kill condition for the next deepening:** no signal at a reasonable budget without a new structural idea — the same criterion as in `NEGATIVE_RESULTS.md` §1 and now also §14.
- **Impact, if it ever succeeds:** very high — it would answer Question 3 affirmatively (row 63/66: *"Is there any finite alphabet of integers over which additive squares are avoidable?"*), which has been open since at least 1987.

### B11. A decision procedure for the additive condition — the machine can only refute, never confirm (RESEARCH_ARCHITECT run 2026-07-30)

**Question:** does there exist a **finite** criterion that decides whether a given morphism's fixed point avoids additive squares at all K ≥ 1 — the additive counterpart of what `decide-realizability.js` and Theorem 4/6 (rows 32, 46) do on the abelian side?

**Why this was the whole machinery's most important gap, not one feature among others** — the situation as of the early evening of 2026-07-30, **partially resolved the same evening, see below.** The scanner said, in its own output: *"This is BOUNDED EVIDENCE, not a proof of an infinite fixed point — no exact decision procedure exists yet for the additive condition."* Consequence: **if the sweep in rows 68–69 had found a survivor, the project would not have been able to establish it as correct at that point**, only raise the prefix cap. The machine collected negative results to arbitrary length but could not produce a positive one — and Question 3 (row 63) is an **existence question**.

**Why this is credible and not wishful thinking:** additive equivalence is a **linear functional** of the Parikh vector (a weighted sum of the elements), so the state of an additive square crossing a seam is a pair (length difference, sum difference) — a two-dimensional integer lattice. This is the same shape as Rao & Rosenfeld's Proposition 5/6 bounds, and the project already has `perron-frobenius.js`, `smith-normal-form.js`, and `ancestor-box.js`, which compute exactly such bounds. It is a matter of transferring existing machinery to a new equivalence relation.

- **Connection to the machinery:** `perron-frobenius.js` (sum growth = the incidence matrix's spectrum), `ancestor-box.js` (the box's shape), `decide-realizability.js` (the decision skeleton). Missing: a bound on the sum difference and its proof.
- **Validation:** positive control = the procedure must give a **negative** verdict for every morphism exhaustively rejected in rows 67–69 (over 2·10⁹ morphisms in total, each a known answer); negative control = a deliberately broken morphism whose fixed point has a known additive square; cross-check = the procedure's verdict vs. a raw prefix run to a cap of 10⁴.
- **Expected ledger sentence:** *"A decision procedure for the additive condition derived for k-uniform morphisms: the sum difference across a seam is bounded by ⟨B⟩, so the check is finite and covers all K ≥ 1. Verified on N morphisms for which the answer was known in advance."* — `COMPUTED` (Level 1), or `PRIMARY` if the bound is derived from a published theorem.
- **Kill condition:** if the growth of the sum difference **cannot** be bounded from the incidence matrix's spectrum, the box is infinite and no procedure exists in this form. **This is seen from the first derivation, not from a run** — i.e. the kill condition fires on paper within hours, not weeks.
- **Effort:** pre-measurement = derive the bound **for one** 2-uniform morphism by hand and compare to the abelian box given by `ancestor-box.js`. Generalize only if that works. **Impact 5.**

**PRE-MEASUREMENT DONE 2026-07-30 (row 71) — the route exists but is narrow, and the result reverses the abelian-side intuition.**

The hypothesis's form shifts: `ker Φ` is replaced by the hyperplane `ker(v^T)`, whose dimension is 3, so a zero intersection forces **dim im(Mⁿ) ≤ 1**. Measured exhaustively: k=2 → 6.46%, k=3 → 2.12%, k=4 → **0.87%** of the search space.

**The structural observation that is this pre-measurement's most important contribution:** on the abelian side, images having identical Parikh vectors is the very property that *carries* the construction (Keränen's g₈₅, row 3). On the additive side, **the same property kills the morphism immediately** — equal image sums mean that any two adjacent whole blocks form an additive square of half-length k, with no search needed. **What carries the abelian solution blocks the additive one.** This is one explanation for why rows 67–69 are uniformly negative, and it had not been logged before.

**Consequence for B11's value, honestly:** the procedure would add nothing new for k ≤ 4, since the enumeration is already exhaustive there (rows 67–69). **Its entire value is in scaling to a k where enumeration does not scale**, and the rank-1 + pairwise-distinct-image-sums filter cuts the space to 0.08% — small enough that a larger k becomes feasible. **The actual kill condition is still open:** the bound itself (finiteness of the sum difference) has not been derived, only the hypothesis's shape and coverage. That is the next step, and it is settled on paper.

### B11 IS PARTIALLY SUPERSEDED — DO NOT BUILD IT (2026-07-30, rows 72–73)

The procedure **already exists, published**, and does not need to be derived: Theorem 2.4 (Currie, Mol, Rampersad & Shallit, arXiv:2111.07857, quoted in Andrade & Mol's arXiv:2408.15390) solves additive k-power-freeness for **affine** morphisms, and the implementation is the paper's own: `github.com/lgmol/Additive-Powers-Decision-Algorithm`. The statement and the definition of an affine morphism are at row 72, verified from the primary source.

**The delimitation of what is superseded matters more than the superseding itself:**

1. **It is not the same class.** Row 71's rank-1 condition (a transfer of Proposition 11) and Theorem 2.4's affine condition are **different** subsets. Affine requires that the image's length **and** sum are affine functions of the letter's own value — measured at 0.006–0.021% of the space (row 73), versus rank-1's 0.87%.
2. **It is not reuse of existing code.** The source itself states that γ's incidence matrix has an eigenvalue of exactly 1 and does not satisfy Rao & Rosenfeld's conditions at all. The CMRS algorithm is a component that must be **separately implemented**; `decide-realizability.js` does not do it.
3. **Nothing has been decided yet.** Row 73 measures **eligibility**, not a decision. No candidate has been run through the decision algorithm, because the algorithm has not been implemented.

**KILL CONDITION before any candidate is called anything at all:** the implementation must reproduce the repo's own **five case studies** (Dekking 1979, Currie & Aberkane 2009, Andrade & Mol Prop. 3.1 and 4.1, CMRS 2021 — exactly the morphisms listed at row 73). **Not β/δ — that was an incorrect reference, corrected at row 73.** If it does not reproduce them, stop. Same pattern as row 68's regression control.

**And one delimitation that must not be forgotten:** the additive line is a **parallel research line, not a bridge to Mäkelä's conjecture.** Additive avoidance is stricter than abelian (every abelian square is an additive square), but the implication lands on already-solved ground: four-letter abelian-square-freeness is Keränen 1992 (row 3). Mäkelä is a different condition. See row 72 and A6/E6.

### B12. Question 3 is an existence question — the target has been backwards (RESEARCH_ARCHITECT run 2026-07-30)

**Question:** does there exist **some** finite integer alphabet over which additive squares are avoidable — and if so, why is it being sought at the alphabet size where avoidance is hardest?

**The observation motivating this.** Row 63 quotes Question 3 verbatim: *"Is there any finite alphabet of integers over which additive squares are avoidable?"* — **any** finite alphabet qualifies, and more letters make avoidance easier. The project has nonetheless spent its entire computing budget on **four** letters, where balanced classes are finite by Brown & Freedman (rows 65–66) and the rest also appear to die (rows 54, 64, 67, 69). That is the hardest case, and the results have therefore been negative.

**Two restrictions that turned out to be choices, not limits** (measured 2026-07-30, row 70):
1. `additive-sweep.js` **already supports more letters** — `canonicalAlphabets(5, 8)` gives 37 affine classes. The parameter exists and has never once been turned. The morphism scanners are hard-coded to four on a single line (`length !== 4`).
2. Span ≤ 8 gives 31 classes with four letters; **span ≤ 10 gives 62.** Half of even the four-letter space is unswept, and the bound of 8 is not justified anywhere in the documents.

- **Validation:** affine invariance and witness verification from the definition hold as-is for five letters (`verdictFor`'s own layers); positive control = the known four-letter classes must reproduce exactly when the same code is run with `letters = 4`.
- **Expected ledger sentence:** *"Five-letter alphabets, span ≤ ⟨s⟩, ⟨n⟩ affine classes swept: ⟨e⟩ classes' language is finite, ⟨o⟩ remained open at budget ⟨b⟩ nodes, longest verified word ⟨L⟩. Nothing is claimed beyond the lower bounds."* — `COMPUTED` (Level 1).
- **Kill condition:** if five-letter classes behave qualitatively the same as four-letter ones (languages terminate at reachable budgets), alphabet size is not the deciding variable, and the line is stopped — **and not replaced by chasing lower bounds** (`NEGATIVE_RESULTS.md` §2: no DFS lower bound proves infiniteness).
- **An honest objection, recorded here so it is not forgotten:** a longer word on a larger alphabet is not a "record" in any meaningful sense. This item's value is **not** the lower bound but that five letters is the place where **B11's certifier has a realistic chance of getting something to certify**. B11 and B12 are the same work from different ends; neither carries alone.
- **Effort:** turning the parameter, pre-measurement done (row 70). **Impact 5**, cost near zero.

### B13. The auxiliary-alphabet route — the morphism form that actually worked on the abelian side (RESEARCH_ARCHITECT run 2026-07-30)

**Question:** does there exist a morphism over a **larger auxiliary alphabet** whose fixed point's projection to a four-letter integer alphabet avoids additive squares — i.e. the additive counterpart of the h₆ → g₃ construction?

**Why now.** On the abelian side, the solution is not a 4→4 morphism: Rao & Rosenfeld's construction is **h₆ with six letters, projected by g₃ to three** (all of row 49's machinery). On the additive side, only the 4→4 form has been searched, and it is now closed twice: uniformly at k ≤ 4 (row 67) and non-uniformly to profiles of length 4 on all 20 open classes (rows 68–69). **After two exhaustive negative rounds, the most likely explanation is not "there are no morphisms" but "the search space is the wrong shape"** — the same wrong inference was already made once with the uniform search before row 68, and a third time would be predictable.

- **Connection to the machinery:** `h6-image-sweep.js` already performs exactly this shape of sweep on the abelian side (uniform images Σ₆ → Σ₃^L); the structure transfers, the value function changes.
- **Expected ledger sentence:** *"Auxiliary alphabet Σ_m → a four-letter integer alphabet, image lengths L ≤ ⟨L⟩: no projection produces an additively-square-free fixed point / a candidate was found and it is ⟨…⟩."* — `COMPUTED` (Level 1).
- **Kill condition:** if growing the auxiliary alphabet m = 5 → 6 does not change the surviving-prefix distribution at all, the form is not the issue and the hypothesis is wrong.
- **Effort:** pre-measurement = m = 5, L ≤ 2 symbol-count measurement before promising L = 3 (same pattern as row 49). **Impact 4.**

**RUN 2026-07-31, L = 1…6, exhaustive and negative (row 77).**
`h6-additive-image-sweep.js` swept uniform codings g: {a..f} → {0,1,2,5}^L
applied to h₆^ω(a), with the condition additive squares at **all K ≥ 1**.
Every level exhaustive (the budget never bound), **zero survivors at every
level**. Work: L=1 → 3,268 symbols (0.0s), L=2 → 386,069 (0.0s),
L=3 → 13.9M (0.4s), L=4 → 251M (6.7s), L=5 → 2.20 billion (70.3s),
L=6 → **10.38 billion (302.6s)**. Growth ~9–12× per L, consistent.

**Two things must be stated precisely so the result is not read as broader than it is:**

1. **This is NOT a test of the kill condition logged above.** The kill
   condition asks what happens when the **auxiliary alphabet's size** m
   changes (5 → 6). Here m was held fixed (h₆, m = 6) and the **coding
   length L** was varied instead — that is `h6-image-sweep.js`'s own
   structure transferred, and structurally justified, but a different
   experiment. **Varying m is still undone.**
2. **One alphabet, one auxiliary morphism.** {0,1,2,5} and h₆. It says
   nothing about other alphabets, non-uniform codings, or L > 6.

**Comparison to the abelian original (row 49):** abelian route (c)
stopped at L ≤ 5; this additive counterpart reached L = 6. **The stop was
a deliberate decision, not a budget wall** — L=6 finished comfortably
within budget; L=7 (~90–120 billion symbols, ~50–70 min estimated) was
left unpromised without a separate decision.

**What this means for the work order.** The 4→4 form was closed three
times over (rows 67–69, 75). Now the auxiliary-alphabet form is also
closed up to image length 6 on one alphabet. **The hypothesis "the search
space is the wrong shape" found no support in the form easiest to test.**
It does not refute the hypothesis — varying m and non-uniform codings are
still open — but the next deepening must name **what structural thing
changes**, not merely increase L.

**PARTIALLY RUN 2026-07-31 (row 77) — h₆ fixed (m=6), L varied, the kill condition not yet tested.**

`h6-additive-image-sweep.js` implemented exactly `h6-image-sweep.js`'s structure (h₆ unchanged, the value function switched abelian → additive, K∈[2,5] → all K≥1, the S₃ symmetry reduction dropped since it does not hold for the additive target alphabet). **Result, alphabet {0,1,2,5}: L=1..6 all exhaustive, all negative, 0 survivors at any L.** L=6 took 10.4 billion symbols, 302.6s. The abelian original stopped at L≤5 — this went one further, deliberately stopped before L=7 (not on a budget, but a decision not to promise ~1h more without separate confirmation).

**What this does NOT yet test, and it is B13's original kill condition:** varying the auxiliary alphabet's *size* (m). h₆ was held fixed throughout. If anyone continues this, the next step is either (a) L=7 with the same h₆, or (b) a new auxiliary alphabet with m≠6 — the latter is closer to B13's original question.

### B14. The period threshold as a graded quantity: what is the smallest t for which K ≥ t is avoidable? (proposed 2026-08-01)

**Question:** Rao & Rosenfeld solved K ≥ 6 (row 7). Mäkelä conjectures K ≥ 2. Define **t\* = the smallest t such that some infinite ternary word avoids all abelian squares of half-length K ≥ t.** Known: t\* ≤ 6. Conjectured: t\* = 2. The open range is exactly t ∈ {2,3,4,5}, and **the intermediate values have never been separated** — every route (c) sweep to date has run K ∈ [2,5] as a single monolith (rows 49, 78).

**Why this is a genuinely different question and not a weaker restatement.** t\* is a well-defined invariant of the ternary language, not of any search. A result of the form *"K ≥ 3 is achievable by route (c), K = 2 is not"* would locate the obstruction at a specific period, which is strictly more information than "the conjunction fails". Row 20's distribution makes the question concrete: the 34 squares of g₃(h₆^ω(a)) split as K=2: 7, K=3: 9, K=4: 10, K=5: 5, with densities (row 19) ρ₂ = 13/36 ≈ 36% down to ρ₅ = 2/45 ≈ 4%. K=2 dominates by density but not by count, so which period is actually the binding constraint is an open, measurable question.

- **Connection to the machinery:** the CSP of row 78 carries over with only the K range changed; the locality bound generalizes to any bounded range as B(L, K_max) = 2 + ⌊(2·K_max − 2)/L⌋.
- **Sequencing, and this matters:** this question is **downstream of row 79's S_large measurement**. If S_large(L) = 0, then no coding at that L avoids the large periods for *any* t, and the graded question is empty there. Run it only at an L where S_large(L) > 0 is established — currently that means L = 10, the stratum where g₃ lives.
- **Expected ledger sentence:** *"At L = ⟨L⟩, ⟨n⟩ canonical codings avoid K ∈ [t,5] and K ∈ [6,100] simultaneously for t = ⟨t⟩, and none for t = ⟨t−1⟩; route (c) therefore locates the obstruction at period ⟨t−1⟩ in this window."* — `COMPUTED` (Level 1).
- **Kill condition:** if |S_small,[3,5](L)| is not materially larger than |S_small,[2,5](L)|, then K=2 is not the binding constraint and the graded decomposition buys nothing. That is itself worth logging.
- **Effort:** the CSP re-run is a parameter change; the cost is dominated by whatever L is used. **Impact 4.**

### B15. Template Parikh conditions as an impossibility argument for route (c) (proposed 2026-08-01, contains an unresolved correctness question)

**Question:** rows 30–31 computed the finite ancestor closure Anc_h(t₀) for the abelian-square template t₀ (116,578 templates, 21,237 parents). Each template imposes a linear Diophantine condition on the coding's image Parikh vectors. Is there a Parikh profile for g that violates **every** template's realizability condition simultaneously — and if not, is that a proof that route (c) cannot work at all?

**Why this is the right shape of idea, whatever its fate.** Every route (c) result so far is an exhaustive negative over one L. An argument at this level would be about *all* L at once, and would be a theorem rather than a sweep. That is the class of result this project has produced least of (see `NEXT_STEP.md`'s assessment: roughly one explanatory result per ten enumerative ones).

- ~~**The correctness question that must be settled first:** rows 30–31's ancestor closure was computed for the pair (h₆, g₃) ... the whole idea rests on a reuse assumption that is probably false.~~ **SETTLED 2026-08-01 (Step 3), and the answer is favourable: the ancestor closure is g-INDEPENDENT, so the reuse assumption is valid and B15 survives its kill condition.** Two independent confirmations:
  1. **The mathematics.** Proposition 5's bound is c_i = (Σ_j ‖B^j‖)·max_{s,p}|r_i(Ψ(sp))| + (max_l ‖B^l‖)·max_{w'}|r_i(Ψ(w'))|. Every ingredient is determined by h alone: B is a Jordan block of **M_h**; s, p range over suffixes and prefixes of **h**'s images; w' ranges over factors of a single **h**-image; r is the coordinate map in **M_h**'s Jordan basis. Proposition 6's bound likewise uses B^{-m} over **M_h**'s expanding blocks. **M_g appears nowhere in either bound.**
  2. **The code.** `proposition5-bounds.js`, `ancestor-box.js`, `get-parents.js`, `proposition11-targets.js` and `decide-realizability.js` contain **zero** references to `G3`. The one import of `decision-preconditions.js` (by `proposition11-targets.js`) takes only its generic exact-linear-algebra helpers — `parikhMatrix`, `matMulQ`, `columnSpaceQ`, `intersectionQ` — and applies them to **H6**.
  
  The notation was right all along: row 31 writes **Anc_h(t₀)**, subscript h. Row 30's prose said "for the pair (h₆, g₃)", which was simply wrong; **corrected in the ledger on 2026-08-01.** Where g genuinely does enter is Proposition 9's Condition 2 (E_e(M_h) ∩ ker(M_g) = {0}), which is an eligibility gate on whether the image branch of the procedure applies — not an input to the ancestor computation. That is consistent with §18's finding that Condition 2 is barely restrictive.
- **Structural finding, 2026-08-01: the machinery for B15 already exists and needs only one parameter.** Proposition 11 (arXiv:1511.05875 §4.2, quoted verbatim in `proposition11-targets.js`) reads: *"If M_h has no eigenvalue of absolute value 1 and E_e(M_h) ∩ ker(Φ) = {0} then one can compute a finite set of templates S such that each k-th power modulo Φ in Fact_inf(h) is a realization of a template in S."* **Setting Φ := M_g makes this exactly B15's question:** an abelian square in g(h₆^ω) is precisely a square modulo M_g, so the target set S for a candidate coding g is Proposition 11's set with F_Φ = M_g. Its hypothesis is Proposition 9's Condition 2, which §18 measured as holding for 69–85% of block types — so the gate is wide open, as that section already noted.

  `proposition11-targets.js`'s `targetSet()` implements the whole construction (integer kernel basis of F_Φ via Smith normal form, then Proposition 5's contracting bounds, then enumeration), but **`F_PHI` is hardcoded** to the Theorem 6 map. Everything else in the function depends only on H6 — consistent with Step 3's finding that the ancestor side is g-independent. **Parameterizing `targetSet(F)` is the single change B15 needs to become runnable.**
- **RUN 2026-08-01, and the control passed — but the scope is narrower than B15 assumed, and that must be stated.** `targetSet(F)` is now parameterized (default `F_PHI`, so all existing behaviour is unchanged; the default still returns the 24 targets of row 45). Control with **F = M_g3**: Proposition 11's hypothesis holds, and the target set is **2 non-zero targets, kappa = 3, radius 5.205**. So the construction runs and applies.

  **The scope limitation, found while running it:** Proposition 11 produces templates of the form t = [ε, …, ε, d] — **empty boundary words**. A square modulo Φ in Fact_inf(h₆) with Φ = M_g is a factor uv of h₆^ω with |u| = |v| and M_g·Ψ(u) = M_g·Ψ(v), i.e. u and v are *whole* factors of the base word. Their g-images are therefore whole runs of blocks. **That is exactly the block-aligned case — δ = 0 — the same reach as row 80.** Proposition 11 with Φ := M_g gives it with exact Proposition 5 bounds instead of empirically collected differences, which is a real improvement in rigour, but **it does not reach the non-aligned configurations that row 80 identified as where the remaining difficulty lives.**

  **What would reach them:** general templates t = [u₁, u₂, u₃, d] with *non-empty* boundary words — Proposition 8/9's machinery, which is `decide-realizability.js`'s territory, not Proposition 11's. B15's impossibility argument therefore needs that route, and the honest status is: the target-set half is now runnable and controlled, the boundary-word half is untouched.

  **Immediate next task, with its control:** run the realizability check on those 2 targets for F = M_g3. Theorem 9 (row 6a) proves g₃(h₆^ω(a)) has no abelian square of period > 5, and block-aligned squares here have K = 10m ≥ 10, so **both targets must come out NOT realizable**. If either is realizable, the parameterization or the realizability step is wrong and nothing further may be built on it.

- **How this relates to row 80, and why B15 reaches what row 80 cannot.** An abelian square in g(h₆^ω) decomposes as M_g·D + δ = 0, where D is the whole-block Parikh difference (∈ Z⁶, g-independent) and δ is the Parikh difference of the *partial* blocks at the two ends. **Row 80's Parikh reduction is exactly the special case δ = 0** — block-aligned squares — which is why it saturated at 295,836 survivors and why it structurally cannot see non-aligned configurations. **B15 is the general case**, and it is precisely the part row 80 identified as where the remaining difficulty lives.

- **First task, now that the blocker is cleared:** parameterize `targetSet(F)`, then run it with F = M_g3 as a control. Proposition 9's Condition 2 is known to hold for (h₆, g₃) (`decision-preconditions.js`), so the construction must apply, and the resulting target set must contain realizable templates consistent with g₃'s known 34 abelian squares (rows 6b, 20). If it does not, the parameterization is wrong and nothing further should be built on it.
- **Structure if the above is resolved:** avoiding a template means violating at least one of its equations, so the combined condition is a conjunction of disjunctions of linear Diophantine constraints — SAT modulo linear arithmetic, not a plain ILP as it might first appear.
- **Expected ledger sentence:** *"For codings of length L, template ⟨t⟩ in Anc_h(t₀) is realizable for every admissible Parikh profile; route (c) therefore admits no coding at any L / a profile violating all ⟨N⟩ templates exists and is ⟨…⟩."* — `COMPUTED` (Level 1), or `PRIMARY` if the uniform bound is derived from a published statement.
- **Kill condition:** if the ancestor closure is genuinely g-dependent and no uniform version exists, the idea is dead on arrival and this is visible from the Proposition 5/6 bounds on paper, within hours, without running anything.
- **Effort:** the correctness question first (paper), then one solver instance. **Impact 5 if it survives the correctness question, 0 if it does not.**

**B15 IS CLOSED AS AN ALGEBRAIC ROUTE (2026-08-01, row 82).** The general case needs Psi(pre_r(g(x))) for every offset r and letter x, and that data provably determines the strings themselves (verified at L=4: 81 strings, 81 distinct prefix-Parikh signatures, 0 collisions). So the Parikh compression that made row 80 fast is exactly what discards the information the general case requires, and **no algebraic impossibility argument of the shape B15 proposed exists.** This is a structural closure, not an unfinished measurement. What remains is string-level: row 80s filter leaves **2,451,788,832** codings at L=4, a 115.2x reduction from 81^6, which is a defined finite task rather than a theorem.

### B16. The bigram-subset lattice between 1-abelian and 2-abelian equivalence (proposed 2026-08-01)

**Question.** A3 records that avoiding **2-abelian** squares of period ≥ 2 over ternary is **solved affirmatively** (Fici & Puzynina Theorem 65), while the **1-abelian** case is Mäkelä's conjecture, open. 2-abelian equivalence counts occurrences of all **nine** length-2 factors in addition to letters. **Nothing forces the choice to be all nine or none.** For any subset S ⊆ {aa, ab, ac, ba, bb, bc, ca, cb, cc}, define *S-abelian equivalence*: same letter counts **and** same occurrence counts for every bigram in S. S = ∅ is 1-abelian (Mäkelä); S = all 9 is 2-abelian (solved). **What is the minimal S for which an infinite ternary word avoiding S-abelian squares of period ≥ 2 exists?**

**Why this is a different axis, not a variation.** B14 grades the **period** (which K must be avoided). A3 names the k-abelian hierarchy but treats it as a yardstick, not as a search space. This grades the **equivalence relation itself**, over a lattice of 2⁹ = 512 points, and the grading is **monotone**: if avoidance is possible for S, it is possible for every S' ⊇ S (a finer relation identifies fewer pairs, hence fewer squares to avoid). Monotonicity makes the threshold well-defined and the search a lattice antichain problem rather than 512 independent runs.

**Why it matters regardless of Mäkelä.** The answer is a statement of the form *"tracking these particular bigrams is exactly what ternary avoidance requires"* — a new classification, with a named minimal witness set, in a lattice nobody has enumerated. And it **repairs Step 2's design flaw at its root**: at S = all 9 a solution is known to exist, so any apparatus can be validated at that end of the lattice before being trusted anywhere else. That is the positive control the project has never had.

- **Connection to the machinery:** the suffix-test structure of `morphism-scan.js` and `factor-complexity.js` carries over with the equivalence predicate swapped; the 2-abelian checker written on 2026-08-01 (cross-validated against a slow definitional checker on 500 random words) already handles the S = all 9 endpoint.
- **First measurable experiment:** compute p_S(n) — the factor complexity of the S-abelian-square-free ternary language — for the 9 singleton sets S = {xy} and for S = ∅ and S = all 9, at n up to the point where p_∅ is already known (row 27). Whether any singleton already changes the growth materially tells you whether the threshold is near the bottom of the lattice or the top.
- **Validation:** S = ∅ must reproduce row 27's aa2f figures exactly; S = all 9 must not die (Theorem 65). Monotonicity must hold empirically: p_S(n) ≥ p_{S'}(n) whenever S ⊆ S'.
- **Expected ledger sentence:** *"S-abelian square-freeness over three letters: the language is finite for every S in ⟨list⟩ up to length ⟨n⟩, and still growing for ⟨list⟩; the minimal subsets admitting growth at this length are ⟨antichain⟩."* — `COMPUTED` (Level 1).
- **Kill condition:** if every proper subset S ⊊ all 9 behaves indistinguishably from S = ∅ at reachable lengths, the threshold sits at the top of the lattice, the grading is trivial, and the line stops. That is visible from the singletons alone.
- **Effort:** the predicate swap is small; cost is dominated by enumeration, comparable to row 27's. **Impact 4.**

### B17. Is the aa2f language regular? (proposed 2026-08-01)

**Question.** The K ∈ [2,5] container **is** a regular language — it is an SFT with 3,114 states (row 51). The full aa2f language is defined by infinitely many constraints (all K ≥ 2) and is universally assumed not to be regular, but **this has never been tested, and it has a sharp consequence either way.**

**Why it matters.** If aa2f were regular, it would be recognised by a finite automaton, and the existence of an infinite word would follow from cycle detection in that automaton — **so aa2f regular ⟹ Mäkelä decidable.** The implication makes a negative answer informative too: a demonstration that aa2f is *not* regular is a structural statement about why the problem resists the container-style methods that work at bounded K, and it explains in one sentence why rows 51, 52 and 62 all found the container too loose.

**The concrete test, and why it is cheap.** A regular language's factor complexity satisfies a **linear recurrence with constant coefficients**. The project already has exact p(n) for aa2f (row 27, up to n = 22) and can compute more. Testing a finite sequence for a linear recurrence is a Hankel-matrix rank computation (or Berlekamp–Massey) over ℚ — seconds, exact, no floating point.

- **First measurable experiment:** build the Hankel matrices of p(2), p(3), …, p(22) and compute their exact ranks over ℚ. A regular language would show the rank saturating at some order d; a rank that keeps increasing with every added term is evidence against.
- **Validation:** run the same test on the container language's counts, which **is** regular (row 51) — its p(n) must show a saturating Hankel rank. If it does not, the test is wrong and nothing may be concluded from the aa2f run.
- **Expected ledger sentence:** *"The Hankel rank of aa2f's factor-complexity sequence is still increasing at order ⟨d⟩ over the ⟨n⟩ known terms, so no linear recurrence of order ≤ ⟨d⟩ fits; the container's sequence saturates at order ⟨d'⟩ as a regular language must."* — `COMPUTED` (Level 1).
- **Kill condition, and it is honest:** a non-saturating rank over 20 terms is **evidence, not proof** — the sequence is short and `NEGATIVE_RESULTS.md` §14 is the standing warning about reading short sequences. If the rank saturates, that is the interesting case and demands immediate scrutiny rather than celebration.
- **Effort:** hours. **Impact 3** if negative, **5** if the rank saturates.

### B18. The bi-infinite core of aa2f, by iterated trimming (proposed 2026-08-01)

**Question.** Mäkelä asks for a one-sided infinite word. A **bi-infinite** aa2f word is a strictly stronger object, and the difference between the two is exactly A4's unfavourable factors. Define **L_bi(n)** = the length-n factors that occur in *some* bi-infinite aa2f word. Computationally, L_bi(n) is the fixpoint of iteratively deleting, from the aa2f Rauzy graph of order n, every node with in-degree 0 or out-degree 0. **How much smaller is L_bi(n) than p(n), and does the gap grow?**

**Why this is not row 35 or A4 restated.** Row 35 counts one-step dead ends — nodes with out-degree 0 (48 at length 9) and in-degree 0 (48). **The iterated trim to fixpoint is a strictly stronger operation**: it removes nodes that survive one step but die in two, three, or n steps, and it computes a *language*, not a count. A4 poses unfavourable factors as a question about individual words; this computes the whole surviving language and its growth.

**Why it could produce a theorem rather than a measurement.** If L_bi(n) = ∅ at any n, **no bi-infinite aa2f word exists** — a genuine, publishable negative result, strictly weaker than refuting Mäkelä but real, and reached by a finite exhausted computation rather than a bounded search.

- **Connection to the machinery:** `sft-container.js` already implements exactly this trim (its "essential part", 3,114 → 2,844 states at row 51). The operation transfers unchanged; only the input graph changes from the container to the aa2f Rauzy graph.
- **First measurable experiment:** trim the aa2f Rauzy graph at n = 8…19, where p(n) is already computed (row 81 gives 696 → 65,790), and record |L_bi(n)| / p(n) as a function of n.
- **Validation:** applying the same trim to the container must reproduce row 51's 3,114 → 2,844 exactly, on the same code path.
- **Expected ledger sentence:** *"The bi-infinite core of aa2f has ⟨m⟩ factors at length ⟨n⟩ against p(n) = ⟨p⟩; the ratio ⟨rises/falls/is flat⟩ over n = 8…19."* — `COMPUTED` (Level 1).
- **Kill condition:** if the trim removes under 1% at every length, the one-sided and bi-infinite languages are effectively the same at reachable lengths and the distinction buys nothing.
- **Effort:** one session, reusing existing code. **Impact 3–4.**

**One further idea, deliberately recorded as lower priority.** Row 81 measured that ~51% of aa2f factors have exactly one right extension. Contracting all such forced chains in the Rauzy graph leaves only genuine branch points, and the growth of the branch-point count against p(n) is a language invariant nobody has computed. It is real, but it is closer to a search reformulation than to a new mathematical object, and it should wait behind B16–B18.

### B8. The frequency polygon — the joint distribution instead of the box (RESEARCH_ARCHITECT run 2026-07-30)

**Question:** what is the exact polygon, in the simplex, of the container language's reachable frequency vectors (f_a, f_b, f_c)? Rows 51–52 give only the box [1/11, 3/4]³; the polygon tells us, for instance, whether f_a = 3/4 can occur simultaneously with f_b = 1/11. Method: direction-parametrized Karp (a linear functional's max mean-cycle = a supporting line); a finite set of directions gives an outer approximation that is already itself a valid necessary condition, and cycles that achieve it give interior points.

- **Validation:** the projections must reproduce [1/11, 3/4] exactly; S₃ invariance under coordinate permutations; every vertex Bellman–Ford-verified (row 51's pattern).
- **Expected ledger sentence:** *"The K ∈ [2,5] container's frequency polygon is exactly ⟨vertices⟩; it is / is not strictly smaller than the box-simplex intersection."*
- **Kill condition:** if polygon ≈ box ∩ simplex, log as negative and stop the line.
- **Effort:** 1–2 sessions; pre-measurement with three directions. **Impact 3–4.**

---

## C. Questions that measure the implementation, not the mathematics

These are logged here because they keep recurring in plans and sound scientific. They are not invariant: change the letter preference order or the search strategy, and every figure changes.

| Formulation that does not carry | What it actually measures | Invariant counterpart |
|---|---|---|
| Search-tree geometry, tunnels and chambers | the DFS traversal order | the Rauzy graph (B4) |
| Phase transition in search | when *this* search slows down | growth of complexity p(n) |
| Survival function S(suffix) | the mortality of the chosen search order | the proportion of right-extendable factors |
| Entropy H(d) at depth d | branching in *this* tree | growth rate (B2) |
| Search ecology, highways, magnets | the same as above, metaphorically | — |
| Whether words have "DNA" | uniform distribution in windows | uniform recurrence, a known property of primitive substitutions |

The project has run into this once before and renamed the statistics modules "search-pruning heuristics" for exactly this reason. The same distinction applies here.

**This does not mean telemetry may not be collected.** It means its results must not be presented as properties of the language.

---

## D. Ideas evaluated and rejected

Logged visibly so they are not proposed again without a new justification.

| Idea | Why rejected |
|---|---|
| Hyperbolic Parikh space | The Parikh vector's entire power is additivity Ψ(uv) = Ψ(u) + Ψ(v). It does not exist in a curved space. |
| Spectral gap as a predictor of a morphism's **correctness** | The incidence matrix loses letter order within the image. Two morphisms with the same matrix can behave completely differently at periods K = 2…5. **May still be valid as a cost estimate**, see E1. |
| QBF for morphism search before a finite criterion | Requires translating an infinite condition into a finite one — and that very translation **is** the hard mathematical content. A solver will not do it for you. Meaningful only after a finite criterion exists. |
| "Fractional resonance" for finding Dejean's values | Dejean is proven, see A2. No values are being sought. |
| SAT backbone for ternary search | The language is closed under S₃ permutation, so no position can be forced to a specific letter in all solutions — **the backbone is empty by symmetry**. Meaningful only once a prefix is fixed, which is a different question. |
| 64-bit SWAR bit-packing in JavaScript | JS's bit operators are 32-bit; 64-bit SWAR would require BigInt (slow) or manually handling two halves. Also, the bottleneck is not Parikh comparison — the exact scripts run in seconds. The idea is valid in C, not here. |
| Holography, Navier–Stokes, Gödel self-reference, SETI, quantum entanglement | No codable core. The connection to aperiodic tilings and substitutions is genuine, but already present in the project (the Rauzy projection). |
| HD0L projection morphisms for additive squares | Redundant. Row 49 exhausted the uniform image (L ≤ 5), and every surviving class died at large periods. Returning to the same search space under the name "HD0L" changes nothing. The additive sum's 1D nature destroys the freedom of projection that worked for the 6D Parikh vector (h6→g3). |
| Unavoidable factors for unbalanced alphabets (container relaxation) | A fourth version of the same null result. Rows 51, 52, 62 already proved: "the container is a loose relaxation", and no unavoidable factor of length ≥2 was found. NEGATIVE_RESULTS §7 closed this route. |
| 3-AP-freeness of prefix sums (Roth's theorem) | A serious mathematical error. Roth's density theorem concerns *sets* (without repetition). A prefix sum is a *sequence* (repetition allowed). It also concerns the sum of integers, not an abelian square. |
| Mining Toeplitz words | A renaming of blind DFS search. NEGATIVE_RESULTS §3 showed for record words: "there is no structure to extract". Toeplitz brings no structural reason for avoiding abelian squares. |
| MCTS-based navigation of deep languages | Measures the implementation, not the mathematics (ORQ section C). Still only produces a finite word (row 50: "any finite word is a finite observation"). |
| Exact square densities ρ_K(g) as a closed-form optimization function over codings *(evaluated 2026-08-01)* | Sound and elegant, but it reaches only the half already solved. ρ_K(g) is computable in closed form exactly when K is bounded — which is the [2,5] window that row 78's CSP already decides **exactly**. For K ≥ 6 the density is not a bounded-window quantity, and row 19's "ρ_K = 0 for all K ≥ 6" comes from Theorem 9 (row 6a), not from an independent density computation. So this would be an elegant restatement of the tractable half and gives nothing on the intractable half. |
| Template ancestor-DAG bottleneck analysis *(evaluated 2026-08-01)* | Optimizes the wrong stage. Finding "bottleneck" templates would reduce the cost of *running* the decision procedure, but the project is not bottlenecked there — it is bottlenecked on having a candidate to run it on. Rows 32 and 46 already ran the full procedure to completion twice. |
| K=2 recast as a de Bruijn condition on 2-gram anagram classes *(evaluated 2026-08-01)* | Redundant with row 51. `sft-container.js` already builds exactly this object, as a de Bruijn graph with memory 9 covering all of K ∈ [2,5] (3,114 states, SCC of 2,844). The proposal is the special case K=2 at memory 3. Separately, K=2 alone is trivially avoidable — (abc)^ω does it — so the reformulation's own kill condition fires immediately. |

---

## E. Refined ideas that survive scrutiny

### E1. Verification-cost-aware prioritization

The spectral gap does not tell you whether a morphism is correct, but it tells you **how expensive it will be to check**: Proposition 5's and 6's bounds — and thus the ancestor box's size — depend directly on the eigenvalues' location. If there is a queue of candidate morphisms, *estimating* the box size in advance orders the queue from cheapest to most expensive.

This does not change the validity of any proof. It is a scheduling heuristic, and that is the only role in which the spectral gap is defensible.

**The project already has what this needs:** `ancestor-box.js` computes the box size exactly, so the "estimate" can be calibrated against real numbers.

### E2. CEGIS under its right name

"MUS-guided mutation" is **CEGIS** (Counter-Example-Guided Inductive Synthesis, Solar-Lezama et al. 2006). Using the name is not pedantry: it comes with an existing literature on convergence conditions and known failure modes, instead of reinventing the methodology from scratch.

**Prerequisite:** requires a finite verifier. The project now has one (`decide-realizability.js`, `MATH_CLAIMS.md` row 32) — but it applies to *pure morphic words*. A CEGIS loop should therefore be built around **fixed points of ternary morphisms**, not projections. This is also A1's route (a).

### E3. A smoother fitness function for genetic search

Changing one letter in a morphism can collapse the result discontinuously, which is a poor landscape for population methods. If a GA is tried, the fitness function must measure something more continuous than "how far it survives" — for example the fixed point's factor-complexity growth, which is already computable.

### E4. An independent second verification engine (an untraced lead — must be resolved before use)

All the project's Level 1 computations so far have been verified by the same codebase; the only independent comparison is R&R's C++ reference (row 22) and the planned ACR 2004 replication (row 48). h₆ is 3-uniform, so the construction lives in the world of automatic sequences, and there exists a family of tools there (Walnut, Shallit et al.) with which some word properties have been decided mechanically. **Untraced:** whether it covers abelian properties in the form needed here — Parikh comparisons are not first-order properties, and any possible route runs through synchronized sequences. Nobody has opened the sources. **Do not cite and do not build on this before someone reads the originals** (same rule as A5). If coverage is confirmed, this would be an entirely independent second engine for Theorem-9-type claims — more valuable to the laboratory than any single new feature.

### E5. Clean-room replication in another language (RESEARCH_ARCHITECT run 2026-07-30)

All Level 1 rows rely on the same JS codebase. The cheapest way to raise the whole ledger's credibility: replicate the canonical figures (18 words of length 7, 34 squares, 3,114 states, [1/11, 3/4]) with an independent implementation (e.g. Python), **from the ledger row's own wording, not by reading the code** (clean room). The deviation is exactly zero, or the row is reopened — a discrepancy would be the most valuable possible result, not a failure. An "independently replicated" mark in the ledger is a schema change → maintainer decision (rule 5). Effort: one session for 4–5 figures. Impact 4 (capability class: replication).

### E6. Additive squares as a second instance for the computing engine — TRACED 2026-07-30 → section A6

The lead was traced and turned out stronger than the recollection: the openness of additive squares over ℤ, the cube solution over {0,1,3,4}, AND the fact that **the project's own core source, arXiv:1511.05875, is precisely the ℤ² solution to this problem** — quotes and dates in section **A6** and `MATH_CLAIMS.md` row 53. The additive instance is therefore not a neighbouring problem but a return to the parent problem of the paper the project's template machinery comes from. The technical basis stands: additive equivalence is a linear functional of the Parikh vector, so the container machinery (bounded K → finite window → de Bruijn → SCC → frequency bounds) transfers unchanged. See `SANALAB_PLAN.md`.

### E7. Keränen's g85^ω → three-letter projection — EXECUTED 2026-07-31 $\to$ dead end (NEGATIVE_RESULTS §16)

**Background:** Keränen's g85's fixed point (1992) is completely abelian-square-free over four letters (not even period-1 squares). Mäkelä's conjecture concerns three letters and *allows* trivial squares (00, 11, 22). This 4→3 projection (merging two letters) has not been tried in the literature or in the project.
**Result:** all 36 surjections were tested and they collapsed immediately into an abelian square of period $K=2$. The structure does not condense. Moved to the graveyard (see `NEGATIVE_RESULTS.md` §16).

### E8. CEGIS synthesis for ternary fixed points — EXECUTED (kill condition met 2026-07-31)

**Background:** the R&R decision procedure (`decide-realizability.js`, row 32) gives us a finite verifier for pure morphic words. This enables building a CEGIS (Counter-Example-Guided Inductive Synthesis) loop.
**Why it was worth it:** row 36 blindly enumerates all uniform morphisms. CEGIS learns from counterexamples (the first abelian square at K ∈ [2,5]), guides non-uniform search, and solves the "translating an infinite condition into a finite one" problem (section D, QBF), because the translation already exists.
**Result:** the kill condition was met. A CEGIS-type character-by-character backtracking search was implemented (`scratch/cegis_g_synth.js`), but even under very loosened criteria (avoiding only $K \in [2,5]$) the search went through 500 million branches without finding a single survivor. The space $3^{60}$ is, for uniform maps, nearly or completely empty of small squares. The original $g_3$'s achievements at large $K$ values are highly atypical. (See Graveyard §17).

### E9. Precise diagnostics of g3(h6^ω(a)) for periods 2–5 — EXECUTED 2026-07-31

**Background:** it is known that the word g3(h6^ω(a)) contains exactly 34 abelian squares (MATH_CLAIMS, rows 6b and 20). Their positions or structure had not been mapped.
**Result:** the mapping was done (see `walkthrough.md`). The squares are not random; they cluster heavily around $h_6$'s transition seams, especially `c` $\to$ `e` and `b` $\to$ `d`. For instance $g_3(c)$ ends in `bc` and $g_3(e)$ begins with `bbbbb`, creating a large "basin" that generates K=2..5 squares.
**Conclusion:** it is not worth trying to fix $g_3$ with random mutations. The CEGIS search (E8) should be aimed directly at preserving the K $\ge$ 6 properties while imposing tight boundary conditions on the seams of the 10-character blocks.

### E10. Comparative diagnostics of the five record words (RESEARCH_ARCHITECT run 2026-07-31)

**Background:** the project has 5 verified aa2f record words (longest 25,379), but they have never been compared to each other (cf. rows 40 & 42).
**Why it is worth it:** it answers questions such as: are they points on a single search path, or do they branch early? What is their abelian complexity (must be ρ(n) ≥ 2 to avoid abelian squares) and recurrence time compared to the uniformly recurrent g85^ω? It guides search strategy by indicating whether the class is "wide" or "narrow".
**Kill condition:** the words are consecutive points of the same search and statistically identical to a random aa2f word, so the comparison reveals no new structure.


## F. A new result that emerged from this assessment

**A tight upper bound on growth rate from Fekete's lemma.** All languages studied here are factorial, so p(m+n) ≤ p(m)·p(n) and Fekete's lemma gives

  lim p(n)^(1/n) = **inf** p(n)^(1/n).

The infimum is essential: **every p(n)^(1/n) is an unconditional upper bound on the growth rate**, not an estimate that could approach from either side. The project's already-computed exact factor counts thus become directly a theorem-shaped bound.

| language | tight upper bound | observed ratio |
|---|---|---|
| aa2f (Mäkelä, open) | **≤ 1.9915** | ~1.60 |
| aa2fr | **≤ 1.5940** | ~1.27 |
| abelian-square-free, 4 letters | **≤ 2.1775** | ~1.70 |

This replaces the earlier "observed ratio" as the headline figure, of which it had to be said that it had no proven connection to the limiting value. Now there is both a proven bound and a smaller conjectural value, and **the gap between them is honestly open** — Fekete's convergence is slow. See `MATH_CLAIMS.md` row 33.

---

*Addition guide: a literature problem goes into section A only with a citation and a source. The project's own question goes into section B only if it has an invariant formulation. If the formulation depends on search order, it belongs in section C. New ideas are produced by `RESEARCH_ARCHITECT.md`'s procedure — every proposal must have a validation plan, an expected ledger-sentence form, and kill conditions before it is entered here.*
