# Seuraava askel

**Päivitetty:** 2026-07-30 (session luovutus)
**Lue ensin:** `KNOWLEDGE_STATE.md`, `RESEARCH_CONTEXT.md`, `AGENTS.md`.

---

# LUOVUTUS SEURAAVALLE SESSIOLLE

**Repositorion tila:** testit **37/37**, driftitarkistukset **15/15**, kaikki
committoitu ja pushattu. Väiteloki **69 riviä**. Työpuu puhdas.

## Kriittisin yksittäinen asia — suurin osa ratkesi 2026-07-30 (rivi 66)

**Luku on 61, ei 50, ja se on attribuoitu Freedmanille — vahvistettu suoraan
avatusta täystekstistä, ei toisen mallin tiivistelmästä.**

- arXiv:1304.1829 (Brown, Jungić & Poelstra) avattu ar5iv-renderöinnistä ja
  haettu sanatarkasti. Sitaatti: *"Freedman [Freedman 2013+] has shown that
  if a<b<c<d satisfy the Sidon equation a+d=b+c, then every word on
  {a,b,c,d} of length 61 contains an additive square."*
- [Freedman 2013+] on **eri paperi** kuin Brown & Freedman 1987 — se on
  Freedmanin *"Sequences on sets of four numbers"*, silloin ("to appear in
  INTEGERS") vielä julkaisematon. Brown & Freedman 1987:n sisältö vahvistui
  samaksi kuin ennen: avoin **Conjecture 1**, ei pituusraja.
- **Projektin data (rivi 54: pisin tasapainoinen neliötön sana 60) on
  täydellisesti yhteensopiva 61-rajan kanssa.** Väitöskirjan "≥ 50" näyttää
  virheelliseltä luvulta — todennäköisesti hyvässä uskossa tehty sekaannus,
  koska sama Freedmanin paperi mainitsee myös 51-termisiä jonoja *eri*
  kontekstissa (double-3-AP-vapaus, ei additiivinen neliö).
- **Yksi asia jäi silti auki:** onko Freedmanin INTEGERS-paperi hänen
  yksinään vai yhdessä Brownin kanssa. arXiv:1304.1829 siteeraa sitä
  muodossa "[Freedman 2013+]" (viittaa yksin), mutta Semantic Scholar
  listaa saman paperin otsikkoslugissa "Freedman-Brown". **Sivua eikä sen
  API:a ei saatu auki (HTTP 429, kaksi yritystä).** Tämä ei vaikuta
  pituuslukuun (61 on nyt vahva), vain tekijyyteen.
- **Saa nyt sanoa:** "61, attribuoitu Freedmanille (2013+), lähteenä
  arXiv:1304.1829." **Ei saa vielä sanoa:** mitään Freedmanin oman paperin
  sisällöstä tai lopullista tekijyyttä.
- **Avattavana jos joku haluaa viedä loppuun:** Freedmanin *"Sequences on
  sets of four numbers"* (INTEGERS) itse — todennäköisesti löytyy INTEGERS-
  lehden verkkosivun taulukosta hakemalla "Freedman"; Semantic Scholarin
  API kannattaa yrittää uudelleen kun 429 on väistynyt.

## Mitä tässä sessiossa tehtiin

Väitelokin rivit **58–65** ja hautausmaan kohdat **11–13**. Uudet moduulit:
`additive-sweep.js`, `extension-table.js`, `sanalab-run.js`,
`table-library.js`, `unavoidable-factors.js`, `claims-export.js`.
Uudet dokumentit: `KNOWLEDGE_STATE.md`, `LITERATURE_COVERAGE.md`,
`README.md`, `poster.html`, `docs/plans/LAB_VISION_2035.md`.

**Tärkeimmät tulokset:**

1. **Additiivinen aakkostolakaisu** (rivi 54): 31 affiiniluokasta 11
   ratkaistu tyhjentävästi. **Mutta rajaus tarkentui:** tasapainoiset luokat
   kattaa Brown & Freedman 1987, joten kymmenen niistä on replikaatio.
   **Vain {0,1,2,4} (epätasapainoinen, pisin 62) jää kirjallisuuden
   ulkopuolelle.** Uutuus asuu **epätasapainoisissa** luokissa, joita on
   ratkaisematta 20.
2. **Säiliö on löysä, mitattuna kolmesti** (rivit 51, 52, 62): taajuusväli
   liian leveä, ei kiristy ikkunaa kasvattamalla, eikä yksikään pituuden ≥ 2
   tekijä ole välttämätön. **Älä etsi säiliöstä lisää välttämättömiä ehtoja.**
3. **Jatkettavat ajot toimivat** (rivit 56, 64): {0,1,6,8}:n verifioitu
   alaraja **244**, koottu yhdeksästä ketjutetusta ajosta.
4. **Väiteloki on koneluettava** (rivi 61): vain `QUOTABLE_FACTS`-lohkossa
   olevat luvut ovat julkaistavissa.
5. **Rivin 23 DOI oli keksitty** — `10.1137/16M1087493` ei ole olemassa,
   oikea on `10.1137/17M1149377`.

## Kolme sääntöä jotka tässä sessiossa opittiin kantapään kautta

- **§11:** hakukonetiiviste on kohinaa kunnes se on paikannettu avattavaan
  dokumenttiin. Merkintä "jäljittämätön" ei estä väitettä **ohjaamasta
  työjärjestystä**, ja se on kallis vaikutus.
- **§12:** kirjallisuudesta lainattu menetelmä testataan **ensin siinä
  asetelmassa josta se on peräisin**. Up-and-Down näytti hyödyttömältä
  neliöillä; kuutioilla se antoi +1130 %.
- **§13:** korroboraatio kattaa vain **verratut kentät**. Neljä oikeaa kenttää
  viidestä tuntui vahvistukselta; tarkistamatta jäänyt DOI ei ollut olemassa.

## Seuraavat askeleet, suositusjärjestyksessä

1. **Epätasapainoisten luokkien ratkaiseminen** — 20 auki, ja siellä on aukko
   jonka `LITERATURE_COVERAGE.md` osoittaa. Työkalu on valmis
   (`sanalab-run.js`, jatkettavat ajot). **Uusi ykkönen**, koska Freedman-
   kysymys on nyt suurelta osin ratkaistu (rivi 66).
2. **Epäuniformit morfismit** — `LITERATURE_COVERAGE.md` rivi 6: ei tehty
   täällä eikä löytynyt kirjallisuudesta.
3. `index.html` → `claims.json` (`docs/plans/UI_UX_PLAN.md` kohta 1).
4. *(Matalan prioriteetin siisteystyö, ei tutkimusta):* Freedmanin oman
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
  (50 vs. 61). Ks. luovutusosan "Kriittisin yksittäinen asia".
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
