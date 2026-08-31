import React, { useState } from 'react';
import { 
  BookOpen, 
  PenLine, 
  TrendingUp, 
  Bot, 
  ShieldAlert, 
  UserCheck, 
  Users, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Heart, 
  Lock, 
  Compass, 
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Layers,
  Award
} from 'lucide-react';

export const PlatformFeaturesAndAdvantages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'functions' | 'advantages' | 'comparison'>('functions');

  const coreModules = [
    {
      id: 'learn',
      number: '01',
      title: 'Centro de Aprendizaje Emocional',
      tagline: 'Biblioteca de psicoeducación interactiva y basada en evidencia',
      icon: BookOpen,
      color: 'bg-brand-sage-50 text-brand-sage-700 border-brand-sage-200',
      badgeColor: 'bg-brand-sage-100 text-brand-sage-800',
      description: 'Accede a módulos interactivos, guías completas paso a paso, audios reflexivos y herramientas prácticas sobre gestión del estrés, burnout académico, relaciones y regulación del sistema nervioso.',
      features: [
        'Guías interactivas completas con seguimiento día a día y ejercicios de reflexión.',
        'Tests psicométricos orientativos de autoevaluación con retroalimentación inmediata.',
        'Podcasts y audios reflexivos para relajación y claridad mental.',
        'Artículos científicos explicados en lenguaje directo y accesible para jóvenes.'
      ]
    },
    {
      id: 'journal',
      number: '02',
      title: 'Diario Emocional Inteligente',
      tagline: 'Registro guiado de estados de ánimo, factores detonantes e intensidad',
      icon: PenLine,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Registra diariamente tus emociones con escalas de intensidad, factores desencadenantes (como estudio, sueño, relaciones) y notas de gratitud, generando un historial profundo de tu bienestar.',
      features: [
        'Selector intuitivo de emociones con indicador de intensidad del 1 al 10.',
        'Etiquetado de detonantes (#sueño, #ejercicio, #trabajo, #familia) para correlación.',
        'Historial cronológico con filtros y análisis de patrones.',
        'Espacio seguro y privado de desahogo y autoconocimiento sin juicios.'
      ]
    },
    {
      id: 'missions',
      number: '03',
      title: 'Misiones y Hábitos Diarios',
      tagline: 'Gamificación positiva para consolidar rutinas saludables de autocuidado',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Convierte el autocuidado en un hábito motivador mediante micro-retos diarios, contador de rachas y puntos de experiencia que celebran tu constancia.',
      features: [
        'Retos diarios de respiración consciente, pausas de hidratación y desconexión.',
        'Seguimiento de racha en tiempo real para fortalecer la disciplina emocional.',
        'Progreso de nivel de bienestar y recompensas intrínsecas.',
        'Conexión directa con las guías y lecturas de la plataforma.'
      ]
    },
    {
      id: 'analytics',
      number: '04',
      title: 'Análisis Predictivo Avanzado',
      tagline: 'Visualización de datos, radar emocional y prevención anticipada',
      icon: TrendingUp,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: 'Transforma tus registros en gráficas claras que revelan correlaciones entre detonantes y estados anímicos, pronosticando tendencias a 7, 14 y 30 días.',
      features: [
        'Mapa y gráfico de evolución emocional a lo largo de las semanas.',
        'Matriz de correlación entre detonantes de estrés y cambios anímicos.',
        'Pronóstico predictivo de riesgo de sobrecarga y niveles de batería mental.',
        'Métricas de consistencia de hábitos y bienestar subjetivo.'
      ]
    },
    {
      id: 'ai',
      number: '05',
      title: 'Acompañante Virtual Flux AI',
      tagline: 'Asistencia empática disponible 24/7 con respaldo de Gemini',
      icon: Bot,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Conversa con un asistente entrenado en escucha activa y técnicas de psicología cognitivo-conductual (TCC) para ordenar tus pensamientos en momentos difíciles.',
      features: [
        'Acompañamiento cálido, respetuoso y libre de juicios a cualquier hora.',
        'Estrategias guiadas para reestructurar pensamientos intrusivos o catastróficos.',
        'Sugerencias contextuales basadas en cómo te sientes en el momento.',
        'Protocolo ético de derivación inmediata ante situaciones de crisis severa.'
      ]
    },
    {
      id: 'alert',
      number: '06',
      title: 'Alerta Emocional Inteligente & SOS',
      tagline: 'Contención inmediata, protocolo de emergencia y líneas de apoyo',
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Espacio de emergencia emocional con técnicas rápidas de grounding (5-4-3-2-1), ejercicios de respiración diafragmática y directorio de líneas telefónicas gratuitas 24/7.',
      features: [
        'Técnica sensorial de conexión con el presente (Grounding 5-4-3-2-1).',
        'Líneas telefónicas de apoyo psicológico gratuito (Línea de la Vida, SAPTEL, etc.).',
        'Guía rápida para desescalar ataques de pánico y ansiedad intensa.',
        'Red de contactos de confianza predefinida para avisar en momentos clave.'
      ]
    },
    {
      id: 'community',
      number: '07',
      title: 'Comunidad Segura y Moderada',
      tagline: 'Espacio de empatía y apoyo mutuo entre pares',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'Comparte reflexiones, consejos y experiencias con otros jóvenes en un entorno constructivo, respetuoso y con filtros activos de moderación y privacidad.',
      features: [
        'Publicaciones organizadas por temas de interés (estudios, vida, motivación).',
        'Reacciones empáticas y mensajes solidarios.',
        'Reglas estrictas de respeto mutuo y confidencialidad.',
        'Sin toxicidad de métricas vanidosas o algoritmos adictivos.'
      ]
    },
    {
      id: 'profile',
      number: '08',
      title: 'Perfil y Personalización Integral',
      tagline: 'Control total sobre tus datos, metas personales y preferencias',
      icon: UserCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Configura tus metas de bienestar, gestiona tus insignias ganadas, ajusta temas visuales y exporta o edita tu historial cuando lo desees.',
      features: [
        'Selección y seguimiento de objetivos personales (sueño, estrés, enfoque).',
        'Historial unificado de actividad y logros alcanzados.',
        'Gestión de perfil y avatar de manera segura y privada.',
        'Personalización de la experiencia de acompañamiento.'
      ]
    }
  ];

  const platformAdvantages = [
    {
      icon: Brain,
      title: 'Enfoque Preventivo, no solo Reactivo',
      description: 'A diferencia de apps que solo actúan cuando ya existe una crisis, FluxGlow monitorea patrones tempranos y te ofrece herramientas para evitar la sobrecarga y el agotamiento.'
    },
    {
      icon: Lock,
      title: 'Privacidad y Confidencialidad Absoluta',
      description: 'Tus reflexiones personales, estados de ánimo y notas del diario no son comercializadas ni expuestas. Tu espacio es 100% íntimo y protegido.'
    },
    {
      icon: Heart,
      title: 'Lenguaje Cercano para Jóvenes (15 a 30 Años)',
      description: 'Eliminamos el lenguaje clínico denso y los tecnicismos aburridos. Todo el contenido está adaptado a los desafíos reales de la vida estudiantil y juvenil.'
    },
    {
      icon: Zap,
      title: 'Ecosistema Integral Todo en Uno',
      description: 'No necesitas una app para respirar, otra para escribir y otra para aprender. FluxGlow integra diario, análisis, IA empática, educación y comunidad en una sola plataforma fluida.'
    },
    {
      icon: Award,
      title: 'Validación en Técnicas Psicológicas Reales',
      description: 'Basado en principios de Terapia Cognitivo-Conductual (TCC), Mindfulness, Grounding sensorial y psicología positiva para asegurar un impacto genuino.'
    },
    {
      icon: Compass,
      title: 'Experiencia Ligera y sin Publicidad Invasiva',
      description: 'Cero anuncios molestos, cero algoritmos de retención adictiva. Diseñado con una paleta orgánica y serena para cuidar tu paz mental.'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Educación emocional práctica y guías interactivas',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: false,
      notesApp: false
    },
    {
      feature: 'Diario con correlación de detonantes y estados de ánimo',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: 'Parcial',
      notesApp: 'Manual'
    },
    {
      feature: 'Análisis predictivo de sobrecarga y nivel de riesgo',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: false,
      notesApp: false
    },
    {
      feature: 'Asistente IA empático especializado en bienestar (Flux AI)',
      fluxglow: true,
      genericChatbots: 'Genérico',
      standardHabitApps: false,
      notesApp: false
    },
    {
      feature: 'Módulo SOS de emergencia con líneas de crisis 24/7 y Grounding',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: false,
      notesApp: false
    },
    {
      feature: 'Comunidad segura moderada libre de algoritmos tóxicos',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: false,
      notesApp: false
    },
    {
      feature: 'Gamificación positiva con racha real y misiones diarias',
      fluxglow: true,
      genericChatbots: false,
      standardHabitApps: true,
      notesApp: false
    },
    {
      feature: 'Sin anuncios invasivos ni comercialización de datos',
      fluxglow: true,
      genericChatbots: 'Variable',
      standardHabitApps: false,
      notesApp: true
    }
  ];

  return (
    <section className="py-20 bg-[#faf7f2] border-b border-stone-200" id="funciones-y-ventajas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#548c71]/15 text-[#3d6753] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía Completa de la Plataforma</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 mb-4">
            Todo lo que FluxGlow hace por ti
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Descubre en detalle cada una de nuestras herramientas, sus ventajas diferenciales y cómo transformamos la salud mental en un hábito accesible y motivador.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 p-1.5 bg-white rounded-2xl border border-stone-200/80 shadow-xs max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('functions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'functions'
                  ? 'bg-[#548c71] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Funciones y Módulos
            </button>
            <button
              onClick={() => setActiveTab('advantages')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'advantages'
                  ? 'bg-[#548c71] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Ventajas Principales
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-[#548c71] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              ¿En qué nos diferenciamos?
            </button>
          </div>
        </div>

        {/* TAB 1: FUNCIONES DETALLADAS DE FLUXGLOW */}
        {activeTab === 'functions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreModules.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className={`p-3 rounded-2xl border ${m.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${m.badgeColor}`}>
                          Módulo #{m.number}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-stone-900 mb-1">
                        {m.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#548c71] mb-3">
                        {m.tagline}
                      </p>
                      <p className="text-stone-600 text-sm leading-relaxed mb-5">
                        {m.description}
                      </p>

                      <div className="space-y-2 pt-3 border-t border-stone-100">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          Capacidades incluidas:
                        </p>
                        {m.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-700">
                            <CheckCircle2 className="w-4 h-4 text-[#548c71] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VENTAJAS CLAVE DE FLUXGLOW */}
        {activeTab === 'advantages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-sand-100 text-[#548c71] flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                      {adv.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs font-semibold text-[#548c71]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ventaja diseñada para ti</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: TABLA COMPARATIVA: FLUXGLOW VS OTRAS SOLUCIONES */}
        {activeTab === 'comparison' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-900 to-stone-800 text-white">
              <h3 className="text-xl sm:text-2xl font-black">
                ¿En qué se diferencia FluxGlow de otras aplicaciones?
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Comparamos la experiencia integral de FluxGlow frente a chatbots genéricos, apps de hábitos estándar y diarios de notas convencionales.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-700">
                    <th className="py-4 px-4 sm:px-6 font-bold">Característica / Capacidad</th>
                    <th className="py-4 px-3 sm:px-4 font-black text-[#2d6a4f] bg-emerald-50/70 border-x border-emerald-100 text-center">
                      FluxGlow
                    </th>
                    <th className="py-4 px-3 sm:px-4 font-medium text-stone-500 text-center">Chatbots de IA Genéricos</th>
                    <th className="py-4 px-3 sm:px-4 font-medium text-stone-500 text-center">Apps de Hábitos Estándar</th>
                    <th className="py-4 px-3 sm:px-4 font-medium text-stone-500 text-center">Apps de Notas Básicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-800">
                        {row.feature}
                      </td>

                      {/* FluxGlow */}
                      <td className="py-3.5 px-3 sm:px-4 bg-emerald-50/50 border-x border-emerald-100 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Completo</span>
                        </span>
                      </td>

                      {/* Generic Chatbots */}
                      <td className="py-3.5 px-3 sm:px-4 text-center text-stone-600">
                        {row.genericChatbots === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : row.genericChatbots === false ? (
                          <XCircle className="w-4 h-4 text-stone-300 mx-auto" />
                        ) : (
                          <span className="text-xs text-amber-700 font-semibold">{row.genericChatbots}</span>
                        )}
                      </td>

                      {/* Standard Habits */}
                      <td className="py-3.5 px-3 sm:px-4 text-center text-stone-600">
                        {row.standardHabitApps === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : row.standardHabitApps === false ? (
                          <XCircle className="w-4 h-4 text-stone-300 mx-auto" />
                        ) : (
                          <span className="text-xs text-amber-700 font-semibold">{row.standardHabitApps}</span>
                        )}
                      </td>

                      {/* Basic Notes */}
                      <td className="py-3.5 px-3 sm:px-4 text-center text-stone-600">
                        {row.notesApp === true ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : row.notesApp === false ? (
                          <XCircle className="w-4 h-4 text-stone-300 mx-auto" />
                        ) : (
                          <span className="text-xs text-amber-700 font-semibold">{row.notesApp}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 sm:p-5 bg-[#faf7f2] border-t border-stone-200 text-center">
              <p className="text-xs text-stone-600">
                ⭐ <strong>Conclusión</strong>: FluxGlow unifica la prevención, la psicoeducación guiada, el seguimiento de hábitos y el análisis predictivo en un solo lugar confiable.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
