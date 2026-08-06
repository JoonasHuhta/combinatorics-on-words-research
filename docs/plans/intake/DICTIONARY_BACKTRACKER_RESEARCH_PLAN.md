# Dictionary-Accelerated Backtracking Research and Development Plan

## From a record-search prototype to an auditable search engine, local-language graph, and research-harvest system

**Suggested repository path:** `docs/plans/DICTIONARY_BACKTRACKER_RESEARCH_PLAN.md`  
**Status:** implementation plan / code audit / research roadmap  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary files reviewed:** `backtracker.js`, `dict_backtracker.js`  
**Related plans:** `RECORD_HUNTING_RESEARCH_PIPELINE.md`, `CONJECTURE_RESEARCH_PIPELINE.md`

---

## 0. Executive summary

The dictionary-accelerated backtracker is a promising idea, but it should not yet be treated as a finished AA2FR search engine.

Its most important potential contribution is not merely faster record hunting. The 40-letter dictionary defines a finite local language that can be compiled into a directed graph and used for several purposes:

1. hard pruning in a restricted dictionary-constrained search;
2. soft ordering in a complete AA2FR search;
3. exact local branching and seam-rigidity measurements;
4. forced-corridor detection;
5. comparison of known record words;
6. generation of locally plausible morphisms and CEGIS candidates;
7. discovery of dictionary disagreements and missing local states;
8. production of formal conjecture candidates for the conjecture pipeline.

Before long searches are run, the prototype needs a correctness pass. The current implementation contains at least two result-threatening issues:

- the rolling hash can become incorrect when backtracking across the 40-letter boundary;
- the final function named `verifyAa2fr` verifies AA2F but does not verify the FORBID4 part of AA2FR.

The dictionary itself also needs an audit. Its name suggests that permutations and mirror images may already be included, while the loader expands every line by all permutations and reversals again. If so, most of the 28.8 million stored entries are duplicates.

The proposed development sequence is:

```text
correctness audit
→ dictionary provenance audit
→ independent verifier
→ exact/heuristic mode separation
→ reproducible benchmarks
→ offline binary dictionary
→ 39-state graph compilation
→ record-search integration
→ structural measurements
→ conjecture/research harvest
```

---

# 1. Scope and terminology

## 1.1 AA2F

AA2F means:

- alphabet `{a,b,c}`;
- abelian squares with half-length \(K \ge 2\) are forbidden;
- adjacent equal single letters are allowed.

This is the finite-word condition directly connected to Mäkelä’s conjecture.

## 1.2 AA2FR

AA2FR means:

- all AA2F conditions;
- plus the six FORBID4 patterns are forbidden:

```text
baac
caab
abbc
cbba
accb
bcca
```

AA2FR is a strict sublanguage of AA2F. It must not be described as a stronger proof-relevant version of AA2F.

## 1.3 D40: the dictionary-constrained local language

The dictionary search introduces a third object that must be named explicitly.

Let \(D_{40}\) be the set of 40-letter words contained in the audited dictionary.

A word belongs to the dictionary-constrained language if every one of its 40-letter factors belongs to \(D_{40}\).

Suggested label:

```text
AA2FR-D40
```

This is not automatically equal to AA2FR.

Unless completeness is separately proved, the only safe inclusion is:

```text
AA2FR-D40 ⊆ AA2FR
```

provided that every dictionary entry is independently verified as AA2FR.

Absence from \(D_{40}\) must not be called mathematical illegality. It means only that the factor is absent from the current dictionary version.

---

# 2. Immediate correctness issues

These must be fixed before the program is used for scientific claims or long record attempts.

## 2.1 Rolling-hash corruption at the 40 → 39 backtrack boundary

The current worker stores one mutable rolling hash.

When a valid word of length 40 backtracks to length 39, the normal backtrack branch does not restore the hash because the new length is below 40. The hash therefore still represents 40 letters.

The next attempted symbol is appended to the wrong parent hash, and subsequent dictionary membership tests may reject valid branches or accept invalid encodings.

### Required fix: store hash by depth

Do not invert the rolling hash during backtracking.

Use a depth-indexed hash stack:

```js
const hashAtDepth = new BigUint64Array(MAX_LEN + 1);

function appendHash(parentHash, parentLength, outgoingSymbol, oldSymbol) {
    if (parentLength < 40) {
        return parentHash * 3n + BigInt(outgoingSymbol);
    }

    return (
        (parentHash - BigInt(oldSymbol) * P3_39) * 3n
        + BigInt(outgoingSymbol)
    );
}
```

When trying a symbol at depth `currentLength`:

```js
const parentHash = hashAtDepth[currentLength];
const oldSymbol =
    currentLength >= 40
        ? word[currentLength - 40]
        : 0;

hashAtDepth[currentLength + 1] = appendHash(
    parentHash,
    currentLength,
    c,
    oldSymbol
);
```

Backtracking then becomes:

```js
currentLength--;
```

No inverse arithmetic is needed.

### Required property test

Generate random sequences of:

- append `a`, `b`, or `c`;
- backtrack one step;
- append another symbol.

At every depth at least 40, compare:

```text
rolling hash from hashAtDepth
vs.
hash recomputed directly from the last 40 symbols
```

Run thousands of random traces and include all crossings around lengths 38–42.

---

## 2.2 The final verifier does not verify AA2FR

The dictionary implementation’s `verifyAa2fr` function checks abelian squares but does not check the six FORBID4 patterns.

It is therefore an AA2F verifier under an AA2FR name.

### Required fix

Create one standalone verifier:

```text
scripts/verify-record-word.js
```

Supported modes:

```text
--class aa2f
--class aa2fr
--class aa2fr-d40 --dictionary <manifest-or-binary>
```

The verifier must check:

- exact alphabet;
- exact file length;
- all positions;
- all half-lengths \(K \ge 2\);
- all three Parikh counts directly;
- FORBID4 in AA2FR mode;
- every 40-window in D40 mode;
- SHA-256;
- deterministic output.

The search program must call this separate process or module only after producing a candidate.

---

## 2.3 Seed validation is incomplete

The current character conversion treats any character other than `a` or `b` as `c`.

That means invalid symbols can be silently accepted.

### Required checks before workers start

- every character is exactly `a`, `b`, or `c`;
- seed length is below target;
- seed satisfies AA2F;
- seed satisfies FORBID4 when required;
- every 40-window belongs to the selected dictionary in hard-D40 mode;
- the seed file has no hidden whitespace or line-break contamination;
- the declared class matches the checkpoint class;
- the seed checksum is recorded in the run manifest.

Invalid seed data must terminate the program with a clear error.

---

## 2.4 Fixed dictionary capacity has no overflow guard

The dictionary buffer is allocated for 36 million entries.

If the input contains more valid lines or the expansion produces more entries than expected, writes can exceed the intended active region.

### Required fix

Before every insertion:

```js
if (dictSize + requiredEntries > maxEntries) {
    throw new Error("Dictionary capacity exceeded");
}
```

Better still, perform an initial counting pass or compile the dictionary offline into an exact-sized binary file.

---

## 2.5 The implementation may expand symmetries twice

The dictionary filename contains:

```text
AllPermsMirs
```

The loader also generates:

- all six alphabet permutations;
- forward and reverse forms.

The dictionary must be audited to determine whether it is already symmetry-closed.

### Audit outputs

```text
total input lines
valid length-40 lines
invalid lines
unique direct hashes
unique reversed hashes
unique permutation hashes
unique full-orbit hashes
duplicate multiplicity distribution
number of orbit-closure violations
```

If the input is already fully closed, do not expand it again.

---

## 2.6 “O(1)” and “zero allocation” descriptions must be corrected

The current implementation performs:

- \(O(\log |D|)\) binary search;
- \(O(n)\) suffix-square checking per appended symbol;
- BigInt arithmetic that creates BigInt results;
- string creation when emitting a success word.

A precise description is:

> no per-node string construction in the worker loop; exact base-3 40-window encoding; logarithmic dictionary lookup; linear suffix-square verification.

This is still a useful engineering property, but it should not be overstated.

---

## 2.7 Worker searches overlap

Six workers use different letter orders but search the same rooted tree.

This is useful as a race to the first solution, but it is not a disjoint exhaustive partition.

### Two supported worker modes

#### Portfolio mode

Workers use different:

- letter orders;
- heuristics;
- restart policies;
- dictionary modes;
- seeds.

Goal: find a record quickly.

#### Partition mode

Generate valid canonical prefixes at a fixed split depth and assign disjoint prefix sets to workers.

Goal: complete a bounded search without overlap.

The run manifest must state which mode is used.

---

# 3. Prove the 64-bit encoding contract

A 40-letter ternary word encoded as a base-3 integer fits in 64 bits because:

\[
0 \le h < 3^{40} < 2^{64}.
\]

This is an important correctness contract and should be tested, not left implicit.

## 3.1 Required constants test

At startup or in unit tests:

```js
const P3_39 = 3n ** 39n;
const P3_40 = 3n ** 40n;
const U64_LIMIT = 1n << 64n;

assert(P3_39 === 4052555153018976267n);
assert(P3_40 < U64_LIMIT);
```

## 3.2 Encoding conventions

Document explicitly:

- `a = 0`, `b = 1`, `c = 2`;
- the leftmost character is the most significant ternary digit;
- leading `a` symbols produce leading zero digits;
- word length is fixed at 40, so leading zeros do not make encodings ambiguous;
- all values are stored as unsigned 64-bit integers.

## 3.3 Round-trip tests

For random 40-letter words:

```text
word
→ encode
→ decode to exactly 40 symbols
→ original word
```

Include words starting with many `a` symbols.

---

# 4. Separate the search modes

The program should not expose one ambiguous “dictionary search” mode.

## 4.1 `aa2f-exact`

Rules:

- AA2F only;
- no FORBID4;
- no dictionary pruning.

Interpretation:

- complete for the rooted finite search tree if the tree is actually exhausted.

## 4.2 `aa2fr-exact`

Rules:

- AA2F;
- FORBID4;
- no dictionary pruning.

Interpretation:

- complete for the rooted AA2FR search tree if exhausted.

## 4.3 `aa2fr-d40-hard`

Rules:

- AA2FR;
- every 40-window must belong to the selected D40 dictionary.

Interpretation:

- exact only for AA2FR-D40;
- heuristic and incomplete relative to unrestricted AA2FR.

## 4.4 `aa2fr-d40-order`

Rules:

- exact AA2FR validity determines acceptance;
- dictionary membership changes branch order only;
- non-dictionary branches remain searchable.

Interpretation:

- potentially complete AA2FR search;
- dictionary used as an ordering prior.

## 4.5 `aa2fr-d40-budgeted-escape`

Rules:

- exact AA2FR;
- allow at most \(d\) dictionary-defect windows.

Suggested parameters:

```text
--max-dict-defect 0
--max-dict-defect 1
--max-dict-defect 2
--max-dict-defect 4
```

This creates a controlled ladder from hard dictionary search to unrestricted AA2FR.

---

# 5. Dictionary provenance and versioning

The dictionary is a research artifact and needs its own manifest.

Suggested location:

```text
research/dictionaries/D40-0001/
  manifest.json
  source-checksum.txt
  audit.json
  README.md
```

## 5.1 Manifest fields

```json
{
  "id": "D40-0001",
  "window_length": 40,
  "claimed_class": "AA2FR",
  "source_file": "aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt",
  "source_sha256": "...",
  "producer": "...",
  "received_at": "...",
  "generation_method": "...",
  "extension_depth": 80,
  "extension_direction": "two_sided",
  "search_complete": false,
  "symmetry_claim": {
    "permutations": true,
    "reversal": true
  },
  "publication_permission": true,
  "audit_status": "pending"
}
```

## 5.2 Dictionary claims must be bounded

Allowed:

> D40-0001 contains 2,403,132 unique verified 40-letter AA2FR factors after audit.

Not allowed without a proof:

> D40-0001 contains all 40-letter factors that can occur in arbitrarily long AA2FR words.

---

# 6. Offline dictionary compiler

Do not parse, expand, and sort a 100 MB text file at every search startup.

Create:

```text
scripts/compile-d40.js
```

## 6.1 Compiler tasks

1. stream the source text;
2. validate line length and alphabet;
3. independently verify AA2FR;
4. encode each word as `uint64`;
5. optionally generate missing symmetries;
6. sort;
7. deduplicate;
8. write an exact-size binary file;
9. write checksums and audit statistics;
10. write a small sample for regression tests.

## 6.2 Binary output

```text
research/dictionaries/D40-0001/d40.u64
research/dictionaries/D40-0001/d40.index.json
```

The binary file should contain little-endian unsigned 64-bit values, with endianness documented.

## 6.3 Search startup

The search process should:

- read the manifest;
- validate checksum;
- load the binary file;
- copy or share the exact array;
- skip text parsing and sorting.

---

# 7. Data-structure alternatives

The sorted `BigUint64Array` is a valid first implementation, but several alternatives should be benchmarked.

## 7.1 Sorted unique `BigUint64Array`

Advantages:

- simple;
- exact;
- deterministic;
- compact;
- binary search.

Use as the reference implementation.

## 7.2 Bloom filter plus exact fallback

A Bloom filter can reject most non-members quickly.

Pipeline:

```text
Bloom says no
→ reject

Bloom says maybe
→ exact binary search
```

It must never be used without exact fallback because false positives are possible.

Benchmark only after correctness is established.

## 7.3 Hash set in native code or WebAssembly

JavaScript `Set<BigInt>` may be memory-heavy.

A Rust, C++, or WebAssembly hash table may provide:

- faster membership;
- lower overhead;
- direct binary loading.

This is an optimization phase, not a first correctness task.

## 7.4 Graph adjacency

For search, the best final representation may be the D40 graph described below.

A state has at most three outgoing letters, so membership can become:

```text
current state + candidate letter
→ direct transition lookup
```

This removes repeated global binary search from the hot loop.

---

# 8. Compile D40 into a 39-letter state graph

Every 40-letter dictionary word defines an edge:

```text
prefix of length 39
  --last letter-->
suffix of length 39
```

This creates a directed Rauzy/de Bruijn-style graph.

## 8.1 Graph objects

```text
vertex: a 39-letter factor
edge: a 40-letter dictionary factor
edge label: appended symbol
```

## 8.2 Suggested compact files

```text
d40-states.u64
d40-offsets.u32
d40-targets.u32
d40-labels.u8
d40-graph-manifest.json
```

A 39-letter ternary state also fits in 64 bits.

## 8.3 Search transition

The worker maintains a state ID.

For candidate symbol `c`:

```text
lookup outgoing transition labeled c
```

If it exists:

- move to target state;
- run the exact AA2FR suffix check.

If it does not exist:

- reject in hard-D40 mode;
- deprioritize in order mode;
- count a defect in defect-budget mode.

## 8.4 Graph validation

Verify that:

- every dictionary edge maps to exactly one prefix and suffix;
- reconstructing the 40-word from state plus label matches the original hash;
- all transitions preserve the rolling 39-state encoding;
- the number of graph edges equals the unique dictionary size;
- direct dictionary membership and graph membership agree on random tests.

---

# 9. Graph-derived research measurements

The graph is a research object, not only an accelerator.

## 9.1 Branching distribution

Compute exact counts of states with:

```text
out-degree 0
out-degree 1
out-degree 2
out-degree 3
```

Also compute indegree.

This can independently test reported branching statistics.

## 9.2 Forced corridors

A forced corridor is a maximal directed path whose internal states have out-degree 1.

Measure:

- number of corridors;
- length distribution;
- longest corridor;
- corridor endpoints;
- record-word corridor usage;
- corridor symmetry classes.

## 9.3 Local essential core

Iteratively remove:

- states with no outgoing edge;
- states with no incoming edge.

The remaining graph is the locally bi-extendable core of D40.

This is not proof of a bi-infinite AA2FR word because the dictionary constraint is local and abelian-square avoidance is global.

## 9.4 Strongly connected components

Compute:

- SCC count;
- largest SCC;
- cyclic SCCs;
- condensation DAG;
- record-word SCC sequence.

Again, SCCs are search filters and local-language results, not an infinite-AA2FR proof.

## 9.5 Seam and gap filling

For chosen left and right contexts, count graph paths of lengths:

```text
1
2
3
4
...
```

This measures local seam rigidity.

Distinguish:

- no completion;
- unique completion;
- multiple completions.

## 9.6 Entropy and growth upper bounds

The graph defines a finite-type local language.

Its adjacency matrix can provide:

- path counts;
- spectral radius;
- local-language growth rate.

This is an upper-level description of D40, not automatically the growth rate of the exact AA2FR language.

## 9.7 State centrality as a search heuristic

Possible heuristic quantities:

- distance to branching;
- distance to local core;
- corridor length;
- SCC size;
- number of short continuations;
- number of left/right completions.

Use them only to order branches until sound pruning is proved.

---

# 10. Known-record replay

Every verified AA2FR record should be replayed through the dictionary.

Produce:

```text
dictionary coverage percentage
first missing 40-window
all missing windows
longest continuously covered interval
number of distinct graph states visited
out-degree sequence
forced-corridor sequence
SCC sequence
number of repeated state visits
```

## 10.1 Critical positive control

If a known verified long AA2FR record contains a 40-window not in D40, then hard-D40 search cannot reproduce that record.

This does not make the dictionary wrong. It proves that it is incomplete relative to the known record corpus.

## 10.2 Record lineage use

Graph-state sequences can help distinguish:

- direct extensions of the same search branch;
- structurally similar but independently generated records;
- records in different local components;
- words that repeatedly leave the dictionary model.

---

# 11. Dictionary defect and controlled escape

Define dictionary defect for a word \(w\):

\[
d_D(w)
=
\#\{i : w[i..i+39] \notin D_{40}\}.
\]

This is dictionary-relative telemetry, not an intrinsic AA2FR invariant.

## 11.1 Defect ladder

Run controlled searches at:

```text
defect 0
defect ≤ 1
defect ≤ 2
defect ≤ 4
unrestricted
```

Measure:

- reachable depth;
- search cost;
- first defect position;
- structural role of defect windows;
- whether defects lead back into D40;
- whether independent record words require defects.

## 11.2 Active learning

When a hard-D40 branch dies:

1. allow one exact-AA2FR-valid out-of-dictionary extension;
2. measure how far it survives;
3. save the new 40-window;
4. independently test its extension behavior;
5. place it in a disagreement dataset;
6. never mutate D40-0001 silently;
7. create D40-0002 only through a documented compilation process.

---

# 12. Extendability filtration

Build a family of dictionaries:

\[
D_{40,h},
\]

where membership means surviving at least extension depth \(h\) under a precisely documented test.

Example:

```text
D40,0
D40,20
D40,40
D40,80
D40,160
```

## 12.1 Required distinction

If generation is heuristic, call the result:

```text
observed survivor set at depth h
```

Do not claim exact inclusion unless the extension test is complete.

## 12.2 Measurements across h

- unique state count;
- edge count;
- branching distribution;
- corridor lengths;
- core size;
- SCC structure;
- seam rigidity;
- record coverage;
- dictionary-defect frequency.

## 12.3 Research question

Does the local structure stabilize as \(h\) grows, or does each deeper extension test remove substantial new regions?

Any stabilization conjecture must be formulated and challenged separately.

---

# 13. Soft dictionary ordering

The project should compare hard pruning against soft ordering.

## 13.1 Branch ordering example

For each candidate symbol, assign a priority:

```text
1. transition belongs to deeper dictionary D40,h
2. transition belongs to D40
3. transition is exact-AA2FR-valid but absent from D40
```

All exact-valid candidates remain searchable.

## 13.2 Advantages

- preserves completeness in an exact finite search;
- allows the dictionary to guide without making completeness claims;
- exposes where dictionary advice is wrong;
- creates natural disagreement data;
- may outperform hard pruning if long solutions require rare escapes.

## 13.3 Evaluation

Use identical:

- seed portfolio;
- target lengths;
- time budgets;
- hardware;
- checkpoint policy.

Report startup cost separately from search cost.

---

# 14. Worker partitioning and duplicate-state control

## 14.1 Disjoint subtree partitioning

Generate all valid prefixes at split depth \(s\), canonicalize if appropriate, and distribute them among workers.

Manifest must include:

- split depth;
- prefix count;
- assignment checksum;
- worker prefix ranges;
- proof that ranges are disjoint;
- proof that the prefix set covers the intended root tree.

## 14.2 Transposition table

Different prefixes may reach the same relevant local state but have different global AA2FR histories.

A transposition table keyed only by the last 39 or 40 letters is not sound for global AA2F pruning.

However, it can be used for:

- duplicate telemetry;
- heuristic ordering;
- bounded-state experiments;
- exact local D40 graph analysis.

Do not prune global AA2FR search solely because a local state was seen before unless a sufficient state representation is proved.

## 14.3 Prefix canonicalization

Alphabet-permutation canonicalization can reduce duplicate roots only when:

- the seed and search objective are symmetric;
- provenance is preserved;
- raw and canonical counts are cross-checked.

---

# 15. Bidirectional and meet-in-the-middle search

The dictionary’s two-sided origin suggests a bidirectional search mode.

## 15.1 Basic design

- grow a valid left half;
- grow a valid right half backward;
- use the D40 graph to find a short connecting path;
- verify the complete joined word exactly.

## 15.2 Potential benefits

- direct use of seam rigidity;
- reuse of extendable local states;
- parallelization by boundary-state pairs;
- discovery of rare bridge states.

## 15.3 Risks

- local bridge validity does not guarantee global AA2FR;
- joining can create long abelian squares across the seam;
- memory can dominate;
- duplicate pairs can explode.

The exact full-word verifier remains final.

---

# 16. CEGIS and morphism-search integration

The dictionary graph can generate locally plausible candidates for exact proof-oriented searches.

## 16.1 Route A candidate generation

Candidate morphism images can be graph paths.

Constraints:

- every internal 40-window belongs to D40;
- image boundaries receive seam scores;
- candidate fixed points are still checked by the exact decision procedure.

## 16.2 CEGIS loop

```text
graph generates a locally plausible morphism
→ exact verifier finds a concrete violating factor
→ violating seam/context becomes a learned constraint
→ generator excludes the same failure pattern
→ repeat
```

The dictionary is a prior, not the final mathematical verifier.

## 16.3 Route C ranking

For candidate codings applied to a known base word, compute:

- within-image D40 coverage;
- pairwise image-seam coverage;
- seam completion multiplicity;
- forced-corridor membership;
- dictionary-defect count.

Use the score to prioritize candidates, not to certify them.

---

# 17. Telemetry to collect during searches

## 17.1 Engineering telemetry

```text
nodes attempted
accepted extensions
dictionary rejects
FORBID4 rejects
AA2F rejects
backtracks
wall time
CPU time
dictionary load time
sort/compile time
lookup time
AA2F-check time
checkpoint count
memory usage
worker identity
```

## 17.2 Structural telemetry

```text
current graph state
out-degree
in-degree
corridor ID
distance to next branch
SCC ID
core membership
dictionary defect count
distinct states visited
state revisit count
seam score
```

## 17.3 Controlled rejected-branch sampling

Sample a small deterministic fraction of hard-D40 rejections.

For each sampled rejection:

- check whether it is exact-AA2FR-valid;
- run a bounded unrestricted extension test;
- record survival depth;
- store unusually successful disagreements.

This measures how much potentially useful search space the hard filter removes.

---

# 18. Benchmark suite

Create a stable benchmark suite before comparing methods.

## 18.1 Correctness benchmarks

- encode/decode fixed 40-words;
- rolling-hash random walk;
- known dictionary members;
- known non-members;
- known AA2F-valid word;
- known AA2FR-valid word;
- known FORBID4 violation;
- known abelian-square violation;
- replay of verified records.

## 18.2 Performance benchmarks

Compare:

```text
aa2fr-exact
aa2fr-d40-hard
aa2fr-d40-order
aa2fr-d40-defect-1
graph-adjacency hard mode
```

Metrics:

- startup time;
- time to fixed depth;
- nodes per second;
- accepted nodes per second;
- memory;
- dictionary rejection rate;
- exact-check rejection rate;
- independent lineages found.

## 18.3 Reuse benchmark

Because dictionary compilation is expensive but reusable, report:

```text
first-run total cost
warm-start cost
cost after 10 campaigns
```

---

# 19. Reproducibility and manifests

Every serious run must produce a manifest.

```json
{
  "run_id": "RUN-D40-20260805-0001",
  "mode": "aa2fr-d40-hard",
  "git_commit": "...",
  "dictionary_id": "D40-0001",
  "dictionary_sha256": "...",
  "seed_sha256": "...",
  "target_length": 2500,
  "worker_mode": "portfolio",
  "search_orders": [],
  "hardware": {},
  "budgets": {},
  "result": {},
  "interpretation_limits": [
    "D40 search is incomplete relative to unrestricted AA2FR",
    "failure to reach target is not a nonexistence result"
  ]
}
```

---

# 20. Research-harvest integration

At the end of each campaign, generate a structured harvest report.

Suggested script:

```text
scripts/harvest-d40-run.js
```

## 20.1 Candidate observations

- unusual branching states;
- long forced corridors;
- dictionary escapes that survive far;
- seams with unique completion;
- seams with unexpectedly many completions;
- record words concentrated in one SCC;
- repeated return to one state region;
- structural differences between hard and soft search.

## 20.2 Promotion filter

A lead is promoted only if:

- it concerns a mathematical object, not only worker behavior;
- it can be stated with explicit quantifiers;
- it is invariant under relevant symmetries;
- it can be falsified;
- an exact bounded re-test is available;
- a plausible proof mechanism exists;
- truth or falsity changes a research decision.

Promoted leads enter `CONJECTURE_RESEARCH_PIPELINE.md`.

---

# 21. New concrete improvement: witness-first logging

Do not log only aggregate counts.

Whenever a new minimum, maximum, or anomaly appears, preserve a canonical witness.

Examples:

- longest forced corridor;
- first dictionary disagreement surviving 100 steps;
- seam with the largest completion count;
- smallest state outside the local core;
- smallest record window absent from D40.

A number without a witness is harder to audit and less useful for future proofs.

---

# 22. New concrete improvement: dual implementation of dictionary membership

Maintain two independent membership paths:

## Reference path

- decode/re-encode or direct word lookup;
- slow;
- used in tests and verification.

## Optimized path

- graph transition or binary `uint64` lookup;
- used in search.

Randomly cross-check the optimized result against the reference path during debug runs.

This catches:

- endianness mistakes;
- hash convention mistakes;
- boundary update bugs;
- corrupted binary files;
- graph compiler errors.

---

# 23. New concrete improvement: immutable dictionary versions

Never edit an existing dictionary binary in place.

Use:

```text
D40-0001
D40-0002
D40-0003
```

A new version is created when:

- source data changes;
- symmetry expansion changes;
- invalid rows are removed;
- new disagreements are admitted;
- extension-depth criteria change;
- encoding changes.

Every run references one immutable dictionary ID and checksum.

---

# 24. New concrete improvement: dictionary differential testing

Compare two dictionary versions directly.

Report:

```text
added words
removed words
added graph states
removed graph states
branching changes
corridor changes
core changes
record coverage changes
```

Preserve canonical examples of every difference class.

This prevents a “better” dictionary from silently changing the search problem.

---

# 25. New concrete improvement: class-preserving mutation tests

Generate mutations of dictionary words:

- one-symbol substitution;
- reversal;
- alphabet permutation;
- prefix/suffix splice;
- one-symbol shift;
- seam recombination.

Classify each mutation as:

```text
AA2FR and in D40
AA2FR but outside D40
not AA2FR
```

This maps the local boundary of the dictionary and produces useful disagreement examples.

---

# 26. New concrete improvement: exact small-window calibration

For a smaller window \(m\), such as 12–20, compute the complete exact AA2FR factor set.

Then simulate the same dictionary-generation process at window \(m\).

Compare:

- exact factor set;
- generated dictionary set;
- false omissions;
- extension-depth survival;
- symmetry coverage;
- branching and core structure.

This provides a calibration model for interpreting D40.

Without small-window calibration, the completeness behavior of the large heuristic dictionary is unknown.

---

# 27. New concrete improvement: prune-reason certificates

Every rejected candidate extension should have a reason code:

```text
INVALID_FORBID4
INVALID_AA2F_K_2
INVALID_AA2F_K_3
...
MISSING_D40
DEFECT_BUDGET_EXCEEDED
```

For sampled or terminal branches, preserve:

- rejection position;
- offending half-length;
- Parikh vectors;
- missing 40-window hash;
- graph state and candidate label.

This makes negative-frontier analysis possible.

---

# 28. New concrete improvement: energy and compute budgeting

Long record hunts should record:

- CPU/GPU hours;
- approximate energy use when measurable;
- hardware cost;
- cloud cost;
- result yield.

The project should stop campaigns that repeat the same distribution without testing a new method or hypothesis.

A longer run is not automatically a better experiment.

---

# 29. New concrete improvement: deterministic replay mode

Add:

```text
--replay <run-manifest>
```

Replay must restore:

- dictionary version;
- seed;
- worker assignments;
- search orders;
- random seeds;
- target;
- class;
- checkpoints if included.

Deterministic replay is especially important when a candidate was found under multiple workers.

---

# 30. New concrete improvement: safe checkpoint format

Checkpoint files should include:

```json
{
  "schema_version": 1,
  "run_id": "...",
  "worker_id": 0,
  "mode": "aa2fr-d40-hard",
  "dictionary_id": "D40-0001",
  "dictionary_sha256": "...",
  "seed_sha256": "...",
  "word": "...",
  "choice_stack": [],
  "hash_at_depth_tail": [],
  "created_at": "..."
}
```

On resume, reject checkpoints if:

- mode differs;
- dictionary differs;
- seed differs;
- schema differs;
- word fails verification;
- choice stack is inconsistent.

Use atomic write-and-rename to avoid partial checkpoint corruption.

---

# 31. New concrete improvement: separate search and certification processes

The search process should never certify its own result as the only verification path.

Recommended flow:

```text
search process writes candidate and exits
→ certification process reads candidate from disk
→ certification process validates class and checksum
→ registry process promotes it
```

This creates a clean process boundary.

---

# 32. Output routing in the project

| Output | Destination |
|---|---|
| Experimental prototype | `scratch/` |
| Audited search engine | main exact/search pipeline |
| Dictionary manifest | `research/dictionaries/D40-xxxx/` |
| Compiled binary/graph | release or managed artifact + checksum |
| Run telemetry | `research/runs/` |
| Verified word | record registry |
| Current project record | record registry + approved claim row |
| Exact graph statistic | `MATH_CLAIMS.md` after verification |
| Heuristic graph observation | harvest report |
| Formal structural conjecture | conjecture registry |
| Rejected dictionary hypothesis | `NEGATIVE_RESULTS.md` |
| Public record view | generated website record page |
| Technical live status | optional lab page |

---

# 33. Implementation roadmap

## Phase 0 — freeze scientific use

Do not use the current prototype for claims until the rolling-hash and verifier issues are fixed.

## Phase 1 — correctness

1. implement depth-indexed hash storage;
2. add rolling-hash property tests;
3. create standalone AA2F/AA2FR verifier;
4. validate seed and alphabet;
5. add buffer overflow guards;
6. add exact 64-bit encoding tests;
7. add checkpoint integrity checks.

## Phase 2 — dictionary audit

8. compute source checksum;
9. verify all input rows;
10. count unique hashes;
11. test symmetry closure;
12. remove duplicate expansion if unnecessary;
13. create immutable dictionary manifest;
14. replay known AA2FR records.

## Phase 3 — reproducible binary representation

15. build offline dictionary compiler;
16. generate sorted unique `uint64` binary;
17. add checksum validation;
18. benchmark cold and warm startup.

## Phase 4 — mode separation

19. implement exact AA2F;
20. implement exact AA2FR;
21. implement hard D40;
22. implement soft D40 ordering;
23. implement defect-budget mode;
24. label output and manifests correctly.

## Phase 5 — graph compiler

25. compile 40-edges into 39-state graph;
26. validate graph against direct membership;
27. switch hard-D40 hot loop to adjacency;
28. compute branching, SCC, core, and corridors.

## Phase 6 — search benchmarking

29. create fixed seed portfolio;
30. compare all modes;
31. separate startup and search cost;
32. compare portfolio and partition workers;
33. report dictionary rejection sampling.

## Phase 7 — research measurements

34. reproduce branching statistics;
35. test seam rigidity;
36. compute known-record path signatures;
37. build extendability filtration;
38. collect dictionary disagreements;
39. create negative-frontier witnesses.

## Phase 8 — integration

40. connect record output to the record registry;
41. connect harvest output to the conjecture pipeline;
42. use graph priors in Route A CEGIS;
43. use seam scores in Route C ranking;
44. publish only claim-backed exact results.

---

# 34. Acceptance criteria

The first scientifically usable version is complete when:

- [ ] rolling hash passes randomized append/backtrack tests;
- [ ] exact 40-letter encoding is proven to fit in `uint64`;
- [ ] seed validation rejects all invalid symbols;
- [ ] AA2FR certification checks FORBID4 independently;
- [ ] dictionary source and binary have checksums;
- [ ] dictionary uniqueness and symmetry closure are known;
- [ ] known verified AA2FR records have replay reports;
- [ ] hard-D40 output is never labeled unrestricted AA2FR;
- [ ] exact and heuristic modes are separated;
- [ ] worker mode is labeled portfolio or partition;
- [ ] checkpoints bind to dictionary, seed, mode, and run ID;
- [ ] search and certification are separate processes;
- [ ] direct membership and graph membership agree;
- [ ] graph statistics are reproducible;
- [ ] at least one controlled dictionary-disagreement sample exists;
- [ ] benchmark results distinguish startup from search time;
- [ ] campaign output includes research-harvest metadata;
- [ ] no finite record result is presented as evidence for infinity.

---

# 35. Final perspective

The current prototype begins with a practical idea:

> reject a candidate when its newest 40-letter window is absent from a large dictionary.

The mature research system should become something broader:

```text
audited local-language artifact
→ exact binary representation
→ graph of local continuations
→ multiple soundness-labelled search modes
→ record generation
→ disagreement discovery
→ structural measurements
→ conjecture generation
→ exact challenge and proof-oriented search
```

The dictionary should not be treated as an oracle.

Its scientific value comes from making its assumptions and failures visible:

- which known words it covers;
- which valid factors it misses;
- how its structure changes with extension depth;
- where it forces continuations;
- where seams become rigid;
- where record searches repeatedly escape it;
- and which of these observations survive exact independent re-testing.

Used this way, the dictionary backtracker can become more than a record accelerator. It can become a central bridge between the project’s record program, local-language analysis, CEGIS morphism search, conjecture pipeline, and external reproducibility work.
