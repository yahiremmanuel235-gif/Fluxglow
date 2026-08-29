import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  History, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  Trash2, 
  RefreshCw,
  Wind,
  CheckCircle2,
  Copy,
  Check,
  X,
  PlusCircle,
  Brain,
  Zap,
  Moon,
  MessageSquareHeart,
  Lightbulb,
  HeartHandshake,
  Download,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, UserProfileData, InstantPracticeItem } from '../../types';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { soundEngine } from '../../utils/audioSynth';
import { useToast } from '../common/Toast';
import { INSTANT_PRACTICES_CATALOG } from '../../data/instantPracticesData';
import { InstantPracticeModal } from './InstantPracticeModal';

interface FluxAiModuleProps {
  userProfile?: UserProfileData;
}

type AiMode = 'calm' | 'action' | 'somatic' | 'reframe' | 'sleep';

interface ArchivedSession {
  id: string;
  date: string;
  preview: string;
  messagesCount: number;
  messages: ChatMessage[];
}

export const FluxAiModule: React.FC<FluxAiModuleProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_chat_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [archivedSessions, setArchivedSessions] = useState<ArchivedSession[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_chat_history_archive');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<AiMode>('calm');
  const [selectedMoodContext, setSelectedMoodContext] = useState<string>('');
  const [activePractice, setActivePractice] = useState<InstantPracticeItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const AI_MODES = [
    { id: 'calm' as AiMode, label: '🌿 Acompañamiento', desc: 'Validación empática y comprensión sin juicios' },
    { id: 'action' as AiMode, label: '⚡ Plan de Acción', desc: 'Micropasos de 2 a 15 min para vencer la inercia' },
    { id: 'somatic' as AiMode, label: '🫁 Regulación Somática', desc: 'Respiración neuroquímica y anclaje corporal' },
    { id: 'reframe' as AiMode, label: '🧠 Reencuadre Cognitivo', desc: 'Desactivar pensamientos catastróficos o culpa' },
    { id: 'sleep' as AiMode, label: '🌙 Apagado Mental', desc: 'Desaceleración para insomnio o sobrepensamiento nocturno' },
  ];

  const QUICK_MOODS = [
    '🤯 Con sobrepensamiento',
    '🥱 Con flojera / Procrastinando',
    '😰 Con ansiedad',
    '😔 Con desánimo / Tristeza',
    '⚡ Bloqueado con mis tareas',
    '💭 Necesito desahogarme'
  ];

  // Suggestions
  const suggestions = [
    'Tengo flojera de empezar mi tarea hoy, ¿cómo me motivo a actuar ya?',
    'Dame un plan de acción rápido de 15 minutos para avanzar en mi meta.',
    'Ayúdame a organizar mis pendientes de hoy para no estresarme.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    try {
      localStorage.setItem('fluxglow_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat messages:', e);
    }
  }, [messages, isLoading]);

  const handleStartNewConversation = () => {
    // 1. If current session has messages, archive it safely
    if (messages.length > 0) {
      try {
        const newSession: ArchivedSession = {
          id: 'session-' + Date.now(),
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          preview: messages.find(m => m.sender === 'user')?.text?.slice(0, 75) || messages[0]?.text?.slice(0, 75) || 'Conversación',
          messagesCount: messages.length,
          messages: [...messages]
        };
        const updated = [newSession, ...archivedSessions.filter(s => s.id !== newSession.id)].slice(0, 20);
        setArchivedSessions(updated);
        localStorage.setItem('fluxglow_chat_history_archive', JSON.stringify(updated));
      } catch (e) {
        console.error('Error archiving session:', e);
      }
    }

    // 2. Clear state cleanly
    setMessages([]);
    setInputText('');
    setSelectedMoodContext('');
    setIsLoading(false);
    setSpeakingMsgId(null);
    try {
      window.speechSynthesis?.cancel();
    } catch {}

    try {
      localStorage.removeItem('fluxglow_chat_messages');
    } catch (e) {
      console.error(e);
    }

    showToast('Nueva conversación iniciada.', 'info');
  };

  const handleRestoreSession = (session: ArchivedSession) => {
    // Archive current if has messages
    if (messages.length > 0) {
      try {
        const currentSession: ArchivedSession = {
          id: 'session-' + Date.now(),
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          preview: messages.find(m => m.sender === 'user')?.text?.slice(0, 75) || messages[0]?.text?.slice(0, 75) || 'Conversación',
          messagesCount: messages.length,
          messages: [...messages]
        };
        const updated = [currentSession, ...archivedSessions.filter(s => s.id !== session.id && s.id !== currentSession.id)].slice(0, 20);
        setArchivedSessions(updated);
        localStorage.setItem('fluxglow_chat_history_archive', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }

    setMessages(session.messages || []);
    setShowHistoryModal(false);
    showToast('Conversación anterior cargada.', 'success');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const modeObj = AI_MODES.find(m => m.id === selectedMode);
    const enrichedContext = `Modo: ${modeObj?.label || 'Acompañamiento'}. Estado reportado: ${selectedMoodContext || 'No especificado'}. Usuario: ${userProfile?.name || 'Amigo de FluxGlow'}.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userMood: selectedMoodContext,
          context: enrichedContext,
          userContext: userProfile ? { name: userProfile.name, ageGroup: userProfile.ageGroup } : undefined,
          history: messages.slice(-8).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.response || data.reply || getFallbackResponse(text, selectedMode);
      } else {
        replyText = getFallbackResponse(text, selectedMode);
      }

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      if (isVoiceActive) {
        soundEngine.speak(replyText.slice(0, 200));
      }
    } catch (err) {
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: getFallbackResponse(text, selectedMode),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Texto copiado al portapapeles', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      soundEngine.speak(text.slice(0, 250));
      setTimeout(() => setSpeakingMsgId(null), 10000);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const content = `FluxGlow - Registro de Sesión con Flux AI\nFecha: ${new Date().toLocaleString()}\n\n` +
      messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'Tú' : 'Flux AI'}:\n${m.text}\n`).join('\n---\n\n') +
      `\n\n*Nota: Las respuestas de la IA son informativas y de apoyo práctico.*`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fluxai-conversacion-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Conversación descargada en archivo de texto.', 'success');
  };

  const getFallbackResponse = (query: string, mode: AiMode): string => {
    const q = query.toLowerCase();
    if (q.includes('tarea') || q.includes('flojera') || q.includes('motivo') || mode === 'action') {
      return `Comprendo esa pesadez o resistencia mental. En psicología sabemos que la llamada "flojera" es casi siempre una sobrecarga cognitiva o una tarea que se percibe como una montaña gigante.

⚡ **Técnica del Micropaso de 2 Minutos**:
1. **Reduce la fricción**: Tu única meta en este instante NO es terminar la tarea, sino solo abrir el archivo o colocar el cuaderno frente a ti.
2. **Quita distracciones**: Pon el móvil fuera de tu alcance por 10 minutos.
3. **Elige un bloque mínimo**: Ponte un temporizador de solo 5 minutos. Una vez que rompes la inercia, continuar se vuelve 80% más fácil.

¿Cuál es la materia o tema exacto en el que te gustaría avanzar? Cuéntame y lo dividimos en 3 pasos muy pequeños.`;
    }
    if (q.includes('15 minutos') || q.includes('plan')) {
      return `¡Excelente iniciativa! Trabajar en bloques delimitados le da a tu cerebro una sensación de alivio y control.

⏱️ **Protocolo de Enfoque Relámpago de 15 Minutos**:
- **Minutos 0 a 2 (Claridad)**: Elige solo UN entregable concreto (ej. leer una página o estructurar 3 ideas).
- **Minutos 3 a 12 (Foco)**: Inmersión total sin cambiar de pestaña ni revisar notificaciones.
- **Minutos 13 a 15 (Cierre)**: Marca tu avance y haz una respiración profunda para registrar el logro.

¿Cuál es ese primer objetivo concreto al que le dedicamos estos 15 minutos?`;
    }
    if (q.includes('organizar') || q.includes('pendientes') || q.includes('estres')) {
      return `Cuando tenemos demasiadas tareas dando vueltas en la cabeza, la memoria de trabajo se satura y se activa la alarma del estrés.

📋 **Estrategia de Descarga 1-3-5**:
1. **1 Tarea Clave**: La prioridad no negociable de hoy.
2. **3 Tareas Medias**: Acciones manejables en 20 minutos.
3. **5 Micro-acciones**: Cosas rápidas (un correo, un mensaje, ordenar la mesa).

Todo lo demás queda programado sin culpa para mañana. ¿Quieres que organicemos tus pendientes con esta fórmula?`;
    }
    return `Gracias por compartir esto conmigo. Estoy aquí para acompañarte sin juzgarte y darte herramientas prácticas para sentirte en control.

✨ **Recordatorio**: No necesitas resolver todo hoy de golpe; un paso pequeño y consciente a la vez es suficiente para recuperar la serenidad.

¿Te gustaría que hagamos un ejercicio de respiración guiada, o prefieres contarme más sobre lo que tienes en mente?`;
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Top Header with Brand Logo, New Conversation & History Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#ece4d9] mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5a8c72] via-[#D8C97B] to-[#e07a52] p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-[#faf7f2] rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#e07a52]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-stone-800">
                  Flux <span className="text-[#e07a52]">AI</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Asistente Empático
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">Acompañamiento conversacional, regulación emocional y enfoque práctico</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="start-new-chat-btn"
              onClick={handleStartNewConversation}
              className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Comenzar una conversación desde cero"
            >
              <PlusCircle className="w-4 h-4 text-[#D8C97B]" />
              <span>Nueva conversación</span>
            </button>

            <button
              id="chat-history-btn"
              onClick={() => setShowHistoryModal(true)}
              className="bg-[#e07a52] hover:bg-[#c8633c] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
            </button>
          </div>
        </div>

        {/* AI Modes Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Enfoque:
          </span>
          {AI_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedMode === mode.id
                  ? 'bg-[#5a8c72] text-white shadow-xs ring-2 ring-[#5a8c72]/30'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
              }`}
              title={mode.desc}
            >
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* If no active chat conversation: Show Exact Image 5 Layout with enriched mood chips */}
        {messages.length === 0 ? (
          <div className="py-6 sm:py-10 flex flex-col items-center justify-center text-center">
            
            {/* Center Logo Icon & Brand */}
            <div className="flex items-center gap-3.5 mb-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5a8c72] via-[#D8C97B] to-[#e07a52] p-[2.5px] shadow-lg shadow-[#e07a52]/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#faf7f2] rounded-[13px] flex items-center justify-center shadow-inner">
                  <Sparkles className="w-7 h-7 text-[#e07a52] animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <span className="font-black text-3xl sm:text-4xl text-stone-900 tracking-tight block leading-none">
                  Flux <span className="bg-gradient-to-r from-[#e07a52] to-[#c8633c] bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[11px] font-semibold text-[#5a8c72] uppercase tracking-widest block mt-0.5">
                  Acompañamiento Empático 24/7
                </span>
              </div>
            </div>

            {/* Display Subtitle: ¿Cómo puedo ayudarte? */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <span className="text-[#5a8c72]">¿Cómo puedo </span>
              <span className="text-[#e07a52]">ayudarte?</span>
            </h2>

            {/* Mood Context Fast Pills */}
            <div className="max-w-2xl mb-6">
              <p className="text-xs text-stone-500 mb-2">Cuéntame cómo te sientes ahora para personalizar la respuesta:</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {QUICK_MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => {
                      setSelectedMoodContext(mood);
                      setInputText(`Hola Flux AI, ${mood.toLowerCase()}, ¿qué me recomiendas hacer?`);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      selectedMoodContext === mood
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Centered Search/Prompt Input Pill */}
            <div className="w-full max-w-2xl mb-8">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative flex items-center bg-white rounded-full border-2 border-stone-300 shadow-sm px-5 py-3 hover:border-stone-400 focus-within:border-[#5a8c72] focus-within:ring-2 focus-within:ring-[#5a8c72]/20 transition-all"
              >
                <input
                  id="flux-ai-main-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregunta lo que quieras..."
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm sm:text-base focus:outline-hidden pr-2"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('Hola Flux AI, me siento un poco abrumado hoy y necesito orientación para calmarme.');
                    }}
                    className="p-1.5 text-stone-400 hover:text-[#5a8c72] rounded-full transition-colors cursor-pointer"
                    title="Ejemplo rápido"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <button
                    type="submit"
                    id="flux-ai-send-btn"
                    disabled={!inputText.trim()}
                    className="w-9 h-9 rounded-full bg-[#e07a52] hover:bg-[#c8633c] disabled:opacity-50 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Suggested Prompts Section from Image 5 */}
            <div className="w-full max-w-2xl mb-10 text-left">
              <p className="text-sm font-semibold text-stone-700 mb-3 px-2 flex items-center justify-between">
                <span>Sugerencias de conversación:</span>
                <span className="text-xs text-stone-400 font-normal">Haz clic para enviar</span>
              </p>

              <div className="space-y-2.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    id={`suggestion-btn-${idx}`}
                    onClick={() => handleSendMessage(sug)}
                    className="w-full text-left bg-[#a5d6a7]/60 hover:bg-[#81c784]/80 text-stone-900 font-medium text-xs sm:text-sm px-5 py-3.5 rounded-full border border-[#81c784] shadow-2xs transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-between group"
                  >
                    <span>{sug}</span>
                    <Send className="w-3.5 h-3.5 text-[#5a8c72] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="max-w-2xl text-center">
              <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed bg-[#f3ede4] p-3.5 rounded-2xl border border-stone-200">
                Las respuestas de la IA son informativas y de apoyo práctico. Si experimentas una crisis o necesitas un diagnóstico, consulta siempre con un profesional de la salud mental.
              </p>
            </div>

          </div>
        ) : (
          /* Active Chat Screen */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-4 sm:p-6 mb-8 flex flex-col h-[650px]">
            
            {/* Active Chat Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5a8c72] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span>Flux AI</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      • Modo: {AI_MODES.find(m => m.id === selectedMode)?.label}
                    </span>
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    En línea y escuchando
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartNewConversation}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reiniciar chat"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Nueva</span>
                </button>

                <button
                  onClick={handleExportChat}
                  className="p-1.5 rounded-full text-stone-500 hover:bg-stone-100 cursor-pointer transition-colors"
                  title="Descargar conversación"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-1.5 rounded-full text-xs cursor-pointer transition-colors ${isVoiceActive ? 'bg-amber-100 text-amber-900' : 'text-stone-400 hover:bg-stone-100'}`}
                  title={isVoiceActive ? 'Voz activada' : 'Activar lectura por voz'}
                >
                  {isVoiceActive ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-[#5a8c72] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs group relative ${
                      msg.sender === 'user'
                        ? 'bg-[#e07a52] text-white rounded-br-none'
                        : 'bg-[#f8f5f0] text-stone-900 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs sm:text-sm font-normal">{msg.text}</p>
                    
                    {/* Bot Message Quick Followup Actions */}
                    {msg.sender === 'bot' && (
                      <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              const practice = INSTANT_PRACTICES_CATALOG[0]; // Quick breathing
                              setActivePractice(practice);
                            }}
                            className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Wind className="w-3 h-3 text-emerald-700" />
                            <span>Respirar ahora</span>
                          </button>
                          
                          <button
                            onClick={() => handleSendMessage('¿Podrías darme un paso todavía más simple y pequeño para empezar?')}
                            className="text-[11px] font-semibold text-stone-600 bg-stone-200/70 hover:bg-stone-300 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                          >
                            ⚡ Paso más simple
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-200/50 cursor-pointer"
                            title="Copiar texto"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className={`p-1 rounded cursor-pointer ${speakingMsgId === msg.id ? 'text-emerald-700 bg-emerald-100' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/50'}`}
                            title="Escuchar"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-right mt-1">
                        <span className="text-[10px] text-white/75">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-[#e07a52] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-stone-600 bg-stone-100/90 border border-stone-200 p-3 rounded-2xl max-w-xs shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#5a8c72] animate-spin" />
                  <span>Flux AI está pensando en una respuesta empática y clara...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe lo que sientes o lo que necesitas estructurar..."
                className="flex-1 bg-stone-50 border border-stone-300 rounded-full px-4 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:border-[#5a8c72] focus:ring-2 focus:ring-[#5a8c72]/20"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-[#e07a52] hover:bg-[#c8633c] disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>

            {/* Chat Disclaimer in Active View */}
            <div className="mt-2 text-center">
              <p className="text-[10px] text-stone-400 leading-tight">
                Las respuestas de la IA son informativas y de apoyo práctico. Si experimentas una crisis o necesitas un diagnóstico, consulta siempre con un profesional de la salud mental.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#e07a52]" />
                <h3 className="font-bold text-stone-900 text-base">Historial de Conversaciones</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[350px] overflow-y-auto">
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-900">Sesión Actual</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Activa</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  {messages.length > 0 ? `${messages.length} mensaje(s) intercambiados.` : 'No hay mensajes en la sesión activa.'}
                </p>
              </div>

              {archivedSessions.length > 0 ? (
                archivedSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="p-3.5 bg-stone-50 hover:bg-stone-100/90 rounded-2xl border border-stone-200 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-stone-800">{session.date}</p>
                        <span className="text-[10px] text-stone-400 font-medium">({session.messagesCount} msgs)</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">"{session.preview}"</p>
                    </div>
                    <button
                      onClick={() => handleRestoreSession(session)}
                      className="text-xs font-semibold text-[#5a8c72] hover:text-[#48725c] hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 shrink-0 cursor-pointer"
                    >
                      Cargar
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-stone-400">
                  Aún no tienes sesiones previas archivadas. Al iniciar una nueva conversación, las anteriores se guardarán aquí automáticamente.
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  handleStartNewConversation();
                  setShowHistoryModal(false);
                }}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Comenzar nueva sesión
              </button>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Practice Modal if launched from Flux AI */}
      {activePractice && (
        <InstantPracticeModal
          practice={activePractice}
          onClose={() => setActivePractice(null)}
        />
      )}

    </div>
  );
};
