/* ============================================================
   Pantalla "Karma"
   Portada de Michi Finanzas. Misma cuenta de donaciones: Buy Me a
   Coffee y propinas por Bitcoin Lightning.

   Regla del proyecto: apoyar es voluntario y NO desbloquea nada. Ni
   michis, ni niveles, ni accesorios. La app entera es gratis y lo
   seguirá siendo — está en la filosofía desde el principio.
   ============================================================ */

import { useState } from 'react';

const BUY_ME_A_COFFEE = 'https://www.buymeacoffee.com/MichiFinanzas';
const LIGHTNING_LNURL =
  'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhkcmmrv9kxxmmvwsmrxdfddcg';

export default function Karma() {
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
      <h2 className="mf-h2">💌 Invítame a un café</h2>

      <div className="mf-tarjeta mf-karma-cabecera">
        <img src="/karma/corazon.png" alt="" width="90" height="84" />
        <b>MichiFit es gratis y siempre lo será</b>
        <p className="mf-nota">
          Si la app te ayuda a cuidarte, puedes invitarme a un café. No es
          obligatorio y no desbloquea nada: es solo una forma de decir
          gracias 💕
        </p>
      </div>

      <div className="mf-tarjeta mf-karma-bloque">
        <h3 className="mf-h3">☕ Buy Me a Coffee</h3>
        <p className="mf-nota" style={{ marginTop: 0 }}>
          Invítame a un café en un par de clics.
        </p>
        <a className="mf-boton-cafe" href={BUY_ME_A_COFFEE}
           target="_blank" rel="noopener noreferrer">
          ☕ Buy me a coffee
        </a>
      </div>

      <div className="mf-tarjeta mf-karma-bloque">
        <h3 className="mf-h3">⚡ Bitcoin Lightning</h3>
        <p className="mf-nota" style={{ marginTop: 0, marginBottom: 12 }}>
          Envía una propina en BTC al instante, sin comisiones, desde
          cualquier cartera Lightning.
        </p>

        {enMovil ? (
          <a className="mf-boton-rayo" href={`lightning:${LIGHTNING_LNURL}`}>
            ⚡ Abrir cartera Lightning
          </a>
        ) : (
          <>
            <p className="mf-nota" style={{ marginTop: 0, marginBottom: 10 }}>
              Escanea con tu cartera Lightning desde el móvil
            </p>
            <img className="mf-karma-qr" src="/karma/lightning_qr.png"
                 alt="Código QR para propina por Lightning" width="200" height="200" />
          </>
        )}

        <button className="mf-copiar" onClick={copiarLnurl}>
          {copiado ? 'Copiado ✓' : 'Copiar LNURL'}
        </button>
        <p className="mf-nota" style={{ fontSize: 11 }}>
          Compatible con Wallet of Satoshi, Phoenix, Muun y cualquier
          cartera LNURL.
        </p>
      </div>

      <div className="mf-karma-michi">
        <img src="/karma/michi_love.png" alt="" />
      </div>
    </div>
  );
}
