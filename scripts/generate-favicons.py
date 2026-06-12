#!/usr/bin/env python3
"""Generate the site favicon package from the nav MR wordmark."""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = Path(__file__).resolve().parent
FONT_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/"
    "InstrumentSerif-Italic.ttf"
)
FONT_PATH = SCRIPTS / "InstrumentSerif-Italic.ttf"

# Match _sass/_settings.scss dark palette.
BG = (23, 24, 28)  # #17181C
FG = (242, 239, 232)  # #F2EFE8
CORNER_RATIO = 0.1875  # ~96/512, aligned with prior rounded-square icons


def ensure_font() -> None:
    if FONT_PATH.exists():
        return
    print(f"Downloading {FONT_PATH.name}…")
    urllib.request.urlretrieve(FONT_URL, FONT_PATH)


def rounded_rect_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def render_mr(size: int, *, rounded: bool = True) -> Image.Image:
  """Render MR centered on a square canvas."""
  img = Image.new("RGBA", (size, size), (*BG, 255))
  draw = ImageDraw.Draw(img)

  # Scale type to feel like the nav mark (~1.3125rem in a ~56px row).
  font_size = max(8, round(size * 0.54))
  font = ImageFont.truetype(str(FONT_PATH), font_size)

  text = "MR"
  bbox = draw.textbbox((0, 0), text, font=font)
  text_w = bbox[2] - bbox[0]
  text_h = bbox[3] - bbox[1]
  x = (size - text_w) / 2 - bbox[0]
  # Optical center: serif italic sits a touch high in the cap box.
  y = (size - text_h) / 2 - bbox[1] + size * 0.02

  draw.text((x, y), text, font=font, fill=(*FG, 255))

  if rounded:
    radius = max(2, round(size * CORNER_RATIO))
    mask = rounded_rect_mask(size, radius)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out

  return img


def save_png(path: Path, size: int, *, rounded: bool = True) -> None:
  img = render_mr(size, rounded=rounded)
  if size <= 32:
    img = img.convert("RGB")
  else:
    # Flatten alpha onto the site base for PNGs that omit transparency.
    flat = Image.new("RGB", (size, size), BG)
    flat.paste(img, mask=img.split()[3])
    img = flat
  img.save(path, optimize=True)
  print(f"Wrote {path.name}")


def write_safari_pinned_tab(path: Path) -> None:
  # Monochrome silhouette for Safari pinned tabs; tint comes from mask-icon color.
  svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <text x="256" y="318" text-anchor="middle"
    font-family="'Instrument Serif', Georgia, serif"
    font-style="italic" font-size="280" fill="#000">MR</text>
</svg>
"""
  path.write_text(svg, encoding="utf-8")
  print(f"Wrote {path.name}")


def write_source_svg(path: Path) -> None:
  svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#{BG[0]:02x}{BG[1]:02x}{BG[2]:02x}"/>
  <text x="256" y="318" text-anchor="middle"
    font-family="'Instrument Serif', Georgia, serif"
    font-style="italic" font-size="280" fill="#{FG[0]:02x}{FG[1]:02x}{FG[2]:02x}">MR</text>
</svg>
"""
  path.write_text(svg, encoding="utf-8")
  print(f"Wrote {path.name}")


def main() -> None:
  ensure_font()

  assets = ROOT / "assets"
  assets.mkdir(exist_ok=True)
  write_source_svg(assets / "favicon-source.svg")

  outputs = {
    "favicon-16x16.png": (16, True),
    "favicon-32x32.png": (32, True),
    "mstile-150x150.png": (150, True),
    "apple-touch-icon.png": (180, True),
    "android-chrome-192x192.png": (192, True),
    "android-chrome-512x512.png": (512, True),
  }

  for name, (size, rounded) in outputs.items():
    save_png(ROOT / name, size, rounded=rounded)

  ico_sizes = [16, 32, 48]
  ico_images = [render_mr(s, rounded=True).convert("RGB") for s in ico_sizes]
  ico_path = ROOT / "favicon.ico"
  ico_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
  )
  print(f"Wrote {ico_path.name}")

  write_safari_pinned_tab(ROOT / "safari-pinned-tab.svg")


if __name__ == "__main__":
  main()
