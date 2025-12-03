"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Bell, Moon, Globe, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import PushToggle from "@/components/PushToggle";

export default function ConfiguracionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Proteger la ruta
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-white/50 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Notificaciones
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-gray-800 font-medium">Notificaciones push</p>
                <p className="text-gray-500 text-sm">Recibir avisos en tu dispositivo</p>
              </div>
              <PushToggle />
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Moon className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Apariencia
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-gray-800 font-medium">Tema</p>
                <p className="text-gray-500 text-sm">Elige el aspecto de la app</p>
              </div>
              <select className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-[#FF6B35]">
                <option value="light">Claro</option>
                <option value="dark" disabled>Oscuro (próximamente)</option>
                <option value="system" disabled>Sistema</option>
              </select>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Idioma
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-gray-800 font-medium">Idioma de la app</p>
                <p className="text-gray-500 text-sm">Selecciona tu idioma preferido</p>
              </div>
              <select className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-[#FF6B35]">
                <option value="es">Español</option>
                <option value="en" disabled>English (próximamente)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Privacidad y seguridad
          </h3>
          
          <div className="space-y-2">
            <Link
              href="#"
              className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-gray-800">Política de privacidad</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              href="#"
              className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-gray-800">Términos de servicio</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Ayuda */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Ayuda
          </h3>
          
          <div className="space-y-2">
            <Link
              href="#"
              className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-gray-800">Centro de ayuda</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              href="#"
              className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-gray-800">Reportar un problema</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Versión */}
        <div className="text-center text-gray-400 text-sm">
          <p>CAS App v1.0.0</p>
          <p className="mt-1">Campamento Andino Sayhueque</p>
        </div>
      </div>
    </div>
  );
}
