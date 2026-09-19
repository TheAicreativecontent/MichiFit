/* ============================================================
   Pantalla "Karma"
   Portada de Michi Finanzas. Misma cuenta de donaciones: Buy Me a
   Coffee y propinas por Bitcoin Lightning.

   Regla del proyecto: apoyar es voluntario y NO desbloquea nada. Ni
   michis, ni niveles, ni accesorios. La app entera es gratis y lo
   seguirá siendo — está en la filosofía desde el principio.
   ============================================================ */

import { useState } from 'react';
import { useT } from '../i18n/index.jsx';
import { ACTIVO as PROMPTPAY, QR as PROMPTPAY_QR } from '../datos/promptpay.js';

const BUY_ME_A_COFFEE = 'https://www.buymeacoffee.com/MichiFinanzas';
const LIGHTNING_LNURL =
  'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhkcmmrv9kxxmmvwsmrxdfddcg';

export default function Karma({ onSalir }) {
  const t = useT();
  const [copiado, setCopiado] = useState(false);

  // En el móvil el enlace `lightning:` abre la cartera directamente;
  // en el ordenador no hay cartera que abrir, así que se enseña el QR.
  const enMovil =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const copiarLnurl = async () => {
    try {
      await navigator.clipboard.writeText(LIGHTNING_LNURL);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS): se selecciona a mano.
      setCopiado(false);
    }
  };

  return (
    <div className="mf-pagina">
      {/* «Salir» arriba y abajo (Albert, 2026-09-19): a Karma se llega
          tambien desde el final del comic, y quien aun no sabe que hay un
          menu abajo no tiene otra forma de irse. Arriba se ve sin hacer
          scroll; abajo esta donde acaba quien ha leido hasta el final. */}
      <div className="mf-karma-titulo">
        <h2 className="mf-h2">{t('karma.titulo')}</h2>
        {onSalir && (
          <button className="mf-karma-salir" onClick={onSalir}>{t('karma.salir')}</button>
        )}
      </div>

      <div className="mf-tarjeta mf-karma-cabecera">
        <img src="/karma/corazon.png" alt="" width="90" height="84" />
        <b>{t('karma.gratis')}</b>
        <p className="mf-nota">
          {t('karma.intro')}
        </p>
      </div>

      {/* PromptPay va PRIMERO desde el 2026-09-19 (Albert): es la cuenta
          de su pareja, que quiso poner su QR para los donativos. Antes iba
          despues de los otros dos porque estos funcionan en todo el mundo
          y este solo dentro de Tailandia; sigue siendo verdad, y por eso
          el texto dice «si estas en Tailandia». El QR es una imagen
          estatica —ni API, ni backend— y se ve tambien en el movil, que
          es justo donde se escanea. Ver `datos/promptpay.js`.

          Sin boton de «abrir el banco»: alli no hay un esquema de URL
          comun, cada banco lleva el suyo. */}
      {PROMPTPAY && (
        <div className="mf-tarjeta mf-karma-bloque">
          <h3 className="mf-h3">{t('karma.promptpayTitulo')}</h3>
          <p className="mf-nota" style={{ marginTop: 0, marginBottom: 12 }}>
            {t('karma.promptpayIntro')}
          </p>
          <img className="mf-karma-qr promptpay" src={PROMPTPAY_QR}
               alt={t('karma.promptpayQrAlt')} width="240" height="292" />
          <p className="mf-nota" style={{ fontSize: 11 }}>
            {t('karma.promptpayCompatible')}
          </p>
        </div>
      )}

      <div className="mf-tarjeta mf-karma-bloque">
        <h3 className="mf-h3">{t('karma.cafeTitulo')}</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          {t('karma.cafeIntro')}
        </p>
        <a className="mf-boton-cafe" href={BUY_ME_A_COFFEE}
           target="_blank" rel="noopener noreferrer">
          {t('karma.cafeBoton')}
        </a>
      </div>

      <div className="mf-tarjeta mf-karma-bloque">
        <h3 className="mf-h3">{t('karma.rayoTitulo')}</h3>
        <p className="mf-nota" style={{ marginTop: 0, marginBottom: 12 }}>
          {t('karma.rayoIntro')}
        </p>

        {enMovil ? (
          <a className="mf-boton-rayo" href={`lightning:${LIGHTNING_LNURL}`}>
            {t('karma.rayoBoton')}
          </a>
        ) : (
          <>
            <p className="mf-nota" style={{ marginTop: 0, marginBottom: 10 }}>
              {t('karma.rayoEscanea')}
            </p>
            <img className="mf-karma-qr" src="/karma/lightning_qr.png"
                 alt={t('karma.rayoQrAlt')} width="200" height="200" />
          </>
        )}

        <button className="mf-copiar" onClick={copiarLnurl}>
          {copiado ? t('karma.copiado') : t('karma.copiar')}
        </button>
        <p className="mf-nota" style={{ fontSize: 11 }}>
          {t('karma.compatible')}
        </p>
      </div>

      <div className="mf-karma-michi">
        <img src="/karma/ninja_khob_khun_krup.jpg" alt="Khob khun krup" />
      </div>

      {onSalir && (
        <button className="mf-boton mf-karma-salir-pie" onClick={onSalir}>
          {t('karma.salir')}
        </button>
      )}
    </div>
  );
}
