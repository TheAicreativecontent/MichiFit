# ASK.md — Preguntas pendientes (para Alberto)

## Decisiones pendientes
- [ ] **Si avisar cuando la meta de peso es MUY alta.** Hay suelo de IMC
      (avisa si tu meta baja de 18,5) pero no techo. Con «ganar peso» ya
      se puede poner una meta muy por encima de lo saludable y la app no
      dice nada.
      La simetria pediria avisar. Pero `MECANICA.md` §10 promete que la
      app **no juzga tu cuerpo**, y todo el replanteamiento del michi
      salio de que la gente no queria identificarse con un cuerpo
      grande. Un aviso ahi puede leerse como un reproche.
      Es una decision de valores, no tecnica.

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

- [ ] **De que color arranca la app.** Ninja es GRIS en el lore (decidido
      el 2026-09-10 por la noche) pero la app arranca en NARANJA, que es
      el color de marca: el huevo y el logo son naranjas. Tal como esta,
      «adopta a Ninja» te da un gato que no es Ninja.
      Tres salidas, y es decision tuya:
        a) arrancar en gris, y que el naranja sea otro gato mas;
        b) dejar el naranja de fabrica y que el lore diga que el color lo
           eliges tu al adoptarlo;
        c) preguntarlo en la bienvenida, justo despues del cuento.
      La (c) es la que mas me gusta: convierte el problema en el primer
      gesto de cuidarlo. Cuesta una pantalla mas en la bienvenida.

- [ ] **Cuando renombrar Michigochi -> MichiFit en el codigo.** Ahora hay
      incoherencia entre el nombre del producto y el del codigo.

## Dudas tecnicas sin resolver
- [ ] (ninguna)

## Cerradas
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
