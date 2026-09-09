/* ============================================================
   Primer arranque
   La app es pública: no trae datos de nadie dentro. Cada usuario
   rellena los suyos aquí, y se quedan en su dispositivo.
   ============================================================ */

import { useState } from 'react';
import { useT } from '../i18n/index.jsx';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import { DIAS } from '../engine/constantes.js';
import { tmb, imc, avisosDeSeguridad, planEnergetico } from '../engine/calculos.js';
import { pactoPorDefecto } from '../engine/pacto.js';

export default function Bienvenida({ onEmpezar }) {
  const t = useT();
  const [p, setP] = useState({
    sexo: 'hombre', edad: '', altura: '',
    pesoActual: '', pesoMeta: '', reposoReal: '',
  });
  const [pasos, setPasos] = useState(6000);
  const [entreno, setEntreno] = useState({ lun: true, mie: true, vie: true });
  const [minEntreno, setMinEntreno] = useState(45);

  const num = (v) => (v === '' || v == null ? null : Number(v));
  const perfil = {
    sexo: p.sexo,
    edad: num(p.edad),
    altura: num(p.altura),
    pesoInicial: num(p.pesoActual),
    pesoActual: num(p.pesoActual),
    pesoMeta: num(p.pesoMeta),
    reposoReal: num(p.reposoReal),
    proteinaPorKg: 2,
    deficitObjetivo: 500,
  };

  const completo = perfil.edad && perfil.altura && perfil.pesoActual && perfil.pesoMeta;
  const estimado = tmb(perfil);

  /* El plan se calcula con el pacto que se esta eligiendo aqui abajo: los
     dias de entreno y los pasos cambian el gasto, y por tanto lo que toca
     comer. Antes era un factor plano igual para todo el mundo. */
  const borrador = pactoPorDefecto({ metaPasos: pasos });
  for (const d of DIAS) {
    const e = !!entreno[d];
    borrador.dias[d] = {
      entreno: e, minEntreno: e ? minEntreno : 0,
      pasos: e ? Math.round((pasos * 0.66) / 500) * 500 : pasos,
    };
  }
  const plan = planEnergetico(perfil, borrador);
  const reposo = plan?.reposo ?? null;
  const mantenimiento = plan?.total ?? null;
  const paraPerder = plan?.comida ?? null;
  const imcActual = imc(perfil.pesoActual, perfil.altura);
  const imcMeta = imc(perfil.pesoMeta, perfil.altura);

  const avisos = completo
    ? avisosDeSeguridad({ perfil, comidaKcal: paraPerder, kgPorSemana: null })
    : [];

  const diasEntreno = DIAS.filter((d) => entreno[d]);

  const empezar = () => {
    onEmpezar({ perfil, pacto: { ...borrador, comidaKcal: paraPerder } });
  };

  return (
    <div className="mf-pagina">
      <div className="mf-escena">
        <Tamagotchi estado="kawaii" cara="feliz" size={210} escenario="casa" />
        <p className="mf-globo">
          {t('bienvenida.globo')}
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('bienvenida.sobreTi')}</h3>
        <div className="mf-sexo">
          {['hombre', 'mujer'].map((s) => (
            <button key={s} className={p.sexo === s ? 'sel' : ''}
                    onClick={() => setP({ ...p, sexo: s })}>
              {s === 'hombre' ? t('comun.hombre') : t('comun.mujer')}
            </button>
          ))}
        </div>
        <C et={t('bienvenida.edad')} v={p.edad} on={(v) => setP({ ...p, edad: v })} ph={t('bienvenida.edadPh')} />
        <C et={t('bienvenida.altura')} u={t('comun.cm')} v={p.altura} on={(v) => setP({ ...p, altura: v })} />
        <C et={t('bienvenida.pesoActual')} u={t('comun.kg')} paso="0.1" v={p.pesoActual} on={(v) => setP({ ...p, pesoActual: v })} />
        <C et={t('bienvenida.pesoMeta')} u={t('comun.kg')} paso="0.1" v={p.pesoMeta} on={(v) => setP({ ...p, pesoMeta: v })} />
        {imcActual && (
          <p className="mf-nota">
            {imcMeta
              ? t('ajustes.imc', { actual: imcActual.toFixed(1), meta: imcMeta.toFixed(1) })
              : t('ajustes.imcSolo', { actual: imcActual.toFixed(1) })}
          </p>
        )}
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('bienvenida.gastoReposo')}</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          {t('bienvenida.gastoNota')}
        </p>
        <C et={t('bienvenida.enReposo')} u={t('comun.kcalDia')} v={p.reposoReal}
           on={(v) => setP({ ...p, reposoReal: v })}
           ph={estimado ? `≈ ${estimado}` : ''} />
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('bienvenida.tuPacto')}</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          {t('bienvenida.pactoNota')}
        </p>
        <div className="mf-dias">
          {DIAS.map((d) => (
            <button key={d} className={entreno[d] ? 'sel' : ''}
                    onClick={() => setEntreno({ ...entreno, [d]: !entreno[d] })}>
              {t('dias.inicial.' + d)}
            </button>
          ))}
        </div>
        <C et={t('bienvenida.pasosDia')} v={pasos} paso="500" on={(v) => setPasos(Number(v) || 0)} />
        <C et={t('bienvenida.minPorEntreno')} v={minEntreno} paso="5" on={(v) => setMinEntreno(Number(v) || 0)} />
        <p className="mf-nota">
          {t('bienvenida.resumenPacto', {
            entreno: diasEntreno.length, descanso: 7 - diasEntreno.length,
            pasos: Math.round((pasos * 0.66) / 500) * 500 })}
        </p>
      </div>

      {completo && paraPerder && (
        <div className="mf-tarjeta mf-calculado">
          <h3 className="mf-h3">{t('bienvenida.propongo')}</h3>
          <L i="😴" t={t('bienvenida.lineaReposo')} v={`${reposo} ${t('comun.kcalDia')}`} />
          <L i="🔥" t={t('bienvenida.lineaMantenimiento')} v={`${mantenimiento} ${t('comun.kcalDia')}`} />
          <L i="🍙" t={t('bienvenida.lineaPerder')} v={`${paraPerder} ${t('comun.kcalDia')}`} />
          {plan?.recorte && (
            <p className="mf-nota">
              {plan.recorte === 'suelo'
                ? t('bienvenida.recorteSuelo', { suelo: plan.suelo })
                : t('bienvenida.recorteTecho', { aplicado: plan.deficit })}
            </p>
          )}
          <p className="mf-nota">
            {t('bienvenida.puntoPartida')}
          </p>
        </div>
      )}

      {avisos.map((a) => <div key={a.tipo} className="mf-aviso">⚠️ {t(a.clave, a.vars)}</div>)}

      <button className="mf-boton principal" disabled={!completo} onClick={empezar}>
        {completo ? t('bienvenida.vamos') : t('bienvenida.rellena')}
      </button>

      <p className="mf-pie">
        {t('bienvenida.pie')}
      </p>
    </div>
  );
}

function C({ et, u, v, on, paso = '1', ph }) {
  return (
    <label className="mf-campo">
      <span>{et}{u && <small> {u}</small>}</span>
      <input type="number" step={paso} value={v} placeholder={ph}
             onChange={(e) => on(e.target.value)} />
    </label>
  );
}

function L({ i, t, v }) {
  return <div className="mf-linea"><span>{i} {t}</span><b>{v}</b></div>;
}
