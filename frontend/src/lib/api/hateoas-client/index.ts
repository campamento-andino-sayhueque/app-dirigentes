import { ApiError } from "../errors";
import { HttpClient, ApiResult, RequestOptions } from "../http-client";
import { HateoasResource, HateoasLink, ApiRootResponse, HateoasCollection } from "../types";

export class HateoasClient<TRoot extends HateoasResource> extends HttpClient {
  protected apiRoot: TRoot | null = null;
  private linkCache: Map<string, string> = new Map();

  private initPromise: Promise<ApiResult<TRoot>> | null = null;

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
   * Obtiene la raíz de la API y cachea los links disponibles
   */
  async discoverApi(): Promise<ApiResult<TRoot>> {
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
        const result = await this.get<TRoot>("/api");

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
  async followLink<T>(
    rel: string,
    options?: RequestOptions
  ): Promise<ApiResult<T>> {
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
      return {
        error: new ApiError(`Link '${rel}' no encontrado en el recurso`),
      };
    }

    return this.get<T>(href, options);
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
