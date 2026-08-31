import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Award, 
  Clock, 
  Send, 
  Bot, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Target, 
  RotateCcw,
  Compass,
  Calendar,
  Layers,
  HelpCircle,
  Flame,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompleteCourse, DayLesson, GuideDailyMission, LessonQuizQuestion } from '../../types';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { activateMissionFromGuide } from '../../utils/missionsManager';
import { sendChatMessageToGemini } from '../../services/gemini';

interface CompleteCoursePlayerModalProps {
  course: CompleteCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMissions?: () => void;
}

interface CourseProgressRecord {
  completedDays: number[];
  dayCompletedDates: { [dayNumber: number]: string };
  lastCompletedAt?: string;
}

const CoursePlayerModalContent: React.FC<{
  course: CompleteCourse;
  onClose: () => void;
  onNavigateToMissions?: () => void;
}> = ({
  course,
  onClose,
  onNavigateToMissions
}) => {
  const { success, warning, info } = useToast();
  
  // Progress persistence in localStorage
  const storageKey = `fluxglow_course_progress_${course.id}`;
  const [progress, setProgress] = useState<CourseProgressRecord>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      completedDays: [],
      dayCompletedDates: {}
    };
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Quiz state for the current day
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // AI Tutor contextual chat state
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string; time: string }>>([]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiChatScrollRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Current day lesson data
  const currentDayLesson: DayLesson = useMemo(() => {
    const found = course.days.find(d => d.dayNumber === selectedDayNumber);
    return found || course.days[0];
  }, [course, selectedDayNumber]);

  // Define total pages for the current day:
  // Pages 0 to (sections.length - 1): Sections
  // Page (sections.length): Quiz Validation
  // Page (sections.length + 1): Daily Missions
  // Page (sections.length + 2): Flux AI Tutor
  const totalPagesInCurrentDay = useMemo(() => {
    return currentDayLesson.sections.length + 3;
  }, [currentDayLesson]);

  const QUIZ_PAGE_INDEX = currentDayLesson.sections.length;
  const MISSIONS_PAGE_INDEX = currentDayLesson.sections.length + 1;
  const AI_TUTOR_PAGE_INDEX = currentDayLesson.sections.length + 2;

  // Check if a day is unlocked
  const isDayUnlocked = (dayNum: number): boolean => {
    if (dayNum === 1) return true;
    const prevDayCompleted = progress.completedDays.includes(dayNum - 1);
    return prevDayCompleted;
  };

  // Reset page index and quiz state when switching days
  useEffect(() => {
    setActivePageIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(progress.completedDays.includes(selectedDayNumber));
    
    // Initialize AI contextual greeting for this specific day
    setAiChatMessages([
      {
        role: 'model',
        text: `Hola, soy Flux AI. ¿Tienes alguna duda sobre lo que acabas de leer en "${currentDayLesson.title}"? Responderé con base en el contenido de esta guía.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedDayNumber, currentDayLesson.title, progress.completedDays]);

  // Auto-scroll top when switching pages
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePageIndex, selectedDayNumber]);

  // Auto-scroll AI chat internally
  useEffect(() => {
    if (aiChatScrollRef.current) {
      aiChatScrollRef.current.scrollTop = aiChatScrollRef.current.scrollHeight;
    }
  }, [aiChatMessages, isAiLoading]);

  // Save progress helper
  const saveProgress = (newProg: CourseProgressRecord) => {
    setProgress(newProg);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newProg));
      window.dispatchEvent(new CustomEvent('fluxglow_course_progress_updated', { detail: newProg }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectQuizOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (currentDayLesson.quiz.some(q => quizAnswers[q.id] === undefined)) {
      warning('Responde todas las preguntas', 'Por favor responde las 3 preguntas sencillas para comprobar tu aprendizaje.');
      return;
    }

    let score = 0;
    currentDayLesson.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const isCompleted = !progress.completedDays.includes(selectedDayNumber);
    if (isCompleted) {
      const todayStr = new Date().toISOString().split('T')[0];
      const updatedProg: CourseProgressRecord = {
        completedDays: [...progress.completedDays, selectedDayNumber],
        dayCompletedDates: { ...progress.dayCompletedDates, [selectedDayNumber]: todayStr },
        lastCompletedAt: new Date().toISOString()
      };
      saveProgress(updatedProg);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      success(`¡Día ${selectedDayNumber} completado con éxito!`, `Obtuviste ${score}/3 aciertos. Puedes revisar tus misiones prácticas en la siguiente página.`);
    }
  };

  const handleActivateMission = (mission: GuideDailyMission) => {
    const guideItemAdapt: any = {
      id: `${course.id}-day-${selectedDayNumber}`,
      title: `${course.title} (${currentDayLesson.title})`,
      category: course.category,
      dailyMissions: [mission]
    };
    activateMissionFromGuide(guideItemAdapt, mission.id);
    confetti({ particleCount: 35, spread: 55 });
    success('¡Misión activada!', `"${mission.title}" se ha añadido a tu panel de misiones diarias.`);
  };

  // Send question to Flux AI (grounded in current day context)
  const handleSendAiQuestion = async (textToSend?: string) => {
    const question = (textToSend || aiInputText).trim();
    if (!question || isAiLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    setAiInputText('');
    setIsAiLoading(true);

    try {
      const strictContextPrompt = `Eres Flux AI, el guía empático de bienestar de la guía "${course.title}".

REGLA ESTRICTA DE GROUNDING:
Tu principal referencia es el contenido del Día ${selectedDayNumber}: "${currentDayLesson.title}", provisto textualmente a continuación:

--- TEXTO DEL DÍA ---
${currentDayLesson.fullContextForAI}
--- FIN DEL TEXTO ---

INSTRUCCIONES:
1. Responde a la duda del usuario de forma clara, empática y práctica basándote en el texto.
2. Mantén un tono cálido, cercano, estructurado y alentador.
3. Si el usuario pregunta algo complementario de bienestar, respóndele brevemente y anímalo a seguir con los ejercicios del día.`;

      const responseText = await sendChatMessageToGemini({
        message: question,
        history: aiChatMessages.slice(-4).map(m => ({ role: m.role, text: m.text })),
        mode: 'educativo',
        userMood: 'Curioso',
        userContext: {
          name: 'Usuario de FluxGlow',
          emotionalState: `Revisando ${currentDayLesson.title}`
        }
      });

      const botMsg = {
        role: 'model' as const,
        text: responseText || `En este Día ${selectedDayNumber}, lo esencial es poner en práctica las técnicas explicadas. Recuerda que la constancia y la amabilidad contigo mismo marcan la diferencia.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.warn('Error respondiendo duda en guía:', e);
      const fallbackMsg = {
        role: 'model' as const,
        text: `Basado en el Día ${selectedDayNumber} ("${currentDayLesson.title}"), recuerda aplicar los ejercicios paso a paso y con calma.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const totalCompleted = progress.completedDays.length;
  const progressPercent = Math.round((totalCompleted / course.totalDays) * 100);

  // Helper to get step label
  const getPageTitle = (pageIdx: number): string => {
    if (pageIdx < currentDayLesson.sections.length) {
      return currentDayLesson.sections[pageIdx]?.title || `Paso ${pageIdx + 1}`;
    }
    if (pageIdx === QUIZ_PAGE_INDEX) return 'Comprobación del Día';
    if (pageIdx === MISSIONS_PAGE_INDEX) return 'Misiones Prácticas';
    if (pageIdx === AI_TUTOR_PAGE_INDEX) return 'Consultas Flux AI';
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8f4] flex flex-col w-screen h-screen overflow-hidden animate-fadeIn select-text">
      
      {/* 1. TOP MAIN HEADER BAR (Brand Dark Sage) */}
      <header className="bg-brand-sage-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-brand-sage-800 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-sage-800 border border-brand-sage-700 flex items-center justify-center text-brand-gold-300 font-bold shadow-xs">
            <BookOpen className="w-5 h-5 text-brand-gold-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-sage-800 text-brand-gold-300 px-2.5 py-0.5 rounded-full border border-brand-gold-400/30">
                Guía Completa de 1 Semana
              </span>
              <span className="text-xs text-brand-sand-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.totalDays} Días
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress badge */}
          <div className="hidden md:flex items-center gap-2 bg-brand-sage-950/70 border border-brand-sage-700/60 px-3 py-1.5 rounded-full text-xs text-brand-sand-200">
            <span>Progreso:</span>
            <span className="font-bold text-brand-gold-300">{totalCompleted}/{course.totalDays} Días ({progressPercent}%)</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-brand-sand-300 hover:text-white hover:bg-brand-sage-800 transition-colors cursor-pointer"
            title="Cerrar guía completa"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 2. DAYS SELECTOR BAR (Día 1 to Día 7) */}
      <nav aria-label="Navegación de días" className="bg-brand-sand-100/90 px-4 sm:px-8 py-2.5 border-b border-brand-sand-300 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-thin">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1 shrink-0 hidden sm:inline">
          Días:
        </span>
        {course.days.map((day) => {
          const isUnlocked = isDayUnlocked(day.dayNumber);
          const isCompleted = progress.completedDays.includes(day.dayNumber);
          const isSelected = selectedDayNumber === day.dayNumber;

          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                if (isUnlocked) {
                  setSelectedDayNumber(day.dayNumber);
                } else {
                  info('Día bloqueado', `Completa el Día ${day.dayNumber - 1} para desbloquear este día.`);
                }
              }}
              disabled={!isUnlocked}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-sage-700 text-white shadow-sm border border-brand-sage-800 ring-2 ring-brand-sage-500/30'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : isUnlocked
                  ? 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : isUnlocked ? (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSelected ? 'bg-brand-gold-300 text-brand-sage-900' : 'bg-brand-sage-200 text-brand-sage-800'
                }`}>
                  {day.dayNumber}
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span>Día {day.dayNumber}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. STEP PAGE BREADCRUMB / TABS STRIP (Pages within current Day) */}
      <div className="bg-white/95 backdrop-blur-md px-4 sm:px-8 py-2.5 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-0.5">
          <span className="text-xs font-bold text-brand-sage-800 uppercase tracking-wider bg-brand-sage-50 px-2.5 py-1 rounded-lg border border-brand-sage-200 shrink-0">
            Día {currentDayLesson.dayNumber}
          </span>
          <span className="text-stone-300 shrink-0">/</span>

          {/* Section Pills */}
          {currentDayLesson.sections.map((sec, idx) => (
            <button
              key={sec.id || idx}
              onClick={() => setActivePageIndex(idx)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activePageIndex === idx
                  ? 'bg-brand-sage-600 text-white shadow-2xs font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <span>Paso {idx + 1}</span>
            </button>
          ))}

          {/* Quiz Page Pill */}
          <button
            onClick={() => setActivePageIndex(QUIZ_PAGE_INDEX)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activePageIndex === QUIZ_PAGE_INDEX
                ? 'bg-amber-500 text-white shadow-2xs font-bold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Comprobación (3)</span>
          </button>

          {/* Missions Page Pill */}
          <button
            onClick={() => setActivePageIndex(MISSIONS_PAGE_INDEX)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activePageIndex === MISSIONS_PAGE_INDEX
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Misiones ({currentDayLesson.missions.length})</span>
          </button>

          {/* AI Tutor Page Pill */}
          <button
            onClick={() => setActivePageIndex(AI_TUTOR_PAGE_INDEX)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activePageIndex === AI_TUTOR_PAGE_INDEX
                ? 'bg-brand-sage-700 text-white shadow-2xs font-bold'
                : 'bg-brand-sand-100 hover:bg-brand-sand-200 text-stone-700 border border-brand-sand-300'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-brand-sage-600" />
            <span>Flux AI</span>
          </button>
        </div>

        {/* Current step counter */}
        <div className="text-xs font-bold text-stone-500 shrink-0 hidden sm:flex items-center gap-1.5">
          <span>Página {activePageIndex + 1} de {totalPagesInCurrentDay}</span>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA (PAGINATED: Exactly ONE Section/Phase per Page) */}
      <main 
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 max-w-5xl w-full mx-auto"
      >
        
        {/* ======================================================== */}
        {/* CASE A: CONTENT SECTION PAGE (Step 1, Step 2, Step 3...) */}
        {/* ======================================================== */}
        {activePageIndex < currentDayLesson.sections.length && (() => {
          const currentSection = currentDayLesson.sections[activePageIndex];
          if (!currentSection) return null;

          return (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Day & Step Header Banner */}
              <div className="border-b border-stone-200 pb-6">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-100/80 px-3 py-1 rounded-full border border-brand-sage-300">
                    Día {currentDayLesson.dayNumber} • {currentDayLesson.title.replace(`Día ${currentDayLesson.dayNumber}: `, '')}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentDayLesson.readTime}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Paso {activePageIndex + 1} de {currentDayLesson.sections.length}
                  </span>
                </div>

                {/* Section Main Title (Big, Visually Bold Typography) */}
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                  {currentSection.title}
                </h2>
                {currentSection.subtitle && (
                  <p className="text-base sm:text-lg font-medium text-brand-sage-700 mt-2">
                    {currentSection.subtitle}
                  </p>
                )}
              </div>

              {/* Day Objective Card (Shown on Step 1) */}
              {activePageIndex === 0 && currentDayLesson.objective && (
                <div className="bg-gradient-to-r from-brand-sage-50 to-brand-sand-100 p-5 sm:p-6 rounded-3xl border border-brand-sage-200 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-sage-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Target className="w-5 h-5 text-brand-gold-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-900 block mb-1">
                      🎯 Objetivo de este Día:
                    </span>
                    <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                      {currentDayLesson.objective}
                    </p>
                  </div>
                </div>
              )}

              {/* Main Explanatory Content (Large, High-Contrast Typography) */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-6">
                <p className="text-base sm:text-lg lg:text-xl text-stone-800 leading-relaxed font-normal">
                  {currentSection.content}
                </p>

                {/* Key Bullet Points Box */}
                {currentSection.bulletPoints && currentSection.bulletPoints.length > 0 && (
                  <div className="bg-[#fbf9f5] rounded-2xl p-6 border border-brand-sand-300 space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-sage-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-gold-500" />
                      <span>Puntos Clave a Recordar:</span>
                    </h4>
                    <div className="space-y-3">
                      {currentSection.bulletPoints.map((bp, bidx) => (
                        <div key={bidx} className="flex items-start gap-3 text-sm sm:text-base text-stone-800">
                          <CheckCircle2 className="w-5 h-5 text-brand-sage-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{bp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Exercise Box */}
                {currentSection.exercise && (
                  <div className="bg-gradient-to-br from-brand-sage-50/90 to-emerald-50/70 rounded-2xl p-6 sm:p-8 border border-brand-sage-300 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-brand-sage-950 font-bold text-base sm:text-lg">
                      <Sparkles className="w-5 h-5 text-brand-gold-600" />
                      <span>{currentSection.exercise.title}</span>
                    </div>
                    <ol className="space-y-3 text-sm sm:text-base text-stone-800">
                      {currentSection.exercise.steps.map((st, sidx) => (
                        <li key={sidx} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-brand-sage-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {sidx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Key Tip */}
                {currentSection.tip && (
                  <div className="bg-amber-50/90 rounded-2xl p-5 sm:p-6 border border-amber-200/90 text-sm sm:text-base text-amber-950 flex items-start gap-3.5 shadow-2xs">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                        Consejo de Aplicación:
                      </strong>
                      <p className="leading-relaxed">{currentSection.tip}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* CASE B: QUIZ / CHECKING PAGE (3 Validation Questions)    */}
        {/* ======================================================== */}
        {activePageIndex === QUIZ_PAGE_INDEX && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="border-b border-stone-200 pb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Comprobación Interactiva
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Día {currentDayLesson.dayNumber}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                Comprobemos lo aprendido en el Día {currentDayLesson.dayNumber}
              </h2>
              <p className="text-base sm:text-lg text-stone-600 mt-2">
                Responde estas 3 sencillas preguntas para validar tu comprensión y consolidar tu avance.
              </p>
            </div>

            {/* Questions list */}
            <div className="space-y-6">
              {currentDayLesson.quiz.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.correctAnswerIndex;

                return (
                  <div key={q.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                    <p className="text-base sm:text-lg font-bold text-stone-900">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selectedOpt === optIdx;
                        const isThisCorrect = q.correctAnswerIndex === optIdx;

                        let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                        if (quizSubmitted) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (isThisSelected && !isThisCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                          } else {
                            btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'bg-brand-sage-700 text-white border-brand-sage-800 font-semibold shadow-xs';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`p-4 rounded-2xl text-sm text-left border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanation if submitted */}
                    {quizSubmitted && (
                      <div className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${
                        isCorrect 
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200' 
                          : 'bg-rose-50 text-rose-950 border-rose-200'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{isCorrect ? '¡Correcto!' : 'Explicación recomendada:'}</p>
                          <p className="mt-1 text-xs sm:text-sm leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit CTA */}
            {!quizSubmitted ? (
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  className="px-8 py-3.5 text-base font-bold shadow-md"
                >
                  Comprobar Mis Respuestas <Check className="w-5 h-5 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {quizScore}/3
                  </div>
                  <div>
                    <p className="text-base font-bold text-emerald-950">¡Día {currentDayLesson.dayNumber} Validado con Éxito!</p>
                    <p className="text-xs sm:text-sm text-emerald-800">Avanza a la siguiente página para activar tus misiones prácticas del día.</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuizSubmitted(false)}
                  className="text-xs sm:text-sm font-bold text-emerald-800 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Reintentar comprobación
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* CASE C: MISSIONS PAGE (Daily Practical Habits)          */}
        {/* ======================================================== */}
        {activePageIndex === MISSIONS_PAGE_INDEX && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="border-b border-stone-200 pb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Hábitos y Misiones Prácticas
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Día {currentDayLesson.dayNumber}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                Pon en acción lo aprendido hoy
              </h2>
              <p className="text-base sm:text-lg text-stone-600 mt-2">
                Activa estas misiones para registrarlas en tu rutina diaria y ganar experiencia (+XP).
              </p>
            </div>

            {/* Missions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDayLesson.missions.map((m) => (
                <div key={m.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between space-y-5 hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {m.timeEstimate}
                      </span>
                      <span className="font-bold text-brand-gold-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                        +{m.xp} XP
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-lg mb-2">{m.title}</h3>
                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{m.description}</p>
                  </div>

                  <Button
                    onClick={() => handleActivateMission(m)}
                    variant="outline"
                    className="w-full py-3 text-sm font-bold text-brand-sage-800 border-brand-sage-300 hover:bg-brand-sage-50"
                  >
                    Activar en Mis Misiones <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Tip on habits */}
            <div className="bg-[#fbf9f5] rounded-2xl p-5 border border-brand-sand-300 text-xs sm:text-sm text-stone-700 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-sage-600 shrink-0" />
              <span>Estas misiones aparecerán en tu módulo de <strong>Metas y Misiones</strong> para que puedas marcar su cumplimiento diario.</span>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CASE D: FLUX AI TUTOR PAGE (Day Context Q&A)             */}
        {/* ======================================================== */}
        {activePageIndex === AI_TUTOR_PAGE_INDEX && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="border-b border-stone-200 pb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-800 bg-brand-sage-100 px-3 py-1 rounded-full border border-brand-sage-300">
                  Tutor Inteligente
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Día {currentDayLesson.dayNumber}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                Consultas con Flux AI
              </h2>
              <p className="text-base sm:text-lg text-stone-600 mt-2">
                Haz cualquier pregunta sobre el tema de hoy: &ldquo;{currentDayLesson.title}&rdquo;.
              </p>
            </div>

            {/* AI Chat Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              
              {/* Chat Messages Log */}
              <div 
                ref={aiChatScrollRef}
                className="bg-[#fbf9f5] rounded-2xl p-5 border border-brand-sand-300 min-h-[220px] max-h-[360px] overflow-y-auto space-y-4"
              >
                {aiChatMessages.map((msg, midx) => (
                  <div 
                    key={midx}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-xl bg-brand-sage-700 text-brand-gold-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl text-sm max-w-[85%] sm:max-w-[75%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-sage-800 text-white rounded-tr-none'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-2xs'
                    }`}>
                      <p>{msg.text}</p>
                      <span className="block text-[10px] mt-1.5 opacity-70 text-right">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 animate-pulse">
                    <Bot className="w-4 h-4 text-brand-sage-600" />
                    <span>Flux AI está repasando los puntos de este día para responderte...</span>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-xs text-stone-400 self-center">Preguntas rápidas:</span>
                <button
                  onClick={() => handleSendAiQuestion(`¿Cómo aplico la técnica de hoy en mi vida cotidiana?`)}
                  className="bg-stone-100 hover:bg-brand-sage-50 text-stone-700 hover:text-brand-sage-800 px-3.5 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer"
                >
                  💡 ¿Cómo aplicarlo en el día a día?
                </button>
                <button
                  onClick={() => handleSendAiQuestion(`¿Qué debo hacer si me cuesta concentrarme en los ejercicios de hoy?`)}
                  className="bg-stone-100 hover:bg-brand-sage-50 text-stone-700 hover:text-brand-sage-800 px-3.5 py-1.5 rounded-full border border-stone-200 transition-colors cursor-pointer"
                >
                  🧠 ¿Qué hago si me cuesta concentrarme?
                </button>
              </div>

              {/* Chat Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiQuestion();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder={`Escribe tu pregunta sobre "${currentDayLesson.title}"...`}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm bg-brand-sand-50 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!aiInputText.trim() || isAiLoading}
                  className="px-6 py-3 text-sm font-bold"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* 5. BOTTOM NAVIGATION BAR (Clean Paginated Forward / Back Controls) */}
      <footer className="bg-white px-4 sm:px-8 py-3.5 border-t border-stone-200 flex items-center justify-between shrink-0 shadow-sm">
        {/* Previous Button */}
        <button
          onClick={() => {
            if (activePageIndex > 0) {
              setActivePageIndex(prev => prev - 1);
            } else if (selectedDayNumber > 1) {
              setSelectedDayNumber(prev => prev - 1);
            }
          }}
          disabled={activePageIndex === 0 && selectedDayNumber === 1}
          className="px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{activePageIndex === 0 && selectedDayNumber > 1 ? `Día ${selectedDayNumber - 1}` : 'Página Anterior'}</span>
        </button>

        {/* Center Progress Indicator */}
        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold text-stone-700 block">
            {getPageTitle(activePageIndex)}
          </span>
          <span className="text-[11px] text-stone-400">
            Página {activePageIndex + 1} de {totalPagesInCurrentDay} • Día {selectedDayNumber} de {course.totalDays}
          </span>
        </div>

        {/* Next / Advance Button */}
        <div className="flex items-center gap-2">
          {activePageIndex < totalPagesInCurrentDay - 1 ? (
            <Button
              onClick={() => setActivePageIndex(prev => prev + 1)}
              variant="primary"
              className="px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold shadow-xs"
            >
              <span>Siguiente Página</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : selectedDayNumber < course.totalDays ? (
            <Button
              onClick={() => {
                const nextDay = selectedDayNumber + 1;
                setSelectedDayNumber(nextDay);
              }}
              variant="primary"
              className="px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 shadow-xs"
            >
              <span>Avanzar al Día {selectedDayNumber + 1}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              variant="primary"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800"
            >
              <span>¡Guía de 1 Semana Completada! 🎉</span>
            </Button>
          )}
        </div>
      </footer>

    </div>
  );
};

export const CompleteCoursePlayerModal: React.FC<CompleteCoursePlayerModalProps> = ({
  course,
  isOpen,
  onClose,
  onNavigateToMissions
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  return (
    <CoursePlayerModalContent
      course={course}
      onClose={onClose}
      onNavigateToMissions={onNavigateToMissions}
    />
  );
};
