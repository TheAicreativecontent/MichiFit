/* ============================================================
   Marcador estilo videojuego
   Enseña los datos que mueven al michi —entreno, pasos, comida y
   sueño— más la racha y la experiencia. Todo con barras de bloques y
   tipografía de píxel.

   El orden de las filas es el de importancia que dio Albert el
   2026-09-19: entreno primero, luego pasos, luego comida, y sueño el
   último —"también importa, pero menos"—. Hasta entonces el marcador
   ni siquiera tenía fila de ENTRENO: pasos, sueño, comida y nivel, y
   el hábito que Albert puso en primer lugar no se veía en la pantalla
   que se mira cada día. Ver `CURRENT.md` 2026-09-19.

   Las barras de sueño y comida tienen un tramo rojo: lo que te pasas
   del objetivo. Dormir 10 horas no es "mejor" que dormir 8, y comer de
   más tampoco, así que pasarse no puede pintarse como logro.
   ============================================================ */

import { useT } from '../i18n/index.jsx';
import { SUENO_IDEAL } from '../engine/constantes.js';

const CORAZON = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

/* El mismo corazón, partido por la mitad: los dos trozos se separan y
   se ve la grieta. Es el día que no cumpliste y te salvó un comodín. */
const CORAZON_ROTO = [
  '.XX.XX.',
  'XXX.XXX',
  'XX..XXX',
  '.XX.XX.',
  '..X.X..',
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
const BLOQUES = 10;

function Icono({ forma, lleno, color, titulo }) {
  const p = 2;
  const w = forma[0].length, h = forma.length;
  return (
    <svg width={w * p} height={h * p} viewBox={`0 0 ${w} ${h}`}
         className="mf-mk-icono" role={titulo ? 'img' : undefined}
         aria-hidden={titulo ? undefined : 'true'} aria-label={titulo}>
      {titulo && <title>{titulo}</title>}
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

/* `valor` y `exceso` van en tanto por uno. El exceso se pinta en rojo
   a continuación de lo cumplido. */
function Barra({ valor, exceso = 0, color, colorExceso = '#B3241A' }) {
  const llenos = Math.round(Math.min(1, valor) * BLOQUES);
  const rojos = Math.min(BLOQUES - llenos, Math.round(exceso * BLOQUES));
  return (
    <span className="mf-mk-barra">
      {Array.from({ length: BLOQUES }, (_, i) => (
        <i key={i} style={{
          background: i < llenos ? color : i < llenos + rojos ? colorExceso : 'transparent',
        }} />
      ))}
    </span>
  );
}

function Fila({ etiqueta, children, num }) {
  return (
    <div className="mf-mk-fila">
      <span className="mf-mk-et">{etiqueta}</span>
      {children}
      <b className="mf-mk-num">{num}</b>
    </div>
  );
}

export default function Marcador({ estado, entradaHoy = {}, pacto }) {
  const t = useT();
  const corazones = Math.min(MAX_CORAZONES, estado.racha);
  /* Los días de la racha que salvó un comodín se pintan al final, en
     corazón partido y gris: la racha sigue viva, pero el marcador no
     finge que ese día se cumplió. */
  const salvados = Math.min(corazones, estado.gastadosRacha ?? 0);
  const enteros = corazones - salvados;
  const objetivos = estado.hoy?.objetivos ?? [];

  /* --- entreno: el primero en importancia. Los días de descanso no
     tienen un objetivo de minutos —descansar YA es cumplirlo—, así que
     la barra sale llena y el número dice «descanso» en vez de un
     porcentaje que no significaría nada. */
  const objEntreno = objetivos.find((o) => o.id === 'entreno');
  const esDescanso = objetivos.some((o) => o.id === 'descanso');
  const minEntreno = entradaHoy.entrenoMin ?? 0;
  const metaEntreno = objEntreno?.objetivo ?? 0;
  const pctEntreno = esDescanso ? 1 : metaEntreno ? Math.min(1, minEntreno / metaEntreno) : 0;

  /* --- pasos --- */
  const objPasos = objetivos.find((o) => o.id === 'pasos');
  const pasos = entradaHoy.pasos ?? 0;
  const metaPasos = objPasos?.objetivo ?? 6000;
  const pctPasos = metaPasos ? pasos / metaPasos : 0;

  /* --- descanso: el ideal son 8 h; lo que sobra va en rojo --- */
  const horas = entradaHoy.sueno?.horas ?? entradaHoy.suenoHoras ?? 0;
  const pctSueno = Math.min(1, horas / SUENO_IDEAL);
  const excesoSueno = Math.max(0, horas - SUENO_IDEAL) / SUENO_IDEAL;

  /* --- comida: es el combustible. Lo que te pasas del objetivo va en
     rojo, igual que el sueño de más. Sin objetivo pactado no hay barra
     que valga, así que se muestra vacía. --- */
  const kcal = entradaHoy.comidaKcal ?? 0;
  const metaKcal = pacto?.comidaKcal ?? null;
  const pctComida = metaKcal ? Math.min(1, kcal / metaKcal) : 0;
  const excesoComida = metaKcal ? Math.max(0, kcal - metaKcal) / metaKcal : 0;

  /* --- experiencia hasta el siguiente nivel --- */
  const n = estado.nivel;
  const xpFaltan = n.xpSiguiente ? Math.max(0, n.xpSiguiente - n.xp) : 0;

  return (
    <div className="mf-marcador">
      <div className="mf-mk-fila">
        <span className="mf-mk-et">{t('marcador.racha')}</span>
        <span className="mf-mk-iconos">
          {Array.from({ length: MAX_CORAZONES }, (_, i) =>
            i < enteros ? (
              <Icono key={i} forma={CORAZON} lleno color="#E8543A" />
            ) : i < corazones ? (
              <Icono key={i} forma={CORAZON_ROTO} lleno color="#9A9086"
                     titulo={t('marcador.salvado')} />
            ) : (
              <Icono key={i} forma={CORAZON} lleno={false} color="#E8543A" />
            )
          )}
          <span className="mf-mk-sep" />
          {Array.from({ length: 3 }, (_, i) => (
            <Icono key={`e${i}`} forma={ESCUDO} lleno={i < estado.comodines} color="#3E8BD8" />
          ))}
        </span>
        <b className="mf-mk-num">{estado.racha}</b>
      </div>

      {/* Que es el escudo y como se gana (SIMPLICIDAD.md, punto 2). El
          aviso de «el michi te cubrio un dia» ya lo da Inicio justo debajo
          (`inicio.cubierto`), y el corazon partido y gris lo cuenta la
          ayuda «?». Lo que faltaba era decir QUE es cada escudo mientras
          lo tienes. */}
      {estado.comodines > 0 && <p className="mf-mk-nota">{t('marcador.notaEscudo')}</p>}

      <Fila etiqueta={t('marcador.entreno')}
            num={esDescanso ? t('marcador.descanso') : `${Math.round(pctEntreno * 100)}%`}>
        <Barra valor={pctEntreno} color="#8B6FD6" />
      </Fila>

      <Fila etiqueta={t('marcador.pasos')} num={`${Math.round(pctPasos * 100)}%`}>
        <Barra valor={pctPasos} color="#F5C518" />
      </Fila>

      {/* La comida va en rojizo porque es el color con el que se asocia,
          y el verde se reserva para el nivel: es el color de "vas bien". */}
      <Fila etiqueta={t('marcador.comida')} num={kcal ? kcal : '—'}>
        <Barra valor={pctComida} exceso={excesoComida} color="#E86A5A" />
      </Fila>

      {/* "SUEÑO", no "DESCANSO": el descanso del pacto es no entrenar, y
          son dos cosas distintas (el "DESCANSO" de arriba es del
          entreno). Comprobado que la Ñ existe en Press Start 2P antes
          de usarla. Va el último de los hábitos, a propósito: es el
          que Albert marcó como el menos importante de los cuatro. */}
      <Fila etiqueta={t('marcador.sueno')} num={horas ? `${horas}h` : '—'}>
        <Barra valor={pctSueno} exceso={excesoSueno} color="#7CC3F2" colorExceso="#E8543A" />
      </Fila>

      <Fila etiqueta={t('marcador.nivel')} num={xpFaltan ? `-${xpFaltan}` : t('marcador.max')}>
        <Barra valor={n.progreso} color="#5FCD96" />
      </Fila>
    </div>
  );
}
