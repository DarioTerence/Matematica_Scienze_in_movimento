/* Frasi della home: ne mostra una alla volta, in ordine casuale, con dissolvenza.
   Le frasi stanno nell'HTML (index.html, elenco con classe "frasi"): qui non c'e' nulla da modificare
   per aggiungerne una. Senza JavaScript resta visibile la prima frase dell'elenco. */
(function () {
  var elenco = document.querySelector('.frasi');
  if (!elenco) return;
  var frasi = elenco.querySelectorAll('li');
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

  // Avvio: toglie la frase scelta nell'HTML, ne sceglie una a caso e la mostra subito, senza dissolvenza
  elenco.classList.add('senza-transizione');
  for (var i = 0; i < frasi.length; i++) frasi[i].classList.remove('attiva');
  mostraProssima();
  void elenco.offsetHeight;               // obbliga il browser ad applicare lo stato prima di riattivare la dissolvenza
  elenco.classList.remove('senza-transizione');
})();
