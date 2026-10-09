"""Generate per-project Open Graph cards (1200x630 PNG) from site data.

Usage:  python3 scripts/generate_og_cards.py
Reads:  public/data/projects.json
Writes: public/assets/og/<id>.png  (committed; copied to dist/ by the build)

The prerender step (`scripts/prerender-projects.mjs`) prefers these cards for
og:image / twitter:image and falls back to the project screenshot when a card
is missing — so Netlify builds need no Python, just the committed PNGs.
Requires: Pillow  (pip install pillow)
"""
import json
import re
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "public" / "data" / "projects.json").read_text())
OUT_DIR = ROOT / "public" / "assets" / "og"
LOGO = ROOT / "public" / "assets" / "images" / "profile" / "logo-trp.png"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
BG = (23, 20, 18)
TEXT = (236, 231, 223)
MUTED = (163, 158, 147)
ACCENT = (232, 88, 84)


def font(size, bold=True):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def safe_id(pid):
    return re.sub(r"[^A-Za-z0-9_-]+", "-", str(pid)).strip("-") or "project"


def draw_spaced(draw, xy, text, fnt, fill, tracking=4):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += int(draw.textlength(ch, font=fnt) + tracking)
    return x


def wrap_title(draw, title, fnt, max_width, max_lines=3):
    words, lines, line = title.split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            line = trial
        else:
            lines.append(line)
            line = w
            if len(lines) == max_lines - 1:
                break
    lines.append(line)
    # Ellipsize a spillover remainder.
    rest = " ".join(words[len(" ".join(lines).split()):])
    if rest:
        last = lines[-1]
        while last and draw.textlength(last + " …", font=fnt) > max_width:
            last = last[:-1]
        lines[-1] = (last + " …").strip()
    return [ln for ln in lines if ln][:max_lines]


def card(project):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Accent ring peeking from the bottom-right + thin top rule.
    d.ellipse([W - 260, H - 260, W + 160, H + 160], outline=ACCENT + (), width=10)
    d.ellipse([W - 190, H - 190, W + 90, H + 90], outline=(90, 42, 40), width=3)
    d.rectangle([80, 64, 144, 72], fill=ACCENT)

    eyebrow = str(project.get("category") or project.get("status") or "Project").upper()
    f_eye = font(34)
    draw_spaced(d, (80, 104), eyebrow[:28], f_eye, ACCENT, tracking=6)

    f_title = font(88)
    for i, line in enumerate(wrap_title(d, project.get("title") or "Project", f_title, W - 240)):
        d.text((76, 168 + i * 100), line, font=f_title, fill=TEXT)

    # Footer lockup: logo + name + site.
    try:
        logo = Image.open(LOGO).convert("RGBA").resize((104, 104))
        img.paste(logo, (80, H - 184), logo)
    except OSError:
        pass
    f_name, f_site = font(40), font(32, bold=False)
    d.text((208, H - 168), "Aayush Neupane", font=f_name, fill=TEXT)
    d.text((208, H - 112), "aayushnp.netlify.app", font=f_site, fill=MUTED)
    return img


def main():
    items = [
        *(DATA.get("featured") or []),
        *(DATA.get("archive") or []),
    ]
    n = 0
    for p in items:
        out = OUT_DIR / f"{safe_id(p.get('id'))}.png"
        card(p).save(out)
        n += 1
    print(f"wrote {n} cards -> {OUT_DIR}")


if __name__ == "__main__":
    main()
