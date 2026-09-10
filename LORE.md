# LORE.md — quién es Ninja

El michi de MichiFit tiene nombre e historia desde el 2026-09-10.
Existe porque varias personas probaron la app y dijeron lo mismo: **no
entendían para qué servía el gato**. Ese sigue siendo el problema a
resolver — arreglamos qué refleja el michi, pero la app aún no cuenta
quién es.

## En una frase

Ninja es un gatito callejero de Bangkok al que envenenaron, al que
salvaron a tiempo, y que ahora vive contigo. No es tu cuerpo ni tu
avatar: es tu compañero y tu recordatorio.

## Lo que NO es

- **No es un espejo de tu cuerpo.** Se quitaron las cinco siluetas por
  esto mismo (ver `MECANICA.md` §5). Ninja refleja tu constancia.
- **No hay que darle de comer con un botón.** Cuando apuntas TU comida,
  él come. Si fuera un botón aparte, la mecánica premiaría tocar un
  icono en vez de cuidarte, que es un bucle vacío.
- **No juzga.** Se pone triste si lo dejas, nunca te reprocha.

## El color: gris, como al principio

Decisión de Alberto, 2026-09-10 por la noche: **Ninja es gris
atigrado**, como decía tu lore original.

Durante ese mismo día se había escrito en naranja, y por una razón
razonable: era el único michi que existía dibujado, y el naranja es el
color de marca (el huevo, el logo). Por la tarde se hizo el michi gris,
quedó bien, y entonces ya no hacía falta doblar la historia para que
encajara con el dibujo. Manda la historia.

Los tonos son los del archivo, medidos, no inventados: `#837C7C` en las
luces, `#645E5E` en los medios y `#4C4848` en las rayas. Es un gris
**cálido y neutro, no azulado** — decírselo al generador de imágenes es
lo que más ayuda a que todas las viñetas salgan del mismo gato.

Los tres colores siguen estando en Ajustes, y **el naranja y el blanco
no son otro Ninja: son otros gatos**. Los hace
`python pixel/tenir_michi.py` a partir de los naranjas, porque el michi
es un 99% monocromático y se tiñe igual que la carcasa del huevo. Las
nueve poses por tres colores, con los mofletes rosas intactos.

Los nombres son los de Alberto y no los míos: lo que yo generé como
«negro» él lo ve gris, y el blanco que hice primero deslumbraba y
perdía el atigrado, así que se bajó de 0,66-0,99 a 0,56-0,94.

**Queda un cabo suelto**: la app arranca con el michi naranja. Si Ninja
es gris, «adopta a Ninja» te está dando hoy otro gato. Está en `ASK.md`,
es una decisión de producto y es de Alberto.

## El cómic

21 viñetas en pixel art kawaii, formato 9:16 para móvil. Los prompts
están escritos y listos para generar, agrupados por escena, **con Ninja
ya en gris**. Arco:

| Acto | Qué pasa |
|------|----------|
| 1 · el callejón | Ninja rebusca comida. Una enfermera tailandesa le deja de comer. Se saludan de lejos: llevan así mucho tiempo |
| 2 · el peligro | Alguien lo echa a escobazos. Escapa por los pelos y se duerme con hambre |
| 3 · la trampa | Amanece. Encuentra un bol demasiado limpio, demasiado bonito. Come feliz |
| 4 · la noche | Lo han envenenado. Ella lo encuentra bajo la lluvia y corre al veterinario |
| 5 · el rescate | Le salvan la vida. Abre los ojos y ella sigue ahí, dormida en la silla |
| 6 · casa | Ninja sano, entre Alberto y ella |

Dos decisiones de tono, para que un cómic kawaii aguante una historia
dura: del agresor **solo se ve la sombra**, y del envenenamiento no se
ve nada explícito — se cuenta con un cenital, lluvia y un solo foco.

Y un recurso: **Ninja duerme tres veces** (con hambre, lleno, enfermo),
las tres con el mismo encuadre. Se lee de un vistazo cuánto ha cambiado.

## Lo que esto pide de la app

Está en `TODO.md` como lo siguiente, y es lo importante:

- La bienvenida deja de ser «configura tu perfil» y pasa a ser **«adopta
  a Ninja»**.
- El pacto deja de ser un formulario y pasa a ser **una promesa que le
  haces a un gato que casi se muere en la calle**.
- El michi tiene nombre. Ahora la app dice «soy tu michi» y nada más,
  que es exactamente por lo que nadie sabe quién es.
