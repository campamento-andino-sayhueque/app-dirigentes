// Paleta de colores oficial del Campamento Andino Sayhueque
// Colores principales: Naranja, Rojo, Negro
// Colores complementarios: Verdes naturales y neutros

export const casColors = {
  // 🏕️ COLORES PRINCIPALES DEL CAMPAMENTO
  primary: {
    orange: '#FF6B35',    // Naranja principal
    red: '#DC2626',       // Rojo principal  
    black: '#1F2937',     // Negro/gris muy oscuro
  },

  // 🌿 COLORES COMPLEMENTARIOS NATURALES
  nature: {
    green: {
      50: '#F0FDF4',
      100: '#DCFCE7', 
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',   // Verde principal
      600: '#16A34A',   // Verde oscuro
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    forest: '#2D5016',    // Verde bosque
    mountain: '#8B7355',  // Marrón montaña
  },

  // 🎨 PALETA EXTENDIDA PARA UI
  ui: {
    // Estados y acciones
    success: '#22C55E',   // Verde éxito
    warning: '#F59E0B',   // Amarillo advertencia
    error: '#DC2626',     // Rojo error (mismo que primary.red)
    info: '#3B82F6',      // Azul información
    
    // Fondos y superficies
    background: '#FAFAFA', // Fondo principal
    surface: '#FFFFFF',    // Superficies/cards
    overlay: 'rgba(31, 41, 55, 0.8)', // Overlay oscuro
    
    // Bordes y divisores
    border: '#E5E7EB',     // Bordes suaves
    divider: '#D1D5DB',    // Divisores
    
    // Texto
    text: {
      primary: '#1F2937',   // Texto principal (negro del campamento)
      secondary: '#6B7280', // Texto secundario
      muted: '#9CA3AF',     // Texto deshabilitado
      inverse: '#FFFFFF',   // Texto sobre fondos oscuros
    }
  },

  // 🌅 GRADIENTES TEMÁTICOS
  gradients: {
    sunset: 'linear-gradient(135deg, #FF6B35 0%, #DC2626 100%)',         // Naranja a rojo
    nature: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',         // Verde claro a oscuro
    mountain: 'linear-gradient(135deg, #8B7355 0%, #2D5016 100%)',       // Marrón a verde bosque
    adventure: 'linear-gradient(135deg, #FF6B35 0%, #22C55E 50%, #DC2626 100%)', // Aventura completa
  }
} as const;

// 🎯 COMBINACIONES PREDEFINIDAS PARA COMPONENTES
export const casTheme = {
  // Botones principales
  button: {
    primary: {
      bg: casColors.primary.orange,
      hover: '#E55A2B',
      text: casColors.ui.text.inverse,
      border: casColors.primary.orange,
    },
    secondary: {
      bg: casColors.nature.green[500], 
      hover: casColors.nature.green[600],
      text: casColors.ui.text.inverse,
      border: casColors.nature.green[500],
    },
    danger: {
      bg: casColors.primary.red,
      hover: '#B91C1C',
      text: casColors.ui.text.inverse,
      border: casColors.primary.red,
    },
    outline: {
      bg: 'transparent',
      hover: casColors.nature.green[50],
      text: casColors.nature.green[600],
      border: casColors.nature.green[500],
    }
  },

  // Cards y superficies
  card: {
    default: {
      bg: casColors.ui.surface,
      border: casColors.ui.border,
      shadow: '0 1px 3px 0 rgba(31, 41, 55, 0.1)',
    },
    featured: {
      bg: casColors.ui.surface,
      border: casColors.primary.orange,
      shadow: '0 4px 6px -1px rgba(255, 107, 53, 0.1)',
    },
    nature: {
      bg: casColors.nature.green[50],
      border: casColors.nature.green[200],
      shadow: '0 1px 3px 0 rgba(34, 197, 94, 0.1)',
    }
  },

  // Estados y notificaciones
  alert: {
    success: {
      bg: casColors.nature.green[50],
      border: casColors.nature.green[200],
      text: casColors.nature.green[800],
      icon: casColors.nature.green[500],
    },
    warning: {
      bg: '#FEF3C7',
      border: '#FCD34D',
      text: '#92400E',
      icon: casColors.ui.warning,
    },
    error: {
      bg: '#FEE2E2',
      border: '#F87171', 
      text: '#991B1B',
      icon: casColors.primary.red,
    },
    info: {
      bg: '#DBEAFE',
      border: '#93C5FD',
      text: '#1E40AF',
      icon: casColors.ui.info,
    }
  },

  // Navegación y headers
  header: {
    bg: casColors.primary.black,
    text: casColors.ui.text.inverse,
    accent: casColors.primary.orange,
  },

  // Formularios
  form: {
    input: {
      bg: casColors.ui.surface,
      border: casColors.ui.border,
      borderFocus: casColors.primary.orange,
      text: casColors.ui.text.primary,
      placeholder: casColors.ui.text.muted,
    },
    label: {
      text: casColors.ui.text.primary,
      required: casColors.primary.red,
    }
  }
} as const;

// 🎨 CLASES DE TAILWIND PREDEFINIDAS
export const casTailwind = {
  // Botones
  btn: {
    primary: 'bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-[#FF6B35] px-4 py-2 rounded-md font-medium transition-colors',
    secondary: 'bg-green-500 hover:bg-green-600 text-white border-green-500 px-4 py-2 rounded-md font-medium transition-colors',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 px-4 py-2 rounded-md font-medium transition-colors',
    outline: 'bg-transparent hover:bg-green-50 text-green-600 border-green-500 border px-4 py-2 rounded-md font-medium transition-colors',
  },

  // Cards
  card: {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    featured: 'bg-white border border-[#FF6B35] rounded-lg shadow-[0_4px_6px_-1px_rgba(255,107,53,0.1)]',
    nature: 'bg-green-50 border border-green-200 rounded-lg shadow-[0_1px_3px_0_rgba(34,197,94,0.1)]',
  },

  // Texto
  text: {
    primary: 'text-gray-800',
    secondary: 'text-gray-600', 
    muted: 'text-gray-400',
    inverse: 'text-white',
    brand: 'text-[#FF6B35]',
    success: 'text-green-800',
    error: 'text-red-800',
  },

  // Fondos
  bg: {
    primary: 'bg-[#FF6B35]',
    secondary: 'bg-green-500',
    danger: 'bg-red-600',
    surface: 'bg-white',
    background: 'bg-gray-50',
    nature: 'bg-gradient-to-br from-green-50 to-blue-50',
    adventure: 'bg-gradient-to-br from-[#FF6B35] via-green-500 to-red-600',
  }
} as const;

// 🔧 UTILIDADES PARA USAR EN COMPONENTES
export const getCasColor = (colorPath: string): string | undefined => {
  const keys = colorPath.split('.');
  let result: unknown = casColors;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof result === 'string' ? result : undefined;
};

export const getCasTheme = (themePath: string): unknown => {
  const keys = themePath.split('.');
  let result: unknown = casTheme;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return result;
};

// 🎨 EXPORTAR TIPOS PARA TYPESCRIPT
export type CasColors = typeof casColors;
export type CasTheme = typeof casTheme;
export type CasTailwind = typeof casTailwind;
