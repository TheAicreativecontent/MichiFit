# TODO.md — Backlog

## Ahora
- [ ] **Antes de publicar en GitHub Pages**: poner `base: '/<nombre-repo>/'` en
      `vite.config.js`. Vite compila con rutas absolutas desde `/`, y en
      `usuario.github.io/repo/` la app saldría en blanco sin esto.

## Después
- [ ] Registro de comidas con macros (informativas, no cuentan).
- [ ] Importador del export de Garmin Connect.
- [ ] Add-ons cosméticos al llegar a nivel 5 (batidos, mancuernas, gafas).
- [ ] Cambiar `localStorage` por IndexedDB (solo toca `datos/almacen.js`).
- [ ] PWA: manifest + iconos desde el logo real.
- [ ] Más estados de pixel art: dormido, comiendo, celebrando, entrenando.
      Ahora las cinco siluetas cambian con la forma, pero la pose y la cara del
      sprite son siempre las mismas.
- [ ] Que los tres botones del aparato hagan algo (mirar, cuidar, cancelar).

## Ideas / quizás algún día
- [ ] En la ventana de cada día del pacto, poder apuntar **qué entreno toca**
      (pecho, piernas, cardio...). El hueco ya está preparado.
- [ ] **Icono propio para "Logros"**: ahora usa provisionalmente el
      `ICO_BTC` de Michi Finanzas (una moneda), que no pega. Iría bien una
      medalla o una copa en ese mismo estilo.
- [ ] Más escenarios: cocina para las comidas, parque, cama para dormir.
- [ ] Michi propio para la pantalla de Karma: el actual viene de Michi
      Finanzas y lleva traje.
- [ ] En la gráfica, la historia queda comprimida cuando la meta está muy
      lejos (28 días de datos contra 165 de previsión). Se leería mejor con
      un eje partido o limitando el horizonte visible.
- [ ] Avisar de sobreentrenamiento cuando se rompen muchos días de descanso.
- [ ] Marcar en la gráfica los tramos con pocos datos.

## Hecho
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
