# Public Understanding, Access & Impact Plan

**Status:** approved direction, not yet implemented (PUBLIC-ACCESS-1, 2026-08-08)
**Scope:** the public-facing entry layer of Word Structures
**Authority:** this is a *plan*. It creates no mathematical claim. `MATH_CLAIMS.md`
remains the sole claim authority, and nothing in this document may be cited as
evidence for anything.

---

## 0. The governing principle

> **Do not make the mathematics smaller. Make the path into it longer.**

Word Structures does not need a simplified version of its mathematics. It needs
enough stepping stones that a visitor with no background can reach the real
thing. Mäkelä's conjecture, morphisms, computational verification and the claim
ledger all stay exactly as they are.

---

## 1. The problem this solves

The project has a strong research identity: real mathematics, computation,
verification, open questions, evidence discipline, and a growing educational
layer. That is a strength, and it creates a specific risk.

A first-time visitor meets *abelian square*, *morphism*, *ternary word*,
*half-length*, *verification*, *Mäkelä's conjecture*, and concludes:

> "This is interesting, but it is not for me."

The mathematics is not too advanced. **The bridge into it is missing.**

Most people were taught that mathematics is numbers, arithmetic and equations.
They were not necessarily taught that mathematics also studies order,
repetition, symmetry, constraint, sequence, equivalence, transformation,
possibility, impossibility and structure.

That makes combinatorics on words unusually well suited to public mathematical
education. A visitor can begin with nothing more than **a · b · c** and arrive
at a genuine open research problem.

The project should therefore make a deliberate promise:

> **You do not need advanced mathematics to begin here.**

The public path should begin with **recognition**, not terminology.

---

## 2. Two complementary missions

| Mission | Statement |
|---|---|
| **Research** (unchanged) | Open research in combinatorics on words. |
| **Public** (new) | Make abstract mathematics visible. |

Longer form of the public mission:

> Word Structures uses simple symbols, interactive experiments, computation and
> open research to show how patterns become mathematics.

**Approved public hook** — rhetorical outreach language, not a ledger claim.
Its conditions of use are binding; see §7.3.

> Three letters are enough to reach the edge of human knowledge.

---

## 3. The central educational principle: layers of resolution

There is no "simplified version". The **same mathematical object** is visible at
several depths, and nothing is falsified on the way up:

```
These are three different things.
    ↓
Their order can change while their quantities stay the same.
    ↓
Two neighbouring blocks with the same quantities are a special repetition.
    ↓
Mathematicians call this an abelian square.
    ↓
Can we keep building without producing one?
    ↓
What if the shortest repetitions are allowed?
    ↓
That is Mäkelä's open problem.
```

Project-wide editorial rule:

> **Intuition first. Name second. Formal definition third. Research frontier last.**

---

## 4. How this fits the current production architecture

This plan **reconciles with** the architecture already built; it does not
redesign it.

| Surface | Status | Question it answers |
|---|---|---|
| `start.html` | **proposed** | *Why is this mathematics at all?* |
| `index.html` | live | What is this project? |
| `learn.html` | live (WEB-LEARN-1) | *Teach me the actual mathematics.* |
| `research.html` | live (WEB-RESEARCH-1) | *What do we know, and what is open?* |
| Evidence page | planned next | *How do you know?* |
| `explore.html` | live | The laboratory — here are the instruments. |
| ABELISK | developing | Discover the structure yourself. |

**Start Here is not a replacement for Learn.** The distinction is load-bearing:

- **START HERE / Curious** — argues that arrangement *is* mathematics. Almost no
  terminology. Ends at the frontier, not at mastery.
- **LEARN** — teaches the mathematics properly: definitions, avoidance, the
  three/four-letter boundary, exercises.
- **RESEARCH** — what is known, what is open, how the project investigates it.
- **EVIDENCE** — provenance, claim states, verification, negative results.

The visitor moves **intuition → mathematics → research → epistemology**.

### 4.1 A constraint inherited from `UI_UX_PLAN.md` §6

A prior architectural review (2026-08-01) established a test that any navigation
scheme must pass:

> **Any navigation scheme must have a top-level home for "how we know this", not
> a subfolder of Research.**

That review found two independent artifacts had each quietly demoted the
epistemology to infrastructure, and recorded the guard because the project's
rarest asset is `NEGATIVE_RESULTS.md` and the ledger's two-level status system.

**Consequence for this plan — owner decision, resolved 2026-08-08.** The depth
ladder in §5 lists Evidence last. That is a statement about **reading depth
only**. It does **not** mean lower navigation rank, lower epistemic importance,
or subordination to Research. Evidence remains a top-level public surface and
must remain directly reachable. Presenting the ladder as a hierarchy of
*importance* would repeat exactly the demotion that review caught.

### 4.2 A superseded recommendation, recorded rather than contradicted silently

`UI_UX_PLAN.md` §6 concluded: *"keep the grid, add group headers — do not replace
it."* That recommendation has been **superseded** by the owner-approved
multi-page architecture executed in WEB-SWAP-1, WEB-LEARN-1 and WEB-RESEARCH-1.
The *test* it established (§4.1) remains binding; its *recommendation* does not.

---

## 5. The four depths

| Depth | Entry | For the visitor who says |
|---|---|---|
| **Curious** | START HERE — no maths required | "I know nothing about this." |
| **Learn** | Learn | "I want to understand the mathematics properly." |
| **Research** | Research | "Show me what we actually know." |
| **Evidence** | Evidence | "How do you know?" |

Explore is the laboratory across all depths. ABELISK is the discovery
experience, and is the strongest available bridge from Curious to Learn.

An expressive (not mandatory) route:

```
START HERE → ABELISK → LEARN → EXPLORE → RESEARCH → EVIDENCE
```

---

## 6. The Start Here experience

A dedicated page, roughly five to eight minutes, structured as guided discovery
rather than exposition.

### 6.1 Proposed sequence

| # | Beat | Content |
|---|---|---|
| 1 | Three symbols | `a b c` — then the same thing as colours or shapes. *These are names for three different things.* |
| 2 | Order creates structure | `abc` vs `cba`. Same ingredients, different order. *What is present* vs *where it appears*. |
| 3 | Same quantities, different order | `ab \| ba`, then `abc \| bca`, with explicit counts. |
| 4 | The name arrives | *Mathematicians call this an abelian square.* |
| 5 | Avoid it | Can you build without creating one? |
| 6 | Try | Small interactive challenge. |
| 7 | It gets hard | Combinatorial growth made visible. |
| 8 | Computers help | Search and pruning, in plain terms. |
| 9 | Computers do not settle it | Finite versus infinite. |
| 10 | The frontier | Can the rule be satisfied forever? |
| 11 | Nobody knows | The transition from education to research. |

Then: **Continue to Learn**, with **Play ABELISK** secondary.

### 6.2 The signature moment

There should be a deliberate tonal change where the visitor crosses from
education into research:

> So far, every problem here may have looked like a puzzle with an answer behind
> the screen. This one does not. **Nobody currently knows the answer to the
> infinite version of this question.**

This is the plan's strongest single idea and should be protected in
implementation.

### 6.3 "Why are letters part of mathematics?"

A section answering the question many visitors will have silently:

> Mathematics does not care whether the symbols are letters, colours, notes, DNA
> bases or tiles. It cares about the rules connecting them.

Candidate recurring formulation:

> **Mathematics begins when we ask what rules follow from arrangement.**

### 6.4 Learning mechanism

**prediction → experiment → surprise → explanation.** The visitor should *feel*
the difficulty before being told it is difficult.

### 6.5 Explaining what "open problem" means

Most people assume a computer could simply calculate the answer. Show the growth
(3, 9, 27, 81, 243, 729, …), then introduce rules, shortcuts, symmetries,
impossible branches and transformations as *answers to a problem the visitor
already has* — only then naming backtracking, pruning, morphisms and unfavourable
factors.

### 6.6 Computation in human terms

Idea first, term second:

| Instead of only | Say first |
|---|---|
| "50,000,000 states searched" | "The program explored tens of millions of possible continuations and rejected branches as soon as they broke the rule." |
| "pruning" | "Stop exploring a branch as soon as it cannot lead anywhere useful." *Then:* "Computer scientists call this pruning." |

### 6.7 Finite is not infinite

Give the visitor two statements and ask whether they are the same claim:

> "A computer found a word of length 25,379."
> "An infinite word exists."

They are not. This is already the project's research discipline; for the public
it becomes a lesson in reasoning, and it generalises: *observed many times* does
not imply *always*.

### 6.8 The map is not the territory

One short bridge, used **once**, to make the point above concrete. This is an
epistemic-literacy device, not a philosophical theme, and it must not be spread
across the rest of the project.

> Symbols, visualisations, computations and models are ways of mapping
> structure; they are not the structure itself. A very detailed computational
> map of finite territory does not by itself establish what happens infinitely
> far beyond it.

Applied to what the visitor has already seen: the letters `a b c` are
representations; the coloured blocks are a representation; a search that
explores millions of continuations is an explored map, not the whole terrain.
Each is useful precisely because it is smaller than what it describes — and that
is also why none of them settles the infinite question.

This restates the project's existing finite-versus-infinite discipline in
ordinary language. It adds **no** mathematical claim, and asserts nothing about
the nature of mathematical objects.

---

## 7. Public communication safety

This section is binding on all outreach prose. It exists because outreach
language drifts toward hype by default.

### 7.1 Three categories, never conflated

| Category | Meaning | Permitted phrasing |
|---|---|---|
| **ANALOGY** | An everyday system that shares *structure* with the mathematics. Carries no claim about the mathematics applying there. | "This is another example of a system represented by sequences over a small alphabet." |
| **KNOWN APPLICATION** | A demonstrated, sourced use. Requires a ledger row or cited source. | Only with the source named. |
| **POSSIBLE FUTURE RELEVANCE** | Speculative. Must be marked as such and must not be stated as benefit. | "Methods developed for hard discrete problems often travel further than the problem that motivated them." |

**Hard rule:** an analogy may never be upgraded into an application claim.
Beads, Lego, music, symbolic data and DNA are **analogies**. The site must not
imply that Mäkelä's conjecture solves a biological, musical or industrial
problem.

### 7.2 Three statements to keep distinct

1. **This exact conjecture.** We do not know whether resolving it produces a
   direct practical technology. That is fine; it is fundamental research.
2. **The field.** Patterns in finite strings relate broadly to algorithms,
   formal languages, coding theory, data representation, symbolic computation
   and repetition detection. State carefully.
3. **The methods.** Search, pruning, compact representation, verification and
   structural decomposition often outlive the problem that motivated them.
   Explain; do not promise outcomes.

### 7.3 The public hook is rhetorical outreach language, not a ledger claim

> "Three letters are enough to reach the edge of human knowledge."

**Approved by the owner (2026-08-08) as rhetorical outreach language, explicitly
not a mathematical ledger claim.** It is governed by this section, not by
`MATH_CLAIMS.md`.

**Binding condition of use:** wherever the hook appears publicly, it must be
followed by a clear explanation of the *actual* open problem, so that the hook
cannot overstate what is unknown. It must never stand alone, and must never
appear where a reader would take it as a sourced statement.

### 7.4 Plain-language contract

Every important public research statement maintains three levels that **must mean
the same thing**:

- **Level A — one sentence.** "Can three symbols avoid this kind of repeated
  structure forever?"
- **Level B — plain mathematical explanation.** Single-letter repetitions may
  occur, but no longer pair of neighbouring blocks may contain the same
  quantities of each symbol.
- **Level C — formal formulation.** Full half-length K ≥ 2 terminology.

Site-wide editorial device: a small **"In plain language"** or **"What this
means"** box. Never labelled "for beginners".

### 7.5 Language that respects the reader

| Use | Avoid |
|---|---|
| Start here · No maths required · In plain language · See it visually · Try it yourself · What this means · Why it matters · Go deeper | Beginner version · Easy mode · Simplified mathematics · For non-experts |

A highly intelligent person may simply never have studied combinatorics on
words. The principle is **no prerequisite knowledge**, not reduced intelligence.

### 7.6 Tone

The current restrained scientific-editorial aesthetic is an asset and must be
preserved. Accessibility comes through language, examples, pacing, interaction,
whitespace and visual explanation — **not** through mascots, oversized buttons,
blanket gamification or infantilising language.

> **Museum exhibition, not school worksheet.**

---

## 8. Questions instead of lectures

| Instead of | Ask first |
|---|---|
| "An abelian square consists of two adjacent blocks…" | "What if two neighbouring blocks contain the same ingredients, in a different order?" |
| "Avoidance problems investigate…" | "How long could you keep going without creating one?" |
| "Mäkelä conjectured…" | "Could you keep going forever?" → "Nobody currently knows." |

---

## 9. Value the project has today

Stated as present value, not promised outcomes. **Note:** `CURRENT_FOCUS.md`
lists *"pedagogical effectiveness is an untested hypothesis"* as a standing
constraint. Everything in this section is therefore an **intended** benefit
pending the comprehension testing in §11, and must not be presented publicly as
a measured result.

| Axis | Today | Possible future |
|---|---|---|
| **Mathematical** | Open research, verified finite structures, methods | New theorems, constructions, algorithms |
| **Educational** | Pattern recognition, abstraction, proof literacy | Reusable material for schools and the public |
| **Computational** | Search, pruning, verification, representation | Techniques transferable to other discrete-search problems |
| **Epistemic** | Showing evidence, uncertainty, AI/human verification | A model for transparent AI-assisted research |

Specific reader benefits: structural thinking (*what matters here: identity,
order, quantity, relationship?*), constraint thinking (*what can I build while
avoiding X?*), algorithmic thinking, understanding what a proof is, and
understanding uncertainty — *"we do not know"* is a precise scientific state,
not a failure.

### 9.1 AI literacy

The project is unusually well placed to show what AI's role in science should
be:

```
AI suggests → code explores → independent checks verify
→ sources support → humans decide what may be claimed
```

Not *"AI says it, therefore it is true"* but *"AI can generate ideas, code and
hypotheses; claims still require evidence and human judgment."* The existing
infrastructure already enforces this, which makes it demonstrable rather than
aspirational.

---

## 10. Proposed implementation sequence, with critique

The owner's suggested order was PUBLIC-ACCESS-2 … 8 as listed. Repository
evidence suggests **three changes**.

### 10.1 Recommended order

| PR | Task | Change from suggested |
|---|---|---|
| **PUBLIC-ACCESS-2** | **Analogy library + safety governance** (`PUBLIC_ANALOGY_GUIDE.md`) | **Moved earlier** (was 5) |
| **PUBLIC-ACCESS-3** | **Narrative comprehension pre-test** — test the §6 script on people before building | **Moved earlier** (was 8) |
| **PUBLIC-ACCESS-4** | Build `start.html` (+ add it to the claim guard in the same PR) | was 2 |
| **PUBLIC-ACCESS-5** | Homepage "Start here — no maths required" entry | was 3 |
| **PUBLIC-ACCESS-6** | Plain-language bridges in Learn / Research | was 4 |
| **PUBLIC-ACCESS-7** | "Why it matters" / impact material | was 6 |
| **PUBLIC-ACCESS-8** | School pathways | **blocked — see §11.2** |
| **PUBLIC-ACCESS-9** | Post-build comprehension testing | retained |

### 10.2 Why

1. **The analogy library must exist before the page that uses analogies.**
   `start.html` will use beads, colours, music and DNA. Building it first and
   governing the analogies afterwards means shipping ungoverned outreach prose
   and retrofitting the boundary — the same ordering mistake WEB-SAFE-1 had to
   correct on the claim-safety side.
2. **Comprehension testing belongs before the build, not only after.** The §6
   narrative is the actual product; testing it as a script costs little and
   catches a wrong narrative before it is implemented. A post-build test (§11)
   is still needed, but should not be the first test.
3. **`start.html` must join the claim guard in its own PR**, exactly as
   `learn.html` and `research.html` did, so it never exists as an unguarded
   public surface.

---

## 11. Governance rulings

The two boundary questions below were **resolved by owner decision on
2026-08-08**. They are recorded here as rulings, not open questions.

### 11.1 Comprehension testing vs. "Public recruitment — OD-1" — RESOLVED

`CURRENT_FOCUS.md` lists **"Public recruitment — OD-1"** under *Do not start*.

**Ruling:** comprehension testing is **not** treated as public recruitment when
it is explicitly limited to usability and understanding testing of
public-facing explanations. PUBLIC-ACCESS comprehension testing may therefore
proceed later without triggering the public-recruitment restriction.

**Condition:** this holds only while the activity remains testing of
explanations. If it becomes recruitment of participants into the research
programme itself, OD-1 applies again.

### 11.2 School pathways vs. "Any pedagogy pilot" — BLOCKED

`CURRENT_FOCUS.md` lists **"Any pedagogy pilot — transfer task not yet
designed"** under *Do not start*. School pathways are a pedagogy pilot.

**Ruling:** school pathways **remain blocked**. The age-level and school
material below is retained as *future input only*. Implementation is not
authorised until a separate pedagogy decision or transfer task exists.
**PUBLIC-ACCESS-8 must not be started.**

The age-ladder idea (roughly 9–12 colours and pattern-finding; 12–16 sequences,
constraints and systematic search; upper secondary formal definitions; university
research and evidence) is recorded as *material for that future task*, not as
approved work.

### 11.3 What comprehension testing asks

Not *"Did you like it?"* but:

- What do you think this project studies?
- Why are letters being used?
- What is the difference between exact repetition and the pattern shown here?
- What is still unknown?
- Why doesn't the 25,379-letter example settle the infinite question?

### 11.4 ABELISK constraints

ABELISK is the intended Curious→Learn bridge, but two standing constraints
apply: **the 85-cell Master puzzle is conditional on g85 verification**, and
**Abelisk v3 is active, v2 superseded**. This plan does not authorise ABELISK
work.

---

## 12. Success criteria

The public-understanding work has succeeded when a visitor with no mathematical
background can answer, in their own words, after roughly ten minutes:

| # | Question | Target answer |
|---|---|---|
| 1 | What are the letters? | Just names for different symbols. |
| 2 | Why is this mathematics? | Because we study what patterns are forced or avoidable when symbols are arranged under rules. |
| 3 | What is an abelian square? | Two neighbouring groups with the same quantities of symbols, even if the order differs. |
| 4 | What does avoidance mean? | Building a sequence in which that pattern never appears. |
| 5 | What is the big question? | Whether a sequence over three symbols can continue forever while avoiding those longer repeated structures. |
| 6 | Why doesn't a very long finite example settle it? | Because a finite object, however large, is not an infinite one. |
| 7 | Why can't a computer just solve it? | Because checking finite cases is not the same as proving what happens forever. |
| 8 | Why does the project matter without an immediate application? | It studies a real open problem, develops methods, and shows how knowledge is built and verified. |

These are **testable**, and §11.3 is how they get tested.

---

## 13. Relationship to the identity mark

The Word Structures mark reads first as steps, then as a partial square whose
missing counterpart would complete it. That is itself progressive discovery, and
it is consistent with this plan's structure. **This is an observation about
visual language, not an instruction to redesign or reinterpret the logo**, which
remains owner-controlled and is not modified by this plan.

---

## 14. What this document does not do

- It does not modify `MATH_CLAIMS.md` or any mathematical claim.
- It does not modify the website.
- It does not authorise ABELISK, school, or recruitment work.
- It does not supersede `AGENTS.md`, `CURRENT_FOCUS.md` or the claim-safety
  guard.
- It creates no evidence and may not be cited as any.
