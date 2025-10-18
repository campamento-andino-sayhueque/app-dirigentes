import LoginButton from "@/components/LoginButton";
import SeedDataButton from "@/components/SeedDataButton";
import BackendHealthCheck from "@/components/BackendHealthCheck";
import TestBackendSimple from "@/components/TestBackendSimple";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-[#FF6B35]">Campamento</span>{" "}
            <span className="text-green-600">Andino</span>{" "}
            <span className="text-red-600">Sayhueque</span>
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Gestión del Campamento
          </p>
        </header>

        <main className="max-w-2xl mx-auto space-y-6">
          {/* Prueba simple de conexión */}
          <TestBackendSimple />

          {/* Verificación de conexión con el backend */}
          <BackendHealthCheck />

          <div className="max-w-md mx-auto space-y-6">
            <LoginButton />
            <SeedDataButton />
          </div>
        </main>

        <footer className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Aventura, naturaleza y crecimiento personal
          </p>
        </footer>
      </div>
    </div>
  );
}
