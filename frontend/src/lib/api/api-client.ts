/**
 * Cliente HATEOAS para descubrimiento dinámico de la API
 * 
 * Este cliente implementa el patrón "tonto" que descubre los endpoints
 * siguiendo los links HATEOAS proporcionados por el backend.
 */
import { HttpClient, ApiResult, RequestOptions } from './http-client';

import { auth } from '../firebase';
import { 
  HateoasLink, 
  HateoasResource, 
  HateoasCollection,
  ApiRootResponse 
} from './types';
import { ApiError } from './errors';

// URL base del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';




/**
 * Cliente API para descubrimiento dinámico
 */
class ApiClient extends HttpClient {
  private apiRoot: ApiRootResponse | null = null;
  private linkCache: Map<string, string> = new Map();
  private initPromise: Promise<ApiResult<ApiRootResponse>> | null = null;

  constructor(baseUrl: string) {
    super(baseUrl);
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

  // ============================================
  // Métodos de descubrimiento HATEOAS
  // ============================================

  /**
   * Obtiene la raíz de la API y cachea los links disponibles
   */
  async discoverApi(): Promise<ApiResult<ApiRootResponse>> {
    // Si ya tenemos links, no necesitamos descubrir de nuevo inmediatamente
    // (Podríamos añadir lógica de invalidación por tiempo aquí)
    if (this.linkCache.size > 0 && this.apiRoot) {
      return { data: this.apiRoot, links: this.apiRoot._links };
    }

    // Si ya hay una petición en vuelo, la retornamos
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
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
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
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
    // Asegurar que tenemos los links (lazy discovery)
    if (!this.hasLink(rel)) {
      await this.discoverApi();
    }

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
    this.initPromise = null;
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
export const apiClient = new ApiClient(API_BASE_URL);

// Re-exportar la URL base
export { API_BASE_URL };

/**
 * Helper para lanzar error si el resultado de la API contiene uno
 * Útil para react-query que espera que la función queryFn lance errores
 */
export async function fetchOrThrow<T>(promise: Promise<ApiResult<T>>): Promise<T> {
  const result = await promise;
  if (result.error) {
    throw result.error;
  }
  return result.data as T;
}
