"""
Build the delivered webfonts from the upstream files (register V47, 29 September 2026).

    python scripts/fonts/build-webfonts.py <upstream-dir> <out-dir>

<upstream-dir> holds the upstream Google Fonts subsets:
    archivo-latin.woff2, archivo-latin-ext.woff2, archivo-vietnamese.woff2, plex-mono-latin.woff2
(recoverable from git history before this script landed).

Needs fontTools and brotli (`pip install fonttools brotli`). A one-off build tool, deliberately NOT
a project dependency: fonts change rarely, and the outputs are committed.

WHAT IT DOES, and why each step is lossless where it matters:

1. Archivo: drop the condensed half of the width axis (62-100%). Nothing on the site sets a width
   below 100%, and removing one side of an axis rescales nothing, so advance widths are unchanged
   and every weight/width the site uses renders pixel-identically (measured). Cutting the weight
   axis too saved 7 KB more but moved spacing by a unit, so it is not done.

2. Latin faces (Archivo and Plex Mono): split into CORE (preloaded) and REST (fetched only when a
   page uses one of its characters, through unicode-range; the same mechanism the latin-ext and
   vietnamese faces already use). Subsetting only removes glyphs; kept glyphs, metrics and OpenType
   features are untouched. CORE: ASCII, the Latin-1 symbols without the accented letters, general
   punctuation, the euro and trade mark. The site's text uses 92 distinct characters, all in CORE.

Every run checks that CORE + REST cover exactly the original characters, without overlap.

A font revision ships under a NEW filename: /fonts is served `immutable` (next.config.mjs).
Output is deterministic (no timestamp rewrite): two runs produce byte-identical files.
"""

import io
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

CORE = (
    set(range(0x20, 0x7F))
    | set(range(0xA0, 0xC0))
    | {0xD7, 0xF7}
    | set(range(0x2000, 0x2070))
    | {0x20AC, 0x2122}
)


def save(font, path):
    font.flavor = 'woff2'
    font.save(path)
    return os.path.getsize(path)


def cut_width(src):
    # Serialised and reloaded before anything else touches it: subsetting the in-memory result of
    # the instancer directly fails on a lazily loaded glyph lookup (KeyError), and the reload is
    # also what makes the output identical to cutting to a file first.
    font = instancer.instantiateVariableFont(TTFont(src, recalcTimestamp=False), {'wdth': (100, 125)})
    font.flavor = 'woff2'
    buf = io.BytesIO()
    font.save(buf)
    buf.seek(0)
    return TTFont(buf, recalcTimestamp=False)


def subset_font(font, unicodes):
    opts = subset.Options()
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.name_languages = ['*']
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=sorted(unicodes))
    s.subset(font)
    return font


def split(load, have, core_path, rest_path, label):
    core = subset_font(load(), have & CORE)
    rest = subset_font(load(), have - CORE)
    c_size, r_size = save(core, core_path), save(rest, rest_path)
    cc, rc = set(TTFont(core_path).getBestCmap()), set(TTFont(rest_path).getBestCmap())
    if cc | rc != have or cc & rc:
        sys.exit(f'{label}: core + rest do not cover the original characters exactly')
    print(f'{label}: core {c_size} bytes ({len(cc)} chars) + rest {r_size} bytes ({len(rc)} chars)')


def main(src_dir, out_dir):
    src = lambda name: os.path.join(src_dir, name)
    out = lambda name: os.path.join(out_dir, name)

    # Archivo latin: width cut, then core/rest split.
    latin = src('archivo-latin.woff2')
    have = set(TTFont(latin).getBestCmap())
    split(lambda: cut_width(latin), have, out('archivo-latin-core-v2.woff2'), out('archivo-latin-rest-v2.woff2'), 'archivo-latin')

    # Archivo latin-ext and vietnamese: width cut only (fetched only when their characters appear).
    for name in ['archivo-latin-ext', 'archivo-vietnamese']:
        size = save(cut_width(src(f'{name}.woff2')), out(f'{name}-v2.woff2'))
        print(f'{name}: {size} bytes')

    # Plex Mono latin: static weight 500, so the core/rest split only.
    mono = src('plex-mono-latin.woff2')
    split(lambda: TTFont(mono, recalcTimestamp=False), set(TTFont(mono).getBestCmap()), out('plex-mono-latin-core.woff2'), out('plex-mono-latin-rest.woff2'), 'plex-mono-latin')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
