# ROADMAP.md — Vision a medio/largo plazo

> Reescrito entero el 2026-09-12. La version anterior llevaba dias
> mintiendo: daba por pendiente la persistencia en IndexedDB —que esta
> DESCARTADA con razones en `TODO.md`—, dejaba sin marcar la PWA y las
> pantallas, que llevaban semanas hechas, y seguia esperando una «fusion
> con la MichiFit original» que ya ocurrio. Dos documentos que se
> contradicen son peores que uno solo: cuando toque decidir que sobra en
> la app, hay que decidirlo sobre la app que existe.
>
> Esto es el rumbo. El backlog concreto esta en `TODO.md` y las
> preguntas abiertas en `ASK.md`; aqui no se repiten.

## Objetivo

Un solo producto, **MichiFit**, que junte la precision numerica de la
app original —cuando llegas a tu peso objetivo— con la capa emocional
del tamagotchi: un michi que refleja tu CONSTANCIA. Local-first, sin
telemetria, sin prisa.

## Donde estamos (2026-09-12)

Hecho y en produccion, en `michifit.vercel.app`:

- [x] Motor de calculo: energia, forma, animo, XP, niveles, racha, hitos
- [x] Los cuatro suelos de seguridad, que son la promesa mas seria de la app
- [x] Michi en pixel art dentro de una carcasa de tamagotchi
- [x] El michi refleja la constancia, no el cuerpo (2026-09-09)
- [x] Las pantallas de la app, sustituyendo al banco de pruebas
- [x] PWA instalable y desplegada
- [x] Cinco idiomas (es / en / th / zh / ja)
- [x] **Fusion con la MichiFit original**: hecha por importador de CSV, en
      Ajustes. No hizo falta fusionar codigo — la app vieja exporta y esta
      importa sin pisar. La original sigue en `../_ARCHIVO/`.
- [x] Ninja tiene nombre, historia dentro de la app, y el color se elige
      al adoptarlo
- [x] Los tres botones son la interfaz, con la disposicion A/B/C de los
      tamagotchis de Bandai

Descartado, y por que:

- ~~Persistencia en IndexedDB~~ — no hace falta: son unos pocos KB de un
  solo usuario y caben de sobra en `localStorage`. Añadiria codigo
  asincrono a cambio de nada. Se reabre solo si algun dia se guardan
  fotos, y entonces toca un solo archivo (`datos/almacen.js`).
- ~~Importacion de Garmin Connect~~ — su API exige ser desarrollador
  certificado por Garmin, no basta con una clave.

## Lo siguiente

1. **Que se entienda sola.** Es la linea de trabajo abierta y la mas
   importante: la app funciona, y ahora toca que no haya que explicarla.
   Cada vez que alguien de fuera la ha probado ha salido algo —que no se
   entendia para que era el gato, que los botones confundian— y las dos
   veces el arreglo fue mejor que lo que estaba planeado. Sin recortar
   por recortar: primero mirar que pide la app que el usuario entienda.
2. **Los dibujos que faltan** (Alberto): las fotos del Ninja real y las
   21 viñetas del comic. El sitio esta hecho en los dos casos.
3. **Calibrar con uso real.** El ritmo de las barras de cuidados solo se
   sabe usando la app unos dias. Ya se ajusto una vez asi.

## Punto de decision abierto

**Donde vive la app y si tiene usuarios.** Hoy es estatica y local-first:
los datos no salen del dispositivo, y eso es lo que hace que no haga
falta backend, ni cuentas, ni politica de privacidad, ni servidor que
mantener. Alberto se esta planteando Hostinger con sistema de usuarios y
login (2026-09-12).

Es LA decision del proyecto, no una mas, porque casi todo lo demas
cuelga de ella: las notificaciones push necesitan servidor, sincronizar
entre movil y ordenador necesita cuentas, y las dos cosas rompen la
promesa de que los datos no salen de tu aparato. No hay que resolverlo
hoy, pero conviene no dar por supuesto que seguira siendo estatica.

## Fuera de alcance

- Garmin Health API (OAuth + webhooks).
- Telemetria, de cualquier tipo.
- Monedas virtuales, anuncios, «compra reintentos».
- Monetizacion. Apoyar es voluntario y NO desbloquea nada.
