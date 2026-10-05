# La Matematica e le Scienze in Movimento

Animazioni didattiche interattive di matematica e scienze per la scuola secondaria di primo grado, a cura di Prof. T.

Sito: https://darioterence.github.io/Matematica_Scienze_in_movimento/

## Contenuto
- `index.html`: home con le quattro aree (Numeri e forme, Materia ed energia, Viventi, Terra e cosmo)
- `style.css`: stile condiviso, tema scuro
- `favicon.svg`: icona del sito
- `prof_t.webp`, `prof_t_occhiolino.webp`, `bagliore.svg`: caricatura di Prof. T nella home (occhi aperti, occhiolino, bagliore sulla lente), animata solo con CSS
- `biologia/`, `astronomia/`: una cartella per disciplina, con `index.html` (elenco) e un file HTML autonomo per ogni animazione

Il sito è statico: solo HTML e CSS scritti a mano, nessun framework e nessuna build. Le animazioni hanno il loro JavaScript.

## Aggiungere un'animazione
1. Copiare il file `.html` nella cartella della disciplina.
2. Incollare una card nella pagina `index.html` di quella disciplina.
3. Inserire nell'animazione il bottone "Torna a Scienza in Movimento" prima di `</body>`.

## Crediti
La firma "Prof. T" (`firma.svg`) è ricavata dal font Nothing You Could Do di Kimberly Geswein, licenza SIL Open Font License 1.1.

## Licenza
Da definire.
