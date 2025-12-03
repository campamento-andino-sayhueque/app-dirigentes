"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getMessagingIfSupported } from "@/lib/firebase";

type PermissionState = "default" | "granted" | "denied";

export default function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>(() =>
    typeof window !== "undefined"
      ? (Notification.permission as PermissionState)
      : "default"
  );
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermissionAndRegister = async () => {
    setError(null);
    try {
      if (typeof window === "undefined") {
        setError("No disponible en servidor");
        return null;
      }

      const perm = await Notification.requestPermission();
      setPermission(perm as PermissionState);
      if (perm !== "granted") return null;

      // Registrar service worker en la raíz y enviarle la config de Firebase desde .env.local
      if ("serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          try {
            // Esperar a que el SW esté listo/activo
            const readyReg = await navigator.serviceWorker.ready;
            const cfg = {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
              messagingSenderId:
                process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };
            if (
              readyReg &&
              readyReg.active &&
              typeof readyReg.active.postMessage === "function"
            ) {
              readyReg.active.postMessage({
                type: "FIREBASE_CONFIG",
                config: cfg,
              });
            }
          } catch (postErr) {
            console.warn(
              "No se pudo enviar config al service worker:",
              postErr
            );
          }
        } catch (swErr) {
          console.warn("No se pudo registrar el service worker:", swErr);
        }
      }

      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        setError("Firebase messaging no soportado en este navegador");
        return null;
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey || undefined,
      });

      if (currentToken) {
        console.log("FCM token obtenido:", currentToken);
        setToken(currentToken);
        // Enviar token al backend para registrar (ajusta la URL según tu backend)
        debugger;
        try {
          const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "";
          const endpoint = backendBase
            ? `${backendBase}/api/device-tokens`
            : "/api/device-tokens";
          await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // enviar varios nombres por compatibilidad con posibles backends
            body: JSON.stringify({
              token: currentToken,
              registrationToken: currentToken,
              fcmToken: currentToken,
            }),
            credentials: "include",
          });
        } catch (sendErr) {
          console.warn("No se pudo enviar token al backend:", sendErr);
        }
      }

      return currentToken;
    } catch (err) {
      // evitar `any` en el catch
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : String(err);
      setError(msg ?? String(err));
      return null;
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const messaging = await getMessagingIfSupported();
      if (!messaging) return;

      try {
        unsub = onMessage(messaging, (payload) => {
          // Mensajes en primer plano
          console.log("FCM onMessage (foreground):", payload);
          // Aquí podrías mostrar un toast o UI personalizada
        }) as unknown as () => void;
      } catch (e) {
        console.warn("onMessage error:", e);
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { permission, token, error, requestPermissionAndRegister };
}
