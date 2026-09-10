/* Comprueba las dos barras nuevas: el agua y el orden.

   Lo que de verdad se prueba aqui no es que la resta funcione, sino las
   tres promesas de `MECANICA.md` §10 que este bucle podria romper sin
   que nadie se enterase:

     1. que NO toquen la mecanica: mismo nivel, misma experiencia, mismo
        HAPPY y mismo cumplimiento con el cuenco lleno que vacio;
     2. que NO bajen de noche, igual que la barra HAPPY;
     3. que un toque lo arregle del todo, sin rastro ni acumulacion.

   Uso:  node pruebas/cuidados.mjs        (desde la raiz)
*/
const { calcularCuidados, atender, CACAS_MAX } = await import('../src/engine/cuidados.js');
const { calcularEstado } = await import('../src/engine/michi.js');
const { pactoPorDefecto } = await import('../src/engine/pacto.js');

const HORA = 3600_000;
let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

/* Un momento fijo y de dia, para que la prueba no dependa de cuando se
   lance: las 10:00, con el michi bien despierto. */
const aDia = (d, h = 10) => new Date(2026, 8, d, h, 0, 0).getTime();

console.log('\n### el agua baja con las horas de vigilia');
{
  const lleno = aDia(1, 8);
  const c0 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno });
  const c1 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno + 8 * HORA });
  const c2 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno + 40 * HORA });

  comprobar(c0.agua === 100, `recien llenado esta al 100 (${c0.agua})`);
  comprobar(c1.agua > 30 && c1.agua < 70, `a las 8 horas va por la mitad (${c1.agua})`);
  comprobar(c2.agua === 0, `pasado dia y medio esta vacio (${c2.agua})`);
  comprobar(c2.sed === true, 'y el michi tiene sed');
}

console.log('\n### de noche no baja');
{
  /* De 23:00 a 07:00 el michi duerme. Ocho horas de reloj que no
     deberian gastar nada de agua. */
  const noche = new Date(2026, 8, 1, 23, 0, 0).getTime();
  const antes = calcularCuidados({ cuidados: { agua: noche }, ahora: noche });
  const manana = calcularCuidados({ cuidados: { agua: noche }, ahora: noche + 8 * HORA });
  comprobar(antes.agua === manana.agua,
    `ocho horas de noche no gastan agua (${antes.agua} -> ${manana.agua})`);

  /* Pero ocho horas de dia si. */
  const dia = aDia(2, 9);
  const tarde = calcularCuidados({ cuidados: { agua: dia }, ahora: dia + 8 * HORA });
  comprobar(tarde.agua < 100, `ocho horas de dia si gastan (${tarde.agua})`);
}

console.log('\n### las cacas salen de una en una y se van todas de golpe');
{
  const limpio = aDia(1, 8);
  const visto = [];
  for (const h of [0, 6, 14, 22, 30, 48]) {
    const c = calcularCuidados({ cuidados: { orden: limpio }, ahora: limpio + h * HORA });
    visto.push(c.cacas);
  }
  comprobar(visto[0] === 0, `con la casa recien recogida no hay ninguna (${visto[0]})`);
  comprobar(visto[visto.length - 1] === CACAS_MAX,
    `con la barra a cero salen las ${CACAS_MAX} (${visto[visto.length - 1]})`);
  comprobar(visto.every((v, i) => i === 0 || v >= visto[i - 1]),
    `no desaparecen solas: ${visto.join(' ')}`);

  /* Recoger lo deja como nuevo, y no queda rastro de lo anterior. */
  const ahora = limpio + 48 * HORA;
  const despues = calcularCuidados({ cuidados: atender({ orden: limpio }, 'orden', ahora), ahora });
  comprobar(despues.cacas === 0 && despues.orden === 100,
    `un toque lo deja al 100 y sin cacas (${despues.orden}, ${despues.cacas})`);
}

console.log('\n### NO tocan la mecanica (lo importante)');
{
  const pacto = pactoPorDefecto({ metaPasos: 8000 });
  pacto.creado = '2026-09-01';
  const perfil = { sexo: 'hombre', edad: 38, altura: 178, pesoActual: 85, pesoMeta: 74 };
  const entradas = { '2026-09-09': { pasos: 9000, comidaKcal: 1800, entrenoMin: 45 } };
  const ahora = aDia(10);
  const comun = { pacto, entradas, perfil, carino: [], ahora, hoy: '2026-09-10' };

  const mimado = calcularEstado({ ...comun, cuidados: { agua: ahora, orden: ahora } });
  const dejado = calcularEstado({ ...comun, cuidados: { agua: aDia(1), orden: aDia(1) } });

  comprobar(dejado.cuidado.agua === 0 && dejado.cuidado.orden === 0,
    'el caso "dejado" tiene de verdad las dos barras a cero');

  for (const campo of ['felicidad', 'forma', 'energia', 'animo', 'racha', 'abandono']) {
    comprobar(mimado[campo] === dejado[campo],
      `${campo}: igual con el cuenco lleno que vacio (${mimado[campo]} / ${dejado[campo]})`);
  }
  comprobar(mimado.nivel.nivel === dejado.nivel.nivel && mimado.nivel.xp === dejado.nivel.xp,
    `nivel y experiencia: iguales (N${mimado.nivel.nivel}/${mimado.nivel.xp}xp)`);
  comprobar(mimado.hoy.proporcion === dejado.hoy.proporcion,
    'el cumplimiento del dia no cambia');
}

console.log('\n### sin datos no molesta a nadie');
{
  /* Un michi recien adoptado no recibe a nadie con sed. El reloj arranca
     al crear el pacto, que se guarda sin hora, asi que se cuenta desde
     el mediodia de ese dia.

     Ojo con la hora: la primera version de esta prueba pedia 100 y 100
     usando `Date.now()` por debajo. Pasaba por la mañana y fallaba por
     la tarde, porque a las cinco ya han corrido cinco horas de vigilia
     desde el mediodia y el cuenco ha bajado — que es lo correcto. Aqui
     se fija el `ahora` a proposito: una prueba que depende de cuando la
     lances no prueba nada. */
  const adopcion = new Date(2026, 8, 11, 12, 0, 0).getTime();
  const pacto = { creado: '2026-09-11' };

  const alAdoptar = calcularCuidados({ cuidados: {}, pacto, ahora: adopcion });
  comprobar(alAdoptar.agua === 100 && alAdoptar.orden === 100,
    `al adoptarlo, todo lleno (${alAdoptar.agua} / ${alAdoptar.orden})`);

  /* Y ese mismo dia por la tarde sigue sin quejarse: baja, pero no llega
     ni de lejos a tener sed. */
  const porLaTarde = calcularCuidados({ cuidados: {}, pacto, ahora: adopcion + 6 * HORA });
  comprobar(!porLaTarde.sed && !porLaTarde.sucio && porLaTarde.agua > 55,
    `seis horas despues aun no pide nada (${porLaTarde.agua} / ${porLaTarde.orden})`);

  const sinNada = calcularCuidados({});
  comprobar(sinNada.agua === 100 && sinNada.orden === 100,
    'sin pacto ni marcas tampoco se queja');
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: el agua y el orden se portan.');
process.exit(fallos ? 1 : 0);
