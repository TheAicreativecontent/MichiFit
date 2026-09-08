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
  const grasa = Math.round((kcal * 0.25) / 9);
  const carbos = Math.round((kcal - proteina * 4 - grasa * 9) / 4);
  return { proteina, carbos, grasa: Math.max(0, grasa) };
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
    const minimo = pesoParaIMC(IMC_MINIMO_SANO, perfil.altura);
    avisos.push({
      tipo: 'peso',
      texto: `Tu peso meta queda por debajo de un IMC de ${IMC_MINIMO_SANO}. Para tu altura eso son unos ${minimo.toFixed(1)} kg como suelo saludable.`,
    });
  }

  if (comidaKcal != null && comidaKcal < KCAL_MINIMAS[sexo]) {
    avisos.push({
      tipo: 'kcal',
      texto: `Comer menos de ${KCAL_MINIMAS[sexo]} kcal al día no es sostenible sin supervisión. El michi no mejora por bajar de ahí.`,
    });
  }

  const maximo = (perfil?.pesoActual ?? 0) * RITMO_MAXIMO_SEMANAL;
  if (kgPorSemana != null && Math.abs(kgPorSemana) > maximo && maximo > 0) {
    avisos.push({
      tipo: 'ritmo',
      texto: `Bajar ${Math.abs(kgPorSemana).toFixed(2)} kg por semana es más rápido de lo recomendable para ti (unos ${maximo.toFixed(2)} kg). Se pierde músculo, no solo grasa.`,
    });
  }

  return avisos;
}
