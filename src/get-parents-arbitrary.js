'use strict';

/**
 * get-parents-arbitrary.js
 * Ancestor closure generalized for any ternary morphism.
 */

function makeParentsTools(phi, alphabet) {
  const N = alphabet.length;
  
  // Parikh Matrix M_h
  const MH = alphabet.map(y => alphabet.map(x => {
    let n = 0;
    for (const ch of phi[x]) if (ch === y) n++;
    return n;
  }));

  const applyMH = (v) => MH.map(row => row.reduce((s, m, j) => s + m * v[j], 0));

  const parikh = (w) => {
    const v = new Array(N).fill(0);
    for (const ch of w) v[alphabet.indexOf(ch)]++;
    return v;
  };

  const vAdd = (a, b) => a.map((x, i) => x + b[i]);
  const vSub = (a, b) => a.map((x, i) => x - b[i]);
  const vKey = (v) => v.join(',');

  function positionOptions(a) {
    const out = [];
    if (a === '') {
      out.push({ aPrime: '', p: '', s: '' });
      for (const x of alphabet) {
        const img = phi[x];
        for (let j = 0; j <= img.length; j++) {
          out.push({ aPrime: x, p: img.slice(0, j), s: img.slice(j) });
        }
      }
    } else {
      for (const x of alphabet) {
        const img = phi[x];
        for (let j = 0; j < img.length; j++) {
          if (img[j] === a) out.push({ aPrime: x, p: img.slice(0, j), s: img.slice(j + 1) });
        }
      }
    }
    return out;
  }

  function getParents(t, boxByImage) {
    const k = t.a.length - 1;
    const optionsPerPosition = t.a.map(positionOptions);
    const parents = new Map();

    const choice = new Array(t.a.length);

    const recurse = (idx) => {
      if (idx < t.a.length) {
        for (const opt of optionsPerPosition[idx]) {
          choice[idx] = opt;
          recurse(idx + 1);
        }
        return;
      }

      const dPrimeChoices = [];
      for (let i = 0; i < k - 1; i++) {
        const s_i = choice[i].s, p_i1 = choice[i + 1].p;
        const s_i1 = choice[i + 1].s, p_i2 = choice[i + 2].p;
        const v = vAdd(vSub(t.d[i], parikh(s_i1 + p_i2)), parikh(s_i + p_i1));
        const sols = boxByImage.get(vKey(v));
        if (!sols || sols.length === 0) return;
        dPrimeChoices.push(sols);
      }

      const emit = (i, acc) => {
        if (i === dPrimeChoices.length) {
          const aPrime = choice.map(c => c.aPrime);
          const key = aPrime.join('|') + '#' + acc.map(vKey).join('|');
          if (!parents.has(key)) parents.set(key, { a: aPrime, d: acc.map(v => v.slice()) });
          return;
        }
        for (const d of dPrimeChoices[i]) emit(i + 1, [...acc, d]);
      };
      emit(0, []);
    };

    recurse(0);
    return [...parents.values()];
  }

  function ancestorClosure(t0, boxByImage, maxRounds = 100) {
    const key = (t) => t.a.join('|') + '#' + t.d.map(vKey).join('|');
    const seen = new Map([[key(t0), t0]]);
    let frontier = [t0];

    for (let round = 1; round <= maxRounds; round++) {
      const next = [];
      for (const t of frontier) {
        for (const p of getParents(t, boxByImage)) {
          const kp = key(p);
          if (!seen.has(kp)) { seen.set(kp, p); next.push(p); }
        }
      }
      if (next.length === 0) return { templates: [...seen.values()], closed: true };
      frontier = next;
    }
    return { templates: [...seen.values()], closed: false };
  }

  return { getParents, ancestorClosure, applyMH, vKey };
}

module.exports = { makeParentsTools };
