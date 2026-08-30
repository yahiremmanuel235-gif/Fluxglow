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
  Flame as FireIcon,
  Quote,
  ArrowRight,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { MoodType, JournalEntry, ViewMode } from '../../types';
import { MOCK_JOURNAL_ENTRIES } from '../../data/mockData';
import { useToast } from '../common/Toast';

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
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('fluxglow_journal_entries');
    return saved ? JSON.parse(saved) : MOCK_JOURNAL_ENTRIES;
  });

  const [selectedMood, setSelectedMood] = useState<MoodType>('feliz');
  const [intensity, setIntensity] = useState<number>(8);
  const [noteText, setNoteText] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Productividad']);
  const [showAllTriggers, setShowAllTriggers] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Post-submission state: hides writer/emotion panel and reveals customized inspiring quote
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEntry, setSubmittedEntry] = useState<JournalEntry | null>(null);

  // Available Emojis matching exact requirements: 😡 🙁 😐 🙂 😄
  const emojiMoods: { id: MoodType; emoji: string; label: string; color: string; bg: string }[] = [
    { id: 'enojado', emoji: '😡', label: 'Enojo', color: '#b91c1c', bg: '#fee2e2' },
    { id: 'triste', emoji: '🙁', label: 'Tristeza', color: '#dc2626', bg: '#fef2f2' },
    { id: 'ansioso', emoji: '😐', label: 'Inquieto / Ansioso', color: '#d97706', bg: '#fef3c7' },
    { id: 'tranquilo', emoji: '🙂', label: 'Tranquilo', color: '#65a30d', bg: '#ecfccb' },
    { id: 'feliz', emoji: '😄', label: 'Feliz', color: '#16a34a', bg: '#dcfce7' },
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) {
      warning('Escribe unas palabras', 'Por favor redacta cómo te sientes antes de guardar tu registro.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const newEntry: JournalEntry = {
      id: 'entry-' + Date.now(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      intensity: intensity,
      notes: noteText,
      triggers: selectedTriggers,
      habits: { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: intensity },
      aiFeedback: INSPIRATIONAL_QUOTES[selectedMood]?.reflection || 'Has identificado tus emociones con claridad.'
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: updated }));

    if (onEntryCreated) {
      onEntryCreated(newEntry);
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEntry(newEntry);
      setIsSubmitted(true);
      setNoteText('');
      success('¡Registro guardado en tu Diario!', 'Tu estado emocional ha quedado asentado.');
    }, 350);
  };

  const handleResetForNewEntry = () => {
    setIsSubmitted(false);
    setSubmittedEntry(null);
    setNoteText('');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fluxglow_journal_updated', { detail: updated }));
    success('Registro eliminado', 'La entrada ha sido retirada de tu historial.');
  };

  // Recent 7 days streak preview calculation
  const recentDays = [
    { day: 'Lun', mood: '🙂', intensity: 7 },
    { day: 'Mar', mood: '😄', intensity: 9 },
    { day: 'Mié', mood: '😐', intensity: 5 },
    { day: 'Jue', mood: '🙂', intensity: 8 },
    { day: 'Vie', mood: '😄', intensity: 8 },
    { day: 'Sáb', mood: '🙂', intensity: 7 },
    { 
      day: 'Hoy', 
      mood: selectedMood === 'feliz' ? '😄' : selectedMood === 'tranquilo' ? '🙂' : selectedMood === 'ansioso' ? '😐' : selectedMood === 'triste' ? '🙁' : '😡', 
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

        {/* Big Display Title: Registro Emocional */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Registro </span>
            <span className="text-[#de6943]">Emocional</span>
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            Tu espacio íntimo de autoconocimiento, desahogo consciente y acompañamiento reflexivo
          </p>
        </div>

        {/* RECENT 7-DAYS STREAK ROW (Always Visible) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <FireIcon className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">Racha de Registro Consciente: 7 días</h4>
              <p className="text-xs text-stone-500">Constancia y hábitos emocionales de la semana</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar w-full sm:w-auto justify-between sm:justify-end">
            {recentDays.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-center p-2 sm:px-3 rounded-2xl transition-all ${
                  item.isToday 
                    ? 'bg-[#e2eee6] border border-[#548c71]/40 ring-2 ring-[#548c71]/20' 
                    : 'bg-[#faf8f4] border border-stone-200/60'
                }`}
              >
                <span className="text-[10px] font-bold text-stone-500 uppercase">{item.day}</span>
                <span className="text-lg sm:text-xl my-0.5">{item.mood}</span>
                <span className="text-[10px] font-semibold text-stone-600">{item.intensity}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATE A: ACTIVE FORM (Visible before sending) */}
        {!isSubmitted ? (
          <>
            {/* Main Controls Row: [Diario personal] [¿Cómo te sientes hoy? 😡 🙁 😐 🙂 😄] [Enviar] */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              
              {/* Left Pill: Diario personal */}
              <div
                id="personal-journal-btn"
                className="bg-[#548c71] text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Diario personal</span>
              </div>

              {/* Center Capsule: ¿Cómo te sientes hoy? + 5 Emojis */}
              <div className="w-full md:w-auto flex-1 max-w-2xl bg-white border border-stone-200 rounded-full py-2 px-4 sm:px-6 shadow-xs flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-stone-800 whitespace-nowrap">
                  ¿Cómo te sientes hoy?
                </span>

                {/* 5 Emojis */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {emojiMoods.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        id={`mood-btn-${m.id}`}
                        onClick={() => setSelectedMood(m.id)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-125 ring-2 ring-[#548c71] shadow-md bg-stone-100'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        title={m.label}
                        aria-label={m.label}
                      >
                        <span>{m.emoji}</span>
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
                className="bg-[#de6943] hover:bg-[#cb512e] active:scale-95 text-white px-8 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-xs hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Guardando...' : 'Enviar registro'}</span>
              </button>
            </div>

            {/* Big White Card Box with Textarea and Tools */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#548c71]" />
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
                    className="w-24 accent-[#548c71] cursor-pointer"
                    aria-label="Selector de intensidad emocional del 1 al 10"
                  />
                </div>
              </div>

              <textarea
                id="journal-note-textarea"
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="¿Por qué te sientes así hoy? Expresa libremente tus pensamientos, inquietudes o gratitud sin juzgarte..."
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
                <span className="text-sm">{activeEmojiItem.emoji}</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {entry.mood === 'feliz' ? '😄' : entry.mood === 'tranquilo' ? '🙂' : entry.mood === 'ansioso' ? '😐' : entry.mood === 'triste' ? '🙁' : '😡'}
                        </span>
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
          </div>
        )}

      </div>
    </div>
  );
};
