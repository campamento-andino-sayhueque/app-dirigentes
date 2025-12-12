"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usuarioService, UsuarioModel } from "@/lib/api";
import { ArrowLeft, Mail, Shield, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Función para generar avatar de DiceBear
function getDiceBearAvatar(seed: string, style: string = "adventurer"): string {
  const cleanSeed = encodeURIComponent(seed.toLowerCase().trim());
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}&size=200`;
}

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [backendUser, setBackendUser] = useState<UsuarioModel | null>(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Proteger la ruta
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Obtener info del backend
  useEffect(() => {
    async function fetchBackendUser() {
      if (!user) return;
      
      try {
        setBackendLoading(true);
        const response = await usuarioService.getMe();
        if (response.data) {
          setBackendUser(response.data);
        } else if (response.error) {
          setBackendError(response.error.message || "Error desconocido");
        }
      } catch (error) {
        console.error("Error obteniendo datos del backend:", error);
        setBackendError("No se pudo conectar con el servidor");
      } finally {
        setBackendLoading(false);
      }
    }

    fetchBackendUser();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        </div>

        {/* Avatar y nombre */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
          <div className="flex flex-col items-center">
            <img
              src={user.photoURL || getDiceBearAvatar(user.email || user.uid)}
              alt={user.displayName || "Avatar"}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FF6B35] shadow-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800">
              {user.displayName || "Usuario"}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Información de Firebase */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#FF6B35]" />
            Información de cuenta
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Email verificado</span>
              </div>
              {user.emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Proveedor</span>
              <span className="text-gray-800 font-medium">Google</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600">UID</span>
              <span className="text-gray-800 font-mono text-sm truncate max-w-[200px]">
                {user.uid}
              </span>
            </div>
          </div>
        </div>

        {/* Información del Backend */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Información del servidor
          </h3>
          
          {backendLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : backendError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {backendError}
            </div>
          ) : backendUser ? (
            <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Nombre</span>
                <span className="text-gray-800 font-medium">{backendUser.nombreMostrar}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Roles</span>
                <div className="flex gap-2">
                  {backendUser.roles.length > 0 ? (
                    backendUser.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 bg-[#FF6B35] text-white text-xs rounded-full"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">Sin roles asignados</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Email verificado (backend)</span>
                {backendUser.emailVerificado ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
