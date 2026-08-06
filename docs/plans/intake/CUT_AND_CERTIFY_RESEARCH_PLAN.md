# Cut-and-Certify Research Plan for Abelian-Square Avoidance

## A cautious experimental program inspired by layered cutting, retained history, and combinatorial obstruction diagrams

**Suggested repository path:** `docs/plans/CUT_AND_CERTIFY_RESEARCH_PLAN.md`  
**Status:** exploratory research plan  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary scope:** AA2F and AA2FR finite words, D40-guided search, exact verification, and structural conjecture generation  
**Related systems:** Java COW Backtracker v1.2, C++ AA2FR/FORBID4 backtracker, D40 dictionary, record pipeline, conjecture pipeline

---

# 0. Executive summary

This document proposes a new experimental research line called:

> **Cut-and-Certify**

The idea is inspired by a broad proof-design principle appearing in the long-time hard-sphere-to-Boltzmann work of Yu Deng, Zaher Hani, and Xiao Ma:

1. divide a long object into shorter layers;
2. retain the history or correlation information needed across layers;
3. encode complicated interactions as combinatorial objects;
4. cut those objects into controllable pieces;
5. certify the remainder rather than discarding inconvenient cases.

There is **no claimed direct mathematical transfer** from Hilbert’s Sixth Problem, kinetic theory, collision histories, or cumulants to combinatorics on words.

The proposed connection is methodological.

For the current project, the analogous problem is:

```text
A long word is difficult to validate or construct globally.

Local windows are manageable,
but long Abelian squares can cross many local boundaries.

Therefore:
cut the word or the obstruction set into manageable pieces,
retain all boundary information required by global avoidance,
and verify every unresolved case exactly.
```

The initial objective is not to prove Mäkelä’s conjecture.

The initial objectives are:

- construct an exact block-join verifier;
- create independently checkable cut certificates;
- classify cross-boundary Abelian-square obligations;
- test whether useful boundary signatures exist;
- determine whether D40 seam rigidity reduces the unresolved work;
- identify where finite local summaries fail;
- produce new structural observations for the conjecture pipeline;
- stop the line quickly if it provides no advantage.

The core rule is:

> **Cutting may reorganize the work, but it may never silently remove cases.**

---

# 1. Source basis and scope boundary

## 1.1 What the source material actually says

The source article describes the hard-sphere proof architecture as:

- dividing long time into shorter layers;
- preserving information passed between layers;
- tracking correlations rather than assuming independence;
- encoding collision histories into combinatorial diagrams called molecules;
- using a cutting algorithm to decompose large structures into pieces that can be bounded.

The primary hard-sphere paper’s abstract similarly says that the argument:

- propagates a long-time cumulant ansatz retaining full collision history;
- reduces estimates to combinatorial properties of associated diagrams;
- proves those properties using an elaborate cutting algorithm.

## 1.2 What this plan infers

The following are project-specific inferences, not claims made by the physics papers:

- words can be cut into certified blocks;
- Abelian-square candidates can be represented as obstruction triples;
- D40 factors may act as local building blocks;
- seam information may form a useful boundary signature;
- obstruction triples may be organized into a hypergraph or diagram;
- hierarchical cuts may improve verification, search ordering, parallelism, or explanation.

## 1.3 What this plan does not claim

This plan does not claim:

- that Mäkelä’s conjecture is related to Hilbert’s Sixth Problem;
- that the hard-sphere cutting algorithm applies directly to words;
- that collision-history molecules correspond mathematically to Abelian squares;
- that a finite sufficient boundary state exists;
- that block decomposition will improve asymptotic complexity;
- that local D40 compatibility implies global AA2F or AA2FR validity;
- that a cycle in a local graph proves an infinite valid word.

---

# 2. Project definitions

## 2.1 AA2F

A finite ternary word is AA2F when it contains no Abelian square whose half-length is:

\[
K \ge 2.
\]

Length-one repetitions are permitted.

## 2.2 AA2FR

AA2FR is AA2F plus the six FORBID4 factors:

```text
baac
caab
abbc
cbba
accb
bcca
```

## 2.3 D40

A D40 dictionary is a versioned set of 40-letter factors.

In hard-D40 mode:

```text
every length-40 factor must belong to the dictionary
```

D40 is a local model and search restriction unless completeness is separately proved.

## 2.4 Exact result versus heuristic observation

An exact result must be based on:

- a precisely defined finite universe;
- a complete algorithm for that universe;
- independently checked implementation;
- preserved artifacts and manifests.

A heuristic observation may guide search but cannot be promoted directly into a mathematical claim.

---

# 3. Key mathematical reformulation: prefix paths and arithmetic progressions

This reformulation is central to the proposed research line.

## 3.1 Prefix Parikh vectors

For a word \(w=w_0w_1\ldots w_{n-1}\), define:

\[
P(i)=
\bigl(
A(i),B(i),C(i)
\bigr),
\]

where \(A(i)\), \(B(i)\), and \(C(i)\) are the counts of `a`, `b`, and `c` in the prefix:

\[
w[0..i).
\]

Thus:

\[
P(0)=(0,0,0).
\]

## 3.2 Abelian-square condition

A factor beginning at \(s\) with half-length \(K\) is an Abelian square exactly when:

\[
P(s+K)-P(s)
=
P(s+2K)-P(s+K).
\]

Equivalently:

\[
P(s)+P(s+2K)
=
2P(s+K).
\]

Therefore, an Abelian square corresponds to a three-term arithmetic progression in the prefix-Parikh path at equally spaced indices:

```text
s, s+K, s+2K
```

with \(K\ge2\).

## 3.3 Reduced coordinates

Because:

\[
A(i)+B(i)+C(i)=i,
\]

the `c` coordinate is redundant when the indices are known.

One may work with:

\[
Q(i)=\bigl(i,A(i),B(i)\bigr).
\]

Then an Abelian square exists exactly when:

\[
Q(s)+Q(s+2K)=2Q(s+K)
\]

for some \(K\ge2\).

## 3.4 Why this matters for cutting

Instead of viewing the problem only as:

```text
find two adjacent blocks with equal Parikh vectors
```

we may view it as:

```text
avoid forbidden equally spaced triples in a lattice path
```

A cut in the word becomes a cut in the sequence of prefix points.

Every forbidden triple is then classified as:

- entirely left of the cut;
- entirely right of the cut;
- crossing the cut.

If the left and right segments are already certified internally, a join verifier needs to inspect only the crossing triples.

## 3.5 Research caution

This reformulation does not automatically yield a faster algorithm.

Detection of Abelian-square factors is connected in the algorithms literature to 3SUM-style hardness and arithmetic-progression problems. The project should therefore treat strongly subquadratic general detection and very small finite summaries as research hypotheses, not expectations.

---

# 4. The Cut-and-Certify principle

The project version of the source-inspired principle is:

```text
CUT LOCALLY
Partition words, prefix paths, K-scales, or obstruction triples.

REMEMBER GLOBALLY
Preserve the boundary data and history needed by crossing constraints.

CERTIFY THE REMAINDER
Run an exact verifier on every case not eliminated by a proved rule.
```

A candidate optimization is acceptable only if every rejected case satisfies one of:

1. it is rejected by a proved mathematical implication;
2. it remains represented in a complete exact subproblem;
3. it is rejected only in an explicitly heuristic search mode.

---

# 5. Four possible meanings of “cut”

The project should test these separately.

## 5.1 Cut the word into blocks

Example:

```text
[ block 0 ][ block 1 ][ block 2 ][ block 3 ]
```

Possible block lengths:

```text
40
80
160
320
```

## 5.2 Cut the prefix path

Partition the sequence:

```text
Q(0), Q(1), ..., Q(n)
```

into contiguous index intervals.

## 5.3 Cut the half-length scale

Group candidate half-lengths into dyadic or fixed bands:

```text
K = 2..7
K = 8..15
K = 16..31
K = 32..63
...
```

## 5.4 Cut the obstruction set

Each possible violation is represented by:

```text
(s, K)
```

or equivalently by the triple:

```text
(s, s+K, s+2K)
```

The complete obstruction universe may be partitioned by:

- endpoint;
- center;
- half-length band;
- block-incidence pattern;
- cut-crossing type;
- D40 seam type.

This last interpretation is often the safest because it partitions the verification obligations directly.

---

# 6. Obstruction diagrams

## 6.1 Obstruction triple

Define a candidate obstruction:

```yaml
start: s
middle: s + K
end: s + 2K
half_length: K
```

It becomes an actual Abelian square when:

```text
P(start) + P(end) = 2 P(middle)
```

## 6.2 Hypergraph view

Construct a 3-uniform candidate hypergraph:

```text
vertices: prefix indices 0..n
candidate hyperedge: every equally spaced triple with K >= 2
violating hyperedge: candidate triple satisfying the Parikh midpoint equality
```

A valid AA2F word has no violating hyperedges.

## 6.3 Cut incidence type

For a cut at prefix index \(c\), classify a triple by where its three vertices lie.

Possible types include:

```text
LLL
LLR
LRR
RRR
```

where `L` and `R` refer to the two sides of the cut.

If both child segments are internally valid:

- `LLL` is already certified by the left child;
- `RRR` is already certified by the right child;
- only `LLR` and `LRR` need join verification.

## 6.4 Obstruction witness

When a join fails, preserve:

```yaml
start: 1204
middle: 1241
end: 1278
half_length: 37
left_parikh: [12, 13, 12]
right_parikh: [12, 13, 12]
cut_position: 1250
cut_type: LRR
```

These witnesses form the raw material for:

- negative-frontier analysis;
- seam statistics;
- structural conjectures;
- CEGIS constraints;
- verifier regression tests.

---

# 7. Exact segment certificates

The first implementation must use certificates that are correct even if they are not compressed.

## 7.1 Segment certificate

Suggested schema:

```yaml
schema_version: 1
certificate_id: SEG-000001

artifact:
  path: segment.txt
  sha256: "..."
  length: 160
  alphabet: [a, b, c]

class:
  aa2f: true
  aa2fr: true
  d40_id: D40-0001
  d40_defect: 0

summary:
  parikh: [53, 54, 53]
  first_40_hash: "..."
  last_40_hash: "..."

verification:
  internal_status: verified
  verifier: cut-certify-reference-v1
  verifier_commit: "..."
```

## 7.2 Join certificate

```yaml
schema_version: 1
certificate_id: JOIN-000001

left: SEG-000001
right: SEG-000002
cut_position: 160

children:
  left_internal_verified: true
  right_internal_verified: true

crossing_check:
  method: exact-cross-triple-enumeration
  candidate_count: 18920
  violating_count: 0
  enumeration_checksum: "..."

result:
  combined_length: 320
  status: verified
```

## 7.3 Certificate meaning

A join certificate means:

> Both children were internally verified, and every candidate Abelian-square triple crossing this cut was checked exactly.

It does not mean:

- that the certificate is minimal;
- that the boundary signature is sufficient;
- that all other blocks with the same summary are interchangeable.

## 7.4 Independent certificate checker

Create a separate checker:

```text
cut-cert-check
```

It must:

- read child artifacts or child certificates;
- recompute the cut obligations;
- verify all crossing triples;
- verify checksums;
- reject missing or duplicated obligation ranges.

---

# 8. Exact cut-join verifier

## 8.1 Baseline problem

Given two internally valid words \(L\) and \(R\), verify whether:

```text
L + R
```

is valid.

Every new violation must cross the cut between them.

## 8.2 Reference algorithm

1. Construct prefix Parikh vectors for \(L+R\).
2. Enumerate all \((s,K)\) such that:
   - \(K\ge2\);
   - \(s+2K\le |L|+|R|\);
   - the interval \([s,s+2K)\) crosses the cut.
3. Test the Parikh equality.
4. In AA2FR mode, also verify any FORBID4 factor crossing the cut.
5. Return the first witness or success.

## 8.3 Completeness argument

Because the children are internally valid:

- any violation wholly inside \(L\) is impossible;
- any violation wholly inside \(R\) is impossible;
- every remaining violation crosses the cut;
- the crossing enumeration covers every remaining candidate.

This must be formally documented and unit-tested.

## 8.4 Expected complexity

The exact cost depends on the sizes of both segments.

This baseline is not promised to be asymptotically better than full verification.

Its immediate benefits are:

- modularity;
- parallelism;
- reusable child certificates;
- localized failure witnesses;
- clear proof obligations;
- hierarchical verification;
- independent auditability.

---

# 9. Hierarchical cut trees

## 9.1 Balanced certificate tree

For a word split into equal blocks:

```text
B0 B1 B2 B3 B4 B5 B6 B7
```

build:

```text
          [0..7]
         /      \
      [0..3]   [4..7]
      /   \     /   \
   [0..1][2..3][4..5][6..7]
```

Leaves are internally verified blocks.

Each internal node contains a join certificate.

## 9.2 Advantages

- parallel verification;
- local recomputation after one block changes;
- reusable block certificates;
- failure localization;
- scalable external review packets;
- deterministic certificate structure.

## 9.3 Character-level versus block-level construction

Character-by-character backtracking remains the exact search baseline.

Cut trees initially serve as:

- independent verification;
- record anatomy;
- block-library experiments;
- construction-family testing.

They should not replace the working backtracker until equivalence is demonstrated.

---

# 10. Boundary signatures

A boundary signature is an attempted compact summary of a segment’s future interaction behavior.

## 10.1 Exact but large boundary data

For a block \(B\), exact local data may include:

- all prefix Parikh vectors;
- all suffix Parikh vectors;
- total Parikh vector;
- normalized prefix path;
- normalized reversed suffix path;
- first and last 40 letters;
- internal certificate;
- D40 start and end states.

This is not necessarily compact, but it is a correct starting point.

## 10.2 Candidate compressed signature

Possible fields:

```yaml
length: 160
parikh: [53, 54, 53]

prefix_profiles:
  selected_lengths: [...]
  vectors: [...]

suffix_profiles:
  selected_lengths: [...]
  vectors: [...]

scale_summaries:
  K_2_7: ...
  K_8_15: ...
  K_16_31: ...

d40:
  start_state: ...
  end_state: ...
  forced_corridor_entry: ...
  forced_corridor_exit: ...
```

## 10.3 Soundness rule

A compressed signature may be used for hard pruning only after proving:

> If two segments have the same signature, then they are interchangeable for the stated join property.

Without such a proof, it may be used only for:

- ordering;
- clustering;
- caching candidate comparisons;
- experimental analysis;
- conjecture generation.

## 10.4 Signature collision search

Actively search for:

```text
same proposed boundary signature
but different compatibility with the same neighboring segment
```

One such example rejects the proposed sufficient-state claim.

This should be automated.

---

# 11. Open obligations

The phrase “remember globally” can be implemented as an obligation system.

## 11.1 Informal idea

A partial segment may create potential future equalities that are not yet violations because one endpoint lies outside the current segment.

Store those unresolved possibilities as obligations.

## 11.2 Possible obligation record

```yaml
scale_band: K_32_63
known_endpoint_relation: ...
required_future_parikh_difference: [4, -2, -2]
maximum_remaining_distance: 41
origin_cut: CUT-0012
```

## 11.3 Research status

This is exploratory.

The project must first define precisely:

- what an obligation represents;
- how obligations are updated when a symbol or block is appended;
- how they expire;
- whether the representation is finite;
- whether two obligation sets can be merged;
- whether obligation equality implies future equivalence.

## 11.4 Failure possibility

The complete future-relevant state may grow with word length.

Discovering that no practically small sufficient obligation state exists would still be a useful negative result.

---

# 12. Scale decomposition

## 12.1 Dyadic bands

Partition \(K\) into:

\[
[2,3], [4,7], [8,15], [16,31], \ldots
\]

or:

```text
K in [2^j, 2^(j+1)-1]
```

## 12.2 Why scale bands may help

Different scales may interact differently with:

- D40 windows;
- block boundaries;
- letter-frequency drift;
- record-word structure;
- forced corridors;
- seam rigidity.

## 12.3 Exactness requirement

Every \(K\ge2\) must belong to exactly one band.

The band partition must be complete and non-overlapping.

A scale-specific shortcut must either:

- prove all candidates in that band impossible;
- enumerate them exactly;
- or leave them for the reference checker.

## 12.4 Scale telemetry

For each run, collect:

```text
candidate checks by K band
rejections by K band
time by K band
first failure by K band
cut-crossing patterns by K band
```

This may reveal where computational effort actually lies.

---

# 13. D40 as the local layer

## 13.1 Existing role

D40 checks overlapping 40-letter windows.

This is already a form of local decomposition.

## 13.2 Cut-and-Certify interpretation

```text
D40:
local layer model

prefix-Parikh checker:
global remainder certifier
```

## 13.3 D40 cannot certify long-range avoidance

An Abelian square with large \(K\) can cross many D40 windows.

Therefore:

```text
all windows in D40
```

does not imply:

```text
globally AA2FR
```

unless separately proved.

## 13.4 D40 seam experiments

For block joins, measure:

- whether all new 40-windows crossing the cut belong to D40;
- number of possible short bridge paths;
- forced versus branching transitions;
- whether D40-compatible joins are usually globally valid;
- which long-\(K\) violations survive local compatibility.

---

# 14. Seam certificates

## 14.1 Local seam certificate

For two blocks:

```yaml
left_block: BLOCK-001
right_block: BLOCK-002

forbid4_crossing:
  status: passed

d40_crossing:
  dictionary_id: D40-0001
  windows_checked: 39
  missing_windows: 0
```

## 14.2 Global seam certificate

Add exact crossing Abelian-square checks:

```yaml
abelian_crossing:
  candidate_count: 18920
  checked_half_lengths:
    minimum: 2
    maximum: 159
  violating_count: 0
```

## 14.3 Seam rigidity metrics

For fixed contexts, measure:

- number of valid bridge strings;
- number of D40-valid bridges;
- number of globally AA2FR-valid bridges;
- unique-completion rate;
- minimum bridge length;
- first failing \(K\);
- distribution across independent records.

---

# 15. Cut profiles for record words

Every verified record can receive a cut profile.

## 15.1 Profile fields

For block size \(B\):

```yaml
record_id: REC-AA2FR-0003
block_size: 40
block_count: 53

cuts:
  total: 52
  locally_d40_compatible: 52
  globally_valid: 52

crossing_obligations:
  total_candidates: ...
  by_scale: ...
  closest_to_zero_parikh_difference: ...

failure_margin:
  minimum_l1_difference: ...
  minimum_linf_difference: ...
```

## 15.2 Difference margin

For a candidate \((s,K)\), define:

\[
D(s,K)
=
P(s)+P(s+2K)-2P(s+K).
\]

A violation has:

\[
D(s,K)=0.
\]

For valid words, study:

```text
||D(s,K)||_1
||D(s,K)||_∞
```

The smallest nonzero difference gives a “near-obstruction” margin.

This is descriptive telemetry, not proof of future extendability.

## 15.3 Why this may be useful

It may reveal:

- cuts repeatedly close to violation;
- scales responsible for rigidity;
- record words with different obstruction geometry;
- candidate restart points;
- potential invariants;
- whether record families share the same near-obstruction profile.

---

# 16. Exact experimental milestones

## E1 — Prefix-path equivalence

Implement both:

- standard Parikh-block Abelian-square detection;
- prefix-path arithmetic-progression detection.

Test exhaustively for all ternary words up to a selected feasible length.

Acceptance:

```text
identical validity result
identical first violation
identical start and K
```

## E2 — Exact join equivalence

For internally valid word pairs \((L,R)\), compare:

```text
full independent verifier on L+R
vs.
child certificates + crossing-only join verifier
```

Use:

- exhaustive short pairs;
- random medium pairs;
- known record blocks;
- deliberately corrupted joins.

Acceptance:

```text
zero mismatches
```

## E3 — Balanced certificate tree

Take a known verified record.

Create leaf blocks and recursively join them.

Acceptance:

- root result valid;
- root checksum matches the record;
- every obligation range is covered exactly once;
- changing one symbol causes a reproducible failing witness.

## E4 — Block-size benchmark

Test:

```text
B = 20, 40, 80, 160, 320
```

Measure:

- certificate size;
- join time;
- total verification time;
- parallel efficiency;
- number of cross-cut candidates;
- failure localization quality.

No speed improvement is assumed.

## E5 — D40 seam study

For known AA2FR records:

- replay every cut;
- calculate new crossing D40 windows;
- calculate exact crossing obligations;
- compare local and global acceptance.

## E6 — Scale profile

Record exact verification workload by \(K\)-band.

Determine whether a small number of bands dominate cost or failures.

## E7 — Boundary-signature challenge

Propose one compact signature.

Search for two blocks with:

```text
same signature
different compatibility outcome
```

A counterexample rejects sufficiency.

## E8 — Obligation-state prototype

Define one precise obligation model.

Run it in parallel with the exact verifier.

It may guide ordering but not prune.

Compare:

- state size growth;
- prediction accuracy;
- false-equivalence examples;
- update cost.

## E9 — Independent implementation

Implement the cut certificate checker independently in:

- Java and C++;
- or Java and a simple Python reference for short cases.

Require exact agreement on test corpora.

---

# 17. Integration with Java COW Backtracker v1.2

The stable search core should not be rewritten immediately.

## 17.1 Initial integration: analysis only

Add a separate command or tool:

```text
cut-analyze
```

Input:

- verified word;
- class;
- block size;
- optional D40 dictionary.

Output:

- certificate tree;
- cut profile;
- obstruction statistics;
- seam witnesses;
- checksums.

## 17.2 Second integration: independent certification

After equivalence testing, allow:

```text
search result
→ existing IndependentVerifier
→ CutCertificateVerifier
```

Both must pass.

## 17.3 Third integration: ordering heuristic

Use cut metrics only to order branches:

- lower near-obstruction risk first;
- D40-compatible seams first;
- preferred scale profile first.

No branch is removed.

## 17.4 Hard pruning threshold

Hard pruning is permitted only when:

- a formal implication is written;
- exhaustive small-case testing passes;
- independent implementations agree;
- a checker validates the certificate;
- the claim is reviewed in the conjecture pipeline;
- failure behavior is covered by regression tests.

---

# 18. Integration with the C++ AA2FR/FORBID4 engine

The C++ engine is valuable as an independent implementation.

## 18.1 Shared artifact format

Use language-neutral JSON certificates.

## 18.2 Cross-check tasks

Compare:

- prefix-path encoding;
- obstruction count;
- crossing-triple enumeration;
- first violation witness;
- D40 seam coverage;
- certificate-tree root result.

## 18.3 Avoid shared implementation bugs

Java and C++ should not copy the same loop structure verbatim.

For example:

- Java may enumerate by endpoint and \(K\);
- C++ may enumerate by center and radius.

They should still cover the same obligation set.

---

# 19. New search strategies enabled by the plan

These remain experimental.

## 19.1 Certified block assembly

Instead of appending one letter, append preverified blocks.

For every candidate join:

1. check local FORBID4 seam;
2. check D40 seam;
3. run exact crossing certificate;
4. accept only if all pass.

Potential benefit:

- larger search steps;
- block-library reuse;
- parallel join testing.

Risk:

- branching over blocks may be enormous;
- exact join checking may dominate;
- useful words may not align with the selected block library.

## 19.2 Meet-in-the-middle bridge search

Given left and right certified contexts:

- generate possible left bridge halves;
- generate possible right bridge halves;
- match boundary summaries;
- verify full bridges exactly.

Use only as candidate generation.

## 19.3 Certificate-guided CEGIS

For a failed morphism or block construction:

- extract minimal cross-cut obstruction witnesses;
- convert them into constraints;
- regenerate candidates avoiding those witnesses;
- retain the full exact verifier as oracle.

## 19.4 Near-obstruction ordering

Prefer candidate extensions whose new difference vectors stay farther from zero across selected scales.

This is a heuristic only.

It may be useful or may actively mislead the search.

## 19.5 Cut-frontier search

Retain several partial constructions that are non-dominated by:

- length;
- number of compatible block joins;
- boundary-state diversity;
- minimum obstruction margin;
- D40 defect;
- independent lineage.

Do not collapse these into a single score.

---

# 20. New concrete idea: normalized block paths

## 20.1 Definition

For a block \(B\), store its normalized prefix path:

\[
R_B(j)
=
P_B(j)-P_B(0).
\]

This begins at zero and ends at the block’s Parikh vector.

## 20.2 Translation under concatenation

When appending \(B\) after a prefix ending at global Parikh vector \(v\), its global path is:

\[
v + R_B(j).
\]

Thus the internal geometry of a block can be reused under translation.

## 20.3 Research use

- hash normalized block paths;
- compare repeated block geometry;
- match candidate seams;
- build block libraries;
- identify translations producing arithmetic-progression triples.

## 20.4 Limitation

Translation invariance does not remove dependence on the earlier global path.

Cross-block triples may involve prefix points arbitrarily far before the seam.

---

# 21. New concrete idea: obstruction fingerprints

For each cut, create a fingerprint of all nonzero difference vectors:

\[
D(s,K)=P(s)+P(s+2K)-2P(s+K)
\]

for crossing triples.

Possible summaries:

- multiset hash;
- minimum norm;
- count by norm;
- count by scale;
- nearest vectors to zero;
- symmetry-canonical representation.

Uses:

- record comparison;
- anomaly detection;
- clustering;
- regression checks.

A fingerprint is not a certificate unless it is collision-free or accompanied by exact data.

---

# 22. New concrete idea: exact obligation coverage ledger

A cut certificate should record which candidate pairs \((s,K)\) it checked.

## 22.1 Range representation

Instead of listing all pairs individually, encode deterministic ranges:

```yaml
cut: 160
obligation_ranges:
  - endpoint_start: 161
    endpoint_end: 320
    K_rule: "all K>=2 whose interval crosses cut"
```

## 22.2 Coverage checker

The independent checker verifies:

- every crossing \((s,K)\) is included;
- no internal-only pair is required;
- no pair is missing;
- duplicate coverage is allowed only if declared;
- child and parent obligation sets partition the full universe.

This addresses a common danger in decomposition algorithms:

> the local checks may all be correct while the decomposition silently omits a class of cases.

---

# 23. New concrete idea: no-go search for finite boundary memory

The project should not only search for a useful finite signature.

It should also search for evidence that proposed finite memories are insufficient.

## 23.1 Equivalence challenge

For signature function \(S\), find:

```text
segments X and Y with S(X)=S(Y)
neighbor Z
such that XZ is valid and YZ is invalid
```

or the reverse.

## 23.2 Minimal counterexample

Minimize:

- segment length;
- neighbor length;
- alphabet permutation;
- cut location;
- first failing \(K\).

## 23.3 Value of a negative result

A systematic family of such counterexamples may support a theorem of the form:

> No signature of this specified class and radius is sufficient.

This can prevent years of work on an impossible local-state model.

---

# 24. New concrete idea: character-to-block consistency test

The same target word can be constructed by:

- character-level append;
- fixed 40-block append;
- mixed block sizes;
- balanced recursive joins.

All paths should produce equivalent final certificates.

Create a regression suite requiring:

```text
same word checksum
same global validity
same complete obstruction universe
zero violating triples
```

The enumeration order may differ, but the mathematical coverage must agree.

---

# 25. Performance expectations

## 25.1 What may improve

- parallel verification;
- reuse of certified blocks;
- incremental recomputation after edits;
- failure localization;
- D40 seam filtering;
- search ordering;
- external auditability;
- construction-family evaluation.

## 25.2 What may not improve

- worst-case asymptotic detection complexity;
- character-level DFS branching;
- memory use;
- general AA2F verification time.

## 25.3 Complexity claims

Every implementation report must distinguish:

```text
per candidate
per join
per certificate tree
per complete word
per search node
total search complexity
```

Do not describe dictionary membership, join verification, or whole-search cost as simply “O(1).”

---

# 26. Research-harvest outputs

The line can produce valuable results even without a faster search.

## 26.1 Exact outputs

- verified join certificates;
- complete cut profiles;
- exact scale histograms;
- exact D40 seam counts;
- minimal cross-cut violations;
- independently reproduced certificate trees.

## 26.2 Observational outputs

- recurring obstruction shapes;
- near-zero difference patterns;
- scale concentration;
- record lineage similarities;
- candidate boundary signatures;
- possible finite-memory failures.

## 26.3 Promotion path

```text
telemetry
→ bounded observation
→ formal conjecture
→ challenge package
→ exact bounded result / counterexample / proof
```

---

# 27. Proposed repository structure

```text
research/
  cut-and-certify/
    README.md

    definitions/
      PREFIX_PATH.md
      OBSTRUCTION_TRIPLE.md
      CUT_CERTIFICATE.md
      BOUNDARY_SIGNATURE.md

    schemas/
      segment-certificate.schema.json
      join-certificate.schema.json
      cut-profile.schema.json
      obligation-ledger.schema.json

    experiments/
      E01-prefix-path-equivalence/
      E02-join-equivalence/
      E03-certificate-tree/
      E04-block-size-benchmark/
      E05-d40-seams/
      E06-scale-profile/
      E07-signature-challenge/
      E08-obligation-state/
      E09-cross-language/

    certificates/
      records/

    witnesses/
      violations/
      signature-counterexamples/
      dictionary-disagreements/

    analyses/
      record-cut-profiles/
      scale-histograms/
      obstruction-fingerprints/

scripts/
  cut-analyze.java
  cut-cert-check.java
  cut-profile-export.js
  obstruction-minimize.js
```

---

# 28. Run manifest

Every experiment should record:

```yaml
run_id: CUT-20260805-0001
experiment: E02-join-equivalence
git_commit: "..."

input:
  left_sha256: "..."
  right_sha256: "..."
  class: AA2FR
  dictionary_id: D40-0001

cut:
  position: 160
  block_size: 160

algorithm:
  implementation: java
  method: crossing-triple-reference-v1

coverage:
  candidate_crossing_triples: 18920
  enumeration_checksum: "..."

result:
  valid: true
  first_violation: null

interpretation_limits:
  - no claim of asymptotic speedup
  - certificate applies only to supplied artifacts
```

---

# 29. Epistemic labels

Use explicit states.

```text
IDEA
FORMAL_DEFINITION
REFERENCE_IMPLEMENTED
EQUIVALENCE_TESTED
INDEPENDENTLY_REPRODUCED
HEURISTIC_ONLY
SOUND_PRUNING_PROVED
EXACT_BOUNDED_RESULT
REJECTED
```

A boundary signature starts as:

```text
HEURISTIC_ONLY
```

It cannot become:

```text
SOUND_PRUNING_PROVED
```

through empirical success alone.

---

# 30. Failure modes

## 30.1 Missing crossing class

A cut checker omits one incidence pattern or endpoint range.

Mitigation:

- obligation coverage ledger;
- comparison with full verifier;
- exhaustive short cases.

## 30.2 Double-counting interpreted as completeness

Two certificate layers check many of the same cases while another class is absent.

Mitigation:

- explicit partition of the obligation universe.

## 30.3 Local-state fallacy

Same suffix or D40 state is assumed to imply the same future behavior.

Mitigation:

- signature collision search;
- no hard pruning without proof.

## 30.4 Heuristic filtering becomes invisible

A fast experimental filter is later treated as exact.

Mitigation:

- mode labels;
- manifests;
- CI checks;
- separate exact and heuristic APIs.

## 30.5 Certificate and artifact drift

A word changes without regenerating its certificate.

Mitigation:

- SHA-256 binding;
- immutable artifacts;
- checker rejection.

## 30.6 Attractive but useless decomposition

The cut system adds complexity without speed, insight, or reuse.

Mitigation:

- predefined stop criteria.

---

# 31. Stop criteria

Pause or terminate the line if, after the baseline experiments:

- exact joins are consistently slower and provide no useful reuse;
- certificate files are impractically large;
- D40 seam data predicts nothing beyond existing checks;
- every tested compact signature fails immediately;
- obligation states grow essentially with the entire prefix;
- no new structural observations survive independent testing;
- implementation complexity threatens the stable backtracker.

A negative conclusion should be documented rather than hidden.

---

# 32. Phased implementation roadmap

## Phase 0 — document the analogy correctly

- add this plan;
- add source references;
- state that the transfer is methodological only.

## Phase 1 — mathematical reference layer

- implement prefix-path encoding;
- implement arithmetic-progression violation detection;
- prove equivalence in project documentation;
- add exhaustive small-word tests.

## Phase 2 — exact crossing verifier

- define cut incidence types;
- implement crossing-only join verification;
- compare against the independent full verifier;
- preserve first witnesses.

## Phase 3 — certificates

- define segment and join schemas;
- implement deterministic certificate generation;
- implement independent checker;
- bind all certificates to SHA-256.

## Phase 4 — balanced cut trees

- certify one known record;
- add mutation tests;
- compare several block sizes;
- benchmark parallel verification.

## Phase 5 — D40 integration

- add local seam certificates;
- replay known AA2FR records;
- compare local compatibility with global obligations;
- calculate seam rigidity.

## Phase 6 — obstruction analysis

- create cut profiles;
- create scale histograms;
- calculate difference margins;
- store minimal violations.

## Phase 7 — signature experiments

- propose one compact boundary signature;
- use only for clustering and ordering;
- run adversarial collision search;
- reject or refine it.

## Phase 8 — search integration

- add optional cut-derived ordering to Java;
- run controlled A/B benchmarks;
- preserve exact fallback;
- do not hard-prune.

## Phase 9 — proof-oriented promotion

Only if a sufficient signature or sound decomposition rule is proved:

- add hard-pruning mode;
- create proof obligations;
- independently audit;
- place exact claims in the claims ledger.

---

# 33. First 12 concrete tasks

1. Add this document to `docs/plans/`.
2. Write `PREFIX_PATH.md` with the exact equivalence formula.
3. Implement a slow prefix-path reference detector.
4. Exhaustively compare it with `IndependentVerifier`.
5. Define cut incidence types.
6. Implement the exact crossing-only join verifier.
7. Test it on all short valid child pairs.
8. Define JSON schemas for segment and join certificates.
9. Certify one verified record using block size 40.
10. Mutate one symbol and verify that the tree produces a precise witness.
11. Generate a scale histogram for the same record.
12. Decide from measurements whether Phase 5 is justified.

---

# 34. Acceptance criteria for the first usable prototype

- [ ] Prefix-path equivalence is documented.
- [ ] All short exhaustive tests agree.
- [ ] Crossing-only join verification matches full verification.
- [ ] FORBID4 seam handling is included in AA2FR mode.
- [ ] Every certificate is checksum-bound.
- [ ] An independent checker validates certificates.
- [ ] Obligation coverage is complete and testable.
- [ ] One verified record has a complete certificate tree.
- [ ] One corrupted record produces a minimal witness.
- [ ] Complexity is measured rather than assumed.
- [ ] No heuristic summary is used for sound pruning.
- [ ] Source-derived ideas and project inferences are clearly separated.

---

# 35. Decision gates

## Gate A — mathematical correctness

Proceed only if E1 and E2 show zero mismatches.

## Gate B — certificate value

Proceed only if certificates improve at least one of:

- auditability;
- parallel verification;
- failure localization;
- reusable record analysis.

## Gate C — D40 value

Proceed only if D40 seam analysis supplies information not already visible from basic verification.

## Gate D — search value

Integrate with the backtracker only if controlled tests show:

- measurable ordering value;
- no completeness loss;
- manageable overhead.

## Gate E — hard pruning

Permit hard pruning only after a reviewed proof.

---

# 36. Possible long-term outcomes

## Outcome 1 — verification architecture

The method becomes a robust way to certify long records in parallel.

This is useful even without a new theorem.

## Outcome 2 — structural research tool

Cut profiles reveal recurring scales, seams, or obstruction geometries.

These become formal conjectures.

## Outcome 3 — construction engine

Certified blocks and joins generate new long words or construction families.

## Outcome 4 — finite-state theorem

A sufficient boundary state is discovered and proved.

This could materially change the project.

## Outcome 5 — no-go result

A broad class of finite boundary signatures is shown insufficient.

This also advances the research map.

## Outcome 6 — negative engineering result

The method is correct but slower and less informative than the current checker.

Document and stop.

---

# 37. Final principle

The useful lesson is not:

> copy a cutting algorithm from mathematical physics.

It is:

> **When a global combinatorial object is too complicated, cut the verification obligations into controlled pieces, preserve every dependency crossing the cuts, and certify the unresolved remainder exactly.**

For this project:

```text
Cut locally:
  blocks, prefix-path intervals, K-scales, obstruction triples

Remember globally:
  Parikh-prefix history, boundary profiles, open obligations

Certify the remainder:
  exact crossing checks and independent verification
```

The plan succeeds if it produces any of:

- a more auditable verification system;
- reusable certified blocks;
- a meaningful obstruction language;
- a validated search-ordering heuristic;
- a formal structural conjecture;
- a proof-quality decomposition;
- or a clear negative result showing why local cutting is insufficient.

It does not need to solve Mäkelä’s conjecture to be worthwhile.

---

# 38. References and provenance

## Source inspiration

- Sandbox Physics, “One box. Three worlds.”  
  https://sandboxphysics.com/stories/yu-deng-fields-medal/

- Yu Deng, Zaher Hani, Xiao Ma, “Long time derivation of the Boltzmann equation from hard sphere dynamics,” arXiv:2408.07818.  
  https://arxiv.org/abs/2408.07818

- Yu Deng, Zaher Hani, Xiao Ma, “Hilbert’s sixth problem: derivation of fluid equations via Boltzmann’s kinetic theory,” arXiv:2503.01800.  
  https://arxiv.org/abs/2503.01800

- Thierry Bodineau, Isabelle Gallagher, Laure Saint-Raymond, Sergio Simonella, “Derivation of the Boltzmann equation from hard-sphere dynamics (after Y. Deng, Z. Hani, and X. Ma),” arXiv:2602.04407.  
  https://arxiv.org/abs/2602.04407

## Relevant algorithmic caution

- Jakub Radoszewski, Wojciech Rytter, Juliusz Straszyński, Tomasz Waleń, Wiktor Zuba, “Hardness of Detecting Abelian and Additive Square Factors in Strings,” ESA 2021 / arXiv:2107.09206.  
  https://arxiv.org/abs/2107.09206

The prefix-path, obstruction-hypergraph, boundary-signature, certificate, and experiment proposals in this document are project-specific research ideas and are not attributed to the physics sources.
