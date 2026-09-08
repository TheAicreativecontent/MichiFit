"""
Michis en pixel art a color, 32x32, para la pantalla del tamagotchi.

Se dibuja la silueta por bandas (start, end) por fila, y a partir de ahi el
contorno se calcula solo: todo pixel relleno que toca el vacio pasa a ser
contorno. Encima se pintan barriga, hocico, rayas, ojos y mofletes.

Asi las cinco formas comparten cabeza y expresion, y solo cambia el cuerpo:
se lee como el mismo gato en distintas formas fisicas, no como cinco gatos.

Salida: PNG por estado, hoja de contactos y michis.js (los sprites como datos).
"""

from PIL import Image

W = H = 32
ESCALA = 12

# Paleta: naranja atigrado del logo de MichiFit
PALETA = {
    '.': None,              # transparente
    'o': (74, 44, 26),      # contorno
    'n': (245, 146, 62),    # naranja
    'N': (214, 112, 42),    # naranja oscuro (rayas y sombra)
    'c': (255, 243, 224),   # crema (hocico, barriga, patas)
    'r': (255, 155, 176),   # rosa (nariz, mofletes, orejas)
    'k': (58, 38, 32),      # ojos
    'w': (255, 255, 255),   # brillo del ojo
}

# ---------------------------------------------------------------- cabeza comun
CABEZA = [
    (0, 6, 7), (0, 24, 25),
    (1, 5, 8), (1, 23, 26),
    (2, 5, 9), (2, 22, 26),
    (3, 5, 10), (3, 21, 26),
    (4, 5, 26),
    (5, 4, 27), (6, 4, 27), (7, 4, 27), (8, 4, 27),
    (9, 4, 27), (10, 4, 27), (11, 4, 27),
    (12, 5, 26), (13, 6, 25), (14, 8, 23),
    (15, 13, 18),
]

# ------------------------------------------------------------------- cuerpos
CUERPOS = {
    "kawaii": dict(
        bandas=[
            (16, 11, 20), (17, 10, 21), (18, 9, 22), (19, 9, 22),
            (20, 9, 22), (21, 9, 22), (22, 9, 22), (23, 10, 21),
            (24, 10, 21), (25, 10, 21), (26, 10, 21),
            (27, 9, 13), (27, 18, 22),
        ],
        cola=[(25, 22, 24), (24, 24, 26), (23, 25, 27), (22, 25, 26)],
        barriga=[(20, 13, 18), (21, 13, 18), (22, 13, 18), (23, 14, 17)],
        rayas=[(18, 11, 13), (20, 11, 13), (18, 19, 21), (20, 19, 21)],
    ),
    "fit": dict(
        bandas=[
            (16, 11, 20), (17, 10, 21), (18, 9, 22), (19, 9, 22),
            (20, 9, 22), (21, 10, 21), (22, 11, 20), (23, 11, 20),
            (24, 10, 21), (25, 10, 21), (26, 10, 21),
            (18, 6, 7), (19, 6, 7), (20, 6, 7),
            (18, 24, 25), (19, 24, 25), (20, 24, 25),
            (27, 9, 13), (27, 18, 22),
        ],
        cola=[(25, 22, 24), (24, 24, 26), (23, 25, 27)],
        barriga=[(19, 14, 17), (20, 14, 17), (21, 14, 17), (22, 14, 17)],
        rayas=[(18, 11, 13), (18, 19, 21), (24, 12, 14), (24, 18, 20)],
    ),
    "hipertrofiado": dict(
        bandas=[
            (16, 11, 20), (17, 10, 21), (18, 9, 22), (19, 9, 22),
            (20, 9, 22), (21, 10, 21), (22, 11, 20), (23, 11, 20),
            (24, 10, 21), (25, 10, 21), (26, 10, 21),
            (18, 4, 8), (19, 3, 8), (20, 3, 8), (21, 4, 8), (22, 5, 8),
            (18, 23, 27), (19, 23, 28), (20, 23, 28), (21, 23, 27), (22, 23, 26),
            (27, 9, 13), (27, 18, 22),
        ],
        cola=[(25, 22, 24), (24, 24, 26)],
        barriga=[(19, 14, 17), (20, 14, 17), (21, 14, 17)],
        rayas=[(19, 5, 6), (21, 5, 6), (19, 26, 27), (21, 26, 27), (24, 12, 14), (24, 18, 20)],
    ),
    "gordo": dict(
        bandas=[
            (16, 11, 20), (17, 9, 22), (18, 7, 24), (19, 5, 26),
            (20, 4, 27), (21, 4, 27), (22, 4, 27), (23, 5, 26),
            (24, 7, 24), (25, 9, 22), (26, 10, 21),
            (27, 9, 13), (27, 18, 22),
        ],
        cola=[(24, 25, 27), (23, 27, 29), (22, 28, 30)],
        barriga=[(20, 11, 20), (21, 11, 20), (22, 11, 20), (23, 12, 19), (24, 13, 18)],
        rayas=[(19, 7, 10), (21, 6, 9), (19, 22, 25), (21, 23, 26)],
    ),
    "esqueletico": dict(
        bandas=[
            (16, 14, 17), (17, 13, 18), (18, 12, 19), (19, 12, 19),
            (20, 12, 19), (21, 12, 19), (22, 12, 19), (23, 12, 19),
            (24, 12, 19), (25, 12, 19), (26, 12, 19),
            (18, 10, 10), (19, 10, 10), (20, 10, 10), (21, 10, 10),
            (18, 21, 21), (19, 21, 21), (20, 21, 21), (21, 21, 21),
            (27, 11, 14), (27, 17, 20),
        ],
        cola=[(25, 20, 22), (24, 22, 24), (23, 23, 25)],
        barriga=[(22, 14, 17), (23, 14, 17)],
        rayas=[(19, 13, 18), (21, 13, 18), (23, 13, 18)],
    ),
}

# --- cara: identica en los cinco ---
OREJA_INTERIOR = [(2, 6, 8), (3, 6, 9), (2, 23, 25), (3, 22, 25)]
RAYAS_FRENTE = [(5, 11, 13), (5, 16, 18), (5, 21, 23), (6, 12, 12), (6, 22, 22)]
HOCICO = [(11, 12, 19), (12, 13, 18), (13, 14, 17)]
OJOS = [(7, 9, 11), (8, 9, 11), (9, 9, 11), (7, 20, 22), (8, 20, 22), (9, 20, 22)]
BRILLO = [(7, 9, 9), (7, 20, 20)]
NARIZ = [(11, 15, 16)]
BOCA = [(12, 14, 14), (12, 17, 17), (13, 15, 16)]
MOFLETES = [(9, 5, 7), (10, 5, 7), (9, 24, 26), (10, 24, 26)]


def pintar(g, bandas, char):
    for fila, ini, fin in bandas:
        if 0 <= fila < H:
            for c in range(max(0, ini), min(W - 1, fin) + 1):
                g[fila][c] = char


def construir(nombre):
    cuerpo = CUERPOS[nombre]
    g = [['.'] * W for _ in range(H)]

    # 1 · silueta entera en naranja
    pintar(g, CABEZA, 'n')
    pintar(g, cuerpo["bandas"], 'n')
    pintar(g, cuerpo["cola"], 'n')

    # 2 · contorno automatico: todo relleno que toca el vacio
    solido = [[g[y][x] != '.' for x in range(W)] for y in range(H)]
    for y in range(H):
        for x in range(W):
            if not solido[y][x]:
                continue
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if not (0 <= ny < H and 0 <= nx < W) or not solido[ny][nx]:
                    g[y][x] = 'o'
                    break

    # 3 · detalle, de atras hacia delante
    pintar(g, cuerpo["rayas"], 'o' if nombre == 'esqueletico' else 'N')
    pintar(g, RAYAS_FRENTE, 'N')
    pintar(g, cuerpo["barriga"], 'c')
    pintar(g, OREJA_INTERIOR, 'r')
    pintar(g, HOCICO, 'c')
    pintar(g, MOFLETES, 'r')
    pintar(g, OJOS, 'k')
    pintar(g, BRILLO, 'w')
    pintar(g, NARIZ, 'r')
    pintar(g, BOCA, 'o')
    return g


def a_imagen(g, escala=ESCALA, fondo=(197, 214, 158)):
    im = Image.new("RGB", (W * escala, H * escala), fondo)
    px = im.load()
    for y in range(H):
        for x in range(W):
            col = PALETA[g[y][x]]
            if col is None:
                continue
            for dy in range(escala - 1):
                for dx in range(escala - 1):
                    px[x * escala + dx, y * escala + dy] = col
    return im


ORDEN = ["esqueletico", "gordo", "kawaii", "fit", "hipertrofiado"]


def exportar_js():
    lineas = ["""/* ============================================================
   Michis en pixel art · 32x32 a color
   GENERADO por pixel/generar_michis.py — no editar a mano.

   Cada sprite son 32 cadenas de 32 caracteres. Cada carácter es un
   color de PALETA; '.' es transparente.
   ============================================================ */

export const PALETA = {
  o: '#4A2C1A',  // contorno
  n: '#F5923E',  // naranja
  N: '#D6702A',  // naranja oscuro (rayas)
  c: '#FFF3E0',  // crema
  r: '#FF9BB0',  // rosa
  k: '#3A2620',  // ojos
  w: '#FFFFFF',  // brillo
};

export const TAM = 32;
export const ESTADOS = ['esqueletico', 'gordo', 'kawaii', 'fit', 'hipertrofiado'];

export const MICHIS = {"""]
    for nombre in ORDEN:
        g = construir(nombre)
        lineas.append(f"  {nombre}: [")
        for fila in g:
            lineas.append("    '" + "".join(fila) + "',")
        lineas.append("  ],")
    lineas.append("};")
    with open("michis.js", "w", encoding="utf-8") as f:
        f.write("\n".join(lineas) + "\n")


if __name__ == "__main__":
    imgs = []
    for nombre in ORDEN:
        g = construir(nombre)
        im = a_imagen(g)
        im.save(f"michi-{nombre}.png")
        imgs.append(im)

    sep = 14
    ancho = sum(i.width for i in imgs) + sep * (len(imgs) + 1)
    hoja = Image.new("RGB", (ancho, imgs[0].height + sep * 2), (197, 214, 158))
    x = sep
    for im in imgs:
        hoja.paste(im, (x, sep))
        x += im.width + sep
    hoja.save("michi-hoja.png")

    exportar_js()
    print("generados:", ", ".join(ORDEN))
