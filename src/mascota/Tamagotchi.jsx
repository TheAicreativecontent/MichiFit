/* ============================================================
   MichiFit · el aparato
   Un tamagotchi dibujado entero en SVG: carcasa naranja con la marca
   en relieve, pantalla LCD, banda de iconos, barra de puntos y tres
   botones de colores.

   Clave de la estética antigua: la rejilla del LCD se dibuja al mismo
   paso que el píxel del sprite. Un cuadrito de rejilla = un píxel del
   michi. Si no coinciden, parece una pantalla moderna con una imagen
   pixelada encima, que es justo lo que no queremos.
   ============================================================ */

import { MICHIS, PALETA, TAM } from '../../pixel/michis.js';
import './tamagotchi.css';

/* --- carcasa --- */
const NARANJA = '#F2650F';
const NARANJA_CLARO = '#FF8A3D';
const NARANJA_OSCURO = '#A83B04';

/* --- pantalla --- */
const LCD = '#BFD2E8';        // cristal azulado
const LCD_REJILLA = '#93A9C2';
const BANDA = '#EFE3B0';      // banda de iconos, amarillenta
const BANDA_PIE = '#F2650F';

/* Geometría. El michi manda: 32 píxeles a paso 3,4 son 108,8, y todo
   lo demás se construye alrededor. */
const PX = 3.4;
const LADO = TAM * PX;
const PANT = { x: 46, y: 66, w: 128, h: 162 };
const BANDA_ALTA = 16;
const BANDA_BAJA = 19;

export default function Tamagotchi({
  estado = 'kawaii',
  cara = 'neutro',
  size = 230,
  iconos = [],
  puntos = 0,
  dormido = false,
  sinMichi = false,   // dibuja solo la carcasa: el michi lo pone una imagen encima
}) {
  const sprite = MICHIS[estado] ?? MICHIS.kawaii;

  const zonaY = PANT.y + BANDA_ALTA;
  const zonaAlto = PANT.h - BANDA_ALTA - BANDA_BAJA;
  const x0 = PANT.x + (PANT.w - LADO) / 2;
  const y0 = zonaY + zonaAlto - LADO + 4;

  const cols = Math.ceil(PANT.w / PX);
  const filas = Math.ceil(zonaAlto / PX);

  return (
    <svg
      className={`mf-tama ${dormido ? 'dormido' : ''}`}
      width={size}
      height={size * (300 / 220)}
      viewBox="0 0 220 300"
      role="img"
      aria-label={`Michi ${estado}, ${cara}`}
    >
      <defs>
        <linearGradient id="mf-shell" x1="0.2" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={NARANJA_CLARO} />
          <stop offset="42%" stopColor={NARANJA} />
          <stop offset="100%" stopColor={NARANJA_OSCURO} />
        </linearGradient>
        <radialGradient id="mf-gloss" cx="0.32" cy="0.16" r="0.42">
          <stop offset="0%" stopColor="#fff" stopOpacity=".38" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mf-cristal" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity=".32" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="mf-clip-pantalla">
          <rect x={PANT.x} y={PANT.y} width={PANT.w} height={PANT.h} rx="8" />
        </clipPath>
        <clipPath id="mf-clip-zona">
          <rect x={PANT.x} y={zonaY} width={PANT.w} height={zonaAlto} />
        </clipPath>
      </defs>

      {/* cadenita */}
      <g fill="#C9CDD4" stroke="#9AA0A8" strokeWidth="1">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={110 + i * 7} cy={12 - i * 3} r="5" />
        ))}
      </g>
      <circle cx="110" cy="24" r="7" fill="none" stroke={NARANJA_OSCURO} strokeWidth="5" />

      {/* carcasa */}
      <ellipse cx="110" cy="160" rx="99" ry="138" fill="url(#mf-shell)"
               stroke={NARANJA_OSCURO} strokeWidth="3" />
      <ellipse cx="110" cy="160" rx="99" ry="138" fill="url(#mf-gloss)" />

      {/* marca en relieve */}
      <text x="110" y="54" textAnchor="middle" className="mf-tama-marca"
            fill="#FFF6EC" stroke={NARANJA_OSCURO} strokeWidth="1.2"
            paintOrder="stroke" fontSize="28">
        MICHI
      </text>

      {/* relieves laterales: huella y corazón */}
      <g fill={NARANJA_OSCURO} opacity=".28">
        <ellipse cx="24" cy="168" rx="7" ry="6" />
        <ellipse cx="15" cy="155" rx="3.4" ry="4.4" />
        <ellipse cx="23" cy="151" rx="3.4" ry="4.6" />
        <ellipse cx="31" cy="154" rx="3.2" ry="4.2" />
        <path d="M196 161c3-4 9-2 9 3 0 5-9 11-9 11s-9-6-9-11c0-5 6-7 9-3z" />
      </g>

      {/* bisel y pantalla */}
      <rect x="38" y="58" width="144" height="178" rx="16"
            fill={NARANJA_OSCURO} opacity=".3" />
      <rect x={PANT.x - 4} y={PANT.y - 4} width={PANT.w + 8} height={PANT.h + 8}
            rx="11" fill="#3B3B44" />
      <rect x={PANT.x} y={PANT.y} width={PANT.w} height={PANT.h} rx="8" fill={LCD} />

      <g clipPath="url(#mf-clip-pantalla)">
        {/* banda de iconos */}
        <rect x={PANT.x} y={PANT.y} width={PANT.w} height={BANDA_ALTA} fill={BANDA} />
        {iconos.map((ic, i) => (
          <text key={ic.id} x={PANT.x + 16 + i * 24} y={PANT.y + 12}
                fontSize="11" textAnchor="middle"
                opacity={ic.activo ? 1 : 0.3}>
            {ic.emoji}
          </text>
        ))}

        {/* rejilla del LCD, al mismo paso que el píxel del sprite */}
        <g clipPath="url(#mf-clip-zona)" opacity=".3">
          {Array.from({ length: cols + 1 }, (_, i) => (
            <rect key={`v${i}`} x={x0 + i * PX - 0.25} y={zonaY}
                  width="0.5" height={zonaAlto} fill={LCD_REJILLA} />
          ))}
          {Array.from({ length: filas + 1 }, (_, i) => (
            <rect key={`h${i}`} x={PANT.x} y={y0 + i * PX - 0.25}
                  width={PANT.w} height="0.5" fill={LCD_REJILLA} />
          ))}
        </g>

        {/* barra de puntos */}
        <g className="mf-tama-puntos">
          <rect x={PANT.x + 58} y={zonaY + 5} width="62" height="9" rx="2"
                fill="#fff" opacity=".8" stroke="#7C8CA0" strokeWidth="0.8" />
          <rect x={PANT.x + 59.5} y={zonaY + 6.5}
                width={59 * Math.max(0, Math.min(1, puntos))}
                height="6" rx="1" fill="#F2650F" />
          <text x={PANT.x + 89} y={zonaY + 23} fontSize="7.5" textAnchor="middle"
                fill="#3B4A5A" fontFamily="'Nunito', sans-serif" fontWeight="800">
            Fitness Points
          </text>
        </g>

        {/* el michi */}
        {!sinMichi && (
        <g className="mf-tama-michi" clipPath="url(#mf-clip-zona)">
          {sprite.map((fila, y) =>
            [...fila].map((ch, x) =>
              ch === '.' ? null : (
                <rect key={`${x}-${y}`} x={x0 + x * PX} y={y0 + y * PX}
                      width={PX} height={PX} fill={PALETA[ch]} />
              )
            )
          )}
        </g>
        )}

        {dormido && (
          <text className="mf-tama-zzz" x={PANT.x + 104} y={zonaY + 46}
                fontSize="13" fill="#42566E"
                fontFamily="'Baloo 2', cursive" fontWeight="800">
            z z
          </text>
        )}

        {/* banda inferior con la marca */}
        <rect x={PANT.x} y={PANT.y + PANT.h - BANDA_BAJA}
              width={PANT.w} height={BANDA_BAJA} fill={BANDA_PIE} />
        <text x={PANT.x + PANT.w / 2} y={PANT.y + PANT.h - 5}
              textAnchor="middle" className="mf-tama-marca" fontSize="15" fill="#FFF6EC">
          FIT
        </text>

        {/* reflejo del cristal */}
        <rect x={PANT.x} y={PANT.y} width={PANT.w} height={PANT.h}
              fill="url(#mf-cristal)" />
      </g>

      {/* botones */}
      {[
        { cx: 78, color: '#F5C518', borde: '#B98F06' },
        { cx: 110, color: '#2C7BE5', borde: '#17509E' },
        { cx: 142, color: '#E8402C', borde: '#A5210F' },
      ].map((b) => (
        <g key={b.cx}>
          <ellipse cx={b.cx} cy="270" rx="15" ry="14" fill={NARANJA_OSCURO} opacity=".45" />
          <ellipse cx={b.cx} cy="266" rx="15" ry="14" fill={b.color}
                   stroke={b.borde} strokeWidth="1.6" />
          <ellipse cx={b.cx - 4} cy="261" rx="5" ry="3.2" fill="#fff" opacity=".45" />
        </g>
      ))}
    </svg>
  );
}
