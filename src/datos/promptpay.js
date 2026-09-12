/* ============================================================
   MichiFit · PromptPay (propinas desde Tailandia)

   PromptPay es el estandar nacional tailandes de pagos por QR: lo
   escanea CUALQUIER app bancaria de alli, y es como paga todo el mundo
   en Tailandia. Lo pidieron los amigos de Alberto, que estan alli.

   Encaja con lo que ya hace la app y por eso se puede tener: un QR de
   PromptPay es una IMAGEN ESTATICA, igual que el de Lightning. Ni API,
   ni backend, ni tocar la CSP de `vercel.json`, ni un dato saliendo del
   dispositivo. Solo un PNG.

   ----------------------------------------------------------------
   COMO ACTIVARLO (esto lo tiene que hacer Alberto, no se puede desde
   aqui)

     1. Abre tu app del banco tailandes y busca «My QR» / «รับเงิน»
        (recibir dinero). Guarda o captura tu QR de PromptPay.
     2. Dejalo en `public/karma/promptpay_qr.png`. Cuadrado, y que se
        lea: 400x400 o mas.
     3. Pon `ACTIVO` a `true` aqui abajo.
     4. Sube `const CACHE` en `public/sw.js` — las imagenes de
        `public/karma/` no llevan hash en el nombre, asi que sin eso
        quien ya tenga la app instalada no veria el QR nuevo. Lo vigila
        `pruebas/cache-sw.mjs`.

   Es un interruptor escrito a mano y no una comprobacion de si el
   archivo existe, por lo mismo que `datos/ninja.js`: la app se sirve
   ESTATICA, no hay servidor que liste la carpeta, y preguntar por un
   archivo que no esta deja un 404 en la consola de todo el mundo.

   ----------------------------------------------------------------
   ANTES DE SUBIRLO, DOS COSAS

   **El repositorio es PUBLICO.** Un QR de PromptPay lleva dentro tu
   numero de telefono o tu numero de identidad — quien tenga la imagen
   puede leerlo con cualquier lector de QR. No es un dato que se pueda
   retirar despues: una vez en un commit, se queda en el historial
   aunque borres el archivo. Piensalo antes, no despues. Si prefieres no
   publicarlo, PromptPay admite tambien un numero de billetera (e-Wallet
   ID) que no es tu telefono.

   **Esto es una PROPINA, no una compra.** Vale para decir gracias, pero
   no sirve para cobrar dentro de la app: no hay forma de saber quien ha
   pagado. La regla del proyecto sigue igual —apoyar no desbloquea
   nada— y aqui ademas es que tecnicamente no podria.

   No hay boton de «abrir el banco» como el `lightning:` del otro
   bloque: Tailandia no tiene un esquema de URL comun para eso, cada
   banco lleva el suyo. El QR se escanea desde la app del banco, que es
   como se hace alli de todas formas — asi que el QR se enseña SIEMPRE,
   tambien en el movil.
   ============================================================ */

export const ACTIVO = false;

export const QR = '/karma/promptpay_qr.png';
