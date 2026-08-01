# RESEARCH_CONTEXT.md — read this first

**Updated:** 2026-07-29
**Purpose:** a single entry point for a new session or a new contributor.

> **This file is a router, not a copy.** It does not repeat the content of
> any other file. If a claim or figure appears here and in `MATH_CLAIMS.md`,
> **the ledger always wins** — two sources of truth is exactly the failure
> mode this project has repeatedly had to correct. Add only pointers here.

Start a new session like this:

> *"Lue RESEARCH_CONTEXT.md ja AGENTS.md ennen kuin muutat mitään."*
> *(kept in Finnish: the literal prompt the maintainer copy-pastes to start a session — AGENTS.md rule 8 governs the recorded trail, not the interaction)*

---

## 1. What this project is

An experimental combinatorics laboratory for abelian-square-free words. Two
sides:

- **Browser app** `index.html` (19 tabs, no dependencies) — teaching and
  visualization. It **reports** results, it does not compute them.
- **Exact Node pipeline** (below) — all the mathematics. Rational and
  ℚ(√3) arithmetic, no floating point on result paths.

The main goal is **Mäkelä's conjecture**: does there exist an infinite
ternary word whose only abelian squares are `00`, `11`, `22`? Open for
half-lengths K = 2…5.

### The second goal, stated explicitly because it is easy to mistake for a by-product

This project is also, deliberately, an experiment in **how a human and an
AI can do mathematical research together without fooling themselves.**
That is not decoration on top of the mathematics — it is why the claims
ledger has two verification levels, why `NEGATIVE_RESULTS.md` exists at
all, and why kill conditions are written down *before* a computation runs
rather than after it disappoints.

The findings from that side are recorded in the same evidence-first way as
the mathematical ones, and several are non-obvious:

- **A buggy search fails asymmetrically.** It produces false *negatives*,
  almost never false positives: a false positive would have to construct
  an object that then fails independent verification, whereas a false
  negative only has to skip part of the space silently. A project whose
  output is overwhelmingly negative results is therefore exposed in
  exactly one direction — hence the standing requirement for positive
  controls (`NEXT_STEP.md` Step 2).
- **An AI proposes plausible ideas far faster than it can check them.**
  `NEGATIVE_RESULTS.md` §15 records the pattern: the same underlying
  error returns under new names until someone states the kill condition
  in advance. §11 records the same failure for sources.
- **Calibrated language is a safety mechanism, not politeness.** "No
  violation found in window [a,b]" cannot be over-marketed; "proven
  impossible" can. §17 is the worked example of what happens when the
  wording outruns the evidence — and §19 of what happens when a real
  number is given a wrong interpretation.
- **The most valuable move is often subtraction.** On 2026-08-01 the
  session's net result was to *reduce* confidence in the project's own
  earlier work (row 79), which is a better outcome than another
  measurement nobody knows how to read.

Anyone reproducing this project's methodology should read `AGENTS.md`
first, then `NEGATIVE_RESULTS.md` — in that order. The protocol is the
transferable part.

---

## 2. Read these, in this order

| # | File | What it is the authority for |
|---|---|---|
| 0 | **`KNOWLEDGE_STATE.md`** | **Snapshot: what is known, what is provably closed, what has been rejected with certainty, what is open, what must not be used.** A derived index — the ledger always wins. The fastest way to get the full picture |
| 1 | **`AGENTS.md`** / `CLAUDE.md` | The claims protocol. **Mandatory.** Cite before code, two verification levels, language calibration, human approval before commit when claims change |
| 2 | **`MATH_CLAIMS.md`** | **The sole authority for every mathematical claim.** 84 rows. No claim may appear anywhere without a row here |
| 3 | **`OPEN_RESEARCH_QUESTIONS.md`** | Open problems, in three parts: A literature (with sources), B the project's own computable questions, **C formulations that measure the implementation, not the mathematics**. D is a rejection register with reasons |
| 4 | **`NEXT_STEP.md`** | Where to continue and why. What is not worth doing |
| 5 | `docs/plans/PROJECT_ARCHITECTURE.md` | The app's structure, tab routing |
| 6 | `NEGATIVE_RESULTS.md` | What has been tried and did not work |
| 7 | **`LITERATURE_COVERAGE.md`** | **What the literature covers and what it does not, and which search space has been swept.** Read before building a new computation line — it prevents redoing the same work |
| 8 | `docs/plans/RESEARCH_ARCHITECT.md` | **Only when producing new research ideas.** Procedure, constraints, output format and rubric — ideas are not produced as free prose |

**The root has exactly the eight `.md` files a session actually reads.**
Everything else was moved out on 2026-07-30:

- `docs/historical/` — **outdated planning papers**
  (`GRAND_VISION_MAP`, `COMPUTATIONAL_DISCOVERY_LAB_PLAN`, `SEAM_ENGINE_…`,
  `AA2FR_*`, `NEXT_AGENT`, `DEVELOPMENT_ROADMAP`, …). They contain
  outdated plans and partly-corrected citations. **Do not rely on them
  without checking the claim in `MATH_CLAIMS.md`.** The folder name makes
  that warning structural, not just prose
- `docs/plans/` — **living plans**: `SANALAB_PLAN`, `UI_UX_PLAN`,
  `SKILLS_PLAN`, `RESEARCH_ARCHITECT`, `PROJECT_ARCHITECTURE`
- `papers/` (formerly `latest/`) — literature, gitignored
- `datasets/` — record words, gitignored. The code looks them up via
  `word-anatomy.js`'s `resolveDataFile()`, which also checks the root, so
  an old clone still works

**The exact pipeline stays in the root** (section 3). It has not been split
into subfolders like `search/`, `constraints/`, `analytics/` or similar:
that would be guessing at interfaces that are not yet known, and it is the
same mistake the `ConstraintEvaluator` ban and `SANALAB_PLAN.md`'s
principle 4 already reject. Every module verifies itself; a split is
earned when something actually forces it.

---

## 3. The exact pipeline

Every module **verifies itself and throws an exception** rather than
returning an incorrect result.

```
perron-frobenius.js        spectrum, Perron vector, characteristic polynomial
smith-normal-form.js       Smith normal form, integer lattices
jordan-decomposition.js    Q(sqrt3), Jordan form
decision-preconditions.js  Proposition 9's hypotheses
proposition5-bounds.js     bounds on the contracting side
ancestor-box.js            Prop 5 + Prop 6, finite box
get-parents.js             Par_h and Anc_h
decide-realizability.js    Prop 8 -> Theorem 4
proposition11-targets.js   Prop 11's target set
decide-phi-squares.js      Prop 8 modulo Phi -> Theorem 6
factor-frequencies.js      complete factor sets, exact densities
factor-complexity.js       p(n), tight growth-rate upper bounds
rauzy-graph.js             Rauzy graphs, special factors, dead ends
morphism-scan.js           exhaustive search of small morphisms (route a: fixed points)
word-anatomy.js            record-word verification and anatomy
unfavourable-factors.js    Keranen 2006: unfavourable factors, extendability depth
h6-image-sweep.js          route c: uniform images of h6's fixed point to a 3-letter alphabet, L<=5
sft-container.js           K in [2,5] container language: de Bruijn graph, SCC, frequency bounds
additive-sweep.js          additive squares: alphabet sweep by affine class
extension-table.js         extendability-depth tables: sound pruning oracle, transfers affinely
sanalab-run.js             resumable certified runs: checkpoints, three end states
table-library.js           table library: one table per affine class, checksum and provenance
claims-export.js           ledger made machine-readable; only figures traceable to the ledger may be published; also syncs index.html's embedded claims-data block
unavoidable-factors.js     the container's unavoidable factors: what every certificate must contain
additive-morphism-scan.js  additive squares: exhaustive search of uniform morphisms, k<=4
additive-nonuniform-morphism-scan.js  same, non-uniform length profiles 1..4, regression to uniform
additive-affine-decision.js  decision procedure for affine morphisms (Theorem 2.4, row 72), ported and validated
h6-additive-image-sweep.js  B13: additive analogue of route (c); h6 fixed, uniform codings of length L, all K>=1 (row 77)
```

**Verification:**

```bash
node test.js                 # 41/41
node check-claims-drift.js   # 15/15
```

Run **both** before a commit and **read both outputs**. They are different
things: `test.js` tests the mathematics, `check-claims-drift.js` guards
claims, citations, and UI text.

---

## 4. What has been achieved

Details are in `MATH_CLAIMS.md`; here just the landmarks:

- **Theorem 4 and Theorem 6 re-derived** with the full Rao & Rosenfeld
  decision procedure (rows 32, 46). Both are *re-derivations using the
  factor machinery*, not independent proofs
- Exact factor densities, factor complexity, and tight growth-rate upper
  bounds (rows 17–20, 27, 28, 33)
- Rauzy graphs and dead-end factors (rows 34, 35)
- Record words verified for the first time; FORBID4 turned out to be a
  heuristic (rows 40–42)
- **Unfavourable factors proven to exist** with four letters,
  the first at length 8 (row 47). Keränen's own question is still open
- **Route (c) swept exhaustively at small L:** no uniform map
  Σ₆→Σ₃^L, L ≤ 5, produces a Mäkelä word from h₆^ω(a); the small- and
  large-period requirements pull against each other (row 49)
- **Container languages K ∈ [2,5] and K ∈ [2,6] analysed exactly:** one SCC
  in each, every letter's frequency necessarily in [1/11, 3/4], no
  binary tail — and the interval is stable when the window grows 5 → 6
  even though the language strictly shrinks (rows 51, 52)
- **Additive squares opened as a second research target** (a sourced open
  problem, row 53 — and the parent problem of the project's own core
  source): the alphabet sweep resolves 11 of 31 affine classes, balanced
  alphabets separate cleanly (row 54)
- Citations corrected from primary sources; several wrong theorem numbers
  and one wrong arXiv identifier retracted (rows 4–7b, 9, 38, 39, 44)

---

## 5. Things that must NOT be claimed without a source

These have recurred and caused retractions:

1. **Do not present FORBID4 as "Keränen's set."** The strings are in his
   tables, but the specificity of exactly these six is the project's own
   claim (row 9)
2. **Do not say "the morphism keeps Parikh imbalance small."** Wrong both
   ways — it is not small and it does not discriminate (row 42)
3. **Do not read a structural signal from the morphism scanner's maximum
   prefix.** It is a logarithm of sample size, R² = 0.99875 (row 37)
4. **Do not compare the paper's figures (28,514 / 48,459 / 16,214) to our
   own.** They were computed for a different morphism or measure a
   different thing (rows 22, 44)
5. **Do not use `ancestor-box.js`'s box for any template other than the
   one it was derived for** (rows 30, 43)
6. **Do not treat Dejean's conjecture as open.** It is proven
   (`OPEN_RESEARCH_QUESTIONS.md` A2)

---

## 6. The working method this project has earned

**Eleven times** in this work a plausible generalization turned out to be
wrong only once it was run. The list is in `NEXT_STEP.md`. None of them
would have failed a visual inspection.

Three rules follow from that:

- **Run it.** A claim without run code is a hypothesis
- **Compare against HEAD, don't eyeball it.** Twice a change broke
  something that only `git diff` revealed
- **A dead code branch with no justification is a trap for the next
  person.** Remove it or throw an exception

And one bookkeeping rule: **a retracted row is never deleted.** It stays
visible in `REJECTED` status with its reasons, so it does not get added
again.

---

## 7. Next step

See **`NEXT_STEP.md`** — it is up to date and contains a concrete
starting point.
