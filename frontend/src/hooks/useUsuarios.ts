/**
 * Hooks específicos para Usuarios
 * 
 * Proporcionan estado reactivo para operaciones de usuarios.
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '@/lib/api/usuario.service';
import { UsuarioModel, ActualizarPerfilRequest } from '@/lib/api/types';
import { ApiResult, ApiError, fetchOrThrow } from '@/lib/api/api-client';

/**
 * Hook para obtener el perfil del usuario actual
 */
export function useUsuarioActual() {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => fetchOrThrow(usuarioService.getMe())
  });

  const data = query.data;

  return {
    usuario: data,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch,
    // Helpers
    isAdmin: data?.roles.includes('ADMIN') ?? false,
    isDirigente: data?.roles.includes('DIRIGENTE') ?? false,
    isAcampante: data?.roles.includes('ACAMPANTE') ?? false,
    perfilCompleto: data?.perfilCompleto ?? false
  };
}

/**
 * Hook para actualizar el perfil del usuario actual
 */
export function useActualizarPerfil() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ActualizarPerfilRequest) => fetchOrThrow(usuarioService.updateMyProfile(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });

  return {
    actualizarPerfil: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as ApiError,
    usuarioActualizado: mutation.data,
    reset: mutation.reset
  };
}

/**
 * Hook para listar usuarios (solo admin)
 */
export function useUsuarios() {
  const query = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => fetchOrThrow(usuarioService.listAll())
  });

  const usuarios = useMemo(() => {
    if (!query.data) return [];
    return usuarioService.extractUsers({ data: query.data } as any);
  }, [query.data]);

  return {
    usuarios,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para listar dirigentes
 */
export function useDirigentes() {
  const query = useQuery({
    queryKey: ['dirigentes'],
    queryFn: () => fetchOrThrow(usuarioService.listDirigentes())
  });

  const dirigentes = useMemo(() => {
    if (!query.data) return [];
    return usuarioService.extractUsers({ data: query.data } as any);
  }, [query.data]);

  return {
    dirigentes,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para listar acampantes
 */
export function useAcampantes() {
  const query = useQuery({
    queryKey: ['acampantes'],
    queryFn: () => fetchOrThrow(usuarioService.listAcampantes())
  });

  const acampantes = useMemo(() => {
    if (!query.data) return [];
    return usuarioService.extractUsers({ data: query.data } as any);
  }, [query.data]);

  return {
    acampantes,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para buscar usuarios
 */
export function useBuscarUsuarios(queryStr: string) {
  const query = useQuery({
    queryKey: ['usuarios', 'search', queryStr],
    queryFn: () => fetchOrThrow(usuarioService.search(queryStr)),
    enabled: queryStr.length >= 2
  });

  const usuarios = useMemo(() => {
    if (!query.data) return [];
    return usuarioService.extractUsers({ data: query.data } as any);
  }, [query.data]);

  return {
    usuarios,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUsuario(id: number | null) {
  const query = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => id !== null 
      ? fetchOrThrow(usuarioService.getById(id)) 
      : Promise.resolve(null),
    enabled: id !== null
  });

  return {
    usuario: query.data,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para obtener estadísticas de usuarios (solo admin)
 */
export function useEstadisticasUsuarios() {
  const query = useQuery({
    queryKey: ['usuarios', 'estadisticas'],
    queryFn: () => fetchOrThrow(usuarioService.getStatistics())
  });

  return {
    estadisticas: query.data,
    loading: query.isLoading,
    error: query.error as ApiError,
    refetch: query.refetch
  };
}

/**
 * Hook para listar roles disponibles
 */
export function useRoles() {
  const query = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchOrThrow(usuarioService.listRoles())
  });

  const roles = useMemo(() => {
    if (!query.data) return [];
    return usuarioService.extractRoles({ data: query.data } as any);
  }, [query.data]);

  return {
    roles,
    loading: query.isLoading,
    error: query.error as ApiError
  };
}

/**
 * Hook para asignar/remover roles (solo admin)
 */
export function useGestionRoles() {
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: ({ userId, rol }: { userId: number; rol: string }) => 
      fetchOrThrow(usuarioService.assignRole(userId, rol)),
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['usuario', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: ({ userId, rol }: { userId: number; rol: string }) => 
      fetchOrThrow(usuarioService.removeRole(userId, rol)),
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['usuario', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });

  return {
    assignRole: (userId: number, rol: string) => assignMutation.mutateAsync({ userId, rol }),
    removeRole: (userId: number, rol: string) => removeMutation.mutateAsync({ userId, rol }),
    loading: assignMutation.isPending || removeMutation.isPending,
    error: (assignMutation.error || removeMutation.error) as ApiError
  };
}

/**
 * Hook para actualizar estado de usuario (solo admin)
 */
export function useActualizarEstadoUsuario() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId, estado }: { userId: number; estado: string }) => 
      fetchOrThrow(usuarioService.updateStatus(userId, estado)),
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['usuario', variables.userId] });
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    }
  });

  return {
    actualizarEstado: (userId: number, estado: string) => mutation.mutateAsync({ userId, estado }),
    loading: mutation.isPending,
    error: mutation.error as ApiError
  };
}
