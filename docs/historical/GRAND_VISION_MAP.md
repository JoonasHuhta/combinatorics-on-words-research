# Grand Vision & Scientific Roadmap: The Experimental Combinatorics Laboratory

*This document captures the architectural visions, methodological principles, and exact scientific execution roadmap for transforming this project from an interactive visualizer into a world-class research platform for Combinatorics on Words.*

---

## 1. Historical & Mathematical Coordinates: Mäkelä's Conjecture (2002)

A critical milestone in the evolution of this platform is anchoring our computational experiments to published mathematical literature:
* **The Core Problem (`aa2f`):** Asking whether there exists an infinite ternary word over $\{a,b,c\}$ avoiding abelian squares of half-length $k \ge 2$ (while permitting period-1 squares like $00, 11, 22$) is literally **Mäkelä's Conjecture**, formulated by Sami Mäkelä in 2002.
* **Current State of Literature:** Rao & Rosenfeld (CNRS / ENS Lyon, 2015–2018) proved partial results: abelian squares with period $>5$ are avoidable on a ternary alphabet. However, simultaneously avoiding periods $2, 3, 4, 5$ forever remains an **open problem**.
* **The `aa2fr` Restricted Variant:** Our extended condition `aa2fr` enforces 6 additional forbidden factors (`baac`, `caab`, `abbc`, `cbba`, `accb`, `bcca`). While such restrictions appear in Veikko Keränen's 4-letter morphisms ($g_{85}$ and $g_{109}$), their impact on the ternary Mäkelä conjecture must be empirically evaluated rather than assumed.

---

## 2. Methodological Rigor & Epistemology

In Combinatorics on Words, mathematical truth is established through **exhaustive finite verification**, not probabilistic sampling. To maintain absolute scientific integrity, our platform adheres to strict epistemological rules:

1. **Search Pruning Heuristics vs. Hypotheses:** 
   Statistical survival rates (e.g., Wilson-score mortality intervals) derived from finite DFS runs do **not** constitute scientific hypotheses or candidate proofs. They are categorized strictly as **Search Pruning Heuristics** designed to guide branch priority in depth-first search.
2. **The Verification Pipeline:**
   ```
   Raw Search Events (DFS / Backtracking)
           ↓
   Search Pruning Heuristics (Branch priority & dead-end density scoring)
           ↓
   Candidate Morphism Mining (Extracting recurrent self-similar substitutions)
           ↓
   Exhaustive Finite Verification (Rao & Rosenfeld bounded incidence checking)
           ↓
   Certified Mathematical Theorem (100% unconditional avoidability proof)
           ↓
   Independent Peer Replication (SAT / CaDiCaL UNSAT certification)
   ```

---

## 3. The 5-Point Scientific Execution Roadmap

Our immediate development architecture is governed by five prioritized pillars designed to produce publishable mathematical insights:

### Pillar 1: Reframing Statistical Engines ("Search Pruning Heuristics")
* **Objective:** Cleanse all UI, code, and reporting documentation of terms like "hypothesis", "falsified", or "candidate proof" when referring to statistical sampling.
* **Implementation:** Rename the existing statistical tracking modules to `SearchPruningHeuristics`. Explicitly label confidence intervals as priority scoring metrics that guide computational resources without claiming formal proof.

### Pillar 2: Fair Comparative Benchmark (`aa2f` vs. `aa2fr`)
* **Objective:** Conduct a scientifically rigorous comparison between pure Mäkelä's Conjecture (`aa2f`) and the restricted variant (`aa2fr`) using our Parikh-balanced Web Worker engine.
* **Architecture (`ComparativeBenchmarkEngine`):**
  * **Deterministic Budgeting:** Execute runs under a strict node budget (e.g., $1,000,000$ DFS nodes per run) to ensure 100% hardware-independent reproducibility.
  * **Independent Trials:** Execute $\ge 10$ independent runs per condition by systematically varying the initial letter preference permutations (6 permutations of $\{a,b,c\}$) and stochastic Parikh tie-breaking seeds.
  * **Metrics Matrix:** Collect maximum achieved length, total nodes explored, dead-end density (`nodes / maxLen`), and asymptotic growth curves to determine whether `aa2fr` hits a hard combinatorial "wall."

### Pillar 3: Periodicity & Self-Similarity Mining (`MorphismMiner`)
* **Objective:** Transition from searching string space to searching rule space by mining deep DFS words (length $\ge 2000$) for substitution morphisms.
* **Architecture:**
  * **Transient Bypassing:** Scan words from offset $t \in [0, 100]$ to bypass initial non-recurrent DFS noise.
  * **Uniform Substitution Matching:** Test candidate block lengths $k \in [2, 20]$. Extract mappings $x \to W_x$ and verify if a consistent substitution ruleset explains extensive contiguous stretches of the generated word.
  * **Seamless Pipeline:** Output discovered candidate morphisms directly into the verification engine.

### Pillar 4: Exhaustive Finite Verification Engine (`MorphismVerificationEngine`)
* **Objective:** Implement an exact decision procedure for whether a candidate morphism's fixed point avoids long abelian powers. **Source not yet fixed:** the algorithm was previously attributed here to *arXiv:1507.02581 / "On Mäkelä's Conjectures"*; that arXiv record is actually *"Avoidability of long $k$-abelian repetitions"* and the quoted title matches no arXiv record (checked 2026-07-28, see `MATH_CLAIMS.md` #6). Before any implementation begins, the decision procedure must be traced to a named theorem in a PDF someone has opened — candidate leads are Rao & Rosenfeld arXiv:1511.05875 and Carpi's finite sufficient condition.
* **Architecture:**
  * **Incidence Matrix Analysis:** Calculate the Parikh transition matrix $M_h$ and evaluate growth properties.
  * **Critical Verification Horizon ($L_{\max}$):** Algorithmically compute the bounded check horizon $L_{\max}$ required to cover all possible boundary alignments across morphism images.
  * **Exhaustive Boundary Scanner:** Generate morphism iterations up to $L_{\max}$. If no abelian square of half-length $\ge 2$ occurs across any boundary, output a **Certified Mathematical Proof** of infinite avoidability.

### Pillar 5: SAT Encoding & CaDiCaL Certification (`AbelianSATEncoder`)
* **Objective:** Translate the bounded ternary abelian square avoidance problem of length $N$ into Boolean Satisfiability (DIMACS CNF format) for independent solver verification.
* **Architecture:**
  * **Variable Mapping:** $3N$ Boolean variables representing letter assignments at each position.
  * **Cardinality Constraints:** Encode Parikh vector equality prohibitions ($\Psi(U) \ne \Psi(V)$ for all half-lengths $m \ge 2$) using sorting networks or adder circuits.
  * **CLI & Web Exporter:** Provide an automated `.cnf` generator allowing researchers to run parallel hardware verification via solvers like CaDiCaL (`cadical makele_N.cnf`).

---

## 4. Long-Term Architectural Pillars

Beyond the immediate 5-point execution roadmap, the platform maintains four long-term exploratory modules:
1. **Search Observatory:** Real-time visual heatmaps and topological mapping of search space branching factors and entropy collapse.
2. **Constraint Analysis Engine:** Interactive explanation trees detailing exact mathematical contradiction chains for manual word construction.
3. **Morphism Design Laboratory:** Interactive sandbox for experimenting with 4-letter Keränen morphisms ($g_{85}, g_{109}$) and visual 2D/3D random walks.
4. **Community Research Nexus:** One-click exporting of structural anomalies, candidate morphisms, and benchmark configurations to GitHub Discussions for global peer collaboration.
