"""
Recorta una hoja de personaje en los PNG que usa la app.

Pensado para las hojas generadas con IA: varios michis en una imagen,
con su etiqueta debajo. Al venir todos de una sola generación son
consistentes entre sí, que es lo que no se consigue generándolos de
uno en uno.

Qué hace:
  1. quita el fondo blanco
  2. busca las manchas grandes de color (los gatos) e ignora las
     pequeñas (el texto de las etiquetas)
  3. las ordena de arriba a abajo y de izquierda a derecha
  4. recorta, cuadra apoyando al michi abajo y comprime

Uso:
  python recortar_hoja.py ../IMG/cuerpos.png

Si el orden no coincide, cambia ORDEN: es la lista de qué estado va en
cada posición, y `None` para saltarse uno.
"""

import os
import sys
from PIL import Image

# Posición en la hoja -> nombre de archivo. None se descarta.
ORDEN = [
    "esqueletico",     # muy delgado
    "gordo",           # gordito
    "kawaii",          # normal
    None,              # (repetido / etiqueta con errata)
    "fit",             # atlético
    "hipertrofiado",   # muy musculado
]

LADO = 320
MIN_AREA = 0.012   # una mancha menor que esto (en % del total) es texto


def sin_fondo(im, umbral=238):
    im = im.convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if r > umbral and g > umbral and b > umbral:
                px[x, y] = (r, g, b, 0)
    return im


def manchas(im):
    """Componentes conexas por barrido de filas, sin recursión."""
    w, h = im.size
    a = im.getchannel("A").load()
    visto = [[False] * w for _ in range(h)]
    cajas = []
    for y0 in range(h):
        for x0 in range(w):
            if visto[y0][x0] or a[x0, y0] < 40:
                continue
            pila = [(x0, y0)]
            visto[y0][x0] = True
            xi = xf = x0
            yi = yf = y0
            n = 0
            while pila:
                x, y = pila.pop()
                n += 1
                xi, xf = min(xi, x), max(xf, x)
                yi, yf = min(yi, y), max(yf, y)
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not visto[ny][nx] and a[nx, ny] >= 40:
                        visto[ny][nx] = True
                        pila.append((nx, ny))
            cajas.append(((xi, yi, xf + 1, yf + 1), n))
    return cajas


def agrupar_en_filas(cajas, tolerancia=0.25):
    """Ordena arriba-abajo, izquierda-derecha, tolerando desalineos."""
    if not cajas:
        return []
    alto = max(c[3] - c[1] for c in cajas)
    filas = []
    for caja in sorted(cajas, key=lambda c: c[1]):
        for fila in filas:
            if abs(caja[1] - fila[0][1]) < alto * tolerancia * 2:
                fila.append(caja)
                break
        else:
            filas.append([caja])
    return [c for fila in filas for c in sorted(fila, key=lambda c: c[0])]


def encuadrar(im, lado=LADO):
    escala = min(lado / im.width, lado / im.height) * 0.96
    im = im.resize((max(1, int(im.width * escala)), max(1, int(im.height * escala))),
                   Image.LANCZOS)
    lienzo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    lienzo.paste(im, ((lado - im.width) // 2, lado - im.height), im)
    return lienzo


def comprimir(im, ruta, colores=96):
    alfa = im.getchannel("A")
    q = im.convert("RGB").quantize(colors=colores, method=Image.MEDIANCUT).convert("RGBA")
    q.putalpha(alfa)
    q.quantize(colors=colores).save(ruta, optimize=True)


def main(origen):
    aqui = os.path.dirname(os.path.abspath(__file__))
    destino = os.path.join(aqui, "..", "public", "michi")
    os.makedirs(destino, exist_ok=True)

    hoja = sin_fondo(Image.open(origen))
    total = hoja.width * hoja.height
    grandes = [c for c, n in manchas(hoja) if n > total * MIN_AREA]
    grandes = agrupar_en_filas(grandes)

    print(f"encontradas {len(grandes)} figuras grandes (se esperaban {len(ORDEN)})")
    if len(grandes) != len(ORDEN):
        print("!! el número no cuadra. Revisa MIN_AREA o el ORDEN.")

    for caja, nombre in zip(grandes, ORDEN):
        if nombre is None:
            continue
        trozo = hoja.crop(caja)
        recorte = trozo.getbbox()
        if recorte:
            trozo = trozo.crop(recorte)
        ruta = os.path.join(destino, f"{nombre}.png")
        comprimir(encuadrar(trozo), ruta)
        print(f"  {nombre:16} {os.path.getsize(ruta)//1024:3} KB")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
