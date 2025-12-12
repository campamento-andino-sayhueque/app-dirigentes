/**
 * Hooks específicos para el Calendario
 * 
 * Proporcionan estado reactivo para operaciones del calendario.
 */

import { ApiError, fetchOrThrow } from '@/lib/api';
import { calendarioService, EventosFilter } from '@/lib/api/calendario.service';
import { EventoCalendarioRequest } from '@/lib/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

// Helper wrapper to throw on error, enabling React Query error handling


/**
 * Hook para obtener eventos del calendario
 */
export function useEventos(filter: EventosFilter = {}) {
  const query = useQuery({
    queryKey: ['eventos', filter],
    queryFn: () => fetchOrThrow(calendarioService.listEventos(filter))
  });

  const eventos = useMemo(() => {
    if (!query.data) return [];
    return calendarioService.extractEventos(query.data); 
    // We mock the structure expected by extractEventos if it expects { data: ... } or just the collection
    // Let's check extractEventos signature later. 
    // Assuming standard usage: extractEventos(collection)
  }, [query.data]);

  // Eventos formateados para react-big-calendar
  const eventosCalendar = useMemo(() => {
    return calendarioService.toCalendarEvents(eventos);
  }, [eventos]);

  return {
    eventos,
    eventosCalendar,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener eventos del mes actual
 */
export function useEventosMes(year: number, month: number) {
  const query = useQuery({
    queryKey: ['eventos', 'mes', year, month],
    queryFn: () => fetchOrThrow(calendarioService.getEventosMes(year, month))
  });

  const eventos = useMemo(() => {
    if (!query.data) return [];
    return calendarioService.extractEventos(query.data);
  }, [query.data]);

  return {
    eventos,
    eventosCalendar: calendarioService.toCalendarEvents(eventos),
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener próximos eventos
 */
export function useProximosEventos(dias: number = 30) {
  const query = useQuery({
    queryKey: ['eventos', 'proximos', dias],
    queryFn: () => fetchOrThrow(calendarioService.getProximosEventos(dias))
  });

  const eventos = useMemo(() => {
    if (!query.data) return [];
    return calendarioService.extractEventos(query.data);
  }, [query.data]);

  return {
    eventos,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener un evento específico
 */
export function useEvento(id: number | null) {
  const query = useQuery({
    queryKey: ['evento', id],
    queryFn: () => id !== null 
      ? fetchOrThrow(calendarioService.getEvento(id))
      : Promise.resolve(null),
    enabled: id !== null
  });

  return {
    evento: query.data,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener tipos de evento
 */
export function useTiposEvento() {
  const query = useQuery({
    queryKey: ['tiposEvento'],
    queryFn: () => fetchOrThrow(calendarioService.listTiposEvento())
  });

  const tipos = useMemo(() => {
    if (!query.data) return [];
    return calendarioService.extractTipos(query.data);
  }, [query.data]);

  return {
    tipos,
    loading: query.isLoading,
    error: query.error as ApiError
  };
}

/**
 * Hook para crear un evento
 */
export function useCreateEvento() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (evento: EventoCalendarioRequest) => fetchOrThrow(calendarioService.createEvento(evento)),
    onSuccess: () => {
      // Invalidar queries de eventos para recargar
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    }
  });

  return {
    createEvento: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    createdEvento: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para actualizar un evento
 */
export function useUpdateEvento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, evento }: { id: number; evento: EventoCalendarioRequest }) => 
      fetchOrThrow(calendarioService.updateEvento(id, evento)),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      queryClient.invalidateQueries({ queryKey: ['evento', variables.id] });
    }
  });

  const updateEvento = useCallback((id: number, evento: EventoCalendarioRequest) => {
    return mutation.mutateAsync({ id, evento });
  }, [mutation]);

  return {
    updateEvento,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    updatedEvento: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para eliminar un evento
 */
export function useDeleteEvento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => fetchOrThrow(calendarioService.deleteEvento(id)),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      queryClient.invalidateQueries({ queryKey: ['evento', id] });
    }
  });

  return {
    deleteEvento: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    reset: mutation.reset
  };
}

/**
 * Hook combinado para CRUD de eventos
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
