/**
 * Hooks específicos para Usuarios
 * 
 * Proporcionan estado reactivo para operaciones de usuarios.
 */

import { useMemo } from 'react';
import { useApi, useMutation } from './useApi';
import { usuarioService } from '@/lib/api/usuario.service';
import { UsuarioModel, ActualizarPerfilRequest } from '@/lib/api/types';

/**
 * Hook para obtener el perfil del usuario actual
 * 
 * @example
 * ```typescript
 * const { usuario, loading, error, refetch } = useUsuarioActual();
 * 
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return <div>Hola, {usuario?.nombreMostrar}</div>;
 * ```
 */
export function useUsuarioActual() {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.getMe(),
    { immediate: true }
  );

  return {
    usuario: data,
    loading,
    error,
    refetch,
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
  const { mutate, loading, error, data, reset } = useMutation(
    (data: ActualizarPerfilRequest) => usuarioService.updateMyProfile(data)
  );

  return {
    actualizarPerfil: mutate,
    loading,
    error,
    usuarioActualizado: data,
    reset
  };
}

/**
 * Hook para listar usuarios (solo admin)
 */
export function useUsuarios() {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.listAll(),
    { immediate: true }
  );

  const usuarios = useMemo(() => {
    if (!data) return [];
    return usuarioService.extractUsers(data);
  }, [data]);

  return {
    usuarios,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para listar dirigentes
 */
export function useDirigentes() {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.listDirigentes(),
    { immediate: true }
  );

  const dirigentes = useMemo(() => {
    if (!data) return [];
    return usuarioService.extractUsers(data);
  }, [data]);

  return {
    dirigentes,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para listar acampantes
 */
export function useAcampantes() {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.listAcampantes(),
    { immediate: true }
  );

  const acampantes = useMemo(() => {
    if (!data) return [];
    return usuarioService.extractUsers(data);
  }, [data]);

  return {
    acampantes,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para buscar usuarios
 */
export function useBuscarUsuarios(query: string) {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.search(query),
    { 
      immediate: query.length >= 2,
      deps: [query]
    }
  );

  const usuarios = useMemo(() => {
    if (!data) return [];
    return usuarioService.extractUsers(data);
  }, [data]);

  return {
    usuarios,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUsuario(id: number | null) {
  const { data, loading, error, refetch } = useApi(
    () => id !== null ? usuarioService.getById(id) : Promise.resolve({ data: undefined }),
    { 
      immediate: id !== null,
      deps: [id]
    }
  );

  return {
    usuario: data,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para obtener estadísticas de usuarios (solo admin)
 */
export function useEstadisticasUsuarios() {
  const { data, loading, error, refetch } = useApi(
    () => usuarioService.getStatistics(),
    { immediate: true }
  );

  return {
    estadisticas: data,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para listar roles disponibles
 */
export function useRoles() {
  const { data, loading, error } = useApi(
    () => usuarioService.listRoles(),
    { immediate: true }
  );

  const roles = useMemo(() => {
    if (!data) return [];
    return usuarioService.extractRoles(data);
  }, [data]);

  return {
    roles,
    loading,
    error
  };
}

/**
 * Hook para asignar/remover roles (solo admin)
 */
export function useGestionRoles() {
  const { mutate: assignMutate, loading: assignLoading, error: assignError } = useMutation(
    ({ userId, rol }: { userId: number; rol: string }) => 
      usuarioService.assignRole(userId, rol)
  );

  const { mutate: removeMutate, loading: removeLoading, error: removeError } = useMutation(
    ({ userId, rol }: { userId: number; rol: string }) => 
      usuarioService.removeRole(userId, rol)
  );

  return {
    assignRole: (userId: number, rol: string) => assignMutate({ userId, rol }),
    removeRole: (userId: number, rol: string) => removeMutate({ userId, rol }),
    loading: assignLoading || removeLoading,
    error: assignError || removeError
  };
}

/**
 * Hook para actualizar estado de usuario (solo admin)
 */
export function useActualizarEstadoUsuario() {
  const { mutate, loading, error } = useMutation(
    ({ userId, estado }: { userId: number; estado: string }) => 
      usuarioService.updateStatus(userId, estado)
  );

  return {
    actualizarEstado: (userId: number, estado: string) => mutate({ userId, estado }),
    loading,
    error
  };
}
