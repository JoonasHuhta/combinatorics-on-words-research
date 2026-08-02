# B16 Row 99 Generalization & The Level 7 Anomaly

Tämä dokumentti erottelee kaksi täysin eri matemaattista väitettä, jotka aiemmassa todistusluonnoksessa menivät sekaisin, ja ratkaisee "Level 7" (7/9 bigrammia tunnettu) mysteerin.

## Väite A: "Jos matriisin summat ovat nolla, $N-1$ alkiota pakottaa viimeisen"
Tämä on triviaali lineaarialgebrallinen fakta, joka pätee **mille tahansa** matriisikoolle $k \times k$, riippumatta $(k-1)^2$-dimensiosta.

Olkoon $\Delta M$ $k \times k$ -matriisi, joka kuvaa bigrammien lukumäärien erotusta kahden 1-abelisti ekvivalentin sanan $u$ ja $v$ välillä ($\Delta M_{ij} = |u|_{ij} - |v|_{ij}$).
Jos tiedämme, että sanojen alku- ja loppukirjaimet täsmäävät ($first(u) = first(v)$ ja $last(u) = last(v)$), jokaisen kirjaimen $c$ osalta pätee:
1. Rivisumma: $\sum_j \Delta M_{cj} = 0$ (kirjaimella $c$ alkavien bigrammien erotus)
2. Sarakesumma: $\sum_i \Delta M_{ic} = 0$ (kirjaimella $c$ päättyvien bigrammien erotus)

Jos tästä matriisista tunnetaan kaikki paitsi yksi alkio (eli $k^2 - 1$ alkiota on nollia tai tunnettuja), puuttuva alkio voidaan ratkaista triviaalisti tarkastelemalla sitä riviä (tai saraketta), jolla se sijaitsee. Koska rivisumma on nolla, viimeisen alkion on pakko kompensoida muiden summa. **Tämä ei vaadi graafiteoriaa eikä $(k-1)^2$-kehikon ymmärtämistä.**

## Väite B: "Nollasummamatriisin ratkaisuavaruuden dimensio on $(k-1)^2$"
Tämä on syvällisempi fakta, joka kertoo **pienimmän mahdollisen epätriviaalin poikkeaman koon**.

$k \times k$ nollasummamatriisien muodostaman vektoriavaruuden dimensio on $(k-1)^2$.
Tämän avaruuden kantavektorit voidaan valita "2x2-shakkilautakuvioina":
$$ \begin{pmatrix} +1 & -1 \\ -1 & +1 \end{pmatrix} $$
Nämä kuviot vaativat aina täsmälleen **4 alkiota**, jotta rivi- ja sarakesummat säilyvät nollana.
Toisin sanoen: On matemaattisesti mahdotonta rakentaa nollasummamatriisia, jossa olisi vain 1, 2 tai 3 nollasta poikkeavaa alkiota.

## Level 7 -mysteerin ratkaisu (Miksi 7/9 salli 0,03 % poikkeaman?)
Jos vaadimme 7 bigrammin täsmäävän (Level 7), meillä on 2 tuntematonta bigrammia.
Väitteen B nojalla 2 tuntematonta **ei voi** muodostaa nollasummamatriisia (koska minimi on 4).
Tästä voisi virheellisesti päätellä, että Level 7 on tismalleen sama kuin All-9 (100 %).

Mutta kokeellinen data osoitti, että Level 7:ssä oli 0,03 % poikkeama All-9:stä. Mistä se tuli?
Se johtuu siitä, että **matriisin summat eivät aina ole nolla!**

Jos sanojen $u$ ja $v$ alku- tai loppukirjaimet *eivät* täsmää (esim. $last(u) = a, last(v) = b$), rivisummat vääristyvät:
$\sum_j \Delta M_{aj} = -1$
$\sum_j \Delta M_{bj} = +1$

Kun matriisin summat ovat $\pm 1$ (ei nolla), **2 alkion poikkeama on täysin mahdollinen!** 
Jos meillä on 2 vapaata parametria (kuten Level 7:ssä), ne voivat tismalleen täyttää tämän $\pm 1$ vääristymän, luoden "haamumatriisin", joka näyttää S-abelin neliöltä ilman, että All-9 ehto todellisuudessa täyttyy.

**Johtopäätös:** (k-1)² -argumentti on olennainen juuri siksi, että se todistaa Level 7:n poikkeamien johtuvan *yksinomaan* reunakirjainten epäjatkuvuuksista (boundary conditions), ei koskaan sisäisestä bigrammi-shakkilaudasta. Sisäinen shakkilauta vaatisi aina 4 vapaata bigrammia (Level 5).
