# KNOWLEDGE_STATE.md — mitä tiedetään ja mikä on suljettu

**Päivitetty:** 2026-07-30
**Tarkoitus:** yksi lukukerta, joka kertoo missä projekti seisoo. Erottelu on
**episteeminen, ei aiheittainen**: mitä tiedetään ulkoisesta lähteestä, mitä on
laskettu itse, mikä on todistetusti suljettu, mikä on peruttu, ja mitä ei saa
käyttää.

> **Tämä on johdettu hakemisto, ei totuuslähde.** Jokainen kohta on osoitin
> `MATH_CLAIMS.md`:n riviin, ja **väiteloki voittaa aina**. Jos jokin luku
> esiintyy tässä ilman rivinumeroa, se on virhe. Driftitarkistin varmistaa
> että jokainen tässä mainittu rivi on olemassa.

---

## 1. Tiedetään ulkoisesta primäärilähteestä (Level 2)

Nämä on avattu, luettu ja siteerattu sanatarkasti. Ne eivät ole projektin
omia tuloksia.

| Mitä | Rivi |
|---|---|
| Ternäärisillä kolmella kirjaimella abelin neliöitä ei voi välttää; pisin sana on pituudeltaan 7 ja niitä on täsmälleen 18 | 1 |
| Mäkelän konjektuurin täsmällinen muotoilu; **auki** puolipituuksille K = 2…5 | 4 |
| h₆:n kiintopiste on täysin abelin-neliötön (R&R Theorem 4) | 5 |
| g₃(h₆^ω(a)) ei sisällä abelin neliöitä jaksolla > 5 (R&R Theorem 9) | 6a |
| Sama sana sisältää **täsmälleen 34** eri abelin neliötä (Fici & Puzynina) | 6b |
| Ääretön ternäärisana joka välttää abelin neliöt jaksolla > 5 on olemassa | 7 |
| **Miksi juuri K = 2…5 on auki:** päätösalgoritmi kantaa kiintopisteille kaikilla jaksoilla, mutta kuville vain suurilla | 7b |
| Epäsuotuisan tekijän määritelmä ja Keräsen avoin kysymys (2006) | 38 |
| g₉₈ ei ole a-2-vapaa endomorfismi vaikka sen iterointi tuottaa a-2-vapaan sanan | 39 |
| Paperi vahvistaa Jordan-rakenteen sanatarkasti | 44 |
| Templaatti-/esivanhempimenetelmä on **ACR 2004**, ei 2015 | 48 |
| **Additiiviset neliöt:** "onko ℤ uniformisti 2-repetitiivinen" on avoin; kuutiot ratkaistu {0,1,3,4}:llä; **ℤ²-tapaus on projektin oman ydinlähteen aihe** | 53 |
| R&R:n oma referenssitoteutus on julkisesti saatavilla ja vastaa `morphisms.js`:ää | 22 |

Heikommalla tasolla (`INDIRECT`, alkuperäistä ei ole luettu rivi riviltä):
Pleasants 5 kirjaimella (rivi 2), Keränen 4 kirjaimella (rivi 3).

**Erikseen:** Dejeanin konjektuuri on **todistettu**, ei auki
(`OPEN_RESEARCH_QUESTIONS.md` A2). Mikä tahansa suunnitelma joka lupaa
"löytää RT(n)-arvoja" nojaa vanhentuneeseen tietoon.

---

## 2. Laskettu ja verifioitu itse (Level 1)

Nämä ovat projektin omia eksakteja laskuja. Ne eivät ole ulkoisesti
tarkistettuja, mutta jokainen on toistettavissa ja useimmilla on kaksi
riippumatonta koodipolkua.

**Rakenne ja algebra:** h₆:n eksaktit kirjaintiheydet ja spektri (17, 18),
neliöiden asymptoottiset tiheydet (19, 20), Prop 9:n hypoteesit (21), Smithin
normaalimuoto (24), Jordan-rakenne (25), Prop 5:n rajat (29), esivanhempilaatikko
ja -sulkeuma (30, 31), Prop 11:n kohdejoukko (45).

**Kaksi lauseen uudelleenjohtoa koko päätösmenettelyllä:** Theorem 4 (rivi 32)
ja Theorem 6 (rivi 46). Nämä ovat *uudelleenjohtoja tekijöiden koneistolla*,
eivät riippumattomia todistuksia.

**Kielet ja kasvu:** tekijäkompleksisuus (27, 28), **tiukat ylärajat
kasvunopeuksille** Feketen lemmasta (33), Rauzy-graafit (34), umpikujatekijät (35).

**Sanat:** ennätyssanat verifioitu ensimmäistä kertaa (40), FORBID4 on
heuristiikka eikä sääntö (41), ennätyssanat eivät ole morfisia (42),
epäsuotuisia tekijöitä on olemassa neljällä kirjaimella (47).

**Säiliökieli:** K ∈ [2,5] rakenne ja välttämättömät ehdot (51), välin
stabiilius kun ikkuna kasvaa 5 → 6 (52).

**Additiiviset neliöt:** aakkostolakaisu, 11 luokkaa 31:stä ratkaistu (54).

**Ekvivalenssi joka kannattaa tietää:** Mäkelän konjektuuri on ekvivalentti
sen kanssa että aa2f-sanoja on jokaisella pituudella (rivi 50). Siitä seuraa
että **kasvunopeuden alaraja ei ole osatavoite vaan koko ongelma.**

---

## 3. Todistetusti suljettu

Nämä eivät ole arvioita vaan äärellisiä laskuja joiden hakupuu on tyhjennetty.
Ne pysyvät suljettuina.

| Mikä on suljettu | Todistuksen laji | Rivi |
|---|---|---|
| Ternäärinen abelin-neliötön kieli loppuu pituudella 7 | tyhjentävä haku | 1 |
| **Yksikään** k-uniformi ternäärimorfismi, k ≤ 6, ei tuota Mäkelä-kiintopistettä | tyhjentävä lakaisu | 36 |
| **Reitti (c):** yksikään uniformi kuvaus Σ₆ → Σ₃^L, L ≤ 5, ei tuota Mäkelä-sanaa h₆:n kiintopisteestä | tyhjentävä lakaisu | 49 |
| Kahden kirjaimen aliaakkostolla ei ole ääretöntä [2,5]-vapaata sanaa | syklihaku säiliögraafissa | 51 |
| 11 additiivista affiiniluokkaa 31:stä ei voi isännöidä ääretöntä additiivisesti neliötöntä sanaa | tyhjentävä haku, todistuskappaleineen | 54 |

**Huom. rajaus:** jokainen näistä on suljettu **ilmoitetussa ikkunassa**.
"Ei kata L ≥ 6" tai "ei kata 5 kirjainta" ei ole pikkuvaraus vaan osa väitettä.

---

## 4. Hylätty varmuudella — lähestymistavat ja hypoteesit

Mitattuja, ei arvattuja. Täydet perustelut `NEGATIVE_RESULTS.md`:ssä; alla
yhden rivin tiivistys ja se **mitä opetus yleistää**.

| # | Mikä hylättiin | Miksi lopullisesti |
|---|---|---|
| 1 | Uniformien morfismien skannaus k = 7…9 | Maksimipituus on otoskoon logaritmi (rivi 37). Kasvu tulee vaikka matematiikka ei tekisi mitään |
| 2 | Rauzy-graafin SCC äärettömyyden todisteena | Abelin ehto on globaali, SCC on lokaali. Erinomainen esisuodatin, nolla todistusarvoa |
| 3 | Ennätyssanan käänteismallinnus morfismiksi | Kompleksisuus kasvaa eksponentiaalisesti (rivi 42). Sääntöä ei voi purkaa koska sitä ei ole |
| 4 | "Morfismi pitää Parikh-epätasapainon pienenä" | Mitattu päinvastoin, ja väärin kummallakin tavalla (rivi 42) |
| 5 | FORBID4 universaalisti kuolettavana sääntönä | Esiintyy 2 820 kertaa ennätyssanassa (rivi 41). Globaali kielto tekisi ennätyksen mahdottomaksi |
| 6 | "Rosetta-filtteri" ennätyssanan tekijöistä | Hylkäisi 88 % laillisista jatkoista. Ylisovitus, katto eikä ponnahduslauta |
| 7 | Säiliörelaksaatio additiivisena eliminaatiotyökaluna | Ei kuollut saavutettavilla ikkunakoilla; kustannus \|A\|^(2k−1). Eliminaatio on hakukysymys |
| 8 | Jatkettavuustaulu ennätysjahdin kiihdyttimenä | **Sama pisin sana** karsittuna ja karsimattomana. Branch-and-bound ei pure kun paras kasvaa koko ajan |
| 9 | Karsintataulun nettovoitto yhdessä ajossa | 1,00×. Rakentaminen maksaa yhden haun; arvo on **yksinomaan** uudelleenkäytössä |
| 10 | Määritelmätason verifioija riippumattomana tarkistajana | Toimi virheettömästi mutta **ei yltänyt omaan kohteeseensa**. Riippumattomuuden akseli oli väärä |

**Rakenteellisilla perusteilla hylätyt ideat** (`OPEN_RESEARCH_QUESTIONS.md` D):
hyperbolinen Parikh-avaruus (menettää additiivisuuden), spektraalikuilu
morfismin *oikeellisuuden* ennustajana (insidenssimatriisi kadottaa
järjestyksen), QBF ennen äärellistä kriteeriä (käännös **on** se vaikea osa),
"murtolukuresonanssi" Dejeanille (todistettu), SAT-backbone ternäärihaulle
(tyhjä S₃-symmetrian nojalla), SWAR-bittipakkaus JS:ssä (32-bittiset
operaattorit; pullonkaula ei ole siellä), sekä holografia, Navier–Stokes,
Gödel-itseviittaus, SETI ja kvanttilomittuminen (ei koodattavaa ydintä).

**Muotoilut jotka mittaavat toteutusta eivätkä matematiikkaa**
(`OPEN_RESEARCH_QUESTIONS.md` C): hakupuun geometria, faasimuutos haussa,
selviytymisfunktio, entropia syvyydellä, "search ecology", sanojen "DNA".
Nämä eivät ole kiellettyjä mitattavia — niiden **tuloksia ei saa esittää
kielen ominaisuuksina**.

---

## 5. Peruutetut väitteet — mitä on väitetty ja vedetty pois

Peruttua riviä ei poisteta, jottei sitä lisätä uudelleen.

| Mitä väitettiin | Miksi peruttu | Rivi |
|---|---|---|
| h₆ on johdettu Hall–Janko-ryhmästä | Ei löytynyt mitään tukea | 8 |
| Gavrilenkon toteutusta koskeva väite | — | 14 |
| `seam-hpc-cli --mode=p6` auditoi konstruktion | Se ei ladannut `morphisms.js`:ää lainkaan ja tulosti kovakoodatun nollan | 26 |
| SIAM-julkaisuviite ja DOI konstruktiolle | arXiv näyttää `Journal ref: (none)`; kukaan ei ole avannut julkaisijan sivua | 23 |
| Alkuperäinen yhdistetty muotoilu, jossa 34 neliötä ja Theorem 9 olivat samassa väitteessä | Kaksi eri väitettä ja kaksi eri lähdettä yhdessä; korvattu muodoilla 6a ja 6b | 6c |
| Theorem 6 ensimmäisellä yrityksellä | Ei ollut verifioitu; **johdettu myöhemmin uudelleen kunnolla riville 46** | 43 |

---

## 6. Auki

**Kirjallisuuden avoimet ongelmat** (`OPEN_RESEARCH_QUESTIONS.md` A):
Mäkelän konjektuuri K = 2…5 (A1, rivi 4), abelin toistokynnys osittain (A2),
Keräsen epäsuotuisat tekijät yksisuuntaisella jatkettavuudella (A4, rivi 38),
**additiiviset neliöt ℤ:ssa (A6, rivi 53)**.

**Projektin omat laskettavat kysymykset** (osio B): FORBID4:n minimaalisuus
(B1), kasvunopeuden kuilu (B2), välttämättömät joukot (B3), Rauzy-rakenne
(B4), reitin (c) seuraava kerros (B5), säiliön jatkot (B6), säiliön
välttämättömät tekijät (B7), taajuusmonikulmio (B8), **tasapainoisten
aakkostojen dikotomia (B9)**.

---

## 7. Ei saa käyttää — jäljittämätön

Näitä ei ole avattu primäärilähteestä. **Älä siteeraa, älä rakenna varaan,
älä kirjaa A-osioon** ennen jäljitystä.

| Väite | Missä |
|---|---|
| "5 ≤ g(2) ≤ 734" Rosenfeldin väitöskirjan Problem 4.9:nä | A5 |
| Walnutin kattavuus abelin ominaisuuksille | E4 |
| Freedman-attribuutio: 4 kirjainta, a+d = b+c, raja ≤ 60 | rivi 53 |
| 2025 variaatiopaperi additiivisista neliöistä (arXiv:2506.21200) | rivi 53 |

**Freedman on kriittisellä polulla.** Se osuu suoraan rivin 54 tasapainoisiin
luokkiin ja arvoon 60. Jos lähde avataan ja se pitää paikkansa, osa rivistä 54
on **replikaatio eikä uusi tulos** — ja se ratkaisee mitä koko additiivisesta
lakaisusta saa sanoa uutena. Tätä ei ole tehty.

---

## 8. Työkalut ja niiden mitatut rajat

Sanalab-koneisto on olemassa, ja **kaksi kolmesta viimeisimmästä työkalusta
kantaa mitatun rajauksen omalle hyödylleen**. Se on tarkoituksellista
kirjanpitoa, ei vaatimattomuutta.

| Työkalu | Mitä se antaa | Mitattu raja | Rivi |
|---|---|---|---|
| Jatkettavuustaulu | terve karsinta, 84–89× hakusolmuissa | rakentaminen maksaa yhden haun; ei auta ennätysjahdissa lainkaan | 55 |
| Jatkettavat ajot | k ajoa budjetilla B = yksi ajo budjetilla k·B, solmumäärää myöten | — (tämä on se joka ennätyksiä oikeasti auttaa) | 56 |
| Taulukirjasto | yksi taulu per affiiniluokka, sisarukset ilmaiseksi | **1,03×** demonstraatiossa; säästö = toistuvien luokkien hinta, ei enempää | 57 |

**Tulkinta:** infran rajahyöty on laskeva. Seuraava askel kuuluu matematiikan
puolelle — ks. osio 7 ja `NEXT_STEP.md`.
