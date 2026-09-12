# -*- coding: utf-8 -*-
"""Los ocho iconos de los anillos del aparato, dibujados pixel a pixel.

POR QUE A MANO Y NO GENERADOS
-----------------------------
Se ven a 12 px. A ese tamano no hay estilo, hay SILUETA: unos 144
pixeles encendidos o apagados, y que se entienda de un vistazo depende
de cuales. Un generador de imagenes da «estilo pixel art» precioso a
1024 px que al bajarlo a 12 se convierte en una mancha. Esto no se pide,
se coloca.

Cada icono se dibuja en una rejilla de 12x12 escrita en texto, asi que
se edita con cualquier editor y se ve en el propio codigo lo que vas a
obtener. Se exportan a 96x96 (8x, sin suavizado) para que el archivo
aguante si algun dia el aparato se ve mas grande: 96 baja a 12 en
proporcion exacta y no se emborrona nada.

Reglas que sostienen que se lean a ese tamano:
  - TODO lleva contorno oscuro. Sin el, sobre el fondo claro del anillo
    los colores flojos desaparecen.
  - Nada de detalle interior. Lo que a 12 px parece un adorno, a 12 px
    es ruido — es la misma leccion que esta en LESSONS.md con los
    sprites del michi.
  - Formas gordas y centradas. Una linea de un pixel se pierde.

UN DIBUJO A MANO MANDA SOBRE LA REJILLA. Deja el PNG en
`pixel/iconos-a-mano/<nombre>.png` y ese se usa en vez de la rejilla,
ampliado a 96 con NEAREST. El lado tiene que ser divisor entero de 96
(12, 16, 24, 32, 48, 96) para que no se invente ni un pixel.

Asi se puede dibujar un icono fuera, con mas detalle del que cabe en
12x12, sin que el siguiente que lance el script se lo cargue. La escoba
de `limpiar` es el primero: aqui abajo esta escrita como un cubo porque
a 12 px no cabia, y a 16 si cabe.

Uso:  python pixel/iconos_anillo.py            genera los ocho
      python pixel/iconos_anillo.py --hoja     ademas, una hoja de
                                               contacto ampliada para
                                               revisarlos a ojo
"""
import os
import sys

from PIL import Image

LADO = 12          # la rejilla de verdad: lo que se ve en el aparato
ESCALA = 8         # 12 x 8 = 96 px de archivo
DESTINO = "public/iconos-anillo"

# La paleta de la app. `.` es transparente y `#` el contorno de siempre.
COLORES = {
    "#": (58, 45, 36, 255),      # tinta, el contorno de todo
    ".": (0, 0, 0, 0),
    "R": (232, 84, 58, 255),     # rojo del corazon, el de los mimos
    "r": (255, 138, 120, 255),   # su brillo
    "A": (62, 139, 216, 255),    # azul del agua, el de la barra WATER
    "a": (150, 205, 245, 255),
    "M": (200, 154, 91, 255),    # madera del palo de la escoba
    "P": (232, 200, 106, 255),   # paja
    "C": (250, 246, 236, 255),   # la comida que lleva dentro
    "c": (224, 140, 74, 255),    # el cuenco
    "G": (107, 107, 107, 255),   # hierro de la mancuerna
    "g": (160, 160, 160, 255),
    "H": (138, 106, 79, 255),    # huellas
    "V": (123, 174, 92, 255),     # verde del cubo, el de la barra CLEAN
    "L": (255, 217, 122, 255),   # luna
}

# Cada icono, 12 filas de 12 caracteres. Los nombres son los `id`
# de `mascota/anillos.js`, para que enchufarlos sea directo.
ICONOS = {
    "mimar": [
        "............",
        "..##..##....",
        ".#rr##rr#...",
        "#rRRRRRRR#..",
        "#RRRRRRRR#..",
        "#RRRRRRRR#..",
        ".#RRRRRR#...",
        "..#RRRR#....",
        "...#RR#.....",
        "....##......",
        "............",
        "............",
    ],
    # Gota, centrada y simetrica. La primera estaba pegada a la
    # izquierda y con el pico torcido.
    "agua": [
        "............",
        ".....##.....",
        ".....##.....",
        "....#aa#....",
        "....#aA#....",
        "...#aAAA#...",
        "..#AAAAAA#..",
        "..#AAAAAA#..",
        "..#AAAAAA#..",
        "...#AAAA#...",
        "....####....",
        "............",
    ],
    # Un CUBO, no una escoba. Lo intente tres veces: con el palo en
    # diagonal desaparecia (un pixel de ancho), y recto y gordo el
    # resultado se leia como un triangulo, una tienda de campana o una
    # lampara. A 12 px una escoba no cabe.
    #
    # Y verde, no azul, aunque un cubo lleve agua: el icono del AGUA
    # esta justo al lado en el mismo anillo y dos manchas azules juntas
    # no se distinguen. El verde ademas es el de la barra CLEAN.
    "limpiar": [
        "............",
        "............",
        ".##########.",
        ".#CCCCCCCC#.",
        ".#VVVVVVVV#.",
        ".#VVVVVVVV#.",
        "..#VVVVVV#..",
        "..#VVVVVV#..",
        "...######...",
        "............",
        "............",
        "............",
    ],
    # El CUENCO va en naranja y la comida en crema, no al reves: con
    # el cuenco casi blanco sobre el fondo claro del anillo no se veia
    # nada. Y la comida encima y no chispas al lado, que con el cuenco
    # debajo parecian los ojos de una cara.
    "comida": [
        "............",
        "............",
        "....####....",
        "..##CCCC##..",
        ".#CCCCCCCC#.",
        "#cccccccccc#",
        "#cccccccccc#",
        ".#cccccccc#.",
        "..#cccccc#..",
        "...######...",
        "............",
        "............",
    ],
    "entreno": [
        "............",
        "............",
        "............",
        ".##......##.",
        "#gG#....#Gg#",
        "#gG######Gg#",
        "#gG#GGGG#Gg#",
        "#gG######Gg#",
        "#gG#....#Gg#",
        ".##......##.",
        "............",
        "............",
    ],
    "pasos": [
        "............",
        "..##..##....",
        ".#HH##HH#...",
        ".#HH##HH#...",
        "..##..##....",
        ".#HHHHHH#...",
        "#HHHHHHHH#..",
        "#HHHHHHHH#..",
        ".#HHHHHH#...",
        "..######....",
        "............",
        "............",
    ],
    "sueno": [
        "............",
        "....####....",
        "..##LLLL#...",
        ".#LLLL##....",
        ".#LLL#......",
        "#LLL#.......",
        "#LLL#.......",
        ".#LLL#......",
        ".#LLLL##....",
        "..##LLLL#...",
        "....####....",
        "............",
    ],
    # MACIZA. La primera version era una equis hecha de contorno hueco:
    # ampliada se entendia, y a 12 px era una mancha con agujeros.
    # DORMIR: apagar la pantalla y que se eche a dormir. NO es lo mismo
    # que "sueno", que es apuntar las horas que dormiste — ese es la
    # luna. Idea de Alberto: tres Z de tamano creciente.
    #
    # Van en DIAGONAL y no en fila. En fila, tres Z de 3, 4 y 5 px de
    # ancho suman 12 sin un solo hueco entre ellas y se leen como una
    # reja. En diagonal se usa la caja entera, y ademas es como se ha
    # dibujado siempre el sueno en una vineta: subiendo.
    #
    # Solidas en tinta, sin relleno de color, que es la excepcion a la
    # regla del contorno: a 3 px de ancho no cabe contorno MAS relleno,
    # y una letra oscura sobre el fondo claro del anillo ya tiene todo
    # el contraste que necesita. Lo que la hace legible es la forma de
    # la letra, no el color.
    "dormir": [
        ".......#####",
        "..........#.",
        ".........#..",
        "........#...",
        ".......#####",
        "...####.....",
        ".....#......",
        "....#.......",
        "...####.....",
        "###.........",
        ".#..........",
        "###.........",
    ],
    "salir": [
        "............",
        "............",
        ".##......##.",
        ".###....###.",
        "..###..###..",
        "...######...",
        "....####....",
        "...######...",
        "..###..###..",
        ".###....###.",
        ".##......##.",
        "............",
    ],
}


def dibujar(mapa):
    """Convierte la rejilla de texto en una imagen de LADO x LADO."""
    im = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    px = im.load()
    for y, fila in enumerate(mapa):
        if len(fila) != LADO:
            raise SystemExit("una fila mide %d y no %d: %r" % (len(fila), LADO, fila))
        for x, c in enumerate(fila):
            if c not in COLORES:
                raise SystemExit("color desconocido %r" % c)
            px[x, y] = COLORES[c]
    return im


def hojaDeContacto(imagenes, escala=24):
    """Todos juntos: arriba MUY ampliados, abajo al tamano de verdad.

    Las dos filas hacen falta y por razones distintas. Ampliado se ve
    que pixel esta mal puesto; a tamano real se ve si el icono SE
    ENTIENDE, que no es lo mismo. La equis de la primera version se leia
    perfectamente ampliada y a 12 px era una mancha con agujeros.

    Es la leccion de los michis: los dos fallos que llegaron a
    produccion eran invisibles a tamano real... y este es el caso
    contrario. Hay que mirar las dos."""
    grande = LADO * escala
    alto = grande + LADO * 4 + 24
    hoja = Image.new("RGBA", (grande * len(imagenes), alto), (253, 241, 228, 255))
    for i, (nombre, im) in enumerate(imagenes.items()):
        hoja.paste(im.resize((grande, grande), Image.NEAREST), (i * grande, 0))
        # y el mismo icono a tamano real, centrado bajo el grande
        real = im.resize((LADO * 2, LADO * 2), Image.NEAREST)
        hoja.paste(real, (i * grande + grande // 2 - LADO, grande + 12), real)
    return hoja


A_MANO = "pixel/iconos-a-mano"


def dibujoAMano(nombre):
    """El dibujo a mano de `nombre`, si lo hay, ya a 96x96. Si no, None.

    Manda SIEMPRE sobre la rejilla de texto. Que un icono este aqui no
    es una excepcion ni un parche: es que alguien lo ha dibujado mejor
    de lo que cabe en 12x12, y eso gana.

    El primero fue la escoba. Aqui abajo esta escrita como un CUBO,
    porque a 12 px el palo en diagonal desaparecia; Alberto la dibujo a
    16 y a 16 si cabe. La rejilla del cubo se deja donde esta a
    proposito: documenta por que se intento, y vuelve sola si algun dia
    se borra el dibujo.

    La primera version de esta guarda comparaba FECHAS —si el PNG es mas
    nuevo que el script, no lo toques— copiando lo que hace
    `tenir_michi.py`. Alli vale porque hay un archivo original con el que
    comparar; aqui el original es el propio script, asi que EDITARLO
    desprotegia todos los dibujos de golpe. Se cargo la escoba a los dos
    minutos de escribirla. Y ademas un `git checkout` reescribe las
    fechas, o sea que en una maquina recien clonada no habria protegido
    nada. Una carpeta se ve, se puede mirar, y sobrevive a git.

    El lado tiene que ser divisor o multiplo ENTERO de 96 (12, 16, 24,
    32, 48, 96): se amplia con NEAREST, sin inventar un solo pixel.
    """
    ruta = os.path.join(A_MANO, nombre + ".png")
    if not os.path.exists(ruta):
        return None
    im = Image.open(ruta).convert("RGBA")
    lado = im.size[0]
    destino = LADO * ESCALA          # 96
    if im.size[0] != im.size[1] or destino % lado:
        raise SystemExit(
            "%s mide %dx%d, y tiene que ser cuadrado y con el lado divisor "
            "de %d (12, 16, 24, 32, 48, 96)" % (ruta, im.size[0], im.size[1], destino))
    return im.resize((destino, destino), Image.NEAREST)


def main():
    os.makedirs(DESTINO, exist_ok=True)
    hechos = {}
    respetados = 0
    for nombre, mapa in ICONOS.items():
        if len(mapa) != LADO:
            raise SystemExit("%s tiene %d filas y no %d" % (nombre, len(mapa), LADO))
        ruta = os.path.join(DESTINO, nombre + ".png")

        aMano = dibujoAMano(nombre)
        if aMano is not None:
            respetados += 1
            hechos[nombre] = aMano
            aMano.save(ruta, optimize=True)
            print("  %-11s   dibujado a mano en %s/" % (nombre, A_MANO))
            continue

        im = dibujar(mapa)
        hechos[nombre] = im
        im.resize((LADO * ESCALA, LADO * ESCALA), Image.NEAREST).save(ruta, optimize=True)
        llenos = sum(1 for f in mapa for c in f if c != ".")
        print("  %-11s %4d px encendidos de %d   %.1f kB"
              % (nombre, llenos, LADO * LADO, os.path.getsize(ruta) / 1024))

    if "--hoja" in sys.argv:
        # En `pixel/` y no en `public/`: es para revisarla, no para
        # servirla. En public se publicaria con la app.
        ruta = os.path.join("pixel", "_iconos_revisar.png")
        hojaDeContacto(hechos).save(ruta)
        print("\nhoja de contacto en %s" % ruta)

    print("\n%d iconos en %s/ (%dx%d, se ven a %d)"
          % (len(hechos), DESTINO, LADO * ESCALA, LADO * ESCALA, LADO))


if __name__ == "__main__":
    main()
