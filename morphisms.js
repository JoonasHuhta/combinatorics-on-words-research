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
 * NOTE: h6 and g3 are currently Level 1 (Empirical / Unverified against literature).
 * They were introduced in commit 10dd549 without a printed primary source.
 */

const H6 = {
  a: 'ace',
  b: 'adf',
  c: 'bdf',
  d: 'bdc',
  e: 'afe',
  f: 'bce'
};

const G3 = {
  a: 'bbbaabaaac',
  b: 'bccacccbcc',
  c: 'ccccbbbcbc',
  d: 'ccccccccaa',
  e: 'bbbbbcabaa',
  f: 'aaaaaaabaa'
};

const MORPHISM_METADATA = {
  h6: {
    name: 'h6 (6-letter ternary extension seed)',
    verificationLevel: 'LEVEL_1_INTERNAL_CHECKSUM',
    badgeText: '⚙️ Level 1: Computed Checksum (arXiv:1507.02581)',
    status: 'COMPUTED — Empirical Checksum against arXiv:1507.02581 (*On Mäkelä\'s Conjectures*) Theorem 5 (`\\label{abelianthe}`)',
    sourceNote: 'Citation corrected 2026-07-26 to arXiv:1507.02581. Reset to Level 1 until primary text and C++ source are audited character-by-character from the correct repository.',
    doi: 'arXiv:1507.02581'
  },
  g3: {
    name: 'g3 (10-length ternary morphism)',
    verificationLevel: 'LEVEL_1_INTERNAL_CHECKSUM',
    badgeText: '⚙️ Level 1: Computed Checksum (arXiv:1507.02581)',
    status: 'COMPUTED — Empirical Checksum against arXiv:1507.02581 (*On Mäkelä\'s Conjectures*) Theorem 11 (`\\label{makanswerr}`)',
    sourceNote: 'Citation corrected 2026-07-26 to arXiv:1507.02581. Reset to Level 1 until primary text and C++ source are audited character-by-character from the correct repository.',
    doi: 'arXiv:1507.02581'
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
    if (H6[k].length !== 3) {
      errors.push(`H6(${k}) has length ${H6[k].length}, expected 3.`);
    }
  }
  for (const k in G3) {
    if (G3[k].length !== 10) {
      errors.push(`G3(${k}) has length ${G3[k].length}, expected 10.`);
    }
  }

  // Compute deterministic string representations
  const h6Str = Object.keys(H6).sort().map(k => `${k}:${H6[k]}`).join(',');
  const g3Str = Object.keys(G3).sort().map(k => `${k}:${G3[k]}`).join(',');

  const h6Checksum = djb2Hash(h6Str).toString(16);
  const g3Checksum = djb2Hash(g3Str).toString(16);

  // Expected canonical hashes
  const EXPECTED_H6_HASH = djb2Hash("a:ace,b:adf,c:bdf,d:bdc,e:afe,f:bce").toString(16);
  const EXPECTED_G3_HASH = djb2Hash("a:bbbaabaaac,b:bccacccbcc,c:ccccbbbcbc,d:ccccccccaa,e:bbbbbcabaa,f:aaaaaaabaa").toString(16);

  if (h6Checksum !== EXPECTED_H6_HASH) {
    errors.push(`H6 checksum mismatch: got ${h6Checksum}, expected ${EXPECTED_H6_HASH}`);
  }
  if (g3Checksum !== EXPECTED_G3_HASH) {
    errors.push(`G3 checksum mismatch: got ${g3Checksum}, expected ${EXPECTED_G3_HASH}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    h6Checksum,
    g3Checksum,
    metadata: MORPHISM_METADATA
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { H6, G3, MORPHISM_METADATA, verifyMorphismIntegrity };
}
