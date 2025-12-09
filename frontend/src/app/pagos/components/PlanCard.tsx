"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanPagoModel } from "@/lib/api/types";
import { pagosService } from "@/lib/api/pagos.service";

interface PlanCardProps {
  plan: PlanPagoModel;
  onInscribirse: (plan: PlanPagoModel) => void;
  disabled?: boolean;
}

export function PlanCard({ plan, onInscribirse, disabled }: PlanCardProps) {
  const formatMonto = pagosService.formatMonto;
  const mesEnumToSpanish = pagosService.mesEnumToSpanish;

  // Calcular el rango de cuotas para mostrar
  const rangoFlexible = plan.minCuotas !== plan.maxCuotas;
  const textoCuotas = rangoFlexible 
    ? `${plan.minCuotas} a ${plan.maxCuotas} cuotas`
    : `${plan.minCuotas} cuotas`;

  // Calcular valores por cuota
  const valorCuotaMin = plan.montoTotal / plan.maxCuotas;
  const valorCuotaMax = plan.montoTotal / plan.minCuotas;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Badge de activo */}
      {plan.activo && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl text-gray-800">{plan.nombre}</CardTitle>
        <CardDescription>
          Año {plan.anio} • {mesEnumToSpanish(plan.mesInicio)} a {mesEnumToSpanish(plan.mesFin)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Monto total */}
        <div className="text-center py-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Monto total del campamento</p>
          <p className="text-3xl font-bold text-[#FF6B35]">
            {formatMonto(plan.montoTotal)}
          </p>
        </div>

        {/* Flexibilidad de pago */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💳</span>
            <span className="font-medium text-blue-800">Pagá en {textoCuotas}</span>
          </div>
          {rangoFlexible ? (
            <p className="text-sm text-blue-600">
              Elegí cuántas cuotas te conviene pagar
            </p>
          ) : (
            <p className="text-sm text-blue-600">
              Plan de pago fijo
            </p>
          )}
        </div>

        {/* Valor por cuota */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          {rangoFlexible ? (
            <>
              <p className="text-sm text-gray-600 mb-1">Valor por cuota</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatMonto(valorCuotaMin)} a {formatMonto(valorCuotaMax)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Según la cantidad de cuotas que elijas
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-1">Valor por cuota</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatMonto(valorCuotaMin)}
              </p>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onInscribirse(plan)}
          disabled={disabled || !plan.activo}
          className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
        >
          {plan.activo ? '📝 Inscribirme' : 'No disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}
