import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  Square, 
  Send, 
  Smile, 
  Calendar, 
  BookOpen, 
  Sliders, 
  CheckCircle2, 
  Tag, 
  Clock, 
  Volume2,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Quote,
  ArrowRight,
  Heart,
  Loader2,
  RefreshCw,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { RachaIcon } from '../common/RachaIcon';
import { MoodIcon } from '../common/MoodIcon';
import { MoodType, JournalEntry, ViewMode } from '../../types';
import { useToast } from '../common/Toast';
import { useJournal } from '../../hooks/useJournal';

interface JournalModuleProps {
  onEntryCreated?: (entry: JournalEntry) => void;
  onNavigate?: (view: ViewMode) => void;
}

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

export const JournalModule: React.FC<JournalModuleProps> = ({ onEntryCreated, onNavigate }) => {
  const { success, warning } = useToast();
  
  // Custom hook conectado a Supabase y con fallback local para modo invitado
  const {
    entries,
    loading: isJournalLoading,
    isSubmitting,
    error: journalError,
    createEntry,
    deleteEntry,
    refreshEntries,
    isGuest,
    user
  } = useJournal();

  const [selectedMood, setSelectedMood] = useState<MoodType>('feliz');
  const [intensity, setIntensity] = useState<number>(8);
  const [noteText, setNoteText] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Productividad']);
  const [showAllTriggers, setShowAllTriggers] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // Post-submission state: hides writer/emotion panel and reveals customized inspiring quote
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEntry, setSubmittedEntry] = useState<JournalEntry | null>(null);

  // Available Emotions matching uploaded custom assets: Enojado, Triste, Inquieto, Tranquilo, Feliz
  const emojiMoods: { id: MoodType; image: string; label: string; color: string; bg: string }[] = [
    { id: 'enojado', image: '/Registro%20Emocional/Enojado.png', label: 'Enojado', color: '#b91c1c', bg: '#fee2e2' },
    { id: 'triste', image: '/Registro%20Emocional/Triste.png', label: 'Triste', color: '#dc2626', bg: '#fef2f2' },
    { id: 'ansioso', image: '/Registro%20Emocional/Inquieto.png', label: 'Inquieto', color: '#d97706', bg: '#fef3c7' },
    { id: 'tranquilo', image: '/Registro%20Emocional/Tranquilo.png', label: 'Tranquilo', color: '#65a30d', bg: '#ecfccb' },
    { id: 'feliz', image: '/Registro%20Emocional/Feliz.png', label: 'Feliz', color: '#16a34a', bg: '#dcfce7' },
  ];

  const availableTriggers = [
    'Trabajo', 'Estudios', 'Familia', 'Amigos', 'Pareja', 
    'Salud', 'Sueño', 'Dinero', 'Clima', 'Productividad', 'Descanso', 'Mindfulness'
  ];

  // Voice recording simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleStartVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Simulate transcription
      const simulatedText = " Hoy me tomé un momento para reflexionar con calma. Pude avanzar con mis pendientes y me sentí más despejado y en armonía con mi entorno.";
      setNoteText((prev) => (prev ? prev + simulatedText : simulatedText.trim()));
      success('Nota de voz transcrita', 'Se ha añadido el texto a tu reflexión.');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) {
      warning('Escribe unas palabras', 'Por favor redacta cómo te sientes antes de guardar tu registro.');
      return;
    }

    try {
      const created = await createEntry({
        mood: selectedMood,
        notes: noteText.trim(),
        intensity: intensity,
        triggers: selectedTriggers,
        habits: { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: intensity },
        aiFeedback: INSPIRATIONAL_QUOTES[selectedMood]?.reflection || 'Has identificado tus emociones con claridad.'
      });

      if (created) {
        if (onEntryCreated) {
          onEntryCreated(created);
        }

        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });

        setSubmittedEntry(created);
        setIsSubmitted(true);
        setNoteText('');

        if (user) {
          success('¡Registro sincronizado en Supabase!', 'Tu estado emocional ha sido guardado en tu cuenta privada.');
        } else {
          success('¡Registro guardado!', 'Tu estado emocional se guardó en tu navegador (modo exploración).');
        }
      }
    } catch (err: any) {
      console.error('Error al guardar registro:', err);
      warning('Aviso al guardar', err?.message || 'No se pudo guardar la entrada. Intenta nuevamente.');
    }
  };

  const handleResetForNewEntry = () => {
    setIsSubmitted(false);
    setSubmittedEntry(null);
    setNoteText('');
  };

  const handleDeleteEntry = async (id: string) => {
    const ok = await deleteEntry(id);
    if (ok) {
      success('Registro eliminado', 'La entrada ha sido retirada de tu historial.');
    } else {
      warning('Aviso', 'No se pudo eliminar el registro.');
    }
  };

  // Recent 7 days streak preview calculation
  const recentDays = [
    { day: 'Lun', mood: 'tranquilo', intensity: 7 },
    { day: 'Mar', mood: 'feliz', intensity: 9 },
    { day: 'Mié', mood: 'ansioso', intensity: 5 },
    { day: 'Jue', mood: 'tranquilo', intensity: 8 },
    { day: 'Vie', mood: 'feliz', intensity: 8 },
    { day: 'Sáb', mood: 'tranquilo', intensity: 7 },
    { 
      day: 'Hoy', 
      mood: selectedMood, 
      intensity, 
      isToday: true 
    },
  ];

  const activeQuoteData = INSPIRATIONAL_QUOTES[selectedMood] || INSPIRATIONAL_QUOTES['feliz'];
  const activeEmojiItem = emojiMoods.find(m => m.id === selectedMood) || emojiMoods[4];

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Top Header Row with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
            <span className="text-[11px] font-bold text-[#548c71] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-2 hidden sm:inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#548c71]" />
              <span>Diario de Bienestar</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isJournalLoading ? (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin text-[#548c71]" />
                <span>Cargando diario...</span>
              </div>
            ) : user ? (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Conectado</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full" title="Tus registros se guardan en este dispositivo. Inicia sesión para guardarlos en tu nube privada de Supabase.">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Modo Exploración (Local)</span>
              </div>
            )}

            {onNavigate && (
              <button
                onClick={() => onNavigate('missions')}
                className="text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Misiones Diarias</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
              </button>
            )}

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-stone-50"
            >
              <Clock className="w-3.5 h-3.5 text-[#548c71]" />
              <span>{showHistory ? 'Ocultar Historial' : `Historial (${entries.length})`}</span>
            </button>
          </div>
        </div>

        {/* Sync notification if errors occur */}
        {journalError && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-amber-700" />
              <span>Aviso de sincronización: {journalError}</span>
            </span>
            <button
              onClick={() => refreshEntries()}
              className="text-amber-950 font-bold underline flex items-center gap-1 cursor-pointer hover:text-amber-700"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {/* Big Display Title: Registro Emocional */}
        <div className="text-center my-6 px-2 overflow-visible">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal leading-normal overflow-visible">
            <span className="title-gradient">
              Registro Emocional
            </span>
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            Tu espacio íntimo de autoconocimiento, desahogo consciente y acompañamiento reflexivo
          </p>
        </div>

        {/* RECENT 7-DAYS STREAK ROW (Always Visible) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-2 shadow-2xs">
              <RachaIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span>Racha de Registro Consciente: 7 días</span>
                <RachaIcon className="w-4 h-4" />
              </h4>
              <p className="text-xs text-stone-500">Constancia y hábitos emocionales de la semana</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar w-full sm:w-auto justify-between sm:justify-end">
            {recentDays.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-center p-2 sm:px-3 rounded-2xl transition-all ${
                  item.isToday 
                    ? 'bg-[#EBF1EA] border border-[#5B8F76]/40 ring-2 ring-[#5B8F76]/20' 
                    : 'bg-[#faf8f4] border border-stone-200/60'
                }`}
              >
                <span className="text-[10px] font-bold text-stone-500 uppercase">{item.day}</span>
                <div className="my-1 flex items-center justify-center w-7 h-7">
                  <MoodIcon mood={item.mood} className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-[10px] font-semibold text-stone-600">{item.intensity}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATE A: ACTIVE FORM (Visible before sending) */}
        {!isSubmitted ? (
          <>
            {/* Main Controls Row: [Diario personal] [¿Cómo te sientes hoy? Enojado, Triste, Inquieto, Tranquilo, Feliz] [Enviar] */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              
              {/* Left Pill: Diario personal */}
              <div
                id="personal-journal-btn"
                className="bg-[#5B8F76] text-white px-7 py-2.5 rounded-full text-sm sm:text-base font-semibold tracking-wide shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Diario personal</span>
              </div>

              {/* Center Capsule: ¿Cómo te sientes hoy? + 5 Emotions */}
              <div className="w-full md:w-auto flex-1 max-w-2xl bg-white border border-stone-300 rounded-full py-2 px-5 sm:px-6 shadow-xs flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-stone-800 whitespace-nowrap">
                  ¿Cómo te sientes hoy?
                </span>

                {/* 5 Emotions as Images */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {emojiMoods.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        id={`mood-btn-${m.id}`}
                        onClick={() => setSelectedMood(m.id)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center p-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-115 ring-2 ring-[#5B8F76] shadow-md bg-stone-100'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        title={m.label}
                        aria-label={m.label}
                      >
                        <img 
                          src={m.image} 
                          alt={m.label} 
                          className="w-full h-full object-contain pointer-events-none select-none" 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Pill: Enviar */}
              <button
                id="submit-journal-btn"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`bg-[#DE7347] hover:bg-[#C9643B] active:scale-95 text-white px-8 py-2.5 rounded-full text-sm sm:text-base font-semibold tracking-wide shadow-xs hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </div>

            {/* Big White Card Box with Textarea and Tools */}
            <div className="bg-white rounded-[26px] border-2 border-stone-800 shadow-xs p-6 sm:p-8 mb-10 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#5B8F76]" />
                  Espacio privado y seguro de desahogo
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 font-medium">
                    Intensidad emocional: <strong className="text-stone-800">{intensity}/10</strong>
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-24 accent-[#5B8F76] cursor-pointer"
                    aria-label="Selector de intensidad emocional del 1 al 10"
                  />
                </div>
              </div>

              <textarea
                id="journal-note-textarea"
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="¿Por qué te sientes así el día de hoy?..."
                className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-base sm:text-lg focus:outline-none resize-none leading-relaxed"
              />

              {/* Helper Tools inside the card */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                
                {/* Triggers Tags */}
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
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#548c71] hover:bg-[#e2eee6] border border-[#548c71]/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{showAllTriggers ? 'Menos' : `+${availableTriggers.length - 6} más`}</span>
                    {showAllTriggers ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Voice Recording Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="voice-journal-record-btn"
                    onClick={handleStartVoiceRecord}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#de6943]" />}
                    <span>{isRecording ? `Grabando (${recordingSeconds}s)...` : 'Nota de voz'}</span>
                  </button>
                </div>

              </div>
            </div>
          </>
        ) : (
          /* STATE B: POST-SUBMISSION INSPIRATIONAL QUOTE CARD (Disappears input box and emotion panel as requested) */
          <div className="my-8 animate-in zoom-in-95 duration-300">
            <div className={`bg-gradient-to-br ${activeQuoteData.bgColor} rounded-3xl border-2 border-amber-200/90 shadow-md p-6 sm:p-10 text-center relative overflow-hidden`}>
              
              {/* Background watermark quote icon */}
              <div className="absolute -top-6 -right-6 text-stone-900/5 pointer-events-none">
                <Quote className="w-48 h-48" />
              </div>

              {/* Status Badge & Chosen Emotion */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-stone-200 px-4 py-1.5 rounded-full shadow-2xs mb-6">
                <CheckCircle2 className="w-4 h-4 text-[#548c71]" />
                <span className="text-xs font-bold text-stone-800">
                  Registro guardado en tu Diario Personal
                </span>
                <MoodIcon mood={selectedMood} className="w-5 h-5" />
                <span className="text-xs font-semibold text-stone-500 capitalize">
                  ({activeEmojiItem.label})
                </span>
              </div>

              {/* Quote Block */}
              <div className="max-w-2xl mx-auto my-3">
                <Quote className="w-8 h-8 text-amber-600/80 mx-auto mb-3" />
                <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 leading-relaxed">
                  "{activeQuoteData.quote}"
                </blockquote>
                <p className="text-xs sm:text-sm font-semibold text-amber-900/80 mt-3 uppercase tracking-wider">
                  — {activeQuoteData.author}
                </p>
              </div>

              {/* Reflection Callout */}
              <div className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-stone-200/80 max-w-xl mx-auto my-6 text-left shadow-2xs">
                <p className="text-xs font-bold text-[#548c71] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mensaje de Acompañamiento:</span>
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {activeQuoteData.reflection}
                </p>
              </div>

              {/* Action Buttons: Write another reflection or view history */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <button
                  onClick={handleResetForNewEntry}
                  className="bg-[#548c71] hover:bg-[#43705a] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Escribir otra reflexión</span>
                </button>

                <button
                  onClick={() => setShowHistory(true)}
                  className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#548c71]" />
                  <span>Ver mi Diario Personal</span>
                </button>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('missions')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Ir a Misiones Diarias</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* History / Previous Entries Drawer or Section */}
        {showHistory && (
          <div className="mt-8 pt-6 border-t border-[#ece4d9] animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#548c71]" />
                <span>Tus Reflexiones y Registros Anteriores ({entries.length})</span>
              </h2>

              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Cerrar historial
              </button>
            </div>

            {isJournalLoading ? (
              <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#548c71] animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-stone-800">Sincronizando tus reflexiones con Supabase...</h3>
                <p className="text-xs text-stone-500">Recuperando tu historial emocional privado y seguro</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-sand-100 text-stone-400 mx-auto flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">Aún no tienes reflexiones guardadas</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {user
                    ? 'No encontramos registros anteriores en tu cuenta de Supabase. ¡Escribe tu primer registro arriba!'
                    : 'Utiliza el formulario de arriba para registrar tu primera emoción o reflexión del día.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2.5">
                        <div className="flex items-center gap-2">
                          <MoodIcon mood={entry.mood} className="w-6 h-6" />
                          <span className="text-xs font-bold text-stone-800 capitalize">
                            {entry.mood}
                          </span>
                          <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-600 font-bold">
                            {entry.intensity}/10
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span>{entry.date}</span>
                          <button 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3 mb-3">
                        "{entry.notes}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100">
                      {entry.triggers.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-[#e8f1ec] text-[#2d5a3f] px-2 py-0.5 rounded-md font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
