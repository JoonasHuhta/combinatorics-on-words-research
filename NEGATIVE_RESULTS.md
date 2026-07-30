# Negatiiviset Tulokset ja Hylätyt Hypoteesit (Graveyard of Ideas)

Tämä dokumentti on arkisto tutkimuslinjoista, ideoista ja hypoteeseista, jotka on testattu ja **todistettu vääriksi tai riittämättömiksi**. 

Matematiikassa ja algoritmiikassa umpikujat ovat yhtä arvokasta tietoa kuin onnistumiset. Dokumentoimalla nämä säästämme tulevilta tutkijoilta (ja tekoälyiltä) viikkojen turhan työn, ja estämme projektia kiertämästä kehää.

**Kirjaamiskynnys on matala tarkoituksella.** Tänne kuuluu myös idea joka *toimi* mutta ei kannattanut (§9), idea joka toimi väärässä paikassa (§8), ja työtapa joka osoittautui vääräksi vaikka sen tuotos oli virheetön (§10). Umpikuja ei tarkoita virhettä — se tarkoittaa mitattua tietoa siitä mihin suuntaan ei kannata mennä.

---

## Hakemisto, uusin ensin

Numerointi on pysyvä (siihen viitataan muualta), joten uutuusjärjestys on
tässä eikä dokumentin rungossa. Aja silmäys tästä ennen kuin ehdotat mitään.

| Pvm | # | Mikä kaatui | Yhdellä lauseella |
|---|---|---|---|
| 2026-07-30 | [§14](#14-kasvukäyrän-muoto-lähestyvän-tyhjentymisen-ennustajana) | Kasvukäyrän muoto tyhjentymisen ennustajana | Kolmen pisteen budjettikäyrä oli kohinaa 20 luokan yli, ei ennustanut mitään |
| 2026-07-30 | [§13](#13-osittainen-korroboraatio-täytenä-vahvistuksena) | Osittainen korroboraatio täytenä | Neljä täsmäävää kenttää viidestä tuntui vahvistukselta; tarkistamatta jäänyt DOI ei ollut olemassa |
| 2026-07-30 | [§12](#12-up-and-down--järjestysheuristiikan-siirto-aa2f-hakuun) | Up-and-Down -järjestyksen siirto aa2f-hakuun | Toimii dramaattisesti omassa asetelmassaan, häviää aa2f:ssä — tekniikka on asetelmakohtainen |
| 2026-07-30 | [§11](#11-vapaa-hakukonetiiviste-lähteenä-metodologinen-umpikuja) | Hakukonetiiviste lähteenä | Tiiviste antoi kirjaimellisen väitteen tekijänimineen ja lukuineen; kumpaakaan ei ollut alkuperäisessä |
| 2026-07-30 | [§10](#10-puhdas-määritelmäverifioija-riippumattomana-tarkistajana-metodologinen-umpikuja) | Määritelmäverifioija riippumattomana tarkistajana | Toimi virheettömästi mutta ei yltänyt omaan kohteeseensa |
| 2026-07-30 | [§9](#9-yhden-ajon-nettovoitto-karsintataulusta) | Karsintataulun nettovoitto yhdessä ajossa | 1,00× — arvo on yksinomaan uudelleenkäytössä |
| 2026-07-30 | [§8](#8-jatkettavuustaulu-ennätysjahdin-kiihdyttimenä) | Taulu ennätysjahdin kiihdyttimenä | Sama pisin sana karsittuna ja karsimattomana |
| 2026-07-30 | [§7](#7-säiliörelaksaatio-additiivisten-neliöiden-eliminaatiotyökaluna) | Säiliö additiivisena eliminaatiotyökaluna | Ei kuollut saavutettavilla ikkunakoilla |
| aiemmin | §6 | "Rosetta-filtteri" | Hylkäisi 88 % laillisista jatkoista |
| aiemmin | §5 | FORBID4 universaalina sääntönä | Esiintyy 2 820 kertaa ennätyssanassa |
| aiemmin | §4 | Parikh-epätasapaino pienenä | Mitattu päinvastoin |
| aiemmin | §3 | Ennätyssanan käänteismallinnus | Rakennetta ei ole purettavaksi |
| aiemmin | §2 | Rauzy-SCC äärettömyyden todisteena | Lokaali ehto, globaali ongelma |
| aiemmin | §1 | Morfismiskannaus k = 7…9 | Otoskoon logaritmi |

---

## 1. Uniformien Morfismien Skannaus ($k=7..9$)
**Hypoteesi:** Jos testaamme yhä suurempia uniformien morfismien pituuksia ($k=7, 8, 9...$), löydämme lopulta kiintopisteen, joka välttää abelin neliöt puolipituudella $K \ge 2$.
**Miksi se ammuttiin alas:** 
- Suoritettiin regressioanalyysi selviytymispituuksien maksimeille $k=2..6$. Tulos osoitti lähes täydellisen selitysasteen ($R^2 = 0,998$) kaavalle $max \approx 2,29 \cdot \ln N$, missä $N$ on testattujen morfismien määrä.
- **Johtopäätös:** Maksimipituuden kasvu ei ole rakenteellinen signaali ongelman ratkeamisesta, vaan puhtaasti **otoskoon artefakti** (tilastollisen jakauman häntä). Hakeminen isommilla $k$-arvoilla ilman rakenteellista uutta ideaa on laskentaresurssien tuhlausta.

## 2. Rauzy-graafin Vahvasti Yhtenäinen Komponentti (SCC) Todistuksena
**Hypoteesi:** Jos löydämme rajoitekielen (esim. Abelian square-free) Rauzy-graafista ikkunalla $n$ Vahvasti Yhtenäisen Komponentin (SCC), olemme todistaneet, että kieli on ääretön.
**Miksi se ammuttiin alas:** 
- Abelin neliöiden välttäminen vaatii globaalia Parikh-tasapainon hallintaa, jota ei voida pakata äärelliseen muisti-ikkunaan. Rauzy-graafi pituudella $n$ takaa ainoastaan, ettei neliöitä synny **pituuteen $n$ asti**. Se on lokaali, ei globaali ominaisuus.
- **Johtopäätös:** Rauzy-graafi ja SCC ovat erinomaisia *heuristisia esisuodattimia*, mutta niillä ei ole absoluuttista todistusarvoa (Level 2). Äärettömyyden todistaminen vaatii kielen generoivan säännön (morfismin) löytämistä ja sen syöttämistä eksaktiin verifiointimoottoriin (esim. `decide-realizability.js`).

## 3. "Ennätyssanan" Käänteismallinnus (Morfismin Louhinta)
**Hypoteesi:** Keräsen ja Gavrilenkon löytämä 25 379 merkin sana on niin pitkä, että sen takana on pakko olla algebrallinen sääntö (esim. lohkosubstituutio tai morfismi). Pöytäkoneen laskentateholla voimme purkaa (käänteismallintaa) tuon säännön sanasta.
**Miksi se ammuttiin alas:** 
- Sanojen tekijäkompleksisuus $p(n)$ mitattiin. Morfisen sanan kompleksisuuden on pakko kasvaa lineaarisesti ($p(n) \le C \cdot n$). Keräsen 25k sanalla $p(15) = 14 502$, eli se kasvaa eksponentiaalisesti seuraten koko $aa2f$-kielen kasvua.
- **Johtopäätös:** Sana on puhdas optimoidun syvyyssuuntaisen haun (DFS / random walk) tuote. Sillä on massiivinen topologinen entropia. Sääntöä ("DNA:ta") ei voi käänteismallintaa, koska sitä ei ole olemassa.

## 4. Morfismien Parikh-epätasapaino on Pieni
**Hypoteesi:** Algebrallisen säännön (morfismin) tuottama sana on niin synkronoitu, että sen Parikh-epätasapaino (yleisimmän ja harvinaisimman kirjaimen erotus) pysyy tiukasti rajattuna, esim. $< 10$.
**Miksi se ammuttiin alas:** 
- Empiirinen mittaus osoitti tismalleen päinvastaista. Oikea morfinen sana ($g_3(h_6^\omega(a))$) tuotti pituudessa 25 379 Parikh-epätasapainon **2 298**. Keräsen DFS-hakusanalla vastaava epätasapaino oli vain **322**.
- **Johtopäätös:** Kun morfismin siirtymämatriisilla on ominaisarvo $|\lambda| > 1$ (kuten $h_6$:n tapauksessa $|\lambda_2| = \sqrt{3}$), epätasapaino kasvaa teoriassa rajatta nopeudella $\sqrt{N}$. Morfismi on tässä suhteessa "epätasapainoisempi" kuin hyvin leikattu DFS-vaellus.

## 5. FORBID4-tekijät Ovat Universaalisti Kuolettavia
**Hypoteesi:** Projektin DFS-haun löytämät kuusi "umpikujatekijää" (`baac`, `caab`, `abbc`, `cbba`, `accb`, `bcca`) johtavat väistämättä kuolemaan, ja ne tulee kovakoodata sääntönä pois kaikista hauista.
**Miksi se ammuttiin alas:** 
- Analysoitaessa 25 379 merkin selviytyjäsanaa havaittiin, että jokainen näistä kuudesta FORBID4-tekijästä esiintyy sanassa satoja kertoja (esim. `accb` 501 kertaa).
- **Johtopäätös:** FORBID4 on kuolettava vain kapeassa, spesifissä hakuavaruudessa. Jos kieltäisimme ne globaalisti tulevilta tekoälyhauilta tai optimoijilta, tekisimme 25 000 merkin sanan löytymisen *matemaattisesti mahdottomaksi*. 

## 6. Datavetoinen Älykäs DFS ("Rosetta-filtteri")
**Hypoteesi:** Koska 25k sana selvisi, voimme uuttaa siitä kaikki käytetyt $N$-pituiset osasanat "sallituksi sanakirjaksi", ja suodattaa kaikki tulevat syvyyssuuntaiset haut (DFS) sen läpi.
**Miksi se ammuttiin alas:**
- 25 379 merkin sana käyttää pituudella 15 yhteensä 14 502 uniikkia tekijää. Koko $aa2f$-kielen luvallisten 15-pituisten tekijöiden määrä on 120 084. 
- **Johtopäätös:** Filtteri heittäisi roskakoriin 88 % täysin laillisista jatkopoluista vain siksi, että Keräsen haku ei *sattunut* osumaan niihin. Tämä johtaisi ylisovittamiseen (overfitting) ja toimisi todennäköisemmin kattona kuin ponnahduslautana. Puhdasta empiiristä ennätyshakua on muutenkin syytä välttää, sillä tavoitteemme on eksakti, ääretön todistus (Level 2).

---

*Kohdat 7–10 kirjattu 2026-07-30 (`sanalab`-kehityssessio). Kaikki neljä ovat mitattuja, eivät arvattuja; luvut ovat väitelokin riveillä 51–55.*

## 7. Säiliörelaksaatio additiivisten neliöiden eliminaatiotyökaluna
**Hypoteesi:** Sama de Bruijn -säiliökoneisto, joka tuotti abelin puolella taajuusrajat ja SCC-rakenteen (rivit 51–52), toimii additiivisella puolella **eliminaationa**: kasvattamalla ikkunaa K ∈ [2,kmax] säiliö lopulta kuolee, ja kuollut säiliö todistaisi ettei aakkosto voi välttää additiivisia neliöitä.
**Miksi se ammuttiin alas:**
- Säiliön kustannus kasvaa muodossa |A|^(2·kmax−1). Neljällä kirjaimella kmax = 7 on jo kymmeniä miljoonia raakatiloja, ja saavutettavilla kmax-arvoilla säiliö **ei kuollut yhdelläkään** nelikirjaimisella aakkostolla.
- Samaan aikaan tyhjentävä DFS **oikeaan** kieleen päättyi sekunneissa usealle aakkostoluokalle (rivi 54).
- **Johtopäätös:** eliminaatio on hakukysymys, ei säiliökysymys. Säiliö säilyy oikeana työkaluna siihen mihin se on hyvä — välttämättömiin ehtoihin ja rakenteeseen — mutta relaksaatio on liian löysä kuollakseen siellä missä oikea kieli kuolee. Yleisemmin: **relaksaation kuolema on vahva todiste, mutta relaksaatiota ei voi kiristää mielivaltaisesti ilman eksponentiaalista hintaa.** Suunnanmuutos kirjattu `SANALAB_PLAN.md` 3b.

## 8. Jatkettavuustaulu ennätysjahdin kiihdyttimenä
**Hypoteesi:** Koska jatkettavuussyvyystaulu on terve karsintaoraakkeli ja vähentää hakusolmuja 84–89× eliminaatiossa (rivi 55), sen pitäisi auttaa myös **ennätysjahdissa** eli löytää pidempiä sanoja samalla budjetilla ratkaisemattomilla aakkostoluokilla.
**Miksi se ammuttiin alas:**
- Mitattu luokilla {0,1,2,5} ja {0,1,3,5}, budjeteilla 2·10⁶ ja 10⁷: karsittu ja karsimaton haku antoivat **täsmälleen saman pisimmän sanan** (78/81 ja 76/83), vaikka karsintoja tapahtui tuhansia.
- Syy on rakenteellinen: branch-and-bound karsii vain haaroja jotka **eivät voi voittaa nykyistä parasta**. Kun kieli ei lopu, paras kasvaa jatkuvasti eikä karsinta osu ennätyspolkuun.
- Taulun informatiivisuus ja hinta kasvavat yhdessä: h = 7 → 0,7 % merkinnöistä sai äärellisen rajan (62 M solmua), h = 8 → 6,0 % (162 M), h = 10 → 96,3 % (1,2 mrd). **Jokainen tapaus maksaa enemmän kuin koko hakubudjetti.**
- **Johtopäätös:** oraakkeli on **eliminaatiotyökalu, ei ennätystyökalu**. Karsinta joka nojaa "tämä haara ei voi olla parempi" -päättelyyn on hyödytön silloin kun parempaa löytyy koko ajan. Ennätysjahtiin tarvitaan eri lajin apuväline (esim. hakujärjestys), ja se on heuristiikka eikä invariantti.

## 9. Yhden ajon nettovoitto karsintataulusta
**Hypoteesi:** Terve karsintaoraakkeli, joka vähentää hakusolmuja lähes satakertaisesti, nopeuttaa ajoa vastaavasti.
**Miksi se ammuttiin alas:**
- Taulun rakentaminen vaatii käytännössä saman puun läpikäynnin kuin itse haku: {0,1,2,3} hakusolmut 751 156 vs. taulun 725 960; {0,1,3,4} 2 638 908 vs. 2 611 320. Kokonaiskustannus on **1,00×**.
- **Johtopäätös:** hyöty on **yksinomaan uudelleenkäytössä** — samalle aakkostolle uudelleen, syvemmällä katolla, tai affiiniluokan toiselle edustajalle (siirto maksaa 0 hakusolmua). Tämä on `SANALAB_PLAN.md` 5d:n jäännösperiaate ja samalla sen varoitus: **jäännöksen arvo on aina mitattava uudelleenkäytön yli, ei yhden ajon sisällä.** Kiihdytysluku ilman rakennuskustannusta on harhaanjohtava tapa raportoida.

## 10. Puhdas määritelmäverifioija riippumattomana tarkistajana (metodologinen umpikuja)
**Hypoteesi:** Riippumattomuuden maksimoimiseksi toiselle mallille annettu verifiointiprompti kannattaa rajata mahdollisimman tiukasti — kieltämällä graafit, automaatit ja dynaaminen ohjelmointi saadaan varmasti eri rakenteinen toteutus.
**Miksi se ammuttiin alas:**
- Kielto pakotti tyhjentävään generointiin, jonka kustannus on |A|^N. Se kattaa neljällä kirjaimella noin N ≤ 10, kun taas verifioitavat tulokset ovat pituuksilla 50–62.
- **Verifioija ei siis voinut koskaan tarkistaa sitä tulosta, jonka vuoksi laskenta tehdään** — vaikka se toimi moitteettomasti ja täsmäsi kaikilla testatuilla arvoilla.
- **Johtopäätös:** riippumattomuuden oikea akseli ei ole "tyhmä vs. älykäs" vaan **eri algoritminen idea samassa suorituskykyluokassa**. Korjattu spesifikaatio (taso kerrallaan etenevä leveyshaku, joka tarkistaa jokaisen jatkeen kokonaan alusta) on `SANALAB_PLAN.md` 6b.1:ssä, ja se on käytössä `additive-sweep.js`:ssä. Yleinen opetus: **kaksi toteutusta kattaa vain sen mihin hitaampi yltää**, joten verifiointi tarvitsee kolmannen kerroksen — ominaisuusinvariantit, jotka pätevät täydellä pituudella (6b.2).

## 11. Vapaa hakukonetiiviste lähteenä (metodologinen umpikuja)
*Kirjattu 2026-07-30.*

**Hypoteesi:** hakukoneen tuottama tiiviste kelpaa *johtolangaksi*, joka voidaan merkitä jäljittämättömäksi ja jäljittää myöhemmin. Riski on hallittu, koska merkintä estää käytön.

**Miksi se ammuttiin alas:**
- Tiiviste antoi kirjaimellisen, uskottavan väitteen tekijänimineen ja lukuarvoineen: *"Freedman on osoittanut, että pisin sana yli {a,b,c,d} ehdolla a+d = b+c, joka välttää additiiviset neliöt, on pituudeltaan ≤ 60."* Se osui täydellisesti yhteen projektin oman rivin 54 tasapainoisten luokkien ja arvon 60 kanssa — juuri niin hyvin, että se tuntui vahvistukselta.
- Perusteellinen jäljitys 2026-07-30: **nimeä "Freedman" ei esiinny Fici & Puzyninan katsauksessa lainkaan** (koko teksti uutettu PDF:stä ja haettu), eikä lukua 60 ole §8.4:ssä. Alkuperää ei löytynyt mistään.
- **Vahinko oli jo tapahtunut ennen jäljitystä.** Väite ohjasi kahden istunnon prioriteetteja: se merkittiin kriittiselle polulle kahteen dokumenttiin, ja rivi 54 kirjoitettiin varauksella "tämä voi olla replikaatio" — varauksella, jolle ei ollut mitään perustetta.
- **Johtopäätös:** jäljittämättömäksi merkitseminen estää *siteeraamisen* mutta ei estä väitettä **ohjaamasta työjärjestystä**, ja juuri se on kallis vaikutus. Sääntö: hakukonetiiviste ei ole johtolanka vaan **kohina, kunnes se on paikannettu johonkin avattavaan dokumenttiin**. Se saa kirjata *kysymyksen* ("onko tällaista tulosta olemassa?"), ei koskaan *väitteen muotoa* tekijänimineen ja lukuineen. Sama koskee mitä tahansa kielimallin tuottamaa tiivistelmää lähteestä jota se ei ole avannut — myös tämän agentin.
- **Mitä jäljitys silti tuotti:** vahvemman rajauksen kuin haettu väite olisi tuottanut (rivi 58). Se ei kumoa opetusta; onnekas sivutuotos ei tee menetelmästä oikeaa.

## 12. "Up and Down" -järjestysheuristiikan siirto aa2f-hakuun
*Kirjattu 2026-07-30. Ks. `MATH_CLAIMS.md` rivi 60.*

**Hypoteesi:** Lietardin väitöskirjassa raportoitu vuorotteleva prioriteettijärjestys, joka kasvatti additiivisesti kuutiovapaan sanan pituutta {0,1,2,3}:ssa dramaattisesti, siirtyy projektin aa2f-ennätyshakuun. Perustelu vaikutti vahvalta: molemmat ovat syviä kieliä, ja `NEGATIVE_RESULTS.md` §8 oli jo sulkenut pois karsinnan mutta jättänyt **järjestyksen** auki.

**Miksi se ammuttiin alas:**
- Kontrolloitu mittaus tekniikan **omassa** asetelmassa vahvisti että se toimii: additiivisilla kuutioilla {0,1,2,3} budjetilla 10⁶ kiinteä järjestys saavutti 24 396 ja vuorotteleva pituuskaton 300 000. Tekniikka ei siis ole huono.
- Aa2f:ssä se **hävisi selvästi**: budjetilla 2·10⁷ kiinteä järjestys 2 034, vuorotteleva 619 ja 1 764. Myös harvinaisinta kirjainta suosiva järjestys hävisi (1 111).
- **Johtopäätös:** tekniikka on asetelmakohtainen, ei yleinen. Selitysehdokas (hypoteesi): vuorottelu torjuu *ajautumista*, ja aa2f:n vikatila ei ilmeisesti ole ajautuminen. Tätä tukee riippumattomasti rivi 42 — Parikh-epätasapaino ei erottele aa2f:ssä, joten sen tasapainottaminen ei voi ohjata hakua.
- **Metodologinen opetus, joka on tässä tärkeämpi kuin tulos:** ensimmäinen mittaukseni tehtiin väärässä asetelmassa (additiiviset neliöt) ja olisi yksinään johtanut päättelemään että *tekniikka ei toimi*. Kontrolloitu testi sen omassa asetelmassa kumosi sen. **Kirjallisuudesta lainattu menetelmä on testattava ensin siellä mistä se on peräisin** — muuten mitataan siirtoa eikä menetelmää, ja hylätään toimiva idea väärin perustein.

## 13. Osittainen korroboraatio täytenä vahvistuksena
*Kirjattu 2026-07-30. Ks. `MATH_CLAIMS.md` rivi 23.*

**Hypoteesi:** kun peruutettu lähdeviite löytyy riippumattomasta lähdeluettelosta ja **volyymi, numero, sivut ja vuosi täsmäävät**, viite on korroboroitu ja peruutus voidaan purkaa.

**Miksi se ammuttiin alas:**
- Näin tehtiin rivin 23 kanssa aiemmin samana päivänä: Fici & Puzyninan lähdeluettelo antoi neljä täsmäävää kenttää, ja rivi nostettiin `REJECTED` → `INDIRECT`.
- **DOI:ta ei tarkistettu.** Muutamaa tuntia myöhemmin DOI-rekisteristä selvisi että lokissa ollut tunniste `10.1137/16M1087493` **ei ole olemassa lainkaan** (Crossref 404), ja oikea on `10.1137/17M1149377`.
- Neljä oikeaa kenttää viidestä tuntui vahvistukselta. Se oli juuri se kenttä joka jäi tarkistamatta, joka oli väärä.
- **Nolaava yksityiskohta joka on kirjattava:** väärä tunniste poistui lokista vasta kun solu kirjoitettiin uusiksi — **vahingossa, ei tarkistuksen tuloksena**. Rivi ei parantunut huolellisuudesta vaan sattumasta.
- **Johtopäätös:** **korroboraatio kattaa vain ne kentät jotka on tosiasiassa verrattu, ei tietuetta kokonaisuutena.** Kun viite palautetaan peruutuksesta, jokainen kenttä on tarkistettava erikseen ja tarkistetut kentät nimettävä. Pysyvät tunnisteet (DOI, arXiv-id) on tarkistettava rekisteristä, koska juuri ne ovat kenttiä joita ihminen tai malli ei osaa arvioida silmämääräisesti — vuosiluvun virheen huomaa, DOI:n ei.

## 14. Kasvukäyrän muoto lähestyvän tyhjentymisen ennustajana
*Kirjattu 2026-07-30. Ks. `additive-morphism-scan.js`, `OPEN_RESEARCH_QUESTIONS.md` B10.*

**Hypoteesi:** kun budjettia kasvatetaan (10⁶ → 10⁷ → 10⁸), pisimmän löydetyn sanan kasvun muoto (tasaantuva vs. kiihtyvä vs. tasainen) ennustaisi mikä ratkaisemattomista epätasapainoisista aakkostoluokista on lähimpänä tyhjentymistä, ja ohjaisi mihin kannattaa syventää hakua ensin.

**Miksi se ammuttiin alas:**
- Ajettiin kaikille 20 avoimelle luokalle kolmella budjettitasolla ja luokiteltiin kasvun muoto kahden peräkkäisen erotuksen perusteella. Tulos oli kohinaista: luokat jakautuivat "tasaantuva", "kiihtyvä" ja "tasainen kasvu" -ryhmiin ilman havaittavaa yhteyttä muihin ominaisuuksiin (esim. epäbalanssin suuruuteen).
- Kolmen pisteen kasvukäyrä on liian lyhyt erottelemaan aitoa rakennetta otantakohinasta — sama perusongelma kuin rivin 37 otoskoko-artefaktissa, nyt eri muuttujalla mitattuna.
- **Johtopäätös:** diagnostiikkaa ei käytetty priorisointiin. Sen sijaan siirryttiin suoraan menetelmään joka voi oikeasti ratkaista äärettömyyden kumpaankin suuntaan — morfismihakuun (`additive-morphism-scan.js`) — koska mikään DFS-kasvukäyrän muoto ei voi koskaan todistaa ääretöntä kieltä (§2:n opetus yleistettynä uuteen kontekstiin).
