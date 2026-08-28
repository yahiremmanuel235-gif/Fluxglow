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
  X
} from 'lucide-react';
import { ChatMessage, UserProfileData } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface FluxAiModuleProps {
  userProfile?: UserProfileData;
}

export const FluxAiModule: React.FC<FluxAiModuleProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isBreathingGuideActive, setIsBreathingGuideActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts exactly from Image 5
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
  }, [messages, isLoading]);

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

    try {
      // Call server API for empathy-first response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply;
      } else {
        replyText = getFallbackResponse(text);
      }

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      if (isVoiceActive) {
        soundEngine.speak(replyText.slice(0, 150));
      }
    } catch (err) {
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: getFallbackResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('tarea') || q.includes('flojera') || q.includes('motivo')) {
      return "Comprendo esa sensación de pesadez inicial. Para vencer la inercia, no intentes hacer toda la tarea: aplica la 'Regla de los 5 Minutos'. Comprométete solo a abrir el documento y escribir 2 renglones o despejar tu escritorio. La acción precede a la motivación.";
    }
    if (q.includes('15 minutos') || q.includes('plan')) {
      return "Aquí tienes tu plan relámpago de 15 minutos:\n1. Minuto 0-3: Elige UN solo pendiente prioritario y pon tu móvil en otra habitación.\n2. Minuto 3-13: Trabaja con cronómetro en el primer avance tangible.\n3. Minuto 13-15: Revisa lo logrado y felicítate por iniciar.";
    }
    if (q.includes('organizar') || q.includes('pendientes') || q.includes('estres')) {
      return "Respira hondo un segundo. Toma una hoja y divide tus tareas en dos columnas: 1) 'Lo que debo resolver hoy sin falta (máximo 3 cosas)' y 2) 'Lo que puede esperar a mañana'. Enfocarte en solo 3 prioridades reducirá de inmediato tu sobrecarga mental.";
    }
    return "Estoy aquí para acompañarte paso a paso. Recuerda que no necesitas resolver todo de golpe; un pequeño paso consciente a la vez es suficiente para recuperar la calma y el enfoque.";
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Top Header with Brand Logo & History Button */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5a8c72] to-[#e07a52] p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#e07a52]" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-stone-800">
              FluxGlow
            </span>
          </div>

          <button
            id="chat-history-btn"
            onClick={() => setShowHistoryModal(true)}
            className="bg-[#e07a52] hover:bg-[#c8633c] text-white px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            <span>Historial de conversaciones</span>
          </button>
        </div>

        {/* If no active chat conversation: Show Exact Image 5 Layout */}
        {messages.length === 0 ? (
          <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center">
            
            {/* Center Logo Icon & Brand from Image 5 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5a8c72] via-[#D8C97B] to-[#e07a52] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#faf7f2] rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#e07a52]" />
                </div>
              </div>
              <span className="font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
                Flux AI
              </span>
            </div>

            {/* Display Subtitle: ¿Comó puedo ayudarte? */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
              <span className="text-[#5a8c72]">¿Comó puedo </span>
              <span className="text-[#e07a52]">ayudarte?</span>
            </h2>

            {/* Centered Search/Prompt Input Pill */}
            <div className="w-full max-w-2xl mb-12">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative flex items-center bg-white rounded-full border-2 border-stone-300 shadow-sm px-5 py-3 hover:border-stone-400 focus-within:border-[#5a8c72] focus-within:ring-2 focus-within:ring-[#5a8c72]/20 transition-all"
              >
                <input
                  id="flux-ai-main-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregunta lo que quieras"
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm sm:text-base focus:outline-hidden pr-2"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('Hola Flux AI, me siento un poco abrumado hoy y necesito orientación.');
                    }}
                    className="p-1.5 text-stone-400 hover:text-[#5a8c72] rounded-full transition-colors"
                    title="Dictado por voz"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <button
                    type="submit"
                    id="flux-ai-send-btn"
                    className="w-9 h-9 rounded-full bg-[#e07a52] hover:bg-[#c8633c] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Suggested Prompts Section */}
            <div className="w-full max-w-2xl mb-12 text-left">
              <p className="text-sm font-semibold text-stone-700 mb-3 px-2">
                Sugerencias de conversación:
              </p>

              <div className="space-y-2.5">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    id={`suggestion-btn-${idx}`}
                    onClick={() => handleSendMessage(sug)}
                    className="w-full text-left bg-[#a5d6a7]/60 hover:bg-[#81c784]/80 text-stone-900 font-medium text-xs sm:text-sm px-5 py-3.5 rounded-full border border-[#81c784] shadow-2xs transition-all hover:scale-[1.01]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Disclaimer from Image 5 */}
            <div className="max-w-2xl text-center">
              <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed bg-[#f3ede4] p-3.5 rounded-2xl border border-stone-200">
                Las respuestas de la IA son informativas y de apoyo práctico. Si experimentas una crisis o necesitas un diagnóstico, consulta siempre con un profesional de la salud mental.
              </p>
            </div>

          </div>
        ) : (
          /* Active Chat Screen */
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-4 sm:p-6 mb-8 flex flex-col h-[600px]">
            
            {/* Active Chat Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5a8c72] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Flux AI • Asistente de Acompañamiento</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    En línea y disponible
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-1.5 rounded-full text-xs ${isVoiceActive ? 'bg-amber-100 text-amber-900' : 'text-stone-400 hover:bg-stone-100'}`}
                  title={isVoiceActive ? 'Voz activada' : 'Activar respuesta por voz'}
                >
                  {isVoiceActive ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-stone-400 hover:text-red-500 rounded-full hover:bg-stone-100"
                  title="Reiniciar chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-[#5a8c72] text-white flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#e07a52] text-white rounded-br-none'
                        : 'bg-[#f4efe8] text-stone-900 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] block mt-1.5 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-stone-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-[#e07a52] text-white flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-stone-500 bg-stone-100 p-3 rounded-2xl max-w-xs">
                  <Sparkles className="w-4 h-4 text-[#5a8c72] animate-spin" />
                  <span>Flux AI está reflexionando su respuesta...</span>
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
                placeholder="Escribe tu mensaje o inquietud..."
                className="flex-1 bg-stone-50 border border-stone-300 rounded-full px-4 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:border-[#5a8c72]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-[#e07a52] hover:bg-[#c8633c] disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg">Historial de Conversaciones</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-stone-800">Sesión 27 Jun - Manejo de estrés</p>
                <p className="text-xs text-stone-500 mt-1">"Conversación sobre técnicas para iniciar la jornada laboral sin ansiedad."</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-stone-800">Sesión 24 Jun - Plan de 15 minutos</p>
                <p className="text-xs text-stone-500 mt-1">"Estrategia relámpago de organización de tareas complejas."</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full bg-[#5a8c72] text-white py-2 rounded-xl text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
