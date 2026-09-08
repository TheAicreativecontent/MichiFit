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
