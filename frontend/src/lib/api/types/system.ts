import { HateoasResource } from './hateoas';

// ============================================
// API Root Types
// ============================================

/**
 * Respuesta del endpoint raíz /api
 */
export interface ApiRootResponse extends HateoasResource {
  mensaje: string;
  emailUsuario?: string;
  nombreUsuario?: string;
  roles?: string[];
  perfilCompleto?: boolean;
}

// ============================================
// Health/Actuator Types
// ============================================

export interface HealthResponse {
  status: 'UP' | 'DOWN';
  components?: Record<string, {
    status: 'UP' | 'DOWN';
    details?: Record<string, unknown>;
  }>;
}

export interface ActuatorInfoResponse {
  app?: {
    name: string;
    version: string;
    description?: string;
  };
  build?: {
    artifact: string;
    name: string;
    version: string;
    time?: string;
  };
}
