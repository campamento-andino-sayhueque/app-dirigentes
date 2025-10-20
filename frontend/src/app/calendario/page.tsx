"use client";

import { useState, useCallback, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Calendar, dateFnsLocalizer, View, Event } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { casColors } from "@/lib/colors";

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

// Tipos de eventos
export interface EventoCampamento extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  tipo:
    | "actividad"
    | "reunion"
    | "importante"
    | "fecha-limite"
    | "taller"
    | "excursion";
  participantes?: string[];
  ubicacion?: string;
}

// Datos de ejemplo (mock - luego conectar con Firebase)
const eventosMock: EventoCampamento[] = [
  {
    id: "1",
    title: "Reunión de Padres",
    start: new Date(2025, 10, 25, 18, 0), // 25 nov 2025, 18:00
    end: new Date(2025, 10, 25, 20, 0),
    descripcion: "Reunión informativa sobre el campamento de verano",
    tipo: "reunion",
    ubicacion: "Sede del campamento",
  },
  {
    id: "2",
    title: "Fecha límite de inscripciones",
    start: new Date(2025, 11, 1, 0, 0),
    end: new Date(2025, 11, 1, 23, 59),
    descripcion: "Último día para completar la inscripción",
    tipo: "fecha-limite",
  },
  {
    id: "3",
    title: "Inicio del Campamento",
    start: new Date(2025, 11, 15, 9, 0),
    end: new Date(2025, 11, 15, 18, 0),
    descripcion: "Primer día de actividades del campamento",
    tipo: "importante",
    ubicacion: "Campamento Base",
  },
  {
    id: "4",
    title: "Taller de Supervivencia",
    start: new Date(2025, 11, 16, 10, 0),
    end: new Date(2025, 11, 16, 13, 0),
    descripcion: "Aprende técnicas básicas de supervivencia",
    tipo: "taller",
    ubicacion: "Zona de bosque",
  },
  {
    id: "5",
    title: "Excursión al Cerro",
    start: new Date(2025, 11, 17, 8, 0),
    end: new Date(2025, 11, 17, 17, 0),
    descripcion: "Trekking al mirador panorámico",
    tipo: "excursion",
    ubicacion: "Cerro Campanario",
  },
  {
    id: "6",
    title: "Taller de Primeros Auxilios",
    start: new Date(2025, 11, 18, 14, 0),
    end: new Date(2025, 11, 18, 16, 0),
    descripcion: "Capacitación en primeros auxilios básicos",
    tipo: "taller",
  },
  {
    id: "7",
    title: "Fogón y Cierre",
    start: new Date(2025, 11, 20, 19, 0),
    end: new Date(2025, 11, 20, 22, 0),
    descripcion: "Fogón de despedida y cierre del campamento",
    tipo: "importante",
    ubicacion: "Fogón Central",
  },
];

export default function CalendarioPage() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventoCampamento | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-red-50 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8 md:pt-8">
          <header className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              📅 <span className="text-[#FF6B35]">Calendario</span>
            </h1>
            <p className="text-gray-600">
              Eventos y actividades del campamento
            </p>
          </header>

          {/* Contador de días */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border-2 border-[#FF6B35]">
              <div className="flex items-center justify-center gap-4">
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
                events={eventosMock}
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
            </div>

            {/* Leyenda de tipos de eventos */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Tipos de eventos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { tipo: "importante", label: "Importante" },
                  { tipo: "fecha-limite", label: "Fecha límite" },
                  { tipo: "reunion", label: "Reunión" },
                  { tipo: "taller", label: "Taller" },
                  { tipo: "excursion", label: "Excursión" },
                  { tipo: "actividad", label: "Actividad" },
                ].map(({ tipo, label }) => (
                  <div key={tipo} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getEventColor(tipo) }}
                    />
                    <span className="text-sm text-gray-700">
                      {getEventIcon(tipo)} {label}
                    </span>
                  </div>
                ))}
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
                <button className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Ver más detalles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
