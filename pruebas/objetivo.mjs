/* Comprueba que elegir objetivo cambia las calorias de VERDAD.

   Un boton que dice «mantenerme» mientras la app te sigue poniendo 500
   de deficit miente, y eso es peor que no tener el boton. Aqui se
   comprueba que cada objetivo mueve el numero que dice mover.

   Y de paso, que no queda ni una mencion a «pacto» en el texto visible
   de ninguna de las cinco lenguas: un renombrado a medias deja la app
   diciendo dos nombres para la misma cosa, que es peor que el viejo.

   Uso:  node pruebas/objetivo.mjs        (desde la raiz)
*/
const C = await import('../src/engine/calculos.js');
const P = await import('../src/engine/pacto.js');
const K = await import('../src/engine/constantes.js');

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

/* El perfil y el pacto reales de Alberto, 2026-09-11. */
const PERFIL = { sexo: 'hombre', edad: 45, altura: 183, pesoActual: 84.4, pesoMeta: 80 };
const PACTO = (() => {
  const p = P.pactoPorDefecto({ metaPasos: 8000 });
  for (const d of ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']) {
    const e = ['lun', 'mie', 'vie'].includes(d);
    p.dias[d] = { entreno: e, minEntreno: e ? 45 : 0, pasos: 8000 };
  }
  return p;
})();

console.log('\n### cada objetivo mueve las calorias');
{
  const mantenimiento = C.planEnergetico(PERFIL, PACTO).total;
  console.log('  mantenimiento con 8.000 pasos y 3x45: %d kcal\n', mantenimiento);

  const comidaCon = (id) => {
    const o = K.OBJETIVOS.find((x) => x.id === id);
    const perfil = { ...PERFIL };
    if (o.deficit != null) perfil.deficitObjetivo = o.deficit;
    return C.planEnergetico(perfil, PACTO).comida;
  };

  const perder = comidaCon('perder');
  const mantener = comidaCon('mantener');
  const forma = comidaCon('forma');

  comprobar(perder < mantenimiento, `perder peso come menos que el mantenimiento (${perder})`);
  comprobar(mantener === mantenimiento, `mantenerme come el mantenimiento exacto (${mantener})`);
  comprobar(forma === mantenimiento, `estar mas en forma, igual (${forma})`);
  comprobar(perder !== mantener, 'perder y mantener NO dan el mismo numero');

  /* «Otra cosa» no toca nada: se respeta lo que el usuario tenga puesto.
     Si algun dia empieza a escribir un deficit, el boton estaria
     mintiendo al reves. */
  const suyo = { ...PERFIL, deficitObjetivo: 320 };
  const o = K.OBJETIVOS.find((x) => x.id === 'otro');
  comprobar(o.deficit === null, '«otra cosa» declara que no toca el deficit');
  comprobar(C.planEnergetico(suyo, PACTO).comida === C.planEnergetico(suyo, PACTO).comida
            && suyo.deficitObjetivo === 320, 'y deja el deficit del usuario donde estaba');
}

console.log('\n### ganar peso: comer MAS, y con su propio techo');
{
  const mantenimiento = C.planEnergetico(PERFIL, PACTO).total;

  const ganar = K.OBJETIVOS.find((o) => o.id === 'ganar');
  comprobar(Boolean(ganar), 'el objetivo «ganar» esta en la lista');
  comprobar(ganar.deficit < 0, `pide superavit y no deficit (${ganar.deficit})`);
  comprobar(ganar.sentido === 'mas', 'y su sentido de comida es «mas»');

  const perfil = { ...PERFIL, objetivo: 'ganar', deficitObjetivo: ganar.deficit };
  const plan = C.planEnergetico(perfil, PACTO);
  comprobar(plan.comida > mantenimiento,
    `come MAS que el mantenimiento (${plan.comida} contra ${mantenimiento})`);
  comprobar(plan.kgPorSemana > 0, `y la prevision sube (${plan.kgPorSemana.toFixed(2)} kg/semana)`);

  /* El techo del superavit: hermano del 20% del deficit. Sin el,
     escribir -2000 en Ajustes proponia comer 4.242 kcal. */
  const pasado = C.planEnergetico({ ...perfil, deficitObjetivo: -2000 }, PACTO);
  const tope = Math.round(mantenimiento * K.SUPERAVIT_MAXIMO);
  comprobar(pasado.recorte === 'techo', 'pedir un superavit enorme se recorta');
  comprobar(pasado.comida === mantenimiento + tope,
    `y se queda en mantenimiento + ${tope} (${pasado.comida})`);
  comprobar(K.SUPERAVIT_MAXIMO < K.DEFICIT_MAXIMO,
    `el techo de superavit (${K.SUPERAVIT_MAXIMO}) es mas estrecho que el de deficit (${K.DEFICIT_MAXIMO})`);

  /* El simulador le decia «no alcanzable» a cualquiera que quisiera
     engordar, porque exigia restante > 0 y ritmo < 0. */
  const subiendo = C.simular({ perfil: { ...perfil, pesoActual: 60, pesoMeta: 70 },
                               pasos: 8000, minEntrenoSemana: 135, comidaKcal: 3000 });
  comprobar(subiendo.alcanzable, 'el simulador ya da alcanzable una meta MAS ALTA');
  comprobar(subiendo.semanas > 0, `y calcula las semanas (${Math.round(subiendo.semanas)})`);
  const bajando = C.simular({ perfil: { ...PERFIL, pesoActual: 90, pesoMeta: 80 },
                              pasos: 8000, minEntrenoSemana: 135, comidaKcal: 1700 });
  comprobar(bajando.alcanzable, 'y sigue funcionando para adelgazar');
  const alReves = C.simular({ perfil: { ...perfil, pesoActual: 60, pesoMeta: 70 },
                              pasos: 8000, minEntrenoSemana: 135, comidaKcal: 1200 });
  comprobar(!alReves.alcanzable, 'querer subir comiendo de menos NO es alcanzable');
}

console.log('\n### y el michi cuenta el dia al reves');
{
  const { evaluarDia } = await import('../src/engine/pacto.js');
  const hoy = '2026-09-11';
  const dia = (sentido, kcal) => evaluarDia({
    pacto: { ...PACTO, comidaKcal: 2600, comidaSentido: sentido },
    entrada: { pasos: 9000, entrenoMin: 45, comidaKcal: kcal, sueno: { horas: 8 } },
    fecha: hoy, hoy,
  }).objetivos.find((o) => o.id === 'comida');

  /* Todo esto en una linea: 2.000 kcal con objetivo 2.600 es un dia
     CUMPLIDO adelgazando y FALLADO en volumen. */
  comprobar(dia('menos', 2000).cumplido, 'adelgazando: comer 2.000 de 2.600 cumple');
  comprobar(!dia('mas', 2000).cumplido, 'ganando: comer 2.000 de 2.600 NO cumple');
  comprobar(dia('mas', 2600).cumplido, 'ganando: llegar a 2.600 cumple');
  comprobar(!dia('menos', 3600).cumplido, 'adelgazando: pasarse a 3.600 no cumple');
  comprobar(dia('mas', 3600).cumplido, 'ganando: pasarse a 3.600 si cumple');

  comprobar(dia('mas', 2600 * 0.95).cumplido, 'ganando: quedarse un 5% corto entra en el margen');
  comprobar(!dia('mas', 2600 * 0.80).cumplido, 'ganando: un 20% corto ya no cumple');
  comprobar(dia('mas', 2600 * 0.80).rompeElDia === false, '...pero no tumba el dia');
  comprobar(dia('mas', 2600 * 0.60).rompeElDia, 'ganando: un 40% corto si lo tumba');

  /* Un pacto guardado antes de que esto existiera no trae `comidaSentido`:
     tiene que seguir comportandose como siempre. */
  const viejo = evaluarDia({
    pacto: { ...PACTO, comidaKcal: 2600 },
    entrada: { pasos: 9000, entrenoMin: 45, comidaKcal: 2000, sueno: { horas: 8 } },
    fecha: hoy, hoy,
  }).objetivos.find((o) => o.id === 'comida');
  comprobar(viejo.cumplido, 'un pacto viejo sin sentido se comporta como antes');
}


console.log('\n### el renombrado esta entero');
{
  const busca = { es: /pacto/i, en: /\bpact\b/i, th: /ข้อตกลง/, zh: /约定/, ja: /約束/ };
  for (const [idioma, re] of Object.entries(busca)) {
    const d = (await import(`../src/i18n/${idioma}.js`)).default;
    const malos = [];
    const rec = (o, pre = '') => {
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'string' && re.test(v)) malos.push(pre + k);
        else if (v && typeof v === 'object') rec(v, pre + k + '.');
      }
    };
    rec(d);
    comprobar(malos.length === 0, `${idioma}: sin «pacto» en el texto (${malos.join(', ') || 'limpio'})`);
    comprobar(Boolean(d.meta?.titulo && d.meta?.perder && d.meta?.otro),
      `${idioma}: tiene los textos de los objetivos`);
  }
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: los objetivos cambian lo que dicen cambiar.');
process.exit(fallos ? 1 : 0);
