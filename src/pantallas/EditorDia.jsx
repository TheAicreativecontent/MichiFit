/* ============================================================
   Editor de un día
   Entrada numérica, no por incrementos: escribes el número y ya.
   Lo usan el "+" de la barra y el calendario de Progreso.
   ============================================================ */

import { useState } from 'react';
import { claveDia, dentroDeVentana } from '../engine/pacto.js';
import { ListaEjercicios, ejerciciosDe } from './Ejercicios.jsx';
import Hoja from './Hoja.jsx';

/* ---------------- editor de un día ---------------- */
export default function EditorDia({ fecha, entrada, pacto, onGuardar, onCerrar }) {
  const [v, setV] = useState({
    peso: entrada.peso ?? '',
    pasos: entrada.pasos ?? '',
    entrenoMin: entrada.entrenoMin ?? '',
    comidaKcal: entrada.comidaKcal ?? '',
    suenoHoras: entrada.sueno?.horas ?? entrada.suenoHoras ?? '',
    prot: entrada.macros?.prot ?? '',
    carb: entrada.macros?.carb ?? '',
    grasa: entrada.macros?.grasa ?? '',
  });
  const [hechos, setHechos] = useState(entrada.hechos ?? []);
  /* Las macros van plegadas: la mayoría de días no se apuntan, y tenerlas
     siempre desplegadas alarga la hoja para nada. */
  const [verMacros, setVerMacros] = useState(
    entrada.macros != null && Object.values(entrada.macros).some((x) => x != null));
  const abierto = dentroDeVentana(fecha);
  const num = (x) => (x === '' ? null : Number(x));

  const ejercicios = ejerciciosDe(pacto, claveDia(fecha));

  /* Las macros no cuentan para nada: se enseñan sus kcal solo para que
     veas si cuadran con lo que has apuntado arriba. 4/4/9 de toda la
     vida. */
  const kcalMacros = num(v.prot) * 4 + num(v.carb) * 4 + num(v.grasa) * 9;
  const hayMacros = [v.prot, v.carb, v.grasa].some((x) => x !== '');

  return (
    <Hoja onCerrar={onCerrar}>
      <>
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

        <div className="mf-ejs">
          <div className="mf-ejs-cab">
            <button className="mf-ejs-titulo" type="button"
                    onClick={() => setVerMacros((m) => !m)}>
              {verMacros ? '▾' : '▸'} Macros <small>opcional</small>
            </button>
            {hayMacros && <small>{Math.round(kcalMacros)} kcal</small>}
          </div>
          {verMacros && (
            <>
              <Campo et="Proteína" u="g" paso="5" v={v.prot} on={(x) => setV({ ...v, prot: x })} />
              <Campo et="Carbos" u="g" paso="5" v={v.carb} on={(x) => setV({ ...v, carb: x })} />
              <Campo et="Grasa" u="g" paso="1" v={v.grasa} on={(x) => setV({ ...v, grasa: x })} />
              <p className="mf-nota">
                Orientativas: <b>no cuentan</b> para el pacto. Sirven para ver
                de dónde salen las calorías.
              </p>
            </>
          )}
        </div>

        <ListaEjercicios ejercicios={ejercicios} hechos={hechos} onCambiar={setHechos} />

        <div className="mf-hoja-pie">
          <button className="mf-boton" onClick={onCerrar}>Cancelar</button>
          <button className="mf-boton principal" onClick={() => onGuardar({
            peso: num(v.peso), pasos: num(v.pasos), entrenoMin: num(v.entrenoMin),
            comidaKcal: num(v.comidaKcal),
            sueno: v.suenoHoras === '' ? undefined : { horas: Number(v.suenoHoras) },
            macros: hayMacros
              ? { prot: num(v.prot), carb: num(v.carb), grasa: num(v.grasa) }
              : undefined,
            hechos: ejercicios.length ? hechos : undefined,
          })}>Guardar</button>
        </div>
      </>
    </Hoja>
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
