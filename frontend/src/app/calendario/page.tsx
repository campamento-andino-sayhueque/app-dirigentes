"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Calendar, dateFnsLocalizer, View, Event } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { casColors } from "@/lib/colors";
import { useEventos, useTiposEvento, useCreateEvento, useDeleteEvento, useUpdateEvento } from "@/hooks/useCalendario";
import { EventoCalendarioRequest } from "@/lib/api/types";

// Configurar localizador de date-fns
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Tipos de eventos para el calendario UI
export interface EventoCampamento extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  tipo: string;
  participantes?: string[];
  ubicacion?: string;
}

export default function CalendarioPage() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventoCampamento | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para nuevo evento
  const [newEvento, setNewEvento] = useState<Partial<EventoCalendarioRequest>>({
    titulo: "",
    descripcion: "",
    tipo: "actividad",
    fechaInicio: "",
    fechaFin: "",
    ubicacion: "",
  });

  // Hooks de la API
  const { eventosCalendar, loading, error, refetch } = useEventos();
  const { tipos: tiposEvento } = useTiposEvento();
  const { createEvento, loading: creando } = useCreateEvento();
  const { updateEvento, loading: actualizando } = useUpdateEvento();
  const { deleteEvento, loading: eliminando } = useDeleteEvento();

  // Usar eventos de la API
  const eventos: EventoCampamento[] = useMemo(() => {
    return (eventosCalendar || []) as EventoCampamento[];
  }, [eventosCalendar]);

  // Calcular días restantes hasta el campamento
  const fechaInicioCampamento = new Date(2025, 11, 15);
  const hoy = new Date();
  const diasRestantes = Math.ceil(
    (fechaInicioCampamento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Obtener color según tipo de evento
  const getEventColor = (tipo: string) => {
    switch (tipo) {
      case "importante":
        return casColors.primary.orange;
      case "fecha_limite":
      case "fecha-limite":
        return casColors.primary.red;
      case "reunion":
        return casColors.nature.green[600];
      case "actividad":
        return casColors.ui.info;
      case "taller":
        return casColors.nature.green[500];
      case "excursion":
        return casColors.nature.mountain;
      default:
        return casColors.ui.text.secondary;
    }
  };

  // Estilo personalizado para eventos
  const eventStyleGetter = useCallback((event: EventoCampamento) => {
    const backgroundColor = getEventColor(event.tipo);
    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontWeight: "500",
        fontSize: "0.875rem",
      },
    };
  }, []);

  // Manejar selección de evento
  const handleSelectEvent = useCallback((event: EventoCampamento) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  // Manejar navegación
  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  // Manejar cambio de vista
  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  // Mensajes en español
  const messages = useMemo(
    () => ({
      allDay: "Todo el día",
      previous: "Anterior",
      next: "Siguiente",
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
      agenda: "Agenda",
      date: "Fecha",
      time: "Hora",
      event: "Evento",
      noEventsInRange: "No hay eventos en este rango",
      showMore: (total: number) => `+ Ver más (${total})`,
    }),
    []
  );

  // Obtener icono según tipo
  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "importante":
        return "⭐";
      case "fecha_limite":
      case "fecha-limite":
        return "⏰";
      case "reunion":
        return "👥";
      case "actividad":
        return "🏕️";
      case "taller":
        return "📚";
      case "excursion":
        return "🥾";
      default:
        return "📅";
    }
  };

  // Manejar creación de evento
  const handleCreateEvento = async () => {
    if (!newEvento.titulo || !newEvento.fechaInicio || !newEvento.fechaFin) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    const result = await createEvento(newEvento as EventoCalendarioRequest);
    if (!result.error) {
      setShowCreateModal(false);
      setNewEvento({
        titulo: "",
        descripcion: "",
        tipo: "actividad",
        fechaInicio: "",
        fechaFin: "",
        ubicacion: "",
      });
      refetch();
    }
  };

  // Manejar actualización de evento
  const handleUpdateEvento = async () => {
    if (!selectedEvent || !newEvento.titulo) return;
    
    const result = await updateEvento(Number(selectedEvent.id), newEvento as EventoCalendarioRequest);
    if (!result.error) {
      setShowModal(false);
      setIsEditing(false);
      refetch();
    }
  };

  // Manejar eliminación de evento
  const handleDeleteEvento = async () => {
    if (!selectedEvent) return;
    
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      const result = await deleteEvento(Number(selectedEvent.id));
      if (!result.error) {
        setShowModal(false);
        refetch();
      }
    }
  };

  // Iniciar edición de evento
  const startEditing = () => {
    if (!selectedEvent) return;
    setNewEvento({
      titulo: selectedEvent.title,
      descripcion: selectedEvent.descripcion,
      tipo: selectedEvent.tipo,
      fechaInicio: selectedEvent.start.toISOString(),
      fechaFin: selectedEvent.end.toISOString(),
      ubicacion: selectedEvent.ubicacion || "",
    });
    setIsEditing(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              📅 <span className="text-[#FF6B35]">Calendario</span>
            </h1>
            <p className="text-gray-600">
              Eventos y actividades del campamento
            </p>
            {error && (
              <p className="text-red-600 text-sm mt-2">
                ❌ Error al conectar con el servidor: {error.message}
              </p>
            )}
          </header>

          {/* Contador de días */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border-2 border-[#FF6B35]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl md:text-6xl font-bold text-[#FF6B35]">
                    {diasRestantes}
                  </div>
                  <div className="text-left">
                    <div className="text-lg md:text-2xl text-gray-700 uppercase tracking-wide font-medium">
                      DÍAS
                    </div>
                    <p className="text-gray-600 text-xs md:text-base">
                      para el campamento 2025/2026
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>➕</span>
                  <span className="hidden md:inline">Nuevo evento</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendario principal */}
          <main className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
              {/* Estilos personalizados para react-big-calendar */}
              <style jsx global>{`
                .rbc-calendar {
                  font-family: inherit;
                  min-height: 600px;
                }

                .rbc-header {
                  padding: 12px 6px;
                  font-weight: 600;
                  color: ${casColors.ui.text.primary};
                  background-color: ${casColors.nature.green[50]};
                  border-bottom: 2px solid ${casColors.nature.green[200]};
                }

                .rbc-today {
                  background-color: ${casColors.nature.green[50]};
                }

                .rbc-off-range-bg {
                  background-color: ${casColors.ui.background};
                }

                .rbc-toolbar {
                  padding: 16px 0;
                  margin-bottom: 16px;
                  flex-wrap: wrap;
                  gap: 12px;
                }

                .rbc-toolbar button {
                  padding: 8px 16px;
                  border-radius: 8px;
                  border: 1px solid ${casColors.ui.border};
                  background-color: white;
                  color: ${casColors.ui.text.primary};
                  font-weight: 500;
                  transition: all 0.2s;
                }

                .rbc-toolbar button:hover {
                  background-color: ${casColors.nature.green[50]};
                  border-color: ${casColors.nature.green[300]};
                }

                .rbc-toolbar button.rbc-active {
                  background-color: ${casColors.primary.orange};
                  color: white;
                  border-color: ${casColors.primary.orange};
                }

                .rbc-toolbar button.rbc-active:hover {
                  background-color: #e55a2b;
                }

                .rbc-month-view {
                  border-radius: 8px;
                  overflow: hidden;
                  border: 1px solid ${casColors.ui.border};
                }

                .rbc-event {
                  padding: 4px 6px;
                  border-radius: 6px;
                }

                .rbc-event-label {
                  font-size: 0.75rem;
                }

                .rbc-show-more {
                  background-color: ${casColors.primary.orange};
                  color: white;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-weight: 500;
                  font-size: 0.75rem;
                }

                .rbc-agenda-view {
                  border-radius: 8px;
                  overflow: hidden;
                }

                .rbc-agenda-table {
                  border: 1px solid ${casColors.ui.border};
                }

                .rbc-agenda-date-cell,
                .rbc-agenda-time-cell {
                  padding: 12px;
                  font-weight: 500;
                }

                .rbc-agenda-event-cell {
                  padding: 12px;
                }

                .rbc-current-time-indicator {
                  background-color: ${casColors.primary.red};
                  height: 2px;
                }
              `}</style>

              <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                onView={handleViewChange}
                date={date}
                onNavigate={handleNavigate}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                messages={messages}
                culture="es"
                popup
                selectable
              />
              {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
                </div>
              )}
            </div>

            {/* Leyenda de tipos de eventos */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Tipos de eventos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(() => {
                  const defaultTipos: { value: string; label: string }[] = [
                    { value: "importante", label: "Importante" },
                    { value: "fecha_limite", label: "Fecha límite" },
                    { value: "reunion", label: "Reunión" },
                    { value: "taller", label: "Taller" },
                    { value: "excursion", label: "Excursión" },
                    { value: "actividad", label: "Actividad" },
                  ];
                  const tipos = tiposEvento.length > 0 ? tiposEvento : defaultTipos;
                  return tipos.map((tipo, index) => (
                    <div key={`${tipo.value}-${index}`} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getEventColor(tipo.value) }}
                      />
                      <span className="text-sm text-gray-700">
                        {getEventIcon(tipo.value)} {tipo.label}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </main>
        </div>

        {/* Modal de detalles del evento */}
        {showModal && selectedEvent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {getEventIcon(selectedEvent.tipo)}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedEvent.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Descripción
                  </p>
                  <p className="text-gray-700">{selectedEvent.descripcion}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Fecha y hora
                  </p>
                  <p className="text-gray-700">
                    📅{" "}
                    {format(
                      selectedEvent.start,
                      "EEEE, d 'de' MMMM 'de' yyyy",
                      { locale: es }
                    )}
                  </p>
                  <p className="text-gray-700">
                    🕐 {format(selectedEvent.start, "HH:mm", { locale: es })} -{" "}
                    {format(selectedEvent.end, "HH:mm", { locale: es })}
                  </p>
                </div>

                {selectedEvent.ubicacion && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Ubicación
                    </p>
                    <p className="text-gray-700">
                      📍 {selectedEvent.ubicacion}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Tipo</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{
                      backgroundColor: getEventColor(selectedEvent.tipo),
                    }}
                  >
                    {selectedEvent.tipo.charAt(0).toUpperCase() +
                      selectedEvent.tipo.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={startEditing}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={handleDeleteEvento}
                  disabled={eliminando}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {eliminando ? "..." : "🗑️"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de crear/editar evento */}
        {(showCreateModal || isEditing) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setIsEditing(false);
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Editar evento" : "Nuevo evento"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsEditing(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 font-medium mb-1 block">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newEvento.titulo || ""}
                    onChange={(e) => setNewEvento({ ...newEvento, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="Nombre del evento"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-medium mb-1 block">
                    Descripción
                  </label>
                  <textarea
                    value={newEvento.descripcion || ""}
                    onChange={(e) => setNewEvento({ ...newEvento, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="Descripción del evento"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-medium mb-1 block">
                    Tipo de evento
                  </label>
                  <select
                    value={newEvento.tipo || "actividad"}
                    onChange={(e) => setNewEvento({ ...newEvento, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    {(() => {
                      const defaultTipos: { value: string; label: string }[] = [
                        { value: "actividad", label: "Actividad" },
                        { value: "reunion", label: "Reunión" },
                        { value: "importante", label: "Importante" },
                        { value: "fecha_limite", label: "Fecha límite" },
                        { value: "taller", label: "Taller" },
                        { value: "excursion", label: "Excursión" },
                      ];
                      const tipos: { value: string; label: string }[] = tiposEvento.length > 0 ? tiposEvento : defaultTipos;
                      return tipos.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ));
                    })()}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 font-medium mb-1 block">
                      Fecha inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvento.fechaInicio ? newEvento.fechaInicio.slice(0, 16) : ""}
                      onChange={(e) => setNewEvento({ ...newEvento, fechaInicio: new Date(e.target.value).toISOString() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 font-medium mb-1 block">
                      Fecha fin *
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvento.fechaFin ? newEvento.fechaFin.slice(0, 16) : ""}
                      onChange={(e) => setNewEvento({ ...newEvento, fechaFin: new Date(e.target.value).toISOString() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-medium mb-1 block">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={newEvento.ubicacion || ""}
                    onChange={(e) => setNewEvento({ ...newEvento, ubicacion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="Lugar del evento"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsEditing(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={isEditing ? handleUpdateEvento : handleCreateEvento}
                  disabled={creando || actualizando}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {creando || actualizando ? "Guardando..." : isEditing ? "Actualizar" : "Crear evento"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
