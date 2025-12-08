"use client";

import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEventos, useTiposEvento, useCreateEvento, useDeleteEvento, useUpdateEvento } from "@/hooks/useCalendario";
import { EventoCalendarioRequest } from "@/lib/api/types";
import { CalendarEventFormatted } from "@/lib/api/calendario.service";
import { CalendarioHeader } from "./components/CalendarioHeader";
import { CalendarioView } from "./components/CalendarioView";
import { CalendarioLegend } from "./components/CalendarioLegend";
import { EventoDetailModal } from "./components/EventoDetailModal";
import { EventoFormModal } from "./components/EventoFormModal";
import { calendarioStore, calendarioActions } from "@/stores/calendario.store";

export default function CalendarioPage() {
  // TanStack Store hooks
  const selectedEvent = useStore(calendarioStore, (state) => state.selectedEvent);
  const isDetailModalOpen = useStore(calendarioStore, (state) => state.isDetailModalOpen);
  const isFormModalOpen = useStore(calendarioStore, (state) => state.isFormModalOpen);
  const isEditing = useStore(calendarioStore, (state) => state.isEditing);
  const draftEvento = useStore(calendarioStore, (state) => state.draftEvento);

  // Hooks de la API (TanStack Query)
  const { eventosCalendar, loading, error } = useEventos();
  const { tipos: tiposEvento } = useTiposEvento();
  const { createEvento, loading: creando } = useCreateEvento();
  const { updateEvento, loading: actualizando } = useUpdateEvento();
  const { deleteEvento, loading: eliminando } = useDeleteEvento();

  // Usar eventos de la API
  const eventos = useMemo(() => {
    return (eventosCalendar || []) as CalendarEventFormatted[];
  }, [eventosCalendar]);

  // Manejar creación de evento
  const handleCreateEvento = async (data: Partial<EventoCalendarioRequest>) => {
    if (!data.titulo || !data.fechaInicio || !data.fechaFin) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    try {
      await createEvento(data as EventoCalendarioRequest);
      calendarioActions.closeFormModal();
      // No need to reset manually as closeFormModal handles it
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("Error al crear el evento");
    }
  };

  // Manejar actualización de evento
  const handleUpdateEvento = async (data: Partial<EventoCalendarioRequest>) => {
    if (!selectedEvent || !data.titulo) return;
    
    try {
      await updateEvento(Number(selectedEvent.id), data as EventoCalendarioRequest);
      calendarioActions.closeFormModal();
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      alert("Error al actualizar el evento");
    }
  };

  // Manejar eliminación de evento
  const handleDeleteEvento = async () => {
    if (!selectedEvent) return;
    
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      try {
        await deleteEvento(Number(selectedEvent.id));
        calendarioActions.closeDetailModal();
      } catch (error) {
        console.error("Error al eliminar evento:", error);
        alert("Error al eliminar el evento");
      }
    }
  };

  // Calcular días restantes hasta el campamento
  const fechaInicioCampamento = new Date(2025, 11, 15);
  const hoy = new Date();
  const diasRestantes = Math.ceil(
    (fechaInicioCampamento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          
          <CalendarioHeader 
            diasRestantes={diasRestantes} 
            onNewEvent={calendarioActions.openCreateModal} 
            error={error}
          />

          <main className="max-w-7xl mx-auto">
            <CalendarioView 
              events={eventos} 
              loading={loading} 
              onSelectEvent={calendarioActions.openDetailModal} 
            />
            
            <CalendarioLegend tiposEvento={tiposEvento} />
          </main>
        </div>

        <EventoDetailModal
          selectedEvent={selectedEvent}
          isOpen={isDetailModalOpen}
          onClose={calendarioActions.closeDetailModal}
          onEdit={calendarioActions.openEditModal}
          onDelete={handleDeleteEvento}
          isDeleting={eliminando}
        />

        <EventoFormModal
          isOpen={isFormModalOpen}
          isEditing={isEditing}
          isLoading={creando || actualizando}
          defaultValues={draftEvento}
          tiposEvento={tiposEvento || []}
          onClose={calendarioActions.closeFormModal}
          onSave={(data) => {
             // Update draft in store as we type (optional, but good for persistence)
             // or just submit. Logic here:
             if (isEditing) {
               handleUpdateEvento(data);
             } else {
               handleCreateEvento(data);
             }
          }}
        />
      </div>
    </ProtectedRoute>
  );
}
