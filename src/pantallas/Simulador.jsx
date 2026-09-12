/* ============================================================
   Pantalla "¿y si...?"
   Portada de la MichiFit original: mueves los controles y ves cómo
   cambia la fecha de meta. Mismas fórmulas que allí.
   ============================================================ */

import { useMemo, useState } from 'react';
import T from '../i18n/Texto.jsx';
import { useT, useFormato } from '../i18n/index.jsx';
import { simular, avisosDeSeguridad, planEnergetico } from '../engine/calculos.js';
import { PASOS_MIN, PASOS_MAX, PASOS_PASO, ENTRENO_SEMANA_MAX,
         KCAL_MINIMAS, SUPERAVIT_MAXIMO } from '../engine/constantes.js';
import { Titulo } from './Ayuda.jsx';

/* La misma ayuda en los dos estados de la pantalla (con perfil y sin
   él): definida una vez para que no se separen al tocar una. */
const AYUDA = () => (
  <>
          <T k="simulador.ayuda1" />
          <T k="simulador.ayuda2" />
        </>
);

export default function Simulador({ perfil, pacto }) {
  const t = useT();
  const fmt = useFormato();
  /* El arranque sale del pacto, que puede estar fuera de la banda del
     deslizador: hay quien tiene pactados 18.000 pasos. Se estira la
     banda en `min`/`max` en vez de recortarle el numero. */
  const [pasos, setPasos] = useState(pacto?.dias?.mar?.pasos ?? 6000);
  const [entreno, setEntreno] = useState(120);
  const arranque = planEnergetico(perfil, pacto);
  const [comida, setComida] = useState(pacto?.comidaKcal ?? arranque?.comida ?? 2000);

  /* El rango de la COMIDA sale de la persona, no de dos numeros fijos.
     El suelo es el que la app defiende en `KCAL_MINIMAS` y el techo es
     lo mas que considera sensato comer de mas (`SUPERAVIT_MAXIMO`), o
     sea los mismos limites que usa `planEnergetico`: asi el deslizador
     no puede llevarte a un sitio que el motor considera imposible.

     El `Math.min`/`Math.max` con `comida` no es de adorno. Si alguien
     escribio su objetivo A MANO (`comidaManual`) puede estar fuera de la
     banda, y un deslizador que arranca fuera de su propio rango se
     coloca solo en el extremo y le cambia el numero al usuario sin que
     lo pida. Antes que eso, se ensancha la banda. */
  const gasto = arranque?.total ?? null;
  const pasosMin = Math.min(pasos, PASOS_MIN);
  const pasosMax = Math.max(pasos, PASOS_MAX);
  const comidaMin = Math.min(comida, KCAL_MINIMAS[perfil?.sexo === 'mujer' ? 'mujer' : 'hombre']);
  const comidaMax = Math.max(comida, Math.round((gasto ?? 2600) * (1 + SUPERAVIT_MAXIMO)));

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
        <Deslizador etiqueta={t('simulador.pasosDia')} v={pasos} set={setPasos}
                    min={pasosMin} max={pasosMax} paso={PASOS_PASO} unidad="" />
        <Deslizador etiqueta={t('simulador.entrenoSemana')} v={entreno} set={setEntreno}
                    min={0} max={ENTRENO_SEMANA_MAX} paso={15} unidad=" min" />
        <Deslizador etiqueta={t('simulador.comidaDia')} v={comida} set={setComida}
                    min={comidaMin} max={comidaMax} paso={25} unidad=" kcal" />
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
