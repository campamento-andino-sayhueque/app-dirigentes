/**
 * API Client - Punto de entrada principal
 * 
 * Este módulo exporta todos los servicios y tipos necesarios
 * para consumir la API del backend CAS.
 * 
 * El cliente sigue el patrón HATEOAS para descubrimiento dinámico
 * de endpoints, lo que permite que el frontend sea "tonto" y
 * simplemente siga los links que el backend proporciona.
 * 
 * @example
 * ```typescript
 * import { hateoasClient, calendarioService, usuarioService } from '@/lib/api';
 * 
 * // Descubrir la API al iniciar
 * const { data: apiRoot } = await hateoasClient.discoverApi();
 * 
 * // Usar los servicios específicos
 * const { data: eventos } = await calendarioService.listEventos();
 * const { data: usuario } = await usuarioService.getMe();
 * ```
 */

// Cliente HATEOAS base
export { 
  hateoasClient, 
  ApiError, 
  AuthenticationError, 
  ForbiddenError, 
  NotFoundError,
  API_BASE_URL 
} from './hateoas-client';
export type { ApiResult } from './hateoas-client';

// Servicios por dominio
export { usuarioService } from './usuario.service';
export { calendarioService, type EventosFilter } from './calendario.service';
export { pagosService } from './pagos.service';
export { notificacionesService } from './notificaciones.service';

// Tipos
export * from './types';

// ============================================
// Re-exports para compatibilidad con código existente
// ============================================

import { hateoasClient } from './hateoas-client';
import { usuarioService } from './usuario.service';
import { HealthResponse } from './types';

/**
 * Verifica si el backend está disponible
 * @deprecated Usar hateoasClient.discoverApi() para verificar conectividad
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const result = await hateoasClient.get<HealthResponse>('/actuator/health', { requireAuth: false });
    return !result.error && result.data?.status === 'UP';
  } catch {
    return false;
  }
}

/**
 * Ping público (sin autenticación)
 * @deprecated Usar hateoasClient.get('/api/public/ping', { requireAuth: false })
 */
export async function publicPing(): Promise<string> {
  const result = await hateoasClient.get<string>('/api/public/ping', { requireAuth: false });
  return result.data || '';
}

/**
 * Obtiene la información del usuario autenticado
 * @deprecated Usar usuarioService.getMe()
 */
export async function getMe() {
  return usuarioService.getMe();
}

/**
 * Valida el token actual contra el backend
 * @deprecated Usar usuarioService.getMe() y verificar si no hay error
 */
export async function validateToken(): Promise<boolean> {
  const result = await usuarioService.getMe();
  return !result.error;
}
