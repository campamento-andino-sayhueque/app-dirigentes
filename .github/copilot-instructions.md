# Instrucciones para GitHub Copilot - CAS (Campamento Andino Sayhueque)

Eres un asistente de código especializado en el desarrollo del sistema de gestión del Campamento Andino Sayhueque. Sigue estas instrucciones específicas para este proyecto.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico:
- **Frontend**: Next.js 15 con TypeScript y Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting, Functions)
- **Deployment**: Firebase Hosting via GitHub Actions
- **Development**: Firebase Emulators Suite

### Estructura del Proyecto:
```
cas/
├── src/
│   ├── app/                 # App Router de Next.js
│   ├── components/          # Componentes React reutilizables
│   ├── contexts/           # Contextos de React (Auth, etc.)
│   ├── lib/                # Utilidades y configuraciones
│   └── hooks/              # Custom hooks
├── public/                 # Archivos estáticos (build output)
├── firebase.json           # Configuración de Firebase
├── firestore.rules         # Reglas de seguridad de Firestore
└── .env.local             # Variables de entorno (no commitear)
```

## 🔥 Reglas Específicas de Firebase

### Para Desarrollo Local:
```typescript
// SIEMPRE usar emuladores en desarrollo
// Verificar que el código funcione con:
// firebase emulators:start

// Configuración típica para emuladores:
if (process.env.NODE_ENV === 'development') {
  // Conectar a emuladores locales
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Para Autenticación:
```typescript
// Usar solo autenticación con Google
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Patrón estándar para login:
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error en autenticación:', error);
  }
};
```

### Para Firestore:
```typescript
// Usar TypeScript interfaces para datos
interface CampamentData {
  id: string;
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  participantes: string[];
}

// Siempre manejar errores
try {
  const docRef = await addDoc(collection(db, 'campamentos'), data);
} catch (error) {
  console.error('Error guardando en Firestore:', error);
}
```

## 🎨 Sistema de Colores del Campamento

### Paleta Oficial del CAS:
- **Colores principales**: Naranja (#FF6B35), Rojo (#DC2626), Negro (#1F2937)
- **Colores complementarios**: Verdes naturales, neutros para UI

### Uso Obligatorio del Sistema de Colores:
```typescript
// SIEMPRE importar desde el sistema de colores
import { casColors, casTheme, casTailwind } from '@/lib/colors';

// Usar colores directos
backgroundColor: casColors.primary.orange
backgroundColor: casColors.primary.red
backgroundColor: casColors.primary.black

// Usar clases de Tailwind predefinidas
className={casTailwind.btn.primary}     // Botón naranja principal
className={casTailwind.btn.secondary}   // Botón verde secundario
className={casTailwind.btn.danger}      // Botón rojo peligro
className={casTailwind.card.featured}   // Card con borde naranja

// Usar temas para componentes complejos
style={{
  backgroundColor: casTheme.alert.success.bg,
  borderColor: casTheme.alert.success.border,
  color: casTheme.alert.success.text
}}
```

### Patrones de Color Específicos:
```typescript
// Para headers y navegación
const headerStyle = {
  backgroundColor: casColors.primary.black,
  color: casColors.ui.text.inverse,
  accentColor: casColors.primary.orange
};

// Para botones principales (siempre naranja)
className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"

// Para estados de éxito (verde natural)
className="bg-green-50 border-green-200 text-green-800"

// Para estados de error (rojo del campamento)
className="bg-red-50 border-red-200 text-red-800"
```

### Componentes:
```typescript
// Siempre usar TypeScript con props tipadas
interface ComponentProps {
  title: string;
  onAction: () => void;
  loading?: boolean;
}

export default function Component({ title, onAction, loading = false }: ComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
      {/* Resto del componente */}
    </div>
  );
}
```

## 🔒 Seguridad y Mejores Prácticas

### Variables de Entorno:
```typescript
// Solo usar NEXT_PUBLIC_ para variables del cliente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // etc...
};

// Para variables del servidor (API routes):
const serverConfig = {
  adminKey: process.env.FIREBASE_ADMIN_KEY, // Sin NEXT_PUBLIC_
};
```

### Validación de Datos:
```typescript
// Siempre validar datos antes de enviar a Firebase
const validateCampamentData = (data: any): data is CampamentData => {
  return (
    typeof data.nombre === 'string' &&
    data.fechaInicio instanceof Date &&
    data.fechaFin instanceof Date &&
    Array.isArray(data.participantes)
  );
};
```

## 🌿 Flujo de Desarrollo

### Para nuevos componentes:
1. Crear en `src/components/`
2. Usar TypeScript interfaces
3. Implementar manejo de errores
4. Probar en emuladores locales
5. Agregar estilos con Tailwind

### Para nuevas funcionalidades:
1. Crear rama `feature/nombre-funcionalidad`
2. Desarrollar con emuladores (`firebase emulators:start`)
3. Probar en Firebase Console local (http://localhost:4000)
4. Build exitoso (`npm run build`)
5. Sin errores de linting (`npm run lint`)
6. Crear PR con template completo

## 🚫 Prohibiciones Estrictas

### NUNCA generes código que:
- Use `firebase deploy` en scripts
- Haga push directo a main
- Use credenciales hardcodeadas
- Ignore el manejo de errores
- No use TypeScript
- No funcione con emuladores

### NUNCA incluyas en commits:
- Archivos `.env.local`
- Credenciales reales
- API keys en código
- Archivos de configuración personales

## ✅ Siempre hacer:

### En cada componente:
```typescript
'use client'; // Si usa hooks o estado

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ComponentName() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>;
  }
  
  // Resto del componente
}
```

### En cada función Firebase:
```typescript
const handleFirebaseAction = async () => {
  try {
    setLoading(true);
    // Acción de Firebase
    const result = await someFirebaseFunction();
    return result;
  } catch (error) {
    console.error('Error en Firebase:', error);
    // Mostrar error al usuario
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Contexto del Negocio

### El Campamento Andino Sayhueque:
- Es un campamento de verano para jóvenes
- Se enfoca en actividades de montaña y naturaleza
- Necesita gestión de inscripciones, actividades y participantes
- Los usuarios principales son administradores y padres/participantes

### Funcionalidades Clave:
- Sistema de autenticación (solo Google)
- Gestión de inscripciones
- Calendario de actividades
- Comunicación con padres
- Gestión de documentos
- Sistema de pagos (futuro)

## 📋 Comandos de Referencia

### Desarrollo:
```bash
# Iniciar emuladores (OBLIGATORIO)
firebase emulators:start

# Desarrollo Next.js
npm run dev

# Build para producción
npm run build

# Linting
npm run lint
```

### Testing:
- Firebase Console: http://localhost:4000
- App local: http://localhost:3000
- Auth emulator: http://localhost:9099
- Firestore emulator: http://localhost:8080

---

**RECUERDA**: Siempre priorizar la funcionalidad con emuladores locales, código limpio en TypeScript, y seguir el flujo de trabajo establecido en `.github/WORKFLOW.md`.
