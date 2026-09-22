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

import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n/index.jsx';
import Ayuda from './Ayuda.jsx';
import Tamagotchi, { COLORES_MICHI, ESCENARIOS_DISPONIBLES } from '../mascota/TamagotchiPNG.jsx';
import Marcador from './Marcador.jsx';
import { estadoVisual } from '../engine/michi.js';
import { hoyISO } from '../engine/pacto.js';
import { sonidos, despertarAudio } from '../mascota/sonido.js';
import { ESCENAS, porId, escenaAutomatica } from '../mascota/escenas.js';
import { ANILLO, anilloDe, siguienteIndice, ESPERA_MS } from '../mascota/anillos.js';
import T from '../i18n/Texto.jsx';

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
   Lo encontró Albert dando los siete toques en el móvil.

   Que el lint no lo viera es normal: `oxlint` sin comprobación de tipos
   no persigue variables libres. Que no lo viera nadie más es porque
   esto no sale nunca solo. */
const POSES = [
  { id: null, et: 'de pie' }, { id: 'comiendo', et: 'come' },
  { id: 'entrenando', et: 'entrena' }, { id: 'durmiendo', et: 'duerme' },
  { id: 'andando', et: 'anda' }, { id: 'contento', et: 'contento' },
  { id: 'triste', et: 'triste' },
  { id: 'celebrando', et: 'celebra' },
  /* Faltaban las dos desde siempre, y son justo las que mas cuesta
     provocar con datos de verdad: `asqueado` pide la casa hecha un
     desastre y `sediento` que lleves medio dia sin darle agua. O sea
     que eran las dos que MAS falta hacia poder mirar aqui. */
  { id: 'asqueado', et: 'asqueado' }, { id: 'sediento', et: 'sediento' },
];

/* La ruta de un dibujo concreto. El componente tiene su propia cadena de
   respaldo para cuando falta un archivo; aqui se quiere lo contrario —el
   archivo EXACTO— porque lo que se viene a ver es si existe y como
   quedo. Si falta, tiene que verse el hueco. */
const rutaSprite = (pose, color) =>
  `/michi/michi${pose ? '_' + pose : ''}${color === 'naranja' ? '' : '-' + color}.png`;

/* ---- EL ZOOM DEL APARATO ----------------------------------------------
   El aparato mide 300 px de ancho, que en un móvil de 375 deja la
   pantallita del michi en unos 150. Se ve, pero se ve pequeña, y ahí
   dentro caben cuatro barras, un rótulo, el michi y el anillo.

   Se amplía con `transform: scale()` y NO pasando un `size` mayor, y la
   diferencia importa: dentro de la pantalla está TODO en píxeles fijos
   —las barras miden 7 px de alto, sus rótulos 6, los iconos del anillo
   12—. Con un `size` mayor crecerían la carcasa y el escenario, y todo
   lo demás se quedaría igual de pequeño en mitad de una pantalla más
   grande. Que es lo contrario de ampliar.

   AVISO para cuando esto crezca: al ampliar, el pixel art deja de caer
   en una rejilla exacta —los iconos del anillo están dibujados a 96 px
   y se pintan a 12, que es una reducción justa de 8 a 1, y a 1,25 pasan
   a 15—. Se ve bien porque `image-rendering: pixelated` no interpola,
   pero algunas filas de píxeles salen un pelo más anchas que otras. Es
   el mismo trato que ya se le da a la carcasa, que mide 751 y se pinta
   a 300. El día que el anillo viva SIEMPRE dentro de la pantalla —que
   es a donde va esto, idea de Albert del 2026-09-14— habrá que decidir
   si los iconos se redibujan a una rejilla mayor. */
const TAM = 300;
const PROPORCION = 1024 / 751;
const ZOOM_MAX = 2;
/* Cuánto de la altura de la ventana puede ocupar el aparato ampliado.
   El resto es para la cabecera y para que se vea que hay más abajo: un
   aparato que llena la pantalla entera parece una pantalla sin salida. */
const ALTO_UTIL = 0.78;

function useZoom(ampliado) {
  const lupa = useRef(null);
  /* El ALTO del aparato se MIDE, no se calcula. `TAM * PROPORCION` da
     solo la carcasa, y dentro de la lupa va también la fila de rótulos
     de los botones («Menú», «Siguiente»...). Calculándolo se reservaban
     100 px de menos y el marcador de abajo se metía encima.

     Y se mide con `ResizeObserver` y no una vez al ampliar, porque
     medirlo una vez sale MAL: al hacerlo justo al pulsar, la fila de
     rótulos todavía no tenía su altura final —la fuente de la marca aún
     no había cargado— y devolvía 409 en vez de 511. El aparato salía
     bien y el hueco reservado se quedaba corto. Un observador no
     depende de en qué momento se mire. */
  /* Las TRES medidas juntas y tomadas a la vez. Estaban en dos estados
     separados —el alto por un lado y la ventana por otro— y se
     desincronizaban: la ventana se medía una sola vez al montar, cuando
     todavía no era la de verdad, y el alto seguía actualizándose solo.
     Resultado: un factor calculado con una ventana vieja y un alto
     nuevo, que daba 1 y no ampliaba nada. */
  const [medida, setMedida] = useState({
    alto: TAM * PROPORCION, ventanaAncho: null, ventanaAlto: null,
  });

  useEffect(() => {
    const el = lupa.current;
    if (!el) return undefined;

    const medir = () => setMedida({
      alto: el.offsetHeight,
      ventanaAncho: document.documentElement.clientWidth,
      ventanaAlto: window.innerHeight,
    });

    const ro = new ResizeObserver(medir);
    ro.observe(el);
    medir();
    window.addEventListener('resize', medir);
    return () => { ro.disconnect(); window.removeEventListener('resize', medir); };
  }, []);

  const { alto, ventanaAncho, ventanaAlto } = medida;

  /* El factor se redondea hacia abajo a múltiplos de 0,05 para que no
     baile al girar el móvil. En un móvil de 375 sale 1,20. */
  const cabe = ventanaAncho
    ? Math.min(ventanaAncho / TAM, (ventanaAlto * ALTO_UTIL) / alto)
    : 1;
  const k = ampliado
    ? Math.min(ZOOM_MAX, Math.max(1, Math.floor(cabe * 20) / 20))
    : 1;

  return [lupa, k, alto * k];
}

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
  /* El mosaico: todos los dibujos a la vez, en vez de uno detras de
     otro. Pedido por Albert el 2026-09-16 para revisar los michis
     nuevos de las model sheets. Mirar 33 dibujos de uno en uno no es
     revisar, es acordarse. */
  const [mosaico, setMosaico] = useState(false);
  /* Un fondo forzado desde el panel, que gana al de la escena. Sirve
     para mirar un escenario nuevo sin tener que darle una escena. */
  const [fondoPrueba, setFondoPrueba] = useState(null);

  /* ---- los tres botones ------------------------------------------
     La gramática entera está explicada en `mascota/anillos.js`. Aquí
     solo vive el estado: si el anillo está abierto y sobre qué icono.

     Va ANTES de calcular la escena porque la escena depende de él: al
     pasear el cursor por el anillo, la pantalla enseña ya lo
     que vas a apuntar. */
  const [abierto, setAbierto] = useState(false);   // ¿hay anillo abierto?
  const [indice, setIndice] = useState(0);
  /* El zoom no se guarda: es un mando de ver, como el de un mapa, y a
     la siguiente visita se vuelve al tamaño de siempre. Si resulta que
     quien lo amplía lo quiere ampliado SIEMPRE, esto pasa a Ajustes y
     se guarda con el resto del aparato. */
  const [ampliado, setAmpliado] = useState(false);
  const [lupa, k, altoZoom] = useZoom(ampliado);
  const anillo = anilloDe(abierto);
  const item = anillo?.[indice] ?? null;

  const visual = estadoVisual(estado);
  const hoy = estado.hoy;
  const entradaHoy = entradas[hoyISO()] ?? {};

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
  const dormido = escena.dormido;

  /* Dormido DE VERDAD, que no es lo mismo que `dormido` de arriba.

     `dormido` incluye la VISTA PREVIA: con el cursor sobre «sueño» el
     anillo enseña ya la escena de dormir, y eso apaga la pantalla
     aunque el michi esté despierto. Si los botones miraran ese, al
     llegar a «sueño» dejarían de pasar al icono siguiente y se pondrían
     a «despertarlo» — o sea que no se podría dar la vuelta al anillo.
     Pasó, y solo se vio probándolo.

     El michi SOLO se duerme por esta acción explícita —pulsar «sueño»
     en el anillo—, nunca por llevar días sin abrir la app. Hasta el
     2026-09-22 también miraba `estado.dormido` (abandono >= 2 días) y
     eso bloqueaba los tres botones para quien llevara un par de días
     sin apuntar nada: cada toque solo «despertaba» sin llegar a abrir
     el anillo, porque el abandono no cambia por tocar botones, solo
     por apuntar datos — así que el aparato se quedaba mudo para
     siempre. Iba contra `MECANICA.md` §10 («no castiga por no abrir la
     app»). Ver `DECISIONS.md` 2026-09-22. */
  const dormidoDeVerdad = escenaId === 'dormir';

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
         se entiende. */
      setEscenaId((e) => (e === 'dormir' ? null : e));

      if (item.id === 'mimar') { onCarino?.(); setGesto('mimar');
        setTimeout(() => setGesto((g) => (g === 'mimar' ? null : g)), 2600); }
      if (item.id === 'agua') onCuidar?.('agua');
      if (item.id === 'limpiar') onCuidar?.('orden');
      sonidos.mimar?.();
    } else if (item.duerme) {
      /* SUEÑO · el michi se duerme Y se abre el editor, en ese orden.
         Un solo icono desde el 2026-09-14; antes eran dos y había que
         saber cuál era cuál.

         Lo importante es lo que pasa DESPUÉS, y es lo que hace que el
         gesto sea uno: apuntes las horas o CANCELES, el michi se queda
         dormido. Cancelar no es deshacer — tú no pulsaste «apuntar»,
         pulsaste «se va a dormir», y eso ya ha ocurrido. Así que quien
         solo quiera apagarlo por la noche pulsa y cierra, y quien venga
         a apuntar lo que durmió lo apunta. El mismo botón sirve a los
         dos sin preguntar cuál eres.

         Se despierta como se despertaba antes: pulsando cualquier
         botón, que es lo que hace el `if (dormidoDeVerdad)` de
         `pulsar`. No hace falta nada aquí para eso. */
      setEscenaId('dormir');
      sonidos.dormir(true);
      onMedir?.(item.campo);
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
      {/* La barra de mandos de Inicio. A la derecha y pequeña: no es
          contenido, son dos mandos. El «?» es el que faltaba —era la
          única pantalla sin ayuda, y es la que más cosas enseña: ver
          `SIMPLICIDAD.md`—. */}
      <div className="mf-inicio-barra">
        <button className="mf-inicio-zoom" aria-pressed={ampliado}
                aria-label={t(ampliado ? 'aparato.reducir' : 'aparato.ampliar')}
                title={t(ampliado ? 'aparato.reducir' : 'aparato.ampliar')}
                onClick={() => setAmpliado((a) => !a)}>
          {ampliado ? '⤡' : '⤢'}
        </button>
        <Ayuda>
          <T k="inicio.ayuda1" />
          <T k="inicio.ayuda2" />
          <T k="inicio.ayuda3" />
          <T k="inicio.ayuda4" />
        </Ayuda>
      </div>

      <div className="mf-escena">
        {/* El contenedor reserva el hueco que ocupa el aparato YA
            escalado. `transform` no cambia el sitio que algo ocupa en la
            página, así que sin esta altura el marcador de abajo se
            quedaría donde estaba y el aparato le pasaría por encima. */}
        <div className={`mf-zoom ${ampliado ? 'ampliado' : ''}`} style={{ height: altoZoom }}>
        <div className="mf-zoom-lupa" ref={lupa} style={{ width: TAM, transform: `scale(${k})` }}>
        <Tamagotchi
          estado={visual.cuerpo}
          size={TAM}
          dormido={prueba ? prueba.pose === 'durmiendo' : dormido}
          /* Lo que HACE gana a cómo se siente: si está comiendo, sale
             comiendo aunque ande triste. El humor solo se ve cuando no
             está haciendo nada. */
          pose={prueba ? prueba.pose
                : dormido ? 'durmiendo'
                : (escena.pose ?? visual.humor)}
          escenario={fondoPrueba ?? escena.escenario}
          rotulo={t('escenas.' + escena.id)}
          mimando={gesto === 'mimar'}
          nivel={estado.nivel}
          felicidad={estado.felicidad}
          denoche={estado.felicidadDetalle?.denoche}
          cuidado={estado.cuidado}
          /* El anillo va SIEMPRE, abierto o no: desde el 2026-09-16 es
             una banda fija abajo, como los iconos serigrafiados de un
             tamagotchi de verdad. `abierto` es lo que decide si hay uno
             seleccionado o estan los siete en reposo. */
          menu={{
            abierto,
            indice,
            items: ANILLO.map((it) => ({ ...it, etiqueta: t(it.clave) })),
          }}
          mensaje={gesto === 'estado' ? t('inicio.analogico') : null}
          onBoton={pulsar}
          onPantalla={tocarPantalla}
          /* Con el panel de pruebas abierto se puede mirar otro color sin
             guardarlo: se sustituye aquí y en ningún sitio más. */
          aparato={prueba?.color ? { ...aparato, michi: prueba.color } : aparato}
        />
        </div>
        </div>
      </div>

      {pruebas && (
        <div className="mf-pruebas">
          <b>
            PRUEBAS
            <button className="cerrar" aria-label={t('comun.cerrar')}
                    onClick={() => { setPrueba(null); setEscenaId(null); setFondoPrueba(null); onCerrarPruebas?.(); }}>
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
          {/* Cualquier escenario, aunque no lo use ninguna escena. Es la
              unica forma de mirar uno nuevo antes de decidir si entra. */}
          <div className="fila">
            {ESCENARIOS_DISPONIBLES.map((f) => (
              <button key={f} className={fondoPrueba === f ? 'on' : ''}
                      onClick={() => setFondoPrueba((v) => (v === f ? null : f))}>
                {f}
              </button>
            ))}
          </div>
          <div className="fila">
            <button className={mosaico ? 'on' : ''}
                    onClick={() => setMosaico((v) => !v)}>
              {mosaico ? 'ocultar todos' : 'ver todos'}
            </button>
          </div>

          {/* TODOS LOS DIBUJOS, de golpe. Una columna por pose y una
              fila por color, que es como se ve de un vistazo si alguno
              desentona con los demas o si falta alguno.

              Van con `img` a pelo y no montando aparatos: aqui se
              revisa el DIBUJO, no como queda dentro de la pantallita.
              Y a su tamano de archivo escalado con `pixelated`, para
              que se vea el pixel como es. */}
          {mosaico && (
            <div className="mosaico">
              {COLORES_MICHI.map((color) => (
                <div className="linea" key={color}>
                  <span className="que">{color}</span>
                  {POSES.map((p) => (
                    <figure key={`${color}-${p.et}`}>
                      <img src={rutaSprite(p.id, color)} alt="" loading="lazy" />
                      <figcaption>{p.et}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          )}
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
  /* Apuntar YA cuenta como el día cumplido, como con el entreno: `ok`
     solo distingue "lo has anotado" de "no lo has anotado". Cuántas
     horas fueron sigue teniendo su propio consejo (poco / casi /
     perfecto / de más), pero eso ya no decide la casilla. */
  if (horas < 6) return { ok: true, ...par('Poco') };
  if (horas < 7.5) return { ok: true, ...par('Casi') };
  if (horas <= 9) return { ok: true, ...par('Perfecto') };
  return { ok: true, ...par('Pasado') };
}


/* Lo que sale al tocar el cristal.

   Hasta el 2026-09-16 era un RESUMEN: la racha, los escudos y lo que
   faltaba por apuntar, todo en una frase. Se retira, y lo pidio Albert.

   La razon es buena y es de producto: eso ya esta escrito debajo, en el
   marcador, con mas sitio y mejor. Repetirlo aqui era la cuarta cara del
   mismo dato —justo lo que `SIMPLICIDAD.md` señala como el problema de
   verdad de esta pantalla— y encima enseñaba a tocar el cristal para
   enterarse de cosas, que es lo contrario de lo que queremos: esto es un
   aparato con tres botones, no una pantalla tactil.

   Asi que ahora el michi dice eso mismo, y con gracia. */

