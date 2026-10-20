# La Matematica e le Scienze in Movimento

Animazioni didattiche interattive di matematica e scienze per la scuola secondaria di primo grado, a cura di Prof. T.

Sito: https://scienzainmovimento.it/

## Contenuto
- `index.html`: home con le quattro aree (Numeri e forme, Materia ed energia, Viventi, Terra e cosmo) e il fumetto con le frasi
- `style.css`: stile condiviso, tema scuro
- `frasi.js`: rotazione casuale delle frasi nel fumetto della home
- `animazioni.css`, `animazioni.js`: componenti condivisi dei comandi delle animazioni (vedi "Comandi delle animazioni")
- `favicon.svg`: icona del sito
- `apple-touch-icon.png`: icona 180x180 px per la schermata Home di iPhone e iPad, indicata da `<link rel="apple-touch-icon">` in tutte le pagine; sorgente in `immagini/apple_touch_icon/`
- `firma.svg`: firma "Prof. T"
- `prof_t.webp`, `prof_t_occhiolino.webp`, `bagliore.svg`: caricatura di Prof. T nella home (occhi aperti, occhiolino, bagliore sulla lente), animata solo con CSS
- `aritmetica/`, `geometria/`, `fisica/`, `biologia/`, `scienze_della_terra/`, `astronomia/`: una cartella per disciplina, con `index.html` (elenco) e un file HTML per ogni animazione (con `animazioni.css` e `animazioni.js` dalla radice)
- `CNAME`: dominio personalizzato del sito (non rimuovere)
- `immagini/prof_t/`: pose di Prof. T usate nelle animazioni (WebP trasparenti, per esempio `prof_t_maglietta_verde_saluto.webp`); `immagini/terra/`: superficie e rilievo della Terra (NASA Visible Earth) per La struttura interna della Terra. Le animazioni le richiamano con un percorso (`../immagini/prof_t/…`), non incorporate in base64; `precarica()` di `animazioni.js` le scarica in anticipo
- `og_image.jpg`: immagine 1200x630 px per l'anteprima dei link condivisi (WhatsApp, chat, social), indicata da `og:image` in tutte le pagine; sorgente in `immagini/og_image/`
- `sitemap.xml`, `robots.txt`: elenco delle pagine per i motori di ricerca
- `LICENSE`: licenza (tutti i diritti riservati)

Il sito è statico: solo HTML e CSS scritti a mano, nessun framework e nessuna build. Uniche eccezioni nelle pagine del sito: `frasi.js` e il contatore anonimo GoatCounter. Le animazioni hanno il loro JavaScript e usano i file condivisi `animazioni.css` e `animazioni.js`: non sono più file autonomi, funzionano dentro la loro cartella del sito.

Nomi di file e cartelle: minuscolo, senza accenti, parole separate da underscore (es. `vita_stelle.html`).

## Aggiungere un'animazione
1. Copiare il file `.html` nella cartella della disciplina.
2. Incollare una card nella pagina `index.html` di quella disciplina e aggiornare la descrizione della card della disciplina in home.
3. Aggiungere l'indirizzo della nuova pagina in `sitemap.xml` (indirizzo completo, senza barra finale per le animazioni).
4. Controllare nell'animazione le parti descritte sotto (head, intestazione, fondo pagina).

### Head
Subito dopo `<meta charset>`: `<meta name="author" content="Prof. T">` e il commento `<!-- © 2026 Prof. T. Tutti i diritti riservati. -->`.

Dopo `<title>`, nell'ordine:
- `meta description`: una frase, massimo 160 caratteri, scritta sui contenuti reali, senza nomi di classi né di libri;
- `<link rel="canonical">` con l'indirizzo completo (`https://scienzainmovimento.it/...`; barra finale per le pagine di disciplina, nessuna per le animazioni);
- Open Graph: `og:type` (website), `og:site_name` (Scienza in Movimento), `og:locale` (it_IT), `og:title` identico al `<title>`, `og:description` identica alla description, `og:url` identico al canonical, `og:image` (`https://scienzainmovimento.it/og_image.jpg`), `og:image:width` 1200, `og:image:height` 630, `og:image:alt` ("Prof. T - La Matematica e le Scienze in Movimento");
- `<meta name="twitter:card" content="summary_large_image">`;
- `<link rel="apple-touch-icon" href="../apple-touch-icon.png">`.

Il modo più semplice è copiare il blocco da un'animazione esistente (ad esempio `geometria/aree_perimetri.html`) e cambiare titolo, descrizione e indirizzi.

Formato del `<title>`: "Titolo dell'animazione - Scienza in Movimento"; per le pagine di disciplina "Disciplina - Scienza in Movimento".

### Intestazione
Sopra il titolo il nome della disciplina in maiuscolo piccolo (classe `.eyebrow`, 13 px) nel colore della disciplina (gli stessi valori di `style.css`); sotto, il titolo in bianco (#e6ecf5, Cambria), identico al titolo della card. Un'eventuale riga descrittiva non contiene nomi di classi.

### Fondo pagina
Prima di `</body>`, dopo gli script dell'animazione, nell'ordine:
1. il paragrafo `<p class="di-cosa-parla">` (stile in linea: larghezza massima 640 px, centrato, 13 px Calibri, colore #8fa0b8, margine superiore 32 px) con una o due frasi sugli argomenti trattati;
2. la firma: `<div>` centrato con il link `class="firma-home"` verso `../index.html` che contiene `<img src="../firma.svg">` (dal 20 ott 2026 non più incorporata in base64), e sotto la riga "© 2026 Prof. T" (12 px, #6f819c);
3. il bottone di ritorno `class="torna-sito"` verso `index.html` della disciplina ("← Fisica", "← Biologia", ...), fisso in basso a sinistra, con il colore dell'area al passaggio del mouse: numeri #6aa5ff, materia #ffb454, viventi #6fd08c, cosmo #b38cff;
4. come ultima riga lo script di GoatCounter:
   `<script data-goatcounter="https://scienzainmovimento.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`

Il codice completo di firma e bottone si copia da un'animazione esistente della stessa area, cambiando solo il nome della disciplina.

### Comandi delle animazioni
Le animazioni collegano i file condivisi: nell'head, dopo il proprio `<style>`, `<link rel="stylesheet" href="../animazioni.css">`; prima dello script dell'animazione `<script src="../animazioni.js"></script>`. Sul `<body>` si impostano i due colori, ad esempio `<body style="--area:#6aa5ff;--disciplina:#9cc5ff">` (area e sfumatura della disciplina, gli stessi valori di `style.css`).

I comandi hanno quattro livelli, ognuno con una forma e un posto fissi (dall'alto in basso):
1. Schede o stazioni: `<nav class="schede">` con `<button class="scheda">` numerati (`<span class="num">01</span>Nome`); la scheda scelta ha la classe `attiva` e, dopo ogni ridisegno, va chiamata `centraScheda(nav)`, che la porta al centro della striscia.
2. Modalità (Esplora / Allenati e simili): `<div class="modalita">` con i pulsanti; quello scelto ha la classe `attiva`.
3. Azioni: `<div class="azioni">` con `<button class="azione">`; uno solo è pieno (`azione primaria`: Avanti, Verifica), gli altri semplici, `azione link` o `azione icona` (Indietro come ‹). Sopra, l'indicatore del passo: `passoHTML(i, n)`; per Esplora `azioniHTML(primo, ultimo, "Nuove frazioni")` crea Indietro, Avanti e l'azione "nuovo", che all'ultimo passo diventa il pulsante pieno.
4. Opzioni: interruttori `<button class="levetta" role="switch" aria-checked="true">` dentro `<details class="opzioni"><summary><b>Opzioni</b></summary>…</details>`; scelte tra elementi della scena con `<button class="chip">` (colore del pallino con `style="--chip:#…"`, scelto con `attivo`); comandi della vista sopra la scena con `comando-scena`.

Pochi comandi visibili: al massimo tre azioni insieme, il resto nelle Opzioni. Al primo ingresso il fumetto di Prof. T dice quale pulsante toccare. Sugli schermi touch le risposte numeriche si scrivono con la tastierina sullo schermo.

## Attivare una nuova disciplina
1. In `index.html`, sostituire la card spenta (`<div class="card fisica in-arrivo">`) con il link (`<a class="card fisica" href="fisica/">`) e scrivere la descrizione con le animazioni.
2. Creare `<disciplina>/index.html` copiando una pagina di disciplina esistente: cambiare classe di colore, titolo, description, canonical e Open Graph; restano favicon (`../favicon.svg`), footer con "© 2026 Prof. T", bottone "← Scienza in Movimento" con la classe dell'area e GoatCounter.
3. Aggiungere la pagina a `sitemap.xml` (con barra finale).

## Frasi della home
Le frasi sono un elenco `<ul class="frasi">` in `index.html`. Per aggiungerne una, copiare un `<li>` e cambiare testo, fonte e classe della disciplina:

`<li class="CLASSE_DISCIPLINA"><p class="frase">TESTO</p><p class="fonte"><span class="disc">Disciplina</span> · Fonte</p></li>`

Massimo circa 150 caratteri. Un solo `<li>` ha la classe `attiva` (la frase visibile senza JavaScript). Citazioni con autore solo se verificabili, indicando fonte e se si tratta di parafrasi o traduzione.

## Rigenerare le immagini
- `og_image.jpg`: da rifare se cambiano titolo, sottotitolo, firma o caricatura. Modificare `immagini/og_image/og_image.html` e lanciare `genera_og_image.py` (Chromium tramite Playwright; istruzioni nel commento iniziale dello script). Cambria e Calibri sono sostituiti da Caladea e Carlito, di uguali misure. Le anteprime già condivise restano in cache: per aggiornarle usare il Debugger di condivisione di Facebook ("Scrape again").
- `apple-touch-icon.png`: da rifare se cambia la favicon. Modificare `immagini/apple_touch_icon/apple_touch_icon.svg` e lanciare `genera_apple_touch_icon.py`.

## Dominio e pubblicazione
Il sito è pubblicato con GitHub Pages dal ramo `main` di questo repository, che deve restare pubblico (con il piano gratuito di GitHub un repository privato smette di pubblicare il sito).

DNS del dominio `scienzainmovimento.it` (pannello del registrar):
- quattro record A sul dominio principale: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153;
- quattro record AAAA: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153;
- CNAME `www` verso `darioterence.github.io`;
- TXT `_github-pages-challenge-darioterence` per la verifica del dominio su GitHub (non eliminare).

In GitHub: dominio verificato nelle impostazioni dell'account, dominio personalizzato nelle impostazioni Pages del repository, "Enforce HTTPS" attivo. `www` e il vecchio indirizzo github.io rimandano al dominio principale.

Se qualcosa non funziona:
- certificato HTTPS bloccato: rimuovere e riscrivere il dominio nelle impostazioni Pages riavvia l'emissione;
- per controllare i DNS senza la cache del router: `nslookup scienzainmovimento.it. 1.1.1.1`;
- per tornare all'indirizzo github.io: rimuovere il dominio dalle impostazioni Pages ed eliminare `CNAME`.

Se un giorno cambiasse il dominio, l'indirizzo va sostituito in `CNAME`, canonical, `og:url`, `og:image`, `sitemap.xml` e `robots.txt`.

## Statistiche e motori di ricerca
- GoatCounter (senza cookie, anonimo), codice `scienzainmovimento`; i conteggi per pagina sono nella tabella dei percorsi della dashboard. Per non contare le proprie visite: nella console del browser (F12), aprendo il sito su scienzainmovimento.it, `localStorage.skipgc = 't'` (una volta per browser e dispositivo).
- Google Search Console: proprietà di tipo Dominio. Dopo aver aggiornato `sitemap.xml` si può reinviarla oppure lasciare che Google la rilegga.

## Crediti
La firma "Prof. T" (`firma.svg`) è ricavata dal font Nothing You Could Do di Kimberly Geswein, licenza SIL Open Font License 1.1.

Le animazioni 3D usano Three.js (licenza MIT).

## Licenza
© 2026 Prof. T. Tutti i diritti riservati (vedi `LICENSE`). Le librerie e i font di terzi restano soggetti alle rispettive licenze.
