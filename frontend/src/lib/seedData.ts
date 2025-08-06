// Datos de prueba para el emulador de Firebase
// Este archivo contiene datos iniciales para probar la aplicación

export const initialUsers = [
  {
    uid: 'demo-user-1',
    email: 'administrador@cas.com',
    displayName: 'Administrador CAS',
    role: 'admin',
    photoURL: 'https://ui-avatars.com/api/?name=Admin+CAS&background=FF6B35&color=fff',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    uid: 'demo-user-2',
    email: 'instructor@cas.com',
    displayName: 'Instructor Montaña',
    role: 'instructor',
    photoURL: 'https://ui-avatars.com/api/?name=Instructor+M&background=059669&color=fff',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    uid: 'demo-user-3',
    email: 'campista@cas.com',
    displayName: 'Campista Aventurero',
    role: 'user',
    photoURL: 'https://ui-avatars.com/api/?name=Campista+A&background=DC2626&color=fff',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

export const initialPosts = [
  {
    id: 'post-1',
    title: '¡Bienvenidos al Campamento Andino Sayhueque!',
    content: 'Estamos emocionados de iniciar una nueva temporada llena de aventuras, aprendizaje y crecimiento personal. En este espacio compartiremos experiencias, consejos y momentos únicos de nuestra vida en la montaña.',
    authorId: 'demo-user-1',
    authorName: 'Administrador CAS',
    createdAt: new Date().toISOString(),
    likes: 12,
    tags: ['bienvenida', 'comunidad', 'aventura']
  },
  {
    id: 'post-2',
    title: 'Consejos para tu primera caminata en alta montaña',
    content: 'La preparación es clave para disfrutar al máximo de las caminatas en alta montaña. Aquí tienes algunos consejos esenciales: hidrátate constantemente, usa ropa en capas, lleva siempre protección solar, y sobre todo, respeta la naturaleza.',
    authorId: 'demo-user-2',
    authorName: 'Instructor Montaña',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    tags: ['consejos', 'montaña', 'seguridad']
  },
  {
    id: 'post-3',
    title: 'Mi primera experiencia en el CAS',
    content: 'Nunca imaginé que una semana en el campamento cambiaría tanto mi perspectiva sobre la naturaleza y sobre mí mismo. Los instructores, los compañeros, las montañas... todo ha sido increíble. ¡Ya quiero volver!',
    authorId: 'demo-user-3',
    authorName: 'Campista Aventurero',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 15,
    tags: ['experiencia', 'testimonio', 'crecimiento']
  }
];

export const initialComments = [
  {
    id: 'comment-1',
    postId: 'post-1',
    content: '¡Qué ganas de empezar esta nueva aventura!',
    authorId: 'demo-user-2',
    authorName: 'Instructor Montaña',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment-2',
    postId: 'post-2',
    content: 'Excelentes consejos. Especialmente lo de las capas de ropa, es fundamental.',
    authorId: 'demo-user-3',
    authorName: 'Campista Aventurero',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment-3',
    postId: 'post-3',
    content: 'Me alegra mucho leer esto. Es exactamente el impacto que buscamos generar.',
    authorId: 'demo-user-1',
    authorName: 'Administrador CAS',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

// Datos públicos del campamento
export const publicData = {
  campInfo: {
    name: 'Campamento Andino Sayhueque',
    description: 'Un espacio de crecimiento personal a través de la aventura en la naturaleza',
    location: 'Cordillera de los Andes, Argentina',
    established: '1995',
    motto: 'Aventura, naturaleza y crecimiento personal'
  },
  activities: [
    'Trekking en alta montaña',
    'Escalada en roca',
    'Orientación y navegación',
    'Supervivencia básica',
    'Fotografía de naturaleza',
    'Observación de fauna',
    'Talleres de liderazgo',
    'Actividades de team building'
  ],
  seasons: [
    {
      name: 'Verano Intensivo',
      period: 'Diciembre - Febrero',
      description: 'Programa completo con todas las actividades'
    },
    {
      name: 'Otoño Contemplativo',
      period: 'Marzo - Mayo',
      description: 'Enfoque en observación y fotografía'
    },
    {
      name: 'Invierno Desafiante',
      period: 'Junio - Agosto',
      description: 'Actividades de montaña invernal'
    },
    {
      name: 'Primavera Renovadora',
      period: 'Septiembre - Noviembre',
      description: 'Renovación y nuevos comienzos'
    }
  ]
};
