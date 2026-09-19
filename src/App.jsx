/* ============================================================
   MichiFit · armazón de la app
   App pública: no trae datos de nadie dentro. Todo empieza a cero y
   cada usuario rellena lo suyo, que se queda en su dispositivo.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from 'react';
import Bienvenida from './pantallas/Bienvenida.jsx';
import Inicio from './pantallas/Inicio.jsx';
import Pacto from './pantallas/Pacto.jsx';
import Progreso from './pantallas/Progreso.jsx';
import Simulador from './pantallas/Simulador.jsx';
import Karma from './pantallas/Karma.jsx';
import EditorDia from './pantallas/EditorDia.jsx';
import Ajustes from './pantallas/Ajustes.jsx';
import Lore from './pantallas/Lore.jsx';
import { APARATO_POR_DEFECTO } from './mascota/TamagotchiPNG.jsx';
import { calcularEstado } from './engine/michi.js';
import { sincronizarPacto } from './engine/calculos.js';
import { hoyISO } from './engine/pacto.js';
import { podarCarino } from './engine/felicidad.js';
import { atender } from './engine/cuidados.js';
import { leer, guardar, reiniciar } from './datos/almacen.js';
import { useT } from './i18n/index.jsx';
import SelectorIdioma from './i18n/Selector.jsx';
import './estilos.css';

/* Iconos traídos de Michi Finanzas, para que las dos apps se sientan
   la misma casa. Simular no tiene icono propio todavía: lleva emoji.

   `logros` deja de ser una pestaña el 2026-09-19: Albert simplificó el
   menú de abajo y esa pantalla se fundió dentro de Progreso (una
   sección más, no una pantalla — ver `pantallas/Logros.jsx`). El hueco
   lo ocupa `ninja`, que no abre un `pestana` como los demás: abre la
   historia (`Lore.jsx`) a pantalla completa, igual que el botón que ya
   existía en Ajustes. Por eso lleva `abre: 'lore'` y no una pantalla
   propia — el nav de abajo lo trata aparte, ver donde se pintan los
   botones. */
const PESTANAS = [
  { id: 'inicio', img: '/iconos/inicio.png' },
  { id: 'pacto', img: '/iconos/pacto.png' },
  { id: 'progreso', img: '/iconos/progreso.png' },
  // — aquí va el "+" —
  { id: 'ninja', img: '/iconos/Ninja.png', abre: 'lore' },
  { id: 'simular', img: '/iconos/simular.png' },
  { id: 'karma', img: '/iconos/karma.png' },
];

function Icono({ p }) {
  return <img src={p.img} alt="" className={`mf-nav-ico ${p.id === 'ninja' ? 'mf-nav-ico-ninja' : ''}`} />;
}
/* Ajustes vive en la cabecera, no en la barra de abajo: así el menú
   queda despejado, como en Michi Finanzas. */

export default function App() {
  const t = useT();
  const [datos, setDatos] = useState(leer);

  /* La escala del texto vive en el :root, para que la hereden tambien los
     trozos que se pintan fuera de la pagina (modales, avisos). */
  useEffect(() => {
    document.documentElement.style.setProperty('--escala', datos.perfil?.escalaTexto ?? 1);
  }, [datos.perfil?.escalaTexto]);
  /* CUANTO TAPA EL TECLADO DEL MOVIL.

     La hoja de registrar va anclada abajo, que es donde llega el pulgar,
     y el teclado sale justo ahi: se escribian los pasos y el boton de
     guardar quedaba DEBAJO del teclado, sin manera de llegar a el. Lo
     vio Albert usandola en el movil.

     `visualViewport` es lo que ve el usuario de verdad; `innerHeight`
     sigue siendo la pagina entera. La diferencia es lo tapado. El
     `offsetTop` cuenta porque iOS ademas DESPLAZA la ventana hacia
     arriba al enfocar un campo.

     En Chrome de Android esto suele dar 0, y es correcto: alli el propio
     navegador encoge la pagina por el `interactive-widget` del meta de
     `index.html`, asi que no hay nada que compensar. Las dos medidas no
     se suman nunca.

     `scroll` ademas de `resize` porque en iOS el teclado no siempre
     dispara `resize`. Y no hay nada que limpiar si el navegador es viejo
     y no trae `visualViewport`: entonces la variable se queda en 0 y la
     hoja se comporta como siempre. */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;
    const medir = () => {
      const tapado = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--teclado', `${Math.round(tapado)}px`);
    };
    medir();
    vv.addEventListener('resize', medir);
    vv.addEventListener('scroll', medir);
    return () => {
      vv.removeEventListener('resize', medir);
      vv.removeEventListener('scroll', medir);
    };
  }, []);

  const [pestana, setPestana] = useState('inicio');
  /* `false` cerrado · `true` la hoja entera (el "+" de la barra) ·
     'comida' | 'entreno' | 'pasos' | 'sueno' un solo dato, que es lo
     que abre el anillo del aparato al aceptar un dato. */
  const [registrando, setRegistrando] = useState(false);
  /* Lo que apuntas, el michi lo hace: si registras comida se pone a
     comer, si registras entreno se pone a levantar pesas. La animación no
     inventa datos, es la misma información contada como cuidado. */
  const [accion, setAccion] = useState(null);   // 'comiendo' | 'entrenando' | 'celebrando'
  /* Panel de pruebas: siete toques seguidos en el logo. Es el truco de
     siempre para dejar una puerta de servicio sin ensuciar la pantalla.
     La cuenta se olvida si pasas más de un segundo y medio sin tocar,
     para que no se abra sola a base de toques sueltos. */
  const [pruebas, setPruebas] = useState(false);
  const toques = useRef({ n: 0, ultimo: 0 });
  const tocarLogo = () => {
    const ahora = Date.now();
    /* `cuenta`, no `t`: arriba hay una `t` que es el traductor, y
       llamar igual a las dos la tapaba dentro de esta funcion. */
    const cuenta = toques.current;
    cuenta.n = ahora - cuenta.ultimo > 1500 ? 1 : cuenta.n + 1;
    cuenta.ultimo = ahora;
    if (cuenta.n >= 7) {
      cuenta.n = 0;
      setPruebas((p) => !p);
      setPestana('inicio');
    }
  };

  /* La felicidad baja con las horas, así que hay que volver a pintarla
     cada tanto aunque el usuario no toque nada. */
  const [tic, setTic] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTic((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  /* `guardar` devuelve false si el navegador no deja escribir: ventana
     privada, almacenamiento lleno, cookies bloqueadas. Antes nadie miraba
     ese valor, asi que se podia pasar el dia apuntando peso y comidas
     para que al cerrar la pestaña no quedara nada. Ahora se dice.
     El `estado === nuevo ? estado : nuevo` es para que React no vuelva a
     pintar en cada guardado cuando no ha cambiado nada. */
  const [noGuarda, setNoGuarda] = useState(false);
  useEffect(() => {
    const fallo = !guardar(datos);
    setNoGuarda((antes) => (antes === fallo ? antes : fallo));
  }, [datos]);

  const listo = Boolean(datos.pacto && datos.perfil?.altura && datos.perfil?.pesoMeta);

  const estado = useMemo(
    () => (listo ? calcularEstado({ pacto: datos.pacto, entradas: datos.entradas,
                       perfil: datos.perfil, carino: datos.carino,
                       cuidados: datos.cuidados }) : null),
    [listo, datos.pacto, datos.entradas, datos.perfil, datos.carino, datos.cuidados, tic]
  );

  /* Registrar en cualquier fecha; `undefined` no pisa lo que ya había. */
  /* Subir de nivel es el único momento bueno de verdad que tenía la app
     y pasaba sin que se notara: cambiaba un número en el marcador. Ahora
     el michi lo celebra. Se recuerda el último nivel visto en el propio
     `datos`, no en un ref: si se guardase solo en memoria, cerrar la app
     y volver a abrirla dispararía la celebración otra vez. */
  useEffect(() => {
    if (!listo || !estado) return;
    const visto = datos.nivelVisto ?? estado.nivel.nivel;
    if (estado.nivel.nivel > visto) {
      setAccion('celebrando');
      setTimeout(() => setAccion((a) => (a === 'celebrando' ? null : a)), 8000);
    }
    if (estado.nivel.nivel !== visto) {
      setDatos((d) => ({ ...d, nivelVisto: estado.nivel.nivel }));
    }
  }, [listo, estado?.nivel?.nivel]);

  /* El saltito. Mimar, dar agua, limpiar o apuntar cualquier dato que no
     tenga ya su propia escena (comer, entrenar) responden con un brinco
     corto: es la confirmación de que el gesto ha llegado, sin inventar
     una escena nueva de las de `escenas.js` —usa la misma `celebrando`
     que ya existía para subir de nivel, solo que más breve—. Pedido por
     Albert el 2026-09-17: hasta ahora esos cuatro gestos no daban ninguna
     señal en el michi, solo cambiaban una barra o un dato. */
  const ACCION_BREVE_MS = 2600;
  const saltar = () => {
    setAccion('celebrando');
    setTimeout(() => setAccion((a) => (a === 'celebrando' ? null : a)), ACCION_BREVE_MS);
  };

  const registrarCarino = () => {
    setDatos((d) => ({ ...d, carino: podarCarino([...(d.carino ?? []), Date.now()]) }));
    saltar();
  };

  /* Llenar el cuenco o recoger la casa. No toca ningún dato del pacto:
     solo apunta cuándo se hizo. Ver `engine/cuidados.js`. */
  const cuidar = (que) => {
    setDatos((d) => ({ ...d, cuidados: atender(d.cuidados, que) }));
    saltar();
  };

  const registrar = (fecha, campos) => {
    if (fecha === hoyISO()) {
      /* El entreno manda sobre la comida: si apuntas las dos cosas de una
         vez, ver al michi con las mancuernas cuenta mejor el día. Lo que
         no es ni una cosa ni la otra —pasos, peso, sueño— salta en vez de
         quedarse sin respuesta. */
      const hace = campos.entrenoMin ? 'entrenando'
                 : campos.comidaKcal != null ? 'comiendo' : null;
      if (hace) {
        setAccion(hace);
        setTimeout(() => setAccion((a) => (a === hace ? null : a)), 4000);
      } else {
        saltar();
      }
    }
    setDatos((d) => {
      const limpio = Object.fromEntries(
        Object.entries(campos).filter(([, v]) => v !== undefined));
      const entradas = { ...d.entradas, [fecha]: { ...(d.entradas[fecha] ?? {}), ...limpio } };

      /* Si el peso que se acaba de guardar es el más reciente de
         todos —lo normal es que lo sea, salvo que estés corrigiendo un
         día antiguo—, se sincroniza `perfil.pesoActual`. Sin esto, el
         peso de Ajustes y el que arranca el Simulador se quedaban en
         lo que escribiste la primera vez, aunque llevaras semanas
         apuntando pesajes más nuevos en el calendario: la previsión
         de ahí partía de un peso viejo y salía más larga de lo que
         tocaba. Progreso no lo sufría porque ya calculaba su propio
         `pesoActual` a partir del último pesaje, no de `perfil` — esto
         hace que el resto de la app vea lo mismo que Progreso. */
      let perfil = d.perfil;
      if (limpio.peso != null) {
        const ultimaFecha = Object.keys(entradas)
          .filter((f) => entradas[f]?.peso != null).sort().pop();
        if (ultimaFecha === fecha) perfil = { ...perfil, pesoActual: limpio.peso };
      }

      return { ...d, entradas, perfil };
    });
  };


  /* Se enseña en las dos pantallas: al arrancar tambien se guarda, y
     empezar a rellenar la bienvenida sin que se guarde nada es peor. */
  const avisoGuardado = noGuarda && (
    <div className="mf-aviso" role="alert">⚠️ {t('avisos.noGuarda')}</div>
  );

  /* La historia de Ninja. Sale sola la PRIMERA vez, antes de pedir un
     solo dato: la queja que empezó todo el replanteamiento del michi
     era que nadie entendía para qué servía el gato, y la app no lo
     contaba en ninguna parte. Después queda a mano en Ajustes.

     Que ya se ha visto se guarda en los datos y no en memoria: si no,
     cerrar y abrir la app volvería a contar la historia entera. Es lo
     mismo que se hizo con `nivelVisto` y por la misma razón. */
  const [verLore, setVerLore] = useState(false);
  const cuentaLaHistoria = verLore || (!listo && !datos.loreVisto);
  const cerrarLore = () => {
    setVerLore(false);
    if (!datos.loreVisto) setDatos((d) => ({ ...d, loreVisto: true }));
  };

  if (cuentaLaHistoria) {
    return (
      <Lore onCerrar={cerrarLore} onAdoptar={!listo ? cerrarLore : null}
            /* Al cerrar la historia leida hasta el final, a Karma. */
            onKarma={() => { cerrarLore(); setPestana('karma'); }}
            aparato={datos.perfil?.aparato}
            /* El color se elige ANTES de que exista el perfil: la
               bienvenida viene después de la historia. No se pierde
               porque `onEmpezar` fusiona (`{...d.perfil, ...perfil}`) y
               el perfil que arma la bienvenida no trae `aparato`.

               Llega solo el campo que se ha tocado, y se fusiona aquí
               dentro contra `d`, no contra lo que Lore tuviera en las
               props: si no, dos toques seguidos antes de repintar leen
               los dos el mismo estado y el segundo borra al primero
               —elegir gato y huevo deprisa dejaba solo el huevo. */
            onAparato={(campos) =>
              setDatos((d) => ({
                ...d,
                perfil: {
                  ...d.perfil,
                  aparato: { ...APARATO_POR_DEFECTO, ...(d.perfil?.aparato ?? {}), ...campos },
                },
              }))
            } />
    );
  }

  if (!listo) {
    return (
      <div className="mf-app">
        <header className="mf-cabecera">
          <img className="mf-logo" src="/logo.png" alt=""
             onClick={tocarLogo} />
          <div className="mf-marca-txt">
            <h1>Michi<b>Fit</b></h1>
            <small>{t('marca.lema')}</small>
          </div>
          <div className="mf-cab-acciones"><SelectorIdioma /></div>
        </header>
        <main>
          {avisoGuardado}
          <Bienvenida
            aparato={datos.perfil?.aparato}
            onEmpezar={({ perfil, pacto }) =>
              setDatos((d) => ({ ...d, perfil: { ...d.perfil, ...perfil }, pacto }))
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="mf-app">
      <header className="mf-cabecera">
        <img className="mf-logo" src="/logo.png" alt=""
             onClick={tocarLogo} />
        <div className="mf-marca-txt">
          <h1>Michi<b>Fit</b></h1>
          <small>{t('marca.lema')}</small>
        </div>
        <div className="mf-cab-acciones">
          <div className="mf-racha">🔥 {estado.racha}</div>
          <SelectorIdioma />
          <button className={`mf-cab-boton mf-gear ${pestana === 'ajustes' ? 'activa' : ''}`}
                  onClick={() => setPestana(pestana === 'ajustes' ? 'inicio' : 'ajustes')}
                  aria-label={t('ajustes.titulo')}>⚙️</button>
        </div>
      </header>

      <main>
        {avisoGuardado}
        {pestana === 'inicio' && (
          <Inicio estado={estado} entradas={datos.entradas} pacto={datos.pacto}
                  aparato={datos.perfil?.aparato}
                  onCarino={registrarCarino} onCuidar={cuidar}
                  onMedir={(campo) => setRegistrando(campo)} accion={accion}
                  pruebas={pruebas} onCerrarPruebas={() => setPruebas(false)} />
        )}
        {pestana === 'pacto' && (
          <Pacto pacto={datos.pacto} perfil={datos.perfil} estado={estado}
                 onCambiar={(p) => setDatos((d) => ({ ...d, pacto: sincronizarPacto(p, d.perfil) }))}
                 /* Elegir objetivo escribe el deficit en el perfil, y el
                    pacto tiene que recalcularse con el: si no, las
                    calorias se quedarian con el objetivo anterior. */
                 onCambiarPerfil={(p) => setDatos((d) => ({
                   ...d, perfil: p, pacto: sincronizarPacto(d.pacto, p) }))} />
        )}
        {pestana === 'progreso' && (
          <Progreso perfil={datos.perfil} pacto={datos.pacto} entradas={datos.entradas}
                    onRegistrar={registrar} estado={estado} />
        )}
        {pestana === 'simular' && <Simulador perfil={datos.perfil} pacto={datos.pacto} />}
        {pestana === 'karma' && <Karma onSalir={() => setPestana('inicio')} />}
        {pestana === 'ajustes' && (
          <Ajustes perfil={datos.perfil} entradas={datos.entradas} pacto={datos.pacto}
                   onCambiar={(p) => setDatos((d) => ({
                     ...d, perfil: p, pacto: sincronizarPacto(d.pacto, p) }))}
                   onImportar={(entradas) => setDatos((d) => ({ ...d, entradas }))}
                   onReiniciar={() => setDatos(reiniciar())}
                   onVerLore={() => setVerLore(true)} />
        )}
      </main>

      <nav className="mf-nav">
        {PESTANAS.slice(0, 3).map((p) => (
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <Icono p={p} /><small>{t('nav.' + p.id)}</small>
          </button>
        ))}
        <button className="mf-mas" onClick={() => setRegistrando(true)}
                aria-label={t('nav.anadir')}>
          <img src="/iconos/mas.png" alt="" />
        </button>
        {PESTANAS.slice(3).map((p) => (
          /* `ninja` no tiene pantalla propia dentro de `pestana`: abre
             la historia entera, igual que el botón de Ajustes. Nunca
             sale «activa» a propósito —no hay un `pestana === 'ninja'`
             que lo sostenga, y en cuanto se toca ya se ha ido a otra
             pantalla—. */
          <button key={p.id}
                  className={p.abre !== 'lore' && pestana === p.id ? 'activa' : ''}
                  onClick={() => (p.abre === 'lore' ? setVerLore(true) : setPestana(p.id))}>
            <Icono p={p} /><small>{t('nav.' + p.id)}</small>
          </button>
        ))}
      </nav>

      {registrando && (
        <EditorDia
          fecha={hoyISO()} entrada={datos.entradas[hoyISO()] ?? {}} pacto={datos.pacto}
          solo={registrando === true ? null : registrando}
          onGuardar={(campos) => { registrar(hoyISO(), campos); setRegistrando(false); }}
          onCerrar={() => setRegistrando(false)}
        />
      )}
    </div>
  );
}
