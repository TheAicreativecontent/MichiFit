/* ============================================================
   Botón de ayuda
   Un "?" junto al título de cada pantalla. Al tocarlo se despliega la
   explicación debajo; no es un modal ni te saca de donde estabas.

   La regla al escribir estos textos: contar qué hace la pantalla y por
   qué las cosas son como son, no repetir lo que ya se lee en ella. Si
   la explicación es obvia, sobra el botón.
   ============================================================ */

import { useState } from 'react';
import { useT } from '../i18n/index.jsx';

export default function Ayuda({ children }) {
  const t = useT();
  const [abierta, setAbierta] = useState(false);
  return (
    <>
      <button className={`mf-ayuda-btn ${abierta ? 'activa' : ''}`}
              aria-expanded={abierta} aria-label={t('comun.queEsPantalla')}
              onClick={() => setAbierta((a) => !a)}>
        ?
      </button>
      {abierta && <div className="mf-ayuda">{children}</div>}
    </>
  );
}

/* Título de pantalla con su ayuda al lado. Existe para no repetir el
   mismo flex en las seis pantallas. */
export function Titulo({ children, ayuda }) {
  return (
    <div className="mf-titulo">
      <h2 className="mf-h2">{children}</h2>
      {ayuda && <Ayuda>{ayuda}</Ayuda>}
    </div>
  );
}
