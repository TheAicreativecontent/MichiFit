# DECISIONS.md — Decisiones de diseno y su razon

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

## 2026-09-07 — El michi es pixel art dentro de un tamagotchi
- Contexto: la mascota era un SVG vectorial suelto sobre la tarjeta.
- Decision: **pixel art naranja** (el atigrado del logo) dentro de un
  **aparato tipo tamagotchi** dibujado en SVG: carcasa naranja, pantalla LCD
  verde con rejilla de pixeles, tres botones y anilla.
- Razon: es lo que Alberto queria de referencia, y ademas el marco del aparato
  da contexto al michi: se entiende que es una mascota virtual, no un adorno.
- **El michi sigue siendo datos, no una imagen**: `pixel/michis.js` son rejillas
  de 32x32 que se pintan como rectangulos. Sigue cambiando con los datos.

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
- Razon: "tiene mas punch y es mas claro de entender" (palabras de Alberto).
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
