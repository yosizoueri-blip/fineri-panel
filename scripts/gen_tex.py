import json, math, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
out = sys.argv[1]
rng = np.random.default_rng(7)
def fbm(w, h, octaves=6, base=4, seed=0, wrap=True):
    r = np.random.default_rng(seed); acc = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        gw, gh = base * 2**o, max(2, base * 2**o // 2)
        g = r.random((gh + 1, gw + 1));
        if wrap: g[:, -1] = g[:, 0]
        im = Image.fromarray((g * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
        acc += np.asarray(im) / 255 * amp; tot += amp; amp *= .5
    return acc / tot
# ---- earth
t = json.load(open('wa/x/package/land-50m.json'))
sx, sy = t['transform']['scale']; tx, ty = t['transform']['translate']
arcs = []
for a in t['arcs']:
    x = y = 0; pts = []
    for dx, dy in a: x += dx; y += dy; pts.append((x*sx+tx, y*sy+ty))
    arcs.append(pts)
def ring(idx):
    o = []
    for i in idx:
        p = arcs[i] if i >= 0 else arcs[~i][::-1]
        o += p if not o else p[1:]
    return o
W, H = 1024, 512; S = 2
mask = Image.new('L', (W*S, H*S), 0); dr = ImageDraw.Draw(mask)
for g in t['objects']['land']['geometries']:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        for k, r in enumerate(poly):
            u = []; off = 0; prev = None
            for lon, lat in ring(r):
                if prev is not None and abs(lon-prev) > 180: off += -360 if lon-prev > 0 else 360
                prev = lon; u.append((lon+off, lat))
            if abs(u[-1][0]-u[0][0]) > 180: u += [(u[-1][0], -90), (u[0][0], -90)]
            for o in (-360, 0, 360):
                dr.polygon([((lon+o+180)/360*W*S, (90-lat)/180*H*S) for lon, lat in u], fill=0 if k else 255)
mask = mask.resize((W, H), Image.LANCZOS)
m = np.asarray(mask).astype(float) / 255
lat = np.linspace(90, -90, H)[:, None] * np.ones((1, W))
lon = np.linspace(-180, 180, W)[None, :] * np.ones((H, 1))
n1 = fbm(W, H, 7, 6, 1); n2 = fbm(W, H, 6, 10, 2)
# biomes
green = np.array([52, 92, 44]); dkgreen = np.array([30, 66, 34]); desert = np.array([190, 160, 110]); steppe = np.array([140, 130, 82]); tundra = np.array([120, 115, 100]); ice = np.array([235, 240, 245])
al = np.abs(lat)
w_des = np.clip(1 - np.abs(al - 24) / 12, 0, 1) * np.clip((n1 - .35) * 3, 0, 1)
w_trop = np.clip(1 - al / 15, 0, 1)
w_tun = np.clip((al - 55) / 12, 0, 1)
w_ice = np.clip((al - 70) / 6, 0, 1) + (lat < -62)
base = green[None, None] * (1 - w_trop[..., None]) + dkgreen[None, None] * w_trop[..., None]
base = base * (1 - w_des[..., None]) + desert * w_des[..., None]
mid = np.clip((al - 35) / 15, 0, 1) * np.clip(1 - (al - 55) / 10, 0, 1) * np.clip((n2 - .45) * 3, 0, 1)
base = base * (1 - mid[..., None] * .5) + steppe * mid[..., None] * .5
base = base * (1 - w_tun[..., None]) + tundra * w_tun[..., None]
base = base * (.8 + .4 * n2[..., None])
# mountains: ridges as brown/grey, snow caps on the highest
ridges = [[[73,35],[78,33],[82,30],[86,28],[90,28],[95,28]], [[70,38],[75,36],[80,36]], [[-75,10],[-77,0],[-77,-10],[-70,-18],[-69,-25],[-70,-33],[-71,-40],[-73,-50]],
    [[-150,62],[-135,59],[-122,52],[-115,47],[-110,42],[-107,37],[-105,32]], [[6,45],[10,46.5],[14,47]], [[60,68],[59,60],[58,55],[58,51]], [[-8,31],[0,34],[8,36]],
    [[40,43.5],[47,41.5]], [[145,-15],[147,-25],[150,-32],[148,-37]], [[37,13],[38,5],[36,-3],[35,-10]], [[45,36],[50,32],[56,27]], [[100,35],[104,30],[100,25]], [[85,35],[95,35],[100,33]]]
mt = Image.new('L', (W, H), 0); md = ImageDraw.Draw(mt)
for r in ridges:
    md.line([((lo+180)/360*W, (90-la)/180*H) for lo, la in r], fill=255, width=7)
mt = np.asarray(mt.filter(ImageFilter.GaussianBlur(5))).astype(float) / 255 * (.5 + n1)
mt = np.clip(mt, 0, 1)
rock = np.array([110, 95, 80])
base = base * (1 - mt[..., None] * .8) + rock * mt[..., None] * .8
snow = np.clip((mt - .7) * 4, 0, 1)
base = base * (1 - snow[..., None]) + ice * snow[..., None]
base = base * (1 - np.clip(w_ice, 0, 1)[..., None]) + ice * np.clip(w_ice, 0, 1)[..., None]
# ocean: deep blue, lighter on shelves
coast = np.asarray(mask.filter(ImageFilter.GaussianBlur(6))).astype(float) / 255
ocean = np.array([8, 28, 70]) * (1 - coast[..., None] * .8) + np.array([22, 80, 120]) * coast[..., None] * .8
ocean = ocean * (.9 + .2 * n2[..., None])
seaice = np.clip((al - 74) / 6, 0, 1)
ocean = ocean * (1 - seaice[..., None]) + ice * .9 * seaice[..., None]
img = ocean * (1 - m[..., None]) + base * m[..., None]
Image.fromarray(np.clip(img, 0, 255).astype('uint8')).save(out + '/earth-tex.jpg', quality=82)
# clouds (alpha): banded fractal noise, more at mid-latitudes and the ITCZ
c = fbm(W, H, 7, 8, 5)
band = .55 + .25 * np.cos(np.radians(lat) * 6) * 0 + .2 * np.exp(-((al - 50) / 15) ** 2) + .15 * np.exp(-(al / 8) ** 2)
cl = np.clip((c * band - .3) * 3.2, 0, 1)
Image.fromarray((cl * 255).astype('uint8')).save(out + '/earth-clouds.png', optimize=True)
# ---- moon: front-face albedo (orthographic), 384px
M = 384
y, x = np.mgrid[0:M, 0:M]; nx = (x - M/2 + .5) / (M/2); ny = (y - M/2 + .5) / (M/2)
inside = nx**2 + ny**2 <= 1
alb = .62 + .12 * fbm(M, M, 7, 4, 9, False) - .06
# maria (approximate near-side positions; x right = east as seen from earth, y down = south)
maria = [(-.38, -.32, .26, .2), (.05, -.38, .17, .14), (.28, -.02, .2, .15), (.62, -.25, .1, .08), (.55, .18, .1, .14), (-.15, .38, .16, .1),
         (-.62, -.05, .22, .42), (-.45, .2, .12, .1), (.15, .12, .12, .1), (-.1, -.05, .1, .08)]
mm = np.zeros((M, M))
for (cxm, cym, rx, ry) in maria:
    mm = np.maximum(mm, np.clip(1 - (((nx - cxm) / rx) ** 2 + ((ny - cym) / ry) ** 2), 0, 1))
mm = np.asarray(Image.fromarray((mm * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(4))).astype(float) / 255
alb = alb - mm * .28
r2 = np.random.default_rng(3)
for i in range(150):
    cxm, cym = r2.uniform(-1, 1, 2); rr = r2.uniform(.006, .03) if i > 6 else r2.uniform(.04, .07)
    d = np.sqrt((nx - cxm) ** 2 + (ny - cym) ** 2) / rr
    alb += np.where(d < 1, -.035 * (1 - d), 0) + np.where((d >= 1) & (d < 1.3), .03 * (1.3 - d) / .3, 0)
# Tycho with rays
tyx, tyy = -.12, .62
d = np.sqrt((nx - tyx) ** 2 + (ny - tyy) ** 2); ang = np.arctan2(ny - tyy, nx - tyx)
alb += np.where(d < .03, .1, 0) + .07 * np.clip(np.cos(ang * 9) ** 40, 0, 1) * np.exp(-d * 2.5)
alb = np.asarray(Image.fromarray((np.clip(alb,0,1)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.8))).astype(float)/255
a = np.zeros((M, M, 4), 'uint8'); a[..., 0] = a[..., 1] = a[..., 2] = (alb * 255).astype('uint8'); a[..., 3] = (inside * 255).astype('uint8')
Image.fromarray(a, 'RGBA').save(out + '/moon-tex.png', optimize=True)
print('ok')
