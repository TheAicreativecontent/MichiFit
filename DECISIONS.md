# DECISIONS.md — Decisiones de diseno y su razon

## 2026-09-14 — El aparato se puede ampliar, y el zoom va en un BOTÓN

Petición de Albert, y con una razón de fondo que conviene no perder:
**en el futuro quiere que el anillo se vea SIEMPRE en la parte de abajo,
dentro de la pantalla del michi.** El zoom no es un capricho de ver más
grande: es el sitio donde va a caber eso.

Dijo «un botón o clicar la pantalla». Va en un botón, y no por gusto:
**el cristal ya está cogido**. Tocarlo hace que el michi te cuente cómo
vas, desde que los tres botones pasaron a ser la interfaz el 2026-09-11.
Poner el zoom ahí habría quitado algo que ya existía y funciona.

Se amplía con `transform: scale()` y no pasando un tamaño mayor al
aparato. La diferencia no es de estilo: dentro de la pantalla está todo
en píxeles fijos —barras de 7 px, sus rótulos de 6, iconos de 12—, así
que con un aparato más grande habrían crecido la carcasa y el escenario
y el resto se habría quedado igual de pequeño dentro de una pantalla
mayor. Que es lo contrario de ampliar.

En un móvil de 375 sale un factor de **1,25**, y para llegar ahí el
aparato se sale de los 18 px de aire que la página deja a los lados: sin
eso el factor se quedaba en 1,10, y 1,10 no se nota. El aire de la
página está para el texto, y aquí no hay texto.

**Lo que habrá que decidir el día del anillo permanente**: al ampliar, el
pixel art deja de caer en rejilla exacta. Los iconos están dibujados a
96 px y se pintan a 12 —una reducción justa de 8 a 1— y a 1,25 pasan a
15. Se ve bien porque no se interpola, pero algunas filas de píxeles
salen un pelo más anchas. Es el mismo trato que ya se le da a la
carcasa, que mide 751 y se pinta a 300. Si el anillo va a vivir siempre
dentro, quizá toque redibujar los iconos a una rejilla mayor.

El zoom **no se guarda**: es un mando de ver, como el de un mapa. Si
resulta que quien lo amplía lo quiere ampliado siempre, pasa a Ajustes.

## 2026-09-14 — Inicio ya tiene su «?»

Era la única pantalla sin ayuda y la que más cosas enseña: 29 de los 42
conceptos de la app, según el recuento de `SIMPLICIDAD.md`. Es el primer
punto de la lista que salió de ese mapa, y el más barato.

Dice tres cosas, y las tres son las que el mapa señaló como invisibles:

1. que el michi refleja tu **constancia** y nunca tu cuerpo, y cómo
   funcionan los tres botones;
2. que las barras de dentro de la pantalla —HAPPY, WATER y CLEAN— son
   **cuidado** y **no puntúan**;
3. que lo que sí cuenta está **debajo**.

La 2 es la importante. Que el agua no toque nada está muy bien pensado y
muy bien defendido en `MECANICA.md` §8c, pero el usuario no lee
`MECANICA.md`, y los dos sistemas se dibujan con las mismas barras de
píxel, uno al lado del otro. Eso no producía confusión: producía una
creencia equivocada y estable, que es peor porque nada la contradice.


## 2026-09-14 — Dormir y apuntar el sueño son UN solo botón

Eran dos iconos en el anillo: las tres **z** para ponerlo a dormir y la
**luna** para apuntar las horas. Se separaron porque por dentro son
cosas distintas —una es un cuidado, que no toca la mecánica, y la otra
es un dato, que sí—. Esa es razón del CÓDIGO. Para quien usa la app es
un solo momento: se va a dormir.

Decisión de Albert, y el comportamiento lo describió él:

> al clicarlo aparece el menú para registrar el sueño, el usuario lo
> escribe y el gato se queda durmiendo hasta que clique en otro botón o
> haga otra acción. Si cancelase el registro, el gato seguiría durmiendo
> sin afectar en nada.

Lo que hace que funcione es **qué pasa al cancelar**. Cancelar no
deshace nada, porque lo que pulsaste no fue «apuntar»: fue «se va a
dormir», y eso ya ha ocurrido. Así que el mismo botón sirve a los dos
usos sin preguntar cuál eres — quien solo quiere apagarlo por la noche
pulsa y cierra; quien viene a apuntar lo que durmió, lo apunta.

Y despierta como despertaba antes: con cualquier botón. Eso no hubo que
escribirlo, ya estaba.

### Se queda la LUNA

Albert no se decidía entre las dos. Gana la luna por dos razones, y la
primera se ve sola al abrir la app:

1. **El michi dormido ya lleva las tres z dibujadas encima.** Como icono
   del anillo repetían lo que la pantalla iba a enseñar un segundo
   después. La luna dice «noche» y deja que la respuesta —el gato
   dormido con sus z— la dé la pantalla. Una cosa lleva a la otra en vez
   de decir dos veces lo mismo.
2. **A 12 px, una silueta maciza se lee y tres trazos finos no.** Los
   otros iconos del anillo son formas macizas con relleno de color; las
   z eran tinta sobre transparente, y la excepción no venía de una
   decisión de estilo sino de que a 3 px de ancho no cabía contorno más
   relleno.

Las z no se pierden: siguen donde funcionan, encima del michi dormido.
El dibujo de las tres z se retira como se retiró la equis de `salir` el
2026-09-13 — la rejilla de `pixel/iconos_anillo.py`, el PNG y el rótulo
en las cinco lenguas—, y espera en el historial de git, que es donde
tiene que esperar un dibujo que ya no se usa.

El rótulo del anillo pasa a decir las dos cosas: «Dormir y apuntar».

## 2026-09-14 — La versión se ve dentro de la app

En Ajustes, la última línea. Idea que salió de la confusión del v5/v6
de esta misma mañana: Albert abre la app desde tres sitios y no tenía
forma de saber, mirando el móvil, si lo que veía era lo último que subió
o una copia guardada de hace días.

El número **no se escribe a mano en el código**: entra al compilar desde
`package.json` (`__VERSION__`, definido en `vite.config.js`). Escrito a
mano se queda viejo el día que nadie lo cambie en los dos sitios, y
entonces la app miente sobre qué versión es — que es exactamente el
problema que se venía a resolver.

Sin traducir: `v0.7.1` se lee igual en las cinco lenguas.


## 2026-09-11 — «Mi pacto» pasa a llamarse «Mi objetivo»

Decisión de Albert: *«mi pacto es un poco ambiguo, ¿no crees?»*. Y sí.
Todas las apps de fitness —MyFitnessPal, Fitbit, Garmin, Strava, Yazio—
dicen *objetivo* / *goals*. «Mi compromiso» no lo usa nadie.

Se renombra **solo lo que ve el usuario**, en las cinco lenguas. Las
claves del diccionario (`nav.pacto`, `pacto.titulo`) y los nombres del
código (`datos.pacto`, `engine/pacto.js`, `Pacto.jsx`) se quedan: es un
refactor grande, con riesgo de romper algo, a cambio de nada que se vea.

**La palabra «pacto» no se borra del todo.** `MECANICA.md` apoya su
principio rector en ella — «el michi no juzga: te recuerda lo que tú
mismo dijiste que querías hacer»— así que sobrevive donde hace trabajo
emocional: cuando habla el michi, y en el lore. Lo que se va es el
nombre de la pantalla.

### Y la pantalla empieza por el objetivo

Cuatro botones arriba del todo: perder peso, mantenerme, estar más en
forma, y otra cosa que escribes tú. **No son etiquetas**: los tres
primeros escriben el déficit en el perfil (500 / 0 / 0) y cambian las
calorías de verdad. El cuarto declara que no toca nada y lo dice en
pantalla — un botón que promete algo y no lo hace es peor que no
tenerlo.

**Falta «ganar peso», y no por olvido.** Hoy `planEnergetico` recorta
cualquier superávit a cero, y además habría que darle la vuelta a una
regla del michi: pasarse de calorías rompe el día, que en un volumen es
justo lo contrario. Albert eligió entre tres opciones —todo de golpe,
solo lo que funciona, o etiquetas sin efecto— y escogió hacer primero lo
que funciona. Queda en `TODO.md` con su propio paso.

## 2026-09-11 — La grasa se avisa, no se impone

Albert vio que MichiFit le daba 47 g de grasa donde la app antigua le
daba 67, y preguntó si estaba bien. Estaba bien, y salieron dos cosas:

- pesa 13,3 kg menos, así que su metabolismo en reposo bajó 133 kcal
  (1.901 → 1.768). Eso es correcto;
- **el reparto no es el mismo**: la app antigua ponía el 30% de las
  calorías en grasa y ésta pone el 25%.

Lo que importa de verdad: la grasa es la **única macro que baja sin
freno**. La proteína va fija en 2 g por kilo de peso meta y los carbos
son lo que sobra, así que todo el recorte cae sobre la grasa. Con 1.703
kcal salen 0,56 g por kilo, y en el suelo de calorías saldrían 0,49.
`MECANICA.md` §10 promete que la app «no premia comer menos de lo sano»,
y ahí había un hueco.

**Se decide avisar y no imponer.** Tres opciones estaban sobre la mesa
—suelo duro de grasa, subir el reparto al 30%, o solo el aviso— y
Albert eligió la tercera.

Qué significa en el código:

- `macros()` **no cambia**: la grasa sigue siendo el 25% de las
  calorías y la proteína 2 g por kilo de meta. `pruebas/avisos.mjs` lo
  fija, para que si algún día alguien mete un suelo duro ahí se caiga la
  prueba y haya que decidirlo a propósito y no de refilón;
- `avisosDeSeguridad()` gana un cuarto aviso, hermano de los de IMC,
  calorías y ritmo, que salta por debajo de `GRASA_MINIMA_POR_KG` (0,6 g
  por kilo de peso meta);
- se mide contra el peso **meta** y no contra el actual, por lo mismo
  que la proteína: el peso actual baja según avanzas, y con él bajaría
  el suelo justo cuando menos debería moverse.

Calibrado a propósito para que no sea ruido: con el pacto de Albert
salta (47 g contra un mínimo de 48), y en cuanto pacta 8.000 pasos y
tres entrenos deja de saltar (50 g). Un aviso que salta siempre no se
lee, y uno que no salta nunca no sirve.

## 2026-09-11 — El bucle tamagotchi pasa a ser el anzuelo

Los tres botones del aparato dejan de ser un juguete y pasan a ser la
interfaz principal —dos anillos, cuidar y medir— y aparecen dos barras
nuevas, agua y orden, que bajan solas y se rellenan pulsando. Decisión
de Albert.

**Qué cambia respecto a lo que estaba escrito.** `MECANICA.md` §8b
decía: «los mimos suben poco y cada vez menos; si bastara con eso, la
app dejaría de hablar de tu vida». La apuesta era que el michi solo
reflejara tu vida. La nueva es distinta: **el bucle de cuidados es el
anzuelo que te mete en la app, y una vez dentro registras**. En palabras
de Albert: «esto da un motivo al usuario para entrar de tanto en tanto
a limpiar la casa, darle de beber y darle amor al michi. Y ya que está,
registra los pasos y las comidas».

Se acepta porque es como funcionan las apps de hábitos con mascota, y
porque resuelve un problema real: el aparato estaba desaprovechado y la
gente no entendía para qué servía el gato.

En consecuencia, HAPPY baja más rápido (2,2 → 3,4 por hora, tope 32 →
44) y los mimos pesan algo más (22 → 28).

**Los tres límites que NO se mueven**, todos de `MECANICA.md` §10:

1. el agua y el orden **no tocan ningún número** de la mecánica — ni
   experiencia, ni nivel, ni HAPPY, ni cumplimiento. `pruebas/cuidados.mjs`
   lo comprueba campo por campo, y si algún día se pone en rojo es que
   el bucle ha empezado a premiar pulsar botones en vez de cuidarte;
2. **sin culpa**: no hay muerte, ni castigo, ni reproche, y las barras
   siguen congeladas de noche;
3. ~~cumplir manda sobre tener sed~~ — **invertido el 2026-09-18**, ver
   la entrada de ese día al final de este documento. Ahora la sed va
   por delante de `contento`.

## 2026-09-08 — Inicio se queda con el michi y cuatro barras
- Fuera el globo de texto y la tarjeta de nivel: el nivel y su barra de
  experiencia van DENTRO de la pantalla del huevo, como en un tamagotchi.
- El marcador enseña las **entradas** del sistema (pasos, descanso, comida)
  mas racha y nivel. El michi es la **salida**: su aspecto ya cuenta la
  energia y la forma, no hacia falta repetirlas en numeros.
- "Forma" desaparece del marcador y la sustituye la experiencia que falta
  para el siguiente nivel, que es lo que el usuario entiende.
- **Pasarse tiene tramo rojo.** Dormir 10 horas no es mejor que dormir 8, ni
  comer de mas es un logro: el exceso se pinta en rojo tras el tramo bueno.
- El fondo pasa de `fixed` a `absolute`: fijado al viewport se deslizaba
  respecto al contenido y parecia moverse solo.

## 2026-09-08 — Que hacen los tres botones del huevo
- 🟡 **Mimar**: acariciar. Ronronea y salen corazones. **No da XP**, a
  proposito: si diera, dejaria de ser cariño.
- 🔵 **Como va**: el michi cuenta en el bocadillo la racha, los comodines y
  lo que falta hoy.
- 🔴 **Dormir**: apaga la pantalla y el michi se duerme. Se vuelve a pulsar
  para despertarlo.
- **Ninguno toca los datos.** Son vida, no mecanica. "Dar de comer" o
  "beber" quedaron descartados: si un boton alimenta al michi sin que hayas
  comido, el michi deja de reflejar tu vida y pasa a ser un juguete aparte.
- Las coordenadas de los botones salen de escanear la fila que los cruza en
  el PNG (24,8% · 49,9% · 75%). El area de toque es mucho mayor que el
  dibujo: son circulos de 27 px y un dedo no los acierta.

## 2026-09-08 — Los escenarios se recortan, no se estiran
- Las escenas son 2,7:1 (muy apaisadas) y la pantalla del huevo es 0,87:1
  (mas alta que ancha). Estirarlas achataba las pesas del gimnasio.
- Decision: `object-fit: cover` anclado abajo. Se ve el tercio central de la
  escena, sin deformar, con el suelo a la vista para que el michi se apoye.
- **Si se quiere ver la escena entera, hay que generarla en vertical.**
  Con estas proporciones no cabe de otra manera.

## 2026-09-08 — Iconos del menu siempre a color
- Antes los inactivos iban en gris: parecian deshabilitados.
- Ahora todos a color; lo activo se marca con el texto en naranja, un
  puntito debajo y un pequeño salto del icono.

## 2026-09-08 — Iconos y escenarios
- Los iconos del menu vienen de Michi Finanzas: casa, fijos (aqui "mi pacto"),
  resumen (aqui "progreso"), corazon (karma) y el "+". Misma casa visual.
  **Simular no tiene icono propio**: lleva emoji hasta que se dibuje uno.
- La pantalla del huevo lleva **escenario de pixel art**, y cambia con lo que
  hiciste hoy: gimnasio si entrenaste, calle si andaste, casa si no.
  Da un motivo mas para mirar al michi cada dia.
- El michi se dibuja al 58% de la altura de la pantalla: mas pequeño que antes
  a proposito, para que se vea el escenario detras.

## 2026-09-08 — Sin modo oscuro
- Contexto: la app se veia LILA en el movil de Albert. Era el modo oscuro
  que yo habia copiado de MichiMind.
- Comprobado: **Michi Finanzas no tiene modo oscuro** (cero apariciones de
  `prefers-color-scheme` en su codigo).
- Decision: MichiFit tampoco. Paleta pastel siempre, con `color-scheme: light`
  para que el navegador no pinte controles oscuros.
- Razon: la identidad de la familia michi es el crema kawaii. Un tema que
  cambia solo segun el movil rompe esa identidad justo en la mitad de los
  usuarios.

## 2026-09-08 — El registro es numerico, no por incrementos
- Antes: botones de "cuidar del michi" que sumaban de 1000 en 1000 pasos.
- Ahora: un boton **"+"** en el centro de la barra abre el editor del dia y
  se escribe el numero. El mismo editor que usa el calendario de Progreso.
- Razon: sumar a saltos fijos no permite apuntar 7.431 pasos.

## 2026-09-08 — Karma comparte cuenta con Michi Finanzas
- Decision: MichiFit usa **la misma** cuenta de donaciones que Michi Finanzas
  (`buymeacoffee.com/MichiFinanzas`) y el mismo LNURL de Lightning.
- Regla que no cambia: apoyar es voluntario y **no desbloquea nada**. Ni
  michis, ni niveles, ni accesorios. Si algun dia una donacion diera ventaja,
  deja de ser karma y pasa a ser una compra.
- El michi de la pantalla viene de Michi Finanzas; se le recorto la taza que
  ponia "MICHI FINANZAS", pero **sigue llevando traje**. Si molesta, hay que
  generar uno propio de MichiFit (con cinta del pelo en vez de traje).
- El QR de Lightning se copia SIN recomprimir con perdida: es el LNURL real
  y un artefacto de compresion podria hacerlo ilegible.

## 2026-09-08 — La paleta se copia, no se interpreta
- Contexto: al "alinear" la paleta con Michi Finanzas inventé unos marrones
  para el modo oscuro y unas sombras marrones. La app salia tenida de marron.
- Decision: usar los **valores exactos** de MichiMind y Michi Finanzas.
  Claro `#FDF1E4` / oscuro **ciruela** `#2B2131`, tarjetas `#3A2D42`,
  tinta `#4A3541`, azul `#6FBBEF`, verde `#5FCD96`, rosa `#F9799B`.
  Sombras neutras, nunca de color.
- Lo unico propio de MichiFit es el **naranja del logo** `#F2650F`, donde
  MichiFin usa azul y MichiMind rosa.

## 2026-09-13 — En la app, solo Ninja feliz; lo duro va a TikTok
- Contexto: Albert dejo cuatro archivos en `public/ninja/`. Dos fotos del
  gato en casa, y dos VIDEOS: el envenenamiento y el veterinario, que son
  los actos 4 y 5 de la historia grabados de verdad.
- Decision de Albert: **los videos fuera de la app**. Se borran de
  `public/ninja/` y nunca llegan a git. En la galeria solo van fotos de
  Ninja viviendo feliz.
- Razon, con sus palabras: eso ya se conto en TikTok -lo hizo su chica y
  recibio mucho apoyo- y ese es su sitio. En la app lo que hace falta es
  algo **evergreen y positivo**.
- Y encaja con la mecanica: el veneno YA esta contado en el acto 4, en
  texto, donde esta medido. La ultima pantalla es el epilogo y existe para
  cerrar en calma; una imagen dura ahi trabaja en contra de la frase que
  lleva al lado. La app promete no usar el miedo (`MECANICA.md` 10), y eso
  vale tambien para lo que se enseña, no solo para lo que se dice.
- Detalle tecnico que pesaba en la decision: el `<video>` va con
  `preload="metadata"` y SIN `poster`, asi que el PRIMER FOTOGRAMA es la
  miniatura. No queda detras de un boton de play: el del envenenamiento
  empieza ya con el gato en el suelo, y se veria sin haberlo pedido.
- Pendiente, de Albert: mas fotos, y con menos casa en el encuadre. El
  repositorio es publico.

## 2026-09-07 — El michi es pixel art dentro de un tamagotchi
- Contexto: la mascota era un SVG vectorial suelto sobre la tarjeta.
- Decision: **pixel art naranja** (el atigrado del logo) dentro de un
  **aparato tipo tamagotchi** dibujado en SVG: carcasa naranja, pantalla LCD
  verde con rejilla de pixeles, tres botones y anilla.
- Razon: es lo que Albert queria de referencia, y ademas el marco del aparato
  da contexto al michi: se entiende que es una mascota virtual, no un adorno.
- **El michi eran datos, no una imagen**: `pixel/michis.js` eran rejillas de
  32x32 que se pintaban como rectangulos.
  **Esto dejo de ser verdad.** El 2026-09-09 las cinco siluetas se retiraron
  (ver esa fecha mas abajo) y el michi paso a ser PNG dibujado a mano; el
  2026-09-13 el archivo se fue a `_CUARENTENA/cuerpos-antiguos/` junto con su
  generador. Del aparato sobrevive la carcasa en SVG, que hoy solo se dibuja
  como respaldo si falta `huevo.png`. La decision de que el michi sea pixel
  art DENTRO de un tamagotchi sigue en pie: lo que cambio es de que esta hecho
  el gato.

## 2026-09-07 — Familia visual con Michi Finanzas y MichiMind
- Decision: fondo crema `#FFF8EE`, tinta calida `#4A3A40`, Baloo 2 y radios
  generosos, igual que Michi Finanzas. Lo propio de MichiFit es el **naranja**
  del logo (`#F5762A`) donde las otras usan rosa o azul.
- Fondo con patron kawaii repetido. Si existe `public/fondo.png` se usa ese;
  si no, hay uno de reserva dibujado en SVG dentro del CSS.

## 2026-09-07 — App publica y multiusuario, datos en el dispositivo
- Contexto: MichiFit se publicara desde GitHub para que la use cualquiera.
- Decision: **cero datos precargados**. Todo arranca vacio y cada usuario mete
  lo suyo en el primer arranque (`Bienvenida.jsx`). Los datos viven solo en su
  dispositivo (`localStorage`), no se envian a ningun sitio.
- Razon: privacidad, y ademas un perfil ajeno precargado desorienta y ensucia
  los calculos de quien llega nuevo.
- **Regla permanente: nunca meter datos personales de nadie en el codigo.**

## 2026-09-07 — El producto se llama MichiFit; "Michigochi" se descarta
- Contexto: el tamagochi se desarrollo bajo el nombre Michigochi.
- Decision: **el nombre del producto es MichiFit en todo**.
- Razon: "tiene mas punch y es mas claro de entender" (palabras de Albert).
- Consecuencia pendiente: la carpeta sigue siendo `2026_APP_MICHIGOCHI` y el
  codigo aun usa `Michigochi.jsx` y el prefijo `mg-`. Renombrar es deuda
  tecnica asumida, no una contradiccion. Ver `TODO.md`.

## 2026-09-07 — Mecanica de motivacion: el pacto
- Contexto: la mecanica tamagochi clasica motiva por culpa, y eso choca con la
  filosofia del proyecto (herramienta suave, sin meter prisa).
- Decision: **el usuario pacta su semana al empezar**; el michi refleja el
  cumplimiento de ese pacto, no el cuerpo del usuario.
- Razon: si el liston lo pone el usuario, el michi no juzga — recuerda. Resuelve
  de raiz el problema de enseniar un gato gordo a alguien que va mal.
- Detalle completo en `MECANICA.md`. **No rediseniar sin leerlo.**

## 2026-09-07 — El cuerpo del michi sale de los habitos, no del IMC
- Cambio respecto al motor actual, donde `forma` se calcula desde el IMC.
- Razon: el michi es un compañero, no un avatar. Ademas los habitos responden en
  dias y el peso en meses: el feedback diario necesita lo primero.
- Consecuencia: hay que reescribir `calcularForma()`.

## 2026-09-07 — Fusionar en una app nueva y limpia
- Contexto: hay dos apps complementarias. La original tiene la parte numerica
  madura (estimacion, grafica peso-tiempo, macros, simulador); esta tiene la
  mascota y el motor de estado.
- Opciones: A) traer lo que falta a esta app. B) llevar el michi a la original.
  C) empezar limpio tomando piezas de las dos.
- Decision: **C — app nueva, tomando piezas de las dos.**
- Razon: ninguna de las dos bases es el destino. La original arrastra el patron
  sin build; esta arrastra un banco de pruebas y un nombre equivocado. Partir
  limpio evita heredar las dos deudas.
- Consecuencia: este proyecto pasa a ser **cantera de piezas**, no el producto.
  El motor (`src/engine/`) y la mascota son lo que se lleva.

## 2026-09-07 — App separada de la MichiFit original (decision anterior)
- Se decidio arrancar aparte con React + Vite e IndexedDB, en vez de meter el
  tamagochi dentro del `.jsx` unico sin build de la app original.
- Razon: esta app es bastante mayor y el michi SVG pide modulos separados.
- **Sigue vigente como decision tecnica**, aunque el destino sea la fusion: el
  codigo nuevo vive aqui, no se arrastra a la original.

## 2026-09-07 — Garmin por importacion, no por API
- Opciones: alta en el Garmin Developer Program (Health API, OAuth, webhooks)
  o importar el fichero de exportacion de Garmin Connect.
- Decision: **importacion del export** + entrada manual.
- Razon: la Health API exige aprobacion de Garmin y espera. La importacion
  funciona desde el primer dia. La API queda como mejora futura.

## 2026-09-07 — La mascota es SVG parametrico, no una imagen
- Contexto: se genero una version 3D tipo peluche que quedaba muy bien.
- Decision: **descartada para la app**; vale como imagen de marca.
- Razon: el michi cambia de silueta segun los datos. Una imagen fija no puede.
  Por eso tambien se eligio el estilo plano del logo: se dibuja en SVG.

## 2026-09-07 — Tres formulas de la spec original estaban rotas
- `forma` estaba invertida (daba 0 justo en el objetivo), y `energia` y `estres`
  se desbordaban por no normalizar. Corregidas. Detalle en
  `MICHIGOCHI-RESUMEN.md`.
- **No reimplementar la spec original tal cual.**

## Tono del producto (permanente)
Herramienta de orientacion, suave por diseno. Sin monedas virtuales, sin
anuncios, sin telemetria. El michi es feedback, no un castigo.

## 2026-09-18 — El orden de los cuidados, y el michi de pie
Albert pidió, y es lo que hace ahora `estadoVisual` (`engine/michi.js`):

1. **caca en el suelo → asqueado**;
2. si la recoge, el **brinco de celebrar** (el corto de siempre, 2,6 s);
3. si al cuenco le falta un poco de agua → **sediento**. Salta al **75%**
   (`SED_DESDE`, antes 50): unas dos horas y media de vigilia después de
   rellenarlo;
4. si le da agua, el brinco y el **michi de pie**.

Tres consecuencias, dichas para que nadie las descubra por sorpresa:

- **Se invierte la decisión del 2026-09-11 «cumplir manda sobre tener
  sed».** Estaba pensada para que quien no descubriera el botón del agua
  no dejara de ver a su michi contento. Con la sed al 75% eso taparía el
  aviso justo en quien más usa la app, y Albert prefirió que el aviso se
  vea. `pruebas/cobertura-michi.mjs` comprueba ahora el orden entero.
- **`contento` (el sentado, de ojos cerrados) pasa a pedir `forma` 90**
  (`FORMA_CONTENTO` en `constantes.js`, antes 70). «Entreno y sueño cumplen
  por apuntar» (mismo día) subió a casi todos por encima de 70 y el de
  pie dejó de salir. Ahora de pie ocupa 60 puntos de la escala de forma y
  contento 11: contento es la recompensa por una constancia casi perfecta
  y de pie es lo normal. Lo pidió Albert: «el de pie ha de salir más que
  el sentado».
- **La cara de contento solo se ve con el cuenco lleno y la casa
  limpia**, porque sed y caca van por delante. No es un reproche: no
  toca XP, HAPPY ni cumplimiento (`pruebas/cuidados.mjs`).

## 2026-09-19 — Sin usuarios, lanzamiento a amigos y familia, y el ritmo de las cacas
**La app se queda estatica y sin cuentas.** Albert descarta Hostinger con
login: cualquiera que tenga el enlace la descarga y usa, y los datos no
salen del dispositivo. Eso cierra de paso las notificaciones push y la
sincronizacion entre dispositivos (necesitaban servidor). Tampoco entran,
por ahora, la camara de calorias, mas fotos de Ninja ni los add-ons del
nivel 5. Se lanza primero a amigos y familia, con Buy Me a Coffee y Wallet
of Satoshi; el QR de PromptPay queda para mas adelante.

**El QR de PromptPay se enciende, el primero en Karma.** Aparecio ese dia
en `public/karma/` y se retiro un rato por precaucion (usa el numero de
identidad nacional de una persona, y el repositorio es publico, donde un
commit no se retira). Albert aclaro despues que es el de su pareja y que
ella quiere ponerlo para donativos. Se monto: `ACTIVO = true`, bloque
primero de Karma, imagen recortada a logo + codigo (`promptpay_qr.png`) y
el original entero guardado fuera del repo
(`../_ARCHIVO/qr-promptpay-sin-publicar/`). **Queda pendiente confirmar
con ella, antes del push, que sabe que el codigo lleva dentro su numero
de identidad.**

**Al terminar el comic, «Cerrar» y «Saltar» llevan a Karma** (Albert). Solo
cuando se revisa la historia ya empezada y se ha llegado a la ultima
pantalla: en el primer arranque el final lleva a la bienvenida, y desviar
ahi a quien aun no ha puesto su peso seria cortarle el alta. Saltar a
medias tampoco cuenta. Y como asi se llega a Karma sin conocer el menu de
abajo, la pantalla lleva un boton **«Salir»** (arriba y abajo, cinco
idiomas) que vuelve a Inicio.

**`FORMA_CONTENTO` a 95** (era 90). Albert dijo que cualquiera de los dos le
valia; se eligio el mas alto para que el michi de pie, que es lo normal,
gane aun mas terreno.

**Las cacas salen por `Math.floor`, no por `Math.ceil`.** Es un arreglo, no
un cambio de gusto. Con la caca mandando sobre la cara del michi (2026-09-16
y 2026-09-18), el redondeo hacia arriba hacia salir la primera caca a los
5 minutos de limpiar, y el michi estaba asqueado casi siempre; el de pie y
el sentado solo se veian esos primeros minutos. Medido con el motor real,
antes y despues. Ahora la primera sale al gastarse 1/5 de `ORDEN_HORAS`
(2,8 h despierto) y la sed llega a las 2,5 h: limpiar y dar agua deja unas
2,5 horas de michi tranquilo. Los numeros que Albert tenia (`AGUA_HORAS`
10, `ORDEN_HORAS` 14, `SED_DESDE` 75) no se tocaron. Sigue abierto
ajustarlos con uso real.

**Gimnasio nuevo, `calle.png` fuera, michi comiendo mas abajo.** El
gimnasio de Albert sustituye al de siempre (que va a
`_CUARENTENA/fondos-antiguos/`); `calle.png` se borra; y comiendo baja del
3% al 8% con `translate`, porque en el PNG sus pies estan 40 px por encima
de los del sentado.

## 2026-09-19 (tarde) — Simplificar: cuidado es puntitos, y la regla se dice
Albert dijo que las cuatro propuestas que quedaban de `SIMPLICIDAD.md`
(2 a 5) le parecian buenas, y se hicieron:

- **HAPPY, WATER y CLEAN son cinco puntitos; el nivel sigue siendo una
  barra.** Lo que puntua y lo que no dejan de compartir lenguaje. Ese era
  el hallazgo 2, «la trampa mas cara de la app».
- **El editor dice cuantos dias quedan** para completar un dia, mientras se
  puede aprovechar, y no solo cuando ya esta cerrado.
- **La comida dice su regla real.** Ojo, el numero que sale no es el
  objetivo sino el borde del margen del 10%: con objetivo 1507 y «perder»
  dice «no pasas de 1650». Es lo que de verdad cuenta (`evaluarDia`), y
  se redondea hacia dentro para no prometer de mas.
- **El escudo se explica**: linea bajo la racha mientras tienes escudos, y
  un cuarto parrafo en el «?» de Inicio. El aviso «el michi te cubrio un
  dia» ya existia.
- De paso, el «?» de Inicio deja `dangerouslySetInnerHTML` y usa `<T>`
  como las demas ayudas (la regla de `CURRENT.md` decia que no quedaba
  ninguno; en Inicio quedaban tres). Y se quitan dos frases que ya no eran
  ciertas: «toca el cristal y te cuenta como vas» y la lista sin entreno.

**La cara `cansado` se retira del motor.** Albert borro los cuatro dibujos
(era la botella y la gota, el mismo dibujo que sediento) y dijo que no se
usan. Quien llevaba 2 a 9 dias sin apuntar ve ahora el michi de pie, no uno
cansado: es lo que menos riñe, y `MECANICA.md` §10 dice que el michi nunca
riñe. `pruebas/cobertura-michi.mjs` y el panel de pruebas dejan de esperarlo.
