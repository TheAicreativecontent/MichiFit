/* ============================================================
   Pantalla "Ajustes"
   Portada de la MichiFit original, con los mismos campos y el mismo
   truco: si tienes reloj, tus medias reales mandan sobre la fórmula.
   ============================================================ */

import { useState } from 'react';
import { imc, tmb, reposoEfectivo, macros, avisosDeSeguridad, pesoParaIMC } from '../engine/calculos.js';
import { IMC_MINIMO_SANO } from '../engine/constantes.js';
import { aCSV, descargar } from '../datos/almacen.js';
import { leerCSV, fusionar } from '../datos/importar.js';
import { Titulo } from './Ayuda.jsx';

export default function Ajustes({ perfil, entradas, onCambiar, onReiniciar, onImportar }) {
  const set = (campo) => (e) => {
    const v = e.target.value;
    onCambiar({ ...perfil, [campo]: v === '' ? null : Number(v) });
  };

  const imcActual = imc(perfil.pesoActual ?? perfil.pesoInicial, perfil.altura);
  const imcMeta = imc(perfil.pesoMeta, perfil.altura);
  const reposo = reposoEfectivo(perfil);
  const estimado = tmb(perfil);
  const total = perfil.totalReal ?? (reposo ? Math.round(reposo * 1.15) : null);
  const paraPerder = total ? total - (perfil.deficitObjetivo ?? 500) : null;
  const m = paraPerder && perfil.pesoMeta
    ? macros({ kcal: paraPerder, pesoMeta: perfil.pesoMeta, proteinaPorKg: perfil.proteinaPorKg ?? 2 })
    : null;

  const avisos = avisosDeSeguridad({ perfil, comidaKcal: paraPerder, kgPorSemana: null });

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
        <p>
          Aquí van tus datos y tus objetivos. Si tienes reloj, pon tus medias
          reales de gasto: son más exactas que cualquier fórmula.
        </p>
        <p>
          Todo lo que apuntas se guarda <b>en este dispositivo</b>, no en
          ningún servidor. Descarga la copia en CSV de vez en cuando: si
          borras los datos del navegador, se van con ellos.
        </p>
      </>}>
        ⚙️ Ajustes
      </Titulo>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Sobre ti</h3>
        <Campo etiqueta="Edad" v={perfil.edad} on={set('edad')} />
        <Campo etiqueta="Altura" unidad="cm" v={perfil.altura} on={set('altura')} />
        <Campo etiqueta="Peso inicial" unidad="kg" v={perfil.pesoInicial} on={set('pesoInicial')} paso="0.1" />
        <Campo etiqueta="Peso actual" unidad="kg" v={perfil.pesoActual} on={set('pesoActual')} paso="0.1" />
        <Campo etiqueta="Peso meta" unidad="kg" v={perfil.pesoMeta} on={set('pesoMeta')} paso="0.1" />
        {imcActual && (
          <p className="mf-nota">
            IMC actual {imcActual.toFixed(1)}
            {imcMeta && <> · IMC meta {imcMeta.toFixed(1)}</>}. El rango saludable
            suele estar entre 18,5 y 25.
          </p>
        )}
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Tu gasto energético</h3>
        <p className="mf-nota">
          Si tienes reloj, pon aquí tus medias reales: son más exactas que
          cualquier fórmula. Si lo dejas vacío, lo estimo yo.
        </p>
        <Campo etiqueta="En reposo" unidad="kcal/día" v={perfil.reposoReal} on={set('reposoReal')}
               placeholder={estimado ? `estimado: ${estimado}` : ''} />
        <Campo etiqueta="Gasto total" unidad="kcal/día" v={perfil.totalReal} on={set('totalReal')} />
        <p className="mf-nota">
          En Garmin: Calorías quemadas → 4 sem. «Promedio en reposo» y «Media total».
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">Objetivos</h3>
        <Campo etiqueta="Déficit diario" unidad="kcal" v={perfil.deficitObjetivo} on={set('deficitObjetivo')} paso="50" />
        <Campo etiqueta="Proteína" unidad="g/kg meta" v={perfil.proteinaPorKg} on={set('proteinaPorKg')} paso="0.1" />
        <p className="mf-nota">500 kcal de déficit ≈ 0,5 kg por semana.</p>
      </div>

      {reposo && (
        <div className="mf-tarjeta mf-calculado">
          <h3 className="mf-h3">Tus objetivos calculados</h3>
          <Linea icono="😴" t="En reposo" v={`${reposo} kcal/día`} />
          <Linea icono="🔥" t="Gasto total (mantenimiento)" v={`${total} kcal/día`} />
          <Linea icono="🍙" t="Para perder" v={`${paraPerder} kcal/día`} />
          {m && (
            <Linea icono="🥗" t="Macros"
                   v={`${m.proteina}g proteína · ${m.carbos}g carbos · ${m.grasa}g grasa`} />
          )}
        </div>
      )}

      {avisos.map((a) => (
        <div key={a.tipo} className="mf-aviso">⚠️ {a.texto}</div>
      ))}

      {imcMeta != null && imcMeta < IMC_MINIMO_SANO && perfil.altura && (
        <div className="mf-aviso">
          Para tu altura, un IMC de {IMC_MINIMO_SANO} son{' '}
          {pesoParaIMC(IMC_MINIMO_SANO, perfil.altura).toFixed(1)} kg.
        </div>
      )}

      <Importador entradas={entradas} onImportar={onImportar} />

      <div className="mf-tarjeta">
        <button className="mf-boton" onClick={() => descargar('michifit.csv', aCSV(entradas))}>
          ⬇️ Descargar copia (CSV)
        </button>
        <button
          className="mf-boton peligro"
          onClick={() => {
            if (confirm('Esto borra todos tus datos y no se puede deshacer. ¿Seguro?')) onReiniciar();
          }}
        >
          🗑️ Reiniciar todos mis datos
        </button>
      </div>

      <p className="mf-pie">
        MichiFit es una herramienta de motivación, no consejo médico. Si tienes
        dudas de salud, consulta con un profesional. 💛
      </p>
    </div>
  );
}

/* --- traer el progreso de la MichiFit antigua ---
   Dos pasos a propósito: primero se lee el archivo y se enseña QUÉ va a
   entrar, y solo después se toca nada. Un import a ciegas sobre meses de
   datos da demasiado miedo como para pulsarlo. */
function Importador({ entradas, onImportar }) {
  const [previo, setPrevio] = useState(null);   // { entradas, resumen }
  const [hecho, setHecho] = useState(null);
  const [error, setError] = useState(null);

  const elegir = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';                        // permite reelegir el mismo
    if (!archivo) return;
    setError(null); setHecho(null);
    try {
      const leido = leerCSV(await archivo.text());
      if (!leido.resumen.ok) {
        setError(leido.resumen.aviso ?? 'No he encontrado ningún día con datos en ese archivo.');
        setPrevio(null);
        return;
      }
      setPrevio(leido);
    } catch {
      setError('No he podido leer el archivo. ¿Seguro que es un CSV?');
    }
  };

  const confirmar = () => {
    const r = fusionar(entradas, previo.entradas);
    onImportar(r.entradas);
    setHecho(r);
    setPrevio(null);
  };

  return (
    <div className="mf-tarjeta">
      <h3 className="mf-h3">📥 Traer datos de la MichiFit antigua</h3>
      <p className="mf-nota">
        Descarga el CSV desde la app antigua y súbelo aquí. Se traen peso,
        pasos, comida, macros y minutos de entreno. <b>Nunca pisa</b> lo que
        ya tengas apuntado: solo rellena huecos.
      </p>

      <label className="mf-boton comoBoton">
        📄 Elegir archivo CSV
        <input type="file" accept=".csv,text/csv" onChange={elegir} hidden />
      </label>

      {error && <div className="mf-aviso">⚠️ {error}</div>}

      {previo && (
        <div className="mf-aviso suave">
          <b>{previo.resumen.dias} días</b> con datos, del {previo.resumen.desde} al{' '}
          {previo.resumen.hasta} · {previo.resumen.pesos} pesadas.
          {previo.resumen.descartadas > 0 && (
            <> Se saltan {previo.resumen.descartadas} filas vacías.</>
          )}
          <div className="mf-hoja-pie" style={{ marginTop: 8 }}>
            <button className="mf-boton" onClick={() => setPrevio(null)}>Cancelar</button>
            <button className="mf-boton principal" onClick={confirmar}>Importar</button>
          </div>
        </div>
      )}

      {hecho && (
        <div className="mf-aviso suave">
          ✅ Listo: <b>{hecho.nuevos} días nuevos</b>
          {hecho.completados > 0 && <>, {hecho.completados} completados</>}
          {hecho.sinTocar > 0 && <>, {hecho.sinTocar} ya los tenías</>}.
        </div>
      )}

      <p className="mf-nota">
        La <b>puntuación de sueño</b> del reloj no se importa como horas
        dormidas: son cosas distintas y decir que dormiste 66 horas sería
        peor que no decir nada. Se guarda aparte, por si algún día sirve.
      </p>
    </div>
  );
}

function Campo({ etiqueta, unidad, v, on, paso = '1', placeholder }) {
  return (
    <label className="mf-campo">
      <span>{etiqueta}{unidad && <small> {unidad}</small>}</span>
      <input type="number" step={paso} value={v ?? ''} onChange={on} placeholder={placeholder} />
    </label>
  );
}

function Linea({ icono, t, v }) {
  return (
    <div className="mf-linea">
      <span>{icono} {t}</span>
      <b>{v}</b>
    </div>
  );
}
