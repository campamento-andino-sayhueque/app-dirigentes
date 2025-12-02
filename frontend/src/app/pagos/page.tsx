"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PagosPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
  const backendBase =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

  // carga el SDK de Mercado Pago (v2) si hace falta
  const loadMpSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") return reject("no-window");
      if ((window as any).MercadoPago) return resolve();
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Mercado Pago SDK"));
      document.head.appendChild(script);
    });
  };

  const handleCreatePreference = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const body = {
        items: [{ title: "Donación CAS", quantity: 1, unitPrice: 100.0 }],
        successUrl: `${window.location.origin}/pagos/success`,
        failureUrl: `${window.location.origin}/pagos/failure`,
        pendingUrl: `${window.location.origin}/pagos/pending`,
      };

      const res = await fetch(
        `${backendBase}/api/mercadopago/checkout-pro/preferences`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const preferenceId = data.preferenceId || data.id;
      const initPoint = data.initPoint || data.init_point;

      if (!preferenceId && !initPoint) {
        throw new Error("Respuesta inválida del backend");
      }

      // Si tenemos Public Key intentamos renderizar el botón con el SDK (mejor UX)
      if (publicKey) {
        try {
          await loadMpSdk();
          const mp = new (window as any).MercadoPago(publicKey, {
            locale: "es-AR",
          });
          mp.checkout({
            preference: { id: preferenceId },
            render: {
              container: "#mp-checkout-button",
              label: "Pagar con Mercado Pago",
            },
          });
          setMessage(
            "Se creó la preferencia. Aparecerá el botón de pago abajo."
          );
        } catch (e) {
          // fallback a redirección si SDK falla
          if (initPoint) window.location.href = initPoint;
          else throw e as Error;
        }
      } else {
        // Sin Public Key, redirigimos al init_point
        if (initPoint) {
          window.location.href = initPoint;
        } else {
          setMessage("No hay Public Key ni init_point para completar el pago.");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      // extraer mensaje de manera segura
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as any).message
          : String(err);
      setMessage(msg || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // limpia cualquier render anterior de SDK cuando se desmonta la página
    return () => {
      const container = document.getElementById("mp-checkout-button");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              💳 <span className="text-[#FF6B35]">Pagos</span>
            </h1>
            <p className="text-gray-600">Estado de pagos y cuotas</p>
          </header>

          <main className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <p className="text-gray-600 mb-4">
                Pagar una donación de prueba de $100
              </p>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleCreatePreference}
                  disabled={loading}
                  className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-60"
                >
                  {loading ? "Creando preferencia..." : "Pagar $100"}
                </button>

                {message && <p className="text-sm text-gray-700">{message}</p>}

                {/* Aquí el SDK insertará el botón si es posible */}
                <div id="mp-checkout-button" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
