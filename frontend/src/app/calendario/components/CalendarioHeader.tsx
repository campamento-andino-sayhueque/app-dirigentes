import { casColors } from "@/lib/colors";
import { ApiError } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CalendarioHeaderProps {
  diasRestantes: number;
  onNewEvent: () => void;
  error?: ApiError | null;
}

export function CalendarioHeader({ diasRestantes, onNewEvent, error }: CalendarioHeaderProps) {
  return (
    <div className="mb-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          📅 <span className="text-[#FF6B35]">Calendario</span>
        </h1>
        <p className="text-gray-600">
          Eventos y actividades del campamento
        </p>
        {error && (
          <p className="text-red-600 text-sm mt-2">
            ❌ Error al conectar con el servidor: {error.message}
          </p>
        )}
      </header>

      {/* Contador de días */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border-2 border-[#FF6B35]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl md:text-6xl font-bold text-[#FF6B35]">
                {diasRestantes}
              </div>
              <div className="text-left">
                <div className="text-lg md:text-2xl text-gray-700 uppercase tracking-wide font-medium">
                  DÍAS
                </div>
                <p className="text-gray-600 text-xs md:text-base">
                  para el campamento 2025/2026
                </p>
              </div>
            </div>
            <Button
              onClick={onNewEvent}
              className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Nuevo evento</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
