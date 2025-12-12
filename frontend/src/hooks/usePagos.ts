/**
 * Hooks específicos para Pagos
 * 
 * Proporcionan estado reactivo para operaciones de pagos.
 */

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagosService } from '@/lib/api/pagos.service';
import { 
  InscripcionRequest, 
  IntencionPagoRequest, 
  MpPreferenceRequest,
  CuotaModel,
  PlanPagoModel,
  MetodoPago 
} from '@/lib/api/types';
import { ApiError, fetchOrThrow } from '@/lib/api';

/**
 * Hook para listar planes de pago disponibles
 */
export function usePlanesPago() {
  const query = useQuery({
    queryKey: ['planesPago'],
    queryFn: () => fetchOrThrow(pagosService.listPlanes())
  });

  const planes = useMemo(() => {
    if (!query.data) return [];
    return pagosService.extractPlanes(query.data);
  }, [query.data]);

  // Filtrar solo planes activos
  const planesActivos = useMemo(() => {
    return planes.filter(p => p.activo);
  }, [planes]);

  return {
    planes,
    planesActivos,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener un plan específico
 */
export function usePlanPago(codigo: string | null) {
  const query = useQuery({
    queryKey: ['planPago', codigo],
    queryFn: () => codigo ? fetchOrThrow(pagosService.getPlan(codigo)) : Promise.resolve(null),
    enabled: !!codigo
  });

  return {
    plan: query.data as PlanPagoModel | null,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener las cuotas de una inscripción
 */
export function useCuotasInscripcion(inscripcionId: number | null) {
  const query = useQuery({
    queryKey: ['cuotas', inscripcionId],
    queryFn: () => inscripcionId !== null 
      ? fetchOrThrow(pagosService.getCuotasInscripcion(inscripcionId))
      : Promise.resolve(null),
    enabled: inscripcionId !== null
  });

  const cuotas = useMemo(() => {
    if (!query.data) return [];
    return pagosService.extractCuotas(query.data);
  }, [query.data]);

  // Calcular estadísticas de las cuotas
  const stats = useMemo(() => ({
    montoPendiente: pagosService.calcularMontoPendiente(cuotas),
    montoPagado: pagosService.calcularMontoPagado(cuotas),
    cuotasVencidas: pagosService.getCuotasVencidas(cuotas),
    cuotasPendientes: pagosService.getCuotasPendientes(cuotas),
    proximaCuota: pagosService.getProximaCuota(cuotas),
    totalCuotas: cuotas.length,
    cuotasPagadas: cuotas.filter(c => c.estado === 'PAGADA').length
  }), [cuotas]);

  return {
    cuotas,
    ...stats,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para crear una inscripción
 */
export function useCrearInscripcion() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: InscripcionRequest) => fetchOrThrow(pagosService.createInscripcion(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones'] });
    }
  });

  return {
    crearInscripcion: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    inscripcion: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para crear una intención de pago
 */
export function useCrearIntencionPago() {
  const mutation = useMutation({
    mutationFn: (data: IntencionPagoRequest) => fetchOrThrow(pagosService.createIntencionPago(data))
  });

  return {
    crearIntencion: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    intencion: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para crear preferencia de MercadoPago directamente
 */
export function useCrearPreferenciaMp() {
  const mutation = useMutation({
    mutationFn: (data: MpPreferenceRequest) => fetchOrThrow(pagosService.createMpPreference(data))
  });

  return {
    crearPreferencia: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    preferencia: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para iniciar el flujo de pago de cuotas
 * Maneja la creación de la intención y redirección a MercadoPago
 */
export function usePagarCuotas() {
  const { crearIntencion, loading, error, reset } = useCrearIntencionPago();

  const pagarCuotas = useCallback(async (
    inscripcionId: number, 
    cuotaIds: number[], 
    metodo: MetodoPago = 'MERCADOPAGO'
  ) => {
    const result = await crearIntencion({
      idInscripcion: inscripcionId,
      idsCuotas: cuotaIds,
      metodo
    });

    // Si hay URL de redirección (MercadoPago), redirigir
    if (result.urlRedireccion) {
      window.location.href = result.urlRedireccion;
    }

    return result;
  }, [crearIntencion]);

  return {
    pagarCuotas,
    loading,
    error,
    reset
  };
}

/**
 * Hook para formatear montos
 */
export function useFormatoMoneda() {
  return {
    formatear: pagosService.formatMonto,
    mesEnumToSpanish: pagosService.mesEnumToSpanish
  };
}

/**
 * Hook combinado para gestión de pagos de una inscripción
 */
export function useGestionPagos(inscripcionId: number | null) {
  const { 
    cuotas, 
    montoPendiente, 
    montoPagado, 
    cuotasVencidas,
    cuotasPendientes,
    proximaCuota,
    totalCuotas,
    cuotasPagadas,
    loading: loadingCuotas, 
    error: errorCuotas,
    refetch 
  } = useCuotasInscripcion(inscripcionId);

  const { 
    pagarCuotas, 
    loading: loadingPago, 
    error: errorPago 
  } = usePagarCuotas();

  const { formatear, mesEnumToSpanish } = useFormatoMoneda();

  // Calcular progreso de pago
  const progreso = useMemo(() => {
    if (totalCuotas === 0) return 0;
    return Math.round((cuotasPagadas / totalCuotas) * 100);
  }, [cuotasPagadas, totalCuotas]);

  return {
    // Datos
    cuotas,
    montoPendiente,
    montoPagado,
    cuotasVencidas,
    cuotasPendientes,
    proximaCuota,
    totalCuotas,
    cuotasPagadas,
    progreso,
    
    // Estados
    loading: loadingCuotas || loadingPago,
    loadingCuotas,
    loadingPago,
    
    // Errores
    error: errorCuotas || errorPago,
    errorCuotas,
    errorPago,
    
    // Operaciones
    refetch,
    pagarCuotas: inscripcionId 
      ? (cuotaIds: number[], metodo?: MetodoPago) => pagarCuotas(inscripcionId, cuotaIds, metodo)
      : undefined,
    
    // Helpers
    formatMonto: formatear,
    mesEnumToSpanish,

    // Helpers de cuotas
    calcularMontoSeleccionado: (cuotaIds: number[]) => {
      return cuotas
        .filter(c => cuotaIds.includes(c.id))
        .reduce((total, c) => total + c.monto, 0);
    }
  };
}

/**
 * Hook para selección de cuotas a pagar
 */
export function useSeleccionCuotas(cuotas: CuotaModel[]) {
  const cuotasPagables = useMemo(() => {
    return cuotas.filter(c => c.estado !== 'PAGADA');
  }, [cuotas]);

  return {
    cuotasPagables,
    calcularMonto: (ids: number[]) => {
      return cuotas
        .filter(c => ids.includes(c.id))
        .reduce((total, c) => total + c.monto, 0);
    }
  };
}
