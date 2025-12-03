"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      // Register the service worker from the public folder
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // registration successful (silent)
        })
        .catch(() => {
          // registration failed (silent)
        });
    }
  }, []);

  return null;
}
