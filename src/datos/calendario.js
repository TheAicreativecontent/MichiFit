/* ============================================================
   MichiFit · llevar el pacto al calendario del móvil

   El michi no puede sonar solo. Las notificaciones push de verdad
   —las que llegan con la app cerrada— necesitan un servidor que las
   empuje, y eso romperia lo unico que esta app promete de verdad: que
   tus datos no salen de tu dispositivo. La API que las programaria en
   local sin servidor no existe en produccion en ningun navegador.

   El calendario, en cambio, funciona hoy. En todos los moviles, sin
   permisos, sin cuenta y sin coste: se genera un archivo .ics, lo abres
   una vez, y las alarmas las pone el sistema operativo. Se sincroniza
   con el iPhone, con Android y con Google Calendar.

   Se generan dos cosas:

     · un evento SEMANAL por cada dia de entreno que hayas pactado, a la
       hora que pusiste, con la duracion que pusiste;
     · un recordatorio DIARIO por la noche para apuntar el dia, que es
       lo que de verdad se olvida.

   Formato iCalendar (RFC 5545). Tres cosas que parecen tonterias y
   rompen el archivo si se hacen mal, y estan comentadas donde tocan:
   los finales de linea, el plegado a 75 octetos y el escapado.
   ============================================================ */

import { DIAS } from '../engine/constantes.js';

/* Los dias de la semana en iCalendar. El orden de DIAS ya empieza en
   lunes, igual que aqui. */
const DIA_ICS = {
  lun: 'MO', mar: 'TU', mie: 'WE', jue: 'TH',
  vie: 'FR', sab: 'SA', dom: 'SU',
};

const dos = (n) => String(n).padStart(2, '0');

/* Marca de tiempo UTC, para DTSTAMP. */
function ahoraUTC() {
  const d = new Date();
  return (
    d.getUTCFullYear() + dos(d.getUTCMonth() + 1) + dos(d.getUTCDate()) + 'T' +
    dos(d.getUTCHours()) + dos(d.getUTCMinutes()) + dos(d.getUTCSeconds()) + 'Z'
  );
}

/* Fecha y hora SIN zona horaria: en iCalendar eso es «hora local
   flotante», o sea las 19:00 dondequiera que estés. Es justo lo que
   quiere un recordatorio personal, y ahorra tener que meter un bloque
   VTIMEZONE entero con las reglas de cambio de hora del pais. */
function local(fecha, hhmm) {
  const [h, m] = String(hhmm ?? '19:00').split(':').map(Number);
  return (
    fecha.getFullYear() + dos(fecha.getMonth() + 1) + dos(fecha.getDate()) + 'T' +
    dos(h || 0) + dos(m || 0) + '00'
  );
}

/* El primer <dia de la semana> a partir de hoy, hoy incluido. */
function proximo(clave) {
  const objetivo = DIAS.indexOf(clave);          // 0 = lunes
  const hoy = new Date();
  const actual = (hoy.getDay() + 6) % 7;         // getDay(): 0 = domingo
  const suma = (objetivo - actual + 7) % 7;
  const d = new Date(hoy);
  d.setDate(hoy.getDate() + suma);
  return d;
}

/* En un texto de iCalendar, la coma y el punto y coma SEPARAN valores.
   Sin escapar, un ejercicio llamado «press banca, 3x10» partiria el
   campo en dos y el archivo dejaria de ser valido. */
function escapar(txt) {
  return String(txt ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/* Ninguna linea puede pasar de 75 OCTETOS —no caracteres—, y se parte
   metiendo un salto y un espacio al principio de la siguiente. Importa
   de verdad aqui: en tailandes o japones un solo caracter ocupa tres
   octetos, asi que una linea corta a la vista puede pasarse de largo.
   Se cuenta en UTF-8 y no se parte nunca a mitad de caracter. */
function plegar(linea) {
  const bytes = new TextEncoder().encode(linea);
  if (bytes.length <= 75) return linea;

  const trozos = [];
  let actual = '';
  let usados = 0;
  for (const caracter of linea) {          // itera por caracteres, no por code units
    const n = new TextEncoder().encode(caracter).length;
    // 74 para dejar sitio al espacio que abre la linea siguiente
    if (usados + n > (trozos.length === 0 ? 75 : 74)) {
      trozos.push(actual);
      actual = '';
      usados = 0;
    }
    actual += caracter;
    usados += n;
  }
  if (actual) trozos.push(actual);
  return trozos.join('\r\n ');
}

function evento({ uid, inicio, fin, dia, titulo, descripcion, avisoMin }) {
  const l = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${ahoraUTC()}`,
    `DTSTART:${inicio}`,
    `DTEND:${fin}`,
    dia ? `RRULE:FREQ=WEEKLY;BYDAY=${dia}` : 'RRULE:FREQ=DAILY',
    `SUMMARY:${escapar(titulo)}`,
    `DESCRIPTION:${escapar(descripcion)}`,
    'BEGIN:VALARM',
    `TRIGGER:-PT${avisoMin}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(titulo)}`,
    'END:VALARM',
    'END:VEVENT',
  ];
  return l;
}

/* Suma minutos a un DTSTART flotante, respetando el cambio de dia. */
function sumarMinutos(marca, minutos) {
  const a = Number(marca.slice(0, 4));
  const m = Number(marca.slice(4, 6)) - 1;
  const d = Number(marca.slice(6, 8));
  const h = Number(marca.slice(9, 11));
  const mi = Number(marca.slice(11, 13));
  const f = new Date(a, m, d, h, mi + minutos);
  return local(f, `${f.getHours()}:${f.getMinutes()}`);
}

/* `textos` lleva los títulos y descripciones ya traducidos: este
   archivo no sabe de idiomas, se los pasa quien lo llama. */
export function aICS(pacto, textos) {
  if (!pacto?.dias) return null;

  const sello = Date.now().toString(36);
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MichiFit//Michi//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapar(textos.nombreCalendario)}`,
  ];

  /* Un evento semanal por cada dia de entreno. */
  for (const d of DIAS) {
    const dia = pacto.dias[d];
    if (!dia?.entreno) continue;
    const inicio = local(proximo(d), dia.hora ?? '19:00');
    lineas.push(...evento({
      uid: `entreno-${d}-${sello}@michifit`,
      inicio,
      fin: sumarMinutos(inicio, dia.minEntreno || 45),
      dia: DIA_ICS[d],
      titulo: textos.entrenoTitulo,
      descripcion: textos.entrenoDesc({ min: dia.minEntreno || 45, pasos: dia.pasos }),
      avisoMin: 30,
    }));
  }

  /* Y uno diario para apuntar el dia. Va a las 21:30 porque a esa hora
     ya ha pasado todo: los pasos, la comida y el entreno. */
  const apunte = local(new Date(), '21:30');
  lineas.push(...evento({
    uid: `apuntar-${sello}@michifit`,
    inicio: apunte,
    fin: sumarMinutos(apunte, 10),
    dia: null,
    titulo: textos.apuntarTitulo,
    descripcion: textos.apuntarDesc,
    avisoMin: 0,
  }));

  lineas.push('END:VCALENDAR');

  /* iCalendar exige CRLF. Con saltos de linea de Unix, iOS se traga el
     archivo pero Outlook lo rechaza entero. */
  return lineas.map(plegar).join('\r\n') + '\r\n';
}
