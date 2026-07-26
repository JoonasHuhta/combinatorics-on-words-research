# Väiteloki (Math Claims Ledger)

> Tarkoitus: JOKAINEN ulkoinen matemaattinen väite jota projekti käyttää, yhdessä paikassa, tarkalla lähteellä ja vahvistustilalla. Muut dokumentit ja koodikommentit viittaavat tähän (esim. "ks. MATH_CLAIMS.md#h6"), eivät selitä väitettä uudelleen proosana.
>
> Vahvistustilat:
> - `PRIMARY` / `LEVEL_2_VERIFIED_SOURCE` = tarkistettu suoraan alkuperäisestä lähteestä (paperi/LaTeX/lähdekoodiarkisto)
> - `COMPUTED` / `LEVEL_1_INTERNAL_CHECKSUM` = vahvistettu laskennallisesti tässä projektissa, ei ulkoista lähdetarkistusta
> - `INDIRECT` = yhdenmukainen tunnetun tuloksen kanssa, ei suoraan lähteestä tarkistettu
> - `REJECTED` = aiemmin esitetty, todettu vääräksi/tukemattomaksi — pidetään näkyvissä ETTEI kukaan yritä lisätä uudelleen

| # | Väite | Lähde (DOI / arXiv / URL) | Tila / Vahvistustaso | Viimeksi tarkistettu | Viimeksi yritetty jäljittää | Huomiot ja sitaatti |
|---|---|---|---|---|---|---|
| 1 | Ternäärisellä ({a,b,c}) aakkostolla ei voi välttää abelin neliöitä loputtomiin (täysi versio, kaikki puolipituudet). | Fici & Puzynina, "Abelian Combinatorics on Words: a Survey" (2022), Prop. 17 | `PRIMARY` (Level 2) | 2026-07-26 | 2026-07-26 | Tyhjentävä haku ja kirjallisuus: pisin abelin-neliötön ternaarisana on pituudeltaan 7 (`cbcacbc`), kaikki pituuden 8 sanat sisältävät neliön. |
| 2 | Pleasants (1970) todisti abelin-neliöttömän äärettömän sanan olemassaolon **5** kirjaimella. | P.A.B. Pleasants, "Non-repetitive sequences", Proc. Cambridge Phil. Soc. 68 (1970) | `INDIRECT` | 2026-07-26 | 2026-07-26 | EI liity kohtaan 1 — usein sekoitetaan keskenään. Ei ole pituus-8-faktan lähde. |
| 3 | Keränen (1992) todisti abelin-neliöttömän äärettömän sanan olemassaolon **4** kirjaimella, morfismi g₈₅. | V. Keränen, ICALP 1992, LNCS 623 | `INDIRECT` | 2026-07-26 | 2026-07-26 | Alkuperäistä paperia ei ole vielä luettu rivi riviltä projektissa. |
| 4 | Mäkelän Kysymys 2 (2002): voiko 3 kirjaimella välttää abelin neliöt joiden puolipituus ≥2 (aa2f)? | S. Mäkelä, 2002 (via Rao & Rosenfeld -paperit) | `INDIRECT` | 2026-07-26 | 2026-07-26 | Alkuperäistä Mäkelän tekstiä ei ole luettu — tieto välittynyt Rao & Rosenfeldin papereiden kautta. **AVOIN** puolipituuksille 2-5. |
| 5 | h6-morfismi (6 kirjainta a-f): kiintopiste h6^ω(a) on täysin abelin-neliötön. | M. Rao & M. Rosenfeld, arXiv:1511.05875 (2015), Theorem 6 (C++ verification archive `firstmorphism`) | `PRIMARY` (Level 2 Verified Source) | 2026-07-26 | 2026-07-26 | **Oikeuslääketieteellinen löydös (2026-07-26):** Haettu ja purettu `https://arxiv.org/e-print/1511.05875` lähdekoodiarkisto. C++ -tiedostossa määritellään `firstmorphism`: `a: "ace", b: "adf", c: "bdf", d: "bdc", e: "afe", f: "bce"`. Aiempi sekaannus johtui SIAM 2018 -artikkelin otsikon vaihtumisesta. |
| 6 | g3(h6^ω(a)) (3 kirjainta) ei sisällä abelin neliöitä puolipituudella K > 5. | M. Rao & M. Rosenfeld, arXiv:1511.05875 (2015), Theorem 6 (C++ verification archive `h`) | `PRIMARY` (Level 2 Verified Source) | 2026-07-26 | 2026-07-26 | **Oikeuslääketieteellinen löydös (2026-07-26):** Verifioitu `1511.05875` C++-arkistosta `vector<string> h`: `h[0]="bbbaabaaac", h[1]="bccacccbcc", h[2]="ccccbbbcbc", h[3]="ccccccccaa", h[4]="bbbbbcabaa", h[5]="aaaaaaabaa"`. Välttää kaikki abelin neliöt kun K>5. |
| 7 | Rao & Rosenfeld (2015) "On Mäkelä's Conjectures...": ternäärisen aakkoston period > 5 välttäminen. | arXiv:1511.05875 / SIAM J. Discrete Math 2018 | `PRIMARY` (Level 2 Verified Source) | 2026-07-26 | 2026-07-26 | Primäärilähde h6/g3-morfismeille on arXiv:1511.05875 liitetiedosto, jota käytettiin Theorem 6 verifiointiin. |
| 8 | h6-morfismi on johdettu Hall–Janko-ryhmästä. | — | `REJECTED` | 2026-07-26 | 2026-07-26 | Ei löytynyt tukea. Poistettu koodista/UI:sta. **ÄLÄ LISÄÄ TAKAISIN ilman tarkkaa sivuviitettä paperista.** |
| 9 | FORBID4-joukko {baac,caab,abbc,cbba,accb,bcca} on suljettu sekä kirjainten S₃-permutaation että sanan käänteisluvun (reversal) suhteen. | Ei ulkoista lähdettä — projektin oma löydös | `COMPUTED` (Level 1 Internal Checksum) | 2026-07-26 | 2026-07-26 | S₃-orbitti ja reversal-symmetria tarkistettu koodilla. Ei päällekkäisyyttä K=2-abelin-neliöiden kanssa. |
| 10 | Morfismien vahvistustasot ja merkit: Taso 1 (⚙️ Checksum OK) vs Taso 2 (🟢 Verified from Source [DOI]). | Projektin epistemologinen ohje (`AGENTS.md`) | `PRIMARY` | 2026-07-26 | 2026-07-26 | Taso 1 todistaa vain sisäisen eheyden. Taso 2 vaatii suoran DOI/arXiv-linkin ja ihmisen tai agentin tekemän primäärilähdevertailun. |

---
*Päivitys: lisää uusi rivi AINA kun projektissa nojataan uuteen ulkoiseen matemaattiseen väitteeseen. Älä toista väitettä proosana muissa dokumenteissa — linkitä tähän riviin.*
