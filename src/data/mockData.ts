import { 
  LearnResource, 
  PsychologicalTest, 
  EmotionEntry, 
  CommunityPost, 
  WellnessChallenge, 
  WellnessGoal, 
  UserBadge, 
  UserProfile,
  EmergencyContact,
  TeamMember 
} from '../types';

export const INITIAL_EMOTION_ENTRIES: EmotionEntry[] = [
  {
    id: 'entry-1',
    date: '2026-08-25',
    timestamp: '10:30 AM',
    mood: 'Tranquilo',
    intensity: 8,
    tags: ['Estudios', 'Tiempo libre', 'Sueño'],
    notes: 'Hoy inicié la mañana con una caminata de 15 minutos. Me sentí despejado antes de estudiar para el parcial de cálculo.',
    sleepHours: 7.5,
    waterGlasses: 6,
    physicalActivity: 'Caminata suave',
    energyLevel: 4,
    aiAnalysis: {
      dominantEmotion: 'Paz mental y Enfoque',
      sentimentScore: 88,
      keywords: ['Despejado', 'Caminata', 'Estudio'],
      aiInsight: 'La actividad física matutina redujo notablemente tu reactividad al estrés académico.',
      suggestedAction: 'Mantén esta rutina de 15 minutos antes de tus sesiones de estudio.'
    }
  },
  {
    id: 'entry-2',
    date: '2026-08-26',
    timestamp: '03:45 PM',
    mood: 'Estresado',
    intensity: 6,
    tags: ['Estudios', 'Futuro'],
    notes: 'Mucho volumen de tareas acumuladas. Sentí un poco de opresión en el pecho pero practiqué la respiración 4-7-8 de Flux AI.',
    sleepHours: 6.0,
    waterGlasses: 4,
    physicalActivity: 'Estiramientos en silla',
    energyLevel: 2,
    aiAnalysis: {
      dominantEmotion: 'Sobrecarga temporal',
      sentimentScore: 62,
      keywords: ['Tareas', 'Respiración', 'Tensión'],
      aiInsight: 'Aplicar la técnica de respiración frenó un pico de ansiedad antes de convertirse en parálisis.',
      suggestedAction: 'Divide la tarea más grande en bloques de 25 minutos (Técnica Pomodoro).'
    }
  },
  {
    id: 'entry-3',
    date: '2026-08-27',
    timestamp: '09:15 AM',
    mood: 'Motivado',
    intensity: 9,
    tags: ['Amigos', 'Metas', 'Salud'],
    notes: 'Me reuní con mi grupo de proyecto. Pudimos avanzar en el diseño y me sentí respaldado y escuchado.',
    sleepHours: 8.0,
    waterGlasses: 8,
    physicalActivity: 'Ciclismo 30min',
    energyLevel: 5,
    aiAnalysis: {
      dominantEmotion: 'Conexión social positiva',
      sentimentScore: 94,
      keywords: ['Equipo', 'Avance', 'Energía'],
      aiInsight: 'Tu sentido de pertenencia y apoyo grupal actúan como amortiguador clave de tu bienestar.',
      suggestedAction: 'Envía un mensaje de agradecimiento a tus compañeros para reforzar el vínculo.'
    }
  }
];

export const LEARN_RESOURCES: LearnResource[] = [
  {
    id: 'art-1',
    category: 'articulos',
    title: 'Neurociencia de la Ansiedad: ¿Por qué tu cerebro reacciona con alarma?',
    author: 'Dra. Sofía Morales (Neuropsicóloga)',
    durationOrPages: '5 min de lectura',
    difficultyOrAge: '15-25 años',
    tags: ['Ansiedad', 'Cerebro', 'Regulación'],
    summary: 'Aprende cómo la amígdala activa el modo alerta y cómo la respiración diafragmática le indica al sistema nervioso que estás a salvo.',
    rating: 4.9,
    badge: 'Popular',
    fullContent: `La ansiedad no es un defecto de fábrica de tu cerebro; es un sistema de supervivencia ultraeficiente diseñado hace miles de años para responder a amenazas físicas reales. Cuando percibes una fecha de entrega, un examen o un conflicto interpersonal como un "peligro", tu amígdala envía una señal de socorro al hipotálamo, liberando adrenalina y cortisol.
    
Para regular este estado, la vía más rápida no es "pensar en positivo", sino enviar señales físicas:
1. El suspiro fisiológico: Dos inhalaciones cortas por la nariz y una exhalación larga y lenta por la boca.
2. Relajación de la mandíbula y lengua: desconecta reflejos de tensión muscular crónica.
3. Desplazar la mirada a un plano panorámico para calmar la actividad visual hiperfocalizada.`
  },
  {
    id: 'art-2',
    category: 'articulos',
    title: 'Cómo superar el sobrepensamiento (Rumiación) en las noches',
    author: 'Lic. Mateo Rivera (Psicólogo Clínico)',
    durationOrPages: '4 min de lectura',
    difficultyOrAge: 'Todo público',
    tags: ['Sueño', 'Pensamientos', 'Calma'],
    summary: 'Estrategias basadas en Terapia Cognitivo-Conductual para vaciar la mente antes de dormir sin luchar contra tus pensamientos.',
    rating: 4.8,
    fullContent: `El cerebro humano suele rumiar de noche porque disminuyen los estímulos externos. Al estar en silencio, la red neuronal por defecto (DMN) se activa y repasa problemas no resueltos.
    
Estrategia de la "Descarga Mental" (Brain Dump):
- Ten una libreta junto a tu cama.
- Escribe todas tus tareas pendientes y preocupaciones en 3 minutos.
- Asigna mentalmente: "Esto tiene un lugar físico seguro y lo revisaré mañana a las 9:00 AM".`
  },
  {
    id: 'pod-1',
    category: 'podcasts',
    title: 'Episodio 12: Normalizando no estar bien todos los días',
    author: 'Podcast FluxGlow x Juventud Consciente',
    durationOrPages: '14 min',
    difficultyOrAge: 'Jóvenes 15-30',
    tags: ['Autocompasión', 'Emociones', 'Juventud'],
    summary: 'Una conversación abierta sobre la presión del positivismo tóxico en redes sociales y la belleza de abrazar la vulnerabilidad.',
    rating: 4.95,
    badge: 'Recomendado',
    audioUrlOrLength: '14:20'
  },
  {
    id: 'pod-2',
    category: 'podcasts',
    title: 'Episodio 8: Gestión del estrés académico y exámenes sin colapsar',
    author: 'Dra. Andrea Solís',
    durationOrPages: '18 min',
    difficultyOrAge: 'Estudiantes',
    tags: ['Universidad', 'Exámenes', 'Productividad'],
    summary: 'Herramientas de organización, descanso activo y técnicas de memoria basadas en la reducción de cortisol.',
    rating: 4.7,
    audioUrlOrLength: '18:45'
  },
  {
    id: 'vid-1',
    category: 'videos',
    title: 'Técnica de Anclaje 5-4-3-2-1 para detener ataques de pánico',
    author: 'Equipo Terapéutico FluxGlow',
    durationOrPages: '6 min',
    difficultyOrAge: 'Guía práctica',
    tags: ['Pánico', 'Grounding', 'Tutorial'],
    summary: 'Video interactivo paso a paso que conecta tus 5 sentidos con el presente inmediato.',
    rating: 5.0,
    badge: 'Esencial'
  },
  {
    id: 'vid-2',
    category: 'videos',
    title: 'Rutina matutina de 7 minutos para elevar la dopamina saludable',
    author: 'Prof. Carlos Méndez',
    durationOrPages: '7 min',
    difficultyOrAge: 'Bienestar',
    tags: ['Hábitos', 'Energía', 'Mañanas'],
    summary: 'Luz solar, movilidad suave e hidratación guiada para iniciar el día con serenidad y claridad.',
    rating: 4.85
  },
  {
    id: 'gui-1',
    category: 'guias',
    title: 'Guía Descargable: Cuaderno de Reestructuración del Diálogo Interno',
    author: 'FluxGlow Psychology Lab',
    durationOrPages: '12 páginas (PDF interactivo)',
    difficultyOrAge: '15-30 años',
    tags: ['Autoestima', 'Ejercicios', 'PDF'],
    summary: 'Plantillas descargables con ejercicios prácticos para transformar autocrítica severa en autocompasión constructiva.',
    rating: 4.9,
    badge: 'Descargable'
  },
  {
    id: 'gui-2',
    category: 'guias',
    title: 'Protocolo SOS: Kit de Primeros Auxilios Psicológicos en el Bolsillo',
    author: 'Cruz Roja & FluxGlow',
    durationOrPages: '6 páginas',
    difficultyOrAge: 'Emergencia',
    tags: ['Crisis', 'SOS', 'Herramientas'],
    summary: 'Fichas de bolsillo rápidas con pasos a seguir ante una crisis emocional propia o de un compañero.',
    rating: 4.98
  },
  {
    id: 'lib-1',
    category: 'libros',
    title: 'El Poder de las Emociones Cómodas e Incómodas',
    author: 'Dr. Marc Brackett (Yale Center for Emotional Intelligence)',
    durationOrPages: 'Lectura recomendada',
    difficultyOrAge: 'Todo público',
    tags: ['Permiso para Sentir', 'Inteligencia Emocional'],
    summary: 'Una guía reveladora sobre cómo identificar, expresar y regular emociones para tomar mejores decisiones.',
    rating: 4.9
  },
  {
    id: 'lib-2',
    category: 'libros',
    title: 'Mente Serena, Vida Plena: Mindfulness para el Siglo XXI',
    author: 'Thich Nhat Hanh',
    durationOrPages: 'Lectura recomendada',
    difficultyOrAge: 'Principiantes',
    tags: ['Mindfulness', 'Paz Interior'],
    summary: 'Consejos sencillos y profundos para respirar con presencia y encontrar calma en medio del caos cotidiano.',
    rating: 5.0
  }
];

export const PSYCHOLOGICAL_TESTS: PsychologicalTest[] = [
  {
    id: 'test-gad7',
    title: 'Escala Orientativa de Ansiedad (Inspirada en GAD-7)',
    shortDesc: 'Evalúa tus niveles de tensión, nerviosismo y preocupación durante las últimas dos semanas.',
    duration: '3 minutos',
    questionsCount: 7,
    category: 'Ansiedad',
    questions: [
      {
        id: 1,
        text: '¿Te has sentido nervioso/a, ansioso/a o con los nervios de punta?',
        options: [
          { text: 'Para nada (0 días)', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 2,
        text: '¿Has tenido dificultad para parar o controlar la preocupación constante?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 3,
        text: '¿Te has preocupado demasiado por diferentes cosas a la vez?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 4,
        text: '¿Has tenido problemas para relajarte o desconectar?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 5,
        text: '¿Te has sentido tan inquieto/a que te costaba estar quieto/a?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 6,
        text: '¿Te has irritado o enfadado con facilidad por situaciones cotidianas?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      },
      {
        id: 7,
        text: '¿Has sentido miedo como si algo terrible fuera a suceder?',
        options: [
          { text: 'Para nada', score: 0 },
          { text: 'Varios días', score: 1 },
          { text: 'Más de la mitad de los días', score: 2 },
          { text: 'Casi todos los días', score: 3 }
        ]
      }
    ],
    interpretations: [
      {
        minScore: 0,
        maxScore: 4,
        level: 'Nivel Mínimo / Saludable',
        color: '#4a7c59',
        description: 'Tus respuestas indican un nivel bajo de tensión habitual. Mantienes un adecuado equilibrio emocional.',
        recommendations: [
          'Continúa practicando tus hábitos de autocuidado y descanso.',
          'Usa el Diario Emocional para registrar momentos de agradecimiento.'
        ]
      },
      {
        minScore: 5,
        maxScore: 9,
        level: 'Ansiedad Leve',
        color: '#D8C97B',
        description: 'Experimentas momentos de tensión o sobrecarga moderada en tu rutina cotidiana.',
        recommendations: [
          'Prueba la respiración 4-7-8 con Flux AI 5 minutos al día.',
          'Revisa tu horario de sueño y reduce el uso de pantallas antes de acostarte.'
        ]
      },
      {
        minScore: 10,
        maxScore: 14,
        level: 'Ansiedad Moderada',
        color: '#E89A6B',
        description: 'La preocupación e intranquilidad están afectando tu energía diaria y concentración.',
        recommendations: [
          'Practica ejercicios de anclaje (Grounding 5-4-3-2-1).',
          'Considera hablar con un consejero estudiantil o psicólogo de confianza.',
          'Utiliza el Semáforo Emocional para registrar tus detonantes.'
        ]
      },
      {
        minScore: 15,
        maxScore: 21,
        level: 'Ansiedad Elevada',
        color: '#d4622a',
        description: 'Tus niveles de estrés y angustia son significativos. No tienes que cargar esto solo/a.',
        recommendations: [
          'Te sugerimos contactar las líneas gratuitas de apoyo psicológico en la sección Alerta Emocional.',
          'Comunícate con una persona de tu red de apoyo cercana.',
          'Activa el Modo SOS de FluxGlow para estabilizar tu respiración ahora mismo.'
        ]
      }
    ]
  },
  {
    id: 'test-burnout',
    title: 'Test de Agotamiento Emocional & Estrés Académico',
    shortDesc: 'Descubre si estás en riesgo de fatiga mental, desconexión o sobrecarga de responsabilidades.',
    duration: '2 minutos',
    questionsCount: 5,
    category: 'Estrés',
    questions: [
      {
        id: 1,
        text: '¿Sientes que te despiertas ya sin energía para afrontar el día?',
        options: [
          { text: 'Rara vez', score: 0 },
          { text: 'A veces', score: 1 },
          { text: 'Frecuentemente', score: 2 },
          { text: 'Siempre', score: 3 }
        ]
      },
      {
        id: 2,
        text: '¿Sientes distanciamiento o falta de interés por cosas que antes te apasionaban?',
        options: [
          { text: 'Rara vez', score: 0 },
          { text: 'A veces', score: 1 },
          { text: 'Frecuentemente', score: 2 },
          { text: 'Siempre', score: 3 }
        ]
      },
      {
        id: 3,
        text: '¿Te cuesta concentrarte incluso en tareas sencillas?',
        options: [
          { text: 'Rara vez', score: 0 },
          { text: 'A veces', score: 1 },
          { text: 'Frecuentemente', score: 2 },
          { text: 'Siempre', score: 3 }
        ]
      },
      {
        id: 4,
        text: '¿Sientes frustración frecuente o sensación de no rendir lo suficiente?',
        options: [
          { text: 'Rara vez', score: 0 },
          { text: 'A veces', score: 1 },
          { text: 'Frecuentemente', score: 2 },
          { text: 'Siempre', score: 3 }
        ]
      },
      {
        id: 5,
        text: '¿Postergas tus comidas, hidratación o sueño para cumplir tareas?',
        options: [
          { text: 'Rara vez', score: 0 },
          { text: 'A veces', score: 1 },
          { text: 'Frecuentemente', score: 2 },
          { text: 'Siempre', score: 3 }
        ]
      }
    ],
    interpretations: [
      {
        minScore: 0,
        maxScore: 3,
        level: 'Balance Sostenible',
        color: '#4a7c59',
        description: 'Tus niveles de energía están bien gestionados y mantienes un ritmo equilibrado.',
        recommendations: ['Sigue preservando tus límites entre estudio y descanso.']
      },
      {
        minScore: 4,
        maxScore: 8,
        level: 'Fatiga Incipiente',
        color: '#D8C97B',
        description: 'Estás acumulando cansancio mental. Tu cuerpo te pide pausas intencionales.',
        recommendations: ['Introduce micro-pausas de 5 minutos cada hora.', 'Respeta tus 8 horas de sueño.']
      },
      {
        minScore: 9,
        maxScore: 15,
        level: 'Riesgo Alto de Burnout',
        color: '#d4622a',
        description: 'Sobrecarga física y mental aguda. Es prioritario desescalar tareas y pedir apoyo.',
        recommendations: ['Habla con tus profesores o tutores.', 'Revisa las técnicas de regulación en Flux AI.']
      }
    ]
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Mateo R.',
    authorRole: 'Estudiante Universitario',
    avatarColor: '#4a7c59',
    timeAgo: 'Hace 2 horas',
    content: 'Hoy logré hacer la técnica de respiración 4-7-8 antes de presentar mi proyecto final. Sentí cómo disminuyeron las palpitaciones y pude exponer con mucha más serenidad. ¡Sí funciona!',
    category: 'Ansiedad & Exámenes',
    tags: ['Exámenes', 'Respiración', 'Logro'],
    likes: 18,
    hugs: 12,
    comments: [
      {
        id: 'c-1',
        author: 'Valeria C.',
        text: '¡Muchas felicidades Mateo! A mí también me sirve un montón antes de parciales.',
        timeAgo: 'Hace 1 hora'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Anónimo/a',
    authorRole: 'Miembro de la Comunidad',
    avatarColor: '#D8C97B',
    timeAgo: 'Hace 4 horas',
    content: 'A veces siento que todos avanzan más rápido que yo en sus carreras y me abrumo. ¿Cómo manejan ustedes la comparación constante con lo que ven en redes?',
    category: 'Autocompasión',
    tags: ['Comparación', 'Redes', 'Presión'],
    likes: 24,
    hugs: 31,
    comments: [
      {
        id: 'c-2',
        author: 'Lucas P.',
        text: 'Recuerda que en redes solo vemos los mejores momentos de los demás, nunca sus dudas o caídas. Vas a tu propio ritmo y eso está bien.',
        timeAgo: 'Hace 3 horas'
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Camila S.',
    authorRole: 'Bachiller',
    avatarColor: '#E89A6B',
    timeAgo: 'Ayer',
    content: 'Dejar el teléfono 30 minutos antes de dormir cambió radicalmente cómo despierto. Mi racha de sueño llegó a 8 horas continuas.',
    category: 'Hábitos & Rutinas',
    tags: ['Sueño', 'Descanso', 'Hábito'],
    likes: 35,
    hugs: 8,
    comments: []
  }
];

export const WELLNESS_CHALLENGES: WellnessChallenge[] = [
  {
    id: 'chal-1',
    title: 'Desafío 7 Días de Descanso Digital & Sueño Reparador',
    description: 'Apagar notificaciones 30 minutos antes de acostarte y realizar 3 respiraciones profundas al despertar.',
    daysTotal: 7,
    participantsCount: 342,
    category: 'Sueño & Hábitos'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Flores',
  age: 20,
  streakDays: 14,
  wellnessScore: 84,
  goals: [
    {
      id: 'g-1',
      title: 'Practicar Respiración 4-7-8 antes de dormir',
      category: 'Regulación Emocional',
      target: 7,
      current: 5,
      unit: 'días',
      completed: false
    },
    {
      id: 'g-2',
      title: 'Dormir mínimo 7.5 horas cada noche',
      category: 'Salud y Descanso',
      target: 7,
      current: 7,
      unit: 'días',
      completed: true
    },
    {
      id: 'g-3',
      title: 'Registrar diario emocional matutino y vespertino',
      category: 'Autoconocimiento',
      target: 14,
      current: 12,
      unit: 'días',
      completed: false
    }
  ],
  badges: [
    {
      id: 'b-1',
      title: 'Semana Consciente',
      icon: '🌿',
      description: 'Completaste 7 días consecutivos de registro emocional en el diario.',
      unlockedAt: '18 May 2026'
    },
    {
      id: 'b-2',
      title: 'Maestro del Grounding',
      icon: '🧘',
      description: 'Superaste con éxito 5 ejercicios de anclaje sensorial 5-4-3-2-1.',
      unlockedAt: '22 May 2026'
    },
    {
      id: 'b-3',
      title: 'Corazón Empático',
      icon: '🫂',
      description: 'Enviaste más de 20 mensajes de apoyo y abrazos virtuales en la comunidad.',
      unlockedAt: '26 May 2026'
    },
    {
      id: 'b-4',
      title: 'Equilibrio Predictivo',
      icon: '⭐',
      description: 'Mantuviste tu Índice de Bienestar superior al 80% durante dos semanas.',
      unlockedAt: 'Ayer'
    }
  ],
  aiPersonalityInsight: 'Prefieres acompañamiento empático y directo. Respondes con especial efectividad a las pausas de respiración auditivas y los resúmenes semanales de balance.'
};

export const CRISIS_HOTLINES = [
  {
    name: 'Línea de Apoyo Emocional y Prevención de Crisis',
    phone: '131',
    international: '+503 131',
    cost: 'Llamada 100% Gratuita',
    schedule: '24 horas / 7 días',
    description: 'Atención psicológica inmediata y confidencial atendida por profesionales capacitados.'
  },
  {
    name: 'Línea de Asistencia Directa FluxGlow',
    phone: '+503 7801-4680',
    international: '+503 7801-4680',
    cost: 'Línea WhatsApp y Llamadas',
    schedule: 'Lunes a Domingo 7:00 AM - 10:00 PM',
    description: 'Canal directo con el equipo de soporte y psicólogos colaboradores de FluxGlow.'
  },
  {
    name: 'Cruz Roja Salvadoreña - Apoyo Psicosocial',
    phone: '+503 2222-5155',
    international: '+503 2222-5155',
    cost: 'Servicio de Emergencia',
    schedule: '24/7',
    description: 'Atención de emergencias y primeros auxilios psicológicos en situaciones de crisis.'
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-1',
    name: 'Dra. Solís (Psicóloga Colaboradora)',
    relationship: 'Terapeuta de Referencia',
    phone: '+503 7801-4680',
    notifyOnAlert: true
  },
  {
    id: 'ec-2',
    name: 'Mamá / Tutor de Confianza',
    relationship: 'Familiar Directo',
    phone: '+503 7123-4567',
    notifyOnAlert: true
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'gabriela',
    name: 'Gabriela',
    role: 'Directora General (CEO)',
    subtitle: 'Líder Estratégica & Coordinación General',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Gabriela es la encargada de dirigir y coordinar el desarrollo general de FLUXGLOW. Su liderazgo permite que todas las áreas trabajen de manera organizada para alcanzar los objetivos del proyecto.',
    functions: [
      'Supervisar todas las áreas de la empresa.',
      'Tomar decisiones estratégicas clave.',
      'Coordinar al equipo interdisciplinario.',
      'Representar a FLUXGLOW en presentaciones y eventos.',
      'Impulsar nuevas ideas e innovaciones.'
    ],
    accentColor: '#4a7c59'
  },
  {
    id: 'moises',
    name: 'Moisés',
    role: 'Director de Tecnología (CTO)',
    subtitle: 'Arquitectura & Desarrollo de Software',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Moisés lidera el desarrollo tecnológico de FLUXGLOW, asegurando que la plataforma funcione de manera eficiente, segura e innovadora para todos los usuarios.',
    functions: [
      'Gestionar el desarrollo de la página web y aplicaciones.',
      'Supervisar las herramientas tecnológicas.',
      'Implementar nuevas funciones digitales.',
      'Garantizar la seguridad y privacidad de los datos.',
      'Coordinar la integración de inteligencia artificial.'
    ],
    accentColor: '#D8C97B'
  },
  {
    id: 'yahir',
    name: 'Yahir',
    role: 'Director de Diseño y UX/UI',
    subtitle: 'Experiencia de Usuario e Identidad Visual',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Yahir es responsable de la imagen visual de FLUXGLOW. Su trabajo busca que la plataforma sea atractiva, intuitiva, accesible y fácil de utilizar para todos los usuarios.',
    functions: [
      'Diseñar la identidad visual de la marca.',
      'Crear interfaces amigables y adaptables.',
      'Optimizar la experiencia del usuario (UX).',
      'Diseñar materiales promocionales y gráficos.',
      'Garantizar la coherencia visual de la plataforma.'
    ],
    accentColor: '#E89A6B'
  },
  {
    id: 'genesis',
    name: 'Génesis',
    role: 'Directora de Marketing y RP',
    subtitle: 'Relaciones Públicas & Comunidad',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Génesis se encarga de dar a conocer FLUXGLOW y conectar la plataforma con la comunidad. Su labor fortalece la presencia de la marca y fomenta el crecimiento del proyecto.',
    functions: [
      'Diseñar y ejecutar estrategias de marketing digital.',
      'Gestionar redes sociales y comunicación comunitaria.',
      'Coordinar campañas publicitarias y de concientización.',
      'Crear alianzas estratégicas con colegios e instituciones.',
      'Mantener la comunicación con usuarios y colaboradores.'
    ],
    accentColor: '#d4622a'
  }
];

export const INTERFACES_DATA = [
  {
    id: 'learn',
    number: 'Apartado #1',
    title: 'Centro de Aprendizaje Emocional',
    subtitle: 'Explora y Aprende',
    description: 'Biblioteca emocional interactiva con videos de expertos, podcasts, artículos científicos simplificados, guías descargables en PDF y pruebas psicológicas orientativas con personalización por IA.',
    icon: 'BookOpen',
    gradient: 'from-emerald-600 to-teal-500',
    imagePlaceholder: 'Explora y Aprende'
  },
  {
    id: 'journal',
    number: 'Apartado #2',
    title: 'Diario Emocional Inteligente',
    subtitle: 'Monitoreo diario y registro de voz',
    description: 'Registro emocional diario con selector de ánimo, notas de voz, etiquetas de detonantes, hábitos de sueño, agua y ejercicio, con interpretación automática de patrones por IA.',
    icon: 'PenTool',
    gradient: 'from-teal-500 to-amber-500',
    imagePlaceholder: 'Registro Emocional'
  },
  {
    id: 'analytics',
    number: 'Apartado #3',
    title: 'Análisis Predictivo Avanzado',
    subtitle: 'Métricas de evolución y alertas tempranas',
    description: 'Gráficas semanales y mensuales de evolución, cálculo del Índice de Bienestar Emocional (0-100) y detección preventiva de estrés prolongado o riesgo de agotamiento (burnout).',
    icon: 'TrendingUp',
    gradient: 'from-amber-500 to-orange-500',
    imagePlaceholder: 'Análisis Predictivo'
  },
  {
    id: 'ai',
    number: 'Apartado #4',
    title: 'Asistente Virtual Flux AI',
    subtitle: 'Compañero inteligente 24/7',
    description: 'Chat interactivo 24/7 capaz de guiar meditaciones paso a paso, enseñar respiración consciente con sincronizador visual y sonoro, organizar rutinas y aprender de tu progreso.',
    icon: 'Bot',
    gradient: 'from-emerald-600 via-amber-500 to-orange-500',
    imagePlaceholder: 'Flux AI'
  },
  {
    id: 'alert',
    number: 'Apartado #5',
    title: 'Alerta Emocional Inteligente',
    subtitle: 'Sistema de semáforo y botón SOS',
    description: 'Semáforo de 4 niveles (Estable, Atención, Riesgo Moderado, Riesgo Elevado), ejercicios de anclaje de emergencia (Grounding 5-4-3-2-1) y directorio de líneas psicológicas gratuitas.',
    icon: 'ShieldAlert',
    gradient: 'from-orange-500 to-rose-600',
    imagePlaceholder: 'Alerta Emocional'
  },
  {
    id: 'profile',
    number: 'Apartado #6',
    title: 'Perfil y Personalización',
    subtitle: 'Historial, metas y logros',
    description: 'Experiencia adaptativa según necesidades del usuario: historial continuo, medallas y logros desbloqueables, racha de días conscientes y configuración de preferencias.',
    icon: 'UserCheck',
    gradient: 'from-emerald-600 to-amber-600',
    imagePlaceholder: 'Perfil y Personalización'
  },
  {
    id: 'community',
    number: 'Apartado #7',
    title: 'Comunidad FluxGlow',
    subtitle: 'Espacio seguro y retos compartidos',
    description: 'Foros moderados, grupos de apoyo para jóvenes (15-30 años), retos emocionales colectivos y reacciones empáticas de comprensión mutua sin juzgar.',
    icon: 'Users',
    gradient: 'from-teal-600 to-orange-500',
    imagePlaceholder: 'Comunidad FluxGlow'
  }
];

export const MOCK_COMMUNITY_POSTS = INITIAL_COMMUNITY_POSTS;
export const MOCK_JOURNAL_ENTRIES = INITIAL_EMOTION_ENTRIES;

