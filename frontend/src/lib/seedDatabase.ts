import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { initialUsers, initialPosts, initialComments, publicData } from './seedData';

export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando población de la base de datos...');

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    for (const user of initialUsers) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      });
    }

    // Crear posts
    console.log('📝 Creando posts...');
    for (const post of initialPosts) {
      await setDoc(doc(db, 'posts', post.id), {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        authorName: post.authorName,
        createdAt: post.createdAt,
        likes: post.likes,
        tags: post.tags
      });
    }

    // Crear comentarios
    console.log('💬 Creando comentarios...');
    for (const comment of initialComments) {
      await setDoc(doc(db, 'comments', comment.id), {
        postId: comment.postId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        createdAt: comment.createdAt
      });
    }

    // Crear datos públicos
    console.log('🏕️ Creando información pública del campamento...');
    await setDoc(doc(db, 'public', 'campInfo'), publicData.campInfo);
    await setDoc(doc(db, 'public', 'activities'), { list: publicData.activities });
    await setDoc(doc(db, 'public', 'seasons'), { list: publicData.seasons });

    console.log('✅ Base de datos poblada exitosamente!');
    console.log(`
📊 Datos creados:
- ${initialUsers.length} usuarios
- ${initialPosts.length} posts
- ${initialComments.length} comentarios
- Información pública del campamento

🔐 Usuarios de prueba:
${initialUsers.map(user => `
- ${user.displayName}
  Email: ${user.email}
  Rol: ${user.role}`).join('')}

💡 Para probar la autenticación:
1. Ve a la Firebase Console del emulador
2. En la sección Auth, agrega manualmente estos usuarios
3. O usa la autenticación con Google (funcionará con cualquier cuenta)
    `);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  }
}

// Función para limpiar la base de datos
export async function clearDatabase() {
  try {
    console.log('🧹 Limpiando base de datos...');
    // Esta función requeriría más lógica para eliminar documentos
    // Por ahora, es más fácil reiniciar los emuladores
    console.log('💡 Para limpiar la base de datos, reinicia los emuladores de Firebase');
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
  }
}
