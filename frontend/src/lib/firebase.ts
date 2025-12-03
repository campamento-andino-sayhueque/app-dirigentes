import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getMessaging,
  isSupported as messagingIsSupported,
} from "firebase/messaging";

const firebaseConfig = {
  // Configuración de Firebase - obtén estos valores desde Firebase Console
  // Ve a: https://console.firebase.google.com/project/cas-web-465521/settings/general
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Inicializar Firebase solo si no existe una instancia previa
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Inicializar Firestore
export const db = getFirestore(app);

// Flag para evitar conexiones múltiples a emuladores
let emulatorsConnected = false;

// Determinar si usar emuladores
// Usar emuladores si estamos en desarrollo O si estamos en localhost
const shouldUseEmulators = 
  typeof window !== "undefined" && 
  (process.env.NODE_ENV === "development" || 
   window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

export const isUsingEmulators = shouldUseEmulators;

// Configurar emuladores en desarrollo
if (shouldUseEmulators && !emulatorsConnected) {
  emulatorsConnected = true;
  
  // Solo conectar a emuladores si no están ya conectados
  // @ts-expect-error - _canInitEmulator es una propiedad interna de Firebase
  if (auth._canInitEmulator) {
    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
      console.log("🔧 Auth Emulator conectado");
    } catch {
      // Ya conectado, ignorar error
    }
  }

  // @ts-expect-error - _settingsFrozen es una propiedad interna de Firebase
  if (!db._settingsFrozen) {
    try {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      console.log("🔧 Firestore Emulator conectado");
    } catch {
      // Ya conectado, ignorar error
    }
  }
}

// Configurar el proveedor de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;

// Helper: devuelve la instancia de Messaging sólo si se está en cliente y está soportado
// Uso: const messaging = await getMessagingIfSupported(); // puede ser null
export async function getMessagingIfSupported() {
  if (typeof window === "undefined") return null;
  try {
    const supported = await messagingIsSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch (err) {
    // Si ocurre un error (por ejemplo en navegadores no soportados), devolvemos null
    console.warn("Firebase messaging no soportado:", err);
    return null;
  }
}
