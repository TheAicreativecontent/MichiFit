/* ============================================================
   Pantalla "Inicio"
   Solo el michi y los datos que de verdad importan hoy. El globo de
   texto y la tarjeta de nivel se fueron DENTRO del huevo, que es donde
   tienen sentido.

   Los tres botones del aparato no tocan los datos: son vida, no
   mecánica. Mimar no da experiencia a propósito — si diera, dejaría
   de ser cariño.
   ============================================================ */

import { useState } from 'react';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';
import { sonidos, despertarAudio } from '../mascota/sonido.js';
import { ESCENAS, porId, siguiente, escenaAutomatica } from '../mascota/escenas.js';

/* ---- PRUEBAS ----------------------------------------------------------
   Panel para ver todos los dibujos del michi sin tener que apuntar datos
   reales. No sale nunca solo: se abre dando siete toques al logo de la
   cabecera (ver `tocarLogo` en App.jsx). Se queda en el código a
   propósito, es la forma de revisar los dibujos en el móvil. */
const CUERPOS = ['esqueletico', 'gordo', 'kawaii', 'fit', 'hipertrofiado'];
const POSES = [
  { id: null, et: 'de pie' }, { id: 'comiendo', et: 'come' },
  { id: 'entrenando', et: 'entrena' }, { id: 'dormido', et: 'duerme' },
];

export default function Inicio({ estado, entradas, pacto, onCarino, accion,
                                pruebas = false, onCerrarPruebas }) {
  const [gesto, setGesto] = useState(null);      // 'mimar' | 'estado' | null
  /* Escena elegida a mano con el botón azul. En `null` manda lo que has
     apuntado hoy: el aparato cuenta tu día solo hasta que lo tocas. */
  const [escenaId, setEscenaId] = useState(null);
  const [prueba, setPrueba] = useState(null);   // { cuerpo, pose } o null

  const visual = estadoVisual(estado, entradas, pacto);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};
  const pendientes = hoy?.objetivos.filter((o) => !o.cumplido && o.id !== 'descanso') ?? [];

  /* Lo que se ve ahora: manda la prueba, luego la escena elegida a mano,
     y si no hay ninguna, lo que hayas apuntado hoy. */
  const escena = porId(escenaId) ?? escenaAutomatica(entradaHoy, accion);
  const dormido = escena.dormido || estado.dormido;

  const pulsar = (id) => {
    despertarAudio();
    if (id === 'dormir') {
      /* El rojo es el atajo: duerme al michi, o lo devuelve a lo que
         tocaba. La escena `dormir` también sale en el ciclo del azul. */
      setEscenaId((e) => (e === 'dormir' ? null : 'dormir'));
      sonidos.dormir(escenaId !== 'dormir');
      setGesto(null);
      return;
    }
    if (id === 'accion') {
      setEscenaId((e) => siguiente(e));
      sonidos.accion();
      setGesto(null);
      return;
    }
    /* Un mimo despierta al michi: lanzar corazones contra una pantalla
       apagada no se entiende. */
    setEscenaId((e) => (e === 'dormir' ? null : e));
    setGesto(id);
    sonidos[id]?.();
    if (id === 'mimar') onCarino?.();
    // el gesto se deshace solo: es un momento, no un modo
    setTimeout(() => setGesto((g) => (g === id ? null : g)), 2600);
  };

  /* Tocar el cristal: el michi cuenta cómo va. Antes era el botón del
     medio, que ahora sirve para cambiar de escena. */
  const tocarPantalla = () => {
    despertarAudio();
    if (dormido) return;            // dormido no habla
    sonidos.estado();
    setGesto('estado');
    setTimeout(() => setGesto((g) => (g === 'estado' ? null : g)), 5000);
  };

  return (
    <div className="mf-pagina">
      <div className="mf-escena">
        <Tamagotchi
          estado={prueba?.cuerpo ?? visual.cuerpo}
          size={300}
          dormido={prueba ? prueba.pose === 'dormido' : dormido}
          pose={prueba ? prueba.pose : dormido ? 'dormido' : escena.pose}
          escenario={escena.escenario}
          rotulo={escena.rotulo}
          mimando={gesto === 'mimar'}
          nivel={estado.nivel}
          felicidad={estado.felicidad}
          denoche={estado.felicidadDetalle?.denoche}
          mensaje={gesto === 'estado' ? resumen(estado, pendientes) : null}
          onBoton={pulsar}
          onPantalla={tocarPantalla}
        />
      </div>

      {pruebas && (
        <div className="mf-pruebas">
          <b>
            PRUEBAS
            <button className="cerrar" aria-label="Cerrar pruebas"
                    onClick={() => { setPrueba(null); setEscenaId(null); onCerrarPruebas?.(); }}>
              ✕
            </button>
          </b>
          <div className="fila">
            {CUERPOS.map((c) => (
              <button key={c} className={prueba?.cuerpo === c ? 'on' : ''}
                      onClick={() => setPrueba((p) => ({ cuerpo: c, pose: p?.pose ?? null }))}>
                {c.slice(0, 4)}
              </button>
            ))}
          </div>
          <div className="fila">
            {POSES.map((p) => (
              <button key={p.et}
                      className={prueba && prueba.pose === p.id ? 'on' : ''}
                      onClick={() => setPrueba((v) => ({ cuerpo: v?.cuerpo ?? 'kawaii', pose: p.id }))}>
                {p.et}
              </button>
            ))}
            <button onClick={() => setPrueba(null)}>salir</button>
          </div>
          <div className="fila">
            {ESCENAS.map((e) => (
              <button key={e.id} className={escenaId === e.id ? 'on' : ''}
                      onClick={() => setEscenaId(e.id)}>
                {e.id}
              </button>
            ))}
          </div>
        </div>
      )}

      <Marcador estado={estado} entradaHoy={entradaHoy} pacto={pacto} />

      {estado.gastados.length > 0 && (
        <div className="mf-aviso suave">
          🛡️ El michi te cubrió {estado.gastados.length === 1 ? 'un día' : `${estado.gastados.length} días`}.
          Tu racha sigue viva.
        </div>
      )}

      {estado.descansosRotos >= 2 && (
        <div className="mf-aviso suave">
          😌 Has entrenado {estado.descansosRotos} días de descanso esta semana.
          El descanso es parte del pacto, no un hueco que rellenar.
        </div>
      )}

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Hoy</h3>
        {hoy?.objetivos.map((o) => {
          /* El día de descanso no tiene objetivo numérico: enseñar su
             `valor` a secas mostraba los minutos entrenados sin decir de
             qué eran. Aquí se cuenta con palabras. */
          if (o.id === 'descanso') {
            const min = o.valor ?? 0;
            return (
              <div key={o.id} className={`mf-obj sueno ${o.respetado ? 'ok' : ''}`}>
                <span>{o.respetado ? '✅' : '💪'} Día de descanso</span>
                <b>{o.respetado ? 'sin entrenar, bien' : `entrenaste ${min} min`}</b>
              </div>
            );
          }
          return (
            <div key={o.id} className={`mf-obj ${o.cumplido ? 'ok' : ''}`}>
              <span>{o.cumplido ? '✅' : '⬜'} {o.etiqueta}</span>
              <b>{o.valor ?? '—'}{o.objetivo ? ` / ${o.objetivo}` : ''}</b>
            </div>
          );
        })}
        {(() => {
          const s = consejoSueno(entradaHoy.sueno?.horas ?? entradaHoy.suenoHoras);
          return (
            <div className={`mf-obj sueno ${s.ok ? 'ok' : ''}`}>
              <span>{s.ok ? '✅' : '⬜'} Sueño</span>
              <b title={s.largo}>{s.corto}</b>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* Consejo de sueño en UNA línea. El texto largo va en el `title` para
   quien pase el ratón; en el móvil manda el corto, que nunca parte. */
function consejoSueno(horas) {
  if (horas == null) {
    return { ok: false, corto: 'sin apuntar · ideal 8 h',
             largo: 'Aún no has apuntado cuánto dormiste. Lo ideal son 8 horas.' };
  }
  const h = String(horas).replace('.', ',');
  if (horas < 6) {
    return { ok: false, corto: `${h} h · poco, apunta a 8`,
             largo: `Has dormido ${h} horas. Es poco: deberías dormir unas 8.` };
  }
  if (horas < 7.5) {
    return { ok: false, corto: `${h} h · casi, faltan ${(8 - horas).toFixed(1).replace('.', ',')}`,
             largo: `Has dormido ${h} horas. Vas cerca: lo ideal son 8.` };
  }
  if (horas <= 9) {
    return { ok: true, corto: `${h} h · perfecto`,
             largo: `Has dormido ${h} horas. Justo lo que necesitas.` };
  }
  return { ok: false, corto: `${h} h · te has pasado de 8`,
           largo: `Has dormido ${h} horas. Dormir de más también cansa: lo ideal son 8.` };
}

/* Lo que cuenta el michi al pulsar el botón azul, dentro de la pantalla. */
function resumen(estado, pendientes) {
  const trozos = [];
  trozos.push(estado.racha > 0
    ? `Llevamos ${estado.racha} ${estado.racha === 1 ? 'día' : 'días'} de racha`
    : 'Hoy empezamos de cero');
  if (estado.comodines > 0) {
    trozos.push(`tengo ${estado.comodines} ${estado.comodines === 1 ? 'escudo' : 'escudos'}`);
  }
  if (estado.descansosRotos >= 2) trozos.push('y me vendría bien descansar');
  else if (!pendientes.length) trozos.push('y hoy ya está todo hecho');
  else trozos.push(`y hoy falta ${pendientes.map((p) => p.etiqueta.toLowerCase()).join(' y ')}`);
  return trozos.join(', ') + ' 🐾';
}
