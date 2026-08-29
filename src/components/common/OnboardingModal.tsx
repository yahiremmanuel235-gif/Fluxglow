import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Target, 
  BookOpen, 
  CheckCircle2,
  Smile,
  BarChart3,
  Bot,
  ShieldAlert,
  Users,
  HelpCircle,
  Check,
  Zap,
  Flame,
  ExternalLink,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from './FluxGlowLogo';
import { ViewMode } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: ViewMode) => void;
}

type OnboardingState = 'ask_first_time' | 'ask_experienced_guide' | 'tutorial';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigate 
}) => {
  const [modalState, setModalState] = useState<OnboardingState>('ask_first_time');
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleFirstTimeResponse = (isFirstTime: boolean) => {
    if (isFirstTime) {
      setModalState('tutorial');
      setCurrentStep(0);
    } else {
      setModalState('ask_experienced_guide');
    }
  };

  const handleExperiencedGuideResponse = (wantsGuide: boolean) => {
    if (wantsGuide) {
      setModalState('tutorial');
      setCurrentStep(0);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('fluxglow_onboarding_completed', 'true');
    localStorage.setItem('fluxglow_first_time_asked', 'true');
    
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });

    onClose();
  };

  const handleJumpToSection = (view: ViewMode) => {
    localStorage.setItem('fluxglow_onboarding_completed', 'true');
    localStorage.setItem('fluxglow_first_time_asked', 'true');
    onClose();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  // Detailed interfaces breakdown
  const interfacesList: Array<{
    id: string;
    viewMode: ViewMode;
    badge: string;
    title: string;
    tagline: string;
    color: string;
    icon: React.ReactNode;
    features: string[];
    valueProp: string;
    image: string;
  }> = [
    {
      id: 'learn',
      viewMode: 'learn',
      badge: '1. Explora y Aprende',
      title: 'Tu centro integral de aprendizaje emocional y calma en vivo',
      tagline: 'Comprende el funcionamiento de tu mente y accede a herramientas prácticas basadas en neurociencia.',
      color: 'text-[#548c71]',
      icon: <BookOpen className="w-6 h-6 text-[#548c71]" />,
      features: [
        'Guías completas en pantalla completa con respaldo científico, resúmenes simples, glosarios y consejos.',
        'Prácticas al Instante: micro-ejercicios en tiempo real (Suspiro Fisiológico, Respiración 4-7-8, Anclaje 5-4-3-2-1 y Temporizador de Enfoque).',
        'Videos y Podcasts de psicólogos verificados sobre manejo del estrés, autoestima y descanso nocturno.',
        'Tests psicológicos de autoevaluación orientativa (escalas clínicas breves con resultados y pautas inmediatas).',
        'Desbloqueo automático de 3 misiones prácticas al finalizar la lectura de cada guía.'
      ],
      valueProp: 'Ideal para pasar del desconocimiento al dominio emocional con herramientas interactivas al alcance de un clic.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'journal',
      viewMode: 'journal',
      badge: '2. Diario Emocional',
      title: 'Registro consciente, notas de voz y espacio íntimo',
      tagline: 'Un refugio seguro para expresar cómo te sientes, desahogarte y monitorear tu evolución diaria.',
      color: 'text-[#de6943]',
      icon: <Smile className="w-6 h-6 text-[#de6943]" />,
      features: [
        'Semáforo emocional interactivo con 5 estados (😡, 🙁, 😐, 🙂, 😄) y selector de intensidad del 1 al 10.',
        'Notas de voz con transcripción automática para registrar tus pensamientos hablando con total libertad.',
        'Etiquetas de factores detonantes (#trabajo, #familia, #sueño, #pareja) y registro de hábitos físicos.',
        'Frases inspiradoras personalizadas y acompañamiento reflexivo instantáneo tras cada envío.',
        'Historial privado protegido con opciones para buscar, filtrar y revisar tus entradas pasadas.'
      ],
      valueProp: 'Te ayuda a desahogar la mente y generar claridad sobre lo que detona tus emociones cotidianas.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'missions',
      viewMode: 'missions',
      badge: '3. Misiones Diarias',
      title: 'Hábitos prácticos de 3 a 5 minutos y racha activa',
      tagline: 'Consolida tu aprendizaje convirtiendo la teoría en pequeños pasos diarios con gamificación positiva.',
      color: 'text-amber-600',
      icon: <Target className="w-6 h-6 text-amber-600" />,
      features: [
        '3 retos prácticos accionables desbloqueados al terminar cualquier guía o sugeridos a diario.',
        'Contador de racha activa con fuego (🔥) que premia tu constancia día tras día.',
        'Puntos de experiencia (XP) acumulables para subir de nivel y celebrar tu dedicación al autocuidado.',
        'Pestañas para filtrar misiones pendientes y completadas, con identificación de la guía de origen.',
        'Insignia numérica en tiempo real en la barra de navegación para no olvidar tus hábitos del día.'
      ],
      valueProp: 'Evita que los consejos se queden en el papel y te guía para ejercitar tu bienestar en pocos minutos.',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'analytics',
      viewMode: 'analytics',
      badge: '4. Análisis Predictivo',
      title: 'Métricas inteligentes de patrones y prevención de sobrecarga',
      tagline: 'Visualiza la trayectoria de tu bienestar y anticipa momentos de fatiga o estrés antes de que ocurran.',
      color: 'text-[#548c71]',
      icon: <BarChart3 className="w-6 h-6 text-[#548c71]" />,
      features: [
        'Semáforo preventivo inteligente que te avisa si acumulas días seguidos de sobrecarga o tensión.',
        'Gráficos interactivos de fluctuación anímica semanal y mensual con promedios de intensidad.',
        'Correlación entre hábitos biológicos (horas de sueño, hidratación, ejercicio) y tu estado de ánimo.',
        'Balance porcentual de emociones y radar de estabilidad psicológica.',
        'Detección de factores detonantes recurrentes para ayudarte a tomar decisiones conscientes.'
      ],
      valueProp: 'Transforma tus registros diarios en autoconocimiento real y alertas tempranas de autocuidado.',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ai',
      viewMode: 'ai',
      badge: '5. Flux AI',
      title: 'Acompañante empático 24/7 basado en Terapia Cognitiva',
      tagline: 'Tu confidente de bolsillo disponible a toda hora para escucharte, contenerte y orientarte sin juicios.',
      color: 'text-purple-600',
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      features: [
        'Conversación empática y reflexiva guiada por principios de Terapia Cognitivo-Conductual (TCC) y mindfulness.',
        'Reformulación de pensamientos automáticos y cuestionamiento de creencias catastrofistas.',
        'Generación personalizada de ejercicios a medida según lo que estés experimentando en el instante.',
        'Sugerencias dinámicas de técnicas de respiración y pausas somáticas integradas en el chat.',
        'Espacio 100% privado, confidencial y sin juicios, listo para acompañarte tanto de día como de madrugada.'
      ],
      valueProp: 'Un apoyo incondicional cuando necesitas ordenar tus pensamientos o recibir un respiro guiado.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'alert',
      viewMode: 'alert',
      badge: '6. Alerta Emocional',
      title: 'Primeros auxilios psicológicos y protocolo SOS',
      tagline: 'Un botón de rescate inmediato para momentos de angustia extrema, ataques de pánico o sobrecarga crítica.',
      color: 'text-rose-600',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      features: [
        'Protocolo de Primeros Auxilios Psicológicos (PAP) paso a paso para regular crisis en tiempo real.',
        'Directorio telefónico directo con líneas de ayuda gratuitas y de emergencia según tu país.',
        'Red personal de contactos de confianza para enviar avisos de apoyo con un solo toque.',
        'Ejercicios somáticos de choque (técnicas de anclaje, hielo, respiración de rescate) para bajar la hiperactivación.',
        'Acceso prioritario y visible en todo momento para garantizar tu seguridad emocional.'
      ],
      valueProp: 'Tu red de seguridad inmediata cuando la mente o el cuerpo entran en crisis aguda.',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'community',
      viewMode: 'community',
      badge: '7. Comunidad',
      title: 'Espacio seguro de desahogo, empatía y apoyo mutuo',
      tagline: 'Conecta con personas que atraviesan experiencias similares en un ambiente solidario y respetuoso.',
      color: 'text-teal-600',
      icon: <Users className="w-6 h-6 text-teal-600" />,
      features: [
        'Muros temáticos de desahogo y reflexión comunitaria (ansiedad, superación personal, hábitos sanos).',
        'Publicaciones anónimas o con seudónimo en un entorno protegido con moderación positiva.',
        'Reacciones cálidas y empáticas (abrazos virtuales, mensajes de aliento, validación emocional).',
        'Historias reales de superación compartidas por miembros de la comunidad.',
        'Sensación de pertenencia y recordatorio constante de que nunca estás solo en tu camino.'
      ],
      valueProp: 'Un punto de encuentro para compartir sin miedo, normalizar las emociones y recibir calidez humana.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const currentItem = interfacesList[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-200 flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-100 bg-[#fbf9f5]">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#548c71] bg-emerald-50 px-2.5 py-0.5 rounded-full ml-2 border border-emerald-200/60">
              Guía de Interfaces
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors cursor-pointer px-2 py-1"
          >
            Saltar y Explorar
          </button>
        </div>

        {/* SCREEN 1: PREGUNTA INICIAL "¿ES TU PRIMERA VEZ USANDO FLUXGLOW?" */}
        {modalState === 'ask_first_time' && (
          <div className="p-8 sm:p-12 text-center flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-3xl bg-[#eaf4ef] text-[#548c71] flex items-center justify-center mb-5 shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              ¿Es tu primera vez usando FluxGlow?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Te preparamos una explicación completa y clara de todo lo que te ofrece cada una de nuestras <strong>7 interfaces principales</strong> (guías, diario, misiones, análisis, IA, alerta y comunidad).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md">
              <button
                onClick={() => handleFirstTimeResponse(true)}
                className="bg-[#548c71] hover:bg-[#43705a] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Sí, es mi primera vez</span>
              </button>

              <button
                onClick={() => handleFirstTimeResponse(false)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200"
              >
                <span>No, ya la he usado</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: PREGUNTA SUBSECUENTE */}
        {modalState === 'ask_experienced_guide' && (
          <div className="p-8 sm:p-12 text-center flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 shadow-xs">
              <HelpCircle className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              ¿Deseas ver el recorrido completo por las 7 interfaces?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Conoce todo lo que incluye cada módulo: el nuevo catálogo de <strong>Prácticas al Instante</strong>, las <strong>Misiones Diarias</strong> de 3 a 5 minutos, el <strong>Diario con Notas de Voz</strong> y el <strong>Análisis Predictivo</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md">
              <button
                onClick={() => handleExperiencedGuideResponse(true)}
                className="bg-[#548c71] hover:bg-[#43705a] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sí, ver recorrido detallado</span>
              </button>

              <button
                onClick={() => handleExperiencedGuideResponse(false)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200"
              >
                <span>No, ingresar directamente</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: TUTORIAL EXPLICATIVO DE LAS 7 INTERFACES */}
        {modalState === 'tutorial' && (
          <>
            {/* Quick Horizontal Tab Bar for Direct Jumping */}
            <div className="px-4 sm:px-6 py-2.5 bg-[#f5f1eb] border-b border-stone-200/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              {interfacesList.map((item, idx) => {
                const isActive = currentStep === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#548c71] text-white shadow-xs'
                        : 'bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900 border border-stone-200/60'
                    }`}
                  >
                    <span>{idx + 1}. {item.id === 'learn' ? 'Explora y Aprende' : item.id === 'journal' ? 'Diario' : item.id === 'missions' ? 'Misiones' : item.id === 'analytics' ? 'Análisis' : item.id === 'ai' ? 'Flux AI' : item.id === 'alert' ? 'Alerta' : 'Comunidad'}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Left Side: Mockup Image & Direct Navigation */}
                <div className="w-full md:w-5/12 flex flex-col gap-3 shrink-0">
                  <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-stone-900 px-2.5 py-1 rounded-full shadow-xs">
                        {currentItem.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-semibold leading-snug line-clamp-2">
                        {currentItem.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Direct Link Button to that module */}
                  <button
                    onClick={() => handleJumpToSection(currentItem.viewMode)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-stone-200"
                  >
                    <span>Ir a {currentItem.badge} ahora</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                </div>

                {/* Right Side: Comprehensive Details */}
                <div className="flex-1 w-full text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-stone-100 shadow-2xs">
                      {currentItem.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#548c71]">
                        Interfaz {currentStep + 1} de {interfacesList.length}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                        {currentItem.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 mt-1 mb-4 leading-relaxed">
                    {currentItem.tagline}
                  </p>

                  {/* What it brings list */}
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#548c71]" />
                      <span>Todo lo que te trae este apartado:</span>
                    </p>
                    <ul className="space-y-2">
                      {currentItem.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#548c71] shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Value Prop Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs">
                    <p className="font-bold text-amber-900 text-[11px] mb-0.5">💡 ¿Para qué te sirve?</p>
                    <p className="text-stone-700 text-xs leading-relaxed">{currentItem.valueProp}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footer Controls */}
            <div className="px-6 py-3.5 border-t border-stone-100 bg-[#fbf9f5] flex items-center justify-between">
              
              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {interfacesList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentStep === idx 
                        ? 'w-6 bg-[#548c71]' 
                        : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Ir a la interfaz ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-3.5 py-2 rounded-full text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (currentStep < interfacesList.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      handleComplete();
                    }
                  }}
                  className="bg-[#548c71] hover:bg-[#43705a] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentStep === interfacesList.length - 1 ? '¡Comenzar a usar FluxGlow!' : 'Siguiente Interfaz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
