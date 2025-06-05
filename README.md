# Redecofinder
Tekoälyavusteinen -assistant sovellus, joka auttaa käyttäjää löytämään ensisijaisesti käytettyjä kalusteita hiedän suunnitteilla olevaan tilaan.
Katso instructions.txt käynnistysohjeille.
<br><br>
**Server:** Node js (TypeScript)
<br>
**Backend:** MongoDB
<br>
**Frontend:** React web (TypeScript)

//// 1. Yleistä \\\\

    Redecofinder auttaa käyttäjää löytämään hänen tyyliinsä tai tilaansa sopivia, ensisijaisesti käytettyjä
    kalusteita tekoälyn avustamana. Tuotevalikoima tulee asiakkaan verkkokaupasta.

    Käyttäjä ohjataan alussa :
    1. saamaan huonekalusuosituksia suoraan tilakuvan avulla (lyhyempi reitti)
    2. tekemään koko tyylikysely, jossa avustaja selvittää tyylin syväluotaavamman dialogin keinoin (pidempi reitti)

    Onnellisessa lopputilanteessa käyttäjä on löytänyt itselleen mieluisan käytetyn kalusteen, ja ostanut sen
    asiakkaan verkkokaupasta.

    Huom! uusin versio githubin branchissa demo1.0_experimental
    Kieli vaihdettiin jossain kohti kehitystä joten englanninkielinen versio löytyy edelleen omasta branchistaan

    Github: https://github.com/anttijoutsenniemi/redecofinder 

//// 2. Tekninen toimintaperiaate \\\\

    Kalusteiden tyyliä arvioidaan läpi sovelluksen "tyylimuuttujien" -muodossa. Yksittäinen tyylimuuttuja
    on esimerkiksi "dark" tai "minimalistic" ja se mittaa kuinka tumma tai minimalistinen esim. Löhösohva on 
    asteikolla 0-100. 
    
    Asiakkaan sivuilta palvelimella pyörivä skripti hakee Löhösohvan tiedot ja kuvan. 
    OpenAI:n tekoälymallia pyydetään sitten arvioimaan Löhösohva usean eri tyylimuuttujan asteikolla. Jokaisesta
    huonekalusta Löhösohva mukaan lukien on siis ennalta tehty tyyliarvio, ja tyyliarvion tyylimuuttujat 
    on tallennettu tietokantaan.

    Seuraavaksi kysymme käyttäjältä eri inputteja kuten millaista tilaa hän on suunnittelemassa ja mitä
    hän on etsimässä. Nämä tiedot ja mahdollinen kuva tilasta lähetetään jälleen OpenAI:n mallille, 
    ja pyydetään arviota, minkälaisia tyylimuuttujia tässä haetaan.

    Nyt meillä on nippu tyylimuuttujia joita voidaan vertailla tietokannasta löytyvien tuotteiden kanssa.
    Vertailu on helppo toteuttaa käyttämällä euklidisen etäisyyden kaavaa. Käytännössä kaikki tyylimuuttujat
    esitetään pisteen koordinaatteina, jolloin niiden etäisyys voidaan laskea euklidisen etäisyyden 
    kaavalla vasten jokaista valitun kategorian tuotetta tietokannassa. Koodi etsii tuotteen jonka 
    euklidinen etäisyys on pienin, sillä se on todennäköisesti samankaltaisin halutun tyylin kanssa, 
    ja tarjoilee tämän sitten käyttäjälle "best matchina".

    Esim. näin yksinkertaistettuna näiden kahden tuotteen euklidinen etäisyys olisi tod näk. aika iso:

    Löhösohva: { dark: 90, minimalistic: 6 }
    Kovasohva: { dark:  3, minimalistic: 97 }

    Näin saadaan kevyttä dataa käyttävä "tekoälyrankkaaja".
    Samaa järjestelmää voisi käyttää rankkaamaan mitä vain n joukkoa asioita.
