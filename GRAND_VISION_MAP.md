# Grand Vision Map: Experimental Combinatorics Laboratory

*This document captures the ambitious, long-term architectural visions for transforming this project from an "AA2FR Abelian Square Visualizer" into a generalized, world-class research platform for Combinatorics on Words.*

---

## The Paradigm Shift
The core realization is that the project has reached the limits of its utility as a single-problem visualizer. To generate new mathematics, the platform must evolve into an **Experimental Combinatorics Laboratory**—a "Research OS" that helps humans and algorithms co-discover structural patterns, formulate hypotheses, and stress-test them through massive parallel search.

---

## 1. Universal Constraint Engine (The Core Generalization)
Currently, the search engine is hardcoded to solve the AA2FR problem (aa2f + 6 forbidden factors). 
**Vision:** Rewrite the Web Worker so the DFS algorithm is entirely ignorant of the mathematics. It simply asks a `ConstraintEngine` if a sequence is valid.
*   **Constraints as Modules:** `AbelianSquareConstraint(minHalfLen=2)`, `ForbiddenFactorConstraint(['baac', ...])`, `MaximumRunConstraint(2)`.
*   **Impact:** The same DFS engine can suddenly be used to explore fractional powers, De Bruijn sequences, and any other pattern avoidance problem.

## 2. Mission Control & Research Dashboard
A new landing page (Tab 1) that acts as the command center for the project.
*   **Active Mission:** The current research question (e.g., "Does Parikh balance predict survival?").
*   **Global Statistics:** Number of experiments run, longest words found, active hypotheses.
*   **Research Roadmap:** A living document of what the platform is currently investigating.

## 3. Search Observatory (The Physics of Search)
Stop visualizing just the "longest word" and start visualizing the **Search Space Geometry**.
*   **Metrics:** Branching factor, tree width, average subtree depth, entropy, dead-end density.
*   **Search "Genomes":** Record the behavior of a search over time (e.g., branching factor at depth X). This allows clustering searches into "Species" (e.g., "Deep Tunnelers", "Early Collapsers").
*   **Phase Transitions:** Treat search like a physical system. Is there a critical "temperature" (Parikh imbalance) where the search tree collapses?

## 4. Discovery Engine & Hypothesis Generation
The program transitions from observing data to suggesting research questions.
*   **Statistical Mining:** "Suffix `abcbca` strongly correlates with a branching factor < 1.1."
*   **Automatic Conjecture Generator:** The system mines millions of observations and proposes hypotheses. It does not claim "proof", but rather flags "statistically significant correlations requiring human review."

## 5. Constraint Analysis Engine (The "Why" Debugger)
Instead of just saying a letter is illegal, build an **Explanation Tree**.
*   `c -> allowed by forbid4 -> creates h=6 abelian square -> caused by equality of Parikh vectors [2,3,1] -> rejected.`
*   This acts as a mathematical debugger for researchers trying to understand the exact mechanics of an obstruction.

## 6. Strategy Laboratory & Evolution
Move beyond standard DFS. 
*   **Benchmarking:** Compare Priority DFS, Beam Search, Monte Carlo, and Adaptive heuristics.
*   **Evolution Simulator:** Let the program mutate and breed heuristics using a genetic algorithm. The fitness function rewards deep searches and low dead-end frequencies.
*   **Automatic Strategy Designer:** "IF branching < 2 AND Parikh imbalance > 0.08 THEN prefer 'c'".

## 7. Morphism Laboratory
A dedicated environment for designing and analyzing morphisms.
*   Input a substitution rule (`a -> ab, b -> ba`).
*   The lab automatically calculates incidence matrices, eigenvalues, growth rates, square-freeness, and Parikh balance.
*   **Morphism Evolution:** Use genetic algorithms to breed new almost-square-free morphisms instead of relying on manually constructed ones (like Keränen's g109).

## 8. Theorem Stress Test
A sandbox for trying to break hypotheses.
*   Input: "Every suffix `abcbca` dies within 25 steps."
*   The engine spins up millions of branches specifically trying to escape the trap.
*   Output: Either a definitive counterexample (with exact seed and depth) or a statistical confidence report.

---

## Long-Term Goal
To create a web-based infrastructure so robust that researchers can state in published papers: 
> *"All experiments were performed using the Experimental Combinatorics Laboratory. The platform provided deterministic search, distributed verification, motif statistics, automated replication, and hypothesis management."*
