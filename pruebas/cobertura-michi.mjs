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
  /* Cumplimiento medio y un dia sin apuntar: es el unico hueco donde el
     michi no tiene nada particular que decir, y sale de pie. La banda es
     estrecha a proposito: casi siempre esta contento, cansado o triste,
     que es mas util que una cara neutra. */
  'medio gas, hoy nada':  lleno(1, 20, { pasos: 4500, entrenoMin: 20, comidaKcal: 2000, sueno: { horas: 7 } }),
  'apunta poco y flojo':  lleno(0, 20, { pasos: 1200, comidaKcal: 2600 }),
  'nunca ha apuntado':    {},
};

/* Los dos ultimos aun no estan dibujados: los hara Alberto. Mientras
   falten, el aparato cae al michi de pie y no se rompe nada — pero la
   prueba ya vigila que sean ALCANZABLES, para que el dia que existan no
   haya que descubrir que nadie los ve. */
const TODOS = ['michi', 'michi_contento', 'michi_cansado', 'michi_triste',
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

/* Y al reves: cumplir a tope tiene que GANARLE a la sed, o quien no
   descubra el boton del agua no vuelve a ver a su michi contento. */
{
  const est = M.calcularEstado({ pacto, entradas: PERFILES['cumple a tope'],
                                 perfil, carino: [], cuidados: { agua: 0, orden: 0 } });
  const v = M.estadoVisual(est);
  console.log('\n  cumpliendo a tope y con sed -> %s', v.humor);
  if (v.humor !== 'contento') {
    console.log('  NO  la sed le gana a cumplir: el michi nunca saldra contento');
    process.exitCode = 1;
  } else {
    console.log('  si  cumplir manda sobre la sed');
  }
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
