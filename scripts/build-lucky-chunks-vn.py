"""Bổ sung đủ chữ tiếng Việt cho Lucky Chunks bằng glyph ghép (composite).
Vẽ thêm 3 dấu còn thiếu (hỏi, nặng, móc ơ/ư); vị trí dấu đo theo các chữ có dấu sẵn trong font.
usage: build_vn.py <in.ttf> <out.ttf> <out.woff2>"""
import sys, math, unicodedata
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.boundsPen import BoundsPen

src, out_ttf, out_woff2 = sys.argv[1:4]
f = TTFont(src)
glyf, hmtx = f['glyf'], f['hmtx']
cmap = f.getBestCmap()
gs = f.getGlyphSet()
order = list(f.getGlyphOrder())


def bounds(name):
    p = BoundsPen(gs)
    gs[name].draw(p)
    return p.bounds  # xMin, yMin, xMax, yMax


def stroke_path(pts, w):
    """Nét dày w chạy theo polyline pts → một contour kín (đầu nét bo tròn)."""
    left, right = [], []
    for i, (x, y) in enumerate(pts):
        a = pts[max(i - 1, 0)]; b = pts[min(i + 1, len(pts) - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; n = math.hypot(dx, dy) or 1
        nx, ny = -dy / n * w / 2, dx / n * w / 2
        left.append((x + nx, y + ny)); right.append((x - nx, y - ny))
    cap = lambda c, d, sgn: [(c[0] + w / 2 * math.cos(t), c[1] + w / 2 * math.sin(t))
                             for t in [d + sgn * k * math.pi / 8 for k in range(1, 8)]]
    s, e = pts[0], pts[-1]
    da = math.atan2(pts[1][1] - s[1], pts[1][0] - s[0]); de = math.atan2(e[1] - pts[-2][1], e[0] - pts[-2][0])
    return left + cap(e, de + math.pi / 2, -1) + right[::-1] + cap(s, da - math.pi / 2, -1)


def new_glyph(name, contours, adv=0):
    pen = TTGlyphPen(None)
    for c in contours:
        pts = [(round(x), round(y)) for x, y in c]
        pen.moveTo(pts[0])
        for p in pts[1:]: pen.lineTo(p)
        pen.closePath()
    g = pen.glyph(); g.recalcBounds(glyf)
    glyf.glyphs[name] = g; hmtx.metrics[name] = (adv, g.xMin if g.numberOfContours else 0)
    order.append(name)


def arc(cx, cy, r, a0, a1, n=14):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * k / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * k / n))) for k in range(n + 1)]


# Độ dày nét lấy theo dấu sắc của font
ac = bounds('acute'); W = 84
# Dấu hỏi: móc cong mở về bên trái, chân thẳng xuống
hook = arc(0, 95, 66, 165, -75) + [(18, 0)]
new_glyph('hookabovecomb', [stroke_path(hook, W)])
# Dấu nặng: chấm tròn
dot_r = 56
new_glyph('dotbelowcomb', [[(dot_r * math.cos(t * math.pi / 12), dot_r * math.sin(t * math.pi / 12)) for t in range(24)]])
# Móc của ơ/ư: nét cong vươn lên bên phải
horn = arc(-10, 0, 95, 215, 330)[4:] + [(78, -30)]
horn = [(x, y) for x, y in arc(0, 0, 105, 235, 360)] + [(108, 95)]
new_glyph('horncomb', [stroke_path(horn, W)])

for n in ('hookabovecomb', 'dotbelowcomb', 'horncomb'):
    gs = f.getGlyphSet()

# Khoảng hở giữa chữ và dấu, đo từ á / Á có sẵn
def gap(base, accented):
    return bounds(accented)[3] - (ac[3] - ac[1]) - bounds(base)[3]
gap_lc, gap_uc = gap('a', 'aacute'), gap('A', 'Aacute')

mark_of = {'̀': 'gravecomb' if 'gravecomb' in order else 'grave', '́': 'acute',
           '̃': 'tildecomb', '̉': 'hookabovecomb'}


def comp(name, x=0, y=0, scale=None):
    c = GlyphComponent(); c.glyphName = name; c.x = round(x); c.y = round(y); c.flags = 0
    if scale: c.transform = [[scale, 0], [0, scale]]
    return c


def place_above(mark, cx, top, g, scale=1.0):
    b = bounds(mark); w = (b[2] - b[0]) * scale
    return comp(mark, cx - b[0] * scale - w / 2, top + g - b[1] * scale, scale if scale != 1 else None)


def composite(name, comps, adv):
    g = Glyph(); g.numberOfContours = -1; g.components = comps
    glyf.glyphs[name] = g; g.recalcBounds(glyf); hmtx.metrics[name] = (adv, g.xMin); order.append(name)
    f.setGlyphOrder(order)


def body_bounds(name):
    return bounds(name)


f.setGlyphOrder(order)

# 1) Ơ ơ Ư ư
for ch, base in (('Ơ', 'O'), ('ơ', 'o'), ('Ư', 'U'), ('ư', 'u')):
    b = bounds(base); h = bounds('horncomb')
    up = ch.isupper()
    x = b[2] - (h[2] - h[0]) * 0.62 - h[0]
    y = b[3] - (h[3] - h[1]) * (0.62 if up else 0.7) - h[1]
    name = {'Ơ': 'Ohorn', 'ơ': 'ohorn', 'Ư': 'Uhorn', 'ư': 'uhorn'}[ch]
    composite(name, [comp(base), comp('horncomb', x, y)], hmtx[base][0] + 40)
    cmap[ord(ch)] = name
gs = f.getGlyphSet()

# 2) mọi chữ tiếng Việt còn thiếu
VN = 'ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ'
VN += VN.lower()
made = 0
for ch in VN:
    if ord(ch) in cmap: continue
    d = unicodedata.normalize('NFD', ch)
    base, marks = d[0], set(d[1:])
    up = base.isupper()
    g_gap = gap_uc if up else gap_lc
    mod = next((m for m in ('̂', '̆', '̛') if m in marks), None)
    tone = next((m for m in ('̀', '́', '̃', '̉') if m in marks), None)
    below = '̣' in marks
    plain = base if not (base == 'i' and tone) else 'dotlessi'
    start = cmap[ord(unicodedata.normalize('NFC', base + mod))] if mod else cmap[ord(plain)] if plain != 'dotlessi' else 'dotlessi'
    comps = [comp(start)]
    bb = bounds(cmap[ord(base)] if base != 'i' or not tone else 'dotlessi')
    cx = (bb[0] + bb[2]) / 2
    sb = bounds(start)
    if tone:
        mark = mark_of[tone]
        if mod == '̂' and tone != '̃':
            # mũ + dấu: dấu đặt lệch phải, ngang đỉnh mũ (kiểu chữ Việt)
            m = bounds(mark); s = 0.78
            comps.append(comp(mark, sb[2] - 110 - m[0] * s, sb[3] - (m[3] - m[1]) * s * 0.8 - m[1] * s, s))
        elif mod in ('̂', '̆'):
            comps.append(place_above(mark, cx, sb[3], 10, 0.8))  # chồng lên mũ/trăng
        else:
            comps.append(place_above(mark, cx, bb[3], g_gap))
    if below:
        dbx = cx + ((bb[2] - bb[0]) * 0.28 if base in 'y' else 0)
        dbb = bounds('dotbelowcomb')
        dy = (bb[1] if base == 'y' else 0) - 40 - dbb[3]
        if base == 'y': dy = -40 - dbb[3]
        comps.append(comp('dotbelowcomb', dbx - (dbb[0] + dbb[2]) / 2, dy))
    name = 'uni%04X' % ord(ch)
    composite(name, comps, hmtx[start][0])
    cmap[ord(ch)] = name; made += 1
    gs = f.getGlyphSet()

for t in f['cmap'].tables:
    if t.isUnicode():
        for cp, n in cmap.items():
            if cp <= 0xFFFF or t.format == 12: t.cmap[cp] = n
f.save(out_ttf)
f.flavor = 'woff2'; f.save(out_woff2)
miss = [c for c in VN if ord(c) not in TTFont(out_ttf).getBestCmap()]
print('built', made, 'missing after:', ''.join(miss) or 'none')
