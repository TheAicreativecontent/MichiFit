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
export const KCAL_MINIMAS = { hombre: 1500, mujer: 1200 };
export const RITMO_MAXIMO_SEMANAL = 0.01; // 1% del peso corporal

/* --- pacto -------------------------------------------------- */
export const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
/* Inicial de cada día para los selectores. Miércoles es X, como se usa
   siempre en español, para no tener dos "M" seguidas. */
export const DIAS_INICIAL = {
  lun: 'L', mar: 'M', mie: 'X', jue: 'J', vie: 'V', sab: 'S', dom: 'D',
};

export const DIAS_LARGO = {
  lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves',
  vie: 'Viernes', sab: 'Sábado', dom: 'Domingo',
};

/* Margen sobre el objetivo de comida antes de contar como fallo. */
export const MARGEN_COMIDA = 0.10;

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
