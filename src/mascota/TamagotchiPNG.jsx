/* ============================================================
   MichiFit · el aparato, con imágenes
   Misma geometría que el Tamagotchi dibujado en SVG, pero la carcasa
   y el michi son PNG. Si una imagen no está, cae al dibujo de siempre,
   así la app nunca se rompe por un archivo que falta.

   Archivos que espera, en public/michi/:
     huevo.png            660x900, transparente alrededor y en la pantalla
     <estado>.png         360x360, transparente
   Los nombres de estado los define ESTADOS_IMAGEN (abajo).
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from './Tamagotchi.jsx';
import './tamagotchi.css';

/* Geometría medida sobre el PNG del huevo (751x1024, pixel art): el
   hueco de la pantalla es transparente, así que se detecta solo.
   Si cambias el dibujo, vuelve a medirlo con pixel/medir_huevo.py. */
const PANTALLA = { left: 25.03, top: 30.27, width: 49.93, height: 42.29 };

/* Zona útil del michi dentro de la pantalla: se deja aire arriba para la
   barra de puntos. El aparato de Alberto no tiene bandas dibujadas, así
   que la pantalla es toda del michi. */
const ZONA = { top: 14, height: 84 };

const RUTA = '/michi';

export default function TamagotchiPNG({
  estado = 'kawaii',
  size = 230,
  iconos = [],
  puntos = 0,
  dormido = false,
  ...resto
}) {
  const [sinHuevo, setSinHuevo] = useState(false);
  const [intento, setIntento] = useState(0);

  /* Cadena de respaldo: si no existe la imagen del estado exacto, se usa
     el michi base; si tampoco, se dibuja el aparato en SVG. Así se pueden
     ir subiendo las imágenes de una en una sin que nada se rompa. */
  const candidatos = [`${RUTA}/${estado}.png`, `${RUTA}/kawaii.png`];
  const src = candidatos[intento];

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
        <img className="mf-tamapng-huevo" src={`${RUTA}/huevo.png`} alt=""
             onError={() => setSinHuevo(true)} />
      )}

      <div className="mf-tamapng-pantalla"
           style={{
             left: `${PANTALLA.left}%`, top: `${PANTALLA.top}%`,
             width: `${PANTALLA.width}%`, height: `${PANTALLA.height}%`,
             background: sinHuevo ? 'transparent' : undefined,
           }}>
        {!sinHuevo && (
        <div className="mf-tamapng-iconos">
          {iconos.map((ic) => (
            <span key={ic.id} style={{ opacity: ic.activo ? 1 : 0.3 }}>{ic.emoji}</span>
          ))}
        </div>
        )}

        <div className="mf-tamapng-zona"
             style={{ top: `${ZONA.top}%`, height: `${ZONA.height}%` }}>
          {!sinHuevo && (
            <div className="mf-tamapng-barra">
              <i style={{ width: `${Math.max(0, Math.min(1, puntos)) * 100}%` }} />
            </div>
          )}
          {src && (
            <img className="mf-tamapng-michi" src={src} alt=""
                 onError={() => setIntento((i) => i + 1)} />
          )}
        </div>

      </div>
    </div>
  );
}
