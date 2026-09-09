/* ============================================================
   MichiFit · idiomas
   Cinco idiomas, sin libreria: son ~250 cadenas y un diccionario
   plano basta. Meter i18next serian 40 kB para esto.

   Como se usa:
     const t = useT();
     t('ajustes.titulo')                -> "Ajustes"
     t('pacto.dias', { n: 3 })          -> "3 dias"
     t('inicio.faltan', { h: '1,0' })   -> "casi, faltan 1,0 h"

   Las claves que faltan caen al espanol y se avisan por consola en
   desarrollo: un texto en el idioma equivocado se ve raro, pero una
   clave cruda en pantalla ("inicio.faltan") es una app rota.
   ============================================================ */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import es from './es.js';
import en from './en.js';
import th from './th.js';
import zh from './zh.js';
import ja from './ja.js';

export const IDIOMAS = [
  { id: 'es', nombre: 'Español',  bandera: '🇪🇸' },
  { id: 'en', nombre: 'English',  bandera: '🇬🇧' },
  { id: 'th', nombre: 'ไทย',      bandera: '🇹🇭' },
  { id: 'zh', nombre: '中文',      bandera: '🇨🇳' },
  { id: 'ja', nombre: '日本語',    bandera: '🇯🇵' },
];

const DICCIONARIOS = { es, en, th, zh, ja };
const CLAVE = 'michifit.idioma';

/* El idioma del navegador si lo hablamos; si no, ingles. Ojo: el
   original se escribio en espanol, pero quien abra la app en Tailandia
   no deberia encontrarse el espanol por defecto. */
export function idiomaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado && DICCIONARIOS[guardado]) return guardado;
  } catch { /* ventana privada */ }
  const nav = (navigator.languages ?? [navigator.language ?? 'en'])
    .map((l) => String(l).toLowerCase());
  for (const l of nav) {
    const corto = l.split('-')[0];
    if (DICCIONARIOS[corto]) return corto;
  }
  return 'en';
}

/* Busca 'a.b.c' dentro del objeto anidado. */
function buscar(dicc, clave) {
  return clave.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dicc);
}

export function traducir(idioma, clave, vars) {
  let txt = buscar(DICCIONARIOS[idioma], clave);
  if (txt == null) {
    txt = buscar(es, clave);
    if (import.meta.env?.DEV && txt != null) {
      console.warn(`[i18n] falta "${clave}" en ${idioma}`);
    }
  }
  if (txt == null) {
    if (import.meta.env?.DEV) console.error(`[i18n] clave inexistente: "${clave}"`);
    return clave;
  }
  if (typeof txt === 'function') return txt(vars ?? {});
  if (vars) {
    return String(txt).replace(/\{(\w+)\}/g, (m, k) =>
      (vars[k] != null ? String(vars[k]) : m));
  }
  return txt;
}

const Ctx = createContext({ idioma: 'es', setIdioma: () => {} });

export function ProveedorIdioma({ children }) {
  const [idioma, setIdiomaEstado] = useState(idiomaInicial);

  const setIdioma = (id) => {
    if (!DICCIONARIOS[id]) return;
    setIdiomaEstado(id);
    try { localStorage.setItem(CLAVE, id); } catch { /* da igual */ }
  };

  /* `lang` importa de verdad: sin el, el navegador parte mal las lineas
     en tailandes y chino, y los lectores de pantalla leen con el acento
     equivocado. */
  useEffect(() => { document.documentElement.lang = idioma; }, [idioma]);

  const valor = useMemo(() => ({ idioma, setIdioma }), [idioma]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useIdioma() {
  return useContext(Ctx);
}

export function useT() {
  const { idioma } = useContext(Ctx);
  return useMemo(() => (clave, vars) => traducir(idioma, clave, vars), [idioma]);
}

/* --- formatos que cambian con el idioma ---------------------
   1.238 en espanol es 1,238 en ingles. Y una fecha corta no se
   escribe igual en Tokio que en Madrid. */
export function useFormato() {
  const { idioma } = useContext(Ctx);
  return useMemo(() => {
    const loc = { es: 'es-ES', en: 'en-GB', th: 'th-TH', zh: 'zh-CN', ja: 'ja-JP' }[idioma] ?? 'en-GB';
    return {
      loc,
      n: (v, dec = 0) => (v == null || Number.isNaN(v) ? '—'
        : new Intl.NumberFormat(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v)),
      fecha: (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
        (d == null ? '—' : new Intl.DateTimeFormat(loc, opts).format(new Date(d))),
      mes: (d) => new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' }).format(new Date(d)),
    };
  }, [idioma]);
}
