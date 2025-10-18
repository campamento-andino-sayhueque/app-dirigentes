# 📝 Guía: Configurar Variables de Backend en GitHub

## 🎯 Variables a Configurar

Necesitas agregar la variable `BACKEND_API_URL` en cada ambiente de GitHub.

---

## 📍 Paso 1: Ir a Settings de GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú izquierdo, busca **Environments**

---

## 🏗️ Paso 2: Configurar por Ambiente

### Ambiente: `production`

1. Click en el ambiente **production**
2. Scroll hasta **Environment variables**
3. Click en **Add variable**
4. Completa:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `https://backend-monolito-production.up.railway.app`
5. Click en **Add variable**

### Ambiente: `development`

1. Click en el ambiente **development**
2. Scroll hasta **Environment variables**
3. Click en **Add variable**
4. Completa:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `https://backend-monolito-production.up.railway.app`
   
   > 💡 **Nota:** Por ahora usamos la misma URL. Cuando tengas un backend de desarrollo diferente, cámbiala aquí.

5. Click en **Add variable**

### Ambiente: `qa`

1. Click en el ambiente **qa**
2. Scroll hasta **Environment variables**
3. Click en **Add variable**
4. Completa:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `https://backend-monolito-production.up.railway.app`
   
   > 💡 **Nota:** Por ahora usamos la misma URL. Cuando tengas un backend de QA diferente, cámbiala aquí.

5. Click en **Add variable**

---

## ✅ Verificación

Después de agregar las variables, deberías ver en cada ambiente:

```
Environment variables
┌─────────────────────┬────────────────────────────────────────────────────┐
│ Name                │ Value                                              │
├─────────────────────┼────────────────────────────────────────────────────┤
│ BACKEND_API_URL     │ https://backend-monolito-production.up.railway... │
│ FIREBASE_API_KEY    │ AIzaSy...                                         │
│ FIREBASE_AUTH_...   │ cas-web-465521.firebaseapp.com                    │
│ ...                 │ ...                                                │
└─────────────────────┴────────────────────────────────────────────────────┘
```

---

## 🚀 Paso 3: Probar con un Deploy

Ahora que configuraste las variables:

```bash
git add .
git commit -m "feat: usar BACKEND_API_URL desde GitHub vars por ambiente"
git push origin main
```

Esto disparará el workflow y usará la variable correcta del ambiente.

---

## 🔍 Verificar en GitHub Actions

1. Ve a **Actions** en GitHub
2. Busca el workflow que se ejecutó
3. Abre el job (ej: `deploy-production`)
4. Expande el step **Create .env.local for Production**
5. Deberías ver:

```bash
cat > .env.local << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=***
NEXT_PUBLIC_FIREBASE_APP_ID=***
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app  ← ✅ Aquí está
NEXT_PUBLIC_ENVIRONMENT=production
EOL
```

---

## 🎨 Ventajas de este Enfoque

### ✅ Flexibilidad por Ambiente
```
production  → backend-monolito-production.up.railway.app
development → backend-dev.up.railway.app (cuando lo tengas)
qa          → backend-qa.up.railway.app (cuando lo tengas)
```

### ✅ No hardcodear URLs
- Fácil cambiar sin modificar código
- Diferentes backends por ambiente
- Más seguro y mantenible

### ✅ Centralizado en GitHub
- Todas las variables en un solo lugar
- Cambios sin commits
- Auditoria de cambios

---

## 🔄 Futuro: Múltiples Backends

Cuando tengas backends separados por ambiente:

### Production
```
BACKEND_API_URL=https://backend-prod.up.railway.app
```

### Development
```
BACKEND_API_URL=https://backend-dev.up.railway.app
```

### QA
```
BACKEND_API_URL=https://backend-qa.up.railway.app
```

Simplemente actualiza las variables en GitHub Settings → Environments → [ambiente] → Edit variable.

---

## 📋 Checklist Final

- [ ] Variable `BACKEND_API_URL` agregada en ambiente `production`
- [ ] Variable `BACKEND_API_URL` agregada en ambiente `development`
- [ ] Variable `BACKEND_API_URL` agregada en ambiente `qa`
- [ ] Commit y push de los workflows actualizados
- [ ] Verificar deploy exitoso en GitHub Actions
- [ ] Verificar en Firebase que se conecte al backend correcto

---

## 🆘 Si olvidaste agregar la variable

Si haces push sin agregar la variable en GitHub, el workflow fallará con:

```
Error: NEXT_PUBLIC_API_URL is not set
```

Solución:
1. Agrega la variable en GitHub Settings → Environments
2. Re-ejecuta el workflow (no necesitas hacer push de nuevo)

---

## 📝 Resumen

**Antes (❌ hardcoded):**
```yaml
NEXT_PUBLIC_API_URL=https://backend-monolito-production.up.railway.app
```

**Después (✅ desde vars):**
```yaml
NEXT_PUBLIC_API_URL=${{ vars.BACKEND_API_URL }}
```

¡Mucho más flexible y profesional! 🎉
