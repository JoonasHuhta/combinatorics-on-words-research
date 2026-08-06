# Repository–Website Integration, Audience, Language, and AI Implementation Plan

## One evidence core, clearly separated public experiences

**Suggested repository path:**  
`docs/plans/REPOSITORY_WEBSITE_AUDIENCE_LANGUAGE_AND_AI_IMPLEMENTATION_PLAN.md`

**Status:** proposed implementation plan  
**Date:** 2026-08-06  
**Project:** `combinatorics-on-words-research`  
**Companion plan:** `docs/plans/SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN.md`  
**Primary objective:** make the repository, website, educational work, research evidence, community participation, and AI-assisted methodology function as one coherent but properly separated system

---

# 0. Executive summary

The project should be organized around one central idea:

> **One evidence core, several audience-specific views.**

The repository and website should not duplicate one another.

They should cooperate through a clear division of responsibility.

```text
GitHub repository
  stores exact claims, sources, code, experiments, artifacts,
  plans, reviews, corrections, contribution workflows, and history

Public website
  explains, teaches, visualizes, lets people experiment,
  presents current research status, and guides people toward participation

Archived releases
  freeze exact versions of claims, code, data, manifests, and checksums

AI-assisted workflow
  helps search, challenge, code, test, and organize,
  but never acts as an independent source of mathematical truth
```

The canonical flow of knowledge should be:

```text
sources
→ claims ledger
→ experiments and verification
→ machine-readable evidence exports
→ audience-specific website presentations
```

The return path should be:

```text
website visitor
→ ask a question
→ report a bug
→ challenge a claim
→ reproduce a result
→ improve a lesson
→ join a research task
→ GitHub Discussion, Issue, or Pull Request
```

The repository should use English as its canonical working language.

The public website may be multilingual.

Finnish should appear in the repository only inside intentional translation resources that have an English canonical source.

---

# 1. Current-state observations

The current repository already states three project goals:

1. advance research;
2. build open educational tools;
3. develop a reproducible AI-assisted research workflow.

It also already states that documentation, code comments, and commit messages should be written in English.

However, the current physical structure still reflects rapid prototype growth:

- canonical research documents are concentrated in the repository root;
- `MATH_CLAIMS.md` still contains extensive Finnish-language content;
- `docs/` currently exposes only `historical`, `plans`, and one CEGIS memo;
- `research/` currently has very little visible structure;
- several application, test, image, puzzle, and utility files remain in the repository root;
- the public website and repository link to one another, but mostly through general links rather than exact evidence links;
- education and AI are strong in the stated mission but do not yet have equally visible repository areas;
- the repository currently has no visible `.github/` workflow and community structure in the root listing;
- the current website combines learning, exploration, research computation, evidence, art, and Abelisk in one large interface.

Sources reviewed on 2026-08-06:

- repository root and README:  
  `https://github.com/JoonasHuhta/combinatorics-on-words-research`
- claims ledger:  
  `https://github.com/JoonasHuhta/combinatorics-on-words-research/blob/main/MATH_CLAIMS.md`
- documentation directory:  
  `https://github.com/JoonasHuhta/combinatorics-on-words-research/tree/main/docs`
- research directory:  
  `https://github.com/JoonasHuhta/combinatorics-on-words-research/tree/main/research`

This plan does not treat the current structure as a failure.

It treats it as a successful experimental phase that now needs stable public architecture.

---

# 2. The core operating model

## 2.1 One evidence core

The evidence core consists of:

```text
definitions
claims
sources
open questions
experiments
negative results
records
verification reports
corrections
software versions
run manifests
checksums
provenance
```

Each important object should receive a stable ID.

Examples:

```text
CLAIM-0004
QUESTION-MAKELA-001
EXPERIMENT-AA2FR-0042
RECORD-AA2F-0003
NEGATIVE-FORBID4-0007
PUZZLE-ABELISK-0041
AI-EVAL-CITATION-0012
CORRECTION-2026-0002
```

The website must not create a second, independent evidence system.

It should render selected views of the evidence core.

## 2.2 Several public views

The same evidence may be expressed differently for different audiences.

Example:

```text
Evidence core:
  CLAIM-0004
  exact formulation, source, status, scope, date

Beginner website:
  "Can a three-letter word avoid all longer hidden echoes forever?"

Research website:
  exact conjecture, known bounds, cited literature, current status

GitHub:
  complete claim row, source trail, related experiments, issue links

AI benchmark:
  question asking whether a finite record settles the conjecture
```

The wording changes.

The underlying claim identity does not.

---

# 3. Division of responsibility

## 3.1 The public website

The website should optimize for:

- understanding;
- discovery;
- visual explanation;
- accessibility;
- play;
- guided experimentation;
- current public research status;
- finding the right participation path.

The website answers:

```text
What is this?
Why is it interesting?
What can I try?
What is currently known?
What remains open?
How can I participate?
```

## 3.2 GitHub

GitHub should optimize for:

- exactness;
- provenance;
- version history;
- reproducibility;
- review;
- correction;
- discussion;
- issue tracking;
- contribution;
- archived technical detail.

GitHub answers:

```text
What exact claim supports this statement?
Which source was checked?
Which code version produced this result?
Can I reproduce it?
Has it been independently checked?
What failed before?
What should I work on next?
How do I challenge or correct this?
```

## 3.3 Releases and archives

GitHub Releases and research snapshots should optimize for:

- immutable citation;
- reproducible builds;
- permanent evidence;
- exact checksums;
- stable academic references.

They answer:

```text
What exact version was cited?
What files belonged to the result?
Can the result be reconstructed later?
```

## 3.4 AI methodology

The AI layer should optimize for:

- transparent assistance;
- provenance;
- evaluation;
- calibrated uncertainty;
- adversarial checking;
- reduction of repeated failed work.

It answers:

```text
How was AI used?
What did AI propose?
What did a human verify?
What did computation establish?
What remains unverified?
How well does the agent follow the project’s epistemic rules?
```

---

# 4. Audience model

The project serves several audiences with different needs.

A single landing page or README should not force all of them through the same material.

---

## 4.1 Curious visitor

### Goal

Understand the basic idea and why it matters.

### Best entry

```text
Website → Start Here
```

### Needs

- plain language;
- one strong example;
- clear open-problem status;
- no repository knowledge required;
- no large navigation wall.

### Primary content

```text
What is an Abelian square?
Why three and four letters are different
Mäkelä’s conjecture
Abelisk
```

### GitHub exposure

Very light.

Offer only:

```text
Open project
See the evidence
```

---

## 4.2 Learner or student

### Goal

Build conceptual understanding and learn experimental mathematics.

### Best entry

```text
Website → Learn → guided learning path
```

### Needs

- prediction before explanation;
- examples and non-examples;
- interactive visualizations;
- finite-versus-infinite reasoning;
- feedback;
- optional deeper mathematics.

### Primary content

```text
tutorials
word builder
Parikh vectors
search-tree exploration
Abelisk
research-literacy lessons
```

### GitHub exposure

Contextual:

```text
View the source behind this lesson
Try a student challenge
See how the verifier works
```

---

## 4.3 Teacher

### Goal

Use the project in a classroom or guided activity.

### Best entry

```text
Website → Teach
```

This may live under `Learn`, but it needs its own visible doorway.

### Needs

- lesson duration;
- learning goals;
- prerequisites;
- misconception guide;
- printable and plain-text material;
- answer keys;
- accessibility notes;
- data and privacy notes;
- classroom mode.

### GitHub exposure

Moderate:

```text
Download source materials
Suggest a correction
Translate a lesson
Report classroom feedback
```

---

## 4.4 Undergraduate or beginning researcher

### Goal

Move from learning into authentic research practice.

### Best entry

```text
Website → Research Doorway
GitHub → Research onboarding
```

### Needs

- exact definitions;
- small reproducible tasks;
- literature reading path;
- open challenge packets;
- known failed approaches;
- explanation of evidence levels;
- mentor or discussion path.

### Primary content

```text
replicate a claim
audit a verifier
classify minimal obstructions
run a bounded experiment
read and annotate one source
```

---

## 4.5 Research mathematician

### Goal

Assess the project’s mathematical value, claims, and open directions.

### Best entry

```text
GitHub → Research status
Website → Current research overview
```

### Needs

- exact formulations;
- sources;
- limitations;
- proof versus computation;
- independent verification;
- downloadable artifacts;
- machine-readable manifests;
- stable citations.

### Website exposure

Concise and exact.

### GitHub exposure

Deep:

```text
claims ledger
open questions
literature coverage
evidence passports
experiments
negative results
code
```

---

## 4.6 Software contributor

### Goal

Improve algorithms, architecture, tests, accessibility, or the website.

### Best entry

```text
GitHub → Contributing → Software path
```

### Needs

- architecture map;
- commands;
- issue labels;
- development environment;
- expected tests;
- feature boundaries;
- code ownership;
- pull-request checklist;
- examples of good first contributions.

### Website exposure

Mostly contextual source links.

---

## 4.7 Independent verifier

### Goal

Check a result using a genuinely separate implementation.

### Best entry

```text
Website → Evidence → Replicate
GitHub → Replication packets
```

### Needs

- exact input;
- exact expected output format;
- checksum;
- allowed implementation independence;
- known controls;
- discrepancy-report template;
- no dependency on the original search code.

---

## 4.8 AI and reproducibility researcher

### Goal

Study whether structured evidence and explicit epistemic rules improve AI-assisted research.

### Best entry

```text
Website → How AI Is Used
GitHub → AI methodology and evaluations
```

### Needs

- benchmark definitions;
- dataset cards;
- model and run metadata;
- public versus holdout split;
- contamination policy;
- AI incident log;
- human-review process;
- provenance labels;
- evaluation results.

---

## 4.9 AI coding or research agent

### Goal

Make a safe, bounded contribution without silently changing project truth.

### Best entry

```text
AGENTS.md
nearest nested AGENTS.md
CURRENT_FOCUS.md
relevant ADRs
task issue
```

### Needs

- concise current instructions;
- exact commands;
- architectural boundaries;
- stop conditions;
- allowed claim level;
- required tests;
- required provenance;
- current active plan;
- files that must not be modified.

The AI agent is an operational audience.

It should not be treated as the public-facing project audience.

---

# 5. Recommended website information architecture

Primary navigation:

```text
Home
Learn
Explore
Research
Evidence
Abelisk
Community
```

Secondary or footer entry:

```text
How AI Is Used
About
Corrections
Cite
```

---

## 5.1 Home

Purpose:

- explain the project in one minute;
- present the three missions;
- route audiences correctly.

Suggested identity:

```text
DISCOVER
Exact and reproducible research.

TEACH
Open lessons, visualizations, and Abelisk.

TRAIN
Trustworthy AI-assisted research workflows.
```

Audience buttons:

```text
I want to learn
I want to teach
I want to research
I want to verify or contribute
```

---

## 5.2 Learn

Contains:

```text
Abelian Squares: Start Here
Mäkelä’s Conjecture
History of Abelian Avoidance
Concept Map
Research Literacy
Teacher Materials
Museum of Mistakes
```

`Museum of Mistakes` should contain pedagogically curated cases involving:

- invalid reasoning;
- implementation bugs;
- unsupported prose;
- misleading visual interpretation;
- overclaiming.

It should not be the authoritative home of all negative research results.

---

## 5.3 Explore

Contains:

```text
Word Builder
Three-Letter Search Tree
Three-Letter Boundary Lab
Keränen Morphism Viewer
Morphism Microscope
Parikh Walk
Sonification
Art & Mathematical Imagination
```

Every module should state whether it is:

```text
educational demonstration
exploratory browser computation
archived project result
```

---

## 5.4 Research

Contains:

```text
Current Research Status
Open Questions
Research Programs
Morphism Research Lab
Restricted Mäkelä Search Lab
Additive Research
Experimental Seam Search
Negative Results & Research Lessons
```

The authoritative negative-results umbrella should be:

# **Negative Results & Research Lessons**

Subcategories:

```text
The Graveyard
  logically closed routes

Bounded Frontiers
  exact exclusions within stated limits

False Intuitions
  plausible ideas broken by counterexample

Transfer Gallery
  useful methods that did not transfer to this problem

Broken Instruments
  software and verification failures

Low-Value Routes
  valid methods whose cost exceeded their value
```

---

## 5.5 Evidence

Contains:

```text
Claims
Sources
Records
Verification
Replication
Corrections
Research Snapshots
How We Know
```

This is the strongest website bridge to GitHub.

Every evidence page should provide exact repository links.

---

## 5.6 Abelisk

A standalone, low-distraction experience.

GitHub links should not compete with gameplay.

Show them at meaningful moments:

```text
How the mathematics works
Report a puzzle problem
View the open project
```

---

## 5.7 Community

Contains:

```text
Ways to Participate
Student Challenges
Teacher Participation
Research Replication
Software Contributions
Discussions and Events
Credit and Recognition
Code of Conduct
```

---

## 5.8 How AI Is Used

This should be a dedicated transparency page, but not the first item in beginner navigation.

It should explain:

```text
AI may:
  propose hypotheses
  search literature
  draft tests
  compare source claims
  inspect code
  generate counterexample candidates
  summarize bounded runs

AI may not:
  become a primary source
  certify its own output
  upgrade a finite result into an infinite claim
  count as an independent verifier when it uses the same evidence path
  silently rewrite calibrated claim wording
```

---

# 6. Recommended repository information architecture

The repository root should remain a small set of canonical entry points.

## 6.1 Keep in the root

```text
README.md
CONTRIBUTING.md
AGENTS.md
CLAUDE.md
CODE_OF_CONDUCT.md
SECURITY.md
SUPPORT.md
LICENSE
LICENSES.md
CITATION.cff

MATH_CLAIMS.md
KNOWLEDGE_STATE.md
OPEN_RESEARCH_QUESTIONS.md
NEGATIVE_RESULTS.md
RESEARCH_CONTEXT.md
LITERATURE_COVERAGE.md
CURRENT_FOCUS.md
ROADMAP.md
```

These are high-value orientation and authority files.

## 6.2 Move noncanonical root files

Application and development artifacts should move into clear homes.

Example:

```text
web/
  legacy/
  src/
  public/
  tools/

tests/
  unit/
  integration/
  legacy/

scripts/
  research/
  maintenance/
  platform/

docs/
  assets/
```

## 6.3 Recommended `docs/` structure

```text
docs/
  README.md

  architecture/
    README.md
    web-architecture.md
    evidence-core.md

  adr/
    README.md
    0001-*.md

  education/
    README.md
    learning-paths/
    lessons/
    teacher-guides/
    worksheets/
    misconceptions/
    assessment/
    accessibility/
    translation-guides/

  research/
    README.md
    research-program-map.md
    methods/
    literature-seminar/
    proof-carrying-computation/

  ai/
    README.md
    AI_RESEARCH_POLICY.md
    PROVENANCE_POLICY.md
    CONTAMINATION_POLICY.md
    benchmark-design/
    prompt-protocols/
    model-and-run-cards/
    incidents/

  community/
    README.md
    participation-ladder.md
    mentorship.md
    events.md
    credit-policy.md
    outreach.md

  plans/
    README.md
    active/
    paused/
    implemented/

  handoffs/
    README.md
    YYYY-MM-DD-topic.md

  historical/
    README.md
```

## 6.4 Recommended `research/` structure

`research/` should contain research artifacts rather than general prose.

```text
research/
  README.md

  experiments/
    EXP-*/
      README.md
      manifest.json
      inputs/
      outputs/
      checksums.txt

  evidence/
    passports/

  records/
    metadata/

  certificates/

  snapshots/
    YYYY-MM/

  negative-results/
    structured/

  ai-evaluations/
    AI-EVAL-*/
```

## 6.5 Recommended `web/` structure

```text
web/
  src/
    app/
    routes/
    features/
    core/
    content/
    components/
    workers/
    styles/

  public/
    manifests/
    snapshots/
    translations/

  tests/
```

---

# 7. English-first repository language policy

## 7.1 Canonical rule

The following must be written in English:

```text
repository documentation
code comments
identifiers where natural-language naming is involved
commit messages
pull-request titles and descriptions
issue titles and descriptions
GitHub Discussions
architecture decisions
research manifests
claim descriptions
experiment notes
AI prompts and evaluation reports
```

English is canonical because the relevant research literature and intended research community are international.

## 7.2 Allowed exceptions

The following may contain non-English text intentionally:

```text
translation resource values
quoted source-language excerpts
proper names
linguistic data under study
test fixtures that specifically test language behavior
historical documents retained for provenance
```

Every exception must be clearly classified.

A Finnish website translation file is allowed because it is a translation artifact.

A Finnish-only research plan is not allowed.

## 7.3 Translation rule

Every localized website item must have:

```text
stable content key
English canonical source
Finnish translation
translation status
source revision
review date
reviewer
```

Example:

```yaml
key: learn.makela.open_question
source_language: en
source_revision: 7
translations:
  fi:
    status: REVIEWED
    source_revision: 7
    reviewed_at: 2026-08-06
```

## 7.4 No silent bulk translation of claims

The claims ledger currently contains extensive Finnish text.

Do not use one unreviewed automated bulk translation.

Claims must be migrated in controlled batches because wording such as:

```text
proved
computed
observed
bounded
open
rejected
indirect
```

must remain calibrated.

## 7.5 Claims migration procedure

For each row:

1. freeze the current row and checksum;
2. identify the exact claim scope;
3. translate into English;
4. preserve quotations in their original source language when required;
5. verify mathematical equivalence;
6. verify status terminology;
7. run claims drift checks;
8. record translator and reviewer;
9. keep the old row available in Git history;
10. merge only after review.

## 7.6 Historical Finnish documents

Classify each as:

```text
MIGRATE
  still active and should become English

ARCHIVE
  historically useful but no longer active

DELETE_FROM_CURRENT_TREE
  redundant or accidental, while remaining in Git history if legally safe
```

Historical documents may remain in Finnish only when:

- they are clearly under `docs/historical/`;
- an English metadata header explains what they are;
- no active document links to them as current guidance.

## 7.7 Language CI

Create:

```text
scripts/check-repository-language.js
```

It should scan changed canonical files for probable Finnish prose.

It should exclude:

```text
translation directories
source quotations
approved test fixtures
historical archive
bibliographic titles
```

The check should report probable mixed-language passages.

It should not automatically rewrite them.

Automatic language detection is imperfect around:

- mathematical notation;
- proper names;
- short labels;
- citations.

Therefore the CI check is a review guard, not an autonomous translator.

## 7.8 GitHub collaboration language

Issue templates should state:

> Please use English so that international contributors can participate. Machine-assisted English is welcome; clarity matters more than perfect grammar.

This is more inclusive than demanding polished academic English.

---

# 8. README redesign

The README should remain technical enough for researchers but give each audience a direct doorway.

Recommended opening:

```text
# Combinatorics on Words Research

One evidence core, three missions:

DISCOVER
Exact and reproducible research.

TEACH
Open lessons, visualizations, and Abelisk.

TRAIN
Trustworthy AI-assisted research workflows.
```

Then:

```text
Learn on the website
Teach with the project
Inspect the research
Replicate a result
Contribute code or evidence
See how AI is used
```

## 8.1 Audience cards

### I want to learn

Links:

```text
website Learn route
Mäkelä tutorial
Abelisk
```

### I want to teach

Links:

```text
teacher guide
lesson library
classroom feedback
```

### I want to research

Links:

```text
RESEARCH_CONTEXT.md
KNOWLEDGE_STATE.md
OPEN_RESEARCH_QUESTIONS.md
LITERATURE_COVERAGE.md
```

### I want to verify

Links:

```text
MATH_CLAIMS.md
replication packets
evidence passports
verification commands
```

### I want to contribute

Links:

```text
CONTRIBUTING.md
good first issues
Discussions
public project board
```

### I want to study the AI methodology

Links:

```text
docs/ai/
AGENTS.md
AI evaluations
incident log
```

---

# 9. Website–GitHub communication policy

## 9.1 Build-time integration

The website should obtain repository-derived information during its build.

Examples:

```text
claims summary
open-question status
negative-result categories
current build commit
release metadata
record checksums
lesson content
AI transparency summary
```

Do not rely on GitHub API calls during normal page use.

Reasons:

- reproducible snapshots;
- better performance;
- no API rate dependency;
- atomic release;
- easier offline use;
- clear relation between site version and repository state.

## 9.2 User-facing return links

Website actions may return users to GitHub.

Examples:

```text
Challenge this claim
Report a lesson problem
Suggest a source
Submit a replication
Discuss this question
Improve this translation
View exact code
```

## 9.3 Link types

### Living link

Points to `main`.

Use for:

```text
current contribution guide
current roadmap
current open questions
current discussion
```

Label:

```text
Current version
```

### Immutable link

Points to:

```text
commit SHA
release tag
archived snapshot
```

Use for:

```text
code used for a result
claim version cited on the site
research artifact
reproduction package
```

Label:

```text
Archived version used here
```

## 9.4 Contextual depth

### Beginner page

Show:

```text
Evidence behind this lesson
```

Do not show ten GitHub links.

### Research result

Show:

```text
Claim
Source
Artifact
Reproduce
Limitations
Challenge
```

### Abelisk

Show GitHub links only in:

```text
help
completion screen
about mathematics
bug report
```

### Footer

Always show:

```text
Source code
Claims
Open questions
Contribute
Cite
Corrections
Build revision
```

---

# 10. Education implementation

## 10.1 GitHub as the educational source

GitHub should contain the editable source material:

```text
lesson objectives
teacher notes
misconceptions
activities
assessment prompts
plain-text alternatives
translation resources
accessibility requirements
```

## 10.2 Website as the educational experience

The website should transform the source into:

```text
guided stories
interactive examples
games
classroom presentation mode
printable pages
student challenges
```

## 10.3 Educational metadata

Each lesson should contain:

```yaml
id: LESSON-MAKELA-001
title: Mäkelä's Conjecture
audiences:
  - general-public
  - secondary
  - undergraduate
duration_minutes:
  guided: 12
  classroom: 45
prerequisites: []
learning_outcomes:
  - identify an Abelian square
  - distinguish finite evidence from infinity
claim_ids:
  - CLAIM-0004
status: ACTIVE
owner: ...
last_reviewed: 2026-08-06
```

## 10.4 Pedagogical review

A mathematical review is not enough.

Lessons should be reviewed for:

- conceptual load;
- clarity;
- misconceptions;
- age appropriateness;
- accessibility;
- translation quality;
- evidence literacy.

## 10.5 Teacher feedback

Use a GitHub issue form:

```text
Teaching feedback
```

Ask:

- learner age or level;
- lesson used;
- duration;
- where learners struggled;
- misconception observed;
- accessibility problem;
- suggested improvement.

Do not collect identifiable student data.

---

# 11. Research implementation

## 11.1 GitHub is canonical

The following remain canonical in GitHub:

```text
claim status
research question status
source verification
experiment definitions
negative results
record metadata
corrections
verification reports
```

## 11.2 Website research summaries

The website presents concise cards.

Example:

```text
Question
Exact statement

Status
Open

Known
Bounded results and literature

Unknown
What the evidence does not establish

Current project work
Active research routes

Evidence
Claims and artifacts

Participate
Replicate, challenge, or extend
```

## 11.3 Research artifact requirements

An archived computational result should include:

```text
artifact ID
question ID
claim IDs
code commit
configuration
input checksums
output checksums
environment
start and end time
stopping condition
raw output
verification status
known limitations
```

---

# 12. AI implementation

## 12.1 AI is a method, not the authority

The project should avoid presenting AI as:

```text
the mathematician
the verifier
the source
the discoverer whose output is trusted by default
```

Preferred framing:

> AI is used as a fallible research instrument operating under explicit evidence and verification rules.

## 12.2 Repository structure

```text
docs/ai/
  README.md
  AI_RESEARCH_POLICY.md
  PROVENANCE_POLICY.md
  CONTAMINATION_POLICY.md
  MODEL_AND_RUN_CARD_STANDARD.md
  AI_INCIDENTS.md

  benchmark-design/
  prompt-protocols/
  evaluation-guides/
```

Research outputs:

```text
research/ai-evaluations/
  AI-EVAL-*/
    manifest.json
    prompts/
    outputs/
    scoring/
    review/
    checksums.txt
```

## 12.3 Provenance labels

Every research idea or statement should be able to record origin:

```text
PRIMARY_SOURCE
EXTERNAL_HUMAN
PROJECT_HUMAN
AI_GENERATED
COMPUTATION
DERIVED_FROM_PROJECT_CORPUS
```

Review status:

```text
UNREVIEWED
HUMAN_CHECKED
SOURCE_VERIFIED
INDEPENDENTLY_COMPUTED
REJECTED
SUPERSEDED
```

Origin and review status are different dimensions.

An AI-generated idea may later become source-verified.

It must not lose its provenance.

## 12.4 Contamination ledger

Record when an AI has been exposed to:

- project conjectures;
- unpublished candidate words;
- negative-results archive;
- benchmark answers;
- hidden evaluation tasks.

This prevents later AI output from being described as independent evidence when it may have reproduced project material.

## 12.5 AI incident log

Examples:

```text
invented citation
overstated finite evidence
reintroduced rejected claim
shared-code verifier falsely called independent
misread morphism symmetry
changed a stopping condition
translated calibrated wording incorrectly
```

The incident log should include:

```text
what happened
impact
detection method
correction
new guard
affected claims or artifacts
```

## 12.6 Website AI transparency

Publish:

```text
What AI is used for
What AI is not trusted to do
How outputs are reviewed
Known incidents
Latest evaluation summary
Current corpus snapshot
```

Do not publish private holdout benchmark answers.

## 12.7 AI agent context

Keep the root `AGENTS.md` concise and stable.

Use nested files when needed:

```text
web/AGENTS.md
research/AGENTS.md
docs/education/AGENTS.md
docs/ai/AGENTS.md
```

Each nested file should contain only local instructions.

Avoid one enormous context document.

---

# 13. Community and participation implementation

## 13.1 Discussions

Enable categories:

```text
Questions
Research Ideas
Teaching
Abelisk
Reproductions
Reading Group
Show and Tell
Announcements
```

## 13.2 Issues

Use for actionable work:

```text
confirmed bug
claim challenge
source correction
replication result
accessibility issue
teaching improvement
bounded research task
software task
translation correction
```

## 13.3 Labels

Suggested taxonomy:

```text
area:education
area:research
area:evidence
area:abelisk
area:ai
area:web
area:community

type:bug
type:claim-challenge
type:replication
type:source
type:documentation
type:experiment
type:accessibility
type:translation

difficulty:starter
difficulty:intermediate
difficulty:advanced

status:ready
status:needs-design
status:needs-source
status:needs-verification
status:blocked
```

Avoid dozens of near-duplicate labels.

## 13.4 Participation ladder

```text
Explorer
Replicator
Contributor
Research Apprentice
Independent Researcher
Mentor
```

Each role needs an explicit next action.

## 13.5 Good first contributions

Good first issues should be real and bounded:

```text
verify one claim row
translate one reviewed lesson
add one accessibility alternative
reproduce one short computation
audit one website statement
create one minimal counterexample
write one independent verifier test
```

Do not use beginners as free labor for vague refactors.

## 13.6 Credit

Maintain a contribution ledger covering:

```text
code
source checking
replication
counterexamples
teaching review
translation
accessibility
puzzle design
community moderation
```

Credit should not depend only on Git commit count.

---

# 14. Documentation lifecycle

Every significant document should have machine-readable metadata.

Example:

```yaml
---
id: PLAN-WEB-AUDIENCE-001
status: ACTIVE
owner: Joonas Huhta
created: 2026-08-06
last_reviewed: 2026-08-06
review_cycle_days: 90
supersedes: []
related:
  - PLAN-WEB-ARCHITECTURE-001
audiences:
  - maintainer
  - contributor
---
```

## 14.1 Status values

```text
DRAFT
PROPOSED
ACCEPTED
ACTIVE
PAUSED
IMPLEMENTED
SUPERSEDED
REJECTED
ARCHIVED
```

## 14.2 Plan index

Create:

```text
docs/plans/README.md
```

It should state:

```text
active plans
implemented plans
paused plans
superseded plans
current owner
next review date
```

## 14.3 Handoffs

Replace the continuously growing `NEXT_STEP.md` with:

```text
CURRENT_FOCUS.md
ROADMAP.md
docs/handoffs/YYYY-MM-DD-topic.md
```

`CURRENT_FOCUS.md` should remain short.

## 14.4 Corrections

Create:

```text
docs/corrections/
```

and a website route:

```text
/evidence/corrections/
```

A correction record includes:

```text
previous wording
new wording
reason
affected claim
affected release
scientific impact
date
```

---

# 15. Git workflow and governance

## 15.1 Branch strategy

```text
main
short-lived branches
release tags
```

No long-lived `develop` branch.

## 15.2 Pull requests

Use pull requests for:

- mathematical claim changes;
- translations of claims;
- architecture changes;
- website feature migrations;
- release preparation;
- AI policy changes.

## 15.3 Required checks

```text
tests
claims drift
language policy
content schemas
link check
artifact policy
website build
accessibility smoke test
```

## 15.4 Code ownership

Create `.github/CODEOWNERS`.

Possible areas:

```text
claims and evidence
mathematical core
website
education
AI methodology
community policy
```

A solo maintainer may own all areas initially.

The structure prepares for future delegation.

## 15.5 Decision rights

Document who may:

```text
promote a claim
mark a claim rejected
approve a research snapshot
change AI policy
publish a correction
moderate Discussions
release the website
```

This prevents ambiguity as the community grows.

---

# 16. Machine-readable content pipeline

The long-term pipeline should be:

```text
canonical Markdown and manifests
        ↓
parsers and exporters
        ↓
schema validation
        ↓
generated JSON
        ↓
website build
        ↓
static deployment
```

Examples:

```text
MATH_CLAIMS.md
→ claims.full.json
→ claims.summary.json

OPEN_RESEARCH_QUESTIONS.md
→ questions.json

NEGATIVE_RESULTS.md
→ negative-results.json

education lessons
→ lesson index

AI evaluations
→ public evaluation summary
```

Generated files should include:

```text
generator version
source commit
schema version
generated time
do-not-edit notice
```

---

# 17. New risks and opportunities not yet fully addressed

## 17.1 Translation drift

A Finnish website translation can become scientifically stale after the English claim changes.

Solution:

- source revision per translation;
- CI marks stale translations;
- stale research text falls back to English or displays a warning;
- do not silently show outdated scientific wording.

## 17.2 Audience drift

A research page may gradually accumulate beginner explanations, while a beginner page accumulates technical detail.

Solution:

- declare the primary audience in page metadata;
- test pages with that audience;
- link outward rather than placing every depth on one page.

## 17.3 Bus factor

A project strongly dependent on one maintainer can become unmaintainable even with good code.

Solution:

- document release process;
- document domain and repository ownership;
- document recovery procedures;
- delegate review areas gradually;
- create maintainers’ handbook.

## 17.4 Moderation burden

Opening Discussions creates work.

Solution:

- publish scope and conduct rules;
- start with few categories;
- define archive and close policies;
- recruit moderators only after activity exists.

## 17.5 Privacy

Teacher feedback, analytics, and AI experiments can accidentally collect personal information.

Solution:

- collect minimal anonymous data;
- do not request student names;
- separate educational research from ordinary product analytics;
- require an ethics protocol for formal learner studies.

## 17.6 Link rot and scholarly permanence

Research websites change.

Solution:

- stable slugs;
- archived releases;
- exact commit links;
- DOI snapshots when mature;
- link checker;
- correction pages rather than silent deletion.

## 17.7 Search-engine preservation of old errors

Corrected website text may remain in caches and external citations.

Solution:

- public correction record;
- canonical page metadata;
- updated summaries;
- retained historical claim state;
- release notes naming important corrections.

## 17.8 Contributor overload

A very sophisticated repository can intimidate newcomers.

Solution:

- audience-specific onboarding;
- challenge packets;
- one-command checks;
- example pull request;
- starter tasks with clear completion criteria.

## 17.9 AI context overload

Long instruction files may reduce the chance that agents follow the most important rules.

Solution:

- concise root instructions;
- nested local instructions;
- current-focus file;
- stable IDs;
- machine-readable schemas;
- remove superseded guidance from active context.

## 17.10 Evidence promotion

The project needs an explicit process for moving an object from:

```text
browser observation
→ internal computation
→ independently checked result
→ public claim
→ archived release
```

Without this, the repository may collect evidence without a clear promotion path.

## 17.11 Educational claims

Statements such as:

```text
this activity improves understanding
this game teaches research literacy
```

are empirical educational claims.

They should not be assumed merely because the design is thoughtful.

Use:

```text
design intention
pilot observation
formal study result
```

as separate labels.

## 17.12 Accessibility as evidence quality

An inaccessible visualization can hide the basis of a claim from some users.

Accessibility should therefore be treated not only as product quality but also as evidence transparency.

## 17.13 Institutional readiness

Future schools, universities, funders, and research partners may ask for:

```text
governance
licensing
data management
ethics
maintenance plan
citation
release stability
```

Preparing lightweight versions now reduces later friction.

---

# 18. Ordered implementation plan

---

## Phase 0 — Adopt the policy

### Work

- accept this plan or record changes;
- create relevant ADRs;
- declare English canonical language;
- define translation exception;
- define repository and website roles;
- define evidence-core principle.

### Why

Implementation will drift if the conceptual boundaries are not first accepted.

### Exit criteria

- policy linked from README and CONTRIBUTING;
- language rule unambiguous;
- AI role unambiguous;
- canonical evidence sources named.

---

## Phase 1 — Repository language and structure audit

### Work

Inventory:

```text
active Finnish documents
mixed-language documents
Finnish claim rows
Finnish code comments
Finnish commit-facing guidance
translation resources
historical Finnish material
```

Classify:

```text
translate
archive
remove from current tree
intentional translation
source quotation
```

Create a migration ledger.

### Why

A language policy without an inventory produces endless partial cleanup.

### Exit criteria

- every detected item has a disposition;
- no active Finnish-only plan remains unclassified;
- claims migration batches defined.

---

## Phase 2 — Create navigation and indexes

### Work

Create:

```text
docs/README.md
docs/education/README.md
docs/research/README.md
docs/ai/README.md
docs/community/README.md
docs/plans/README.md
research/README.md
```

Create:

```text
CURRENT_FOCUS.md
ROADMAP.md
```

Begin moving old handoffs out of `NEXT_STEP.md`.

### Why

People and AI agents need stable entry points before files are moved.

### Exit criteria

- every major area has an English index;
- active plans have statuses;
- current focus is readable in under five minutes.

---

## Phase 3 — README and audience onboarding

### Work

- rewrite README opening around Discover, Teach, Train;
- add audience cards;
- clarify browser versus authoritative computation;
- clarify npm development dependencies;
- link AI methodology;
- link teacher and learner paths;
- link replication path.

### Why

README is the project’s first GitHub interface.

### Exit criteria

A first-time visitor can find the right path within one screen.

---

## Phase 4 — GitHub community foundation

### Work

- enable Discussions;
- create issue forms;
- create PR template;
- create labels;
- create public project board;
- add community health files;
- protect `main`;
- add required checks.

### Why

The project cannot invite participation without clear destinations and boundaries.

### Exit criteria

- questions, bugs, claims, replications, and teaching feedback have distinct paths;
- `main` requires checks;
- community expectations visible.

---

## Phase 5 — English migration of canonical documents

### Priority order

1. `MATH_CLAIMS.md` headings and metadata;
2. highest-load active claim rows;
3. `NEGATIVE_RESULTS.md`;
4. `NEXT_STEP.md` material retained as active guidance;
5. active plans;
6. code comments and UI research prose;
7. remaining active documents.

### Method

Small reviewed batches.

### Why

Claims are the highest-risk language migration.

### Exit criteria

- all active canonical documentation English;
- Finnish remains only in approved translation or historical locations;
- language CI passes.

---

## Phase 6 — Build the education, research, and AI areas

### Work

Create the folder structures and initial core documents.

Minimum education set:

```text
learning path
teacher guide
misconception guide
lesson metadata standard
```

Minimum research set:

```text
research program map
experiment manifest standard
evidence passport standard
```

Minimum AI set:

```text
AI policy
provenance policy
contamination policy
incident log
evaluation standard
```

### Why

The three missions should be visible not only in README prose but in repository structure.

### Exit criteria

Each mission has:

- clear home;
- owner;
- current status;
- contribution path;
- website destination.

---

## Phase 7 — Website information architecture

### Work

Create the new route structure:

```text
Learn
Explore
Research
Evidence
Abelisk
Community
```

Add:

```text
How AI Is Used
Corrections
```

### Why

The current single-level explorer does not sufficiently express audience pathways.

### Exit criteria

- each route has a primary audience;
- no beginner must navigate research modules to learn the basics;
- no researcher must search through tutorials for evidence.

---

## Phase 8 — Evidence-driven site integration

### Work

- export claims and questions;
- create stable IDs;
- render claim cards;
- add contextual GitHub links;
- add current versus archived labels;
- add build revision;
- add correction links;
- remove duplicate handwritten claims.

### Why

This is where GitHub and website become one coherent system.

### Exit criteria

- important website results trace to exact repository evidence;
- website does not maintain independent claim status;
- no runtime GitHub API dependency.

---

## Phase 9 — AI transparency and evaluation publication

### Work

- publish `How AI Is Used`;
- create public AI evaluation summaries;
- create provenance labels;
- create incident log;
- establish holdout rules;
- publish model/run card examples.

### Why

AI is a stated project mission and should be inspectable rather than merely mentioned.

### Exit criteria

A visitor can answer:

```text
what AI does
what AI does not prove
how AI outputs are reviewed
what failures have occurred
how performance is evaluated
```

---

## Phase 10 — Releases and long-term preservation

### Work

- establish release cadence;
- archive research snapshots;
- populate `CITATION.cff` version/date when appropriate;
- connect DOI archiving when mature;
- publish release notes;
- preserve corrections and superseded artifacts.

### Why

A research platform must be citable beyond the current `main` branch.

### Exit criteria

At least one complete release can be reconstructed and cited.

---

# 19. First fifteen implementation issues

1. **Adopt English-first repository policy**
2. **Create repository language migration inventory**
3. **Create `docs/README.md` and mission indexes**
4. **Replace `NEXT_STEP.md` with current focus and handoff structure**
5. **Create plans status index**
6. **Redesign README audience onboarding**
7. **Enable GitHub Discussions**
8. **Add issue forms and PR template**
9. **Create language-check CI**
10. **Translate claims ledger header and first reviewed batch**
11. **Create `docs/education/` foundation**
12. **Create `docs/ai/` foundation**
13. **Create research experiment manifest standard**
14. **Create website–GitHub link specification**
15. **Publish `How AI Is Used` transparency page**

---

# 20. Ninety-day implementation sequence

## Weeks 1–2

- approve policy;
- inventory language;
- create indexes;
- create current-focus structure;
- define labels and issue forms.

## Weeks 3–4

- README redesign;
- Discussions;
- community files;
- language CI;
- first claims translation batch.

## Weeks 5–6

- education foundation;
- AI foundation;
- research artifact standard;
- plan metadata and status migration.

## Weeks 7–9

- website route architecture;
- audience landing pages;
- contextual GitHub links;
- evidence card prototype.

## Weeks 10–12

- claims export prototype;
- `How AI Is Used`;
- correction log;
- first release candidate;
- user test with one learner, one teacher, one researcher, and one contributor.

At day 90, evaluate:

```text
Did navigation improve?
Did language drift decrease?
Can a claim be traced faster?
Can a beginner find a learning path?
Can a researcher reproduce a result?
Can a contributor find a bounded task?
Can a visitor understand the role of AI?
```

Do not continue architectural work automatically if these outcomes do not improve.

---

# 21. Acceptance criteria

The plan is successfully implemented when:

- [ ] English is canonical across active GitHub documentation and collaboration;
- [ ] non-English repository content is limited to explicit translation resources, quotations, test fixtures, or archived history;
- [ ] translations track their English source revision;
- [ ] README exposes learner, teacher, researcher, verifier, contributor, and AI-methodology paths;
- [ ] education, research, AI, and community have visible repository homes;
- [ ] the website has audience-specific routes;
- [ ] the website and repository use the same stable claim IDs;
- [ ] exact results link to immutable evidence;
- [ ] current guidance links to living documents;
- [ ] GitHub Discussions and structured issue forms exist;
- [ ] every active plan has status, owner, and review date;
- [ ] `CURRENT_FOCUS.md` is short and current;
- [ ] browser computations are clearly labeled;
- [ ] AI provenance and incident reporting exist;
- [ ] a public correction mechanism exists;
- [ ] one release is archived with version, commit, manifest, and checksums;
- [ ] old public links have a migration path;
- [ ] accessibility and privacy requirements are documented;
- [ ] the project can be understood without reading the full repository;
- [ ] the project can be verified without trusting the public website alone.

---

# 22. Final principles

## Principle 1

> **English is the canonical collaboration language; multilingual delivery belongs in explicit translation resources.**

## Principle 2

> **The website helps people understand and experience the project. GitHub helps people inspect, reproduce, correct, and extend it.**

## Principle 3

> **Pedagogy is primarily experienced on the website but versioned in the repository.**

## Principle 4

> **Research is primarily governed in the repository but summarized clearly on the website.**

## Principle 5

> **AI is a transparent research instrument, never an independent source of truth.**

## Principle 6

> **Every audience should have a direct doorway and a clear next action.**

## Principle 7

> **Every important website statement should trace back to a stable evidence identity.**

## Principle 8

> **The project should invite participation without lowering its evidentiary standards.**

## Principle 9

> **A correction is part of the scientific record, not an embarrassment to hide.**

## Principle 10

> **The architecture should remain smaller than the research mission it serves.**

---

# 23. Desired end state

A curious visitor sees:

```text
a beautiful, understandable problem
```

A learner sees:

```text
a path from examples to genuine mathematical thinking
```

A teacher sees:

```text
ready, reviewable, accessible materials
```

A researcher sees:

```text
exact claims, sources, limits, and artifacts
```

A verifier sees:

```text
a reproducible packet with no hidden assumptions
```

A contributor sees:

```text
a bounded task and a clear review process
```

An AI researcher sees:

```text
provenance, evaluation, incidents, and contamination controls
```

An AI agent sees:

```text
concise instructions, current priorities, stable schemas, and stop conditions
```

A future maintainer sees:

```text
why the project is organized this way and how to continue it safely
```

That is the practical meaning of one evidence core serving discovery, teaching, and trustworthy AI-assisted research.
