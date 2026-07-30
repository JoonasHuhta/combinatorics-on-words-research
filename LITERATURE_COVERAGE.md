# LITERATURE_COVERAGE.md — mitä kirjallisuus kattaa ja mitä ei

**Päivitetty:** 2026-07-30
**Tarkoitus:** estää saman laskennan tekeminen uudelleen, ja tehdä näkyväksi
**mitä ei ole systemaattisesti tutkittu** — se on usein helpompi tunnistaa
kuin uusi tulos, ja siitä syntyvät parhaat tutkimusideat.

> **Tämä on kattavuuskartta, ei väiteloki.** Jokainen matemaattinen väite on
> `MATH_CLAIMS.md`:ssä; tässä on vain tieto siitä **mitä on luettu ja mitä ei**.

---

## 1. Kaksi asiaa jotka on erotettava, ja joita sekoitetaan jatkuvasti

| Muotoilu | Mitä se vaatii | Saako sanoa |
|---|---|---|
| *"Tarkistettu lähteestä X, ei ole siellä"* | yhden lähteen avaaminen ja haku | **kyllä**, kun lähde on avattu ja hakutermit kirjattu |
| *"Ei ole kirjallisuudessa"* | kattava haku koko alan yli | **ei koskaan** tämän projektin aineistolla |

Neljän lähteen tarkistaminen ei ole kirjallisuushaku. Se on neljän lähteen
tarkistaminen. Tämä taulukko kirjaa **lähdekohtaisia havaintoja**, ja
yhteenvetosarake sanoo korkeintaan *"ei löytynyt tarkistetuista lähteistä"*.

**Toinen erottelu, joka on yhtä tärkeä:** kysymys ei ole vain *"onko lakaisu
tehty"* vaan **"minkä avaruuden lakaisu on tehty"**. Nämä ovat eri asioita:
kaikki sanat pituuteen N, kaikki morfismit, kaikki uniformit morfismit,
kaikki k-uniformit morfismit, kaikki aakkostot, kaikki paikalliset
konfiguraatiot. Kattavuussarake nimeää avaruuden, ei pelkkää kyllä/ei.

---

## 2. Avatut lähteet

Vain nämä on avattu ja niistä on haettu. Kaikki muu on avaamatonta.

| Lähde | Avattu | Miten |
|---|---|---|
| Fici & Puzynina, *Abelian Combinatorics on Words: a Survey*, arXiv:2207.09937 | 2026-07-28, 2026-07-30 | ar5iv + PDF, teksti uutettu ja haettu |
| Rao & Rosenfeld, arXiv:1511.05875 (= SIAM 32(4), DOI `10.1137/17M1149377`) | 2026-07-28 | ar5iv; DOI varmennettu Crossrefista 2026-07-30 (rivi 23) |
| Cassaigne, Currie, Schaeffer & Shallit, arXiv:1106.5204 | 2026-07-30 | abstrakti + ar5iv-kokoteksti |
| Lietard & Rosenfeld, DLT 2020, DOI `10.1007/978-3-030-48516-0_15` | 2026-07-30 | avoin preprint `lirmm.fr/~mrosenfeld/LieRos.pdf`, teksti uutettu (rivi 63) |
| Andrade & Mol, arXiv:2408.15390 (2024) | 2026-07-30 | HTML-kokoteksti |
| Lietard, *Évitabilité de puissances additives*, väitöskirja, Univ. de Lorraine 2020 | 2026-07-30 | PDF `docnum.univ-lorraine.fr`, teksti uutettu, avainsanahaku (rivi 65) |
| Keränen, *Suppression of Unfavourable Factors*, IMS 2006 | aiemmin | PDF (rivi 38) |
| ACR 2004, *The Number of Ternary Words Avoiding Abelian Cubes* | aiemmin | rivi 48 |

**Avaamatta:** Brown & Freedman, *"Arithmetic progressions in lacunary sets"*,
Rocky Mountain J. Math. 17(3):587–596, 1987 — **viite nyt jäljitetty, paperi
ei avattu; se on tärkein yksittäinen avaamaton lähde (rivi 65)**.  Lisäksi: Rosenfeldin väitöskirja (ENS Lyon 2017), Rao TCS 601 (2015),
Halbeisen & Hungerbühler (2000), Dekking (1979), Justin (1972),
Pirillo & Varricchio (1994).

---

## 3. Kattavuustaulukko

Sarake **"Avaruus"** kertoo mitä täsmälleen on lakaistu, ei pelkkää kyllä/ei.

| # | Tutkimuskysymys | Löytyykö avatuista lähteistä | Avaruus jonka kirjallisuus kattaa | Projektin oma työ | Tarvitaanko lisää |
|---|---|---|---|---|---|
| 1 | Ternäärinen abelin-neliötön kieli, tyhjentävä | **kyllä** (Fici & Puzynina Prop. 17) | kaikki ternäärisanat, kaikki pituudet | rivi 1, toistettu itsenäisesti | ei |
| 2 | Abelin neliöiden välttäminen 4 kirjaimella | **kyllä** (Keränen, Dekking) | konstruktiot, ei tyhjentävää lakaisua | rivit 3, 40 | ei |
| 3 | Mäkelän konjektuuri, K ∈ [2,5] | **avoin** (Fici & Puzynina Conj. 20; R&R Problem 1) | — | rivit 4, 7b, 49, 51, 52, 62 | **kyllä, päätavoite** |
| 4 | Uniformit ternäärimorfismit, k ≤ 6 | **ei löytynyt** | — | rivi 36, tyhjentävä | ei tällä k:lla |
| 5 | Uniformit kuvat h₆:n kiintopisteestä, L ≤ 5 | **ei löytynyt** | — | rivi 49, tyhjentävä | L ≥ 6 auki |
| 6 | Epäuniformit morfismit | **ei löytynyt** | — | ei tehty | **kyllä, tekemättä** |
| 7 | Additiiviset **kuutiot**, 4-alkioiset aakkostot | **kyllä, kattavasti** (Lietard & Rosenfeld 2020, Corollary 1) | kaikki 4-alkioiset aakkostot affiiniluokkina, paitsi {0,1,2,3} | ei tehty | **ei — älä tee** |
| 8 | Additiiviset kuutiot, {0,1,2,3} | **avoin** (heidän Question 1) | — | ei tehty | mahdollinen, mutta heidän ohjelmansa ei löytänyt ehdokasta |
| 9 | Additiiviset **neliöt**, onko mikään äärellinen ℤ-aakkosto | **avoin** (heidän Question 3; sanatarkasti rivillä 63) | — | rivit 53, 54, 59, 64 | **kyllä** |
| 10 | Additiivisten neliöiden aakkostoluokittelu, **epätasapainoiset** luokat | **ei löytynyt avatuista lähteistä** | tasapainoiset kattaa B&F 1987 (rivi 11) | rivi 54: tyhjentyneistä vain {0,1,2,4} on epätasapainoinen | **kyllä — tässä aukko on** |
| 11 | Tasapainoiset aakkostot {0,p,q,p+q}: onko ääretöntä sanaa | **kyllä, ratkaistu** (Brown & Freedman 1987, jäljitetty väitöskirjan kautta) | kaikki 4-alkioiset aakkostot ehdolla a+d = b+c | rivi 65: **vahvistettu itsenäisesti** 10 luokalla; kvantitatiivinen vakio korjattu 50 → 61 | ei — mutta B&F:n oma paperi avaamatta |
| 12 | K ∈ [2,5]-säiliön rakenne (SCC, taajuudet, tekijät) | **ei löytynyt** | — | rivit 51, 52, 62 | ei — kolmesti mitattu löysäksi |
| 13 | AA2FR-kieli | **ei löytynyt** | — | rivit 27, 33, 35 | **kyllä, käytännössä koskematon** |
| 14 | k-abelinen hierarkia | **kyllä** (Fici & Puzynina Thm 65) | ratkaistu tapaus 2-abelin ternääri | ei moduulia | mahdollinen mittatikku |

---

## 4. Missä aukot ovat — rivien 6, 10, 13 perustelu

Kolme kohtaa, joissa avatuista lähteistä ei löytynyt mitään ja joissa
projektin koneisto on jo valmis:

1. **Epäuniformit morfismit (rivi 6).** Kaikki projektin lakaisut ja kaikki
   löytynyt kirjallisuus koskevat uniformeja. Epäuniformi avaruus on aidosti
   suurempi, eikä siitä ole tehty mitään.
2. **Additiivisten neliöiden aakkostoluokittelu (rivi 10).** 20 luokkaa 31:stä
   on ratkaisematta, ja epätasapainoiset luokat ovat se osa jossa
   päällekkäisyyttä kirjallisuuden kanssa ei ole edes epäilty.
3. **AA2FR (rivi 13).** Projektin oma rajoite, jolle ei löytynyt yhtään
   ulkoista lähdettä. Se on samalla varoitus: kieli on projektin oma
   määritelmä (FORBID4, rivi 9), joten "ei kirjallisuudessa" voi tarkoittaa
   myös "ei kiinnostava muille".

---

## 5. Ylläpitosääntö

Rivi lisätään tänne vasta kun **lähde on avattu ja hakutermit kirjattu**.
Sarakkeeseen "Löytyykö" kelpaa vain kolme arvoa:

- **kyllä** — löytyi, viite `MATH_CLAIMS.md`:ssä
- **avoin** — lähde sanoo eksplisiittisesti että kysymys on auki, sitaatti lokissa
- **ei löytynyt** — avatuista lähteistä ei löytynyt, hakutermit kirjattu

**Neljättä arvoa "ei ole olemassa" ei ole.** Jos joku haluaa väittää sen, se
vaatii kattavan haun, eikä tässä projektissa ole tehty sellaista.
