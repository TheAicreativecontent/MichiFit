# -*- coding: utf-8 -*-
"""Borra de un PNG las piezas sueltas que caigan dentro de una zona.

Sirve para quitar un adorno de un dibujo sin tocar el gato: se marca una
caja alrededor del adorno y se borran las MANCHAS CONECTADAS que quepan
enteras dentro de ella. Trabajar por manchas y no por rectangulo es lo
que evita cortar por la mitad algo que se meta en la zona: si una pieza
asoma fuera de la caja, no se toca.

Se uso el 2026-09-11 para quitarle el sol de la esquina a
`michi_sediento`, que ademas de sobrar estiraba la caja del dibujo y
dejaba al gato mas pequeno que en el resto de poses.

Uso:
  python pixel/quitar_pieza.py IMG/michi_sediento.png 150 120 425 390
  python pixel/quitar_pieza.py IMG/michi_sediento.png 150 120 425 390 --ver

Con `--ver` no escribe nada: solo dice que se iria.
"""
import sys
from collections import deque
from PIL import Image

UMBRAL = 120        # el mismo que usa normalizar_michis.py


def manchas(im):
    """Todas las manchas conectadas, como (pixeles, caja, lista de puntos)."""
    W, H = im.size
    px = im.load()
    visto = bytearray(W * H)
    fuera = []
    for y0 in range(H):
        for x0 in range(W):
            if visto[y0 * W + x0] or px[x0, y0][3] < UMBRAL:
                continue
            cola = deque([(x0, y0)])
            visto[y0 * W + x0] = 1
            puntos = []
            minx = maxx = x0
            miny = maxy = y0
            while cola:
                x, y = cola.popleft()
                puntos.append((x, y))
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < W and 0 <= ny < H and not visto[ny * W + nx] \
                            and px[nx, ny][3] >= UMBRAL:
                        visto[ny * W + nx] = 1
                        cola.append((nx, ny))
            fuera.append((len(puntos), (minx, miny, maxx, maxy), puntos))
    return sorted(fuera, key=lambda m: -m[0])


def main():
    args = [a for a in sys.argv[1:] if a != "--ver"]
    ver = "--ver" in sys.argv
    if len(args) != 5:
        raise SystemExit(__doc__)
    ruta = args[0]
    x0, y0, x1, y1 = (int(v) for v in args[1:])

    im = Image.open(ruta).convert("RGBA")
    px = im.load()
    todas = manchas(im)
    gato = todas[0][1]      # la mayor es el gato; nunca se toca

    borradas = 0
    pixeles = 0
    for n, caja, puntos in todas:
        if caja == gato:
            continue
        # entera dentro de la zona, o no se toca
        if not (caja[0] >= x0 and caja[1] >= y0 and caja[2] <= x1 and caja[3] <= y1):
            continue
        print("  %s pieza de %6d px en (%4d,%4d)-(%4d,%4d)"
              % ("veria" if ver else "fuera", n, *caja))
        if not ver:
            for x, y in puntos:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
        borradas += 1
        pixeles += n

    # Los restos casi transparentes del borde de lo borrado tambien se van.
    if not ver and borradas:
        W, H = im.size
        for y in range(max(0, y0 - 2), min(H, y1 + 3)):
            for x in range(max(0, x0 - 2), min(W, x1 + 3)):
                r, g, b, a = px[x, y]
                if 0 < a < UMBRAL:
                    px[x, y] = (r, g, b, 0)

    if ver:
        print("\n%d pieza(s), %d pixeles. Nada escrito (--ver)." % (borradas, pixeles))
        return
    if not borradas:
        print("  no habia ninguna pieza entera dentro de esa zona")
        return
    im.save(ruta)
    caja = im.split()[3].point(lambda v: 255 if v >= UMBRAL else 0).getbbox()
    print("\n%d pieza(s) fuera, %d pixeles. Caja del dibujo ahora: %s" % (borradas, pixeles, caja))


if __name__ == "__main__":
    main()
