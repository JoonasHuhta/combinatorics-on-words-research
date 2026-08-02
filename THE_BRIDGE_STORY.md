# The Bridge Over Infinite Sequences: The B16 Mystery

Imagine we are standing at the edge of an infinitely wide, bottomless chasm. We want to build a bridge across it.

We have only three types of building blocks at our disposal: **Wood (a)**, **Stone (b)**, and **Iron (c)**.

However, the laws of physics in this universe are extremely strict. The bridge is highly sensitive to harmonic resonance. The fundamental rule is: **The bridge must never contain two consecutive sections that are "structurally identical".**

If any two adjacent sections of the bridge contain the exact same amounts of Wood, Stone, and Iron, a resonance will build up and the bridge will instantly collapse.

## Chapter 1: The Pure Abelian Failure & The Mäkelä Mystery

Before we begin, we test the strictest possible rule: *never two consecutive identical sections, not even a single block long.* This fails almost immediately — after 7 blocks, every subsequent choice creates a repetition. This is an old, indisputable fact, known long before Mäkelä: a bridge of three materials can never be completely abelian square-free (anagram repetition-free).

Mäkelä proposed a more subtle question in 2002: *what if we allow a single block repetition (`aa`, `bb`, `cc` are OK), but forbid anything longer?* This is a much more promising starting point — but for over twenty years, **no one has been able to prove either way** whether an infinite bridge can succeed under this rule. This unresolved question is the true starting point of the B16 research: we do not start from a collapsed bridge, but from a bridge whose fate is unknown.

## Chapter 2: The Master Blueprint (Rao & Rosenfeld / Theorem 65)

Years later, master architects prove that an infinite bridge over the chasm *is* possible! But their blueprint is incredibly complex. 

They realize that just counting the raw materials isn't enough. The structural integrity also depends on the **joints**—how the blocks are connected to each other. 

Since there are 3 materials, there are exactly 9 possible types of joints (Wood-Wood, Wood-Stone, Stone-Iron, etc.). We call these **bigrams**.

The master architects introduce a new, much stricter rule: **The 2-abelian rule**. Now, two adjacent sections are considered "structurally identical" only if they have the exact same amounts of raw materials AND the exact same amounts of *every single one of the 9 joint types*.

By monitoring and restricting all 9 joint types, the harmonic resonance is completely defeated. The bridge can be extended infinitely without ever collapsing!

## Chapter 3: The Builders' Temptation (The B16 Problem)

The master blueprint works perfectly, but for the builders on the ground, monitoring all 9 joint types simultaneously is an absolute nightmare. The complexity is overwhelming.

The builders ask a natural question: *"Do we really need all 9 joints?"*

What if we only monitor the 3 most important joint types, and let nature handle the rest? Surely, at some point, the bridge becomes strong enough to reach infinity? Is there a "magic switch"—a specific combination of just a few joint constraints that suddenly unlocks the infinite structure?

This unknown territory between the mysterious Mäkelä 1-abelian bridge (0 joints monitored, open problem) and the infinite 2-abelian bridge (9 joints monitored, proven) is the **B16 Lattice**.

## Chapter 4: Nature Finds a Crack (The Experiment)

We decide to run massive computer simulations to test every possible combination of joint constraints. We build the bridge while monitoring 1 joint type... then 2... then 3... then 4... then 5.

Each time, we measure how many valid paths the bridge can take up to a certain distance (16 blocks). Its "strength value" ($p(16)$) grows. But does adding these rules guarantee an infinite bridge, or just delay an inevitable collapse?

Why does the strength vary so wildly? Because nature is like water finding the smallest crack in a rock. If you leave even a single joint type unregulated, the unforgiving laws of combinatorics will force the construction into a state where it overuses that exact unregulated joint. The bridge becomes unbalanced, the resonance builds, and the number of valid paths plummets.

There is no magic switch. The strength of the bridge grows in a grueling, slow staircase:
- Monitoring 3 joints yields only 72% (using 3 joints) of the required asymptotic strength.
- Monitoring 4 joints yields 84% (using 4 joints).
- Monitoring 5 joints yields 93% (using 5 joints).

Every time you ignore a rule, nature immediately punishes you.

## Chapter 5: The Breakthrough (The Sixth Joint)

Just as the builders are about to lose hope, they test the combinations of **6 joints**.

Suddenly, the strength of the bridge skyrockets! It leaps from 93% straight to 99.92% of the full 9-joint strength. It reaches extremely close to the full 2-abelian structure within this measured window.

But there is a catch. Not just *any* 6 joints will work. If the builders choose the wrong 6 joints, the bridge remains as weak as before (collapsing even faster than with 5 joints). Nature still finds the crack.

The computer reveals the secret: out of all 84 possible ways to choose 6 joints, exactly **one** specific combination unlocks this massive leap in strength.

What is this magical combination?
`Wood-Stone, Wood-Iron, Stone-Wood, Stone-Iron, Iron-Wood, Iron-Stone`

Notice what is missing: `Wood-Wood, Stone-Stone, Iron-Iron`.

The grand secret of the architecture is revealed: **Nature allows you to be careless with identical materials.** You don't need to monitor how often Wood connects to Wood, or Iron connects to Iron. But the moment you transition from one material to another, the structure is vulnerable. You must strictly monitor *every single mixed joint*. 

If you do that, the bridge achieves almost the exact same strength as the master blueprint, at least as far as we can see.

## Chapter 6: The Horizon

Sixteen blocks is a fine place to stop and celebrate. But the builders, curious, keep watching the bridge as it stretches further — from 16 blocks out to 22, and beyond. Two things happen, and they are opposites of each other.

**The Free Joint, proven.** The builders ask: what if we watch only *eight* of the nine joints, and leave one completely unguarded? At every length from 16 to 22, with no exception, the bridge is **bit-for-bit identical** to the full nine-joint blueprint.
This turns out not to be luck at all — it can be proven with nothing more than counting. Every material used must eventually connect to *something*: the total number of times Wood is used is fixed, and so is the total number of times each material is used *last*. Watch eight of the nine joints, and those simple bookkeeping facts leave the ninth joint with no freedom left — it is arithmetically forced. **This is true forever, at every length, not just up to 22.** The ninth joint was never truly free; it just looked that way.

**The Golden Six, a deepening mystery.** The Golden Six from Chapter 4 does not enjoy the same certainty. As the bridge grows from 16 to 23 blocks, its strength — 99.92% at 16 — begins to show hairline fractures: 99.88%, 99.83%, 99.78%, 99.71%, 99.64%, 99.56%, and by 23 blocks, 99.47%. Small, but the cracks are *widening* with each new block, not closing.

The builders then deploy an advanced diagnostic tool—measuring the theoretical upper bounds of the bridge's growth capacity based on finite local structures. The results are decisive: the Golden Six constraint *strictly forbids more structure* than the full nine-joint blueprint. The gap between them is not a statistical illusion; it is a mathematical reality built into the sequence.

Nobody yet knows whether the Golden Six eventually collapses a thousand blocks from now, or whether it walks the tightrope forever, just slightly thinner than its perfect sibling. 

*One mystery solved for good. One mystery deepened, and still wide open. That is what real research looks like.*

## Chapter 7: The Anatomy of the Gap

Chapter 6 leaves an open wound: the Golden Six is not the same as the master blueprint, but nobody has ever pinned down *exactly* what slips through the six-joint net that the nine-joint net catches. Not "roughly how much" — which specific sections.

**Naming the crack.** Call a pair of adjacent sections `U` and `V` a **separating pair** if they agree on everything the Golden Six watches — same materials, same amounts of every mixed joint — but disagree on at least one same-material joint (`Wood-Wood`, `Stone-Stone`, or `Iron-Iron`). A separating pair is exactly a place where the Golden Six shrugs and the master blueprint objects. It is the entire difference between the two rules, named precisely instead of measured statistically.

**The bookkeeping trick strikes again.** Chapter 6's proof about the ninth joint used a simple fact: every section's first and last block, together with its total material counts, pin down every joint count once eight of nine are known. Running the same bookkeeping on `U` and `V` side by side gives something sharper than a proof of existence — it gives the *shape* of every separating pair, with no search required:

> `U` and `V` form a separating pair if and only if `U` starts and ends with the same material `p`, `V` starts and ends with the same material `q`, and `p` is not `q`. When this happens, the mismatch is always exactly one block too many of material `p` in `U` compared to `V`, one block too few of material `q`, and the third material's count matches exactly.

No separating pair can be shorter than 4 blocks per side — shorter sections simply cannot satisfy this shape. At exactly 4 blocks per side, there are precisely six of them, one family related by swapping which two materials play the roles of `p` and `q`. This was checked exhaustively up to 7 blocks per side with zero exceptions to the rule above — not as the proof itself, but as a check that the bookkeeping was transcribed correctly.

**Where the cracks actually live.** This raises an obvious question: does the master blueprint's own known infinite bridge — the one real infinite construction anyone has ever built — contain separating pairs at all? If it didn't, that single bridge would happen to satisfy the Golden Six too, which would be enormous news.

It does not get that lucky. Inspecting the first 36,125 blocks of the master blueprint's construction turns up **2,167** separating pairs — the very first one just 3 blocks in. Over 5% of all positions in that stretch sit at the start of one, and no gap between consecutive occurrences ever exceeds 95 blocks. The crack is not a rare pathology hiding somewhere far out; it is a routine, recurring feature of the only bridge anyone actually knows how to build.

**What this settles, and what it very much does not.** The anatomy of the gap is now exact: we know precisely which pairs of sections separate the two rules, and we know the master blueprint's construction is laced with them rather than avoiding them by accident. What this does *not* do is answer Chapter 6's open question. A single known bridge being full of these cracks says nothing about whether the Golden Six's *own* bridge survives to infinity, and nothing about how its growth rate compares to the master blueprint's in the limit — those remain exactly as open as Chapter 6 left them. Naming a crack precisely is not the same as knowing whether it eventually brings the whole structure down.

*One mystery solved for good. One mystery mapped in exact detail, but still unsolved. That is what real research looks like, twice over.*
