/* ============================================================
   MichiFit · el aparato, con imágenes
   Misma geometría que el Tamagotchi dibujado en SVG, pero la carcasa
   y el michi son PNG. Si una imagen no está, cae al dibujo de siempre,
   así la app nunca se rompe por un archivo que falta.

   Archivos que espera, en public/michi/:
     huevo-<estilo>-<color>.png   la carcasa, 660x900 (liso) o 751x1024
                                  (pixel). Transparente alrededor Y en el
                                  hueco de la pantalla. Las genera
                                  `pixel/tenir_huevo.py` desde una sola
                                  imagen: ver ESTILOS y COLORES abajo.
     <estado>.png         360x360, transparente
   Los nombres de estado los define ESTADOS_IMAGEN (abajo).
   ============================================================ */

import { useEffect, useState } from 'react';
import { useT } from '../i18n/index.jsx';
import Tamagotchi from './Tamagotchi.jsx';
import { rotulosDeBotones, iconoDe } from './anillos.js';
import './tamagotchi.css';

/* Geometría medida sobre el PNG del huevo (660x900): el hueco de la
   pantalla va transparente, así que se detecta solo buscando la mancha
   transparente rodeada de carcasa. Si cambias el dibujo, vuelve a
   medirlo con `pixel/medir_huevo.py`; los números son porcentajes, así
   que valen para cualquier tamaño de imagen mientras la proporción y
   el diseño no cambien. */
const PANTALLA = { left: 25.30, top: 30.89, width: 49.55, height: 41.67 };

/* Zona útil del michi dentro de la pantalla: se deja aire arriba para
   las barras y el rótulo, que ocupan un 30%. Estaba en 14 de cuando
   había dos barras; con cuatro, una pose alta se habría metido debajo
   de ellas. El michi se apoya abajo, así que el borde de abajo es el
   que manda y se deja donde estaba. */
/* La zona donde vive el michi. `height` se quitó el 2026-09-16: ahora
   baja hasta la banda de iconos, que es la que manda (ver el render). */
const ZONA = { top: 30 };

const RUTA = '/michi';

/* La carcasa se elige en Ajustes: por ahora solo el color, en pixel art.
   Salen de teñir una sola imagen por código, conservando su luminosidad
   —que es donde vive el relieve— y cambiándole el tono. Solo se
   descarga la que estés usando.

   El acabado liso está hecho y probado, pero fuera de la app: sus
   siete imágenes están en `_CUARENTENA/carcasas-lisas/`. Para
   recuperarlo basta devolverlas a `public/michi/` y añadir 'liso' a
   esta lista; el selector de acabado reaparece solo, porque solo se
   dibuja cuando hay más de uno. */
export const ESTILOS = ['pixel'];

/* Los colores del michi. El naranja son los dibujos originales, sin
   sufijo; gris y blanco los genera `pixel/tenir_michi.py` a partir de
   ellos conservando el relieve, los mofletes y los ojos. El negro entra
   el 2026-09-17 y no es un tinte: Albert lo dibujó en su propia model
   sheet, como los otros tres, y sale de
   `pixel/recortar_model_sheets.py` igual que ellos.

   Se llamaba `MICHIS` hasta el 2026-09-12, y ese era el problema:
   `pixel/michis.js` exportaba OTRO `MICHIS` que no tenia nada que ver
   —las cinco siluetas de cuerpo de antes del replanteamiento— y
   `Tamagotchi.jsx` importaba aquel mientras Ajustes y Lore importaban
   este. Dos cosas distintas con el mismo nombre en el mismo arbol es
   de las que muerden a los seis meses, buscando una y encontrando la
   otra. Aquel archivo se fue a `_CUARENTENA/cuerpos-antiguos/` el
   2026-09-13, asi que la colision ya no puede volver; el nombre largo
   se queda porque describe mejor lo que hay: colores, no michis. */
export const COLORES_MICHI = ['naranja', 'gris', 'blanco', 'negro'];
export const COLORES = ['naranja', 'rojo', 'amarillo', 'verde', 'azul', 'blanco', 'negro'];
/* El michi arranca GRIS porque Ninja es gris (ver `LORE.md`). El huevo
   sigue naranja: ese es el color de marca, y el logo va a juego.

   Hasta el 2026-09-12 arrancaba naranja, y eso hacia que «Adoptar a
   Ninja» te diera un gato que no era Ninja. Decision de Albert: gris
   de fabrica, y el color se elige al final de la historia — los dos,
   el del huevo y el del gato. El naranja y el blanco no son otro
   Ninja, son otros gatos. */
export const APARATO_POR_DEFECTO = { estilo: 'pixel', color: 'naranja', michi: 'gris' };

/* El sufijo del color del michi. El naranja no lleva: sus archivos son
   los originales y renombrarlos habria roto el respaldo. */
function sufijoMichi(aparato) {
  const c = COLORES_MICHI.includes(aparato?.michi) ? aparato.michi : COLORES_MICHI[0];
  return c === 'naranja' ? '' : `-${c}`;
}

/* Cinco puntitos, llenos en proporcion a `valor` (0 a 100). Se redondea:
   al 75% de la sed salen 4 de 5, o sea que falta uno y se ve. */
const PUNTOS = 5;
function Puntos({ valor }) {
  const llenos = Math.round(Math.max(0, Math.min(100, valor ?? 0)) / 100 * PUNTOS);
  return (
    <div className="puntos" aria-hidden="true">
      {Array.from({ length: PUNTOS }, (_, i) => <i key={i} className={i < llenos ? 'on' : ''} />)}
    </div>
  );
}

function rutaHuevo(aparato) {
  const estilo = ESTILOS.includes(aparato?.estilo) ? aparato.estilo : APARATO_POR_DEFECTO.estilo;
  const color = COLORES.includes(aparato?.color) ? aparato.color : APARATO_POR_DEFECTO.color;
  return `${RUTA}/huevo-${estilo}-${color}.png`;
}

/* El escenario cambia con lo que has hecho hoy: si entrenaste sale el
   gimnasio, si andaste la calle, y si no, casa. Da un motivo más para
   mirar al michi cada día. */
/* `parque` y `cocina` entran el 2026-09-16 con los fondos largos de
   Albert. El parque mide 1817x544 —mas de tres veces el ancho de la
   ventana— y CIERRA EN BUCLE: se recorto por dos columnas que ya
   casaban solas, en vez de fundir los bordes, porque el fundido dejaba
   un pilar fantasma. Ver `pixel/fondos_largos.py`. */
const ESCENARIOS = {
  /* El gimnasio es el nuevo de Albert desde el 2026-09-19 (antes se
     probaba aparte como `gimnasioNuevo`). El de antes esta en
     `_CUARENTENA/fondos-antiguos/`. */
  gimnasio: '/fondos/gimnasio.png',
  casa: '/fondos/casa.png',
  cocina: '/fondos/cocina.png',
  parque: '/fondos/parque.png',
  /* Entra el 2026-09-18: la cama centrada da la sensacion de que el
     michi esta durmiendo DE VERDAD encima, y no de pie en el salon con
     los ojos cerrados. Antes `dormir` usaba `casa`. */
  dormir: '/fondos/BG_dormir.png',
};
export const ESCENARIOS_DISPONIBLES = Object.keys(ESCENARIOS);
/* Los que se desplazan solos. Solo el parque, de momento: es el unico
   dibujado para que el final empalme con el principio, y desplazar uno
   que no cierra se ve como un salto cada vuelta. */
const PANEA = new Set(['parque']);

/* Los tres botones del aparato, medidos sobre el PNG escaneando la fila
   que los cruza. El area de toque es mayor que el dibujo: un dedo no
   acierta un circulo de 27 px. */
/* Las dos carcasas resultaron tener los botones casi en el mismo sitio,
   asi que una sola medida vale para ambas. La que habia para el pixel
   art (24,8 / 49,9 / 75,0) estaba MAL: sus botones estan en 34/50/66, y
   los de los lados quedaban a nueve puntos de su dibujo. Se notaba poco
   porque el area de toque es ancha a proposito, pero fallaba. */
/* Solo la posición: lo que dice cada botón depende de si hay un anillo
   abierto, y lo decide `rotulosDeBotones` en `anillos.js`. Los `id` son
   los de siempre —vienen de cuando eran mimar/escena/dormir— y se
   quedan porque son la clave que usa el CSS para colocarlos. */
const BOTONES = [
  { id: 'mimar',  cx: 33.8 },
  { id: 'accion', cx: 49.8 },
  { id: 'dormir', cx: 65.8 },
];
const BOTON_Y = 84.6;

export default function TamagotchiPNG({
  /* OJO: `estado` es el NOMBRE DEL ARCHIVO del michi, no un humor ni un
     cuerpo. `michi` -> michi.png / michi-gris.png / michi-blanco.png.

     Se llamaba asi por herencia del componente SVG de al lado, donde
     `estado` era la clave de una tabla de sprites y `kawaii` una clave
     valida. Aqui `kawaii` no podia funcionar NUNCA, porque no existe
     ningun `kawaii*.png`: la cadena de respaldo se lo comia y acababa
     cayendo a `michi.png`, que es el naranja.

     Era el valor por defecto hasta el 2026-09-12, y eso significa que
     cualquiera que olvidara pasar `estado` perdia el color elegido sin
     enterarse. Le paso a la bienvenida. Ahora el defecto es `michi`,
     que es el unico dibujo que existe seguro para los tres colores.

     El equivoco ya no puede repetirse: desde el 2026-09-13 el
     componente de al lado no recibe `estado` ni dibuja sprites. */
  estado = 'michi',
  size = 230,
  iconos = [],
  puntos = 0,
  dormido = false,
  escenario = 'casa',
  mimando = false,
  nivel = null,        // { emoji, nombre, progreso, xp, xpSiguiente }
  felicidad = null,    // 0-100, o null para no pintar la barra
  denoche = false,     // de noche la barra se congela y se dice
  cuidado = null,      // { agua, orden, cacas, sed, sucio } de engine/cuidados.js
  menu = null,         // { items: [{ id, etiqueta }], indice } — el anillo
  pose = null,         // 'dormido' | 'comiendo' | 'entrenando' | null (manda sobre el cuerpo)
  rotulo = null,       // qué está haciendo, entre las barras y el michi
  mensaje = null,      // texto que sale al tocar la PANTALLA ("cómo va")
  onBoton,
  onPantalla,          // tocar el cristal: el michi cuenta cómo va
  aparato = APARATO_POR_DEFECTO,   // { estilo, color } de la carcasa
  ...resto
}) {
  const t = useT();
  const [sinHuevo, setSinHuevo] = useState(false);
  const [intento, setIntento] = useState(0);
  /* Lo que dice cada botón depende de si hay anillo abierto. */
  /* `menu.abierto`, y NO `Boolean(menu)`. Hasta el 2026-09-16 valian lo
     mismo porque el menu llegaba null estando cerrado; desde que la
     banda de iconos vive SIEMPRE abajo, `menu` existe siempre y esa
     comprobacion daba «abierto» a todas horas: los tres botones decian
     «Siguiente / Aceptar / Cerrar» en reposo, cuando dos de ellos no
     hacen nada. Un rotulo que miente es peor que no tenerlo
     (`anillos.js`), y ademas el `disabled` sale de aqui: los botones
     apagados se podian pulsar. */
  const rotulos = rotulosDeBotones(Boolean(menu?.abierto));

  /* Cadena de respaldo, de lo más específico a lo más general:
       1. el michi en esta pose   (michi_durmiendo.png)
       2. la pose suelta          (durmiendo.png)
       3. el michi de pie         (michi.png)
     Y si no hay ninguna, el aparato dibujado en SVG. Así se pueden ir
     añadiendo dibujos de uno en uno: mientras falte el de una pose, sale
     el michi de pie y no se rompe nada. */
  const c = sufijoMichi(aparato);
  /* El `new Set` NO es aseo: es lo que hace que la cadena funcione.

     El michi naranja no lleva sufijo, así que con él los dos primeros
     candidatos salen IDÉNTICOS. Al fallar el primero, el respaldo
     reintentaba exactamente la misma URL: React no veía cambiar el
     `src`, el navegador no volvía a pedir un 404 que ya conocía, no
     saltaba otro `onError`... y el michi se quedaba invisible para
     siempre. Con los michis gris y blanco no pasaba, porque sus
     candidatos sí eran distintos.

     Salió al probar el michi sediento, cuyo dibujo aún no existe. */
  const candidatos = [...new Set([
    pose && `${RUTA}/${estado}_${pose}${c}.png`,
    pose && `${RUTA}/${estado}_${pose}.png`,
    `${RUTA}/${estado}${c}.png`,
    `${RUTA}/michi.png`,
  ].filter(Boolean))];
  const src = candidatos[intento];

  /* Al cambiar de pose se vuelve a intentar desde arriba: si no, una
     imagen que faltó una vez quedaría descartada para siempre. */
  useEffect(() => { setIntento(0); }, [pose, estado, aparato?.michi]);
  useEffect(() => { setSinHuevo(false); }, [aparato?.estilo, aparato?.color]);

  /* Dos respaldos independientes. Si falta la carcasa se dibuja en SVG,
     pero el michi de la imagen se sigue viendo encima: sin esto, faltar
     `huevo.png` escondía también las ilustraciones. */
  return (
    <>
    <div className={`mf-tamapng ${dormido ? 'dormido' : ''}`}
         style={{ width: size, height: size * (1024 / 751) }}>
      {sinHuevo ? (
        <div className="mf-tamapng-huevo">
          {/* Solo la carcasa: el gato lo pone la imagen de encima.
              Hasta el 2026-09-13 habia que decirlo con dos props —un
              `estado="kawaii"` literal, clave de una tabla de sprites
              que ya no existe, y un `sinMichi` para que no la pintara—.
              Ahora ese componente no sabe dibujar michis y no hace
              falta pedirselo. */}
          <Tamagotchi size={size} iconos={iconos}
                      puntos={puntos} dormido={dormido} {...resto} />
        </div>
      ) : (
        <img className="mf-tamapng-huevo" src={rutaHuevo(aparato)} alt=""
             onError={() => setSinHuevo(true)} />
      )}

      <div className="mf-tamapng-pantalla"
           style={{
             left: `${PANTALLA.left}%`, top: `${PANTALLA.top}%`,
             width: `${PANTALLA.width}%`, height: `${PANTALLA.height}%`,
             background: sinHuevo ? 'transparent' : undefined,
           }}>
        {/* Franja de arriba: el nivel del michi y su barra de experiencia.
            Va DENTRO de la pantalla, como en un tamagotchi de verdad. */}
        {!sinHuevo && nivel && (
          <div className="mf-tamapng-cabecera">
            <div className="mf-tamapng-nivel">
              <span className="et">{t('nivelesCorto.' + nivel.nivel)}</span>
              <div className="barra">
                <i style={{ width: `${Math.round((nivel.progreso ?? 0) * 100)}%` }} />
              </div>
            </div>

            {/* DOS LENGUAJES a proposito (SIMPLICIDAD.md, punto 3): la
                barra de nivel es continua y PUNTUA; HAPPY, WATER y CLEAN
                son cinco puntitos y NO puntuan. Antes las cuatro eran la
                misma barra y quien no leia el «?» creia que rellenar el
                agua servia para algo. */}
            {felicidad != null && (
              <div className={`mf-tamapng-nivel feliz ${denoche ? 'denoche' : ''}`}>
                <span className="et">{denoche ? 'ZZZ' : 'HAPPY'}</span>
                <Puntos valor={felicidad} />
              </div>
            )}

            {/* Agua y orden. Los rótulos van en inglés corto adrede: la
                fuente de la pantallita (Press Start 2P) solo tiene
                alfabeto latino, así que en japonés saldrían cuadrados.
                Es la misma razón por la que NIVEL dice el nombre del
                nivel transliterado y no el traducido. */}
            {cuidado && (
              <>
                <div className="mf-tamapng-nivel agua">
                  <span className="et">WATER</span>
                  <Puntos valor={cuidado.agua} />
                </div>
                <div className="mf-tamapng-nivel orden">
                  <span className="et">CLEAN</span>
                  <Puntos valor={cuidado.orden} />
                </div>
              </>
            )}

            {/* Qué está haciendo. Va DENTRO de la cabecera, detrás de las
                barras, y no colocado a una altura fija: así cae siempre
                justo debajo de la última barra, haya dos o cuatro. Con
                un `top` fijo, añadir las de agua y orden lo dejó tapando
                a CLEAN, y eso solo se vio ampliando la pantalla. */}
            {rotulo && <div className="mf-tamapng-rotulo">{rotulo}</div>}

            {/* El mensaje de tocar el cristal va AQUI, en el flujo y justo
                detras del rotulo, y no colgado desde abajo. Colgado desde
                abajo, al tener varias lineas crecia hacia ARRIBA y se
                montaba encima de CLEAN y de «EN CASA». Lo vio Albert. En
                el flujo cae siempre dos pixeles por debajo del rotulo,
                haya las barras que haya. */}
            {mensaje && !dormido && (
              <div className="mf-tamapng-dialogo">{mensaje}</div>
            )}
          </div>
        )}

        {/* El escenario. Los que panean NO van como `img`: van de fondo
            CSS repetido, que es lo unico que puede desplazarse sin fin
            sin duplicar el elemento. El resto se quedan como imagen,
            que es mas simple y es lo que ya habia. */}
        {PANEA.has(escenario) ? (
          <div className="mf-tamapng-escena panea"
               style={{ backgroundImage: `url(${ESCENARIOS[escenario]})` }}>
            {/* La imagen la hereda de su padre (`background-image:
                inherit`): asi la ruta se escribe una sola vez. */}
            <i />
          </div>
        ) : (
          <img className="mf-tamapng-escena"
               src={ESCENARIOS[escenario] ?? ESCENARIOS.casa} alt="" />
        )}

        {/* El anillo de iconos, como en un tamagotchi. El seleccionado
            lleva recuadro y su nombre al lado: sin el nombre, un icono
            de 13 px no se entiende, y el problema que estamos
            resolviendo es justo que la gente no sabe qué hace cada cosa.

            Va FUERA de `mf-tamapng-zona` a propósito: dentro, su `top`
            se medía contra la zona del michi y no contra la pantalla, y
            acababa cayendo en mitad del gato.

            Los iconos son pixel art de 12x12 dibujados a mano, y se
            pintan A SU TAMANO exacto: el archivo mide 96 y se ve a 12,
            que es una reduccion de 8 a 1 justa y no emborrona nada. */}
        {menu?.items?.length > 0 && (
          <div className={`mf-tamapng-anillo ${menu.abierto ? 'abierto' : 'reposo'}`}>
            {/* EL NOMBRE VA PRIMERO, y por tanto arriba: los iconos se
                quedan pegados al borde de abajo, que es donde estan los
                mandos de un tamagotchi. Peticion de Albert del
                2026-09-16, y se hace cambiando el ORDEN DEL DOM y no con
                `order` de CSS: asi lo que lee un lector de pantalla es
                lo mismo que se ve, en el mismo orden.

                Se pinta SIEMPRE, aunque en reposo vaya vacío (un espacio
                duro). Si se quitara del árbol, la banda encogería al
                cerrar el menú y la escena daría un salto cada vez. Es el
                mismo fallo que el de los rótulos de los botones del
                2026-09-12, y por eso aquí se reserva el sitio en vez de
                quitarlo. */}
            <div className="nombre">
              {menu.abierto ? menu.items[menu.indice]?.etiqueta : ' '}
            </div>
            <div className="iconos">
              {menu.items.map((it, i) => (
                <span key={it.id}
                      className={`it ${menu.abierto && i === menu.indice ? 'sel' : ''}`}>
                  <img src={iconoDe(it.id)} alt="" />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* La zona acaba donde empieza la banda de iconos, y por eso va
            con `bottom` y no con `height`: la banda es la unica que sabe
            lo que mide (`--anillo-alto`), asi que el michi se apoya
            SOBRE ella sin que nadie tenga que repetir el numero. */}
        <div className="mf-tamapng-zona"
             style={{ top: `${ZONA.top}%`, bottom: 'var(--anillo-alto)' }}>
          {src && (
            <img className={`mf-tamapng-michi ${pose ? `pose-${pose}` : ''}`} src={src} alt=""
                 onError={() => setIntento((i) => i + 1)} />
          )}

          {/* Las cacas kawaii, en el suelo. Van dentro de la zona del
              michi para que se apoyen en la misma línea que él, y a la
              izquierda y la derecha para no taparlo. Son emoji: no hace
              falta dibujo, y el 💩 se ve igual en todos los sistemas. */}
          {cuidado?.cacas > 0 && !dormido && (
            <div className="mf-tamapng-cacas" aria-hidden="true">
              {Array.from({ length: cuidado.cacas }, (_, i) => (
                <span key={i} className={`caca c${i}`}>💩</span>
              ))}
            </div>
          )}

          {mimando && (
            <div className="mf-tamapng-mimos" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <i key={i} style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          )}

          {/* Tres zetas sueltas y no un solo texto con espacios: asi
              cada una lleva su propio sitio y su propio tamaño, y salen
              en diagonal ascendente -como un comic-, pegadas a la
              cabeza del gato y no perdidas en la esquina de toda la
              zona. Van POR ENCIMA de `mf-tamapng-apagada` (mismo
              z-index de siempre) porque esa capa oscurece la pantalla
              entera, sprite incluido: sin esto, dormido, la señal de
              que sigue "vivo" desaparecería con el resto. */}
          {dormido && (
            <div className="mf-tamapng-zzz2" aria-hidden="true">
              <span className="z1">z</span>
              <span className="z2">z</span>
              <span className="z3">Z</span>
            </div>
          )}

          {/* Sin cabecera (falta el huevo o no hay nivel), el mensaje no
              tiene rotulo detras del que ponerse y se queda donde
              estaba. */}
          {mensaje && !dormido && (sinHuevo || !nivel) && (
            <div className="mf-tamapng-dialogo">{mensaje}</div>
          )}
        </div>

        {dormido && <div className="mf-tamapng-apagada" />}

        {/* El cristal entero es un botón: tocarlo es preguntarle al
            michi cómo va. Fue el botón del medio hasta que ese pasó a
            abrir el anillo. */}
        {onPantalla && !sinHuevo && (
          <button className="mf-tamapng-toque" onClick={onPantalla}
                  aria-label={t('aparato.comoVa')} title={t('aparato.comoVa')} />
        )}
      </div>

        {/* Botones del aparato. Van encima del PNG, con área de toque
            generosa: el dibujo es un círculo de 27 px y un dedo no
            acierta. */}
        {onBoton && !sinHuevo && BOTONES.map((b) => (
          /* `rotulos[b.id]` es `null` cuando ese boton no hace nada
             ahora mismo: en reposo, el centro y la derecha. Se pinta
             igual —quitarlo movería los otros dos de sitio— pero
             apagado, y sin nombre que leer en voz alta. */
          <button key={b.id} className={`mf-tamapng-boton ${b.id}`}
                  style={{ left: `${b.cx}%`, top: `${BOTON_Y}%` }}
                  onClick={() => onBoton(b.id)}
                  disabled={!rotulos[b.id]}
                  aria-label={rotulos[b.id] ? t(rotulos[b.id]) : undefined}
                  title={rotulos[b.id] ? t(rotulos[b.id]) : undefined} />
        ))}
      </div>

      {/* Qué hace cada botón AHORA MISMO, en fila bajo el aparato.

          Es lo que resuelve el problema de siempre: los tres botones son
          la interfaz principal y su significado CAMBIA según haya un
          anillo abierto o no. Un cartelito de bienvenida se lee una vez
          y se olvida; esto enseña la gramática cada vez que la usas, y
          además confirma lo que va a pasar antes de pulsar.

          Fuera del huevo y no impreso en la carcasa, aunque un
          tamagotchi de verdad los lleve impresos: abajo la carcasa se
          estrecha rápido —a un 92% de alto ya solo quedan 295 px de
          751— y en tailandés estos rótulos son largos. Dentro no caben
          sin salirse por el borde.

          Juntos en el medio, no repartidos por todo el ancho: pegados
          se leen como un grupo que pertenece a los botones, y sueltos
          parecían tres cosas sin relación. Tampoco clavados al centro
          exacto de cada botón —eso quedaba alineado al píxel y se
          SOLAPABA, porque los botones están a 48 px y «Registrar» mide
          64—. Son tres y van en orden: a cuál corresponde cada uno se ve
          solo. */}
      {onBoton && !sinHuevo && (
        <div className="mf-tamapng-rotulos" aria-hidden="true"
             style={{
               width: size,
               /* Subidos al hueco transparente que el PNG del huevo deja
                  por debajo de la carcasa: esta acaba al 96% del alto, o
                  sea que sobran cuatro puntos que no dibujan nada. Metido
                  ahi, el marcador de abajo entra en la misma pantalla.
                  Va en linea y no en el CSS porque depende de `size`. */
               marginTop: -Math.round(size * (1024 / 751) * 0.036),
             }}>
          {/* Solo los que hacen algo. Un `span` vacio NO es inofensivo:
              lleva fondo y borde, asi que se veria como una pastilla en
              blanco, y ademas ocupa sitio y descoloca a los demas.

              Y cuando queda UNO SOLO —en reposo, donde solo la izquierda
              hace algo— se coloca debajo de SU boton en vez de en el
              centro del grupo. Centrado parecia el rotulo del boton del
              medio, que es justo el que no hace nada. Con uno solo no
              hay riesgo de solape, que es lo que obligo a agrupar los
              tres. */}
          {(() => {
            const activos = BOTONES.filter((b) => rotulos[b.id]);
            if (activos.length === 1) {
              const b = activos[0];
              return (
                <span className="solo" style={{ left: `${b.cx}%` }}>
                  {t(rotulos[b.id])}
                </span>
              );
            }
            return activos.map((b) => (
              <span key={`et-${b.id}`}>{t(rotulos[b.id])}</span>
            ));
          })()}
        </div>
      )}
    </>
  );
}
