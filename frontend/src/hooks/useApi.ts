/**
 * Hook para consumir la API del backend
 * 
 * Proporciona estado reactivo para llamadas API con manejo automático
 * de loading, errores y cache.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiResult, ApiError } from '@/lib/api/hateoas-client';

/**
 * Estado de una llamada API
 */
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Opciones del hook useApi
 */
export interface UseApiOptions {
  /** Si debe ejecutar la llamada automáticamente al montar */
  immediate?: boolean;
  /** Dependencias que disparan re-fetch */
  deps?: unknown[];
  /** Callback al completar exitosamente */
  onSuccess?: (data: unknown) => void;
  /** Callback al fallar */
  onError?: (error: ApiError) => void;
}

/**
 * Hook genérico para llamadas API
 * 
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useApi(
 *   () => calendarioService.listEventos(),
 *   { immediate: true }
 * );
 * ```
 */
export function useApi<T>(
  fetcher: () => Promise<ApiResult<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = true, deps = [], onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await fetcher();
      
      if (!mountedRef.current) return;
      
      if (result.error) {
        setState({ data: null, loading: false, error: result.error });
        onError?.(result.error);
      } else {
        setState({ data: result.data ?? null, loading: false, error: null });
        onSuccess?.(result.data);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      
      const error = err instanceof ApiError 
        ? err 
        : new ApiError(err instanceof Error ? err.message : 'Error desconocido');
      
      setState({ data: null, loading: false, error });
      onError?.(error);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (immediate) {
      execute();
    }
    
    return () => {
      mountedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return {
    ...state,
    refetch: execute,
    reset: useCallback(() => {
      setState({ data: null, loading: false, error: null });
    }, []),
  };
}

/**
 * Hook para mutaciones (POST, PUT, PATCH, DELETE)
 * No ejecuta automáticamente, espera ser llamado explícitamente.
 * 
 * @example
 * ```typescript
 * const { mutate, loading, error } = useMutation(
 *   (evento) => calendarioService.createEvento(evento)
 * );
 * 
 * const handleSubmit = async (data) => {
 *   const result = await mutate(data);
 *   if (result.data) {
 *     // Éxito
 *   }
 * };
 * ```
 */
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResult<TData>>,
  options: Pick<UseApiOptions, 'onSuccess' | 'onError'> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables): Promise<ApiResult<TData>> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mutationFn(variables);
      
      if (result.error) {
        setState({ data: null, loading: false, error: result.error });
        onError?.(result.error);
      } else {
        setState({ data: result.data ?? null, loading: false, error: null });
        onSuccess?.(result.data);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new ApiError(err instanceof Error ? err.message : 'Error desconocido');
      
      setState({ data: null, loading: false, error });
      onError?.(error);
      
      return { error };
    }
  }, [mutationFn, onSuccess, onError]);

  return {
    ...state,
    mutate,
    reset: useCallback(() => {
      setState({ data: null, loading: false, error: null });
    }, []),
  };
}
