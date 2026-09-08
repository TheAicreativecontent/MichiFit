# ARCHITECTURE.md — Cómo está montado

## Stack
React 19 + Vite. Local-first, sin backend. Persistencia hoy en `localStorage`,
detrás de una interfaz preparada para cambiar a IndexedDB tocando un archivo.

## Mapa
```
src/
  engine/                 motor. Funciones puras, sin React.
    constantes.js         TODO lo ajustable: pesos, umbrales, niveles, suelos
    calculos.js           Mifflin-St Jeor, gasto, macros, simulador, avisos
    pacto.js              el pacto semanal y la evaluación día a día
    michi.js              energía / forma / ánimo / racha / comodines / nivel
  mascota/
    Michi.jsx             SVG paramétrico (4 cuerpos x 4 poses x 3 caras x 5 niveles)
    michi.css             animaciones
  pantallas/
    Inicio.jsx            el michi, lo que falta hoy, acciones de cuidado
    Pacto.jsx             entrenos, pasos, descanso, comida y macros
    Simulador.jsx         "¿y si...?" — fecha de meta
    Ajustes.jsx           perfil, gasto energético, objetivos, CSV
  datos/almacen.js        persistencia + exportación CSV
  App.jsx                 armazón y navegación
  estilos.css             paleta, modo oscuro
pixel/                    sprites 32x32 estilo Tamagotchi (aún sin conectar)
```

## Piezas heredadas
- **De la MichiFit original:** las fórmulas energéticas tal cual (Mifflin-St
  Jeor, 0,04 kcal/paso, 8 kcal/min, 7.700 kcal/kg), el simulador y la estructura
  de Ajustes, incluido el truco de que las medias reales del reloj mandan sobre
  la fórmula.
- **De Michigochi:** el michi SVG y la arquitectura del motor.

## Lo que cambió al fusionar
`forma` ya **no** sale del IMC: sale del cumplimiento del pacto. Es el cambio
conceptual más grande. Ver `MECANICA.md` y `DECISIONS.md`.

## Flujo de datos
```
pacto + entradas  ->  pacto.js (evalúa cada día)
                  ->  michi.js (energía, forma, ánimo, racha, nivel)
                  ->  estadoVisual()  ->  Michi.jsx dibuja
```
Nada de esto guarda estado propio: se recalcula entero en cada render desde el
historial. Así editar un día pasado nunca descuadra la XP ni la racha.
