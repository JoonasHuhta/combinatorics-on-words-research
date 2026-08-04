# Industrial Backtracker v11 - Arkkitehtuuri ja Optimoinnit

Tämä dokumentti on tekninen spesifikaatio `scratch/backtracker.js` (v11) -ohjelmasta. Se kuvaa ohjelman arkkitehtuurin, optimoinnit ja epistemologiset kontrollit verrattuna perinteiseen, optimoimattomaan sanahakuun.

## Ongelmanasettelu
Ohjelman tehtävänä on etsiä äärettömiä ternäärisanoja (aakkosto `{a, b, c}`), jotka toteuttavat Mäkelän konjektuurin (`aa2f`-sääntö): sanassa ei saa esiintyä yhtäkään Abelin neliötä, jonka pituus on 2 tai suurempi.

Perinteisten DFS-hakualgoritmien pullonkaulat tässä ongelmassa ovat olleet merkkijonojen muistinhallinta (Garbage Collection) sekä neliöiden hidas merkkikohtainen laskenta (kombinatorinen räjähdys pituuden kasvaessa). 

Tässä ovat ne 8 rakenteellista optimointia ja kontrollia, joista ohjelma nyt koostuu:

### 1. Nolla roskienkeruuta kuumassa polussa (Zero Memory Allocation)
Perinteiset haut kopioivat merkkijonoja jokaisella askeleella, mikä täyttää muistin nopeasti.
* **Toteutus:** Hakusilmukan aikana ei luoda *yhtäkään* uutta oliota tai merkkijonoa. Koko hakuavaruus varataan etukäteen 30 000 alkion staattisiin `Uint8Array`- ja `Int32Array`-taulukoihin. Sana käsitellään pelkkinä numeroina (0, 1, 2).
* **Turva:** Koodissa on kova `MAX_LEN`-tarkistus heti alussa. Jos syötetty siemen tai tavoitepituus uhkaa ylittää 30 000 merkin staattisen varauksen, ohjelma heittää virheen turvallisesti sen sijaan, että se kirjoittaisi hiljaa muistirajojen yli.

### 2. Abelin neliöiden tunnistus ajassa O(L²) etuliitesummilla
Perinteinen neliötarkistus iteroi jokaisen uuden merkin kohdalla sanan loppuosan läpi, jolloin yksittäinen vertailu on hidasta.
* **Toteutus:** Ohjelma ylläpitää kahta juoksevaa etuliitesummaa (`prefixA`, `prefixB`). Kun testaamme, muodostaako uusi merkki Abelin neliön jollain lohkopituudella K, saamme lohkojen Parikh-vektorit suoraan vähentämällä etuliitesummien arvoja toisistaan. Yksittäisen neliön vertailu vie näin vain neljä peruslaskutoimitusta (O(1)).
* **Kustannus:** Koska jokaisen uuden merkin kohdalla on tarkistettava kaikki mahdolliset lohkopituudet (K = 2 ... L/2), yhden askeleen eteneminen vaatii karkeasti L vertailua. Tämän toteutuksen algoritminen kokonaiskustannus sanan kasvattamiselle on näin ollen **O(L²)**.

### 3. Rinnakkaisajo permutoiduilla hakupuilla (Multi-threading)
Syvyyshaku (DFS) etenee tavallisesti yhtä polkua kerrallaan yhdellä ytimellä.
* **Toteutus:** Node.js käynnistää rinnakkain 6 itsenäistä Worker-säiettä. Kukin säie toteuttaa täsmälleen saman DFS-algoritmin, mutta *eri prioriteettijärjestyksellä* (abc, acb, bac, bca, cab, cba). Vaikka algoritmi on deterministinen, säikeiden hajautus varmistaa, että järjestelmä hyödyntää moniydinsuoritinta ja löytää nopeasti avaruuden syvät haarat.

### 4. Eksplisiittinen kaksoismoodi: Heuristiikka vs. Matemaattinen puhdas haku
Aiemmat ratkaisut käyttivät koodiin sisäänrakennettua `FORBID4`-sääntöä, joka hylkäsi 6 tiettyä kuviota lennosta. Kuten projektin `MATH_CLAIMS.md` -lokissa (rivi 9) on todettu, kyseessä on *empiirinen heuristiikka*, jota ei ole todistettu turvalliseksi.
* **Toteutus:** Ohjelma tekee nyt selvän eron todistetun ja todistamattoman välillä kahdella ajotilalla:
  1. **Heuristinen tila (Oletus):** Käyttää FORBID4-karsintaa nopeuttaakseen hakua valtavasti. Tuottaa tiedoston: `record_word_X_heuristic.txt`.
  2. **Puhdas Mäkelä -tila (`--pure`):** Kytkee heuristiikan kokonaan pois. Hitaampi, mutta täydellinen. Tulokset tässä tilassa (esim. `record_word_X_pure.txt`) ovat kiistatonta tieteellistä dataa koko konjektuuria koskien. Tiedostonimet estävät tulosten sekoittumisen jälkikäteen.

### 5. Checkpoint-järjestelmä ja epistemologisesti turvallinen resumointi
Aiemmin haku hävitti kaiken edistymisen, jos ajo katkesi (esim. sähkökatkoon).
* **Toteutus:** Kukin säie tallentaa tilanteensa levylle minuutin välein (`checkpoint_worker_X.json`). Tämä tiedosto sisältää nykyisen sanan, `choiceStack`-pinon sekä ajotilan (`pureMode`). 
* **Turva:** Käynnistettäessä ohjelma `--resume` -lipulla se lukee tilan ja jatkaa hakua suoraan umpikujasta. Pääohjelma vertaa lisäksi annettua `--pure`-lippua checkpointiin tallennettuun tilaan. Jos tila ei täsmää (esim. käyttäjä yrittää jatkaa puhdasta ajoa heuristisessa tilassa), ohjelma kaatuu välittömästi kohtalokkaaseen virheeseen. Tämä takaa tulosten aukottoman jäljitettävyyden.

### 6. Matemaattinen riippumaton tuplavarmistus (Independent Double-Check)
Suorituskykyoptimoitu rutiini voi sisältää piilobugeja. Tulosta ei voida julkaista ilman erillistä auditointia.
* **Toteutus:** Kun säie löytää tavoitepituuden ja ilmoittaa siitä pääsäikeelle, tulosta ei kirjoiteta suoraan levylle. Pääsäie syöttää sanan täysin erilliseen `verifyAa2fr` -funktioon. Tämä funktio laskee O(N)-ajassa omat lokaalit etuliitesummansa ja suorittaa niillä puhtaan O(N²) -vertailun kaikille mahdollisille Abelin neliöille. Tulos katsotaan todeksi ja tallennetaan tiedostoon vasta, kun tämä täysin riippumaton koodipolku on vahvistanut sen oikeelliseksi.

### 7. Tiedostopohjainen siemenen jatkaminen
* **Toteutus:** Ohjelmalle voidaan syöttää aloitussiemeneksi paitsi yksittäinen kirjain (esim. `a`), myös polku valmiiseen tekstitiedostoon, joka sisältää olemassa olevan pitkän ennätyssanan. Ohjelma lataa tiedoston, lukitsee DFS-pinon peruuttamattomasti sen mitan verran, ja ryhtyy suoraan jatkamaan hakua kyseisen sanan pohjalta.

### 8. Vertailu C++ -toteutukseen (Miksi Node.js?)
Kombinatorisessa etsinnässä perinteinen oletus on, että ohjelma tulisi kirjoittaa C++:lla tai Rustilla maksimaalisen suorituskyvyn saavuttamiseksi. Tämä arkkitehtuuri on kuitenkin suunniteltu hyödyntämään Googlen V8-moottorin ominaisuuksia, ja se tarjoaa merkittäviä etuja:

* **Suorituskyky (JIT-kääntäjä):** Koska ohjelma on kirjoitettu täysin ilman olioita tai dynaamisia tietorakenteita (se käyttää vain peräkkäistä C-tyylistä taulukkomuistia), Node.js:n JIT-kääntäjä (Just-In-Time) optimoi while-silmukan suoraan natiiviksi konekieleksi. Koodin suoritusnopeus on käytännössä samalla tasolla kuin käännetyn C++ -koodin.
* **Rinnakkaistamisen helppous:** C++:ssa monisäikeistys ja jaetun muistin hallinta vaativat monimutkaista lukitusten (mutex) hallintaa. Tässä JS-toteutuksessa `worker_threads` luo puhtaasti eristetyt säikeet ilman lukkoja, ja viestinvälitys hoituu asynkronisesti.
* **Datasarjallisuuden ylivoima:** Kun C++ -ohjelman tila (checkpoint) halutaan tallentaa levylle, vaaditaan erilliset rutiinit taulukoiden bittitason serialisointiin. JavaScriptissä valtavan pinon tallentaminen on yksi rivi koodia: `JSON.stringify()`. Sisäänrakennettu serialisointi purkaa ja pakkaa tilan salamannopeasti ja luotettavasti.
* **Itsenäinen ekosysteemi:** C++ vaatii aina kääntäjän (GCC/Clang) ja Makefilen toimiakseen. Tämä JS-ohjelma toimii "heittämällä" millä tahansa koneella, johon on asennettu Node.js – oli se sitten Windows-läppäri tai Linux-palvelin.

**Yhteenveto:**
Optimoimalla JavaScriptistä pois sen heikkoudet (roskienkeruu ja dynaamiset oliot), saimme C++:n raa'an suorituskyvyn, mutta säilytimme JavaScriptin ylivoimaisen helppokäyttöisyyden monisäikeistyksessä ja tiedostojen käsittelyssä. Tulos on moderni, joustava ja salamannopea tutkimustyökalu, joka kestää kovimmankin tieteellisen kriitikin.
