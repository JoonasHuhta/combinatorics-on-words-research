# SANALAB_PLAN.md — lokaali laskentakone sanojen kombinatoriikkaan

**Päivitetty:** 2026-07-30 (jäljitys tehty, suunnitelma syvennetty)
**Tila:** SUUNNITELMA — vaiheen 0 jäljitysosuus on tehty; spesifikaatio-osuus
ja toteutus odottavat hyväksyntää.
**Työnimi:** `sanalab`. Nimikandidaatti julkiselle, ladattavalle työkalulle:
**Abracalabra** (abc + labra — aakkosto {a,b,c} ja laboratorio samassa
sanassa; ylläpitäjän ehdotus 2026-07-30).
**Yksi lause:** anna rajoite — saat kielen invarianttiprofiilin
sertifikaatteineen.

Tämä dokumentti ei sisällä matemaattisia väitteitä (sääntö 7). Kaikki
alla mainitut tulokset ovat osoittimia `MATH_CLAIMS.md`:n riveihin.

**Jäljityksen tulos (2026-07-30, rivi 53 ja `OPEN_RESEARCH_QUESTIONS.md` A6):**
additiivisten neliöiden kysymys "onko ℤ uniformisti 2-repetitiivinen" on
lähteistetty avoin ongelma (Justin 1972; Pirillo & Varricchio 1994; kysymys
muodossaan Halbeisen & Hungerbühler 2000), additiiviset kuutiot on ratkaistu
aakkostolla {0,1,3,4} (CCSS, arXiv:1106.5204) — ja ratkaiseva yllätys:
**projektin oma ydinlähde arXiv:1511.05875 on juuri tämän ongelman
ℤ²-ratkaisu**, jonka abstrakti kutsuu Mäkelän konjektuuria "heikoksi
versiokseen". Toinen instanssi ei siis ole naapuriongelma vaan paluu sen
paperin emo-ongelmaan, josta projektin koko templaattikoneisto on peräisin.
Suora seuraus suunnitelmalle: vaiheen 0 tappoehto EI lauennut, additiivinen
instanssi on vahvistettu.

---

## 1. Mikä tämä on ja miksi

Projektin tähänastiset löydökset ovat syntyneet kolmella toistuvalla
kuviolla:

1. **Tyhjentävä lakaisu porrastetuilla suodattimilla** (rivi 49: reitti c)
2. **Äärellisen ikkunan relaksaation eksakti analyysi** (rivit 51–52: säiliö,
   taajuusrajat, stabiilius)
3. **Kaksi riippumatonta koodipolkua jokaiselle luvulle** (kaikki yllä)

`sanalab` teollistaa nämä kuviot: yksi lokaali, riippuvuudeton Node-ohjelma,
jonka **syöte on rajoitemäärittely** ja **tuloste on kielen
invarianttiprofiili** — jokainen kohta väitelokikelpoinen, ikkunat
eksplisiittisinä, sertifikaatti mukana. Selain (tai terminaali) vain
raportoi; kaikki laskenta on eksaktia ja lokaalia.

Ohjelman tarkoitus ei ole löytää pitkiä sanoja. Sen tarkoitus on tehdä
**uusien rakenteiden havaitseminen halvaksi**: kun profiilin voi ajaa
mille tahansa lähirajoitteelle minuuteissa, kysymys "mikä muuttuu kun
ehtoa vahvistetaan pykälän" muuttuu rutiinilaskuksi — ja juuri siitä
kysymyksestä rivi 52 (taajuusvälin stabiilius) syntyi.

## 2. Suunnitteluperiaatteet (peritty, ei neuvoteltavissa)

1. **Työyksikön tulos on lokirivi tai se on viihdettä** (`NEXT_STEP.md`).
2. **Ei liukulukuja tulospoluilla.** Rationaalinen verifiointi
   (Bellman–Ford-kuvio, rivi 51) kaikille optimointituloksille.
3. **Jokainen luku kahdella riippumattomalla koodipolulla** ennen
   raportointia.
4. **Abstraktio ansaitaan toisella instanssilla.** Rajoiterajapinta
   rakennetaan täsmälleen niin leveäksi kuin toinen konkreettinen
   rajoiteperhe pakottaa — ei leveämmäksi. (Vrt. `ConstraintEvaluator`-
   varoitus ja `RESEARCH_ARCHITECT.md` 3.4.)
5. **Mittaa ennen kuin lupaat**: jokainen profiilin kohta ilmoittaa
   kustannusarvionsa pienestä esiajosta, ei toiveesta.
6. **Kalibroitu kieli sisäänrakennettuna**: tulosteet muotoa "ei rikkomuksia
   ikkunassa [a,b]"; kieltosanavahti (driftitarkistin 6b) kattaa binäärin.

## 3. Rajoitemäärittely (syöte)

Deklaratiivinen JSON, esimerkki:

```json
{
  "alphabet": ["a", "b", "c"],
  "equivalence": "abelian",
  "forbid": { "halfLengths": "K>=2", "except": [1] },
  "weights": null
}
```

- `equivalence`: `equal` (tavallinen neliö) | `abelian` (Parikh) |
  `k-abelian` (k annettu) | `additive` (aakkosto ⊂ ℤ, `weights` käytössä)
- `forbid`: mitkä puolipituudet kielletään; rajattu ikkuna (esim. `[2,5]`)
  tuottaa säiliöanalyysin, rajaton tuottaa kieliprofiilin
- Ekvivalenssit ovat Parikh-vektorin funktioita: `equal` ⊃ `k-abelian` ⊃
  `abelian` ⊃ `additive` (heikkenevä erottelukyky) — yksi toteutuspinta,
  neljä instanssia. Ensimmäinen pari: `abelian` (olemassa) + `additive`
  (E6, jäljitettävä ensin).

## 3b. Toteutettavuusmittaus 2026-07-30 ja sen aiheuttama suunnanmuutos

Ennen toteutusta ajettiin kaksi mittausajoa työhakemistossa (scratchpad, ei
repo-moduuli, ei väitteitä). Ne muuttivat suunnitelman ydintä, ja siksi ne
kirjataan tähän suunnitteluperusteina — **yksittäiset luvut eivät esiinny
tässä dokumentissa**, koska ne olisivat löydöksiä ja vaativat väitelokirivin
sekä toisen koodipolun (sääntö 7).

Mitattiin kaksi asiaa:

1. **Säiliökoneisto siirtyy additiiviseen mekaanisesti** — sama de Bruijn -
   SCC - taajuusrakenne toimii kun ekvivalenssi vaihdetaan. Ja se tuottaa
   3-kirjaimisilla kokonaislukuaakkostoilla täsmälleen `MATH_CLAIMS.md`
   rivin 1 kanoniset luvut. Tämä on **poikkeuksellisen hyvä positiivinen
   kontrolli**: kaksi eri ekvivalenssia, eri koodipolku, sama vahvistettu
   tulos. Syy on rakenteellinen ja se kannattaa kirjata: sama Parikh-vektori
   ⇒ sama summa, joten additiivinen neliöttömyys **implikoi** abelin
   neliöttömyyden. Additiivinen ehto on siis *vahvempi*, ja jokainen abelin
   tulos on sen yläraja.

2. **Säiliö ei kuitenkaan ole oikea päätyökalu additiiviselle.** Säiliön
   arvo abelin puolella on välttämättömissä ehdoissa (rivit 51–52). Additiivisella
   puolella kiinnostava kysymys on *eliminaatio*: jos jokin aakkosto ei voi
   välttää additiivisia neliöitä, se on **todistettu** äärellisellä laskulla.
   Mittaus osoitti että säiliö ei kuole 4-kirjaimisilla aakkostoilla niillä
   ikkunakoon arvoilla jotka ovat laskennallisesti saavutettavissa (kustannus
   kasvaa muodossa |A|^(2k−1); 4 kirjainta ja k=7 on jo kymmeniä miljoonia
   raakatiloja), kun taas **tyhjentävä DFS oikeaan kieleen päättyy
   sekunneissa** usealle aakkostoluokalle. Eliminaatio on siis DFS-työkalu,
   ei säiliötyökalu.

**Seuraus arkkitehtuuriin:** `sanalab` v1:n ydin ei ole "profiiliajuri" vaan
**sertifioitu tyhjentävä lakaisumoottori aakkostoavaruuden yli**, jonka
tuloste on aakkostokohtainen verdikti. Säiliömoottori (`sft-container.js`)
säilyy toisena, rinnakkaisena analyysinä siellä missä se on oikea työkalu.

**Aakkostosymmetria — additiivisen tapauksen S₃-vastine.** Additiivinen
neliöttömyys säilyy affiinimuunnoksissa x ↦ αx + β (α ≠ 0): kaksi samanpituista
lohkoa, joilla summat S₁ ja S₂, toteuttavat S₁ = S₂ täsmälleen silloin kun
αS₁ + βL = αS₂ + βL. Aakkostot luokitellaan siis affiiniekvivalenssin mukaan
(normalisointi: min = 0, erotusten syt = 1, peilaus x ↦ max − x). Tämä on
lakaisun pakollinen symmetriareduktio ja samalla sen kontrolli — luokan
jokaisen edustajan on tuotettava identtinen verdikti.

## 4. Invarianttiprofiili (tuloste)

Jokainen kohta = olemassa oleva, validoitu moduulikuvio yleistettynä:

| Profiilin kohta | Mistä peritty | Tuloksen muoto |
|---|---|---|
| p(n)-taulukko + Feketen yläraja | `factor-complexity.js`, osio F | jokainen p(n)^(1/n) on lauseen muotoinen yläraja |
| Katkoksen tunnistus | ternäärin pituus-7-katko (rivi 1) | "kieli kuolee pituudella N" tai "elää ikkunassa" |
| Säiliö-SFT rajatulle ikkunalle | `sft-container.js` (rivit 51–52) | tilat, SCC:t, taajuusvälit/monikulmio (B8), välttämättömät tekijät (B7) |
| Umpikuja- ja jatkettavuussensus | `rauzy-graph.js`, `unfavourable-factors.js` (rivit 35, 47) | eksaktit lukumäärät syvyyksittäin |
| Morfismilakaisu porrastetuin suodattimin | `morphism-scan.js`, `h6-image-sweep.js` (rivit 36, 49) | tyhjentävyys ilmoitetulla katteella, selviytyjät eskaloituina |
| Sertifikaatti | `NEXT_STEP.md`:n suunnittelusääntö | JSON: rajoitteen tiiviste, parametrit, ikkunat, commit-hash, koodipolkujen täsmäys |

**Löytömoodi = profiilien erotus.** Aja profiili rajoiteperheen yli
(esim. abelin K ∈ [2,5] → [2,6] → [2,7], tai abelin → 2-abelin → additiivinen
samalla ikkunalla) ja raportoi mikä invariantti muuttuu ja mikä ei. Rivi 52
on tämän kuvion ensimmäinen tulos: stabiilius jota kukaan ei odottanut on
täsmälleen se "uusi rakenne" jota erotusnäkymä nostaa esiin koneellisesti.

## 5. Missä uudet löydökset todennäköisimmin ovat

Rehellisyysjärjestyksessä (jäljityksen 2026-07-30 jälkeen):

1. **Additiivisten neliöiden säiliöt** (A6, rivi 53): rajatun ikkunan eksaktit
   säiliölaskut kokonaislukuaakkostoilla — tilamäärät, SCC-rakenne,
   summataajuuksien välit, välttämättömät tekijät. Luonnolliset ensimmäiset
   aakkostot: {0,1,3,4} (kuutiotuloksen aakkosto) ja pienet 4-alkioiset
   ℤ:n osajoukot. Nämä ovat avoimen ongelman ympäriltä puuttuvaa eksaktia
   perustietoa, ja koneisto on rivien 51–52 kautta jo validoitu abelin
   tapauksessa. Huom. additiivisessa tapauksessa aakkoston *valinta* on osa
   kysymystä (ℤ:n osajoukko, ei kiinteä {a,b,c}) — profiiliajo aakkostojen
   yli on itsessään erotusnäkymä.
2. **Invarianttien stabiilius ekvivalenssitikkailla**: mitkä profiilin kohdat
   säilyvät kun ekvivalenssia heikennetään/vahvistetaan (abelin → additiivinen
   samalla ikkunalla; A3:n k-abelin tikkaat) — rivin 52 stabiiliuslöydös
   yleistettynä menetelmäksi. Jokainen yksittäinen vastaus on äärellinen lasku.
3. **B7/B8 uusille rajoitteille**: välttämättömät tekijät ja
   taajuusmonikulmiot ovat tuoreita objekteja jo abelin tapauksessa;
   naapurirajoitteille ne ovat sitäkin varmemmin ennen laskemattomia.

## 5b. Mitä uusi tieto on, ja mitä siitä hyödytään

"Uusi tieto" tarkoittaa tässä ohjelmassa täsmälleen kolmea asiaa, eikä muuta:

1. **Uusi eksakti rakenne** — luku, väli, monikulmio, tekijäjoukko tai
   graafi-invariantti jota kukaan ei ole laskenut, ilmoitetussa ikkunassa
   (rivien 49, 51, 52 tyyppi).
2. **Uusi negatiivinen tulos** — reitin tai parametrialueen tyhjyys
   todistetulla katteella (rivin 49 tyyppi; `NEGATIVE_RESULTS.md`:n arvo
   yhteisölle, ei vain projektille).
3. **Uusi kokonaislukujono** — p(n)-taulukot uusille kielille ovat
   itsenäisiä matemaattisia objekteja.

Hyötykanavat, konkreettisimmasta abstrakteimpaan:

- **OEIS-lähetykset.** Jokainen uuden kielen eksakti p(n)-taulukko on
  ehdokas OEIS-jonoksi. Se on pysyvä, viitattava ja muiden tutkijoiden
  löydettävissä oleva kontribuutio — matalin kynnys jolla tämän projektin
  laskenta muuttuu julkiseksi tiedoksi. (Huom. rivin 21 opetus: OEIS-viite
  kirjataan vasta kun lähetys on olemassa, ei ennen.)
- **Laskennallinen nootti.** Avoimen ongelman ympärille laskettu eksakti
  perustieto (esim. additiivisten säiliöiden rakenne pienillä aakkostoilla)
  on julkaistavissa lyhyenä noottina tai arXiv-preprinttinä — erityisesti
  kun jokainen luku tulee sertifikaatin ja kahden koodipolun kanssa.
- **Pääongelman karsinta.** Välttämättömät ehdot (taajuusvälit, pakolliset
  tekijät) karsivat kandidaattiavaruutta kaikilta tulevilta hauilta — sama
  hyöty jonka `NEGATIVE_RESULTS.md` tuottaa projektin sisällä, vietynä
  lauseiden muotoon.
- **Riippumaton replikoitavuus.** Sertifikaatti + toistokomento tarkoittaa
  että kuka tahansa voi ajaa saman laskun; tämä on E5:n replikaatiokyvykkyys
  ulospäin käännettynä.
- **Käytännön tulkinta** (osio 6): kuka tahansa jolla on sekvenssisuunnittelu-
  ongelma jossa "naamioitu toisto" on vikatila, voi pukea sen
  rajoitemäärittelyksi ja saada eksaktin vastauksen — tämä on väline,
  ei väite sovelluksesta.

Rehellinen raja: tämä ohjelma ei todennäköisesti ratkaise yhtään
kirjallisuuden avointa ongelmaa. Sen realistinen tuotos on ongelmien
*ympärillä* oleva eksakti, verifioitu ja uudelleenkäytettävä perustieto —
sama laji jota rivit 49–52 ovat, kohteissa joissa sitä ei vielä ole.

## 5c. Ajonaikainen todennettavuus ja löydösprotokolla

Kysymykseen "mistä tiedän että kone laskee, kaatui, vai löysi jotain"
vastataan rakenteella, ei lupauksilla:

**Tapahtumavirta.** Jokainen ajo kirjoittaa NDJSON-lokia (yksi
JSON-tapahtuma per rivi): `RUN_START` (manifesti: rajoitteen tiiviste,
parametrit, git-commit, versio), `CONTROL` (jokainen itseverifiointi
tuloksineen), `PROGRESS` (monotoninen laskuri: käsitellyt yksiköt,
mitattu nopeus, kate tähän asti), `CHECKPOINT` (jatkettava välitila +
tarkiste), `FINDING_CANDIDATE`, `RUN_END` (lopputila + yhteenveto).

**Kolme lopputilaa, ei muita:**

- `COMPLETE` — luvattu ikkuna katettu kokonaan; tulokset raportoidaan
  ikkunoineen.
- `PARTIAL` — budjetti täyttyi tai käyttäjä keskeytti; kate raportoidaan
  täsmälleen (viimeisestä checkpointista), eikä tyhjentävyysväitettä
  synny — sama kuvio kuin `h6-image-sweep.js`:n "INCOMPLETE"-haara.
- `FAILED` — jokin kontrolli petti; **mikään ajon tulos ei kelpaa**.
  Kontrollit ajetaan ennen raportointia ja poikkeus kaataa ajon
  (nykyisten moduulien konventio).

Kaatuminen erottuu rakenteellisesti: prosessi päättyi ilman
`RUN_END`-tapahtumaa. Silloin viimeinen `CHECKPOINT` kertoo tarkalleen
mihin asti laskenta eteni, ja siihen asti lasketut osatulokset pätevät
omassa ikkunassaan — rajattu kieli on sisäänrakennettu tulosmuotoon, ei
päälle liimattu. Jumiutuminen erottuu kaatumisesta `PROGRESS`-virrasta:
laskuri joko kasvaa tai ei.

**Löydös on protokolla, ei tunne.** Kaikki numerot ovat *tuloksia*;
LÖYDÖSEHDOKAS on määritelmällisesti jompikumpi:

1. **Anomalia erotusnäkymässä**: invariantti joka ei muutu vaikka kielen
   pitäisi kutistua (rivin 52 stabiilius oli tällainen), tai muuttuu
   suuntaan jonka sisäänrakennettu monotonisuustarkistus kieltää
   (relaksaatioketjun p-lukujen on toteutettava sandwich, kuten
   120 084 ≤ 128 940 ≤ 159 006 — rikko on aina bugi, ei löydös, ja
   tuottaa `FAILED`in).
2. **Ennalta rekisteröidyn kysymyksen vastaus** (B-osion muotoilu):
   selviytyjä lakaisussa, epätriviaali väli, epätyhjä tekijäjoukko.

Kun jompikumpi laukeaa, kone: (a) laskee saman asian uudelleen
riippumattomalla koodipolulla samassa ajossa (DP vs. DFS -kuvio
pakollisena — ilman täsmäystä ei synny ehdokasta, syntyy `FAILED`);
(b) kirjoittaa `findings/`-kansioon tiedoston jossa on **valmiiksi
lokirivin muotoinen väitelause** kalibroidulla kielellä, ikkunat,
parametrit, sertifikaatti, molempien koodipolkujen tulokset ja
yksirivinen toistokomento; (c) merkitsee statukseksi `EHDOTUS`.

**Arviointiin tuonti:** `findings/` on postilaatikko ihmiselle. Kone ei
koskaan kirjoita `MATH_CLAIMS.md`:hen — jokainen ehdotus kulkee ihmisen
läpi (sääntö 5), ja hyväksytty ehdotus muuttuu lokiriviksi jonka lähde
on sertifikaatti + toistokomento. Hylätty ehdotus jää kansioon
hylkäysperusteineen (sama periaate kuin `REJECTED`-riveillä: peruttua
ei poisteta). Tämä on täsmälleen se polku jota tämän session rivit
49–52 kulkivat käsityönä — `sanalab` tekee siitä rakenteen.

## 5d. Ennätykset ja eksakti tieto ruokkivat toisiaan — kehys, ei kielto

Ylläpitäjän eksplisiittinen ja legitiimi tutkimusmotivaatio on myös
**ennätyspituuksien löytäminen** (kirjattu 2026-07-30). Repositorion aiemmat
ennätysvaroitukset (rivit 37, 42; `NEGATIVE_RESULTS.md` §3, §6) eivät kiellä
ennätyksiä — ne kieltävät neljä spesifiä virhepäätelmää: rakenteen lukemisen
ennätys-vs-työmäärä-käyrästä (se on otoskoon logaritmi), ennätyssanan
käänteismallinnuksen, ennätyksen tekijöiden käytön suodattimena, ja
ennätyksen kutsumisen todisteeksi. Rivi 54 osoitti että ennätys voi olla
myös lause: kun haku tyhjenee, "pisin sana on L" on eksakti invariantti.

**Ennätyksen legitimiteettiehdot** (kaikki neljä, tai kyse on viihteestä):

1. **Sertifikaatti:** todistuskappale tulostetaan ja verifioidaan suoraan
   määritelmästä (nyt sisäänrakennettu: `additive-sweep.js` verifioi
   todistuskappaleen myös ratkaisemattomille luokille).
2. **Työmäärä ilmoitetaan** ennätyksen rinnalla — rivin 37 vastalääke.
3. **Kytkentä rekisteröityyn kysymykseen:** additiivisella puolella jokainen
   pidempi sana ratkaisemattoman luokan yli on alarajadataa lähteistettyyn
   avoimeen ongelmaan (rivi 53) — toisin kuin aa2f-ennätykset, joissa
   25 379 on jo olemassa eikä pituuden lisäys muuta mitään. Ja rivin 50
   nojalla Mäkelän konjektuuri *on* väite että ennätykset eivät koskaan
   lopu — ennätysdata on konjektuurin äärellinen varjo.
4. **Falsifiointirooli:** jokainen ennätyssana on ilmainen testikappale
   kaikille ehdotetuille välttämättömille ehdoille — jos ehdokas-ehto
   hylkää verifioidun ennätyssanan, ehto on väärä (Keräsen sanan
   säiliökontrolli rivillä 51 on tämän kuvion prototyyppi).

**Miten eksakti laskenta nopeuttaa ennätyksiä** (ei vain päinvastoin):

- **Triaasi:** lakaisun verdiktit kertovat missä ennätysjahti on mielekästä.
  Ratkaistu luokka = älä tuhlaa; ratkaisematon luokka korkealla verifioidulla
  alarajalla = rintama. Tämä on suora vastaus kysymykseen "meneekö laskenta
  hukkaan" — verdiktitaulukko on ennätysjahdin kartta.
- **Terveet karsintaoraakkelit:** rajatun horisontin jatkettavuustaulut
  (suffiksin selviytymissyvyys — `unfavourable-factors.js`:n
  jatkettavuussyvyys on juuri tämä invariantti) ovat *todistetusti* terveitä
  karsintoja: ne eivät koskaan leikkaa elinkelpoista haaraa, joten
  tyhjentymisverdiktit säilyvät todisteina ja DFS ulottuu syvemmälle samalla
  budjetilla. **Karsinnan terveys on todistettava, ei oletettava** — muuten
  jokainen tyhjentymisväite kaatuu.
- **Järjestysheuristiikat, heuristiikoiksi merkittyinä:** taajuusvälit
  (rivit 51–52) voivat ohjata kirjainten kokeilujärjestystä. Järjestys ei
  vaikuta täydellisyyteen, joten se on aina sallittu — mutta sen tuottamat
  havainnot ovat C-osiota, eivät kielen ominaisuuksia.
- **Jäännösperiaate:** hukkaan mennyt lasku määritellään: ajo joka ei jätä
  sertifioitua jäännöstä (todistuskappaletta, taulua, verdiktiä,
  tarkistuspistettä jonka joku voi kuluttaa). Jokainen `sanalab`-ajo
  suunnitellaan jättämään jäännös.

**Ensimmäinen jäännös on olemassa (2026-07-30): `extension-table.js`, rivi 55.**
Jatkettavuussyvyystaulu on yhtä aikaa (a) eksakti kielen invariantti, (b) terve
karsintaoraakkeli joka säilyttää sekä pisimmän sanan että tyhjentymisverdiktin
— terveys on todistettu tekijäargumentilla ja testattu 400 etuliitteellä — ja
(c) levylle tallennettava artefakti joka **siirtyy koko affiiniluokalle nollalla
hakusolmulla**. Mitattu vaikutus hakuun on n. 84–89×, mutta taulun rakentaminen
maksaa suunnilleen alkuperäisen haun verran: **yhden ajon nettovoitto on nolla,
ja koko arvo on uudelleenkäytössä.** Se on jäännösperiaate puhtaimmillaan — ja
samalla varoitus: jäännöksen arvo on aina mitattava uudelleenkäytön yli, ei
yhden ajon sisällä.

Suunnitteluseuraus `sanalab`iin: **ajot kuluttavat ja tuottavat tauluja.**
Taulukirjasto (`tables/`, avaimena affiiniluokan kanoninen edustaja + h + katto)
on v1:n ensimmäinen pysyvä rakenne, ja jokainen ajo raportoi kumpaakin: mitä
tauluja se kulutti ja mitä se jätti.

## 6. Yhteys käytäntöön — tulkintakerros, ei väitekerros

Rehellinen muotoilu: emme väitä sovelluksia, tarjoamme **tulkinnan** jolla
omat kysymykset voi pukea rajoitemäärittelyksi. Sana = tapahtumajono,
kirjain = resurssi/luokka, abelin neliö = **naamioitu toisto**: kaksi
peräkkäistä yhtä pitkää jaksoa jotka käyttävät täsmälleen saman
resurssijakauman eri järjestyksessä. Kysymys "voiko jonoa jatkaa loputtomiin
ilman naamioitua toistoa" on silloin täsmälleen välttyvyyskysymys, ja
`sanalab` vastaa siihen eksaktisti annetussa ikkunassa: vuorolistat,
soittolistat, kuormanjako, koejärjestelyt. Additiivinen ekvivalenssi tekee
saman määrällisille jonoille (sama summa = sama kuorma). Nämä kirjataan
ohjelman dokumentaatioon esimerkkeinä tulkinnasta — ei koskaan väitteinä
siitä että jokin teollisuus "käyttää tätä".

## 6b. Työnjako ihmisen, tämän agentin ja mahdollisen toisen mallin kesken

Kysymys "voisiko toinen malli tehdä pohjatyökoodauksen" ansaitsee tarkemman
vastauksen kuin kyllä/ei, koska **väärä jakolinja on tässä projektissa
kalliimpi kuin koodaustyö**. Yksitoista dokumentoitua epäonnistumista ovat
kaikki matematiikan ja kontrollien puolella, eivät kehysten.

**Älä delegoi:** ekvivalenssin määrittely ja sen reunatapaukset, eksakti
aritmetiikka, tyhjentävyyden todistaminen (kate, symmetriareduktion
oikeellisuus), kontrollien suunnittelu, kalibroitu kieli, väitelokirivit.
Nämä ovat juuri se osa jossa uskottava mutta väärä ratkaisu ei kaadu
silmämääräisessä tarkistuksessa.

**Delegoitavissa mekaanisesti:** NDJSON-tapahtumavirta, checkpoint-serialisointi
ja -palautus, CLI-argumentit, raportin muotoilu, `findings/`-kirjoittaja,
golden-testien ajuri. Nämä ovat testattavissa riippumatta matematiikasta.

**Paras käyttö toiselle mallille ei kuitenkaan ole halvempi koodaus vaan
riippumaton toinen koodipolku.** Protokolla vaatii jokaiselle luvulle kaksi
toteutusta; jos molemmat kirjoittaa sama malli samasta ajattelusta, ne
korreloivat ja ristiintarkistus heikkenee. Toinen malli, joka näkee **vain
spesifikaation eikä koskaan ensimmäistä toteutusta**, tuottaa aidosti
riippumattoman verifioijan — E5:n puhdashuonereplikaatio rakenteeksi
muutettuna ja jokaisen ajon sisään vietynä.

Ehto: spesifikaatio kirjoitetaan väitelokirivin ja määritelmien tasolla
(mitä lasketaan), ei algoritmitasolla (miten lasketaan) — muuten
riippumattomuus katoaa. Prompt säilytetään versionhallinnassa verifioijan
vieressä, jotta myöhemmin näkee mitä replikoijalle kerrottiin.

### 6b.1 Koeajo 2026-07-30 ja promptin korjaus

Delegointi kokeiltiin oikeasti: toinen malli tuotti verifioijan yllä olevan
kaltaisella promptilla, ja se ristiintarkistettiin oman inkrementaalisen
DFS-toteutuksen kanssa (scratchpad). **Kaikki testatut lukumäärät täsmäsivät**,
ja koe validoi nimenomaan sen kohdan jonka piti: oman toteutuksen
inkrementaalinen optimointi (jatkettaessa tarkistetaan vain uuteen loppuun
päättyvät neliöt) on validi vain koska etuliite on jo neliötön — juuri sitä
päättelyä tyhjentävä generointi ei tee.

**Mutta koe paljasti virheen promptissa, ei koodissa.** Kielto "älä käytä
graafi-, automaatti- tai DP-rakenteita" pakotti tyhjentävään generointiin,
jonka kustannus on |A|^N. Se kattaa neljällä kirjaimella noin N ≤ 10 — kun
taas eliminaatiotulokset (pisimmät sanat kymmenissä) ovat kertaluokkia
kauempana. **Tyhjentävä generointi ei voi koskaan verifioida sitä tulosta
jonka vuoksi lakaisu tehdään.**

Oikea riippumattomuusakseli ei siis ole "tyhmä vs. älykäs" vaan **eri
algoritminen idea samassa suorituskykyluokassa**. Korjattu spesifikaatio
toiselle mallille: *taso kerrallaan etenevä leveyshaku, joka pitää yllä
neliöttömien sanojen joukkoa pituudella n, laajentaa jokaisen kaikilla
kirjaimilla ja tarkistaa jokaisen laajennuksen **kokonaan alusta asti***.
Se on riippumaton inkrementaalisesta päättelystä mutta skaalautuu
neliöttömien sanojen lukumäärän mukaan, ei |A|^N:n — ja yltää siten samalle
pituusalueelle kuin varsinainen lakaisu.

### 6b.2 Verifiointi on kolmikerroksinen, ei kaksikerroksinen

Koeajon tärkein opetus: kaksi toteutusta ei riitä, koska niiden yhteinen
kattavuus on rajattu hitaamman mukaan. Kerrokset:

1. **Ominaisuusinvariantit — ainoa kerros joka yltää täyteen N:ään.**
   Eivät vaadi toista toteutusta lainkaan. Koeajossa testattiin ja ne
   pitivät: **affiini-invarianssi** (count(A,N) = count(αA+β,N), mukaan
   lukien negatiivinen α ja skaalaus — tämä testaa suoraan sitä symmetriaa
   jolla lakaisu redusoidaan), **käännösinvarianssi** (sanatasolla kaikille
   pituuden 8 sanoille), ja **sisältyvyys** additiivinen ⇒ abelin. Näitä voi
   ajaa täydellä pituudella: lakaisu aakkostolle A ja aakkostolle 3A+7 on
   päädyttävä identtiseen verdiktiin.
2. **Riippumaton toteutus samassa suorituskykyluokassa** (leveyshaku yllä)
   — kattaa koko alueen eliminaatiotuloksia myöten.
3. **Tyhjentävä referenssi** (koeajon verifioija) — kattaa vain pienet N,
   mutta nollalla jaetulla oletuksella. Arvokas juuri siksi.

### 6b.3 Väitteen kaksi puoliskoa maksavat eri verran — ja ne kirjataan erikseen

Eliminaatioväite "pisin sana on L" on kaksi väitettä, joiden
verifiointikustannus eroaa kertaluokkia:

- **"≥ L" — halpa ja vahvasti verifioitavissa.** Riittää esittää yksi
  pituuden L sana, ja sen neliöttömyyden tarkistaa tyhjentävä referenssi
  (kerros 3) suoraan määritelmästä yhdessä silmänräpäyksessä. Todistusarvo
  on täysi.
- **"≤ L" — kallis.** Vaatii tyhjentävän haun; sen kantaa vain nopea
  toteutus, jota kerros 3 ei yllä tarkistamaan tuolla pituudella.

Siksi lakaisun on **aina tulostettava pisin löytämänsä sana todistuskappaleena**
(witness), ja väitelokirivin on eroteltava puoliskot: alaraja on
todistuskappaleella verifioitu, yläraja nojaa tyhjentävään hakuun jonka
kate on ilmoitettava. Tämä on sama erottelu kuin rivillä 47 (tyhjennetty
hakupuu = todiste; katon saavuttaminen = evidenssi), ja se on nyt
sisäänrakennettu tulosmuotoon.

## 7. Vaiheet, kustannukset ja tappoehdot

**Vaihe 0 — jäljitys ja spesifikaatio (1 sessio).**
✅ *Jäljitysosuus tehty 2026-07-30:* primäärilähteet avattu (rivi 53, A6),
tappoehto ei lauennut — additiivinen instanssi vahvistettu, ja se osoittautui
projektin ydinlähteen emo-ongelmaksi. *Jäljellä:* rajoite-JSON:n lopullinen
muoto; profiilin kohtien esimittaukset pienillä additiivisilla aakkostoilla
(erityisesti: additiivisen säiliön tilamäärä kasvaa aakkoston summahaitarin
mukana — mittaa {0,1,3,4}:llä ennen kuin lupaat ikkunakokoja); avoimuuden
tuoreusvaraus (rivi 53: 2025-variaatiopaperi avaamatta) suljetaan jos
tuloksia aiotaan kehystää "avoimen ongelman ympäristönä".

**Vaihe 1 — eliminaatiolakaisu ENSIN, kehys vasta sitten (1–2 sessiota).**
Mittauksen (3b) jälkeen järjestys on käännetty: rakennetaan **yksi
tarkoituksenmukainen moduuli** (`additive-sweep.js`), ei kehystä. Sisältö:
affiiniluokkien enumerointi, tyhjentävä DFS oikeaan additiiviseen kieleen,
verdikti per luokka (tyhjentynyt katteineen / saavutti katon), ja
kontrollipatteristo — **pakollisena positiivisena kontrollina 3-kirjaimisten
aakkostojen on toistettava rivin 1 kanoniset luvut**, ja luokan edustajien
on annettava identtinen verdikti. Tämä tuottaa ensimmäisen uuden lokirivin
nopeimmin, ja se on samalla ainoa rehellinen tapa oppia mitä rajapinnan
pitää kantaa. *Tappoehto: jos yksikään aakkostoluokka ei tyhjenny
saavutettavalla budjetilla, eliminaatiotaulukko ei ole tuote ja painopiste
siirtyy säiliöanalyysiin (rivien 51–52 kuvio additiivisella ekvivalenssilla).*

**Vaihe 1b — abstraktio ansaitaan (1 sessio, vasta 1:n jälkeen).**
Kun sekä abelin että additiivinen instanssi on ajettu samasta kysymyksestä,
yhteinen ekvivalenssirajapinta vedetään täsmälleen niin leveäksi kuin nämä
kaksi pakottavat. Regressio: rivien 1, 33, 51, 52 lukujen on toistuttava
rajapinnan läpi ajettuina. *Tappoehto: jos abstraktio ei kata molempia
ilman erikoistapauksia, se puretaan ja moduulit jäävät erillisiksi —
rajapinta oli arvaus.*

**Vaihe 2 — profiiliajuri ja sertifikaatit (1 sessio).**
`node sanalab.js profile <rajoite.json>` → profiiliraportti + sertifikaatti;
`sanalab diff <a> <b>` → erotusnäkymä. Kieltosanavahti laajennetaan
kattamaan uusi binääri.

**Vaihe 3 — paikallinen käyttöliittymä (1–2 sessiota, valinnainen).**
`sanalab serve` tarjoaa localhost-sivun joka **renderöi** profiileja ja
erotuksia (säiliömikroskooppi, `UI_UX_PLAN.md` kohta 2 samalla datalla).
Laskenta pysyy Nodessa. Ei riippuvuuksia, yksi tiedosto.

**Vaihe 4 — jaettavat työyksiköt (myöhemmin).**
Hajautettu p(n)-sensus ja lakaisuositteet `NEXT_STEP.md`:n
suunnittelusäännön mukaisesti (manifesti, commit-hash, pistokoeverifiointi).
Ei ennen kuin vaiheet 1–2 ovat tuottaneet ensimmäisen uuden lokirivin.

## 8. Mitä tämä EI ole

- Ei ennätyssanageneraattori eikä pisin-sana-kilpailu (hylätty työtapa)
- Ei kahdeksankerroksinen alusta — yksi binääri, kaksi instanssia, ja
  kolmas vasta kun toinen on maksanut itsensä lokiriveinä
- Ei hakutelemetrian näyteikkuna (C-osio)
- Ei korvaa eksaktia putkea — se **on** eksakti putki, pakattuna muotoon
  jossa uuden kysymyksen esittäminen maksaa minuutteja eikä sessioita
