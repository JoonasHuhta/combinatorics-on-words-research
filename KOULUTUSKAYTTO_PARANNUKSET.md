# Ehdotuksia ohjelman parantamiseksi koulutuskäyttöön

Veikko Keräsen kehittämä abeliaanisten neliövapaiden sanojen tutkimussovellus on erittäin tehokas työkalu edistyneeseen matemaattiseen tutkimukseen, erityisesti AA2FR-rajoituksen (välilehti 14) osalta. Koulutuskäytössä (esimerkiksi yliopiston matematiikan tai tietojenkäsittelytieteen kursseilla) sovellusta voitaisiin kuitenkin kehittää pedagogisempaan suuntaan. 

Tässä on koottuna ideoita ja kehitysehdotuksia sovelluksen parantamiseksi opetuskäyttöä varten.

---

## 1. Välilehti 14 (AA2FR Laboratory) pedagogiset parannukset

### Visuaalinen ja interaktiivinen askellus (Step-by-step opetustila)
- **Ongelma:** Nykymuodossaan backtracking-algoritmi (peruuttava haku) etenee joko täydellä nopeudella tai manuaalisilla "Step"-painalluksilla, mutta opiskelijan on vaikea hahmottaa, *miksi* tietty kirjain hylätään.
- **Parannus:** Kun algoritmi törmää törmäykseen (collision), ohjelma voisi pysähtyä ja korostaa visuaalisesti sen osan sanasta, joka muodosti abeliaanisen neliön (näyttäen molempien puoliskojen Parikh-vektorit) tai forbid4-tekijän (korostaen kielletyn kuvion punaisella). 

### AA2F vs AA2FR -vertailuikkuna
- **Ongelma:** Käsitteiden aa2f (sallii jakson 1 neliöt) ja aa2fr (kieltää lisäksi forbid4-tekijät) ero voi olla abstrakti opiskelijalle.
- **Parannus:** Jaettu ruutu, jossa opiskelija voi generoida sanoja rinnakkain molemmilla säännöillä. Ruutu voisi näyttää visuaalisesti, mihin kohtiin aa2f-sanan generointi olisi jatkunut, mutta missä aa2fr "leikkaa" haaran poikki forbid4-säännön takia.

### Parikh-vektorin visuaalinen laskin
- **Ongelma:** Parikh-vektorien laskeminen ja vertailu tapahtuu koodin sisällä pellin alla.
- **Parannus:** "Suurennuslasi"-työkalu, jolla opiskelija voi maalata sanasta kaksi vierekkäistä osaa, ja ohjelma piirtää reaaliajassa molemmille osille histogrammin (a, b ja c -kirjainten määrät). Jos histogrammit täsmäävät, ruutu muuttuu punaiseksi merkiksi abeliaanisesta neliöstä.

---

## 2. Pelillistäminen ja interaktiivisuus (Gamification)

### Ongelmanratkaisutehtävät
- Koulutusversiossa voisi olla "Haasteet"-osio:
  - *Haaste 1:* Rakenna käsin pisin mahdollinen aa2fr-sana 3 kirjaimella.
  - *Haaste 2:* Ohjelma antaa 39-kirjaimisen sanan. Tehtävänä on löytää se yksi kirjain, jolla sanaa voi jatkaa rikkomatta aa2fr-sääntöä.
  - *Haaste 3:* "Etsi virhe" - ohjelma näyttää pitkän sanan, jossa on yksi abeliaaninen neliö. Opiskelijan tulee löytää se.

### Välilehden 13 (Abelian Snake) hyödyntäminen opetuksessa
- Nykyinen Snake-peli on jo loistava pelillinen elementti. Sitä voisi laajentaa "Opetusohjelma"-moodilla (Tutorial mode), joka pysäyttää pelin juuri ennen kuolemaa ja kysyy opiskelijalta: *"Miksi seuraava siirto ylöspäin (kirjain b) on laiton?"*. Opiskelijan täytyy vastata tunnistamalla syntyvä abeliaaninen neliö.

---

## 3. Konseptien visualisointi ja selkeyttäminen

### Terminologian "Tooltip"-sanakirja
- Tutkimustermistö (Parikh-vektori, morfologia, endomorfismi, g85, forbid4, aa2fr) on aloittelijalle raskas.
- **Parannus:** Kaikki keskeiset termit ohjelman käyttöliittymässä tulisi alleviivata katkoviivalla. Kun hiiren vie termin päälle, aukeaa pieni infolaatikko (tooltip), joka selittää käsitteen selkokielellä ja antaa yksinkertaisen esimerkin (esim. *"Parikh-vektori laskee kirjainten määrät. Esim sanassa 'aabac' vektori on a:3, b:1, c:1"*).

### Hakuavaruuden (Search Tree) 3D/2D visualisointi
- Opiskelijoiden on usein vaikea käsittää eksponentiaalista kasvua ja hakupuun karsimista (pruning).
- Välilehti 14 kerää jo tietoa kokeilluista solmuista (Nodes Explored) ja peruutuksista (Backtracks). Tämä data voitaisiin piirtää dynaamiseksi puurakenteeksi, joka kasvaa ja karsiutuu reaaliajassa, havainnollistaen kuinka forbid4-rajoitus pienentää hakuavaruutta dramaattisesti verrattuna pelkkään aa2f-sääntöön.

---

## 4. Tekninen ja käyttöliittymällinen saavutettavuus

### Modulaarinen käyttöliittymä opiskelijoille
- Koko 14 välilehden ohjelma voi olla ylivoimainen ensikertalaiselle.
- **Parannus:** "Opiskelija-tila" (Student Mode), joka piilottaa monimutkaisimmat välilehdet ja avaa niitä sitä mukaa, kun opiskelija suorittaa perushaasteita. Ensin opitaan Parikh-vektorit (välilehti 6), sitten 4 kirjaimen ratkaisu g85 (välilehti 3 ja 9), ja vasta lopuksi edistynyt 3 kirjaimen aa2fr-tutkimus (välilehti 14).

### Koodin kommentointi ja avoimuus
- Tietojenkäsittelytieteen opiskelijoille algoritmien toteutus on yhtä tärkeää kuin tulokset.
- `index.html`:n sisällä oleva koodi on erittäin pitkä (~3100 riviä). Opetuskäyttöä varten koodi tulisi modulaarisoida omiin `.js` -tiedostoihinsa (esim. `parikh.js`, `aa2fr_solver.js`), ja ydinalgoritmit tulisi kommentoida pedagogisesti auki. Ohjelmaan voisi lisätä "Näytä koodi" -painikkeen, joka näyttää, miten kyseinen toiminto (esim. `checkAA2F()`) on ohjelmoitu.

---

## Yhteenveto

Ohjelma on sisällöllisesti ja laskennallisesti jo huippuluokkaa. Koulutuskäytössä suurin lisäarvo syntyy **abstraktien asioiden tekemisestä näkyväksi**:
1. Abeliaanisten neliöiden tunnistamisen visualisointi reaaliajassa.
2. Backtracking-algoritmin askeleiden avaaminen.
3. Termistön avaaminen ja pelillisten haasteiden tuominen puhtaan tutkimustyökalun rinnalle.
