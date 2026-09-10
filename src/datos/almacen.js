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
    /* Que quiere conseguir: 'perder' | 'mantener' | 'forma' | 'otro'.
       Lo primero de la pantalla «Mi objetivo». Con 'otro', lo escribe
       el usuario en `objetivoTexto` y no toca ninguna cuenta. */
    objetivo: 'perder',
    objetivoTexto: '',
    escalaTexto: 1,   // tamano de la letra, ver estilos.css
    aparato: { estilo: 'pixel', color: 'naranja', michi: 'naranja' },
  },
  pacto: null,
  /* El ultimo nivel que el usuario ha visto. Sirve para celebrar una
     sola vez al subir: si no se guardara, cerrar y abrir la app volveria
     a disparar la celebracion. */
  nivelVisto: null,
  /* Si ya se ha visto la historia de Ninja. Se guarda con los datos y
     no en memoria por lo mismo que `nivelVisto`: cerrar y abrir la app
     volveria a contarla entera. */
  loreVisto: false,
  entradas: {},         // { 'AAAA-MM-DD': { pasos, entrenoMin, comidaKcal, ... } }
  carino: [],           // marcas de tiempo de los mimos, para la felicidad
  /* La última vez que se llenó el cuenco y que se recogió la casa. Dos
     números sueltos, no listas: no hay nada que acumular, solo cuándo
     fue. Ver `engine/cuidados.js`. */
  cuidados: { agua: null, orden: null },
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
   la app al añadir campos nuevos.

   Comprueba ADEMÁS que cada cosa sea del tipo que dice ser. Lo que sale
   de localStorage es texto que cualquiera puede editar desde la consola
   del navegador, y un `entradas` que fuera una cadena en vez de un
   objeto dejaba la app en blanco al arrancar, sin forma de recuperarla
   salvo borrando los datos. Ante la duda se usa el valor por defecto:
   perder un campo raro es mejor que no poder abrir la app. */
const esObjeto = (v) => v != null && typeof v === 'object' && !Array.isArray(v);

function estructuraCompleta(d) {
  const dat = esObjeto(d) ? d : {};
  return {
    ...VACIO,
    ...dat,
    perfil: { ...VACIO.perfil, ...(esObjeto(dat.perfil) ? dat.perfil : {}) },
    pacto: esObjeto(dat.pacto) && esObjeto(dat.pacto.dias) ? dat.pacto : null,
    entradas: esObjeto(dat.entradas) ? dat.entradas : {},
    carino: Array.isArray(dat.carino) ? dat.carino.filter(Number.isFinite) : [],
    cuidados: marcasDeCuidado(dat.cuidados),
    loreVisto: dat.loreVisto === true,
  };
}

/* Solo marcas de tiempo, y solo si son números de verdad. Una fecha
   futura tampoco vale: dejaría el cuenco lleno para siempre. */
function marcasDeCuidado(c) {
  const marca = (v) =>
    Number.isFinite(v) && v > 0 && v <= Date.now() ? v : null;
  const o = esObjeto(c) ? c : {};
  return { agua: marca(o.agua), orden: marca(o.orden) };
}

/* --- exportación --- */
export function aCSV(entradas) {
  const cabecera = ['fecha', 'pasos', 'entrenoMin', 'comidaKcal', 'peso',
                    'suenoHoras', 'prot', 'carb', 'grasa'];

  /* El sueno se guarda anidado y las macros tambien: leerlos planos
     dejaba esas columnas SIEMPRE vacias, y la copia de seguridad salia
     sin el sueno sin que nadie se enterara. */
  const valor = (e, c, fecha) => {
    if (c === 'fecha') return fecha;
    if (c === 'suenoHoras') return e?.sueno?.horas ?? e?.suenoHoras ?? '';
    if (c === 'prot' || c === 'carb' || c === 'grasa') return e?.macros?.[c] ?? '';
    return e?.[c] ?? '';
  };

  const filas = Object.keys(entradas).sort().map((f) =>
    cabecera.map((c) => escapar(valor(entradas[f], c, f))).join(','));

  return [cabecera.join(','), ...filas].join('\n');
}

/* Un campo de CSV con una coma, una comilla o un salto de linea rompe
   el archivo si no va entrecomillado. Hoy aqui solo hay numeros, pero
   el dia que se exporte el nombre de un ejercicio ya estara resuelto.

   Y el apostrofo delante de =, +, - o @ no es decoracion: Excel y
   Sheets tratan esas celdas como FORMULAS. Un texto que empiece por
   «=» puede acabar ejecutando algo en el ordenador de quien abra la
   copia. Se llama inyeccion de formulas y se evita asi. */
function escapar(v) {
  if (v == null) return '';
  let t = String(v);
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return /["\n\r,]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
}

export function descargar(nombre, contenido, tipo = 'text/csv') {
  /* El BOM hace que Excel abra el CSV como UTF-8: sin el, los acentos
     salen rotos al abrirlo en Windows.

     Pero SOLO en el CSV. Un .ics tiene que empezar exactamente por
     `BEGIN:VCALENDAR`, y con tres bytes de BOM por delante hay
     calendarios —Outlook entre ellos— que rechazan el archivo entero
     sin decir por que. */
  const bom = tipo.startsWith('text/csv') ? '﻿' : '';
  const blob = new Blob([bom + contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  /* Firefox ignora el clic si el enlace no esta en el documento. */
  document.body.appendChild(a);
  a.click();
  a.remove();
  /* La descarga arranca de forma asincrona: revocar la URL en la misma
     vuelta puede cancelarla antes de que empiece. */
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
