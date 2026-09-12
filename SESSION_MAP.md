# SESSION_MAP.md — Diario de sesiones

## 2026-09-07
- Contexto: tras decidir fusionar las dos apps en una nueva y limpia, y tras la
  sesión de diseño de la mecánica de motivación.
- Qué se hizo:
  - Proyecto creado desde cero.
  - Motor portado y **recalculado**: `forma` ya no sale del IMC sino del
    cumplimiento del pacto. Añadidos pacto, comodines, racha y niveles.
  - Fórmulas energéticas traídas tal cual de la app original.
  - Cuatro pantallas: Inicio, Mi pacto, Simular, Ajustes.
  - Verificado en navegador contra las capturas de la app original.
- **Tres fallos encontrados y corregidos en la primera ejecución:**
  - El suelo de nivel *promocionaba* a un usuario nuevo al nivel 2 con 0 XP,
    porque `Math.max(SUELO, ...)` empuja hacia arriba si no se acota antes.
  - Se contaban como semanas falladas los días **anteriores a crear el pacto**:
    un usuario nuevo arrancaba castigado.
  - El perfil vacío del almacén pisaba con `null` los valores de arranque, y el
    simulador decía que no había perfil.
  - **Cambio a mitad de sesión**: la app será pública en GitHub, así que se
    quitó el perfil precargado y se añadió un asistente de primer arranque.
    Cuarto fallo encontrado al probarlo: `tmb()` esperaba un campo `peso` pero
    el perfil usa `pesoActual`, así que la estimación del metabolismo devolvía
    null. Estaba enmascarado porque el perfil de prueba traía el dato del reloj.
- Qué quedó pendiente: pantalla de registro de días pasados; Progreso; paleta
  del michi; pixel art en color; `base` de Vite antes de publicar.

## Plantilla para copiar
## AAAA-MM-DD
- Contexto:
- Qué se hizo:
- Qué quedó pendiente:
- Decisiones tomadas:

## 2026-09-08 (tarde) — Poses, botón de acción y la app instalable

- **Poses del michi**: dormido, comiendo y entrenando para los cinco cuerpos.
  La hoja de entrenar traía a los cinco pegados por las mancuernas; se
  resolvió cortando por **costuras** (camino vertical de mínimo coste) en
  vez de por columnas rectas, que partían las pesas por la mitad.
- **Botón azul = acción**: cicla casa → comer → gimnasio → calle → dormir,
  con rótulo dentro de la pantalla. "Cómo va" se movió a tocar el cristal.
- **Panel de pruebas oculto**: siete toques en el logo.
- **Ejercicios por día** (nombre, reps, peso) en el pacto, que se marcan
  desde el editor del día y tiñen el módulo. Y **macros** opcionales.
  Ninguno de los dos cuenta para el pacto: son chuleta e información.
- **PWA**: manifest, service worker e iconos generados del logo. Verificado
  en producción: el SW queda `activated` y la caché creada.
- **Botones de ayuda "?"** en Mi pacto, Progreso, Logros y Simular.
- **Flecos de la mecánica resueltos** (MECANICA.md §11): semana en lunes,
  corazón partido al gastar comodín, calorías que pesan la mitad, add-ons
  que se pierden al bajar de nivel.
- **GitHub → Vercel conectado** por Alberto: se subieron 25 commits y el
  push disparó el despliegue automático. Confirmado que funciona.
- Descartados: la API de Garmin (exige desarrollador certificado) y pagar
  Gemini. IndexedDB se descarta por innecesario, no por falta de tiempo.

## 2026-09-08 (noche) — Una sola carpeta y el progreso rescatado

- **Carpetas ordenadas.** `_ARCHIVO/` con la MichiFit original y Michigochi,
  enteras y con un `LEEME.md` que cuenta qué hay en cada una, qué sobrevive
  en la app nueva y cómo levantarlas si hiciera falta. Esta carpeta pasa a
  ser `2026_APP_MICHIFIT`, la única.
- No se pudo mover la carpeta con `mv`: la bloqueaba la propia sesión de
  Claude Code, que la tenía de directorio de trabajo. Se resolvió moviendo
  el **contenido** en vez de la carpeta. Apuntado en `LESSONS.md`.
- **Importador del CSV** de la app antigua, en Ajustes. Enseña qué va a
  entrar antes de tocar nada y fusiona sin pisar. Probado con el CSV real
  de Alberto: 72 días, 28 → 85 entradas, cero campos pisados.
- La columna `sueno` de ese CSV **no son horas** (44 a 85: es la puntuación
  de Garmin). Se guarda en `importado.suenoPuntos` en vez de inventar horas.
- Los meses importados quedan fuera de la ventana del motor (arranca en
  `pacto.creado`), así que alimentan la gráfica sin tocar racha ni nivel.
- Los CSV de datos personales al `.gitignore`: el repo es público.

## 2026-09-09 — Calorias, letra e idiomas

Tres encargos de Alberto, despues de que su madre y su chica probaran la app.

1. **«A las tres nos sale 1500 kcal».** No era la formula: eran cinco
   fallos encadenados, y el principal es que el objetivo de comida se
   congelaba al crear el pacto. Todo pasa ya por `planEnergetico()`.
   El perfil de 72a/158cm/72kg pasaba de 865 kcal/dia a 1.238.
2. **«La letra es muy pequena».** No se subieron los 72 tamanos a mano:
   se paso el CSS a `calc(Npx * var(--escala))` y se anadio un control
   de tres tamanos en Ajustes. Por defecto queda igual que antes.
3. **Cinco idiomas**: es, en, th, zh, ja. 295 cadenas, sistema propio en
   `src/i18n/`, selector de mundo en la cabecera.

Comprobado en el navegador: los cuatro idiomas nuevos por las siete
pestanas, cero claves crudas, cero castellano suelto, cero desbordes.

### 2026-09-09 (tarde) — Revisión antes de abrir al público

Alberto pidió buscar errores, código inútil y fallos de seguridad, sin
borrar nada: lo que sobre, a cuarentena.

**Seis errores**, y el primero llevaba tiempo: el motor leía `suenoHoras`
plano cuando el editor guarda `sueno: { horas }`, así que **el sueño no
afectaba al michi** aunque la pantalla lo mostrase. Igual con el estrés, y
las mismas columnas salían vacías en la copia de seguridad. Además: un
déficit negativo proponía comer de más, los carbos podían salir negativos
y la descarga del CSV podía no llegar a empezar.

**Cuatro de seguridad:** los 14 `dangerouslySetInnerHTML` pasan a un
componente `<T>` que no ejecuta HTML; se añaden las cabeceras, que no
existían; `aCSV` escapa comas y fórmulas de Excel; y lo que sale de
localStorage se valida por tipo.

**Cuarentena** en `_CUARENTENA/`: `Michi.jsx` (el SVG que nadie
importaba), dos constantes sustituidas por el diccionario y 13 reglas de
CSS. Nada borrado.

Y como cierre, el `confirm()` de borrar los datos pasa a ser una hoja de
la app que enseña qué se pierde, ofrece la copia de seguridad antes y
pide escribir el número de días. Un número, no una palabra: «BORRAR» en
un teclado tailandés o japonés sería una trampa.

### 2026-09-09 (tarde) — El michi cambia de sentido

Alberto trajo el dato mas valioso del proyecto hasta ahora: varias
personas habian probado la app y dijeron lo mismo sin ponerse de acuerdo.
**No entendian para que servia el gato, y no querian identificarse con un
cuerpo grande ni con uno pequeno.**

Tenian razon, y `MECANICA.md` ya lo sabia: su seccion 10 prometia no
juzgar el cuerpo del usuario mientras la seccion 5 definia cinco siluetas
que hacian exactamente eso. La excusa escrita era que «hablaban de
habitos, no del IMC», pero esa distincion vive en el codigo y no en la
pantalla: lo que se ve es TU gato gordo.

Fuera las cinco siluetas. **El michi refleja ahora tu constancia.** Los
16 dibujos que sobran estan en `_CUARENTENA/cuerpos-antiguos/`.

Alberto dibujo siete poses nuevas. Al colocarlas aparecieron dos cosas:

- Tres traian un **halo semitransparente** que sobre la pantalla del
  aparato se habria visto como un recuadro. Y venian en tamanos muy
  distintos. Los normaliza `pixel/normalizar_michis.py`, donde lo que
  importa es que el GATO mida lo mismo en todas las poses, no que cada
  dibujo llene el lienzo.
- Y al preguntar el si «estaban conectadas de verdad», resulto que
  **`michi_contento` era inalcanzable**. El humor salia de `animo`, que
  solo sube al apuntar el dia, y al apuntarlo ganaba la escena y tapaba
  el humor. Un dibujo hecho a mano que nadie iba a ver. Ahora el humor
  sale de `forma` y gana a la escena del dia.

De ahi sale `pruebas/cobertura-michi.mjs`, que no comprueba que el codigo
funcione sino que **ningun dibujo queda inalcanzable**.

Tambien: subir de nivel ya se celebra (era el unico momento bueno de la
app y pasaba sin verse), y se hablo de notificaciones y camara — ver
`ASK.md`.

### 2026-09-10 — Ninja tiene historia, tres colores y hora en el calendario

Cuatro cosas, y la primera es la que ordena las otras: **el michi se
llama Ninja y tiene un lore**, el del gatito callejero de Bangkok al que
envenenaron. Está en `LORE.md`, y los prompts de las 21 viñetas del
cómic están escritos. Todavía **no se cuenta dentro de la app**, que es
el problema original y sigue abierto — encabeza `TODO.md`.

**Tres gatos a elegir** (naranja, gris y blanco). No están dibujados tres
veces: el michi es un 99% monocromático, así que se tiñen por código
igual que la carcasa del huevo, con `python pixel/tenir_michi.py`.

De ahí salieron los dos errores del día, los dos por lo mismo:

- **Los mofletes salían como anillos huecos.** El tono es un CÍRCULO, no
  una recta: comparando con `hd < 16` a secas, los píxeles a 355° caían
  fuera y se quedaban sin teñir. El centro del moflete se salvaba, el
  borde no. Ahora hay `distanciaTono()`.
- **El michi blanco perdió los ojos.** El contorno marrón oscuro tiene
  saturación alta, así que el filtro no lo protegía y se le iba el color
  al aclarar. Se protege por luminosidad (`LIMITE_OSCURO`).

Ninguno de los dos se veía a tamaño real. Aparecieron al ampliar las
caras 3-4x, y la lección está en `LESSONS.md`: **el pixel art hay que
mirarlo ampliado, aunque en la app se vea a 60 px.**

Y un error mío: Alberto había retocado siete michis a mano y **el script
se los pisó**. Mi código de protección no llegó a coincidir nunca. Ahora
`retocadoAMano()` compara fechas de modificación y respeta lo tocado a
mano, con `--forzar` para saltárselo a propósito.

**El pacto se lleva al calendario del móvil** (`src/datos/calendario.js`).
Un `.ics` con los entrenos semanales y un recordatorio diario a las
21:30. Es lo más cerca de una notificación que se llega sin servidor: las
push de verdad necesitan un backend con claves VAPID y eso rompería que
los datos no salgan del dispositivo. Lo valida `pruebas/calendario.mjs`,
con textos en tailandés y japonés a propósito: en iCalendar el límite es
de 75 OCTETOS por línea y un carácter japonés ocupa tres.

También se analizaron **las mecánicas del Tamagotchi clásico** una por
una, para ver qué se adapta y qué no. Ver `MECANICA.md`.

Y al final del día, **Ninja volvió a ser gris**: era gris en el lore
original, se había escrito en naranja porque era el único michi dibujado,
y una vez hecho el gris ya no hacía falta doblar la historia. Los prompts
del cómic se reescribieron enteros. Queda decidir de qué color arranca la
app, que sigue siendo naranja — está en `ASK.md`.

### 2026-09-11 — Revisión del código antes de seguir

Antes de meter el lore en la app, un repaso entero: errores, cosas
dobles, cosas sueltas y seguridad.

Lo de «Michigochi» se cerró solo, como decía el `TODO`: **ya no aparece
en ninguna línea de código vivo**, solo en los documentos, donde es
historia y está bien que esté.

**De seguridad no salió nada.** Sin `dangerouslySetInnerHTML`, sin
`eval`, sin `innerHTML`; las cabeceras puestas y respondiendo en
producción; el importador de CSV valida la fecha con una expresión
regular y los números uno a uno, y tira todo lo demás; el único enlace
externo lleva `rel="noopener noreferrer"`; el QR de Lightning es un PNG
local y no una llamada a una API. Ningún cálculo duplicado fuera del
motor, todas las imágenes que el código pide existen y ninguna sobra.

Pero salió **un fallo que ya estaba en producción**: la versión de la
caché del service worker llevaba diez commits sin subir mientras los
michis gris y blanco se corregían dos veces con el mismo nombre de
archivo. Quien hubiera abierto la app en medio se quedaba con los gatos
de los ojos grises y los mofletes en anillo, para siempre y sin saberlo.

Al escribir la prueba que lo vigila casi repito el error de ayer: la
primera versión comparaba el primer commit con el último y veía **1
cambio donde había 42**. Un archivo que nace y se corrige después sale
como «añadido» si miras solo los extremos. Ahora recorre los commits, y
está probada en los dos sentidos.

Y el segundo hallazgo: **los tres botones del tamagotchi hablaban
castellano en los cinco idiomas**. Estaban en una tabla de constantes,
no en el JSX, y salen por `title` y `aria-label`, así que no se veían al
revisar la pantalla. Con ellos, «Cómo va» y el botón «+», que tenía su
traducción hecha y sin conectar.

También: si el navegador no deja guardar (ventana privada, almacenamiento
lleno) ahora **se avisa**. Antes `guardar()` devolvía `false` y nadie
miraba: se podía apuntar todo el día para que al cerrar no quedara nada.

Lo pequeño, en un párrafo: `.mf-pruebas` duplicado literalmente en el CSS
(no costaba bytes —el minificador ya los juntaba— pero sí era una trampa
de mantenimiento), cuatro variables muertas, la `t` del traductor tapada
dentro de `tocarLogo`, un `%s` de Python dentro de un `.mjs`, y a
`_CUARENTENA/` los nombres de días en castellano fijo y cuatro PNG
sueltos de la raíz.

### 2026-09-11 (tarde) — El aparato deja de ser un adorno

Alberto lo planteó bien: los tres botones del michigotchi no servían
para nada relevante. El izquierdo daba corazones, el central cambiaba el
decorado, el derecho dormía al michi. **Ninguno tocaba un dato.** Un
salvapantallas con botones.

Ahora son la interfaz, con la gramática de un tamagotchi de verdad: dos
anillos, izquierda abre cuidar, centro abre medir y avanza, derecha
acepta. Lo mejor no es el menú sino la **vista previa**: al pasar el
cursor por «pasos» sale ya el michi andando por la calle, y por
«comida», comiendo en casa. Es media explicación sin escribir una
palabra, y va directo a la queja original — que nadie entendía el gato.

Y dos barras nuevas, agua y orden, que bajan solas y se rellenan
pulsando, con cacas kawaii cuando la casa se ensucia.

**Lo importante de esta sesión no es lo que se construyó sino los dos
límites que se sostuvieron**, porque las dos veces el código ya escrito
me llevaba a romperlos:

Primero, «que no toquen nada» tenía que dejar de ser una frase.
`pruebas/cuidados.mjs` compara nivel, experiencia, HAPPY, forma, energía,
ánimo, racha y cumplimiento con el cuenco lleno y con el cuenco vacío, y
exige que salgan idénticos. El día que esa prueba se ponga roja, el bucle
ha empezado a premiar pulsar botones en vez de cuidarte.

Segundo, y este casi se escapa: puse «tiene sed» por delante de «viene
cumpliendo» en el humor del michi. Como el cuenco se vacía solo cada
dieciséis horas, **quien no descubriera el botón del agua no volvería a
ver a su michi contento nunca.** `pruebas/cobertura-michi.mjs` lo cazó en
la primera ejecución: `michi_contento` y `michi` inalcanzables. Cumplir
manda sobre tener sed, y punto.

De regalo salió un fallo viejo: la cadena de respaldo de los dibujos
tenía **dos eslabones idénticos con el michi naranja**, que es el de por
defecto. Al faltar un dibujo, reintentaba la misma URL para siempre y el
gato se quedaba invisible. Llevaba ahí desde que existe la cadena, y solo
apareció al pedir `michi_sediento`, que aún no está dibujado.

También se cambió, a propósito y anotado en `DECISIONS.md`, la apuesta de
`MECANICA.md` §8b: el bucle de cuidados pasa a ser el **anzuelo** que te
mete en la app, y ya dentro registras. HAPPY baja más rápido (2,2 → 3,4
por hora) y los mimos pesan algo más (22 → 28).

Queda pendiente de Alberto: los ocho iconos en pixel art y los dibujos
de `michi_sediento` y `michi_asqueado`. Mientras falten, el aparato cae
al michi de pie y no se rompe nada.

### 2026-09-11 (noche) — La app por fin dice quién es el gato

Esto cierra el problema que abrió todo el replanteamiento del michi hace
dos días: varias personas probaron la app y dijeron lo mismo sin ponerse
de acuerdo, **no entendían para qué servía el gato**. Se arregló lo que
el michi refleja, se le puso nombre e historia… y la app seguía sin
contarlo en ninguna parte.

Ahora la historia de Ninja sale **antes de pedir un solo dato**. Seis
actos, dos frases cada uno, y el botón final dice «Adoptar a Ninja» y
lleva a la bienvenida. La bienvenida deja de ser «configura tu perfil» y
pasa a ser lo que dice `LORE.md` que tenía que ser.

Los dos actos duros —el escobazo y el veneno— no enseñan nada: la escena
se apaga, se tiñe de azul y le cae lluvia. Misma decisión de tono que el
cómic, del agresor solo la sombra.

Las ilustraciones son el michi **gris** sobre los escenarios que ya
existen, no las viñetas: esas están escritas como prompts pero sin
generar. Cambiarlas el día que existan es una línea por acto.

Antes de eso, los dos dibujos que trajo Alberto: `michi_sediento` y
`michi_asqueado`. Al sediento se le quitó el sol de la esquina, que
además de sobrar estiraba la caja del dibujo y habría dejado al gato más
pequeño que en las otras poses. Y el teñido tuvo que aprender algo que
llevaba razón hasta hoy: cambiaba el tono de todo lo claro y saturado, lo
cual valía mientras en los michis solo hubiera pelaje naranja, mofletes
rosas y contorno. El michi gris salía con **la botella de agua gris y la
cara de asco gris**, o sea sin la única información que da cada dibujo.
Ahora se respeta lo que cae fuera del arco naranja del pelaje.

### 2026-09-11 (noche) — «Mi pacto» pasa a ser «Mi objetivo»

Alberto lo planteó como duda y tenía razón: *«mi pacto es un poco
ambiguo, ¿no crees?»*. Todas las apps de fitness dicen objetivo.

Se renombró **solo el texto visible**, en las cinco lenguas. Las claves
del diccionario y los nombres del código se quedan: es un refactor
grande, con riesgo, a cambio de nada que se vea.

Y la palabra no se borró del todo. `MECANICA.md` apoya su principio
rector en ella —el michi no juzga, te recuerda lo que tú dijiste— así
que sobrevive donde habla el michi y en el lore. Lo que se fue es el
nombre de la pantalla.

**La pantalla empieza ahora por el objetivo**: perder peso, mantenerme,
estar más en forma, u otra cosa que escribes tú. No son etiquetas — los
tres primeros escriben el déficit y cambian las calorías de verdad, y el
cuarto declara que no toca nada y lo dice en pantalla.

Falta «ganar peso» y está anotado: el motor recorta los superávit a
cero, y habría que invertir la regla de que pasarse de calorías rompe el
día. Alberto eligió hacer primero lo que funciona.

**El renombrado salió mal a la primera y conviene recordarlo.** Usé una
expresión regular para cambiar solo el texto entre comillas. El
comentario de cabecera de `en.js` lleva un `doesn't`, y ese apóstrofo
desemparejó todas las comillas de ahí abajo: el resultado fue que
renombró CLAVES en vez de textos —`pacto:` pasó a ser `goalo:`— y el
diccionario inglés se quedó sin su sección. Se rehizo por líneas,
tocando solo lo que va después del primer `: `.

De paso, limpieza de lo que se quedó atrás con los anillos: `siguiente`
seguía importado en `Inicio.jsx` aunque ya nadie cicla escenas, y dos
comentarios del archivo decían cosas que habían dejado de ser verdad —
«los tres botones no tocan los datos» y «el botón del medio sirve para
cambiar de escena».

### 2026-09-11 (cierre) — Los botones dicen lo que hacen

Quedaba pendiente enseñar la gramática de los anillos, y era lo que más
riesgo tenía: los tres botones acababan de pasar a ser la interfaz
principal y nadie los había explicado, en una app cuyo problema
histórico es justo ese.

En vez del cartelito de bienvenida que estaba previsto, una fila bajo el
aparato con lo que hace cada botón **ahora mismo**. Cambia con el
contexto: `Cuidar · Registrar · Dormir` en reposo, `Salir · Siguiente ·
Aceptar` con un anillo abierto. Un cartelito se lee una vez y se olvida;
esto enseña cada vez, y además confirma lo que va a pasar antes de
pulsar.

Dos intentos que no valieron, y los dos se vieron midiendo y no mirando:
impreso en la carcasa —abajo el huevo se estrecha rápido, a un 92% de
alto quedan 295 px de 751— y clavado al centro de cada botón, que quedó
alineado al píxel y **solapado**, porque los botones están a 48 px y
«Registrar» mide 64.

Probado en el peor caso: tailandés, 320 px de ancho y la letra al 130%.
Sin solapes, sin recortes y sin scroll lateral.

### 2026-09-11 (cierre) — Ganar peso

Lo último que quedaba de motor, y resultó ser tres cosas y no una.

La obvia: `planEnergetico` recortaba cualquier superávit a cero. Ahora
acepta déficit negativo con su propio techo del 15% —más estrecho que el
20% del déficit, porque pasado ese punto lo que se gana es grasa—.

La que no esperaba: **`simular` le decía «no alcanzable» a cualquiera
que quisiera engordar.** Exigía `restante > 0 && kgPorSemana < 0`, o sea
que daba por hecho que acercarse a la meta era bajar. El mismo fallo
estaba copiado en la previsión de `Progreso.jsx`.

Y la importante: **el michi contaba el día al revés de lo que necesita
quien está en volumen.** `evaluarDia` daba el día por cumplido si comías
POR DEBAJO del objetivo, que en un volumen es exactamente el fallo. Cada
objetivo lleva ahora un `sentido`, y `sincronizarPacto` lo escribe en el
pacto. Comprobado en pantalla: las mismas 1.780 kcal salen ✅ con meta
1.794 y ⬜ con meta 2.542.

El sentido va en el PACTO y no en el perfil aunque se elija en el
perfil, porque `evaluarDia` solo recibe el pacto y lo llaman cuatro
sitios. Así nadie cambia de firma, y un pacto viejo sin ese campo se
comporta como siempre — hay prueba de eso.

**La comprobación que dejé plantada hizo su trabajo.** `objetivo.mjs`
llevaba dos asserts diciendo «ganar peso NO está y el motor SIGUE
recortando los superávit». Al implementarlo se pusieron en rojo, que era
justo el aviso de «ven aquí y decide esto a propósito» en vez de que
pasara de refilón.

Dos cosas quedan sin hacer y están en `ASK.md`, las dos porque no me
tocan a mí: «mantenerme» sigue contando como adelgazar cuando debería
ser una banda, y no hay aviso de meta de peso demasiado alta — que es
una decisión de valores, porque la app promete no juzgar el cuerpo y
todo el replanteamiento del michi salió de justo eso.

### 2026-09-11 (cierre) — Mantenerse es una banda

Alberto cerró la pregunta que quedaba de la sesión anterior. «Mantenerme»
usaba el mismo criterio que adelgazar —cumplir es no pasarse— así que
comer 700 kcal por debajo del mantenimiento contaba como día cumplido.
Que es cualquier cosa menos mantenerse.

Ahora es una banda: cerca por arriba y por abajo, con el mismo margen del
10% de siempre. Con una meta de 2.242 la ventana va de 2.018 a 2.466.

Se aplicó también a **«estar más en forma»**, que Alberto no nombró pero
apunta al mismo número —ambos ponen déficit 0—: dos botones con la misma
meta y distinto comportamiento son de las cosas que muerden meses
después. Es una palabra en la tabla `OBJETIVOS` si algún día se quieren
separar, y está dicho en el comentario.

Los tres sentidos quedan así, y la nota de la pantalla sale del SENTIDO
y no del id, para que un objetivo nuevo herede la suya sin tocar nada:

| sentido | cumplir es |
|---|---|
| `menos` | no pasarte |
| `mas` | llegar |
| `banda` | quedarte cerca, por los dos lados |

Comprobado en pantalla con el mismo dato: 1.780 kcal salen ✅ con meta
1.794, ⬜ con 2.242 en banda y ⬜ con 2.542 en volumen.

### 2026-09-12 — Los ocho iconos, dibujados píxel a píxel

Alberto autorizó Magnific y preguntó si el arte podía hacerlo yo.
Respuesta corta: el MCP de Magnific pide plan premium y el suyo no lo
tiene, así que desde aquí no.

Respuesta larga, y es la interesante: **para estos ocho daba igual**.
Se ven a 12 px. A ese tamaño no hay estilo, hay silueta — 144 píxeles
encendidos o apagados— y eso no se pide, se coloca. Un generador da
«estilo pixel art» precioso a 1024 que al bajarlo a 12 es una mancha.

Así que `pixel/iconos_anillo.py`: cada icono es una rejilla de 12x12
escrita en texto dentro del archivo, se edita abriéndolo, y se exporta a
96 (8x exacto) para que el navegador lo reduzca sin emborronar.

Tres se rehicieron y los tres por la misma razón — **mirarlos a los dos
tamaños**:

- la **escoba** no cabe a 12 px. En diagonal desaparecía (un píxel de
  ancho), recta y gorda se leía como un triángulo. Acabó siendo un cubo,
  y verde: el agua está al lado en el mismo anillo y dos manchas azules
  juntas no se distinguen;
- el **cuenco** era casi blanco sobre el fondo claro del anillo;
- la **✕** era de contorno hueco: ampliada perfecta, a 12 px una mancha
  con agujeros.

De ahí que la hoja de contacto tenga dos filas. Es el complemento de la
lección de los michis: allí los fallos eran invisibles a tamaño real,
aquí uno era invisible AMPLIADO. Hay que mirar las dos.

De paso, dos huecos tapados: `pruebas/cache-sw.mjs` no vigilaba la
carpeta nueva —ni `public/ninja`, que tampoco existía cuando se
escribió— y la hoja de contacto se estaba publicando con la app.

---

## 2026-09-12 · El color se elige al adoptarlo, y el gato arranca gris

Se cierran las dos preguntas que quedaban en `ASK.md`, las dos decididas
por Alberto.

**El color.** Ninja es gris en el lore, pero la app arrancaba naranja:
«Adoptar a Ninja» te daba un gato que no era Ninja. De las tres salidas
que estaban escritas se eligió la (c), que era la mejor y la más cara:
se pregunta. Una pantalla más al final de la historia, después de «Ninja
existe», con los dos selectores —el gato y el huevo— y el michi grande
detrás cambiando de color mientras eliges. El de fábrica pasa a ser
GRIS; el huevo se queda naranja, que es el color de marca.

Solo sale al ADOPTARLO. Volviendo a ver la historia desde Ajustes esa
pantalla sobra: los mismos dos selectores están unas líneas más abajo en
la pantalla desde la que has entrado.

**La meta de peso demasiado alta**: no se avisa. La asimetría con el
suelo de IMC es deliberada y queda escrita como tal.

### Tres cosas que salieron al probarlo, y ninguna se veía leyendo

**La rejilla sacaba el texto de la pantalla.** Los dos selectores viven
dentro de `.mf-lore-texto`, que es un flex en columna con los hijos a
`flex: 0 0 auto` — y ese cero del medio es `flex-shrink`. Sin ancho
mandado, las rejillas lo toman de su contenido, no encogen, y con siete
huevos en fila se comían media frase por la derecha. Ancho al 100% y
`min-width: 0`, que es el de siempre en rejillas de `1fr`.

**Dos toques seguidos y el segundo borraba al primero.** `ponerColor`
fusionaba contra el `aparato` de las props, así que elegir gato y huevo
antes de que repintara dejaba solo el huevo: los dos toques leían el
mismo estado. Ahora sube solo el campo tocado y la fusión se hace dentro
del `setDatos`, contra `d`. Un dedo humano no llega a provocarlo; el
guion de pruebas sí, y por eso se vio.

**Y el que ya estaba y no era de esta sesión**: la bienvenida pintaba
siempre el michi NARANJA. Pasaba `estado="kawaii"`, que es herencia del
componente SVG viejo —allí `estado` era la clave de una tabla de
sprites— pero en el de PNG `estado` es el NOMBRE DEL ARCHIVO.
`kawaii-blanco.png` no existe, así que la cadena de respaldo caía
siempre al último eslabón, `michi.png`, que es el naranja. Nadie lo
había notado porque hasta ahora el de fábrica TAMBIÉN era naranja: el
fallo estaba tapado por la coincidencia, y al cambiar el color por
defecto se destapó solo. Es `estado="michi"`, como en Inicio.

Comprobado en móvil de 375: elegir blanco + azul, adoptar, y que la
bienvenida salga con el huevo azul y el gato blanco. Las seis pruebas en
verde, lint sin errores y build limpio.

---

## 2026-09-12 (noche) · Los botones, versión buena

Cambio de gramática pedido por Alberto después de que sus amigos
probaran la app: izquierda pasa al siguiente, centro acepta, derecha
cierra. Y un solo anillo de ocho iconos en vez de dos.

Lo importante es que no es una opinión contra otra: es la disposición
A/B/C de los tamagotchis de Bandai, así que quien haya tenido uno ya se
la sabe. Y arregla dos cosas concretas de lo que había —el botón central
significaba dos cosas según dónde estuvieras, y aceptar vivía en el
borde— que además yo mismo había defendido por escrito en `anillos.js`.

En reposo el centro y la derecha **no hacen nada**, y salen con
`disabled`. Es deliberado.

`dormir` pasa de ser el botón derecho a ser un icono del anillo. Su
dibujo son tres z de tamaño creciente (idea de Alberto): la luna ya es
«sueño», que es apuntar las horas dormidas, y dos lunas seguidas en el
mismo anillo no se distinguen — la misma lección que dejó el cubo verde
al lado de la gota azul. Costó tres intentos: encadenadas en diagonal
las tres z se leían como un zigzag, y con las barras de dos de ellas en
la misma fila se emborronaban.

### Dos fallos que solo salieron probándolo

**El anillo no daba la vuelta.** Al añadir la regla de «dormido, el
primer toque despierta» use `dormido`, que incluye la VISTA PREVIA: con
el cursor sobre «sueño» la pantalla enseña ya la escena de dormir. Así
que al llegar a ese icono los botones se creían que el michi estaba
dormido y se ponían a despertarlo en vez de avanzar. Ahora miran
`dormidoDeVerdad`.

**Los rótulos vacíos.** Al quedar solo uno en reposo, los otros dos se
pintaban como pastillas en blanco y descolocaban al que quedaba: «Menú»
acababa en el centro, justo debajo del botón que NO hace nada. Ahora
solo se pintan los que hacen algo, y cuando queda uno se clava bajo su
botón — con uno solo no hay con quien solaparse, que es lo que obligó a
agruparlos en su día.

### El audit de «kawaii»

Alberto pidió mirar dónde más mordía. Resultado: **ningún fallo vivo
más**, pero sí la mina que lo causaba.

`estado` significa DOS COSAS distintas, y las dos conviven en
`TamagotchiPNG.jsx`. Para el componente de PNG es el NOMBRE DEL ARCHIVO
del michi; para el SVG de al lado es la clave de una tabla de sprites,
donde `kawaii` sí es válida. El valor por defecto del de PNG era
`kawaii`, o sea un valor que no puede funcionar nunca: cualquiera que
olvidara pasar `estado` perdía el color elegido sin enterarse. Ahora el
defecto es `michi` y la línea que alimenta al SVG lleva `kawaii`
literal, no el `estado` de arriba.

Solo hay dos sitios que dibujan el aparato —Inicio y la bienvenida— y
los dos pasan `estado` explícito, así que no había más casos. Lo que
queda anotado es que `pixel/michis.js` sigue exportando las CINCO
siluetas viejas (esqueletico, gordo, kawaii, fit, hipertrofiado) que se
retiraron el 2026-09-09, y que exporta un `MICHIS` que no tiene nada que
ver con el `MICHIS` de `TamagotchiPNG.jsx` — aquél son cuerpos, éste son
los tres colores. Mismo nombre, dos cosas.

### La escoba de Alberto, y una guarda que se rompio sola

Alberto dibujo `limpiar` por su cuenta mientras se trabajaba: una
ESCOBA, a 16x16. Aqui estaba escrita como un cubo justamente porque a
12 px el palo en diagonal desaparecia — a 16 si cabe, y se lee incluso
reducida.

Dos cosas hubo que resolver. La primera, que venia a 16 y la familia va
a 96 (8x de 12): 16 a 12 no es entero y emborrona. Se guarda a 96
ampliando x6 con NEAREST, o sea con SUS pixeles, sin inventar ninguno.

Y la segunda, que el generador se la llevaba por delante. La primera
guarda que escribi comparaba FECHAS, copiando la de `tenir_michi.py`: si
el PNG es mas nuevo que el script, no lo toques. Alli funciona porque
hay un archivo original con el que comparar; aqui el original ES el
script, asi que editarlo desprotege todos los dibujos a la vez. Se cargo
la escoba dos minutos despues de escribirla, delante de mi. Y encima un
`git checkout` reescribe las fechas, asi que en una maquina recien
clonada no habria protegido nada.

Ahora es una CARPETA: `pixel/iconos-a-mano/`. Lo que este ahi manda
sobre la rejilla, punto. Se ve, se puede mirar y sobrevive a git. La
rejilla del cubo se deja escrita a proposito: documenta por que se
intento y vuelve sola si algun dia se borra el dibujo.

De paso, la cache del service worker sube a **v4**: `limpiar.png` cambio
y los iconos del anillo tampoco llevan hash. Y `pruebas/cache-sw.mjs`
tenia un fallo de un caracter en lo que IMPRIME: `slice(3)` sobre una
salida ya recortada se comia la primera letra del primer archivo de la
lista («ublic/...»). Cazaba bien, pero mandaba a buscar un archivo que
no existe.

### El simulador y PromptPay

**Los rangos del simulador** eran de atleta y estaban escritos a mano
dentro del JSX: 20.000 pasos, 600 minutos de entreno semanal —diez
horas— y 4.000 kcal. Y por abajo, 1.000 kcal, que esta por debajo del
suelo que la propia app defiende. Un simulador con esos margenes
contesta fechas de meta que no se van a cumplir.

Lo unico que tiene algo de gracia es la COMIDA: no lleva numeros fijos.
Su rango sale de la persona —`KCAL_MINIMAS` por abajo, el gasto por
`1 + SUPERAVIT_MAXIMO` por arriba— que son los mismos limites que usa
`planEnergetico`. Asi el deslizador no puede contradecir al motor, y el
dia que se cambie un limite se cambia en un sitio y se mueven los dos.
Los otros dos van a `constantes.js`, que es donde `PROTOCOL.md` dice.

Y los tres estiran su banda si el valor de arranque cae fuera. Un
deslizador que arranca fuera de su rango se coloca solo en el extremo y
le cambia el numero al usuario sin que lo pida.

**PromptPay** queda montado y apagado, a falta del QR, que solo puede
sacar Alberto de su app del banco. Lo que hay es el sitio, las
instrucciones y el aviso que importa: el repositorio es publico y ese QR
lleva dentro su numero de telefono — y un commit no se retira.

Se comprobo encendiendolo con otro QR de sustituto, porque un bloque que
nadie ha visto renderizar es un bloque que se rompe el dia que se
enciende.

---

## 2026-09-12 (tarde) · Lo que salio de probarla en el movil

Alberto la uso en el movil y salieron cuatro cosas, tres de ellas
fallos de verdad. Vale la pena decirlo: en dos dias, TODO lo que ha
mejorado de verdad esta app ha salido de alguien usandola, no de
leerla.

**La pagina pegaba un salto al abrir el anillo.** Culpa mia de ayer: en
reposo queda un solo rotulo y va `position: absolute` para clavarlo bajo
su boton, o sea que sale del flujo y dejaba la fila con altura CERO. Al
abrir el anillo aparecian tres en flujo normal y todo lo de abajo bajaba
de golpe. Altura fija escrita con las mismas variables que el rotulo.

**El teclado del movil tapaba el boton de guardar.** La hoja de
registrar va anclada abajo, que es donde llega el pulgar, y el teclado
sale justo ahi. Dos arreglos que no se pisan: `interactive-widget=
resizes-content` en el meta —que lo resuelve en Chrome de Android
haciendo que el navegador encoja la pagina— y una medida de
`visualViewport` en `--teclado` para iOS, que no lo soporta. Donde el
primero funciona, el segundo mide cero.

**El panel de pruebas tumbaba la app.** Siete toques en el logo dejaban
la pantalla en blanco. La razon: `CUERPOS.map(...)` en `Inicio.jsx`
sobre una constante que NO EXISTIA —ni definida ni importada— desde que
se retiraron las cinco siluetas. Un `ReferenceError` en render se lleva
por delante el arbol entero. `oxlint` sin tipos no persigue variables
libres, y como el panel no sale nunca solo, nadie lo piso en tres dias.
Ahora enseña los tres colores (vista previa, sin guardarlos), las poses
y los escenarios.

**Y las barras apenas se movian.** Tenia razon y la cuenta lo explica:
son horas DESPIERTO, asi que con 16 el agua tardaba un dia entero de
vigilia en vaciarse y quien abriera la app dos veces al dia la
encontraba casi llena siempre. A 10 y 14, y las cacas de 3 a 5.

Eso puso en rojo dos comprobaciones de `pruebas/cuidados.mjs`, y
ninguna porque nada estuviera mal: las dos estaban escritas contra
NUMEROS del ritmo viejo. `agua > 55` a las seis horas era un proxy de
«no molesta», cuando lo que de verdad mide eso es `!sed && !sucio`
—las dos solo saltan a cero—; y «a las 8 horas va por la mitad» era
verdad solo mientras `AGUA_HORAS` valiera 16. Las dos se reescribieron
contra la intencion y contra la constante, y la primera ademas se
partio en dos para exigir tambien que las barras SE MUEVAN, que es la
mitad que faltaba. Un proxy que se cae al cambiar lo que mide no estaba
midiendo lo que decia.

### Los documentos que mentian

`ROADMAP.md` reescrito entero: daba por pendiente la persistencia en
IndexedDB —que esta DESCARTADA con razones en `TODO.md`—, dejaba sin
marcar la PWA y las pantallas, hechas hace semanas, y seguia esperando
una «fusion con la MichiFit original» que ya ocurrio via el importador
de CSV. Ahora dice donde estamos, y recoge el punto de decision que
Alberto abrio hoy: si la app se va a Hostinger con usuarios y login.

`PROTOCOL.md` decia que la mascota es «SVG parametrico, cambia de
silueta segun los datos, no es una imagen y no puede serlo». Las tres
cosas dejaron de ser verdad el 2026-09-09. Es y sera PIXEL ART (Alberto).

Y el codigo muerto de las cinco siluetas queda anotado en los dos sitios
sin borrarlo, porque son los dibujos originales y eso se decide
mirandolos. Lo que si se arreglo es la colision de nombres: habia dos
`MICHIS` distintos —cuerpos en `pixel/michis.js`, colores en
`TamagotchiPNG.jsx`— y el segundo pasa a ser `COLORES_MICHI`.

### Y mas dibujos de Alberto

Redibujo `limpiar` otra vez (una escoba mejor) y `comida`, que ahora
lleva palillos y verdura. Estaban solo en `public/`, donde el generador
se los habria llevado por delante: los dos pasan a
`pixel/iconos-a-mano/`, que es la carpeta que manda. Cache a v5.

### Cierre del dia

Queda anotada una idea de Alberto para cuando haya calma: que «dormir» y
«sueño» acaben siendo el MISMO icono, o que se diferencien con una
siesta. Expresamente NO se hace ahora.

La duda de fondo que hay debajo es buena y por eso se deja escrita en
`TODO.md` y no solo el cambio: hoy son dos iconos porque por dentro son
dos cosas distintas —un cuidado y un dato—, y esa es una razon del
CODIGO, no de quien usa la app. Es justo el tipo de cosa que toca mirar
en la conversacion de simplificar.

Y ese es el otro hilo abierto: Alberto quiere sentarse a ver como hacer
la app HIPER sencilla de entender. Dijo dos veces que por ahora no se
borre ni se reduzca nada, que tal como esta, esta bien. Lo que hay que
llevar a esa conversacion no es una lista de recortes, sino el mapa de
lo que la app pide entender: cuantos conceptos hay, cuales se explican
solos en la pantalla y cuales hay que deducir.
