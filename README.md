# Combinatorics on Words — Experimental Mathematics Laboratory

An open platform for exact computations, reproducible experiments, and AI-assisted mathematical research.

### Project Goals
1. **Advance research** on combinatorics on words and open problems.
2. **Build open educational tools** to teach algorithms and research methodology.
3. **Develop a reproducible AI-assisted research workflow** where the methodology and the process of discovery (including failures) are documented alongside the mathematics.

## Start Here (Onboarding)

The repository is structured to serve three different audiences. Pick the path that matches your interest:

**If you want to understand the research (15 minute read):**
* `RESEARCH_CONTEXT.md` — What is the problem and how does the project work?
* `KNOWLEDGE_STATE.md` — What we already know and what is definitively closed.
* `OPEN_RESEARCH_QUESTIONS.md` — What is currently open and unsolved.

**If you want to understand the literature and sources:**
* `LITERATURE_COVERAGE.md` — A guided reading list of the papers that matter, and why you should read them.
* `MATH_CLAIMS.md` — The central ledger. Every single mathematical claim made in this project is sourced, verified, and logged here.

**If you want to see how the AI and methodology works:**
* `AGENTS.md` — The exact rules, protocols, and verification standards every AI agent (and human) must follow to contribute.
* `NEGATIVE_RESULTS.md` — The graveyard. A systematic documentation of our research process: how ideas failed, why they were rejected, and what we learned from them.

**If you want to contribute:**
* `CONTRIBUTING.md` — You don't need to be a math PhD. We need help reading papers, replicating experiments, and building visualizations.

## What is different here

The most valuable part of this laboratory is not a search algorithm. It is the
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

## Layout

```
*.js                 the exact Node pipeline, dependency-free; every module
                     verifies itself and throws rather than return a wrong
                     answer
index.html           browser application: teaching and visualisation. It
                     REPORTS results, it does not compute them
docs/plans/          living plans (sanalab, UI/UX, process)
docs/historical/     superseded planning papers — do not rely on them
papers/              literature (gitignored)
datasets/            record words (gitignored, the authors' data)
```

## Running it

No dependencies, no installation. Node and a browser are enough.

```bash
node test.js                 # mathematical regression tests
node check-claims-drift.js   # guard over claims, citations and UI text
```

Run both before committing and **read both outputs** — they test different
things. Individual modules run directly, for example:

```bash
node sft-container.js --kmax 6
node additive-sweep.js --letters 4 --span 8
node sanalab-run.js --alphabet 0,1,2,8 --budget 20000000 --state s.json
```

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
or server needed.

## Sources and licence

The literature in `papers/` and the record words in `datasets/` belong to their
authors and are not redistributed from this repository. Every cited work is
recorded in `MATH_CLAIMS.md` with a DOI or arXiv identifier.

This project's own code and documentation are MIT licensed — see `LICENSE`.
**If you use a result, figure, or claim from this project in your own work,
please cite it** (see `CITATION.cff`, or GitHub's "Cite this repository"
button) and, where possible, reference the specific `MATH_CLAIMS.md` row it
comes from, so the citation traces to its exact source and verification
level rather than to the project in general.
