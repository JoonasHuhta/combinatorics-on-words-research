# Search for Abelian Square-Free Words — Project Architecture

## 1. Overview
This project visualizes the research of Finnish mathematician Veikko Keränen on abelian square-free words. In 1992, Keränen proved that an alphabet of 4 letters is sufficient to construct an infinite word without any abelian squares, solving an open problem posed by Paul Erdős in 1961.

This directory (`C:\abc`) contains an interactive single-page HTML/JS application built with an academic, clean aesthetic. The application is completely dependency-free (no external libraries like React, D3, or Tailwind). It models the mathematical rules (Parikh vectors, Abelian squares) and provides exploratory modes to interact with them.

## 2. Core Mathematical Concepts
- **Abelian Square:** A word `uv` where both halves contain the exact same quantity of each letter (e.g., "abba" -> 2xb, 2xa).
- **Parikh Vector:** An ordered list of letter frequencies, e.g., `(a,b,c)` -> `(1,2,0)`. If two adjacent substrings have equal Parikh vectors, they form an abelian square.
- **Unfavorable Factors (Left/Right Limits):** Concepts from Keränen's 2010 paper. Shows how far a finite seed word can be extended to the left or right before an abelian square is inevitably forced.

## 3. Application Architecture (`index.html`)
The application is a single monolithic HTML file. It uses native DOM APIs, Canvas for rendering graphs, and Web Audio API for sonification. 

### Global State & Core Logic
- `fourLetterWord`: The primary string sequence currently being analyzed.
- `mode`: The active tab (determines which UI panels are visible).
- `getParikh(word, alphabet)`: Generates a Parikh vector object dynamically (supports 3-letter or 4-letter alphabets).
- `parikhEqual(p1, p2)`: Checks equality between vectors.
- `findAbelianSquare(word, alphabet)` and `findSuffixAbelianSquare(word, alphabet)`: The core checking engines.

### UI State Management (The `switchMode` Registry)
Navigation between tabs is handled by the `switchMode(newMode)` function. 
Because the application resides in a single file to prevent dependency issues, `switchMode` acts as the router:
1. It pauses active processes (like audio or tree searches).
2. It hides all primary view panels (`view-*`).
3. It selectively unhides the panels and buttons specific to `newMode`.
*Note for Developers:* When adding a new tab, add a `view-newmode` panel in HTML and handle it in `switchMode`. DO NOT split `index.html` into separate files unless the size becomes unmanageable, to prevent context switching bugs.

## 4. The 8 Modes (Tabs)
1. **3 Letters (Tree Search):** A backtracking algorithm generating an animated search tree to prove that no 3-letter word avoids abelian squares past length 7.
2. **ABC Laboratory:** Enumerates all finite 3-letter words, showing survivors and failed extensions (collisions highlighted).
3. **4 Letters (Morphism g85):** Applies Keränen's $g_{85}$ substitution recursively.
4. **Condensed 2D View:** Canvas renderer for displaying massive strings (thousands of characters) as wrapped colored dots.
5. **Sonification:** Web Audio API translation of the string (a=C4, b=E4, c=G4, d=A4, forming Cmaj6).
6. **Try It Yourself:** Interactive widget where users can manually type words (a/b/c/d) and watch the Parikh grid calculate adjacent halves in real-time. Collisions are instantly flagged in red.
7. **Historical Timeline:** Visual bar chart of the alphabet size reduction over time (Thue 1906 → Erdős 1961 → Evdokimov 25 → Pleasants 5 → Keränen 4).
8. **Unfavorable Factors:** Interactive tool that extends a given seed word (e.g., Keränen's 2010 examples) left and right until an abelian square forces a dead end, visualizing the limits as bar charts.

## 5. Future Development / Scale
If continuing development, prioritize adding new tools as standalone `view-` panels in the DOM. 
The next planned feature (Morphism Microscope) should compare the hardcoded `G85` morphism with the newer `G98` morphism.

See `DEVELOPMENT_ROADMAP.md` for prioritized feature ideas.
