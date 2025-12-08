import { object, string, minLength, pipe, type InferOutput } from 'valibot';

export const eventoSchema = object({
  titulo: pipe(string(), minLength(3, 'El título debe tener al menos 3 caracteres')),
  descripcion: string(),
  tipo: pipe(string(), minLength(1, 'Debes seleccionar un tipo')),
  fechaInicio: pipe(string(), minLength(1, 'Fecha inicio requerida')),
  fechaFin: pipe(string(), minLength(1, 'Fecha fin requerida')),
  ubicacion: string()
});

export type EventoFormData = InferOutput<typeof eventoSchema>;



