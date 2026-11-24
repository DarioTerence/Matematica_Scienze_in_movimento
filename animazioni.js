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

/* Scarica in anticipo le immagini indicate (es. le pose di Prof. T), così il cambio
   di posa è immediato anche la prima volta. Accetta un elenco o un oggetto di percorsi. */
function precarica(lista) {
  var v = Array.isArray(lista) ? lista : Object.keys(lista).map(function (k) { return lista[k]; });
  v.forEach(function (src) { var i = new Image(); i.src = src; });
}

/* ---------- Tastierina numerica sugli schermi touch (telefono, tablet, LIM) ----------
   Sostituisce la tastiera del telefono, che coprirebbe lo schema. Su PC non compare.
   tastierinaHTML(op) restituisce l'HTML (vuoto se lo schermo non è touch). Opzioni:
     virgola: true    tasto virgola (risposte decimali)
     meno: true       tasto segno meno (cambia il segno; temperature sotto zero)
     verifica: false  niente tasto Verifica (es. calcolatrici che rispondono da sole)
     idVerifica: 'x'  id del tasto Verifica, se il codice dell'animazione lo cerca per id
     id: 'pad'        id della tastierina
   tastierinaCollega(pad, campo, op) la fa funzionare. campo è la casella oppure una
   funzione che restituisce la casella attiva (quando le caselle sono più di una). Opzioni:
     max: 9                 numero massimo di caratteri
     alVerifica: funzione   da chiamare con il tasto Verifica
     nuovoSeEsterno: true   se il valore non l'ha scritto la tastierina (cursore, altra
                            casella), il primo tasto comincia un numero nuovo
   A ogni tasto la casella riceve l'evento 'input', come se si scrivesse con la tastiera. */
var TOUCH = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);

function tastierinaHTML(op) {
  op = op || {};
  if (!TOUCH) return '';
  var verifica = op.verifica !== false, extra = (op.virgola ? 1 : 0) + (op.meno ? 1 : 0);
  var h = '<div class="tastierina" id="' + (op.id || 'pad') + '" aria-label="Tastierina">';
  for (var i = 1; i <= 9; i++) h += '<button type="button" data-k="' + i + '">' + i + '</button>';
  h += '<button type="button" data-k="0">0</button>';
  if (op.virgola) h += '<button type="button" data-k="," aria-label="virgola">,</button>';
  if (op.meno) h += '<button type="button" data-k="-" aria-label="segno meno">−</button>';
  var spanDel = verifica ? 2 : 5 - extra;            /* la terza riga ha 5 posti */
  h += '<button type="button" class="del" data-k="del" style="grid-column:span ' + spanDel + '">Cancella</button>';
  if (verifica) h += '<button type="button" class="ok" data-k="ok"' + (op.idVerifica ? ' id="' + op.idVerifica + '"' : '')
    + ' style="grid-column:span ' + (5 - extra - spanDel) + '">Verifica</button>';
  return h + '</div>';
}

function tastierinaCampo(inp) {        /* la casella non apre la tastiera del telefono */
  inp.readOnly = true;
  inp.setAttribute('inputmode', 'none');
}

function tastierinaCollega(pad, campo, op) {
  op = op || {};
  if (!pad) return;
  var max = op.max || 9, scritto = null;
  var attiva = typeof campo === 'function' ? campo : function () { return campo; };
  if (typeof campo !== 'function' && campo) tastierinaCampo(campo);
  pad.onclick = function (e) {
    var b = e.target.closest('button[data-k]'), inp = attiva();
    if (!b || !inp || inp.disabled) return;
    var k = b.dataset.k, v = inp.value;
    if (k === 'ok') { if (op.alVerifica) op.alVerifica(); return; }
    if (op.nuovoSeEsterno && v !== scritto && k !== 'del') v = '';
    if (k === 'del') v = v.slice(0, -1);
    else if (k === '-') v = (v.charAt(0) === '-' || v.charAt(0) === '−') ? v.slice(1) : '-' + v;
    else if (k === ',') { if (v.indexOf(',') < 0) v += (v === '' || v === '-') ? '0,' : ','; }
    else if (v.length < max) v += k;
    inp.value = v; scritto = v;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  };
}

/* ---------- Schermo intero di una scheda (dal 24 nov 2026) ----------
   schermoIntero(blocco, pulsante, alCambio) porta a schermo intero il blocco (con data-intero)
   e fa funzionare il pulsante nell'angolo della scena (entra ed esce, cambia l'icona).
   Dove il browser lo permette usa lo schermo intero vero, che nasconde anche le barre del browser;
   altrimenti (iPhone) il blocco riempie solo la finestra. Si esce con il pulsante, con Esc
   e con il tasto o il gesto indietro del telefono. alCambio(dentro) avvisa l'animazione,
   che ridimensiona la scena. Stile in animazioni.css. */
function schermoIntero(blocco, pulsante, alCambio) {
  var APRI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>',
      CHIUDI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>';
  var dentro = false, storia = false;
  var vero = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  function elementoVero() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function aggiorna(on) {
    dentro = on;
    blocco.classList.toggle('intero', on);
    document.documentElement.classList.toggle('in-intero', on);
    var t = on ? 'Esci dallo schermo intero' : 'Schermo intero';
    pulsante.innerHTML = on ? CHIUDI : APRI;
    pulsante.title = t;
    pulsante.setAttribute('aria-label', t);
    if (alCambio) alCambio(on);
  }
  /* nello schermo intero simulato una voce nella cronologia: il gesto indietro chiude solo lo schermo intero */
  function segnaStoria() { history.pushState({ intero: 1 }, ''); storia = true; }
  function entra() {
    aggiorna(true);
    var chiedi = blocco.requestFullscreen || blocco.webkitRequestFullscreen;
    if (vero && chiedi) {
      try {
        var p = chiedi.call(blocco);
        if (p && p.catch) p.catch(segnaStoria);
      } catch (e) { segnaStoria(); }
    } else segnaStoria();
  }
  function esci() {
    if (elementoVero()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (storia) { storia = false; history.back(); return; }   /* popstate chiude */
    aggiorna(false);
  }
  pulsante.classList.add('comando-intero');
  pulsante.addEventListener('click', function () { if (dentro) esci(); else entra(); });
  function cambioVero() {
    if (!elementoVero() && dentro && !storia) aggiorna(false);
    else if (dentro) setTimeout(function () { if (alCambio) alCambio(true); }, 60);
  }
  document.addEventListener('fullscreenchange', cambioVero);
  document.addEventListener('webkitfullscreenchange', cambioVero);
  window.addEventListener('popstate', function () { if (dentro && !elementoVero()) { storia = false; aggiorna(false); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dentro && !elementoVero()) esci(); });
  aggiorna(false);
  return { esci: esci, dentro: function () { return dentro; } };
}
