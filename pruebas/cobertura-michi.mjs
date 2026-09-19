/* Comprueba que TODOS los dibujos del michi llegan a verse alguna vez.

   No es una prueba de que el codigo no falle: es una prueba de que el
   trabajo de dibujar no se tira. Si una pose no aparece en ningun
   estado posible, es un PNG que nadie vera jamas.

   Hizo falta porque ya paso. `michi_contento` era inalcanzable: para
   subir el animo habia que apuntar el dia, y en cuanto apuntabas ganaba
   la escena («estas entrenando») y tapaba el humor. Se cumplian dos
   semanas seguidas y el michi seguia de pie, con cara de nada.

   Uso:  node pruebas/cobertura-michi.mjs        (desde la raiz)
*/
const M = await import('../src/engine/michi.js');
const P = await import('../src/engine/pacto.js');
const E = await import('../src/mascota/escenas.js');
const C = await import('../src/engine/cuidados.js');

const iso = (n) => P.diasAtras(P.hoyISO(), n);
const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

const pacto = { dias: {}, comidaKcal: 2085, creado: iso(40) };
for (const d of DIAS) {
  const entrena = ['lun', 'mie', 'vie'].includes(d);
  pacto.dias[d] = { entreno: entrena, minEntreno: entrena ? 45 : 0, pasos: entrena ? 4000 : 6000 };
}
const perfil = { sexo: 'hombre', edad: 45, altura: 193, pesoActual: 92, pesoMeta: 80 };
const lleno = (desde, hasta, v) => {
  const e = {};
  for (let i = desde; i < hasta; i++) e[iso(i)] = v;
  return e;
};

const PERFILES = {
  'cumple a tope':        lleno(0, 20, { pasos: 9000, entrenoMin: 50, comidaKcal: 1800, sueno: { horas: 8 } }),
  'cumple, hoy aun nada': lleno(1, 20, { pasos: 9000, entrenoMin: 50, comidaKcal: 1800, sueno: { horas: 8 } }),
  'lleva 3 dias parado':  lleno(3, 20, { pasos: 9000, entrenoMin: 50, comidaKcal: 1800, sueno: { horas: 8 } }),
  'lleva 12 dias parado': lleno(12, 25, { pasos: 9000, entrenoMin: 50, comidaKcal: 1800, sueno: { horas: 8 } }),
  'a medio gas':          lleno(0, 20, { pasos: 3000, comidaKcal: 2000 }),
  /* Cumplimiento medio (forma 76) y un dia sin apuntar: sin nada que
     contar, el michi sale de pie. Era el hueco estrecho de la banda
     30-70, hasta que «entreno cumple por apuntar» subio a casi todos por
     encima de 70 y el de pie dejo de salir (2026-09-18). Ahora `contento`
     pide forma 95 (`FORMA_CONTENTO`) y este perfil vuelve a caer en el
     de pie. */
  'medio gas, hoy nada':  lleno(1, 20, { pasos: 4500, entrenoMin: 20, comidaKcal: 2000, sueno: { horas: 7 } }),
  'apunta poco y flojo':  lleno(0, 20, { pasos: 1200, comidaKcal: 2600 }),
  'nunca ha apuntado':    {},
};

/* Sin `michi_cansado`: Albert lo borro el 2026-09-19 y la cara se retiro
   del motor. Si algun dia vuelve, se anade aqui y en `estadoVisual`. */
const TODOS = ['michi', 'michi_contento', 'michi_triste',
               'michi_andando', 'michi_comiendo', 'michi_entrenando',
               'michi_durmiendo', 'michi_celebrando',
               'michi_sediento', 'michi_asqueado'];

const vistos = new Set();

/* El michi bien atendido es el caso normal: si no se pasa `cuidados`, el
   reloj cuenta desde que se creo el pacto —hace 40 dias en esta prueba—
   y sale sediento en TODOS los perfiles. Eso ya paso: la primera version
   de las barras dejo `michi_contento` y `michi` inalcanzables, y esta
   prueba lo caza. Ver el comentario de `estadoVisual` en michi.js. */
const atendido = { agua: Date.now(), orden: Date.now() };

console.log('%s %s %s', 'perfil'.padEnd(22), 'humor'.padEnd(9), 'dibujo que sale');
for (const [n, entradas] of Object.entries(PERFILES)) {
  const est = M.calcularEstado({ pacto, entradas, perfil, carino: [], cuidados: atendido });
  const v = M.estadoVisual(est);
  const esc = E.escenaAutomatica(entradas[iso(0)] ?? {}, null, v.humor);
  const dibujo = 'michi' + (esc.pose ? '_' + esc.pose : '');
  vistos.add(dibujo);
  console.log('%s %s %s', n.padEnd(22), String(v.humor).padEnd(9), dibujo);
}

/* Y los dos que salen cuando le falta algo. Se comprueba sobre el perfil
   que MEJOR cumple: si ni asi se ven, es que cumplir los tapa siempre y
   los dibujos sobran. */
console.log('\ncon el michi desatendido (perfil que mas cumple):');
for (const [que, marcas] of [['sed', { agua: 0, orden: Date.now() }],
                             ['casa sucia', { agua: Date.now(), orden: 0 }]]) {
  const est = M.calcularEstado({ pacto, entradas: PERFILES['a medio gas'],
                                 perfil, carino: [], cuidados: marcas });
  const v = M.estadoVisual(est);
  const esc = E.escenaAutomatica(PERFILES['a medio gas'][iso(0)] ?? {}, null, v.humor);
  const dibujo = 'michi' + (esc.pose ? '_' + esc.pose : '');
  vistos.add(dibujo);
  console.log('  %s %s %s', que.padEnd(20), String(v.humor).padEnd(9), dibujo);
}

/* EL ORDEN DE LOS CUIDADOS, dictado por Albert el 2026-09-18:
     caca -> asqueado; si la recoge, el brinco de celebrar; si falta agua
     -> sediento; y si se la da, el michi de pie.
   Se prueba sobre el perfil que MEJOR cumple: si ni asi ganan los
   avisos, es que cumplir los tapa siempre. Antes de esa fecha la sed
   iba detras de `contento` y esta prueba comprobaba lo contrario. */
const veo = (perfilNombre, marcas) => {
  const est = M.calcularEstado({ pacto, entradas: PERFILES[perfilNombre],
                                 perfil, carino: [], cuidados: marcas });
  return M.estadoVisual(est).humor;
};
const ok = (cumple, si, no) => {
  console.log('  %s %s', cumple ? 'si ' : 'NO ', cumple ? si : no);
  if (!cumple) process.exitCode = 1;
};

console.log('\nel orden de los cuidados (perfil que mas cumple):');
{
  const ahora = Date.now();
  const sucio = veo('cumple a tope', { agua: 0, orden: 0 });
  ok(sucio === 'asqueado', 'con caca Y sed gana la caca -> asqueado',
     `con caca y sed deberia salir asqueado y sale ${sucio}`);

  const sed = veo('cumple a tope', { agua: 0, orden: ahora });
  ok(sed === 'sediento', 'recogida la caca, con sed -> sediento',
     `con sed y la casa limpia deberia salir sediento y sale ${sed}`);

  const sedSuave = veo('medio gas, hoy nada', { agua: ahora - 3 * 3600_000, orden: ahora });
  /* 3 h de reloj no son 3 h de vigilia si es de madrugada: solo se mira
     si de verdad ha bajado del 75%. */
  const calm = C.calcularCuidados({ cuidados: { agua: ahora - 3 * 3600_000, orden: ahora }, pacto, ahora });
  if (calm.agua <= C.SED_DESDE) {
    ok(sedSuave === 'sediento', `con el cuenco al ${calm.agua}% (le falta un poco) -> sediento`,
       `con el cuenco al ${calm.agua}% deberia salir sediento y sale ${sedSuave}`);
  }

  const dePie = veo('medio gas, hoy nada', { agua: ahora, orden: ahora });
  ok(dePie === null, 'con agua y la casa limpia, cumpliendo a medias -> de pie',
     `con todo atendido deberia salir de pie y sale ${dePie}`);

  const contento = veo('cumple a tope', { agua: ahora, orden: ahora });
  ok(contento === 'contento', 'con todo atendido y constancia casi perfecta -> contento',
     `con todo atendido y forma maxima deberia salir contento y sale ${contento}`);
}

/* Y que el michi de pie salga MAS que el sentado, que es lo que pidio
   Albert. Se barre `forma` entera con los cuidados al dia: de pie tiene
   que ocupar mas de la escala que contento. */
console.log('\nde pie contra sentado y contento (todo atendido, forma 0-100):');
{
  const cuenta = { pie: 0, contento: 0 };
  for (let forma = 0; forma <= 100; forma++) {
    const h = M.estadoVisual({ energia: 60, forma, animo: 0, abandono: 0,
                               nivel: { nivel: 1 }, cuidado: { sed: false, sucio: false } }).humor;
    if (h === null) cuenta.pie++;
    else if (h === 'contento') cuenta.contento++;
  }
  ok(cuenta.pie > cuenta.contento,
     `de pie ocupa ${cuenta.pie} puntos de forma y contento ${cuenta.contento}`,
     `contento (${cuenta.contento}) ocupa mas de la escala que de pie (${cuenta.pie})`);
}

/* Las que salen al apuntar algo (duran unos segundos) y las del boton
   azul, que no dependen del estado. */
for (const a of ['comiendo', 'entrenando', 'celebrando']) vistos.add('michi_' + a);
for (const e of E.ESCENAS) if (e.pose) vistos.add('michi_' + e.pose);

console.log('\nCOBERTURA:');
const faltan = TODOS.filter((d) => !vistos.has(d));
for (const d of TODOS) console.log('  %s %s', vistos.has(d) ? 'si ' : 'NO ', d);

if (faltan.length) {
  console.log('\nFALLA: %d dibujo(s) que nadie vera nunca: %s', faltan.length, faltan.join(', '));
  process.exit(1);
}
console.log('\nBien: los %d dibujos se ven en algun estado.', TODOS.length);
