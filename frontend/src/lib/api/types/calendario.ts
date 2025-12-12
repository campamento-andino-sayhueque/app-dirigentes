import { HateoasCollection, HateoasResource } from './hateoas';

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
