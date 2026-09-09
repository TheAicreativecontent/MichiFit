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
