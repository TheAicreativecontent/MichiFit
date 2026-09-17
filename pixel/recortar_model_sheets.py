"""
Saca los michis de las cuatro model sheets de Albert y los deja listos para
la app: 320x320, fondo transparente, apoyados abajo.

Las hojas son `IMG/model_sheet_<color>.jpg`, ~1376x768, con diez michis en
dos filas de cinco sobre fondo blanco. IMG/ NO esta en git —es material
fuente y pesa— asi que este script solo corre en una maquina que tenga la
carpeta. Lo que se versiona es lo que sale: `public/michi/`.

REJILLA FIJA, NO DETECCION DE BLOBS
------------------------------------
La primera version recortaba buscando huecos entre michis (columnas sin
tinta). Con las hojas de 2026-09-17 —que añaden `triste` y `cansado`, y la
hoja `negro`— los dibujos quedan mas juntos y ese hueco a veces desaparece:
el vapor de "entrenando" casi toca las gotas de "cansado", y el resultado
eran piezas fundidas o partidas por la mitad. Diez celdas de tamaño fijo
(cinco columnas, dos filas) son mas torpes pero no dependen de que haya un
hueco limpio, y las cuatro hojas miden lo mismo por diseño.

POR QUE EL FONDO SE QUITA SOBRE LA HOJA ENTERA, NO CELDA A CELDA
------------------------------------------------------------------
Si se recorta primero y se quita el fondo despues, un bolsillo de blanco
que quede ENCERRADO dentro de una pose —la cola de "andando" lo encierra
en la hoja negra, por ejemplo— pierde su camino hasta el borde de la hoja
y se queda opaco. Sobre la hoja entera ese camino casi siempre existe
—el blanco de dos celdas vecinas se toca por el hueco entre ambas—, asi
que `fondo_fuera` corre ANTES de partir en celdas.

POR QUE NO VALE `sin_blanco()` DE recortar_poses.py
---------------------------------------------------
Aquel pone transparente TODO pixel mas claro que un umbral. Con el michi
naranja da igual, pero el BLANCO tiene la barriga en (228, 226, 237) y el
fondo en (255, 255, 255): un umbral que se coma el fondo se come tambien
media barriga, y uno que respete la barriga deja el fondo sucio.

Aqui el fondo se quita por RELLENO DESDE LOS BORDES: solo desaparece el
blanco que se toca con el borde de la hoja. La barriga esta rodeada por el
contorno oscuro del dibujo, asi que el relleno no llega y se queda entera.
Es mas lento y es el unico que funciona con los cuatro colores.

EL BOLSILLO DE LA HOJA NEGRA
-----------------------------
Con todo lo anterior, a la hoja negra le queda UN bolsillo real: dentro de
la cola de "andando" hay unos 1.200 px casi blancos que no tocan ningun
borde por ningun camino —esta cerrado del todo en el propio dibujo, no es
un fallo del relleno—. `agujeros_sueltos()` lo cierra en una segunda
pasada: cualquier isla de blanco que quede SIN tocar el borde y sea
pequeña se transparenta tambien.

Esa segunda pasada NO se aplica a la hoja BLANCA: ahi el pelaje mismo es
casi tan claro como el fondo, y tiene cientos de islas pequeñas que son
pelaje de verdad (una pata separada de la barriga por el contorno, etc.).
Aplicar esto al blanco perfora el gato entero. Medido: la isla más
pequeña de pelaje legítimo en la hoja blanca ronda los 11.000 px: el
umbral de 4.000 usado aquí queda muy por debajo y no la toca, mientras que
sí cierra el bolsillo de 1.200 de la negra y las motas sueltas (ojos,
antialiasing) de la naranja y la gris, que no llegan a los 400 px.

LA POSE 5 YA NO SE DESCARTA
-----------------------------
Hasta el 2026-09-16 la hoja no tenia una quinta pose consistente —en la
naranja salia un gato agobiado y en la gris/blanca uno leyendo el
periodico— asi que se tiraba y `michi_triste` seguia siendo el dibujo
antiguo. Albert redibujo esa casilla igual en las cuatro hojas
(2026-09-17): ahora es TRISTE, y entra. La 10 tambien cambio de sentido:
antes era CANSADO/sediento generico y ahora es la escena de después de
entrenar (sudando, con la botella), asi que pasa a `michi_cansado`.
`michi_sediento` no sale de aqui: sigue siendo el dibujo de antes, para
cuando el cuenco de agua esta bajo.

Uso:  python pixel/recortar_model_sheets.py            (escribe)
      python pixel/recortar_model_sheets.py --prueba   (solo mira)
"""
import os
import sys
from collections import deque

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from recortar_poses import encuadrar, comprimir      # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, '..')
ORIGEN = os.path.join(RAIZ, 'IMG')
DESTINO = os.path.join(RAIZ, 'public', 'michi')

HOJAS = {'naranja': '', 'gris': '-gris', 'blanco': '-blanco', 'negro': '-negro'}

# Cinco columnas, dos filas, en el orden en que se leen.
POSES = ['michi', 'michi_andando', 'michi_asqueado', 'michi_comiendo', 'michi_triste',
         'michi_contento', 'michi_durmiendo', 'michi_celebrando',
         'michi_entrenando', 'michi_cansado']
COLUMNAS, FILAS = 5, 2

FONDO = 240          # a partir de aqui se considera fondo, si toca el borde
ISLA_MAXIMA = 4000    # islas de blanco sin salida al borde, por debajo de esto: fuera


def fondo_fuera(im):
    """Transparenta SOLO el blanco pegado al borde. Ver la cabecera."""
    im = im.convert('RGBA')
    ancho, alto = im.size
    px = im.load()
    claro = lambda x, y: (px[x, y][0] > FONDO and px[x, y][1] > FONDO
                          and px[x, y][2] > FONDO)
    visto = [[False] * ancho for _ in range(alto)]
    cola = deque()
    for x in range(ancho):
        for y in (0, alto - 1):
            if claro(x, y) and not visto[y][x]:
                visto[y][x] = True
                cola.append((x, y))
    for y in range(alto):
        for x in (0, ancho - 1):
            if claro(x, y) and not visto[y][x]:
                visto[y][x] = True
                cola.append((x, y))
    while cola:
        x, y = cola.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < ancho and 0 <= ny < alto and not visto[ny][nx] and claro(nx, ny):
                visto[ny][nx] = True
                cola.append((nx, ny))
    return im


def agujeros_sueltos(im, maximo=ISLA_MAXIMA):
    """Segunda pasada: cierra bolsillos de blanco que `fondo_fuera` no
    pudo alcanzar porque no tocan ningun borde. Ver la cabecera —NO
    llamar con la hoja blanca."""
    im = im.copy()
    ancho, alto = im.size
    px = im.load()
    claro = lambda x, y: (px[x, y][3] > 0 and px[x, y][0] > FONDO
                          and px[x, y][1] > FONDO and px[x, y][2] > FONDO)
    visto = [[False] * ancho for _ in range(alto)]
    for y in range(alto):
        for x in range(ancho):
            if not claro(x, y) or visto[y][x]:
                continue
            isla = [(x, y)]
            visto[y][x] = True
            cola = deque([(x, y)])
            while cola:
                cx, cy = cola.popleft()
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < ancho and 0 <= ny < alto and not visto[ny][nx] and claro(nx, ny):
                        visto[ny][nx] = True
                        cola.append((nx, ny))
                        isla.append((nx, ny))
            if len(isla) <= maximo:
                for ix, iy in isla:
                    r, g, b, _ = px[ix, iy]
                    px[ix, iy] = (r, g, b, 0)
    return im


def piezas(hoja):
    """Las diez celdas de la rejilla, en orden de lectura."""
    ancho, alto = hoja.size
    cw, ch = ancho / COLUMNAS, alto / FILAS
    trozos = []
    for fila in range(FILAS):
        for col in range(COLUMNAS):
            caja = (round(col * cw), round(fila * ch),
                    round((col + 1) * cw), round((fila + 1) * ch))
            trozos.append(hoja.crop(caja))
    return trozos


def main():
    prueba = '--prueba' in sys.argv
    if not os.path.isdir(ORIGEN):
        raise SystemExit('no encuentro %s: las hojas no estan en esta maquina' % ORIGEN)
    total = 0
    for color, sufijo in HOJAS.items():
        ruta = os.path.join(ORIGEN, 'model_sheet_%s.jpg' % color)
        if not os.path.exists(ruta):
            raise SystemExit('falta %s' % ruta)
        hoja = fondo_fuera(Image.open(ruta))
        if color != 'blanco':
            hoja = agujeros_sueltos(hoja)
        trozos = piezas(hoja)
        if len(trozos) != len(POSES):
            raise SystemExit('%s: encontre %d celdas y esperaba %d'
                             % (color, len(trozos), len(POSES)))
        print('\n%s:' % color)
        for pose, trozo in zip(POSES, trozos):
            destino = os.path.join(DESTINO, pose + sufijo + '.png')
            if prueba:
                print('  %-26s %dx%d' % (os.path.basename(destino), trozo.width, trozo.height))
                continue
            comprimir(encuadrar(trozo), destino)
            print('  %-26s %3d kB' % (os.path.basename(destino),
                                      os.path.getsize(destino) // 1024))
            total += 1
    print('\n%d michis%s' % (total, ' (prueba: no se ha escrito nada)' if prueba else ''))
    if not prueba:
        print('SUBE `const CACHE` en public/sw.js: mismos nombres, contenido nuevo (y')
        print('archivos nuevos si es la primera vez que sale un color o una pose).')


if __name__ == '__main__':
    main()
