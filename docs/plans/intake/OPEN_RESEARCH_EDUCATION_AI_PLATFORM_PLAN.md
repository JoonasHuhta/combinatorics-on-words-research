# Open Research, Education, and AI Platform Plan

## One evidence core, three missions: discover, teach, and train

**Suggested repository path:** `docs/plans/OPEN_RESEARCH_EDUCATION_AI_PLATFORM_PLAN.md`  
**Status:** strategic implementation plan  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary goals:** advance science, teach researchers and students, and build trustworthy AI-assisted research workflows  
**Openness principle:** reuse is encouraged; attribution is appreciated and should be easy, but legal and technical friction should remain minimal

---

# 0. Executive summary

The project has grown beyond a single computational search repository.

It now has three connected missions:

1. **Research**
   - produce auditable mathematical and computational results;
   - preserve negative results;
   - support independent replication;
   - create new conjectures and proof-oriented experiments.

2. **Education**
   - teach combinatorics on words;
   - teach computational mathematics;
   - teach research integrity, complexity analysis, verification, and reproducibility;
   - allow students to contribute real, bounded research work.

3. **AI research assistance**
   - teach AI systems the project’s definitions, claims, code, evidence, failures, and research protocols;
   - evaluate whether an AI agent can reason correctly about the project;
   - use AI to propose, test, audit, and explain research without allowing it to inflate evidence.

These missions should share one common foundation:

```text
                         EVIDENCE CORE
 definitions · claims · sources · artifacts · runs · checksums · reviews
                    /              |               \
            RESEARCH LAB      LEARNING LAB        AI LAB
```

The project should not become three separate repositories with incompatible truths.

Instead:

> **Research establishes the evidence. Education explains it. AI learns to work with it.**

The standards must remain asymmetric:

- educational simplification must not alter the underlying mathematical claim;
- AI-generated text must not become evidence merely because it has entered the repository;
- an attractive visualization must not become a theorem;
- a record hunt must not become proof progress;
- a local browser experiment must not become an authoritative research computation.

The central implementation goal is therefore:

> **One machine-readable evidence layer, many human-facing views.**

---

# 1. Mission statement

## 1.1 Scientific mission

The project seeks to advance knowledge in combinatorics on words, especially through:

- exact finite computation;
- independently verified record words;
- structural analysis;
- morphism and substitution searches;
- bounded decision procedures;
- conjecture generation and challenge;
- proof-oriented computation;
- negative-results preservation;
- external replication.

## 1.2 Educational mission

The project teaches:

- ordinary and Abelian pattern avoidance;
- Parikh vectors;
- finite versus infinite statements;
- exact versus heuristic computation;
- algorithmic complexity;
- independent verification;
- checkpoint and concurrency correctness;
- reproducible computational experiments;
- how mathematical evidence is promoted into a claim.

## 1.3 AI mission

The project develops AI-assisted workflows in which AI can:

- retrieve current project knowledge;
- distinguish theorem, computation, observation, conjecture, analogy, and speculation;
- audit code and complexity claims;
- search for counterexamples;
- generate bounded experiments;
- explain results pedagogically;
- identify unsupported claims;
- refuse to overstate finite evidence;
- preserve provenance and uncertainty.

The AI mission is not:

> train a model to confidently repeat project prose.

It is:

> train and evaluate an agent to participate in disciplined research.

---

# 2. Openness philosophy

## 2.1 Default principle

The project should be open by default.

People should be able to:

- read;
- copy;
- fork;
- modify;
- teach from;
- translate;
- redistribute;
- run experiments;
- build commercial or non-commercial tools;
- create derivative research;
- incorporate workflows into other projects.

## 2.2 Attribution principle

The project may say:

> Citation or acknowledgement is appreciated when the project materially helps your work, but the goal is to reduce barriers to reuse.

This should be expressed clearly and politely.

Avoid language that sounds like:

- permission must be requested;
- contributors lose ownership;
- every minor reuse requires a formal citation;
- the project claims ownership of mathematical facts;
- use is restricted to academic purposes.

## 2.3 Legal openness versus scholarly courtesy

These are separate.

```text
LICENSE
What users are legally allowed to do.

CITATION
How users may acknowledge the project academically.

ACKNOWLEDGEMENT
A lighter, informal way to say thank you.
```

A permissive license can coexist with an optional citation request.

---

# 3. Recommended licensing architecture

There is no single perfect license for code, prose, datasets, and contributed research artifacts.

Use a clear licensing matrix.

## 3.1 Recommended low-friction option

If the project truly wants reuse with no mandatory attribution burden:

| Material | Recommended license | Effect |
|---|---|---|
| Source code | 0BSD | Very permissive; minimal conditions |
| Documentation and teaching material | CC0 1.0 | Public-domain dedication to the extent possible |
| Project-generated datasets | CC0 1.0 | Maximum data reuse |
| Website prose and diagrams | CC0 1.0 unless third-party restrictions apply | Maximum reuse |
| Third-party artifacts | Their original license or explicit permission | Must be tracked separately |

Then add:

```text
Citation and acknowledgement are appreciated but not required by the project license.
```

## 3.2 Conventional permissive alternative

If maintainers prefer more familiar mandatory notice requirements:

| Material | Alternative |
|---|---|
| Code | MIT or Apache-2.0 |
| Documentation | CC BY 4.0 |
| Data | CC0 1.0 or CC BY 4.0 |

This creates a real attribution requirement for some materials.

That does not fully match the stated “reference only occasionally” preference.

## 3.3 Recommended decision

For the project’s stated philosophy:

```text
Code: 0BSD
Original documentation and datasets: CC0 1.0
Citation: appreciated, easy, optional
```

Before changing licenses, confirm that all currently committed material can legally be relicensed.

## 3.4 Third-party material policy

Every non-original artifact must have metadata:

```yaml
origin: external
author: ...
source: ...
license: ...
redistribution_allowed: true | false | unknown
modification_allowed: true | false | unknown
project_storage:
  public
  checksum_only
  private
```

Do not assume that a mathematical word, paper PDF, image, or externally supplied dictionary can automatically be redistributed.

---

# 4. Citation and acknowledgement system

The goal is to make credit easy without creating friction.

## 4.1 `CITATION.cff`

Maintain a valid `CITATION.cff` containing:

- project title;
- current software or research-snapshot version;
- authors and contributors;
- repository URL;
- release date;
- license;
- DOI when available;
- preferred citation.

## 4.2 `CITATION.md`

Provide several ready-to-copy formats.

### Academic citation

```text
Huhta, J., contributors. Combinatorics on Words Research:
an open computational research, education, and AI-assistance platform.
Version X.Y, year, DOI/URL.
```

### Informal acknowledgement

```text
This work used tools or research protocols from the
Combinatorics on Words Research project.
```

### Software acknowledgement

```text
Computations used the Java COW Backtracker and independent
verification workflow from the Combinatorics on Words Research project.
```

## 4.3 Citation is not evidence

Being cited does not validate a claim.

Citation tracking may measure project reach, but it must not be used as a mathematical confidence score.

## 4.4 Contributor credit

Track roles explicitly:

- concept;
- software;
- verification;
- dataset;
- compute;
- pedagogy;
- documentation;
- visualization;
- external review;
- project maintenance.

Use a contributor-role file instead of inferring scientific credit only from commit count.

---

# 5. One evidence core

The evidence core is the authoritative shared layer.

## 5.1 Core registries

```text
research/
  definitions/
  claims/
  conjectures/
  observations/
  evidence/
  records/
  runs/
  counterexamples/
  negative-results/
  proofs/
  reviews/
  sources/
  dictionaries/
  certificates/
  snapshots/
```

## 5.2 Machine-readable exports

Create:

```text
definitions.json
claims.json
conjectures.json
evidence.json
records.json
runs.json
negative-results.json
sources.json
reviews.json
```

Markdown remains the human-readable research notebook.

JSON or YAML becomes the machine-readable contract used by:

- the website;
- CI;
- AI retrieval;
- teaching views;
- dashboards;
- external tools.

## 5.3 Stable identifiers

Examples:

```text
DEF-AA2F-0001
CLAIM-0108
CONJ-0021
OBS-0042
EVID-0143
REC-AA2FR-0003
RUN-20260805-0001
NEG-0037
REVIEW-0012
SOURCE-0084
```

Identifiers are never reused.

## 5.4 Evidence types

```text
PRIMARY_SOURCE
SECONDARY_SOURCE
EXACT_COMPUTATION
HEURISTIC_COMPUTATION
INDEPENDENT_REPLICATION
COUNTEREXAMPLE
FORMAL_PROOF
CODE_AUDIT
EXPERT_REVIEW
PEDAGOGICAL_EXAMPLE
AI_GENERATED_LEAD
```

`AI_GENERATED_LEAD` is not evidence for truth.

---

# 6. Evidence passports

Every important result should have an **evidence passport**.

Example:

```yaml
id: EVID-0143
supports:
  - CLAIM-0108

type: EXACT_COMPUTATION
scope:
  class: AA2FR
  statement: "A verified word of length 2107 exists."

artifacts:
  word: REC-AA2FR-0003
  run: RUN-20260804-0002
  verification:
    - VERIFY-JAVA-0011
    - VERIFY-CPP-0004

software:
  versions:
    - java-cow-backtracker-v1.2
  commits:
    - "..."

provenance:
  finder: ...
  provider: ...
  verifier: ...

limitations:
  - finite result only
  - does not establish an infinite AA2FR word
```

The passport can be rendered differently for:

- researchers;
- students;
- AI agents;
- website visitors.

---

# 7. Claim lineage graph

A claim should not be treated as one isolated row.

Track:

```text
definition dependencies
source dependencies
software dependencies
artifact dependencies
supersedes
contradicts
supports
derived from
independently replicates
```

Example:

```text
DEF-AA2FR-0001
       ↓
RUN-20260804-0002
       ↓
EVID-0143
       ↓
CLAIM-0108
       ↓
website record page
       ↓
teaching lesson
       ↓
AI benchmark question
```

If one dependency is retracted, CI can identify every affected output.

---

# 8. Content-type firewall

Every scientific-sounding website statement should be typed.

## 8.1 Required content types

```text
THEOREM
EXACT_RESULT
VERIFIED_RECORD
BOUNDED_COMPUTATION
OBSERVATION
CONJECTURE
HEURISTIC
ANALOGY
ARTISTIC_INTERPRETATION
EDUCATIONAL_SIMPLIFICATION
OPEN_QUESTION
RETRACTED
```

## 8.2 Website markup

Example:

```html
<span
  data-content-type="EXACT_RESULT"
  data-claim-id="CLAIM-0108">
  ...
</span>
```

## 8.3 Build rules

CI fails when:

- an exact-result statement lacks a claim ID;
- a record has no artifact checksum;
- a theorem lacks a source or proof record;
- an analogy is presented as an exact result;
- a retracted claim remains visible without warning;
- a superseded record is labeled current;
- browser telemetry is presented as an authoritative result.

---

# 9. Research Lab

The Research Lab is the expert-facing part of the project.

## 9.1 Main functions

- exact search;
- record hunting;
- independent verification;
- morphism and substitution experiments;
- D40 analysis;
- cut-and-certify experiments;
- conjecture challenges;
- bounded exhaustive computation;
- negative-results preservation;
- external replication.

## 9.2 Research views

```text
/research/status
/research/claims
/research/open-questions
/research/records
/research/runs
/research/counterexamples
/research/negative-results
/research/challenges
/research/snapshots
```

## 9.3 Research status page

Display:

- what is known;
- what is not known;
- current exact results;
- disputed items;
- latest verified record;
- active challenge packets;
- last snapshot date;
- next review priorities.

Avoid generic “progress toward proof” indicators.

---

# 10. Learning Lab

The educational system should be designed as a curriculum, not only a collection of tabs.

## 10.1 Learning path A — Foundations

Learners can:

- identify ordinary and Abelian squares;
- calculate Parikh vectors;
- explain the difference between AA2F and AA2FR;
- construct small examples;
- understand finite versus infinite claims.

## 10.2 Learning path B — Algorithms

Learners can:

- write a naive verifier;
- understand prefix sums;
- justify suffix-only incremental checking;
- calculate real complexity;
- distinguish binary-search cost from total search cost;
- identify off-by-one errors.

## 10.3 Learning path C — Research software

Learners can:

- create an independent verifier;
- test resume equivalence;
- audit shared state;
- create a run manifest;
- verify a checksum;
- distinguish `EXHAUSTED` from `BUDGET_EXHAUSTED`.

## 10.4 Learning path D — Research apprenticeship

Learners:

- choose one challenge packet;
- state a bounded research question;
- define a kill condition;
- run a reproducible experiment;
- preserve raw output;
- write an evidence passport;
- submit a replication or counterexample.

---

# 11. Prediction–experiment–reflection pedagogy

The project should deliberately expose failed intuitions.

Example lesson:

```text
PREDICTION
Does keeping letter frequencies balanced help avoid Abelian squares?

EXPERIMENT
Construct words using a balance heuristic.

OBSERVATION
Compare with known long words and negative results.

REFLECTION
Why was the original intuition incomplete or false?
```

This model is suitable for:

- D40 completeness;
- record length and infinity;
- local versus global constraints;
- morphism symmetry;
- “O(1)” claims;
- heuristic confidence;
- AI-generated hypotheses.

---

# 12. Museum of mistakes

The existing negative-results philosophy can become a major educational asset.

Create a public section:

```text
/museum-of-mistakes
```

Each entry includes:

- the original tempting idea;
- why it seemed plausible;
- the smallest counterexample;
- the computational or logical mistake;
- how the project corrected it;
- what reusable lesson remains.

Possible categories:

```text
false mathematical intuition
incorrect implementation
complexity overstatement
citation error
bounded-to-unbounded leap
AI hallucination
resume bug
parallelism bug
dictionary completeness assumption
```

The goal is not embarrassment.

The goal is:

> make error correction visible as part of science.

---

# 13. Teacher and mentor materials

Provide:

```text
learning objectives
lesson plans
worksheets
starter code
expected misconceptions
assessment rubrics
extension tasks
research challenge variants
```

## 13.1 Teacher mode

A teacher-facing page can hide solutions and display:

- lesson duration;
- required background;
- software requirements;
- mathematical goals;
- computing goals;
- research-integrity goals.

## 13.2 Assessment levels

Assess more than correct output.

Possible rubric:

| Dimension | Beginner | Developing | Proficient | Research-ready |
|---|---|---|---|---|
| Mathematical definition | partial | mostly correct | exact | handles edge cases |
| Algorithm | works on examples | some tests | independently verified | reproducible and audited |
| Evidence calibration | overclaims | needs prompting | bounded claims | explicit limitations |
| Documentation | incomplete | usable | reproducible | externally reviewable |

---

# 14. AI Lab

The AI Lab should begin with retrieval and evaluation, not immediate fine-tuning.

## 14.1 Recommended progression

```text
Stage 1: structured project corpus
Stage 2: retrieval-augmented agent
Stage 3: benchmark and red-team evaluation
Stage 4: tool-using research agent
Stage 5: optional fine-tuning on validated behaviors
```

## 14.2 Why RAG first

Project knowledge changes:

- claims are corrected;
- records are superseded;
- software is audited;
- conjectures are rejected;
- source interpretations improve.

RAG can retrieve the current state.

Fine-tuning may preserve stale claims in model weights.

## 14.3 AI corpus

```text
ai/
  corpus/
    definitions.json
    claims.json
    evidence.json
    sources.json
    counterexamples.json
    negative-results.json
    code-audits.json
    lessons.json

  benchmarks/
  model-cards/
  dataset-cards/
  incidents/
  contamination-ledger/
```

---

# 15. AI provenance and contamination ledger

The project needs to prevent circular evidence.

## 15.1 Contamination example

```text
AI proposes a conjecture
→ conjecture is written into project documentation
→ AI later retrieves the documentation
→ AI cites its old proposal as independent support
```

## 15.2 Required provenance fields

```yaml
origin:
  PRIMARY_SOURCE
  EXTERNAL_HUMAN
  PROJECT_HUMAN
  AI_GENERATED
  COMPUTATION

review:
  UNREVIEWED
  HUMAN_CHECKED
  INDEPENDENTLY_COMPUTED
  PRIMARY_SOURCE_VERIFIED
  PROOF_AUDITED
```

## 15.3 No self-support rule

An AI-generated item cannot increase the evidential status of the same claim unless it is independently validated by:

- exact computation;
- external source;
- human proof;
- independent implementation;
- counterexample search.

---

# 16. AI benchmark

Create a versioned **COW Research Agent Benchmark**.

## 16.1 Benchmark categories

```text
definition accuracy
claim-status classification
citation verification
bounded-versus-unbounded calibration
counterexample discovery
code correctness audit
complexity audit
resume audit
parallel-state audit
record verification
pedagogical explanation
refusal to overclaim
research-plan quality
```

## 16.2 Adversarial examples

Include:

- plausible but false citations;
- one missed `K` value;
- hidden invalid symbol;
- faulty checkpoint state;
- thread race;
- valid-looking but false record;
- browser computation presented as theorem;
- old superseded project claim;
- AI-generated idea presented as independent literature support.

## 16.3 Holdout set

Keep some benchmark tasks private.

Otherwise an agent may memorize the answers.

## 16.4 Benchmark outputs

Measure:

- correctness;
- evidence calibration;
- citation accuracy;
- counterexample quality;
- reproducibility;
- false-positive claim rate;
- refusal quality;
- uncertainty quality.

Do not use one overall “AI intelligence score.”

---

# 17. AI incident registry

Create:

```text
AI_INCIDENTS.md
```

or structured entries.

Example:

```yaml
id: AI-INCIDENT-0012
date: ...
category: complexity_overstatement
description: "Agent described binary lookup as making the entire search O(1)."
impact: medium
detected_by: human review
correction:
  - updated guide
  - added benchmark task
  - added instruction
status: resolved
```

The incident registry becomes:

- training data;
- benchmark data;
- pedagogical material;
- evidence of process improvement.

---

# 18. Discovery and validation corpora

Heuristic mining must separate discovery from confirmation.

## 18.1 Discovery corpus

Used to find:

- motifs;
- danger suffixes;
- branching patterns;
- candidate signatures;
- record anatomy observations.

## 18.2 Frozen validation corpus

Not used during hypothesis formation.

Used to test whether the observation generalizes.

## 18.3 External validation corpus

Generated by:

- another researcher;
- another implementation;
- a different seed family;
- a later frozen snapshot.

## 18.4 Publication wording

Use:

```text
observed in discovery data
validated on frozen internal data
independently replicated externally
```

Do not call a pattern “replicated” after rerunning it on the same adaptive corpus.

---

# 19. Open participation system

The project should make contribution possible without requiring mastery of the entire repository.

## 19.1 Challenge packets

Each challenge contains:

```yaml
id: CHALLENGE-0001
title: ...
difficulty: beginner | undergraduate | graduate | research

question: ...
scope: ...
inputs: ...
expected_output: ...
known_controls: ...
success_condition: ...
kill_condition: ...

what_it_would_show: ...
what_it_would_not_show: ...

credit:
  contributor_role: independent_replication
```

## 19.2 Challenge categories

```text
verify a record
reproduce a claim
audit one source
find a counterexample
compare Java and C++
test a boundary signature
improve a lesson
translate a module
create a verifier
analyze one negative result
```

## 19.3 Adopt-a-claim program

A contributor can “adopt” one claim and:

- verify its source;
- reproduce its computation;
- check website wording;
- add tests;
- monitor supersession.

This creates durable maintenance ownership without requiring formal authority.

---

# 20. Replication badges

Add descriptive badges to claims and results.

```text
SOURCE_CHECKED
ARTIFACT_AVAILABLE
INDEPENDENT_CODE_PATH
CROSS_LANGUAGE_VERIFIED
EXTERNALLY_REPLICATED
PROOF_AUDITED
TEACHING_READY
AI_BENCHMARKED
```

Badges must correspond to machine-checkable criteria.

They are not prestige awards.

---

# 21. Governance

An open project needs clear but lightweight governance.

## 21.1 Roles

```text
Maintainer
Research editor
Software verifier
Source reviewer
Pedagogy editor
AI evaluation editor
External reviewer
Contributor
```

One person may hold several roles.

## 21.2 Decision classes

| Decision | Required review |
|---|---|
| Typo or formatting | one maintainer |
| New heuristic | code review |
| New exact claim | evidence review + independent check |
| License change | maintainer approval and contributor audit |
| Record publication | independent verification |
| AI corpus promotion | human review |
| Retraction | documented correction process |

## 21.3 Scientific disagreement

Use statuses:

```text
DISPUTED
UNDER_REVIEW
RETRACTED
CORRECTED
SUPERSEDED
```

Never silently rewrite history.

---

# 22. Contributor agreement without heavy bureaucracy

Avoid a complex contributor license agreement unless legally necessary.

A lightweight contribution statement can say:

> By contributing original material, you confirm that you have the right to submit it and agree that it may be distributed under the repository’s stated license.

For external artifacts, contributors must specify:

- ownership;
- publication permission;
- redistribution permission;
- attribution preference;
- embargo requirements.

---

# 23. Data-access classes

Not every artifact can be public.

Use:

## `PUBLIC`

The exact artifact is redistributed.

## `CHECKSUM_ONLY`

The project publishes:

- checksum;
- metadata;
- provenance;
- retrieval or contact instructions.

## `EMBARGOED`

Artifact is temporarily private.

## `PRIVATE_REVIEW`

Artifact is available only to approved reviewers.

The website must distinguish:

```text
verified
```

from:

```text
publicly downloadable
```

---

# 24. Research snapshots and long-term preservation

Create versioned snapshots:

```text
research-snapshot-2026-08
research-snapshot-2026-12
```

Each snapshot contains:

- definitions;
- claims;
- machine-readable registries;
- record metadata;
- public artifacts;
- checksums;
- source coverage;
- software versions;
- known limitations;
- website export;
- AI corpus version;
- benchmark version.

Archive major snapshots in a long-term repository and assign a DOI when practical.

---

# 25. Reproducibility levels

Define project-wide levels.

## R0 — described

Method described, no runnable artifact.

## R1 — artifact available

Input or output artifact preserved.

## R2 — internally reproducible

Clean checkout reproduces the result.

## R3 — independently reimplemented

A separate code path agrees.

## R4 — externally replicated

Another person or group reproduces the result.

## R5 — formally or proof audited

The reasoning or certificate receives mathematical audit.

Display the level on exact results.

---

# 26. Continuous integration

CI should be the project’s automated research-integrity assistant.

## 26.1 Required checks

```text
unit tests
property tests
claim-drift checks
schema validation
record checksums
broken claim references
website content-type coverage
source registry integrity
Java self-tests
small cross-implementation fixtures
AI corpus provenance checks
license metadata checks
```

## 26.2 Pull-request report

Every pull request should display:

- tests passed;
- claims affected;
- artifacts changed;
- evidence passports changed;
- website statements changed;
- AI corpus entries changed;
- license/provenance changes.

---

# 27. Website information architecture

Recommended top-level structure:

```text
Home
Research
Learn
AI Lab
Records
Challenges
Evidence
About
```

## 27.1 Home

Explain:

- the open problem;
- what the project knows;
- what visitors can do;
- what finite records do and do not mean.

## 27.2 Research

Expert status, claims, runs, open questions, negative results.

## 27.3 Learn

Guided learning paths rather than a large flat tab list.

## 27.4 AI Lab

Explain:

- how AI is used;
- what AI is allowed to claim;
- benchmark results;
- incidents;
- corpus versions;
- human oversight.

## 27.5 Evidence

Allow visitors to inspect:

- claim IDs;
- evidence passports;
- sources;
- verification status;
- artifact access;
- replication badges.

---

# 28. Browser computation policy

Browser tools are useful for learning and exploration.

They must be labeled:

```text
EDUCATIONAL_LOCAL_COMPUTATION
```

or:

```text
EXPERIMENTAL_BROWSER_RUN
```

Authoritative project results require:

- versioned code;
- manifest;
- preserved output;
- checksum;
- independent verification.

Recommended wording:

> Browser experiments are exploratory and educational. Project claims are promoted only from archived and independently checked research artifacts.

---

# 29. Publication strategy

The project can support several distinct publications.

## 29.1 Mathematical publication

Focus:

- exact results;
- bounded exclusions;
- structural lemmas;
- verified records;
- proof-oriented algorithms.

## 29.2 Research methodology publication

Focus:

- claims ledger;
- negative-results registry;
- AI incidents;
- evidence passports;
- claim-drift prevention;
- independent verification workflow.

## 29.3 Education publication

Focus:

- teaching finite versus infinite reasoning;
- learning through failed conjectures;
- student participation in real computational research;
- assessment of evidence literacy.

## 29.4 AI-assistance publication

Focus:

- benchmark;
- RAG corpus;
- agent calibration;
- provenance;
- contamination prevention;
- human–AI research collaboration.

---

# 30. Metrics

Do not use one project success score.

## 30.1 Research metrics

- independently verified exact results;
- external replications;
- counterexamples found;
- invalid claims corrected;
- reusable datasets and certificates;
- resolved conjectures.

## 30.2 Education metrics

- completion of learning paths;
- improvement in evidence calibration;
- ability to identify overclaims;
- student replications;
- teacher adoption;
- quality of research-apprentice submissions.

## 30.3 AI metrics

- benchmark accuracy;
- unsupported-claim rate;
- citation error rate;
- false verification rate;
- successful bug discovery;
- calibration;
- reproducible experiment generation.

## 30.4 Open-community metrics

- forks;
- reused tools;
- translations;
- external challenge completions;
- contributions;
- citations and acknowledgements when voluntarily provided.

---

# 31. New concrete idea: research recipes

A research recipe is a portable, repeatable workflow.

Example:

```yaml
id: RECIPE-RECORD-VERIFY-001
title: Verify an AA2FR record independently

inputs:
  - word file
  - claimed class
  - claimed length

steps:
  - run Java verifier
  - run C++ verifier
  - compare SHA-256
  - create evidence passport
  - update record registry

outputs:
  - verification reports
  - checksum
  - status decision
```

Recipes can be used by:

- researchers;
- students;
- AI agents;
- CI;
- external collaborators.

---

# 32. New concrete idea: versioned syllabus snapshots

Tie teaching material to evidence snapshots.

Example:

```text
Syllabus 2026-A
uses research snapshot 2026-08
uses Java Backtracker v1.2
uses AI corpus v1
```

This prevents lessons from silently referring to superseded records or corrected claims.

---

# 33. New concrete idea: evidence-to-lesson traceability

Every lesson should record:

```yaml
lesson_id: LESSON-0012
depends_on:
  - DEF-AA2F-0001
  - CLAIM-0040
  - NEG-0011
snapshot: research-snapshot-2026-08
```

If a claim changes, CI identifies affected lessons.

---

# 34. New concrete idea: AI answer receipts

When the project AI answers a research question, it can produce an optional receipt:

```yaml
answer_id: AI-ANSWER-000123
corpus_version: AI-CORPUS-2026-08
claims_used:
  - CLAIM-0108
sources_used:
  - SOURCE-0042
tools_used:
  - java-verifier-v1.2
uncertainty:
  level: medium
limitations:
  - no external replication checked
```

This makes AI reasoning auditable without exposing hidden chain-of-thought.

---

# 35. New concrete idea: open replication days

Organize periodic public events:

```text
Replication Day
Bug Hunt Day
Claim Audit Day
Student Research Day
AI Red-Team Day
```

Each event uses frozen challenge packets and produces archived reports.

This can simultaneously advance:

- science;
- education;
- community;
- AI evaluation.

---

# 36. New concrete idea: optional gratitude registry

Because citation is optional under the recommended licensing model, create a voluntary page:

```text
/community/uses
```

Users may submit:

- project using the tools;
- course using the materials;
- paper acknowledging the project;
- translation;
- independent fork;
- artwork or visualization.

This records impact without turning acknowledgement into a legal barrier.

---

# 37. New concrete idea: “No silent authority transfer”

Adopt this project-wide rule:

> No statement gains authority merely by moving from chat, code comment, notebook, issue, website, lesson, or AI corpus into another project surface.

Authority changes only through an explicit promotion event:

```text
lead
→ observation
→ formal conjecture
→ exact result / proof / counterexample
```

This is especially important in a project that intentionally connects research, teaching, and AI.

---

# 38. Implementation phases

## Phase 0 — policy decisions

- choose license family;
- confirm contributor rights;
- approve optional-citation wording;
- define evidence-core ownership.

## Phase 1 — evidence core

- create stable IDs;
- create JSON/YAML schemas;
- export existing claims;
- add evidence passports;
- add claim lineage.

## Phase 2 — CI and website firewall

- add content types;
- add claim IDs;
- add schema validation;
- add research-integrity workflow;
- fix wording drift.

## Phase 3 — open participation

- create challenge packets;
- create issue templates;
- create contributor roles;
- create adopt-a-claim process;
- publish acknowledgement guidance.

## Phase 4 — Learning Lab

- create four learning paths;
- add teacher guides;
- build prediction–experiment–reflection lessons;
- publish Museum of Mistakes.

## Phase 5 — AI Lab

- create structured corpus;
- implement RAG;
- create contamination ledger;
- create benchmark;
- create AI incident registry;
- create answer receipts.

## Phase 6 — preservation and publication

- create first research snapshot;
- publish checksums;
- archive release;
- update `CITATION.cff`;
- add DOI when practical.

## Phase 7 — evaluation

- run external replication event;
- pilot one university or school learning path;
- benchmark at least two AI configurations;
- publish a project-methodology report.

---

# 39. First 20 concrete tasks

1. Add this plan to `docs/plans/`.
2. Decide between `0BSD + CC0` and `MIT/Apache + CC BY`.
3. Add `LICENSES.md`.
4. Update `CITATION.cff`.
5. Add `CITATION.md`.
6. Add optional acknowledgement wording.
7. Create evidence-passport schema.
8. Export `MATH_CLAIMS.md` into machine-readable JSON.
9. Add stable IDs to website claims.
10. Add website content-type labels.
11. Add full CI workflow.
12. Add public/private/checksum-only artifact classes.
13. Create five challenge packets.
14. Create the first Research Apprentice learning path.
15. Create the Museum of Mistakes page.
16. Create AI corpus v1.
17. Create contamination ledger.
18. Create 25 benchmark tasks.
19. Create research snapshot `2026-08`.
20. Invite one external researcher and one student to test the complete workflow.

---

# 40. Acceptance criteria

The first integrated platform version is complete when:

- [ ] license terms match the stated openness philosophy;
- [ ] citation is easy and clearly separated from legal permission;
- [ ] every exact website result has a claim ID;
- [ ] every published record has an evidence passport;
- [ ] machine-readable registries exist;
- [ ] CI checks claims, artifacts, and website drift;
- [ ] browser computation is labeled non-authoritative;
- [ ] four learning paths exist;
- [ ] negative results are usable as teaching material;
- [ ] external contributors can complete a challenge without reading the full repository;
- [ ] AI corpus entries have provenance;
- [ ] AI-generated leads cannot self-support;
- [ ] an AI benchmark exists;
- [ ] one research snapshot is archived;
- [ ] one result is externally replicated;
- [ ] project impact can be acknowledged voluntarily.

---

# 41. Final principle

The project should become an open scientific commons built around evidence.

Its identity is not only:

```text
a repository about Abelian squares
```

but:

```text
a living demonstration of how computational mathematics,
education, open science, and AI assistance can work together
without weakening standards of evidence.
```

The central rule is:

> **One evidence core, three missions.**

```text
Discover:
  produce new, auditable knowledge.

Teach:
  make the reasoning and mistakes understandable.

Train:
  help AI systems participate responsibly in research.
```

And the openness rule is:

> **Reuse freely. Improve openly. Verify independently. Acknowledge when useful.**
