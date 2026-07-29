# Avoimet tutkimuskysymykset

**Päivitetty:** 2026-07-28
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

**Mitä tämä tarkoittaa hyökkäyssuunnalle:** reitti ei ole "etsi pidempiä sanoja". Pisimmät tunnetut aa2f-sanat ovat 25 379 merkkiä, ja mikä tahansa äärellinen sana on äärellinen havainto. Reitti on joko (a) ternäärimorfismi jonka *kiintopiste* — ei projektio — välttää jaksot ≥ 2, jolloin §3:n menettely pätee suoraan, tai (b) päätösmenettelyn laajennus pieniin jaksoihin projektioille.

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

### A4. Jäljittämätön: minimimäärä eri 2-abelin neliöitä binäärisanassa

Keskustelussa on esiintynyt väite *"5 ≤ g(2) ≤ 734"* Rosenfeldin väitöskirjan Problem 4.9:nä. **Lukua 734 eikä merkintää g(2) ei löydy Fici & Puzyninan katsauksesta**, eikä väitöskirjaa ole avattu projektissa. Väite on **jäljittämätön** eikä sitä saa käyttää ennen kuin joku lukee alkuperäisen. Jos se pitää paikkansa, se on houkutteleva kohde: binäärinen hakuavaruus on pienempi kuin ternäärinen ja nykyiset työkalut siirtyisivät lähes suoraan.

---

## B. Projektin omat kysymykset, jotka ovat oikeasti laskettavissa

Nämä eivät ole kirjallisuuden avoimia ongelmia. Ne ovat äärellisiä laskentatehtäviä joilla on yksikäsitteinen vastaus, ja projektin koneisto riittää niihin.

### B1. Onko FORBID4-joukko minimaalinen?

`{baac, caab, abbc, cbba, accb, bcca}` ei ole kirjallisuudesta — se on projektin oma (`MATH_CLAIMS.md` rivi 9). Kysymys **onko jokin aito osajoukko yhtä tehokas** on äärellinen: 2⁶ = 64 osajoukkoa, ja kullekin lasketaan tekijäkompleksisuus `factor-complexity.js`:n koneistolla. Vastaus on yksikäsitteinen luku, ei mielipide.

Tarkennus: "tehokkuus" on määriteltävä invariantilla. Kasvunopeuden yläraja (B2) käy; "kuinka pitkälle DFS pääsee" ei käy, koska se riippuu hakujärjestyksestä.

### B2. Aa2f-kielen kasvunopeus

Nykytila: **kasvunopeus ≤ 1,9915** (tiukka yläraja, `MATH_CLAIMS.md` rivi 33). Havaittu suhde on ~1,60, mutta sillä ei ole todistettua yhteyttä raja-arvoon. **Kuilu 1,60 ↔ 1,99 on auki.**

Kaventaminen ylhäältä vaatii suurempaa n:ää tai parempaa kuin Feketen argumenttia. Kaventaminen alhaalta vaatii eri tekniikan (esim. vapaasti yhdisteltävän osajoukon eksplisiittinen konstruktio). Kumpikin on aito laskennallinen tavoite.

### B3. Välttämättömät tekijät (unavoidable sets)

"Onko olemassa motiiveja joiden kautta kulkeminen johtaa aina umpikujaan" on kirjallisuudessa **unavoidable set** -käsite. Äärellisen joukon välttämättömyys on päätettävissä. Tämä on B1:n yleistys ja se kannattaa muotoilla sillä sanastolla, ei uudella.

### B4. Rauzy-graafit ja oikealle jatkuvuus

Tekijäkompleksisuuden p(n) erotukset p(n+1) − p(n) laskevat **oikealle erikoisten tekijöiden** lukumäärän. Tämä on kielen invariantti ja se selittää *missä* rajoite puree. g₃(h₆^ω(a)):lle erotukset ovat välillä 6…8 (`MATH_CLAIMS.md` rivi 28) — mutta niiden **rakenne** on tutkimatta.

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

*Lisäysohje: kirjallisuuden ongelma menee osioon A vain sitaatin ja lähteen kanssa. Projektin oma kysymys menee osioon B vain jos sillä on invariantti muotoilu. Jos muotoilu riippuu hakujärjestyksestä, se kuuluu osioon C.*
