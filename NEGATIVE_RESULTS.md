# Negatiiviset Tulokset ja Hylätyt Hypoteesit (Graveyard of Ideas)

Tämä dokumentti on arkisto tutkimuslinjoista, ideoista ja hypoteeseista, jotka on testattu ja **todistettu vääriksi tai riittämättömiksi**. 

Matematiikassa ja algoritmiikassa umpikujat ovat yhtä arvokasta tietoa kuin onnistumiset. Dokumentoimalla nämä säästämme tulevilta tutkijoilta (ja tekoälyiltä) viikkojen turhan työn, ja estämme projektia kiertämästä kehää.

---

## 1. Uniformien Morfismien Skannaus ($k=7..9$)
**Hypoteesi:** Jos testaamme yhä suurempia uniformien morfismien pituuksia ($k=7, 8, 9...$), löydämme lopulta kiintopisteen, joka välttää abelin neliöt puolipituudella $K \ge 2$.
**Miksi se ammuttiin alas:** 
- Suoritettiin regressioanalyysi selviytymispituuksien maksimeille $k=2..6$. Tulos osoitti lähes täydellisen selitysasteen ($R^2 = 0,998$) kaavalle $max \approx 2,29 \cdot \ln N$, missä $N$ on testattujen morfismien määrä.
- **Johtopäätös:** Maksimipituuden kasvu ei ole rakenteellinen signaali ongelman ratkeamisesta, vaan puhtaasti **otoskoon artefakti** (tilastollisen jakauman häntä). Hakeminen isommilla $k$-arvoilla ilman rakenteellista uutta ideaa on laskentaresurssien tuhlausta.

## 2. Rauzy-graafin Vahvasti Yhtenäinen Komponentti (SCC) Todistuksena
**Hypoteesi:** Jos löydämme rajoitekielen (esim. Abelian square-free) Rauzy-graafista ikkunalla $n$ Vahvasti Yhtenäisen Komponentin (SCC), olemme todistaneet, että kieli on ääretön.
**Miksi se ammuttiin alas:** 
- Abelin neliöiden välttäminen vaatii globaalia Parikh-tasapainon hallintaa, jota ei voida pakata äärelliseen muisti-ikkunaan. Rauzy-graafi pituudella $n$ takaa ainoastaan, ettei neliöitä synny **pituuteen $n$ asti**. Se on lokaali, ei globaali ominaisuus.
- **Johtopäätös:** Rauzy-graafi ja SCC ovat erinomaisia *heuristisia esisuodattimia*, mutta niillä ei ole absoluuttista todistusarvoa (Level 2). Äärettömyyden todistaminen vaatii kielen generoivan säännön (morfismin) löytämistä ja sen syöttämistä eksaktiin verifiointimoottoriin (esim. `decide-realizability.js`).

## 3. "Ennätyssanan" Käänteismallinnus (Morfismin Louhinta)
**Hypoteesi:** Keräsen ja Gavrilenkon löytämä 25 379 merkin sana on niin pitkä, että sen takana on pakko olla algebrallinen sääntö (esim. lohkosubstituutio tai morfismi). Pöytäkoneen laskentateholla voimme purkaa (käänteismallintaa) tuon säännön sanasta.
**Miksi se ammuttiin alas:** 
- Sanojen tekijäkompleksisuus $p(n)$ mitattiin. Morfisen sanan kompleksisuuden on pakko kasvaa lineaarisesti ($p(n) \le C \cdot n$). Keräsen 25k sanalla $p(15) = 14 502$, eli se kasvaa eksponentiaalisesti seuraten koko $aa2f$-kielen kasvua.
- **Johtopäätös:** Sana on puhdas optimoidun syvyyssuuntaisen haun (DFS / random walk) tuote. Sillä on massiivinen topologinen entropia. Sääntöä ("DNA:ta") ei voi käänteismallintaa, koska sitä ei ole olemassa.

## 4. Morfismien Parikh-epätasapaino on Pieni
**Hypoteesi:** Algebrallisen säännön (morfismin) tuottama sana on niin synkronoitu, että sen Parikh-epätasapaino (yleisimmän ja harvinaisimman kirjaimen erotus) pysyy tiukasti rajattuna, esim. $< 10$.
**Miksi se ammuttiin alas:** 
- Empiirinen mittaus osoitti tismalleen päinvastaista. Oikea morfinen sana ($g_3(h_6^\omega(a))$) tuotti pituudessa 25 379 Parikh-epätasapainon **2 298**. Keräsen DFS-hakusanalla vastaava epätasapaino oli vain **322**.
- **Johtopäätös:** Kun morfismin siirtymämatriisilla on ominaisarvo $|\lambda| > 1$ (kuten $h_6$:n tapauksessa $|\lambda_2| = \sqrt{3}$), epätasapaino kasvaa teoriassa rajatta nopeudella $\sqrt{N}$. Morfismi on tässä suhteessa "epätasapainoisempi" kuin hyvin leikattu DFS-vaellus.

## 5. FORBID4-tekijät Ovat Universaalisti Kuolettavia
**Hypoteesi:** Projektin DFS-haun löytämät kuusi "umpikujatekijää" (`baac`, `caab`, `abbc`, `cbba`, `accb`, `bcca`) johtavat väistämättä kuolemaan, ja ne tulee kovakoodata sääntönä pois kaikista hauista.
**Miksi se ammuttiin alas:** 
- Analysoitaessa 25 379 merkin selviytyjäsanaa havaittiin, että jokainen näistä kuudesta FORBID4-tekijästä esiintyy sanassa satoja kertoja (esim. `accb` 501 kertaa).
- **Johtopäätös:** FORBID4 on kuolettava vain kapeassa, spesifissä hakuavaruudessa. Jos kieltäisimme ne globaalisti tulevilta tekoälyhauilta tai optimoijilta, tekisimme 25 000 merkin sanan löytymisen *matemaattisesti mahdottomaksi*. 

## 6. Datavetoinen Älykäs DFS ("Rosetta-filtteri")
**Hypoteesi:** Koska 25k sana selvisi, voimme uuttaa siitä kaikki käytetyt $N$-pituiset osasanat "sallituksi sanakirjaksi", ja suodattaa kaikki tulevat syvyyssuuntaiset haut (DFS) sen läpi.
**Miksi se ammuttiin alas:**
- 25 379 merkin sana käyttää pituudella 15 yhteensä 14 502 uniikkia tekijää. Koko $aa2f$-kielen luvallisten 15-pituisten tekijöiden määrä on 120 084. 
- **Johtopäätös:** Filtteri heittäisi roskakoriin 88 % täysin laillisista jatkopoluista vain siksi, että Keräsen haku ei *sattunut* osumaan niihin. Tämä johtaisi ylisovittamiseen (overfitting) ja toimisi todennäköisemmin kattona kuin ponnahduslautana. Puhdasta empiiristä ennätyshakua on muutenkin syytä välttää, sillä tavoitteemme on eksakti, ääretön todistus (Level 2).
