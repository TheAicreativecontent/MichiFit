/* ============================================================
   MichiFit · traer el progreso de la app antigua
   La primera MichiFit (la de synastry.site) exporta un CSV. Esto lo lee
   y lo convierte al formato de entradas de esta app.

   Qué se trae y qué no:

     peso_kg        -> peso            la gráfica de progreso lo usa entero
     pasos          -> pasos
     kcal_comidas   -> comidaKcal
     proteina/carbos/grasa -> macros
     entrenos       -> entrenoMin      sumando los minutos de cada sesión

     sueno          NO se convierte a horas. En el CSV va de 44 a 85: es la
                    PUNTUACIÓN de sueño de Garmin, no horas dormidas.
                    Meterla en `sueno.horas` diría que dormiste 66 horas.
     fc_reposo, estres, kcal_actividad
                    esta app no los usa, pero se guardan en `importado`
                    para no perderlos. Si algún día hacen falta, están.

   La fusión NUNCA pisa lo que ya tienes apuntado: solo rellena huecos.
   Un import no puede borrarte trabajo.
   ============================================================ */

/* Parte una línea de CSV respetando las comillas. Con este archivo
   bastaría con `split(',')`, pero un exportador cualquiera puede meter
   una coma dentro de un campo y entonces se descoloca todo en silencio. */
function partir(linea) {
  const campos = [];
  let actual = '', dentro = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (dentro && linea[i + 1] === '"') { actual += '"'; i++; }
      else dentro = !dentro;
    } else if (c === ',' && !dentro) {
      campos.push(actual); actual = '';
    } else actual += c;
  }
  campos.push(actual);
  return campos.map((s) => s.trim());
}

const num = (s) => {
  if (s == null || s === '') return null;
  const n = Number(String(s).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

/* "entreno 30min/519kcal | entreno 0min/0kcal" -> 30
   Se suman todas las sesiones del día. Las de 0 minutos se cuentan
   igual: sumar cero no molesta y evita casos raros. */
export function minutosDeEntreno(texto) {
  if (!texto) return null;
  const encontrados = [...String(texto).matchAll(/(\d+(?:[.,]\d+)?)\s*min/gi)];
  if (!encontrados.length) return null;
  return encontrados.reduce((s, m) => s + Number(m[1].replace(',', '.')), 0);
}

const sinNulos = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null));

const ES_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/* Lee el CSV entero. Devuelve las entradas y un resumen para poder
   enseñar qué se va a importar ANTES de tocar nada. */
export function leerCSV(texto) {
  const lineas = String(texto).split(/\r?\n/).filter((l) => l.trim());
  if (!lineas.length) return { entradas: {}, resumen: vacio('El archivo está vacío.') };

  const cab = partir(lineas[0]).map((c) => c.toLowerCase().replace(/^﻿/, ''));
  if (!cab.includes('fecha')) {
    return { entradas: {}, resumen: vacio('No parece un CSV de MichiFit: no encuentro la columna «fecha».') };
  }

  const entradas = {};
  let descartadas = 0;
  const fechas = [];

  for (const linea of lineas.slice(1)) {
    const c = partir(linea);
    const f = Object.fromEntries(cab.map((k, i) => [k, c[i] ?? '']));
    if (!ES_FECHA.test(f.fecha)) { descartadas++; continue; }

    const macros = sinNulos({
      prot: num(f.proteina_g), carb: num(f.carbos_g), grasa: num(f.grasa_g),
    });
    const hayMacros = Object.keys(macros).length > 0;

    /* Lo que esta app no usa pero el CSV traía. Se guarda para que un
       import no pierda información, sin los huecos: un `null` guardado no
       dice nada que no diga la ausencia del campo, y ensucia la copia. */
    const extra = sinNulos({
      suenoPuntos: num(f.sueno),
      fcReposo: num(f.fc_reposo),
      estres: num(f.estres),
      kcalActividad: num(f.kcal_actividad),
    });
    const hayExtra = Object.keys(extra).length > 0;

    const entrada = {
      peso: num(f.peso_kg),
      pasos: num(f.pasos),
      comidaKcal: num(f.kcal_comidas),
      entrenoMin: minutosDeEntreno(f.entrenos),
      ...(hayMacros ? { macros } : {}),
      ...(hayExtra ? { importado: extra } : {}),
    };

    /* Las filas sin un solo dato no se importan: crearían días vacíos
       que el motor contaría como fallados. */
    const util = Object.entries(entrada)
      .some(([k, v]) => v != null && !(k === 'importado'));
    if (!util) { descartadas++; continue; }

    entradas[f.fecha] = Object.fromEntries(
      Object.entries(entrada).filter(([, v]) => v != null));
    fechas.push(f.fecha);
  }

  fechas.sort();
  return {
    entradas,
    resumen: {
      ok: fechas.length > 0,
      dias: fechas.length,
      descartadas,
      desde: fechas[0] ?? null,
      hasta: fechas[fechas.length - 1] ?? null,
      pesos: Object.values(entradas).filter((e) => e.peso != null).length,
      aviso: null,
    },
  };
}

function vacio(aviso) {
  return { ok: false, dias: 0, descartadas: 0, desde: null, hasta: null, pesos: 0, aviso };
}

/* Fusiona sin pisar. Campo a campo: si ya tenías un valor apuntado, se
   queda el tuyo. Devuelve también cuántos días eran nuevos y cuántos
   solo se completaron, para poder contárselo al usuario. */
export function fusionar(actuales = {}, nuevas = {}) {
  const salida = { ...actuales };
  let nuevos = 0, completados = 0, sinTocar = 0;

  for (const [fecha, entrada] of Object.entries(nuevas)) {
    const previa = actuales[fecha];
    if (!previa) {
      salida[fecha] = entrada;
      nuevos++;
      continue;
    }
    const fundida = { ...previa };
    let cambio = false;
    for (const [k, v] of Object.entries(entrada)) {
      if (fundida[k] == null) { fundida[k] = v; cambio = true; }
    }
    salida[fecha] = fundida;
    if (cambio) completados++; else sinTocar++;
  }
  return { entradas: salida, nuevos, completados, sinTocar };
}
