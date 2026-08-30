import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Wind, 
  Clock, 
  Eye, 
  Heart, 
  Flame, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstantPracticeItem } from '../../types';
import { soundEngine } from '../../utils/audioSynth';
import { FluxGlowLogo } from '../common/FluxGlowLogo';

interface InstantPracticeModalProps {
  practice: InstantPracticeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InstantPracticeModal: React.FC<InstantPracticeModalProps> = ({
  practice,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !practice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-100 bg-[#fbf9f5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#548c71] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              ⚡ Práctica al Instante
            </span>
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">
              • {practice.duration}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Cerrar práctica"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col">
          
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {practice.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
              {practice.shortDesc}
            </p>
          </div>

          {/* Switch by practice type */}
          {practice.type === 'breathing' && <BreathingOasisEngine />}
          {practice.type === 'focus_timer' && <FocusTimerEngine />}
          {practice.type === 'grounding' && <GroundingEngine />}
          {practice.type === 'stress_release' && <StressReleaseEngine />}
          {practice.type === 'gratitude_express' && <GratitudeExpressEngine />}

        </div>

      </div>
    </div>
  );
};

/* 1. BREATHING OASIS ENGINE */
const BreathingOasisEngine: React.FC = () => {
  const [technique, setTechnique] = useState<'478' | 'box' | 'physio'>('physio');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'inhale2' | 'hold' | 'exhale'>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Technique timing configuration (in seconds)
  const configs = {
    physio: {
      name: 'Suspiro Fisiológico',
      desc: '2 inhalaciones nasales + 1 exhalación larga bucal. Alivio inmediato del estrés.',
      inhale: 2,
      inhale2: 1,
      hold: 0,
      exhale: 5,
      total: 8
    },
    '478': {
      name: 'Respiración 4-7-8',
      desc: 'Técnica de relajación profunda y regulación parasimpática para la noche.',
      inhale: 4,
      inhale2: 0,
      hold: 7,
      exhale: 8,
      total: 19
    },
    box: {
      name: 'Respiración Cuadrada (Box)',
      desc: '4s en cada fase. Potencia el enfoque y balancea el sistema nervioso.',
      inhale: 4,
      inhale2: 0,
      hold: 4,
      exhale: 4,
      hold2: 4,
      total: 16
    }
  };

  const currentConfig = configs[technique];

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setPhaseSeconds((prev) => {
          const nextSec = prev + 1;
          
          if (technique === 'physio') {
            if (phase === 'inhale' && nextSec >= currentConfig.inhale) {
              setPhase('inhale2');
              if (soundEnabled) soundEngine.playBell(580, 1.2);
              return 0;
            } else if (phase === 'inhale2' && nextSec >= currentConfig.inhale2) {
              setPhase('exhale');
              if (soundEnabled) soundEngine.playBell(432, 2);
              return 0;
            } else if (phase === 'exhale' && nextSec >= currentConfig.exhale) {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              if (soundEnabled) soundEngine.playBell(528, 1.5);
              return 0;
            }
          } else if (technique === '478') {
            if (phase === 'inhale' && nextSec >= currentConfig.inhale) {
              setPhase('hold');
              if (soundEnabled) soundEngine.playBell(480, 1.5);
              return 0;
            } else if (phase === 'hold' && nextSec >= currentConfig.hold) {
              setPhase('exhale');
              if (soundEnabled) soundEngine.playBell(396, 2.5);
              return 0;
            } else if (phase === 'exhale' && nextSec >= currentConfig.exhale) {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              if (soundEnabled) soundEngine.playBell(528, 1.5);
              return 0;
            }
          } else if (technique === 'box') {
            if (phase === 'inhale' && nextSec >= currentConfig.inhale) {
              setPhase('hold');
              if (soundEnabled) soundEngine.playBell(480, 1.2);
              return 0;
            } else if (phase === 'hold' && nextSec >= currentConfig.hold) {
              setPhase('exhale');
              if (soundEnabled) soundEngine.playBell(432, 1.5);
              return 0;
            } else if (phase === 'exhale' && nextSec >= currentConfig.exhale) {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              if (soundEnabled) soundEngine.playBell(528, 1.5);
              return 0;
            }
          }
          return nextSec;
        });
      }, 1000);
    } else {
      setPhaseSeconds(0);
      setPhase('inhale');
    }
    return () => clearInterval(timer);
  }, [isActive, phase, technique, soundEnabled]);

  const handleToggleActive = () => {
    if (!isActive) {
      setIsActive(true);
      if (soundEnabled) soundEngine.playBell(528, 2);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setPhaseSeconds(0);
    setCyclesCompleted(0);
  };

  // Phase labels and visual size
  let phaseLabel = 'Inhala profundamente';
  let phaseSub = 'Por la nariz...';
  let circleScale = 'scale-100';
  let circleBg = 'bg-[#548c71]';

  if (phase === 'inhale') {
    phaseLabel = 'Inhala';
    phaseSub = technique === 'physio' ? 'Inhalación profunda por la nariz' : 'Llena tus pulmones con calma';
    circleScale = 'scale-125';
    circleBg = 'bg-[#548c71]';
  } else if (phase === 'inhale2') {
    phaseLabel = '¡Inhala un extra!';
    phaseSub = 'Segunda inhalación corta para expandir alvéolos';
    circleScale = 'scale-135';
    circleBg = 'bg-[#43705a]';
  } else if (phase === 'hold') {
    phaseLabel = 'Sostén el aire';
    phaseSub = 'Permanece en quietud y relajación';
    circleScale = 'scale-125';
    circleBg = 'bg-amber-600';
  } else if (phase === 'exhale') {
    phaseLabel = 'Exhala despacio';
    phaseSub = 'Suelta todo el aire por la boca lentamente';
    circleScale = 'scale-90';
    circleBg = 'bg-[#de6943]';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Technique Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {[
          { id: 'physio', label: '🫁 Suspiro Fisiológico' },
          { id: '478', label: '🌙 Respiración 4-7-8' },
          { id: 'box', label: '🟦 Respiración Cuadrada' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTechnique(t.id as any);
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              technique === t.id
                ? 'bg-[#548c71] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-stone-500 text-center max-w-sm mb-6">
        {currentConfig.desc}
      </p>

      {/* Animated Breathing Visualizer Circle */}
      <div className="relative w-56 h-56 flex items-center justify-center my-4">
        {/* Outer pulsating glow rings */}
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 opacity-20 ${circleBg} ${isActive ? 'animate-ping' : ''}`}></div>
        <div className={`absolute inset-3 rounded-full transition-all duration-1000 opacity-30 ${circleBg}`}></div>
        
        {/* Main Central Circle */}
        <div className={`w-40 h-40 rounded-full ${circleBg} text-white flex flex-col items-center justify-center shadow-xl transition-all duration-1000 ${isActive ? circleScale : 'scale-100'}`}>
          <Wind className="w-7 h-7 mb-1 opacity-90" />
          <span className="font-serif font-bold text-lg text-center px-2">
            {isActive ? phaseLabel : '¿Listo?'}
          </span>
          {isActive && (
            <span className="text-xs font-mono font-semibold opacity-90 mt-0.5">
              {phaseSeconds}s
            </span>
          )}
        </div>
      </div>

      <p className="text-xs font-medium text-stone-600 text-center mt-2 mb-6 min-h-[20px]">
        {isActive ? phaseSub : 'Pulsa "Comenzar" para iniciar la guía rítmica'}
      </p>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleActive}
          className={`px-6 py-3 rounded-full text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#548c71] hover:bg-[#43705a]'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isActive ? 'Pausar' : 'Comenzar Respiración'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-full transition-colors cursor-pointer ${
            soundEnabled ? 'bg-emerald-100 text-[#548c71]' : 'bg-stone-100 text-stone-400'
          }`}
          title={soundEnabled ? 'Silenciar campana' : 'Activar campana'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {cyclesCompleted > 0 && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#548c71] font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{cyclesCompleted} {cyclesCompleted === 1 ? 'ciclo completado' : 'ciclos completados'}</span>
        </div>
      )}
    </div>
  );
};

/* 2. FOCUS TIMER ENGINE */
const FocusTimerEngine: React.FC = () => {
  const [mode, setMode] = useState<3 | 5 | 25>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(mode * 60);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let timer: any;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            soundEngine.playBell(528, 4);
            confetti({ particleCount: 60, spread: 60 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = mode * 60;
  const progressPercent = ((totalSecs - secondsLeft) / totalSecs) * 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-6">
        {[
          { m: 3, label: '☕ Pausa 3 min' },
          { m: 5, label: '🌿 Micro-Break 5 min' },
          { m: 25, label: '🎯 Enfoque 25 min' },
        ].map((item) => (
          <button
            key={item.m}
            onClick={() => setMode(item.m as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === item.m
                ? 'bg-[#548c71] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Circular Progress Display */}
      <div className="relative w-48 h-48 flex items-center justify-center my-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-stone-200"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-[#548c71] transition-all duration-500"
            strokeWidth="6"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-stone-900">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-1">
            {isRunning ? 'En progreso...' : secondsLeft === 0 ? '¡Tiempo cumplido!' : 'En pausa'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => {
            if (!isRunning) soundEngine.playBell(528, 2);
            setIsRunning(!isRunning);
          }}
          className="bg-[#548c71] hover:bg-[#43705a] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isRunning ? 'Pausar' : 'Iniciar Temporizador'}</span>
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(mode * 60);
          }}
          className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* 3. GROUNDING ENGINE 5-4-3-2-1 */
const GroundingEngine: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const steps = [
    {
      num: 5,
      title: '5 Cosas que puedes ver',
      desc: 'Mira a tu alrededor. Nombra mentalmente o en voz alta 5 objetos detallados (ej. el borde de una ventana, el color de una planta, la textura de una mesa).',
      icon: <Eye className="w-6 h-6 text-[#548c71]" />,
      items: ['Objeto 1', 'Objeto 2', 'Objeto 3', 'Objeto 4', 'Objeto 5']
    },
    {
      num: 4,
      title: '4 Cosas que puedes tocar',
      desc: 'Siente la textura de tu ropa, la firmeza del suelo bajo tus pies, el calor de tus manos o la superficie donde estás sentado.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#de6943]" />,
      items: ['Sensación 1', 'Sensación 2', 'Sensación 3', 'Sensación 4']
    },
    {
      num: 3,
      title: '3 Cosas que puedes escuchar',
      desc: 'Cierra los ojos un instante y afina tu oído. ¿Un zumbido lejano, el viento, tu propia respiración o pasos?',
      icon: <Volume2 className="w-6 h-6 text-amber-600" />,
      items: ['Sonido 1', 'Sonido 2', 'Sonido 3']
    },
    {
      num: 2,
      title: '2 Cosas que puedes oler o saborear',
      desc: 'Percibe el aroma del ambiente o recuerda tu olor reconfortante favorito (café, lluvia, lavanda).',
      icon: <Wind className="w-6 h-6 text-teal-600" />,
      items: ['Aroma 1', 'Aroma 2']
    },
    {
      num: 1,
      title: '1 Cosa buena por la que estás agradecido',
      desc: 'Reconoce un motivo de gratitud honesto en este instante (estar a salvo, tu propia resiliencia, alguien que quieres).',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      items: ['Mi motivo de gratitud']
    }
  ];

  const stepData = steps[currentStep];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      confetti({ particleCount: 70, spread: 70 });
      soundEngine.playBell(528, 3);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full transition-all ${
              idx <= currentStep ? 'bg-[#548c71]' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      <div className="bg-[#fbf9f5] border border-stone-200 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white rounded-2xl shadow-2xs">
            {stepData.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#548c71] bg-emerald-50 px-2 py-0.5 rounded-md">
              Paso {currentStep + 1} de 5
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
              {stepData.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
          {stepData.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stepData.items.map((item, idx) => {
            const key = `step-${currentStep}-${idx}`;
            const isChecked = !!checkedItems[key];
            return (
              <button
                key={key}
                onClick={() => toggleCheck(key)}
                className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all flex items-center justify-between border cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{item}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  isChecked ? 'bg-[#548c71] border-[#548c71] text-white' : 'border-stone-300'
                }`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-full text-xs font-bold text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
        >
          Anterior
        </button>

        <button
          onClick={handleNext}
          className="bg-[#548c71] hover:bg-[#43705a] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{currentStep === steps.length - 1 ? '¡Anclaje Completado!' : 'Siguiente Paso'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* 4. STRESS RELEASE ENGINE */
const StressReleaseEngine: React.FC = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [released, setReleased] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  const startHold = () => {
    if (released) setReleased(false);
    setIsHolding(true);
    setHoldProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          setReleased(true);
          soundEngine.playBell(528, 3.5);
          confetti({ particleCount: 70, spread: 75 });
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  const stopHold = () => {
    if (holdProgress < 100) {
      clearInterval(holdIntervalRef.current);
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-4">
      {!released ? (
        <>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mb-6">
            Mantén presionado el botón central durante 3 segundos. Al hacerlo, suelta los hombros, relaja la mandíbula y exhala profundamente.
          </p>

          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Pulsating hold progress ring */}
            <div 
              className="absolute inset-0 rounded-full bg-[#de6943]/20 transition-all duration-75"
              style={{ transform: `scale(${1 + holdProgress / 200})` }}
            />

            <button
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className={`w-36 h-36 rounded-full text-white font-bold text-sm shadow-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                isHolding ? 'bg-[#cb512e] shadow-2xl ring-4 ring-[#de6943]/40' : 'bg-[#de6943] hover:bg-[#cb512e]'
              }`}
            >
              <Flame className="w-8 h-8 mb-1 fill-white" />
              <span>{isHolding ? `${Math.round(holdProgress)}%` : 'Mantén Presionado'}</span>
            </button>
          </div>

          <p className="text-xs font-semibold text-stone-500 mt-6">
            {isHolding ? 'Soltando tensión... no lo sueltes todavía' : 'Presiona y mantén para descomprimir'}
          </p>
        </>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-3xl animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-emerald-100 text-[#548c71] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
            ¡Tensión Liberada!
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
            "Has tomado una pausa consciente. Tu cuerpo está a salvo en este momento y no tienes que resolverlo todo de inmediato."
          </p>
          <button
            onClick={() => setReleased(false)}
            className="mt-6 bg-[#548c71] hover:bg-[#43705a] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Hacer otra pausa
          </button>
        </div>
      )}
    </div>
  );
};

/* 5. GRATITUDE EXPRESS ENGINE */
const GratitudeExpressEngine: React.FC = () => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    soundEngine.playBell(528, 3);
    confetti({ particleCount: 60, spread: 65 });
  };

  return (
    <div className="flex flex-col">
      {!isSaved ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              1. Un momento o detalle pequeño que te dio tranquilidad hoy:
            </label>
            <input
              type="text"
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="Ej. El café de la mañana, un mensaje amable..."
              className="w-full bg-[#fbf9f5] border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#548c71]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              2. Una persona o apoyo por el cual sientes agradecimiento:
            </label>
            <input
              type="text"
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              placeholder="Ej. Un amigo, mi familia, un compañero de trabajo..."
              className="w-full bg-[#fbf9f5] border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#548c71]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              3. Algo bueno que hiciste por ti mismo hoy:
            </label>
            <input
              type="text"
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              placeholder="Ej. Descansar 10 min, comer bien, poner un límite..."
              className="w-full bg-[#fbf9f5] border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#548c71]"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-4 bg-[#548c71] hover:bg-[#43705a] text-white py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Guardar Gratitud y Recargar Energía</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-3xl text-center animate-in zoom-in-95 duration-200">
          <Smile className="w-12 h-12 text-[#548c71] mx-auto mb-3" />
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
            ¡Gratitud Registrada!
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
            Apreciar lo bueno entrena a tu cerebro para detectar recursos y bienestar en tu vida diaria.
          </p>
          <button
            onClick={() => {
              setIsSaved(false);
              setQ1('');
              setQ2('');
              setQ3('');
            }}
            className="mt-6 bg-[#548c71] text-white px-6 py-2 rounded-full text-xs font-bold cursor-pointer"
          >
            Escribir otra reflexión
          </button>
        </div>
      )}
    </div>
  );
};
