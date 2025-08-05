# 🎨 Sistema de Colores - Campamento Andino Sayhueque

## Paleta Oficial

### 🏕️ Colores Principales del Campamento
- **Naranja**: `#FF6B35` - Color principal del campamento, representa aventura y energía
- **Rojo**: `#DC2626` - Color de acción y peligro, complementa al naranja
- **Negro**: `#1F2937` - Color para texto principal y elementos de alta jerarquía

### 🌿 Colores Complementarios Naturales
- **Verde**: Escala de verdes para representar naturaleza y montaña
- **Marrón Montaña**: `#8B7355` - Representa el entorno montañoso
- **Verde Bosque**: `#2D5016` - Representa la naturaleza profunda

## 🚀 Cómo Usar el Sistema

### Instalación
Los colores están definidos en `src/lib/colors.ts` y se importan así:

```typescript
import { casColors, casTheme, casTailwind } from '@/lib/colors';
```

### 1. Colores Directos
```typescript
// Usar colores específicos
<div style={{ backgroundColor: casColors.primary.orange }}>
  Fondo naranja del campamento
</div>

<h1 style={{ color: casColors.primary.black }}>
  Título principal
</h1>
```

### 2. Clases de Tailwind Predefinidas
```typescript
// Botones estandarizados
<button className={casTailwind.btn.primary}>
  Botón Principal (Naranja)
</button>

<button className={casTailwind.btn.secondary}>
  Botón Secundario (Verde)
</button>

<button className={casTailwind.btn.danger}>
  Botón de Peligro (Rojo)
</button>

// Cards estandarizados
<div className={casTailwind.card.featured}>
  Card destacado con borde naranja
</div>
```

### 3. Temas para Componentes Complejos
```typescript
// Alertas con colores apropiados
<div style={{
  backgroundColor: casTheme.alert.success.bg,
  borderColor: casTheme.alert.success.border,
  color: casTheme.alert.success.text
}}>
  Mensaje de éxito
</div>

// Formularios con colores consistentes
<input style={{
  backgroundColor: casTheme.form.input.bg,
  borderColor: casTheme.form.input.border,
  color: casTheme.form.input.text
}} />
```

## 🎯 Guía de Uso por Contexto

### Headers y Navegación
```typescript
// Siempre usar negro como base con naranja como acento
<header style={{
  backgroundColor: casColors.primary.black,
  color: casColors.ui.text.inverse
}}>
  <nav>
    <a style={{ color: casColors.primary.orange }}>
      Link activo
    </a>
  </nav>
</header>
```

### Botones de Acción Principal
```typescript
// SIEMPRE usar naranja para acciones principales
<button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
  Inscribirse al Campamento
</button>
```

### Estados y Retroalimentación
```typescript
// Éxito: Verde natural
<div className="bg-green-50 border-green-200 text-green-800">
  ✅ Inscripción exitosa
</div>

// Error: Rojo del campamento
<div className="bg-red-50 border-red-200 text-red-800">
  ❌ Error en el formulario
</div>

// Advertencia: Amarillo natural
<div className="bg-yellow-50 border-yellow-200 text-yellow-800">
  ⚠️ Revisa los datos
</div>
```

### Gradientes Temáticos
```typescript
// Fondo principal de la aplicación
<div style={{ background: casColors.gradients.adventure }}>
  // Gradiente que incluye naranja, verde y rojo
</div>

// Fondo de secciones específicas
<div style={{ background: casColors.gradients.nature }}>
  // Para secciones relacionadas con actividades
</div>
```

## 🔧 Utilidades Avanzadas

### Función getCasColor
```typescript
import { getCasColor } from '@/lib/colors';

// Obtener color dinámicamente
const primaryColor = getCasColor('primary.orange'); // '#FF6B35'
const successColor = getCasColor('nature.green.500'); // '#22C55E'
```

### Función getCasTheme
```typescript
import { getCasTheme } from '@/lib/colors';

// Obtener tema completo para componente
const buttonTheme = getCasTheme('button.primary');
// Retorna: { bg: '#FF6B35', hover: '#E55A2B', text: '#FFFFFF', border: '#FF6B35' }
```

## 📱 Responsive y Accesibilidad

### Contrastes Garantizados
Todos los colores han sido seleccionados para cumplir con WCAG 2.1:
- Texto sobre naranja: siempre blanco
- Texto sobre rojo: siempre blanco  
- Texto sobre negro: siempre blanco
- Texto sobre fondos claros: siempre gris oscuro

### Ejemplo de Implementación Accesible
```typescript
<button 
  className={casTailwind.btn.primary}
  aria-label="Inscribirse al campamento de verano"
>
  Inscribirse
</button>
```

## 🚫 Qué NO Hacer

### ❌ No usar colores arbitrarios
```typescript
// MAL
<button className="bg-blue-500">Botón</button>

// BIEN
<button className={casTailwind.btn.primary}>Botón</button>
```

### ❌ No crear variaciones sin pasar por el sistema
```typescript
// MAL
<div className="bg-orange-400">Content</div>

// BIEN
<div style={{ backgroundColor: casColors.primary.orange }}>Content</div>
```

### ❌ No ignorar el contexto del campamento
```typescript
// MAL - colores corporativos genéricos
<header className="bg-blue-900">

// BIEN - colores del campamento
<header style={{ backgroundColor: casColors.primary.black }}>
```

## 🔄 Actualizar el Sistema

Para agregar nuevos colores al sistema:

1. Edita `src/lib/colors.ts`
2. Agrega el color en la sección apropiada
3. Crea las clases de Tailwind correspondientes
4. Actualiza esta documentación
5. Crea PR con los cambios

## 🎨 Ver el Sistema en Acción

Visita `/colors` en tu aplicación local para ver todos los colores y componentes en acción:
```
http://localhost:3000/colors
```

---

**Recuerda**: El sistema de colores refleja la identidad del Campamento Andino Sayhueque. Mantén la consistencia usando siempre estos colores en lugar de inventar nuevos.
