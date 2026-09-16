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

## Los 22 planos

`Archivo` es lo que hay generado en `IMG/Comic/` (fuera de git: pesa).
**En la app** marca los once que se usan.

| # | Qué pasa | Por qué está | Archivo | En la app |
|---|---|---|---|---|
| 1 | Ninja rebusca en la basura | Fija al personaje. Se genera primero y es la referencia de las otras veinte | `Act_01` | **1** |
| 2 | La enfermera deja comida | Ella entra por lo que hace, no por lo que dice | `Act_01_v01` | **2** |
| 3 | El saludo a distancia | La más importante del acto: la 22 la responde | — | |
| 4 | Ninja come solo | La soledad se cuenta con el encuadre: mucho vacío alrededor | `Act_01b` | |
| 5 | La sombra con la escoba | Del agresor **solo se ve la sombra**. El susto lo pone la cara de Ninja, no la violencia | `Act_02` | **3** |
| 6 | Escapa por los pelos | El escobazo golpea el suelo, no al gato | `Act_02b_v2` | **4** |
| 7 | A salvo en su escondite | El respiro. Vuelve el calor a la paleta | `Act_03_v03` | |
| 8 | Le suenan las tripas | El hambre es lo que le lleva a la trampa. Sin esto, la 10 no se entiende | `Act_03b_v03` | **5** |
| 9 | Se duerme con hambre | Cierra el acto en calma. **Primera de las tres veces que duerme** | — | |
| 10 | Amanece en Bangkok | El respiro más bonito, justo antes de lo peor. El contraste es deliberado | `Act_04_v02` | |
| 11 | Un bol demasiado bonito | El lector ve que está demasiado limpio; Ninja no. Ahí está toda la tensión | `Act_04a_v02` | **6** |
| 12 | Come de la trampa · página completa | Él está feliz y eso es lo que duele | `Act_05_v01` | **7** |
| 13 | Vuelve feliz, con la barriga llena | El único momento en que Ninja está gordito y contento | — | |
| 14 | Se duerme satisfecho | Eco de la 9 al revés. **Segunda vez que duerme** | `Act_06_v01` | |
| 15 | Envenenado · página completa | Cenital, lluvia y un solo foco. Sin sangre: el dolor se cuenta con la luz | `Act_07_v03` | **8** |
| 16 | Ella lo encuentra | Su cara pasa del reconocimiento al horror | `Act_08_v02` | |
| 17 | Corriendo bajo la lluvia | Vertical puro: ella ocupa el alto y la ciudad se emborrona | `Act_08a_v03` | **9** |
| 18 | Llama al veterinario | Un solo rectángulo de luz cálida en toda la noche | — | |
| 19 | El veterinario lo coge | El tema son las manos: alguien más se hace cargo | `Act_09_v01` | |
| 20 | En la camilla | Se ve pequeñísimo entre los aparatos. Eso mide la gravedad sin decirla | `Act_09a_v03` | |
| 21 | Dormido, aún no recuperado | **Tercera vez que duerme.** Las tres se parecen a propósito | `Act_09b_v03` | |
| 22 | Abre los ojos y ella sigue ahí | El clímax. De «casi se muere» a «familia feliz» faltaba el momento en que se salva | `Act_09c_v02` | **10** |
| 23 | La familia · página completa | Responde a la 3: allí se saludaban de lejos, aquí ya no hay distancia | `Act_11` | **11** |

Sin usar: `Act_10_v01` (Ninja en el salón con sus juguetes), que es una
alternativa al cierre.

## Los dos recursos que sostienen el tono

**Del agresor solo se ve la sombra, y del envenenamiento no se ve nada
explícito.** Un cómic kawaii aguanta una historia dura si el dolor se
cuenta con la luz y el encuadre, no con la casquería.

**Ninja duerme tres veces** — con hambre, lleno, enfermo — las tres con
el mismo encuadre. Se lee de un vistazo cuánto ha cambiado.
