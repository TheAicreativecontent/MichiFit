/* ============================================================
   Sonidos del aparato
   Sintetizados con Web Audio: ni un solo archivo de audio. Pesan cero,
   cargan al instante y no hay que esperar a que se descarguen.

   El contexto se crea la primera vez que el usuario toca algo, que es
   cuando los navegadores permiten sonar. Si algo falla, todo queda en
   silencio sin romper nada: el sonido es un adorno, no una función.
   ============================================================ */

let ctx = null;

function contexto() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

/* Una nota corta con envolvente suave. Sin ataque brusco: un click seco
   suena a error, y esto tiene que sonar a mimo. */
function nota({ frec, inicio = 0, dur = 0.12, vol = 0.14, tipo = 'sine' }) {
  const c = contexto();
  if (!c) return;
  const t = c.currentTime + inicio;
  const osc = c.createOscillator();
  const gan = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frec, t);
  gan.gain.setValueAtTime(0, t);
  gan.gain.linearRampToValueAtTime(vol, t + 0.015);
  gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gan).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sonidos = {
  /* Mimo: tres notas ascendentes, como un ronroneo contento. */
  mimar() {
    nota({ frec: 660, inicio: 0,    dur: 0.14 });
    nota({ frec: 880, inicio: 0.09, dur: 0.16 });
    nota({ frec: 1170, inicio: 0.19, dur: 0.2, vol: 0.11 });
  },

  /* Hablar: dos notas cortas, tipo mensaje de consola. */
  estado() {
    nota({ frec: 520, inicio: 0,    dur: 0.09, tipo: 'square', vol: 0.07 });
    nota({ frec: 700, inicio: 0.07, dur: 0.1,  tipo: 'square', vol: 0.07 });
  },

  /* Cambiar de escena: un salto corto hacia arriba, como al pasar de
     pantalla en una maquinita. */
  accion() {
    nota({ frec: 440, inicio: 0,    dur: 0.07, tipo: 'square', vol: 0.08 });
    nota({ frec: 660, inicio: 0.06, dur: 0.11, tipo: 'square', vol: 0.08 });
  },

  /* Apagar: dos notas descendentes. Encender: al revés. */
  dormir(apagando) {
    if (apagando) {
      nota({ frec: 520, inicio: 0,    dur: 0.12, tipo: 'triangle', vol: 0.1 });
      nota({ frec: 300, inicio: 0.08, dur: 0.22, tipo: 'triangle', vol: 0.1 });
    } else {
      nota({ frec: 300, inicio: 0,    dur: 0.1,  tipo: 'triangle', vol: 0.1 });
      nota({ frec: 620, inicio: 0.07, dur: 0.16, tipo: 'triangle', vol: 0.1 });
    }
  },
};

/* El navegador suspende el contexto si se crea antes de que el usuario
   toque nada. Se llama al pulsar, que es cuando ya vale. */
export function despertarAudio() {
  const c = contexto();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}
