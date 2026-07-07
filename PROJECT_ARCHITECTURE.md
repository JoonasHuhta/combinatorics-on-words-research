# Search for Abelian Square-Free Words — Project Architecture

## 1. Overview
This project visualizes the research of Finnish mathematician Veikko Keränen on abelian square-free words. In 1992, Keränen proved that an alphabet of 4 letters is sufficient to construct an infinite word without any abelian squares, solving an open problem posed by Paul Erdős in 1961.

This directory (`C:\abc`) contains research material and an interactive HTML/JS visualization built with an academic, clean aesthetic (Times New Roman, clear color-coded dots). The visualization not only shows the results but physically models the algorithmic calculation process (search trees, sliding window checks).

## 2. Abelian Squares and Parikh Vectors
- **Abelian Square:** A word `uv` where both halves contain the exact same quantity of each letter (e.g., "abba" -> 2xb, 2xa).
- **Parikh Vector:** An ordered list of letter frequencies, e.g., `(a,b,c)` -> `(1,2,0)`. If two adjacent substrings have equal Parikh vectors, they form an abelian square.

## 3. Application Architecture (`index.html`)
The application is a single-page HTML5 program with no external dependencies. It utilizes the native DOM API, Canvas API, and Web Audio API.

### Key Variables and Structures
- `G85_A`: Keränen's 85-character substitution for the letter 'a'.
- `G85`: An object containing the substitutions for {a,b,c,d}. (b, c, and d are derived via cyclic permutations of a).
- **Letter Color Codes:**
  - **a:** `#e74c3c` (Red/Orange)
  - **b:** `#2980b9` (Blue)
  - **c:** `#f1c40f` (Yellow)
  - **d:** `#27ae60` (Green)
- `getParikh(word, alphabet)`: Generates a Parikh vector object.
- `parikhEqual(p1, p2)`: Compares two Parikh vectors.

### Implemented Tabs (Modes)
1. **3-Letter (Impossibility Search):** 
   - Uses a backtracking algorithm (`ThreeLetterSearch`) to attempt constructing a word with {a,b,c}.
   - **Visualization:** Shows the real-time sliding window checking for Parikh vector equality, and draws a search tree on an HTML5 Canvas to illustrate the combinatorial explosion and inevitable backtracking (pigeonhole principle).
2. **4-Letter (Keränen's g85):** Applies the $g_{85}$ morphism, instantly expanding the sequence while keeping it abelian square-free.
3. **2D Condensed View (Canvas):** Displays the letters as stacked dots on a 2D canvas, wrapping around to handle massive strings (e.g., 7225+ characters) efficiently.
4. **Sonification (Music):** Translates the string into a melody using the Web Audio API, where each letter corresponds to a distinct musical note.

## 4. Future Development Roadmap for AI Agents
If you are an AI tasked with extending this project, consider the following:
- **k-Abelian Squares:** Avoiding abelian squares with 3 letters is possible if the rules are relaxed to "k-abelian squares" (comparing occurrences of factors of length k instead of single letters). Add a mode for this.
- **Enhanced 3D Parikh Visualizer:** Create a 3D coordinate system to plot the Parikh vectors as the 3-letter search runs, visually proving why the path is forced to intersect itself.
- **Code Separation:** If the application exceeds 1000 lines, extract the CSS into `style.css` and JavaScript into `main.js` to maintain readability.

## 5. How to Run
Simply open `index.html` in a web browser. No local web server is required as all assets are inline.

## 6. 2026-07-07 Update: ABC Laboratory

The app now includes an additional `ABC Laboratory` mode. Its purpose is to make the 3-letter impossibility result concrete before moving to Keranen's 4-letter `g85` construction.

The laboratory:

- enumerates finite words over `{a,b,c}`,
- keeps only prefixes that avoid Abelian squares,
- shows that no fully Abelian square-free word reaches length 8,
- lists failed length-8 extensions,
- lets the user click a survivor or failed extension,
- highlights the exact adjacent halves whose Parikh vectors collide.

This mode should be treated as the conceptual bridge between the animated search tree and the 4-letter morphism mode. It explains why the fourth letter is not decorative: it is the mathematical escape from a finite obstruction in the 3-letter case.

Future agents should also read:

- `AGENT_CONCEPT_BRIEF.md`
- `DEVELOPMENT_ROADMAP.md`
