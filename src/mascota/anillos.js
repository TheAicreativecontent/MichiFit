/* ============================================================
   MichiFit · los dos anillos de los botones del aparato

   Los tres botones dejaron de ser un juguete el 2026-09-11. Antes el
   izquierdo daba corazones, el central cambiaba el decorado y el
   derecho dormía al michi: nada de eso tocaba un solo dato, y el
   aparato era un salvapantallas con botones. Ahora es la interfaz.

   La gramática es la de un tamagotchi de verdad:

     · IZQUIERDA  abre el anillo de CUIDAR. Dentro de un anillo, sale.
     · CENTRO     desde neutral abre el anillo de MEDIR.
                  Dentro de un anillo, pasa al siguiente icono.
     · DERECHA    acepta el icono seleccionado.

   Que el central signifique dos cosas según dónde estés no es un
   descuido: es como funcionan los tamagotchis, y el contexto lo hace
   inequívoco. Lo que sí hacía falta añadir son las salidas, porque un
   tamagotchi de verdad venía con manual de papel y esto no:

     1. cada anillo acaba en un icono de SALIR;
     2. el botón izquierdo sale desde cualquier sitio;
     3. y si no tocas nada, vuelve solo a neutral (ver `ESPERA_MS`).

   Los iconos son emoji de momento, para poder montarlo y probarlo.
   Cuando estén los de Alberto en pixel art se cambia `icono` por la
   ruta de su PNG.
   ============================================================ */

/* Vuelta sola a neutral. Ocho segundos es lo que tarda alguien en
   distraerse sin sentir que la app le ha quitado la pantalla de golpe. */
export const ESPERA_MS = 8000;

/* Cuidar: lo cosmético. NADA de esto toca la mecánica — ni experiencia,
   ni nivel, ni cumplimiento del pacto. Ver `engine/cuidados.js`. */
export const CUIDAR = [
  { id: 'mimar',   clave: 'anillo.mimar' },
  { id: 'agua',    clave: 'anillo.agua' },
  { id: 'limpiar', clave: 'anillo.limpiar' },
  { id: 'salir',   clave: 'anillo.salir' },
];

/* Medir: los cuatro datos de verdad. `escena` es lo que se ve en la
   pantalla mientras el cursor está encima, y es media explicación por
   sí sola: el michi andando por la calle dice «pasos» sin escribirlo.
   `campo` es el del editor del día que se abre al aceptar. */
export const MEDIR = [
  { id: 'comida',  clave: 'anillo.comida',  escena: 'comer',    campo: 'comida' },
  { id: 'entreno', clave: 'anillo.entreno', escena: 'entrenar', campo: 'entreno' },
  { id: 'pasos',   clave: 'anillo.pasos',   escena: 'pasear',   campo: 'pasos' },
  { id: 'sueno',   clave: 'anillo.sueno',   escena: 'dormir',   campo: 'sueno' },
  { id: 'salir',   clave: 'anillo.salir' },
];

/* La ruta del icono sale del id: los PNG se llaman igual. Un icono
   que faltara dejaria un hueco y nada mas — el nombre debajo sigue
   diciendo lo que hace. */
export const iconoDe = (id) => `/iconos-anillo/${id}.png`;

export const anilloDe = (modo) => (modo === 'cuidar' ? CUIDAR : modo === 'medir' ? MEDIR : null);

/* Qué dice cada botón AHORA MISMO. No es un adorno: es el `aria-label`
   y el `title`, o sea lo que oye quien usa un lector de pantalla y lo
   que lee quien pasa el ratón. Si los botones cambian de significado y
   el rótulo se queda fijo, el rótulo miente — y un rótulo que miente es
   peor que no tenerlo. */
export function rotulosDeBotones(modo) {
  return modo
    ? { mimar: 'anillo.salir', accion: 'anillo.siguiente', dormir: 'anillo.aceptar' }
    : { mimar: 'anillo.cuidar', accion: 'anillo.registrar', dormir: 'aparato.dormir' };
}

/* El siguiente icono, dando la vuelta al llegar al final. */
export function siguienteIndice(modo, indice) {
  const a = anilloDe(modo);
  return a ? (indice + 1) % a.length : 0;
}
