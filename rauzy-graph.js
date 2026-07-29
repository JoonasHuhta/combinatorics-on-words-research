'use strict';

/**
 * rauzy-graph.js
 * --------------
 * Exact Rauzy graphs and the special-factor structure behind the complexity
 * function, for every language this project studies.
 *
 * WHAT A RAUZY GRAPH IS
 * ---------------------
 * For a factorial language L, the Rauzy graph of order n has
 *   vertices = the factors of length n,
 *   an edge u -> v for every factor of length n+1 whose length-n prefix is u
 *   and whose length-n suffix is v.
 * So |V| = p(n) and |E| = p(n+1), exactly.
 *
 * A factor u is RIGHT-SPECIAL if it has more than one right extension in L
 * (out-degree >= 2), LEFT-SPECIAL if in-degree >= 2, and BISPECIAL if both.
 *
 * WHY THIS IS THE RIGHT INSTRUMENT
 * --------------------------------
 * factor-complexity.js established that the construction g3(h6^omega(a)) has
 * linear complexity with first differences s(n) = p(n+1) - p(n) between 6 and 8
 * (MATH_CLAIMS.md row 28), and left the structure behind those differences
 * unexamined. The identity
 *
 *     s(n) = sum over u in L_n of ( outdeg(u) - 1 )
 *
 * is exact - every length-(n+1) factor is one edge, and each vertex contributes
 * one edge "for free" - so s(n) counts exactly the surplus branching in the
 * graph. The differences are not a curiosity: they are a census of right-special
 * factors weighted by how special they are.
 *
 * The second difference is governed by bispecial factors. For a bispecial v let
 *
 *     m(v) = #{(a,b) : avb in L} - #{a : av in L} - #{b : vb in L} + 1
 *
 * be its bilateral multiplicity. Cassaigne's formula gives
 *
 *     s(n+1) - s(n) = sum over bispecial v of length n of m(v).
 *
 * This is used here as a VERIFICATION, not as a result: the bilateral orders are
 * computed from the factor sets independently of the complexity counts.
 *
 * The formula requires the language to be BIEXTENDABLE - every factor must have
 * at least one extension on each side. That is automatic for the factor set of
 * an infinite word, and it fails for a language of finite words with dead ends.
 * A first draft of this file treated any mismatch as proof that a factor set was
 * wrong, and threw with that message. It was wrong: for aa2f the factor sets are
 * correct and the hypothesis is simply absent from length 9 onwards. The check
 * now tests the hypothesis first and reports its failure as a property of the
 * language.
 *
 * WHAT IS EXACT, AND FOR WHICH LANGUAGE
 * -------------------------------------
 * For g3(h6^omega(a)) the factor sets come from factor-frequencies.js, which
 * enumerates the COMPLETE factor set of the infinite word at each length. Every
 * number below is therefore exact for the infinite word.
 *
 * For aa2f and aa2fr the language is the set of all finite words satisfying the
 * constraint, enumerated exhaustively. The graphs are exact for that language.
 * Note the distinction: a vertex may have out-degree > 0 in this graph and still
 * not extend to an infinite word. The Rauzy graph of the aa2f language does not
 * by itself answer Makela's question. See OPEN_RESEARCH_QUESTIONS.md A1.
 *
 * Usage:
 *   node rauzy-graph.js                 # structure report for all languages
 *   node rauzy-graph.js --dot 6         # Graphviz DOT of the order-6 graph
 *   node rauzy-graph.js --json
 */

const ff = require('./factor-frequencies.js');
const fc = require('./factor-complexity.js');

/* ------------------------------------------------------------------ *
 * Factor sets
 * ------------------------------------------------------------------ */

/** Complete length-n factor set of g3(h6^omega(a)). Exact for the infinite word. */
function constructionFactors(n) {
  return new Set(ff.ternaryFactorFrequencies(n).total.keys());
}

/**
 * All words of length n in a constraint language, by exhaustive DFS.
 * Exact for that length; the budget guards against runaway lengths rather than
 * silently truncating - it throws instead.
 */
function constraintFactors(lang, n, nodeBudget = 3e7) {
  const A = lang.alphabet.length;
  const out = new Set();
  const pre = Array.from({ length: A }, () => new Int32Array(n + 2));
  const word = new Int32Array(n + 2);
  let nodes = 0;

  const rec = (len) => {
    if (len === n) { out.add(Array.from(word.slice(0, n), c => lang.alphabet[c]).join('')); return; }
    for (let c = 0; c < A; c++) {
      if (++nodes > nodeBudget) throw new Error(`Enumeration of ${lang.key} at length ${n} exceeded the node budget; raise it or lower n rather than accepting a partial set.`);
      word[len] = c;
      for (let s = 0; s < A; s++) pre[s][len + 1] = pre[s][len] + (s === c ? 1 : 0);
      if (lang.ok(word, len + 1, pre, A)) rec(len + 1);
    }
  };
  rec(0);
  return out;
}

/* ------------------------------------------------------------------ *
 * Graph construction and special factors
 * ------------------------------------------------------------------ */

/**
 * Rauzy graph of order n from the length-n and length-(n+1) factor sets.
 * Returns degrees and the special-factor census.
 */
function rauzyGraph(Ln, Ln1) {
  const outdeg = new Map(), indeg = new Map();
  for (const u of Ln) { outdeg.set(u, 0); indeg.set(u, 0); }

  const edges = [];
  for (const w of Ln1) {
    const u = w.slice(0, w.length - 1);
    const v = w.slice(1);
    if (!outdeg.has(u) || !indeg.has(v)) {
      throw new Error(`Length-${w.length} factor "${w}" has an endpoint outside the length-${w.length - 1} factor set. The sets are inconsistent.`);
    }
    outdeg.set(u, outdeg.get(u) + 1);
    indeg.set(v, indeg.get(v) + 1);
    edges.push([u, v, w[w.length - 1]]);
  }

  const rightSpecial = [...outdeg].filter(([, d]) => d >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const leftSpecial = [...indeg].filter(([, d]) => d >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const rsSet = new Set(rightSpecial.map(([u]) => u));
  const bispecial = leftSpecial.filter(([u]) => rsSet.has(u)).map(([u]) => u);

  // s(n) = p(n+1) - p(n) = sum (outdeg - 1); computed both ways and compared
  let surplus = 0;
  for (const [, d] of outdeg) surplus += d - 1;
  const sFromCounts = Ln1.size - Ln.size;
  if (surplus !== sFromCounts) {
    throw new Error(`Surplus branching ${surplus} does not equal p(n+1) - p(n) = ${sFromCounts}. The graph and the factor counts disagree.`);
  }

  return { outdeg, indeg, edges, rightSpecial, leftSpecial, bispecial, s: surplus };
}

/**
 * Bilateral multiplicity of a factor v:
 *   m(v) = #{(a,b) : avb in L} - #{a : av in L} - #{b : vb in L} + 1
 * Needs the factor sets of lengths |v|+1 and |v|+2.
 */
function bilateralOrder(v, Ln1, Ln2, alphabet) {
  let pairs = 0, left = 0, right = 0;
  for (const a of alphabet) {
    if (Ln1.has(a + v)) left++;
    for (const b of alphabet) if (Ln2.has(a + v + b)) pairs++;
  }
  for (const b of alphabet) if (Ln1.has(v + b)) right++;
  return pairs - left - right + 1;
}

/** Is the graph strongly connected? Kosaraju, iterative. */
function stronglyConnected(Ln, edges) {
  if (Ln.size <= 1) return true;
  const adj = new Map(), radj = new Map();
  for (const u of Ln) { adj.set(u, []); radj.set(u, []); }
  for (const [u, v] of edges) { adj.get(u).push(v); radj.get(v).push(u); }

  const visit = (start, graph) => {
    const seen = new Set([start]);
    const stack = [start];
    while (stack.length) {
      const x = stack.pop();
      for (const y of graph.get(x)) if (!seen.has(y)) { seen.add(y); stack.push(y); }
    }
    return seen.size;
  };
  const start = Ln.values().next().value;
  return visit(start, adj) === Ln.size && visit(start, radj) === Ln.size;
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const padL = (s, n) => String(s).padStart(n);

function analyse(name, factorsOf, alphabet, range, opts = {}) {
  const line = '='.repeat(78);
  console.log(line);
  console.log(name);
  console.log(line);
  console.log('   n   |V|=p(n)  |E|=p(n+1)   s(n)   right-spec  left-spec  bispec  conn');
  console.log('  ' + '-'.repeat(72));

  const rows = [];
  const cache = new Map();
  const get = (n) => { if (!cache.has(n)) cache.set(n, factorsOf(n)); return cache.get(n); };

  for (const n of range) {
    const Ln = get(n), Ln1 = get(n + 1);
    if (Ln.size === 0 || Ln1.size === 0) continue;
    const g = rauzyGraph(Ln, Ln1);
    const conn = opts.checkConnectivity === false ? '-' : (stronglyConnected(Ln, g.edges) ? 'yes' : 'NO');
    console.log(`  ${padL(n, 2)}   ${padL(Ln.size, 8)}  ${padL(Ln1.size, 10)}  ${padL(g.s, 5)}   ${padL(g.rightSpecial.length, 10)}  ${padL(g.leftSpecial.length, 9)}  ${padL(g.bispecial.length, 6)}  ${conn}`);
    rows.push({ n, p: Ln.size, p1: Ln1.size, s: g.s, g, Ln, Ln1 });
  }
  console.log('');
  return { rows, get };
}

/**
 * How many length-n factors cannot be extended to the right / to the left
 * inside the language.
 *
 * This is the hypothesis Cassaigne's formula needs. It holds automatically for
 * the factor set of an infinite word, where every factor occurs somewhere with
 * something on both sides. It does NOT hold for a language of finite words with
 * dead ends, and the aa2f language has exactly that.
 */
function extendabilityCensus(Ln, Ln1, alphabet) {
  let noRight = 0, noLeft = 0;
  for (const u of Ln) {
    let r = 0, l = 0;
    for (const a of alphabet) { if (Ln1.has(u + a)) r++; if (Ln1.has(a + u)) l++; }
    if (r === 0) noRight++;
    if (l === 0) noLeft++;
  }
  return { noRight, noLeft, biextendable: noRight === 0 && noLeft === 0 };
}

/**
 * Cassaigne's second-difference formula, applied only where its hypothesis holds.
 *
 * Where the language is biextendable this is a strong independent check: the
 * bilateral orders are computed from the factor sets by a different route than
 * the complexity counts, and the two must agree.
 *
 * Where it fails to hold, that is reported as a property of the LANGUAGE rather
 * than treated as an error. An earlier version of this file threw on mismatch
 * with the message "the factor sets are wrong"; they were not. The factor sets
 * were right and the hypothesis was absent.
 */
function verifyCassaigne(rows, get, alphabet, name) {
  console.log('  Cassaigne check: where the language is biextendable, s(n+1) - s(n)');
  console.log('  must equal the sum of bilateral multiplicities over the bispecial');
  console.log('  factors of length n.');
  console.log('    n   s(n+1)-s(n)   sum m(v)   biextendable   agree');
  let checked = 0, failedWhereValid = false, firstDeadEnd = null;

  for (let i = 0; i + 1 < rows.length; i++) {
    const { n, g } = rows[i];
    if (rows[i + 1].n !== n + 1) continue;
    const Ln1 = get(n + 1), Ln2 = get(n + 2);
    if (!Ln2 || Ln2.size === 0) continue;

    const ext = extendabilityCensus(rows[i].Ln, Ln1, alphabet);
    const extN1 = extendabilityCensus(Ln1, Ln2, alphabet);
    const valid = ext.biextendable && extN1.biextendable;
    if (!valid && firstDeadEnd === null) {
      firstDeadEnd = ext.biextendable ? { n: n + 1, ...extN1 } : { n, ...ext };
    }

    const delta = rows[i + 1].s - g.s;
    let sum = 0;
    for (const v of g.bispecial) sum += bilateralOrder(v, Ln1, Ln2, alphabet);
    const ok = sum === delta;
    if (valid) { checked++; if (!ok) failedWhereValid = true; }
    console.log(`   ${padL(n, 2)}   ${padL(delta, 11)}   ${padL(sum, 8)}   ${padL(valid ? 'yes' : 'no', 12)}   ${valid ? (ok ? 'yes' : 'NO') : '(n/a)'}`);
  }

  if (failedWhereValid) {
    throw new Error(`Cassaigne's formula failed for ${name} at a length where the language IS biextendable. That is a real inconsistency: the factor sets and the special-factor census disagree.`);
  }
  console.log(`  Formula holds at all ${checked} lengths where its hypothesis applies.`);
  if (firstDeadEnd) {
    console.log('');
    console.log(`  DEAD ENDS: at length ${firstDeadEnd.n} this language first contains factors that`);
    console.log(`  cannot be extended at all - ${firstDeadEnd.noRight} with no right extension, ${firstDeadEnd.noLeft} with no left.`);
    console.log('  These are words in the language that no longer word contains. Cassaigne\'s');
    console.log('  hypothesis fails from here on, which is a fact about the language, not a');
    console.log('  defect in the computation.');
    console.log('  This is the invariant form of "where the constraint bites": a dead end here');
    console.log('  is a property of the language, unlike a dead end in a depth-first search,');
    console.log('  which is a property of the traversal order.');
  }
  console.log('');
  return { checked, firstDeadEnd };
}

function dot(Ln, edges, title) {
  const lines = ['digraph Rauzy {', '  rankdir=LR;', '  node [shape=circle, fontsize=9];',
    `  label="${title}"; labelloc=t;`];
  for (const [u, v, ch] of edges) lines.push(`  "${u}" -> "${v}" [label="${ch}"];`);
  lines.push('}');
  return lines.join('\n');
}

function main() {
  const argv = process.argv.slice(2);
  const dotIdx = argv.indexOf('--dot');

  const S3 = ['a', 'b', 'c'];
  const byKey = Object.fromEntries(fc.LANGUAGES.map(L => [L.key, L]));

  if (dotIdx >= 0) {
    const n = parseInt(argv[dotIdx + 1], 10) || 6;
    const Ln = constructionFactors(n), Ln1 = constructionFactors(n + 1);
    const g = rauzyGraph(Ln, Ln1);
    console.log(dot(Ln, g.edges, `g3(h6^w(a)), order ${n}: ${Ln.size} vertices, ${Ln1.size} edges`));
    return;
  }

  console.log('');
  console.log('RAUZY GRAPHS AND SPECIAL-FACTOR STRUCTURE');
  console.log('s(n) = p(n+1) - p(n) = surplus branching = sum over vertices of (outdeg - 1).');
  console.log('');

  // --- the construction: exact for the infinite word ----------------------
  const a1 = analyse(
    'g3(h6^omega(a))   [EXACT for the infinite word - complete factor sets]',
    constructionFactors, S3, Array.from({ length: 18 }, (_, i) => i + 1));
  verifyCassaigne(a1.rows, a1.get, S3, "g3(h6^omega(a))");

  const rs = a1.rows.filter(r => r.n >= 8);
  const degs = new Set();
  for (const r of rs) for (const [, d] of r.g.rightSpecial) degs.add(d);
  console.log('  Reading the structure behind MATH_CLAIMS.md row 28:');
  console.log(`    right-special factors carry out-degree in {${[...degs].sort().join(', ')}} for n >= 8,`);
  console.log(`    and their count per length is ${[...new Set(rs.map(r => r.g.rightSpecial.length))].sort((x, y) => x - y).join(' or ')}.`);
  console.log(`    Since s(n) = sum (outdeg - 1), the differences 6..8 are exactly this census:`);
  console.log(`    a fixed small set of branch points, not a smoothly varying quantity.`);
  console.log('');
  console.log('  Strong connectivity at every order is what uniform recurrence looks like');
  console.log('  in this presentation: from any factor one can reach any other.');
  console.log('');

  // --- the constraint languages -------------------------------------------
  for (const key of ['aa2f', 'aa2fr']) {
    const L = byKey[key];
    const a = analyse(
      `${L.label}   [EXACT for the language of finite words]`,
      (n) => constraintFactors(L, n),
      L.alphabet, Array.from({ length: 11 }, (_, i) => i + 1));
    verifyCassaigne(a.rows, a.get, L.alphabet, L.key);
  }

  console.log('='.repeat(78));
  console.log('SCOPE');
  console.log('='.repeat(78));
  console.log('  For g3(h6^omega(a)) every figure is exact for the INFINITE word: the factor');
  console.log('  sets are complete, not sampled from a prefix.');
  console.log('');
  console.log('  For aa2f and aa2fr the graphs describe the language of FINITE words. A');
  console.log('  vertex can have positive out-degree and still not extend to an infinite');
  console.log('  word, so these graphs do not answer Makela\'s question. They do give the');
  console.log('  invariant version of "where does the constraint bite", which the');
  console.log('  search-order telemetry in OPEN_RESEARCH_QUESTIONS.md section C cannot.');
  console.log('');
}

if (require.main === module) main();

module.exports = { constructionFactors, constraintFactors, rauzyGraph, bilateralOrder, stronglyConnected, extendabilityCensus, dot };
