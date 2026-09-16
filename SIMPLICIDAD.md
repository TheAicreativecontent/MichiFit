# SIMPLICIDAD.md — Qué le pide la app al usuario que entienda

> **Esto NO es una propuesta de recortes.** Albert lo dijo explícitamente
> el 2026-09-12: por ahora no se borra ni se reduce nada, tal como está,
> está bien. Lo que pidió preparar es un MAPA: cuántos conceptos hay,
> cuáles se explican solos en la propia pantalla, y cuáles hay que
> deducir.
>
> Escrito el 2026-09-14. Nada de lo de aquí se aplicó al escribirlo.
> Lo único que se ha hecho desde entonces es el punto 1 de la última
> sección —el «?» de Inicio—, y está marcado como tal.

## El recuento

**42 conceptos**, en siete capas. No están repartidos: **29 de los 42
viven en la pantalla de Inicio**, que era además la única pantalla sin
botón de ayuda hasta ese mismo día — ver el punto 1 del final.

### 1 · El michi (4)
La pose y el escenario · la expresión · las cacas en el suelo · el gato
dormido.

### 2 · Las barras del aparato (4)
El nombre del nivel (BEBÉ → LEYENDA) · **HAPPY** (que de noche pone ZZZ)
· **WATER** · **CLEAN**.

### 3 · El marcador (7)
RACHA · el corazón entero · el **corazón roto** (un comodín te cubrió) ·
el **escudo** (comodines que te quedan) · PASOS en % · SUEÑO con su
tramo rojo · COMIDA con su tramo rojo · NIVEL en XP.

### 4 · El objetivo (9)
Qué quieres conseguir (perder · mantener · estar en forma · ganar ·
otro) · el **sentido** de la comida (techo, suelo o banda) · días de
entreno y de descanso · que los días de entreno piden MENOS pasos · qué
es cumplir un día · el margen del 10% y el del 30% · la ventana
retroactiva de 3 días · cómo se ganan los comodines · que se gastan
solos.

### 5 · Los números del cuerpo (8)
Gasto en reposo · mantenimiento · déficit y su techo del 20% · IMC
actual y meta · el suelo de kcal mínimas · las macros · el ritmo de
pérdida y su tope · la previsión de la gráfica.

### 6 · El aparato como interfaz (4)
La gramática de los tres botones · el anillo y sus siete iconos · la
vista previa de la escena · que se cierra solo a los 8 segundos.

### 7 · Todo lo demás (6)
Niveles, XP y retroceso (con suelo en el 2) · los logros · Karma · el
simulador · el importador de CSV · los ajustes de idioma, letra y color.

---

## Los tres cubos

### Se explican solos en la pantalla — 16
El michi entero (capa 1), la vista previa del anillo, los rótulos de los
botones, las barras WATER y CLEAN (bajan, las rellenas, se ve), las
cacas, PASOS en %, el nombre del nivel, los ajustes, el simulador, el
importador.

Estos funcionan. La vista previa del anillo es el mejor ejemplo de todo
el proyecto: pasas por «pasos» y sale el michi andando por la calle. Es
media explicación sin escribir una palabra.

### Hay que deducirlos — 14
Se ven, pero nada dice qué son. Se entienden mirándolos un rato, o no.

- **El corazón roto y el escudo.** Dos símbolos nuevos, sin leyenda.
  Aciertan el significado quienes ya juegan a algo.
- **El tramo rojo** de SUEÑO y COMIDA. Que pasarse no es mejor es una
  idea buena y deliberada, y se cuenta con un color.
- **HAPPY.** Sube y baja por cuatro razones distintas y ninguna se ve.
- **La diferencia entre los días de entreno y los de descanso** en los
  pasos que se piden.
- **NIVEL en XP** («−150»): un número sin unidad.
- Qué es exactamente **cumplir** un día.
- La previsión de la gráfica y su horizonte.

### Solo se aprenden por sorpresa — 12
No están en ninguna pantalla. Te enteras cuando te pasa.

- **La ventana de 3 días.** Te enteras el cuarto día, cuando ya no puedes
  apuntar.
- **El comodín se gasta solo.** Te enteras al ver un corazón roto que no
  sabías que ibas a tener.
- **Los márgenes del 10% y el 30%.**
- **El sentido de la comida** (que mantenerse es una banda con dos lados,
  y perder es un techo). Es de lo mejor pensado del motor y es
  completamente invisible.
- **De noche HAPPY, WATER y CLEAN se congelan.** Y el rótulo HAPPY
  pasa a poner `ZZZ`, con la barra azulada
  (`TamagotchiPNG.jsx`: `denoche ? 'ZZZ' : 'HAPPY'`).
  **El 2026-09-16 Albert lo vio y lo dio por un FALLO.** Él escribió esa
  regla, y aun así en pantalla le pareció que algo se había roto. No
  hay nada que arreglar en el código: es la mejor prueba que tiene este
  documento de que este cubo —«solo se aprenden por sorpresa»— es real
  y no una exageración.
- **El techo del déficit del 20%** y el suelo de kcal.
- **El nivel no baja por fallar un día**, solo por una semana entera.
- **El suelo del nivel 2**: nunca se vuelve a bebé.
- **Acariciar no da nada**, a propósito.
- **Que WATER y CLEAN no cuentan para nada.**

---

## Los tres hallazgos

Lo de arriba es el inventario. Esto es lo que sale de mirarlo junto, y
es lo que de verdad contesta a la pregunta.

### 1. El problema no es cuántos conceptos hay, es que el mismo dato se presenta hasta cuatro veces con cuatro caras distintas

«Pasos» es, en la misma pantalla y a la vez:

1. un **icono** en el anillo,
2. una **barra de porcentaje** en el marcador,
3. una **línea con casilla** en la lista de Hoy (`— / 4000`),
4. y una **escena**: el michi andando por la calle.

Lo mismo pasa con comida y con sueño. Quien abre la app por primera vez
no ve un dato con cuatro vistas: ve cuatro cosas, y tiene que descubrir
que son la misma. Ese trabajo de unificación lo está haciendo el usuario
en su cabeza, y no se lo hemos pedido en ningún sitio.

Esto explica la queja original —«no se entendía para qué servía el
gato»— mejor que la cantidad de conceptos. El gato no se entendía porque
era la cuarta cara de algo que ya estaba dicho tres veces más arriba.

### 2. Hay DOS sistemas que se parecen y obedecen a reglas opuestas, y nada en pantalla lo dice

| | Cuenta para la mecánica | Se dibuja como |
|---|---|---|
| Racha, PASOS, SUEÑO, COMIDA, NIVEL | **Sí** | barras de bloques |
| HAPPY, WATER, CLEAN | **No, nada** | barras de bloques |

Están uno al lado del otro, con la misma tipografía de píxel y el mismo
lenguaje visual. Que WATER no toque absolutamente nada es una decisión
excelente y muy defendida en `MECANICA.md` §8c — el día que diera
puntos, la app premiaría pulsar un botón en vez de cuidarte. Pero el
usuario no ha leído `MECANICA.md`.

**Esta es la trampa más cara de la app**, porque no produce confusión:
produce una creencia equivocada y estable. Quien crea que rellenar el
agua sirve para algo, seguirá creyéndolo durante meses y no verá nada
que le contradiga.

### 3. La pantalla con 29 de los 42 conceptos era la única sin botón de ayuda

Pacto, Progreso, Simular, Ajustes y Logros tienen su «?» con dos
párrafos cada uno, y están bien escritos: cuentan **por qué** las cosas
son como son, que es la regla que se fijó en `Ayuda.jsx`.

Inicio no tenía ninguno. Y Karma sigue sin él, aunque ahí importa menos.

No es que faltara documentación: es que el hueco estaba exactamente
donde más densidad hay. **Se puso el mismo día**: es lo único de este
documento que ya no describe la app tal como está.

---

## Si algún día decides simplificar

Ordenado por lo que arregla dividido por lo que cuesta. De esta lista
**solo está hecho el punto 1**; los otros cuatro siguen sin tocar, y
están aquí para que la conversación tenga de dónde tirar, no como
propuesta.

1. ~~**Un «?» en Inicio.**~~ **HECHO el 2026-09-14**, el mismo día que
   este mapa. Tres párrafos en las cinco lenguas: qué refleja el michi y
   cómo van los botones, que las barras de dentro son cuidado y **no
   puntúan**, y que lo que sí cuenta está debajo. Ataca el hallazgo 3
   entero y la mitad del 2.
2. **Una leyenda para el corazón roto y el escudo.** La primera vez que
   aparece un corazón roto, decirlo: «el michi te cubrió el martes». Ya
   está escrito así en `MECANICA.md` §4 y no ha llegado a la pantalla.
3. **Separar visualmente los dos sistemas.** No quitar nada: que el
   cuidado y la mecánica no compartan el mismo lenguaje de barras. Es
   trabajo de diseño, no de recorte.
4. **Decir la ventana de 3 días donde se apunta**, no cuando ya es tarde.
5. **Hacer visible el sentido de la comida.** «Mantenerte: quedarte entre
   X e Y» es una frase, y convierte lo mejor escondido del motor en algo
   que se ve.

Lo que yo **no** tocaría, por si sirve de contrapeso: el número de
conceptos en sí. La app es un tamagotchi de salud — tiene la densidad
que tiene ese género, y la vista previa del anillo demuestra que esta
app sabe enseñar sin escribir. El problema no es que haya 42 cosas: es
que unas cuantas se dicen cuatro veces y otras no se dicen nunca.
