# -*- coding: utf-8 -*-
"""Tine la carcasa del huevo conservando su volumen.

El huevo es practicamente monocromatico: el 96% de sus pixeles opacos
estan entre 0 y 30 grados de tono (el naranja de la marca). Eso lo hace
ideal para tenir, porque toda la informacion de relieve esta en la
LUMINOSIDAD, no en el color.

Asi que el metodo es: conservar la luminosidad de cada pixel tal cual y
cambiarle el tono. El sombreado, los brillos y el borde en relieve
sobreviven intactos.

Lo que NO se tine:
  - los tres botones (amarillo, azul, rojo), porque su color es lo que
    los distingue: uno mima, otro cambia de escena y otro duerme;
  - la cadenita, que es metal gris y con tono se ve de plastico.

Uso:  python pixel/tenir_huevo.py
Deja los archivos en public/michi/huevo-<color>.png
"""
import colorsys
import os
from PIL import Image

DESTINO = "public/michi"

# Las dos carcasas. Cada una tiene sus botones y su logo en otro sitio,
# asi que la geometria va con el archivo y no suelta por ahi.
CARCASAS = {
    "liso": {
        "origen": "IMG/Huevo_transparente.png",
        "botones": [(33.6, 85.0), (49.8, 85.0), (65.6, 85.0)],
        "radio": 4.6,
        "logo": (30.5, 10.0, 74.0, 28.0),
    },
    "pixel": {
        "origen": "IMG/Huevo_PixelArt_fuente.png",
        # El pixel art NO tiene botones de colores: los tres son del
        # mismo naranja de la carcasa y solo se distinguen por lo claros
        # que son. Asi que aqui se tinen tambien, o quedarian tres
        # manchas naranjas sobre un huevo azul.
        "botones": [],
        "radio": 5.4,
        "logo": (30.0, 7.0, 80.0, 25.0),
    },
}

# tono (0-360) y cuanto se satura respecto al original.
# El negro y el blanco no tienen tono: se resuelven aparte.
COLORES = {
    "naranja":  {"h": 22,  "sat": 1.00},
    "rojo":     {"h": 356, "sat": 1.00},
    "amarillo": {"h": 45,  "sat": 1.00, "luz": +0.06},
    "verde":    {"h": 145, "sat": 0.92},
    "azul":     {"h": 210, "sat": 0.95},
    # Sin color, el relieve es lo unico que queda, asi que el rango de
    # luminosidad se comprime hacia el extremo en vez de aplastarse:
    # un blanco puro seria una mancha y un negro puro, una silueta.
    # El logo se trata aparte SOLO en estos dos: era blanco sobre
    # naranja, y sobre una carcasa blanca o negra se pierde. Se le da
    # una luminosidad fija que contraste con la carcasa.
    "blanco":   {"gris": (0.62, 0.97), "logo": 0.42},
    "negro":    {"gris": (0.10, 0.45), "logo": 0.88},
}


# Los botones se detectan por POSICION y no por color: el naranja de la
# base cae en el mismo rango que el boton rojo, y buscando por color se
# quedaba sin tenir todo el faldon de abajo.
def esBoton(x, y, W, H, geo):
    for cx, cy in geo["botones"]:
        dx = (x / W * 100 - cx) / geo["radio"]
        dy = (y / H * 100 - cy) / (geo["radio"] * W / H)
        if dx * dx + dy * dy <= 1:
            return True
    return False


# El texto MICHI en relieve: claro, y solo dentro de su caja. La caja
# importa porque el brillo del borde superior izquierdo tiene la misma
# luz que el texto, y si entra aparece un manchurron al lado de la M.
def esLogo(x, y, W, H, l, geo):
    x0, y0, x1, y1 = geo["logo"]
    return (l > 0.80
            and x0 <= x / W * 100 <= x1
            and y0 <= y / H * 100 <= y1)


def esCadena(p, y, H):
    r, g, b, a = p
    return a > 150 and y < H * 0.12 and abs(r - g) < 40 and abs(g - b) < 40


def tenir(im, cfg, geo):
    W, H = im.size
    px = im.load()
    salida = Image.new("RGBA", (W, H))
    sp = salida.load()

    # rango real de luminosidad de la carcasa, para poder reescalarlo
    if "gris" in cfg:
        luces = []
        for y in range(0, H, 2):
            for x in range(0, W, 2):
                p = px[x, y]
                if p[3] < 150 or esBoton(x, y, W, H, geo) or esCadena(p, y, H):
                    continue
                luces.append(colorsys.rgb_to_hls(p[0] / 255, p[1] / 255, p[2] / 255)[1])
        lo, hi = min(luces), max(luces)
        destLo, destHi = cfg["gris"]

    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a == 0:
                sp[x, y] = (0, 0, 0, 0)
                continue
            p = (r, g, b, a)
            if esBoton(x, y, W, H, geo) or esCadena(p, y, H):
                sp[x, y] = p                      # se queda como estaba
                continue

            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if "logo" in cfg and esLogo(x, y, W, H, l, geo):
                # se conserva un poco de modelado dentro de la letra
                nl = cfg["logo"] + (l - 0.80) * 0.35
                nr, ng, nb = colorsys.hls_to_rgb(0, min(1, max(0, nl)), 0)
                sp[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
                continue
            if "gris" in cfg:
                # reescalar la luminosidad al tramo pedido, sin saturar
                t = 0.5 if hi == lo else (l - lo) / (hi - lo)
                nl = destLo + t * (destHi - destLo)
                nr, ng, nb = colorsys.hls_to_rgb(0, nl, 0)
            else:
                nl = min(1.0, max(0.0, l + cfg.get("luz", 0)))
                nr, ng, nb = colorsys.hls_to_rgb(cfg["h"] / 360, nl, s * cfg["sat"])
            sp[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return salida


def main():
    os.makedirs(DESTINO, exist_ok=True)
    total = 0
    for estilo, geo in CARCASAS.items():
        im = Image.open(geo["origen"]).convert("RGBA")
        print("\n%s (%s)" % (estilo, geo["origen"]))
        for nombre, cfg in COLORES.items():
            salida = tenir(im, cfg, geo)
            ruta = os.path.join(DESTINO, "huevo-%s-%s.png" % (estilo, nombre))
            # 255 colores: la carcasa pesa 60 kB en vez de 500 y no se nota
            salida.quantize(colors=255, method=Image.FASTOCTREE).save(ruta, optimize=True)
            kb = os.path.getsize(ruta) / 1024
            total += kb
            print("  %-9s %6.1f kB" % (nombre, kb))
    print("\n%d variantes, %.0f kB en total (solo se descarga la elegida)"
          % (len(CARCASAS) * len(COLORES), total))


if __name__ == "__main__":
    main()
