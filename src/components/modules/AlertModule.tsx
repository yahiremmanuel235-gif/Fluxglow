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
  Volume2
} from 'lucide-react';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { soundEngine } from '../../utils/audioSynth';

export const AlertModule: React.FC = () => {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'estable' | 'atencion' | 'moderado' | 'elevado'>('moderado');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');
  const [breathingCounter, setBreathingCounter] = useState(4);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(false);

  // Semáforo Status options matching Image 6
  const trafficLightLevels = [
    {
      id: 'estable',
      color: '#22c55e',
      bgColor: '#dcfce7',
      borderColor: '#86efac',
      title: 'Estable',
      desc: 'Estado emocional equilibrado.'
    },
    {
      id: 'atencion',
      color: '#eab308',
      bgColor: '#fef9c3',
      borderColor: '#fde047',
      title: 'Atención',
      desc: 'Se detectan cambios emocionales leves.'
    },
    {
      id: 'moderado',
      color: '#f97316',
      bgColor: '#ffedd5',
      borderColor: '#fdba74',
      title: 'Riesgo moderado',
      desc: 'Estrés o ansiedad frecuente.'
    },
    {
      id: 'elevado',
      color: '#ef4444',
      bgColor: '#fee2e2',
      borderColor: '#fca5a5',
      title: 'Riesgo elevado',
      desc: 'Se recomienda buscar apoyo.'
    },
  ];

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
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Monitoreo Activo de Alertas</span>
          </div>
        </div>

        {/* Big Display Title: Alerta Emocional Inteligente */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#5a8c72]">Alerta </span>
            <span className="text-[#e07a52]">Emocional Inteligente</span>
          </h1>
        </div>

        {/* Section: Semáforo Emocional from Image 6 */}
        <div className="mb-8">
          <h2 className="text-center text-lg sm:text-xl font-bold text-stone-800 mb-4 font-serif">
            Semáforo Emocional
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {trafficLightLevels.map((lvl) => {
              const isSelected = selectedRiskLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  id={`semaforo-${lvl.id}`}
                  onClick={() => setSelectedRiskLevel(lvl.id as any)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'ring-2 ring-stone-900 shadow-sm bg-white'
                      : 'bg-white/80 hover:bg-white border-stone-200'
                  }`}
                  style={{ borderColor: isSelected ? lvl.color : '#e7e5e4' }}
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

        {/* Main 4-Column Grid from Image 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {/* CARD 1: Recomendaciones */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4 font-serif">
                Recomendaciones
              </h2>

              <ul className="space-y-3.5 text-xs sm:text-[13px] text-stone-700">
                <li className="pb-3 border-b-2 border-emerald-500 font-medium">
                  Realizar una caminata de 15 minutos .
                </li>
                <li className="pb-3 border-b-2 border-emerald-500 font-medium">
                  Practicar respiración profunda.
                </li>
                <li className="pb-3 border-b-2 border-emerald-500 font-medium">
                  Escuchar música relajante.
                </li>
                <li className="font-medium pt-1">
                  Dormir 7-8 horas diarias.
                </li>
              </ul>
            </div>

            <button
              onClick={toggleMusic}
              className="mt-6 w-full bg-[#f4efe8] hover:bg-[#eae3d9] text-stone-800 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-[#5a8c72]" />
              <span>{isMusicActive ? 'Música en Reproducción' : 'Activar Música Relajante'}</span>
            </button>
          </div>

          {/* CARD 2: Técnicas de relajación */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4 font-serif">
                Técnicas de relajación
              </h2>

              <div className="space-y-3.5 text-xs sm:text-[13px] text-stone-700">
                <div className="pb-3 border-b-2 border-emerald-500">
                  <h3 className="font-bold text-stone-900">Respiración de 4-4-4:</h3>
                  <p className="text-stone-600 mt-0.5">Inhala 4 seg, retén 4 seg y exhala 4 seg.</p>
                </div>
                <div className="pb-3 border-b-2 border-emerald-500">
                  <h3 className="font-bold text-stone-900">Meditación:</h3>
                  <p className="text-stone-600 mt-0.5">Sesiones de meditación para calmar la mente.</p>
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-stone-900">Relajación muscular progresiva:</h3>
                  <p className="text-stone-600 mt-0.5">Libera la tensión acumulada de tu cuerpo.</p>
                </div>
              </div>
            </div>

            <button
              id="start-444-btn"
              onClick={startBreathing444}
              className="mt-6 w-full bg-[#5a8c72] hover:bg-[#48725c] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Wind className="w-4 h-4" />
              <span>Iniciar Respiración 4-4-4</span>
            </button>
          </div>

          {/* CARD 3: Recursos específicos */}
          <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-4 font-serif">
                Recursos específicos
              </h2>

              <div className="space-y-4 text-xs sm:text-[13px] text-stone-700">
                <div className="pb-3 border-b-2 border-emerald-500">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#5a8c72]" />
                    Guías recomendadas:
                  </h3>
                  <p className="text-stone-600 mt-1 leading-snug">
                    Lectura para entender y aprender a manejar tus emociones.
                  </p>
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#e07a52]" />
                    Videos de manejo de estrés:
                  </h3>
                  <p className="text-stone-600 mt-1 leading-snug">
                    Ejercicios y consejos en video para tu bienestar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <span className="font-bold">Línea SOS de Emergencia Gratuita:</span>
              <p className="font-bold text-sm text-stone-900 mt-0.5">800 911 2000</p>
            </div>
          </div>

          {/* COLUMN 4 (RIGHT): 2 Stacked Cards (Alerta Detectada & Contacto de emergencia) */}
          <div className="space-y-4 flex flex-col justify-between">
            
            {/* Top Red Card: Alerta detectada */}
            <div className="bg-[#fed7d7] rounded-3xl border-2 border-red-400 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-red-800 font-extrabold text-sm mb-1.5">
                <Bell className="w-4 h-4 fill-red-600 text-red-600 animate-bounce" />
                <span>Alerta detectada</span>
              </div>
              <p className="text-xs text-red-900 font-medium leading-relaxed">
                Hemos identificado un aumento en los niveles de estrés en los últimos 5 días.
              </p>
            </div>

            {/* Bottom White Card: Contacto de emergencia */}
            <div className="bg-white rounded-3xl border-2 border-stone-300 p-5 shadow-sm text-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
                Contacto de emergencia
              </span>

              {/* Psychologist Avatar & Info */}
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-[#5a8c72] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1594824813590-798b671a5c69?w=400&auto=format&fit=crop&q=80"
                  alt="Dra. María López"
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[11px] text-stone-500 font-semibold block">Psicólogo asignado</span>
              <h3 className="font-bold text-stone-900 text-sm">Dra. María López</h3>
              <p className="text-[11px] text-stone-600 mb-4">Especialista en salud mental</p>

              {/* Bright Yellow / Gold Button from Image 6 */}
              <button
                id="contact-therapist-now-btn"
                onClick={() => setShowContactModal(true)}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-stone-950 font-bold py-2.5 rounded-full text-xs shadow-xs transition-all hover:scale-105"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-scaleUp">
            <div className="flex justify-end">
              <button onClick={() => setShowBreathingExercise(false)} className="text-stone-400 hover:text-stone-700">
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
                    ? 'bg-[#5a8c72]/30 scale-110' 
                    : breathingPhase === 'Retén' 
                    ? 'bg-amber-300/40 scale-105' 
                    : 'bg-blue-300/30 scale-90'
                }`}
              />
              <div className="relative z-10">
                <p className="text-xl font-extrabold text-stone-800">{breathingPhase}</p>
                <p className="text-4xl font-black text-[#5a8c72]">{breathingCounter}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBreathingExercise(false)}
              className="w-full bg-stone-900 text-white py-2.5 rounded-full text-xs font-bold"
            >
              Cerrar Ejercicio
            </button>
          </div>
        </div>
      )}

      {/* Psychologist Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-scaleUp">
            <div className="flex justify-end">
              <button onClick={() => setShowContactModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-[#5a8c72]">
              <img
                src="https://images.unsplash.com/photo-1594824813590-798b671a5c69?w=400&auto=format&fit=crop&q=80"
                alt="Dra. María López"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-serif text-xl font-bold text-stone-900">Dra. María López</h3>
            <p className="text-xs text-stone-500 mb-4">Cédula Prof. 948291 • Psicología Clínica y Cognitiva</p>

            <div className="space-y-2 mb-6">
              <a
                href="tel:8009112000"
                className="w-full bg-[#5a8c72] hover:bg-[#48725c] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Consulta Inmediata</span>
              </a>

              <button
                onClick={() => {
                  alert('Solicitud de cita prioritaria enviada a la Dra. María López.');
                  setShowContactModal(false);
                }}
                className="w-full bg-[#f4efe8] hover:bg-[#eae3d9] text-stone-800 py-3 rounded-xl font-bold text-xs"
              >
                Agendar Sesión Online
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
