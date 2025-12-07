/**
 * Tipos para el cliente API del backend CAS
 * Estos tipos modelan las respuestas HATEOAS del backend Java
 */

// ============================================
// HATEOAS Core Types
// ============================================

/**
 * Representa un link HATEOAS
 */
export interface HateoasLink {
  href: string;
  rel?: string;
  type?: string;
  templated?: boolean;
}

/**
 * Tipo base para recursos HATEOAS
 */
export interface HateoasResource {
  _links?: Record<string, HateoasLink | HateoasLink[]>;
}

/**
 * Colección HATEOAS con embedded resources
 */
export interface HateoasCollection<T> extends HateoasResource {
  _embedded?: Record<string, T[]>;
}

/**
 * Extrae los links de un recurso
 */
export type Links<T extends HateoasResource> = T['_links'];

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
// Usuario Types
// ============================================

export type RolUsuario = 'ADMIN' | 'DIRIGENTE' | 'ACAMPANTE' | 'PADRE';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE' | 'SUSPENDIDO';

export interface UsuarioModel extends HateoasResource {
  id: number;
  firebaseUid?: string;
  email: string;
  nombreMostrar: string;
  urlFoto?: string;
  emailVerificado: boolean;
  roles: RolUsuario[];
  estado: EstadoUsuario;
  fechaCreacion: string;
  ultimoLogin?: string;
  // Datos de perfil
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  localidad?: string;
  grupoSanguineo?: string;
  factorRh?: string;
  perfilCompleto: boolean;
}

export interface UsuariosCollection extends HateoasCollection<UsuarioModel> {
  _embedded?: {
    users: UsuarioModel[];
  };
}

export interface ActualizarPerfilRequest {
  nombreMostrar?: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  localidad?: string;
  grupoSanguineo?: string;
  factorRh?: string;
}

export interface UsuarioEstadisticas {
  totalUsuarios: number;
  totalActivos: number;
  totalInactivos: number;
  totalPendientes: number;
  totalAdmins: number;
  totalDirigentes: number;
  totalAcampantes: number;
  totalPadres: number;
}

// ============================================
// Calendario Types
// ============================================

export type TipoEvento = 'actividad' | 'reunion' | 'importante' | 'fecha_limite' | 'taller' | 'excursion';

export interface TipoEventoModel extends HateoasResource {
  value: string;
  label: string;
}

export interface TiposEventoCollection extends HateoasCollection<TipoEventoModel> {
  _embedded?: {
    tipoEventoModelList: TipoEventoModel[];
  };
}

export interface EventoCalendarioModel extends HateoasResource {
  id: number;
  titulo: string;
  descripcion?: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion?: string;
  participantes?: string[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface EventosCollection extends HateoasCollection<EventoCalendarioModel> {
  _embedded?: {
    eventoCalendarioModelList: EventoCalendarioModel[];
  };
}

export interface EventoCalendarioRequest {
  titulo: string;
  descripcion?: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacion?: string;
  participantes?: string[];
}

export interface CalendarioRootResponse extends HateoasResource {
  // La raíz del calendario solo tiene links
}

// ============================================
// Pagos Types
// ============================================

export interface PlanPagoModel extends HateoasResource {
  id: number;
  nombre: string;
  descripcion?: string;
  montoTotal: number;
  cantidadCuotas: number;
  activo: boolean;
}

export interface PlanesCollection extends HateoasCollection<PlanPagoModel> {
  _embedded?: {
    planPagoModelList: PlanPagoModel[];
  };
}

export interface CuotaModel extends HateoasResource {
  id: number;
  numeroCuota: number;
  monto: number;
  fechaVencimiento: string;
  estado: 'PENDIENTE' | 'PAGADA' | 'VENCIDA';
  fechaPago?: string;
}

export interface CuotasCollection extends HateoasCollection<CuotaModel> {
  _embedded?: {
    cuotaModelList: CuotaModel[];
  };
}

export interface InscripcionRequest {
  planPagoId: number;
  acampanteId: number;
}

export interface InscripcionResponse extends HateoasResource {
  id: number;
  planPagoId: number;
  acampanteId: number;
  fechaInscripcion: string;
  estado: string;
}

export interface IntencionPagoRequest {
  cuotaId: number;
}

export interface IntencionPagoResponse extends HateoasResource {
  id: number;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export interface PagosRootResponse extends HateoasResource {
  // La raíz de pagos solo tiene links
}

// ============================================
// Notificaciones Types
// ============================================

export interface TokenDispositivoRequest {
  token: string;
  platform?: string;
}

// ============================================
// Roles Types
// ============================================

export interface RolModel extends HateoasResource {
  nombre: string;
  descripcion: string;
}

export interface RolesCollection extends HateoasCollection<RolModel> {
  _embedded?: {
    rolModelList: RolModel[];
  };
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
