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

const BUY_ME_A_COFFEE = 'https://www.buymeacoffee.com/MichiFinanzas';
const LIGHTNING_LNURL =
  'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhkcmmrv9kxxmmvwsmrxdfddcg';

export default function Karma() {
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
      <h2 className="mf-h2">{t('karma.titulo')}</h2>

      <div className="mf-tarjeta mf-karma-cabecera">
        <img src="/karma/corazon.png" alt="" width="90" height="84" />
        <b>{t('karma.gratis')}</b>
        <p className="mf-nota">
          {t('karma.intro')}
        </p>
      </div>

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
        <img src="/karma/michi_love.png" alt="" />
      </div>
    </div>
  );
}
