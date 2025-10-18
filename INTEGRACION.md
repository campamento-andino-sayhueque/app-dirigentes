# 🔗 Guía de Integración Backend-Frontend

Esta guía explica cómo integrar el **backend (Spring Boot en Railway)** con el **frontend (Next.js en Firebase Hosting)** del sistema CAS.

## 📋 Arquitectura

```
┌─────────────────────────┐
│  Firebase Hosting       │
│  (Frontend Next.js)     │
│  https://cas.web.app    │
└───────────┬─────────────┘
            │
            │ API Calls (HTTPS)
            │
            ▼
┌─────────────────────────┐
│  Railway                │
│  (Backend Spring Boot)  │
│  https://backend.up... │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  PostgreSQL Database    │
│  (Railway)              │
└─────────────────────────┘
```

## 🚀 Configuración del Backend (Railway)

### 1. Variables de Entorno en Railway

Ve a tu proyecto en Railway y agrega estas variables:

```bash
# PostgreSQL (Railway las provee automáticamente)
PGHOST=<automático>
PGPORT=<automático>
PGDATABASE=<automático>
PGUSER=<automático>
PGPASSWORD=<automático>

# CORS - Orígenes permitidos (IMPORTANTE)
ALLOWED_ORIGINS=https://tu-proyecto.web.app,https://tu-proyecto.firebaseapp.com
```

**⚠️ IMPORTANTE:** Reemplaza `tu-proyecto` con el ID real de tu proyecto Firebase.

### 2. Obtener la URL del Backend en Railway

1. Ve a tu proyecto en Railway
2. Copia la URL pública (ej: `https://backend-production-abc123.up.railway.app`)
3. Guárdala para el paso del frontend

### 3. Archivos ya creados en el backend:

- ✅ `WebConfig.java` - Configuración CORS
- ✅ `SecurityConfig.java` - Seguridad y autenticación
- ✅ `HealthController.java` - Endpoint de salud
- ✅ `application.properties` - Configuración actualizada

### 4. Desplegar en Railway

```bash
# Railway detecta automáticamente Spring Boot
# Solo haz commit y push a tu repositorio conectado
git add .
git commit -m "feat: configuración CORS y endpoints de salud"
git push origin master
```

## 🎨 Configuración del Frontend (Firebase Hosting)

### 1. Crear archivo `.env.local`

En `app-dirigentes/frontend/`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# Firebase (obtén de Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend URL (Railway - LA QUE COPIASTE EN EL PASO 2)
NEXT_PUBLIC_API_URL=https://backend-production-abc123.up.railway.app
```

### 2. Configurar Variables de Entorno en Firebase Hosting

Para producción, configura las variables en Firebase:

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login
firebase login

# Configurar variables de entorno para producción
# Edita firebase.json y agrega en hosting:
```

En `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          }
        ]
      }
    ]
  }
}
```

### 3. Archivos ya creados en el frontend:

- ✅ `api.ts` - Cliente API con autenticación
- ✅ `BackendHealthCheck.tsx` - Componente de verificación
- ✅ `.env.example` - Template de variables

## 🧪 Probar la Integración

### 1. Desarrollo Local

Terminal 1 - Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Terminal 2 - Frontend:
```bash
cd app-dirigentes/frontend
npm run dev
```

### 2. Verificar conexión

Agrega el componente de salud a una página:

```tsx
// En app-dirigentes/frontend/src/app/page.tsx
import BackendHealthCheck from '@/components/BackendHealthCheck';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">CAS - Sistema de Gestión</h1>
      
      {/* Componente de verificación */}
      <BackendHealthCheck />
    </div>
  );
}
```

### 3. Usar el cliente API

```tsx
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function MiComponente() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/tu-endpoint');
        
        if (response.error) {
          console.error('Error:', response.error);
        } else {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return <div>{/* Tu UI */}</div>;
}
```

## 🔐 Autenticación

El flujo de autenticación es:

1. Usuario se autentica con Google en Firebase (frontend)
2. Frontend obtiene token JWT de Firebase
3. Frontend envía token en header `Authorization: Bearer <token>` al backend
4. Backend valida el token (próxima implementación)

**TODO:** Implementar validación de tokens Firebase en el backend.

## 📝 Endpoints Disponibles

### Backend (Spring Boot)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/health` | GET | Estado del backend | No |
| `/api/health/ping` | GET | Ping simple | No |
| `/actuator/health` | GET | Health check Spring | No |

## 🐛 Troubleshooting

### Error de CORS

**Síntoma:** Error en consola: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solución:**
1. Verifica que `ALLOWED_ORIGINS` en Railway incluya tu dominio de Firebase
2. Reinicia el backend en Railway
3. Limpia cache del navegador

### Backend no responde

**Síntoma:** Error de red o timeout

**Solución:**
1. Verifica que el backend esté corriendo en Railway
2. Verifica la URL en `NEXT_PUBLIC_API_URL`
3. Prueba la URL directamente en el navegador: `https://tu-backend.up.railway.app/api/health`

### Variables de entorno no actualizan

**Síntoma:** Cambios no se reflejan

**Solución:**
```bash
# Frontend - reinicia el servidor de desarrollo
npm run dev

# Backend - rebuild en Railway o localmente
./mvnw clean spring-boot:run
```

## 📚 Próximos Pasos

1. ✅ Configuración CORS
2. ✅ Cliente API básico
3. ✅ Health check
4. 🔲 Validación de tokens Firebase en backend
5. 🔲 Endpoints de API REST para entidades
6. 🔲 Manejo de errores centralizado
7. 🔲 Logging y monitoreo

## 🤝 Soporte

Si tienes problemas:

1. Revisa los logs en Railway Dashboard
2. Revisa la consola del navegador (F12)
3. Verifica las variables de entorno
4. Usa el componente `BackendHealthCheck` para diagnosticar

---

**¡Integración completada!** 🎉
