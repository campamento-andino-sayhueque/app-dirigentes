# app-dirigentes
La aplicación web progresiva para dirigentes del CAS (Campamento Andino Sayhueque)

## 🌐 Entornos de Despliegue

| Entorno | URL | Rama | Proyecto Firebase |
|---------|-----|------|-------------------|
| **Production** | https://casayhueque.web.app | `main` | `cas-web-465521` |
| **QA** | https://sample-firebase-ai-app-55ff6.web.app | `qa` | `sample-firebase-ai-app-55ff6` |
| **Development** | https://authzen-gma61.web.app | `dev` | `authzen-gma61` |

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
