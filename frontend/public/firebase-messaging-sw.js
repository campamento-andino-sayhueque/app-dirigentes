/*
  Service worker para Firebase Cloud Messaging (background messages).
  INSTRUCCIONES:
  - Coloca este archivo en `public/` (ya está aquí).
  - Reemplaza las credenciales de firebase.initializeApp con las de tu proyecto
    (las mismas que usas en el cliente). No pongas claves sensibles en repos
    públicas.
  - En producción, sirve la app sobre HTTPS (requerido para Push).

  Nota: usamos las librerías 'compat' aquí porque es el patrón más sencillo para
  inicializar messaging dentro del service worker.
*/

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);
// El service worker puede inicializar Firebase con la configuración inyectada por el cliente
// en tiempo de ejecución mediante postMessage. Esto permite usar las vars de NEXT_PUBLIC
// desde .env.local sin necesidad de regenerar este archivo.

let _messaging = null;
let _initialized = false;
let _pending = [];

function initFirebase(config) {
  try {
    if (_initialized) return;
    if (!config) {
      console.warn(
        "[firebase-messaging-sw] initFirebase called without config"
      );
      return;
    }
    firebase.initializeApp(config);
    _messaging = firebase.messaging();
    _messaging.onBackgroundMessage(function (payload) {
      console.log(
        "[firebase-messaging-sw] Received background message ",
        payload
      );

      const envPrefix = config.appEnv && config.appEnv !== 'prod'
        ? `[${config.appEnv.toUpperCase()}] `
        : '';

      const notificationTitle =
        envPrefix + ((payload && payload.notification && payload.notification.title) ||
          "Notificación");

      const notificationOptions = {
        body:
          (payload && payload.notification && payload.notification.body) || "",
        icon: "/favicon.ico",
      };
      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
    _initialized = true;

    // procesar pendientes (si algún mensaje fue recibido antes de init)
    while (_pending.length) {
      const p = _pending.shift();
      try {
        self.registration.showNotification(p.title, p.options);
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    console.error("[firebase-messaging-sw] initFirebase error", e);
  }
}

// Si el cliente envía la config por postMessage, la inicializamos
self.addEventListener("message", (event) => {
  try {
    const data = event.data;
    if (data && data.type === "FIREBASE_CONFIG" && data.config) {
      initFirebase(data.config);
    }
  } catch (e) {
    console.warn("[firebase-messaging-sw] message handler error");
  }
});

// Fallback: si recibimos un push payload directamente antes de init, lo guardamos
self.addEventListener("push", function (evt) {
  try {
    const data = evt?.data?.json ? evt.data.json() : null;
    if (!_initialized && data && data.notification) {
      _pending.push({
        title: data.notification.title || "Notificación",
        options: { body: data.notification.body || "" },
      });
    }
  } catch (e) {
    // ignore
  }
});
