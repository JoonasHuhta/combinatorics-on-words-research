# RESEARCH_CONTEXT.md — lue tämä ensin

**Päivitetty:** 2026-07-29
**Tarkoitus:** yksi sisääntulopiste uudelle sessiolle tai uudelle tekijälle.

> **Tämä tiedosto on reititin, ei kopio.** Se ei toista minkään toisen tiedoston
> sisältöä. Jos jokin väite tai luku esiintyy tässä ja `MATH_CLAIMS.md`:ssä,
> **väiteloki voittaa aina** — kaksi totuuslähdettä on juuri se vikatila jota
> tämä projekti on toistuvasti korjannut. Lisää tähän vain osoittimia.

Aloita uusi sessio näin:

> *"Lue RESEARCH_CONTEXT.md ja AGENTS.md ennen kuin muutat mitään."*

---

## 1. Mikä tämä projekti on

Kokeellisen kombinatoriikan laboratorio abelin-neliöttömille sanoille. Kaksi
puolta:

- **Selainsovellus** `index.html` (19 välilehteä, riippuvuudeton) — opetus ja
  visualisointi. Se **raportoi** tuloksia, ei laske niitä.
- **Eksakti Node-putki** (alla) — kaikki matematiikka. Rationaali- ja
  ℚ(√3)-aritmetiikka, ei liukulukuja tulospoluilla.

Päätavoite on **Mäkelän konjektuuri**: onko olemassa ääretön ternäärisana jonka
ainoat abelin neliöt ovat `00`, `11`, `22`? Auki puolipituuksille K = 2…5.

---

## 2. Lue nämä, tässä järjestyksessä

| # | Tiedosto | Mistä se on auktoriteetti |
|---|---|---|
| 1 | **`AGENTS.md`** / `CLAUDE.md` | Väitteiden protokolla. **Pakollinen.** Sitaatti ennen koodia, kaksi verifiointitasoa, kielen kalibrointi, ihmisen hyväksyntä ennen committia kun väitteet muuttuvat |
| 2 | **`MATH_CLAIMS.md`** | **Ainoa auktoriteetti jokaiselle matemaattiselle väitteelle.** 49 riviä. Mikään väite ei saa esiintyä missään ilman riviä täällä |
| 3 | **`OPEN_RESEARCH_QUESTIONS.md`** | Avoimet ongelmat, kolmijaolla: A kirjallisuus (lähteineen), B projektin omat laskettavat, **C muotoilut jotka mittaavat toteutusta eivätkä matematiikkaa**. D on hylkäysrekisteri perusteineen |
| 4 | **`NEXT_STEP.md`** | Mistä jatketaan ja miksi. Mitä ei kannata tehdä |
| 5 | `PROJECT_ARCHITECTURE.md` | Sovelluksen rakenne, välilehtien reititys |
| 6 | `NEGATIVE_RESULTS.md` | Mikä on kokeiltu ja ei toiminut |

Muut `.md`-tiedostot juuressa ovat **historiallisia suunnitelmapapereita**
(`GRAND_VISION_MAP`, `COMPUTATIONAL_DISCOVERY_LAB_PLAN`, `SEAM_ENGINE_…`,
`AA2FR_RESEARCH_PLATFORM_PLAN`, `NEXT_AGENT`). Ne sisältävät vanhentuneita
suunnitelmia ja osin korjattuja sitaatteja. **Älä nojaa niihin ilman että
tarkistat väitteen `MATH_CLAIMS.md`:stä.**

---

## 3. Eksakti putki

Jokainen moduuli **todentaa itsensä ja heittää poikkeuksen** ennemmin kuin
palauttaa virheellisen tuloksen.

```
perron-frobenius.js        spektri, Perron-vektori, karakteristinen polynomi
smith-normal-form.js       Smithin normaalimuoto, kokonaislukuhilat
jordan-decomposition.js    Q(sqrt3), Jordan-muoto
decision-preconditions.js  Proposition 9:n hypoteesit
proposition5-bounds.js     supistuvan puolen rajat
ancestor-box.js            Prop 5 + Prop 6, aarellinen laatikko
get-parents.js             Par_h ja Anc_h
decide-realizability.js    Prop 8 -> Theorem 4
proposition11-targets.js   Prop 11:n kohdejoukko
decide-phi-squares.js      Prop 8 modulo Phi -> Theorem 6
factor-frequencies.js      taydelliset tekijajoukot, eksaktit tiheydet
factor-complexity.js       p(n), kasvunopeuden tiukat ylarajat
rauzy-graph.js             Rauzy-graafit, erikoiset tekijat, umpikujat
morphism-scan.js           tyhjentava pienten morfismien haku
word-anatomy.js            ennatyssanojen verifiointi ja anatomia
```

**Verifiointi:**

```bash
node test.js                 # 27/27
node check-claims-drift.js   # 12/12
```

Aja **molemmat** ennen committia ja **lue molempien tuloste**. Ne ovat eri
asioita: `test.js` testaa matematiikkaa, `check-claims-drift.js` vartioi
väitteitä, sitaatteja ja käyttöliittymän tekstiä.

---

## 4. Mitä on saavutettu

Yksityiskohdat `MATH_CLAIMS.md`:stä, tässä vain karttamerkit:

- **Theorem 4 ja Theorem 6 johdettu uudelleen** koko Rao & Rosenfeldin
  päätösmenettelyllä (rivit 32, 46). Molemmat ovat *uudelleenjohtoja tekijöiden
  koneistolla*, eivät riippumattomia todistuksia
- Eksaktit tekijätiheydet, tekijäkompleksisuus ja kasvunopeuden tiukat ylärajat
  (rivit 17–20, 27, 28, 33)
- Rauzy-graafit ja umpikujatekijät (rivit 34, 35)
- Ennätyssanat verifioitu ensimmäistä kertaa; FORBID4 osoittautui
  heuristiikaksi (rivit 40–42)
- Sitaatit korjattu primäärilähteistä; useita vääriä lausenumeroita ja yksi
  väärä arXiv-tunniste peruttu (rivit 4–7b, 9, 38, 39, 44)

---

## 5. Asiat joita EI saa väittää ilman lähdettä

Nämä ovat toistuneet ja aiheuttaneet perumisia:

1. **Älä esitä FORBID4:ää "Keräsen joukkona".** Merkkijonot ovat hänen
   taulukoissaan, mutta juuri sen kuuden erityisyys on projektin oma väite
   (rivi 9)
2. **Älä sano "morfismi pitää Parikh-epätasapainon pienenä".** Väärin
   kummallakin tavalla — se ei ole pieni eikä se erottele (rivi 42)
3. **Älä lue morfismiskannerin maksimiprefiksistä rakenteellista signaalia.**
   Se on otoskoon logaritmi, R² = 0,99875 (rivi 37)
4. **Älä vertaa paperin lukuja (28 514 / 48 459 / 16 214) omiimme.** Ne on
   laskettu eri morfismille tai mittaavat eri asiaa (rivit 22, 44)
5. **Älä käytä `ancestor-box.js`:n laatikkoa muulle kuin sille templaatille
   jolle se on johdettu** (rivit 30, 43)
6. **Älä käytä Dejeanin konjektuuria avoimena.** Se on todistettu
   (`OPEN_RESEARCH_QUESTIONS.md` A2)

---

## 6. Työtapa, joka on tässä projektissa ansaittu

**Yksitoista kertaa** tässä työssä uskottava yleistys osoittautui vääräksi vasta
ajossa. Lista on `NEXT_STEP.md`:ssä. Yksikään ei olisi kaatunut silmämääräisessä
tarkistuksessa.

Siitä seuraa kolme sääntöä:

- **Aja se.** Väite ilman ajettua koodia on hypoteesi
- **Vertaa HEAD:iin, älä silmällä.** Kaksi kertaa muutos rikkoi jotain mitä
  vain `git diff` paljasti
- **Kuollut koodihaara jota ei ole perusteltu on ansa seuraavalle.** Poista se
  tai heitä poikkeus

Ja yksi kirjanpitosääntö: **peruttua riviä ei poisteta.** Se jää näkyviin
`REJECTED`-tilassa perusteineen, jottei sitä lisätä uudelleen.

---

## 7. Seuraava askel

Ks. **`NEXT_STEP.md`** — se on ajan tasalla ja sisältää konkreettisen
aloituskohdan.
