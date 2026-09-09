/* ============================================================
   MichiFit · cálculos energéticos
   Portados de la MichiFit original. Mismas fórmulas, mismos números:
   Mifflin-St Jeor, 0,04 kcal/paso, 8 kcal/min de entreno,
   7.700 kcal por kilo de grasa.
   ============================================================ */

import {
  KCAL_POR_PASO,
  KCAL_POR_MIN_ENTRENO,
  KCAL_POR_KG_GRASA,
  FACTORES_ACTIVIDAD,
  IMC_MINIMO_SANO,
  KCAL_MINIMAS,
  RITMO_MAXIMO_SEMANAL,
  DEFICIT_MAXIMO,
  DIAS,
} from './constantes.js';

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* --- IMC ---------------------------------------------------- */
export function imc(pesoKg, alturaCm) {
  if (!pesoKg || !alturaCm) return null;
  const m = alturaCm / 100;
  return pesoKg / (m * m);
}

export function pesoParaIMC(objetivo, alturaCm) {
  const m = alturaCm / 100;
  return objetivo * m * m;
}

/* --- metabolismo basal (Mifflin-St Jeor) --------------------
   El usuario puede sobrescribirlo con su media real de reloj, que
   siempre será más exacta que cualquier fórmula.               */
export function tmb({ sexo = 'hombre', peso, pesoActual, altura, edad }) {
  // El perfil guarda `pesoActual`; se acepta `peso` por comodidad al llamar
  // desde el simulador. Sin este alias la estimación devolvía null y todo el
  // cálculo se caía en silencio para quien no tiene reloj.
  const kg = peso ?? pesoActual;
  if (!kg || !altura || !edad) return null;
  const base = 10 * kg + 6.25 * altura - 5 * edad;
  return Math.round(base + (sexo === 'hombre' ? 5 : -161));
}

export function reposoEfectivo(perfil) {
  return perfil?.reposoReal || tmb(perfil);
}

/* --- gasto por movimiento -----------------------------------
   `minEntrenoSemana` se reparte entre los siete días.           */
export function gastoActividad({ pasos = 0, minEntrenoSemana = 0 }) {
  return Math.round(pasos * KCAL_POR_PASO + (minEntrenoSemana / 7) * KCAL_POR_MIN_ENTRENO);
}

export function gastoTotal(perfil, actividad) {
  const reposo = reposoEfectivo(perfil);
  if (reposo == null) return null;
  if (perfil?.totalReal) return perfil.totalReal;
  return reposo + gastoActividad(actividad);
}

/* --- macros -------------------------------------------------
   Proteína por kilo de peso META (no del actual), grasa al 25% de
   las calorías, y el resto a carbohidratos.                     */
export function macros({ kcal, pesoMeta, proteinaPorKg = 2 }) {
  if (!kcal || !pesoMeta) return null;
  const proteina = Math.round(pesoMeta * proteinaPorKg);
  const grasa = Math.max(0, Math.round((kcal * 0.25) / 9));
  /* Con un objetivo bajo y un peso meta alto, la proteina y la grasa se
     comen todas las calorias y a los carbos no le queda ninguna. Salia
     «-123 g carbos» en pantalla, que no significa nada. */
  const carbos = Math.max(0, Math.round((kcal - proteina * 4 - grasa * 9) / 4));
  return { proteina, carbos, grasa };
}


/* --- el plan del dia: de donde sale "come X kcal" -------------
   UNA sola funcion para todas las pantallas. Antes cada una hacia su
   propia cuenta con un `reposo * 1.15` copiado a mano, y el objetivo
   guardado en el pacto no se recalculaba nunca al cambiar el perfil:
   dos personas distintas podian acabar viendo el mismo numero.

   Tres decisiones que importan:

   1. El mantenimiento sale de la ACTIVIDAD QUE HAS PACTADO (pasos y
      entrenos), no de un factor plano. Si has pactado entrenar tres dias,
      gastas mas que alguien sedentario y el objetivo debe reflejarlo.
   2. El deficit tiene techo porcentual (DEFICIT_MAXIMO). Pedir "500 kcal
      menos" no significa lo mismo para todo el mundo.
   3. El suelo de KCAL_MINIMAS se RESPETA, no solo se avisa. La app no
      puede proponer un numero que ella misma llama peligroso.
*/
export function actividadDelPacto(pacto) {
  if (!pacto?.dias) return null;
  let pasos = 0, minEntrenoSemana = 0;
  for (const d of DIAS) {
    pasos += pacto.dias[d]?.pasos ?? 0;
    minEntrenoSemana += pacto.dias[d]?.minEntreno ?? 0;
  }
  return { pasos: Math.round(pasos / 7), minEntrenoSemana };
}

export function planEnergetico(perfil, pacto = null) {
  const reposo = reposoEfectivo(perfil);
  if (reposo == null) return null;

  const actividad = actividadDelPacto(pacto);
  let total, origen;
  if (perfil?.totalReal) {
    total = perfil.totalReal;
    origen = 'reloj';
  } else if (actividad) {
    total = reposo + gastoActividad(actividad);
    origen = 'pacto';
  } else {
    // Sin pacto todavia (la bienvenida, antes de elegir dias) se usa el
    // factor sedentario de la tabla, no un 1,15 inventado.
    total = Math.round(reposo * FACTORES_ACTIVIDAD.sedentario);
    origen = 'sedentario';
  }

  const sexo = perfil?.sexo === 'mujer' ? 'mujer' : 'hombre';
  const suelo = KCAL_MINIMAS[sexo];
  /* Un deficit negativo (un signo de mas escrito por error) proponia
     comer MAS que el mantenimiento, y lo etiquetaba «para perder». */
  const pedido = Math.max(0, perfil?.deficitObjetivo ?? 500);
  const techo = Math.round(total * DEFICIT_MAXIMO);

  let deficit = Math.min(pedido, techo);
  let recorte = pedido > techo ? 'techo' : null;

  let comida = total - deficit;
  if (comida < suelo) {
    // El suelo manda. Si ni comiendo el suelo hay deficit, el deficit es 0:
    // esta persona no deberia estar perdiendo peso con esta cuenta.
    comida = suelo;
    deficit = Math.max(0, total - suelo);
    recorte = 'suelo';
  }

  return {
    reposo,
    total,
    origen,
    comida,
    deficit,
    recorte,
    suelo,
    pedido,
    kgPorSemana: -(deficit * 7) / KCAL_POR_KG_GRASA,
  };
}

/* Mantiene el objetivo de comida del pacto al dia con el perfil.
   Si lo escribiste a mano se respeta y no se toca nunca: es tuyo. Si salio
   del calculo, se recalcula, porque un objetivo congelado del primer dia
   deja de tener sentido en cuanto cambias de peso, de edad o de pacto. */
export function sincronizarPacto(pacto, perfil) {
  if (!pacto || pacto.comidaManual) return pacto;
  const plan = planEnergetico(perfil, pacto);
  if (!plan || plan.comida === pacto.comidaKcal) return pacto;
  return { ...pacto, comidaKcal: plan.comida };
}

/* --- simulador "¿y si...?" ----------------------------------
   Devuelve todo lo que la pantalla necesita pintar.             */
export function simular({ perfil, pasos, minEntrenoSemana, comidaKcal }) {
  const reposo = reposoEfectivo(perfil);
  if (reposo == null) return null;

  const quemadoMoviendote = gastoActividad({ pasos, minEntrenoSemana });
  const total = reposo + quemadoMoviendote;
  const deficit = comidaKcal - total; // negativo = déficit
  const kgPorSemana = (deficit * 7) / KCAL_POR_KG_GRASA;

  const restante = (perfil.pesoActual ?? 0) - (perfil.pesoMeta ?? 0);
  let semanas = null;
  if (restante > 0 && kgPorSemana < 0) {
    semanas = restante / Math.abs(kgPorSemana);
  }

  return {
    reposo,
    quemadoMoviendote,
    total,
    deficit,
    kgPorSemana,
    semanas,
    meses: semanas == null ? null : semanas / 4.345,
    fecha: semanas == null ? null : new Date(Date.now() + semanas * 7 * 86400000),
    alcanzable: semanas != null,
  };
}

/* --- suelos de seguridad ------------------------------------
   Devuelve la lista de avisos. La app respeta lo que decida el
   usuario, pero se lo dice — y el michi no premia pasarse.      */
export function avisosDeSeguridad({ perfil, comidaKcal, kgPorSemana }) {
  const avisos = [];
  const sexo = perfil?.sexo === 'mujer' ? 'mujer' : 'hombre';

  const imcMeta = imc(perfil?.pesoMeta, perfil?.altura);
  if (imcMeta != null && imcMeta < IMC_MINIMO_SANO) {
    avisos.push({
      tipo: 'peso',
      clave: 'avisos.peso',
      vars: { imc: IMC_MINIMO_SANO,
              kg: pesoParaIMC(IMC_MINIMO_SANO, perfil.altura).toFixed(1) },
    });
  }

  if (comidaKcal != null && comidaKcal < KCAL_MINIMAS[sexo]) {
    avisos.push({ tipo: 'kcal', clave: 'avisos.kcal', vars: { min: KCAL_MINIMAS[sexo] } });
  }

  const maximo = (perfil?.pesoActual ?? 0) * RITMO_MAXIMO_SEMANAL;
  if (kgPorSemana != null && Math.abs(kgPorSemana) > maximo && maximo > 0) {
    avisos.push({
      tipo: 'ritmo',
      clave: 'avisos.ritmo',
      vars: { kg: Math.abs(kgPorSemana).toFixed(2), max: maximo.toFixed(2) },
    });
  }

  return avisos;
}
