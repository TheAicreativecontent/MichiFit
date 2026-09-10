# TODO.md — Backlog

## Ahora
- [ ] **Si algún día se publica en GitHub Pages**: poner `base:
      '/<nombre-repo>/'` en `vite.config.js`. Vite compila con rutas absolutas
      desde `/`, y en `usuario.github.io/repo/` la app saldría en blanco.
      Con Vercel no hace falta: sirve desde la raíz del dominio.

## Después
- [ ] **«Ganar peso» como objetivo.** Hoy no está porque el motor
      recorta cualquier superávit a cero (`Math.max(0, deficitObjetivo)`
      en `planEnergetico`). Hace falta: permitir déficit negativo con su
      propio TECHO de superávit, la previsión de peso en positivo, y
      revisar `MARGEN_COMIDA` — pasarse de calorías rompe el día, y en un
      volumen es justo lo contrario. `pruebas/objetivo.mjs` tiene una
      comprobación que se caerá cuando se haga, para que no pase de
      refilón.

- [ ] **Las fotos y los vídeos del Ninja de verdad** (Alberto). La
      última pantalla de la historia ya tiene su sitio: deja los
      archivos en `public/ninja/`, añádelos a la lista de
      `src/datos/ninja.js` y sube `const CACHE` en `public/sw.js`.
      Mientras no haya ninguno, esa pantalla enseña al michi contento y
      funciona igual.

- [ ] **Las 21 viñetas del cómic.** Los prompts están escritos. Cuando
      existan, se cambian las rutas de `ESCENAS` en `pantallas/Lore.jsx`
      y ya: ahora mismo la historia se ilustra con el propio michi gris
      sobre los escenarios que hay.

- [ ] **Los iconos de los anillos, en pixel art** (Alberto). Ocho, a
      96x96 con píxel duro, que se verán a ~13 px: corazón, vaso de
      agua, cepillo, comida, mancuerna, huellas, luna y una ✕. Ahora
      mismo son emoji, que funcionan pero no son de la casa. Se cambian
      en `src/mascota/anillos.js`, campo `icono`.

- [ ] **Ajustar el ritmo de las barras cuando se use de verdad.** Los
      números están en un solo sitio cada uno: `AGUA_HORAS` y
      `ORDEN_HORAS` en `engine/cuidados.js` (16 y 24 horas de vigilia),
      y los cuatro de la felicidad en `engine/felicidad.js`. Si cansa,
      se bajan; si aburre, se suben.

- [ ] **Enseñar los botones la primera vez.** La gramática de dos
      anillos es la de un tamagotchi, y un tamagotchi venía con manual.
      Hay tres salidas y el rótulo del icono seleccionado, pero falta un
      cartelito las primeras veces. Está `anillo.ayuda` en el
      diccionario, sin usar todavía.

- [ ] Add-ons cosméticos al llegar a nivel 5 (batidos, mancuernas, gafas).
      Se pierden al bajar de nivel y se recuperan al volver a subir.
      Necesita código además del dibujo.

## Descartado
- ~~Importador del export de Garmin Connect~~ — la API de Garmin exige ser
  desarrollador certificado, no basta con una clave (Alberto, 2026-09-08).
- ~~`localStorage` → IndexedDB~~ — **no hace falta**. IndexedDB sirve para
  datos grandes o consultas complejas; aquí son unos pocos KB de un solo
  usuario, que caben de sobra en el límite de 5 MB. Cambiarlo añadiría código
  asíncrono a cambio de nada. Si algún día se guardan fotos, se reabre: solo
  toca `datos/almacen.js`.

## Ideas / quizás algún día
- [ ] En la ventana de cada día del pacto, poder apuntar **qué entreno toca**
      (pecho, piernas, cardio...). El hueco ya está preparado.
- [ ] Más escenarios: cocina para las comidas, parque, cama para dormir.
- [ ] Michi propio para la pantalla de Karma: el actual viene de Michi
      Finanzas y lleva traje.
- [ ] En la gráfica, la historia queda comprimida cuando la meta está muy
      lejos (28 días de datos contra 165 de previsión). Se leería mejor con
      un eje partido o limitando el horizonte visible.
- [ ] Marcar en la gráfica los tramos con pocos datos.


## Hecho
- [x] 2026-09-11 — «Mi pacto» pasa a ser **«Mi objetivo»** en las cinco
      lenguas, y la pantalla empieza por qué quieres conseguir: perder
      peso, mantenerte, estar más en forma, u otra cosa que escribes tú.
      Los tres primeros cambian el déficit de verdad.
- [x] 2026-09-11 — **La app cuenta la historia de Ninja.** Seis actos
      al primer arranque, antes de pedir un solo dato, y siempre a mano
      en Ajustes. Era el problema de fondo: nadie sabía para qué estaba
      el gato porque la app no lo decía en ninguna parte.
- [x] 2026-09-11 — `michi_sediento` y `michi_asqueado`, dibujados por
      Alberto, normalizados y teñidos a gris y blanco. Al teñir hubo que
      aprender a respetar el atrezo: el azul del agua y el verde del asco
      no son pelaje.
- [x] 2026-09-11 — Los tres botones del aparato pasan a ser la interfaz:
      dos anillos (cuidar y medir), con vista previa de la escena
      mientras eliges y el editor del día filtrado a un solo dato.
      Y dos barras nuevas: agua y orden, con cacas kawaii.
- [x] 2026-09-11 — Revisión del código: la caché del service worker
      estaba desfasada **en producción**, los tres botones del tamagotchi
      hablaban castellano en los cinco idiomas, y si el navegador no deja
      guardar ahora se avisa. Ver `SESSION_MAP.md`.
- [x] 2026-09-11 — «Michigochi» ya no aparece en ninguna línea de código
      vivo. La tarea se cerró sola, como decía que haría.
- [x] 2026-09-10 — El pacto se exporta al calendario del móvil (.ics),
      con los entrenos semanales y el recordatorio diario de apuntar.
      Es lo más cerca de una notificación que se puede hacer sin
      servidor, y funciona en todos los móviles.
- [x] 2026-09-10 — Tres gatos a elegir: naranja, gris y blanco. Los dos
      nuevos salen de teñir los naranjas, sin redibujar nada.
- [x] 2026-09-09 — El michi deja de reflejar tu cuerpo y pasa a reflejar
      tu constancia: una sola silueta y nueve dibujos (contento, cansado,
      triste, andando, comiendo, entrenando, durmiendo, celebrando, y el
      de pie). Celebra al subir de nivel.
- [x] 2026-09-09 — El huevo pasa a poder elegirse en siete colores,
      teñidos por código desde una sola imagen. El acabado liso está
      hecho y guardado en `_CUARENTENA/carcasas-lisas/`, fuera de la app.
- [x] 2026-09-09 — Borrar los datos exige un paso deliberado (escribir
      los días que se pierden) en vez de un `confirm()` del navegador.
- [x] 2026-09-09 — Revisión antes de abrir al público: 6 errores
      arreglados, 4 asuntos de seguridad cerrados (cabeceras, XSS
      latente, CSV, localStorage) y código muerto a `_CUARENTENA/`.
- [x] 2026-09-09 — Cinco idiomas (es/en/th/zh/ja) con selector en la
      cabecera. 295 cadenas, sistema propio sin libreria.
- [x] 2026-09-09 — Tamano de letra ajustable (normal/grande/muy grande).
- [x] 2026-09-09 — Arreglado el objetivo de calorias: era el mismo para
      cuerpos distintos. Cinco fallos encadenados, ver CURRENT.md.
- [x] 2026-09-08 — Carpetas ordenadas: las dos apps anteriores a `_ARCHIVO/`
      con su `LEEME.md`, y esta pasa a llamarse `2026_APP_MICHIFIT`.
- [x] 2026-09-08 — Importador del CSV de la MichiFit antigua, en Ajustes.
      Fusiona sin pisar. 72 días importados y verificados.
- [x] 2026-09-08 — PWA instalable: manifest, service worker (abre sin
      cobertura) e iconos generados del logo. Botones de ayuda "?" en
      Mi pacto, Progreso, Logros y Simular.
- [x] 2026-09-08 — Ejercicios por día de entreno (nombre, reps, peso) y
      macros opcionales al registrar el día. Ninguno cuenta para el pacto.
- [x] 2026-09-08 — Flecos de la mecánica resueltos (MECANICA.md §11).
- [x] 2026-09-08 — Panel de pruebas oculto tras siete toques en el logo.
- [x] 2026-09-08 — Aviso de sobreentrenamiento: ya estaba, salta al romper
      dos o más días de descanso en la semana.
- [x] 2026-09-08 — Botón azul del aparato = acción: cicla escena y pose
      (casa, comer, gimnasio, calle, dormir) con rótulo dentro de la
      pantalla. "Cómo va" pasa a tocar el cristal. Panel de PRUEBAS.
- [x] 2026-09-08 — Poses de dormir, comer y entrenar para los cinco cuerpos.
- [x] 2026-09-08 — Icono propio de Logros (medalla).
- [x] 2026-09-08 — Pantalla de Logros y hitos en el motor (no existían en
      esta app: se quedaron fuera al crearla). Iconos de Michi Finanzas
      siempre a color, escenarios sin deformar.
- [x] 2026-09-08 — Paleta pastel siempre (fuera el modo oscuro), logo en la
      cabecera, ajustes arriba, huevo de pixel art sin recuadro, marcador
      estilo videojuego y "+" de registro numerico.
- [x] 2026-09-08 — Pantalla de Karma, con la cuenta de Michi Finanzas.
- [x] 2026-09-08 — Pantalla de Progreso: gráfica de peso con previsión,
      calendario del pacto y registro de días pasados.
- [x] 2026-09-08 — Desplegada en https://michifit.vercel.app
- [x] 2026-09-07 — Proyecto nuevo con motor recalculado y cuatro pantallas.
- [x] 2026-09-07 — Mecánica de motivación diseñada (`MECANICA.md`).
- [x] 2026-09-07 — Asistente de primer arranque; app sin datos precargados.
- [x] 2026-09-07 — Michi en pixel art naranja dentro de un tamagotchi SVG.
- [x] 2026-09-07 — Paleta alineada con Michi Finanzas + fondo kawaii puesto.
- [x] 2026-09-08 — Paleta corregida: los marrones que había inventado para el
      modo oscuro (y las sombras marrones) sustituidos por los valores reales
      de MichiMind y Michi Finanzas.
