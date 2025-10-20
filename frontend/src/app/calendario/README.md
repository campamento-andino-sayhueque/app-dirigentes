# 📅 Módulo de Calendario - CAS

## Descripción
Implementación robusta del calendario de eventos del Campamento Andino Sayhueque usando **react-big-calendar**, una librería profesional para gestión de calendarios en React.

## Características Implementadas

### ✅ Vista de Calendario Completa
- **Múltiples vistas**: Mes, Semana, Día y Agenda
- **Navegación fluida**: Anterior, Siguiente, Hoy
- **Localización**: Completamente en español (date-fns locale)
- **Responsive**: Adaptado para móviles y desktop

### 🎨 Personalización Visual
- Colores del CAS integrados (naranja, verde, rojo)
- Eventos coloreados según tipo
- Estilos personalizados para cada vista
- Indicadores visuales de eventos importantes

### 📊 Tipos de Eventos
- **⭐ Importante**: Eventos destacados (naranja)
- **⏰ Fecha límite**: Plazos importantes (rojo)
- **👥 Reunión**: Reuniones de padres/staff (verde oscuro)
- **📚 Taller**: Talleres educativos (verde)
- **🥾 Excursión**: Salidas y trekkings (marrón montaña)
- **🏕️ Actividad**: Actividades generales (azul)

### 🔍 Detalles de Eventos
- Modal informativo al hacer clic en un evento
- Información completa: fecha, hora, ubicación, descripción
- Iconos visuales según tipo de evento
- Botones de acción (expandible)

## Estructura de Datos

```typescript
interface EventoCampamento {
  id: string;
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  tipo: 'actividad' | 'reunion' | 'importante' | 'fecha-limite' | 'taller' | 'excursion';
  participantes?: string[];
  ubicacion?: string;
}
```

## Próximas Mejoras

### 🔥 Integración con Firebase
```typescript
// TODO: Conectar con Firestore
const eventosRef = collection(db, 'eventos');
const eventosSnapshot = await getDocs(eventosRef);
const eventos = eventosSnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
  start: doc.data().start.toDate(),
  end: doc.data().end.toDate(),
}));
```

### 🎯 Funcionalidades Pendientes
- [ ] CRUD de eventos (Crear, Editar, Eliminar)
- [ ] Filtros por tipo de evento
- [ ] Sincronización con Google Calendar
- [ ] Notificaciones de recordatorio
- [ ] Export a ICS (iCalendar)
- [ ] Inscripción a eventos desde el calendario
- [ ] Vista de participantes por evento
- [ ] Integración con sistema de pagos
- [ ] Calendario personal vs. calendario general
- [ ] Búsqueda de eventos

### 📱 Mejoras de UX
- [ ] Drag & Drop para reorganizar eventos (admins)
- [ ] Vista de lista para móviles
- [ ] Compartir evento por WhatsApp/Email
- [ ] Agregar evento al calendario personal
- [ ] Modo oscuro
- [ ] Impresión de calendario mensual

### 🔐 Permisos y Roles
- [ ] Eventos públicos vs privados
- [ ] Solo admins pueden crear/editar
- [ ] Padres pueden ver eventos de sus hijos
- [ ] Dirigentes pueden gestionar su grupo

## Dependencias

```json
{
  "react-big-calendar": "^1.19.4",
  "date-fns": "^4.x",
  "@types/react-big-calendar": "^1.8.x"
}
```

## Uso

```tsx
import CalendarioPage from '@/app/calendario/page';

// El componente está protegido con ProtectedRoute
// Solo usuarios autenticados pueden acceder
```

## Estilos Personalizados

Los estilos están inline en el componente usando los colores del sistema CAS:
- Headers: Verde CAS (#22C55E tints)
- Eventos importantes: Naranja CAS (#FF6B35)
- Fechas límite: Rojo CAS (#DC2626)
- Hover states: Transiciones suaves

## API de react-big-calendar

### Props Principales Usadas
- `localizer`: date-fns localizer en español
- `events`: Array de eventos
- `view`: Vista actual (month/week/day/agenda)
- `date`: Fecha actual mostrada
- `onSelectEvent`: Handler para clic en evento
- `eventPropGetter`: Función para estilos de eventos
- `messages`: Textos en español

### Documentación Oficial
- [react-big-calendar docs](https://jquense.github.io/react-big-calendar/)
- [date-fns docs](https://date-fns.org/)

## Testing

### Casos de Prueba
1. ✅ Renderizado del calendario
2. ✅ Navegación entre meses
3. ✅ Cambio de vistas
4. ✅ Clic en evento abre modal
5. ✅ Colores según tipo de evento
6. ⏳ Crear nuevo evento (pendiente)
7. ⏳ Editar evento existente (pendiente)
8. ⏳ Eliminar evento (pendiente)

## Notas Técnicas

### Localización
- Usamos `date-fns` para manejo de fechas
- Locale español (`es`) importado desde `date-fns/locale/es`
- Formato de fechas: `d 'de' MMMM 'de' yyyy`

### Performance
- Eventos memoizados con `useMemo`
- Callbacks optimizados con `useCallback`
- Estilos calculados una sola vez por tipo

### Accesibilidad
- Navegación por teclado (nativa de react-big-calendar)
- Labels ARIA apropiados
- Contraste de colores cumple WCAG AA

## Ejemplos de Eventos Mock

Actualmente hay 7 eventos de ejemplo que cubren:
- Reunión de padres
- Fecha límite de inscripciones
- Inicio del campamento
- Talleres educativos
- Excursiones
- Fogón de cierre

## Contacto
Para dudas sobre este módulo, contactar al equipo de desarrollo del CAS.

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
**Estado**: ✅ Funcional - Pendiente integración Firebase
