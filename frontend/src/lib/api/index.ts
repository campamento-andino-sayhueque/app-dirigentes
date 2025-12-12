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
 * import { apiClient, calendarioService, usuarioService } from '@/lib/api';
 * 
 * // Descubrir la API al iniciar
 * const { data: apiRoot } = await apiClient.discoverApi();
 * 
 * // Usar los servicios específicos
 * const { data: eventos } = await calendarioService.listEventos();
 * const { data: usuario } = await usuarioService.getMe();
 * ```
 */

// Cliente HATEOAS base
export { 
  ApiError, 
  AuthenticationError, 
  ForbiddenError, 
  NotFoundError
} from './errors';
export * from './cas-client';

// Servicios por dominio
export { usuarioService } from './usuario.service';
export { calendarioService, type EventosFilter } from './calendario.service';
export { pagosService } from './pagos.service';
export { notificacionesService } from './notificaciones.service';

// Tipos
export * from './types';
