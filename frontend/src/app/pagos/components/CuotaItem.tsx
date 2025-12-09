"use client";

import { Badge } from "@/components/ui/badge";
import { CuotaModel } from "@/lib/api/types";
import { pagosService } from "@/lib/api/pagos.service";
import { cn } from "@/lib/utils";

interface CuotaItemProps {
  cuota: CuotaModel;
  seleccionada: boolean;
  onToggle: (id: number) => void;
  disabled?: boolean;
}

export function CuotaItem({ cuota, seleccionada, onToggle, disabled }: CuotaItemProps) {
  const formatMonto = pagosService.formatMonto;
  const isPagada = cuota.estado === 'PAGADA';
  const isVencida = cuota.estado === 'VENCIDA';
  
  // Formatear fecha
  const fechaVencimiento = new Date(cuota.fechaVencimiento);
  const fechaFormateada = fechaVencimiento.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const estadoBadge = {
    'PAGADA': { className: 'bg-green-500', label: '✓ Pagada' },
    'PENDIENTE': { className: 'bg-yellow-500', label: 'Pendiente' },
    'VENCIDA': { className: 'bg-red-500', label: '⚠ Vencida' }
  }[cuota.estado];

  return (
    <div
      onClick={() => !isPagada && !disabled && onToggle(cuota.id)}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer",
        isPagada && "bg-green-50 border-green-200 cursor-default opacity-75",
        isVencida && !seleccionada && "bg-red-50 border-red-200",
        seleccionada && "bg-orange-50 border-[#FF6B35] shadow-md",
        !isPagada && !seleccionada && !isVencida && "bg-white border-gray-200 hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Checkbox visual */}
      <div className="flex items-center gap-4">
        {!isPagada && (
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              seleccionada 
                ? "bg-[#FF6B35] border-[#FF6B35] text-white" 
                : "border-gray-300"
            )}
          >
            {seleccionada && <span className="text-xs">✓</span>}
          </div>
        )}
        
        {/* Info de cuota */}
        <div>
          <p className="font-semibold text-gray-800">
            Cuota #{cuota.secuencia}
          </p>
          <p className="text-sm text-gray-500">
            Vence: {fechaFormateada}
          </p>
        </div>
      </div>

      {/* Monto y estado */}
      <div className="text-right flex items-center gap-3">
        <Badge className={estadoBadge.className}>{estadoBadge.label}</Badge>
        <p className="text-lg font-bold text-gray-800">
          {formatMonto(cuota.monto)}
        </p>
      </div>
    </div>
  );
}
