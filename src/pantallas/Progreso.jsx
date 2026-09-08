/* ============================================================
   Pantalla "Progreso"
   Gráfica de peso con previsión, y calendario del pacto.

   La previsión sale de TUS pesajes reales si hay suficientes; si no,
   del ritmo teórico del simulador. Es la idea de la MichiFit original:
   una orientación que responde a lo que de verdad apuntas, no una
   promesa sacada de una fórmula.

   Tocando un día del calendario se registra o corrige ese día: dentro
   de la ventana de 3 días cuenta para el pacto, y el peso se puede
   editar siempre.
   ============================================================ */

import { useMemo, useState } from 'react';
import { hoyISO, diasDesde, dentroDeVentana, evaluarDia } from '../engine/pacto.js';
import { simular, clamp } from '../engine/calculos.js';
import { KCAL_POR_KG_GRASA } from '../engine/constantes.js';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/* Ritmo real por mínimos cuadrados sobre los pesajes. Más honesto que
   comparar el primero con el último: un solo día raro no manda. */
function ritmoReal(pesajes) {
  if (pesajes.length < 3) return null;
  const dias = pesajes.map((p) => diasDesde(pesajes[0].fecha, p.fecha));
  const span = dias[dias.length - 1];
  if (span < 10) return null;               // menos de 10 días no dice nada

  const n = dias.length;
  const mx = dias.reduce((a, b) => a + b, 0) / n;
  const my = pesajes.reduce((a, p) => a + p.peso, 0) / n;
  let num = 0, den = 0;
  dias.forEach((d, i) => {
    num += (d - mx) * (pesajes[i].peso - my);
    den += (d - mx) ** 2;
  });
  if (den === 0) return null;
  return (num / den) * 7;                    // kg por semana; negativo = bajando
}

export default function Progreso({ perfil, pacto, entradas, onRegistrar }) {
  const [mesOffset, setMesOffset] = useState(0);
  const [editando, setEditando] = useState(null);

  const pesajes = useMemo(() =>
    Object.keys(entradas)
      .filter((f) => entradas[f]?.peso != null)
      .sort()
      .map((f) => ({ fecha: f, peso: entradas[f].peso })),
    [entradas]);

  const pesoActual = pesajes.length ? pesajes[pesajes.length - 1].peso : perfil.pesoActual;
  const perdido = (perfil.pesoInicial ?? pesoActual) - pesoActual;
  const restante = pesoActual - (perfil.pesoMeta ?? pesoActual);

  const real = ritmoReal(pesajes);
  const teorico = useMemo(() => {
    const s = simular({
      perfil: { ...perfil, pesoActual },
      pasos: pacto?.dias?.mar?.pasos ?? 6000,
      minEntrenoSemana: 120,
      comidaKcal: pacto?.comidaKcal ?? 2000,
    });
    return s?.kgPorSemana ?? null;
  }, [perfil, pacto, pesoActual]);

  const ritmo = real ?? teorico;
  const bajando = ritmo != null && ritmo < -0.01 && restante > 0;
  const semanas = bajando ? restante / Math.abs(ritmo) : null;
  const fechaMeta = semanas
    ? new Date(Date.now() + semanas * 7 * 86400000)
    : null;
  const metaISO = fechaMeta ? fechaMeta.toISOString().slice(0, 10) : null;

  return (
    <div className="mf-pagina">
      <h2 className="mf-h2">📈 Tu progreso</h2>

      <div className="mf-rejilla">
        <Celda n={pesoActual != null ? pesoActual.toFixed(1) : '—'} u="kg" etiqueta="Peso actual" />
        <Celda n={(perdido > 0 ? '−' : '') + Math.abs(perdido || 0).toFixed(1)} u="kg"
               etiqueta={perdido >= 0 ? 'Perdidos' : 'Recuperados'}
               clase={perdido > 0 ? 'bien' : ''} />
        <Celda n={Math.max(0, restante || 0).toFixed(1)} u="kg" etiqueta="Hasta la meta" />
        <Celda n={ritmo != null ? ritmo.toFixed(2) : '—'} u="kg"
               etiqueta={real ? 'Ritmo real / semana' : 'Ritmo previsto / semana'}
               clase={ritmo < 0 ? 'bien' : ''} />
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">
          Peso ↔ tiempo {real && <small className="mf-real">· según lo que apuntas</small>}
        </h3>
        {pesajes.length === 0 ? (
          <p className="mf-nota" style={{ marginTop: 0 }}>
            Aún no has apuntado ningún peso. Toca un día del calendario y
            escríbelo: con tres pesajes repartidos en diez días ya puedo
            calcular tu ritmo real.
          </p>
        ) : (
          <>
            <Grafica pesajes={pesajes} pesoActual={pesoActual}
                     pesoMeta={perfil.pesoMeta} pesoInicial={perfil.pesoInicial}
                     ritmo={ritmo} bajando={bajando} semanas={semanas} />
            <p className="mf-nota" style={{ textAlign: 'center' }}>
              🌸 tus pesajes · 🟦 previsión a tu ritmo
              {!real && ' (teórica: aún no hay pesajes suficientes)'}
            </p>
          </>
        )}
      </div>

      <Calendario
        mesOffset={mesOffset} setMesOffset={setMesOffset}
        entradas={entradas} pacto={pacto} metaISO={metaISO}
        onTocar={setEditando}
      />

      {editando && (
        <EditorDia
          fecha={editando} entrada={entradas[editando] ?? {}}
          onGuardar={(campos) => { onRegistrar(editando, campos); setEditando(null); }}
          onCerrar={() => setEditando(null)}
        />
      )}
    </div>
  );
}

/* ---------------- gráfica ---------------- */
function Grafica({ pesajes, pesoActual, pesoMeta, pesoInicial, ritmo, bajando, semanas }) {
  const W = 700, H = 340, pl = 62, pr = 26, pt = 22, pb = 42;
  const ancho = W - pl - pr, alto = H - pt - pb;

  const hoy = hoyISO();
  const puntos = pesajes.map((p) => ({ d: -diasDesde(p.fecha, hoy), w: p.peso }));
  const diasFuturo = bajando ? Math.max(7, Math.round(semanas * 7)) : 56;
  const finW = bajando ? pesoMeta : pesoActual + (ritmo ?? 0) * (diasFuturo / 7);

  const xs = puntos.map((p) => p.d).concat([0, diasFuturo]);
  const ws = puntos.map((p) => p.w).concat([pesoActual, pesoMeta, finW].filter((v) => v != null));
  const xMin = Math.min(...xs), xMax = Math.max(...xs, xMin + 7);
  let yMin = Math.min(...ws) - 0.8, yMax = Math.max(...ws) + 0.8;
  if (yMax - yMin < 1.5) yMax = yMin + 1.5;

  const X = (d) => pl + ((d - xMin) / (xMax - xMin)) * ancho;
  const Y = (w) => pt + ((yMax - w) / (yMax - yMin)) * alto;
  const marcas = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);
  const linea = puntos.map((p) => `${X(p.d)},${Y(p.w)}`).join(' ');
  const FF = "Nunito, system-ui, sans-serif";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
         style={{ width: '100%', height: 'auto', display: 'block' }}>
      {marcas.map((t, i) => (
        <g key={i}>
          <line x1={pl} y1={Y(t)} x2={W - pr} y2={Y(t)} stroke="var(--linea)" strokeWidth="1.5" />
          <text x={pl - 10} y={Y(t) + 5} textAnchor="end" fontSize="16" fontWeight="700"
                fill="var(--tinta-flojo)" fontFamily={FF}>{t.toFixed(1)}</text>
        </g>
      ))}

      {pesoMeta != null && (
        <>
          <line x1={pl} y1={Y(pesoMeta)} x2={W - pr} y2={Y(pesoMeta)}
                stroke="var(--bien)" strokeWidth="2.5" strokeDasharray="9 6" />
          <text x={pl + 4} y={Y(pesoMeta) - 9} fontSize="15" fontWeight="800"
                fill="var(--bien)" fontFamily={FF}>meta {pesoMeta}</text>
        </>
      )}

      <line x1={X(0)} y1={pt} x2={X(0)} y2={H - pb}
            stroke="var(--menta)" strokeWidth="1.5" strokeDasharray="4 5" opacity=".7" />
      <text x={X(0)} y={H - 14} textAnchor="middle" fontSize="15" fontWeight="800"
            fill="var(--tinta-flojo)" fontFamily={FF}>hoy</text>

      <line x1={X(0)} y1={Y(pesoActual)} x2={X(diasFuturo)} y2={Y(finW)}
            stroke="var(--menta)" strokeWidth="4" strokeDasharray="8 7" strokeLinecap="round" />

      {puntos.length >= 2 && (
        <polyline points={linea} fill="none" stroke="var(--rosa)" strokeWidth="4.5"
                  strokeLinejoin="round" strokeLinecap="round" />
      )}
      {puntos.map((p, i) => (
        <circle key={i} cx={X(p.d)} cy={Y(p.w)} r="5" fill="var(--rosa)" />
      ))}

      {bajando && (
        <>
          <circle cx={X(diasFuturo)} cy={Y(pesoMeta)} r="7" fill="var(--bien)"
                  stroke="var(--papel)" strokeWidth="2" />
          <text x={X(diasFuturo)} y={Y(pesoMeta) - 16} textAnchor="middle" fontSize="18">🏆</text>
        </>
      )}
    </svg>
  );
}

/* ---------------- calendario ---------------- */
function Calendario({ mesOffset, setMesOffset, entradas, pacto, metaISO, onTocar }) {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + mesOffset);
  const anio = base.getFullYear(), mes = base.getMonth();
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;   // lunes = 0
  const dias = new Date(anio, mes + 1, 0).getDate();
  const hoy = hoyISO();

  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let d = 1; d <= dias; d++) {
    const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const ev = pacto ? evaluarDia({ pacto, entrada: entradas[iso], fecha: iso, hoy }) : null;
    const futuro = iso > hoy;
    celdas.push({
      d, iso, futuro,
      esHoy: iso === hoy,
      meta: iso === metaISO,
      peso: entradas[iso]?.peso != null,
      estado: futuro ? '' : !ev ? '' : ev.abierto ? 'abierto' : ev.cumple ? 'ok' : ev.hayDatos ? 'parcial' : 'fallo',
    });
  }

  return (
    <div className="mf-tarjeta">
      <div className="mf-calnav">
        <button onClick={() => setMesOffset(mesOffset - 1)}>‹</button>
        <b>{MESES[mes]} {anio}</b>
        <button onClick={() => setMesOffset(mesOffset + 1)}>›</button>
      </div>

      <div className="mf-cal">
        {DOW.map((d, i) => <div className="mf-caldow" key={i}>{d}</div>)}
        {celdas.map((c, i) => c == null ? <div key={i} /> : (
          <button key={i}
                  className={`mf-caldia ${c.estado} ${c.esHoy ? 'hoy' : ''} ${c.futuro ? 'futuro' : ''}`}
                  disabled={c.futuro}
                  onClick={() => onTocar(c.iso)}>
            {c.d}
            {c.peso && <i className="peso" />}
            {c.meta && <span className="meta">🏆</span>}
          </button>
        ))}
      </div>

      <div className="mf-leyenda">
        <i className="ok" /> pacto cumplido &nbsp; <i className="parcial" /> a medias &nbsp;
        <i className="fallo" /> sin datos &nbsp; <i className="abierto" /> aún a tiempo
      </div>
      <p className="mf-nota">
        Toca cualquier día para apuntarlo o corregirlo. El peso se puede
        cambiar siempre; para el pacto solo cuentan los últimos 3 días.
      </p>
    </div>
  );
}

/* ---------------- editor de un día ---------------- */
function EditorDia({ fecha, entrada, onGuardar, onCerrar }) {
  const [v, setV] = useState({
    peso: entrada.peso ?? '',
    pasos: entrada.pasos ?? '',
    entrenoMin: entrada.entrenoMin ?? '',
    comidaKcal: entrada.comidaKcal ?? '',
    suenoHoras: entrada.sueno?.horas ?? entrada.suenoHoras ?? '',
  });
  const abierto = dentroDeVentana(fecha);
  const num = (x) => (x === '' ? null : Number(x));

  return (
    <div className="mf-hoja" onClick={onCerrar}>
      <div className="mf-hoja-caja" onClick={(e) => e.stopPropagation()}>
        <h3 className="mf-h3">{fecha}</h3>
        {!abierto && (
          <div className="mf-aviso suave">
            Este día ya está cerrado para el pacto (pasaron más de 3 días),
            pero el peso sí se puede corregir.
          </div>
        )}
        <Campo et="Peso" u="kg" paso="0.1" v={v.peso} on={(x) => setV({ ...v, peso: x })} />
        <Campo et="Pasos" paso="100" v={v.pasos} on={(x) => setV({ ...v, pasos: x })} />
        <Campo et="Entreno" u="min" paso="5" v={v.entrenoMin} on={(x) => setV({ ...v, entrenoMin: x })} />
        <Campo et="Comida" u="kcal" paso="50" v={v.comidaKcal} on={(x) => setV({ ...v, comidaKcal: x })} />
        <Campo et="Sueño" u="horas" paso="0.5" v={v.suenoHoras} on={(x) => setV({ ...v, suenoHoras: x })} />
        <div className="mf-hoja-pie">
          <button className="mf-boton" onClick={onCerrar}>Cancelar</button>
          <button className="mf-boton principal" onClick={() => onGuardar({
            peso: num(v.peso), pasos: num(v.pasos), entrenoMin: num(v.entrenoMin),
            comidaKcal: num(v.comidaKcal),
            sueno: v.suenoHoras === '' ? undefined : { horas: Number(v.suenoHoras) },
          })}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function Campo({ et, u, v, on, paso = '1' }) {
  return (
    <label className="mf-campo">
      <span>{et}{u && <small> {u}</small>}</span>
      <input type="number" step={paso} value={v} onChange={(e) => on(e.target.value)} />
    </label>
  );
}

function Celda({ n, u, etiqueta, clase = '' }) {
  return (
    <div className="mf-celda">
      <b className={clase}>{n} {u && <span style={{ fontSize: 13 }}>{u}</span>}</b>
      <small>{etiqueta}</small>
    </div>
  );
}
