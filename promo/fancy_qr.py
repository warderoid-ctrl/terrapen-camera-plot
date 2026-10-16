"""terraDial-style 'fancy' QR as SVG — a port of terraDial/src/display/fancy_qr.cpp
(terraPen skin): paper card with a lime rim, liquid dots joined into strokes,
rounded finder rings with a coral pupil, diagonal near-black ink gradient, and a
cleared centre disc carrying a logo (ECC high pays for it)."""
import re, sys, segno

PAPER, PUPIL, RIM = "#f6f8ec", "#a8244c", "#e5f15c"
INK = ("#121212", "#2a2a2a", "#0b0b0b")
QUIET, R = 2, 0.42


def rr_path(cx, cy, hx, hy, r):
    x0, y0, x1, y1 = cx - hx, cy - hy, cx + hx, cy + hy
    return (f"M{x0+r:.3f},{y0:.3f}H{x1-r:.3f}A{r},{r} 0 0 1 {x1:.3f},{y0+r:.3f}"
            f"V{y1-r:.3f}A{r},{r} 0 0 1 {x1-r:.3f},{y1:.3f}H{x0+r:.3f}"
            f"A{r},{r} 0 0 1 {x0:.3f},{y1-r:.3f}V{y0+r:.3f}A{r},{r} 0 0 1 {x0+r:.3f},{y0:.3f}Z")


def build(url, logo_svg, side=600):
    qr = segno.make(url, error="h", micro=False, boost_error=False)
    mat = [list(map(bool, row)) for row in qr.matrix]
    n = len(mat)
    m = side / (n + 2 * QUIET)
    o = (side - n * m) / 2
    clearR = n * 0.13

    dark = lambda i, j: 0 <= i < n and 0 <= j < n and mat[j][i]
    finder = lambda i, j: (i < 7 and j < 7) or (i >= n - 7 and j < 7) or (i < 7 and j >= n - 7)
    def cleared(i, j):
        dx, dy = i + .5 - n / 2, j + .5 - n / 2
        return dx * dx + dy * dy < clearR * clearR
    ok = lambda i, j: dark(i, j) and not finder(i, j) and not cleared(i, j)

    # Runs of joined modules as round-capped strokes (width 2R): identical to
    # the firmware's dot + joining-bar union, at a fraction of the markup.
    runs = []
    for j in range(n):
        i = 0
        while i < n:
            if ok(i, j):
                k = i
                while ok(k + 1, j): k += 1
                runs.append(f"M{i+.5:g} {j+.5:g}h{k-i}")
                i = k + 1
            else:
                i += 1
    for i in range(n):
        j = 0
        while j < n:
            if ok(i, j):
                k = j
                while ok(i, k + 1): k += 1
                if k > j: runs.append(f"M{i+.5:g} {j+.5:g}v{k-j}")
                j = k + 1
            else:
                j += 1

    rings, pupils = [], []
    for fi, fj in ((0, 0), (n - 7, 0), (0, n - 7)):
        cx, cy = fi + 3.5, fj + 3.5
        rings.append(rr_path(cx, cy, 3.5, 3.5, 1.6) + rr_path(cx, cy, 2.5, 2.5, 1.1))
        pupils.append(rr_path(cx, cy, 1.5, 1.5, 0.8))

    # Logo: the lens mark's outer ring is r=189 in a 512 box; fit it to the cleared disc.
    inner = re.sub(r"^.*?<svg[^>]*>|</svg>\s*$", "", logo_svg, flags=re.S)
    inner = re.sub(r"<title>.*?</title>", "", inner)
    def thin(mt):
        segs = re.split(r"(?=M)", mt.group(1))
        out = []
        for sgm in segs:
            pts = re.findall(r"([\d.]+) ([\d.]+)", sgm)
            if not pts: continue
            keep = pts[::4] + ([pts[-1]] if (len(pts)-1) % 4 else [])
            out.append("M" + "L".join(f"{round(float(x))} {round(float(y))}" for x, y in keep))
        return 'd="' + "".join(out) + '"'
    inner = re.sub(r' d="([^"]+)"', lambda mt: " " + thin(mt), inner)
    inner = re.sub(r">\s+<", "><", inner).strip()
    inner = inner.replace('id="lens"', 'id="qrlens"').replace("url(#lens)", "url(#qrlens)")
    logoD = clearR * 2 * 0.9  # modules
    s = logoD / (2 * 189)

    rim = max(1.0, side / 90)
    rad = side * 0.08
    g = n  # gradient runs corner to corner in module space
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" width="{side}" height="{side}" role="img" aria-label="QR code: {url.lower()}">
<defs><linearGradient id="qrink" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{g}" y2="{g}">
<stop offset="0" stop-color="{INK[0]}"/><stop offset=".5" stop-color="{INK[1]}"/><stop offset="1" stop-color="{INK[2]}"/></linearGradient></defs>
<rect x="{rim/2}" y="{rim/2}" width="{side-rim}" height="{side-rim}" rx="{rad-rim/2}" fill="{PAPER}" stroke="{RIM}" stroke-width="{rim}"/>
<g transform="translate({o:.3f},{o:.3f}) scale({m:.5f})">
<path fill="none" stroke="url(#qrink)" stroke-width="{2*R}" stroke-linecap="round" d="{''.join(runs)}"/><path fill="url(#qrink)" fill-rule="evenodd" d="{''.join(rings)}"/>
<path fill="{PUPIL}" d="{''.join(pupils)}"/>
<g transform="translate({n/2},{n/2}) scale({s:.6f}) translate(-256,-256)">{inner}</g>
</g></svg>'''
    return svg, n, qr.version


if __name__ == "__main__":
    url, logo, out = sys.argv[1], sys.argv[2], sys.argv[3]
    svg, n, v = build(url, open(logo, encoding="utf-8").read())
    open(out, "w", encoding="utf-8").write(svg)
    print("modules", n, "version", v, "bytes", len(svg))
