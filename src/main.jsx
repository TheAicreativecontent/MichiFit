import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProveedorIdioma } from './i18n/index.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveedorIdioma>
      <App />
    </ProveedorIdioma>
  </StrictMode>
);

/* Service worker: hace que la app se abra sin cobertura y se pueda
   instalar en la pantalla de inicio. Solo en producción — en desarrollo
   se quedaría sirviendo módulos viejos y volvería loco a cualquiera.

   Si falla, no pasa nada: la app funciona igual, solo que necesitando
   red para arrancar. */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
