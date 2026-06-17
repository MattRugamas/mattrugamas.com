#!/usr/bin/env python3
"""Generate the social share card (Open Graph / Twitter) for the site.

Renders the "Editorial Minimal" card: the MR monogram, the name in Geist,
the "customers, product & code" line in Instrument Serif Italic, and a
monospace footer — all in the dark Liquid Glass palette, at 1200x630.
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = Path(__file__).resolve().parent

# --- Fonts (match _sass/_settings.scss type pairing) ---
SERIF_PATH = SCRIPTS / "InstrumentSerif-Italic.ttf"
GEIST_PATH = SCRIPTS / "Geist[wght].ttf"
GEIST_MONO_PATH = SCRIPTS / "GeistMono[wght].ttf"

FONTS = {
    SERIF_PATH: (
        "https://raw.githubusercontent.com/google/fonts/main/ofl/"
        "instrumentserif/InstrumentSerif-Italic.ttf"
    ),
    GEIST_PATH: (
        "https://raw.githubusercontent.com/google/fonts/main/ofl/geist/"
        "Geist%5Bwght%5D.ttf"
    ),
    GEIST_MONO_PATH: (
        "https://raw.githubusercontent.com/google/fonts/main/ofl/geistmono/"
        "GeistMono%5Bwght%5D.ttf"
    ),
}

# --- Palette (match _sass/_settings.scss dark mode) ---
BG = (23, 24, 28)  # #17181C base
FG = (242, 239, 232)  # #F2EFE8 warm off-white
ACCENT = (93, 200, 209)  # #5DC8D1 teal-cyan
MUTED = (168, 164, 155)  # #A8A49B inactive warm gray

W, H = 1200, 630
MARGIN = 80


def ensure_fonts() -> None:
    for path, url in FONTS.items():
        if path.exists():
            continue
        print(f"Downloading {path.name}…")
        urllib.request.urlretrieve(url, path)


def load(path: Path, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    if weight is not None:
        try:
            font.set_variation_by_axes([weight])
        except Exception:
            pass
    return font


def tracked_width(draw, text, font, tracking) -> float:
    if not text:
        return 0.0
    return sum(draw.textlength(ch, font=font) for ch in text) + tracking * (len(text) - 1)


def draw_tracked(draw, pos, text, font, fill, tracking) -> float:
    x, y = pos
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def main() -> None:
    ensure_fonts()

    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # --- MR monogram badge (outlined rounded square) ---
    badge = 96
    bx, by = MARGIN, 70
    radius = round(badge * 0.22)
    draw.rounded_rectangle(
        (bx, by, bx + badge, by + badge),
        radius=radius,
        outline=FG,
        width=2,
    )
    mono_serif = load(SERIF_PATH, 50)
    mtext = "MR"
    mbox = draw.textbbox((0, 0), mtext, font=mono_serif)
    mw, mh = mbox[2] - mbox[0], mbox[3] - mbox[1]
    draw.text(
        (bx + (badge - mw) / 2 - mbox[0], by + (badge - mh) / 2 - mbox[1] + badge * 0.02),
        mtext,
        font=mono_serif,
        fill=FG,
    )

    # --- Name (Geist, heavy) ---
    name_font = load(GEIST_PATH, 118, weight=700)
    name = "Matt Rugamas"
    name_y = 232
    nbox = draw.textbbox((0, 0), name, font=name_font)
    draw.text((MARGIN - nbox[0], name_y - nbox[1]), name, font=name_font, fill=FG)
    name_bottom = name_y + (nbox[3] - nbox[1])

    # --- Accent line (Instrument Serif Italic, teal) ---
    accent_font = load(SERIF_PATH, 76)
    accent = "customers, product & code"
    accent_y = name_bottom + 28
    abox = draw.textbbox((0, 0), accent, font=accent_font)
    draw.text((MARGIN - abox[0], accent_y - abox[1]), accent, font=accent_font, fill=ACCENT)

    # --- Footer (Geist Mono, tracked, uppercase) ---
    foot_font = load(GEIST_MONO_PATH, 22, weight=400)
    tracking = 2.5
    foot_y = H - MARGIN - 22
    left = "SUPPORT ENGINEER · MUSICIAN · LOS ANGELES"
    draw_tracked(draw, (MARGIN, foot_y), left, foot_font, MUTED, tracking)
    right = "mattrugamas.com"
    rw = tracked_width(draw, right, foot_font, tracking)
    draw_tracked(draw, (W - MARGIN - rw, foot_y), right, foot_font, MUTED, tracking)

    out = ROOT / "assets" / "img" / "site" / "social-card.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"Wrote {out.relative_to(ROOT)} ({W}x{H})")


if __name__ == "__main__":
    main()
