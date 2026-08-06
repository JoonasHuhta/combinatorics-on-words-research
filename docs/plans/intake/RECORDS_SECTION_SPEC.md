# Spec: Kokeellinen ennätyshaku -osio nettisivulle

**Kohderyhmä:** tekoäly (tai kehittäjä), joka toteuttaa tämän osion projektin nettisivulle.
**Konteksti:** projekti tutkii Mäkelän konjektuuria (onko olemassa ääretön ternäärinen sana,
jossa ainoat abelin neliöt ovat 00, 11, 22 — ns. K≥2-ehto). Tämä on edelleen avoin ongelma.
Osa projektia on kokeellinen backtracking-haku, joka etsii mahdollisimman pitkiä äärellisiä
esimerkkisanoja tälle ehdolle. Tämä dokumentti kuvaa, miten kyseinen kokeellinen puoli
esitetään sivustolla — erillään varsinaisista matemaattisista tuloksista.

---

## 0. Kriittisin periaate: älä sekoita kahta eri asiaa

Sivustolla on (tai tulee olemaan) kaksi laadullisesti eri sisältötyyppiä:

| | **Todistetut tulokset** | **Kokeellinen ennätyshaku** |
|---|---|---|
| Mitä se on | Päättelyt, ratkeavuustodistukset, formaalit väitteet | Äärellisiä esimerkkisanoja, jotka on löydetty hakualgoritmilla |
| Mitä se todistaa | Matemaattisia tosiasioita rajoitetusta tapauksesta | Ei mitään äärettömästä konjektuurista — vain että *tämä yksi äärellinen sana* on validi |
| Miten se voi olla väärin | Looginen/laskennallinen virhe todistuksessa | Bugi hakualgoritmissa tai tarkistuksessa |

**Näitä ei saa koskaan esittää samalla sivulla ilman selkeää visuaalista/rakenteellista erottelua.**
Riski: lukija tulkitsee "löysimme 5000 merkin sanan" askeleeksi kohti konjektuurin todistamista.
Se ei ole sitä — mielivaltaisen pitkä äärellinen esimerkki ei todista äärettömän sanan olemassaoloa,
eikä sen puuttuminen tietyltä pituudelta todista ettei sitä ole.

**Toteutusvaatimus:** ennätyshaku-osiolla on **oma URL-polku/sivu**, ei alaotsikko todistettujen
tulosten sivulla. Sivun yläreunassa näkyy aina disclaimer (ks. kohta 4).

---

## 1. Kaksi eri sääntöä — älä koskaan sekoita niitä samaan taulukkoon

Haku tuottaa kahta *eri* luokkaa sanoja, riippuen ajotilasta:

- **AA2F** (`--pure`-tila): ei abelin neliöitä, joiden jakso (block-koko) ≥ 2.
  Tämä on itse Mäkelän konjektuurin oma ehto — ei muuta.
- **AA2FR** (oletustila / heuristinen tila): AA2F **JA LISÄKSI** sana ei sisällä
  yhtäkään näistä kuudesta nelikkomerkkijonosta: `baac, caab, abbc, cbba, accb, bcca`
  (ns. FORBID4-sääntö / "Veikon sääntö").

Tärkeää ymmärtää: **AA2FR on AA2F:n aito osajoukko** (tiukempi ehto), ei parempi eikä huonompi
versio — se on eri ongelma. AA2FR-sanan löytäminen on *vaikeampaa* koska hakuavaruus on
rajoitetumpi, joten pitkä AA2FR-sana on sinänsä oma saavutuksensa, ei suoraan verrattavissa
samanpituiseen AA2F-sanaan.

**Toteutusvaatimus:** jokaisessa ennätystaulukon rivissä on pakollinen sarake **"Luokka"**
arvolla `AA2F` tai `AA2FR`. Näitä ei koskaan lajitella samaan "paras ennätys" -sarakkeeseen
ikään kuin ne kilpailisivat samasta ennätyksestä. Pidä kaksi erillistä taulukkoa tai
suodatin/välilehti, ei yhtä yhdistettyä rankingia.

---

## 2. Verifiointiprotokolla (pakollinen jokaiselle julkaistulle sanalle)

Ennen kuin mikään sana päätyy julkiselle sivulle:

1. **Itsenäinen tarkistus.** Ajetaan tarkistus, joka on kirjoitettu *erikseen* hakualgoritmista
   (ei sama koodipolku kuin `backtracker.js`:n oma `verifyAa2fr`), koska muuten bugi
   tarkistuslogiikassa voisi näkyä identtisenä sekä haussa että "riippumattomassa" tarkistuksessa.
   - Tarkistus laskee kaikkien kolmen kirjaimen (a, b, c) määrät suoraan jokaiselle ikkunaparille
     (ei päättele kolmatta kirjainta kahdesta muusta, vaikka se on matemaattisesti pätevä oikotie —
     pidä toteutukset erillisinä nimenomaan riippumattomuuden vuoksi).
   - AA2FR-sanoille tarkistetaan lisäksi kaikki kuusi FORBID4-mallia erikseen.
2. **Tarkistussumma.** Julkaistava sanatiedosto saa SHA-256-tarkistussumman, joka näytetään
   ennätystaulukossa rivin vieressä, jotta kuka tahansa voi ladata sanan ja varmistaa ettei se
   ole muuttunut.
3. **Metatiedot per ennätys:**
   - Pituus
   - Luokka (AA2F / AA2FR)
   - Siemen (`seed`) ja hakujärjestys (`searchOrder`), jos tiedossa
   - Ajopäivämäärä
   - `--pure` vai heuristinen tila
   - Verifiointitila: `itsenäisesti tarkistettu` / `odottaa tarkistusta` — **älä koskaan näytä
     tarkistamatonta sanaa "vahvistettuna ennätyksenä"**, merkitse se selvästi keskeneräiseksi.

---

## 3. Miksi laskenta vie aikaa — selitysteksti sivulle (yleistajuinen)

Kaksi erillistä ilmiötä, jotka kannattaa selittää molemmat, koska ne selittävät eri asioita:

### 3a. Yksittäisen tarkistuksen kustannus kasvaa sanan mukana

Jokaisen uuden kirjaimen lisäämisen jälkeen algoritmi tarkistaa, syntyikö abelin neliö millä
tahansa jaksolla 2:sta sanan puoliväliin asti. Tämä tarkoittaa, että *yhden kirjaimen lisääminen
n-pituiseen sanaan maksaa O(n) askelta* — ei vakioaikaa. Koko sanan rakentaminen ilman yhtään
peruutusta on siis jo lähtökohtaisesti O(n²)-työtä: 2500 merkin sanalle karkeasti kolme
miljoonaa tarkistusta jo parhaassa mahdollisessa tapauksessa, jossa haku ei koskaan
eksy umpikujaan.

*(Huom. toteuttajalle: koodin kommentti "Full O(1) Abelian Square Check" on harhaanjohtava —
tarkistus itsessään EI ole vakioaikainen, älä toista tätä väärää väitettä sivustolla.)*

### 3b. Peruutusten (backtracking) yhdistelmäräjähdys

Mitä pidemmälle haku etenee, sitä useammin se ajautuu umpikujaan, jossa mikään kolmesta
kirjaimesta ei enää käy — jolloin algoritmi joutuu perääntymään ja kokeilemaan aiempaa kirjainta
uudelleen eri valinnalla. Tämän perääntymisten määrä ei kasva ennustettavasti sanan pituuden
mukana; se voi räjähtää tietyn pituuden jälkeen. Tästä syystä:

- Kuusi rinnakkaista workeria eri hakujärjestyksillä käynnistetään samanaikaisesti (jotta ainakin
  yksi todennäköisesti löytää toimivan polun nopeammin kuin yksi ajo yksin).
- FORBID4-heuristiikka (AA2FR-tila) leikkaa pois haaroja, joiden tiedetään usein johtavan
  umpikujaan — nopeuttaa hakua merkittävästi, mutta tinkii täydellisyydestä (osa validikin AA2F
  sanoista jää löytymättä, koska ne sisältävät jonkin kielletyn nelikon).

### 3c. Lokitus ei ole reaaliaikainen edistymismittari

Selitä myös lyhyesti (jos sivulla näytetään "live"-tyyppistä edistymistä): edistymisloki
päivittyy korkeintaan kerran sekunnissa JA vain silloin kun uusi syvyysennätys saavutetaan —
pitkät hiljaiset jaksot lokissa eivät tarkoita, että haku on jumissa, vaan voivat tarkoittaa
raskasta peruutusvaihetta. Checkpoint-tiedostot (palautuspisteet) päivittyvät kerran minuutissa
per worker riippumatta edistymisestä.

---

## 4. Pakollinen disclaimer-teksti (sivun yläreunaan, ennen mitään taulukkoa)

Käytä suunnilleen tätä muotoilua (mukauta sävyä, mutta säilytä sisältö):

> **Tämä osio on kokeellinen.** Alla olevat sanat ovat tietokonehaun löytämiä äärellisiä
> esimerkkejä, eivät matemaattisia todisteita. Pisimmän löydetyn sanan löytyminen ei todista
> äärettömän Mäkelän-ehdon täyttävän sanan olemassaoloa — eikä ennätyksen kasvun pysähtyminen
> todista sen puuttumista. Katso [todistetut tulokset -sivu](/todistukset) varsinaisista
> matemaattisista väitteistä ja niiden todistuksista.

---

## 5. Ennätystaulukon skeema (ehdotus)

```
| Pituus | Luokka | Pvm | Verifiointi | Siemen | Tila | Lataa | SHA-256 |
|--------|--------|-----|-------------|--------|------|-------|---------|
| 2500   | AA2FR  | ... | ✅ itsenäisesti tarkistettu | "a" | heuristinen | [word.txt] | abc123... |
```

Erottele AA2F- ja AA2FR-taulukot fyysisesti (eri otsikko, eri taulukko) — ei yhtä yhdistettyä
listaa järjestettynä pelkän pituuden mukaan.

---

## 6. Tarkistuslista toteuttajalle

- [ ] Ennätyshaku-osio on omalla URL-polullaan, ei sekoitettuna todistettuihin tuloksiin
- [ ] Disclaimer näkyy sivun yläreunassa aina
- [ ] AA2F ja AA2FR eroteltu rakenteellisesti (eri taulukot/välilehdet), ei vain tekstillä
- [ ] Jokaisella julkaistulla sanalla on itsenäinen (erillinen koodipolku) verifiointi ennen julkaisua
- [ ] Jokaisella sanalla SHA-256-tarkistussumma ja latauslinkki
- [ ] Tarkistamattomat/kesken olevat tulokset merkitty selvästi eivätkä esiinny "vahvistettuina"
- [ ] Selitysteksti laskenta-ajasta sisältää sekä O(n²)-tarkistuskustannuksen että
      backtracking-räjähdyksen, ei vain toista jompaakumpaa
- [ ] Ei toisteta koodin harhaanjohtavaa "O(1)"-kommenttia sellaisenaan
