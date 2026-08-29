import { InstantPracticeItem } from '../types';

export const INSTANT_PRACTICES_CATALOG: InstantPracticeItem[] = [
  {
    id: 'practice-breathing-oasis',
    title: 'Oasis de Respiración Rítmica',
    shortDesc: 'Regula tu sistema nervioso en vivo con Suspiro Fisiológico, técnica 4-7-8 o Respiración Cuadrada.',
    badge: '⚡ Práctica al Instante',
    category: 'Ansiedad',
    duration: '2 min',
    type: 'breathing',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    benefits: [
      'Reduce la frecuencia cardíaca en menos de 90 segundos',
      'Desactiva la respuesta de lucha o huida de la amígdala',
      'Aumenta la oxigenación cerebral y el tono vagal'
    ]
  },
  {
    id: 'practice-focus-timer',
    title: 'Temporizador de Enfoque & Reset Mental',
    shortDesc: 'Sesiones de enfoque profundo (Pomodoro) y pausas de desconexión consciente con campana tibetana.',
    badge: '⚡ Práctica al Instante',
    category: 'Productividad Consciente',
    duration: '3-25 min',
    type: 'focus_timer',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
    benefits: [
      'Elimina la fatiga por multitarea y dispersión',
      'Marca límites claros entre trabajo y descanso',
      'Promueve estados de flujo mental sostenido'
    ]
  },
  {
    id: 'practice-grounding-54321',
    title: 'Anclaje Somático 5-4-3-2-1',
    shortDesc: 'Detén la sobrecarga y la rumiación conectando progresivamente con tus 5 sentidos en tiempo real.',
    badge: '⚡ Práctica al Instante',
    category: 'Mindfulness',
    duration: '3 min',
    type: 'grounding',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    benefits: [
      'Corta de raíz los bucles de sobrepensamiento',
      'Reconecta tu mente con el entorno físico real',
      'Aumenta la presencia y la sensación de seguridad corporal'
    ]
  },
  {
    id: 'practice-stress-release',
    title: 'Botón de Descompresión Antiestrés',
    shortDesc: 'Mantén presionado para disolver la tensión física acumulada y recibir un anclaje cognitivo calmante.',
    badge: '⚡ Práctica al Instante',
    category: 'Estrés',
    duration: '1 min',
    type: 'stress_release',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    benefits: [
      'Alivia la rigidez en mandíbula, cuello y hombros',
      'Ofrece una pausa háptica e interactiva inmediata',
      'Reformula pensamientos de urgencia o autoexigencia'
    ]
  },
  {
    id: 'practice-gratitude-express',
    title: 'Diario de Gratitud Express (60s)',
    shortDesc: '3 preguntas micro-guiadas para estimular la liberación natural de dopamina y cerrar tu jornada.',
    badge: '⚡ Práctica al Instante',
    category: 'Autoestima',
    duration: '1 min',
    type: 'gratitude_express',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    benefits: [
      'Entrena el sesgo positivo del cerebro',
      'Fomenta la autocompasión y la apreciación del progreso',
      'Mejora el estado de ánimo antes de dormir'
    ]
  }
];
