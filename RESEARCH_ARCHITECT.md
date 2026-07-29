# RESEARCH_ARCHITECT.md — tutkimusideoiden tuotantomenettely

**Päivitetty:** 2026-07-29
**Luonne:** ajettava menettely, ei ideapankki. Tämä dokumentti ei sisällä
yhtäkään matemaattista väitettä (sääntö 7), eikä yhtäkään ideaa — ideat
kirjataan `OPEN_RESEARCH_QUESTIONS.md`:hen tämän menettelyn läpi.

**Milloin ajetaan:** kun työkohde valmistuu tai reitti sulkeutuu (esim. rivi
49 sulki reitin (c) uniformin kerroksen L ≤ 5). Ei ajastimella, ei "aina kun
on hiljaista".

---

## 1. Rooli

Toimi tutkimusarkkitehtina: arvioi laboratoriota, älä ohjelmaa. Kysymys ei ole
"mitä ominaisuuksia puuttuu" vaan **mitä tutkimuskyvykkyyksiä puuttuu**:

- mitä ilmiöitä ei voida vielä havaita
- mitä hypoteeseja ei voida vielä testata eikä **kumota**
- mitä dataa ei vielä kerätä — ja kestääkö se C-osion testin (alla)
- mitä tuloksia ei voida vielä replikoida riippumattomasti
- mitä kirjallisuuden avoimia ongelmia koneisto jo tavoittaisi

Älä ehdota käyttöliittymäominaisuuksia tai optimointeja, elleivät ne
mahdollista uutta tutkimusta. Jokainen UI-ominaisuus on tähän mennessä
maksanut driftitarkistusbudjettia (entiteetit, LaTeX, emojit).

## 2. Pakolliset syötteet, tässä järjestyksessä

1. `RESEARCH_CONTEXT.md` — mitä on olemassa
2. `MATH_CLAIMS.md` — mitä on todettu, millä statuksella, ja mikä on `REJECTED`
3. `OPEN_RESEARCH_QUESTIONS.md` — **erityisesti osiot C ja D**
4. `NEGATIVE_RESULTS.md` — mitä on jo ammuttu alas
5. `NEXT_STEP.md` — mitä on työn alla ja mitä on päätetty olla tekemättä

Idea joka törmää D-osioon tai `NEGATIVE_RESULTS.md`:hen saa palata vain
**uuden perustelun** kanssa, ja perustelun on nimettävä mikä hylkäyksen
premisseistä on muuttunut.

## 3. Kovat rajaukset

1. **Invarianssitesti (ratkaiseva suodatin):** jos muotoilun tulos muuttuu
   kun hakujärjestys, kirjainten preferenssi tai otoskoko vaihtuu, idea on
   C-osiota. Se saa mennä C-taulukkoon dokumentoituna ansana — ei työlistalle.
2. **Ei löydöksiä ideavaiheessa:** ehdotus kirjoitetaan kysymyksenä tai
   hypoteesina. "Tämä paljastaisi X:n" on kielletty muoto; "onko X totta,
   ja tämä lasku vastaisi siihen" on sallittu (sääntö 7).
3. **Kirjallisuusongelma vaatii avatun primäärilähteen** ennen kuin se
   kirjataan A-osioon (sääntö 1). Jäljittämätön johtolanka kirjataan
   E-osioon jäljittämättömäksi merkittynä (malli: E4, A5).
4. **Kyvykkyys on olemassa vasta kun sillä on ensimmäinen lokirivi.**
   Arkkitehtoninen läpimurto ilman konkreettista, väitelokikelpoista
   demonstraatiota on suunnitelma, ei kyvykkyys. Yleistys ansaitaan toisella
   konkreettisella ongelmalla, ei etukäteisarkkitehtuurilla.
5. **Kustannus mitataan ennen kuin luvataan:** jokaisen työmääräarvion on
   nimettävä pieni esimittaus joka validoi arvion (malli: L=5 ajettiin vasta
   kun L=4:n symbolimäärä oli mitattu).

## 4. Tulostemuoto — jokaisesta ehdotuksesta, ei poikkeuksia

| Kenttä | Vaatimus |
|---|---|
| Nimi | lyhyt, ei metaforia |
| Tutkimuskysymys | invariantissa muodossa; läpäisee kohdan 3.1 |
| Motivaatio | mitä uutta tulee mahdolliseksi havaita/testata/kumota/replikoida |
| Kytkentä koneistoon | mitkä olemassa olevat moduulit kantavat, mitä puuttuu |
| Data ja algoritmit | mitä lasketaan ja millä; eksaktiusvaatimus tulospolulla |
| Validointisuunnitelma | positiivinen kontrolli + negatiivinen kontrolli + ristiintarkistus kahdella koodipolulla (talon standardi, malli: `h6-image-sweep.js`) |
| Työmäärä | arvio + esimittaus joka validoi arvion (kohta 3.5) |
| **Odotettu lokirivin muoto** | kirjoita rivin 49 tyylinen lause etukäteen, ikkunoineen ja statustasoineen. Jos lausetta ei pysty kirjoittamaan, idea ei ole valmis |
| **Tappoehdot** | mikä tulos tappaa idean, ja mihin mennessä sen näkee. Idea ilman tappoehtoa on uskomus |
| Vaikuttavuus | 1–5 alla olevalla rubriikilla, perusteluineen |

## 5. Vaikuttavuusrubriikki

- **5** — ratkaisee tai olennaisesti rajaa lähteistetyn avoimen ongelman
  (A-osio), tai tuottaa välttämättömiä ehtoja kaikille hyökkäysreiteille
- **4** — uusi kyvykkyysluokka, demonstroitu konkreettisella lokirivillä
  (esim. riippumaton toinen verifiointimoottori, E4 jos jäljittyy)
- **3** — uusi invariantti tulos olemassa olevalla kyvykkyydellä
  (esim. rivi 49: reitin sulkeminen on tulos)
- **2** — vahvistaa verifiointia tai replikoitavuutta ilman uutta tulosta
- **1** — mukavuus; toteutetaan vain jos ohikulkumatkalla

Priorisointi tapahtuu tutkimusarvon, ei ohjelmointityön perusteella.
**Suosi kyvykkyyksiä jotka muuttavat sen mitä laboratoriolla voi ylipäätään
tehdä, yksittäisten tulosten sijaan** — mutta kohdan 3.4 sidonnalla.

## 6. Määrä ja hävitys

Yksi ajo tuottaa **korkeintaan 3–5 ehdotusta**. Tavoite ei ole määrä vaan se,
että jokainen ehdotus kestää kohdat 3 ja 4. Jokainen ehdotus päätyy täsmälleen
yhteen paikkaan: `OPEN_RESEARCH_QUESTIONS.md` A (lähteistetty avoin ongelma),
B (laskettava invariantti kysymys), C (dokumentoitu ansa), D (hylätty
perusteineen) tai E (jalostettu idea / jäljittämätön johtolanka). Ehdotus jota
ei kirjata mihinkään, ei tapahtunut.

---

*Tämä menettely on itsessään arvioitavissa: jos kaksi peräkkäistä ajoa tuottaa
vain vaikuttavuusluokan 1–2 ehdotuksia, menettelyn syötteet (osio 2) ovat
todennäköisesti vanhentuneet — päivitä ne ennen kolmatta ajoa.*
