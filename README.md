# La Matematica e le Scienze in Movimento

Animazioni didattiche interattive di matematica e scienze per la scuola secondaria di primo grado, a cura di Prof. T.

Sito: https://scienzainmovimento.it/

## Contenuto
- `index.html`: home con le quattro aree (Numeri e forme, Materia ed energia, Viventi, Terra e cosmo) e il fumetto con le frasi
- `style.css`: stile condiviso, tema scuro
- `frasi.js`: rotazione casuale delle frasi nel fumetto della home
- `favicon.svg`: icona del sito
- `apple-touch-icon.png`: icona 180x180 px per la schermata Home di iPhone e iPad, indicata da `<link rel="apple-touch-icon">` in tutte le pagine; sorgente in `immagini/apple_touch_icon/` (`apple_touch_icon.svg`, versione quadrata della favicon, e script `genera_apple_touch_icon.py` per rigenerarla se cambia la favicon)
- `firma.svg`: firma "Prof. T"
- `prof_t.webp`, `prof_t_occhiolino.webp`, `bagliore.svg`: caricatura di Prof. T nella home (occhi aperti, occhiolino, bagliore sulla lente), animata solo con CSS
- `aritmetica/`, `geometria/`, `fisica/`, `biologia/`, `astronomia/`: una cartella per disciplina, con `index.html` (elenco) e un file HTML autonomo per ogni animazione
- `CNAME`: dominio personalizzato del sito (non rimuovere)
- `og_image.jpg`: immagine 1200x630 px per l'anteprima dei link condivisi (WhatsApp, chat, social), indicata da `og:image` in tutte le pagine
- `immagini/og_image/`: sorgente di `og_image.jpg` (`og_image.html`) e script `genera_og_image.py` per rigenerarla se cambiano titolo, sottotitolo, firma o caricatura (istruzioni nel commento iniziale dello script)
- `sitemap.xml`, `robots.txt`: elenco delle pagine per i motori di ricerca (la sitemap va aggiornata a ogni nuova pagina)
- `LICENSE`: licenza (tutti i diritti riservati)

Il sito è statico: solo HTML e CSS scritti a mano, nessun framework e nessuna build. Uniche eccezioni nelle pagine del sito: `frasi.js` e il contatore anonimo GoatCounter. Le animazioni hanno il loro JavaScript.

## Aggiungere un'animazione
1. Copiare il file `.html` nella cartella della disciplina.
2. Incollare una card nella pagina `index.html` di quella disciplina e aggiungere l'indirizzo della nuova pagina in `sitemap.xml`.
   Nell'`<head>` dell'animazione, dopo `<title>`, vanno anche `meta description`, `canonical` (indirizzo completo con il dominio) e i tag Open Graph (`og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`) e `twitter:card`, seguiti da `<link rel="apple-touch-icon" href="../apple-touch-icon.png">`: copiarli da una pagina esistente e adattarli (l'immagine `og_image.jpg` e l'icona sono le stesse per tutte le pagine).
3. Inserire nell'animazione, prima di `</body>`, la firma (cliccabile verso la home), il bottone di ritorno alla disciplina ("← Fisica", "← Biologia", ...) con il colore dell'area e, come ultima riga, lo script del contatore GoatCounter.

## Crediti
La firma "Prof. T" (`firma.svg`) è ricavata dal font Nothing You Could Do di Kimberly Geswein, licenza SIL Open Font License 1.1.

Le animazioni 3D usano Three.js (licenza MIT).

## Licenza
© 2026 Prof. T. Tutti i diritti riservati (vedi `LICENSE`). Le librerie e i font di terzi restano soggetti alle rispettive licenze.
