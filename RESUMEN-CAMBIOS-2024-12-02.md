# Resumen de Cambios - 2 de Diciembre 2025

## 🔧 Problema Inicial
- Los emuladores de Firebase no estaban corriendo
- Error `ERR_CONNECTION_REFUSED` al intentar autenticarse
- Node.js instalado via `apt` (v18.19.1) era incompatible con Firebase CLI v14

---

## ✅ Solución 1: Migración a NVM (Node Version Manager)

### Problema
Node.js estaba instalado directamente desde los repositorios de Ubuntu (`apt`), lo cual:
- No permite actualizar fácilmente
- Requiere `sudo` para instalar paquetes globales
- Versión antigua (v18.19.1) incompatible con Firebase CLI moderno

### Solución
1. **Instalé NVM** (Node Version Manager):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

2. **Instalé Node.js LTS** (v24.11.1):
   ```bash
   nvm install --lts
   ```

3. **Desinstalé Node.js viejo** de apt:
   ```bash
   sudo apt remove -y nodejs && sudo apt autoremove -y
   ```

### Resultado
- **Antes**: Node.js v18.19.1, npm 9.2.0 (via apt)
- **Después**: Node.js v24.11.1, npm 11.6.2 (via nvm)

### Comandos útiles de NVM
```bash
nvm ls              # Ver versiones instaladas
nvm install --lts   # Instalar última LTS
nvm use <version>   # Cambiar versión
nvm alias default <version>  # Establecer versión por defecto
```

---

## ✅ Solución 2: Configuración de Firebase

### Archivos Creados/Modificados

#### 1. `firestore.rules` (NUEVO)
Creé el archivo de reglas de Firestore que faltaba:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 2. Configuré el target de hosting
```bash
firebase target:apply hosting casayhueque app-dirigentes
```

---

## ✅ Solución 3: Error "No matching frame" en Auth Emulator

### Problema
Al hacer login con Google en los emuladores, aparecía el error:
```
Error: Auth Emulator Internal Error: No matching frame
```

Esto ocurre porque `signInWithPopup` tiene problemas de comunicación entre frames en los emuladores.

### Solución
Modifiqué el código para usar credenciales de prueba directamente cuando se detectan emuladores.

#### `frontend/src/lib/firebase.ts`
```typescript
// Determinar si usar emuladores
const shouldUseEmulators = 
  typeof window !== "undefined" && 
  (process.env.NODE_ENV === "development" || 
   window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

export const isUsingEmulators = shouldUseEmulators;

// Conectar a emuladores si corresponde
if (shouldUseEmulators) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
```

#### `frontend/src/contexts/AuthContext.tsx`
```typescript
import { auth, googleProvider, isUsingEmulators } from "@/lib/firebase";

const signInWithGoogle = async () => {
  if (isUsingEmulators) {
    // En emuladores: usar credenciales de prueba
    const credential = GoogleAuthProvider.credential(
      '{"sub": "test-user-uid", "email": "test@example.com", "email_verified": true, "name": "Usuario de Prueba"}'
    );
    await signInWithCredential(auth, credential);
  } else {
    // En producción: flujo normal de popup
    await signInWithPopup(auth, googleProvider);
  }
};
```

---

## 📋 URLs de los Emuladores

| Servicio       | URL                        |
|----------------|----------------------------|
| App (Hosting)  | http://127.0.0.1:5000      |
| Firebase UI    | http://127.0.0.1:4000      |
| Auth Emulator  | http://127.0.0.1:9099      |
| Firestore      | http://127.0.0.1:8080      |

---

## 🚀 Comandos para Desarrollo

```bash
# Iniciar emuladores de Firebase
cd /home/ignacio/workspace/cas/app-dirigentes
firebase emulators:start

# En otra terminal, para desarrollo con hot-reload:
cd frontend
npm run dev

# O usar el comando combinado:
npm run dev:firebase
```

---

## 👤 Usuario de Prueba (Emuladores)

Cuando uses los emuladores, el login creará automáticamente:
- **Email**: test@example.com
- **Nombre**: Usuario de Prueba
- **UID**: test-user-uid
