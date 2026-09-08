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

/* Geometría, en porcentaje de la carcasa. Sale del componente SVG
   (viewBox 220x300): la pantalla ocupa x 46..174, y 66..228. */
const PANTALLA = {
  left: (46 / 220) * 100,
  top: (66 / 300) * 100,
  width: (128 / 220) * 100,
  height: (162 / 300) * 100,
};
/* Zona útil del michi: la pantalla menos la banda de iconos y la del pie. */
const ZONA = {
  top: (16 / 162) * 100,
  height: ((162 - 16 - 19) / 162) * 100,
};

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
  const candidatos = [`${RUTA}/${estado}.png`, `${RUTA}/bebe_paseando.png`];
  const src = candidatos[intento];

  // Mientras no estén las imágenes, se usa el aparato dibujado.
  if (sinHuevo) {
    return (
      <Tamagotchi estado={estado} size={size} iconos={iconos}
                  puntos={puntos} dormido={dormido} {...resto} />
    );
  }

  return (
    <div className={`mf-tamapng ${dormido ? 'dormido' : ''}`}
         style={{ width: size, height: size * (300 / 220) }}>
      <img className="mf-tamapng-huevo" src={`${RUTA}/huevo.png`} alt=""
           onError={() => setSinHuevo(true)} />

      <div className="mf-tamapng-pantalla"
           style={{
             left: `${PANTALLA.left}%`, top: `${PANTALLA.top}%`,
             width: `${PANTALLA.width}%`, height: `${PANTALLA.height}%`,
           }}>
        <div className="mf-tamapng-iconos">
          {iconos.map((ic) => (
            <span key={ic.id} style={{ opacity: ic.activo ? 1 : 0.3 }}>{ic.emoji}</span>
          ))}
        </div>

        <div className="mf-tamapng-zona"
             style={{ top: `${ZONA.top}%`, height: `${ZONA.height}%` }}>
          <div className="mf-tamapng-barra">
            <i style={{ width: `${Math.max(0, Math.min(1, puntos)) * 100}%` }} />
          </div>
          {src && (
            <img className="mf-tamapng-michi" src={src} alt=""
                 onError={() => setIntento((i) => i + 1)} />
          )}
        </div>

        <div className="mf-tamapng-pie">FIT</div>
      </div>
    </div>
  );
}
