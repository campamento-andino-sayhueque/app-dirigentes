"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import SeedDataButton from "@/components/SeedDataButton";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Proteger la ruta - redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Mostrar loading mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya está redirigiendo)
  if (!user) {
    return null;
  }

  // Extraer nombre del usuario
  const userName = user.displayName?.split(" ")[0] || "Usuario";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 md:pt-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            <span className="text-[#FF6B35]">Bienvenido, {userName}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Dirigente
          </p>
        </header>

        <main className="max-w-2xl mx-auto space-y-6">
          {/* Tarjetas de acceso rápido - inspiradas en el diseño */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link
              href="/sociales"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-bold text-gray-800">Sociales</h3>
            </Link>
            <Link
              href="/avisos"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">🔔</div>
              <h3 className="font-bold text-gray-800">Notificaciones</h3>
            </Link>
            <Link
              href="/pagos"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-bold text-gray-800">Estado de pagos</h3>
            </Link>
            <Link
              href="/calendario"
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-bold text-gray-800">Próximas reuniones</h3>
            </Link>
          </div>

          {/* Contador grande de días */}
          <Link href="/calendario">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center mb-8 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-6xl font-bold text-gray-900 mb-2">30</div>
              <div className="text-xl text-gray-700 uppercase tracking-wide font-medium">
                DÍAS
              </div>
              <p className="text-gray-600 mt-2">Faltan para el campamento</p>
            </div>
          </Link>

          {/* Próximas reuniones */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Próximas reuniones
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800">Exploradores</h3>
                  <p className="text-sm text-gray-600">20 de septiembre</p>
                </div>
                <span className="text-gray-700 font-medium">18:00</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-800">Caminantes</h3>
                  <p className="text-sm text-gray-600">25 de septiembre</p>
                </div>
                <span className="text-gray-700 font-medium">19:00</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">Consejo</h3>
                  <p className="text-sm text-gray-600">28 de septiembre</p>
                </div>
                <span className="text-gray-700 font-medium">20:00</span>
              </div>
            </div>
          </div>

          {/* Botón temporal para seed data */}
          <div className="max-w-md mx-auto">
            <SeedDataButton />
          </div>
        </main>
      </div>
    </div>
  );
}
