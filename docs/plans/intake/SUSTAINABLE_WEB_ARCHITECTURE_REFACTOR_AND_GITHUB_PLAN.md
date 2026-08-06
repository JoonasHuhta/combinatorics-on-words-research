# Sustainable Web Architecture, Refactor, Naming, and GitHub Integration Plan

## A staged migration from a successful research prototype to a durable open research platform

**Suggested repository path:**  
`docs/plans/SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN.md`

**Status:** implementation roadmap and architecture policy  
**Date:** 2026-08-06  
**Project:** `combinatorics-on-words-research`  
**Primary objective:** make the website and repository maintainable, testable, link-stable, accessible, and scalable without interrupting mathematical research  
**Migration strategy:** strangler refactor; no big-bang rewrite  
**Recommended architecture:** static modular monolith, built and tested in CI, deployed to GitHub Pages

---

# 0. Executive recommendation

The current website should be treated as a successful research prototype.

It has demonstrated:

- mathematical visualizations;
- teaching experiments;
- research sandboxes;
- browser workers;
- evidence and validation views;
- Abelisk;
- negative-results storytelling;
- direct links into the repository.

It should not be treated as the permanent application architecture.

The next stage is:

```text
one large HTML application
        ↓
versioned content + pure mathematical core
        ↓
modular route-based website
        ↓
independently testable features
        ↓
stable public research platform
```

The project should use a **modular monolith**, not microservices and not a network of separate applications.

Recommended shape:

```text
Website
├── shared application shell
├── shared mathematical core
├── shared claims and evidence registry
├── independently loaded feature modules
└── static routes deployed together
```

The website and GitHub should have different but connected roles:

```text
Website
  explains, teaches, visualizes, and guides

GitHub
  preserves evidence, code, history, discussion, review, and contribution
```

The most important architectural rule is:

> **Research truth must not live inside handwritten interface prose, and interface state must not live in one global script.**

---

# 1. Current-state diagnosis

The uploaded website currently presents nineteen modes in one flat tab bar:

```text
What is an Abelian square?
Tree Search
ABC Laboratory
Morphism g85
2D Walk
Sonification
Try It Yourself
Historical Timeline
Unfavorable Factors
Morphism Microscope
Concept Graph
Morphism Lab
Heat Map
Abelisk Puzzle
AA2FR Extension Lab
Applications & Impact
Validation Lab
Art & Math Gallery
Seam Search & Verification
The Graveyard
```

The page also contains:

- a large shared stylesheet;
- feature-specific styles embedded in the same document;
- inline style attributes;
- inline event handlers;
- globally available functions;
- shared global state;
- embedded instructional content;
- embedded research claims;
- embedded worker behavior;
- direct GitHub issue generation;
- several browser computations.

The repository itself already has a stronger conceptual structure:

```text
src/
scripts/
tests/
docs/
research/
MATH_CLAIMS.md
NEGATIVE_RESULTS.md
OPEN_RESEARCH_QUESTIONS.md
CONTRIBUTING.md
CITATION.cff
```

The main architectural mismatch is therefore:

> The repository has begun separating responsibilities, but the website still combines nearly every responsibility in one runtime and one document.

---

# 2. Constraints that should guide the refactor

## 2.1 Preserve research momentum

The project must not stop mathematical work for a long rewrite.

Architecture work should have:

```text
one active refactor stream
one bounded deliverable at a time
a working public site after every merge
```

The project’s own handoff notes warn against infrastructure work with decreasing marginal value.

Therefore this plan deliberately avoids:

- rebuilding every feature at once;
- introducing a server;
- introducing microservices;
- converting every research script into a package immediately;
- creating elaborate abstractions before real interfaces are known.

## 2.2 Preserve epistemic discipline

The refactor must strengthen:

- claim traceability;
- bounded wording;
- negative-results retention;
- independent verification;
- browser-versus-authoritative computation labels;
- reproducible artifacts.

## 2.3 Preserve old links

Existing public URLs, bookmarks, citations, and search-engine results should not be broken without redirects or compatibility pages.

## 2.4 Preserve a low operating burden

The target remains:

- static hosting;
- no mandatory database;
- no custom backend;
- inexpensive deployment;
- open local development;
- archived releases.

---

# 3. Target information architecture

Replace the nineteen-item flat navigation with seven public destinations.

```text
Home
Learn
Explore
Research
Evidence
Abelisk
Community
```

A small `About` entry may live in the footer or Community area rather than competing in the primary navigation.

---

# 4. Proposed route structure

```text
/
  project overview and audience pathways

/learn/
  beginner and teacher-facing explanations

/explore/
  interactive visualizations and safe browser experiments

/research/
  current research questions, methods, and bounded results

/evidence/
  claims, verification, replication, records, and provenance

/abelisk/
  the standalone learning and logic game

/community/
  contribution paths, discussions, events, credit, and citation
```

Optional deeper routes:

```text
/learn/abelian-squares/
/learn/makela-conjecture/
/learn/history/
/learn/concept-map/
/learn/research-lessons/

/explore/tree-search/
/explore/abc-lab/
/explore/word-builder/
/explore/morphisms/
/explore/parikh-walk/
/explore/sonification/
/explore/gallery/

/research/open-questions/
/research/morphism-lab/
/research/unfavourable-factors/
/research/aa2fr/
/research/additive/
/research/seam-search/
/research/negative-results/

/evidence/claims/
/evidence/records/
/evidence/verification/
/evidence/replication/
/evidence/snapshots/
```

---

# 5. Section naming decisions

Names must serve two purposes:

1. remain memorable to general visitors;
2. avoid implying more mathematical authority than the content supports.

## 5.1 The Graveyard versus Museum of Mistakes

Neither name is fully correct as the authoritative umbrella.

### Problem with `The Graveyard`

It suggests that every entry is permanently dead.

The project’s negative-results archive explicitly distinguishes:

```text
NECESSARY
  logically closed

BOUNDED
  exhausted only within a stated window

CONTEXTUAL
  failed here but may work elsewhere
```

A bounded result is not dead forever.

A contextual method is not a failed method.

### Problem with `Museum of Mistakes`

It suggests that every entry was a mistake.

Many entries are:

- valid negative results;
- useful bounded searches;
- methods that worked in another setting;
- plausible hypotheses that were correctly tested and rejected.

Testing a good hypothesis and rejecting it is not necessarily a mistake.

## 5.2 Recommended naming hierarchy

### Authoritative research umbrella

# **Negative Results & Research Lessons**

Route:

```text
/research/negative-results/
```

Source:

```text
NEGATIVE_RESULTS.md
```

This is precise and inclusive.

### Public educational curation

# **Museum of Mistakes**

Route:

```text
/learn/museum-of-mistakes/
```

Include only cases that genuinely concern:

- incorrect reasoning;
- implementation bugs;
- misleading wording;
- failed source verification;
- overclaiming;
- invalid test data.

### Memorable narrative subcategory

# **The Graveyard**

Use only for entries classified:

```text
NECESSARY
```

These are directions closed by mathematical or logical obstruction.

### Other subcategories

```text
Bounded Frontiers
  exact finite exclusions that could be extended

Transfer Gallery
  methods that work, but not in this setting

Broken Instruments
  software, verification, and process failures

False Intuitions
  plausible ideas refuted by counterexample

Low-Value Routes
  approaches that work but do not pay for their cost
```

This preserves all three good names while assigning each one an honest role.

---

# 6. Recommended names for current sections

| Current name | Recommended public name | Destination | Reason |
|---|---|---|---|
| What is an Abelian square? | Abelian Squares: Start Here | Learn | Clear entry point |
| Tree Search (3 letters) | Three-Letter Search Tree | Explore | Retains exact object |
| ABC Laboratory | Three-Letter Boundary Lab | Explore | Explains why the lab exists |
| Morphism g85 | Keränen’s g85 Morphism | Explore / Learn | Names source and object |
| 2D Walk | Parikh Walk Visualization | Explore | More informative; label as visualization |
| Sonification | Sonification | Explore | Already clear |
| Try It Yourself | Word Builder | Explore | Describes the action |
| Historical Timeline | History of Abelian Avoidance | Learn | Adds subject |
| Unfavorable Factors | Unfavourable Factors | Research | Use the literature term consistently |
| Morphism Microscope | Morphism Microscope | Explore | Strong and descriptive |
| Concept Graph | Concept Map | Learn | More familiar wording |
| Morphism Lab | Morphism Research Lab | Research | Distinguishes it from viewer |
| Heat Map | Constraint Heat Map | Research / Explore | `Heat Map` alone is vague |
| Abelisk Puzzle | Abelisk — Hidden Echoes | Abelisk | Full product identity |
| AA2FR Extension Lab | Restricted Mäkelä Search Lab (AA2FR) | Research | Explains project-specific abbreviation |
| Applications & Impact | Connections & Possible Applications | Learn | Avoids asserting established impact |
| Validation Lab | Evidence & Verification Lab | Evidence | Better reflects project purpose |
| Art & Math Gallery | Art & Mathematical Imagination | Explore | Separates art from evidence |
| Seam Search & Verification | Experimental Seam Search | Research | Current browser module should not imply certification |
| The Graveyard | Negative Results & Research Lessons | Research | Accurate umbrella |

## 6.1 Naming rule

A feature name should identify:

```text
object + activity
```

Examples:

```text
Morphism Research Lab
Constraint Heat Map
Evidence & Verification Lab
Three-Letter Search Tree
```

Avoid names such as:

```text
Gold Lab
Module 18
Heat Map
Research
Experimental Engine
```

without contextual explanation.

---

# 7. A critical immediate correction: browser self-certification

The current page can generate GitHub issue text containing:

- fixed commit hashes;
- language such as `CERTIFIED`;
- claims of independent randomized replication;
- a browser-local compute budget;
- a prefilled discovery report.

This should be disabled or rewritten before expanding public participation.

A browser page must never create a report that upgrades its own output into an authoritative result.

## 7.1 Required replacement

Button text:

```text
Export an unreviewed browser run
```

or:

```text
Report a possible result for review
```

Generated issue title:

```text
[BROWSER REPORT — UNREVIEWED] Candidate from Experimental Seam Search
```

Required fields:

```text
site build commit
module version
rule configuration
input
output
browser
timestamp
run manifest
locally computed checksum
known limitations
```

Required warning:

> This report was generated by a browser experiment. It has not been independently verified and is not yet a project claim.

## 7.2 Commit identity

Never hard-code a commit hash into source text.

The build should inject:

```text
BUILD_COMMIT
BUILD_TIME
SITE_VERSION
CLAIMS_SNAPSHOT
```

The footer and exported run manifest read these values.

---

# 8. GitHub’s role

GitHub should be more visible, but selectively.

The site must not feel like a repository browser to a beginner.

Use a layered approach.

## 8.1 Persistent global presence

Header utility links:

```text
Open project
Current research status
Contribute
```

Footer:

```text
Source code
Claims ledger
Open questions
Negative results
Report a problem
Cite this project
Current build
```

## 8.2 Contextual links

Every research result card should provide:

```text
View claim
View source
View artifact
Reproduce
Challenge this result
```

Every interactive module should provide:

```text
View module source
Report a bug
View mathematical scope
```

Every lesson should provide:

```text
Teacher materials
Edit this page
View evidence behind this lesson
```

## 8.3 Two kinds of GitHub links

### Current-state links

Use `main` for:

- contribution instructions;
- current open questions;
- current claims status;
- living documentation.

### Immutable evidence links

Use an exact commit SHA or release tag for:

- published result artifacts;
- evidence passports;
- archived snapshots;
- cited code;
- reproducibility instructions.

The UI should label these differently:

```text
Current document
Archived version used for this result
```

---

# 9. GitHub community structure

The repository currently exposes code, issues, pull requests, actions, and projects, but has no visible active issue or pull-request activity and no visible Discussions area in the current public navigation.

Enable GitHub Discussions for open conversation.

## 9.1 Use Discussions for

```text
Questions
Ideas
Teaching
Show and tell
Research reading group
Abelisk feedback
Announcements
```

Ideas may later be converted into scoped issues.

## 9.2 Use Issues for

```text
confirmed bugs
specific feature work
claim challenges
replication reports
accessibility problems
source corrections
bounded research challenges
```

## 9.3 Issue forms to create

```text
.github/ISSUE_TEMPLATE/
  bug.yml
  claim-challenge.yml
  replication-result.yml
  research-question.yml
  teaching-feedback.yml
  accessibility.yml
  config.yml
```

### `claim-challenge.yml`

Ask for:

- claim ID;
- exact disputed wording;
- source or counterexample;
- affected page;
- whether the issue concerns mathematics, implementation, or presentation.

### `replication-result.yml`

Ask for:

- claim ID;
- independent implementation;
- environment;
- exact command;
- input checksum;
- output;
- agreement or discrepancy;
- artifact link.

## 9.4 Pull-request template

```text
.github/PULL_REQUEST_TEMPLATE.md
```

Checklist:

- tests run;
- claims affected;
- content labels updated;
- screenshots included when UI changes;
- accessibility checked;
- browser computation scope stated;
- generated files refreshed;
- no papers or external datasets committed.

---

# 10. Community health files

Create or review:

```text
CODE_OF_CONDUCT.md
SECURITY.md
SUPPORT.md
CONTRIBUTING.md
CITATION.cff
LICENSES.md
```

`CITATION.cff` already enables GitHub’s citation interface when present at the repository root.

The website should link directly to:

```text
Cite this project
```

but citation should remain a scholarly courtesy consistent with the chosen license policy.

---

# 11. Urgent Git-history and copyright workstream

The project’s own current handoff documentation reports that:

- record-word files were previously committed and remain in Git history;
- a Keränen PDF remains in history;
- several copyrighted papers were committed publicly.

This is not a normal refactor task.

It is a separate repository-hygiene and rights-review task.

## 11.1 Immediate actions

1. Inventory every externally authored file in:
   - current tree;
   - all branches;
   - tags;
   - Git history.

2. Classify each artifact:
   - project-owned;
   - licensed for redistribution;
   - public-domain;
   - permission unclear;
   - redistribution not permitted.

3. Stop further accidental commits:
   - strengthen `.gitignore`;
   - add a CI denylist for `papers/`, record datasets, and PDFs;
   - reject unexpectedly large files;
   - reject known external filenames or checksums.

4. Decide whether history rewriting is necessary.

5. Before rewriting:
   - make a private administrative backup;
   - document affected paths;
   - notify collaborators;
   - freeze merges;
   - record old-to-new commit mapping where practical.

6. Use the established Git history-cleaning process only after review.

## 11.2 Important warning

Removing a file in a later commit does not remove it from earlier Git history.

History rewriting changes commit IDs and requires coordination with existing clones.

This work should be completed before actively recruiting many contributors.

## 11.3 Dataset policy

Do not use Git LFS for copyrighted or non-redistributable datasets merely to make them easier to store.

Use:

```text
checksum-only metadata
retrieval instructions
author-hosted source
embargoed/private review process
```

when redistribution is not allowed.

---

# 12. Recommended Git workflow

## 12.1 Branch model

Use:

```text
main
short-lived feature branches
release tags
```

Do not introduce a long-lived `develop` branch.

`main` should always be deployable.

Examples:

```text
feat/abelisk-story-shell
refactor/abelian-core
content/negative-results-routing
fix/seam-browser-report
```

## 12.2 Merge policy

Recommended:

- pull request for meaningful changes;
- required CI;
- squash merge;
- short, descriptive commit;
- linked issue when applicable.

Even a solo maintainer benefits from PRs for:

- architectural changes;
- mathematical claim changes;
- Git-history changes;
- release changes.

The PR becomes a review record.

## 12.3 Main-branch protection

Require:

```text
CI / test
CI / claims
CI / build
CI / links
```

Optionally require one approving review when another maintainer exists.

Do not require a merge queue until contribution volume justifies it.

## 12.4 Tags and releases

Use semantic project releases for public snapshots:

```text
v0.1.0
v0.2.0
v1.0.0
```

Research snapshots may also use date tags:

```text
research-snapshot-2026-08
```

Release notes should state:

- new features;
- changed claims;
- corrected errors;
- superseded artifacts;
- migration notes;
- checksums;
- site build commit.

---

# 13. GitHub Pages and link policy

## 13.1 Deployment

Deploy a generated `dist/` directory through GitHub Actions.

Do not edit deployment output manually.

## 13.2 Project-site base path

The build must be tested under:

```text
/combinatorics-on-words-research/
```

Do not assume deployment at domain root.

## 13.3 Stable URLs

A public page URL should not contain implementation names such as:

```text
view-snake
tab-gold-lab
module18
```

Use meaningful slugs:

```text
/abelisk/
/research/seam-search/
/evidence/verification/
```

## 13.4 Old links

Create a migration table:

```text
old tab or anchor
→ new URL
```

Keep a legacy compatibility page during migration.

If direct redirects are unavailable in static hosting, use:

- small redirect HTML files;
- canonical links;
- a route migration map;
- a custom 404 page that suggests the new destination.

## 13.5 Internal-link CI

Check:

- relative links;
- anchors;
- GitHub files;
- claim IDs;
- downloads;
- old-route redirects.

## 13.6 Footer build information

Display quietly:

```text
Site v0.4.0
Build 1e445b6
Claims snapshot 2026-08
```

Each item links to an immutable GitHub revision or release.

---

# 14. Target technical architecture

Recommended initial stack:

```text
Vite
TypeScript in strict mode
Preact
ES-module Web Workers
JSON Schema or Zod
Vitest
Playwright
```

## 14.1 Why Vite

- static production output;
- GitHub Pages compatible;
- route-level code splitting;
- build-time metadata;
- module workers;
- simple local development;
- no server requirement.

## 14.2 Why TypeScript

- catches accidental state and protocol mismatches;
- documents mathematical data structures;
- makes worker messages explicit;
- reduces silent undefined behavior;
- improves AI-assisted code generation and review.

Use TypeScript for all new website code.

Legacy JavaScript may remain behind adapters during migration.

## 14.3 Why Preact

- small runtime;
- React-like component model;
- suitable for interactive panels;
- easier lifecycle cleanup than manual global DOM code;
- supports accessible semantic DOM.

A framework is not required for pure mathematical modules.

## 14.4 Why not microservices

The site:

- is static;
- has no shared remote state requirement;
- has no scaling need for independent servers;
- benefits from one atomic versioned release.

A modular monolith is enough.

---

# 15. Proposed repository structure

```text
web/
  index.html
  vite.config.ts
  tsconfig.json

  src/
    app/
      App.tsx
      router.ts
      build-info.ts
      error-boundary.tsx

    routes/
      home/
      learn/
      explore/
      research/
      evidence/
      abelisk/
      community/

    features/
      tutorial/
      ternary-tree/
      abc-lab/
      word-builder/
      morphism-viewer/
      parikh-walk/
      sonification/
      unfavourable-factors/
      morphism-microscope/
      constraint-heat-map/
      aa2fr-lab/
      seam-search/
      verification-lab/
      negative-results/
      gallery/

    core/
      abelian/
        reference-verifier.ts
        incremental-verifier.ts
        changed-index-verifier.ts
        witness.ts

      additive/
        reference-verifier.ts
        incremental-verifier.ts

      parikh/
        counts.ts
        prefix-counts.ts

      morphisms/
        apply.ts
        registry.ts

    workers/
      protocol.ts
      client.ts
      aa2fr.worker.ts
      seam.worker.ts

    content/
      claims/
      lessons/
      timelines/
      negative-results/
      puzzles/
      glossary/

    components/
      Claim.tsx
      EvidenceBadge.tsx
      WordDisplay.tsx
      ViolationWitness.tsx
      ParikhVector.tsx
      RunManifest.tsx
      BrowserComputationNotice.tsx

    styles/
      tokens.css
      base.css
      components.css

  public/
    404.html
    manifests/
    snapshots/

legacy/
  index-legacy.html
```

The root Node research pipeline should not be moved until a real interface requires it.

---

# 16. Architectural boundaries

## 16.1 Mathematical core

May import:

```text
other core modules
standard library only
```

May not import:

```text
DOM
Preact
CSS
routing
localStorage
analytics
```

## 16.2 Feature modules

May import:

```text
core
shared components
their own content
worker client
```

May not import another feature’s internal files.

## 16.3 Content layer

Contains:

- prose;
- examples;
- claim IDs;
- lesson structure;
- puzzle definitions.

It must not contain executable research authority.

## 16.4 Worker layer

Contains heavy browser computation.

It must not:

- manipulate DOM;
- write project claims;
- silently continue after route unmount;
- call its output proof or certification.

## 16.5 Evidence layer

Reads generated data from authoritative project sources.

It does not infer claim status from display text.

---

# 17. Claims and content pipeline

`MATH_CLAIMS.md` remains authoritative unless the project formally replaces it.

Build process:

```text
MATH_CLAIMS.md
      ↓
claims-export.js
      ↓
schema validation
      ↓
claims.full.json
claims.summary.json
claims.index.json
      ↓
website components
```

## 17.1 Claim component

Example:

```tsx
<Claim id="CLAIM-0003" variant="summary" />
```

It renders:

- approved statement;
- status;
- scope;
- source;
- last review;
- limitations;
- immutable snapshot link.

## 17.2 CI failure conditions

Fail when:

- a scientific statement requiring a claim ID lacks one;
- a rejected claim is shown as active;
- claim data is stale;
- generated JSON differs from committed output;
- a record lacks checksum;
- an open question is shown as resolved;
- analogy is presented as mathematical result.

---

# 18. Browser-computation policy

Every module receives one of these labels:

```text
EDUCATIONAL DEMONSTRATION
EXPLORATORY BROWSER COMPUTATION
ARCHIVED PROJECT RESULT
INDEPENDENT VERIFICATION
```

## 18.1 Educational demonstration

Used for:

- tutorial;
- Abelisk;
- small visual checks.

## 18.2 Exploratory browser computation

Used for:

- search sandboxes;
- heat maps;
- seam experiments;
- local record attempts.

Required notice:

> This result was computed in your browser and is not an authoritative project finding.

## 18.3 Archived project result

Requires:

- run manifest;
- code version;
- input;
- output;
- checksum;
- evidence passport;
- verification status.

## 18.4 Independent verification

Must identify:

- separate implementation or checker;
- exact scope;
- environment;
- agreement or discrepancy.

---

# 19. Feature lifecycle

Every interactive feature must implement:

```ts
interface FeatureLifecycle {
  mount(root: HTMLElement): void;
  unmount(): void;
  reset(): void;
}
```

`unmount()` must:

- terminate workers;
- cancel animation frames;
- clear intervals and timeouts;
- remove external event listeners;
- stop audio;
- flush or save feature state;
- reject late worker messages.

## 19.1 Run identity

Every worker run receives:

```text
runId
featureVersion
buildCommit
configurationHash
```

Late messages from a prior run are ignored.

---

# 20. State policy

## 20.1 App-level state

Only:

```text
current route
language
theme
accessibility preferences
build information
```

## 20.2 Feature state

Owned by the feature:

```text
Abelisk puzzle state
tree search state
audio state
AA2FR run state
```

## 20.3 Storage keys

Version every key:

```text
cow:abelisk:v3:MASTER-085
cow:word-builder:v1
cow:preferences:v1
```

When schema changes:

- migrate;
- or explicitly reset with explanation.

Never interpret old state under a new schema silently.

---

# 21. CSS and design-system migration

Do not rewrite all CSS at once.

## Stage A

Create:

```text
tokens.css
base.css
components.css
```

## Stage B

All new routes use only the design system.

## Stage C

Migrate one old feature at a time.

## Stage D

Remove unused legacy styles after the corresponding feature moves.

## Core tokens

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #172033;
  --color-muted: #64748b;
  --color-accent: #d35400;
  --color-evidence: #2563eb;
  --color-warning: #b45309;
  --color-error: #b91c1c;
  --color-success: #15803d;

  --font-reading: Georgia, serif;
  --font-ui: system-ui, sans-serif;
  --font-code: ui-monospace, monospace;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}
```

---

# 22. Accessibility requirements

Every migrated feature must pass:

- complete keyboard operation;
- visible focus;
- screen-reader naming;
- reduced-motion behavior;
- color-independent meaning;
- 200% zoom;
- mobile layout;
- meaningful heading order;
- text equivalent for canvas output.

Provide plain-text or table alternatives for:

- charts;
- graphs;
- morphism diagrams;
- Parikh comparisons;
- Abelisk animations.

---

# 23. Internationalization

Use stable content keys:

```text
learn.makela.intro
abelisk.echo.hidden
evidence.browserNotice
```

Keep:

- internal IDs;
- claim IDs;
- mathematical notation;
- puzzle IDs;

language-neutral.

New public prose should be written in English and Finnish through content files, not duplicated in rendering logic.

---

# 24. Security and integrity

## 24.1 Replace unsafe HTML assembly

Default to:

- component rendering;
- `textContent`;
- structured DOM;
- sanitized Markdown when necessary.

Audit every remaining `innerHTML` use.

## 24.2 Download generation

Any generated script or data download must contain:

- version;
- source;
- checksum;
- scope;
- warning if experimental.

## 24.3 External links

Use:

```html
rel="noopener noreferrer"
```

where appropriate.

## 24.4 No secrets

The site must require no API keys.

CI should scan for accidentally committed secrets and prohibited external artifacts.

---

# 25. Testing policy

One command:

```bash
npm run check
```

Runs:

```text
TypeScript
lint
format check
unit tests
property tests
claims drift
schema validation
puzzle validation
link validation
production build
```

Separate:

```bash
npm run test:e2e
```

## 25.1 Mathematical tests

- reference versus incremental verifier;
- short exhaustive words;
- positive and negative controls;
- Abelisk hole-filling cases;
- additive cases;
- morphism checksums.

## 25.2 Feature tests

- mount and unmount;
- worker cancellation;
- reset only affects active feature;
- saved-state migration;
- route reload;
- browser Back button;
- current build metadata.

## 25.3 Accessibility tests

- keyboard journey;
- automated accessibility scan;
- reduced motion;
- screen-reader labels;
- zoom;
- no-color mode.

## 25.4 Bundle budgets

Initial budgets should be measured from the first modular build.

Suggested goals:

```text
home route JS < 100 KB compressed
learn route JS < 150 KB compressed
feature modules loaded on demand
large research data never included in initial bundle
```

These are engineering targets, not mathematical claims.

---

# 26. CI and deployment

Create:

```text
.github/workflows/ci.yml
.github/workflows/pages.yml
.github/workflows/link-check.yml
```

## CI jobs

```text
test-core
test-claims
test-content
build-web
test-e2e
accessibility
artifact-policy
```

## Artifact-policy job

Reject:

- `papers/**`;
- prohibited dataset paths;
- unauthorized PDFs;
- known external record files;
- unexpectedly large files;
- generated deployment output committed to source unless explicitly required.

## Pages deployment

Deploy only after required checks pass.

The deployment records:

```text
commit SHA
site version
claims snapshot
build timestamp
```

---

# 27. Architecture Decision Records

Create:

```text
docs/adr/
```

Initial ADRs:

```text
0001-use-a-static-modular-monolith.md
0002-use-vite-typescript-and-preact.md
0003-keep-research-pipeline-separate-from-browser-ui.md
0004-generate-website-claims-from-the-ledger.md
0005-use-route-level-feature-boundaries.md
0006-browser-computation-is-non-authoritative.md
0007-abelisk-is-a-standalone-route.md
0008-use-github-discussions-for-open-conversation.md
0009-preserve-old-public-links.md
0010-negative-results-naming-taxonomy.md
```

Each ADR contains:

```text
context
decision
alternatives
consequences
status
date
```

This is especially important for AI-assisted development.

An AI agent should read the ADRs before proposing architecture changes.

---

# 28. Ordered implementation plan

---

## Phase 0 — Repository safety and decision freeze

### Why first

The Git history may contain material that should not be redistributed.

A public contributor campaign should not begin until this is reviewed.

### Work

- audit current tree and history;
- classify external artifacts;
- decide history rewrite;
- strengthen `.gitignore`;
- add artifact denylist;
- disable browser self-certification;
- replace hard-coded commit hashes;
- create an administrative backup;
- write ADRs 0001–0010.

### Exit criteria

- rights-sensitive files inventoried;
- no new prohibited artifacts can pass CI;
- browser reports are labeled unreviewed;
- architecture decisions recorded.

---

## Phase 1 — Freeze current behavior

### Why

Refactoring without behavioral baselines risks silently changing mathematics and interface behavior.

### Work

- move current page to `legacy/index-legacy.html`;
- keep current public page unchanged;
- capture screenshots of all nineteen modes;
- record current routes and controls;
- add smoke tests;
- record checksums for key morphisms and puzzles;
- list known incorrect or misleading prose;
- create a migration ledger.

### Exit criteria

- every existing mode has a baseline;
- key outputs have checksums;
- known bugs are documented;
- legacy version remains runnable.

---

## Phase 2 — GitHub contribution foundation

### Why

The refactor will benefit from structured review and external feedback.

### Work

- enable Discussions;
- add issue forms;
- add PR template;
- add Code of Conduct;
- add Support and Security files;
- create a public project board or roadmap;
- protect `main`;
- require CI checks;
- add `CITATION.md` if desired alongside `CITATION.cff`.

### Exit criteria

- questions have a Discussions destination;
- actionable work has issue forms;
- PR expectations are visible;
- `main` cannot merge failing checks.

---

## Phase 3 — Extract the mathematical core

### Why

The same concepts are used by the word builder, tree search, Abelisk, AA2FR, and validation views.

This is the highest-leverage technical refactor.

### Work

Create:

```text
web/src/core/abelian/
web/src/core/additive/
web/src/core/parikh/
```

Implement:

- reference verifier;
- incremental append verifier;
- changed-index verifier;
- witness type;
- positive and negative controls;
- exhaustive differential tests.

Add temporary adapters so legacy views use the new functions.

### Exit criteria

- Word Builder, Tree Search, and Abelisk agree with the new reference verifier;
- incremental and full checks agree on exhaustive short cases;
- no DOM dependencies in core;
- no UI rewrite required yet.

---

## Phase 4 — Extract claims and content

### Why

Handwritten duplicate claims have already produced drift and incorrect wording.

### Work

- finish `claims.json` wiring;
- generate summaries;
- create `Claim` and `EvidenceBadge` components;
- move lesson prose to content files;
- move timeline and puzzle data to versioned JSON;
- add content-type labels;
- add schema validation.

Correct immediately:

- g85 explanation;
- analogy language in 2D Walk and sonification;
- browser-computation labels;
- seam-search authority language.

### Exit criteria

- no exact result is copied manually into more than one page;
- every research-facing statement has a claim ID or content-type label;
- build fails on claim drift;
- large data is no longer embedded in the app shell.

---

## Phase 5 — Create the new application shell

### Why

Real routes enable code splitting, link stability, and audience-specific navigation.

### Work

- initialize `web/`;
- configure Vite and project-site base path;
- create route shell;
- create design tokens;
- create header and footer;
- inject build metadata;
- create custom 404;
- create old-route migration map;
- deploy a small preview.

### Initial routes

```text
/
 /learn/
 /explore/
 /research/
 /evidence/
 /abelisk/
 /community/
```

### Exit criteria

- GitHub Pages preview works under repository base path;
- direct route reload works;
- Back button works;
- footer shows immutable build link;
- old site remains accessible.

---

## Phase 6 — Migrate Abelisk first

### Why

Abelisk already has a strong standalone product design and clear feature boundaries.

It provides visible user value while testing the new architecture.

### Work

- implement Abelisk v3 route;
- use new mathematical core;
- use versioned puzzle schema;
- implement save-state versioning;
- add accessible controls;
- build Story first;
- add curated Pure Logic puzzles later;
- leave Master Abelisk until small puzzles are validated.

### Exit criteria

- guided journey complete;
- no hidden global state;
- puzzle data schema validated;
- keyboard and reduced-motion paths work;
- direct `/abelisk/` link stable;
- old Abelisk link redirects or explains migration.

---

## Phase 7 — Migrate Learn and Explore

### Why

These are lower-risk than active research sandboxes and improve the public front door.

### Suggested order

1. Abelian Squares: Start Here
2. Mäkelä’s Conjecture tutorial
3. Word Builder
4. Three-Letter Search Tree
5. Three-Letter Boundary Lab
6. History
7. Concept Map
8. Keränen morphism viewer
9. Morphism Microscope
10. Parikh Walk
11. Sonification
12. Gallery

### Exit criteria per feature

- content sourced;
- mathematical output matches baseline;
- lifecycle cleanup passes;
- URL stable;
- accessibility checked;
- legacy code removed only after parity.

---

## Phase 8 — Migrate Evidence

### Why

Evidence views should become the authoritative public bridge into the repository.

### Work

Create:

```text
/evidence/claims/
/evidence/verification/
/evidence/records/
/evidence/replication/
/evidence/snapshots/
```

Add:

- claim pages;
- evidence passports;
- reproduction commands;
- immutable artifact links;
- current versus archived labels;
- browser-report export with unreviewed status.

### Exit criteria

- every displayed result traces to evidence;
- records have checksums;
- current and archived links are distinguished;
- no browser result can self-promote into a claim.

---

## Phase 9 — Migrate Research features

### Why later

These are the most stateful, computational, and epistemically sensitive features.

### Suggested order

1. Unfavourable Factors
2. Constraint Heat Map
3. Morphism Research Lab
4. Restricted Mäkelä Search Lab
5. Additive research area
6. Experimental Seam Search
7. Negative Results & Research Lessons

### Requirements

- typed worker protocols;
- run IDs;
- cancellation;
- exact scope notices;
- no hard-coded results;
- manifest export;
- independent checker links.

### Exit criteria

- all workers terminate on navigation;
- late messages ignored;
- all browser outputs labeled correctly;
- negative-results taxonomy rendered from source data;
- no research feature depends on another feature’s internal code.

---

## Phase 10 — Retire the legacy application

### Why last

The old page is a safety net until feature parity and link migration are proven.

### Work

- compare all migrated outputs;
- preserve historical screenshots;
- replace old entry point;
- keep a versioned legacy snapshot;
- remove unused code and styles;
- publish migration notes;
- check external links and search indexing.

### Exit criteria

- all important features migrated or explicitly retired;
- legacy URLs have destinations;
- no scientific content exists only in the old page;
- bundle and runtime budgets pass;
- public release tagged.

---

# 29. Ninety-day practical schedule

## Weeks 1–2

- Phase 0 repository audit;
- disable self-certification;
- add artifact CI;
- create ADRs;
- enable Discussions;
- create issue forms.

## Weeks 3–4

- baseline screenshots and smoke tests;
- extract Parikh and Abelian reference verifier;
- differential tests;
- legacy adapters.

## Weeks 5–6

- claims export and schemas;
- correct g85 and analogy prose;
- build new Vite shell;
- deploy preview route.

## Weeks 7–9

- Abelisk Story route;
- accessibility path;
- puzzle validation;
- build metadata;
- stable links.

## Weeks 10–12

- migrate Word Builder;
- migrate beginner tutorial;
- migrate Three-Letter Search Tree;
- publish first modular release;
- review architecture cost versus research benefit.

At day 90, stop and evaluate.

Do not automatically continue the migration merely because a plan exists.

---

# 30. Progress limits

To prevent an infrastructure trap:

```text
one active architecture epic
maximum two active feature migrations
one public release at least every four weeks
```

Architecture work must produce one of:

- lower bug risk;
- faster page load;
- stable links;
- evidence traceability;
- contributor usability;
- accessibility;
- feature parity.

If a refactor produces none of these, pause it.

---

# 31. New considerations that are easy to overlook

## 31.1 The website itself becomes a cited research object

Stable URLs, version numbers, and archived releases matter because lessons, screenshots, and claims may be cited.

## 31.2 Search-engine snippets can preserve old claims

When correcting scientific wording:

- update page;
- update metadata;
- update canonical page;
- keep a correction note when necessary;
- do not silently redirect a materially different historical claim without preserving the record.

## 31.3 Build reproducibility

Record:

```text
Node version
package-lock
build command
commit
claims snapshot
```

A release should be rebuildable.

## 31.4 Generated data ownership

Every generated JSON file needs:

```text
source
generator
schema version
generated date
do-not-edit notice
```

## 31.5 AI-agent orientation

Add:

```text
web/AGENTS.md
```

It should explain:

- architecture boundaries;
- commands;
- claims rules;
- prohibited shortcuts;
- how to add a route;
- how to add a puzzle;
- how to add a claim-backed paragraph;
- how to test workers.

## 31.6 Browser storage migrations

A puzzle or worker update can invalidate saved data.

Versioning and migration must be designed before many users accumulate state.

## 31.7 Offline and no-JavaScript access

Important explanatory pages should remain readable without JavaScript.

Interactive modules may require JavaScript, but definitions, evidence status, and research limitations should not disappear.

## 31.8 Contributor preview deployments

Every UI pull request should produce a preview artifact or screenshot set.

Contributors should not need maintainer access to see their changes rendered.

## 31.9 Ownership and succession

Document who controls:

- GitHub repository;
- Pages deployment;
- custom domain if added;
- Zenodo integration;
- release keys;
- moderation;
- claim approval.

## 31.10 Corrections need a user-facing channel

Create:

```text
/evidence/corrections/
```

A correction should say:

- what was previously shown;
- what changed;
- why;
- affected claim;
- affected release;
- whether conclusions changed.

---

# 32. Files to create first

```text
docs/plans/SUSTAINABLE_WEB_ARCHITECTURE_REFACTOR_AND_GITHUB_PLAN.md

docs/adr/
  0001-use-a-static-modular-monolith.md
  0002-use-vite-typescript-and-preact.md
  0003-separate-research-and-browser-computation.md
  0004-generate-claims-from-ledger.md
  0005-preserve-old-links.md
  0006-negative-results-taxonomy.md

.github/
  ISSUE_TEMPLATE/
    bug.yml
    claim-challenge.yml
    replication-result.yml
    teaching-feedback.yml
    accessibility.yml
    config.yml
  PULL_REQUEST_TEMPLATE.md
  workflows/
    ci.yml
    pages.yml
    link-check.yml

CODE_OF_CONDUCT.md
SECURITY.md
SUPPORT.md
LICENSES.md

web/
  index.html
  vite.config.ts
  tsconfig.json
  src/
    app/
    core/
    routes/
    features/
    workers/
    content/
    components/
    styles/

legacy/
  index-legacy.html
```

---

# 33. First ten implementation issues

## Issue 1 — Remove browser self-certification

Priority:

```text
P0
```

## Issue 2 — Audit external artifacts and Git history

Priority:

```text
P0
```

## Issue 3 — Add artifact denylist CI

Priority:

```text
P0
```

## Issue 4 — Add baseline screenshots and smoke tests

Priority:

```text
P0
```

## Issue 5 — Extract reference Abelian verifier

Priority:

```text
P0
```

## Issue 6 — Add differential verifier tests

Priority:

```text
P0
```

## Issue 7 — Finish claim-export wiring

Priority:

```text
P0
```

## Issue 8 — Create modular application shell

Priority:

```text
P1
```

## Issue 9 — Migrate Abelisk Story

Priority:

```text
P1
```

## Issue 10 — Enable Discussions and contribution forms

Priority:

```text
P1
```

---

# 34. Release acceptance criteria

The first modular release is ready when:

- [ ] current prohibited-artifact risk has been reviewed;
- [ ] no browser module uses self-certifying language;
- [ ] build commit is injected automatically;
- [ ] main branch requires passing CI;
- [ ] GitHub Discussions or an equivalent public conversation space exists;
- [ ] claim challenge and replication forms exist;
- [ ] new route shell is deployed;
- [ ] Abelian core is independent of UI;
- [ ] reference and incremental verifiers agree on exhaustive short tests;
- [ ] claims are generated from the ledger;
- [ ] Abelisk has a stable standalone route;
- [ ] old links have a migration policy;
- [ ] accessibility checks run;
- [ ] feature workers terminate on route change;
- [ ] site footer exposes source, claim status, contribution, citation, and build revision;
- [ ] one tagged release and one archived research snapshot exist.

---

# 35. Final architecture principles

## Principle 1

> **The website is a view of the evidence, not the source of the evidence.**

## Principle 2

> **Each feature owns its state, lifecycle, and worker.**

## Principle 3

> **The mathematical core is pure and independently testable.**

## Principle 4

> **Every public result has a stable claim or artifact identity.**

## Principle 5

> **Every browser computation is presumed exploratory until separately promoted.**

## Principle 6

> **GitHub is visible where provenance, contribution, or reproduction matters—not as visual clutter on every beginner screen.**

## Principle 7

> **A memorable name may sit above a precise classification, but it may not replace it.**

Therefore:

```text
Museum of Mistakes
  pedagogical curation

The Graveyard
  logically closed routes

Negative Results & Research Lessons
  authoritative umbrella
```

## Principle 8

> **Do not rewrite the whole project. Replace one responsibility at a time, and keep the public site working after every step.**

---

# 36. Final recommendation

The best next move is not to begin by designing the final homepage.

Begin with the project’s trust boundary:

```text
Git history and artifact safety
→ browser-report honesty
→ mathematical core
→ claims pipeline
→ modular shell
→ Abelisk
→ remaining features
```

This order is deliberate.

It fixes the highest risks before producing the most visible redesign.

The desired end state is:

```text
A beginner sees a beautiful learning path.
A teacher sees ready materials.
A player sees Abelisk.
A researcher sees exact scope and evidence.
A contributor sees a clear task.
An AI agent sees stable boundaries.
A future maintainer sees why every architectural choice was made.
```

That is what sustainable scaling should mean for this project.
