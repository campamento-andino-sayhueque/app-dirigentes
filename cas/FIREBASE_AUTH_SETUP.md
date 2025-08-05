# Configuración de Autenticación con Google en Firebase

## Pasos para configurar la autenticación:

### 1. Configurar Authentication en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/project/cas-web-465521)
2. En el menú lateral, selecciona **Authentication**
3. Ve a la pestaña **Sign-in method**
4. Busca **Google** en la lista de proveedores
5. Haz clic en **Google** y luego en **Enable**
6. Configura:
   - **Project support email**: Tu email de soporte
   - **Project public-facing name**: "Campamento Andino Sayhueque"
7. Haz clic en **Save**

### 2. Obtener la configuración de Firebase

1. Ve a **Project Settings** (icono de engranaje)
2. Baja hasta la sección **Your apps**
3. Si no tienes una app web, haz clic en **Add app** y selecciona **Web**
4. Copia los valores de configuración:
   ```javascript
   const firebaseConfig = {
     apiKey: "tu-api-key",
     authDomain: "cas-web-465521.firebaseapp.com",
     projectId: "cas-web-465521",
     storageBucket: "cas-web-465521.firebasestorage.app",
     messagingSenderId: "tu-sender-id",
     appId: "tu-app-id"
   };
   ```

### 3. Configurar variables de entorno

1. Duplica el archivo `.env.local.example` y renómbralo a `.env.local`
2. Reemplaza los valores con los obtenidos en el paso anterior:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cas-web-465521.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cas-web-465521
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cas-web-465521.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id_real
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id_real
```

### 4. Configurar dominios autorizados

1. En Firebase Authentication > Settings > Authorized domains
2. Agrega los dominios donde se ejecutará tu aplicación:
   - `localhost` (para desarrollo)
   - `cas-web-465521.web.app` (para producción)
   - Cualquier dominio personalizado que uses

### 5. Probar la aplicación

1. Ejecuta `npm run dev` para desarrollo local
2. Visita `http://localhost:3000`
3. Haz clic en "Continuar con Google"
4. Deberías ver la ventana de autenticación de Google

## Archivos creados:

- `src/lib/firebase.ts` - Configuración de Firebase
- `src/contexts/AuthContext.tsx` - Contexto de autenticación
- `src/components/LoginButton.tsx` - Componente de login
- `.env.local.example` - Ejemplo de variables de entorno

## Uso del hook de autenticación:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  if (user) {
    return (
      <div>
        <p>Hola, {user.displayName}</p>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    );
  }
  
  return <button onClick={signInWithGoogle}>Iniciar Sesión</button>;
}
```

## Notas importantes:

- Las variables de entorno deben empezar con `NEXT_PUBLIC_` para estar disponibles en el cliente
- El archivo `.env.local` no debe committearse al repositorio (está en .gitignore)
- Para producción, las variables de entorno se configuran en el servicio de hosting (Firebase, Vercel, etc.)
