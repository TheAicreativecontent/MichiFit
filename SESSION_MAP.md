# SESSION_MAP.md — Diario de sesiones

## 2026-09-07
- Contexto: tras decidir fusionar las dos apps en una nueva y limpia, y tras la
  sesión de diseño de la mecánica de motivación.
- Qué se hizo:
  - Proyecto creado desde cero.
  - Motor portado y **recalculado**: `forma` ya no sale del IMC sino del
    cumplimiento del pacto. Añadidos pacto, comodines, racha y niveles.
  - Fórmulas energéticas traídas tal cual de la app original.
  - Cuatro pantallas: Inicio, Mi pacto, Simular, Ajustes.
  - Verificado en navegador contra las capturas de la app original.
- **Tres fallos encontrados y corregidos en la primera ejecución:**
  - El suelo de nivel *promocionaba* a un usuario nuevo al nivel 2 con 0 XP,
    porque `Math.max(SUELO, ...)` empuja hacia arriba si no se acota antes.
  - Se contaban como semanas falladas los días **anteriores a crear el pacto**:
    un usuario nuevo arrancaba castigado.
  - El perfil vacío del almacén pisaba con `null` los valores de arranque, y el
    simulador decía que no había perfil.
  - **Cambio a mitad de sesión**: la app será pública en GitHub, así que se
    quitó el perfil precargado y se añadió un asistente de primer arranque.
    Cuarto fallo encontrado al probarlo: `tmb()` esperaba un campo `peso` pero
    el perfil usa `pesoActual`, así que la estimación del metabolismo devolvía
    null. Estaba enmascarado porque el perfil de prueba traía el dato del reloj.
- Qué quedó pendiente: pantalla de registro de días pasados; Progreso; paleta
  del michi; pixel art en color; `base` de Vite antes de publicar.

## Plantilla para copiar
## AAAA-MM-DD
- Contexto:
- Qué se hizo:
- Qué quedó pendiente:
- Decisiones tomadas:

## 2026-09-08 (tarde) — Poses, botón de acción y la app instalable

- **Poses del michi**: dormido, comiendo y entrenando para los cinco cuerpos.
  La hoja de entrenar traía a los cinco pegados por las mancuernas; se
  resolvió cortando por **costuras** (camino vertical de mínimo coste) en
  vez de por columnas rectas, que partían las pesas por la mitad.
- **Botón azul = acción**: cicla casa → comer → gimnasio → calle → dormir,
  con rótulo dentro de la pantalla. "Cómo va" se movió a tocar el cristal.
- **Panel de pruebas oculto**: siete toques en el logo.
- **Ejercicios por día** (nombre, reps, peso) en el pacto, que se marcan
  desde el editor del día y tiñen el módulo. Y **macros** opcionales.
  Ninguno de los dos cuenta para el pacto: son chuleta e información.
- **PWA**: manifest, service worker e iconos generados del logo. Verificado
  en producción: el SW queda `activated` y la caché creada.
- **Botones de ayuda "?"** en Mi pacto, Progreso, Logros y Simular.
- **Flecos de la mecánica resueltos** (MECANICA.md §11): semana en lunes,
  corazón partido al gastar comodín, calorías que pesan la mitad, add-ons
  que se pierden al bajar de nivel.
- **GitHub → Vercel conectado** por Alberto: se subieron 25 commits y el
  push disparó el despliegue automático. Confirmado que funciona.
- Descartados: la API de Garmin (exige desarrollador certificado) y pagar
  Gemini. IndexedDB se descarta por innecesario, no por falta de tiempo.

## 2026-09-08 (noche) — Una sola carpeta y el progreso rescatado

- **Carpetas ordenadas.** `_ARCHIVO/` con la MichiFit original y Michigochi,
  enteras y con un `LEEME.md` que cuenta qué hay en cada una, qué sobrevive
  en la app nueva y cómo levantarlas si hiciera falta. Esta carpeta pasa a
  ser `2026_APP_MICHIFIT`, la única.
- No se pudo mover la carpeta con `mv`: la bloqueaba la propia sesión de
  Claude Code, que la tenía de directorio de trabajo. Se resolvió moviendo
  el **contenido** en vez de la carpeta. Apuntado en `LESSONS.md`.
- **Importador del CSV** de la app antigua, en Ajustes. Enseña qué va a
  entrar antes de tocar nada y fusiona sin pisar. Probado con el CSV real
  de Alberto: 72 días, 28 → 85 entradas, cero campos pisados.
- La columna `sueno` de ese CSV **no son horas** (44 a 85: es la puntuación
  de Garmin). Se guarda en `importado.suenoPuntos` en vez de inventar horas.
- Los meses importados quedan fuera de la ventana del motor (arranca en
  `pacto.creado`), así que alimentan la gráfica sin tocar racha ni nivel.
- Los CSV de datos personales al `.gitignore`: el repo es público.

## 2026-09-09 — Calorias, letra e idiomas

Tres encargos de Alberto, despues de que su madre y su chica probaran la app.

1. **«A las tres nos sale 1500 kcal».** No era la formula: eran cinco
   fallos encadenados, y el principal es que el objetivo de comida se
   congelaba al crear el pacto. Todo pasa ya por `planEnergetico()`.
   El perfil de 72a/158cm/72kg pasaba de 865 kcal/dia a 1.238.
2. **«La letra es muy pequena».** No se subieron los 72 tamanos a mano:
   se paso el CSS a `calc(Npx * var(--escala))` y se anadio un control
   de tres tamanos en Ajustes. Por defecto queda igual que antes.
3. **Cinco idiomas**: es, en, th, zh, ja. 295 cadenas, sistema propio en
   `src/i18n/`, selector de mundo en la cabecera.

Comprobado en el navegador: los cuatro idiomas nuevos por las siete
pestanas, cero claves crudas, cero castellano suelto, cero desbordes.

### 2026-09-09 (tarde) — Revisión antes de abrir al público

Alberto pidió buscar errores, código inútil y fallos de seguridad, sin
borrar nada: lo que sobre, a cuarentena.

**Seis errores**, y el primero llevaba tiempo: el motor leía `suenoHoras`
plano cuando el editor guarda `sueno: { horas }`, así que **el sueño no
afectaba al michi** aunque la pantalla lo mostrase. Igual con el estrés, y
las mismas columnas salían vacías en la copia de seguridad. Además: un
déficit negativo proponía comer de más, los carbos podían salir negativos
y la descarga del CSV podía no llegar a empezar.

**Cuatro de seguridad:** los 14 `dangerouslySetInnerHTML` pasan a un
componente `<T>` que no ejecuta HTML; se añaden las cabeceras, que no
existían; `aCSV` escapa comas y fórmulas de Excel; y lo que sale de
localStorage se valida por tipo.

**Cuarentena** en `_CUARENTENA/`: `Michi.jsx` (el SVG que nadie
importaba), dos constantes sustituidas por el diccionario y 13 reglas de
CSS. Nada borrado.

Y como cierre, el `confirm()` de borrar los datos pasa a ser una hoja de
la app que enseña qué se pierde, ofrece la copia de seguridad antes y
pide escribir el número de días. Un número, no una palabra: «BORRAR» en
un teclado tailandés o japonés sería una trampa.

