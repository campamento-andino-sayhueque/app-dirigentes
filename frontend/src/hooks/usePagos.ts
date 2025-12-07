/**
 * Hooks específicos para Pagos
 * 
 * Proporcionan estado reactivo para operaciones de pagos.
 */

import { useMemo } from 'react';
import { useApi, useMutation } from './useApi';
import { pagosService } from '@/lib/api/pagos.service';
import { InscripcionRequest, IntencionPagoRequest } from '@/lib/api/types';

/**
 * Hook para listar planes de pago disponibles
 * 
 * @example
 * ```typescript
 * const { planes, loading, error } = usePlanesPage();
 * ```
 */
export function usePlanesPago() {
  const { data, loading, error, refetch } = useApi(
    () => pagosService.listPlanes(),
    { immediate: true }
  );

  const planes = useMemo(() => {
    if (!data) return [];
    return pagosService.extractPlanes(data);
  }, [data]);

  return {
    planes,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener las cuotas de una inscripción
 */
export function useCuotasInscripcion(inscripcionId: number | null) {
  const { data, loading, error, refetch } = useApi(
    () => inscripcionId !== null 
      ? pagosService.getCuotasInscripcion(inscripcionId) 
      : Promise.resolve({ data: undefined }),
    { 
      immediate: inscripcionId !== null,
      deps: [inscripcionId]
    }
  );

  const cuotas = useMemo(() => {
    if (!data) return [];
    return pagosService.extractCuotas(data);
  }, [data]);

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
    loading,
    error,
    refetch
  };
}

/**
 * Hook para crear una inscripción
 */
export function useCrearInscripcion() {
  const { mutate, loading, error, data, reset } = useMutation(
    (data: InscripcionRequest) => pagosService.createInscripcion(data)
  );

  return {
    crearInscripcion: mutate,
    loading,
    error,
    inscripcion: data,
    reset
  };
}

/**
 * Hook para crear una intención de pago (checkout MercadoPago)
 */
export function useCrearIntencionPago() {
  const { mutate, loading, error, data, reset } = useMutation(
    (data: IntencionPagoRequest) => pagosService.createIntencionPago(data)
  );

  return {
    crearIntencion: mutate,
    loading,
    error,
    intencion: data,
    reset
  };
}

/**
 * Hook para iniciar el flujo de pago de una cuota
 * Maneja la creación de la intención y redirección a MercadoPago
 */
export function usePagarCuota() {
  const { mutate, loading, error, reset } = useMutation(
    async ({ cuotaId, sandbox = false }: { cuotaId: number; sandbox?: boolean }) => {
      const result = await pagosService.iniciarPagoCuota(cuotaId, sandbox);
      
      if (result.data) {
        // Redirigir a MercadoPago
        window.location.href = result.data;
      }
      
      return result;
    }
  );

  const pagarCuota = (cuotaId: number, sandbox = false) => {
    return mutate({ cuotaId, sandbox });
  };

  return {
    pagarCuota,
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
