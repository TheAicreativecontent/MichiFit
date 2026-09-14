# VERSION.md — La versión estándar

> Este archivo dice **qué versión es la buena** y **cómo sentarse a
> trabajar desde cualquier sitio**. Si vienes del móvil o del otro
> portátil y no sabes por dónde ibas, empieza aquí y sigue por
> `CURRENT.md`.

## La estándar, hoy

**v0.7.0** — 14 de septiembre de 2026.

| Dónde | Qué vale |
|---|---|
| Etiqueta de Git | `v0.7.0` |
| `package.json` | `"version": "0.7.0"` |
| Caché del service worker | `michifit-v7` |
| En vivo | https://michifit.vercel.app |
| Repositorio | https://github.com/TheAicreativecontent/MichiFit |

Los cuatro números van **juntos a propósito**. Si algún día no coinciden,
el que manda es la etiqueta de Git: lo demás se pone al día con ella.

## Qué es la v0.7.0

La app entera y funcionando: motor de cálculo, cinco objetivos, PWA
instalable que se abre sin cobertura, cinco idiomas, el aparato con sus
tres botones y el anillo de ocho iconos, la historia de Ninja con sus
fotos de verdad, e importador del CSV de la MichiFit antigua.

Es la primera versión que se numera. Hasta hoy el proyecto vivía en
`0.0.0` y la única forma de saber qué tenías delante era mirar el último
commit — lo cual funciona en el portátil donde está el repositorio y no
funciona en el móvil.

## Trabajar desde otro sitio

### Desde el móvil
No hace falta nada: entra en https://michifit.vercel.app. Si ya la
tienes instalada en la pantalla de inicio, al abrirla se actualiza sola
(el HTML va a la red primero, y la v7 tira la caché vieja).

Para **mirar** el código o los documentos sin ordenador, se leen en
GitHub desde el navegador del móvil.

### Desde el otro portátil
```
git clone https://github.com/TheAicreativecontent/MichiFit.git
cd MichiFit
npm install
npm run dev
```
Y si ya lo tenías clonado, lo primero de todo, **siempre**:
```
git pull
```

> Esto no es una formalidad. El 13 de septiembre se trabajó desde otro
> sitio y este portátil se quedó cuatro commits atrás; al día siguiente
> parecía que producción tenía cosas que nadie había escrito. No se
> había perdido nada, pero costó un rato entenderlo.

### Al terminar, desde donde sea
```
git push
```
Vercel despliega solo con cada push a `main`. Si no lo subes, el
siguiente sitio no lo verá.

## Cómo se sube de versión

Al cerrar una tanda de trabajo que merezca marcarse:

1. `package.json` → sube el número.
2. `public/sw.js` → sube `const CACHE` **solo si cambió alguna imagen
   sin hash** (todo lo de `/michi`, `/fondos`, `/iconos-anillo`). La
   regla larga está escrita en ese archivo.
3. `node pruebas/cache-sw.mjs` para comprobar que la caché va al día.
4. Actualiza la tabla de aquí arriba.
5. Commit, `git tag -a vX.Y.Z`, y `git push --follow-tags`.

## Historial

- **v0.7.0** (2026-09-14) — Primera versión numerada. Base estándar de
  trabajo. Caché `michifit-v7`.
- Antes de esto, el historial vive en `SESSION_MAP.md`, día a día desde
  el 7 de septiembre de 2026.
