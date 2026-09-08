/* ============================================================
   MichiFit · estado del michi
   El michi es un COMPAÑERO, no un avatar: su cuerpo sale de tus
   hábitos, nunca de tu peso. Tu peso vive en Progreso y Simulador.
   Ver MECANICA.md.
   ============================================================ */

import {
  DIAS_FORMA, DIAS_ENERGIA, DIAS_ABANDONO,
  XP_DIA_CUMPLIDO, XP_SEMANA_COMPLETA,
  NIVELES, NIVEL_SUELO,
  DIAS_PARA_COMODIN, MAX_COMODINES,
  HITOS, XP_POR_HITO,
} from './constantes.js';
import { evaluarDias, evaluarSemana, hoyISO, diasAtras, diasDesde } from './pacto.js';
import { clamp } from './calculos.js';
import { calcularFelicidad } from './felicidad.js';

/* ---------- 1 · Energía (0-100) ----------
   Actividad reciente. Cae si paras, pero no de golpe: los últimos
   días pesan más que los anteriores.                              */
export function calcularEnergia(evaluaciones, entradas) {
  const dias = evaluaciones.slice(0, DIAS_ENERGIA);
  if (!dias.length) return 50;

  let suma = 0, pesos = 0;
  dias.forEach((d, i) => {
    const peso = DIAS_ENERGIA - i; // hoy pesa 3, ayer 2, anteayer 1
    const pasos = d.objetivos.find((o) => o.id === 'pasos');
    const ratio = pasos?.objetivo ? clamp((pasos.valor ?? 0) / pasos.objetivo, 0, 1.2) : 0;
    const entreno = (entradas[d.fecha]?.entrenoMin ?? 0) > 0 ? 0.25 : 0;
    suma += (ratio * 0.75 + entreno) * peso;
    pesos += peso;
  });

  const sueno = entradas[dias[0].fecha]?.suenoHoras;
  const bonoSueno = sueno == null ? 0 : clamp((sueno - 6) * 4, -8, 8);

  return Math.round(clamp((suma / pesos) * 100 + bonoSueno, 0, 100));
}

/* ---------- 2 · Forma (0-100) ----------
   Cumplimiento sostenido del pacto en las últimas dos semanas.
   Se usa la proporción de objetivos, no el aprobado/suspenso: fallar
   por poco se nota menos que no hacer nada.                        */
export function calcularForma(evaluaciones) {
  const dias = evaluaciones.slice(0, DIAS_FORMA).filter((d) => !d.abierto);
  if (!dias.length) return 50;

  let suma = 0, pesos = 0;
  dias.forEach((d, i) => {
    const peso = DIAS_FORMA - i;
    suma += d.proporcion * peso;
    pesos += peso;
  });
  return Math.round(clamp((suma / pesos) * 100, 0, 100));
}

/* ---------- 3 · Ánimo (-50 a +50) ---------- */
export function calcularAnimo({ evaluaciones, entradas, energia, forma }) {
  const hoy = evaluaciones[0];
  const e = entradas[hoy?.fecha] ?? {};

  const aporteSueno = e.suenoHoras == null ? 0 : clamp((e.suenoHoras - 7) * 5, -20, 10);
  const aporteEstres = e.estres == null ? 0 : -(clamp(e.estres, 0, 100) / 100) * 20;
  const aporteEnergia = ((clamp(energia, 0, 100) - 50) / 50) * 15;
  const aporteForma = forma > 70 ? 10 : 0;

  // El descanso importa: saltárselo repetidamente pasa factura.
  const descansosRotos = evaluaciones
    .slice(0, 7)
    .filter((d) => d.descansoRespetado === false).length;
  const aporteDescanso = descansosRotos >= 2 ? -10 : 0;

  return {
    valor: Math.round(clamp(
      aporteSueno + aporteEstres + aporteEnergia + aporteForma + aporteDescanso, -50, 50)),
    descansosRotos,
  };
}

/* ---------- 4 · Racha y comodines ----------
   Los comodines se ganan cumpliendo, se gastan solos al fallar, y
   nunca cubren una semana entera.                                  */
export function calcularRachaYComodines(evaluaciones) {
  const cronologico = [...evaluaciones].reverse(); // de antiguo a reciente
  let racha = 0, mejorRacha = 0, comodines = 0;
  const gastados = [];
  let seguidosParaComodin = 0;
  /* Cuántos días de la racha VIVA los salvó un comodín. Se enseñan como
     corazones partidos: la racha sigue, pero no se finge que ese día se
     cumplió. Al romperse la racha vuelve a cero, como ella. */
  let gastadosRacha = 0;

  for (const d of cronologico) {
    if (d.abierto) continue;
    if (d.cumple) {
      racha++;
      seguidosParaComodin++;
      if (seguidosParaComodin >= DIAS_PARA_COMODIN) {
        comodines = Math.min(MAX_COMODINES, comodines + 1);
        seguidosParaComodin = 0;
      }
    } else if (comodines > 0) {
      comodines--;
      gastados.push(d.fecha);
      racha++; // el comodín salva la racha
      gastadosRacha++;
    } else {
      racha = 0;
      seguidosParaComodin = 0;
      gastadosRacha = 0;
    }
    mejorRacha = Math.max(mejorRacha, racha);
  }
  return { racha, mejorRacha, comodines, gastados, gastadosRacha };
}

/* ---------- 5 · XP y nivel ----------
   Se recalcula entero desde el historial, no se acumula: así editar
   un día pasado no descuadra nada.
   Fallar una semana entera baja un nivel, con suelo.               */
export function calcularNivel({ pacto, entradas, evaluaciones, hoy = hoyISO(), hitos = [] }) {
  const cerrados = evaluaciones.filter((d) => !d.abierto);
  let xp = cerrados.filter((d) => d.cumple).length * XP_DIA_CUMPLIDO
         + hitos.length * XP_POR_HITO;

  // bonus por semanas completas y penalización por semanas perdidas.
  // Solo se miran semanas enteras que caben dentro del historial cerrado:
  // una semana a medias no puede darse por perdida.
  let semanasPerdidas = 0;
  for (let i = 0; (i + 1) * 7 <= cerrados.length; i++) {
    const fin = diasAtras(hoy, i * 7);
    const s = evaluarSemana({ pacto, entradas, finISO: fin, hoy });
    if (s.completa) xp += XP_SEMANA_COMPLETA;
    if (s.perdida) semanasPerdidas++;
  }

  let nivel = NIVELES.filter((n) => xp >= n.min).pop() ?? NIVELES[0];
  let numero = nivel.nivel;
  if (semanasPerdidas > 0) {
    // El suelo protege lo conquistado; nunca puede empujar hacia arriba.
    // Sin el min(), un usuario recién llegado "ascendería" al nivel suelo.
    const suelo = Math.min(numero, NIVEL_SUELO);
    numero = Math.max(suelo, numero - semanasPerdidas);
    nivel = NIVELES.find((n) => n.nivel === numero) ?? nivel;
  }

  const siguiente = NIVELES.find((n) => n.nivel === numero + 1);
  const progreso = siguiente
    ? clamp((xp - nivel.min) / (siguiente.min - nivel.min), 0, 1)
    : 1;

  return {
    ...nivel,
    nivel: numero,
    xp,
    progreso,
    xpSiguiente: siguiente?.min ?? null,
    semanasPerdidas,
  };
}

/* ---------- 5b · Hitos ----------
   Un hito conseguido no se pierde nunca: basta con que se cumpliera en
   CUALQUIER día del historial. Por eso se recorre entero en vez de mirar
   solo hoy.                                                            */
export function calcularHitos({ evaluaciones, entradas, perfil }) {
  const logrados = new Set();
  evaluaciones.forEach((d, i) => {
    const contexto = {
      entrada: entradas[d.fecha],
      cumple: d.cumple,
      racha: rachaDesde(evaluaciones.slice(i)),
      usuario: perfil,
    };
    HITOS.forEach((h) => {
      try { if (h.check(contexto)) logrados.add(h.id); } catch { /* nada */ }
    });
  });
  return [...logrados];
}

function rachaDesde(evaluaciones) {
  let n = 0;
  for (const d of evaluaciones) {
    if (d.abierto) continue;
    if (!d.cumple) break;
    n++;
  }
  return n;
}

/* ---------- 6 · Estado completo ---------- */
export function calcularEstado({ pacto, entradas, perfil, carino = [], ahora = Date.now(), hoy = hoyISO() }) {
  // Nunca mirar más atrás del día en que se creó el pacto: antes de existir
  // no se podía incumplir. Sin esto, un usuario nuevo arranca con semanas
  // falladas a la espalda.
  const dias = Math.max(1, Math.min(60, diasDesde(pacto?.creado, hoy) + 1));
  const evaluaciones = evaluarDias({ pacto, entradas, desde: hoy, dias, hoy });

  const energia = calcularEnergia(evaluaciones, entradas);
  const forma = calcularForma(evaluaciones);
  const animo = calcularAnimo({ evaluaciones, entradas, energia, forma });
  const rachas = calcularRachaYComodines(evaluaciones);
  const felicidad = calcularFelicidad({ evaluaciones, entradas, carino, ahora });
  const hitosDesbloqueados = calcularHitos({ evaluaciones, entradas, perfil });
  const nivel = calcularNivel({ pacto, entradas, evaluaciones, hoy, hitos: hitosDesbloqueados });

  const indice = evaluaciones.findIndex((d) => d.hayDatos);
  const abandono = indice === -1 ? evaluaciones.length : indice;

  return {
    evaluaciones,
    hoy: evaluaciones[0],
    energia,
    forma,
    animo: animo.valor,
    descansosRotos: animo.descansosRotos,
    ...rachas,
    nivel,
    felicidad: felicidad.valor,
    felicidadDetalle: felicidad.detalle,
    hitosDesbloqueados,
    abandono,
    dormido: abandono >= 2,
  };
}

/* ---------- 7 · Traducción a lo que se dibuja ----------
   Las cinco siluetas ya no hablan del IMC del usuario: hablan de sus
   hábitos. Ver la tabla de MECANICA.md.                            */
export function estadoVisual(estado, entradas = {}, pacto = null) {
  const { energia, forma, animo, abandono, nivel } = estado;

  let cuerpo;
  if (abandono >= DIAS_ABANDONO) {
    cuerpo = 'esqueletico';           // lleva mucho sin nada
  } else if (forma >= 85 && entrenosRecientes(estado, entradas) >= 3) {
    cuerpo = 'hipertrofiado';         // cumple con creces, con fuerza
  } else if (forma >= 70) {
    cuerpo = 'fit';
  } else if (forma < 35 && comeDeMas(estado, entradas, pacto)) {
    cuerpo = 'gordo';                 // por encima del pacto y poco movimiento
  } else {
    cuerpo = 'kawaii';
  }

  const pose = estado.dormido
    ? 'cansado'
    : energia <= 20 ? 'cansado'
    : energia <= 50 ? 'normal'
    : energia <= 80 ? 'entrenado'
    : 'energico';

  const cara = animo <= -20 ? 'enfadado' : animo < 20 ? 'neutro' : 'feliz';

  return { cuerpo, pose, cara, nivel: nivel.nivel };
}

function entrenosRecientes(estado, entradas) {
  return estado.evaluaciones
    .slice(0, 14)
    .filter((d) => (entradas[d.fecha]?.entrenoMin ?? 0) > 0).length;
}

function comeDeMas(estado, entradas, pacto) {
  if (!pacto?.comidaKcal) return true; // sin objetivo de comida, manda la forma
  const dias = estado.evaluaciones
    .slice(0, 7)
    .map((d) => entradas[d.fecha]?.comidaKcal)
    .filter((v) => v != null);
  if (!dias.length) return false;
  const media = dias.reduce((a, b) => a + b, 0) / dias.length;
  return media > pacto.comidaKcal * 1.1;
}
