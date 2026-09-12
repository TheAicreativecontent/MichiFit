# TODO.md — Backlog

## Ahora
- [ ] **El QR de PromptPay** (Alberto). El bloque está hecho y apagado.
      Sácalo de tu app del banco, déjalo en
      `public/karma/promptpay_qr.png`, pon `ACTIVO = true` en
      `src/datos/promptpay.js` y sube `const CACHE` en `public/sw.js`.
      **Antes, lee el aviso de ese archivo**: el repositorio es público y
      ese QR lleva dentro tu número de teléfono o de identidad. Un commit
      no se retira. PromptPay admite también un e-Wallet ID, que no es tu
      teléfono.

- [ ] **Los iconos de «dormir» y «sueño», repensados juntos.** Idea de
      Alberto (2026-09-12), y no hay prisa: puede que acaben siendo el
      MISMO icono, o que se diferencien con una siesta.
      Hoy son dos: tres z para ponerlo a dormir y una luna para apuntar
      las horas. Se dibujaron por separado y con la regla de que dos
      lunas seguidas en el mismo anillo no se distinguen, pero la duda
      de fondo es otra y es buena: si son dos acciones distintas de
      verdad para quien usa la app, o si las estamos separando solo
      porque por dentro son cosas distintas —una es un cuidado y la otra
      un dato—. Eso es razón del código, no del usuario.
      Si se unifican, hay que decidir qué pasa al aceptar: abrir el
      editor, dormirlo, o las dos cosas. Los textos ya están separados en
      las cinco lenguas («Ponerlo a dormir» / «Apuntar sueño»), así que
      la vuelta atrás es barata.
      Encaja con la conversación de simplificar, no antes.

- [ ] **Las fotos de Ninja, en el ordenador.** Alberto las mandó por el
      chat y ahí no se pueden guardar en disco. Déjalas en
      `public/ninja/` (o en cualquier carpeta y se recortan desde ahí):
      hay tres, dos durmiendo en la cama y una sentado de frente
      mirando a cámara — esa es la buena para la pantalla del final.

- [ ] **Si algún día se publica en GitHub Pages**: poner `base:
      '/<nombre-repo>/'` en `vite.config.js`. Vite compila con rutas absolutas
      desde `/`, y en `usuario.github.io/repo/` la app saldría en blanco.
      Con Vercel no hace falta: sirve desde la raíz del dominio.

- [ ] **El michi SVG y las cinco siluetas viejas.** `pixel/michis.js`
      sigue trayendo los cinco cuerpos retirados el 2026-09-09
      (esqueletico, gordo, kawaii, fit, hipertrofiado) y **no se dibujan
      en ninguna pantalla**: `Tamagotchi.jsx` solo pinta el sprite si
      `!sinMichi`, y su único llamante pasa siempre `sinMichi`. De ese
      archivo solo se usan hoy `PALETA` y `TAM`.
      No se ha tocado porque son los dibujos originales del proyecto y
      eso se decide mirándolos, no de pasada. Lo que sí se hizo
      (2026-09-12) es dejarlo escrito en los dos archivos y deshacer la
      colisión de nombres: el de los tres colores pasó a llamarse
      `COLORES_MICHI`.

- [ ] **`salir.png` ya no se usa.** Se quedó sin sitio cuando el botón
      derecho pasó a cerrar el anillo. Su rejilla sigue en
      `pixel/iconos_anillo.py` por si vuelve.

## Después
- [ ] **Las fotos y los vídeos del Ninja de verdad** (Alberto). La
      última pantalla de la historia ya tiene su sitio: deja los
      archivos en `public/ninja/`, añádelos a la lista de
      `src/datos/ninja.js` y sube `const CACHE` en `public/sw.js`.
      Mientras no haya ninguno, esa pantalla enseña al michi contento y
      funciona igual.

- [ ] **Las 21 viñetas del cómic.** Los prompts están escritos. Cuando
      existan, se cambian las rutas de `ESCENAS` en `pantallas/Lore.jsx`
      y ya: ahora mismo la historia se ilustra con el propio michi gris
      sobre los escenarios que hay.

- [ ] **Seguir ajustando el ritmo de las barras.** Se bajaron una vez
      el 2026-09-12 (16→10 h el agua, 24→14 h el orden, y las cacas de 3
      a 5) porque Alberto dijo que al entrar apenas se habían movido.
      Ahora el agua pide una o dos veces al día. Los números están en un
      solo sitio cada uno: `AGUA_HORAS` y `ORDEN_HORAS` en
      `engine/cuidados.js`, y los cuatro de la felicidad en
      `engine/felicidad.js`. Si cansa, se suben; si aburre, se bajan.


- [ ] Add-ons cosméticos al llegar a nivel 5 (batidos, mancuernas, gafas).
      Se pierden al bajar de nivel y se recuperan al volver a subir.
      Necesita código además del dibujo.

## Descartado
- ~~Importador del export de Garmin Connect~~ — la API de Garmin exige ser
  desarrollador certificado, no basta con una clave (Alberto, 2026-09-08).
- ~~`localStorage` → IndexedDB~~ — **no hace falta**. IndexedDB sirve para
  datos grandes o consultas complejas; aquí son unos pocos KB de un solo
  usuario, que caben de sobra en el límite de 5 MB. Cambiarlo añadiría código
  asíncrono a cambio de nada. Si algún día se guardan fotos, se reabre: solo
  toca `datos/almacen.js`.

## Guardadas, decididas por ahora que no (siguen en `ASK.md`)
- [ ] **La cámara para calcular calorías de una foto.** Necesita una API
      de visión y se paga por uso. «Quizás no lo hacemos» (Alberto,
      2026-09-12), pero que siga apareciendo.
- [ ] **Notificaciones push de verdad.** Necesitan un servidor con claves
      VAPID, y eso rompe que los datos no salgan del dispositivo. Mismo
      estado que la anterior — y ojo, que depende del punto de decisión
      abierto en `ROADMAP.md`: Alberto se está planteando Hostinger con
      sistema de usuarios y login, y con servidor esto deja de estar
      bloqueado.

## Ideas / quizás algún día
- [ ] En la ventana de cada día del pacto, poder apuntar **qué entreno toca**
      (pecho, piernas, cardio...). El hueco ya está preparado.
- [ ] Más escenarios: cocina para las comidas, parque, cama para dormir.
- [ ] Michi propio para la pantalla de Karma: el actual viene de Michi
      Finanzas y lleva traje.
- [ ] Repasar el horizonte de la gráfica con datos de verdad. Desde el
      2026-09-12 se enseña como mucho vez y media el historial y la línea
      se corta con una flecha; el número (1,5) está puesto a ojo y solo
      se sabrá si es el bueno mirándolo con meses de pesajes.
- [ ] Marcar en la gráfica los tramos con pocos datos.


## Hecho
- [x] 2026-09-12 — **El panel de pruebas dejó de tumbar la app.** Usaba
      una constante `CUERPOS` que no existía en ninguna parte, así que
      los siete toques en el logo dejaban la pantalla en blanco. Ahora
      enseña los tres colores (solo vista previa, no los guarda), las
      poses y los escenarios.
- [x] 2026-09-12 — **El teclado del móvil ya no tapa el botón de
      guardar** en la hoja de registrar.
- [x] 2026-09-12 — **Documentos que mentían**: `ROADMAP.md` reescrito
      entero, `PROTOCOL.md` decía que la mascota era SVG paramétrico, y
      el código muerto de las cinco siluetas queda anotado donde está.
- [x] 2026-09-12 — **Las barras de cuidados, más vivas** y más cacas.
- [x] 2026-09-12 — **La gráfica deja de comprimir el historial**: se
      enseña como mucho vez y media lo andado y la previsión se sale por
      el borde con una flecha.
- [x] 2026-09-12 — **«Ponerlo a dormir» y «Apuntar sueño»** dejan de
      llamarse las dos casi igual. En inglés las dos decían «Sleep».
- [x] 2026-09-12 — **Los botones, versión buena**: izquierda pasa al
      siguiente, centro acepta, derecha cierra — la disposición A/B/C de
      los tamagotchis de Bandai. Un solo anillo de ocho en vez de dos, y
      `dormir` pasa de botón a icono. En reposo el centro y la derecha no
      hacen nada. Dormido, el primer toque solo despierta.
- [x] 2026-09-12 — **El color se elige al adoptarlo**, gato y huevo, al
      final de la historia. El michi arranca GRIS, que es el color de
      Ninja. De paso se destapó que la bienvenida pintaba siempre el
      naranja: `estado="kawaii"` no existe como archivo.
- [x] 2026-09-12 — **La escoba de Alberto** en `limpiar`, y
      `pixel/iconos-a-mano/` para que el generador no vuelva a pisar un
      dibujo hecho fuera.
- [x] 2026-09-12 — **Los rangos del simulador** dejan de ser de atleta.
      Los de comida salen de la persona, no de dos números fijos.
- [x] 2026-09-12 — **PromptPay** montado y apagado, a falta del QR.
- [x] 2026-09-12 — **Los ocho iconos de los anillos**, dibujados píxel a
      píxel en `pixel/iconos_anillo.py`. Rejilla de 12x12 escrita en
      texto, así que se editan abriendo el archivo. Si quieres rehacer
      alguno con Magnific, adelante: el sitio es el mismo.
- [x] 2026-09-11 — **Mantenerse es una banda.** Cumplir es quedarse
      cerca de las calorías por arriba y por abajo, no solo no pasarse.
      También en «estar más en forma», que apunta al mismo número.
- [x] 2026-09-11 — **«Ganar peso» como objetivo.** El motor aprende
      superávit (con techo del 15%, más estrecho que el 20% del
      déficit), el simulador deja de decir «no alcanzable» a quien
      quiere engordar, y el michi cuenta el día al revés: cumplir es
      LLEGAR a las calorías, no quedarse por debajo.
- [x] 2026-09-11 — **Los botones dicen lo que hacen**, en una fila bajo
      el aparato que cambia con el contexto (Cuidar/Registrar/Dormir ↔
      Salir/Siguiente/Aceptar). Sustituye al cartelito de bienvenida que
      estaba previsto: uno se lee una vez y se olvida, esto enseña la
      gramática cada vez que la usas.
- [x] 2026-09-11 — «Mi pacto» pasa a ser **«Mi objetivo»** en las cinco
      lenguas, y la pantalla empieza por qué quieres conseguir: perder
      peso, mantenerte, estar más en forma, u otra cosa que escribes tú.
      Los tres primeros cambian el déficit de verdad.
- [x] 2026-09-11 — **La app cuenta la historia de Ninja.** Seis actos
      al primer arranque, antes de pedir un solo dato, y siempre a mano
      en Ajustes. Era el problema de fondo: nadie sabía para qué estaba
      el gato porque la app no lo decía en ninguna parte.
- [x] 2026-09-11 — `michi_sediento` y `michi_asqueado`, dibujados por
      Alberto, normalizados y teñidos a gris y blanco. Al teñir hubo que
      aprender a respetar el atrezo: el azul del agua y el verde del asco
      no son pelaje.
- [x] 2026-09-11 — Los tres botones del aparato pasan a ser la interfaz:
      dos anillos (cuidar y medir), con vista previa de la escena
      mientras eliges y el editor del día filtrado a un solo dato.
      Y dos barras nuevas: agua y orden, con cacas kawaii.
- [x] 2026-09-11 — Revisión del código: la caché del service worker
      estaba desfasada **en producción**, los tres botones del tamagotchi
      hablaban castellano en los cinco idiomas, y si el navegador no deja
      guardar ahora se avisa. Ver `SESSION_MAP.md`.
- [x] 2026-09-11 — «Michigochi» ya no aparece en ninguna línea de código
      vivo. La tarea se cerró sola, como decía que haría.
- [x] 2026-09-10 — El pacto se exporta al calendario del móvil (.ics),
      con los entrenos semanales y el recordatorio diario de apuntar.
      Es lo más cerca de una notificación que se puede hacer sin
      servidor, y funciona en todos los móviles.
- [x] 2026-09-10 — Tres gatos a elegir: naranja, gris y blanco. Los dos
      nuevos salen de teñir los naranjas, sin redibujar nada.
- [x] 2026-09-09 — El michi deja de reflejar tu cuerpo y pasa a reflejar
      tu constancia: una sola silueta y nueve dibujos (contento, cansado,
      triste, andando, comiendo, entrenando, durmiendo, celebrando, y el
      de pie). Celebra al subir de nivel.
- [x] 2026-09-09 — El huevo pasa a poder elegirse en siete colores,
      teñidos por código desde una sola imagen. El acabado liso está
      hecho y guardado en `_CUARENTENA/carcasas-lisas/`, fuera de la app.
- [x] 2026-09-09 — Borrar los datos exige un paso deliberado (escribir
      los días que se pierden) en vez de un `confirm()` del navegador.
- [x] 2026-09-09 — Revisión antes de abrir al público: 6 errores
      arreglados, 4 asuntos de seguridad cerrados (cabeceras, XSS
      latente, CSV, localStorage) y código muerto a `_CUARENTENA/`.
- [x] 2026-09-09 — Cinco idiomas (es/en/th/zh/ja) con selector en la
      cabecera. 295 cadenas, sistema propio sin libreria.
- [x] 2026-09-09 — Tamano de letra ajustable (normal/grande/muy grande).
- [x] 2026-09-09 — Arreglado el objetivo de calorias: era el mismo para
      cuerpos distintos. Cinco fallos encadenados, ver CURRENT.md.
- [x] 2026-09-08 — Carpetas ordenadas: las dos apps anteriores a `_ARCHIVO/`
      con su `LEEME.md`, y esta pasa a llamarse `2026_APP_MICHIFIT`.
- [x] 2026-09-08 — Importador del CSV de la MichiFit antigua, en Ajustes.
      Fusiona sin pisar. 72 días importados y verificados.
- [x] 2026-09-08 — PWA instalable: manifest, service worker (abre sin
      cobertura) e iconos generados del logo. Botones de ayuda "?" en
      Mi pacto, Progreso, Logros y Simular.
- [x] 2026-09-08 — Ejercicios por día de entreno (nombre, reps, peso) y
      macros opcionales al registrar el día. Ninguno cuenta para el pacto.
- [x] 2026-09-08 — Flecos de la mecánica resueltos (MECANICA.md §11).
- [x] 2026-09-08 — Panel de pruebas oculto tras siete toques en el logo.
- [x] 2026-09-08 — Aviso de sobreentrenamiento: ya estaba, salta al romper
      dos o más días de descanso en la semana.
- [x] 2026-09-08 — Botón azul del aparato = acción: cicla escena y pose
      (casa, comer, gimnasio, calle, dormir) con rótulo dentro de la
      pantalla. "Cómo va" pasa a tocar el cristal. Panel de PRUEBAS.
- [x] 2026-09-08 — Poses de dormir, comer y entrenar para los cinco cuerpos.
- [x] 2026-09-08 — Icono propio de Logros (medalla).
- [x] 2026-09-08 — Pantalla de Logros y hitos en el motor (no existían en
      esta app: se quedaron fuera al crearla). Iconos de Michi Finanzas
      siempre a color, escenarios sin deformar.
- [x] 2026-09-08 — Paleta pastel siempre (fuera el modo oscuro), logo en la
      cabecera, ajustes arriba, huevo de pixel art sin recuadro, marcador
      estilo videojuego y "+" de registro numerico.
- [x] 2026-09-08 — Pantalla de Karma, con la cuenta de Michi Finanzas.
- [x] 2026-09-08 — Pantalla de Progreso: gráfica de peso con previsión,
      calendario del pacto y registro de días pasados.
- [x] 2026-09-08 — Desplegada en https://michifit.vercel.app
- [x] 2026-09-07 — Proyecto nuevo con motor recalculado y cuatro pantallas.
- [x] 2026-09-07 — Mecánica de motivación diseñada (`MECANICA.md`).
- [x] 2026-09-07 — Asistente de primer arranque; app sin datos precargados.
- [x] 2026-09-07 — Michi en pixel art naranja dentro de un tamagotchi SVG.
- [x] 2026-09-07 — Paleta alineada con Michi Finanzas + fondo kawaii puesto.
- [x] 2026-09-08 — Paleta corregida: los marrones que había inventado para el
      modo oscuro (y las sombras marrones) sustituidos por los valores reales
      de MichiMind y Michi Finanzas.
