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
  { id: 'ajustes', icono: '⚙️', t: 'Ajustes' },
];

export default function App() {
  const [datos, setDatos] = useState(leer);
  const [pestana, setPestana] = useState('inicio');

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

  const registrarHoy = (campos) =>
    setDatos((d) => ({
      ...d,
      entradas: {
        ...d.entradas,
        [hoyISO()]: { ...(d.entradas[hoyISO()] ?? {}), ...campos },
      },
    }));

  if (!listo) {
    return (
      <div className="mf-app">
        <header className="mf-cabecera">
          <div className="mf-marca">
            <h1>Michi<b>Fit</b></h1>
            <small>tu peso ideal, paso a pasito 🐾</small>
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
        <div className="mf-marca">
          <h1>Michi<b>Fit</b></h1>
          <small>tu peso ideal, paso a pasito 🐾</small>
        </div>
        <div className="mf-racha">🔥 {estado.racha}</div>
      </header>

      <main>
        {pestana === 'inicio' && (
          <Inicio estado={estado} entradas={datos.entradas} pacto={datos.pacto}
                  onRegistrar={registrarHoy} />
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
        {PESTANAS.map((p) => (
          <button key={p.id}
                  className={pestana === p.id ? 'activa' : ''}
                  onClick={() => setPestana(p.id)}>
            <span>{p.icono}</span>
            <small>{p.t}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
