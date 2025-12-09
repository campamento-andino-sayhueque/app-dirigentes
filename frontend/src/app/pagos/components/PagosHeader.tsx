"use client";

import { Button } from "@/components/ui/button";

interface PagosHeaderProps {
  vistaActual: 'planes' | 'cuotas' | 'historial';
  onChangeVista: (vista: 'planes' | 'cuotas' | 'historial') => void;
  tieneInscripcion: boolean;
}

export function PagosHeader({ vistaActual, onChangeVista, tieneInscripcion }: PagosHeaderProps) {
  return (
    <header className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          💳 <span className="text-[#FF6B35]">Pagos</span>
        </h1>
        <p className="text-gray-600">Gestiona tus inscripciones y pagos del campamento</p>
      </div>

      {/* Tabs de navegación */}
      <div className="flex justify-center gap-2">
        <Button
          variant={vistaActual === 'planes' ? 'default' : 'outline'}
          onClick={() => onChangeVista('planes')}
          className={vistaActual === 'planes' ? 'bg-[#FF6B35] hover:bg-[#E55A2B]' : ''}
        >
          📋 Planes
        </Button>
        {tieneInscripcion && (
          <Button
            variant={vistaActual === 'cuotas' ? 'default' : 'outline'}
            onClick={() => onChangeVista('cuotas')}
            className={vistaActual === 'cuotas' ? 'bg-[#FF6B35] hover:bg-[#E55A2B]' : ''}
          >
            📅 Mis Cuotas
          </Button>
        )}
      </div>
    </header>
  );
}
