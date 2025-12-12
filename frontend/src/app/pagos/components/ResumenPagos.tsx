"use client";

import { Card, CardContent } from "@/components/ui/card";
import { pagosService } from '@/lib/api';

interface ResumenPagosProps {
  montoPagado: number;
  montoPendiente: number;
  totalCuotas: number;
  cuotasPagadas: number;
  cuotasVencidas: number;
}

export function ResumenPagos({
  montoPagado,
  montoPendiente,
  totalCuotas,
  cuotasPagadas,
  cuotasVencidas
}: ResumenPagosProps) {
  const formatMonto = pagosService.formatMonto;
  const progreso = totalCuotas > 0 ? Math.round((cuotasPagadas / totalCuotas) * 100) : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Monto pagado */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Pagado</p>
            <p className="text-xl font-bold text-green-700">
              {formatMonto(montoPagado)}
            </p>
          </div>

          {/* Monto pendiente */}
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600 mb-1">Pendiente</p>
            <p className="text-xl font-bold text-orange-700">
              {formatMonto(montoPendiente)}
            </p>
          </div>

          {/* Progreso de cuotas */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Cuotas</p>
            <p className="text-xl font-bold text-blue-700">
              {cuotasPagadas}/{totalCuotas}
            </p>
          </div>

          {/* Cuotas vencidas */}
          <div className={`text-center p-4 rounded-lg ${cuotasVencidas > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className={`text-sm mb-1 ${cuotasVencidas > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              Vencidas
            </p>
            <p className={`text-xl font-bold ${cuotasVencidas > 0 ? 'text-red-700' : 'text-gray-700'}`}>
              {cuotasVencidas}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso de pago</span>
            <span>{progreso}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF6B35] to-green-500 transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
