# LAB_VISION_2035.md — laboratorion kyvykkyysvisio, arvioituna

**Päivitetty:** 2026-07-30
**Tila:** PARKED. Ei aikataulua, ei hyväksyntää. Tämä on ideavarasto, ei suunnitelma.
**Alkuperä:** ylläpitäjän laaja ideointi 2026-07-30, tässä **suodatettuna ja arvioituna**.

> Tämä dokumentti ei sisällä matemaattisia väitteitä (sääntö 7). Arviot ovat
> minun, ja ne on merkitty arvioiksi.

---

## Miksi tämä on suodatettu eikä kopioitu

Ideoita oli noin 40. Jos ne kirjattaisiin sellaisenaan, dokumentista tulisi
juuri se mitä `docs/historical/` on täynnä: innostunut suunnitelmapaperi jota
kukaan ei uskalla poistaa eikä kukaan noudata. Siksi jokainen idea on
luokiteltu, ja **suurin osa on hylätty tai todettu jo olemassa olevaksi**.

Suodattimet ovat projektin omat: läpäiseekö idea C-osion invarianssitestin,
onko se kyvykkyys vai ominaisuus, ja onko sillä ensimmäinen konkreettinen
lokirivi vai onko se arkkitehtuuriarvaus (`docs/plans/RESEARCH_ARCHITECT.md`).

---

## A. Jo olemassa, eri nimellä

Nämä ehdotettiin uusina, mutta ne ovat rakennettuja. Uudelleennimeäminen
tuottaisi toisen totuuslähteen.

| Ehdotus | Missä se jo on |
|---|---|
| Negative Knowledge Engine | `NEGATIVE_RESULTS.md` + päivätty hakemisto |
| Evidence Ledger | `MATH_CLAIMS.md`, kaksi vahvistustasoa |
| AI Memory of Mathematics | väiteloki + `REJECTED`-rivit joita ei poisteta |
| Literature Gap Finder | `LITERATURE_COVERAGE.md` |
| Automatic Control Experiments | jokaisen moduulin `runControls()` |
| Universal Counterexample Archive | todistuskappaleet lokiriveillä |
| Research Timeline | git-historia + väitelokin päivämääräsarakkeet |
| Automatic Referee | kolmikerroksinen verifiointi (`SANALAB_PLAN.md` 6b.2) |

---

## B. Aidosti puuttuvat kyvykkyydet, arvioituna

Neljä ideaa jotka **eivät** ole olemassa ja jotka läpäisevät suodattimet.
Järjestys on arvioni toteutuskelpoisuudesta, ei innostuksesta.

### B1. Kill/Resurrection Criteria — halvin ja välittömästi hyödyllinen

Jokaiselle tutkimuslinjalle kirjataan **ennen ensimmäistä ajoa**: millä
tuloksella se lopetetaan, ja millä ehdolla se saa palata hautausmaalta.

Tämä on jo puoliksi olemassa — `RESEARCH_ARCHITECT.md` vaatii tappoehdot
jokaiselta ehdotukselta — mutta **ylösnousemusehto puuttuu**, ja se on
tärkeämpi kuin miltä kuulostaa: rivi 23 nousi `REJECTED`-tilasta kun uusi
todiste löytyi, ja se tapahtui sattumalta eikä kriteerin nojalla. Jos
jokaisella haudatulla idealla olisi kirjattu "tämä avataan uudelleen jos X",
hautausmaa muuttuisi arkistosta **aktiiviseksi jonoksi**.

**Arvio: tehtävissä yhdessä sessiossa, ei vaadi koodia.**

### B2. Frontier Map — kolmijako kahden sijaan

Nykyinen jako on *tiedetty* / *kuollut*. Puuttuu **rintamalinja**: se mikä on
lupaavaa muttei ratkaistu, arvioituna vaivan ja vaikutuksen suhteen.
`LITERATURE_COVERAGE.md` osio 4 nimeää kolme aukkoa, mutta ei priorisoi niitä.

**Arvio: hyödyllinen, mutta vaatii että arviot merkitään arvioiksi.** Vaara on
että "Potential impact ★★★★☆" alkaa näyttää mittaukselta. Kirjattava sanallisesti,
ei tähdillä.

### B3. Information Gain -ohjaus

Kokeet eivät ole samanarvoisia: jos tulos on jo 99 % varma, sadastuhannes ajo
ei opeta mitään. Laskentaa kannattaisi ohjata sinne missä epävarmuus vähenee
eniten.

**Arvio: käsitteellisesti oikein, mutta tässä projektissa vaarallinen.**
Tämän projektin tulokset ovat **eksakteja, eivät todennäköisyyksiä**. Haku joko
tyhjenee tai ei. "P(dead) = 0,992" ei ole tässä olemassa oleva suure, ja sen
keksiminen olisi C-osion muotoilu: se mittaisi hakuprosessia eikä kieltä.
**Käyttökelpoinen vain aikataulutusheuristiikkana** — samassa roolissa kuin E1
(spektraalikuilu kustannusarviona) — ja silloinkin sen tuotokset ovat C-osiota.

### B4. Universal Discovery Benchmark

Sama ongelma, useita hakustrategioita (DFS, SAT, CSP, MCTS, evoluutio) yhden
rajapinnan takana, ja mittaus siitä mikä toimii missäkin.

**Arvio: tämä on ainoa ideoista jolla on julkaisupotentiaalia sellaisenaan** —
ja samalla se on suurin työ. Se vaatii juuri sen rajoiterajapinnan jonka
`SANALAB_PLAN.md` periaate 4 kieltää rakentamasta ennen toista instanssia.
Additiivinen instanssi on nyt olemassa (rivi 54), joten ehto alkaa täyttyä.
**Ei kuitenkaan ennen kuin nykyiset avoimet laskut on tehty.**

---

## C. Hylätyt, ja miksi

| Idea | Miksi ei |
|---|---|
| Research Market ("osakekurssi" avoimille ongelmille) | Tuottaa luvun joka näyttää mittaukselta muttei ole. Suoraan C-osiota |
| Laboratory IQ | Sama ongelma; lisäksi kannustaa ehdottamaan helposti vahvistuvia hypoteeseja |
| Surprise Detector / Unknown Unknown Detector | Poikkeaman määritelmä riippuu hakujärjestyksestä. C-osio, ellei muotoilla invariantiksi |
| Mathematical Ecosystem, Research Energy, Curiosity Engine | Metaforia ilman koodattavaa ydintä (vrt. `OPEN_RESEARCH_QUESTIONS.md` D) |
| Theory Builder | Automaattinen selitysmallien rakentaminen ilman verifiointia on täsmälleen se mitä sääntö 7 kieltää |
| Shadow Research (rinnakkaiset strategiat) | Vertailu vaatii yhteismitallisen tuloksen; ennätyspituus ei ole sellainen (rivi 37) |
| Research Time Machine | Git tekee tämän jo |
| Mathematical Fingerprints | Samankaltaisuusluku ilman invarianttia määritelmää on C-osiota |

---

## D. Se yksi ajatus joka kannattaa säilyttää sanatarkasti

Ylläpitäjän muotoilu, joka on paras tiivistys koko projektin suunnasta:

> *"Älkää yrittäkö automatisoida matemaatikkoa. Automatisoikaa kaikki se työ,
> joka vie matemaatikolta aikaa mutta ei vaadi hänen luovuuttaan."*

Ja sen mitta: **aika ideasta luotettavaan tietoon.** Se on ainoa mittari joka
ei ole C-osiota, koska se mittaa putken läpimenoa eikä kielen ominaisuutta.
Tämän session konkreettinen esimerkki: väitöskirjan avaamisesta primäärilähteen
jäljittämiseen ja vastaesimerkkien verifiointiin kului noin tunti — ilman
väitelokia, driftitarkistinta ja moduulien kontrolleja se olisi ollut päiviä,
ja lopputulos olisi ollut epävarmempi.
