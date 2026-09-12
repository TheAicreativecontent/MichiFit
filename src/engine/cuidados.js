/* ============================================================
   MichiFit · el agua y el orden
   Las dos barras que SÍ son de tamagotchi puro: bajan solas con las
   horas y se rellenan pulsando un botón.

   Por qué existen, que es lo que hay que entender antes de tocarlas:
   son el **anzuelo**, no la mecánica. Dan un motivo para abrir la app
   de tanto en tanto —el michi tiene sed, hay que recoger— y, ya que
   estás dentro, apuntas los pasos y la comida. Decisión de Alberto del
   2026-09-11, ver `DECISIONS.md`.

   Tres reglas que NO se negocian, y vienen de `MECANICA.md` §10:

     1. **No tocan nada.** Ni la experiencia, ni el nivel, ni HAPPY, ni
        el cumplimiento del pacto. Un michi con sed y un michi con el
        cuenco lleno suben de nivel exactamente igual. Si algún día
        dieran puntos, la app premiaría pulsar un botón en vez de
        cuidarte, y eso es justo lo que este proyecto no hace.
     2. **No hay castigo, ni muerte, ni reproche.** El michi tiene sed o
        arruga la nariz. No te dice que le has fallado. Se arregla con
        un toque y vuelve a estar como antes: no se acumula nada.
     3. **De noche no baja.** Igual que la barra HAPPY: nadie tiene que
        levantarse a las cuatro de la mañana a darle agua a un gato de
        píxeles. Se cuentan solo las horas de vigilia.

   El reloj empieza cuando adoptas al michi (la fecha del pacto), no la
   primera vez que pulsas: así el bucle arranca solo y no hace falta
   descubrirlo para que exista.
   ============================================================ */

import { horasDespierto } from './felicidad.js';

/* Horas DE VIGILIA en vaciarse del todo. Son los dos números que
   gobiernan el ritmo de todo esto.

   Bajados el 2026-09-12 (16→10 y 24→14) después de que Alberto lo usara
   unos días: «cuando entro en la app apenas se ha movido». Tenía razón,
   y la cuenta lo explica — son horas DESPIERTO, no horas de reloj. Con
   16 y unas 16 horas de vigilia al día, el agua tardaba justo un día
   entero en vaciarse: quien abra la app dos veces al día se la
   encontraba casi llena siempre, y una barra que no se mueve no pide
   nada.

   Con 10, el agua se vacía en algo más de medio día de vigilia, así que
   pide de beber una o dos veces al día. Con 14, la casa se ensucia del
   todo en algo menos de un día. Siguen sin castigar: `MECANICA.md` 8b y
   `pruebas/cuidados.mjs` garantizan que esto NO toca la mecánica.

   Súbelo si cansa, bájalo si aburre. */
export const AGUA_HORAS = 10;
export const ORDEN_HORAS = 14;

/* Cuántas cacas kawaii llegan a salir con la casa del todo sucia. Van
   apareciendo de una en una según baja la barra.

   De 3 a 5 el 2026-09-12, también a petición de Alberto. Con 3, cada
   caca aparecía al bajar 33 puntos enteros de barra, así que el suelo
   se veía igual la mayor parte del tiempo; con 5, cada 20 puntos, y se
   nota que la cosa va a peor mientras no recojas. */
export const CACAS_MAX = 5;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* De 100 (recién hecho) a 0 (del todo gastado). */
function nivel(desde, ahora, horasTotales) {
  if (!desde) return 100;
  const gastadas = horasDespierto(desde, ahora);
  return Math.round(clamp(100 - (gastadas / horasTotales) * 100, 0, 100));
}

/* El momento desde el que se cuenta: la última vez que se hizo, y si
   nunca se ha hecho, desde que se creó el pacto —adoptar al michi—.
   Sin ninguna de las dos, se da por recién hecho. */
function origen(ultima, pacto) {
  if (ultima) return ultima;
  if (pacto?.creado) {
    const t = new Date(pacto.creado + 'T12:00:00').getTime();
    if (Number.isFinite(t)) return t;
  }
  return null;
}

export function calcularCuidados({ cuidados = {}, pacto = null, ahora = Date.now() } = {}) {
  const agua = nivel(origen(cuidados.agua, pacto), ahora, AGUA_HORAS);
  const orden = nivel(origen(cuidados.orden, pacto), ahora, ORDEN_HORAS);

  /* Las cacas salen por tramos: con la barra al 100 no hay ninguna, y
     con la barra a 0 están las tres. Se redondea hacia arriba para que
     la primera aparezca en cuanto la barra deja de estar llena — si no,
     no habría nada que recoger hasta la mitad del día. */
  const cacas = Math.min(CACAS_MAX, Math.ceil(((100 - orden) / 100) * CACAS_MAX));

  return {
    agua,
    orden,
    cacas,
    sed: agua === 0,          // el michi tiene sed: hay dibujo para esto
    sucio: orden === 0,       // la casa está para recogerla
  };
}

/* Rellenar el cuenco / recoger. Devuelve el objeto `cuidados` nuevo:
   quien llama lo guarda. No hay nada que acumular, solo la marca de
   cuándo se hizo por última vez. */
export function atender(cuidados = {}, que, ahora = Date.now()) {
  if (que !== 'agua' && que !== 'orden') return cuidados;
  return { ...cuidados, [que]: ahora };
}
