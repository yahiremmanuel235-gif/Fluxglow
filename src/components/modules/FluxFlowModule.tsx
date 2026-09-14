import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Heart,
  Brain,
  Smile,
  Frown,
  Meh,
  Activity,
  Zap,
  BookOpen,
  Target,
  MessageSquare,
  Users,
  BarChart,
  Home
} from 'lucide-react';
import { useJournal } from '../../hooks/useJournal';
import { incrementFluxStreak, getFluxStreak } from '../../utils/streakManager';
import { useToast } from '../common/Toast';
import confetti from 'canvas-confetti';
import { DEMO_GUIDES_CATALOG, POPULAR_GUIDES_CATALOG } from '../../data/guidesData';
import { COMPLETE_COURSES_CATALOG } from '../../data/completeGuidesData';
import { GuideReaderModal } from './GuideReaderModal'; // if exists, or I will inline the reading logic

export const FluxFlowModule: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { addEntry } = useJournal();
  const { success, info } = useToast();
  
  // Step 1 State
  const [mood, setMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [factors, setFactors] = useState<string[]>([]);

  // Step 2 State
  const [activeGuide, setActiveGuide] = useState<any>(null);
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [courseDay, setCourseDay] = useState<number>(0); // 0 to show catalog, or specific day index

  const handleSaveStep1 = async () => {
    if (!mood) {
      info('Aviso', 'Selecciona un estado de ánimo para continuar.');
      return;
    }
    
    // Save to journal
    await addEntry({
      mood: mood as any,
      intensity,
      notes,
      triggers: factors
    });
    
    incrementFluxStreak();
    success('Registro guardado', 'Tu check-in emocional ha sido guardado exitosamente.');
    setCurrentStep(2);
  };

  const skipStep1 = () => setCurrentStep(2);

  const finishGuide = () => {
    incrementFluxStreak();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setActiveGuide(null);
    setCurrentStep(3);
  };

  const finishCourseDay = () => {
    incrementFluxStreak();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setActiveCourse(null);
    setCurrentStep(3);
  };

  return (
    <div className="w-full min-h-screen bg-flux-brand-bath flex flex-col pb-20 pt-4 px-4 sm:px-6 lg:px-8 text-stone-800">
      <div className="max-w-[800px] mx-auto w-full flex-1 flex flex-col space-y-6">
        
        {/* Breadcrumb / Progress Header */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-white/80 shadow-xs mb-4">
          <div className="flex items-center gap-2">
             <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
             <span className="font-bold text-stone-900 text-sm">Flujo Flux</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
             <span className={currentStep === 1 ? 'text-[#3E6855] font-bold' : ''}>1. Check-in</span>
             <ArrowRight className="w-3 h-3" />
             <span className={currentStep === 2 ? 'text-[#3E6855] font-bold' : ''}>2. Aprendizaje</span>
             <ArrowRight className="w-3 h-3" />
             <span className={currentStep === 3 ? 'text-[#3E6855] font-bold' : ''}>3. Cierre</span>
          </div>
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-sage-300 shadow-sm animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Check-in Emocional</h2>
            <p className="text-stone-600 text-sm mb-8">Tómate un momento para conectar con cómo te sientes hoy.</p>
            
            <div className="space-y-8">
              {/* Mood Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 block">Estado de Ánimo</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'muy mal', emoji: '😭' },
                    { id: 'mal', emoji: '😔' },
                    { id: 'regular', emoji: '😐' },
                    { id: 'bien', emoji: '🙂' },
                    { id: 'muy bien', emoji: '🤩' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        mood === m.id ? 'border-brand-sage-500 bg-brand-sage-50 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">{m.emoji}</span>
                      <span className="text-[10px] font-semibold text-stone-600 capitalize hidden sm:block">{m.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              {mood && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Intensidad</label>
                    <span className="text-sm font-bold text-brand-sage-700">{intensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-sage-600"
                  />
                </div>
              )}

              {/* Desahogo Textarea */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 block">Desahogo libre</label>
                <textarea
                  placeholder="¿Qué tienes en mente? Escribe sin filtros..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:outline-hidden focus:border-brand-sage-500 focus:ring-1 focus:ring-brand-sage-500 resize-none h-32 transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={skipStep1}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Saltar este paso
                </button>
                <button
                  onClick={handleSaveStep1}
                  disabled={!mood}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    mood ? 'bg-brand-sage-600 text-white hover:bg-brand-sage-700' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Guardar en mi Diario</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && !activeGuide && !activeCourse && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-sage-300 shadow-sm animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Aprendizaje Diario</h2>
            <p className="text-stone-600 text-sm mb-6">Selecciona una guía rápida o un curso de 1 semana para continuar tu racha.</p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Guías Cortas Recomendadas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DEMO_GUIDES_CATALOG.slice(0, 4).map(guide => (
                    <button
                      key={guide.id}
                      onClick={() => setActiveGuide(guide)}
                      className="text-left p-4 rounded-2xl bg-stone-50 hover:bg-brand-sage-50 border border-stone-200 hover:border-brand-sage-300 transition-all group cursor-pointer"
                    >
                      <h4 className="text-sm font-bold text-stone-900 line-clamp-1 mb-1">{guide.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2">{guide.simpleSummary}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-sage-600" />
                  Guías de 1 Semana
                </h3>
                <div className="space-y-3">
                  {COMPLETE_COURSES_CATALOG.slice(0, 2).map(course => (
                    <button
                      key={course.id}
                      onClick={() => setActiveCourse(course)}
                      className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-white hover:from-brand-sage-50 border border-stone-200 hover:border-brand-sage-300 transition-all flex items-center gap-4 cursor-pointer group"
                    >
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-stone-200 overflow-hidden">
                        <img src={course.image || course.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 mb-0.5">{course.title}</h4>
                        <p className="text-[11px] text-stone-500">{course.totalDays} Días • {course.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-stone-100 text-center">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  Saltar este paso
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 - Guide Reader View */}
        {currentStep === 2 && activeGuide && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-sage-300 shadow-sm animate-in slide-in-from-right-8 duration-300">
            <button onClick={() => setActiveGuide(null)} className="text-xs font-bold text-stone-500 mb-4 hover:text-stone-800 cursor-pointer">← Volver al catálogo</button>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{activeGuide.title}</h2>
            <div className="bg-brand-sage-50 p-4 rounded-2xl text-sm text-brand-sage-800 italic mb-6">
              {activeGuide.simpleSummary}
            </div>
            
            <div className="space-y-6 text-sm text-stone-700 leading-relaxed mb-8">
              {activeGuide.explainedContent.map((section: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-bold text-stone-900 mb-2">{section.heading}</h3>
                  <p>{section.text}</p>
                  {section.bulletPoints && (
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {section.bulletPoints.map((bp: string, i: number) => <li key={i}>{bp}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-stone-100">
              <button
                onClick={finishGuide}
                className="px-6 py-3 rounded-xl bg-brand-sage-600 hover:bg-brand-sage-700 text-white text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>He terminado de leer la guía</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 - Course Day View */}
        {currentStep === 2 && activeCourse && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-sage-300 shadow-sm animate-in slide-in-from-right-8 duration-300">
            <button onClick={() => setActiveCourse(null)} className="text-xs font-bold text-stone-500 mb-4 hover:text-stone-800 cursor-pointer">← Volver al catálogo</button>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">{activeCourse.title} - Día 1</h2>
            <p className="text-sm text-stone-600 mb-6">{activeCourse.days[0].title}</p>
            
            <div className="space-y-6 text-sm text-stone-700 leading-relaxed mb-8">
               <h3 className="font-bold text-stone-900">Lección del Día</h3>
               <p>{activeCourse.days[0].lesson.content}</p>
               
               <h3 className="font-bold text-stone-900 mt-6">Misión Práctica</h3>
               <div className="bg-brand-sand-50 p-4 rounded-xl border border-brand-sand-200">
                 <p className="font-medium text-brand-sand-900">{activeCourse.days[0].mission.title}</p>
                 <p className="text-xs text-brand-sand-700 mt-1">{activeCourse.days[0].mission.description}</p>
               </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-stone-100">
              <button
                onClick={finishCourseDay}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Finalizar Día 1 y continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-brand-sage-300 shadow-sm animate-in zoom-in-95 duration-500 text-center">
            
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-10 h-10 text-white fill-white" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-serif text-stone-900 mb-4 leading-tight">
              ✨ ¡Flux completado!<br/>Estás un paso más cerca de tu Glow.
            </h1>

            <div className="inline-flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200 mb-8">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Racha Flux</p>
                <p className="text-2xl font-bold text-amber-900">{getFluxStreak()} <span className="text-sm font-semibold">Puntos Totales</span></p>
              </div>
            </div>

            {mood && (
              <div className="text-left bg-brand-sage-50 rounded-2xl p-6 border border-brand-sage-200 mb-8">
                <h3 className="text-sm font-bold text-brand-sage-900 flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4" />
                  Mini Análisis Predictivo
                </h3>
                <p className="text-sm text-brand-sage-800 leading-relaxed">
                  Hoy registraste un estado <strong>{mood}</strong> con intensidad {intensity}/10. 
                  {intensity > 7 ? ' Es un nivel alto de intensidad, te recomendamos ejercicios de respiración.' : ' Mantén este equilibrio explorando nuestra biblioteca de conocimiento.'}
                </p>
              </div>
            )}

            <div className="text-left">
              <h3 className="text-base font-bold text-stone-900 mb-4">¿Qué quieres hacer ahora?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => onNavigate('ai')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><MessageSquare className="w-5 h-5 text-indigo-500" /></div>
                  <span className="text-sm font-bold text-stone-800">Hablar con Flux AI</span>
                </button>
                <button onClick={() => onNavigate('missions')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><Target className="w-5 h-5 text-brand-sage-600" /></div>
                  <span className="text-sm font-bold text-stone-800">Ver mis misiones asignadas</span>
                </button>
                <button onClick={() => onNavigate('community')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><Users className="w-5 h-5 text-amber-500" /></div>
                  <span className="text-sm font-bold text-stone-800">Navegar en la comunidad</span>
                </button>
                <button onClick={() => onNavigate('analytics')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><BarChart className="w-5 h-5 text-blue-500" /></div>
                  <span className="text-sm font-bold text-stone-800">Ver mi análisis predictivo</span>
                </button>
                <button onClick={() => onNavigate('learn')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><BookOpen className="w-5 h-5 text-rose-500" /></div>
                  <span className="text-sm font-bold text-stone-800">Seguir aprendiendo</span>
                </button>
                <button onClick={() => onNavigate('dashboard')} className="p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer group">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs group-hover:scale-105 transition-transform"><Home className="w-5 h-5 text-stone-600" /></div>
                  <span className="text-sm font-bold text-stone-800">Volver al Centro de Control</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
