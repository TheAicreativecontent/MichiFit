/* ============================================================
   Pantalla "Inicio"
   Solo el michi y los datos que de verdad importan hoy. El globo de
   texto y la tarjeta de nivel se fueron DENTRO del huevo, que es donde
   tienen sentido.

   Los tres botones del aparato SÍ tocan los datos desde el 2026-09-11:
   son la interfaz principal, con dos anillos. La gramática entera está
   en `mascota/anillos.js`.

   Lo que sigue sin dar experiencia es mimar, a propósito: si diera,
   dejaría de ser cariño. Y el agua y el orden no tocan ningún número de
   la mecánica — ver la cabecera de `engine/cuidados.js`.
   ============================================================ */

import { useEffect, useState } from 'react';
import { useT } from '../i18n/index.jsx';
import Tamagotchi, { COLORES_MICHI } from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';
import { sonidos, despertarAudio } from '../mascota/sonido.js';
import { ESCENAS, porId, escenaAutomatica } from '../mascota/escenas.js';
import { anilloDe, siguienteIndice, ESPERA_MS } from '../mascota/anillos.js';

/* ---- PRUEBAS ----------------------------------------------------------
   Panel para ver todos los dibujos del michi sin tener que apuntar datos
   reales. No sale nunca solo: se abre dando siete toques al logo de la
   cabecera (ver `tocarLogo` en App.jsx). Se queda en el código a
   propósito, es la forma de revisar los dibujos en el móvil. */
/* Ya no hay cuerpos que probar: el michi tiene una sola silueta desde el
   2026-09-09. Lo que se revisa aquí son sus POSES y sus tres COLORES.

   Hasta el 2026-09-12 quedaba una fila de botones pintada a partir de
   una constante `CUERPOS` que ya no existía en ninguna parte: ni
   definida ni importada. O sea que abrir el panel lanzaba un
   `ReferenceError` y tumbaba la pantalla entera — se quedaba en blanco.
   Lo encontró Alberto dando los siete toques en el móvil.

   Que el lint no lo viera es normal: `oxlint` sin comprobación de tipos
   no persigue variables libres. Que no lo viera nadie más es porque
   esto no sale nunca solo. */
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
  /* Escena elegida a mano. Ya solo la mueve `dormir`, que desde el
     2026-09-12 es un icono del anillo y no un botón: el ciclo por las
     cinco escenas se fue cuando los botones pasaron a ser la interfaz.
     En `null` manda lo que has apuntado hoy, que es lo normal. */
  const [escenaId, setEscenaId] = useState(null);
  const [prueba, setPrueba] = useState(null);   // { pose, color } o null

  /* ---- los tres botones ------------------------------------------
     La gramática entera está explicada en `mascota/anillos.js`. Aquí
     solo vive el estado: si el anillo está abierto y sobre qué icono.

     Va ANTES de calcular la escena porque la escena depende de él: al
     pasear el cursor por el anillo, la pantalla enseña ya lo
     que vas a apuntar. */
  const [abierto, setAbierto] = useState(false);   // ¿hay anillo abierto?
  const [indice, setIndice] = useState(0);
  const anillo = anilloDe(abierto);
  const item = anillo?.[indice] ?? null;

  const visual = estadoVisual(estado);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};
  const pendientes = hoy?.objetivos.filter((o) => !o.cumplido && o.id !== 'descanso') ?? [];

  /* Lo que se ve ahora, de más fuerte a más débil:
       1. el panel de pruebas, si está abierto;
       2. la vista previa del anillo — con el cursor sobre
          «pasos» ya sale el michi andando por la calle. Es media
          explicación sin escribir una palabra, que es justo lo que
          hacía falta: la queja era que no se entendía el gato;
       3. la escena elegida a mano;
       4. y si no, lo que hayas apuntado hoy. */
  const escena = (item?.escena ? porId(item.escena) : null)
    ?? porId(escenaId)
    ?? escenaAutomatica(entradaHoy, accion, visual.humor);
  const dormido = escena.dormido || estado.dormido;

  /* Dormido DE VERDAD, que no es lo mismo que `dormido` de arriba.

     `dormido` incluye la VISTA PREVIA: con el cursor sobre «sueño» el
     anillo enseña ya la escena de dormir, y eso apaga la pantalla
     aunque el michi esté despierto. Si los botones miraran ese, al
     llegar a «sueño» dejarían de pasar al icono siguiente y se pondrían
     a «despertarlo» — o sea que no se podría dar la vuelta al anillo.
     Pasó, y solo se vio probándolo. */
  const dormidoDeVerdad = estado.dormido || escenaId === 'dormir';

  const aNeutral = () => { setAbierto(false); setIndice(0); };

  /* Si te distraes, el anillo se cierra solo. Sin esto, dejar el menú
     abierto tapa al michi hasta que vuelvas, y quien lo abriera sin
     querer no sabría cómo salir. Ver las tres salidas en `anillos.js`. */
  useEffect(() => {
    if (!abierto) return undefined;
    const id = setTimeout(aNeutral, ESPERA_MS);
    return () => clearTimeout(id);
  }, [abierto, indice]);

  const aceptar = () => {
    if (!item) { aNeutral(); return; }

    if (item.cuidado) {
      /* Cuidar despierta al michi: darle agua a una pantalla apagada no
         se entiende. `dormir` es la excepción evidente — ése la apaga. */
      if (item.id !== 'dormir') setEscenaId((e) => (e === 'dormir' ? null : e));

      if (item.id === 'mimar') { onCarino?.(); setGesto('mimar');
        setTimeout(() => setGesto((g) => (g === 'mimar' ? null : g)), 2600); }
      if (item.id === 'agua') onCuidar?.('agua');
      if (item.id === 'limpiar') onCuidar?.('orden');
      if (item.id === 'dormir') {
        /* Alterna: el mismo icono lo duerme y lo despierta. Era el botón
           derecho hasta el 2026-09-12. */
        const durmiendo = escenaId === 'dormir';
        setEscenaId(durmiendo ? null : 'dormir');
        sonidos.dormir(!durmiendo);
        aNeutral();
        return;
      }
      sonidos.mimar?.();
    } else {
      onMedir?.(item.campo);
    }
    aNeutral();
  };

  const pulsar = (id) => {
    despertarAudio();
    setGesto(null);

    /* Dormido, el primer toque DESPIERTA y nada más. Antes los botones
       seguían funcionando con la pantalla apagada, así que el anillo se
       abría y se pintaba encima del cristal oscuro: quedaba raro y lo
       dijeron desde fuera. Y es lo que hace un tamagotchi de verdad —
       no se le da de comer a oscuras. */
    if (dormidoDeVerdad) {
      setEscenaId((e) => (e === 'dormir' ? null : e));
      aNeutral();
      sonidos.dormir(false);
      return;
    }

    /* IZQUIERDA · abre el anillo, y dentro pasa al siguiente icono
       dando la vuelta. Es la única puerta de entrada, así que también es
       el botón que siempre hace algo. */
    if (id === 'mimar') {
      sonidos.accion();
      if (!abierto) { setAbierto(true); setIndice(0); return; }
      setIndice(siguienteIndice);
      return;
    }

    /* CENTRO · acepta. En reposo no hay nada que aceptar y NO HACE NADA:
       que un botón se busque un trabajo cuando está libre es justo lo
       que se vino a quitar. */
    if (id === 'accion') {
      if (!abierto) return;
      sonidos.accion();
      aceptar();
      return;
    }

    /* DERECHA · cierra. En reposo tampoco hace nada. */
    if (!abierto) return;
    sonidos.accion();
    aNeutral();
  };

  /* Tocar el cristal: el michi cuenta cómo va. Fue el botón del medio
     hasta que los tres botones pasaron a ser la interfaz. */
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
          /* Con el panel de pruebas abierto se puede mirar otro color sin
             guardarlo: se sustituye aquí y en ningún sitio más. */
          aparato={prueba?.color ? { ...aparato, michi: prueba.color } : aparato}
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
          {/* Los tres colores. Es SOLO vista previa: no toca el aparato
              guardado, así que se pueden revisar los dibujos sin
              cambiarle el gato a nadie. */}
          <div className="fila">
            {COLORES_MICHI.map((c) => (
              <button key={c} className={prueba?.color === c ? 'on' : ''}
                      onClick={() => setPrueba((p) => ({ pose: p?.pose ?? null, color: c }))}>
                {c.slice(0, 4)}
              </button>
            ))}
          </div>
          <div className="fila">
            {POSES.map((p) => (
              <button key={p.et}
                      className={prueba && prueba.pose === p.id ? 'on' : ''}
                      onClick={() => setPrueba((v) => ({ color: v?.color, pose: p.id }))}>
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
