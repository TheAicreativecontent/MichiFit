/* ============================================================
   Ejercicios de un día de entreno
   Dos vistas de la misma lista:

     <EditorEjercicios>  en "Mi pacto": qué ejercicios toca ese día de
                         la semana. Es la PLANTILLA, y vive en el pacto.
     <ListaEjercicios>   en el editor del día: los marcas según los vas
                         haciendo. Lo marcado vive en la ENTRADA del día,
                         no en el pacto, porque es lo que pasó ese día.

   A propósito no hay vídeos ni fotos: nombre, repeticiones y peso.
   Enlazar YouTube o subir imágenes es otra app, y esto tiene que poder
   rellenarse en el gimnasio con una mano.

   Los ejercicios NO cuentan para el cumplimiento del pacto: eso lo
   siguen decidiendo los minutos de entreno. Son una chuleta.
   ============================================================ */

import { useState } from 'react';
import { useT } from '../i18n/index.jsx';

/* Id corto y estable. No hace falta que sea único en el mundo, solo
   dentro de un día: se usa para saber qué has marcado. */
const nuevoId = () => Math.random().toString(36).slice(2, 8);

export function ejerciciosDe(pacto, clave) {
  return pacto?.dias?.[clave]?.ejercicios ?? [];
}

/* ---------- plantilla, dentro de "Mi pacto" ---------- */
export function EditorEjercicios({ valor = [], onCambiar }) {
  const t = useT();
  const cambiar = (id, campos) =>
    onCambiar(valor.map((e) => (e.id === id ? { ...e, ...campos } : e)));

  return (
    <div className="mf-ejs">
      <div className="mf-ejs-cab">
        <span>{t('ejercicios.titulo')}</span>
        <button className="mf-ejs-mas" type="button"
                onClick={() => onCambiar([...valor, { id: nuevoId(), nombre: '', reps: '', peso: '' }])}>
          {t('ejercicios.anadir')}
        </button>
      </div>

      {valor.length === 0 && (
        <p className="mf-nota">
          {t('ejercicios.vacio')}
        </p>
      )}

      {valor.map((e) => (
        <div className="mf-ej" key={e.id}>
          <input className="nombre" type="text" value={e.nombre} placeholder={t('ejercicios.ejemploNombre')}
                 onChange={(ev) => cambiar(e.id, { nombre: ev.target.value })} />
          <input className="num" type="number" inputMode="numeric" value={e.reps} placeholder={t('ejercicios.reps')}
                 onChange={(ev) => cambiar(e.id, { reps: ev.target.value })} />
          <input className="num" type="number" inputMode="decimal" step="0.5" value={e.peso} placeholder="kg"
                 onChange={(ev) => cambiar(e.id, { peso: ev.target.value })} />
          <button className="quitar" type="button" aria-label={t('ejercicios.quitar', { que: e.nombre || t('ejercicios.uno') })}
                  onClick={() => onCambiar(valor.filter((x) => x.id !== e.id))}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- lista del día, para ir marcando ---------- */
export function ListaEjercicios({ ejercicios = [], hechos = [], onCambiar }) {
  const t = useT();
  const [abierto, setAbierto] = useState(true);
  if (!ejercicios.length) return null;

  const alternar = (id) =>
    onCambiar(hechos.includes(id) ? hechos.filter((h) => h !== id) : [...hechos, id]);

  const listos = ejercicios.filter((e) => hechos.includes(e.id)).length;

  return (
    <div className="mf-ejs">
      <div className="mf-ejs-cab">
        <button className="mf-ejs-titulo" type="button" onClick={() => setAbierto((a) => !a)}>
          {abierto ? '▾' : '▸'} {t('ejercicios.deHoy')}
        </button>
        <small>{t('ejercicios.contador', { hechos: listos, total: ejercicios.length })}</small>
      </div>

      {abierto && ejercicios.map((e) => {
        const hecho = hechos.includes(e.id);
        return (
          /* El módulo entero es el botón: en el gimnasio se acierta mucho
             mejor a una tarjeta que a una casilla de 16 px. */
          <button key={e.id} type="button" className={`mf-ej-check ${hecho ? 'hecho' : ''}`}
                  aria-pressed={hecho} onClick={() => alternar(e.id)}>
            <i className="marca" aria-hidden="true">{hecho ? '✓' : ''}</i>
            <span className="nombre">{e.nombre || t('ejercicios.sinNombre')}</span>
            <small className="detalle">
              {[e.reps && t('ejercicios.nReps', { n: e.reps }), e.peso && t('ejercicios.nKg', { n: e.peso })].filter(Boolean).join(' · ')}
            </small>
          </button>
        );
      })}
    </div>
  );
}
