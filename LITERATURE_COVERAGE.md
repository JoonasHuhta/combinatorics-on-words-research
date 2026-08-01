# LITERATURE_COVERAGE.md — what the literature covers and what it does not

**Updated:** 2026-07-30
**Purpose:** prevent redoing the same computation, and make visible
**what has not been systematically studied** — that is often easier to
identify than a new result, and it is where the best research ideas come from.

> **This is a coverage map, not a claims ledger.** Every mathematical claim
> is in `MATH_CLAIMS.md`; this file only records **what has been read and
> what has not**.

## Reading Guide for Newcomers

If you are new to the field and want to understand the context of this project, read these papers in this order:

1. **Keränen (1992 / 2006)**: To understand the origin of abelian square avoidance on 4 letters and the concept of "unfavourable factors".
2. **Rao (2015)**: For the general context of abelian power avoidability.
3. **Rao & Rosenfeld (2015)**: The core source of this project. Read this to understand Mäkelä's conjecture and the construction of the $h_6$ and $g_3$ morphisms.
4. **Andrade & Mol (2024) / Currie et al. (2021)**: For the current state of additive squares and affine equivalence classes.

---

## 1. Two things that must be kept separate, and are constantly conflated

| Formulation | What it requires | May it be said |
|---|---|---|
| *"Checked in source X, not there"* | opening one source and searching it | **yes**, once the source has been opened and the search terms recorded |
| *"Not in the literature"* | an exhaustive search across the whole field | **never**, with this project's resources |

Checking four sources is not a literature search. It is checking four
sources. This table records **source-specific observations**, and the
summary column says at most *"not found in the sources checked"*.

**A second distinction that matters just as much:** the question is not
only *"has a sweep been done"* but **"which space has been swept"**. These
are different things: all words up to length N, all morphisms, all
uniform morphisms, all k-uniform morphisms, all alphabets, all local
configurations. The coverage column names the space, not just yes/no.

---

## 2. Sources opened

Only these have been opened and searched. Everything else is unopened.

| Source | Opened | How |
|---|---|---|
| Fici & Puzynina, *Abelian Combinatorics on Words: a Survey*, arXiv:2207.09937 | 2026-07-28, 2026-07-30 | ar5iv + PDF, text extracted and searched |
| Rao & Rosenfeld, arXiv:1511.05875 (= SIAM 32(4), DOI `10.1137/17M1149377`) | 2026-07-28 | ar5iv; DOI verified against Crossref 2026-07-30 (row 23) |
| Cassaigne, Currie, Schaeffer & Shallit, arXiv:1106.5204 | 2026-07-30 | abstract + ar5iv full text |
| Lietard & Rosenfeld, DLT 2020, DOI `10.1007/978-3-030-48516-0_15` | 2026-07-30 | open preprint `lirmm.fr/~mrosenfeld/LieRos.pdf`, text extracted (row 63) |
| Andrade & Mol, arXiv:2408.15390 (2024) | 2026-07-30 | HTML full text |
| Lietard, *Évitabilité de puissances additives*, PhD thesis, Univ. de Lorraine 2020 | 2026-07-30 | PDF `docnum.univ-lorraine.fr`, text extracted, keyword search (row 65) |
| Keränen, *Suppression of Unfavourable Factors*, IMS 2006 | earlier | PDF (row 38) |
| ACR 2004, *The Number of Ternary Words Avoiding Abelian Cubes* | earlier | row 48 |
| Rao & Rosenfeld, "Avoidability of long k-abelian repetitions", Math. Comput. 85(302):3051–3060 (2016), arXiv:1507.02581 | 2026-08-01 | PDF, text extracted with `pdftotext -layout` (not an AI summary), Theorem 2 and the h2 morphism quoted directly (row 84) — this is Fici & Puzynina Theorem 65's reference [124], the source of the ternary 2-abelian construction |

**Not opened:** Brown & Freedman, *"Arithmetic progressions in lacunary
sets"*, Rocky Mountain J. Math. 17(3):587–596, 1987 — **the citation is now
traced, the paper is not opened; it is the single most important unopened
source (row 65)**. Also: Rao & Rosenfeld, "Avoiding two consecutive blocks of
same size and same sum over 2", SIAM (Theorem 65's other reference, [125] —
**do not confuse with the Math. Comput. 2016 paper above; both are cited by
Theorem 65 but only the Math. Comput. one has been opened, row 84**).
Rosenfeld's PhD thesis (ENS Lyon 2017). **Rao TCS 601 (2015) is Rao SOLO — a
third, distinct paper (3-abelian squares under a finer equivalence) —
opening it does NOT satisfy row 84's citation; it remains genuinely
unopened.** Also unopened: Halbeisen & Hungerbühler (2000), Dekking (1979), Justin (1972),
Pirillo & Varricchio (1994).

### 2b. Material and visualization sources — NOT citable for claims

Kept deliberately separate from the table above. These are primary-source
*material* (data, images, constructions, exposition) from people working in
the field, not peer-reviewed statements. **No row in `MATH_CLAIMS.md` may
cite anything from here as its source.** Their use is orientation and
context: seeing what the objects look like, and what the field's own
practitioners consider worth displaying.

The separation exists because the failure mode is real and already logged
twice: §11 (a plausible claim with an author's name attached, traced to
nothing) and §19 (a genuine number given an interpretation that did not
survive a baseline comparison). Material that *looks* authoritative is
exactly what slips past.

| Source | What it is | Status |
|---|---|---|
| `algebra.fi/keranen/StructuresGraphicsMusic.html` | Veikko Keränen's own page: structures, graphics and music built from abelian-square-free words. Constructions and visualizations from the author of the 4-letter result (row 3) | **Material only.** Not opened systematically; nothing cited from it |

**Rule for adding here:** a link goes in this subsection, never the table
above, unless someone has opened a peer-reviewed document and recorded the
search terms — the same bar section 5 sets.

---

## 3. Coverage table

The **"Space"** column states exactly what has been swept, not just yes/no.

| # | Research question | Found in opened sources | Space the literature covers | Project's own work | More needed |
|---|---|---|---|---|---|
| 1 | Ternary abelian-square-free language, exhaustive | **yes** (Fici & Puzynina Prop. 17) | all ternary words, all lengths | row 1, independently reproduced | no |
| 2 | Avoiding abelian squares with 4 letters | **yes** (Keränen, Dekking) | constructions, no exhaustive sweep | rows 3, 40 | no |
| 3 | Mäkelä's conjecture, K ∈ [2,5] | **open** (Fici & Puzynina Conj. 20; R&R Problem 1) | — | rows 4, 7b, 49, 51, 52, 62, 78 | **yes, main goal** |
| 4 | Uniform ternary morphisms, k ≤ 6 | **not found** | — | row 36, exhaustive | not at this k |
| 5 | Uniform images of h₆'s fixed point, L ≤ 5 (full-image scan) | **not found** | — | row 49, exhaustive | L ≥ 6 open at full-image scan; but see row 78's locality-CSP reformulation, which covers L=6's K in [2,5] window exhaustively |
| 6 | Non-uniform morphisms, additive squares, 4→4 | **not found** | length profiles (La,Lb,Lc,Ld) ∈ [1,4]⁴, La ≥ 2, **all 20 open unbalanced affine classes** | rows 68, 69: exhaustive, negative, 1.87 billion morphisms | not in this window — see B13 (auxiliary alphabet) |
| 6b | Non-uniform morphisms, other forms | **not found** | — | not done: profiles > 4, alphabet sizes ≠ 4 | **yes, not done** |
| 6c | Auxiliary-alphabet form for additive squares (h₆ → integer alphabet) | **not found in checked sources** | uniform codings g: Σ₆ → {0,1,2,5}^L, **L ≤ 6**, h₆ fixed, condition all K ≥ 1 | row 77: exhaustive, negative, 10.4 billion symbols at L=6 | **yes** — but only: varying the auxiliary alphabet size m, non-uniform codings, other alphabets, L > 6 |
| 7 | Additive **cubes**, 4-element alphabets | **yes, comprehensively** (Lietard & Rosenfeld 2020, Corollary 1) | all 4-element alphabets as affine classes, except {0,1,2,3} | not done | **no — don't do it** |
| 8 | Additive cubes, {0,1,2,3} | **open** (their Question 1) | — | not done | possible, but their own program found no candidate |
| 9 | Additive **squares**, is there any finite ℤ-alphabet | **open** (their Question 3; quoted verbatim at row 63) | — | rows 53, 54, 59, 64 | **yes** |
| 10 | Additive-square alphabet classification, **unbalanced** classes | **not found in opened sources** | balanced classes covered by B&F 1987 (row 11) | row 54: of the classes that terminated, only {0,1,2,4} is unbalanced | **yes — this is where the gap is** |
| 11 | Balanced alphabets {0,p,q,p+q}: does an infinite word exist | **yes, solved** (Brown & Freedman 1987, traced via the PhD thesis) | all 4-element alphabets with a+d = b+c | row 65: **independently confirmed** on 10 classes; the quantitative constant corrected 50 → 61 | no — but B&F's own paper is unopened |
| 12 | Structure of the K ∈ [2,5] container (SCC, frequencies, factors) | **not found** | — | rows 51, 52, 62 | no — measured loose three times over |
| 13 | AA2FR language | **not found** | — | rows 27, 33, 35 | **yes, essentially untouched** |
| 14 | k-abelian hierarchy | **yes** (Fici & Puzynina Thm 65) | the 2-abelian ternary case is solved | no module | a possible yardstick |
| 15 | Proportion/density of morphisms satisfying Theorem 2.4's affine condition in the search space | **not found in checked sources** | Semantic Scholar's full citation graph for both source papers (2408.15390: 1 citer; 2111.07857: 2 citers) + targeted search terms ("affine morphism fraction/density eligibility additive powers", "how many morphisms affine eigenvalue decidable power-free") | row 73 | **yes — this is a gap if the check holds** |

**Row 15's side observation, traced but not built on:** the search found a
recent (2026-05, rev. 2026-07) paper, **Eyidoğan, Göral & Tanısalı, "Box
Progressions, Abelian Power-Free Morphisms and A Sieve Technique for the
Template Method", arXiv:2605.20504** — abstract read and quoted, the full
paper not opened. It does not measure the same quantity: it concerns
**abelian** (not additive) power-freeness over a **binary** alphabet, and
its "sieve" reduces **ancestor-computation cost** in the template method,
not the proportion of eligible morphisms in the search space. So it does
not answer row 73's question, but it is a possible lead for speeding up
`additive-affine-decision.js`'s own ancestor computation at larger k, if
and when that becomes necessary. **Not to be cited substantively until the
full paper is opened.**

---

## 4. Where the gaps are — the case for rows 6, 10, 13

Three points where nothing was found in the opened sources and where the
project's own machinery is already in place:

1. **Non-uniform morphisms (row 6).** Every sweep this project has done,
   and everything found in the literature, concerns uniform morphisms.
   The non-uniform space is genuinely larger, and nothing has been done
   there.
2. **Additive-square alphabet classification (row 10).** 20 of 31 classes
   remain unresolved, and the unbalanced classes are the part where
   overlap with the literature has not even been suspected.
3. **AA2FR (row 13).** The project's own constraint, for which no external
   source was found. This is also a warning: the language is the
   project's own definition (FORBID4, row 9), so "not in the literature"
   may also mean "not of interest to anyone else".

---

## 5. Maintenance rule

A row is added here only once **the source has been opened and the search
terms recorded**. The "Found" column accepts only three values:

- **yes** — found, cited in `MATH_CLAIMS.md`
- **open** — the source explicitly states the question is open, citation
  in the ledger
- **not found** — not found in the opened sources, search terms recorded

**There is no fourth value, "does not exist."** If someone wants to claim
that, it requires an exhaustive search, and none has been done in this
project.
