/* ============================================================
   Pantalla "Ajustes"
   Portada de la MichiFit original, con los mismos campos y el mismo
   truco: si tienes reloj, tus medias reales mandan sobre la fórmula.
   ============================================================ */

import { useState } from 'react';
import T from '../i18n/Texto.jsx';
import { useT } from '../i18n/index.jsx';
import { imc, tmb, reposoEfectivo, macros, avisosDeSeguridad, pesoParaIMC, planEnergetico } from '../engine/calculos.js';
import { IMC_MINIMO_SANO, DEFICIT_MAXIMO } from '../engine/constantes.js';
import { aCSV, descargar } from '../datos/almacen.js';
import { leerCSV, fusionar } from '../datos/importar.js';
import { Titulo } from './Ayuda.jsx';
import Hoja from './Hoja.jsx';
import { ESTILOS, COLORES, APARATO_POR_DEFECTO } from '../mascota/TamagotchiPNG.jsx';

export default function Ajustes({ perfil, entradas, pacto, onCambiar, onReiniciar, onImportar }) {
  const t = useT();
  const set = (campo) => (e) => {
    const v = e.target.value;
    onCambiar({ ...perfil, [campo]: v === '' ? null : Number(v) });
  };

  const imcActual = imc(perfil.pesoActual ?? perfil.pesoInicial, perfil.altura);
  const imcMeta = imc(perfil.pesoMeta, perfil.altura);
  const reposo = reposoEfectivo(perfil);
  const estimado = tmb(perfil);
  const plan = planEnergetico(perfil, pacto);
  const total = plan?.total ?? null;
  const paraPerder = plan?.comida ?? null;
  const m = paraPerder && perfil.pesoMeta
    ? macros({ kcal: paraPerder, pesoMeta: perfil.pesoMeta, proteinaPorKg: perfil.proteinaPorKg ?? 2 })
    : null;

  const avisos = avisosDeSeguridad({ perfil, comidaKcal: paraPerder, kgPorSemana: null });

  return (
    <div className="mf-pagina">
      <Titulo ayuda={<>
        <p>{t('ajustes.ayuda1')}</p>
        <T k="ajustes.ayuda2" />
      </>}>
        {t('ajustes.titulo')}
      </Titulo>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('ajustes.sobreTi')}</h3>
        <div className="mf-sexo">
          {['hombre', 'mujer'].map((sx) => (
            <button key={sx} className={(perfil.sexo ?? 'hombre') === sx ? 'sel' : ''}
                    onClick={() => onCambiar({ ...perfil, sexo: sx })}>
              {sx === 'hombre' ? t('comun.hombre') : t('comun.mujer')}
            </button>
          ))}
        </div>
        <Campo etiqueta={t('ajustes.edad')} v={perfil.edad} on={set('edad')} />
        <Campo etiqueta={t('ajustes.altura')} unidad={t('comun.cm')} v={perfil.altura} on={set('altura')} />
        <Campo etiqueta={t('ajustes.pesoInicial')} unidad={t('comun.kg')} v={perfil.pesoInicial} on={set('pesoInicial')} paso="0.1" />
        <Campo etiqueta={t('ajustes.pesoActual')} unidad={t('comun.kg')} v={perfil.pesoActual} on={set('pesoActual')} paso="0.1" />
        <Campo etiqueta={t('ajustes.pesoMeta')} unidad={t('comun.kg')} v={perfil.pesoMeta} on={set('pesoMeta')} paso="0.1" />
        {imcActual && (
          <p className="mf-nota">
            {imcMeta
              ? t('ajustes.imc', { actual: imcActual.toFixed(1), meta: imcMeta.toFixed(1) })
              : t('ajustes.imcSolo', { actual: imcActual.toFixed(1) })}
          </p>
        )}
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('aparato.titulo')}</h3>
        <Aparato perfil={perfil} onCambiar={onCambiar} />
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('ajustes.letra')}</h3>
        <div className="mf-escalas">
          {[{ v: 1, k: 'letraNormal' }, { v: 1.15, k: 'letraGrande' }, { v: 1.3, k: 'letraMuyGrande' }].map((o) => (
            <button key={o.v} className={(perfil.escalaTexto ?? 1) === o.v ? 'sel' : ''}
                    style={{ fontSize: `${12 * o.v}px` }}
                    onClick={() => onCambiar({ ...perfil, escalaTexto: o.v })}>
              {t('ajustes.' + o.k)}
            </button>
          ))}
        </div>
        <p className="mf-nota">
          {t('ajustes.letraNota')}
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('ajustes.gasto')}</h3>
        <p className="mf-nota">
          {t('ajustes.gastoNota')}
        </p>
        <Campo etiqueta={t('ajustes.enReposo')} unidad={t('comun.kcalDia')} v={perfil.reposoReal} on={set('reposoReal')}
               placeholder={estimado ? `≈ ${estimado}` : ''} />
        <Campo etiqueta={t('ajustes.gastoTotal')} unidad={t('comun.kcalDia')} v={perfil.totalReal} on={set('totalReal')} />
        <p className="mf-nota">
          {t('ajustes.garmin')}
        </p>
      </div>

      <div className="mf-tarjeta">
        <h3 className="mf-h3">{t('ajustes.objetivos')}</h3>
        <Campo etiqueta={t('ajustes.deficitDiario')} unidad={t('comun.kcal')} v={perfil.deficitObjetivo} on={set('deficitObjetivo')} paso="50" />
        <Campo etiqueta={t('ajustes.proteina')} unidad={t('ajustes.proteinaUnidad')} v={perfil.proteinaPorKg} on={set('proteinaPorKg')} paso="0.1" />
        <p className="mf-nota">
          {t('ajustes.deficitNota', { pct: Math.round(DEFICIT_MAXIMO * 100) })}
        </p>
      </div>

      {reposo && (
        <div className="mf-tarjeta mf-calculado">
          <h3 className="mf-h3">{t('ajustes.calculados')}</h3>
          <Linea icono="😴" t={t('ajustes.lineaReposo')} v={`${reposo} ${t('comun.kcalDia')}`} />
          <Linea icono="🔥" t={t('ajustes.lineaTotal')} v={`${total} ${t('comun.kcalDia')}`} />
          <Linea icono="🍙" t={t('ajustes.lineaPerder')} v={`${paraPerder} ${t('comun.kcalDia')}`} />
          {plan?.recorte === 'techo' && (
            <p className="mf-nota">
              {t('ajustes.recorteTecho', { pedido: plan.pedido, aplicado: plan.deficit })}
            </p>
          )}
          {plan?.recorte === 'suelo' && (
            <p className="mf-nota">
              {t('ajustes.recorteSuelo', { suelo: plan.suelo, aplicado: plan.deficit })}
            </p>
          )}
          {m && (
            <Linea icono="🥗" t={t('ajustes.lineaMacros')}
                   v={t('ajustes.macrosValor', { prot: m.proteina, carb: m.carbos, grasa: m.grasa })} />
          )}
        </div>
      )}

      {avisos.map((a) => (
        <div key={a.tipo} className="mf-aviso">⚠️ {t(a.clave, a.vars)}</div>
      ))}

      {imcMeta != null && imcMeta < IMC_MINIMO_SANO && perfil.altura && (
        <div className="mf-aviso">
          {t('ajustes.imcMeta', { imc: IMC_MINIMO_SANO,
             kg: pesoParaIMC(IMC_MINIMO_SANO, perfil.altura).toFixed(1) })}
        </div>
      )}

      <Importador entradas={entradas} onImportar={onImportar} />

      <div className="mf-tarjeta">
        <button className="mf-boton" onClick={() => descargar('michifit.csv', aCSV(entradas))}>
          {t('ajustes.descargar')}
        </button>
        <BorrarTodo entradas={entradas} onReiniciar={onReiniciar} />
      </div>

      <p className="mf-pie">
        {t('ajustes.pie')}
      </p>
    </div>
  );
}

/* --- la carcasa del michi ---
   Acabado y color. Las miniaturas son la imagen de verdad, no un
   cuadradito de color: se ve lo que eliges antes de elegirlo, y de paso
   el navegador va guardando las que miras. */
function Aparato({ perfil, onCambiar }) {
  const t = useT();
  const actual = { ...APARATO_POR_DEFECTO, ...(perfil.aparato ?? {}) };
  const poner = (campos) => onCambiar({ ...perfil, aparato: { ...actual, ...campos } });

  return (
    <>
      <p className="mf-sub" style={{ margin: '0 0 8px' }}>{t('aparato.acabado')}</p>
      <div className="mf-sexo">
        {ESTILOS.map((e) => (
          <button key={e} className={actual.estilo === e ? 'sel' : ''}
                  onClick={() => poner({ estilo: e })}>
            {t('aparato.' + e)}
          </button>
        ))}
      </div>

      <p className="mf-sub" style={{ margin: '14px 0 8px' }}>{t('aparato.color')}</p>
      <div className="mf-huevos">
        {COLORES.map((c) => (
          <button key={c} className={actual.color === c ? 'sel' : ''}
                  aria-label={t('aparato.colores.' + c)}
                  title={t('aparato.colores.' + c)}
                  onClick={() => poner({ color: c })}>
            <img src={`/michi/huevo-${actual.estilo}-${c}.png`} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <p className="mf-nota">{t('aparato.nota')}</p>
    </>
  );
}

/* --- borrar todos los datos ---
   Era un `confirm()` del navegador: un diálogo gris, con dos botones
   iguales, que se acepta sin leer. Para algo que borra meses de trabajo
   y no se puede deshacer, es poca cosa.

   El paso deliberado es escribir el NÚMERO de días que se pierden. No
   una palabra: un número, que se teclea igual en cualquier idioma y en
   cualquier teclado — «BORRAR» en un móvil tailandés es una trampa.
   Y de paso obliga a leer cuántos días son, que es justo la cifra que
   conviene tener delante antes de decidir.

   Si no hay nada apuntado no se pide nada: no tiene sentido poner
   fricción donde no hay nada que perder. */
function BorrarTodo({ entradas, onReiniciar }) {
  const t = useT();
  const [abierta, setAbierta] = useState(false);
  const [escrito, setEscrito] = useState('');
  const [copiaHecha, setCopiaHecha] = useState(false);

  const fechas = Object.keys(entradas).sort();
  const dias = fechas.length;
  const pesadas = Object.values(entradas).filter((e) => e.peso != null).length;
  const puede = dias === 0 || Number(escrito) === dias;

  const cerrar = () => { setAbierta(false); setEscrito(''); setCopiaHecha(false); };

  return (
    <>
      <button className="mf-boton peligro" onClick={() => setAbierta(true)}>
        {t('ajustes.reiniciar')}
      </button>

      {abierta && (
        <Hoja onCerrar={cerrar}>
          <h3 className="mf-h3">{t('borrar.titulo')}</h3>

          {dias > 0 ? (
            <>
              <T k="borrar.resumen" className="mf-nota"
                 vars={{ dias, desde: fechas[0], pesadas }} />
              <p className="mf-nota">{t('borrar.tambien')}</p>
            </>
          ) : (
            <p className="mf-nota">{t('borrar.sinDatos')}</p>
          )}

          <div className="mf-aviso">⚠️ {t('borrar.noSeDeshace')}</div>

          {/* La salida buena está antes que la mala, y más a mano. */}
          {dias > 0 && (
            <button className="mf-boton" onClick={() => {
              descargar('michifit.csv', aCSV(entradas));
              setCopiaHecha(true);
            }}>
              {copiaHecha ? t('borrar.descargada') : `⬇️ ${t('borrar.descarga')}`}
            </button>
          )}

          {dias > 0 && (
            <label className="mf-campo mf-campo-ancho">
              <T k="borrar.escribe" como="span" vars={{ dias }} />
              <input type="number" inputMode="numeric" value={escrito}
                     placeholder={t('borrar.ph', { dias })}
                     onChange={(e) => setEscrito(e.target.value)} />
            </label>
          )}

          <div className="mf-hoja-pie">
            <button className="mf-boton" onClick={cerrar}>{t('borrar.volver')}</button>
            <button className="mf-boton peligro" disabled={!puede}
                    onClick={() => { cerrar(); onReiniciar(); }}>
              {t('borrar.confirmar')}
            </button>
          </div>
        </Hoja>
      )}
    </>
  );
}

/* --- traer el progreso de la MichiFit antigua ---
   Dos pasos a propósito: primero se lee el archivo y se enseña QUÉ va a
   entrar, y solo después se toca nada. Un import a ciegas sobre meses de
   datos da demasiado miedo como para pulsarlo. */
function Importador({ entradas, onImportar }) {
  const t = useT();
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
        setError(leido.resumen.aviso ?? t('importar.sinDatos'));
        setPrevio(null);
        return;
      }
      setPrevio(leido);
    } catch {
      setError(t('importar.noLeido'));
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
      <h3 className="mf-h3">{t('importar.titulo')}</h3>
      <T k="importar.intro" className="mf-nota" />

      <label className="mf-boton comoBoton">
        {t('importar.elegir')}
        <input type="file" accept=".csv,text/csv" onChange={elegir} hidden />
      </label>

      {error && <div className="mf-aviso">⚠️ {error}</div>}

      {previo && (
        <div className="mf-aviso suave">
          <b>{t('importar.previoDias', { n: previo.resumen.dias })}</b>
          {t('importar.previoResto', { desde: previo.resumen.desde,
             hasta: previo.resumen.hasta, pesos: previo.resumen.pesos })}
          {previo.resumen.descartadas > 0 &&
            t('importar.previoDescartadas', { n: previo.resumen.descartadas })}
          <div className="mf-hoja-pie" style={{ marginTop: 8 }}>
            <button className="mf-boton" onClick={() => setPrevio(null)}>{t('comun.cancelar')}</button>
            <button className="mf-boton principal" onClick={confirmar}>{t('importar.importar')}</button>
          </div>
        </div>
      )}

      {hecho && (
        <div className="mf-aviso suave">
          ✅ <b>{t('importar.hechoNuevos', { n: hecho.nuevos })}</b>
          {hecho.completados > 0 && t('importar.hechoCompletados', { n: hecho.completados })}
          {hecho.sinTocar > 0 && t('importar.hechoSinTocar', { n: hecho.sinTocar })}.
        </div>
      )}

      <T k="importar.notaSueno" className="mf-nota" />
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
