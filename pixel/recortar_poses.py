"""
Recorta las hojas de poses en los PNG que usa la app.

A diferencia de `recortar_hoja.py`, aquí las cajas van EXPLÍCITAS. La hoja
de dormir tiene los michis desperdigados y un título en medio, así que
ordenarlos por filas era adivinar; con las coordenadas medidas no hay
lugar a error.

Las cajas salen de detectar las manchas y anotarlas a mano una vez. Si
regeneras una hoja, vuelve a medirlas con:

    python -c "import sys;sys.path.insert(0,'.');from recortar_hoja import manchas;from PIL import Image;
               im=Image.open('../IMG/<hoja>.png').convert('RGBA');
               print([c for c,p in manchas(im) if len(p)>10000])"

Salida: public/michi/<cuerpo>_<pose>.png
"""

import os
from PIL import Image

LADO = 320

# (x0, y0, x1, y1) medidos sobre cada hoja de 903x1024
HOJAS = {
    'entrenando': {
        'archivo': '../IMG/Tipos_de_Michi_entrenando.jpg',
        # Aquí los cinco michis se TOCAN entre sí: las mancuernas de uno
        # invaden al vecino, así que forman una sola mancha y no hay
        # componentes que separar. Se cortan con COSTURAS: un camino
        # vertical que baja esquivando píxeles pintados (ver `costura`).
        # Un corte recto partía mancuernas por la mitad; la costura las
        # rodea y cada michi se queda con las suyas enteras.
        'blanco': True,
        'franja': (391, 757),
        'bordes': (26, 972),        # dónde empieza y acaba la fila entera
        'costuras': [199, 386, 578, 725],   # los cuatro valles, como pista
        'orden': ['esqueletico', 'gordo', 'kawaii', 'fit', 'hipertrofiado'],
    },
    'comiendo': {
        'archivo': '../IMG/Michis_comiendo.png',
        'cajas': {
            'esqueletico':   (27, 366, 185, 701),
            'gordo':         (158, 379, 373, 693),
            'kawaii':        (351, 387, 537, 693),
            'fit':           (514, 366, 684, 701),
            'hipertrofiado': (674, 362, 894, 702),
        },
    },
    'dormido': {
        'archivo': '../IMG/Michis_durmiendo.png',
        'cajas': {
            'esqueletico':   (82, 89, 352, 235),
            'gordo':         (480, 60, 781, 246),
            'kawaii':        (61, 381, 349, 549),
            'fit':           (70, 584, 368, 733),
            'hipertrofiado': (480, 443, 798, 657),
        },
    },
}


def sin_blanco(im, umbral=228):
    """El blanco del JPG pasa a transparente. Umbral generoso: la
    compresión deja halos y con uno estricto queda un borde sucio."""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if r > umbral and g > umbral and b > umbral:
                px[x, y] = (r, g, b, 0)
    return im


BANDA = 52     # cuánto puede apartarse la costura del valle
DESVIO = 0.6   # peaje por moverse de lado, para que no serpentee de más


def costura(mascara, x0, y0, y1, ancho, xc):
    """Camino vertical de y0 a y1 que cruza el menor número posible de
    píxeles pintados. Se resuelve con programación dinámica: cada fila
    solo puede moverse un píxel a los lados respecto de la anterior.

    Devuelve una lista con la x del corte para cada fila. Si entre dos
    michis hay hueco libre, la costura pasa por él sin tocar nada; si se
    solapan de verdad, corta por donde menos daño hace."""
    izq, der = max(0, xc - BANDA), min(ancho, xc + BANDA + 1)
    cols = list(range(izq, der))
    inf = float('inf')

    coste = [1.0 if mascara[y0][x] else 0.0 for x in cols]
    padres = []
    for y in range(y0 + 1, y1):
        nuevo, padre = [], []
        for i, x in enumerate(cols):
            mejor, de = inf, i
            for d in (-1, 0, 1):
                j = i + d
                if 0 <= j < len(cols):
                    c = coste[j] + (DESVIO if d else 0)
                    if c < mejor:
                        mejor, de = c, j
            nuevo.append(mejor + (1.0 if mascara[y][x] else 0.0))
            padre.append(de)
        coste, _ = nuevo, None
        padres.append(padre)

    i = min(range(len(cols)), key=lambda k: coste[k])
    camino = [cols[i]]
    for padre in reversed(padres):
        i = padre[i]
        camino.append(cols[i])
    camino.reverse()
    return camino


def recortar_costuras(hoja, cfg):
    """Parte una fila de michis pegados usando costuras entre cada par."""
    y0, y1 = cfg['franja']
    xa, xb = cfg['bordes']
    a = hoja.getchannel('A').load()
    ancho = hoja.width
    mascara = [[a[x, y] >= 40 for x in range(ancho)] for y in range(y1)]

    limites = [[xa] * (y1 - y0)]
    for xc in cfg['costuras']:
        limites.append(costura(mascara, 0, y0, y1, ancho, xc))
    limites.append([xb] * (y1 - y0))

    piezas = {}
    for i, cuerpo in enumerate(cfg['orden']):
        trozo = Image.new('RGBA', (ancho, y1 - y0), (0, 0, 0, 0))
        origen, destino = hoja.load(), trozo.load()
        for k in range(y1 - y0):
            for x in range(limites[i][k], limites[i + 1][k]):
                if mascara[y0 + k][x]:
                    destino[x, k] = origen[x, y0 + k]
        caja = trozo.getbbox()
        piezas[cuerpo] = trozo.crop(caja) if caja else trozo
    return piezas


def recortar(hoja, caja):
    """Recorta la caja y borra lo que se cuele de un michi vecino: las
    cajas se solapan, así que se limpian los píxeles que no pertenecen a
    la mancha conexa más grande del recorte."""
    trozo = hoja.crop(caja).copy()
    a = trozo.getchannel('A').load()
    w, h = trozo.size
    visto = [[False] * w for _ in range(h)]
    mejor, mejor_n = None, 0
    for y0 in range(h):
        for x0 in range(w):
            if visto[y0][x0] or a[x0, y0] < 40:
                continue
            pila, puntos = [(x0, y0)], []
            visto[y0][x0] = True
            while pila:
                x, y = pila.pop()
                puntos.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not visto[ny][nx] and a[nx, ny] >= 40:
                        visto[ny][nx] = True
                        pila.append((nx, ny))
            if len(puntos) > mejor_n:
                mejor, mejor_n = puntos, len(puntos)

    limpio = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    origen, destino = trozo.load(), limpio.load()
    for x, y in mejor or []:
        destino[x, y] = origen[x, y]
    recorte = limpio.getbbox()
    return limpio.crop(recorte) if recorte else limpio


def encuadrar(im, lado=LADO):
    """Cuadrado, centrado y apoyado abajo. Los michis dormidos son
    apaisados y quedan naturalmente más bajos, que es lo suyo."""
    escala = min(lado / im.width, lado / im.height) * 0.96
    im = im.resize((max(1, int(im.width * escala)), max(1, int(im.height * escala))), Image.NEAREST)
    lienzo = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    lienzo.paste(im, ((lado - im.width) // 2, lado - im.height), im)
    return lienzo


def comprimir(im, ruta, colores=96):
    alfa = im.getchannel('A')
    q = im.convert('RGB').quantize(colors=colores, method=Image.MEDIANCUT).convert('RGBA')
    q.putalpha(alfa)
    q.quantize(colors=colores).save(ruta, optimize=True)

if __name__ == '__main__':
    aqui = os.path.dirname(os.path.abspath(__file__))
    destino = os.path.join(aqui, '..', 'public', 'michi')
    os.makedirs(destino, exist_ok=True)

    for pose, cfg in HOJAS.items():
        hoja = Image.open(os.path.join(aqui, cfg['archivo'])).convert('RGBA')
        if cfg.get('blanco'):
            hoja = sin_blanco(hoja)
        print(f"\n{pose}:")
        piezas = (recortar_costuras(hoja, cfg) if 'costuras' in cfg
                  else {c: recortar(hoja, k) for c, k in cfg['cajas'].items()})
        for cuerpo, pieza in piezas.items():
            ruta = os.path.join(destino, f'{cuerpo}_{pose}.png')
            comprimir(encuadrar(pieza), ruta)
            print(f"  {cuerpo}_{pose}.png  {os.path.getsize(ruta) // 1024} KB")
