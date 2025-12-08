import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { eventoSchema, type EventoFormData } from "@/lib/schemas/evento.schema";
import { EventoCalendarioRequest } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EventoFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  defaultValues: Partial<EventoCalendarioRequest>;
  tiposEvento: { value: string; label: string }[];
  onClose: () => void;
  onSave: (data: EventoFormData) => void;
}

export function EventoFormModal({
  isOpen,
  isEditing,
  isLoading,
  defaultValues,
  tiposEvento,
  onClose,
  onSave,
}: EventoFormModalProps) {
  const form = useForm<EventoFormData>({
    resolver: valibotResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo: "",
      fechaInicio: "",
      fechaFin: "",
      ubicacion: "",
    },
  });

  // Reset form when modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      form.reset({
        titulo: defaultValues.titulo || "",
        descripcion: defaultValues.descripcion || "",
        // No usar fallback a 'actividad' — si no existe, dejar vacío y forzar selección
        tipo: defaultValues.tipo || "",
        // Extract YYYY-MM-DDTHH:mm from ISO string
        fechaInicio: defaultValues.fechaInicio ? defaultValues.fechaInicio.slice(0, 16) : "",
        fechaFin: defaultValues.fechaFin ? defaultValues.fechaFin.slice(0, 16) : "",
        ubicacion: defaultValues.ubicacion || "",
      });
    }
  }, [isOpen, defaultValues, form]);

  const handleSubmit = (data: EventoFormData) => {
    // Transform back to ISO dates if needed by parent, currently parent expects partial request
    // But the form data is strings. Let's pass the form data and let parent handle full ISO conversion or just append :00Z
    // Actually, schema has them as strings.
    // Ensure we send full ISO date to API ultimately
    const payload = {
      ...data,
      fechaInicio: new Date(data.fechaInicio).toISOString(),
      fechaFin: new Date(data.fechaFin).toISOString(),
    };
    onSave(payload as any); // Parent expects EventoFormData but with ISO strings? Let's check parent usage.
    // Parent expects to call internal state update or API.
    // We agreed to pass data back.
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar evento" : "Nuevo evento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del evento"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposEvento.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha inicio *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha fin *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Lugar del evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear evento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
