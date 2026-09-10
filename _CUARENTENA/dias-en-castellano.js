/* Sacado de `src/engine/constantes.js` el 2026-09-11.

   Los nombres de los dias de la semana, escritos en castellano fijo.
   Dejaron de usarse el 2026-09-09, cuando la app paso a hablar cinco
   idiomas: ahora salen del diccionario, en `dias.inicial` y `dias.largo`
   de `src/i18n/`.

   No es solo que sobraran: eran una trampa. Cualquiera que los importara
   sin darse cuenta pondria "Miercoles" en la pantalla de alguien que
   tiene la app en japones, y nada avisaria.

   Si algun dia hace falta una version que no dependa del diccionario
   —un export, un nombre de archivo—, esta aqui. */

export const DIAS_INICIAL = {
  lun: 'L', mar: 'M', mie: 'X', jue: 'J', vie: 'V', sab: 'S', dom: 'D',
};

export const DIAS_LARGO = {
  lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves',
  vie: 'Viernes', sab: 'Sábado', dom: 'Domingo',
};
