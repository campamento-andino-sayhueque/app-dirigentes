import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { db, auth } from "./firebase";
import {
  initialUsers,
  initialPosts,
  initialComments,
  publicData,
} from "./seedData";

export async function seedDatabase() {
  try {
    console.log("🌱 Iniciando población de la base de datos...");

    // Crear usuarios en Firebase Auth y Firestore
    console.log("👥 Creando usuarios en Auth y Firestore...");
    for (const user of initialUsers) {
      try {
        // Crear usuario en Firebase Auth (solo en emulador)
        if (process.env.NODE_ENV === "development") {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              user.email,
              "password123" // Contraseña temporal para desarrollo
            );

            // Actualizar perfil del usuario
            await updateProfile(userCredential.user, {
              displayName: user.displayName,
              photoURL: user.photoURL,
            });

            console.log(`✅ Usuario creado en Auth: ${user.email}`);
          } catch (authError) {
            const error = authError as AuthError;
            if (error.code === "auth/email-already-in-use") {
              console.log(`ℹ️ Usuario ya existe en Auth: ${user.email}`);
            } else {
              console.error(
                `❌ Error creando usuario en Auth: ${user.email}`,
                error
              );
            }
          }
        }

        // Crear documento de usuario en Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          photoURL: user.photoURL,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        });

        console.log(`✅ Usuario creado en Firestore: ${user.email}`);
      } catch (error) {
        console.error(`❌ Error creando usuario: ${user.email}`, error);
      }
    }

    // Crear posts
    console.log("📝 Creando posts...");
    for (const post of initialPosts) {
      await setDoc(doc(db, "posts", post.id), {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        authorName: post.authorName,
        createdAt: post.createdAt,
        likes: post.likes,
        tags: post.tags,
      });
    }

    // Crear comentarios
    console.log("💬 Creando comentarios...");
    for (const comment of initialComments) {
      await setDoc(doc(db, "comments", comment.id), {
        postId: comment.postId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        createdAt: comment.createdAt,
      });
    }

    // Crear datos públicos
    console.log("🏕️ Creando información pública del campamento...");
    await setDoc(doc(db, "public", "campInfo"), publicData.campInfo);
    await setDoc(doc(db, "public", "activities"), {
      list: publicData.activities,
    });
    await setDoc(doc(db, "public", "seasons"), { list: publicData.seasons });

    console.log("✅ Base de datos poblada exitosamente!");
    console.log(`
📊 Datos creados:
- ${initialUsers.length} usuarios en Firebase Auth
- ${initialUsers.length} perfiles de usuario en Firestore
- ${initialPosts.length} posts
- ${initialComments.length} comentarios
- Información pública del campamento

🔐 Usuarios de prueba creados:
${initialUsers
  .map(
    (user) => `
- ${user.displayName}
  Email: ${user.email}
  Password: password123
  Rol: ${user.role}`
  )
  .join("")}

💡 Para probar la autenticación:
1. Usa email/password: cualquier usuario de arriba con 'password123'
2. O usa autenticación con Google (funcionará con tu cuenta real)
    `);
  } catch (error) {
    console.error("❌ Error poblando la base de datos:", error);
  }
}

// Función para limpiar la base de datos
export async function clearDatabase() {
  try {
    console.log("🧹 Limpiando base de datos...");
    // Esta función requeriría más lógica para eliminar documentos
    // Por ahora, es más fácil reiniciar los emuladores
    console.log(
      "💡 Para limpiar la base de datos, reinicia los emuladores de Firebase"
    );
  } catch (error) {
    console.error("❌ Error limpiando la base de datos:", error);
  }
}
