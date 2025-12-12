"use client";

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanPagoModel, MesEnum } from "@/lib/api/types";
import { pagosService } from "@/lib/api/pagos.service";

interface InscripcionModalProps {
  open: boolean;
  onClose: () => void;
  plan: PlanPagoModel | null;
  onConfirmar: (mesInicio: MesEnum, cuotasDeseadas: number) => void;
  loading: boolean;
}

export function InscripcionModal({
  open,
  onClose,
  plan,
  onConfirmar,
  loading
}: InscripcionModalProps) {
  const [cuotasDeseadas, setCuotasDeseadas] = useState<number>(6);

  const formatMonto = pagosService.formatMonto;
  const mesEnumToSpanish = pagosService.mesEnumToSpanish;

  // Reset cuando cambia el plan
  useEffect(() => {
    if (plan) {
      // Usar el valor medio o el mínimo si no hay rango
      const cuotasDefault = plan.minCuotas === plan.maxCuotas 
        ? plan.minCuotas 
        : Math.min(Math.max(6, plan.minCuotas), plan.maxCuotas);
      setCuotasDeseadas(cuotasDefault);
    }
  }, [plan]);

  // Opciones de cantidad de cuotas
  const opcionesCuotas = useMemo(() => {
    if (!plan) return [];
    const opciones: number[] = [];
    for (let i = plan.minCuotas; i <= plan.maxCuotas; i++) {
      opciones.push(i);
    }
    return opciones;
  }, [plan]);

  // ¿El plan tiene flexibilidad de cuotas?
  const rangoFlexible = plan ? plan.minCuotas !== plan.maxCuotas : false;

  // Monto por cuota calculado
  const montoPorCuota = useMemo(() => {
    if (!plan) return 0;
    return plan.montoTotal / cuotasDeseadas;
  }, [plan, cuotasDeseadas]);

  const handleConfirmar = () => {
    if (plan) {
      // Usamos el mesInicio del plan directamente
      onConfirmar(plan.mesInicio, cuotasDeseadas);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            📝 Inscripción a {plan.nombre}
          </DialogTitle>
          <DialogDescription>
            Configurá tu plan de pago para el año {plan.anio}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resumen del plan */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Monto total del campamento</p>
            <p className="text-2xl font-bold text-[#FF6B35]">
              {formatMonto(plan.montoTotal)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Período: {mesEnumToSpanish(plan.mesInicio)} a {mesEnumToSpanish(plan.mesFin)}
            </p>
          </div>

          {/* Selector de cantidad de cuotas */}
          {rangoFlexible ? (
            <div className="space-y-2">
              <Label htmlFor="cuotas">¿En cuántas cuotas querés pagar?</Label>
              <Select
                value={cuotasDeseadas.toString()}
                onValueChange={(value) => setCuotasDeseadas(parseInt(value))}
              >
                <SelectTrigger id="cuotas">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opcionesCuotas.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} cuotas - {formatMonto(plan.montoTotal / num)} c/u
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Podés elegir entre {plan.minCuotas} y {plan.maxCuotas} cuotas
              </p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">ℹ️</span>
                <div>
                  <p className="font-medium text-blue-800">
                    Plan de {plan.minCuotas} cuotas fijas
                  </p>
                  <p className="text-sm text-blue-600">
                    Este plan tiene una cantidad fija de cuotas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de lo que va a pagar */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 mb-2 font-medium">Tu plan de pago:</p>
            <div className="flex justify-between items-center">
              <span className="text-green-800">{cuotasDeseadas} cuotas de</span>
              <span className="text-xl font-bold text-green-700">
                {formatMonto(montoPorCuota)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={loading}
            className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
          >
            {loading ? 'Procesando...' : 'Confirmar inscripción'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
