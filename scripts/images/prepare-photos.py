"""
Prepare the site's photographs from the originals Nebsam supplies (Sprint 12n, 4 October 2026).

    python scripts/images/prepare-photos.py [--only <id> ...]

Reads  assets/photos/manifest.json   (committed: what to make, and why each photo passed review)
from   media-inbox/drive/website pictures/   (git-ignored: the originals, as Kelvin shared them)
writes assets/photos/<out>-<crop>.jpg (committed: what the site imports)

Needs Pillow (`pip install pillow`). A build tool, deliberately NOT a project dependency, like
scripts/fonts/build-webfonts.py: photographs change when Nebsam sends new ones, not on every build.

WHAT EACH ENTRY CAN SAY, applied in this order:

1. box     [x0, y0, x1, y1] as fractions of the original. A first cut, for a composite of two photos
           or to leave out something that must not ship (a mock phone screen, garbled AI lettering).
2. blur    a list of boxes, in the same fractions of the ORIGINAL, blurred until unreadable. Plates
           and faces. A blur, never a sticker: the region still reads as part of the photograph.
   heal    a list of thin horizontal boxes, same fractions. Inside each, ONLY the pixels markedly
           brighter than the pixels a few rows above and below are replaced, by their average. For
           a thin light line drawn over the picture, such as the leader line a generator drew to a
           mock phone screen the box then cuts away. Masking keeps the texture the line crosses
           (palm fronds, cloud) instead of streaking it.
   fill    a list of boxes, same fractions. Each column is repainted as a straight blend from the
           pixel just above the box to the pixel just below it. For lettering on smooth paint (a
           livery name on a bonnet): it is removed, where a blur would leave a smudge. Only where
           the edge rows above and below are the same surface, so keep each box between edges.
3. crops   name -> {"ratio": "W:H", "focus": [fx, fy]}. The largest W:H rectangle inside the box,
           centred as near the focus as the edges allow. The focus is a fraction of the BOX.
4. Longest edge capped at maxEdge (default 2400). Nothing is ever upscaled.
5. A crop may carry `path` (repo-relative, with filename) to write somewhere other than
   assets/photos/<out>-<crop>.jpg. Social-share images use it to land in public/og/, at a stable
   URL a crawler can fetch, at exactly the 1200x630 they are cut to (ratio 40:21, maxEdge 1200).
6. A crop may carry `stamp`: {"file": <repo-relative PNG>, "width": px, "margin": px}, pasted at
   the bottom-left with its own transparency. The site share image carries the logo plaque this
   way: scaled, never redrawn or recoloured (CLAUDE.md §6).

Every output is sRGB JPEG, quality 85, progressive, with NO metadata: EXIF, GPS and any embedded
provenance are dropped, because a phone photo's EXIF can carry the exact location of the person who
took it. next/image re-encodes to AVIF and WebP at the sizes a page asks for, so these files are
sources, not deliverables; quality 85 keeps that re-encode from compounding loss.

Deterministic: the same original and manifest give byte-identical output, so a re-run shows up in
git only when something actually changed. A revision of a photo ships under a NEW `out` name, because
next/image's optimised output is cached by URL.
"""

import io
import json
import os
import sys

from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MANIFEST = os.path.join(ROOT, 'assets', 'photos', 'manifest.json')
SOURCES = os.path.join(ROOT, 'media-inbox', 'drive', 'website pictures')
OUT_DIR = os.path.join(ROOT, 'assets', 'photos')


def frac_box(box, w, h):
    x0, y0, x1, y1 = box
    return (round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h))


def fit_ratio(w, h, ratio, focus):
    """The largest rectangle of `ratio` inside w x h, centred on `focus` as far as the edges allow."""
    rw, rh = (int(n) for n in ratio.split(':'))
    if w * rh > h * rw:  # too wide: full height
        ch, cw = h, round(h * rw / rh)
    else:  # too tall: full width
        cw, ch = w, round(w * rh / rw)
    fx, fy = focus
    x = min(max(round(fx * w - cw / 2), 0), w - cw)
    y = min(max(round(fy * h - ch / 2), 0), h - ch)
    return (x, y, x + cw, y + ch)


def blur_regions(img, boxes):
    for item in boxes:
        # A bare box, or {"box": [...], "radius": px} for a large region: a screen or a panel needs
        # only enough blur to make its text unreadable. The scaled default flattens a large region
        # into a featureless block that reads as a sticker.
        box, fixed = (item['box'], item.get('radius')) if isinstance(item, dict) else (item, None)
        region = frac_box(box, *img.size)
        patch = img.crop(region)
        # Radius scales with the patch, so a large plate is as unreadable as a small one, but
        # stays below a third of it: heavier, and the patch flattens into a grey square that reads
        # as a sticker rather than as part of the photograph.
        radius = fixed or max(3, min(patch.size) // 5)
        img.paste(patch.filter(ImageFilter.GaussianBlur(radius)), region[:2])
    return img


def heal_regions(img, boxes, reach=6, threshold=9):
    px = img.load()
    lum = lambda p: 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
    for box in boxes:
        x0, y0, x1, y1 = frac_box(box, *img.size)
        # Decide every pixel against the ORIGINAL neighbours before writing any, then grow the mask
        # by one pixel so the line's anti-aliased edge goes with it.
        mask = set()
        for x in range(x0, x1):
            for y in range(y0, y1):
                if lum(px[x, y]) - max(lum(px[x, y - reach]), lum(px[x, y + reach])) > threshold:
                    mask.update((x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1))
        fills = {}
        for x, y in mask:
            a, b = px[x, y - reach], px[x, y + reach]
            fills[(x, y)] = tuple((a[i] + b[i]) // 2 for i in range(3))
        for xy, value in fills.items():
            px[xy] = value
    return img


def fill_regions(img, boxes, feather=10):
    px = img.load()
    w = img.size[0]
    for box in boxes:
        x0, y0, x1, y1 = frac_box(box, *img.size)
        # The repaint runs `feather` px past each side and fades out there, over the clean paint
        # beside the lettering: a hard side edge shows as a seam wherever the paint has a gradient.
        for x in range(max(0, x0 - feather), min(w, x1 + feather)):
            weight = min(1, (x - (x0 - feather)) / feather, ((x1 + feather) - x) / feather)
            # The edge pixels, averaged across seven columns: with fewer, a highlight on the edge
            # row (a bonnet crease) streaks straight down the repaint.
            cols = [c for c in range(x - 3, x + 4) if 0 <= c < w]
            above = [sum(px[c, y0 - 1][i] for c in cols) / len(cols) for i in range(3)]
            below = [sum(px[c, y1][i] for c in cols) / len(cols) for i in range(3)]
            for y in range(y0, y1):
                t = (y - y0 + 1) / (y1 - y0 + 1)
                old = px[x, y]
                new = [above[i] + (below[i] - above[i]) * t for i in range(3)]
                px[x, y] = tuple(round(old[i] + (new[i] - old[i]) * weight) for i in range(3))
    return img


def load(src):
    img = Image.open(os.path.join(SOURCES, src))
    img = ImageOps.exif_transpose(img)  # honour camera rotation BEFORE the metadata is dropped
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGBA')
        flat = Image.new('RGB', img.size, (255, 255, 255))  # product shots sit on white
        flat.paste(img, mask=img.split()[-1])
        return flat
    return img.convert('RGB')


def build(entry):
    img = load(entry['src'])
    img = blur_regions(img, entry.get('blur', []))
    img = heal_regions(img, entry.get('heal', []))
    img = fill_regions(img, entry.get('fill', []))
    if 'box' in entry:
        img = img.crop(frac_box(entry['box'], *img.size))
    written = []
    for name, spec in entry['crops'].items():
        out = img.crop(fit_ratio(*img.size, spec['ratio'], spec.get('focus', [0.5, 0.5])))
        edge = spec.get('maxEdge', entry.get('maxEdge', 2400))
        if max(out.size) > edge:
            scale = edge / max(out.size)
            out = out.resize((round(out.width * scale), round(out.height * scale)), Image.LANCZOS)
        if 'stamp' in spec:
            st = spec['stamp']
            mark = Image.open(os.path.join(ROOT, st['file'])).convert('RGBA')
            mark = mark.resize((st['width'], round(mark.height * st['width'] / mark.width)), Image.LANCZOS)
            margin = st.get('margin', 40)
            out.paste(mark, (margin, out.height - mark.height - margin), mark)
        path = os.path.join(ROOT, spec['path']) if 'path' in spec else os.path.join(OUT_DIR, f"{entry['out']}-{name}.jpg")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        buf = io.BytesIO()
        out.save(buf, 'JPEG', quality=85, progressive=True, optimize=True)
        with open(path, 'wb') as f:
            f.write(buf.getvalue())
        written.append((os.path.relpath(path, ROOT), out.size, len(buf.getvalue()) // 1024))
    return written


def main(argv):
    only = set(argv[argv.index('--only') + 1:]) if '--only' in argv else None
    with open(MANIFEST, encoding='utf-8') as f:
        manifest = json.load(f)
    for entry in manifest['photos']:
        if only and entry['id'] not in only:
            continue
        for path, size, kb in build(entry):
            print(f'  {path:<64} {size[0]}x{size[1]:<5} {kb:>4} KB')


if __name__ == '__main__':
    main(sys.argv[1:])
