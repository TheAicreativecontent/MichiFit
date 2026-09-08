/* ============================================================
   MichiFit · el michi
   Un solo SVG paramétrico. Cuatro ejes independientes que se combinan:
     cuerpo (forma) · pose (energía) · cara (ánimo) · nivel (aura)
   Nada de sprites: todo se dibuja, así que cualquier combinación existe.

   Lenguaje visual heredado del logo de MichiFit: contorno oscuro grueso,
   sombreado plano (sin degradados de volumen), hocico y barriga en crema,
   rayas atigradas y ojos grandes con brillo.
   ============================================================ */

import './michi.css';

/* --- geometría del cuerpo según la forma física --- */
const CUERPOS = {
  chonky: { ancho: 78, alto: 66, mofletes: 1.25, patas: 15 },
  normal: { ancho: 64, alto: 64, mofletes: 1, patas: 17 },
  musculoso: { ancho: 66, alto: 62, mofletes: 0.9, patas: 18, hombros: true },
  fit: { ancho: 58, alto: 60, mofletes: 0.8, patas: 19, hombros: true },
};

/* --- inclinación y brío según la energía --- */
const POSES = {
  cansado: { inclina: -8, sube: 6, cola: -25, orejas: -18, anim: 'mg-dormita' },
  normal: { inclina: 0, sube: 0, cola: 5, orejas: 0, anim: 'mg-respira' },
  entrenado: { inclina: 3, sube: -3, cola: 25, orejas: 6, anim: 'mg-bota' },
  energico: { inclina: 5, sube: -6, cola: 40, orejas: 10, anim: 'mg-bota-rapido' },
};

/* --- paleta por nivel --------------------------------------
   `pelo` base, `raya` para las marcas atigradas, `aura` desde nivel 3.
   El contorno y la crema son constantes: son la firma del estilo.      */
const TRAZO = '#6E3A4E';
const CREMA = '#FFF6EC';

const NIVEL_ESTILO = {
  1: { pelo: '#FFD9E8', raya: '#FFBBD6', aura: null },
  2: { pelo: '#FFC9DE', raya: '#FFA6C9', aura: null },
  3: { pelo: '#FFB8D4', raya: '#FF8FBB', aura: '#4ECDC4' },
  4: { pelo: '#FFAECF', raya: '#FF7FAE', aura: '#FFE66D' },
  5: { pelo: '#FF9EC4', raya: '#EF6B9E', aura: '#FF7A3D' },
};

export default function Michi({
  cuerpo = 'normal',
  pose = 'normal',
  cara = 'neutro',
  nivel = 1,
  size = 220,
  accesorio = null,
}) {
  const c = CUERPOS[cuerpo] ?? CUERPOS.normal;
  const p = POSES[pose] ?? POSES.normal;
  const est = NIVEL_ESTILO[nivel] ?? NIVEL_ESTILO[1];

  const cx = 100;
  const cyCuerpo = 132 + p.sube;
  const cyCabeza = 78 + p.sube;
  const rxCuerpo = c.ancho / 2;
  const ryCuerpo = c.alto / 2;

  // ids únicos por instancia: si no, varias mascotas en la misma página
  // comparten clipPath y se recortan entre ellas.
  const uid = `${cuerpo}-${pose}-${nivel}`;

  return (
    <svg
      className="mg-michi"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Michi ${cuerpo}, ${pose}, ${cara}`}
    >
      <defs>
        <radialGradient id={`mg-aura-${uid}`}>
          <stop offset="55%" stopColor={est.aura ?? '#fff'} stopOpacity="0" />
          <stop offset="100%" stopColor={est.aura ?? '#fff'} stopOpacity="0.45" />
        </radialGradient>
        <clipPath id={`mg-clip-cuerpo-${uid}`}>
          <ellipse cx={cx} cy={cyCuerpo} rx={rxCuerpo} ry={ryCuerpo} />
        </clipPath>
        <clipPath id={`mg-clip-cabeza-${uid}`}>
          <ellipse cx={cx} cy={cyCabeza} rx={40} ry={36} />
        </clipPath>
      </defs>

      {est.aura && (
        <circle className="mg-aura" cx={cx} cy={110} r={86} fill={`url(#mg-aura-${uid})`} />
      )}

      <ellipse cx={cx} cy={181} rx={c.ancho * 0.52} ry={7} fill="#000" opacity=".07" />

      <g className={p.anim} style={{ transformOrigin: '100px 170px' }}>
        <g transform={`rotate(${p.inclina} ${cx} 150)`}>
          {/* cola, con anillas atigradas */}
          <path
            className="mg-cola"
            d={colaPath(cx + rxCuerpo - 4, cyCuerpo + 8, p.cola)}
            fill="none"
            stroke={TRAZO}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            className="mg-cola"
            d={colaPath(cx + rxCuerpo - 4, cyCuerpo + 8, p.cola)}
            fill="none"
            stroke={est.pelo}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            className="mg-cola"
            d={colaPath(cx + rxCuerpo - 4, cyCuerpo + 8, p.cola)}
            fill="none"
            stroke={est.raya}
            strokeWidth="9"
            strokeLinecap="butt"
            strokeDasharray="5 9"
          />

          {/* patas traseras */}
          <ellipse cx={cx - c.ancho * 0.26} cy={172} rx={13} ry={9} fill={est.pelo} stroke={TRAZO} strokeWidth="3" />
          <ellipse cx={cx + c.ancho * 0.26} cy={172} rx={13} ry={9} fill={est.pelo} stroke={TRAZO} strokeWidth="3" />
          <ellipse cx={cx - c.ancho * 0.26} cy={173} rx={5} ry={3.4} fill="#FFC2D9" opacity=".75" />
          <ellipse cx={cx + c.ancho * 0.26} cy={173} rx={5} ry={3.4} fill="#FFC2D9" opacity=".75" />

          {/* --- cuerpo: relleno, rayas recortadas, barriga, y contorno encima --- */}
          <ellipse cx={cx} cy={cyCuerpo} rx={rxCuerpo} ry={ryCuerpo} fill={est.pelo} />
          <g clipPath={`url(#mg-clip-cuerpo-${uid})`}>
            {[-0.45, -0.18, 0.1].map((t, i) => (
              <rect
                key={i}
                x={cx - rxCuerpo}
                y={cyCuerpo + ryCuerpo * t}
                width={rxCuerpo * 0.5}
                height={5}
                rx={2.5}
                fill={est.raya}
              />
            ))}
          </g>
          <ellipse cx={cx} cy={cyCuerpo + 7} rx={c.ancho * 0.29} ry={c.alto * 0.32} fill={CREMA} />
          <ellipse
            cx={cx}
            cy={cyCuerpo}
            rx={rxCuerpo}
            ry={ryCuerpo}
            fill="none"
            stroke={TRAZO}
            strokeWidth="3.6"
          />

          {c.hombros && (
            <>
              <path d={`M ${cx - rxCuerpo + 6} ${cyCuerpo - 8} q 9 -9 18 -2`} fill="none" stroke={TRAZO} strokeWidth="2.4" strokeLinecap="round" opacity=".55" />
              <path d={`M ${cx + rxCuerpo - 6} ${cyCuerpo - 8} q -9 -9 -18 -2`} fill="none" stroke={TRAZO} strokeWidth="2.4" strokeLinecap="round" opacity=".55" />
            </>
          )}

          {/* bracitos */}
          <ellipse cx={cx - rxCuerpo - 1} cy={cyCuerpo + 2} rx={8} ry={c.patas * 0.6} fill={est.pelo} stroke={TRAZO} strokeWidth="3" transform={`rotate(${pose === 'energico' ? -35 : pose === 'cansado' ? 12 : -8} ${cx - rxCuerpo} ${cyCuerpo})`} />
          <ellipse cx={cx + rxCuerpo + 1} cy={cyCuerpo + 2} rx={8} ry={c.patas * 0.6} fill={est.pelo} stroke={TRAZO} strokeWidth="3" transform={`rotate(${pose === 'energico' ? 35 : pose === 'cansado' ? -12 : 8} ${cx + rxCuerpo} ${cyCuerpo})`} />

          {/* --- cabeza --- */}
          <g transform={`rotate(${p.orejas * 0.25} ${cx} ${cyCabeza})`}>
            <Oreja x={cx - 28} y={cyCabeza - 22} lado={-1} alzado={p.orejas} pelo={est.pelo} />
            <Oreja x={cx + 28} y={cyCabeza - 22} lado={1} alzado={p.orejas} pelo={est.pelo} />

            <ellipse cx={cx} cy={cyCabeza} rx={40} ry={36} fill={est.pelo} />
            <g clipPath={`url(#mg-clip-cabeza-${uid})`}>
              {/* rayas de la frente */}
              <rect x={cx - 13} y={cyCabeza - 36} width={5} height={12} rx={2.5} fill={est.raya} />
              <rect x={cx - 3} y={cyCabeza - 38} width={5} height={14} rx={2.5} fill={est.raya} />
              <rect x={cx + 7} y={cyCabeza - 36} width={5} height={12} rx={2.5} fill={est.raya} />
              {/* rayas de las mejillas */}
              <rect x={cx - 40} y={cyCabeza - 4} width={11} height={4} rx={2} fill={est.raya} />
              <rect x={cx - 40} y={cyCabeza + 4} width={9} height={4} rx={2} fill={est.raya} />
              <rect x={cx + 29} y={cyCabeza - 4} width={11} height={4} rx={2} fill={est.raya} />
              <rect x={cx + 31} y={cyCabeza + 4} width={9} height={4} rx={2} fill={est.raya} />
            </g>

            {/* hocico crema */}
            <ellipse cx={cx} cy={cyCabeza + 11} rx={22} ry={16} fill={CREMA} />

            <ellipse cx={cx} cy={cyCabeza} rx={40} ry={36} fill="none" stroke={TRAZO} strokeWidth="3.6" />

            <Cara cara={cara} cx={cx} cy={cyCabeza} escalaMofletes={c.mofletes} />
          </g>

          {accesorio && (
            <text x={cx} y={cyCabeza - 46} textAnchor="middle" fontSize="26">
              {accesorio}
            </text>
          )}
        </g>
      </g>

      {pose === 'energico' && (
        <g className="mg-chispas">
          <Chispa x={38} y={72} />
          <Chispa x={162} y={64} d={0.4} />
          <Chispa x={46} y={140} d={0.8} />
          <Chispa x={158} y={132} d={1.2} />
        </g>
      )}

      {pose === 'cansado' && (
        <g className="mg-zzz" fill="#C3A7F0" fontFamily="'Baloo 2', cursive" fontWeight="800">
          <text x={148} y={54} fontSize="15">z</text>
          <text x={161} y={40} fontSize="12">z</text>
          <text x={171} y={29} fontSize="9">z</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- oreja con interior rosado ---------- */
function Oreja({ x, y, lado, alzado, pelo }) {
  const alto = 26 + alzado * 0.3;
  const ext = `M ${x - 13 * lado} ${y + 12} L ${x + 2 * lado} ${y - alto} L ${x + 15 * lado} ${y + 6} Z`;
  const int = `M ${x - 7 * lado} ${y + 8} L ${x + 2 * lado} ${y - alto * 0.62} L ${x + 9 * lado} ${y + 4} Z`;
  return (
    <g>
      <path d={ext} fill={pelo} stroke={TRAZO} strokeWidth="3.6" strokeLinejoin="round" />
      <path d={int} fill="#FFB3C9" opacity=".85" />
    </g>
  );
}

/* ---------- cara según el ánimo ---------- */
function Cara({ cara, cx, cy, escalaMofletes }) {
  const ojoY = cy - 3;
  const sepOjos = 16;
  const narizY = cy + 4;

  return (
    <g>
      {/* mofletes */}
      <ellipse cx={cx - 28} cy={cy + 7} rx={7.5 * escalaMofletes} ry={5 * escalaMofletes} fill="#FF8FB0" opacity=".5" />
      <ellipse cx={cx + 28} cy={cy + 7} rx={7.5 * escalaMofletes} ry={5 * escalaMofletes} fill="#FF8FB0" opacity=".5" />

      {/* ojos */}
      {cara === 'feliz' ? (
        <>
          <path d={`M ${cx - sepOjos - 8} ${ojoY + 3} q 8 -11 16 0`} fill="none" stroke={TRAZO} strokeWidth="4" strokeLinecap="round" />
          <path d={`M ${cx + sepOjos - 8} ${ojoY + 3} q 8 -11 16 0`} fill="none" stroke={TRAZO} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : cara === 'enfadado' ? (
        <>
          <path d={`M ${cx - sepOjos - 10} ${ojoY - 13} l 16 6`} stroke={TRAZO} strokeWidth="3.4" strokeLinecap="round" />
          <path d={`M ${cx + sepOjos + 10} ${ojoY - 13} l -16 6`} stroke={TRAZO} strokeWidth="3.4" strokeLinecap="round" />
          <ellipse cx={cx - sepOjos} cy={ojoY + 1} rx={5} ry={5.5} fill={TRAZO} />
          <ellipse cx={cx + sepOjos} cy={ojoY + 1} rx={5} ry={5.5} fill={TRAZO} />
          <text x={cx + 31} y={cy - 23} fontSize="14" fill="#FF8E8E">💢</text>
        </>
      ) : (
        <>
          <ellipse className="mg-parpadeo" cx={cx - sepOjos} cy={ojoY} rx={6.5} ry={8} fill={TRAZO} />
          <ellipse className="mg-parpadeo" cx={cx + sepOjos} cy={ojoY} rx={6.5} ry={8} fill={TRAZO} />
          <circle cx={cx - sepOjos + 2.4} cy={ojoY - 3} r={2.4} fill="#fff" />
          <circle cx={cx + sepOjos + 2.4} cy={ojoY - 3} r={2.4} fill="#fff" />
        </>
      )}

      {/* naricita triangular */}
      <path
        d={`M ${cx - 4} ${narizY} L ${cx + 4} ${narizY} L ${cx} ${narizY + 4.5} Z`}
        fill="#F08098"
        stroke={TRAZO}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* boca */}
      {cara === 'feliz' && (
        <>
          <path d={`M ${cx} ${narizY + 5} q 0 9 -8 9 q -5 0 -6 -4`} fill="none" stroke={TRAZO} strokeWidth="2.6" strokeLinecap="round" />
          <path d={`M ${cx} ${narizY + 5} q 0 12 8 12 q 6 0 7 -6`} fill="none" stroke={TRAZO} strokeWidth="2.6" strokeLinecap="round" />
          <path d={`M ${cx + 1} ${narizY + 11} q 6 1 6 5 q -1 3 -5 3 q -4 -1 -4 -5 Z`} fill="#FF7A9C" />
        </>
      )}
      {cara === 'neutro' && (
        <path d={`M ${cx - 7} ${narizY + 6} q 7 6 7 0 q 0 6 7 0`} fill="none" stroke={TRAZO} strokeWidth="2.6" strokeLinecap="round" />
      )}
      {cara === 'enfadado' && (
        <path d={`M ${cx - 9} ${narizY + 12} q 9 -8 18 0`} fill="none" stroke={TRAZO} strokeWidth="3" strokeLinecap="round" />
      )}

      {/* bigotes */}
      <g stroke={TRAZO} strokeWidth="1.9" strokeLinecap="round" opacity=".55">
        <line x1={cx - 22} y1={cy + 4} x2={cx - 44} y2={cy - 1} />
        <line x1={cx - 22} y1={cy + 9} x2={cx - 43} y2={cy + 11} />
        <line x1={cx + 22} y1={cy + 4} x2={cx + 44} y2={cy - 1} />
        <line x1={cx + 22} y1={cy + 9} x2={cx + 43} y2={cy + 11} />
      </g>
    </g>
  );
}

/* ---------- helpers ---------- */

function colaPath(x, y, curva) {
  const finY = y - curva;
  const ctrlY = y - curva * 0.2 + 10;
  return `M ${x} ${y} Q ${x + 34} ${ctrlY} ${x + 26} ${finY}`;
}

function Chispa({ x, y, d = 0 }) {
  return (
    <g style={{ animationDelay: `${d}s` }} className="mg-chispa">
      <path
        d={`M ${x} ${y - 7} L ${x + 2.4} ${y - 2.4} L ${x + 7} ${y} L ${x + 2.4} ${y + 2.4} L ${x} ${y + 7} L ${x - 2.4} ${y + 2.4} L ${x - 7} ${y} L ${x - 2.4} ${y - 2.4} Z`}
        fill="#FFE66D"
      />
    </g>
  );
}
