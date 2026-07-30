# COMPUTATIONAL DISCOVERY LABORATORY FOR COMBINATORICS ON WORDS
## NEXT-GENERATION ARCHITECTURAL IMPLEMENTATION PLAN

**Document Version:** 1.0 (2026-07-28)  
**Status:** Approved Engineering Blueprint  
**Authors:** Mathematical & Systems Engineering Team  

---

## 1. SCIENTIFIC & ENGINEERING JUSTIFICATIONS (Miksi nämä ovat ylivertaisia lisäyksiä?)

The transformation of the *Seam Search Engine* into the **Computational Discovery Laboratory for Combinatorics on Words** is driven by two fundamental mathematical and architectural breakthroughs:

### 1.1. Universal Constraint Laboratory (`ConstraintEvaluator`)
* **The Mathematical Reality:** Combinatorics on words is inherently the study of **pattern avoidance**. While abelian squares ($\approx_{ab}$) are a premier topic, research group members and citizen scientists actively investigate an expansive ecosystem of constraints:
  1. **$k$-Abelian Equivalence (Karhumäki et al. 2013):** Two words are $k$-abelian equivalent if their Parikh vectors match AND their prefixes and suffixes of length up to $k-1$ match exactly.
  2. **Overlap-Free / Fractional Powers (Dejean's Conjecture):** Words avoiding $uxu$ where $u$ is non-empty and $x$ is a factor.
  3. **Palindrome Avoidance / Restriction:** Restricting or bounding the occurrence of palindromic factors.
  4. **Unfavorable Factor Pruning (Keränen 1992):** Specifying exact lists of 3-letter or 4-letter trap substrings that lead to dead ends in substitution trees.
* **The Software Engineering Leap (SOLID Architecture):** Currently, our search algorithms (`aa2fr-worker.js`, `seam-hpc-cli.js`) tightly couple the DFS backtracking tree navigation with the specific Parikh packing arithmetic (`checkAbelian`). 
  * By decoupling the tree exploration into an invariant **Universal Engine** and isolating the rules into a **`ConstraintEvaluator` Interface**, we transform a single-purpose tool into a **general-purpose scientific instrument**.
  * Researchers will be able to test brand new mathematical conjectures without rewriting a single line of multi-core threading, Fenwick tree memory management, or boundary welding surgery.

### 1.2. Search Ecology Landscape Analyzer (`EcologyProfile`)
* **The Mathematical Reality:** Standard combinatorial search scripts only output binary outcomes: *"Did a word of length $N$ exist? Yes/No."* This discards 99% of the computational intelligence generated during the traversal!
  * A combinatorial search space is a living **ecological landscape**. Certain depths operate as **Superhighways** (high branching factor, zero pruning), while other depths act as **Bottlenecks or Extinction Zones** (where 95%+ of candidate branches terminate due to unavoidable factor collisions).
* **The Analytical Leap:** By quantitatively tracking the search ecology at every tree depth $d \in [1, \text{maxLen}]$:
  1. **Branching Factor ($B_d$):** Average number of valid surviving extensions per node.
  2. **Extinction Ratio ($E_d$):** Percentage of visited nodes at depth $d$ that result in complete dead ends.
  3. **Trap Motif Localization:** Identifying the exact 3-letter or 4-letter suffixes that immediately precede extinction.
  * Researchers gain immediate insight into *why and where* a morphism or boundary seam fails. Instead of guessing, they can see precisely which word lengths act as algorithmic chokepoints.

---

## 2. PHASE 1: UNIVERSAL CONSTRAINT LABORATORY IMPLEMENTATION

### 2.1. The `ConstraintEvaluator` Abstract Interface
We will introduce a universal interface into `seam-hpc-cli.js` and `aa2fr-worker.js`:

```javascript
/**
 * Abstract Base Interface for Combinatorial Word Constraints
 */
class ConstraintEvaluator {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  /**
   * Evaluates if appending `newChar` at position `len-1` violates the constraint.
   * @param {Int32Array|Uint16Array} word - Array of character codes
   * @param {number} len - Current word length
   * @param {number} newChar - Newly appended character code
   * @returns {boolean} true if valid (no violation), false if violated
   */
  evaluateStep(word, len, newChar) {
    throw new Error("Method 'evaluateStep()' must be implemented by subclass.");
  }
}
```

### 2.2. Canonical Rule Presets (Built-in Library)
We will implement four built-in constraint packages:

1. **`AbelianSquareFreeConstraint` (Preset A - Current Default):**
   * Encapsulates our exact 53-bit `Float64Array` base-$2^{16}$ Parikh packing.
   * Maintains $O(1)$ equality pre-checks via scalar integer comparison.
2. **`kAbelianSquareFreeConstraint` (Preset B):**
   * Extends Parikh verification by verifying exact match of prefix and suffix slices of length $k-1$.
3. **`ForbiddenFactorConstraint` (Preset C):**
   * Accepts a set of forbidden strings (e.g., Keränen's unfavorable factors or custom user traps).
   * Implements an Aho-Corasick or optimized suffix automaton for $O(1)$ step verification.
4. **`CustomJavaScriptConstraint` (Preset D - Citizen Science Sandbox):**
   * Allows researchers to input custom JavaScript arrow expressions in the UI or via CLI:
     ```bash
     node seam-hpc-cli.js --mode=custom --rule="(w, len) => !isPalindrome(w, len)"
     ```

---

## 3. PHASE 2: SEARCH ECOLOGY LANDSCAPE ANALYZER

### 3.1. Telemetry & Ecology Metrics Collection
During DFS traversal, the worker will maintain an `EcologyTracker` data structure without degrading asymptotic runtime:

```javascript
class EcologyTracker {
  constructor(maxLen) {
    this.maxLen = maxLen;
    this.visited = new Float64Array(maxLen + 1);
    this.deadEnds = new Float64Array(maxLen + 1);
    this.trapMotifs = new Map(); // Tracks most common extinction suffixes
  }

  recordVisit(depth) {
    this.visited[depth]++;
  }

  recordDeadEnd(depth, wordSlice) {
    this.deadEnds[depth]++;
    const suffix = wordSlice.slice(-4).join('');
    this.trapMotifs.set(suffix, (this.trapMotifs.get(suffix) || 0) + 1);
  }

  getExtinctionRatio(depth) {
    if (this.visited[depth] === 0) return 0;
    return (this.deadEnds[depth] / this.visited[depth]) * 100.0;
  }
}
```

### 3.2. CLI ASCII Heatmap Rendering (`--mode=ecology`)
When running `seam-hpc-cli.js --mode=ecology`, the runner will output an intuitive, colored ASCII landscape profile upon completion or threshold halt:

```text
============================================================================
  SEARCH ECOLOGY & BOTTLENECK LANDSCAPE PROFILE
============================================================================
Depth | Extinction Landscape   | Visited Nodes | Dead-End % | Ecological Status
----------------------------------------------------------------------------
[D01] | ████████████████████   | 3             |   0.0%     | [SUPERHIGHWAY]
[D02] | ████████████████       | 9             |   0.0%     | [SUPERHIGHWAY]
[D03] | ████████████           | 27            |   0.0%     | [SUPERHIGHWAY]
[D04] | ████████               | 64            |  12.5%     | [STABLE ZONE]
[D05] | ████                   | 142           |  45.1%     | [BOTTLENECK]
[D06] | ██                     | 31            |  83.8%     | [SEVERE CHOKE]
[D07] | █                      | 6             | 100.0%     | [EXTINCTION ZONE]
----------------------------------------------------------------------------
Top Extinction Motifs (Trap Factors triggering Dead Ends):
  1. "abcb" -> Responsible for 42.1% of dead ends at Depth 5-7
  2. "bcaa" -> Responsible for 28.4% of dead ends at Depth 5-7
============================================================================
```

### 3.3. Browser UI Visual Canvas (Tab 18 Integration)
In `index.html` (Tab 18), we will add an interactive **Ecology Landscape Panel**:
* Renders a live bar chart using HTML5 Canvas or SVG showing the Extinction Ratio ($E_d$) across word depths.
* Color-codes depths: **Green** (Superhighway, $<10\%$ dead ends), **Yellow** (Bottleneck, $10\%-70\%$ dead ends), **Red** (Extinction Zone, $>70\%$ dead ends).
* Allows researchers to click on a red Extinction Zone to inspect the exact Trap Motifs responsible for killing the branches!

---

## 4. AGENTS.MD & MATH_CLAIMS.MD COMPLIANCE GUARDRAILS

To ensure these next-generation features never violate our strict project rules:
1. **No Automated Conjecture Promising:** The Search Ecology module will report *empirical extinction percentages over finite search depths*, never claiming an infinite proof of impossibility without human verification.
2. **Provenance Tracking:** Any new preset constraints added to `seam-constraints.js` must be documented in `MATH_CLAIMS.md` with explicit level assignments (`LEVEL_1_INTERNAL_CHECKSUM` or `LEVEL_2_VERIFIED_SOURCE` with DOIs).
3. **Drift Hygiene:** Automated tests in `check-claims-drift.js` and `test.js` will be expanded to assert that `ConstraintEvaluator` presets produce exact, verified benchmark counts (e.g., 18 words at length 7 for ternary abelian-square-free avoidance).
4. **Algebraic vs. Empirical Prioritization:** Following peer-review feedback, computational scanning (DFS/Ecology profiling) is strictly bounded as a *conjecture pruning and counterexample generator*. For exact asymptotic factor densities ($\rho_K$), the primary research path is calculating the **Perron–Frobenius eigenvector** of the substitution's incidence matrix. For finite bridge-welding existence proofs ($U \cdot X \cdot V$), a **SAT/CP solver prototype (CaDiCaL/Kissat)** will be prioritized alongside naive DFS.

---
*End of Blueprint. This document serves as the canonical roadmap for upgrading Module 18 to the Computational Discovery Laboratory.*
