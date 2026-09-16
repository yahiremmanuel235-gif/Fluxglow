import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, Zap, Lock, Tag, Clock, CheckCircle2, 
  ArrowRight, Brain, MessageSquare, Target, Users, BarChart, 
  Home, BookOpen, ChevronUp, ChevronDown, Sliders, ChevronLeft, 
  Square, Heart, BookmarkCheck, Play, ArrowLeft, Quote, Flame, Activity, Timer, Wind, ChevronRight, Plus, X
} from 'lucide-react';
import { useJournal } from '../../hooks/useJournal';
import { incrementFluxStreak, getFluxStreak, setLastFluxDate } from '../../utils/streakManager';
import { useToast } from '../common/Toast';
import confetti from 'canvas-confetti';
import { DEMO_GUIDES_CATALOG, AI_DEMO_NOTICE_TEXT } from '../../data/guidesData';
import { COMPLETE_COURSES_CATALOG, } from '../../data/completeGuidesData';
import { MoodIcon } from '../common/MoodIcon';
import { MoodType, ViewMode } from '../../types';
import { addSingleMissionFromGuide, addCustomMission } from '../../utils/missionsManager';
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
  const [showMissions, setShowMissions] = useState<boolean>(false);
  const [missionStatuses, setMissionStatuses] = useState<Record<string, { status: 'accepted' | 'rejected'; date?: string; time?: string; mission?: any }>>({});
  const [isCustomMissionOpen, setIsCustomMissionOpen] = useState(false);  const [customMissionData, setCustomMissionData] = useState({ title: '', description: '', date: '', time: '' });
  const [schedulingMission, setSchedulingMission] = useState<any | null>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCustomMissionOpen(false);
        setSchedulingMission(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  useEffect(() => {
    if (isCustomMissionOpen || schedulingMission) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCustomMissionOpen, schedulingMission]);

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
      setIsSubmitted(true);
      confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      warning('Aviso al guardar', err?.message || 'No se pudo guardar la entrada.');
    }
  };

  const goToStep3 = () => {
    if (canStartFluxToday()) {
      incrementFluxStreak();
    }
    setLastFluxDate();
    setCurrentStep(3);
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
      
      // Save accepted missions with their date and time
      if (typeof addSingleMissionFromGuide === 'function') {
        Object.keys(missionStatuses).forEach((mId) => {
          const statusObj = missionStatuses[mId];
          if (statusObj.status === 'accepted' && statusObj.mission) {
            const finalMission = { ...statusObj.mission, time: statusObj.time, date: statusObj.date, isActive: true, status: 'pending' };
            addSingleMissionFromGuide(finalMission, activeGuide);
          }
        });
      }
    }
    
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    setActiveGuide(null);
    goToStep3();
  };

  const handleCourseDayComplete = () => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    setActiveCourse(null);
    goToStep3();
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

        {isCustomMissionOpen && createPortal(
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setIsCustomMissionOpen(false)}>
            <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 border border-stone-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsCustomMissionOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1 pr-8">
                  Misión Personalizada
                </h3>
                <p className="text-stone-500 text-sm">
                  ¿Quieres aplicar los conocimientos de la guía a tu manera? Crea una misión personalizada.
                </p>
              </div>
              
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Nombre de la misión</label>
                  <input 
                    type="text" 
                    value={customMissionData.title}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ej. Escribir 5 minutos en mi diario..."
                    className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Descripción</label>
                  <textarea 
                    value={customMissionData.description}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Detalles sobre cómo lo aplicarás..."
                    className="w-full h-20 bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                    <input 
                      type="date" 
                      value={customMissionData.date}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                    <input 
                      type="time" 
                      value={customMissionData.time}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, time: e.target.value}))}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setIsCustomMissionOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!customMissionData.title || !customMissionData.date || !customMissionData.time) {
                      warning('Faltan campos', 'Por favor ingresa nombre, fecha y hora.');
                      return;
                    }
                    
                    const newMission = addCustomMission(
                      customMissionData.title, 
                      customMissionData.description, 
                      activeGuide?.id || 'custom', 
                      activeGuide?.title || 'Personalizado', 
                      activeGuide?.category || 'General'
                    );
                    
                    // Add schedule
                    try {
                      const sch = localStorage.getItem('fluxglow_mission_schedules');
                      let parsedSch = sch ? JSON.parse(sch) : {};
                      const [year, month, day] = customMissionData.date.split('-').map(Number);
                      const [hours, minutes] = customMissionData.time.split(':').map(Number);
                      const d = new Date();
                      d.setFullYear(year, month - 1, day);
                      d.setHours(hours, minutes, 0, 0);
                      
                      parsedSch[newMission.id] = d.toISOString();
                      localStorage.setItem('fluxglow_mission_schedules', JSON.stringify(parsedSch));
                    } catch(e) {}

                    success('¡Misión creada!', 'Se ha programado con éxito.');
                    setIsCustomMissionOpen(false);
                    setCustomMissionData({ title: '', description: '', date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Crear Misión
                </button>
              </div>
            </div>
          </div>, document.body)}

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
                        setShowMissions(false);
                        setMissionStatuses({});
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
                onClick={() => goToStep3()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-bold transition-all px-8 py-3 min-h-[44px] cursor-pointer bg-white border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 rounded-full shadow-xs"
              >
                Saltar este paso y continuar
              </button>
            </div>
          </div>
        )}

        {isCustomMissionOpen && createPortal(
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setIsCustomMissionOpen(false)}>
            <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 border border-stone-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsCustomMissionOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1 pr-8">
                  Misión Personalizada
                </h3>
                <p className="text-stone-500 text-sm">
                  ¿Quieres aplicar los conocimientos de la guía a tu manera? Crea una misión personalizada.
                </p>
              </div>
              
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Nombre de la misión</label>
                  <input 
                    type="text" 
                    value={customMissionData.title}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ej. Escribir 5 minutos en mi diario..."
                    className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Descripción</label>
                  <textarea 
                    value={customMissionData.description}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Detalles sobre cómo lo aplicarás..."
                    className="w-full h-20 bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                    <input 
                      type="date" 
                      value={customMissionData.date}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                    <input 
                      type="time" 
                      value={customMissionData.time}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, time: e.target.value}))}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setIsCustomMissionOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!customMissionData.title || !customMissionData.date || !customMissionData.time) {
                      warning('Faltan campos', 'Por favor ingresa nombre, fecha y hora.');
                      return;
                    }
                    
                    const newMission = addCustomMission(
                      customMissionData.title, 
                      customMissionData.description, 
                      activeGuide?.id || 'custom', 
                      activeGuide?.title || 'Personalizado', 
                      activeGuide?.category || 'General'
                    );
                    
                    // Add schedule
                    try {
                      const sch = localStorage.getItem('fluxglow_mission_schedules');
                      let parsedSch = sch ? JSON.parse(sch) : {};
                      const [year, month, day] = customMissionData.date.split('-').map(Number);
                      const [hours, minutes] = customMissionData.time.split(':').map(Number);
                      const d = new Date();
                      d.setFullYear(year, month - 1, day);
                      d.setHours(hours, minutes, 0, 0);
                      
                      parsedSch[newMission.id] = d.toISOString();
                      localStorage.setItem('fluxglow_mission_schedules', JSON.stringify(parsedSch));
                    } catch(e) {}

                    success('¡Misión creada!', 'Se ha programado con éxito.');
                    setIsCustomMissionOpen(false);
                    setCustomMissionData({ title: '', description: '', date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Crear Misión
                </button>
              </div>
            </div>
          </div>, document.body)}

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
              {activeGuide.explainedContent.map((section: any, idx: number) => (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs">
                  <h3 className="font-bold text-xl text-stone-900 mb-4">{section.heading}</h3>
                  <p className="whitespace-pre-line text-stone-700 leading-loose">{section.text}</p>
                  {section.bulletPoints && (
                    <ul className="mt-5 space-y-3">
                      {section.bulletPoints.map((bp: string, i: number) => (
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

            {/* PROMINENT BUTTON: HE TERMINADO DE LEER LA GUÍA */}
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f2ece1] to-[#e8f1ec] border border-[#548c71]/40 text-center shadow-sm">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  ¿Has asimilado los conceptos de esta guía?
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
                  Haz clic a continuación para registrar la lectura completa y activar tus <strong>misiones prácticas</strong> en tu plan diario.
                </p>

                <button
                  id="finish-reading-guide-btn"
                  onClick={() => setShowMissions(true)}
                  className="bg-[#548c71] hover:bg-[#43705a] active:scale-98 text-white px-8 sm:px-10 py-4 rounded-full font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>He terminado de leer la guía</span>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </button>
              </div>

            {/* Missions Toggle Button / Expanded Missions */}
            {activeGuide.dailyMissions && activeGuide.dailyMissions.length > 0 && showMissions && (
              <div className="mb-8">
                <div className="my-8 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/50 border-2 border-amber-300 shadow-md relative overflow-hidden">
                    

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div className="pr-12">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                            ¡Misiones Desbloqueadas y Listas para tu Día!
                          </span>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                            Retos Prácticos Propuestos
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm mb-6 leading-relaxed">
                      💡 <strong>Propósito de las misiones:</strong> Estas acciones están diseñadas para trasladar la teoría a la práctica en tu día a día. Acepta las que desees y prográmales una hora para activarlas en tu panel de misiones.
                    </p>

                    <div className="flex flex-col gap-4 mb-6">
                      {activeGuide.dailyMissions.map((mission: any, idx: number) => {
                        const statusObj = missionStatuses[mission.id];
                        const status = statusObj?.status;
                        return (
                        <div key={mission.id || idx} className={`bg-white/95 rounded-2xl border shadow-sm flex flex-col md:flex-row overflow-hidden transition-all ${status === 'accepted' ? 'border-emerald-400 ring-1 ring-emerald-400' : status === 'rejected' ? 'border-red-200 opacity-60' : 'border-amber-200'}`}>
                {/* Left accent & Icon */}
                <div className={`w-1.5 hidden md:block shrink-0 ${status === 'accepted' ? 'bg-emerald-400' : status === 'rejected' ? 'bg-red-300' : 'bg-amber-400'}`}></div>
                <div className="hidden md:flex flex-col justify-center pl-4 py-4 shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${status === 'accepted' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : status === 'rejected' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                    {status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> : status === 'rejected' ? <X className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                </div>
                
                {/* Main content body */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-amber-900 mb-2">
                    <span className={`px-2 py-0.5 rounded-md ${status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      Reto {idx + 1}
                    </span>
                    {status === 'accepted' && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aceptada {statusObj?.time ? `(${statusObj.time})` : ''}
                      </span>
                    )}
                    {status === 'rejected' && (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <X className="w-3 h-3" /> Rechazada
                      </span>
                    )}
                  </div>
                  
                  <h5 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5 leading-snug">
                    {mission.title}
                  </h5>
                  
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                    {mission.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-md flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {mission.timeEstimate}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1.5 border border-amber-100">
                      <Sparkles className="w-3 h-3" /> +{mission.xp || 30} XP
                    </span>
                  </div>
                </div>
                
                {/* Right side actions */}
                {!status && (
                  <div className="border-t md:border-t-0 md:border-l border-stone-100 p-4 sm:p-5 flex md:flex-col items-center justify-center gap-2 bg-stone-50/50 shrink-0 md:w-40">
                    <button
                       onClick={() => setSchedulingMission(mission)}
                      className="flex-1 md:flex-none w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      Aceptar
                    </button>
                    <button
                       onClick={() => setMissionStatuses({...missionStatuses, [mission.id]: { status: 'rejected' }})}
                      className="flex-1 md:flex-none w-full py-2.5 px-4 rounded-xl bg-white border border-stone-200 hover:bg-red-50 hover:border-red-200 text-stone-600 hover:text-red-600 text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            )})}
            </div>
                    
                    <button
                      onClick={() => setIsCustomMissionOpen(true)}
                      className="w-full mt-2 bg-white hover:bg-amber-50 border-2 border-dashed border-amber-200 hover:border-amber-400 text-amber-700 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                    >
                      <span>👉 Crear una misión personalizada</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showMissions && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200 mt-12">
                <button
                  onClick={() => goToStep3()}
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
            )}
          </div>
        )}

        {isCustomMissionOpen && createPortal(
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setIsCustomMissionOpen(false)}>
            <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 border border-stone-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsCustomMissionOpen(false)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1 pr-8">
                  Misión Personalizada
                </h3>
                <p className="text-stone-500 text-sm">
                  ¿Quieres aplicar los conocimientos de la guía a tu manera? Crea una misión personalizada.
                </p>
              </div>
              
              <div className="space-y-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Nombre de la misión</label>
                  <input 
                    type="text" 
                    value={customMissionData.title}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ej. Escribir 5 minutos en mi diario..."
                    className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Descripción</label>
                  <textarea 
                    value={customMissionData.description}
                    onChange={(e) => setCustomMissionData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Detalles sobre cómo lo aplicarás..."
                    className="w-full h-20 bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                    <input 
                      type="date" 
                      value={customMissionData.date}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, date: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                    <input 
                      type="time" 
                      value={customMissionData.time}
                      onChange={(e) => setCustomMissionData(prev => ({...prev, time: e.target.value}))}
                      className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setIsCustomMissionOpen(false)}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!customMissionData.title || !customMissionData.date || !customMissionData.time) {
                      warning('Faltan campos', 'Por favor ingresa nombre, fecha y hora.');
                      return;
                    }
                    
                    const newMission = addCustomMission(
                      customMissionData.title, 
                      customMissionData.description, 
                      activeGuide?.id || 'custom', 
                      activeGuide?.title || 'Personalizado', 
                      activeGuide?.category || 'General'
                    );
                    
                    // Add schedule
                    try {
                      const sch = localStorage.getItem('fluxglow_mission_schedules');
                      let parsedSch = sch ? JSON.parse(sch) : {};
                      const [year, month, day] = customMissionData.date.split('-').map(Number);
                      const [hours, minutes] = customMissionData.time.split(':').map(Number);
                      const d = new Date();
                      d.setFullYear(year, month - 1, day);
                      d.setHours(hours, minutes, 0, 0);
                      
                      parsedSch[newMission.id] = d.toISOString();
                      localStorage.setItem('fluxglow_mission_schedules', JSON.stringify(parsedSch));
                    } catch(e) {}

                    success('¡Misión creada!', 'Se ha programado con éxito.');
                    setIsCustomMissionOpen(false);
                    setCustomMissionData({ title: '', description: '', date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Crear Misión
                </button>
              </div>
            </div>
          </div>, document.body)}

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

      {/* Scheduling Mission Modal */}
      {schedulingMission && createPortal(
<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={() => setSchedulingMission(null)}>
          <div className="m-auto relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[101] max-h-[85vh] overflow-y-auto p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSchedulingMission(null)} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 pr-8">Programar Misión</h3>
            <p className="text-xs text-stone-500 mb-4">{schedulingMission.title}</p>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-700 mb-2">¿Qué día realizarás esta misión?</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                defaultValue={new Date().toISOString().split('T')[0]}
                id="flux-mission-date-input"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-stone-700 mb-2">¿A qué hora realizarás esta misión?</label>
              <input 
                type="time" 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                defaultValue="12:00"
                id="flux-mission-time-input"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSchedulingMission(null)}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const dateInput = document.getElementById('flux-mission-date-input') as HTMLInputElement;
                  const timeInput = document.getElementById('flux-mission-time-input') as HTMLInputElement;
                  const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
                  const time = timeInput ? timeInput.value : '12:00';
                  
                  setMissionStatuses({
                    ...missionStatuses, 
                    [schedulingMission.id]: { 
                      status: 'accepted', 
                      date,
                      time,
                      mission: schedulingMission 
                    }
                  });
                  setSchedulingMission(null);
                  success('Misión Aceptada', `La misión se guardará para el ${date} a las ${time}`);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer shadow-md"
              >
                Confirmar y Programar
              </button>
            </div>
          </div>
        </div>, document.body)}


    </div>
  );
};
