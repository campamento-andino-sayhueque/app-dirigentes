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

export interface TipoEventoBackendModel extends HateoasResource {
  codigo?: string;
  etiqueta?: string;
  // Algunos endpoints pueden enviar la clave `formato` en lugar de `codigo`.
  // Aceptamos ambas para ser compatibles con el backend.
  formato?: string;
}

export interface TipoEventoModel extends HateoasResource {
  value: string;
  label: string;
}

export interface TiposEventoCollection extends HateoasCollection<TipoEventoBackendModel> {
  _embedded?: {
    tipoEventoModelList: TipoEventoBackendModel[];
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

/**
 * Mes del año (formato Java)
 */
export type MesEnum = 
  | 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' 
  | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' 
  | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

/**
 * Método de pago disponible
 */
export type MetodoPago = 'EFECTIVO' | 'MERCADOPAGO';

/**
 * Estado de una intención de pago
 */
export type EstadoIntencionPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'EXPIRADO' | 'REEMBOLSADO';

/**
 * Estado de una cuota
 */
export type EstadoCuota = 'PENDIENTE' | 'PAGADA' | 'VENCIDA';

/**
 * Plan de pago disponible para inscripción
 */
export interface PlanPagoModel extends HateoasResource {
  codigo: string;
  nombre: string;
  anio: number;
  montoTotal: number;
  minCuotas: number;
  maxCuotas: number;
  mesInicio: MesEnum;
  mesFin: MesEnum;
  activo: boolean;
}

export interface PlanesCollection extends HateoasCollection<PlanPagoModel> {
  _embedded?: {
    planPagoModelList: PlanPagoModel[];
  };
  content?: PlanPagoModel[];
}

/**
 * Cuota de un plan de pago
 */
export interface CuotaModel extends HateoasResource {
  id: number;
  secuencia: number;
  fechaVencimiento: string;
  monto: number;
  estado: EstadoCuota;
}

export interface CuotasCollection extends HateoasCollection<CuotaModel> {
  _embedded?: {
    cuotaModelList: CuotaModel[];
  };
  content?: CuotaModel[];
}

/**
 * Request para crear una inscripción
 */
export interface InscripcionRequest {
  idUsuario: string;
  codigoPlan: string;
  mesInicio: MesEnum;
  cuotasDeseadas?: number; // 2-12
}

/**
 * Respuesta al crear una inscripción
 */
export interface InscripcionResponse extends HateoasResource {
  idInscripcion: number;
  cuotas: CuotaModel[];
}

/**
 * Request para crear una intención de pago
 */
export interface IntencionPagoRequest {
  idInscripcion: number;
  idsCuotas: number[];
  metodo: MetodoPago;
}

/**
 * Respuesta al crear una intención de pago
 */
export interface IntencionPagoResponse extends HateoasResource {
  id: number;
  idInscripcion: number;
  estado: EstadoIntencionPago;
  urlRedireccion?: string;
}

/**
 * Request para crear preferencia de MercadoPago (uso directo)
 */
export interface MpPreferenceRequest {
  items: MpItemRequest[];
  successUrl?: string;
  failureUrl?: string;
  pendingUrl?: string;
}

export interface MpItemRequest {
  title: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Respuesta de preferencia de MercadoPago
 */
export interface MpPreferenceResponse {
  preferenceId: string;
  initPoint: string;
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
