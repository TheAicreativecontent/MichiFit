/* ============================================================
   MichiFit · las escenas del michi
   Lo que el michi está haciendo: dónde está y en qué pose. El botón azul
   del aparato va pasando por esta lista en orden, como un tamagotchi de
   verdad, y el rótulo lo cuenta dentro de la pantalla.

   Esto es DECORADO, no mecánica: cambiar de escena no toca ningún dato ni
   da experiencia. Si diera, la gente le daría al botón en vez de moverse.

   Si no hay escena elegida a mano, se deduce de lo que has apuntado hoy
   (ver `escenaAutomatica`): así el aparato cuenta tu día solo.
   ============================================================ */

export const ESCENAS = [
  { id: 'casa',     escenario: 'casa',     pose: null,          rotulo: 'EN CASA' },
  { id: 'comer',    escenario: 'casa',     pose: 'comiendo',    rotulo: 'COMIENDO' },
  { id: 'entrenar', escenario: 'gimnasio', pose: 'entrenando',  rotulo: 'ENTRENANDO' },
  { id: 'pasear',   escenario: 'calle',    pose: 'andando',     rotulo: 'PASEANDO' },
  { id: 'dormir',   escenario: 'casa',     pose: 'durmiendo',    rotulo: 'DURMIENDO',
    dormido: true },
];

export const porId = (id) => ESCENAS.find((e) => e.id === id) ?? null;

/* La siguiente del ciclo. Sin escena aún, empieza por la primera. */
export function siguiente(id) {
  const i = ESCENAS.findIndex((e) => e.id === id);
  return ESCENAS[(i + 1) % ESCENAS.length].id;
}

/* Lo que se ve si el usuario no ha tocado el botón: el michi hace lo
   último que apuntaste hoy. Sin datos se queda en casa, que es lo
   honesto — no está paseando si no has andado. */
export function escenaAutomatica(entradaHoy = {}, accion = null, humor = null) {
  /* Celebrar no es una escena con escenario propio: es el michi en casa
     dando saltos. Por eso va aquí y no en la lista de arriba: el botón
     azul no debe poder ciclar hasta ella. */
  if (accion === 'celebrando') return { ...porId('casa'), id: 'celebrar', pose: 'celebrando' };
  if (accion === 'entrenando') return porId('entrenar');
  if (accion === 'comiendo') return porId('comer');

  /* El humor gana a lo que hiciste hoy. Que el michi esté contento o
     cansado dice mucho más que «hoy anduviste», y si no fuera así no se
     vería nunca: en cuanto apuntas cualquier cosa, la escena del día
     tapaba el humor para el resto de la jornada.
     Lo que hiciste hoy sigue saliendo cuando el michi no tiene nada
     particular que contar, y siempre está a mano en el botón azul. */
  if (humor) return { ...porId('casa'), pose: humor };

  if ((entradaHoy.entrenoMin ?? 0) > 0) return porId('entrenar');
  if ((entradaHoy.pasos ?? 0) > 0) return porId('pasear');
  return porId('casa');
}
