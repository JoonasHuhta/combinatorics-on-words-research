# AA2FR Setting — Ohjelman Idea ja Toiminnot

## Yleiskatsaus

Tämä dokumentti kuvaa **AA2FR Setting** -välilehden (välilehti 14) idean, joka on osa Veikko Keräsen kehittämää interaktiivista web-sovellusta abeliaanisten neliövapaiden sanojen tutkimiseen. Ohjelma on toteutettu yhtenä HTML/CSS/JavaScript-tiedostona (`index.html`) ilman ulkoisia riippuvuuksia.

---

## Taustalla oleva matemaattinen ongelma

### Sanojen kombinatoriikka

Kyseessä on vuosikymmeniä avoimena pysynyt ongelma **sanojen kombinatoriikassa** (Combinatorics of Words):

> **Voiko kolmikirjaimisella aakkostolla {a, b, c} muodostaa mielivaltaisen pitkiä abeliaanisesti neliövapaita sanoja?**

Ongelma juontaa juurensa Paul Erdősin vuoden 1961 kysymykseen. Nelikirjaimiselle aakkostolle ratkaisu löytyi vuonna 1992:

> V. Keränen. *Abelian squares are avoidable on 4 letters.* Proc. ICALP '92, LNCS vol. 623, pp. 41–52. Springer-Verlag, 1992.

Kolmikirjaiminen tapaus on kuitenkin edelleen avoin.

### Keskeiset käsitteet

| Käsite | Määritelmä |
|--------|-----------|
| **Parikh-vektori** | Sanan ψ(w) = (|w|_a, |w|_b, |w|_c) — jokaisen kirjaimen esiintymismäärä |
| **Abeliaaninen ekvivalenssi** | Sanat u ja v ovat abeliaanisesti ekvivalentteja, jos ψ(u) = ψ(v) |
| **Abeliaaninen neliö** | Tekijä uv, missä |u| = |v| ja ψ(u) = ψ(v) |
| **aa2f** | Abeliaanisesti neliövapaa sana, jossa sallitaan vain jakson 1 neliöt (aa, bb, cc) |
| **aa2fr** | aa2f-sana lisärajoituksella: forbid4-tekijät kielletty |
| **forbid4** | Kuusi kiellettyä 4-kirjaimista tekijää: {baac, caab, abbc, cbba, accb, bcca} |
| **Puhdas toisto** | Muoto yxxz, missä x, y, z ovat kirjaimia ja y ≠ x, z ≠ x |

### Mikä on aa2fr?

**AA2FR** tarkoittaa "abelian square-free with restriction" — abeliaanisesti neliövapaita sanoja, joihin on lisätty rajoitus. Rajoitus kieltää niin sanotut **puhtaat toistot** muotoa `yxxz`, missä `y ≠ x` ja `z ≠ x`. Käytännössä tämä tarkoittaa, että seuraavat kuusi 4-kirjaimista tekijää eivät saa esiintyä sanassa:

```
forbid4 = { baac, caab, abbc, cbba, accb, bcca }
```

> **Huom:** Sana voi silti alkaa tai päättyä puhtaalla `aa`, `bb` tai `cc`, mutta sen yhden kirjaimen laajennukset eivät saa luoda forbid4-tekijää etuliitteeksi tai jälkiliitteeksi.

### Tutkimuksen nykytila

- Pisin tunnettu aa2fr-sana kolmella kirjaimella on **1928 kirjainta pitkä**
- Pisin tunnettu aa2f-sana kolmella kirjaimella on **23379 kirjainta pitkä** (aa2f23379)
- 4-kirjaimiselle tapaukselle on olemassa äärettömän pitkiä abeliaanisesti neliövapaita sanoja (Keräsen 85-uniformi endomorfismi g85)

---

## Välilehden 14 (AA2FR Setting) toiminnot

Välilehti 14 on sovelluksen **tutkimuksen ydin** — se tarjoaa kattavan työkalupaketin aa2fr-rajoituksen tutkimiseen.

### 1. 🔍 Forbid4-viitekortti

Visuaalinen viitekortti, joka näyttää:
- Kaikki 6 kiellettyä 4-kirjaimista kuviota värikoodattuina
- Selityksen siitä, miten ne edustavat puhtaita toistoja
- Matemaattisen perusteen rajoitukselle

### 2. ✅ AA2FR-sanan validointi

**Funktio: `isAA2FR(word)`**

Tarkistaa, onko annettu sana aa2fr:
1. Tarkistaa ensin, onko sana aa2f (abeliaanisesti neliövapaa, jakson 1 neliöt sallittu)
2. Tarkistaa, ettei sana sisällä yhtäkään forbid4-tekijää

**Käyttöliittymä:**
- Tekstikenttä sanan syöttämiseen
- "Validate AA2FR" -painike
- "Load aa2f23379" — lataa tunnetun pitkän aa2f-sanan
- "Load 1928-word" — lataa tunnetun aa2fr-sanan (1928 kirjainta)
- Värikoodattu tulosalue, joka näyttää validoinnin tuloksen ja mahdolliset rikkomukset

### 3. 🔧 AA2FR-sanojen generointi

**Funktio: `generateAA2FRWords(maxLength)`**

- Generoi kaikki aa2fr-sanat haluttuun pituuteen asti
- Käyttää **backtracking-algoritmia** (peruuttava haku):
  - Rakentaa sanaa kirjain kerrallaan aakkostosta {a, b, c}
  - Karsii haarat, jotka rikkovat aa2f- tai forbid4-rajoituksia
- Näyttää sanojen lukumäärän, käytetyn ajan ja generoidut sanat

### 4. 🔄 AA2FR-laajennusmoottori

**Funktio: `extendAA2FR(seed, direction, maxSteps)`**

Laajentaa siemensanaa aa2fr-muodossa:
- **Suunta**: vasen, oikea tai molemmat (vuorotellen)
- Käyttää peruuttavaa hakua askelten laskennalla
- Jokaisella askeleella kokeillaan kutakin kirjainta {a, b, c}
- Validoi, että uusi sana on aa2fr
- Palauttaa laajennetun sanan ja laajennushistorian

**Parametrit:**
- Siemensanan syöttökenttä
- Laajennussuunnan valitsin (Vasen/Oikea/Molemmat)
- Maksimiaskelten lukumäärä (oletus: 10 000)
- Edistymisen seurantanäyttö

### 5. 🔍 AA2FR-tekijäanalyysi

**Funktio: `analyzeAA2FRFactors(word)`**

- Laskee tekijöiden (osajonojen) lukumäärän pituuden mukaan
- Tunnistaa, mitkä tekijät ovat lähellä forbid4-kuvioita
- Laskee tekijöiden frekvenssijakauman
- Korostaa löydetyt kielletyt tekijät punaisella

### 6. 📊 AA2FR-tilastopaneeli

**Funktio: `computeAA2FRStatistics(words)`**

Laskee kattavat tilastot sanajoukosta:
- Sanan pituuden jakaumakaavio
- Kirjainfrekvenssianalyysi
- Forbid4-rikkomusten läheisyysanalyysi
- Kasvuvertailu: aa2f vs. aa2fr sanajoukon koko eri pituuksilla

### 7. ⚖️ AA2F vs. AA2FR -vertailu

**Funktio: `compareAA2FvsAA2FR(maxLength)`**

- Vertaa aa2f- ja aa2fr-sanajoukkoja eri pituuksilla
- Laskee vähennysprosentit (kuinka paljon aa2fr-rajoitus karsii)
- Näyttää, mitkä sanat eliminoituvat aa2fr-rajoituksella
- Tuottaa vertailudatan kaavionäkymää varten

### 8. 🎨 AA2FR-sanan visualisointi

**Funktio: `visualizeAA2FRWord(word, canvas)`**

- Piirtää aa2fr-sanan 3-kirjaimen väripaletilla canvas-elementille
- Jokainen kirjain saa oman värinsä
- Forbid4-läheiset sijainnit korostetaan

### 9. 🔴 Forbid4-tekijöiden korostus

**Funktio: `highlightForbid4Factors(word)`**

- Palauttaa HTML-muotoillun merkkijonon, jossa forbid4-tekijät on korostettu punaisella

### 10. 📈 Kasvuanalyysi

**Funktio: `aa2frGrowthAnalysis(maxLength)`**

- Analysoi, miten aa2fr-sanojen lukumäärä kasvaa verrattuna aa2f-sanoihin pituuden kasvaessa
- Käytetään tilastopaneelin kasvukaavioon

---

## Keskeiset algoritmit

### AA2FR-validoinnin algoritmi

```
SYÖTE: sana w aakkostolla {a, b, c}

1. TARKISTA AA2F:
   Jokaiselle parillisen pituuden osasanalle w[i..j]:
     Jaa kahtia: u = w[i..k], v = w[k+1..j]  (missä |u| = |v|)
     Laske Parikh-vektorit: ψ(u) ja ψ(v)
     JOS ψ(u) = ψ(v) JA |u| > 1:
       → Sana EI ole aa2f → EI ole aa2fr

2. TARKISTA FORBID4:
   Jokaiselle i = 0, 1, ..., |w| - 4:
     JOS w[i..i+3] ∈ {baac, caab, abbc, cbba, accb, bcca}:
       → Sana EI ole aa2fr

3. JOS molemmat läpäistiin:
   → Sana ON aa2fr ✓
```

### Backtracking-laajennusalgoritmi

```
SYÖTE: siemensana s, suunta d, maksimiaskeleet M

1. ALUSTA: nykyinen = s, askeleet = 0
2. TOISTA kunnes askeleet = M:
   a. Valitse suunta d (vasen/oikea/vuorottele)
   b. Kokeile kutakin kirjainta c ∈ {a, b, c}:
      - Lisää c sanan alkuun (vasen) tai loppuun (oikea)
      - Tarkista: onko uusi sana aa2fr?
      - JOS kyllä: hyväksy ja jatka
      - JOS ei: peruuta ja kokeile seuraavaa kirjainta
   c. JOS mikään kirjain ei kelpaa:
      - Peruuta edellinen askel (backtrack)
   d. askeleet++
3. PALAUTA laajennettu sana ja historia
```

---

## Tutkimuksen tavoite

AA2FR-välilehden tavoite on tutkia, **vähentääkö forbid4-rajoitus hakuavaruutta riittävästi**, jotta kolmikirjaimisen abeliaanisen neliövapauden ongelma tulisi ymmärrettäväksi. Kolme mahdollista lopputulosta:

1. **Hyvin pitkiä aa2fr-sanoja löytyy** → Rajoitus ei estä pitkien sanojen olemassaoloa, ja ilmiö tulee ehkä ymmärrettävämmäksi
2. **Aa2fr-sanojen maksimipituus on rajallinen** → Itsessään merkittävä matemaattinen tulos
3. **Rajoitus paljastaa rakenteita** → Hakuavaruuden pieneneminen voi tuoda esiin säännönmukaisuuksia, jotka auttavat ratkaisemaan avoimen ongelman

---

## Sovelluksen kokonaisarkkitehtuuri (konteksti)

Välilehti 14 on osa 16-välilehteistä sovellusta:

| # | Välilehti | Kuvaus |
|---|-----------|--------|
| 1 | 🎯 Introduction | Projektin yleiskatsaus ja teoria |
| 2 | 🔧 Word Generator | Aa2f/aa2fr-sanojen generointi |
| 3 | ✅ Validator | Sanojen validointi |
| 4 | 🔄 Extension Engine | Siemensanojen laajentaminen |
| 5 | 🔍 Factor Analysis | Tekijäanalyysi |
| 6 | 🎯 Near-Miss Analysis | Läheltä piti -tapausten analyysi |
| 7 | 📊 Statistics | Tilastollinen analyysi |
| 8 | 🎨 Visualization | Värikarttavisualisointi |
| 9 | 🎵 Musical Mapping | Musiikillinen kuvaus |
| 10 | 📈 Growth Analysis | Kasvuanalyysi |
| 11 | ⚖️ Comparison | Sanojen vertailu |
| 12 | 🧬 Morphism Lab | Endomorfismien tutkimus |
| 13 | 📦 Batch Processing | Eräkäsittely |
| **14** | **🔬 AA2FR Setting** | **AA2FR-rajoituksen työtila (tämä dokumentti)** |
| 15 | 🐍 Abelian Snake | Abeliaaninen käärme -pelivisualisointi |
| 16 | 💾 Export/Import | Tietojen vienti ja tuonti |

---

## Tekniset tiedot

- **Toteutus**: Yksittäinen `index.html`-tiedosto (~165 KB)
- **Teknologia**: Puhdas HTML/CSS/JavaScript, ei ulkoisia riippuvuuksia
- **Laskenta**: Memoization `Map`-rakenteella, tehokas osajono-tarkistus
- **Visualisointi**: Canvas-pohjainen piirto, värikoodatut kirjaimet
- **Aakkosto**: {a, b, c} (kokonaislukuarvot laskennassa: a=0, b=1, c=65536=2^16)

---

## Viitteet

- Keränen, V. (1992). *Abelian squares are avoidable on 4 letters.* Proc. ICALP '92, LNCS 623, pp. 41–52.
- Erdős, P. (1961). Abeliaanisten neliöiden välttämistä koskeva kysymys.
- Evdokimov, A. (1968). 25 kirjainta riittää abeliaaniseen neliövapauteen.
- Dekking, F.M. (1979). Tutkimukset abeliaanisista neliöistä.
- Tunnettu aa2fr-sana (1928 kirjainta): [algebra.fi/keranen/research](https://algebra.fi/keranen/research/web110117/aa2f15796_aa2f25379_aa2f1928.html)
- Pääsivu: [algebra.fi/keranen/StructuresGraphicsMusic.html](https://algebra.fi/keranen/StructuresGraphicsMusic.html)
