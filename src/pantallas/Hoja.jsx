/* ============================================================
   Hoja flotante
   Envoltorio para las ventanas emergentes. Las saca del árbol de la
   página y las cuelga del <body>.

   POR QUÉ, que no es capricho: `.mf-pagina` tiene una animación de
   entrada con `transform`, y un elemento con transform se convierte en
   el marco de referencia de sus hijos `position: fixed`. La ventana
   dejaba de colocarse respecto a la pantalla y lo hacía respecto a la
   página, así que los botones de guardar caían fuera del móvil.

   Colgándola del body es inmune a eso — y a cualquier `transform`,
   `filter` o `backdrop-filter` que se añada a un padre en el futuro.
   ============================================================ */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Hoja({ children, onCerrar }) {
  // Mientras la hoja está abierta, el fondo no se desplaza.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (e) => { if (e.key === 'Escape') onCerrar?.(); };
    window.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener('keydown', escape);
    };
  }, [onCerrar]);

  return createPortal(
    <div className="mf-hoja" onClick={onCerrar}>
      <div className="mf-hoja-caja" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
