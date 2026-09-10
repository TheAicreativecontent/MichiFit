/* Comprueba que la version de la cache del service worker no se ha
   quedado atras.

   El problema, que ya ocurrio de verdad: las imagenes de `public/michi`
   y `public/fondos` NO llevan hash en el nombre. El service worker las
   sirve desde la cache primero, asi que si cambia el contenido de
   `michi_triste.png` sin cambiar `CACHE`, quien ya tenga la app abierta
   sigue viendo el dibujo viejo PARA SIEMPRE. No hay error, no hay aviso:
   simplemente ve otra cosa que tu.

   Paso en septiembre de 2026 con los michis gris y blanco: se
   corrigieron dos veces (los ojos y los mofletes) y `CACHE` se quedo en
   v2 diez commits.

   La regla, entonces: si algo de esas carpetas cambio DESPUES del ultimo
   commit que toco `public/sw.js`, hay que subir el numero.

   Uso:  node pruebas/cache-sw.mjs        (desde la raiz)
*/
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/* Carpetas cuyas imagenes NO llevan hash en el nombre. Las de
   `dist/assets` si lo llevan y se apañan solas. */
const VIGILADAS = ['public/michi', 'public/fondos', 'public/iconos',
                   'public/iconos-app', 'public/karma'];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

let fallos = 0;
const comprobar = (ok, que) => {
  console.log('  %s %s', ok ? 'si ' : 'NO ', que);
  if (!ok) fallos++;
};

/* La version tiene que existir y tener forma de version. */
const sw = readFileSync('public/sw.js', 'utf8');
const version = sw.match(/const CACHE = '([^']+)'/)?.[1];
comprobar(Boolean(version), `public/sw.js declara una version (${version ?? 'ninguna'})`);
if (!version) process.exit(1);

/* Desde que commit no se toca el service worker. */
const commitSW = git('log', '-1', '--format=%H', '--', 'public/sw.js');
if (!commitSW) {
  console.log('\n  (sw.js aun no esta en ningun commit: nada que comparar)');
  process.exit(0);
}

/* Si sw.js esta modificado y sin commitear, la version se acaba de
   subir: no tiene sentido reprochar los cambios que venian de antes,
   que son justo los que se estan arreglando. */
const swSucio = git('status', '--porcelain', '--', 'public/sw.js') !== '';
if (swSucio) {
  console.log('\n  sw.js esta modificado sin commitear: se da por subida la version.');
  console.log('  (al commitear, la comparacion arranca desde ese commit)');
  console.log('\nBien: la cache va al dia.');
  process.exit(0);
}

console.log('\n  version de cache: %s', version);
console.log('  ultimo commit que toco sw.js: %s  %s',
  git('log', '-1', '--format=%h', '--', 'public/sw.js'),
  git('log', '-1', '--format=%s', '--', 'public/sw.js'));
console.log();

/* Que ha CAMBIADO de contenido en las carpetas vigiladas desde entonces.
   Solo importan las modificaciones (M): un archivo nuevo trae una URL
   nueva y la cache no lo tapa, y uno borrado tampoco molesta.

   Y hay que mirar COMMIT A COMMIT, no comparar los dos extremos. Un
   archivo que nace en un commit y se corrige en el siguiente sale como
   «anadido» si solo miras el principio y el final —- pero es justo el
   caso peligroso: quien abriera la app entre los dos se quedo con la
   version rota en la cache. La primera version de esta prueba comparaba
   extremos, veia 1 cambio donde habia 42, y habria dado por bueno el
   fallo que venia a cazar. */
const modificados = [...new Set(
  git('log', `${commitSW}..HEAD`, '--name-status', '--format=', '--', ...VIGILADAS)
    .split('\n')
    .filter((l) => l.startsWith('M\t'))
    .map((l) => l.split('\t')[1])
    .filter((f) => !/\.(txt|md)$/i.test(f))   // los LEEME no se sirven
)];

comprobar(modificados.length === 0,
  `ninguna imagen sin hash cambio despues de subir la cache (${modificados.length} cambiaron)`);
for (const f of modificados) console.log('       %s', f);

/* Y lo mismo con lo que esta sin commitear ahora mismo. */
const sucios = git('status', '--porcelain', '--', ...VIGILADAS)
  .split('\n')
  .filter(Boolean)
  .filter((l) => l.trim().startsWith('M'))
  .map((l) => l.slice(3))
  .filter((f) => !/\.(txt|md)$/i.test(f));

comprobar(sucios.length === 0,
  `ninguna imagen modificada sin commitear (${sucios.length} sueltas)`);
for (const f of sucios) console.log('       %s', f);

if (fallos) {
  console.log('\nFALLA: sube el numero de `const CACHE` en public/sw.js.');
  console.log('Si no, quien ya tenga la app instalada seguira viendo los dibujos viejos.');
} else {
  console.log('\nBien: la cache va al dia.');
}
process.exit(fallos ? 1 : 0);
