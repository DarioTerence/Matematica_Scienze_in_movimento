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
