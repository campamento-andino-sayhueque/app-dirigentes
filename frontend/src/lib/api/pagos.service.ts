/**
 * Servicio de Pagos
 * 
 * Gestiona todas las operaciones relacionadas con pagos, planes e inscripciones
 * usando el cliente HATEOAS para descubrimiento dinámico.
 */

import { apiClient } from './cas-client';
import { ApiResult } from './http-client';
import { 
  PagosRootResponse,
  PlanPagoModel, 
  PlanesCollection,
  CuotaModel,
  CuotasCollection,
  InscripcionRequest,
  InscripcionResponse,
  IntencionPagoRequest,
  IntencionPagoResponse,
  MpPreferenceRequest,
  MpPreferenceResponse,
  MesEnum
} from './types';

/**
 * Servicio de pagos
 */
export const pagosService = {
  /**
   * Descubre la API de pagos (punto de entrada)
   */
  async discover(): Promise<ApiResult<PagosRootResponse>> {
    return apiClient.get<PagosRootResponse>('/api/pagos');
  },

  // ============================================
  // Planes de Pago
  // ============================================

  /**
   * Lista todos los planes de pago disponibles
   */
  async listPlanes(): Promise<ApiResult<PlanesCollection>> {
    return apiClient.get<PlanesCollection>('/api/pagos/planes');
  },

  /**
   * Obtiene un plan de pago por código
   */
  async getPlan(codigo: string): Promise<ApiResult<PlanPagoModel>> {
    return apiClient.get<PlanPagoModel>(`/api/pagos/planes/${codigo}`);
  },

  // ============================================
  // Inscripciones
  // ============================================

  /**
   * Crea una nueva inscripción a un plan de pago
   */
  async createInscripcion(data: InscripcionRequest): Promise<ApiResult<InscripcionResponse>> {
    return apiClient.post<InscripcionResponse>('/api/pagos/inscripciones', data);
  },

  /**
   * Obtiene las cuotas de una inscripción
   */
  async getCuotasInscripcion(inscripcionId: number): Promise<ApiResult<CuotasCollection>> {
    return apiClient.get<CuotasCollection>(`/api/pagos/inscripciones/${inscripcionId}/cuotas`);
  },

  // ============================================
  // Intenciones de Pago
  // ============================================

  /**
   * Crea una intención de pago para cuotas seleccionadas
   * Devuelve la URL de redirección si el método es MERCADOPAGO
   */
  async createIntencionPago(data: IntencionPagoRequest): Promise<ApiResult<IntencionPagoResponse>> {
    return apiClient.post<IntencionPagoResponse>('/api/pagos/intenciones', data);
  },

  // ============================================
  // MercadoPago Direct (para pruebas o uso directo)
  // ============================================

  /**
   * Crea una preferencia de pago directamente en MercadoPago
   */
  async createMpPreference(data: MpPreferenceRequest): Promise<ApiResult<MpPreferenceResponse>> {
    return apiClient.post<MpPreferenceResponse>('/api/mercadopago/checkout-pro/preferences', data);
  },

  // ============================================
  // Helpers
  // ============================================

  /**
   * Extrae la lista de planes de una colección
   */
  extractPlanes(collection: PlanesCollection): PlanPagoModel[] {
    return collection.content || collection._embedded?.planPagoModelList || [];
  },

  /**
   * Extrae la lista de cuotas de una colección
   */
  extractCuotas(collection: CuotasCollection): CuotaModel[] {
    return collection.content || collection._embedded?.cuotaModelList || [];
  },

  /**
   * Calcula el monto pendiente de pago de una lista de cuotas
   */
  calcularMontoPendiente(cuotas: CuotaModel[]): number {
    return cuotas
      .filter(c => c.estado !== 'PAGADA')
      .reduce((total, c) => total + c.monto, 0);
  },

  /**
   * Calcula el monto pagado de una lista de cuotas
   */
  calcularMontoPagado(cuotas: CuotaModel[]): number {
    return cuotas
      .filter(c => c.estado === 'PAGADA')
      .reduce((total, c) => total + c.monto, 0);
  },

  /**
   * Obtiene las cuotas vencidas
   */
  getCuotasVencidas(cuotas: CuotaModel[]): CuotaModel[] {
    return cuotas.filter(c => c.estado === 'VENCIDA');
  },

  /**
   * Obtiene las cuotas pendientes
   */
  getCuotasPendientes(cuotas: CuotaModel[]): CuotaModel[] {
    return cuotas.filter(c => c.estado === 'PENDIENTE');
  },

  /**
   * Obtiene la próxima cuota a pagar
   */
  getProximaCuota(cuotas: CuotaModel[]): CuotaModel | undefined {
    const pendientes = this.getCuotasPendientes(cuotas)
      .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
    
    return pendientes[0];
  },

  /**
   * Formatea un monto como moneda argentina
   */
  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  },

  /**
   * Convierte MesEnum a nombre en español
   */
  mesEnumToSpanish(mes: MesEnum): string {
    const meses: Record<MesEnum, string> = {
      'JANUARY': 'Enero',
      'FEBRUARY': 'Febrero', 
      'MARCH': 'Marzo',
      'APRIL': 'Abril',
      'MAY': 'Mayo',
      'JUNE': 'Junio',
      'JULY': 'Julio',
      'AUGUST': 'Agosto',
      'SEPTEMBER': 'Septiembre',
      'OCTOBER': 'Octubre',
      'NOVEMBER': 'Noviembre',
      'DECEMBER': 'Diciembre'
    };
    return meses[mes] || mes;
  },
};
