/* © 2026 Prof. T. Tutti i diritti riservati. */
/* Funzioni condivise dei comandi delle animazioni di Scienza in Movimento.
   Ogni animazione lo carica prima del proprio script:
     <script src="../animazioni.js"></script>
   Lavora insieme ad animazioni.css (classi .schede, .passo, .azioni). */

/* Porta la linguetta attiva (.scheda.attiva) al centro della striscia .schede,
   così a destra e a sinistra si vedono le schede vicine.
   Va chiamata dopo aver ridisegnato le linguette; se la striscia era già scorsa,
   conviene rimettere prima la posizione di scorrimento precedente (scrollLeft),
   così lo spostamento parte da dove era e non dall'inizio. */
function centraScheda(nav) {
  var t = nav.querySelector('.attiva');
  if (!t) return;
  var r = t.getBoundingClientRect(), n = nav.getBoundingClientRect();
  var d = (r.left + r.width / 2) - (n.left + nav.clientWidth / 2);
  var ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (Math.abs(d) > 2) nav.scrollBy({ left: d, behavior: ridotto ? 'auto' : 'smooth' });
}

/* Indicatore "Passo n di N" con le barrette: i è il passo attuale (da 0), n il totale. */
function passoHTML(i, n) {
  var b = '';
  for (var k = 0; k < n; k++) b += '<i' + (k <= i ? ' class="fatto"' : '') + '></i>';
  return '<div class="passo" aria-label="Passo ' + (i + 1) + ' di ' + n + '">'
    + '<span class="testo">Passo ' + (i + 1) + ' di ' + n + '</span>' + b + '</div>';
}

/* Riga delle azioni di Esplora: Indietro (freccia), Avanti (pulsante pieno) e un'azione "nuovo"
   come link. All'ultimo passo Avanti sparisce e l'azione "nuovo" diventa il pulsante pieno.
   Gli id sono fissi: bPrev, bNext, bNew. */
function azioniHTML(primo, ultimo, nuovo) {
  var h = '<div class="azioni"><button class="azione icona" id="bPrev" aria-label="Indietro"'
    + (primo ? ' disabled' : '') + '>‹</button>';
  if (ultimo) {
    h += '<button class="azione primaria" id="bNew">↻ ' + nuovo + '</button>'
      + '<button class="azione" id="bNext" disabled hidden></button>';
  } else {
    h += '<button class="azione primaria" id="bNext">Avanti ›</button>'
      + '<button class="azione link" id="bNew">↻ ' + nuovo + '</button>';
  }
  return h + '</div>';
}
