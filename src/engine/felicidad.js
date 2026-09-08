/* ============================================================
   MichiFit · la felicidad del michi
   La única parte del motor que depende de la HORA, no solo del día.

   Cómo se compone:
     base        lo que hiciste ayer — cumplir deja al michi contento
     tareas      lo que llevas hecho hoy del pacto
     cariño      los mimos recientes, con rendimiento decreciente
     desgaste    baja sola con las horas desde el último cuidado, pero
                 NO por la noche: el michi también duerme

   Los mimos suben poco y cada vez menos: la idea es que apetezca darle
   al botón, no que se pueda tener al michi feliz solo a base de
   caricias. Si bastara con eso, la app dejaría de hablar de tu vida.
   ============================================================ */

export const MIMO_TOPE = 22;        // lo máximo que puede aportar el cariño
export const MIMO_SUAVIDAD = 4;     // cuántos mimos para acercarse al tope
export const DESGASTE_POR_HORA = 2.2;
export const DESGASTE_TOPE = 32;
export const VENTANA_CARINO_H = 12; // los mimos se olvidan pasadas estas horas

/* De noche la barra se congela. Nadie tiene que levantarse a las cuatro
   de la mañana a darle al botón para que el michi no decaiga: eso
   convertiría el cariño en una obligación, que es justo lo contrario. */
export const NOCHE_DESDE = 23;   // hora a la que el michi se duerme
export const NOCHE_HASTA = 7;    // hora a la que se despierta

const HORA = 3600_000;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function calcularFelicidad({ evaluaciones = [], entradas = {}, carino = [], ahora = Date.now() }) {
  const hoy = evaluaciones[0];
  const ayer = evaluaciones[1];

  /* Ayer manda: el michi se despierta como se durmió. Si el día de ayer
     sigue abierto (aún puedes rellenarlo) no se le castiga. */
  const base = !ayer ? 60 : ayer.cumple ? 72 : ayer.abierto ? 58 : 30;

  const tareas = (hoy?.proporcion ?? 0) * 24;

  const recientes = carino.filter((t) => ahora - t < VENTANA_CARINO_H * HORA);
  const mimos = MIMO_TOPE * (1 - Math.exp(-recientes.length / MIMO_SUAVIDAD));

  /* Desgaste desde el último cuidado: un mimo o apuntar algo cuentan
     los dos. Lo que baja la barra es el abandono, no el reloj. */
  const ultimoMimo = recientes.length ? Math.max(...recientes) : 0;
  const ultimoDato = ultimaEntrada(entradas);
  const ultimo = Math.max(ultimoMimo, ultimoDato);
  const horas = ultimo ? horasDespierto(ultimo, ahora) : 6;
  const desgaste = Math.min(DESGASTE_TOPE, Math.max(0, horas) * DESGASTE_POR_HORA);

  return {
    valor: Math.round(clamp(base + tareas + mimos - desgaste, 0, 100)),
    detalle: {
      base: Math.round(base),
      tareas: Math.round(tareas),
      mimos: Math.round(mimos),
      desgaste: -Math.round(desgaste),
      mimosRecientes: recientes.length,
      denoche: esDeNoche(ahora),
    },
  };
}

/* Horas transcurridas entre dos momentos, contando SOLO las de vigilia.
   Se recorre hora a hora: son como mucho unas decenas y así el cálculo
   es evidente de leer, que en algo con husos horarios y cambios de hora
   vale más que ser listo. */
export function horasDespierto(desde, hasta) {
  if (hasta <= desde) return 0;
  let despiertas = 0;
  for (let t = desde; t < hasta; t += HORA) {
    const h = new Date(Math.min(t, hasta - 1)).getHours();
    const duerme = h >= NOCHE_DESDE || h < NOCHE_HASTA;
    if (!duerme) despiertas += Math.min(HORA, hasta - t) / HORA;
  }
  return despiertas;
}

export function esDeNoche(ahora = Date.now()) {
  const h = new Date(ahora).getHours();
  return h >= NOCHE_DESDE || h < NOCHE_HASTA;
}

/* Momento del último dato apuntado. Las entradas no guardan hora, así
   que se toma el mediodía del día más reciente con datos: sirve para
   medir abandono de días, que es de lo que va. */
function ultimaEntrada(entradas) {
  const fechas = Object.keys(entradas).filter((f) => {
    const e = entradas[f];
    return e && (e.pasos != null || e.entrenoMin != null || e.comidaKcal != null
              || e.peso != null || e.sueno?.horas != null);
  }).sort();
  if (!fechas.length) return 0;
  return new Date(fechas[fechas.length - 1] + 'T12:00:00').getTime();
}

/* Quita los mimos viejos para que la lista no crezca sin fin. */
export function podarCarino(carino = [], ahora = Date.now()) {
  return carino.filter((t) => ahora - t < 24 * HORA);
}
