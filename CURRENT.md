# CURRENT.md — Estado actual

## En qué estoy trabajando
Acaba de arrancar la app definitiva. Funciona de punta a punta con cuatro
pantallas y el motor entero.

## Estado
- Última acción (2026-09-07): proyecto creado, motor recalculado según
  `MECANICA.md`, cuatro pantallas funcionando y verificadas en navegador.
- Última acción (2026-09-08): la app ya es **instalable** (PWA con service
  worker: se abre sin cobertura). Ejercicios por día de entreno, macros
  opcionales, botones de ayuda "?", panel de pruebas oculto tras siete
  toques en el logo, y los cuatro flecos de la mecánica resueltos.
- Última acción (2026-09-08, noche): **carpetas ordenadas**. Esta carpeta,
  `2026_APP_MICHIFIT`, es ya la única app del proyecto. Las dos anteriores
  están en `../_ARCHIVO/` con un `LEEME.md` que explica qué hay en cada una.
  Y el **importador de CSV** trae el progreso de la MichiFit antigua.
- Última acción (2026-09-09): **la app habla cinco idiomas** y el
  objetivo de calorías está arreglado. Ver abajo.
- Próximo paso: poses que faltan (celebrando, triste, paseando).
- Bloqueadores: ninguno.
- **Desplegada en https://michifit.vercel.app** (proyecto Vercel
  `the-ai-creative-content/michifit`).
  El repo YA está conectado en Vercel → Settings → Git: **cada `git push`
  a `main` despliega solo**. `vercel deploy --prod --yes` sigue valiendo
  para desplegar sin pasar por GitHub.

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

## El objetivo de calorías (arreglado el 2026-09-09)
Tres personas distintas veían **el mismo objetivo**. La causa: el objetivo
de comida se calculaba UNA vez, al crear el pacto, y no se recalculaba
nunca. Si dos personas usaban el mismo móvil, la segunda heredaba el de la
primera.

Todo pasa ahora por `planEnergetico(perfil, pacto)` en `src/engine/calculos.js`,
que es la **única** fuente del número. Lo que arregló:

- El objetivo se sincroniza al cambiar el perfil o el pacto
  (`sincronizarPacto`). Si lo escribes tú a mano se marca `comidaManual`
  y no se toca nunca más.
- El déficit tiene techo porcentual (`DEFICIT_MAXIMO`, 20%). Los 500 kcal
  fijos eran el 20% para uno y el 37% para otra.
- El suelo de `KCAL_MINIMAS` se respeta de verdad, no solo avisa.
- El sexo se puede cambiar en Ajustes (antes solo en la bienvenida).
- El mantenimiento sale de la actividad **que has pactado**, no de un
  factor plano de 1,15 copiado a mano en dos pantallas.

## Idiomas (desde el 2026-09-09)
Cinco: español, inglés, tailandés, chino y japonés. Sistema propio en
`src/i18n/`, sin librería. Para añadir una cadena: la pones en `es.js` y
luego en los otros cuatro; `useT()` cae al español si falta y avisa por
consola en desarrollo.

Dos trampas que ya están resueltas y conviene no volver a pisar:
- **Las fuentes de marca no tienen CJK ni tailandés.** Usa siempre
  `var(--fuente)` o `var(--fuente-titulo)`, nunca `'Nunito'` a pelo.
- **La pantallita del tamagotchi usa Press Start 2P, que solo tiene
  alfabeto latino.** Lo que se pinte ahí dentro va transliterado
  (`nivelesCorto`, `escenas`, `marcador`). En kanji saldrían cuadrados.

## Traer datos de la app antigua
Ajustes → «Traer datos de la MichiFit antigua». Se sube el CSV que exporta
la app vieja (la de `synastry.site/michifit/`) y se fusiona **sin pisar**
nada de lo que ya haya apuntado: solo rellena huecos. El parser está en
`src/datos/importar.js`.

Ojo con la columna `sueno` de ese CSV: **no son horas**, es la puntuación de
sueño de Garmin (va de 44 a 85). Se guarda en `entrada.importado.suenoPuntos`
y NO se convierte a `sueno.horas`.

## Cómo se abre el panel de pruebas
Siete toques seguidos en el logo de la cabecera (con menos de segundo y
medio entre toque y toque). Deja cambiar el cuerpo, la pose y la escena
del michi para revisar los dibujos sin apuntar datos reales.

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
