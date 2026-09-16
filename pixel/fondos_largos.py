"""
Prepara los fondos LARGOS de Albert (`IMG/BG_*.jpg`) para la app.

Los de siempre son cuadrados de 716 y no dan paneo ninguno. Estos vienen
apaisados a proposito —el parque mide mas de tres veces el ancho de la
ventana— para que el escenario pueda desplazarse mientras el michi anda.

EL PARQUE TIENE QUE CERRAR EN BUCLE
-----------------------------------
Si el final no empalma con el principio, cada vuelta se ve como un salto.
El archivo original casi cerraba (25/255 de diferencia entre sus bordes)
pero no del todo.

El primer intento fue FUNDIR el borde derecho contra el izquierdo, que es
lo que suele hacerse. Salio mal y de una forma muy visible: en la franja
del fundido se transparentaban dos cosas a la vez —un pilar de ladrillo
fantasma y dos farolas superpuestas—. El fundido sirve para texturas sin
formas reconocibles; aqui hay objetos, y un objeto medio transparente
canta mas que una costura.

Lo que si funciona: NO tocar los pixeles y buscar DONDE cortar. El dibujo
tiene farolas y pilares repetidos, asi que existen dos columnas —una
cerca del principio y otra cerca del final— que ya casan solas. Se
prueban por pares y se corta por la mejor. Con el parque baja de 25 a
5,7 sobre 255, y la union es invisible: el corte cae por la mitad de un
pilar y el pilar se reconstruye entero al repetirse.

Uso:  python pixel/fondos_largos.py
"""
import os

from PIL import Image, ImageChops

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, '..')
ORIGEN = os.path.join(RAIZ, 'IMG')
DESTINO = os.path.join(RAIZ, 'public', 'fondos')

# `bucle` dice si ese fondo tiene que empalmar consigo mismo. Solo el
# parque, que es el unico que se desplaza: los demas se quedan quietos y
# solo aprovechan el ancho para enseñar mas sitio.
# `recorte` es (x0, x1) en pixeles del original, o None para entero.
FONDOS = [
    ('BG_Park.jpg', 'parque.png', True, None),

    # BG_Kitchen NO es una cocina: es el piso entero, y la cocina es solo
    # el tercio izquierdo. Sin recortar, la pantallita enseñaba el CENTRO
    # —el arco y la nevera— y se veia raro y diminuto. Lo dijo Albert:
    # «se ve escalado y mal».
    #
    # 0..742 deja la cocina entera y da 742x672, casi cuadrado, que es
    # la proporcion de la ventana (1,10): asi el escenario se ve a su
    # tamano en vez de recortado a la fuerza.
    ('BG_Kitchen.jpg', 'cocina.png', False, (0, 742)),

    # El gimnasio nuevo, para PROBARLO. El de siempre sigue en su sitio
    # y sigue siendo el que usa la app: este se elige desde el panel de
    # pruebas (siete toques en el logo). Se centra en la puerta del
    # fondo, que es donde el dibujo tiene su punto de fuga.
    ('BG_Gym.jpg', 'gimnasio-nuevo.png', False, (420, 1160)),
]

COLORES = 128       # paleta, como el resto de fondos: pesan la mitad
MARGEN = 360        # cuanto se puede mover el corte por cada lado
PASO = 3
MINIMO = 1400       # no dejar el fondo mas corto que esto


def diferencia(px, filas, xa, xb, cache):
    a = cache.setdefault(xa, [px[xa, y] for y in filas])
    b = cache.setdefault(xb, [px[xb, y] for y in filas])
    return sum(abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2])
               for p, q in zip(a, b)) / (len(a) * 3)


def corte_que_cierra(im):
    """Las dos columnas que mejor casan, una por cada punta."""
    ancho, alto = im.size
    px = im.load()
    filas = range(0, alto, 4)
    cache = {}
    mejor = None
    for xl in range(0, MARGEN, PASO):
        for xr in range(ancho - MARGEN, ancho, PASO):
            if xr - xl < MINIMO:
                continue
            d = diferencia(px, filas, xl, xr, cache)
            if mejor is None or d < mejor[0]:
                mejor = (d, xl, xr)
    return mejor


def cierre(im):
    """Cuanto se parecen los dos bordes ya recortados. 0 es perfecto."""
    ancho, alto = im.size
    d = ImageChops.difference(im.crop((0, 0, 6, alto)), im.crop((ancho - 6, 0, ancho, alto)))
    px = list(d.get_flattened_data())
    return sum(sum(p) for p in px) / (len(px) * 3)


def main():
    if not os.path.isdir(ORIGEN):
        raise SystemExit('no encuentro %s: los fondos no estan en esta maquina' % ORIGEN)
    os.makedirs(DESTINO, exist_ok=True)
    for entrada, salida, bucle, recorte in FONDOS:
        ruta = os.path.join(ORIGEN, entrada)
        if not os.path.exists(ruta):
            print('  (falta %s, me lo salto)' % entrada)
            continue
        im = Image.open(ruta).convert('RGB')
        if recorte:
            im = im.crop((recorte[0], 0, recorte[1], im.height))
        antes = cierre(im)
        if bucle:
            d, xl, xr = corte_que_cierra(im)
            im = im.crop((xl, 0, xr, im.height))
            print('%-16s corte en %d..%d   cierre %.1f -> %.1f de 255'
                  % (entrada, xl, xr, antes, d))
        destino = os.path.join(DESTINO, salida)
        im.quantize(colors=COLORES, method=Image.MEDIANCUT).save(destino, optimize=True)
        print('  %-14s %dx%d  %d kB%s'
              % (salida, im.width, im.height, os.path.getsize(destino) // 1024,
                 '  (en bucle)' if bucle else ''))
    print('\nSUBE `const CACHE` en public/sw.js si has REEMPLAZADO alguno.')


if __name__ == '__main__':
    main()
