# app-dirigentes
La aplicación web progresiva para dirigentes del CAS (Campamento Andino Sayhueque)

## 🌐 Entornos de Despliegue

| Entorno | URL | Rama | Proyecto Firebase |
|---------|-----|------|-------------------|
| **Production** | https://casayhueque.web.app | `main` | `cas-web-465521` |
| **QA** | https://qa.casayhueque.org | `qa` | `sample-firebase-ai-app-55ff6` |
| **Development** | https://dev.casayhueque.org | `dev` | `authzen-gma61` |

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting, Cloud Messaging)
- **CI/CD**: GitHub Actions
- **PWA**: Service Workers + Web Push Notifications

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
cd frontend
npm install

# Iniciar emuladores de Firebase
firebase emulators:start

# En otra terminal, iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en http://localhost:3000

## 📱 Características

- ✅ Autenticación con Google
- ✅ PWA instalable
- ✅ Notificaciones Push
- ✅ Calendario de actividades
- ✅ Gestión de pagos
- ✅ Panel de avisos

## 🧪 Desarrollo con Emuladores de Firebase

### Setup inicial (solo una vez)

Después de clonar el repositorio, ejecutá el script de setup:

```bash
./scripts/setup-dev.sh
```

Esto:
1. Instala dependencias
2. Inicia los emuladores temporalmente
3. Crea los usuarios de prueba
4. Guarda los datos en `frontend/firebase-data/`

### Desarrollo diario

```bash
cd frontend
npm run dev
```

Los emuladores se inician automáticamente con los datos persistidos. Los usuarios de prueba ya estarán disponibles en el popup de Google Sign-In.

### Usuarios de prueba disponibles

| Email | Rol | Descripción |
|-------|-----|-------------|
| `admin@test.cas.com` | ADMIN | Acceso completo al sistema |
| `dirigente@test.cas.com` | DIRIGENTE | Gestión de actividades y acampantes |
| `padre@test.cas.com` | PADRE | Ver información de hijos, pagos |
| `acampante@test.cas.com` | ACAMPANTE | Ver actividades y calendario |

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia emuladores + Next.js (con datos persistidos) |
| `npm run dev:seed` | Recrea usuarios de prueba e inicia dev |
| `npm run firebase:emulators:clean` | Inicia emuladores SIN datos (limpio) |

### ¿Cómo funciona la persistencia?

Los emuladores de Firebase usan los flags:
- `--import=./firebase-data` → Carga datos al iniciar
- `--export-on-exit=./firebase-data` → Guarda datos al cerrar

Los datos se guardan en `frontend/firebase-data/` (ignorado por git).

### Resetear usuarios de prueba

Si necesitás recrear los usuarios desde cero:

```bash
rm -rf frontend/firebase-data
npm run dev:seed
```

O ejecutá el seed manualmente con los emuladores corriendo:

```bash
../scripts/seed-auth-users.sh
```

