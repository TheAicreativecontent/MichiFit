# Carcasas lisas — fuera de la app desde el 2026-09-09

Los siete huevos con acabado suave. **Funcionan y están probados**: se
sacaron de la app por decisión de Alberto, no porque fallaran. Por ahora
solo se usa el pixel art.

## Cómo devolverlos

1. Mueve los siete PNG a `public/michi/`.
2. En `src/mascota/TamagotchiPNG.jsx`, añade `'liso'` a `ESTILOS`:
   ```js
   export const ESTILOS = ['liso', 'pixel'];
   ```

Ya está. **El selector de acabado en Ajustes reaparece solo**, porque
solo se dibuja cuando hay más de un estilo. Las traducciones de
«Acabado», «Liso» y «Píxeles» siguen en los cinco diccionarios.

Si quieres que el liso vuelva a ser el que sale por defecto, cambia
también `APARATO_POR_DEFECTO` ahí mismo y el `aparato` de `VACIO` en
`src/datos/almacen.js`.

## Si hay que regenerarlos

No se editan a mano. Salen de `python pixel/tenir_huevo.py`, que sigue
sabiendo hacer los dos acabados: la entrada `liso` de `CARCASAS` no se
ha tocado. El original está en `IMG/Huevo_transparente.png`.

## Nota sobre quien ya eligió el liso

Un perfil que tenga guardado `aparato.estilo: 'liso'` no se rompe: la
app comprueba que el estilo exista y, si no, usa el primero de la
lista conservando el color elegido. Comprobado con un perfil en
liso/verde: pasa a pixel/verde.
