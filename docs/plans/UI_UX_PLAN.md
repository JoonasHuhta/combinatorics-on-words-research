# UI_UX_PLAN.md — käyttöliittymäideat, arvioitu backlog

**Päivitetty:** 2026-07-30
**Tila:** PARKED — ei aikataulua, ei hyväksyntää toteutukselle.
**Suodatin:** UI-ominaisuus kelpaa vain jos se mahdollistaa tutkimusta tai
opettaa tutkimisen tapaa. Jokainen UI-ominaisuus on tähän mennessä maksanut
driftitarkistusbudjettia (entiteetit, LaTeX, emojit) — se on todellinen
kustannus, ei retoriikkaa. Tämä dokumentti ei sisällä matemaattisia väitteitä
(sääntö 7); kaikki luvut ovat osoittimia `MATH_CLAIMS.md`:n riveihin.

---

## 1. "UI ei siteeraa — se lukee lokia" (arkkitehtuurikorjaus) — **PERUSTA TEHTY 2026-07-30**

**Tehty:** `claims-export.js` (`MATH_CLAIMS.md` rivi 61) emittoi `claims.json`:n
ja pakottaa säännön: **sivu saa näyttää luvun vain jos se on lokin
`QUOTABLE_FACTS`-lohkossa ja esiintyy kirjaimellisesti siinä rivissä johon se
viittaa.** `REJECTED`-riviä ei voi lainata koskaan. 11 lukua määritelty.
Ajaminen: `node claims-export.js`. Kytketty driftitarkistukseen (6g) ja
testiin 36.

**Kytkentä ALOITETTU 2026-07-31, ei valmis.** `claims-export.js` synkkaa nyt
myös `index.html`:n upotetun `<script id="claims-data">`-lohkon (ei fetch,
toimii ilman palvelinta). Elementit joissa on `data-claim-status="<rivi>"`
tai `data-claim-key="<avain>"` täyttyvät sivun latautuessa lokista, eivätkä
voi jäädä jälkeen — `node test.js` (testi 40) vertaa upotettua lohkoa tuoreeseen
vientiin ja kaatuu jos ne eroavat. **Sidottu tähän mennessä:** 9
statusbadgea "Validation Lab" -välilehden Module 0 -taulukossa (riveihin 1,
2, 3, 4, 5, 6a, 7, 8, 9) ja 1 lukuarvo ("34 distinct squares" → rivi 6b).

**Jäljellä:** loput Module 0:n ja "Exact Algebraic Results" -taulukon
badgeista (kymmeniä), ja koko sovelluksen muut käsin kirjoitetut luvut.
Sidonta tehdään yksi rivi kerrallaan sitä mukaa kun sisältö varmennetaan
oikeaksi ledger-riviksi (ei massana — sama periaate kuin väitelokin
englanninkielisessä käännöksessä, sääntö 8). Module 0:n taulukon oma
"#"-sarake **ei** ole sama kuin väitelokin rivi-ID (esim. taulukon rivi 6
vastaa lokin riviä 6a) — sitominen vaatii sisällön tarkistamisen jokaiselle
riville erikseen, ei suoraa numeroiden kopiointia.

**Miksi tämä nousi kärkeen juuri nyt:** projektista tehtiin ulkopuolella
infografiikka, jossa luki ennätyssanan pituudeksi "~2 026" — lukua jota ei ole
missään tässä repositoriossa (jokainen 2026 väitelokissa on päivämäärä). Juliste
oli muuten hyvä ja rakenteeltaan juuri se mitä tämä dokumentti kaipaa; ongelma
oli että se kirjoitettiin käsin. **Se on tämän kohdan koko perustelu yhdessä
tapauksessa.**

### 1b. Juliste generoituna, ei käsin kirjoitettuna

Ulkopuolinen infografiikka (2026-07-30) on hyvä **malli**: määritelmä,
keskeinen kysymys, nykytila, menetelmät, koeputki, negatiiviset tulokset,
yhteenveto. Se kannattaa toteuttaa **generoituna** `claims.json`:sta:
jokainen luku tulee lokista ja kantaa rivinumeronsa, ja luku jota ei ole
lokissa ei yksinkertaisesti renderöidy. Silloin julisteen voi päivittää
ajamalla komennon, eikä se voi vanhentua hiljaa.

## 1a. Alkuperäinen muotoilu (säilytetty)

**Ongelma:** tieteelliset luvut on kopioitu HTML:ään ja driftitarkistin vahtii
kopioita jälkikäteen. Kaksi totuuslähdettä on projektin toistuvin vikatila.

**Ratkaisu:** `check-claims-drift.js` laajennetaan emittoimaan `claims.json`
suoraan `MATH_CLAIMS.md`:stä. Sovellus renderöi luvut, statukset (Level 1/2 /
REJECTED) ja sitaatit datasta; jokainen näytöllä näkyvä luku linkittyy
lokiriviinsä. Kaksoistotuus muuttuu rakenteellisesti mahdottomaksi.

**Ilmainen tutkimushyöty:** "viimeksi yritetty jäljittää" -sarakkeen ikä
värjätään → säännön 6 periodinen uudelleentarkistus saa näkyvän työjonon.

**Työmäärä:** parseri + emitteri ~1 sessio; UI-integraatio erikseen.
**Riski:** MATH_CLAIMS.md:n taulukkomuodon on pysyttävä koneluettavana —
parseri kannattaa kirjoittaa driftitarkistimen yhteyteen jolloin rikkoutuminen
havaitaan heti.

## 2. Säiliömikroskooppi (paras uusi tutkimus-UX)

Käyttäjä kirjoittaa sanaa kirjain kerrallaan; sovellus kävelee
K ∈ [2,5]-säiliögraafia reaaliajassa (rivi 51): nykyinen tila, sallitut
jatkot, ja kielletyistä **täsmällinen kuolinsyy** — mikä abelin neliö
täydentyisi, molemmat puoliskot korostettuina ja Parikh-vektorit rinnakkain.

Vastaa "Explore"-pilarin kysymykseen *"miksi tämä kaatui tässä"* invariantilla
objektilla, ei hakuheuristiikalla — opettaa kieltä, ei toteutusta. Data:
`sft-container.js` eksportoi tilat/särmät JSON:iksi; laskenta pysyy Nodessa,
selain raportoi (nykyinen työnjako säilyy).

**Työmäärä:** JSON-eksportti pieni; UI-näkymä keskikokoinen.

## 3. Hautausmaakierros (pedagogiikka jota muilla ei ole)

`NEGATIVE_RESULTS.md` + REJECTED-rivit tapauskertomuksina: uskottava hypoteesi
→ miksi se vakuutti → mittaus joka kaatoi sen → sääntö joka syntyi. Oikealla
datalla (esim. otoskokosovite rivi 37, Parikh-epätasapaino rivi 42).
"Miten matemaatikko ajattelee" näytettynä oikeana jälkenä. Sisältö on jo
olemassa — vain esitysmuoto puuttuu. **Työmäärä:** pieni, staattinen.

## 4. Lokaalin ohjelman tulos-UX: "tulos on lokirivi"

CLI tulostaa ajon lopuksi valmiin, kalibroidulla kielellä muotoillun
tulosblokin + JSON-sertifikaatin (parametrit, commit-hash, osite), jonka voi
liittää sellaisenaan projektiin. Löytäjän kokemus ei ole "kuinka pitkälle
pääsin" vaan "tässä on rivini". Ks. `NEXT_STEP.md`:n suunnittelusääntö ja
`SANALAB_PLAN.md`. **Työmäärä:** pieni lisäys olemassa oleviin CLI:hin.

## 5. Luettavuus ulkopuoliselle — kolme asiaa joita ei ole otettu huomioon (RESEARCH_ARCHITECT-ajo 2026-07-30)

Lähtökohta, joka on syytä sanoa suoraan: **projektin harvinaisin omaisuus ei ole
yksikään matemaattinen tulos vaan `NEGATIVE_RESULTS.md` ja väitelokin
kaksitasoinen statusjärjestelmä.** 14 dokumentoitua umpikujaa perusteineen ja
kalibroitu kieli joka erottaa *"ei rikkomuksia välillä [a,b]"* sanasta
*"todistettu"*. Oppikirja näyttää onnistuneen polun; tämä repositorio näyttää
sen hinnan päivämäärineen. Kohta 3 esittää tämän tapauskertomuksina — alla
kolme asiaa jotka jäävät siltäkin varjoon.

**(a) Epistemologinen status ei näy sivulla.** Level 1, Level 2 ja `REJECTED`
ovat lokissa mutta eivät käyttöliittymässä. Vierailija ei voi erottaa
toistettua kirjallisuustulosta projektin omasta laskennasta, eikä nähdä että
osa riveistä on **peruttu**. Tämä on kohta 1 (`claims.json`-kytkentä) ja se on
ainoa UI-työ joka läpäisee `RESEARCH_ARCHITECT.md` §1:n suodattimen, koska se
poistaa vikatilan rakenteellisesti eikä vain lisää ominaisuuden.

**(b) Vierailija ei voi kumota mitään.** Jokainen välilehti näyttää tuloksen.
Yksikään ei anna ajaa tarkistusta joka voisi mennä **kumpaan suuntaan tahansa**
ja nähdä sen menevän. Falsifioitavuus on se taito jota projekti opettaa
dokumenteissaan mutta ei sovelluksessaan. Halvin muoto: tarkistus jonka
syötteen vierailija valitsee, ja jonka tulos on joskus "ei täsmää".

**(c) Protokolla ei ole luettavissa ulkopuolelta, ja se on
tutkimuksellinen ongelma eikä tyylikysymys.** `AGENTS.md`,
`RESEARCH_CONTEXT.md`, `NEXT_STEP.md` ja väitelokin rivit ovat suomeksi.
Sääntö 8 on jo päättänyt suunnan ja perustelun — *"väite jota ulkopuolinen ei
voi lukea ei ole tarkistettavissa"* — mutta ydindokumentit ovat kääntämättä.
Mahdollinen yhteistyökumppani näkee siis tuloksia, joiden **luotettavuuden
perustelu on hänelle lukukelvoton**, mikä kääntää järjestyksen väärin päin:
juuri se osa jonka pitäisi kestää ulkopuolinen tarkastelu on ainoa jota
ulkopuolinen ei pysty lukemaan. Migraatio tapahtuu rivi kerrallaan kun riviä
muutenkin kosketaan (sääntö 8), joten tämä ei ole massaurakka vaan päätös
aloittaa — ja `MATH_CLAIMS.md`:n kohdalla massakäännös on **kielletty**, koska
kalibroitu kielenkäyttö on juuri se mikä siinä katoaisi.

**Työmäärä:** (a) on kohta 1. (b) pieni, yhden välilehden kokoinen. (c) ei
erillistä työmäärää, vaan sääntö olemassa olevaan työhön.
**Vaikuttavuus 2–3** — rehellinen luku: tämä ei tuota uutta matematiikkaa,
vaan tekee olemassa olevasta tarkistettavaa. Se on eri asia.

---

## Mitä EI tehdä

- Ennätystaulukot tai pistegamifikaatio — ennätysjahti on hylätty työtapa
  (`NEXT_STEP.md`, `NEGATIVE_RESULTS.md` §3, §6)
- Hakutelemetrian dashboard "kielen ominaisuutena" — C-osio
- Chat-assistentti sovelluksen sisään — ei tutkimus- eikä opetusperustetta
- Uusia välilehtiä ilman että kohta 1 on tehty ensin: jokainen uusi
  käsin kirjoitettu luku UI:ssa kasvattaa kaksoistotuuden pinta-alaa

## Suositeltu järjestys

1 → 2 → 3 → 4. Kohta 1 ensin, koska se pienentää kaikkien myöhempien
UI-töiden riskiä; kohta 7 (`NEXT_STEP.md`:n ennätyssanarekisteri) hyötyy
siitä samalla.
