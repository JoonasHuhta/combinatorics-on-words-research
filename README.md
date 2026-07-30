# Combinatorics on Words — Experimental Mathematics Laboratory

An experimental mathematics laboratory for combinatorics on words: exact
computations about the avoidance of abelian and additive squares, where every
result is logged, sourced and reproducible.

**The main target is Mäkelä's conjecture** — is there an infinite ternary word
whose only abelian squares are `00`, `11`, `22`? Open for half-lengths
K = 2…5. The second target is the **avoidance of additive squares** over
integer alphabets, which is likewise open.

## What is different here

The most valuable part of this laboratory is not a search algorithm. It is the
**epistemic machinery** that keeps track of what is actually known:

- **`MATH_CLAIMS.md`** is the single authority for every mathematical claim.
  Each one carries a source, a verification level and a date. Level 2 means
  somebody opened the primary source and compared it word for word; Level 1
  means the computation is reproducible but has had no external check. The
  default for new data is always Level 1.
- **A retracted claim is never deleted.** It stays visible in `REJECTED`
  state with its reasons, so that nobody adds it back. One row has already
  come back out of that state when new evidence appeared — which is exactly
  what the register is for.
- **`NEGATIVE_RESULTS.md`** is the graveyard of dead ends. It also holds ideas
  that worked but did not pay, ideas that worked in the wrong place, and
  methods that turned out to be wrong even though their output was flawless.
- **`check-claims-drift.js`** guards all of this mechanically. It rejects
  overclaiming language in program output, dangling source references and
  rotted documents. It has caught its own author more than once.

The practical consequence: a finite check is always reported with its window
("no violation found for K in [2,5] in this 6,561-symbol image"), never with
the words *proven* or *certified* without a stated bound.

## Where to start

| You want | Read |
|---|---|
| The overall picture: what is known, what is closed | **`KNOWLEDGE_STATE.md`** |
| To work in the repository (human or AI) | **`RESEARCH_CONTEXT.md`**, then **`AGENTS.md`** |
| To check a single claim | **`MATH_CLAIMS.md`** |
| To know what is open | **`OPEN_RESEARCH_QUESTIONS.md`** |
| To know what has already been tried and failed | **`NEGATIVE_RESULTS.md`** |
| To continue the work | **`NEXT_STEP.md`** |

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
