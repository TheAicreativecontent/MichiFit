# SETUP.md — Levantar el proyecto

## Requisitos
- Node 18+ (probado con 22).
- Python 3 con Pillow, solo si regeneras los sprites de pixel art.

## Pasos
```
npm install
npm run dev
```
http://localhost:5173

## Problemas comunes
- **`X is not defined` tras editar el motor** → módulo obsoleto de la recarga en
  caliente de Vite. Recarga entera la página; el código suele estar bien.
- **El michi se recorta raro con varios en pantalla** → los `clipPath` llevan id
  único por instancia. Si se duplican, unas mascotas recortan a otras.
- **Los datos no persisten** → `localStorage` falla en ventana privada o con
  cookies bloqueadas. `almacen.js` lo captura y sigue en memoria.
