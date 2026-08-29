import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfileData } from '../../types';
import { TeamSection } from './TeamSection';
import { InterfacesShowcase } from './InterfacesShowcase';
import { ContactSection } from './ContactSection';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { AuthModals } from '../common/AuthModals';
import { soundEngine } from '../../utils/audioSynth';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Lightbulb, 
  Waves, 
  SunMedium, 
  ShieldCheck, 
  Zap,
  Info,
  User,
  Layers,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Smile,
  Frown,
  Meh,
  Flame,
  BatteryCharging,
  Heart,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ChevronUp
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewMode) => void;
  currentUser?: UserProfileData;
  onAuthSuccess?: (targetView: ViewMode, userProfile?: Partial<UserProfileData>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  currentUser,
  onAuthSuccess 
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedQuickMood, setSelectedQuickMood] = useState<string | null>(null);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Mini breathing pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Sostén' | 'Exhala'>('Inhala');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const toggleSound = () => {
    const isNowPlaying = soundEngine.toggleAmbient('zen');
    setAmbientPlaying(isNowPlaying);
    if (isNowPlaying) {
      soundEngine.playBell(528, 2.0);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      if (breathingPhase === 'Inhala') {
        soundEngine.playBreathingCue('inhale');
        timer = setTimeout(() => {
          setBreathingPhase('Sostén');
          setBreathingSeconds(4);
        }, 4000);
      } else if (breathingPhase === 'Sostén') {
        soundEngine.playBreathingCue('hold');
        timer = setTimeout(() => {
          setBreathingPhase('Exhala');
          setBreathingSeconds(4);
        }, 4000);
      } else if (breathingPhase === 'Exhala') {
        soundEngine.playBreathingCue('exhale');
        timer = setTimeout(() => {
          setBreathingPhase('Inhala');
          setBreathingSeconds(4);
        }, 4000);
      }
    }
    return () => clearTimeout(timer);
  }, [isBreathingActive, breathingPhase]);

  const quickMoods = [
    { id: 'calm', label: 'En Calma', icon: Smile, color: 'text-[#5a8c72]', bg: 'bg-[#5a8c72]/10', tip: '¡Excelente! Mantén este estado con una breve reflexión o diario de gratitud.', targetView: 'journal' as ViewMode },
    { id: 'stressed', label: 'Estresado/a', icon: Flame, color: 'text-[#e07a52]', bg: 'bg-[#e07a52]/10', tip: 'Hagamos una pausa de 2 minutos. Te recomendamos el módulo SOS o la respiración guiada.', targetView: 'sos' as ViewMode },
    { id: 'tired', label: 'Cansado/a', icon: BatteryCharging, color: 'text-amber-600', bg: 'bg-amber-100', tip: 'La fatiga mental es una señal de tu cuerpo. Prueba nuestros podcasts de descanso mental.', targetView: 'learn' as ViewMode },
    { id: 'anxious', label: 'Con Ansiedad', icon: Meh, color: 'text-purple-600', bg: 'bg-purple-100', tip: 'Respira conmigo. Escribe tus pensamientos en el Diario o platica con Flux AI.', targetView: 'flux-ai' as ViewMode },
    { id: 'motivated', label: 'Motivado/a', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100', tip: '¡Aprovecha esta energía para fijar tus metas en el perfil y aprender algo nuevo!', targetView: 'profile' as ViewMode },
  ];

  const combinedFeatures = [
    { title: 'Educación emocional', desc: 'Recursos interactivos para comprender la mente y el cuerpo.' },
    { title: 'Monitoreo diario del estado de ánimo', desc: 'Registro de hábitos, energía, sueño y emociones.' },
    { title: 'Inteligencia artificial empática', desc: 'Modelos avanzados para acompañamiento y contención.' },
    { title: 'Análisis predictivo preventivo', desc: 'Detección temprana de sobrecarga y estrés antes de crisis.' },
    { title: 'Recomendaciones personalizadas', desc: 'Actividades y guías a tu propio ritmo.' },
    { title: 'Comunidad de apoyo segura', desc: 'Espacio libre de juicios moderado por expertos.' },
    { title: 'Integración inteligente', desc: 'Conexión con rutinas diarias y bienestar integral.' },
  ];

  const specificObjectives = [
    'Fomentar la educación emocional accesible y sin tecnicismos.',
    'Detectar cambios emocionales importantes y picos de sobrecarga.',
    'Promover hábitos saludables de sueño, hidratación y pausas activas.',
    'Brindar herramientas de regulación emocional (respiración 4-7-8, grounding).',
    'Reducir el estrés y la ansiedad académica y cotidiana.',
    'Facilitar el acceso inmediato a recursos de apoyo psicológico.',
    'Utilizar inteligencia artificial para personalizar la experiencia de cada usuario.'
  ];

  const faqs = [
    {
      q: '¿FluxGlow es gratuito para estudiantes y jóvenes?',
      a: 'Sí, el acceso a las guías educativas, tests orientativos, diario emocional y soporte de Flux AI está completamente abierto y diseñado para acompañarte sin costo.'
    },
    {
      q: '¿Cómo protege FluxGlow mi privacidad?',
      a: 'Toda tu información de diario y registro de estado de ánimo se almacena de forma segura y confidencial. No compartimos tus reflexiones privadas con terceros.'
    },
    {
      q: '¿Qué hago si estoy pasando por una crisis emocional grave?',
      a: 'FluxGlow cuenta con el Apartado #5 (Alerta Emocional & SOS) con líneas directas de ayuda psicológica gratuita 24/7 (como Línea de la Vida 800 911 2000 y SAPTEL) y ejercicios inmediatos de grounding.'
    },
    {
      q: '¿Puedo usar la plataforma sin registrarme?',
      a: '¡Por supuesto! Puedes explorar los 7 apartados interactivos en modo invitado con un solo clic.'
    }
  ];

  return (
    <div className="bg-[#faf7f2] text-stone-800">
      
      {/* Top Banner Navigation matching screenshot header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo on top-left */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <FluxGlowLogo size="sm" />
            </div>

            {/* Quick in-page nav (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
              <a href="#que-es" className="hover:text-[#4a7c59] transition-colors">¿Qué es?</a>
              <a href="#origen" className="hover:text-[#4a7c59] transition-colors">Origen</a>
              <a href="#objetivos" className="hover:text-[#4a7c59] transition-colors">Objetivos</a>
              <a href="#mision-vision" className="hover:text-[#4a7c59] transition-colors">Misión</a>
              <a href="#diseno" className="hover:text-[#4a7c59] transition-colors">7 Módulos</a>
              <a href="#equipo" className="hover:text-[#4a7c59] transition-colors">Equipo</a>
            </div>

            {/* Right actions matching screenshot: Soundscape | (i) Regístrate | 👤 Iniciar sesión */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                id="header-sound-btn"
                onClick={toggleSound}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  ambientPlaying 
                    ? 'bg-amber-100/80 border-amber-300 text-amber-900 shadow-xs animate-pulse' 
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                title="Sonido ambiental relajante (Cuencos Tibetanos)"
              >
                {ambientPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{ambientPlaying ? 'Sonido Zen Activo' : 'Música Zen'}</span>
              </button>

              <button
                id="top-nav-register-btn"
                onClick={() => openAuth('register')}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#4a7c59] text-sm sm:text-base font-semibold transition-colors py-1 px-2 rounded-lg cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-stone-400 flex items-center justify-center text-xs font-serif text-stone-600">
                  i
                </div>
                <span>Regístrate</span>
              </button>

              <button
                id="top-nav-login-btn"
                onClick={() => openAuth('login')}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#d4622a] text-sm sm:text-base font-semibold transition-colors py-1 px-2 rounded-lg cursor-pointer"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
                <span>Iniciar sesión</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* SECCIÓN HERO PRINCIPAL RECREADA EXACTAMENTE COMO LA CAPTURA */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 bg-white border-b border-stone-200/80 overflow-hidden" id="inicio">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#8DB596]/15 via-[#D8C97B]/15 to-[#E89A6B]/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          
          {/* Main Big FluxGlow Logo with sunburst, star and leaf sprouts */}
          <div className="flex justify-center mb-6">
            <FluxGlowLogo size="xl" showText={true} />
          </div>

          {/* Main Headline exact text: "Inteligente y a tu alcance" */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black mb-5 font-sans leading-tight">
            Inteligente y a tu alcance
          </h1>

          {/* Subtitle text matching reference screenshot */}
          <p className="text-base sm:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Transforma tu salud emocional con una plataforma que te entiende. Centraliza tu aprendizaje, registra tu progreso y recibe apoyo personalizado, todo en un solo lugar.
          </p>

          {/* Two Pill Buttons matching reference screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-xl mx-auto">
            
            {/* Green / Sage Pill Button: Regístrate */}
            <button
              id="hero-pill-register"
              onClick={() => openAuth('register')}
              className="w-full sm:w-60 py-3.5 px-8 rounded-full bg-[#5a8c72] hover:bg-[#4d7962] text-black font-extrabold text-base shadow-sm hover:shadow-md transition-all duration-200 text-center transform hover:-translate-y-0.5"
            >
              Regístrate
            </button>

            {/* Terracotta Orange Pill Button: Iniciar sesión */}
            <button
              id="hero-pill-login"
              onClick={() => openAuth('login')}
              className="w-full sm:w-60 py-3.5 px-8 rounded-full bg-[#e07a52] hover:bg-[#cf6b45] text-black font-extrabold text-base shadow-sm hover:shadow-md transition-all duration-200 text-center transform hover:-translate-y-0.5"
            >
              Iniciar sesión
            </button>

          </div>

          {/* Direct interactive demo bypass */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="hero-guest-explore-btn"
              onClick={() => onNavigate('learn')}
              className="text-xs sm:text-sm font-semibold text-[#4a7c59] hover:text-[#2d5a3f] flex items-center gap-1.5 underline underline-offset-4 py-1 cursor-pointer"
            >
              <span>O explora la aplicación interactiva de inmediato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Instant Mood Check Bar */}
          <div className="mt-12 max-w-2xl mx-auto bg-[#faf7f2] border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e07a52]" />
                <span>¿Cómo te sientes en este instante?</span>
              </span>
              <span className="text-[11px] text-stone-400">Prueba interactiva</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {quickMoods.map((m) => {
                const IconComponent = m.icon;
                const isSelected = selectedQuickMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedQuickMood(m.id);
                      soundEngine.playBell(528, 1.0);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#5a8c72] shadow-sm scale-105 ring-2 ring-[#5a8c72]/20'
                        : 'bg-white/60 border-stone-200/70 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${m.bg}`}>
                      <IconComponent className={`w-4 h-4 ${m.color}`} />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedQuickMood && (
              <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn text-left">
                <p className="text-xs text-stone-700 font-medium">
                  💡 {quickMoods.find(m => m.id === selectedQuickMood)?.tip}
                </p>
                <button
                  onClick={() => {
                    const mood = quickMoods.find(m => m.id === selectedQuickMood);
                    if (mood) onNavigate(mood.targetView);
                  }}
                  className="shrink-0 bg-[#5a8c72] hover:bg-[#48725c] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Ir al módulo sugerido</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* High quality Hero Graphic Banner */}
          <div className="mt-14 relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 group">
            <img 
              src="/src/assets/images/mental_health_hero_1787964175044.jpg" 
              alt="Jóvenes en bienestar emocional y mindfulness - FluxGlow"
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#5a8c72] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                  Espacio Seguro
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold rounded-full">
                  Juventud 15-30 Años
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                Un refugio digital donde cada emoción cuenta y cada día floreces.
              </h3>
            </div>
          </div>

          {/* Scroll Down Hint */}
          <div className="mt-12">
            <a 
              href="#que-es" 
              className="inline-flex flex-col items-center text-xs text-stone-400 hover:text-stone-700 transition-colors gap-1"
            >
              <span>Conoce todo sobre FluxGlow</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>

        </div>
      </section>

      {/* SECCIÓN ¿QUÉ ES FLUXGLOW? */}
      <section className="py-20 bg-[#faf7f2] border-b border-stone-200" id="que-es">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma de Salud Emocional</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent uppercase">
              ¿QUÉ ES FLUXGLOW?
            </h2>
          </div>

          {/* Fila 1: Descripción + Tarjeta Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed text-justify">
                <strong>FLUXGLOW</strong> es una plataforma digital inteligente diseñada para acompañar a las personas en el conocimiento, gestión y fortalecimiento de su salud emocional mediante tecnología, inteligencia artificial y herramientas de autoconocimiento.
              </p>
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed text-justify">
                Su propósito es ayudar a los usuarios a comprender cómo se sienten, identificar patrones emocionales, desarrollar hábitos saludables y recibir apoyo personalizado para mejorar su bienestar mental y emocional.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-[#e8dfd5] flex items-center gap-3 shadow-xs">
                <div className="p-2.5 bg-[#4a7c59] text-white rounded-xl shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  Un espacio 100% confidencial, amigable y diseñado pensando en la juventud de 15 a 30 años.
                </p>
              </div>
            </div>

            {/* Tarjeta Interactiva Flujo Visual */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                  Ecosistema Integral
                </span>
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <h4 className="text-2xl font-extrabold">Acompañamiento Inteligente 24/7</h4>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                No solo registras emociones; FluxGlow predice momentos de riesgo y te ofrece herramientas antes de que el estrés se convierta en crisis.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs font-semibold">
                <span>Bienestar Preventivo</span>
                <span>100% Adaptativo</span>
              </div>
            </div>
          </div>

          {/* Fila 2: FLUXGLOW COMBINA */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#d4622a]" />
              <span>FLUXGLOW combina:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combinedFeatures.map((feat, idx) => (
                <div key={idx} className="bg-[#faf7f2] p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4a7c59] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{feat.title}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN ORIGEN DE FLUXGLOW */}
      <section className="py-20 bg-white border-b border-stone-200" id="origen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider mb-3">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Identidad & Filosofía</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent uppercase mb-4">
              ORIGEN DE FLUXGLOW
            </h2>
            <p className="text-stone-600 text-base md:text-lg">
              El nombre <strong>FLUXGLOW</strong> nace de la unión armónica de dos conceptos fundamentales de la experiencia humana:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Card 1: FLUJO */}
            <div className="bg-[#faf7f2] p-8 rounded-3xl border border-orange-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#d4622a] flex items-center justify-center mb-5">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#d4622a] mb-2">FLUJO (Flux)</h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
                Representa el flujo constante de las emociones humanas. Las emociones cambian día a día, momento a momento, y forman parte natural de la vida. No hay emociones buenas o malas, sino estados en continuo movimiento.
              </p>
            </div>

            {/* Card 2: BRILLO */}
            <div className="bg-[#faf7f2] p-8 rounded-3xl border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <SunMedium className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#b8860b] mb-2">BRILLO (Glow)</h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
                Significa brillo, luz y crecimiento. Representa la capacidad que tiene cada persona de encontrar el equilibrio emocional, iluminar sus fortalezas y superar con resiliencia los desafíos cotidianos.
              </p>
            </div>

            {/* Card 3: SIGNIFICADO COMPLETO */}
            <div className="bg-gradient-to-br from-[#4a7c59] to-[#2d6a4f] p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                  <Lightbulb className="w-6 h-6 text-amber-200" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Significado Completo</h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed text-justify">
                  FLUXGLOW significa <strong>"iluminar el flujo de las emociones"</strong>. La plataforma ayuda a transformar emociones difíciles en oportunidades de crecimiento personal y bienestar duradero.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Transformando retos en evolución personal</span>
              </div>
            </div>

          </div>

          {/* Visual illustration of Claridad Mental & Wellness */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#faf7f2] rounded-3xl p-6 sm:p-10 border border-stone-200">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
              <img
                src="/src/assets/images/calm_mind_wellness_1787964189019.jpg"
                alt="Claridad mental y bienestar emocional - FluxGlow"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 bg-[#5a8c72]/10 text-[#5a8c72] text-xs font-bold uppercase tracking-wider rounded-full">
                Ciencia & Consciencia
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                El balance emocional no es ausencia de emociones, sino saber fluir con ellas.
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                A través de algoritmos éticos y herramientas basadas en la psicología cognitivo-conductual, FluxGlow te ofrece un espacio diario de descompresión para tus estudios, metas y vida personal.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('learn')}
                  className="bg-[#e07a52] hover:bg-[#c8633c] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Explora guías y podcasts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: OASIS DE RESPIRACIÓN Y CALMA RÁPIDA */}
      <section className="py-16 bg-[#faf7f2] border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5a8c72]/15 text-[#4a7c59] text-xs font-bold uppercase tracking-wider mb-3">
            <Waves className="w-3.5 h-3.5" />
            <span>Herramienta Interactiva en Vivo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-3">
            Oasis de Respiración Rápida
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Tómate 60 segundos para sincronizar tu ritmo cardíaco y liberar tensión acumulada.
          </p>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm flex flex-col items-center justify-center">
            {/* Animated Sphere */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-6">
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-4000 ease-in-out ${
                  isBreathingActive && breathingPhase === 'Inhala' 
                    ? 'scale-110 bg-[#8DB596]/30 shadow-2xl' 
                    : isBreathingActive && breathingPhase === 'Sostén'
                    ? 'scale-110 bg-[#D8C97B]/30'
                    : isBreathingActive && breathingPhase === 'Exhala'
                    ? 'scale-75 bg-[#E89A6B]/30'
                    : 'scale-90 bg-stone-100'
                }`}
              />
              <div 
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-white transition-all duration-4000 shadow-md ${
                  isBreathingActive && breathingPhase === 'Inhala'
                    ? 'bg-[#5a8c72] scale-105'
                    : isBreathingActive && breathingPhase === 'Sostén'
                    ? 'bg-[#b8860b] scale-105'
                    : isBreathingActive && breathingPhase === 'Exhala'
                    ? 'bg-[#e07a52] scale-90'
                    : 'bg-stone-400'
                }`}
              >
                <span className="font-extrabold text-lg sm:text-xl">
                  {isBreathingActive ? breathingPhase : 'Listo'}
                </span>
                <span className="text-xs text-white/90 mt-0.5">
                  {isBreathingActive ? '4 segundos' : 'Toca Iniciar'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (!isBreathingActive) {
                    soundEngine.playBell(528, 2.0);
                  }
                  setIsBreathingActive(!isBreathingActive);
                }}
                className={`px-6 py-3 rounded-full text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  isBreathingActive
                    ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                    : 'bg-[#5a8c72] text-white hover:bg-[#4a7c59] shadow-md hover:scale-105'
                }`}
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isBreathingActive ? 'Pausar Ejercicio' : 'Iniciar Respiración Guiada'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN OBJETIVO GENERAL & ESPECÍFICOS */}
      <section className="py-20 bg-[#faf7f2] border-b border-stone-200" id="objetivos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Objetivo General */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider border border-[#d4622a]/20">
                <Target className="w-3.5 h-3.5" />
                <span>Propósito Central</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#d4622a] font-serif">
                OBJETIVO GENERAL
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                Desarrollar una plataforma digital inteligente que promueva el bienestar emocional mediante el monitoreo, análisis y acompañamiento personalizado de las emociones de los usuarios.
              </p>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Innovación Principal
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Lo que hace único a FLUXGLOW no es solo registrar estados de ánimo, sino <strong>predecir riesgos emocionales</strong> y ofrecer apoyo personalizado antes de que los problemas se agraven.
                </p>
              </div>
            </div>

            {/* Objetivos Específicos */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#4a7c59]" />
                <span>OBJETIVOS ESPECÍFICOS:</span>
              </h3>

              <div className="space-y-3">
                {specificObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-[#faf7f2] rounded-2xl border border-stone-200/80 shadow-xs">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8DB596] to-[#4a7c59] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN MISIÓN Y VISIÓN */}
      <section className="py-20 bg-white border-b border-stone-200" id="mision-vision">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* MISIÓN */}
            <div className="bg-[#faf7f2] p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a7c59]/10 text-[#4a7c59] text-xs font-bold uppercase tracking-wider">
                <span>Razón de Ser</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] to-[#8DB596] bg-clip-text text-transparent">
                MISIÓN
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                FluxGlow es una empresa donde buscamos brindar a los jóvenes de 15-18 años (y juventud hasta 30 años) una página digital accesible, segura e inteligente que se centra en la educación emocional, el registro diario de hábitos y el análisis de su progreso, buscando que los jóvenes se sientan seguros, transformando la información confiable en herramientas prácticas para la gestión del estrés y la ansiedad.
              </p>
            </div>

            {/* VISIÓN */}
            <div className="bg-[#faf7f2] p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4622a]/10 text-[#d4622a] text-xs font-bold uppercase tracking-wider">
                <span>Horizonte a Futuro</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#d4622a] to-[#E89A6B] bg-clip-text text-transparent">
                VISIÓN
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed text-justify">
                Convertirnos en una plataforma web líder de apoyo emocional y prevención en el ámbito educativo de la salud emocional en Latinoamérica, siendo reconocidos por transformar la cultura de la salud mental en la juventud, promoviendo entornos más empáticos y conscientes del bienestar integral.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN ¿QUIÉNES SOMOS? (Equipo Fundador) */}
      <TeamSection />

      {/* SECCIÓN DISEÑO: INTERFACES DE LA PLATAFORMA (7 APARTADOS) */}
      <InterfacesShowcase onNavigate={onNavigate} />

      {/* SECCIÓN PREGUNTAS FRECUENTES (FAQ) */}
      <section className="py-20 bg-white border-b border-stone-200" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5a8c72]/10 text-[#5a8c72] text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dudas Comunes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Todo lo que necesitas saber para comenzar a cuidar tu bienestar con FluxGlow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#faf7f2] rounded-2xl border border-stone-200/90 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-stone-900 hover:text-[#5a8c72] transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#5a8c72] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-200/50 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <ContactSection />

      {/* Auth Modals */}
      <AuthModals
        isOpen={authModalOpen}
        initialMode={authMode}
        currentUser={currentUser}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(targetView, updatedProfile) => {
          setAuthModalOpen(false);
          if (onAuthSuccess) {
            onAuthSuccess(targetView || 'learn', updatedProfile);
          } else {
            onNavigate(targetView || 'learn');
          }
        }}
      />

    </div>
  );
};

