/* ============================================================
   Pantalla "Mi pacto"
   Todo lo pactado en un sitio: entrenos, pasos, descanso y comida.
   Las macros salen, pero NO cuentan para el cumplimiento — son
   orientativas, no un examen.
   ============================================================ */

import { DIAS, DIAS_LARGO } from '../engine/constantes.js';
import { macros, reposoEfectivo, gastoActividad } from '../engine/calculos.js';

export default function Pacto({ pacto, perfil, estado, onCambiar }) {
  if (!pacto) return null;

  const diasEntreno = DIAS.filter((d) => pacto.dias[d].entreno);
  const diasDescanso = DIAS.filter((d) => !pacto.dias[d].entreno);
  const pasosSemana = DIAS.reduce((a, d) => a + pacto.dias[d].pasos, 0);
  const minSemana = diasEntreno.reduce((a, d) => a + pacto.dias[d].minEntreno, 0);

  const m = pacto.comidaKcal
    ? macros({ kcal: pacto.comidaKcal, pesoMeta: perfil.pesoMeta, proteinaPorKg: perfil.proteinaPorKg })
    : null;

  const editar = (dia, campo, valor) =>
    onCambiar({ ...pacto, dias: { ...pacto.dias, [dia]: { ...pacto.dias[dia], [campo]: valor } } });

  return (
    <div className="mf-pagina">
      <h2 className="mf-h2">🤝 Mi pacto</h2>
      <p className="mf-sub">
        Esto es lo que tú decidiste. El michi no te juzga: te lo recuerda.
      </p>

      {/* --- resumen de la semana --- */}
      <div className="mf-tarjeta mf-resumen">
        <Dato valor={diasEntreno.length} etiqueta="días de entreno" icono="🏋️" />
        <Dato valor={diasDescanso.length} etiqueta="días de descanso" icono="😌" />
        <Dato valor={(pasosSemana / 1000).toFixed(0) + 'k'} etiqueta="pasos/semana" icono="👟" />
        <Dato valor={minSemana + "'"} etiqueta="entreno/semana" icono="⏱️" />
      </div>

      {/* --- la semana, día a día --- */}
      <div className="mf-tarjeta">
        <h3 className="mf-h3">Tu semana</h3>
        <div className="mf-semana">
          {DIAS.map((d) => {
            const dia = pacto.dias[d];
            return (
              <div key={d} className={`mf-dia ${dia.entreno ? 'entreno' : 'descanso'}`}>
                <div className="mf-dia-cab">
                  <b>{DIAS_LARGO[d]}</b>
                  <button
                    className={`mf-toggle ${dia.entreno ? 'on' : ''}`}
                    onClick={() => editar(d, 'entreno', !dia.entreno)}
                  >
                    {dia.entreno ? '🏋️ Entreno' : '😌 Descanso'}
                  </button>
                </div>
                <div className="mf-dia-campos">
                  <label>
                    <span>👟 Pasos</span>
                    <input
                      type="number"
                      step="500"
                      value={dia.pasos}
                      onChange={(e) => editar(d, 'pasos', Number(e.target.value))}
                    />
                  </label>
                  {dia.entreno && (
                    <label>
                      <span>⏱️ Minutos</span>
                      <input
                        type="number"
                        step="5"
                        value={dia.minEntreno}
                        onChange={(e) => editar(d, 'minEntreno', Number(e.target.value))}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mf-nota">
          Fíjate en que los días de entreno piden menos pasos. Un pacto que te
          exija entrenar <em>y</em> andar mucho el mismo día se incumple solo.
        </p>
      </div>

      {/* --- comida --- */}
      <div className="mf-tarjeta">
        <h3 className="mf-h3">🍽️ Comida</h3>
        <label className="mf-campo">
          <span>Objetivo diario (kcal)</span>
          <input
            type="number"
            step="50"
            value={pacto.comidaKcal ?? ''}
            placeholder="sin objetivo"
            onChange={(e) =>
              onCambiar({ ...pacto, comidaKcal: e.target.value ? Number(e.target.value) : null })
            }
          />
        </label>

        {m && (
          <>
            <div className="mf-macros">
              <Macro n={m.proteina} etiqueta="proteína" color="#FF6B9D" />
              <Macro n={m.carbos} etiqueta="carbos" color="#4ECDC4" />
              <Macro n={m.grasa} etiqueta="grasa" color="#FFC93C" />
            </div>
            <p className="mf-nota">
              Las macros son <b>orientativas y no cuentan</b> para el cumplimiento.
              Lo que se mira son los entrenos, los pasos, el descanso y las
              calorías. Clavarlas al gramo no es el objetivo.
            </p>
          </>
        )}
      </div>

      {/* --- cómo va --- */}
      {estado && (
        <div className="mf-tarjeta">
          <h3 className="mf-h3">Últimos 7 días</h3>
          <div className="mf-tira">
            {estado.evaluaciones.slice(0, 7).reverse().map((d) => (
              <div
                key={d.fecha}
                className={`mf-cuadro ${
                  d.abierto ? 'abierto' : d.cumple ? 'ok' : 'fallo'
                }`}
                title={`${d.fecha} · ${Math.round(d.proporcion * 100)}%`}
              >
                <span>{DIAS_LARGO[claveCorta(d.fecha)]?.[0] ?? '·'}</span>
              </div>
            ))}
          </div>
          <div className="mf-leyenda">
            <i className="ok" /> cumplido &nbsp; <i className="fallo" /> fallado &nbsp;
            <i className="abierto" /> aún puedes rellenarlo
          </div>
        </div>
      )}
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
