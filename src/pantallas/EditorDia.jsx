/* ============================================================
   Editor de un día
   Entrada numérica, no por incrementos: escribes el número y ya.
   Lo usan el "+" de la barra y el calendario de Progreso.
   ============================================================ */

import { useState } from 'react';
import { dentroDeVentana } from '../engine/pacto.js';

/* ---------------- editor de un día ---------------- */
export default function EditorDia({ fecha, entrada, onGuardar, onCerrar }) {
  const [v, setV] = useState({
    peso: entrada.peso ?? '',
    pasos: entrada.pasos ?? '',
    entrenoMin: entrada.entrenoMin ?? '',
    comidaKcal: entrada.comidaKcal ?? '',
    suenoHoras: entrada.sueno?.horas ?? entrada.suenoHoras ?? '',
  });
  const abierto = dentroDeVentana(fecha);
  const num = (x) => (x === '' ? null : Number(x));

  return (
    <div className="mf-hoja" onClick={onCerrar}>
      <div className="mf-hoja-caja" onClick={(e) => e.stopPropagation()}>
        <h3 className="mf-h3">{fecha}</h3>
        {!abierto && (
          <div className="mf-aviso suave">
            Este día ya está cerrado para el pacto (pasaron más de 3 días),
            pero el peso sí se puede corregir.
          </div>
        )}
        <Campo et="Peso" u="kg" paso="0.1" v={v.peso} on={(x) => setV({ ...v, peso: x })} />
        <Campo et="Pasos" paso="100" v={v.pasos} on={(x) => setV({ ...v, pasos: x })} />
        <Campo et="Entreno" u="min" paso="5" v={v.entrenoMin} on={(x) => setV({ ...v, entrenoMin: x })} />
        <Campo et="Comida" u="kcal" paso="50" v={v.comidaKcal} on={(x) => setV({ ...v, comidaKcal: x })} />
        <Campo et="Sueño" u="horas" paso="0.5" v={v.suenoHoras} on={(x) => setV({ ...v, suenoHoras: x })} />
        <div className="mf-hoja-pie">
          <button className="mf-boton" onClick={onCerrar}>Cancelar</button>
          <button className="mf-boton principal" onClick={() => onGuardar({
            peso: num(v.peso), pasos: num(v.pasos), entrenoMin: num(v.entrenoMin),
            comidaKcal: num(v.comidaKcal),
            sueno: v.suenoHoras === '' ? undefined : { horas: Number(v.suenoHoras) },
          })}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function Campo({ et, u, v, on, paso = '1' }) {
  return (
    <label className="mf-campo">
      <span>{et}{u && <small> {u}</small>}</span>
      <input type="number" step={paso} value={v} onChange={(e) => on(e.target.value)} />
    </label>
  );
}
