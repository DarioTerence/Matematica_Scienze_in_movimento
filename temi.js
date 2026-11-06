/* Temi stagionali e ricorrenze della home (Prof. T).
   Legge la data del dispositivo e, se cade nel periodo di un tema, segna la pagina con
   data-tema="nome" sull'elemento <html>: le regole di temi.css valgono solo con quel segno.
   Nessun intervento per accendere o spegnere un tema: torna da solo ogni anno.
   Anteprima: ?data=MM-GG (stesso parametro delle frasi con data) oppure ?tema=nome;
   ?anno=AAAA fa calcolare l'eta' del sito come in quell'anno (utile per provare la frase di compleanno).
   Senza JavaScript non succede nulla: la home resta quella di sempre. */
(function () {
  // Calendario: nome del tema e periodo "MM-GG", estremi compresi (anche a cavallo di Capodanno)
  var TEMI = [
    { nome: 'compleanno', dal: '10-03', al: '10-05' }   // nascita del progetto, 4 ottobre 2026
  ];
  var ANNO_NASCITA = 2026;

  function dueCifre(n) { return (n < 10 ? '0' : '') + n; }
  var adesso = new Date();
  var oggi = dueCifre(adesso.getMonth() + 1) + '-' + dueCifre(adesso.getDate());
  var anno = adesso.getFullYear();
  var cerca = location.search;
  var m;
  if ((m = /[?&]data=(\d{2}-\d{2})/.exec(cerca))) oggi = m[1];
  if ((m = /[?&]anno=(\d{4})/.exec(cerca))) anno = +m[1];

  // Quale tema vale oggi (il primo del calendario che contiene la data)
  var tema = null;
  for (var i = 0; i < TEMI.length; i++) {
    var t = TEMI[i];
    var dentro = t.dal <= t.al ? (oggi >= t.dal && oggi <= t.al) : (oggi >= t.dal || oggi <= t.al);
    if (dentro) { tema = t.nome; break; }
  }
  if ((m = /[?&]tema=([a-z]+)/.exec(cerca))) tema = m[1];
  if (!tema) return;
  document.documentElement.setAttribute('data-tema', tema);

  if (tema === 'compleanno') compleanno();

  /* ---------- Compleanno del sito ---------- */
  function compleanno() {
    // Eta' del sito: anni compiuti il 4 ottobre (almeno 1, anche nelle anteprime del 2026)
    var eta = Math.max(1, anno - ANNO_NASCITA);

    // Frase del fumetto: l'eta' in binario, in base dieci e in numeri romani
    var frase = document.querySelector('.frasi .frase-eta');
    if (frase) {
      if (eta === 1) {
        frase.textContent = 'Il 4 ottobre questo sito compie 1 anno: in binario 1, in numeri romani I.';
      } else {
        frase.textContent = 'Il 4 ottobre questo sito compie ' + eta.toString(2) +
          ' anni… in binario! In base dieci sono ' + eta + ', in numeri romani ' + romani(eta) + '.';
      }
    }

    // Cappellino sulla caricatura: dentro il link, cosi' si solleva con lei al passaggio del mouse
    var link = document.querySelector('.mascotte-link');
    if (link) {
      var cappello = document.createElement('span');
      cappello.className = 'cappellino';
      cappello.setAttribute('aria-hidden', 'true');
      cappello.innerHTML =
        '<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">' +
          '<defs><clipPath id="cono"><path d="M50 14 L88 116 Q50 128 12 116 Z"/></clipPath></defs>' +
          '<path d="M50 14 L88 116 Q50 128 12 116 Z" fill="#111a2b"/>' +
          '<g clip-path="url(#cono)" stroke-width="13" fill="none">' +
            '<path d="M-10 52 L110 22" stroke="#6aa5ff"/>' +
            '<path d="M-10 80 L110 50" stroke="#ffb454"/>' +
            '<path d="M-10 108 L110 78" stroke="#6fd08c"/>' +
            '<path d="M-10 136 L110 106" stroke="#b38cff"/>' +
          '</g>' +
          '<path d="M50 14 L88 116 Q50 128 12 116 Z" fill="none" stroke="#0a0f1a" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M10 116 Q50 130 90 116" fill="none" stroke="#e6ecf5" stroke-width="7" stroke-linecap="round"/>' +
          '<circle cx="50" cy="12" r="10" fill="#e6ecf5" stroke="#0a0f1a" stroke-width="2.5"/>' +
        '</svg>';
      link.appendChild(cappello);
    }

    // Coriandoli nella zona del titolo: pochi, piccoli, nei colori delle quattro aree.
    // Posizione, ritardo e durata casuali; con prefers-reduced-motion restano fermi (temi.css).
    var hero = document.querySelector('.hero');
    if (hero) {
      var COLORI = ['#6aa5ff', '#ffb454', '#6fd08c', '#b38cff'];
      var NUMERO = 22;
      var box = document.createElement('div');
      box.className = 'coriandoli';
      box.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < NUMERO; k++) {
        var c = document.createElement('span');
        c.style.left = (Math.random() * 100).toFixed(1) + '%';
        c.style.setProperty('--y', (Math.random() * 90).toFixed(1) + '%');
        c.style.setProperty('--ritardo', (-Math.random() * 14).toFixed(1) + 's');
        c.style.setProperty('--durata', (10 + Math.random() * 6).toFixed(1) + 's');
        c.style.setProperty('--giro', Math.round(Math.random() * 360) + 'deg');
        c.style.background = COLORI[k % COLORI.length];
        box.appendChild(c);
      }
      hero.insertBefore(box, hero.firstChild);
    }

    // Melodia di "Tanti auguri a te" (Good Morning to All, sorelle Hill, 1893: pubblico dominio).
    // Ogni nota e' [nome, durata in battiti]; tempo in 3/4.
    musica([{
      bpm: 100,
      note: [
        ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
        ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
        ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
        ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3]
      ]
    }]);
  }

  /* ---------- Musica dei temi ----------
     Altoparlante accanto alla caricatura, spento all'apertura: i browser non lasciano partire
     un suono senza un tocco di chi visita (e in classe e' meglio cosi').
     Al tocco suona i brani dell'elenco uno dopo l'altro, con una pausa tra un brano e l'altro,
     poi ricomincia; un altro tocco ferma tutto. Il suono e' generato nel codice (Web Audio API),
     nota per nota, con un timbro morbido da carillon: nessun file audio, nessun diritto sulle registrazioni.
     Mentre suona, accanto all'altoparlante compaiono la nota e la sua frequenza. */
  function musica(brani) {
    var VOLUME = 0.07;            // volume generale, basso (1 = massimo)
    var PAUSA = 20;               // secondi di silenzio tra un brano e il successivo
    var NOMI = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
    var SEMITONI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    var persona = document.querySelector('.hero .persona');
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!persona || !AC) return;   // browser senza Web Audio: niente altoparlante

    var box = document.createElement('div');
    box.className = 'musica';
    box.innerHTML =
      '<button type="button" class="musica-tasto" aria-pressed="false" aria-label="Accendi la musica" title="Musica">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path class="cassa" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/>' +
          '<path class="spento" d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>' +
          '<path class="acceso" d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7.2 7.2 0 0 1 0 10"/>' +
        '</svg>' +
      '</button>' +
      '<span class="musica-nota" aria-hidden="true"></span>';
    persona.appendChild(box);
    var tasto = box.querySelector('.musica-tasto');
    var etichetta = box.querySelector('.musica-nota');

    var ctx = null, uscita = null, timer = [], acceso = false;

    // Da "G4" alla frequenza: La4 = 440 Hz, ogni semitono moltiplica per la radice dodicesima di 2
    function frequenza(nota) {
      var midi = 12 * (+nota.slice(-1) + 1) + SEMITONI[nota[0]] + (nota[1] === '#' ? 1 : 0);
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // Una nota da carillon: suono puro piu' un'ottava sopra molto leggera, attacco rapido e spegnimento dolce
    function suona(f, t0, durata) {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(1, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + durata + 0.8);
      g.connect(uscita);
      [[f, 1], [2 * f, 0.15]].forEach(function (p) {
        var o = ctx.createOscillator(), v = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = p[0];
        v.gain.value = p[1];
        o.connect(v); v.connect(g);
        o.start(t0);
        o.stop(t0 + durata + 0.9);
      });
    }

    // Suona il brano n, poi aspetta la pausa e passa al successivo (dopo l'ultimo torna al primo)
    function brano(n) {
      if (!acceso) return;
      var b = brani[n], battito = 60 / b.bpm;
      var t = ctx.currentTime + 0.1, inizio = t;
      b.note.forEach(function (nota) {
        var f = frequenza(nota[0]), d = nota[1] * battito;
        suona(f, t, d);
        timer.push(setTimeout(function () {
          etichetta.textContent = NOMI[nota[0][0]] + ' ' + Math.round(f) + ' Hz';
          etichetta.classList.add('visibile');
        }, (t - ctx.currentTime) * 1000));
        t += d;
      });
      var fine = (t - inizio) * 1000 + 100;
      timer.push(setTimeout(function () { etichetta.classList.remove('visibile'); }, fine + 600));
      timer.push(setTimeout(function () { brano((n + 1) % brani.length); }, fine + PAUSA * 1000));
    }

    function accendi() {
      if (!ctx) ctx = new AC();
      if (ctx.resume) ctx.resume();
      uscita = ctx.createGain();
      uscita.gain.value = VOLUME;
      uscita.connect(ctx.destination);
      acceso = true;
      aggiorna();
      brano(0);
    }

    // Ferma i brani programmati e abbassa il volume in un attimo, senza scatti
    function spegni() {
      acceso = false;
      timer.forEach(clearTimeout);
      timer = [];
      if (uscita) {
        var vecchia = uscita;
        vecchia.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
        setTimeout(function () { vecchia.disconnect(); }, 400);
        uscita = null;
      }
      etichetta.classList.remove('visibile');
      aggiorna();
    }

    function aggiorna() {
      box.classList.toggle('acceso', acceso);
      tasto.setAttribute('aria-pressed', acceso ? 'true' : 'false');
      tasto.setAttribute('aria-label', acceso ? 'Spegni la musica' : 'Accendi la musica');
    }

    tasto.addEventListener('click', function () { acceso ? spegni() : accendi(); });
    // se si cambia scheda o si lascia la pagina, la musica si ferma
    document.addEventListener('visibilitychange', function () { if (document.hidden && acceso) spegni(); });
  }

  // Numeri romani (da 1 a 3999)
  function romani(n) {
    var valori = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    var segni = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    var s = '';
    for (var i = 0; i < valori.length; i++) {
      while (n >= valori[i]) { s += segni[i]; n -= valori[i]; }
    }
    return s;
  }
})();
