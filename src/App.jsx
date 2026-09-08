/* ============================================================
   MichiFit · armazón de la app
   App pública: no trae datos de nadie dentro. Todo empieza a cero y
   cada usuario rellena lo suyo, que se queda en su dispositivo.
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import Bienvenida from './pantallas/Bienvenida.jsx';
import Inicio from './pantallas/Inicio.jsx';
import Pacto from './pantallas/Pacto.jsx';
import Progreso from './pantallas/Progreso.jsx';
import Simulador from './pantallas/Simulador.jsx';
import Karma from './pantallas/Karma.jsx';
import EditorDia from './pantallas/EditorDia.jsx';
import Ajustes from './pantallas/Ajustes.jsx';
import { calcularEstado } from './engine/michi.js';
import { hoyISO } from './engine/pacto.js';
import { leer, guardar, reiniciar } from './datos/almacen.js';
import './estilos.css';

const PESTANAS = [
  { id: 'inicio', icono: '🏠', t: 'Inicio' },
  { id: 'pacto', icono: '🤝', t: 'Mi pacto' },
  { id: 'progreso', icono: '📈', t: 'Progreso' },
  { id: 'simular', icono: '🎯', t: 'Simular' },
  { id: 'karma', icono: '💌', t: 'Karma' },
];
/* Ajustes vive en la cabecera, no en la barra de abajo: así el menú
   queda despejado, como en Michi Finanzas. */

export default function App() {
  const [datos, setDatos] = useState(leer);
  const [pestana, setPestana] = useState('inicio');
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => { guardar(datos); }, [datos]);

  const listo = Boolean(datos.pacto && datos.perfil?.altura && datos.perfil?.pesoMeta);

  const estado = useMemo(
    () => (listo ? calcularEstado({ pacto: datos.pacto, entradas: datos.entradas }) : null),
    [listo, datos.pacto, datos.entradas]
  );

  /* Registrar en cualquier fecha; `undefined` no pisa lo que ya había. */
  const registrar = (fecha, campos) =>
    setDatos((d) => {
      const limpio = Object.fromEntries(
        Object.entries(campos).filter(([, v]) => v !== undefined));
      return {
        ...d,
        entradas: { ...d.entradas, [fecha]: { ...(d.entradas[fecha] ?? {}), ...limpio } },
      };
    });


  if (!listo) {
    return (
      <div className="mf-app">
        <header className="mf-cabecera">
          <img className="mf-logo" src="/logo.png" alt="" />
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
        <img className="mf-logo" src="/logo.png" alt="" />
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
          <Inicio estado={estado} entradas={datos.entradas} pacto={datos.pacto} />
        )}
        {pestana === 'pacto' && (
          <Pacto pacto={datos.pacto} perfil={datos.perfil} estado={estado}
                 onCambiar={(p) => setDatos((d) => ({ ...d, pacto: p }))} />
        )}
        {pestana === 'progreso' && (
          <Progreso perfil={datos.perfil} pacto={datos.pacto} entradas={datos.entradas}
                    onRegistrar={registrar} />
        )}
        {pestana === 'simular' && <Simulador perfil={datos.perfil} pacto={datos.pacto} />}
        {pestana === 'karma' && <Karma />}
        {pestana === 'ajustes' && (
          <Ajustes perfil={datos.perfil} entradas={datos.entradas}
                   onCambiar={(p) => setDatos((d) => ({ ...d, perfil: p }))}
                   onReiniciar={() => setDatos(reiniciar())} />
        )}
      </main>

      <nav className="mf-nav">
        {PESTANAS.slice(0, 2).map((p) => (
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <span>{p.icono}</span><small>{p.t}</small>
          </button>
        ))}
        <button className="mf-mas" onClick={() => setRegistrando(true)}
                aria-label="Registrar de hoy">+</button>
        {PESTANAS.slice(2).map((p) => (
          <button key={p.id} className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <span>{p.icono}</span><small>{p.t}</small>
          </button>
        ))}
      </nav>

      {registrando && (
        <EditorDia
          fecha={hoyISO()} entrada={datos.entradas[hoyISO()] ?? {}}
          onGuardar={(campos) => { registrar(hoyISO(), campos); setRegistrando(false); }}
          onCerrar={() => setRegistrando(false)}
        />
      )}
    </div>
  );
}
