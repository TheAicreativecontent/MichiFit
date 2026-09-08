# GLOSSARY.md — Jerga propia del proyecto

- **michi**: el gato mascota. Aqui no es decorativo: cambia de silueta segun los
  datos, por eso es SVG parametrico y no una imagen.
- **Michigochi**: nombre de trabajo del tamagochi, **descartado como nombre de
  producto** el 2026-09-07. Sigue vivo en la carpeta y en el codigo como deuda.
- **Energia / Forma / Animo**: los tres ejes 0-100 (Animo va de -50 a +50) que
  salen del motor y deciden pose, silueta y expresion.
- **Estado visual**: la traduccion de esos numeros a etiquetas que entiende el
  dibujo (`cuerpo`, `pose`, `cara`, `nivel`). Lo hace `estadoVisual()`.
- **chonky**: el estado de cuerpo con forma baja. Forma baja = lejos del
  objetivo = peso de mas. La spec original lo llamaba "delgado", al reves.
- **TRAZO / CREMA**: constantes de `Michigochi.jsx`. El contorno oscuro y el
  crema del hocico y la barriga. Son la firma del estilo, no varian por nivel.
- **Racha**: dias consecutivos con datos, contando hacia atras desde el mas
  reciente.
- **Hito**: logro puntual. Una vez conseguido no se pierde: se evalua contra
  todo el historial, no solo contra hoy.
- **LCD**: la paleta verde grisacea de los sprites de pixel art, imitando la
  pantalla de un Tamagotchi.
