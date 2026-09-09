# TODO.md — Backlog

## Ahora
- [ ] **Si algún día se publica en GitHub Pages**: poner `base:
      '/<nombre-repo>/'` en `vite.config.js`. Vite compila con rutas absolutas
      desde `/`, y en `usuario.github.io/repo/` la app saldría en blanco.
      Con Vercel no hace falta: sirve desde la raíz del dominio.

## Después
- [ ] **Contar el lore dentro de la app.** Decidido el 2026-09-10: se
      muestra al empezar, y queda un botón para volver a verlo cuando
      quieras. Con hueco para **fotos y vídeos del Ninja real**. Es lo más urgente de esta
      lista: la gente no sabe para qué está el gato porque la app no lo
      dice en ninguna parte. Al adoptarlo debería presentarse.
      El guion está en `LORE.md` y los prompts de las 22 viñetas, hechos.
- [ ] **Exportar el pacto al calendario (.ics)**. Es lo que de verdad
      recuerda ir al gimnasio, y funciona en todos los móviles sin
      servidor ni permisos. Ver la nota de ASK.md sobre las push.
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
- [ ] Renombrar lo que queda de «Michigochi» en el código. Ya casi no
      queda: el michi SVG y su CSS, ambos en `_CUARENTENA/`. Si no se
      recuperan nunca, esta tarea se cierra sola.

## Hecho
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
