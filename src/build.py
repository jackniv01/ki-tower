#!/usr/bin/env python3
"""Build Ki Tower: joins src/game parts into index.html at the repo root.
Usage:  python3 src/build.py            -> builds index.html and bumps the service-worker cache
        python3 src/build.py --test DIR -> builds a test copy in DIR/index.html (scores NOT saved)
"""
import re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'src', 'game')
PARTS = ['a_head.html', 'b_core.js', 'c_world.js', 'd_hero.js', 'd3_sprites.js', 'e_rest.js']
s = ''.join(open(os.path.join(G, p), encoding='utf-8').read() for p in PARTS)
s = re.sub(r"window\.__kt=\{.*?\};\n", "", s, flags=re.S)  # strip test hook
if '--test' in sys.argv:
    d = sys.argv[sys.argv.index('--test') + 1]
    s = s.replace("function pushShared(entry){", "function pushShared(entry){return;", 1)
    s = re.sub(r"if\('serviceWorker' in navigator.*?\n", "", s)
    s = s.replace('href="manifest.webmanifest"', 'href="../manifest.webmanifest"').replace('href="icon-', 'href="../icon-')
    s = s.replace('<p class="sub">Jump higher. Flip. Chain combos. Power up.</p>',
                  '<p class="sub" style="color:#7dff9a">TEST VERSION – scores are not saved</p>', 1)
    os.makedirs(os.path.join(ROOT, d), exist_ok=True)
    open(os.path.join(ROOT, d, 'index.html'), 'w', encoding='utf-8').write(s)
    print('test build ->', d)
else:
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(s)
    sw = os.path.join(ROOT, 'sw.js'); w = open(sw).read()
    w = re.sub(r"ki-tower-v(\d+)", lambda m: 'ki-tower-v%d' % (int(m.group(1)) + 1), w)
    open(sw, 'w').write(w)
    print('built index.html,', re.search(r"ki-tower-v\d+", w).group(0))
