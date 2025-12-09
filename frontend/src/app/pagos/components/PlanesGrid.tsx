"use client";

import { PlanPagoModel } from "@/lib/api/types";
import { PlanCard } from "./PlanCard";

interface PlanesGridProps {
  planes: PlanPagoModel[];
  loading: boolean;
  onInscribirse: (plan: PlanPagoModel) => void;
}

export function PlanesGrid({ planes, loading, onInscribirse }: PlanesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-80 bg-gray-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (planes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No hay planes disponibles
        </h3>
        <p className="text-gray-600">
          Actualmente no hay planes de pago activos. Por favor, vuelve más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {planes.map((plan) => (
        <PlanCard
          key={plan.codigo}
          plan={plan}
          onInscribirse={onInscribirse}
        />
      ))}
    </div>
  );
}
