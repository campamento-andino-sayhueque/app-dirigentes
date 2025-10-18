# 🎯 Resumen: Conectar Frontend con Backend

## ✅ Archivos Creados

### Backend (Ya configurado en Railway):
- ✅ `WebConfig.java` - CORS configurado
- ✅ `SecurityConfig.java` - Seguridad básica
- ✅ `HealthController.java` - Endpoints de salud
- ✅ URL pública: `https://backend-monolito-production.up.railway.app`

### Frontend (Nuevos archivos):
- ✅ `api.ts` - Cliente API con autenticación
- ✅ `BackendHealthCheck.tsx` - Componente de verificación
- ✅ `.env.local` - Variables de entorno (COMPLETAR)
- ✅ `.env.production` - Variables para producción
- ✅ `page.tsx` - Actualizado con componente de salud

## 🚀 Pasos para Completar

### 1️⃣ Configurar CORS en Railway (MUY IMPORTANTE)

Ve a Railway → Tu proyecto → Variables de entorno → Agrega:

```
ALLOWED_ORIGINS=https://cas-web-465521.web.app,https://cas-web-465521.firebaseapp.com,http://localhost:3000
```

**Después de agregar, REINICIA el servicio en Railway.**

### 2️⃣ Completar `.env.local` en el frontend

El archivo ya está creado en `frontend/.env.local`, solo necesitas:

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Seleccionar tu proyecto
3. ⚙️ Configuración → General → Tus apps
4. Copiar los valores del SDK

Reemplaza en `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

(Los demás valores ya están configurados)

### 3️⃣ Probar localmente

```powershell
cd frontend
npm run dev
```

Abre http://localhost:3000

Deberías ver el componente "Estado del Backend" mostrando ✅ Conectado

### 4️⃣ Verificar manualmente el backend

Abre en tu navegador:
```
https://backend-monolito-production.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "UP",
  "message": "Backend CAS funcionando correctamente",
  "service": "backend-monolito"
}
```

## 📋 Checklist Final

- [ ] Variable `ALLOWED_ORIGINS` configurada en Railway
- [ ] Servicio reiniciado en Railway
- [ ] `.env.local` completado con credenciales de Firebase
- [ ] Backend responde en `/api/health`
- [ ] `npm run dev` funciona sin errores
- [ ] Componente BackendHealthCheck muestra "✅ Conectado"

## 🐛 Si algo no funciona

### Error CORS
- Verifica que `ALLOWED_ORIGINS` esté configurada en Railway
- Reinicia el servicio en Railway
- Limpia cache del navegador (Ctrl+Shift+R)

### Backend no responde
- Verifica que el servicio esté corriendo en Railway Dashboard
- Revisa los logs en Railway
- Prueba la URL directamente en el navegador

### Variables no se cargan
```powershell
# Detén el servidor (Ctrl+C)
# Borra carpeta .next
Remove-Item -Recurse -Force .next
# Reinicia
npm run dev
```

## 📚 Documentación Completa

- `CONECTAR_BACKEND.md` - Guía detallada paso a paso
- `INTEGRACION.md` - Documentación completa de integración
- `RAILWAY_SETUP.md` - Configuración de Railway (backend)

## 💡 Usar el API en tus componentes

```typescript
import { api } from '@/lib/api';

const response = await api.get('/api/tu-endpoint');
if (!response.error) {
  console.log(response.data);
}
```

---

**Una vez que veas ✅ Conectado en el componente, la integración está lista!** 🎉
