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
