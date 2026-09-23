/* Comprueba `ritmoReal()` (`engine/calculos.js`), el número que decide
   cuántas semanas faltan para la meta en la pantalla de Progreso.

   Hasta el 2026-09-23 miraba TODO el historial de pesajes desde el
   primero, sin ventana. Con un historial largo —el típico de quien
   importó el CSV de la MichiFit antigua, o de cualquiera con meses de
   datos— eso diluye las últimas semanas de verdad entre meses de datos
   viejos: Albert perdió peso de verdad esa quincena y la app le seguía
   prometiendo más de tres meses. Ver `DECISIONS.md` 2026-09-23.

   Uso:  node pruebas/progreso.mjs        (desde la raiz)
*/
const C = await import('../src/engine/calculos.js');
const P = await import('../src/engine/pacto.js');

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

const iso = (n) => P.diasAtras(P.hoyISO(), n);

console.log('\n### un historial largo y plano ya no diluye las ultimas semanas buenas');
{
  // 45 dias de "meseta" ruidosa (tipico de un CSV importado), sin
  // tendencia real, seguidos de 15 dias bajando de verdad.
  const pesajes = [];
  let peso = 90;
  for (let i = 59; i >= 15; i--) {
    peso = 90 + Math.sin(i) * 0.3;
    pesajes.push({ fecha: iso(i), peso: Math.round(peso * 10) / 10 });
  }
  peso = 90;
  for (let i = 14; i >= 0; i--) {
    peso -= 0.7 / 7;
    pesajes.push({ fecha: iso(i), peso: Math.round(peso * 10) / 10 });
  }

  const r = C.ritmoReal(pesajes);
  const rSinVentana = C.ritmoReal(pesajes, P.hoyISO(), 90); // el bug: todo el historial
  comprobar(r != null, `sale un ritmo (${r?.toFixed(3)})`);
  comprobar(Math.abs(r) > Math.abs(rSinVentana) * 1.8,
    `la ventana de 30 dias pesa mucho mas las ultimas semanas que mirar los 90 dias enteros (${r?.toFixed(3)} vs ${rSinVentana?.toFixed(3)})`);
  comprobar(r < -0.2 && r > -0.9, `queda en un rango creible, ni diluido ni disparado (${r?.toFixed(3)})`);
}

console.log('\n### sigue funcionando igual en el caso normal (sin historial viejo)');
{
  // Tres semanas seguidas bajando 0,5 kg/semana, sin nada antes.
  const pesajes = [];
  let peso = 80;
  for (let i = 20; i >= 0; i--) {
    peso -= 0.5 / 7;
    pesajes.push({ fecha: iso(i), peso: Math.round(peso * 100) / 100 });
  }
  const r = C.ritmoReal(pesajes);
  comprobar(r != null, `sale un ritmo (${r?.toFixed(3)})`);
  comprobar(Math.abs(r - -0.5) < 0.05, `da los 0,5 kg/semana reales (${r?.toFixed(3)})`);
}

console.log('\n### los suelos de siempre se respetan');
{
  comprobar(C.ritmoReal([]) === null, 'sin pesajes, null');
  comprobar(C.ritmoReal([{ fecha: iso(0), peso: 80 }, { fecha: iso(1), peso: 80 }]) === null,
    'menos de tres pesajes, null (no hay para fiarse)');

  // Tres pesajes, pero todos la misma semana: menos de 10 dias de span.
  const pocos = [
    { fecha: iso(3), peso: 80.2 }, { fecha: iso(1), peso: 80.1 }, { fecha: iso(0), peso: 80 },
  ];
  comprobar(C.ritmoReal(pocos) === null, 'tres pesajes en menos de 10 dias, null');

  // Un pesaje suelto hace 40 dias no cuenta: cae fuera de la ventana.
  const conUnoViejo = [
    { fecha: iso(40), peso: 95 },
    { fecha: iso(20), peso: 80.6 }, { fecha: iso(10), peso: 80.3 }, { fecha: iso(0), peso: 80 },
  ];
  const r = C.ritmoReal(conUnoViejo);
  comprobar(r != null && r < 0 && r > -0.5,
    `el pesaje de hace 40 dias no arrastra el ritmo hacia un bajon irreal (${r?.toFixed(3)})`);
}

console.log('\n### la ventana se puede ajustar (parametro, no solo la constante)');
{
  const pesajes = [];
  let peso = 90;
  for (let i = 59; i >= 15; i--) pesajes.push({ fecha: iso(i), peso: 90 + Math.sin(i) * 0.3 });
  for (let i = 14; i >= 0; i--) { peso -= 0.7 / 7; pesajes.push({ fecha: iso(i), peso }); }

  const conTodo = C.ritmoReal(pesajes, P.hoyISO(), 90);
  const conVentana = C.ritmoReal(pesajes, P.hoyISO(), 30);
  comprobar(Math.abs(conVentana) > Math.abs(conTodo),
    `la ventana corta da un ritmo mas fuerte que mirar los 90 dias enteros (${conVentana?.toFixed(3)} vs ${conTodo?.toFixed(3)})`);
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: el ritmo real sigue las ultimas semanas, no todo el historial.');
process.exit(fallos ? 1 : 0);
