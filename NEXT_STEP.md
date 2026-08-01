# Next Step

**Updated:** 2026-07-31 (B13 run to L≤6, k=6 done, E5 replication — rows 72–77)
**Read first:** `KNOWLEDGE_STATE.md`, `RESEARCH_CONTEXT.md`, `AGENTS.md`.

---

# HANDOFF — 2026-08-01, second round (supersedes the sections below where they conflict)

**Repository state:** tests **41/41**, drift checks **15/15**. Claims ledger
**87 rows**. `origin/main` up to date as of the last commit.

**Session note:** the script behind rows 80/82 was lost between sessions
(interrupted before commit). It was independently reimplemented
(`scripts/parikh-block-filter.js`), validated by reproducing rows 80/82's
exact published figures, then extended to string level
(`scripts/step1_string_level.js`). Both are new files in `scripts/`, not yet
committed. If you are starting a session and these files are missing again,
that is the same failure mode recurring — commit working code before ending
a session, not after.

## The three agreed steps, and where each actually stands

| Step | Status | What it needs |
|---|---|---|
| **1. Pin down L\*** = min{L : S_large(L) > 0} | **L\* narrowed to [5,10]. S_large(4) = 0 (row 83), NOT yet L\*** | S_large(4) is now known empty, exhaustively, with a positive control (row 83). L=5, L=6 are the new open lengths — no attempt has yet been made at either. The row-83 method (Parikh filter + string-level drop oracle) is directly reusable, but the domain size per letter grows fast (compositions of L into 3 parts: 15 at L=4, 21 at L=5, 28 at L=6) and the eliminated-bitset size is D^6, so L=5 (21^6 ≈ 8.6·10^7 matrices) and L=6 (28^6 ≈ 4.8·10^8) need to be measured before assuming the same approach scales — **do not assume it is a small tweak; measure it** |
| **2. Positive control** (A3, k-abelian) | **RESOLVED — PASSES (row 85).** The original k≤6 uniform-ternary scan is now understood to have tested an empty-by-construction space, not left "blocked" | Row 85: h2 applied once to `morphisms.js`'s own g85 (2 iterations, 36,125 symbols) contains **0** 2-abelian squares for K in [2,18000] — exhaustive over that window's entire testable range. Cross-checked against a from-definition checker (3,006 samples, 0 mismatches) and a negative control (69/100 single-symbol perturbations caught). **First time the project's own apparatus has recovered a result known from a primary source to exist.** Does not validate the OTHER scanners (route (c), additive) by association — each uses a different equivalence and code path. **B16 (row 86) has since given the SAME engine used by those scanners its own positive-control-adjacent measurement — see below.** |
| **3. B15** (template impossibility argument) | **CLOSED, answer negative** (row 82) | Done. The general case provably needs the coding strings themselves, so no Parikh-level compression exists. This is a structural closure, not an unfinished measurement |

## What was settled on 2026-08-01, second round

- **Row 83. S_large(4) = 0, exhaustively, both stages sound, partition verified exact.** Row 80's Parikh filter (recomputed: 295,836 surviving profiles / 2,331,710,688 concrete codings, at 6,779 differences) plus a string-level drop oracle over every surviving coding: **0 survivors**, K in [6,100], 21.6 minutes. Four controls: g3 (L=10) passes the identical oracle as required by Theorem 9 (the positive control Step 2 never had); 120/120 single-symbol perturbations of g3 caught; incremental oracle matches a slow reference on 3,000 candidates exactly; stage A reproduces rows 80/82's published figures exactly. **Consequence: row 49's L=4 result is now VACUOUS**, same status row 79 already gave L=3. L\* is bounded to [5,10] (lower bound this row, upper bound row 6a's g3). **Cost lesson:** row 82 estimated this task at 2.45 billion candidates and read it as a wall; violations are found at a mean of 22.5 symbols out of 972 available, so an early-abort incremental check finishes in 21.6 minutes, not the many-hours estimate a full-cost-per-candidate model would predict. Measure the actual per-candidate cost before extrapolating linearly from a naive model.
- **Fixed in the same session: `claims-export.js`'s default output path silently broke in the 2026-07-30 layout move.** It writes to `path.join(__dirname, 'claims.json')`; after the module moved to `src/`, that resolved to `src/claims.json` instead of the root artifact, leaving a stale root `claims.json` (85 rows) diverging silently from the ledger (86 rows) with no test catching it — `index.html`'s embedded block was fine (its resync path doesn't depend on `--out`), only the standalone root file was stale. Fixed to resolve relative to the repo root. **Same class of bug as the `RESEARCH_CONTEXT.md`-lists-the-pipeline drift check catches for code modules — this one had no equivalent guard for output *paths*, only output *content*.** Worth a "does every script's default path still make sense" pass if the layout moves again.
- **Row 86. B16's first measurement, and it repairs Step 2 at the root as intended.** Exact p_S(n) on the bigram-subset lattice, n up to 16, three points: S=empty reproduces row 27's aa2f figures exactly (validated against the SAME `factor-complexity.js`-style DFS engine the project's ~15 exhaustive negatives depend on — not a separate implementation like row 85's); S=all-9 survives exhaustively to n=16 (26,151,102 words), consistent with Theorem 65; the 9 singletons split into exactly two S3-symmetry classes (diagonal {aa,bb,cc}: 1,677,616 vs. the other 6: 1,907,202 — unmeasured before). Monotonicity verified exactly, no violation. **Kill condition checked and does NOT trigger**: a single bigram already gives 8.1x more words than S=empty, the opposite of "indistinguishable from S=empty" — B16 is not degenerate at the bottom of the lattice. **Next for B16:** only 3 of 512 lattice points measured; no minimal antichain identified yet; growth-rate trend (not just raw p(n)) not yet examined.
- **Row 85. Step 2's positive control PASSES, exhaustively over its window.** h2(g85²(a)) (36,125 symbols) contains 0 2-abelian squares for K in [2,18000] (essentially the whole testable range). Cross-checked against a slow from-definition checker (0 mismatches, 3,006 samples) and a negative control (69/100 perturbations caught). This resolves Step 2: the original scan wasn't "blocked", it was testing an empty-by-construction space, and that is now fully explained rather than open. **Not yet done:** no positive control exists for the project's OTHER scanners (route (c) 1-abelian, additive) — each needs its own, since this one doesn't transfer.
- **Row 84. Theorem 65's source traced and opened, both links in the citation chain read directly (not via AI summary or search-engine paraphrase).** Fici & Puzynina (arXiv:2207.09937) Theorem 65 cites [124] = Rao & Rosenfeld, Math. Comput. 85(302):3051 (2016), arXiv:1507.02581. Its Theorem 2: h2 (5-uniform, 4-to-3, images 00021/00111/01121/01221) is (2,2)-abelian-square-free, applied once to an infinite abelian-square-free word over four letters — not iterated as its own fixed point. **Concrete next task for Step 2:** rebuild the positive control around this shape (a 4-to-3 morphism applied once to a known 4-letter source word, e.g. g85, under 2-abelian equivalence) and confirm the project's own scanning apparatus can recover it. **Not yet done.** A separate, previously-conflated citation was caught in the same pass: `LITERATURE_COVERAGE.md`'s "Rao TCS 601 (2015)" is a third, different, still-unopened Rao solo paper — opening it would not have satisfied this task.
- **Also fixed: `RESEARCH_CONTEXT.md` had drifted out of sync with the 2026-07-30/08-01 reorganisation** — three exact-pipeline modules unlisted (caught by `check-claims-drift.js`, was 14/15), `node test.js`/`node check-claims-drift.js` given as root-relative commands when the actual paths are `tests/test.js`/`scripts/check-claims-drift.js` (not caught by any automated check — worth asking whether one should exist), the "eight .md files" and "19 tabs" counts gone stale.

## Carried over from the first 2026-08-01 round

- **Row 79.** S_large(1) = S_large(2) = S_large(3) = 0. At L=3 this makes row 49's result **vacuous** with respect to the conjunction — nothing survives the large half there at all.
- **Row 80.** The Parikh reduction: block-aligned squares with K = mL exist iff M_g·d = 0. Collapses 2.8·10¹¹ strings to 1.14·10⁷ matrices, runs in 24 s, positive control passes (g₃ must survive by Theorem 9, and does). **Saturates**: 7.5× more constraints bought 8%. Predicted in advance from the spectrum.
- **Row 81.** aa2f branching distribution, n = 8…19. Dead ends climb 0 → 9.7%, single-extension 48.3 → 51.4%, mean branching 1.6466 → 1.3965 and still falling. Exact validation: mean at n equals p(n+1)/p(n) at every length.
- **Row 82.** B15 closed. Deciding non-aligned squares needs Ψ(pre_r(g(x))) for every r, and that data determines the strings (81 strings, 81 signatures, 0 collisions at L=4).
- **Graveyard §18, §19, §20** — three externally proposed ideas tested and refuted, each for a measured reason.
- **Finality classification** added to `NEGATIVE_RESULTS.md`: NECESSARY / BOUNDED / CONTEXTUAL. §17 is flagged BOUNDED with a warning that its own text overstates it.
- **Row 30's wording corrected** — the ancestor box does not depend on g.

## Three new research lines, recorded with kill conditions

**B16 — the bigram-subset lattice between 1-abelian and 2-abelian.** 2⁹ = 512
equivalence relations between Mäkelä (open) and Theorem 65 (solved). Monotone,
so the threshold is well-defined. **This is the one I would start with**: it is
a new graded axis, it produces a classification whether or not Mäkelä falls,
and it carries a built-in positive control that Step 2 never had.

**B17 — is the aa2f language regular?** Never tested, and the implication is
sharp: regular ⟹ Mäkelä decidable. The test is a Hankel-rank computation on
the existing p(n) data, exact over ℚ, hours not days, with the container
(known regular) as its control.

**B18 — the bi-infinite core, by iterated trimming.** Strictly stronger than
row 35's one-step dead ends. If the core is ever empty, no bi-infinite aa2f
word exists — a real theorem reachable by exhausted finite computation.
`sft-container.js` already implements the trim.

## Two things carried over, not done

- **README restructuring** is approved in principle and cheap, **but the
  proposed open-problems table would reintroduce the banned Freedman
  attribution** (`KNOWLEDGE_STATE.md` §7: "stays banned"). Remove that row and
  verify Mäkelä's "2002" date before anything goes in.
- **Step 2's literature task**: open the source behind Theorem 65 and find out
  what form the known construction takes.

## What not to do

- A fifth search variant for L=4. Four have been tried; §14 forbids the rest.
- The "send a key without sending it" idea: if the continuation is
  deterministic from the prefix, **the prefix is the secret** — 1,697
  characters sent to obtain 2,107 is 20% compression, not encryption. And
  "any program gives the same result" is false: the determinism observed is a
  property of one dictionary and one search order, not of the mathematics.
- More ideas before one of B16–B18 is done. Thirteen were evaluated on
  2026-08-01; two were kept. Ideas are not the bottleneck.

---

# HANDOFF TO THE NEXT SESSION

**Repository state:** tests **41/41**, drift checks **15/15**.
Claims ledger **82 rows**. Working tree clean. No critical open thread.
`origin/main` up to date.

## READ THIS FIRST — route (c)'s interpretation changed on 2026-08-01 (row 79)

Route (c) has always been run in one direction: find codings avoiding
K ∈ [2,5], then test whether any also avoids K ≥ 6. The **complementary**
question — how many codings avoid the large periods *at all*, ignoring the
small window — was never asked until now. Measured exhaustively:
**S_large(1) = S_large(2) = S_large(3) = 0.**

**Consequence:** at L=3, row 49's result ("all 35 small-window survivors
die at large K") measures nothing about the tension between the two
windows, because nothing whatsoever survives the large half at that L.
**S_large(4), S_large(5), S_large(6) are unknown** — L=4 hit the budget
wall twice (50 billion symbols at K ∈ [6,40]; 10 billion at K ∈ [6,20];
narrowing the K range did not help, the bottleneck is the branching
factor, 81 images per letter at L=4 against 27 at L=3).

**So rows 49 (L=4,5) and 78 (L=6) are neither known to be vacuous nor
known to be informative.** That is a worse position than those rows
appeared to be in, and it is the single most important open thread.
The prerequisite for reading any route (c) result is
**L\* = min{ L : S_large(L) > 0 }**, and L\* ≤ 10 because g₃ avoids all
K ≥ 6 (row 6a). Do not extend route (c) to larger L, and do not run the
graded-threshold question (B14), before L\* is pinned down.

**Also completed 2026-08-01 (rows 78–79):** the full L=6 escalation — all
**200,106** canonical codings avoiding K ∈ [2,5] were tested against
K ∈ [6,100], and **all 200,106 die**, latest first-violation at symbol 71.
In block units the latest death is 12.0 / 9.3 / 8.8 / 11.8 blocks for
L = 3/4/5/6 — essentially constant, so the failure is a local seam
phenomenon that does not get harder to hit as L grows.

**One hypothesis of that session was tested and failed** (`NEGATIVE_RESULTS.md`
§18): Proposition 9's Condition 2 was proposed as the algebraic reason for
S_large's emptiness, which would have replaced search with linear algebra.
It holds for 69–85% of block types at L = 1,2,3 while S_large is empty at
all three — it is nearly orthogonal to whether a coding works. The useful
by-product: nobody had measured how restrictive Condition 2 is, and the
answer is "barely at all", so if a survivor is ever found the Proposition 9
machinery will very probably apply to it.

## B13 run — the last untried structural idea (row 77)

The auxiliary-alphabet route, the form that *worked* on the abelian side
(h₆→g₃), was run as an additive analogue: uniform codings g: {a..f} →
{0,1,2,5}^L applied to h₆^ω(a), with the condition additive squares at
all K ≥ 1. **L = 1…6 exhaustively, zero survivors at every level.** Work
at L=6: 10.38 billion symbols, 302.6s. Module
`h6-additive-image-sweep.js`, test 41.

**Why this matters, and why it still does not close B13:**
it was the only remaining, structurally justified, untried idea, and it
went one L further than the abelian original (row 49, L ≤ 5).
**But it tested something different from what B13's kill condition
literally describes:** the kill condition concerns varying the
**auxiliary alphabet's size** m (5 → 6); here m was held fixed (h₆) and
the **coding length** L was varied instead. That is `h6-image-sweep.js`'s
own structure transferred, not a test of the kill condition.

**The next deepening must be named structurally, not by increasing L.**
What remains open: varying m (5, 7, 8 — requires a new auxiliary
morphism, which does not exist), non-uniform codings, and alphabets other
than {0,1,2,5}. Simply running L=7 (~90–120 billion symbols, ~50–70 min
estimated) would repeat the same experiment at a larger budget — exactly
what `NEGATIVE_RESULTS.md` §14 forbids.

## Start here (copy verbatim into a new session)

> *"Read `RESEARCH_CONTEXT.md` and `AGENTS.md` before changing anything,
> then `NEXT_STEP.md`'s handoff section in full. Do not write to
> `MATH_CLAIMS.md` without my approval (rule 5)."*

**Three things the new session needs to know immediately:**

1. **Rule 1 fails most often in practice.** In this session, two
   morphisms (β, δ=γ²) were logged in the claims ledger, with matrices,
   that **do not appear in the source at all** — they came from a
   second-hand paraphrase that was not opened firsthand. Corrected before
   anything was built on it, but it made it into the ledger. **Open the
   source yourself, even when it looks certain.**
2. **Tools can lie quietly.** WebFetch summarizes with AI and dropped
   exactly the details where the error was; the correct code was only
   obtained via raw `curl`. If a detail is decisive, fetch it raw.
3. **A matching result is not proof of correctness.** In E5 there were
   two PowerShell bugs (`$V`/`$v` and `$E`/`$e` are the same variable —
   names are not case-sensitive), which zeroed out the entire
   computation. They were found only because the result was absurd. Test
   with a hand-checkable mini-example **before** trusting a large run.

## This session's most important result (rows 74–75)

**A decision procedure for the additive condition is now implemented,
validated on FIVE known cases, and run on real data for the first time
(row 75).** `additive-affine-decision.js` is a line-by-line port of the
reference implementation
(`github.com/lgmol/Additive-Powers-Decision-Algorithm`), not an
independent derivation.

**Result:** all **221,296** affine, clean, k=5-uniform morphisms across
the six alphabets from rows 67–69 ({0,1,2,5}, {0,1,6,8}, {0,3,4,8},
{0,2,4,7}, {0,1,2,6}, {0,2,5,8}) **DECIDED** (not prefix-cap-based
evidence — an actual Theorem 2.4 decision), **0 survivors**. k=5 is the
first time the project reaches territory that brute force
(`additive-morphism-scan.js`, up to k=4) never covered — the result is
therefore genuinely new information, not a repeat.

**Two mistakes that arose and were corrected during the same session,
logged because they are instructive:**
1. Row 73's original version named "β" and "δ=γ²" as validation examples,
   with matrices — these do not appear in the source in any form; they
   came from a second-hand paraphrase that was not checked firsthand
   before being logged. Corrected before anything was built on it.
2. Row 75's first version wrote the absolute-value notation `\|d\|` in a
   JavaScript string literal as `'\|'`, which drops the backslash (not a
   recognized escape sequence) — the file ended up with a bare `|d|`,
   two unescaped pipe characters, which broke `claims-export.js`'s row
   parser (`node test.js` caught this immediately, 38/39). Fixed by
   writing the replacement into a separate text file instead of a JS
   string.

## k=6 DONE (2026-07-31) — and the cost estimate was wrong twice

**Result:** {0,1,2,5}, all **4,976,088** affine k=6 morphisms decided,
**0 survivors**, 30,607.8s (**8.5h**), 6.15 ms/candidate. Logged at row
75.

**The cost estimate was wrong twice, and that is itself a lesson:**
first 2.8 ms/candidate (extrapolated from k=5 — wrong), then 5.6
ms/candidate (measured on a 500-item sample at k=6 — still too low, the
true value is 6.15). **A sample did not predict the full run even at the
same k.** Do not promise a runtime from a sample; say "measured on a
sample, the true value may be larger".

**Coverage right now, precisely:**

| k | What is covered | How |
|---|---|---|
| ≤ 4 | **all** morphisms, 20 alphabet classes | brute force (rows 67–69) |
| 5 | **affine only**, 6 alphabets, 221,296 total | decision procedure (row 75) |
| 6 | **affine only**, 1 alphabet, 4,976,088 total | decision procedure (row 75) |

k=5 and k=6 cover only the affine subclass (0.006–0.021% of the space,
row 73). **That is not the same thing as "k=5 and k=6 are closed."**

k=7 (~214M candidates, ≥ 15 days at the current rate) is not sensible
without parallelization or profiling `mainPure`'s ancestor computation.

## THE PLAN — three steps, agreed with the maintainer 2026-08-01

Do these in this order. Everything below this section is older and is
superseded wherever it conflicts.

**STEP 1. Pin down L\* = min{ L : S_large(L) > 0 }. SUPERSEDED — see the "second round" handoff at the top of this file: S_large(4) = 0 is now settled (row 83). The history below (three failed attempts, then the algebraic route) is kept for how the answer was reached; do not read it as the current status.**

*Why first:* every route (c) result's interpretation depends on this one
number, including rows 49, 78 and 79 themselves.

*What was tried and what happened, so the next session does not repeat it:*
1. Raw DFS, K ∈ [6,40]: aborted at 50 billion symbols, 1,981s.
2. Raw DFS, K ∈ [6,20]: aborted at 10 billion symbols, 381s. Narrowing the
   K range barely changed the rate (~25-26M symbols/s both times) — the
   bottleneck is the branching factor (81 unfiltered images per letter at
   L=4 vs 27 at L=3), not the cost of the K check.
3. **Bounded-K_max CSP** (the locality idea below, implemented in
   `scratch/s_large_csp.js`): validated as CORRECT at L=3 (its Kmax=6
   result cross-checked against `directScan` on the full [6,40] range,
   consistent) and gave a real, fast answer there (295,854 raw solutions,
   117s). At **L=4 it found 0 solutions after 32 million nodes and 97s,
   with no sign of finishing** — level-count telemetry showed the last
   variable's backtrack function entered 380,862 times with zero
   completions. This does not mean S_large(4) is empty; it means neither
   "empty" nor "non-empty" is known yet at reasonable cost. Killed rather
   than left to run unbounded and unmeasured.

*Diagnosis:* three different attacks on the same L have now failed to
produce an answer either way. That is itself the signal from `NEGATIVE_RESULTS.md`
§1/§14's own standard: raising the budget a fourth time without a new idea
is exactly what those sections forbid.

*What a real next idea would need to do, since simple domain enumeration
does not close this:* either (a) filter the length-4 block domain by some
sound necessary condition analogous to the small-window "clean block"
trick — none is known yet, since a single length-4 block cannot itself
contain a K≥6 violation, so there is nothing local to filter on that
basis; or (b) attack it algebraically instead of by search, e.g. via
`decision-preconditions.js`'s machinery generalized appropriately, rather
than another combinatorial search variant.

**FOURTH ATTEMPT, 2026-08-01 — algebraic, and it is the first that completes (row 80).** The Parikh-level reduction: a block-aligned square with K = mL exists iff M_g·d = 0. This collapses 2.8e11 strings to 1.14e7 matrices at L=4 and runs in 24 s. Its positive control is strong (g3 must survive by Theorem 9, and does). **But it saturates:** 903 differences leave 320,352 survivors, 6,779 differences leave 295,836 — a 7.5x increase in constraints buys 8%. The saturation was predicted from the spectrum: on V = {sum 0} the spectrum of M_h is {+-sqrt(3),0,0,0}, so large-m differences converge into a 2-dimensional subspace and stop discriminating. **L* is still unpinned, but the search space for the remaining difficulty is now identified: short and non-block-aligned configurations, which no Parikh-level method can reach by construction.** A fifth attempt must therefore be string-level but seeded by the 295,836 surviving profiles, or must abandon the block-aligned framing entirely.

*Standing kill condition:* do not attempt a fourth search-based approach
to L=4 without first identifying, on paper, what makes it different from
the three that already failed.

**STEP 2. Build the positive control (A3, the k-abelian case). STARTED 2026-08-01 — and the design has a flaw that must be fixed before the result means anything.**

*What was run:* `morphism-scan.js`'s exact structure with the equivalence
relation swapped from 1-abelian to 2-abelian, exhaustive over uniform
ternary morphisms k = 1..6. Its own controls passed first: a fast
incremental 2-abelian checker cross-checked against a slow definitional
one on 500 random words (identical verdicts), plus a negative control
(literally identical adjacent blocks correctly caught).

*Result:* **no survivor reached the prefix cap of 400 at any k ≤ 6.** The
longest surviving prefix grows 1 → 17 → 34 → 39 → 71 → 149 for
k = 1..6, roughly doubling per k. k=7 was started and had not finished.

***The flaw, stated plainly:*** Fici & Puzynina's Theorem 65 guarantees
that an infinite ternary word avoiding 2-abelian squares of period ≥ 2
**exists**. It does *not* say that word is the fixed point of a small
uniform ternary morphism. **So a negative result here does not indict the
apparatus** — the known solution may simply live outside the space being
searched (non-uniform, or a morphic image, or a projection from a larger
alphabet), exactly as the 1-abelian solution does (g₃ ∘ h₆, row 49).
As designed, this control cannot distinguish "the apparatus is broken"
from "the target is not in this search space", which is the one thing it
was supposed to do.

*What must happen before Step 2 is worth anything:* **open the source for
Theorem 65 and find out what form the known construction actually takes.**
If it is a uniform ternary morphism fixed point with small k, this control
is valid and its negative result is alarming. If it is anything else, the
control must be rebuilt to search the space the known solution actually
occupies. This is a literature task, not a compute task, and it is cheap.
Also note the prefix-growth figures above are the kind of statistic
`MATH_CLAIMS.md` row 37 warns about (max over a growing sample) — do not
read the doubling as structural without the sample-size correction.
*Why second, and why it is now risk management rather than a nicety:* the
project has produced ~15 exhaustive negatives and **not one case where the
apparatus is known to find something that exists**. A buggy search fails
silently in exactly one direction — it produces false negatives, never
false positives, because a false positive would have to construct an
object that then fails independent verification. Fici & Puzynina's
Theorem 65 gives a ternary case with a known positive answer (2-abelian
squares of period ≥ 2 are avoidable). Run the existing scanners with that
equivalence relation and require them to find it.
*Kill condition:* if the apparatus cannot recover the known solution, every
prior negative is suspect and that becomes the top priority instead.
*Standing rule proposed with this step:* no new exhaustive-negative claim
is logged without a positive control at comparable scale, on the same
footing as `node test.js` before a commit.

**STEP 3. Settle B15's correctness question on paper.**
*Why third:* it is the only route on the board that aims at a theorem
rather than another sweep, and it costs hours, not compute. The question:
rows 30–31's ancestor closure was computed **for the pair (h₆, g₃)**, and
Proposition 5/6's bounds involve M_g — so it is not established that the
same 116,578 templates apply to any other coding. Either derive a closure
valid uniformly over all g with |g(x)| = L, or show the closure is
g-independent. **If neither holds, B15 is dead and nothing gets built.**

**Not to be done before Step 1:** extending route (c) to larger L, and
B14's graded threshold question. Both produce results whose interpretation
is unavailable until L\* is known.

## NEXT — a recommendation with reasoning (2026-07-31)

The older priority lists below are history; this replaces them.

**1. The remaining five alphabets at k=6 — NOT first, and here is why.**
That is ~42h of computation to produce five more instances of the same
negative result. `NEGATIVE_RESULTS.md` §14's kill condition has already
triggered twice; a sixth identical negative changes no decision. **Do
this only if some other reason requires coverage** (e.g. publication),
not out of curiosity.

**2. ~~B13, the auxiliary-alphabet route~~ — RUN 2026-07-31, see above and
row 77.** Exhaustive and negative for L ≤ 6. This was the previous
handoff's top recommendation, and it has now been used. **What this
teaches for the work order:** the hypothesis "the search space is the
wrong shape" found no support in the form that was cheapest to test. It
does not refute the hypothesis — varying m and non-uniform codings are
still open — but **the next idea must name what structural thing
changes**, not merely increase some parameter.

**3. Cheap and valuable: extending E5.** Four figures replicated (row
76), and it cost part of one session. Next targets: row 6b (34 squares —
requires h₆'s and g₃'s tables **from the primary source**, not from
`morphisms.js`) and row 33 (the growth-rate upper bound). Each one raises
the whole ledger's credibility.

**4. Finishing the `claims.json` wiring.** 10 bindings done, dozens of
hand-written figures remain (`UI_UX_PLAN.md` item 1 lists which). The
wiring immediately revealed two wrong status badges — the rest will
likely reveal more.

**5. `FINDINGS.md`** — the maintainer has approved the idea, but it
deliberately waits for item 4: a hand-written results document before the
`claims.json` wiring would be exactly the failure mode the whole wiring
effort fixes.

## Open question for the maintainer: the claims ledger's language

Rule 8 says **new ledger rows are written in English**. Rows 69–75 were
nonetheless written in Finnish (for consistency with existing rows), row
76 in English. **This is now inconsistent.** Two options, a maintainer
decision: (a) new rows in English from now on, and old ones translated
as they are touched anyway (= rule 8 literally), or (b) rule 8 is changed
to match practice. **Do not resolve this yourself.**

## Previously done (rows 69–71)

1. **The 4→4 morphism form is closed across the entire unbalanced range
   (row 69).** In addition to row 68's four alphabets, the remaining
   **16** were run, totaling **1,867,272,192 morphisms**, 192/192
   profiles each, zero skipped. All negative. **`NEGATIVE_RESULTS.md`
   §14's kill condition has now triggered on 20/20 classes** — the same
   search will not be deepened without a new structural idea.
2. **Five letters are ~2 orders of magnitude cheaper (row 70)**, and two
   restrictions turned out to be choices: `additive-sweep.js` already
   supports more letters (the parameter has never been turned), and span
   ≤ 8 leaves half the classes unswept even with four letters (31/62).
3. **B11's pre-measurement (row 71): the abelian carrying property is an
   additive obstruction.** Identical Parikh vectors across images carry
   Keränen's g₈₅ but kill an additive morphism immediately. This had not
   been logged before.
4. **Entity fix + widened guard.** 51 double-escaped and 21 fabricated
   `&subN;` pseudo-entities appeared literally on the page; the guard
   reported 15/15 the whole time, because `#` is not in `[a-zA-Z]`.

## Next step: do NOT build B11 — it exists, published (rows 72–73)

The decision procedure was found in the literature mid-session.
**Theorem 2.4** (Currie, Mol, Rampersad & Shallit, arXiv:2111.07857,
quoted and verified from Andrade & Mol's arXiv:2408.15390) solves additive
k-power-freeness for **affine** morphisms, and the implementation is the
paper's own: `github.com/lgmol/Additive-Powers-Decision-Algorithm`.

**What follows from this, and what does not:**

- **Eligibility measured (row 73):** 0.006–0.021% of the uniform space is
  affine. The narrowness is a benefit: at k=16 the whole space is
  8.82·10¹¹ but the affine class is 10–60 million — **the same order of
  magnitude row 69's sweep already achieved at a much smaller k.** This
  is the scalability B12 needed.
- **Nothing has been decided.** Row 73 is an eligibility sieve, not a
  decision result. The decision algorithm **has not been implemented in
  this project at all**, and it is not reuse of
  `decide-realizability.js` — the source itself states that γ does not
  satisfy Rao & Rosenfeld's conditions (an eigenvalue of exactly 1).

**Starting point, in this order:**

1. **Implement the CMRS algorithm and validate it against the repo's five
   own case studies** (Dekking 1979, Currie & Aberkane 2009, Andrade &
   Mol Prop. 3.1/4.1, CMRS 2021 — the morphisms at row 73). **Not β/δ —
   that was an incorrect second-hand reference logged on 2026-07-30,
   corrected before anything was run on it.** Kill condition: if it does
   not reproduce these five, stop. Cheap and fast; saves a wasted k=16
   run with the wrong code.
2. Only then run the affine class at increasing k.
3. B12 (five letters, span ≤ 10) afterward or alongside.

**Two delimitations that must be kept visible:**

- **An exhaustive negative result for the affine class is a precise
  result about that class, not the whole space.** The same calibration as
  rows 67–69.
- **The additive line is a parallel research line, not a bridge to
  Mäkelä.** Additive avoidance is stricter than abelian, but the
  implication lands on already-solved ground (Keränen 1992, row 3).
  Mäkelä is a different condition.

## Source hygiene: one concrete warning

In this session, quotes from Brown & Freedman 1987 were offered for
logging **with source links pointing to finlex.fi** — Finland's Supreme
Court precedent database. The claims were correct in substance (they
match row 66, which had already been verified earlier), **but not on the
strength of that source.** `NEGATIVE_RESULTS.md` §11 already logged this
failure mode once. It recurred. Check the source, not just the claim.

## What was done in this session (in full, across several handoff rounds)

Claims ledger rows **58–68**, graveyard items **11–14** (now 14/14 also
shown on `index.html`'s "The Graveyard" tab, Trap 1–14). New modules:
`additive-sweep.js`, `extension-table.js`, `sanalab-run.js`,
`table-library.js`, `unavoidable-factors.js`, `claims-export.js`,
`additive-morphism-scan.js`, `additive-nonuniform-morphism-scan.js`. New
documents: `KNOWLEDGE_STATE.md`, `LITERATURE_COVERAGE.md`, `README.md`,
`poster.html`, `docs/plans/LAB_VISION_2035.md`.

**Main results:**

1. **The additive alphabet sweep** (row 54): 11 of 31 affine classes
   resolved exhaustively. **The delimitation was sharpened at rows
   65–66:** balanced classes are covered by Brown & Freedman 1987 /
   Freedman 2013+ (bound **61**, verified directly from arXiv:1304.1829's
   full text — not another model's summary). Ten balanced results are
   therefore a replication. **Only {0,1,2,4} (unbalanced, longest 62)
   falls outside the literature.** The novelty lives in the **unbalanced**
   classes (20 open).
2. **Uniform and non-uniform morphism search for additive squares**
   (rows 67–68): both exhaustive and **negative** across several
   unbalanced alphabets — including Cassaigne's cube construction's
   length profile (2,2,1,2). Not yet a solution to Question 3
   ("is there any finite ℤ-alphabet over which additive squares are
   avoidable", open at least since 1987), but the search space has now
   been mapped up to length 4 with four alphabets.
3. **The container is loose, measured three times over** (rows 51, 52,
   62): the frequency interval is too wide, it does not tighten as the
   window grows, and no factor of length ≥ 2 is unavoidable. **Do not
   look for more necessary conditions in the container.**
4. **Resumable runs work** (rows 56, 64): {0,1,6,8}'s verified lower
   bound of **244**, assembled from nine chained runs.
5. **The claims ledger is machine-readable** (row 61): only figures in
   the `QUOTABLE_FACTS` block are publishable (`claims-export.js` →
   `claims.json`).
6. **Row 23's DOI was fabricated** — `10.1137/16M1087493` does not exist,
   the correct one is `10.1137/17M1149377`.

## Four rules learned the hard way in this session

- **§11:** a search-engine summary is noise until it has been located in
  an openable document. Marking it "untraced" does not stop the claim
  from **steering the work order**, and that is the costly effect.
- **§12:** a technique borrowed from the literature is tested **first in
  the setting it comes from**. Up-and-Down looked useless for squares;
  for cubes it gave +1130%.
- **§13:** corroboration covers only **the fields compared**. Four
  correct fields out of five felt like confirmation; the unchecked DOI
  did not exist.
- **§14:** the shape of the budget curve (leveling off vs. accelerating)
  is too noisy to predict which search line is worth deepening — it was
  not used for prioritization.

## An open side note, not critical

**Authorship of Freedman's INTEGERS paper** (row 66): the bound of 61 is
strong and attributed to Freedman (2013+), but whether the paper is his
alone or joint with Brown is open (Semantic Scholar gave a conflicting
hint, HTTP 429 blocked verification twice). Does not affect any
mathematical conclusion — only finishing the source citation.

## Next steps, prioritized (not a queue, pick one)

1. **Non-uniform morphism search with wider coverage** — maxlen > 4
   (cost grows fast, **measure first**) or the remaining 16 unbalanced
   classes not yet tested. **A kill condition is set (§14): no signal
   without a new structural idea — do not continue with just a deeper
   version of the same search.**
2. **Deepening lower bounds for the unbalanced classes** — a diagnostic
   run (2026-07-30, scratchpad) showed that all 20 open classes are still
   growing at 10⁸ nodes and do not level off, unlike the 10 balanced
   classes which all terminated under 10M nodes. **This proves nothing**
   (the same trap as `NEGATIVE_RESULTS.md` §1–2) — it only says that
   blind DFS does not solve these, and item 1 is therefore a better use
   of computation than more brute-force search.
3. **Non-uniform morphisms more generally** — `LITERATURE_COVERAGE.md`
   row 6: not done here and not found in the literature (also concerns
   aa2f).
4. `index.html` → `claims.json` (`docs/plans/UI_UX_PLAN.md` item 1).
5. *(Low-priority housekeeping, not research):* opening Freedman's own
   INTEGERS paper to finish the authorship question — does not change any
   mathematical conclusion, only the source citation.

## What is NOT worth doing

- Extending the container analysis (measured loose three times over)
- Up-and-Down for the aa2f search (§12)
- Pruning tables for the record hunt (§8)
- More infrastructure before items 1–3 are done. Rows 55–57 are tools,
  two of which carry the measured limit of their own usefulness written
  down; that is a sign of decreasing marginal benefit

---

## History (condensed — details in the claims ledger and the graveyard)

The following is **superseded** by the handoff section above wherever
they conflict (e.g. Lietard's thesis was opened later in the same
session, and row 23 was corrected to `PRIMARY` status). Kept only for
chronology and reasoning.

- **Route (c), container analysis K∈[2,5]/[2,6], the research-architect
  protocol** (rows 49–53): done and committed.
- **The DLT 2020 paper opened** and verified (row 63): concerns cubes,
  states the square question as open, contains no alphabet
  classification for squares.
- **Lietard's thesis was opened later** (row 65) — found Brown &
  Freedman 1987 as the primary source and two conflicting claim forms
  (50 vs. 61). Resolved at row 66: 61 is correct, verified from the
  primary source.
- **Row 23's DOI was fabricated**, `10.1137/16M1087493` → 404 on
  Crossref; corrected to `10.1137/17M1149377` and the status raised to
  `PRIMARY` (previously incorrectly `REJECTED`). Logged in the graveyard
  §13.
- **{0,1,6,8}: lower bound 244** (row 64), nine chained runs.

### Open decisions belonging to the maintainer (still relevant)

1. **Git history.** Five record-word files and `papers/Keranen.pdf` were
   accidentally committed and removed from tracking, but they are still
   in history and pushed. Removal requires a force-push over published
   history
2. **Nine copyrighted papers in the `papers/` folder** are in the public
   GitHub repository, committed before this session

### Reminder

**Eleven times** in this work a plausible generalization turned out to be
wrong only once it was run: M_g's surjectivity, M_h's diagonalizability,
p(n)'s constant slope, the kernel's dimension, the test data's "abelian
square", double-escaped HTML entities, TeX leftovers, the missing
Cassaigne hypothesis, the scanner's too-weak condition, Parikh
imbalance's discriminating power, and `ancestor-box.js`'s unjustified
`x0IsZero` branch.

None of them would have failed a visual inspection. **Run everything,
compare against HEAD, and do not trust the comment.**
