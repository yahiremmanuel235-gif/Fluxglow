import { GuideItem, VideoPodcastItem } from '../types';

export const AI_DEMO_NOTICE_TEXT = "🤖 Contenido Demo Generado con IA: Este contenido es un ejemplo demostrativo creado con inteligencia artificial para fines de aprendizaje y bienestar emocional. No sustituye la valoración clínica de un profesional de la salud mental.";

export const DEMO_GUIDES_CATALOG: GuideItem[] = [
  {
    id: 'guide-stress-1',
    badge: 'Domina tu mente',
    title: '5 estrategias infalibles para regular el estrés antes de que te controle',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    category: 'Estrés',
    author: 'Flux AI • Psicología Cognitiva',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Aprende a desactivar la respuesta biológica de alarma en menos de 5 minutos mediante técnicas somáticas, descompresión neurofisiológica y reencuadre cognitivo estructurado.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. La biología del estrés: ¿Por qué el cuerpo reacciona antes que la razón?',
        text: 'Cuando el cerebro percibe sobrecarga o amenaza (sea un plazo de entrega urgente, un conflicto interpersonal o exceso de estímulos), la amígdala envía una señal inmediata al hipotálamo. En fracciones de segundo se liberan cortisol, adrenalina y noradrenalina, incrementando la frecuencia cardíaca, tensando los hombros y restringiendo el flujo sanguíneo a la corteza prefrontal.',
        bulletPoints: [
          'El estrés no regulado reduce la memoria de trabajo y la capacidad de resolución de problemas hasta en un 35%.',
          'Tu cuerpo no distingue entre un peligro físico real y un pensamiento de preocupación futura.',
          'Para recuperar el control racional, es imprescindible enviar primero una señal física de seguridad al sistema nervioso autónomo antes de intentar pensar en positivo.'
        ]
      },
      {
        heading: '2. El Protocolo de Descompresión Somática Rápida (Suspiro Fisiológico)',
        text: 'Descubierto en laboratorios de neurobiología de Stanford, el Suspiro Fisiológico es la forma más rápida y validada por la ciencia para reducir la activación del sistema simpático en tiempo real:',
        bulletPoints: [
          'Paso 1: Realiza una inhalación profunda por la nariz expandiendo el abdomen.',
          'Paso 2: Sin exhalar, toma una segunda inhalación corta por la nariz para inflar los alvéolos colapsados.',
          'Paso 3: Exhala de forma lenta, prolongada y relajada por la boca hasta vaciar completamente los pulmones.',
          'Repetir 3 ciclos reduce la frecuencia cardíaca media en 10-15 latidos por minuto en menos de 90 segundos.'
        ]
      },
      {
        heading: '3. Reencuadre Cognitivo: Separar Hechos de Interpretaciones Catastróficas',
        text: 'Gran parte del desgaste emocional proviene del "diálogo interno catastrofista". Cuando sientas agobio, somete tus pensamientos a tres preguntas filtro:',
        bulletPoints: [
          '¿Tengo evidencia 100% objetiva de que sucederá lo peor, o estoy adivinando el futuro?',
          'Si ocurriera lo que temo, ¿cuál sería el primer paso concreto para afrontarlo?',
          '¿Qué porcentaje de esta situación depende hoy exclusivamente de mis manos y qué porcentaje está fuera de mi control?'
        ]
      },
      {
        heading: '4. La Matriz de Descarga Mental en 3 Columnas',
        text: 'La rumiación mental ocurre cuando el cerebro intenta retener demasiados bucles abiertos en la memoria a corto plazo. Aplica la técnica de vaciado diario:',
        bulletPoints: [
          'Columna A (Lo Urgente Inmediato): Tareas de menos de 5 minutos que puedes resolver ahora mismo para liberar RAM cognitiva.',
          'Columna B (Bajo Mi Control): Plan de acción calendarizado con 1 sola prioridad para las próximas 2 horas.',
          'Columna C (Incertidumbre Pura): Asuntos que dependen del clima, opiniones ajenas o resultados futuros; aprende a soltarlos deliberadamente.'
        ]
      },
      {
        heading: '5. Cierre de Jornada y Transición al Reposo',
        text: 'El estrés crónico se perpetúa cuando no existe una frontera psicológica entre la actividad laboral y el tiempo de recuperación.',
        bulletPoints: [
          'Establece un ritual de cierre diario: anota los logros del día, cierra las pestañas del navegador y apaga notificaciones.',
          'Dedica 10 minutos a una actividad que involucre el cuerpo: caminar sin teléfono, una ducha tibia o estiramientos musculares conscientes.'
        ]
      }
    ],
    glossary: [
      { term: 'Cortisol', definition: 'Hormona esteroidea sintetizada en las glándulas suprarrenales ante estímulos estresantes prolongados.' },
      { term: 'Nervio Vago', definition: 'Par craneal clave que conecta el cerebro con los órganos vitales, responsable de activar la respuesta de calma y digestión.' },
      { term: 'Reencuadre Cognitivo', definition: 'Intervención psicológica que sustituye sesgos automáticos distorsionados por perspectivas racionales y adaptativas.' },
      { term: 'Corteza Prefrontal', definition: 'Región cerebral encargada de la toma de decisiones, la autorregulación emocional y el razonamiento lógico.' }
    ],
    extraTips: [
      'Bebe un vaso de agua fría a pequeños sorbos conscientes cuando sientas que la tensión física sube al cuello.',
      'Programa 2 micro-pausas de 3 minutos en tu jornada laboral para mirar hacia un punto lejano y relajar los ojos.',
      'Sustituye la cafeína vespertina por infusiones de manzanilla, melisa o té rooibos descafeinado.',
      'Lleva una libreta de notas al lado de tu cama para descargar ideas pendientes antes de dormir.'
    ],
    dailyMissions: [
      {
        id: 'mission-stress-1',
        title: 'Práctica del Suspiro Fisiológico',
        description: 'Realiza 3 ciclos de doble inhalación nasal y exhalación larga al mediodía para reiniciar tu sistema nervioso autónomo.',
        timeEstimate: '3 min',
        xp: 30
      },
      {
        id: 'mission-stress-2',
        title: 'Descarga mental en 3 columnas',
        description: 'Escribe en una hoja o nota digital tus preocupaciones del día y clasifícalas en lo que controlas vs lo que no depende de ti.',
        timeEstimate: '5 min',
        xp: 40
      },
      {
        id: 'mission-stress-3',
        title: 'Micro-pausa de horizonte visual',
        description: 'Aléjate de cualquier pantalla durante 4 minutos, mira por una ventana hacia un horizonte lejano y estira cuello y hombros.',
        timeEstimate: '4 min',
        xp: 35
      }
    ]
  },
  {
    id: 'guide-anxiety-2',
    badge: 'El arte de la calma',
    title: 'Cómo transformar la ansiedad en tu mayor motor de enfoque y acción',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    category: 'Ansiedad',
    author: 'Flux AI • Neurociencia Aplicada',
    readTime: '9 min',
    isDemoContent: true,
    simpleSummary: 'La ansiedad no es un defecto personal; es energía fisiológica buscando rumbo. Aprende a canalizarla para actuar con serenidad y determinación.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. Reinterpretar la activación: Del miedo a la energía para actuar',
        text: 'El corazón acelerado, las manos sudorosas y la mente hiperalerta son respuestas biológicas creadas para movilizarte, no para destruirte. La ciencia ha demostrado que cuando una persona etiqueta esa sensación como "mi cuerpo se está preparando para un reto importante" en lugar de "algo malo me va a pasar", el flujo sanguíneo permanece abierto y el rendimiento cognitivo mejora notablemente.',
        bulletPoints: [
          'Nombrar la emoción en voz alta ("Siento inquietud porque esta presentación me importa") reduce la reactividad de la amígdala cerebral.',
          'La energía de la ansiedad puede transformarse en concentración profunda si le das una tarea física inmediata.'
        ]
      },
      {
        heading: '2. El Protocolo de Anclaje Sensorial 5-4-3-2-1',
        text: 'Cuando los pensamientos rumiantes te arrastren a futuros catastróficos imaginarios, el anclaje a través de los cinco sentidos devuelve tu conciencia a la seguridad del aquí y el ahora:',
        bulletPoints: [
          '5 cosas que puedas VER detalladamente a tu alrededor (colores, formas, sombras).',
          '4 cosas que puedas TOCAR o sentir en tu piel (la textura de tu ropa, la firmeza de la silla, el aire en tus manos).',
          '3 cosas que puedas ESCUCHAR (sonidos lejanos, zumbidos suaves, tu propia respiración).',
          '2 cosas que puedas OLER (café, aire fresco, esencia o jabón).',
          '1 cosa que puedas SABOREAR o una respiración profunda sintiendo la gratitud del presente.'
        ]
      },
      {
        heading: '3. El Cuestionario de Desmontaje de Creencias Ansiosas',
        text: 'La ansiedad prospera en la ambigüedad. Cada vez que sientas que "todo saldrá mal", pasa tu pensamiento por la prueba de los hechos:',
        bulletPoints: [
          '¿Cuál es la probabilidad real matemática de que ocurra el peor escenario posible?',
          'Si ocurriera lo que temo, ¿qué recursos he utilizado en el pasado para superar situaciones similares?',
          '¿Cuál es el resultado más probable y realista que ocurrirá?'
        ]
      },
      {
        heading: '4. Tiempo de Preocupación Delimitado (Worry Time)',
        text: 'Intentar "no pensar en lo que me preocupa" provoca el efecto rebote irónico. En su lugar, aplica la técnica del tiempo de preocupación asignado:',
        bulletPoints: [
          'Reserva un bloque diario de 10 minutos (por ejemplo, a las 17:30) exclusivamente para preocuparte y escribir soluciones.',
          'Si una preocupación surge a las 11:00 am, anótala en un papel y di: "La atenderé en mi bloque de las 17:30". Tu mente liberará la urgencia.'
        ]
      }
    ],
    glossary: [
      { term: 'Rumiación', definition: 'Patrón repetitivo y circular de pensamientos centrados en problemas sin orientación a la solución.' },
      { term: 'Anclaje Sensorial', definition: 'Técnica de atención plena que redirige la atención hacia estímulos sensoriales inmediatos para frenar la sobreactivación.' },
      { term: 'Efecto Rebote', definition: 'Fenómeno psicológico donde el intento de suprimir un pensamiento incrementa involuntariamente su frecuencia.' }
    ],
    extraTips: [
      'Evita el café o bebidas energéticas con el estómago vacío si experimentas taquicardias matutinas.',
      'Habla contigo mismo usando tu propio nombre: "Martín, estás a salvo y vamos a resolver esto paso a paso".',
      'Realiza una caminata de 10 minutos al aire libre para disipar el exceso de adrenalina acumulado en las piernas.'
    ],
    dailyMissions: [
      {
        id: 'mission-anxiety-1',
        title: 'Anclaje Sensorial 5-4-3-2-1',
        description: 'Detente durante tu jornada y nombra conscientemente 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.',
        timeEstimate: '4 min',
        xp: 35
      },
      {
        id: 'mission-anxiety-2',
        title: 'Programación de 10 min de Worry Time',
        description: 'Anota en una nota tus preocupaciones del día y resérvalas para atenderlas en un bloque exclusivo de 10 minutos.',
        timeEstimate: '10 min',
        xp: 45
      },
      {
        id: 'mission-anxiety-3',
        title: 'Caminata de descarga de adrenalina',
        description: 'Sal a caminar 8 minutos a paso moderado prestando atención al contacto de tus pies con el suelo.',
        timeEstimate: '8 min',
        xp: 40
      }
    ]
  },
  {
    id: 'guide-procrastination-3',
    badge: 'Acción Imparable',
    title: 'El método anti-procrastinación: Desbloquea tu parálisis por análisis',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    category: 'Procrastinación',
    author: 'Flux AI • Psicología del Comportamiento',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Procrastinar no es pereza ni falta de voluntad, sino un mecanismo de evitación emocional frente a la incomodidad o el perfeccionismo.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. La verdadera raíz de postergar: Regulación del estado de ánimo',
        text: 'La neurociencia del comportamiento ha demostrado que postergamos tareas no porque no nos importe el resultado, sino porque la tarea evoca emociones displacenteras inmediatas: miedo a no hacerlo perfecto, aburrimiento, frustración o confusión sobre por dónde empezar. Para aliviar esa tensión a corto plazo, el cerebro busca dopamina rápida en redes sociales o tareas irrelevantes.',
        bulletPoints: [
          'Perdonarte por haber procrastinado en el pasado reduce en un 60% la probabilidad de volver a postergar en el presente.',
          'La meta no es eliminar la pereza, sino reducir la fricción del primer paso.'
        ]
      },
      {
        heading: '2. La Regla de los 5 Minutos y Micro-pasos Ridículamente Fáciles',
        text: 'La mayor resistencia psicológica ocurre antes de comenzar. Una vez que superas los primeros 3 a 5 minutos de actividad, el cerebro entra en inercia de trabajo gracias al Efecto Zeigarnik:',
        bulletPoints: [
          'Haz un pacto contigo mismo: "Solo trabajaré en esta tarea durante 5 minutos. Si al terminar sigo exhausto, me permitiré parar".',
          'Reduce el primer paso a algo ridículamente pequeño: Si tienes que redactar un informe, el paso 1 es solo abrir el procesador de texto y escribir el título.'
        ]
      },
      {
        heading: '3. El Sistema de Bloques Sagrados (Timeboxing de 25 min)',
        text: 'Trabajar con metas abiertas ("voy a estudiar toda la tarde") agota tu energía mental. El timeboxing define fronteras claras:',
        bulletPoints: [
          'Pon un temporizador visible de 25 minutos con celular en otra habitación o en modo avión.',
          'Una sola pestaña activa en tu navegador.',
          'Al sonar la campana, toma 5 minutos de descanso genuino sin consumir contenido de alta estimulación.'
        ]
      },
      {
        heading: '4. Diseña tu Entorno para el Éxito',
        text: 'La fuerza de voluntad es un recurso limitado. El diseño del entorno ahorra energía de decisión:',
        bulletPoints: [
          'Deja tu escritorio despejado y con las herramientas listas desde la noche anterior.',
          'Acepta una versión "borrador imperfecto": la excelencia se logra editando, no bloqueándose frente a la hoja en blanco.'
        ]
      }
    ],
    glossary: [
      { term: 'Fricción de Activación', definition: 'La energía psicológica requerida para vencer la inercia e iniciar una tarea.' },
      { term: 'Efecto Zeigarnik', definition: 'Tendencia de la mente a recordar y querer completar tareas iniciadas antes que las no comenzadas.' },
      { term: 'Timeboxing', definition: 'Estrategia de productividad que asigna ventanas temporales fijas y cerradas a actividades específicas.' }
    ],
    extraTips: [
      'Empieza tu jornada resolviendo tu tarea "sapo" (la más temida) antes de abrir tu bandeja de correos.',
      'Recompénsate inmediatamente después de un bloque de enfoque completado.',
      'Divide proyectos grandes en listas de chequeo con verbos de acción concretos.'
    ],
    dailyMissions: [
      {
        id: 'mission-procrastination-1',
        title: 'Micro-bloque de 15 minutos sin distracciones',
        description: 'Elige la tarea que más has postergado esta semana y trabájala durante 15 minutos exactos con temporizador y sin móvil.',
        timeEstimate: '15 min',
        xp: 45
      },
      {
        id: 'mission-procrastination-2',
        title: 'Desglose de tarea en 3 micro-pasos',
        description: 'Toma un objetivo pendiente y divídelo en 3 acciones tan sencillas que no puedas negarte a hacer la primera.',
        timeEstimate: '4 min',
        xp: 35
      },
      {
        id: 'mission-procrastination-3',
        title: 'Preparación de espacio de trabajo para mañana',
        description: 'Dedica 5 minutos a despejar tu mesa y dejar abierto el documento principal en el que trabajarás al despertar.',
        timeEstimate: '5 min',
        xp: 30
      }
    ]
  },
  {
    id: 'guide-selfesteem-4',
    badge: 'Mentalidad Fuerte',
    title: 'Construyendo un autoesquema sólido: De la autocrítica a la autocompasión',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    category: 'Autoestima',
    author: 'Flux AI • Desarrollo Emocional',
    readTime: '9 min',
    isDemoContent: true,
    simpleSummary: 'Aprende a transformar la voz crítica interna en un diálogo de apoyo realista y compasivo que fortalezca tu valor personal incondicional.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. Los 3 Pilares de la Autocompasión Consciente (Kristin Neff)',
        text: 'La autocompasión no es debilidad ni victimismo; es brindarte el mismo trato empático, comprensivo y firme que le ofrecerías a una persona que amas profundamente cuando atraviesa un mal momento.',
        bulletPoints: [
          'Bondad hacia uno mismo: Reemplazar el juicio despiadado por un tono comprensivo y motivador.',
          'Humanidad compartida: Recordar que equivocarse, dudar y sentir dolor son experiencias universales que nos conectan con los demás.',
          'Mindfulness equilibrado: Observar las emociones difíciles sin magnificarlas ni negarlas.'
        ]
      },
      {
        heading: '2. Diario de Evidencias de Competencia y Logros Reales',
        text: 'Nuestra mente posee un sesgo de negatividad evolutivo que recuerda con intensidad las críticas y olvida con rapidez las victorias. Llevar un registro activo restablece la objetividad del cerebro:',
        bulletPoints: [
          'Anota cada noche 3 acciones en las que demostraste valentía, esfuerzo o empatía.',
          'Incluye logros que no dependan de la validación externa (por ejemplo: "hoy me respeté a mí mismo al decir que no").'
        ]
      },
      {
        heading: '3. El Arte de Poner Límites Asertivos sin Culpa',
        text: 'La autoestima se erosiona cuando complaces a los demás a expensas de tu salud mental. Decir un "no" consciente es proteger tu integridad:',
        bulletPoints: [
          'Usa la fórmula asertiva: "Agradezco que hayas pensado en mí, pero en este momento no cuento con el tiempo/energía para comprometerme como te mereces".',
          'Recuerda: No necesitas justificaciones excesivas para cuidar tus tiempos.'
        ]
      },
      {
        heading: '4. Neutralizar el Síndrome del Impostor',
        text: 'Dudar de tus capacidades cuando asumes nuevos retos es síntoma de crecimiento, no de incapacidad:',
        bulletPoints: [
          'Reformula: "No soy un fraude; simplemente estoy en la curva de aprendizaje de algo nuevo".',
          'Pide retroalimentación constructiva a mentores o compañeros en lugar de asumir lo peor.'
        ]
      }
    ],
    glossary: [
      { term: 'Autoesquema', definition: 'Red cognitiva de creencias, recuerdos e interpretaciones sobre la propia valía y capacidades.' },
      { term: 'Sesgo de Negatividad', definition: 'Tendencia cerebral involuntaria a dar más peso a las experiencias y pensamientos desfavorables.' },
      { term: 'Asertividad', definition: 'Habilidad de comunicar opiniones y límites de forma clara, respetuosa y sin agresividad ni sumisión.' }
    ],
    extraTips: [
      'Cuando te sorprendas hablándote mal, pregúntate: "¿Le hablaría así a mi mejor amigo?".',
      'Desconéctate temporalmente de perfiles en redes sociales que detonen comparaciones tóxicas.',
      'Celebra las pequeñas victorias diarias por sencillas que parezcan.'
    ],
    dailyMissions: [
      {
        id: 'mission-selfesteem-1',
        title: 'Registro de 3 Evidencias de Logro',
        description: 'Escribe 3 cosas concretas de las que te sientas orgulloso de ti hoy, sin importar su tamaño.',
        timeEstimate: '4 min',
        xp: 35
      },
      {
        id: 'mission-selfesteem-2',
        title: 'Práctica de Límites Asertivos',
        description: 'Identifica una petición o hábito que drene tu energía y pon un límite claro o di un no respetuoso hoy.',
        timeEstimate: '5 min',
        xp: 40
      },
      {
        id: 'mission-selfesteem-3',
        title: 'Carta breve de autocompasión',
        description: 'Escribe un párrafo reconociendo un error reciente con palabras de aliento y cariño hacia ti mismo.',
        timeEstimate: '6 min',
        xp: 45
      }
    ]
  },
  {
    id: 'guide-productivity-5',
    badge: 'Enfoque Blindado',
    title: 'Deep Work & Enfoque blindado en un mundo de hiperestimulación digital',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    category: 'Productividad Consciente',
    author: 'Flux AI • Rendimiento Cognitivo',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Descubre cómo blindar tu atención, eliminar el costo del cambio de contexto y multiplicar tu impacto dedicando menos horas al agotamiento.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. El costo invisible del Residuo de Atención',
        text: 'Cada vez que cambias de ventana para revisar un mensaje de WhatsApp o un correo electrónico durante apenas 10 segundos, tu mente deja una fracción de su capacidad anclada en esa interrupción. Tardas entre 15 y 22 minutos en recuperar la profundidad original de pensamiento.',
        bulletPoints: [
          'La multitarea es un mito biológico: el cerebro no procesa dos tareas cognitivas a la vez, sino que salta rápidamente entre ellas con un enorme coste energético.',
          'Agrupar la comunicación en horarios específicos libera hasta 3 horas de foco puro al día.'
        ]
      },
      {
        heading: '2. Ritmos Ultradianos y Descanso Inteligente',
        text: 'Nuestra biología cerebral opera en ciclos ultradianos de aproximadamente 90 minutos de alta lucidez seguidos de una caída natural de energía:',
        bulletPoints: [
          'Estructura tu jornada en bloques de 75 a 90 minutos de concentración profunda.',
          'Acompaña cada bloque con 10 a 15 minutos de descanso sin pantallas (caminar, hidratarte, estiramientos).'
        ]
      },
      {
        heading: '3. Las 4 Reglas del Deep Work',
        text: 'Implementa estas directrices para elevar la calidad de tus resultados:',
        bulletPoints: [
          'Regla 1: Trabaja profundamente en una sola tarea a la vez.',
          'Regla 2: Abraza el aburrimiento; no recurras al teléfono en cada momento de espera.',
          'Regla 3: Sal del modo reactivo; programa tus horas de mayor energía para crear, no para responder mensajes.',
          'Regla 4: Apaga el trabajo al final de la jornada de forma tajante.'
        ]
      }
    ],
    glossary: [
      { term: 'Residuo de Atención', definition: 'Efecto cognitivo por el cual restos de una tarea interrumpida entorpecen la concentración en la siguiente.' },
      { term: 'Deep Work', definition: 'Actividades profesionales o académicas realizadas en un estado de concentración sin distracciones que llevan las capacidades al límite.' },
      { term: 'Ritmo Ultradiano', definition: 'Ciclo biológico recurrente de 90 a 120 minutos que modula la atención y la alerta mental.' }
    ],
    extraTips: [
      'Trabaja con un vaso de agua en el escritorio para mantener la hidratación neuronal.',
      'Activa el modo escala de grises en tu smartphone durante las horas de trabajo para reducir su atractivo visual.',
      'Ten a mano una libreta para anotar ideas repentinas sin salir de tu tarea principal.'
    ],
    dailyMissions: [
      {
        id: 'mission-productivity-1',
        title: 'Bloque de Deep Work de 45 minutos',
        description: 'Realiza 45 minutos de trabajo ininterrumpido en tu tarea principal con teléfono silenciado en otra habitación.',
        timeEstimate: '45 min',
        xp: 50
      },
      {
        id: 'mission-productivity-2',
        title: 'Loteo de mensajes en 2 horarios',
        description: 'Revisa y responde mensajes únicamente en dos momentos definidos del día en lugar de hacerlo en tiempo real.',
        timeEstimate: '15 min',
        xp: 35
      },
      {
        id: 'mission-productivity-3',
        title: 'Pausa de recarga sin pantallas',
        description: 'Toma una pausa de 10 minutos al mediodía para caminar o estirarte sin mirar ningún dispositivo.',
        timeEstimate: '10 min',
        xp: 35
      }
    ]
  },
  {
    id: 'guide-sleep-6',
    badge: 'Noches Profundas',
    title: 'Higiene del sueño: El protocolo definitivo para un descanso reparador',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    category: 'Sueño Reparador',
    author: 'Flux AI • Medicina del Sueño',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Alinea tu reloj circadiano y apaga el ruido mental nocturno con hábitos basados en la neurobiología del descanso profundo.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. La neuroquímica del descanso: Melatonina, Adenosina y Luz Azul',
        text: 'Durante el día acumulamos adenosina en el cerebro, lo que genera presión de sueño. Al caer la noche, la glándula pineal sintetiza melatonina en respuesta a la oscuridad para iniciar el descanso. Sin embargo, la luz azul de teléfonos y ordenadores suprime este proceso, engañando a tu sistema biológico.',
        bulletPoints: [
          'La exposición a pantallas antes de dormir retrasa la fase REM hasta en 90 minutos.',
          'La luz solar natural en los primeros 30 minutos tras despertar es el sincronizador más potente del ritmo circadiano.'
        ]
      },
      {
        heading: '2. Temperatura y Santuario del Sueño',
        text: 'Para conciliar el sueño profundo, la temperatura central del cuerpo debe descender aproximadamente 1°C:',
        bulletPoints: [
          'Mantén tu habitación fresca (entre 18°C y 20°C) y completamente a oscuras.',
          'Una ducha tibia 60 minutos antes de acostarte ayuda a disipar calor hacia las extremidades, acelerando el adormecimiento.',
          'Asocia tu cama exclusivamente con el descanso y la intimidad; no trabajes ni mires series en ella.'
        ]
      },
      {
        heading: '3. Protocolo de Desconexión 3-2-1',
        text: 'Sigue esta pauta para preparar cuerpo y mente antes de dormir:',
        bulletPoints: [
          '3 horas antes: Última comida fuerte y sin alcohol ni cafeína.',
          '2 horas antes: Detener el trabajo cognitivo exigente.',
          '1 hora antes: Apagar todas las pantallas y sustituirlas por lectura en luz tenue, audio suave o meditación.'
        ]
      },
      {
        heading: '4. Manejo del Insomnio por Rumiación Nocturna',
        text: 'Si te despiertas a las 3:00 am con pensamientos acelerados:',
        bulletPoints: [
          'No te quedes dando vueltas más de 20 minutos en la cama. Levántate con luz tenue, siéntate en un sillón y lee un libro tranquilo.',
          'Vuelve a la cama solo cuando sientas pesadez en los párpados.'
        ]
      }
    ],
    glossary: [
      { term: 'Ritmo Circadiano', definition: 'Ciclo biológico interno de 24 horas que regula los patrones de sueño, vigilia, temperatura corporal y hormonas.' },
      { term: 'Melatonina', definition: 'Neurohormona que induce el sueño liberada en la oscuridad por la glándula pineal.' },
      { term: 'Presión de Sueño (Adenosina)', definition: 'Sustancia química que se acumula en el cerebro durante la vigilia e induce cansancio.' }
    ],
    extraTips: [
      'Mantén un horario regular para levantarte los 7 días de la semana, incluso los fines de semana.',
      'Evita la cafeína después de las 14:00 horas si eres sensible a los estimulantes.',
      'Usa cortinas opacas o un antifaz cómodo para bloquear la contaminación lumínica exterior.'
    ],
    dailyMissions: [
      {
        id: 'mission-sleep-1',
        title: 'Desconexión digital 45 min antes de dormir',
        description: 'Apaga teléfonos, tablets y televisores 45 minutos antes de acostarte y sustitúyelos por lectura en papel o música suave.',
        timeEstimate: '45 min',
        xp: 40
      },
      {
        id: 'mission-sleep-2',
        title: '10 min de luz natural matutina',
        description: 'Toma luz solar directa en tu rostro o balcón durante 10 minutos por la mañana para calibrar tu reloj biológico.',
        timeEstimate: '10 min',
        xp: 35
      },
      {
        id: 'mission-sleep-3',
        title: 'Vaciado nocturno de pendientes',
        description: 'Anota en un cuaderno 3 asuntos resueltos hoy y 2 prioridades para mañana antes de apagar la luz.',
        timeEstimate: '5 min',
        xp: 30
      }
    ]
  },
  {
    id: 'guide-mindfulness-7',
    badge: 'Paz en el Presente',
    title: 'Mindfulness para el día a día: Cómo apagar el sobrepensamiento en 5 minutos',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    category: 'Mindfulness',
    author: 'Flux AI • Meditación y Presencia',
    readTime: '7 min',
    isDemoContent: true,
    simpleSummary: 'La atención plena no consiste en dejar la mente en blanco, sino en aprender a observar tus pensamientos sin reaccionar impulsivamente ante ellos.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. Desactivar la Red Neuronal por Defecto (DMN)',
        text: 'Cuando el cerebro no está enfocado en una acción presente, la Red por Defecto se activa de forma automática, llevándonos a rumiar sobre el pasado o preocuparnos por el futuro. El mindfulness actúa como un interruptor fisiológico que silencia este ruido mental dirigiendo la atención a las sensaciones físicas inmediatas.',
        bulletPoints: [
          'La atención plena aumenta la densidad de materia gris en el hipocampo (área de memoria y regulación emocional).',
          'No buscas frenar los pensamientos, sino cambiar tu relación con ellos: verlos como nubes que cruzan el cielo sin aferrarte a ninguna.'
        ]
      },
      {
        heading: '2. Micro-práctica de Respiración Triangular (Box Breathing)',
        text: 'Utilizada por médicos y atletas de alto rendimiento para restablecer la calma en segundos:',
        bulletPoints: [
          'Inhala en 4 tiempos llenando pulmones y abdomen.',
          'Sostén el aire suavemente durante 4 tiempos.',
          'Exhala lentamente durante 4 tiempos.',
          'Pausa con pulmones vacíos durante 4 tiempos.',
          'Repite durante 5 ciclos completos para sentir la distensión muscular.'
        ]
      },
      {
        heading: '3. Alimentación y Acciones Cotidianas Conscientes',
        text: 'No necesitas aislarte en un monasterio para cultivar presencia. Integra el mindfulness en tus rutinas:',
        bulletPoints: [
          'Come los primeros 5 bocados de tu almuerzo en silencio, apreciando aroma, textura y temperatura.',
          'Al lavarte las manos o ducharte, siente el fluir del agua tibia como un acto de autocuidado presente.'
        ]
      }
    ],
    glossary: [
      { term: 'Red Neuronal por Defecto (DMN)', definition: 'Red cerebral asociada con el diálogo interno autorreferencial, el sobrepensamiento y la distracción.' },
      { term: 'Atención Plena (Mindfulness)', definition: 'Conciencia voluntaria de la experiencia presente con apertura, curiosidad y sin emitir juicios.' },
      { term: 'Descentramiento Cognitivo', definition: 'Capacidad de observar los pensamientos como eventos mentales pasajeros en lugar de verdades absolutas.' }
    ],
    extraTips: [
      'Establece una alarma sutil al mediodía para hacer 3 respiraciones profundas y chequear cómo está tu cuerpo.',
      'Camina prestando atención al balanceo natural de tus brazos y el apoyo de tus talones.',
      'Sonríe suavemente al notar que te habías distraído; notar la distracción ES el momento de presencia.'
    ],
    dailyMissions: [
      {
        id: 'mission-mindfulness-1',
        title: '5 Minutos de Pausa Respiratoria Consciente',
        description: 'Siéntate en postura cómoda, cierra los ojos y realiza 5 ciclos de respiración cuadrada 4-4-4-4.',
        timeEstimate: '5 min',
        xp: 35
      },
      {
        id: 'mission-mindfulness-2',
        title: 'Comida consciente (primeros 5 bocados)',
        description: 'Disfruta de tus primeros 5 bocados sin pantallas, saboreando conscientemente cada textura y aroma.',
        timeEstimate: '5 min',
        xp: 30
      },
      {
        id: 'mission-mindfulness-3',
        title: 'Escaneo corporal rápido de 3 minutos',
        description: 'Recorre mentalmente desde tus pies hasta tu cabeza liberando la tensión acumulada en mandíbula y hombros.',
        timeEstimate: '3 min',
        xp: 35
      }
    ]
  },
  {
    id: 'guide-eq-8',
    badge: 'Maestría Emocional',
    title: 'Inteligencia Emocional en la práctica: Cómo regular tus reacciones y comunicarte con claridad',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    category: 'Inteligencia Emocional',
    author: 'Flux AI • Inteligencia Afectiva',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Aprende a identificar con precisión tus estados afectivos, pausar antes de reaccionar impulsivamente y expresar tus necesidades sin agresión ni sumisión.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. Alfabetización Emocional: Nombrar para Calmar (Name it to Tame it)',
        text: 'Los estudios de neuroimagen demuestran que cuando una persona nombra con exactitud lo que siente (por ejemplo: "Siento decepción y frustración", en lugar de un genérico "estoy mal"), la actividad en la amígdala disminuye y se activa la corteza prefrontal dorsolateral, facilitando el autocontrol.',
        bulletPoints: [
          'Amplía tu vocabulario emocional más allá de "bien" o "mal". Distingue entre irritación, impotencia, nostalgia o desgana.',
          'Las emociones son datos, no directivas: sentir enojo no te obliga a atacar; sentir miedo no te obliga a huir.'
        ]
      },
      {
        heading: '2. La Pausa Sagrada de 6 Segundos entre el Estímulo y la Respuesta',
        text: 'La cascada neuroquímica de una emoción intensa dura aproximadamente 6 segundos en recorrer el torrente sanguíneo. Si logras retrasar tu reacción durante esa breve ventana, recuperas la capacidad de responder conscientemente en vez de reaccionar en piloto automático:',
        bulletPoints: [
          'Ante un detonante, inhala profundo y cuenta mentalmente del 1 al 6 prestando atención al aire entrando por tu nariz.',
          'Hazte la pregunta clave: "¿Esta respuesta que estoy a punto de dar me acerca a la persona que quiero ser o solo busca descargar mi molestia?".'
        ]
      },
      {
        heading: '3. Escucha Empática y Validación Afectiva',
        text: 'La mayoría de las personas escuchan para responder, no para comprender. La verdadera conexión ocurre cuando validas la experiencia del otro sin apresurarte a solucionar su problema ni juzgar lo que siente.',
        bulletPoints: [
          'Usa frases de validación: "Tiene sentido que te sientas así dada la situación" o "¿Quieres que te escuche y te acompañe o prefieres buscar soluciones?".',
          'Evita el positivismo tóxico ("No pasa nada", "Podría ser peor"); permite que la otra persona exprese su vulnerabilidad.'
        ]
      },
      {
        heading: '4. Comunicación Asertiva en Primera Persona (Fórmula XYZ)',
        text: 'Expresa desacuerdos y necesidades sin generar actitudes defensivas:',
        bulletPoints: [
          'Fórmula: "Cuando ocurre X (hecho observable sin juicios), me siento Y (emoción propia), y me gustaría / necesitaría Z (petición concreta en positivo)".',
          'Sustituye las acusaciones ("Tú nunca me escuchas") por declaraciones sobre tu experiencia ("Cuando miras el móvil mientras hablo, me siento ignorado").'
        ]
      }
    ],
    glossary: [
      { term: 'Alfabetización Emocional', definition: 'Capacidad de identificar, categorizar y verbalizar con precisión matices afectivos y sensaciones internas.' },
      { term: 'Secuestro Amigdalino', definition: 'Reacción emocional inmediata e intensa que anula momentáneamente el control lógico de la corteza prefrontal.' },
      { term: 'Validación Emocional', definition: 'Reconocimiento y aceptación legítima de las emociones de otra persona sin juzgarlas ni minimizarlas.' },
      { term: 'Fórmula XYZ', definition: 'Estructura lingüística de asertividad que comunica hechos, emociones y peticiones sin culpar al interlocutor.' }
    ],
    extraTips: [
      'Haz un chequeo interno 2 veces al día preguntándote: "¿Qué emoción está presente en mi cuerpo ahora mismo?".',
      'Respira hondo 3 veces antes de responder un correo o mensaje que te haya generado molestia.',
      'Sustituye la palabra "pero" por "y" en conversaciones difíciles para sumar perspectivas en lugar de invalidar la del otro.',
      'Recuerda que validar una emoción ajena no significa necesariamente estar de acuerdo con su conducta.'
    ],
    dailyMissions: [
      {
        id: 'mission-eq-1',
        title: 'Práctica de la Pausa de 6 Segundos',
        description: 'Aplica una pausa consciente de 6 segundos ante el primer momento de irritación o prisa que surja hoy.',
        timeEstimate: '2 min',
        xp: 35
      },
      {
        id: 'mission-eq-2',
        title: 'Check-in de Alfabetización Emocional',
        description: 'Identifica con exactitud 3 emociones concretas que experimentes durante tu jornada y regístralas en tu diario.',
        timeEstimate: '4 min',
        xp: 40
      },
      {
        id: 'mission-eq-3',
        title: 'Escucha activa sin dar consejos rápidos',
        description: 'En tu próxima conversación, escucha atentamente a la otra persona durante 3 minutos sin interrumpir ni ofrecer soluciones inmediatas.',
        timeEstimate: '5 min',
        xp: 45
      }
    ]
  },
  {
    id: 'guide-grief-9',
    badge: 'Abrazar el Proceso',
    title: 'Navegar el duelo y la pérdida: Procesar el dolor sin apresurar tus tiempos',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    category: 'Duelo y Pérdida',
    author: 'Flux AI • Tanatología y Acompañamiento',
    readTime: '9 min',
    isDemoContent: true,
    simpleSummary: 'El duelo no es una enfermedad que deba curarse de inmediato, sino un proceso biológico y psicológico natural para asimilar cambios, despedidas y vacíos significativos.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. La naturaleza no lineal del dolor emocional',
        text: 'La concepción popular de que el duelo sigue etapas ordenadas y lineales ha sido superada por la psicología moderna. El duelo oscila como las olas del mar: días de relativa calma se intercalan con momentos de tristeza aguda, confusión o enojo. Ambas orillas son normales y necesarias para la cicatrización interna.',
        bulletPoints: [
          'No te juzgues por reírte o disfrutar en un momento dado: la alegría no anula tu amor ni tu respeto por lo que perdiste.',
          'No te presiones con cronogramas ajenos; cada mente metaboliza la ausencia a su propio ritmo.'
        ]
      },
      {
        heading: '2. Rituales de despedida y honra del legado',
        text: 'El cerebro necesita actos simbólicos tangibles para asimilar el cierre de una etapa, vínculo o presencia física:',
        bulletPoints: [
          'Escribe una carta de gratitud y desahogo expresando todo aquello que quedó pendiente, sin censuras.',
          'Crea un espacio o momento simbólico (encender una vela, plantar una semilla, visitar un lugar especial) para conectar con el recuerdo desde la paz.'
        ]
      },
      {
        heading: '3. Autocompasión y manejo de la fatiga del duelo',
        text: 'Procesar una pérdida consume una inmensa cantidad de glucosa cerebral y energía física. Es habitual sentir pesadez corporal, niebla mental y dificultades de concentración:',
        bulletPoints: [
          'Reduce las exigencias en tareas accesorias y prioriza los básicos biológicos: sueño, hidratación y caminatas suaves.',
          'Rodéate de personas que sepan sostener el silencio contigo sin necesidad de recitar frases hechas o consejos no solicitados.'
        ]
      },
      {
        heading: '4. Resignificación: Construir un nuevo sentido de vida',
        text: 'Superar un duelo no significa olvidar, sino integrar la experiencia en tu biografía personal:',
        bulletPoints: [
          'Pregúntate: "¿Qué valores, aprendizajes o memorias hermosas puedo honrar a través de mis acciones presentes?".',
          'Date permiso para volver a proyectar metas futuras conservando el amor intacto en tu interior.'
        ]
      }
    ],
    glossary: [
      { term: 'Duelo Adaptativo', definition: 'Respuesta psicológica y emocional natural ante la pérdida significativa de un ser querido, relación o etapa vital.' },
      { term: 'Modelo Dual del Duelo', definition: 'Teoría que explica cómo alternamos sanamente entre la orientación a la pérdida (dolor) y la orientación a la restauración (vida cotidiana).' },
      { term: 'Resignificación', definition: 'Proceso cognitivo de encontrar un propósito o significado trascendente a partir de vivencias difíciles.' },
      { term: 'Niebla del Duelo', definition: 'Sensación temporal de fatiga cognitiva, desorientación y lentitud mental provocada por el desgaste emocional.' }
    ],
    extraTips: [
      'Permítete llorar sin pedir disculpas: el llanto libera endorfinas y oxitocina que calman el dolor físico y emocional.',
      'Ten una libreta para escribir pensamientos sueltos cuando la nostalgia aparezca en la noche.',
      'No temas hablar de lo que sientes con profesionales o grupos de apoyo cuando sientas que la carga excede tus fuerzas.',
      'Pasa tiempo en contacto con la naturaleza para recordar los ciclos de renovación continua de la vida.'
    ],
    dailyMissions: [
      {
        id: 'mission-grief-1',
        title: 'Carta de desahogo y liberación',
        description: 'Dedica 8 minutos a escribir tus emociones sin filtros en un papel, honrando lo que sientes hoy.',
        timeEstimate: '8 min',
        xp: 45
      },
      {
        id: 'mission-grief-2',
        title: 'Paseo de conexión natural y silencio',
        description: 'Camina 10 minutos al aire libre observando el entorno en silencio y respirando con suavidad.',
        timeEstimate: '10 min',
        xp: 35
      },
      {
        id: 'mission-grief-3',
        title: 'Acto de autocuidado consciente',
        description: 'Prepárate una comida caliente, una infusión o date un baño tibio como gesto de cariño hacia ti.',
        timeEstimate: '15 min',
        xp: 40
      }
    ]
  },
  {
    id: 'guide-relationships-10',
    badge: 'Vínculos Nutritivos',
    title: 'Límites afectivos y apego seguro: Cómo cultivar relaciones sanas y conscientes',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    category: 'Relaciones Sanas',
    author: 'Flux AI • Psicología Vincular',
    readTime: '8 min',
    isDemoContent: true,
    simpleSummary: 'Descubre cómo construir vínculos afectivos basados en la confianza recíproca, el respeto a los espacios individuales y la asertividad sin temor al rechazo.',
    demoNotice: AI_DEMO_NOTICE_TEXT,
    explainedContent: [
      {
        heading: '1. Comprendiendo los estilos de apego en la vida adulta',
        text: 'Nuestra forma de vincularnos está moldeada por experiencias tempranas de seguridad o incertidumbre. Reconocer si tiendes hacia el apego ansioso (miedo al abandono) o evitativo (miedo a la intimidad) es el primer paso para cultivar un apego seguro basado en la confianza y el diálogo transparente.',
        bulletPoints: [
          'El apego seguro no teme la cercanía ni la autonomía: disfruta de compartir sin perder la identidad propia.',
          'Las necesidades afectivas son legítimas; comunicarlas con claridad evita malos entendidos y rencores acumulados.'
        ]
      },
      {
        heading: '2. Poner límites afectivos claros sin culpa',
        text: 'Los límites no son murallas para aislarte ni armas para castigar; son las puertas y ventanas que permiten relaciones sanas:',
        bulletPoints: [
          'Un "no" respetuoso a una petición que sobrepasa tu energía es un "sí" a tu estabilidad emocional.',
          'Las personas que realmente te aprecian respetarán tus límites; quienes se molesten se beneficiaban de tu falta de fronteras.'
        ]
      },
      {
        heading: '3. El arte de la reparación tras un desacuerdo',
        text: 'Las relaciones duraderas y sólidas no son aquellas que nunca tienen conflictos, sino aquellas que saben repararlos con madurez:',
        bulletPoints: [
          'Asume tu parte de responsabilidad sin excusas: "Lamento haber levantado la voz antes, estaba abrumado pero no es excusa".',
          'Enfócate en resolver el problema en equipo ("Tú y yo contra el problema"), no en ganar una batalla egoica.'
        ]
      }
    ],
    glossary: [
      { term: 'Apego Seguro', definition: 'Patrón de vinculación caracterizado por la confianza mutua, la comodidad con la intimidad y la capacidad de comunicar necesidades.' },
      { term: 'Límites Asertivos', definition: 'Fronteras psicológicas y físicas comunicadas con respeto para preservar la dignidad y el bienestar personal.' },
      { term: 'Reparación Vincular', definition: 'Acciones voluntarias orientadas a restablecer la armonía, la confianza y la sintonía tras un desacuerdo.' },
      { term: 'Diferenciación del Yo', definition: 'Capacidad de mantener la propia identidad y calma emocional mientras se permanece conectado con los demás.' }
    ],
    extraTips: [
      'Comunica tus expectativas directamente en lugar de asumir que la otra persona debería "adivinarlas".',
      'Celebra los éxitos de tus seres queridos con entusiasmo genuino: fortalece el vínculo afectivo de forma exponencial.',
      'Programa momentos de calidad sin pantallas para conversar cara a cara con las personas que te importan.'
    ],
    dailyMissions: [
      {
        id: 'mission-relationships-1',
        title: 'Expresión directa de una necesidad afectiva',
        description: 'Comunica hoy a alguien de tu confianza un deseo o agradecimiento concreto de forma transparente.',
        timeEstimate: '3 min',
        xp: 35
      },
      {
        id: 'mission-relationships-2',
        title: 'Poner un límite respetuoso',
        description: 'Di un "no" amable pero firme a un compromiso o demanda que comprometa tu descanso o tranquilidad.',
        timeEstimate: '2 min',
        xp: 40
      },
      {
        id: 'mission-relationships-3',
        title: 'Mensaje de aprecio sincero',
        description: 'Envía un mensaje detallando una cualidad que valoras profundamente en un amigo, colega o familiar.',
        timeEstimate: '4 min',
        xp: 35
      }
    ]
  }
];

export const POPULAR_GUIDES_CATALOG: GuideItem[] = DEMO_GUIDES_CATALOG.slice(4).concat(DEMO_GUIDES_CATALOG.slice(0, 4));

export const VERIFIED_MEDIA_CATALOG: VideoPodcastItem[] = [
  {
    id: 'media-1',
    title: 'Las GRANDES MENTIRAS sobre el TRAUMA PSICOLÓGICO y la TERAPIA EMDR ~ ...',
    author: 'Alejandro Santos',
    duration: '1:24:19',
    views: '5.9 K vistas',
    timeAgo: 'hace 6 meses',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    type: 'podcast',
    category: 'Ansiedad',
    description: 'Conversación profunda con el especialista Alejandro Santos sobre la neurobiología del trauma, cómo se almacena en el cuerpo y los mitos de la terapia EMDR.'
  },
  {
    id: 'media-2',
    title: 'Cómo tener confianza en uno mismo - Walter Riso | Oficial',
    author: 'Walter Riso',
    duration: '13:23',
    views: '12 K vistas',
    timeAgo: 'hace 4 días',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    type: 'video',
    category: 'Autoestima',
    description: 'El célebre psicólogo clínico Walter Riso expone los 4 pilares fundamentales del autoesquema: autoeficacia, autoconcepto, autoimagen y autorrefuerzo.'
  },
  {
    id: 'media-3',
    title: '¿Por qué nos acercamos siempre al mismo tipo de persona, aunque no nos beneficie?',
    author: 'Marian Rojas Estapé',
    duration: '2:42',
    views: '86 K vistas',
    timeAgo: 'hace 3 años',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    type: 'video',
    category: 'Relaciones Sanas',
    description: 'La psiquiatra Marian Rojas Estapé analiza los patrones de apego y la necesidad inconsciente de reparar heridas de la infancia en las relaciones presentes.'
  },
  {
    id: 'media-4',
    title: 'Por qué cada vez hay más depresión y ansiedad | José Luis Marín, psiquiatra',
    author: 'AprendemosJuntos ✓ y José Luis Marín',
    duration: '1:20:51',
    views: '335 K vistas',
    timeAgo: 'hace 1 mes',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    type: 'podcast',
    category: 'Estrés',
    description: 'El psiquiatra José Luis Marín aborda el impacto de la hiperconectividad, la soledad moderna y cómo cultivar recursos psicológicos de contención.'
  },
  {
    id: 'media-5',
    title: 'Inteligencia Emocional y Gestión del Enfado en el Trabajo y la Vida Cotidiana',
    author: 'Dra. Elsa Punset',
    duration: '18:40',
    views: '112 K vistas',
    timeAgo: 'hace 2 meses',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    type: 'video',
    category: 'Inteligencia Emocional',
    description: 'Herramientas de neurociencia afectiva para regular la reactividad y transformar emociones desafiantes en claridad comunicativa.'
  },
  {
    id: 'media-6',
    title: 'El Duelo Consciente: Cómo acompañar y procesar despedidas difíciles',
    author: 'Lic. Patricia Villalobos',
    duration: '32:15',
    views: '45 K vistas',
    timeAgo: 'hace 5 meses',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    type: 'podcast',
    category: 'Duelo y Pérdida',
    description: 'Acompañamiento tanatológico compasivo para afrontar transiciones, vacíos emocionales y pérdidas significativas sin culpa.'
  }
];
