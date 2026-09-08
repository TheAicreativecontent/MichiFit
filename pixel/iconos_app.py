"""
Iconos de la app (PWA) a partir del logo de Alberto.

Dos familias, porque Android las trata distinto:
  icono-<n>.png       el logo tal cual, sobre transparente
  icono-mask-<n>.png  "maskable": el sistema recorta un circulo, asi que
                      el dibujo va encogido dentro de un fondo de color.
                      Sin esto, Android corta las orejas del michi.

Salida: public/iconos-app/
"""

import os
from PIL import Image

ORIGEN = '../../2026_APP_MICHIFIT/IMG/Logo_MichiFitl.png'
TAMANOS = [192, 512]
ZONA_SEGURA = 0.78             # el circulo que Android respeta


def recortado():
    im = Image.open(os.path.join(AQUI, ORIGEN)).convert('RGBA')
    return im.crop(im.getbbox())


def color_marco(im):
    """El naranja del panel del logo. El maskable se rellena con EL, no
    con el crema del fondo: el logo ya trae su marco redondeado, y
    cualquier otro color se ve como un halo al recortar el circulo.

    Se muestrea DENTRO del panel, no en el borde: el contorno del logo es
    un naranja mas claro y usarlo dejaba un marco visible."""
    px = im.convert('RGBA').load()
    return px[int(im.width * 0.10), im.height // 2]


def cuadrado(im, lado, margen=1.0, fondo=(0, 0, 0, 0)):
    util = int(lado * margen)
    escala = min(util / im.width, util / im.height)
    ancho, alto = max(1, round(im.width * escala)), max(1, round(im.height * escala))
    pequeno = im.resize((ancho, alto), Image.LANCZOS)
    lienzo = Image.new('RGBA', (lado, lado), fondo)
    lienzo.paste(pequeno, ((lado - ancho) // 2, (lado - alto) // 2), pequeno)
    return lienzo


def comprimir(im, ruta, colores=128):
    """Paleta de 128 colores: el logo es plano y no se nota, pero un PNG
    de 512 pasa de 300 KB a menos de 40."""
    alfa = im.getchannel('A')
    q = im.convert('RGB').quantize(colors=colores, method=Image.MEDIANCUT).convert('RGBA')
    q.putalpha(alfa)
    q.save(ruta, optimize=True)


if __name__ == '__main__':
    AQUI = os.path.dirname(os.path.abspath(__file__))
    destino = os.path.join(AQUI, '..', 'public', 'iconos-app')
    os.makedirs(destino, exist_ok=True)
    logo = recortado()

    for n in TAMANOS:
        for nombre, im in (
            (f'icono-{n}.png', cuadrado(logo, n)),
            (f'icono-mask-{n}.png', cuadrado(logo, n, ZONA_SEGURA, color_marco(logo))),
        ):
            ruta = os.path.join(destino, nombre)
            comprimir(im, ruta)
            print(f'  {nombre}  {os.path.getsize(ruta) // 1024} KB')

    # favicon: 32 px basta y pesa nada
    ruta = os.path.join(AQUI, '..', 'public', 'favicon.png')
    comprimir(cuadrado(logo, 32), ruta, 64)
    print(f'  favicon.png  {os.path.getsize(ruta)} B')
