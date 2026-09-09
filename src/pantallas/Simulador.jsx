/* ============================================================
   Pantalla "¿y si...?"
   Portada de la MichiFit original: mueves los controles y ves cómo
   cambia la fecha de meta. Mismas fórmulas que allí.
   ============================================================ */

import { useMemo, useState } from 'react';
import { useT, useFormato } from '../i18n/index.jsx';
import { simular, avisosDeSeguridad, planEnergetico } from '../engine/calculos.js';
import { Titulo } from './Ayuda.jsx';

/* La misma ayuda en los dos estados de la pantalla (con perfil y sin
   él): definida una vez para que no se separen al tocar una. */
const AYUDA = (t) => (
  <>
          <p dangerouslySetInnerHTML={{ __html: t('simulador.ayuda1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('simulador.ayuda2') }} />
        </>
);

export default function Simulador({ perfil, pacto }) {
  const t = useT();
  const fmt = useFormato();
  const [pasos, setPasos] = useState(pacto?.dias?.mar?.pasos ?? 6000);
  const [entreno, setEntreno] = useState(120);
  const arranque = planEnergetico(perfil, pacto);
  const [comida, setComida] = useState(pacto?.comidaKcal ?? arranque?.comida ?? 2000);

  const r = useMemo(
    () => simular({ perfil, pasos, minEntrenoSemana: entreno, comidaKcal: comida }),
    [perfil, pasos, entreno, comida]
  );

  const avisos = useMemo(
    () => (r ? avisosDeSeguridad({ perfil, comidaKcal: comida, kgPorSemana: r.kgPorSemana }) : []),
    [perfil, comida, r]
  );

  if (!r) {
    return (
      <div className="mf-pagina">
        <Titulo ayuda={AYUDA(t)}>{t('simulador.titulo')}</Titulo>
        <div className="mf-tarjeta">
          <p>{t('simulador.sinPerfil')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mf-pagina">
      <Titulo ayuda={AYUDA(t)}>{t('simulador.titulo')}</Titulo>

      <div className="mf-tarjeta">
        <p className="mf-globo">
          {t('simulador.globo')}
        </p>
        <Deslizador etiqueta={t('simulador.pasosDia')} v={pasos} set={setPasos} min={0} max={20000} paso={500} unidad="" />
        <Deslizador etiqueta={t('simulador.entrenoSemana')} v={entreno} set={setEntreno} min={0} max={600} paso={15} unidad=" min" />
        <Deslizador etiqueta={t('simulador.comidaDia')} v={comida} set={setComida} min={1000} max={4000} paso={25} unidad=" kcal" />
      </div>

      <div className={`mf-meta ${r.alcanzable ? '' : 'inalcanzable'}`}>
        {r.alcanzable ? (
          <>
            <small>{t('simulador.llegarias', { kg: perfil.pesoMeta })}</small>
            <b>{r.meses.toFixed(1)}</b>
            <small>{t('simulador.meses', { n: Math.round(r.semanas) })}</small>
            <div className="mf-fecha">
              📅 ~{fmt.fecha(r.fecha)}
            </div>
          </>
        ) : (
          <>
            <b>—</b>
            <small>
              {t('simulador.noBajarias')}
            </small>
          </>
        )}
      </div>

      <div className="mf-rejilla">
        <Celda n={r.total} etiqueta={t('simulador.gastoTotal')} />
        <Celda n={r.deficit} etiqueta={t('simulador.deficitDiario')} signo />
        <Celda n={r.quemadoMoviendote} etiqueta={t('simulador.quemado')} />
        <Celda n={r.kgPorSemana.toFixed(2)} etiqueta={t('simulador.kgSemana')} signo />
      </div>

      {avisos.map((a) => (
        <div key={a.tipo} className="mf-aviso">⚠️ {t(a.clave, a.vars)}</div>
      ))}

      <p className="mf-pie">
        {t('simulador.pie')}
      </p>
    </div>
  );
}

function Deslizador({ etiqueta, v, set, min, max, paso, unidad }) {
  const t = useT();
  const fmt = useFormato();
  return (
    <label className="mf-desliza">
      <span>{etiqueta}</span>
      <b>{fmt.n(v)}{unidad}</b>
      <input type="range" min={min} max={max} step={paso} value={v}
             onChange={(e) => set(Number(e.target.value))} />
    </label>
  );
}

function Celda({ n, etiqueta, signo }) {
  const num = Number(n);
  const clase = signo ? (num < 0 ? 'bien' : 'mal') : '';
  return (
    <div className="mf-celda">
      <b className={clase}>{signo && num > 0 ? '+' : ''}{n}</b>
      <small>{etiqueta}</small>
    </div>
  );
}
