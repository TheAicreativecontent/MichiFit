# ASK.md — Preguntas pendientes (para Alberto)

## Decisiones pendientes
- [ ] **Karma: ¿qué cuenta de donaciones?** MichiFinanzas apunta a
      `buymeacoffee.com/MichiFinanzas`. ¿MichiFit usa la misma o se abre una
      propia? Sin esto no se puede portar la pantalla.
- [ ] **Publicar en GitHub.** Hoy ninguna carpeta es siquiera un repositorio
      git. Hace falta: `git init`, crear el repo, `base: '/<repo>/'` en
      `vite.config.js` y activar Pages. Lo hace Alberto: es su cuenta y es
      irreversible.
- [ ] **Flecos de la mecanica** (ver final de `MECANICA.md`): si la semana
      empieza en lunes o es movil, que ve el usuario al gastar un comodin, si el
      pacto lleva calorias diarias, y si los add-ons se pierden al bajar nivel.

- [ ] **Paleta del michi: naranja o rosa.** El michi SVG ya usa el estilo del
      logo. Falta el color: naranja atigrado como el logo, o rosa (`#FF6B9D`,
      lo que hay ahora). Son cinco lineas de `NIVEL_ESTILO`.

- [ ] **Que papel juega el pixel art.** Los cinco sprites estan hechos pero sin
      conectar. Opciones: modo alternativo "pantalla Tamagotchi", sustituto del
      michi SVG, o solo material de marca.

- [ ] **Cuando renombrar Michigochi -> MichiFit en el codigo.** Ahora hay
      incoherencia entre el nombre del producto y el del codigo.

## Dudas tecnicas sin resolver
- [ ] **Facturacion de la API de Gemini.** La clave es valida pero los modelos de
      imagen devuelven `limit: 0`: el nivel gratuito no cubre generacion de
      imagenes. Sin activar facturacion, `/banana` no puede generar nada.

## Cosas que preguntar a terceros
- [ ] (ninguna)
