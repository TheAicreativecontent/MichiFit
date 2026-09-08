# TODO.md — Backlog

## Ahora
- [ ] **Quitar el panel de PRUEBAS** de la pantalla de Inicio: la constante
      `PRUEBAS` y el bloque `.mf-pruebas` (en `pantallas/Inicio.jsx` y al
      final de `estilos.css`). Es andamio para revisar los dibujos del michi.
- [ ] **Antes de publicar en GitHub Pages**: poner `base: '/<nombre-repo>/'` en
      `vite.config.js`. Vite compila con rutas absolutas desde `/`, y en
      `usuario.github.io/repo/` la app saldría en blanco sin esto.

## Después
- [ ] Registro de comidas con macros (informativas, no cuentan).
- [ ] Importador del export de Garmin Connect.
- [ ] Add-ons cosméticos al llegar a nivel 5 (batidos, mancuernas, gafas).
- [ ] Cambiar `localStorage` por IndexedDB (solo toca `datos/almacen.js`).
- [ ] PWA: manifest + iconos desde el logo real.
- [ ] Poses que faltan: **celebrando** (al subir de nivel) y **triste**
      (tras fallar una semana). El sistema ya las admite: basta dejar el
      PNG en `public/michi/` con el nombre `<cuerpo>_<pose>.png`.
- [ ] **Pose de pasear**: la escena "PASEANDO" usa el michi de pie, porque
      no hay dibujo propio.

## Ideas / quizás algún día
- [ ] En la ventana de cada día del pacto, poder apuntar **qué entreno toca**
      (pecho, piernas, cardio...). El hueco ya está preparado.
- [ ] Más escenarios: cocina para las comidas, parque, cama para dormir.
- [ ] Michi propio para la pantalla de Karma: el actual viene de Michi
      Finanzas y lleva traje.
- [ ] En la gráfica, la historia queda comprimida cuando la meta está muy
      lejos (28 días de datos contra 165 de previsión). Se leería mejor con
      un eje partido o limitando el horizonte visible.
- [ ] Avisar de sobreentrenamiento cuando se rompen muchos días de descanso.
- [ ] Marcar en la gráfica los tramos con pocos datos.

## Hecho
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
