#!/usr/bin/env python3
"""Generate the social share card (Open Graph / Twitter) for the site.

Quiet Surface card: system-stack sans (SF Pro on macOS, Geist fallback),
neutral dark palette, no serif, no teal. 1200x630.
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = Path(__file__).resolve().parent

GEIST_PATH = SCRIPTS / "Geist[wght].ttf"
GEIST_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/geist/"
    "Geist%5Bwght%5D.ttf"
)

SYSTEM_SANS = [
    Path("/System/Library/Fonts/SFNS.ttf"),
    Path("/System/Library/Fonts/SFProText.ttf"),
    Path("/System/Library/Fonts/SFProDisplay.ttf"),
    Path("/System/Library/Fonts/SFCompact.ttf"),
    Path("/Library/Fonts/SF-Pro.ttf"),
    Path("/System/Library/Fonts/Helvetica.ttc"),
    Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
]

# Quiet Surface dark palette
BG = (20, 20, 20)  # #141414
FG = (237, 237, 237)  # #EDEDED
MUTED = (138, 138, 138)  # #8A8A8A
HAIRLINE = (93, 93, 93)  # #5D5D5D

W, H = 1200, 630
MARGIN = 80


def resolve_sans() -> Path:
    for path in SYSTEM_SANS:
        if path.exists():
            return path
    if not GEIST_PATH.exists():
        print(f"Downloading {GEIST_PATH.name}…")
        urllib.request.urlretrieve(GEIST_URL, GEIST_PATH)
    return GEIST_PATH


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
    sans = resolve_sans()

    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    badge = 72
    bx, by = MARGIN, 86
    draw.rounded_rectangle(
        (bx, by, bx + badge, by + badge),
        radius=8,
        outline=HAIRLINE,
        width=1,
    )
    mono = load(sans, 28, weight=500)
    mtext = "MR"
    mbox = draw.textbbox((0, 0), mtext, font=mono)
    mw, mh = mbox[2] - mbox[0], mbox[3] - mbox[1]
    draw.text(
        (bx + (badge - mw) / 2 - mbox[0], by + (badge - mh) / 2 - mbox[1]),
        mtext,
        font=mono,
        fill=FG,
    )

    name_font = load(sans, 92, weight=500)
    name = "Matt Rugamas"
    name_y = 220
    nbox = draw.textbbox((0, 0), name, font=name_font)
    draw.text((MARGIN - nbox[0], name_y - nbox[1]), name, font=name_font, fill=FG)
    name_bottom = name_y + (nbox[3] - nbox[1])

    tag_font = load(sans, 36, weight=400)
    tag = "customers, product & code"
    tag_y = name_bottom + 24
    tbox = draw.textbbox((0, 0), tag, font=tag_font)
    draw.text((MARGIN - tbox[0], tag_y - tbox[1]), tag, font=tag_font, fill=MUTED)

    foot_font = load(sans, 20, weight=400)
    tracking = 1.6
    foot_y = H - MARGIN - 18
    left = "SUPPORT ENGINEER · MUSICIAN · LOS ANGELES"
    draw_tracked(draw, (MARGIN, foot_y), left, foot_font, MUTED, tracking)
    right = "mattrugamas.com"
    rw = tracked_width(draw, right, foot_font, tracking)
    draw_tracked(draw, (W - MARGIN - rw, foot_y), right, foot_font, MUTED, tracking)

    out = ROOT / "assets" / "img" / "site" / "social-card.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"Wrote {out.relative_to(ROOT)} ({W}x{H}) with {sans.name}")


if __name__ == "__main__":
    main()
