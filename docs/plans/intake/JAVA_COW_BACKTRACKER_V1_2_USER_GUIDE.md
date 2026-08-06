# Java COW Backtracker v1.2 — Complete User and Research Guide

## Installation, search modes, dictionary use, verification, checkpoints, manifests, and scientific interpretation

**Software:** `java-cow-backtracker-v1.2`  
**Audited revision:** 1.2  
**Required Java version:** Java 17 or newer  
**Main executable:** `build/cow-backtracker.jar`  
**Main class:** `fi.joonashuhta.cowsearch.Main`  
**Guide date:** 2026-08-05

---

## 1. Purpose of the program

Java COW Backtracker is a computational search engine for finite ternary words related to Mäkelä's conjecture.

It supports two main research purposes:

1. **Exact finite search**
   - search the finite AA2F or AA2FR continuation tree below a fixed seed;
   - obtain a bounded exhaustive result when a disjoint search finishes without a time or node budget.

2. **Dictionary-guided record hunting**
   - use a precomputed dictionary of promising 40-letter AA2FR factors;
   - search quickly inside the restricted D40 language;
   - use the dictionary only as an ordering heuristic;
   - allow a controlled number of dictionary exceptions.

The program deliberately separates these purposes because they have different mathematical interpretations.

A longer finite word proves only:

> a valid finite word exists at that length.

It does **not** prove or increase the mathematical probability that an infinite AA2F or AA2FR word exists.

---

# 2. Mathematical terminology

## 2.1 Alphabet

All words use exactly:

```text
{a, b, c}
```

Any other character makes a seed or result invalid.

## 2.2 Abelian square

Two adjacent blocks of equal length form an abelian square when they have the same number of each letter.

For example, the blocks:

```text
abca
caab
```

have the same Parikh vector and therefore form an abelian square.

The search condition forbids abelian squares whose half-length is:

```text
K >= 2
```

## 2.3 AA2F

An AA2F word:

- uses `{a,b,c}`;
- contains no abelian square with half-length `K >= 2`;
- may contain repeated single letters such as `aa`.

This is the finite-word condition directly associated with Mäkelä's conjecture.

## 2.4 AA2FR

AA2FR adds six forbidden length-four factors to AA2F:

```text
baac
caab
abbc
cbba
accb
bcca
```

AA2FR is a strict sublanguage of AA2F.

It is a separate constrained research problem and must not be presented as stronger evidence for the unrestricted Mäkelä condition.

## 2.5 D40

A D40 dictionary contains encoded 40-letter factors.

In hard-D40 mode, every 40-letter window of the searched word must belong to the selected dictionary.

This defines a restricted language:

```text
AA2FR-D40
```

A missing dictionary entry means only:

> absent from this dictionary.

It does not automatically mean:

> mathematically invalid AA2FR factor.

---

# 3. Package contents

A normal extracted package contains:

```text
java-cow-backtracker-v1.2/
  README.md
  AUDIT_NOTES.md
  SOURCE_AUDIT_REPORT.md
  build.bat
  build.sh
  pom.xml

  src/
    main/
      java/
        fi/joonashuhta/cowsearch/
          Main.java
          SearchEngine.java
          SearchConfig.java
          SearchMode.java
          WorkerMode.java
          IndependentVerifier.java
          WordRules.java
          TernaryCodec.java
          D40Dictionary.java
          DictionaryCompiler.java
          CheckpointIO.java
          RunManifest.java
          BacktrackerSelfTest.java

  build/
    cow-backtracker.jar
```

The distributed JAR can be run directly. Rebuilding from source is recommended before scientific runs.

---

# 4. Requirements

## 4.1 Java

Install Java 17 or newer.

Check the installed version:

```bat
java -version
```

or on Linux/macOS:

```bash
java -version
```

The output must report Java 17 or a later version.

## 4.2 Memory

Normal exact searches require relatively little startup memory.

Dictionary compilation may require a larger Java heap. A good starting value is:

```text
-Xmx2g
```

For very large source dictionaries, more memory may be necessary.

## 4.3 Disk space

Long runs may produce:

- result words;
- manifests;
- checkpoints;
- progress logs;
- compiled dictionary files;
- dictionary audit reports.

Use a dedicated run directory for important campaigns.

---

# 5. Building the program

## 5.1 Windows

Open Command Prompt or PowerShell in the project directory:

```bat
build.bat
```

The build script:

- compiles with Java 17;
- enables compiler warnings;
- treats warnings as errors;
- creates `build/cow-backtracker.jar`;
- runs the built-in self-tests.

## 5.2 Linux or macOS

```bash
chmod +x build.sh
./build.sh
```

## 5.3 Maven

The project includes `pom.xml`.

When Maven is available:

```bash
mvn clean package
```

## 5.4 Manual build

```bash
mkdir -p build/classes

javac --release 17 \
  -d build/classes \
  $(find src/main/java -name '*.java')

jar --create \
  --file build/cow-backtracker.jar \
  --main-class fi.joonashuhta.cowsearch.Main \
  -C build/classes .
```

---

# 6. Always run the self-tests first

Before beginning a scientific campaign:

```bat
java -jar build\cow-backtracker.jar self-test
```

Expected final message:

```text
All self-tests passed.
```

The revision 1.2 tests include, among other things:

- 10,000 fixed-width base-3 encode/decode round trips;
- 100,000 randomized append/backtrack rolling-hash operations;
- exhaustive comparison of the incremental and independent AA2F/AA2FR validators for every ternary word of lengths 0–9;
- AA2F positive and negative controls;
- AA2FR positive and negative controls;
- binary dictionary write/load and lookup;
- D40 defect-budget certification;
- partition node-budget enforcement;
- a 20-repetition, six-worker stress test requiring an exact global stop at 37 nodes;
- checkpoint structure validation;
- a deterministic continuous-run versus interrupted-plus-resumed equivalence test;
- equality of both the final word and total node count after resume;
- rejection of malformed checkpoint data;
- short exact searches.

Passing the tests does not prove that no undiscovered bug exists. It establishes that the implemented safeguards pass the supplied test suite.

---

# 7. Command overview

The JAR has four commands:

```text
search
verify
compile-dict
self-test
```

Display general help:

```bat
java -jar build\cow-backtracker.jar --help
```

The program does not currently implement command-specific `search --help` pages. Supplying `search --help` is interpreted as a search option rather than a help request. Use this guide or the general `--help` output.

---

# 8. Recommended first smoke test

Run a short AA2FR search before any long campaign:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 100 ^
  --worker-mode single ^
  --max-seconds 30 ^
  --run-id SMOKE-AA2FR-001
```

On Linux/macOS:

```bash
java -jar build/cow-backtracker.jar search \
  --mode aa2fr-exact \
  --seed a \
  --target 100 \
  --worker-mode single \
  --max-seconds 30 \
  --run-id SMOKE-AA2FR-001
```

When the target is found, the default files are:

```text
record_word_100_aa2fr-exact.txt
record_word_100_aa2fr-exact.txt.manifest.json
```

Verify the word again in a fresh Java process:

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2fr ^
  --word record_word_100_aa2fr-exact.txt
```

Expected form:

```text
valid=true
reason=valid
length=100
sha256=<checksum>
```

---

# 9. Search modes

The `--mode` option selects the mathematical search language and the role of the dictionary.

## 9.1 `aa2f-exact`

Checks:

- ternary alphabet;
- no abelian square with `K >= 2`;
- no FORBID4 restriction;
- no dictionary.

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2f-exact ^
  --seed a ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id AA2F-RECORD-001
```

Interpretation:

> AA2F continuations from the fixed seed.

An `EXHAUSTED` result can be a bounded exact result only when the selected tasks were all completed without a node or time budget.

## 9.2 `aa2fr-exact`

Checks:

- exact AA2F condition;
- FORBID4;
- no dictionary pruning.

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 2200 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id AA2FR-RECORD-001
```

Interpretation:

> AA2FR continuations from the fixed seed.

## 9.3 `aa2fr-d40-hard`

Checks:

- exact AA2FR;
- every 40-letter window must be in the selected dictionary.

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-hard ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed a ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id D40-HARD-001
```

Interpretation:

> AA2FR-D40 continuations from the fixed seed.

Important:

```text
D40 exhaustion is not unrestricted AA2FR exhaustion.
```

Use hard mode for:

- restricted dictionary record hunting;
- comparison with dictionary-based C++ searches;
- studying the D40 sublanguage.

Do not use hard-D40 failure as evidence that no AA2FR continuation exists.

## 9.4 `aa2fr-d40-order`

Checks:

- exact AA2FR determines validity;
- D40 membership changes only the order in which candidate letters are tried;
- valid branches outside D40 remain searchable.

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-order ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed a ^
  --target 2500 ^
  --worker-mode partition ^
  --split-depth 6 ^
  --threads 8 ^
  --run-id D40-ORDER-001
```

Interpretation:

> AA2FR continuations from the fixed seed; D40 affects order only.

This is the scientifically safest dictionary-guided mode when dictionary completeness has not been proved.

## 9.5 `aa2fr-d40-defect`

Checks:

- exact AA2FR;
- permits a configured number of 40-letter windows absent from D40.

Example allowing one missing window:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-defect ^
  --max-dict-defect 1 ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed a ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id D40-DEFECT1-001
```

Interpretation:

> AA2FR continuations from the fixed seed within the configured D40-defect budget.

Revision 1.2 independently rechecks the defect budget when a candidate reaches the target.

---

# 10. Worker modes

## 10.1 `single`

One iterative DFS task using the default order:

```text
a, b, c
```

Example:

```bat
--worker-mode single
```

Use `single` when:

- debugging;
- producing a deterministic baseline;
- writing and resuming one checkpoint;
- comparing exact node counts with another implementation.

Checkpoint resume currently requires `single`.

## 10.2 `portfolio`

Creates six tasks using all six permutations of the letter order:

```text
abc
acb
bac
bca
cab
cba
```

Example:

```bat
--worker-mode portfolio --threads 6
```

The workers race to find the first target word.

Important:

- their search trees overlap;
- portfolio mode is useful for record hunting;
- it is not a disjoint six-way coverage partition.

If all six tasks genuinely exhaust without budgets, they have each exhausted the same rooted tree under different traversal orders. This is redundant for proof purposes but still exhaustive in the selected mode.

## 10.3 `partition`

The program first generates valid prefixes below the fixed seed and assigns their disjoint subtrees to the worker pool.

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 500 ^
  --worker-mode partition ^
  --split-depth 6 ^
  --threads 8 ^
  --run-id PARTITION-001
```

Use `partition` when:

- bounded exhaustive coverage matters;
- workers should search disjoint subtrees;
- a completed `EXHAUSTED` result may be used as a bounded computational result.

The partition prefix is generated at:

```text
seed length + split depth
```

The number of generated tasks is limited by `--max-partitions`.

---

# 11. Complete search-option reference

## Required or principal options

| Option | Default | Meaning |
|---|---:|---|
| `--mode` | `aa2fr-exact` | Search mode |
| `--seed` | `a` | Literal seed or path to an existing seed file |
| `--target` | `2500` | Target word length |
| `--worker-mode` | `portfolio` | `single`, `portfolio`, or `partition` |
| `--threads` | available CPU count | Worker-pool size |
| `--dict` | none | Required in all D40 modes |

## Search-size options

| Option | Default | Meaning |
|---|---:|---|
| `--max-length` | max of 30,000 and target | Allocated maximum word length |
| `--split-depth` | `5` | Extra depth used to form partition prefixes |
| `--max-partitions` | `1,000,000` | Maximum partition task count |
| `--max-dict-defect` | `0` | Allowed missing D40 windows in defect mode |

## Budget options

| Option | Default | Meaning |
|---|---:|---|
| `--max-nodes` | `0` | Global node budget; zero means unlimited |
| `--max-seconds` | `0` | Global time budget; zero means unlimited |

Budgets apply to partition-prefix generation as well as the worker searches.

When a budget is reached:

```text
Status = BUDGET_EXHAUSTED
```

not:

```text
Status = EXHAUSTED
```

## Output options

| Option | Default | Meaning |
|---|---|---|
| `--run-id` | timestamp ID | Stable run identifier |
| `--output` | `record_word_<target>_<mode>.txt` | Final certified word file |
| `--manifest` | `<output>.manifest.json` | Run-manifest path |
| `--log-progress-words` | off | Append progress words to `progressive_log.txt` |
| `--progress-millis` | `1000` | Minimum progress reporting interval |

## Checkpoint options

| Option | Default | Meaning |
|---|---:|---|
| `--checkpoint-dir` | none | Directory for checkpoint files |
| `--checkpoint-seconds` | `60` | Checkpoint interval |
| `--resume-checkpoint` | none | Resume one checkpoint file |

Checkpoint resume requires:

```text
--worker-mode single
```

Negative values for budgets, checkpoint intervals, and progress intervals are rejected.

---

# 12. Seed usage

## 12.1 Literal seed

```bat
--seed a
```

or:

```bat
--seed abcccbbbaa
```

## 12.2 Seed file

```bat
--seed records\known_2107.txt
```

The file is read as UTF-8 and trimmed.

The seed is treated as a **locked prefix**. Search never backtracks before the end of the seed.

## 12.3 Seed validation

Before the search begins, the program independently verifies the whole seed.

Depending on the selected mode, it checks:

- alphabet;
- AA2F;
- FORBID4;
- hard D40 coverage;
- D40 defect budget.

A target must be strictly longer than the seed.

## 12.4 Missing seed-file behavior

`--seed` is interpreted as a file only if the supplied path currently exists as a regular file. Otherwise it is interpreted as a literal word.

Therefore a misspelled path usually fails later as an invalid alphabet string rather than producing a “file missing” message.

Recommended practice:

- use an absolute or carefully checked relative path;
- verify the console-reported seed length;
- keep seed files under a known `records/` or `seeds/` directory.

---

# 13. Continuing a known word

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed records\known_2107.txt ^
  --target 2300 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id EXTEND-2107-001 ^
  --output runs\EXTEND-2107-001\candidate-2300.txt ^
  --manifest runs\EXTEND-2107-001\manifest.json
```

The original 2107-letter seed remains fixed. The search explores only right extensions.

For a dictionary-constrained replay:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-hard ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\known_2107.txt ^
  --target 2200 ^
  --worker-mode single ^
  --run-id D40-REPLAY-2107
```

If the seed itself contains a 40-letter factor absent from the selected dictionary, hard mode rejects the run before searching.

---

# 14. Node and time budgets

## 14.1 Node budget

```bat
--max-nodes 100000000
```

Revision 1.2 uses an atomic global node permit. Multi-thread searches stop at the configured global budget rather than letting every worker independently exceed it.

## 14.2 Time budget

```bat
--max-seconds 3600
```

This is a wall-clock deadline for the entire search engine, including partition-prefix generation.

## 14.3 Using both

```bat
--max-nodes 1000000000 --max-seconds 86400
```

The first budget reached stops the run.

## 14.4 Scientific interpretation

A budgeted failure means only:

> no target was found within this node/time budget.

It does not mean:

> no target exists in the selected language.

---

# 15. Checkpoints

## 15.1 Creating checkpoints

For a long single-worker run:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 2500 ^
  --worker-mode single ^
  --threads 1 ^
  --run-id LONG-AA2FR-001 ^
  --checkpoint-dir checkpoints\LONG-AA2FR-001 ^
  --checkpoint-seconds 60
```

A checkpoint is written atomically during normal checkpoint events.

Revision 1.2 also writes a final checkpoint when a configured single-worker run stops because of a node or time budget. This prevents the latest resumable DFS state from being lost merely because the periodic checkpoint interval had not elapsed.

## 15.2 Resuming

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 2500 ^
  --worker-mode single ^
  --threads 1 ^
  --run-id LONG-AA2FR-001 ^
  --resume-checkpoint checkpoints\LONG-AA2FR-001\single-0.properties
```

The following must match the original run:

- run ID;
- mode;
- target;
- seed checksum;
- fixed seed length;
- dictionary checksum, when applicable.

## 15.3 Checkpoint validation

Revision 1.2 checks:

- task ID;
- current word;
- fixed seed prefix;
- current depth;
- maximum depth;
- node count;
- choice-stack length;
- choice values from 0 to 3;
- base order as a permutation of `{0,1,2}`;
- mode-specific word validity;
- D40 validity or defect budget.

Revision 1.2 additionally tests resume correctness by comparing:

```text
one uninterrupted deterministic single-worker run
vs.
the same run stopped at a fixed node budget, checkpointed, and resumed
```

The test requires both:

- the same final word;
- the same total node count.

This is materially stronger than merely checking that a checkpoint can be serialized and read.

## 15.4 Resume correctness fix in revision 1.2

Revision 1.1 advanced the candidate-choice index before acquiring the global node permit. If a time budget expired between those operations, a checkpoint could incorrectly mark one unattempted branch as already consumed.

Revision 1.2 acquires the node permit first and advances the choice index only when the candidate is actually counted and attempted.

## 15.5 Current limitations

One command resumes one checkpoint.

There is no current command that reconstructs an entire multi-worker portfolio or partition campaign from all worker checkpoints at once.

Additional operational limitations:

- there is no JVM shutdown hook that guarantees an immediate new checkpoint on Ctrl+C;
- periodic checkpoints are written after accepted extensions, so a rejection-heavy interval can leave the latest periodic checkpoint behind the current in-memory state;
- a checkpoint write failure is logged but does not currently terminate the search.

For simple long resumable runs, use:

```text
single
```

---

# 16. Result statuses

The search engine reports one of three statuses.

## 16.1 `FOUND`

A candidate reached the target and passed independent certification.

The final word file is written only after certification succeeds.

## 16.2 `EXHAUSTED`

All submitted tasks were exhausted in the selected mode.

Interpret the selected mode carefully:

- `aa2fr-exact`: exhaustion below the fixed seed in AA2FR;
- `aa2fr-d40-hard`: exhaustion only below the fixed seed in AA2FR-D40;
- `aa2fr-d40-order`: unrestricted AA2FR tree, dictionary affects order only;
- `aa2fr-d40-defect`: exhaustion inside the selected defect budget.

An `EXHAUSTED` result is not automatically a global theorem. It is bounded by:

- fixed seed;
- target;
- selected mode;
- partition/task construction;
- program correctness.

## 16.3 `BUDGET_EXHAUSTED`

A node or time budget ended before all tasks completed.

This is inconclusive about existence.

---

# 17. Candidate certification

When a search reaches the target:

1. the candidate is written to a temporary `.candidate` file;
2. `IndependentVerifier` checks the complete word;
3. certification verifies the class appropriate to the search mode;
4. defect mode also rechecks the configured defect budget;
5. failed certification aborts the run;
6. successful certification atomically promotes the candidate to the final output path;
7. SHA-256 is printed;
8. the run manifest is written.

The searcher's incremental state is not reused by the full verifier.

This is stronger than simply trusting the DFS predicate, but the recommended publication workflow still runs `verify` again in a fresh process.

---

# 18. Independent verification command

## 18.1 AA2F

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2f ^
  --word word.txt
```

## 18.2 AA2FR

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2fr ^
  --word word.txt
```

## 18.3 AA2FR-D40

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2fr-d40 ^
  --word word.txt ^
  --dict research\dictionaries\D40-0001\d40.cowd
```

## 18.4 Verifier output

Valid word:

```text
valid=true
reason=valid
length=<length>
sha256=<checksum>
```

Invalid word:

```text
valid=false
reason=<reason>
length=<length>
sha256=<checksum>
position=<position>
halfLength=<K>
```

The process exits with status code `2` when verification fails.

## 18.5 Verifier complexity

The full verifier checks all relevant positions and block sizes and is quadratic in word length.

It is intended for certification, not the hot search loop.

---

# 19. Dictionary compilation

The source text dictionary must be compiled before use by the Java search engine.

## 19.1 Recommended first compilation

```bat
java -Xmx2g -jar build\cow-backtracker.jar compile-dict ^
  --input datasets\aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt ^
  --output research\dictionaries\D40-0001\d40.cowd ^
  --report research\dictionaries\D40-0001\audit.json ^
  --validate-rows ^
  --audit-symmetry
```

The command reports:

```text
Dictionary compiled
Unique keys
Duplicate keys
Invalid rows
Invalid AA2FR rows
Missing symmetries
Output SHA-256
Audit report
```

## 19.2 `--validate-rows`

Independently checks every valid-length source row as AA2FR.

Use this for research dictionaries.

## 19.3 `--audit-symmetry`

Checks whether alphabet permutations and reversals are present.

The source filename includes `AllPermsMirs`, but the name alone is not proof that the file is closed under these symmetries.

## 19.4 `--expand-symmetries`

Adds all six alphabet permutations and reversals before sorting and deduplication.

Do not use this on the first compile unless the audit shows that expansion is necessary.

Otherwise the compiler may spend time generating entries already present in the source.

## 19.5 Default audit report

When `--report` is omitted:

```text
<output>.audit.json
```

is used.

## 19.6 Immutable dictionary practice

For serious work, use versioned paths:

```text
research/dictionaries/D40-0001/d40.cowd
research/dictionaries/D40-0001/audit.json
research/dictionaries/D40-0001/source-sha256.txt
```

Do not silently replace a dictionary used by an earlier run.

---

# 20. Suggested run-directory structure

For an important campaign:

```text
runs/
  AA2FR-RECORD-001/
    manifest.json
    candidate-2500.txt
    fresh-verification.txt
    console.log
    checkpoints/
```

Example command:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-order ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\known_2107.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --max-seconds 86400 ^
  --run-id AA2FR-RECORD-001 ^
  --output runs\AA2FR-RECORD-001\candidate-2500.txt ^
  --manifest runs\AA2FR-RECORD-001\manifest.json
```

Capture console output in PowerShell:

```powershell
java -jar build\cow-backtracker.jar search `
  --mode aa2fr-d40-order `
  --dict research\dictionaries\D40-0001\d40.cowd `
  --seed records\known_2107.txt `
  --target 2500 `
  --worker-mode portfolio `
  --threads 6 `
  --max-seconds 86400 `
  --run-id AA2FR-RECORD-001 `
  --output runs\AA2FR-RECORD-001\candidate-2500.txt `
  --manifest runs\AA2FR-RECORD-001\manifest.json |
  Tee-Object -FilePath runs\AA2FR-RECORD-001\console.log
```

---

# 21. Run manifest

Every search writes a JSON manifest.

It records the search configuration and result, including items such as:

- run ID;
- search mode;
- worker mode;
- seed information;
- target;
- thread count;
- dictionary checksum when applicable;
- node/time budgets;
- result status;
- maximum depth;
- node count;
- duration;
- verification result;
- output path;
- interpretation scope.

The manifest is the primary provenance record for the computational run.

Do not edit it manually to change the mathematical interpretation.

---

# 22. Progress output

Typical progress line:

```text
[portfolio-2] depth=532 localNodes=3538973 globalNodes=6063124
```

Fields:

- task ID;
- greatest depth newly reported by that task;
- nodes attempted by that task;
- globally budgeted nodes attempted.

Progress is rate-limited by:

```text
--progress-millis
```

Default:

```text
1000
```

## 22.1 Progressive word log

Enable:

```bat
--log-progress-words
```

This appends full progress words to:

```text
progressive_log.txt
```

Use with care:

- it can become large;
- it is written in the current working directory;
- concurrent tasks may produce many records;
- it is not a replacement for run manifests or certified record files.

---

# 23. Recommended research workflows

## 23.1 Fast AA2FR record attempt

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed records\current-best.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --max-seconds 86400 ^
  --run-id RECORD-PORTFOLIO-001
```

Use when:

- speed to first target matters;
- overlapping search is acceptable;
- no nonexistence conclusion is intended.

## 23.2 Conservative dictionary-guided record attempt

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-order ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\current-best.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id RECORD-D40-ORDER-001
```

Recommended when:

- the dictionary is believed to contain useful guidance;
- dictionary incompleteness should not remove valid AA2FR branches.

## 23.3 Restricted D40 experiment

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-hard ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\current-best.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id D40-HARD-EXPERIMENT-001
```

Use to study the D40-constrained sublanguage.

## 23.4 Controlled escape experiment

Run a ladder:

```text
defect 0
defect 1
defect 2
defect 4
```

Example:

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-defect ^
  --max-dict-defect 2 ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\current-best.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --run-id D40-DEFECT2-001
```

This can reveal whether long valid paths require occasional factors outside the dictionary.

## 23.5 Bounded exact computation

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 80 ^
  --worker-mode partition ^
  --split-depth 7 ^
  --threads 8 ^
  --max-partitions 1000000 ^
  --run-id EXACT-BOUND-080
```

Do not set a node or time budget when an exhaustive result is required.

---

# 24. Publishing a new record

Use this procedure.

## Step 1 — run the search

Store the output and manifest in a dedicated run directory.

## Step 2 — fresh-process Java verification

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2fr ^
  --word runs\RUN-ID\candidate.txt
```

Save the output.

## Step 3 — independent external verification

Prefer a second implementation, such as the researcher's C++ verifier.

The second implementation should not reuse the Java code or data structures.

## Step 4 — calculate and preserve SHA-256

The Java verifier prints the checksum.

Also calculate it using an operating-system tool if available.

PowerShell:

```powershell
Get-FileHash runs\RUN-ID\candidate.txt -Algorithm SHA256
```

Linux:

```bash
sha256sum runs/RUN-ID/candidate.txt
```

## Step 5 — preserve provenance

Store:

- exact word;
- Java run manifest;
- dictionary version and checksum;
- Java verification output;
- C++ verification output;
- finder;
- provider;
- date;
- seed;
- search mode;
- worker mode;
- target;
- software commit/version.

## Step 6 — promote to the record registry

Only after independent verification.

## Step 7 — create or update the claims-ledger entry

A published numerical record should remain traceable to the verified artifact and manifest.

---

# 25. Comparing Java and C++

The C++ engine is especially valuable as an independent implementation.

## 25.1 Verify each other's records

```text
Java search
→ Java full verification
→ C++ full verification
```

and:

```text
C++ search
→ C++ full verification
→ Java verify command
```

## 25.2 Compare small complete searches

Use:

- identical seed;
- identical target;
- identical letter order;
- exact AA2FR mode;
- single worker;
- no restart heuristic;
- no dictionary or the same immutable dictionary.

Compare:

- `FOUND` or `EXHAUSTED`;
- first result;
- node count;
- maximum depth;
- result checksum.

A node-count difference may indicate a difference in:

- node definition;
- filter order;
- candidate order;
- pruning semantics;
- implementation bug.

## 25.3 Compare dictionary compilation

Both implementations should agree on:

- valid row count;
- invalid row count;
- unique encoded entry count;
- duplicate count;
- binary or logical checksum;
- membership of known record windows.

---

# 26. Common errors and solutions

## `FATAL: Unknown command`

Use one of:

```text
search
verify
compile-dict
self-test
```

## `FATAL: Unknown mode`

Use exactly:

```text
aa2f-exact
aa2fr-exact
aa2fr-d40-hard
aa2fr-d40-order
aa2fr-d40-defect
```

## `Missing --dict`

All D40 modes require:

```bat
--dict path\to\d40.cowd
```

## `targetLength must exceed seed length`

Choose a target greater than the complete seed length.

## `targetLength exceeds maxLength`

Increase:

```bat
--max-length
```

Normally this is unnecessary because the default is at least 30,000 and at least the target.

## `Seed is invalid`

The complete seed violates:

- alphabet;
- AA2F;
- FORBID4;
- D40 membership;
- or defect budget.

The error includes a reason and position.

## `Seed is outside the selected D40 language`

Use one of:

- a D40-compatible seed;
- `aa2fr-d40-order`;
- `aa2fr-d40-defect`;
- `aa2fr-exact`.

## `Checkpoint ... does not match`

Resume with the original:

- run ID;
- mode;
- seed;
- target;
- dictionary.

## `Checkpoint resume currently requires --worker-mode single`

Use:

```bat
--worker-mode single
```

## `Dictionary capacity or memory problems`

Compile with a larger heap:

```bat
java -Xmx4g -jar build\cow-backtracker.jar compile-dict ...
```

## Search seems silent

A long interval without a new reported maximum can mean heavy backtracking.

It does not necessarily mean the process is frozen.

Check:

- CPU utilization;
- checkpoint modification time;
- node count in later progress lines;
- elapsed budget.

---

# 27. Known limitations of revision 1.2

The revision 1.2 source audit explicitly leaves these limitations.

## 27.1 No guarantee of zero bugs

The test suite is substantial but cannot prove complete software correctness.

Publication-level claims should receive external implementation verification.

## 27.2 Quadratic full verifier

Certification becomes increasingly expensive for very long words.

## 27.3 Overlapping portfolio searches

Portfolio mode intentionally trades duplicate work for a race among different traversal orders.

## 27.4 Hard-D40 is a restricted language

Its failures do not apply to unrestricted AA2FR.

## 27.5 Single-checkpoint resume

An entire portfolio or partition campaign cannot currently be resumed in one command.

The deterministic single-worker resume path has been tested against an uninterrupted run and produced the same result and total node count. Ctrl+C-triggered immediate checkpointing and whole-campaign resume remain unsupported.

## 27.6 No graph compiler yet

Revision 1.2 does not yet compile D40 into a 39-letter state graph or calculate:

- forced corridors;
- SCCs;
- local essential core;
- seam path counts.

## 27.7 No stochastic restart portfolio

The current Java engine uses deterministic DFS task orders. It does not currently implement the C++ researcher's stall/restart strategy.

## 27.8 No search-specific help command

Use general `--help` and this guide.

---

# 28. Safe extension rules for developers

When adding a heuristic:

1. give it an explicit mode or versioned name;
2. state whether it prunes or only changes order;
3. do not weaken the independent verifier;
4. add positive and negative tests;
5. add a run-manifest field;
6. preserve deterministic replay where possible;
7. never label budgeted or restarted failure as exhaustive;
8. keep D40-relative observations separate from AA2FR-wide claims.

When changing the dictionary format:

1. create a new version;
2. preserve the previous binary;
3. update checksums;
4. add compatibility tests;
5. compare unique entry counts;
6. replay known record words.

When changing the incremental AA2F checker:

1. compare it against `IndependentVerifier`;
2. run randomized word tests;
3. verify all discovered candidates in a fresh process;
4. compare small exact searches with the C++ implementation.

---

# 29. Suggested project integration

Recommended repository locations:

```text
research/
  dictionaries/
    D40-0001/
      d40.cowd
      audit.json
      README.md
      checksums.txt

  runs/
    RUN-ID/
      manifest.json
      console.log
      candidate.txt
      verification-java.txt
      verification-cpp.txt
      checkpoints/

  records/
    words/
    manifests/
    verification/
```

Routing:

| Output | Destination |
|---|---|
| Experimental run | `research/runs/` |
| Unverified candidate | run directory only |
| Verified word | records registry |
| Current project record | records registry and claims ledger |
| Budgeted failure | run manifest |
| Exact bounded exhaustion | claims process after independent review |
| D40-only result | labelled D40 research result |
| Heuristic observation | research-harvest report |
| Formalized structural claim | conjecture pipeline |

---

# 30. Minimum checklist before a long run

- [ ] Java 17+ confirmed.
- [ ] Package rebuilt from source.
- [ ] `self-test` passed.
- [ ] Seed file exists.
- [ ] Seed length confirmed.
- [ ] Seed class confirmed.
- [ ] Dictionary compiled and audited.
- [ ] Dictionary SHA-256 recorded.
- [ ] Search mode chosen correctly.
- [ ] Worker mode chosen correctly.
- [ ] Run ID assigned.
- [ ] Output and manifest paths assigned.
- [ ] Time/node budget interpretation understood.
- [ ] Checkpoints configured when needed.
- [ ] Sufficient disk space available.
- [ ] Fresh-process verification command prepared.
- [ ] C++ cross-verification planned for important results.

---

# 31. Example: recommended AA2FR record campaign

## Compile and audit the dictionary

```bat
java -Xmx2g -jar build\cow-backtracker.jar compile-dict ^
  --input datasets\aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt ^
  --output research\dictionaries\D40-0001\d40.cowd ^
  --report research\dictionaries\D40-0001\audit.json ^
  --validate-rows ^
  --audit-symmetry
```

## Run the conservative dictionary-guided search

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-d40-order ^
  --dict research\dictionaries\D40-0001\d40.cowd ^
  --seed records\current-best-aa2fr.txt ^
  --target 2500 ^
  --worker-mode portfolio ^
  --threads 6 ^
  --max-seconds 86400 ^
  --run-id AA2FR-D40-ORDER-20260805-001 ^
  --output research\runs\AA2FR-D40-ORDER-20260805-001\candidate.txt ^
  --manifest research\runs\AA2FR-D40-ORDER-20260805-001\manifest.json
```

## Verify in a fresh Java process

```bat
java -jar build\cow-backtracker.jar verify ^
  --class aa2fr ^
  --word research\runs\AA2FR-D40-ORDER-20260805-001\candidate.txt
```

## Verify with C++

Use the independently written C++ verifier on the same exact file.

## Promote only after both pass

Preserve both reports and the SHA-256 checksum.

---

# 32. Example: exact bounded AA2FR experiment

```bat
java -jar build\cow-backtracker.jar search ^
  --mode aa2fr-exact ^
  --seed a ^
  --target 100 ^
  --worker-mode partition ^
  --split-depth 7 ^
  --threads 8 ^
  --max-partitions 1000000 ^
  --run-id AA2FR-EXACT-BOUND-100 ^
  --output research\runs\AA2FR-EXACT-BOUND-100\word.txt ^
  --manifest research\runs\AA2FR-EXACT-BOUND-100\manifest.json
```

For a true bounded exhaustion attempt:

- do not set `--max-nodes`;
- do not set `--max-seconds`;
- preserve the manifest;
- independently reproduce the result;
- confirm that partition generation did not hit `--max-partitions`;
- review the exact fixed-seed and target statement before placing it in the claims ledger.

---

# 33. Final interpretation rules

## A found finite word means

> A word satisfying the certified finite rule exists at this length.

## A budgeted run means

> The target was not found within this computational budget.

## An exact-mode exhaustion means

> No continuation reaches the target inside the fully searched fixed-seed tree and selected language.

## A hard-D40 exhaustion means

> No continuation reaches the target inside the selected AA2FR-D40 dictionary language.

## None of these alone means

> An infinite AA2F or AA2FR word exists or does not exist.

---

# 34. Recommended citation and provenance text

For a verified Java result, record wording similar to:

> The finite word was found using Java COW Backtracker revision 1.1 in `aa2fr-d40-order` mode from the fixed seed `<seed identifier>`. D40 influenced candidate ordering only. The result was independently certified by the program's all-position verifier in a fresh process and cross-verified using an independent C++ implementation. The exact word, SHA-256 checksum, run manifest, dictionary checksum, and verification reports are archived with the result.

For hard-D40:

> The result concerns the restricted `AA2FR-D40-<version>` language. It does not establish an unrestricted AA2FR exhaustion result.

---

# 35. Final recommendation

For most AA2FR record work, begin with:

```text
aa2fr-d40-order + portfolio
```

because it uses D40 guidance without permanently deleting exact-valid branches outside the dictionary.

Use:

```text
aa2fr-d40-hard
```

for explicit D40-language experiments.

Use:

```text
aa2fr-exact + partition
```

for bounded exhaustive calculations.

Use:

```text
single
```

for deterministic debugging and checkpoint resume.

Every important result should follow:

```text
search
→ internal certification
→ fresh Java verification
→ independent C++ verification
→ checksum and manifest preservation
→ record or claims process
```
