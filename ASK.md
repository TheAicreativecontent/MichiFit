# ASK.md — Preguntas pendientes (para Albert)

## Decisiones pendientes
- [ ] **Confirmar con la duena del QR ANTES del push.** El 2026-09-19
      Albert dijo que el QR de PromptPay es de su pareja y que ella quiere
      ponerlo para los donativos; esta montado como el PRIMER bloque de
      Karma, pero sin commitear. Es un QR de Thai QR Payment (Bangkok Bank)
      que **usa su numero de identidad nacional** como identificador. La
      imagen que se enseña esta recortada (sin nombre ni numero visibles),
      pero el codigo sigue llevandolo dentro y cualquiera puede leerlo con
      un lector de QR. Como el repositorio es publico y **un commit no se
      retira**, hay que estar seguros de que ella lo sabe. La alternativa
      es un e-Wallet ID abierto solo para donativos (o un QR de TAG THAI
      Easy Pay para turistas): mismo bloque, otro archivo. Detalle en
      `TODO.md`.


## Dudas tecnicas sin resolver
- [ ] (ninguna)

## Cerradas
- 2026-09-19 **Camara para calcular calorias de una foto**: NO en esta app
  (por ahora). Necesita una API de vision y se paga por uso. Decision de
  Albert.
- 2026-09-19 **Notificaciones push de verdad**: NO hacen falta (por ahora).
  Sigue valiendo el calendario (.ics). Decision de Albert.
- 2026-09-19 **Hostinger, usuarios y login**: NO. La app sigue estatica y
  local-first, sin cuentas: cualquiera que tenga el enlace la descarga y
  usa. Eso deja cerrado tambien lo de las push y la sincronizacion entre
  dispositivos. Decision de Albert.
- 2026-09-19 **Umbral de `contento`**: `FORMA_CONTENTO` a 95 (Albert dijo
  que 90 o 95 le valian).
- 2026-09-12 **De que color arranca la app**: GRIS de fabrica, porque
  Ninja es gris, y el usuario elige al final de la historia — el color
  del gato Y el del huevo. Es la opcion (c) de las tres que habia, y la
  que convierte el problema en el primer gesto de cuidarlo. El huevo
  sigue naranja por defecto: ese es el color de marca. Decision de
  Albert.
- 2026-09-12 **Avisar cuando la meta de peso es MUY alta**: NO se hace.
  Queda como esta. La asimetria con el suelo de IMC es deliberada: la
  app promete no juzgar tu cuerpo (`MECANICA.md` 10) y un techo se lee
  como un reproche. Decision de Albert.
- 2026-09-11 **Renombrar Michigochi en el codigo**: se cerro sola. Al
  revisar el codigo antes de abrir al publico se comprobo que la palabra
  ya no aparece en ninguna linea viva — solo en los documentos, donde es
  historia y esta bien que este.
- 2026-09-11 **«Mantenerme» pasa a ser una BANDA**: cumplir es quedarse
  cerca por arriba Y por abajo, con el mismo margen del 10% que ya se
  usaba. Antes bastaba con no pasarse, asi que comer 700 kcal por debajo
  del mantenimiento contaba como cumplido — que es cualquier cosa menos
  mantenerse. Decision de Albert. Se aplico tambien a «estar mas en
  forma», que apunta al mismo numero: dos botones con la misma meta y
  distinto comportamiento muerden meses despues.
- 2026-09-08 **Carpetas**: archivadas en `../_ARCHIVO/` (la original y
  Michigochi, enteras) y esta pasa a ser `2026_APP_MICHIFIT`. Decision de
  Albert: una sola app, y es el tamagotchi del michi kawaii.
- 2026-09-08 **Despliegue automatico desde GitHub**: hecho. El repo esta
  conectado en Vercel -> Settings -> Git, asi que cada `git push` despliega.
- 2026-09-08 **Flecos de la mecanica**: los cuatro resueltos, ver seccion 11
  de `MECANICA.md`.
- 2026-09-08 **Facturacion de Gemini**: NO se activa. Sin cuota de imagenes,
  `/banana` no genera nada; las ilustraciones las hace Albert por fuera.
- 2026-09-08 **API de Garmin**: descartada. Requiere ser desarrollador
  certificado por Garmin, no basta con una clave. El importador del export
  de Garmin Connect tambien cae con ella.

## Cosas que preguntar a terceros
- [ ] (ninguna)
