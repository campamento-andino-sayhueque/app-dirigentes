import { initializeApp } from "firebase/app";
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth
export const auth = getAuth(app);

// Inicializar Firestore
export const db = getFirestore(app);

// Configurar emuladores en desarrollo
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Solo conectar a emuladores si no están ya conectados
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
  } catch {
    // Ya conectado, ignorar error
  }

  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  } catch {
    // Ya conectado, ignorar error
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
