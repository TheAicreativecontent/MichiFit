/* ============================================================
   La regla de la comida, dicha con numeros
   «Cumples el dia si te quedas entre X e Y kcal.» Antes el sentido del
   objetivo (no pasarte / llegar / quedarte cerca) vivia solo en el
   motor, y era lo mejor escondido de la app (SIMPLICIDAD.md, punto 5).
   Sale de `rangoComida`, que sale de la misma regla que evalua el dia.
   ============================================================ */

import { useT } from '../i18n/index.jsx';
import { rangoComida } from '../engine/pacto.js';

const CLAVE = { menos: 'dia.rangoMenos', mas: 'dia.rangoMas', banda: 'dia.rangoBanda' };

export default function ReglaComida({ pacto }) {
  const t = useT();
  const r = rangoComida(pacto);
  if (!r) return null;
  return <p className="mf-nota mf-regla">{t(CLAVE[r.sentido] ?? CLAVE.menos, { min: r.min, max: r.max })}</p>;
}
