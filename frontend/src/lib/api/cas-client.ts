// frontend/src/lib/api/cas-client.ts
import { auth } from '@/lib/firebase';
import { HateoasClient } from './hateoas-client';
import { ApiRootResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Función para obtener el token (Adapter)
const firebaseTokenProvider = async () => {
  return auth.currentUser?.getIdToken() || null;
};

// Extendemos el cliente genérico especificando nuestro tipo 'ApiRootResponse'
export class CasApiClient extends HateoasClient<ApiRootResponse> {
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
  
}

// Exportamos la instancia singleton lista para usar
export const apiClient = new CasApiClient(API_BASE_URL, firebaseTokenProvider);