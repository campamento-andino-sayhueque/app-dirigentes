/**
 * Hooks específicos para Pagos
 * 
 * Proporcionan estado reactivo para operaciones de pagos.
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagosService } from '@/lib/api/pagos.service';
import { InscripcionRequest, IntencionPagoRequest } from '@/lib/api/types';
import { ApiResult, ApiError, fetchOrThrow } from '@/lib/api/api-client';

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
    return pagosService.extractPlanes({ data: query.data } as any);
  }, [query.data]);

  return {
    planes,
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
    // If it's empty data because inscripcionId is null, extractCuotas might fail if it expects data structure?
    // extractCuotas checks for _embedded. 
    // fetchOrThrow returns `result.data`. If result.data is undefined, it returns undefined.
    return pagosService.extractCuotas({ data: query.data } as any);
  }, [query.data]);

  // Calcular estadísticas de las cuotas
  const stats = useMemo(() => ({
    montoPendiente: pagosService.calcularMontoPendiente(cuotas),
    montoPagado: pagosService.calcularMontoPagado(cuotas),
    cuotasVencidas: pagosService.getCuotasVencidas(cuotas),
    cuotasPendientes: pagosService.getCuotasPendientes(cuotas),
    proximaCuota: pagosService.getProximaCuota(cuotas)
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
  const mutation = useMutation({
    mutationFn: (data: InscripcionRequest) => fetchOrThrow(pagosService.createInscripcion(data))
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
 * Hook para crear una intención de pago (checkout MercadoPago)
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
 * Hook para iniciar el flujo de pago de una cuota
 * Maneja la creación de la intención y redirección a MercadoPago
 */
export function usePagarCuota() {
  const mutation = useMutation({
    mutationFn: async ({ cuotaId, sandbox = false }: { cuotaId: number; sandbox?: boolean }) => {
      // Here we don't strictly fetchOrThrow because we want the whole result potentially?
      // No, we want to throw on error.
      // pagosService.iniciarPagoCuota returns ApiResult<string>.
      // fetchOrThrow guarantees data string.
      const result = await pagosService.iniciarPagoCuota(cuotaId, sandbox);
      
      if (result.error) throw result.error;
      
      if (result.data) {
        // Redirigir a MercadoPago
        window.location.href = result.data;
      }
      
      return result;
    }
  });

  const pagarCuota = (cuotaId: number, sandbox = false) => {
    return mutation.mutateAsync({ cuotaId, sandbox });
  };

  return {
    pagarCuota,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    reset: mutation.reset
  };
}

/**
 * Hook para formatear montos
 */
export function useFormatoMoneda() {
  return {
    formatear: pagosService.formatMonto
  };
}

/**
 * Hook combinado para gestión de pagos de un acampante
 */
export function useGestionPagos(inscripcionId: number | null) {
  const { 
    cuotas, 
    montoPendiente, 
    montoPagado, 
    cuotasVencidas,
    cuotasPendientes,
    proximaCuota,
    loading: loadingCuotas, 
    error: errorCuotas,
    refetch 
  } = useCuotasInscripcion(inscripcionId);

  const { 
    pagarCuota, 
    loading: loadingPago, 
    error: errorPago 
  } = usePagarCuota();

  const { formatear } = useFormatoMoneda();

  return {
    // Datos
    cuotas,
    montoPendiente,
    montoPagado,
    cuotasVencidas,
    cuotasPendientes,
    proximaCuota,
    
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
    pagarCuota,
    
    // Helpers
    formatMonto: formatear,
    
    // Estadísticas formateadas
    montoPendienteFormateado: formatear(montoPendiente),
    montoPagadoFormateado: formatear(montoPagado),
    hayDeuda: montoPendiente > 0,
    hayCuotasVencidas: cuotasVencidas.length > 0
  };
}
