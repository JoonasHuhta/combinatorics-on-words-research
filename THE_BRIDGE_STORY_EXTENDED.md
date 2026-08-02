# The Bridge Over Infinite Sequences (The B16 Mystery)

Imagine we are standing at the edge of an infinitely wide, bottomless chasm. Our mission is to build a bridge across it.

We have only three types of building blocks at our disposal: **Wood (a)**, **Stone (b)**, and **Iron (c)**.

However, the laws of physics in this universe are extremely unforgiving. The entire chasm is in a state of constant harmonic vibration. Therefore, the master engineers have laid down an absolute rule: **The bridge must never contain two consecutive sections that are structurally identical.** 

If any two adjacent sections of the bridge have the exact same weight, and the exact same amounts of Wood, Stone, and Iron, a devastating resonance will build up. The bridge will instantly shatter and collapse into the abyss.

### Chapter 1: The Pure Abelian Failure & The Mäkelä Mystery

Before we begin, we test the strictest possible rule: *never two consecutive identical sections, not even a single block long.* This fails almost immediately — after 7 blocks, every subsequent choice creates a repetition. This is an old, indisputable fact, known long before Mäkelä: a bridge of three materials can never be completely square-free.

Mäkelä proposed a more subtle question in 2002: *what if we allow a single block repetition (`aa`, `bb`, `cc` are OK), but forbid anything longer?* This is a much more promising starting point — but for over twenty years, **no one has been able to prove either way** whether an infinite bridge can succeed under this rule. This unresolved question is the true starting point of the B16 research: we do not start from a collapsed bridge, but from a bridge whose fate is unknown.

### Chapter 2: The Master Blueprint (Rao & Rosenfeld)

Years later, master architects return with a mathematical proof: an infinite bridge over the chasm *is* possible! But their blueprint is incredibly complex.

They realize that simply counting the raw materials isn't enough. The structural integrity also depends heavily on the **joints**—how the blocks are connected to each other.

Since there are 3 materials, there are exactly 9 possible types of joints (Wood-Wood, Wood-Stone, Stone-Iron, etc.). We call these **bigrams**.

The master architects introduce a new, much stricter rule: **The 2-abelian rule**. Now, two adjacent sections are considered "structurally identical" only if they have the exact same amounts of raw materials AND they are connected to each other using the exact same amounts of *every single one of the 9 joint types*.

By strictly monitoring all 9 joint types simultaneously, the harmonic resonance is completely defeated. The bridge can be extended infinitely without ever collapsing!

### Chapter 3: The Builders' Temptation (The B16 Problem)

The master blueprint works perfectly on paper, but for the workers on the ground, monitoring all 9 joint types simultaneously is an absolute nightmare. The complexity and bureaucracy are overwhelming.

The builders ask a natural question: *"Do we really need to monitor all 9 joints?"*

What if we only monitor the 3 or 4 most critical joint types, and let nature handle the rest? Surely, at some point, the bridge becomes strong enough to reach infinity? Is there a "magic switch"—a specific, smaller combination of joint constraints that suddenly unlocks the infinite structure?

This unknown, uncharted territory between the collapsing 1-abelian bridge (0 joints monitored) and the infinite 2-abelian bridge (9 joints monitored) is a mystery known as **B16**.

### Chapter 4: Nature Finds a Crack (The Experiment)

We decide to run massive computer simulations to test every single possible combination of joint constraints. We build the bridge while monitoring just 1 joint... then 2... then 3... then 4... then 5.

Each time, we measure how many valid paths the bridge can take up to a certain distance (16 blocks). Its "strength value" ($p(16)$) grows. But does adding these rules guarantee an infinite bridge, or just delay the inevitable collapse?

Why does the strength vary so wildly? Because nature is like water finding the smallest crack in a rock face. If you leave even a single joint type unregulated, the unforgiving laws of combinatorics will force the construction into a state where it overuses that exact free joint. The bridge loses its balance, the resonance amplifies, and the number of valid paths plummets.

There seems to be no magic switch. The strength of the bridge grows agonizingly slowly, like climbing a steep staircase:
- Monitoring purely materials (0 joints) yields a tiny fraction, about **2.89%** of the required strength.
- Monitoring 2 joints yields **39.7%**.
- Monitoring 3 joints yields **72.6%**.
- Monitoring 4 joints yields **84.7%**.
- Even monitoring 5 joints yields only **93.1%**.

Every time you try to cut corners, nature punishes you.

### Chapter 5: The Breakthrough (The Sixth Joint)

Just as the builders are about to lose hope, they test the combinations of **6 joints**.

Suddenly, the strength of the bridge skyrockets to an unfathomable level! It leaps from 93.1% straight to **99.92%** of the full 9-joint strength. The bridge reaches extremely close to the full 2-abelian structure within this measured window.

But the experiment reveals a harsh condition. Not just *any* 6 joints will work. If the builders choose the wrong 6 joints to monitor, the bridge remains weak and collapses rapidly.

The computer reveals the secret: out of all 84 possible ways to choose 6 joints, there is exactly **one** unique, highly symmetrical combination that triggers this massive spike in strength.

What is this magical combination of six?
`Wood-Stone, Wood-Iron, Stone-Wood, Stone-Iron, Iron-Wood, Iron-Stone`

Notice what three joints are missing from the list?
`Wood-Wood, Stone-Stone, Iron-Iron`

The deep structural secret of the architecture is finally revealed: **Nature allows you to be careless with identical materials.** You don't need to monitor how often you place Wood next to Wood, or Iron next to Iron (`aa, bb, cc`).

But the very second the material transitions to another—the mixed joints—the bridge is at its most vulnerable. You must strictly and flawlessly monitor **every single mixed joint** (`ab, ac, ba, bc, ca, cb`).

If you respect this rule, the bridge achieves almost the exact same strength as the master blueprint, at least as far as we can see.

### Chapter 6: The Horizon

Sixteen blocks is a fine place to stop and celebrate. But the builders, curious, keep watching the bridge as it stretches further — from 16 blocks out to 22, and beyond. Two things happen, and they are opposites of each other.

**The Free Joint, proven.** The builders ask: what if we watch only *eight* of the nine joints, and leave one completely unguarded? At every length from 16 to 22, with no exception, the bridge is **bit-for-bit identical** to the full nine-joint blueprint.
This turns out not to be luck at all — it can be proven with nothing more than counting. Every material used must eventually connect to *something*: the total number of times Wood is used is fixed, and so is the total number of times each material is used *last*. Watch eight of the nine joints, and those simple bookkeeping facts leave the ninth joint with no freedom left — it is arithmetically forced. **This is true forever, at every length, not just up to 22.** The ninth joint was never truly free; it just looked that way.

**The Golden Six, a deepening mystery.** The Golden Six from Chapter 4 does not enjoy the same certainty. As the bridge grows from 16 to 23 blocks, its strength — 99.92% at 16 — begins to show hairline fractures: 99.88%, 99.83%, 99.78%, 99.71%, 99.64%, 99.56%, and by 23 blocks, 99.47%. Small, but the cracks are *widening* with each new block, not closing.

The builders then deploy an advanced diagnostic tool—measuring the theoretical upper bounds of the bridge's growth capacity based on finite local structures. The results are decisive: the Golden Six constraint *strictly forbids more structure* than the full nine-joint blueprint. The gap between them is not a statistical illusion; it is a mathematical reality built into the sequence.

Nobody yet knows whether the Golden Six eventually collapses a thousand blocks from now, or whether it walks the tightrope forever, just slightly thinner than its perfect sibling. 

*One mystery solved for good. One mystery deepened, and still wide open. That is what real research looks like.*

### Chapter 7: The Anatomy of the Gap

Chapter 6 leaves an open wound: the Golden Six is not the master blueprint, but nobody has pinned down *exactly* what slips through the six-joint net that the nine-joint net catches. Not a percentage — the specific sections.

**Naming the crack.** Call a pair of adjacent sections `U` and `V` a **separating pair** if they agree on everything the Golden Six watches — identical materials, identical amounts of every mixed joint (`ab, ac, ba, bc, ca, cb`) — but disagree on at least one same-material joint (`aa, bb, cc`). A separating pair is exactly a place where the Golden Six shrugs and the master blueprint objects. It is the entire difference between the two rules, named precisely rather than measured statistically.

**The bookkeeping trick, run on two sections at once.** Chapter 6's proof about the ninth joint rested on one fact: a section's total material counts, together with its very first and very last block, pin down every one of its nine joint counts once eight are already known — because every joint-count row and column sums to a quantity fixed by those totals, with only the first/last block breaking the tie. Applying that same accounting to `U` and `V` together, rather than to one section alone, gives more than an existence proof — it gives the exact shape of every separating pair:

> `U` and `V` form a separating pair **if and only if** `U` starts and ends on the same material `p`, `V` starts and ends on the same material `q`, and `p` differs from `q`. When that holds, the mismatch is forced to a precise size: exactly one extra block of material `p` counted in `U`'s own-material joint versus `V`'s, exactly one fewer of material `q`, and the third material's own-material joint count matching exactly. The gap can never be larger than that, and it can never be smaller once `p ≠ q` holds.

A direct consequence: no separating pair can exist with fewer than 4 blocks per side — the "starts and ends on the same material" condition has no room to bite at shorter lengths. At exactly 4 blocks per side, there are precisely **six** separating pairs, one symmetry family under relabelling which two materials play `p` and `q`. This characterisation was checked exhaustively against brute-force enumeration for sections up to 7 blocks per side, with **zero exceptions** — not as the proof itself (the bookkeeping argument above is the proof, and it holds at every length), but as a check that the derivation was transcribed correctly into code.

**Where the cracks actually live.** This raises the obvious next question: does the master blueprint's own known infinite bridge — the one genuinely infinite construction anyone has ever built, assembled by applying a fixed 5-block coding to Keränen's own 85-letter template — happen to avoid separating pairs? If it did, that single bridge would satisfy the Golden Six as well as the full nine-joint rule, which would be a remarkable and immediately useful coincidence.

It does not get that lucky, and it is not close. Scanning the first 36,125 blocks of that construction (the same stretch already used elsewhere in this project as a positive control for the nine-joint rule) finds **2,167** separating pairs, the first just 3 blocks in. Over 5% of all starting positions in that stretch begin one, and the largest gap between consecutive occurrences never exceeds 95 blocks. Every one of these, by construction, satisfies the full nine-joint rule (as it must — this is the same bridge Chapter 2's architects certified) while simultaneously violating the Golden Six. The crack is not a rare defect hiding far downstream; it is a routine, recurring feature of the only bridge anyone actually knows how to build, appearing roughly every 18 blocks on average.

**What this settles, and what it very much does not.** The anatomy of the gap between the two rules is now exact, not statistical: we know precisely which section-pairs separate them, we know the mismatch is always minimal (a single block's worth, moved between two materials), and we know the master blueprint's own construction is laced with these pairs rather than avoiding them by luck. What this does *not* do is answer Chapter 6's open question. A single known bridge being riddled with these cracks says nothing about whether the Golden Six's *own* bridge survives to infinity under its own, stricter rule — that single bridge was never built to satisfy the Golden Six in the first place, so its failure to do so is not evidence either way. It also says nothing about how the two rules' growth rates compare in the limit. Those questions remain exactly as open as Chapter 6 left them. Naming a crack precisely is a different achievement from knowing whether it eventually brings the structure down — a useful one, but not that one.

*One mystery solved for good. One mystery mapped in exact, load-bearing detail — and still unsolved. That is what real research looks like, twice over.*
