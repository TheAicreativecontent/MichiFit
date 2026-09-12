# _CUARENTENA — código que no se usa pero no se borra

Revisión del **2026-09-09**, antes de abrir la app al público.

Nada de esto está borrado. Aquí va lo que la app ya no usa, con el porqué,
para poder recuperarlo si resulta que sí hacía falta. **Si dentro de unos
meses nadie lo ha echado de menos, entonces sí se puede borrar.**

---

## Michi.jsx — el michi en SVG

`src/mascota/Michi.jsx` → aquí.

320 líneas dibujando el michi en SVG, con el prefijo `mg-`. Viene del
prototipo que se llamaba Michigochi. **Ninguna pantalla lo importaba**:
el michi que se ve en la app es pixel art (`TamagotchiPNG.jsx`).

Se guardó cuando se archivó Michigochi «por si acaso», y ese por si acaso
ya duró bastante. Para recuperarlo basta con moverlo de vuelta a
`src/mascota/` e importarlo donde haga falta.

### michi.css va con él

`src/mascota/michi.css` → aquí, junto a `Michi.jsx`. Es su hoja de
estilos: las animaciones con el prefijo `mg-` (respirar, dormitar,
botar, mover la cola). Ningún JSX vivo usa esas clases.

Se quedó atrás en la primera limpieza, con dos efectos: seguía
compilándose en la app sin que nada la usara, y el `Michi.jsx` de aquí
tenía el `import './michi.css'` roto. Ahora el par está completo y se
recupera moviendo **los dos** archivos a `src/mascota/`.

## Constantes de los días de la semana

`DIAS_INICIAL` y `DIAS_LARGO`, en `src/engine/constantes.js`. **No se han
movido**: siguen exportadas y marcadas con un comentario, porque están en
el mismo archivo que constantes muy vivas.

Dejaron de usarse el 2026-09-09, cuando la app pasó a hablar cinco
idiomas: los nombres de los días tenían que traducirse, así que ahora
salen del diccionario (`dias.inicial` y `dias.largo` en `src/i18n/`).

## Reglas de CSS sin usar

13 reglas en `src/estilos.css`, marcadas con
`/* CUARENTENA 2026-09-09 · sin usar en ningun JSX */`. Ninguna de sus
clases aparece en ningún `.jsx`:

`mf-accion` · `mf-acciones` · `mf-dia` · `mf-dia-cab` · `mf-dia-campos` ·
`mf-phone` · `mf-semana` · `mf-toggle`

Son restos de la primera versión de «Mi pacto», que enseñaba los siete
días como una lista vertical antes de pasar a la fila de columnas. Se
quedan comentadas y no borradas porque ocupan poco y porque el CSS
comprimido las tira igual: no llegan al usuario.

---

## Cómo se encontró todo esto

Con dos barridos que merece la pena repetir de vez en cuando:

```bash
# exports e imports que nadie usa
grep -rn "^export \(const\|function\)" src/

# clases de CSS que no aparecen en ningún JSX
grep -o "\.mf-[a-zA-Z0-9_-]*" src/estilos.css | sort -u
```

---

## Revisión del 2026-09-11

### dias-en-castellano.js — los nombres de los días

`DIAS_INICIAL` y `DIAS_LARGO`, de `src/engine/constantes.js`. Dejaron de
usarse el 2026-09-09, cuando la app pasó a hablar cinco idiomas: los
nombres salen ahora del diccionario (`dias.inicial`, `dias.largo`).

Ya estaban marcados «EN CUARENTENA» dentro del propio archivo, con la
nota de que si en un mes nadie los echaba de menos, fuera. No hacía falta
esperar el mes: nadie los importaba, y eran una trampa activa. Cualquiera
que los usara sin fijarse pondría «Miércoles» en la pantalla de alguien
que tiene la app en japonés, y nada avisaría.

### sueltos/ — cuatro PNG de la raíz del repositorio

`96_colores.png`, `128_colores.png`, `192_colores.png` y `optimize.png`.
Los cuatro son la carcasa lisa del huevo (660x900) en distintas pruebas
de reducción de paleta, de cuando se buscaba bajar el peso del archivo.

Estaban en la **raíz del repositorio**, subidos a GitHub, y no los
nombraba ni el código, ni el HTML, ni el manifest, ni el service worker.
El acabado liso vive en `carcasas-lisas/`, que es donde toca; esto era lo
que quedó del banco de pruebas.

---

## Revisión del 2026-09-13

### michis.js y generar_michis.py — las cinco siluetas, en datos

`pixel/michis.js` y `pixel/generar_michis.py` → `cuerpos-antiguos/`, junto
a los 16 PNG de esos mismos cuerpos que llegaron aquí el 2026-09-09.

Es la otra mitad de aquella retirada, y se quedó fuera cuatro días. Los
dibujos se movieron; las **rejillas** —los mismos cinco cuerpos escritos
como texto de 32x32— siguieron en `pixel/`, exportadas y compilándose con
la app. `Tamagotchi.jsx` hacía `MICHIS[estado] ?? MICHIS.kawaii` en cada
render, así que se leían siempre y se pintaban **nunca**: el dibujo estaba
detrás de un `!sinMichi` y el único sitio que monta ese componente pasaba
siempre `sinMichi`.

El generador viene con ellas porque solo hacía esto: los PNG por estado (en
`cuerpos-antiguos/`), la hoja de contactos y el propio `michis.js`. Ningún
otro script de `pixel/` lo importa.

**Del archivo solo estaba vivo `TAM = 32`**, y ni siquiera para lo que
parece: no mide un sprite, mide la **rejilla del LCD**. Que el cuadrito de
la rejilla y el píxel del michi midan lo mismo es la estética entera del
aparato. Ese 32 se quedó en `Tamagotchi.jsx` como número propio, con su
porqué escrito al lado.

Con el sprite se fueron también los props `estado`, `cara` y `sinMichi`:
los tres existían para decirle a ese componente que **no** dibujara un
michi. Ahora no sabe, y no hay que pedírselo. La etiqueta de
accesibilidad decía «Michi kawaii, neutro» —en castellano, en una app que
habla cinco lenguas, describiendo algo que no se pintaba—; el SVG pasa a
`aria-hidden`, igual que el `<img alt="">` al que sustituye.

#### Si algún día vuelven

Lo de `cuerpos-antiguos/LEEME.md` sigue valiendo entero, y ahora es más
barato: los datos están aquí al lado. Habría que devolver los dos archivos
a `pixel/`, reimportar `MICHIS` y `PALETA` en `Tamagotchi.jsx` y recuperar
el bloque del sprite. Está en el historial: `git log -S "MICHIS" -- src/mascota/Tamagotchi.jsx`.

Y antes, leer la sección 5 de `MECANICA.md`, que es la razón de producto
por la que se fueron. No es una limpieza técnica lo que las quitó.

### salir.png — este NO se guarda, se borra

`public/iconos-anillo/salir.png`, su rejilla en `pixel/iconos_anillo.py` y
el rótulo `anillo.salir` en las cinco lenguas. **Borrado, no movido**, y a
propósito: es una equis de 12x12 que se rehace en dos minutos, y el
historial de git ya es sitio de sobra para eso. Aquí dentro va lo que
costaría recuperar, no todo lo que alguna vez existió.

Se quedó sin sitio el 2026-09-12, cuando el botón derecho pasó a cerrar el
anillo: un icono de SALIR dentro del anillo sobra cuando hay un botón
dedicado. Llevaba un día en la carpeta de iconos vivos fingiendo que se
usaba.

Los ocho iconos que quedan se regeneraron (`python pixel/iconos_anillo.py
--hoja`) y salen **byte a byte idénticos**, así que `CACHE` se queda en v5.
La propia prueba lo dice: un archivo borrado no tapa nada en la caché, solo
los modificados.
