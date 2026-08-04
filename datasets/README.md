# Datasets

Tämä hakemisto sisältää projektiin liittyviä apusanakirjoja, siemeniä ja pitkiä löydettyjä sanoja (kuten Keräsen aiemmat sanat).

## aa2fr3LetLen40ex80ms200MextendableAllPermsMirs.txt

Tämä on Veikko Keräsen massiivinen 40 merkin "jatkettavien" (extendable) sanojen sanakirja, jota käytetään `backtracker_v3.cpp` -ohjelmassa ja sen variaatioissa.

### Alkuperä ja laskentamenetelmä (Veikon kuvaus 4.8.2026):
> This is the dictionary used by the backtracker_v3.cpp program and its variants, which contains all pruned aa2fr words of length 40. Pruning means that each word in question has been simultaneously extended to the right and left by words of length 80 in CUDA precomputing, preserving the aa2fr property, using a maximum of 200 million steps. No undecided cases remained, so the dictionary is complete in that respect.
> Naturally, pruning was done on a set of words from which all permutations (renamings) and all structural mirror images had first been removed.

### Tieteellinen status projektissa (Elokuu 2026):
Tämä sanakirja on osoittautunut erittäin tehokkaaksi **heuristiseksi** apuvälineeksi (Rata 2), joka rajaa valtavasti hakuavaruutta. 

**Kuitenkin:** Testit 4.8.2026 (`backtracker.js` `--pure`-tilassa) osoittivat kiistattomasti, että tämä sanakirja karsii vahingossa myös aitoja, laillisia AA2F-reittejä. Tästä syystä sanakirjaa **ei saa** käyttää lopullisen negatiivisen todistuksen (exhaustion) välineenä Mäkelän konjektuurille. Sitä käytetään ainoastaan heuristisessa etsinnässä pitkien alarajojen asettamiseen ja ohjelman moottorin testaamiseen. 
Kun haetaan absoluuttista totuutta konjektuurin olemassaolosta, käytetään puhdasta (`--pure`) tilaa ilman sanakirjaa.
