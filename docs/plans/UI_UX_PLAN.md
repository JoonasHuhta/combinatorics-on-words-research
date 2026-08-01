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

## 6. Navigation: the proposed three-way split, and the test it fails (2026-08-01)

*(Written in English per rule 8. The sections above remain in Finnish and are
migrated one at a time as they are touched anyway — not as a mass rewrite.)*

**The proposal under review.** Replace the flat grid of 20 tabs with three
narrative sections: **Learn** (tutorial and intro) → **Try** (sandbox) →
**Research** (raw data, graphs, affine classes, the claims ledger).

**The diagnosis it gets right, and it is worth saying first.** A flat grid of
20 equally-weighted tabs encodes no reading order. A first-time visitor has no
way to tell that the tutorial is the entry point and the Seam Search tab is
not. That is a real defect and the proposal identifies it correctly.

**The test any proposed taxonomy must pass, applied.** Every existing tab must
have exactly one obvious home; a category scheme that needs arbitrary judgment
calls will be re-litigated on every future tab. Applying the three-way split to
the actual 20 tabs:

| Tab | Home under Learn/Try/Research |
|---|---|
| Tutorial, 7 Timeline, 10 Concept Graph, 15 Applications | Learn — clean |
| 2 ABC Lab, 6 Try It, 13 Snake | Try — clean |
| 3 g₈₅, 8 Unfavorable Factors, 11 Morphism Lab, 12 Heat Map, 14 AA2FR, 18 Seam Search | Research — clean |
| 1 Tree Search, 4 2D Walk, 5 Sonification, 9 Microscope | ambiguous — visualization of research data that the user also drives |
| 17 Art & Math Gallery | **no home** |
| 16 Validation Lab, 19 The Graveyard | **no home** |

Four ambiguous and three homeless out of 20. That alone would only argue for a
fourth category. **What makes it worth writing down is *which* tabs are
homeless.**

**The finding: two independent artifacts both demote the epistemology from
goal to substrate.** The three-way split has no place for the Validation Lab
or the Graveyard. The layered diagram proposed in the same session places the
claims ledger, validation and agent protocol in *Level 1, infrastructure* —
plumbing beneath the research, feeding it upward.

Both are in direct conflict with what this project's own two entry documents
say:

- `RESEARCH_CONTEXT.md` §1 states the human-AI methodology as **the second
  goal, "stated explicitly because it is easy to mistake for a by-product"** —
  co-equal with the mathematics, not underneath it.
- This document's own §5 states it more bluntly: **"the project's rarest asset
  is not any mathematical result but `NEGATIVE_RESULTS.md` and the ledger's
  two-level status system."**

Two artifacts, produced independently, made the same demotion. That is a
signal about how the project presents itself when nobody is guarding this
specific point, and it is cheap to guard: **any navigation scheme must have a
top-level home for "how we know this", not a subfolder of Research.**

**Recommendation: keep the grid, add group headers — do not replace it.**
The grid is a *directory*, which is the right shape for a returning reader who
knows what they want (the maintainer's stated preference, and correct). The
proposal solves a *first-visit* problem. These are different users and the fix
is not to trade one for the other. Group headers over the existing grid give
both: reading order for newcomers, one-click access for returners, and the
change is CSS and four headings rather than a navigation rewrite.

Four groups, under which every one of the 20 tabs has a home:

1. **Learn** — Tutorial, 7 Timeline, 10 Concept Graph, 15 Applications
2. **Explore** — 1 Tree Search, 2 ABC Lab, 6 Try It, 13 Snake, 4 2D Walk,
   5 Sonification, 17 Gallery
3. **Research** — 3 g₈₅, 8 Unfavorable Factors, 9 Microscope, 11 Morphism Lab,
   12 Heat Map, 14 AA2FR, 18 Seam Search
4. **How we know it** — 16 Validation Lab, 19 The Graveyard

Group 4 is the one the three-way split loses, and it is the group no comparable
site has.

**Sequencing constraint, unchanged.** This is presentation work and it is
subordinate to item 1 (`claims.json` wiring). Regrouping tabs does not reduce
the double-truth surface; §"Mitä EI tehdä" already forbids new tabs before
item 1, and reorganising existing ones should not become a way around that
rule. **Effort:** small (CSS + headings). **Impact:** 2 — it makes the existing
material findable, which is not the same as making it more correct.

## 7. The layered diagram: what it gets right, and two corrections (2026-08-01)

A three-level diagram was proposed for the project's structure: Level 1
AI-research platform and epistemic machinery → *"produces reliable data"* →
Level 2 scientific production, *"solving Mäkelä's conjecture"* → *"produces
teaching material"* → Level 3 pedagogy.

**What it gets right, and this is a genuine insight:** the ordering constraint
is real. The ledger and the validation machinery had to exist *before* any
research output from this project could be trusted, and that is in fact the
project's history — the claims ledger came early and shaped everything after
it. A diagram that puts verification underneath production is describing a
real dependency, not an arbitrary one.

**Correction 1 — the arrows run both ways, and the upward-only version is
contradicted by this repository's own record.** Documented instances of the
presentation layer correcting the research layer:

- The `claims.json` wiring (§1) "immediately revealed two wrong status badges"
  — a UI task that fixed ledger-facing errors.
- The externally produced infographic quoting a record-word length of
  "~2 026", a number that exists nowhere in this repository (§1). That artifact
  is the entire justification for the generated-not-handwritten architecture.
- The double-escaped and fabricated `&subN;` entities (`NEXT_STEP.md`,
  rows 69–71 session): 51 + 21 defects that the drift guard reported as 15/15
  passing the whole time.

A strictly upward pipeline would predict none of these. **The pedagogical and
presentation layers are a test harness for the research layer**, not only its
consumer, and any diagram of this project should show a return arrow.

**Correction 2 — "solving Mäkelä's conjecture" is not a deliverable this
project may put in a box.** By rule 3 and the standing calibration, what the
pipeline actually produces is *bounded, exhaustive negative results with the
window stated*. `NEXT_STEP.md` Step 2 records the sharper version: the project
has produced ~15 exhaustive negatives and **not one case where the apparatus is
known to find something that exists**. Until a positive control passes, a
diagram promising a solved conjecture as Level 2's output overstates the
apparatus in exactly the direction `NEGATIVE_RESULTS.md` §17 was flagged for.
The calibrated label is *"bounded results and negative results, each with its
window"*.

**One thing to keep visible about the audiences.** The diagram assigns
audiences — AI developers, mathematicians and researchers, students and
teachers. Today the actual readership is one maintainer and a series of AI
agents. That is not an objection to the diagram, which is aspirational by
design and belongs with `LAB_VISION_2035.md`; it is a note that the aspiration
should be labelled as one wherever the diagram is published, so it does not
read as a description of current use.

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
