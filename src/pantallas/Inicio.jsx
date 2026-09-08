/* ============================================================
   Pantalla "Inicio"
   Solo el michi y los datos que de verdad importan hoy. El globo de
   texto y la tarjeta de nivel se fueron DENTRO del huevo, que es donde
   tienen sentido.

   Los tres botones del aparato no tocan los datos: son vida, no
   mecánica. Mimar no da experiencia a propósito — si diera, dejaría
   de ser cariño.
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';

export default function Inicio({ estado, entradas, pacto }) {
  const [gesto, setGesto] = useState(null);      // 'mimar' | 'estado' | null
  const [durmiendo, setDurmiendo] = useState(false);

  const visual = estadoVisual(estado, entradas, pacto);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};
  const pendientes = hoy?.objetivos.filter((o) => !o.cumplido && o.id !== 'descanso') ?? [];

  const pulsar = (id) => {
    if (id === 'dormir') { setDurmiendo((d) => !d); setGesto(null); return; }
    setDurmiendo(false);
    setGesto(id);
    // los dos gestos se deshacen solos: son un momento, no un modo
    setTimeout(() => setGesto((g) => (g === id ? null : g)), id === 'mimar' ? 2600 : 5000);
  };

  return (
    <div className="mf-pagina">
      <div className="mf-escena">
        <Tamagotchi
          estado={visual.cuerpo}
          size={300}
          dormido={durmiendo || estado.dormido}
          mimando={gesto === 'mimar'}
          nivel={estado.nivel}
          mensaje={gesto === 'estado' ? resumen(estado, pendientes) : null}
          onBoton={pulsar}
          escenario={
            (entradaHoy.entrenoMin ?? 0) > 0 ? 'gimnasio'
              : (entradaHoy.pasos ?? 0) > 0 ? 'calle'
              : 'casa'
          }
        />
      </div>

      <Marcador estado={estado} entradaHoy={entradaHoy} pacto={pacto} />

      {estado.gastados.length > 0 && (
        <div className="mf-aviso suave">
          🛡️ El michi te cubrió {estado.gastados.length === 1 ? 'un día' : `${estado.gastados.length} días`}.
          Tu racha sigue viva.
        </div>
      )}

      {estado.descansosRotos >= 2 && (
        <div className="mf-aviso suave">
          😌 Has entrenado {estado.descansosRotos} días de descanso esta semana.
          El descanso es parte del pacto, no un hueco que rellenar.
        </div>
      )}

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Hoy</h3>
        {hoy?.objetivos.map((o) => (
          <div key={o.id} className={`mf-obj ${o.cumplido ? 'ok' : ''}`}>
            <span>{o.cumplido ? '✅' : '⬜'} {o.etiqueta}</span>
            <b>{o.valor ?? '—'}{o.objetivo ? ` / ${o.objetivo}` : ''}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Lo que cuenta el michi al pulsar el botón azul, dentro de la pantalla. */
function resumen(estado, pendientes) {
  const trozos = [];
  trozos.push(estado.racha > 0
    ? `Llevamos ${estado.racha} ${estado.racha === 1 ? 'día' : 'días'} de racha`
    : 'Hoy empezamos de cero');
  if (estado.comodines > 0) {
    trozos.push(`tengo ${estado.comodines} ${estado.comodines === 1 ? 'escudo' : 'escudos'}`);
  }
  if (estado.descansosRotos >= 2) trozos.push('y me vendría bien descansar');
  else if (!pendientes.length) trozos.push('y hoy ya está todo hecho');
  else trozos.push(`y hoy falta ${pendientes.map((p) => p.etiqueta.toLowerCase()).join(' y ')}`);
  return trozos.join(', ') + ' 🐾';
}
