/* ============================================================
   Pantalla "Logros"
   Los hitos que el motor ya calculaba y que no se veían en ningún
   sitio. Cada uno cuenta 100 XP, así que era información que movía el
   nivel del michi sin que el usuario pudiera verla.

   Los que faltan se enseñan también, en gris: saber qué te queda por
   conseguir motiva más que descubrirlo por sorpresa.
   ============================================================ */

import { HITOS, XP_POR_HITO, NIVELES } from '../engine/constantes.js';
import T from '../i18n/Texto.jsx';
import { Titulo } from './Ayuda.jsx';
import { useT } from '../i18n/index.jsx';

export default function Logros({ estado }) {
  const t = useT();
  const conseguidos = new Set(estado.hitosDesbloqueados ?? []);
  const total = HITOS.length;

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
          <T k="logros.ayuda1" />
          <p>{t('logros.ayuda2')}</p>
        </>}>
        {t('logros.titulo')}
      </Titulo>
      <p className="mf-sub">
        {t('logros.resumen', { hechos: conseguidos.size, total, xp: XP_POR_HITO })}
      </p>

      <div className="mf-tarjeta">
        <div className="mf-nivel-fila">
          <span>{estado.nivel.emoji} {t('niveles.' + estado.nivel.nivel)}</span>
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
              <small>{t('niveles.' + n.nivel)}</small>
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
                <b>{t('hitos.' + h.id + '.nombre')}</b>
                <small>{t('hitos.' + h.id + '.desc')}</small>
              </div>
              {hecho && <i className="tick">✓</i>}
            </div>
          );
        })}
      </div>

      <p className="mf-pie">{t('logros.pie')}</p>
    </div>
  );
}
