"use client";

import { useState } from "react";
import { casTailwind, casColors } from "@/lib/colors";

/**
 * Componente simple para probar la conexión con el backend de Railway
 */
export default function TestBackendSimple() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBackend = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      console.log("🔍 Llamando a:", `${apiUrl}/api/health`);

      const response = await fetch(`${apiUrl}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Respuesta recibida:", data);
      setResult(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      console.error("❌ Error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed"
      style={{ borderColor: casColors.primary.orange }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: casColors.primary.black }}
      >
        🧪 Test de Conexión Backend
      </h2>

      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
        <p>
          <strong>API URL:</strong>
        </p>
        <code
          className="text-xs break-all"
          style={{ color: casColors.primary.orange }}
        >
          {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
        </code>
      </div>

      <button
        onClick={testBackend}
        disabled={loading}
        className={casTailwind.btn.primary}
        style={{ width: "100%" }}
      >
        {loading ? "⏳ Probando..." : "🚀 Probar Conexión"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded">
          <h3 className="font-bold text-green-800 mb-2">
            ✅ ¡Conexión Exitosa!
          </h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Estado:</strong>{" "}
              <span className="text-green-700">{result.status}</span>
            </p>
            <p>
              <strong>Servicio:</strong> {result.service}
            </p>
            <p>
              <strong>Mensaje:</strong> {result.message}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(result.timestamp).toLocaleString("es-AR")}
            </p>
          </div>
          <pre className="mt-3 p-2 bg-gray-800 text-green-400 text-xs rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded">
          <h3 className="font-bold text-red-800 mb-2">❌ Error de Conexión</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
