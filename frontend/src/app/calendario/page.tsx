import ProtectedRoute from "@/components/ProtectedRoute";

export default function CalendarioPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8 md:pt-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              📅 <span className="text-[#FF6B35]">Calendario</span>
            </h1>
            <p className="text-gray-600">
              Eventos y actividades del campamento
            </p>
          </header>

          <main className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-[#FF6B35] mb-2">30</div>
                <div className="text-xl text-gray-700 uppercase tracking-wide font-medium">
                  DÍAS
                </div>
                <p className="text-gray-600 mt-2">Faltan para el campamento</p>
              </div>
              <p className="text-gray-600 mt-8">
                Próximamente: Calendario completo de actividades
              </p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
