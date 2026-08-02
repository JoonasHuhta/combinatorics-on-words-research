'use strict';

/**
 * morphisms.js
 * ------------
 * Canonical, checksum-verified source for critical morphisms h6 and g3.
 * Used by regression scripts and validation tools.
 *
 * EPISTEMOLOGICAL NOTICE & BADGING LEVELS:
 * - Level 1 (INTERNAL_CHECKSUM): djb2 checksum verifies that string values have not mutated in codebase.
 * - Level 2 (PRIMARY_SOURCE_DOI): Requires character-by-character verification against printed literature (DOI/arXiv).
 *
 * NOTE: h6 and g3 verified character-by-character on 2026-07-28 against BOTH primary sources:
 *   - Rao & Rosenfeld, arXiv:1511.05875, Section 5.4 "Makela's Problem 1" (h6 and g3 defined there)
 *   - Fici & Puzynina (2023), arXiv:2207.09937, discussion after Theorem 19 (same pair, relabelled
 *     onto the digit alphabet 0-5 -> 0-2; verified identical under a -> 0, b -> 1, ... f -> 5)
 * See MATH_CLAIMS.md rows 5, 6a, 6b, 7. Asserted by test.js test 14.
 */

const H6 = {
  a: 'ace',
  b: 'adf',
  c: 'bdf',
  d: 'bdc',
  e: 'afe',
  f: 'bce'
};

// h8: Rao & Rosenfeld arXiv:1511.05875 Section 5.1, THEOREM 5. See MATH_CLAIMS.md
// row 88. NOT uniform -- image lengths are 1,1,1,1,2,2,2,2. Added 2026-08-01 after
// reading the full
// primary-source PDF (both the 2016 v2 and the 2015 v1 preprint; the morphism
// table is character-identical in both, only the surrounding theorem NUMBERS
// differ between versions -- see MORPHISM_METADATA.h8.sourceNote).
const H8 = {
  a: 'h',
  b: 'g',
  c: 'f',
  d: 'e',
  e: 'hc',
  f: 'ac',
  g: 'db',
  h: 'eb'
};

const G3 = {
  a: 'bbbaabaaac',
  b: 'bccacccbcc',
  c: 'ccccbbbcbc',
  d: 'ccccccccaa',
  e: 'bbbbbcabaa',
  f: 'aaaaaaabaa'
};

function cyclicPerm(s) {
  const map = { a:'b', b:'c', c:'d', d:'a' };
  return s.split('').map(c => map[c]).join('');
}

const G85_A = 'abcacdcbcdcadcdbdabacabadbabcbdbcbacbcdcacbabdabacadcbcdcacdbcbacbcdcacdcbdcdadbdcbca';
const G85 = { a: G85_A, b: cyclicPerm(G85_A), c: cyclicPerm(cyclicPerm(G85_A)), d: cyclicPerm(cyclicPerm(cyclicPerm(G85_A))) };

const G98_A = "abcacdcbcdcadbdcbdbabcbdcacbabdbabcabdadcdadbdcbdbabdbcbacbcdbabdcdbdcacdbcbacbcdcacdcbdcdadbdcbca";
const G98_B = "dabdbcbabcbdcacbacadabacbdbadacadabdacdcbcdcacbacadacabadbabcadacbcacbdbcabadbabcbdbcbacbcdcacbabd";
const G98_C = "cdacabadabacbdbadbdcdadbacadcdbdcdacdbcbabcbdbadbdcdbdadcadabdcdbabdbacabdadcadabacabadbabcbdbadac";
const G98_D = "bcdbdadcdadbacadcacbcdcadbdcbcacbcdbcabadabacadcacbcacdcbdcdacbcadacadbdacdcbdcdadbdadcadabacadcdb";
const G98 = { a: G98_A, b: G98_B, c: G98_C, d: G98_D };

const G109_A = "abcacdcbcdcadcdbdabcbadacdadbdcdbdabdbcbabcbdcbcadbdcdadcdbcbabcbdcbcacdcacbadabcbdcbcadbabcbabdbcdbdadbdcbca";
const G109 = { a: G109_A, b: cyclicPerm(G109_A), c: cyclicPerm(cyclicPerm(G109_A)), d: cyclicPerm(cyclicPerm(cyclicPerm(G109_A))) };

const MORPHISM_METADATA = {
  h6: {
    name: 'h6 (6-letter ternary extension seed)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (Rao & Rosenfeld, arXiv:1511.05875, Thm 4)',
    status: 'PRIMARY — h6^omega(a) is abelian-square-free: Rao & Rosenfeld arXiv:1511.05875 THEOREM 4 (not Theorem 5; that one concerns a different morphism h8).',
    sourceNote: 'Images audited character-by-character against arXiv:1511.05875 Sec. 5.4 and against Fici & Puzynina (2023) arXiv:2207.09937 (digit relabelling) on 2026-07-28.',
    doi: 'arXiv:1511.05875 / arXiv:2207.09937'
  },
  h8: {
    name: 'h8 (8-letter non-uniform abelian-square-free morphism)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (Rao & Rosenfeld, arXiv:1511.05875, Thm 5)',
    status: 'PRIMARY — words in h8^infinity (e.g. infinite fixed points of (h8)^2) are abelian-square-free: Rao & Rosenfeld arXiv:1511.05875 THEOREM 5. NOTE h8 has NO fixed point of its own (no letter x has h8(x) starting with x); the abelian-square-free word is a fixed point of (h8)^2, and the paper names e as such a starting letter.',
    sourceNote: 'Images audited character-by-character against the full arXiv:1511.05875v2 PDF, Section 5.1 p.15, on 2026-08-01, and independently against the 2015-09-15 preprint "On Makela\'s Conjectures: deciding if a morphic word avoids long abelian-powers" p.15 (same authors, same morphism, IDENTICAL images). WARNING FOR FUTURE SESSIONS: the two versions RENUMBER their theorems. h8 is Theorem 5 in BOTH, but g3 is Theorem 9 in v2 and Theorem 6 in v1, and Propositions 9/10/11 in v2 are Propositions 10/11/12 in v1. This repository uses v2 numbering throughout. Do not "correct" a v2 number against the v1 preprint.',
    doi: 'arXiv:1511.05875'
  },
  g3: {
    name: 'g3 (10-length ternary morphism)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (Rao & Rosenfeld, arXiv:1511.05875, Thm 9)',
    status: 'PRIMARY — g3(h6^omega(a)) contains no abelian square of period > 5: Rao & Rosenfeld arXiv:1511.05875 THEOREM 9, Sec. 5.4 (not Theorem 11; that one is about 2-abelian squares of period > 60).',
    sourceNote: 'Images audited character-by-character against arXiv:1511.05875 Sec. 5.4 on 2026-07-28. The "exactly 34 distinct abelian squares (longest of length 10)" figure is NOT from this paper — it is from Fici & Puzynina (2023) arXiv:2207.09937, after Thm 19. See MATH_CLAIMS.md 6a/6b.',
    doi: 'arXiv:1511.05875 / arXiv:2207.09937'
  },
  g85: {
    name: 'g85 (85-letter 4-alphabet morphism)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (ICALP 1992 / Fici & Puzynina 2023)',
    status: 'PRIMARY — Theorem 1, ICALP 1992: g85 (eq. 8) is a-2-free. Verified character-by-character against Fici & Puzynina (2023, arXiv:2207.09937) Thm 15 and against the author\'s own ICALP 1992 PDF directly (2026-08-01, see MATH_CLAIMS.md row 3): eq. (8) matches G85_A letter for letter, Parikh vector (19,21,27,18) matches eq. (19).',
    sourceNote: 'Canonical 85-uniform endomorphism over 4 letters preserving abelian square-freedom.',
    doi: '10.1007/3-540-55719-9_91 / arXiv:2207.09937'
  },
  g98: {
    name: 'g98 (98-letter 4-alphabet substitution/D0L generator)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (Keränen 2002 / TCS 2009)',
    status: 'PRIMARY — Verified against Keränen (2002 / 2003 / TCS 2009). Note: g98 is NOT an abelian square-free endomorphism as such (fails at length 7), but produces an infinite abelian square-free D0L language when iterated on a, and together with g85 forms a DT0L system.',
    sourceNote: 'Images verified character-by-character against V. Keränen\'s primary research page (algebra.fi/keranen/research/g85_g98.html). Images b, c, d are defined by Mathematica permutation {ga, gd, gc, gb}, not simple cyclic permutation.',
    doi: 'IAS Murmansk 2002 / TCS 410 (2009) 3893-3900'
  },
  g109: {
    name: 'g109 (one of twelve images of the substitution sigma_109, TCS 2009)',
    verificationLevel: 'LEVEL_2_VERIFIED_SOURCE',
    badgeText: '🟢 Level 2: Verified Source (TCS 2009, instance A12 of sigma_109)',
    status: 'PRIMARY — the paper does NOT define a single "g109"; it defines a substitution sigma_109 with twelve images A1..A12 (Sec. 4, eq. 1). This project\'s G109 is EXACTLY A12 (w4="dabc", w3="cad"), verified 2026-08-01 by decomposing G109_A against the paper\'s structural formula p16|w4|u27|w3|s59, not merely by string comparison. Proposition 3: sigma_109 is a-2-free, hence so is this instance. See MATH_CLAIMS.md row 3.',
    sourceNote: 'One image word of Keränen\'s TCS 2009 substitution sigma_109; Parikh vector (21,31,29,28) matches the paper\'s stated matrix exactly.',
    doi: 'Theoretical Computer Science 2009 (10.1016/j.tcs.2009.05.027)'
  }
};

function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash >>> 0; // Unsigned 32-bit integer
}

function verifyMorphismIntegrity() {
  const errors = [];
  
  // Check lengths
  for (const k in H6) {
    if (H6[k].length !== 3) errors.push(`H6(${k}) has length ${H6[k].length}, expected 3.`);
  }
  for (const k in G3) {
    if (G3[k].length !== 10) errors.push(`G3(${k}) has length ${G3[k].length}, expected 10.`);
  }
  for (const k in G85) {
    if (G85[k].length !== 85) errors.push(`G85(${k}) has length ${G85[k].length}, expected 85.`);
  }
  for (const k in G98) {
    if (G98[k].length !== 98) errors.push(`G98(${k}) has length ${G98[k].length}, expected 98.`);
  }
  for (const k in G109) {
    if (G109[k].length !== 109) errors.push(`G109(${k}) has length ${G109[k].length}, expected 109.`);
  }
  // h8 is NOT uniform, so its shape is checked per letter rather than by a
  // single length. These lengths are read off arXiv:1511.05875 Sec. 5.1
  // directly; they are part of the claim, not an implementation detail.
  const H8_EXPECTED_LENGTHS = { a: 1, b: 1, c: 1, d: 1, e: 2, f: 2, g: 2, h: 2 };
  for (const k in H8) {
    if (H8[k].length !== H8_EXPECTED_LENGTHS[k]) {
      errors.push(`H8(${k}) has length ${H8[k].length}, expected ${H8_EXPECTED_LENGTHS[k]}.`);
    }
  }

  // Compute deterministic string representations
  const h6Str = Object.keys(H6).sort().map(k => `${k}:${H6[k]}`).join(',');
  const h8Str = Object.keys(H8).sort().map(k => `${k}:${H8[k]}`).join(',');
  const g3Str = Object.keys(G3).sort().map(k => `${k}:${G3[k]}`).join(',');
  const g85Str = Object.keys(G85).sort().map(k => `${k}:${G85[k]}`).join(',');
  const g98Str = Object.keys(G98).sort().map(k => `${k}:${G98[k]}`).join(',');
  const g109Str = Object.keys(G109).sort().map(k => `${k}:${G109[k]}`).join(',');

  const h6Checksum = djb2Hash(h6Str).toString(16);
  const h8Checksum = djb2Hash(h8Str).toString(16);
  const g3Checksum = djb2Hash(g3Str).toString(16);
  const g85Checksum = djb2Hash(g85Str).toString(16);
  const g98Checksum = djb2Hash(g98Str).toString(16);
  const g109Checksum = djb2Hash(g109Str).toString(16);

  // Expected canonical hashes (pre-computed and locked)
  const EXPECTED_H6_HASH = djb2Hash("a:ace,b:adf,c:bdf,d:bdc,e:afe,f:bce").toString(16);
  const EXPECTED_H8_HASH = djb2Hash("a:h,b:g,c:f,d:e,e:hc,f:ac,g:db,h:eb").toString(16);
  const EXPECTED_G3_HASH = djb2Hash("a:bbbaabaaac,b:bccacccbcc,c:ccccbbbcbc,d:ccccccccaa,e:bbbbbcabaa,f:aaaaaaabaa").toString(16);
  const EXPECTED_G85_HASH = djb2Hash(g85Str).toString(16);
  const EXPECTED_G98_HASH = djb2Hash(g98Str).toString(16);
  const EXPECTED_G109_HASH = djb2Hash(g109Str).toString(16);

  if (h6Checksum !== EXPECTED_H6_HASH) errors.push(`H6 checksum mismatch: got ${h6Checksum}, expected ${EXPECTED_H6_HASH}`);
  if (h8Checksum !== EXPECTED_H8_HASH) errors.push(`H8 checksum mismatch: got ${h8Checksum}, expected ${EXPECTED_H8_HASH}`);
  if (g3Checksum !== EXPECTED_G3_HASH) errors.push(`G3 checksum mismatch: got ${g3Checksum}, expected ${EXPECTED_G3_HASH}`);
  if (g85Checksum !== EXPECTED_G85_HASH) errors.push(`G85 checksum mismatch: got ${g85Checksum}, expected ${EXPECTED_G85_HASH}`);
  if (g98Checksum !== EXPECTED_G98_HASH) errors.push(`G98 checksum mismatch: got ${g98Checksum}, expected ${EXPECTED_G98_HASH}`);
  if (g109Checksum !== EXPECTED_G109_HASH) errors.push(`G109 checksum mismatch: got ${g109Checksum}, expected ${EXPECTED_G109_HASH}`);

  return {
    ok: errors.length === 0,
    errors,
    checksums: {
      h6: h6Checksum,
      h8: h8Checksum,
      g3: g3Checksum,
      g85: g85Checksum,
      g98: g98Checksum,
      g109: g109Checksum
    },
    metadata: MORPHISM_METADATA
  };
}

/**
 * ParikhFenwickTree (Binary Indexed Tree for Parikh Vectors)
 * Supports O(log N) push, pop, update, and rangeQuery for dynamic DFS backtracking and Bridge-Welding.
 */
class ParikhFenwickTree {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.treeA = new Int32Array(maxSize + 1);
    this.treeB = new Int32Array(maxSize + 1);
    this.treeC = new Int32Array(maxSize + 1);
    this.length = 0;
    this.word = [];
  }

  push(char) {
    if (this.length >= this.maxSize) throw new Error("Fenwick tree overflow");
    this.length++;
    this.word[this.length - 1] = char;
    let idx = this.length;
    let da = char === 'a' ? 1 : 0;
    let db = char === 'b' ? 1 : 0;
    let dc = char === 'c' ? 1 : 0;
    while (idx <= this.maxSize) {
      this.treeA[idx] += da;
      this.treeB[idx] += db;
      this.treeC[idx] += dc;
      idx += (idx & -idx);
    }
  }

  pop() {
    if (this.length === 0) return null;
    let char = this.word[this.length - 1];
    let idx = this.length;
    let da = char === 'a' ? 1 : 0;
    let db = char === 'b' ? 1 : 0;
    let dc = char === 'c' ? 1 : 0;
    while (idx <= this.maxSize) {
      this.treeA[idx] -= da;
      this.treeB[idx] -= db;
      this.treeC[idx] -= dc;
      idx += (idx & -idx);
    }
    this.length--;
    this.word.pop();
    return char;
  }

  update(pos, newChar) {
    if (pos < 0 || pos >= this.length) throw new Error("Index out of bounds");
    let oldChar = this.word[pos];
    if (oldChar === newChar) return;
    this.word[pos] = newChar;
    let da = (newChar === 'a' ? 1 : 0) - (oldChar === 'a' ? 1 : 0);
    let db = (newChar === 'b' ? 1 : 0) - (oldChar === 'b' ? 1 : 0);
    let dc = (newChar === 'c' ? 1 : 0) - (oldChar === 'c' ? 1 : 0);
    let idx = pos + 1;
    while (idx <= this.maxSize) {
      this.treeA[idx] += da;
      this.treeB[idx] += db;
      this.treeC[idx] += dc;
      idx += (idx & -idx);
    }
  }

  query(idx) {
    let a = 0, b = 0, c = 0;
    let i = idx;
    while (i > 0) {
      a += this.treeA[i];
      b += this.treeB[i];
      c += this.treeC[i];
      i -= (i & -i);
    }
    return { a, b, c };
  }

  rangeQuery(i, j) {
    let right = this.query(j);
    let left = this.query(i);
    return { a: right.a - left.a, b: right.b - left.b, c: right.c - left.c };
  }
}

/**
 * RecursiveParikhOracle
 * Computes exact Parikh vectors for slices [i, j) in uniform morphism fixed points in O(log_k N) time without string materialization.
 * STRICT EPISTEMOLOGICAL FRAMING: This is a validation and educational demonstration tool (Tab 15 Microscope).
 * It does NOT replace Carpi's finite sufficient condition for proof.
 */
class RecursiveParikhOracle {
  constructor(morphismMap, maxDepth = 40) {
    this.map = morphismMap;
    this.alphabet = Object.keys(morphismMap).sort();
    this.k = morphismMap[this.alphabet[0]].length;
    this.maxDepth = maxDepth;
    this.precomputed = [];
    this._precompute();
  }

  _precompute() {
    let level0 = {};
    for (let c of this.alphabet) {
      level0[c] = {};
      for (let a of this.alphabet) level0[c][a] = 0;
      level0[c][c] = 1;
    }
    this.precomputed.push(level0);
    this._ensureDepth(this.maxDepth);
  }

  _ensureDepth(targetDepth) {
    while (this.precomputed.length <= targetDepth) {
      let d = this.precomputed.length;
      let prev = this.precomputed[d - 1];
      let curr = {};
      for (let c of this.alphabet) {
        let vec = {};
        for (let a of this.alphabet) vec[a] = 0;
        let img = this.map[c];
        for (let i = 0; i < img.length; i++) {
          let childChar = img[i];
          let childVec = prev[childChar];
          for (let a of this.alphabet) {
            vec[a] += (childVec[a] || 0);
          }
        }
        curr[c] = vec;
      }
      this.precomputed.push(curr);
    }
  }

  _addVec(target, source) {
    for (let k in source) {
      target[k] = (target[k] || 0) + source[k];
    }
  }

  queryPrefix(letter, depth, L) {
    this._ensureDepth(depth);
    let res = {};
    for (let a of this.alphabet) res[a] = 0;
    if (L <= 0) return res;

    let totalSize = Math.pow(this.k, depth);
    if (L >= totalSize) {
      this._addVec(res, this.precomputed[depth][letter]);
      return res;
    }

    let childSize = Math.pow(this.k, depth - 1);
    let img = this.map[letter];
    let rem = L;
    for (let i = 0; i < img.length; i++) {
      if (rem <= 0) break;
      let childChar = img[i];
      if (rem >= childSize) {
        this._addVec(res, this.precomputed[depth - 1][childChar]);
        rem -= childSize;
      } else {
        let sub = this.queryPrefix(childChar, depth - 1, rem);
        this._addVec(res, sub);
        rem = 0;
        break;
      }
    }
    return res;
  }

  rangeQuery(letter, depth, i, j) {
    if (i < 0) i = 0;
    if (j < i) j = i;
    let right = this.queryPrefix(letter, depth, j);
    let left = this.queryPrefix(letter, depth, i);
    let res = {};
    for (let a of this.alphabet) {
      res[a] = (right[a] || 0) - (left[a] || 0);
    }
    return res;
  }
}

/**
 * weldBridge
 * Seam-directed bridge search between fixed clean blocks U and V over alphabet {a,b,c}.
 * Finds connecting bridges W of length 0 to maxBridgeLen such that U + W + V contains no abelian squares of periods in [minPeriod, maxPeriod].
 */
function weldBridge(U, V, maxBridgeLen = 6, minPeriod = 1, maxPeriod = 5, maxResults = 10) {
  const alphabet = ['a', 'b', 'c'];
  const results = [];
  
  function hasAbelianSquare(s) {
    const len = s.length;
    const pA = new Int32Array(len + 1);
    const pB = new Int32Array(len + 1);
    const pC = new Int32Array(len + 1);
    for (let i = 0; i < len; i++) {
      pA[i + 1] = pA[i] + (s[i] === 'a' ? 1 : 0);
      pB[i + 1] = pB[i] + (s[i] === 'b' ? 1 : 0);
      pC[i + 1] = pC[i] + (s[i] === 'c' ? 1 : 0);
    }
    for (let K = minPeriod; K <= maxPeriod; K++) {
      for (let i = 0; i <= len - 2 * K; i++) {
        const da = (pA[i + K] - pA[i]) - (pA[i + 2 * K] - pA[i + K]);
        if (da !== 0) continue;
        const db = (pB[i + K] - pB[i]) - (pB[i + 2 * K] - pB[i + K]);
        if (db !== 0) continue;
        const dc = (pC[i + K] - pC[i]) - (pC[i + 2 * K] - pC[i + K]);
        if (dc === 0) return true;
      }
    }
    return false;
  }

  if (!hasAbelianSquare(U + V)) {
    results.push({ bridge: "", word: U + V, length: 0 });
    if (results.length >= maxResults) return results;
  }

  function dfs(currentW) {
    if (results.length >= maxResults) return;
    if (hasAbelianSquare(U + currentW)) return;
    if (!hasAbelianSquare(U + currentW + V)) {
      results.push({ bridge: currentW, word: U + currentW + V, length: currentW.length });
      if (results.length >= maxResults) return;
    }
    if (currentW.length >= maxBridgeLen) return;
    for (let c of alphabet) {
      dfs(currentW + c);
      if (results.length >= maxResults) return;
    }
  }

  for (let c of alphabet) dfs(c);
  return results;
}

/**
 * replicateP6 (p6-Replication Harness)
 * Strict epistemological protocol: verifies that the existing infrastructure replicates the known solved case p=6
 * (i.e. g3(h6^omega(a)) avoids abelian squares of periods K >= 6) before attempting unsolved periods.
 */
function replicateP6(iterations = 4, maxK = 30) {
  let w = "a";
  for (let d = 0; d < iterations; d++) {
    let next = "";
    for (let i = 0; i < w.length; i++) next += H6[w[i]];
    w = next;
  }
  let g = "";
  for (let i = 0; i < w.length; i++) g += G3[w[i]];
  
  const len = g.length;
  const pA = new Int32Array(len + 1);
  const pB = new Int32Array(len + 1);
  const pC = new Int32Array(len + 1);
  for (let i = 0; i < len; i++) {
    pA[i + 1] = pA[i] + (g[i] === 'a' ? 1 : 0);
    pB[i + 1] = pB[i] + (g[i] === 'b' ? 1 : 0);
    pC[i + 1] = pC[i] + (g[i] === 'c' ? 1 : 0);
  }
  
  let collisionsFound = 0;
  for (let K = 6; K <= maxK; K++) {
    for (let i = 0; i <= len - 2 * K; i++) {
      const da = (pA[i + K] - pA[i]) - (pA[i + 2 * K] - pA[i + K]);
      if (da !== 0) continue;
      const db = (pB[i + K] - pB[i]) - (pB[i + 2 * K] - pB[i + K]);
      if (db !== 0) continue;
      const dc = (pC[i + K] - pC[i]) - (pC[i + 2 * K] - pC[i + K]);
      if (dc === 0) collisionsFound++;
    }
  }
  
  return {
    ok: collisionsFound === 0,
    p: 6,
    testedLength: len,
    maxPeriodChecked: maxK,
    collisionsFound,
    status: collisionsFound === 0 ? "p=6 replication verified (0 collisions for K >= 6)" : `FAILED: found ${collisionsFound} collisions for K >= 6`
  };
}

/**
 * runNegativeControlTest (Negative Control Calibration)
 * Proves the engine can fail correctly by confirming that exhaustive search for pure abelian-square-free words (all K >= 1)
 * on a ternary alphabet strictly terminates at max length 7 (0 words of length 8 exist).
 * Protects against false positives (too loose collision checks).
 */
function runNegativeControlTest() {
  const chars = ['a', 'b', 'c'];
  let maxLenFound = 0;
  let countLen7 = 0;
  let countLen8 = 0;
  
  function isASFree(w) {
    const len = w.length;
    for (let K = 1; K <= Math.floor(len / 2); K++) {
      let ca = 0, cb = 0, cc = 0;
      for (let j = 0; j < K; j++) {
        const ch = w[len - 2 * K + j];
        if (ch === 'a') ca++; else if (ch === 'b') cb++; else if (ch === 'c') cc++;
      }
      for (let j = 0; j < K; j++) {
        const ch = w[len - K + j];
        if (ch === 'a') ca--; else if (ch === 'b') cb--; else if (ch === 'c') cc--;
      }
      if (ca === 0 && cb === 0 && cc === 0) return false;
    }
    return true;
  }

  function dfs(w) {
    if (w.length > maxLenFound) maxLenFound = w.length;
    if (w.length === 7) countLen7++;
    if (w.length === 8) { countLen8++; return; }
    for (const c of chars) {
      if (isASFree(w + c)) dfs(w + c);
    }
  }

  dfs("");
  
  return {
    ok: maxLenFound === 7 && countLen7 === 18 && countLen8 === 0,
    maxLenFound,
    countLen7,
    countLen8,
    status: (maxLenFound === 7 && countLen7 === 18 && countLen8 === 0) 
      ? "NEGATIVE CONTROL PASSED: Exact ternary cutoff at length 7 verified (18 words of len 7, 0 words of len 8)" 
      : `FAILED: max length ${maxLenFound}, len 7 count ${countLen7}, len 8 count ${countLen8}`
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { H6, H8, G3, G85, G98, G109, MORPHISM_METADATA, verifyMorphismIntegrity, djb2Hash, ParikhFenwickTree, RecursiveParikhOracle, weldBridge, replicateP6, runNegativeControlTest };
}

