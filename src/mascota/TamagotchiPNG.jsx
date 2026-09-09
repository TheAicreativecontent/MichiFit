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
import './tamagotchi.css';

/* Geometría medida sobre el PNG del huevo (660x900): el hueco de la
   pantalla va transparente, así que se detecta solo buscando la mancha
   transparente rodeada de carcasa. Si cambias el dibujo, vuelve a
   medirlo con `pixel/medir_huevo.py`; los números son porcentajes, así
   que valen para cualquier tamaño de imagen mientras la proporción y
   el diseño no cambien. */
const PANTALLA = { left: 25.30, top: 30.89, width: 49.55, height: 41.67 };

/* Zona útil del michi dentro de la pantalla: se deja aire arriba para la
   barra de puntos. El aparato de Alberto no tiene bandas dibujadas, así
   que la pantalla es toda del michi. */
const ZONA = { top: 14, height: 84 };

const RUTA = '/michi';

/* La carcasa se elige en Ajustes: dos acabados por siete colores. Las
   catorce salen de teñir una sola imagen por código, conservando su
   luminosidad —que es donde vive el relieve— y cambiándole el tono.
   Solo se descarga la que estés usando. */
export const ESTILOS = ['liso', 'pixel'];
export const COLORES = ['naranja', 'rojo', 'amarillo', 'verde', 'azul', 'blanco', 'negro'];
export const APARATO_POR_DEFECTO = { estilo: 'liso', color: 'naranja' };

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
const BOTONES = [
  { id: 'mimar',  cx: 33.8, titulo: 'Mimar' },
  { id: 'accion', cx: 49.8, titulo: 'Cambiar de escena' },
  { id: 'dormir', cx: 65.8, titulo: 'Dormir' },
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

  /* Cadena de respaldo, de lo más específico a lo más general:
       1. este cuerpo en esta pose   (gordo_dormido.png)
       2. la pose sin cuerpo         (dormido.png)
       3. este cuerpo de pie         (gordo.png)
       4. el michi base              (kawaii.png)
     Y si no hay ninguna, el aparato dibujado en SVG. Así se pueden ir
     añadiendo dibujos sin que falte nada por el camino. */
  const candidatos = [
    pose && `${RUTA}/${estado}_${pose}.png`,
    pose && `${RUTA}/${pose}.png`,
    `${RUTA}/${estado}.png`,
    `${RUTA}/kawaii.png`,
  ].filter(Boolean);
  const src = candidatos[intento];

  /* Al cambiar de pose se vuelve a intentar desde arriba: si no, una
     imagen que faltó una vez quedaría descartada para siempre. */
  useEffect(() => { setIntento(0); }, [pose, estado]);
  useEffect(() => { setSinHuevo(false); }, [aparato?.estilo, aparato?.color]);

  /* Dos respaldos independientes. Si falta la carcasa se dibuja en SVG,
     pero el michi de la imagen se sigue viendo encima: sin esto, faltar
     `huevo.png` escondía también las ilustraciones. */
  return (
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
          </div>
        )}

        <img className="mf-tamapng-escena"
             src={ESCENARIOS[escenario] ?? ESCENARIOS.casa} alt="" />

        {/* Qué está haciendo. Va bajo las barras y sobre el michi, que es
            el hueco que quedaba libre en la pantalla. */}
        {!sinHuevo && rotulo && (
          <div className="mf-tamapng-rotulo">{rotulo}</div>
        )}

        <div className="mf-tamapng-zona"
             style={{ top: `${ZONA.top}%`, height: `${ZONA.height}%` }}>
          {src && (
            <img className="mf-tamapng-michi" src={src} alt=""
                 onError={() => setIntento((i) => i + 1)} />
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

        {/* El cristal entero es un botón: tocarlo es preguntarle al michi
            cómo va. Antes eso era el botón del medio, que ahora sirve
            para cambiar de escena. */}
        {onPantalla && !sinHuevo && (
          <button className="mf-tamapng-toque" onClick={onPantalla}
                  aria-label="Cómo va" title="Cómo va" />
        )}
      </div>

      {/* Botones del aparato. Van encima del PNG, con área de toque
          generosa: el dibujo es un círculo de 27 px y un dedo no acierta. */}
      {onBoton && !sinHuevo && BOTONES.map((b) => (
        <button key={b.id} className={`mf-tamapng-boton ${b.id}`}
                style={{ left: `${b.cx}%`, top: `${BOTON_Y}%` }}
                onClick={() => onBoton(b.id)}
                aria-label={b.titulo} title={b.titulo} />
      ))}
    </div>
  );
}
