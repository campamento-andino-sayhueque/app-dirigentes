import { Store } from '@tanstack/store';
import { CalendarEventFormatted } from '@/lib/api/calendario.service';
import { EventoCalendarioRequest } from '@/lib/api/types';

interface CalendarioState {
  selectedEvent: CalendarEventFormatted | null;
  isDetailModalOpen: boolean;
  isFormModalOpen: boolean;
  isEditing: boolean;
  draftEvento: Partial<EventoCalendarioRequest>;
}

const DEFAULT_DRAFT_EVENTO: Partial<EventoCalendarioRequest> = {
  titulo: "",
  descripcion: "",
  tipo: "actividad",
  fechaInicio: "",
  fechaFin: "",
  ubicacion: "",
};

export const calendarioStore = new Store<CalendarioState>({
  selectedEvent: null,
  isDetailModalOpen: false,
  isFormModalOpen: false,
  isEditing: false,
  draftEvento: DEFAULT_DRAFT_EVENTO,
});

export const calendarioActions = {
  openDetailModal: (event: CalendarEventFormatted) => {
    calendarioStore.setState((state) => ({
      ...state,
      selectedEvent: event,
      isDetailModalOpen: true,
    }));
  },

  closeDetailModal: () => {
    calendarioStore.setState((state) => ({
      ...state,
      isDetailModalOpen: false,
      selectedEvent: null,
    }));
  },

  openCreateModal: () => {
    calendarioStore.setState((state) => ({
      ...state,
      isFormModalOpen: true,
      isEditing: false,
      draftEvento: DEFAULT_DRAFT_EVENTO,
    }));
  },

  openEditModal: () => {
    const { selectedEvent } = calendarioStore.state;
    if (!selectedEvent) return;

    const draft: Partial<EventoCalendarioRequest> = {
      titulo: selectedEvent.title,
      descripcion: selectedEvent.descripcion,
      tipo: selectedEvent.tipo,
      fechaInicio: selectedEvent.start.toISOString(),
      fechaFin: selectedEvent.end.toISOString(),
      ubicacion: selectedEvent.ubicacion || "",
    };

    calendarioStore.setState((state) => ({
      ...state,
      isFormModalOpen: true,
      isEditing: true,
      isDetailModalOpen: false, // Close detail modal if transitioning from it
      draftEvento: draft,
    }));
  },

  closeFormModal: () => {
    calendarioStore.setState((state) => ({
      ...state,
      isFormModalOpen: false,
      isEditing: false,
      draftEvento: DEFAULT_DRAFT_EVENTO,
    }));
  },

  updateDraft: (data: Partial<EventoCalendarioRequest>) => {
    calendarioStore.setState((state) => ({
      ...state,
      draftEvento: { ...state.draftEvento, ...data },
    }));
  },
  
  // Useful if we need to reset draft without closing
  resetDraft: () => {
    calendarioStore.setState((state) => ({
      ...state,
      draftEvento: DEFAULT_DRAFT_EVENTO,
    }));
  }
};
