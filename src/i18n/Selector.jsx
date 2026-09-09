/* ============================================================
   Selector de idioma · el mundo de la cabecera
   Un desplegable pequeño, al lado de la rueda de ajustes. Se cierra al
   elegir, al tocar fuera o con Escape.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { IDIOMAS, useIdioma, useT } from './index.jsx';

export default function SelectorIdioma() {
  const { idioma, setIdioma } = useIdioma();
  const t = useT();
  const [abierto, setAbierto] = useState(false);
  const caja = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e) => { if (!caja.current?.contains(e.target)) setAbierto(false); };
    const esc = (e) => { if (e.key === 'Escape') setAbierto(false); };
    // `capture` para enterarse antes de que el clic lo pare otro manejador.
    document.addEventListener('pointerdown', fuera, true);
    window.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fuera, true);
      window.removeEventListener('keydown', esc);
    };
  }, [abierto]);

  return (
    <div className="mf-idioma" ref={caja}>
      <button className={`mf-gear ${abierto ? 'activa' : ''}`}
              aria-label={t('comun.idioma')} aria-expanded={abierto}
              onClick={() => setAbierto((a) => !a)}>
        🌐
      </button>
      {abierto && (
        <ul className="mf-idioma-lista" role="listbox" aria-label={t('comun.idioma')}>
          {IDIOMAS.map((l) => (
            <li key={l.id}>
              <button role="option" aria-selected={l.id === idioma}
                      className={l.id === idioma ? 'sel' : ''}
                      onClick={() => { setIdioma(l.id); setAbierto(false); }}>
                <span className="ban">{l.bandera}</span>
                <span className="nom">{l.nombre}</span>
                {l.id === idioma && <span className="tic">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
