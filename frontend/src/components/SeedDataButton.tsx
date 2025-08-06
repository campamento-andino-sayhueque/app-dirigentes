'use client';

import { useState } from 'react';
import { seedDatabase } from '@/lib/seedDatabase';

export default function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setIsSeeding(true);
    setMessage('');
    
    try {
      await seedDatabase();
      setMessage('✅ Datos de prueba creados exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error creando datos de prueba');
    } finally {
      setIsSeeding(false);
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        🧪 Herramientas de Desarrollo
      </h3>
      <p className="text-sm text-blue-600 mb-4">
        Poblar la base de datos con datos de prueba para testing
      </p>
      
      <button
        onClick={handleSeedData}
        disabled={isSeeding}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSeeding ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creando datos...
          </span>
        ) : (
          '🌱 Crear Datos de Prueba'
        )}
      </button>
      
      {message && (
        <div className="mt-3 p-2 text-sm bg-white rounded border">
          {message}
        </div>
      )}
      
      <div className="mt-4 text-xs text-blue-500">
        <p className="font-medium mb-1">Datos que se crearán:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>3 usuarios con diferentes roles</li>
          <li>3 posts de ejemplo</li>
          <li>3 comentarios</li>
          <li>Información pública del campamento</li>
        </ul>
      </div>
    </div>
  );
}
