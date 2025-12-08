/**
 * Servicio de Usuarios
 * 
 * Gestiona todas las operaciones relacionadas con usuarios
 * usando el cliente HATEOAS para descubrimiento dinámico.
 */

import { apiClient, AuthenticationError, ApiResult } from './api-client';
import { 
  UsuarioModel, 
  UsuariosCollection, 
  ActualizarPerfilRequest,
  UsuarioEstadisticas,
  RolesCollection,
  RolModel
} from './types';

/**
 * Servicio de usuarios
 */
export const usuarioService = {
  /**
   * Obtiene el perfil del usuario actual
   */
  async getMe(): Promise<ApiResult<UsuarioModel>> {
    return apiClient.get<UsuarioModel>('/api/usuarios/me');
  },

  /**
   * Actualiza el perfil del usuario actual
   */
  async updateMyProfile(data: ActualizarPerfilRequest): Promise<ApiResult<void>> {
    return apiClient.post<void>('/api/usuarios/onboarding', data);
  },

  /**
   * Lista todos los usuarios (solo admin)
   * Usa el link descubierto si está disponible
   */
  async listAll(): Promise<ApiResult<UsuariosCollection>> {
    const link = apiClient.getLink('usuarios');
    const url = link || '/api/usuarios';
    return apiClient.get<UsuariosCollection>(url);
    return apiClient.get<UsuariosCollection>(url);
  },

  /**
   * Obtiene un usuario por ID (solo admin)
   */
  async getById(id: number): Promise<ApiResult<UsuarioModel>> {
    return apiClient.get<UsuarioModel>(`/api/usuarios/${id}`);
  },

  /**
   * Busca usuarios por nombre o email (solo admin)
   */
  async search(query: string): Promise<ApiResult<UsuariosCollection>> {
    return apiClient.get<UsuariosCollection>(`/api/usuarios/busqueda?q=${encodeURIComponent(query)}`);
  },

  /**
   * Lista dirigentes
   */
  async listDirigentes(): Promise<ApiResult<UsuariosCollection>> {
    const link = apiClient.getLink('dirigentes');
    const url = link || '/api/usuarios/dirigentes';
    return apiClient.get<UsuariosCollection>(url);
  },

  /**
   * Lista acampantes
   */
  async listAcampantes(): Promise<ApiResult<UsuariosCollection>> {
    const link = apiClient.getLink('acampantes');
    const url = link || '/api/usuarios/acampantes';
    return apiClient.get<UsuariosCollection>(url);
  },

  /**
   * Lista usuarios por rol específico (solo admin)
   */
  async listByRole(rol: string): Promise<ApiResult<UsuariosCollection>> {
    return apiClient.get<UsuariosCollection>(`/api/usuarios/por-rol/${rol}`);
  },

  /**
   * Obtiene estadísticas de usuarios (solo admin)
   */
  async getStatistics(): Promise<ApiResult<UsuarioEstadisticas>> {
    const link = apiClient.getLink('estadisticas-usuarios');
    const url = link || '/api/usuarios/estadisticas';
    return apiClient.get<UsuarioEstadisticas>(url);
  },

  /**
   * Asigna un rol a un usuario (solo admin)
   */
  async assignRole(userId: number, rol: string): Promise<ApiResult<UsuarioModel>> {
    return apiClient.post<UsuarioModel>(`/api/usuarios/${userId}/roles/${rol}`);
    return apiClient.post<UsuarioModel>(`/api/usuarios/${userId}/roles/${rol}`);
  },

  /**
   * Remueve un rol de un usuario (solo admin)
   */
  async removeRole(userId: number, rol: string): Promise<ApiResult<void>> {
    return apiClient.delete(`/api/usuarios/${userId}/roles/${rol}`);
  },

  /**
   * Actualiza el estado de un usuario (solo admin)
   */
  async updateStatus(userId: number, estado: string): Promise<ApiResult<UsuarioModel>> {
    return apiClient.patch<UsuarioModel>(`/api/usuarios/${userId}/estado`, { estado });
  },

  /**
   * Actualiza datos de un usuario (solo admin)
   */
  async updateUser(userId: number, data: Partial<ActualizarPerfilRequest>): Promise<ApiResult<UsuarioModel>> {
    return apiClient.patch<UsuarioModel>(`/api/usuarios/${userId}`, data);
  },

  // ============================================
  // Roles
  // ============================================

  /**
   * Lista todos los roles disponibles
   */
  async listRoles(): Promise<ApiResult<RolesCollection>> {
    const link = apiClient.getLink('roles');
    const url = link || '/api/roles';
    return apiClient.get<RolesCollection>(url);
  },

  /**
   * Obtiene información de un rol específico
   */
  async getRole(rol: string): Promise<ApiResult<RolModel>> {
    return apiClient.get<RolModel>(`/api/roles/${rol}`);
  },

  // ============================================
  // Helpers
  // ============================================

  /**
   * Extrae la lista de usuarios de una colección
   */
  extractUsers(collection: UsuariosCollection): UsuarioModel[] {
    return apiClient.extractCollection(collection);
  },

  /**
   * Extrae la lista de roles de una colección
   */
  extractRoles(collection: RolesCollection): RolModel[] {
    return apiClient.extractCollection(collection);
  }
};
