"""Rigenera og_image.jpg (anteprima dei link: WhatsApp, chat, social).

Cosa fa: apre og_image.html in un browser senza finestra (Chromium, tramite
Playwright), ne fa una "fotografia" di 1200x630 pixel e la salva come JPG
di qualità alta (92, senza riduzione dei colori), che è il formato scelto
per questa immagine (circa 130 KB).

Uso, dalla radice del repository:
    python3 immagini/og_image/genera_og_image.py
oppure, per salvare altrove (utile per provare senza toccare il file vero):
    python3 immagini/og_image/genera_og_image.py /percorso/prova.jpg

Requisiti: Python 3 con i pacchetti playwright e pillow
(pip install playwright pillow; poi: playwright install chromium).

Quando rifarla: se cambiano titolo o sottotitolo della home, la firma o la
caricatura (prof_t.webp). Dopo averla rigenerata, fare commit di og_image.jpg:
i social e WhatsApp tengono l'anteprima vecchia in cache; per aggiornarla
usare il Debugger di Facebook (Scrape again).

Font: nella pagina sono indicati Cambria e Calibri; se non sono installati
il browser usa Caladea e Carlito, che hanno le stesse misure. Il risultato
può quindi differire di poco da una macchina all'altra.
"""
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

# Cartella di questo file e radice del repository (due livelli più su)
qui = Path(__file__).resolve().parent
radice = qui.parent.parent

# Dove salvare il risultato: argomento da riga di comando, altrimenti og_image.jpg nella radice
uscita = Path(sys.argv[1]) if len(sys.argv) > 1 else radice / "og_image.jpg"
temporaneo = uscita.with_suffix(".tmp.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    pagina = browser.new_page(viewport={"width": 1200, "height": 630})
    pagina.goto((qui / "og_image.html").as_uri())
    pagina.wait_for_timeout(500)  # attende il caricamento di immagini e font
    pagina.screenshot(path=str(temporaneo))
    browser.close()

# Conversione da PNG (appoggio) a JPG, qualità 92, colori interi (subsampling=0)
immagine = Image.open(temporaneo).convert("RGB")
immagine.save(uscita, quality=92, subsampling=0, optimize=True)
temporaneo.unlink()

print(f"Salvata {uscita} ({immagine.size[0]}x{immagine.size[1]} px, {uscita.stat().st_size // 1024} KB)")
