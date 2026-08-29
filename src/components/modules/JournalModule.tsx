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
  Flame as FireIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { MoodType, JournalEntry } from '../../types';
import { MOCK_JOURNAL_ENTRIES } from '../../data/mockData';
import { useToast } from '../common/Toast';

interface JournalModuleProps {
  onEntryCreated?: (entry: JournalEntry) => void;
}

export const JournalModule: React.FC<JournalModuleProps> = ({ onEntryCreated }) => {
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

  // Available Emojis matching Image 3: 😡 🙁 😐 🙂 😄
  const emojiMoods: { id: MoodType; emoji: string; label: string; color: string; bg: string }[] = [
    { id: 'enojado', emoji: '😡', label: 'Enojo', color: '#b91c1c', bg: '#fee2e2' },
    { id: 'triste', emoji: '🙁', label: 'Tristeza', color: '#dc2626', bg: '#fef2f2' },
    { id: 'ansioso', emoji: '😐', label: 'Neutral / Preocupado', color: '#d97706', bg: '#fef3c7' },
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
      const simulatedText = " Hoy sentí que pude avanzar con mis pendientes y tuve una buena charla con mi equipo. Me sentí más aliviado y con energía positiva.";
      setNoteText((prev) => (prev ? prev + simulatedText : simulatedText.trim()));
      success('Nota de voz transcrita', 'Se ha añadido el texto a tu reflexión.');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) {
      warning('Nota requerida', 'Por favor escribe unas palabras sobre cómo te sientes antes de guardar.');
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
      habits: { sleepHours: 8, waterGlasses: 6, exercised: true, energyLevel: 8 },
      aiFeedback: 'Has identificado tus emociones con claridad. Continuar expresándote de forma escrita fomenta tu resiliencia emocional.'
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));

    if (onEntryCreated) {
      onEntryCreated(newEntry);
    }

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setNoteText('');
      success('¡Registro guardado!', 'Tu reflexión y estado emocional se han guardado exitosamente.');
    }, 400);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('fluxglow_journal_entries', JSON.stringify(updated));
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


  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#5a8c72]" />
            <span>{showHistory ? 'Ocultar Historial' : 'Ver Registros Previos (' + entries.length + ')'}</span>
          </button>
        </div>

        {/* Big Display Title: Registro Emocional */}
        <div className="text-center my-5">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Registro </span>
            <span className="text-[#de6943]">Emocional</span>
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Tu espacio diario de autoconocimiento y descompresión guiada</p>
        </div>

        {/* RECENT 7-DAYS STREAK ROW (Always Visible) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <FireIcon className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Racha de Registro: 7 días seguidos</h4>
              <p className="text-[11px] text-stone-500">Constancia emocional de la última semana</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar w-full sm:w-auto justify-between sm:justify-end">
            {recentDays.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-center p-1.5 sm:px-2.5 rounded-xl transition-all ${
                  item.isToday 
                    ? 'bg-[#e2eee6] border border-[#548c71]/40 ring-1 ring-[#548c71]/20' 
                    : 'bg-[#faf8f4] border border-stone-200/60'
                }`}
              >
                <span className="text-[10px] font-bold text-stone-500 uppercase">{item.day}</span>
                <span className="text-base sm:text-lg my-0.5">{item.mood}</span>
                <span className="text-[9px] font-semibold text-stone-600">{item.intensity}/10</span>
              </div>
            ))}
          </div>
        </div>

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
            className="bg-[#de6943] hover:bg-[#cb512e] text-white px-7 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-xs hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Enviar'}</span>
          </button>
        </div>

        {/* Big White Card Box with Textarea */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#548c71]" />
              Espacio privado y seguro de desahogo
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500 font-medium">
                Intensidad: <strong className="text-stone-800">{intensity}/10</strong>
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
            rows={7}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="¿Por qué te sientes así hoy? Expresa tus pensamientos sin juzgarte..."
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

        {/* History / Previous Entries Drawer or Section */}
        {showHistory && (
          <div className="mt-8 pt-6 border-t border-[#ece4d9] animate-fadeIn">
            <h2 className="text-xl font-bold text-stone-900 mb-4 font-serif">
              Tus Reflexiones y Registros Anteriores
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {entry.mood === 'feliz' ? '😄' : entry.mood === 'tranquilo' ? '🙂' : entry.mood === 'ansioso' ? '😐' : entry.mood === 'triste' ? '🙁' : '😡'}
                      </span>
                      <span className="text-xs font-bold text-stone-800 capitalize">
                        {entry.mood}
                      </span>
                      <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-600 font-semibold">
                        {entry.intensity}/10
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span>{entry.date}</span>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-stone-300 hover:text-red-500 transition-colors"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed line-clamp-3 mb-3">
                    "{entry.notes}"
                  </p>

                  <div className="flex flex-wrap gap-1">
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
