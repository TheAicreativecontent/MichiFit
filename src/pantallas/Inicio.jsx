/* ============================================================
   Pantalla "Inicio"
   Solo el michi y los datos que de verdad importan hoy. El globo de
   texto y la tarjeta de nivel se fueron DENTRO del huevo, que es donde
   tienen sentido.

   Los tres botones del aparato no tocan los datos: son vida, no
   mecánica. Mimar no da experiencia a propósito — si diera, dejaría
   de ser cariño.
   ============================================================ */

import { useEffect, useState } from 'react';
import { useT } from '../i18n/index.jsx';
import Tamagotchi from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';
import { sonidos, despertarAudio } from '../mascota/sonido.js';
import { ESCENAS, porId, siguiente, escenaAutomatica } from '../mascota/escenas.js';
import { anilloDe, siguienteIndice, ESPERA_MS } from '../mascota/anillos.js';

/* ---- PRUEBAS ----------------------------------------------------------
   Panel para ver todos los dibujos del michi sin tener que apuntar datos
   reales. No sale nunca solo: se abre dando siete toques al logo de la
   cabecera (ver `tocarLogo` en App.jsx). Se queda en el código a
   propósito, es la forma de revisar los dibujos en el móvil. */
/* Ya no hay cuerpos que probar: el michi tiene una sola silueta. Lo que
   se revisa aquí son sus poses y sus humores. */
const POSES = [
  { id: null, et: 'de pie' }, { id: 'comiendo', et: 'come' },
  { id: 'entrenando', et: 'entrena' }, { id: 'durmiendo', et: 'duerme' },
  { id: 'andando', et: 'anda' }, { id: 'contento', et: 'contento' },
  { id: 'triste', et: 'triste' }, { id: 'cansado', et: 'cansado' },
  { id: 'celebrando', et: 'celebra' },
];

export default function Inicio({ estado, entradas, pacto, onCarino, onCuidar, onMedir, accion,
                                pruebas = false, onCerrarPruebas, aparato }) {
  const t = useT();
  const [gesto, setGesto] = useState(null);      // 'mimar' | 'estado' | null
  /* Escena elegida a mano con el botón azul. En `null` manda lo que has
     apuntado hoy: el aparato cuenta tu día solo hasta que lo tocas. */
  const [escenaId, setEscenaId] = useState(null);
  const [prueba, setPrueba] = useState(null);   // { cuerpo, pose } o null

  /* ---- los tres botones ------------------------------------------
     La gramática entera está explicada en `mascota/anillos.js`. Aquí
     solo vive el estado: en qué anillo estamos y sobre qué icono.

     Va ANTES de calcular la escena porque la escena depende de él: al
     pasear el cursor por el anillo de medir, la pantalla enseña ya lo
     que vas a apuntar. */
  const [modo, setModo] = useState(null);        // null | 'cuidar' | 'medir'
  const [indice, setIndice] = useState(0);
  const anillo = anilloDe(modo);
  const item = anillo?.[indice] ?? null;

  const visual = estadoVisual(estado);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};
  const pendientes = hoy?.objetivos.filter((o) => !o.cumplido && o.id !== 'descanso') ?? [];

  /* Lo que se ve ahora, de más fuerte a más débil:
       1. el panel de pruebas, si está abierto;
       2. la vista previa del anillo de medir — con el cursor sobre
          «pasos» ya sale el michi andando por la calle. Es media
          explicación sin escribir una palabra, que es justo lo que
          hacía falta: la queja era que no se entendía el gato;
       3. la escena elegida a mano;
       4. y si no, lo que hayas apuntado hoy. */
  const escena = (modo === 'medir' && item?.escena ? porId(item.escena) : null)
    ?? porId(escenaId)
    ?? escenaAutomatica(entradaHoy, accion, visual.humor);
  const dormido = escena.dormido || estado.dormido;

  const aNeutral = () => { setModo(null); setIndice(0); };

  /* Si te distraes, el anillo se cierra solo. Sin esto, dejar el menú
     abierto tapa al michi hasta que vuelvas, y quien lo abriera sin
     querer no sabría cómo salir. Ver las tres salidas en `anillos.js`. */
  useEffect(() => {
    if (!modo) return undefined;
    const id = setTimeout(aNeutral, ESPERA_MS);
    return () => clearTimeout(id);
  }, [modo, indice]);

  const aceptar = () => {
    if (!item || item.id === 'salir') { aNeutral(); return; }
    if (modo === 'cuidar') {
      /* Cuidar despierta al michi: darle agua a una pantalla apagada no
         se entiende. */
      setEscenaId((e) => (e === 'dormir' ? null : e));
      if (item.id === 'mimar') { onCarino?.(); setGesto('mimar');
        setTimeout(() => setGesto((g) => (g === 'mimar' ? null : g)), 2600); }
      if (item.id === 'agua') onCuidar?.('agua');
      if (item.id === 'limpiar') onCuidar?.('orden');
      sonidos.mimar?.();
    }
    if (modo === 'medir') onMedir?.(item.campo);
    aNeutral();
  };

  const pulsar = (id) => {
    despertarAudio();
    setGesto(null);

    /* IZQUIERDA · abre el anillo de cuidar, y desde dentro sale.
       Es la salida de emergencia: haga lo que haga la pantalla, este
       botón siempre te devuelve a un sitio conocido. */
    if (id === 'mimar') {
      sonidos.accion();
      if (modo) { aNeutral(); return; }
      setModo('cuidar'); setIndice(0);
      return;
    }

    /* CENTRO · desde neutral abre el anillo de medir; dentro de un
       anillo pasa al siguiente icono. */
    if (id === 'accion') {
      sonidos.accion();
      if (!modo) { setModo('medir'); setIndice(0); return; }
      setIndice((i) => siguienteIndice(modo, i));
      return;
    }

    /* DERECHA · acepta. Fuera de los anillos no hay nada que aceptar,
       así que se queda como el atajo de siempre para dormir al michi. */
    if (modo) { aceptar(); return; }
    setEscenaId((e) => (e === 'dormir' ? null : 'dormir'));
    sonidos.dormir(escenaId !== 'dormir');
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
          estado={visual.cuerpo}
          size={300}
          dormido={prueba ? prueba.pose === 'durmiendo' : dormido}
          /* Lo que HACE gana a cómo se siente: si está comiendo, sale
             comiendo aunque ande triste. El humor solo se ve cuando no
             está haciendo nada. */
          pose={prueba ? prueba.pose
                : dormido ? 'durmiendo'
                : (escena.pose ?? visual.humor)}
          escenario={escena.escenario}
          rotulo={t('escenas.' + escena.id)}
          mimando={gesto === 'mimar'}
          nivel={estado.nivel}
          felicidad={estado.felicidad}
          denoche={estado.felicidadDetalle?.denoche}
          cuidado={estado.cuidado}
          menu={anillo ? {
            indice,
            items: anillo.map((it) => ({ ...it, etiqueta: t(it.clave) })),
          } : null}
          mensaje={gesto === 'estado' ? resumen(estado, pendientes, t) : null}
          onBoton={pulsar}
          onPantalla={tocarPantalla}
          aparato={aparato}
        />
      </div>

      {pruebas && (
        <div className="mf-pruebas">
          <b>
            PRUEBAS
            <button className="cerrar" aria-label={t('comun.cerrar')}
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
          {t('inicio.cubierto', { n: estado.gastados.length })}
        </div>
      )}

      {estado.descansosRotos >= 2 && (
        <div className="mf-aviso suave">
          {t('inicio.descansosRotos', { n: estado.descansosRotos })}
        </div>
      )}

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('inicio.hoy')}</h3>
        {hoy?.objetivos.map((o) => {
          /* El día de descanso no tiene objetivo numérico: enseñar su
             `valor` a secas mostraba los minutos entrenados sin decir de
             qué eran. Aquí se cuenta con palabras. */
          if (o.id === 'descanso') {
            const min = o.valor ?? 0;
            return (
              <div key={o.id} className={`mf-obj sueno ${o.respetado ? 'ok' : ''}`}>
                <span>{o.respetado ? '✅' : '💪'} {t('inicio.diaDescanso')}</span>
                <b>{o.respetado ? t('inicio.descansoBien') : t('inicio.descansoRoto', { min })}</b>
              </div>
            );
          }
          return (
            <div key={o.id} className={`mf-obj ${o.cumplido ? 'ok' : ''}`}>
              <span>{o.cumplido ? '✅' : '⬜'} {t('objetivos.' + o.id)}</span>
              <b>{o.valor ?? '—'}{o.objetivo ? ` / ${o.objetivo}` : ''}</b>
            </div>
          );
        })}
        {(() => {
          const s = consejoSueno(entradaHoy.sueno?.horas ?? entradaHoy.suenoHoras, t);
          return (
            <div className={`mf-obj sueno ${s.ok ? 'ok' : ''}`}>
              <span>{s.ok ? '✅' : '⬜'} {t('inicio.sueno')}</span>
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
function consejoSueno(horas, t) {
  if (horas == null) {
    return { ok: false, corto: t('inicio.suenoSinApuntar'), largo: t('inicio.suenoSinApuntarLargo') };
  }
  const h = String(horas).replace('.', ',');
  const par = (k) => ({ corto: t(`inicio.sueno${k}`, { h, faltan: (8 - horas).toFixed(1).replace('.', ',') }),
                        largo: t(`inicio.sueno${k}Largo`, { h }) });
  if (horas < 6) return { ok: false, ...par('Poco') };
  if (horas < 7.5) return { ok: false, ...par('Casi') };
  if (horas <= 9) return { ok: true, ...par('Perfecto') };
  return { ok: false, ...par('Pasado') };
}

/* Lo que cuenta el michi al pulsar el botón azul, dentro de la pantalla. */
function resumen(estado, pendientes, t) {
  const trozos = [];
  trozos.push(estado.racha > 0
    ? t('inicio.resumenRacha', { n: estado.racha })
    : t('inicio.resumenCero'));
  if (estado.comodines > 0) {
    trozos.push(t('inicio.resumenEscudos', { n: estado.comodines }));
  }
  if (estado.descansosRotos >= 2) trozos.push(t('inicio.resumenDescansar'));
  else if (!pendientes.length) trozos.push(t('inicio.resumenTodoHecho'));
  else trozos.push(t('inicio.resumenFalta', {
    que: pendientes.map((p) => t('objetivos.' + p.id).toLowerCase()).join(t('inicio.y')) }));
  return trozos.join(', ') + ' 🐾';
}
