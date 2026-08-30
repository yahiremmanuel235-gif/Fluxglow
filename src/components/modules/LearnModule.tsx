import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Heart, 
  Play, 
  Pause, 
  Square,
  X, 
  BookOpen, 
  CheckCircle2, 
  SlidersHorizontal,
  FolderOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  BookmarkCheck,
  Check,
  Headphones,
  HelpCircle,
  Lightbulb,
  Target,
  Clock,
  Award,
  Info,
  ShieldCheck,
  Zap,
  Wind,
  Brain,
  Timer,
  Activity,
  Flame,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  TrendingUp,
  Compass,
  ExternalLink,
  Tv,
  BadgeCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { useToast } from '../common/Toast';
import { GuideTutorialModal } from './GuideTutorialModal';
import { YouTubePlayerModal } from './YouTubePlayerModal';
import { PSYCHOLOGICAL_TESTS, MOCK_JOURNAL_ENTRIES } from '../../data/mockData';
import { 
  DEMO_GUIDES_CATALOG, 
  POPULAR_GUIDES_CATALOG, 
  VERIFIED_MEDIA_CATALOG,
  AI_DEMO_NOTICE_TEXT 
} from '../../data/guidesData';
import { INSTANT_PRACTICES_CATALOG } from '../../data/instantPracticesData';
import { InstantPracticeModal } from './InstantPracticeModal';
import { 
  activateMissionFromGuide,
  activateAllMissionsFromGuide,
  completeDailyMission, 
  getStoredMissions 
} from '../../utils/missionsManager';
import { 
  GuideItem, 
  VideoPodcastItem, 
  PsychologicalTest, 
  UserDailyMissionRecord, 
  ViewMode, 
  InstantPracticeItem,
  JournalEntry 
} from '../../types';

const CATEGORY_CHIPS = [
  'Ansiedad',
  'Estrés',
  'Procrastinación',
  'Autoestima',
  'Mindfulness',
  'Sueño Reparador',
  'Inteligencia Emocional',
  'Relaciones Sanas',
  'Productividad Consciente',
  'Duelo y Pérdida'
];

interface LearnModuleProps {
  onNavigate?: (view: ViewMode) => void;
  initialGuideId?: string;
}

export const LearnModule: React.FC<LearnModuleProps> = ({ onNavigate, initialGuideId }) => {
  const { warning, success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  
  // Tutorial modal state
  const [showGuideTutorial, setShowGuideTutorial] = useState(false);

  // Active reading full screen modal
  const [activeGuide, setActiveGuide] = useState<GuideItem | null>(() => {
    if (initialGuideId) {
      const found = DEMO_GUIDES_CATALOG.find(g => g.id === initialGuideId);
      return found || null;
    }
    return null;
  });

  // State for the 3 missions unlocked upon finishing reading
  const [unlockedMissions, setUnlockedMissions] = useState<UserDailyMissionRecord[] | null>(null);

  // Video player modal
  const [activeMedia, setActiveMedia] = useState<VideoPodcastItem | null>(null);

  // Psychological test modal
  const [activeTest, setActiveTest] = useState<PsychologicalTest | null>(null);
  const [testAnswers, setTestAnswers] = useState<{ [qId: number]: number }>({});
  const [testResult, setTestResult] = useState<any | null>(null);

  // Instant Practice modal
  const [activePractice, setActivePractice] = useState<InstantPracticeItem | null>(null);

  // Stored missions state for real-time mission status
  const [missionsList, setMissionsList] = useState<UserDailyMissionRecord[]>(() => getStoredMissions());

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_guide_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      'guide-stress-1': true,
      'guide-anxiety-2': true,
    };
  });

  // Read guides persistent history
  const [readGuides, setReadGuides] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_read_guides');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['guide-stress-1']; // Initial default for demo feel
  });

  // Guide ratings state
  const [guideRatings, setGuideRatings] = useState<{ [guideId: string]: 'positive' | 'negative' }>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_guide_ratings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Reading progress state (last section index per guide)
  const [readingProgress, setReadingProgress] = useState<{ [guideId: string]: { sectionIndex: number; lastUpdated: string } }>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_guide_reading_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Learning streak state
  const [learningStreak, setLearningStreak] = useState<{ streak: number; lastDate: string }>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_learning_streak');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const today = new Date().toISOString().split('T')[0];
    return { streak: 3, lastDate: today };
  });

  // Text-to-Speech audio state for full guide narration
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [currentAudioText, setCurrentAudioText] = useState<string>('');
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Synchronize missions update event
  useEffect(() => {
    const handleMissionsUpdate = (e: any) => {
      if (e.detail) {
        setMissionsList(e.detail);
      } else {
        setMissionsList(getStoredMissions());
      }
    };
    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    return () => window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
  }, []);

  // Update learning streak when exploring or reading
  const recordLearningActivity = () => {
    const today = new Date().toISOString().split('T')[0];
    setLearningStreak(prev => {
      if (prev.lastDate === today) return prev;
      
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = prev.lastDate === yesterday ? prev.streak + 1 : 1;
      const updated = { streak: newStreak, lastDate: today };
      try {
        localStorage.setItem('fluxglow_learning_streak', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Cross-reference with Journal entries for smart contextual recommendations
  const journalRecommendation = useMemo(() => {
    let entries: any[] = [];
    try {
      const saved = localStorage.getItem('fluxglow_journal_entries');
      if (saved) {
        entries = JSON.parse(saved);
      } else {
        entries = MOCK_JOURNAL_ENTRIES;
      }
    } catch {
      entries = MOCK_JOURNAL_ENTRIES;
    }

    if (!entries || entries.length === 0) return null;

    // Analyze recent triggers/tags and moods
    const recent = entries.slice(0, 5);
    const allTriggers = recent.flatMap(e => (e.triggers || e.tags || []));
    const triggerCounts: { [k: string]: number } = {};
    allTriggers.forEach(t => {
      const norm = (t || '').toLowerCase();
      triggerCounts[norm] = (triggerCounts[norm] || 0) + 1;
    });

    const hasLowMood = recent.some(e => {
      const m = (e.mood || '').toLowerCase();
      return m === 'triste' || m === 'enojado' || m === 'ansioso' || m === 'estresado' || m === 'abrumado';
    });

    // Matching logic
    if (triggerCounts['trabajo'] || triggerCounts['productividad']) {
      const guide = DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-stress-1') || DEMO_GUIDES_CATALOG[0];
      return {
        tag: '#trabajo',
        reason: 'Notamos registros recientes vinculados al trabajo y sobrecarga mental.',
        guide
      };
    }
    if (triggerCounts['estudios']) {
      const guide = DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-procrastination-3') || DEMO_GUIDES_CATALOG[2];
      return {
        tag: '#estudios',
        reason: 'Detectamos tensión académica y retos de concentración en tu diario.',
        guide
      };
    }
    if (triggerCounts['sueño'] || triggerCounts['descanso']) {
      const guide = DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-sleep-6') || DEMO_GUIDES_CATALOG[5];
      return {
        tag: '#sueño',
        reason: 'Tus registros señalan necesidad de mejorar la calidad de tu descanso.',
        guide
      };
    }
    if (triggerCounts['familia'] || triggerCounts['pareja'] || triggerCounts['amigos']) {
      const guide = DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-relationships-10') || DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-eq-8') || DEMO_GUIDES_CATALOG[0];
      return {
        tag: '#vínculos',
        reason: 'Tus reflexiones tocan dinámicas interpersonales y límites afectivos.',
        guide
      };
    }
    if (hasLowMood) {
      const guide = DEMO_GUIDES_CATALOG.find(g => g.id === 'guide-selfesteem-4') || DEMO_GUIDES_CATALOG[3];
      return {
        tag: '#autocompasión',
        reason: 'Has transitado emociones retadoras recientemente; te sugerimos una dosis de autocuidado.',
        guide
      };
    }

    // Default gentle recommendation
    return {
      tag: '#bienestar',
      reason: 'Recomendación personalizada para fortalecer tu regulación diaria.',
      guide: DEMO_GUIDES_CATALOG[0]
    };
  }, []);

  // Save favorites with localStorage sync
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('fluxglow_guide_favorites', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      if (next[id]) {
        success('Guardado en favoritos ❤️', 'Guía añadida a tu colección personal.');
      } else {
        info('Eliminado de favoritos', 'Guía retirada de tu lista de favoritos.');
      }
      return next;
    });
  };

  // Real Share Handler (navigator.share with clipboard fallback)
  const handleShareGuide = async (guide: GuideItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareData = {
      title: `${guide.title} | FluxGlow`,
      text: `Descubre esta guía práctica en FluxGlow: "${guide.title}". ${guide.simpleSummary}`,
      url: window.location.href
    };

    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share(shareData);
        success('¡Compartido con éxito!', 'Gracias por difundir herramientas de salud mental.');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        success('Enlace y resumen copiados 📋', 'El contenido de la guía está listo para compartirse.');
      }
    } catch (err) {
      // User cancelled or clipboard denied
      try {
        await navigator.clipboard.writeText(`${guide.title} - ${guide.simpleSummary}`);
        info('Copiado al portapapeles', 'Resumen copiado para compartir.');
      } catch (copyErr) {
        console.warn(copyErr);
      }
    }
  };

  // Open guide reader and initialize reading progress / streak
  const handleOpenGuide = (guide: GuideItem) => {
    setActiveGuide(guide);
    recordLearningActivity();
    
    // Check if first time opening a guide to display the quick tutorial
    const tutorialSeen = localStorage.getItem('fluxglow_guide_tutorial_seen');
    if (!tutorialSeen) {
      setShowGuideTutorial(true);
      localStorage.setItem('fluxglow_guide_tutorial_seen', 'true');
    }
  };

  // Mark guide section reading progress
  const updateSectionProgress = (guideId: string, sectionIdx: number) => {
    setReadingProgress(prev => {
      const next = {
        ...prev,
        [guideId]: {
          sectionIndex: sectionIdx,
          lastUpdated: new Date().toISOString()
        }
      };
      try {
        localStorage.setItem('fluxglow_guide_reading_progress', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Rate guide at the end (¿Te sirvió? 👍/👎)
  const handleRateGuide = (guideId: string, rating: 'positive' | 'negative') => {
    setGuideRatings(prev => {
      const next = { ...prev, [guideId]: rating };
      try {
        localStorage.setItem('fluxglow_guide_ratings', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    if (rating === 'positive') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      success('¡Gracias por tu valoración! 👍', 'Priorizaremos más guías y herramientas similares para ti.');
    } else {
      info('Valoración registrada 📝', 'Anotamos tus comentarios para seguir mejorando nuestro contenido.');
    }
  };

  // Full-Guide Text-to-Speech Engine
  const startGuideAudio = (guide: GuideItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      warning('Audio no compatible', 'Tu navegador no soporta síntesis de voz interactiva.');
      return;
    }

    if (isAudioPlaying && isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
      return;
    }

    // Build the complete spoken script
    const sectionsText = guide.explainedContent.map(s => `${s.heading}. ${s.text}. ${s.bulletPoints?.join('. ') || ''}`).join('. ');
    const tipsText = guide.extraTips?.join('. ') || '';
    const fullScript = `Guía: ${guide.title}. Categoría: ${guide.category}. Resumen: ${guide.simpleSummary}. Contenido: ${sectionsText}. Consejos prácticos: ${tipsText}.`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.lang = 'es-ES';
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsAudioPlaying(true);
      setIsAudioPaused(false);
      setCurrentAudioText(guide.title);
      info('Reproduciendo guía completa 🎧', 'Puedes escuchar la narración con voz natural mientras descansas.');
    };

    utterance.onend = () => {
      setIsAudioPlaying(false);
      setIsAudioPaused(false);
      success('Narración de audio finalizada ✨', 'Has completado la escucha de esta guía.');
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setIsAudioPlaying(false);
      setIsAudioPaused(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseGuideAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      info('Audio en pausa', 'Presiona reproducir para continuar.');
    }
  };

  const stopGuideAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      setIsAudioPaused(false);
    }
  };

  // Change playback rate on the fly
  const handleChangeSpeed = (newSpeed: number) => {
    setAudioSpeed(newSpeed);
    if (isAudioPlaying && activeGuide) {
      stopGuideAudio();
      setTimeout(() => startGuideAudio(activeGuide), 150);
    }
  };

  // Clean up audio on guide close or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeGuide]);

  // Finish reading guide handler
  const handleFinishReading = (guide: GuideItem) => {
    // Record read status
    if (!readGuides.includes(guide.id)) {
      const updated = [...readGuides, guide.id];
      setReadGuides(updated);
      try {
        localStorage.setItem('fluxglow_read_guides', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    recordLearningActivity();

    // Activate missions in pending state (so user takes them to real practice throughout the day)
    const activated = activateAllMissionsFromGuide(guide);
    setUnlockedMissions(activated);

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
    success('¡Lectura completada con éxito! 🎉', 'Has desbloqueado 3 misiones prácticas para llevar la teoría a tu día.');
  };

  // String normalizer for accent-free search
  const normalize = (str: string) => 
    (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // Comprehensive Search Matcher (searches title, category, badge, author, summary, deep content, glossary, tips)
  const matchesSearchAndCategory = (item: any) => {
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
      const descMatch = normalize(item.description || item.simpleSummary || '').includes(q);

      // Search deep inside guide content (sections, glossary, extra tips)
      let deepContentMatch = false;
      if (item.explainedContent && Array.isArray(item.explainedContent)) {
        deepContentMatch = item.explainedContent.some((sec: any) => 
          normalize(sec.heading).includes(q) || 
          normalize(sec.text).includes(q) ||
          (sec.bulletPoints && sec.bulletPoints.some((bp: string) => normalize(bp).includes(q)))
        );
      }

      let glossaryMatch = false;
      if (item.glossary && Array.isArray(item.glossary)) {
        glossaryMatch = item.glossary.some((g: any) => 
          normalize(g.term).includes(q) || normalize(g.definition).includes(q)
        );
      }

      let tipsMatch = false;
      if (item.extraTips && Array.isArray(item.extraTips)) {
        tipsMatch = item.extraTips.some((t: string) => normalize(t).includes(q));
      }

      if (!titleMatch && !badgeMatch && !catMatch && !authorMatch && !descMatch && !deepContentMatch && !glossaryMatch && !tipsMatch) {
        return false;
      }
    }

    return true;
  };

  // Filtered lists based on Category, Search Query & Format
  const filteredPractices = useMemo(() => {
    if (selectedFormat === 'videos' || selectedFormat === 'podcasts' || selectedFormat === 'guias' || selectedFormat === 'articulos' || selectedFormat === 'tests') {
      return [];
    }
    return INSTANT_PRACTICES_CATALOG.filter(matchesSearchAndCategory);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const filteredRecommended = useMemo(() => {
    if (selectedFormat === 'videos' || selectedFormat === 'podcasts' || selectedFormat === 'practicas' || selectedFormat === 'tests') {
      return [];
    }
    return DEMO_GUIDES_CATALOG.filter(matchesSearchAndCategory);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const filteredPopular = useMemo(() => {
    if (selectedFormat === 'videos' || selectedFormat === 'podcasts' || selectedFormat === 'practicas' || selectedFormat === 'tests') {
      return [];
    }
    return POPULAR_GUIDES_CATALOG.filter(matchesSearchAndCategory);
  }, [searchQuery, selectedCategory, selectedFormat]);

  const filteredMedia = useMemo(() => {
    if (selectedFormat === 'articulos' || selectedFormat === 'guias' || selectedFormat === 'practicas' || selectedFormat === 'tests') {
      return [];
    }
    return VERIFIED_MEDIA_CATALOG.filter(item => {
      if (selectedFormat === 'videos' && item.type !== 'video') return false;
      if (selectedFormat === 'podcasts' && item.type !== 'podcast') return false;
      return matchesSearchAndCategory(item);
    });
  }, [searchQuery, selectedCategory, selectedFormat]);

  const totalResultsCount = filteredRecommended.length + filteredPopular.length + filteredMedia.length + filteredPractices.length;
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

  // Overall catalog progress calculation
  const totalCatalogGuides = DEMO_GUIDES_CATALOG.length;
  const completedGuidesCount = DEMO_GUIDES_CATALOG.filter(g => readGuides.includes(g.id)).length;
  const completionPercentage = Math.round((completedGuidesCount / totalCatalogGuides) * 100) || 0;

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Top Header Row with Pill Buttons & Center Logo */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-4">
          
          {/* Left Pill: Filtros */}
          <button
            id="filters-btn"
            onClick={() => setShowFiltersModal(true)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-2 cursor-pointer ${
              selectedFormat !== 'todos' 
                ? 'bg-brand-sage-600 ring-2 ring-brand-sage-400/40 text-white' 
                : 'bg-brand-sage-500 hover:bg-brand-sage-600 text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
            {selectedFormat !== 'todos' && (
              <span className="w-2 h-2 rounded-full bg-brand-gold-300"></span>
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
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-2xs transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory !== 'todos' 
                ? 'bg-brand-terracotta-600 ring-2 ring-brand-terracotta-400/40 text-white' 
                : 'bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Todas las Categorías</span>
            <span className="sm:hidden">Categorías</span>
            {selectedCategory !== 'todos' && (
              <span className="w-2 h-2 rounded-full bg-brand-gold-200"></span>
            )}
          </button>
        </div>

        {/* Big Display Title: Explora y Aprende */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-sage-700">Explora y </span>
            <span className="text-brand-terracotta-600">Aprende</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl mx-auto">
            Guías prácticas, aprendizaje emocional y contenido respaldado por psicología científica.
          </p>
        </div>

        {/* PROGRESS & LEARNING STREAK OVERVIEW BAR */}
        <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Progress Card */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-white border border-brand-sand-300 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#548c71]" />
                <span>Progreso de Aprendizaje</span>
              </span>
              <span className="text-xs font-bold text-[#548c71] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {completedGuidesCount} de {totalCatalogGuides} guías ({completionPercentage}%)
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200 mb-1">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-[#548c71] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(completionPercentage, 8)}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 flex items-center justify-between">
              <span>{completedGuidesCount === 0 ? 'Empieza tu primera lectura' : 'Excelente avance continuo'}</span>
              <span>{Object.values(favorites).filter(Boolean).length} favoritas guardadas</span>
            </p>
          </div>

          {/* Streak Habit Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/15 border border-amber-300/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Racha de Aprendizaje
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold font-serif text-amber-950">
                  {learningStreak.streak} días
                </span>
                <span className="text-xs font-medium text-amber-800">seguidos</span>
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                ¡Explora una guía hoy para mantenerla!
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-900 animate-pulse" />
            </div>
          </div>
        </div>

        {/* CROSSED RECOMMENDATION FROM JOURNAL */}
        {journalRecommendation && journalRecommendation.guide && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-brand-sand-100 border-2 border-[#548c71]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#548c71] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#548c71] bg-white px-2.5 py-0.5 rounded-full border border-[#548c71]/20">
                    💡 Recomendación según tu Diario ({journalRecommendation.tag})
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 leading-snug">
                  {journalRecommendation.guide.title}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {journalRecommendation.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenGuide(journalRecommendation.guide)}
              className="bg-[#548c71] hover:bg-[#43705a] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap self-end sm:self-center"
            >
              <span>Leer Guía Sugerida</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Centered Search Pill with Deep Search capability */}
        <div className="max-w-xl mx-auto mb-4">
          <div className="relative flex items-center bg-white rounded-full border border-brand-sand-300 shadow-xs px-4 py-2.5 hover:border-brand-sand-400 focus-within:border-brand-sage-500 focus-within:ring-2 focus-within:ring-brand-sage-500/20 transition-all">
            <Search className="w-4 h-4 text-stone-400 shrink-0 mr-3" />
            <input
              id="search-guides-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca en títulos, conceptos (ej. cortisol, amígdala, sueño)..."
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
                const terms = ['Estrés', 'Cortisol', 'Ansiedad', 'Mindfulness', 'Autoestima', 'Sueño', 'Procrastinación', 'Inteligencia Emocional'];
                const randomTerm = terms[Math.floor(Math.random() * terms.length)];
                setSearchQuery(randomTerm);
              }}
              className="text-stone-400 hover:text-brand-sage-600 p-1 shrink-0 transition-colors cursor-pointer"
              title="💡 Sugerir término o concepto"
              aria-label="Sugerir término"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Quick Category Chips (All 10 Categories covered) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-4xl mx-auto mb-6">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-brand-sage-600 text-white shadow-2xs'
                : 'bg-white border border-brand-sand-300 text-stone-700 hover:bg-brand-sand-100'
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
                    ? 'bg-brand-sage-500 text-white shadow-2xs font-bold'
                    : 'bg-white border border-brand-sand-300 text-stone-700 hover:border-brand-sand-400 hover:bg-brand-sand-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicators Bar */}
        {isAnyFilterActive && (
          <div className="flex items-center justify-between bg-stone-100/90 border border-stone-200/80 rounded-2xl px-4 py-2.5 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-stone-700 flex-wrap">
              <span className="font-semibold text-stone-900">Filtros aplicados:</span>
              {selectedCategory !== 'todos' && (
                <span className="bg-white px-2.5 py-1 rounded-full border border-stone-300 font-medium text-stone-800">
                  Categoría: {selectedCategory}
                </span>
              )}
              {selectedFormat !== 'todos' && (
                <span className="bg-white px-2.5 py-1 rounded-full border border-stone-300 font-medium text-stone-800">
                  Formato: {selectedFormat}
                </span>
              )}
              {searchQuery && (
                <span className="bg-white px-2.5 py-1 rounded-full border border-stone-300 font-medium text-stone-800">
                  Búsqueda: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              <span className="text-stone-400">({totalResultsCount} resultados)</span>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#c55835] hover:text-[#de6943] flex items-center gap-1 cursor-pointer shrink-0 ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        )}

        {/* SECTION 1: Guías recomendadas (AI Demo Guides) */}
        {filteredRecommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Guías recomendadas con IA:</span>
                <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {filteredRecommended.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRecommended.map((guide) => {
                const isFav = favorites[guide.id];
                const isRead = readGuides.includes(guide.id);
                const hasProgress = readingProgress[guide.id];

                return (
                  <div 
                    key={guide.id}
                    id={`guide-rec-${guide.id}`}
                    onClick={() => handleOpenGuide(guide)}
                    className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all justify-between"
                  >
                    <div>
                      {/* Card Box with Rounded Border */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={guide.image}
                          alt={guide.badge}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Top Floating Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          {isRead && (
                            <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/50 shadow-xs flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Leída</span>
                            </span>
                          )}
                          {guide.isDemoContent && (
                            <span className="bg-amber-400/95 backdrop-blur-xs text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/40 shadow-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Ejemplo IA</span>
                            </span>
                          )}
                          <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-stone-300 shadow-xs whitespace-nowrap">
                            {guide.badge}
                          </span>
                        </div>

                        {/* Top Right Action Buttons (Share & Favorite) */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleShareGuide(guide, e)}
                            className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 text-stone-600 hover:text-stone-900 transition-transform cursor-pointer"
                            title="Compartir guía"
                            aria-label="Compartir"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(guide.id, e)}
                            className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                            title="Guardar favorito"
                            aria-label="Guardar favorito"
                          >
                            <Heart 
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'text-red-500 fill-red-500' : 'text-stone-400'
                              }`} 
                            />
                          </button>
                        </div>

                        {/* Bottom Bookmark/Continue badge if partially read */}
                        {hasProgress && !isRead && (
                          <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/30">
                            <BookmarkCheck className="w-3 h-3 text-amber-400" />
                            <span>En progreso</span>
                          </div>
                        )}
                      </div>

                      {/* Subtitle / Description text below card */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#548c71] uppercase tracking-wider mb-1">
                          <span>{guide.category}</span>
                          <span className="text-stone-400 font-medium lowercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {guide.readTime}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-[#548c71] transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {guide.simpleSummary}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Status Footnote */}
                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 font-medium">{guide.author.split('•')[0]}</span>
                      <span className="text-[#548c71] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {isRead ? 'Repasar →' : 'Explorar →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Guías populares */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPopular.map((guide) => {
                const isFav = favorites[guide.id];
                const isRead = readGuides.includes(guide.id);
                const hasProgress = readingProgress[guide.id];

                return (
                  <div 
                    key={guide.id}
                    id={`guide-pop-${guide.id}`}
                    onClick={() => handleOpenGuide(guide)}
                    className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all justify-between"
                  >
                    <div>
                      {/* Card Box with Rounded Border */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={guide.image}
                          alt={guide.badge}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Top Floating Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          {isRead && (
                            <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-400/50 shadow-xs flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Leída</span>
                            </span>
                          )}
                          {guide.isDemoContent && (
                            <span className="bg-amber-400/95 backdrop-blur-xs text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/40 shadow-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Ejemplo IA</span>
                            </span>
                          )}
                          <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-stone-300 shadow-xs whitespace-nowrap">
                            {guide.badge}
                          </span>
                        </div>

                        {/* Top Right Action Buttons */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleShareGuide(guide, e)}
                            className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 text-stone-600 hover:text-stone-900 transition-transform cursor-pointer"
                            title="Compartir guía"
                            aria-label="Compartir"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleFavorite(guide.id, e)}
                            className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                            title="Guardar favorito"
                            aria-label="Guardar favorito"
                          >
                            <Heart 
                              className={`w-4 h-4 transition-colors ${
                                isFav ? 'text-red-500 fill-red-500' : 'text-stone-400'
                              }`} 
                            />
                          </button>
                        </div>

                        {hasProgress && !isRead && (
                          <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/30">
                            <BookmarkCheck className="w-3 h-3 text-amber-400" />
                            <span>En progreso</span>
                          </div>
                        )}
                      </div>

                      {/* Subtitle / Description text below card */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#de6943] uppercase tracking-wider mb-1">
                          <span>{guide.category}</span>
                          <span className="text-stone-400 font-medium lowercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {guide.readTime}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-[#de6943] transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {guide.simpleSummary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 font-medium">{guide.author.split('•')[0]}</span>
                      <span className="text-[#de6943] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {isRead ? 'Repasar →' : 'Explorar →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Prácticas al Instante (Micro-ejercicios interactivos en vivo) */}
        {filteredPractices.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                    <Zap className="w-5 h-5 text-emerald-600 fill-emerald-500/20" />
                  </div>
                  <span>Prácticas al Instante:</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
                    {filteredPractices.length} interactivas en vivo
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Herramientas interactivas guiadas de 1 a 3 minutos para calmarte, regular tu respiración y reiniciar tu mente en tiempo real.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPractices.map((practice) => (
                <div
                  key={practice.id}
                  id={`practice-${practice.id}`}
                  onClick={() => {
                    setActivePractice(practice);
                    recordLearningActivity();
                  }}
                  className="group cursor-pointer flex flex-col bg-gradient-to-b from-emerald-50/40 via-white to-white rounded-3xl p-4 border-2 border-emerald-200/90 hover:border-emerald-500 hover:shadow-lg shadow-xs transition-all justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 mb-3.5 shadow-inner">
                      <img
                        src={practice.image}
                        alt={practice.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                        <span className="bg-emerald-700/95 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-emerald-400/60 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>⚡ Práctica en Vivo</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white font-mono text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{practice.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300 shadow-2xs group-hover:scale-110 group-hover:bg-emerald-200 transition-transform">
                        {practice.category.toLowerCase().includes('respiraci') ? (
                          <Wind className="w-5 h-5 text-emerald-700" />
                        ) : practice.category.toLowerCase().includes('sueño') || practice.category.toLowerCase().includes('noche') ? (
                          <Timer className="w-5 h-5 text-indigo-700" />
                        ) : practice.category.toLowerCase().includes('mente') || practice.category.toLowerCase().includes('pensamiento') ? (
                          <Brain className="w-5 h-5 text-amber-700" />
                        ) : (
                          <Activity className="w-5 h-5 text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                          <span>{practice.category}</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-semibold">Micro-ejercicio</span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          {practice.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      {practice.shortDesc}
                    </p>

                    <div className="space-y-1 mb-4 pt-2 border-t border-emerald-100">
                      {practice.benefits.slice(0, 2).map((b, bIdx) => (
                        <div key={bIdx} className="text-[11px] text-stone-600 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1"></span>
                          <span className="leading-tight">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePractice(practice);
                      recordLearningActivity();
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Iniciar Práctica en Vivo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: Videos y podcasts de psicólogos verificados */}
        {filteredMedia.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-2xs">
                    <Tv className="w-4 h-4" />
                  </div>
                  <span>Videos y podcasts de psicólogos verificados:</span>
                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>YouTube</span>
                    <span>• {filteredMedia.length}</span>
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Conferencias magistrales, entrevistas y podcasts reales de psiquiatras y terapeutas reconocidos. Puedes reproducirlos directamente aquí o verlos en YouTube.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  id={`media-${media.id}`}
                  onClick={() => {
                    setActiveMedia(media);
                    recordLearningActivity();
                  }}
                  className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-red-200 hover:shadow-md transition-all justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone-900 mb-3">
                      <img
                        src={media.image}
                        alt={media.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${media.youtubeId}/hqdefault.jpg`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-red-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <Tv className="w-2.5 h-2.5" />
                          <span>{media.type === 'video' ? 'Video' : 'Podcast'}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {media.duration}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-red-600 transition-all">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">
                        <span>{media.category}</span>
                        <span className="text-stone-400 font-mono font-medium lowercase flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {media.duration}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                        {media.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                        <span className="truncate">Por <strong>{media.author}</strong></span>
                        <BadgeCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      </p>
                      {media.channel && (
                        <p className="text-[10px] text-stone-400 mt-0.5 truncate">
                          {media.channel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">{media.views}</span>
                    <span className="text-red-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Ver en YouTube →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: Tests Psicológicos Orientativos */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Tests y escalas de autoevaluación orientativa:</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PSYCHOLOGICAL_TESTS.map((test) => (
              <div
                key={test.id}
                id={`test-card-${test.id}`}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#548c71] bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {test.category}
                    </span>
                    <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {test.duration}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {test.shortDesc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleStartTest(test);
                    recordLearningActivity();
                  }}
                  className="w-full bg-[#548c71] hover:bg-[#43705a] text-white py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Iniciar Test ({test.questionsCount} preguntas)</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Full Screen Guide Reader */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-[#faf8f4] flex flex-col w-screen h-screen overflow-y-auto animate-in fade-in duration-200">
          
          {/* Sticky Top Reader Navbar */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ece4d9] px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  stopGuideAudio();
                  setActiveGuide(null);
                  setUnlockedMissions(null);
                }}
                className="text-stone-600 hover:text-stone-900 bg-[#f4eee5] hover:bg-[#ece2d3] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>← Volver al Catálogo</span>
              </button>

              <div className="hidden md:flex items-center gap-2">
                <span className="text-stone-300">|</span>
                <span className="text-xs font-bold text-[#548c71] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {activeGuide.category}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {activeGuide.readTime} de lectura
                </span>
                {readGuides.includes(activeGuide.id) && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Leída</span>
                  </span>
                )}
              </div>
            </div>

            {/* Top Reader Actions (Audio, Share, Favorite, Help, Close) */}
            <div className="flex items-center gap-2">
              
              {/* Share Button */}
              <button
                onClick={(e) => handleShareGuide(activeGuide, e)}
                className="p-2 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 rounded-full transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Compartir guía"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Compartir</span>
              </button>

              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(activeGuide.id, e)}
                className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  favorites[activeGuide.id]
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                title="Guardar en favoritos"
              >
                <Heart className={`w-4 h-4 ${favorites[activeGuide.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">
                  {favorites[activeGuide.id] ? 'Favorito' : 'Guardar'}
                </span>
              </button>

              <button
                onClick={() => setShowGuideTutorial(true)}
                className="p-2 text-stone-500 hover:text-[#548c71] bg-white border border-stone-200 hover:bg-stone-50 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="¿Cómo funciona esta guía?"
              >
                <HelpCircle className="w-4 h-4 text-[#548c71]" />
                <span className="hidden sm:inline">Ayuda</span>
              </button>

              <button
                onClick={() => {
                  stopGuideAudio();
                  setActiveGuide(null);
                  setUnlockedMissions(null);
                }}
                className="p-2 text-stone-400 hover:text-stone-800 bg-white border border-stone-200 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                title="Cerrar pantalla completa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DEDICATED FULL-GUIDE AUDIO PLAYER BAR */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white px-4 sm:px-8 py-3 sticky top-[53px] z-30 shadow-md border-b border-emerald-800/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-200 flex items-center gap-2">
                  <span>Versión de Audio Completa (Texto a Voz)</span>
                  {isAudioPlaying && !isAudioPaused && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                      <span className="w-1 h-4 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-stone-300">
                  {isAudioPlaying ? (isAudioPaused ? 'Pausado' : 'Reproduciendo narración guiada...') : 'Escucha esta guía completa mientras realizas tus actividades.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Play / Pause / Stop Controls */}
              {!isAudioPlaying ? (
                <button
                  onClick={() => startGuideAudio(activeGuide)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Escuchar Guía</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  {isAudioPaused ? (
                    <button
                      onClick={() => startGuideAudio(activeGuide)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Reanudar</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseGuideAudio}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Pausar</span>
                    </button>
                  )}

                  <button
                    onClick={stopGuideAudio}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white p-1.5 rounded-full transition-all cursor-pointer"
                    title="Detener audio"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              )}

              {/* Speed Selector */}
              <div className="flex items-center bg-stone-800/80 rounded-full border border-stone-700/60 p-0.5 text-[10px] font-bold">
                {[1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleChangeSpeed(spd)}
                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      audioSpeed === spd 
                        ? 'bg-emerald-500 text-white shadow-2xs' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Screen Reader Content */}
          <div className="flex-1 w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-8 pb-32">
            
            {/* RESUME READING / CONTINUAR DONDE LO DEJASTE PROMPT */}
            {readingProgress[activeGuide.id] && readingProgress[activeGuide.id].sectionIndex > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold block">Continuar donde lo dejaste:</span>
                    <span className="text-amber-800">
                      Sección {readingProgress[activeGuide.id].sectionIndex + 1}: {activeGuide.explainedContent[readingProgress[activeGuide.id].sectionIndex]?.heading || 'Punto guardado'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const idx = readingProgress[activeGuide.id].sectionIndex;
                    const el = document.getElementById(`guide-sec-${idx}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      success('Saltando a tu sección', 'Has retomado la lectura exactamente donde te quedaste.');
                    }
                  }}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  Ir a la sección →
                </button>
              </div>
            )}

            {/* Guide Header Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {activeGuide.isDemoContent && (
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-300 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ejemplo Demostrativo IA</span>
                  </span>
                )}
                <span className="bg-[#e2eee6] text-[#253d33] text-xs font-bold px-3 py-1 rounded-full border border-[#548c71]/30">
                  {activeGuide.category}
                </span>
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeGuide.readTime}
                </span>
                {readGuides.includes(activeGuide.id) && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Guía Completada</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4">
                {activeGuide.title}
              </h1>

              <div className="flex items-center justify-between pb-6 border-b border-stone-200 text-xs sm:text-sm text-stone-500">
                <span>Por <strong className="text-stone-800">{activeGuide.author}</strong></span>
                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Lectura Interactiva Respaldada
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden mb-8 shadow-sm border border-stone-200 bg-stone-100">
              <img
                src={activeGuide.image}
                alt={activeGuide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Step 1: Resumen Simple Superior */}
            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#eaf4ef] border border-[#548c71]/30 text-emerald-950 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Resumen Ejecutivo Simple</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-stone-800">
                {activeGuide.simpleSummary}
              </p>
            </div>

            {/* Step 2: Aviso Transparente de Contenido IA */}
            {activeGuide.isDemoContent && (
              <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold text-amber-900 mb-0.5">Aviso de Contenido Demostrativo:</p>
                  <p className="text-amber-800 text-xs">
                    {activeGuide.demoNotice || AI_DEMO_NOTICE_TEXT}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Contenido Explicado en Detalle */}
            <div className="space-y-8 text-stone-800 text-base leading-relaxed mb-10">
              {activeGuide.explainedContent.map((section, idx) => (
                <div 
                  key={idx} 
                  id={`guide-sec-${idx}`}
                  onClick={() => updateSectionProgress(activeGuide.id, idx)}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs transition-all hover:border-[#548c71]/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif font-bold text-stone-900 text-xl sm:text-2xl">
                      {section.heading}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateSectionProgress(activeGuide.id, idx);
                        success('Punto de lectura guardado', `Se guardó tu avance en la sección ${idx + 1}.`);
                      }}
                      className="text-stone-300 hover:text-amber-600 p-1 cursor-pointer transition-colors"
                      title="Guardar marcador aquí"
                    >
                      <BookmarkCheck className={`w-5 h-5 ${readingProgress[activeGuide.id]?.sectionIndex === idx ? 'text-amber-600' : ''}`} />
                    </button>
                  </div>

                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                    {section.text}
                  </p>
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-100 space-y-2.5">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#548c71] shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed">{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Glosario de Términos */}
            {activeGuide.glossary && activeGuide.glossary.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#548c71]" />
                  <span>Glosario de Conceptos Clave</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activeGuide.glossary.map((g, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                      <p className="text-sm font-bold text-stone-900">{g.term}</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{g.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consejos Prácticos Extra */}
            {activeGuide.extraTips && activeGuide.extraTips.length > 0 && (
              <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#de6943] uppercase tracking-wider mb-3">
                  <Lightbulb className="w-4 h-4" />
                  <span>Consejos Prácticos para tu Rutina Diaria</span>
                </div>
                <ul className="space-y-2.5">
                  {activeGuide.extraTips.map((tip, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#de6943] shrink-0 mt-0.5 stroke-[3]" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RATING WIDGET: ¿TE SIRVIÓ ESTA GUÍA? */}
            <div className="mb-10 p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Evaluación de Contenido
              </span>
              <h4 className="font-serif text-lg font-bold text-stone-900 mb-3">
                ¿Te ha resultado útil esta guía?
              </h4>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => handleRateGuide(activeGuide.id, 'positive')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    guideRatings[activeGuide.id] === 'positive'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>👍 Me sirvió mucho</span>
                </button>

                <button
                  onClick={() => handleRateGuide(activeGuide.id, 'negative')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    guideRatings[activeGuide.id] === 'negative'
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>👎 Podría mejorar</span>
                </button>
              </div>
            </div>

            {/* PROMINENT BUTTON: HE TERMINADO DE LEER LA GUÍA */}
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f2ece1] to-[#e8f1ec] border border-[#548c71]/40 text-center shadow-sm">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                ¿Has asimilado los conceptos de esta guía?
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
                Haz clic a continuación para registrar la lectura completa y activar tus <strong>3 misiones prácticas</strong> en tu plan diario para ejercitarlas durante tu jornada.
              </p>

              <button
                id="finish-reading-guide-btn"
                onClick={() => handleFinishReading(activeGuide)}
                className="bg-[#548c71] hover:bg-[#43705a] active:scale-98 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>He terminado de leer la guía</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </button>
            </div>

            {/* UNLOCKED 3 DAILY MISSIONS PANEL (FOCUSED ON REAL DAILY PRACTICE) */}
            {unlockedMissions && unlockedMissions.length > 0 && (
              <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-300 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                        ¡Misiones Desbloqueadas y Listas para tu Día!
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                        3 Retos Prácticos Asignados
                      </h4>
                    </div>
                  </div>

                  {onNavigate && (
                    <button
                      onClick={() => {
                        stopGuideAudio();
                        setActiveGuide(null);
                        setUnlockedMissions(null);
                        onNavigate('missions');
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Target className="w-4 h-4" />
                      <span>Ir a Misiones Diarias</span>
                    </button>
                  )}
                </div>

                <p className="text-stone-700 text-xs sm:text-sm mb-4 leading-relaxed">
                  💡 <strong>Propósito de las misiones:</strong> Estas acciones están diseñadas para trasladar la teoría a la práctica en tu día a día. Las encontrarás activas en tu apartado de <strong>Misiones Diarias</strong> para completarlas y registrar tus XP conforme las realices.
                </p>

                {/* 3 Missions Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {unlockedMissions.slice(0, 3).map((m, mIdx) => (
                    <div key={m.id || mIdx} className="bg-white/95 rounded-2xl p-4 border border-amber-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-2">
                          <span className="bg-amber-100 px-2 py-0.5 rounded-md">Reto {mIdx + 1}</span>
                          <span className="text-stone-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {m.timeEstimate}
                          </span>
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900 mb-1 leading-snug">
                          {m.title}
                        </h5>
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                          +{m.xp || 30} XP
                        </span>

                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Activada en tu día</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 pt-2 border-t border-amber-200/60">
                  <span className="font-semibold">
                    🌱 Ponlas en práctica durante tu jornada y márcalas como completadas en tu panel.
                  </span>
                  
                  {onNavigate && (
                    <button
                      onClick={() => {
                        stopGuideAudio();
                        setActiveGuide(null);
                        setUnlockedMissions(null);
                        onNavigate('missions');
                      }}
                      className="font-bold underline hover:text-amber-950 cursor-pointer flex items-center gap-1"
                    >
                      <span>Ver todas mis misiones en curso</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* YouTube Video / Podcast Player Modal */}
      <YouTubePlayerModal
        media={activeMedia}
        isOpen={!!activeMedia}
        onClose={() => setActiveMedia(null)}
        onSelectMedia={(media) => setActiveMedia(media)}
        allMedia={VERIFIED_MEDIA_CATALOG}
      />

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
                                ? 'bg-[#548c71] text-white border-[#548c71] shadow-xs'
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
                  className="w-full bg-[#548c71] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#43705a] transition-colors shadow-md cursor-pointer"
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
                  className="w-full bg-[#548c71] text-white py-3 rounded-2xl font-semibold text-sm cursor-pointer"
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
                <SlidersHorizontal className="w-5 h-5 text-[#548c71]" />
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
                    { key: 'practicas', label: '⚡ Prácticas al Instante' },
                    { key: 'articulos', label: '📖 Guías y Artículos' },
                    { key: 'videos', label: '🎬 Videos Conferencia' },
                    { key: 'podcasts', label: '🎙️ Podcasts' },
                    { key: 'tests', label: '🧪 Tests de Autoevaluación' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => {
                        setSelectedFormat(f.key);
                        setShowFiltersModal(false);
                      }}
                      className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        selectedFormat === f.key
                          ? 'bg-[#548c71] text-white shadow-xs ring-2 ring-[#548c71]/30'
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
                  className="bg-[#548c71] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#43705a] cursor-pointer"
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
                <FolderOpen className="w-5 h-5 text-[#de6943]" />
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
                          ? 'bg-[#de6943] text-white shadow-xs ring-2 ring-[#de6943]/30'
                          : 'bg-[#fbf9f5] border border-stone-200 text-stone-800 hover:border-[#de6943] hover:bg-[#fff5f0]'
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
                  className="bg-[#de6943] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#c55835] cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant Practice Modal */}
      <InstantPracticeModal
        practice={activePractice}
        isOpen={!!activePractice}
        onClose={() => setActivePractice(null)}
      />

      {/* YouTube Verified Player Modal */}
      <YouTubePlayerModal
        media={activeMedia}
        isOpen={!!activeMedia}
        onClose={() => setActiveMedia(null)}
        onSelectMedia={(item) => setActiveMedia(item)}
        allMedia={VERIFIED_MEDIA_CATALOG}
      />

      {/* Guide Tutorial Modal */}
      <GuideTutorialModal 
        isOpen={showGuideTutorial}
        onClose={() => setShowGuideTutorial(false)}
      />

    </div>
  );
};
