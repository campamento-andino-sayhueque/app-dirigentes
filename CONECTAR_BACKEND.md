# 🔗 Conectar Frontend con Backend Railway

Tu backend ya está corriendo en: `https://backend-monolito-production.up.railway.app`

## ⚡ Pasos Rápidos

### 1. Configurar CORS en Railway

Ve a tu proyecto en Railway → Variables de entorno → Agrega:

```
ALLOWED_ORIGINS=https://cas-web-465521.web.app,https://cas-web-465521.firebaseapp.com,http://localhost:3000
```

> **Nota:** Verifica que `cas-web-465521` sea tu proyecto ID real de Firebase. Puedes verlo en Firebase Console.

### 2. Crear archivo `.env.local` en el frontend

```bash
cd frontend
```

Crea el archivo `.env.local` con este contenido:

```env
# Firebase Configuration (obtén de Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cas-web-465521.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cas-web-465521
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cas-web-465521.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# Backend URL - Railway
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app

# Environment
NODE_ENV=development
```

### 3. Obtener credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto "cas-web-465521"
3. Ve a ⚙️ Configuración del proyecto → General
4. Baja hasta "Tus apps" → Configuración del SDK
5. Copia los valores y pégalos en `.env.local`

### 4. Probar la conexión

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Ve a http://localhost:3000 y agrega el componente de verificación a tu página principal.

## 🧪 Verificar Backend

Abre en tu navegador o usa curl:

```bash
# Health check
https://backend-monolito-production.up.railway.app/api/health

# Ping
https://backend-monolito-production.up.railway.app/api/health/ping
```

Deberías ver una respuesta JSON como:
```json
{
  "status": "UP",
  "timestamp": "2025-10-15T...",
  "message": "Backend CAS funcionando correctamente",
  "service": "backend-monolito"
}
```

## 📝 Usar el API en tus componentes

```typescript
import { api } from '@/lib/api';

// Ejemplo de uso
const MiComponente = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/tu-endpoint');
      if (!response.error) {
        setData(response.data);
      }
    };
    fetchData();
  }, []);

  return <div>{/* Tu UI */}</div>;
};
```

## 🚀 Deploy a Producción

Cuando despliegues a Firebase Hosting, asegúrate de:

1. **Configurar variables de entorno en el build:**

Edita `frontend/package.json` para incluir las variables:

```json
{
  "scripts": {
    "build:prod": "NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app next build"
  }
}
```

2. **O crear archivo `.env.production`:**

```env
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app
```

## ✅ Checklist

- [ ] Variable `ALLOWED_ORIGINS` configurada en Railway
- [ ] Archivo `.env.local` creado en frontend
- [ ] Credenciales de Firebase copiadas
- [ ] Backend responde en `/api/health`
- [ ] Frontend puede conectarse al backend
- [ ] Componente `BackendHealthCheck` muestra ✅ Conectado

## 🐛 Problemas Comunes

### Error CORS
Si ves: `Access-Control-Allow-Origin header is present`

**Solución:**
1. Verifica `ALLOWED_ORIGINS` en Railway
2. Reinicia el servicio en Railway
3. Limpia cache del navegador (Ctrl+Shift+R)

### Backend no responde
**Solución:**
1. Verifica que el servicio esté corriendo en Railway
2. Revisa los logs en Railway Dashboard
3. Prueba la URL directamente en el navegador

### Variables de entorno no se actualizan
**Solución:**
```bash
# Detén el servidor (Ctrl+C)
# Borra .next
rm -rf .next
# Reinicia
npm run dev
```

---

**¡Listo para conectar!** 🎉
