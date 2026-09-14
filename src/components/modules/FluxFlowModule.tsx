import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Zap, Lock, Tag, Clock, CheckCircle2, 
  ArrowRight, Brain, MessageSquare, Target, Users, BarChart, 
  Home, BookOpen, ChevronUp, ChevronDown, Sliders, ChevronLeft, 
  Square, Heart, BookmarkCheck, Play, ArrowLeft, Quote, Flame, Activity, Timer, Wind
} from 'lucide-react';
import { useJournal } from '../../hooks/useJournal';
import { incrementFluxStreak, getFluxStreak } from '../../utils/streakManager';
import { useToast } from '../common/Toast';
import confetti from 'canvas-confetti';
import { DEMO_GUIDES_CATALOG, AI_DEMO_NOTICE_TEXT } from '../../data/guidesData';
import { COMPLETE_COURSES_CATALOG, } from '../../data/completeGuidesData';
import { MoodIcon } from '../common/MoodIcon';
import { MoodType, ViewMode } from '../../types';
import { activateAllMissionsFromGuide } from '../../utils/missionsManager';
import { CompleteCoursePlayerModal } from './CompleteCoursePlayerModal';

const emojiMoods = [
  { id: 'enojado', image: '/assets/moods/mood-1-angry.png', label: 'Enojado', color: '#b91c1c', bg: '#fee2e2' },
  { id: 'triste', image: '/assets/moods/mood-2-sad.png', label: 'Triste', color: '#dc2626', bg: '#fef2f2' },
  { id: 'ansioso', image: '/assets/moods/mood-3-neutral.png', label: 'Inquieto', color: '#d97706', bg: '#fef3c7' },
  { id: 'tranquilo', image: '/assets/moods/mood-4-happy.png', label: 'Tranquilo', color: '#65a30d', bg: '#ecfccb' },
  { id: 'feliz', image: '/assets/moods/mood-5-veryhappy.png', label: 'Feliz', color: '#16a34a', bg: '#dcfce7' },
];

const availableTriggers = [
  'Trabajo', 'Estudios', 'Familia', 'Amigos', 'Pareja', 
  'Salud', 'Sueño', 'Dinero', 'Clima', 'Productividad', 'Descanso', 'Mindfulness'
];

interface EmotionQuote {
  quote: string;
  author: string;
  reflection: string;
  themeColor: string;
  bgColor: string;
}

const INSPIRATIONAL_QUOTES: Record<string, EmotionQuote> = {
  enojado: {
    quote: "La ira no es un defecto; es un mensajero que señala un límite vulnerado. No la reprimas: respírala hondo, comprende su raíz y canaliza su energía hacia una acción justa y serena.",
    author: "Regulación Emocional y Asertividad",
    reflection: "Has dado el paso más importante: reconocer tu enfado sin dejar que te controle. Permítete 5 minutos de pausa antes de reaccionar.",
    themeColor: '#b91c1c',
    bgColor: 'from-rose-50 to-orange-50'
  },
  triste: {
    quote: "Incluso las tormentas más densas terminan por disiparse. Date permiso para sentir, soltar el peso y recordar que tu valor permanece intacto aun en los días más grises.",
    author: "Autocompasión y Resiliencia",
    reflection: "Honrar tu tristeza es un acto de valentía. Hoy no necesitas ser fuerte para todo el mundo; cuídate como cuidarías a tu mejor amigo.",
    themeColor: '#de6943',
    bgColor: 'from-orange-50 to-amber-50'
  },
  ansioso: {
    quote: "No tienes que resolver toda tu vida hoy. La ansiedad intenta vivir en futuros hipotéticos; la paz solo existe en este momento presente. Un solo paso consciente basta.",
    author: "Mindfulness y Neurociencia",
    reflection: "Tu cuerpo está a salvo en este instante. Respira lento, suelta la mandíbula y concéntrate exclusivamente en lo que puedes hacer en los próximos 15 minutos.",
    themeColor: '#d97706',
    bgColor: 'from-amber-50 to-emerald-50/50'
  },
  tranquilo: {
    quote: "La serenidad no es la ausencia de retos, sino la presencia de armonía dentro de ti. Atesora este estado de equilibrio y úsalo como ancla para el resto de tu jornada.",
    author: "Sabiduría Consciente",
    reflection: "Cuando tu mente está en calma, tus decisiones son más sabias y tus relaciones más nutritivas. Celebra esta estabilidad interior.",
    themeColor: '#548c71',
    bgColor: 'from-emerald-50 to-teal-50/60'
  },
  feliz: {
    quote: "La alegría auténtica florece cuando apreciamos los pequeños milagros cotidianos. Multiplica esta energía compartiendo amabilidad y gratitud con quienes te rodean.",
    author: "Psicología Positiva y Florecimiento",
    reflection: "¡Qué dicha sentirte así! Anota qué factores han contribuido a tu bienestar hoy para poder cultivarlos con mayor frecuencia.",
    themeColor: '#16a34a',
    bgColor: 'from-emerald-50 to-green-100/60'
  }
};

export const FluxFlowModule: React.FC<{ onNavigate: (view: ViewMode) => void }> = ({ onNavigate }) => {
  const { createEntry } = useJournal();
  const { success, warning } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [selectedMood, setSelectedMood] = useState<MoodType>('feliz');
  const [intensity, setIntensity] = useState<number>(8);
  const [noteText, setNoteText] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Productividad']);
  const [showAllTriggers, setShowAllTriggers] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Step 2 State
  const [activeGuide, setActiveGuide] = useState<any | null>(null);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSaveJournal = async () => {
    if (!noteText.trim()) {
      warning('Escribe unas palabras', 'Por favor redacta cómo te sientes antes de guardar tu registro.');
      return;
    }
    try {
      await createEntry({
        mood: selectedMood,
        notes: noteText.trim(),
        intensity: intensity,
        triggers: selectedTriggers,
        habits: { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: intensity },
        aiFeedback: INSPIRATIONAL_QUOTES[selectedMood]?.reflection || 'Has identificado tus emociones con claridad.'
      });
      incrementFluxStreak();
      setIsSubmitted(true);
      confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      warning('Aviso al guardar', err?.message || 'No se pudo guardar la entrada.');
    }
  };

  const handleFinishGuide = () => {
    if (activeGuide) {
      let readGuides: string[] = [];
      try {
        const saved = localStorage.getItem('fluxglow_read_guides');
        if (saved) readGuides = JSON.parse(saved);
      } catch (e) {}
      
      if (!readGuides.includes(activeGuide.id)) {
        readGuides.push(activeGuide.id);
        localStorage.setItem('fluxglow_read_guides', JSON.stringify(readGuides));
      }
      activateAllMissionsFromGuide(activeGuide);
    }
    
    incrementFluxStreak();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    setActiveGuide(null);
    setCurrentStep(3);
  };

  const handleCourseDayComplete = () => {
    incrementFluxStreak();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    setActiveCourse(null);
    setCurrentStep(3);
  };

  const activeQuoteData = INSPIRATIONAL_QUOTES[selectedMood] || INSPIRATIONAL_QUOTES['feliz'];
  const activeEmojiItem = emojiMoods.find(m => m.id === selectedMood) || emojiMoods[4];

  // Combined Catalog for Step 2
  const mergedGuides = useMemo(() => {
    return [
      ...COMPLETE_COURSES_CATALOG.map(c => ({
        ...c,
        isCourse: true,
        readTime: `${c.totalDays} Días`
      })),
      ...DEMO_GUIDES_CATALOG.map(g => ({
        ...g,
        isCourse: false
      }))
    ];
  }, []);

  return (
    <div className="w-full bg-flux-brand-bath min-h-screen pb-24 pt-4 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative animate-fadeIn">
      {/* Course Modal overlays everything if active */}
      <CompleteCoursePlayerModal 
        course={activeCourse} 
        isOpen={!!activeCourse} 
        onClose={() => setActiveCourse(null)}
        isFluxMode={true}
        onFluxComplete={handleCourseDayComplete}
      />

      <div className="max-w-[1280px] mx-auto">
        {/* Navigation & Header */}
        {!activeGuide && (
          <>
            <div className="flex items-center justify-between py-2 border-b border-[#5F927B]/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-0.5 rounded-full ml-2 hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 fill-[#3E6855]" />
                  <span>Modo Inmersivo Flux</span>
                </span>
              </div>
              <button onClick={() => onNavigate('dashboard' as any)} className="text-xs font-semibold text-stone-700 hover:text-[#B54F2C] bg-white border border-stone-200 hover:border-[#F7D3C3] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
                <span>Salir del flujo</span>
              </button>
            </div>
            
            <div className="text-center my-6 px-2 overflow-visible">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1EA] border border-[#C5DDD0] text-xs font-bold text-[#3E6855] mb-2 shadow-2xs">
                <span>Paso {currentStep} de 3</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal leading-normal overflow-visible">
                <span className="bg-gradient-to-r from-[#3E6855] via-[#5F927B] to-[#E87A52] bg-clip-text text-transparent">
                  {currentStep === 1 ? 'Check-in Emocional' : currentStep === 2 ? 'Aprendizaje Diario' : '¡Flux Completado!'}
                </span>
              </h1>
            </div>
          </>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && !isSubmitted && (
          <div className="max-w-4xl mx-auto animate-fadeIn mt-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-5">
              <div className="w-full md:contents flex-1 max-w-2xl bg-white border-2 border-[#5F927B]/30 rounded-3xl sm:rounded-full py-3 sm:py-2 px-4 sm:px-6 shadow-xs flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative">
                <span className="text-sm md:text-base font-bold text-stone-800 text-center relative z-0 order-first md:order-none sm:py-1.5 shrink-0">
                  ¿Cómo te sientes hoy?
                </span>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full sm:w-auto sm:absolute md:static sm:left-4 z-10 shrink-0">
                  {emojiMoods.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMood(m.id as MoodType)}
                        className={`w-10 h-10 sm:w-10 sm:h-10 min-h-[40px] min-w-[40px] sm:min-h-[40px] sm:min-w-[40px] rounded-full flex items-center justify-center p-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-115 ring-2 ring-[#5F927B] shadow-md bg-[#EBF1EA]'
                            : 'opacity-75 hover:opacity-100 hover:scale-110'
                        }`}
                        title={m.label}
                      >
                        <img src={m.image} alt={m.label} className="w-full h-full object-contain pointer-events-none select-none" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 mb-5 shadow-2xs max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#5F927B]" />
                  <h4 className="text-xs sm:text-sm font-bold text-stone-800">
                    Nivel de Intensidad Emocional
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    intensity <= 3
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : intensity <= 7
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {intensity <= 3 ? 'Leve' : intensity <= 7 ? 'Moderado' : 'Intenso'} • {intensity}/10
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-[#5F927B] cursor-pointer h-2 bg-stone-100 rounded-lg min-h-[44px]"
                />
              </div>
            </div>

            <div className="flux-card-sage p-6 sm:p-8 mb-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#C5DDD0]/70 mb-4">
                <span className="text-xs font-bold text-[#3E6855] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#5F927B]" />
                  Espacio privado y seguro de desahogo
                </span>
              </div>
              <textarea
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="¿Por qué te sientes así el día de hoy?..."
                className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-base sm:text-lg focus:outline-none resize-none leading-relaxed"
              />
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#548c71]" /> Factores:
                  </span>
                  {(showAllTriggers ? availableTriggers : availableTriggers.slice(0, 6)).map((tag) => {
                    const isSelected = selectedTriggers.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTrigger(tag)}
                        className={`px-3 py-2 min-h-[44px] rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#e2eee6] text-[#253d33] border border-[#548c71]'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowAllTriggers(!showAllTriggers)}
                    className="px-3 py-2 min-h-[44px] rounded-full text-xs font-semibold text-[#548c71] hover:bg-[#e2eee6] border border-[#548c71]/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{showAllTriggers ? 'Menos' : `+${availableTriggers.length - 6} más`}</span>
                    {showAllTriggers ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 max-w-3xl mx-auto pb-10">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto text-stone-600 hover:text-stone-900 text-sm font-bold transition-all px-8 py-3 min-h-[44px] cursor-pointer bg-white border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-full shadow-xs flex items-center justify-center gap-2"
              >
                Saltar este paso
              </button>
              <button
                onClick={handleSaveJournal}
                className="w-full sm:w-auto bg-[#E87A52] hover:bg-[#D4653E] active:scale-98 text-white px-8 py-3 min-h-[44px] rounded-full text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="/assets/icons/send.png" alt="Enviar" className="w-4 h-4 object-contain brightness-0 invert" />
                <span>Guardar en mi Diario</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 SUBMITTED */}
        {currentStep === 1 && isSubmitted && (
          <div className="my-8 animate-in zoom-in-95 duration-300 max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br ${activeQuoteData.bgColor} rounded-3xl border-2 border-amber-200/90 shadow-md p-6 sm:p-10 text-center relative overflow-hidden`}>
              <div className="absolute -top-6 -right-6 text-stone-900/5 pointer-events-none">
                <Quote className="w-48 h-48" />
              </div>
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-stone-200 px-4 py-1.5 rounded-full shadow-2xs mb-6">
                <CheckCircle2 className="w-4 h-4 text-[#548c71]" />
                <span className="text-xs font-bold text-stone-800">Registro guardado en tu Diario</span>
              </div>
              <div className="max-w-2xl mx-auto my-3">
                <Quote className="w-8 h-8 text-amber-600/80 mx-auto mb-3" />
                <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 leading-relaxed">
                  "{activeQuoteData.quote}"
                </blockquote>
                <p className="text-xs sm:text-sm font-semibold text-amber-900/80 mt-3 uppercase tracking-wider">
                  — {activeQuoteData.author}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-stone-200/80 max-w-xl mx-auto my-6 text-left shadow-2xs">
                <p className="text-xs font-bold text-[#548c71] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mensaje de Acompañamiento:</span>
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {activeQuoteData.reflection}
                </p>
              </div>
              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-brand-sage-600 hover:bg-brand-sage-700 text-white px-8 py-3 min-h-[44px] rounded-full text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Pasar a la siguiente sección</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Catalog */}
        {currentStep === 2 && !activeGuide && (
          <div className="animate-fadeIn mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mergedGuides.map((guide, idx) => {
                const isCourse = guide.isCourse;
                const cardStyle = isCourse 
                  ? 'bg-gradient-to-b from-[#253d33] to-[#1c2e26] border-[#3e6855] text-white hover:border-[#548c71] hover:shadow-xl ring-2 ring-transparent hover:ring-amber-400/30'
                  : (idx % 2 === 0 ? 'flux-card-sage' : 'flux-card-terracotta');
                const tagStyle = idx % 2 === 0 ? 'bg-[#EBF1EA] text-[#3E6855] border-[#C5DDD0]' : 'bg-[#FDF4F0] text-[#B54F2C] border-[#F7D3C3]';
                
                return (
                  <div
                    key={guide.id}
                    onClick={() => {
                      if (guide.isCourse) {
                        setActiveCourse(guide as any);
                      } else {
                        setActiveGuide(guide as any);
                      }
                    }}
                    className={`cursor-pointer group flex flex-col h-full rounded-3xl p-4 sm:p-5 border transition-all shadow-xs ${cardStyle} ${!isCourse ? 'border-stone-200 hover:border-transparent hover:shadow-lg' : ''}`}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-stone-100 shadow-2xs">
                      <img src={guide.image || (guide as any).coverImage} alt={guide.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {isCourse ? (
                          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md border border-amber-400/50 flex items-center gap-1.5 uppercase tracking-wider">
                            <BookOpen className="w-3.5 h-3.5" />
                            Curso de 1 Semana
                          </span>
                        ) : (
                          <span className="bg-white/95 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm border border-emerald-200 flex items-center gap-1 uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            Lectura 5 Min
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border w-max ${isCourse ? 'bg-white/20 text-white border-white/30 backdrop-blur-md' : tagStyle}`}>
                          {guide.category}
                        </span>
                      </div>
                      {isCourse && (
                         <div className="absolute inset-0 border-2 border-amber-400/30 rounded-2xl pointer-events-none" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className={`text-base sm:text-lg font-bold leading-tight mb-2 transition-colors line-clamp-2 ${isCourse ? 'text-white group-hover:text-amber-400' : 'text-stone-900 group-hover:text-[#3E6855]'}`}>
                        {guide.title}
                      </h3>
                      <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 flex-1 ${isCourse ? 'text-stone-300' : 'text-stone-600'}`}>
                        {guide.isCourse ? (guide as any).description : (guide as any).simpleSummary}
                      </p>
                      <div className={`flex items-center justify-between pt-3 border-t mt-auto ${isCourse ? 'border-white/10' : 'border-stone-200/50'}`}>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${isCourse ? 'text-amber-400/80' : 'text-stone-500'}`}>
                          <Flame className="w-3.5 h-3.5" />
                          {isCourse ? 'Desafío Completo' : guide.readTime}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-2xs ${isCourse ? 'bg-white/10 border border-white/20 group-hover:bg-amber-500 group-hover:border-amber-400' : 'bg-white border border-stone-200 group-hover:bg-[#5F927B] group-hover:border-[#5F927B]'}`}>
                          <ArrowRight className={`w-4 h-4 ${isCourse ? 'text-white/70 group-hover:text-white' : 'text-stone-400 group-hover:text-white'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center pb-12">
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-bold transition-all px-8 py-3 min-h-[44px] cursor-pointer bg-white border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-full shadow-xs"
              >
                Saltar este paso y continuar
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Active Guide Reader */}
        {currentStep === 2 && activeGuide && (
          <div className="max-w-3xl mx-auto animate-fadeIn mt-6 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200">
            <button onClick={() => setActiveGuide(null)} className="text-xs font-bold text-stone-500 mb-6 flex items-center gap-1 hover:text-stone-800 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a las guías</span>
            </button>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 flex-wrap mb-3">
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
            </div>

            <div className="w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden mb-8 shadow-sm border border-stone-200 bg-stone-100">
              <img src={activeGuide.image} alt={activeGuide.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>

            <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#eaf4ef] border border-[#548c71]/30 text-emerald-950 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#548c71] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Resumen Ejecutivo Simple</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-stone-800">
                {activeGuide.simpleSummary}
              </p>
            </div>

            <div className="space-y-8 text-stone-800 text-base leading-relaxed mb-10">
              {activeGuide.explainedContent.map((section, idx) => (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs">
                  <h3 className="font-bold text-xl text-stone-900 mb-4">{section.heading}</h3>
                  <p className="whitespace-pre-line text-stone-700 leading-loose">{section.text}</p>
                  {section.bulletPoints && (
                    <ul className="mt-5 space-y-3">
                      {section.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-stone-700 leading-relaxed">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200 mt-12">
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto text-stone-600 hover:text-stone-900 text-sm font-bold transition-all px-8 py-3 min-h-[44px] cursor-pointer bg-white border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-full shadow-xs flex items-center justify-center gap-2"
              >
                Saltar este paso
              </button>
              <button
                onClick={handleFinishGuide}
                className="w-full sm:w-auto bg-brand-sage-600 hover:bg-brand-sage-700 text-white px-8 py-3 min-h-[44px] rounded-full text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalizar lectura y continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-500 mt-10">
            <div className="bg-gradient-to-r from-white via-[#FBF9F5] to-white rounded-3xl border-2 border-[#E87A52]/30 shadow-md p-8 sm:p-12 text-center">
              
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                <Sparkles className="w-12 h-12 text-white fill-white" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-serif text-stone-900 mb-4 leading-tight">
                ¡Flux completado!
              </h2>
              <p className="text-lg text-stone-600 mb-8 font-medium">Estás un paso más cerca de tu Glow.</p>

              <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-3xl border border-stone-200 shadow-sm mb-10">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-600 fill-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Racha Flux Global</p>
                  <p className="text-3xl font-black text-stone-900">{getFluxStreak()} <span className="text-sm font-bold text-stone-500">Puntos</span></p>
                </div>
              </div>

              {selectedMood && (
                <div className="text-left bg-[#eaf4ef] rounded-3xl p-6 sm:p-8 border border-[#548c71]/30 mb-10 shadow-xs">
                  <h3 className="text-sm font-bold text-[#253d33] flex items-center gap-2 mb-3 uppercase tracking-wider">
                    <Brain className="w-5 h-5" />
                    Mini Análisis Predictivo
                  </h3>
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                    Hoy iniciaste el flujo registrando tu estado como <strong className="capitalize">{selectedMood}</strong> con una intensidad {intensity}/10. 
                    {intensity > 7 ? ' Es un nivel de intensidad donde priorizar el descanso y el desahogo consciente es clave.' : ' Mantener tu racha Flux en niveles estables demuestra una sólida autorregulación. Continúa con este equilibrio explorando la comunidad o charlando libremente con Flux AI.'}
                  </p>
                </div>
              )}

              <div className="text-left">
                <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider">¿Qué quieres hacer ahora?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => onNavigate('ai' as any)} className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 text-left transition-all hover:shadow-md cursor-pointer group">
                    <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 group-hover:scale-105 transition-transform"><MessageSquare className="w-5 h-5 text-indigo-600" /></div>
                    <span className="text-sm font-bold text-stone-800">Hablar con Flux AI</span>
                  </button>
                  <button onClick={() => onNavigate('missions' as any)} className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 text-left transition-all hover:shadow-md cursor-pointer group">
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 group-hover:scale-105 transition-transform"><Target className="w-5 h-5 text-[#3E6855]" /></div>
                    <span className="text-sm font-bold text-stone-800">Ver mis misiones</span>
                  </button>
                  <button onClick={() => onNavigate('community' as any)} className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 text-left transition-all hover:shadow-md cursor-pointer group">
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 group-hover:scale-105 transition-transform"><Users className="w-5 h-5 text-amber-600" /></div>
                    <span className="text-sm font-bold text-stone-800">Ir a la comunidad</span>
                  </button>
                  <button onClick={() => onNavigate('dashboard' as any)} className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 text-left transition-all hover:shadow-md cursor-pointer group">
                    <div className="bg-stone-100 p-2.5 rounded-xl border border-stone-200 group-hover:scale-105 transition-transform"><Home className="w-5 h-5 text-stone-700" /></div>
                    <span className="text-sm font-bold text-stone-800">Volver al Dashboard</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
