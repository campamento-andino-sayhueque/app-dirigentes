/**
 * Servicio de Calendario
 *
 * Gestiona todas las operaciones relacionadas con eventos del calendario
 * usando el cliente HATEOAS para descubrimiento dinámico.
 */

import { apiClient } from "./cas-client";
import { ApiResult } from "./http-client";
import {
  CalendarioRootResponse,
  EventoCalendarioModel,
  EventosCollection,
  EventoCalendarioRequest,
  TipoEventoModel,
  TiposEventoCollection,
} from "./types";

/**
 * Filtros para listar eventos
 */
export interface EventosFilter {
  desde?: Date | string;
  hasta?: Date | string;
  tipo?: string;
}

/**
 * Tipo para evento formateado para UI de calendario
 */
export interface CalendarEventFormatted {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  tipo: string;
  ubicacion?: string;
  participantes?: string[];
}

/**
 * Convierte un evento del backend al formato del calendario UI
 */
function toCalendarEvent(
  evento: EventoCalendarioModel
): CalendarEventFormatted {
  return {
    id: String(evento.id),
    title: evento.titulo,
    start: new Date(evento.fechaInicio),
    end: new Date(evento.fechaFin),
    descripcion: evento.descripcion || "",
    // Normalizar `tipo` que puede venir como string o como objeto { codigo, etiqueta, formato }
    tipo: ((): string => {
      const t: any = (evento as any).tipo;
      if (!t && t !== "") return "";
      if (typeof t === "string") return t;
      // si viene como objeto, preferir `formato`, luego `codigo`, luego `etiqueta`
      return t.formato ?? t.codigo ?? t.etiqueta ?? String(t);
    })(),
    ubicacion: evento.ubicacion,
    participantes: evento.participantes,
  };
}

/**
 * Convierte una lista de eventos del backend al formato del calendario UI
 */
function toCalendarEvents(
  eventos: EventoCalendarioModel[]
): CalendarEventFormatted[] {
  return eventos.map((e) => toCalendarEvent(e));
}

/**
 * Formatea una fecha para el query string (ISO 8601)
 */
function formatDateParam(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  if (typeof date === "string") return date;
  return date.toISOString();
}

/**
 * Construye los query params para el filtro de eventos
 */
function buildEventosQuery(filter: EventosFilter): string {
  const params = new URLSearchParams();

  const desde = formatDateParam(filter.desde);
  const hasta = formatDateParam(filter.hasta);

  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  if (filter.tipo) params.append("tipo", filter.tipo);

  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Servicio de calendario
 */
export const calendarioService = {
  /**
   * Descubre la API del calendario (punto de entrada)
   */
  async discover(): Promise<ApiResult<CalendarioRootResponse>> {
    return apiClient.get<CalendarioRootResponse>("/api/calendario");
  },

  /**
   * Lista eventos con filtros opcionales
   */
  async listEventos(
    filter: EventosFilter = {}
  ): Promise<ApiResult<EventosCollection>> {
    const query = buildEventosQuery(filter);
    return apiClient.get<EventosCollection>(`/api/calendario/eventos${query}`);
  },

  /**
   * Obtiene un evento por ID
   */
  async getEvento(id: number): Promise<ApiResult<EventoCalendarioModel>> {
    return apiClient.get<EventoCalendarioModel>(
      `/api/calendario/eventos/${id}`
    );
  },

  /**
   * Crea un nuevo evento (solo admin/dirigente)
   */
  async createEvento(
    evento: EventoCalendarioRequest
  ): Promise<ApiResult<EventoCalendarioModel>> {
    return apiClient.post<EventoCalendarioModel>(
      "/api/calendario/eventos",
      evento
    );
  },

  /**
   * Actualiza un evento existente (solo admin/dirigente)
   */
  async updateEvento(
    id: number,
    evento: EventoCalendarioRequest
  ): Promise<ApiResult<EventoCalendarioModel>> {
    return apiClient.put<EventoCalendarioModel>(
      `/api/calendario/eventos/${id}`,
      evento
    );
  },

  /**
   * Elimina un evento (solo admin/dirigente)
   */
  async deleteEvento(id: number): Promise<ApiResult<void>> {
    return apiClient.delete(`/api/calendario/eventos/${id}`);
  },

  /**
   * Lista los tipos de evento disponibles
   */
  async listTiposEvento(): Promise<ApiResult<TiposEventoCollection>> {
    return apiClient.get<TiposEventoCollection>("/api/calendario/tipos");
  },

  /**
   * Obtiene eventos de un mes específico
   */
  async getEventosMes(
    year: number,
    month: number
  ): Promise<ApiResult<EventosCollection>> {
    // month es 0-indexed en JavaScript, pero 1-indexed en la API
    const desde = new Date(year, month, 1);
    const hasta = new Date(year, month + 1, 0, 23, 59, 59); // Último día del mes

    return this.listEventos({ desde, hasta });
  },

  /**
   * Obtiene eventos de una semana específica
   */
  async getEventosSemana(date: Date): Promise<ApiResult<EventosCollection>> {
    const day = date.getDay();
    const desde = new Date(date);
    desde.setDate(date.getDate() - day); // Domingo
    desde.setHours(0, 0, 0, 0);

    const hasta = new Date(desde);
    hasta.setDate(desde.getDate() + 6); // Sábado
    hasta.setHours(23, 59, 59, 999);

    return this.listEventos({ desde, hasta });
  },

  /**
   * Obtiene eventos de hoy
   */
  async getEventosHoy(): Promise<ApiResult<EventosCollection>> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const finDia = new Date(hoy);
    finDia.setHours(23, 59, 59, 999);

    return this.listEventos({ desde: hoy, hasta: finDia });
  },

  /**
   * Obtiene próximos eventos
   */
  async getProximosEventos(
    dias: number = 30
  ): Promise<ApiResult<EventosCollection>> {
    const desde = new Date();
    const hasta = new Date();
    hasta.setDate(hasta.getDate() + dias);

    return this.listEventos({ desde, hasta });
  },

  // ============================================
  // Helpers
  // ============================================

  /**
   * Extrae la lista de eventos de una colección
   */
  extractEventos(collection: EventosCollection): EventoCalendarioModel[] {
    return collection._embedded?.eventoCalendarioModelList || [];
  },

  /**
   * Extrae la lista de tipos de evento de una colección
   */
  extractTipos(collection: TiposEventoCollection): TipoEventoModel[] {
    const tiposBackend = collection._embedded?.tipoEventoModelList || [];
    return tiposBackend.map((tipo: any) => ({
      // Preferir `formato` si el backend lo envía, si no usar `codigo`.
      value:
        tipo.formato ??
        tipo.codigo ??
        String(tipo.formato ?? tipo.codigo ?? tipo.etiqueta ?? ""),
      // Etiqueta para mostrar: preferir `etiqueta`, fallback a `codigo` o `formato`
      label: tipo.etiqueta ?? tipo.codigo ?? tipo.formato ?? "",
      _links: tipo._links,
    }));
  },

  /**
   * Convierte un evento del backend al formato del calendario UI
   */
  toCalendarEvent,

  /**
   * Convierte una lista de eventos del backend al formato del calendario UI
   */
  toCalendarEvents,
};
