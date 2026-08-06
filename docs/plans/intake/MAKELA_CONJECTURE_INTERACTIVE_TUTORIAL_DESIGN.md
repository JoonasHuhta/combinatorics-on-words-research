# Mäkelä’s Conjecture Interactive Tutorial — Pedagogical Design Plan

## From one letter on an empty screen to an open research problem

**Suggested repository path:**  
`docs/education/MAKELA_CONJECTURE_INTERACTIVE_TUTORIAL_DESIGN.md`

**Status:** pedagogical and interaction-design specification  
**Date:** 2026-08-05  
**Project:** `combinatorics-on-words-research`  
**Primary audience:** curious general public, secondary students, undergraduate students, teachers, and beginning researchers  
**Primary format:** browser-based, self-paced interactive narrative  
**Estimated core duration:** 8–12 minutes  
**Extended exploration duration:** 20–45 minutes  
**Language strategy:** Finnish first, English equivalent, later community translations

---

# 0. Central design idea

The tutorial begins with almost nothing.

The screen is quiet.

In the middle is one letter:

```text
a
```

The learner is not immediately shown a definition, formula, menu, research history, or large wall of text.

The experience unfolds one idea at a time:

```text
one letter
→ three available letters
→ repetition
→ ordinary square
→ reordered halves
→ Abelian square
→ Parikh vector
→ allowed short repetitions
→ Mäkelä’s conjecture
→ why finite search is not a proof
→ invitation to experiment and contribute
```

The intended emotional arc is:

```text
curiosity
→ recognition
→ surprise
→ playful experimentation
→ conceptual clarity
→ mathematical wonder
→ research invitation
```

The intended intellectual arc is:

```text
see
→ compare
→ count
→ predict
→ test
→ explain
→ generalize
→ distinguish evidence from proof
```

The main pedagogical principle is:

> **Do not explain the complete problem before the learner has personally encountered the pattern.**

The tutorial should allow the learner to *discover why the definition is needed*.

---

# 1. Learning goals

After the core tutorial, a learner should be able to:

1. identify an ordinary square such as `ab|ab`;
2. explain why `ab|ba` is an Abelian square;
3. compare two blocks using letter counts rather than order;
4. describe a Parikh vector informally;
5. state Mäkelä’s conjecture in plain language;
6. explain that `aa`, `bb`, and `cc` are allowed;
7. explain that longer Abelian squares are forbidden;
8. understand why a long finite example does not prove existence of an infinite word;
9. understand why local information may not be sufficient;
10. distinguish an exploratory browser game from an authoritative research computation.

The tutorial should not require learners to:

- know formal-language theory;
- understand morphisms;
- know graph theory;
- write code;
- understand asymptotic notation;
- read research papers.

Those topics belong in optional extension layers.

---

# 2. Pedagogical foundations

The design should follow these principles.

## 2.1 Segment the learning

Introduce one conceptual change per scene.

Do not show:

- the full definition;
- a Parikh-vector formula;
- the conjecture;
- computational complexity;
- the project architecture;

all at once.

Learners should control progression through a visible action such as:

```text
Continue
Show me
Try it
What changed?
```

## 2.2 Use concrete examples before terminology

Sequence:

```text
ab | ab
```

before:

```text
ordinary square
```

Then:

```text
ab | ba
```

before:

```text
Abelian square
```

Then letter-count cards before:

```text
Parikh vector
```

The term should name an idea the learner has already seen.

## 2.3 Prompt prediction before revealing

Use short prediction moments:

> Are these two halves the same?

> Do they contain the same letters?

> Which next letter is safe?

A prediction makes the explanation answer a question already active in the learner’s mind.

## 2.4 Provide immediate, explanatory feedback

Feedback should say:

- what happened;
- where it happened;
- why it happened;
- what to look for next.

Avoid only:

```text
Wrong.
```

Prefer:

```text
These halves are in a different order,
but both contain one a and one b.
That makes them Abelian-equivalent.
```

## 2.5 Offer multiple representations

The same idea should be visible as:

- a word;
- a colored block;
- a letter-count table;
- a Parikh vector;
- spoken narration or captions;
- an optional diagram.

No single representation should be mandatory for understanding.

## 2.6 Preserve learner agency

The learner can:

- pause;
- replay;
- advance manually;
- skip animation;
- open a plain-text explanation;
- switch to reduced-motion mode;
- try examples;
- choose beginner or deeper explanations.

## 2.7 Keep the research status honest

The tutorial should repeatedly distinguish:

```text
example
finite computation
conjecture
proof
open problem
```

The learner should leave with wonder, not a false impression that a long computer-generated word almost proves infinity.

---

# 3. Target audiences and modes

Use one shared narrative with adjustable depth.

## 3.1 Explorer mode

Audience:

- general public;
- younger learners;
- first-time visitors.

Features:

- minimal terminology;
- short text;
- strong visual guidance;
- no formulas unless opened;
- approximately 8 minutes.

## 3.2 Student mode

Audience:

- secondary and undergraduate learners.

Adds:

- Parikh-vector notation;
- small verification tasks;
- finite-versus-infinite reflection;
- a short complexity illustration;
- approximately 15–25 minutes.

## 3.3 Research doorway mode

Audience:

- university students;
- programmers;
- beginning researchers.

Adds:

- exact mathematical definition;
- suffix-only incremental-check explanation;
- verifier versus searcher distinction;
- links to challenge packets;
- current project evidence status.

## 3.4 Teacher presentation mode

Features:

- full-screen scene control;
- no automatic progression;
- discussion prompts;
- reveal buttons;
- optional speaker notes;
- QR code for learner devices;
- 15-, 45-, and 90-minute lesson variants.

The learner should not have to choose a mode before seeing anything.

Begin with `a`, then offer depth options later.

---

# 4. Visual and emotional style

## 4.1 Opening atmosphere

The opening should feel calm and spacious.

Recommended:

- plain background;
- one large letter;
- no visible navigation clutter;
- subtle cursor or breathing animation;
- quiet optional sound;
- high contrast;
- generous whitespace.

The experience should resemble discovering an object under a microscope, not entering a game dashboard.

## 4.2 Letter identity

Each letter may have a stable visual identity:

```text
a — one shape or color
b — another shape or color
c — another shape or color
```

However, color must not be the only indicator.

Also use:

- letter glyph;
- shape;
- texture or outline;
- accessible labels.

## 4.3 Motion language

Use motion to communicate relationships:

- identical halves align;
- reordered letters glide into matched groups;
- counts move into columns;
- forbidden intervals receive brackets;
- history zooms outward.

Motion must never be decorative noise.

## 4.4 Tone

The narration should be:

- warm;
- curious;
- exact;
- non-patronizing;
- never sensationalist;
- comfortable admitting uncertainty.

Avoid:

```text
This impossible mystery has baffled every genius.
```

Prefer:

```text
The rule is easy to state.
The difficulty is controlling every possible scale at once.
```

---

# 5. Complete scene-by-scene storyboard

---

## Scene 0 — One letter

### Screen

Only:

```text
a
```

centered on screen.

### Motion

The `a` fades in slowly.

No automatic movement after the fade.

### Text

After a short pause:

> This is enough to begin.

Then:

> We are going to build a word.

### Learner action

Button:

```text
Add another letter
```

### Pedagogical purpose

- reduce entry anxiety;
- establish focus;
- create curiosity;
- avoid introducing terminology too early.

### Accessibility

Screen reader announcement:

> The screen contains the letter a.

Reduced-motion mode:

- immediate appearance;
- no fade required.

---

## Scene 1 — The alphabet appears

### Screen transition

The original `a` remains.

Two available choices appear nearby:

```text
b   c
```

The learner now sees that the alphabet contains:

```text
a, b, c
```

### Text

> You have only three letters.

> You may use them again and again.

### Interaction

The learner chooses a next letter.

Do not mark any choice wrong.

Example result:

```text
ab
```

### Follow-up

Allow one or two more additions without restrictions.

### Pedagogical purpose

- establish the ternary alphabet;
- create ownership of the word;
- introduce repetition as normal;
- prepare for pattern detection.

---

## Scene 2 — The first visible repeat

The system guides or offers a branch that creates:

```text
abab
```

The tutorial may say:

> Let us look at this one.

Then separate it:

```text
ab | ab
```

### Animation

The halves slide slightly apart.

Matching positions receive subtle connecting lines:

```text
a ↔ a
b ↔ b
```

### Prompt

> What do you notice?

Options:

- The halves are identical.
- They use the same letters in another order.
- Nothing repeats.

### Feedback

After selection:

> The block `ab` appears twice in a row.

Reveal term:

> This is called a **square**.

### Pedagogical purpose

The learner encounters the familiar case before the Abelian generalization.

---

## Scene 3 — A repetition in disguise

Show:

```text
abba
```

Separate:

```text
ab | ba
```

### Initial prompt

> Is this also a kind of repetition?

Options:

```text
Yes
No
Not sure
```

All answers continue without penalty.

### Animation

Do not immediately sort both halves.

First highlight that:

```text
ab ≠ ba
```

Then move the letters vertically into count columns:

```text
left half     right half

a: 1          a: 1
b: 1          b: 1
c: 0          c: 0
```

### Text

> The order changed.

> The collection of letters did not.

Then:

> The two halves are anagrams.

Finally:

> This is an **Abelian square**.

### Pedagogical purpose

Create the central conceptual surprise:

> repetition can concern content rather than order.

### Important design rule

Do not animate the letters into the same sorted word too quickly.

The learner must first see that the original halves differ in order.

---

## Scene 4 — Try three examples

Present one example at a time.

### Example A

```text
abc | cba
```

Correct classification:

```text
Abelian square
```

### Example B

```text
abc | abb
```

Correct classification:

```text
Not an Abelian square
```

### Example C

```text
acb | bac
```

Correct classification:

```text
Abelian square
```

### Interaction

Buttons:

```text
Same letter counts
Different letter counts
```

Avoid asking only “square or not” before the count concept is stable.

### Feedback visualization

Display small count chips:

```text
a × 1
b × 1
c × 1
```

### Mastery rule

A learner may continue after every example, but the tutorial adapts:

- after repeated success, shorten explanations;
- after difficulty, retain the count table longer;
- never block the learner indefinitely.

---

## Scene 5 — Give the counting tool a name

Show a word such as:

```text
abca
```

Count:

```text
a: 2
b: 1
c: 1
```

Then compress visually:

```text
(2, 1, 1)
```

### Text

> Mathematicians package these counts into a list.

> It is called a **Parikh vector**.

### Optional deeper note

Expandable:

> The coordinate order here is `(a, b, c)`.

### Interaction

Ask:

> Which word has the same Parikh vector as `abca`?

Options:

```text
cbaa
abcc
aaac
```

Correct:

```text
cbaa
```

### Pedagogical purpose

The notation arrives only after the learner understands its meaning.

---

## Scene 6 — The building game changes

Return to the learner’s growing word.

### Text

> Now there is one rule.

> You may add `a`, `b`, or `c`.

> But try not to create an Abelian square.

### Interaction

The learner chooses letters.

When a violation occurs:

1. freeze the word;
2. bracket the full violating factor;
3. separate its halves;
4. show their counts;
5. allow undo.

Example:

```text
... abba
    ab | ba
```

### Feedback

> This new letter completed an Abelian square.

> The two halves contain the same number of each letter.

### Important

The system should show the **first or shortest declared witness according to a documented policy**.

Do not highlight an arbitrary violation.

Recommended learner-facing policy:

```text
Show the shortest newly created Abelian square.
If several have the same length, show the earliest one.
```

Research tools may use another policy, but the tutorial must be deterministic.

---

## Scene 7 — The rule is almost too strict

Deliberately present:

```text
aa
```

### Prompt

> Should this be forbidden too?

Explain:

```text
a | a
```

is technically an Abelian square with half-length 1.

Then:

> Mäkelä’s question allows these shortest repetitions.

Show:

```text
aa
bb
cc
```

with a visual “allowed” mark.

Then contrast:

```text
abab
abba
abccba
```

with “forbidden”.

### Text

> Only the one-letter halves are allowed.

> Every Abelian square with half-length 2 or more is forbidden.

### Pedagogical purpose

This is the exact moment where the general concept becomes Mäkelä’s specific problem.

Do not reveal the conjecture before this distinction is clear.

---

## Scene 8 — Reveal Mäkelä’s conjecture

The interface clears.

Display the rule:

> Use only `a`, `b`, and `c`.

Then:

> Allow `aa`, `bb`, and `cc`.

Then:

> Avoid every other Abelian square.

Finally, slowly reveal:

# Can the word continue forever?

After a pause:

> This is Mäkelä’s conjecture.

### Exact mathematical version

Expandable:

> Does there exist an infinite ternary word whose only Abelian-square factors are `aa`, `bb`, and `cc`?

### Epistemic label

Show clearly:

```text
OPEN PROBLEM
```

### Pedagogical purpose

The learner now understands every piece of the conjecture before seeing its formal statement.

---

## Scene 9 — Why “forever” changes everything

Show a growing word horizontally.

It passes beyond the screen.

The camera zooms out.

A long bracket appears connecting two large distant halves.

### Text sequence

> Short patterns are easy to see.

> Long Abelian squares may reach far into the past.

> A new letter can complete a pattern that began much earlier.

### Important mathematical clarification

Explain:

> When a valid word is extended by one new letter, every newly created violation must end at that new letter.

Then:

> But its beginning may be very far away.

This preserves both truths:

- the incremental verifier needs only ending-at-the-new-letter checks;
- the relevant history may still be long.

### Optional deeper visualization

Display candidate half-lengths:

```text
K = 2
K = 3
K = 4
...
```

Each creates two adjacent windows ending at the new final position.

---

## Scene 10 — Why checking every word is impossible

Show a small ternary tree:

```text
          start
        /   |   \
       a    b    c
      /|\  /|\  /|\
     ...
```

Allow it to expand briefly.

Then replace it with:

```text
3^50
```

and its exact decimal value if desired.

### Text

> A naive search branches rapidly.

> Good algorithms reject impossible branches early.

Then:

> But faster search is still not the same as proof of an infinite word.

### Optional complexity note

For advanced mode:

> One fixed Parikh-vector comparison can be constant time with prefix sums.

> Checking all possible half-lengths after one append still takes linear time in the current word length.

> The complete search tree may grow exponentially.

---

## Scene 11 — A very long word is not infinity

Show a ruler:

```text
100
1,000
10,000
1,000,000
...
∞
```

The finite marks grow, but infinity remains visually distinct.

### Prompt

> Suppose a computer finds a valid word with one million letters. What has it proved?

Options:

1. An infinite word exists.
2. A valid finite word of length one million exists.
3. The conjecture is almost certainly true.

Correct:

```text
A valid finite word of length one million exists.
```

### Feedback

> A finite record is valuable evidence about finite behavior.

> It is not a proof that the word can continue forever.

### Pedagogical purpose

This is a core evidence-literacy lesson, not an optional disclaimer.

---

## Scene 12 — How research proceeds

Show four cards:

```text
CONSTRUCT
Find a rule that generates words.

SEARCH
Explore finite possibilities.

VERIFY
Check candidates independently.

PROVE OR REFUTE
Turn observations into mathematics.
```

Then show:

```text
RECORD ≠ PROOF
HEURISTIC ≠ THEOREM
COMPUTATION + CERTIFICATE = CHECKABLE FINITE RESULT
```

### Project connection

> This open project builds tools, tests ideas, preserves failures, and invites independent verification.

### Learner choices

```text
Play the word-building game
See how the verifier works
Explore current research
Try a student challenge
Open the teacher lesson
```

---

# 6. Interaction model

## 6.1 Manual pacing by default

The learner controls conceptual progression.

Animations may begin after an explicit action, but major content should not auto-advance.

## 6.2 State machine

Suggested top-level states:

```text
INTRO_A
ALPHABET_REVEAL
FREE_BUILD
ORDINARY_SQUARE
ABELIAN_SURPRISE
COUNT_PRACTICE
PARIKH_NAME
AVOIDANCE_GAME
ALLOW_LENGTH_ONE
CONJECTURE_REVEAL
LONG_RANGE_DIFFICULTY
SEARCH_SPACE
FINITE_VS_INFINITE
RESEARCH_INVITATION
```

Each state should define:

```text
visible objects
narration
learner action
correctness rule
feedback
accessibility text
analytics event
next-state condition
```

## 6.3 No dead ends

A learner can always:

- replay;
- return one scene;
- continue;
- open explanation;
- switch mode.

## 6.4 Undo as learning

In the construction game, violations should not end the game.

Offer:

```text
Undo the last letter
Show another safe option
Explain this violation
Try again without help
```

Failure is part of the lesson.

---

# 7. Feedback design

Effective feedback should target the task and strategy, not the learner’s identity.

Avoid:

```text
You are wrong.
You are a genius.
```

Prefer:

```text
The left half contains one c,
but the right half contains none.
Their Parikh vectors differ.
```

## 7.1 Three feedback layers

### Layer 1 — visual

Highlight the relevant letters.

### Layer 2 — concise explanation

One or two sentences.

### Layer 3 — deeper explanation

Expandable detail, notation, or algorithm.

## 7.2 Feedback timing

Give feedback immediately after the learner commits to a classification or letter choice.

Do not reveal the answer while the learner is still deciding unless help is requested.

---

# 8. Scaffolding and adaptation

## 8.1 Help ladder

When a learner struggles:

1. highlight the two halves;
2. show the letter-count headings;
3. fill one count;
4. fill all counts;
5. explain the result.

Do not jump immediately to the full answer.

## 8.2 Fading support

As the learner succeeds:

- remove count tables;
- ask for mental comparison;
- introduce longer blocks;
- ask for explanation rather than classification.

## 8.3 Explanation prompt

After two successful classifications:

> How did you decide?

Options:

- I checked whether the halves were identical.
- I counted each letter.
- I checked only the first letter.
- I guessed.

Use the answer to correct strategy.

---

# 9. The construction game

The game should exist in two forms.

## 9.1 Guided tutorial game

Features:

- one new letter at a time;
- automatic witness explanation;
- undo;
- safe-letter hint;
- no score pressure;
- no timer.

## 9.2 Open laboratory game

Features:

- full word;
- candidate buttons;
- history;
- witness list;
- Parikh display;
- half-length display;
- export;
- reset;
- challenge mode.

## 9.3 Optional challenge types

```text
Reach length 20
Find a word where one letter is forced
Create an Abelian square intentionally
Find two different words with the same Parikh vector
Predict which letter will fail
```

## 9.4 Avoid misleading gamification

Do not frame the learner’s short word as progress toward solving the conjecture.

Avoid:

```text
You are 0.0001% closer to proving it.
```

Prefer:

> You have constructed a valid finite example.

---

# 10. Mathematical correctness requirements

## 10.1 Exact definitions

The tutorial must define the project class consistently:

```text
alphabet: {a,b,c}
forbidden: Abelian squares with half-length K >= 2
allowed: aa, bb, cc
```

## 10.2 Witness correctness

Every highlighted violation must be independently reproducible from:

```text
start index
half-length K
left block
right block
left Parikh vector
right Parikh vector
```

## 10.3 Search versus verifier

The interactive game may use an incremental suffix checker.

A separate reference verifier should be available in tests and should check:

- all positions;
- all half-lengths;
- all three letter counts.

## 10.4 Complexity wording

Allowed:

> A fixed interval count can be obtained in constant time using prefix sums.

Not allowed:

> The complete Abelian-square check is O(1).

## 10.5 Research status

Every statement about current knowledge should have:

- claim ID;
- status;
- source or project evidence;
- last-reviewed date.

---

# 11. Content labels

Use visible labels where appropriate:

```text
DEFINITION
EXAMPLE
TRY IT
OPEN PROBLEM
FINITE RESULT
RESEARCH NOTE
DEEPER MATHEMATICS
```

Do not make all labels visually loud.

The most important is:

```text
OPEN PROBLEM
```

on the conjecture.

---

# 12. Accessibility

Target at least WCAG 2.2 AA.

## 12.1 Keyboard

Every interaction must be possible using:

- Tab;
- Shift+Tab;
- Enter;
- Space;
- arrow keys where appropriate;
- Escape for closing detail panels.

## 12.2 Screen readers

Provide:

- semantic headings;
- live-region announcements;
- word and block descriptions;
- text equivalents for animations;
- accessible count tables;
- explicit labels for candidate letters.

Example announcement:

> Abelian square found from position 5 to position 8. Left half a b. Right half b a. Both contain one a and one b.

## 12.3 Reduced motion

Respect:

```css
prefers-reduced-motion
```

Provide an in-app toggle:

```text
Reduce motion
```

In reduced-motion mode:

- use instant state changes;
- retain highlights and brackets;
- do not remove information conveyed by animation.

## 12.4 Pause and replay

Any auto-running animation should have:

```text
Pause
Replay
Skip
```

## 12.5 Color

Do not rely only on color.

Use:

- labels;
- patterns;
- outlines;
- bracket shapes;
- icons;
- text.

## 12.6 Reading accessibility

Provide:

- Finnish plain-language mode;
- English mode;
- adjustable text size;
- clear line length;
- no text embedded only in images;
- glossary.

---

# 13. Sound and narration

Sound is optional and off or subtle by default.

Possible uses:

- a soft tone when a letter appears;
- matching tones for equal counts;
- a distinct but non-alarming cue for a violation.

Requirements:

- captions for narration;
- mute control;
- no information available only through sound;
- no sudden loud effects;
- no forced background music.

An optional sonification extension may map Parikh counts to sound, but it must be labeled as a representation, not a mathematical proof tool.

---

# 14. Teacher mode

## 14.1 15-minute demonstration

Scenes:

```text
0–5
8
11
```

Outcome:

- understand Abelian square;
- state the conjecture;
- distinguish finite from infinite.

## 14.2 45-minute lesson

Suggested flow:

```text
5 min    prediction and opening
10 min   ordinary and Abelian squares
10 min   learner classification
10 min   construction game
5 min    conjecture reveal
5 min    reflection
```

## 14.3 90-minute laboratory

Adds:

- student verifier design;
- deliberate bug examples;
- complexity discussion;
- independent checking;
- research challenge.

## 14.4 Teacher prompts

Examples:

> Is order always important in mathematics?

> What information is lost when we keep only letter counts?

> Why does checking a million letters not settle infinity?

> How could two programs make the same mistake?

> What would count as a proof?

## 14.5 Misconception guide

### Misconception

`ab|ba` is not repetition because the order differs.

### Response

Ask learners to count the letters in each half.

### Misconception

A very long valid word proves an infinite word.

### Response

Use the finite ruler versus infinity visualization.

### Misconception

Checking only the last four letters is enough.

### Response

Show a longer violation ending at the new letter.

### Misconception

If a computer says valid, the result is automatically trustworthy.

### Response

Introduce independent verification and hidden-bug examples.

---

# 15. Assessment checkpoints

The tutorial should assess understanding lightly and repeatedly.

## Checkpoint A — ordinary square

Learner recognizes:

```text
ab | ab
```

## Checkpoint B — Abelian equivalence

Learner recognizes:

```text
ab | ba
```

## Checkpoint C — Parikh comparison

Learner distinguishes equal and unequal count vectors.

## Checkpoint D — exact Mäkelä rule

Learner identifies allowed and forbidden examples.

## Checkpoint E — evidence calibration

Learner states what a long finite record proves.

## Exit reflection

Prompt:

> Explain Mäkelä’s conjecture in one or two sentences to someone who has never heard of it.

Possible optional AI or rule-based feedback should focus on missing concepts:

- three-letter alphabet;
- allowed double letters;
- longer Abelian squares forbidden;
- infinite word;
- open status.

Do not score writing style.

---

# 16. Privacy-respecting learning analytics

Analytics are optional and should be minimal.

Possible anonymous events:

```text
scene_started
scene_completed
hint_requested
classification_attempt
violation_explained
tutorial_completed
mode_selected
```

Do not collect by default:

- names;
- exact free-text answers;
- school identity;
- precise location;
- student IDs;
- persistent cross-site profiles.

If classroom research is conducted, use a separate ethics and consent protocol.

---

# 17. Technical architecture

## 17.1 Separate layers

```text
tutorial state machine
mathematical verifier
animation renderer
accessibility narration
content registry
analytics adapter
teacher controls
```

## 17.2 Mathematical core API

Example:

```ts
type Violation = {
  start: number;
  halfLength: number;
  left: string;
  right: string;
  leftParikh: [number, number, number];
  rightParikh: [number, number, number];
};

function findNewViolations(word: string): Violation[];

function verifyWholeWord(word: string): {
  valid: boolean;
  firstViolation?: Violation;
};
```

The tutorial renderer should never infer validity from animation state.

## 17.3 Deterministic examples

All scripted examples should have IDs:

```text
EXAMPLE-ORDINARY-001
EXAMPLE-ABELIAN-001
EXAMPLE-NONABELIAN-001
```

Unit tests should verify their declared status.

## 17.4 Content registry

Store narration and claims separately from animation code.

Example:

```yaml
scene_id: ABELIAN_SURPRISE
claim_ids:
  - DEF-ABELIAN-SQUARE-0001
content_type: DEFINITION
last_reviewed: 2026-08-05
```

---

# 18. Visual implementation details

## 18.1 Word layout

Letters should remain legible as the word grows.

Use:

- horizontal layout for short words;
- wrapping or zoom-out for medium words;
- focus window plus minimap for long words.

## 18.2 Brackets

A violation should be shown as:

```text
[ left half ][ right half ]
```

with:

- equal bracket widths;
- half-length label;
- matching count badges.

## 18.3 Count transfer animation

When explaining `ab|ba`:

1. duplicate or ghost letters into a count panel;
2. preserve the original word;
3. increment counters;
4. align equal totals;
5. reveal the term.

Do not physically sort the original word and erase its order.

## 18.4 Infinity reveal

Avoid showing infinity as simply the next large number.

Use a visual boundary:

```text
finite milestones | conceptual gap | infinity
```

---

# 19. Plain-text equivalent

Provide a fully usable non-animated route:

```text
/tutorial/plain
```

It should contain:

- the same examples;
- the same questions;
- text descriptions;
- keyboard interactions;
- no loss of mathematical content.

The plain version is also useful for:

- low-bandwidth users;
- printing;
- translation;
- screen readers;
- search indexing;
- teachers.

---

# 20. Optional deeper modules

These should not interrupt the core story.

## 20.1 How the computer checks

- prefix sums;
- suffix-only incremental checking;
- independent full verification.

## 20.2 Why four letters are different

- careful historical introduction;
- Keränen’s construction;
- no implication that cyclic symmetry alone proves avoidance.

## 20.3 Search tree laboratory

- branch choices;
- pruning;
- exponential growth;
- exact versus heuristic.

## 20.4 D40 local dictionary

- local windows;
- what a dictionary can remember;
- what it can forget;
- local versus global constraints.

## 20.5 Research integrity laboratory

- faulty verifier;
- hidden invalid record;
- checkpoint bug;
- misleading complexity claim.

---

# 21. Bridge into real project participation

At the end, offer role-specific next steps.

## For a curious visitor

```text
Play again
Read the story
Explore examples
```

## For a student

```text
Verify a small word
Find a minimal obstruction
Complete a challenge packet
```

## For a programmer

```text
Audit the verifier
Implement it in another language
Test edge cases
```

## For a teacher

```text
Download the lesson
Open teacher mode
View misconceptions
```

## For a researcher

```text
Read the evidence status
Open research questions
Inspect artifacts
Propose a replication
```

---

# 22. Research and claim safeguards

## 22.1 Tutorial computation status

Label interactive output:

```text
EDUCATIONAL LOCAL COMPUTATION
```

## 22.2 Authoritative result status

A project result becomes authoritative only through:

```text
archived run
manifest
checksum
independent verification
claim entry
```

## 22.3 Dynamic research content

If the tutorial displays a current record or status:

- fetch it from a versioned project registry;
- show the snapshot date;
- show a claim ID;
- handle unavailable data gracefully;
- do not hard-code unsupported claims into narration.

---

# 23. User testing

Test with at least these groups:

```text
young learner with no advanced mathematics
secondary mathematics student
undergraduate student
teacher
software developer
screen-reader user
keyboard-only user
user with reduced-motion preference
non-native language user
research mathematician
```

## 23.1 Test questions

- When did the learner first understand the difference between ordinary and Abelian squares?
- Did the animation help or distract?
- Can the learner state the conjecture?
- Does the learner understand why `aa` is allowed?
- Does the learner overinterpret finite computation?
- Can the learner find and explain a highlighted witness?
- Can the learner navigate without a mouse?
- Can the learner stop all motion?

---

# 24. Common design failures to avoid

## Failure 1 — Starting with a definition wall

Result:

- high cognitive load;
- low curiosity;
- unclear motivation.

## Failure 2 — Turning the tutorial into a dashboard

Do not expose every project module at the beginning.

## Failure 3 — Using color as the only explanation

This excludes users and weakens conceptual clarity.

## Failure 4 — Showing sorted halves only

This can hide the important fact that original order differs.

## Failure 5 — Making mistakes punitive

A violation should become an explanation, not a game-over screen.

## Failure 6 — Suggesting finite records approach infinity

Never use progress bars toward solving the conjecture.

## Failure 7 — Excessive animation

Motion should explain transformations, not decorate them.

## Failure 8 — Hiding the open status

The conjecture must be visibly labeled open.

## Failure 9 — Letting the animation define the mathematics

The verifier and tests define correctness.

## Failure 10 — Collecting educational data casually

Classroom use is not automatic permission for research data collection.

---

# 25. MVP implementation

## MVP 1 — Concept prototype

Scenes:

```text
0–5
7–8
11
```

Features:

- manual progression;
- static transitions;
- three classification questions;
- accessible text;
- no open game yet.

## MVP 2 — Guided construction game

Add:

- letter buttons;
- exact violation witness;
- undo;
- explanatory feedback;
- full-word reference tests.

## MVP 3 — Research story

Add:

- search tree;
- finite versus infinite;
- research methods;
- project invitation.

## MVP 4 — Accessibility and teacher mode

Add:

- reduced motion;
- narration;
- captions;
- plain route;
- teacher controls;
- lesson timing variants.

## MVP 5 — Project integration

Add:

- claim IDs;
- evidence registry;
- challenge links;
- dynamic status snapshot;
- translations.

---

# 26. Acceptance criteria

The tutorial is ready for public release when:

- [ ] a first-time learner can explain an Abelian square;
- [ ] the learner sees the difference between order and counts;
- [ ] the exact Mäkelä rule is stated correctly;
- [ ] `aa`, `bb`, and `cc` are clearly shown as allowed;
- [ ] every interactive witness is mathematically correct;
- [ ] the incremental checker agrees with the independent verifier on exhaustive short tests;
- [ ] finite computation is not presented as evidence of infinity;
- [ ] every major animation can be paused, replayed, or skipped;
- [ ] reduced-motion mode preserves all information;
- [ ] keyboard navigation is complete;
- [ ] screen-reader equivalents exist;
- [ ] the plain-text tutorial is complete;
- [ ] teacher mode has discussion prompts and timing plans;
- [ ] research claims have IDs and review dates;
- [ ] educational analytics are minimal and privacy-respecting;
- [ ] user testing includes learners and accessibility users.

---

# 27. Suggested opening script

The screen is empty.

A letter appears:

```text
a
```

Text:

> This is enough to begin.

Pause.

> We are going to build a word.

Two more letters appear:

```text
b   c
```

Text:

> You have only three letters.

> You may use them as many times as you like.

Button:

```text
Choose the next letter
```

After several choices:

> Words can contain repetitions.

Show:

```text
ab | ab
```

> Sometimes the repetition is easy to see.

Transform to:

```text
ab | ba
```

> Sometimes it hides in the order.

Count both halves.

> The order changed.

> The number of each letter did not.

Reveal:

> This is an Abelian square.

Continue through examples.

Then reveal:

> Now allow only the shortest ones:

```text
aa
bb
cc
```

> Avoid every longer Abelian square.

Clear screen.

> Can the word continue forever?

Reveal title:

# Mäkelä’s conjecture

Label:

```text
OPEN PROBLEM
```

---

# 28. Suggested closing script

> The rule fits on one screen.

> Its consequences reach across the entire history of the word.

> A computer can search, test, and discover.

> A proof must explain why every possible failure is impossible — forever.

Then:

> This project is open.

> You can learn from it, test it, break it, improve it, teach with it, or help verify its results.

Buttons:

```text
Build a word
See the mathematics
Try a research challenge
Open teacher materials
```

Final line:

> **A good mathematical problem can be understood in minutes and explored for a lifetime.**

---

# 29. Evidence-informed design references

These references guide the pedagogical and accessibility design. They do not validate mathematical claims about Mäkelä’s conjecture.

## Universal Design for Learning

CAST, Universal Design for Learning Guidelines 3.0:

- engagement;
- representation;
- action and expression;
- learner agency;
- reduction of unnecessary barriers.

https://udlguidelines.cast.org/

## Web accessibility

W3C, Web Content Accessibility Guidelines 2.2:

- keyboard access;
- text alternatives;
- navigability;
- pausing and stopping moving content;
- reduced motion;
- timing control.

https://www.w3.org/TR/WCAG22/

## Formative feedback

Education Endowment Foundation, *Teacher Feedback to Improve Pupil Learning*:

- feedback should address current understanding;
- feedback should help the learner move forward;
- the design principle matters more than whether feedback is written or verbal.

https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback

## Worked examples and self-explanation

Institute of Education Sciences, *Organizing Instruction and Study to Improve Student Learning*:

- interleave worked examples with learner activity;
- prompt learners to explain reasoning;
- organize material into manageable steps.

https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/20072004.pdf

## Technology-supported representation

Institute of Education Sciences guidance on educational technology supports presenting material in multiple ways and using interactive modules to develop mental representations and test understanding.

https://ies.ed.gov/ncee/wwc/Docs/practiceguide/wwc-using-tech-postsecondary-summary.pdf

---

# 30. Final design principle

The tutorial should not feel like a lecture about a finished mathematical object.

It should feel like the learner is watching a problem come into existence.

```text
First there is one letter.

Then there is choice.

Then repetition.

Then repetition in disguise.

Then a rule.

Then a game.

Then a question about forever.

Then an open door into research.
```

The best version of this tutorial will make the learner think:

> “I understand the question.”

Then:

> “I see why it is difficult.”

And finally:

> “Perhaps I could try something.”
