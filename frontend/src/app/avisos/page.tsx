import ProtectedRoute from "@/components/ProtectedRoute";

export default function AvisosPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🔔 <span className="text-[#FF6B35]">Avisos</span>
            </h1>
            <p className="text-gray-600">Notificaciones y comunicados</p>
          </header>

          <main className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <p className="text-gray-600">
                Próximamente: Centro de notificaciones
              </p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
