"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Users, Calendar, CreditCard, Bell } from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function MobileFooter() {
  const pathname = usePathname();
  const { user } = useAuth();

  // No mostrar el footer si no está autenticado
  if (!user) {
    return null;
  }

  // Calcular días que faltan para el campamento
  // Ejemplo: próximo campamento 1 de diciembre 2025
  const campDate = new Date("2025-12-01");
  const today = new Date();
  const diffTime = campDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const navItems = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Sociales", href: "/sociales", icon: Users },
    { name: "Calendario", href: "/calendario", icon: Calendar, isCenter: true },
    { name: "Pagos", href: "/pagos", icon: CreditCard },
    { name: "Avisos", href: "/avisos", icon: Bell },
    { name: "Perfil", href: "/perfil", icon: Users }, // Added Profile link explicitly
  ];

  return (
    <>
      {/* Desktop Navigation - NO fixed, parte del flujo del grid */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Título */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-[#FF6B35]">CAS</span>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.isCenter) {
                  // Contador de días en desktop
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white hover:shadow-lg transition-shadow"
                    >
                      <Calendar className="w-5 h-5" />
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-bold">{diffDays}</span>
                        <span className="text-xs">días</span>
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "text-[#FF6B35] bg-orange-50"
                        : "text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Avatar del usuario con dropdown */}
            <UserAvatar size="md" showName={true} showDropdown={true} />
          </div>
        </div>
      </nav>

      {/* Mobile Footer - Fixed en la parte inferior, solo visible en móviles */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-end justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isCenter) {
              // Botón central con el número de días
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex flex-col items-center -mt-8"
                >
                  <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white leading-none">
                        {diffDays}
                      </div>
                      <div className="text-[10px] text-white uppercase tracking-tight">
                        días
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            }

            // Botones normales
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors ${
                  isActive ? "text-[#FF6B35]" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-[#FF6B35]" : "text-gray-600"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    isActive ? "text-[#FF6B35]" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
