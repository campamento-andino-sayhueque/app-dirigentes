import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { getEventColor, getEventIcon } from "./helpers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface EventoDetailModalProps {
  selectedEvent: any; // Using any for flexibility now, should match EventoCampamento interface
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isOpen: boolean; // Add isOpen prop. It was implicit before via passing null? But Dialog needs explicit open
}
// Actually, in CalendarioPage, selectedEvent being null implied closed. 
// But Dialog controlled needs separate boolean or "!!selectedEvent".
// Let's rely on !!selectedEvent if we don't change parent prop.
// But passing `open={!!selectedEvent}` works best if we also handle onOpenChange.

export function EventoDetailModal({ 
  selectedEvent, 
  onClose, 
  onEdit, 
  onDelete, 
  isDeleting 
}: EventoDetailModalProps) {
  // If no event is selected, we don't render or render closed?
  // Dialog component handles mount/unmount usually. 
  
  return (
    <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {selectedEvent && getEventIcon(selectedEvent.tipo)}
            </span>
            <DialogTitle className="text-2xl font-bold">
               {selectedEvent?.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {selectedEvent && (
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none text-muted-foreground">Descripción</h4>
              <p className="text-sm text-foreground">{selectedEvent.descripcion}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none text-muted-foreground">Fecha y hora</h4>
              <p className="text-sm text-foreground">
                📅 {format(selectedEvent.start, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <p className="text-sm text-foreground">
                🕐 {format(selectedEvent.start, "HH:mm", { locale: es })} -{" "}
                {format(selectedEvent.end, "HH:mm", { locale: es })}
              </p>
            </div>

            {selectedEvent.ubicacion && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none text-muted-foreground">Ubicación</h4>
                <p className="text-sm text-foreground">📍 {selectedEvent.ubicacion}</p>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none text-muted-foreground mb-2">Tipo</h4>
              <Badge 
                style={{ backgroundColor: getEventColor(selectedEvent.tipo) }}
                className="text-white hover:opacity-90"
              >
                {selectedEvent.tipo.charAt(0).toUpperCase() + selectedEvent.tipo.slice(1)}
              </Badge>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="default" onClick={onEdit}>
            ✏️ Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "🗑️ Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
