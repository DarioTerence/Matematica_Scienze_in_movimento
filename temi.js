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
    { nome: 'compleanno', dal: '10-03', al: '10-05' },  // nascita del progetto, 4 ottobre 2026
    { nome: 'natale',     dal: '12-08', al: '01-06' }   // dall'Immacolata all'Epifania
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
  if (tema === 'natale') natale();

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

  /* ---------- Natale (8 dicembre - 6 gennaio) ---------- */
  function natale() {
    // Cappello natalizio sulla caricatura: dentro il link, cosi' si solleva con lei al passaggio del mouse
    var link = document.querySelector('.mascotte-link');
    if (link) {
      var cappello = document.createElement('span');
      cappello.className = 'cappello-natale';
      cappello.setAttribute('aria-hidden', 'true');
      cappello.innerHTML =
        '<svg viewBox="0 40 200 160" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="natRosso" x1="0" y1="0" x2="1" y2="0">' +
              '<stop offset="0" stop-color="#d4473f"/><stop offset=".45" stop-color="#b8322c"/><stop offset="1" stop-color="#7f1f1c"/>' +
            '</linearGradient>' +
            '<linearGradient id="natPelo" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd8e4"/>' +
            '</linearGradient>' +
            '<radialGradient id="natPompon" cx=".38" cy=".35" r=".7">' +
              '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c7d1de"/>' +
            '</radialGradient>' +
          '</defs>' +
          // corpo: largo come tutta la testa, sale e poi la punta si piega e ricade a destra
          '<path d="M16 178 C20 134 44 90 84 64 C106 50 138 44 160 52 C180 60 190 78 188 98 C178 86 164 82 152 86 C158 118 170 150 184 178 Z" fill="url(#natRosso)" stroke="#0a0f1a" stroke-width="3" stroke-linejoin="round"/>' +
          // piega dove la punta ricade e ombra sul fianco
          '<path d="M152 86 C158 118 170 150 184 178 L166 178 C156 146 148 114 142 94 Z" fill="#6e1b18" opacity=".55"/>' +
          '<path d="M84 64 C108 54 136 58 152 86" fill="none" stroke="#e5675e" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' +
          // pieghe morbide del tessuto
          '<path d="M52 156 C60 128 72 104 94 86 M102 168 C104 140 114 116 128 98" fill="none" stroke="#7f1f1c" stroke-width="2" stroke-linecap="round" opacity=".45"/>' +
          '<path d="M34 164 C40 132 56 104 78 84" fill="none" stroke="#ec8077" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
          // bordo di pelliccia, con il contorno a ciuffi
          '<path d="M 19.8 174 Q 17.4 164 29.2 162 Q 36.3 155 48.1 160 Q 57.5 153 69.3 159 Q 79.9 152 90.6 158 Q 101.2 151 111.8 158 Q 122.4 151 133 158 Q 143.7 152 154.3 159 Q 166.1 154 173.2 161 Q 185 162 182.6 172 Q 187.3 184 175.5 188 Q 168.4 196 156.6 191 Q 146 197 135.4 191 Q 123.6 198 111.8 191 Q 100 198 88.2 191 Q 76.4 197 64.6 191 Q 52.8 197 42.2 190 Q 26.8 194 24.5 184 Q 15 180 19.8 174 Z" fill="url(#natPelo)" stroke="#0a0f1a" stroke-width="3" stroke-linejoin="round"/>' +
          '<path d="M 41 172 q 4.7 4 0 9 M 64.6 170 q 4.7 5 0 10 M 90.6 170 q 4.7 5 0 10 M 116.5 170 q 4.7 5 0 10 M 142.5 170 q 4.7 5 0 10 M 163.7 172 q 4.7 4 0 9" fill="none" stroke="#b9c4d3" stroke-width="2" stroke-linecap="round"/>' +
          // pompon che pende dalla punta
          '<circle cx="186" cy="108" r="13" fill="url(#natPompon)" stroke="#0a0f1a" stroke-width="3"/>' +
          '<path d="M180 102 q3 -2 6 0 M189 112 q3 -1 5 1" fill="none" stroke="#b9c4d3" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg>';
      link.appendChild(cappello);
    }

    // Cristalli di neve nella zona del titolo: pochi, lenti, trasparenti, tutti a sei bracci.
    // Posizione, grandezza, ritardo e durata casuali; con prefers-reduced-motion restano fermi (temi.css).
    var NUMERO = 18;
    // un braccio con due rametti, ripetuto sei volte ruotando di 60 gradi
    var braccio = '<path d="M0 0 V-9 M0 -5 L-2.6 -7.4 M0 -5 L2.6 -7.4"/>';
    var bracci = '';
    for (var a = 0; a < 6; a++) bracci += '<g transform="rotate(' + (a * 60) + ')">' + braccio + '</g>';
    var cristallo = '<svg viewBox="-10 -10 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#e6ecf5" stroke-width="1.3" stroke-linecap="round">' + bracci + '</g></svg>';
    var hero = document.querySelector('.hero');
    if (hero) {
      var box = document.createElement('div');
      box.className = 'neve';
      box.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < NUMERO; k++) {
        var c = document.createElement('span');
        var lato = 8 + Math.random() * 9;
        c.innerHTML = cristallo;
        c.style.left = (Math.random() * 100).toFixed(1) + '%';
        c.style.width = c.style.height = lato.toFixed(1) + 'px';
        c.style.opacity = (0.25 + Math.random() * 0.3).toFixed(2);
        c.style.setProperty('--y', (Math.random() * 90).toFixed(1) + '%');
        c.style.setProperty('--ritardo', (-Math.random() * 20).toFixed(1) + 's');
        c.style.setProperty('--durata', (14 + Math.random() * 8).toFixed(1) + 's');
        c.style.setProperty('--giro', Math.round(Math.random() * 60) + 'deg');
        box.appendChild(c);
      }
      hero.insertBefore(box, hero.firstChild);
    }

    // Neve posata sul bordo alto delle card delle discipline e del fumetto: un cumulo irregolare in SVG,
    // scelto a caso tra tre forme, cosi' le card non sembrano tutte uguali.
    var CUMULI = [
      'M0 12 C6 12 6 5 14 5 C24 5 26 2 38 3 C52 4 56 7 70 6 C84 5 90 2 104 3 C118 4 122 7 136 6 C150 5 156 3 170 4 C182 5 188 8 194 9 C198 10 200 12 200 12 Z',
      'M0 12 C4 11 8 6 18 6 C30 6 34 3 48 3 C60 3 66 6 80 6 C92 6 98 4 112 4 C126 4 130 7 144 7 C158 7 164 3 178 4 C190 5 196 10 200 12 Z',
      'M0 12 C8 12 10 7 22 6 C34 5 38 2 52 2 C66 2 70 6 84 6 C98 6 104 3 118 3 C132 3 138 6 150 6 C164 6 170 4 182 5 C192 6 196 11 200 12 Z'
    ];
    var superfici = document.querySelectorAll('.griglia .card, .fumetto');
    for (var q = 0; q < superfici.length; q++) {
      var cumulo = document.createElement('span');
      cumulo.className = 'neve-posata';
      cumulo.setAttribute('aria-hidden', 'true');
      cumulo.innerHTML = '<svg viewBox="0 0 200 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="' + CUMULI[Math.floor(Math.random() * CUMULI.length)] + '"/></svg>';
      superfici[q].appendChild(cumulo);
    }

    // Pochi cristalli che scendono su tutta la pagina, sopra le card ma molto trasparenti e senza intralciare i clic
    var pagina = document.createElement('div');
    pagina.className = 'neve neve-pagina';
    pagina.setAttribute('aria-hidden', 'true');
    for (var r = 0; r < 14; r++) {
      var f = document.createElement('span');
      var l = 7 + Math.random() * 7;
      f.innerHTML = cristallo;
      f.style.left = (Math.random() * 100).toFixed(1) + '%';
      f.style.width = f.style.height = l.toFixed(1) + 'px';
      f.style.opacity = (0.15 + Math.random() * 0.2).toFixed(2);
      f.style.setProperty('--y', (Math.random() * 95).toFixed(1) + '%');
      f.style.setProperty('--ritardo', (-Math.random() * 26).toFixed(1) + 's');
      f.style.setProperty('--durata', (20 + Math.random() * 10).toFixed(1) + 's');
      f.style.setProperty('--giro', Math.round(Math.random() * 60) + 'deg');
      pagina.appendChild(f);
    }
    document.body.appendChild(pagina);

    // Prof. T rock: occhiali da sole e giubbotto di pelle, disegnati sopra la caricatura (coordinate dell'immagine,
    // 700 x 769). Stanno sotto il bagliore, che cosi' brilla sulla lente scura; si vedono solo con data-stile="rock".
    var mascotte = document.querySelector('.mascotte');
    if (mascotte) {
      var look = document.createElement('span');
      look.className = 'look-rock';
      look.setAttribute('aria-hidden', 'true');
      look.innerHTML =
        '<svg viewBox="0 0 700 769" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="rkLente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3644"/><stop offset="1" stop-color="#0d1016"/></linearGradient>' +
            '<linearGradient id="rkPelle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d6470"/><stop offset=".45" stop-color="#363b44"/><stop offset="1" stop-color="#22262d"/></linearGradient>' +
          '</defs>' +
          // giubbotto di pelle aperto sulla maglietta: due pannelli, baveri, cerniera e cuciture
          '<path d="M10 769 C30 690 104 640 224 592 C238 602 252 612 266 622 L318 769 Z" fill="url(#rkPelle)" stroke="#05070a" stroke-width="7" stroke-linejoin="round"/>' +
          '<path d="M690 769 C670 690 596 640 476 592 C462 602 448 612 434 622 L382 769 Z" fill="url(#rkPelle)" stroke="#05070a" stroke-width="7" stroke-linejoin="round"/>' +
          '<path d="M224 592 C196 616 186 646 198 672 L282 716 L262 640 Z" fill="#474d58" stroke="#05070a" stroke-width="6" stroke-linejoin="round"/>' +
          '<path d="M476 592 C504 616 514 646 502 672 L418 716 L438 640 Z" fill="#474d58" stroke="#05070a" stroke-width="6" stroke-linejoin="round"/>' +
          '<path d="M210 610 C200 630 198 650 206 664 M490 610 C500 630 502 650 494 664" fill="none" stroke="#9aa3ae" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
          '<path d="M398 690 L414 769" stroke="#c3cad3" stroke-width="4" stroke-dasharray="6 5"/>' +
          '<path d="M60 760 C86 700 140 662 208 636 M640 760 C614 700 560 662 492 636" fill="none" stroke="#5a616c" stroke-width="3" opacity=".7"/>' +
          '<path d="M120 700 C140 690 160 684 176 682" fill="none" stroke="#6b7480" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
          // occhiali da sole stile anni Cinquanta: montatura spessa in alto, lenti scure con un riflesso
          '<path d="M186 282 L156 300 M530 282 L560 300" stroke="#05070a" stroke-width="12" stroke-linecap="round"/>' +
          '<path d="M190 270 L352 276 L344 334 Q336 378 280 378 Q218 378 204 332 Z" fill="url(#rkLente)" stroke="#05070a" stroke-width="10" stroke-linejoin="round"/>' +
          '<path d="M526 270 L364 276 L372 334 Q380 378 436 378 Q498 378 512 332 Z" fill="url(#rkLente)" stroke="#05070a" stroke-width="10" stroke-linejoin="round"/>' +
          '<path d="M186 268 L354 274 L362 274 L530 268 L528 290 L362 292 L354 292 L188 290 Z" fill="#11141a" stroke="#05070a" stroke-width="6" stroke-linejoin="round"/>' +
          '<path d="M232 300 L262 300 L222 352 M402 300 L432 300 L392 352" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".22"/>' +
          '<circle cx="206" cy="279" r="5" fill="#9aa3ae"/><circle cx="510" cy="279" r="5" fill="#9aa3ae"/>' +
        '</svg>';
      mascotte.insertBefore(look, mascotte.querySelector('.bagliore'));
    }

    musica(braniNatale(), true);
  }

  /* Brani del tema natalizio (melodie di pubblico dominio), scritti come "nota:durata" e "accordo:durata".
     unita 4 = durate in quarti, unita 8 = durate in ottavi; misura = unita per battuta; levare = unita prima della prima battuta.
     bpm per la versione normale (carillon), bpmRock per la versione rock. */
  function braniNatale() {
    var JB_STROFA = 'D4:1 B4:1 A4:1 G4:1 D4:3 D4:0.5 D4:0.5 D4:1 B4:1 A4:1 G4:1 E4:4 E4:1 C5:1 B4:1 A4:1 F#4:4 D5:1 D5:1 C5:1 A4:1 B4:4 D4:1 B4:1 A4:1 G4:1 D4:4 D4:1 B4:1 A4:1 G4:1 E4:3 E4:1 E4:1 C5:1 B4:1 A4:1 D5:1 D5:1 D5:1 D5:1 E5:1 D5:1 C5:1 A4:1 G4:2 D5:2';
    var JB_RIT = 'B4:0.5 B4:0.5 B4:1 B4:0.5 B4:0.5 B4:1 B4:0.5 D5:0.5 G4:0.75 A4:0.25 B4:2 C5:0.5 C5:0.5 C5:0.75 C5:0.25 C5:0.5 B4:0.5 B4:0.5 B4:0.25 B4:0.25 B4:0.5 A4:0.5 A4:0.5 B4:0.5 A4:1 D5:1 B4:0.5 B4:0.5 B4:1 B4:0.5 B4:0.5 B4:1 B4:0.5 D5:0.5 G4:0.75 A4:0.25 B4:2 C5:0.5 C5:0.5 C5:0.75 C5:0.25 C5:0.5 B4:0.5 B4:0.5 B4:0.25 B4:0.25 D5:0.5 D5:0.5 C5:0.5 A4:0.5 G4:2';
    var JB_ACC = 'G:4 G:4 G:4 C:4 C:4 D:4 D:4 G:4 G:4 G:4 G:4 C:4 C:4 D:4 D:4 G:4 G:4 G:4 C:2 G:2 A:2 D:2 G:4 G:4 C:2 G:2 D:2 G:2';
    var WW_STROFA = 'G4:1 G4:0.5 A4:0.5 G4:0.5 F#4:0.5 E4:1 E4:1 E4:1 A4:1 A4:0.5 B4:0.5 A4:0.5 G4:0.5 F#4:1 D4:1 D4:1 B4:1 B4:0.5 C5:0.5 B4:0.5 A4:0.5 G4:1 E4:1 D4:0.5 D4:0.5 E4:1 A4:1 F#4:1';
    var WW_RIT = 'G4:1 G4:1 G4:1 F#4:2 F#4:1 G4:1 F#4:1 E4:1 D4:2 A4:1 B4:1 A4:1 G4:1 D5:1 D4:1 D4:0.5 D4:0.5 E4:1 A4:1 F#4:1';
    var WW_ACC = 'G:3 C:3 A:3 D:3 B:3 E:3 C:1.5 D:1.5 G:3';
    return [
      // Jingle Bells (James Lord Pierpont, 1857): strofa e ritornello, due volte
      { unita: 4, misura: 4, levare: 0, bpm: 132, bpmRock: 168,
        note: [JB_STROFA, JB_RIT, JB_STROFA, JB_RIT].join(' '), accordi: JB_ACC + ' ' + JB_ACC },
      // We Wish You a Merry Christmas (canto tradizionale inglese): strofa, strofa, Good tidings, strofa
      { unita: 4, misura: 3, levare: 1, bpm: 120, bpmRock: 150,
        note: ['D4:1', WW_STROFA, 'G4:2 D4:1', WW_STROFA, 'G4:2 D4:1', WW_RIT, 'G4:2 D4:1', WW_STROFA, 'G4:3'].join(' '),
        accordi: [WW_ACC, WW_ACC, 'G:3 D:3 E:3 D:3 G:3 G:3 C:1.5 D:1.5 G:3', WW_ACC].join(' ') },
      // Tu scendi dalle stelle (sant'Alfonso Maria de' Liguori, XVIII secolo), 6/8
      { unita: 8, misura: 6, levare: 1, bpm: 160, bpmRock: 190,
        note: 'G4:1 G4:2 A4:1 G4:2 F4:1 F4:2 E4:3 D4:1 E4:2 F4:1 G4:2 G4:1 F4:2 E4:1 D4:2 E4:1 D4:2 E4:1 F4:2 E4:1 D4:2 A4:1 G4:2 A4:1 G4:2 F4:1 E4:2 D4:1 E4:5 E4:1 D4:2 E4:1 F4:2 E4:1 D4:2 A4:1 G4:2 A4:1 G4:2 F4:1 E4:2 D4:1 C4:5 E4:1 F4:2 G4:1 F4:2 F4:1 D4:2 E4:1 F4:1 E4:1 E4:1 E4:1 F4:1 G4:1 F4:2 F4:1 D4:2 E4:1 F4:1 E4:1 D4:1 E4:2 F4:1 G4:2 G4:1 F4:2 E4:1 D4:2 E4:1 D4:2 E4:1 F4:2 E4:1 D4:2 A4:1 G4:2 A4:1 G4:2 F4:1 E4:2 D4:1 E4:5 E4:1 D4:2 E4:1 F4:2 E4:1 D4:2 A4:1 G4:2 A4:1 G4:2 F4:1 E4:2 D4:1 C4:6',
        accordi: 'C:3 G:3 F:3 C:9 F:3 G:6 F:3 G:3 C:3 G:3 C:9 G:3 F:3 G:3 C:3 G:3 C:9 G:3 F:3 G:3 C:6 F:3 G:6 C:6 F:3 G:6 F:3 G:3 C:3 G:3 C:9 G:3 F:3 G:3 C:3 G:3 C:9' }
    ];
  }

  /* ---------- Musica dei temi ----------
     Altoparlante accanto alla caricatura, spento all'apertura: i browser non lasciano partire
     un suono senza un tocco di chi visita (e in classe e' meglio cosi').
     Al tocco suona i brani dell'elenco uno dopo l'altro, con una pausa tra un brano e l'altro,
     poi ricomincia; un altro tocco ferma tutto. Il suono e' generato nel codice (Web Audio API),
     nota per nota: nessun file audio, nessun diritto sulle registrazioni.
     Due stili: normale (timbro morbido da carillon) e, se conRock e i brani hanno gli accordi, rock
     (chitarra solista, power chord, basso e batteria, tutti sintetizzati); il tasto con la chitarra
     cambia stile e mette data-stile="rock" su <html> (Prof. T con occhiali da sole e giubbotto).
     Mentre suona, accanto all'altoparlante compaiono la nota della melodia e la sua frequenza.
     Le note e i colpi si programmano poco alla volta (0,4 s in anticipo), per non creare migliaia
     di suoni tutti insieme. */
  function musica(brani, conRock) {
    var VOLUME = 0.045;           // volume generale, basso (1 = massimo)
    var VOLUME_ROCK = 0.7;        // il rock e' piu' pieno: lo si abbassa ancora perche' suoni forte come il carillon
    var PAUSA = 4;                // secondi di silenzio tra un brano e il successivo
    var ANTICIPO = 0.4;           // secondi di suoni programmati in anticipo
    var NOMI = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
    var SEMITONI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    var persona = document.querySelector('.hero .persona');
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!persona || !AC) return;   // browser senza Web Audio: niente altoparlante

    // I brani possono avere le note come elenco [['G4', 1], ...] oppure come testo "G4:1 A4:0.5 ..."
    function leggi(x) {
      if (typeof x !== 'string') return x;
      return x.split(' ').map(function (p) { var q = p.split(':'); return [q[0], +q[1]]; });
    }
    brani = brani.map(function (b) {
      return { bpm: b.bpm, bpmRock: b.bpmRock, unita: b.unita || 4, misura: b.misura || 4,
               levare: b.levare || 0, note: leggi(b.note), accordi: b.accordi ? leggi(b.accordi) : null };
    });
    conRock = conRock && brani.every(function (b) { return b.accordi; });

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
      (conRock ?
      '<button type="button" class="musica-stile" aria-pressed="false" aria-label="Versione rock" title="Versione rock">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          // chitarra elettrica in diagonale: paletta con le chiavette, manico, corpo a doppia spalla, ponte
          '<path class="corpo" d="M11.2 12.8c-.6-1.6-2.6-2.2-3.8-1.1-.6.5-.5 1.4-1.4 1.6-1.9.4-3 2.4-2.1 4.2.4.8 1 1.4 1.8 1.8 1.8.9 3.8-.2 4.2-2.1.2-.9 1.1-.8 1.6-1.4 1.1-1.2.5-3.2-1.1-3.8z"/>' +
          '<path d="M10.6 13.4L18.4 5.6"/>' +
          '<path class="corpo" d="M18 4.4l1.6-1.6 1.6 1.6-1.6 1.6z"/>' +
          '<path d="M6.6 15.6l1.8 1.8M8.4 13.8l1.8 1.8"/>' +
        '</svg>' +
      '</button>' : '') +
      '<span class="musica-nota" aria-hidden="true"></span>';
    persona.appendChild(box);
    var tasto = box.querySelector('.musica-tasto');
    var tastoStile = box.querySelector('.musica-stile');
    var etichetta = box.querySelector('.musica-nota');

    var ctx = null, uscita = null, timer = [], acceso = false, rock = false, corrente = 0, rumore = null, curve = {};

    // Da "G4" o "F#4" alla frequenza: La4 = 440 Hz, ogni semitono moltiplica per la radice dodicesima di 2
    function midi(nota) { return 12 * (+nota.slice(-1) + 1) + SEMITONI[nota[0]] + (nota[1] === '#' ? 1 : 0); }
    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function nomeNota(nota) { return NOMI[nota[0]] + (nota[1] === '#' ? '#' : ''); }

    /* --- Strumenti --- */
    // Carillon: suono puro piu' un'ottava sopra molto leggera, attacco rapido e spegnimento dolce
    function carillon(f, t0, durata) {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(1, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + durata + 0.8);
      g.connect(uscita);
      [[f, 1], [2 * f, 0.15]].forEach(function (p) {
        var o = ctx.createOscillator(), v = ctx.createGain();
        o.type = 'sine'; o.frequency.value = p[0]; v.gain.value = p[1];
        o.connect(v); v.connect(g); o.start(t0); o.stop(t0 + durata + 0.9);
      });
    }
    // Distorsione morbida (tangente iperbolica): piu' grande k, piu' "graffia"
    function distorsore(k) {
      if (!curve[k]) {
        var c = new Float32Array(1024);
        for (var i = 0; i < 1024; i++) c[i] = Math.tanh(k * (i / 511.5 - 1));
        curve[k] = c;
      }
      var w = ctx.createWaveShaper(); w.curve = curve[k]; return w;
    }
    function filtro(tipo, f) { var b = ctx.createBiquadFilter(); b.type = tipo; b.frequency.value = f; return b; }
    // Inviluppo: sale in 'attacco' secondi, poi resta (tenuta) o si spegne con costante 'coda'
    function inviluppo(t0, livello, attacco, tenuta, coda) {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(livello, t0 + attacco);
      g.gain.setTargetAtTime(0, t0 + attacco + tenuta, coda);
      return g;
    }
    function oscillatori(tipo, freq, t0, fine, dest) {
      freq.forEach(function (f) {
        var o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f;
        o.connect(dest); o.start(t0); o.stop(fine);
      });
    }
    // Chitarra solista: due denti di sega appena scordati, distorsione leggera, suono scuro
    function solista(f, t0, d) {
      var lp = filtro('lowpass', 2200), w = distorsore(1.4), g = inviluppo(t0, 0.9, 0.012, d, 0.05), v = ctx.createGain();
      v.gain.value = 0.32; g.connect(w); w.connect(lp); lp.connect(v); v.connect(uscita);
      oscillatori('sawtooth', [f, f * 1.004], t0, t0 + d + 0.4, g);
    }
    // Power chord stoppato (fondamentale, quinta, ottava) e nota di basso
    function powerChord(r, t0, forza) {
      var lp = filtro('lowpass', 1400), w = distorsore(2.2), g = inviluppo(t0, 0.35 * forza, 0.005, 0, 0.1), v = ctx.createGain();
      v.gain.value = 0.16; g.connect(w); w.connect(lp); lp.connect(v); v.connect(uscita);
      oscillatori('sawtooth', [hz(r), hz(r + 7), hz(r + 12)], t0, t0 + 0.6, g);
    }
    function basso(r, t0) {
      var g = inviluppo(t0, 0.5, 0.006, 0, 0.18);
      g.connect(uscita);
      oscillatori('sine', [hz(r - 12)], t0, t0 + 0.8, g);
    }
    function cassa(t0) {
      var o = ctx.createOscillator(), g = inviluppo(t0, 0.9, 0.003, 0, 0.11);
      o.frequency.setValueAtTime(125, t0); o.frequency.exponentialRampToValueAtTime(45, t0 + 0.12);
      o.connect(g); g.connect(uscita); o.start(t0); o.stop(t0 + 0.5);
    }
    function colpoRumore(t0, tipo, f, livello, coda) {
      if (!rumore) {
        rumore = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        var dati = rumore.getChannelData(0);
        for (var i = 0; i < dati.length; i++) dati[i] = Math.random() * 2 - 1;
      }
      var s = ctx.createBufferSource(), b = filtro(tipo, f), g = inviluppo(t0, livello, 0.002, 0, coda);
      s.buffer = rumore; s.connect(b); b.connect(g); g.connect(uscita);
      s.start(t0, Math.random() * 0.5); s.stop(t0 + coda * 6);
    }
    function rullante(t0, forza) {
      colpoRumore(t0, 'lowpass', 4000, 0.32 * forza, 0.05);
      var g = inviluppo(t0, 0.25 * forza, 0.002, 0, 0.05); g.connect(uscita);
      oscillatori('sine', [185], t0, t0 + 0.3, g);
    }
    function charleston(t0, forte) { colpoRumore(t0, 'highpass', 6000, forte ? 0.14 : 0.08, 0.014); }

    /* --- Eventi di un brano: [secondi dall'inizio, funzione(t assoluto)] --- */
    function etichettaDopo(t, testo) {
      timer.push(setTimeout(function () {
        etichetta.textContent = testo;
        etichetta.classList.add('visibile');
      }, Math.max(0, (t - ctx.currentTime) * 1000)));
    }
    function eventiMelodia(b, u, strumento) {
      var ev = [], t = 0;
      b.note.forEach(function (n) {
        var f = hz(midi(n[0])), d = n[1] * u, nome = nomeNota(n[0]) + ' ' + Math.round(f) + ' Hz';
        ev.push([t, function (ta) { strumento(f, ta, d); etichettaDopo(ta, nome); }]);
        t += d;
      });
      return { ev: ev, durata: t };
    }
    function eventiRock(b, u) {
      var m = eventiMelodia(b, u, solista), ev = m.ev;
      var lev = b.levare * u, ottavo = b.unita === 8 ? u : u / 2;
      var perMisura = Math.round(b.misura * u / ottavo);
      var t = lev, k = 0, ultimo = 43;
      b.accordi.forEach(function (a) {
        var r = 40 + SEMITONI[a[0][0]] + (a[0][1] === '#' ? 1 : 0);
        if (r < 43) r += 12;
        ultimo = r;
        var colpi = Math.round(a[1] * u / ottavo);
        for (var i = 0; i < colpi; i++) {
          (function (r, q, tc) {
            var forte = q % (b.unita === 8 ? 3 : 2) === 0;
            ev.push([tc, function (ta) {
              powerChord(r, ta, forte ? 1 : 0.65); basso(r, ta); charleston(ta, q % 2 === 0);
              if (b.unita === 8) { if (q === 0) cassa(ta); if (q === 3) rullante(ta, 1); }
              else if (b.misura === 3) { if (q === 0) cassa(ta); if (q === 2) rullante(ta, 0.8); if (q === 4) rullante(ta, 1); }
              else { if (q === 0 || q === 4 || q === 5) cassa(ta); if (q === 2 || q === 6) rullante(ta, 1); }
            }]);
          })(r, k % perMisura, t + i * ottavo);
          k++;
        }
        t += a[1] * u;
      });
      // colpo finale: accordo lungo e cassa
      ev.push([t, function (ta) {
        cassa(ta);
        var lp = filtro('lowpass', 1500), w = distorsore(2.2), g = inviluppo(ta, 0.35, 0.005, 0, 0.8), v = ctx.createGain();
        v.gain.value = 0.16; g.connect(w); w.connect(lp); lp.connect(v); v.connect(uscita);
        oscillatori('sawtooth', [hz(ultimo), hz(ultimo + 7), hz(ultimo + 12)], ta, ta + 3, g);
      }]);
      ev.sort(function (x, y) { return x[0] - y[0]; });
      return { ev: ev, durata: Math.max(m.durata, t) + 1.5 };
    }

    // Suona il brano n nello stile scelto, poi aspetta la pausa e passa al successivo (dopo l'ultimo torna al primo)
    function brano(n) {
      if (!acceso) return;
      corrente = n;
      var b = brani[n], conStileRock = rock && b.accordi;
      var u = 60 / (conStileRock ? b.bpmRock : b.bpm);
      var p = conStileRock ? eventiRock(b, u) : eventiMelodia(b, u, carillon);
      uscita.gain.value = VOLUME * (conStileRock ? VOLUME_ROCK : 1);
      var inizio = ctx.currentTime + 0.1, i = 0;
      function programma() {
        if (!acceso) return;
        var limite = ctx.currentTime + ANTICIPO;
        while (i < p.ev.length && inizio + p.ev[i][0] < limite) { p.ev[i][1](inizio + p.ev[i][0]); i++; }
        if (i < p.ev.length) { timer.push(setTimeout(programma, 100)); return; }
        var resta = (inizio + p.durata - ctx.currentTime) * 1000;
        timer.push(setTimeout(function () { etichetta.classList.remove('visibile'); }, resta + 600));
        timer.push(setTimeout(function () { brano((n + 1) % brani.length); }, resta + PAUSA * 1000));
      }
      programma();
    }

    function accendi(n) {
      if (!ctx) ctx = new AC();
      if (ctx.resume) ctx.resume();
      uscita = ctx.createGain();
      uscita.gain.value = VOLUME;
      uscita.connect(ctx.destination);
      acceso = true;
      aggiorna();
      brano(n || 0);
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
      if (tastoStile) {
        tastoStile.setAttribute('aria-pressed', rock ? 'true' : 'false');
        tastoStile.setAttribute('aria-label', rock ? 'Versione normale' : 'Versione rock');
        tastoStile.title = rock ? 'Versione normale' : 'Versione rock';
      }
      if (rock) document.documentElement.setAttribute('data-stile', 'rock');
      else document.documentElement.removeAttribute('data-stile');
    }

    tasto.addEventListener('click', function () { acceso ? spegni() : accendi(0); });
    // cambio di stile: se la musica suona, il brano in corso ricomincia nel nuovo stile
    if (tastoStile) tastoStile.addEventListener('click', function () {
      rock = !rock;
      if (acceso) { var n = corrente; spegni(); accendi(n); } else aggiorna();
    });
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
