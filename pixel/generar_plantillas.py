"""
Plantillas para dibujar los PNG de MichiFit.

Genera dos archivos guía con las medidas exactas que espera la app:

  plantilla-huevo.png  660x900 · la carcasa del tamagotchi
  plantilla-michi.png  360x360 · un michi, el que va dentro de la pantalla

Ábrelos en tu editor, dibuja ENCIMA en una capa nueva, borra la capa de
la plantilla y exporta en PNG con transparencia.

Las medidas salen de la geometría del componente (viewBox 220x300 a
escala 3), así que si aquí cuadra, en la app cuadra.
"""

from PIL import Image, ImageDraw, ImageFont

ESCALA = 3
GUIA = (255, 0, 128, 190)
GUIA_SUAVE = (255, 0, 128, 70)
TEXTO = (60, 40, 55, 255)
CUADRICULA = (0, 0, 0, 26)

# Geometría del componente (viewBox 220x300), en unidades SVG
PANT = {"x": 46, "y": 66, "w": 128, "h": 162}
BANDA_ALTA, BANDA_BAJA = 16, 19


def fuente(tam):
    for nombre in ("arial.ttf", "segoeui.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(nombre, tam)
        except OSError:
            continue
    return ImageFont.load_default()


def cuadricula(d, w, h, paso=30):
    for x in range(0, w, paso):
        d.line([(x, 0), (x, h)], fill=CUADRICULA)
    for y in range(0, h, paso):
        d.line([(0, y), (w, y)], fill=CUADRICULA)


def plantilla_huevo():
    w, h = 220 * ESCALA, 300 * ESCALA
    im = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    cuadricula(d, w, h)
    f, fp = fuente(20), fuente(15)

    # silueta de la carcasa
    cx, cy, rx, ry = 110 * ESCALA, 160 * ESCALA, 99 * ESCALA, 138 * ESCALA
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=GUIA, width=3)

    # hueco de la pantalla: AQUI va el michi, debe quedar transparente
    px, py = PANT["x"] * ESCALA, PANT["y"] * ESCALA
    pw, ph = PANT["w"] * ESCALA, PANT["h"] * ESCALA
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=8 * ESCALA,
                        outline=GUIA, width=4)
    d.rectangle([px, py, px + pw, py + BANDA_ALTA * ESCALA], outline=GUIA_SUAVE, width=2)
    d.rectangle([px, py + ph - BANDA_BAJA * ESCALA, px + pw, py + ph],
                outline=GUIA_SUAVE, width=2)

    # botones
    for bx in (78, 110, 142):
        b, r = bx * ESCALA, 15 * ESCALA
        d.ellipse([b - r, 258 * ESCALA - r * 0.93, b + r, 258 * ESCALA + r * 0.93],
                  outline=GUIA, width=3)

    # anilla
    d.ellipse([103 * ESCALA, 17 * ESCALA, 117 * ESCALA, 31 * ESCALA], outline=GUIA, width=3)

    d.text((14, 12), "PLANTILLA · carcasa del tamagotchi  660 x 900 px", font=f, fill=TEXTO)
    d.text((px + 8, py + 26 * ESCALA),
           f"HUECO DE PANTALLA\n{pw} x {ph} px\nDEJAR TRANSPARENTE\n(aquí se pinta el michi)",
           font=fp, fill=TEXTO)
    d.text((14, h - 74),
           "· PNG con transparencia alrededor de la carcasa\n"
           "· El hueco de pantalla también transparente\n"
           "· Guardar como  public/michi/huevo.png",
           font=fp, fill=TEXTO)
    im.save("plantilla-huevo.png")
    return pw, ph


def plantilla_michi():
    lado = 360
    im = Image.new("RGBA", (lado, lado), (255, 255, 255, 0))
    d = ImageDraw.Draw(im)
    cuadricula(d, lado, lado, paso=lado // 32)  # una casilla = un píxel del michi
    f, fp = fuente(18), fuente(13)

    margen = lado // 32
    d.rectangle([margen, margen, lado - margen, lado - margen], outline=GUIA, width=3)
    d.line([(lado // 2, 0), (lado // 2, lado)], fill=GUIA_SUAVE, width=2)
    d.line([(0, lado - margen * 3), (lado, lado - margen * 3)], fill=GUIA_SUAVE, width=2)

    d.text((10, 8), "PLANTILLA · michi  360 x 360 px", font=f, fill=TEXTO)
    d.text((14, 40),
           "· La cuadrícula es de 32 x 32: una casilla = un píxel\n"
           "  del michi. Dibuja pegado a ella y se verá retro.\n"
           "· La línea de abajo es el suelo: apoya ahí las patas.\n"
           "· Fondo transparente.",
           font=fp, fill=TEXTO)
    im.save("plantilla-michi.png")
    return lado


if __name__ == "__main__":
    pw, ph = plantilla_huevo()
    lado = plantilla_michi()
    print(f"plantilla-huevo.png  660x900 · hueco de pantalla {pw}x{ph}")
    print(f"plantilla-michi.png  {lado}x{lado}")
