/* ============================================================
   Pantalla "Mi pacto"
   La semana tipo de un vistazo: siete columnas, como un calendario.
   Tocando un día se despliega su ficha JUSTO DEBAJO de la fila, con una
   flecha apuntando al día — como en Google Calendar. Nada de hoja
   inferior: obligaba a bajar la vista y perdías de referencia el día
   que estabas tocando.

   Las macros salen, pero NO cuentan para el cumplimiento: son
   orientativas. Lo que se mira son entrenos, pasos, descanso y comida.
   ============================================================ */

import { useState } from 'react';
import { DIAS, DIAS_INICIAL, DIAS_LARGO } from '../engine/constantes.js';
import { macros } from '../engine/calculos.js';
import { EditorEjercicios } from './Ejercicios.jsx';
import { Titulo } from './Ayuda.jsx';

export default function Pacto({ pacto, perfil, estado, onCambiar }) {
  const [editando, setEditando] = useState(null);
  if (!pacto) return null;

  const diasEntreno = DIAS.filter((d) => pacto.dias[d].entreno);
  const pasosSemana = DIAS.reduce((a, d) => a + pacto.dias[d].pasos, 0);
  const minSemana = diasEntreno.reduce((a, d) => a + pacto.dias[d].minEntreno, 0);

  const m = pacto.comidaKcal
    ? macros({ kcal: pacto.comidaKcal, pesoMeta: perfil.pesoMeta, proteinaPorKg: perfil.proteinaPorKg })
    : null;

  const guardarDia = (dia, campos) =>
    onCambiar({ ...pacto, dias: { ...pacto.dias, [dia]: { ...pacto.dias[dia], ...campos } } });

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
          <p>
            El pacto es lo que <b>tú</b> decides hacer cada semana: cuántos
            pasos, qué días entrenas y cuánto. El michi no te pone metas,
            solo te recuerda las tuyas.
          </p>
          <p>
            Toca un día para ajustarlo. Los días de entreno piden menos
            pasos a propósito: pedirte entrenar <em>y</em> andar mucho el
            mismo día es un pacto que se incumple solo.
          </p>
          <p>
            En los días de entreno puedes apuntar los <b>ejercicios</b> que
            tocan. No cuentan para el pacto: son una chuleta para el
            gimnasio, y los marcas desde el botón «+».
          </p>
        </>}>
        🤝 Mi pacto
      </Titulo>
      <p className="mf-sub">
        Esto es lo que tú decidiste. El michi no te juzga: te lo recuerda.
      </p>

      <div className="mf-tarjeta mf-resumen">
        <Dato valor={diasEntreno.length} etiqueta="días de entreno" icono="🏋️" />
        <Dato valor={7 - diasEntreno.length} etiqueta="días de descanso" icono="😌" />
        <Dato valor={`${Math.round(pasosSemana / 1000)}k`} etiqueta="pasos/semana" icono="👟" />
        <Dato valor={`${minSemana}'`} etiqueta="entreno/semana" icono="⏱️" />
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Tu semana tipo</h3>
        <div className="mf-semana7">
          {DIAS.map((d) => {
            const dia = pacto.dias[d];
            return (
              <button key={d} className={`mf-d7 ${dia.entreno ? 'entreno' : 'descanso'}`}
                      onClick={() => setEditando(d)}>
                <span className="ini">{DIAS_INICIAL[d]}</span>
                <span className="ic">{dia.entreno ? '🏋️' : '😌'}</span>
                {dia.entreno && dia.hora && <span className="hora">{dia.hora}</span>}
                {dia.entreno && <span className="min">{dia.minEntreno}′</span>}
                <span className="pasos">{Math.round(dia.pasos / 1000)}k</span>
              </button>
            );
          })}
        </div>

        {editando && (
          <EditorPacto
            dia={editando}
            indice={DIAS.indexOf(editando)}
            valor={pacto.dias[editando]}
            onGuardar={(campos) => { guardarDia(editando, campos); setEditando(null); }}
            onCerrar={() => setEditando(null)}
          />
        )}

        <p className="mf-nota">
          Toca un día para ajustarlo. Fíjate en que los días de entreno piden
          menos pasos: pedirte entrenar <em>y</em> andar mucho el mismo día
          puede llegar a ser insostenible.
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">🍽️ Comida</h3>
        <label className="mf-campo">
          <span>Objetivo diario <small>kcal</small></span>
          <input type="number" step="50" value={pacto.comidaKcal ?? ''} placeholder="sin objetivo"
                 onChange={(e) => onCambiar({
                   ...pacto,
                   comidaKcal: e.target.value ? Number(e.target.value) : null,
                   /* A partir de que lo tocas es tuyo: deja de recalcularse
                      solo cuando cambian tus datos o el pacto. */
                   comidaManual: true })} />
        </label>
        {pacto.comidaManual && (
          <p className="mf-nota">
            Este objetivo lo pusiste tú, así que no se recalcula solo.{' '}
            <button className="mf-enlace"
                    onClick={() => onCambiar({ ...pacto, comidaManual: false })}>
              Volver al calculado
            </button>
          </p>
        )}

        {m && (
          <>
            <div className="mf-macros">
              <Macro n={m.proteina} etiqueta="proteína" color="#E86A5A" />
              <Macro n={m.carbos} etiqueta="carbos" color="#7CC3F2" />
              <Macro n={m.grasa} etiqueta="grasa" color="#F5C518" />
            </div>
            <p className="mf-nota">
              Las macros son <b>orientativas y no cuentan</b> para el
              cumplimiento. Clavarlas al gramo no es el objetivo.
            </p>
          </>
        )}
      </div>

      {estado && (
        <div className="mf-tarjeta">
          <h3 className="mf-h3">Últimos 7 días</h3>
          <div className="mf-tira">
            {estado.evaluaciones.slice(0, 7).reverse().map((d) => (
              <div key={d.fecha}
                   className={`mf-cuadro ${d.abierto ? 'abierto' : d.cumple ? 'ok' : 'fallo'}`}
                   title={`${d.fecha} · ${Math.round(d.proporcion * 100)}%`}>
                <span>{DIAS_INICIAL[claveCorta(d.fecha)] ?? '·'}</span>
              </div>
            ))}
          </div>
          <div className="mf-leyenda">
            <i className="ok" /> cumplido &nbsp; <i className="fallo" /> fallado &nbsp;
            <i className="abierto" /> aún a tiempo
          </div>
        </div>
      )}

    </div>
  );
}

/* --- ficha del día, desplegada bajo la fila --- */
function EditorPacto({ dia, indice, valor, onGuardar, onCerrar }) {
  const [v, setV] = useState({
    entreno: valor.entreno,
    hora: valor.hora ?? '19:00',
    minEntreno: valor.minEntreno || 45,
    pasos: valor.pasos,
    ejercicios: valor.ejercicios ?? [],
  });

  return (
    <div className="mf-ficha">
      {/* la flecha apunta al centro de la columna que has tocado */}
      <i className="mf-ficha-flecha" style={{ left: `${((indice + 0.5) / 7) * 100}%` }} />
      <div className="mf-ficha-cuerpo">
        <h3 className="mf-h3">{DIAS_LARGO[dia]}</h3>

        <div className="mf-sexo">
          <button className={v.entreno ? 'sel' : ''} onClick={() => setV({ ...v, entreno: true })}>
            🏋️ Entreno
          </button>
          <button className={!v.entreno ? 'sel' : ''} onClick={() => setV({ ...v, entreno: false })}>
            😌 Descanso
          </button>
        </div>

        {v.entreno && (
          <>
            <label className="mf-campo">
              <span>Hora</span>
              <input type="time" value={v.hora}
                     onChange={(e) => setV({ ...v, hora: e.target.value })} />
            </label>
            <label className="mf-campo">
              <span>Duración <small>min</small></span>
              <input type="number" step="5" value={v.minEntreno}
                     onChange={(e) => setV({ ...v, minEntreno: Number(e.target.value) })} />
            </label>
            <EditorEjercicios valor={v.ejercicios}
                              onCambiar={(ejercicios) => setV({ ...v, ejercicios })} />
          </>
        )}

        <label className="mf-campo">
          <span>Pasos</span>
          <input type="number" step="500" value={v.pasos}
                 onChange={(e) => setV({ ...v, pasos: Number(e.target.value) })} />
        </label>

        <div className="mf-hoja-pie">
          <button className="mf-boton" onClick={onCerrar}>Cancelar</button>
          <button className="mf-boton principal"
                  onClick={() => onGuardar({
                    entreno: v.entreno,
                    hora: v.entreno ? v.hora : null,
                    minEntreno: v.entreno ? v.minEntreno : 0,
                    pasos: v.pasos,
                    /* Los ejercicios sin nombre se tiran: una fila vacía
                       que se queda para siempre solo estorba. */
                    ejercicios: v.entreno
                      ? v.ejercicios.filter((e) => e.nombre.trim())
                      : [],
                  })}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function claveCorta(fechaISO) {
  const d = new Date(fechaISO + 'T12:00:00').getDay();
  return DIAS[(d + 6) % 7];
}

function Dato({ valor, etiqueta, icono }) {
  return (
    <div className="mf-dato">
      <span className="ic">{icono}</span>
      <b>{valor}</b>
      <small>{etiqueta}</small>
    </div>
  );
}

function Macro({ n, etiqueta, color }) {
  return (
    <div className="mf-macro">
      <b style={{ color }}>{n} g</b>
      <small>{etiqueta}</small>
    </div>
  );
}
