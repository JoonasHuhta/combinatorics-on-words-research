# SEAM SEARCH & VERIFICATION ENGINE (MODULE 18) — RESEARCH MANUAL & ARCHITECTURAL GUIDE

**Document Version:** 1.0 (2026-07-28)  
**Target Audience:** Combinatorics on Words Research Group, AI Assistant Agents, and Citizen Science Collaborators  
**Primary Repository Location:** `c:\abc\`  

---

## 1. EXECUTIVE SUMMARY & RESEARCH VISION (Tiivistelmä tutkijaryhmälle)

The **Seam Search & Verification Engine** (Module 18) is an experimental mathematics laboratory and computational verification platform embedded within the *Combinatorics on Words Research Application*. Its primary mission is to bridge the gap between abstract combinatorial algebra—such as Keränen's $g_{85}$ morphism (1992) and Rao & Rosenfeld's $g_3(h_6^n(a))$ morphism (2018)—and high-performance empirical verification.

### Mikä on koneen perusidea? (The Core Idea)
Kun tutkimme abelin-neliöttömiä sanoja (words avoiding adjacent substrings $ww'$ that are permutations of each other, i.e., having identical Parikh vectors $\Psi(w) = \Psi(w')$), morfismien (sijoitusjärjestelmien) todistaminen perustuu usein siihen, mitä tapahtuu **kuvien rajapinnoilla eli saumoissa (seams / boundaries)**. 

Tämä moottori tarjoaa tutkijoille ja tekoälyagenteille kaksi synkronoitua suoritusympäristöä:
1. **Interaktiivinen selaimen laboratorio (Tab 18 - UI):** Mahdollistaa reaaliaikaisen visualisoinnin, morfismien mutatoinnin, polyomino-palikoiden astumisen tarkastelun, abelisten neliöiden paikantamisen ($K \in \{2,3,4,5\}$) ja verifiointiraporttien luonnin suoraan selaimessa.
2. **Erillinen HPC Komento-ohjelma (`seam-hpc-cli.js`):** Ohittaa selaimen muistirajoitukset (~2–4 GB) ja taustasäikeiden kuristukset. Se valjastaa loppukäyttäjän tehotyöaseman tai laskentaklusterin kaikki prosessoriytimet (esim. 16–64 ydintä) rinnakkaiseen siltojen hitsaukseen (seam bridge welding) ja asymptoottisten kynnysarvojen stressitestaukseen.

---

## 2. THEORETICAL FOUNDATION & MATHEMATICAL OBJECTIVES

### 2.1. Parikh Vectors & Abelian Squares
For a word $w$ over an alphabet $\Sigma = \{a, b, c, \dots\}$, the **Parikh vector** $\Psi(w)$ is the vector of symbol counts. For example, over $\Sigma = \{a, b, c\}$, if $w = \text{"aabcb"} $, then $\Psi(w) = (2, 2, 1)$.

* **Abelian Equivalence ($\approx_{ab}$):** Two words $u$ and $v$ are abelian equivalent ($u \approx_{ab} v$) if and only if $\Psi(u) = \Psi(v)$.
* **Abelian Square:** A non-empty word $X = uv$ where $u \approx_{ab} v$. The period of the square is defined as the half-length $K = |u| = |v|$.
* **Abelian-Square-Free Word:** A word containing no contiguous substring that is an abelian square.

### 2.2. Canonical Morphisms Investigated
The engine evaluates and audits several benchmark constructions in combinatorics on words:

1. **Keränen (1992) $g_{85}$ Morphism:** An 85-uniform morphism over a 4-letter alphabet $\Sigma_4 = \{a,b,c,d\}$ that avoids abelian squares unconditionally. It serves as the absolute benchmark for 4-letter abelian-square-free generation.
2. **Rao & Rosenfeld (2018) Ternary Construction:** The 243-uniform morphism $g_3 : \Sigma_6^* \to \Sigma_3^*$ applied to the fixed point of the 6-uniform morphism $h_6(a)$.
   * **Theorem 5 (Finite Realm Short Squares):** In any image $g_3(h_6^n(a))$, there exist **exactly 34 unique short abelian squares** localized entirely within the period realm $K \in \{2, 3, 4, 5\}$.
   * **Theorem 11 (Asymptotic Abelian-Square-Freedom):** For periods $K \ge 6$, the construction is provably abelian-square-free.
3. **Bridge Welding & Seam Surgery ($U \cdot X \cdot V$):** To construct new morphisms or extend existing ones without generating collisions across boundaries, the engine performs systematic DFS searches for bridging words $X$ connecting left boundary block $U$ and right boundary block $V$ such that the concatenation $U \cdot X \cdot V$ contains no abelian squares spanning across the seams.

---

## 3. CORE ALGORITHMIC ARCHITECTURE & DATA STRUCTURES

The engine is engineered for maximum asymptotic and hardware throughput, avoiding brute-force recomputation.

### 3.1. Exact 53-Bit Float64Array Parikh Packing
To test whether two adjacent blocks $u = w[i \dots i+k-1]$ and $v = w[i+k \dots i+2k-1]$ are abelian equivalent, standard algorithms compare arrays in $O(|\Sigma|)$ time. Our engine achieves **$O(1)$ equality checking** via integer prefix packing:

* Letters are encoded as base-$2^{16}$ shifts:
  $$\text{val}(a) = 0, \quad \text{val}(b) = 1, \quad \text{val}(c) = 65536 \, (2^{16})$$
* Over a ternary alphabet with word lengths up to $N = 5000$, the maximum packed sum is $5000 \times 65536 \approx 3.27 \times 10^8$, requiring $\approx 29$ bits. Over larger blocks or alphabets, this can exceed 32 bits.
* **Critical Hardware Rule:** To prevent 32-bit bitwise integer overflow (which occurs when using `<<` or `|` in JavaScript), the engine allocates prefix sums using exact **`Float64Array`** arithmetic (`+` and `-`). Because IEEE 754 double-precision floats represent integers exactly up to $2^{53} \approx 9.01 \times 10^{15}$, Parikh vectors are compressed into a single scalar without truncation.
* An $O(1)$ pre-check `getPacked(l1, r1) === getPacked(l2, r2)` immediately discards non-matching blocks. Only upon a scalar match does the engine perform a full Parikh component verification.

### 3.2. ParikhFenwickTree (Dynamic Backtracking)
During Depth-First Search (DFS) backtracking for bridge welding or mutation exploration, symbols are repeatedly appended and popped.
* Instead of rebuilding prefix arrays in $O(N)$, the engine implements a **ParikhFenwickTree (Binary Indexed Tree)**.
* Point updates (appending/popping a character) execute in $O(\log N)$ time.
* Range Parikh queries $\Psi(w[l \dots r])$ execute in $O(\log N)$ time, maintaining optimal memory locality.

### 3.3. RecursiveParikhOracle (Static Matrix Descent)
For auditing long static prefixes (such as the $N = 7290$ prefix of $g_3(h_6^6(a))$), the **RecursiveParikhOracle** builds a hierarchical block decomposition. By precalculating bounding boxes of Parikh vectors for parent intervals, the oracle skips evaluating entire subtrees when block-level Parikh discrepancies guarantee that no abelian squares can exist at lower granularities.

### 3.4. FORBID4 & $\mathcal{S}_3$ Permutation Invariance
Combinatorial properties must be independent of alphabet renaming. The engine automatically checks all $6$ permutations of the ternary alphabet $\Sigma_3 = \{a, b, c\}$ (the symmetric group $\mathcal{S}_3$) and reversal symmetries. If a structural property or short-square count holds under the identity map but fails under a permutation (e.g., $a \leftrightarrow b$), the engine flags an asymmetry violation.

---

## 4. EPISTEMOLOGY & SCIENTIFIC VERIFICATION PROTOCOLS

To maintain scientific integrity and comply with the strict guidelines in `AGENTS.md`, the platform enforces an explicit epistemological protocol.

### 4.1. The Humble Restraint Rule (No Overpromising)
* **Rule:** An empirical computational check over a finite window (e.g., $N = 7290$ letters) or a finite search depth **MUST NEVER** be described as an "unconditional infinite theorem proof", "confirmed certification", or "absolute guarantee".
* **Language Calibration:** UI badges, logs, and commit messages must use precise boundary language: *"No violations observed in prefix $N=7290$ across periods $K \in [1, 3645]$"* or *"Exhaustively verified for length $L \le 10$"*.

### 4.2. Two-Level Provenance Badge Protocol (`MATH_CLAIMS.md`)
Every mathematical claim, checksum, or badge in the system is assigned strictly to one of two levels:
* `Level 1 (Internal Checksum):` Proves only that computational data, prefix observations, or DFS search trees have not drifted between git commits. It represents empirical observation, not an external proof.
* `Level 2 (Verified Source):` Represents a peer-reviewed mathematical theorem. Requires an explicit DOI/arXiv reference, exact publication year, theorem/page number, and a short verbatim quote stored in `MATH_CLAIMS.md` (e.g., Rao & Rosenfeld 2018, Theorem 5).

### 4.3. Negative Control Calibration (The Exact Cutoff Harness)
To prove that the Parikh collision scanner does not leak false positives or false negatives, the engine runs an automated **Negative Control Calibration**:
* Over a ternary alphabet $\{a, b, c\}$, it is a proven mathematical fact that exactly **18** abelian-square-free words exist at length 7, and exactly **0** exist at length 8 (Pleasants 1969; Keränen).
* The engine executes an exhaustive DFS scan up to length 8. If the result is anything other than `18 at len 7` and `0 at len 8`, the calibration fails, and execution halts.

### 4.4. p=6 Replication Harness
To empirically test Theorem 11 of Rao & Rosenfeld (2018), the harness runs independent randomized seed audits across generated morphic words, verifying that no boundary seam collisions occur at periods $K \ge 6$.

---

## 5. MULTI-CORE HPC EXECUTION GUIDE (`seam-hpc-cli.js`)

For heavy computational workloads that exceed browser sandbox capabilities, the repository includes a standalone, zero-dependency Node.js CLI runner: `seam-hpc-cli.js`.

### 5.1. Why Standalone HPC Execution?
* **Memory Scaling:** Accesses the full system RAM budget (e.g., 16 GB–128+ GB) rather than browser limits.
* **True Multi-Core Scaling:** Spawns native Node.js `worker_threads` across all available logical CPU cores (`os.cpus().length`).
* **Zero Throttling:** Executes at maximum OS priority without background tab sleep modes.

### 5.2. Command-Line Reference
Open your terminal (Bash, PowerShell, or CMD) in the project root and execute:

```bash
# Display help and system diagnostic info
node seam-hpc-cli.js --help

# 1. Run Negative Control Calibration (Exhaustive Ternary Cutoff)
node seam-hpc-cli.js --mode=neg

# 2. Search for Connecting Seam Bridges (Multi-Core Welding)
node seam-hpc-cli.js --mode=weld --u=bbbaabaaac --v=ccccbbbcbc --maxLen=12 --workers=16

# 3. Replicate Rao & Rosenfeld p=6 Boundary Stability (Stress Test)
node seam-hpc-cli.js --mode=p6 --workers=8 --iterations=20
```

### 5.3. Windows 1-Click Interactive Launcher (`run-seam-search.bat`)
To make local execution effortless for Windows users, mathematicians, and citizen scientists without requiring terminal familiarity or compilation into unsigned binary executables (.exe):
* Download both `seam-hpc-cli.js` and **`run-seam-search.bat`** into the same folder (e.g., Downloads or Desktop).
* Double-click `run-seam-search.bat` to launch an interactive menu in Windows Command Prompt.
* Select `[1]` for Negative Control, `[2]` for Bridge Welding, or `[3]` for the Rao & Rosenfeld stress test.
* The launcher checks for a valid Node.js installation automatically and displays clear guidance if runtime installation is needed.

### 5.4. Citizen Science Issue Export
When running in `--mode=weld`, if a valid bridge is discovered, the CLI automatically prints a formatted **GitHub Issue Export Template**. Researchers can paste this directly into GitHub Issues to report new combinatorial seams to the repository maintainers.

---

## 6. GUIDE FOR AI AGENTS & RESEARCH TEAM EVALUATION

When research group members or AI coding assistants (such as Google Antigravity, Claude, or Copilot) evaluate, modify, or extend this engine, they must adhere to the following workflow:

### 6.1. Mandatory Evaluation Checklist for AI Agents
1. **Read Core Rules First:** Always read `AGENTS.md` and `MATH_CLAIMS.md` before touching any combinatorial logic or UI text.
2. **Run Automated Drift Checks:** Execute `node check-claims-drift.js` in the terminal. This script enforces:
   * Exact citation accuracy (Rao & Rosenfeld 2018 vs. outdated theses).
   * Absence of overpromising epistemological wording in documentation.
   * Arithmetic integrity (no bitwise `<<` shifts in `aa2fr-worker.js` or `seam-hpc-cli.js`).
   * Absence of UI emojis in Module 18 HTML/JS (maintaining serious scientific styling).
   * Git drift checks against HEAD.
3. **Run the Full Regression Suite:** Execute `node test.js` to run all 11 automated unit and integration tests (morphism checksums, FORBID4 invariance, Fenwick tree accuracy, and negative control calibration).
4. **Verify Commit Messages:** If adding a mathematical constant or claim, record the exact provenance (DOI, algorithm, or derivation) in the commit message immediately.

### 6.2. How to Add New Morphisms or Experiments
* **Step 1:** Define the morphism canonical string in `morphisms.js`.
* **Step 2:** Calculate its exact prefix checksum and register it as `LEVEL_1_INTERNAL_CHECKSUM` in `MATH_CLAIMS.md`.
* **Step 3:** If the morphism is backed by a peer-reviewed paper, verify the source, extract a short quote (< 15 words), add the DOI, and elevate the status to `LEVEL_2_VERIFIED_SOURCE` in `MATH_CLAIMS.md`.
* **Step 4:** Hook the new morphism into `aa2fr-worker.js` and add a UI test case in `index.html` (Tab 18) and a CLI flag in `seam-hpc-cli.js`.

### 6.3. Roadmap & Future Research Directions
The research group and future AI agents are encouraged to explore the following advanced frontiers:
1. **CUDA / GPU Acceleration:** As outlined in the repository archives (`Reconstructing Combinatorics and CUDA Prompts.pdf`), implement WebGPU or Node.js CUDA bindings for massive parallel Parikh evaluation across billions of candidates.
2. **Automated Carpi's Transition Matrix Test:** Implement an automated algebraic checker for Carpi's transition matrices (as referenced in `Conjecture_EnhancedCarpi'sTest.pdf`) to prove morphism k-abelian-square-freedom algebraically rather than purely via prefix scanning.
3. **4-Letter and 5-Letter Seam Exploration:** Expand the seam welding search space beyond ternary alphabets to investigate boundary behaviors in quaternary ($\Sigma_4$) and quinary ($\Sigma_5$) words.

---
*End of Research Manual. For live interactive exploration, open `index.html` in a web browser and navigate to Tab 18: "18. Seam Search & Verification".*
