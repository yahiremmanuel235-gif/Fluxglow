import { CommunityGroup, CommunityPost } from '../types';

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-ansiedad',
    name: 'Ansiedad y Calma Interior',
    icon: '🌿',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    category: 'Ansiedad',
    membersCount: 428,
    description: 'Un refugio seguro para compartir herramientas prácticas contra la ansiedad, técnicas de respiración y experiencias de regulación emocional.',
    purpose: 'Normalizar las sensaciones de ansiedad, compartir ejercicios de anclaje que funcionan en el día a día y recordarnos que no estamos solos en este proceso.',
    rules: [
      'Respeto y empatía absoluta hacia las experiencias compartidas.',
      'Espacio 100% libre de juicios y críticas destructivas.',
      'No sustituye el diagnóstico ni la atención de un profesional de la salud mental.',
      'Evita dar consejos médicos o farmacológicos no autorizados.',
      'Mantén la confidencialidad: lo que se comparte en el grupo, se queda en el grupo.'
    ],
    tags: ['Respiración', 'Paz Mental', 'Anclaje', 'Apoyo Mutuo']
  },
  {
    id: 'grp-estudiantes',
    name: 'Estudiantes y Productividad Consciente',
    icon: '📚',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    category: 'Estudios & Estrés',
    membersCount: 315,
    description: 'Comunidad dedicada a estudiantes universitarios y de bachillerato para gestionar la sobrecarga académica sin quemarse (burnout).',
    purpose: 'Intercambiar métodos de estudio saludables, técnicas para superar la procrastinación y apoyarnos durante épocas de parciales y proyectos.',
    rules: [
      'Fomentar la cultura del descanso activo: la productividad no debe costar la salud.',
      'Comparte tips de organización y bienestar académico con generosidad.',
      'Prohibido el spam o venta de tareas y exámenes.',
      'Celebra los pequeños avances de tus compañeros.',
      'Si alguien expresa saturación extrema, guíale con amabilidad hacia las herramientas SOS.'
    ],
    tags: ['Parciales', 'Pomodoro', 'Organización', 'Sin Burnout']
  },
  {
    id: 'grp-sueno',
    name: 'Hábitos, Rutinas y Sueño Reparador',
    icon: '🌙',
    coverImage: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80',
    category: 'Sueño & Hábitos',
    membersCount: 260,
    description: 'Espacio para optimizar el descanso nocturno, desconexión de pantallas y creación de rituales matutinos y vespertinos de bienestar.',
    purpose: 'Aprender higiene del sueño basada en neurociencia, reducir el insomnio por sobrepensamiento y cultivar hábitos sostenibles.',
    rules: [
      'Comparte experiencias sobre qué rituales te han ayudado a descansar mejor.',
      'Valida que cada cuerpo y ritmo circadiano es diferente.',
      'No recomiendes sustancias o medicamentos para dormir.',
      'Promueve la desconexión digital saludable en las noches.'
    ],
    tags: ['Higiene del Sueño', 'Desconexión', 'Rituales', 'Energía']
  },
  {
    id: 'grp-autocompasion',
    name: 'Autocompasión y Crecimiento Personal',
    icon: '✨',
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    category: 'Autoestima',
    membersCount: 382,
    description: 'Transforma tu diálogo interno, sana la autocrítica severa y aprende a tratarte con la misma amabilidad con la que tratas a tu mejor amigo.',
    purpose: 'Desarrollar una relación sana con uno mismo, celebrar la vulnerabilidad y aprender de los errores sin castigo emocional.',
    rules: [
      'Cultiva palabras amables hacia ti mismo y hacia los demás miembros.',
      'La vulnerabilidad es bienvenida y cuidada en este espacio.',
      'Prohibido el positivismo tóxico: se vale tener días difíciles y reconocerlos.',
      'Trata las historias personales con la máxima dignidad.'
    ],
    tags: ['Amabilidad', 'Diálogo Interno', 'Autoestima', 'Gratitud']
  },
  {
    id: 'grp-mindfulness',
    name: 'Mindfulness y Conexión Presente',
    icon: '🧘',
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
    category: 'Mindfulness',
    membersCount: 295,
    description: 'Prácticas diarias de presencia, gratitud y atención plena para desacelerar el ritmo acelerado del día a día.',
    purpose: 'Inspirar pausas conscientes de 3 a 5 minutos, caminar con presencia y conectar con nuestros cinco sentidos en cualquier momento.',
    rules: [
      'Comparte tus reflexiones de presencia y momentos de asombro cotidiano.',
      'No se requiere experiencia previa en meditación: todos somos principiantes.',
      'Mantén el enfoque en la atención plena y la serenidad cotidiana.'
    ],
    tags: ['Aquí y Ahora', 'Meditación', 'Pausas', 'Sentidos']
  },
  {
    id: 'grp-desahogo',
    name: 'Espacio de Escucha y Desahogo Seguro',
    icon: '🫂',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    category: 'Apoyo Emocional',
    membersCount: 512,
    description: 'Un lugar para soltar lo que pesa en el pecho, recibir abrazos virtuales y palabras reconfortantes de personas que comprenden.',
    purpose: 'Brindar contención emocional cálida cuando necesitas expresar cómo te sientes sin temor a ser juzgado o minimizado.',
    rules: [
      'Prioridad número uno: Escucha activa y empatía sin dar lecciones no solicitadas.',
      'Respeta el dolor ajeno sin comparar quién sufre más.',
      'Si detectas riesgo de autolesión, notifícalo para activar los protocolos de ayuda inmediata SOS.'
    ],
    tags: ['Desahogo', 'Abrazos', 'Escucha Activa', 'Sin Juicios']
  }
];

export const INITIAL_FACEBOOK_STYLE_POSTS: CommunityPost[] = [
  {
    id: 'post-fb-1',
    author: 'Mateo Rivera',
    authorRole: 'Estudiante Universitario',
    avatarColor: '#4a7c59',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Hace 2 horas',
    content: 'Hoy logré hacer la técnica de respiración del Suspiro Fisiológico antes de entrar a mi presentación final. Sentí cómo bajaron las palpitaciones de inmediato y pude hablar con mucha más tranquilidad. ¡De verdad funciona cuando lo practicas en el momento justo!',
    category: 'Ansiedad y Calma Interior',
    tags: ['Respiración', 'Logro', 'Calma'],
    likes: 24,
    hugs: 19,
    commentsCount: 3,
    comments: [
      {
        id: 'c-fb-1',
        author: 'Valeria C.',
        text: '¡Muchas felicidades Mateo! A mí también me salvó antes de los parciales de anatomía.',
        timeAgo: 'Hace 1 hora'
      },
      {
        id: 'c-fb-2',
        author: 'Carlos G.',
        text: 'Esa técnica es oro puro. Qué alegría que te haya servido amigo.',
        timeAgo: 'Hace 45 min'
      }
    ]
  },
  {
    id: 'post-fb-2',
    author: 'Camila Sandoval',
    authorRole: 'Miembro de la Comunidad',
    avatarColor: '#D8C97B',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Hace 4 horas',
    content: 'A veces me cuesta recordar que voy a mi propio ritmo y no al que veo en redes sociales. Hoy me sentí abrumada por la comparación, pero me detuve 5 minutos a escribir 3 cosas que he logrado este mes por pequeñas que parezcan. Les mando un abrazo si hoy también se sienten así.',
    category: 'Autocompasión y Crecimiento Personal',
    tags: ['Autocompasión', 'Reflexión', 'Abrazo'],
    likes: 42,
    hugs: 37,
    commentsCount: 2,
    comments: [
      {
        id: 'c-fb-3',
        author: 'Lucas P.',
        text: 'Justo necesitaba leer esto hoy Camila. En redes solo vemos el escenario de los demás, no su detrás de cámaras. Gracias por compartirlo.',
        timeAgo: 'Hace 3 horas'
      }
    ]
  },
  {
    id: 'post-fb-3',
    author: 'Diego Mendoza',
    authorRole: 'Bachiller',
    avatarColor: '#E89A6B',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Hace 6 horas',
    content: 'Dejar el teléfono en otra habitación 30 minutos antes de dormir cambió radicalmente cómo despierto. Llevo 5 días con racha de buen sueño y mi nivel de concentración en clases subió un montón. ¿Quién más se anima a probarlo hoy?',
    category: 'Hábitos, Rutinas y Sueño Reparador',
    tags: ['Sueño', 'Hábito', 'Descanso'],
    likes: 31,
    hugs: 14,
    commentsCount: 1,
    comments: [
      {
        id: 'c-fb-4',
        author: 'Andrea Solís',
        text: '¡Me sumo al reto esta noche! Cero pantallas después de las 10 PM.',
        timeAgo: 'Hace 2 horas'
      }
    ]
  }
];
