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
import { rotulosDeBotones } from './anillos.js';
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
const ZONA = { top: 30, height: 68 };

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
   sufijo; los otros los genera `pixel/tenir_michi.py` a partir de ellos
   conservando el relieve, los mofletes y los ojos. */
export const MICHIS = ['naranja', 'gris', 'blanco'];
export const COLORES = ['naranja', 'rojo', 'amarillo', 'verde', 'azul', 'blanco', 'negro'];
export const APARATO_POR_DEFECTO = { estilo: 'pixel', color: 'naranja', michi: 'naranja' };

/* El sufijo del color del michi. El naranja no lleva: sus archivos son
   los originales y renombrarlos habria roto el respaldo. */
function sufijoMichi(aparato) {
  const c = MICHIS.includes(aparato?.michi) ? aparato.michi : MICHIS[0];
  return c === 'naranja' ? '' : `-${c}`;
}

function rutaHuevo(aparato) {
  const estilo = ESTILOS.includes(aparato?.estilo) ? aparato.estilo : APARATO_POR_DEFECTO.estilo;
  const color = COLORES.includes(aparato?.color) ? aparato.color : APARATO_POR_DEFECTO.color;
  return `${RUTA}/huevo-${estilo}-${color}.png`;
}

/* El escenario cambia con lo que has hecho hoy: si entrenaste sale el
   gimnasio, si andaste la calle, y si no, casa. Da un motivo más para
   mirar al michi cada día. */
const ESCENARIOS = { gimnasio: '/fondos/gimnasio.png', calle: '/fondos/calle.png', casa: '/fondos/casa.png' };

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
  estado = 'kawaii',
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
  menu = null,         // { items: [{ id, icono, etiqueta }], indice } — el anillo
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
  const rotulos = rotulosDeBotones(menu ? 'abierto' : null);

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
          <Tamagotchi estado={estado} size={size} iconos={iconos}
                      puntos={puntos} dormido={dormido} sinMichi {...resto} />
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

            {felicidad != null && (
              <div className={`mf-tamapng-nivel feliz ${denoche ? 'denoche' : ''}`}>
                <span className="et">{denoche ? 'ZZZ' : 'HAPPY'}</span>
                <div className="barra">
                  <i style={{ width: `${Math.round(felicidad)}%` }} />
                </div>
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
                  <div className="barra"><i style={{ width: `${cuidado.agua}%` }} /></div>
                </div>
                <div className="mf-tamapng-nivel orden">
                  <span className="et">CLEAN</span>
                  <div className="barra"><i style={{ width: `${cuidado.orden}%` }} /></div>
                </div>
              </>
            )}

            {/* Qué está haciendo. Va DENTRO de la cabecera, detrás de las
                barras, y no colocado a una altura fija: así cae siempre
                justo debajo de la última barra, haya dos o cuatro. Con
                un `top` fijo, añadir las de agua y orden lo dejó tapando
                a CLEAN, y eso solo se vio ampliando la pantalla. */}
            {rotulo && <div className="mf-tamapng-rotulo">{rotulo}</div>}
          </div>
        )}

        <img className="mf-tamapng-escena"
             src={ESCENARIOS[escenario] ?? ESCENARIOS.casa} alt="" />

        {/* El anillo de iconos, como en un tamagotchi. El seleccionado
            lleva recuadro y su nombre al lado: sin el nombre, un icono
            de 13 px no se entiende, y el problema que estamos
            resolviendo es justo que la gente no sabe qué hace cada cosa.

            Va FUERA de `mf-tamapng-zona` a propósito: dentro, su `top`
            se medía contra la zona del michi y no contra la pantalla, y
            acababa cayendo en mitad del gato.

            Los iconos son emoji de momento. Cuando Alberto tenga los
            suyos en pixel art, se cambia `icono` por una <img> y ya. */}
        {menu?.items?.length > 0 && (
          <div className="mf-tamapng-anillo">
            <div className="iconos">
              {menu.items.map((it, i) => (
                <span key={it.id} className={`it ${i === menu.indice ? 'sel' : ''}`}>
                  {it.icono}
                </span>
              ))}
            </div>
            <div className="nombre">{menu.items[menu.indice]?.etiqueta}</div>
          </div>
        )}

        <div className="mf-tamapng-zona"
             style={{ top: `${ZONA.top}%`, height: `${ZONA.height}%` }}>
          {src && (
            <img className="mf-tamapng-michi" src={src} alt=""
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

          {dormido && <span className="mf-tamapng-zzz2" aria-hidden="true">z z z</span>}

          {mensaje && !dormido && (
            <div className="mf-tamapng-dialogo">{mensaje}</div>
          )}
        </div>

        {dormido && <div className="mf-tamapng-apagada" />}

        {/* El cristal entero es un botón: tocarlo es preguntarle al
            michi cómo va. Fue el botón del medio hasta que ese pasó a
            abrir el anillo de medir. */}
        {onPantalla && !sinHuevo && (
          <button className="mf-tamapng-toque" onClick={onPantalla}
                  aria-label={t('aparato.comoVa')} title={t('aparato.comoVa')} />
        )}
      </div>

        {/* Botones del aparato. Van encima del PNG, con área de toque
            generosa: el dibujo es un círculo de 27 px y un dedo no
            acierta. */}
        {onBoton && !sinHuevo && BOTONES.map((b) => (
          <button key={b.id} className={`mf-tamapng-boton ${b.id}`}
                  style={{ left: `${b.cx}%`, top: `${BOTON_Y}%` }}
                  onClick={() => onBoton(b.id)}
                  aria-label={t(rotulos[b.id])} title={t(rotulos[b.id])} />
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
          {BOTONES.map((b) => (
            <span key={`et-${b.id}`}>{t(rotulos[b.id])}</span>
          ))}
        </div>
      )}
    </>
  );
}
