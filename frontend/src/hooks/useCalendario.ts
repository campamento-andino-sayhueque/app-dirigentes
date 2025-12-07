/**
 * Hooks específicos para el Calendario
 * 
 * Proporcionan estado reactivo para operaciones del calendario.
 */

import { useCallback, useMemo } from 'react';
import { useApi, useMutation } from './useApi';
import { calendarioService, EventosFilter } from '@/lib/api/calendario.service';
import { EventoCalendarioModel, EventoCalendarioRequest } from '@/lib/api/types';

/**
 * Hook para obtener eventos del calendario
 * 
 * @example
 * ```typescript
 * const { eventos, loading, error, refetch } = useEventos({
 *   desde: new Date(),
 *   hasta: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export function useEventos(filter: EventosFilter = {}) {
  const { data, loading, error, refetch } = useApi(
    () => calendarioService.listEventos(filter),
    { 
      immediate: true,
      deps: [filter.desde, filter.hasta, filter.tipo]
    }
  );

  const eventos = useMemo(() => {
    if (!data) return [];
    return calendarioService.extractEventos(data);
  }, [data]);

  // Eventos formateados para react-big-calendar
  const eventosCalendar = useMemo(() => {
    return calendarioService.toCalendarEvents(eventos);
  }, [eventos]);

  return {
    eventos,
    eventosCalendar,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener eventos del mes actual
 */
export function useEventosMes(year: number, month: number) {
  const { data, loading, error, refetch } = useApi(
    () => calendarioService.getEventosMes(year, month),
    { 
      immediate: true,
      deps: [year, month]
    }
  );

  const eventos = useMemo(() => {
    if (!data) return [];
    return calendarioService.extractEventos(data);
  }, [data]);

  return {
    eventos,
    eventosCalendar: calendarioService.toCalendarEvents(eventos),
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener próximos eventos
 */
export function useProximosEventos(dias: number = 30) {
  const { data, loading, error, refetch } = useApi(
    () => calendarioService.getProximosEventos(dias),
    { 
      immediate: true,
      deps: [dias]
    }
  );

  const eventos = useMemo(() => {
    if (!data) return [];
    return calendarioService.extractEventos(data);
  }, [data]);

  return {
    eventos,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener un evento específico
 */
export function useEvento(id: number | null) {
  const { data, loading, error, refetch } = useApi(
    () => id !== null ? calendarioService.getEvento(id) : Promise.resolve({ data: undefined }),
    { 
      immediate: id !== null,
      deps: [id]
    }
  );

  return {
    evento: data,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener tipos de evento
 */
export function useTiposEvento() {
  const { data, loading, error } = useApi(
    () => calendarioService.listTiposEvento(),
    { immediate: true }
  );

  const tipos = useMemo(() => {
    if (!data) return [];
    return calendarioService.extractTipos(data);
  }, [data]);

  return {
    tipos,
    loading,
    error
  };
}

/**
 * Hook para crear un evento
 */
export function useCreateEvento() {
  const { mutate, loading, error, data, reset } = useMutation(
    (evento: EventoCalendarioRequest) => calendarioService.createEvento(evento)
  );

  return {
    createEvento: mutate,
    loading,
    error,
    createdEvento: data,
    reset
  };
}

/**
 * Hook para actualizar un evento
 */
export function useUpdateEvento() {
  const { mutate, loading, error, data, reset } = useMutation(
    ({ id, evento }: { id: number; evento: EventoCalendarioRequest }) => 
      calendarioService.updateEvento(id, evento)
  );

  const updateEvento = useCallback((id: number, evento: EventoCalendarioRequest) => {
    return mutate({ id, evento });
  }, [mutate]);

  return {
    updateEvento,
    loading,
    error,
    updatedEvento: data,
    reset
  };
}

/**
 * Hook para eliminar un evento
 */
export function useDeleteEvento() {
  const { mutate, loading, error, reset } = useMutation(
    (id: number) => calendarioService.deleteEvento(id)
  );

  return {
    deleteEvento: mutate,
    loading,
    error,
    reset
  };
}

/**
 * Hook combinado para CRUD de eventos
 * Proporciona todas las operaciones en un solo hook
 */
export function useEventosCRUD(filter: EventosFilter = {}) {
  const {
    eventos,
    eventosCalendar,
    loading: loadingList,
    error: errorList,
    refetch
  } = useEventos(filter);

  const {
    createEvento,
    loading: loadingCreate,
    error: errorCreate
  } = useCreateEvento();

  const {
    updateEvento,
    loading: loadingUpdate,
    error: errorUpdate
  } = useUpdateEvento();

  const {
    deleteEvento,
    loading: loadingDelete,
    error: errorDelete
  } = useDeleteEvento();

  return {
    // Datos
    eventos,
    eventosCalendar,
    
    // Estados
    loading: loadingList || loadingCreate || loadingUpdate || loadingDelete,
    loadingList,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    
    // Errores
    error: errorList || errorCreate || errorUpdate || errorDelete,
    errorList,
    errorCreate,
    errorUpdate,
    errorDelete,
    
    // Operaciones
    refetch,
    createEvento,
    updateEvento,
    deleteEvento
  };
}
