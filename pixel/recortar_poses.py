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
        print(f"\n{pose}:")
        for cuerpo, caja in cfg['cajas'].items():
            im = encuadrar(recortar(hoja, caja))
            ruta = os.path.join(destino, f'{cuerpo}_{pose}.png')
            comprimir(im, ruta)
            print(f"  {cuerpo}_{pose}.png  {os.path.getsize(ruta) // 1024} KB")
