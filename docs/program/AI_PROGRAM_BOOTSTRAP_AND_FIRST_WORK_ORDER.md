# AI Program Bootstrap and First Work Order

## How to turn a large collection of plans into one controlled implementation program

**Suggested repository path:**  
`docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md`

**Status:** active bootstrap instruction  
**Primary language:** English  
**Project:** `combinatorics-on-words-research`  
**Intended readers:** project owner, Claude Code, other coding agents, critical reviewers, and future maintainers  
**Immediate objective:** classify and synthesize the existing plans without renaming them and without changing product code  
**First implementation direction:** repository control and safety before website reconstruction  
**Core rule:** one approved task at a time

---

# 0. Read this first

The project currently has many large and valuable planning documents.

They are not a single task list.

They contain:

- strategic visions;
- implementation roadmaps;
- product specifications;
- research programs;
- software audits;
- governance proposals;
- educational designs;
- historical iterations;
- superseded recommendations;
- technical reference material.

Do not interpret the presence of a plan as authorization to implement it.

Do not attempt to implement all plans.

Do not choose project priorities autonomously.

Do not rename or move the imported planning files during bootstrap.

The first job is to build a reliable control layer above the plans.

```text
PLANS
  many possible directions

PROGRAM
  approved ordering and dependencies

CURRENT FOCUS
  one active objective

TASK
  one bounded implementation unit
```

The project owner retains authority over:

- priorities;
- canonical mathematical claims;
- accepted architecture;
- merges;
- releases;
- public research status.

---

# 1. Immediate answer: where should the work begin?

Begin with the **repository control plane**, not with the visual website and not with a new research algorithm.

The correct order is:

```text
1. Preserve and inventory the plans.
2. Establish repository control, safety, and current-task files.
3. Freeze and test the current website behavior.
4. Extract and test the shared mathematical core.
5. Connect claims and content to the evidence core.
6. Build the modular website shell.
7. Migrate Abelisk and the Mäkelä tutorial.
8. Migrate evidence and research modules.
9. Activate research pipelines as separately approved work.
```

## Why repository control comes first

The repository is the location of:

- project truth;
- version history;
- rollback;
- tests;
- claims;
- evidence;
- plans;
- tasks;
- reviews;
- releases.

If website refactoring begins before plan status, CI, task boundaries, and evidence rules are established, the project may create a visually improved site on top of unstable governance and duplicated scientific prose.

## Why the website is not first

The website refactor depends on:

- a trusted mathematical core;
- a claims export;
- stable route and link policy;
- content classifications;
- browser-computation labels;
- build metadata;
- baseline behavior tests.

## Why a new research route is not first

The project already has active research tools and many proposed research lines.

A new research route should not be selected merely because its plan appears technically exciting.

Research priorities require an explicit owner decision after the program synthesis.

## Important boundary

Starting with the repository does **not** mean spending months on infrastructure.

The repository bootstrap must be small and time-boxed.

It should create enough control to make the next real product or research task safe.

---

# 2. No renaming is required now

The project owner does not need to rename the current plan files.

Use this intake location:

```text
docs/plans/intake/
```

Copy the plan files there unchanged.

Names containing:

```text
(1)
spaces
older version labels
Finnish titles
```

may remain during intake.

The bootstrap agent must identify documents by:

1. file path;
2. first-level Markdown heading;
3. SHA-256 checksum;
4. assigned plan ID in the generated registry.

A later owner-approved cleanup task may propose canonical paths.

No plan may be renamed merely to make the repository look tidy during bootstrap.

Stable links and review matter more than immediate naming perfection.

---

# 3. Authority hierarchy

Before reading the intake plans, read the project’s current authority files.

Recommended order:

```text
README.md
AGENTS.md
CLAUDE.md
EPISTEMIC_DISCIPLINE.md
RESEARCH_CONTEXT.md
MATH_CLAIMS.md
KNOWLEDGE_STATE.md
OPEN_RESEARCH_QUESTIONS.md
NEGATIVE_RESULTS.md
LITERATURE_COVERAGE.md
CONTRIBUTING.md
CURRENT_FOCUS.md, if it already exists
```

## Authority rules

### Plans may propose

- architecture;
- experiments;
- features;
- policies;
- reorganizations;
- new claims pipelines.

### Plans may not override

- the claims ledger;
- current mathematical definitions;
- source status;
- accepted epistemic rules;
- owner decisions;
- more recent explicitly superseding plans.

### Technical guides describe

- a tool;
- a version;
- a workflow;
- known behavior.

A technical guide is not automatically a mandate to prioritize that tool.

---

# 4. Intake document set

The current uploaded intake consists of the following files.

| Current filename | Initial role | SHA-256 prefix | Lines |
|---|---|---:|---:|
| `ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM(1).md` | Abelisk foundation / historical design input | `8c18bf96ad5fb4fa…` | 2018 |
| `ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN(1).md` | Superseded Abelisk refinement | `57be8be237a80361…` | 1612 |
| `ABELISK_V3_LOGIC_PUZZLE_BRAND_AND_WEB_IMPLEMENTATION_PLAN(1).md` | Newest Abelisk product and implementation candidate | `2f4f2464908bbd58…` | 1903 |
| `CONJECTURE_RESEARCH_PIPELINE(1).md` | Research knowledge-promotion pipeline | `27b57cbc68cdfbf6…` | 1384 |
| `CUT_AND_CERTIFY_RESEARCH_PLAN.md` | Exploratory research line | `b46e776f84397bde…` | 1926 |
| `DICTIONARY_BACKTRACKER_RESEARCH_PLAN(1).md` | Search-engine audit and research roadmap | `a20707dbbc4755d9…` | 1642 |
| `JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md` | Audited software guide and technical reference | `c240e31f98d428d8…` | 1849 |
| `MAKELA_CONJECTURE_INTERACTIVE_TUTORIAL_DESIGN(1).md` | Primary pedagogical tutorial design | `3327ae0afe51efa1…` | 2304 |
| `OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN(1).md` | Participation and evidence governance | `b6741ef33f58c31e…` | 2181 |
| `OPEN_RESEARCH_EDUCATION_AI_PLATFORM_PLAN.md` | Three-mission platform strategy | `913372ac82593d8f…` | 1745 |
| `RECORD_HUNTING_RESEARCH_PIPELINE(1).md` | Record and research-harvest pipeline | `854c47592c966cc0…` | 1567 |
| `RECORDS_SECTION_SPEC(1).md` | Legacy Finnish website specification for record presentation | `41e18d426eaf5575…` | 153 |
| `REPOSITORY_WEBSITE_AUDIENCE_LANGUAGE_AND_AI_IMPLEMENTATION_PLAN(1).md` | Repository–website and audience integration | `616715299c24caf9…` | 2782 |
| `RESEARCH_FRONTIER_COMMUNITY_FORWARD_MOTION_CHARTER_V1 (1).md` | Long-term research and community operating charter | `7d4283e8a43776af…` | 2158 |
| `SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN(1).md` | Web architecture and repository refactor roadmap | `92c56d8f30c54c4d…` | 2444 |

The full SHA-256 values are recorded in Appendix A.

---

# 5. Initial classification

This classification is provisional.

The bootstrap agent must verify it from the documents and repository context.

## 5.1 Platform, architecture, governance, and program documents

Read first:

```text
SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN(1).md
REPOSITORY_WEBSITE_AUDIENCE_LANGUAGE_AND_AI_IMPLEMENTATION_PLAN(1).md
OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN(1).md
OPEN_RESEARCH_EDUCATION_AI_PLATFORM_PLAN.md
RESEARCH_FRONTIER_COMMUNITY_FORWARD_MOTION_CHARTER_V1 (1).md
```

These define:

- repository–website responsibility;
- audience pathways;
- governance;
- architecture;
- AI transparency;
- community participation;
- long-term research operation.

They should be synthesized before product or research implementation begins.

## 5.2 Pedagogy and product documents

Read second:

```text
ABELISK_V3_LOGIC_PUZZLE_BRAND_AND_WEB_IMPLEMENTATION_PLAN(1).md
MAKELA_CONJECTURE_INTERACTIVE_TUTORIAL_DESIGN(1).md
RECORDS_SECTION_SPEC(1).md
```

Then read for historical context:

```text
ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN(1).md
ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM(1).md
```

The v3 Abelisk document explicitly supersedes v2.

Therefore:

```text
ABELISK v3
  newest implementation candidate

ABELISK v2
  superseded design input

ABELISK foundation document
  idea archive and mechanic source
```

Do not merge all mechanics from older plans back into v3 automatically.

The refined product deliberately removed some excess complexity.

## 5.3 Research pipeline and software documents

Read third:

```text
CONJECTURE_RESEARCH_PIPELINE(1).md
RECORD_HUNTING_RESEARCH_PIPELINE(1).md
DICTIONARY_BACKTRACKER_RESEARCH_PLAN(1).md
CUT_AND_CERTIFY_RESEARCH_PLAN.md
JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md
```

These cover different levels:

```text
Conjecture pipeline
  knowledge promotion and challenge

Record pipeline
  finite artifact management and research harvest

Dictionary plan
  specific engine audit and development

Cut-and-Certify
  exploratory research program

Java guide
  audited software reference
```

Do not treat all five as simultaneous implementation epics.

---

# 6. Process the documents one at a time

For each document, create one plan card before moving to the next.

Use this template:

```yaml
plan_id: PLAN-XXX
source_file: exact current path
source_sha256: ...
title: ...
document_type:
  - strategy
  - governance
  - architecture
  - implementation
  - research-program
  - product-specification
  - pedagogical-design
  - software-guide
status_in_source: ...
proposed_program_status: ...
authority_level: ...
missions:
  - research
  - education
  - ai
  - community
  - infrastructure
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: []
candidate_tasks: []
do_not_implement_directly: []
summary: ...
```

## For each plan, answer

1. What problem does the document solve?
2. What does it explicitly recommend?
3. What does it explicitly forbid or postpone?
4. Is it strategic, operational, technical, or historical?
5. Does it supersede another document?
6. Does another document supersede it?
7. Which recommendations are owner decisions?
8. Which recommendations can become bounded tasks?
9. Which recommendations conflict with current repository authority?
10. What would be the smallest useful implementation step?
11. What evidence would show that step succeeded?
12. What should not be implemented yet?

## Do not

- modify source code after reading one plan;
- create a feature because it appears in several plans;
- infer approval from enthusiastic wording;
- translate Finnish canonical claims automatically;
- merge similar plans by deleting their distinctions;
- mark a plan implemented because one subsection exists.

---

# 7. Reading waves and checkpoints

The bootstrap agent should work in four read-only waves.

---

## Wave 0 — Repository authority

Read the canonical repository documents.

Output:

```text
docs/program/AUTHORITY_MAP.md
```

The map should state:

- which files define truth;
- which files define current work;
- which files are derived;
- which files are plans;
- which files are historical;
- which conflicts require owner review.

Stop after producing the map.

Do not edit code.

---

## Wave 1 — Governance and architecture

Read the five platform and governance plans one by one.

Output:

```text
docs/program/WAVE_1_GOVERNANCE_AND_ARCHITECTURE_SYNTHESIS.md
```

Identify:

- common recommendations;
- conflicting architecture choices;
- irreversible decisions;
- Git and rights risks;
- minimum repository bootstrap;
- decisions requiring the owner.

Stop and request owner review.

---

## Wave 2 — Pedagogy and product

Read:

- Abelisk v3;
- Mäkelä tutorial;
- record-section specification;
- Abelisk v2;
- original Abelisk design.

Output:

```text
docs/program/WAVE_2_PEDAGOGY_AND_PRODUCT_SYNTHESIS.md
```

Identify:

- active product direction;
- superseded features;
- reusable mechanics;
- mathematical prerequisites;
- shared technical dependencies;
- first testable learner experience.

Stop and request owner review.

---

## Wave 3 — Research pipelines and software

Read the research and software documents one by one.

Output:

```text
docs/program/WAVE_3_RESEARCH_AND_SOFTWARE_SYNTHESIS.md
```

Identify:

- exact versus heuristic work;
- tool correctness dependencies;
- overlapping pipelines;
- research routes that are ready;
- routes requiring audits;
- routes that are exploratory only;
- artifact and verification requirements.

Stop and request owner review.

---

## Wave 4 — Program synthesis

Only after Waves 0–3 are complete, produce:

```text
docs/program/PLAN_INVENTORY.md
docs/program/PLAN_REGISTRY.yaml
docs/program/DEPENDENCY_AND_CONFLICT_MAP.md
docs/program/OWNER_DECISIONS_REQUIRED.md
docs/program/PROGRAM_MAP.md
ROADMAP.md
CURRENT_FOCUS.md
docs/tasks/TASK-0001.md
```

No product code may be changed during Waves 0–4.

---

# 8. Required synthesis outputs

## 8.1 `PLAN_INVENTORY.md`

Human-readable table:

```text
ID
title
source file
type
source status
proposed status
mission
dependencies
supersession
owner decision
next review
```

## 8.2 `PLAN_REGISTRY.yaml`

Machine-readable plan control.

Example:

```yaml
schema_version: 1

plans:
  - id: PLAN-WEB-001
    source_file: docs/plans/intake/SUSTAINABLE_....md
    status: PROPOSED
    priority: UNDECIDED
    missions:
      - infrastructure
      - education
      - research
    depends_on: []
    supersedes: []
    implementation_progress: 0
```

Allowed statuses:

```text
PROPOSED
ACCEPTED
ACTIVE
PAUSED
PARTIALLY_IMPLEMENTED
IMPLEMENTED
SUPERSEDED
REJECTED
REFERENCE
HISTORICAL
```

## 8.3 `DEPENDENCY_AND_CONFLICT_MAP.md`

Must distinguish:

```text
hard dependency
recommended ordering
conceptual overlap
direct contradiction
supersession
independent workstream
```

## 8.4 `OWNER_DECISIONS_REQUIRED.md`

Only decisions that cannot safely be delegated.

Each decision:

```text
decision ID
question
why it matters
options
reversible or irreversible
recommended default
cost of postponing
```

## 8.5 `CURRENT_FOCUS.md`

Maximum recommended length:

```text
one to two pages
```

It must identify:

- one active epic;
- one active task;
- why now;
- explicit do-not-start list;
- stop condition.

## 8.6 `TASK-0001.md`

The first executable task.

It must contain:

- authority;
- purpose;
- allowed files;
- protected files;
- acceptance criteria;
- required tests;
- rollback plan;
- stop conditions;
- required review.

---

# 9. Recommended first program decision

Adopt this initial direction unless the project owner explicitly chooses otherwise:

# **Start with repository control and safety.**

Do not begin with:

```text
full website redesign
Master Abelisk
new record campaign
Cut-and-Certify implementation
dictionary graph expansion
large language migration
public participation campaign
```

## First 30-day objective

Create a repository state in which:

- plans have statuses;
- only one task is active;
- existing tests run in CI;
- prohibited artifacts are guarded;
- browser outputs cannot self-certify;
- current website behavior has a baseline;
- the next mathematical-core task is precisely defined.

---

# 10. Recommended task sequence

This is a recommendation, not pre-authorized work.

---

## TASK-0001 — Establish the program control layer

### Purpose

Make the plans manageable without renaming or implementing them.

### Allowed work

Create:

```text
docs/program/
docs/tasks/
docs/plans/README.md
PLAN_REGISTRY.yaml
CURRENT_FOCUS.md
TASK-0001.md
task template
decision template
```

### Do not

- refactor application code;
- rename intake plans;
- translate claims;
- modify mathematical status;
- rewrite Git history;
- redesign the website.

### Completion

The owner can see:

- what each plan is;
- what is active;
- what is superseded;
- what decision is next.

---

## TASK-0002 — Establish repository safety and baseline CI

### Purpose

Protect future work.

### Candidate work

- inspect existing test commands;
- add CI for existing tests;
- add claims-drift check;
- add artifact denylist;
- add pull-request template;
- record build and environment assumptions;
- document branch protection;
- remove self-certifying browser language only if separately approved.

### Important boundary

Do not rewrite Git history as an automated side effect.

History audit and history rewriting are separate owner-controlled work.

---

## TASK-0003 — Freeze the legacy website baseline

### Purpose

Make future refactoring comparable.

### Candidate work

- preserve legacy entry point;
- create screenshots;
- record nineteen modules;
- add smoke tests;
- record key outputs and checksums;
- list known misleading prose;
- map old links.

### Do not

Redesign the page during the baseline task.

---

## TASK-0004 — Extract the trusted Abelian mathematical core

### Purpose

Create a shared, pure, independently tested foundation.

### Candidate outputs

```text
reference verifier
incremental append verifier
changed-index verifier
Parikh functions
violation witness type
differential tests
```

First legacy consumers:

```text
Word Builder
Three-Letter Search Tree
Abelisk
```

---

## TASK-0005 — Establish the claims and content export

### Purpose

Prevent scientific prose drift.

Candidate outputs:

```text
claims export
schemas
claim component
content-type labels
browser-computation labels
```

---

## TASK-0006 — Build the modular website shell

Only after Tasks 0001–0005 are accepted.

Routes:

```text
Home
Learn
Explore
Research
Evidence
Abelisk
Community
```

---

## TASK-0007 — Migrate the first pedagogical experience

Recommended first visible experience:

```text
Mäkelä tutorial or Abelisk Story
```

The final choice belongs to the owner after dependency review.

---

# 11. Parallel research policy

Repository and website foundation work must not silently suspend mathematical research.

Maintain a small explicit research lane:

```text
one current research question
one bounded research task
one artifact or negative result
```

However:

- only one software implementation task should be active per workstream;
- no plan may become active merely because the architecture work pauses;
- research and infrastructure work should have separate acceptance criteria.

Recommended allocation during bootstrap:

```text
60% repository safety and shared foundations
30% current mathematical research
10% documentation and review
```

Adjust after the first month.

---

# 12. AI role separation

## Project owner

Owns:

- priority;
- plan status;
- claim status;
- merge;
- release;
- public interpretation.

## Claude Opus

Use for:

- plan synthesis;
- dependency analysis;
- architecture;
- owner-decision framing;
- difficult review.

Initial mode:

```text
read-only or Plan Mode
```

Opus must not implement during bootstrap.

## Claude Sonnet

Use for:

- bounded approved tasks;
- tests;
- file migrations;
- implementation under an allowlist.

Sonnet receives:

```text
AGENTS.md
CURRENT_FOCUS.md
one TASK file
only referenced plans
```

Do not load every plan into each implementation session.

## Gemini Pro

Use for:

- independent dissent review;
- hidden assumptions;
- missing rollback;
- test weakness;
- excessive infrastructure;
- scope creep;
- scientific wording risks.

Gemini should not rewrite the implementation automatically during first review.

## CI and verifiers

Use for deterministic requirements.

No model may overrule failing tests or missing evidence.

---

# 13. First Claude Code session

Run Opus in planning mode.

Example:

```bash
claude --model opus --permission-mode plan
```

Use this prompt:

```text
Act as the program bootstrap architect.

Read:
1. repository authority files listed in
   docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md;
2. the intake plan files in the exact reading order defined there.

Do not rename or move the intake documents.
Do not edit product or research code.
Do not change claim wording or claim status.
Do not infer that a plan is accepted because it is detailed.
Treat filenames as opaque; identify documents by heading and checksum.

Process one document at a time.
For every document, create a structured plan card.

Complete Wave 0 and Wave 1 only.

Produce:
- docs/program/AUTHORITY_MAP.md
- docs/program/WAVE_1_GOVERNANCE_AND_ARCHITECTURE_SYNTHESIS.md
- a draft plan registry containing only the documents reviewed so far
- a short list of owner decisions

Stop after Wave 1.
Do not begin implementation.
```

The stop after Wave 1 is intentional.

It lets the owner check whether the agent has understood the project before the remaining documents are synthesized.

---

# 14. Gemini dissent review prompt

After Opus completes a wave:

```text
Act as an independent critical reviewer.

Read:
- the original source plans for this wave;
- the authority map;
- the synthesis produced by Opus.

Do not implement anything.
Do not optimize the prose.

Identify:
- omitted constraints;
- false equivalences between plans;
- supersession errors;
- hidden irreversible decisions;
- recommendations that displace research without clear benefit;
- claims of readiness unsupported by the source documents;
- owner decisions incorrectly delegated to AI;
- missing rollback or evidence requirements.

Produce a dissent memo ordered by severity.
```

---

# 15. Implementation-session prompt

After the owner accepts `TASK-0001.md`, start a new Sonnet session.

```text
Read:
- AGENTS.md
- CLAUDE.md
- CURRENT_FOCUS.md
- docs/tasks/TASK-0001.md
- only the plans explicitly referenced by TASK-0001

Before editing:
1. restate the task scope;
2. list files expected to change;
3. list required tests;
4. identify stop conditions.

Implement only TASK-0001.

Do not:
- rename intake plans;
- begin adjacent tasks;
- change canonical claims;
- change website behavior unless the task explicitly authorizes it;
- mark the task complete when an acceptance criterion fails.

At completion:
- list changed files;
- report exact test commands and outcomes;
- report unresolved risks;
- produce a handoff for independent review.
```

---

# 16. Branch and worktree policy

Never perform the bootstrap directly on an unprotected `main`.

Recommended branch:

```text
chore/program-bootstrap
```

Recommended sequence:

```text
clean working tree
→ backup or tagged starting point
→ bootstrap branch
→ read-only synthesis
→ owner review
→ bounded pull request
```

For later implementation:

```text
one task
one branch
one pull request
```

Example:

```text
chore/task-0001-program-control
chore/task-0002-ci-baseline
refactor/task-0004-abelian-core
feat/task-0007-makela-tutorial
```

Do not allow two agents to edit the same files in parallel.

---

# 17. Protected files during bootstrap

Unless the active task explicitly authorizes them, treat these as protected:

```text
MATH_CLAIMS.md
OPEN_RESEARCH_QUESTIONS.md
KNOWLEDGE_STATE.md
NEGATIVE_RESULTS.md
EPISTEMIC_DISCIPLINE.md
research/**
src/**
scripts/**
tests/**
current public website application files
```

The bootstrap phase produces program-control documents only.

---

# 18. Language handling

Some intake plans are in Finnish.

Do not translate them during plan synthesis.

The bootstrap agent should:

- summarize them in English;
- preserve calibrated terminology;
- record that they require later reviewed migration;
- never use automatic bulk translation to change canonical claims.

Language migration is a separate task after plan control and claim authority are clear.

---

# 19. Plan supersession rules

A newer plan does not automatically replace an older one unless:

- it explicitly states supersession;
- the owner approves supersession;
- the plan registry records it.

Known initial case:

```text
ABELISK v3
  explicitly supersedes Abelisk v2
```

The original Abelisk design remains useful as a design archive.

Superseded does not mean deleted.

It means:

```text
not active implementation authority
```

---

# 20. Completion and review rules

No AI may declare a task complete based only on:

- code existing;
- files being created;
- prose sounding finished;
- tests written by the same agent;
- agreement between two language models.

A task is complete when:

- acceptance criteria pass;
- tests pass;
- protected boundaries were respected;
- independent review is complete where required;
- the owner accepts the result;
- task and plan statuses are updated.

---

# 21. Stop conditions

The bootstrap agent must stop and ask for owner review when:

- plans contradict one another on an architectural dependency;
- a plan conflicts with canonical research authority;
- a proposed action changes claim status;
- a plan requests Git-history rewriting;
- rights-sensitive files are discovered;
- a current implementation appears inconsistent with the plan assumptions;
- choosing between research and infrastructure priorities is required;
- a plan requires a new framework or service;
- a task cannot fit one bounded pull request;
- an acceptance criterion cannot be objectively tested.

Stopping is correct behavior.

---

# 22. Avoid these failure modes

## Failure: plan avalanche

```text
read fifteen plans
→ create twenty simultaneous epics
```

Correction:

```text
one registry
→ one current focus
→ one task
```

## Failure: architecture as progress theatre

Creating folders and diagrams without improving:

- safety;
- evidence;
- testability;
- learning;
- research output.

Correction:

Every architecture task must name a measurable benefit.

## Failure: older plan resurrection

Reintroducing features deliberately removed by a newer refinement.

Correction:

Respect supersession and product restraint.

## Failure: AI priority capture

The model implements what it finds most interesting.

Correction:

Only the owner activates a task.

## Failure: implementation in the synthesis session

Long context causes plan ideas to leak into code.

Correction:

Use a new implementation session.

## Failure: website-first redesign

Visual work proceeds before claims and mathematical core are stabilized.

Correction:

Repository control and core extraction precede redesign.

## Failure: Git cleanup without recovery planning

History is rewritten automatically.

Correction:

History rewriting is a separate owner-authorized operation.

---

# 23. What the owner needs to do manually

Only three immediate actions are required.

## Action 1

Copy the current planning files unchanged into:

```text
docs/plans/intake/
```

## Action 2

Add this file at:

```text
docs/program/AI_PROGRAM_BOOTSTRAP_AND_FIRST_WORK_ORDER.md
```

## Action 3

Start the first Opus planning session with the prompt in Section 13.

No renaming is required.

No website decision is required yet.

No research plan needs to be discarded.

---

# 24. First human checkpoint

After Wave 1, the owner should answer only:

1. Is the authority map correct?
2. Did the AI distinguish proposed plans from canonical rules?
3. Is repository safety correctly placed before website redesign?
4. Which architecture decisions must remain open?
5. May the agent continue to Wave 2?

This should take far less effort than manually reorganizing all plan files.

---

# 25. Recommended first milestone

The first milestone is not a redesigned website.

It is:

# **Controlled Program Bootstrap v0.1**

It is achieved when:

- all plans are preserved unchanged;
- all plans have provisional IDs and statuses;
- supersession is visible;
- dependencies are visible;
- owner decisions are isolated;
- one current task exists;
- no code has changed accidentally;
- the next task is small enough to review.

---

# 26. Recommended second milestone

# **Repository Safety Baseline v0.1**

It is achieved when:

- existing tests run in CI;
- claims drift is checked;
- prohibited artifacts are guarded;
- branch and PR policy exist;
- browser self-certification is removed or quarantined;
- Git-history risks are documented;
- build identity can be recorded.

---

# 27. Recommended third milestone

# **Trusted Shared Core v0.1**

It is achieved when:

- the reference Abelian verifier is pure;
- incremental checks agree with it;
- hole-filling checks are correct;
- exhaustive short tests pass;
- three existing interfaces use the same trusted core.

Only after this milestone should major website migration begin.

---

# 28. Why this order is sustainable

This sequence avoids two extremes.

## Extreme A

```text
Keep adding features to the current monolith forever.
```

## Extreme B

```text
Stop all research and rewrite everything.
```

The proposed sequence instead creates:

```text
control
→ safety
→ baselines
→ shared mathematics
→ evidence integration
→ visible product migration
```

Each step has independent value.

Each step is reversible.

Each step can be reviewed.

---

# 29. Final instruction to every AI agent

> Read the active task, not the entire future.

> Treat plans as proposals until the registry and owner say otherwise.

> Preserve evidence boundaries.

> Prefer one independently testable object over a broad unfinished transformation.

> Stop when the task requires a decision that belongs to the project owner.

---

# Appendix A — Full intake checksums

## `ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM(1).md`

```text
Title: ABELISK — Game Design, Discovery, and Insight System
SHA-256: 8c18bf96ad5fb4fa13c8ea57121beab445bdefe24b5b3d364ce7bccf9699a070
Lines: 2018
Initial role: Abelisk foundation / historical design input
```

## `ABELISK_V2_REFINED_GAME_AND_WEB_IMPLEMENTATION_PLAN(1).md`

```text
Title: ABELISK v2 — Refined Game, Terminology, and Web Implementation Plan
SHA-256: 57be8be237a80361a52597fce29f7254ee9a26ba22bef9517a9eaaf22113a4a2
Lines: 1612
Initial role: Superseded Abelisk refinement
```

## `ABELISK_V3_LOGIC_PUZZLE_BRAND_AND_WEB_IMPLEMENTATION_PLAN(1).md`

```text
Title: ABELISK v3 — Logic Puzzle, Brand, and Web Implementation Plan
SHA-256: 2f4f2464908bbd5890caf496270289eb361dda9c99f368c94e0f2bdf82011214
Lines: 1903
Initial role: Newest Abelisk product and implementation candidate
```

## `CONJECTURE_RESEARCH_PIPELINE(1).md`

```text
Title: Conjecture Research Pipeline
SHA-256: 27b57cbc68cdfbf65eb54a72bdfa23fe324c7854e97c6f63aad26048913cde18
Lines: 1384
Initial role: Research knowledge-promotion pipeline
```

## `CUT_AND_CERTIFY_RESEARCH_PLAN.md`

```text
Title: Cut-and-Certify Research Plan for Abelian-Square Avoidance
SHA-256: b46e776f84397bdee900287cfa2e72dcde2178e87f8217c96cf603a98c4e8a22
Lines: 1926
Initial role: Exploratory research line
```

## `DICTIONARY_BACKTRACKER_RESEARCH_PLAN(1).md`

```text
Title: Dictionary-Accelerated Backtracking Research and Development Plan
SHA-256: a20707dbbc4755d9453afe5a3e874dbe371ade92a8eb15c2e688f606381de474
Lines: 1642
Initial role: Search-engine audit and research roadmap
```

## `JAVA_COW_BACKTRACKER_V1_2_USER_GUIDE.md`

```text
Title: Java COW Backtracker v1.2 — Complete User and Research Guide
SHA-256: c240e31f98d428d850b134bcbdd246cec874b7c6674467da585253642974bcce
Lines: 1849
Initial role: Audited software guide and technical reference
```

## `MAKELA_CONJECTURE_INTERACTIVE_TUTORIAL_DESIGN(1).md`

```text
Title: Mäkelä’s Conjecture Interactive Tutorial — Pedagogical Design Plan
SHA-256: 3327ae0afe51efa1bfbcf7f6b5d934d485e4f3a147cb39f9fb15a80396a3bf6a
Lines: 2304
Initial role: Primary pedagogical tutorial design
```

## `OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN(1).md`

```text
Title: Open Participation and Evidence Governance Plan
SHA-256: b6741ef33f58c31e5c44a39c58869e191271881efa9758bd51a919720791c6d1
Lines: 2181
Initial role: Participation and evidence governance
```

## `OPEN_RESEARCH_EDUCATION_AI_PLATFORM_PLAN.md`

```text
Title: Open Research, Education, and AI Platform Plan
SHA-256: 913372ac82593d8fa121ae9ccbed51709d153bfa520f2d9cf7227c514a1c8912
Lines: 1745
Initial role: Three-mission platform strategy
```

## `RECORD_HUNTING_RESEARCH_PIPELINE(1).md`

```text
Title: Record Hunting and Research Harvest Pipeline
SHA-256: 854c47592c966cc02b8f74d3af75bc83fb5733d6c83405961df6592f29ea5492
Lines: 1567
Initial role: Record and research-harvest pipeline
```

## `RECORDS_SECTION_SPEC(1).md`

```text
Title: Spec: Kokeellinen ennätyshaku -osio nettisivulle
SHA-256: 41e18d426eaf557555acb3cc598acc0894a63b3817b3028ec734121aad54940d
Lines: 153
Initial role: Legacy Finnish website specification for record presentation
```

## `REPOSITORY_WEBSITE_AUDIENCE_LANGUAGE_AND_AI_IMPLEMENTATION_PLAN(1).md`

```text
Title: Repository–Website Integration, Audience, Language, and AI Implementation Plan
SHA-256: 616715299c24caf98fb997e7dd5737a5420b0318862dbde076214fde9ce81397
Lines: 2782
Initial role: Repository–website and audience integration
```

## `RESEARCH_FRONTIER_COMMUNITY_FORWARD_MOTION_CHARTER_V1 (1).md`

```text
Title: Research Frontier, Community Growth, and Forward-Motion Charter
SHA-256: 7d4283e8a43776afb505e7aea616d590c2df92a87ede711cc26aba371f185efa
Lines: 2158
Initial role: Long-term research and community operating charter
```

## `SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN(1).md`

```text
Title: Sustainable Web Architecture, Refactor, Naming, and GitHub Integration Plan
SHA-256: 92c56d8f30c54c4d29bdc1c01ac1bd0a097a23fedc68b1feab2dd51253f4eeb7
Lines: 2444
Initial role: Web architecture and repository refactor roadmap
```

# Appendix B — Minimal plan-card template

```yaml
plan_id: PLAN-XXX
source_file: ...
source_sha256: ...
title: ...
document_type: ...
status_in_source: ...
proposed_program_status: PROPOSED
authority_level: proposal
missions: []
depends_on: []
conflicts_with: []
supersedes: []
superseded_by: []
owner_decisions_required: []
candidate_tasks: []
do_not_implement_directly: []
summary: ...
```

# Appendix C — Minimal task template

```markdown
# TASK-XXXX — Title

## Authority

Approved by the project owner on YYYY-MM-DD.

## Goal

One precise outcome.

## Why now

Dependency or risk addressed.

## Allowed files

- ...

## Protected files

- ...

## Deliverables

- ...

## Acceptance criteria

- [ ] ...

## Required tests

```bash
...
```

## Rollback

How to undo safely.

## Stop conditions

Stop and report when:

- ...

## Required review

- automated checks
- AI dissent review
- human approval
```
