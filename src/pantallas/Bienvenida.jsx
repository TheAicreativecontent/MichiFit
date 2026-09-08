/* ============================================================
   Primer arranque
   La app es pública: no trae datos de nadie dentro. Cada usuario
   rellena los suyos aquí, y se quedan en su dispositivo.
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from '../mascota/Tamagotchi.jsx';
import { DIAS, DIAS_INICIAL } from '../engine/constantes.js';
import { tmb, imc, avisosDeSeguridad } from '../engine/calculos.js';
import { pactoPorDefecto } from '../engine/pacto.js';

export default function Bienvenida({ onEmpezar }) {
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
  const reposo = perfil.reposoReal || estimado;
  const mantenimiento = reposo ? Math.round(reposo * 1.15) : null;
  const paraPerder = mantenimiento ? mantenimiento - 500 : null;
  const imcActual = imc(perfil.pesoActual, perfil.altura);
  const imcMeta = imc(perfil.pesoMeta, perfil.altura);

  const avisos = completo
    ? avisosDeSeguridad({ perfil, comidaKcal: paraPerder, kgPorSemana: null })
    : [];

  const diasEntreno = DIAS.filter((d) => entreno[d]);

  const empezar = () => {
    const base = pactoPorDefecto({ metaPasos: pasos, comidaKcal: paraPerder });
    for (const d of DIAS) {
      const entrena = !!entreno[d];
      base.dias[d] = {
        entreno: entrena,
        minEntreno: entrena ? minEntreno : 0,
        pasos: entrena ? Math.round((pasos * 0.66) / 500) * 500 : pasos,
      };
    }
    onEmpezar({ perfil, pacto: base });
  };

  return (
    <div className="mf-pagina">
      <div className="mf-escena">
        <Tamagotchi estado="kawaii" cara="feliz" size={170} />
        <p className="mf-globo">
          ¡Hola! Soy tu michi. Cuéntame algo de ti y pactamos cómo nos cuidamos 🐾
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Sobre ti</h3>
        <div className="mf-sexo">
          {['hombre', 'mujer'].map((s) => (
            <button key={s} className={p.sexo === s ? 'sel' : ''}
                    onClick={() => setP({ ...p, sexo: s })}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
        <C et="Edad" v={p.edad} on={(v) => setP({ ...p, edad: v })} ph="años" />
        <C et="Altura" u="cm" v={p.altura} on={(v) => setP({ ...p, altura: v })} />
        <C et="Peso actual" u="kg" paso="0.1" v={p.pesoActual} on={(v) => setP({ ...p, pesoActual: v })} />
        <C et="Peso meta" u="kg" paso="0.1" v={p.pesoMeta} on={(v) => setP({ ...p, pesoMeta: v })} />
        {imcActual && (
          <p className="mf-nota">
            IMC actual {imcActual.toFixed(1)}
            {imcMeta && <> · IMC meta {imcMeta.toFixed(1)}</>}. El rango saludable
            suele estar entre 18,5 y 25.
          </p>
        )}
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Tu gasto en reposo</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          Si tienes reloj, pon tu media real: es más exacta que cualquier
          fórmula. Si lo dejas vacío, lo estimo yo.
        </p>
        <C et="En reposo" u="kcal/día" v={p.reposoReal}
           on={(v) => setP({ ...p, reposoReal: v })}
           ph={estimado ? `estimado: ${estimado}` : ''} />
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Tu pacto</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          Elige los días que quieres entrenar. El resto son de descanso, y el
          descanso también cuenta: forma parte del pacto.
        </p>
        <div className="mf-dias">
          {DIAS.map((d) => (
            <button key={d} className={entreno[d] ? 'sel' : ''}
                    onClick={() => setEntreno({ ...entreno, [d]: !entreno[d] })}>
              {DIAS_INICIAL[d]}
            </button>
          ))}
        </div>
        <C et="Pasos al día" v={pasos} paso="500" on={(v) => setPasos(Number(v) || 0)} />
        <C et="Minutos por entreno" v={minEntreno} paso="5" on={(v) => setMinEntreno(Number(v) || 0)} />
        <p className="mf-nota">
          {diasEntreno.length} días de entreno y {7 - diasEntreno.length} de
          descanso. Los días que entrenas te pediré menos pasos
          ({Math.round((pasos * 0.66) / 500) * 500}): pedir las dos cosas el
          mismo día es un pacto que se incumple solo.
        </p>
      </div>

      {completo && paraPerder && (
        <div className="mf-tarjeta mf-calculado">
          <h3 className="mf-h3">Lo que te propongo</h3>
          <L i="😴" t="En reposo" v={`${reposo} kcal/día`} />
          <L i="🔥" t="Mantenimiento" v={`${mantenimiento} kcal/día`} />
          <L i="🍙" t="Para perder" v={`${paraPerder} kcal/día`} />
          <p className="mf-nota">
            Son un punto de partida, no una orden. Puedes cambiarlo todo cuando
            quieras desde Ajustes.
          </p>
        </div>
      )}

      {avisos.map((a) => <div key={a.tipo} className="mf-aviso">⚠️ {a.texto}</div>)}

      <button className="mf-boton principal" disabled={!completo} onClick={empezar}>
        {completo ? '¡Vamos allá! 🐾' : 'Rellena tus datos para empezar'}
      </button>

      <p className="mf-pie">
        Tus datos se quedan en este dispositivo. No se envían a ningún sitio.
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
