import React, { useState, useMemo, useEffect } from 'react';
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
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { useToast } from '../common/Toast';
import { GuideTutorialModal } from './GuideTutorialModal';
import { PSYCHOLOGICAL_TESTS } from '../../data/mockData';
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
import { GuideItem, VideoPodcastItem, PsychologicalTest, UserDailyMissionRecord, ViewMode, InstantPracticeItem } from '../../types';

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
  const [isPlaying, setIsPlaying] = useState(true);

  // Psychological test modal
  const [activeTest, setActiveTest] = useState<PsychologicalTest | null>(null);
  const [testAnswers, setTestAnswers] = useState<{ [qId: number]: number }>({});
  const [testResult, setTestResult] = useState<any | null>(null);

  // Instant Practice modal
  const [activePractice, setActivePractice] = useState<InstantPracticeItem | null>(null);

  // Stored missions state for real-time mission status
  const [missionsList, setMissionsList] = useState<UserDailyMissionRecord[]>(() => getStoredMissions());

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

  // Favorites state
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({
    'guide-stress-1': true,
    'guide-anxiety-2': true,
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

  const handleOpenGuide = (guide: GuideItem) => {
    setActiveGuide(guide);
    // Check if first time opening a guide to display the quick tutorial
    const tutorialSeen = localStorage.getItem('fluxglow_guide_tutorial_seen');
    if (!tutorialSeen) {
      setShowGuideTutorial(true);
      localStorage.setItem('fluxglow_guide_tutorial_seen', 'true');
    }
  };

  const handleMissionAction = (guide: GuideItem, missionId?: string) => {
    try {
      const record = activateMissionFromGuide(guide, missionId);
      // If currently pending, complete it with celebration
      const res = completeDailyMission(record.id);
      if (res.success) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
        success('¡Misión completada! Sigue así 🌱', `Sumaste +${res.mission?.xp || 30} XP y fortaleciste tu racha.`);
      } else {
        success('Misión activada', 'Tu reto diario ha sido agregado a tu panel de Análisis.');
      }
    } catch (e) {
      console.error(e);
      info('Misión registrada', 'Misión añadida a tu registro de hábitos.');
    }
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
    simpleSummary?: string;
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
      const descMatch = normalize(item.description || item.simpleSummary || '').includes(q);

      if (!titleMatch && !badgeMatch && !catMatch && !authorMatch && !descMatch) {
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

        {/* Global Learning Banner */}
        <div className="max-w-4xl mx-auto mb-6 p-3.5 sm:p-4 rounded-2xl bg-brand-sand-100 border border-brand-sand-300 text-stone-800 text-xs sm:text-sm flex items-center gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-brand-terracotta-100 text-brand-terracotta-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium leading-relaxed">
              <strong className="font-bold text-brand-terracotta-800">💡 Centro de Aprendizaje Emocional:</strong> Guías interactivas, prácticas en tiempo real y recursos de bienestar mental enriquecidos con IA y respaldados por principios de psicología cognitiva.
            </p>
          </div>
        </div>

        {/* Centered Search Pill */}
        <div className="max-w-xl mx-auto mb-4">
          <div className="relative flex items-center bg-white rounded-full border border-brand-sand-300 shadow-xs px-4 py-2.5 hover:border-brand-sand-400 focus-within:border-brand-sage-500 focus-within:ring-2 focus-within:ring-brand-sage-500/20 transition-all">
            <Search className="w-4 h-4 text-stone-400 shrink-0 mr-3" />
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
                const terms = ['Estrés', 'Ansiedad', 'Mindfulness', 'Autoestima', 'Sueño', 'Procrastinación'];
                const randomTerm = terms[Math.floor(Math.random() * terms.length)];
                setSearchQuery(randomTerm);
              }}
              className="text-stone-400 hover:text-brand-sage-600 p-1 shrink-0 transition-colors cursor-pointer"
              title="💡 Sugerir tema con IA"
              aria-label="Sugerir tema"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Quick Category Chips */}
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
                return (
                  <div 
                    key={guide.id}
                    id={`guide-rec-${guide.id}`}
                    onClick={() => handleOpenGuide(guide)}
                    className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all"
                  >
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
                return (
                  <div 
                    key={guide.id}
                    id={`guide-pop-${guide.id}`}
                    onClick={() => handleOpenGuide(guide)}
                    className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all"
                  >
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
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Prácticas al Instante (Micro-ejercicios interactivos en vivo con icono diferenciador destacado) */}
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
                  onClick={() => setActivePractice(practice)}
                  className="group cursor-pointer flex flex-col bg-gradient-to-b from-emerald-50/40 via-white to-white rounded-3xl p-4 border-2 border-emerald-200/90 hover:border-emerald-500 hover:shadow-lg shadow-xs transition-all justify-between relative overflow-hidden"
                >
                  {/* Visual Accent Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Visual Card Image with prominent badges */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 mb-3.5 shadow-inner">
                      <img
                        src={practice.image}
                        alt={practice.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      
                      {/* Prominent High-Visibility Floating Icon Badge */}
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

                    {/* Noticeable Identifier Header with Distinct Tool Icon */}
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

                    {/* Benefit bullets */}
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

        {/* SECTION 3: Videos y podcast de psicólogos verificados */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  id={`media-${media.id}`}
                  onClick={() => setActiveMedia(media)}
                  className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone-900 mb-3">
                    <img
                      src={media.image}
                      alt={media.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    
                    {/* Media Type Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        {media.type === 'video' ? '🎬 Video' : '🎙️ Podcast'}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono text-[11px] px-2 py-0.5 rounded-md">
                      {media.duration}
                    </div>

                    {/* Play Icon in Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 ml-0.5 fill-stone-900" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 group-hover:text-[#548c71] transition-colors leading-snug">
                      {media.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Por <strong>{media.author}</strong> • {media.views}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: Tests Psicológicos Orientativos */}
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
                  onClick={() => handleStartTest(test)}
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
              </div>
            </div>

            <div className="flex items-center gap-2">
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

          {/* Full Screen Reader Content */}
          <div className="flex-1 w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-8 pb-32">
            
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
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4">
                {activeGuide.title}
              </h1>

              <div className="flex items-center justify-between pb-6 border-b border-stone-200 text-xs sm:text-sm text-stone-500">
                <span>Por <strong className="text-stone-800">{activeGuide.author}</strong></span>
                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Lectura Interactiva
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
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs">
                  <h3 className="font-serif font-bold text-stone-900 text-xl sm:text-2xl mb-3">
                    {section.heading}
                  </h3>
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

            {/* PROMINENT BUTTON: HE TERMINADO DE LEER LA GUÍA */}
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f2ece1] to-[#e8f1ec] border border-[#548c71]/40 text-center shadow-sm">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                ¿Has asimilado los conceptos de esta guía?
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
                Haz clic a continuación para registrar la lectura completa y desbloquear de inmediato tus <strong>3 misiones diarias prácticas</strong> asociadas a este tema.
              </p>

              <button
                id="finish-reading-guide-btn"
                onClick={() => {
                  const activated = activateAllMissionsFromGuide(activeGuide);
                  setUnlockedMissions(activated);
                  confetti({
                    particleCount: 90,
                    spread: 80,
                    origin: { y: 0.6 }
                  });
                  success('¡Lectura completada con éxito! 🎉', 'Has desbloqueado 3 misiones diarias. Se han guardado en tu apartado de Misiones Diarias.');
                }}
                className="bg-[#548c71] hover:bg-[#43705a] active:scale-98 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>He terminado de leer la guía</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </button>
            </div>

            {/* UNLOCKED 3 DAILY MISSIONS CELEBRATION PANEL */}
            {unlockedMissions && unlockedMissions.length > 0 && (
              <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-300 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                        ¡Misiones Desbloqueadas!
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                        3 Misiones Diarias Asignadas
                      </h4>
                    </div>
                  </div>

                  {onNavigate && (
                    <button
                      onClick={() => {
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

                <p className="text-stone-700 text-xs sm:text-sm mb-4">
                  Estas 3 misiones se han guardado automáticamente en tu nuevo apartado <strong>Misiones Diarias</strong>. Puedes completarlas hoy para ganar XP y mantener tu racha:
                </p>

                {/* 3 Missions Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {unlockedMissions.slice(0, 3).map((m, mIdx) => (
                    <div key={m.id || mIdx} className="bg-white/95 rounded-2xl p-4 border border-amber-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-2">
                          <span className="bg-amber-100 px-2 py-0.5 rounded-md">Misión {mIdx + 1}</span>
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

                        <button
                          onClick={() => {
                            completeDailyMission(m.id);
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                            success('¡Misión completada!', 'Sumaste tus puntos de experiencia.');
                          }}
                          className="text-[11px] font-bold text-[#548c71] hover:text-[#43705a] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hacer ahora</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
                  <span className="font-semibold">
                    💡 Podrás dar seguimiento a todas tus misiones pendientes en la sección "Misiones Diarias".
                  </span>
                  
                  {onNavigate && (
                    <button
                      onClick={() => {
                        setActiveGuide(null);
                        setUnlockedMissions(null);
                        onNavigate('missions');
                      }}
                      className="font-bold underline hover:text-amber-950 cursor-pointer"
                    >
                      Ver todas mis misiones pendientes →
                    </button>
                  )}
                </div>
              </div>
            )}

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
                className="absolute w-16 h-16 rounded-full bg-[#548c71] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
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

      {/* Guide Tutorial Modal */}
      <GuideTutorialModal 
        isOpen={showGuideTutorial}
        onClose={() => setShowGuideTutorial(false)}
      />

    </div>
  );
};
