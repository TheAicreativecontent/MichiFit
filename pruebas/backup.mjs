/* Comprueba la copia de seguridad completa (`aJSON` / `leerBackup` en
   `datos/almacen.js`), que entró el 2026-09-22 para defenderse de que
   el móvil borre `localStorage` sin avisar (ver `DECISIONS.md`).

   Tres cosas que tienen que ser ciertas:
     1. lo que se exporta se puede volver a leer entero, tal cual;
     2. un archivo que no es una copia de MichiFit se rechaza con
        claridad, sin reventar la app;
     3. una copia con un campo raro (a mano, o de una versión vieja) se
        limpia igual que ya limpia `leer()` lo que sale de localStorage
        — restaurar una copia extraña no puede dejar la app en blanco.

   Uso:  node pruebas/backup.mjs        (desde la raiz)
*/
const A = await import('../src/datos/almacen.js');

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

const DATOS = {
  perfil: {
    sexo: 'mujer', edad: 33, altura: 165, pesoInicial: 70, pesoActual: 66,
    pesoMeta: 60, reposoReal: null, totalReal: null, proteinaPorKg: 2,
    deficitObjetivo: 500, objetivo: 'perder', objetivoTexto: '', escalaTexto: 1,
    aparato: { estilo: 'pixel', color: 'verde', michi: 'blanco' },
  },
  pacto: { dias: { lun: { entreno: true, minEntreno: 30, pasos: 6000 } },
           comidaKcal: 1600, comidaSentido: 'menos', creado: '2026-08-01' },
  entradas: {
    '2026-09-15': { pasos: 7000 },
    '2026-09-16': { peso: 66, macros: { prot: 90, carb: 120, grasa: 40 } },
  },
  carino: [1758000000000],
  cuidados: { agua: 1758000000000, orden: 1758000000000 },
  nivelVisto: 2,
  loreVisto: true,
};

console.log('\n### lo que se exporta se puede leer entero de vuelta');
{
  const json = A.aJSON(DATOS, '0.7.7');
  const r = A.leerBackup(json);
  comprobar(r.ok, 'leerBackup acepta lo que aJSON acaba de escribir');
  comprobar(r.dias === 2, `trae los 2 días de entradas (${r.dias})`);
  comprobar(JSON.stringify(r.datos.perfil) === JSON.stringify(DATOS.perfil),
    'el perfil vuelve exactamente igual, aparato incluido');
  comprobar(JSON.stringify(r.datos.entradas) === JSON.stringify(DATOS.entradas),
    'las entradas vuelven exactamente iguales, macros incluidas');
  comprobar(r.datos.nivelVisto === 2 && r.datos.loreVisto === true,
    'nivelVisto y loreVisto tambien viajan');
  comprobar(typeof r.exportado === 'string' && r.exportado.length > 0,
    `guarda cuando se exporto (${r.exportado})`);
}

console.log('\n### lo que no es una copia de MichiFit se rechaza');
{
  comprobar(A.leerBackup('esto no es json').ok === false, 'texto suelto -> rechazado');
  comprobar(A.leerBackup('{}').ok === false, 'objeto vacio -> rechazado');
  comprobar(A.leerBackup(JSON.stringify({ app: 'OtraApp', datos: DATOS })).ok === false,
    'un JSON de otra app, aunque tenga la forma -> rechazado');
  comprobar(A.leerBackup(A.aCSV(DATOS.entradas)).ok === false,
    'el CSV de siempre (no es JSON) -> rechazado, no revienta');
  comprobar(A.leerBackup(JSON.stringify({ app: 'MichiFit', datos: 'no soy un objeto' })).ok === false,
    '"datos" que no es un objeto -> rechazado');
}

console.log('\n### una copia con campos raros se limpia, no rompe la app');
{
  // Como una version futura que guarde algo nuevo, o un campo tocado a mano.
  const raro = A.leerBackup(JSON.stringify({
    app: 'MichiFit',
    datos: { perfil: 'no soy un perfil', entradas: 'tampoco', pacto: { dias: 'ni yo' },
             carino: 'ni yo', algoQueNoExisteAun: 42 },
  }));
  comprobar(raro.ok, 'se acepta igualmente (la forma exterior es correcta)');
  comprobar(raro.datos.perfil && typeof raro.datos.perfil === 'object' && raro.datos.perfil.sexo === 'hombre',
    'un perfil que no era un objeto cae al perfil por defecto, no revienta');
  comprobar(typeof raro.datos.entradas === 'object' && !Array.isArray(raro.datos.entradas),
    'unas entradas que no eran un objeto caen a {}');
  comprobar(raro.datos.pacto === null, 'un pacto sin sus días válidos cae a null (hay que rehacerlo)');
  comprobar(Array.isArray(raro.datos.carino) && raro.datos.carino.length === 0,
    'un carino que no era lista cae a []');
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: la copia de seguridad va y vuelve entera, y lo que no lo es se rechaza sin romper nada.');
process.exit(fallos ? 1 : 0);
