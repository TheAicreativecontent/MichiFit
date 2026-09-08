/* ============================================================
   Pantalla "Logros"
   Los hitos que el motor ya calculaba y que no se veían en ningún
   sitio. Cada uno cuenta 100 XP, así que era información que movía el
   nivel del michi sin que el usuario pudiera verla.

   Los que faltan se enseñan también, en gris: saber qué te queda por
   conseguir motiva más que descubrirlo por sorpresa.
   ============================================================ */

import { HITOS, XP_POR_HITO, NIVELES } from '../engine/constantes.js';
import { Titulo } from './Ayuda.jsx';

export default function Logros({ estado }) {
  const conseguidos = new Set(estado.hitosDesbloqueados ?? []);
  const total = HITOS.length;

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
          <p>
            Hitos que se consiguen una vez y <b>no se pierden nunca</b>,
            aunque falles después. Cada uno suma experiencia al michi.
          </p>
          <p>
            Se comprueban contra todo tu historial, así que si apuntas un
            día antiguo que cumplía un hito, se desbloquea igual.
          </p>
        </>}>
        🏅 Tus logros
      </Titulo>
      <p className="mf-sub">
        {conseguidos.size} de {total} · cada uno suma {XP_POR_HITO} XP
      </p>

      <div className="mf-tarjeta">
        <div className="mf-nivel-fila">
          <span>{estado.nivel.emoji} {estado.nivel.nombre}</span>
          <b className="mf-mk-num">{estado.nivel.xp} XP</b>
        </div>
        <div className="mf-xp">
          <div style={{ width: `${estado.nivel.progreso * 100}%` }} />
        </div>
        <div className="mf-escalera">
          {NIVELES.map((n) => (
            <div key={n.nivel}
                 className={`mf-peldano ${estado.nivel.nivel >= n.nivel ? 'ok' : ''}`}>
              <span>{n.emoji}</span>
              <small>{n.nombre}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="mf-logros">
        {HITOS.map((h) => {
          const hecho = conseguidos.has(h.id);
          return (
            <div key={h.id} className={`mf-logro ${hecho ? 'ok' : ''}`}>
              <span className="ic">{hecho ? h.emoji : '🔒'}</span>
              <div>
                <b>{h.nombre}</b>
                <small>{h.desc}</small>
              </div>
              {hecho && <i className="tick">✓</i>}
            </div>
          );
        })}
      </div>

      <p className="mf-pie">
        Los logros no se pierden nunca. Una vez conseguidos, son tuyos
        aunque falles una semana.
      </p>
    </div>
  );
}
