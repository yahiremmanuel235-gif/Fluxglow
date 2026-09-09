import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Wand2, 
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
  HelpCircle,
  Compass
} from 'lucide-react';
import { ChatMessage, UserProfileData, InstantPracticeItem } from '../../types';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { soundEngine } from '../../utils/audioSynth';
import { useToast } from '../common/Toast';
import { INSTANT_PRACTICES_CATALOG } from '../../data/instantPracticesData';
import { InstantPracticeModal } from './InstantPracticeModal';
import { sendChatMessageToGemini } from '../../services/gemini';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { info, success } = useToast();

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
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

    info('Nueva conversación iniciada.');
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
    success('Conversación anterior cargada.');
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

    try {
      const replyText = await sendChatMessageToGemini({
        message: text,
        history: messages.slice(-8).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        })),
        mode: selectedMode,
        userMood: selectedMoodContext,
        userContext: userProfile ? {
          name: userProfile.name,
          ageGroup: userProfile.ageGroup
        } : undefined
      });

      const finalReply = replyText || getFallbackResponse(text, selectedMode);

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: finalReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      if (isVoiceActive) {
        soundEngine.speak(finalReply.slice(0, 200));
      }
    } catch (err) {
      console.warn('Error al obtener respuesta de Flux AI:', err);
      const fallbackReply = getFallbackResponse(text, selectedMode);
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: fallbackReply,
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
    success('Texto copiado al portapapeles');
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
    success('Conversación descargada en archivo de texto.');
  };

  const getFallbackResponse = (query: string, mode: AiMode): string => {
    const q = query.toLowerCase().trim();

    if (q.includes('suicid') || q.includes('quitarme la vida') || q.includes('no quiero vivir') || q.includes('hacerme daño')) {
      return `💙 **Estoy aquí contigo y tu bienestar es lo más importante.**\nPor favor, no cargues con este dolor en soledad. Existen personas listas para escucharte con total respeto y confidencialidad en este momento:\n\n- 📞 **Línea de Apoyo y Acompañamiento Emocional**: [+503 7801-4680](tel:+50378014680)\n- 🚨 **Servicios de Emergencia**: Llama al 911 o acude al centro de salud más cercano.\n\nRespira despacio. Tu vida tiene un valor incalculable y este momento difícil puede ser acompañado.`;
    }

    if (q === 'hola' || q === 'buenas' || q === 'buenos dias' || q === 'buenas tardes' || q === 'buenas noches' || q.startsWith('hola ') || q.startsWith('que tal')) {
      return `👋 ¡Hola! Es un gusto saludarte. Soy **Flux AI**, tu espacio seguro de bienestar emocional y psicología práctica en FluxGlow.\n\nEstoy aquí para escucharte sin juicios, ayudarte a ordenar tus pensamientos o guiarte en ejercicios rápidos de calma.\n\n¿Cómo te estás sintiendo en este momento o en qué te gustaría que nos enfoquemos hoy?`;
    }

    if (q.includes('como estas') || q.includes('cómo estás') || q.includes('como te encuentras')) {
      return `🌸 Estoy aquí con toda la disposición para acompañarte y escucharte. Me alegra que dediques este momento para ti.\n\n¿Cómo ha estado tu día y qué hay en tu mente ahora mismo?`;
    }

    if (q.includes('gracias') || q.includes('muchas gracias')) {
      return `✨ **Con todo el gusto.** Recuerda que este espacio es tuyo y puedes regresar cada vez que necesites claridad, desahogo o una pausa para respirar. ¿Hay algo más en lo que te pueda apoyar hoy?`;
    }

    if (q.includes('que puedes hacer') || q.includes('qué puedes hacer') || q.includes('ayuda') || q.includes('para que sirves')) {
      return `🌟 **Puedo ayudarte de diversas maneras prácticas:**\n\n1. 🫁 **Regulación somática**: Ejercicios de respiración (Suspiro fisiológico, 4-7-8) y anclaje sensorial para frenar la ansiedad.\n2. ⚡ **Plan de acción y vencer procrastinación**: Dividir tareas abrumadoras en micropasos de 2 a 5 minutos.\n3. 🧠 **Reencuadre cognitivo**: Detectar trampas mentales (sobrepensamiento, catastrofismo) y encontrar perspectivas realistas.\n4. 🌙 **Apagado mental nocturno**: Técnicas para soltar preocupaciones antes de dormir.\n5. 💬 **Desahogo seguro**: Un espacio confidencial para expresar lo que sientes sin juzgarte.\n\n¿Por cuál de estas áreas te gustaría empezar?`;
    }

    if (mode === 'somatic' || q.includes('cuerpo') || q.includes('respirar') || q.includes('palpitaciones') || q.includes('ansiedad') || q.includes('ansioso') || q.includes('nervios')) {
      return `🫁 **Regulación Somática del Sistema Nervioso**:\nCuando experimentamos ansiedad o sobrecarga, el cuerpo activa la respuesta de alerta. Vamos a indicarle al nervio vago que estamos a salvo.\n\n1. **Suspiro Fisiológico**: Inhala profundo por la nariz, toma una segunda micro-inhalación corta arriba y exhala despacio por la boca con un suspiro largo. Repítelo 3 veces.\n2. **Soltar Mandíbula y Hombros**: Deja caer los hombros 2 centímetros y separa la lengua del paladar.\n3. **Anclaje Sensorial**: Siente el apoyo del suelo en tus pies y ubica 3 objetos de color verde o azul a tu vista.\n\n¿Cómo sientes tu respiración tras esta pausa de un minuto?`;
    }

    if (mode === 'reframe' || q.includes('sobrepensando') || q.includes('rumiacion') || q.includes('pensar de mas') || q.includes('pensar de más') || q.includes('culpa') || q.includes('miedo') || q.includes('preocupad')) {
      return `🧠 **Reencuadre Cognitivo (TCC & Claridad)**:\nEl sobrepensamiento suele ser una trampa donde la mente confunde una posibilidad incierta con un peligro inminente.\n\n🔍 **Filtro de Desactivación**:\n1. **¿Es un hecho o una interpretación?**: Separa lo que realmente ha ocurrido de las predicciones catastróficas que tu mente está construyendo.\n2. **Perspectiva Compasiva**: ¿Qué le dirías a un buen amigo si estuviera pasando exactamente por este mismo pensamiento?\n3. **Foco en el Presente**: ¿Qué está en tu control hacer en los próximos 10 minutos para aliviar esta carga?\n\n¿Cuál es ese pensamiento específico que más te está desgastando hoy?`;
    }

    if (mode === 'sleep' || q.includes('dormir') || q.includes('insomnio') || q.includes('noche') || q.includes('desvelo')) {
      return `🌙 **Ritual de Apagado Mental para el Descanso**:\nIntentar dormir cuando la mente sigue en modo resolución de problemas genera frustración. Vamos a desacelerar el ritmo juntos.\n\n1. **Descarga en Papel**: Escribe 2 o 3 pendientes que te preocupen y añade: *"Lo revisaré mañana a las 10:00 AM"*. Esto le permite al cerebro soltar la retención.\n2. **Baja el Brillo**: Reduce la luz de tu entorno y relaja la vista.\n3. **Respiración 4-7-8**: Inhala en 4s, retén suavemente 7s y exhala en 8s por 4 ciclos.\n\n¿Te gustaría que hagamos una breve visualización de relajación antes de acostarte?`;
    }

    if (mode === 'action' || q.includes('tarea') || q.includes('flojera') || q.includes('motivo') || q.includes('procrastin') || q.includes('empezar')) {
      return `Es completamente comprensible sentir esa resistencia mental. En psicología sabemos que la mal llamada "flojera" suele ser fatiga acumulada o una tarea que se siente inmensa.\n\n⚡ **Técnica del Micropaso de 2 Minutos**:\n1. **Meta diminuta**: Tu único objetivo en este instante NO es terminar todo, sino solo abrir el cuaderno o documento.\n2. **Cero distracciones**: Pon el móvil fuera de tu campo visual por 10 minutos.\n3. **Inercia positiva**: Trabaja solo 5 minutos seguidos con cronómetro. Romper la resistencia inicial es el 80% del éxito.\n\n¿De qué materia o actividad se trata? Cuéntame y la desglosamos en 3 pasos mínimos.`;
    }

    if (q.includes('15 minutos') || q.includes('plan')) {
      return `¡Excelente iniciativa! Trabajar en bloques delimitados le da a tu cerebro una sensación inmediata de alivio y control.\n\n⏱️ **Protocolo de Enfoque Relámpago de 15 Minutos**:\n- **Minutos 0 a 2 (Claridad)**: Elige solo UN entregable concreto (ej. leer una página o estructurar 3 ideas clave).\n- **Minutos 3 a 12 (Foco)**: Inmersión total sin cambiar de ventana ni revisar notificaciones.\n- **Minutos 13 a 15 (Cierre)**: Marca tu avance y haz una respiración profunda para registrar el logro.\n\n¿Cuál es ese primer objetivo concreto al que le dedicamos estos 15 minutos?`;
    }

    if (q.includes('organizar') || q.includes('pendientes') || q.includes('estres') || q.includes('agobio') || q.includes('abrumad')) {
      return `Cuando tenemos demasiadas tareas dando vueltas en la cabeza, la memoria de trabajo se satura y se activa la alarma del estrés.\n\n📋 **Estrategia de Descarga 1-3-5**:\n1. **1 Tarea Clave**: La prioridad no negociable de hoy.\n2. **3 Tareas Medias**: Acciones manejables en 20 minutos.\n3. **5 Micro-acciones**: Cosas rápidas (un correo, un mensaje, ordenar la mesa).\n\nTodo lo demás queda programado sin culpa para mañana. ¿Quieres que organicemos tus pendientes con esta fórmula?`;
    }

    if (q.includes('triste') || q.includes('llorar') || q.includes('desanimo') || q.includes('desánimo') || q.includes('bajon') || q.includes('bajón')) {
      return `🤍 **Te abrazo con el pensamiento.** Es completamente válido sentirse así; la tristeza es una invitación del cuerpo a bajar la velocidad y cuidarte con delicadeza.\n\n- No te fuerces a fingir que todo está bien.\n- Date permiso de descansar y tomar algo caliente.\n- Tu valor sigue intacto sin importar lo productivo que hayas sido hoy.\n\n¿Quieres contarme qué ocurrió o prefieres que hagamos una pausa en silencio juntos?`;
    }

    return `Te escucho con atención y respeto. Sobre lo que mencionas ("${query.length > 60 ? query.slice(0, 57) + '...' : query}"):\n\n✨ **Perspectiva psicológica**: Recuerda que procesar tus vivencias y darles nombre es un paso clave para recuperar el balance y la claridad.\n\n¿Te gustaría que analicemos esto con una técnica de enfoque rápido, una respiración somática o prefieres profundizar más en cómo te hace sentir?`;
  };

  return (
    <div className="w-full bg-flux-brand-bath min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Top Header with Brand Logo, New Conversation & History Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#5F927B]/20 mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF1EA] border border-[#C5DDD0] p-1.5 flex items-center justify-center shadow-xs">
              <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-stone-800">
                  Flux <span className="text-[#E87A52]">AI</span>
                </span>
                <span className="text-[10px] font-bold bg-[#EBF1EA] text-[#3E6855] border border-[#C5DDD0] px-2 py-0.5 rounded-full">
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
              className="bg-[#5F927B] hover:bg-[#4E7D68] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Comenzar una conversación desde cero"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Nueva conversación</span>
            </button>

            <button
              id="chat-history-btn"
              onClick={() => setShowHistoryModal(true)}
              className="bg-[#E87A52] hover:bg-[#D4653E] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
            </button>
          </div>
        </div>

        {/* AI Modes Selector Bar with clear descriptive micro-labels */}
        <div className="bg-white/90 rounded-3xl border-2 border-[#5F927B]/30 p-3 mb-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Compass className="w-3.5 h-3.5 text-[#5F927B]" />
              <span>Modalidad de Acompañamiento</span>
            </div>
            <span className="text-[11px] text-stone-500 hidden sm:inline">Elige el estilo de respuesta de Flux AI</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {AI_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#5F927B] text-white font-bold shadow-xs'
                      : 'bg-[#FAF7F2] hover:bg-[#EBF1EA] text-stone-700 border border-[#C5DDD0]'
                  }`}
                  title={mode.desc}
                >
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* If no active chat conversation: Show clean layout */}
        {messages.length === 0 ? (
          <div className="py-6 sm:py-8 flex flex-col items-center justify-center text-center">
            
            {/* Center Logo Icon & Brand */}
            <div className="flex items-center gap-3 mb-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#5F927B] to-[#E87A52] p-[2px] shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#FAF7F2] rounded-[22px] flex items-center justify-center p-2.5">
                  <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-8 h-8 object-contain" />
                </div>
              </div>
              <div className="text-left">
                <span className="font-black text-2xl sm:text-3xl text-stone-900 tracking-tight block leading-none">
                  Flux <span className="text-[#E87A52]">AI</span>
                </span>
                <span className="text-[10px] font-bold text-[#3E6855] bg-[#EBF1EA] px-2 py-0.5 rounded-full uppercase tracking-wider block mt-1 border border-[#C5DDD0]">
                  Acompañamiento Empático
                </span>
              </div>
            </div>

            {/* Display Subtitle: ¿Cómo puedo ayudarte? */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal leading-normal overflow-visible mb-3">
              <span className="bg-gradient-to-r from-[#3E6855] via-[#5F927B] to-[#E87A52] bg-clip-text text-transparent">
                ¿Cómo puedo ayudarte?
              </span>
            </h2>

            {/* Quick Context Pills */}
            <div className="max-w-2xl mb-5">
              <p className="text-xs text-stone-500 mb-2">Cuéntame cómo te sientes para personalizar la respuesta:</p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {QUICK_MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => {
                      setSelectedMoodContext(mood);
                      setInputText(`Hola Flux AI, ${mood.toLowerCase()}, ¿qué me recomiendas hacer?`);
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                      selectedMoodContext === mood
                        ? 'bg-[#EBF1EA] border-[#5F927B] text-[#3E6855] font-bold shadow-2xs'
                        : 'bg-white border-[#C5DDD0] text-stone-700 hover:bg-[#EBF1EA]'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Centered Search/Prompt Input Pill */}
            <div className="w-full max-w-2xl mb-6">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative flex items-center bg-white rounded-full border-2 border-[#5F927B]/30 shadow-xs px-4 py-2.5 hover:border-[#5F927B] focus-within:border-[#5F927B] focus-within:ring-2 focus-within:ring-[#5F927B]/20 transition-all"
              >
                <img src="/assets/icons/search.png" alt="Buscar" className="w-4 h-4 shrink-0 mr-3 object-contain" />
                <input
                  id="flux-ai-main-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregunta lo que quieras sobre tus emociones o bienestar..."
                  className="w-full bg-transparent border-none text-stone-800 placeholder-stone-400 text-sm sm:text-base focus:outline-hidden pr-2"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('Hola Flux AI, me siento un poco abrumado hoy y necesito orientación para calmarme.');
                    }}
                    className="p-1.5 text-stone-400 hover:text-[#5F927B] rounded-full transition-colors cursor-pointer"
                    title="💡 Usar sugerencia rápida con IA"
                    aria-label="Sugerencia rápida"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    id="flux-ai-send-btn"
                    disabled={!inputText.trim()}
                    className="w-9 h-9 rounded-full bg-[#E87A52] hover:bg-[#D4653E] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                    aria-label="Enviar mensaje a Flux AI"
                  >
                    <img src="/assets/icons/send.png" alt="Enviar" className="w-4 h-4 object-contain brightness-0 invert" />
                  </button>
                </div>
              </form>
            </div>

            {/* Suggested Prompts Section */}
            <div className="w-full max-w-2xl mb-8 text-left">
              <p className="text-xs font-semibold text-stone-700 mb-2 px-2 flex items-center justify-between">
                <span>Sugerencias de conversación:</span>
                <span className="text-[11px] text-stone-400 font-normal">Haz clic para enviar</span>
              </p>

              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    id={`suggestion-btn-${idx}`}
                    onClick={() => handleSendMessage(sug)}
                    className="w-full text-left bg-white hover:bg-[#EBF1EA] text-stone-900 font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-[#C5DDD0] shadow-2xs transition-all hover:scale-[1.005] cursor-pointer flex items-center justify-between group"
                  >
                    <span>{sug}</span>
                    <img src="/assets/icons/send.png" alt="Enviar" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="max-w-2xl text-center">
              <p className="text-[11px] text-stone-600 leading-relaxed bg-[#EBF1EA] p-3 rounded-2xl border border-[#C5DDD0]">
                Las respuestas de Flux AI son orientativas y prácticas. Si experimentas una crisis o necesitas atención clínica, consulta siempre con un profesional de la salud mental.
              </p>
            </div>
          </div>
        ) : (
          /* Active Chat Screen */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-[#5F927B]/30 shadow-sm p-4 sm:p-6 mb-8 flex flex-col h-[650px]">
            
            {/* Active Chat Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#5F927B]/20 mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#EBF1EA] border border-[#C5DDD0] p-1.5 flex items-center justify-center shadow-xs">
                  <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span>Flux AI</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      • Modo: {AI_MODES.find(m => m.id === selectedMode)?.label}
                    </span>
                  </h3>
                  <span className="text-[10px] text-[#3E6855] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B] animate-pulse"></span>
                    En línea y escuchando
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStartNewConversation}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EBF1EA] text-stone-700 border border-[#C5DDD0] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reiniciar chat"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-stone-600" />
                  <span className="hidden sm:inline">Nueva</span>
                </button>

                <button
                  onClick={handleExportChat}
                  className="p-1.5 rounded-full text-stone-500 hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                  title="Descargar conversación"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-1.5 rounded-full text-xs cursor-pointer transition-colors ${isVoiceActive ? 'bg-[#FDF4F0] text-[#E87A52]' : 'text-stone-400 hover:bg-[#FAF7F2]'}`}
                  title={isVoiceActive ? 'Voz activada' : 'Activar lectura por voz'}
                >
                  {isVoiceActive ? <Volume2 className="w-4 h-4 text-[#E87A52]" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Chat Messages List */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-[#EBF1EA] border border-[#C5DDD0] p-1 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-4.5 h-4.5 object-contain" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs group relative ${
                      msg.sender === 'user'
                        ? 'bg-[#E87A52] text-white rounded-br-none font-medium'
                        : 'bg-[#FAF7F2] text-stone-900 border border-[#C5DDD0] rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs sm:text-sm font-normal">{msg.text}</p>
                    
                    {/* Bot Message Quick Followup Actions */}
                    {msg.sender === 'bot' && (
                      <div className="mt-2.5 pt-2 border-t border-[#C5DDD0]/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              const practice = INSTANT_PRACTICES_CATALOG[0]; // Quick breathing
                              setActivePractice(practice);
                            }}
                            className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] hover:bg-[#D5E6DC] px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors border border-[#C5DDD0]"
                          >
                            <Wind className="w-3 h-3 text-[#5F927B]" />
                            <span>Respirar ahora</span>
                          </button>
                          
                          <button
                            onClick={() => handleSendMessage('¿Podrías darme un paso todavía más simple y pequeño para empezar?')}
                            className="text-[11px] font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
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
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#5F927B]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.text)}
                            className={`p-1 rounded cursor-pointer ${speakingMsgId === msg.id ? 'text-[#3E6855] bg-[#EBF1EA]' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200/50'}`}
                            title="Escuchar"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-right mt-1">
                        <span className="text-[10px] text-white/80">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#E87A52] p-1 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <img src="/assets/icons/nav-profile.png" alt="Usuario" className="w-5 h-5 object-contain brightness-0 invert" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-xs text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] p-3 rounded-2xl max-w-xs shadow-2xs">
                  <img src="/assets/icons/nav-ai.png" alt="Pensando" className="w-4 h-4 object-contain animate-spin" />
                  <span>Flux AI está pensando en una respuesta empática y clara...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="mt-3 pt-3 border-t border-[#C5DDD0] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe lo que sientes o lo que necesitas estructurar..."
                className="flex-1 bg-[#FAF7F2] border-2 border-[#5F927B]/30 rounded-full px-4 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:border-[#5F927B] focus:ring-2 focus:ring-[#5F927B]/20"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-[#E87A52] hover:bg-[#D4653E] disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
              >
                <img src="/assets/icons/send.png" alt="Enviar" className="w-4 h-4 object-contain brightness-0 invert" />
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
      <InstantPracticeModal
        practice={activePractice}
        isOpen={!!activePractice}
        onClose={() => setActivePractice(null)}
      />

    </div>
  );
};
