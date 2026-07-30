# Seuraava askel

**Päivitetty:** 2026-07-31 (päätösmenettely rakennettu ja ajettu ensi kertaa oikeaan dataan, rivit 72–75)
**Lue ensin:** `KNOWLEDGE_STATE.md`, `RESEARCH_CONTEXT.md`, `AGENTS.md`.

---

# LUOVUTUS SEURAAVALLE SESSIOLLE

**Repositorion tila:** testit **39/39**, driftitarkistukset **15/15**.
Väiteloki **78 riviä**. Työpuu puhdas. Ei kriittistä avointa lankaa.

## Tämän session tärkein tulos (rivit 74–75)

**Additiivisen ehdon päätösmenettely on nyt toteutettu, validoitu VIIDELLÄ
tunnetulla tapauksella, ja ajettu ensimmäistä kertaa oikeaan dataan (rivi 75).**
`additive-affine-decision.js` on rivi riviltä käännetty referenssitoteutuksesta
(`github.com/lgmol/Additive-Powers-Decision-Algorithm`), ei omaa johtoa.

**Tulos:** kaikki **221 296** affiinia, puhdasta, k=5-uniformia morfismia
kuudella rivien 67–69 aakkostolla ({0,1,2,5}, {0,1,6,8}, {0,3,4,8}, {0,2,4,7},
{0,1,2,6}, {0,2,5,8}) **DEKIISATTU** (ei etuliitekattoon perustuva näyttö —
oikea Theorem 2.4:n päätös), **0 selviytyjää**. k=5 on ensimmäinen kerta kun
projekti tavoittaa alueen jota raaka voima (`additive-morphism-scan.js`,
korkeintaan k=4) ei koskaan kattanut — tulos on siis aidosti uutta tietoa,
ei toistoa.

**Kaksi virhettä jotka syntyivät ja korjattiin saman istunnon aikana, kirjattu
koska ne ovat opettavaisia:**
1. Rivi 73:n alkuperäinen versio nimesi validointiesimerkeiksi "β" ja "δ=γ²"
   matriiseineen — nämä eivät esiinny lähteessä missään muodossa, ne tulivat
   toisen käden mukailusta jota ei tarkistettu itse ennen kirjaamista. Korjattu
   ennen kuin mitään ehdittiin rakentaa sen varaan.
2. Rivi 75:n ensimmäinen versio kirjoitti itseisarvomerkinnän `\|d\|`
   JavaScript-merkkijonoliteraalissa `'\|'`, joka pudottaa kenoviivan pois (ei
   tunnettu escape-sekvenssi) — tiedostoon päätyi paljas `|d|`, kaksi
   suojaamatonta pystyviivaa, mikä rikkoi `claims-export.js`:n rivijäsentimen
   (`node test.js` löysi tämän heti, 38/39). Korjattu kirjoittamalla korvaus
   erilliseen tekstitiedostoon JS-merkkijonon sijaan.

## k=6 käynnissä (2026-07-31), korjattu kustannusarvio

**Ensimmäinen arvio (2,8 ms/ehdokas, ekstrapoloitu k=5:stä) oli väärä.**
Mitattu suoraan k=6:lla ({0,1,2,5}, 500 kappaleen otos): **5,6 ms/ehdokas**
— noin kaksinkertainen. Koko avaruus yhdellä aakkostolla on **4 976 088**
kandidaattia, joten yhden aakkoston ajoaika on **~7,7 tuntia**, ei 3,6 h.
Kuudella aakkostolla sarjassa se olisi ~35–46 tuntia — ei realistista luvata
kerralla. **Yksi aakkosto ({0,1,2,5}) käynnistetty taustalle 2026-07-31,
tulos tähän kun valmis.** Loput viisi aakkostoa odottavat tämän tulosta ja
päätöstä kannattaako jatkaa sarjassa vai rinnakkaistaa.

k=7 (~214 miljoonaa kandidaattia) ei ole tässä mittakaavassa järkevä ilman
merkittävää optimointia (rinnakkaistus tai `mainPure`:n sisäisen
ancestor-laskennan profilointi).

## Aiemmin tehty (rivit 69–71)

1. **4→4-morfismimuoto on suljettu koko epätasapainoisella alueella (rivi 69).**
   Rivin 68 neljän aakkoston lisäksi ajettiin loput **16**, yhteensä
   **1 867 272 192 morfismia**, 192/192 profiilia kullakin, nolla ohitettua.
   Kaikki kielteisiä. **`NEGATIVE_RESULTS.md` §14:n tappoehto on nyt laukennut
   20/20 luokalla** — samaa hakua ei syvennetä ilman uutta rakenteellista ideaa.
2. **Viisi kirjainta on ~2 kertaluokkaa halvempi (rivi 70)**, ja kaksi rajausta
   osoittautui valinnoiksi: `additive-sweep.js` tukee jo useampaa kirjainta
   (parametria ei ole koskaan käännetty), ja span ≤ 8 jättää neljälläkin
   kirjaimella puolet luokista lakaisematta (31/62).
3. **B11:n esimittaus (rivi 71): abelin kantava ominaisuus on additiivinen
   este.** Identtiset Parikh-vektorit kuvien yli kantavat Keräsen g₈₅:n mutta
   tappavat additiivisen morfismin välittömästi. Ei ollut aiemmin kirjattu.
4. **Entiteettikorjaus + vahdin leventäminen.** 51 kaksoisescapetettua ja 21
   keksittyä `&subN;`-pseudoentiteettiä näkyivät sivulla literaalina; vahti
   raportoi 15/15 koko ajan, koska `#` ei ole `[a-zA-Z]`:ssä.

## Seuraava askel: ÄLÄ rakenna B11:tä — se on olemassa julkaistuna (rivit 72–73)

Päätösmenettely löytyi kirjallisuudesta kesken session. **Theorem 2.4**
(Currie, Mol, Rampersad & Shallit, arXiv:2111.07857, lainattuna ja
varmennettuna Andrade & Molin arXiv:2408.15390:stä) ratkaisee additiivisen
k-potenssittomuuden **affiineille** morfismeille, ja toteutus on paperin oma:
`github.com/lgmol/Additive-Powers-Decision-Algorithm`.

**Mitä tästä seuraa, ja mitä ei:**

- **Kelpoisuus mitattu (rivi 73):** 0,006–0,021 % uniformista avaruudesta on
  affiini. Kapeus on hyöty: k=16:lla koko avaruus on 8,82·10¹¹ mutta affiini
  luokka 10–60 miljoonaa — **saman kokoluokan kuin rivin 69 lakaisu jo teki
  paljon pienemmällä k:lla.** Tämä on se skaalautuvuus jota B12 tarvitsi.
- **Mitään ei ole päätetty.** Rivi 73 on kelpoisuusseula, ei päätöstulos.
  Päätösalgoritmia **ei ole toteutettu tässä projektissa lainkaan**, eikä se
  ole `decide-realizability.js`:n uudelleenkäyttöä — lähde sanoo itse että
  γ ei täytä Rao & Rosenfeldin ehtoja (ominaisarvo tasan 1).

**Aloituskohta, tässä järjestyksessä:**

1. **Toteuta CMRS-algoritmi ja validoi se repon viidellä omalla tapaustutkimuksella**
   (Dekking 1979, Currie & Aberkane 2009, Andrade & Mol Prop. 3.1/4.1, CMRS 2021 —
   morfismit rivillä 73). **Ei β/δ — se oli 2026-07-30 kirjattu virheellinen
   viittaus toisesta kädestä, korjattu ennen kuin ehdittiin ajaa mitään sen
   varaan.** Pysäytysehto: jos ei toista näitä viittä, pysähdy.
   Halpa ja nopea; säästää turhan k=16-ajon väärällä koodilla.
2. Vasta sitten aja affiini luokka kasvavalla k:lla.
3. B12 (viisi kirjainta, span ≤ 10) sen jälkeen tai rinnalla.

**Kaksi rajausta jotka on pidettävä näkyvissä:**

- **Tyhjentävä kielteinen tulos affiinille luokalle on tarkka tulos siitä
  luokasta, ei koko avaruudesta.** Sama kalibrointi kuin riveillä 67–69.
- **Additiivinen linja on rinnakkainen tutkimuslinja, ei silta Mäkelään.**
  Additiivinen välttäminen on tiukempi kuin abelin, mutta implikaatio osuu jo
  ratkaistuun maastoon (Keränen 1992, rivi 3). Mäkelä on eri ehto.

## Lähdehygienia: yksi konkreettinen varoitus

Tässä sessiossa tarjottiin kirjattavaksi sitaatteja Brown & Freedman 1987:stä
**lähdelinkeillä jotka osoittivat finlex.fi:hin** — Suomen korkeimman oikeuden
ennakkopäätökseen. Väitteet olivat sisällöltään oikein (ne täsmäävät riviin 66,
joka oli varmennettu jo aiemmin), **mutta eivät sen lähteen nojalla.**
`NEGATIVE_RESULTS.md` §11 kirjasi tämän vikatilan jo kerran. Se toistui.
Tarkista lähde, älä vain väitettä.

## Mitä tässä sessiossa tehtiin (kokonaisuudessaan, useampi luovutuskierros)

Väitelokin rivit **58–68**, hautausmaan kohdat **11–14** (nyt 14/14 näkyy
myös `index.html`:n "The Graveyard" -välilehdellä, Trap 1–14). Uudet
moduulit: `additive-sweep.js`, `extension-table.js`, `sanalab-run.js`,
`table-library.js`, `unavoidable-factors.js`, `claims-export.js`,
`additive-morphism-scan.js`, `additive-nonuniform-morphism-scan.js`.
Uudet dokumentit: `KNOWLEDGE_STATE.md`, `LITERATURE_COVERAGE.md`,
`README.md`, `poster.html`, `docs/plans/LAB_VISION_2035.md`.

**Tärkeimmät tulokset:**

1. **Additiivinen aakkostolakaisu** (rivi 54): 31 affiiniluokasta 11
   ratkaistu tyhjentävästi. **Rajaus tarkentui riveillä 65–66:** tasapainoiset
   luokat kattaa Brown & Freedman 1987 / Freedman 2013+ (raja **61**,
   vahvistettu suoraan arXiv:1304.1829:n täystekstistä — ei toisen mallin
   tiivistelmästä). Kymmenen tasapainoista tulosta ovat siis replikaatio.
   **Vain {0,1,2,4} (epätasapainoinen, pisin 62) jää kirjallisuuden
   ulkopuolelle.** Uutuus asuu **epätasapainoisissa** luokissa (20 auki).
2. **Uniformi ja epäuniformi morfismihaku additiivisille neliöille**
   (rivit 67–68): molemmat tyhjentäviä ja **negatiivisia** useilla
   epätasapainoisilla aakkostoilla — myös Cassaignen kuutiokonstruktion
   pituusprofiili (2,2,1,2) mukaan lukien. Ei vielä ratkaisua Question
   3:een ("onko mitään äärellistä ℤ-aakkostoa jolla additiiviset neliöt
   ovat vältettävissä", avoin ainakin 1987), mutta hakuavaruus on nyt
   kartoitettu pituuteen 4 asti neljällä aakkostolla.
3. **Säiliö on löysä, mitattuna kolmesti** (rivit 51, 52, 62): taajuusväli
   liian leveä, ei kiristy ikkunaa kasvattamalla, eikä yksikään pituuden ≥ 2
   tekijä ole välttämätön. **Älä etsi säiliöstä lisää välttämättömiä ehtoja.**
4. **Jatkettavat ajot toimivat** (rivit 56, 64): {0,1,6,8}:n verifioitu
   alaraja **244**, koottu yhdeksästä ketjutetusta ajosta.
5. **Väiteloki on koneluettava** (rivi 61): vain `QUOTABLE_FACTS`-lohkossa
   olevat luvut ovat julkaistavissa (`claims-export.js` → `claims.json`).
6. **Rivin 23 DOI oli keksitty** — `10.1137/16M1087493` ei ole olemassa,
   oikea on `10.1137/17M1149377`.

## Neljä sääntöä jotka tässä sessiossa opittiin kantapään kautta

- **§11:** hakukonetiiviste on kohinaa kunnes se on paikannettu avattavaan
  dokumenttiin. Merkintä "jäljittämätön" ei estä väitettä **ohjaamasta
  työjärjestystä**, ja se on kallis vaikutus.
- **§12:** kirjallisuudesta lainattu menetelmä testataan **ensin siinä
  asetelmassa josta se on peräisin**. Up-and-Down näytti hyödyttömältä
  neliöillä; kuutioilla se antoi +1130 %.
- **§13:** korroboraatio kattaa vain **verratut kentät**. Neljä oikeaa kenttää
  viidestä tuntui vahvistukselta; tarkistamatta jäänyt DOI ei ollut olemassa.
- **§14:** budjettikäyrän muoto (tasaantuva vs. kiihtyvä) on liian kohinainen
  ennustamaan mikä hakulinja kannattaa syventää — ei käytetty priorisointiin.

## Avoin sivujuonne, ei kriittinen

**Freedmanin INTEGERS-paperin tekijyys** (rivi 66): 61-raja on vahva ja
attribuoitu Freedmanille (2013+), mutta onko paperi hänen yksinään vai
yhdessä Brownin kanssa on avoinna (Semantic Scholar antoi ristiriitaisen
vihjeen, HTTP 429 esti tarkistuksen kahdesti). Ei vaikuta mihinkään
matemaattiseen päätelmään — vain lähdemerkinnän viimeistelyä.

## Seuraavat askeleet, priorisoituna (ei jonoa, valitse yksi)

1. **Epäuniformi morfismihaku laajemmalla kattavuudella** — maxlen > 4
   (kustannus kasvaa nopeasti, **mittaa ensin**) tai loput 16
   epätasapainoista luokkaa joita ei ole vielä testattu. **Tappoehto on
   asetettu (§14): ei signaalia ilman uutta rakenteellista ideaa — älä
   jatka pelkällä syvemmällä samalla haulla.**
2. **Epätasapainoisten luokkien alarajojen syventäminen** —
   diagnostiikka-ajo (2026-07-30, scratchpad) näytti että kaikki 20
   avointa luokkaa kasvavat yhä 10⁸ solmun kohdalla eivätkä tasaannu,
   toisin kuin 10 tasapainoista jotka kaikki tyhjenivät alle 10 M solmulla.
   **Tämä ei todista mitään** (sama ansa kuin `NEGATIVE_RESULTS.md` §1–2) —
   se vain kertoo että sokea DFS ei ratkaise näitä, ja kohta 1 on siksi
   parempi käyttö laskennalle kuin lisää raakaa hakua.
3. **Epäuniformit morfismit yleisemmin** — `LITERATURE_COVERAGE.md` rivi 6:
   ei tehty täällä eikä löytynyt kirjallisuudesta (koskee myös aa2f:ää).
4. `index.html` → `claims.json` (`docs/plans/UI_UX_PLAN.md` kohta 1).
5. *(Matalan prioriteetin siisteystyö, ei tutkimusta):* Freedmanin oman
   INTEGERS-paperin avaaminen tekijyyden viimeistelyä varten — ei muuta
   mitään matemaattista päätelmää, vain lähdemerkintää.

## Mitä EI kannata tehdä

- Säiliöanalyysin laajentaminen (kolmesti mitattu löysäksi)
- Up-and-Down aa2f-hakuun (§12)
- Karsintataulut ennätysjahtiin (§8)
- Lisää infrastruktuuria ennen kuin kohdat 1–3 on tehty. Rivit 55–57 ovat
  työkaluja joista kaksi kantaa mitatun rajauksen omalle hyödylleen; se on
  merkki laskevasta rajahyödystä

---

## Historia (tiivistetty — yksityiskohdat väitelokissa ja hautausmaalla)

Alla oleva on **korvattu** yllä olevalla luovutusosalla siltä osin kuin ne
ovat ristiriidassa (esim. Lietardin väitöskirja avattiin myöhemmin samassa
sessiossa, ja rivi 23 korjattiin `PRIMARY`-tasolle). Säilytetty vain
aikajärjestyksen ja perustelujen vuoksi.

- **Reitti (c), säiliöanalyysi K∈[2,5]/[2,6], tutkimusarkkitehti-protokolla**
  (rivit 49–53): tehty ja committoitu.
- **DLT 2020 -paperi avattu** ja varmennettu (rivi 63): koskee kuutioita,
  toteaa neliökysymyksen avoimeksi, ei sisällä neliöiden aakkostoluokittelua.
- **Lietardin väitöskirja avattiin myöhemmin** (rivi 65) — löysi Brown &
  Freedman 1987:n primäärilähteeksi ja kaksi ristiriitaista väitemuotoa
  (50 vs. 61). Ratkaistu rivillä 66: 61 on oikea, vahvistettu primäärilähteestä.
- **Rivin 23 DOI oli keksitty**, `10.1137/16M1087493` → 404 Crossrefissa;
  korjattu `10.1137/17M1149377`:ksi ja tila nostettu `PRIMARY`:ksi
  (aiemmin virheellisesti `REJECTED`). Kirjattu hautausmaalle §13.
- **{0,1,6,8}: alaraja 244** (rivi 64), yhdeksän ketjutettua ajoa.

### Avoimet päätökset, jotka kuuluvat ylläpitäjälle (yhä relevantit)

1. **Git-historia.** Viisi ennätyssanatiedostoa ja `papers/Keranen.pdf`
   committoitiin vahingossa ja poistettiin seurannasta, mutta ne ovat yhä
   historiassa ja pushattu. Poistaminen vaatii force-pushin julkaistun historian
   yli
2. **`papers/`-kansion yhdeksän tekijänoikeudellista paperia** ovat julkisessa
   GitHub-repositoriossa, committoituna ennen tätä istuntoa

### Muistutus

**Yksitoista kertaa** tässä työssä uskottava yleistys osoittautui vääräksi vasta
ajossa: M_g:n surjektiivisuus, M_h:n diagonalisoituvuus, p(n):n vakioslope,
ytimen ulottuvuus, testidatan "abelin neliö", HTML-entiteettien kaksoisescapetus,
TeX-jäännökset, Cassaignen hypoteesin puuttuminen, skannerin liian heikko ehto,
Parikh-epätasapainon erottelukyky, ja `ancestor-box.js`:n perustelematon
`x0IsZero`-haara.

Yksikään ei olisi kaatunut silmämääräisessä tarkistuksessa. **Aja kaikki, vertaa
HEAD:iin, äläkä luota kommenttiin.**
