# Seuraava askel

**Päivitetty:** 2026-07-29 (ilta)
**Lue ensin:** `RESEARCH_CONTEXT.md`, sitten `AGENTS.md`.

---

## Tehty 2026-07-29 (ilta): reitti (c) avattu ja lakaistu L ≤ 5

`h6-image-sweep.js` on olemassa ja validoitu (sisäänrakennetut kontrollit +
L=1-ristiintarkistus kahdella riippumattomalla koodipolulla). Tulokset
`MATH_CLAIMS.md` rivillä **49**, kysymyksenasettelu `OPEN_RESEARCH_QUESTIONS.md`
**B5**:ssä. Ydinhavainto: pieni ikkuna K ∈ [2,5] ja suuret jaksot vetävät
pienillä L vastakkaisiin suuntiin — [2,5]-välttäjiä on tuhansia, mutta jokainen
kuolee suurilla jaksoilla ≤ 44 symbolissa. Rivillä **50** on kirjattu miksi
kasvun alaraja ei ole osatavoite vaan koko konjektuuri (König).

**Tehty jatkona (2026-07-29/30): B6 laskettu kahdella tasolla.**
`sft-container.js` (parametrisoitu kmax:lla), tulokset riveillä **51–52**:
K ∈ [2,5]: yksi SCC (2 844 tilaa), jokaisen kirjaimen taajuus välttämättä
[1/11, 3/4]:ssä, binäärihäntää ei ole. K ∈ [2,6]: kieli kutistuu aidosti
(p(15): 159 006 → 128 940) mutta **väli ei kiristy lainkaan** — [1/11, 3/4]
on stabiili. Kontrollit: Karp verifioitu riippumattomasti Bellman–Fordilla,
DP vs. DFS -ristiintarkistus, Keräsen sana kulkee molempien graafien läpi,
kmax=5-regressio ajettu refaktoroinnin jälkeen. Lisäksi
`RESEARCH_ARCHITECT.md`: tutkimusideoiden tuotantomenettely (rooli,
rajaukset, tulostemuoto, rubriikki) — ideat eivät synny enää vapaana
proosana.

**Seuraava askel:** B6:n jatko 2 — missä stabiilius katkeaa? K ∈ [2,7]
vaatii Howardin algoritmin (Karp-taulukko ei mahdu; eksaktius säilytettävä
rationaalisella verifioinnilla, rivin 51 Bellman–Ford-kuvio kantaa).
Vaihtoehto: B5.1 (L=6-lakaisu; L=5 vaati 14,9 mrd symbolia, mittaa ennen
lupaamista). Kumpikin on äärellinen ja invariantti.

---

## Visioluonnoksen arvio 2026-07-29 (ylläpitäjän teksti "Experimental Combinatorics Laboratory")

Arvioitu kriittisesti tässä sessiossa. Talteen se mikä kestää ja se mikä ei,
jottei visioproosaa omaksuta sellaisenaan:

- **Kestää:** laboratoriolaite-ajatus — mutta laite on episteeminen koneisto
  (väiteloki + driftitarkistin + hautausmaa + C-osio), joka on jo rakennettu ja
  on projektin ainoa aidosti harvinainen osa. Yleistäminen ansaitaan toisella
  konkreettisella tutkimusongelmalla, ei etukäteisarkkitehtuurilla.
- **Ei kestä:** (1) luonnos esitti FORBID4:n rajoitteena — se on kumottu
  hypoteesi (`NEGATIVE_RESULTS.md` §5, rivit 40–42); (2) "understand the
  search space" on C-osion muotoilu; (3) kahdeksankerroksinen arkkitehtuuri on
  ennenaikainen abstraktio (sama peruste kuin `ConstraintEvaluator`-kiellolla);
  (4) empiria-ensin-hierarkia on väärinpäin — tulokset ovat syntyneet
  järjestyksessä kirjallisuus → eksakti koneisto → verifiointi.
- Sääntö 7 koskee myös visiodokumentteja. Skills-infra: `SKILLS_PLAN.md`
  (parkissa, ei hyväksytty).

**Ideat kirjattu 2026-07-30 (RESEARCH_ARCHITECT-ajo):** tutkimusehdotukset
`OPEN_RESEARCH_QUESTIONS.md` **B7** (säiliön välttämättömät tekijät), **B8**
(taajuusmonikulmio), **E5** (puhdashuonereplikaatio), **E6** (additiiviset
neliöt, jäljittämätön). UI/UX-backlog: `UI_UX_PLAN.md` (kärki: "UI ei siteeraa
— se lukee lokia"). Lokaali laskentakone: `SANALAB_PLAN.md` (vaihe 0 vaatii
E6:n jäljityksen ennen koodia).

**Lokaalin/ladattavan ohjelman suunnittelusääntö** (kun siihen palataan):
työyksikön tuloksen pitää olla väitelokikelpoinen — eksakti, tyhjentävä
rajatussa ikkunassa, hakujärjestyksestä riippumaton. Jos tulos ei voi olla
lokirivi, se on viihdettä. Läpäisevät tehtävätyypit: hajautettu eksakti
p(n)-sensus (jokainen arvo on Feketen kautta lauseen muotoinen yläraja, osio
F), lakaisutyöyksiköt (B5), epäsuotuisien tekijöiden sensukset (A4).
Ennätyssanajahti ei läpäise. Tekniset lisät nykyiseen CLI:hin:
työyksikkömanifesti (parametrit + commit-hash + osite), pistokoeverifiointi,
kalibroitu kieli valmiina tulosteessa.

---

## Tehty 2026-07-29: epäsuotuisat tekijät, ensimmäinen vaihe

`unfavourable-factors.js` on olemassa ja validoitu. Tulokset `MATH_CLAIMS.md`
rivillä 47. **Keräsen kysymys on yhä auki** — meillä on 336 kandidaattia
pituudella 9, mutta oikean jatkeen rajattomuus on evidenssiä eikä todiste.

**Seuraava askel tässä:** todista yhden kandidaatin oikea jatke äärettömäksi.
Ainoa tuntemani reitti on löytää morfismi jonka kiintopisteen etuliite kandidaatti
on. Huom. `g₈₅^ω(a)` ei kelpaa: se on tasaisesti rekurrentti, joten jokainen sen
tekijä saa mielivaltaisen pitkän vasemman kontekstin — epäsuotuisa tekijä ei voi
esiintyä siinä lainkaan (rivi 47).

---

## Alkuperäinen suositus (vaihe 1 tehty): Keräsen epäsuotuisat tekijät

`OPEN_RESEARCH_QUESTIONS.md` **A4**, `MATH_CLAIMS.md` rivi **38**.

Se on listan **ainoa lähteistetty avoin ongelma jonka työkalu on jo valmis**.

### Kysymys, sanatarkasti lähteestä

> *"…an unfavourable a-2-free word cannot be continued infinitely long to the
> left and to the right without necessarily creating an abelian square at some
> point. **However, it might well be possible to extend such a word boundlessly
> to one direction, say to the right, without producing any abelian squares.
> Experiments support this conjecture but the existence of such unfavourable
> factors remains an open question.**"*
> — V. Keränen, *Suppression of Unfavourable Factors in Pattern Avoidance*,
> International Mathematica Symposium, Avignon 2006

Eli: **onko olemassa sana joka on rajattomasti jatkettavissa oikealle, mutta joka
ei esiinny minkään äärettömän a-2-vapaan sanan aitona tekijänä?**

### Miksi `rauzy-graph.js` on oikea työkalu

Rauzy-graafissa, kertaluvulla n:

- **rajattomasti oikealle jatkettava** ⟺ solmusta pääsee johonkin sykliin
- **rajattomasti molempiin suuntiin** ⟺ solmu on kaksisuuntaisesti äärettömällä
  polulla, eli kuuluu ei-triviaaliin vahvasti yhtenäiseen komponenttiin tai
  sellaisen tavoittamaan osaan molemmilta puolilta
- **epäsuotuisa** ⟺ edellinen ei päde

Erotus näiden kahden joukon välillä on täsmälleen se mitä Keränen kysyy, ja se on
äärellisesti laskettavissa kullekin n:lle.

### Konkreettinen aloitus

1. `rauzy-graph.js` sisältää jo `stronglyConnected` ja `extendabilityCensus`.
   Tarvitaan lisäksi: **saavuttaako solmu syklin eteenpäin** (ja taaksepäin) —
   se on tavallinen SCC-laskenta + saavutettavuus, ei uutta matematiikkaa.
2. Aja **ternäärille aa2f-kielelle ensin**, koska se on pieni ja koneisto on jo
   viritetty siihen. Se ei ole Keräsen kysymys mutta se validoi toteutuksen.
3. Vasta sitten **nelikirjaimiseen a-2-vapaaseen kieleen**, joka on Keräsen
   asetelma.

### Varaukset, jotka pitää tietää etukäteen

- **Aakkosto eroaa.** Keränen käsittelee neljää kirjainta ja **täyttä**
  a-2-vapautta; rivin 35 mittaus on kolme kirjainta ja aa2f. Ne eivät ole sama
  kysymys, ja `MATH_CLAIMS.md` rivi 38 sanoo sen
- **Rivin 35 luvut eivät ole epäsuotuisien tekijöiden lukumääriä.** Ne laskevat
  tekijöitä joilla ei ole **yhden askeleen** jatkoa. Keräsen käsite koskee
  ääretöntä jatkettavuutta ja on aidosti vahvempi
- **Tavoitettavuus on epävarma.** Nelikirjaiminen a-2-vapaa kieli kasvaa
  eksponentiaalisesti, joten Rauzy-graafit räjähtävät. Käytännössä vastaus
  löytyy vain pienillä n, ja Keräsen omat kokeet olivat myös laskennallisia.
  **Älä lupaa ratkaisua ennen kuin tiedät mihin n:ään haku yltää**

---

## Muut avoimet työt

| # | Työ | Peruste |
|---|---|---|
| 1 | Epäsuotuisat tekijät (yllä) | lähteistetty avoin ongelma, työkalu valmis |
| 2 | **Replikoi 103 templaattia** (rivi 48). Aberkane–Currie–Rampersad 2004 laskee abelin kuutioille (k=3, ternääri) esivanhempisulkeumaksi tasan 103. Se on pieni, tarkka ja **vertailukelpoinen** — paras itsenäinen validointi `get-parents.js`:lle. Vaatii k=3-templaattien tuen (nyt vain k=2) | tunti työtä, ja se joko vahvistaa koneiston tai paljastaa virheen |
| 3 | FORBID4:n minimaalisuus | äärellinen: 64 osajoukkoa × kasvunopeuden yläraja. Yksikäsitteinen vastaus. `OPEN_RESEARCH_QUESTIONS.md` B1 |
| 4 | Selviytymisjakauman vaimenemisvakio | data on jo kerätty (`morphism-scan.js`), analyysi puuttuu. Rakenteellinen jos k:sta riippumaton. **Sovita jakauman runkoon, ei ääriäntään** — maksimin saavuttaa 2, 4, 8 morfismia |
| 5 | ℚ[x]/(m(x)) ja Theorem 8 | epäuniformi morfismi (`h₄`, pituudet 3,3,2,3), Perron-juuri irrationaalinen. Yleistää `jordan-decomposition.js`:n ℚ(√3)-koodin. **Älä koodaa faktorointia** — asteilla ≤ 6 riittää rationaalijuuritesti |
| 6 | k-abelinen moduuli | lähin **ratkaistu** naapuri (Fici & Puzynina Thm 65). Ainoa tapa mitata mitä ekvivalenssin vahvistaminen ostaa |
| 7 | Ennätyssanarekisteri UI:hin | `word-anatomy.js` on jo rekisteri; se puuttuu sovelluksesta |
| 8 | SAT / CEGIS sääntöavaruuteen | kohde on **morfismiavaruus**, ei sanaavaruus. Verifioija pätee **puhtaille morfisille sanoille**, joten silmukka rakennetaan kiintopisteille, ei projektioille |

---

## Mitä ei kannata tehdä

- **Älä kutsu rivin 49 [2,5]-selviytyjiä "kandidaateiksi".** Jokainen niistä
  rikkoo K ∈ [6,100] viimeistään symbolissa 44. Kandidaatti on vasta luokka
  joka selviää molemmista ikkunoista JA jonka parille Prop 9:n esiehdot pätevät
- **HPC-skaalaus morfismiskanneriin.** Maksimiprefiksi on ln N, R² = 0,99875
  (rivi 37). k = 7, 8, 9 antaa 40, 45, 50 riippumatta matematiikasta
- **Ennätyssanojen käänteismallinnus.** Ne eivät ole morfisia: p(15) = 14 502
  vs. substitutiivisen 144 (rivi 42). Rakennetta ei ole
- **"Rosetta-filtteri"** 25 379-sanan tekijöistä. Se hylkäisi 88 % laillisista
  jatkoista yhden sanan valintojen perusteella — todennäköisemmin katto kuin
  jatke
- **Pidempien aa2f-sanojen jahtaaminen.** Keräsellä on 25 379; mikä tahansa
  äärellinen sana on äärellinen havainto
- **`ConstraintEvaluator`-refaktorointi** ennen kohtaa 7. Abstraktio on arvaus
  ennen kuin SAT-koodaus kertoo mitä rajapinnan pitää kantaa
- **Hakutelemetria kielen ominaisuutena.** `OPEN_RESEARCH_QUESTIONS.md` osio C

---

## Tehty 2026-07-30 (ilta): additiivinen aakkostolakaisu, ensimmäinen vaihe

`additive-sweep.js` on olemassa ja validoitu kolmikerroksisella verifioinnilla
(`SANALAB_PLAN.md` 6b.2). Tulokset rivillä **54**: 31 affiiniluokasta 11
ratkaistiin, ja tasapainoiset aakkostot erottuivat puhtaasti. Jatkokysymykset
`OPEN_RESEARCH_QUESTIONS.md` **B9**.

**Seuraava askel, prioriteettijärjestyksessä:**

1. **Jäljitä Freedman-lähde** (rivi 53:n jäljittämätön attribuutio: a+d=b+c,
   raja ≤ 60). Se osuu suoraan rivin 54 tasapainoisiin luokkiin ja arvoon 60.
   Jos lähde löytyy, osa rivistä 54 on **replikaatio** eikä uusi tulos, ja rivi
   on päivitettävä. Tämä on halvin ja tärkein: se ratkaisee mitä taulukosta
   ylipäätään saa sanoa uutena.
2. **B9.1 laajempi span** — sama moduuli, isompi `--span`. Kumoaako jokin
   tasapainoinen luokka dikotomian?
3. **5 kirjainta.** Kustannus mitattava ensin: `--letters 5 --span 6` pienellä
   budjetilla, ja katsottava paljonko luokkia ja solmuja syntyy.

**Älä** kutsu ratkaisemattomia luokkia "välttäjiksi". Ratkaisematta tarkoittaa
ratkaisematta; budjetti loppui.

**Ennätyskehys** kirjattu `SANALAB_PLAN.md` 5d:hen (2026-07-30): ennätysjahti
on legitiimi kun todistuskappale verifioidaan, työmäärä ilmoitetaan, kohde
kytkeytyy rekisteröityyn avoimeen kysymykseen ja ennätyksiä käytetään
falsifiointiin. Additiivinen rintama on tähän täsmälleen oikea kohde:
ratkaisemattomien luokkien verifioidut alarajat (83–200, rivi 54) ovat
alarajadataa avoimeen ongelmaan — toisin kuin aa2f-ennätykset. Eksakti
laskenta nopeuttaa jahtia kolmella mekanismilla: triaasi (verdiktitaulukko
kertoo missä jahti kannattaa), terveiksi todistetut karsintaoraakkelit
(jatkettavuussyvyystaulut), ja järjestysheuristiikat (heuristiikoiksi
merkittyinä).

## Tehty 2026-07-30 (myöhäisilta): jatkettavuustaulut, sanalabin ensimmäinen jäännös

`extension-table.js`, tulokset rivillä **55**. Taulu on kolme asiaa yhdessä:
eksakti invariantti, terve karsintaoraakkeli (84–89× vähemmän hakusolmuja,
verdikti muuttumatta) ja **affiiniluokalle nollakustannuksella siirtyvä
artefakti**. Terveys todistettu tekijäargumentilla ja testattu 400
etuliitteellä. Rehellinen rajoitus samassa rivissä: taulun rakentaminen maksaa
yhden haun verran, joten **arvo on yksinomaan uudelleenkäytössä** — ja
ennätysjahdissa kannattavuus on mitattava erikseen (ratkaisemattomalla luokalla
{0,1,2,5} taulu vaati 1,2 mrd solmua).

**Neljä umpikujaa kirjattu samalta istunnolta** (`NEGATIVE_RESULTS.md` §7–10):
säiliö ei kelpaa additiiviseen eliminaatioon, taulu ei auta ennätysjahdissa,
yhden ajon nettovoitto taulusta on nolla, ja määritelmätason verifioija ei
yllä verifioimaan omaa kohdettaan. Kaikki neljä ovat mitattuja.

**Ajoprotokolla on tehty:** `sanalab-run.js`, rivi **56**. Eksakti jatkaminen
(k ajoa budjetilla B = yksi ajo budjetilla k·B, solmumäärää myöten),
NDJSON-tapahtumavirta, kolme lopputilaa ja sertifikaatti. Demonstroitu
ratkaisemattomalla luokalla {0,1,2,8}: kolme peräkkäistä 2·10⁷ solmun ajoa
nostivat verifioidun alarajan 156 → 160 → 171. Tämä on §8:n jälkeen se
mekanismi joka ennätyksiä oikeasti auttaa: se kasvattaa efektiivistä
budjettia sessioiden ja koneiden yli sen sijaan että yrittäisi karsia hakua.

**Taulukirjasto on tehty:** `table-library.js`, rivi **57**. Yksi taulu per
affiiniluokka, tarkiste ja provenienssi, tietue hylätään jos se on muuttunut.
**Ja mitattu rajaus, joka on tärkeämpi kuin kirjasto itse:** demonstraatio
antoi vain **1,03×** — säästö on täsmälleen toistuvien luokkien
rakennuskustannus. Kirjasto ei kumoa §9:ää; se muuntaa rivin 55 kiihdytyksen
*yhtä hakua* koskevasta väitteestä *työkuormaa* koskevaksi, ja vain
työkuormille jotka palaavat samaan luokkaan. Ensimmäinen lakaisu 31 eri
luokan yli ei hyödy siitä lainkaan.

**Seuraava askel — Freedman on jäljitetty, kärki siirtyi.** Freedman ei
löytynyt (rivi 58, `NEGATIVE_RESULTS.md` §11), mutta jäljitys nosti esiin
oikean kysymyksen. Kolme mahdollisuutta, ensimmäinen on suositus:

1. **Avaa Lietard & Rosenfeld, DLT 2020** (`OPEN_RESEARCH_QUESTIONS.md` A7
   kohta 1). Se on koko paperi neljän luvun aakkostojen additiivisista
   kuutioista, ja affiiniluokittelu on siellä alan omana kehyksenä
   (Theorem 86, rivi 58). **Se ratkaisee onko rivin 54 neliölakaisu uutta vai
   jo tehtyä.** Ennen sitä rivin 54 menetelmällistä uutuutta ei saa väittää.
   Jos konferenssipaperi ei riitä, jatko on Lietardin väitöskirja — **ranskaksi**,
   ja kieli ei ole peruste jättää avaamatta (A7).
2. **B9.1 laajempi span / 5 kirjainta.** Sama moduuli, isompi `--span`;
   kustannus mitattava ensin.
3. **Lopeta infran rakentaminen.** Sanalabilla on nyt lakaisu, oraakkeli,
   kirjasto ja jatkettavat ajot. Kolme viimeisintä riviä (55–57) ovat kaikki
   *työkaluja*, eivät matematiikkaa, ja kaksi niistä sisältää mitatun
   rajauksen omalle hyödylleen. Se on merkki siitä että infran rajahyöty on
   laskeva ja seuraava askel kuuluu matematiikan puolelle.

## Tehty 2026-07-30 (yö): B7 laskettu ja suljettu, väiteloki koneluettavaksi

**B7 (rivi 62):** säiliökieli ei pakota mitään rakennetta yhtä kirjainta
pidemmälle. Yksikään pituuden 2…9 tekijä ei ole välttämätön K ∈ [2,5]:ssä eikä
pituuden 2…11 tekijä K ∈ [2,6]:ssa. **Kolmas riippumaton mittaus siitä että
säiliö on löysä** (rivit 51, 52, 62) — säiliöstä ei kannata etsiä enää lisää
välttämättömiä ehtoja.

**Väiteloki koneluettavaksi (rivi 61):** `claims-export.js`. Vain lokista
jäljitettävät luvut ovat julkaistavissa. Löysi heti viisi riviä joiden
sarakkeet olivat rikki escapoimattomista pystyviivoista.

**Juliste:** `poster.html`, generoitu `claims.json`:sta toisella mallilla.
Jokainen luku kantaa rivinumeronsa. Tarkistettu itsenäisesti: ei skriptejä, ei
ulkoisia viitteitä, ei emojia, eikä yhtään lukua jota ei voi jäljittää riviin
(paitsi alatunnisteen päiväys). Se paljasti yhden aidon aukon — lainattava arvo
oli suomeksi, mikä pakotti käännöksen ja katkaisi kirjaimellisen
jäljitettävyyden. Korjattu lisäämällä `display`-kenttä: `value` todistaa
provenienssin, `display` on se mitä sivu näyttää.

**Seuraava askel:** A7 kohta 1 on yhä avaamatta (Lietard & Rosenfeld DLT 2020),
ja se ratkaisee rivin 54 uutuuden. Toinen vaihtoehto: `index.html`:n
kytkeminen `claims.json`:iin, jolloin sovelluksen luvut lakkaavat olemasta
käsin kirjoitettuja (`docs/plans/UI_UX_PLAN.md` kohta 1).

## Repositorion tila 2026-07-30

Testit **33/33**, driftitarkistukset **13/13**. Rivit 49–53,
tutkimusarkkitehti-protokolla ja suunnitteludokumentit on committoitu.
**Työpuussa odottaa hyväksyntää** (sääntö 5): rivit 54–55,
`additive-sweep.js`, `extension-table.js`, testit 32–33, driftivahdin
laajennus ja näihin liittyvät dokumenttipäivitykset.
Moduulilista ja ajokomennot: `RESEARCH_CONTEXT.md` osio 3.

### Avoimet päätökset, jotka kuuluvat ylläpitäjälle

1. **Git-historia.** Viisi ennätyssanatiedostoa ja `papers/Keranen.pdf`
   committoitiin vahingossa ja poistettiin seurannasta, mutta ne ovat yhä
   historiassa ja pushattu. Poistaminen vaatii force-pushin julkaistun historian
   yli
2. **`papers/`-kansion (ent. `latest/`) yhdeksän tekijänoikeudellista paperia** ovat julkisessa
   GitHub-repositoriossa, committoituna ennen tätä istuntoa
3. **SIAM-viite** 32(4):2381–2397 (2018) on `REJECTED` (rivi 23) — arXiv näyttää
   `Journal ref: (none)`. Kukaan ei ole avannut julkaisijan sivua

### Muistutus

**Yksitoista kertaa** tässä työssä uskottava yleistys osoittautui vääräksi vasta
ajossa: M_g:n surjektiivisuus, M_h:n diagonalisoituvuus, p(n):n vakioslope,
ytimen ulottuvuus, testidatan "abelin neliö", HTML-entiteettien kaksoisescapetus,
TeX-jäännökset, Cassaignen hypoteesin puuttuminen, skannerin liian heikko ehto,
Parikh-epätasapainon erottelukyky, ja `ancestor-box.js`:n perustelematon
`x0IsZero`-haara.

Yksikään ei olisi kaatunut silmämääräisessä tarkistuksessa. **Aja kaikki, vertaa
HEAD:iin, äläkä luota kommenttiin.**
