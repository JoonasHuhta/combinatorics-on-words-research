# Negatiiviset Tulokset ja Hylätyt Hypoteesit (Graveyard of Ideas)

Tämä dokumentti on arkisto tutkimuslinjoista, ideoista ja hypoteeseista, jotka on testattu ja **todistettu vääriksi tai riittämättömiksi**. 

Matematiikassa ja algoritmiikassa umpikujat ovat yhtä arvokasta tietoa kuin onnistumiset. Dokumentoimalla nämä säästämme tulevilta tutkijoilta (ja tekoälyiltä) viikkojen turhan työn, ja estämme projektia kiertämästä kehää.

**Kirjaamiskynnys on matala tarkoituksella.** Tänne kuuluu myös idea joka *toimi* mutta ei kannattanut (§9), idea joka toimi väärässä paikassa (§8), ja työtapa joka osoittautui vääräksi vaikka sen tuotos oli virheetön (§10). Umpikuja ei tarkoita virhettä — se tarkoittaa mitattua tietoa siitä mihin suuntaan ei kannata mennä.

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
