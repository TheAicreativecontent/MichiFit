# LESSONS.md — Errores ya cometidos

## La spec original tenia tres formulas rotas
- Que paso: la especificacion escrita del proyecto traia formulas que no se
  podian implementar tal cual.
- Causa real: `forma` estaba invertida — `((BMI_obj - BMI_act)/BMI_obj)*100` da
  **0** justo cuando estas en tu objetivo, no 100, y ademas premiaba adelgazar
  sin limite. `energia` y `estres` no normalizaban: con valores 0-100 aportaban
  hasta 1000 puntos sobre un maximo de 100.
- Solucion: reescritas y documentadas en `MICHIGOCHI-RESUMEN.md`.
- Como evitarlo: **no reimplementar la spec original tal cual**. Si Alberto la
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
`sueno.horas` habria dicho que Alberto durmio 66 horas, y el motor lo habria
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

Escribi una guarda para no pisar los michis que Alberto habia retocado a
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
