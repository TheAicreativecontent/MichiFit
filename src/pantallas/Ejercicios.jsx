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

/* Id corto y estable. No hace falta que sea único en el mundo, solo
   dentro de un día: se usa para saber qué has marcado. */
const nuevoId = () => Math.random().toString(36).slice(2, 8);

export function ejerciciosDe(pacto, clave) {
  return pacto?.dias?.[clave]?.ejercicios ?? [];
}

/* ---------- plantilla, dentro de "Mi pacto" ---------- */
export function EditorEjercicios({ valor = [], onCambiar }) {
  const cambiar = (id, campos) =>
    onCambiar(valor.map((e) => (e.id === id ? { ...e, ...campos } : e)));

  return (
    <div className="mf-ejs">
      <div className="mf-ejs-cab">
        <span>Ejercicios</span>
        <button className="mf-ejs-mas" type="button"
                onClick={() => onCambiar([...valor, { id: nuevoId(), nombre: '', reps: '', peso: '' }])}>
          + añadir
        </button>
      </div>

      {valor.length === 0 && (
        <p className="mf-nota">
          Sin ejercicios apuntados. Añade los que sueles hacer y los tendrás
          a mano el día del entreno.
        </p>
      )}

      {valor.map((e) => (
        <div className="mf-ej" key={e.id}>
          <input className="nombre" type="text" value={e.nombre} placeholder="Press banca"
                 onChange={(ev) => cambiar(e.id, { nombre: ev.target.value })} />
          <input className="num" type="number" inputMode="numeric" value={e.reps} placeholder="reps"
                 onChange={(ev) => cambiar(e.id, { reps: ev.target.value })} />
          <input className="num" type="number" inputMode="decimal" step="0.5" value={e.peso} placeholder="kg"
                 onChange={(ev) => cambiar(e.id, { peso: ev.target.value })} />
          <button className="quitar" type="button" aria-label={`Quitar ${e.nombre || 'ejercicio'}`}
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
  const [abierto, setAbierto] = useState(true);
  if (!ejercicios.length) return null;

  const alternar = (id) =>
    onCambiar(hechos.includes(id) ? hechos.filter((h) => h !== id) : [...hechos, id]);

  const listos = ejercicios.filter((e) => hechos.includes(e.id)).length;

  return (
    <div className="mf-ejs">
      <div className="mf-ejs-cab">
        <button className="mf-ejs-titulo" type="button" onClick={() => setAbierto((a) => !a)}>
          {abierto ? '▾' : '▸'} Ejercicios de hoy
        </button>
        <small>{listos} de {ejercicios.length}</small>
      </div>

      {abierto && ejercicios.map((e) => {
        const hecho = hechos.includes(e.id);
        return (
          /* El módulo entero es el botón: en el gimnasio se acierta mucho
             mejor a una tarjeta que a una casilla de 16 px. */
          <button key={e.id} type="button" className={`mf-ej-check ${hecho ? 'hecho' : ''}`}
                  aria-pressed={hecho} onClick={() => alternar(e.id)}>
            <i className="marca" aria-hidden="true">{hecho ? '✓' : ''}</i>
            <span className="nombre">{e.nombre || 'Ejercicio'}</span>
            <small className="detalle">
              {[e.reps && `${e.reps} reps`, e.peso && `${e.peso} kg`].filter(Boolean).join(' · ')}
            </small>
          </button>
        );
      })}
    </div>
  );
}
