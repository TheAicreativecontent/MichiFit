/* Comprueba los cuatro suelos de seguridad de `MECANICA.md` §10.

   Son la promesa mas seria que hace la app: «no premia comer menos de
   lo sano ni bajar de un IMC seguro». Un suelo que deja de saltar no da
   ningun error — simplemente nadie se entera de nada, que es la peor
   forma de fallar.

   El de la grasa se anadio el 2026-09-11 al ver que era la unica macro
   que bajaba sin freno: la proteina va fija en 2 g por kilo de meta y
   los carbos son lo que sobra, asi que todo el recorte cae sobre ella.
   La app avisa pero NO cambia el reparto (decision de Alberto, ver
   `DECISIONS.md`), asi que el aviso es lo unico que hay.

   Uso:  node pruebas/avisos.mjs        (desde la raiz)
*/
const C = await import('../src/engine/calculos.js');
const K = await import('../src/engine/constantes.js');

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

const tipos = (perfil, comidaKcal, kgPorSemana = null) =>
  C.avisosDeSeguridad({ perfil, comidaKcal, kgPorSemana }).map((a) => a.tipo);

/* Alberto, con sus numeros de verdad del 2026-09-11. */
const ALBERTO = { sexo: 'hombre', edad: 45, altura: 183, pesoActual: 84.4, pesoMeta: 80 };

console.log('\n### el suelo de grasa');
{
  const minimo = Math.round(ALBERTO.pesoMeta * K.GRASA_MINIMA_POR_KG);
  console.log('  peso meta %d kg -> minimo %d g de grasa', ALBERTO.pesoMeta, minimo);

  /* Con 1.698 kcal salen 47 g: justo por debajo. Con 1.794 salen 50 y
     no debe avisar. La frontera importa: un aviso que salta siempre es
     ruido, y uno que no salta nunca no sirve de nada. */
  comprobar(tipos(ALBERTO, 1698).includes('grasa'), '1.698 kcal (47 g de grasa): avisa');
  comprobar(!tipos(ALBERTO, 1794).includes('grasa'), '1.794 kcal (50 g de grasa): NO avisa');

  /* Sin peso meta no se puede calcular el minimo: mejor callarse que
     inventarse un numero. Pasa de verdad en la bienvenida a medio
     rellenar. */
  comprobar(!tipos({ sexo: 'hombre' }, 1200).includes('grasa'),
    'sin peso meta no se inventa un minimo');

  /* Y el texto tiene que existir en los cinco idiomas, con sus tres
     huecos. Una clave que falta cae al espanol sin avisar en produccion. */
  const av = C.avisosDeSeguridad({ perfil: ALBERTO, comidaKcal: 1698, kgPorSemana: null })
    .find((a) => a.tipo === 'grasa');
  comprobar(av && ['g', 'min', 'porKg'].every((k) => av.vars[k] != null),
    'el aviso trae g, min y porKg');
  for (const idioma of ['es', 'en', 'th', 'zh', 'ja']) {
    const d = (await import(`../src/i18n/${idioma}.js`)).default;
    const txt = d.avisos?.grasa;
    const huecos = txt ? [...txt.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort() : [];
    comprobar(Boolean(txt) && huecos.join() === 'g,min,porKg',
      `${idioma}: existe y usa los tres huecos`);
  }
}

console.log('\n### los tres suelos que ya estaban');
{
  comprobar(tipos({ ...ALBERTO, pesoMeta: 55 }, 1800).includes('peso'),
    'una meta de 55 kg para 183 cm avisa por IMC');
  comprobar(!tipos(ALBERTO, 1800).includes('peso'),
    'una meta de 80 kg para 183 cm no avisa');

  comprobar(tipos(ALBERTO, K.KCAL_MINIMAS.hombre - 1).includes('kcal'),
    `por debajo de ${K.KCAL_MINIMAS.hombre} kcal avisa`);
  comprobar(!tipos(ALBERTO, K.KCAL_MINIMAS.hombre + 200).includes('kcal'),
    'por encima del suelo no avisa');

  const rapido = ALBERTO.pesoActual * K.RITMO_MAXIMO_SEMANAL * 1.5;
  comprobar(tipos(ALBERTO, 1800, -rapido).includes('ritmo'),
    'bajar mas rapido de lo sano avisa');
  comprobar(!tipos(ALBERTO, 1800, -0.4).includes('ritmo'),
    'bajar 0,4 kg por semana no avisa');
}

console.log('\n### la grasa NO se toca, solo se avisa');
{
  /* Decision de Alberto: la app dice el dato y no cambia el reparto. Si
     algun dia alguien mete un suelo duro en `macros()`, esto se cae y
     habra que decidirlo a proposito, no de refilon. */
  const m = C.macros({ kcal: 1698, pesoMeta: 80, proteinaPorKg: 2 });
  comprobar(m.grasa === Math.round(1698 * 0.25 / 9),
    `la grasa sigue siendo el 25% de las calorias (${m.grasa} g)`);
  comprobar(m.proteina === 160, `la proteina sigue en 2 g por kilo de meta (${m.proteina} g)`);
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: los cuatro suelos avisan cuando toca.');
process.exit(fallos ? 1 : 0);
