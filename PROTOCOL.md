# PROTOCOL.md — Reglas de trabajo en MichiFit

> Léelo siempre al empezar. No cambian sesión a sesión.

## Stack y convenciones
- **React 19 + Vite.** Con build.
- **Código en español**: funciones, variables y comentarios.
- El motor (`src/engine/`) es de **funciones puras**: sin React, sin IO, sin
  leer la fecha del sistema por su cuenta. `hoy` siempre entra por parámetro,
  para poder probar cualquier día.
- Los números ajustables van en `src/engine/constantes.js`. Nunca sueltos.
- La mascota es **SVG paramétrico**: cambia de silueta según los datos. No es
  una imagen y no puede serlo.

## Cosas que NUNCA debe hacer Claude sin preguntar
- No cambiar la mecánica de `MECANICA.md` sin leerla entera. Está diseñada para
  motivar sin castigar, y cada pieza sostiene a las otras.
- No hacer que `forma` dependa del peso o del IMC. El michi es un compañero,
  no un avatar del cuerpo del usuario.
- No quitar los suelos de seguridad de `calculos.js` (IMC 18,5, kcal mínimas,
  ritmo máximo de pérdida).
- No añadir telemetría ni enviar datos del usuario a ningún sitio.
- No meter monedas virtuales, anuncios ni "compra reintentos".
- No dejar que el michi muera. Nunca.
- **No precargar datos personales de nadie.** La app es pública: todo arranca a
  cero y lo rellena cada usuario. Nada de perfiles de ejemplo en el código.
- No tocar `pixel/michis.js` a mano: se genera con `pixel/generar_michis.py`.

## Cómo prefiero que me responda Claude
- Explicaciones cortas, código directo, sin relleno.
- Si hay ambigüedad, elegir la opción más simple y avisar.
- Tono del producto: orientación, no prisa.

## Comandos
- Entorno: `npm run dev` (puerto 5173)
- Build: `npm run build`
- Sprites: `cd pixel && python generar_michis.py`
