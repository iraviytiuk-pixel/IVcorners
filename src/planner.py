"""
IV Corners — floor plan renderer.

Takes a room (polygon in inches + openings) and a furniture list,
emits an SVG. No AI anywhere in this file: the geometry is exact by
construction, so walls always meet and dimensions always add up.
"""
from dataclasses import dataclass, field
from typing import List, Tuple

# ---------- palette (matches the landing page) ----------
INK      = "#4A3B30"
CRIMSON  = "#9B1A1A"
PARCH    = "#FBF7F1"
HAIR     = "rgba(155,26,26,.55)"
FAINT    = "rgba(155,26,26,.30)"

WALL   = 3.6     # wall thickness, inches
PX     = 4.0     # px per inch
MARGIN = 88      # px, room for dimension strings


def ft(inches: float) -> str:
    f, i = divmod(round(inches), 12)
    return f"{f}'-{i}\""


@dataclass
class Opening:
    wall: int            # index of wall segment
    at: float            # inches from wall start
    width: float
    kind: str = "door"   # door | window | cased
    hinge: str = "left"  # left | right
    inward: bool = True


@dataclass
class Item:
    kind: str
    x: float             # centre, inches
    y: float
    w: float             # width along local x
    d: float             # depth along local y
    rot: float = 0.0     # degrees, clockwise
    label: str = ""


@dataclass
class Room:
    name: str
    outline: List[Tuple[float, float]]
    openings: List[Opening] = field(default_factory=list)
    items: List[Item] = field(default_factory=list)

    def bounds(self):
        xs = [p[0] for p in self.outline]
        ys = [p[1] for p in self.outline]
        return min(xs), min(ys), max(xs), max(ys)

    def area_sqft(self):
        pts, s = self.outline, 0.0
        for i in range(len(pts)):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % len(pts)]
            s += x1 * y2 - x2 * y1
        return abs(s) / 2 / 144


# ================= furniture symbols =================
# each drawn centred on (0,0), width w on x, depth d on y

def _r(x, y, w, h, rx=0, extra=""):
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'rx="{rx}" {extra}/>')


def sym_sofa(w, d):
    s, arm, back = [], 5.5, 8.0
    s.append(_r(-w/2, -d/2, w, d, 3))
    s.append(_r(-w/2 + 1.2, -d/2 + 1.2, w - 2.4, back, 2))          # back
    s.append(_r(-w/2 + 1.2, -d/2 + 1.2, arm, d - 2.4, 2))           # arm L
    s.append(_r(w/2 - arm - 1.2, -d/2 + 1.2, arm, d - 2.4, 2))      # arm R
    inner = w - 2 * arm - 2.4
    n = 3 if w > 70 else 2
    cw = (inner - (n - 1) * 1.5) / n
    for i in range(n):
        cx = -w/2 + arm + 1.2 + i * (cw + 1.5)
        s.append(_r(cx, -d/2 + back + 2.2, cw, d - back - 5, 2))
    return "".join(s)


def sym_chair(w, d):
    s = [_r(-w/2, -d/2, w, d, 3)]
    s.append(_r(-w/2 + 1.2, -d/2 + 1.2, w - 2.4, 6.5, 2))
    s.append(_r(-w/2 + 1.2, -d/2 + 8, 4.5, d - 9.5, 2))
    s.append(_r(w/2 - 5.7, -d/2 + 8, 4.5, d - 9.5, 2))
    s.append(_r(-w/2 + 6.5, -d/2 + 9, w - 13, d - 11, 2))
    return "".join(s)


def sym_dining_chair(w, d):
    s = [_r(-w/2, -d/2, w, d, 2)]
    s.append(_r(-w/2, -d/2, w, 2.4, 1))
    return "".join(s)


def sym_table(w, d, oval=False):
    if oval:
        return (f'<ellipse cx="0" cy="0" rx="{w/2:.1f}" ry="{d/2:.1f}"/>'
                f'<ellipse cx="0" cy="0" rx="{w/2-3:.1f}" ry="{d/2-3:.1f}" opacity=".45"/>')
    return _r(-w/2, -d/2, w, d, 2) + _r(-w/2 + 3, -d/2 + 3, w - 6, d - 6, 1, 'opacity=".45"')


def sym_round(w, d):
    r = min(w, d) / 2
    return (f'<circle cx="0" cy="0" r="{r:.1f}"/>'
            f'<circle cx="0" cy="0" r="{r*0.55:.1f}" opacity=".45"/>')


def sym_bed(w, d):
    s = [_r(-w/2, -d/2, w, d, 3)]
    s.append(f'<line x1="{-w/2:.1f}" y1="{-d/2+22:.1f}" x2="{w/2:.1f}" y2="{-d/2+22:.1f}"/>')
    pw = (w - 7) / 2
    s.append(_r(-w/2 + 2.5, -d/2 + 3, pw, 15, 3))
    s.append(_r(2, -d/2 + 3, pw, 15, 3))
    s.append(_r(-w/2, d/2 - 20, w, 16, 1, 'opacity=".5"'))          # throw
    return "".join(s)


def sym_nightstand(w, d):
    return _r(-w/2, -d/2, w, d, 1) + '<circle cx="0" cy="0" r="4.5" opacity=".6"/>'


def sym_console(w, d):
    return (_r(-w/2, -d/2, w, d, 1) +
            f'<line x1="{-w/2:.1f}" y1="0" x2="{w/2:.1f}" y2="0" opacity=".45"/>')


def sym_media(w, d):
    s = [_r(-w/2, -d/2, w, d, 1)]
    for i in (1, 2):
        x = -w/2 + w * i / 3
        s.append(f'<line x1="{x:.1f}" y1="{-d/2:.1f}" x2="{x:.1f}" y2="{d/2:.1f}" opacity=".45"/>')
    return "".join(s)


def sym_plant(w, d):
    r = min(w, d) / 2
    s = [f'<circle cx="0" cy="0" r="{r:.1f}" opacity=".5"/>']
    import math
    for i in range(7):
        a = i * 2 * math.pi / 7
        s.append(f'<circle cx="{math.cos(a)*r*0.52:.1f}" cy="{math.sin(a)*r*0.52:.1f}" '
                 f'r="{r*0.36:.1f}" opacity=".45"/>')
    return "".join(s)


def sym_lamp(w, d):
    r = min(w, d) / 2
    return (f'<circle cx="0" cy="0" r="{r:.1f}" opacity=".55"/>'
            f'<circle cx="0" cy="0" r="{r*0.3:.1f}"/>')


def sym_rug(w, d):
    s = [_r(-w/2, -d/2, w, d, 1, 'stroke-dasharray="7 5" opacity=".65"')]
    step = 14
    x = -w/2 + step
    while x < w/2:
        y0 = -d/2
        x0 = x
        L = min(x - (-w/2), d)
        s.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x0-L:.1f}" y2="{y0+L:.1f}" opacity=".16"/>')
        x += step
    return "".join(s)


SYMBOLS = {
    "sofa": sym_sofa, "chair": sym_chair, "dining_chair": sym_dining_chair,
    "table": sym_table, "round": sym_round, "bed": sym_bed,
    "nightstand": sym_nightstand, "console": sym_console, "media": sym_media,
    "plant": sym_plant, "lamp": sym_lamp, "rug": sym_rug,
}


# ================= walls & openings =================
import math


def _seg(room):
    p = room.outline
    return [(p[i], p[(i + 1) % len(p)]) for i in range(len(p))]


def _inside(room, x, y):
    """Point in polygon (ray cast)."""
    p, c = room.outline, False
    n = len(p)
    for i in range(n):
        x1, y1 = p[i]; x2, y2 = p[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xin = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < xin:
                c = not c
    return c


def _basis(room, wi):
    """Unit vector along wall, plus the normal that points INTO the room."""
    (ax, ay), (bx, by) = _seg(room)[wi]
    L = math.hypot(bx - ax, by - ay)
    ux, uy = (bx - ax) / L, (by - ay) / L
    nx, ny = -uy, ux
    mx, my = (ax + bx) / 2, (ay + by) / 2
    if not _inside(room, mx + nx * 2, my + ny * 2):
        nx, ny = -nx, -ny
    return (ax, ay), (ux, uy), (nx, ny), L


def render_walls(room):
    """Walls centred on the outline, cut at every opening, corners patched."""
    out = []
    for wi in range(len(room.outline)):
        (ax, ay), (ux, uy), _, L = _basis(room, wi)
        cuts = sorted((o.at, o.at + o.width) for o in room.openings if o.wall == wi)
        spans, cur = [], 0.0
        for s, e in cuts:
            if s > cur:
                spans.append((cur, s))
            cur = max(cur, e)
        if cur < L:
            spans.append((cur, L))
        for s, e in spans:
            out.append(f'<line x1="{ax+ux*s:.1f}" y1="{ay+uy*s:.1f}" '
                       f'x2="{ax+ux*e:.1f}" y2="{ay+uy*e:.1f}" '
                       f'stroke="{CRIMSON}" stroke-width="{WALL}" stroke-linecap="butt"/>')
    for (vx, vy) in room.outline:          # mitre patches
        out.append(f'<rect x="{vx-WALL/2:.1f}" y="{vy-WALL/2:.1f}" '
                   f'width="{WALL}" height="{WALL}" fill="{CRIMSON}"/>')
    return "".join(out)


def render_openings(room):
    out = []
    for o in room.openings:
        (ax, ay), (ux, uy), (nx, ny), _ = _basis(room, o.wall)
        sx, sy = ax + ux * o.at, ay + uy * o.at
        ex, ey = ax + ux * (o.at + o.width), ay + uy * (o.at + o.width)

        if o.kind == "window":
            for t, w in ((-WALL/2, 0.7), (0.0, 1.3), (WALL/2, 0.7)):
                out.append(f'<line x1="{sx+nx*t:.1f}" y1="{sy+ny*t:.1f}" '
                           f'x2="{ex+nx*t:.1f}" y2="{ey+ny*t:.1f}" '
                           f'stroke="{CRIMSON}" stroke-width="{w}" opacity=".9"/>')
            continue
        if o.kind == "cased":
            for px, py in ((sx, sy), (ex, ey)):
                out.append(f'<line x1="{px-nx*WALL/2:.1f}" y1="{py-ny*WALL/2:.1f}" '
                           f'x2="{px+nx*WALL/2:.1f}" y2="{py+ny*WALL/2:.1f}" '
                           f'stroke="{CRIMSON}" stroke-width="1.0" opacity=".7"/>')
            continue

        hx, hy = (sx, sy) if o.hinge == "left" else (ex, ey)
        sgn = 1 if o.hinge == "left" else -1
        lx, ly = hx + nx * o.width, hy + ny * o.width          # leaf, swung in
        tx, ty = hx + ux * sgn * o.width, hy + uy * sgn * o.width
        cross = ux * ny - uy * nx
        sweep = 0 if (cross * sgn) > 0 else 1
        out.append(f'<line x1="{hx:.1f}" y1="{hy:.1f}" x2="{lx:.1f}" y2="{ly:.1f}" '
                   f'stroke="{CRIMSON}" stroke-width="1.4"/>')
        out.append(f'<path d="M {lx:.1f} {ly:.1f} A {o.width:.1f} {o.width:.1f} 0 0 {sweep} '
                   f'{tx:.1f} {ty:.1f}" fill="none" stroke="{CRIMSON}" stroke-width="0.7" '
                   f'stroke-dasharray="4 4" opacity=".5"/>')
    return "".join(out)


# ================= main =================

def render(room, scale=PX):
    x0, y0, x1, y1 = room.bounds()
    W = (x1 - x0) * scale + MARGIN * 2
    H = (y1 - y0) * scale + MARGIN * 2
    def PXx(v): return MARGIN + (v - x0) * scale
    def PXy(v): return MARGIN + (v - y0) * scale

    g = [f'<g transform="translate({MARGIN - x0*scale:.1f},{MARGIN - y0*scale:.1f}) scale({scale})">']
    pts = " ".join(f"{p[0]},{p[1]}" for p in room.outline)
    g.append(f'<polygon points="{pts}" fill="{CRIMSON}" fill-opacity=".03"/>')

    g.append(f'<g fill="none" stroke="{CRIMSON}" stroke-width="0.7" vector-effect="non-scaling-stroke">')
    for it in room.items:
        if it.kind == "rug":
            g.append(f'<g transform="translate({it.x},{it.y}) rotate({it.rot})">{sym_rug(it.w, it.d)}</g>')
    g.append("</g>")

    g.append(render_walls(room))
    g.append(render_openings(room))

    g.append(f'<g fill="none" stroke="{CRIMSON}" stroke-opacity=".62" stroke-width="0.85" '
             f'stroke-linejoin="round" vector-effect="non-scaling-stroke">')
    for it in room.items:
        if it.kind != "rug":
            fn = SYMBOLS.get(it.kind, sym_table)
            g.append(f'<g transform="translate({it.x},{it.y}) rotate({it.rot})">{fn(it.w, it.d)}</g>')
    g.append("</g>")
    g.append("</g>")

    # ---- annotation layer, unscaled ----
    a = [f'<g font-family="Jost, Helvetica, sans-serif" fill="{CRIMSON}">']
    for it in room.items:
        if it.label:
            a.append(f'<text x="{PXx(it.x):.1f}" y="{PXy(it.y)+3:.1f}" text-anchor="middle" '
                     f'font-size="8.5" letter-spacing="1.6" opacity=".75">{it.label}</text>')
    cx = PXx((x0 + x1) / 2)
    a.append(f'<text x="{cx:.1f}" y="{MARGIN-34:.1f}" text-anchor="middle" font-size="17" '
             f'letter-spacing="6">{room.name}</text>')
    a.append(f'<text x="{cx:.1f}" y="{MARGIN-18:.1f}" text-anchor="middle" font-size="9.5" '
             f'letter-spacing="2.4" opacity=".6">'
             f'{ft(x1-x0)} &#215; {ft(y1-y0)} &#183; {room.area_sqft():.0f} SQ FT</text>')

    off, bx0, bx1 = 40, PXx(x0), PXx(x1)
    by0, by1 = PXy(y0), PXy(y1)
    a.append(f'<g stroke="{CRIMSON}" stroke-width="1" opacity=".45" fill="none">')
    a.append(f'<line x1="{bx0}" y1="{by1+off}" x2="{bx1}" y2="{by1+off}"/>')
    a.append(f'<line x1="{bx0}" y1="{by1+off-5}" x2="{bx0}" y2="{by1+off+5}"/>')
    a.append(f'<line x1="{bx1}" y1="{by1+off-5}" x2="{bx1}" y2="{by1+off+5}"/>')
    a.append(f'<line x1="{bx0-off}" y1="{by0}" x2="{bx0-off}" y2="{by1}"/>')
    a.append(f'<line x1="{bx0-off-5}" y1="{by0}" x2="{bx0-off+5}" y2="{by0}"/>')
    a.append(f'<line x1="{bx0-off-5}" y1="{by1}" x2="{bx0-off+5}" y2="{by1}"/>')
    a.append("</g>")
    a.append(f'<text x="{(bx0+bx1)/2:.1f}" y="{by1+off-7:.1f}" text-anchor="middle" '
             f'font-size="10.5" letter-spacing="1.6" opacity=".8">{ft(x1-x0)}</text>')
    my = (by0 + by1) / 2
    a.append(f'<text x="{bx0-off-7:.1f}" y="{my:.1f}" text-anchor="middle" font-size="10.5" '
             f'letter-spacing="1.6" opacity=".8" '
             f'transform="rotate(-90 {bx0-off-7:.1f} {my:.1f})">{ft(y1-y0)}</text>')
    a.append(f'<text x="{bx0:.1f}" y="{H-22:.1f}" font-size="8" letter-spacing="2.2" '
             f'opacity=".5">SCALE 1/4&#8243; = 1&#8242;-0&#8243;</text>')
    a.append("</g>")

    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{H:.0f}" '
            f'viewBox="0 0 {W:.0f} {H:.0f}"><rect width="100%" height="100%" fill="{PARCH}"/>'
            + "".join(g) + "".join(a) + "</svg>")
