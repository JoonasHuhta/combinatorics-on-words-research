# KNOWLEDGE_STATE.md — what is known and what is closed

**Updated:** 2026-07-30
**Purpose:** a single read that says where the project stands. The split is
**epistemic, not topical**: what is known from an external source, what has
been computed in-house, what is provably closed, what has been retracted,
and what must not be used.

> **This is a derived index, not a source of truth.** Every entry is a
> pointer to a row in `MATH_CLAIMS.md`, and **the ledger always wins**. If a
> figure appears here without a row number, that is a bug. The drift
> checker verifies that every row mentioned here actually exists.

---

## 1. Known from an external primary source (Level 2)

These have been opened, read, and quoted verbatim. They are not the
project's own results.

| What | Row |
|---|---|
| Abelian squares cannot be avoided with three ternary letters; the longest word has length 7 and there are exactly 18 of them | 1 |
| Mäkelä's conjecture, precise statement; **open** for half-lengths K = 2…5 | 4 |
| h₆'s fixed point is completely abelian-square-free (R&R Theorem 4) | 5 |
| g₃(h₆^ω(a)) contains no abelian squares of period > 5 (R&R Theorem 9) | 6a |
| The same word contains **exactly 34** distinct abelian squares (Fici & Puzynina) | 6b |
| An infinite ternary word avoiding abelian squares of period > 5 exists | 7 |
| **Why exactly K = 2…5 is open:** the decision algorithm carries over to fixed points at all periods, but only to images at large periods | 7b |
| Definition of an unfavourable factor and Keränen's open question (2006) | 38 |
| g₉₈ is not an a-2-free endomorphism even though its iteration produces an a-2-free word | 39 |
| The paper confirms the Jordan structure verbatim | 44 |
| The template/ancestor method is **ACR 2004**, not 2015 | 48 |
| **Additive squares:** "is ℤ uniformly 2-repetitive" is open; cubes solved with {0,1,3,4}; **the ℤ² case is the topic of the project's own core source** | 53 |
| The openness of additive squares confirmed as recent (2023 and 2024); **affine classification is the field's own framework**, and the four-element case of cubes is solved except for the {0,1,2,3} class | 58 |
| R&R's own reference implementation is publicly available and matches `morphisms.js` | 22 |

At a weaker level (`INDIRECT`, the original has not been read line by line):
Pleasants with 5 letters (row 2), Keränen with 4 letters (row 3).

**Separately:** Dejean's conjecture is **proven**, not open
(`OPEN_RESEARCH_QUESTIONS.md` A2). Any plan that promises to "find RT(n)
values" relies on outdated information.

---

## 2. Computed and verified in-house (Level 1)

These are the project's own exact computations. They are not externally
verified, but each is reproducible and most have two independent code
paths.

**Structure and algebra:** h₆'s exact letter densities and spectrum (17, 18),
asymptotic square densities (19, 20), Prop 9's hypotheses (21), Smith
normal form (24), Jordan structure (25), Prop 5's bounds (29), the ancestor
box and its closure (30, 31), Prop 11's target set (45).

**Two theorem re-derivations with the full decision procedure:** Theorem 4
(row 32) and Theorem 6 (row 46). These are *re-derivations using the
factor machinery*, not independent proofs.

**Languages and growth:** factor complexity (27, 28), **tight upper bounds
on growth rates** from Fekete's lemma (33), Rauzy graphs (34), dead-end
factors (35).

**Words:** record words verified for the first time (40), FORBID4 is a
heuristic, not a rule (41), record words are not morphic (42), unfavourable
factors exist with four letters (47).

**Container language:** K ∈ [2,5] structure and necessary conditions (51),
stability of the interval when the window grows 5 → 6 (52).

**Additive squares:** alphabet sweep, 11 of 31 classes resolved (54).

**An equivalence worth knowing:** Mäkelä's conjecture is equivalent to
saying an aa2f word exists at every length (row 50). It follows that
**a lower bound on the growth rate is not a sub-goal but the whole
problem.**

---

## 3. Provably closed

These are not estimates but finite computations whose search tree has been
exhausted. They stay closed.

| What is closed | Kind of proof | Row |
|---|---|---|
| The ternary abelian-square-free language ends at length 7 | exhaustive search | 1 |
| **No** k-uniform ternary morphism, k ≤ 6, produces a Mäkelä fixed point | exhaustive sweep | 36 |
| **Route (c):** no uniform map Σ₆ → Σ₃^L, L ≤ 5, produces a Mäkelä word from h₆'s fixed point | exhaustive sweep | 49 |
| **Route (c) at L=6:** all 200,106 canonical codings avoiding K ∈ [2,5] also violate K ∈ [6,100] | locality-CSP + exhaustive escalation | 78, 79 |
| **No coding at all** at L = 1, 2, 3 avoids the large periods, small window ignored (S_large(L) = 0) | exhaustive sweep | 79 |
| No infinite [2,5]-free word exists over a two-letter sub-alphabet | cycle search in the container graph | 51 |
| 11 of 31 additive affine classes cannot host an infinite additively-square-free word | exhaustive search, with witnesses | 54 |

**Note on scope:** each of these is closed **within the stated window**.
"Does not cover L ≥ 6" or "does not cover 5 letters" is not a minor
qualifier but part of the claim itself.

**A calibration that must be read together with rows 49 and 78 (added 2026-08-01, row 79).** Route (c) results say "every coding avoiding the small window fails the large window". At **L = 3 that statement is vacuous**: nothing at all avoids the large window at that L, so the finding measures no tension between the two conditions. **S_large(4), S_large(5), S_large(6) are unknown**, so rows 49 (at L=4,5) and 78 (at L=6) are neither known to be vacuous nor known to be informative. Establishing L\* = min{L : S_large(L) > 0} is the prerequisite for reading any route (c) result; L\* ≤ 10 because g₃ avoids all K ≥ 6 (row 6a).

---

## 4. Rejected with certainty — approaches and hypotheses

Measured, not guessed. Full reasoning is in `NEGATIVE_RESULTS.md`; below is
a one-line summary and **what the lesson generalizes to**.

| # | What was rejected | Why, finally |
|---|---|---|
| 1 | Scanning uniform morphisms at k = 7…9 | The maximum length is a logarithm of sample size (row 37). Growth appears even if the mathematics does nothing |
| 2 | The Rauzy graph's SCC as proof of infiniteness | The abelian condition is global, the SCC is local. An excellent pre-filter, zero proof value |
| 3 | Reverse-engineering the record word into a morphism | Complexity grows exponentially (row 42). There is no rule to extract because none exists |
| 4 | "The morphism keeps Parikh imbalance small" | Measured the opposite, and wrong in both senses (row 42) |
| 5 | FORBID4 as a universally lethal rule | Occurs 2,820 times in the record word (row 41). A global ban would make the record impossible |
| 6 | A "Rosetta filter" from the record word's factors | Would reject 88% of legal continuations. Overfitting, a ceiling rather than a springboard |
| 7 | Container relaxation as an additive elimination tool | Did not die at reachable window sizes; cost \|A\|^(2k−1). Elimination is a search question |
| 8 | Extendability table as a record-hunt accelerator | **The same longest word** pruned and unpruned. Branch-and-bound does not bite when the best keeps growing |
| 9 | Net gain from a pruning table in a single run | 1.00×. Building it costs one search; the value is **exclusively** in reuse |
| 10 | A definition-level verifier as an independent checker | Worked flawlessly but **did not reach its own target**. The independence axis was wrong |

**Ideas rejected on structural grounds** (`OPEN_RESEARCH_QUESTIONS.md` D):
hyperbolic Parikh space (loses additivity), spectral gap as a predictor of
morphism *correctness* (the incidence matrix loses letter order), QBF
before a finite criterion (the translation itself **is** the hard content),
"fractional resonance" for Dejean (already proven), SAT backbone for
ternary search (empty by S₃ symmetry), SWAR bit-packing in JS (32-bit
operators; the bottleneck is not there), and holography, Navier–Stokes,
Gödel self-reference, SETI, and quantum entanglement (no codable core).

**Formulations that measure the implementation, not the mathematics**
(`OPEN_RESEARCH_QUESTIONS.md` C): search-tree geometry, phase transitions in
search, a survival function, entropy at depth, "search ecology", words'
"DNA". These are not forbidden as measurements — their **results must not
be presented as properties of the language**.

---

## 5. Retracted claims — what has been claimed and withdrawn

A retracted row is never deleted, so it does not get added again.

| What was claimed | Why retracted | Row |
|---|---|---|
| h₆ is derived from the Hall–Janko group | No support was found | 8 |
| A claim about Gavrilenko's implementation | — | 14 |
| `seam-hpc-cli --mode=p6` audits the construction | It never loaded `morphisms.js` at all and printed a hardcoded zero | 26 |
| A SIAM publication reference for the construction's source paper | **Retraction reversed 2026-07-30:** the reference is correct, corroborated from an independent bibliography (row 58). The reason was "untraced", not "wrong" — which is why it was fixable | 23 |
| The original combined formulation, where the 34 squares and Theorem 9 were in the same claim | Two different claims and two different sources combined; replaced by forms 6a and 6b | 6c |
| Theorem 6 on the first attempt | Was not verified; **properly re-derived later at row 46** | 43 |
| B16 pairs: 8 symmetry classes, max p(16)=6,410,640 (24.5% of all-9) | Computed with a buggy engine (boundary-bigram indexing bug, fixed 2026-08-02, commit 90b7052); correct figures are 6 classes, max 2,852,290 (39.7%) — see row 90/94 | 87 |
| B16 growth-rate: All-9 rate at n=16 is 2.867 | Same engine bug as row 87; correct rate is 2.5818 — no corrected growth-rate analysis has been redone yet | 89 |
| Golden Six and All-9 lack finite Hankel rank up to k=12 | The cited script (`scratch/b16-hankel.js`) never computed the Hankel determinant of either sequence — it ran the test only on a Fibonacci control and on the unrelated S=empty aa2f sequence (row 27/86), not on p_G6(n) or p_All9(n) at all. Found on inspection while repairing unrelated file corruption in the same session | 105 |

---

## 6. Open

**Open problems from the literature** (`OPEN_RESEARCH_QUESTIONS.md` A):
Mäkelä's conjecture K = 2…5 (A1, row 4), the abelian repetition threshold,
partially (A2), Keränen's unfavourable factors with one-sided
extendability (A4, row 38), **additive squares over ℤ (A6, row 53)**.

**The project's own computable questions** (section B): minimality of
FORBID4 (B1), the growth-rate gap (B2), unavoidable sets (B3), Rauzy
structure (B4), route (c)'s next layer (B5), container extensions (B6),
the container's unavoidable factors (B7), the frequency polygon (B8),
**the dichotomy of balanced alphabets (B9)**.

---

## 7. Must not be used — untraced

These have not been opened from a primary source. **Do not cite, do not
build on them, do not enter them in section A** before tracing.

| Claim | Where |
|---|---|
| "5 ≤ g(2) ≤ 734" as Rosenfeld's thesis Problem 4.9 | A5 |
| Walnut's coverage of abelian properties | E4 |
| Freedman attribution: 4 letters, a+d = b+c, bound ≤ 60. **Searched thoroughly 2026-07-30: the name does not appear in the survey at all. Stays banned** | rows 53, 58 |
| A 2025 variation paper on additive squares (arXiv:2506.21200) | row 53 |
| Lietard & Rosenfeld, *Avoidability of additive cubes over alphabets of four numbers* (DLT 2020) — **the nearest neighbour to row 54, unopened** | row 58 |

**Freedman was traced on 2026-07-30 and not found.** The name does not
appear in Fici & Puzynina's survey's text or bibliography, and the number
60 is not in §8.4. The only trace is a search-engine summary with no
identifiable source. **It stays banned.**

The tracing did, however, produce a stronger delimitation than the sought
claim would have (row 58): **affine classification is the field's own
framework**, and **additive cubes over four-number alphabets have already
been treated in their own paper** (Lietard & Rosenfeld, DLT 2020). Row 54's
novelty can therefore only be on the squares side, and this must not be
claimed until that paper is opened. **It is now the critical path's tip.**

---

## 8. Tools and their measured limits

The sanalab machinery exists, and **two of the three most recent tools
each carry the measured limit of their own usefulness written down**. That
is deliberate bookkeeping, not modesty.

| Tool | What it gives | Measured limit | Row |
|---|---|---|---|
| Extendability table | sound pruning, 84–89× on search nodes | building it costs one search; does not help the record hunt at all | 55 |
| Resumable runs | k runs at budget B = one run at budget k·B, down to the node count | — (this is the one that actually helps records) | 56 |
| Table library | one table per affine class, siblings for free | **1.03×** in the demonstration; the saving is the cost of repeated classes, no more | 57 |

**Interpretation:** the marginal benefit of infrastructure is decreasing.
The next step belongs on the mathematics side — see section 7 and
`NEXT_STEP.md`.
