/* ============================================================
   MichiFit · las fotos y los vídeos del Ninja de verdad

   Ninja existe: es el gato de Alberto y vive en Bangkok. El último
   trozo de la historia lo enseña, porque saber que el gato es real
   cambia lo que la app pide de ti.

   CÓMO AÑADIR UNA FOTO O UN VÍDEO
   -------------------------------
   1. Deja el archivo en `public/ninja/`.
   2. Añádelo a la lista de abajo, con su nombre exacto.
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
  // { archivo: 'ninja-01.jpg', pie: 'Recién llegado a casa' },
  // { archivo: 'ninja-siesta.mp4', pie: 'La siesta de las cuatro' },
];

const VIDEO = /\.(mp4|webm|mov)$/i;

export const esVideo = (archivo) => VIDEO.test(archivo);
export const rutaNinja = (archivo) => `/ninja/${archivo}`;
