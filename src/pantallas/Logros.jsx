/* ============================================================
   Sección "Logros"
   Los hitos que el motor ya calculaba y que no se veían en ningún
   sitio. Cada uno cuenta 100 XP, así que era información que movía el
   nivel del michi sin que el usuario pudiera verla.

   Los que faltan se enseñan también, en gris: saber qué te queda por
   conseguir motiva más que descubrirlo por sorpresa.

   Hasta el 2026-09-19 esto era su propia pantalla, con su propio botón
   en el menú de abajo. Pasó a ser una sección DENTRO de Progreso —sin
   `.mf-pagina` ni `<Titulo>` propios, que los pone quien la use—
   cuando Albert simplificó el menú: era la pestaña que menos pesaba
   frente a lo que de verdad importa (hábitos, la gráfica, Ninja), y el
   hueco lo necesitaba el icono de la historia. Ver `CURRENT.md`
   2026-09-19. */

import { HITOS, XP_POR_HITO, NIVELES } from '../engine/constantes.js';
import { useT } from '../i18n/index.jsx';

export default function Logros({ estado }) {
  const t = useT();
  const conseguidos = new Set(estado.hitosDesbloqueados ?? []);
  const total = HITOS.length;

  return (
    <div className="mf-tarjeta">
      <h3 className="mf-h3">{t('logros.titulo')}</h3>
      <p className="mf-sub">
        {t('logros.resumen', { hechos: conseguidos.size, total, xp: XP_POR_HITO })}
      </p>

      <div className="mf-logros-nivel">
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
