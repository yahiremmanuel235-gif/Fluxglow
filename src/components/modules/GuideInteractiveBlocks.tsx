import React, { useState, useEffect } from 'react';
import { 
  GuideBlock, 
  GuideAuthor, 
  GuideReference,
  GuideItem 
} from '../../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Timer, 
  Zap, 
  Split, 
  Quote, 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  Check, 
  HelpCircle,
  FileText,
  User,
  Heart
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface GuideInteractiveBlocksProps {
  guide: GuideItem;
  onClaimXp?: (amount: number, reason: string) => void;
  onAcceptMission?: (mission: any) => void;
}

export const GuideInteractiveBlocks: React.FC<GuideInteractiveBlocksProps> = ({
  guide,
  onClaimXp,
  onAcceptMission
}) => {
  const { success, info } = useToast();

  // State for Quizzes
  const [selectedAnswers, setSelectedAnswers] = useState<{ [blockId: string]: string }>({});
  
  // State for Reflections
  const [reflections, setReflections] = useState<{ [blockId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem(`fluxglow_reflection_${guide.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedReflectionNotice, setSavedReflectionNotice] = useState<{ [blockId: string]: boolean }>({});

  // State for Timers
  const [activeTimerBlockId, setActiveTimerBlockId] = useState<string | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<{ [blockId: string]: number }>({});
  const [timerRunning, setTimerRunning] = useState<{ [blockId: string]: boolean }>({});
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Sostén' | 'Exhala' | 'Pausa'>('Inhala');

  // State for Conditionals (active tab per conditional block)
  const [activeConditionTab, setActiveConditionTab] = useState<{ [blockId: string]: 'A' | 'B' }>({});

  // State for Event Triggers (completed status)
  const [claimedEvents, setClaimedEvents] = useState<{ [blockId: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem(`fluxglow_triggers_${guide.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State for Accepted missions from block
  const [acceptedBlockMissions, setAcceptedBlockMissions] = useState<{ [missionId: string]: boolean }>({});

  // Timer Tick Effect
  useEffect(() => {
    const runningId = Object.keys(timerRunning).find(id => timerRunning[id]);
    if (!runningId) return;

    const interval = setInterval(() => {
      setTimerSecondsLeft(prev => {
        const current = prev[runningId] ?? 60;
        if (current <= 1) {
          // Finished
          setTimerRunning(r => ({ ...r, [runningId]: false }));
          success('¡Pausa completada!', 'Excelente trabajo. Tu mente y cuerpo te lo agradecen.');
          return { ...prev, [runningId]: 0 };
        }
        return { ...prev, [runningId]: current - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, success]);

  // Breathing animation phase
  useEffect(() => {
    const isAnyRunning = Object.values(timerRunning).some(Boolean);
    if (!isAnyRunning) return;

    const phaseInterval = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'Inhala') return 'Sostén';
        if (prev === 'Sostén') return 'Exhala';
        if (prev === 'Exhala') return 'Pausa';
        return 'Inhala';
      });
    }, 4000);

    return () => clearInterval(phaseInterval);
  }, [timerRunning]);

  const handleSelectQuizOption = (blockId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [blockId]: optionId }));
  };

  const handleSaveReflection = (blockId: string) => {
    try {
      localStorage.setItem(`fluxglow_reflection_${guide.id}`, JSON.stringify(reflections));
      setSavedReflectionNotice(prev => ({ ...prev, [blockId]: true }));
      success('Reflexión guardada', 'Tu nota ha sido almacenada de forma privada en tu dispositivo.');
      setTimeout(() => {
        setSavedReflectionNotice(prev => ({ ...prev, [blockId]: false }));
      }, 3500);
    } catch {}
  };

  const handleToggleTimer = (block: GuideBlock) => {
    const currentRunning = timerRunning[block.id];
    if (currentRunning) {
      setTimerRunning(prev => ({ ...prev, [block.id]: false }));
    } else {
      if (timerSecondsLeft[block.id] === undefined || timerSecondsLeft[block.id] === 0) {
        setTimerSecondsLeft(prev => ({ ...prev, [block.id]: (block.durationMinutes || 1) * 60 }));
      }
      setTimerRunning(prev => ({ ...prev, [block.id]: true }));
    }
  };

  const handleResetTimer = (block: GuideBlock) => {
    setTimerRunning(prev => ({ ...prev, [block.id]: false }));
    setTimerSecondsLeft(prev => ({ ...prev, [block.id]: (block.durationMinutes || 1) * 60 }));
  };

  const handleClaimTrigger = (block: GuideBlock) => {
    if (claimedEvents[block.id]) return;
    const xp = block.rewardXp || 25;
    const next = { ...claimedEvents, [block.id]: true };
    setClaimedEvents(next);
    try {
      localStorage.setItem(`fluxglow_triggers_${guide.id}`, JSON.stringify(next));
    } catch {}

    success(`+${xp} XP Conseguidos`, `Has completado el hito "${block.triggerLabel || 'Sección'}"`);
    onClaimXp?.(xp, block.triggerLabel || 'Sección completada');
  };

  const blocks = guide.blocks;

  // Si no tiene bloques interactivos, fallback a secciones regulares
  if (!blocks || blocks.length === 0) {
    return (
      <div className="space-y-6">
        {guide.explainedContent.map((sec, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-sand-300 shadow-2xs space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#EBF1EA] text-[#3E6855] text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{sec.heading}</span>
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {sec.text}
            </p>
            {sec.bulletPoints && sec.bulletPoints.length > 0 && (
              <ul className="space-y-2 pt-2 border-t border-brand-sand-200">
                {sec.bulletPoints.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B] mt-2 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* RENDERIZADO DE BLOQUES DIDÁCTICOS */}
      {blocks.map((block, idx) => {
        
        // 1. TEXTO / MARKDOWN
        if (block.type === 'text') {
          return (
            <div key={block.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-sand-300 shadow-2xs space-y-3">
              {block.level === 'h1' && (
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight">
                  {block.content}
                </h2>
              )}
              {block.level === 'h2' && (
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EBF1EA] text-[#3E6855] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{block.content}</span>
                </h3>
              )}
              {block.level === 'h3' && (
                <h4 className="text-base sm:text-lg font-bold text-stone-800 font-serif">
                  {block.content}
                </h4>
              )}
              {(!block.level || block.level === 'paragraph') && (
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {block.content}
                </p>
              )}

              {block.listType === 'bullet' && block.listItems && (
                <ul className="space-y-2 pt-2 border-t border-brand-sand-200">
                  {block.listItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B] mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {block.listType === 'numbered' && block.listItems && (
                <ol className="space-y-2 pt-2 border-t border-brand-sand-200">
                  {block.listItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <span className="font-bold text-[#5F927B] text-xs mt-0.5">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        }

        // 2. IMAGEN INTERMEDIA
        if (block.type === 'image' && block.imageUrl) {
          return (
            <div key={block.id} className="bg-white rounded-3xl overflow-hidden border border-brand-sand-300 shadow-2xs">
              <div className="w-full max-h-96 overflow-hidden bg-stone-100">
                <img 
                  src={block.imageUrl} 
                  alt={block.imageCaption || 'Ilustración didáctica'} 
                  className="w-full h-full object-cover"
                />
              </div>
              {block.imageCaption && (
                <p className="text-xs text-stone-600 p-3 bg-stone-50 border-t border-stone-100 text-center font-serif italic">
                  {block.imageCaption}
                </p>
              )}
            </div>
          );
        }

        // 3. CITA / CALLOUT DESTACADO
        if (block.type === 'callout') {
          const themeStyles = {
            sage: 'bg-[#EBF1EA]/80 border-[#C5DDD0] text-[#2C4A3E]',
            terracotta: 'bg-orange-50 border-orange-200 text-amber-950',
            sand: 'bg-amber-50/70 border-amber-200 text-stone-900',
            lavender: 'bg-purple-50 border-purple-200 text-purple-950'
          };
          const activeStyle = themeStyles[block.calloutTheme || 'sage'];

          return (
            <div key={block.id} className={`rounded-3xl p-5 sm:p-6 border shadow-2xs ${activeStyle} flex items-start gap-3.5`}>
              <span className="text-2xl shrink-0 select-none">{block.calloutIcon || '💡'}</span>
              <div className="space-y-1">
                {block.calloutTitle && (
                  <h4 className="font-bold text-sm sm:text-base font-serif">
                    {block.calloutTitle}
                  </h4>
                )}
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  {block.calloutText}
                </p>
              </div>
            </div>
          );
        }

        // 4. QUIZ INTERACTIVO
        if (block.type === 'quiz') {
          const chosen = selectedAnswers[block.id];
          const chosenOption = block.options?.find(o => o.id === chosen);

          return (
            <div key={block.id} className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-indigo-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Quiz de Comprensión</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                {block.question}
              </h4>

              <div className="space-y-2.5">
                {(block.options || []).map((opt) => {
                  const isSelected = chosen === opt.id;
                  let btnColor = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                  if (chosen) {
                    if (opt.isCorrect) {
                      btnColor = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      btnColor = 'bg-rose-50 border-rose-300 text-rose-950';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectQuizOption(block.id, opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnColor}`}
                    >
                      <span>{opt.text}</span>
                      {chosen && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {chosen && isSelected && !opt.isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {chosenOption && (
                <div className={`p-4 rounded-2xl text-xs space-y-1.5 animate-in fade-in duration-200 ${
                  chosenOption.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}>
                  <p className="font-bold">
                    {chosenOption.isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Perspectiva alternativa:'}
                  </p>
                  {chosenOption.feedback && (
                    <p>{chosenOption.feedback}</p>
                  )}
                  {block.explanation && (
                    <p className="pt-1 text-[11px] opacity-80 border-t border-emerald-200/50">
                      <strong>Nota clínica:</strong> {block.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        }

        // 5. REGISTRO / REFLEXIÓN RÁPIDA
        if (block.type === 'reflection') {
          const currentText = reflections[block.id] || '';
          const isSavedNotice = savedReflectionNotice[block.id];

          return (
            <div key={block.id} className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-amber-200/70 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>Espacio de Auto-Reflexión</span>
                </span>
                {isSavedNotice && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardado</span>
                  </span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
                {block.prompt || '¿Qué resuena contigo en esta parte de la guía?'}
              </h4>

              <textarea
                value={currentText}
                onChange={(e) => setReflections(prev => ({ ...prev, [block.id]: e.target.value }))}
                rows={3}
                placeholder={block.placeholder || 'Escribe libremente tus pensamientos aquí...'}
                className="w-full bg-white border border-stone-200 rounded-2xl p-3.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5F927B]"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveReflection(block.id)}
                  disabled={!currentText.trim()}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#3E6855] hover:bg-[#325445] text-white transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar en mi diario</span>
                </button>
              </div>
            </div>
          );
        }

        // 6. TIMER / PAUSA DE RESPIRACIÓN
        if (block.type === 'timer') {
          const duration = (block.durationMinutes || 1) * 60;
          const timeLeft = timerSecondsLeft[block.id] ?? duration;
          const isRunning = Boolean(timerRunning[block.id]);
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;

          return (
            <div key={block.id} className="bg-gradient-to-br from-[#EBF1EA] to-[#DCE9DC] rounded-3xl p-6 sm:p-7 border border-[#C5DDD0] shadow-2xs space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-[#3E6855]">
                <Timer className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Pausa de Respiración ({block.durationMinutes || 1} min)
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-stone-900 font-serif">
                  {block.timerTitle || 'Micro-Pausa Consciente'}
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  {block.timerDescription || 'Respira hondo y sincroniza el aire.'}
                </p>
              </div>

              {/* Visual Ring / Countdown */}
              <div className="py-2 flex flex-col items-center justify-center">
                <div className={`w-28 h-28 rounded-full border-4 border-[#5F927B] flex flex-col items-center justify-center bg-white shadow-sm transition-transform duration-1000 ${
                  isRunning && breathingPhase === 'Inhala' ? 'scale-110 border-emerald-500' : isRunning && breathingPhase === 'Exhala' ? 'scale-90 border-teal-500' : 'scale-100'
                }`}>
                  <span className="text-2xl font-black font-mono text-stone-900">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </span>
                  {isRunning && (
                    <span className="text-[11px] font-bold text-[#3E6855] animate-pulse">
                      {breathingPhase}
                    </span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleTimer(block)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#3E6855] hover:bg-[#325445] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isRunning ? 'Pausar' : 'Iniciar Ejercicio'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResetTimer(block)}
                  className="p-2.5 rounded-full text-stone-600 bg-white/80 hover:bg-white border border-stone-200 transition-colors cursor-pointer"
                  title="Reiniciar contador"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        }

        // 7. EVENT TRIGGER (SECCIÓN COMPLETADA)
        if (block.type === 'event_trigger') {
          const isClaimed = Boolean(claimedEvents[block.id]);
          const xp = block.rewardXp || 25;

          return (
            <div key={block.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900">
                    {block.triggerLabel || 'Sección Completada'}
                  </h4>
                  <p className="text-xs text-stone-500">
                    Desbloquea: {block.unlockTarget || 'Capítulo siguiente'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleClaimTrigger(block)}
                disabled={isClaimed}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isClaimed 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isClaimed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hito Completado (+{xp} XP)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Marcar y Reclamar +{xp} XP</span>
                  </>
                )}
              </button>
            </div>
          );
        }

        // 8. CONDICIONAL (PESTAÑAS ALTERNATIVAS)
        if (block.type === 'conditional') {
          const currentTab = activeConditionTab[block.id] || 'A';

          return (
            <div key={block.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-sand-300 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-purple-700">
                <Split className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">¿Cómo te sientes en este momento?</span>
              </div>

              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveConditionTab(prev => ({ ...prev, [block.id]: 'A' }))}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'A' 
                      ? 'bg-amber-100 text-amber-900 shadow-2xs' 
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {block.conditionA_label || 'Opción A'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConditionTab(prev => ({ ...prev, [block.id]: 'B' }))}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'B' 
                      ? 'bg-teal-100 text-teal-900 shadow-2xs' 
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {block.conditionB_label || 'Opción B'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                {currentTab === 'A' ? block.conditionA_content : block.conditionB_content}
              </div>
            </div>
          );
        }

        // 9. MISIÓN ASOCIADA
        if (block.type === 'mission') {
          return (
            <div key={block.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[#3E6855]">
                <Award className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Misiones Prácticas Recomendadas</span>
              </div>

              <div className="space-y-3">
                {(block.missions || []).map((m) => {
                  const isAccepted = Boolean(acceptedBlockMissions[m.id]);

                  return (
                    <div key={m.id} className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#C5DDD0] flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-stone-900">{m.title}</h5>
                          <span className="text-[10px] font-bold text-[#3E6855] bg-white border border-[#C5DDD0] px-2 py-0.5 rounded-full">
                            +{m.xp} XP
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                          {m.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAcceptedBlockMissions(prev => ({ ...prev, [m.id]: true }));
                          onAcceptMission?.(m);
                          success('Misión aceptada', `"${m.title}" ha sido agregada a tus misiones de hoy.`);
                        }}
                        disabled={isAccepted}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isAccepted 
                            ? 'bg-emerald-200 text-emerald-900' 
                            : 'bg-[#3E6855] hover:bg-[#325445] text-white'
                        }`}
                      >
                        {isAccepted ? <Check className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                        <span>{isAccepted ? 'Aceptada' : 'Aceptar Misión'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* BLOQUE DE AUTORES Y VALIDACIÓN PROFESIONAL */}
      {(guide.authors && guide.authors.length > 0) || guide.reviewedBy ? (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-sand-300 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#5F927B]" />
            <span>Equipo Editorial y Autoría</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(guide.authors || [{ name: guide.author || 'FluxGlow', role: 'Equipo Clínico' }]).map((author, aIdx) => (
              <div key={aIdx} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-200 shrink-0">
                  <img src={author.avatarUrl || '/assets/icons/nav-profile.png'} alt={author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                    {author.name}
                  </h5>
                  <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                    {author.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {guide.reviewedBy && (
            <div className="p-3.5 rounded-2xl bg-[#EBF1EA]/60 border border-[#C5DDD0] flex items-center gap-2.5 text-xs text-[#2C4A3E]">
              <ShieldCheck className="w-4 h-4 text-[#3E6855] shrink-0" />
              <span className="font-semibold">{guide.reviewedBy}</span>
            </div>
          )}
        </div>
      ) : null}

      {/* BLOQUE DE FUENTES Y REFERENCIAS BIBLIOGRÁFICAS */}
      {guide.references && guide.references.length > 0 && (
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#5F927B]" />
            <span>Fuentes y Referencias Científicas</span>
          </h4>

          <ul className="space-y-2">
            {guide.references.map((ref, rIdx) => (
              <li key={rIdx} className="text-xs text-stone-700 flex items-start gap-2">
                <span className="font-mono text-stone-400 select-none">[{rIdx + 1}]</span>
                <div className="flex-1">
                  <span className="font-semibold">{ref.author ? `${ref.author} ` : ''}</span>
                  {ref.year && <span className="text-stone-500">({ref.year}). </span>}
                  <span className="italic">{ref.title}. </span>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5F927B] hover:underline inline-flex items-center gap-0.5 ml-1"
                    >
                      <span>Ver fuente</span>
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
