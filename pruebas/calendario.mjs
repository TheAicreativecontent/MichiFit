/* Comprueba que el .ics que genera la app es valido de verdad.

   iCalendar tiene tres reglas que parecen tonterias y rompen el archivo
   entero si se incumplen, y las tres se han roto aqui alguna vez:

     1. las lineas terminan en CRLF, no en LF. Con LF, iOS se lo traga
        pero Outlook rechaza el archivo completo;
     2. ninguna linea pasa de 75 OCTETOS, no caracteres. En tailandes o
        japones un caracter ocupa tres, asi que una linea corta a la
        vista puede pasarse;
     3. las comas y los puntos y coma van escapados, porque en
        iCalendar SEPARAN valores.

   Uso:  node pruebas/calendario.mjs        (desde la raiz)
*/
const { aICS } = await import('../src/datos/calendario.js');
const { pactoPorDefecto } = await import('../src/engine/pacto.js');

const TEXTOS = {
  nombreCalendario: 'MichiFit',
  entrenoTitulo: '🏋️ Entreno con tu michi',
  entrenoDesc: ({ min, pasos }) =>
    `${min} minutos. Hoy el michi te pide ${pasos} pasos, que es menos de lo normal: entrenar y andar mucho el mismo dia no se sostiene.`,
  apuntarTitulo: '🐾 Apunta tu dia en MichiFit',
  apuntarDesc: 'Pasos, comida y peso. El michi esta esperando.',
};

/* Textos con coma, punto y coma y caracteres de tres octetos: justo lo
   que rompe las tres reglas de arriba si algo esta mal. */
const TEXTOS_HOSTILES = {
  nombreCalendario: 'MichiFit; pruebas, varias',
  entrenoTitulo: '🏋️ ออกกำลังกาย, กับมิจิของคุณ; วันนี้',
  entrenoDesc: () => 'コンマ, セミコロン; バックスラッシュ \\ と改行\nを含む説明文です。とても長い行になるように、わざと日本語で書いています。',
  apuntarTitulo: '🐾 记录你的一天',
  apuntarDesc: '步数、饮食和体重。',
};

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

for (const [nombre, textos] of [['normal', TEXTOS], ['con comas y CJK', TEXTOS_HOSTILES]]) {
  const p = pactoPorDefecto({ metaPasos: 7000 });
  p.dias.lun.hora = '19:00';
  p.dias.mie.hora = '07:30';
  p.dias.mie.minEntreno = 60;
  const ics = aICS(p, textos);

  console.log(`\n### ${nombre}`);
  const lineas = ics.split('\r\n');

  comprobar(ics.endsWith('\r\n'), 'termina en CRLF');
  comprobar(!/[^\r]\n/.test(ics), 'todas las lineas van con CRLF');

  const largas = lineas.filter((l) => new TextEncoder().encode(l).length > 75);
  comprobar(largas.length === 0, `ninguna linea pasa de 75 octetos (${largas.length} se pasan)`);

  comprobar(lineas[0] === 'BEGIN:VCALENDAR', 'abre con BEGIN:VCALENDAR');
  comprobar(ics.includes('END:VCALENDAR'), 'cierra con END:VCALENDAR');

  const abiertos = (ics.match(/BEGIN:VEVENT/g) || []).length;
  const cerrados = (ics.match(/END:VEVENT/g) || []).length;
  comprobar(abiertos === cerrados && abiertos === 4,
    `4 eventos, todos cerrados (${abiertos} abiertos, ${cerrados} cerrados)`);

  const alarmas = (ics.match(/BEGIN:VALARM/g) || []).length;
  comprobar(alarmas === abiertos, 'cada evento lleva su alarma');

  comprobar((ics.match(/RRULE:FREQ=WEEKLY/g) || []).length === 3, '3 entrenos semanales');
  comprobar(ics.includes('RRULE:FREQ=DAILY'), 'y el recordatorio diario');

  /* Las comas dentro de un texto van escapadas; las que separan valores
     de RRULE o BYDAY, no. Se mira solo en SUMMARY y DESCRIPTION. */
  const sinEscapar = lineas.filter((l) => /^(SUMMARY|DESCRIPTION|X-WR-CALNAME):/.test(l))
    .filter((l) => /[^\\],/.test(l.replace(/^[A-Z-]+:/, '')));
  comprobar(sinEscapar.length === 0,
    `comas escapadas en los textos (${sinEscapar.length} sin escapar)`);

  /* Al plegar no se puede partir un caracter por la mitad: si pasa, el
     archivo trae bytes invalidos y el calendario muestra basura. */
  comprobar(!ics.includes('�'), 'ningun caracter partido al plegar');
}

console.log(fallos ? `\nFALLA: ${fallos} comprobacion(es)` : '\nBien: el .ics es valido.');
process.exit(fallos ? 1 : 0);
