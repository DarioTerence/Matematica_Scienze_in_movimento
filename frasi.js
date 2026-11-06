/* Frasi della home: ne mostra una alla volta, in ordine casuale, con dissolvenza.
   Le frasi stanno nell'HTML (index.html, elenco con classe "frasi"): qui non c'e' nulla da modificare
   per aggiungerne una. Senza JavaScript resta visibile la frase con class="attiva".
   Frasi con data: un <li> con data-dal="MM-GG" e data-al="MM-GG" compare solo in quei giorni
   (estremi compresi, ogni anno, anche a cavallo di Capodanno come 12-08 / 01-06), secondo la data
   del dispositivo; nei suoi giorni e' la prima frase mostrata all'apertura.
   Anteprima: aggiungendo ?data=MM-GG all'indirizzo la home si comporta come in quel giorno. */
(function () {
  var elenco = document.querySelector('.frasi');
  if (!elenco) return;
  var tutte = elenco.querySelectorAll('li');

  // Giorno di oggi come "MM-GG" (o quello dell'anteprima ?data=MM-GG)
  function dueCifre(n) { return (n < 10 ? '0' : '') + n; }
  var adesso = new Date();
  var oggi = dueCifre(adesso.getMonth() + 1) + '-' + dueCifre(adesso.getDate());
  var anteprima = /[?&]data=(\d{2}-\d{2})/.exec(location.search);
  if (anteprima) oggi = anteprima[1];

  // Tiene le frasi senza data e quelle con data nel loro periodo; ricorda le frasi del giorno
  var frasi = [], delGiorno = [];
  for (var n = 0; n < tutte.length; n++) {
    var dal = tutte[n].getAttribute('data-dal'), al = tutte[n].getAttribute('data-al');
    if (dal && al) {
      var dentro = dal <= al ? (oggi >= dal && oggi <= al) : (oggi >= dal || oggi <= al);
      if (!dentro) { tutte[n].classList.remove('attiva'); continue; }
      delGiorno.push(frasi.length);
    }
    frasi.push(tutte[n]);
  }
  if (frasi.length < 2) return;           // con una sola frase non c'e' niente da far ruotare

  var DISSOLVENZA = 1000;                 // millisecondi, uguale al tempo scritto in style.css
  var ordine = [];                        // indici delle frasi, nell'ordine in cui verranno mostrate
  var corrente = -1;                      // frase attualmente visibile

  // Prepara un nuovo giro: tutte le frasi mescolate (metodo di Fisher-Yates).
  // Ogni frase compare una volta per giro, quindi non ci sono ripetizioni ravvicinate.
  function mescola() {
    ordine = [];
    for (var i = 0; i < frasi.length; i++) ordine.push(i);
    for (var j = ordine.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = ordine[j]; ordine[j] = ordine[k]; ordine[k] = tmp;
    }
    // se la prima del nuovo giro e' uguale all'ultima del giro precedente, la scambia con la seconda
    if (ordine[0] === corrente) {
      var t = ordine[0]; ordine[0] = ordine[1]; ordine[1] = t;
    }
  }

  // Tempo di lettura: base fissa piu' qualche millisecondo per carattere, tra 6 e 11 secondi
  function durata(li) {
    var ms = 3500 + li.textContent.length * 50;
    return Math.max(6000, Math.min(11000, ms));
  }

  function mostraProssima() {
    if (ordine.length === 0) mescola();
    corrente = ordine.shift();
    frasi[corrente].classList.add('attiva');
    setTimeout(nascondi, durata(frasi[corrente]));
  }

  // Prima fa dissolvere la frase, poi (a dissolvenza finita) compare la successiva:
  // cosi' non si vedono mai due frasi sovrapposte.
  function nascondi() {
    frasi[corrente].classList.remove('attiva');
    setTimeout(mostraProssima, DISSOLVENZA);
  }

  // Avvio: toglie la frase scelta nell'HTML, ne sceglie una a caso e la mostra subito, senza dissolvenza.
  // Se oggi c'e' una frase con data, il primo giro comincia da quella.
  elenco.classList.add('senza-transizione');
  for (var i = 0; i < frasi.length; i++) frasi[i].classList.remove('attiva');
  mescola();
  if (delGiorno.length) {
    var prima = delGiorno[Math.floor(Math.random() * delGiorno.length)];
    ordine.splice(ordine.indexOf(prima), 1);
    ordine.unshift(prima);
  }
  mostraProssima();
  void elenco.offsetHeight;               // obbliga il browser ad applicare lo stato prima di riattivare la dissolvenza
  elenco.classList.remove('senza-transizione');
})();
