# LESSONS.md — Errores ya cometidos

## La spec original tenia tres formulas rotas
- Que paso: la especificacion escrita del proyecto traia formulas que no se
  podian implementar tal cual.
- Causa real: `forma` estaba invertida — `((BMI_obj - BMI_act)/BMI_obj)*100` da
  **0** justo cuando estas en tu objetivo, no 100, y ademas premiaba adelgazar
  sin limite. `energia` y `estres` no normalizaban: con valores 0-100 aportaban
  hasta 1000 puntos sobre un maximo de 100.
- Solucion: reescritas y documentadas en `MICHIGOCHI-RESUMEN.md`.
- Como evitarlo: **no reimplementar la spec original tal cual**. Si Albert la
  vuelve a pegar, la referencia buena es `MICHIGOCHI-RESUMEN.md`.

## Pixel art: el detalle interior es ruido a 32x32
- Que paso: las dos primeras versiones de los sprites no se leian. Cabeza y
  cuerpo se fundian en una mancha y los "huecos" internos (barriga, pectorales)
  parecian manchas blancas al azar.
- Causa real: a 32x32 lo unico que se lee es la **silueta**. El detalle interno
  compite con ella.
- Solucion: separar cabeza y cuerpo con un cuello, quitar casi todos los huecos
  internos, y expresar las diferencias en el contorno — cintura estrecha para
  el fit, brazos separados por un hueco de un pixel para el hipertrofiado.
- Como evitarlo: al disenar sprites, mirar primero la silueta en negro.

## Recorte de fondo: quitar el blanco no es solo un umbral de brillo
- Que paso: el michi negro salía con un borde blanquecino irregular
  alrededor de todo el cuerpo, en las nueve poses. No era una imagen
  suelta con el fallo: era el propio `fondo_fuera()`.
- Causa real: el JPEG de origen tiene antialias entre el contorno oscuro
  del dibujo y el fondo blanco. Esos píxeles de transición son una
  MEZCLA de los dos, y para un gato negro esa mezcla cae justo por
  debajo del umbral (240) que decide «esto es fondo» — ni tan blancos
  como para que el relleno los alcance, ni tan oscuros como para leerse
  como parte del contorno. Con un michi naranja o gris el mismo
  antialias cae dentro de su propia paleta y no se nota; con uno negro,
  el contraste lo delata.
- Solución: `deshalar()` en `pixel/recortar_model_sheets.py` — una
  segunda pasada que pela cualquier píxel opaco que SIGA tocando ya un
  píxel transparente y sea casi blanco, en varias vueltas.
- Como evitarlo: al recortar un dibujo oscuro sobre fondo claro, mirarlo
  ampliado sobre un fondo de color (nunca blanco): el flequillo es
  invisible sobre blanco y evidente sobre cualquier otro color.

## Scripts de terceros en Windows: `open()` sin encoding
- Que paso: la skill `banana` petaba con `UnicodeDecodeError` al leer
  `settings.json`.
- Causa real: `open()` sin `encoding="utf-8"`. En Windows Python usa cp1252.
  Uno de esos scripts ademas **escribia** `settings.json`, con riesgo de
  corromper caracteres no ASCII.
- Solucion: `encoding="utf-8"` en los nueve `open()` de texto, con `.bak`.
- Como evitarlo: revisar los `open()` de cualquier script Python de terceros
  antes de ejecutarlo. Volvera si se actualiza la skill.

## Un `transform` en un padre rompe `position: fixed`
- Que paso: al tocar un dia del pacto "no se abria" la ventana. Si se abria,
  pero colocada fuera de la pantalla.
- Causa real: `.mf-pagina` tiene una animacion de entrada con `transform`, y
  **un elemento con transform se convierte en el marco de referencia de sus
  hijos `position: fixed`**. La ventana se colocaba respecto a la pagina, no
  respecto a la pantalla: empezaba en y=87 con 849 px de alto sobre un
  viewport de 812, asi que los botones de guardar caian fuera.
- Solucion: las ventanas emergentes se cuelgan del `<body>` con un portal
  (`pantallas/Hoja.jsx`). Inmune tambien a `filter` y `backdrop-filter`.
- Como evitarlo: si algo `fixed` aparece en un sitio raro, mirar si algun
  padre tiene transform, filter o backdrop-filter antes de tocar el z-index.

## Sustituciones de texto que no encajan y fallan en silencio
- Que paso: pedi "escena a cover" y "michi mas pequeño" y aparentemente se
  hicieron, pero al medirlo la escena no tenia ni una regla CSS y el michi
  seguia al 95%. Los parches por sustitucion de cadena no habian encajado y
  no avisaron de nada.
- Causa real: cambiar CSS con `str.replace()` sobre un texto que ya habia
  mutado en un retoque anterior. Si la cadena no aparece, `replace` devuelve
  el original tan tranquilo.
- Como evitarlo: despues de tocar estilos, **medir en el navegador** el
  tamaño real del elemento en vez de fiarse de que el parche entro. Y para
  cambios puntuales usar edicion con verificacion, no sustitucion ciega.

---


## Recortar una hoja de sprites donde los michis se tocan
La hoja de `entrenando` traía a los cinco pegados: las mancuernas de uno
invaden al vecino, así que el truco de siempre —quedarse con la mancha
conexa más grande— devolvía el bloque entero.

Cortar por una columna recta (el valle del perfil vertical) sí los separa,
pero parte mancuernas por la mitad: cada michi acababa con dos medias
pesas. La solución es cortar con **costuras**: un camino vertical que baja
de fila en fila moviéndose como mucho un píxel a los lados y elige la ruta
que cruza menos píxeles pintados (`costura()` en `pixel/recortar_poses.py`).
Cuando hay hueco entre dos michis, pasa por él sin tocar nada.

**Regla:** antes de dar por buena una hoja recortada, monta el contacto
(`revision-<pose>.png`) y míralo. Los tamaños de archivo no dicen nada.


## No se puede mover la carpeta desde la que corre la sesion
Al archivar las apps viejas, `mv 2026_APP_MICHIFIT _ARCHIVO/` fallaba con
«Device or resource busy», y desde PowerShell con «esta siendo utilizado en
otro proceso». La culpa era de la propia sesion de Claude Code: Windows
bloquea el directorio de trabajo de un proceso vivo, y ese era.

**La salida es mover el CONTENIDO, no la carpeta.** Se vacia hacia el
destino (`Get-ChildItem -Force` para llevarse tambien `.git`, `.vercel` y
demas ocultos), y luego se mete dentro el contenido de la carpeta nueva. La
carpeta bloqueada nunca se toca: solo cambia lo que hay dentro. El resultado
es identico y el cwd de la sesion sigue siendo valido todo el rato.

## Una columna que se llama "sueno" no tiene por que ser horas
El CSV de la MichiFit antigua trae `sueno` con valores de 44 a 85. Es la
**puntuacion** de sueño de Garmin, no horas dormidas. Mapearla a
`sueno.horas` habria dicho que Albert durmio 66 horas, y el motor lo habria
dado por bueno.

**Regla:** antes de mapear una columna de un archivo ajeno, mira su rango
real. `min` y `max` cuestan una linea y descartan la mitad de las
interpretaciones erroneas.


## Un numero calculado UNA vez deja de ser verdad al minuto siguiente
El objetivo de calorias se calculaba al crear el pacto y se guardaba. A
partir de ahi, cambiar peso, edad, altura o deficit no lo movia. Tres
personas en el mismo movil veian el mismo numero, y parecia que la
formula estaba rota cuando lo que estaba roto era el guardado.

Peor: en Ajustes se ensenaba «Para perder» recalculado en vivo, y en Mi
pacto el congelado. **Dos numeros distintos para la misma cosa, en dos
pantallas.**

**Regla:** un valor derivado, o se recalcula siempre, o se marca como
elegido a mano. Lo que no puede es quedarse a medias sin que nadie sepa
de donde salio. Aqui: `sincronizarPacto()` recalcula, y `comidaManual`
marca lo que escribio el usuario.

## Un deficit fijo no significa lo mismo para dos cuerpos
500 kcal es un 20% razonable para quien gasta 2.500 y un **37% brutal**
para quien gasta 1.365. Con el mismo numero fijo, la app proponia 865
kcal/dia a una mujer de 72 anos... y justo debajo avisaba de que menos
de 1.500 no es sostenible. **Se contradecia a si misma.**

**Regla:** lo que se aplica a cuerpos distintos se mide en proporcion.
Y un suelo de seguridad que solo avisa no es un suelo: si la app no
puede proponer ese numero, que no lo proponga.

## Las fuentes bonitas no hablan japones
Baloo 2 y Nunito no traen ni un caracter CJK ni tailandes. Sin reservas
explicitas, media app se cae a la fuente por defecto del navegador y se
ve de otra familia; en la fuente de pixeles del tamagotchi (Press Start
2P, solo alfabeto latino) directamente saldrian cuadrados vacios.

**Regla:** al anadir un idioma, mirar primero si las fuentes lo tienen.
Aqui se resolvio con `var(--fuente)` y reservas del sistema, y con
transliterar lo poco que va dentro de la pantallita de pixeles.


## Un campo que se lee con otro nombre del que se guarda no falla: calla
El editor guardaba `sueno: { horas: 8 }` y el motor leia `e.suenoHoras`.
En JavaScript eso no es un error: es `undefined`, y el codigo de al lado
(`== null ? 0 : ...`) lo tomaba por «no hay dato». Resultado: el sueno
que apuntaba el usuario **no afectaba al michi**, y la pantalla si lo
mostraba, porque Inicio y Marcador leian `sueno?.horas ?? suenoHoras`.
Meses funcionando a medias sin un solo error en consola.

Lo mismo con `estres`, que solo entra por el importador y vive bajo
`importado`, y con las columnas del CSV de copia de seguridad: salian
vacias y nadie lo noto.

**Regla:** un campo que se lee desde mas de un sitio se lee por UNA
funcion (`horasDeSueno()`). Y cuando un dato «no afecta a nada», antes
de tocar la formula hay que comprobar que el dato **llega**.

## `dangerouslySetInnerHTML` no es peligroso hoy: lo es dentro de un mes
Las ayudas llevan `<b>` en mitad de la frase y el sitio cambia con el
idioma, asi que no se podian partir. Se resolvio con
`dangerouslySetInnerHTML` y era seguro: solo entraban cadenas del
diccionario, escritas por nosotros.

Pero eran **catorce sitios** donde bastaba escribir `t('x', { nombre })`
para que el nombre de un ejercicio acabara ejecutandose. La seguridad no
puede depender de que nadie toque una linea concreta durante un ano.

**Regla:** si hay una forma de que la clase de bug no exista, se usa. El
componente `<T>` reconoce `<b>` y `<em>` y trata todo lo demas como
texto: aunque le metas un `<script>`, sale escrito en pantalla.

## Una app publica sin cabeceras es una app a medio publicar
No habia ni CSP, ni `X-Frame-Options`, ni `nosniff`. Cualquiera podia
meter MichiFit en un iframe y montar un clickjacking encima.

**Regla:** antes de abrir algo al publico, `curl -I` a la URL. Si no
salen cabeceras de seguridad, es que no hay. En Vercel se ponen en
`vercel.json`, y hay que comprobar despues que la CSP no rompe nada:
aqui habia que dejar pasar `fonts.googleapis.com` en `style-src` y
`fonts.gstatic.com` en `font-src`.

## Un CSV no es solo texto separado por comas
`aCSV` unia valores con `join(',')` sin escapar nada. Con numeros
funciona; el dia que se exporte un nombre de ejercicio con una coma, el
archivo se descoloca en silencio. Y peor: un texto que empiece por `=`
lo ejecuta Excel **como formula** al abrir la copia.

**Regla:** al generar un CSV, entrecomillar siempre lo que lleve comas o
comillas, y anteponer un apostrofo a `=`, `+`, `-` y `@`.

## El tono es un circulo, no una recta

Al tenir los michis, los mofletes rosas salian como **anillos huecos**:
el centro teñido, el borde no. La causa: para decidir si un pixel era
rosa se comparaba `abs(h - h0) < 16`. Pero el tono da la vuelta — 355° y
5° estan a 10 grados uno del otro, y esa resta dice 350.

El moflete no es de un solo tono: el centro cae a 350° y el borde
resbala hacia el 0. Media corona se quedaba fuera por aritmetica.

**Regla:** cualquier comparacion de tonos pasa por `distanciaTono()`, que
mide por el camino corto. Lo mismo vale para angulos, horas y meses:
**si el valor da la vuelta, restar no sirve.**

## El pixel art hay que mirarlo ampliado, aunque se vea a 60 px

Dos errores del mismo dia —los mofletes en anillo y el michi blanco sin
ojos— pasaron la revision **a tamaño real** sin que se vieran. Aparecieron
al ampliar las caras 3-4x. Uno de los dos llego a produccion.

A 60 px cada pixel del sprite es medio pixel de pantalla: el navegador
promedia y tapa el error. Ampliado, salta a la vista.

**Regla:** al tocar sprites, mirar siempre un recorte ampliado de la
CARA, que es donde esta toda la informacion. Y comparar contra el
original, no contra el recuerdo del original.

## Codigo de proteccion que nunca llego a proteger nada

Escribi una guarda para no pisar los michis que Albert habia retocado a
mano. Luego lance el script y **le pise siete dibujos**. La guarda
buscaba una cadena que en el archivo no estaba tal cual, asi que no
coincidia nunca y el `if` era decorativo: parecia que protegia y no
protegia.

Lo peor no es el error, es que **no habia forma de enterarse**. Un
salvavidas roto es peor que no tener salvavidas, porque te lleva a
saltar.

**Regla:** una guarda que evita algo hay que verlas fallar A PROPOSITO
antes de fiarse. Probar los dos caminos: que protege lo que debe (lanzar
sin `--forzar` y comprobar que NO se toca) y que se aparta cuando se lo
pides (`--forzar` y comprobar que SI se toca). Si solo se prueba el
camino feliz, no se ha probado nada.

## Una cache sin hash es una bomba de relojeria

Las imagenes de `public/` no llevan hash en el nombre, y el service
worker las sirve desde la cache primero. Corregir `michi_triste.png` sin
subir `const CACHE` no arregla nada para quien ya abrio la app: sigue
viendo el dibujo viejo, sin error y sin forma de enterarse. Paso de
verdad con los michis gris y blanco, corregidos dos veces mientras la
version se quedaba en v2.

**Regla:** al tocar cualquier imagen de `public/`, subir `const CACHE` en
el mismo commit. `node pruebas/cache-sw.mjs` avisa.

## Comparar el principio con el final no es mirar la historia

La primera version de esa prueba hacia `git diff <commit>..HEAD`. Un
archivo que nace en un commit y se corrige en el siguiente sale como
«anadido» al comparar extremos, porque al principio no existia — y ese es
justo el caso peligroso, el que deja la version rota en la cache de quien
paso por en medio. La prueba veia 1 cambio donde habia 42, y habria dado
por bueno el fallo que venia a cazar.

**Regla:** cuando lo que importa es lo que PASO, recorrer los commits
(`git log --name-status`). `git diff A..B` cuenta el resultado, no el
camino.

## El idioma se escapa por los sitios que no se leen

La app hablaba cinco idiomas desde hacia dos dias, y los tres botones del
tamagotchi —la interaccion principal— seguian en castellano. Nadie lo
vio porque estaban en un `const BOTONES` como propiedad `titulo`, no como
texto en el JSX, y salen por `title` y `aria-label`: en la pantalla no se
ven hasta que pasas el raton o usas un lector.

**Regla:** al revisar traducciones, buscar tambien fuera del JSX. Los
`aria-label`, los `title`, los `alt` y las tablas de constantes son texto
para el usuario aunque no se lean a simple vista.

## Restaurar algo parcheado: guardar el original, nunca `delete`

Probando el aviso de guardado, parchee `Storage.prototype.setItem` para
que fallara y luego hice `delete Storage.prototype.setItem` para
devolverlo. El `delete` no restaura la nativa: la quita, y `setItem`
queda en `undefined`. Como el aviso seguia saliendo, por un momento
parecio que el codigo estaba mal cuando lo que estaba mal era la prueba.

**Regla:** `const original = obj.metodo` antes de parchear, y
`obj.metodo = original` para devolverlo. Y antes de creerse que el codigo
falla, comprobar que la prueba mide lo que dice medir.

## Una cadena de respaldo con dos eslabones iguales no es una cadena

`TamagotchiPNG` prueba varias rutas hasta encontrar un dibujo que exista.
Con el michi naranja —que no lleva sufijo de color— los dos primeros
candidatos salian LA MISMA URL. Al fallar el primero, el respaldo
reintentaba exactamente lo mismo: React no veia cambiar el `src`, el
navegador no volvia a pedir un 404 que ya conocia, no saltaba otro
`onError`, y el michi se quedaba invisible. Con el gris y el blanco
funcionaba, porque sus rutas si eran distintas.

Llevaba ahi desde que existe la cadena. Solo salio al pedir un dibujo
que aun no existe (`michi_sediento`).

**Regla:** una lista de alternativas se deduplica al construirla
(`[...new Set(...)]`). Y al probar un respaldo, probarlo en la variante
por DEFECTO: es la que usa casi todo el mundo y suele ser el caso
especial, no el general.

## Un anzuelo que tapa el producto deja de ser un anzuelo

Las barras de agua y orden se pusieron para dar un motivo de volver a la
app. Al conectarlas, puse «tiene sed» por delante de «viene cumpliendo»
en el humor del michi, razonando que se arregla en un toque y conviene
verlo. Pero el cuenco se vacia solo cada dieciseis horas de vigilia: el
resultado era que quien no descubriera el boton del agua **no volvia a
ver a su michi contento jamas**, por bien que llevara el pacto. Los dos
dibujos mas importantes de la app se volvieron inalcanzables.

`pruebas/cobertura-michi.mjs` lo dijo en la primera ejecucion. Sin ella
habria llegado a produccion y habria parecido «que la app va triste».

**Regla:** al añadir un estado nuevo que compite con los de siempre,
mirar que no los deje sin sitio. Y si el estado nuevo se activa SOLO —por
un reloj, no por el usuario— tiene prioridad baja por definicion: lo que
el usuario hace tiene que poder ganarle.

## Tenir el pelaje no es tenir el dibujo

`tenir_michi.py` cambiaba el tono de TODO lo claro y saturado, mirara el
color que mirara. Funcionaba porque en los michis solo habia tres cosas:
pelaje naranja, mofletes rosas (con su caso aparte) y contorno oscuro.

Al llegar `michi_sediento` y `michi_asqueado` eso dejo de ser cierto. El
michi gris salio con la botella de agua GRIS y con la cara de asco GRIS
—o sea, sin la unica informacion que da cada dibujo—. La regla llevaba
razon todo el tiempo hasta que el material cambio debajo.

**Regla:** una transformacion que se aplica «a todo» hay que volver a
mirarla cada vez que entra material nuevo. Y al filtrar por color,
filtrar por lo que SI se quiere tocar (el arco naranja del pelaje), no
por descarte de lo que se conoce: lo que no se conoce todavia entra solo
en el segundo caso.

## Una prueba que depende de la hora no prueba nada

`pruebas/cuidados.mjs` comprobaba que un michi recien adoptado tiene las
barras al 100. Usaba `Date.now()` por debajo, y el reloj de los cuidados
arranca al mediodia del dia en que se creo el pacto. Resultado: pasaba
por la mañana y fallaba por la tarde, porque a las cinco ya han corrido
cinco horas de vigilia y el cuenco ha bajado — que es justo lo correcto.

Lo peligroso no es que fallara, es lo contrario: una prueba asi tambien
puede PASAR por casualidad y tapar un fallo de verdad segun a que hora
la lances.

**Regla:** si lo que se prueba depende del tiempo, el tiempo se pasa como
dato (`ahora`), nunca se lee del reloj. Y la comprobacion se escribe
sobre lo que de verdad importa —«no llega a tener sed»— y no sobre un
numero exacto que solo es cierto en un instante.

## Una expresion regular no sabe leer comillas

Para renombrar «pacto» en los diccionarios use una expresion regular que
cogia lo que hubiera entre comillas simples, para tocar los valores y no
las claves. El comentario de cabecera de `en.js` lleva un `doesn't`, y
ese apostrofo desemparejo todas las comillas del resto del archivo: a
partir de ahi la expresion emparejaba el cierre de una cadena con la
apertura de la siguiente, y lo que quedaba en medio eran CLAVES. Renombro
`pacto:` a `goalo:` y el diccionario ingles se quedo sin su seccion.

Lo que lo salvo fue comprobar despues que las cinco lenguas seguian
teniendo las mismas claves. Sin esa comprobacion, el ingles se habria
subido roto.

**Regla:** para tocar solo el valor de `clave: 'valor'`, partir la LINEA
por el primer `: ` y trabajar con la derecha. Es feo y no falla. Y
despues de cualquier cambio masivo en los diccionarios, comparar la
lista de claves de los cinco: si una lengua tiene una clave distinta, es
que algo se ha renombrado sin querer.

## Una copia atrasada y un despliegue a mano se ven igual desde fuera

El 2026-09-14 produccion servia `michifit-v6` y el disco ponia `v5`. La
lectura inmediata fue la alarmante: alguien habia desplegado a mano algo
que no estaba commiteado, o sea trabajo que solo existia en Vercel y que
se podia perder.

Era lo contrario, y lo tranquilo: **esta copia del repositorio estaba
cuatro commits atras**. Se clono el 12, el 13 se trabajo desde otro sitio,
y aqui nadie hizo `git pull`. Todo estaba a salvo en GitHub.

Las dos situaciones producen exactamente el mismo sintoma —produccion por
delante del disco— y ninguna se distingue de la otra mirando solo lo
local. Lo que las separa es **una sola orden**, y va antes que cualquier
diagnostico:

```
git fetch --all && git log --all --oneline
```

Si aparecen commits que no tenias, era una copia atrasada. Si no aparece
nada y produccion sigue por delante, entonces si: hay un despliegue sin
commitear y hay prisa.

Lo que ademas ayudo a entenderlo fue leer el `sw.js` **desplegado**: su
comentario contaba por que subia a v6 y de que dia era. Los comentarios
que explican el motivo, y no el mecanismo, funcionaron de bitacora desde
dentro de produccion.

**Regla:** ante cualquier desajuste entre lo desplegado y el disco, lo
primero es `git fetch`, antes de sacar conclusiones. Y al empezar sesion
en un proyecto que se toca desde varios sitios, `git pull` de entrada —
por eso esta ahora en `VERSION.md` y en el punto 0 de `CLAUDE.md`.

## Un reemplazo por NOMBRE DE CLAVE pisa la primera que encuentre

El 2026-09-16, al quitar los guiones largos, se cambio `ayuda2` en los
cinco diccionarios buscando la clave por su nombre. Pero `ayuda2` existe
en SEIS pantallas —cada una tiene su ayuda— y el reemplazo piso la
primera, que era la de otra pantalla, en los cinco idiomas.

Se vio porque el propio script contaba los guiones que quedaban y seguia
saliendo uno. Se deshizo con `git checkout` y se repitio buscando la
clave Y un trozo de su texto.

La regla: en `src/i18n/` las claves NO son unicas, porque van anidadas
por pantalla. Para cambiar un texto concreto, se localiza por su
contenido, y despues se mira `git diff --stat`: tiene que haber
cambiado exactamente lo que se pretendia y nada mas.

## Con el panel del navegador oculto, las animaciones no avanzan

Tambien el 2026-09-16: el mensaje de «es analogico» media 8 px de hueco
con «EN CASA» en vez de 2. Parecia un fallo de la animacion de entrada
—se habia quedado a 4 px de su sitio— y se llego a «arreglar». No lo
era: `document.visibilityState` era `hidden`, y en una pagina oculta el
navegador no avanza las animaciones, asi que se quedan en el primer
fotograma. Con la animacion quitada solo para medir, el hueco eran 2 px.

Es la misma familia que la viñeta de 6x6 px del mismo dia: el panel
oculto miente en las medidas. Antes de creerse un numero raro, mirar
`innerWidth`, `innerHeight` y `document.visibilityState`.

## «El único fallo es el de siempre» sin haberlo comprobado
- Que paso: la sesión del móvil que pasó entreno y sueño a «cumplen por
  apuntar» (2026-09-18) dio por bueno un test en rojo,
  `pruebas/cobertura-michi.mjs`, con la nota «es el de siempre, sin
  relación». Se fusionó a `main` y llegó a producción con el michi de pie
  inalcanzable.
- Causa real: no era de siempre. En el commit anterior el test pasaba con
  los 11 dibujos. El cambio de regla subió la `forma` de casi todos por
  encima del umbral de `contento`, y esa cara se tragó a la de pie.
- Solucion: umbral de `contento` a 90 en `constantes.js` y prueba de
  barrido que exige que de pie ocupe más escala que contento.
- Como evitarlo: **un test en rojo se compara con el commit anterior antes
  de llamarlo «de siempre»** (`git worktree add` a un commit viejo y
  lanzarlo ahí). Y una sesión sin el repositorio delante no debería
  tocar la mecánica: `PROTOCOL.md` ya lo decía.

## Dos reglas razonables que juntas rompen el estado por defecto
- Que paso: el 2026-09-16 se pidio «asqueado en cuanto haya UNA caca», y ya
  existia un `Math.ceil` que hacia salir la primera caca en cuanto la
  barra dejaba de estar llena. Cada regla, sola, era sensata. Juntas: a los
  5 minutos de limpiar salia otra caca y el michi estaba asqueado casi
  siempre, y el de pie —lo que Albert queria ver mas— era casi
  inalcanzable en el uso real. Los tests no lo veian: comprobaban el orden
  de las caras, no cuanto TIEMPO se ve cada una.
- Solucion: `Math.floor`, y una prueba que fija que a los 5 minutos de
  limpiar no hay caca.
- Como evitarlo: cuando una regla nueva pasa a mandar sobre una cara, mirar
  cuanto tiempo real se ve cada estado tras cuidar al michi (una tabla de
  minutos, como la de `SESSION_MAP.md` del 2026-09-19), no solo que todos
  sean alcanzables. `cobertura-michi` prueba lo segundo, no lo primero.

## Un archivo dejado en `public/` se publica, aunque no lo pidas
- Que paso: el 2026-09-19 aparecio un QR de PromptPay en `public/karma/`
  mientras se trabajaba. Llevaba el nombre completo y el numero de
  identidad nacional de una persona. Estaba a un `git add -A` de un
  repositorio publico. (Ya habia pasado con el video del envenenamiento,
  el 2026-09-16.) Luego resulto ser deliberado —su duena lo queria para
  donativos—, pero eso solo se supo despues: se retiro por precaucion y se
  volvio a montar con el ok.
- Como evitarlo: antes de cualquier commit, `git status` y mirar todo lo
  que salga como sin seguir (`??`). Lo que no se vaya a publicar no vive
  en `public/`, ni siquiera un rato: va a `../_ARCHIVO/`.

## Un documento de propuestas se queda viejo en silencio
- Que paso: `SIMPLICIDAD.md` decia que «solo esta hecho el punto 1» y que
  hacia falta avisar cuando el michi te cubre un dia. Al ir a hacerlo
  (2026-09-19) resulto que Inicio ya llevaba ese aviso, y que la regla
  «no queda `dangerouslySetInnerHTML`» era falsa en tres lineas de Inicio.
- Como evitarlo: antes de construir algo que un documento da por pendiente,
  mirar la pantalla y buscar en el codigo si ya esta. Y cuando algo de una
  lista de propuestas se hace, marcarlo en esa lista el mismo dia.

## Un campo que cambia de trabajo sin que nadie lo revise
- Qué pasó: `dormido: abandono >= 2` nació el primer día del proyecto
  (2026-09-08) para elegir un DIBUJO, sin consecuencias. El 2026-09-11
  se reusó para BLOQUEAR los tres botones cuando el michi «duerme» —
  un trabajo mucho más serio, con el mismo umbral de dos días sin
  tocar nada. Nadie se preguntó entonces si «dos días» seguía siendo
  razonable para ese uso nuevo, porque el campo ya existía y hacía casi
  lo que hacía falta. El resultado, descubierto por Albert el
  2026-09-22: cualquiera que llevara un par de días sin apuntar se
  encontraba el aparato mudo para siempre, sin ninguna pista de por
  qué. Iba contra la regla más repetida del proyecto (`MECANICA.md`
  §10, «no castiga por no abrir la app») y nadie lo vio en catorce días.
- Cómo evitarlo: cuando un campo que ya existe se reutiliza para un
  trabajo con consecuencias más serias que el original (aquí: de
  «qué dibujo pintar» a «bloquear toda la interacción»), tratarlo como
  si fuera nuevo — releer su definición entera y preguntarse si el
  umbral sigue teniendo sentido para lo que va a hacer ahora. El
  nombre del campo (`dormido`) sonaba a la escena correcta y eso bastó
  para no mirar más allá.
