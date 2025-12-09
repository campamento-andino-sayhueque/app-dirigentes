"use client";

import { useCallback, useEffect, useState } from "react";
import { useStore } from "@tanstack/react-store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Hooks de pagos
import { 
  usePlanesPago, 
  useCrearInscripcion,
  useGestionPagos,
  usePagarCuotas
} from "@/hooks/usePagos";

// Store
import { pagosStore, pagosActions } from "@/stores/pagos.store";

// Componentes
import { 
  PagosHeader, 
  PlanesGrid, 
  CuotasList, 
  InscripcionModal,
  ResumenPagos 
} from "./components";

// Tipos
import { PlanPagoModel, MesEnum } from "@/lib/api/types";
import { ApiError } from "@/lib/api/api-client";

export default function PagosPage() {
  const { user } = useAuth();
  
  // Estado del store
  const vistaActual = useStore(pagosStore, (state) => state.vistaActual);
  const planSeleccionado = useStore(pagosStore, (state) => state.planSeleccionado);
  const isInscripcionModalOpen = useStore(pagosStore, (state) => state.isInscripcionModalOpen);
  const inscripcionActual = useStore(pagosStore, (state) => state.inscripcionActual);
  const cuotasSeleccionadas = useStore(pagosStore, (state) => state.cuotasSeleccionadas);
  const metodoPago = useStore(pagosStore, (state) => state.metodoPago);

  // Estado local para demo (en producción vendría del backend)
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);

  // Hooks de API
  const { planesActivos, loading: loadingPlanes } = usePlanesPago();
  const { crearInscripcion, loading: loadingInscripcion } = useCrearInscripcion();
  const { pagarCuotas, loading: loadingPago } = usePagarCuotas();
  
  // Hook de gestión de pagos (cuando hay una inscripción)
  const {
    cuotas,
    montoPagado,
    montoPendiente,
    totalCuotas,
    cuotasPagadas,
    cuotasVencidas,
    loading: loadingCuotas
  } = useGestionPagos(inscripcionId);

  // Determinar si el usuario tiene inscripción
  const tieneInscripcion = inscripcionId !== null;

  // Handlers
  const handleInscribirse = useCallback((plan: PlanPagoModel) => {
    pagosActions.openInscripcionModal(plan);
  }, []);

  const handleConfirmarInscripcion = useCallback(async (mesInicio: MesEnum, cuotasDeseadas: number) => {
    if (!planSeleccionado || !user) {
      toast.error('Datos de inscripción incompletos');
      return;
    }

    try {
      const result = await crearInscripcion({
        idUsuario: user.uid,
        codigoPlan: planSeleccionado.codigo,
        mesInicio,
        cuotasDeseadas
      });

      // Guardar la inscripción
      setInscripcionId(result.idInscripcion);
      pagosActions.setInscripcionActual(result.idInscripcion);
      pagosActions.closeInscripcionModal();
      pagosActions.setVistaActual('cuotas');
      
      toast.success('¡Inscripción exitosa! Ya puedes ver tus cuotas.');
    } catch (error) {
      console.error('Error al crear inscripción:', error);
      const message = error instanceof ApiError ? error.message : 'Error al crear la inscripción';
      toast.error(message);
    }
  }, [planSeleccionado, user, crearInscripcion]);

  const handleToggleCuota = useCallback((cuotaId: number) => {
    pagosActions.toggleCuotaSeleccionada(cuotaId);
  }, []);

  const handleSeleccionarTodas = useCallback(() => {
    const pendientes = cuotas.filter(c => c.estado !== 'PAGADA').map(c => c.id);
    pagosActions.seleccionarTodasLasCuotas(pendientes);
  }, [cuotas]);

  const handleLimpiarSeleccion = useCallback(() => {
    pagosActions.limpiarSeleccion();
  }, []);

  const handlePagar = useCallback(async () => {
    if (!inscripcionId || cuotasSeleccionadas.length === 0) {
      toast.error('Selecciona al menos una cuota para pagar');
      return;
    }

    try {
      const result = await pagarCuotas(inscripcionId, cuotasSeleccionadas, metodoPago);
      
      // Si hay URL de redirección, el hook ya habrá redirigido
      if (!result.urlRedireccion) {
        toast.success('Intención de pago creada');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      const message = error instanceof ApiError ? error.message : 'Error al procesar el pago';
      toast.error(message);
    }
  }, [inscripcionId, cuotasSeleccionadas, metodoPago, pagarCuotas]);

  const handleChangeVista = useCallback((vista: 'planes' | 'cuotas' | 'historial') => {
    pagosActions.setVistaActual(vista);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header con tabs */}
          <PagosHeader
            vistaActual={vistaActual}
            onChangeVista={handleChangeVista}
            tieneInscripcion={tieneInscripcion}
          />

          <main className="max-w-6xl mx-auto">
            {/* Vista de planes */}
            {vistaActual === 'planes' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Planes de Pago Disponibles
                  </h2>
                  <p className="text-gray-600">
                    Selecciona un plan para inscribirte y comenzar a pagar tus cuotas
                  </p>
                </div>

                <PlanesGrid
                  planes={planesActivos}
                  loading={loadingPlanes}
                  onInscribirse={handleInscribirse}
                />
              </div>
            )}

            {/* Vista de cuotas */}
            {vistaActual === 'cuotas' && tieneInscripcion && (
              <div className="space-y-6">
                {/* Resumen */}
                <ResumenPagos
                  montoPagado={montoPagado}
                  montoPendiente={montoPendiente}
                  totalCuotas={totalCuotas}
                  cuotasPagadas={cuotasPagadas}
                  cuotasVencidas={cuotasVencidas.length}
                />

                {/* Lista de cuotas */}
                <CuotasList
                  cuotas={cuotas}
                  cuotasSeleccionadas={cuotasSeleccionadas}
                  onToggleCuota={handleToggleCuota}
                  onSeleccionarTodas={handleSeleccionarTodas}
                  onLimpiarSeleccion={handleLimpiarSeleccion}
                  onPagar={handlePagar}
                  loading={loadingCuotas}
                  loadingPago={loadingPago}
                />
              </div>
            )}

            {/* Vista de cuotas sin inscripción */}
            {vistaActual === 'cuotas' && !tieneInscripcion && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Aún no tienes inscripciones
                </h3>
                <p className="text-gray-600 mb-4">
                  Inscríbete a un plan de pago para ver tus cuotas
                </p>
                <button
                  onClick={() => handleChangeVista('planes')}
                  className="text-[#FF6B35] hover:underline font-medium"
                >
                  Ver planes disponibles →
                </button>
              </div>
            )}
          </main>

          {/* Modal de inscripción */}
          <InscripcionModal
            open={isInscripcionModalOpen}
            onClose={pagosActions.closeInscripcionModal}
            plan={planSeleccionado}
            onConfirmar={handleConfirmarInscripcion}
            loading={loadingInscripcion}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
