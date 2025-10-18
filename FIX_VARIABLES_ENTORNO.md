# 🔧 Fix: Variables de Entorno en Firebase Hosting

## 🐛 Problema Identificado

Cuando se desplegó a Firebase Hosting, la aplicación intentaba conectarse a `localhost:8080` en lugar de la URL de Railway:

```
❌ localhost:8080/api/health
✅ https://backend-monolito-production.up.railway.app/api/health
```

**Error en consola:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Error en petición API: TypeError: Failed to fetch
```

## 🎯 Causa Raíz

La variable de entorno `NEXT_PUBLIC_API_URL` **NO estaba siendo incluida** en el proceso de build de GitHub Actions. Los workflows solo incluían las variables de Firebase, pero no la URL del backend.

## ✅ Solución Aplicada

### 1. **Actualizado `next.config.ts`**
Agregado hardcoded fallback para asegurar que siempre tenga un valor:

```typescript
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-monolito-production.up.railway.app',
}
```

### 2. **Creado `.env` en frontend**
Archivo con valor por defecto para todos los ambientes (se puede commitear):

```env
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app
```

### 3. **Actualizado workflows de GitHub Actions**

#### ✅ Antes (❌ incorrecto):
```yaml
cat > .env.local << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=${{ vars.FIREBASE_API_KEY }}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ vars.FIREBASE_AUTH_DOMAIN }}
# ... solo Firebase vars
NEXT_PUBLIC_ENVIRONMENT=production
EOL
```

#### ✅ Después (✅ correcto):
```yaml
cat > .env.local << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=${{ vars.FIREBASE_API_KEY }}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ vars.FIREBASE_AUTH_DOMAIN }}
# ... Firebase vars
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app  # ← AGREGADO
NEXT_PUBLIC_ENVIRONMENT=production
EOL
```

Archivos actualizados:
- ✅ `.github/workflows/firebase-hosting-merge.yml` (3 ambientes)
- ✅ `.github/workflows/firebase-hosting-pull-request.yml` (3 ambientes)

### 4. **Agregado script de build alternativo**
En `package.json`:

```json
"build:prod": "cross-env NODE_ENV=production NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app next build"
```

## 🚀 Cómo Re-Desplegar

### Opción 1: Push a Main (Automático via GitHub Actions)

```bash
git add .
git commit -m "fix: agregar NEXT_PUBLIC_API_URL a workflows de deploy"
git push origin main
```

GitHub Actions automáticamente:
1. Creará `.env.local` con todas las variables (incluyendo API_URL)
2. Hará build con las variables correctas
3. Desplegará a Firebase Hosting

### Opción 2: Deploy Manual Local

```bash
cd frontend

# Asegurarse de que .env.production existe
cat .env.production

# Build con variables de producción
npm run build

# Deploy a Firebase
firebase deploy --only hosting:casayhueque --project cas-web-465521
```

## 🧪 Verificar el Fix

### 1. Después del deploy, abre la consola del navegador en Firebase:

```
https://cas-web-465521.web.app
```

### 2. Verifica que NO veas estos errores:
```
❌ localhost:8080/api/health - Failed to load resource
❌ Error en petición API: TypeError: Failed to fetch
```

### 3. Deberías ver:
```
✅ Llamando a: https://backend-monolito-production.up.railway.app/api/health
✅ Respuesta recibida: {status: "UP", ...}
✅ Conectado al backend
```

### 4. El componente TestBackendSimple mostrará:
```
✅ ¡Conexión Exitosa!
Estado: UP
Servicio: backend-monolito
Mensaje: Backend CAS funcionando correctamente
```

## 📋 Checklist de Verificación

Antes de hacer commit y push:

- [x] `.env` creado en frontend con NEXT_PUBLIC_API_URL
- [x] `.env.production` tiene NEXT_PUBLIC_API_URL
- [x] `next.config.ts` tiene fallback hardcoded
- [x] `firebase-hosting-merge.yml` actualizado (3 ambientes)
- [x] `firebase-hosting-pull-request.yml` actualizado (3 ambientes)
- [ ] Commit y push a main
- [ ] Verificar deploy en GitHub Actions
- [ ] Verificar en Firebase Hosting que funcione

## 🔍 Debugging

Si después del deploy sigue sin funcionar:

### 1. Verificar variables en el build
En GitHub Actions logs, busca:
```
Creating .env.local for Production
```

Y verifica que incluya:
```
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app
```

### 2. Verificar en el navegador
Abre DevTools → Console → Ejecuta:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Debería mostrar:
```
https://backend-monolito-production.up.railway.app
```

### 3. Verificar el build
Descarga el build artifact de GitHub Actions y busca en los archivos JS:
```javascript
"NEXT_PUBLIC_API_URL":"https://backend-monolito-production.up.railway.app"
```

## 📝 Notas Importantes

### Variables en Next.js con `output: 'export'`

Cuando usas `output: 'export'` (static export), las variables de entorno:

1. **Se reemplazan en tiempo de BUILD** (no runtime)
2. **Deben existir durante `npm run build`**
3. **Se incrustan en el código JavaScript**
4. **No se pueden cambiar después del build**

Por eso es crítico que `.env.local` se cree **ANTES** del build en los workflows.

### Alternativa: Variables en firebase.json

También podrías usar `rewrites` en `firebase.json`, pero esto no aplica para exports estáticos.

### Variables de GitHub

Si prefieres usar GitHub secrets/vars:

1. Ve a GitHub → Settings → Secrets and variables → Actions
2. Agrega `BACKEND_API_URL` como variable
3. Úsalo en workflows: `${{ vars.BACKEND_API_URL }}`

```yaml
NEXT_PUBLIC_API_URL=${{ vars.BACKEND_API_URL }}
```

## 🎉 Resultado Esperado

Después de aplicar el fix y re-desplegar:

- ✅ Frontend en Firebase se conecta a Railway
- ✅ Componente TestBackendSimple muestra "Conexión Exitosa"
- ✅ No más errores de "Failed to fetch"
- ✅ Backend responde correctamente desde producción

---

**Fecha del fix:** 18 de octubre de 2025  
**Problema:** Variables de entorno faltantes en deploy  
**Solución:** Agregar NEXT_PUBLIC_API_URL a workflows y configs
