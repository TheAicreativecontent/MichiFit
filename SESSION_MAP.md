# SESSION_MAP.md — Diario de sesiones

> Diario día a día, de más viejo a más nuevo. **Al final** hay una sección,
> «Archivo de CURRENT.md», con la bitácora de «Última acción» del 7 al 19
> de septiembre y las notas de diseño largas que hasta el 2026-09-19
> vivían en `CURRENT.md`. Se movieron enteras y sin retocar para que
> `CURRENT.md` cuente solo cómo está el proyecto ahora.

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
- **GitHub → Vercel conectado** por Albert: se subieron 25 commits y el
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
  de Albert: 72 días, 28 → 85 entradas, cero campos pisados.
- La columna `sueno` de ese CSV **no son horas** (44 a 85: es la puntuación
  de Garmin). Se guarda en `importado.suenoPuntos` en vez de inventar horas.
- Los meses importados quedan fuera de la ventana del motor (arranca en
  `pacto.creado`), así que alimentan la gráfica sin tocar racha ni nivel.
- Los CSV de datos personales al `.gitignore`: el repo es público.

## 2026-09-09 — Calorias, letra e idiomas

Tres encargos de Albert, despues de que su madre y su chica probaran la app.

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

Albert pidió buscar errores, código inútil y fallos de seguridad, sin
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

Albert trajo el dato mas valioso del proyecto hasta ahora: varias
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

Albert dibujo siete poses nuevas. Al colocarlas aparecieron dos cosas:

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

Y un error mío: Albert había retocado siete michis a mano y **el script
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

Albert lo planteó bien: los tres botones del michigotchi no servían
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

Queda pendiente de Albert: los ocho iconos en pixel art y los dibujos
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

Antes de eso, los dos dibujos que trajo Albert: `michi_sediento` y
`michi_asqueado`. Al sediento se le quitó el sol de la esquina, que
además de sobrar estiraba la caja del dibujo y habría dejado al gato más
pequeño que en las otras poses. Y el teñido tuvo que aprender algo que
llevaba razón hasta hoy: cambiaba el tono de todo lo claro y saturado, lo
cual valía mientras en los michis solo hubiera pelaje naranja, mofletes
rosas y contorno. El michi gris salía con **la botella de agua gris y la
cara de asco gris**, o sea sin la única información que da cada dibujo.
Ahora se respeta lo que cae fuera del arco naranja del pelaje.

### 2026-09-11 (noche) — «Mi pacto» pasa a ser «Mi objetivo»

Albert lo planteó como duda y tenía razón: *«mi pacto es un poco
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
día. Albert eligió hacer primero lo que funciona.

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

Albert cerró la pregunta que quedaba de la sesión anterior. «Mantenerme»
usaba el mismo criterio que adelgazar —cumplir es no pasarse— así que
comer 700 kcal por debajo del mantenimiento contaba como día cumplido.
Que es cualquier cosa menos mantenerse.

Ahora es una banda: cerca por arriba y por abajo, con el mismo margen del
10% de siempre. Con una meta de 2.242 la ventana va de 2.018 a 2.466.

Se aplicó también a **«estar más en forma»**, que Albert no nombró pero
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

Albert autorizó Magnific y preguntó si el arte podía hacerlo yo.
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
por Albert.

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

Cambio de gramática pedido por Albert después de que sus amigos
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
dibujo son tres z de tamaño creciente (idea de Albert): la luna ya es
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

Albert pidió mirar dónde más mordía. Resultado: **ningún fallo vivo
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

### La escoba de Albert, y una guarda que se rompio sola

Albert dibujo `limpiar` por su cuenta mientras se trabajaba: una
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
sacar Albert de su app del banco. Lo que hay es el sitio, las
instrucciones y el aviso que importa: el repositorio es publico y ese QR
lleva dentro su numero de telefono — y un commit no se retira.

Se comprobo encendiendolo con otro QR de sustituto, porque un bloque que
nadie ha visto renderizar es un bloque que se rompe el dia que se
enciende.

---

## 2026-09-12 (tarde) · Lo que salio de probarla en el movil

Albert la uso en el movil y salieron cuatro cosas, tres de ellas
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
Albert abrio hoy: si la app se va a Hostinger con usuarios y login.

`PROTOCOL.md` decia que la mascota es «SVG parametrico, cambia de
silueta segun los datos, no es una imagen y no puede serlo». Las tres
cosas dejaron de ser verdad el 2026-09-09. Es y sera PIXEL ART (Albert).

Y el codigo muerto de las cinco siluetas queda anotado en los dos sitios
sin borrarlo, porque son los dibujos originales y eso se decide
mirandolos. Lo que si se arreglo es la colision de nombres: habia dos
`MICHIS` distintos —cuerpos en `pixel/michis.js`, colores en
`TamagotchiPNG.jsx`— y el segundo pasa a ser `COLORES_MICHI`.

### Y mas dibujos de Albert

Redibujo `limpiar` otra vez (una escoba mejor) y `comida`, que ahora
lleva palillos y verdura. Estaban solo en `public/`, donde el generador
se los habria llevado por delante: los dos pasan a
`pixel/iconos-a-mano/`, que es la carpeta que manda. Cache a v5.

### Cierre del dia

Queda anotada una idea de Albert para cuando haya calma: que «dormir» y
«sueño» acaben siendo el MISMO icono, o que se diferencien con una
siesta. Expresamente NO se hace ahora.

La duda de fondo que hay debajo es buena y por eso se deja escrita en
`TODO.md` y no solo el cambio: hoy son dos iconos porque por dentro son
dos cosas distintas —un cuidado y un dato—, y esa es una razon del
CODIGO, no de quien usa la app. Es justo el tipo de cosa que toca mirar
en la conversacion de simplificar.

Y ese es el otro hilo abierto: Albert quiere sentarse a ver como hacer
la app HIPER sencilla de entender. Dijo dos veces que por ahora no se
borre ni se reduzca nada, que tal como esta, esta bien. Lo que hay que
llevar a esa conversacion no es una lista de recortes, sino el mapa de
lo que la app pide entender: cuantos conceptos hay, cuales se explican
solos en la pantalla y cuales hay que deducir.

## 2026-09-13
- Contexto: Albert vuelve al portatil de casa despues de trabajar en el
  otro. Se pone al dia (4 commits del 12), y pide limpiar el codigo
  muerto que quedaba anotado en `TODO.md`: las cinco siluetas y
  `salir.png`.

### Las cinco siluetas, la otra mitad

Los 16 PNG de los cuatro cuerpos sobrantes se fueron a `_CUARENTENA/` el
2026-09-09. Las REJILLAS no: `pixel/michis.js` siguio cuatro dias
exportando esos mismos cinco cuerpos como texto de 32x32, y
compilandose con la app. `Tamagotchi.jsx` hacia `MICHIS[estado] ??
MICHIS.kawaii` en cada render: se leian siempre y se pintaban NUNCA,
porque el dibujo estaba tras un `!sinMichi` y el unico sitio que monta
ese componente pasa siempre `sinMichi`.

Van a `_CUARENTENA/cuerpos-antiguos/`, con los dibujos, y con ellas su
generador: `generar_michis.py` solo hacia eso —los PNG por estado, la
hoja de contactos y el propio `michis.js`— y ningun otro script de
`pixel/` lo importa.

**Lo unico vivo de ese archivo era `TAM = 32`**, y no medía lo que
parece. No es el tamaño de un sprite: es el de la REJILLA DEL LCD. Que
el cuadrito de la rejilla y el pixel del michi midan igual es la
estetica entera del aparato —lo dice la cabecera del componente desde el
primer dia—, asi que el 32 se queda en `Tamagotchi.jsx` como numero
propio, con su porque al lado.

Y con el sprite se fueron tres props que solo existian para decirle al
componente que NO dibujara: `estado`, `cara` y `sinMichi`. Eso deshace
de paso la trampa que ya mordio una vez el 2026-09-12 —un `estado`
que significaba una cosa en el componente SVG y otra en el de PNG, y que
dejo la bienvenida pintando siempre el michi naranja en produccion—:
ahora solo hay un `estado` en todo el arbol.

La etiqueta de accesibilidad decia «Michi kawaii, neutro»: en
castellano, en una app que habla cinco lenguas, y describiendo algo que
no se pintaba. El SVG pasa a `aria-hidden`, que es lo que corresponde a
lo que sustituye —un `<img alt="">`— porque el michi lo pone otra
imagen encima.

### salir.png, borrado y no guardado

El PNG, su rejilla en `iconos_anillo.py` y el rotulo `anillo.salir` en
las cinco lenguas. **Borrado del todo, no movido a cuarentena, y a
proposito**: es una equis de 12x12 que se rehace en dos minutos y el
historial de git es sitio de sobra. En `_CUARENTENA/` va lo que costaria
recuperar, no todo lo que existio alguna vez; si entra cualquier cosa,
deja de ser una carpeta que se pueda leer.

Se quedo sin sitio el 2026-09-12, cuando el boton derecho paso a cerrar
el anillo. Llevaba un dia en la carpeta de iconos vivos fingiendo que se
usaba.

### Lo que se comprobo antes de dar por bueno el borrado

- Que `anillo.salir` no lo pedia ningun `t(...)`: los rotulos del anillo
  salen de `ANILLO` en `anillos.js`, y ahi no esta.
- Que los ocho iconos que quedan se regeneran **byte a byte identicos**
  (`python pixel/iconos_anillo.py --hoja`). Por eso `CACHE` SE QUEDA EN
  v5: lo que tapa la cache son los archivos modificados, y aqui solo hay
  uno borrado. Lo dice la propia `pruebas/cache-sw.mjs`.
- Que la hoja de contacto se regenera tambien. Se le olvidaba facil —va
  detras de `--hoja`— y una hoja con un icono que ya no existe es
  exactamente el problema de «los documentos que mentian» del dia
  anterior, en imagen.
- Y el componente que se toco **en el navegador**, no solo compilando:
  el respaldo en SVG solo sale si falla `huevo.png`, asi que se forzo el
  error a mano. Dibuja carcasa, LCD, banda y los tres botones, con el
  michi encima; `aria-hidden` puesto, `role` fuera, cero errores en
  consola. Un respaldo que nadie ha visto renderizar es un respaldo
  roto, que es la leccion de PromptPay del dia anterior.

### Documentos

`PROTOCOL.md` mandaba generar los sprites con un script que ya no esta
ahi; ahora la regla es generica (no editar a mano lo generado, cada
archivo dice quien lo hace) y el comando que queda es el de los iconos.
`DECISIONS.md` afirmaba en presente que «el michi sigue siendo datos, no
una imagen»: se marca como dejo de ser verdad sin borrar la decision,
que es historia y explica el aparato.

### Y una pregunta de Albert: ¿ahi se puede poner un video?

Si, y ya estaba montado: misma lista `src/datos/ninja.js`, se distingue
por la extension y `Lore.jsx` pinta un `<video controls playsInline
preload="metadata">` en vez de un `<img>`.

Pero al mirarlo salio una sospecha, y esta vez se comprobo ANTES de
contarla como arreglada. Un video no se pide entero: el navegador lo
pide POR TROZOS, con cabecera `Range`, y el servidor contesta 206.

Con un mp4 de prueba y el service worker al mando: el video se veia y NO
quedaba en la cache. Las dos cosas por el mismo motivo. `res.ok` es
TRUE para un 206 —es un 2xx—, asi que el trozo pasaba el filtro y
`cache.put` lo rechazaba con un `TypeError: Partial response (status
code 206) is unsupported`. Comprobado a mano, no deducido. Esa promesa
no la recogia nadie: un fallo no controlado por cada trozo de video, e
invisible desde la consola de la pagina porque ocurre dentro del worker.
Se veia bien porque el error salta DESPUES de devolver la respuesta. Por
suerte, no por diseño.

Arreglado en `public/sw.js`: lo que lleva `Range` va derecho a la red,
sin tocar la cache ni al servir ni al guardar. Y de segundo cerrojo, se
guarda solo el `200` exacto en vez de todo el 2xx. Comprobado despues:
el video se reproduce, se ADELANTA (que es lo que se rompe cuando la
cache se mete de por medio), y los iconos y los michis se siguen
guardando con 200.

Que un video no se pueda ver sin cobertura es ademas lo que conviene:
son los archivos mas pesados de la app y llenar la cache del movil con
ellos para que el michi arranque sin red es un mal cambio.

`CACHE` se queda en v5: no ha cambiado ninguna imagen sin hash. Lo que
cambia es la logica del worker, y esa se actualiza sola.

Y `datos/ninja.js` decia que los videos eran `.mp4`, cuando `esVideo`
acepta tambien `.webm` y `.mov`. Importa justo ahora: lo que graba el
iPhone de Albert es `.mov`, y el comentario le habria hecho creer que
tenia que convertirlo.

### Ninja, por fin

Albert dejo cuatro archivos en `public/ninja/`: dos fotos del gato en
casa y DOS VIDEOS que no habia mencionado. Se miraron los cuatro antes
de montar nada, y menos mal.

Las fotos, bien y montadas: el atigrado sentado en la silla mirando a
camara —la que el mismo habia señalado como la buena— y otra durmiendo
estirado en la cama. Verticales de movil, 1080x1920 y 1134x2016, unos
190 kB cada una.

Comprobado en el navegador a 375x812, que era lo que quedaba por ver de
la galeria: las VERTICALES caen bien (llenan el alto, se recortan a lo
ancho), se pasa de una a otra deslizando, y la pagina NO desborda a lo
ancho. El pie de la segunda parecia cortarse en la captura; medido, no
se sale de su figura — era el recorte de la captura, no la app.

`CACHE` se queda en v5 y esta vez por otro motivo: son archivos NUEVOS,
o sea URLs nuevas, y la cache no puede tapar lo que no tiene guardado.
La prueba lo dice desde el principio y aqui se aplico solo.

### Los videos: el envenenamiento y el veterinario

Eran los actos 4 y 5 de la historia GRABADOS DE VERDAD. Ninja tirado en
el suelo mojado sin poder levantarse, y despues en el veterinario con el
cono y la via.

Decision de Albert: fuera. Su sitio es TikTok —su chica ya conto esa
parte alli y recibio mucho apoyo— y en la app solo Ninja viviendo feliz,
que es mas evergreen y positivo. Coincidio con la recomendacion, que
iba por las mismas dos razones:

· La pantalla es el EPILOGO. Lleva al lado «Vive en Bangkok, duerme
  mucho y sigue robando comida de la mesa», y existe para cerrar en
  calma. El veneno ya esta contado en el acto 4, en texto, donde esta
  medido.
· Y un detalle tecnico que pesaba: el `<video>` va con
  `preload="metadata"` y SIN `poster`, o sea que el PRIMER FOTOGRAMA es
  la miniatura. No queda detras de un boton de play: se veria sin
  haberlo pedido.

Queda escrito en `DECISIONS.md` y, sobre todo, en la cabecera de
`datos/ninja.js`, que es el archivo que alguien va a abrir el dia que
quiera añadir algo. Una decision de producto solo sirve donde muerde.

Los videos se borraron de `public/ninja/` y nunca llegaron a `git add`.

### Y el aviso del repositorio publico

Las fotos son de un piso de Airbnb, no de su casa, asi que el encuadre
importa menos de lo que parecia. Aun asi queda como lo siguiente: mas
fotos y con menos casa detras. Es el mismo aviso que el del QR de
PromptPay y por lo mismo — el repositorio es publico y un commit no se
retira.

### Los pies de foto hablaban castellano en japones

Lo cazo Albert nada mas verlo: los pies de las dos fotos de Ninja
estaban escritos a mano dentro de `datos/ninja.js` —«En casa»,
«Durmiendo, que es lo suyo»— y salian igual con la app en japones.

Es la TERCERA vez que pasa lo mismo en este proyecto: los botones del
aparato el 2026-09-11 y los nombres de los dias el 2026-09-09. Siempre
el mismo mecanismo: un texto que se escribe donde es comodo en vez de
donde toca, y nadie se entera porque quien lo escribe lo lee en su
idioma.

Arreglado como ya lo hace `ANILLO`: la lista lleva una CLAVE y el texto
vive en `src/i18n/`, en `lore.fotos`. Y la cabecera de `ninja.js` lo
dice ahora en el paso 2 de las instrucciones, que es donde alguien va a
estar mirando cuando le entre la tentacion: el camino corto ya no esta
disponible. Comprobado en el navegador con la app en japones: «おうちで»
y «いつもの昼寝».

### La patita nueva

Albert redibujo `pasos`: una patita con los deditos separados del
cojin. Se probo en el anillo entero, a tamaño real y APAGADA (que es
como se ven siete de los ocho, con `opacity .62` y `saturate(.6)`), y
pasa las dos pruebas. Es mejor que la anterior, que era un bulto: el
significado esta en la SILUETA, y eso es justo lo que sobrevive a que
te quiten el color y el tamaño.

Antes se habia probado tambien el estilo de las referencias que mando
—patita con almohadillas rosas, como las de los packs de pixel art— y
NO vale aqui, por dos razones que solo se ven midiendo: a 12 px el
contorno se come el presupuesto y la silueta se emborrona, y sobre todo
su gracia es el contraste rosa/pelo, que es exactamente lo que el
apagado destruye. Queda anotado que ese dibujo luciria en el icono de
la app (192 y 512 px), que es donde hay sitio.

Dos cosas de acabado, y una es urgente:

· URGENTE, y ya mordio una vez el 2026-09-12: el archivo estaba SOLO en
  `public/`, que es donde el generador pisa. A `pixel/iconos-a-mano/`,
  byte a byte igual —mide 96x96 y el guardian acepta ese lado—, y
  comprobado que el generador ya dice «dibujado a mano».
· De pulir, y se deja para el: es una imagen suave (707 colores, 2.746
  pixeles con el borde a medias, negro puro) donde las otras siete son
  pixel art de cuatro colores, cero bordes a medias y tinta `#3A2D24`.
  Se probo pasarla a rejilla de 24 y queda limpia sin cambiarle la
  forma, pero es SU dibujo y esa decision no es mia. Anotado en
  `TODO.md`.

`CACHE` a v6, y esta vez SI hacia falta: mismo nombre de archivo, sin
hash, contenido distinto. Las fotos de Ninja del mismo dia no la pedian
porque eran archivos nuevos. Los dos casos, seguidos y con su motivo,
son la mejor explicacion de esa regla que hay escrita en el proyecto.

## 2026-09-14
- Contexto: Albert pide el estado de la app leyendolo de Vercel, y al
  cruzarlo con el disco sale una diferencia: produccion servia
  `michifit-v6` y aqui ponia `v5`.
- Que se hizo:

**Lo del v5/v6, aclarado.** No era un despliegue fantasma ni se habia
perdido nada: esta copia del repositorio estaba **cuatro commits atras**.
Se clono el 12, el 13 se trabajo desde otro sitio, y aqui no se hizo
`git pull`. Los cuatro commits (`ab22c8b`, `97ecc56`, `a8485ad`,
`08869fb`) estaban en GitHub y en produccion desde el dia 13.

La leccion no es «haz pull» —eso ya se sabe—, es que **desde fuera no se
distingue** una copia local atrasada de un despliegue hecho a mano sin
commitear. Las dos se ven igual: produccion adelantada respecto al disco.
Lo que lo desempato fue leer el comentario del `sw.js` desplegado, que
contaba por que subia a v6. Los comentarios honestos en el codigo
sirvieron de bitacora.

**La v0.7.0, base estandar.** El proyecto llevaba desde el 7 de
septiembre en `"version": "0.0.0"`. En el portatil daba igual —el ultimo
commit lo dice todo— pero Albert trabaja tambien desde el movil y desde
otro portatil, y ahi no hay forma de saber que tienes delante. Ahora hay
un numero, y esta en cuatro sitios que dicen lo mismo: la etiqueta de Git
`v0.7.0`, `package.json`, la cache `michifit-v7` y `VERSION.md`.

`VERSION.md` es el documento nuevo, y no es un changelog: es por donde se
empieza cuando te sientas desde otro sitio y no sabes por donde ibas.
Lleva los comandos de clonar, de arrancar, y el `git pull` de antes de
nada — con lo de este mismo dia escrito al lado como la razon de que este
ahi.

La cache sube a v7 **sin que haya cambiado ninguna imagen**, que es la
excepcion a la regla del proyecto. El motivo, escrito en el propio
`sw.js` para que no parezca costumbre: obliga a los dispositivos que ya
tienen la app instalada a tirar la cache vieja y arrancar todos en la
misma base, en lugar de ir cada uno con un resto distinto de v5 o v6.
Cuesta una descarga de 125 KB, una sola vez.

Del codigo no se toco **nada**: los seis tests pasan y el build sale con
el mismo hash (`index-SMTa-lIt.js`) que ya estaba en produccion.

- Que quedo pendiente: la sesion de trabajo de hoy, que empieza a partir
  de aqui. Y la propuesta de enseniar la version DENTRO de la app, en
  Ajustes — se dejo sin hacer porque toca interfaz y los cinco idiomas, y
  eso se decide, no se cuela en una tanda de mantenimiento.

## 2026-09-14 (tarde) — Un solo boton para dormir, y la version a la vista
- Contexto: Albert aprueba lo de enseniar la version en la app («lo
  aplicare al resto de aplicaciones») y cierra la duda de dormir/sueno
  describiendo el comportamiento que quiere.
- Que se hizo:

**La version, en Ajustes.** Ultima linea de la pantalla. El numero NO
esta escrito en el codigo: entra al compilar desde `package.json` via
`__VERSION__`, definido en `vite.config.js`. Escrito a mano se queda
viejo el dia que nadie lo cambie en los dos sitios, y entonces la app
mentiria sobre que version es — que es justo el problema que se venia a
resolver esta manana.

Un detalle que salio de mirarlo: se puso primero a 10 px con
`opacity: .55`, y eso da menos de 3:1 de contraste. Para un dato que se
viene a buscar a proposito, y en un movil, es al reves de lo que hace
falta. Ahora usa el mismo tratamiento que `.mf-pie`, que es la
convencion del proyecto.

Queda dicho, y no se toca aqui: **toda la familia `--tinta-flojo` anda
por 3:1** —notas, pies, todo—, por debajo del 4,5:1 que se considera
legible. Eso es una decision de diseno de toda la app, no un arreglo
que se cuela en un commit de otra cosa.

**Dormir y apuntar el sueno pasan a ser UN boton.** Eran dos iconos
—tres z y luna— separados porque por dentro son un cuidado y un dato.
Razon del codigo, no del usuario. El comportamiento lo describio
Albert y es el que se implemento: aceptar duerme al michi Y abre el
editor; **cancelar deja al michi dormido igual**; despierta con
cualquier boton, que ya funcionaba asi.

Lo que hace que el gesto sea uno es lo de cancelar. No pulsaste
«apuntar», pulsaste «se va a dormir»: eso ya ha ocurrido, y el editor
es una oferta, no un peaje. Asi el mismo boton sirve a quien solo
apaga el gato por la noche y a quien viene a apuntar las horas, sin
preguntarle cual es.

Se quedo la **luna**, y la razon buena no es de gusto: **el michi
dormido ya lleva las tres z dibujadas encima**. Como icono del anillo
repetian lo que la pantalla iba a enseniar un segundo despues. La luna
dice «noche» y deja que la respuesta la de el gato. La segunda razon es
de dibujo: a 12 px una silueta maciza se lee y tres trazos finos de
tinta no, y por eso las z eran la unica excepcion a la regla de contorno
mas relleno del resto de iconos.

El anillo pasa de ocho iconos a **siete**. El dibujo de las z se retira
igual que la equis de `salir` el 13: rejilla de `iconos_anillo.py`, PNG
y rotulo en las cinco lenguas. Espera en el historial de git. Se
comprobo que los siete que quedan se regeneran **byte a byte
identicos**, asi que la cache NO hacia falta subirla.

Probado entero en el navegador a 375x812: el anillo con la luna y el
rotulo «DORMIR Y APUNTAR», aceptar → gato dormido y editor abierto,
cancelar → sigue dormido, pulsar → despierta.

- Que quedo pendiente: la conversacion de simplificar, el QR de
  PromptPay, y mas fotos de Ninja. El contraste de `--tinta-flojo`,
  anotado arriba, si alguna vez se quiere abrir.

## 2026-09-14 (noche) — El zoom, y el «?» que faltaba
- Contexto: Albert manda una captura de la pantalla del michi y pide
  poder ampliarla. Y dice para que: **quiere que el anillo se vea
  SIEMPRE en la parte de abajo, dentro de la pantalla**. Pide tambien el
  «?» de Inicio, que salio del mapa de la conversacion anterior.
- Que se hizo:

**El zoom, en un boton y no en el cristal.** Albert dijo «un boton o
clicar la pantalla». El cristal ya esta cogido desde el 2026-09-11:
tocarlo hace que el michi cuente como vas. Poner ahi el zoom habria
quitado algo que ya existe y funciona, asi que va en un boton, arriba a
la derecha, al lado del «?».

Se amplia con `transform: scale()` y NO pasando un tamanio mayor al
aparato. Dentro de la pantalla esta todo en pixeles fijos —barras de 7
px, rotulos de 6, iconos de 12—, asi que con un aparato mas grande
habrian crecido la carcasa y el escenario y el resto se habria quedado
igual de pequenio. Que es lo contrario de ampliar.

**Tres cosas que solo se vieron midiendo**, y las tres eran de verdad:

· El factor se quedaba en **1,10** porque medía contra el ancho del
  contenedor, que lleva los 18 px de aire de la pagina. Con
  `margin-inline: -18px` al ampliar, sale **1,25**. Y 1,10 no se nota.
· La altura reservada se quedaba **100 px corta**: se calculaba como
  `tamanio * proporcion`, que es solo la carcasa, y dentro va tambien la
  fila de rotulos de los botones. Ahora se mide.
· Y el gordo: medir una vez al pulsar salia MAL, porque la fila de
  rotulos aun no tenia su altura final. Se paso a `ResizeObserver`... y
  entonces el factor se quedaba en **1 del todo**. La causa era un
  BUCLE: `.mf-zoom` es flex, y por defecto un hijo se estira a la altura
  del contenedor — que se calcula a partir de la altura del hijo. La
  lupa crecia, el contenedor crecia, la lupa se estiraba mas... hasta
  que ya no cabia y el factor caia a 1. Un `align-items: flex-start` lo
  cierra.

Ninguna de las tres se ve mirando la pantalla: el aparato salia bien en
los tres casos. Se cazaron leyendo las medidas desde la consola.

**El «?» de Inicio.** Primer punto de `SIMPLICIDAD.md` y el mas barato.
Tres parrafos en las cinco lenguas, y los tres dicen justo lo que el
mapa marco como invisible: que el michi refleja la constancia y nunca el
cuerpo y como van los botones; que HAPPY, WATER y CLEAN son cuidado y
**no puntuan**; y que lo que si cuenta esta debajo. El segundo es el que
importa: los dos sistemas se dibujan con las mismas barras de pixel, y
eso no producia confusion sino una creencia equivocada y estable.

Se corrigieron ademas las tres frases de `SIMPLICIDAD.md` que el propio
«?» dejaba desfasadas. Un documento que describe la app tiene que dejar
de mentir el mismo dia que la app cambia.

- Que quedo pendiente: **el anillo permanente dentro de la pantalla**,
  que es a donde va todo esto, anotado en `TODO.md`. Antes hay que
  decidir si los iconos se redibujan a una rejilla mayor: a 1,25 los de
  12 px pasan a 15 y dejan de ser una reduccion exacta desde los 96 del
  archivo.

## 2026-09-16
- Contexto: Albert vuelve al portatil de casa. Primero, una correccion
  que va antes que el codigo: **se llama Albert, no Albert**. Los
  documentos viejos y el historial de git dicen Albert en decenas de
  sitios; eso es historia y no se reescribe sin que lo pida, pero lo
  nuevo va como Albert.
- Esta copia estaba 4 commits atras (los del 14). `git fetch` primero,
  que es la leccion del 14, y esta vez funciono: aparecieron los cuatro
  y quedo claro en un segundo que no habia nada perdido.

### Al dia, y comprobado

No basta con decir «ya he hecho pull». Lo que lo demuestra: el bundle
compilado en local es `index-COgU9QUw.js` y el que sirve produccion es
`index-COgU9QUw.js`. Mismo hash, o sea mismo codigo exacto. Version,
etiqueta de git y version de cache tambien cuadran en v0.7.2 / v7.

De paso, una precision que Albert pidio asi —«conectate a Vercel y
descargate lo que necesites»— y conviene tener clara: **Vercel no guarda
nada nuestro**. Solo publica lo que hay en GitHub. Ponerse al dia es
siempre bajar de GitHub; si algun dia produccion tuviera algo que no
esta en git, eso seria una emergencia, no una fuente.

### El video, y una equivocacion mia

Habia dos archivos en `public/ninja/` que llegaron por OneDrive —que
sincroniza la carpeta— pero que nunca estuvieron en git.

La foto entro. El video lo mire, saque seis fotogramas y lo describi
como «Ninja panza arriba jugando en el suelo». **No lo era.** Es el dia
que su chica lo encontro envenenado, y esos movimientos de patas son
espasmos. Lo corrigio Albert.

Es exactamente el video que no habia que confundir, y el error tiene
una causa que merece la pena anotar: unos fotogramas sueltos, sin
sonido y sin contexto, de un gato tumbado moviendo las patas, se
parecen a un gato jugando. La conclusion no es mirar mas fotogramas: es
que **el material sensible se pregunta, no se deduce**. Cuando un
archivo puede ser una cosa o su contraria, lo barato es preguntar.

Sacado de `public/` —la carpeta que se publica— a
`../_ARCHIVO/ninja-material-crudo/`, con su LEEME. No se borra: es
material suyo. Pero mientras estuviera ahi, un `git add -A` lo habria
subido a un repositorio PUBLICO, y un commit no se retira.

### La foto, y lo que cuesta un recorte

Recortada a Ninja solo, como pidio. De 1080x1920 se queda en 360x580,
porque el gato ocupa poca parte del encuadre: la galeria la enseña a 300
px de alto, asi que en un movil 3x se ESTIRA x1,55, mientras que las
otras dos se encogen (x0,47) y van sobradas. A ese tamaño apenas se
nota, y se dice aqui para que no sorprenda: si algun dia quiere esa
nitidez, la respuesta no es otro recorte, es una foto hecha mas cerca.

El pie, en las cinco lenguas desde el primer momento. Ya no hay otra
forma de ponerlo, que era el objetivo del arreglo del dia 13.

### El zZZ que parecia un fallo

Albert conto que un dia la barra HAPPY puso `zZZ` en vez de HAPPY. No es
un fallo: de noche la barra se congela, el rotulo cambia y la barra se
pone azulada, y la razon es buena —nadie tiene que levantarse a las tres
a cuidar al gato—.

Lo interesante es otra cosa. **El escribio esa regla, y aun asi al verla
en pantalla penso que algo se habia roto.** `SIMPLICIDAD.md` clasificaba
ese concepto entre los doce que «solo se aprenden por sorpresa», y ahora
tiene su prueba: si al autor le sorprende, a un usuario tambien. Queda
anotado ahi mismo, que es donde sirve.

### PromptPay: no existe un QR privado

Lo genera su chica, y pregunto si puede hacerse sin que salgan sus
datos. La respuesta, investigada: no. Cualquiera que vea el QR lo
decodifica —no hay cifrado, el QR ES ese numero— asi que lo unico que se
elige es QUE identificador se hace publico. Recomendado: un e-Wallet ID
abierto solo para esto, que no es su telefono ni su documento. Nunca el
DNI tailandes.

Dos avisos que van con ello: el NOMBRE del titular suele enseñarlo la
app del banco al escanear —lo pone el banco, no el QR— y eso hay que
preguntarselo al banco antes de generar nada; y Lightning, que ya esta
en esa pantalla, es seudonimo por diseño, asi que tener los dos y dejar
elegir es mejor respuesta que elegir uno.

Ofrecido y anotado en `TODO.md`: **que lo pase antes de subirlo y se
decodifica**, para saber que lleva dentro cuando todavia se puede
cambiar de idea.

### El anillo, concretado

Albert dijo como lo ve: el anillo abajo, subir fondo y michi para
hacerle sitio, y **las barras de arriba quietas**. No se ha tocado nada
—es composicion y se decide viendola—, pero se anota porque su idea
ataca sin querer el hallazgo 2 de `SIMPLICIDAD.md`: si el cuidado se
queda arriba y lo que haces baja al anillo, el aparato empieza a decir
CON EL SITIO lo que hoy no dice con nada.

### Y el mapa de simplicidad, en bullets

Lo pidio resumido y se le dio en la conversacion. No se copia aqui
porque ya esta entero en `SIMPLICIDAD.md`; lo que si merece quedar es el
titular, que es lo que contesta a la pregunta original: **el problema no
son los 42 conceptos, sino que unos se dicen cuatro veces y otros no se
dicen nunca.**

### Y por fin, su nombre

Albert pidio dos cosas al cerrar, y las dos son la misma: que se le
llame **Albert**, no «Alberto».

Guardado donde vale para todo, no solo para esta app: en
`~/.claude/CLAUDE.md`, que es la memoria general y la leen todos los
proyectos. Antes solo estaba en la memoria de MichiFit.

Y renombrado en el repositorio: **145 apariciones en 38 archivos** —los
documentos, los comentarios del codigo, las pruebas y hasta el LEEME de
`public/michi/`—. Se comprobo antes de tocar nada que NINGUNA era texto
que vea el usuario: las 145 eran comentarios y documentacion. La unica
que aparecia en `src/i18n/` estaba en la cabecera del archivo, no en una
traduccion. Pruebas en verde y build limpio despues.

Lo que NO se toca, y conviene que quede dicho: **el historial de git**.
Los mensajes de commit viejos siguen diciendo Alberto, y cambiarlos
obligaria a reescribir la historia de un repositorio publico, que es
mucho peor que la molestia que arregla. La historia es la historia; los
documentos son los que se leen.

### El anillo baja, y resulta que sobraba la mitad de la idea

Albert lo pidio con un montaje hecho a mano: los iconos abajo, siempre
visibles, y el fondo y el michi mas arriba. Era el item que llevaba dos
dias en `TODO.md` como idea suya del 14.

Es una BANDA, no la pastilla flotante de antes: ancho completo, apoyada
en el borde inferior, con el nombre arriba y los siete iconos abajo del
todo —ese orden lo pidio el, y se hace cambiando el ORDEN DEL DOM y no
con `order` de CSS, para que un lector de pantalla lea lo mismo que se
ve—. En reposo se ven los siete por igual, sin nadie señalado, como los
iconos serigrafiados de un tamagotchi de verdad.

`--anillo-alto` es su medida y vive en la pantalla, no en la banda: de
ahi beben tambien la escena (que ACABA donde empieza la banda, en vez de
ocupar la pantalla entera) y la zona del michi (que pasa a llevar
`bottom` en vez de `height`, para que se apoye encima sin repetir el
numero). Cambiar la altura de la banda mueve las tres cosas solo.

Lo que gana la app no es sitio, es que **la vista previa ya se ve**:
antes el anillo se pintaba encima del michi justo cuando la escena
queria enseñartelo haciendo la cosa. Comprobado con «Pasos»: el gato
anda por la calle y no lo tapa nada.

### El fallo que destapo, que es el de siempre

`rotulosDeBotones(Boolean(menu))` usaba «¿hay menu?» como sinonimo de
«¿esta abierto?». Valia porque hasta hoy el menu llegaba `null` estando
cerrado. Con la banda fija el menu existe SIEMPRE, asi que los tres
botones decian «Siguiente / Aceptar / Cerrar» en reposo —cuando dos de
ellos no hacen nada— y encima el `disabled` sale de ahi, o sea que se
podian pulsar.

Es el mismo patron que ya mordio con `estado` el 2026-09-12: **una
variable que vale como proxy de otra hasta que deja de valer**. No se
rompio nada al escribirla; se rompio al cambiar lo que la sostenia.

### Las cuatro barras

Albert vio que EN FORMA y HAPPY eran mas altas que WATER y CLEAN (7 px
contra 5, y la letra 6 contra 5) y pidio las cuatro iguales. Hecho.

La razon de que fueran distintas estaba escrita —son el anzuelo y no la
mecanica, y no debian pesar igual de un vistazo— pero en pantalla no se
leia como jerarquia, se leia como descuadre. Queda anotado en el CSS que
lo unico que las distingue ahora es el COLOR, y que eso no basta: es el
hallazgo 2 de `SIMPLICIDAD.md` y sigue abierto.

Tiene su ironia: igualar las barras empuja en contra de ese hallazgo, y
bajar el anillo empuja a favor —el cuidado se queda quieto arriba y lo
que haces baja a la banda—. La misma sesion movio la aguja en los dos
sentidos.

### Comprobado antes de subir

Que la banda y la escena miden LO MISMO abierta y cerrada (41 y 178 px):
la linea del nombre se pinta siempre, con un espacio duro en reposo,
para que la escena no de un salto al abrir el menu. Es el fallo de los
rotulos del 12, evitado a proposito esta vez.

### Y la sombra de un pixel

Los cuatro rotulos de las barras —BEBE, HAPPY, WATER, CLEAN— van sobre
el escenario y sin fondo, y sobre la calle, que es el mas cargado, se
leian justos. Pidio Albert la sombra de un pixel y se la puso.

No es una sombra difuminada: es un CONTORNO de un pixel en las cuatro
diagonales, sin desenfoque. Un `blur` sobre pixel art desentona
inmediatamente.

Y es la misma tecnica que ya usaba el rotulo de «que esta haciendo»
—«EN CASA», «PASEANDO»— solo que al reves: aquel es crema con contorno
oscuro porque cae en mitad de la escena; estos son oscuros con contorno
claro porque caen arriba, donde casi siempre hay pared o cielo. Dos
colores y un solo idioma, en vez de dos maneras distintas de resolver
lo mismo.

### Los michis nuevos, los fondos largos y el parque que anda

Albert dejo en `IMG/` tres model sheets —naranja, gris y blanco, diez
michis cada una sobre fondo blanco— y cuatro fondos apaisados. IMG/ no
esta en git a proposito: es material fuente y pesa. Lo que se versiona
es lo que sale.

Primero se le monto una HOJA DE CONTACTO NUMERADA, que era lo que habia
pedido: los treinta michis recortados, una columna por pose y una fila
por color, para poder decir «1 es neutro, 2 es andando» mirando una sola
imagen. Y de paso enseño dos cosas que no se veian en las hojas
sueltas: que estan alineadas al pixel (los recortes salen identicos en
las tres) salvo la POSE 5, que en naranja es un gato agobiado y en gris
y blanco es uno leyendo el periodico. Albert la descarto.

El recorte automatico tuvo dos problemas de verdad:

· DOS MICHIS PEGADOS. El vapor del que entrena roza las gotas del
  sediento, asi que salian como un solo blob y detectaba 9 en vez de 10.
  Se parten por la costura —la columna con menos tinta de la franja
  central—, que es lo que ya hacia `recortar_poses.py`.

· EL GATO BLANCO. `sin_blanco()` pone transparente todo pixel mas claro
  que un umbral, y con el blanco eso no puede funcionar: su barriga esta
  en (228, 226, 237) y el fondo en (255, 255, 255). Un umbral que se coma
  el fondo le abre un agujero en la tripa. Se quita por RELLENO DESDE LOS
  BORDES: solo desaparece el blanco que toca el borde de la hoja, y la
  barriga se salva porque el contorno oscuro no deja pasar el relleno.

Quedan `michi_triste` y `michi_cansado` del dibujo anterior, porque en
las hojas no vienen. Y se NOTA: al lado de los nuevos son mas oscuros y
tienen menos detalle —el gris triste es casi negro—. Anotado en `TODO.md`
como lo siguiente, que es una decision suya.

### El parque que no cerraba

Los fondos viejos son cuadrados de 716 y no dan paneo. El parque nuevo
mide 1952x544 y esta dibujado para desplazarse, pero no cerraba: 25 de
255 de diferencia entre sus bordes.

El primer intento fue FUNDIR el borde derecho contra el izquierdo, que es
lo que suele hacerse. Salio mal y de forma muy visible: en la franja del
fundido se transparentaban un pilar de ladrillo fantasma y dos farolas
superpuestas. El fundido vale para texturas sin formas reconocibles; aqui
hay objetos, y un objeto medio transparente canta mas que una costura.

Lo que funciono fue no tocar un solo pixel y buscar DONDE cortar: el
dibujo repite farolas y pilares, asi que hay dos columnas que ya casan
solas. Probando pares baja de 25 a 5,7 sobre 255, y la union es
invisible — el corte cae por la mitad de un pilar y el pilar se
reconstruye entero al repetirse.

### Y el paneo, que tambien fallaba a la primera

La animacion iba sobre `background-position-x` hasta -1817px, que son los
pixeles del ARCHIVO. Pero el fondo se escala al alto de la pantallita, y
con el zoom otra vez: su ancho pintado no es 1817 nunca. El paso no caia
en un numero entero de vueltas y daba un salto una vez por ciclo.

Se resolvio con `aspect-ratio: 3634/544` —la caja mide exactamente dos
dibujos— y `translateX(-50%)`, que es exactamente uno. Sin numeros que
cuadrar y sea cual sea el tamaño de la pantalla.

Es DECORATIVO por decision de Albert: corre siempre igual y no mide nada.
Se penso en moverlo segun los pasos del dia, pero eso seria un dato mas
que entender en la pantalla que ya tiene 29 de los 42.

### El mosaico del panel de pruebas

Tambien lo pidio: ver todas las variantes de golpe. El panel ya existia
—siete toques en el logo— pero enseñaba las poses de una en una, y
revisar 33 dibujos asi no es revisar, es acordarse.

Ahora tiene un boton «ver todos» con una fila por color y una columna por
pose. Y de paso se descubrio que a la lista le faltaban `asqueado` y
`sediento` desde siempre: justo las dos que mas cuesta provocar con datos
de verdad, o sea las dos que mas falta hacia poder mirar aqui.

### La historia deja de ser un apaño

Hasta hoy los seis actos se ilustraban con el michi gris de la app sobre
uno de los tres escenarios, porque el comic no existia. Ya existe: Albert
genero veinte viñetas y paso el guion entero de las veintidos.

Lo primero fue guardar el GUION, que solo estaba en un chat: `COMIC.md`
con la ficha de estilo, la de personajes —con los grises exactos de Ninja
sacados del archivo— y que pasa en cada plano y por que. `LORE.md` decia
«los prompts estan escritos» y no estaban en ningun sitio.

Montar esa tabla enseño dos cosas que no se ven mirando la carpeta: que
faltan TRES planos por generar —el saludo a distancia, dormirse con
hambre y llamar al veterinario— y cuales sobran.

DOCE Y NO VEINTIDOS. El criterio fue uno por LATIDO, sin dos seguidas
contando lo mismo: de las tres del hospital solo entra la de abrir los
ojos, que es la que el propio Albert señalo como la mejor de las
veintidos. Y entro el amanecer, que yo habia dejado fuera y el recupero
— tiene razon, es el respiro antes de lo peor y el contraste es
deliberado.

Y una buena noticia que deshizo un miedo: **las veinte tienen la MISMA
proporcion**, 9:16 exacto. Albert creia que no. Lo que cambia es la
resolucion (572x1024 y 768x1376), que no es un problema de encaje.

### El peso, y por que no se reescalan

1,29 MB las doce, desde 2,37. NO se reescalan —son ilustraciones de
pixel art y encogerlas las emborrona— solo se vuelven a comprimir. Las
grandes bajaron muchisimo (de 524 a 105 kB) porque venian guardadas a
calidad altisima.

### La pantalla

La viñeta pasa a comerse el alto entero y el texto se mete DENTRO, en una
banda que se funde con el dibujo por arriba en vez de cortarlo con una
linea recta: asi tapa lo menos posible y se lee sobre cualquier fondo.
Ocupa el 19% de la viñeta en un movil.

Costo dos intentos cuadrar el marco. Con `object-fit: contain` sobraban
62 px de barras oscuras arriba y abajo, y unas barras dentro de un marco
parecen un fallo de maquetacion. Se puso `aspect-ratio: 572/1024`... y la
caja se quedo en 190 px de ancho: en un flex en COLUMNA el ancho manda
por el `stretch` de serie, asi que `aspect-ratio` no tenia de donde
deducirlo. Con `align-self: center` el ancho deja de estirarse y sale del
alto, que es lo que se queria.

Y `calle.png` se queda sin usar: era el fondo de pasear —que se fue al
parque— y el de la historia —que ahora es el comic—. Anotado donde toca
en vez de borrarlo.

### Albert lee el comic, y lo mejora

Lo leyo montado y lo devolvio con tres cambios, los tres buenos:

· EL TEXTO ARRIBA. Casi toda la accion de estas viñetas pasa en la
  mitad de abajo —el gato, el bol, la basura, la carrera— y la banda de
  abajo competia con el dibujo por la misma zona. Arriba hay cielo,
  pared o cables. Es el tipo de cosa que no se ve hasta tener las doce
  seguidas delante.

· CATORCE VIÑETAS, y dos de ellas SIN TEXTO: la del veterinario y la de
  Ninja recuperado. Son de accion y se explican solas. Se resolvio con
  el texto vacio en el diccionario y no con una lista de numeros aparte,
  para que ponerles o quitarles texto sea editar el idioma y nada mas.

· LOS TEXTOS, suyos, con nombre: la enfermera es ANNA. Pidio que los
  mejorara si veia donde, y se tocaron poco y con un criterio —acortar
  lo que el dibujo ya cuenta—. El unico cambio de fondo se le dejo
  anotado para que lo decida: en la 10 habia escrito «convulsionando»,
  y la regla del comic es que del envenenamiento no se enseña nada
  explicito, tampoco con palabras.

Y un susto de medida que merece nota: a media comprobacion la viñeta
dio 6x6 px. Era el panel del navegador OCULTO —la ventana media 0x0—, no
un fallo. Se repitio a 375x812 y las catorce miden 347x642. Antes de
creerse una medida rara, mirar el tamaño de la ventana.

### Segunda vuelta al comic, el collage y el gracias

Albert releyo las catorce y afino el copy. Lo que merece quedar:

· LA 11 Y LA 13 SI NECESITABAN TEXTO. Habian salido mudas por ser de
  accion, y al leerlas seguidas se vio que no: la 11 es una viñeta
  partida y sin texto no se sabia cuanto tiempo pasaba en el hospital;
  la 13 es el cierre feliz y pedia decirse. Nadie lo habria visto sin
  leer el comic entero de un tiron.

· LA 13 CIERRA UN ARCO QUE ABRE LA 2. Albert pidio ayuda con ese copy
  «para potenciar el cierre positivo». La 2 dice «Ninja nunca se
  acercaba a ningun humano», asi que la 13 lo repite al reves: «aquel
  gato que nunca se acercaba a ningun humano ahora se deja mimar». Se
  eligio «mimar» y no «querer» porque la 14 ya dice «una familia que lo
  quiere», y dos seguidas con la misma palabra se pisan.

· EL CARRUSEL FALLABA AL DESLIZAR DE DERECHA A IZQUIERDA, y no por el
  carrusel: la pantalla de la historia escucha el mismo gesto para pasar
  de pagina, y al arrastrar una foto lo cogian los dos. Albert propuso
  un collage —una sola imagen con las fotos colocadas sin taparle la
  cara al gato— y lo hizo el. Mide 9:16, como las viñetas, asi que se
  monta igual que ellas. No hay gesto que disputarse.

· KARMA: Ninja con las patitas juntas y un bocadillo que dice «Khob Khun
  Krup», gracias en tailandes, en lugar del michi con traje de oficina.
  Es el gato de verdad, y es la pantalla donde toca dar las gracias.
  `michi_love.png` se borra: ya no lo usa nadie.

Las imagenes nuevas llevan nombre nuevo, asi que la cache no hace falta
subirla.

### Ultima tanda del dia

- **Sin guiones largos** en los textos de la app. Albert pidio quitar el
  de la ultima pantalla y dijo que no le gustan; habia tres mas y se
  quitaron tambien, en las cinco lenguas. Guardado en memoria como
  preferencia. Al hacerlo se piso la ayuda de otra pantalla y se
  deshizo: ver `LESSONS.md`. De paso aparecio una errata en chino
  («擑不住» por «撑不住»).
- **La cocina, 230 px a la izquierda.** El michi se apoya en el centro
  de abajo, y ahi estaba la isla: parecia comer encima de la mesa. Se
  probaron 230, 300 y 370 simulando al michi a su tamaño real; con 230
  pisa el suelo y la cocina se sigue leyendo. Cache a v10.
- **El mensaje de «es analogico»**, en el flujo de la cabecera y a 2 px
  de «EN CASA». Colgado desde abajo crecia hacia arriba y se comia CLEAN.
- **Los iconos del anillo a 16 px**, que divide exacto los 96 del
  archivo y es la rejilla en la que Albert dibujo `limpiar` y `comida`.
  La banda pasa de 34 a 38 px. Los siete caben sin solaparse.

### Cierre del 16

Un dia largo y casi entero de parte visual: el anillo en una banda fija
abajo, 27 michis nuevos de las model sheets, el parque en bucle, la
cocina, el comic de 14 viñetas con los textos de Albert, el collage de
fotos y Ninja dando las gracias en Karma. Todo desplegado y comprobado
en el navegador. Lo pendiente queda en `CURRENT.md`.

## 2026-09-18/19 — Triste y cansado, el michi negro, y la conversacion
de simplificar entera

Sesion larga, en dos mitades: primero cerrar las model sheets con los
40 michis, despues la conversacion de simplificar que Albert llevaba
pidiendo desde el 14.

**Las model sheets, hasta que dejaron de hacer falta.** Albert redibujo
`triste` y `cansado` iguales en las cuatro hojas (antes esa casilla no
coincidia entre colores y se descartaba) y añadio una hoja `negro`
entera. `pixel/recortar_model_sheets.py` paso de detectar blobs a una
rejilla fija de 5x2 -los dibujos mas juntos rompian el hueco que usaba
para partir la hoja-, con tres pasadas de limpieza que salieron una a
una al mirar el resultado ampliado: `agujeros_sueltos()` para un
bolsillo de blanco encerrado en la cola del michi negro andando,
`deshalar()` para un flequillo casi blanco pegado al contorno en las
nueve poses del negro (antialias de JPEG que cae justo por debajo del
umbral de fondo), y `limpiar_gotas_entrenando()` para unas gotas de
`cansado` que se colaban en la celda de al lado. Cada una es una
leccion escrita en `LESSONS.md` o en la cabecera del propio script.

De paso: el michi salta (`michi_celebrando`) al mimar, dar agua,
limpiar o apuntar un dato sin escena propia; asqueado con una sola
caca gana a `contento` (antes cumplir tapaba la caca, a proposito,
pero Albert vio una cara sonriente junto a una caca dibujada y no
colaba); y «¡GENIAL!» sustituye a «¡NIVEL!» en ese brinco, que
mentia -no habia subido de nivel-.

**Entonces Albert dijo que prefiria dibujarlos el.** Exporto a mano
las 40 poses/colores, mismo lienzo, mejor calidad que el script -sin
JPEG ni cuantizacion-, sin ninguno de los flequillos que el script iba
persiguiendo. `recortar_model_sheets.py` deja de correr sobre
`public/michi/`: los dibujos son suyos ahora. Probamos tambien separar
y montar una animacion de andar con un sheet generado por IA
(`IMG/animaciones/`); los frames no eran consistentes entre si -sin el
control de un dibujo a mano, tipico de generarlos por separado con
IA- y Albert la descarto sin darle mas vueltas. Carpeta borrada.

**La conversacion de simplificar, con datos y no solo con opinion.**
Albert dio una prioridad expresa: 1) habitos (entreno, pasos, comida
con macros, peso, sueño el ultimo) 2) la grafica de cuanto falta para
la meta 3) la historia de Ninja, escondida en Ajustes 4) el menu de
abajo. Cuatro cosas, cuatro sesiones cortas:

- **La grafica «no acababa de funcionar»** porque cuantas semanas
  faltaban para la meta no se veia en NINGUN sitio como numero -solo
  en la posicion del trofeo, que ademas desaparece si la meta cae
  fuera del tramo visible-. Un comentario del codigo decia que "la
  fecha ya esta escrita en la tarjeta de arriba" desde el 12 de
  septiembre: mentira desde el dia en que se escribio, comprobado con
  `git show`. Bloque nuevo arriba del todo con semanas, meses y fecha.
- **El menu de abajo**: Logros deja de ser pantalla y pasa a ser una
  seccion dentro de Progreso; el hueco lo ocupa un boton a Ninja que
  abre `Lore.jsx` directamente. Karma se queda donde estaba -Albert lo
  pidio expresamente, aunque se habia propuesto moverlo-.
- **Los habitos**: el Marcador de Inicio -el que se mira cada dia- no
  tenia fila de ENTRENO, el habito que Albert puso primero. Añadida,
  primera del todo, con «REST» en vez de un 0% en los dias de
  descanso. El editor del dia completo empezaba por PESO -el que menos
  pesa de los cuatro-; reordenado a entreno, pasos, comida, peso,
  sueño. El anillo del aparato tenia pasos antes que entreno sin mas
  razon que el orden en que se escribio; intercambiados.
- **El tono del calendario**: cualquier dia sin datos se pintaba de
  rojo solido, contradiciendo la propia `MECANICA.md` ("el michi nunca
  reprocha"). Ahora un dia sin cumplir se ve neutro; solo cumplido
  (verde) y a medias (amarillo) llaman la atencion. De paso, los dias
  de antes de que el pacto existiera dejaron de evaluarse -antes un
  mes entero podia salir en rojo por dias de antes de adoptar al
  michi-, y broto un swatch de leyenda (parcial) que llevaba invisible
  sin regla de CSS.

**Ultimos retoques, pidiendolos al probarla:** el icono de Ninja un
poco mas grande, «REST» en vez de «DESCANSO» porque no cabia en la
columna del marcador, y comiendo/dormido un poco recolocados con
`translate` -no `transform`, que ya lo usan las animaciones de
respirar y dormitar y lo habria pisado- sin tocar ningun PNG.

### Cierre del 18/19

Con esto los cuatro puntos de simplificar que dio Albert quedan
tocados, los 40 michis son dibujo suyo y no del script, y la
`recortar_model_sheets.py` pasa a ser una herramienta en pausa, no
muerta -documentado por que en su propia cabecera-. Todo comprobado
en el navegador, tests y build en verde en cada tanda. **Albert dijo
que la proxima sesion se remata la app para abrirla al publico** y
empezar a recibir feedback real: primera vez que se pone fecha a eso.
Lo pendiente, en `CURRENT.md`.

## 2026-09-18 (noche) — Puesta al día entre móvil y portátil, y el orden de los cuidados
Albert trabajó desde el móvil y el portátil y quiso comprobar que todo
cuadraba antes de archivar la sesión «Workout completion tracking».

**Revisión.** Portátil tres commits por detrás de `origin/main`
(`git pull --ff-only`, sin conflictos). La rama
`claude/workout-yesno-completion` tenía el mismo código que `main` (PR #1
ya fusionado). Producción en Vercel `Ready` y con el último commit; el
MCP de Vercel da 403 y se comprobó con la CLI. Faltaban dos cosas: la
etiqueta `v0.7.3` (creada y subida) y un test en rojo,
`cobertura-michi`, causado por el propio cambio del móvil.

**Cambio.** El michi de pie vuelve a salir y los cuidados tienen orden:
caca → asqueado → (limpia) brinco → sed al 75% → sediento → (agua)
brinco → de pie. `contento` pasa a pedir `forma` 90. Invierte la regla
«cumplir manda sobre tener sed». Detalle en `DECISIONS.md` y
`CURRENT.md`.

**Cierre.** Borrada la rama `claude/workout-yesno-completion` (sobraba,
mismo código que `main`), versión **v0.7.4** con etiqueta, y todo
comprobado de nuevo: tests, build, GitHub y Vercel. Comprobado también
que la sesión del móvil no dejó nada en `0000_SYNASTRY.SITE`. Lo que
queda por hacer sigue en `CURRENT.md`: abrir la app al público, y que
Albert confirme el 90 de `FORMA_CONTENTO`.

## 2026-09-19 (tanda final) — El ritmo de los cuidados, una viñeta nueva y el lanzamiento
Albert va a pasar la app a amigos y familia con un enlace, y repasó el
estado del proyecto. Lo que salió, por partes.

**Decisiones de Albert («por ahora no»).** Sin cámara de calorías, sin
notificaciones push, sin usuarios ni servidor (la app sigue estática:
cualquiera con el enlace la usa), sin más fotos de Ninja, el icono `pasos`
se queda como está y no hay add-ons cosméticos. El QR de PromptPay queda
para más adelante: se lanza con Buy Me a Coffee y Wallet of Satoshi. Su
chica no le ha pasado el QR y crear uno de turista en TAG THAI Easy Pay no
daba tiempo hoy. A media sesión apareció un `public/karma/QR.jpeg` sin
seguir en git: un QR de Thai QR Payment (Bangkok Bank) con nombre completo
y número de identidad nacional de una persona. Se sacó a
`../_ARCHIVO/qr-promptpay-sin-publicar/` por precaución (el repo es
público) y no se decodificó. Albert aclaró después que es el de su pareja
y que ella lo quiere para donativos, así que se montó: `ACTIVO = true`, el
**primer** bloque de Karma, con un recorte a logo + código
(`public/karma/promptpay_qr.png`). Queda por confirmar con ella, antes del
push, que sabe que el código lleva dentro su número de identidad.

**Karma tras el cómic.** Al terminar la historia, «Cerrar» y «Saltar»
llevan a Karma (`onKarma` en `Lore.jsx`, `App.jsx`). Solo si se revisa la
historia ya empezada y se llegó a la última pantalla; en el primer
arranque el final sigue llevando a la bienvenida. Comprobado en el
navegador: saltar a medias vuelve a donde estabas, y cerrar o saltar al
final aterrizan en Karma. Como se llega a Karma sin haber usado el menú
de abajo, se añadió un botón **«Salir»** (`karma.salir`: Salir, Exit, ออก,
退出, 閉じる), arriba junto al título y abajo del todo, que vuelve a Inicio.

**El ritmo de las barras (lo que pidió que se hiciera).** Se midió con el
motor real en vez de a ojo, y salió un fallo de fondo: con `Math.ceil` la
primera caca aparecía a los 5 minutos de limpiar, y como la caca manda
sobre la cara del michi (asqueado en cuanto hay una, desde el 16-09),
este estaba asqueado prácticamente siempre. El de pie y el sentado solo
se veían esos primeros minutos. Con `floor` la primera caca sale al
gastarse el 20% de la barra (2,8 h despierto con `ORDEN_HORAS` 14), casi a
la vez que la sed (2,5 h con `AGUA_HORAS` 10 y `SED_DESDE` 75). Limpiar
y dar agua deja ahora unas 2,5 horas de michi tranquilo. Los números de
Albert no se tocaron; lo que se cambió es una regla de redondeo. Prueba
nueva en `pruebas/cuidados.mjs`, atada a las constantes.

**Otros cambios.** `FORMA_CONTENTO` de 90 a 95. Gimnasio nuevo en uso
(`public/fondos/gimnasio.png`; el viejo a `_CUARENTENA/fondos-antiguos/`)
y `calle.png` borrada. El michi comiendo, del 3% al 8% de `translate`: sus
pies estaban a y=302 del PNG y los del sentado a y=342, en los cuatro
colores por igual. Y «Hasta la meta» con objetivo de ganar peso: era
`Math.max(0, restante)` y `restante` nace negativo al querer ganar; ahora
valor absoluto y 0 solo si ya se llegó. Verificado en el navegador
(8,0 kg con 60 kg de peso y meta de 68).

**Viñeta nueva del cómic (13 de 15).** «Anna lo cura en casa»: faltaba la
etapa en que Anna, sin los 5.000 THB que pedía el veterinario, se llevó a
Ninja a casa y lo curó ella. Va entre «La recuperación» y «Ninja feliz».
Imagen reducida de 768x1376 a 572x1024 como las demás; textos en los
cinco idiomas.

**Documentos.** `CURRENT.md` pasó de 1.187 líneas a una sola pantalla de
estado; lo demás está abajo, en el archivo. Se cerraron las preguntas de
`ASK.md` y se pusieron al día `ROADMAP.md`, `TODO.md`, `COMIC.md`,
`DECISIONS.md`, `MECANICA.md` y `LESSONS.md`.

**Segunda parte de la tarde.** Albert confirmó lo del QR (su pareja lo
sabe y está conforme, y le parece bien el recorte) y renombró él mismo el
sediento negro. Borró los cuatro `michi_cansado*.png` («ese michi no se
usa»), y como `cansado` era también una cara del motor se retiró de
`estadoVisual`, de la prueba de cobertura y del panel de pruebas. Y pidió
hacer los puntos 2 a 5 de `SIMPLICIDAD.md`: HAPPY, WATER y CLEAN a cinco
puntitos; la ventana de 3 días y la regla real de la comida (con
`diasParaCerrar` y `rangoComida`, probadas contra `evaluarDia`) en el
editor y en «Mi objetivo»; y la nota del escudo más un cuarto párrafo en el
«?» de Inicio. Al ir a hacer la leyenda del corazón partido salió que el
aviso «el michi te cubrió un día» ya existía, así que se quitó una nota
duplicada (ver `LESSONS.md`). Se subió como **v0.7.5**.

**Cambios de la pareja de Albert, media hora después de lanzar.** Quiso
otro texto para la viñeta 13, escrito por ella en tailandés (5.000 baht
**al día**, y que Anna, con lo que sabe de enfermería, compró material y
suero), y otra foto en el collage. Albert tradujo el texto al castellano y
se sacaron el inglés, el chino y el japonés. En el tailandés se quitó una
«นะ» suelta. El collage nuevo pesaba 940 KB y se recomprimió a 240 KB (el
original, en `IMG/`); como conserva el nombre, caché a v17. Se subió como
**v0.7.6**.

**Un despiste que se aclaró.** Albert dijo que `michi_sediento-negro` ya
estaba en `public/michi/`, pero no estaba: lo único nuevo era
`michi_cansado-negro.png`, que es el mismo dibujo de la botella. Lo
renombró él después y quedó bien.

## 2026-09-22 — El michi que no despertaba, y una copia de seguridad de verdad
Dos horas después de que amigos y familia empezaran a usar la
`v0.7.6`, Albert trajo dos avisos: «no se queda guardado el progreso en
el móvil» y «el michi está durmiendo y no interactúa». Los dos
resueltos hoy, subidos como **v0.7.7**.

**El michi dormido, diagnosticado antes de tocar nada.** Se reprodujo
primero: un perfil de prueba sin datos en los últimos 3 días dejaba la
pantalla apagada y los tres botones sin efecto —cada toque solo
«despertaba» la pantalla un instante, sin llegar a abrir el anillo—.
La causa estaba en `calcularEstado()` (`engine/michi.js`): un campo
`dormido: abandono >= 2 días` que existe desde el PRIMER commit del
proyecto (2026-09-08), cuando solo elegía un dibujo en el sistema
antiguo de siluetas y no tenía ninguna consecuencia. El 2026-09-11, al
convertir los tres botones en la interfaz de verdad, `Inicio.jsx`
reusó ese mismo campo para bloquear los botones — y nadie revisó
entonces si dos días sin apuntar seguía siendo un umbral razonable
para algo tan serio como apagar toda la interacción. El resultado: el
aparato se quedaba mudo para siempre, porque `abandono` no cambia por
tocar botones, solo por apuntar datos, así que en cada render volvía a
estar «dormido». Iba contra la promesa más repetida del proyecto
(`MECANICA.md` §10, «no castiga por no abrir la app»), y nadie lo vio
en catorce días porque nadie había probado la app así.

Arreglado quitando el campo del todo: dormir es ahora SOLO la acción
explícita de pulsar «sueño» en el anillo. Verificado con el mismo
perfil de prueba (los botones ya abren el anillo) y comprobando que
dormir a propósito sigue funcionando igual. Prueba de regresión nueva
en `pruebas/cobertura-michi.mjs`, que fija que `calcularEstado` no
vuelva a devolver ese campo.

**La copia de seguridad que faltaba de verdad.** El CSV que ya había en
Ajustes solo exporta los días apuntados: sirve para una hoja de
cálculo, pero restaurarlo no devuelve el perfil, el objetivo ni el
color del michi. Y el aviso de «no se puede guardar» (`avisos.noGuarda`)
solo salta cuando `guardar()` FALLA en el momento de escribir — no
cubre el caso real más probable en el móvil: el sistema limpia
`localStorage` sin avisar entre una sesión y la siguiente (falta de
espacio, "borrar datos de navegación", o Safari limpiando sitios que
llevan días sin abrirse), y eso no deja ningún error que la app pueda
capturar.

Dos piezas nuevas, ninguna toca cómo se guarda de normal:
`navigator.storage.persist()` al arrancar (un ruego silencioso al
navegador, best-effort, sin UI) y la copia de seguridad completa en
Ajustes (`aJSON`/`leerBackup` en `datos/almacen.js`): exporta e importa
TODO el estado —perfil, objetivo, cada día, el michi—, no solo las
entradas. Restaurar sustituye, no fusiona (fusionar dos perfiles no
tiene sentido), y ofrece descargar antes lo que ya había, igual que
`BorrarTodo`. El archivo nunca se acepta a ciegas: pasa por
`estructuraCompleta`, la misma limpieza de siempre. Probado en el
navegador con un backup sintético (restaurar sustituye perfil, objetivo
y entradas correctamente) y con un archivo basura (error claro, sin
romper nada), y con `pruebas/backup.mjs` (ida y vuelta exacto, rechazo
de lo que no es una copia, limpieza de campos raros).

**Lo que se decidió NO hacer:** auto-actualizar el archivo solo, sin
que el usuario lo pida cada vez (que era la idea original de Albert,
inspirada en Michi Finanzas). Necesitaría la File System Access API,
que Safari en iPhone no soporta — la mitad de los casos se quedarían
sin la mejora real. Queda anotado en `TODO.md` para revisarlo si algún
día cambia el soporte de navegadores.

Documentos al día: `DECISIONS.md`, `LESSONS.md` (el campo que cambió de
trabajo sin que nadie lo revisara), `MECANICA.md` §10 y `CURRENT.md`.
Los 7 `pruebas/*.mjs` (backup.mjs es nuevo) y el build en verde.

## 2026-09-22 (tarde) — El icono de guardar, también en Inicio
Minutos después de subir la v0.7.7, Albert la probó y pidió: «¿podríamos
poner el icono de salvar el archivo visible, para que así el usuario
clique en salvar el progreso diario?».

Se midió antes de decidir dónde: la cabecera, el sitio más obvio, ya va
justa a 320px de ancho (comprobado con el navegador redimensionado a
ese tamaño) — el lema envuelve a dos líneas y un cuarto botón redondo
la habría desbordado en el móvil más pequeño en uso. En vez de eso, el
icono 💾 entró en `.mf-inicio-barra`, la fila de botones pequeños que ya
tenía el zoom y el «?» encima de la escena: lo primero que se ve al
abrir Inicio, sin tocar la cabecera.

Es un atajo, no un mecanismo nuevo: usa el mismo `aJSON`/`descargar` que
ya movía el botón de Ajustes. `hoyISOLocal()` se sacó de `Ajustes.jsx` a
`datos/almacen.js` para poder compartirlo. Al tocarlo, el icono se
convierte en ✅ durante dos segundos —mismo patrón que «Copiar LNURL»
en Karma— porque una descarga no siempre se nota en el móvil.

Verificado en el navegador: a 320px de ancho el icono nuevo cabe sin
apretar nada; el ciclo 💾 → ✅ → 💾 descarga el JSON correcto
(`app: "MichiFit"`, con las entradas de verdad); Ajustes sigue
funcionando igual; y sin errores de consola en una pestaña nueva (los
que salieron durante la propia edición en vivo eran del hot-reload de
Vite, no del código final). Subido como **v0.7.8**.

## 2026-09-22 (tarde, tercer aviso) — El brinco de celebrar ya no teletransporta al michi
El mismo día, un tercer aviso de Albert desde el móvil: mimando al michi
mientras paseaba en el parque, el fondo saltaba a «casa» un instante y
volvía solo. Se diagnosticó leyendo `escenaAutomatica()` directamente,
sin necesidad de reproducirlo primero: la rama de `accion === 'celebrando'`
devolvía siempre `{...porId('casa'), pose:'celebrando'}`, ignorando la
escena que hubiera antes. Esa regla nació el 2026-09-09 para subir de
nivel (un evento raro, donde «volver a casa a celebrar» pasaba
desapercibido) y el 2026-09-17 se reusó sin revisar para el brinco corto
de mimar/agua/limpiar/registrar, que pasa muchas veces al día — ahí sí
se nota.

Arreglo: calcular primero la escena base (humor, o lo hecho hoy, o casa
— el mismo orden de siempre) y saltar la pose `celebrando` ENCIMA de esa
base, sin tocar su escenario. Mismo mecanismo para el brinco corto y
para subir de nivel. Prueba nueva en `pruebas/cobertura-michi.mjs`:
para pasear/entrenar/nada/humor, `celebrando` mantiene el escenario de
la base y solo cambia la pose — las cuatro en verde.

Se intentó también confirmar por captura de pantalla en el navegador
automatizado (con un perfil de prueba paseando en el parque, mimar y
mirar el fondo durante el brinco), pero los clics remotos tardan más
que los 2,6 s que dura la animación y nunca se pudo capturar el
fotograma exacto — lo que sí se confirmó varias veces es que el fondo
NUNCA llegó a mostrar «casa» en ninguna de las lecturas, ni una vez, en
más de 60 muestras repartidas en varios intentos. La prueba que de
verdad demuestra el arreglo es la de `pruebas/cobertura-michi.mjs`,
directa sobre la función, sin depender de temporizadores de UI.

**Mismo día, tres avisos, tres arreglos, todos subidos en horas**: el
michi dormido para siempre (v0.7.7), el icono de guardar en Inicio y
este brinco (v0.7.8). Los tres eran del mismo tipo — comportamiento
que llevaba semanas o meses así, sin que nadie lo hubiera probado en un
uso real y continuado hasta que amigos y familia empezaron a usar la
app. Ver `LESSONS.md` si conviene anotar el patrón.

## 2026-09-23 — El bug de las 14,3 semanas, cuatro gráficas nuevas, y el vídeo de Ninja
Albert probó la v0.7.8 unos días y trajo tres cosas: un vídeo de
Instagram por estructurar, un bug («me dice 14,3 semanas para la meta,
obviamente está mal») y un encargo (gráficas de 7 días en Progreso).

**`MARKETING.md`**, nuevo: guion de un Reel de ~55 s contando la
historia real de Ninja y cerrando con la app, más el copy del post y
los hashtags. Todo con material que ya existe en el repo (viñetas del
cómic, fotos reales), nada que generar.

**El bug, diagnosticado antes de tocar código.** Se reprodujo con datos
sintéticos (45 días de meseta, tipo CSV importado, más 15 días bajando
de verdad) antes de mirar el arreglo: `ritmoReal()` regresaba sobre
TODO el historial de pesajes, sin ventana, así que un historial largo
diluía las últimas semanas buenas. El repro dio ~22 semanas mirando
todo el historial contra 8-10 mirando solo 30 días — el mismo orden
que Albert vio. Se movió `ritmoReal()` de `Progreso.jsx` (donde no la
cubría ningún test) a `engine/calculos.js`, con ventana de 30 días
(`DIAS_RITMO_PESO`, constante nueva) y prueba dedicada,
`pruebas/progreso.mjs`. Verificado también en la app real con el mismo
escenario sintético: la cifra bajó de lo que habrían sido ~22 semanas a
10.

**Las cuatro gráficas de 7 días**, en la misma tanda: entreno, pasos,
comida y sueño, sin macros. Reusan `evaluarDia()` —la del
calendario— para que «cumplido» no se reinvente aquí; el sueño se
calcula aparte porque no vive en el pacto. Mismo lenguaje de color que
el calendario (verde/ámbar/gris neutro, nunca rojo), y el día de
descanso sale como un puntito en vez de una barra a cero. `SUENO_IDEAL`
se sacó de `Marcador.jsx` a `constantes.js` para compartirla.

Verificado en el navegador con un perfil sintético completo (mezcla
deliberada de días cumplidos, a medias, sin datos y de descanso roto):
las cuatro gráficas coincidieron exactamente con lo esperado, campo a
campo, comparando los datos reales de React con lo que debían decir —
no a ojo en una captura, que en un primer vistazo llevó a una lectura
equivocada de una de las columnas. También probado con un usuario sin
ningún dato: no rompe nada, todo sale neutro. Subido como **v0.7.9**.

---

## Archivo de CURRENT.md · movido el 2026-09-19

`CURRENT.md` llegó a las 1.187 líneas y ya no se podía leer entero. Lo que
sigue es su contenido **tal cual estaba**, en dos bloques, sin corregir
nada (algunas cosas de aquí ya no son ciertas: son historia). Los títulos
bajan dos niveles para no mezclarse con los de este diario.

### A. Estado y bitácora «Última acción», 7 al 19 de septiembre

#### En qué estoy trabajando
Acaba de arrancar la app definitiva. Funciona de punta a punta con cuatro
pantallas y el motor entero.

#### Estado
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
- Última acción (2026-09-18/19, pedida desde el móvil, sesión aparte):
  **entreno y sueño cumplen por apuntar, no por llegar al número**. Albert
  vio en su móvil que le faltaba un pelo para el mínimo de entreno del día
  (38 de 45 min) y el michi lo contaba como día fallado igual que si no
  hubiera entrenado nada — le pareció injusto y pidió pasar Entreno a
  sí/no. De paso pidió lo mismo para Sueño: que apuntar algo YA cuente
  como hecho, y que la cantidad de horas sea solo consejo aparte ("lo
  ideal son 8h", "intenta dormir un poco más"), no la casilla.

  `evaluarDia()` en `engine/pacto.js`: el objetivo `entreno` pasa de
  `cumplido: min >= objetivoDia.minEntreno` a `cumplido: min > 0`. Los
  minutos siguen en `valor` y siguen moviendo la barra del Marcador y la
  gráfica de Progreso — solo dejan de decidir si el día rompe la racha.
  `consejoSueno()` en `pantallas/Inicio.jsx`: las cuatro franjas (poco /
  casi / perfecto / de más) pasan todas a `ok: true`; solo `horas == null`
  (nada apuntado) sigue dando `ok: false`. El texto de consejo por franja
  no cambió, solo dejó de decidir la casilla.

  Hecho **sin abrir MECANICA.md entero primero**, que es justo lo que
  pide `PROTOCOL.md` antes de tocar la mecánica — un pacto que se
  incumplió solo, por hacerlo desde el móvil en una sesión sin el
  repositorio delante. Auditado después, desde el portátil: la mecánica
  de §3 y §11 sí queda coherente con lo pedido — "un entreno perdido"
  (0 min, ver §11) sigue rompiendo el día igual que siempre, pasos y
  comida siguen midiéndose por cantidad, y la única excepción nueva es
  entreno/sueño con **algo** apuntado. `MECANICA.md` §3 ya lo deja
  escrito. PR #1, revisado y fusionado a `main` con los cuatro
  `pruebas/*.mjs` relevantes en verde (`cuidados`, `objetivo`,
  `calendario`, `cobertura-michi`; el único fallo es el de siempre, el
  dibujo `michi` sin usar, sin relación).
- Última acción (2026-09-18, desde el portátil, tras la sesión del móvil):
  **el orden de los cuidados y el michi de pie**. Albert lo dictó: caca →
  asqueado; si la recoge, brinco; si falta un poco de agua → sediento
  (ahora al **75%**, antes 50); si se la da, brinco y de pie. Y que el
  michi de pie salga MÁS que el sentado.

  Salió de un test en rojo. La sesión del móvil que pasó entreno y sueño
  a «cumplen por apuntar» dejó escrito que `cobertura-michi` fallaba
  «como siempre, sin relación». **No era verdad**: en `f4669a9` pasaba
  con los 11 dibujos, y el cambio subió a casi todos por encima de
  `forma` 70, así que `contento` se tragaba el michi de pie (`humor`
  nulo). Ver `LESSONS.md`.

  Tres cambios: `SED_DESDE` 50 → 75 (`cuidados.js`); `FORMA_CONTENTO` = 90
  nueva en `constantes.js`, en vez del 70 escrito a mano; y en
  `estadoVisual` la sed pasa POR DELANTE de `contento`, lo que **invierte
  la regla del 2026-09-11 «cumplir manda sobre tener sed»**. Consecuencia
  a tener presente: `contento` (el sentado) solo se ve con el cuenco
  lleno, la casa limpia y constancia casi perfecta.

  `pruebas/cobertura-michi.mjs` cambia: el perfil «medio gas, hoy nada»
  vuelve a caer en el de pie, comprueba el orden entero (caca, sed, de
  pie, contento) y barre `forma` 0-100 exigiendo que de pie ocupe más que
  contento (hoy 60 contra 11). `pruebas/cuidados.mjs` mide el borde
  exacto del 75%. Los seis en verde y build limpio. Probado en el
  navegador: con caca y sed sale asqueado; al limpiar, celebrando 2,6 s y
  luego sediento; al dar agua, celebrando y luego el michi de pie
  (`michi.png`), sin errores en consola. Sin PNG nuevos, la caché sigue en
  v15.

  **Confirmado por Albert (2026-09-18):** el brinco tras dar agua SE
  QUEDA (el de siempre, pedido el 2026-09-17); el de pie llega después.
  **Sigue abierto:** el 90 de `FORMA_CONTENTO` es una estimación —cabe
  subirlo o bajarlo en `constantes.js`—. Albert vio el michi SENTADO con
  todas las barras a tope: es lo esperado, no un fallo. Sentado
  (`contento`) pide dos cosas a la vez, cuenco por encima del 75% y casa
  limpia **y** `forma` ≥ 90; quien cumple casi perfecto y tiene los
  cuidados al día lo ve, y el de pie queda para el resto. Si Albert
  prefiere ver de pie también en ese caso, las opciones son subir el
  umbral a 100 o dejar `contento` solo como reacción del momento.
- Última acción (2026-09-18, cierre de sesión): **todo al día y
  verificado**. Portátil y GitHub en el mismo commit; la rama de la
  sesión del móvil (`claude/workout-yesno-completion`) borrada, porque su
  código ya estaba en `main` (comprobado antes con `git diff`); versión
  subida a **v0.7.4** (`package.json`, `package-lock.json`, `VERSION.md`)
  con su etiqueta; caché sin tocar (v15) porque no cambió ninguna imagen.
  Seis `pruebas/*.mjs` y build en verde, y producción sirviendo el mismo
  paquete que sale del build local.

  **Cómo se lió el día, por si vuelve a pasar:** se trabajó desde el móvil
  y desde el portátil a la vez, y la sesión del móvil fusionó el PR #1 a
  `main` sin que el portátil lo supiera. El portátil se quedó tres commits
  atrás, y encima el test en rojo de esa sesión se dio por «de siempre».
  Nada se perdió. Lo que lo destapó fue mirar **primero** `git fetch` y
  `VERSION.md`, tal como pide la cabecera de este documento. También se
  comprobó que la sesión del móvil **no dejó nada** en el otro proyecto
  (`0000_SYNASTRY.SITE`): no hay ficheros de MichiFit ni cambios de estos
  días; solo un `launch.json` sin subir del 6 de septiembre, ajeno a esto.
- Próximo paso:
  · **abrir la app al público** — lo próximo que dijo Albert, sin fecha
    exacta pero "mañana" a fecha de este cierre;
  · **`VERSION.md` está al día** (v0.7.4, caché `michifit-v15`), con la
    etiqueta `v0.7.4` subida;
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

#### Verificado en navegador
- Simulador da los mismos números que la app original: 2602 de gasto total,
  −595 de déficit, 377 quemado moviéndote, −0,54 kg/semana.
- Ajustes da el mismo IMC: 26,2 actual, 21,5 meta.
- Pantalla de pacto muestra el pacto real de Albert.
- Build de producción OK, sin errores de consola.

#### Despliegue
- **Versión estándar: `v0.7.4`** (2026-09-18). Ver `VERSION.md`. Se ve en Ajustes, última línea. Qué es
  y cómo retomarla desde el móvil o el otro portátil, en `VERSION.md`.
- Repo: https://github.com/TheAicreativecontent/MichiFit
- Vercel enlazado con la CLI (`vercel link --project michifit`). El enlace
  desde el MCP fallaba: el proyecto no era visible con el ámbito del token.
- `.vercel/` y `.env.local` están en `.gitignore`: el segundo lleva un token
  OIDC que la CLI descarga. **No subirlos nunca.**

### B. Notas de diseño, revisión y trampas, con su porqué

#### El objetivo de calorías (arreglado el 2026-09-09)
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

#### Idiomas (desde el 2026-09-09)
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

#### El michi (replanteado el 2026-09-09)
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

#### El calendario (2026-09-10)
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

#### Ninja y los tres colores (2026-09-10)

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

#### La revisión del 2026-09-11

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

#### Los botones, versión buena (2026-09-12)

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

##### Lo que había antes (2026-09-11)

Cuidar: mimar · agua · limpiar. Medir: comida · entreno · pasos · sueño,
y al aceptar se abre `EditorDia` **filtrado a ese dato** (prop `solo`).
Mientras mueves el cursor por el anillo de medir, la pantalla **enseña
ya lo que vas a apuntar**: sobre «pasos», el michi andando por la calle.

Toda la gramática vive en `src/mascota/anillos.js`. Los iconos son emoji
de momento; se cambian ahí por los PNG de Albert cuando estén.

**Tres salidas, y hacen falta**: el icono ✕, el botón izquierdo desde
cualquier sitio, y la vuelta sola a los 8 s. Un tamagotchi venía con
manual de papel; esto no.

##### Si dibujas un icono a mano

Va en **`pixel/iconos-a-mano/<nombre>.png`** y ahi manda sobre la
rejilla de texto. El lado tiene que ser divisor entero de 96 (12, 16,
24, 32, 48, 96): se amplia con NEAREST y no se inventa un solo pixel.
Reducir de 16 a 12 NO es entero y emborrona, por eso se guarda a 96.

El primero es la escoba de `limpiar`, de Albert. La rejilla de aqui
dice un CUBO —a 12 px el palo en diagonal desaparecia— y se deja escrita
a proposito: documenta el intento y vuelve sola si se borra el dibujo.

**Al cambiar un icono hay que subir `const CACHE` en `public/sw.js`**:
no llevan hash en el nombre. Lo vigila `pruebas/cache-sw.mjs`.

##### Los iconos de los anillos

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

##### Los botones dicen lo que hacen

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

##### Las barras de agua y orden

`engine/cuidados.js`. Bajan con las horas de VIGILIA (16 y 24) y se
rellenan con un botón; al bajar CLEAN salen cacas kawaii de una en una.

**Son el anzuelo, no la mecánica**, y esto está probado y no solo dicho:
`pruebas/cuidados.mjs` comprueba campo por campo que con el cuenco lleno
y con el cuenco vacío salen el mismo nivel, la misma experiencia, el
mismo HAPPY y el mismo cumplimiento. Si alguna vez esa prueba se pone en
rojo, es que el bucle ha empezado a premiar pulsar botones.

**Cumplir ya NO manda sobre tener sed** (invertido el 2026-09-18, ver
la última entrada de arriba y `DECISIONS.md`): caca → asqueado, sed →
sediento, y con todo atendido el michi de pie. La regla antigua decía que
quien no descubriera el botón del agua no volvía a ver a su michi
contento; ahora `contento` es una recompensa por constancia casi perfecta
(`forma` ≥ 90) y no la cara de casi todos.

##### Si tocas los dibujos del michi

La cadena de respaldo de `TamagotchiPNG` lleva un `new Set` que **no es
aseo**: el michi naranja no tiene sufijo, así que sus dos primeros
candidatos salían idénticos y el respaldo reintentaba la misma URL para
siempre. El michi se quedaba invisible. No lo quites.

#### La historia de Ninja, dentro de la app (2026-09-11)

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

#### «Mi objetivo» (antes «Mi pacto»), 2026-09-11

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

#### Los cuatro suelos de seguridad (2026-09-11)

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

#### El color, al adoptarlo (2026-09-12)

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

#### Los rangos del simulador (2026-09-12)

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

#### PromptPay, montado y apagado (2026-09-12)

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

#### Seguridad (revisado el 2026-09-09)
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

#### Traer datos de la app antigua
Ajustes → «Traer datos de la MichiFit antigua». Se sube el CSV que exporta
la app vieja (la de `synastry.site/michifit/`) y se fusiona **sin pisar**
nada de lo que ya haya apuntado: solo rellena huecos. El parser está en
`src/datos/importar.js`.

Ojo con la columna `sueno` de ese CSV: **no son horas**, es la puntuación de
sueño de Garmin (va de 44 a 85). Se guarda en `entrada.importado.suenoPuntos`
y NO se convierte a `sueno.horas`.

#### Cómo se abre el panel de pruebas
Siete toques seguidos en el logo de la cabecera (con menos de segundo y
medio entre toque y toque). Deja cambiar el cuerpo, la pose y la escena
del michi para revisar los dibujos sin apuntar datos reales.

#### Notas rápidas
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
