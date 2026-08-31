import { CompleteCourse } from '../types';

export const COMPLETE_COURSES_CATALOG: CompleteCourse[] = [
  {
    id: 'course-ansiedad-7d',
    badge: 'Curso Completo 7 Días',
    title: 'Programa 7 Días: Maestría en Calma y Desactivación de la Ansiedad',
    subtitle: 'Aprende paso a paso a regular tu sistema nervioso, frenar la rumiación y cultivar serenidad cotidiana.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    category: 'Ansiedad',
    author: 'FluxGlow Psychology & Neuroscience Lab',
    totalDays: 7,
    difficulty: 'Desde Principiante',
    targetAudience: 'Jóvenes y adultos que experimentan ansiedad, nerviosismo, palpitaciones o sobrepensamiento frecuente.',
    description: 'Un programa formativo modular estilo clase interactiva (inspirado en la plataforma Aprendes) donde cada día desbloqueas un aprendizaje teórico, una técnica somática guiada, un cuestionario de 3 preguntas de comprobación y misiones prácticas.',
    learningOutcomes: [
      'Comprender la raíz biológica de la alarma sin juzgarte.',
      'Dominar el Suspiro Fisiológico y la técnica 4-7-8 para calmarte en menos de 2 minutos.',
      'Aplicar anclajes sensoriales 5-4-3-2-1 ante momentos de pánico o agobio.',
      'Reestructurar pensamientos automáticos catastróficos con preguntas racionales.',
      'Construir un botiquín emocional de primeros auxilios personalizado.'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Día 1: La Biología de la Alarma',
        subtitle: 'Por qué tu cuerpo reacciona antes que la razón y cómo hablarle en su idioma',
        readTime: '5 min',
        summary: 'Descubre el rol de la amígdala y el sistema nervioso simpático, y por qué la ansiedad es una respuesta de protección que podemos regular con señales corporales.',
        objective: 'Comprender que la ansiedad no es un defecto personal, sino una señal de alarma biológica que responde a la respiración y el cuerpo.',
        sections: [
          {
            id: 'd1-s1',
            title: '1. El interruptor invisible: La Amígdala',
            subtitle: 'Tu guardián de supervivencia',
            content: 'Cuando el cerebro percibe incertidumbre, un examen difícil o un conflicto, la amígdala activa el modo lucha o huida en milésimas de segundo. Libera adrenalina y cortisol, acelerando los latidos y tensando los músculos.',
            bulletPoints: [
              'La amígdala no sabe si estás frente a un león o frente a un examen; reacciona con la misma intensidad biológica.',
              'Intentar "pensar en positivo" mientras el cuerpo está en alerta casi nunca funciona porque la corteza prefrontal está temporalmente inhibida.',
              'La puerta de entrada más rápida para apagar la alarma es el cuerpo, especialmente el patrón respiratorio.'
            ]
          },
          {
            id: 'd1-s2',
            title: '2. El Nervio Vago: El freno de mano de la calma',
            subtitle: 'Tu mayor aliado biológico',
            content: 'El nervio vago conecta el tallo cerebral con el corazón, pulmones y sistema digestivo. Al exhalar más lento de lo que inhalas, estimulas este nervio, indicándole al corazón que baje sus pulsaciones de forma natural.',
            tip: 'Una sola exhalación larga y prolongada le demuestra a tu cerebro que en este instante no estás corriendo por tu vida.'
          },
          {
            id: 'd1-s3',
            title: '3. Técnica Práctica del Día: El Escaneo de Seguridad',
            subtitle: '30 segundos de anclaje inicial',
            content: 'Cada vez que sientas que la mente se acelera, realiza este micro-hábito:',
            exercise: {
              title: 'Pasos del Escaneo de Seguridad',
              steps: [
                'Suelta la mandíbula y separa los dientes ligeramente.',
                'Baja los hombros alejándolos conscientemente de las orejas.',
                'Siente el peso de tus pies firmes sobre el piso durante dos respiraciones completas.'
              ]
            }
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué estructura cerebral se encarga de activar la respuesta de alarma y supervivencia?',
            options: ['La amígdala', 'El hipocampo', 'La corteza occipital', 'El cerebelo'],
            correctAnswerIndex: 0,
            explanation: 'La amígdala es la encargada de detectar posibles amenazas y disparar la cascada de adrenalina y cortisol en el cuerpo.'
          },
          {
            id: 2,
            question: '¿Cuál es la vía más rápida y directa para calmar el sistema nervioso en un pico de ansiedad?',
            options: [
              'Exigirte no pensar en nada',
              'Enviar señales corporales como exhalaciones lentas y relajar la mandíbula',
              'Mirar fijamente el teléfono móvil',
              'Esperar a que se pase sin hacer nada'
            ],
            correctAnswerIndex: 1,
            explanation: 'Dado que la mente racional se bloquea durante la alarma, enviar señales físicas de seguridad a través de la respiración lenta estimula el nervio vago.'
          },
          {
            id: 3,
            question: '¿Qué efecto tiene alargar la exhalación en comparación con la inhalación?',
            options: [
              'Aumenta la adrenalina',
              'Activa el nervio vago y disminuye la frecuencia cardíaca',
              'Provoca mayor tensión muscular',
              'Causa hiperventilación'
            ],
            correctAnswerIndex: 1,
            explanation: 'Exhalar despacio activa la rama parasimpática del sistema nervioso, disminuyendo el ritmo cardíaco y promoviendo la relajación.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d1-1',
            title: 'Pausa de Mandíbula y Hombros',
            description: 'En 3 momentos del día, detente 10 segundos para soltar la mandíbula y bajar los hombros.',
            timeEstimate: '2 min',
            xp: 25
          },
          {
            id: 'm-ans-d1-2',
            title: 'Registro de Alarma en el Diario',
            description: 'Anota en el diario emocional una situación donde sentiste activación física hoy y cómo reaccionaste.',
            timeEstimate: '4 min',
            xp: 35
          }
        ],
        fullContextForAI: `Lección del Día 1 de Ansiedad: La Biología de la Alarma.
Puntos clave explicados en esta lección:
- La amígdala cerebral actúa como interruptor de alarma ante la incertidumbre o el estrés, liberando adrenalina y cortisol.
- Durante la alarma, la corteza prefrontal (razonamiento lógico) pierde protagonismo, por lo que el cuerpo reacciona antes que la razón.
- Intentar "pensar en positivo" en pleno pico no suele funcionar; la vía más eficaz es enviar señales corporales de seguridad.
- El nervio vago es el freno de mano biológico: al exhalar más lento que al inhalar, se activa la rama parasimpática y disminuye la frecuencia cardíaca.
- Ejercicio práctico del Día 1: Escaneo de seguridad (soltar la mandíbula, bajar los hombros y sentir los pies firmes en el suelo).`
      },
      {
        dayNumber: 2,
        title: 'Día 2: Neuro-respiración Somática',
        subtitle: 'El Suspiro Fisiológico y la técnica 4-7-8 explicadas por la ciencia',
        readTime: '6 min',
        summary: 'Aprende la mecánica exacta del Suspiro Fisiológico descubierto en Stanford para reducir pulsaciones en menos de 90 segundos.',
        objective: 'Dominar el Suspiro Fisiológico y la respiración diafragmática para autorregularte en cualquier momento.',
        sections: [
          {
            id: 'd2-s1',
            title: '1. El Suspiro Fisiológico de Stanford',
            subtitle: 'El reinicio más rápido del sistema autónomo',
            content: 'Investigaciones en neurobiología de Stanford demostraron que el patrón de doble inhalación y exhalación larga desinfla los alvéolos colapsados y expulsa el exceso de dióxido de carbono en la sangre, reduciendo el ritmo cardíaco en 15 latidos por minuto casi de inmediato.',
            bulletPoints: [
              'Inhalación 1: Profunda por la nariz llenando el diafragma.',
              'Inhalación 2: Un pequeño sorbo extra de aire por la nariz al final para abrir los pulmones al máximo.',
              'Exhalación: Muy lenta, suave y prolongada por la boca hasta vaciarte por completo.',
              'Realizar 3 a 5 ciclos basta para cambiar la bioquímica sanguínea.'
            ]
          },
          {
            id: 'd2-s2',
            title: '2. La Técnica 4-7-8 para conciliar serenidad',
            subtitle: 'Ideal antes de dormir o ante pensamientos acelerados',
            content: 'Desarrollada por el Dr. Andrew Weil, esta técnica actúa como un sedante natural para el sistema nervioso central.',
            exercise: {
              title: 'Pasos de la respiración 4-7-8',
              steps: [
                'Inhala silenciosamente por la nariz contando hasta 4.',
                'Retén el aire en tus pulmones durante 7 segundos.',
                'Exhala produciendo un sonido suave de viento por la boca durante 8 segundos.',
                'Repite el ciclo 4 veces consecutivas.'
              ]
            }
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿En qué consiste el primer paso del Suspiro Fisiológico?',
            options: [
              'Exhalar con fuerza',
              'Una doble inhalación por la nariz (una profunda y otra corta al final)',
              'Aguantar el aire 20 segundos',
              'Respirar únicamente por la boca'
            ],
            correctAnswerIndex: 1,
            explanation: 'El Suspiro Fisiológico se caracteriza por una inhalación profunda seguida de una segunda inhalación corta por la nariz antes de soltar el aire.'
          },
          {
            id: 2,
            question: '¿Cuántos segundos dura la exhalación en la técnica 4-7-8?',
            options: ['4 segundos', '7 segundos', '8 segundos', '2 segundos'],
            correctAnswerIndex: 2,
            explanation: 'En la técnica 4-7-8, se inhala en 4, se retiene en 7 y se exhala lentamente durante 8 segundos.'
          },
          {
            id: 3,
            question: '¿Cuántos ciclos del Suspiro Fisiológico se recomiendan para sentir alivio?',
            options: ['De 3 a 5 ciclos', '50 ciclos continuos', '1 ciclo cada 2 horas', 'Ninguno'],
            correctAnswerIndex: 0,
            explanation: 'Con solo 3 a 5 ciclos conscientes se logra regular la relación de oxígeno/dióxido de carbono y desacelerar el ritmo cardíaco.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d2-1',
            title: '3 Ciclos de Suspiro Fisiológico',
            description: 'Aplica el Suspiro Fisiológico al mediodía o cuando notes tensión en tus hombros.',
            timeEstimate: '3 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 2 de Ansiedad: Neuro-respiración Somática.
Contenido de la clase:
- Suspiro Fisiológico (investigado en Stanford): consiste en una doble inhalación por la nariz (una profunda + un sorbo extra al final) y una exhalación larga y lenta por la boca. Abre alvéolos y reduce pulsaciones en 3 a 5 ciclos.
- Técnica 4-7-8 (Dr. Andrew Weil): Inhala en 4 segundos, retén en 7 segundos, exhala en 8 segundos por la boca. Actúa como relajante del sistema nervioso.
- Ambas técnicas modifican la relación de gases en sangre y estimulan la respuesta parasimpática de calma.`
      },
      {
        dayNumber: 3,
        title: 'Día 3: Anclaje de Emergencia 5-4-3-2-1',
        subtitle: 'Cómo regresar al presente cuando la mente se va al peor escenario',
        readTime: '5 min',
        summary: 'La técnica de Grounding sensorial conecta tus 5 sentidos con el entorno real para cortar de raíz el bucle del pánico.',
        objective: 'Aprender a usar la técnica 5-4-3-2-1 en cualquier lugar sin que nadie lo note.',
        sections: [
          {
            id: 'd3-s1',
            title: '1. ¿Qué es el Grounding o Enraizamiento?',
            subtitle: 'Desactivar la hiperfocalización interna',
            content: 'Durante un ataque de pánico o ansiedad intensa, tu atención queda atrapada dentro de tu cabeza ("¿Y si me desmayo?", "¿Y si no puedo?"). El anclaje sensorial fuerza a tu cerebro a procesar estímulos del mundo exterior físico, rompiendo el bucle rumiante.',
            bulletPoints: [
              '5 cosas que puedas VER (colores, formas, reflejos de luz).',
              '4 cosas que puedas TOCAR (la textura de tu pantalón, el frío de tu reloj, el respaldo de la silla).',
              '3 cosas que puedas ESCUCHAR (el tráfico lejano, el zumbido de un ventilador, tu respiración).',
              '2 cosas que puedas OLER (café, perfume, aire fresco).',
              '1 cosa que puedas SABOREAR o una frase de seguridad ("Estoy a salvo en este momento").'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es el objetivo principal de la técnica de anclaje 5-4-3-2-1?',
            options: [
              'Memorizar números',
              'Redirigir la atención de los pensamientos temerosos hacia los 5 sentidos en el presente',
              'Aumentar la adrenalina',
              'Dormirse de inmediato'
            ],
            correctAnswerIndex: 1,
            explanation: 'El anclaje sensorial saca a la mente de la rumiación interna conectándola con los estímulos físicos reales del entorno.'
          },
          {
            id: 2,
            question: '¿Qué sentido se estimula con el número 5 en la secuencia?',
            options: ['La vista (5 cosas que puedas ver)', 'El gusto', 'El olfato', 'El tacto'],
            correctAnswerIndex: 0,
            explanation: 'La técnica inicia observando con detalle 5 elementos visuales a tu alrededor.'
          },
          {
            id: 3,
            question: '¿Es necesario que las personas alrededor noten que estás haciendo el ejercicio?',
            options: [
              'Sí, hay que decirlo en voz alta',
              'No, puedes realizarlo en silencio y con total discreción en cualquier lugar',
              'Solo funciona si estás solo en una habitación oscura',
              'Requiere equipo especial'
            ],
            correctAnswerIndex: 1,
            explanation: 'El anclaje 5-4-3-2-1 se puede hacer mentalmente en un autobús, aula de clases o reunión sin llamar la atención.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d3-1',
            title: 'Práctica de Anclaje Sensorial',
            description: 'Encuentra un momento durante el día y nombra mentalmente los elementos 5-4-3-2-1 de tu entorno.',
            timeEstimate: '3 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 3 de Ansiedad: Anclaje de Emergencia 5-4-3-2-1 (Grounding).
Contenido de la lección:
- La ansiedad atrapa la atención en pensamientos catastróficos internos.
- El anclaje sensorial fuerza a los circuitos cerebrales a procesar el mundo exterior: 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles y 1 que saboreas o una afirmación de seguridad.
- Es discreto, no invasivo y se puede aplicar en cualquier lugar público o privado.`
      },
      {
        dayNumber: 4,
        title: 'Día 4: Desmontando Pensamientos Catastróficos',
        subtitle: 'Reencuadre Cognitivo basado en Terapia Cognitivo-Conductual (TCC)',
        readTime: '6 min',
        summary: 'Aprende a someter los pensamientos distorsionados de la ansiedad a tres preguntas filtro para recuperar la perspectiva racional.',
        objective: 'Diferenciar entre un pensamiento automático y un hecho real comprobable.',
        sections: [
          {
            id: 'd4-s1',
            title: '1. El sesgo del peor escenario',
            subtitle: 'La trampa de la adivinación del futuro',
            content: 'La mente ansiosa confunde "posible" con "probable". Que algo pueda salir mal no significa que vaya a suceder. Pasa tus miedos por las 3 preguntas de la TCC:',
            bulletPoints: [
              'Pregunta 1: ¿Tengo evidencia 100% objetiva de que esto va a pasar, o es solo una hipótesis?',
              'Pregunta 2: Si ocurriera lo peor, ¿qué recursos o apoyos he usado antes para salir adelante?',
              'Pregunta 3: ¿Cuál es el escenario más realista y equilibrado que suele ocurrir?'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué error común comete la mente ansiosa según la TCC?',
            options: [
              'Confundir lo que es meramente posible con lo que es altamente probable',
              'Pensar demasiado en números matemáticos',
              'No tener ninguna imaginación',
              'Olvidar el pasado'
            ],
            correctAnswerIndex: 0,
            explanation: 'La ansiedad sobreestima la probabilidad de que ocurra una catástrofe y subestima nuestra capacidad para afrontarla.'
          },
          {
            id: 2,
            question: '¿Cuál es la primera pregunta filtro del Reencuadre Cognitivo?',
            options: [
              '¿Por qué me pasa esto a mí?',
              '¿Tengo evidencia 100% objetiva de que esto va a suceder o es una suposición?',
              '¿Quién tiene la culpa?',
              '¿Cómo puedo huir?'
            ],
            correctAnswerIndex: 1,
            explanation: 'Examinar la evidencia objetiva desarma las distorsiones automáticas de la mente.'
          },
          {
            id: 3,
            question: 'Un pensamiento automático ansioso es:',
            options: [
              'Una verdad absoluta e inmutable',
              'Una hipótesis mental que puede ser cuestionada y reencuadrada',
              'Una orden biológica obligatoria',
              'Una premonición certera'
            ],
            correctAnswerIndex: 1,
            explanation: 'Los pensamientos son eventos mentales, no hechos comprobados. Siempre podemos reencuadrarlos.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d4-1',
            title: 'Cuestionario de 3 Preguntas',
            description: 'Identifica una preocupación de hoy y pásala por las 3 preguntas de evidencia en una nota.',
            timeEstimate: '5 min',
            xp: 35
          }
        ],
        fullContextForAI: `Lección del Día 4 de Ansiedad: Desmontando Pensamientos Catastróficos (TCC).
Puntos clave:
- La mente ansiosa confunde "posibilidad" con "probabilidad real".
- Tres preguntas filtro del reencuadre cognitivo: 1) ¿Qué evidencia real tengo? 2) Si pasa lo peor, ¿cómo puedo afrontarlo con mis recursos? 3) ¿Cuál es el resultado más realista?
- Los pensamientos son hipótesis generadas por el cerebro, no hechos consumados ni certezas absolutas.`
      },
      {
        dayNumber: 5,
        title: 'Día 5: Tiempo de Preocupación Delimitado (Worry Time)',
        subtitle: 'Cómo evitar que las dudas te asalten a todas horas',
        readTime: '5 min',
        summary: 'Asignar un horario fijo para preocuparte le quita a la mente la necesidad de rumiar durante tus actividades cotidianas.',
        objective: 'Implementar el protocolo del bloque de 10 minutos de preocupación deliberada.',
        sections: [
          {
            id: 'd5-s1',
            title: '1. El efecto rebote de reprimir pensamientos',
            subtitle: 'No pienses en un elefante rosa',
            content: 'Intentar "no preocuparte" solo hace que el pensamiento regrese con más fuerza. La técnica del Worry Time le da un espacio seguro y delimitado a tus inquietudes.',
            bulletPoints: [
              'Elige un horario fijo: por ejemplo, todos los días a las 17:30 durante 10 minutos.',
              'Si surge una preocupación a las 10:00 AM, anótala en una libreta y dite: "La revisaré en mi horario de las 17:30".',
              'Cuando llegue tu bloque de las 17:30, lee las notas y busca soluciones prácticas.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Qué sucede cuando intentas forzarte a no pensar en una preocupación?',
            options: [
              'Desaparece para siempre',
              'Ocurre el efecto rebote y regresa con mayor insistencia',
              'Mejora tu memoria',
              'Te relajas de inmediato'
            ],
            correctAnswerIndex: 1,
            explanation: 'Intentar suprimir activamente pensamientos genera un monitoreo cerebral constante que los vuelve más persistentes.'
          },
          {
            id: 2,
            question: '¿En qué consiste la técnica del Worry Time?',
            options: [
              'Estar preocupado todo el día sin parar',
              'Asignar un bloque de 10 minutos al día para revisar preocupaciones y postergarlas hasta ese momento',
              'Ignorar todas tus responsabilidades',
              'Pedir a otros que se preocupen por ti'
            ],
            correctAnswerIndex: 1,
            explanation: 'Al posponer la preocupación para un momento específico, liberas tu memoria de trabajo durante el resto de la jornada.'
          },
          {
            id: 3,
            question: '¿Qué debes hacer si una preocupación surge fuera de tu horario asignado?',
            options: [
              'Detener todo y angustiarte',
              'Anotarla brevemente y recordar que la atenderás en tu bloque programado',
              'Regañarte por tenerla',
              'Borrarla de tu mente a la fuerza'
            ],
            correctAnswerIndex: 1,
            explanation: 'Anotarla da la señal al cerebro de que la idea no se perderá y reduce la urgencia de rumiar.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d5-1',
            title: 'Configura tu bloque de Worry Time',
            description: 'Elige tu hora del día para el Worry Time de 10 minutos y anota 1 pendiente que postergues hasta esa hora.',
            timeEstimate: '4 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 5 de Ansiedad: Tiempo de Preocupación Delimitado (Worry Time).
Puntos clave:
- Reprimir pensamientos causa el efecto rebote irónico.
- El Worry Time asigna un bloque de 10 minutos diario (ej. 17:30) para escribir y revisar preocupaciones.
- Durante el día, cualquier pensamiento intrusivo se anota brevemente para revisarse en dicho horario, liberando la atención en el presente.`
      },
      {
        dayNumber: 6,
        title: 'Día 6: Higiene Sensorial y Reducción de Estímulos',
        subtitle: 'Protege tu sistema nervioso de la sobrecarga del entorno',
        readTime: '5 min',
        summary: 'Aprende a identificar detonantes ambientales (pantallas, cafeína, ruido constante) que mantienen tu amígdala encendida.',
        objective: 'Diseñar un entorno sensorialmente amigable para tu descanso mental.',
        sections: [
          {
            id: 'd6-s1',
            title: '1. La sobreestimulación moderna',
            subtitle: 'Demasiadas alertas para un cerebro biológico',
            content: 'El exceso de notificaciones, luz azul nocturna y cafeína después de las 2:00 PM incrementa la línea base de cortisol.',
            bulletPoints: [
              'Regla de los 20 minutos matutinos: no toques el móvil en los primeros 20 minutos tras despertar.',
              'Pausa de luz natural: sal al sol o mira por una ventana 5 minutos por la mañana.',
              'Silencia grupos o notificaciones no urgentes.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Por qué se recomienda evitar pantallas en los primeros 20 minutos de la mañana?',
            options: [
              'Porque la batería se gasta',
              'Porque dispara cortisol y reactividad antes de que tu cerebro alcance un estado de vigilia sereno',
              'Porque daña la vista permanentemente',
              'No tiene ningún efecto'
            ],
            correctAnswerIndex: 1,
            explanation: 'Revisar notificaciones al despertar fuerza al cerebro a un estado de reactividad y estrés desde el inicio del día.'
          },
          {
            id: 2,
            question: '¿Qué hábito matutino ayuda a sincronizar tu reloj biológico y regular la energía?',
            options: [
              'Tomar 5 cafés seguidos',
              'Recibir luz natural en los ojos durante los primeros 30-60 minutos de la mañana',
              'Quedarse en penumbra todo el día',
              'Revisar correos en la cama'
            ],
            correctAnswerIndex: 1,
            explanation: 'La luz solar activa los fotorreceptores que sincronizan el ritmo circadiano y facilitan la producción nocturna de melatonina.'
          },
          {
            id: 3,
            question: '¿A partir de qué hora se sugiere reducir la cafeína para cuidar el descanso?',
            options: ['A las 11:00 PM', 'A partir de las 2:00 PM - 3:00 PM', 'Nunca', 'Solo los domingos'],
            correctAnswerIndex: 1,
            explanation: 'La vida media de la cafeína es de 5 a 7 horas, por lo que consumirla en la tarde interfiere con las fases profundas del sueño.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d6-1',
            title: 'Mañana Sin Pantallas (15 min)',
            description: 'Mañana al despertar, espera 15 minutos antes de revisar redes sociales o mensajes.',
            timeEstimate: '15 min',
            xp: 35
          }
        ],
        fullContextForAI: `Lección del Día 6 de Ansiedad: Higiene Sensorial y Reducción de Estímulos.
Puntos clave:
- El exceso de pantallas, notificaciones y cafeína tardía mantiene la línea base de alerta del sistema nervioso.
- Prácticas recomendadas: 20 minutos sin pantalla al despertar, exposición a luz natural matutina y limitar cafeína tras las 2:00 PM para proteger el ritmo circadiano.`
      },
      {
        dayNumber: 7,
        title: 'Día 7: Tu Botiquín Emocional Personalizado',
        subtitle: 'Plan de consolidación y prevención de recaídas',
        readTime: '6 min',
        summary: 'Integra todo lo aprendido en los 7 días y arma tu kit de herramientas para recurrir a él siempre que lo necesites.',
        objective: 'Tener una guía clara de 3 pasos lista para cuando sientas que la ansiedad regresa.',
        sections: [
          {
            id: 'd7-s1',
            title: '1. La regla de las 3 C: Cuerpo, Cabeza y Conexión',
            subtitle: 'Tu protocolo de emergencia en 3 pasos',
            content: 'Cuando notes que la ansiedad se asoma en el futuro, sigue esta secuencia:',
            bulletPoints: [
              'Paso 1 (Cuerpo): 3 Suspiros Fisiológicos y soltar la mandíbula.',
              'Paso 2 (Cabeza): Preguntarte "¿Qué es lo que verdaderamente puedo controlar hoy?".',
              'Paso 3 (Conexión): Hablar con alguien de confianza o registrar tu emoción en el diario de FluxGlow.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es el primer paso del protocolo de las 3 C?',
            options: [
              'Pensar en todas tus metas del año',
              'Cuerpo: regular la respiración con el Suspiro Fisiológico y soltar tensión física',
              'Criticarte por sentirte ansioso',
              'Aislarte por completo'
            ],
            correctAnswerIndex: 1,
            explanation: 'Primero estabilizamos la biología del cuerpo para que la mente pueda recuperar la claridad.'
          },
          {
            id: 2,
            question: 'Tener un mal día después de completar el curso significa que:',
            options: [
              'El curso no sirvió',
              'Es un proceso humano normal; la clave no es nunca sentir ansiedad, sino saber cómo acompañarte cuando aparece',
              'Debes empezar de cero',
              'La ansiedad es invencible'
            ],
            correctAnswerIndex: 1,
            explanation: 'La regulación emocional es una práctica continua. Los altibajos son normales y ahora cuentas con herramientas prácticas.'
          },
          {
            id: 3,
            question: '¿Qué función cumple tu botiquín emocional?',
            options: [
              'Contener medicamentos',
              'Tener a la mano un conjunto claro de técnicas probadas para autorregularte sin entrar en pánico',
              'Evitar todas las emociones humanas',
              'Ninguna'
            ],
            correctAnswerIndex: 1,
            explanation: 'Tener un plan predefinido evita la parálisis de decisión durante momentos de estrés.'
          }
        ],
        missions: [
          {
            id: 'm-ans-d7-1',
            title: 'Graduación y Botiquín Emocional',
            description: 'Escribe en tu diario tus 3 herramientas favoritas aprendidas en este programa de 7 días.',
            timeEstimate: '5 min',
            xp: 50
          }
        ],
        fullContextForAI: `Lección del Día 7 de Ansiedad: Botiquín Emocional y Consolidación.
Puntos clave:
- Protocolo de las 3 C: Cuerpo (suspiro fisiológico y relajar mandíbula), Cabeza (preguntar qué controlo hoy) y Conexión (hablar con un amigo o escribir en el diario).
- La meta no es eliminar todas las emociones incómodas para siempre, sino responder a ellas con herramientas y autocompasión.
- Un botiquín emocional listo reduce la incertidumbre ante futuros retos.`
      }
    ]
  },
  {
    id: 'course-estres-7d',
    badge: 'Curso Completo 7 Días',
    title: 'Programa 7 Días: Productividad Consciente y Cero Burnout',
    subtitle: 'Aprende a gestionar tu carga académica y laboral cuidando tu salud mental y energía vital.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    category: 'Estrés',
    author: 'FluxGlow Academia de Productividad Sostenible',
    totalDays: 7,
    difficulty: 'Intermedio',
    targetAudience: 'Estudiantes y profesionales que sienten sobrecarga de tareas, procrastinación o fatiga crónica.',
    description: 'Curso estructurado en 7 lecciones interactivas para desarmar la parálisis por perfeccionismo, organizar tus bloques de trabajo con la técnica Pomodoro consciente y proteger tus tiempos de descanso sin culpa.',
    learningOutcomes: [
      'Eliminar la fricción inicial para comenzar tareas pendientes en menos de 2 minutos.',
      'Construir un sistema de descarga mental para liberar RAM cognitiva.',
      'Aprender a decir no asertivamente y poner límites sin remordimiento.',
      'Reducir el cortisol durante épocas de parciales y entregas exigentes.'
    ],
    days: [
      {
        dayNumber: 1,
        title: 'Día 1: El Mito de la Productividad Lineal',
        subtitle: 'Tu energía es cíclica, no una máquina constante',
        readTime: '5 min',
        summary: 'Comprende por qué forzarte a rendir igual 12 horas al día provoca agotamiento y cómo trabajar con tus ritmos naturales.',
        objective: 'Aprender a identificar tus picos de energía alta vs momentos de descanso pasivo.',
        sections: [
          {
            id: 'e1-s1',
            title: '1. La trampa del agotamiento crónico',
            subtitle: 'Hacer más no siempre es avanzar más',
            content: 'El cerebro humano funciona en ciclos ultradianos de aproximadamente 90 minutos de concentración seguidos de una necesidad biológica de recuperación de 15 minutos.',
            bulletPoints: [
              'Trabajar sin pausas reduce la creatividad y duplica el tiempo necesario para resolver tareas complejas.',
              'El descanso no es un premio que te ganas al terminar todo; es el combustible necesario para poder empezar bien.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Aproximadamente cuánto dura un ciclo ultradiano de concentración óptima?',
            options: ['10 horas continuas', 'Aproximadamente 90 minutos', '5 minutos', '3 días'],
            correctAnswerIndex: 1,
            explanation: 'La neurociencia demuestra que el foco sostenido de alta calidad decae después de 90 a 120 minutos continuos.'
          },
          {
            id: 2,
            question: '¿Qué es el descanso en el modelo de productividad consciente?',
            options: [
              'Una pérdida de tiempo',
              'Un requisito biológico indispensable para el rendimiento y la salud mental',
              'Algo que solo haces cuando estás enfermo',
              'Un premio que solo mereces si terminas todo'
            ],
            correctAnswerIndex: 1,
            explanation: 'El descanso activo restaura neurotransmisores como la dopamina y la acetilcolina necesarios para el foco.'
          },
          {
            id: 3,
            question: '¿Qué sucede si trabajas durante horas ignorando las señales de fatiga?',
            options: [
              'Te vuelves invencible',
              'Aumentan los errores, la frustración y el riesgo de burnout',
              'Terminas todo en la mitad del tiempo',
              'Tu memoria mejora'
            ],
            correctAnswerIndex: 1,
            explanation: 'La fatiga cognitiva no atendida genera parálisis por análisis y desgaste emocional.'
          }
        ],
        missions: [
          {
            id: 'm-est-d1-1',
            title: 'Monitoreo de Energía en 3 Momentos',
            description: 'Califica tu nivel de energía del 1 al 5 en la mañana, tarde y noche en el diario.',
            timeEstimate: '3 min',
            xp: 25
          }
        ],
        fullContextForAI: `Lección del Día 1 de Estrés: El Mito de la Productividad Lineal.
Contenido de la lección:
- Los seres humanos operamos en ritmos ultradianos de 90 minutos de foco y requieren pausas de 15 minutos.
- El descanso es biológicamente necesario y no un lujo prescindible.
- Forzar la productividad continua causa saturación y errores frecuentes.`
      },
      {
        dayNumber: 2,
        title: 'Día 2: La Técnica de Fricción Cero',
        subtitle: 'Cómo romper la parálisis y empezar en 120 segundos',
        readTime: '5 min',
        summary: 'La mayor parte de la procrastinación no es pereza, sino ansiedad ante el tamaño percibido de una tarea.',
        objective: 'Aprender la regla de los 2 minutos para iniciar cualquier tarea postergada.',
        sections: [
          {
            id: 'e2-s1',
            title: '1. Desactivar el miedo al tamaño de la tarea',
            subtitle: 'Hazlo ridículamente pequeño',
            content: 'Cuando una tarea parece gigante ("escribir una tesis de 30 páginas"), el cerebro la percibe como una amenaza. Reduce la tarea al primer micro-paso físico.',
            bulletPoints: [
              'No te propongas "escribir todo el informe", proponte "abrir el documento y escribir el título".',
              'Regla de los 2 minutos: comprométete a trabajar en ello solo durante 120 segundos. Una vez rota la inercia, continuar es 80% más fácil.'
            ]
          }
        ],
        quiz: [
          {
            id: 1,
            question: '¿Cuál es la causa psicológica más frecuente detrás de la procrastinación?',
            options: [
              'Falta total de inteligencia',
              'Ansiedad o abrumo ante la magnitud o incertidumbre de la tarea',
              'Mala memoria genética',
              'Demasiada energía'
            ],
            correctAnswerIndex: 1,
            explanation: 'Procrastinar es una estrategia de evitación emocional ante la incomodidad o el miedo al error.'
          },
          {
            id: 2,
            question: '¿En qué consiste la regla de los 2 minutos?',
            options: [
              'Terminar todos tus trabajos en 2 minutos',
              'Comprometerte a realizar solo el primer micro-paso durante 120 segundos para romper la inercia',
              'Dormir 2 minutos cada hora',
              'Esperar 2 minutos antes de responder llamadas'
            ],
            correctAnswerIndex: 1,
            explanation: 'Reducir el umbral de entrada rompe la resistencia inicial del cerebro.'
          },
          {
            id: 3,
            question: 'Un ejemplo de micro-paso de fricción cero es:',
            options: [
              'Aprender 5 idiomas hoy',
              'Abrir el archivo y escribir 1 solo párrafo',
              'Completar un curso entero de 40 horas en la noche',
              'Estudiar sin parpadear'
            ],
            correctAnswerIndex: 1,
            explanation: 'Un micro-paso debe ser tan sencillo que no genere resistencia cognitiva.'
          }
        ],
        missions: [
          {
            id: 'm-est-d2-1',
            title: 'Aplica la Regla de los 2 Minutos',
            description: 'Elige una tarea que lleves días postergando y trabaja en ella exactamente por 2 minutos.',
            timeEstimate: '2 min',
            xp: 30
          }
        ],
        fullContextForAI: `Lección del Día 2 de Estrés: Técnica de Fricción Cero.
Puntos clave:
- Procrastinar es un mecanismo de regulación emocional ante la sensación de abrumo.
- Regla de los 2 minutos: definir el micro-paso más simple y actuar durante 120 segundos para romper la inercia.
- Al comenzar, el cerebro supera la resistencia inicial y resulta mucho más fácil continuar.`
      }
    ]
  }
];
