/* ============================================================
   Michis en pixel art · 32x32 a color
   GENERADO por pixel/generar_michis.py — no editar a mano.

   Cada sprite son 32 cadenas de 32 caracteres. Cada carácter es un
   color de PALETA; '.' es transparente.

   ----------------------------------------------------------------
   AVISO (2026-09-12): ESTO YA NO SE DIBUJA EN NINGUNA PANTALLA.

   `MICHIS` son las CINCO SILUETAS DE CUERPO —esqueletico, gordo,
   kawaii, fit, hipertrofiado— que se retiraron el 2026-09-09, cuando el
   michi dejo de reflejar tu cuerpo y paso a reflejar tu constancia
   (`MECANICA.md` 5). Varias personas dijeron lo mismo sin ponerse de
   acuerdo: no querian identificarse con un cuerpo grande ni con uno
   pequeño.

   Lo unico que importa hoy de este archivo son `PALETA` y `TAM`, que
   usa la carcasa SVG. El sprite se quedo colgando de una rama que ya no
   se recorre: `Tamagotchi.jsx` hace `MICHIS[estado] ?? MICHIS.kawaii`,
   pero solo lo DIBUJA si `!sinMichi` — y su unico llamante, el respaldo
   de `TamagotchiPNG.jsx` para cuando falta el PNG del huevo, pasa
   siempre `sinMichi`. O sea que la tabla se lee y no se pinta nunca.

   No se borra porque son los dibujos originales del proyecto y hay que
   decidirlo mirandolos, no de pasada. Esta anotado en `TODO.md`.

   Y OJO CON EL NOMBRE: este `MICHIS` son CUERPOS. El `COLORES_MICHI` de
   `mascota/TamagotchiPNG.jsx` son los tres COLORES de pelaje (naranja,
   gris, blanco), que es lo vivo. Hasta el 2026-09-12 los dos se
   llamaban `MICHIS`.
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

export const MICHIS = {
  esqueletico: [
    '......oo................oo......',
    '.....onno..............onno.....',
    '.....orrro............orrro.....',
    '.....orrrro..........orrrro.....',
    '.....onnnnnoooooooooonnnnno.....',
    '....onnnnnnNNNnnNNNnnNNNnnno....',
    '....onnnnkwwknnnnnnkwwknnnno....',
    '....onnnnkwkknnnnnnkwkknnnno....',
    '....onnnnkkkknnnnnnkkkknnnno....',
    '....orrrnnkkknnnnnnkkknnrrro....',
    '....orrrnnnnnnnnnnnnnnnnrrro....',
    '....onrrnnnncccrrcccnnnnrrno....',
    '.....onnnnnnncoccocnnnnnnno.....',
    '......oonnnnnncoocnnnnnnoo......',
    '........ooooonnccnnooooo........',
    '.............onnnno.............',
    '..............onno..............',
    '.............onnnno.............',
    '..........o.onnnnnno.o..........',
    '..........o.oooooooo.o..........',
    '..........o.onnnnnno.o..........',
    '..........o.oooooooo.o..........',
    '............onccccno............',
    '............ooccccoo...ooo......',
    '............onnnnnno..ooo.......',
    '............onnnnnnnooo.........',
    '............onnoonno............',
    '...........oooo..oooo...........',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  gordo: [
    '......oo................oo......',
    '.....onno..............onno.....',
    '.....orrro............orrro.....',
    '.....orrrro..........orrrro.....',
    '.....onnnnnoooooooooonnnnno.....',
    '....onnnnnnNNNnnNNNnnNNNnnno....',
    '....onnnnkwwknnnnnnkwwknnnno....',
    '....onnnnkwkknnnnnnkwkknnnno....',
    '....onnnnkkkknnnnnnkkkknnnno....',
    '....orrrnnkkknnnnnnkkknnrrro....',
    '....orrrnnnnnnnnnnnnnnnnrrro....',
    '....onrrnnnncccrrcccnnnnrrno....',
    '.....onnnnnnncoccocnnnnnnno.....',
    '......oonnnnnncoocnnnnnnoo......',
    '........ooooonnccnnooooo........',
    '.............onnnno.............',
    '...........oonnnnnnoo...........',
    '.........oonnnnnnnnnnoo.........',
    '.......oonnnnnnnnnnnnnnoo.......',
    '.....ooNNNNnnnnnnnnnnnNNNNo.....',
    '....onnnnnnccccccccccnnnnnno....',
    '....onNNNNnccccccccccnnNNNNo....',
    '....onnnnnnccccccccccnnnnnnnooo.',
    '.....oonnnnnccccccccnnnnnnnnoo..',
    '.......oonnnnccccccnnnnooooo....',
    '.........onnnnnnnnnnnno.........',
    '..........onnnoooonnno..........',
    '.........ooooo....ooooo.........',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  kawaii: [
    '......oo................oo......',
    '.....onno..............onno.....',
    '.....orrro............orrro.....',
    '.....orrrro..........orrrro.....',
    '.....onnnnnoooooooooonnnnno.....',
    '....onnnnnnNNNnnNNNnnNNNnnno....',
    '....onnnnkwwknnnnnnkwwknnnno....',
    '....onnnnkwkknnnnnnkwkknnnno....',
    '....onnnnkkkknnnnnnkkkknnnno....',
    '....orrrnnkkknnnnnnkkknnrrro....',
    '....orrrnnnnnnnnnnnnnnnnrrro....',
    '....onrrnnnncccrrcccnnnnrrno....',
    '.....onnnnnnncoccocnnnnnnno.....',
    '......oonnnnnncoocnnnnnnoo......',
    '........ooooonnccnnooooo........',
    '.............onnnno.............',
    '...........oonnnnnnoo...........',
    '..........onnnnnnnnnno..........',
    '.........onNNNnnnnnNNNo.........',
    '.........onnnnnnnnnnnno.........',
    '.........onNNccccccNNNo.........',
    '.........onnnccccccnnno.........',
    '.........onnnccccccnnno..oo.....',
    '..........onnnccccnnno...ono....',
    '..........onnnnnnnnnno..ooo.....',
    '..........onnnnnnnnnnnooo.......',
    '..........onnnoooonnno..........',
    '.........ooooo....ooooo.........',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  fit: [
    '......oo................oo......',
    '.....onno..............onno.....',
    '.....orrro............orrro.....',
    '.....orrrro..........orrrro.....',
    '.....onnnnnoooooooooonnnnno.....',
    '....onnnnnnNNNnnNNNnnNNNnnno....',
    '....onnnnkwwknnnnnnkwwknnnno....',
    '....onnnnkwkknnnnnnkwkknnnno....',
    '....onnnnkkkknnnnnnkkkknnnno....',
    '....orrrnnkkknnnnnnkkknnrrro....',
    '....orrrnnnnnnnnnnnnnnnnrrro....',
    '....onrrnnnncccrrcccnnnnrrno....',
    '.....onnnnnnncoccocnnnnnnno.....',
    '......oonnnnnncoocnnnnnnoo......',
    '........ooooonnccnnooooo........',
    '.............onnnno.............',
    '...........oonnnnnnoo...........',
    '..........onnnnnnnnnno..........',
    '......oo.onNNNnnnnnNNNo.oo......',
    '......oo.onnnnccccnnnno.oo......',
    '......oo.onnnnccccnnnno.oo......',
    '..........onnnccccnnno..........',
    '...........onnccccnno...........',
    '...........onnnnnnnno....ooo....',
    '..........onNNNnnnNNNo..ooo.....',
    '..........onnnnnnnnnnnooo.......',
    '..........onnnoooonnno..........',
    '.........ooooo....ooooo.........',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
  hipertrofiado: [
    '......oo................oo......',
    '.....onno..............onno.....',
    '.....orrro............orrro.....',
    '.....orrrro..........orrrro.....',
    '.....onnnnnoooooooooonnnnno.....',
    '....onnnnnnNNNnnNNNnnNNNnnno....',
    '....onnnnkwwknnnnnnkwwknnnno....',
    '....onnnnkwkknnnnnnkwkknnnno....',
    '....onnnnkkkknnnnnnkkkknnnno....',
    '....orrrnnkkknnnnnnkkknnrrro....',
    '....orrrnnnnnnnnnnnnnnnnrrro....',
    '....onrrnnnncccrrcccnnnnrrno....',
    '.....onnnnnnncoccocnnnnnnno.....',
    '......oonnnnnncoocnnnnnnoo......',
    '........ooooonnccnnooooo........',
    '.............onnnno.............',
    '...........oonnnnnnoo...........',
    '..........onnnnnnnnnno..........',
    '....oooooonnnnnnnnnnnnoooooo....',
    '...onNNnnnnnnnccccnnnnnnnnNNo...',
    '...onnnnnonnnnccccnnnnonnnnno...',
    '....oNNno.onnnccccnnno.onnNN....',
    '.....oooo..onnnnnnnno..oooo.....',
    '...........onnnnnnnno...........',
    '..........onNNNnnnNNNo..ooo.....',
    '..........onnnnnnnnnnnooo.......',
    '..........onnnoooonnno..........',
    '.........ooooo....ooooo.........',
    '................................',
    '................................',
    '................................',
    '................................',
  ],
};
