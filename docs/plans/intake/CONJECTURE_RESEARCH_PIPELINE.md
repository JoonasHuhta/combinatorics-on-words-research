# Conjecture Research Pipeline

## Auditoitava putki laskennallisesta havainnosta uudeksi matemaattiseksi tiedoksi

**Ehdotettu sijainti repossa:** `docs/plans/CONJECTURE_RESEARCH_PIPELINE.md`  
**Tila:** suunnitelma / käyttöönottoa odottava  
**Päiväys:** 2026-08-05  
**Soveltamisala:** koko `combinatorics-on-words-research`-projekti

---

## 0. Tiivistelmä

Projektin ei pidä rakentaa pelkkää *konjektuurigeneraattoria*. Sen pitää rakentaa **konjektuurien tutkimusputki**, joka hallitsee koko elinkaaren:

> **aineisto → havainto → formalisoitu konjektuuri → aktiivinen vastaesimerkkihaku → riippumaton replikaatio → lemma, rajattu tulos, vastaesimerkki tai todistus → väiteloki → ulkoinen haastaminen**

Putken tärkein tehtävä ei ole tuottaa mahdollisimman monta kiinnostavalta kuulostavaa hypoteesia. Sen tehtävä on tuottaa mahdollisimman vähän mutta mahdollisimman hyvin määriteltyjä tutkimuskohteita, joiden alkuperä, rajaus, riippuvuudet, testit, vastaväitteet ja ratkaisuhistoria voidaan jäljittää Gitissä.

Järjestelmän pitää mahdollistaa myös ulkopuolinen yhteistyö. Tutkijan tulee voida:

1. ymmärtää väite ilman koko projektin historian lukemista;
2. toistaa tulos puhtaasta kloonista;
3. haastaa väite eri menetelmällä;
4. toimittaa pienin vastaesimerkki tai vaihtoehtoinen todistus;
5. nähdä, mihin muihin tuloksiin korjaus vaikuttaa;
6. saada työnsä näkyvästi ja oikeudenmukaisesti kreditoiduksi;
7. osallistua ilman, että keskeneräisiä havaintoja nostetaan ennenaikaisesti projektin tiedoksi.

Tämä malli ei korvaa projektin nykyisiä auktoriteetteja. Se lisää niiden ympärille prosessin, jolla uusi tieto syntyy hallitusti.

---

# 1. Suhde projektin nykyisiin dokumentteihin

Nykyinen dokumenttihierarkia säilytetään. Uusi konjektuurirekisteri ei saa muuttua toiseksi väitelokiksi.

| Dokumentti | Auktoriteetti |
|---|---|
| `EPISTEMIC_DISCIPLINE.md` | Yleiset säännöt lähteille, rajauksille, äärellisille laskuille ja riippumattomalle varmennukselle |
| `AGENTS.md` / `CLAUDE.md` | Pakollinen työskentely- ja hyväksyntäprotokolla agenteille |
| `MATH_CLAIMS.md` | Ainoa auktoriteetti kaikille projektin käyttäville matemaattisille väitteille |
| `KNOWLEDGE_STATE.md` | Johdettu tilannekuva; ei itsenäinen totuuslähde |
| `OPEN_RESEARCH_QUESTIONS.md` | Avoimet kysymykset; ei paikka valmiiden löydösten raportoimiselle |
| `NEGATIVE_RESULTS.md` | Hylätyt hypoteesit, menetelmät ja tutkimuslinjat sekä niiden lopullisuuden aste |
| `LITERATURE_COVERAGE.md` | Kartta siitä, mitä lähteitä ja tutkimusavaruuksia on tarkistettu |
| `NEXT_STEP.md` | Priorisoitu työjono ja käytännön handoff |
| `docs/plans/RESEARCH_ARCHITECT.md` | Uusien tutkimusideoiden tuottamisen menettely |
| **uusi `research/conjectures/`** | Konjektuurien prosessitila, alkuperä, haasteet ja riippuvuudet; ei valmis matemaattinen auktoriteetti |

## 1.1 Tärkein rajaus

Konjektuuritietue saa sanoa:

> “Tämä väite on formalisoitu ja selvisi näistä tarkasti rajatuista testeistä.”

Se ei saa yksinään sanoa:

> “Tämä on projektin vahvistama matemaattinen tulos.”

Kun syntyy raportoitava laskennallinen tulos, rajattu ratkaisu, vastaesimerkki tai todistus, sille tehdään hyväksytty rivi `MATH_CLAIMS.md`:hen. Konjektuuritietue viittaa riville. Väiteloki voittaa aina ristiriidassa.

## 1.2 Havainto ja konjektuuri eivät ole sama asia

- **Havainto** kuvaa aineistossa mitattua asiaa tarkalla rajauksella.
- **Konjektuuri** on yleinen ja falsifioitava matemaattinen väite.
- **Hakuhypoteesi** koskee algoritmia tai heuristiikkaa.
- **Todistusidea** on ehdotus siitä, mikä rakenne voisi pakottaa konjektuurin.
- **Tulos** on joko todistettu väite tai tarkasti rajattu täydellinen laskenta.

Esimerkki:

- Havainto: “Kaikissa 512 bigramiosajoukossa pituuteen 16 asti tietty riippuvuus toteutui.”
- Konjektuuri: “Kaikilla äärellisillä sanoilla kahdeksan määrättyä bigramimäärää määrää yhdeksännen.”
- Todistusidea: “Bigramimäärät toteuttavat alku- ja loppukirjaimista seuraavan virtausyhtälön.”
- Tulos: riippuvuus johdetaan lineaarialgebrallisesti kaikille pituuksille.

---

# 2. Mitä projektissa pidetään uuden tiedon syntymisenä?

Kaikki uudet numerot eivät ole uutta matemaattista tietoa. Tulos on tutkimuksellisesti merkityksellinen, kun se muuttaa täsmällisesti sitä, mitä tiedetään, mitä voidaan sulkea pois tai mitä täytyy todistaa seuraavaksi.

## 2.1 Tiedon hyväksyttävät muodot

### A. Vastaesimerkki

Yksi varmennettu vastaesimerkki kumoaa yleisen väitteen. Erityisen arvokkaita ovat:

- pienin vastaesimerkki;
- kanoninen vastaesimerkki symmetrioiden suhteen;
- vastaesimerkki, joka paljastaa puuttuvan ehdon;
- vastaesimerkkiperhe, joka selittää miksi kokonainen tutkimussuunta epäonnistuu.

### B. Täydellinen rajattu tulos

Tarkasti määritelty äärellinen avaruus on käyty läpi loppuun:

- kaikki sanat pituuteen \(n\);
- kaikki morfismit annetussa perheessä;
- kaikki symmetriaorbit annetulla parametrivälillä;
- kaikki tilat äärellisessä automaatissa;
- kaikki CSP-ratkaisut määritellyssä ikkunassa.

Rajaus on osa väitettä, ei sivuhuomautus.

### C. Välttämätön ehto

Jokaisen mahdollisen ratkaisun täytyy toteuttaa uusi ehto. Tämä voi pienentää hakutilaa tai rajata todistusstrategioita.

### D. Ekvivalenssi tai reduktio

Avoin ongelma palautuu toiseen täsmälliseen ongelmaan, päätösmenettelyyn, äärelliseen graafiin tai algebralliseen ehtoon.

### E. Rakenteellinen lemma

Aineistosta havaittu suhde seuraa invariantista, kuten:

- Parikh- tai insidenssimatriisin yhtälöstä;
- Rauzy-graafin virtaustasapainosta;
- Smithin normaalimuodosta;
- Jordan-hajotelmasta;
- äärellisen automaatin ominaisuudesta;
- symmetriaryhmän toiminnasta;
- template- tai ancestor-menetelmästä.

### F. Todistus

Konjektuuri ratkaistaan kaikissa väitteen ilmoittamissa tapauksissa.

### G. Riippumaton replikaatio

Aiempi sisäinen tulos tuotetaan uudelleen:

- puhtaasta kloonista;
- eri toteutuksella;
- mieluiten eri ohjelmointikielellä tai eri matemaattisella representaatiolla;
- ilman alkuperäisen haun inkrementaalisen tilan uudelleenkäyttöä.

### H. Kirjallisuustulos tai uutuusrajan korjaus

Projektin havainto voidaan tunnistaa:

- jo tunnetuksi tulokseksi;
- tunnetun lauseen erikoistapaukseksi;
- aidosti eri väitteeksi kuin kirjallisuudessa;
- avoimeksi vain rajatummassa muodossa kuin aluksi luultiin.

Muoto “ei löytynyt tarkistetuista lähteistä” on sallittu. Muoto “ei ole kirjallisuudessa” ei ole sallittu ilman kattavaa näyttöä.

## 2.2 Asiat, joita ei saa yksinään kutsua uudeksi tiedoksi

- pidempi äärellinen sana äärettömän olemassaolon todisteena;
- parempi ennätys ilman varmennettua artefaktia;
- satunnaishaun tavallista pidempi selviytymisaika;
- DFS-puun “tunneli”, “vaiheensiirtymä” tai “vetovoima” ilman invarianttia vastinetta;
- suuri prosenttiosuus samasta aineistosta, jolla sääntö löydettiin;
- tilastollinen luottamusprosentti matemaattiselle totuudelle;
- usean AI-agentin yksimielisyys;
- suuri määrä testejä, jos testit käyttävät samaa virheellistä ydinkoodia;
- lähteeseen viittaava täsmällinen teksti, jos lähdettä ei ole avattu;
- oma määritelmä, jonka oletetaan automaattisesti olevan tutkimusyhteisölle kiinnostava.

---

# 3. Tutkimusobjektit ja pysyvät tunnisteet

Kaikille tutkimusprosessin keskeisille objekteille annetaan muuttumaton tunniste.

| Objekti | Tunniste-esimerkki |
|---|---|
| Konjektuuri | `CONJ-AA2F-0001` |
| Havainto / mittaus | `OBS-AA2F-0001` |
| Ajo | `RUN-20260805-0001` |
| Vastaesimerkki | `CE-CONJ-AA2F-0001-0001` |
| Ulkoinen replikaatio | `REP-CONJ-AA2F-0001-0001` |
| Todistusyritys | `PROOF-CONJ-AA2F-0001-0001` |
| Määritelmäversio | `DEF-AA2F-1` |
| Haastepaketti | `CHAL-CONJ-AA2F-0001-1` |
| Ulkoinen arvio | `REV-CONJ-AA2F-0001-0001` |

## 3.1 Tunnisteiden säännöt

- Tunnistetta ei käytetä uudelleen.
- Hylättyä tai yhdistettyä konjektuuria ei poisteta.
- Otsikko saa muuttua; tunniste ei.
- Symmetrisesti ekvivalentit konjektuurit yhdistetään yhden tunnisteen alle.
- Konjektuurin merkittävä matemaattinen muutos luo uuden version tai uuden tunnisteen.
- Pelkkä sanamuodon selvennys ei luo uutta konjektuuria, mutta muutos kirjataan historiaan.

---

# 4. Konjektuurin elinkaari

## 4.1 Tilat

### `LEAD`

Kiinnostava johtolanka, poikkeama tai tutkijan ehdotus. Väite ei välttämättä ole vielä matemaattisesti hyvin muodostettu.

Pakollinen tieto:

- alkuperä;
- miksi johtolanka voisi olla invariantti;
- halvin tapa osoittaa se merkityksettömäksi.

### `OBSERVED`

Täsmällinen, rajattu havainto on olemassa.

Pakollinen tieto:

- aineiston generointi;
- rajat;
- laskennan täydellisyys tai heuristisuus;
- raaka ja symmetrioilla redusoitu avaruus;
- riippumaton tarkistus.

### `FORMALIZED`

Johtolanka on muutettu kvantifioiduksi ja falsifioitavaksi matemaattiseksi väitteeksi.

Pakollinen tieto:

- universumi;
- kvanttorit;
- predikaatit;
- sääntöjoukko ja sen versio;
- mahdolliset rajatapaukset;
- tunnetut ekvivalentit muotoilut;
- mitä yksi vastaesimerkki tarkoittaa.

### `CHALLENGE_READY`

Konjektuurilla on toteutettava haastesuunnitelma.

Pakollinen tieto:

- discovery- ja challenge-polkujen ero;
- positiivinen kontrolli;
- negatiivinen kontrolli;
- pienimmän vastaesimerkin minimointi;
- ennalta kirjoitetut mahdolliset tuloslauseet;
- tappoehto;
- ylösnousemusehto.

### `SURVIVED_BOUNDED_TESTS`

Vastaesimerkkiä ei löytynyt ilmoitetussa äärellisessä ikkunassa.

Tämä tila ei nosta väitteen “todennäköisyyttä” eikä oikeuta äärettömään tulkintaan. Tietueen otsikossa tai käyttöliittymässä on aina näytettävä testattu ikkuna.

### `RESOLVED_BOUNDED`

Konjektuurin rajattu versio on ratkaistu täydellisesti.

### `PROVED_INTERNAL`

Projektissa on täydellinen johtaminen tai todistus, joka on sisäisesti tarkistettu.

Pakollinen tieto:

- todistuksen kaikki velvoitteet;
- käytetyt aiemmat claim-rivit;
- koneellisesti tarkistettavat osat;
- riippumaton lukutarkistus;
- avoimet formalisaatio- tai esityskysymykset.

### `EXTERNALLY_REPLICATED`

Ulkopuolinen tutkija tai ryhmä on tuottanut tuloksen uudelleen sovitulla riippumattomuustasolla.

### `PROOF_AUDITED`

Todistuksen on tarkistanut vähintään yksi ulkopuolinen henkilö, joka kykenee arvioimaan matemaattisen argumentin eikä vain ohjelman suoritusta.

### `REJECTED`

Konjektuuri on kumottu vastaesimerkillä tai loogisella esteellä.

### `DISPUTED`

Kaksi asianmukaista tarkistuspolkua antaa eri tuloksen, tai ulkoinen arvioija osoittaa aukon, jota ei ole vielä ratkaistu.

### `SUPERSEDED`

Täsmällisempi konjektuuri tai todistettu tulos korvaa tämän tietueen. Historia säilyy.

## 4.2 Sallitut pääsiirtymät

```text
LEAD
  → OBSERVED
  → FORMALIZED
  → CHALLENGE_READY
      → REJECTED
      → SURVIVED_BOUNDED_TESTS
      → RESOLVED_BOUNDED
      → PROVED_INTERNAL
          → EXTERNALLY_REPLICATED
          → PROOF_AUDITED
          → SUPERSEDED
```

`DISPUTED` voi syntyä mistä tahansa tulosta esittävästä tilasta.

## 4.3 Tiloja ei järjestetä luottamusasteikoksi

Konjektuurille ei anneta prosenttilukua. Sen sijaan raportoidaan:

- millaista näyttöä on;
- mitä avaruutta on testattu;
- kuinka riippumaton tarkistus on;
- onko yleinen todistus olemassa;
- mitä väite ei kata.

---

# 5. Ehdotettu Git-rakenne

Nykyistä exact Node -putkea ei siirretä eikä järjestellä uudelleen tämän työn sivuvaikutuksena. Uusi rakenne lisätään tutkimusmetadatalle ja yhteistyöaineistolle.

```text
research/
  README.md

  definitions/
    DEF-AA2F-1.md
    DEF-AA2FR-1.md

  conjectures/
    CONJ-B16-0001.yml
    CONJ-AA2F-0001.yml

  observations/
    OBS-B16-0001.yml

  runs/
    RUN-20260805-0001/
      manifest.json
      summary.md
      checksums.txt
      witnesses/
      certificates/

  counterexamples/
    CONJ-AA2F-0001/
      CE-CONJ-AA2F-0001-0001.json
      witness.txt
      verify.js

  proofs/
    CONJ-B16-0001/
      proof.md
      obligations.yml
      verification.md

  reviews/
    CONJ-B16-0001/
      REV-CONJ-B16-0001-0001.md

  challenges/
    CHAL-CONJ-B16-0001-1/
      README.md
      challenge.yml
      expected-interface.md
      checksums.txt

  literature/
    CONJ-B16-0001.md

  schemas/
    conjecture.schema.json
    observation.schema.json
    run-manifest.schema.json
    counterexample.schema.json
    review.schema.json

conjecture-check.js
research-integrity.js

.github/
  ISSUE_TEMPLATE/
    conjecture.yml
    reproduction.yml
    counterexample.yml
    proof-review.yml
    literature-trace.yml
  PULL_REQUEST_TEMPLATE/
    research.md
```

## 5.1 Tallennettavat ja tallentamatta jätettävät artefaktit

Gitiin tallennetaan:

- pieni ja olennainen todistuskappale;
- ajomanifesti;
- checksummat;
- komento ja ympäristö;
- yhteenveto;
- riippumaton tarkistin;
- todistuksen velvoitteet;
- ulkoisen arvioinnin raportti, jos arvioija sallii sen.

Gitiin ei automaattisesti tallenneta:

- valtavia generoituja aineistoja;
- tekijänoikeudella suojattuja artikkeleita;
- väliaikaisia checkpointteja;
- salaisia API-avaimia;
- julkaisemattomia yhteistyökumppanin tuloksia ilman lupaa;
- raakaa AI:n yksityistä päättelyketjua.

Suuret aineistot voidaan säilyttää erillisessä arkistossa. Gitiin tallennetaan vähintään pysyvä tunniste, checksum, formaatti, tuottava ohjelma ja lisenssitieto.

---

# 6. Konjektuuritietue

Alla oleva YAML on ehdotettu vähimmäismalli.

```yaml
id: CONJ-B16-0001
version: 1
title: Eight specified bigram counts determine the ninth

status: PROVED_INTERNAL
domain:
  family: k_abelian
  ruleset_id: DEF-BIGRAM-1

statement:
  plain: >
    Täsmällinen ihmisluettava väite.
  formal: >
    Kvantifioitu matemaattinen muoto.
  universe:
    alphabet: [a, b, c]
    object_type: finite_word
  quantifiers:
    - for_every_word
  boundary_convention: explicit
  exclusions: []

origin:
  kind: exhaustive_computation
  observation_ids:
    - OBS-B16-0001
  discovery_run_ids:
    - RUN-20260802-0001
  first_commit: "<git-sha>"
  proposed_by:
    - human
    - ai_assisted

candidate_generation:
  mode: exhaustive_pattern_scan
  candidate_space_size: 512
  selection_rule: >
    Miten tämä kuvio valittiin muiden kuvioiden joukosta.
  ranking_only: true

scope:
  finite_or_infinite: universal
  alphabet_size: 3
  ruleset: bigram_counts
  parameters: {}

symmetries:
  group: S3
  canonicalization: explicit
  reversal_checked: true
  equivalent_conjectures: []

evidence:
  supporting_claim_rows: []
  bounded_tests:
    - run_id: RUN-20260802-0002
      bound: "n <= 7"
  independent_paths:
    - kind: brute_force_definition_level
      run_id: RUN-20260802-0003

challenge:
  status: completed
  cheapest_kill_test: >
    Pienin testi, jonka epäonnistuminen lopettaa suunnan.
  positive_control: >
    Tunnettu tapaus, jonka menetelmän on hyväksyttävä.
  negative_control: >
    Tunnettu väärä tapaus, jonka menetelmän on hylättävä.
  counterexample_minimizer: true

proof:
  status: complete_internal
  path: research/proofs/CONJ-B16-0001/proof.md
  obligations_path: research/proofs/CONJ-B16-0001/obligations.yml
  method: linear_algebra

dependencies:
  claims:
    - 99
  conjectures: []
  definitions:
    - DEF-BIGRAM-1
  code_modules: []

literature:
  status: not_found_in_checked_sources
  coverage_file: research/literature/CONJ-B16-0001.md
  novelty_claim_allowed: false

outcomes:
  claim_rows:
    - 99
  negative_result_sections: []
  supersedes: []
  superseded_by: []

governance:
  owner: maintainer
  reviewers: []
  last_reviewed: 2026-08-05
  next_review_due: null
```

---

# 7. Ajomanifesti

Merkittävä tutkimusajo ei ole pelkkä komentorivihistoria. Se on tutkimusartefakti.

```json
{
  "run_id": "RUN-20260805-0001",
  "purpose": "challenge",
  "conjecture_ids": ["CONJ-AA2F-0001"],
  "git_commit": "<git-sha>",
  "dirty_worktree": false,
  "command": "node example.js --nmax 24",
  "environment": {
    "node": "exact version",
    "os": "exact value",
    "arch": "exact value"
  },
  "ruleset": {
    "id": "DEF-AA2F-1",
    "alphabet": ["a", "b", "c"],
    "period_min": 2,
    "period_max": 12
  },
  "search_space": {
    "exhaustive": true,
    "raw_size": 123456,
    "canonical_size": 20576,
    "symmetry_reduction": "S3 canonicalization"
  },
  "randomness": {
    "used": false,
    "seed": null
  },
  "controls": {
    "positive": {"status": "passed"},
    "negative": {"status": "passed"},
    "reference_crosscheck": {"status": "passed"}
  },
  "result": {
    "verdict": "counterexample_found",
    "witness": "witnesses/minimal.txt",
    "summary": "summary.md"
  },
  "checksums": {
    "result": "sha256:..."
  }
}
```

## 7.1 Ajossa on ilmoitettava myös se, mitä ei tehty

```yaml
not_checked:
  - non_uniform_morphisms
  - image_length_above_7
  - alphabets_larger_than_3
  - non_block_aligned_cases
```

## 7.2 Jaettu laskenta

Hajautetussa laskennassa jokainen ositus saa oman manifestin. Koontitulos ilmoittaa:

- ositussäännön;
- peittävätkö osat koko avaruuden;
- ovatko osat erillisiä;
- puuttuuko yhtään työtä;
- osatulosten checksummat;
- aggregaattorin version;
- riippumattoman kokonaismäärän tarkistuksen.

---

# 8. Discovery-aineisto ja challenge-aineisto

Sama aineisto ei saa sekä tuottaa sääntöä että toimia sen riippumattomana vahvistuksena.

## 8.1 Discovery-vaihe

Discovery-vaihe saa olla:

- eksploratiivinen;
- tilastollinen;
- heuristinen;
- AI-avusteinen;
- visuaalinen;
- useita kuvioita tuottava.

Sen on kuitenkin kirjattava:

- kuinka monta mahdollista kuviota tarkasteltiin;
- millä säännöllä kuvio nostettiin esiin;
- käytettiinkö samaa aineistoa monen ehdokkaan seulontaan;
- oliko tulos symmetrian aiheuttama;
- oliko kuvio jo pakotettu määritelmän perusteella;
- onko havainto riippuvainen hakujärjestyksestä.

## 8.2 Challenge-vaihe

Challenge-vaiheen tulee erota discovery-vaiheesta vähintään yhdellä aidolla akselilla:

- eri algoritmi;
- eri tietorakenne;
- eri ohjelmointikieli;
- eri matemaattinen representaatio;
- tyhjentävä luettelointi satunnaisotoksen sijaan;
- suora määritelmätason tarkistin;
- graafimenetelmä merkkijonomenetelmän sijaan;
- eri symmetriakanonisointi;
- ulkopuolisen tutkijan toteutus.

Pelkkä muuttujien uudelleennimeäminen tai saman ydinkirjaston kutsuminen eri CLI:stä ei ole riippumaton tarkistus.

## 8.3 Monen hypoteesin seulonta

Kun järjestelmä etsii tuhansista ominaisuuksista poikkeavia kuvioita, jokin näyttää väistämättä kiinnostavalta. Siksi tallennetaan:

- ehdokasavaruuden koko;
- valintakriteeri;
- käytetyt kynnysarvot;
- montako ehdokasta hylättiin;
- muuttuiko valintakriteeri aineiston näkemisen jälkeen.

Tilastollinen signaali toimii vain priorisointina. Matemaattinen väite ratkaistaan vasta vastaesimerkillä, täydellisellä rajatulla laskennalla tai todistuksella.

---

# 9. Vastaesimerkkiputki

Vastaesimerkkimoottori on konjektuurigeneraattoria tärkeämpi.

## 9.1 Vastaesimerkin käsittely

Kun ehdokas löytyy:

1. tarkista se hitaalla referenssitoteutuksella;
2. varmista, että käytetty määritelmäversio on oikea;
3. pienennä pituutta tai parametreja;
4. kanonisoi symmetrioiden suhteen;
5. paikanna ensimmäinen kohta, jossa väite rikkoutuu;
6. tallenna koneellisesti tarkistettava artefakti;
7. tarkista, kumoaako esimerkki alkuperäisen väitteen vai vain yhden tulkinnan;
8. merkitse kaikki riippuvat konjektuurit tarkistettaviksi;
9. arvioi, syntyykö korjattu seuraajakonjektuuri.

## 9.2 Väärän konjektuurin arvo

Hyvä hylkäys vastaa ainakin yhteen kysymykseen:

- Mikä oletus puuttui?
- Mikä datan ominaisuus johdatti harhaan?
- Oliko kuvio hakualgoritmin eikä matematiikan ominaisuus?
- Onko olemassa pienempi korjattu väite?
- Sulkeeko vastaesimerkki kokonaisen todistusstrategian?
- Voidaanko siitä muodostaa regressiotesti?

---

# 10. Todistusvelvoitteet ja sertifikaatit

Kun konjektuuri selviää haasteista, seuraava kysymys ei ole “kuinka paljon pidemmälle testaamme”, vaan:

> **Mikä rakenne pakottaisi tämän kaikissa tapauksissa?**

## 10.1 Todistusvelvoitteet

```yaml
conjecture_id: CONJ-B16-0001

obligations:
  - id: O1
    statement: Täsmällinen apuväite
    status: proved
    method: algebraic
    dependencies: []

  - id: O2
    statement: Rajatapaus
    status: computationally_exhausted
    run_ids:
      - RUN-...
    dependencies:
      - O1

  - id: O3
    statement: Yleistys kaikille pituuksille
    status: open
    dependencies:
      - O1
      - O2
```

Todistus ei ole valmis, jos yksikin välttämätön velvoite on avoin.

## 10.2 Sertifikaattityypit

Projektin laskennallisissa tuloksissa pyritään tuottamaan mahdollisimman pieni tarkistettava sertifikaatti:

- positiivinen olemassaolotulos: sana, morfismi, sykli tai kuvaus;
- negatiivinen äärellinen tulos: avaruuden ositus, laskurit ja verifioija;
- graafitulos: syklit, SCC-jäsenyys tai dualipotentiaali;
- lineaarialgebra: matriisit ja tarkat laskut;
- CSP/CEGIS: ehdokasjoukko, vastaesimerkit ja tarkistin;
- taajuusraja: saavuttava sykli ja rajan todistava potentiaali;
- tekijäluettelo: kanoninen lista, määrä ja jäsenyystarkistus.

Sertifikaatin pitää olla huomattavasti helpompi tarkistaa kuin alkuperäinen tutkimusajo.

---

# 11. Määritelmien versiointi

Tämä on yksi tärkeimmistä yhteistyötä varten lisättävistä rakenteista.

Termit kuten `aa2f`, `aa2fr`, `pure`, “periodi”, “puolipituus”, “tekijä”, “oikealle jatkettava” ja “epäsuotuisa” eivät saa jäädä vain koodin implisiittisiksi oletuksiksi.

## 11.1 Määritelmäkortti

```text
research/definitions/DEF-AA2F-1.md
research/definitions/DEF-AA2FR-1.md
```

Kortti sisältää:

- matemaattisen määritelmän;
- aakkoston;
- raja- ja indeksikonventiot;
- esimerkit;
- positiiviset ja negatiiviset testit;
- vastaavan referenssitarkistimen;
- suhteen kirjallisuuden terminologiaan;
- erot projektin omiin lähikäsitteisiin;
- muutoksen seuraavaan versioon.

## 11.2 Miksi versiointi on pakollinen?

Jos määritelmä tai tarkistin muuttuu, vanha tulos ei saa hiljaisesti vaihtaa merkitystä. Ajomanifesti sitoo tuloksen:

- määritelmäversioon;
- Git-committiin;
- tarkistimen versioon.

Määritelmän uusi versio voi laukaista kaikkien riippuvien tulosten uudelleentarkistuksen.

---

# 12. Riippuvuusgraafi ja korjausten vaikutus

Projektissa yksittäinen virhe voi vaikuttaa useisiin myöhempiin päätelmiin. Tätä ei pidä selvittää käsin vasta kriisin jälkeen.

## 12.1 Jokainen konjektuuri ilmoittaa riippuvuutensa

```yaml
dependencies:
  claims: [51, 78, 99]
  conjectures:
    - CONJ-B16-0001
  definitions:
    - DEF-AA2F-1
  code_modules:
    - rauzy-graph.js
  datasets:
    - DATA-AA2FR-RECORD-1
```

## 12.2 Automaattinen vaikutusanalyysi

Jos jokin claim-rivi muuttuu tilaan `REJECTED`, `RETRACTED` tai `DISPUTED`, CI listaa:

- siitä riippuvat avoimet konjektuurit;
- siitä riippuvat todistukset;
- siitä riippuvat käyttöliittymätekstit;
- siitä riippuvat haastepaketit;
- siitä riippuvat julkaistut snapshotit.

Riippuvia tuloksia ei automaattisesti kumota, mutta ne merkitään `REVIEW_REQUIRED`.

## 12.3 Ristiriitoja ei ratkaista poistamalla historiaa

Jos kaksi laskentaa antaa eri tuloksen:

- molemmat manifestit säilytetään;
- tila muutetaan `DISPUTED`;
- kirjoitetaan ristiriidan minimaalinen kuvaus;
- estetään tuloksen vienti julkiseen claims-dataan;
- rakennetaan pienin tapaus, jossa toteutukset eroavat;
- vasta eron selvittyä toinen tulos korjataan tai molemmat rajataan uudelleen.

---

# 13. GitHub-työnkulku

## 13.1 Issue ensin, koodi vasta sitten

Uusi konjektuurilinja alkaa Issuena. Issue kysyy vähintään:

1. Mikä on tutkimuskysymys?
2. Mikä on ehdotettu formaali väite?
3. Onko se kielen invariantti vai hakualgoritmin mittari?
4. Mistä havainto syntyi?
5. Kuinka monta muuta kuviota seulottiin?
6. Mikä on halvin tappotesti?
7. Mitä yksi vastaesimerkki kumoaa?
8. Mitkä symmetriat pitää normalisoida?
9. Mikä on riippumaton tarkistuspolku?
10. Mitkä lähteet on jo avattu?
11. Millainen tulos voisi päätyä väitelokiin?
12. Mikä uusi tieto oikeuttaisi hylätyn suunnan avaamisen uudelleen?

## 13.2 Labelit

```text
research-lead
observation
formal-conjecture
challenge-ready
needs-counterexample-search
needs-independent-replication
needs-proof-audit
needs-literature-trace
bounded-result
rejected
disputed
superseded
external-review
review-required
```

Vältetään labeleita:

```text
high-confidence
likely-true
breakthrough
almost-proved
```

## 13.3 Branchit

```text
observation/CONJ-B16-0002
formalize/CONJ-B16-0002
challenge/CONJ-B16-0002
counterexample/CONJ-B16-0002
proof/CONJ-B16-0002
review/CONJ-B16-0002
```

## 13.4 Commit-viestit

```text
obs(CONJ-B16-0002): record exact finite relation at n=16
conj(CONJ-B16-0002): state quantified candidate
test(CONJ-B16-0002): add independent small-case falsifier
challenge(CONJ-B16-0002): exhaust canonical cases through n=22
falsify(CONJ-B16-0002): add minimal verified counterexample
prove(CONJ-B16-0002): derive relation from flow conservation
claim(CONJ-B16-0002): link approved ledger row
review(CONJ-B16-0002): record external proof audit
```

## 13.5 Historiaa ei squashata pois

Havainto, formalisaatio, haastaminen ja ratkaisu ovat eri epistemisiä tapahtumia. Ainakin nämä säilytetään erillisinä committeina tai muuten muuttumattomana tapahtumahistoriana.

---

# 14. CI ja tutkimuksen eheystarkistus

Lisätään kaksi kevyttä tarkistinta:

```bash
node conjecture-check.js
node research-integrity.js
```

## 14.1 `conjecture-check.js`

Tarkistaa esimerkiksi:

- tunnisteiden yksikäsitteisyyden;
- YAML/JSON-skeeman;
- pakolliset kentät tilan mukaan;
- viitattujen tiedostojen olemassaolon;
- sääntöjoukon version;
- että `REJECTED`-tilalla on peruste;
- että `SURVIVED_BOUNDED_TESTS` ilmoittaa rajat;
- että `PROVED_INTERNAL` viittaa claim-riviin;
- että `EXTERNALLY_REPLICATED` viittaa arvioon ja ajomanifestiin.

## 14.2 `research-integrity.js`

Tarkistaa esimerkiksi:

- rikkoutuneet claim-riippuvuudet;
- retracted/disputed-claimien vaikutukset;
- määritelmäversion muutokset;
- saman ajon käytön sekä discovery- että challenge-näyttönä;
- että täydellinen laskenta ilmoittaa avaruuden koon;
- että symmetriareduktio on ainakin kerran verrattu raakaan laskentaan;
- että julkaistavalla tuloksella on riippumaton verifiointi;
- että käyttöliittymässä näkyvä konjektuuritila vastaa rekisteriä;
- että “not in literature” -muotoilua ei käytetä ilman hyväksyttyä perustetta;
- että tuloksissa ei käytetä vanhentunutta määritelmäversiota;
- että muuttunut tiedostopolku ei jätä vanhaa generoituvaa artefaktia hiljaisesti eloon.

## 14.3 Raskaat ajot

Raskaita tutkimusajoja ei ajeta jokaisessa PR:ssä. Ne toteutetaan erillisellä käsin käynnistettävällä työnkululla, joka:

- lukitsee commitin;
- kirjaa ympäristön;
- tuottaa manifestin;
- tallentaa checksummat;
- epäonnistuu, jos työpuu on likainen;
- tuottaa uudelleen tarkistettavan artefaktin.

---

# 15. Ulkopuolisten tutkijoiden yhteistyömalli

Projektin tavoitteena ei ole ainoastaan esitellä tuloksia vaan tehdä niistä haastettavia.

## 15.1 Osallistumisen muodot

Ulkopuolinen tutkija voi osallistua esimerkiksi roolissa:

- **literature tracer** — jäljittää alkuperäislähteen;
- **replicator** — toteuttaa saman laskennan uudelleen;
- **counterexample hunter** — etsii ja minimoi vastaesimerkkejä;
- **proof auditor** — tarkistaa matemaattisen argumentin;
- **method challenger** — etsii oletuksia, vinoumia ja puuttuvia tapauksia;
- **domain collaborator** — ehdottaa alan rakenteeseen perustuvia lemmoja;
- **software verifier** — tarkistaa toteutuksen ja enumeroinnin;
- **formalization contributor** — siirtää tuloksen proof assistantiin;
- **co-investigator** — kehittää yhdessä uuden tutkimuslinjan.

## 15.2 Tutkijalle toimitettava review packet

Yhden konjektuurin ulkoista arviointia varten tuotetaan pieni itsenäinen paketti:

```text
1. Väite yhdellä sivulla
2. Täsmälliset määritelmät
3. Väitteen nykyinen tila
4. Mitä on todistettu ja mitä vain laskettu
5. Riippuvuudet aiempiin claim-riveihin
6. Pienin positiivinen esimerkki
7. Pienin negatiivinen kontrolli
8. Toistettava komento
9. Ajomanifesti ja checksummat
10. Riippumaton tarkistin
11. Tunnetut heikot kohdat
12. Täsmällinen kysymys arvioijalle
```

Arvioijaa ei pyydetä yleisesti “katsomaan repo läpi”, vaan tekemään määritelty tehtävä.

## 15.3 Riippumattomuustasot

| Taso | Kuvaus |
|---|---|
| R0 | Sama ohjelma, sama ympäristö |
| R1 | Puhdas klooni, sama ohjelma |
| R2 | Eri CLI tai tietorakenne, sama ydinkirjasto |
| R3 | Eri toteutus, sama matemaattinen menetelmä |
| R4 | Eri menetelmä tai representaatio |
| R5 | Todistus tai formaali varmennus, joka ei tarvitse alkuperäistä hakua |

`EXTERNALLY_REPLICATED`-merkinnässä ilmoitetaan taso.

## 15.4 Haastaminen on ensisijainen yhteistyömuoto

Ulkopuolisen tutkijan tehtävä ei ole vahvistaa projektin onnistumista, vaan löytää:

- vastaesimerkki;
- puuttuva rajatapaus;
- väärä lähdetulkinta;
- ohjelmistovirhe;
- symmetriaan liittyvä ylikertaus;
- riippuvuus haun järjestyksestä;
- tunnettu lause, joka tekee työn tarpeettomaksi;
- vahvempi tai yksinkertaisempi muotoilu.

Negatiivinen arvio ei ole epäonnistuminen. Se on uuden tiedon syntyä, jos se on täsmällinen ja kirjataan.

---

# 16. Tekijyys, ansiointi ja vastuu

Git-commit ei yksin määritä tieteellistä tekijyyttä, eikä idea yksin automaattisesti takaa tekijyyttä.

## 16.1 Kirjattavat panokset

- tutkimuskysymyksen muodostaminen;
- formalisaatio;
- matemaattinen menetelmä;
- ohjelmistototeutus;
- laskennan suorittaminen;
- riippumaton verifiointi;
- vastaesimerkki;
- todistus;
- kirjallisuuden jäljitys;
- aineiston kuratointi;
- dokumentointi;
- ulkoinen arviointi;
- projektin koordinointi.

## 16.2 Ehdotetut tiedostot

```text
CONTRIBUTORS.md
GOVERNANCE.md
CITATION.cff
```

## 16.3 AI:n rooli

AI:n osallistumisesta kirjataan:

- käytetty järjestelmä tai malli, jos tiedossa;
- tehtävän kuvaus;
- tuotettu koodi tai ehdotus;
- ihmisen tekemät hyväksymis- ja korjauspäätökset;
- riippumaton tarkistus.

AI:n tuottama teksti, koodi tai idea ei ole itsessään varmennus.

---

# 17. Julkaisut, snapshotit ja arkistointi

Kun tutkimuslinja saavuttaa ulkoisesti jaettavan vaiheen:

1. lukitaan commit;
2. ajetaan kaikki kevyet testit;
3. tuotetaan tutkimusmanifesti;
4. tuotetaan haastepaketti;
5. päivitetään claims ledger;
6. päivitetään `KNOWLEDGE_STATE.md`;
7. merkitään tunnetut rajoitukset;
8. tehdään versionumeroitu Git-tag;
9. arkistoidaan tarvittaessa julkaistava snapshot pysyvään palveluun;
10. julkaistaan changelog.

Ehdotettu tagi:

```text
research-snapshot-2026-08-05
```

Snapshot ei väitä vertaisarviointia. Se kertoo tarkasti, mikä koodi, aineisto ja dokumentaatio tuottivat kyseisen tilannekuvan.

---

# 18. AI-avusteisen työn provenance

Pitkissä AI-avusteisissa projekteissa sama idea voi palata eri nimellä. Lisäksi agentti voi ehdottaa lähdettä tai lukua, joka kuulostaa täsmälliseltä mutta ei ole tarkistettu.

```yaml
ai_provenance:
  assisted: true
  role:
    - candidate_generation
    - code_drafting
  session_summary: >
    Lyhyt kuvaus pyydetystä tehtävästä ja tuotoksesta.
  human_decisions:
    - accepted_formalization
    - rejected_interpretation
  independent_verification_required: true
```

Yksityistä päättelyketjua ei tarvita. Tarvitaan jäljitettävä kuvaus siitä:

- mitä pyydettiin;
- mitä AI tuotti;
- mitä ihminen hyväksyi;
- mikä tarkistettiin erikseen.

Usean agentin ajaminen saman aineiston ja saman koodin päällä ei tuota aidosti riippumatonta verifiointia.

---

# 19. Asiat, jotka ovat erityisen helppoja unohtaa

## 19.1 Määritelmädrifti

Tarkistin muuttuu, mutta vanha tulos jää samaan tiedostonimeen. Ratkaisu: versioidut määritelmät ja ajomanifestit.

## 19.2 Riippuvuuksien ketjureaktio

Yksi claim korjataan, mutta siitä riippuvia konjektuureja ei tarkisteta. Ratkaisu: koneellisesti luettava riippuvuusgraafi.

## 19.3 Valikoitumisharha konjektuurien louhinnassa

Tuhansista mitatuista ominaisuuksista nostetaan vain näyttävin. Ratkaisu: tallenna ehdokasavaruus ja valintamenetelmä.

## 19.4 Selviytymisharha tutkimushistoriassa

Vain onnistuneet konjektuurit säilyvät. Ratkaisu: hylkäykset, vastaesimerkit ja supersedoinnit säilytetään.

## 19.5 Saman koodivirheen jakaminen

Kaksi riippumatonta tarkistinta käyttää samaa apufunktiota. Ratkaisu: riippumattomuuskartta, joka ilmoittaa jaetut moduulit.

## 19.6 Symmetrioiden tuottamat näennäiset löydöt

Sama väite syntyy kirjainten uudelleennimeämisellä useita kertoja. Ratkaisu: kanonisointi ennen konjektuurin luontia.

## 19.7 Hypoteesin muuttaminen tuloksen jälkeen

Konjektuuria rajataan vasta, kun vastaesimerkki löytyy, ja alkuperäinen versio katoaa. Ratkaisu: muuttumaton historia ja uusi versio.

## 19.8 Negatiivisen tuloksen ylilaajentaminen

Rajattu haku esitellään koko reitin kuolemana. Ratkaisu: rajaus näkyy otsikossa, tietueessa ja claim-lauseessa.

## 19.9 Uutuusväitteen ennenaikaisuus

Tulosta ei löydy muutamasta paperista, joten sitä kutsutaan uudeksi. Ratkaisu: “not found in checked sources” sekä ulkoinen literature trace.

## 19.10 Julkaisemattoman ulkoisen tiedon käsittely

Tutkija kertoo yksityisesti tuloksen tai antaa aineiston. Ratkaisu: lupa, näkyvyystaso, omistajuus ja siteeraustapa kirjataan ennen käyttöä.

## 19.11 Tekijyysriita

Idea, koodi, todistus ja varmennus syntyvät eri ihmisiltä. Ratkaisu: panosroolit kirjataan työn aikana.

## 19.12 Tutkimusvelka

Konjektuureja kertyy ilman omistajaa tai seuraavaa testiä. Ratkaisu: jokaisella avoimella tietueella on owner, blocker ja seuraava päätöspiste.

## 19.13 Ikuisesti avoin konjektuurijono

Heikkoja johtolankoja säilytetään aktiivisena vuosia. Ratkaisu: `LEAD`-tilalle review date; ilman uutta näyttöä se arkistoidaan.

## 19.14 Epäreilu ulkoinen haaste

Arvioijalta pyydetään koko projektin varmistamista ilman rajattua tehtävää. Ratkaisu: challenge packet ja täsmällinen arviointikysymys.

## 19.15 Toistettavuus ilman ymmärrettävyyttä

Komento tuottaa saman numeron, mutta kukaan ei tiedä miksi se vastaa väitettä. Ratkaisu: määritelmäkortti, sertifikaatti ja todistusvelvoitteet.

## 19.16 Koodin ja matematiikan rajapinta

Matemaattinen predikaatti on hajautettu useaan optimointiin. Ratkaisu: hidas referenssitarkistin pidetään erillään nopeasta hakukoodista.

## 19.17 Tiedostopolkujen ja generoituvaan datan drift

Repo järjestellään uudelleen, mutta skripti kirjoittaa väärään paikkaan. Ratkaisu: oletuspolkujen smoke test ja stale-artifact check.

## 19.18 Negatiivisten tulosten lopullisuuden aste

Kaikki graveyard-merkinnät eivät ole yhtä lopullisia. Käytetään vähintään luokkia:

- `NECESSARY`
- `BOUNDED`
- `CONTEXTUAL`

ja konjektuuritietueeseen kirjataan ylösnousemusehto.

---

# 20. Ensimmäinen pilotti: B16 kultaisena kontrollina

Konjektuuriputken ensimmäinen tietue kannattaa tehdä jo ratkaistusta B16-havainnosta, jossa kahdeksan bigramimäärää pakottaa yhdeksännen.

Se on hyvä kontrolli, koska siinä on koko elinkaari:

1. eksakti aineisto;
2. odottamaton kuvio;
3. yleinen formalisaatio;
4. pienien tapausten tyhjentävä tarkistus;
5. lineaarialgebrallinen selitys;
6. hyväksytty claim-rivi;
7. selkeä ero datan ja todistuksen välillä.

Jos tämä historia ei mahdu tietuemalliin ilman päällekkäistä totuuslähdettä, mallia pitää korjata ennen avoimia konjektuureja.

---

# 21. Toinen pilotti: aidosti avoin konjektuuri

Toinen pilotti valitaan projektin omasta aineistosta, mutta sen pitää täyttää seuraavat ehdot:

- väite koskee invarianttia, ei DFS-telemetriaa;
- väite on täsmällisesti falsifioitava;
- halpa tappotesti on olemassa;
- symmetriat voidaan kanonisoida;
- discovery- ja challenge-polut voidaan erottaa;
- vääräkin tulos tuottaa hyödyllisen vastaesimerkin tai rajauksen;
- kirjallisuussuhde voidaan tarkistaa;
- mahdollinen todistusmekanismi voidaan nimetä.

Hyviä ehdokastyyppejä ovat:

- bigrami- tai faktorimäärien lineaariset riippuvuudet;
- tarkka jatkettavuuslemma;
- minimaalinen kielletty konteksti;
- siirtymägraafin pakotettu rakenne;
- morfismin välttämätön matriisiehto;
- symmetriaorbittien täsmällinen luokitus;
- äärellisen ikkunan stabiloitumisväite, jolle voidaan etsiä automaattiselitys.

---

# 22. Käyttöönoton vaiheistus

## Vaihe 0 — hyväksy periaatteet

Päätetään:

- tunnisteformaatti;
- elinkaaren tilat;
- mitkä tiedostot ovat auktoriteetteja;
- milloin claim-rivi vaaditaan;
- kuka hyväksyy tilasiirtymät.

## Vaihe 1 — lisää tämä dokumentti

```text
docs/plans/CONJECTURE_RESEARCH_PIPELINE.md
```

Päivitä `RESEARCH_CONTEXT.md` lisäämällä dokumentti lukujärjestykseen tutkimusideoiden ja yhteistyön yhteyteen.

## Vaihe 2 — lisää määritelmät

```text
research/definitions/DEF-AA2F-1.md
research/definitions/DEF-AA2FR-1.md
```

## Vaihe 3 — lisää skeemat ja tarkistin

```text
research/schemas/conjecture.schema.json
research/schemas/run-manifest.schema.json
conjecture-check.js
```

## Vaihe 4 — rekisteröi B16

```text
research/conjectures/CONJ-B16-0001.yml
research/proofs/CONJ-B16-0001/proof.md
```

## Vaihe 5 — ajomanifesti yhteen olemassa olevaan laskentaan

Valitse pieni, nopeasti toistettava exact-laskenta.

## Vaihe 6 — vastaesimerkkimuoto ja minimointi

Lisää tietuemalli sekä yksi tunnettu hylätty hypoteesi regressiokontrolliksi.

## Vaihe 7 — CI

Lisää:

```text
node conjecture-check.js
node research-integrity.js
```

Aloita varoituksilla. Muuta tarkistukset estäviksi vasta, kun nykyinen repo läpäisee ne.

## Vaihe 8 — ulkoisen arvioinnin pilotti

Tuota B16:sta tai toisesta pienestä tuloksesta challenge packet.

## Vaihe 9 — avoin konjektuurikampanja

Valitse yksi uusi konjektuuri ja tee sille erilliset PR:t:

1. discovery;
2. formalization;
3. challenge;
4. resolution tai rejection;
5. external review.

## Vaihe 10 — governance ja julkaisuvalmius

Lisää:

```text
GOVERNANCE.md
CONTRIBUTORS.md
CITATION.cff
```

sekä ensimmäinen versionumeroitu research snapshot.

---

# 23. Hyväksymiskriteerit

Järjestelmä on ensimmäisessä käyttökelpoisessa vaiheessa, kun:

- [ ] jokaisella konjektuurilla on pysyvä tunniste;
- [ ] konjektuurirekisteri ei toista `MATH_CLAIMS.md`:n roolia;
- [ ] B16:n koko elinkaari on kuvattu;
- [ ] ainakin yksi avoin konjektuuri on formalisoitu;
- [ ] jokainen merkittävä ajo tuottaa manifestin;
- [ ] määritelmäversio näkyy ajoissa;
- [ ] discovery ja challenge erotetaan;
- [ ] pienin vastaesimerkki voidaan tallentaa ja tarkistaa;
- [ ] riippuvuusgraafi voidaan lukea koneellisesti;
- [ ] retracted/disputed-riippuvuus aiheuttaa varoituksen;
- [ ] CI estää rajattoman tulkinnan ilman rajoja;
- [ ] ulkopuolinen tutkija pystyy toistamaan yhden tuloksen challenge packetin avulla;
- [ ] ansiointi ja arviointiraportti voidaan kirjata;
- [ ] käyttöliittymä ei esitä `SURVIVED_BOUNDED_TESTS`-tilaa todistettuna;
- [ ] kaikki julkaistavat luvut ovat jäljitettävissä claim-riviin tai hyväksyttyyn havaintoon.

---

# 24. Tutkimusyhteistyön tavoitetila

Pitkällä aikavälillä projektin pitäisi pystyä tarjoamaan tutkijalle kolme asiaa samanaikaisesti:

## 24.1 Matemaattinen selkeys

Väite, määritelmät, rajat ja riippuvuudet löytyvät ilman käyttöliittymän tai AI-keskustelujen tulkintaa.

## 24.2 Tekninen toistettavuus

Tulos voidaan tuottaa puhtaasta snapshotista tai tarkistaa pienellä sertifikaatilla.

## 24.3 Episteminen haastettavuus

Projektin rakenne tekee helpoksi osoittaa, että jokin on väärin:

- vastaesimerkit ovat ensimmäisen luokan artefakteja;
- erimielisyys voidaan kirjata;
- claim-riippuvuudet voidaan jäädyttää;
- hylätyt ideat eivät katoa;
- uutuusväitteitä ei suojata kritiikiltä;
- tutkijan korjaus näkyy ansioinnissa.

Hyvä tutkimuslaboratorio ei ole järjestelmä, joka tuottaa eniten väitteitä, vaan järjestelmä, jossa väärä väite on mahdollisimman helppo havaita, paikantaa, korjata ja muuttaa seuraavaksi paremmaksi kysymykseksi.

---

# 25. Lopullinen periaate

> **Konjektuuri ei ole tulos. Testistä selviäminen ei ole todistus. Git-historia ei ole varmennus. Usea agentti ei ole riippumaton replikaatio. Uutta tietoa syntyy, kun täsmällinen väite pakotetaan kohtaamaan vastaesimerkit, täydelliset rajatut laskut, rakenteellinen selitys, kirjallisuus ja ulkopuolinen kritiikki — ja koko muutosketju säilyy tarkistettavana.**

Projektin mahdollinen menetelmällinen kontribuutio on tämän ketjun tekeminen näkyväksi ja käytännössä toimivaksi:

> **auditoitava, Git-pohjainen järjestelmä, jossa laskennallinen havainto voidaan jalostaa konjektuuriksi, haastaa riippumattomasti ja ratkaista vastaesimerkiksi, rajatuksi tulokseksi tai todistetuksi lauseeksi ilman, että eri epistemiset tasot sekoittuvat.**
