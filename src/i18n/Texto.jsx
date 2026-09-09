/* ============================================================
   Texto traducido con negritas
   Varias ayudas llevan <b> o <em> dentro de la frase, y el sitio de
   esas marcas cambia con el idioma: no se pueden partir en trozos.

   Se resolvia con `dangerouslySetInnerHTML`, y funcionaba, porque lo
   que entra son cadenas del diccionario. Pero eran catorce sitios
   abiertos: bastaba que alguien pasara un dia una variable con texto
   del usuario para tener un XSS. Aqui el HTML no se ejecuta nunca —
   se buscan <b> y <em>, y todo lo demas es texto plano, aunque venga
   con un <script> dentro.
   ============================================================ */

import { useT } from './index.jsx';

const MARCAS = /<(b|em)>([\s\S]*?)<\/\1>/g;

/* Parte "hola <b>mundo</b> ya" en ['hola ', <b>mundo</b>, ' ya'].
   Lo que no case con una marca se devuelve tal cual: React lo pinta
   como texto y escapa solo lo que haga falta. */
export function conMarcas(texto) {
  const s = String(texto ?? '');
  const trozos = [];
  let ultimo = 0;
  for (const m of s.matchAll(MARCAS)) {
    if (m.index > ultimo) trozos.push(s.slice(ultimo, m.index));
    const Etiqueta = m[1];
    trozos.push(<Etiqueta key={m.index}>{m[2]}</Etiqueta>);
    ultimo = m.index + m[0].length;
  }
  if (ultimo < s.length) trozos.push(s.slice(ultimo));
  return trozos;
}

/* <T k="pacto.ayuda1" /> — el equivalente seguro de lo de antes.
   `como` permite sacarlo en <p>, <small> o lo que toque. */
export default function T({ k, vars, como: Como = 'p', ...resto }) {
  const t = useT();
  return <Como {...resto}>{conMarcas(t(k, vars))}</Como>;
}
