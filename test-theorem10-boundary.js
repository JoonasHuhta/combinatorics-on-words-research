'use strict';

/**
 * test-theorem10-boundary.js (Bounded Empirical Audit)
 * ----------------------------------------------------
 * Regressiotesti: varmistaa, ettei g3(h6^n(a)):n prefiksissä esiinny
 * abelin neliöitä puolipituudella K > 5 (Empiirinen huomio: koodiin lisätyt
 * h6 ja g3 merkkijonot ovat Level 1 -tason empiirisitä havaintoja, joille ei ole
 * painettua kirjallisuuslähdettä projektissa).
 *
 * Tämä EI todista mitään äärettömästä sanasta — se on äärellinen
 * sanity-check joka kaatuu äänekkäästi jos morfismi tai skannauslogiikka
 * rikkoutuu. Checksum takaa vain koodikannan sisäisen eheyden (Level 1).
 *
 * Käyttö:
 *   node test-theorem10-boundary.js [iteraatioita] [maxK]
 *     iteraatioita: h6:n itserointien määrä (oletus 9 -> |h6^9(a)| = 3^9 = 19683,
 *                   lopullinen sana g3:n jälkeen 10x pidempi)
 *     maxK:         kuinka pitkälle puolipituuksia skannataan (oletus 40)
 *
 * Exit-koodi 0 = PASS, 1 = FAIL. Sopii suoraan CI:hin / pre-commit-hookiin.
 */

const { H6, G3, verifyMorphismIntegrity } = require('./morphisms');

function applyMorphism(word, morphism) {
  const out = [];
  for (const ch of word) out.push(morphism[ch]);
  return out.join('');
}

function generateWord(iterations) {
  let w = 'a';
  for (let i = 0; i < iterations; i++) {
    w = applyMorphism(w, H6);
  }
  return applyMorphism(w, G3);
}

/**
 * Skannaa kaikki abelin neliöt puolipituuksilla 1..maxK.
 * O(maxK * n) kokonaisuudessaan, O(1) per (start, half) -tarkistus
 * Int32Array-etuliitesummien avulla — sama periaate kuin aa2fr-worker.js:n
 * O(1) Parikh-laskennassa, mutta KUUSI ERILLISTÄ puskuria (ei bittipakkausta),
 * jotta ylivuoto ei ole mahdollinen millään K:n arvolla.
 */
function scanAbelianSquares(word, maxK) {
  const n = word.length;
  const codeOf = { a: 0, b: 1, c: 2 };
  const prefix = [new Int32Array(n + 1), new Int32Array(n + 1), new Int32Array(n + 1)];

  for (let i = 0; i < n; i++) {
    const c = codeOf[word[i]];
    prefix[0][i + 1] = prefix[0][i] + (c === 0 ? 1 : 0);
    prefix[1][i + 1] = prefix[1][i] + (c === 1 ? 1 : 0);
    prefix[2][i + 1] = prefix[2][i] + (c === 2 ? 1 : 0);
  }

  function countsEqual(l1, r1, l2, r2) {
    return (
      prefix[0][r1] - prefix[0][l1] === prefix[0][r2] - prefix[0][l2] &&
      prefix[1][r1] - prefix[1][l1] === prefix[1][r2] - prefix[1][l2] &&
      prefix[2][r1] - prefix[2][l1] === prefix[2][r2] - prefix[2][l2]
    );
  }

  const results = {};
  for (let half = 1; half <= maxK; half++) {
    let hits = 0;
    let firstExample = null;
    for (let start = 0; start + 2 * half <= n; start++) {
      if (countsEqual(start, start + half, start + half, start + 2 * half)) {
        hits++;
        if (firstExample === null) {
          firstExample = { start, window: word.slice(start, start + 2 * half) };
        }
      }
    }
    results[half] = { hits, firstExample };
  }
  return results;
}

function main() {
  const iterations = parseInt(process.argv[2], 10) || 9;
  const maxK = parseInt(process.argv[3], 10) || 40;

  console.log('=== 1) Morfismin eheystarkistus (checksum + pituudet) ===');
  const integrity = verifyMorphismIntegrity();
  if (!integrity.ok) {
    console.error('EHEYSTARKISTUS EPÄONNISTUI — pysäytetään ennen laskentaa:');
    integrity.errors.forEach((e) => console.error(' - ' + e));
    process.exit(1);
  }
  console.log(`OK. h6 checksum=${integrity.h6Checksum}  g3 checksum=${integrity.g3Checksum}`);

  console.log(`\n=== 2) Generoidaan g3(h6^${iterations}(a)) ===`);
  const t0 = Date.now();
  const word = generateWord(iterations);
  console.log(`Pituus: ${word.length} merkkiä (${Date.now() - t0} ms)`);

  console.log(`\n=== 3) Skannataan abelin neliöt K=1..${maxK} ===`);
  const t1 = Date.now();
  const results = scanAbelianSquares(word, maxK);
  console.log(`Skannausaika: ${Date.now() - t1} ms\n`);

  console.log('K\tosumia\tesimerkki (ensimmäinen)');
  let anyFailure = false;
  for (let half = 1; half <= maxK; half++) {
    const { hits, firstExample } = results[half];
    const isViolation = half > 5 && hits > 0;
    if (isViolation) anyFailure = true;
    const flag = isViolation ? '  <-- FAIL: K>5 neliöttömyys rikkoutui!' : '';
    console.log(
      `${half}\t${hits}\t${firstExample ? firstExample.window.slice(0, 16) + '...' : '-'}${flag}`
    );
  }

  console.log('\n=== Yhteenveto ===');
  if (anyFailure) {
    console.error(
      'FAIL: löydettiin abelin neliöitä K>5:llä. Joko morfismi on väärin, tai ' +
        'skannauslogiikassa on virhe. ÄLÄ LUOTA Moduuli C:n tuloksiin ennen kuin tämä korjataan.'
    );
    process.exit(1);
  }

  console.log(
    `PASS: 0 abelin neliötä välillä K=6..${maxK} (${word.length} merkin prefiksissä). ` +
      'Empiirinen auditoinnin tulos (Level 1 Checksum OK).'
  );
  console.log(
    'HUOM: K=1..5 -osumat eivät ole "virhe" — ne ovat kiinnostavaa ' +
      'empiiristä dataa Moduuli C:tä varten, ei testin läpäisyehto.'
  );
  process.exit(0);
}

main();
