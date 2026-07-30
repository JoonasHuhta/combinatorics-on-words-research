# UI_UX_PLAN.md — käyttöliittymäideat, arvioitu backlog

**Päivitetty:** 2026-07-30
**Tila:** PARKED — ei aikataulua, ei hyväksyntää toteutukselle.
**Suodatin:** UI-ominaisuus kelpaa vain jos se mahdollistaa tutkimusta tai
opettaa tutkimisen tapaa. Jokainen UI-ominaisuus on tähän mennessä maksanut
driftitarkistusbudjettia (entiteetit, LaTeX, emojit) — se on todellinen
kustannus, ei retoriikkaa. Tämä dokumentti ei sisällä matemaattisia väitteitä
(sääntö 7); kaikki luvut ovat osoittimia `MATH_CLAIMS.md`:n riveihin.

---

## 1. "UI ei siteeraa — se lukee lokia" (arkkitehtuurikorjaus, tärkein)

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
