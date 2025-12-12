import { HateoasCollection, HateoasResource } from './hateoas';

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
