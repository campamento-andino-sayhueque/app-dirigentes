"use client";

import { useState, useEffect } from "react";
import { api, type HealthResponse } from "@/lib/api";
import { casColors, casTailwind } from "@/lib/colors";

/**
 * Componente para verificar la conexión con el backend
 * Útil durante el desarrollo y para diagnosticar problemas
 */
export default function BackendHealthCheck() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async () => {
    setStatus("checking");
    setError(null);

    try {
      const response = await api.get<HealthResponse>("/api/health");

      if (response.error) {
        setStatus("error");
        setError(response.error);
      } else {
        setStatus("connected");
        setHealthData(response.data || null);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{
        borderLeftColor:
          status === "connected"
            ? casColors.nature.green[600]
            : status === "error"
            ? casColors.primary.red
            : casColors.ui.border,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: casColors.primary.black }}
        >
          Estado del Backend
        </h3>
        <button
          onClick={checkBackendHealth}
          className={casTailwind.btn.secondary}
          disabled={status === "checking"}
        >
          {status === "checking" ? "Verificando..." : "Verificar"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                status === "connected"
                  ? casColors.nature.green[600]
                  : status === "error"
                  ? casColors.primary.red
                  : casColors.ui.border,
            }}
          />
          <span className="text-sm font-medium">
            {status === "checking" && "Verificando conexión..."}
            {status === "connected" && "✅ Conectado al backend"}
            {status === "error" && "❌ Error de conexión"}
          </span>
        </div>

        {healthData && (
          <div className="bg-gray-50 rounded p-4 text-sm space-y-1">
            <p>
              <strong>Servicio:</strong> {healthData.service || "N/A"}
            </p>
            <p>
              <strong>Estado:</strong> {healthData.status || "N/A"}
            </p>
            <p>
              <strong>Mensaje:</strong> {healthData.message || "N/A"}
            </p>
            {healthData.timestamp && (
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(healthData.timestamp).toLocaleString("es-AR")}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          <p>
            API URL:{" "}
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
          </p>
        </div>
      </div>
    </div>
  );
}
