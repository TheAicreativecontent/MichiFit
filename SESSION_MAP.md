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
