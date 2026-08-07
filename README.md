# Word Structures — Open Lab for Combinatorics on Words

**Word Structures** is the umbrella name for this open research lab. This
repository, **Combinatorics on Words Research**, is its research program: an
open platform for exact computations, reproducible experiments, and
AI-assisted mathematical research into combinatorics on words.

The lab's flagship open problem is **Mäkelä's conjecture**: does there exist
an infinite ternary word whose only abelian squares are `00`, `11`, and `22`?
Open for half-lengths K = 2…5 (`MATH_CLAIMS.md` row 4). The lab's flagship
learning experience is **ABELISK — Hidden Echoes**, a logic-puzzle app built
on the same mathematics, reachable from the live site below.

### Two front doors

| | Where | What it's for |
|---|---|---|
| **Explore / Learn** | [wordstructures.org](https://wordstructures.org/) | The public site: teaching tabs, Abelisk, and visualisations. It **reports** results; it does not compute or adjudicate them. |
| **Research / Evidence** | [this repository](https://github.com/word-structures/combinatorics-on-words-research) | The canonical layer: the claim ledger, the exact computations, the review process, and the full history of what was tried and why. |

If a figure on the site and a figure in `MATH_CLAIMS.md` ever disagree, the
ledger in this repository is authoritative — the site is downstream of it,
never the reverse.

### Project Goals
1. **Advance research** on combinatorics on words and open problems.
2. **Build open educational tools** to teach algorithms and research methodology.
3. **Develop a reproducible AI-assisted research workflow** where the methodology and the process of discovery (including failures) are documented alongside the mathematics.

AI may assist with search, drafting, and review throughout this project.
People — currently the maintainer — retain authority over what is accepted as
a claim, a decision, or a release.

## Start Here (Onboarding)

Different documents answer different questions. This is what each one is for,
not a reading order you must follow start to finish:

| Document | Answers |
|---|---|
| **`RESEARCH_CONTEXT.md`** | The deep entry point for continuing research work: what the project is, how the exact pipeline is organised, and what to read next. Start here if you intend to work on the mathematics. |
| **`CURRENT_FOCUS.md`** | What is actively authorized right now, and what is explicitly not started yet. Selection is not authorization here — this file says which is which. |
| **`ROADMAP.md`** | How the program's work is organised into workstreams, and in what order. |
| **`KNOWLEDGE_STATE.md`** | A snapshot: what is known, what is closed, what is open, what must not be used — a derived index over the ledger. |
| **`MATH_CLAIMS.md`** | The sole authority for every mathematical claim this project makes. Every row is sourced, dated, and carries a verification level. |
| **`OPEN_RESEARCH_QUESTIONS.md`** | What is currently open, organised by literature, by the project's own computable questions, and by a register of rejected framings. |
| **`NEGATIVE_RESULTS.md`** | The graveyard: what was tried, what failed, and why — so effort is not spent repeating it. |
| **`LITERATURE_COVERAGE.md`** | A guided reading list of the papers that matter, and what has and has not been checked against them. |

**If you want to contribute:** see `CONTRIBUTING.md`. **If you want to see
how the AI-assisted methodology works:** see `AGENTS.md`, which sets the
citation and verification protocol every contribution — human or AI-assisted
— is held to.

## Open Problems

This laboratory currently targets the following open problems in combinatorics on words:

| Problem | Description | Source |
|---|---|---|
| **Mäkelä's conjecture** | Does there exist an infinite ternary word whose only abelian squares are 00, 11, 22? (Open for half-lengths K = 2…5). | Fici & Puzynina (2023) / Rao & Rosenfeld (arXiv:1511.05875) |
| **Abelian repetition threshold** | What are the exact lower and upper bounds for abelian repetition thresholds? | Fici & Puzynina (2023) |
| **The k-abelian hierarchy** | Understanding avoidance in stricter k-abelian equivalences (e.g. 2-abelian squares in ternary words). | Fici & Puzynina (2023) |
| **Unfavourable factors** | Does there exist an a-2-free word that can be extended without bound to the right, but never occurs inside any infinite a-2-free word? | Keränen (2006) |
| **Additive squares over ℤ** | Is ℤ uniformly 2-repetitive? (Are additive squares avoidable over finite integer alphabets?) | Justin (1972) / Rao & Rosenfeld (2015) |

*(Note: Dejean's conjecture is proven and therefore not on this list.)*

Every open-problem statement above is a finite question about the existence
of an infinite object. No finite computation in this repository — however
long, however clean — is presented as proof of such existence; see
`AGENTS.md` and `EPISTEMIC_DISCIPLINE.md` for why, and how results are
worded instead.

## What is different here

The most valuable part of Word Structures is not a search algorithm. It is the
**epistemic machinery** that keeps track of what is actually known:

- **`MATH_CLAIMS.md`** is the single authority for every mathematical claim.
  Each one carries a source, a verification level and a date. Level 2 means
  somebody opened the primary source and compared it word for word; Level 1
  means the computation is reproducible but has had no external check. The
  default for new data is always Level 1.
- **A retracted claim is never deleted.** It stays visible in `REJECTED` state with its reasons, so that nobody adds it back.
- **`NEGATIVE_RESULTS.md`** is the graveyard of dead ends. It also holds ideas
  that worked but did not pay, ideas that worked in the wrong place, and
  methods that turned out to be wrong even though their output was flawless.
- **`check-claims-drift.js`** guards all of this mechanically. It rejects
  overclaiming language in program output, dangling source references and
  rotted documents. It has caught its own author more than once.

The practical consequence: a finite check is always reported with its window
("no violation found for K in [2,5] in this 6,561-symbol image"), never with
the words *proven* or *certified* without a stated bound.

**Every pull request to `main` is checked by this machinery automatically.**
Two required checks — `claims-drift` and `tests` — must pass before a change
can be merged; see "Running it" below for what each one guards.

## Layout

```
src/            the exact Node research pipeline — self-verifying modules,
                dependency-free; every module throws rather than return a
                wrong answer
scripts/        research runners, plus the governance tooling that guards
                MATH_CLAIMS.md (check-claims-drift.js) and the git hooks
tests/          the regression suite (tests/test.js and friends)
docs/           program governance (docs/program/), task specifications
                (docs/tasks/), living plans (docs/plans/) and superseded
                planning papers (docs/historical/ — do not rely on these)
research/       written research output and dataset provenance records
datasets/       record-word data — see "Sources and rights" below
.github/        the CI workflow that runs the two required checks above
```

Not every `.js` file in this repository is part of the exact pipeline above —
`aa2fr-worker.js`, for instance, is a browser Web Worker, not a research
module. The pipeline's own inventory is `RESEARCH_CONTEXT.md` section 3, kept
in sync with `src/` and `scripts/` by an automated check.

The web application — `index.html`, `app.html`, `word-checker.html`,
`bridge_story_sandbox.html`, `poster.html`, and their supporting assets
(`aa2fr-worker.js`, `run-seam-search.bat`) — lives at the repository root
rather than in a subfolder. That is because the current GitHub Pages
deployment serves the site from the repository root; moving these files would
change their public URLs.

## Running it

No dependencies, no `npm install`, no build step. Node (any reasonably
recent version) and a browser are enough.

```bash
git clone https://github.com/word-structures/combinatorics-on-words-research.git
cd combinatorics-on-words-research
node tests/test.js                 # mathematical regression tests (41 as of this writing)
node scripts/check-claims-drift.js # guard over claims, citations and UI text
node scripts/install-git-hooks.js  # optional: makes both of the above run automatically
                                    # on every commit (skipped/blocked appropriately) --
                                    # see CONTRIBUTING.md rule 4
```

Run the two checkers before committing and **read both outputs** — they test
different things, and they are the same two checks (`claims-drift`, `tests`)
that gate every pull request in CI. Individual modules under `src/` and
`scripts/` run directly, for example:

```bash
node src/sft-container.js --kmax 6
node scripts/additive-sweep.js --letters 4 --span 8
node scripts/sanalab-run.js --alphabet 0,1,2,8 --budget 20000000 --state s.json
```

**To check your own word** (does it contain an abelian square, a
Golden-Six square, or a full 2-abelian square? see `MATH_CLAIMS.md` rows
84–106): open `word-checker.html` directly in a browser, no server needed
— or, for a candidate record word specifically, run it through the
project's own verification script the same way row 40's record words were
checked:

```bash
node src/word-anatomy.js datasets/your-word.txt
```

`word-checker.html` gives a quick, non-authoritative answer in your
browser; `word-anatomy.js` is the process an actual new-record claim has
to go through before it can be logged in `MATH_CLAIMS.md`
(`OPEN_RESEARCH_QUESTIONS.md` B21) — the two are not interchangeable, and
the browser tool says so on the page.

## Working conventions, earned the hard way

Eleven times in this project a plausible generalisation turned out to be wrong
only when it was run. Not one of them would have failed a visual inspection.
Three rules follow, and they apply to AI assistants as much as to people:

1. **Run it.** A claim without executed code is a hypothesis.
2. **Diff against HEAD, do not eyeball it.**
3. **An unjustified dead code branch is a trap for whoever comes next.**

AI does not produce mathematical truth here. It helps search, assess and
challenge — the proof always comes from executed, verified computation.

**Language.** All documentation, code comments and commit messages are written
in English, so that the work stays legible to the international research
community that the literature belongs to. See `AGENTS.md` rule 8. Documents
written earlier in Finnish are migrated as they are revised; the claim ledger
is migrated row by row rather than in bulk, because bulk translation is
precisely where calibrated wording gets lost.

## Getting involved

See **`CONTRIBUTING.md`**. In short: this is a research project, so a gap
found in an existing claim, a literature reference that closes an open
question, or an independent reproduction of a `COMPUTED` row are treated as
seriously as new code — the project's own ledger has rows that exist only
because an earlier claim was checked again and found wanting. Read
`OPEN_RESEARCH_QUESTIONS.md` and `NEGATIVE_RESULTS.md` before starting
anything, so effort does not repeat what the project already knows not to
do. `index.html` is the browser visualiser — open it directly, no build step
or server needed, or visit the live site linked above.

## Sources and rights

Every cited work is recorded in `MATH_CLAIMS.md` with a DOI or arXiv
identifier; citation does not imply redistribution of the source itself, and
literature under `papers/` (gitignored) is not redistributed from this
repository.

One dataset file under `datasets/` is currently tracked in this repository
and is attributed, in the repository's own documentation, to an external
author. That attribution is not the same thing as confirmed redistribution
permission, and no such permission has been established. This file's
provenance and rights status are open — see
`docs/program/OD-2-PROVENANCE-FINDINGS.md` for the full evidence gathered so
far and the options under consideration. This README does not resolve that
question or assert a rights conclusion in either direction.

This project's own code and documentation are MIT licensed — see `LICENSE`.
**If you use a result, figure, or claim from this project in your own work,
please cite it** (see `CITATION.cff`, or GitHub's "Cite this repository"
button) and, where possible, reference the specific `MATH_CLAIMS.md` row it
comes from, so the citation traces to its exact source and verification
level rather than to the project in general.
