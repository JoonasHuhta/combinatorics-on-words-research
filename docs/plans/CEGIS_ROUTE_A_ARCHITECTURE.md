# CEGIS-silmukan Arkkitehtuuri ja Strategia (Reitti A, Epäuniformit)

**Päiväys:** 2026-08-04
**Tila:** Suunniteltu, valmiina toteutukseen (`scripts/cegis-route-a.js`)

## 1. Strateginen Merkitys ja "Miksi tämä tehdään"

Tämä suunnitelma on projektin tärkein yksittäinen uusi suunta. Se iskee suoraan Mäkelän pääkonjektuuriin hyödyntäen olemassa olevaa matemaattista koneistoa, mutta täysin tutkimattomassa avaruudessa.

**1. Iskee suoraan pääongelmaan:** Reitti (c) on hakenut ratkaisua projektion kautta ($g \circ h_6$), ja on jumissa "pienen ja suuren ikkunan ristiriidan" (L*) takana. Reitti (b) pakeni 4-kirjaimiseen additiiviseen maailmaan, josta tuli oma umpikuja. Tämä on paluu Reitille (a): suora hyökkäys kolmella kirjaimella.
**2. Avaa täysin kartoittamattoman avaruuden:** Uniformit kolmen kirjaimen morfismit (k <= 6) on testattu tyhjentävästi (`morphism-scan.js`), ja ne kuolevat kaikki pituuteen ~34. Epäuniformeja morfismeja ei ole **koskaan** testattu tälle ongelmalle (vain additiiviselle). Tämä mahdollistaa asymmetrisen hengitystilan.
**3. Nostaa haun tason CEGIS-älykkyyteen:** Sokean DFS-haun sijaan generaattorin ehdotukset validoidaan matemaattisesti eksaktilla Rao & Rosenfeld -päätösmenettelyllä (`decide-realizability.js`). Vastaesimerkit ja virheet puretaan rakenteelliseksi palautteeksi, joka karsii avaruutta (Counterexample-Guided Inductive Synthesis).
**4. Kiertää L*-pullonkaulan:** Koska tutkimme *puhdasta kiintopistettä* emmekä projektiota suuremmasta aakkostosta, Parikh-suodatus ja siihen liittyvä kompromissi ikkunoiden välillä ohitetaan kokonaan.
**5. Tarjoaa vain "win-win" -tuloksia:** Onnistuminen tarkoittaa Mäkelän konjektuurin ratkeamista. Epäonnistuminen tarkoittaa julkaisukelpoista, matemaattisesti todennettua dataa siitä, *miksi* 3 kirjaimen maailma on liian ahdas "Sama Parikh" -vihjeellä etsittynä, tuoden projektia lähemmäs negatiivisen tuloksen todistamista.

## 2. Arkkitehtuuri: `scripts/cegis-route-a.js`

Työkalu kokoaa yhteen olemassa olevat `morphism-scan.js`, `decision-preconditions.js` ja `decide-realizability.js` uuden generaattorin ympärille.

### Taso 0: Epäuniformi Generaattori ja "Sama Parikh" -vihje
- **Generointi:** Iteroidaan pituuksia $p_a, p_b, p_c \in \{2,3,4,5,6\}$.
- **Ehtona:** $h(a)$ alkaa kirjaimella $a$ (injektio). Kaikkien kuvien $h(x)$ on itsessään oltava abelin-neliöttömiä.
- **Rakenteellinen priorisointi:** Järjestetään ehdokkaat niin, että etusijalla ovat sellaiset $h$, joilla $\Psi(h(a)) = \Psi(h(b)) = \Psi(h(c))$ (tai permutoidut), imitoiden $g_{85}$:n onnistunutta rakennetta.

### Taso 1: Halpa etuliiteskannaus (Karsinta)
- Käytetään sellaisenaan `morphism-scan.js`:n `survivingPrefix`-funktiota.
- Generoidaan kiintopistettä nopeasti pituuteen 1000.
- Vain yli 1000 selvinneet etenevät (karsinta, ei heuristiikka).

### Taso 2: Ominaisarvo-portti (Prop 9 -edellytys)
- Ancestor Boxin äärellisyys vaatii, ettei $M_h$:lla ole itseisarvoltaan 1 olevia ominaisarvoja.
- Lasketaan $\det(xI - M_h)$ (`decision-preconditions.js`:n rutiineilla).
- Jos polynomilla on juuria yksikköympyrällä, merkitään: **EI PÄÄTETTÄVISSÄ** ja ohitetaan.

### Taso 3: Täysi päätös (CEGIS-moottori)
- Refaktoroidaan `decide-realizability.js`:n ydin riippumattomaksi $h_6$:sta (esim. uuteen tiedostoon `src/decide-arbitrary-realizability.js` varotoimena).
- Rakennetaan $Anc_h(t_0)$ ja haetaan toteutuma pituuteen $s = \Delta + 2\delta + 3$ asti.
- **Vastaesimerkki:** Konkreettinen saumarikkomus $(h(x), h(y))$ tallennetaan *sound*-karsintasääntönä. Parikh-erotuksen yleistäminen merkitään tiukasti vain *heuristiikaksi* generaattorille.
- **Puhdas todistus:** Nostetaan hälytys, ajetaan riippumaton testi, vaaditaan ihmisen hyväksyntä.

### Validointivaatimus
- Ennen täyttä ajoa CEGIS-silmukka on **pakko** testata jollakin tunnetusti kaatuvalla (tai säännöllisellä) pikkuesimerkillä, jolla on *eri Jordan-rakenne* kuin $h_6$:lla, jotta varmistutaan yleistetyn matriisilaskennan kestävyydestä.
