# 🚀 Guía Rápida: Primera Prueba Frontend → Backend

## ✅ ¡Todo está listo!

### 🌐 URLs Importantes
- **Frontend Local:** http://localhost:3000
- **Backend Railway:** https://backend-monolito-production.up.railway.app
- **Health Check:** https://backend-monolito-production.up.railway.app/api/health

---

## 📋 Instrucciones para Probar

### 1️⃣ El servidor ya está corriendo ✅
Tu servidor de desarrollo está activo en `http://localhost:3000`

### 2️⃣ Abre el navegador
Ve a: **http://localhost:3000**

### 3️⃣ Verás dos componentes de prueba:

#### 🧪 Test Backend Simple (Arriba)
- **Botón naranja:** "🚀 Probar Conexión"
- Haz clic para probar manualmente
- Muestra la respuesta completa del backend

#### ✅ Backend Health Check (Abajo)
- Se ejecuta automáticamente al cargar
- Botón verde: "Verificar" para re-verificar
- Muestra el estado de conexión en tiempo real

---

## 🎯 ¿Qué esperar?

### ✅ Si todo funciona correctamente:
- Verás un mensaje: **"✅ Conectado al backend"**
- Estado: **"UP"**
- Servicio: **"backend-monolito"**
- Mensaje: **"Backend CAS funcionando correctamente"**
- Timestamp actualizado

### ❌ Si hay algún error:
- Verás un mensaje de error detallado
- Revisa que la URL esté correcta
- Verifica que Railway esté activo

---

## 🧪 Prueba Rápida desde PowerShell

```powershell
# Test rápido
Invoke-RestMethod -Uri "https://backend-monolito-production.up.railway.app/api/health"
```

**Respuesta esperada:**
```json
{
  "service": "backend-monolito",
  "message": "Backend CAS funcionando correctamente",
  "status": "UP",
  "timestamp": "2025-10-18T..."
}
```

---

## 📊 Estado Actual

- [x] Backend desplegado en Railway ✅
- [x] Frontend configurado ✅
- [x] Variables de entorno configuradas ✅
- [x] Servidor de desarrollo corriendo ✅
- [x] Componentes de prueba creados ✅
- [ ] **Ahora prueba en el navegador** 👈

---

## 🎨 Componentes Disponibles

### En la página principal (`page.tsx`):
1. **TestBackendSimple** - Prueba manual interactiva
2. **BackendHealthCheck** - Verificación automática
3. **LoginButton** - Autenticación con Google
4. **SeedDataButton** - Datos de prueba

---

## 📝 Próximos Pasos

1. ✅ Probar la conexión en http://localhost:3000
2. Crear más endpoints en el backend
3. Consumir esos endpoints desde el frontend
4. Desplegar a producción cuando esté listo

---

## 🆘 Ayuda

### Si el servidor no está corriendo:
```powershell
cd c:\Users\igman\OneDrive\Documentos\GITHUB\app-dirigentes\frontend
npm run dev
```

### Si hay errores de cache:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Ver documentación completa:
- `PRIMERA_CONEXION.md` - Documentación detallada
- `CONECTAR_BACKEND.md` - Guía de configuración

---

## 🎉 ¡A Probar!

**Abre tu navegador en:** http://localhost:3000

¡Tu frontend ya está conectado con el backend en Railway! 🚀
