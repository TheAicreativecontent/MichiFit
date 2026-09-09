/* ============================================================
   Pantalla "¿y si...?"
   Portada de la MichiFit original: mueves los controles y ves cómo
   cambia la fecha de meta. Mismas fórmulas que allí.
   ============================================================ */

import { useMemo, useState } from 'react';
import { simular, avisosDeSeguridad, planEnergetico } from '../engine/calculos.js';
import { Titulo } from './Ayuda.jsx';

/* La misma ayuda en los dos estados de la pantalla (con perfil y sin
   él): definida una vez para que no se separen al tocar una. */
const AYUDA = (
  <>
          <p>
            Para probar escenarios sin tocar nada: cambia los pasos, el
            entreno o las calorías y mira cuánto tardarías en llegar a tu
            meta. <b>No guarda nada</b>.
          </p>
          <p>
            Los números salen de fórmulas estándar (Mifflin-St Jeor y
            7700 kcal por kilo de grasa). Son una estimación, no una
            promesa: tu cuerpo no es una hoja de cálculo.
          </p>
        </>
);

export default function Simulador({ perfil, pacto }) {
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
        <Titulo ayuda={AYUDA}>🎯 Simulador «¿y si...?»</Titulo>
        <div className="mf-tarjeta">
          <p>Rellena tu perfil en Ajustes para poder simular.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mf-pagina">
      <Titulo ayuda={AYUDA}>🎯 Simulador «¿y si...?»</Titulo>

      <div className="mf-tarjeta">
        <p className="mf-globo">
          Mueve los controles y mira cómo cambia tu fecha de meta ✨
        </p>
        <Deslizador etiqueta="🚶 Pasos al día" v={pasos} set={setPasos} min={0} max={20000} paso={500} unidad="" />
        <Deslizador etiqueta="🏋️ Entreno por semana" v={entreno} set={setEntreno} min={0} max={600} paso={15} unidad=" min" />
        <Deslizador etiqueta="🍽️ Comida al día" v={comida} set={setComida} min={1000} max={4000} paso={25} unidad=" kcal" />
      </div>

      <div className={`mf-meta ${r.alcanzable ? '' : 'inalcanzable'}`}>
        {r.alcanzable ? (
          <>
            <small>Llegarías a {perfil.pesoMeta} kg en</small>
            <b>{r.meses.toFixed(1)}</b>
            <small>meses · {Math.round(r.semanas)} semanas</small>
            <div className="mf-fecha">
              📅 ~{r.fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </>
        ) : (
          <>
            <b>—</b>
            <small>
              Con estos números no bajarías de peso. Prueba a mover algo:
              menos comida, más pasos o más entreno.
            </small>
          </>
        )}
      </div>

      <div className="mf-rejilla">
        <Celda n={r.total} etiqueta="Gasto total/día (kcal)" />
        <Celda n={r.deficit} etiqueta="Déficit diario (kcal)" signo />
        <Celda n={r.quemadoMoviendote} etiqueta="Quemado moviéndote" />
        <Celda n={r.kgPorSemana.toFixed(2)} etiqueta="kg por semana" signo />
      </div>

      {avisos.map((a) => (
        <div key={a.tipo} className="mf-aviso">⚠️ {a.texto}</div>
      ))}

      <p className="mf-pie">
        Estimaciones aproximadas (Mifflin-St Jeor, 0,04 kcal/paso, 8 kcal/min de
        entreno). El cuerpo no es una calculadora: tómalo como guía, no como
        verdad absoluta.
      </p>
    </div>
  );
}

function Deslizador({ etiqueta, v, set, min, max, paso, unidad }) {
  return (
    <label className="mf-desliza">
      <span>{etiqueta}</span>
      <b>{v.toLocaleString('es-ES')}{unidad}</b>
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
