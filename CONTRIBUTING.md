# Contributing

This is a research project, not a typical software project. The rules below
follow from that: the goal is not more code, it is claims that survive
scrutiny.

## Before anything else

Read, in this order: `RESEARCH_CONTEXT.md`, then `AGENTS.md`. They are the
entry point for a reason — `AGENTS.md` in particular sets the citation and
verification protocol that every contribution, human or AI-assisted, is held
to. Then check `OPEN_RESEARCH_QUESTIONS.md` (what is actually open) and
`NEGATIVE_RESULTS.md` (what has already been tried and failed) before
starting new work, so effort does not repeat what the project already knows
not to do.

**If you are here to learn, not to contribute:** `index.html` is the
entry point — open it in a browser and explore the 19 tabs. The claim
ledger (`MATH_CLAIMS.md`) and the dead-ends register (`NEGATIVE_RESULTS.md`)
are designed to be legible without prior background in the field: a sourced
claim with a verification level and a date is the same whether you are a
researcher, a student, or someone curious about how experimental mathematics
works in practice.

## What counts as a contribution here

Mathematics and code are not the only useful kind:

- **Finding a gap.** A missing hypothesis, a step that does not follow, a
  citation that does not say what it is cited for. This is at least as
  valuable as a new result, and it is explicitly welcome: a pull request or
  issue that challenges or refutes something already in `MATH_CLAIMS.md` is
  treated with the same seriousness as one proposing something new. The
  project's own record shows why — several rows in the ledger exist only
  because an earlier claim was checked again and found wanting.
- **Pointing at prior literature.** If a result here is already known,
  or is a special case of something published, that is a genuine finding.
  `LITERATURE_COVERAGE.md` records what has been checked and where; if you
  know a source that closes a gap listed there, opening it (and citing it
  precisely, per `AGENTS.md` rule 1) is exactly the kind of contribution the
  project needs.
- **Independent verification.** Every `COMPUTED` (Level 1) row in
  `MATH_CLAIMS.md` is internally checked but has had no outside eyes. A
  second, independent implementation that reproduces (or contradicts) a row
  is high-value work, precisely because it does not share a codebase with
  the original.
- **Code.** Search improvements, a new exact module, performance work. Same
  bar as everything else: it must verify itself and fail loudly rather than
  return a wrong answer (see `decide-realizability.js` or
  `additive-affine-decision.js` for the house style).

## Ground rules

1. **Cite before you claim.** If a contribution states an author, year,
   venue or theorem number, open the primary source yourself and quote the
   exact passage. A secondhand paraphrase — including one from an AI
   assistant, including one from this project's own prior sessions — is not
   sufficient and must be marked as secondhand if used at all. This project
   has had to correct exactly this kind of mistake more than once; it is
   the single most common failure mode here.
2. **Two verification levels, never blurred.** `LEVEL_1_INTERNAL_CHECKSUM`
   (reproducible, not externally checked) and `LEVEL_2_VERIFIED_SOURCE`
   (checked against the primary source, character for character). New work
   defaults to Level 1.
3. **Calibrated language for finite checks.** "No violation found for K in
   [a,b]" or "in this N-symbol prefix" — never "proven" or "confirmed"
   without the exact bound the check actually covered.
4. **Run it before you claim it.** `node tests/test.js` and
   `node scripts/check-claims-drift.js` must both pass, and both outputs
   should be read, not just the pass/fail line — they check different
   things. Run `node scripts/install-git-hooks.js` once per clone to make
   this a pre-commit hook instead of something that has to be remembered —
   git never tracks `.git/hooks/` itself, so a fresh clone or worktree has
   no hook until this is run.
5. **A retracted claim is never deleted.** If you find a row in
   `MATH_CLAIMS.md` is wrong, it moves to `REJECTED` with the reason. It
   stays visible so nobody re-adds it.
6. **English for anything recorded.** Documentation, code comments, commit
   messages and ledger rows are written in English (`AGENTS.md` rule 8), so
   the work stays legible to the literature it cites and the people who
   might check it. Discussion with the maintainer can happen in whatever
   language is convenient.

## Practical mechanics

- **Issues** for a proposed research question, a literature lead, or a
  suspected gap. State it as a question or hypothesis, not a finding — see
  `docs/plans/RESEARCH_ARCHITECT.md` if you want the fuller procedure the
  project itself uses for generating research directions.
- **Pull requests** for code, corrected citations, or a ledger row. Changes
  to `MATH_CLAIMS.md`, to canonical data, or to any UI text that states a
  scientific claim need the maintainer's sign-off before merge — not because
  outside contributions are distrusted, but because that is the same bar the
  project holds its own AI-assisted sessions to (`AGENTS.md` rule 5).
- **No separate contributor tiers, badges, or difficulty ratings.** Read the
  docs above, pick something genuinely open, and show your work. That is
  the whole process.

## The application (`index.html`)

The browser app teaches and visualises; it does not compute anything itself,
and it does not yet read `MATH_CLAIMS.md` directly (that wiring is planned,
see `docs/plans/UI_UX_PLAN.md` item 1). Until then, treat any figure shown in
the app as illustrative and check the ledger for the sourced version. Open
`index.html` directly in a browser — no build step, no server required.
