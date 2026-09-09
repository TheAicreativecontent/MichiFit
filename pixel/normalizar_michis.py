# -*- coding: utf-8 -*-
"""Deja los dibujos del michi listos para la app: 320x320, transparentes
y apoyados en el borde de abajo.

Los originales vienen de IMG/ con tamanos muy distintos (203x362,
580x1024, 580x460...) y algunos con un halo de borde semitransparente
que hay que limpiar, o se ve un recuadro sobre la pantalla del aparato.

Lo que de verdad importa aqui es la ESCALA. Con una sola silueta, si el
gato mide distinto en cada pose se nota muchisimo al cambiar de escena:
parece que se acerca y se aleja. Asi que no se escala cada dibujo para
que llene el lienzo, sino para que EL GATO mida lo mismo en todas.

Un gato de pie es alto y estrecho; uno acurrucado es bajo y ancho. Por
eso cada postura lleva su propia altura de referencia, en tanto por uno
del lienzo, sacada de mirar el resultado y no de una formula.

Uso:  python pixel/normalizar_michis.py
"""
import os
from PIL import Image

ORIGEN = "IMG"
DESTINO = "public/michi"
LADO = 320

# Alto del gato dentro del lienzo, en tanto por uno. El michi de pie que
# ya estaba en la app mide 307 de 320, o sea 0.96; el resto se ajusta a
# ojo para que el animal parezca el mismo tamano en todas las poses.
ALTO = {
    "michi_andando":    0.96,
    "michi_celebrando": 0.96,
    "michi_contento":   0.96,
    "michi_triste":     0.96,
    "michi_cansado":    0.80,   # sentado, apoyado
    "michi_comiendo":   0.62,   # sentado sobre el cuenco
    "michi_durmiendo":  0.46,   # acurrucado
}

# Margen por abajo, en tanto por uno del lienzo. Los de pie se apoyan en
# el borde; los tumbados van un pelo mas arriba para que no parezca que
# se salen de la pantalla.
SUELO = {"michi_durmiendo": 0.04, "michi_comiendo": 0.02}

UMBRAL = 120        # por debajo de esto es halo del exportador, no dibujo
LIMPIEZA = 24       # alfa por debajo del cual se borra del todo


def cajaDelGato(im, umbral=UMBRAL):
    """La caja del dibujo de verdad, ignorando el halo de los bordes."""
    a = im.split()[3].point(lambda v: 255 if v >= umbral else 0)
    return a.getbbox()


def limpiar(im):
    """Los pixeles casi invisibles se van del todo: son el halo."""
    r, g, b, a = im.split()
    a = a.point(lambda v: 0 if v < LIMPIEZA else v)
    return Image.merge("RGBA", (r, g, b, a))


def normalizar(nombre, ruta):
    im = limpiar(Image.open(ruta).convert("RGBA"))
    caja = cajaDelGato(im)
    if caja is None:
        raise SystemExit("  %s: no encuentro dibujo dentro" % nombre)
    gato = im.crop(caja)

    alto = int(LADO * ALTO.get(nombre, 0.96))
    escala = alto / gato.height
    ancho = max(1, round(gato.width * escala))
    if ancho > LADO:                      # que no se salga de lado
        escala *= LADO / ancho
        ancho, alto = LADO, max(1, round(alto * LADO / ancho))
    gato = gato.resize((ancho, max(1, round(gato.height * escala))), Image.LANCZOS)

    lienzo = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    x = (LADO - gato.width) // 2
    y = LADO - gato.height - round(LADO * SUELO.get(nombre, 0))
    lienzo.paste(gato, (x, y), gato)
    return lienzo


def main():
    hechos = 0
    for nombre in sorted(ALTO):
        ruta = os.path.join(ORIGEN, nombre + ".png")
        if not os.path.exists(ruta):
            print("  falta %s, me lo salto" % ruta)
            continue
        salida = normalizar(nombre, ruta)
        destino = os.path.join(DESTINO, nombre + ".png")
        salida.quantize(colors=255, method=Image.FASTOCTREE).save(destino, optimize=True)
        caja = salida.split()[3].getbbox()
        print("  %-18s %6.1f kB   gato %dx%d, apoyado en y=%d"
              % (nombre, os.path.getsize(destino) / 1024,
                 caja[2] - caja[0], caja[3] - caja[1], caja[3]))
        hechos += 1
    print("\n%d dibujos listos en %s/" % (hechos, DESTINO))


if __name__ == "__main__":
    main()
