# Väiteloki (Math Claims Ledger)

> Tarkoitus: JOKAINEN ulkoinen matemaattinen väite jota projekti käyttää, yhdessä paikassa, tarkalla lähteellä ja vahvistustilalla. Muut dokumentit ja koodikommentit viittaavat tähän (esim. "ks. MATH_CLAIMS.md#h6"), eivät selitä väitettä uudelleen proosana.
>
> Vahvistustilat:
> - `PRIMARY` = tarkistettu suoraan alkuperäisestä lähteestä (paperi/LaTeX)
> - `COMPUTED` = vahvistettu laskennallisesti tässä projektissa
> - `INDIRECT` = yhdenmukainen tunnetun tuloksen kanssa, ei suoraan lähteestä tarkistettu
> - `REJECTED` = aiemmin esitetty, todettu vääräksi/tukemattomaksi — pidetään näkyvissä ETTEI kukaan yritä lisätä uudelleen

| # | Väite | Lähde | Tila | Viimeksi tarkistettu | Huomiot |
|---|---|---|---|---|---|
| 1 | Ternäärisellä ({a,b,c}) aakkostolla ei voi välttää abelin neliöitä loputtomiin (täysi versio, kaikki puolipituudet). | Folklore / Fici & Puzynina, "Abelian Combinatorics on Words: a Survey" (2022), Prop. 17 | `COMPUTED` | 2026-07-26 | Tyhjentävä haku: pisin abelin-neliötön ternaarisana on pituudeltaan 7 (`cbcacbc`), kaikki pituuden 8 sanat sisältävät neliön. |
| 2 | Pleasants (1970) todisti abelin-neliöttömän äärettömän sanan olemassaolon **5** kirjaimella. | P.A.B. Pleasants, "Non-repetitive sequences", Proc. Cambridge Phil. Soc. 68 (1970) | `INDIRECT` | 2026-07-26 | EI liity kohtaan 1 — usein sekoitetaan keskenään. Ei ole pituus-8-faktan lähde. |
| 3 | Keränen (1992) todisti abelin-neliöttömän äärettömän sanan olemassaolon **4** kirjaimella, morfismi g₈₅. | V. Keränen, ICALP 1992, LNCS 623 | `INDIRECT` | 2026-07-26 | Alkuperäistä paperia ei ole vielä luettu rivi riviltä projektissa. |
| 4 | Mäkelän Kysymys 2 (2002): voiko 3 kirjaimella välttää abelin neliöt joiden puolipituus ≥2 (aa2f)? | S. Mäkelä, 2002 (via Rao & Rosenfeld -paperit) | `INDIRECT` | 2026-07-26 | Alkuperäistä Mäkelän tekstiä ei ole luettu — tieto välittynyt Rao & Rosenfeldin papereiden kautta. **AVOIN** puolipituuksille 2-5. |
| 5 | h6-morfismi (6 kirjainta a-f): kiintopiste h6^ω(a) on täysin abelin-neliötön. | arXiv:1511.05875 (alk. otsikko "On Mäkelä's Conjectures..."), julk. SIAM J. Discrete Math 32(4), 2018, Theorem 4 | `COMPUTED` | 2026-07-26 | Tyhjentävästi tarkistettu K=1..400, N=59 049 (32s) ja K=1..150, N=590 490 (670ms JS:ssä). Ks. `test-theorem10-boundary.js`. |
| 6 | g3(h6^ω(a)) (3 kirjainta) ei sisällä abelin neliöitä puolipituudella K > 5. | Sama paperi, Theorem 9/10 | `COMPUTED` | 2026-07-26 | Vahvistettu K=6..150 nollatuloksin. K=2-5: neliöitä ESIINTYY (119016/70874/44604/31669/8775 osumaa vastaavasti, N=196830) — tämä on empiirinen havainto, EI osa siteerattua teoreemaa. |
| 7 | Paperin alkuperäinen otsikko oli "On Mäkelä's Conjectures: deciding if a morphic word avoids long abelian-powers"; nimettiin uudelleen 2016 muotoon "Avoiding Two Consecutive Blocks of Same Size and Same Sum over Z²". | arXiv:1511.05875 versiohistoria | `INDIRECT` | 2026-07-26 | Sisältö/painotus muuttui version mukana — tarkista aina mistä versiosta lause-numerot on otettu. |
| 8 | h6-morfismi on johdettu Hall–Janko-ryhmästä. | — | `REJECTED` | 2026-07-26 | Ei löytynyt tukea. Poistettu koodista/UI:sta. **ÄLÄ LISÄÄ TAKAISIN ilman tarkkaa sivuviitettä paperista.** |
| 9 | FORBID4-joukko {baac,caab,abbc,cbba,accb,bcca} on suljettu sekä kirjainten S₃-permutaation että sanan käänteisluvun (reversal) suhteen. | Ei ulkoista lähdettä — projektin oma löydös | `COMPUTED` | 2026-07-26 | S₃-orbitti tarkistettu koodilla; reversal-symmetria tarkistettu koodilla. Ei päällekkäisyyttä K=2-abelin-neliöiden kanssa (tarkistettu, 0 osumaa). |
| 10 | h6/g3-morfismien tarkat merkkijonot täsmäävät alkuperäiseen LaTeX-lähteeseen rivi riviltä. | arxiv.org/src/1511.05875 | **EI VIELÄ TARKISTETTU** | — | Nykyinen versio nojaa PDF-tekstipoimintaan + korjaukseen + epäsuoraan vahvistukseen (rivi 6). Checksummit `morphisms.js`:ssä paljastavat jos joku editoi arvoja jatkossa, mutta eivät todista alkuperäistä oikeellisuutta. |

---
*Päivitys: lisää uusi rivi AINA kun projektissa nojataan uuteen ulkoiseen matemaattiseen väitteeseen. Älä toista väitettä proosana muissa dokumenteissa — linkitä tähän riviin.*
