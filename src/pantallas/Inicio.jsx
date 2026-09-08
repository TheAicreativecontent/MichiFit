/* ============================================================
   Pantalla "Inicio"
   El michi, lo que falta hoy, y las acciones de cuidado.
   Las acciones no inventan datos: son la misma información
   presentada como cuidado. Acariciar no da XP a propósito.
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';

export default function Inicio({ estado, entradas, pacto }) {
  /* Los tres botones del aparato. Ninguno toca tus datos: son vida, no
     mecánica. Mimar no da experiencia a propósito — si diera, dejaría de
     ser cariño. */
  const [gesto, setGesto] = useState(null);   // 'mimar' | 'estado' | null
  const [durmiendo, setDurmiendo] = useState(false);

  const pulsar = (id) => {
    if (id === 'dormir') { setDurmiendo((d) => !d); setGesto(null); return; }
    setDurmiendo(false);
    setGesto(id);
    if (id === 'mimar') setTimeout(() => setGesto((g) => (g === 'mimar' ? null : g)), 2600);
  };

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
          dormido={durmiendo || estado.dormido}
          mimando={gesto === 'mimar'}
          onBoton={pulsar}
          size={300}
          puntos={estado.nivel.progreso}
          escenario={
            (entradaHoy.entrenoMin ?? 0) > 0 ? 'gimnasio'
              : (entradaHoy.pasos ?? 0) > 0 ? 'calle'
              : 'casa'
          }
          iconos={[
            { id: 'pasos', emoji: '👟', activo: hoy?.objetivos.find((o) => o.id === 'pasos')?.cumplido },
            { id: 'entreno', emoji: '🏋️', activo: (entradaHoy.entrenoMin ?? 0) > 0 },
            { id: 'comida', emoji: '🍽️', activo: entradaHoy.comidaKcal != null },
            { id: 'sueno', emoji: '🌙', activo: entradaHoy.suenoHoras != null },
          ]}
        />
        <p className="mf-globo">{frase(estado, pendientes, gesto, durmiendo)}</p>

        <div className="mf-nivel">
          <span>{estado.nivel.emoji} {estado.nivel.nombre}</span>
          <div className="mf-xp"><div style={{ width: `${estado.nivel.progreso * 100}%` }} /></div>
          <small>
            {estado.nivel.xp} XP
            {estado.nivel.xpSiguiente ? ` · siguiente a ${estado.nivel.xpSiguiente}` : ' · máximo'}
          </small>
        </div>
      </div>

      <Marcador estado={estado} />

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

    </div>
  );
}

function frase(estado, pendientes, gesto, durmiendo) {
  if (durmiendo) return 'Zzz… hasta mañana 🌙';
  if (gesto === 'mimar') return '¡Prrrr! 💛';
  if (gesto === 'estado') return resumen(estado, pendientes);
  if (estado.dormido) return '¡Has vuelto! Estaba echando una siesta 😴';
  if (estado.abandono >= 10) return 'Te he echado de menos… ¿empezamos otra vez?';
  if (!pendientes.length) return '¡Pacto cumplido! Hoy has hecho lo que dijiste 🎉';
  const p = pendientes[0];
  if (p.id === 'pasos') return `Nos faltan ${Math.max(0, p.objetivo - (p.valor ?? 0))} pasos. ¿Damos una vuelta?`;
  if (p.id === 'entreno') return 'Hoy tocaba entrenar. ¡Cuando quieras!';
  if (p.id === 'comida') return 'Aún no me has contado qué has comido.';
  return 'Vamos poco a poco.';
}

/* Lo que cuenta el michi al pulsar el botón azul: cómo va la cosa hoy. */
function resumen(estado, pendientes) {
  const trozos = [];
  if (estado.racha > 0) {
    trozos.push(`Llevamos ${estado.racha} ${estado.racha === 1 ? 'día' : 'días'} de racha`);
  } else {
    trozos.push('Hoy empezamos de cero');
  }
  if (estado.comodines > 0) {
    trozos.push(`tengo ${estado.comodines} ${estado.comodines === 1 ? 'comodín' : 'comodines'} guardados`);
  }
  if (estado.descansosRotos >= 2) {
    trozos.push('y me vendría bien descansar');
  } else if (!pendientes.length) {
    trozos.push('y hoy ya está todo hecho');
  } else {
    trozos.push(`y hoy falta ${pendientes.map((p) => p.etiqueta.toLowerCase()).join(' y ')}`);
  }
  return trozos.join(', ') + ' 🐾';
}
