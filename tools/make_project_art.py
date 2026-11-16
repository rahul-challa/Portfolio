"""Generate on-brand SVG illustrations for the featured projects.

Run from the repo root; writes assets/images/projects/*.svg (1200x900, 4:3).
"""
import math
import os
import random

OUT = 'assets/images/projects'
os.makedirs(OUT, exist_ok=True)

BG = '#0f0f13'
PANEL = '#16161c'
PANEL2 = '#1d1e25'
LINE = '#2a2b33'
CLAY = '#d97757'
CLAY_DEEP = '#c4633f'
CLAY_DIM = '#5a3326'
CLAY_MID = '#8a4a33'
WHITE = '#f5f5f7'
TEXT = '#a3a6b3'
MUTED = '#686b78'
SANS = "Geist, Inter, 'Segoe UI', Helvetica, Arial, sans-serif"
MONO = "'Geist Mono', ui-monospace, Menlo, Consolas, monospace"
W, H = 1200, 900


def svg(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'<rect width="{W}" height="{H}" fill="{BG}"/>{body}</svg>\n')


def text(x, y, s, size=20, fill=TEXT, family=MONO, weight=500, anchor='start', extra=''):
    s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>')


def chip(x, y, label, fill=PANEL2, color=TEXT, stroke=LINE):
    w = 22 + len(label) * 11.5
    return (f'<rect x="{x}" y="{y}" width="{w}" height="40" rx="20" fill="{fill}" stroke="{stroke}"/>'
            + text(x + w / 2, y + 26, label, 17, color, anchor='middle')), w


def window(x, y, w, h, title):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{PANEL}" stroke="{LINE}"/>'
    out += f'<line x1="{x}" y1="{y + 52}" x2="{x + w}" y2="{y + 52}" stroke="{LINE}"/>'
    for i, c in enumerate(['#3a3b44', '#3a3b44', '#3a3b44']):
        out += f'<circle cx="{x + 28 + i * 22}" cy="{y + 26}" r="6.5" fill="{c}"/>'
    out += text(x + w / 2, y + 32, title, 16, MUTED, anchor='middle')
    return out


# ---------------------------------------------------------------- Wildfire Twin
def wildfire():
    random.seed(7)
    b = ''
    # H3-style hex grid with a fire front spreading from two ignition points
    r = 30
    hw = math.sqrt(3) * r
    fires = [(430, 380, 1.0), (700, 300, 0.75)]
    for row in range(-1, 15):
        for col in range(-1, 16):
            cx = col * hw + (hw / 2 if row % 2 else 0) + 40
            cy = row * r * 1.5 + 60
            heat = 0
            for fx, fy, k in fires:
                d = math.hypot(cx - fx, cy - fy)
                heat = max(heat, k * math.exp(-(d / 210) ** 2))
            heat += random.uniform(-0.06, 0.06)
            if heat > 0.82:
                fill = CLAY
            elif heat > 0.6:
                fill = CLAY_DEEP
            elif heat > 0.4:
                fill = CLAY_MID
            elif heat > 0.22:
                fill = CLAY_DIM
            else:
                fill = PANEL
            pts = ' '.join(f'{cx + r * math.cos(math.radians(60 * i - 30)):.1f},{cy + r * math.sin(math.radians(60 * i - 30)):.1f}'
                           for i in range(6))
            b += f'<polygon points="{pts}" fill="{fill}" stroke="{BG}" stroke-width="3"/>'
    # building footprints sprinkled over the map
    for _ in range(140):
        x, y = random.uniform(40, 1160), random.uniform(40, 640)
        w, h = random.uniform(6, 14), random.uniform(6, 14)
        b += f'<rect x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" fill="{WHITE}" opacity="0.18"/>'
    # ignition markers
    for fx, fy, _ in fires:
        b += f'<circle cx="{fx}" cy="{fy}" r="44" fill="none" stroke="{WHITE}" stroke-opacity="0.5" stroke-dasharray="4 8"/>'
        b += f'<circle cx="{fx}" cy="{fy}" r="9" fill="{WHITE}"/>'
    # live badge
    b += f'<rect x="40" y="40" width="250" height="48" rx="24" fill="{BG}" fill-opacity="0.85" stroke="{LINE}"/>'
    b += f'<circle cx="68" cy="64" r="7" fill="{CLAY}"/>' + text(88, 70, 'LIVE · WILDFIRE TWIN', 17, WHITE)
    # bottom stats bar
    b += f'<rect x="0" y="680" width="{W}" height="220" fill="{BG}"/>'
    b += f'<line x1="40" y1="680" x2="1160" y2="680" stroke="{LINE}"/>'
    stats = [('11.5M', 'building footprints'), ('−91%', 'P95 spatial-join latency'), ('<30s', 'SLA @ 1K events')]
    for i, (v, l) in enumerate(stats):
        x = 40 + i * 380
        b += text(x, 770, v, 64, CLAY if i != 2 else WHITE, SANS, 600, extra='letter-spacing="-2"')
        b += text(x, 808, l.upper(), 16, MUTED)
    # pipeline chips
    x = 40
    for i, label in enumerate(['Kafka', 'Spark', 'Sedona', 'H3', 'DuckDB', 'Streamlit']):
        c, w = chip(x, 836, label)
        b += c
        x += w + 14
        if i < 5:
            b += text(x - 8, 862, '→', 18, CLAY_DEEP, anchor='end')
    return svg(b)


# ---------------------------------------------------------------- TexMex
def texmex():
    b = window(40, 40, 1120, 760, 'paper.tex — TexMex')
    # left: LaTeX source
    code = [
        [('\\documentclass', CLAY), ('{article}', WHITE)],
        [('\\usepackage', CLAY), ('{amsmath}', WHITE)],
        [],
        [('\\begin', CLAY), ('{document}', WHITE)],
        [('\\section', CLAY), ('{Gaussian Integral}', WHITE)],
        [('A classic result:', TEXT)],
        [('\\[', MUTED)],
        [('  \\int', CLAY), ('_0^\\infty e^{-x^2}', WHITE)],
        [('  \\,dx = ', WHITE), ('\\frac', CLAY), ('{\\sqrt{\\pi}}{2}', WHITE)],
        [('\\]', MUTED)],
        [],
        [('\\end', CLAY), ('{document}', WHITE)],
    ]
    for i, parts in enumerate(code):
        y = 140 + i * 42
        b += text(70, y, str(i + 1).rjust(2), 17, '#3a3b44')
        spans = ''.join(f'<tspan fill="{c}">' + t.replace('&', '&amp;').replace('<', '&lt;') + '</tspan>' for t, c in parts)
        b += f'<text x="120" y="{y}" font-family="{MONO}" font-size="19" font-weight="500" xml:space="preserve">{spans}</text>'
    # collaborator cursor on the empty line after the equation
    b += f'<rect x="120" y="562" width="3" height="28" fill="{CLAY}"/>'
    b += f'<rect x="120" y="530" width="64" height="26" rx="5" fill="{CLAY}"/>' + text(152, 548, 'guest', 14, BG, anchor='middle')
    # divider
    b += f'<line x1="600" y1="92" x2="600" y2="760" stroke="{LINE}"/>'
    # right: rendered page
    b += f'<rect x="640" y="110" width="480" height="610" rx="6" fill="#f3efe9"/>'
    b += text(680, 185, '1  Gaussian Integral', 30, '#1a1a1f', "Georgia, 'Times New Roman', serif", 700)
    b += text(680, 235, 'A classic result:', 22, '#33343c', "Georgia, 'Times New Roman', serif", 400)
    serif = "Georgia, 'Times New Roman', serif"
    b += text(720, 350, '∫', 96, '#1a1a1f', serif, 400)
    b += text(762, 300, '∞', 22, '#1a1a1f', serif, 400) + text(760, 372, '0', 22, '#1a1a1f', serif, 400)
    b += text(800, 345, 'e', 38, '#1a1a1f', serif, 400, extra='font-style="italic"')
    b += text(822, 320, '−x²', 22, '#1a1a1f', serif, 400, extra='font-style="italic"')
    b += text(870, 345, 'dx =', 34, '#1a1a1f', serif, 400, extra='font-style="italic"')
    b += text(1010, 322, '√π', 32, '#1a1a1f', serif, 400, anchor='middle')
    b += f'<line x1="980" y1="334" x2="1040" y2="334" stroke="#1a1a1f" stroke-width="2"/>'
    b += text(1010, 372, '2', 30, '#1a1a1f', serif, 400, anchor='middle')
    for i, w in enumerate([400, 380, 400, 260, 0, 400, 340, 390, 220]):
        if w:
            b += f'<rect x="680" y="{430 + i * 30}" width="{w}" height="10" rx="5" fill="#d9d3ca"/>'
    # status bar
    b += f'<line x1="40" y1="748" x2="1160" y2="748" stroke="{LINE}"/>'
    b += f'<circle cx="74" cy="774" r="7" fill="{CLAY}"/>' + text(92, 780, 'LIVE PREVIEW · <100 MS · 10K+ LINES', 16, TEXT)
    for i, c in enumerate([CLAY, '#5ec8ff', WHITE]):
        b += f'<circle cx="{1040 + i * 30}" cy="774" r="13" fill="{c}" stroke="{PANEL}" stroke-width="3"/>'
    b += text(1140, 780, '3', 16, MUTED, anchor='end')
    # footer stat
    b += text(40, 870, '1,200+', 44, CLAY, SANS, 600, extra='letter-spacing="-1.5"')
    b += text(200, 864, 'ACTIVE USERS · VS CODE MARKETPLACE', 16, MUTED)
    return svg(b)


# ---------------------------------------------------------------- Private Credit
def credit():
    b = window(40, 40, 560, 820, 'api — curl')
    reqs = [
        ('POST', '/auth/token', '200', CLAY),
        ('GET', '/api/facilities', '200', CLAY),
        ('POST', '/api/borrowers', '201', CLAY),
        ('PUT', '/api/covenants/42', '200', CLAY),
        ('GET', '/api/facilities/7', '200', CLAY),
        ('DELETE', '/api/borrowers/3', '401', MUTED),
    ]
    for i, (m, path, code, c) in enumerate(reqs):
        y = 150 + i * 92
        b += f'<rect x="70" y="{y - 34}" width="500" height="68" rx="12" fill="{PANEL2}"/>'
        b += text(92, y + 8, m, 17, WHITE, weight=600)
        b += text(182, y + 8, path, 17, TEXT)
        b += f'<rect x="490" y="{y - 16}" width="58" height="32" rx="16" fill="{c}" fill-opacity="{0.18 if c == MUTED else 1}"/>'
        b += text(519, y + 6, code, 16, BG if c == CLAY else TEXT, anchor='middle', weight=600)
    b += text(70, 720, 'Authorization: Bearer eyJhbGciOi…', 16, MUTED)
    b += text(70, 760, '✓ JUnit 5 + Mockito   passing', 17, WHITE)
    b += text(70, 796, '✓ Cucumber           passing', 17, WHITE)

    # right: portfolio dashboard
    b += f'<rect x="630" y="40" width="530" height="820" rx="18" fill="{PANEL}" stroke="{LINE}"/>'
    b += text(666, 104, 'PORTFOLIO · SAMPLE DATA', 16, MUTED)
    b += text(666, 182, '$412M', 76, WHITE, SANS, 600, extra='letter-spacing="-3"')
    b += text(666, 220, 'COMMITTED EXPOSURE', 15, MUTED)
    kpis = [('128', 'Facilities'), ('64', 'Borrowers'), ('3', 'Breaches')]
    for i, (v, l) in enumerate(kpis):
        x = 666 + i * 160
        b += f'<rect x="{x}" y="256" width="144" height="110" rx="14" fill="{PANEL2}"/>'
        b += text(x + 20, 312, v, 40, CLAY if i == 2 else WHITE, SANS, 600)
        b += text(x + 20, 344, l.upper(), 13, MUTED)
    b += text(666, 420, 'COVENANT HEADROOM', 15, MUTED)
    bars = [0.82, 0.64, 0.91, 0.45, 0.73, 0.28, 0.86, 0.58, 0.69, 0.38]
    for i, v in enumerate(bars):
        x = 666 + i * 46
        h = v * 300
        b += f'<rect x="{x}" y="{760 - h:.0f}" width="30" height="{h:.0f}" rx="6" fill="{CLAY if v > 0.4 else MUTED}"/>'
    b += f'<line x1="660" y1="{760 - 0.4 * 300:.0f}" x2="1130" y2="{760 - 0.4 * 300:.0f}" stroke="{WHITE}" stroke-opacity="0.5" stroke-dasharray="6 8"/>'
    b += text(1130, 420, '- - -  MIN RATIO', 14, MUTED, anchor='end')
    b += f'<line x1="660" y1="760" x2="1130" y2="760" stroke="{LINE}"/>'
    b += text(666, 812, 'SPRING BOOT · POSTGRESQL · FLYWAY', 14, MUTED)
    return svg(b)


# ---------------------------------------------------------------- Rate limiter
def ratelimiter():
    random.seed(3)
    b = ''
    b += text(40, 84, 'TOKEN BUCKET · DISTRIBUTED', 18, MUTED)
    # incoming requests (left)
    for i in range(9):
        y = 190 + i * 46
        proto = 'gRPC' if i % 3 else 'REST'
        b += text(40, y + 6, proto, 15, MUTED)
        length = random.uniform(140, 260)
        b += f'<line x1="100" y1="{y}" x2="{100 + length:.0f}" y2="{y}" stroke="{WHITE}" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round"/>'
        b += f'<circle cx="{100 + length:.0f}" cy="{y}" r="6" fill="{WHITE}"/>'
    # bucket
    bx, by, bw, bh = 430, 200, 340, 380
    b += text(bx + bw / 2, 120, 'TOKEN REFILL', 16, CLAY, anchor='middle')
    b += f'<path d="M{bx} {by} L{bx + 30} {by + bh} L{bx + bw - 30} {by + bh} L{bx + bw} {by}" fill="{PANEL}" stroke="{TEXT}" stroke-width="4" stroke-linejoin="round"/>'
    # falling tokens
    for i, yy in enumerate([150, 178]):
        b += f'<circle cx="{bx + bw / 2 + (i * 30 - 15)}" cy="{yy}" r="11" fill="{CLAY}"/>'
    # tokens inside
    for row in range(7):
        n = 9 - (row % 2)
        for k in range(n):
            cx = bx + 58 + k * 30 + (15 if row % 2 else 0) + row * 1.5
            cy = by + bh - 30 - row * 28
            if cx < bx + bw - 50 - row * 2:
                b += f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="12" fill="{CLAY if row < 5 else CLAY_DEEP}"/>'
    # outputs (right)
    outs = [('200 OK', CLAY), ('200 OK', CLAY), ('200 OK', CLAY), ('429', MUTED), ('200 OK', CLAY), ('429', MUTED)]
    for i, (label, c) in enumerate(outs):
        y = 220 + i * 62
        b += f'<line x1="790" y1="{y}" x2="980" y2="{y}" stroke="{c}" stroke-width="3" stroke-linecap="round" stroke-dasharray="{"0" if c == CLAY else "6 8"}"/>'
        b += f'<rect x="996" y="{y - 20}" width="{120 if c == CLAY else 80}" height="40" rx="20" fill="{c}" fill-opacity="{1 if c == CLAY else 0.2}"/>'
        b += text(996 + (60 if c == CLAY else 40), y + 6, label, 16, BG if c == CLAY else TEXT, anchor='middle', weight=600)
    b += text(1160, 84, 'GO · gRPC · REST', 18, MUTED, anchor='end')
    # stats row
    b += f'<line x1="40" y1="640" x2="1160" y2="640" stroke="{LINE}"/>'
    stats = [('100K+', 'requests / sec', WHITE), ('−99%', 'API abuse', CLAY), ('<1 ms', 'P99 latency', CLAY)]
    for i, (v, l, c) in enumerate(stats):
        x = 40 + i * 380
        b += text(x, 715, v, 56, c, SANS, 600, extra='letter-spacing="-2"')
        b += text(x, 750, l.upper(), 15, MUTED)
    # throughput sparkline
    pts = []
    for i in range(57):
        x = 40 + i * 20
        y = 860 - (0.55 + 0.3 * math.sin(i / 4.2) + random.uniform(-0.06, 0.06)) * 70
        pts.append(f'{x},{y:.0f}')
    b += f'<polyline points="{" ".join(pts)}" fill="none" stroke="{CLAY}" stroke-width="3" stroke-linejoin="round"/>'
    return svg(b)


for name, fn in [('wildfire-twin', wildfire), ('texmex', texmex), ('private-credit', credit), ('rate-limiter', ratelimiter)]:
    with open(f'{OUT}/{name}.svg', 'w', encoding='utf-8') as f:
        f.write(fn())
    print('wrote', f'{OUT}/{name}.svg')
