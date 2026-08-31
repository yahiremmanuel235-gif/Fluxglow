import { CompleteCourse } from '../types';

export const COMPLETE_COURSES_CATALOG: CompleteCourse[] = [
  {
    id: 'course-ansiedad-7d',
    badge: 'Ejemplo Demostrativo IA',
    title: 'Guía Completa de 1 Semana: Maestría en Calma y Desactivación de la Ansiedad',
    subtitle: 'Aprende paso a paso a regular tu sistema nervioso, frenar la rumiación y cultivar serenidad cotidiana.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    category: 'Ansiedad',
    author: 'FluxGlow Psicología y Neurociencia Aplicada',
    totalDays: 7,
    difficulty: 'Desde Principiante',
    targetAudience: 'Jóvenes y adultos que experimentan ansiedad, nerviosismo, palpitaciones o sobrepensamiento frecuente.',
    description: 'Una guía interactiva paso a paso de 1 semana con explicaciones claras, técnicas somáticas guiadas, comprobaciones interactivas y misiones prácticas para tu bienestar.',
    learningOutcomes: [
      'Comprender la raíz biológica de la alarma sin juzgarte ni sentir culpa.',
      'Dominar el Suspiro Fisiológico y la técnica 4-7-8 para calmarte en menos de 2 minutos.',
      'Aplicar anclajes sensoriales 5-4-3-2-1 ante momentos de agobio o sobrecarga.',
      'Reestructurar pensamientos automáticos catastróficos con preguntas racionales y sencillas.',
      'Construir un botiquín emocional personalizado para cualquier momento de dificultad.'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Día 1: La Biología de la Alarma',
        subtitle: 'Por qué tu cuerpo reacciona antes que la razón y cómo hablarle en su propio idioma',
        readTime: '6 min',
        summary: 'Descubre el rol de la amígdala cerebral y el sistema nervioso simpático, y por qué la ansiedad es una respuesta de protección que podemos modular mediante el cuerpo.',
        objective: 'Comprender que la ansiedad no es una debilidad personal, sino un sistema biológico de defensa que responde rápidamente a estímulos físicos y respiratorios.',
        sections: [
          {
            id: 'd1-s1',
            title: 'Concepto 1: El interruptor invisible — La Amígdala',
            subtitle: 'Tu guardián biológico de supervivencia',
            content: 'Imagina que en el centro de tu cerebro tienes un detector de humo ultrasensible llamado amígdala. Su único trabajo desde hace miles de años es mantenerte con vida. Cuando percibe una situación incierta (un examen decisivo, una conversación incómoda o un mensaje inesperado), este detector se enciende en milésimas de segundo. Libera adrenalina y cortisol en tu torrente sanguíneo, haciendo que el corazón lata más rápido para enviar sangre a tus músculos y preparando a tu cuerpo para correr o defenderse.',
            bulletPoints: [
              'La amígdala no distingue entre una amenaza física real (un peligro inminente) y una preocupación mental (un correo pendiente); activa la misma cascada biológica.',
              'Intentar "pensar en positivo" o forzarte a "no preocuparte" mientras el cuerpo está en alerta casi nunca funciona, porque la parte lógica del cerebro (la corteza prefrontal) queda temporalmente en segundo plano.',
              'La forma más rápida y respetuosa de apagar la alarma no es pelear con tus pensamientos, sino enviar señales directas de seguridad a través de tu cuerpo.'
            ],
            tip: 'La próxima vez que sientas taquicardia o inquietud repentina, recuerda decirte: "Mi cuerpo está intentando protegerme de algo que considera peligroso, pero en este instante estoy a salvo".'
          },
          {
            id: 'd1-s2',
            title: 'Concepto 2: El Nervio Vago — El freno de mano natural de la calma',
            subtitle: 'La autopista directa entre tu cuerpo y tu cerebro',
            content: 'El nervio vago es el nervio craneal más largo de tu anatomía: conecta el tallo cerebral con tu corazón, pulmones y sistema digestivo. Funciona exactamente como el pedal de freno de un automóvil. Cada vez que exhalas el aire de manera más lenta y prolongada de lo que tardaste en inhalar, el nervio vago se estimula mecánicamente y libera acetilcolina, un mensajero químico que le ordena al corazón desacelerar sus latidos de forma inmediata y automática.',
            bulletPoints: [
              'Al inhalar aceleras ligeramente el ritmo cardíaco; al exhalar despacio lo desaceleras.',
              'Cuando una persona está asustada o ansiosa, tiende a tomar bocanadas cortas y rápidas, lo que mantiene el acelerador pisado.',
              'Alargando la salida del aire le demuestras a tu sistema nervioso central que no estás corriendo por tu vida.'
            ],
            exercise: {
              title: 'Práctica Rápida del Nervio Vago (1 Minuto)',
              steps: [
                'Inhala suavemente por la nariz contando hasta 3.',
                'Exhala de manera fluida y relajada por la boca contando hasta 6, como si soplaras suavemente una vela sin apagar la llama.',
                'Repite este ciclo 4 veces y observa cómo tus hombros caen de manera natural.'
              ]
            }
          },
          {
            id: 'd1-s3',
            title: 'Concepto 3: El Escaneo de Seguridad Corporal',
            subtitle: 'Liberando micro-tensiones acumuladas',
            content: 'Cuando estamos ansiosos, el cuerpo adopta posturas defensivas casi invisibles: apretamos la mandíbula, subimos los hombros hacia las orejas y contenemos la respiración en el pecho. Estas contracciones musculares le envían al cerebro un mensaje de retroalimentación continuo que dice: "¡Sigo en peligro!". Si aflojamos voluntariamente estos tres puntos clave, el cerebro interpreta que la crisis ha terminado y apaga la señal de alarma.',
            bulletPoints: [
              'La mandíbula acumula gran parte de la tensión por sobrepensamiento: separar los dientes relaja los músculos faciales.',
              'Bajar los hombros descomprime el cuello y facilita que el diafragma se mueva libremente.',
              'Sentir el contacto firme de la planta de los pies con el suelo le da a la mente una referencia física de estabilidad aquí y ahora.'
            ],
            exercise: {
              title: 'Protocolo de Desbloqueo Corporal en 30 Segundos',
              steps: [
                'Suelta la mandíbula dejando caer el labio inferior ligeramente y apoya la lengua suavemente en el paladar.',
                'Inhala profundo, sube los hombros hacia las orejas y, al soltar el aire con un suspiro audible, déjalos caer por completo.',
                'Presiona suavemente los pies contra el suelo y siente el soporte que te sostiene en este momento exacto.'
              ]
            }
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué función principal cumple la amígdala cerebral en los momentos de ansiedad?',
            options: [
              'Actuar como un detector de amenazas y activar la respuesta física de alarma y supervivencia',
              'Memorizar listas de palabras y fechas históricas',
              'Procesar exclusivamente las imágenes de colores brillantes',
              'Controlar únicamente el movimiento de las manos'
            ],
            correctAnswerIndex: 0,
            explanation: 'La amígdala detecta cualquier señal de incertidumbre o peligro y pone en marcha la cascada de adrenalina y cortisol en el cuerpo.'
          },
          {
            id: 2,
            question: '¿Por qué alargar la exhalación ayuda a calmar la ansiedad?',
            options: [
              'Porque estimula el nervio vago y le indica al corazón que disminuya sus pulsaciones',
              'Porque incrementa la cantidad de adrenalina en los músculos',
              'Porque obliga a la mente a resolver problemas matemáticos',
              'Porque produce cansancio extremo de inmediato'
            ],
            correctAnswerIndex: 0,
            explanation: 'Al exhalar más lento que al inhalar, se activa la rama parasimpática a través del nervio vago, desacelerando el ritmo cardíaco.'
          },
          {
            id: 3,
            question: '¿Cuál es la forma más efectiva de iniciar la desactivación de un pico de alarma ansiosa?',
            options: [
              'Exigirte con enfado dejar de pensar de inmediato',
              'Enviar señales corporales de seguridad, como soltar la mandíbula y respirar despacio',
              'Mirar fijamente la pantalla del teléfono móvil con volumen alto',
              'Contener la respiración durante un minuto'
            ],
            correctAnswerIndex: 1,
            explanation: 'El cuerpo es la vía de acceso más rápida: cuando relajas los músculos y respiras lento, el cerebro comprende que el peligro no es inminente.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d1-1',
            title: 'Pausa de Mandíbula y Hombros',
            description: 'En 3 momentos de tu día, detén lo que estás haciendo 15 segundos para soltar la mandíbula y bajar los hombros.',
            timeEstimate: '2 min',
            xp: 25
          },
          {
            id: 'm-ans-d1-2',
            title: 'Registro de Alarma en el Diario',
            description: 'Escribe en tu diario emocional qué situación te causó inquietud hoy y cómo reaccionó tu cuerpo físicamente.',
            timeEstimate: '4 min',
            xp: 35
          }
        ],
        fullContextForAI: `Lección del Día 1 de Ansiedad: La Biología de la Alarma (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: La amígdala cerebral como interruptor de alarma biológica que activa cortisol y adrenalina ante la incertidumbre. La mente lógica se inhibe temporalmente.
- Concepto 2: El nervio vago como freno de mano de la calma; exhalar el doble de tiempo que la inhalación desacelera las pulsaciones cardíacas.
- Concepto 3: El escaneo de seguridad corporal enfocado en soltar la mandíbula, relajar hombros y enraizar los pies.`
      },
      {
        dayNumber: 2,
        title: 'Día 2: Neuro-respiración Somática',
        subtitle: 'El Suspiro Fisiológico y la técnica 4-7-8 explicados de forma práctica',
        readTime: '6 min',
        summary: 'Aprende la mecánica exacta del Suspiro Fisiológico descubierto en Stanford y la respiración 4-7-8 para apaciguar el ritmo cardíaco en menos de 90 segundos.',
        objective: 'Dominar dos patrones respiratorios respaldados por la neurociencia para autorregularte en cualquier momento y lugar.',
        sections: [
          {
            id: 'd2-s1',
            title: 'Concepto 1: El Suspiro Fisiológico de Stanford',
            subtitle: 'El reinicio más rápido del sistema nervioso autónomo',
            content: 'Investigaciones en el laboratorio de neurobiología de la Universidad de Stanford comprobaron que el "Suspiro Fisiológico" es la herramienta de autorregulación en tiempo real más rápida que existe. En nuestros pulmones hay millones de pequeños sacos de aire llamados alvéolos. Cuando nos estresamos o contenemos el aire, estos sacos tienden a colapsar, lo que acumula dióxido de carbono en la sangre y aumenta la sensación interna de asfixia o angustia. Una doble inhalación seguida de una exhalación larga vuelve a inflar los alvéolos y normaliza los gases en sangre casi al instante.',
            bulletPoints: [
              'Es un reflejo natural: los seres humanos y los animales suspiramos de forma espontánea antes de dormir o después de un llanto intenso para reequilibrarnos.',
              'Bastan de 2 a 4 ciclos de este ejercicio para reducir significativamente la frecuencia cardíaca y la sensación de agobio.',
              'Puedes realizarlo de manera silenciosa en el transporte público, en tu escritorio o antes de una presentación sin que nadie se dé cuenta.'
            ],
            exercise: {
              title: 'Mecánica del Suspiro Fisiológico (Paso a Paso)',
              steps: [
                'Inhalación 1: Toma una respiración profunda por la nariz llenando primero el abdomen y luego el pecho.',
                'Inhalación 2: Sin soltar el aire, toma un sorbo extra de aire muy corto por la nariz para expandir los pulmones al máximo.',
                'Exhalación: Suelta todo el aire por la boca de manera lenta, suave y completa hasta vaciarte por completo.',
                'Repite de 3 a 5 veces consecutivas.'
              ]
            }
          },
          {
            id: 'd2-s2',
            title: 'Concepto 2: La Técnica 4-7-8 para conciliar serenidad',
            subtitle: 'El sedante natural del sistema nervioso central',
            content: 'Popularizada por el Dr. Andrew Weil en medicina integrativa, la respiración 4-7-8 actúa como un regulador rítmico. Al retener el aire durante 7 segundos, permites que el oxígeno sature la sangre mientras que la exhalación de 8 segundos estimula profundamente el sistema parasimpático. Es ideal para esos momentos en que los pensamientos no te dejan dormir o cuando sientes que la mente da vueltas sin descanso.',
            bulletPoints: [
              'Inhalar en 4 segundos aporta el oxígeno necesario sin hiperventilar.',
              'Retener en 7 segundos desacelera el ritmo de procesamiento mental y entrena la tolerancia a la calma.',
              'Exhalar en 8 segundos relaja los músculos intercostales y el diafragma.',
              'Practicarla cada noche antes de dormir mejora la calidad del descanso y reduce el insomnio ansioso.'
            ],
            exercise: {
              title: 'Protocolo Nocturno 4-7-8',
              steps: [
                'Coloca la punta de la lengua en el tejido detrás de los dientes superiores frontales.',
                'Inhala silenciosamente por la nariz contando mentalmente: 1, 2, 3, 4.',
                'Sostén el aire con serenidad contando: 1, 2, 3, 4, 5, 6, 7.',
                'Exhala suavemente por la boca produciendo un sonido relajante de viento contando: 1, 2, 3, 4, 5, 6, 7, 8.',
                'Completa 4 ciclos seguidos.'
              ]
            }
          },
          {
            id: 'd2-s3',
            title: 'Concepto 3: La Respiración Abdominal vs. Respiración Clavicular',
            subtitle: 'Aprende a respirar con el diafragma',
            content: 'Cuando una persona vive con estrés crónico, se acostumbra a respirar de forma superficial únicamente con el pecho superior y los hombros (respiración clavicular). Este tipo de respiración envía una señal continua al cerebro de que estás en peligro. En cambio, cuando permites que el abdomen se expanda suavemente al inhalar (respiración diafragmática), el diafragma masajea los órganos internos y le da espacio a los pulmones para trabajar sin esfuerzo.',
            bulletPoints: [
              'Coloca una mano en tu pecho y otra sobre tu ombligo para comprobar cuál se mueve primero.',
              'La mano sobre el ombligo debe subir suavemente al inhalar y bajar al exhalar; la mano del pecho debe permanecer casi quieta.',
              'Respirar con el diafragma no requiere esfuerzo ni fuerza: se trata de permitir que el aire entre con naturalidad.'
            ],
            tip: 'Practica 2 minutos de respiración diafragmática al despertar acostado en la cama antes de ponerte de pie.'
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿En qué consiste el patrón del Suspiro Fisiológico descubierto en Stanford?',
            options: [
              'Una doble inhalación por la nariz (una profunda y un sorbo extra al final) seguida de una exhalación larga por la boca',
              'Aguantar la respiración durante un minuto entero sin soltar el aire',
              'Respirar únicamente por la boca de manera acelerada',
              'Exhalar con fuerza golpeando el pecho'
            ],
            correctAnswerIndex: 0,
            explanation: 'El Suspiro Fisiológico utiliza una doble inhalación nasal para reabrir los alvéolos pulmonares y una exhalación prolongada para desacelerar las pulsaciones.'
          },
          {
            id: 2,
            question: '¿Cuál es la proporción de tiempos en la técnica 4-7-8?',
            options: [
              '4 segundos de inhalación, 7 de retención y 8 de exhalación lenta',
              '4 segundos de retención y 7 de inhalación',
              '8 segundos de inhalación y 4 de exhalación',
              '7 segundos de inhalación y 7 de retención'
            ],
            correctAnswerIndex: 0,
            explanation: 'En la técnica 4-7-8 se inhala en 4, se sostiene el aire en 7 y se exhala suavemente durante 8 segundos.'
          },
          {
            id: 3,
            question: '¿Por qué es preferible la respiración diafragmática sobre la respiración con el pecho superior?',
            options: [
              'Porque la respiración diafragmática estimula el descanso y reduce las señales de alarma continua en el cerebro',
              'Porque la respiración con el pecho gasta menos energía',
              'Porque no tiene ninguna diferencia biológica',
              'Porque ayuda a correr más rápido en emergencias'
            ],
            correctAnswerIndex: 0,
            explanation: 'La respiración diafragmática permite un intercambio de gases óptimo y evita la tensión crónica en cuello y hombros.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d2-1',
            title: '3 Ciclos de Suspiro Fisiológico',
            description: 'Aplica el Suspiro Fisiológico a media tarde o cuando sientas saturación mental en tus tareas.',
            timeEstimate: '3 min',
            xp: 30
          },
          {
            id: 'm-ans-d2-2',
            title: 'Respiración 4-7-8 Nocturna',
            description: 'Realiza 4 ciclos de la técnica 4-7-8 justo antes de dormir para preparar tu mente para el descanso.',
            timeEstimate: '4 min',
            xp: 35
          }
        ],
        fullContextForAI: `Lección del Día 2 de Ansiedad: Neuro-respiración Somática (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: El Suspiro Fisiológico (investigado en Stanford): doble inhalación nasal + exhalación larga bucal. Reabre alvéolos colapsados y baja pulsaciones en 3 a 5 ciclos.
- Concepto 2: Técnica 4-7-8 (Dr. Andrew Weil): Inhalar en 4s, retener en 7s, exhalar en 8s. Sedante natural y promotor del sueño.
- Concepto 3: Respiración diafragmática vs clavicular. Mover el abdomen para masajear órganos y desactivar la hiperventilación crónica.`
      },
      {
        dayNumber: 3,
        title: 'Día 3: Anclaje Sensorial de Emergencia 5-4-3-2-1',
        subtitle: 'Cómo regresar al presente cuando la mente viaja al peor escenario posible',
        readTime: '6 min',
        summary: 'La técnica de Grounding sensorial conecta tus 5 sentidos con el entorno real para cortar de raíz los bucles de sobrepensamiento y pánico.',
        objective: 'Aprender a usar la técnica 5-4-3-2-1 en cualquier lugar con total discreción para recuperar la estabilidad mental.',
        sections: [
          {
            id: 'd3-s1',
            title: 'Concepto 1: ¿Qué es el Grounding o Enraizamiento Sensorial?',
            subtitle: 'Desactivar la hiperfocalización en pensamientos temerosos',
            content: 'Durante un momento de ansiedad intensa o sobrepensamiento, la atención de tu mente queda atrapada dentro de un laberinto mental ("¿Y si repruebo?", "¿Y si me juzgan?", "¿Y si algo sale mal?"). Tu cerebro gasta tanta energía procesando estas hipótesis que pierde el contacto con la realidad física circundante. El Grounding (o enraizamiento) es una técnica psicológica que obliga a tus circuitos cerebrales a procesar información sensorial del mundo exterior real, obligando a la mente a salir del bucle.',
            bulletPoints: [
              'No puedes estar al 100% concentrado en examinar los detalles de una textura física y al mismo tiempo mantener un pensamiento catastrófico con la misma fuerza.',
              'Los sentidos son tu ancla física más confiable: el mundo sensorial siempre ocurre en el presente inmediato, mientras que la ansiedad vive en un futuro imaginado.',
              'Esta técnica no requiere cerrar los ojos ni hacer movimientos extraños; se puede practicar mientras caminas, viajas en transporte o estás en una clase.'
            ],
            tip: 'Piensa en el Grounding como un cable a tierra que descarga la electricidad estática de tus pensamientos acelerados.'
          },
          {
            id: 'd3-s2',
            title: 'Concepto 2: El Protocolo 5-4-3-2-1 Paso a Paso',
            subtitle: 'La secuencia progresiva de los 5 sentidos',
            content: 'Para aplicar esta técnica con éxito, recorre tus sentidos de mayor a menor estímulo, prestando atención minuciosa y descriptiva a cada elemento:',
            bulletPoints: [
              '5 cosas que puedas VER: Busca 5 objetos concretos y observa sus detalles (el reflejo de la luz en una ventana, el color de una mochila, una textura de madera, una planta, una sombra).',
              '4 cosas que puedas TOCAR: Siente 4 sensaciones táctiles reales (la textura de tu ropa en la piel, el frío de tu reloj, el contacto de tus dedos entre sí, el respaldo de la silla).',
              '3 cosas que puedas ESCUCHAR: Identifica 3 sonidos distintos a tu alrededor (el tráfico lejano, el murmullo de voces, el viento o el zumbido de un aparato eléctrico).',
              '2 cosas que puedas OLER: Percibe 2 aromas presentes (el aroma de tu café, el olor a lluvia, perfume o el aire fresco).',
              '1 cosa que puedas SABOREAR o una frase de seguridad: Nota el sabor en tu boca (un caramelo, un sorbo de agua) o repite mentalmente: "Estoy aquí, en este espacio seguro, en este instante".'
            ],
            exercise: {
              title: 'Práctica Guiada de Anclaje Rápido',
              steps: [
                'Mira a tu alrededor y nombra mentalmente 5 cosas con su color exacto.',
                'Toca la superficie más cercana y describe en tu mente su temperatura y textura.',
                'Cierra los ojos 5 segundos y detecta el sonido más lejano que puedas percibir.',
                'Toma una respiración profunda y siente el peso de tu cuerpo apoyado.'
              ]
            }
          },
          {
            id: 'd3-s3',
            title: 'Concepto 3: Micro-Anclajes Táctiles para el Día a Día',
            subtitle: 'Herramientas de bolsillo para momentos de estrés imprevistos',
            content: 'A veces no dispones de varios minutos para hacer el recorrido completo. En esos instantes, un micro-anclaje táctil sirve como interruptor rápido para recordarle a tu mente dónde estás. Un objeto con textura definida (como un anillo, una piedra lisa de río o una pulsera) puede convertirse en tu ancla física de serenidad.',
            bulletPoints: [
              'Elegir un objeto pequeño que lleves contigo cotidianamente.',
              'Cuando sientas que la mente comienza a acelerarse, toca el objeto durante 20 segundos prestando toda tu atención a su forma y relieve.',
              'Este hábito condiciona a tu cerebro a asociar esa textura física con una pausa para respirar y recentrarse.'
            ],
            tip: 'Lavarte las manos con agua fresca o sostener un vaso con agua fría también funciona como un potente micro-anclaje sensorial inmediato.'
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es el objetivo principal del anclaje sensorial o Grounding?',
            options: [
              'Forzar a la mente a procesar estímulos del mundo exterior físico para romper el bucle de pensamientos ansiosos',
              'Aprender a memorizar listas de números rápidamente',
              'Dormirse de inmediato en cualquier lugar',
              'Aumentar la adrenalina para resolver tareas'
            ],
            correctAnswerIndex: 0,
            explanation: 'Al procesar activamente los 5 sentidos, el cerebro desvía su atención de las amenazas imaginadas hacia el entorno real presente.'
          },
          {
            id: 2,
            question: 'En la secuencia 5-4-3-2-1, ¿con qué sentido se comienza?',
            options: [
              'Con 5 cosas que puedas VER (la vista)',
              'Con 5 cosas que puedas saborear',
              'Con 5 cosas que puedas oler',
              'Con 5 ejercicios físicos intensos'
            ],
            correctAnswerIndex: 0,
            explanation: 'La secuencia inicia con la vista, identificando 5 objetos o detalles visuales específicos a tu alrededor.'
          },
          {
            id: 3,
            question: '¿Es necesario que las demás personas noten que estás aplicando un anclaje sensorial?',
            options: [
              'No, puedes realizarlo en silencio y con total discreción en un aula, oficina o transporte',
              'Sí, es obligatorio decir cada objeto en voz alta para que funcione',
              'Solo funciona si estás en una habitación completamente a oscuras',
              'Requiere usar equipo médico especial'
            ],
            correctAnswerIndex: 0,
            explanation: 'El anclaje sensorial se puede ejecutar de forma 100% mental y discreta sin que nadie a tu alrededor lo note.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d3-1',
            title: 'Práctica de Anclaje 5-4-3-2-1',
            description: 'Encuentra un momento tranquilo hoy y realiza la secuencia completa de los 5 sentidos con atención plena.',
            timeEstimate: '3 min',
            xp: 30
          },
          {
            id: 'm-ans-d3-2',
            title: 'Define tu Objeto de Micro-Anclaje',
            description: 'Elige un objeto pequeño (anillo, pulsera, piedra) y úsalo hoy como recordatorio para respirar cuando sientas prisa.',
            timeEstimate: '2 min',
            xp: 25
          }
        ],
        fullContextForAI: `Lección del Día 3 de Ansiedad: Anclaje Sensorial 5-4-3-2-1 (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Fundamento del Grounding: desconectar la hiperfocalización en pensamientos y anclar la mente en el entorno real presente.
- Concepto 2: Secuencia 5-4-3-2-1 (5 que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas o frase de seguridad).
- Concepto 3: Micro-anclajes táctiles (objetos de bolsillo, agua fresca en las manos) para usar discretamente en cualquier contexto.`
      },
      {
        dayNumber: 4,
        title: 'Día 4: Desmontando Pensamientos Catastróficos',
        subtitle: 'Reencuadre Cognitivo basado en la Terapia Cognitivo-Conductual (TCC)',
        readTime: '7 min',
        summary: 'Aprende a someter los pensamientos distorsionados de la ansiedad a tres preguntas filtro sencillas para recuperar una perspectiva clara y realista.',
        objective: 'Aprender a diferenciar entre un pensamiento automático temeroso y un hecho real comprobable.',
        sections: [
          {
            id: 'd4-s1',
            title: 'Concepto 1: La trampa de confundir lo "Posible" con lo "Probable"',
            subtitle: 'Por qué la mente ansiosa siempre imagina el peor final',
            content: 'Cuando estamos ansiosos, nuestro cerebro cae en un sesgo cognitivo común: asume que porque algo malo "podría" ocurrir teóricamente, es casi seguro que ocurrirá. Sin embargo, en el mundo real, existe una enorme diferencia entre la posibilidad y la probabilidad. Que sea posible que caiga un meteorito no significa que sea probable hoy. La ansiedad toma posibilidades diminutas y las amplifica como si fueran certezas inminentes.',
            bulletPoints: [
              'Un pensamiento ansioso es simplemente un evento mental o una hipótesis, no una predicción mágica del futuro ni una verdad absoluta.',
              'Tener el pensamiento "Voy a hacer el ridículo" no significa que vayas a hacerlo; solo significa que te importa la situación.',
              'No tenemos que creer todo lo que nuestra mente nos dice en un momento de tensión.'
            ],
            tip: 'Cuando surja una idea trágica, di para tus adentros: "Anoto que mi mente tiene miedo, pero este pensamiento no es un hecho comprobado".'
          },
          {
            id: 'd4-s2',
            title: 'Concepto 2: Las 3 Preguntas Filtro del Reencuadre Cognitivo',
            subtitle: 'Tu tribunal de la razón frente a las suposiciones',
            content: 'La Terapia Cognitivo-Conductual (TCC) nos enseña que podemos interrogar a nuestros pensamientos automáticos para quitarles su poder intimidante mediante 3 preguntas sencillas:',
            bulletPoints: [
              'Pregunta 1 — ¿Qué evidencia real y objetiva tengo a favor y en contra de este pensamiento? (¿Tengo datos concretos o solo suposiciones basadas en el miedo?).',
              'Pregunta 2 — Si ocurriera lo peor que imagino, ¿qué recursos, personas o habilidades he utilizado en el pasado para salir adelante? (Recordar tu resiliencia previa desactiva la sensación de indefensión).',
              'Pregunta 3 — ¿Cuál es el escenario más realista, equilibrado y probable que suele suceder en estas circunstancias?'
            ],
            exercise: {
              title: 'Ejercicio de Reencuadre en Papel',
              steps: [
                'Escribe en una línea tu preocupación exacta (Ejemplo: "Si me equivoco en la reunión, todos pensarán que no sirvo").',
                'Aplica la Pregunta 1: ¿Cuántas veces alguien se ha equivocado y nadie lo juzgó para siempre?',
                'Escribe una alternativa realista y amable: "Equivocarme es parte del aprendizaje humano y tengo capacidad para aclararlo con tranquilidad".'
              ]
            }
          },
          {
            id: 'd4-s3',
            title: 'Concepto 3: La Distorsión del "Todo o Nada" y la Catastrofización',
            subtitle: 'Reconociendo los lentes empañados de la mente',
            content: 'La mente bajo estrés suele ver el mundo en blanco y negro: "Si no sale perfecto, fue un desastre total" o "Si no me responde de inmediato, está enfadado conmigo". Reconocer estas trampas del lenguaje nos ayuda a recuperar los matices grises de la vida cotidiana, donde casi nada es 100% perfecto ni 100% una tragedia.',
            bulletPoints: [
              'Atento a palabras absolutistas: "siempre", "nunca", "todos", "nada".',
              'Sustituye los extremos por frases con flexibilidad: "a veces", "en esta ocasión", "algunas personas".',
              'La autocompasión es el mejor antídoto frente al perfeccionismo paralizante.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué error de razonamiento comete con frecuencia la mente ansiosa?',
            options: [
              'Confundir lo que es meramente posible con lo que es altamente probable en la realidad',
              'Pensar con demasiada lógica matemática',
              'Olvidar por completo cómo hablar con los demás',
              'No tener ninguna imaginación'
            ],
            correctAnswerIndex: 0,
            explanation: 'La ansiedad agranda la probabilidad de sucesos negativos y minimiza nuestra capacidad real de afrontarlos.'
          },
          {
            id: 2,
            question: '¿Cuál es el propósito de la primera pregunta filtro en el reencuadre cognitivo?',
            options: [
              'Buscar evidencia objetiva y comprobable frente al pensamiento en lugar de guiarse solo por el miedo',
              'Culpar a los demás por lo que sentimos',
              'Intentar huir de la situación de inmediato',
              'Ignorar todas las responsabilidades del día'
            ],
            correctAnswerIndex: 0,
            explanation: 'Examinar los datos reales desarma las suposiciones infundadas creadas por el estado de alerta.'
          },
          {
            id: 3,
            question: 'Un pensamiento automático ansioso debe considerarse como:',
            options: [
              'Una hipótesis mental que puede ser cuestionada y reencuadrada con amabilidad',
              'Una verdad absoluta e inmutable sobre el futuro',
              'Una orden biológica obligatoria que debemos obedecer',
              'Una confirmación de que algo malo ya sucedió'
            ],
            correctAnswerIndex: 0,
            explanation: 'Los pensamientos son eventos de la mente, no hechos consumados ni certezas científicas.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d4-1',
            title: 'Reencuadre de una Preocupación',
            description: 'Identifica una preocupación de hoy y pásala por las 3 preguntas de evidencia en una breve nota de tu diario.',
            timeEstimate: '5 min',
            xp: 35
          },
          {
            id: 'm-ans-d4-2',
            title: 'Detectar Palabras Absolutas',
            description: 'Presta atención hoy si dices "siempre" o "nunca" y cámbialas conscientemente por "a veces" o "en este momento".',
            timeEstimate: '3 min',
            xp: 25
          }
        ],
        fullContextForAI: `Lección del Día 4 de Ansiedad: Desmontando Pensamientos Catastróficos (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Confundir lo posible con lo probable; los pensamientos son eventos mentales e hipótesis, no hechos comprobados.
- Concepto 2: Tres preguntas filtro de la TCC: 1) Evidencia real objetiva, 2) Recursos previos para afrontarlo si ocurriera, 3) Escenario más realista y probable.
- Concepto 3: Distorsiones de "todo o nada" y catastrofización; flexibilizar el lenguaje absolutista.`
      },
      {
        dayNumber: 5,
        title: 'Día 5: Tiempo de Preocupación Delimitado (Worry Time)',
        subtitle: 'Cómo evitar que las dudas e inquietudes te asalten durante todo el día',
        readTime: '6 min',
        summary: 'Asignar un horario deliberado y acotado para atender tus preocupaciones le quita a la mente la urgencia de rumiar mientras realizas tus actividades cotidianas.',
        objective: 'Aprender a postergar conscientemente la rumiación asignando una cita diaria de 10 minutos con tus pendientes.',
        sections: [
          {
            id: 'd5-s1',
            title: 'Concepto 1: El efecto rebote de la represión mental',
            subtitle: 'Por qué decirte "¡No pienses en eso!" nunca da resultado',
            content: 'Si alguien te pide con insistencia: "Por favor, durante los próximos 30 segundos, ¡no te imagines bajo ninguna circunstancia a un elefante rosa brillante!", lo primero que aparece en tu mente es la imagen exacta de ese elefante. En psicología esto se conoce como el "efecto rebote de los procesos irónicos". Intentar reprimir o callar a la fuerza una preocupación hace que el cerebro active un mecanismo de vigilancia constante para comprobar si sigues pensando en ella, lo que la trae de vuelta con el doble de intensidad.',
            bulletPoints: [
              'Luchar contra los pensamientos ansiosos es como forcejear en arenas movedizas: entre más peleas, más te hundes en ellos.',
              'La solución no es prohibirte pensar, sino darle a tu mente un espacio controlado y delimitado donde sus preocupaciones sí serán escuchadas.',
              'Al saber que habrá un momento formal para atender el tema, la urgencia mental disminuye drásticamente.'
            ]
          },
          {
            id: 'd5-s2',
            title: 'Concepto 2: El Protocolo del "Worry Time" de 10 Minutos',
            subtitle: 'Cómo agendar una cita con tus inquietudes',
            content: 'La técnica del "Worry Time" (o tiempo de preocupación) consiste en asignar un bloque fijo de 10 a 15 minutos en tu día (por ejemplo, todos los días a las 17:30 h en tu escritorio o sala) dedicado exclusivamente a revisar lo que te preocupa.',
            bulletPoints: [
              'Paso 1: Si a las 10:30 AM surge un pensamiento angustioso sobre un examen o un mensaje, anótalo brevemente en una libreta o en tu teléfono.',
              'Paso 2: Dite con serenidad: "He tomado nota de esto. No lo voy a ignorar, pero lo atenderé con calma en mi horario de las 17:30".',
              'Paso 3: Regresa con amabilidad a lo que estabas haciendo en el momento presente.',
              'Paso 4: Cuando den las 17:30, lee las notas. Sorprendentemente, más del 70% de las preocupaciones ya no parecerán tan urgentes o habrán perdido su carga emocional.'
            ],
            exercise: {
              title: 'Reglas de Oro del Worry Time',
              steps: [
                'Nunca programes tu Worry Time justo antes de acostarte a dormir; procura que sea al menos 2 horas antes del descanso.',
                'Utiliza papel y lápiz: volcar las ideas en texto saca la rumiación de la memoria de trabajo cerebral.',
                'Divide las notas en dos columnas: "Cosas sobre las que puedo actuar hoy" y "Cosas que escapan de mi control".'
              ]
            }
          },
          {
            id: 'd5-s3',
            title: 'Concepto 3: La Descarga Mental (Brain Dump)',
            subtitle: 'Liberar memoria RAM cognitiva',
            content: 'Tu cerebro es excelente para generar ideas creativas y resolver problemas, pero es muy deficiente para almacenar listas interminables de pendientes bajo estrés. Cuando mantienes 10 preocupaciones flotando en tu cabeza, saturas tu memoria de trabajo (como una computadora con 50 pestañas abiertas al mismo tiempo). Escribir todo lo que te abruma en una hoja en blanco sin filtros vacía esa carga cognitiva y reduce la ansiedad de fondo.',
            bulletPoints: [
              'Dedica 3 minutos a escribir todo lo que te inquiete sin preocuparte por la ortografía ni el orden.',
              'Ver los problemas escritos en un papel los hace finitos y manejables en lugar de gigantescos e infinitos.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué ocurre psicológicamente cuando intentas prohibirte a la fuerza pensar en una preocupación?',
            options: [
              'Ocurre el efecto rebote irónico y el pensamiento regresa con mayor insistencia y frecuencia',
              'El pensamiento se borra de la memoria para siempre',
              'Mejora la agilidad mental al instante',
              'Se elimina la necesidad de dormir'
            ],
            correctAnswerIndex: 0,
            explanation: 'Intentar suprimir activamente pensamientos genera un monitoreo inconsciente que los vuelve más persistentes.'
          },
          {
            id: 2,
            question: '¿En qué consiste el método del "Worry Time"?',
            options: [
              'Asignar un bloque de 10 a 15 minutos en el día para revisar y escribir preocupaciones, postergándolas con calma hasta esa hora',
              'Preocuparse sin descanso las 24 horas del día',
              'Ignorar todas las responsabilidades y obligaciones',
              'Pedirle a otra persona que resuelva todas nuestras dudas'
            ],
            correctAnswerIndex: 0,
            explanation: 'Al posponer conscientemente la preocupación para un horario predeterminado, la mente libera atención durante el resto del día.'
          },
          {
            id: 3,
            question: '¿Por qué se recomienda no programar el Worry Time justo antes de ir a dormir?',
            options: [
              'Para evitar activar el sistema de alerta y permitir que el cuerpo entre en modo descanso',
              'Porque la luz de las lámparas se apaga a esa hora',
              'Porque es obligatorio hacerlo en la madrugada',
              'No hay ninguna razón médica'
            ],
            correctAnswerIndex: 0,
            explanation: 'Revisar preocupaciones antes de dormir eleva el cortisol e interfiere con el inicio natural del sueño profundo.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d5-1',
            title: 'Elige tu Horario de Worry Time',
            description: 'Define qué hora del día será tu bloque de 10 minutos (por ejemplo a las 18:00 h) y pruébalo hoy.',
            timeEstimate: '3 min',
            xp: 30
          },
          {
            id: 'm-ans-d5-2',
            title: 'Descarga Mental de 3 Minutos',
            description: 'Vuelca en una hoja o nota todo lo que tengas pendiente en tu cabeza para liberar espacio mental.',
            timeEstimate: '4 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 5 de Ansiedad: Tiempo de Preocupación Delimitado (Worry Time) (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Efecto rebote irónico al intentar reprimir pensamientos (el experimento del elefante rosa). Luchar contra ellos los hace más fuertes.
- Concepto 2: Protocolo del Worry Time de 10-15 minutos agendado en la tarde. Anotar la preocupación al aparecer y posponerla para esa cita formal.
- Concepto 3: Descarga mental (Brain Dump) para liberar memoria RAM cognitiva y separar lo controlable de lo incontrolable.`
      },
      {
        dayNumber: 6,
        title: 'Día 6: Higiene Sensorial y Reducción de Estímulos',
        subtitle: 'Protege tu sistema nervioso de la sobrecarga del entorno digital y físico',
        readTime: '6 min',
        summary: 'Aprende a identificar detonantes ambientales cotidianos (pantallas, cafeína tardía, ruido constante) que mantienen tu amígdala encendida sin que te des cuenta.',
        objective: 'Diseñar un entorno sensorialmente seguro y amigable para reducir la fatiga del sistema nervioso.',
        sections: [
          {
            id: 'd6-s1',
            title: 'Concepto 1: La Sobrecarga Sensorial Moderna',
            subtitle: 'Un cerebro prehistórico en un mundo hiperestimulado',
            content: 'Nuestros sistemas biológicos evolucionaron para procesar cambios lentos en la naturaleza (la salida del sol, el sonido del viento, la calma de la noche). Hoy en día, una persona promedio recibe en un solo día más información y estímulos lumínicos y sonoros de los que un ser humano de hace tres siglos procesaba en varios meses. Notificaciones constantes, vídeos ultra-rápidos, alertas rojas y luces LED mantienen a la amígdala en un estado de micro-alerta perpetua, elevando la línea base de ansiedad.',
            bulletPoints: [
              'La sobreestimulación constante agota los neurotransmisores de la calma como el GABA y la serotonina.',
              'No siempre estás ansioso por "problemas personales"; a veces tu sistema nervioso está simplemente sobrecargado de estímulos externos.',
              'Aprender a reducir el volumen del entorno es un acto fundamental de autocuidado preventivo.'
            ]
          },
          {
            id: 'd6-s2',
            title: 'Concepto 2: Los Primeros y Últimos 20 Minutos del Día',
            subtitle: 'Protegiendo las dos puertas sagradas de tu mente',
            content: 'Al despertar, tu cerebro transita suavemente de las ondas cerebrales delta/theta (sueño) a las ondas alfa/beta (vigilia). Si lo primero que haces al abrir los ojos es tomar el teléfono y ver noticias alarmantes, mensajes exigentes o vidas ajenas en redes sociales, obligas a tu cerebro a entrar en estado de combate y estrés desde el minuto cero.',
            bulletPoints: [
              'Regla de los 20 minutos matutinos: posterga el uso de redes sociales o noticias durante los primeros 20 minutos de la mañana.',
              'Luz solar en los ojos: exponerte a la luz natural matutina durante 5 a 10 minutos sincroniza tu reloj biológico circadiano y mejora el ánimo.',
              'Cierre digital nocturno: apaga pantallas o atenúa luces 45 minutos antes de acostarte para permitir que la melatonina se libere de forma natural.'
            ],
            exercise: {
              title: 'Ritual Matutino de Baja Fricción',
              steps: [
                'Despierta y toma un vaso con agua antes de tocar tu teléfono.',
                'Abre las cortinas o asómate a la ventana durante 2 minutos respirando aire fresco.',
                'Realiza 3 estiramientos suaves de cuello y espalda sintiendo tu cuerpo descansado.'
              ]
            }
          },
          {
            id: 'd6-s3',
            title: 'Concepto 3: Cafeína, Azúcar y la Línea Base de Nerviosismo',
            subtitle: 'Alineando lo que consumes con la tranquilidad que buscas',
            content: 'La cafeína actúa bloqueando los receptores de adenosina (la molécula que le indica al cerebro que está cansado) y estimula la liberación de adrenalina. En personas con propensión a la ansiedad, una dosis alta de cafeína o tomar café con el estómago vacío puede imitar exactamente los síntomas físicos de un ataque de pánico (palpitaciones, sudoración y temblores), engañando a la mente para que busque un peligro donde no lo hay.',
            bulletPoints: [
              'Evita tomar café en ayunas: acompáñalo siempre de alimento para evitar picos de glucosa y cortisol.',
              'Hora límite de cafeína: dado que la vida media de la cafeína es de 5 a 7 horas, procura no consumirla después de las 14:00 o 15:00 horas para proteger el sueño profundo.',
              'El té verde o las infusiones de manzanilla ofrecen antioxidantes y L-teanina, un aminoácido que promueve la calma sin causar somnolencia.'
            ],
            tip: 'Si sientes palpitaciones misteriosas a media mañana, revisa si tomaste café en exceso o si omitiste el desayuno.'
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Por qué se aconseja evitar revisar redes sociales o noticias en los primeros 20 minutos al despertar?',
            options: [
              'Porque dispara cortisol y reactividad emocional antes de que el cerebro alcance un estado de vigilia sereno',
              'Porque la pantalla pierde brillo por las mañanas',
              'Porque se gasta la batería más rápido',
              'No tiene ningún impacto en la salud mental'
            ],
            correctAnswerIndex: 0,
            explanation: 'Revisar estímulos estresantes al despertar coloca al cerebro en un modo reactivo de defensa desde el inicio de la jornada.'
          },
          {
            id: 2,
            question: '¿Qué beneficio aporta recibir luz natural en los ojos durante la mañana?',
            options: [
              'Sincroniza el ritmo circadiano, eleva la energía diurna y facilita la producción nocturna de melatonina',
              'Hace que no necesites comer en todo el día',
              'Cura cualquier resfriado al instante',
              'Ninguno comprobable'
            ],
            correctAnswerIndex: 0,
            explanation: 'Los fotorreceptores retinianos ajustan el reloj biológico central gracias a la luz solar matutina.'
          },
          {
            id: 3,
            question: '¿Por qué la cafeína puede intensificar la sensación de ansiedad?',
            options: [
              'Porque estimula la liberación de adrenalina e incrementa las palpitaciones, imitando los síntomas físicos de la alarma',
              'Porque induce el sueño profundo de inmediato',
              'Porque baja la temperatura corporal drásticamente',
              'Porque disminuye la memoria a corto plazo'
            ],
            correctAnswerIndex: 0,
            explanation: 'El exceso de cafeína activa físicamente el sistema nervioso simpático, lo que la mente puede malinterpretar como peligro.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d6-1',
            title: 'Mañana Sin Redes Sociales (15 min)',
            description: 'Mañana al despertar, espera al menos 15 minutos antes de revisar notificaciones o redes en tu teléfono.',
            timeEstimate: '15 min',
            xp: 35
          },
          {
            id: 'm-ans-d6-2',
            title: 'Corte de Cafeína a las 15:00 h',
            description: 'Sustituye cualquier café o refresco de la tarde por agua fresca o una infusión relajante.',
            timeEstimate: '2 min',
            xp: 25
          }
        ],
        fullContextForAI: `Lección del Día 6 de Ansiedad: Higiene Sensorial y Reducción de Estímulos (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Sobrecarga sensorial moderna y cómo las notificaciones mantienen a la amígdala en micro-alerta continua.
- Concepto 2: Regla de los 20 minutos sin pantalla al despertar y exposición a la luz solar matutina para regular el ritmo circadiano.
- Concepto 3: Impacto de la cafeína en la línea base de nerviosismo y la importancia de no consumirla en ayunas ni tarde en el día.`
      },
      {
        dayNumber: 7,
        title: 'Día 7: Tu Botiquín Emocional Personalizado',
        subtitle: 'Integración, plan de prevención de recaídas y consolidación de tu práctica',
        readTime: '7 min',
        summary: 'Integra todo lo aprendido durante esta semana y arma tu protocolo personalizado de primeros auxilios emocionales para recurrir a él siempre que lo necesites.',
        objective: 'Tener una ruta de acción clara y accesible para acompañarte con compasión ante futuros momentos de incertidumbre.',
        sections: [
          {
            id: 'd7-s1',
            title: 'Concepto 1: El Protocolo de las 3 C — Cuerpo, Cabeza y Conexión',
            subtitle: 'Tu mapa de ruta rápido en momentos de dificultad',
            content: 'Cuando en el futuro notes que la ansiedad vuelve a asomarse, no necesitas recordar decenas de teorías complejas. Basta con seguir el protocolo simplificado de las 3 C en este orden exacto:',
            bulletPoints: [
              '1. CUERPO (Físico): Antes de intentar razonar, calma tu fisiología. Aplica 3 Suspiros Fisiológicos, suelta la mandíbula, baja los hombros y apoya los pies con firmeza.',
              '2. CABEZA (Mental): Pasa tus dudas por las preguntas filtro: "¿Qué evidencia objetiva tengo?" y "¿Qué está verdaderamente bajo mi control hoy?".',
              '3. CONEXIÓN (Social y Emocional): No te aisles en el silencio. Exprésale cómo te sientes a alguien de confianza o escríbelo libremente en tu diario emocional de FluxGlow.'
            ],
            tip: 'Guardar este esquema en tu teléfono o en una nota visible te ahorrará la parálisis por análisis cuando estés abrumado.'
          },
          {
            id: 'd7-s2',
            title: 'Concepto 2: Normalizar los altibajos — La regla de la autocompasión',
            subtitle: 'Sanar no es una línea recta perfecta',
            content: 'Muchas personas cometen el error de pensar: "Ya terminé la guía, así que jamás debería volver a sentir miedo ni ansiedad". La ansiedad es una emoción humana biológica tan natural como la alegría o la tristeza; su presencia ocasional no significa que hayas retrocedido ni que el curso haya fallado.',
            bulletPoints: [
              'La meta nunca ha sido eliminar todas las emociones incómodas, sino cambiar la relación que tienes con ellas.',
              'El éxito no es "no sentir ansiedad nunca más", sino saber qué hacer y cómo tratarte con cariño cuando la ansiedad aparezca.',
              'Aceptarte en tus días difíciles acelera tu recuperación el triple que criticarte con dureza.'
            ],
            exercise: {
              title: 'Frase de Autocompasión para Días Difíciles',
              steps: [
                'Coloca una mano sobre tu pecho o sobre tu brazo.',
                'Inhala suavemente y repite para tus adentros: "Este es un momento difícil, pero es parte de ser humano. Elijo tratarme con paciencia y amabilidad en este día".'
              ]
            }
          },
          {
            id: 'd7-s3',
            title: 'Concepto 3: Consolidación de Hábitos y Celebración del Avance',
            subtitle: 'Pequeñas acciones diarias que transforman tu bienestar a largo plazo',
            content: 'Has completado 7 días de dedicación a tu salud mental. El cambio duradero no proviene de esfuerzos heroicos aislados, sino de micro-hábitos practicados con amabilidad cada semana.',
            bulletPoints: [
              'Elige tus 2 técnicas favoritas de esta semana y conviértelas en tus aliadas permanentes.',
              'Apóyate en el módulo de Misiones y en Flux AI siempre que necesites un recordatorio de calma.',
              'Reconoce tu esfuerzo: dedicar tiempo a conocer tu mente es una de las decisiones más valiosas de tu vida.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es el primer paso del protocolo de las 3 C en un momento de ansiedad?',
            options: [
              'Cuerpo: regular la respiración y soltar la tensión física antes de intentar razonar',
              'Pensar en todas las metas del próximo año',
              'Criticarte duramente por sentirte mal',
              'Aislarte completamente en silencio'
            ],
            correctAnswerIndex: 0,
            explanation: 'Primero estabilizamos la fisiología del cuerpo para que la corteza cerebral pueda recuperar la claridad lógica.'
          },
          {
            id: 2,
            question: 'Tener un día con nerviosismo o inquietud después de completar la guía significa que:',
            options: [
              'Es un proceso humano normal; la clave no es eliminar las emociones, sino saber cómo acompañarte cuando aparecen',
              'La guía no sirvió para nada y hay que rendirse',
              'Has perdido todo el progreso que lograste',
              'Debes aislarte de todo el mundo'
            ],
            correctAnswerIndex: 0,
            explanation: 'La regulación emocional es una práctica continua. Los altibajos son normales y ahora cuentas con herramientas prácticas para gestionarlos.'
          },
          {
            id: 3,
            question: '¿Qué función cumple tu botiquín emocional personalizado?',
            options: [
              'Tener a la mano un conjunto claro de técnicas probadas para autorregularte sin entrar en parálisis',
              'Contener medicamentos de emergencia',
              'Evitar sentir cualquier emoción humana',
              'Hacer que nunca más tengamos responsabilidades'
            ],
            correctAnswerIndex: 0,
            explanation: 'Tener un protocolo predefinido reduce la incertidumbre y te permite responder con confianza ante momentos de estrés.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d7-1',
            title: 'Crea tu Botiquín en el Diario',
            description: 'Anota en tu diario tus 3 herramientas favoritas aprendidas en estos 7 días para tenerlas siempre presentes.',
            timeEstimate: '5 min',
            xp: 50
          },
          {
            id: 'm-ans-d7-2',
            title: 'Mensaje de Graduación y Gratitud',
            description: 'Escríbete una frase de agradecimiento por haber dedicado estos 7 días a cuidar de tu salud mental.',
            timeEstimate: '3 min',
            xp: 40
          }
        ],
        fullContextForAI: `Lección del Día 7 de Ansiedad: Tu Botiquín Emocional Personalizado (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Protocolo de las 3 C: Cuerpo (suspiros y relajar mandíbula), Cabeza (preguntas de evidencia y control) y Conexión (comunicación y diario).
- Concepto 2: Normalización de altibajos emocionales y autocompasión; la meta es una relación sana con las emociones.
- Concepto 3: Consolidación de micro-hábitos sostenibles y celebración del compromiso personal con la salud mental.`
      }
    ]
  },
  {
    id: 'course-estres-7d',
    badge: 'Ejemplo Demostrativo IA',
    title: 'Guía Completa de 1 Semana: Productividad Consciente y Cero Burnout',
    subtitle: 'Aprende a gestionar tu carga académica y laboral cuidando tu salud mental y energía vital.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    category: 'Estrés',
    author: 'FluxGlow Academia de Productividad Sostenible',
    totalDays: 7,
    difficulty: 'Intermedio',
    targetAudience: 'Estudiantes y profesionales que sienten sobrecarga de tareas, procrastinación o fatiga crónica.',
    description: 'Guía práctica interactiva de 1 semana para desarmar la parálisis por sobrepensamiento, organizar bloques de foco conscientes y proteger tus descansos sin culpa.',
    learningOutcomes: [
      'Eliminar la fricción inicial para comenzar tareas postergadas en menos de 2 minutos.',
      'Construir un sistema de descarga mental para liberar RAM cognitiva y evitar saturación.',
      'Aprender a decir no asertivamente y poner límites saludables sin remordimiento.',
      'Reducir el cortisol durante épocas de exámenes, entregas y compromisos exigentes.'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Día 1: El Mito de la Productividad Lineal',
        subtitle: 'Tu energía es cíclica y biológica, no una máquina inagotable',
        readTime: '6 min',
        summary: 'Comprende por qué forzarte a rendir al máximo 12 horas continuas provoca agotamiento y cómo trabajar en armonía con tus ritmos naturales.',
        objective: 'Aprender a identificar tus picos de energía alta vs momentos de recuperación para planificar tu jornada con inteligencia.',
        sections: [
          {
            id: 'e1-s1',
            title: 'Concepto 1: La trampa de tratarte como una máquina',
            subtitle: 'Por qué hacer más no siempre equivale a avanzar mejor',
            content: 'Nuestra cultura a menudo glorifica estar ocupado todo el tiempo, confundiéndolo con ser productivo. Sin embargo, el cerebro humano no funciona como un motor eléctrico de velocidad constante. La neurociencia ha descubierto que operamos mediante "ritmos ultradianos": ciclos de aproximadamente 90 minutos de foco y alta actividad mental, seguidos de una caída natural en los niveles de glucosa y neurotransmisores que exige una pausa biológica de 10 a 15 minutos.',
            bulletPoints: [
              'Ignorar estas pausas naturales y forzarte a seguir adelante reduce la calidad de tus decisiones en más de un 50%.',
              'Trabajar cansado duplica el tiempo necesario para resolver una tarea que descansado harías en media hora.',
              'El descanso no es un premio que te ganas al terminar todo; es el mantenimiento indispensable para poder rendir con claridad.'
            ],
            tip: 'Trabajar con tus ritmos te permite lograr más en 4 horas enfocadas que en 9 horas de distracción y fatiga continua.'
          },
          {
            id: 'e1-s2',
            title: 'Concepto 2: Los 3 Niveles de Energía Diaria',
            subtitle: 'Alinear tareas complejas con tus horas doradas',
            content: 'No todas las horas del día valen lo mismo. Para organizar tu jornada sin agobio, clasifica tus tareas según la energía que demandan:',
            bulletPoints: [
              'Energía Alta (Horas Doradas): Tareas que exigen creatividad, análisis profundo o tomar decisiones difíciles (estudiar un tema nuevo, redactar un informe clave).',
              'Energía Media: Tareas estructuradas pero predecibles (responder correos, ordenar archivos, tareas de rutina).',
              'Energía Baja: Tareas automáticas o de bajo esfuerzo cognitivo (limpiar tu espacio, organizar materiales, descanso activo).'
            ],
            exercise: {
              title: 'Identifica tu Pico de Claridad',
              steps: [
                'Pregúntate: ¿A qué hora del día suelo sentir mi mente más despejada? (Ej: 9:00 AM - 11:30 AM o 16:00 PM - 18:00 PM).',
                'Protege ese bloque de tiempo de interrupciones y llamadas no urgentes.',
                'Asigna tu tarea más importante del día a esa ventana de energía alta.'
              ]
            }
          },
          {
            id: 'e1-s3',
            title: 'Concepto 3: La Pausa Activa Restaurativa',
            subtitle: 'Qué hacer en un descanso para recuperar verdadera energía',
            content: 'Cambiar de pestaña de trabajo para revisar redes sociales no es descansar: tu cerebro sigue procesando miles de datos visuales por minuto. Una verdadera pausa restaurativa desconecta la vista de pantallas y permite que la mente divague brevemente.',
            bulletPoints: [
              'Caminar 3 minutos, tomar un vaso con agua o estirar los brazos.',
              'Mirar por una ventana hacia el horizonte para relajar los músculos del ojo.',
              'Hacer 2 minutos de respiraciones lentas.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Aproximadamente cuánto dura un ciclo ultradiano de concentración óptima según la neurociencia?',
            options: [
              'Aproximadamente 90 minutos de foco seguidos de una necesidad natural de recuperación',
              '12 horas continuas sin parar',
              '3 minutos en total',
              '5 días seguidos'
            ],
            correctAnswerIndex: 0,
            explanation: 'Los ciclos ultradianos marcan fluctuaciones de energía de 90 a 120 minutos en el cerebro humano.'
          },
          {
            id: 2,
            question: '¿Qué es el descanso en el modelo de productividad consciente?',
            options: [
              'Un requisito biológico indispensable para la salud mental y la calidad del trabajo',
              'Una pérdida de tiempo que hay que evitar siempre',
              'Un premio exclusivo para cuando todo esté 100% terminado',
              'Algo innecesario si tomas suficiente café'
            ],
            correctAnswerIndex: 0,
            explanation: 'El descanso restaura los neurotransmisores de la atención y previene el agotamiento crónico (burnout).'
          },
          {
            id: 3,
            question: '¿Cuál de las siguientes actividades representa una verdadera pausa restaurativa?',
            options: [
              'Caminar unos minutos, tomar agua o mirar al horizonte lejos de las pantallas',
              'Revisar frenéticamente redes sociales o noticias de última hora',
              'Abrir 10 correos nuevos de trabajo en el teléfono',
              'Discutir con alguien en internet'
            ],
            correctAnswerIndex: 0,
            explanation: 'Descansar la vista y desconectar de los estímulos digitales permite que el cerebro recupere frescura cognitiva.'
          }
        ],
        missions: [
          {
            id: 'm-est-d1-1',
            title: 'Monitoreo de Energía en 3 Momentos',
            description: 'Evalúa tu nivel de energía del 1 al 5 en la mañana, tarde y noche en tu diario para conocer tu ritmo.',
            timeEstimate: '3 min',
            xp: 25
          },
          {
            id: 'm-est-d1-2',
            title: 'Una Pausa Activa Lejos de Pantallas',
            description: 'Haz un descanso de 5 minutos a media jornada levantándote y mirando hacia el exterior.',
            timeEstimate: '5 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 1 de Estrés y Productividad: El Mito de la Productividad Lineal (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Ritmos ultradianos de 90 minutos y por qué forzar el rendimiento lineal genera agotamiento y duplica errores.
- Concepto 2: Los tres niveles de energía diaria (alta, media, baja) para ubicar tareas difíciles en horas de máxima claridad.
- Concepto 3: Pausas activas restaurativas vs distracción pasiva en pantallas.`
      },
      {
        dayNumber: 2,
        title: 'Día 2: La Técnica de Fricción Cero',
        subtitle: 'Cómo romper la parálisis y empezar cualquier tarea en 120 segundos',
        readTime: '6 min',
        summary: 'La mayor parte de la procrastinación no es falta de disciplina, sino una respuesta de ansiedad ante la magnitud percibida de una tarea.',
        objective: 'Aprender la regla de los 2 minutos para superar la resistencia inicial y activar el impulso de acción.',
        sections: [
          {
            id: 'e2-s1',
            title: 'Concepto 1: La Procrastinación como Regulación Emocional',
            subtitle: 'No eres perezoso; estás abrumado',
            content: 'Durante años se nos ha dicho que procrastinar es sinónimo de pereza o desorganización. Sin embargo, la psicología contemporánea ha demostrado que procrastinar es en realidad un mecanismo de evitación emocional: cuando una tarea nos parece gigantesca, aburrida o incierta, el cerebro anticipa incomodidad o miedo al fracaso, y busca un alivio inmediato haciendo cualquier otra cosa más fácil.',
            bulletPoints: [
              'El mayor obstáculo nunca es la tarea en sí, sino la fricción emocional de los primeros 120 segundos.',
              'Una vez que empiezas físicamente una actividad, el cerebro cambia de modo "resistencia" a modo "ejecución".',
              'Para vencer la procrastinación, no necesitas más fuerza de voluntad; necesitas hacer el inicio ridículamente fácil.'
            ]
          },
          {
            id: 'e2-s2',
            title: 'Concepto 2: La Regla de los 2 Minutos (Micro-Pasos)',
            subtitle: 'Reducir el umbral de entrada a cero',
            content: 'Si tu objetivo es "estudiar 5 capítulos de medicina" o "escribir un informe de 20 páginas", tu cerebro sentirá una pared insalvable. La regla de los 2 minutos consiste en reducir la tarea a su micro-acción física inicial que tome menos de 120 segundos:',
            bulletPoints: [
              'No te propongas "hacer ejercicio 1 hora"; proponte "ponerte los zapatos deportivos".',
              'No te propongas "escribir todo el ensayo"; proponte "abrir el documento en blanco y escribir el título".',
              'Comprométete a trabajar en ello solo durante 2 minutos. Si al cabo de 2 minutos quieres detenerte, tienes permiso para hacerlo. Pero en el 85% de los casos, la inercia te llevará a continuar con fluidez.'
            ],
            exercise: {
              title: 'Práctica de Inicio Inmediato',
              steps: [
                'Elige la tarea que más pereza o agobio te causa hoy.',
                'Define cuál es la acción física más pequeña que puedes realizar en 60 segundos.',
                'Pon un cronómetro de 2 minutos y ejecuta esa micro-acción sin pensar en el final.'
              ]
            }
          },
          {
            id: 'e2-s3',
            title: 'Concepto 3: El Principio de la Inercia de Newton en la Mente',
            subtitle: 'Un cuerpo en movimiento tiende a permanecer en movimiento',
            content: 'Al igual que en la física clásica, poner en movimiento un objeto detenido requiere mucha más energía que mantenerlo rodando una vez que empezó. Al dar el primer paso mínimo, generas dopamina de logro que alimenta las ganas de seguir adelante.',
            bulletPoints: [
              'Celebra los inicios, no solo los finales.',
              'Un avance imperfecto del 5% es infinitamente mejor que un 0% perfecto que nunca comenzó.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es la causa psicológica más frecuente detrás de la procrastinación?',
            options: [
              'Una respuesta de evitación emocional ante la sensación de abrumo o miedo al error',
              'Falta total de inteligencia',
              'Demasiada energía física',
              'Genética irreversible'
            ],
            correctAnswerIndex: 0,
            explanation: 'Procrastinar es un intento de la mente de evitar la incomodidad emocional que proyecta sobre una tarea.'
          },
          {
            id: 2,
            question: '¿En qué consiste la regla de los 2 minutos?',
            options: [
              'Comprometerte a realizar únicamente el micro-paso inicial durante 120 segundos para romper la inercia',
              'Terminar todos los trabajos de tu vida en 2 minutos',
              'Dormir 2 minutos cada hora',
              'Esperar 2 minutos antes de contestar mensajes'
            ],
            correctAnswerIndex: 0,
            explanation: 'Reducir el umbral de entrada al mínimo elimina la resistencia mental inicial.'
          },
          {
            id: 3,
            question: 'Un ejemplo de micro-paso de fricción cero es:',
            options: [
              'Abrir el archivo y escribir una sola oración o título',
              'Leer 10 libros enteros en una sola noche',
              'Organizar toda tu casa sin pestañear',
              'Aprender un idioma completo en la mañana'
            ],
            correctAnswerIndex: 0,
            explanation: 'Un micro-paso debe ser tan pequeño y accesible que no genere excusas ni resistencia.'
          }
        ],
        missions: [
          {
            id: 'm-est-d2-1',
            title: 'Aplica la Regla de los 2 Minutos',
            description: 'Elige una tarea postergada y trabaja en su primer micro-paso durante exactamente 120 segundos.',
            timeEstimate: '2 min',
            xp: 30
          },
          {
            id: 'm-est-d2-2',
            title: 'Despeja tu Espacio de Trabajo',
            description: 'Retira 3 objetos innecesarios de tu escritorio para reducir la fricción visual antes de comenzar.',
            timeEstimate: '3 min',
            xp: 25
          }
        ],
        fullContextForAI: `Lección del Día 2 de Estrés y Productividad: Técnica de Fricción Cero (Guía Completa 1 Semana - Ejemplo Demostrativo IA).
Conceptos explicados:
- Concepto 1: Procrastinación como regulación y evitación emocional, no pereza.
- Concepto 2: Regla de los 2 minutos y micro-pasos para eliminar la resistencia de entrada.
- Concepto 3: Principio de inercia y generación de dopamina al iniciar una acción mínima.`
      }
    ]
  }
];
