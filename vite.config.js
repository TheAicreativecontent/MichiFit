import { readFileSync } from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/* La version sale de `package.json` y entra en el codigo al compilar.

   Escrita a mano en un archivo del codigo se queda vieja el dia que a
   nadie se le ocurra cambiarla en los dos sitios, y entonces la app
   MIENTE sobre que version es — que es exactamente el problema que se
   vino a resolver el 2026-09-14. Asi solo hay un sitio donde tocarla.

   `readFileSync` y no `import ... with { type: 'json' }` porque esto lo
   lee Node al arrancar Vite, y el import de JSON con atributos aun
   avisa por consola segun la version. Leer un archivo y parsearlo
   funciona en todas y no hay que volver a mirarlo. */
const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __VERSION__: JSON.stringify(version),
  },
})
