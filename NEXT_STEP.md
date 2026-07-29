# Seuraava askel

**Kirjattu:** 2026-07-28
**Tarkoitus:** yksi tiedosto joka kertoo mistä jatketaan, jottei sitä tarvitse päätellä uudelleen `NEXT_AGENT.md`:n historiasta.

---

## Suositus: Vaihe 2, kielen eksakti tutkija

Se on suunnitelman ainoa tekemätön osa, se käyttää valmista koneistoa, ja se täydentää `factor-complexity.js`:n taulukon visuaaliseksi.

**Sisältö:**
- Rauzy-graafit: solmuina pituuden n tekijät, kaarina pituuden n+1 tekijät
- Oikealle erikoiset tekijät: p(n+1) − p(n) laskee ne, ja g₃(h₆^ω(a)):lle erotukset ovat välillä 6…8 (`MATH_CLAIMS.md` rivi 28) — **rakenne on tutkimatta**
- Sama esitys aa2f- ja aa2fr-kielille, jolloin näkee *missä* FORBID4 puree

**Miksi tämä eikä telemetria:** haaraantumiskertoimet ja "sukupuuttoasteet" riippuvat hakujärjestyksestä. Rauzy-graafi on kielen invariantti. Ks. `OPEN_RESEARCH_QUESTIONS.md` osio C.

**Koneisto on olemassa:** `factor-frequencies.js` antaa täydelliset tekijäjoukot eksaktisti, `factor-complexity.js` laskee p(n). Rauzy-graafi rakentuu suoraan näistä.

---

## Vaihtoehto: SAT-koodaus morfismihakuun

Isompi ja kannattaa aloittaa levänneenä. Kolme ehtoa ennen aloitusta:

1. **Kohde on sääntöavaruus, ei sanaavaruus.** Aa2f-sanoja tunnetaan 25 379 merkkiin; UNSAT ei tule vastaan millään saavutettavalla pituudella. Morfismiavaruus 3^(3k) on oikea kohde.
2. **Verifioija on jo olemassa** — `decide-realizability.js` (`MATH_CLAIMS.md` rivi 32) — mutta se pätee **puhtaille morfisille sanoille**. Silmukka on siis rakennettava ternäärimorfismien **kiintopisteille**, ei projektioille. Se on samalla Mäkelän ongelman reitti (a), ks. `OPEN_RESEARCH_QUESTIONS.md` A1.
3. **Nimi on CEGIS**, ei uusi metodologia. Solar-Lezama ym. 2006. Kirjallisuus antaa konvergenssiehdot ja tunnetut epäonnistumismoodit valmiina.

---

## Muut avoimet työt, prioriteettijärjestyksessä

| # | Työ | Peruste |
|---|---|---|
| 1 | Rauzy-graafit (yllä) | valmis koneisto, invariantti, pedagoginen |
| 2 | FORBID4:n minimaalisuus | äärellinen: 64 osajoukkoa × kasvunopeuden yläraja. Yksikäsitteinen vastaus. `OPEN_RESEARCH_QUESTIONS.md` B1 |
| 3 | Additiiviset toistot ℤ^d | sama koneisto, eri Ψ. Valmis verifioitava kohde: Rao & Rosenfeld Theorem 6 (Φ annettu eksplisiittisesti paperissa) |
| 4 | k-abelinen moduuli | lähin **ratkaistu** naapuri (Fici & Puzynina Thm 65). Ainoa tapa mitata mitä ekvivalenssin vahvistaminen ostaa |
| 5 | Ennätyssanarekisteri | Keränen pyysi (WhatsApp kohta 14). Projekti on jo osoittanut tarpeen: shipattu 40-kirjaiminen esimerkki oli kelvoton |
| 6 | SAT / CEGIS | yllä |

---

## Mitä ei kannata tehdä

- **Lisää HPC-skaalausta.** Algoritmi oli väärä ennen kuin karsinta lisättiin; eksaktit skriptit ajavat sekunneissa. Ei pullonkaulaa.
- **`ConstraintEvaluator`-refaktorointi ennen kohtaa 6.** Abstraktio on arvaus ennen kuin SAT-koodaus kertoo mitä rajapinnan pitää kantaa. Kun se tehdään, tehdään koodigeneroinnilla — polymorfinen kutsupaikka DFS:n sisimmässä silmukassa on megamorfinen, ei "monomorfisesti inlinattu".
- **Pidempien aa2f-sanojen jahtaaminen.** Keräsellä on 25 379. Mikä tahansa äärellinen sana on äärellinen havainto.
- **Hakutelemetria kielen ominaisuutena.** Ks. `OPEN_RESEARCH_QUESTIONS.md` osio C.

---

## Repositorion tila 2026-07-28

Testit 23/23, driftitarkistukset 12/12, kaikki committoitu ja pushattu.

**Eksakti putki** (jokainen vaihe todentaa itsensä ja heittää poikkeuksen ennemmin kuin palauttaa virheellisen tuloksen):

```
perron-frobenius.js     spektri, Perron-vektori, karakteristinen polynomi
smith-normal-form.js    kokonaislukuhilat, Smithin normaalimuoto
jordan-decomposition.js Q(sqrt3)-aritmetiikka, Jordan-muoto
proposition5-bounds.js  supistuvan puolen rajat
ancestor-box.js         Prop 5 + Prop 6, aarellinen laatikko
get-parents.js          Par_h ja Anc_h
decide-realizability.js Prop 8, koko paatosmenettely
factor-frequencies.js   taydelliset tekijajoukot, eksaktit tiheydet
factor-complexity.js    p(n) ja kasvunopeuden tiukat ylarajat
```

**Muistutus jokaiselle joka jatkaa:** seitsemän kertaa tässä työssä uskottava yleistys osoittautui vääräksi vasta ajossa (M_g:n surjektiivisuus, M_h:n diagonalisoituvuus, p(n):n vakioslope, ytimen ulottuvuus, testidatan "abelin neliö", HTML-entiteettien kaksoisescapetus, TeX-jäännökset). Yksikään ei olisi kaatunut silmämääräisessä tarkistuksessa. Aja kaikki, vertaa HEAD:iin, äläkä luota kommenttiin.
