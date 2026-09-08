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
import { calcularEstado } from './engine/michi.js';
import { hoyISO } from './engine/pacto.js';
import { podarCarino } from './engine/felicidad.js';
import { leer, guardar, reiniciar } from './datos/almacen.js';
import './estilos.css';

/* Iconos traídos de Michi Finanzas, para que las dos apps se sientan
   la misma casa. Simular no tiene icono propio todavía: lleva emoji. */
const PESTANAS = [
  { id: 'inicio', img: '/iconos/inicio.png', t: 'Inicio' },
  { id: 'pacto', img: '/iconos/pacto.png', t: 'Mi pacto' },
  { id: 'progreso', img: '/iconos/progreso.png', t: 'Progreso' },
  // — aquí va el "+" —
  { id: 'logros', img: '/iconos/logros.png', t: 'Logros' },
  { id: 'simular', img: '/iconos/simular.png', t: 'Simular' },
  { id: 'karma', img: '/iconos/karma.png', t: 'Karma' },
];

function Icono({ p }) {
  return <img src={p.img} alt="" className="mf-nav-ico" />;
}
/* Ajustes vive en la cabecera, no en la barra de abajo: así el menú
   queda despejado, como en Michi Finanzas. */

export default function App() {
  const [datos, setDatos] = useState(leer);
  const [pestana, setPestana] = useState('inicio');
  const [registrando, setRegistrando] = useState(false);
  /* Lo que apuntas, el michi lo hace: si registras comida se pone a
     comer, si registras entreno se pone a levantar pesas. La animación no
     inventa datos, es la misma información contada como cuidado. */
  const [accion, setAccion] = useState(null);   // 'comiendo' | 'entrenando'
  /* Panel de pruebas: siete toques seguidos en el logo. Es el truco de
     siempre para dejar una puerta de servicio sin ensuciar la pantalla.
     La cuenta se olvida si pasas más de un segundo y medio sin tocar,
     para que no se abra sola a base de toques sueltos. */
  const [pruebas, setPruebas] = useState(false);
  const toques = useRef({ n: 0, ultimo: 0 });
  const tocarLogo = () => {
    const ahora = Date.now();
    const t = toques.current;
    t.n = ahora - t.ultimo > 1500 ? 1 : t.n + 1;
    t.ultimo = ahora;
    if (t.n >= 7) {
      t.n = 0;
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

  useEffect(() => { guardar(datos); }, [datos]);

  const listo = Boolean(datos.pacto && datos.perfil?.altura && datos.perfil?.pesoMeta);

  const estado = useMemo(
    () => (listo ? calcularEstado({ pacto: datos.pacto, entradas: datos.entradas,
                       perfil: datos.perfil, carino: datos.carino }) : null),
    [listo, datos.pacto, datos.entradas, datos.perfil, datos.carino, tic]
  );

  /* Registrar en cualquier fecha; `undefined` no pisa lo que ya había. */
  const registrarCarino = () =>
    setDatos((d) => ({ ...d, carino: podarCarino([...(d.carino ?? []), Date.now()]) }));

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


  if (!listo) {
    return (
      <div className="mf-app">
        <header className="mf-cabecera">
          <img className="mf-logo" src="/logo.png" alt=""
             onClick={tocarLogo} />
          <div className="mf-marca-txt">
            <h1>Michi<b>Fit</b></h1>
            <small>tu peso ideal, paso a pasito, suave suavecito 🐾</small>
          </div>
        </header>
        <main>
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
          <small>tu peso ideal, paso a pasito, suave suavecito 🐾</small>
        </div>
        <div className="mf-cab-acciones">
          <div className="mf-racha">🔥 {estado.racha}</div>
          <button className={`mf-gear ${pestana === 'ajustes' ? 'activa' : ''}`}
                  onClick={() => setPestana(pestana === 'ajustes' ? 'inicio' : 'ajustes')}
                  aria-label="Ajustes">⚙️</button>
        </div>
      </header>

      <main>
        {pestana === 'inicio' && (
          <Inicio estado={estado} entradas={datos.entradas} pacto={datos.pacto}
                  onCarino={registrarCarino} accion={accion}
                  pruebas={pruebas} onCerrarPruebas={() => setPruebas(false)} />
        )}
        {pestana === 'pacto' && (
          <Pacto pacto={datos.pacto} perfil={datos.perfil} estado={estado}
                 onCambiar={(p) => setDatos((d) => ({ ...d, pacto: p }))} />
        )}
        {pestana === 'logros' && <Logros estado={estado} />}
        {pestana === 'progreso' && (
          <Progreso perfil={datos.perfil} pacto={datos.pacto} entradas={datos.entradas}
                    onRegistrar={registrar} />
        )}
        {pestana === 'simular' && <Simulador perfil={datos.perfil} pacto={datos.pacto} />}
        {pestana === 'karma' && <Karma />}
        {pestana === 'ajustes' && (
          <Ajustes perfil={datos.perfil} entradas={datos.entradas}
                   onCambiar={(p) => setDatos((d) => ({ ...d, perfil: p }))}
                   onImportar={(entradas) => setDatos((d) => ({ ...d, entradas }))}
                   onReiniciar={() => setDatos(reiniciar())} />
        )}
      </main>

      <nav className="mf-nav">
        {PESTANAS.slice(0, 3).map((p) => (
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <Icono p={p} /><small>{p.t}</small>
          </button>
        ))}
        <button className="mf-mas" onClick={() => setRegistrando(true)}
                aria-label="Registrar de hoy">
          <img src="/iconos/mas.png" alt="" />
        </button>
        {PESTANAS.slice(3).map((p) => (
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <Icono p={p} /><small>{p.t}</small>
          </button>
        ))}
      </nav>

      {registrando && (
        <EditorDia
          fecha={hoyISO()} entrada={datos.entradas[hoyISO()] ?? {}} pacto={datos.pacto}
          onGuardar={(campos) => { registrar(hoyISO(), campos); setRegistrando(false); }}
          onCerrar={() => setRegistrando(false)}
        />
      )}
    </div>
  );
}
