# COMIC.md — el guion de la historia de Ninja

> Lo escribió Albert y hasta el 2026-09-16 solo existía en un chat. Aquí
> está lo que hace falta para **volver a generar cualquier viñeta** y que
> salga el mismo gato: la ficha de estilo, la de personajes y qué pasa en
> cada plano.
>
> El arco corto —seis actos— está en `LORE.md`. Esto es el detalle.

## Las reglas que hacen que funcione

**Ninja es GRIS atigrado.** Al principio el guion estaba escrito en
naranja porque era el único michi que existía; ahora el gris está hecho
y en la app, así que manda la historia. Los tonos salen del archivo de
verdad: `#837C7C` en las luces, `#645E5E` en el medio y `#4C4848` en las
rayas. **Gris cálido y neutro, no azulado.**

**Los prompts van en inglés a propósito.** Los generadores entienden
mucho mejor los términos de estilo en inglés —*pixel art, chunky pixels,
dithering*— y en español devuelven ilustración normal en vez de pixel
art.

**El orden importa.** Se genera primero la viñeta 1 hasta que el Ninja
guste de verdad, y ese fotograma se usa como *character reference* en
todas las demás. Sin eso salen 21 gatos distintos, que es el fallo
clásico de los cómics generados.

**La ficha de estilo no se reescribe ni se resume entre viñetas.** La
consistencia sale de repetirla idéntica.

## Ficha de estilo

```
pixel art, kawaii chibi style, vertical 9:16 composition, soft pastel
color palette, warm cream background tones with orange and gold accents
in the environment only (#F2650F, #FFC93C, #6FBBEF, #FDF1E4), chunky
readable pixels, clean dark outlines on characters, detailed pixel-art
background, cozy storybook mood, no text, no watermark, no signature
```

En los actos duros (4 y 5) se cambia la línea de color por:
`soft pastel palette pushed dark and desaturated, deep blues and blacks
with one warm lamp glow`.

## Ficha de personajes

| Quién | Cómo se describe |
|---|---|
| **Ninja** | `Ninja, a very small skinny kitten, grey tabby with darker grey stripes (#837C7C highlights, #645E5E midtones, #4C4848 stripes), warm neutral grey not blue-grey, cream belly, big round black eyes, pink blush cheeks` |
| **La enfermera** | `a young Thai woman with long black hair, wearing light blue nurse scrubs, kind warm expression` |
| **Albert** | `a western man with short hair and a trimmed beard, casual clothes, warm relaxed expression` |

Ninja **es muy pequeño y flaco al principio** y va llenándose a partir de
la viñeta 6. En la 10 ya es un gato sano.

## Lo que hay en la app: 14 viñetas

Albert leyó el cómic montado y lo reordenó el 2026-09-16: la enfermera
se llama **Anna**, entran el veterinario y Ninja ya recuperado, y el
saludo a distancia **no hace falta** — «funciona tal cual».

| # | Título | Archivo en `IMG/Comic/` | En `public/comic/` |
|---|---|---|---|
| 1 | Las calles de Bangkok | `Act_01` | `01-callejon.jpg` |
| 2 | Anna, la enfermera | `Act_01_v01` | `02-anna.jpg` |
| 3 | El peligro | `Act_02` | `03-peligro.jpg` |
| 4 | ¡Escapó por los pelos! | `Act_02b_v2` | `04-huida.jpg` |
| 5 | Las noches con hambre | `Act_03b_v03` | `05-hambre.jpg` |
| 6 | El amanecer | `Act_04_v02` | `06-amanece.jpg` |
| 7 | La trampa | `Act_04a_v02` | `07-trampa.jpg` |
| 8 | El atracón | `Act_05_v01` | `08-atracon.jpg` |
| 9 | La noche | `Act_07_v03` | `09-noche.jpg` |
| 10 | La carrera al veterinario | `Act_08a_v03` | `10-carrera.jpg` |
| 11 | El veterinario | `Act_09_v02` | `11-veterinario.jpg` |
| 12 | La recuperación | `Act_09c_v02` | `12-recuperacion.jpg` |
| 13 | Ninja feliz | `Act_10_v01` | `13-recuperado.jpg` |
| 14 | En casa | `Act_11` | `14-casa.jpg` |

Después vienen dos pantallas que no son viñetas: **«Esta es la historia
de Ninja»**, con el collage de fotos de verdad que hizo Albert y, solo al adoptarlo, la de elegir el
color.

**La 11 y la 13 tuvieron texto al final.** Primero salieron mudas por
ser de acción, y Albert vio al leerlas que sí lo necesitaban: la 11 es
una viñeta partida y sin texto no se sabía cuánto tiempo pasaba; la 13
es el cierre feliz y pedía que se dijera. Si alguna vez se quiere una
viñeta muda, basta con dejar título y texto vacíos en el diccionario:
la pantalla no pinta la banda.

**La 13 cierra un arco que abre la 2.** En la 2, «Ninja nunca se
acercaba a ningún humano»; en la 13, «aquel gato que nunca se acercaba
a ningún humano ahora se deja mimar». La frase repetida es a propósito:
el cambio de Ninja se cuenta con las mismas palabras dichas al revés.

**El texto va ARRIBA**, no abajo: casi toda la acción de estas viñetas
pasa en la mitad inferior —el gato, el bol, la basura, la carrera— y un
bocadillo abajo competía con el dibujo por la misma zona.

**Decidido: en la 10, «tirado en el suelo».** Albert había escrito
«convulsionando» y se propuso cambiarlo, porque la regla de este cómic es
que del envenenamiento no se enseña nada explícito, tampoco con palabras.
Lo leyó y se quedó con «tirado en el suelo».

## Los dos recursos que sostienen el tono

**Del agresor solo se ve la sombra, y del envenenamiento no se ve nada
explícito.** Un cómic kawaii aguanta una historia dura si el dolor se
cuenta con la luz y el encuadre, no con la casquería.

**Ninja duerme tres veces** — con hambre, lleno, enfermo — las tres con
el mismo encuadre. Se lee de un vistazo cuánto ha cambiado.
