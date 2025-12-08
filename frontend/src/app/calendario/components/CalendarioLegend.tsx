import { casColors } from "@/lib/colors";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TipoEvento {
  value: string;
  label: string;
}

interface CalendarioLegendProps {
  tiposEvento: TipoEvento[] | undefined;
}

export function CalendarioLegend({ tiposEvento }: CalendarioLegendProps) {
  // Tipos de eventos para mostrar en la leyenda
  const tiposEventoToDisplay = useMemo(() => {
    // Si no hay tipos provistos por la API, no mostrar ningún tipo (sin mocks/fallbacks)
    const tipos: { value: string; label: string }[] = Array.isArray(tiposEvento) ? tiposEvento : [];

    // Deduplicar por value usando Map para mantener el último o primer valor
    const uniqueTiposMap = new Map();
    tipos.forEach((t) => {
      if (!uniqueTiposMap.has(t.value)) {
        uniqueTiposMap.set(t.value, t);
      }
    });
    
    return Array.from(uniqueTiposMap.values());
  }, [tiposEvento]);

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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">
          Tipos de eventos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tiposEventoToDisplay.map((tipo) => (
            <div key={tipo.value} className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="gap-2 px-3 py-1 font-normal text-sm"
                style={{ 
                  borderColor: getEventColor(tipo.value),
                  backgroundColor: `${getEventColor(tipo.value)}10` // 10% opacity bg
                }}
              >
                <span style={{ color: getEventColor(tipo.value) }}>
                  {getEventIcon(tipo.value)}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {tipo.label}
                </span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
