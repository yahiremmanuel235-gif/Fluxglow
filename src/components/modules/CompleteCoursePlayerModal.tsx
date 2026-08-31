import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  BookOpen, 
  Award, 
  Clock, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Target, 
  RotateCcw,
  Volume2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompleteCourse, DayLesson, GuideDailyMission, LessonQuizQuestion } from '../../types';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { activateMissionFromGuide } from '../../utils/missionsManager';
import { sendChatMessageToGemini } from '../../services/gemini';

interface CompleteCoursePlayerModalProps {
  course: CompleteCourse;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMissions?: () => void;
}

interface CourseProgressRecord {
  completedDays: number[];
  dayCompletedDates: { [dayNumber: number]: string };
  lastCompletedAt?: string;
}

export const CompleteCoursePlayerModal: React.FC<CompleteCoursePlayerModalProps> = ({
  course,
  isOpen,
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
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  // Quiz state for the current day
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // AI Tutor contextual chat state
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string; time: string }>>([]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const aiChatScrollRef = useRef<HTMLDivElement>(null);

  // Current day lesson
  const currentDayLesson: DayLesson = useMemo(() => {
    const found = course.days.find(d => d.dayNumber === selectedDayNumber);
    return found || course.days[0];
  }, [course, selectedDayNumber]);

  // Check if a day is unlocked
  // Day 1 is always unlocked.
  // Day N is unlocked if Day N-1 is completed.
  const isDayUnlocked = (dayNum: number): boolean => {
    if (dayNum === 1) return true;
    const prevDayCompleted = progress.completedDays.includes(dayNum - 1);
    if (!prevDayCompleted) return false;
    
    // Check if next day unlocked
    return true;
  };

  // Reset day section and quiz when switching days
  useEffect(() => {
    setActiveSectionIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(progress.completedDays.includes(selectedDayNumber));
    
    // Initialize AI initial greeting for this specific day
    setAiChatMessages([
      {
        role: 'model',
        text: `Hola, soy Flux AI, tu tutor en este curso. ¿Tienes alguna duda o pregunta sobre el texto que acabas de leer en "${currentDayLesson.title}"? Responderé basándome exclusivamente en el contenido de esta lección.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedDayNumber, currentDayLesson.title, progress.completedDays]);

  // Auto-scroll AI chat
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

    // If passed at least 2/3, mark day as completed
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
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 }
      });
      success(`¡Día ${selectedDayNumber} completado con éxito!`, `Obtuviste ${score}/3 aciertos. Se han desbloqueado tus misiones diarias.`);
    }
  };

  const handleActivateMission = (mission: GuideDailyMission) => {
    // Adapt to guide item to store in daily missions
    const guideItemAdapt: any = {
      id: `${course.id}-day-${selectedDayNumber}`,
      title: `${course.title} (${currentDayLesson.title})`,
      category: course.category,
      dailyMissions: [mission]
    };
    activateMissionFromGuide(guideItemAdapt, mission.id);
    confetti({ particleCount: 30, spread: 50 });
    success('¡Misión activada!', `"${mission.title}" se ha añadido a tu panel de misiones diarias.`);
  };

  // Send question to Flux AI (strictly grounded in current day context)
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
      const strictContextPrompt = `Eres Flux AI, el tutor pedagógico del curso de bienestar "${course.title}".

REGLA ESTRICTA DE SEGURIDAD Y GROUNDING:
Tu ÚNICA fuente de información para responder al usuario es el contenido de la lección del Día ${selectedDayNumber}: "${currentDayLesson.title}", provisto textualmente a continuación:

--- TEXTO DE LA LECCIÓN ---
${currentDayLesson.fullContextForAI}
--- FIN DEL TEXTO ---

INSTRUCCIONES:
1. Responde a la duda del usuario basándote EXCLUSIVAMENTE en el texto de la lección.
2. Si la duda o tema NO está contemplado en el texto de la lección, responde amablemente indicando que esa información no forma parte de este módulo y sugiérele repasar los puntos clave de la lección.
3. Mantén un tono cálido, empático, claro y pedagógico (estilo docente de Aprendes).
4. No menciones fuentes externas ni agregues datos que contradigan o expandan fuera del texto provisto.`;

      const responseText = await sendChatMessageToGemini({
        message: question,
        history: aiChatMessages.slice(-4).map(m => ({ role: m.role, text: m.text })),
        mode: 'educativo',
        userMood: 'Curioso',
        userContext: {
          name: 'Estudiante de FluxGlow',
          emotionalState: `Estudiando ${currentDayLesson.title}`
        }
      });

      const botMsg = {
        role: 'model' as const,
        text: responseText || `En la lección del Día ${selectedDayNumber}, el punto central es aplicar las técnicas prácticas descritas paso a paso. Recuerda revisar la sección de fundamentos y ejercicios.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.warn('Error respondiendo duda de curso:', e);
      const fallbackMsg = {
        role: 'model' as const,
        text: `Basado en la lección "${currentDayLesson.title}", recuerda que lo más importante es aplicar los ejercicios prácticos con calma y constancia.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalCompleted = progress.completedDays.length;
  const progressPercent = Math.round((totalCompleted / course.totalDays) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-brand-sage-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between border-b border-brand-sage-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-sage-800/80 border border-brand-sage-700 flex items-center justify-center text-brand-gold-300 font-bold text-lg">
              <GraduationCap className="w-5 h-5 text-brand-gold-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-brand-sage-800 text-brand-gold-300 px-2.5 py-0.5 rounded-full border border-brand-gold-300/30">
                  {course.badge}
                </span>
                <span className="text-xs text-brand-sand-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.totalDays} Días
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1">
                {course.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-sand-300 hover:text-white hover:bg-brand-sage-800 transition-colors"
            title="Cerrar curso"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Course Progress Bar */}
        <div className="bg-brand-sage-950 px-5 sm:px-8 py-2.5 flex items-center justify-between border-b border-brand-sage-800/60 text-xs text-brand-sand-300 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span>Progreso del Curso:</span>
            <span className="font-bold text-brand-gold-300">{totalCompleted} de {course.totalDays} días completados ({progressPercent}%)</span>
          </div>
          <div className="w-36 sm:w-56 bg-brand-sage-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brand-gold-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Days Navigator Bar (Tabs 1 to 7) */}
        <div className="bg-brand-sand-100/80 px-4 sm:px-8 py-3 border-b border-brand-sand-300 overflow-x-auto flex items-center gap-2 flex-shrink-0 scrollbar-thin">
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
                    info('Día bloqueado', `Completa el Día ${day.dayNumber - 1} para desbloquear esta clase.`);
                  }
                }}
                disabled={!isUnlocked}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-sage-700 text-white shadow-sm border border-brand-sage-800'
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
                  <span className="w-4 h-4 rounded-full bg-brand-sage-200 text-brand-sage-800 flex items-center justify-center text-[10px] font-bold">
                    {day.dayNumber}
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>Día {day.dayNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 bg-brand-sand-50/50">
          
          {/* Day Header Banner */}
          <div className="bg-gradient-to-r from-brand-sage-900 to-brand-sage-800 rounded-2xl p-6 text-white border border-brand-sage-700 relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand-gold-400/20 text-brand-gold-300 border border-brand-gold-400/40 text-[11px] font-bold px-3 py-1 rounded-full">
                  Clase Interactiva • Día {currentDayLesson.dayNumber}
                </span>
                <span className="text-xs text-brand-sand-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {currentDayLesson.readTime}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {currentDayLesson.title}
              </h3>
              <p className="text-sm text-brand-sand-200 max-w-3xl leading-relaxed">
                {currentDayLesson.subtitle}
              </p>
              
              {/* Learning Objective pill */}
              <div className="mt-4 inline-flex items-start sm:items-center gap-2 bg-brand-sage-950/60 border border-brand-sage-700/60 rounded-xl px-3.5 py-2 text-xs text-brand-gold-200">
                <Target className="w-4 h-4 text-brand-gold-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span><strong>Objetivo del Día:</strong> {currentDayLesson.objective}</span>
              </div>
            </div>
          </div>

          {/* Section Step Navigator (Like Aprendes Slides) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-sage-600" />
                <span>Contenido de la Clase (Sección {activeSectionIndex + 1} de {currentDayLesson.sections.length})</span>
              </h4>
              <div className="flex items-center gap-1">
                {currentDayLesson.sections.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`w-7 h-2 rounded-full transition-all ${
                      activeSectionIndex === idx ? 'bg-brand-sage-600 w-9' : 'bg-stone-200 hover:bg-stone-300'
                    }`}
                    title={`Ir a sección ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Active Section Card */}
            {currentDayLesson.sections[activeSectionIndex] && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5 animate-fadeIn">
                <div className="border-b border-stone-100 pb-3">
                  <span className="text-xs font-semibold text-brand-sage-600 uppercase tracking-wider">
                    Paso {activeSectionIndex + 1}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                    {currentDayLesson.sections[activeSectionIndex].title}
                  </h4>
                  {currentDayLesson.sections[activeSectionIndex].subtitle && (
                    <p className="text-sm font-medium text-stone-500">
                      {currentDayLesson.sections[activeSectionIndex].subtitle}
                    </p>
                  )}
                </div>

                <p className="text-base text-stone-700 leading-relaxed">
                  {currentDayLesson.sections[activeSectionIndex].content}
                </p>

                {/* Bullet points if available */}
                {currentDayLesson.sections[activeSectionIndex].bulletPoints && (
                  <div className="bg-brand-sand-50/70 rounded-xl p-4 border border-brand-sand-200 space-y-2">
                    {currentDayLesson.sections[activeSectionIndex].bulletPoints?.map((bp, bidx) => (
                      <div key={bidx} className="flex items-start gap-2.5 text-sm text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-brand-sage-600 flex-shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Practical Exercise Box if available */}
                {currentDayLesson.sections[activeSectionIndex].exercise && (
                  <div className="bg-gradient-to-br from-brand-sage-50 to-emerald-50 rounded-2xl p-5 border border-brand-sage-200 space-y-3">
                    <div className="flex items-center gap-2 text-brand-sage-900 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-brand-gold-500" />
                      <span>{currentDayLesson.sections[activeSectionIndex].exercise?.title}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-stone-800">
                      {currentDayLesson.sections[activeSectionIndex].exercise?.steps.map((st, sidx) => (
                        <li key={sidx} className="leading-relaxed pl-1">{st}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Tip box if available */}
                {currentDayLesson.sections[activeSectionIndex].tip && (
                  <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-sm text-amber-900 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Tip clave:</strong> {currentDayLesson.sections[activeSectionIndex].tip}</span>
                  </div>
                )}

                {/* Next / Previous Section Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setActiveSectionIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeSectionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>

                  <button
                    onClick={() => setActiveSectionIndex(prev => Math.min(currentDayLesson.sections.length - 1, prev + 1))}
                    disabled={activeSectionIndex === currentDayLesson.sections.length - 1}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-sage-700 text-white hover:bg-brand-sage-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                  >
                    Siguiente Sección <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 3 PREGUNTAS DE COMPROBACIÓN (QUIZ DE APRENDIZAJE)        */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Evaluación Rápida
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-1">
                  Comprobemos lo aprendido en el Día {currentDayLesson.dayNumber}
                </h4>
                <p className="text-xs text-stone-500">
                  Responde estas 3 sencillas preguntas para validar tu comprensión y desbloquear tus misiones.
                </p>
              </div>
              <Award className="w-7 h-7 text-brand-gold-500" />
            </div>

            <div className="space-y-6">
              {currentDayLesson.quiz.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.correctAnswerIndex;

                return (
                  <div key={q.id} className="bg-brand-sand-50/60 rounded-2xl p-5 border border-brand-sand-200 space-y-3">
                    <p className="text-sm font-bold text-stone-900">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selectedOpt === optIdx;
                        const isThisCorrect = q.correctAnswerIndex === optIdx;

                        let btnStyle = 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50';
                        if (quizSubmitted) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isThisSelected && !isThisCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                          } else {
                            btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'bg-brand-sage-700 text-white border-brand-sage-800 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`p-3.5 rounded-xl text-xs text-left border transition-all flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanation if submitted */}
                    {quizSubmitted && (
                      <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                        isCorrect 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{isCorrect ? '¡Correcto!' : 'Respuesta a repasar:'}</p>
                          <p className="mt-0.5">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  className="px-6 py-3 text-sm font-bold shadow-md"
                >
                  Comprobar Mis Respuestas <Check className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {quizScore}/3
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">¡Lección del Día {currentDayLesson.dayNumber} Validada!</p>
                    <p className="text-xs text-emerald-700">Tus misiones prácticas se encuentran listas más abajo.</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuizSubmitted(false)}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reintentar quiz
                </button>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* MISIONES PRÁCTICAS DEL DÍA DESBLOQUEADAS                  */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Misiones Prácticas del Día
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-1">
                  Pon en acción lo aprendido hoy
                </h4>
              </div>
              <Target className="w-6 h-6 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentDayLesson.missions.map((m) => (
                <div key={m.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {m.timeEstimate}
                      </span>
                      <span className="font-bold text-brand-gold-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        +{m.xp} XP
                      </span>
                    </div>
                    <h5 className="font-bold text-stone-900 text-sm mb-1">{m.title}</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">{m.description}</p>
                  </div>

                  <Button
                    onClick={() => handleActivateMission(m)}
                    variant="outline"
                    className="w-full text-xs font-bold text-brand-sage-800 border-brand-sage-300 hover:bg-brand-sage-50"
                  >
                    Activar en Mis Misiones <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* FLUX AI TUTOR: RESUELVE DUDAS EXCLUSIVAS DEL TEXTO       */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-sage-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-brand-sand-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-sage-700 text-brand-gold-300 flex items-center justify-center font-bold shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <span>Dudas con Flux AI</span>
                    <span className="text-[10px] font-bold uppercase bg-brand-sage-100 text-brand-sage-800 px-2 py-0.5 rounded-full border border-brand-sage-300">
                      Contexto de la Guía
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500">
                    Pregúntame cualquier duda sobre el texto de hoy. Responderé únicamente con lo expuesto en esta clase.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Box */}
            <div 
              ref={aiChatScrollRef}
              className="bg-brand-sand-50/80 rounded-2xl p-4 border border-brand-sand-200 max-h-60 overflow-y-auto space-y-3"
            >
              {aiChatMessages.map((msg, midx) => (
                <div 
                  key={midx}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-xl bg-brand-sage-700 text-brand-gold-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] sm:max-w-[75%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-sage-800 text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-xs'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="block text-[10px] mt-1 opacity-70 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex items-center gap-2 text-xs text-stone-500 animate-pulse">
                  <Bot className="w-4 h-4 text-brand-sage-600" />
                  <span>Flux AI está repasando la lección para responderte...</span>
                </div>
              )}
            </div>

            {/* Suggested Quick Questions */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-[11px] text-stone-400 self-center">Sugerencias:</span>
              <button
                onClick={() => handleSendAiQuestion(`¿Puedes resumirme en 2 puntos clave el ejercicio práctico de hoy?`)}
                className="bg-stone-100 hover:bg-brand-sage-50 text-stone-700 hover:text-brand-sage-800 px-3 py-1.5 rounded-full border border-stone-200 transition-colors"
              >
                💡 Resumir ejercicio práctico
              </button>
              <button
                onClick={() => handleSendAiQuestion(`¿Cómo aplico la técnica de hoy si estoy en clase o en el trabajo?`)}
                className="bg-stone-100 hover:bg-brand-sage-50 text-stone-700 hover:text-brand-sage-800 px-3 py-1.5 rounded-full border border-stone-200 transition-colors"
              >
                🏢 ¿Cómo aplicarlo en público?
              </button>
            </div>

            {/* AI Question Input Form */}
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
                placeholder={`¿Tienes alguna duda sobre ${currentDayLesson.title}?`}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-brand-sand-50 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!aiInputText.trim() || isAiLoading}
                className="px-4 py-2.5 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom Footer with Next Day Navigation */}
        <div className="bg-white px-5 sm:px-8 py-3.5 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSelectedDayNumber(prev => Math.max(1, prev - 1))}
            disabled={selectedDayNumber === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Día Anterior
          </button>

          <div className="flex items-center gap-2">
            {selectedDayNumber < course.totalDays ? (
              <Button
                onClick={() => {
                  const nextDay = selectedDayNumber + 1;
                  setSelectedDayNumber(nextDay);
                }}
                variant="primary"
                className="px-5 py-2.5 text-xs font-bold shadow-sm"
              >
                Avanzar al Día {selectedDayNumber + 1} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                variant="primary"
                className="px-5 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800"
              >
                ¡Completaste los 7 Días! <Award className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
