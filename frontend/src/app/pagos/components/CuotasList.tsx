"use client";

import { CuotaModel } from "@/lib/api/types/pagos";
import { CuotaItem } from "./CuotaItem";
import { Button } from "@/components/ui/button";
import { pagosService } from "@/lib/api";

interface CuotasListProps {
  cuotas: CuotaModel[];
  cuotasSeleccionadas: number[];
  onToggleCuota: (cuotaId: number) => void;
  onSeleccionarTodas: () => void;
  onLimpiarSeleccion: () => void;
  onPagar: () => void;
  loading?: boolean;
  loadingPago?: boolean;
}

export function CuotasList({ 
  cuotas, 
  cuotasSeleccionadas, 
  onToggleCuota,
  onSeleccionarTodas,
  onLimpiarSeleccion,
  onPagar,
  loading = false,
  loadingPago = false
}: CuotasListProps) {
  // Separar cuotas pendientes de pagadas
  const cuotasPendientes = cuotas.filter(
    c => c.estado === 'PENDIENTE' || c.estado === 'VENCIDA'
  );
  const cuotasPagadas = cuotas.filter(c => c.estado === 'PAGADA');

  // Calcular monto total seleccionado
  const montoSeleccionado = cuotas
    .filter(c => cuotasSeleccionadas.includes(c.id))
    .reduce((total, c) => total + c.monto, 0);

  const todasSeleccionadas = cuotasPendientes.length > 0 && 
    cuotasPendientes.every(c => cuotasSeleccionadas.includes(c.id));

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (cuotas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay cuotas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cuotas pendientes */}
      {cuotasPendientes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <span>📋 Cuotas pendientes</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {cuotasPendientes.length}
              </span>
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={todasSeleccionadas ? onLimpiarSeleccion : onSeleccionarTodas}
              className="text-xs"
            >
              {todasSeleccionadas ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </Button>
          </div>
          <div className="space-y-2">
            {cuotasPendientes.map((cuota) => (
              <CuotaItem
                key={cuota.id}
                cuota={cuota}
                seleccionada={cuotasSeleccionadas.includes(cuota.id)}
                onToggle={() => onToggleCuota(cuota.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Barra de acción para pagar */}
      {cuotasSeleccionadas.length > 0 && (
        <div className="sticky bottom-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {cuotasSeleccionadas.length} cuota{cuotasSeleccionadas.length > 1 ? 's' : ''} seleccionada{cuotasSeleccionadas.length > 1 ? 's' : ''}
              </p>
              <p className="text-xl font-bold text-[#FF6B35]">
                {pagosService.formatMonto(montoSeleccionado)}
              </p>
            </div>
            <Button
              onClick={onPagar}
              disabled={loadingPago}
              className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6"
            >
              {loadingPago ? 'Procesando...' : 'Pagar ahora'}
            </Button>
          </div>
        </div>
      )}

      {/* Cuotas pagadas */}
      {cuotasPagadas.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <span>✅ Cuotas pagadas</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {cuotasPagadas.length}
            </span>
          </h4>
          <div className="space-y-2 opacity-75">
            {cuotasPagadas.map((cuota) => (
              <CuotaItem
                key={cuota.id}
                cuota={cuota}
                seleccionada={false}
                onToggle={() => {}} // No se puede seleccionar
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
