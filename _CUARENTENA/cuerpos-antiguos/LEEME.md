# Los cuatro cuerpos que sobraban — fuera desde el 2026-09-09

16 dibujos: `esqueletico`, `gordo`, `fit` e `hipertrofiado`, cada uno con
sus poses de comer, entrenar y dormir.

**No fallaban.** Se quitaron porque varias personas que probaron la app
dijeron lo mismo sin ponerse de acuerdo: no entendían para qué servía el
gato, y no querían identificarse con un cuerpo grande ni con uno pequeño.

El michi que se queda es el que se llamaba `kawaii`, renombrado a
`michi`. Ya no refleja tu cuerpo: refleja tu constancia.

## Si algún día vuelven

No basta con devolver los PNG. Habría que reescribir `estadoVisual()` en
`src/engine/michi.js`, que ahora devuelve siempre la misma silueta, y
recuperar `entrenosRecientes()` y `comeDeMas()`, que se borraron con
ella. Están en el historial de git: `git log -S "hipertrofiado"`.

Y antes de hacerlo, leer la sección 5 de `MECANICA.md`, que explica por
qué se fueron. El documento ya prometía en su sección 10 «no enseñar un
cuerpo gordo o esquelético como juicio sobre el usuario» mientras la
tabla de la 5 definía exactamente eso.
