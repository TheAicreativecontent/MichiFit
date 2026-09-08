# MECANICA.md — Cómo motiva el michi

> Resultado de la sesión de diseño del 2026-09-07. Esto es **el corazón del
> producto**: si la mecánica de motivación no funciona, da igual lo bonito que
> sea el michi. Leer antes de tocar `engine/`.

## Principio rector

**El michi no juzga: recuerda.** El listón lo pone el usuario al principio, en
un pacto. Cuando el michi decae, no está opinando sobre tu cuerpo — te está
recordando lo que tú mismo dijiste que querías hacer.

De ahí salen tres reglas que no se negocian:

1. **El michi es un compañero, no tu avatar.** Su cuerpo refleja tus *hábitos*,
   nunca tu peso. Tu peso vive en la parte numérica (gráfica y estimación).
2. **No registrar no es fallar.** Puede que se te acabara la batería. Hay
   ventana para rellenar días pasados.
3. **Lo ganado no se borra de golpe.** Fallar se nota enseguida en cómo se ve el
   michi; el nivel solo cae tras un periodo entero fallado.

---

## 1 · El pacto

Al empezar, el usuario pacta su semana. **La estructura es semanal; el
seguimiento, diario.** Cada día de la semana tiene su objetivo, y los días de
descanso forman parte del plan — descansar no es fallar.

Ejemplo real (el de Alberto):

| Día | Entreno | Pasos |
|-----|---------|-------|
| Lunes, miércoles, viernes | Sí | mínimo 4.000 |
| Martes, jueves, sábado, domingo | No | ideal 6.000 |

> Detalle que importa: en los días de entreno el mínimo de pasos es **más bajo**.
> Un pacto que pida entrenar Y andar mucho el mismo día se incumple solo.

El pacto se puede renegociar cuando el usuario quiera. Cambiarlo **no** es
fallar: un pacto que no encaja con tu vida se abandona entero, y eso sí es
perderlo todo.

## 2 · El asesoramiento

Al pactar, la app **propone** cifras y el usuario las ajusta. Nunca las impone.

- Metabolismo basal por **Mifflin-St Jeor**, con factor de actividad.
- Macros repartidas sobre esas calorías.
- Pasos y días de entreno sugeridos según el punto de partida.

**Suelos de seguridad, no negociables en el código:**
- Nunca proponer un objetivo de peso por debajo de **IMC 18,5**.
- Nunca proponer menos de **1.500 kcal** (hombres) o **1.200 kcal** (mujeres).
- Nunca sugerir un ritmo de pérdida mayor al **1% del peso corporal por semana**.
- Si el usuario fuerza cifras por debajo de esos suelos, se respeta su decisión
  pero la app deja de "premiar" ir más abajo: el michi no mejora por ello.

La app no da consejo médico. Son fórmulas estándar como punto de partida.

## 3 · El día a día

Un día **cumple** si alcanza lo pactado para ese día de la semana.

- **Ventana de registro retroactivo: 3 días.** Puedes rellenar el fin de semana
  el lunes. Pasada la ventana, el día queda cerrado como no cumplido.
- El peso y las notas se pueden editar **siempre**, sin ventana. La ventana solo
  afecta a lo que cuenta para el pacto.
- **Sin datos ≠ fallo, dentro de la ventana.** Fuera de ella, cuenta como fallo.

## 4 · Comodines

Estilo Duolingo, pero **se ganan, no se compran**.

- Cumplir 7 días seguidos da **1 comodín**. Máximo acumulable: 3.
- Se gastan **solos** al fallar un día, sin preguntar. El usuario se entera
  después: "el michi te cubrió el martes".
- No cubren una semana entera fallada.

Protegen justo a quien va bien, que es quien más duele que rompa una racha.

## 5 · Qué refleja el michi

Los tres ejes del motor se redefinen en términos de **hábitos**, no de cuerpo:

| Eje | Sale de | Se ve en |
|-----|---------|----------|
| **Energía** | pasos y entrenos recientes, calidad del sueño | pose y brío |
| **Forma** | cumplimiento del pacto sostenido | silueta |
| **Ánimo** | sueño, estrés, constancia | expresión |

Y las cinco siluetas dejan de hablar de tu IMC:

| Silueta | Qué significa ahora |
|---------|--------------------|
| **esquelético** | abandono prolongado — el michi lleva mucho sin nada |
| **gordo** | comiendo por encima del pacto y moviéndose poco |
| **kawaii** | estado base, cumpliendo a medias |
| **fit** | cumpliendo el pacto con constancia |
| **hipertrofiado** | cumpliendo con creces, con entrenos de fuerza |

> Esto es un cambio importante respecto al motor actual, donde `forma` sale del
> IMC. Hay que reescribir `calcularForma()`.

## 6 · Niveles y ritmo

**Mes y medio (42 días) de constancia hasta el máximo.** Cinco niveles, así que
unos 8-9 días de cumplimiento por nivel.

Propuesta de números de partida (todos en `constants.js`, para tunear):

- Día cumplido: **25 XP**
- Semana completa: **+50 XP** de bonus
- Umbrales: N1 `0` · N2 `150` · N3 `400` · N4 `750` · N5 `1200`

Con cumplimiento perfecto se llega a N5 sobre el día 38-40.

## 7 · Retroceso

- **Fallar un día:** el michi pierde forma visiblemente. Se le apaga la mirada,
  se desinfla. Inmediato y evidente. **El nivel no se toca.**
- **Fallar una semana entera** (después de comodines): baja **un** nivel.
- **Suelo: nivel 2.** Nunca se vuelve a recién nacido. Quien llegó a algo,
  llegó.

La idea: el aviso es inmediato, el castigo es lento y tiene fondo.

## 8 · Acciones diarias

No inventan datos: son la misma información presentada como cuidado.

| Acción | Dato real detrás |
|--------|-----------------|
| **Entrenarlo** | registrar un entrenamiento |
| **Darle de comer** | registrar comidas |
| **Sacarlo a pasear** | los pasos del día |
| **Acostarlo** | registrar el sueño, cierra el día |
| **Acariciarlo** | nada — es gratis, solo por cariño |

Acariciar no da XP a propósito. Si diera, dejaría de ser cariño.

## 8b · La barra HAPPY

Va dentro de la pantalla, bajo la del nivel. Es lo único del motor que
depende de la **hora**, no solo del día.

| Aporta | Cuánto |
|---|---|
| Cómo fue **ayer** | 72 si cumpliste · 58 si el día sigue abierto · 30 si no |
| Lo hecho **hoy** del pacto | hasta +24 |
| **Mimos** recientes (12 h) | hasta +22, con rendimiento decreciente |
| **Desgaste** por horas sin cuidarlo | −2,2 por hora, tope −32 |

Dos decisiones que la sostienen:

- **Los mimos suben poco y cada vez menos.** Da gusto darle al botón, pero
  no se puede tener al michi feliz solo a base de caricias. Si bastara con
  eso, la app dejaría de hablar de tu vida.
- **De noche la barra se congela** (23:00 a 07:00). Nadie debe levantarse de
  madrugada a pulsar un botón: eso convertiría el cariño en obligación, que
  es justo lo contrario de lo que se busca. El desgaste cuenta solo horas de
  vigilia (`horasDespierto()`).

Apuntar datos cuenta como cuidado igual que un mimo: lo que baja la barra es
el abandono, no el reloj.

## 9 · Add-ons (después del máximo)

Al llegar a N5 se abren **cosméticos**: batidos de proteínas, mancuernas
molonas, gafas de sol. Puramente estéticos.

**Se ganan, nunca se compran.** No hay moneda virtual ni pagos: está en la
filosofía del proyecto desde el principio.

Resuelven el problema de "llegué al tope y ya no hay nada": el objetivo pasa de
subir de nivel a mantenerlo y coleccionar.

## 10 · Lo que esta mecánica NO hace

- No castiga por no abrir la app.
- No enseña un cuerpo gordo o esquelético como juicio sobre el usuario.
- No usa culpa como motor. El michi nunca reprocha.
- No tiene monedas, anuncios ni "compra reintentos".
- No premia comer menos de lo sano ni bajar de un IMC seguro.
- No deja que el michi muera. Nunca.

## Preguntas abiertas

- ¿La semana empieza en lunes o es móvil (últimos 7 días)?
- ¿Qué ve el usuario exactamente al gastar un comodín?
- ¿El pacto puede tener objetivo de calorías por día, o solo pasos y entrenos?
- ¿Los add-ons se pierden si baja de nivel, o son para siempre?
