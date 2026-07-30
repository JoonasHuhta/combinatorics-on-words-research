# Seuraava askel

**Päivitetty:** 2026-07-30 (myöhäisyö, session luovutus)
**Lue ensin:** `KNOWLEDGE_STATE.md`, `RESEARCH_CONTEXT.md`, `AGENTS.md`.

---

# LUOVUTUS SEURAAVALLE SESSIOLLE

**Repositorion tila:** testit **39/39**, driftitarkistukset **15/15**, kaikki
committoitu ja pushattu (HEAD `26e4e90`). Väiteloki **71 riviä**. Työpuu
puhdas. Ei kriittistä avointa lankaa — kaikki alla on priorisoitu valinta,
ei este.

**Taustalla käynnissä:** tausta-agentti `task_ad941573` korjaa
`index.html`:n välilehden 3 painikkeen kaksoisescapetusbugia
(`&#8328;&#8325;` näkyy kirjaimellisena), eri sessiossa. Älä duplikoi —
tarkista `git log` ennen kuin kosket samaan kohtaan.

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
