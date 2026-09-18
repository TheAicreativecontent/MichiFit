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
- Última acción (2026-09-11, noche): **la app cuenta quién es Ninja**,
  los botones del aparato dicen lo que hacen, y los objetivos están
  completos — perder, mantener, estar en forma, ganar y otro, cada uno
  con su sentido de comida. Ver abajo.
- Última acción (2026-09-12): **los ocho iconos de los anillos**, ya
  dibujados. Ver abajo.
- Última acción (2026-09-12, tarde): **el color se elige al adoptarlo**
  y el gato arranca GRIS. Cerradas las dos preguntas que quedaban en
  `ASK.md`. Ver abajo.
- Última acción (2026-09-12, noche): **los botones cambian de
  gramática** — izquierda pasa, centro acepta, derecha cierra — y un
  solo anillo de ocho iconos. Ver abajo.
- Última acción (2026-09-12, cierre): **los rangos del simulador** ya no
  son de atleta, y PromptPay queda montado a falta del QR de Albert.
  Ver abajo.
- Última acción (2026-09-12, tras probarla en el móvil): arreglado el
  **salto de la página** al abrir el anillo, el **teclado que tapaba el
  botón de guardar**, y el **panel de pruebas, que tumbaba la app**.
  Barras de cuidados más vivas, gráfica sin comprimir, y los documentos
  que mentían (`ROADMAP.md`, `PROTOCOL.md`, el código muerto). Ver
  `SESSION_MAP.md`.
- Última acción (2026-09-13): **el código muerto, fuera**. Las cinco
  siluetas (`pixel/michis.js` y su generador) a
  `_CUARENTENA/cuerpos-antiguos/`, con los PNG de esos mismos cuerpos; y
  `salir.png` borrado del todo. Con las siluetas se fueron los props
  `estado`, `cara` y `sinMichi` de `Tamagotchi.jsx`, que solo existían
  para decirle que no dibujara. La caché se queda en v5: los ocho
  iconos servidos salen byte a byte idénticos. Ver `SESSION_MAP.md`.
- Última acción (2026-09-13, después): **el service worker y los
  vídeos**. Los vídeos se piden por trozos (206) y `cache.put` los
  rechaza, así que cada trozo dejaba un fallo sin recoger dentro del
  SW. Ahora las peticiones con `Range` van derechas a la red. Se veía
  bien igual, pero por suerte. Comprobado con un mp4 de prueba.
- Última acción (2026-09-13, cierre): **Ninja ya está en la app**.
  Albert dejó las fotos en `public/ninja/` y la galería del final las
  enseña. Dejó también dos vídeos —el envenenamiento y el veterinario—
  y decidió que **no entran**: su sitio es TikTok, y aquí lo que hace
  falta es evergreen y positivo. Ver `DECISIONS.md`.
- Última acción (2026-09-13, cierre de verdad): **los pies de foto ya
  se traducen** —estaban en castellano duro dentro de `ninja.js` y se
  veían igual en japonés; lo cazó Albert—, y **`pasos` es una patita
  nueva**, dibujada por él, a salvo en `pixel/iconos-a-mano/`. Caché a
  v6.
- Última acción (2026-09-14): **la app tiene versión**. Es la
  **v0.7.0**, y es la base estándar de trabajo — el proyecto llevaba
  desde el principio en `0.0.0` y no había forma de saber desde el móvil
  qué versión tenías delante. Cuatro sitios dicen lo mismo ahora:
  la etiqueta de Git `v0.7.0`, `package.json`, la caché `michifit-v7` y
  `VERSION.md`, que es el documento nuevo por el que se empieza al
  sentarse desde otro dispositivo. Nada del código cambió: los seis
  tests pasan y el build sale idéntico al que ya estaba en producción.
- Última acción (2026-09-14, sesión): **dormir y apuntar el sueño son
  UN solo botón**, y la **versión se ve en Ajustes**. El anillo pasa de
  ocho iconos a siete: se queda la luna, y las tres z se retiran al
  historial de git —el michi dormido ya las lleva dibujadas encima, así
  que como icono repetían lo que la pantalla iba a enseñar—. Lo que hace
  que el gesto sea uno es que **cancelar el editor deja al michi dormido
  igual**: no pulsaste «apuntar», pulsaste «se va a dormir». Probado
  entero en el navegador. Ver `DECISIONS.md`.
- Última acción (2026-09-14, tarde): **el aparato se amplía** y **Inicio
  ya tiene su «?»**. El zoom va en un botón y no en el cristal, porque
  el cristal ya está cogido —tocarlo hace que el michi cuente cómo vas—,
  y se hace con `transform: scale()` porque dentro de la pantalla está
  todo en píxeles fijos. En un móvil sale 1,25. Es el paso previo a lo
  que Albert quiere de verdad: **que el anillo se vea siempre en la
  parte de abajo, dentro de la pantalla**. Y el «?» es el primer punto
  de `SIMPLICIDAD.md`, el mapa de conceptos de esta misma sesión.
- Última acción (2026-09-16): **tercera foto de Ninja**, recortada para
  que solo se le vea a él. Y el vídeo del envenenamiento, que estaba
  suelto en `public/ninja/`, fuera del repositorio: a
  `../_ARCHIVO/ninja-material-crudo/`. Estaba a un `git add -A` de
  publicarse.
- Última acción (2026-09-16, cierre): se investigo **la privacidad del
  QR de PromptPay** (no existe uno privado: se elige que identificador
  se hace publico, y se recomienda un e-Wallet ID), se dejo escrito que
  el **`ZZZ` de la barra HAPPY no es un fallo** sino una regla propia
  que ni su autor reconocio, y **Albert concreto como quiere el anillo
  siempre visible**. Nada de eso se ha implementado: queda escrito.
- Última acción (2026-09-16, tarde): **el anillo vive abajo y siempre**.
  Es una banda fija en el borde inferior de la pantalla, con el nombre
  arriba y los siete iconos abajo; la escena y el michi suben para
  dejarle sitio y ya no los tapa nada. Las cuatro barras pasan a medir
  lo mismo. Ver `SESSION_MAP.md`.
- Última acción (2026-09-16, noche): **los michis nuevos y los fondos
  largos**. 27 sprites sacados de las model sheets de Albert, el parque
  panorámico desplazándose en bucle mientras el michi anda, comer en la
  cocina, y el panel de pruebas con un mosaico que enseña los 33
  dibujos a la vez. Caché a v8.
- Última acción (2026-09-16, tarde-noche): **la cocina recortada** (era
  el piso entero y se veía el centro), **el michi pone cara de lo que
  se ve** —asqueado con una caca, sediento con el cuenco por debajo de
  la mitad—, el gimnasio nuevo probable desde el panel, y tocar el
  cristal ya no da un resumen: dice que esto es analógico.
- Última acción (2026-09-16, noche): **la historia se cuenta con el
  cómic**. Doce viñetas de verdad a pantalla completa, con el texto en
  una banda que se funde con el dibujo, en las cinco lenguas. Se acabó
  el apaño del michi gris sobre un escenario.
- Última acción (2026-09-16, cierre): **el cómic pasa a 14 viñetas** con
  los textos de Albert pulidos —la enfermera se llama Anna—, el texto
  **arriba** porque la acción está abajo, y dos viñetas mudas que se
  explican solas. Queda por decidir una palabra: ver `COMIC.md`.
- Última acción (2026-09-16, más tarde): **ajustes de copy del cómic**
  —la 11 y la 13 ya tienen texto—, **el collage** de fotos sustituye al
  carrusel, que fallaba al deslizar, y **Ninja dando las gracias**
  sustituye al michi de oficina en Karma.
- Última acción (2026-09-16, última tanda): fuera los guiones largos de
  los textos de la app, la cocina desplazada para que el michi pise el
  suelo, el mensaje de «es analógico» justo debajo de «EN CASA» y los
  iconos del anillo a 16 px. Caché a v10.
- Última acción (2026-09-17): **triste y cansado, en el estilo nuevo, y
  el michi negro**. Albert redibujó esas dos poses igual en las cuatro
  model sheets —antes la casilla 5 no coincidía entre hojas y se
  descartaba— y añadió una hoja `negro` entera. `recortar_model_sheets.py`
  cambió de detectar blobs a una rejilla fija de 5x2: con los dibujos más
  juntos, el hueco entre poses que usaba para partir la hoja a veces
  desaparecía y fundía dos michis en uno. El fondo se sigue quitando
  sobre la hoja ENTERA y no celda a celda —si no, el bolsillo de blanco
  que la cola de "andando" encierra en la hoja negra se queda opaco,
  sellado del propio dibujo, con más detalle en la cabecera del script—.
  `COLORES_MICHI` pasa a cuatro colores y el selector de Ajustes/Lore lo
  hereda solo. Caché a v11. `michi_sediento` no salió de esta tanda —es
  el dibujo antiguo, sin hoja nueva que lo traiga— así que el michi negro
  no lo tiene todavía: si el cuenco baja de la mitad, cae al michi negro
  de pie por la cadena de respaldo de siempre, no se rompe nada.
- Última acción (2026-09-17): **el michi salta al cuidarlo**. Mimar, dar
  agua, limpiar o apuntar cualquier dato que no tuviera ya su propia
  escena (pasos, peso, sueño) no daban ninguna señal en el michi; ahora
  hacen un brinco corto con `michi_celebrando`, la misma pose que ya
  usaba subir de nivel. Comer y entrenar siguen con su escena propia sin
  tocar. Lo pidió Albert junto con las poses nuevas. Verificado en el
  navegador: el michi salta al aceptar «mimar» y vuelve solo a su humor
  a los 2,6 s.
- Última acción (2026-09-18): **el flequillo del michi negro, fuera**.
  Albert lo vio con un borde blanco alrededor del cuerpo en todas las
  poses y se ofreció a recortarlo él a mano; no hizo falta. No era un
  bolsillo encerrado —eso ya lo resolvía `agujeros_sueltos`— sino un
  resto de fondo que SÍ tocaba el borde de la hoja pero sobrevivía al
  relleno: el antialias del JPEG mezcla el contorno oscuro con el fondo
  blanco, y esa mezcla cae por debajo del umbral (240) que usa
  `fondo_fuera` para reconocer «esto es fondo». `deshalar()` es una
  segunda pasada en `recortar_model_sheets.py`: pela cualquier pixel
  opaco que SIGA tocando ya un pixel transparente y sea casi blanco
  (>200 de brillo), en varias vueltas porque el flequillo es irregular.
  Se aplica a los cuatro colores —medido antes de tocar nada: el pelaje
  blanco de verdad, aislado por su propio contorno, no llega a rozar la
  transparencia, así que no había riesgo de perforarlo—. Caché a v12.
- Última acción (2026-09-18): **la caca le gana a `contento`**. Albert
  probó con una caca en el suelo y el michi seguía con cara contenta —el
  orden antiguo ponía `forma >= 70` por delante de `cuidado.sucio`,
  a propósito, por la misma razón que la sed—. Ahora `asqueado` se mira
  ANTES que `contento`; la sed se queda donde estaba, sin tocar, porque
  Albert no pidió cambiar esa y es la misma decisión de siempre (quien
  no encuentre el botón del agua no puede quedarse sin ver nunca a su
  michi contento). `pruebas/cobertura-michi.mjs` prueba las dos reglas
  por separado, cada una con su cuenco distinto.
- Última acción (2026-09-18): **«¡GENIAL!» en vez de «¡NIVEL!»**. El
  brinco corto de mimar/agua/limpiar/registrar reutiliza la misma pose
  y el mismo rótulo que la celebración de subir de nivel
  (`escenas.celebrar`), y ese rótulo decía «¡NIVEL!» / «LEVEL UP!»: con
  el brinco corto eso miente —no ha subido de nivel—. Un solo texto
  vale para los dos casos con tal de que no prometa algo que no pasó.
- Última acción (2026-09-18): **el fondo de dormir**. `BG_dormir.png`,
  con la cama centrada para dar la sensación de que el michi duerme
  ENCIMA y no de pie en el salón con los ojos cerrados. La escena
  `dormir` (`escenas.js`) usaba `casa`; ahora tiene su propio fondo, con
  entrada propia en `ESCENARIOS`. Y la propia imagen se recentró: la
  cama de origen quedaba a 21 px del centro real del lienzo (358x358),
  así que `object-fit: cover` —que centra el LIENZO, no lo que hay
  dibujado dentro— la dejaba corrida a la derecha. Escalada un 15% y
  recortada centrada en la cama, no en el lienzo.
- Última acción (2026-09-18, tanda de retoques): cuatro ajustes que pidió
  Albert al probarlo:
  · **las gotas sueltas de `entrenando`, fuera**. `michi_entrenando` es
    la columna 4 de la rejilla y `michi_cansado` la 5, pegadas en la
    misma fila: las gotas de agua de `cansado` empezaban un poco antes
    de su propia celda y la rejilla fija (2026-09-17) le cortaba el
    trozo a `entrenando`. Salían 3-4 motas sueltas, en los cuatro
    colores, siempre por debajo del vapor de verdad —que es el único
    adorno suelto de esta pose—. `limpiar_gotas_entrenando()` en
    `recortar_model_sheets.py` quita cualquier isla que no sea el gato y
    que empiece por debajo de esa altura, medida a mano en las cuatro
    hojas antes de fijar el umbral.
  · **el michi, más grande**. Del 72% al 82% de la zona, con 8% de
    margen al suelo en vez de 10%. La zona ya reservaba sitio para la
    cabecera (nivel, barras, rótulo) por encima, así que crecer aquí
    dentro no los toca.
  · **las zzz de dormir, en diagonal y pegadas a la cabeza**. Eran un
    solo texto ("z z z") a top:8%/right:8% de TODA la zona —la esquina,
    lejos del gato, que vive abajo—. Ahora son tres `span` sueltos, cada
    uno con su sitio y su tamaño, subiendo en diagonal desde justo
    encima de la cabeza (que en `michi_durmiendo` está a la derecha).
    Siguen por delante de `mf-tamapng-apagada` —la capa que oscurece la
    pantalla entera al dormir— porque si no, la señal de que el michi
    sigue "vivo" se apagaría con el resto de la escena.
  Caché a v13.
- Última acción (2026-09-18/19): **los 40 michis pasan a ser dibujo de
  Albert, no del script**. Exportó él mismo, a mano, el mismo lienzo
  (298x355) y casi la misma posición para los cuatro colores × diez
  poses, ya en transparente. Mejor calidad que `pixel/recortar_model_sheets.py`
  —sin pasar por JPEG ni por la cuantización a 96 colores— y sin
  ninguno de los flequillos/goteras que ese script iba parcheando uno a
  uno. **`public/michi/*.png` NO se vuelve a generar con el script
  mientras esto siga así** — pidió explícitamente no pisarlos. Comiendo
  y dormido quedan pendientes de recolocar (el lienzo cambió de tamaño y
  esas dos no se realinearon todavía). Caché a v14.
- Última acción (2026-09-19, descartado): prueba de animación de
  andar con un sheet generado por IA (`IMG/animaciones/`, 4 colores,
  guía de "contact/down/up/pass" de 12 frames). Separados y montados en
  GIF solo el naranja, para decidir con poco coste. Los frames no eran
  consistentes entre sí —typical de generar cada pose por separado con
  IA, sin el control de un dibujo a mano— y se notaba al animarlo.
  **Descartado por Albert.** Carpeta borrada, nada quedó en el repo.
- Última acción (2026-09-19): **la conversación de simplificar, en
  serio esta vez**. Albert la retomó con un ángulo que `SIMPLICIDAD.md`
  (14-09) no tenía: no solo qué se entiende, sino qué anima y qué
  desalienta (el calendario rojo/verde/amarillo, por ejemplo). Prioridad
  que dio, en orden: 1) hábitos (entreno, pasos, comida+macros, peso —
  sueño el último) 2) la gráfica de cuánto falta para la meta 3) la
  historia de Ninja, hoy escondida en Ajustes 4) el menú de abajo.
  Decisiones ya tomadas, para cuando se retome:
  · **Karma se queda en el menú de abajo** — no baja a Ajustes, aunque
    se propuso.
  · **Logros se funde dentro de Progreso** (una sección, no una
    pantalla), y el hueco libre lo coge un icono a **Ninja** — Albert
    subió `public/iconos/Ninja.png` para eso. **Hecho el mismo día**,
    ver la siguiente entrada.
- Última acción (2026-09-19): **el menú de abajo, simplificado**.
  `Logros` deja de ser pantalla: `pantallas/Logros.jsx` pasa de página
  completa (con su `.mf-pagina` y su `<Titulo>`) a sección — un
  `<div className="mf-tarjeta">` que Progreso pinta al final, después
  del calendario. Su ayuda de antes (dos párrafos sobre que los hitos
  no se pierden nunca) se resume en una frase nueva,
  `progreso.ayuda3`, dentro del «?» de Progreso, para no perder la
  explicación.

  El hueco que dejó Logros en el menú lo ocupa **Ninja**: un botón
  nuevo que NO abre una pantalla de `pestana` como los demás —abre
  `Lore.jsx` a pantalla completa con `setVerLore(true)`, el mismo
  mecanismo que ya usaba el botón «La historia de Ninja» dentro de
  Ajustes—. Por eso en `PESTANAS` lleva `abre: 'lore'` en vez de
  encajar en el patrón `pestana === p.id`, y por eso nunca se pinta
  «activa»: tocarlo ya te ha llevado a otra pantalla.

  Karma se queda donde estaba, tal como pidió Albert.

  Probado en el navegador: Ninja abre la historia desde el menú,
  Progreso enseña Logros al final de la página, y el resto de
  pestañas siguen igual.
- Última acción (2026-09-19): **el dato que faltaba en Progreso, cazado**.
  Albert decía que la previsión «no acababa de funcionar», y el fallo
  era real: hasta hoy, cuántas semanas o qué fecha faltan para la meta
  **no se veía en ningún sitio como número**. Vivía escondido en la
  posición del trofeo de la gráfica —que además desaparece si la meta
  cae fuera del tramo visible—, y un comentario del código decía que
  «la fecha ya está escrita en la tarjeta de arriba» desde el
  2026-09-12: mentira desde el día en que se escribió, no una
  regresión (comprobado con `git show` sobre ese commit). Añadido un
  bloque `.mf-meta` arriba del todo, el mismo que ya usaba el
  Simulador, con tres estados: la fecha con semanas y meses si el
  ritmo apunta a la meta, «¡ya estás en tu meta!» si ya se llegó, y un
  aviso neutro (no un «no alcanzable») si el ritmo todavía no apunta
  para ese lado.

  De paso salió un bug propio al escribir el arreglo: «ya en la meta»
  con solo `restante <= 0` daba ese mensaje DESDE EL PRIMER DÍA a
  cualquiera que quisiera GANAR peso, porque `restante` nace negativo
  en ese caso antes de ganar un gramo. Hace falta saber hacia dónde
  iba el plan (`pesoInicial` contra `pesoMeta`) y no solo mirar el
  signo de lo que queda. Probado a mano en el navegador con los tres
  casos: bajando a medias, ya en la meta, y queriendo ganar peso sin
  que el pacto todavía reme en ese sentido.

  Sin resolver, y NO es lo mismo: con la simulación de «querer ganar
  peso» a mano en el navegador (sin pasar por `sincronizarPacto`), la
  celda «Hasta la meta» enseñaba 0,0 kg en vez de los kg que faltan por
  ganar —`Math.max(0, restante)` da por hecho que `restante` siempre es
  positivo mientras falta, y para ganar peso nace negativo—. No lo toqué:
  no es el fallo que Albert señaló y quiero que decida él si merece
  arreglo aparte.
- Última acción (2026-09-19): **el punto 1 de simplificar: los
  hábitos, en el orden de Albert**. Dio una prioridad expresa —entreno,
  pasos, comida (con macros), peso, y sueño el último («también
  importa, pero menos»)— y ninguna de las tres pantallas donde se
  apunta o se mira el día la respetaba:

  · El **Marcador** (RACHA/PASOS/SUEÑO/COMIDA/NIVEL en Inicio, el que
    se mira cada día) **ni siquiera tenía fila de ENTRENO**. El hábito
    que Albert puso primero no se veía. Añadida, primera del todo; en
    los días de descanso no enseña un 0% sin sentido, dice DESCANSO —
    el pacto no pide minutos ese día, así que un porcentaje mentiría.
  · El editor del día completo (el "+") empezaba por PESO, que es
    justo el que menos pesa de los cuatro. Reordenado a
    entreno · pasos · comida · peso · sueño.
  · El anillo del aparato tenía PASOS antes que ENTRENO, sin más razón
    que el orden en que se escribió. Intercambiados.

  Nuevas cadenas `marcador.entreno`/`marcador.descanso` en los cinco
  idiomas, transliteradas igual que el resto del marcador (usa Press
  Start 2P, que no tiene ni kanji ni tailandés — comprobado ANTES esta
  vez, no después). Caché a v15 (de paso, el icono de Ninja con fondo
  azul que subió Albert se había quedado sin subir de caché en el
  commit anterior).

  Probado en el navegador: día de descanso (ENTRENO dice DESCANSO),
  día de entreno con datos a medias (ENTRENO 44%), el editor completo
  en el nuevo orden, y el anillo pasando por Entreno antes que Pasos.
- Última acción (2026-09-19): **el calendario deja de castigar, y el
  icono de Ninja crece un poco**. Dos cosas:

  · **El rojo por «sin datos» desaparece**, en el calendario de
    Progreso y en los «últimos 7 días» de Mi objetivo. Antes CUALQUIER
    día sin apuntar nada —hubieras fallado o simplemente no hubiera
    pacto todavía— se pintaba con `--mal` a toda celda, un rosa/rojo
    solido que contradice `MECANICA.md` §10 ("no castiga por no abrir
    la app", "el michi nunca reprocha") y que Albert señaló con sus
    propias palabras: desalienta más de lo que anima. Ahora un día sin
    cumplir se ve como uno vacío —fondo neutro, sin remarcar—, y solo
    los que SÍ dicen algo (cumplido en verde, a medias en amarillo)
    llaman la atención. `pacto.fallado` («fallado») pasa a decir «sin
    datos», la misma palabra que ya usaba Progreso para el mismo
    estado.

    De paso, dos arreglos que salieron al mirarlo de cerca: los días
    ANTERIORES a que el pacto existiera (`pacto.creado`) ya no se
    evalúan —antes un mes entero podía salir en rojo por días de antes
    de adoptar al michi, la misma regla que ya protegía el cálculo de
    abandono en `engine/michi.js` y que al calendario nunca le había
    llegado—; y el swatch amarillo de la leyenda («a medias») no tenía
    ni una regla de CSS, así que llevaba quién sabe cuánto invisible.

  · **El icono de Ninja en el menú, un poco más grande** (25px → 29px,
    solo él) — se leía pequeño ahí abajo.

  Probado en el navegador con un mes con los cuatro estados a la vez
  (cumplido, a medias, sin datos, y días de antes del pacto) y viendo
  el tamaño real de los seis iconos por CSS.
- Última acción (2026-09-19, cierre de la sesión): **tres retoques
  finales** que salieron de probarla:
  · **REST en vez de DESCANSO** en la fila ENTRENO del marcador: la
    columna del número mide 40px fijos a 9px de Press Start 2P, y
    «DESCANSO» (8 letras) se salía del borde. `marcador.descanso` pasa
    a «REST» en los cinco idiomas —la misma idea que `marcador.max`,
    que ya era una palabra corta en inglés en todos ellos, no una por
    idioma—. Comprobado en el navegador que `scrollWidth` ya no supera
    el ancho de la columna.
  · **Comiendo y dormido, un poco recolocados**: comiendo un poco más
    abajo y a la izquierda, dormido un poco más a la derecha —Albert
    lo pidió al ver los michis nuevos en la pantalla del aparato—. Se
    hizo con la propiedad CSS `translate` (no `transform`) en una
    clase `pose-<nombre>` nueva sobre `.mf-tamapng-michi`: `transform`
    es justo lo que animan `mf-tama-respira` y `mf-tama-dormita` —la
    respiración y el vaivén al dormir—, así que fijar el ajuste ahí lo
    habría pisado la animación en cada fotograma. `translate` es su
    propia propiedad en CSS moderno y se compone con el `transform` de
    la animación en vez de pelearse con él. **No se tocó ningún PNG**:
    los michis de Albert siguen intactos, el ajuste es solo de
    maquetación.
  · El icono de Ninja, un poco más grande (turno anterior, ver arriba).

  Con esto se cierra la sesión del 2026-09-18/19: los cuatro puntos de
  simplificar que dio Albert están tocados —hábitos, la gráfica,
  Ninja visible, y el menú/tono del calendario—, los 40 michis son
  dibujo suyo, y lo que queda son retoques sueltos, no decisiones
  grandes. **Mañana toca rematar la app para abrirla al público** y
  empezar a recibir feedback real — es la primera vez que se plantea
  una fecha para eso.
- Última acción (2026-09-19, después de mirar su propia gráfica):
  **el eje del tiempo se comprime a la meta**. Hasta ahora, cuando la
  previsión caía muy lejos del historial (165 días de meta contra 28
  de datos, por ejemplo), la gráfica se cortaba a vez y media el
  historial y la línea salía por el borde con una punta de flecha —
  decisión de Albert del 2026-09-12, para no apelotonar los pesajes
  contra la izquierda. Ahora la pide al revés: el eje SIEMPRE se
  comprime al tiempo exacto hasta la meta —si son dos meses, la franja
  de abajo son esos dos meses enteros, sin cortar—, para ver de un
  vistazo cuándo llegaría. Ya no hacía falta protegerse de eso: el
  aviso de arriba (`.mf-meta`, de esta misma sesión) dice la fecha con
  todas sus letras, así que la gráfica puede permitirse comprimir el
  historial sin dejar a nadie sin saber qué pasó.

  Solo cambia cuando SÍ hay una meta con fecha (`bajando`, el mismo
  campo que ya pinta el trofeo 🏆): sin ritmo que apunte a la meta no
  hay «tiempo hasta la meta» al que comprimirse, así que esa situación
  se queda con la ventana de siempre —es justo la que enseñaba la
  captura de Albert, con el ritmo subiendo en vez de bajar—.

  Probado en el navegador con dos casos: un ritmo lento que tarda 26
  semanas en llegar (el trofeo aparece siempre, sin flecha de corte) y
  un ritmo que se aleja de la meta (igual que antes, sin cambios).
- Última acción (2026-09-19, la de verdad): **por qué la gráfica de
  Albert seguía sin verse bien**. El cambio de arriba no bastaba
  porque no atacaba la causa: con SUS datos reales, el ritmo real
  apuntaba en sentido contrario a la meta (unos pesajes ruidosos,
  subiendo unos gramos), y `ritmo` era siempre `real ?? teorico` — un
  real que apuntara mal apagaba TAMBIÉN al teórico, aunque el propio
  objetivo (pasos, entreno, comida pactados) sí prometiera llegar.
  Comparó con la MichiFit antigua, que dibujaba la línea hacia la meta
  igual, y tenía razón: apagar la gráfica en cuanto el dato de una
  semana pincha desanima más de lo que informa.

  Ahora el real manda SOLO si apunta a la meta (`realApunta`); si no,
  cae al teórico del objetivo, igual que antes hacía cuando no había
  pesajes de sobra — la diferencia es que ahora también entra cuando
  SÍ hay pesajes pero van para el lado contrario. La celda, su
  etiqueta («real» / «previsto»), la insignia «según lo que apuntas»
  y qué línea dibuja la gráfica salen todos de la misma variable, así
  que no pueden volver a desincronizarse. La nota de «teórica» cambió
  de texto: decía «aún no hay pesajes suficientes», que ahora sería
  mentira en el caso nuevo (sí los hay, van para el otro lado); ahora
  dice «según tu objetivo, no según tus pesajes», cierto en los dos
  casos.

  Al escribirlo se coló la palabra «pacto» en el texto en español —
  prohibida desde el renombrado del 2026-09-11 y vigilada por
  `pruebas/objetivo.mjs`, que lo cazó al momento—. Cambiada a
  «objetivo».

  Probado en el navegador con los datos de Albert reproducidos
  (pesajes reales subiendo, objetivo que sí bajaría): ahora sale
  «Ritmo previsto», la nota de teórica, y la línea baja hasta el
  trofeo. Y al revés, con pesajes reales que sí bajan: sigue saliendo
  «Ritmo real», sin la nota, como siempre.
- Última acción (2026-09-19, la auditoría): Albert pidió comprobar que
  **toda la app está orientada a un solo objetivo** —que apuntar
  pasos, entreno, comida y peso cada día se refleje, de forma
  razonable, en cuánto falta para la meta—, y cerrar la sesión con eso
  hecho. Salieron dos cosas, una ya arreglada esta misma sesión (el
  ritmo real apagando al teórico, ver arriba) y dos más:

  · **`teorico` miraba el PACTO, no lo que de verdad apuntas.**
    `actividadDelPacto` da la media de pasos/minutos que pactaste el
    primer día en «Mi objetivo», fija hasta que la edites a mano —así
    que aunque caminaras el doble toda la semana, la previsión no lo
    notaba mientras no hubiera pesajes suficientes para el ritmo real.
    Es justo lo contrario de lo que pidió Albert: "cada día que el
    usuario registre sus puntuaciones se refleje en la gráfica".

    `actividadReciente()`, nueva en `engine/calculos.js`, mira
    `entradas` de los últimos `DIAS_FORMA` (14) días —la misma ventana
    que ya usa `forma` para el cumplimiento sostenido— y promedia SOLO
    los campos que de verdad se apuntaron; por debajo de 3 días con
    ese dato cae al pacto, campo a campo. `teorico` en Progreso la usa
    ahora en vez de `actividadDelPacto` a secas. Probado en el
    navegador: 14 días apuntando 12.000 pasos frente al pacto de 6.000
    dobla el ritmo previsto (-0,24 → -0,48 kg/semana) y corta el
    tiempo a la meta a la mitad (21 → 10 semanas).

  · **`perfil.pesoActual` se quedaba con el primer peso que
    escribiste**, aunque llevaras semanas apuntando pesajes más
    nuevos en el calendario de Progreso —esa pantalla no lo sufría,
    porque ya calcula su propio peso actual del último pesaje y no de
    `perfil`, pero Ajustes y el arranque del Simulador sí—. Ya estaba
    anotado como problema conocido en este mismo documento
    ("el simulador parte del peso actual: si no se actualiza, la
    previsión sale larga"). `registrar()`, en `App.jsx`, sincroniza
    ahora `perfil.pesoActual` cada vez que el peso que se guarda es el
    MÁS RECIENTE de todos los pesajes —corregir un día antiguo no lo
    toca, con cuidado—. Probado en el navegador: escribir el peso de
    hoy actualiza `perfil.pesoActual` al momento; corregir un peso de
    hace 5 días después NO lo pisa.

  Lo que se revisó y ya estaba bien, sin tocar: las fórmulas de
  `engine/calculos.js` (Mifflin-St Jeor, kcal/paso, kcal/min de
  entreno, 7.700 kcal/kg de grasa) siguen siendo las mismas que la
  MichiFit original y sus números ya estaban verificados; las macros
  son informativas a propósito y no deberían entrar en el cálculo de
  ritmo —eso es nutrición correcta, no un hueco—; y `ritmoReal()` usa
  una regresión de mínimos cuadrados de verdad, no una resta entre el
  primer y el último pesaje.

  Build y los seis `pruebas/*.mjs` en verde en cada paso.
- Próximo paso:
  · **abrir la app al público** — lo próximo que dijo Albert, sin fecha
    exacta pero "mañana" a fecha de este cierre;
  · **`VERSION.md` está desactualizado**: sigue diciendo v0.7.2 y caché
    `michifit-v7`, pero `public/sw.js` ya va por `michifit-v15` y no se
    ha vuelto a taguear desde el 14. Antes de abrir al público es buen
    momento para subir número de verdad, taguear y poner la tabla al
    día — es justo lo que ese documento pide hacer "al cerrar una tanda
    que merezca marcarse", y varias lo merecían. No se ha tocado esta
    sesión: es una decisión de Albert, no algo para hacer de oficio;
  · **la celda «Hasta la meta» con objetivo de ganar peso** (ver arriba);
  · **decidir el gimnasio nuevo** (se prueba desde el panel de pruebas) —
    a ojo pega más con el estilo plano de la casa/cocina nuevas que el
    gimnasio actual, que se ve renderizado en otro motor, pero queda por
    decidir viéndolo dentro de la pantallita, no en el archivo;
  · **el salón de `BG_Kitchen`** daría una «casa» mejor que la actual;
  · **`calle.png`** ya no la usa nadie;
  · **`michi_sediento` en negro** — falta esa pose para el cuarto color,
    y ahora los otros 39 michis son dibujo de Albert: si se retoma, que
    sea pidiéndosela a él y no al script;
  · **el QR de PromptPay** (con e-Wallet ID, ver `TODO.md`).
- La conversación de **hacerla HIPER sencilla** ya se tuvo, el
  2026-09-14: el mapa está en `SIMPLICIDAD.md`. **No se borró ni se
  redujo nada**, que es lo que Albert pidió. 42 conceptos, 29 de ellos
  en Inicio, y tres hallazgos — el mismo dato se presenta hasta cuatro
  veces con cuatro caras; las barras de cuidado y las de la mecánica se
  dibujan igual y obedecen a reglas opuestas; e Inicio era la única
  pantalla sin ayuda. De las cinco cosas que propone al final, solo está
  hecha la primera (el «?»).
- Después: las 21 viñetas del cómic (`ESCENAS` en `pantallas/Lore.jsx`).
  El sitio está hecho, es cambiar rutas. (Esta línea decía hasta el
  2026-09-14 que faltaban también las fotos de Ninja; entraron el 13 y
  se quedó sin actualizar.)
- Bloqueadores: **Magnific está conectado pero el plan no da acceso por
  MCP** («requires a premium account»). Desde la web funciona; desde
  aquí, no. Para los iconos dio igual — ver abajo.
- **Desplegada en https://michifit.vercel.app** (proyecto Vercel
  `the-ai-creative-content/michifit`).
  El repo YA está conectado en Vercel → Settings → Git: **cada `git push`
  a `main` despliega solo**. `vercel deploy --prod --yes` sigue valiendo
  para desplegar sin pasar por GitHub.

## Verificado en navegador
- Simulador da los mismos números que la app original: 2602 de gasto total,
  −595 de déficit, 377 quemado moviéndote, −0,54 kg/semana.
- Ajustes da el mismo IMC: 26,2 actual, 21,5 meta.
- Pantalla de pacto muestra el pacto real de Albert.
- Build de producción OK, sin errores de consola.

## Despliegue
- **Versión estándar: `v0.7.2`.** Se ve en Ajustes, última línea. Qué es
  y cómo retomarla desde el móvil o el otro portátil, en `VERSION.md`.
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

## Los botones, versión buena (2026-09-12)

La gramática del 2026-09-11 confundía a la gente que probó la app, y
tenían razón las dos veces: el botón CENTRAL significaba dos cosas según
dónde estuvieras —lo defendí aquí diciendo que «el contexto lo hace
inequívoco», y no lo hacía— y ACEPTAR estaba en el borde, que es donde
va lo que no quieres pulsar sin querer.

| Botón | En reposo | Con el anillo abierto |
|---|---|---|
| izquierda | abre el anillo | siguiente icono (da la vuelta) |
| centro | **nada** | aceptar |
| derecha | **nada** | cerrar |

No es un invento: A pasa, B acepta y C cancela es la disposición de los
tamagotchis de Bandai. Que en reposo el centro y la derecha no hagan
nada es deliberado —salen apagados, con `disabled`— porque un botón que
se busca trabajo cuando está libre es justo lo que se vino a quitar.

**Un solo anillo de ocho**, no dos: con la izquierda como única puerta,
dos anillos no tienen cómo distinguirse. El orden no es arbitrario y
está razonado en `anillos.js` — primero los cuidados, que son de un
toque y son el anzuelo, y después los datos, que abren el editor.
`dormir` es ahora un icono del anillo (era el botón derecho) y su dibujo
son tres z de tamaño creciente, idea de Albert: la luna ya la usa
«sueño», que es otra cosa —apuntar las horas— y dos lunas juntas no se
distinguirían.

**Dormido, el primer toque solo DESPIERTA.** Antes los botones seguían
funcionando con la pantalla apagada y el anillo se pintaba sobre el
cristal oscuro; quedaba raro y lo dijeron desde fuera.

Cuidado con una trampa que ya mordió: `dormido` incluye la VISTA PREVIA
del anillo, porque con el cursor sobre «sueño» la pantalla enseña ya la
escena de dormir. Los botones tienen que mirar `dormidoDeVerdad`, que no
la incluye. Con el otro, al llegar a «sueño» el anillo dejaba de avanzar
y no se podía dar la vuelta.

### Lo que había antes (2026-09-11)

Cuidar: mimar · agua · limpiar. Medir: comida · entreno · pasos · sueño,
y al aceptar se abre `EditorDia` **filtrado a ese dato** (prop `solo`).
Mientras mueves el cursor por el anillo de medir, la pantalla **enseña
ya lo que vas a apuntar**: sobre «pasos», el michi andando por la calle.

Toda la gramática vive en `src/mascota/anillos.js`. Los iconos son emoji
de momento; se cambian ahí por los PNG de Albert cuando estén.

**Tres salidas, y hacen falta**: el icono ✕, el botón izquierdo desde
cualquier sitio, y la vuelta sola a los 8 s. Un tamagotchi venía con
manual de papel; esto no.

### Si dibujas un icono a mano

Va en **`pixel/iconos-a-mano/<nombre>.png`** y ahi manda sobre la
rejilla de texto. El lado tiene que ser divisor entero de 96 (12, 16,
24, 32, 48, 96): se amplia con NEAREST y no se inventa un solo pixel.
Reducir de 16 a 12 NO es entero y emborrona, por eso se guarda a 96.

El primero es la escoba de `limpiar`, de Albert. La rejilla de aqui
dice un CUBO —a 12 px el palo en diagonal desaparecia— y se deja escrita
a proposito: documenta el intento y vuelve sola si se borra el dibujo.

**Al cambiar un icono hay que subir `const CACHE` en `public/sw.js`**:
no llevan hash en el nombre. Lo vigila `pruebas/cache-sw.mjs`.

### Los iconos de los anillos

Ocho, en `public/iconos-anillo/`, que los genera
`pixel/iconos_anillo.py` desde una rejilla de **12x12 escrita en texto**
dentro del propio archivo. Para cambiar uno se edita ahí y se vuelve a
lanzar; no hace falta abrir un editor de imágenes.

Se llaman igual que el `id` del anillo, así que `iconoDe(id)` deduce la
ruta sola y añadir un icono nuevo no toca el JSX.

**Se ven a 12 px y el archivo mide 96** — una reducción de 8 a 1 exacta,
que no emborrona. Si algún día hay que cambiar ese tamaño, que sea a un
divisor de 96 (12, 16, 24, 32) y no a un número cualquiera.

Tres cosas que costaron intentos, por si hay que dibujar más:

- **La escoba no cabe a 12 px.** Con el palo en diagonal desaparecía —un
  píxel de ancho no existe—, y recto y gordo el resultado se leía como
  un triángulo o una lámpara. Acabó siendo un cubo. Y **verde, no azul**,
  porque el icono del agua está al lado en el mismo anillo.
- **El cuenco era casi blanco** sobre el fondo claro del anillo y se
  perdía. Ahora el cuenco va naranja y la comida crema.
- **La ✕ era de contorno hueco**: ampliada se leía perfecta, a 12 px era
  una mancha con agujeros. Maciza.

Por eso la hoja de contacto (`--hoja`) tiene DOS filas: ampliada se ve
qué píxel está mal puesto, y a tamaño real se ve si el icono se
entiende. No es lo mismo, y los tres fallos de arriba solo salieron en
una de las dos.

Y el atenuado de los no elegidos subió de 0,4 a 0,62: con emoji colaba,
con dibujos de 12 px desaparecían.

### Los botones dicen lo que hacen

Bajo el aparato hay una fila con lo que hace cada botón **ahora mismo**:
`Cuidar · Registrar · Dormir` en reposo, y `Salir · Siguiente · Aceptar`
con un anillo abierto. Sale de `rotulosDeBotones()` en `anillos.js`, la
misma función que da el `aria-label`.

Estaba previsto un cartelito de bienvenida y se hizo así en su lugar: un
cartelito se lee una vez y se olvida, y aquí el problema es que los tres
botones **cambian de significado**. Esto lo enseña cada vez que lo usas.

Van **juntos en el medio**, ocupando el mismo ancho que los tres
botones (162 px contra 159), y **subidos** al hueco transparente que el
PNG del huevo deja por debajo de la carcasa —esta acaba al 96% del
alto—. Lo segundo no es capricho: así el marcador de RACHA/PASOS/SUEÑO
entra en la misma pantalla sin desplazarse.

Tres cosas que se probaron y no valían, por si a alguien le tienta:
impresos en la carcasa (abajo el huevo se estrecha rápido — a un 92% de
alto quedan 295 px de 751— y en tailandés los rótulos son largos);
clavados al centro exacto de cada botón (quedaba alineado al píxel y se
**solapaban**, porque los botones están a 48 px y «Registrar» mide 64);
y repartidos por todo el ancho, que era lo que había antes y hacía que
parecieran tres cosas sueltas sin relación con los botones.

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

## «Mi objetivo» (antes «Mi pacto»), 2026-09-11

La pantalla se llamaba «Mi pacto». Se renombró **solo el texto visible**
en las cinco lenguas: las claves del diccionario y los nombres del
código (`datos.pacto`, `engine/pacto.js`, `Pacto.jsx`) siguen igual, a
propósito. Si buscas algo de esa pantalla, busca «pacto» en el código y
«objetivo» en la pantalla.

La palabra sobrevive donde hace trabajo emocional —cuando habla el michi
y en el lore— porque el principio rector de `MECANICA.md` se apoya en
ella. Lo que se fue es el nombre de la pantalla.

**Y ahora empieza por el objetivo**, que es lo primero de todo: perder
peso · mantenerme · estar más en forma · otra cosa. Los tres primeros
escriben `perfil.deficitObjetivo` (500 / 0 / 0) y cambian las calorías
de verdad; el cuarto guarda tu texto y no toca nada, y lo dice.

**«Ganar peso» ya está** (2026-09-11). Fueron tres cosas, no una:

1. `planEnergetico` acepta déficit negativo —o sea superávit— con su
   propio techo, `SUPERAVIT_MAXIMO` = 15%. Más estrecho que el 20% del
   déficit a propósito: pasado ese punto lo que se gana es grasa.
2. `simular` le decía **«no alcanzable»** a cualquiera que quisiera
   engordar, porque exigía `restante > 0 && kgPorSemana < 0`. Ahora mira
   que el ritmo vaya en sentido contrario a lo que te queda, sea el que
   sea. El mismo fallo estaba en la previsión de `Progreso.jsx`.
3. Y lo importante: **el michi cuenta el día al revés**. Cada objetivo
   lleva un `sentido` de comida, que `sincronizarPacto` escribe en el
   pacto como `comidaSentido`. Con `'menos'` cumples no pasándote; con
   `'mas'` cumples llegando. Las mismas 1.780 kcal son ✅ con meta 1.794
   y ⬜ con meta 2.542.

El sentido vive en el PACTO y no en el perfil aunque se decida en el
perfil: `evaluarDia` recibe el pacto y nada más, y lo llaman cuatro
sitios. Así lo ven todos sin cambiar una firma, y un pacto guardado
antes cae a `'menos'`, que es como se comportaba la app hasta ahora.

Y luego, el mismo día, **«mantenerme» pasó a ser una BANDA**: cumplir es
quedarse cerca por arriba Y por abajo. Antes bastaba con no pasarse, así
que comer 700 kcal por debajo del mantenimiento contaba como cumplido.
Se aplicó también a «estar más en forma», que apunta al mismo número —
dos botones con la misma meta y distinto comportamiento muerden meses
después. Es una palabra en `OBJETIVOS` si algún día se quieren separar.

Queda una sola cosa en `ASK.md`: no hay aviso de meta de peso demasiado
alta. Es una decisión de valores, porque la app promete no juzgar el
cuerpo y todo el replanteamiento del michi salió de justo eso.

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

El de la grasa se añadió al preguntar Albert por qué le salían 47 g
donde la app antigua le daba 67. La respuesta: pesa 13 kg menos (el
reposo baja 133 kcal, correcto) **y** el reparto cambió del 30% al 25%
de grasa. Y detrás había algo peor: la grasa es la única macro que baja
sin freno, porque la proteína va fija y los carbos son lo que sobra.

**La app avisa pero NO cambia el reparto.** Es decisión de Albert y
está en `DECISIONS.md`. `pruebas/avisos.mjs` fija los dos números de
`macros()` a propósito: si alguien mete un suelo duro ahí, la prueba se
cae y hay que decidirlo, no que pase de refilón.

Está calibrado para no ser ruido: salta a 47 g y se calla a 50.

## El color, al adoptarlo (2026-09-12)

Ninja es gris en el lore pero la app arrancaba naranja, así que «Adoptar
a Ninja» te daba un gato que no era Ninja. Ahora **el de fábrica es
gris** y el color se elige en una pantalla más al final de la historia,
detrás de «Ninja existe»: el gato Y el huevo, con el michi grande
cambiando de color mientras eliges. El huevo se queda naranja de
fábrica, que es el color de marca.

Esa pantalla **solo sale al adoptarlo**. Volviendo a ver la historia
desde Ajustes sobra, porque los mismos dos selectores están unas líneas
más abajo en la pantalla desde la que has entrado.

El color se elige ANTES de que exista el perfil —la bienvenida viene
después de la historia— y no se pierde porque `onEmpezar` fusiona
(`{...d.perfil, ...perfil}`) y el perfil que arma la bienvenida no trae
`aparato`. Si algún día esa fusión pasa a ser un reemplazo, esto se cae
sin avisar.

**`estado` es el NOMBRE DEL ARCHIVO del michi, no un humor.** En el
componente SVG viejo era la clave de una tabla de sprites y el nombre se
quedó; en `TamagotchiPNG` se usa para construir la ruta. La bienvenida
pasaba `estado="kawaii"`, `kawaii-blanco.png` no existe y la cadena de
respaldo caía siempre a `michi.png` — el naranja. No se notaba porque el
de fábrica también era naranja: lo destapó cambiar el color por defecto.

Y si añades algo a `.mf-lore-texto`: es un flex en columna con los hijos
a `flex: 0 0 auto`, o sea que **no encogen**. Lo que lleve dentro una
rejilla necesita `width: 100%` y `min-width: 0` o se sale por la
derecha, sin error y sin barra de desplazamiento.

## Los rangos del simulador (2026-09-12)

Estaban escritos a mano dentro del JSX y eran de atleta: 20.000 pasos al
día, 600 minutos de entreno a la semana (diez horas) y 4.000 kcal. Con
esos márgenes el simulador contestaba con fechas de meta que no se iban
a cumplir, y una fecha optimista en una app de orientación es lo
contrario de orientar. Por abajo igual: 1.000 kcal está por debajo del
suelo que la propia app defiende en `KCAL_MINIMAS`.

Ahora: pasos **2.000–16.000** (paso de 250) y entreno **0–420 min**. El
0 de entreno se queda porque no entrenar es una respuesta legítima.
Viven en `engine/constantes.js`, que es donde dice `PROTOCOL.md` que
tienen que estar.

**La comida NO tiene números fijos, y eso es lo importante**: su rango
sale de la persona. El suelo es `KCAL_MINIMAS` según el sexo y el techo
es el gasto total por `1 + SUPERAVIT_MAXIMO` — los mismos límites que
usa `planEnergetico`, para que el deslizador no pueda llevarte a un
sitio que el motor considera imposible. Con el pacto de Albert sale
1.500–2.413.

Los tres deslizadores **estiran su banda** si el valor de arranque cae
fuera (alguien con 18.000 pasos pactados, o un objetivo de comida
escrito a mano). Un deslizador que arranca fuera de su rango se coloca
solo en el extremo y le cambia el número al usuario sin que lo pida.

`PASOS_MIN` es el más discutible de los cuatro y está anotado como tal:
2.000 pasos es poco para quien sale de casa y mucho para un día en cama.
Se eligió pensando en que esto simula un hábito sostenido.

## PromptPay, montado y apagado (2026-09-12)

Lo pidieron los amigos tailandeses de Albert. PromptPay es el estándar
nacional de QR de allí: lo escanea cualquier app bancaria tailandesa.

Encaja con la app porque un QR de PromptPay es una **imagen estática**,
igual que el de Lightning: ni API, ni backend, ni tocar la CSP, ni un
dato saliendo del dispositivo.

Está **apagado** (`ACTIVO = false` en `src/datos/promptpay.js`) porque
el QR tiene que ponerlo Albert: sale de su app del banco. Ahí están las
instrucciones, los cuatro pasos y las dos advertencias.

**La importante: el repositorio es PÚBLICO y un QR de PromptPay lleva
dentro el número de teléfono o de identidad.** Cualquiera puede leerlo
con un lector de QR, y una vez en un commit se queda en el historial
aunque se borre el archivo. PromptPay admite también un e-Wallet ID, que
no es el teléfono.

Es un interruptor a mano y no una comprobación de si el archivo existe,
por lo mismo que `datos/ninja.js`: la app se sirve estática y preguntar
por un archivo que no está deja un 404 en la consola de todos.

Comprobado encendiéndolo con otro QR de sustituto: el bloque sale el
tercero, la imagen carga, no hay scroll lateral y no hay errores. Luego
se volvió a apagar.

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
