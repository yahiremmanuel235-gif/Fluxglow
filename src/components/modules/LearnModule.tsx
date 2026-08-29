import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Heart, 
  MoreVertical, 
  Play, 
  Pause, 
  X, 
  BookOpen, 
  CheckCircle2, 
  SlidersHorizontal,
  FolderOpen,
  RotateCcw,
  Volume2,
  Share2,
  BookmarkCheck,
  Check,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { useToast } from '../common/Toast';
import { PSYCHOLOGICAL_TESTS } from '../../data/mockData';
import { PsychologicalTest } from '../../types';

interface GuideItem {
  id: string;
  badge: string;
  title: string;
  image: string;
  isFavorite?: boolean;
  category: string;
  author: string;
  readTime: string;
  content: string[];
}

interface VideoPodcastItem {
  id: string;
  title: string;
  author: string;
  duration: string;
  views: string;
  timeAgo: string;
  image: string;
  type: 'video' | 'podcast';
  category: string;
  url?: string;
  description: string;
}

// Master Recommended Guides Catalog
const ALL_RECOMMENDED_GUIDES: GuideItem[] = [
  {
    id: 'rec-1',
    badge: 'Domina tu mente',
    title: '5 estrategias infalibles para eliminar el estrés antes de que te controle.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    category: 'Estrés',
    author: 'Dra. Sofía Mendoza',
    readTime: '6 min',
    content: [
      'El estrés prolongado eleva los niveles de cortisol y disminuye la capacidad de toma de decisiones racionales.',
      '1. Regla de los 2 minutos: Si una tarea estresante toma menos de 2 minutos, hazla inmediatamente para reducir la rumiación.',
      '2. Respiración de diafragma 4-7-8 para activar el sistema parasimpático.',
      '3. Descarga cognitiva en papel antes de dormir.',
      '4. Establece pausas activas cada 90 minutos de trabajo continuo.',
      '5. Reencuadre cognitivo: Pregúntate "¿Qué es lo peor que puede pasar y cómo lo resolvería?"'
    ]
  },
  {
    id: 'rec-2',
    badge: 'El arte de la calma',
    title: 'Cómo transformar la ansiedad en tu mayor motor de productividad.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    category: 'Ansiedad',
    author: 'Lic. Andrés Valenzuela',
    readTime: '8 min',
    content: [
      'La ansiedad es energía fisiológica en búsqueda de dirección.',
      'Canalizar la alerta simpática hacia tareas de alta concentración con bloques de tiempo Pomodoro.',
      'Etiqueta tus emociones: Nombrar lo que sientes disminuye la reactividad de la amígdala cerebral.',
      'Crea rituales de inicio y cierre de jornada laboral para evitar la sobrecarga mental.'
    ]
  },
  {
    id: 'rec-3',
    badge: 'Organización sin caos',
    title: 'El método definitivo para ordenar tu vida y liberar tu carga mental..',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
    category: 'Productividad Consciente',
    author: 'Coach Elena Ramos',
    readTime: '5 min',
    content: [
      'La mente está hecha para tener ideas, no para almacenarlas.',
      'Aplica la matriz de Eisenhower para diferenciar lo urgente de lo verdaderamente importante.',
      'Audita tus ladrones de tiempo digitales desactivando notificaciones no esenciales.',
      'Establece un "Inbox Zero" emocional escribiendo tus preocupaciones antes de planificar la semana.'
    ]
  },
  {
    id: 'rec-4',
    badge: 'Enfoque blindado',
    title: 'Cómo recuperar tu concentración en un mundo lleno de distracciones.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    category: 'Productividad Consciente',
    author: 'Dr. Fernando Ortiz',
    readTime: '7 min',
    content: [
      'El costo del cambio de contexto consume hasta el 40% de tu energía productiva diaria.',
      'Trabajo profundo (Deep Work): Bloques de 90 minutos sin interrupciones con objetivos de un solo entregable.',
      'Espacio de trabajo minimalista: Reduce los estímulos visuales en tu campo periférico.',
      'Entrena tu tolerancia al aburrimiento sin revisar el teléfono en momentos de espera.'
    ]
  },
  {
    id: 'rec-5',
    badge: 'Mentalidad ganadora',
    title: 'Desarrolla una mentalidad fuerte y alcanza tus metas sin límites.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    category: 'Autoestima',
    author: 'Dra. Marcela Silva',
    readTime: '9 min',
    content: [
      'La mentalidad de crecimiento (Growth Mindset) interpreta el error como información de ajuste.',
      'Construye resiliencia a través del diálogo interno constructivo y la compasión hacia uno mismo.',
      'Mide tu progreso respecto a tu punto de partida anterior, no en comparación externa.',
      'Celebra las pequeñas victorias para retroalimentar positivamente la dopamina natural.'
    ]
  },
  {
    id: 'rec-6',
    badge: 'Paz en el Presente',
    title: 'Mindfulness para principiantes: Calma tu diálogo interno en 5 minutos.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    category: 'Mindfulness',
    author: 'Prof. Carlos Samudio',
    readTime: '5 min',
    content: [
      'La atención plena no consiste en poner la mente en blanco, sino en observar pensamientos sin apegarse.',
      'Técnica de anclaje de los 5 sentidos (5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas).',
      'Atención a la respiración diafragmática para detener la rumiación de escenarios futuros.'
    ]
  },
  {
    id: 'rec-7',
    badge: 'Noches Profundas',
    title: 'Higiene del sueño: El protocolo definitivo para un descanso reparador.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80',
    category: 'Sueño Reparador',
    author: 'Dr. Roberto Galván',
    readTime: '6 min',
    content: [
      'La calidad del sueño regula directamente la amígdala cerebral y la tolerancia a la frustración.',
      'Desconexión de pantallas 45 minutos antes de acostarse para permitir la secreción de melatonina.',
      'Mantener la habitación a temperatura fresca (18-20°C) y en completa oscuridad.',
      'Evitar cafeína y comidas pesadas después de las 4:00 PM.'
    ]
  }
];

// Master Popular Guides Catalog
const ALL_POPULAR_GUIDES: GuideItem[] = [
  {
    id: 'pop-1',
    badge: 'Energía imparable',
    title: 'Rutinas simples para tener más energía física y mental todos los días.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
    category: 'Estrés',
    author: 'Lic. Javier Romero',
    readTime: '6 min',
    content: [
      'La energía no se crea esperando la motivación, sino mediante la acción fisiológica alineada.',
      'Hidratación con electrolitos en la primera media hora tras despertar.',
      'Luz solar directa en los ojos durante 10 minutos para calibrar el ritmo circadiano.',
      'Movimiento de baja intensidad antes de iniciar el trabajo intelectual.'
    ]
  },
  {
    id: 'pop-2',
    badge: 'Crecimiento personal',
    title: 'Pequeños cambios que construyen tu mejor versión cada día.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    category: 'Autoestima',
    author: 'Dra. Carolina Paz',
    readTime: '7 min',
    content: [
      'La regla del 1% de mejora diaria produce un rendimiento 37 veces superior al cabo de un año.',
      'Aceptación radical: Reconoce tus circunstancias presentes sin juicio para poder cambiarlas.',
      'Auditoría de relaciones: Rodéate de personas que eleven tus estándares y apoyen tu paz mental.'
    ]
  },
  {
    id: 'pop-3',
    badge: 'Nutre tu cuerpo',
    title: 'Hábitos de alimentación que potencian tu mente y tu bienestar.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    category: 'Inteligencia Emocional',
    author: 'Nut. Mariana Vega',
    readTime: '8 min',
    content: [
      'El eje intestino-cerebro produce más del 90% de la serotonina corporal.',
      'Alimentos ricos en ácidos grasos Omega-3 (salmón, nueces, chía) para desinflamar el tejido neuronal.',
      'Reducción de azúcares refinados para evitar picos de insulina y caídas bruscas de ánimo por la tarde.',
      'Microbiota diversa: Incorpora fermentados y fibra prebiótica a diario.'
    ]
  },
  {
    id: 'pop-4',
    badge: 'Mejora tus hábitos',
    title: 'Cómo aplicar el método de Hábitos Atómicos para construir mejores hábitos.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    category: 'Productividad Consciente',
    author: 'Resumen Libro James Clear',
    readTime: '10 min',
    content: [
      'Las 4 leyes del cambio de conducta: Hazlo obvio, hazlo atractivo, hazlo fácil y hazlo satisfactorio.',
      'Apilamiento de hábitos: "Después de [Hábito actual], voy a [Hábito nuevo]".',
      'Diseño de entorno: Modifica tu espacio físico para que la buena conducta tenga menor fricción.'
    ]
  },
  {
    id: 'pop-5',
    badge: 'Vínculos Seguros',
    title: 'Límites saludables: Cómo decir que no sin culpa y proteger tu bienestar.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    category: 'Relaciones Sanas',
    author: 'Psic. Laura Domínguez',
    readTime: '7 min',
    content: [
      'Poner límites no es atacar al otro, es cuidar la relación contigo mismo.',
      'Diferencia entre culpa adaptativa y culpa aprendida por complacencia excesiva.',
      'Fórmulas asertivas: "Valoro tu invitación/pedido, pero en este momento no puedo comprometerme."'
    ]
  },
  {
    id: 'pop-6',
    badge: 'Sanar el Corazón',
    title: 'Procesando el duelo y la pérdida: Cómo reconstruirte paso a paso.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
    category: 'Duelo y Pérdida',
    author: 'Dra. Gabriela Fuentes',
    readTime: '8 min',
    content: [
      'El dolor por una pérdida no es lineal; tiene olas de intensidad.',
      'Permítete sentir la tristeza sin forzarte a estar bien de inmediato.',
      'Honra los recuerdos creando rituales significativos y apóyate en tu red de contención.'
    ]
  }
];

// Master Media Catalog (Videos & Podcasts)
const ALL_VERIFIED_MEDIA: VideoPodcastItem[] = [
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
    description: 'Una visión médica e integrativa sobre las causas del incremento del sufrimiento psíquico en la sociedad moderna y claves para recuperar la salud emocional.'
  },
  {
    id: 'media-5',
    title: 'Meditación Guiada para Soltar la Sobrecarga Mental y Dormir Profundo',
    author: 'Centro Mindfulness',
    duration: '18:40',
    views: '42 K vistas',
    timeAgo: 'hace 2 semanas',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    type: 'podcast',
    category: 'Sueño Reparador',
    description: 'Sesión inmersiva con frecuencias sonoras suaves y escaneo corporal guiado para inducir el descanso fisiológico reparador.'
  },
  {
    id: 'media-6',
    title: 'Inteligencia Emocional en el Trabajo: Cómo gestionar la frustración',
    author: 'Dr. Mario Alonso Puig',
    duration: '15:10',
    views: '110 K vistas',
    timeAgo: 'hace 5 meses',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    type: 'video',
    category: 'Inteligencia Emocional',
    description: 'Estrategias de neurociencia aplicada para mantener la serenidad ante la presión y transformar el miedo en empuje constructivo.'
  }
];

const CATEGORY_CHIPS = [
  'Ansiedad',
  'Estrés',
  'Autoestima',
  'Mindfulness',
  'Sueño Reparador',
  'Inteligencia Emocional',
  'Relaciones Sanas',
  'Productividad Consciente',
  'Duelo y Pérdida'
];

export const LearnModule: React.FC = () => {
  const { warning, success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  
  // Active reading modal
  const [activeGuide, setActiveGuide] = useState<GuideItem | null>(null);
  
  // Video player modal
  const [activeMedia, setActiveMedia] = useState<VideoPodcastItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Psychological test modal
  const [activeTest, setActiveTest] = useState<PsychologicalTest | null>(null);
  const [testAnswers, setTestAnswers] = useState<{ [qId: number]: number }>({});
  const [testResult, setTestResult] = useState<any | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({
    'rec-1': true,
    'pop-2': true,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = !prev[id];
      if (next) {
        success('Guardado en favoritos', 'Recurso añadido a tu colección.');
      } else {
        info('Eliminado de favoritos', 'Recurso retirado de favoritos.');
      }
      return { ...prev, [id]: next };
    });
  };

  // String normalizer for accent-free search
  const normalize = (str: string) => 
    (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // Filter Helper
  const matchesSearchAndCategory = (item: { 
    title: string; 
    badge?: string; 
    category: string; 
    author?: string; 
    content?: string[]; 
    description?: string;
  }) => {
    // Category match
    if (selectedCategory && selectedCategory !== 'todos') {
      const nCat = normalize(selectedCategory);
      const itemCat = normalize(item.category);
      const itemTitle = normalize(item.title);
      const itemBadge = normalize(item.badge || '');
      if (!itemCat.includes(nCat) && !itemTitle.includes(nCat) && !itemBadge.includes(nCat)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = normalize(searchQuery);
      const titleMatch = normalize(item.title).includes(q);
      const badgeMatch = normalize(item.badge || '').includes(q);
      const catMatch = normalize(item.category).includes(q);
      const authorMatch = normalize(item.author || '').includes(q);
      const descMatch = normalize(item.description || '').includes(q);
      const contentMatch = item.content?.some(p => normalize(p).includes(q)) || false;

      if (!titleMatch && !badgeMatch && !catMatch && !authorMatch && !descMatch && !contentMatch) {
        return false;
      }
    }

    return true;
  };

  // Filtered lists based on Category, Search Query & Format
  const filteredRecommended = useMemo(() => {
    if (selectedFormat === 'videos' || selectedFormat === 'podcasts') {
      return [];
    }
    return ALL_RECOMMENDED_GUIDES.filter(matchesSearchAndCategory);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const filteredPopular = useMemo(() => {
    if (selectedFormat === 'videos' || selectedFormat === 'podcasts') {
      return [];
    }
    return ALL_POPULAR_GUIDES.filter(matchesSearchAndCategory);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const filteredMedia = useMemo(() => {
    if (selectedFormat === 'articulos' || selectedFormat === 'guias') {
      return [];
    }
    return ALL_VERIFIED_MEDIA.filter(item => {
      if (selectedFormat === 'videos' && item.type !== 'video') return false;
      if (selectedFormat === 'podcasts' && item.type !== 'podcast') return false;
      return matchesSearchAndCategory(item);
    });
  }, [searchQuery, selectedCategory, selectedFormat]);

  const totalResultsCount = filteredRecommended.length + filteredPopular.length + filteredMedia.length;
  const isAnyFilterActive = searchQuery.trim() !== '' || selectedCategory !== 'todos' || selectedFormat !== 'todos';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSelectedFormat('todos');
  };

  const handleCategorySelect = (cat: string) => {
    if (selectedCategory.toLowerCase() === cat.toLowerCase()) {
      setSelectedCategory('todos');
    } else {
      setSelectedCategory(cat);
    }
  };

  // Psychological Test Handlers
  const handleStartTest = (test: PsychologicalTest) => {
    setActiveTest(test);
    setTestAnswers({});
    setTestResult(null);
  };

  const handleSelectAnswer = (questionId: number, value: number) => {
    setTestAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFinishTest = () => {
    if (!activeTest) return;
    const answeredCount = Object.keys(testAnswers).length;
    if (answeredCount < activeTest.questions.length) {
      warning('Preguntas incompletas', `Por favor responde las ${activeTest.questions.length} preguntas para obtener un resultado preciso.`);
      return;
    }

    const totalScore = (Object.values(testAnswers) as number[]).reduce((sum: number, val: number) => sum + (val || 0), 0);
    const matchedInterpretation = activeTest.interpretations.find(
      inter => totalScore >= inter.minScore && totalScore <= inter.maxScore
    ) || activeTest.interpretations[activeTest.interpretations.length - 1];

    setTestResult({
      score: totalScore,
      interpretation: matchedInterpretation
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Top Header Row with Pill Buttons & Center Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          
          {/* Left Pill: Filtros */}
          <button
            id="filters-btn"
            onClick={() => setShowFiltersModal(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-2 cursor-pointer ${
              selectedFormat !== 'todos' 
                ? 'bg-[#43705a] ring-2 ring-[#548c71]/40 text-white' 
                : 'bg-[#548c71] hover:bg-[#43705a] text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
            {selectedFormat !== 'todos' && (
              <span className="w-2 h-2 rounded-full bg-amber-300"></span>
            )}
          </button>

          {/* Center Brand Logo */}
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          {/* Right Pill: Categorías */}
          <button
            id="categories-btn"
            onClick={() => setShowCategoriesModal(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory !== 'todos' 
                ? 'bg-[#c55835] ring-2 ring-[#de6943]/40 text-white' 
                : 'bg-[#de6943] hover:bg-[#c55835] text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Todas las Categorías</span>
            {selectedCategory !== 'todos' && (
              <span className="w-2 h-2 rounded-full bg-yellow-200"></span>
            )}
          </button>
        </div>

        {/* Big Display Title: Explora y Aprende */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Explora y </span>
            <span className="text-[#de6943]">Aprende</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl mx-auto">
            Recursos psicoeducativos, guías prácticas y contenido respaldado por profesionales de la salud mental.
          </p>
        </div>

        {/* Centered Search Pill */}
        <div className="max-w-xl mx-auto mb-4">
          <div className="relative flex items-center bg-white rounded-full border border-stone-300 shadow-xs px-4 py-2.5 hover:border-stone-400 focus-within:border-[#548c71] focus-within:ring-2 focus-within:ring-[#548c71]/20 transition-all">
            <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
            <input
              id="search-guides-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por tema (ej. estrés, ansiedad, sueño, hábitos)..."
              className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-600 p-1 mr-1 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => {
                const terms = ['Estrés', 'Ansiedad', 'Mindfulness', 'Autoestima', 'Sueño'];
                const randomTerm = terms[Math.floor(Math.random() * terms.length)];
                setSearchQuery(randomTerm);
              }}
              className="text-stone-400 hover:text-[#548c71] p-1 shrink-0 transition-colors cursor-pointer"
              title="Sugerir tema con IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Quick Category Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Todos
          </button>
          {CATEGORY_CHIPS.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#548c71] text-white shadow-2xs ring-2 ring-[#548c71]/30'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicators Bar */}
        {isAnyFilterActive && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-8 animate-in fade-in duration-200">
            <span className="text-xs text-stone-500 font-medium">Filtrando:</span>
            
            {selectedCategory !== 'todos' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e07a52]/15 text-[#c8633c] border border-[#e07a52]/30">
                Categoría: {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('todos')} 
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedFormat !== 'todos' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#5a8c72]/15 text-[#48725c] border border-[#5a8c72]/30">
                Formato: {selectedFormat}
                <button 
                  onClick={() => setSelectedFormat('todos')} 
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-200 text-stone-800">
                "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button 
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-semibold ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros ({totalResultsCount} resultados)</span>
            </button>
          </div>
        )}

        {/* EMPTY STATE IF NO MATCHES */}
        {totalResultsCount === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs my-8 max-w-xl mx-auto animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              No se encontraron contenidos
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mb-5">
              No hay guías, podcasts o videos que coincidan con <strong>"{searchQuery || selectedCategory}"</strong>.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#5a8c72] hover:bg-[#48725c] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver todo el catálogo</span>
            </button>
          </div>
        )}

        {/* Section 1: Guías recomendadas */}
        {filteredRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Guías recomendadas:</span>
                <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {filteredRecommended.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {filteredRecommended.map((guide) => {
                const isFav = favorites[guide.id];
                return (
                  <div 
                    key={guide.id}
                    id={`guide-rec-${guide.id}`}
                    onClick={() => setActiveGuide(guide)}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Card Box with Rounded Border */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-sm group-hover:shadow-md transition-all bg-stone-100">
                      <img
                        src={guide.image}
                        alt={guide.badge}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Floating Pill */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
                        <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-semibold px-3 py-1 rounded-full border border-stone-300 shadow-xs whitespace-nowrap">
                          {guide.badge}
                        </span>
                      </div>

                      {/* Bottom Right Favorite Heart */}
                      <button
                        onClick={(e) => toggleFavorite(guide.id, e)}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Guardar favorito"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'text-red-500 fill-red-500' : 'text-stone-400'
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Subtitle / Description text below card */}
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold text-[#5a8c72] uppercase tracking-wider">
                        {guide.category} • {guide.readTime}
                      </span>
                      <p className="text-xs sm:text-[13px] font-medium text-stone-700 leading-snug line-clamp-2 group-hover:text-stone-900 mt-0.5">
                        {guide.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Guías populares */}
        {filteredPopular.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Guías populares:</span>
                <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {filteredPopular.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {filteredPopular.map((guide) => {
                const isFav = favorites[guide.id];
                return (
                  <div 
                    key={guide.id}
                    id={`guide-pop-${guide.id}`}
                    onClick={() => setActiveGuide(guide)}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Card Box with Rounded Border */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-800 shadow-sm group-hover:shadow-md transition-all bg-stone-100">
                      <img
                        src={guide.image}
                        alt={guide.badge}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Floating Pill */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
                        <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-semibold px-3 py-1 rounded-full border border-stone-300 shadow-xs whitespace-nowrap">
                          {guide.badge}
                        </span>
                      </div>

                      {/* Bottom Right Favorite Heart */}
                      <button
                        onClick={(e) => toggleFavorite(guide.id, e)}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Guardar favorito"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isFav ? 'text-red-500 fill-red-500' : 'text-stone-400'
                          }`} 
                        />
                      </button>
                    </div>

                    {/* Subtitle / Description text below card */}
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold text-[#e07a52] uppercase tracking-wider">
                        {guide.category} • {guide.readTime}
                      </span>
                      <p className="text-xs sm:text-[13px] font-medium text-stone-700 leading-snug line-clamp-2 group-hover:text-stone-900 mt-0.5">
                        {guide.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Videos y podcast de psicólogos verificados */}
        {filteredMedia.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Videos y podcasts de psicólogos verificados:</span>
                <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {filteredMedia.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  id={`media-${media.id}`}
                  onClick={() => setActiveMedia(media)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Thumbnail box */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={media.image}
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    
                    {/* Play badge overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                    </div>

                    {/* Type badge top left */}
                    <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {media.type === 'video' ? '🎬 Video' : '🎙️ Podcast'}
                    </div>

                    {/* Duration timestamp badge bottom right */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {media.duration}
                    </div>
                  </div>

                  {/* Details below thumbnail */}
                  <div className="flex items-start justify-between gap-2 mt-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase">
                        {media.category}
                      </span>
                      <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-[#5a8c72] mt-0.5">
                        {media.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {media.author} • {media.views}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigator.clipboard?.writeText(window.location.href);
                        success('Enlace copiado', `Listo para compartir: ${media.title}`); 
                      }}
                      className="text-stone-400 hover:text-stone-600 p-1 shrink-0 cursor-pointer"
                      title="Compartir recurso"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Más categorías y tests orientativos */}
        <div className="pt-6 border-t border-[#ece4d9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Explorar por categorías de bienestar:
              </h2>
              <p className="text-xs text-stone-500">
                Haz clic en una categoría para filtrar todo el catálogo en tiempo real.
              </p>
            </div>
            
            <button
              id="view-all-tests-btn"
              onClick={() => handleStartTest(PSYCHOLOGICAL_TESTS[0])}
              className="text-xs font-bold text-[#5a8c72] hover:text-[#48725c] hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Realizar Test de Ansiedad (GAD-7)</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-300 hover:border-stone-400'
              }`}
            >
              Todos los temas
            </button>

            {CATEGORY_CHIPS.map((chip, idx) => {
              const isSelected = selectedCategory.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => handleCategorySelect(chip)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#5a8c72] text-white shadow-sm ring-2 ring-[#5a8c72]/30'
                      : 'bg-white border border-stone-300 hover:border-[#5a8c72] hover:text-[#5a8c72] text-stone-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Guide Reader Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#e8f1ec] text-[#5a8c72]">
                {activeGuide.badge} • {activeGuide.category}
              </span>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="my-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {activeGuide.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
                <span>Por <strong>{activeGuide.author}</strong></span>
                <span>•</span>
                <span>{activeGuide.readTime} de lectura</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
              <img
                src={activeGuide.image}
                alt={activeGuide.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
              {activeGuide.content.map((p, idx) => (
                <p key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setFavorites(prev => ({ ...prev, [activeGuide.id]: !prev[activeGuide.id] }));
                }}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${favorites[activeGuide.id] ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{favorites[activeGuide.id] ? 'Guardado en favoritos' : 'Guardar guía'}</span>
              </button>
              
              <button
                onClick={() => setActiveGuide(null)}
                className="bg-[#5a8c72] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#48725c] transition-colors cursor-pointer"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Player Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {activeMedia.type === 'video' ? '🎬 Video Conferencia' : '🎙️ Podcast Psicológico'} • {activeMedia.category}
              </span>
              <button
                onClick={() => setActiveMedia(null)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="my-4 aspect-video rounded-2xl overflow-hidden relative bg-black flex items-center justify-center">
              <img
                src={activeMedia.image}
                alt={activeMedia.title}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute w-16 h-16 rounded-full bg-[#5a8c72] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-300 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                <span>{isPlaying ? 'Reproduciendo audio HD' : 'Pausado'}</span>
                <span className="font-mono">{activeMedia.duration}</span>
              </div>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold mb-1">
              {activeMedia.title}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Por <strong>{activeMedia.author}</strong> • {activeMedia.views}
            </p>
            <p className="text-xs sm:text-sm text-stone-300 bg-stone-800/80 p-3.5 rounded-xl leading-relaxed border border-stone-700/50">
              {activeMedia.description}
            </p>
          </div>
        </div>
      )}

      {/* Psychological Test Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">{activeTest.title}</h3>
                <p className="text-xs text-stone-500">{activeTest.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveTest(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!testResult ? (
              <div className="py-4 space-y-6">
                <p className="text-xs text-stone-600 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                  {activeTest.instructions}
                </p>

                {activeTest.questions.map((q) => (
                  <div key={q.id} className="space-y-2 pb-4 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-800">
                      {q.id}. {q.text}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {q.options.map((opt) => {
                        const isSelected = testAnswers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt.value)}
                            className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#5a8c72] text-white border-[#5a8c72] shadow-xs'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleFinishTest}
                  className="w-full bg-[#5a8c72] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#48725c] transition-colors shadow-md cursor-pointer"
                >
                  Ver Resultado Orientativo
                </button>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  {testResult.interpretation.level}
                </h4>
                <div className="inline-block bg-stone-100 px-4 py-1.5 rounded-full text-xs font-bold text-stone-800">
                  Puntuación: {testResult.score} puntos
                </div>
                <p className="text-sm text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left">
                  {testResult.interpretation.description}
                </p>
                <div className="text-left bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-900 mb-1">Recomendación terapéutica:</p>
                  <p className="text-xs text-emerald-800">{testResult.interpretation.recommendation}</p>
                </div>
                <button
                  onClick={() => setActiveTest(null)}
                  className="w-full bg-[#5a8c72] text-white py-3 rounded-2xl font-semibold text-sm cursor-pointer"
                >
                  Finalizar Test
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#5a8c72]" />
                <span>Filtros de Contenido</span>
              </h3>
              <button onClick={() => setShowFiltersModal(false)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-5">
              <div>
                <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  Por Tipo de Formato:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'todos', label: 'Todos los formatos' },
                    { key: 'articulos', label: '📖 Artículos / Guías' },
                    { key: 'videos', label: '🎬 Videos Conferencia' },
                    { key: 'podcasts', label: '🎙️ Podcasts Psicológicos' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => {
                        setSelectedFormat(f.key);
                        setShowFiltersModal(false);
                      }}
                      className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        selectedFormat === f.key
                          ? 'bg-[#5a8c72] text-white shadow-xs ring-2 ring-[#5a8c72]/30'
                          : 'bg-[#fbf9f5] border border-stone-200 text-stone-800 hover:bg-[#e8f1ec]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedFormat('todos');
                    setShowFiltersModal(false);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                >
                  Restablecer formato
                </button>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="bg-[#5a8c72] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#48725c] cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#e07a52]" />
                <span>Explorar por Categoría</span>
              </h3>
              <button onClick={() => setShowCategoriesModal(false)} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('todos');
                    setShowCategoriesModal(false);
                  }}
                  className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    selectedCategory === 'todos'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-[#fbf9f5] border border-stone-200 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  ✨ Todos los temas
                </button>

                {CATEGORY_CHIPS.map((chip) => {
                  const isSelected = selectedCategory.toLowerCase() === chip.toLowerCase();
                  return (
                    <button
                      key={chip}
                      onClick={() => {
                        setSelectedCategory(chip);
                        setShowCategoriesModal(false);
                      }}
                      className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#e07a52] text-white shadow-xs ring-2 ring-[#e07a52]/30'
                          : 'bg-[#fbf9f5] border border-stone-200 text-stone-800 hover:border-[#e07a52] hover:bg-[#fff5f0]'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setShowCategoriesModal(false)}
                  className="bg-[#e07a52] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#c8633c] cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
