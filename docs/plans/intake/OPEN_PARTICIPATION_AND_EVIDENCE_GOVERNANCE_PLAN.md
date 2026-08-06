# Open Participation and Evidence Governance Plan

## How anyone may contribute without turning openness into unreviewed project truth

**Suggested repository path:**  
`docs/governance/OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN.md`

**Status:** proposed governance and implementation plan  
**Date:** 2026-08-06  
**Project:** `combinatorics-on-words-research`  
**Primary language:** English  
**Primary objective:** make participation genuinely open while keeping canonical research claims, software, educational material, and releases carefully reviewed  
**Recommended initial model:** small curated open research lab  
**Core principle:** open contribution, curated acceptance

---

# 0. Executive summary

The project should adopt two principles at the same time:

> **Anyone may propose, question, test, correct, reproduce, teach, translate, or improve.**

and:

> **No contribution becomes canonical project knowledge automatically.**

This distinction is the foundation of a trustworthy open research community.

The recommended structure has three layers:

```text
OPEN DISCUSSION
  questions, ideas, speculation, teaching experiences

REVIEWABLE SUBMISSIONS
  pull requests, claim challenges, replication reports,
  source corrections, candidate results, translations

CANONICAL EVIDENCE CORE
  accepted claims, reviewed lessons, verified software,
  archived experiments, corrections, releases
```

The project should initially remain curator-led.

The maintainer should approve:

- changes to canonical claims;
- research-status changes;
- official records;
- archived releases;
- scientific website statements;
- AI governance;
- major architecture decisions.

However, not every contribution should require the same depth of review, and not every community interaction should wait for the maintainer.

Automation, triage roles, area reviewers, and clear review classes should prevent the maintainer from becoming the permanent bottleneck.

The key governance statement is:

> **A contribution may be valuable before it is accepted, and rejection does not erase its value.**

---

# 1. Why this governance model is needed

Open participation creates real opportunities:

- more source checking;
- independent implementations;
- bug discovery;
- teaching feedback;
- translation;
- accessibility improvement;
- new hypotheses;
- counterexamples;
- external replication;
- community learning.

It also creates risks:

- unsupported claims;
- duplicated errors;
- copyright violations;
- self-certified computations;
- AI-generated material presented as independent;
- enormous unreviewable submissions;
- personal data;
- unclear authorship;
- hostile discussion;
- maintainer overload;
- silent changes to project truth.

A trustworthy project cannot solve these risks merely by asking people to “be careful.”

It needs a visible governance system.

---

# 2. What “open” should mean

The project should define openness precisely.

## 2.1 Open participation

Anyone may:

- ask a question;
- report a possible error;
- propose an idea;
- submit a possible counterexample;
- share a reproduction;
- suggest a source;
- improve an explanation;
- contribute code;
- improve accessibility;
- propose a translation;
- review a lesson;
- submit a puzzle;
- challenge an accepted claim.

## 2.2 Open visibility

The project should make visible:

- contribution status;
- review requirements;
- reasons for acceptance or rejection;
- known limitations;
- corrections;
- superseded results;
- contributor credit;
- conflicts of interest when relevant.

## 2.3 Open evidence

Accepted results should expose:

- exact statement;
- source or computation;
- scope;
- code version;
- manifests;
- checksums;
- verification status;
- limitations.

## 2.4 What openness does not mean

Openness does not mean:

- direct write access to `main`;
- automatic publication;
- automatic claim acceptance;
- storage of every uploaded file;
- equal authority for every assertion;
- guaranteed maintainer response time;
- anonymous alteration of canonical history;
- permission to redistribute third-party material.

---

# 3. The three-layer participation model

---

## 3.1 Layer A — Open discussion

Purpose:

- questions;
- early ideas;
- exploratory hypotheses;
- teaching experiences;
- conceptual confusion;
- possible research directions;
- requests for collaboration.

Primary home:

```text
GitHub Discussions
```

Recommended categories:

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

Required label:

```text
COMMUNITY DISCUSSION
Not a project claim
```

Discussion content may be useful without being correct.

No maintainer approval is required before ordinary discussion appears.

Moderation rules still apply.

---

## 3.2 Layer B — Reviewable submissions

Purpose:

- specific changes;
- evidence packages;
- corrections;
- candidate results;
- reproducible proposals.

Primary homes:

```text
GitHub Issues
Pull Requests
structured submission forms
```

Typical statuses:

```text
SUBMITTED
TRIAGED
UNDER REVIEW
NEEDS EVIDENCE
NEEDS CHANGES
NEEDS INDEPENDENT CHECK
ACCEPTED
REJECTED
SUPERSEDED
WITHDRAWN
```

A submission is not canonical merely because it is public.

---

## 3.3 Layer C — Canonical evidence core

Contains:

- accepted claim rows;
- reviewed source records;
- verified code;
- approved lesson material;
- approved translations;
- accepted correction records;
- archived research artifacts;
- releases;
- evidence passports.

Canonical content requires a documented acceptance path.

---

# 4. Contribution entry points

The website and repository should not use one generic `Contribute` button for every purpose.

Use intent-specific entry points.

---

## 4.1 Ask a question

Button:

```text
Ask the community
```

Destination:

```text
GitHub Discussion / Questions
```

Appropriate for:

- terminology;
- mathematical background;
- using tools;
- understanding a result;
- beginner questions.

---

## 4.2 Discuss a research idea

Button:

```text
Discuss a research idea
```

Destination:

```text
GitHub Discussion / Research Ideas
```

Appropriate for:

- speculative construction;
- possible invariant;
- possible heuristic;
- related paper;
- new experiment.

Required notice:

> Ideas are welcome, but discussion is not evidence of correctness.

---

## 4.3 Report a website or software problem

Button:

```text
Report a problem
```

Destination:

```text
Issue form: bug
```

Request:

- page or module;
- expected behavior;
- observed behavior;
- exact input;
- browser or environment;
- screenshot when useful;
- whether the issue affects mathematics or only presentation.

---

## 4.4 Challenge a claim

Button:

```text
Challenge this claim
```

Destination:

```text
Issue form: claim challenge
```

Request:

- claim ID;
- exact disputed wording;
- reason;
- source, proof, computation, or counterexample;
- whether the problem concerns:
  - mathematical truth;
  - scope;
  - source;
  - implementation;
  - website wording.

---

## 4.5 Submit a counterexample candidate

Button:

```text
Submit a possible counterexample
```

Destination:

```text
Issue form: counterexample candidate
```

Request:

- target claim or conjecture;
- exact object;
- machine-readable format;
- checker used;
- checker version;
- independent verification status;
- checksum;
- derivation or generation method.

Initial label:

```text
UNVERIFIED CANDIDATE
```

---

## 4.6 Submit a replication result

Button:

```text
Submit a replication
```

Destination:

```text
Issue form: replication
```

Request:

- target claim or artifact ID;
- independent codebase;
- language;
- environment;
- exact commands;
- input checksums;
- result;
- agreement or discrepancy;
- output artifact;
- whether any original project code was reused.

---

## 4.7 Submit a computation

Button:

```text
Submit a computation report
```

Destination:

```text
Issue form: computation report
```

Request:

```text
question ID
run ID
code commit
configuration
seed
start and stop conditions
runtime
hardware
raw output
checksum
verification status
known limitations
```

Generated browser reports must begin:

```text
BROWSER REPORT — UNREVIEWED
```

---

## 4.8 Improve code or documentation

Button:

```text
Open a Pull Request
```

Path:

```text
fork
branch
changes
tests
pull request
review
merge
```

Direct pushes to `main` should not be available to ordinary contributors.

---

## 4.9 Improve teaching material

Button:

```text
Improve this lesson
```

Destination:

```text
Issue form or pull request
```

Request:

- lesson ID;
- audience;
- observed difficulty;
- proposed change;
- teaching context;
- whether the change affects mathematical claims.

---

## 4.10 Submit teaching feedback

Button:

```text
Share teaching feedback
```

Destination:

```text
Issue form: teaching feedback
```

Do not request:

- student names;
- student email addresses;
- identifiable assessment records;
- sensitive health information.

---

## 4.11 Improve a translation

Button:

```text
Improve this translation
```

Destination:

```text
Pull Request or translation issue
```

Request:

- content key;
- English source revision;
- target language;
- proposed translation;
- scientific terminology notes;
- reviewer.

A translation must not silently alter mathematical scope.

---

## 4.12 Submit an Abelisk puzzle

Button:

```text
Submit a puzzle
```

Destination:

```text
Issue form or structured pull request
```

Required:

- puzzle ID proposal;
- rule;
- initial state;
- solution;
- solution count;
- logical trace;
- intended insight;
- accessibility labels;
- authorship and license statement.

---

# 5. What requires maintainer approval

At the beginning, the project maintainer should remain the final approver for canonical changes.

## 5.1 Always requires maintainer approval

- changes to `MATH_CLAIMS.md`;
- changing claim status;
- changing an open question to resolved;
- official records;
- official independent-verification status;
- website scientific statements;
- research snapshots;
- releases;
- correction notices;
- AI governance policy;
- major architecture decisions;
- new maintainers;
- rights-sensitive files;
- removal or rewriting of Git history.

## 5.2 May use delegated review later

- lesson wording;
- accessibility improvements;
- translations;
- puzzle curation;
- routine software maintenance;
- community moderation;
- source metadata.

## 5.3 Does not require canonical approval

- ordinary Discussion posts;
- questions;
- personal hypotheses;
- community examples;
- draft proposals.

They remain noncanonical.

---

# 6. Review classes

Not every change should require the same review process.

---

## Class 0 — Community conversation

Examples:

- question;
- early idea;
- teaching anecdote.

Review:

```text
moderation only
```

Canonical effect:

```text
none
```

---

## Class 1 — Low-risk maintenance

Examples:

- typo;
- broken link;
- harmless CSS correction;
- non-scientific wording;
- test cleanup.

Review:

- automated checks;
- one maintainer or delegated reviewer.

---

## Class 2 — Educational or interface change

Examples:

- lesson restructuring;
- new animation;
- translation;
- accessibility alternative;
- puzzle content.

Review:

- mathematical check when relevant;
- pedagogical or accessibility review;
- automated tests.

---

## Class 3 — Software or algorithm change

Examples:

- verifier optimization;
- worker protocol;
- search code;
- state migration.

Review:

- tests;
- code review;
- positive and negative controls;
- reference-versus-optimized comparison;
- performance evidence when claimed.

---

## Class 4 — Evidence or claim change

Examples:

- new claim;
- changed claim wording;
- new record;
- correction;
- independent replication status.

Review:

- source or computation review;
- exact scope;
- provenance;
- independent check when required;
- maintainer approval.

---

## Class 5 — Exceptional scientific claim

Examples:

- claimed solution to a major open problem;
- claimed infinite construction;
- claimed impossibility theorem;
- result with publication-level significance.

Review:

- quarantine from normal website claims;
- independent experts;
- independent implementations where computational;
- detailed artifact;
- external mathematical review;
- no rapid promotion.

The repository must never imply that a merge alone constitutes peer review.

---

# 7. Evidence-promotion pipeline

A contribution should move through explicit stages.

```text
IDEA
↓
CANDIDATE
↓
TESTED
↓
REPRODUCED
↓
REVIEWED
↓
ACCEPTED
↓
ARCHIVED
```

## 7.1 IDEA

A possible direction.

No evidence required.

## 7.2 CANDIDATE

Specific enough to test.

Must have:

- exact statement;
- exact object;
- clear expected outcome.

## 7.3 TESTED

One documented test exists.

Must state:

- method;
- scope;
- stopping condition;
- result.

## 7.4 REPRODUCED

A second run or implementation agrees.

Must state whether it is genuinely independent.

## 7.5 REVIEWED

A human has reviewed:

- scope;
- evidence;
- interpretation;
- wording.

## 7.6 ACCEPTED

The project treats the result as canonical within the declared scope.

Acceptance is reversible.

## 7.7 ARCHIVED

The result belongs to a versioned release or research snapshot.

---

# 8. Negative and correction paths

Not all submissions become accepted claims.

---

## 8.1 Rejected candidate

```text
IDEA
↓
TESTED
↓
COUNTEREXAMPLE
↓
REJECTED
↓
NEGATIVE RESULTS & RESEARCH LESSONS
```

Preserve when informative.

---

## 8.2 Accepted claim later challenged

```text
ACCEPTED
↓
CHALLENGED
↓
UNDER RE-REVIEW
↓
CORRECTED
```

or:

```text
ACCEPTED
↓
SUPERSEDED
```

Do not delete the previous state silently.

---

## 8.3 Decision record

Every important rejection or correction should record:

- decision;
- reason;
- evidence considered;
- affected claim IDs;
- date;
- reviewer;
- whether reconsideration is possible.

---

# 9. Maintainer decisions and fairness

Maintainer authority should be visible, reasoned, and limited by process.

## 9.1 Maintainer responsibilities

- protect canonical accuracy;
- explain important decisions;
- avoid conflicts of interest;
- give credit;
- preserve useful negative results;
- correct mistakes;
- avoid using review power to claim contributor ideas.

## 9.2 Decision language

Avoid:

```text
Rejected because I do not like it.
```

Prefer:

```text
Rejected for current inclusion because the result lacks an independent
checker and the stopping condition is not recorded.
```

## 9.3 Appeal and reconsideration

A contributor may request reconsideration when:

- new evidence exists;
- a factual misunderstanding occurred;
- a policy was applied inconsistently;
- a conflict of interest exists.

Reconsideration does not guarantee acceptance.

## 9.4 Conflict of interest

A reviewer should disclose when:

- they authored the original claim;
- they are competing for publication priority;
- they have a personal or professional conflict;
- they cannot assess the mathematics independently.

For major claims, seek external review when possible.

---

# 10. Preventing maintainer bottlenecks

The project should not scale by making the maintainer review every minor action personally.

## 10.1 Automation handles

- tests;
- formatting;
- schemas;
- language checks;
- broken links;
- claim references;
- checksums;
- puzzle validity;
- large-file policy;
- prohibited paths;
- accessibility smoke checks.

## 10.2 Community triage may handle

- duplicate issues;
- missing information;
- category labels;
- directing questions;
- obvious support requests;
- closing abandoned drafts after notice.

## 10.3 Area reviewers may later handle

```text
education
translations
accessibility
software
puzzles
community moderation
```

## 10.4 Maintainer retains

```text
claims
records
releases
research status
governance
maintainer appointments
```

## 10.5 No response-time promise initially

Do not promise fixed review times before review capacity exists.

Show:

```text
Review capacity is limited.
High-impact evidence and security issues are prioritized.
```

---

# 11. Roles and permissions

---

## 11.1 Visitor

May:

- read;
- play;
- download public artifacts.

No GitHub account required.

---

## 11.2 Participant

May:

- open Discussion;
- submit Issue;
- comment;
- provide feedback.

---

## 11.3 Contributor

Has at least one accepted contribution.

No special repository permission required.

---

## 11.4 Trusted triager

May:

- label;
- request missing information;
- manage duplicates;
- organize Discussions.

Cannot:

- merge;
- change claims;
- publish releases.

---

## 11.5 Area reviewer

Reviews one bounded area.

Examples:

```text
education reviewer
translation reviewer
accessibility reviewer
software reviewer
puzzle reviewer
```

---

## 11.6 Maintainer

May:

- merge approved changes;
- manage repository settings;
- release;
- enforce policy.

---

## 11.7 Evidence maintainer

A future specialist role.

May approve evidence and claim changes according to policy.

Should require:

- demonstrated epistemic discipline;
- relevant project experience;
- explicit appointment.

---

# 12. Path to maintainership

Do not grant maintainership based only on volume of commits.

Consider:

- quality;
- reliability;
- respectful review;
- evidence discipline;
- ability to admit uncertainty;
- understanding of project boundaries;
- care with credit and corrections;
- sustained participation.

Suggested path:

```text
Contributor
↓
Trusted triager or area reviewer
↓
Maintainer candidate
↓
Limited maintainer permissions
↓
Full maintainer
```

Appointments should be public and reversible.

---

# 13. AI-generated participation

AI may assist with:

- code drafts;
- test candidates;
- issue summaries;
- literature candidates;
- hypothesis generation;
- translation drafts;
- accessibility audits;
- counterexample search.

AI-assisted submissions must disclose:

```text
AI used
model or tool when known
what it produced
what the human checked
what remains unchecked
```

## 13.1 AI may not self-certify

An AI-generated checker is not independent merely because it was generated in another session.

Independence requires analysis of:

- code lineage;
- algorithmic independence;
- shared test data;
- shared assumptions;
- model exposure to project answers.

## 13.2 AI provenance labels

```text
AI_DRAFT
AI_ASSISTED
HUMAN_REVIEWED
SOURCE_VERIFIED
INDEPENDENTLY_COMPUTED
```

## 13.3 AI submissions receive the same standards

AI involvement neither disqualifies nor validates a contribution.

---

# 14. File and artifact submissions

Allowing public contribution does not mean accepting arbitrary files into the repository.

## 14.1 Do not accept directly

- copyrighted papers;
- unknown-license datasets;
- executable binaries;
- personal data;
- giant raw logs;
- secret keys;
- suspicious archives;
- unverifiable record files;
- third-party model outputs with unclear terms.

## 14.2 Initial submission form

Ask for:

- metadata;
- checksum;
- source;
- license;
- external artifact location;
- purpose;
- size;
- expected retention;
- privacy statement.

## 14.3 Acceptance classes

```text
REPOSITORY-SAFE
  source, metadata, small project-owned artifacts

RELEASE-ONLY
  large but accepted reproducibility packages

CHECKSUM-ONLY
  cannot be redistributed

PRIVATE-REVIEW
  temporarily restricted for review

REJECTED
  unsafe, unlawful, irrelevant, or unsupported
```

## 14.4 Malware and secret checks

Automated checks should detect:

- secrets;
- executable files;
- prohibited file types;
- unexpectedly large files;
- known copyrighted artifacts;
- archive bombs where practical.

---

# 15. Intellectual property and licensing

Every contribution should be submitted under the repository’s contribution and licensing terms.

The project should define:

- code license;
- documentation license;
- data license;
- puzzle-content license;
- translation license;
- citation expectations;
- third-party exceptions.

## 15.1 Contributor declaration

Pull requests should include:

> I have the right to submit this material and agree that it may be distributed under the applicable project license.

## 15.2 Authorship and priority

For research-relevant contributions, record:

- contributor;
- date;
- exact contribution;
- later modifications;
- publication or authorship discussion when relevant.

A Git commit alone may not fully capture scholarly contribution.

## 15.3 Contributor License Agreement

Do not introduce a CLA automatically.

A Developer Certificate of Origin or explicit PR declaration may be sufficient for the current project.

Reassess if:

- institutional partnerships;
- commercial licensing;
- complex relicensing;
- large contributor base;

make it necessary.

---

# 16. Credit and recognition

Credit should include more than code.

Recognize:

- source verification;
- bug reports;
- counterexamples;
- independent replication;
- negative results;
- teaching review;
- accessibility work;
- translation;
- puzzle design;
- moderation;
- documentation;
- software.

## 16.1 Contribution ledger

Recommended:

```text
CONTRIBUTORS.md
```

or machine-readable:

```text
contributors.json
```

Fields:

```text
name or chosen identifier
contribution type
artifact or issue IDs
date
preferred credit form
ORCID optional
```

## 16.2 Privacy

Allow contributors to choose:

- full name;
- GitHub username;
- pseudonym;
- no public listing.

---

# 17. Moderation and conduct

Open research discussion can become intimidating or hostile without boundaries.

## 17.1 Moderate behavior, not viewpoints

Allowed:

- criticism;
- strong disagreement;
- counterexamples;
- source challenges;
- methodological critique.

Not allowed:

- harassment;
- personal attacks;
- intimidation;
- plagiarism;
- spam;
- deliberate falsification;
- doxxing;
- discriminatory abuse.

## 17.2 Research criticism format

Encourage:

```text
claim
evidence
scope
proposed correction
```

Discourage:

```text
author judgment
motive speculation
status competition
```

## 17.3 Moderation record

For serious actions, record:

- action;
- reason;
- date;
- moderator;
- appeal path.

Sensitive details need not be public.

---

# 18. Minors, schools, and privacy

The project may attract students and school use.

## 18.1 Do not collect unnecessary personal information

Avoid:

- student names;
- school IDs;
- exact locations;
- identifiable classroom results;
- health data;
- private messages from minors.

## 18.2 Public contribution

Young contributors should avoid publishing personal details.

Teacher-guided submissions may use:

- class alias;
- aggregate results;
- teacher contact.

## 18.3 Formal educational research

If the project studies learning outcomes formally, use a separate ethics and consent protocol.

Ordinary game analytics must not be silently repurposed as educational research data.

---

# 19. Security reports

Security issues should not begin as public Discussions.

Create:

```text
SECURITY.md
```

Use private security reporting when available.

Examples:

- cross-site scripting;
- malicious downloadable content;
- dependency vulnerability;
- secret exposure;
- repository permission issue.

Do not use the ordinary public bug form for active security vulnerabilities.

---

# 20. Submission quality gates

A submission should be complete enough to review.

## 20.1 Minimal claim challenge

Requires:

- claim ID;
- disputed text;
- reason;
- evidence or precise logical argument.

## 20.2 Minimal computation

Requires:

- exact configuration;
- stopping condition;
- code version;
- output;
- checksum.

## 20.3 Minimal code pull request

Requires:

- issue or purpose;
- tests;
- scope;
- user-visible change;
- claim impact.

## 20.4 Minimal lesson change

Requires:

- target audience;
- learning goal;
- proposed benefit;
- mathematical effect;
- accessibility effect.

Incomplete submissions may remain open briefly under:

```text
NEEDS INFORMATION
```

They are not required to remain open indefinitely.

---

# 21. GitHub implementation

---

## 21.1 Discussions

Enable:

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

Pin:

```text
How participation works
Discussion is not a project claim
Code of Conduct
```

---

## 21.2 Issue forms

Create:

```text
.github/ISSUE_TEMPLATE/
  bug.yml
  claim-challenge.yml
  counterexample-candidate.yml
  computation-report.yml
  replication-result.yml
  source-correction.yml
  teaching-feedback.yml
  accessibility.yml
  translation.yml
  puzzle-submission.yml
  config.yml
```

---

## 21.3 Pull request template

Checklist:

```text
purpose
related issue
tests run
claims affected
content language
AI assistance disclosed
third-party material disclosed
accessibility checked
screenshots for UI
generated files updated
```

---

## 21.4 Labels

Area:

```text
area:research
area:evidence
area:education
area:abelisk
area:ai
area:web
area:community
```

Type:

```text
type:bug
type:idea
type:claim-challenge
type:counterexample
type:replication
type:source
type:translation
type:accessibility
type:puzzle
```

Status:

```text
status:submitted
status:triaged
status:under-review
status:needs-evidence
status:needs-changes
status:needs-independent-check
status:accepted
status:rejected
status:paused
```

Review:

```text
review:mathematical
review:software
review:pedagogical
review:translation
review:accessibility
review:rights
```

---

## 21.5 Project board

Start with one public board:

```text
Inbox
Needs information
Ready
In progress
Under review
Needs verification
Accepted
Closed
Paused
```

Do not build a custom marketplace application initially.

---

# 22. Research Commons versus Marketplace

`Research Marketplace` is not recommended as the initial public name.

Risks:

- sounds commercial;
- suggests competition;
- implies task exchange;
- may overstate community size;
- may create maintenance expectations.

Recommended initial names:

```text
Ways to Contribute
Open Contribution Tasks
Research Commons
Contribution Lab
```

Best progression:

```text
Phase 1:
Ways to Contribute

Phase 2:
Open Contribution Tasks

Phase 3:
Research Commons
```

Use `Research Commons` only when there is real recurring activity.

---

# 23. Minimum viable governance

Do not implement the entire governance system at once.

Initial version:

```text
Discussions
Issue forms
Pull requests
maintainer approval
required CI
claim review
release snapshots
```

Minimum documents:

```text
OPEN_PARTICIPATION_AND_EVIDENCE_GOVERNANCE_PLAN.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
SUPPORT.md
CREDIT_AND_AUTHORSHIP_POLICY.md
AI_RESEARCH_POLICY.md
```

Minimum canonical rule:

> Anyone may submit. Only reviewed and merged material becomes canonical.

---

# 24. Phased implementation

---

## Phase 0 — Decide scope

Choose:

```text
small curated open research lab
```

for the initial period.

Do not promise a large crowdsourced platform.

### Exit criteria

- public wording accepted;
- maintainer authority documented;
- canonical evidence sources named.

---

## Phase 1 — Publish governance

Create:

```text
docs/governance/
```

Add:

- this plan;
- credit policy;
- decision and appeal policy;
- maintainer roles;
- privacy guidance.

Update:

```text
README.md
CONTRIBUTING.md
```

### Exit criteria

A visitor can understand:

- what they may submit;
- what becomes canonical;
- who decides;
- how decisions can be challenged.

---

## Phase 2 — Open discussion safely

Enable Discussions.

Create categories and pinned guidance.

Do not yet advertise broadly.

Observe moderation load.

### Exit criteria

- questions and ideas have correct destinations;
- moderation process works;
- no confusion between discussion and accepted claim.

---

## Phase 3 — Create structured submissions

Add issue forms.

Add labels.

Add project board.

### Exit criteria

- bugs, claims, replications, teaching feedback, and translations are separated;
- required metadata is collected.

---

## Phase 4 — Protect canonical changes

Add:

- branch protection;
- required CI;
- PR review;
- CODEOWNERS;
- claim-change checklist;
- artifact policy.

### Exit criteria

No external contributor can alter `main` without review.

---

## Phase 5 — Establish evidence promotion

Implement statuses:

```text
CANDIDATE
TESTED
REPRODUCED
REVIEWED
ACCEPTED
ARCHIVED
```

Create evidence passport template.

### Exit criteria

A candidate result cannot jump directly to accepted website claim.

---

## Phase 6 — Delegate low-risk work

After reliable contributors emerge:

- appoint triagers;
- appoint area reviewers;
- document permissions;
- review appointments regularly.

### Exit criteria

Routine work no longer requires maintainer attention.

---

## Phase 7 — Evaluate community growth

After six months, assess:

- number of useful contributions;
- review burden;
- moderation burden;
- contributor retention;
- evidence quality;
- effect on research time;
- need for additional maintainers.

Do not expand simply because tooling exists.

---

# 25. Additional issues that are easy to overlook

## 25.1 Contributor consent to public archival

Issues and Discussions are public and persistent.

Submission guidance should warn contributors not to include sensitive or confidential material.

## 25.2 Right to withdraw

A contributor may withdraw an unmerged submission.

Accepted open-source contributions generally remain in project history under the applicable license.

Explain this before submission.

## 25.3 Embargoed research

Some collaborators may need temporary confidentiality for:

- thesis work;
- journal submission;
- institutional collaboration;
- benchmark holdouts.

The public repository should not pretend to support secure embargo workflows unless an actual private process exists.

## 25.4 Publication authorship

A contribution to the repository does not automatically imply co-authorship on a paper.

Create a separate authorship policy based on scholarly contribution.

## 25.5 Priority disputes

Time-stamped Discussions and Issues help establish project history, but they are not a complete legal or scholarly priority system.

Use respectful documentation and external publication when appropriate.

## 25.6 Forked research

A rejected contribution may be pursued independently.

The project should not imply ownership over ideas merely because they were discussed publicly.

## 25.7 Community claims outside the project

Contributors may publish their own claims elsewhere.

The project should distinguish:

```text
community-associated work
project-accepted work
```

## 25.8 Dependency on GitHub

GitHub is the current collaboration platform, not the sole archival strategy.

Important releases should also have:

- downloadable archives;
- checksums;
- external preservation when mature.

## 25.9 Abandoned submissions

Define a policy:

- request missing information;
- wait a reasonable period;
- close as incomplete;
- allow reopening with new evidence.

Do not leave every submission indefinitely active.

## 25.10 Review fatigue

Repeated low-quality AI-generated submissions can overwhelm maintainers.

Possible controls:

- require human accountability;
- rate-limit repetitive submissions;
- close templated noise;
- require evidence fields;
- prohibit autonomous mass issue creation.

## 25.11 Community capture

A small active subgroup should not redefine project priorities merely by volume.

Roadmap authority and mission should remain explicit.

## 25.12 Scientific disagreement

Not every disagreement can be resolved by project maintainers.

For unresolved expert disagreement:

```text
DISPUTED
```

may be more honest than forced acceptance or rejection.

## 25.13 Review of the reviewers

Important reviews should be attributable.

Reviewer decisions can also be challenged and corrected.

## 25.14 Sunset policy

Governance processes that create cost without improving quality should be simplified or removed.

---

# 26. First implementation tasks

1. Create `docs/governance/`.
2. Add this governance plan.
3. Write `CREDIT_AND_AUTHORSHIP_POLICY.md`.
4. Update `CONTRIBUTING.md`.
5. Add a short participation summary to README.
6. Enable GitHub Discussions.
7. Create initial issue forms.
8. Add pull-request template.
9. Add branch protection and required CI.
10. Add claim-change review checklist.
11. Add AI-assistance disclosure.
12. Add artifact and rights declaration.
13. Create one public project board.
14. Add website contribution links.
15. Pilot the process with three bounded contributions.

---

# 27. Pilot before broad promotion

Test the system with:

```text
one software contribution
one teaching contribution
one replication or claim challenge
```

Measure:

- Was the correct channel obvious?
- Did the form collect enough information?
- Was review reasonable?
- Did status remain clear?
- Was credit assigned correctly?
- Did the maintainer workload remain acceptable?

Revise before inviting broad participation.

---

# 28. Acceptance criteria

The governance system is ready when:

- [ ] anyone can find an appropriate contribution path;
- [ ] discussion is visibly noncanonical;
- [ ] external contributors cannot push directly to `main`;
- [ ] claim changes require explicit review;
- [ ] replication and counterexample forms collect reproducible metadata;
- [ ] browser reports are labeled unreviewed;
- [ ] AI assistance requires disclosure;
- [ ] third-party rights are declared;
- [ ] students are not asked for identifiable data;
- [ ] maintainers provide reasons for important decisions;
- [ ] accepted decisions remain correctable;
- [ ] contributors receive credit beyond commit count;
- [ ] security issues have a private path;
- [ ] moderation and appeal policies exist;
- [ ] low-risk work can later be delegated;
- [ ] the project does not promise review capacity it lacks;
- [ ] the public site distinguishes community work from project-accepted work;
- [ ] at least one contribution has completed the full evidence-promotion path.

---

# 29. Final principles

## Principle 1

> **Anyone may propose. No one may self-promote a proposal into project truth.**

## Principle 2

> **Discussion, submission, review, acceptance, and archival are different states.**

## Principle 3

> **Canonical changes require review, but review effort should match risk.**

## Principle 4

> **Rejection should be reasoned, and informative failure should be preserved.**

## Principle 5

> **Acceptance is reversible when better evidence appears.**

## Principle 6

> **AI participation requires provenance and receives no automatic authority.**

## Principle 7

> **Independent verification must be genuinely independent in code, assumptions, and evidence path.**

## Principle 8

> **Credit belongs to correction, verification, teaching, and maintenance—not only novelty.**

## Principle 9

> **The maintainer protects the evidence core but should not personally perform every routine task forever.**

## Principle 10

> **The project should grow only as fast as it can review honestly.**

---

# 30. Recommended public wording

## Short version

> Anyone may participate in this project by asking questions, reporting problems, proposing ideas, improving code or teaching material, challenging claims, or independently reproducing results. Contributions do not automatically become accepted project knowledge. Canonical claims, software, lessons, and research artifacts are reviewed before they are merged or published.

## Extended version

> This is an open but curated research project. Discussion is open, evidence is welcome, and corrections are encouraged. The project distinguishes community proposals from reviewed project claims. Every important result should show its status, scope, provenance, and verification level. Maintainer approval records the project’s current judgment; it is not an irreversible declaration of truth.

---

# 31. Desired end state

A visitor can contribute without learning Git.

A developer can submit tested code.

A teacher can improve a lesson without exposing student data.

A researcher can challenge a claim without changing project files.

A verifier can submit an independent result with exact metadata.

An AI-assisted contributor can disclose provenance honestly.

A maintainer can protect canonical knowledge without reviewing every discussion post.

A rejected idea can remain useful.

An accepted claim can still be corrected.

That is the form of openness this project should aim for.
