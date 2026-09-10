/* ============================================================
   MichiFit · constantes del modelo
   Todo lo ajustable vive aquí. Nada de números sueltos en la lógica.
   ============================================================ */

/* --- energética ------------------------------------------- */
export const KCAL_POR_PASO = 0.04;
export const KCAL_POR_MIN_ENTRENO = 8;
export const KCAL_POR_KG_GRASA = 7700;

/* Factores de actividad para estimar el gasto total si no hay
   datos reales de reloj. */
export const FACTORES_ACTIVIDAD = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  alto: 1.725,
};

/* --- suelos de seguridad (ver MECANICA.md, no negociables) --- */
export const IMC_MINIMO_SANO = 18.5;

/* Suelo de grasa, en gramos por kilo de PESO META.

   La grasa es la unica macro que baja sin freno cuando bajan las
   calorias: la proteina va fija (2 g por kilo de meta) y los carbos son
   lo que sobra, asi que todo el recorte cae sobre ella. Con 1.703 kcal
   salen 47 g, que para 84 kilos son 0,56 g/kg.

   0,6 es el borde bajo de lo que se suele citar como minimo razonable.
   No es un limite duro y la app NO lo impone —decision de Alberto del
   2026-09-11, se avisa y ya— pero por debajo conviene decirlo, igual que
   se dice con las calorias y con el IMC.

   Se mide contra el peso META y no contra el actual por lo mismo que la
   proteina: el peso actual baja segun avanzas, y con el bajaria el
   suelo, que es justo cuando menos deberia moverse. */
export const GRASA_MINIMA_POR_KG = 0.6;

/* --- que quiere conseguir el usuario ------------------------------
   Lo primero de la pantalla «Mi objetivo», antes que los pasos y los
   entrenos: sin saber a donde vas, la semana tipo es un formulario.

   `deficit` es lo que se pone en `perfil.deficitObjetivo` al elegirlo.
   `null` significa «no lo toques»: el usuario lo lleva a mano.

   FALTA «ganar peso», y no por olvido. Hoy `planEnergetico` recorta
   cualquier superavit a cero (`Math.max(0, deficitObjetivo)`), y ademas
   habria que darle la vuelta a una regla del michi: pasarse de calorias
   rompe el dia, que en un volumen es justo lo contrario. Decision de
   Alberto del 2026-09-11: primero los que funcionan de verdad, y ganar
   peso en su propio paso. Esta en `TODO.md`. */
export const OBJETIVOS = [
  { id: 'perder',   deficit: 500 },
  { id: 'mantener', deficit: 0 },
  { id: 'forma',    deficit: 0 },
  { id: 'otro',     deficit: null },
];

export const OBJETIVO_POR_DEFECTO = 'perder';
export const esObjetivo = (id) => OBJETIVOS.some((o) => o.id === id);
export const KCAL_MINIMAS = { hombre: 1500, mujer: 1200 };
export const RITMO_MAXIMO_SEMANAL = 0.01; // 1% del peso corporal

/* Techo del deficit, como fraccion del gasto total.
   Un deficit se mide en PORCENTAJE, no en calorias sueltas: 500 kcal es un
   20% razonable para quien gasta 2.500, pero un 37% brutal para quien gasta
   1.365. El mismo numero fijo trataba igual a cuerpos muy distintos. */
export const DEFICIT_MAXIMO = 0.20;

/* --- pacto -------------------------------------------------- */
export const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
/* Los NOMBRES de los días ya no viven aquí: están en el diccionario,
   en `dias.inicial` y `dias.largo` de `src/i18n`, porque hay que
   traducirlos. Los de castellano fijo se fueron a
   `_CUARENTENA/dias-en-castellano.js` el 2026-09-11. */

/* Comida. Dos margenes, porque pasarse de calorias NO es lo mismo que
   faltar al gimnasio: un dia comiendo de mas se arregla solo, un entreno
   perdido no vuelve.
     - hasta +10%  el objetivo se da por cumplido
     - hasta +30%  cuenta a medias: baja el animo del michi, pero el dia
                   sigue valiendo
     - de ahi      el dia se rompe, como cualquier otro objetivo
   Ver MECANICA.md. */
export const MARGEN_COMIDA = 0.10;
export const MARGEN_COMIDA_GRAVE = 0.30;

/* Cuanto pesa cada objetivo en la proporcion del dia (el aspecto del
   michi). Los que no aparecen pesan 1. */
export const PESO_OBJETIVO = { comida: 0.5 };

/* Días que puedes rellenar hacia atrás. Fuera de la ventana el día
   se cierra como no cumplido. */
export const VENTANA_RETRO = 3;

/* --- comodines ---------------------------------------------- */
export const DIAS_PARA_COMODIN = 7;
export const MAX_COMODINES = 3;

/* --- experiencia y niveles ---------------------------------- */
export const XP_DIA_CUMPLIDO = 25;
export const XP_SEMANA_COMPLETA = 50;
export const NIVEL_SUELO = 2; // nunca se vuelve a recién nacido

export const NIVELES = [
  { nivel: 1, min: 0,    nombre: 'Michi bebé',    emoji: '🐣' },
  { nivel: 2, min: 150,  nombre: 'Michi joven',   emoji: '🐱' },
  { nivel: 3, min: 400,  nombre: 'Michi en forma', emoji: '💪' },
  { nivel: 4, min: 750,  nombre: 'Michi atleta',  emoji: '🏆' },
  { nivel: 5, min: 1200, nombre: 'Michi leyenda', emoji: '🔥' },
];

/* --- ventanas de cálculo del estado ------------------------- */
export const DIAS_FORMA = 14;      // cumplimiento sostenido
export const DIAS_ENERGIA = 3;     // actividad reciente
export const DIAS_ABANDONO = 10;   // sin nada -> esquelético

/* --- hitos ------------------------------------------------
   Definidos en MECANICA.md. `check` recibe { entrada, racha, usuario,
   pesoActual } y devuelve si se cumple ESE día. Un hito conseguido no
   se pierde: se evalúa contra todo el historial. */
export const XP_POR_HITO = 100;

export const HITOS = [
  {
    id: 'primer-dia',
    nombre: 'El primer paso',
    desc: 'Cumplir el pacto un día',
    emoji: '🐾',
    check: ({ cumple }) => cumple,
  },
  {
    id: 'pasos-10k',
    nombre: 'Diez mil',
    desc: '10.000 pasos en un solo día',
    emoji: '👟',
    check: ({ entrada }) => (entrada?.pasos ?? 0) >= 10000,
  },
  {
    id: 'entreno-60',
    nombre: 'Sesión larga',
    desc: '60 minutos de entreno en un día',
    emoji: '🏋️',
    check: ({ entrada }) => (entrada?.entrenoMin ?? 0) >= 60,
  },
  {
    id: 'sueno-7h',
    nombre: 'Bien dormido',
    desc: 'Dormir 7 horas o más',
    emoji: '🌙',
    check: ({ entrada }) => (entrada?.sueno?.horas ?? 0) >= 7,
  },
  {
    id: 'racha-7',
    nombre: 'Una semana',
    desc: '7 días seguidos cumpliendo',
    emoji: '📅',
    check: ({ racha }) => racha >= 7,
  },
  {
    id: 'racha-30',
    nombre: 'Un mes entero',
    desc: '30 días seguidos cumpliendo',
    emoji: '👑',
    check: ({ racha }) => racha >= 30,
  },
  {
    id: 'meta-peso',
    nombre: 'Meta alcanzada',
    desc: 'Llegar a tu peso objetivo',
    emoji: '🏆',
    check: ({ entrada, usuario }) =>
      entrada?.peso != null && usuario?.pesoMeta != null && entrada.peso <= usuario.pesoMeta,
  },
];
