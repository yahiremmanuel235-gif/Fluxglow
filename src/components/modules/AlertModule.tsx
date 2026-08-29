import React, { useState } from 'react';
import { 
  Sparkles, 
  Bell, 
  ShieldAlert, 
  Phone, 
  Heart, 
  CheckCircle2, 
  Wind, 
  BookOpen, 
  Video, 
  UserCheck, 
  X, 
  AlertTriangle,
  Play,
  Volume2,
  CalendarCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { soundEngine } from '../../utils/audioSynth';
import { useToast } from '../common/Toast';

export const AlertModule: React.FC = () => {
  const { success, info } = useToast();
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'estable' | 'atencion' | 'moderado' | 'elevado'>('moderado');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');
  const [breathingCounter, setBreathingCounter] = useState(4);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(false);

  // Semáforo Status options
  const trafficLightLevels = [
    {
      id: 'estable',
      color: '#548c71',
      bgColor: '#e2eee6',
      borderColor: '#b2d5c3',
      title: 'Estable',
      desc: 'Estado emocional equilibrado y tranquilo.',
      alertText: 'Tu balance emocional se encuentra en niveles saludables.',
      alertBg: 'bg-[#e2eee6]',
      alertBorder: 'border-[#548c71]/40',
      alertTextCol: 'text-[#253d33]',
      recommendations: [
        'Mantén tu rutina de gratitud diaria.',
        'Continúa con tus 15 minutos de caminata al aire libre.',
        'Registra tus momentos de serenidad en el diario.',
        'Descanso reparador de 7-8 horas nocturnas.'
      ]
    },
    {
      id: 'atencion',
      color: '#d97706',
      bgColor: '#fef3c7',
      borderColor: '#fde68a',
      title: 'Atención',
      desc: 'Se detectan fluctuaciones emocionales leves.',
      alertText: 'Hemos registrado variaciones leves en tu estado de ánimo.',
      alertBg: 'bg-amber-50',
      alertBorder: 'border-amber-300',
      alertTextCol: 'text-amber-900',
      recommendations: [
        'Realiza pausas activas cada 2 horas de trabajo.',
        'Practica respiración consciente 4-4-4.',
        'Hidrátate y reduce el consumo excesivo de cafeína.',
        'Escribe en tu diario lo que te causó inquietud.'
      ]
    },
    {
      id: 'moderado',
      color: '#ea580c',
      bgColor: '#ffedd5',
      borderColor: '#fed7aa',
      title: 'Riesgo moderado',
      desc: 'Estrés o ansiedad frecuente en los últimos días.',
      alertText: 'Hemos identificado un aumento en los niveles de estrés en los últimos 5 días.',
      alertBg: 'bg-orange-50',
      alertBorder: 'border-orange-300',
      alertTextCol: 'text-orange-950',
      recommendations: [
        'Realizar una caminata de 15 minutos sin pantallas.',
        'Practicar la respiración guiada 4-4-4.',
        'Escuchar música relajante y sonidos armónicos.',
        'Dormir 7-8 horas diarias y desconectar de noche.'
      ]
    },
    {
      id: 'elevado',
      color: '#dc2626',
      bgColor: '#fee2e2',
      borderColor: '#fca5a5',
      title: 'Riesgo elevado',
      desc: 'Tensión acumulada. Se recomienda buscar apoyo.',
      alertText: 'Alerta prioritaria: Se recomienda tomar un descanso y contactar a un especialista.',
      alertBg: 'bg-rose-50',
      alertBorder: 'border-rose-300',
      alertTextCol: 'text-rose-950',
      recommendations: [
        'Detén tareas exigentes y realiza ejercicios de descarga.',
        'Contacta a tu psicólogo asignado o usa la línea SOS.',
        'Practica relajación muscular progresiva.',
        'Comparte cómo te sientes con una persona de confianza.'
      ]
    },
  ];

  const currentLevelData = trafficLightLevels.find(lvl => lvl.id === selectedRiskLevel) || trafficLightLevels[2];

  // 4-4-4 Breathing Cycle simulation
  const startBreathing444 = () => {
    setShowBreathingExercise(true);
    setBreathingPhase('Inhala');
    setBreathingCounter(4);
    soundEngine.playChime('bell');

    let phaseIndex = 0;
    const phases: ('Inhala' | 'Retén' | 'Exhala')[] = ['Inhala', 'Retén', 'Exhala'];

    const timer = setInterval(() => {
      setBreathingCounter((prev) => {
        if (prev <= 1) {
          phaseIndex = (phaseIndex + 1) % phases.length;
          setBreathingPhase(phases[phaseIndex]);
          soundEngine.playChime('bell');
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const toggleMusic = () => {
    const isPlaying = soundEngine.toggleAmbient('zen');
    setIsMusicActive(isPlaying);
    if (isPlaying) {
      success('Música relajante activada', 'Sonidos armónicos para calmar tu mente.');
    } else {
      info('Música pausada', 'Has detenido la reproducción ambiental.');
    }
  };

  const handleBookAppointment = () => {
    setShowContactModal(false);
    confetti({ particleCount: 30, spread: 50 });
    success('Solicitud enviada', 'La Dra. María López ha recibido tu solicitud de cita prioritaria.');
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-[#548c71] bg-[#e2eee6] border border-[#548c71]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#548c71]" />
            <span>Monitoreo Activo de Bienestar</span>
          </div>
        </div>

        {/* Big Display Title: Alerta Emocional Inteligente */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Alerta </span>
            <span className="text-[#de6943]">Emocional Inteligente</span>
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Detección temprana y sugerencias de bienestar personalizadas</p>
        </div>

        {/* Section: Semáforo Emocional */}
        <div className="mb-8">
          <h2 className="text-center text-sm font-bold text-stone-800 mb-3 font-serif uppercase tracking-wider">
            Semáforo Emocional Interactivo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {trafficLightLevels.map((lvl) => {
              const isSelected = selectedRiskLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  id={`semaforo-${lvl.id}`}
                  onClick={() => {
                    setSelectedRiskLevel(lvl.id as any);
                    info('Nivel seleccionado', `Mostrando recomendaciones para estado: ${lvl.title}`);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-stone-900 shadow-sm bg-white border-transparent'
                      : 'bg-white/90 hover:bg-white border-stone-200'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 shadow-2xs" 
                    style={{ backgroundColor: lvl.color }}
                  ></span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 leading-none mb-1">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-snug">
                      {lvl.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {/* CARD 1: Recomendaciones */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Recomendaciones
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: currentLevelData.bgColor, color: currentLevelData.color }}>
                  {currentLevelData.title}
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-[13px] text-stone-700">
                {currentLevelData.recommendations.map((rec, idx) => (
                  <li key={idx} className="pb-2.5 border-b border-stone-100 font-medium flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#548c71] shrink-0 mt-1.5"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={toggleMusic}
              className="mt-6 w-full bg-[#faf8f4] hover:bg-stone-100 border border-stone-200 text-stone-800 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#548c71]" />
              <span>{isMusicActive ? 'Música en Reproducción' : 'Activar Música Relajante'}</span>
            </button>
          </div>

          {/* CARD 2: Técnicas de relajación */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4 font-serif">
                Técnicas de relajación
              </h2>

              <div className="space-y-3.5 text-xs sm:text-[13px] text-stone-700">
                <div className="pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900">Respiración de 4-4-4:</h3>
                  <p className="text-stone-600 mt-0.5">Inhala 4 seg, retén 4 seg y exhala 4 seg.</p>
                </div>
                <div className="pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900">Meditación mindful:</h3>
                  <p className="text-stone-600 mt-0.5">Sesiones breves para calmar la mente.</p>
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-stone-900">Relajación muscular:</h3>
                  <p className="text-stone-600 mt-0.5">Libera la tensión acumulada de hombros y cuello.</p>
                </div>
              </div>
            </div>

            <button
              id="start-444-btn"
              onClick={startBreathing444}
              className="mt-6 w-full bg-[#548c71] hover:bg-[#43705a] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>Iniciar Respiración 4-4-4</span>
            </button>
          </div>

          {/* CARD 3: Recursos específicos */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4 font-serif">
                Recursos específicos
              </h2>

              <div className="space-y-4 text-xs sm:text-[13px] text-stone-700">
                <div className="pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#548c71]" />
                    Guías recomendadas:
                  </h3>
                  <p className="text-stone-600 mt-1 leading-snug">
                    Lecturas breves para entender y gestionar tus emociones.
                  </p>
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#de6943]" />
                    Videos de regulación:
                  </h3>
                  <p className="text-stone-600 mt-1 leading-snug">
                    Ejercicios y consejos en video para tu bienestar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900">
              <span className="font-bold">Línea SOS de Apoyo Gratuita:</span>
              <p className="font-bold text-sm text-stone-900 mt-0.5">800 911 2000</p>
            </div>
          </div>

          {/* COLUMN 4 (RIGHT): 2 Stacked Cards (Alerta Detectada & Contacto de emergencia) */}
          <div className="space-y-4 flex flex-col justify-between">
            
            {/* Top Alert Card (dynamically styled based on selected risk) */}
            <div className={`rounded-3xl border p-5 shadow-2xs transition-all ${currentLevelData.alertBg} ${currentLevelData.alertBorder}`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1.5" style={{ color: currentLevelData.color }}>
                <Bell className="w-4 h-4" />
                <span>Estado: {currentLevelData.title}</span>
              </div>
              <p className={`text-xs font-medium leading-relaxed ${currentLevelData.alertTextCol}`}>
                {currentLevelData.alertText}
              </p>
            </div>

            {/* Bottom White Card: Contacto de emergencia */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm text-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
                Contacto de emergencia
              </span>

              {/* Psychologist Avatar & Info */}
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-[#548c71] shadow-2xs bg-[#faf8f4] flex items-center justify-center">
                <img
                  src="/user.png"
                  alt="Dra. María López"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[11px] text-stone-500 font-semibold block">Psicóloga asignada</span>
              <h3 className="font-bold text-stone-900 text-sm">Dra. María López</h3>
              <p className="text-[11px] text-stone-600 mb-4">Especialista en Salud Mental</p>

              {/* Yellow/Amber Contact Button */}
              <button
                id="contact-therapist-now-btn"
                onClick={() => setShowContactModal(true)}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-stone-950 font-bold py-2.5 rounded-full text-xs shadow-2xs transition-all hover:scale-102 cursor-pointer"
              >
                Contactar ahora
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 4-4-4 Guided Breathing Modal */}
      {showBreathingExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scaleUp border border-stone-200">
            <div className="flex justify-end">
              <button onClick={() => setShowBreathingExercise(false)} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              Respiración Consciente 4-4-4
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Sigue el ritmo en pantalla para equilibrar tu sistema nervioso
            </p>

            <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathingPhase === 'Inhala' 
                    ? 'bg-[#e2eee6] scale-110' 
                    : breathingPhase === 'Retén' 
                    ? 'bg-amber-100 scale-105' 
                    : 'bg-emerald-100/60 scale-90'
                }`}
              />
              <div className="relative z-10">
                <p className="text-xl font-extrabold text-stone-800">{breathingPhase}</p>
                <p className="text-4xl font-black text-[#548c71]">{breathingCounter}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBreathingExercise(false)}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors"
            >
              Cerrar Ejercicio
            </button>
          </div>
        </div>
      )}

      {/* Psychologist Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-scaleUp border border-stone-200">
            <div className="flex justify-end">
              <button onClick={() => setShowContactModal(false)} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-[#548c71] bg-[#faf8f4] flex items-center justify-center">
              <img
                src="/user.png"
                alt="Dra. María López"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-serif text-xl font-bold text-stone-900">Dra. María López</h3>
            <p className="text-xs text-stone-500 mb-4">Cédula Prof. 948291 • Psicología Clínica y Cognitiva</p>

            <div className="space-y-2.5 mb-6">
              <a
                href="tel:8009112000"
                className="w-full bg-[#548c71] hover:bg-[#43705a] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Consulta Inmediata</span>
              </a>

              <button
                onClick={handleBookAppointment}
                className="w-full bg-[#faf8f4] hover:bg-stone-100 border border-stone-200 text-stone-800 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#548c71]" />
                <span>Agendar Sesión Online</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              Atención confidencial 24 horas para usuarios de FluxGlow.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

