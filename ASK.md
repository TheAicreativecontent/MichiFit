# ASK.md — Preguntas pendientes (para Alberto)

## Decisiones pendientes
- [ ] **La camara para calcular calorias de una foto.** Se puede hacer,
      pero necesita una API de vision y se paga por uso. Es la misma
      decision que ya cerraste con la cuota de imagenes de Gemini, en
      otra puerta. Es cuestion de dinero, no tecnica.
- [ ] **Notificaciones push de verdad.** Las que suenan con la app
      cerrada necesitan un SERVIDOR con claves VAPID. Eso rompe el
      principio de que los datos no salen del dispositivo, y en iOS solo
      funcionan si la app esta instalada en la pantalla de inicio. La
      alternativa sin servidor (Notification Triggers) no esta
      disponible en ningun navegador en produccion.
      Mientras tanto, el calendario (.ics) hace el trabajo: funciona en
      todos los moviles, sin permisos ni coste, y las alarmas las pone
      el sistema. Esta en el TODO como lo siguiente.


## Dudas tecnicas sin resolver
- [ ] (ninguna)

## Cerradas
- 2026-09-12 **De que color arranca la app**: GRIS de fabrica, porque
  Ninja es gris, y el usuario elige al final de la historia — el color
  del gato Y el del huevo. Es la opcion (c) de las tres que habia, y la
  que convierte el problema en el primer gesto de cuidarlo. El huevo
  sigue naranja por defecto: ese es el color de marca. Decision de
  Alberto.
- 2026-09-12 **Avisar cuando la meta de peso es MUY alta**: NO se hace.
  Queda como esta. La asimetria con el suelo de IMC es deliberada: la
  app promete no juzgar tu cuerpo (`MECANICA.md` 10) y un techo se lee
  como un reproche. Decision de Alberto.
- 2026-09-11 **Renombrar Michigochi en el codigo**: se cerro sola. Al
  revisar el codigo antes de abrir al publico se comprobo que la palabra
  ya no aparece en ninguna linea viva — solo en los documentos, donde es
  historia y esta bien que este.
- 2026-09-11 **«Mantenerme» pasa a ser una BANDA**: cumplir es quedarse
  cerca por arriba Y por abajo, con el mismo margen del 10% que ya se
  usaba. Antes bastaba con no pasarse, asi que comer 700 kcal por debajo
  del mantenimiento contaba como cumplido — que es cualquier cosa menos
  mantenerse. Decision de Alberto. Se aplico tambien a «estar mas en
  forma», que apunta al mismo numero: dos botones con la misma meta y
  distinto comportamiento muerden meses despues.
- 2026-09-08 **Carpetas**: archivadas en `../_ARCHIVO/` (la original y
  Michigochi, enteras) y esta pasa a ser `2026_APP_MICHIFIT`. Decision de
  Alberto: una sola app, y es el tamagotchi del michi kawaii.
- 2026-09-08 **Despliegue automatico desde GitHub**: hecho. El repo esta
  conectado en Vercel -> Settings -> Git, asi que cada `git push` despliega.
- 2026-09-08 **Flecos de la mecanica**: los cuatro resueltos, ver seccion 11
  de `MECANICA.md`.
- 2026-09-08 **Facturacion de Gemini**: NO se activa. Sin cuota de imagenes,
  `/banana` no genera nada; las ilustraciones las hace Alberto por fuera.
- 2026-09-08 **API de Garmin**: descartada. Requiere ser desarrollador
  certificado por Garmin, no basta con una clave. El importador del export
  de Garmin Connect tambien cae con ella.

## Cosas que preguntar a terceros
- [ ] (ninguna)
