/* ============================================================
   Marcador estilo videojuego
   Va debajo del huevo: racha en corazones, comodines en escudos, y
   energía y forma en barras de bloques. Tipografía de píxel.

   Los corazones y escudos se dibujan como rejillas de píxeles, no con
   emojis: un emoji lo pinta cada sistema a su manera y rompería el
   estilo en cuanto cambias de móvil.
   ============================================================ */

const CORAZON = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

const ESCUDO = [
  'XXXXXXX',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

const MAX_CORAZONES = 5;

function Icono({ forma, lleno, color }) {
  const p = 2;                       // píxeles de pantalla por píxel del icono
  const w = forma[0].length, h = forma.length;
  return (
    <svg width={w * p} height={h * p} viewBox={`0 0 ${w} ${h}`}
         className="mf-mk-icono" aria-hidden="true">
      {forma.map((fila, y) =>
        [...fila].map((c, x) => c === 'X' && (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1"
                fill={lleno ? color : 'transparent'}
                stroke={lleno ? 'none' : color} strokeWidth="0.14" />
        ))
      )}
    </svg>
  );
}

function Barra({ valor, color, bloques = 10 }) {
  const llenos = Math.round((Math.max(0, Math.min(100, valor)) / 100) * bloques);
  return (
    <span className="mf-mk-barra">
      {Array.from({ length: bloques }, (_, i) => (
        <i key={i} style={{ background: i < llenos ? color : 'transparent' }} />
      ))}
    </span>
  );
}

export default function Marcador({ estado }) {
  const corazones = Math.min(MAX_CORAZONES, estado.racha);

  return (
    <div className="mf-marcador">
      <div className="mf-mk-fila">
        <span className="mf-mk-et">RACHA</span>
        <span className="mf-mk-iconos">
          {Array.from({ length: MAX_CORAZONES }, (_, i) => (
            <Icono key={i} forma={CORAZON} lleno={i < corazones} color="#E8543A" />
          ))}
        </span>
        <b className="mf-mk-num">{estado.racha}</b>
      </div>

      <div className="mf-mk-fila">
        <span className="mf-mk-et">ESCUDOS</span>
        <span className="mf-mk-iconos">
          {Array.from({ length: 3 }, (_, i) => (
            <Icono key={i} forma={ESCUDO} lleno={i < estado.comodines} color="#3E8BD8" />
          ))}
        </span>
        <b className="mf-mk-num">{estado.comodines}</b>
      </div>

      <div className="mf-mk-fila">
        <span className="mf-mk-et">ENERGIA</span>
        <Barra valor={estado.energia} color="#F5C518" />
        <b className="mf-mk-num">{estado.energia}</b>
      </div>

      <div className="mf-mk-fila">
        <span className="mf-mk-et">FORMA</span>
        <Barra valor={estado.forma} color="#5FCD96" />
        <b className="mf-mk-num">{estado.forma}</b>
      </div>
    </div>
  );
}
