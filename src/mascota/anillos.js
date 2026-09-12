/* ============================================================
   MichiFit · el anillo de los botones del aparato

   Los tres botones dejaron de ser un juguete el 2026-09-11 y pasaron a
   ser la interfaz. El 2026-09-12 cambió la GRAMÁTICA, porque la que
   había confundía a la gente:

     · IZQUIERDA  abre el anillo. Dentro, pasa al siguiente icono,
                  y al llegar al final vuelve a empezar.
     · CENTRO     acepta el icono seleccionado.
     · DERECHA    cierra el anillo.

   En reposo, el centro y la derecha NO HACEN NADA: sin anillo abierto
   no hay nada que aceptar ni nada que cerrar. Es deliberado que no
   hagan «algo útil» de paso — un botón que cambia de trabajo según
   dónde estés es justo lo que se viene a quitar.

   POR QUÉ SE CAMBIÓ. Lo de antes era: izquierda salir, centro abrir-o-
   siguiente, derecha aceptar. Dos problemas, y los dos los trajeron
   personas de fuera probando la app:

     1. el botón CENTRAL significaba dos cosas según dónde estuvieras.
        Lo defendí aquí mismo diciendo que «el contexto lo hace
        inequívoco». No lo hacía.
     2. ACEPTAR estaba en el borde, que es donde debe estar lo que no
        quieres pulsar sin querer, no lo que más se pulsa.

   Y lo nuevo no es un invento: A pasa al siguiente, B acepta y C
   cancela es la disposición de los tamagotchis de Bandai. Quien haya
   tenido uno ya se la sabe, y quien no, la aprende una vez.

   UN SOLO ANILLO, no dos. Antes había uno de cuidar y otro de medir,
   cada uno con su botón. Con la izquierda como única puerta, dos
   anillos no tienen cómo distinguirse, así que es una sola vuelta que
   los recorre todos. Cuesta más llegar al último —siete pulsaciones
   contra cuatro— y por eso el orden NO es arbitrario: ver `ANILLO`.

   Las salidas siguen siendo tres, porque un tamagotchi de verdad venía
   con manual de papel y esto no: el botón derecho, la vuelta sola a los
   ocho segundos (`ESPERA_MS`), y tocar fuera. Lo que desapareció es el
   icono de SALIR dentro del anillo, que sobra cuando hay un botón
   dedicado a cerrar. Su dibujo sigue en `pixel/iconos_anillo.py` por si
   vuelve.
   ============================================================ */

/* Vuelta sola a neutral. Ocho segundos es lo que tarda alguien en
   distraerse sin sentir que la app le ha quitado la pantalla de golpe. */
export const ESPERA_MS = 8000;

/* El anillo entero, en el orden en que se recorre.

   Primero los CUIDADOS y después los DATOS, y no al revés, por dos
   razones. Los cuidados son de un toque —pulsas y ya— mientras que los
   datos abren el editor del día, así que lo barato va delante. Y son el
   anzuelo: lo que hace que abras la app un martes sin nada que apuntar
   (`MECANICA.md` 8b). Ponerlos detrás de cuatro pulsaciones los
   escondía.

   `dormir` cierra la vuelta. Estaba en el botón derecho hasta hoy, y al
   pasar ése a cerrar se quedó sin sitio; aquí dentro es un cuidado más,
   que es lo que siempre fue.

   NADA de `cuidado: true` toca la mecánica — ni experiencia, ni nivel,
   ni cumplimiento del pacto. Eso lo vigila `pruebas/cuidados.mjs`, y el
   día que se ponga en rojo es que el bucle ha empezado a premiar pulsar
   botones en vez de cuidarte.

   `escena` es lo que se ve en la pantalla mientras el cursor está
   encima, y es media explicación por sí sola: el michi andando por la
   calle dice «pasos» sin escribirlo. `campo` es el del editor del día
   que se abre al aceptar. */
export const ANILLO = [
  { id: 'mimar',   clave: 'anillo.mimar',   cuidado: true },
  { id: 'agua',    clave: 'anillo.agua',    cuidado: true },
  { id: 'limpiar', clave: 'anillo.limpiar', cuidado: true },
  { id: 'dormir',  clave: 'aparato.dormir', cuidado: true },
  { id: 'pasos',   clave: 'anillo.pasos',   escena: 'pasear',   campo: 'pasos' },
  { id: 'entreno', clave: 'anillo.entreno', escena: 'entrenar', campo: 'entreno' },
  { id: 'comida',  clave: 'anillo.comida',  escena: 'comer',    campo: 'comida' },
  { id: 'sueno',   clave: 'anillo.sueno',   escena: 'dormir',   campo: 'sueno' },
];

/* La ruta del icono sale del id: los PNG se llaman igual. Un icono
   que faltara dejaria un hueco y nada mas — el nombre debajo sigue
   diciendo lo que hace. */
export const iconoDe = (id) => `/iconos-anillo/${id}.png`;

/* Hubo dos anillos hasta el 2026-09-12 y `modo` decía en cuál estabas.
   Ahora solo hay uno, así que `modo` es únicamente «abierto o no». */
export const anilloDe = (abierto) => (abierto ? ANILLO : null);

/* Qué dice cada botón AHORA MISMO. No es un adorno: es el `aria-label`
   y el `title`, o sea lo que oye quien usa un lector de pantalla y lo
   que lee quien pasa el ratón. Si los botones cambian de significado y
   el rótulo se queda fijo, el rótulo miente — y un rótulo que miente es
   peor que no tenerlo.

   `null` significa que ese botón no hace nada ahora mismo: en reposo el
   centro y la derecha están apagados. Quien pinte esto tiene que saber
   tratar el `null`, y por eso no se devuelve una cadena vacía — una
   cadena vacía se pinta sin que nadie se entere. */
export function rotulosDeBotones(abierto) {
  return abierto
    ? { mimar: 'anillo.siguiente', accion: 'anillo.aceptar', dormir: 'anillo.cerrar' }
    : { mimar: 'anillo.abrir', accion: null, dormir: null };
}

/* El siguiente icono, dando la vuelta al llegar al final. */
export function siguienteIndice(indice) {
  return (indice + 1) % ANILLO.length;
}
