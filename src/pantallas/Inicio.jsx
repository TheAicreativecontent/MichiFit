/* ============================================================
   Pantalla "Inicio"
   El michi, lo que falta hoy, y las acciones de cuidado.
   Las acciones no inventan datos: son la misma información
   presentada como cuidado. Acariciar no da XP a propósito.
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';

export default function Inicio({ estado, entradas, pacto, onRegistrar }) {
  const [mimo, setMimo] = useState(null);
  const visual = estadoVisual(estado, entradas, pacto);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};

  const pendientes = hoy?.objetivos.filter((o) => !o.cumplido && o.id !== 'descanso') ?? [];

  return (
    <div className="mf-pagina">
      <div className="mf-escena">
        <Tamagotchi
          estado={visual.cuerpo}
          pose={visual.pose}
          cara={visual.cara}
          dormido={estado.dormido}
          size={230}
          puntos={estado.nivel.progreso}
          iconos={[
            { id: 'pasos', emoji: '👟', activo: hoy?.objetivos.find((o) => o.id === 'pasos')?.cumplido },
            { id: 'entreno', emoji: '🏋️', activo: (entradaHoy.entrenoMin ?? 0) > 0 },
            { id: 'comida', emoji: '🍽️', activo: entradaHoy.comidaKcal != null },
            { id: 'sueno', emoji: '🌙', activo: entradaHoy.suenoHoras != null },
          ]}
        />
        <p className="mf-globo">{frase(estado, pendientes, mimo)}</p>

        <div className="mf-nivel">
          <span>{estado.nivel.emoji} {estado.nivel.nombre}</span>
          <div className="mf-xp"><div style={{ width: `${estado.nivel.progreso * 100}%` }} /></div>
          <small>
            {estado.nivel.xp} XP
            {estado.nivel.xpSiguiente ? ` · siguiente a ${estado.nivel.xpSiguiente}` : ' · máximo'}
          </small>
        </div>
      </div>

      <div className="mf-rejilla">
        <Celda n={estado.racha} etiqueta="días de racha" />
        <Celda n={estado.comodines} etiqueta="comodines" icono="🛡️" />
        <Celda n={estado.energia} etiqueta="energía" />
        <Celda n={estado.forma} etiqueta="forma" />
      </div>

      {estado.gastados.length > 0 && (
        <div className="mf-aviso suave">
          🛡️ El michi te cubrió {estado.gastados.length === 1 ? 'un día' : `${estado.gastados.length} días`}.
          Tu racha sigue viva.
        </div>
      )}

      {estado.descansosRotos >= 2 && (
        <div className="mf-aviso suave">
          😌 Has entrenado {estado.descansosRotos} días de descanso esta semana. El
          descanso es parte del pacto, no un hueco que rellenar.
        </div>
      )}

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Hoy</h3>
        {hoy?.objetivos.map((o) => (
          <div key={o.id} className={`mf-obj ${o.cumplido ? 'ok' : ''}`}>
            <span>{o.cumplido ? '✅' : '⬜'} {o.etiqueta}</span>
            <b>
              {o.valor ?? '—'}
              {o.objetivo ? ` / ${o.objetivo}` : ''}
            </b>
          </div>
        ))}
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Cuidar del michi</h3>
        <div className="mf-acciones">
          <Accion icono="🏋️" t="Entrenarlo"
                  hecho={(entradaHoy.entrenoMin ?? 0) > 0}
                  onClick={() => onRegistrar({ entrenoMin: (entradaHoy.entrenoMin ?? 0) + 15 })} />
          <Accion icono="🍽️" t="Darle de comer"
                  hecho={entradaHoy.comidaKcal != null}
                  onClick={() => onRegistrar({ comidaKcal: (entradaHoy.comidaKcal ?? 0) + 300 })} />
          <Accion icono="👟" t="Sacarlo a pasear"
                  hecho={(entradaHoy.pasos ?? 0) > 0}
                  onClick={() => onRegistrar({ pasos: (entradaHoy.pasos ?? 0) + 1000 })} />
          <Accion icono="🌙" t="Acostarlo"
                  hecho={entradaHoy.suenoHoras != null}
                  onClick={() => onRegistrar({ suenoHoras: 7.5 })} />
          <Accion icono="💛" t="Acariciarlo"
                  onClick={() => setMimo(Date.now())} />
        </div>
        <p className="mf-nota">
          Acariciarlo no da experiencia, a propósito. Si diera, dejaría de ser
          cariño.
        </p>
      </div>
    </div>
  );
}

function frase(estado, pendientes, mimo) {
  if (mimo) return '¡Prrrr! 💛';
  if (estado.dormido) return '¡Has vuelto! Estaba echando una siesta 😴';
  if (estado.abandono >= 10) return 'Te he echado de menos… ¿empezamos otra vez?';
  if (!pendientes.length) return '¡Pacto cumplido! Hoy has hecho lo que dijiste 🎉';
  const p = pendientes[0];
  if (p.id === 'pasos') return `Nos faltan ${Math.max(0, p.objetivo - (p.valor ?? 0))} pasos. ¿Damos una vuelta?`;
  if (p.id === 'entreno') return 'Hoy tocaba entrenar. ¡Cuando quieras!';
  if (p.id === 'comida') return 'Aún no me has contado qué has comido.';
  return 'Vamos poco a poco.';
}

function Celda({ n, etiqueta, icono }) {
  return (
    <div className="mf-celda">
      <b>{icono ? `${icono} ` : ''}{n}</b>
      <small>{etiqueta}</small>
    </div>
  );
}

function Accion({ icono, t, hecho, onClick }) {
  return (
    <button className={`mf-accion ${hecho ? 'hecho' : ''}`} onClick={onClick}>
      <span>{icono}</span>
      <small>{t}</small>
    </button>
  );
}
