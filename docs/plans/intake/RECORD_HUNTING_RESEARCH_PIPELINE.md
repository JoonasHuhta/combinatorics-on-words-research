# Record Hunting and Research Harvest Pipeline

## A concrete plan for turning computational record searches into auditable research progress

**Suggested repository path:** `docs/plans/RECORD_HUNTING_RESEARCH_PIPELINE.md`  
**Status:** design proposal / ready for implementation  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary scope:** AA2F and AA2FR finite-word searches related to Mäkelä’s conjecture  
**Related plans:** `CONJECTURE_RESEARCH_PIPELINE.md`, `RECORDS_SECTION_SPEC.md`, `RESEARCH_ARCHITECT.md`

---

## 0. Executive summary

The project should treat record hunting as a **separate but connected experimental research program**.

The primary output of a record hunt is a finite artifact:

> a verified finite word satisfying a precisely defined rule set.

That artifact does **not** prove or make more likely the existence of an infinite word satisfying the same rule set. Record length alone is not progress toward an infinite existence proof.

However, record hunting can still generate real mathematical progress when it produces one of the following:

1. an infinite generating mechanism that can be proved correct;
2. a complete finite obstruction at some length;
3. a structural lemma that applies to an entire language or construction family;
4. a certified exclusion of a precisely defined family of constructions;
5. a minimal counterexample to a proposed structural rule;
6. a new exact bounded computation that changes the research map;
7. a reproducible external benchmark or challenge problem;
8. evidence that can be promoted into a formal conjecture and independently challenged.

The project therefore needs two linked pipelines:

```text
RECORD PIPELINE
search → candidate word → independent verification → record registry → public record page

RESEARCH HARVEST PIPELINE
search corpus → structural observation → exact bounded re-test → formal conjecture
→ counterexample search / proof attempt → claims ledger
```

The first pipeline manages artifacts.  
The second pipeline manages knowledge.

They must never be merged into a single “progress toward Mäkelä” score.

---

# 1. Core epistemic rule

A longer finite AA2F word proves exactly this:

> At least one AA2F word exists at that finite length.

A longer finite AA2FR word proves exactly this:

> At least one AA2FR word exists at that finite length.

It does not prove:

- that an infinite AA2F or AA2FR word exists;
- that the corresponding infinite conjecture is more likely;
- that the search is “approaching” an infinite construction;
- that the absence of a longer word in a finite search budget is meaningful;
- that a heuristic restriction is mathematically necessary;
- that a record word is a prefix of any morphic or automatic infinite word.

The public wording, repository metadata, issue labels, and UI must all preserve this distinction.

---

# 2. Separate the mathematical languages

The project currently studies at least two different finite-word languages.

## 2.1 AA2F

AA2F is the finite version of Mäkelä’s condition:

- alphabet: ternary;
- no abelian square with half-length \(K \ge 2\);
- length-1 repetitions such as `aa`, `bb`, `cc` are allowed.

AA2F records are directly connected to the finite-prefix formulation of Mäkelä’s conjecture.

## 2.2 AA2FR

AA2FR is a strict sublanguage of AA2F:

- all AA2F conditions;
- plus the additional FORBID4 restriction.

AA2FR is useful as:

- a harder constrained record problem;
- a heuristic search laboratory;
- a source of structural hypotheses;
- a possible test bed for local rigidity.

AA2FR is not a stronger form of evidence for Mäkelä’s conjecture. It is a different language and must have its own record table, identifiers, analysis, and public explanation.

## 2.3 Never combine the leaderboards

Do not show one table ordered only by length.

Use separate views:

```text
AA2F verified records
AA2FR verified records
```

Optional method-specific results may appear in secondary benchmark tables, but not as a single cross-language “best record”.

---

# 3. Record taxonomy

Every submitted or generated word receives both a **language class** and an **epistemic status**.

## 3.1 Language class

```text
AA2F
AA2FR
```

Future rule sets must receive their own explicit class and versioned definition.

## 3.2 Epistemic status

### `CANDIDATE`

The word has been found or submitted but has not completed independent verification.

### `VERIFIED_WORD`

The word satisfies the stated rule set according to an independent verifier.

### `PROJECT_RECORD`

The longest currently known word in that class that this project has independently verified.

### `REPORTED_EXTERNAL_RECORD`

A record has been reported by an external party, but the project has not yet received or verified the exact artifact.

### `EXTERNAL_VERIFIED_RECORD`

The project has received and independently verified an externally produced word.

### `SUPERSEDED_RECORD`

A formerly current verified record that has been exceeded by a longer verified word.

### `RETRACTED`

A previously accepted record or word has failed verification or its provenance cannot support the earlier claim.

### `DISPUTED`

Two appropriate verification paths disagree, or the exact artifact/provenance is under active review.

## 3.3 Avoid the unqualified term “world record”

The public default should be:

> longest word independently verified by this project

Use “world record” only when the project has a defensible and documented basis for the global priority claim.

---

# 4. Persistent record identifiers

Every published word receives a permanent identifier.

```text
REC-AA2F-0001
REC-AA2F-0002
REC-AA2FR-0001
```

Rules:

- identifiers are never reused;
- superseded and retracted records remain visible;
- the title or status may change, but the identifier does not;
- a correction to the word creates a new record identifier unless the correction is purely metadata;
- a word submitted by two independent sources is one artifact with multiple provenance events, not two records.

---

# 5. Proposed repository structure

```text
research/
  records/
    README.md
    records.yml

    definitions/
      RECORD-CLASS-AA2F-1.md
      RECORD-CLASS-AA2FR-1.md

    words/
      REC-AA2F-0001.txt
      REC-AA2FR-0001.txt

    manifests/
      REC-AA2F-0001.json
      REC-AA2FR-0001.json

    verification/
      REC-AA2F-0001-verification.json
      REC-AA2FR-0001-verification.json

    analyses/
      REC-AA2F-0001-anatomy.json
      REC-AA2F-0001-anatomy.md

    submissions/
      SUB-20260805-0001.yml

    challenges/
      REC-AA2F-0001/
        README.md
        checksums.txt

    archive/
      retracted/
      superseded/

  runs/
    RUN-20260805-0001/
      manifest.json
      summary.md
      stdout.txt
      checkpoints/
      candidates/
      checksums.txt

scripts/
  records-check.js
  records-export.js
  verify-record-word.js
  analyze-record-word.js
  compare-record-words.js
  minimize-invalid-record.js
  research-harvest.js
```

## 5.1 Small record words should be stored in Git

A published record claim should include the exact word, not only its length or checksum.

A checksum proves file identity only when the file is available.

For each published record, Git should contain:

- exact word;
- length;
- class;
- SHA-256 checksum;
- verification result;
- verifier commit;
- provenance;
- claim-row reference;
- redistribution permission or license information.

Very large search outputs, checkpoint trees, and generated corpora may remain outside Git, but they need manifests and checksums.

---

# 6. Record registry schema

Example `records.yml` entry:

```yaml
id: REC-AA2FR-0003
class:
  id: RECORD-CLASS-AA2FR-1
  label: AA2FR

length: 2107
status: PROJECT_RECORD

artifact:
  path: research/records/words/REC-AA2FR-0003.txt
  sha256: "sha256-value"
  encoding: utf-8
  alphabet: [a, b, c]

provenance:
  finder:
    name: "Name or pseudonym"
    role: external_researcher
  provider:
    name: "Name or pseudonym"
  found_at: 2026-08-01
  received_at: 2026-08-04
  permission_to_publish: true
  provenance_status: documented

search:
  method: gpu_cpu_backtracking
  implementation: external
  source_available: false
  seed: null
  search_order: null
  run_manifest: null

verification:
  status: independently_verified
  verified_at: 2026-08-04
  verifier: scripts/verify-record-word.js
  verifier_commit: "<git-sha>"
  shared_search_code: false
  all_positions_checked: true
  all_half_lengths_checked: true
  forbid4_checked: true
  verification_report:
    path: research/records/verification/REC-AA2FR-0003-verification.json

research:
  claim_rows: [108]
  predecessor: REC-AA2FR-0002
  derived_observations: []
  promoted_conjectures: []

publication:
  website_visible: true
  first_release: research-snapshot-2026-08-05
```

---

# 7. Candidate handling

Unverified candidates must not appear in the default public record table.

## 7.1 Candidate states

```text
received
artifact_missing
verification_queued
verification_failed
verification_passed
metadata_incomplete
permission_pending
```

## 7.2 Candidate storage

A candidate may be stored:

- in a GitHub Issue;
- in a private collaboration repository;
- under `research/records/submissions/`;
- in a local run directory.

Do not place a candidate in `words/` until verification and publication permission are complete.

## 7.3 Verification failure

If a candidate fails:

1. preserve the submitted artifact if permission allows;
2. record the first violating position and half-length;
3. produce a minimal invalid prefix if useful;
4. notify the submitter;
5. do not silently delete the submission;
6. consider adding the failure as a verifier regression test.

---

# 8. Mandatory verification protocol

Every published word must pass an independent verifier that does not reuse the search algorithm’s incremental state.

## 8.1 Required checks

- exact file length;
- alphabet membership;
- all positions;
- all relevant half-lengths;
- all three letter counts computed directly;
- AA2FR FORBID4 checks when applicable;
- SHA-256 checksum;
- metadata consistency;
- deterministic re-run from a clean checkout.

## 8.2 Positive controls

The verifier must accept:

- known short valid AA2F examples;
- known valid project record words;
- valid AA2FR examples.

## 8.3 Negative controls

The verifier must reject examples containing:

- an abelian square of \(K=2\);
- a longer abelian square;
- an invalid alphabet symbol;
- a FORBID4 pattern in AA2FR mode;
- a file whose stated length does not match its contents.

## 8.4 Verification independence disclosure

Each report states shared code between:

```text
search implementation
record verifier
anatomy analyzer
website exporter
```

Independent verification is weaker if multiple tools call the same predicate implementation.

---

# 9. Search-run manifests

Every serious computational campaign should produce a manifest.

```json
{
  "run_id": "RUN-20260805-0001",
  "purpose": "record_search",
  "class_id": "RECORD-CLASS-AA2F-1",
  "git_commit": "commit-sha",
  "dirty_worktree": false,
  "command": "node backtracker.js --pure ...",
  "environment": {
    "node": "exact-version",
    "os": "value",
    "arch": "value",
    "cpu": "value",
    "gpu": "value"
  },
  "algorithm": {
    "name": "randomized-backtracking",
    "version": "identifier",
    "complete": false,
    "heuristics": [],
    "pruning_rules": []
  },
  "randomness": {
    "used": true,
    "generator": "name",
    "seeds": ["..."]
  },
  "budget": {
    "wall_time_seconds": 0,
    "node_limit": null,
    "memory_limit_mb": null
  },
  "result": {
    "longest_candidate": 0,
    "verified_during_run": false
  },
  "outputs": {
    "summary": "summary.md",
    "checksums": "checksums.txt"
  }
}
```

## 9.1 The manifest must state what the run cannot prove

Example:

```yaml
interpretation_limits:
  - heuristic search is not exhaustive
  - failure to reach length N is not a nonexistence result
  - worker silence is not evidence of search-space exhaustion
  - record growth is not evidence for an infinite word
```

---

# 10. Separate scientific records from algorithm benchmarks

A search algorithm can improve without producing a new mathematical result.

Maintain two different registries.

## 10.1 Mathematical record registry

Tracks verified finite words.

Primary metric:

```text
verified word length within one precisely defined class
```

## 10.2 Search benchmark registry

Tracks algorithm engineering.

Possible metrics:

- wall-clock time to reach a fixed target length;
- nodes expanded;
- backtracks;
- peak memory;
- energy estimate;
- success rate across fixed seeds;
- time to recover a known record;
- diversity of solutions found;
- reproducibility across machines.

A method-specific benchmark must not be presented as a mathematical record.

---

# 11. New concept: the record frontier, not only the champion

Keeping only the single longest word creates severe survivor bias.

The project should maintain a **record frontier** containing several non-dominated words.

## 11.1 Suggested frontier dimensions

A word may be retained if it is strong on at least one dimension:

- length;
- class;
- low search cost;
- independently rediscovered;
- structural diversity;
- unusual factor profile;
- unusual extension behavior;
- minimal shared prefix with existing records;
- different search method;
- external origin;
- high reproducibility.

## 11.2 Why this matters

Ten near-record words from different regions of the search space may be scientifically more valuable than one champion word.

They allow the project to ask:

- are all records descendants of one branch?
- do independent methods converge to the same structural region?
- which properties are common across records?
- which apparent properties belong only to one survivor?
- do different words share the same difficult seams?
- are records structurally diverse or nearly identical?

## 11.3 Frontier registry

```yaml
frontier:
  class: AA2F
  snapshot: 2026-08-05
  records:
    - id: REC-AA2F-0007
      retained_for: [length]
    - id: REC-AA2F-0005
      retained_for: [independent_method, structural_diversity]
    - id: REC-AA2F-0003
      retained_for: [lowest_reproduction_cost]
```

---

# 12. New concept: record lineage graph

A list of lengths hides whether records are genuinely independent.

Build a lineage graph based on:

- exact prefix relation;
- long common prefix;
- shared checkpoint;
- same seed and search order;
- mutation or restart from an earlier word;
- external independent origin;
- unknown relation.

Example:

```text
REC-AA2F-0001
  └── REC-AA2F-0003
        └── REC-AA2F-0005

REC-AA2F-0002  [independent external branch]
```

## 12.1 Scientific value

The lineage graph detects:

- repeated reporting of checkpoints from one path;
- false diversity;
- independent rediscovery;
- structural convergence;
- branches that repeatedly outperform others.

## 12.2 Public presentation

The website may show a compact lineage visualization, but Git remains the source.

---

# 13. New concept: the near-record corpus

For each campaign, preserve a controlled corpus of near-record words, not every visited node.

Suggested retention rule:

```text
top k words by length
plus structurally diverse representatives
plus all independently found words above a fixed threshold
```

Each retained word receives:

- run ID;
- checksum;
- length;
- verification status;
- relation to the current record;
- reason for retention.

The near-record corpus is discovery data. It is not independent confirmation of any pattern found from that same corpus.

---

# 14. New concept: the negative frontier

Record hunting produces valuable failures:

- maximal words that cannot be extended;
- prefixes with exactly one extension;
- minimal contexts that force failure;
- seams that admit no completion;
- candidate morphisms that fail at the earliest possible location.

Store a curated **negative frontier**.

## 14.1 Negative frontier objects

```text
maximal finite word
minimal dead suffix
minimal invalid seam
smallest counterexample to a heuristic
shortest failure of a candidate construction
```

## 14.2 Why it may be more valuable than the record

The longest positive word proves existence at one length.

A minimal negative object can reveal:

- a missing condition;
- a local obstruction;
- a useful pruning lemma;
- a new conjecture;
- a proof obligation;
- an exact bounded exclusion.

---

# 15. Record anatomy pipeline

Every new verified record should automatically receive the same analysis suite.

## 15.1 Validation layer

- length;
- class;
- exact alphabet;
- violation count;
- first and last symbols;
- SHA-256;
- Parikh vector.

## 15.2 Structural layer

- factor complexity \(p(n)\);
- abelian complexity;
- letter frequencies;
- prefix discrepancy;
- return times;
- right-extension counts;
- left-extension counts;
- bispecial factors;
- forced continuation lengths;
- local branching profile;
- repeated motifs;
- factor overlap with earlier records;
- longest common prefix with each frontier word;
- longest common factor with each frontier word.

## 15.3 Search-provenance layer

Kept separate from mathematical anatomy:

- wall time;
- node count;
- backtracks;
- worker ID;
- seed;
- search order;
- checkpoint ancestry;
- pruning modes;
- hardware.

## 15.4 Stable output

```text
research/records/analyses/REC-AA2F-0007-anatomy.json
research/records/analyses/REC-AA2F-0007-anatomy.md
```

---

# 16. Research harvest protocol

Every record campaign ends with a formal harvest review.

The goal is not to turn every statistic into a conjecture. The goal is to identify observations worthy of exact re-testing.

## 16.1 Harvest questions

For every proposed observation:

1. Is this a property of the language or only of the search algorithm?
2. Was it observed in one word or many independent words?
3. Was it selected after inspecting many possible patterns?
4. Is it invariant under alphabet permutation?
5. Is it invariant under reversal, when relevant?
6. Can it be stated with explicit quantifiers?
7. Can one counterexample reject it?
8. Can the bounded version be tested exhaustively?
9. Is there a plausible proof mechanism?
10. Would either truth or falsity change a research decision?

## 16.2 Promotion states

```text
telemetry
lead
bounded observation
formal conjecture
challenge ready
resolved / rejected
```

Only formal conjectures enter the conjecture pipeline.

## 16.3 Promotion report

```yaml
source_run: RUN-20260805-0001
source_records:
  - REC-AA2F-0007

observation:
  text: "..."
  type: structural_candidate

screening:
  invariant_not_telemetry: true
  multiple_independent_words: false
  symmetry_checked: true
  exact_bounded_retest_possible: true
  falsifiable: true
  proof_mechanism:
    - rauzy_graph

decision:
  promote: false
  reason: >
    The observation currently depends on one record lineage only.
```

---

# 17. When can a record hunt genuinely affect Mäkelä’s conjecture?

## 17.1 Positive resolution route: infinite generator

A record search discovers a finite mechanism such as:

- a morphism;
- a substitution;
- an automatic sequence;
- a recursive construction;
- a finite-state generator;
- a certified CEGIS solution.

The mechanism must then be proved to generate an infinite AA2F word.

The record word is evidence that the mechanism produces a long valid prefix. The proof concerns the generator, not the prefix length.

## 17.2 Negative resolution route: complete gap at one length

Mäkelä’s conjecture would be false if an exhaustive computation proved:

> no AA2F word exists at some finite length \(N\).

This requires a complete decision procedure for all words at that length, not a heuristic search failure.

## 17.3 Structural route: universal lemma

A record-derived pattern becomes a theorem applying to all AA2F words, all words in a bounded class, or all members of a construction family.

Examples:

- every sufficiently long word contains one of a finite set of contexts;
- every valid continuation from a certain state is forced;
- every candidate morphism must satisfy a matrix condition;
- every block boundary creates a constrained seam;
- a proposed local rule is impossible because of a global invariant.

## 17.4 Family-exclusion route

A complete computation proves that a precisely defined family cannot solve the conjecture.

Examples:

- all morphisms in a bounded image-length class;
- all codings in a bounded uniform class;
- all constructions satisfying stated preconditions;
- all solutions represented by a finite CSP.

## 17.5 Counterexample route

A record corpus produces a minimal counterexample to a structural hypothesis that had been guiding the project.

Rejecting a false lemma can be significant progress because it prevents an invalid proof strategy.

---

# 18. Stop rules and compute governance

Record hunting can consume unlimited compute without producing research value.

Every campaign should define stopping rules before execution.

## 18.1 Possible stop conditions

- wall-clock budget reached;
- energy or cost budget reached;
- no new record after a fixed compute multiple;
- no new structural states discovered;
- benchmark improvement below a threshold;
- all planned seeds completed;
- output diversity collapses to one lineage;
- the campaign no longer tests a new method or hypothesis.

## 18.2 Campaign decision record

At the end:

```yaml
campaign_id: CAMP-AA2F-2026-08
result:
  new_project_record: false
  new_verified_words: 8
  new_structural_leads: 1
  benchmark_improvement: 1.12

decision:
  continue: false
  reason: >
    Additional compute would repeat the same search distribution without
    testing a new mathematical or algorithmic idea.

resurrection_condition:
  - new pruning lemma
  - independent GPU implementation
  - new state representation
```

## 18.3 Why this is scientifically important

A stopping rule prevents the project from interpreting sunk compute cost as a reason to continue.

---

# 19. Search diversity policy

Running many workers is not useful if they explore nearly identical branches.

A campaign should report diversity across:

- seeds;
- letter orders;
- heuristic settings;
- state representations;
- restart policies;
- algorithms;
- hardware implementations;
- external implementations.

## 19.1 Diversity metrics

Possible descriptive metrics:

- pairwise longest common prefix;
- shared checkpoint ancestry;
- factor-set overlap;
- structural-feature distance;
- number of independent lineages reaching a threshold.

These metrics describe the corpus. They are not evidence for an infinite object.

---

# 20. Algorithm benchmark suite

Create a fixed benchmark suite that does not change whenever a new method is introduced.

## 20.1 Benchmark tasks

- recover a known AA2F word of length \(n_1\);
- recover a known AA2FR word of length \(n_2\);
- reject a known invalid candidate;
- reproduce a fixed small exhaustive count;
- solve a fixed seam-completion set;
- run a fixed seed portfolio.

## 20.2 Benchmark outputs

- time;
- nodes;
- backtracks;
- peak memory;
- deterministic/reproducible status;
- result checksum;
- number of unique valid words found.

## 20.3 Research firewall

A benchmark improvement is an engineering result unless it creates a new exact mathematical capability.

---

# 21. External submission protocol

Researchers should be able to submit records without exposing private code.

## 21.1 Minimum submission package

- exact word;
- claimed class;
- claimed length;
- finder identity or chosen attribution;
- date;
- method description;
- permission to publish the word;
- checksum, if already computed;
- optional seed or implementation details.

## 21.2 Project response

The project:

1. assigns a submission ID;
2. preserves the original artifact;
3. verifies independently;
4. records discrepancies;
5. requests missing permission or metadata;
6. publishes only after verification;
7. credits finder, provider, and verifier separately.

## 21.3 Private or embargoed submissions

The project must not expose:

- unpublished methods;
- private correspondence;
- embargoed records;
- data without redistribution permission.

Use a private collaboration space until release conditions are agreed.

---

# 22. Authorship and contribution roles

Record work may involve different contributors:

- search-method designer;
- implementation author;
- compute provider;
- word finder;
- artifact provider;
- independent verifier;
- structural analyst;
- conjecture formulator;
- proof author;
- external reviewer.

These roles should be stored in record metadata and later reflected in `CONTRIBUTORS.md`, release notes, and publications.

A Git commit alone does not determine scientific authorship.

---

# 23. Public website architecture

The website is a generated publication view. It is not the source of truth.

## 23.1 `/records`

Contains:

- permanent experimental disclaimer;
- separate AA2F and AA2FR views;
- current project-verified record;
- superseded records;
- download link;
- SHA-256;
- verification status;
- finder/provider/verifier attribution;
- claim-row reference;
- link to anatomy report;
- record lineage.

## 23.2 `/records/frontier`

Optional research-facing page:

- diverse near-record words;
- reason each word is retained;
- lineages;
- method diversity;
- structural comparison.

## 23.3 `/lab/runs`

Technical campaign view:

- run status;
- current best candidate;
- node count;
- backtracks;
- latest checkpoint;
- algorithm and mode;
- interpretation disclaimer.

It must not display:

- “probability the conjecture is true”;
- “percentage toward proof”;
- “distance from infinity”;
- “proof progress” based on word length.

## 23.4 `/results` or `/proofs`

Contains only claim-ledger-backed mathematical results:

- exhaustive finite closures;
- proven lemmas;
- decision procedures;
- exact structural results;
- externally audited proofs.

---

# 24. Git-to-website publication pipeline

```text
search run
  ↓
candidate artifact
  ↓
independent verification
  ↓
record metadata and checksum
  ↓
approved MATH_CLAIMS entry when required
  ↓
records-check.js
  ↓
records-export.js
  ↓
generated records.json
  ↓
website build
```

## 24.1 `records-check.js`

Checks:

- record IDs are unique;
- files exist;
- lengths match;
- checksums match;
- class definitions exist;
- verification reports exist;
- current record is actually longest among eligible records;
- superseded links are consistent;
- retracted records are excluded from current tables;
- public words have publication permission;
- claim-row references exist.

## 24.2 `records-export.js`

Exports only eligible records.

Suggested rule:

```text
website current-record table requires:
verified artifact
+ valid checksum
+ publication permission
+ non-disputed status
+ traceable claim/reference
```

---

# 25. Claim placement map

| Item | Git location | Public website |
|---|---|---|
| Raw run telemetry | `research/runs/` | optional `/lab/runs` |
| Unverified candidate | submission/Issue/private space | normally hidden |
| Verified non-record word | record registry | optional frontier |
| Current verified record | record registry + claim row | `/records` |
| Word anatomy | analyses | linked from `/records` |
| Search benchmark | benchmark registry | optional lab page |
| Structural lead | harvest report | normally not promoted |
| Formal conjecture | conjecture registry | optional research page |
| Exact bounded result | `MATH_CLAIMS.md` | `/results` |
| Rejected heuristic | `NEGATIVE_RESULTS.md` | optional methodology page |
| Current status summary | `KNOWLEDGE_STATE.md` | generated overview |

---

# 26. Novelty and priority claims

The project should distinguish:

```text
first found by this project
first independently verified by this project
first reported to this project
not found in checked sources
claimed first in the literature
globally established priority
```

Only the last two require strong external evidence.

Every public record page should state the exact level.

---

# 27. Reproducible record release bundle

For important records, create a compact release bundle.

```text
REC-AA2F-0007-release/
  README.md
  word.txt
  manifest.json
  verification.json
  checksums.txt
  verify-record-word.js
  LICENSE-or-PERMISSION.txt
```

The bundle should be independently usable without the website.

A tagged research snapshot or archived release may preserve it permanently.

---

# 28. Challenge packages for researchers

A record can become a structured challenge.

Possible challenge questions:

- independently verify the word;
- find a shorter invalid prefix if verification fails;
- find a different word of the same or greater length;
- determine whether the record is maximal;
- test seam rigidity around selected factors;
- find a morphic explanation;
- prove that a proposed local rule is not necessary;
- reproduce the result with a different method;
- classify the record’s extension states.

A challenge package must ask one precise question, not “review the repository”.

---

# 29. New concept: maximality certificates

A record word is not necessarily maximal. It may still have valid one-letter or longer extensions.

Store extension status:

```text
extendable
right-maximal
left-maximal
two-sided maximal
unknown
```

## 29.1 Why this matters

Two words of equal length may have very different research value:

- one is an arbitrary checkpoint on a continuing branch;
- one is a certified dead end;
- one is uniquely extendable;
- one has many extensions.

Maximality is a separate property from record length.

## 29.2 Certification

A right-maximal word can be certified by checking all alphabet extensions.

More general extension depth may require a bounded exhaustive search.

---

# 30. New concept: record value as a Pareto frontier

Do not reduce the value of a record artifact to length.

Possible axes:

- length;
- verification strength;
- independent rediscovery;
- structural diversity;
- maximality;
- low reproduction cost;
- external provenance;
- explanatory value;
- challenge value;
- relation to a proof mechanism.

The project should not create a single weighted “scientific score”. Use a Pareto frontier and descriptive labels.

---

# 31. New concept: contamination and feedback tracking

Once records are public, future searches may seed from them.

This creates feedback:

```text
published record
→ reused as search seed
→ descendant record
→ apparent independent confirmation
```

Record metadata must disclose:

- whether a search was seeded from a published word;
- whether the new word is a direct extension;
- whether training or heuristic design used the same corpus;
- whether an external AI system may have seen public records.

This prevents descendant records from being mistaken for independent rediscovery.

---

# 32. New concept: adversarial verifier testing

A verifier that only sees valid records may contain blind spots.

Maintain a mutation suite that deliberately corrupts valid words:

- change one letter;
- insert one letter;
- delete one letter;
- introduce a known abelian square;
- introduce a FORBID4 pattern;
- add whitespace or invalid symbols;
- alter declared length;
- alter checksum.

The verifier must reject each corruption for the correct reason.

---

# 33. New concept: search-space coverage certificates

For heuristic record hunts, “coverage” should not be claimed.

For exhaustive bounded computations, produce a coverage certificate describing:

- exact universe;
- partition rule;
- number of partitions;
- completed partitions;
- overlap checks;
- missing-partition checks;
- raw and canonical counts;
- symmetry-reduction validation;
- result aggregation checksum.

This makes the distinction between:

```text
record hunt
and
bounded nonexistence proof
```

structural rather than rhetorical.

---

# 34. New concept: research yield accounting

Compute campaigns should report more than the longest word.

Suggested campaign output:

```yaml
campaign_yield:
  verified_records: 1
  verified_nonrecord_words: 12
  independent_lineages: 3
  negative_frontier_objects: 24
  structural_leads: 4
  promoted_conjectures: 1
  exact_bounded_results: 0
  verifier_regressions_added: 6
  literature_questions_created: 1
```

This helps evaluate whether a campaign contributed reusable knowledge even without a new record.

---

# 35. New concept: evidence half-life and review dates

Some record metadata remains stable. Other information may become stale:

- “current record”;
- “longest known”;
- external priority;
- literature coverage;
- reproducibility with current dependencies.

Each current-record entry should have:

```yaml
review:
  last_checked: 2026-08-05
  next_priority_review: 2026-11-05
  next_reproduction_review: null
```

The word’s validity does not expire, but its “current record” status may.

---

# 36. New concept: record freeze and dispute protocol

When a credible challenge appears:

1. mark the record `DISPUTED`;
2. freeze website promotion;
3. preserve the current files and checksums;
4. reproduce the disagreement on the smallest object;
5. list downstream pages and claims;
6. resolve before restoring `PROJECT_RECORD`;
7. publish the correction history.

Do not overwrite the original artifact.

---

# 37. Implementation phases

## Phase 0 — adopt the model

Decide:

- record ID format;
- statuses;
- class definition IDs;
- required metadata;
- approval roles.

## Phase 1 — add this plan

```text
docs/plans/RECORD_HUNTING_RESEARCH_PIPELINE.md
```

Link it from `RESEARCH_CONTEXT.md`.

## Phase 2 — create the registry

```text
research/records/records.yml
research/records/README.md
```

Register existing verified AA2F and AA2FR records.

## Phase 3 — version the classes

```text
research/records/definitions/RECORD-CLASS-AA2F-1.md
research/records/definitions/RECORD-CLASS-AA2FR-1.md
```

## Phase 4 — create the independent verifier

```text
scripts/verify-record-word.js
```

Include positive, negative, and mutation tests.

## Phase 5 — add manifests and checksums

Migrate at least one existing record into the full structure.

## Phase 6 — implement `records-check.js`

Start in warning mode. Convert to CI-blocking only after existing records pass.

## Phase 7 — implement `records-export.js`

Generate the website data from Git records.

## Phase 8 — build the record page

Use the existing `RECORDS_SECTION_SPEC.md` as the UI specification.

## Phase 9 — add the anatomy pipeline

```text
scripts/analyze-record-word.js
scripts/compare-record-words.js
```

## Phase 10 — create the frontier and lineage graph

Register several near-record words from independent lineages.

## Phase 11 — implement research harvest

```text
scripts/research-harvest.js
```

The first version may only generate a structured review template.

## Phase 12 — external collaboration pilot

Publish one reproducible record bundle and ask an external researcher to:

- verify it;
- report the replication level;
- identify missing metadata or assumptions.

## Phase 13 — snapshot release

Create the first versioned record snapshot with:

- registry;
- words;
- checksums;
- verifier;
- website export;
- known limitations.

---

# 38. Acceptance criteria

The first implementation is complete when:

- [ ] AA2F and AA2FR records are structurally separated.
- [ ] Every published word has a persistent ID.
- [ ] Every published word is stored or permanently retrievable.
- [ ] Length and SHA-256 are checked automatically.
- [ ] Search and verification use disclosed code paths.
- [ ] Candidates cannot appear as verified records.
- [ ] The current record is computed from the registry, not typed manually.
- [ ] Superseded and retracted records remain visible.
- [ ] A run manifest exists for at least one campaign.
- [ ] A full anatomy report exists for at least one word.
- [ ] A lineage relation is recorded for existing records.
- [ ] At least one near-record word is retained for structural diversity.
- [ ] A negative-frontier object is stored.
- [ ] A harvest review has been completed.
- [ ] No website text equates record growth with proof progress.
- [ ] Exact bounded results are routed to `MATH_CLAIMS.md`.
- [ ] Formal structural hypotheses are routed to the conjecture pipeline.
- [ ] External submission and attribution rules are documented.
- [ ] A dispute can freeze publication without deleting history.

---

# 39. Recommended first concrete tasks

1. Add this plan to `docs/plans/`.
2. Update `RECORDS_SECTION_SPEC.md` so its current-record examples match the latest verified state.
3. Create `research/records/records.yml`.
4. Register all existing verified AA2F and AA2FR record artifacts.
5. Store exact words and checksums.
6. Implement `verify-record-word.js`.
7. Add mutation-based verifier tests.
8. Implement `records-check.js`.
9. Implement `records-export.js`.
10. Build the separate `/records` page.
11. Generate one anatomy report.
12. Build a record-lineage table.
13. Select a small near-record corpus.
14. Run the first research-harvest review.
15. Promote only one genuinely invariant observation into the conjecture pipeline.

---

# 40. Final principle

> **Record hunting is an experimental instrument, not a proof meter.**

A record word belongs to the project because it is a concrete, verifiable artifact.

A record hunt becomes mathematically significant only when it produces:

- an infinite generator with a proof;
- a complete finite obstruction;
- a universal structural lemma;
- a certified exclusion of a construction family;
- a minimal counterexample;
- or a formal conjecture that survives independent challenge and is later resolved.

The project should therefore optimize for more than length:

> **verified artifacts, diverse lineages, negative frontiers, reproducible campaigns, exact bounded re-tests, external challenges, and clear promotion from observation to conjecture to result.**

That combination can make the record program scientifically valuable even when no new longest word is found.
