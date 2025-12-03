/**
 * Cliente API para comunicación con el backend en Railway
 * Maneja autenticación, errores y configuración de peticiones
 */

import { auth } from "./firebase";

// URL base del backend - Railway proporciona una URL pública
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Tipos de respuesta del API
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Tipos específicos para endpoints
 */
export interface HealthResponse {
  status: string;
  timestamp: string;
  message: string;
  service: string;
}

/**
 * Configuración del cliente API
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtiene el token de autenticación de Firebase
   */
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error obteniendo token de autenticación:", error);
      return null;
    }
  }

  /**
   * Realiza una petición HTTP al backend
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Obtener token de autenticación
      const token = await this.getAuthToken();

      // Configurar headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      // Agregar token de autenticación si existe
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Realizar petición
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // Incluir cookies si es necesario
      });

      // Parsear respuesta
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || "Error en la petición",
          data: undefined,
        };
      }

      return {
        data,
        error: undefined,
      };
    } catch (error) {
      console.error("Error en petición API:", error);
      return {
        error: error instanceof Error ? error.message : "Error desconocido",
        data: undefined,
      };
    }
  }

  /**
   * Métodos HTTP
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Verifica la conexión con el backend
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.get("/actuator/health");
      return !response.error && response.data?.status === "UP";
    } catch {
      return false;
    }
  }
}

// Exportar instancia del cliente API
export const api = new ApiClient(API_BASE_URL);

// Exportar URL base para uso directo si es necesario
export { API_BASE_URL };
