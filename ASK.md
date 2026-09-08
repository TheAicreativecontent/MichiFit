# ASK.md — Preguntas pendientes (para Alberto)

## Decisiones pendientes
- [ ] **¿Despliegue automático desde GitHub?** Ahora se despliega con
      `vercel deploy --prod` desde la carpeta local. Para que cada `git push`
      despliegue solo hay que conectar el repo en Settings → Git del proyecto
      de Vercel. Lo tiene que hacer Alberto.
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
