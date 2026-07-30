# Combinatorics on Words — Experimental Mathematics Laboratory

Kokeellisen matematiikan laboratorio sanojen kombinatoriikkaan: eksakteja
laskuja abelin ja additiivisten neliöiden välttämisestä, jokainen tulos
kirjattuna, lähteistettynä ja toistettavana.

**Päätutkimuskohde on Mäkelän konjektuuri** — onko olemassa ääretön
ternäärisana jonka ainoat abelin neliöt ovat `00`, `11`, `22`? Auki
puolipituuksille K = 2…5. Toinen kohde on **additiivisten neliöiden**
välttäminen kokonaislukuaakkostoilla, joka on niin ikään avoin.

## Mikä tässä on erilaista

Laboratorion arvokkain osa ei ole hakualgoritmi vaan **episteeminen
koneisto**, joka pitää kirjaa siitä mitä oikeasti tiedetään:

- **`MATH_CLAIMS.md`** on ainoa auktoriteetti jokaiselle matemaattiselle
  väitteelle. Jokaisella on lähde, vahvistustaso ja päivämäärä. Level 2
  tarkoittaa että joku on avannut primäärilähteen ja verrannut sanatarkasti;
  Level 1 tarkoittaa että laskenta on toistettavissa mutta ulkoista
  tarkistusta ei ole. Oletus on aina Level 1.
- **Peruttua väitettä ei poisteta.** Se jää näkyviin `REJECTED`-tilassa
  perusteineen, jottei sitä lisätä uudelleen.
- **`NEGATIVE_RESULTS.md`** on umpikujien arkisto. Sinne kuuluu myös idea
  joka toimi mutta ei kannattanut, ja työtapa joka osoittautui vääräksi
  vaikka sen tuotos oli virheetön.
- **`check-claims-drift.js`** vartioi kaikkea tätä koneellisesti. Se hylkää
  ylisanat ohjelmien tulosteista, roikkuvat lähdeviitteet ja rapautuneet
  dokumentit. Se on useammin kuin kerran napannut kirjoittajansa.

Käytännön seuraus: äärellinen tarkistus raportoidaan aina ikkunoineen
("ei rikkomuksia välillä [a,b]"), ei koskaan sanoilla *proven* tai
*certified* ilman rajausta.

## Mistä aloittaa

| Haluat | Lue |
|---|---|
| Kokonaiskuvan: mitä tiedetään, mikä on suljettu | **`KNOWLEDGE_STATE.md`** |
| Työskennellä repossa (ihminen tai tekoäly) | **`RESEARCH_CONTEXT.md`**, sitten **`AGENTS.md`** |
| Tarkistaa yksittäisen väitteen | **`MATH_CLAIMS.md`** |
| Tietää mikä on auki | **`OPEN_RESEARCH_QUESTIONS.md`** |
| Tietää mikä on jo kokeiltu ja kaatunut | **`NEGATIVE_RESULTS.md`** |
| Jatkaa työtä | **`NEXT_STEP.md`** |

## Rakenne

```
*.js                 eksakti Node-putki, riippuvuudeton; jokainen moduuli
                     todentaa itsensä ja heittää poikkeuksen ennemmin kuin
                     palauttaa virheellisen tuloksen
index.html           selainsovellus: opetus ja visualisointi. Se RAPORTOI
                     tuloksia, ei laske niitä
docs/plans/          elävät suunnitelmat (sanalab, UI/UX, prosessit)
docs/historical/     vanhentuneet suunnitelmapaperit — älä nojaa niihin
papers/              kirjallisuus (gitignore)
datasets/            ennätyssanat (gitignore, tekijöiden dataa)
```

## Ajaminen

Ei riippuvuuksia, ei asennusta. Node ja selain riittävät.

```bash
node test.js                 # matematiikan regressiotestit
node check-claims-drift.js   # väitteiden, sitaattien ja UI-tekstin vartija
```

Aja molemmat ennen committia ja **lue molempien tuloste** — ne testaavat eri
asioita. Yksittäiset moduulit ajetaan suoraan, esim.

```bash
node sft-container.js --kmax 6
node additive-sweep.js --letters 4 --span 8
node sanalab-run.js --alphabet 0,1,2,8 --budget 20000000 --state s.json
```

## Työtapa, joka on tässä ansaittu

Yksitoista kertaa uskottava yleistys osoittautui vääräksi vasta ajossa.
Yksikään ei olisi kaatunut silmämääräisessä tarkistuksessa. Siitä seuraa
kolme sääntöä, jotka koskevat myös tekoälyavustajia:

1. **Aja se.** Väite ilman ajettua koodia on hypoteesi.
2. **Vertaa HEAD:iin, älä silmällä.**
3. **Perustelematon kuollut koodihaara on ansa seuraavalle.**

Tekoäly ei tuota tässä matemaattista totuutta. Se auttaa etsimään, arvioimaan
ja kyseenalaistamaan — todiste tulee aina ajetusta, verifioidusta laskennasta.

## Lisenssi ja lähteet

Kirjallisuus (`papers/`) ja ennätyssanat (`datasets/`) ovat tekijöidensä
aineistoa eikä niitä levitetä tästä repositoriosta. Kaikki siteeratut työt on
merkitty `MATH_CLAIMS.md`:hen DOI- tai arXiv-tunnisteella.
