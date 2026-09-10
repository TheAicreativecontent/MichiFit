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
- Última acción (2026-09-09, tarde): **revisión antes de abrir al
  público**. 6 errores arreglados, 4 asuntos de seguridad cerrados y el
  código muerto a `_CUARENTENA/`. Ver `SESSION_MAP.md` y `LESSONS.md`.
- Última acción (2026-09-09, tarde): **el michi cambia de sentido**. Ya no
  refleja tu cuerpo sino tu constancia, y tiene una sola silueta. Nueve
  dibujos conectados. Ver abajo.
- Última acción (2026-09-10): **Ninja tiene nombre, historia y tres
  colores**, y el pacto ya se lleva al calendario del móvil. Ver abajo y
  en `SESSION_MAP.md`.
- Última acción (2026-09-11): **revisión del código**. Un fallo que ya
  estaba en producción (la caché del service worker), los botones del
  aparato hablaban castellano en los cinco idiomas, y el aviso de que
  el navegador no puede guardar. Ver abajo.
- Última acción (2026-09-11, tarde): **el aparato pasa a ser la
  interfaz**. Dos anillos en los tres botones, dos barras nuevas (agua
  y orden) y vista previa de la escena al elegir qué apuntar. Ver abajo.
- Última acción (2026-09-11, noche): **la app ya cuenta quién es
  Ninja**. Seis actos al primer arranque y un botón en Ajustes. Ver
  abajo.
- Próximo paso: las fotos del Ninja real y las viñetas del cómic, las
  dos cosas de Alberto. El sitio ya está hecho en los dos casos.
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

## El michi (replanteado el 2026-09-09)
Varias personas probaron la app y dijeron lo mismo sin ponerse de acuerdo:
no entendían para qué servía el gato, y no querían identificarse con un
cuerpo grande ni con uno pequeño. Se quitaron las cinco siluetas.

**El michi refleja tu constancia, no tu cuerpo.** Una sola silueta, y lo
que cambia es lo que hace y cómo se siente:

| Manda | Qué se ve |
|-------|-----------|
| 1. acción reciente (apuntas algo) | comiendo, entrenando · unos segundos |
| 2. escena elegida a mano (botón azul) | las cinco del ciclo |
| 3. su humor | contento, cansado, triste |
| 4. lo que hiciste hoy | entrenando, andando |
| 5. nada de lo anterior | de pie, en casa |

**El humor sale de `forma`, no de `animo`.** Es importante: con `animo` el
michi no salía contento casi nunca, porque para subirlo había que apuntar
el día y al apuntarlo ganaba la escena y tapaba el humor.

`pruebas/cobertura-michi.mjs` comprueba que los nueve dibujos se ven en
algún estado posible. **Lánzalo al tocar la mecánica o al añadir poses**:
no prueba que el código funcione, prueba que ningún dibujo queda
inalcanzable. Ya pasó una vez sin que nadie se enterara.

Los dibujos se normalizan con `pixel/normalizar_michis.py` (320x320,
transparentes, apoyados abajo). Lo que importa ahí es que el GATO mida lo
mismo en todas las poses, no que cada dibujo llene el lienzo.

## El calendario (2026-09-10)
Mi pacto → «Ponlo en tu calendario» genera un `.ics` con los entrenos
semanales y un recordatorio diario a las 21:30 para apuntar el día.
Lo hace `src/datos/calendario.js`, que **no sabe de idiomas**: los
textos se los pasa Pacto.jsx ya traducidos, porque van dentro de los
eventos y se leen fuera de la app.

Es lo más cerca de una notificación que se puede llegar sin servidor.
Las push de verdad necesitan un backend con claves VAPID, y eso rompería
que los datos no salgan del dispositivo. Ver `ASK.md`.

`pruebas/calendario.mjs` valida el archivo. **Lánzalo si tocas algo de
ahí**: iCalendar tiene tres reglas que rompen el archivo entero y no dan
error visible — CRLF obligatorio, 75 OCTETOS por línea (en japonés un
carácter son tres) y comas escapadas.

## Ninja y los tres colores (2026-09-10)

El michi se llama **Ninja** y tiene historia: `LORE.md`. Es un gatito
callejero de Bangkok al que envenenaron y al que salvaron a tiempo. **La
app todavía no lo cuenta** — es lo primero del `TODO.md`.

Ninja es **gris atigrado**. En Ajustes se elige entre naranja, gris y
blanco; el naranja y el blanco no son otro Ninja, son otros gatos. La app
arranca hoy en naranja y eso está sin decidir (`ASK.md`).

Los colores **no están dibujados tres veces**: el michi es un 99%
monocromático y se tiñe por código, `python pixel/tenir_michi.py`. Dos
cosas que hay que saber antes de tocar ese script:

- **El tono es un círculo, no una recta.** Comparar `Math.abs(h - h0)` a
  secas deja fuera los píxeles al otro lado del 0°. Fue lo que dejó los
  mofletes como anillos huecos. Usa `distanciaTono()`.
- **Los píxeles oscuros se protegen por luminosidad, no por saturación.**
  El contorno marrón está saturado y el filtro de saturación no lo
  salvaba: el michi blanco se quedó sin ojos.
- **Y no pisa lo retocado a mano**: si un PNG de `public/michi/` es más
  nuevo que su original, el script lo respeta. `--forzar` lo salta.

Míralo siempre ampliado. Los dos errores de arriba eran invisibles a
tamaño real y llegaron a producción.

## La revisión del 2026-09-11

Repaso entero buscando errores, cosas dobles, cosas sueltas y agujeros de
seguridad. **De seguridad no salió nada**: no hay `dangerouslySetInnerHTML`
ni `eval`, las cabeceras siguen puestas en producción, el importador de
CSV valida fecha y números y tira el resto, el único enlace externo lleva
`rel="noopener noreferrer"` y el QR de Lightning es un PNG local, no una
llamada a ninguna API. Salieron tres cosas de fondo:

**1. La caché del service worker se había quedado atrás, y estaba en
producción.** `CACHE` seguía en `michifit-v2` desde diez commits antes,
pero los michis gris y blanco se corrigieron DOS veces (los ojos, los
mofletes) con el mismo nombre de archivo. El service worker sirve esas
imágenes desde la caché primero, así que quien abriera la app entre medias
se quedaba con los gatos rotos **para siempre**, sin error ni aviso.
Subido a `michifit-v3`, y ahora `pruebas/cache-sw.mjs` lo vigila.

**Ojo con esa prueba**: hay que mirar commit a commit, no comparar el
primero con el último. Un archivo que nace y se corrige después sale como
«añadido» si comparas extremos — y ése es justo el caso peligroso. La
primera versión de la prueba veía 1 cambio donde había 42.

**2. Los botones del aparato hablaban castellano en los cinco idiomas.**
`Mimar`, `Cambiar de escena`, `Dormir` y `Cómo va` estaban escritos a
pelo en `TamagotchiPNG.jsx`, y salen como `title` (que se ve al pasar el
ratón) y como `aria-label`. Son la interacción principal de la app. Ahora
son `aparato.mimar`, `aparato.escena`, `aparato.dormir` y
`aparato.comoVa`, con los términos que ya usaba `aparato.nota` en cada
idioma. El botón «+» usa `nav.anadir`, que estaba traducido y sin
conectar.

**3. Si el navegador no deja guardar, ahora se dice.** `guardar()`
devolvía `false` en ventana privada o con el almacenamiento lleno y nadie
miraba ese valor: se podía pasar el día apuntando peso y comidas para que
al cerrar no quedara nada. Ahora sale un aviso (`avisos.noGuarda`).

Y lo pequeño: `.mf-pruebas` estaba duplicado literalmente en el CSS —no
costaba bytes, el minificador ya los juntaba, pero tocar un bloque y que
mandara el otro sí era una trampa—, cuatro variables muertas, la `t` del
traductor tapada dentro de `tocarLogo`, un `%s` de Python metido en un
`.mjs`, y a `_CUARENTENA/` los nombres de días en castellano fijo y
cuatro PNG sueltos de la raíz.

Comprobado en el navegador: los botones en japonés, y el aviso de guardado
apareciendo y desapareciendo al romper y arreglar `localStorage`.

## El aparato es la interfaz (2026-09-11)

Los tres botones eran un juguete —corazones, cambiar decorado, dormir— y
no tocaban ningún dato. Ahora:

| Botón | En reposo | Dentro de un anillo |
|---|---|---|
| izquierda | anillo de CUIDAR | salir |
| centro | anillo de MEDIR | siguiente icono |
| derecha | dormir | aceptar |

Cuidar: mimar · agua · limpiar. Medir: comida · entreno · pasos · sueño,
y al aceptar se abre `EditorDia` **filtrado a ese dato** (prop `solo`).
Mientras mueves el cursor por el anillo de medir, la pantalla **enseña
ya lo que vas a apuntar**: sobre «pasos», el michi andando por la calle.

Toda la gramática vive en `src/mascota/anillos.js`. Los iconos son emoji
de momento; se cambian ahí por los PNG de Alberto cuando estén.

**Tres salidas, y hacen falta**: el icono ✕, el botón izquierdo desde
cualquier sitio, y la vuelta sola a los 8 s. Un tamagotchi venía con
manual de papel; esto no.

### Las barras de agua y orden

`engine/cuidados.js`. Bajan con las horas de VIGILIA (16 y 24) y se
rellenan con un botón; al bajar CLEAN salen cacas kawaii de una en una.

**Son el anzuelo, no la mecánica**, y esto está probado y no solo dicho:
`pruebas/cuidados.mjs` comprueba campo por campo que con el cuenco lleno
y con el cuenco vacío salen el mismo nivel, la misma experiencia, el
mismo HAPPY y el mismo cumplimiento. Si alguna vez esa prueba se pone en
rojo, es que el bucle ha empezado a premiar pulsar botones.

**Y cumplir manda sobre tener sed.** Está en `estadoVisual`, con el
comentario de por qué: al ponerlo al revés —que es lo primero que hice—
el cuenco se vacía solo cada 16 horas, así que quien no descubriera el
botón del agua **no volvía a ver a su michi contento nunca**. Lo cazó
`pruebas/cobertura-michi.mjs` al momento.

### Si tocas los dibujos del michi

La cadena de respaldo de `TamagotchiPNG` lleva un `new Set` que **no es
aseo**: el michi naranja no tiene sufijo, así que sus dos primeros
candidatos salían idénticos y el respaldo reintentaba la misma URL para
siempre. El michi se quedaba invisible. No lo quites.

## La historia de Ninja, dentro de la app (2026-09-11)

`pantallas/Lore.jsx`. Seis actos, uno por pantalla, dos frases cada uno.
Sale sola la **primera vez, antes de pedir ningún dato** —el botón final
dice «Adoptar a Ninja» y lleva a la bienvenida— y queda siempre a mano
en Ajustes, donde el botón dice «Cerrar».

Que ya se ha visto se guarda en `datos.loreVisto`, no en memoria: si no,
cerrar y abrir la app volvería a contar la historia entera. Es lo mismo
que se hizo con `nivelVisto` y por la misma razón.

**Las ilustraciones no son las viñetas del cómic**: son el propio michi
**en gris** —Ninja es gris— sobre los escenarios que ya existen. Los
prompts de las 21 viñetas están escritos pero sin generar. Cuando
existan, se cambian las rutas de `ESCENAS` en `Lore.jsx` y no hay que
tocar nada más.

Dos actos van **oscuros** (el escobazo y el veneno): la escena se apaga,
se tiñe de azul y le cae lluvia por encima. No se enseña nada explícito,
que es la misma decisión de tono que el cómic — del agresor solo la
sombra.

**Las fotos del Ninja de verdad** van en `src/datos/ninja.js`: una lista
escrita a mano con los archivos de `public/ninja/`. Es un manifiesto y
no una lectura de carpeta porque la app se sirve estática, sin servidor
que liste directorios. Si la lista está vacía, esa pantalla enseña al
michi contento y funciona igual. **Al añadir fotos hay que subir
`const CACHE` en `public/sw.js`**: no llevan hash en el nombre.

Comprobado en móvil de 375 y de 320, en tailandés (el texto más largo) y
con la letra al 130%: sin scroll lateral, el pie entero dentro y el
texto desplazable sin cortar el principio.

## Los cuatro suelos de seguridad (2026-09-11)

`avisosDeSeguridad()` en `engine/calculos.js`. Son la promesa más seria
que hace la app —`MECANICA.md` §10— y **ninguno impone nada**: dicen el
dato y siguen.

| suelo | salta cuando | constante |
|---|---|---|
| IMC | la meta baja de 18,5 | `IMC_MINIMO_SANO` |
| calorías | por debajo de 1.500 (hombre) / 1.200 (mujer) | `KCAL_MINIMAS` |
| ritmo | bajar más rápido de lo sano | `RITMO_MAXIMO_SEMANAL` |
| **grasa** | por debajo de 0,6 g por kilo de peso meta | `GRASA_MINIMA_POR_KG` |

El de la grasa se añadió al preguntar Alberto por qué le salían 47 g
donde la app antigua le daba 67. La respuesta: pesa 13 kg menos (el
reposo baja 133 kcal, correcto) **y** el reparto cambió del 30% al 25%
de grasa. Y detrás había algo peor: la grasa es la única macro que baja
sin freno, porque la proteína va fija y los carbos son lo que sobra.

**La app avisa pero NO cambia el reparto.** Es decisión de Alberto y
está en `DECISIONS.md`. `pruebas/avisos.mjs` fija los dos números de
`macros()` a propósito: si alguien mete un suelo duro ahí, la prueba se
cae y hay que decidirlo, no que pase de refilón.

Está calibrado para no ser ruido: salta a 47 g y se calla a 50.

## Seguridad (revisado el 2026-09-09)
- Las cabeceras van en `vercel.json`: CSP, X-Frame-Options, nosniff,
  Referrer-Policy, Permissions-Policy y HSTS. **Si algún día se añade un
  dominio externo (una fuente, una API), hay que abrirlo en la CSP o el
  navegador lo bloqueará en silencio.**
- Para texto con `<b>` dentro se usa `<T k="clave" />` de
  `src/i18n/Texto.jsx`. **No volver a `dangerouslySetInnerHTML`.**
- Borrar todos los datos exige escribir el **número de días** que se
  pierden (`BorrarTodo` en `Ajustes.jsx`). Se eligió un número y no una
  palabra porque se teclea igual en cualquier idioma. **No sustituirlo
  por un `confirm()`**: es lo único irreversible de la app.
- `aCSV()` escapa comas, comillas y fórmulas de Excel. Si se añade una
  columna de texto libre, ya está cubierto.

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
- El michi es **pixel art dentro de un tamagotchi SVG**, y desde el
  2026-09-10 se elige el color en Ajustes: naranja, gris o blanco. El
  componente vectorial antiguo (`mascota/Michi.jsx`) ya no se usa en
  ninguna pantalla; está en `_CUARENTENA/`.
- El fondo es `public/fondo.jpg` (520x700), en mosaico vertical
  (`repeat-y`) sobre `.mf-app`. La nota que había aquí decía `.png`,
  880x1186 y «no ponerlo en mosaico»: eran de un fondo anterior, que ya
  no está. Corregido el 2026-09-11 leyendo el CSS.
- Aviso al revisar: el panel de vista previa del navegador **lava toda la
  página** cuando hay una capa fija con opacidad, aunque esté vacía. Es un
  artefacto del panel, no de la CSS. Juzgar el fondo en un navegador de verdad.
