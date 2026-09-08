# TODO.md — Backlog

## Ahora
- [ ] **Antes de publicar en GitHub Pages**: poner `base: '/<nombre-repo>/'` en
      `vite.config.js`. Vite compila con rutas absolutas desde `/`, y en
      `usuario.github.io/repo/` la app saldría en blanco sin esto.
- [ ] **Pantalla de registro de días pasados.** El motor ya tiene la ventana de
      3 días (`VENTANA_RETRO`) y la respeta, pero no hay interfaz para rellenar
      ayer. Sin esto, media mecánica de comodines no se puede usar de verdad.

## Después
- [ ] **Pantalla de Progreso**: portar de `../2026_APP_MICHIFIT/MichiFit.jsx`
      (líneas 818-905) el calendario mensual y las gráficas `WeightChart` y
      `ForecastChart`. Son SVG a medida, sin librerías: se portan limpias.
- [ ] **Pantalla de Karma**: portar de `../2026_APP_MICHIFIN/MichiFinanzas.jsx`
      (línea 2230) la pantalla de apoyo al proyecto. Bloqueada hasta decidir la
      cuenta de donaciones — ver `ASK.md`.
- [ ] Registro de comidas con macros (informativas, no cuentan).
- [ ] Que las acciones de Inicio abran un campo en vez de sumar a saltos fijos.
- [ ] Importador del export de Garmin Connect.
- [ ] Add-ons cosméticos al llegar a nivel 5 (batidos, mancuernas, gafas).
- [ ] Cambiar `localStorage` por IndexedDB (solo toca `datos/almacen.js`).
- [ ] PWA: manifest + iconos desde el logo real.
- [ ] Más estados de pixel art: dormido, comiendo, celebrando, entrenando.
      Ahora las cinco siluetas cambian con la forma, pero la pose y la cara del
      sprite son siempre las mismas.
- [ ] Que los tres botones del aparato hagan algo (mirar, cuidar, cancelar).

## Ideas / quizás algún día
- [ ] Avisar de sobreentrenamiento cuando se rompen muchos días de descanso.
- [ ] Marcar en la gráfica los tramos con pocos datos.

## Hecho
- [x] 2026-09-07 — Proyecto nuevo con motor recalculado y cuatro pantallas.
- [x] 2026-09-07 — Mecánica de motivación diseñada (`MECANICA.md`).
- [x] 2026-09-07 — Asistente de primer arranque; app sin datos precargados.
- [x] 2026-09-07 — Michi en pixel art naranja dentro de un tamagotchi SVG.
- [x] 2026-09-07 — Paleta alineada con Michi Finanzas + fondo kawaii puesto.
- [x] 2026-09-08 — Paleta corregida: los marrones que había inventado para el
      modo oscuro (y las sombras marrones) sustituidos por los valores reales
      de MichiMind y Michi Finanzas.
