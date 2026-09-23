/* ============================================================
   Pantalla "Progreso"
   Gráfica de peso con previsión, y calendario del pacto.

   La previsión sale de TUS pesajes reales si hay suficientes; si no,
   del ritmo teórico del simulador. Es la idea de la MichiFit original:
   una orientación que responde a lo que de verdad apuntas, no una
   promesa sacada de una fórmula.

   Tocando un día del calendario se registra o corrige ese día: dentro
   de la ventana de 3 días cuenta para el pacto, y el peso se puede
   editar siempre.
   ============================================================ */

import { useMemo, useState } from 'react';
import T from '../i18n/Texto.jsx';
import { useT, useFormato } from '../i18n/index.jsx';
import { hoyISO, diasDesde, diasAtras, claveDia, horasDeSueno, evaluarDia } from '../engine/pacto.js';
import EditorDia from './EditorDia.jsx';
import { simular, actividadDelPacto, actividadReciente, planEnergetico, ritmoReal } from '../engine/calculos.js';
import { Titulo } from './Ayuda.jsx';
import { DIAS, SUENO_IDEAL } from '../engine/constantes.js';

export default function Progreso({ perfil, pacto, entradas, onRegistrar }) {
  const t = useT();
  const fmt = useFormato();
  const [mesOffset, setMesOffset] = useState(0);
  const [editando, setEditando] = useState(null);
  /* '7' | '30' | 'anio': qué ventana enseñan las cuatro gráficas de
     abajo. Pedido por Albert el 2026-09-23. */
  const [modo, setModo] = useState('7');

  const pesajes = useMemo(() =>
    Object.keys(entradas)
      .filter((f) => entradas[f]?.peso != null)
      .sort()
      .map((f) => ({ fecha: f, peso: entradas[f].peso })),
    [entradas]);

  /* Las columnas de las cuatro gráficas de abajo: 7 o 30 días (una
     columna = un día) o el año (una columna = un mes, resumido).
     Reusa `evaluarDia` —la misma función que ya pinta el calendario—
     para que «cumplido» signifique EXACTAMENTE lo mismo aquí que en
     cualquier otra pantalla. */
  const columnas = useMemo(() => {
    const hoy = hoyISO();
    return modo === 'anio'
      ? mesesDelAnio(pacto, entradas, hoy, fmt)
      : diasRecientes(modo === '30' ? 30 : 7, pacto, entradas, hoy, t);
  }, [modo, entradas, pacto, t, fmt]);

  const pesoActual = pesajes.length ? pesajes[pesajes.length - 1].peso : perfil.pesoActual;
  const perdido = (perfil.pesoInicial ?? pesoActual) - pesoActual;
  const restante = pesoActual - (perfil.pesoMeta ?? pesoActual);
  /* Si tocaba bajar (o el objetivo es mantenerse en algo igual o menor
     que el punto de partida) o tocaba subir. Con `restante <= 0` a
     secas «ya en la meta» salía SIEMPRE para quien quiere ganar peso,
     desde el primer día: `restante` nace negativo en ese caso, antes de
     ganar un solo gramo. Hace falta saber hacia dónde iba el plan, y
     `pesoInicial` es lo mismo que ya usa `perdido` un poco más arriba. */
  const rumboBajar = (perfil.pesoInicial ?? pesoActual) >= (perfil.pesoMeta ?? pesoActual);
  const enMeta = perfil.pesoMeta != null
    && (rumboBajar ? pesoActual <= perfil.pesoMeta : pesoActual >= perfil.pesoMeta);

  const real = ritmoReal(pesajes);
  /* Mientras no haya pesadas suficientes (o mientras las que hay no
     apunten a la meta, ver `realApunta` más abajo) se enseña el ritmo
     TEÓRICO. Hasta el 2026-09-19 salía siempre del PACTO entero —media
     de pasos y minutos que pactaste el primer día, fija hasta que
     edites «Mi objetivo» a mano—, y eso es lo contrario de lo que
     pidió Albert: "cada día que el usuario registre sus puntuaciones
     se refleje en la gráfica". Si esta semana caminaste el doble o
     comiste distinto a lo pactado, la previsión tiene que notarlo,
     no seguir mirando el número que escribiste una vez.

     `actividadReciente` mira lo que de verdad apuntaste en `entradas`
     estos últimos días; donde no haya suficiente (recién empezado,
     días sueltos sin datos) cada campo cae por separado al pacto, con
     `??`. Así el primer día se comporta exactamente como antes, y en
     cuanto hay hábito registrado, la previsión empieza a seguirlo. */
  const teorico = useMemo(() => {
    const act = actividadDelPacto(pacto);
    const plan = planEnergetico(perfil, pacto);
    if (!act || !plan) return null;
    const reciente = actividadReciente(entradas, hoyISO());
    const s = simular({
      perfil: { ...perfil, pesoActual },
      pasos: reciente.pasos ?? act.pasos,
      minEntrenoSemana: reciente.minEntrenoSemana ?? act.minEntrenoSemana,
      comidaKcal: reciente.comidaKcal ?? (pacto?.comidaKcal ?? plan.comida),
    });
    return s?.kgPorSemana ?? null;
  }, [perfil, pacto, pesoActual, entradas]);

  /* El ritmo REAL manda SOLO si apunta a la meta. Hasta el 2026-09-19
     no era así: `ritmo` era siempre `real ?? teorico`, así que un real
     que apuntara al lado contrario —normal con pocos pesajes, o una
     semana mala de verdad— apagaba TAMBIÉN al teórico. Quien llevara
     semanas de pesajes erráticos no volvía a ver una fecha jamás,
     aunque su propio pacto sí la prometiera: Albert lo vio con sus
     datos («sigue sin verse bien») y lo comparó con la MichiFit
     antigua, que sí dibujaba la línea hacia la meta.

     Ahora, si el real no apunta a la meta, se cae al teórico del
     pacto —es la promesa que hiciste, y apagar la gráfica en cuanto
     el dato de esta semana pincha desanima más de lo que informa—.
     `realApunta` decide TODO lo que depende de «cuál ritmo manda»: el
     número de la celda, su etiqueta, la insignia «según lo que
     apuntas», y qué línea dibuja la gráfica. Antes esas cuatro cosas
     miraban `real` cada una por su lado y podían desincronizarse.

     Desde el 2026-09-23, `real` ya no es una regresión de mínimos
     cuadrados: es la mediana de pendientes entre pesajes (Theil-Sen),
     mucho más resistente a un solo pesaje raro. Ver `ritmoReal` en
     `engine/calculos.js` y `DECISIONS.md` 2026-09-23. */
  const realApunta = real != null && restante !== 0
    && Math.abs(real) > 0.01 && Math.sign(restante) !== Math.sign(real);
  const ritmo = realApunta ? real : teorico;
  /* «Va hacia la meta», no «baja»: desde que se puede elegir ganar peso,
     acercarse a la meta puede ser subir. El nombre `bajando` daba por
     hecho lo contrario y dejaba la previsión en blanco a quien quisiera
     engordar. Se conserva el nombre para no tocar la gráfica entera, que
     lo recibe por props. */
  const bajando = ritmo != null && Math.abs(ritmo) > 0.01 && restante !== 0
    && Math.sign(restante) !== Math.sign(ritmo);
  const semanas = bajando ? Math.abs(restante) / Math.abs(ritmo) : null;
  const fechaMeta = semanas
    ? new Date(Date.now() + semanas * 7 * 86400000)
    : null;
  const metaISO = fechaMeta ? fechaMeta.toISOString().slice(0, 10) : null;

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
          <T k="progreso.ayuda1" />
          <T k="progreso.ayuda2" />
          <T k="progreso.ayuda4" />
        </>}>
        {t('progreso.titulo')}
      </Titulo>

      {/* Los cuatro recuadros, 2x2: peso inicial y actual arriba,
          perdido y lo que falta abajo —con el ritmo pequeñito debajo
          del número de lo que falta, no como un quinto recuadro—.
          Orden pedido por Albert el 2026-09-23. */}
      <div className="mf-rejilla">
        <Celda n={perfil.pesoInicial != null ? perfil.pesoInicial.toFixed(1) : '—'} u="kg"
               etiqueta={t('progreso.pesoInicial')} />
        <Celda n={pesoActual != null ? pesoActual.toFixed(1) : '—'} u="kg" etiqueta={t('progreso.pesoActual')} />
        <Celda n={(perdido > 0 ? '−' : '') + Math.abs(perdido || 0).toFixed(1)} u="kg"
               etiqueta={perdido >= 0 ? t('progreso.perdidos') : t('progreso.recuperados')}
               clase={perdido > 0 ? 'bien' : ''} />
        {/* Valor absoluto y no `Math.max(0, restante)`: para quien quiere
            GANAR peso `restante` es negativo mientras falta, y el max lo
            dejaba siempre en 0,0. Una vez en la meta, 0 de verdad. */}
        <Celda n={(enMeta ? 0 : Math.abs(restante || 0)).toFixed(1)} u="kg" etiqueta={t('progreso.hastaMeta')}>
          {ritmo != null && (
            <small className={`mf-celda-ritmo ${ritmo < 0 ? 'bien' : ''}`}>
              {t(realApunta ? 'progreso.ritmoReal' : 'progreso.ritmoPrevisto')}: {ritmo.toFixed(2)} {t('comun.kg')}
            </small>
          )}
        </Celda>
      </div>

      {/* CUÁNTO FALTA, y la gráfica de peso ↔ tiempo con su previsión.
          Debajo de los cuatro recuadros y antes del calendario, a
          petición de Albert el 2026-09-23 (antes iba todo esto arriba
          del todo). */}
      {enMeta ? (
        <div className="mf-meta">
          <b>🎉</b>
          <small>{t('progreso.yaEnMeta')}</small>
        </div>
      ) : bajando ? (
        <div className="mf-meta">
          <small>{t('progreso.llegas', { kg: perfil.pesoMeta })}</small>
          <b>{(semanas / 4.345).toFixed(1)}</b>
          <small>{t('progreso.meses', { n: Math.round(semanas) })}</small>
          <div className="mf-fecha">📅 ~{fmt.fecha(fechaMeta)}</div>
        </div>
      ) : (
        <div className="mf-meta">
          <small>{t('progreso.siguiendoRitmo')}</small>
        </div>
      )}

      <div className="mf-tarjeta">
        <h3 className="mf-h3">
          {t('progreso.pesoTiempo')} {realApunta && <small className="mf-real">{t('progreso.segunApuntas')}</small>}
        </h3>
        {pesajes.length === 0 ? (
          <p className="mf-nota" style={{ marginTop: 0 }}>
            {t('progreso.sinPesajes')}
          </p>
        ) : (
          <>
            <Grafica pesajes={pesajes} pesoActual={pesoActual}
                     pesoMeta={perfil.pesoMeta}
                     ritmo={ritmo} bajando={bajando} semanas={semanas} />
            <p className="mf-nota" style={{ textAlign: 'center' }}>
              {t('progreso.leyenda')}
              {!realApunta && t('progreso.leyendaTeorica')}
            </p>
          </>
        )}
      </div>

      <Calendario
        mesOffset={mesOffset} setMesOffset={setMesOffset}
        entradas={entradas} pacto={pacto} metaISO={metaISO}
        onTocar={setEditando}
      />

      {/* Las cuatro gráficas, con el selector de ventana. Pedidas por
          Albert el 2026-09-23, para ver de un vistazo si hay algún
          hábito flojeando sin tener que abrir el calendario día a día.
          Sin macros a propósito: son informativas y no cuentan para
          nada, así que no pintan aquí — ver `dia.macrosNota`. */}
      {pacto && (
        <div className="mf-tarjeta">
          <div className="mf-graf7-cab">
            <h3 className="mf-h3">{t('progreso.semanaTitulo')}</h3>
            <div className="mf-graf7-modos">
              {['7', '30', 'anio'].map((m) => (
                <button key={m} className={modo === m ? 'sel' : ''} onClick={() => setModo(m)}>
                  {t('progreso.modo' + m)}
                </button>
              ))}
            </div>
          </div>
          <GraficaSemana titulo={t('dia.entreno')} dias={columnas} modo={modo}
                          valor={(d) => esDescanso(d.entreno) ? null : d.entreno?.valor}
                          meta={(d) => d.entreno?.objetivo}
                          estado={(d) => esDescanso(d.entreno)
                            ? (d.entreno.respetado ? 'ok' : 'parcial')
                            : estadoDia(d.entreno, d.abierto)}
                          descanso={(d) => esDescanso(d.entreno)}
                          formato={(v) => `${Math.round(v)} ${t('comun.min')}`} />
          <GraficaSemana titulo={t('dia.pasos')} dias={columnas} modo={modo}
                          valor={(d) => d.pasos?.valor} meta={(d) => d.pasos?.objetivo}
                          estado={(d) => estadoDia(d.pasos, d.abierto)}
                          formato={(v) => `${Math.round(v)}`} />
          <GraficaSemana titulo={t('dia.comida')} dias={columnas} modo={modo}
                          valor={(d) => d.comida?.valor} meta={(d) => d.comida?.objetivo}
                          estado={(d) => estadoDia(d.comida, d.abierto)}
                          formato={(v) => `${Math.round(v)} ${t('comun.kcal')}`} />
          <GraficaSemana titulo={t('dia.sueno')} dias={columnas} modo={modo}
                          valor={(d) => d.sueno.valor} meta={(d) => d.sueno.objetivo ?? SUENO_IDEAL}
                          estado={(d) => d.sueno.valor == null ? (d.abierto ? 'abierto' : 'fallo') : (d.sueno.cumplido ? 'ok' : 'parcial')}
                          formato={(v) => `${Math.round(v * 10) / 10} ${t('comun.h')}`} />
        </div>
      )}

      {editando && (
        <EditorDia
          fecha={editando} entrada={entradas[editando] ?? {}} pacto={pacto}
          onGuardar={(campos) => { onRegistrar(editando, campos); setEditando(null); }}
          onCerrar={() => setEditando(null)}
        />
      )}
    </div>
  );
}

/* Mismo criterio que ya usa `Calendario` para colorear un día, pero
   por METRICA en vez de por el día entero: «ok» cumplido, «parcial»
   apuntado y no cumplido, «abierto» aún se puede rellenar (dentro de
   `VENTANA_RETRO`), «fallo» sin datos y ya cerrado —que se pinta
   NEUTRO, no en rojo, desde el 2026-09-19: no castiga por no apuntar—.
   Sin objetivo ese día (`o` es `undefined`, antes de que el pacto
   pidiera nada) cuenta igual que sin datos. */
function estadoDia(o, abierto) {
  if (!o || o.valor == null) return abierto ? 'abierto' : 'fallo';
  return o.cumplido ? 'ok' : 'parcial';
}

/* El objetivo de «entreno» de un día de descanso es el MISMO array que
   el de un día de entreno (`evaluarDia` los mete en el mismo sitio,
   ver `engine/pacto.js`), pero es otra cosa: `cumplido` en un
   descanso es SIEMPRE `true` —descansar no rompe el día— así que
   `estadoDia` no vale aquí. Lo que importa es `respetado`: si de
   verdad descansaste. */
const esDescanso = (o) => o?.id === 'descanso';

/* Lo que hace falta de UN día para las cuatro gráficas: los objetivos
   de `evaluarDia` (entreno/descanso, pasos, comida) más el sueño
   aparte (no vive en el pacto). Una sola función para que "7 días",
   "30 días" y "cada día de un mes" —para la vista anual— lean
   exactamente lo mismo. */
function diaMetrica(fecha, pacto, entradas, hoy) {
  const entrada = entradas[fecha];
  const ev = pacto ? evaluarDia({ pacto, entrada, fecha, hoy }) : null;
  const horas = horasDeSueno(entrada);
  return {
    fecha,
    entreno: ev?.objetivos.find((o) => o.id === 'entreno' || o.id === 'descanso'),
    pasos: ev?.objetivos.find((o) => o.id === 'pasos'),
    comida: ev?.objetivos.find((o) => o.id === 'comida'),
    sueno: { valor: horas, objetivo: SUENO_IDEAL, cumplido: horas != null },
    abierto: ev?.abierto ?? false,
  };
}

function diasRecientes(n, pacto, entradas, hoy, t) {
  const dias = [];
  for (let i = n - 1; i >= 0; i--) {
    const fecha = diasAtras(hoy, i);
    dias.push({
      ...diaMetrica(fecha, pacto, entradas, hoy),
      letra: t('dias.inicial.' + claveDia(fecha)),
      esHoy: fecha === hoy,
    });
  }
  return dias;
}

/* Cuánto de un mes hace falta para que la barra salga «ok»: no exige
   el 100% de los días (nadie cumple TODOS), pero sí una mayoría clara.
   Un solo número, en un solo sitio: súbelo o bájalo aquí si el reparto
   verde/ámbar de la vista anual no cuadra con lo que la gente espera. */
const UMBRAL_MES_OK = 0.7;

/* Resume los días de un mes en UN solo «objeto tipo día»: cuenta
   cuántos cumplieron de los que ya se podían evaluar (ni futuros ni
   «abiertos» todavía) y da el % como si fuera un valor sobre 100. Así
   `GraficaSemana` no necesita saber si está pintando días o meses: los
   dos hablan el mismo idioma (`valor`/`objetivo`/`cumplido`). */
function resumenMes(diasDelMes, accessor, comoDescanso) {
  let ok = 0, evaluables = 0;
  for (const d of diasDelMes) {
    const o = accessor(d);
    if (comoDescanso && esDescanso(o)) {
      evaluables++;
      if (o.respetado) ok++;
      continue;
    }
    if (!o || o.valor == null) {
      if (!d.abierto) evaluables++;   // sin datos y ya cerrado: cuenta, no suma
      continue;
    }
    evaluables++;
    if (o.cumplido) ok++;
  }
  if (!evaluables) return { valor: null, objetivo: 100, cumplido: false };
  const pct = ok / evaluables;
  return { valor: Math.round(pct * 100), objetivo: 100, cumplido: pct >= UMBRAL_MES_OK };
}

/* Los doce meses del año en curso, de enero a diciembre, para que se
   vea el año entero de un vistazo (pedido por Albert el 2026-09-23:
   «que estén las barras ayuda a visualizar el año entero»). Los meses
   sin ningún día evaluable —antes de crear el objetivo, o todavía en
   el futuro— salen igual, con el mismo color de «sin datos» que ya usa
   cualquier día suelto sin apuntar: `resumenMes` con una lista vacía ya
   devuelve `valor: null`, así que no hace falta un estado nuevo. */
function mesesDelAnio(pacto, entradas, hoy, fmt) {
  const anio = Number(hoy.slice(0, 4));
  let cursor = new Date(anio, 0, 1, 12);
  const limite = new Date(anio, 11, 1, 12);
  const hoyMes = hoy.slice(0, 7);
  const meses = [];

  while (cursor <= limite) {
    const anio = cursor.getFullYear(), mes = cursor.getMonth();
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();
    const dias = [];
    for (let d = 1; d <= ultimoDia; d++) {
      const fecha = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (fecha > hoy) break;
      /* Días de antes de crear el objetivo no cuentan como fallados
         —ni siquiera existían todavía—: se saltan, no se evalúan. Sin
         esto, un mes entero anterior al pacto saldría en ámbar («a
         medias») en vez de neutro, el mismo error que ya se corrigió
         una vez para las rachas (ver SESSION_MAP.md, 2026-09-07). */
      if (pacto?.creado && fecha < pacto.creado) continue;
      dias.push(diaMetrica(fecha, pacto, entradas, hoy));
    }
    const claveMes = `${anio}-${String(mes + 1).padStart(2, '0')}`;
    meses.push({
      fecha: claveMes,
      letra: fmt.mesCorto(cursor).replace('.', ''),
      esHoy: claveMes === hoyMes,
      entreno: resumenMes(dias, (d) => d.entreno, true),
      pasos: resumenMes(dias, (d) => d.pasos, false),
      comida: resumenMes(dias, (d) => d.comida, false),
      sueno: resumenMes(dias, (d) => d.sueno, false),
      abierto: false,
    });
    cursor = new Date(anio, mes + 1, 1, 12);
  }
  return meses;
}

/* ---------------- gráficas (7 días, 30 días o meses del año) ----------------
   Una fila de barras, del más viejo al más reciente, con la altura
   relativa a la META de esa columna (no al máximo de la fila): así una
   semana floja se ve floja, no se autoescala para parecer bien. El día
   de descanso (`descanso`) no tiene meta que valga —«cero minutos» es
   justo lo que toca— así que sale un puntito en vez de una barra.

   Full-bleed: las barras llegan al borde del dispositivo (`.mf-graf7`
   cancela el padding de la tarjeta Y el de la página). Pedido por
   Albert el 2026-09-23, «se ven muy pequeñas y apretadas». Nunca hay
   scroll horizontal —pedido también por Albert el mismo día, para los
   30 días—: con muchas columnas cada barra se encoge, no se desborda.
   Con más de un puñado de columnas (los 30 días) las letras de cada
   una se pisarían, así que solo se rotula una de cada cinco (más
   «hoy», siempre visible) — de sobra para ubicarse sin abarrotar. */
function GraficaSemana({ titulo, dias, modo, valor, meta, estado, formato, descanso }) {
  const t = useT();
  const TOPE = 1.3; // por encima de la meta, la barra ya no crece más
  const step = dias.length > 14 ? 5 : 1;
  return (
    <div className="mf-graf7">
      <p className="mf-graf7-titulo">{titulo}</p>
      <div className="mf-graf7-scroll">
        <div className="mf-graf7-fila" style={{ '--cols': dias.length }}>
          {dias.map((d, i) => {
            const v = valor(d);
            const m = meta(d);
            const esDescansoDia = descanso?.(d);
            const est = estado(d);
            const pct = esDescansoDia || v == null || !m ? 0 : Math.min(TOPE, v / m);
            /* En la vista anual `valor` ya no está en la unidad de
               siempre (minutos, pasos, kcal, horas): es un % de días
               cumplidos ese mes, igual para las cuatro gráficas. El
               tooltip lo dice como tal en vez de usar `formato`, que
               asume la unidad nativa del día. */
            const tituloBarra = esDescansoDia ? t('marcador.descanso')
              : v == null ? t('progreso.calSinDatos')
              : modo === 'anio' ? `${Math.round(v)}%` : formato(v);
            const mostrarEtiqueta = d.esHoy || i % step === 0;
            return (
              <div className="mf-graf7-col" key={i}>
                <div className="mf-graf7-barra" title={tituloBarra}>
                  {esDescansoDia ? (
                    <i className={`punto ${est}`} />
                  ) : (
                    <i className={est} style={{ height: `${Math.max(6, pct * 100)}%` }} />
                  )}
                </div>
                <small className={d.esHoy ? 'hoy' : ''}>{mostrarEtiqueta ? d.letra : ''}</small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- gráfica ---------------- */
function Grafica({ pesajes, pesoActual, pesoMeta, ritmo, bajando, semanas }) {
  const t = useT();
  const W = 700, H = 340, pl = 62, pr = 26, pt = 22, pb = 42;
  const ancho = W - pl - pr, alto = H - pt - pb;

  const hoy = hoyISO();
  const puntos = pesajes.map((p) => ({ d: -diasDesde(p.fecha, hoy), w: p.peso }));
  const diasFuturo = bajando ? Math.max(7, Math.round(semanas * 7)) : 56;
  const finW = bajando ? pesoMeta : pesoActual + (ritmo ?? 0) * (diasFuturo / 7);

  /* CUANTO FUTURO SE ENSEÑA.

     Hasta el 2026-09-19 esto se enseñaba como mucho VEZ Y MEDIA el
     historial (decisión de Albert del 2026-09-12): si la previsión
     eran 165 días contra 28 de historial, se cortaba con una punta de
     flecha en el borde, porque lo ya andado se apelotonaba contra la
     izquierda y no se distinguía un día de otro.

     Albert le dio la vuelta ese mismo día 19, después de ver su
     propia gráfica: quiere el eje SIEMPRE comprimido al tiempo exacto
     hasta la meta —si son dos meses, la barra de abajo son esos dos
     meses enteros, sin cortar—, para ver de un vistazo cuándo llegaría.
     Ya no hace falta protegerse de una previsión rara: el aviso de
     arriba (`.mf-meta`) dice la fecha con todas sus letras, así que
     esta gráfica puede permitirse comprimir el historial sin que
     nadie se quede sin saber qué pasó.

     Solo aplica cuando SÍ hay una meta con fecha (`bajando`): sin
     ritmo que apunte a la meta no hay «tiempo hasta la meta» al que
     comprimirse, así que se queda con la ventana de siempre. */
  const historial = Math.max(0, -Math.min(0, ...puntos.map((p) => p.d)));
  const diasVisibles = bajando
    ? diasFuturo
    : Math.min(diasFuturo, Math.max(28, Math.round(historial * 1.5)));
  const cortada = diasVisibles < diasFuturo;

  /* Donde queda la linea de prevision en el borde, si se corta. Es la
     misma recta, evaluada antes de tiempo. */
  const finVisibleW = cortada
    ? pesoActual + (finW - pesoActual) * (diasVisibles / diasFuturo)
    : finW;

  const xs = puntos.map((p) => p.d).concat([0, diasVisibles]);
  const ws = puntos.map((p) => p.w)
    .concat([pesoActual, pesoMeta, finVisibleW].filter((v) => v != null));
  const xMin = Math.min(...xs), xMax = Math.max(...xs, xMin + 7);
  let yMin = Math.min(...ws) - 0.8, yMax = Math.max(...ws) + 0.8;
  if (yMax - yMin < 1.5) yMax = yMin + 1.5;

  const X = (d) => pl + ((d - xMin) / (xMax - xMin)) * ancho;
  const Y = (w) => pt + ((yMax - w) / (yMax - yMin)) * alto;
  const marcas = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);
  const linea = puntos.map((p) => `${X(p.d)},${Y(p.w)}`).join(' ');
  /* El SVG no hereda las variables CSS del documento por `font-family`
     en atributo, asi que la cadena de reservas se repite aqui. */
  const FF = "Nunito, 'Yu Gothic UI', Meiryo, 'Microsoft YaHei', "
    + "'Leelawadee UI', system-ui, sans-serif";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
         style={{ width: '100%', height: 'auto', display: 'block' }}>
      {marcas.map((t, i) => (
        <g key={i}>
          <line x1={pl} y1={Y(t)} x2={W - pr} y2={Y(t)} stroke="var(--linea)" strokeWidth="1.5" />
          <text x={pl - 10} y={Y(t) + 5} textAnchor="end" fontSize="16" fontWeight="700"
                fill="var(--tinta-flojo)" fontFamily={FF}>{t.toFixed(1)}</text>
        </g>
      ))}

      {pesoMeta != null && (
        <>
          <line x1={pl} y1={Y(pesoMeta)} x2={W - pr} y2={Y(pesoMeta)}
                stroke="var(--bien)" strokeWidth="2.5" strokeDasharray="9 6" />
          <text x={pl + 4} y={Y(pesoMeta) - 9} fontSize="15" fontWeight="800"
                fill="var(--bien)" fontFamily={FF}>{t('progreso.meta', { kg: pesoMeta })}</text>
        </>
      )}

      <line x1={X(0)} y1={pt} x2={X(0)} y2={H - pb}
            stroke="var(--menta)" strokeWidth="1.5" strokeDasharray="4 5" opacity=".7" />
      <text x={X(0)} y={H - 14} textAnchor="middle" fontSize="15" fontWeight="800"
            fill="var(--tinta-flojo)" fontFamily={FF}>{t('progreso.hoy')}</text>

      <line x1={X(0)} y1={Y(pesoActual)} x2={X(diasVisibles)} y2={Y(finVisibleW)}
            stroke="var(--menta)" strokeWidth="4" strokeDasharray="8 7" strokeLinecap="round" />

      {/* La prevision sigue mas alla del borde: punta de flecha en el
          sentido que lleva la linea. Sin esto, cortarla parece que la
          meta esta justo ahi. */}
      {cortada && (
        <polygon
          points={`${X(diasVisibles)},${Y(finVisibleW) - 9} ${X(diasVisibles) + 15},${Y(finVisibleW)} ${X(diasVisibles)},${Y(finVisibleW) + 9}`}
          fill="var(--menta)" />
      )}

      {puntos.length >= 2 && (
        <polyline points={linea} fill="none" stroke="var(--rosa)" strokeWidth="4.5"
                  strokeLinejoin="round" strokeLinecap="round" />
      )}
      {puntos.map((p, i) => (
        <circle key={i} cx={X(p.d)} cy={Y(p.w)} r="5" fill="var(--rosa)" />
      ))}

      {/* El trofeo solo si la meta ENTRA. Cortada, caeria fuera del
          dibujo o —peor— justo en el borde, y se leeria como que ya casi
          estas. La linea de la meta sigue pintada de lado a lado, asi
          que hacia donde vas se ve igual. */}
      {bajando && !cortada && (
        <>
          <circle cx={X(diasVisibles)} cy={Y(pesoMeta)} r="7" fill="var(--bien)"
                  stroke="var(--papel)" strokeWidth="2" />
          <text x={X(diasVisibles)} y={Y(pesoMeta) - 16} textAnchor="middle" fontSize="18">🏆</text>
        </>
      )}
    </svg>
  );
}

/* ---------------- calendario ---------------- */
function Calendario({ mesOffset, setMesOffset, entradas, pacto, metaISO, onTocar }) {
  const t = useT();
  const fmt = useFormato();
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + mesOffset);
  const anio = base.getFullYear(), mes = base.getMonth();
  const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7;   // lunes = 0
  const dias = new Date(anio, mes + 1, 0).getDate();
  const hoy = hoyISO();

  /* Antes de que el pacto existiera no se podía incumplir —no había
     nada que cumplir—, así que esos días no se evalúan: se ven como
     cualquier casilla vacía, ni bien ni mal. Es la misma regla que ya
     aplica `calcularEstado` en `engine/michi.js` para el abandono, solo
     que hasta el 2026-09-19 el calendario no la tenía: quien mirase el
     mes en que adoptó al michi veía filas enteras en rojo por días de
     antes de que la app existiera para él. */
  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let d = 1; d <= dias; d++) {
    const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const antesDelPacto = pacto?.creado && iso < pacto.creado;
    const ev = pacto && !antesDelPacto
      ? evaluarDia({ pacto, entrada: entradas[iso], fecha: iso, hoy }) : null;
    const futuro = iso > hoy;
    celdas.push({
      d, iso, futuro,
      esHoy: iso === hoy,
      meta: iso === metaISO,
      peso: entradas[iso]?.peso != null,
      estado: futuro ? '' : !ev ? '' : ev.abierto ? 'abierto' : ev.cumple ? 'ok' : ev.hayDatos ? 'parcial' : 'fallo',
    });
  }

  return (
    <div className="mf-tarjeta">
      <div className="mf-calnav">
        <button onClick={() => setMesOffset(mesOffset - 1)}>‹</button>
        <b>{fmt.mes(new Date(anio, mes, 1))}</b>
        <button onClick={() => setMesOffset(mesOffset + 1)}>›</button>
      </div>

      <div className="mf-cal">
        {DIAS.map((d) => <div className="mf-caldow" key={d}>{t('dias.inicial.' + d)}</div>)}
        {celdas.map((c, i) => c == null ? <div key={i} /> : (
          <button key={i}
                  className={`mf-caldia ${c.estado} ${c.esHoy ? 'hoy' : ''} ${c.futuro ? 'futuro' : ''}`}
                  disabled={c.futuro}
                  onClick={() => onTocar(c.iso)}>
            {c.d}
            {c.peso && <i className="peso" />}
            {c.meta && <span className="meta">🏆</span>}
          </button>
        ))}
      </div>

      <div className="mf-leyenda">
        <i className="ok" /> {t('progreso.calPactoCumplido')} &nbsp; <i className="parcial" /> {t('progreso.calAMedias')} &nbsp;
        <i className="fallo" /> {t('progreso.calSinDatos')} &nbsp; <i className="abierto" /> {t('progreso.calATiempo')}
      </div>
      <p className="mf-nota">{t('progreso.calNota')}</p>
    </div>
  );
}

function Celda({ n, u, etiqueta, clase = '', children }) {
  return (
    <div className="mf-celda">
      <b className={clase}>{n} {u && <span style={{ fontSize: 13 }}>{u}</span>}</b>
      <small>{etiqueta}</small>
      {children}
    </div>
  );
}
