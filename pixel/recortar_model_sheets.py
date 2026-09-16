"""
Saca los michis de las tres model sheets de Albert y los deja listos para
la app: 320x320, fondo transparente, apoyados abajo.

Las hojas son `IMG/model_sheet_<color>.jpg`, 1376x768, con diez michis en
dos filas de cinco sobre fondo blanco. IMG/ NO esta en git —es material
fuente y pesa— asi que este script solo corre en una maquina que tenga la
carpeta. Lo que se versiona es lo que sale: `public/michi/`.

POR QUE NO VALE `sin_blanco()` DE recortar_poses.py
---------------------------------------------------
Aquel pone transparente TODO pixel mas claro que un umbral. Con el michi
naranja da igual, pero el BLANCO tiene la barriga en (228, 226, 237) y el
fondo en (255, 255, 255): un umbral que se coma el fondo se come tambien
media barriga, y uno que respete la barriga deja el fondo sucio.

Aqui el fondo se quita por RELLENO DESDE LOS BORDES: solo desaparece el
blanco que se toca con el borde de la hoja. La barriga esta rodeada por el
contorno oscuro del dibujo, asi que el relleno no llega y se queda entera.
Es mas lento y es el unico que funciona con los tres colores.

LA POSE 5 NO SE USA
-------------------
En la hoja naranja es un gato agobiado y en la gris y la blanca es uno
leyendo el periodico con gafas: las hojas NO coinciden en esa casilla.
Decision de Albert (2026-09-16): fuera. `michi_triste` y `michi_cansado`
se quedan como estaban, dibujados antes.

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

HOJAS = {'naranja': '', 'gris': '-gris', 'blanco': '-blanco'}

# Que pose hay en cada columna, en el orden en que se leen. `None` es la
# 5, que se descarta. Si algun dia cambian las hojas, esto es lo unico
# que hay que tocar.
POSES = ['michi', 'michi_andando', 'michi_asqueado', 'michi_comiendo',
         None,
         'michi_contento', 'michi_durmiendo', 'michi_celebrando',
         'michi_entrenando', 'michi_sediento']

FONDO = 240      # a partir de aqui se considera fondo, si toca el borde
MIN_ANCHO = 40
JUNTOS = 1.55    # un blob mas ancho que la mediana por esto son dos


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


def tramos(activo, minimo):
    out, ini = [], None
    for i, v in enumerate(activo):
        if v and ini is None:
            ini = i
        elif not v and ini is not None:
            if i - ini >= minimo:
                out.append((ini, i))
            ini = None
    if ini is not None and len(activo) - ini >= minimo:
        out.append((ini, len(activo)))
    return out


def piezas(im):
    """Los diez michis, en orden de lectura."""
    a = im.getchannel('A')
    m = [[a.getpixel((x, y)) > 24 for x in range(im.width)] for y in range(im.height)]
    cajas = []
    for (y0, y1) in tramos([any(f) for f in m], 40):
        cols = [any(m[y][x] for y in range(y0, y1)) for x in range(im.width)]
        crudos = tramos(cols, MIN_ANCHO)
        anchos = sorted(x1 - x0 for x0, x1 in crudos)
        med = anchos[len(anchos) // 2]
        partidos = []
        for (x0, x1) in crudos:
            if x1 - x0 < med * JUNTOS:
                partidos.append((x0, x1))
                continue
            # Dos pegados: el vapor de uno roza las gotas del otro. Se
            # corta por la columna con menos tinta de la franja central,
            # que es lo mismo que hace `recortar_poses.py`.
            tinta = [sum(1 for y in range(y0, y1) if m[y][x]) for x in range(x0, x1)]
            a0, a1 = int((x1 - x0) * 0.33), int((x1 - x0) * 0.67)
            corte = x0 + a0 + min(range(a1 - a0), key=lambda i: tinta[a0 + i])
            partidos.append((x0, corte))
            partidos.append((corte, x1))
        for (x0, x1) in partidos:
            ys = [y for y in range(y0, y1) if any(m[y][x] for x in range(x0, x1))]
            cajas.append((x0, min(ys), x1, max(ys) + 1))
    return [im.crop(c) for c in cajas]


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
        trozos = piezas(hoja)
        if len(trozos) != len(POSES):
            raise SystemExit('%s: encontre %d michis y esperaba %d'
                             % (color, len(trozos), len(POSES)))
        print('\n%s:' % color)
        for pose, trozo in zip(POSES, trozos):
            if pose is None:
                print('  (5) descartado')
                continue
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
        print('SUBE `const CACHE` en public/sw.js: mismos nombres, contenido nuevo.')


if __name__ == '__main__':
    main()
