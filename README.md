# MichiFit

**Tu peso ideal, paso a pasito.** Seguimiento de peso con un michi que
cuida de ti — y al que cuidas tú.

🐱 **https://michifit.vercel.app** · versión **v0.7.0**

<!-- Este archivo era la plantilla de «React + Vite» sin tocar hasta el
     2026-09-14. Es lo primero que se ve al abrir el repositorio desde el
     movil, asi que ahora cuenta de que va esto. -->

## Qué es

Una app de peso que no te riñe. Pactas contigo mismo cuántos días a la
semana vas a moverte y a comer según tu objetivo, y un gato pixelado lo
lleva contigo: **el michi no refleja tu cuerpo, refleja tu constancia**.
No se muere, no hay monedas, no hay anuncios, y **tus datos no salen de
tu dispositivo** — no hay servidor ni cuentas.

El michi se llama **Ninja**, es gris, y existe de verdad: vive en Bangkok.

- Instalable en el móvil (PWA) y **se abre sin cobertura**.
- Cinco idiomas: español, inglés, tailandés, chino y japonés.
- Cinco objetivos: perder, mantener, estar en forma, ganar y otro.
- Suelos de seguridad que no se tocan: IMC mínimo, calorías mínimas y
  ritmo máximo de pérdida.

## Arrancarlo

```
npm install
npm run dev
```
http://localhost:5173 · Node 18+ (probado con 22).

Build: `npm run build` · Tests: `node pruebas/<nombre>.mjs`

## La documentación

El proyecto se documenta en español y en prosa, no en listas de
funciones. Por dónde entrar:

| Archivo | Para qué |
|---|---|
| **`VERSION.md`** | Qué versión es la buena y **cómo retomar desde otro dispositivo** |
| `CURRENT.md` | Qué está pasando ahora mismo |
| `MECANICA.md` | Cómo motiva el michi. El corazón del producto |
| `PROTOCOL.md` | Reglas fijas de cómo se trabaja aquí |
| `SESSION_MAP.md` | Diario de sesiones, día a día |
| `TODO.md` · `ROADMAP.md` | Lo que falta |
| `LESSONS.md` · `DECISIONS.md` | Errores ya cometidos y decisiones cerradas |
| `SIMPLICIDAD.md` | Qué le pide la app al usuario que entienda |
| `ARCHITECTURE.md` · `SETUP.md` · `GLOSSARY.md` | Referencia |

## Stack

React 19 + Vite. Código y comentarios en español. El motor
(`src/engine/`) son funciones puras. La mascota es pixel art en PNG
dentro de una carcasa SVG. Service worker escrito a mano.
