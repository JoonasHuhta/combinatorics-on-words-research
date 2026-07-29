# Seuraava askel

**Päivitetty:** 2026-07-29
**Lue ensin:** `RESEARCH_CONTEXT.md`, sitten `AGENTS.md`.

---

## Suositus: Keräsen epäsuotuisat tekijät

`OPEN_RESEARCH_QUESTIONS.md` **A4**, `MATH_CLAIMS.md` rivi **38**.

Se on listan **ainoa lähteistetty avoin ongelma jonka työkalu on jo valmis**.

### Kysymys, sanatarkasti lähteestä

> *"…an unfavourable a-2-free word cannot be continued infinitely long to the
> left and to the right without necessarily creating an abelian square at some
> point. **However, it might well be possible to extend such a word boundlessly
> to one direction, say to the right, without producing any abelian squares.
> Experiments support this conjecture but the existence of such unfavourable
> factors remains an open question.**"*
> — V. Keränen, *Suppression of Unfavourable Factors in Pattern Avoidance*,
> International Mathematica Symposium, Avignon 2006

Eli: **onko olemassa sana joka on rajattomasti jatkettavissa oikealle, mutta joka
ei esiinny minkään äärettömän a-2-vapaan sanan aitona tekijänä?**

### Miksi `rauzy-graph.js` on oikea työkalu

Rauzy-graafissa, kertaluvulla n:

- **rajattomasti oikealle jatkettava** ⟺ solmusta pääsee johonkin sykliin
- **rajattomasti molempiin suuntiin** ⟺ solmu on kaksisuuntaisesti äärettömällä
  polulla, eli kuuluu ei-triviaaliin vahvasti yhtenäiseen komponenttiin tai
  sellaisen tavoittamaan osaan molemmilta puolilta
- **epäsuotuisa** ⟺ edellinen ei päde

Erotus näiden kahden joukon välillä on täsmälleen se mitä Keränen kysyy, ja se on
äärellisesti laskettavissa kullekin n:lle.

### Konkreettinen aloitus

1. `rauzy-graph.js` sisältää jo `stronglyConnected` ja `extendabilityCensus`.
   Tarvitaan lisäksi: **saavuttaako solmu syklin eteenpäin** (ja taaksepäin) —
   se on tavallinen SCC-laskenta + saavutettavuus, ei uutta matematiikkaa.
2. Aja **ternäärille aa2f-kielelle ensin**, koska se on pieni ja koneisto on jo
   viritetty siihen. Se ei ole Keräsen kysymys mutta se validoi toteutuksen.
3. Vasta sitten **nelikirjaimiseen a-2-vapaaseen kieleen**, joka on Keräsen
   asetelma.

### Varaukset, jotka pitää tietää etukäteen

- **Aakkosto eroaa.** Keränen käsittelee neljää kirjainta ja **täyttä**
  a-2-vapautta; rivin 35 mittaus on kolme kirjainta ja aa2f. Ne eivät ole sama
  kysymys, ja `MATH_CLAIMS.md` rivi 38 sanoo sen
- **Rivin 35 luvut eivät ole epäsuotuisien tekijöiden lukumääriä.** Ne laskevat
  tekijöitä joilla ei ole **yhden askeleen** jatkoa. Keräsen käsite koskee
  ääretöntä jatkettavuutta ja on aidosti vahvempi
- **Tavoitettavuus on epävarma.** Nelikirjaiminen a-2-vapaa kieli kasvaa
  eksponentiaalisesti, joten Rauzy-graafit räjähtävät. Käytännössä vastaus
  löytyy vain pienillä n, ja Keräsen omat kokeet olivat myös laskennallisia.
  **Älä lupaa ratkaisua ennen kuin tiedät mihin n:ään haku yltää**

---

## Muut avoimet työt

| # | Työ | Peruste |
|---|---|---|
| 1 | Epäsuotuisat tekijät (yllä) | lähteistetty avoin ongelma, työkalu valmis |
| 2 | FORBID4:n minimaalisuus | äärellinen: 64 osajoukkoa × kasvunopeuden yläraja. Yksikäsitteinen vastaus. `OPEN_RESEARCH_QUESTIONS.md` B1 |
| 3 | Selviytymisjakauman vaimenemisvakio | data on jo kerätty (`morphism-scan.js`), analyysi puuttuu. Rakenteellinen jos k:sta riippumaton. **Sovita jakauman runkoon, ei ääriäntään** — maksimin saavuttaa 2, 4, 8 morfismia |
| 4 | ℚ[x]/(m(x)) ja Theorem 8 | epäuniformi morfismi (`h₄`, pituudet 3,3,2,3), Perron-juuri irrationaalinen. Yleistää `jordan-decomposition.js`:n ℚ(√3)-koodin. **Älä koodaa faktorointia** — asteilla ≤ 6 riittää rationaalijuuritesti |
| 5 | k-abelinen moduuli | lähin **ratkaistu** naapuri (Fici & Puzynina Thm 65). Ainoa tapa mitata mitä ekvivalenssin vahvistaminen ostaa |
| 6 | Ennätyssanarekisteri UI:hin | `word-anatomy.js` on jo rekisteri; se puuttuu sovelluksesta |
| 7 | SAT / CEGIS sääntöavaruuteen | kohde on **morfismiavaruus**, ei sanaavaruus. Verifioija pätee **puhtaille morfisille sanoille**, joten silmukka rakennetaan kiintopisteille, ei projektioille |

---

## Mitä ei kannata tehdä

- **HPC-skaalaus morfismiskanneriin.** Maksimiprefiksi on ln N, R² = 0,99875
  (rivi 37). k = 7, 8, 9 antaa 40, 45, 50 riippumatta matematiikasta
- **Ennätyssanojen käänteismallinnus.** Ne eivät ole morfisia: p(15) = 14 502
  vs. substitutiivisen 144 (rivi 42). Rakennetta ei ole
- **"Rosetta-filtteri"** 25 379-sanan tekijöistä. Se hylkäisi 88 % laillisista
  jatkoista yhden sanan valintojen perusteella — todennäköisemmin katto kuin
  jatke
- **Pidempien aa2f-sanojen jahtaaminen.** Keräsellä on 25 379; mikä tahansa
  äärellinen sana on äärellinen havainto
- **`ConstraintEvaluator`-refaktorointi** ennen kohtaa 7. Abstraktio on arvaus
  ennen kuin SAT-koodaus kertoo mitä rajapinnan pitää kantaa
- **Hakutelemetria kielen ominaisuutena.** `OPEN_RESEARCH_QUESTIONS.md` osio C

---

## Repositorion tila 2026-07-29

Testit **27/27**, driftitarkistukset **12/12**, kaikki committoitu ja pushattu.
Moduulilista ja ajokomennot: `RESEARCH_CONTEXT.md` osio 3.

### Avoimet päätökset, jotka kuuluvat ylläpitäjälle

1. **Git-historia.** Viisi ennätyssanatiedostoa ja `latest/Keranen.pdf`
   committoitiin vahingossa ja poistettiin seurannasta, mutta ne ovat yhä
   historiassa ja pushattu. Poistaminen vaatii force-pushin julkaistun historian
   yli
2. **`latest/`-kansion yhdeksän tekijänoikeudellista paperia** ovat julkisessa
   GitHub-repositoriossa, committoituna ennen tätä istuntoa
3. **SIAM-viite** 32(4):2381–2397 (2018) on `REJECTED` (rivi 23) — arXiv näyttää
   `Journal ref: (none)`. Kukaan ei ole avannut julkaisijan sivua

### Muistutus

**Yksitoista kertaa** tässä työssä uskottava yleistys osoittautui vääräksi vasta
ajossa: M_g:n surjektiivisuus, M_h:n diagonalisoituvuus, p(n):n vakioslope,
ytimen ulottuvuus, testidatan "abelin neliö", HTML-entiteettien kaksoisescapetus,
TeX-jäännökset, Cassaignen hypoteesin puuttuminen, skannerin liian heikko ehto,
Parikh-epätasapainon erottelukyky, ja `ancestor-box.js`:n perustelematon
`x0IsZero`-haara.

Yksikään ei olisi kaatunut silmämääräisessä tarkistuksessa. **Aja kaikki, vertaa
HEAD:iin, äläkä luota kommenttiin.**
