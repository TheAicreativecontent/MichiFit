/* ============================================================
   Editor de un día
   Entrada numérica, no por incrementos: escribes el número y ya.
   Lo usan el "+" de la barra y el calendario de Progreso.
   ============================================================ */

import { useState } from 'react';
import T from '../i18n/Texto.jsx';
import { claveDia, dentroDeVentana } from '../engine/pacto.js';
import { ListaEjercicios, ejerciciosDe } from './Ejercicios.jsx';
import Hoja from './Hoja.jsx';
import { useT } from '../i18n/index.jsx';

/* ---------------- editor de un día ----------------
   `solo` limita la hoja a UN dato: es lo que abre el anillo
   del aparato, donde ya has elegido qué vas a apuntar y enseñarte los
   otros cuatro campos sería deshacer esa elección. Sin `solo` sale la
   hoja entera, que es lo que abre el "+" de la barra de abajo.

   No son dos editores: es el mismo con menos campos a la vista. Lo que
   no se ve, no se toca — se guarda `undefined` y el valor que hubiera
   se queda como estaba. */
export default function EditorDia({ fecha, entrada, pacto, onGuardar, onCerrar, solo = null }) {
  const t = useT();
  const ver = (campo) => !solo || solo === campo;
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
        <h3 className="mf-h3">{solo ? t('anillo.' + solo) : fecha}</h3>
        {!abierto && (
          <div className="mf-aviso suave">
            {t('dia.cerrado')}
          </div>
        )}
        {ver('peso') && <Campo et={t('dia.peso')} u={t('comun.kg')} paso="0.1" v={v.peso} on={(x) => setV({ ...v, peso: x })} />}
        {ver('pasos') && <Campo et={t('dia.pasos')} paso="100" v={v.pasos} on={(x) => setV({ ...v, pasos: x })} />}
        {ver('entreno') && <Campo et={t('dia.entreno')} u={t('comun.min')} paso="5" v={v.entrenoMin} on={(x) => setV({ ...v, entrenoMin: x })} />}
        {ver('comida') && <Campo et={t('dia.comida')} u={t('comun.kcal')} paso="50" v={v.comidaKcal} on={(x) => setV({ ...v, comidaKcal: x })} />}
        {ver('sueno') && <Campo et={t('dia.sueno')} u={t('comun.horas')} paso="0.5" v={v.suenoHoras} on={(x) => setV({ ...v, suenoHoras: x })} />}

        {/* Las macros van con la comida, y los ejercicios con el
            entreno: es donde tienen sentido cuando la hoja viene
            filtrada desde el aparato. */}
        <div className="mf-ejs" hidden={!ver('comida')}>
          <div className="mf-ejs-cab">
            <button className="mf-ejs-titulo" type="button"
                    onClick={() => setVerMacros((m) => !m)}>
              {verMacros ? '▾' : '▸'} {t('dia.macros')} <small>{t('comun.opcional')}</small>
            </button>
            {hayMacros && <small>{Math.round(kcalMacros)} kcal</small>}
          </div>
          {verMacros && (
            <>
              <Campo et={t('dia.proteina')} u="g" paso="5" v={v.prot} on={(x) => setV({ ...v, prot: x })} />
              <Campo et={t('dia.carbos')} u="g" paso="5" v={v.carb} on={(x) => setV({ ...v, carb: x })} />
              <Campo et={t('dia.grasa')} u="g" paso="1" v={v.grasa} on={(x) => setV({ ...v, grasa: x })} />
              <T k="dia.macrosNota" className="mf-nota" />
            </>
          )}
        </div>

        {ver('entreno') && (
          <ListaEjercicios ejercicios={ejercicios} hechos={hechos} onCambiar={setHechos} />
        )}

        <div className="mf-hoja-pie">
          <button className="mf-boton" onClick={onCerrar}>{t('comun.cancelar')}</button>
          <button className="mf-boton principal" onClick={() => onGuardar({
            peso: num(v.peso), pasos: num(v.pasos), entrenoMin: num(v.entrenoMin),
            comidaKcal: num(v.comidaKcal),
            sueno: v.suenoHoras === '' ? undefined : { horas: Number(v.suenoHoras) },
            macros: hayMacros
              ? { prot: num(v.prot), carb: num(v.carb), grasa: num(v.grasa) }
              : undefined,
            hechos: ejercicios.length ? hechos : undefined,
          })}>{t('comun.guardar')}</button>
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
