"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";

// Estilos disponibles de DiceBear para avatares
type AvatarStyle = 
  | "adventurer"
  | "adventurer-neutral"
  | "avataaars"
  | "big-ears"
  | "big-smile"
  | "bottts"
  | "croodles"
  | "fun-emoji"
  | "icons"
  | "identicon"
  | "lorelei"
  | "micah"
  | "miniavs"
  | "notionists"
  | "open-peeps"
  | "personas"
  | "pixel-art"
  | "shapes"
  | "thumbs";

/**
 * Genera una URL de avatar usando DiceBear API
 * @param seed - Semilla para generar avatar único (email, uid, nombre)
 * @param style - Estilo del avatar
 * @param size - Tamaño en píxeles
 */
function getDiceBearAvatar(
  seed: string,
  style: AvatarStyle = "adventurer",
  size: number = 128
): string {
  // Limpiar la semilla para URL
  const cleanSeed = encodeURIComponent(seed.toLowerCase().trim());
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${cleanSeed}&size=${size}`;
}

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  showDropdown?: boolean;
  avatarStyle?: AvatarStyle;
}

export default function UserAvatar({
  size = "md",
  showName = false,
  showDropdown = true,
  avatarStyle = "adventurer",
}: UserAvatarProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  // Tamaños del avatar
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  // Obtener iniciales del nombre
  const getInitials = (name: string | null): string => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generar color de fondo basado en el email (consistente)
  const getAvatarColor = (email: string | null): string => {
    if (!email) return "bg-gray-400";
    const colors = [
      "bg-[#FF6B35]", // Naranja CAS
      "bg-emerald-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index =
      email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  const initials = getInitials(user.displayName);
  const avatarColor = getAvatarColor(user.email);
  const firstName = user.displayName?.split(" ")[0] || "Usuario";
  
  // Generar avatar de DiceBear usando el email como semilla (consistente)
  const diceBearUrl = getDiceBearAvatar(
    user.email || user.uid,
    avatarStyle,
    128
  );
  
  // Determinar qué imagen usar: Google photo > DiceBear > Iniciales
  const avatarImageUrl = user.photoURL || (!imageError ? diceBearUrl : null);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Componente de avatar reutilizable
  const AvatarImage = ({ className }: { className: string }) => {
    if (avatarImageUrl && !imageError) {
      return (
        <img
          src={avatarImageUrl}
          alt={user.displayName || "Avatar"}
          className={`${className} rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      );
    }
    
    // Fallback a iniciales
    return (
      <div
        className={`${className} ${avatarColor} rounded-full flex items-center justify-center text-white font-bold`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => showDropdown && setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 rounded-full transition-all ${
          showDropdown
            ? "hover:ring-2 hover:ring-[#FF6B35] hover:ring-offset-2"
            : ""
        } focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-2`}
      >
        {/* Avatar Image */}
        <AvatarImage className={`${sizeClasses[size]} border-2 border-white shadow-md`} />

        {/* Nombre opcional */}
        {showName && (
          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-gray-700 font-medium">{firstName}</span>
            {showDropdown && (
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header del usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <AvatarImage className="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.displayName || "Usuario"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/perfil"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              Mi perfil
            </Link>
            <Link
              href="/configuracion"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              Configuración
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
