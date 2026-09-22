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
  { id: 'comer',    escenario: 'cocina',   pose: 'comiendo',    rotulo: 'COMIENDO' },
  { id: 'entrenar', escenario: 'gimnasio', pose: 'entrenando',  rotulo: 'ENTRENANDO' },
  /* Pasear se va al PARQUE (2026-09-16): es el unico fondo que cierra
     en bucle, asi que es el unico que puede desplazarse sin fin — y
     andar es justo la escena que pide movimiento.

     `calle.png` dejo de usarla nadie el 2026-09-16 (era el fondo de
     pasear y de la historia de Ninja, que ahora se cuenta con el comic)
     y se borro el 2026-09-19; sigue en el historial de git. */
  { id: 'pasear',   escenario: 'parque',   pose: 'andando',     rotulo: 'PASEANDO' },
  { id: 'dormir',   escenario: 'dormir',   pose: 'durmiendo',    rotulo: 'DURMIENDO',
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
  if (accion === 'entrenando') return porId('entrenar');
  if (accion === 'comiendo') return porId('comer');

  /* El humor gana a lo que hiciste hoy. Que el michi esté contento o
     triste dice mucho más que «hoy anduviste», y si no fuera así no se
     vería nunca: en cuanto apuntas cualquier cosa, la escena del día
     tapaba el humor para el resto de la jornada.
     Lo que hiciste hoy sigue saliendo cuando el michi no tiene nada
     particular que contar, y siempre está a mano en el botón azul. */
  const base = humor ? { ...porId('casa'), pose: humor }
    : (entradaHoy.entrenoMin ?? 0) > 0 ? porId('entrenar')
    : (entradaHoy.pasos ?? 0) > 0 ? porId('pasear')
    : porId('casa');

  /* Celebrar (el brinco corto de mimar/agua/limpiar/apuntar, y el largo
     de subir de nivel) NO cambia de escenario: salta ENCIMA de lo que ya
     se estaba viendo, solo con la pose celebrando por encima.

     Hasta el 2026-09-22 saltaba siempre a «casa», daba igual qué hubiera
     antes: si el michi estaba paseando en el parque (`pasos` de hoy) y
     mimabas al michi, el fondo cambiaba al del salón dos segundos y
     medio y volvía solo al parque al acabar — un parpadeo que Albert
     cazó nada más lanzarlo. La idea original («celebrar no es una
     escena con escenario propio») seguía siendo la correcta; lo que
     estaba mal era anclarla a «casa» en vez de a lo que hubiera debajo.
     No hace falta que vaya antes en la lista para que el botón azul no
     pueda ciclar hasta ella: sigue sin tener entrada propia en
     `ESCENAS`, así que `siguiente()` nunca la toca. */
  if (accion === 'celebrando') return { ...base, id: 'celebrar', pose: 'celebrando' };
  return base;
}
