'use client';

import { casColors, casTheme, casTailwind } from '@/lib/colors';

/**
 * Componente de demostración del sistema de colores del CAS
 * Muestra cómo usar los colores estandarizados del campamento
 */
export default function ColorSystemDemo() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Sistema de Colores - Campamento Andino Sayhueque
        </h1>
        <p className="text-gray-600">
          Paleta oficial: Naranja, Rojo, Negro + complementarios naturales
        </p>
      </div>

      {/* Colores Principales */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏕️ Colores Principales</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: casColors.primary.orange }}
            ></div>
            <p className="font-medium">Naranja</p>
            <p className="text-sm text-gray-500">{casColors.primary.orange}</p>
          </div>
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: casColors.primary.red }}
            ></div>
            <p className="font-medium">Rojo</p>
            <p className="text-sm text-gray-500">{casColors.primary.red}</p>
          </div>
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: casColors.primary.black }}
            ></div>
            <p className="font-medium text-white">Negro</p>
            <p className="text-sm text-gray-500">{casColors.primary.black}</p>
          </div>
        </div>
      </section>

      {/* Botones con Estilo */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Botones Estandarizados</h2>
        <div className="flex flex-wrap gap-4">
          <button className={casTailwind.btn.primary}>
            Botón Principal
          </button>
          <button className={casTailwind.btn.secondary}>
            Botón Secundario
          </button>
          <button className={casTailwind.btn.danger}>
            Botón Peligro
          </button>
          <button className={casTailwind.btn.outline}>
            Botón Outline
          </button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Cards y Superficies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${casTailwind.card.default} p-6`}>
            <h3 className="font-bold text-gray-800 mb-2">Card Default</h3>
            <p className="text-gray-600">Card estándar para contenido general</p>
          </div>
          <div className={`${casTailwind.card.featured} p-6`}>
            <h3 className="font-bold text-[#FF6B35] mb-2">Card Destacado</h3>
            <p className="text-gray-600">Card especial con borde naranja</p>
          </div>
          <div className={`${casTailwind.card.nature} p-6`}>
            <h3 className="font-bold text-green-800 mb-2">Card Naturaleza</h3>
            <p className="text-green-700">Card con tema natural/aventura</p>
          </div>
        </div>
      </section>

      {/* Gradientes */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌅 Gradientes Temáticos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: casColors.gradients.sunset }}
          >
            Sunset
          </div>
          <div 
            className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: casColors.gradients.nature }}
          >
            Nature
          </div>
          <div 
            className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: casColors.gradients.mountain }}
          >
            Mountain
          </div>
          <div 
            className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ background: casColors.gradients.adventure }}
          >
            Adventure
          </div>
        </div>
      </section>

      {/* Alertas y Estados */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Alertas y Estados</h2>
        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: casTheme.alert.success.bg,
              borderColor: casTheme.alert.success.border,
              color: casTheme.alert.success.text
            }}
          >
            ✅ Éxito: Operación completada correctamente
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: casTheme.alert.warning.bg,
              borderColor: casTheme.alert.warning.border,
              color: casTheme.alert.warning.text
            }}
          >
            ⚠️ Advertencia: Revisa la información antes de continuar
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: casTheme.alert.error.bg,
              borderColor: casTheme.alert.error.border,
              color: casTheme.alert.error.text
            }}
          >
            ❌ Error: Ha ocurrido un problema
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: casTheme.alert.info.bg,
              borderColor: casTheme.alert.info.border,
              color: casTheme.alert.info.text
            }}
          >
            ℹ️ Información: Datos adicionales relevantes
          </div>
        </div>
      </section>

      {/* Código de Ejemplo */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💻 Código de Ejemplo</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`// Importar colores del campamento
import { casColors, casTheme, casTailwind } from '@/lib/colors';

// Usar color directo
<div style={{ backgroundColor: casColors.primary.orange }}>
  Fondo naranja del campamento
</div>

// Usar clases de Tailwind predefinidas
<button className={casTailwind.btn.primary}>
  Botón Principal
</button>

// Usar tema para componentes
<div style={{
  backgroundColor: casTheme.card.featured.bg,
  borderColor: casTheme.card.featured.border
}}>
  Card destacado
</div>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
