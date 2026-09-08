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
