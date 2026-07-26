# AGENT WORKFLOW & MATHEMATICAL CLAIMS PROTOCOL
*(Tämä ohje on pakollinen luettava ja noudatettava kaikille tekoälyagenteille ja kehittäjille tässä repositoriossa)*

## Matemaattisten väitteiden protokolla (pakollinen kaikille sessioille)

1. **SITAATTI ENNEN KOODIA:** Jos aiot kirjoittaa tekijä/vuosi/lehti/lausenumeroviittauksen mihin tahansa tiedostoon (koodi, MD, UI-teksti), sinun on ensin haettava ja avattava se lähde (DOI/arXiv-tunniste) ja siteerattava lyhyesti (max ~15 sanaa) tarkka kohta josta väite tulee. "Muistan että joku sanoi..." tai toisen käden mukailu (esim. toisen nettisivun kuvaus paperista) EI riitä primäärilähteeksi — se on sekundäärilähde ja pitää merkitä sellaiseksi.

2. **KAKSI TASOA, EI YHTÄ:** Jokainen morfismi/vakio/väite `MATH_CLAIMS.md`:ssä saa jommankumman statuksen, ei koskaan implisiittisesti kumpaakaan:
   - `LEVEL_1_INTERNAL_CHECKSUM`: todistaa vain ettei data ole muuttunut commitien välillä. EI todista ulkoista oikeellisuutta.
   - `LEVEL_2_VERIFIED_SOURCE`: joku on avannut primäärilähteen ja verrannut merkki merkiltä / lause lauseelta. Vaatii URL/DOI + päivämäärä + lyhyt sitaatti tallennettuna väitteen viereen.
   Oletusarvo uudelle datalle on AINA Level 1, ei koskaan Level 2, ellei verifiointi ole juuri tapahtunut ja dokumentoitu.

3. **KIELEN KALIBROINTI äärellisille tarkistuksille:** käytä ilmauksia "ei rikkomuksia löydetty välillä [a,b]" tai "N merkin etuliitteessä" - älä koskaan "confirmed", "proven", "certified" ilman että vieressä lukee tarkka rajattu ikkuna jota tarkistus koski.

4. **PROVENIENSSI KIRJATAAN HETI, EI JÄLKIKÄTEEN:** kun generoit, poimit tai johdat merkkijonon/vakion mistä tahansa lähteestä (toinen paperi, nettisivu, oma haku/louhinta), kirjoita SAMAAN commit-viestiin tarkalleen mistä se tuli ja miten varma olet. "En ole varma mistä tämä tuli" on hyväksyttävä ja toivottu commit-viestin lause jos se on totta — parempi kuin keksitty tarkkuus, jota joudutaan myöhemmin puramaan oikeuslääketieteellisesti.

5. **IHMISEN HYVÄKSYNTÄ ENNEN COMMITTIA/PUSHIA** kun muutos koskee `MATH_CLAIMS.md`:tä, `morphisms.js`:n kanonista dataa, tai mitä tahansa UI-tekstiä joka esittää tieteellisen väitteen tai badge-tilan. Rutiinibugikorjaukset (esim. tietotyyppien ylivuotokorjaukset), jotka eivät riipu ulkoisesta lähteestä, voi committaa itsenäisesti.

6. **PERIODINEN UUDELLEENTARKISTUS:** kun Level 1 -väitteitä kertyy, älä anna niiden jäädä ikuisesti "empiiriseksi" oletusarvoksi ilman että kukaan koskaan yrittää nostaa niitä Level 2:een. Lisää Väitelokiin sarake "viimeksi yritetty jäljittää: [pvm]" jotta nähdään mitkä väitteet ovat vanhentuneet ilman että kukaan on edes yrittänyt.
