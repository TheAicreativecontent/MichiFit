# VERSION.md — La versión estándar

> Este archivo dice **qué versión es la buena** y **cómo sentarse a
> trabajar desde cualquier sitio**. Si vienes del móvil o del otro
> portátil y no sabes por dónde ibas, empieza aquí y sigue por
> `CURRENT.md`.

## La estándar, hoy

**v0.7.13** — 23 de septiembre de 2026.

| Dónde | Qué vale |
|---|---|
| Etiqueta de Git | `v0.7.13` |
| `package.json` | `"version": "0.7.13"` |
| Caché del service worker | `michifit-v17` |
| Dentro de la app | Ajustes, última línea |
| En vivo | https://michifit.vercel.app |
| Repositorio | https://github.com/TheAicreativecontent/MichiFit |

Todos esos sitios dicen lo mismo **a propósito**. Si algún día no coinciden,
el que manda es la etiqueta de Git: lo demás se pone al día con ella.

## Qué es la v0.7.x

La app entera y funcionando: motor de cálculo, cinco objetivos, PWA
instalable que se abre sin cobertura, cinco idiomas, el aparato con sus
tres botones y el anillo de siete iconos, la historia de Ninja con sus
fotos de verdad, e importador del CSV de la MichiFit antigua.

Es la primera versión que se numera. Hasta hoy el proyecto vivía en
`0.0.0` y la única forma de saber qué tenías delante era mirar el último
commit — lo cual funciona en el portátil donde está el repositorio y no
funciona en el móvil.

Y desde la `0.7.1` **el número se ve dentro de la app**, al final de
Ajustes. Ahí es donde de verdad hace falta: es la única forma de saber,
con el móvil en la mano, si lo que tienes delante es lo último.

## Trabajar desde otro sitio

### Desde el móvil
No hace falta nada: entra en https://michifit.vercel.app. Si ya la
tienes instalada en la pantalla de inicio, al abrirla se actualiza sola
(el HTML va a la red primero, y la v7 tira la caché vieja).

Para **mirar** el código o los documentos sin ordenador, se leen en
GitHub desde el navegador del móvil.

### Desde el otro portátil
```
git clone https://github.com/TheAicreativecontent/MichiFit.git
cd MichiFit
npm install
npm run dev
```
Y si ya lo tenías clonado, lo primero de todo, **siempre**:
```
git pull
```

> Esto no es una formalidad. El 13 de septiembre se trabajó desde otro
> sitio y este portátil se quedó cuatro commits atrás; al día siguiente
> parecía que producción tenía cosas que nadie había escrito. No se
> había perdido nada, pero costó un rato entenderlo.

### Al terminar, desde donde sea
```
git push
```
Vercel despliega solo con cada push a `main`. Si no lo subes, el
siguiente sitio no lo verá.

## Cómo se sube de versión

Al cerrar una tanda de trabajo que merezca marcarse:

1. `package.json` → sube el número.
2. `public/sw.js` → sube `const CACHE` **solo si cambió alguna imagen
   sin hash** (todo lo de `/michi`, `/fondos`, `/iconos-anillo`). La
   regla larga está escrita en ese archivo.
3. `node pruebas/cache-sw.mjs` para comprobar que la caché va al día.
4. Actualiza la tabla de aquí arriba.
5. Commit, `git tag -a vX.Y.Z`, y `git push --follow-tags`.

## Historial

- **v0.7.13** (2026-09-23) — El botón de ampliar/reducir el michi (y el
  de guardar copia, que comparte estilo) se confundían con el fondo:
  fondo `--chip` casi del mismo tono crema que el fondo de la página,
  borde apenas visible. Ahora llevan fondo blanco y sombra, como los
  botones de la cabecera (ajustes, idioma) — se nota mejor que son
  botones. Sin cambios de imagen: caché igual.

- **v0.7.12** (2026-09-23) — Un retoque más a la gráfica de hábitos,
  pedido por Albert con una captura suya marcando el problema: las
  barras llegaban justo al borde de la tarjeta blanca («al límite del
  contenedor»), sin margen. Era el full-bleed de la v0.7.10 —pensado
  para que las barras llegaran al borde del DISPOSITIVO— pero también
  las pegaba al borde de la TARJETA, que es donde de verdad se notaba.
  Quitado: ahora usa el margen normal de cualquier tarjeta de la app
  (18px), igual que el resto de Progreso. Sin cambios de imagen: caché
  igual.

- **v0.7.11** (2026-09-23) — Dos retoques a la gráfica de hábitos de la
  v0.7.10, pedidos por Albert nada más probarla. La vista Año ahora
  enseña los doce meses del año en curso siempre, aunque no haya datos
  (con el color neutro de «sin datos»), para ver el año entero de un
  vistazo — antes solo salían los meses con algún día evaluable. Y la
  vista de 30 días ya no hace scroll horizontal: las barras se encogen
  para caber todas en el ancho del dispositivo, con una de cada cinco
  etiquetas (más «hoy») para no abarrotar. Sin cambios de imagen: caché
  igual.

- **v0.7.10** (2026-09-23) — Dos cosas más que se vieron nada más
  probar la v0.7.9. Primera: el ritmo real de peso seguía mal (62
  semanas con datos reales de Albert) — no era el historial largo, era
  que un solo pesaje raro (una bajada de golpe el último día) torcía la
  regresión por mínimos cuadrados entera. Se cambió a Theil-Sen
  (mediana de pendientes entre pares de días), que ignora ese tipo de
  valor suelto; con los mismos datos reales ahora da ~7 semanas.
  Segunda: la pantalla de Progreso reordenada según pidió Albert (los
  cuatro recuadros con el ritmo dentro del de «hasta la meta», la
  gráfica de peso debajo, el calendario, y la gráfica de hábitos con
  selector 7 días / 30 días / año, a ancho completo de dispositivo);
  y Logros se movió de Progreso a Mi objetivo, al final. Sin cambios de
  imagen: caché igual.

- **v0.7.9** (2026-09-23) — Arreglado el bug de las 14,3 semanas: el
  ritmo real de peso miraba TODO el historial de pesajes, y con un
  historial largo (el CSV importado, por ejemplo) las últimas semanas
  buenas se diluían entre meses de datos viejos. Ahora solo mira los
  últimos 30 días. Y cuatro gráficas nuevas en Progreso, últimos 7 días
  de entreno, pasos, comida y sueño, sin macros.

- **v0.7.8** (2026-09-22) — Dos ajustes más, pedidos por Albert nada más
  probar la v0.7.7: el icono de guardar copia también en Inicio (junto
  al zoom y el «?», con un ✅ de confirmación), y el brinco de mimar/
  agua/limpiar/registrar ya no cambia de fondo — antes, si el michi
  paseaba en el parque y le dabas cariño, saltaba un instante a «casa»
  y volvía. Ahora el brinco salta encima de la escena que ya se veía.

- **v0.7.7** (2026-09-22) — Dos avisos de Albert, resueltos: el michi ya
  no se queda dormido y mudo para siempre si llevas días sin abrir la
  app (era un bug de origen, no un diseño), y hay una copia de
  seguridad completa en Ajustes (perfil, objetivo, cada día, el michi)
  para no depender solo de que el móvil no borre `localStorage`. Sin
  cambios de imagen: caché igual.

- **v0.7.6** (2026-09-19) — Cambios de la pareja de Albert, media hora
  después de lanzar: el texto de la viñeta 13 es el que escribió ella en
  tailandés (más de 5.000 baht al día; Anna, con sus conocimientos de
  enfermería, compró material y suero y curó a Ninja) y el collage de la
  última pantalla lleva otra foto, recomprimida de 940 a 240 KB. Caché
  `michifit-v17`.

- **v0.7.5** (2026-09-19) — La versión que se manda a amigos y familia, con
  el enlace y sin cuentas. Viñeta nueva del cómic («Anna lo cura en
  casa», 15 en total); PromptPay en Karma, el primero, y un botón «Salir»;
  al terminar el cómic, «Cerrar» y «Saltar» llevan a Karma; el ritmo de las
  cacas arreglado (salían a los 5 minutos de limpiar y el michi estaba
  asqueado casi siempre); `FORMA_CONTENTO` 95; gimnasio nuevo; el michi
  comiendo más abajo; «Hasta la meta» al ganar peso; y los puntos 2 a 5 de
  `SIMPLICIDAD.md` (puntitos para el cuidado, la ventana de 3 días y la
  regla de la comida a la vista, el escudo explicado). Se retira la cara
  `cansado`. Caché `michifit-v16`.

- **v0.7.4** (2026-09-18) — El orden de los cuidados del michi (caca →
  asqueado, sed al 75% → sediento, con todo atendido de pie) y el michi de
  pie vuelve a salir más que el sentado (`contento` pide `forma` 90). Se
  arregla también el test `cobertura-michi`, que estaba en rojo en
  `main` desde el cambio de entreno/sueño. Sin dibujos nuevos: caché
  `michifit-v15`.
- **v0.7.3** (2026-09-19) — Todo lo trabajado entre el 14 y el 19 de
  septiembre sin etiquetar todavía: Ninja con foto e historia, los 40
  michis en dibujo de Albert (no del script), el anillo abajo y siempre
  visible, el cómic de 14 viñetas, el calendario sin castigar por no
  apuntar, la gráfica de Progreso comprimida a la meta y siguiendo lo que
  de verdad se apunta (no solo el pacto), y entreno/sueño cumpliendo por
  apuntar en vez de por llegar al número. Detalle día a día en
  `CURRENT.md`. Caché `michifit-v15`.
- **v0.7.2** (2026-09-14) — El aparato se puede ampliar, y la pantalla
  de Inicio ya tiene su «?». Caché `michifit-v7`.
- **v0.7.1** (2026-09-14) — Dormir y apuntar el sueño pasan a ser UN
  solo botón del anillo, con la luna; cancelar el editor deja al michi
  dormido igual. Y la versión se ve en Ajustes. Caché `michifit-v7`.
- **v0.7.0** (2026-09-14) — Primera versión numerada. Base estándar de
  trabajo. Caché `michifit-v7`.
- Antes de esto, el historial vive en `SESSION_MAP.md`, día a día desde
  el 7 de septiembre de 2026.
