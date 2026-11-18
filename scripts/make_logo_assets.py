"""Génère le logo d'en-tête (detouré) et les favicons à partir du logo source."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "7140d49838aad3e5-manger_bien_logo_cutout.png"
ASSETS = ROOT / "assets"
PUBLIC = ROOT / "public"

src = Image.open(SRC).convert("RGBA")

# Recadrage serré sur le dessin (le PNG source a de grandes marges transparentes).
bbox = src.getchannel("A").getbbox()
if bbox is None:
    raise SystemExit("Logo entièrement transparent ?")
mark = src.crop(bbox)
w, h = mark.size

# Canevas carré avec une petite respiration autour du dessin (en-tête, pied de page).
side = int(max(w, h) * 1.08)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(mark, ((side - w) // 2, (side - h) // 2), mark)

header = canvas.resize((512, 512), Image.LANCZOS)
header.save(ASSETS / "manger_bien_logo_mark.png", optimize=True)
print("assets/manger_bien_logo_mark.png", header.size)

# Micro-icônes : le dessin remplit toute la tuile pour rester visible en 16 px.
square = Image.new("RGBA", (max(w, h), max(w, h)), (0, 0, 0, 0))
square.paste(mark, ((max(w, h) - w) // 2, (max(w, h) - h) // 2), mark)
for size in (16, 32, 48):
    icon = square.resize((size, size), Image.LANCZOS)
    icon.save(PUBLIC / f"favicon-{size}.png", optimize=True)
    print(f"public/favicon-{size}.png", icon.size)

for size in (192, 512):
    icon = canvas.resize((size, size), Image.LANCZOS)
    icon.save(PUBLIC / f"favicon-{size}.png", optimize=True)
    print(f"public/favicon-{size}.png", icon.size)

# Icône iOS : fond blanc obligatoire (pas de transparence).
touch = Image.new("RGB", (180, 180), (255, 255, 255))
inner = canvas.resize((148, 148), Image.LANCZOS)
touch.paste(inner, (16, 16), inner)
touch.save(PUBLIC / "apple-touch-icon.png", optimize=True)
print("public/apple-touch-icon.png", touch.size)
