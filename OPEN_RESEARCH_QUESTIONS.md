# Avoimet tutkimuskysymykset

**Päivitetty:** 2026-07-29
**Tarkoitus:** erottaa toisistaan (A) alan aidot avoimet ongelmat lähteineen, (B) projektin omat kysymykset jotka ovat oikeasti laskettavissa, ja (C) kysymykset jotka *kuulostavat* tutkimukselta mutta mittaavat toteutusta eivätkä matematiikkaa.

Tämä dokumentti noudattaa `AGENTS.md`:n sääntöä 7: mikään "löydös" ei esiinny tässä ilman vastaavaa riviä `MATH_CLAIMS.md`:ssä. Kysymykset saavat esiintyä — vastaukset eivät.

---

## A. Kirjallisuuden avoimet ongelmat

Nämä ovat lähteistettyjä ja auki. Sitaatit luettu ar5iv-renderöinnistä 2026-07-28.

### A1. Mäkelän konjektuuri — projektin päätavoite

> *"There exists an infinite ternary word whose only abelian squares are 00, 11, 22."*
> — Fici & Puzynina (2023), arXiv:2207.09937, **Conjecture 20**

Ekvivalentisti (Rao & Rosenfeld, arXiv:1511.05875, **Problem 1**): *"Can you avoid abelian squares of the form uv where |u| ≥ 2 over three letters?"*

**Tila:** auki puolipituuksille K = 2…5. K > 5 on ratkaistu myönteisesti (`MATH_CLAIMS.md` rivi 7).

**Miksi juuri 2…5 on auki — lähteistetty rakenteellinen syy.** Rao & Rosenfeldin päätösmenettely (§3) päättää abelin potenssien välttämisen **puhtaille morfisille sanoille kaikilla jaksoilla**. Morfisille **kuville** g(h^ω) se päättää vain **suuret** jaksot (Proposition 9). Ternäärisana saadaan tässä konstruktiossa vain projektiona 6-kirjaimisesta, ja projektio menettää päätettävyyden pienillä jaksoilla. Ks. `MATH_CLAIMS.md` rivi 7b.

**Mitä tämä tarkoittaa hyökkäyssuunnalle:** reitti ei ole "etsi pidempiä sanoja". Pisimmät tunnetut aa2f-sanat ovat 25 379 merkkiä, ja mikä tahansa äärellinen sana on äärellinen havainto. Reitit: (a) ternäärimorfismi jonka *kiintopiste* — ei projektio — välttää jaksot ≥ 2, jolloin §3:n menettely pätee suoraan; (b) päätösmenettelyn laajennus pieniin jaksoihin projektioille; tai (c) pidä h₆^ω(a) kiinteänä ja varioi siihen sovellettavaa morfismia g — Theorem 4 (rivi 32) kantaa pohjasanan, ja kullekin kandidaatille pienet jaksot ovat rajoitetun pituisia tekijöitä ja suuret jaksot Prop 9:n aluetta (`decision-preconditions.js`). Reitin (c) uniformi kerros L ≤ 5 on lakaistu tyhjentävästi ja se on tyhjä (`MATH_CLAIMS.md` rivi 49, B5 alla); jäljellä ovat L ≥ 6, epäuniformit kuvaukset ja CEGIS-ohjattu haku (E2).

### A2. Abelin toistokynnys (abelian repetition threshold)

> *"The authors found lower and upper bounds for abelian repetition thresholds, some of which are conjectured to be tight."*
> — Fici & Puzynina (2023), arXiv:2207.09937

**Tila:** osittain auki. Ala on olemassa ja nimetty; sitä ei tarvitse keksiä uudelleen, mutta siinä on aitoja rakoja.

**Huom.** Tavallinen (ei-abelin) **Dejeanin konjektuuri on todistettu**, ei auki:

> *"The famous Dejean's conjecture dating back to 1972 stated that RT(3) = 7/4, RT(4) = 7/5, and RT(d) = d/(d−1) for every d > 5. The conjecture has been proved in a series of papers — the last cases have been proved independently by Rampersad and Currie, and Rao."*

Mikä tahansa suunnitelma joka lupaa "löytää RT(n)-arvoja" nojaa vanhentuneeseen tietoon. Abelin versio on eri asia ja se on osin auki.

### A3. k-abelinen hierarkia — lähin ratkaistu naapuri

> *"One can avoid 3-abelian-squares of period at least 3 in infinite binary words, **2-abelian-squares of period at least 2 in infinite ternary words**, and 2-abelian squares of period more than 63 in infinite binary words."*
> — Fici & Puzynina (2023), **Theorem 65**

Keskimmäinen kohta on **täsmälleen A1** abelisen ekvivalenssin korvattuna 2-abelisella — ja se on **ratkaistu myönteisesti**. Tämä on ainoa tunnettu tapa mitata *kuinka paljon* ekvivalenssin vahvistaminen ostaa. Projektissa ei ole k-abelista moduulia.

### A4. Epäsuotuisat tekijät — yksisuuntainen jatkettavuus

> *"…an unfavourable a-2-free word cannot be continued infinitely long to the left and to the right without necessarily creating an abelian square at some point. **However, it might well be possible to extend such a word boundlessly to one direction, say to the right, without producing any abelian squares. Experiments support this conjecture but the existence of such unfavourable factors remains an open question.**"*
> — V. Keränen, *"Suppression of Unfavourable Factors in Pattern Avoidance"*, International Mathematica Symposium, Avignon, 2006

**Kysymys:** onko olemassa a-2-vapaata sanaa, joka voidaan jatkaa rajattomasti oikealle mutta joka ei silti esiinny minkään äärettömän a-2-vapaan sanan aitona tekijänä?

**Miksi tämä on projektille poikkeuksellisen sopiva:** se on Rauzy-graafin kysymys, ja koneisto on olemassa (`rauzy-graph.js`). Sana on rajattomasti oikealle jatkettavissa täsmälleen silloin kun se on graafissa äärettömällä polulla — eli kun siitä pääsee johonkin sykliin. Sana on epäsuotuisa jos se ei ole millään **molempiin suuntiin** äärettömällä polulla. Erotus näiden kahden joukon välillä on juuri se mitä Keränen kysyy, ja se on äärellisesti laskettavissa kullekin pituudelle.

**Varaus:** Keräsen kysymys koskee neljää kirjainta (Σ₄) ja täyttä a-2-vapautta. Projektin rivin 35 mittaus koskee kolmea kirjainta ja aa2f-ehtoa, eikä se ole sama asia. Ks. `MATH_CLAIMS.md` rivi 38 — rivin 35 umpikujaluvut **eivät** ole epäsuotuisien tekijöiden lukumääriä.

### A5. Jäljittämätön: minimimäärä eri 2-abelin neliöitä binäärisanassa

Keskustelussa on esiintynyt väite *"5 ≤ g(2) ≤ 734"* Rosenfeldin väitöskirjan Problem 4.9:nä. **Lukua 734 eikä merkintää g(2) ei löydy Fici & Puzyninan katsauksesta**, eikä väitöskirjaa ole avattu projektissa. Väite on **jäljittämätön** eikä sitä saa käyttää ennen kuin joku lukee alkuperäisen. Jos se pitää paikkansa, se on houkutteleva kohde: binäärinen hakuavaruus on pienempi kuin ternäärinen ja nykyiset työkalut siirtyisivät lähes suoraan.

### A6. Additiiviset neliöt: onko ℤ uniformisti 2-repetitiivinen? (jäljitetty 2026-07-30)

> *"A long standing question asks whether ℤ is uniformly 2-repetitive [Justin 1972, Pirillo and Varricchio, 1994]"*
> — Rao & Rosenfeld, arXiv:1511.05875, abstrakti (avattu 2026-07-30)

Eli: onko olemassa ääretön jono äärellisen ℤ:n osajoukon yli, joka välttää kaksi peräkkäistä yhtä pitkää lohkoa samalla summalla (additiiviset neliöt)? **Avoin** ainakin lähteen päiväyksen mukaan. Tunnettu ympäristö:

- **Kuutiot ratkaistu:** *"there exists an infinite word over the alphabet {0, 1, 3, 4} containing no three consecutive blocks of the same size and the same sum"* — Cassaigne, Currie, Schaeffer & Shallit, arXiv:1106.5204, abstrakti (avattu 2026-07-30). Sama abstrakti: *"This answers an open problem of Pirillo and Varricchio from 1994."* Koko tekstistä (ar5iv, 2026-07-30): neliökysymyksen esittivät Halbeisen & Hungerbühler (2000): *"They asked (in our terminology) if it is possible to avoid additive squares."*
- **ℤ² ratkaistu — ja ratkaisu on projektin ydinlähde:** arXiv:1511.05875:n varsinainen otsikko on *"Avoiding two consecutive blocks of same size and same sum over ℤ²"*, päätulos *"ℤ² is not uniformly 2-repetitive"*, ja abstrakti kytkee sen suoraan projektin pääongelmaan: *"this problem is related to a question from Mäkelä in combinatorics on words and we answer to a weak version of it."* **Projektin templaatti/esivanhempikoneisto on siis alun perin rakennettu juuri additiivisten neliöiden ongelmaa varten** — additiivinen instanssi (`SANALAB_PLAN.md`) ei ole naapuri vaan paluu ydinlähteen emo-ongelmaan.

**Projektin tila:** aakkostolakaisu on olemassa (`additive-sweep.js`) ja ensimmäiset tulokset ovat rivillä **54**; jatkokysymykset **B9** alla.

Ks. `MATH_CLAIMS.md` rivi 53. Sekundäärihavainto ilman avattua lähdettä (EI saa käyttää ennen jäljitystä): hakutulosteessa esiintyi Freedmanin nimiin laitettu väite 4-kirjaimisista aakkostoista a+d=b+c ja pituusrajasta ≤ 60, sekä tuore variaatiopaperi arXiv:2506.21200 (2025) — jälkimmäinen viittaa pääkysymyksen olleen auki vielä 2025, mutta kumpaakaan ei ole avattu.

### A7. Avattavat lähteet, ml. muunkieliset (jäljitysjono, 2026-07-30)

Alan kirjallisuus on **valtaosin englanniksi**, mutta ei kokonaan — ja juuri nyt kriittisen polun kärki on ranskaksi. Jono avattavista lähteistä, tärkein ensin. Kaikki tunnisteet luettu Fici & Puzyninan (2023) lähdeluettelosta 2026-07-30 (ks. `MATH_CLAIMS.md` rivi 58).

| # | Lähde | Kieli | Miksi |
|---|---|---|---|
| 1 | ~~F. Lietard, M. Rosenfeld. *Avoidability of additive cubes over alphabets of four numbers.* DLT 2020~~ **AVATTU 2026-07-30** (avoin preprint `lirmm.fr/~mrosenfeld/LieRos.pdf`; DOI `10.1007/978-3-030-48516-0_15`) | englanti | **Suljettu, ks. rivi 63.** Koskee kuutioita; toteaa neliökysymyksen avoimeksi (Question 3); ei sisällä neliöiden aakkostoluokittelua. Rivi 54 ei ole sen syrjäyttämä |
| 2 | ~~F. Lietard. *Évitabilité de puissances additives en combinatoire des mots.* Väitöskirja, Université de Lorraine, 2020~~ **AVATTU 2026-07-30** | **ranska** | **Suljettu, ks. rivi 65.** Ei sisällä neliöiden aakkostoluokittelua, mutta jäljitti Brown & Freedman 1987:n ja antoi sen väitteen muodon, jonka projektin data osin vahvistaa ja osin kumoaa |
| 3 | M. Rao. *On some generalizations of abelian power avoidability.* TCS 601:39–46, 2015 | englanti | Additiivisten kuutioiden minimiaakkostokoko 3 |
| 4 | Rosenfeldin väitöskirja | ranska (todennäköisesti) | A5:n jäljittämätön `g(2)`-väite |
| 5 | **T. C. Brown & A. R. Freedman, *"Arithmetic progressions in lacunary sets"*, Rocky Mountain J. Math. **17**(3):587–596, 1987** — viite jäljitetty 2026-07-30 | englanti | **Kriittisin avaamaton lähde.** Väitöskirjan mukaan he todistivat tasapainoisten aakkostojen tapauksen; projektin data vahvistaa kvalitatiivisen väitteen mutta kumoaa siteeratun vakion 50 (rivi 65). Vasta alkuperäinen kertoo kumpi muoto on heidän |

**Vastaus kysymykseen "pitäisikö etsiä muunkielisiä lähteitä":** kyllä, mutta ei laajana kartoituksena vaan **kohdennetusti sitaattiketjua seuraten**. Tämän alan ranskankielinen haara on aito (Dejeanin alkuperäinen työ, Lorrainen koulukunta), ja se löytyy englanninkielisten papereiden lähdeluetteloista — ei erillisellä kieliluotauksella. Venäjänkielisiä ja suomenkielisiä jälkiä on projektin historiassa (IAS Murmansk 2002, rivi 3), mutta niitä ei ole tarvittu koska englanninkieliset versiot ovat olemassa.

**Sääntö:** kieli ei ole peruste jättää lähde avaamatta. Sitaatti säilytetään alkukielellään ja käännös merkitään käännökseksi.

---

## B. Projektin omat kysymykset, jotka ovat oikeasti laskettavissa

Nämä eivät ole kirjallisuuden avoimia ongelmia. Ne ovat äärellisiä laskentatehtäviä joilla on yksikäsitteinen vastaus, ja projektin koneisto riittää niihin.

### B1. Onko FORBID4-joukko minimaalinen?

`{baac, caab, abbc, cbba, accb, bcca}` ei ole kirjallisuudesta — se on projektin oma (`MATH_CLAIMS.md` rivi 9). Kysymys **onko jokin aito osajoukko yhtä tehokas** on äärellinen: 2⁶ = 64 osajoukkoa, ja kullekin lasketaan tekijäkompleksisuus `factor-complexity.js`:n koneistolla. Vastaus on yksikäsitteinen luku, ei mielipide.

Tarkennus: "tehokkuus" on määriteltävä invariantilla. Kasvunopeuden yläraja (B2) käy; "kuinka pitkälle DFS pääsee" ei käy, koska se riippuu hakujärjestyksestä.

### B2. Aa2f-kielen kasvunopeus

Nykytila: **kasvunopeus ≤ 1,9915** (tiukka yläraja, `MATH_CLAIMS.md` rivi 33). Havaittu suhde on ~1,60, mutta sillä ei ole todistettua yhteyttä raja-arvoon. **Kuilu 1,60 ↔ 1,99 on auki.**

Kaventaminen ylhäältä vaatii suurempaa n:ää tai parempaa kuin Feketen argumenttia — tämä on aitoa inkrementaalista työtä, ja hajautettu eksakti p(n)-laskenta on siihen suora reitti (jokainen uusi p(n) on lauseen muotoinen yläraja, osio F).

**Kaventaminen alhaalta ei ole inkrementaalista työtä vaan koko konjektuuri:** Königin lemmalla mikä tahansa todistettu p(n) ≥ 1 kaikilla n on ekvivalentti äärettömän aa2f-sanan olemassaolon kanssa (`MATH_CLAIMS.md` rivi 50). Alarajatyö on siis konjektuurin todistusyritys eikä sitä saa aikatauluttaa "rajan kavennuksena".

### B3. Välttämättömät tekijät (unavoidable sets)

"Onko olemassa motiiveja joiden kautta kulkeminen johtaa aina umpikujaan" on kirjallisuudessa **unavoidable set** -käsite. Äärellisen joukon välttämättömyys on päätettävissä. Tämä on B1:n yleistys ja se kannattaa muotoilla sillä sanastolla, ei uudella.

### B4. Rauzy-graafit ja oikealle jatkuvuus

Tekijäkompleksisuuden p(n) erotukset p(n+1) − p(n) laskevat **oikealle erikoisten tekijöiden** lukumäärän. Tämä on kielen invariantti ja se selittää *missä* rajoite puree. g₃(h₆^ω(a)):lle erotukset ovat välillä 6…8 (`MATH_CLAIMS.md` rivi 28) — mutta niiden **rakenne** on tutkimatta.

### B5. Reitti (c): millä L:llä pieni ikkuna ja suuret jaksot lakkaavat sulkemasta toisensa pois?

`MATH_CLAIMS.md` rivi 49: uniformeilla kuvauksilla g: Σ₆ → Σ₃^L, L ≤ 5, [2,5]-välttäjiä on olemassa (35 / 685 / 7 019 luokkaa L = 3/4/5) mutta **jokainen niistä rikkoo K ∈ [6,100] viimeistään symbolissa 44** — ja kääntäen g₃ (L=10) välttää kaikki K ≥ 6 mutta osuu 34 neliöön pienillä. Kysymykset, jotka ovat äärellisiä ja invariantteja:

1. **Pienin L jolla jokin luokka selviää molemmista ikkunoista.** L = 6 on 3³⁶ kuvausta — ei enää naiivisti enumeroitavissa, mutta karsiva DFS voi silti kattaa sen (L=5 vaati 14,9 mrd symbolia; mittaa ennen kuin lupaat).
2. **Miksi [2,5]-välttäminen pakottaa g(a)=g(b):n L=3:lla (35/35) mutta ei enää L=4:llä (601/685)?** h₆:n kuvissa a→ace ja b→adf jakavat alkukirjaimen; onko selitys tässä vai muualla — laskettavissa tarkastelemalla missä kohdin rikkomukset syntyvät.
3. **Epäuniformi kerros:** pienin kokonaiskuvapituus |g(a)|+…+|g(f)| jolla molemmat ikkunat selviävät.

Selviytyjää **ei** saa kutsua kandidaatiksi ennen kuin molemmat ikkunat on tarkistettu JA Prop 9:n esiehdot (`decision-preconditions.js`) on ajettu parille (h₆, g).

### B6. K ∈ [2,5]-säiliökieli on äärellisen tyypin rajoite — sen rakenne on eksaktisti laskettavissa

Mäkelän avoin osa koskee puolipituuksia 2…5, ja abelin neliö puolipituudella ≤ 5 mahtuu 10 merkin ikkunaan. Kieli "vältä *vain* K ∈ [2,5]" on siis äärellisen ikkunan rajoite, ja jokainen Mäkelä-todistaja elää sen sisällä.

**Kysymykset 1–3 on laskettu** (`sft-container.js`, tulokset `MATH_CLAIMS.md` **rivi 51**): yksi ei-triviaali SCC (2 844 tilaa), kirjaintaajuudet välttämättä välissä [1/11, 3/4], binäärihäntää ei ole. Väli on leveä, joten sen karsintavoima E1-käytössä on vaatimatonta — se on silti ensimmäinen kaikkia hyökkäysreittejä koskeva välttämätön ehto.

**Auki jäävä jatko:**

1. ~~Kiristyvätkö välit kun rajoitteita lisätään?~~ **Laskettu K=6:lle** (`MATH_CLAIMS.md` rivi 52): väli **ei kiristy** — [1/11, 3/4] on stabiili 5 → 6 vaikka kieli aidosti kutistuu. Jatko K ∈ [2,7] (muisti 13) vaatii Howardin algoritmin: tilamäärä ylittää Karp-taulukon Int16-rajan. Eksaktiutta ei saa heikentää — liukulukuapproksimaatio kelpaa vain jos tulos verifioidaan rationaalisesti (rivin 51 Bellman–Ford-kuvio kantaa sellaisenaan).
2. **Missä stabiilius katkeaa?** Jaksollinen sana jaksolla p sisältää aina K=p-neliön, joten yksittäiset ääriarvosyklit kuolevat väistämättä ikkunan kasvaessa — stabiilius vaatii joka tasolle uusia, pidempiä syklejä samalla keskiarvolla. Pienin kmax jolla yläraja putoaa alle 3/4:n (tai alaraja nousee yli 1/11:n) on hyvin määritelty luku, ja jokainen taso on äärellinen lasku.
3. **SCC:n hienorakenne:** synkronoivat sanat, jaksollisuus (syt sykleistä), ja missä Keräsen sanan polku kulkee suhteessa SCC:n "reunoihin" (tiloihin joilla on vain yksi jatko).

Varaus: tämä on **relaksaation** analyysi. Se antaa välttämättömiä ehtoja, ei koskaan riittäviä (vrt. `NEGATIVE_RESULTS.md` §2: SCC ei todista ääretöntä aa2f-sanaa).

### B7. Säiliökielen välttämättömät tekijät — LASKETTU 2026-07-30, vastaus kielteinen (rivi 62)

**Kysymys:** mitkä tekijät (pituuteen 9 asti) esiintyvät jokaisessa äärettömässä [2,5]-vapaassa sanassa — siis jokaisessa mahdollisessa Mäkelä-todistajassa? "u on välttämätön" ⟺ säiliögraafi ilman u:n sisältäviä tiloja on syklitön; äärellinen tarkistus per tekijä (`sft-container.js`:n tilasuodatus + syklintunnistus, molemmat olemassa).

- **Validointi:** yksittäiskirjainten on tultava välttämättömiksi (yhtäpitävä rivin 51(b) binäärihäntätuloksen kanssa, eri koodipolku); ei-välttämättömälle tekijälle esitetään eksplisiittinen välttävä sykli.
- **Odotettu lokirivi:** *"Säiliökielen välttämättömät tekijät pituuteen ℓ asti ovat täsmälleen ⟨joukko⟩ (N kpl); jokainen Mäkelä-todistaja sisältää ne."*
- **Tappoehto:** ei tarvita — äärellinen lasku, yksikäsitteinen vastaus; myös "vain kirjaimet" kirjataan.
- **Työmäärä:** yksi sessio. **Vaikuttavuus 3–4.**

**Tulos (rivi 62): yksikään pituuden ≥ 2 tekijä ei ole välttämätön** — ei K ∈ [2,5]-säiliössä (1 016 luokkaa pituuksiin 9 asti) eikä K ∈ [2,6]-säiliössä (3 837 luokkaa pituuksiin 11 asti). Vain yksittäiset kirjaimet. Toivottua *"jokainen todistaja sisältää tekijän X"* -lausetta ei ole. **Kysymys on suljettu tässä ikkunassa.** Tämä on kolmas riippumaton mittaus samasta tosiasiasta: säiliö on löysä relaksaatio (vrt. rivit 51 ja 52). **Seuraus: säiliöstä ei kannata etsiä lisää välttämättömiä ehtoja.** Auki jää sama kysymys aa2f-kielelle itselleen, joka on säiliön aito osajoukko — siellä välttämättömiä tekijöitä voi yhä olla, mutta aa2f ei ole äärellisen tyypin kieli eikä tätä menetelmää voi soveltaa siihen suoraan.

### B9. Tasapainoiset aakkostot — miksi dikotomia on niin puhdas? (rivi 54)

Rivin 54 lakaisussa **jokainen** tasapainoinen aakkosto (muotoa {0, p, q, p+q}) tyhjeni, eikä yksikään ratkaisematon luokka ollut tasapainoinen. Kysymykset, jotka ovat äärellisiä ja invariantteja:

1. **Päteekö dikotomia laajemmalla spannilla?** Jokainen uusi span on äärellinen lasku samalla moduulilla. Ensimmäinen tasapainoinen luokka joka **ei** tyhjenny kumoaisi kuvion; ensimmäinen epätasapainoinen joka tyhjenee laajentaisi poikkeuslistaa ({0,1,2,4} on toistaiseksi ainoa).
2. **Onko 60 tasapainoisten katto?** Arvot kulkevat 50 → 55 → 58 → 60 kun (p,q) etääntyvät, ja pysähtyvät 60:een. Onko olemassa tasapainoinen aakkosto jonka pisin sana on > 60?
3. **Rakenteellinen selitysehdokas — testattava, ei oletettava.** Tasapainoinen aakkosto on summajoukko {0,p} + {0,q}, joten kirjain on p·x + q·y missä x,y ∈ {0,1}: aakkosto on {0,1}² ⊂ ℤ²:n projektio. Riittävän riippumattomilla p, q summat ovat yhtä suuret täsmälleen kun **molemmat binäärikoordinaatit** täsmäävät, jolloin additiivinen neliö ℤ-sanassa vastaa yhtäaikaista abelin neliötä kahdessa binääriprojektiossa. Tämä kytkeytyy suoraan riviin 53 (ℤ² ratkaistu). **Ennuste jonka voi kumota:** jos selitys pätee, tasapainoisen aakkoston tulos saa riippua vain siitä ovatko p ja q "riittävän riippumattomia", ei niiden koosta — ja (1,2):n poikkeava 50 selittyy sillä että q = 2p. Testattavissa vertaamalla luokkia joilla on sama riippuvuusrakenne mutta eri koko.

**Päivitys 2026-07-30 (rivi 66):** Freedmanin todistama yleinen raja (61, kaikille tasapainoisille eli Sidon-aakkostoille) selittää kohdan 2 kysymyksen tyhjentävästi kirjallisuuden puolelta — 60 on kirjallisuuden mukaan yleinen katto, ei pelkkä tämän projektin span≤8-havainto. Kohdat 1 ja 3 ovat silti auki: rakenteellinen selitys (kohta 3) on nyt testattavissa Freedmanin todistuksen menetelmää vasten, mikä on eri kysymys kuin lisää laskentaa.

### B10. Epäuniformi morfismihaku additiivisille neliöille — OSITTAIN LASKETTU 2026-07-30 (rivi 68)

**Kysymys:** onko olemassa epäuniformi morfismi jonka kiintopiste välttää additiiviset neliöt täydellisesti (kaikilla K ≥ 1) jollain epätasapainoisella nelikirjaimisella aakkostolla?

**Miksi juuri tämä, eikä lisää uniformia hakua:** `additive-morphism-scan.js` (rivi 67) tyhjensi uniformin tapauksen k ≤ 4:llä kuudella epätasapainoisella aakkostolla — negatiivisesti, mutta äärellisesti. Cassaigne et al. (2013) -konstruktio additiivisille **kuutioille** on todistetusti **epäuniformi** (φ_{a,b,c,d}: a→ac, b→dc, c→b, d→ab, pituudet 2,2,1,2), suoraan Lietard & Rosenfeldin preprintistä uutettuna. Tämä oli vahva ennakko-oletus siitä että uniformi olisi väärä hakuavaruus myös neliöille.

**Tulos (rivi 68):** `additive-nonuniform-morphism-scan.js` yleisti haun pituusprofiileihin (La,Lb,Lc,Ld) ∈ [1,4]⁴ (La ≥ 2), sisältäen Cassaigne-tyyppisen (2,2,1,2)-profiilin yhtenä 192:sta. Tyhjentävä ja negatiivinen neljällä aakkostolla ({0,1,2,5}, {0,1,6,8}, {0,3,4,8}, {0,2,4,7}), ~117 M morfismia per aakkosto. **Cassaigne-tyyppinen epäuniformisuus ei siis yksinään riitä** — ainakaan tässä ikkunassa.

**Loput 16 luokkaa ajettu 2026-07-30 (rivi 69):** kohta 2 alla on nyt suljettu. Kaikki 20 avointa epätasapainoista luokkaa on käyty läpi tällä moduulilla, tyhjentävästi ja negatiivisesti. **Tämä sulkee 4→4-morfismimuodon pituusprofiileihin 4 asti koko epätasapainoisella alueella**, ei enää vain neljällä otoksella.

**Auki jää:**
1. **Pidemmät profiilit** (maxlen > 4) — kustannus kasvaa nopeasti, mittaa ennen lupaamista. **Tappoehto §14 on nyt laukennut kahdesti:** 20/20 luokkaa negatiivisia ilman signaalia. Älä syvennä samaa hakua ilman uutta rakenteellista ideaa.
2. ~~16 muuta epätasapainoista luokkaa~~ — **tehty 2026-07-30, rivi 69.**
3. **Rakenteellisesti erilaiset konstruktiot** — Cassaignen oma φ_{a,b,c,d} on määritelty ℂ:n yli eikä rajattu neljään kiinteään symboliin samalla tavalla kuin tämä haku; mahdollisesti tarvitaan muu morfismimuoto kokonaan (esim. useampikirjaiminen aputila, kuten h₆→g₃-konstruktio abelin puolella). **Nostettu omaksi kohdakseen B13**, koska kahden negatiivisen kierroksen jälkeen todennäköisin selitys ei ole "morfismeja ei ole" vaan "hakuavaruus on väärän muotoinen".
- **Validointi:** kolmikerroksinen kuvio täyttyi — regressiokontrolli uniformiin tapaukseen (`additive-morphism-scan.js`) on riippumaton todiste yleistyksen oikeellisuudesta.
- **Tappoehto seuraavalle syvennykselle:** ei signaalia kohtuullisella budjetilla ilman uutta rakenteellista ideaa — sama kriteeri kuin `NEGATIVE_RESULTS.md` §1:ssä ja nyt myös §14:ssä.
- **Vaikuttavuus, jos joskus onnistuu:** hyvin korkea — vastaisi myöntävästi Question 3:een (rivi 63/66: *"Is there any finite alphabet of integers over which additive squares are avoidable?"*), joka on ollut avoin ainakin vuodesta 1987.

### B11. Additiivisen ehdon päätösmenettely — kone osaa vain kumota, ei koskaan vahvistaa (RESEARCH_ARCHITECT-ajo 2026-07-30)

**Kysymys:** onko olemassa **äärellinen** kriteeri joka ratkaisee, välttääkö annetun morfismin kiintopiste additiiviset neliöt kaikilla K ≥ 1 — additiivinen vastine sille mitä `decide-realizability.js` ja Theorem 4/6 (rivit 32, 46) tekevät abelin puolella?

**Miksi tämä on koko koneiston tärkein aukko, eikä yksi ominaisuus muiden joukossa.** `additive-nonuniform-morphism-scan.js` sanoo sen omassa tulosteessaan: *"This is BOUNDED EVIDENCE, not a proof of an infinite fixed point — no exact decision procedure exists yet for the additive condition."* Seuraus, jota ei ole aiemmin kirjattu: **jos rivien 68–69 lakaisu olisi löytänyt selviytyjän, projekti ei olisi osannut todeta sitä oikeaksi.** Se olisi voinut vain nostaa etuliitekattoa. Kone kerää kielteisiä tuloksia mielivaltaisen pitkälle mutta ei voi tuottaa myönteistä — ja Question 3 (rivi 63) on **eksistenssikysymys**. Tässä muodossa laboratorio ei voi periaatteessakaan ratkaista sitä ongelmaa jonka se on ottanut tavoitteekseen.

**Miksi tämä on uskottava eikä toiveajattelu:** additiivinen ekvivalenssi on Parikh-vektorin **lineaarinen funktionaali** (alkioiden painotettu summa), joten sauman ylittävän additiivisen neliön tila on pari (pituusero, summaero) — kaksiulotteinen kokonaislukuhila. Se on samaa muotoa kuin Rao & Rosenfeldin Proposition 5/6 -rajat, ja projektissa on jo `perron-frobenius.js`, `smith-normal-form.js` ja `ancestor-box.js` jotka laskevat juuri sellaisia rajoja. Kyse on olemassa olevan koneiston siirrosta uuteen ekvivalenssirelaatioon.

- **Kytkentä koneistoon:** `perron-frobenius.js` (summan kasvu = insidenssimatriisin spektri), `ancestor-box.js` (laatikon muoto), `decide-realizability.js` (päätösrunko). Puuttuu: summaeron raja ja sen todistus.
- **Validointi:** positiivinen kontrolli = menettelyn on annettava **kielteinen** verdikti jokaiselle riveillä 67–69 tyhjentävästi hylätylle morfismille (yhteensä yli 2·10⁹ morfismia, jokainen tunnettu vastaus); negatiivinen kontrolli = tarkoituksella rikottu morfismi jonka kiintopisteessä on tunnettu additiivinen neliö; ristiintarkistus = menettelyn verdikti vs. raaka etuliiteajo katolle 10⁴.
- **Odotettu lokirivi:** *"Additiivisen ehdon päätösmenettely johdettu k-uniformeille morfismeille: summaero sauman yli on rajattu arvolla ⟨B⟩, joten tarkistus on äärellinen ja kattaa kaikki K ≥ 1. Verifioitu N morfismilla joilla vastaus tunnettiin ennalta."* — `COMPUTED` (Level 1), tai `PRIMARY` jos raja johdetaan julkaistusta lauseesta.
- **Tappoehto:** jos summaeron kasvua **ei** saada rajattua insidenssimatriisin spektristä, laatikko on ääretön eikä menettelyä ole tässä muodossa. **Tämä nähdään ensimmäisestä johdosta, ei ajosta** — eli tappoehto laukeaa paperilla tuntien, ei viikkojen sisällä.
- **Työmäärä:** esimittaus = johda raja **yhdelle** 2-uniformille morfismille käsin ja vertaa `ancestor-box.js`:n antamaan abelin laatikkoon. Vasta jos se toimii, yleistä. **Vaikuttavuus 5.**

**ESIMITTAUS TEHTY 2026-07-30 (rivi 71) — reitti on olemassa mutta kapea, ja tulos kääntää abelin puolen intuition päinvastaiseksi.**

Hypoteesin muoto siirtyy: `ker Φ` korvautuu hypertasolla `ker(v^T)`, jonka ulottuvuus on 3, joten nollaleikkaus pakottaa **dim im(Mⁿ) ≤ 1**. Mitattu tyhjentävästi: k=2 → 6,46 %, k=3 → 2,12 %, k=4 → **0,87 %** hakuavaruudesta.

**Rakenteellinen havainto joka on tämän esimittauksen tärkein anti:** abelin puolella kuvien identtiset Parikh-vektorit ovat se ominaisuus joka *kantaa* konstruktion (Keräsen g₈₅, rivi 3). Additiivisella puolella **sama ominaisuus tappaa morfismin välittömästi** — samat kuvasummat tarkoittavat että mitkä tahansa kaksi vierekkäistä kokonaista lohkoa muodostavat additiivisen neliön puolipituudella k, ilman hakua. **Se mikä kantaa abelin ratkaisun estää additiivisen.** Tämä on yksi selitys sille miksi rivit 67–69 ovat kauttaaltaan kielteisiä, eikä sitä ollut aiemmin kirjattu.

**Seuraus B11:n arvolle, rehellisesti:** menettely ei toisi mitään uutta k ≤ 4:lle, koska luettelu on siellä jo tyhjentävä (rivit 67–69). **Koko arvo on siinä että se skaalautuu k:hon jossa luettelu ei skaalaudu**, ja rank-1 + pareittain eri kuvasummat -suodatin leikkaa avaruuden 0,08 %:iin — juuri niin pieneksi että suurempi k on mahdollinen. **Varsinainen tappoehto on yhä auki:** itse rajaa (summaeron äärellisyyttä) ei ole johdettu, vain hypoteesin muoto ja kattavuus. Se on seuraava askel, ja se ratkeaa paperilla.

### B12. Question 3 on eksistenssikysymys — kohde on ollut väärinpäin (RESEARCH_ARCHITECT-ajo 2026-07-30)

**Kysymys:** onko olemassa **jokin** äärellinen kokonaislukuaakkosto jolla additiiviset neliöt ovat vältettävissä — ja jos on, miksi sitä etsitään aakkostokoosta jossa välttäminen on vaikeinta?

**Havainto joka motivoi tämän.** Rivi 63 lainaa Question 3:a sanatarkasti: *"Is there any finite alphabet of integers over which additive squares are avoidable?"* — **mikä tahansa** äärellinen aakkosto kelpaa, ja useampi kirjain tekee välttämisestä helpompaa. Projekti on silti käyttänyt koko laskentabudjettinsa **neljään** kirjaimeen, jossa tasapainoiset luokat ovat Brown & Freedmanin nojalla äärellisiä (rivit 65–66) ja loputkin näyttävät kuolevan (rivit 54, 64, 67, 69). Se on vaikein tapaus, ja tulokset ovat siksi olleet kielteisiä.

**Kaksi rajausta jotka osoittautuivat valinnoiksi eivätkä rajoiksi** (mitattu 2026-07-30, rivi 70):
1. `additive-sweep.js` **tukee jo useampaa kirjainta** — `canonicalAlphabets(5, 8)` antaa 37 affiiniluokkaa. Parametri on olemassa eikä sitä ole kertaakaan käännetty. Morfismiskannerit on kovakoodattu neljään yhdellä rivillä (`length !== 4`).
2. Span ≤ 8 antaa neljällä kirjaimella 31 luokkaa; **span ≤ 10 antaa 62.** Puolet neljänkin kirjaimen avaruudesta on lakaisematta, eikä rajaa 8 ole perusteltu missään dokumentissa.

- **Validointi:** affiini-invarianssi ja todistuskappaleen tarkistus määritelmästä pätevät sellaisenaan viiteen kirjaimeen (`verdictFor`:n omat kerrokset); positiivinen kontrolli = nelikirjaimisten tunnettujen luokkien on toistuttava täsmälleen kun sama koodi ajetaan `letters = 4`:llä.
- **Odotettu lokirivi:** *"Viisikirjaimiset aakkostot, span ≤ ⟨s⟩, ⟨n⟩ affiiniluokkaa lakaistu: ⟨e⟩ luokan kieli on äärellinen, ⟨o⟩ jäi auki budjetilla ⟨b⟩ solmua, pisin verifioitu sana ⟨L⟩. Mitään ei väitetä alarajojen yli."* — `COMPUTED` (Level 1).
- **Tappoehto:** jos viisikirjaimiset luokat käyttäytyvät laadullisesti samoin kuin nelikirjaimiset (kielet tyhjenevät saavutettavilla budjeteilla), aakkostokoko ei ole se muuttuja joka ratkaisee, ja linja lopetetaan — **eikä sitä korvata alarajojen jahtaamisella** (`NEGATIVE_RESULTS.md` §2: mikään DFS-alaraja ei todista äärettömyyttä).
- **Rehellinen vastaväite, kirjattuna tähän ettei se unohdu:** pidempi sana isommalla aakkostolla ei ole "ennätys" missään mielekkäässä mielessä. Tämän arvo **ei ole alarajassa** vaan siinä että viisi kirjainta on se paikka jossa **B11:n sertifioijalla on realistinen mahdollisuus saada jotain sertifioitavaa**. B11 ja B12 ovat sama työ eri päistä; kumpikaan ei kanna yksin.
- **Työmäärä:** parametrin kääntäminen, esimittaus tehty (rivi 70). **Vaikuttavuus 5**, kustannus lähellä nollaa.

### B13. Apuaakkostoreitti — se morfismimuoto joka abelin puolella oikeasti toimi (RESEARCH_ARCHITECT-ajo 2026-07-30)

**Kysymys:** onko olemassa morfismi **suuremman apuaakkoston** yli, jonka kiintopisteen projektio nelikirjaimiseen kokonaislukuaakkostoon välttää additiiviset neliöt — eli additiivinen vastine h₆ → g₃ -konstruktiolle?

**Miksi juuri nyt.** Abelin puolella ratkaisu ei ole 4→4-morfismi: Rao & Rosenfeldin konstruktio on **h₆ kuudella kirjaimella, projisoituna g₃:lla kolmeen** (rivi 49:n koko koneisto). Additiivisella puolella on haettu vain muotoa 4→4, ja se on nyt suljettu kahdesti: uniformisti k ≤ 4 (rivi 67) ja epäuniformisti profiileihin 4 asti kaikilla 20 avoimella luokalla (rivit 68–69). **Kahden tyhjentävän kielteisen kierroksen jälkeen todennäköisin selitys ei ole "morfismeja ei ole" vaan "hakuavaruus on väärän muotoinen"** — sama virhepäätelmä tehtiin kerran jo uniformilla haulla ennen riviä 68, ja kolmas kerta olisi ennustettavissa.

- **Kytkentä koneistoon:** `h6-image-sweep.js` tekee jo täsmälleen tämän muotoisen lakaisun abelin puolella (uniformit kuvat Σ₆ → Σ₃^L); rakenne siirtyy, arvofunktio vaihtuu.
- **Odotettu lokirivi:** *"Apuaakkosto Σ_m → nelikirjaiminen kokonaislukuaakkosto, kuvapituudet L ≤ ⟨L⟩: yksikään projektio ei tuota additiivisesti neliötöntä kiintopistettä / ehdokas löytyi ja se on ⟨…⟩."* — `COMPUTED` (Level 1).
- **Tappoehto:** jos apuaakkoston kasvattaminen m = 5 → 6 ei muuta selviytyneen etuliitteen jakaumaa lainkaan, muoto ei ole ongelma ja hypoteesi on väärä.
- **Työmäärä:** esimittaus = m = 5, L ≤ 2 symbolimäärän mittaus ennen kuin L = 3 luvataan (sama kuvio kuin rivillä 49). **Vaikuttavuus 4.**

### B8. Taajuusmonikulmio — yhteisjakauma laatikon sijaan (RESEARCH_ARCHITECT-ajo 2026-07-30)

**Kysymys:** mikä on säiliökielen saavutettavien taajuusvektorien (f_a, f_b, f_c) tarkka monikulmio simpleksissä? Rivit 51–52 antavat vain laatikon [1/11, 3/4]³; monikulmio kertoo esim. voiko f_a = 3/4 esiintyä yhtä aikaa f_b = 1/11:n kanssa. Menetelmä: suuntaparametrisoitu Karp (lineaarifunktionaalin max-syklikeskiarvo = tukisuora); äärellinen suuntajoukko antaa ulkoapproksimaation joka on jo sellaisenaan pätevä välttämätön ehto, saavuttavat syklit sisäpisteet.

- **Validointi:** projektioiden on toistettava [1/11, 3/4] täsmälleen; S₃-invarianssi koordinaattipermutaatioissa; jokainen kärki Bellman–Ford-verifioitu (rivin 51 kuvio).
- **Odotettu lokirivi:** *"K ∈ [2,5]-säiliön taajuusmonikulmio on täsmälleen ⟨kärjet⟩; se on / ei ole aidosti pienempi kuin laatikon ja simpleksin leikkaus."*
- **Tappoehto:** jos monikulmio ≈ laatikko ∩ simpleksi, kirjataan negatiivisena ja linja lopetetaan.
- **Työmäärä:** 1–2 sessiota; esimittaus kolmella suunnalla. **Vaikuttavuus 3–4.**

---

## C. Kysymykset jotka mittaavat toteutusta, eivät matematiikkaa

Nämä on kirjattu tänne siksi, että ne toistuvat suunnitelmissa ja kuulostavat tieteeltä. Ne eivät ole invariantteja: vaihda kirjainten preferenssijärjestys tai hakustrategia, ja kaikki luvut muuttuvat.

| Muotoilu joka ei kanna | Mitä se oikeasti mittaa | Invariantti vastine |
|---|---|---|
| Hakupuun geometria, tunnelit ja kammiot | DFS:n läpikäyntijärjestystä | Rauzy-graafi (B4) |
| Faasimuutos haussa | milloin *tämä* haku hidastuu | kompleksisuuden kasvu p(n) |
| Selviytymisfunktio S(suffix) | valitun hakujärjestyksen kuolleisuutta | oikealle jatkuvien tekijöiden osuus |
| Entropia H(d) syvyydellä d | haaraantumista *tässä* puussa | kasvunopeus (B2) |
| Search ecology, moottoritiet, magneetit | sama kuin yllä, metaforisesti | — |
| Onko sanoilla "DNA" | tasaista jakaumaa ikkunoissa | tasainen rekurrenssi, tunnettu ominaisuus primitiivisille substituutioille |

Projekti on törmännyt tähän kerran aiemmin ja nimennyt tilastomoduulit uudelleen "hakukarsintaheuristiikoiksi" juuri tästä syystä. Sama erottelu pätee näihin.

**Tämä ei tarkoita etteikö telemetriaa saisi kerätä.** Se tarkoittaa ettei sen tuloksia saa esittää kielen ominaisuuksina.

---

## D. Arvioidut ja hylätyt ideat

Kirjataan näkyviin, jotta niitä ei ehdoteta uudelleen ilman uutta perustelua.

| Idea | Miksi hylätty |
|---|---|
| Hyperbolinen Parikh-avaruus | Parikh-vektorin koko teho on additiivisuus Ψ(uv) = Ψ(u) + Ψ(v). Käyristetyssä avaruudessa sitä ei ole. |
| Spektraalikuilu morfismin **oikeellisuuden** ennustajana | Insidenssimatriisi kadottaa kirjainten järjestyksen kuvan sisällä. Kaksi morfismia samalla matriisilla voivat käyttäytyä täysin eri tavalla jaksoilla K = 2…5. **Voi silti kelvata kustannusarviona**, ks. E1. |
| QBF morfismihakuun ennen äärellistä kriteeriä | Vaatii äärettömän ehdon kääntämisen äärelliseksi — ja juuri se käännös **on** vaikea matemaattinen sisältö. Ratkaisija ei tee sitä puolestasi. Vasta äärellisen kriteerin jälkeen mielekäs. |
| "Murtolukuresonanssi" Dejeanin arvojen löytämiseen | Dejean on todistettu, ks. A2. Arvoja ei etsitä. |
| SAT-backbone ternäärihaulle | Kieli on suljettu S₃-permutaation suhteen, joten mikään positio ei voi olla pakotettu tiettyyn kirjaimeen kaikissa ratkaisuissa — **backbone on tyhjä symmetrian nojalla**. Mielekäs vasta kun etuliite on kiinnitetty, jolloin se on eri kysymys. |
| SWAR-bittipakkaus 64-bittiin JavaScriptissä | JS:n bittioperaattorit ovat 32-bittisiä; 64-bittinen SWAR vaatisi BigIntin (hidas) tai kahden puolikkaan käsinhallinnan. Lisäksi pullonkaula ei ole Parikh-vertailu — eksaktit skriptit ajavat sekunneissa. Idea on pätevä C:ssä, ei tässä. |
| Holografia, Navier-Stokes, Gödel-itseviittaus, SETI, kvanttilomittuminen | Ei koodattavaa ydintä. Aperiodisten laatoitusten ja substituutioiden yhteys on aito, mutta projektissa jo olemassa (Rauzy-projektio). |

---

## E. Jalostetut ideat, jotka kestävät tarkastelun

### E1. Verifiointikustannustietoinen priorisointi

Spektraalikuilu ei kerro onko morfismi oikea, mutta se kertoo **kuinka kalliiksi sen tarkistaminen tulee**: Proposition 5:n ja 6:n rajat — ja siten esivanhempilaatikon koko — riippuvat suoraan ominaisarvojen sijainnista. Jos ehdokasmorfismeja on jono, laatikon koon *arvioiminen* etukäteen järjestää jonon halvimmasta kalleimpaan.

Tämä ei muuta yhdenkään todistuksen validiteettia. Se on aikataulutusheuristiikka, ja se on ainoa rooli jossa spektraalikuilu on puolustettavissa.

**Projektissa on jo tähän tarvittava:** `ancestor-box.js` laskee laatikon koon eksaktisti, joten "arviota" voi kalibroida oikeita lukuja vastaan.

### E2. CEGIS oikealla nimellä

"MUS-ohjattu mutaatio" on **CEGIS** (Counter-Example-Guided Inductive Synthesis, Solar-Lezama ym. 2006). Nimen käyttäminen ei ole pedanteriaa: se antaa valmiin kirjallisuuden konvergenssiehdoista ja tunnetuista epäonnistumismoodeista sen sijaan että metodologia keksitään tyhjästä.

**Edellytys:** vaatii äärellisen verifioijan. Projektissa on nyt sellainen (`decide-realizability.js`, `MATH_CLAIMS.md` rivi 32) — mutta se pätee *puhtaille morfisille sanoille*. CEGIS-silmukka kannattaa siis rakentaa **ternäärimorfismien kiintopisteille**, ei projektioille. Se on samalla A1:n reitti (a).

### E3. Geneettisen haun sileämpi kelpoisuusfunktio

Yhden kirjaimen vaihto morfismissa voi romahduttaa tuloksen epäjatkuvasti, mikä on huono maisema populaatiomenetelmille. Jos GA:ta kokeillaan, kelpoisuusfunktion on mitattava jotain jatkuvampaa kuin "kuinka pitkälle selviää" — esimerkiksi kiintopisteen tekijäkompleksisuuden kasvua, joka on jo laskettavissa.

### E4. Riippumaton toinen verifiointimoottori (jäljittämätön johtolanka — selvitettävä ennen käyttöä)

Kaikki projektin Level 1 -laskennat on tähän asti verifioinut sama koodipohja; ainoa riippumaton vertailu on R&R:n C++-referenssi (rivi 22) ja suunniteltu ACR 2004 -replikaatio (rivi 48). h₆ on 3-uniformi, joten konstruktio elää automaattisten sanojen maailmassa, ja siellä on olemassa työkaluperhe (Walnut, Shallit ym.) jolla eräitä sanojen ominaisuuksia on päätetty koneellisesti. **Jäljittämätöntä:** kattaako se abelin ominaisuuksia tässä tarvittavassa muodossa — Parikh-vertailut eivät ole ensimmäisen kertaluvun ominaisuuksia, ja mahdollinen reitti kulkee synkronoitujen jonojen kautta. Kukaan ei ole avannut lähteitä. **Älä siteeraa äläkä rakenna tämän varaan ennen kuin joku lukee alkuperäiset** (sama sääntö kuin A5:ssä). Jos kattavuus varmistuu, tämä olisi kokonaan riippumaton toinen moottori Theorem 9 -tyyppisille väitteille — laboratoriolaitteelle arvokkaampaa kuin yksikään uusi ominaisuus.

### E5. Puhdashuonereplikaatio toisella kielellä (RESEARCH_ARCHITECT-ajo 2026-07-30)

Kaikki Level 1 -rivit nojaavat samaan JS-koodipohjaan. Halvin tapa nostaa koko lokin uskottavuutta: replikoi kanoniset luvut (18 sanaa pituudella 7, 34 neliötä, 3 114 tilaa, [1/11, 3/4]) riippumattomalla toteutuksella (esim. Python), **väitelokirivin sanamuodosta, ei koodia lukemalla** (clean room). Eromitta on täsmälleen nolla tai rivi avataan uudelleen — poikkeama olisi arvokkain mahdollinen tulos, ei epäonnistuminen. "Replikoitu riippumattomasti" -merkintä lokiin on skeemamuutos → ylläpitäjän päätös (sääntö 5). Työmäärä: yksi sessio 4–5 luvulle. Vaikuttavuus 4 (kyvykkyysluokka: replikaatio).

### E6. Additiiviset neliöt laskentakoneen toiseksi instanssiksi — JÄLJITETTY 2026-07-30 → osio A6

Johtolanka jäljitettiin ja se osoittautui vahvemmaksi kuin muistikuva: additiivisten neliöiden avoimuus ℤ:ssa, kuutioiden ratkaisu {0,1,3,4}:llä JA se että **projektin oma ydinlähde arXiv:1511.05875 on juuri tämän ongelman ℤ²-ratkaisu** — sitaatit ja päiväykset osiossa **A6** ja `MATH_CLAIMS.md` rivillä 53. Additiivinen instanssi ei siis ole naapuriongelma vaan paluu sen paperin emo-ongelmaan, josta projektin templaattikoneisto tulee. Tekninen peruste ennallaan: additiivinen ekvivalenssi on Parikh-vektorin lineaarinen funktionaali, joten säiliökoneisto (rajattu K → äärellinen ikkuna → de Bruijn → SCC → taajuusrajat) siirtyy sellaisenaan. Ks. `SANALAB_PLAN.md`.

---

## F. Uusi tulos, joka syntyi tästä arvioinnista

**Kasvunopeuden tiukka yläraja Feketen lemmasta.** Kaikki tässä tutkitut kielet ovat faktoriaalisia, joten p(m+n) ≤ p(m)·p(n) ja Feketen lemma antaa

  lim p(n)^(1/n) = **inf** p(n)^(1/n).

Infimum on olennainen: **jokainen p(n)^(1/n) on ehdoton yläraja kasvunopeudelle**, ei estimaatti joka voisi lähestyä kummalta puolelta tahansa. Projektin jo laskemat eksaktit tekijämäärät muuttuvat siis suoraan lauseen muotoiseksi rajaksi.

| kieli | tiukka yläraja | havaittu suhde |
|---|---|---|
| aa2f (Mäkelä, auki) | **≤ 1,9915** | ~1,60 |
| aa2fr | **≤ 1,5940** | ~1,27 |
| abelin-neliötön, 4 kirjainta | **≤ 2,1775** | ~1,70 |

Tämä korvaa aiemman "havaittu suhde" -otsikkoluvun, josta jouduttiin sanomaan ettei sillä ole todistettua yhteyttä raja-arvoon. Nyt on sekä todistettu raja että pienempi konjekturaalinen arvo, ja **kuilu niiden välillä on rehellisesti auki** — Feketen suppeneminen on hidasta. Ks. `MATH_CLAIMS.md` rivi 33.

---

*Lisäysohje: kirjallisuuden ongelma menee osioon A vain sitaatin ja lähteen kanssa. Projektin oma kysymys menee osioon B vain jos sillä on invariantti muotoilu. Jos muotoilu riippuu hakujärjestyksestä, se kuuluu osioon C. Uudet ideat tuotetaan `RESEARCH_ARCHITECT.md`:n menettelyllä — jokaisella ehdotuksella on oltava validointisuunnitelma, odotettu lokirivin muoto ja tappoehdot ennen kuin se kirjataan tänne.*
