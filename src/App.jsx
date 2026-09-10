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
import Logros from './pantallas/Logros.jsx';
import Karma from './pantallas/Karma.jsx';
import EditorDia from './pantallas/EditorDia.jsx';
import Ajustes from './pantallas/Ajustes.jsx';
import Lore from './pantallas/Lore.jsx';
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
   la misma casa. Simular no tiene icono propio todavía: lleva emoji. */
const PESTANAS = [
  { id: 'inicio', img: '/iconos/inicio.png' },
  { id: 'pacto', img: '/iconos/pacto.png' },
  { id: 'progreso', img: '/iconos/progreso.png' },
  // — aquí va el "+" —
  { id: 'logros', img: '/iconos/logros.png' },
  { id: 'simular', img: '/iconos/simular.png' },
  { id: 'karma', img: '/iconos/karma.png' },
];

function Icono({ p }) {
  return <img src={p.img} alt="" className="mf-nav-ico" />;
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
  const [pestana, setPestana] = useState('inicio');
  /* `false` cerrado · `true` la hoja entera (el "+" de la barra) ·
     'comida' | 'entreno' | 'pasos' | 'sueno' un solo dato, que es lo
     que abre el anillo de medir del aparato. */
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

  const registrarCarino = () =>
    setDatos((d) => ({ ...d, carino: podarCarino([...(d.carino ?? []), Date.now()]) }));

  /* Llenar el cuenco o recoger la casa. No toca ningún dato del pacto:
     solo apunta cuándo se hizo. Ver `engine/cuidados.js`. */
  const cuidar = (que) =>
    setDatos((d) => ({ ...d, cuidados: atender(d.cuidados, que) }));

  const registrar = (fecha, campos) => {
    if (fecha === hoyISO()) {
      /* El entreno manda sobre la comida: si apuntas las dos cosas de una
         vez, ver al michi con las mancuernas cuenta mejor el día. */
      const hace = campos.entrenoMin ? 'entrenando'
                 : campos.comidaKcal != null ? 'comiendo' : null;
      if (hace) {
        setAccion(hace);
        setTimeout(() => setAccion((a) => (a === hace ? null : a)), 4000);
      }
    }
    setDatos((d) => {
      const limpio = Object.fromEntries(
        Object.entries(campos).filter(([, v]) => v !== undefined));
      return {
        ...d,
        entradas: { ...d.entradas, [fecha]: { ...(d.entradas[fecha] ?? {}), ...limpio } },
      };
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
    return <Lore onCerrar={cerrarLore} onAdoptar={!listo ? cerrarLore : null} />;
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
        {pestana === 'logros' && <Logros estado={estado} />}
        {pestana === 'progreso' && (
          <Progreso perfil={datos.perfil} pacto={datos.pacto} entradas={datos.entradas}
                    onRegistrar={registrar} />
        )}
        {pestana === 'simular' && <Simulador perfil={datos.perfil} pacto={datos.pacto} />}
        {pestana === 'karma' && <Karma />}
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
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
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
