# ABELISK — Game Design, Discovery, and Insight System

## A mystery-puzzle framework where players learn Abelian structure by solving, noticing, failing, and decoding

**Suggested repository path:**  
`docs/game-design/ABELISK_GAMEPLAY_DISCOVERY_AND_INSIGHT_SYSTEM.md`

**Status:** gameplay, pedagogy, narrative, and systems-design specification  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary product:** browser-based mathematical mystery puzzle  
**Primary principle:** the player should learn the mathematics by needing it

---

# 0. Vision

Abelisk should not feel like a mathematics lesson disguised as a game.

It should feel like:

> **A strange artifact whose rules can only be understood by observing its echoes.**

The player begins with symbols, color, order, and uncertainty.

Gradually they discover that:

- identical repetition is only the surface;
- reordered blocks can still repeat structurally;
- some constraints concern inventories;
- some concern sums;
- some concern hidden long-range symmetry;
- the artifact responds to patterns the eye does not immediately see;
- the deeper chambers reflect real open mathematical questions.

The gameplay loop should be:

```text
observe
→ predict
→ place
→ receive structural feedback
→ form a hypothesis
→ test it
→ revise it
→ unlock a deeper rule
```

The player should often experience:

```text
"I thought order mattered."
"Wait — it is counting something else."
"I can see the pattern now."
"I predicted that move would fail."
"I understand why the puzzle rejected it."
"What happens if this continues forever?"
```

The goal is not merely to complete grids.

The goal is to produce **moments of genuine insight**.

---

# 1. Design pillars

## 1.1 Mystery before explanation

Do not reveal the formal rule before the player has encountered it.

The system should first communicate through:

- echoes;
- highlights;
- paired regions;
- count shadows;
- symbol resonance;
- partial message fragments.

Terminology is revealed later.

## 1.2 Understanding is the real progression system

A player advances not only by filling cells but by demonstrating insight.

Progress can unlock when the player:

- predicts a forbidden move;
- identifies the matching inventories;
- explains why two blocks conflict;
- distinguishes local from long-range repetition;
- recognizes what a finite result proves.

## 1.3 Failure is information

A rejected move should never be only:

```text
Wrong
```

It should reveal:

```text
which two blocks echoed
what property matched
how far the echo reached
what clue can be inferred
```

## 1.4 The game teaches through representation shifts

The same structure appears as:

```text
colored cells
letters
counts
sums
vectors
sound
ciphertext
graph connections
long-range brackets
```

The player learns that different representations can reveal different invariants.

## 1.5 Scientific honesty is part of the fiction

The game can be mysterious, but factual claims must remain clear.

Story text may say:

> The Abelisk remembers every echo.

Research notes must say:

> The current browser puzzle checks the declared finite structure only.

Narrative mystery must not blur the status of real mathematical claims.

---

# 2. Player experience arc

The game should contain five broad phases.

## Phase I — Surface recognition

The player learns:

- placement;
- ordinary repetition;
- adjacent blocks;
- immediate contradiction.

Emotion:

```text
recognition
```

## Phase II — Hidden repetition

The player discovers:

- order can change;
- equal inventories still count as repetition;
- counting is more powerful than visual matching.

Emotion:

```text
surprise
```

## Phase III — Rule reconstruction

The player begins predicting:

- which cells are forced;
- which symbols are impossible;
- how a contradiction propagates;
- why a puzzle has a unique solution.

Emotion:

```text
mastery
```

## Phase IV — Deep structure

The player encounters:

- long-range echoes;
- additive variants;
- nested or overlapping constraints;
- cipher messages;
- the 85-cell master structure.

Emotion:

```text
awe
```

## Phase V — Research doorway

The player discovers:

- some variants are open-ended;
- finite play differs from infinite existence;
- real researchers use related tools;
- the player can contribute through challenges and verification.

Emotion:

```text
participation
```

---

# 3. Core gameplay loop

A standard Abelisk turn should be:

1. Choose a symbol.
2. Place it in a cell.
3. The structure checks every newly completed relevant block.
4. If valid:
   - the cell stabilizes;
   - part of the cipher may reveal;
   - neighboring possibilities update.
5. If invalid:
   - an echo appears;
   - the matching blocks are shown;
   - the move may be undone or marked as impossible.
6. The player updates their hypothesis.
7. Continue.

The loop should support three cognitive levels:

## Level A — Trial

```text
"I will try b."
```

## Level B — Prediction

```text
"b should fail because this would make ab | ba."
```

## Level C — Deduction

```text
"Only c can fit because a and b each create a different echo."
```

The game should gently move players from A toward C.

---

# 4. Puzzle mechanic families

Abelisk needs more than one fill-the-grid mechanic.

The following families create varied forms of insight while preserving the central theme.

---

## 4.1 Echo Detection

The player is shown a completed sequence and must identify a forbidden pair of adjacent blocks.

Example:

```text
a b c c b a
```

The player brackets:

```text
abc | cba
```

### Variants

- shortest echo;
- longest echo;
- all echoes;
- hidden among distractors;
- only one valid witness;
- overlapping witnesses.

### Learning outcome

Recognize Abelian equivalence before constructing with it.

---

## 4.2 Echo Repair

A sequence contains one or more violations.

The player may:

- replace one symbol;
- swap two symbols;
- remove one symbol;
- insert one symbol.

Goal:

```text
break every echo with the minimum number of changes
```

### Insight

The player learns which features of the blocks matter.

### Advanced scoring

- minimum edit distance;
- preserve the cipher message;
- preserve total symbol counts;
- repair without changing fixed cells.

---

## 4.3 Forced Cell Deduction

A grid has an empty cell.

Two candidate symbols produce different violations.

Only one remains possible.

The interface can show:

```text
a → creates echo at length 2
b → creates echo at length 4
c → valid
```

Initially these explanations remain hidden until requested.

### Insight

The player experiences mathematical deduction rather than guessing.

---

## 4.4 Inventory Match

Two blocks are shown.

The player must decide whether they have the same inventory.

Possible interfaces:

- drag letters into count bins;
- balance scales;
- connect matching symbols;
- choose a Parikh vector;
- sort ghost copies while preserving original order.

### Insight

The player learns Abelian equivalence directly.

---

## 4.5 Missing Half

One half of an Abelian square is shown.

The player must construct a second half with:

- the same inventory;
- a different order;
- a specified first symbol;
- no ordinary equality.

Example:

```text
abc | _ _ _
```

Goal:

```text
create an Abelian square that is not an ordinary square
```

### Insight

Constructing the forbidden pattern can teach it better than only avoiding it.

---

## 4.6 Break the Echo

The player is asked to make two blocks **not** Abelian-equivalent.

Example:

```text
abc | cba
```

Change exactly one symbol.

### Advanced version

Change one symbol while preserving:

- total sum;
- one letter count;
- a cipher constraint;
- another neighboring block.

---

## 4.7 Echo Chain

Several adjacent blocks interact.

A move may break one echo but create another.

Example concept:

```text
[block A][block B][block C]
```

The player must satisfy:

```text
A not equivalent to B
B not equivalent to C
```

while other fixed cells constrain the choices.

### Insight

Local repairs can have nonlocal consequences.

---

## 4.8 Overlapping Echoes

A single cell belongs to several possible Abelian-square witnesses.

The interface shows layered brackets.

The player must find a symbol that avoids all of them.

### Insight

The player sees why the search problem becomes difficult.

---

## 4.9 Long-Range Echo

The violating blocks are far apart in the displayed row, though still adjacent as blocks.

The game initially shows only a local viewport.

When a violation occurs, the camera zooms out to reveal the full interval.

### Insight

A new move can complete a pattern whose beginning is far away.

---

## 4.10 Scale Lens

The player selects a half-length:

```text
K = 2, 3, 4, ...
```

The interface overlays every adjacent pair of length-K blocks.

The player searches for a match.

### Modes

- guided lens;
- free exploration;
- timed scan;
- research visualization.

### Insight

The player learns that the same word can contain patterns at multiple scales.

---

## 4.11 Sum Chamber

The alphabet uses numerical symbols such as:

```text
0, 1, 2, 6
```

The rule concerns equal sums of adjacent blocks.

Example:

```text
0 2 1 | 1 0 2
```

Both sums equal 3.

### Relationship to Abelian structure

This chamber should feel like a related but distinct rule.

The player learns:

```text
inventory equality implies equal sum
but equal sum does not imply equal inventory
```

### Puzzle ideas

- identify equal-sum blocks;
- modify one value to break equality;
- construct two different inventories with equal sum;
- distinguish additive and Abelian echoes.

---

## 4.12 Cipher Constraint Puzzle

The symbol solution determines the plaintext.

Possible mappings:

```text
symbol → letter
symbol pair → letter
valid block type → letter
Parikh vector → letter
```

The mapping should be visible enough to reason about, not purely hidden.

### Critical rule

The mathematical structure must cause the message reveal.

The plaintext cannot merely appear as a reward after an unrelated puzzle.

---

## 4.13 Dual-Layer Cipher

Each cell has:

```text
structural symbol
cipher fragment
```

Correct structural placements reveal the message gradually.

Incorrect placements may reveal distorted or contradictory fragments.

### Insight

The player sees that solving the structure is equivalent to decrypting the message.

---

## 4.14 Cipher Phrase Reconstruction

The player solves multiple small Abelisk puzzles.

Each yields one phrase fragment:

```text
ORDER
IS
NOT
THE
WHOLE
STORY
```

The fragments combine into a deeper clue.

### Meta-puzzle

The order of solved fragments may itself need decoding.

---

## 4.15 Symmetry Chamber

The player can apply:

- alphabet permutation;
- reversal;
- mirror;
- rotation of a block visualization.

The puzzle asks:

> Does the validity change?

### Insight

The player discovers structural symmetries.

### Research bridge

This prepares learners for canonicalization and symmetry reduction in search.

---

## 4.16 Counterexample Hunt

The game presents a proposed rule:

> If the final four symbols are safe, the whole extension is safe.

The player must find a counterexample.

### Other hypotheses

- balanced letter counts are always best;
- the shortest safe choice is always extendable;
- a repeated suffix determines the future;
- every D40-valid path is globally valid;
- longer finite words imply an infinite word.

### Insight

The player learns that mathematical claims must survive attempts to break them.

---

## 4.17 Verifier Detective

The game shows a sequence labeled:

```text
VALID
```

The player inspects it and finds a hidden violation.

The story says:

> The Abelisk’s checker is damaged.

### Puzzle mechanics

- highlight first missed witness;
- compare two verifier outputs;
- identify an off-by-one error visually;
- test boundary cases;
- choose a regression test.

### Insight

Computers can be wrong if programs are wrong.

---

## 4.18 Two Oracles

Two checkers disagree.

```text
Oracle A: valid
Oracle B: invalid
```

The player must decide:

- which witness proves invalidity;
- whether both used the same definition;
- whether one ignores K=2;
- whether one allows short repetitions.

### Insight

Independent implementations are valuable only when their assumptions are aligned.

---

## 4.19 Search Tree Expedition

The player explores a branching tree.

Each node is a valid prefix.

Branches collapse when they create an echo.

### Player choices

- choose depth-first;
- keep several frontiers;
- mark forced nodes;
- compare search orders.

### Insight

The player sees backtracking directly.

### Advanced layer

Show:

```text
FOUND
EXHAUSTED
BUDGET EXHAUSTED
```

and ask what each status means.

---

## 4.20 Budget Challenge

The player has limited:

- moves;
- checks;
- time;
- hints;
- explored nodes.

The goal is not necessarily to prove impossibility, but to find the best result within a budget.

### Insight

A failed budgeted search is not an exhaustion proof.

---

## 4.21 Record Run

The player tries to extend a valid sequence as far as possible.

The interface records:

- current length;
- best length;
- first failing witnesses;
- forced moves;
- independent verification status.

### Important wording

Use:

```text
personal finite record
```

not:

```text
progress toward proving infinity
```

---

## 4.22 Proof or Evidence?

The player sees cards:

```text
A valid word of length 1000
A checked finite search tree
A cycle in a local graph
A formal morphism theorem
A browser experiment
```

They sort them into:

```text
example
bounded exact result
heuristic evidence
proof
not enough information
```

### Insight

This becomes one of Abelisk’s most distinctive educational mechanics.

---

## 4.23 Minimal Obstruction

The player receives an invalid sequence and removes symbols from the ends.

Goal:

```text
find the smallest factor that still contains the violation
```

### Insight

The player discovers minimal forbidden factors.

---

## 4.24 Obstruction Atlas

Solved violations enter a collection.

Each card shows:

- word;
- split;
- Parikh vectors;
- symmetry family;
- smallest known form;
- where the player encountered it.

### Meta-progression

The player collects **types of mistakes**, not cosmetic items.

---

## 4.25 Echo Composer

A creative sandbox where the player deliberately designs:

- an ordinary square;
- a non-ordinary Abelian square;
- an additive square;
- overlapping echoes;
- a near-miss.

### Insight

Creating examples deepens understanding.

---

# 5. Hint system as discovery system

Hints should not simply give the next symbol.

Use a five-layer structure.

## Hint 0 — Atmosphere

> Something is resonating.

No cells highlighted.

## Hint 1 — Region

Highlight the approximate interval.

> The echo begins somewhere here.

## Hint 2 — Split

Show the two adjacent blocks.

```text
[ _ _ _ ][ _ _ _ ]
```

## Hint 3 — Invariant

Show counts or sums.

```text
left:  a2 b1 c0
right: a2 b1 c0
```

## Hint 4 — Action

Suggest a candidate removal or replacement.

> Changing this `b` would break the matching inventory.

## Hint 5 — Full explanation

Reveal the exact witness and rule.

The player can choose how much help to receive.

### Hint economy

Avoid punishing learners for using hints.

Optional scoring can record:

```text
solved independently
solved with region hint
solved with inventory hint
```

but the primary reward remains understanding.

---

# 6. Insight moments

A strong Abelisk puzzle should target at least one named insight.

## Insight I1 — Same order is not required

Triggered by:

```text
ab | ba
```

## Insight I2 — Counting can reveal hidden repetition

Triggered by inventory visualization.

## Insight I3 — One move can create several violations

Triggered by overlapping echoes.

## Insight I4 — A local view can miss a long pattern

Triggered by zoom-out.

## Insight I5 — Equivalent representations preserve structure

Triggered by color, letter, and count views.

## Insight I6 — A heuristic is not a proof

Triggered by counterexample hunt.

## Insight I7 — A finite record is still finite

Triggered by the infinity scale.

## Insight I8 — Search order changes discovery time, not validity

Triggered by search-tree comparison.

## Insight I9 — Independent verification matters

Triggered by Two Oracles.

## Insight I10 — Failure can generate knowledge

Triggered by Obstruction Atlas.

Each puzzle definition should declare:

```yaml
target_insights:
  - I2
  - I4
```

---

# 7. Narrative structure

The Abelisk can be presented as a layered object.

## 7.1 The Surface

The artifact responds to visible repetition.

Message fragments:

```text
THE FIRST ECHO IS EASY TO SEE
```

## 7.2 The Inventory Layer

The artifact ignores order and measures content.

Message:

```text
ORDER IS ONLY THE SURFACE
```

## 7.3 The Sum Layer

The artifact measures another invariant.

Message:

```text
DIFFERENT STRUCTURES MAY SHARE A WEIGHT
```

## 7.4 The Cipher Vault

Correct structures release language.

Message:

```text
THE RULE IS THE KEY
```

## 7.5 The Deep Chamber

Long-range constraints emerge.

Message:

```text
THE PAST REACHES INTO THE FINAL CELL
```

## 7.6 The Open Door

The player encounters the conjecture.

Message:

```text
CAN THE ECHO BE AVOIDED FOREVER?
```

---

# 8. Meta-game

The game should have optional long-term structure without becoming a grind.

## 8.1 Chamber map

A visual Abelisk tower:

```text
Surface
Inventory
Sum
Cipher
Deep Structure
Research Door
```

Each chamber lights up as insights are demonstrated.

## 8.2 Insight constellation

Instead of ordinary achievements, display discovered ideas:

```text
Hidden Repetition
Inventory Thinking
Long-Range Memory
Independent Verification
Finite Is Not Infinite
```

## 8.3 Obstruction Atlas

Every discovered violation type becomes a card.

## 8.4 Research notebook

The player may save:

- hypotheses;
- failed attempts;
- favorite examples;
- personal records;
- exported sequences.

The notebook can contain prompts:

> What do you think the Abelisk is measuring?

> Which strategy failed?

> What would you test next?

## 8.5 Message archive

Decoded phrases accumulate into a larger narrative.

## 8.6 No mandatory streaks

Avoid:

- daily-pressure systems;
- loss aversion;
- manipulative retention loops;
- energy timers;
- pay-to-retry mechanics.

---

# 9. Difficulty design

Difficulty should increase by adding conceptual interaction, not only by adding cells.

## Tier 1 — Recognition

- ordinary squares;
- short Abelian squares;
- direct count comparison.

## Tier 2 — Deduction

- one forced cell;
- two candidate violations;
- short chains.

## Tier 3 — Interaction

- overlapping constraints;
- several possible half-lengths;
- repairs with side effects.

## Tier 4 — Representation

- color-to-letter translation;
- additive rules;
- hidden cipher layers.

## Tier 5 — Long range

- zoomed-out echoes;
- large grids;
- chaptered master puzzle.

## Tier 6 — Research reasoning

- counterexample hunt;
- verifier bugs;
- search statuses;
- finite versus infinite evidence.

### Difficulty labels

Use:

```text
Concept difficulty
Puzzle depth
Grid size
```

instead of one vague difficulty name.

Example:

```text
Concept: Hidden inventory
Depth: 3 / 5
Size: 18 cells
```

---

# 10. Adaptive puzzle sequencing

The system may adapt based on understanding, not speed.

## If the player struggles with inventory

Offer:

- more count visualizations;
- smaller blocks;
- drag-to-bin mechanics;
- fewer symbols.

## If the player understands quickly

Offer:

- less explicit highlighting;
- longer blocks;
- explanation prompts;
- overlapping echoes.

## If the player guesses repeatedly

Ask:

> Would you like to mark possible symbols before committing?

Enable candidate notes.

## If the player overuses one heuristic

Present a counterexample puzzle.

Example:

> You have been choosing the least frequent symbol. Does that always work?

---

# 11. Notes mode

The existing Notes mode is valuable.

Improve it into a full candidate system.

Each empty cell may hold:

```text
a b c d
```

as small marks.

The player can:

- add candidates;
- eliminate candidates;
- attach a reason;
- auto-remove impossible candidates optionally.

### Reason tags

```text
short echo
long echo
sum conflict
fixed clue
cipher constraint
```

### Research doorway

Candidate elimination mirrors constraint propagation in search algorithms.

---

# 12. Explanation-on-demand

Every solved puzzle can offer four post-solve views.

## View 1 — Story

A short fictional message.

## View 2 — Puzzle logic

Which deductions solved it?

## View 3 — Mathematics

Formal rule, blocks, vectors, and witnesses.

## View 4 — Research note

How this relates to real combinatorics on words.

The player chooses depth.

This prevents explanations from interrupting the mystery.

---

# 13. Puzzle generation

Generated puzzles must be:

- valid;
- solvable;
- preferably uniquely solvable in deduction modes;
- classified by target insight;
- checked independently;
- reproducible from a seed.

## 13.1 Generation pipeline

```text
generate complete valid structure
→ remove selected clues
→ test solvability
→ test uniqueness
→ classify deductions
→ independent verifier
→ assign puzzle ID
→ store generation seed
```

## 13.2 Avoid random difficulty claims

Measure:

- search nodes;
- number of forced deductions;
- maximum reasoning depth;
- number of candidate branches;
- hint layers required in testing.

## 13.3 Human curation

Generated puzzles should be reviewed for:

- elegance;
- clarity;
- visual balance;
- intended insight;
- absence of tedious repetition.

---

# 14. Uniqueness and ambiguity

Some modes require a unique solution.

Others may intentionally allow several.

## Unique-solution modes

- Cipher Vault;
- guided deduction;
- teacher assessment;
- master cipher.

## Multi-solution modes

- open construction;
- record hunt;
- creative composer;
- research sandbox.

The interface must state which applies.

Avoid presenting one discovered solution as:

```text
the solution
```

when several exist.

---

# 15. The Cipher system

## 15.1 Structural encryption

The plaintext should be derived from the mathematical solution.

Possible mechanisms:

### Cell mapping

Each solved symbol maps to a plaintext letter through a visible key.

### Block mapping

Each valid local block maps to a letter.

### Inventory mapping

A Parikh vector maps to a character.

### Path mapping

A sequence of deduction choices determines a phrase.

## 15.2 Fair cipher design

The player must be able to understand:

- what is encrypted;
- how solved structure reveals it;
- why the result is not arbitrary.

## 15.3 Partial reveal

Reveal a letter only when the corresponding structural dependency is fixed.

## 15.4 Corrupted reveal

An invalid temporary structure may show static or scrambled fragments, but never reveal false mathematical information as fact.

## 15.5 Message writing

Messages should:

- reinforce discovered ideas;
- remain short;
- avoid pretending to be research claims;
- build toward the conjecture.

Suggested phrases:

```text
ORDER CAN LIE
COUNT THE SHADOW
THE SAME WEIGHT IS NOT THE SAME FORM
THE PAST TOUCHES THE END
A RECORD IS NOT FOREVER
TWO CHECKERS SEE MORE THAN ONE
CAN THIS CONTINUE FOREVER
```

---

# 16. Deep Cipher design

The 85-cell puzzle should be a campaign, not one undifferentiated grid.

## 16.1 Chapter structure

Example:

```text
Chapter I: Surface marks
Chapter II: Inventory channels
Chapter III: Broken symmetry
Chapter IV: Long echo
Chapter V: Master phrase
```

Chapters may correspond to interface sections, not claimed mathematical decomposition.

## 16.2 Local goals

Each chapter has:

- 10–20 cells;
- one new insight;
- one cipher fragment;
- one checkpoint.

## 16.3 Global interactions

Later chapters may reveal that an early choice affects a distant region.

This should be carefully designed to avoid unfair guessing.

## 16.4 Rewind

Allow:

- chapter rewind;
- full reset;
- alternative branch comparison;
- save state.

## 16.5 Completion

On completion, show:

- full symbol structure;
- decoded message;
- mathematical inspiration;
- exact status of the underlying construction;
- source and claim ID if research-derived.

---

# 17. Social and community play

## 17.1 Daily puzzle

A small, deterministic puzzle shared by all players.

Display:

- puzzle ID;
- date;
- target insight;
- anonymized solve distribution.

Avoid manipulative streak pressure.

## 17.2 Shareable result

Example:

```text
ABELISK #42
Solved in 7 deductions
Hints: Inventory 1
Insight: Long-range echo
```

Do not share the full solution automatically.

## 17.3 Classroom room code

Teachers can launch the same puzzle for a group.

Optional aggregate view:

- number of predictions;
- common misconception;
- no public individual ranking by default.

## 17.4 Community puzzle creation

Advanced users can submit puzzles.

Submission requires:

- solution;
- verifier pass;
- uniqueness status;
- target insight;
- clue rationale;
- license and attribution preference.

## 17.5 Research challenges

Selected puzzles can connect to real tasks:

```text
verify this record
find a counterexample
compare two algorithms
classify minimal obstructions
```

These must be clearly separated from ordinary game content.

---

# 18. Player-created content

A level editor can include:

- symbol alphabet;
- fixed cells;
- empty cells;
- rule type;
- cipher mapping;
- target message;
- clue structure;
- intended difficulty.

## Validation

Before publishing:

```text
mathematical validity
solvability
solution count
forbidden content check
accessibility labels
```

## Educational creator mode

Teachers can create:

- custom examples;
- deliberate misconceptions;
- classroom challenges;
- assessment puzzles.

---

# 19. Rewards

Rewards should reinforce learning and contribution.

Good rewards:

- new chamber;
- new representation;
- new type of clue;
- decoded story fragment;
- Obstruction Atlas entry;
- research notebook page;
- access to a real challenge.

Avoid rewards based only on:

- speed;
- repeated grinding;
- random loot;
- cosmetic accumulation unrelated to insight.

## Achievement examples

```text
Order Is Not Everything
Find your first non-ordinary Abelian square.

Long Memory
Detect an echo with half-length at least 8.

Independent Witness
Resolve a disagreement between two checkers.

Finite but Valuable
Correctly classify what a long record proves.

Counterexample
Break a proposed rule.
```

---

# 20. Sound and tactile ideas

## 20.1 Echo sonification

Two Abelian-equivalent blocks may play:

- the same chord in different note order;
- the same notes as arpeggios in different order.

This beautifully represents:

```text
same inventory
different order
```

## 20.2 Invalid resonance

A detected echo produces paired pulses.

## 20.3 Additive chamber

Blocks with equal sums may have the same final pitch but different internal melodies.

## 20.4 Accessibility

Sound is optional.

All sound information must have visual and textual equivalents.

---

# 21. Visual metaphor ideas

## 21.1 Balance scales

Each block places symbol weights on a scale.

Equal inventory balances exactly.

## 21.2 Shadow inventory

The original block casts a shadow showing only counts.

Different orders cast the same shadow.

## 21.3 Resonance waves

Equivalent blocks emit matching waveforms.

## 21.4 Constellation

Each symbol count contributes to a point in a small coordinate space.

Equivalent blocks land on the same point.

## 21.5 Archaeological rubbing

The player reveals hidden structure beneath surface symbols.

Use metaphors as optional views, not replacements for exact explanation.

---

# 22. Research-integrity gameplay

This can become Abelisk’s most original contribution.

## 22.1 Claim cards

The player reads:

> We found a valid word of length 10,000.

Question:

> What can we conclude?

## 22.2 Manifest puzzle

Match:

- word;
- checksum;
- verifier report;
- software version;
- dictionary version.

## 22.3 Checkpoint puzzle

A resumed search skips one branch.

The player identifies the faulty state.

## 22.4 Complexity puzzle

Choose the correct cost:

```text
one interval comparison
all K checks after one append
whole DFS search
```

## 22.5 Citation puzzle

Distinguish:

- source claim;
- project inference;
- analogy;
- unsupported statement.

These can be optional Research Door chambers.

---

# 23. Teacher integration

## 23.1 Classroom discussion mode

Pause before each reveal.

Teacher asks:

> What do you think the Abelisk measures?

## 23.2 Collaborative roles

In groups:

```text
Builder
Verifier
Counterexample hunter
Recorder
Explainer
```

Rotate roles.

## 23.3 Post-puzzle reflection

Prompts:

- What rule did you first believe?
- What evidence changed your mind?
- What remained uncertain?
- What would you test next?
- What would count as proof?

## 23.4 Printable versions

Create card-based versions of:

- Inventory Match;
- Missing Half;
- Counterexample Hunt;
- Proof or Evidence?;
- Obstruction Atlas.

---

# 24. Accessibility and inclusion

## 24.1 Non-color encoding

Every symbol has:

- letter;
- shape;
- outline;
- accessible name.

## 24.2 Reduced motion

All resonance animations have static equivalents.

## 24.3 Cognitive accessibility

- one new concept at a time;
- short instructions;
- replayable examples;
- glossary;
- no time pressure in core mode.

## 24.4 Language

Support:

- Finnish;
- English;
- later community translations.

Avoid idioms that are difficult to translate.

## 24.5 Motor accessibility

- large targets;
- keyboard placement;
- switch-control compatibility;
- undo;
- no precision dragging required.

---

# 25. Analytics and evaluation

Measure whether the game causes insight.

Do not measure only completion.

Useful anonymous events:

```text
prediction_made
echo_found
hint_level_used
explanation_opened
counterexample_found
rule_revised
finite_infinite_answer
puzzle_completed
```

## Evaluation questions

- Can players recognize `ab|ba` afterward?
- Can they explain equal inventory?
- Can they predict a violation?
- Can they distinguish finite evidence from proof?
- Which representations help most?
- Do players use fewer guesses over time?
- Can players transfer the idea to a new alphabet?

---

# 26. MVP roadmap

## MVP A — Echo discovery

Include:

- ordinary square;
- Abelian surprise;
- Inventory Match;
- Echo Repair;
- short Cipher phrase.

## MVP B — Deduction

Add:

- Notes mode;
- forced cells;
- overlapping constraints;
- deterministic hints;
- insight tracking.

## MVP C — Narrative chambers

Add:

- chamber map;
- story fragments;
- Sum Chamber;
- Cipher Vault;
- conjecture reveal.

## MVP D — Deep Cipher

Add:

- chaptered 85-cell puzzle;
- checkpoints;
- minimap;
- long-range interactions.

## MVP E — Research Door

Add:

- Counterexample Hunt;
- Two Oracles;
- Proof or Evidence?;
- Search Tree Expedition;
- real challenge links.

## MVP F — Community

Add:

- daily puzzle;
- teacher room;
- puzzle editor;
- community submissions;
- shareable results.

---

# 27. First 15 puzzles to build

1. `ab|ab` — visible repetition.
2. `ab|ba` — hidden inventory.
3. `abc|cba` — three-symbol inventory.
4. One non-example with unequal counts.
5. Missing Half — build a disguised echo.
6. Break the Echo — one-symbol repair.
7. Forced Cell — two symbols fail.
8. Echo Chain — repair creates another issue.
9. Long-Range Echo — zoom-out reveal.
10. Sum Chamber — equal sums, different inventories.
11. Abelian versus additive classification.
12. Cipher phrase: `ORDER CAN LIE`.
13. Counterexample to “balanced is always safe.”
14. Proof or Evidence? — finite record.
15. Conjecture gate: `CAN THIS CONTINUE FOREVER?`

---

# 28. Acceptance criteria

Abelisk’s expanded gameplay is ready when:

- [ ] players can learn Abelian equivalence without an initial formal lecture;
- [ ] every failure explains a structural witness;
- [ ] at least five distinct puzzle mechanics exist;
- [ ] puzzle difficulty reflects reasoning depth, not only grid size;
- [ ] the cipher is causally tied to the mathematical solution;
- [ ] the game includes prediction, construction, repair, and counterexample tasks;
- [ ] players encounter finite-versus-infinite reasoning;
- [ ] all generated puzzles are independently validated;
- [ ] unique-solution claims are checked;
- [ ] hints reveal structure incrementally;
- [ ] the 85-cell puzzle is chaptered and checkpointed;
- [ ] all core content works without color, sound, or animation;
- [ ] teachers have a presentation mode;
- [ ] research content is labeled and sourced;
- [ ] no game reward implies progress toward proving the conjecture.

---

# 29. Final design statement

Abelisk should become a game about learning how to see.

At first, the player sees:

```text
letters
colors
empty cells
```

Then they begin to see:

```text
blocks
inventories
echoes
constraints
long-range memory
```

Finally, they see:

```text
hypotheses
counterexamples
evidence
open questions
```

The game succeeds when the player does not merely know the rule.

It succeeds when the player begins thinking like this:

> “What is the structure actually preserving?”

> “Can I predict the contradiction before I place the symbol?”

> “Is this a proof, or only an example?”

> “What experiment would distinguish these two explanations?”

The deepest version of Abelisk is not only a puzzle game.

It is an apprenticeship in mathematical noticing.
