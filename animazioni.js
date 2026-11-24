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

/* ---------- Modalità console: schermo intero di una scheda (dal 24 nov 2026) ----------
   schermoIntero(blocco, pulsante, alCambio) porta a schermo intero il blocco (con data-intero)
   e fa funzionare il pulsante nell'angolo della scena (icona del controller per entrare, angoli verso
   l'interno per uscire). Dove il browser lo permette usa lo schermo intero vero, che nasconde anche
   le barre del browser; altrimenti (iPhone) il blocco riempie solo la finestra. Si esce con il pulsante,
   con Esc e con il tasto o il gesto indietro del telefono. alCambio(dentro) avvisa l'animazione,
   che ridimensiona la scena. Per farla scoprire senza docenti:
   - finché non è mai stata usata su quel dispositivo il pulsante è una pillola dorata "Modalità console";
   - sul telefono, girandolo in orizzontale compare per qualche secondo l'invito "Modalità console?";
   - l'orientamento non si blocca: dentro si può girare il telefono quando si vuole;
   - ogni ingresso è contato da GoatCounter come evento "console-<pagina>", senza dati personali.
   Le Opzioni, se ci sono, restano il <details class="opzioni"> della pagina: a schermo intero diventano
   un pulsante sul pannello che apre il menu sopra la scena (posizione nello stile della pagina).
   Stile in animazioni.css. */
var CONSOLE_INVITO_MS = 4000;   /* durata dell'invito quando si gira il telefono */
function schermoIntero(blocco, pulsante, alCambio) {
  /* pulsante può essere anche un elenco: un pulsante per ogni scena della scheda (es. due vasche) */
  var pulsanti = pulsante.tagName ? [pulsante] : Array.prototype.slice.call(pulsante);
  pulsante = pulsanti[0];
  var APRI = '<svg class="icona" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 7h9a5 5 0 0 1 4.7 6.7l-1.2 3.4a2.3 2.3 0 0 1-3.9.7L14.5 16h-5l-1.6 1.8a2.3 2.3 0 0 1-3.9-.7l-1.2-3.4A5 5 0 0 1 7.5 7z"/><path d="M8 10v3.4M6.3 11.7h3.4"/><circle cx="15.6" cy="10.6" r=".5"/><circle cx="17.6" cy="12.6" r=".5"/></svg>',
      CHIUDI = '<svg class="icona" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>';
  var CHIAVE = 'sim_console_usata';
  var dentro = false, storia = false, invitato = false;
  var vero = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  function elementoVero() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function usata() { try { return localStorage.getItem(CHIAVE) === '1'; } catch (e) { return false; } }
  function segnaUsata() {
    try { localStorage.setItem(CHIAVE, '1'); } catch (e) {}
    /* le altre schede della pagina perdono subito la pillola */
    Array.prototype.forEach.call(document.querySelectorAll('.comando-console.pillola'), function (x) {
      x.classList.remove('pillola');
      var sp = x.querySelector('span');
      if (sp) sp.remove();
    });
  }
  pulsanti.forEach(function (b) { b.classList.add('comando-console'); });
  /* a schermo intero la pagina dichiara viewport-fit=cover: così il telefono comunica lo spazio di tacca e fotocamera */
  var vp = document.querySelector('meta[name=viewport]'), vpBase = vp ? vp.getAttribute('content') : '';
  function aggiorna(on) {
    dentro = on;
    if (vp) vp.setAttribute('content', on ? vpBase + ', viewport-fit=cover' : vpBase);
    blocco.classList.toggle('intero', on);
    document.documentElement.classList.toggle('in-intero', on);
    var pillola = !on && !usata();
    var t = on ? 'Esci dalla modalità console' : 'Modalità console';
    pulsanti.forEach(function (b) {
      b.classList.toggle('pillola', pillola);
      b.innerHTML = on ? CHIUDI : APRI + (pillola ? '<span>Modalità console</span>' : '');
      b.title = t;
      b.setAttribute('aria-label', t);
    });
    if (on) nascondiInvito();
    if (alCambio) alCambio(on);
  }
  /* nello schermo intero simulato una voce nella cronologia: il gesto indietro chiude solo lo schermo intero */
  function segnaStoria() { history.pushState({ intero: 1 }, ''); storia = true; }
  function conta() {
    try {
      if (window.goatcounter && goatcounter.count) {
        var nome = location.pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/\//g, '-') || 'home';
        goatcounter.count({ path: 'console-' + nome, title: 'Modalità console', event: true });
      }
    } catch (e) {}
  }
  function entra() {
    segnaUsata();
    aggiorna(true);
    conta();
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
  pulsanti.forEach(function (b) { b.addEventListener('click', function () { if (dentro) esci(); else entra(); }); });
  function cambioVero() {
    if (!elementoVero() && dentro && !storia) aggiorna(false);
    else if (dentro) setTimeout(function () { if (alCambio) alCambio(true); }, 60);
  }
  document.addEventListener('fullscreenchange', cambioVero);
  document.addEventListener('webkitfullscreenchange', cambioVero);
  window.addEventListener('popstate', function () { if (dentro && !elementoVero()) { storia = false; aggiorna(false); } });
  /* menu Opzioni (le levette della pagina, in <details class="opzioni">): si chiude toccando fuori o con Esc */
  function menuAperti() { return blocco.querySelectorAll('details.opzioni[open]'); }
  blocco.addEventListener('pointerdown', function (e) {
    if (!dentro) return;
    Array.prototype.forEach.call(menuAperti(), function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !dentro) return;
    var m = menuAperti();
    if (m.length) { Array.prototype.forEach.call(m, function (d) { d.open = false; }); return; }
    if (!elementoVero()) esci();
  });

  /* invito quando si gira il telefono in orizzontale: una volta per pagina, solo se la scena si vede */
  var invito = document.createElement('button');
  invito.className = 'invito-console';
  invito.type = 'button';
  invito.innerHTML = APRI + '<span>Modalità console?</span>';
  invito.hidden = true;
  document.body.appendChild(invito);
  var tInvito = 0;
  function nascondiInvito() { invito.hidden = true; clearTimeout(tInvito); }
  invito.addEventListener('click', function () { nascondiInvito(); entra(); });
  function sceltaVisibile() {
    if (!blocco.offsetParent) return false;
    var r = blocco.getBoundingClientRect();
    return r.bottom > 80 && r.top < window.innerHeight - 80;
  }
  if (TOUCH && window.matchMedia) {
    var mq = matchMedia('(orientation: landscape)');
    var suCambio = function () {
      if (!mq.matches || dentro || invitato) return;
      setTimeout(function () {
        if (dentro || !sceltaVisibile()) return;
        invitato = true;
        invito.hidden = false;
        tInvito = setTimeout(nascondiInvito, CONSOLE_INVITO_MS);
      }, 400);
    };
    if (mq.addEventListener) mq.addEventListener('change', suCambio); else if (mq.addListener) mq.addListener(suCambio);
  }
  aggiorna(false);
  return { esci: esci, dentro: function () { return dentro; } };
}
