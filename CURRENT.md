# CURRENT.md — Estado actual

## En qué estoy trabajando
Acaba de arrancar la app definitiva. Funciona de punta a punta con cuatro
pantallas y el motor entero.

## Estado
- Última acción (2026-09-07): proyecto creado, motor recalculado según
  `MECANICA.md`, cuatro pantallas funcionando y verificadas en navegador.
- Última acción (2026-09-08): tres poses de michi listas y enchufadas —
  dormido, comiendo y entrenando. Al apuntar entreno el michi levanta
  pesas; si apuntas entreno y comida a la vez, manda el entreno.
- Próximo paso: pantalla de Karma (bloqueada: falta decidir la cuenta de
  donaciones) y más poses (celebrando, triste).
- Bloqueadores: ninguno.
- **Desplegada en https://michifit.vercel.app** (proyecto Vercel
  `the-ai-creative-content/michifit`, enlazado con la CLI).
  Para volver a desplegar: `vercel deploy --prod --yes` desde la carpeta.

## Verificado en navegador
- Simulador da los mismos números que la app original: 2602 de gasto total,
  −595 de déficit, 377 quemado moviéndote, −0,54 kg/semana.
- Ajustes da el mismo IMC: 26,2 actual, 21,5 meta.
- Pantalla de pacto muestra el pacto real de Alberto.
- Build de producción OK, sin errores de consola.

## Despliegue
- Repo: https://github.com/TheAicreativecontent/MichiFit
- Vercel enlazado con la CLI (`vercel link --project michifit`). El enlace
  desde el MCP fallaba: el proyecto no era visible con el ámbito del token.
- `.vercel/` y `.env.local` están en `.gitignore`: el segundo lleva un token
  OIDC que la CLI descarga. **No subirlos nunca.**

## Notas rápidas
- **La app es pública y multiusuario.** No lleva datos de nadie: arranca vacía y
  cada usuario rellena lo suyo en el primer arranque.
- Los días de entreno sugeridos son L/X/V, pero se eligen en el asistente.
- El simulador parte del **peso actual**: si no se actualiza, la previsión sale
  larga porque sigue midiendo desde el peso inicial.
- El michi es **pixel art naranja dentro de un tamagotchi SVG**. El componente
  vectorial antiguo (`mascota/Michi.jsx`) ya no se usa en ninguna pantalla;
  se conserva por si hiciera falta.
- El fondo ya está: `public/fondo.png` (880x1186). Se pinta como en Michi
  Finanzas: capa fija, `cover`, centrado, opacidad .15.
- **No ponerlo en mosaico**: la imagen no es repetible sin costura (bordes con
  19 y 40 de diferencia). Se vería la línea de corte.
- Aviso al revisar: el panel de vista previa del navegador **lava toda la
  página** cuando hay una capa fija con opacidad, aunque esté vacía. Es un
  artefacto del panel, no de la CSS. Juzgar el fondo en un navegador de verdad.
