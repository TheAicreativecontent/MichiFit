/* ============================================================
   MichiFit · persistencia
   Local-first. Hoy sobre localStorage; la interfaz está pensada para
   poder cambiar a IndexedDB tocando solo este archivo.
   ============================================================ */

const CLAVE = 'michifit.v2';

const VACIO = {
  perfil: {
    sexo: 'hombre',
    edad: null,
    altura: null,
    pesoInicial: null,
    pesoActual: null,
    pesoMeta: null,
    reposoReal: null,   // media real del reloj, si la tiene
    totalReal: null,
    proteinaPorKg: 2,
    deficitObjetivo: 500,
  },
  pacto: null,
  entradas: {},         // { 'AAAA-MM-DD': { pasos, entrenoMin, comidaKcal, ... } }
};

export function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return estructuraCompleta(VACIO);
    return estructuraCompleta(JSON.parse(crudo));
  } catch {
    // localStorage puede fallar en ventana privada o con cookies bloqueadas.
    return estructuraCompleta(VACIO);
  }
}

export function guardar(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
    return true;
  } catch {
    return false;
  }
}

export function reiniciar() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    /* nada que hacer */
  }
  return estructuraCompleta(VACIO);
}

/* Rellena lo que falte, para que una versión vieja guardada no rompa
   la app al añadir campos nuevos. */
function estructuraCompleta(d) {
  return {
    ...VACIO,
    ...d,
    perfil: { ...VACIO.perfil, ...(d.perfil ?? {}) },
    entradas: d.entradas ?? {},
  };
}

/* --- exportación --- */
export function aCSV(entradas) {
  const cabecera = ['fecha', 'pasos', 'entrenoMin', 'comidaKcal', 'peso', 'suenoHoras', 'estres'];
  const filas = Object.keys(entradas)
    .sort()
    .map((f) => cabecera.map((c) => (c === 'fecha' ? f : entradas[f]?.[c] ?? '')).join(','));
  return [cabecera.join(','), ...filas].join('\n');
}

export function descargar(nombre, contenido, tipo = 'text/csv') {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
