# ASK.md — Preguntas pendientes (para Alberto)

## Decisiones pendientes
- [ ] **Como quedan las carpetas al renombrar a MichiFit.** Windows NO
      distingue mayusculas, asi que `2026_APP_MichiFit` y la carpeta que ya
      existe, `2026_APP_MICHIFIT` (la app original de una sola pagina), son
      el MISMO nombre para el sistema: no pueden convivir. Antes de renombrar
      `2026_APP_MICHIFIT_V2` hay que decidir que pasa con la original y con
      `2026_APP_MICHIGOCHI`: archivarlas (`_ARCHIVO/`), borrarlas o
      fusionarlas. Es cosa de Alberto, porque implica mover o perder
      historial.

- [ ] **Cuando renombrar Michigochi -> MichiFit en el codigo.** Ahora hay
      incoherencia entre el nombre del producto y el del codigo.

## Dudas tecnicas sin resolver
- [ ] (ninguna)

## Cerradas
- 2026-09-08 **Despliegue automatico desde GitHub**: hecho. El repo esta
  conectado en Vercel -> Settings -> Git, asi que cada `git push` despliega.
- 2026-09-08 **Flecos de la mecanica**: los cuatro resueltos, ver seccion 11
  de `MECANICA.md`.
- 2026-09-08 **Facturacion de Gemini**: NO se activa. Sin cuota de imagenes,
  `/banana` no genera nada; las ilustraciones las hace Alberto por fuera.
- 2026-09-08 **API de Garmin**: descartada. Requiere ser desarrollador
  certificado por Garmin, no basta con una clave. El importador del export
  de Garmin Connect tambien cae con ella.

## Cosas que preguntar a terceros
- [ ] (ninguna)
