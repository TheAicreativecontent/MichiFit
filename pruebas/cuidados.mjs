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
const { calcularCuidados, atender, CACAS_MAX, AGUA_HORAS, ORDEN_HORAS } = await import('../src/engine/cuidados.js');
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
  /* La mitad del camino se mide contra AGUA_HORAS y no contra un numero
     escrito aqui. Antes decia «a las 8 horas va por la mitad», que era
     verdad SOLO mientras AGUA_HORAS valiera 16: al bajarlo a 10 la
     prueba se puso roja sin que nada estuviera mal. Una prueba atada a
     la constante comprueba la FORMA de la curva —que baja recta y llega
     a la mitad a mitad de camino— y sobrevive a que se retoque el
     ritmo, que es algo que `TODO.md` dice que va a pasar. */
  const mitad = AGUA_HORAS / 2;
  const c0 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno });
  const c1 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno + mitad * HORA });
  const c2 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno + 40 * HORA });

  comprobar(c0.agua === 100, `recien llenado esta al 100 (${c0.agua})`);
  comprobar(c1.agua > 40 && c1.agua < 60,
    `a mitad de camino (${mitad} h) va por la mitad (${c1.agua})`);
  comprobar(c2.agua === 0, `pasado dia y medio esta vacio (${c2.agua})`);
  comprobar(c2.sed === true, 'y el michi tiene sed');

  /* La sed salta al 75% (2026-09-18, pedido de Albert): al cuenco le
     falta un poco y ya lo pide. Se mide en el borde exacto, que es donde
     se rompe si alguien cambia `<=` por `<`. Con AGUA_HORAS = 10 cada
     hora despierto son 10 puntos; con otro valor, se calcula. */
  const horasA75 = AGUA_HORAS * 0.25;
  const en75 = calcularCuidados({ cuidados: { agua: lleno }, ahora: lleno + horasA75 * HORA });
  const en76 = calcularCuidados({ cuidados: { agua: lleno },
                                 ahora: lleno + (horasA75 - 0.05 * AGUA_HORAS) * HORA });
  comprobar(en75.agua === 75 && en75.sed === true,
    `al 75% ya tiene sed (${en75.agua}%, sed=${en75.sed})`);
  comprobar(en76.agua > 75 && en76.sed === false,
    `un poco por encima del 75% aun no (${en76.agua}%, sed=${en76.sed})`);
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

  /* Limpiar te deja un rato de calma (2026-09-19). Con `Math.ceil` la
     primera caca salia a los cinco minutos, y como la caca manda sobre la
     cara del michi, este quedaba asqueado casi siempre: el de pie y el
     sentado solo se veian esos primeros minutos. La primera sale al
     gastarse un tramo entero de la barra (1/CACAS_MAX de ORDEN_HORAS);
     antes de eso, ninguna. Atado a las constantes para sobrevivir a que
     se retoque el ritmo. */
  const tramo = ORDEN_HORAS / CACAS_MAX;
  const casi = calcularCuidados({ cuidados: { orden: limpio }, ahora: limpio + tramo * 0.9 * HORA });
  const justo = calcularCuidados({ cuidados: { orden: limpio }, ahora: limpio + tramo * 1.05 * HORA });
  const cincoMin = calcularCuidados({ cuidados: { orden: limpio }, ahora: limpio + HORA / 12 });
  comprobar(cincoMin.cacas === 0 && !cincoMin.sucio,
    `a los 5 minutos de limpiar no hay caca (${cincoMin.cacas})`);
  comprobar(casi.cacas === 0 && !casi.sucio,
    `justo antes del primer tramo (${(tramo * 0.9).toFixed(1)} h) sigue limpio (${casi.cacas})`);
  comprobar(justo.cacas === 1 && justo.sucio,
    `pasado el primer tramo (${(tramo * 1.05).toFixed(1)} h) sale la primera (${justo.cacas})`);

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

  /* Y ese mismo dia por la tarde: se ha MOVIDO pero todavia no pide.

     Las dos mitades importan y por eso se comprueban las dos.

     Que no pida NADA AL ADOPTARLO es lo que hay que sostener: nadie
     estrena la app con un gato quejandose. Lo que NO es una promesa es
     que aguante seis horas callado — este comentario se lo atribuia a
     `MECANICA.md` y ahi no lo pone. Lo que `MECANICA.md` §8 promete es
     otra cosa, y sigue en pie: que cuidar no toca la mecanica y que
     CUMPLIR MANDA SOBRE TENER SED.

     Cambio el 2026-09-16, a peticion de Albert: la cara del michi pasa a
     decir lo mismo que ya se ve en pantalla —asqueado con una caca en el
     suelo, sediento con el cuenco por debajo de la mitad— en vez de
     saltar solo a cero. Con `AGUA_HORAS` a 10, eso significa que a las
     seis horas ya pide agua, y esta bien que lo haga: pedir no es
     reprochar.

     Que se haya movido es la queja de Albert del 2026-09-12: «cuando
     entro en la app apenas se ha movido». Una barra quieta no pide nada
     y no engancha a nadie, asi que aqui abajo se exige que haya bajado.
     Antes esta linea decia `agua > 55`, que era un numero puesto a ojo y
     que al acelerar las barras (16→10 h) se caia sin que nada estuviera
     mal: a las seis horas quedan 40, que no es tener sed, es haber
     bebido. Un proxy que se cae cuando cambias lo que mide no estaba
     midiendo lo que decia. */
  comprobar(!alAdoptar.sed && !alAdoptar.sucio && alAdoptar.cacas === 0,
    `al adoptarlo no pide nada (${alAdoptar.agua} / ${alAdoptar.orden})`);

  const porLaTarde = calcularCuidados({ cuidados: {}, pacto, ahora: adopcion + 6 * HORA });
  comprobar(porLaTarde.agua < 100 && porLaTarde.orden < 100,
    `seis horas despues las dos barras se han movido (${porLaTarde.agua} / ${porLaTarde.orden})`);
  /* Y la mitad que de verdad protege al usuario: por muy sediento que
     este, si viene cumpliendo el michi sale CONTENTO. Es la regla de
     precedencia de `MECANICA.md` §8, y es la que impide que cuidar se
     convierta en un reproche. */
  const vacio = calcularCuidados({ cuidados: {}, pacto, ahora: adopcion + 40 * HORA });
  comprobar(vacio.sed && vacio.sucio,
    `al dia y medio si pide las dos cosas (${vacio.agua} / ${vacio.orden})`);

  const sinNada = calcularCuidados({});
  comprobar(sinNada.agua === 100 && sinNada.orden === 100,
    'sin pacto ni marcas tampoco se queja');
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: el agua y el orden se portan.');
process.exit(fallos ? 1 : 0);
