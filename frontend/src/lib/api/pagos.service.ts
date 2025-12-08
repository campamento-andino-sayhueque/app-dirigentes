/**
 * Servicio de Pagos
 * 
 * Gestiona todas las operaciones relacionadas con pagos, planes e inscripciones
 * usando el cliente HATEOAS para descubrimiento dinámico.
 */

import { apiClient, ApiResult } from './api-client';
import { 
  PagosRootResponse,
  PlanPagoModel, 
  PlanesCollection,
  CuotaModel,
  CuotasCollection,
  InscripcionRequest,
  InscripcionResponse,
  IntencionPagoRequest,
  IntencionPagoResponse
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
   * Obtiene un plan de pago por ID
   */
  async getPlan(id: number): Promise<ApiResult<PlanPagoModel>> {
    return apiClient.get<PlanPagoModel>(`/api/pagos/planes/${id}`);
  },

  // ============================================
  // Inscripciones
  // ============================================

  /**
   * Crea una nueva inscripción
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
  // Intenciones de Pago (MercadoPago)
  // ============================================

  /**
   * Crea una intención de pago para una cuota
   * Devuelve la preferencia de MercadoPago con el link de pago
   */
  async createIntencionPago(data: IntencionPagoRequest): Promise<ApiResult<IntencionPagoResponse>> {
    return apiClient.post<IntencionPagoResponse>('/api/pagos/intencion', data);
  },

  /**
   * Inicia el flujo de pago para una cuota específica
   * Retorna la URL de checkout de MercadoPago
   */
  async iniciarPagoCuota(cuotaId: number, sandbox: boolean = false): Promise<ApiResult<string>> {
    const result = await this.createIntencionPago({ cuotaId });
    
    if (result.error) {
      return { error: result.error };
    }

    const checkoutUrl = sandbox 
      ? result.data?.sandboxInitPoint 
      : result.data?.initPoint;

    if (!checkoutUrl) {
      return { 
        error: new Error('No se pudo obtener URL de pago') as never 
      };
    }

    return { data: checkoutUrl };
  },

  // ============================================
  // Helpers
  // ============================================

  /**
   * Extrae la lista de planes de una colección
   */
  extractPlanes(collection: PlanesCollection): PlanPagoModel[] {
    return collection._embedded?.planPagoModelList || [];
  },

  /**
   * Extrae la lista de cuotas de una colección
   */
  extractCuotas(collection: CuotasCollection): CuotaModel[] {
    return collection._embedded?.cuotaModelList || [];
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
  }
};
