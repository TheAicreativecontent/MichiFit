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

console.log('\n### ganar peso sigue sin estar, y a proposito');
{
  /* Mientras el motor recorte los superavit a cero, ofrecer «ganar
     peso» seria un boton que no hace nada. El dia que se implemente,
     esta comprobacion se cae y hay que quitarla a mano. */
  comprobar(!K.OBJETIVOS.some((o) => o.id === 'ganar'),
    'no se ofrece «ganar peso» todavia');
  const conSuperavit = C.planEnergetico({ ...PERFIL, deficitObjetivo: -300 }, PACTO);
  comprobar(conSuperavit.comida <= conSuperavit.total,
    'el motor sigue recortando los superavit (por eso falta)');
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
