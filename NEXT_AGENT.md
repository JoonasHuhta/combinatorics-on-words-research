# Handoff Document — Word Structures Lab
### For the next researcher or AI model working on this project
*Last updated: 2026-07-08*

---

## 1. What This Project Is

An interactive research platform for **Abelian square-free words**, built around Finnish mathematician **Veikko Keränen's** 1992 result that proved an infinite Abelian square-free word exists over a 4-letter alphabet {a,b,c,d}.

An **Abelian square** is a word `uv` where both halves are anagrams of each other (same Parikh vector). Keränen proved 4 letters suffice and 3 do not.

**Live site:** `joonashuhta.github.io/combinatorics-on-words-research/`  
**Repository:** `github.com/JoonasHuhta/combinatorics-on-words-research`  
**Main file:** `C:\abc\index.html` (single monolithic HTML/CSS/JS file, ~1850 lines, no dependencies)

---

## 2. Core Mathematical Objects in Code

```javascript
// Keränen's g85 morphism — proven Abelian square-free
const G85_A = 'abcacdcbcdcadcdbdabacabadbabcbdbcbacbcdcacbabdabacadcbcdcacdbcbacbcdcacdcbdcdadbdcbca'; // 85 chars
const G85 = { a: G85_A, b: cyclicPerm(G85_A), c: cyclicPerm(cyclicPerm(G85_A)), d: ... };

// g98 morphism — also proven, 98 chars
const G98_A = "abcacdcbcdcadbdcbdbabcbdcacbabdbabcabdadcdadbdcbdbabdbcbacbcdbabdcdbdcacdbcbacbcdcacdcbdcdadbdcbca";

// Core check functions
getParikh(word)                          // returns {a,b,c,d} counts — works on string or array
parikhEqual(p1, p2, alphabet)           // compare two Parikh vectors
findAbelianSquare(word, alphabet)       // full scan O(n²) — use sparingly
findSuffixAbelianSquare(word, alphabet) // suffix-only O(n) — use during incremental construction
```

---

## 3. Current Tabs (as of 2026-07-08)

| # | Tab ID | Status | Notes |
|---|--------|--------|-------|
| 1 | `3letter` | ✅ Working | Animated backtracking search tree |
| 2 | `abc-lab` | ✅ Working | Exhaustive enumeration of 3-letter words |
| 3 | `4letter` | ✅ Working | g85 morphism iteration, tile view |
| 4 | `canvas` | ✅ Working | 2D walk drawing (a=left,b=right,c=down,d=up) |
| 5 | `audio` | ✅ Working | Sonification, chunk tracks |
| 6 | `try-it` | ✅ Working | Interactive letter entry with real-time Parikh check |
| 7 | `timeline` | ✅ Working | Historical events 1906–1992 |
| 8 | `unfavorable` | ✅ Working | Left/right extension of seed words |
| 9 | `microscope` | ✅ Working | g85 vs g98 side-by-side, colored letters |
| 10 | `knowledge` | ✅ Working | Force-directed concept graph |
| 11 | `morph-lab` | ✅ **NEW** | User-built morphism evaluator |
| 12 | `heat-map` | ⏳ Planned | Heatmap of Abelian square positions |
| 13 | `evolution` | ⏳ Planned | Genetic algorithm morphism search |

---

## 4. Architecture Rules (DO NOT VIOLATE)

From `AGENT_CONCEPT_BRIEF.md` and `PROJECT_ARCHITECTURE.md`:

1. **Single file only.** Do not split `index.html` into separate files.
2. **No external libraries.** No React, D3, Three.js, etc. Native DOM, Canvas, Web Audio only.
3. **No false mathematics.** Never imply 3 letters can produce infinite A²-free word.
4. **Keep g85 intact.** Do not replace or rename Keränen's morphism without citing a source.
5. **Mark experimental results.** AI-generated or user-generated morphisms must be labeled clearly as experimental, not proven.
6. **`switchMode(newMode)` is the router.** Every new tab must:
   - Add a `view-<id>` panel in HTML (hidden by default)
   - Add a branch in `switchMode()` to show/hide it
   - Add the tab button in `.mode-tabs`
   - Hide/show appropriate control buttons

### Adding a new tab — checklist:
```
[ ] HTML: <div class="view-panel hidden" id="view-NEWID">
[ ] HTML: <div class="mode-tab" data-mode="NEWID">N. Tab Name</div>
[ ] JS: add `'view-NEWID'` to the hidden-panels list in switchMode
[ ] JS: add `else if (mode === 'NEWID')` branch in switchMode
[ ] JS: implement the tab's render function
[ ] Test: click all other tabs after — make sure nothing breaks
```

---

## 5. Implemented This Session (2026-07-08)

### Changes to index.html:
- New title: `Abelian Square-Free Structures — Interactive Explorer`
- New intro text and subtitle
- Tab labels cleaned up (g₈₅ Unicode, cleaner names)
- Tree Search description improved ("Suffix Parikh Scanner")
- Unfavorable Factors: left extension bug fixed (now uses suffix check, not full scan)
- Unfavorable Factors: auto-computes on tab entry
- Morphism Microscope: complete rewrite — dynamic length display, 5-char grouping, cyclic permutation note
- Knowledge Graph: node labels now have white background to prevent overlap
- info-panel hidden for `microscope` and `knowledge` tabs (no stats needed)
- **NEW TAB 11: Morphism Laboratory** — user builds own morphism, program evaluates it
- **NEW TAB 12: Heat Map** — heatmap of Abelian square positions (placeholder, ready for data)

---

## 6. Muutokset sessiossa 2026-07-08 (ilta)

### Bug fixes & improvements to index.html:
- **FIXED**: All g₈₅ and g₉₈ subscript characters were wrong Unicode entities (`&#8085;` is U+1F95, an avocado emoji-range char — NOT subscript 5). Replaced with correct `&#8328;&#8325;` (₈₅) and `&#8329;&#8328;` (₉₈) throughout the file (tab bar, buttons, headings, log messages).
- **Heat Map (Tab 12)**: Rewrote JS — now stores word + prefix sums as module-level state for O(1) hover queries; added live hover tooltip showing exact position, half-length, both Parikh vectors and square status; added status bar text with square/near-miss counts; improved button labels; proper axis labels and legend.
- **Heat Map near-miss threshold**: Changed from `diff === 2` to `diff <= 2` so single-letter differences per position are also highlighted yellow.
- **evaluateMorphism()**: Fixed accidentally dropped closing `}` for inner while-loop body.

---

## 6. Priority Roadmap

### Phase 1 — Research Core (HIGH PRIORITY)
1. ~~Morphism Laboratory~~ ✅ Done
2. **Heat Map** — heatmap of A² square positions in long words
3. **Research Notebook** — localStorage persistence of experiments

### Phase 2 — Evolution & Discovery
4. **Evolution AI** — genetic algorithm morphism search (needs Web Worker)
5. **Discovery Mode** — autonomous exploration built on Evolution AI

### Phase 3 — Visual Enhancements
6. **Fractal Explorer** — zoomable 2D walk (compute on demand per zoom level)
7. **Complexity Landscape** — 2D color map: x=alphabet size, y=word length, color=difficulty
8. **Living Proof** — animated step-by-step proof of Keränen's theorem

### Phase 4 — Ambitious
9. Morphism Orchestra (Parikh vectors → polyphony)
10. Morphism Galaxy (PCA/UMAP of morphism space — needs Phase 2 data)
11. 3D Word Universe (WebGL — reconsider dependency rule first)

---

## 7. Heat Map — Implementation Notes

**What it shows:** For a long A²-free word (e.g. g85 iterated 3×), scan all positions and half-lengths. Color = whether an Abelian square exists at that (position, half-length) pair.

```
Canvas grid:
  x-axis: position in word (0 to N)
  y-axis: half-length of the pair being compared (1 to maxHalf)
  color:  green = no square, red = square found, yellow = "near miss" (Parikh diff = 1)
```

**Performance concern:** Full O(n³) scan is too slow for long words. Use progressive rendering with `requestAnimationFrame` and limit to first 2000 positions.

---

## 8. Evolution AI — Implementation Notes

**Must use Web Worker** to avoid blocking the UI. The worker file can be inlined as a Blob URL:

```javascript
const workerCode = `
  self.onmessage = function(e) {
    // genetic algorithm here
    // self.postMessage({ generation, bestScore, bestMorphism })
  }
`;
const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

**Fitness function:** Length of longest A²-free prefix when morphism is iterated from seed 'a'.

**Mutation operators:**
- Swap two letters in an image string
- Replace one letter with a random letter from {a,b,c,d}
- Rotate the image string by one position

**Constraint:** Only evaluate morphisms where all 4 images have equal length (uniform morphism) and Parikh vectors are cyclic permutations of each other.

---

## 9. Known Issues / Debt

- g98 string in code is 98 chars — verify against Keränen (2009) TCS paper before citing as definitive.
- Tree Search canvas does not resize gracefully on very wide screens.
- Unfavorable Factors left-extension uses suffix check on reversed string — mathematically equivalent but worth a note in comments.
- Knowledge Graph nodes can drift off-screen if window is small.

---

## 10. Local Source Material

```
C:\abc\teoria\   — Finnish research summaries (project memos, theory notes)
C:\abc\nettisivu\ — Saved Keränen web pages, Mathematica notebooks, images
```

Key files:
- `teoria/Keranen_Abelin_neliot_projektimuistio.txt` — full mathematical background in Finnish
- `teoria/Keranen_uudet_ideat_ja_promptit.txt` — visualization ideas and prompts
- `nettisivu/Structures & Programs & Graphics & Music of A-2-F Strings.html` — Keränen's own page

---

## 11. Agent Rules Summary

- Do not claim 3 letters can yield infinite A²-free word
- Do not replace g85 without citing a source
- Do not separate ordinary squares from Abelian squares without explaining the difference
- Mark experimental results clearly (user morphisms, AI-found morphisms)
- Prefer small, inspectable algorithms over opaque effects
- Verify before claiming: `g85(a)` has length 85, `g85(b/c/d)` are cyclic permutations

---

*This document should be updated after each major development session.*
