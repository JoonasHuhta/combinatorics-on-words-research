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
| 0 | **`KNOWLEDGE_STATE.md`** | **Tilannekuva: mitä tiedetään, mikä on todistetusti suljettu, mikä hylätty varmuudella, mikä auki, mitä ei saa käyttää.** Johdettu hakemisto — väiteloki voittaa aina. Nopein tapa saada kokonaiskuva |
| 1 | **`AGENTS.md`** / `CLAUDE.md` | Väitteiden protokolla. **Pakollinen.** Sitaatti ennen koodia, kaksi verifiointitasoa, kielen kalibrointi, ihmisen hyväksyntä ennen committia kun väitteet muuttuvat |
| 2 | **`MATH_CLAIMS.md`** | **Ainoa auktoriteetti jokaiselle matemaattiselle väitteelle.** 60 riviä. Mikään väite ei saa esiintyä missään ilman riviä täällä |
| 3 | **`OPEN_RESEARCH_QUESTIONS.md`** | Avoimet ongelmat, kolmijaolla: A kirjallisuus (lähteineen), B projektin omat laskettavat, **C muotoilut jotka mittaavat toteutusta eivätkä matematiikkaa**. D on hylkäysrekisteri perusteineen |
| 4 | **`NEXT_STEP.md`** | Mistä jatketaan ja miksi. Mitä ei kannata tehdä |
| 5 | `docs/plans/PROJECT_ARCHITECTURE.md` | Sovelluksen rakenne, välilehtien reititys |
| 6 | `NEGATIVE_RESULTS.md` | Mikä on kokeiltu ja ei toiminut |
| 7 | `docs/plans/RESEARCH_ARCHITECT.md` | **Vain kun tuotetaan uusia tutkimusideoita.** Menettely, rajaukset, tulostemuoto ja rubriikki — ideat eivät synny vapaana proosana |

**Juuressa on täsmälleen ne kahdeksan `.md`-tiedostoa jotka sessio oikeasti
lukee.** Loput on siirretty 2026-07-30:

- `docs/historical/` — **vanhentuneita suunnitelmapapereita**
  (`GRAND_VISION_MAP`, `COMPUTATIONAL_DISCOVERY_LAB_PLAN`, `SEAM_ENGINE_…`,
  `AA2FR_*`, `NEXT_AGENT`, `DEVELOPMENT_ROADMAP`, …). Ne sisältävät
  vanhentuneita suunnitelmia ja osin korjattuja sitaatteja. **Älä nojaa
  niihin ilman että tarkistat väitteen `MATH_CLAIMS.md`:stä.** Kansion nimi
  tekee tuon varoituksen rakenteelliseksi eikä pelkäksi proosaksi
- `docs/plans/` — **elävät suunnitelmat**: `SANALAB_PLAN`, `UI_UX_PLAN`,
  `SKILLS_PLAN`, `RESEARCH_ARCHITECT`, `PROJECT_ARCHITECTURE`
- `papers/` (ent. `latest/`) — kirjallisuus, gitignoressa
- `datasets/` — ennätyssanat, gitignoressa. Koodi hakee ne
  `word-anatomy.js`:n `resolveDataFile()`:llä, joka katsoo myös juuren, joten
  vanha kloonaus toimii yhä

**Eksakti putki pysyy juuressa** (osio 3). Sitä ei ole jaettu alikansioihin
`search/`, `constraints/`, `analytics/` tai vastaaviin: se olisi arvaus
rajapinnoista joita ei vielä tunneta, ja se on sama virhe jonka
`ConstraintEvaluator`-kielto ja `SANALAB_PLAN.md`:n periaate 4 jo torjuvat.
Jokainen moduuli todentaa itsensä; jako ansaitaan kun jokin oikeasti pakottaa
sen.

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
morphism-scan.js           tyhjentava pienten morfismien haku (reitti a: kiintopisteet)
word-anatomy.js            ennatyssanojen verifiointi ja anatomia
unfavourable-factors.js    Keranen 2006: epasuotuisat tekijat, jatkettavuussyvyys
h6-image-sweep.js          reitti c: h6:n kiintopisteen uniformit kuvat 6->3 kirjaimistoon, L<=5
sft-container.js           K in [2,5]-sailiokieli: de Bruijn -graafi, SCC, taajuusrajat
additive-sweep.js          additiiviset neliot: aakkostolakaisu affiiniluokittain
extension-table.js         jatkettavuussyvyystaulut: terve karsintaoraakkeli, siirtyy affiinisti
sanalab-run.js             jatkettavat sertifioidut ajot: tarkistuspisteet, kolme lopputilaa
table-library.js           taulukirjasto: yksi taulu per affiiniluokka, tarkiste ja provenienssi
```

**Verifiointi:**

```bash
node test.js                 # 35/35
node check-claims-drift.js   # 14/14
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
- **Epäsuotuisia tekijöitä todistettu olemassa oleviksi** neljällä kirjaimella,
  ensimmäiset pituudella 8 (rivi 47). Keräsen kysymys itse on yhä auki
- **Reitti (c) lakaistu tyhjentävästi pienillä L:** yksikään uniformi kuvaus
  Σ₆→Σ₃^L, L ≤ 5, ei tuota h₆^ω(a):sta Mäkelä-sanaa; pienten ja suurten
  jaksojen vaatimukset vetävät vastakkain (rivi 49)
- **Säiliökielet K ∈ [2,5] ja K ∈ [2,6] analysoitu eksaktisti:** yksi SCC
  kummassakin, jokaisen kirjaimen taajuus välttämättä [1/11, 3/4]:ssä, ei
  binäärihäntää — ja väli on stabiili ikkunan kasvatuksessa 5 → 6 vaikka
  kieli kutistuu (rivit 51, 52)
- **Additiiviset neliöt avattu toiseksi tutkimuskohteeksi** (lähteistetty avoin
  ongelma, rivi 53 — ja projektin ydinlähteen emo-ongelma): aakkostolakaisu
  ratkaisee 11 affiiniluokkaa 31:stä, tasapainoiset aakkostot erottuvat
  puhtaasti (rivi 54)
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
