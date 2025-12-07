/**
 * Cliente HATEOAS para descubrimiento dinámico de la API
 * 
 * Este cliente implementa el patrón "tonto" que descubre los endpoints
 * siguiendo los links HATEOAS proporcionados por el backend.
 */

import { auth } from '../firebase';
import { 
  HateoasLink, 
  HateoasResource, 
  HateoasCollection,
  ApiRootResponse 
} from './types';

// URL base del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Errores específicos del cliente API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'No autenticado') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Sin permisos') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Resultado de una operación API
 */
export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
  links?: Record<string, HateoasLink | HateoasLink[]>;
}

/**
 * Opciones para las peticiones
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * Cliente HATEOAS que descubre y navega la API dinámicamente
 */
class HateoasClient {
  private baseUrl: string;
  private apiRoot: ApiRootResponse | null = null;
  private linkCache: Map<string, string> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtiene el token de autenticación de Firebase
   */
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Resuelve una URL (absoluta o relativa)
   */
  private resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  /**
   * Extrae el href de un link HATEOAS
   */
  private getLinkHref(link: HateoasLink | HateoasLink[] | undefined): string | null {
    if (!link) return null;
    if (Array.isArray(link)) {
      return link[0]?.href || null;
    }
    return link.href || null;
  }

  /**
   * Realiza una petición HTTP
   */
  async request<T>(url: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    const { body, requireAuth = true, ...fetchOptions } = options;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(fetchOptions.headers as Record<string, string> || {}),
      };

      // Agregar token si es requerido
      if (requireAuth) {
        const token = await this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(this.resolveUrl(url), {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });

      // Manejar errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        switch (response.status) {
          case 401:
            throw new AuthenticationError(errorData.message || 'No autenticado');
          case 403:
            throw new ForbiddenError(errorData.message || 'Sin permisos');
          case 404:
            throw new NotFoundError(errorData.message || 'No encontrado');
          default:
            throw new ApiError(
              errorData.message || `Error ${response.status}`,
              response.status,
              errorData
            );
        }
      }

      // Parsear respuesta
      const data = await response.json() as T;
      
      // Extraer links si es un recurso HATEOAS
      const hateoasData = data as unknown as HateoasResource;
      const links = hateoasData._links;

      return { data, links };

    } catch (error) {
      if (error instanceof ApiError) {
        return { error };
      }
      return { 
        error: new ApiError(
          error instanceof Error ? error.message : 'Error desconocido'
        )
      };
    }
  }

  /**
   * Métodos HTTP convenientes
   */
  async get<T>(url: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...options, method: 'POST', body });
  }

  async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...options, method: 'PUT', body });
  }

  async patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH', body });
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  // ============================================
  // Métodos de descubrimiento HATEOAS
  // ============================================

  /**
   * Obtiene la raíz de la API y cachea los links disponibles
   */
  async discoverApi(): Promise<ApiResult<ApiRootResponse>> {
    const result = await this.get<ApiRootResponse>('/api');
    
    if (result.data) {
      this.apiRoot = result.data;
      
      // Cachear links disponibles
      if (result.links) {
        Object.entries(result.links).forEach(([rel, link]) => {
          const href = this.getLinkHref(link);
          if (href) {
            this.linkCache.set(rel, href);
          }
        });
      }
    }
    
    return result;
  }

  /**
   * Obtiene un link por su relación
   */
  getLink(rel: string): string | null {
    return this.linkCache.get(rel) || null;
  }

  /**
   * Verifica si un link está disponible
   */
  hasLink(rel: string): boolean {
    return this.linkCache.has(rel);
  }

  /**
   * Navega a un link por su relación
   */
  async followLink<T>(rel: string, options?: RequestOptions): Promise<ApiResult<T>> {
    const href = this.getLink(rel);
    if (!href) {
      return { error: new ApiError(`Link '${rel}' no disponible`) };
    }
    return this.get<T>(href, options);
  }

  /**
   * Sigue un link desde un recurso HATEOAS
   */
  async followResourceLink<T>(
    resource: HateoasResource, 
    rel: string, 
    options?: RequestOptions
  ): Promise<ApiResult<T>> {
    const link = resource._links?.[rel];
    const href = this.getLinkHref(link);
    
    if (!href) {
      return { error: new ApiError(`Link '${rel}' no encontrado en el recurso`) };
    }
    
    return this.get<T>(href, options);
  }

  /**
   * Obtiene la información de la API cacheada
   */
  getApiInfo(): ApiRootResponse | null {
    return this.apiRoot;
  }

  /**
   * Limpia el cache de links (útil al hacer logout)
   */
  clearCache(): void {
    this.apiRoot = null;
    this.linkCache.clear();
  }

  /**
   * Verifica si el usuario tiene perfil completo
   */
  isProfileComplete(): boolean {
    return this.apiRoot?.perfilCompleto ?? false;
  }

  /**
   * Obtiene los roles del usuario desde la API
   */
  getUserRoles(): string[] {
    return this.apiRoot?.roles ?? [];
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  // ============================================
  // Helpers para colecciones HATEOAS
  // ============================================

  /**
   * Extrae items de una colección HATEOAS
   */
  extractCollection<T>(collection: HateoasCollection<T>): T[] {
    if (!collection._embedded) return [];
    
    // El nombre del key puede variar, tomamos el primero
    const keys = Object.keys(collection._embedded);
    if (keys.length === 0) return [];
    
    return (collection._embedded as Record<string, T[]>)[keys[0]] || [];
  }
}

// Instancia singleton del cliente
export const hateoasClient = new HateoasClient(API_BASE_URL);

// Re-exportar la URL base
export { API_BASE_URL };
