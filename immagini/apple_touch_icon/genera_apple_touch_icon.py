"""Rigenera apple-touch-icon.png (icona per la schermata Home di iPhone e iPad).

Cosa fa: apre apple_touch_icon.svg in un browser senza finestra (Chromium,
tramite Playwright), ne fa una "fotografia" di 180x180 pixel e la salva come
PNG nella radice del repository. L'SVG è la favicon (favicon.svg) in versione
quadrata: senza angoli arrotondati (li applica iOS) e con il pianeta fermo.

Uso, dalla radice del repository:
    python3 immagini/apple_touch_icon/genera_apple_touch_icon.py
oppure, per salvare altrove (utile per provare senza toccare il file vero):
    python3 immagini/apple_touch_icon/genera_apple_touch_icon.py /percorso/prova.png

Requisiti: Python 3 con il pacchetto playwright
(pip install playwright; poi: playwright install chromium).

Quando rifarla: se cambia il disegno della favicon. Dopo averla rigenerata,
fare commit di apple-touch-icon.png.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# Cartella di questo file e radice del repository (due livelli più su)
qui = Path(__file__).resolve().parent
radice = qui.parent.parent

# Dove salvare il risultato: argomento da riga di comando, altrimenti apple-touch-icon.png nella radice
uscita = Path(sys.argv[1]) if len(sys.argv) > 1 else radice / "apple-touch-icon.png"

# Pagina minima che mostra l'SVG a 180x180 pixel, senza margini
html = (
    "<html><body style='margin:0;background:#0a0f1a'>"
    f"<img src='{(qui / 'apple_touch_icon.svg').as_uri()}' width='180' height='180' style='display:block'>"
    "</body></html>"
)
pagina_temp = qui / "_temp.html"
pagina_temp.write_text(html, encoding="utf-8")

with sync_playwright() as p:
    browser = p.chromium.launch()
    pagina = browser.new_page(viewport={"width": 180, "height": 180})
    pagina.goto(pagina_temp.as_uri())
    pagina.wait_for_timeout(300)  # attende il caricamento dell'immagine
    pagina.screenshot(path=str(uscita))
    browser.close()

pagina_temp.unlink()
print(f"Salvata {uscita} (180x180 px, {uscita.stat().st_size} byte)")
