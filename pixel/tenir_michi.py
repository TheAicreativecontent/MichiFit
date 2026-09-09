# -*- coding: utf-8 -*-
"""Hace michis de otros colores a partir de los dibujos naranjas.

Deja los archivos en public/michi/ con el sufijo del color:
michi-gris.png, michi_contento-blanco.png... El naranja son los
originales, sin sufijo.

Funciona por la misma razon que el huevo: el michi es un 99%
monocromatico —todo su pelaje esta entre 0 y 30 grados de tono— asi que
el relieve vive en la LUMINOSIDAD. Se conserva la luz de cada pixel y se
le quita el color. Las rayas del atigrado, las sombras y el volumen
sobreviven intactos.

Dos cosas que NO se tocan, y son las que le dan la cara:

  - los mofletes rosas y el interior de las orejas. Son un rosa salmon a
    8 grados de tono, o sea DENTRO del rango del naranja: si se filtra
    solo por tono se tinen con el pelaje y el michi pierde la gracia.
    Se separan porque son claros y saturados, mientras que el pelaje de
    ese tono es oscuro (los ojos) o esta mas arriba (20-30 grados).
  - los ojos y la boca, que ya son casi negros.

Uso:  python pixel/tenir_michi.py
"""
import colorsys
import glob
import os

from PIL import Image

ORIGEN = "public/michi"
DESTINO = "public/michi"

# Tramo de luminosidad al que se lleva el pelaje, en tanto por uno. Como
# en el huevo, no se llega a blanco ni a negro puros: un gato blanco
# puro seria una mancha sin modelado, y uno negro puro una silueta.
# Los nombres son los de Alberto, no los mios. Lo que yo llamaba
# «negro» el lo ve gris, y lo que yo llamaba «gris» le queda bien de
# blanco subiendolo un poco: el blanco que hice primero (0.66-0.99)
# deslumbraba y perdia el atigrado.
VARIANTES = {
    "gris":   {"luz": (0.12, 0.52), "sat": 0.03},
    "blanco": {"luz": (0.56, 0.94), "sat": 0.035},
}


def esMejilla(hd, l, s):
    """El rosa de los mofletes y las orejas."""
    return hd < 16 and l > 0.55 and s > 0.60


def tenir(im, cfg):
    W, H = im.size
    px = im.load()
    out = Image.new("RGBA", (W, H))
    op = out.load()

    # rango real de luz del pelaje, para reescalarlo sin aplastarlo
    luces = []
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if s >= 0.12 and not esMejilla(h * 360, l, s):
                luces.append(l)
    if not luces:
        return im.copy()
    lo, hi = min(luces), max(luces)

    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
                continue
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if s < 0.12 or esMejilla(h * 360, l, s):
                op[x, y] = (r, g, b, a)          # ojos y mofletes, intactos
                continue
            t = 0.5 if hi == lo else max(0.0, min(1.0, (l - lo) / (hi - lo)))
            destLo, destHi = cfg["luz"]
            nl = destLo + t * (destHi - destLo)
            nr, ng, nb = colorsys.hls_to_rgb(0, nl, cfg["sat"])
            op[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return out


def main():
    os.makedirs(DESTINO, exist_ok=True)
    # Solo los NARANJAS: son michi.png y michi_<pose>.png, sin sufijo de
    # color. Sin este filtro, la segunda vez que se lanza el script se
    # lee a si mismo y saca michi-gris-gris.png.
    poses = sorted(p for p in glob.glob(os.path.join(ORIGEN, "michi*.png"))
                   if "huevo" not in p
                   and "-" not in os.path.basename(p))
    if not poses:
        raise SystemExit("no encuentro los michis en %s" % ORIGEN)

    for color, cfg in VARIANTES.items():
        print("\n%s" % color)
        for ruta in poses:
            nombre = os.path.basename(ruta)[:-4]          # michi_contento
            salida = tenir(Image.open(ruta).convert("RGBA"), cfg)
            destino = os.path.join(DESTINO, "%s-%s.png" % (nombre, color))
            salida.quantize(colors=255, method=Image.FASTOCTREE).save(destino, optimize=True)
            print("  %-20s %5.1f kB" % (nombre, os.path.getsize(destino) / 1024))

    print("\n%d michis en %s/. Para meterlos en la app habria que moverlos"
          % (len(poses) * len(VARIANTES), DESTINO))
    print("a public/michi/ y anadir el color al selector, como se hizo con")
    print("la carcasa del huevo (ver src/mascota/TamagotchiPNG.jsx).")


if __name__ == "__main__":
    main()
