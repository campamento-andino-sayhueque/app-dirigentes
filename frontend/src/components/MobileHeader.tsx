"use client";

import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "./UserAvatar";

export default function MobileHeader() {
  const { user } = useAuth();

  // No mostrar el header si no está autenticado
  if (!user) {
    return null;
  }

  return (
    <header className="md:hidden bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="text-[#FF6B35]">CAS</span>
        </div>

        {/* Avatar */}
        <UserAvatar size="sm" showName={false} showDropdown={true} />
      </div>
    </header>
  );
}
