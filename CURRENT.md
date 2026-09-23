# CURRENT.md — Estado actual

> **Actualizado el 2026-09-23.** Este documento dice cómo está el proyecto
> AHORA y qué toca después. Nada más. La bitácora día a día (7 al 19 de
> septiembre) y las notas de diseño largas viven en `SESSION_MAP.md`, en
> la sección final «Archivo de CURRENT.md»: allí está todo lo que antes se
> leía aquí, palabra por palabra.

## En una frase
La app está completa y funcionando, en manos de amigos y familia desde
el 2026-09-19. **Se lanza sin cuentas ni usuarios**: quien tenga el
link la abre, la instala y usa. Lo que queda son retoques y decidir
cosas con uso real.

## Versión y despliegue
- **Versión estándar: `v0.7.13`** (etiqueta de Git). Ver `VERSION.md`.
- **Caché del service worker: `michifit-v17`** (sin cambios de imagen
  desde la v0.7.6).
- En vivo: https://michifit.vercel.app · cada `git push` a `main`
  despliega solo.
- Repo público: https://github.com/TheAicreativecontent/MichiFit
- `.vercel/` y `.env.local` están en `.gitignore` (el segundo lleva un
  token OIDC). **No subirlos nunca.**
- Comprobado hoy: los 8 `pruebas/*.mjs` en verde y build limpio.

## Lo último que se hizo (2026-09-23, noche cerrada — v0.7.13)
Albert probó la v0.7.12 y pidió otro retoque visual: el botón de
ampliar/reducir el michi (⤢/⤡ en Inicio, arriba a la derecha del
aparato) «se mimetiza con el fondo y no se aprecia que es un botón
clicable». Llevaba fondo `--chip` (#FBEFE2), casi el mismo tono crema
del fondo de la página, con un borde de 1px apenas visible. Ahora
`.mf-inicio-zoom` usa fondo blanco y sombra suave, igual que
`.mf-cab-boton` (los botones de ajustes e idioma de la cabecera, que sí
se distinguen bien). Mismo cambio para el botón de guardar copia (💾),
que comparte la misma clase.

## Antes de eso (2026-09-23, noche — v0.7.12)
Albert probó la v0.7.11 y mandó una captura con un marco negro dibujado
encima, señalando que las barras de la gráfica de hábitos llegaban
justo al borde de la tarjeta blanca, sin ningún margen. Era el
full-bleed de la v0.7.10 (pensado para llegar al borde del
DISPOSITIVO) pero que de paso también pegaba las barras al borde de la
TARJETA — que es donde de verdad se notaba «al límite del contenedor».
Quitado el hack de márgenes negativos en `.mf-graf7-scroll`: ahora usa
el padding normal de `.mf-tarjeta` (18px), igual que cualquier otra
tarjeta de la app. La primera versión de este documento decía «pedido
por Albert: se ven muy pequeñas y apretadas, que ocupen el ancho del
dispositivo» — con las 30 columnas ya sin scroll desde la v0.7.11, ese
ancho ya no hacía falta forzarlo hasta el borde físico para verse bien.

## Antes de eso (2026-09-23, tarde-noche — v0.7.11)
Dos retoques a la gráfica de hábitos, pedidos por Albert nada más
probar la v0.7.10:

- **Vista Año: los doce meses siempre, con o sin datos.** Antes
  `mesesDelAnio()` solo generaba columnas desde que se creó el
  objetivo hasta el mes actual; ahora genera siempre enero-diciembre
  del año en curso. Los meses sin ningún día evaluable (antes de crear
  el objetivo, o todavía en el futuro) salen con el mismo color neutro
  de «sin datos» que ya usaba cualquier día suelto — no hizo falta un
  estado nuevo. Cuidado al que hubo que prestar atención: los meses
  ANTERIORES a `pacto.creado` no se evalúan día a día (se saltan,
  literalmente no se les llama a `evaluarDia`), porque si no saldrían
  en ámbar «a medias» en vez de neutros — el mismo error de fondo que
  ya se corrigió una vez para las rachas, el 2026-09-07.
- **Vista 30 días: sin scroll horizontal.** Las barras ahora se
  encogen para caber siempre en el ancho del dispositivo (antes tenían
  un mínimo de 28px y aparecía scroll). Con más de 14 columnas solo se
  rotula una de cada cinco (más «hoy», siempre visible), para que las
  letras no se amontonen.

## Antes de eso (2026-09-23, tarde — v0.7.10)
El ritmo de la v0.7.9 seguía mal con datos reales, y el reordenamiento
de Progreso que pidió Albert. Detalle completo en `DECISIONS.md`.

- **El bug del ritmo, de verdad arreglado esta vez.** Con la copia de
  seguridad real de Albert (19 pesajes, 18 planos/ruidosos y uno con una
  bajada grande el último día), la regresión por mínimos cuadrados
  (`ritmoReal`) daba una pendiente casi nula por culpa de ese único
  valor suelto → 62 semanas. Se cambió a Theil-Sen (la mediana de las
  pendientes entre cada par de días), que no se deja arrastrar por un
  solo punto raro. Con los mismos datos reales, ahora cae a ~0 y la app
  usa el ritmo teórico (el del objetivo), dando ~7 semanas — lo
  razonable. Prueba de regresión en `pruebas/progreso.mjs` con las
  fechas y pesos reales de Albert (anonimizado en el comentario si algún
  día hace falta, pero por ahora sigue el mismo criterio que el resto
  del repo de llevar sus datos de ejemplo).
- **Progreso reordenado como pidió Albert**: título → cuatro recuadros
  (peso inicial, peso actual, perdidos, hasta la meta con el ritmo real
  en pequeño dentro del mismo recuadro) → gráfica de peso/meta →
  calendario → gráfica de hábitos. Todo variable por usuario, nada de
  datos de Albert quemados en el layout (los números de su mensaje eran
  solo ejemplo de maquetación).
- **Gráfica de hábitos con selector 7 días / 30 días / Año**, a ancho
  completo del dispositivo (antes se veía apretada). El año agrupa por
  mes (% de días con objetivo cumplido, ≥70% = verde) y solo pinta los
  meses que tengan datos. Inspirado en las referencias de Google
  Fit/Samsung Health que mandó Albert, pero con los colores de marca de
  MichiFit (verde/ámbar/gris), no el tema oscuro del original.
- **Logros se mueve de Progreso a Mi objetivo**, al final del todo — a
  petición de Albert («me sobran ahí, muévelos»).
- Bug de colisión de nombres CSS encontrado y arreglado durante la
  verificación: la clase nueva `.mf-semana7` del gráfico de hábitos
  coincidía con una clase ya existente, sin relación, del selector de
  días de la semana en Mi objetivo (`Pacto.jsx`). Renombrada a
  `.mf-graf7*`. Ver `LESSONS.md`.

## Antes de eso (2026-09-23, mañana — v0.7.9)
Un bug de cálculo real y una funcionalidad pedida por Albert, subidos
juntos como v0.7.9. Detalle completo en `DECISIONS.md`.

- **El bug de las 14,3 semanas: arreglado.** El ritmo real de peso
  miraba TODO el historial de pesajes desde el primero; con un
  historial largo (el CSV importado, típicamente) eso diluía las
  últimas semanas de verdad entre meses de datos viejos. Ahora solo
  mira los últimos 30 días (`DIAS_RITMO_PESO`). Reproducido con datos
  sintéticos antes de arreglarlo, y verificado después en la app real:
  el mismo escenario pasó de mostrar ~22 semanas a 10. `ritmoReal()` se
  movió de `Progreso.jsx` a `engine/calculos.js`, con prueba nueva en
  `pruebas/progreso.mjs`.
- **Cuatro gráficas de 7 días en Progreso**: entreno, pasos, comida y
  sueño (sin macros, a propósito). Reusan `evaluarDia()`, la misma
  función del calendario, así que «cumplido» significa lo mismo en
  toda la app. Mismo lenguaje de color que el calendario (verde/ámbar/
  gris neutro, nunca rojo).
- `SUENO_IDEAL` se sacó de `Marcador.jsx` a `constantes.js` para
  compartirla con las gráficas nuevas.

## Antes de eso (2026-09-22)
Dos avisos de Albert, dos horas después de lanzar la v0.7.6. Detalle
completo en `DECISIONS.md` y `SESSION_MAP.md`.

- **El michi ya no se queda dormido y mudo para siempre.** Era un bug
  de origen (primer commit, 2026-09-08), no un diseño: `calcularEstado`
  devolvía `dormido: abandono >= 2 días`, y desde el 2026-09-11 eso
  bloqueaba los tres botones del aparato — cada toque solo «despertaba»
  la pantalla sin abrir nunca el anillo, porque el abandono no cambia
  por tocar botones. Quien llevara un par de días sin apuntar se
  encontraba el aparato mudo, sin ninguna pista de por qué. Iba contra
  `MECANICA.md` §10 («no castiga por no abrir la app»). Arreglado:
  dormir es ahora SOLO la acción explícita de pulsar «sueño» en el
  anillo. Prueba de regresión en `pruebas/cobertura-michi.mjs`.
- **Copia de seguridad completa, en Ajustes.** El CSV que ya había solo
  exporta los días apuntados; esta copia nueva (JSON) exporta y
  restaura perfil, objetivo, cada día y el michi — todo. Es la defensa
  real contra que el móvil borre `localStorage` sin avisar (falta de
  espacio, Safari limpiando sitios sin abrir, etc.), que no pasa por
  `guardar()` y por eso no se podía detectar. Restaurar SUSTITUYE, no
  fusiona, y ofrece descargar antes lo que hay. `pruebas/backup.mjs`
  prueba el ida y vuelta y que un archivo raro no rompe la app.
- **`navigator.storage.persist()` al arrancar**, silencioso: un ruego al
  navegador para que no limpie el sitio bajo presión de espacio.
  Complementa la copia de arriba, no la sustituye — Safari no tiene un
  equivalente exacto.
- **El icono de guardar, también en Inicio** (v0.7.8, a los pocos
  minutos de probar la v0.7.7): junto al zoom y el «?», arriba de la
  escena — el sitio que se ve nada más abrir la app, para que guardar
  la copia sea un gesto de todos los días y no algo enterrado en
  Ajustes. Mismo archivo, mismo botón de siempre por debajo; solo un
  atajo. Confirmación visual (✅ dos segundos) porque una descarga no
  siempre se nota en el móvil.
- **El brinco de celebrar ya no cambia de fondo** (v0.7.8, mismo aviso
  de Albert: «el michi está andando y al darle mimitos el fondo cambia
  a casa y luego vuelve al parque»). `escenaAutomatica()` forzaba
  siempre «casa» para el brinco de mimar/agua/limpiar/apuntar-sin-
  escena; ahora salta encima de la escena que ya había (parque,
  gimnasio, cocina, casa), solo con la pose. Prueba de regresión en
  `pruebas/cobertura-michi.mjs`.

## Antes de eso (2026-09-19)
**Sesión larga de la mañana** (detalle en `SESSION_MAP.md`):
- Simplificar, en el orden de Albert: hábitos (entreno, pasos, comida,
  peso, sueño el último) en Marcador, editor del día y anillo; Logros se
  funde dentro de Progreso y Ninja ocupa su hueco en el menú; el
  calendario ya no pinta de rojo los días sin datos.
- Progreso: ahora dice cuántas semanas faltan para la meta, la gráfica se
  comprime a la meta, el ritmo previsto sigue lo que de verdad se apunta
  (`actividadReciente`) y `perfil.pesoActual` sigue al último pesaje.
- Entreno y sueño cumplen por apuntar, no por llegar al número.
- Los 40 michis (10 poses × 4 colores) son dibujo de Albert. `pixel/recortar_model_sheets.py` ya
  **no** genera `public/michi/`.

**Última tanda (subida en la `v0.7.5`):**
- **Viñeta nueva del cómic**, la 13 de 15: «Anna lo cura en casa». El
  veterinario pedía 5.000 THB, Anna no los tenía y se llevó a Ninja a
  casa (el texto se cambió después: ver la tanda siguiente). Va entre «La recuperación» y «Ninja feliz». Cinco idiomas.
  Imagen: `public/comic/12b-cuidados.jpg` (de `IMG/Comic/Act_09d.jpg`).
- **Ritmo de las barras: arreglado un fallo de fondo.** Con
  `Math.ceil` la primera caca salía a los **5 minutos** de limpiar, y como
  la caca manda sobre la cara del michi, este estaba asqueado casi
  siempre. Ahora `floor`: la primera caca sale al gastarse el 20% de la
  barra (unas 2,8 h despierto), más o menos cuando vuelve la sed (2,5 h).
  Prueba nueva en `pruebas/cuidados.mjs`. Los números de Albert
  (`AGUA_HORAS` 10, `ORDEN_HORAS` 14, `SED_DESDE` 75) **no se tocaron**.
- **`FORMA_CONTENTO` 90 → 95**: el michi sentado pide constancia casi
  perfecta; el de pie es lo normal.
- **Gimnasio nuevo en uso** (`public/fondos/gimnasio.png`); el viejo está
  en `_CUARENTENA/fondos-antiguos/`. `calle.png` borrada.
- **Michi comiendo, más abajo** (`translate` 3% → 8%, los cuatro colores).
- **«Hasta la meta» con objetivo de ganar peso** ya enseña los kg que
  faltan (antes 0,0).
- `michi_cansado-negro.png` re-exportado por Albert, sin el flequillo.
- **QR de PromptPay encendido, PRIMERO en Karma** (`ACTIVO = true`,
  `public/karma/promptpay_qr.png`, recorte a logo + código). Es el de la
  pareja de Albert, para donativos. Ella lo confirmó antes de subirlo.
- **Al terminar el cómic, «Cerrar» y «Saltar» llevan a Karma** (solo al
  revisar la historia; en el primer arranque sigue yendo a la bienvenida).
- **Los cuatro puntos de simplificar que quedaban (2 a 5 de
  `SIMPLICIDAD.md`), hechos:** HAPPY, WATER y CLEAN pasan a cinco
  puntitos (solo la barra de nivel puntúa); el editor dice cuántos días
  quedan para completar un día; la comida dice su regla real («entre X e
  Y»); y el escudo y el corazón partido se explican (nota bajo la racha y
  cuarto párrafo del «?»). Textos en los cinco idiomas y pruebas nuevas en
  `pruebas/objetivo.mjs`.
- **La cara `cansado` se retira.** Albert borró los cuatro
  `michi_cansado*.png` (eran el dibujo de la botella, igual que el
  sediento) y `michi.js` ya no la da: quien lleva unos días sin apuntar
  ve el michi de pie. `michi_sediento-negro.png` ya está, subido por
  Albert.
- **Botón «Salir» en Karma**, arriba junto al título y abajo del todo, en
  los cinco idiomas (`karma.salir`): quien llega desde el cómic y no sabe
  aún que hay un menú abajo puede volver a Inicio.

**Después de la `v0.7.5` (subido en la `v0.7.6`):**
- **Viñeta 13 con el texto de la pareja de Albert** (escrito por ella en
  tailandés: el veterinario pedía más de 5.000 baht al día; Anna, con sus
  conocimientos de enfermería, se llevó a Ninja, compró material y suero y
  lo curó) y **foto nueva en el collage** de la última pantalla (Ninja
  sentado en la cama). El collage se recomprimió de 940 KB a 240 KB;
  el original de Albert está en `IMG/Ninja_collage_2026-09-19_original.jpg`.
  Caché `michifit-v17`.

## Qué toca ahora, por orden
1. **Nada pendiente de subir.** La `v0.7.13` está en vivo. Ahora toca
   esperar el feedback de amigos y familia — y en particular, con
   varios avisos ya llegados en pocos días, estar atento a si aparece
   algo más de este estilo (algo que llevaba semanas roto y nadie lo
   había probado así).
2. **Calibrar con uso real**: el ritmo de las barras y el 95 de
   `FORMA_CONTENTO`. Cada número está en un solo sitio
   (`engine/cuidados.js`, `engine/constantes.js`).
3. **Mirar cómo lo vive la gente** con lo nuevo de simplicidad: si los
   puntitos se entienden como «cuidado», si la frase de la comida
   confunde al lado del objetivo (dice 1650 al lado de un objetivo de
   1507, porque el margen del 10% es la regla real).
4. **Karma, con los tres bloques**: PromptPay (primero), Buy Me a Coffee y
   Wallet of Satoshi (Lightning). El original entero del QR de Bangkok
   Bank está fuera del repo, en `../_ARCHIVO/qr-promptpay-sin-publicar/`.
   Detalle en `TODO.md`.

## Decidido, «por ahora no» (Albert, 2026-09-19)
- **Cámara para calcular calorías**: no en esta app.
- **Notificaciones push**: no hacen falta. Sigue el calendario (.ics).
- **Cuentas, login y servidor** (Hostinger): **no**. La app sigue estática
  y local-first; cualquiera con el enlace la descarga y usa.
- **Más fotos de Ninja**: no se suben más por ahora.
- **Icono `pasos`**: se queda tal cual.
- **Add-ons cosméticos del nivel 5**: no, por ahora.

## Antes de tocar código: las trampas ya pisadas
Cada una costó un error real; el porqué está en `LESSONS.md` y el detalle
en `SESSION_MAP.md`.
- **Imágenes sin hash** (`/michi`, `/fondos`, `/iconos-anillo`, `/karma`,
  `/ninja`): al **cambiar** una, subir `const CACHE` en `public/sw.js`.
  Una imagen nueva no lo necesita. Lo vigila `pruebas/cache-sw.mjs`.
- **El brinco de celebrar (mimar/agua/limpiar/registrar) no tiene
  escenario propio: usa el que ya había.** No volver a anclarlo a «casa»
  a secas (ver `DECISIONS.md` 2026-09-22).
- **Los 40 michis son dibujo de Albert.** No regenerar `public/michi/`
  con los scripts. Los ajustes de posición se hacen con la propiedad CSS
  `translate` (clase `pose-<nombre>`), **no** con `transform`, que es lo
  que animan la respiración y el sueño.
- **`pruebas/cobertura-michi.mjs` al tocar la mecánica o las poses**:
  comprueba que ningún dibujo queda inalcanzable. Un test en rojo se
  compara con el commit anterior antes de llamarlo «de siempre».
- **Idiomas**: cinco (es, en, th, zh, ja). Una cadena nueva va en `es.js`
  y en los otros cuatro. Usar siempre `var(--fuente)`; las fuentes de
  marca no tienen CJK ni tailandés. La pantallita del aparato usa Press
  Start 2P (solo latín): lo de dentro va transliterado.
- **La palabra «pacto»** no se ve en pantalla (es «objetivo»); en el
  código sigue siendo `pacto`. Lo vigila `pruebas/objetivo.mjs`.
- **Copy sin guiones largos** en los textos de la app.
- **El calendario `.ics`**: `pruebas/calendario.mjs`. CRLF, 75 octetos por
  línea y comas escapadas; si no, el archivo se rompe sin error visible.
- **Seguridad**: cabeceras y CSP en `vercel.json` (un dominio externo
  nuevo hay que abrirlo ahí); nada de `dangerouslySetInnerHTML`; borrar
  los datos exige escribir el número de días.
- **`estado` en `TamagotchiPNG` es el nombre del archivo del michi**, no
  un humor. Y el `new Set` de la cadena de respaldo **no es aseo**: sin
  él, el michi naranja (sin sufijo) se queda invisible.
- **El CSV antiguo**: la columna `sueno` es la puntuación de Garmin (44 a
  85), no horas.
- **Panel de pruebas**: siete toques seguidos en el logo. El panel de
  vista previa del navegador miente en algunas medidas y «lava» el fondo:
  juzgar el aspecto en un navegador de verdad.
- **El michi solo duerme por la acción explícita del anillo**
  (`escenaId === 'dormir'` en `Inicio.jsx`). Nunca por abandono/tiempo:
  eso ya causó un bug real (ver `DECISIONS.md` 2026-09-22). Si algún
  día alguien quiere una señal visual de «llevas días sin abrir esto»,
  que NUNCA bloquee los botones — mirar cuánto tiempo real se ve cada
  estado, no solo si es alcanzable.
- **Nombres de clase CSS son globales, sin scoping.** Antes de poner un
  nombre nuevo (tipo `mf-algo7`), `grep` en `estilos.css` para
  comprobar que no existe ya en otra pantalla — si colisiona, el
  elemento hereda reglas ajenas sin ningún error visible, solo un
  layout raro. Pasó con `.mf-semana7` (v0.7.10): ver `LESSONS.md`.
- **Restaurar una copia de seguridad SUSTITUYE, no fusiona.** El botón
  de Ajustes pasa por `estructuraCompleta` (en `almacen.js`), la misma
  limpieza que ya protege lo que sale de `localStorage`: un archivo
  raro no puede dejar la app en blanco, pero tampoco hay que fiarse de
  su forma sin probarlo — `pruebas/backup.mjs` es el sitio para eso.

## Notas rápidas
- La app es pública y multiusuario en el sentido de que no lleva datos de
  nadie: arranca vacía y cada quien rellena lo suyo.
- Cuatro colores de michi (naranja, gris, blanco, negro). Ninja es gris.
- El michi refleja la **constancia**, no el cuerpo (`MECANICA.md` §5).
- El fondo es `public/fondo.jpg` en mosaico vertical (`repeat-y`).
- El simulador parte del peso actual; ya se sincroniza con el último
  pesaje.
- Sin bloqueadores. (Magnific está conectado pero su plan no da acceso por
  MCP; desde la web funciona.)
