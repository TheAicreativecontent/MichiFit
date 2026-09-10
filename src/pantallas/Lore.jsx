/* ============================================================
   La historia de Ninja

   Esto existe por la queja que trajo todo el replanteamiento del michi:
   varias personas probaron la app y dijeron lo mismo sin ponerse de
   acuerdo, **no entendían para qué servía el gato**. Se arregló lo que
   el michi refleja (`MECANICA.md` §5) y se le puso nombre e historia
   (`LORE.md`), pero la app no lo contaba en ninguna parte. Un gato que
   no se presenta es un adorno.

   Seis actos, uno por pantalla, dos frases cada uno. El texto está en
   el diccionario (`lore.actos`), así que se traduce como todo lo demás.

   LAS ILUSTRACIONES son de momento el propio michi sobre los
   escenarios que ya existen, en GRIS, que es el color de Ninja en el
   lore. No son las viñetas del cómic: esas están escritas como prompts
   pero sin generar. Cuando existan, se cambia `ESCENAS` de abajo por
   las rutas de las viñetas y no hay que tocar nada más.

   Se enseña en el primer arranque, antes de pedir ningún dato, y queda
   siempre a mano en Ajustes.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n/index.jsx';
import { NINJA, esVideo, rutaNinja } from '../datos/ninja.js';

/* Qué se ve en cada acto. El michi va en gris porque Ninja es gris; el
   naranja y el blanco son otros gatos (ver LORE.md).

   `oscuro` marca los dos actos duros —el escobazo y el veneno—: la
   escena se apaga y se tiñe de azul en vez de enseñar nada explícito.
   Es la misma decisión de tono que el cómic: del agresor solo la
   sombra, y del envenenamiento no se ve nada. */
const ESCENAS = [
  { michi: '/michi/michi-gris.png',            fondo: '/fondos/calle.png' },
  { michi: '/michi/michi_triste-gris.png',     fondo: '/fondos/calle.png', oscuro: true },
  { michi: '/michi/michi_comiendo-gris.png',   fondo: '/fondos/calle.png' },
  { michi: '/michi/michi_durmiendo-gris.png',  fondo: '/fondos/calle.png', oscuro: true },
  { michi: '/michi/michi_cansado-gris.png',    fondo: '/fondos/casa.png' },
  { michi: '/michi/michi_contento-gris.png',   fondo: '/fondos/casa.png' },
];

export default function Lore({ onCerrar, onAdoptar }) {
  const t = useT();
  const actos = t('lore.actos');
  const total = Array.isArray(actos) ? actos.length : 0;
  /* Una pantalla más que actos: la última es la del Ninja de verdad. */
  const ultima = total;
  const [i, setI] = useState(0);
  const caja = useRef(null);

  /* Al cambiar de acto, el texto vuelve arriba: si no, en un móvil
     estrecho el acto siguiente empieza a media frase. */
  useEffect(() => { caja.current?.scrollTo?.(0, 0); }, [i]);

  /* Flechas del teclado: es una historia paginada, y en un ordenador se
     espera que funcionen. */
  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'ArrowRight') setI((v) => Math.min(ultima, v + 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [ultima]);

  /* Arrastrar con el dedo, que es como se pasa una historia en el móvil.
     Solo cuenta si el gesto es claramente horizontal: si no, se comería
     el desplazamiento vertical del texto largo. */
  const toque = useRef(null);
  const empieza = (e) => {
    const p = e.touches?.[0];
    toque.current = p ? { x: p.clientX, y: p.clientY } : null;
  };
  const acaba = (e) => {
    const a = toque.current;
    const p = e.changedTouches?.[0];
    toque.current = null;
    if (!a || !p) return;
    const dx = p.clientX - a.x;
    const dy = p.clientY - a.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setI((v) => (dx < 0 ? Math.min(ultima, v + 1) : Math.max(0, v - 1)));
  };

  const enElFinal = i === ultima;
  const escena = ESCENAS[Math.min(i, ESCENAS.length - 1)];
  const acto = !enElFinal && Array.isArray(actos) ? actos[i] : null;

  return (
    <div className="mf-lore" onTouchStart={empieza} onTouchEnd={acaba}>
      <header className="mf-lore-cab">
        <div>
          <b>{t('lore.titulo')}</b>
          <small>{t('lore.subtitulo')}</small>
        </div>
        <button className="mf-lore-saltar" onClick={onCerrar}>
          {t('lore.saltar')}
        </button>
      </header>

      {!enElFinal ? (
        <div className={`mf-lore-vineta ${escena.oscuro ? 'oscura' : ''}`}>
          <img className="fondo" src={escena.fondo} alt="" />
          <img className="michi" src={escena.michi} alt="" />
          {escena.oscuro && <div className="lluvia" aria-hidden="true" />}
        </div>
      ) : (
        <div className="mf-lore-real">
          {NINJA.length > 0 ? (
            <div className="galeria">
              {NINJA.map((m) => (
                <figure key={m.archivo}>
                  {esVideo(m.archivo)
                    ? <video src={rutaNinja(m.archivo)} controls playsInline preload="metadata" />
                    : <img src={rutaNinja(m.archivo)} alt={m.pie ?? ''} loading="lazy" />}
                  {m.pie && <figcaption>{m.pie}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            /* Sin fotos todavía. Se enseña el michi contento en vez de
               un hueco vacío: la pantalla tiene que funcionar igual el
               día que Alberto aún no haya subido nada. */
            <div className="sinFotos">
              <img src="/michi/michi_contento-gris.png" alt="" />
              <small>{t('lore.sinFotos')}</small>
            </div>
          )}
        </div>
      )}

      <div className="mf-lore-texto" ref={caja}>
        {enElFinal ? (
          <>
            <h3>{t('lore.realTitulo')}</h3>
            <p>{t('lore.realTexto')}</p>
          </>
        ) : (
          <>
            <h3><span className="num">{i + 1}</span> {acto?.t}</h3>
            <p>{acto?.d}</p>
          </>
        )}
      </div>

      <div className="mf-lore-pie">
        <button className="mf-boton" disabled={i === 0}
                onClick={() => setI((v) => Math.max(0, v - 1))}>
          {t('lore.atras')}
        </button>

        <div className="mf-lore-puntos" aria-hidden="true">
          {Array.from({ length: ultima + 1 }, (_, n) => (
            <i key={n} className={n === i ? 'on' : ''} />
          ))}
        </div>

        {enElFinal ? (
          <button className="mf-boton principal"
                  onClick={() => (onAdoptar ?? onCerrar)?.()}>
            {onAdoptar ? t('lore.adoptar') : t('comun.cerrar')}
          </button>
        ) : (
          <button className="mf-boton principal" onClick={() => setI((v) => v + 1)}>
            {t('lore.seguir')}
          </button>
        )}
      </div>
    </div>
  );
}
