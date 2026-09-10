/* ============================================================
   MichiFit · las fotos y los vídeos del Ninja de verdad

   Ninja existe: es el gato de Alberto y vive en Bangkok. El último
   trozo de la historia lo enseña, porque saber que el gato es real
   cambia lo que la app pide de ti.

   CÓMO AÑADIR UNA FOTO O UN VÍDEO
   -------------------------------
   1. Deja el archivo en `public/ninja/`.
   2. Añádelo a la lista de abajo, con su nombre exacto.
   3. Sube `const CACHE` en `public/sw.js` — estas imágenes NO llevan
      hash en el nombre, así que sin eso quien ya tenga la app
      instalada no las vería. `node pruebas/cache-sw.mjs` avisa.

   No hace falta tocar nada más: si la lista está vacía, la sección
   entera no se pinta y la historia acaba igual de bien.

   Por qué una lista escrita a mano y no leer la carpeta: la app se
   sirve como archivos estáticos, sin servidor que pueda listar un
   directorio. Un manifiesto es la forma honesta de hacerlo.

   Formatos: `.png`, `.jpg` y `.webp` para foto; `.mp4` para vídeo.
   Que no pesen mucho — esto se abre en móviles y a veces con datos.
   ============================================================ */

export const NINJA = [
  // { archivo: 'ninja-01.jpg', pie: 'Recién llegado a casa' },
  // { archivo: 'ninja-siesta.mp4', pie: 'La siesta de las cuatro' },
];

const VIDEO = /\.(mp4|webm|mov)$/i;

export const esVideo = (archivo) => VIDEO.test(archivo);
export const rutaNinja = (archivo) => `/ninja/${archivo}`;
