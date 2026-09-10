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
const CACHE = 'michifit-v3';

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
         roto hasta que cambie la versión de la caché. */
      if (res.ok) {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia));
      }
      return res;
    }))
  );
});
