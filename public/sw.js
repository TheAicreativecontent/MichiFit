/* ============================================================
   MichiFit · service worker
   Lo justo para que la app se abra sin cobertura. No hay servidor ni
   cuentas: todos los datos ya viven en el dispositivo, así que basta
   con guardar los archivos de la propia app.

   Dos estrategias, y la diferencia importa:

     · el HTML va a la RED primero. Si tirara de caché, una versión nueva
       podría tardar días en llegar a quien ya tiene la app instalada.
     · todo lo demás va a la CACHÉ primero. Vite pone un hash en el
       nombre de cada archivo, así que un archivo cacheado nunca puede
       estar desfasado: si cambia, cambia su nombre.

   Escrito a mano a propósito: meter Workbox por esto serían cientos de
   kilobytes para veinte líneas de lógica.
   ============================================================ */

/* Subir este número al cambiar una imagen que NO lleva hash en el
   nombre —todo lo de /michi y /fondos—, o quien ya tenga la app
   seguirá viendo la vieja: la caché va primero y la URL no cambia.
   Los archivos de /assets sí llevan hash y se apañan solos.

   Ya pasó, y esto no es una advertencia teórica: los michis gris y
   blanco salieron con los ojos grises y los mofletes en anillo, se
   arreglaron dos veces con el MISMO nombre de archivo, y este número
   se quedó en v2. Quien hubiera abierto la app en medio se quedaba con
   los gatos rotos para siempre.
   `node pruebas/cache-sw.mjs` avisa si vuelve a pasar. */
/* v7 (2026-09-14): esta NO va por una imagen. Es la base estandar
   `v0.7.0`, la version con la que Albert trabaja desde tres sitios —este
   portatil, el otro y el movil—. Subirla obliga a los dispositivos que ya
   tienen la app instalada a tirar la cache vieja y arrancar limpios en la
   misma base, en vez de ir cada uno con un resto distinto de v5 o v6.
   Cuesta una descarga de 125 KB una sola vez.
   Regla normal: se sube al cambiar una imagen SIN hash. Esta es la
   excepcion, y queda escrita para que no parezca que se subio por
   costumbre. Ver `VERSION.md`. */

/* v8 (2026-09-16): los 27 michis de las model sheets de Albert. Mismos
   nombres de archivo y contenido distinto, que es el caso exacto que
   esta regla vigila: sin subir esto, quien tenga la app abierta seguiria
   viendo los dibujos viejos para siempre. */

/* v6 (2026-09-13): Albert dibujo `pasos` de nuevo —una patita con los
   deditos separados del cojin, que a 12 px se entiende y la de antes
   no—. Mismo nombre de archivo y sin hash, asi que sin subir esto quien
   ya tenga la app abierta seguiria viendo la patita vieja para siempre.
   Las fotos de Ninja que entraron el mismo dia NO pedian subirla: eran
   archivos nuevos, o sea URLs nuevas, y la cache no puede tapar lo que
   no tiene guardado. */

/* v5 (2026-09-12, mas tarde): Albert redibujo `limpiar` otra vez —una
   escoba mejor— y tambien `comida`, que ahora lleva palillos y verdura.
   Los iconos del anillo no llevan hash en el nombre, asi que sin subir
   esto quien ya tuviera la app seguiria viendo los de antes.

   v4 fue por lo mismo: `limpiar` paso de cubo a escoba. */
const CACHE = 'michifit-v8';

/* Lo mínimo para arrancar sin red. El resto se va guardando solo según
   se usa: la app es pequeña y se cachea entera en la primera visita. */
const BASICOS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.png',
  '/iconos-app/icono-192.png',
];

self.addEventListener('install', (e) => {
  /* `skipWaiting` para que una versión nueva entre en cuanto se
     descargue. Sin esto, el usuario tendría que cerrar la app del todo
     para ver un arreglo. */
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(BASICOS))
      .catch(() => {})           // sin red en la instalación: da igual
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  /* Solo GET y solo lo nuestro: no tiene sentido cachear peticiones a
     otros dominios ni envíos de formulario. */
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  /* Los VIDEOS no pasan por la cache, y hay que decirlo aparte porque
     no llegan como una imagen: el navegador los pide POR TROZOS, con
     una cabecera `Range`, y el servidor contesta 206 Partial Content.

     Eso rompia las dos mitades de aqui abajo:

     · Al GUARDAR. `res.ok` es TRUE para un 206 —es un 2xx— asi que el
       trozo entraba en el `if` de mas abajo... y `cache.put` rechaza
       las respuestas parciales con un TypeError. La promesa no la
       recoge nadie, o sea un fallo no controlado por cada trozo de
       video, invisible desde la consola de la pagina porque ocurre
       aqui dentro.
     · Al SERVIR. Si alguna vez llegara a haber una copia entera
       guardada, `caches.match` se la devolveria TAL CUAL a una
       peticion que pedia del byte 100.000 al 200.000. Eso no es lo que
       se ha pedido, y con ello el video no se puede ni adelantar.

     Comprobado el 2026-09-13 con un mp4 de prueba y el service worker
     al mando: se veia bien y no quedaba en la cache, porque el error
     salta DESPUES de devolver la respuesta. Se veia bien por suerte,
     no por diseño.

     Asi que los trozos van derechos a la red. Que un video no se
     guarde para verlo sin cobertura es ademas lo que conviene: los de
     Ninja son los archivos mas pesados de la app, y llenar la cache
     del movil con ellos para que el michi arranque sin red es un mal
     cambio. */
  if (req.headers.has('range')) return;

  const esPagina = req.mode === 'navigate';

  if (esPagina) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put('/', copia));
          return res;
        })
        .catch(() => caches.match('/').then((r) => r ?? Response.error()))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((guardado) => guardado ?? fetch(req).then((res) => {
      /* Solo se guarda lo que salió bien: cachear un 404 lo dejaría
         roto hasta que cambie la versión de la caché.

         Y `200` en vez de `res.ok`, que abarca todo el 2xx: un 206 es
         un 2xx y `cache.put` lo rechaza. Arriba ya se apartan los
         trozos por la cabecera `Range`, asi que esto es el segundo
         cerrojo — un 206 sin `Range` no deberia existir, pero el que
         se cuele no tiene por que dejar un fallo sin recoger. */
      if (res.status === 200) {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia));
      }
      return res;
    }))
  );
});
