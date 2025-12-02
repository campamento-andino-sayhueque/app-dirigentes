"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirigir a dashboard si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Mostrar loading mientras verifica la autenticación o está redirigiendo
  if (loading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  // Página de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏕️</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-[#FF6B35]">Campamento</span>{" "}
              <span className="text-green-600">Andino</span>
            </h1>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Sayhueque</h2>
          </div>
          <p className="text-xl text-gray-700 mb-2">Sistema de Gestión</p>
          <p className="text-gray-600">Para dirigentes y participantes</p>
        </div>

        {/* Botón de login (ya incluye su propio card) */}
        <LoginButton />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            🌲 Aventura, naturaleza y crecimiento personal 🏔️
          </p>
        </div>
      </div>
    </div>
  );
}
