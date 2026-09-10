/* ============================================================
   MichiFit · el pacto
   El usuario pacta su semana al empezar. El michi refleja el
   cumplimiento de ESE pacto, no el cuerpo del usuario.
   Ver MECANICA.md.
   ============================================================ */

import { DIAS, MARGEN_COMIDA, MARGEN_COMIDA_GRAVE, PESO_OBJETIVO,
         VENTANA_RETRO } from './constantes.js';

/* Pacto por defecto: se ofrece como punto de partida, el usuario lo
   ajusta entero. Tres días de entreno, cuatro de descanso, y menos
   pasos los días que entrenas — pedir las dos cosas el mismo día es
   un pacto que se incumple solo. */
export function pactoPorDefecto({ metaPasos = 6000, comidaKcal = null } = {}) {
  const entreno = { lun: true, mie: true, vie: true };
  const dias = {};
  for (const d of DIAS) {
    const entrena = !!entreno[d];
    dias[d] = {
      entreno: entrena,
      minEntreno: entrena ? 45 : 0,
      pasos: entrena ? Math.round(metaPasos * 0.66 / 500) * 500 : metaPasos,
    };
  }
  return { dias, comidaKcal, creado: hoyISO() };
}

/* Las horas de sueno de una entrada, vengan como vengan.
   El editor guarda `sueno: { horas }`, pero durante un tiempo se guardo
   `suenoHoras` plano, y el motor seguia leyendo SOLO el plano: el sueno
   que apuntabas no llegaba nunca al michi. Se lee por aqui y ya esta. */
export function horasDeSueno(entrada) {
  return entrada?.sueno?.horas ?? entrada?.suenoHoras ?? null;
}

/* ---------- fechas ---------- */
export const hoyISO = () => new Date().toISOString().slice(0, 10);

export function claveDia(fechaISO) {
  // getDay(): 0 domingo .. 6 sábado
  const d = new Date(fechaISO + 'T12:00:00').getDay();
  return DIAS[(d + 6) % 7];
}

export function diasAtras(fechaISO, n) {
  const t = new Date(fechaISO + 'T12:00:00').getTime() - n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

export function diasDesde(fechaISO, hoy = hoyISO()) {
  if (!fechaISO) return 0;
  const dif = (new Date(hoy + 'T12:00:00') - new Date(fechaISO + 'T12:00:00')) / 86400000;
  return Math.max(0, Math.round(dif));
}

export function dentroDeVentana(fechaISO, hoy = hoyISO()) {
  const dif = (new Date(hoy + 'T12:00:00') - new Date(fechaISO + 'T12:00:00')) / 86400000;
  return dif >= 0 && dif <= VENTANA_RETRO;
}

/* ---------- evaluación de un día ----------
   Devuelve los objetivos que tocaban, cuáles se cumplieron, y una
   proporción 0..1. El día "cumple" solo si están todos.
   La proporción se usa para el aspecto del michi: así fallar por poco
   se nota menos que no hacer nada.                                   */
export function evaluarDia({ pacto, entrada, fecha, hoy = hoyISO() }) {
  const objetivoDia = pacto?.dias?.[claveDia(fecha)];
  if (!objetivoDia) return null;

  const objetivos = [];

  objetivos.push({
    id: 'pasos',
    etiqueta: 'Pasos',
    objetivo: objetivoDia.pasos,
    valor: entrada?.pasos ?? null,
    cumplido: (entrada?.pasos ?? 0) >= objetivoDia.pasos,
  });

  if (objetivoDia.entreno) {
    const min = entrada?.entrenoMin ?? 0;
    objetivos.push({
      id: 'entreno',
      etiqueta: 'Entreno',
      objetivo: objetivoDia.minEntreno,
      valor: entrada?.entrenoMin ?? null,
      cumplido: min >= objetivoDia.minEntreno,
    });
  } else {
    // El descanso también forma parte del pacto: cuenta como cumplido
    // si de verdad descansaste. Entrenar un día de descanso no resta
    // (es tu cuerpo), pero se registra para poder avisarte.
    objetivos.push({
      id: 'descanso',
      etiqueta: 'Descanso',
      objetivo: null,
      valor: entrada?.entrenoMin ?? 0,
      cumplido: true,
      respetado: !(entrada?.entrenoMin > 0),
    });
  }

  if (pacto.comidaKcal) {
    const kcal = entrada?.comidaKcal ?? null;

    /* Quedarse corto o pasarse no significa lo mismo segun a donde vayas.
       Lo dice `pacto.comidaSentido`, que escribe `sincronizarPacto` a
       partir del objetivo elegido (ver `OBJETIVOS` en constantes.js):

         'menos'  adelgazando: cumplir es NO pasarse
         'mas'    ganando: cumplir es LLEGAR, el fallo es quedarse corto
         'banda'  manteniendo: cumplir es quedarse CERCA, por los dos
                  lados. Una meta que solo se puede fallar por un lado
                  no es una meta, y con 'menos' quien queria mantenerse
                  tenia el dia por bueno comiendo 700 kcal de menos.

       Un pacto guardado antes de que esto existiera no trae el campo y
       cae a 'menos', que es como se comportaba la app hasta entonces.

       Los margenes son los mismos en los tres casos. Fallar la comida no
       tumba el dia salvo que sea mucho: pesa la mitad en el animo del
       michi (`PESO_OBJETIVO`) y solo lo rompe pasado el margen grave.
       Faltar al gimnasio si lo rompe siempre. */
    const meta = pacto.comidaKcal;
    const sentido = pacto.comidaSentido ?? 'menos';
    const bajo = (m) => kcal >= meta * (1 - m);      // no se queda corto
    const alto = (m) => kcal <= meta * (1 + m);      // no se pasa

    const dentro = (m) => sentido === 'mas' ? bajo(m)
                        : sentido === 'banda' ? bajo(m) && alto(m)
                        : alto(m);

    const cumplido = kcal != null && dentro(MARGEN_COMIDA);
    const rompe = kcal == null || !dentro(MARGEN_COMIDA_GRAVE);

    objetivos.push({
      id: 'comida',
      etiqueta: 'Comida',
      objetivo: meta,
      valor: kcal,
      cumplido,
      rompeElDia: rompe,
    });
  }

  const hayDatos = entrada != null && Object.keys(entrada).length > 0;
  const abierto = !hayDatos && dentroDeVentana(fecha, hoy);

  /* La proporción va por PESOS, no por cuenta: así pasarse de calorías
     se nota en el michi la mitad que saltarse un entreno. */
  const peso = (o) => PESO_OBJETIVO[o.id] ?? 1;
  const total = objetivos.reduce((s, o) => s + peso(o), 0);
  const logrado = objetivos.filter((o) => o.cumplido).reduce((s, o) => s + peso(o), 0);

  /* Un objetivo puede fallar sin tumbar el día: lo dice `rompeElDia`.
     Sin la marca, fallar siempre lo tumba. */
  const rompen = objetivos.filter((o) => !o.cumplido && o.rompeElDia !== false);

  return {
    fecha,
    objetivos,
    proporcion: total ? logrado / total : 0,
    cumple: rompen.length === 0 && hayDatos,
    abierto, // aún se puede rellenar: no cuenta como fallo todavía
    hayDatos,
    descansoRespetado: objetivos.find((o) => o.id === 'descanso')?.respetado ?? null,
  };
}

/* ---------- evaluación de un tramo ---------- */
export function evaluarDias({ pacto, entradas, desde, dias, hoy = hoyISO() }) {
  const salida = [];
  for (let i = 0; i < dias; i++) {
    const fecha = diasAtras(desde, i);
    salida.push(evaluarDia({ pacto, entrada: entradas[fecha], fecha, hoy }));
  }
  return salida.filter(Boolean); // de más reciente a más antiguo
}

/* ---------- semanas ----------
   Una "semana" son siete días naturales hacia atrás desde el corte.  */
export function evaluarSemana({ pacto, entradas, finISO, hoy = hoyISO() }) {
  const dias = evaluarDias({ pacto, entradas, desde: finISO, dias: 7, hoy });
  const cerrados = dias.filter((d) => !d.abierto);
  const cumplidos = dias.filter((d) => d.cumple).length;
  return {
    dias,
    cumplidos,
    fallados: cerrados.filter((d) => !d.cumple).length,
    completa: cerrados.length > 0 && cumplidos === cerrados.length,
    perdida: cerrados.length === 7 && cumplidos === 0,
  };
}
