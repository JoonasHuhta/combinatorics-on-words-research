# SKILLS_PLAN.md — parkkeerattu suunnitelma

**Tila:** PARKED 2026-07-29. Ei hyväksytty, ei aikataulua. Tämä on työkaluinfraa
koskeva muistio, ei auktoriteetti millekään.

**Sääntö 7 -huomautus:** tämä tiedosto ei sisällä eikä saa koskaan sisältää
matemaattisia väitteitä tai lukuja. Jos tänne ilmestyy väite, se kuuluu
`MATH_CLAIMS.md`:hen.

---

## Tausta

Analyysi 2026-07-29: repositorion turvakaiteet ovat tyyppiä *sääntö*
(`AGENTS.md`) tai *jälkikäteinen ilmaisin joka pitää muistaa ajaa* (`test.js`,
`check-claims-drift.js`). Dokumentaatio on pull-tyyppistä — agentin pitää
päättää lukea oikea tiedosto oikealla hetkellä. Claude-skillin kuvaus on
push-tyyppinen: se laukeaa tehtävän muodosta. Ainoa rako jossa skillit toisivat
lisäarvoa on **haun ajoitus**, ei puuttuva tieto.

## Suunnitteluperiaatteet (jos toteutetaan)

1. **Skill viittaa, ei toista.** Ei yhtäkään lukua, vakiota, morfismia tai
   väitettä skilliin — vain työjärjestys ja osoitin `MATH_CLAIMS.md`:hen.
   Skill joka toistaa väitteen on toinen totuuslähde.
2. **Skill on neuvova, ei pakottava.** Mikään kantava oikeellisuustarkistus ei
   saa siirtyä driftitarkistuksesta skilliksi. Sallittu suunta on päinvastainen:
   skillin tehtävä on saada agentti kirjoittamaan lisää driftitarkistuksia.
3. **Kuvaukset kaksikielisinä** (fi + en avainsanat), muuten skill ei laukea
   suomenkielisessä sessiossa.

## Kolme kandidaattia, prioriteettijärjestyksessä

1. **`sitaatti-primaarilahteesta`** — menettely: ar5iv vs. abs, PDF-uuttajat,
   poissaolon todentaminen koko tekstistä, väitelokirivin 7 saraketta,
   uusi tarkistus `check-claims-drift.js`:ään. Perustelu: projektin kalleimmat
   virheet ovat olleet sitaattivirheitä, eivät matematiikkavirheitä.
2. **`uusi-eksakti-moduuli`** — konventiot etukäteen: itsensä todentava,
   poikkeus ennemmin kuin väärä tulos, ei liukulukuja tulospolulla, rajattu
   kieli tulosteessa, rekisteröinti `RESEARCH_CONTEXT.md` §3:een ja `test.js`:ään.
3. **`luokittele-tutkimusidea`** — `OPEN_RESEARCH_QUESTIONS.md`:n A/B/C/D-jaottelu
   sovellettuna idean syntyhetkellä. Päätössääntö: jos muotoilu riippuu
   hakujärjestyksestä, se on C-osiota.

## Skillejä arvokkaammat toimet (havaittu samassa analyysissä)

- **Hookit puuttuvat kokonaan.** `PreToolUse`-hook `git commit`ille joka ajaa
  `node test.js` ja `node check-claims-drift.js` tekisi "aja molemmat ennen
  committia" -säännöstä rakenteellisen. Yksi konfiguraatiolohko.
- **`CLAUDE.md` on ajautunut irti `AGENTS.md`:stä:** sääntö 7 (väitelokin
  yksinoikeus) puuttuu `CLAUDE.md`:stä, joka on ainoa automaattisesti ladattava
  tiedosto. Synkronointi koskee väiteprotokollaa → ylläpitäjän hyväksyntä
  ennen committia (säännön 5 henki).

## Mitä ei tehdä

- Ei `AGENTS.md`:n kopiota skilliksi (toinen totuuslähde).
- Ei "tutkimusassistentti"-megaskilliä joka lupaa löytöjä (C-osion tavaraa).
- Ei skilliä `index.html`:n muokkaukseen — tiedoston koko on eri ongelma.
