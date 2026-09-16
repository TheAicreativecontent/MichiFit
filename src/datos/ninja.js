/* ============================================================
   MichiFit · las fotos y los vídeos del Ninja de verdad

   Ninja existe: es el gato de Albert y vive en Bangkok. El último
   trozo de la historia lo enseña, porque saber que el gato es real
   cambia lo que la app pide de ti.

   QUÉ ENTRA AQUÍ: Ninja viviendo feliz. Nada más.
   -----------------------------------------------
   Decisión de Albert, 2026-09-13, y no es una cuestión de gusto: los
   vídeos del envenenamiento y del veterinario existen, y se quedan
   FUERA. Su sitio es TikTok, donde su chica ya contó esa parte y
   recibió mucho apoyo, porque ahí ese vídeo pide algo —atención,
   ayuda, rabia— y dura lo que dura la ola. Aquí no: esta pantalla es
   el final de la historia y sirve para cerrar en calma. Lo que hace
   falta es evergreen y en positivo, el gato vivo y en casa.

   Y hay una razón de mecánica: la historia YA cuenta el veneno en el
   acto 4, en texto, donde está medido. Enseñarlo además en imagen, y
   justo debajo de «duerme mucho y sigue robando comida de la mesa»,
   deshace lo que esa pantalla viene a hacer.

   Ojo además con el ENCUADRE: el repositorio es público y estas fotos
   se ven enteras. Mejor que salga Ninja y poco de alrededor.

   CÓMO AÑADIR UNA FOTO O UN VÍDEO
   -------------------------------
   1. Deja el archivo en `public/ninja/`.
   2. Añádelo a la lista de abajo, con su nombre exacto. El pie NO se
      escribe aquí: se pone una CLAVE y el texto va a `src/i18n/`, en
      las cinco lenguas, dentro de `lore.fotos`. Si no quieres pie,
      quita la clave y la foto sale sola.
      Hasta el 2026-09-13 los pies estaban escritos aquí, en castellano
      duro, y se veían igual en japonés: lo cazó Albert. Es la tercera
      vez que pasa lo mismo en este proyecto, asi que el camino corto
      -escribir el texto donde estas- ya no esta disponible.
   3. **Si es una FOTO**, sube `const CACHE` en `public/sw.js`: no
      llevan hash en el nombre, así que sin eso quien ya tenga la app
      instalada no la vería. `node pruebas/cache-sw.mjs` avisa.
      Los VÍDEOS no lo necesitan, porque no pasan por la caché nunca
      (el porqué, largo, está en `public/sw.js`). Si la prueba te lo
      reclama por haber cambiado uno, es de más: hazle caso igual, que
      subir el número no cuesta nada y no equivocarse sí.

   No hace falta tocar nada más: si la lista está vacía, la sección
   entera no se pinta y la historia acaba igual de bien.

   Por qué una lista escrita a mano y no leer la carpeta: la app se
   sirve como archivos estáticos, sin servidor que pueda listar un
   directorio. Un manifiesto es la forma honesta de hacerlo.

   Formatos: `.png`, `.jpg` y `.webp` para foto; `.mp4`, `.webm` y
   `.mov` para vídeo — `.mov` porque es lo que graba el iPhone y sería
   absurdo obligar a convertirlo. Quien decide si algo es vídeo es
   `esVideo`, aquí abajo: si algún día hace falta otro formato, se
   añade ahí y no en este comentario.

   Que no pesen mucho — esto se abre en móviles y a veces con datos, y
   un vídeo no se guarda para verlo sin cobertura: se pide a la red
   cada vez. Un `.webm` bien comprimido pesa bastante menos que el
   `.mov` que saca el teléfono.
   ============================================================ */

export const NINJA = [
  { archivo: 'Ninja_at_home_01.jpeg', clave: 'lore.fotos.enCasa' },
  { archivo: 'Ninja_at_home_02.jpeg', clave: 'lore.fotos.durmiendo' },
  { archivo: 'Ninja_at_home_03.jpeg', clave: 'lore.fotos.aGusto' },
];

const VIDEO = /\.(mp4|webm|mov)$/i;

export const esVideo = (archivo) => VIDEO.test(archivo);
export const rutaNinja = (archivo) => `/ninja/${archivo}`;
