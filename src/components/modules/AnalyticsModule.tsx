import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Brain, 
  PieChart as PieIcon, 
  Activity, 
  AlertCircle, 
  Download, 
  ChevronRight,
  Info,
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Flame, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  Check, 
  Plus,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { 
  getStoredMissions, 
  completeDailyMission, 
  calculateMissionStreak 
} from '../../utils/missionsManager';
import { UserDailyMissionRecord, ViewMode, JournalEntry, MoodType } from '../../types';
import { MOCK_JOURNAL_ENTRIES } from '../../data/mockData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

interface AnalyticsModuleProps {
  onNavigate?: (view: ViewMode) => void;
}

const MOOD_TO_VAL: Record<string, number> = {
  feliz: 5,
  Feliz: 5,
  Motivado: 5,
  tranquilo: 4,
  Tranquilo: 4,
  ansioso: 3,
  Ansioso: 3,
  Estresado: 2,
  Abrumado: 2,
  triste: 2,
  Triste: 2,
  enojado: 1,
  Enojado: 1
};

const MOOD_TO_LABEL: Record<string, string> = {
  feliz: 'Felicidad',
  Feliz: 'Felicidad',
  Motivado: 'Motivación',
  tranquilo: 'Tranquilidad',
  Tranquilo: 'Tranquilidad',
  ansioso: 'Inquietud',
  Ansioso: 'Inquietud',
  Estresado: 'Estrés',
  Abrumado: 'Sobrecarga',
  triste: 'Tristeza',
  Triste: 'Tristeza',
  enojado: 'Tensión',
  Enojado: 'Tensión'
};

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<'7d' | '14d' | '30d'>('7d');
  
  // Real Journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_journal_entries');
      return saved ? JSON.parse(saved) : MOCK_JOURNAL_ENTRIES;
    } catch {
      return MOCK_JOURNAL_ENTRIES;
    }
  });

  // Daily Missions State
  const [missions, setMissions] = useState<UserDailyMissionRecord[]>(() => getStoredMissions());
  const [missionFilter, setMissionFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const handleMissionsUpdate = (e: any) => {
      if (e.detail) {
        setMissions(e.detail);
      } else {
        setMissions(getStoredMissions());
      }
    };

    const handleJournalUpdate = () => {
      try {
        const saved = localStorage.getItem('fluxglow_journal_entries');
        if (saved) setJournalEntries(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    window.addEventListener('fluxglow_journal_updated', handleJournalUpdate);
    return () => {
      window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
      window.removeEventListener('fluxglow_journal_updated', handleJournalUpdate);
    };
  }, []);

  const handleCompleteMission = (recordId: string) => {
    const res = completeDailyMission(recordId);
    if (res.success) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
      success('¡Misión completada! Sigue así 🌱', `Sumaste +${res.mission?.xp || 30} XP y reforzaste tu racha diaria.`);
    }
  };

  const streakDays = calculateMissionStreak(missions);
  const completedMissionsCount = missions.filter(m => m.status === 'completed').length;
  const filteredMissions = missions.filter(m => {
    if (missionFilter === 'pending') return m.status === 'pending';
    if (missionFilter === 'completed') return m.status === 'completed';
    return true;
  });

  // 1. Monthly Learning Growth Data
  const learningMonthlyData = [
    { month: 'Ene', guias: 6 },
    { month: 'Feb', guias: 11 },
    { month: 'Mar', guias: 14 },
    { month: 'Abr', guias: 19 },
    { month: 'May', guias: 24 },
    { month: 'Jun', guias: 28 + completedMissionsCount },
  ];

  // 2. Dynamic Topics of Interest (Donut Pie Chart derived from triggers in Journal)
  const topicsData = useMemo(() => {
    const counts: Record<string, number> = {
      'Resiliencia': 5,
      'Inteligencia Emocional': 4,
      'Productividad': 3,
      'Relaciones': 2,
      'Mindfulness': 3,
    };

    journalEntries.forEach(entry => {
      if (entry.triggers && Array.isArray(entry.triggers)) {
        entry.triggers.forEach(t => {
          counts[t] = (counts[t] || 0) + 2;
        });
      }
    });

    const total = Object.values(counts).reduce((acc, c) => acc + c, 0);
    const colors = ['#548c71', '#3d6753', '#de6943', '#d97706', '#0284c7', '#84cc16'];

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, val], idx) => ({
        name,
        value: Math.max(5, Math.round((val / total) * 100)),
        color: colors[idx % colors.length]
      }));
  }, [journalEntries]);

  // 3. Dynamic 30-Day Emotional Path combining Real Journal Records + Baseline
  const monthlyMoodPath = useMemo(() => {
    const baseDays = [
      { day: 1, val: 5, mood: 'Felicidad', date: '01 Jun', note: 'Buen inicio de mes' },
      { day: 2, val: 4, mood: 'Tranquilidad', date: '02 Jun', note: 'Paseo al aire libre' },
      { day: 3, val: 4, mood: 'Tranquilidad', date: '03 Jun', note: 'Lectura guiada' },
      { day: 4, val: 3, mood: 'Inquietud', date: '04 Jun', note: 'Pendientes acumulados' },
      { day: 5, val: 3, mood: 'Inquietud', date: '05 Jun', note: 'Reunión de trabajo' },
      { day: 6, val: 2, mood: 'Tristeza', date: '06 Jun', note: 'Cansancio acumulado' },
      { day: 7, val: 3, mood: 'Inquietud', date: '07 Jun', note: 'Descanso activo' },
      { day: 8, val: 4, mood: 'Tranquilidad', date: '08 Jun', note: 'Meditación matutina' },
      { day: 9, val: 5, mood: 'Felicidad', date: '09 Jun', note: 'Completé proyecto' },
      { day: 10, val: 5, mood: 'Felicidad', date: '10 Jun', note: 'Salida con amigos' },
      { day: 11, val: 4, mood: 'Tranquilidad', date: '11 Jun', note: 'Día sereno' },
      { day: 12, val: 3, mood: 'Inquietud', date: '12 Jun', note: 'Examen académico' },
      { day: 13, val: 2, mood: 'Tristeza', date: '13 Jun', note: 'Insomnio leve' },
      { day: 14, val: 1, mood: 'Tensión', date: '14 Jun', note: 'Discusión externa' },
      { day: 15, val: 3, mood: 'Inquietud', date: '15 Jun', note: 'Respiración diafragmática' },
      { day: 16, val: 4, mood: 'Tranquilidad', date: '16 Jun', note: 'Retorno a la calma' },
      { day: 17, val: 5, mood: 'Felicidad', date: '17 Jun', note: 'Excelente sesión terapéutica' },
      { day: 18, val: 4, mood: 'Tranquilidad', date: '18 Jun', note: 'Hábitos consistentes' },
      { day: 19, val: 4, mood: 'Tranquilidad', date: '19 Jun', note: 'Buen descanso' },
      { day: 20, val: 5, mood: 'Felicidad', date: '20 Jun', note: 'Logro de meta mensual' },
      { day: 21, val: 5, mood: 'Felicidad', date: '21 Jun', note: 'Día familiar cálido' },
      { day: 22, val: 4, mood: 'Tranquilidad', date: '22 Jun', note: 'Planificación semanal' },
      { day: 23, val: 3, mood: 'Inquietud', date: '23 Jun', note: 'Cierre de entregables' },
      { day: 24, val: 4, mood: 'Tranquilidad', date: '24 Jun', note: 'Caminata en parque' },
      { day: 25, val: 5, mood: 'Felicidad', date: '25 Jun', note: 'Gran energía y foco' },
      { day: 26, val: 4, mood: 'Tranquilidad', date: '26 Jun', note: 'Noche de lectura' },
      { day: 27, val: 5, mood: 'Felicidad', date: '27 Jun', note: 'Reconocimiento laboral' },
      { day: 28, val: 5, mood: 'Felicidad', date: '28 Jun', note: 'Plena satisfacción' },
      { day: 29, val: 4, mood: 'Tranquilidad', date: '29 Jun', note: 'Reflexión en diario' },
      { day: 30, val: 5, mood: 'Felicidad', date: '30 Jun', note: 'Cierre de mes en bienestar óptimo' },
    ];

    // Inject recent real journal entries into the latest days
    if (journalEntries.length > 0) {
      const recent = [...journalEntries].reverse();
      recent.slice(0, 5).forEach((entry, idx) => {
        const targetDay = 30 - idx;
        const entryVal = MOOD_TO_VAL[entry.mood] || 4;
        const entryMood = MOOD_TO_LABEL[entry.mood] || 'Calma';
        const entryNote = entry.note ? (entry.note.slice(0, 38) + (entry.note.length > 38 ? '...' : '')) : 'Registro en diario';
        
        if (targetDay > 0 && targetDay <= 30) {
          baseDays[targetDay - 1] = {
            day: targetDay,
            val: entryVal,
            mood: entryMood,
            date: `${targetDay < 10 ? '0' + targetDay : targetDay} Jun`,
            note: entryNote
          };
        }
      });
    }

    return baseDays;
  }, [journalEntries]);

  // 4. Truly Dynamic Predictive Forecast based on chosen Period (7d, 14d, 30d) and active user habits
  const forecastData = useMemo(() => {
    // Calculate average happiness from recent entries
    const recentScores = monthlyMoodPath.map(d => d.val);
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / (recentScores.length || 1);
    const isHighWellbeing = avgScore >= 3.8;

    if (forecastPeriod === '7d') {
      const riskPercent = isHighWellbeing ? 8 : 16;
      const batteryPercent = Math.min(95, 80 + streakDays * 2);
      return {
        title: 'Horizonte Inmediato (Próximos 7 Días)',
        riskLevel: riskPercent <= 10 ? 'Riesgo Muy Bajo' : 'Riesgo Bajo',
        riskPercent,
        riskDescription: 'Tu consistencia en micro-prácticas y pausas conscientes mitiga la acumulación de fatiga a corto plazo.',
        riskBarColor: 'bg-brand-sage-600',
        batteryPercent,
        batteryState: `${batteryPercent}% Energía`,
        batteryDescription: 'Claridad mental y reservas óptimas para tus prioridades de la semana en curso.',
        batteryBarColor: 'bg-brand-sage-500',
        actionTitle: 'Pausa somática de media semana',
        actionDesc: 'Programa 3 minutos de respiración diafragmática el miércoles para mantener tu umbral sereno.',
        actionType: 'Acción semanal preventiva'
      };
    } else if (forecastPeriod === '14d') {
      const riskPercent = isHighWellbeing ? 14 : 22;
      const batteryPercent = Math.min(90, 75 + streakDays);
      return {
        title: 'Proyección Quincenal (14 Días)',
        riskLevel: 'Riesgo Estable',
        riskPercent,
        riskDescription: 'Rendimiento equilibrado. Conviene cuidar el descanso en fines de semana para evitar desgaste a mitad de mes.',
        riskBarColor: 'bg-brand-sage-600',
        batteryPercent,
        batteryState: `${batteryPercent}% Energía`,
        batteryDescription: 'Estabilidad proyectada suficiente para proyectos exigentes con buena tolerancia al estrés.',
        batteryBarColor: 'bg-brand-terracotta-500',
        actionTitle: 'Higiene del sueño sostenida',
        actionDesc: 'Establece desconexión digital 30 minutos antes de dormir en las noches de entrega académica o laboral.',
        actionType: 'Recomendación de mediano plazo'
      };
    } else {
      // 30d
      const riskPercent = isHighWellbeing ? 12 : 25;
      const batteryPercent = Math.min(88, 70 + streakDays * 2);
      return {
        title: 'Tendencia Mensual Global (30 Días)',
        riskLevel: 'Riesgo Controlado',
        riskPercent,
        riskDescription: 'Modelo predictivo de alta adaptabilidad. Tus factores protectores consolidan una racha de resiliencia sostenible.',
        riskBarColor: 'bg-brand-sage-600',
        batteryPercent,
        batteryState: `${batteryPercent}% Energía`,
        batteryDescription: 'Capacidad acumulada para autorregular emociones intensas y superar fluctuaciones cíclicas.',
        batteryBarColor: 'bg-brand-terracotta-600',
        actionTitle: 'Revisión mensual de objetivos',
        actionDesc: 'Dedica 10 minutos a finales de mes para reflexionar sobre tus mayores aprendizajes en el diario.',
        actionType: 'Estrategia de consolidación a 30 días'
      };
    }
  }, [forecastPeriod, monthlyMoodPath, streakDays]);

  return (
    <div className="w-full bg-brand-sand-50 min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-stone-700 bg-white border border-brand-sand-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-brand-sage-600" />
            <span>Periodo de Análisis: Junio 2026</span>
          </div>
        </div>

        {/* Big Display Title: Análisis Predictivo */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-sage-700">Análisis </span>
            <span className="text-brand-terracotta-600">Predictivo</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">Métricas de evolución cognitiva y modelos de estabilidad emocional</p>
        </div>

        {/* 2 Large Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* CARD 1 (LEFT): Aprendizaje y Conocimiento */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header inside Card 1 */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-brand-sand-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                    Aprendizaje y Conocimiento
                  </h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-stone-900">{28 + completedMissionsCount} ↑</span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-600">
                      Guías y retos completados este mes
                    </span>
                  </div>
                  <p className="text-xs text-brand-sage-700 font-bold mt-0.5">
                    +{53 + completedMissionsCount}% Más que el mes anterior
                  </p>
                </div>

                <Button
                  id="weekly-summary-btn"
                  onClick={() => setShowWeeklySummary(!showWeeklySummary)}
                  variant="sand"
                  size="sm"
                >
                  {showWeeklySummary ? 'Ocultar resumen' : 'Resumen semanal'}
                </Button>
              </div>

              {/* Weekly summary drawer if opened */}
              {showWeeklySummary && (
                <div className="my-4 p-3.5 bg-brand-sage-50 border border-brand-sage-300 rounded-2xl text-xs text-brand-sage-900 animate-fadeIn">
                  <p className="font-bold mb-1">Resumen Semanal de Progreso:</p>
                  <p>Completaste {completedMissionsCount} micro-retos diarios y mantuviste {streakDays} días consecutivos de hábitos conscientes.</p>
                </div>
              )}

              {/* Bottom Visuals Split: Monthly Trend Chart & Topics Donut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                
                {/* Left Sub-chart: Line curve over months */}
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                    Evolución Mensual (2026)
                  </span>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={learningMonthlyData}>
                        <defs>
                          <linearGradient id="learnGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#548c71" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#548c71" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#78716c' }} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 35]} />
                        <Tooltip 
                          formatter={(val: any) => [`${val} logros`, 'Completados']}
                          contentStyle={{ borderRadius: 12, fontSize: 11, border: '1px solid #e7e5e4' }}
                        />
                        <Area type="monotone" dataKey="guias" stroke="#548c71" strokeWidth={3} fillOpacity={1} fill="url(#learnGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Sub-chart: Temas de Interés (Donut derived from user triggers) */}
                <div>
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-1 block">
                    Temas de Interés (Diario)
                  </span>
                  <div className="h-32 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topicsData}
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {topicsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(val: any) => [`${val}%`, 'Frecuencia']}
                          contentStyle={{ borderRadius: 12, fontSize: 11 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] mt-2">
                    {topicsData.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }}></span>
                        <span className="font-semibold text-stone-700 truncate">{t.value}% {t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="mt-6 pt-3 border-t border-brand-sand-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-brand-sage-600" />
                Enfoque cognitivo fortalecido
              </span>
              <span className="font-bold text-stone-900">Índice: {Math.min(99, 85 + streakDays)}/100</span>
            </div>
          </div>

          {/* CARD 2 (RIGHT): Evolución Emocional across 5 colored bands */}
          <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-sand-200 mb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                  Evolución Emocional
                </h2>
                <span className="text-xs text-stone-600 font-semibold bg-brand-sand-100 px-2.5 py-1 rounded-full border border-brand-sand-300">
                  1 - 30 Días de Junio
                </span>
              </div>

              {/* Band Legend Labels */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-700 mb-2 px-1">
                <span className="flex items-center gap-1 text-amber-700">⭐ Felicidad</span>
                <span className="flex items-center gap-1 text-brand-sage-700">🍃 Calma</span>
                <span className="flex items-center gap-1 text-amber-800">❓ Inquietud</span>
                <span className="flex items-center gap-1 text-sky-700">💧 Tristeza</span>
                <span className="flex items-center gap-1 text-rose-700">🔥 Tensión</span>
              </div>

              {/* Multi-colored Banded Graph Container */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-brand-sand-300 shadow-inner">
                {/* 5 Background Color Bands */}
                <div className="absolute inset-0 grid grid-rows-5 pointer-events-none opacity-25">
                  <div className="bg-amber-200 border-b border-amber-300/50"></div>
                  <div className="bg-emerald-200 border-b border-emerald-300/50"></div>
                  <div className="bg-orange-200 border-b border-orange-300/50"></div>
                  <div className="bg-blue-200 border-b border-blue-300/50"></div>
                  <div className="bg-rose-200"></div>
                </div>

                {/* Plotted Line Chart Overlay */}
                <div className="relative z-10 w-full h-full p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyMoodPath}>
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 9, fill: '#44403c' }} 
                        axisLine={false} 
                        tickLine={false} 
                        interval={3} 
                      />
                      <YAxis hide domain={[0.8, 5.2]} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-stone-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                                <p className="font-bold text-amber-400">Día {data.day} ({data.date})</p>
                                <p className="text-white">Estado: <strong>{data.mood}</strong></p>
                                <p className="text-stone-300 text-[11px]">"{data.note}"</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#292524" 
                        strokeWidth={2.5} 
                        dot={{ r: 3, fill: '#292524' }} 
                        activeDot={{ r: 6, fill: '#de6943', stroke: '#fff', strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Status / Pattern Alert */}
            <div className="mt-4 pt-3 border-t border-brand-sand-200 flex items-center justify-between text-xs">
              <span className="text-stone-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-terracotta-600" />
                Tendencia Predominante: <strong className="text-brand-sage-700">Felicidad & Calma (78%)</strong>
              </span>
              <span className="text-stone-500 text-[11px]">
                30 días analizados
              </span>
            </div>

          </div>

        </div>

        {/* SECTION 3: Tarjeta de Pronóstico Emocional Inteligente (Connected to Period State) */}
        <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sage-500"></span>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                  Pronóstico de Estabilidad Emocional
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Estimación predictiva basada en tus patrones de registro de las últimas semanas ({forecastData.title}).
              </p>
            </div>

            {/* Interactive Period Selector Buttons */}
            <div className="flex items-center gap-1.5 bg-brand-sand-100 p-1 rounded-full border border-brand-sand-300">
              {(['7d', '14d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setForecastPeriod(period)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    forecastPeriod === period
                      ? 'bg-brand-sage-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/70'
                  }`}
                >
                  {period === '7d' ? '7 días' : period === '14d' ? '14 días' : '30 días'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {/* Risk Gauge Card */}
            <div className="p-5 rounded-2xl bg-brand-sage-50 border border-brand-sage-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-900">Nivel de Riesgo ({forecastPeriod})</span>
                  <ShieldCheck className="w-4 h-4 text-brand-sage-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand-sage-900">{forecastData.riskLevel} ({forecastData.riskPercent}%)</h3>
                <p className="text-xs text-brand-sage-800 mt-1.5 leading-relaxed">
                  {forecastData.riskDescription}
                </p>
              </div>
              <div className="w-full bg-brand-sand-200 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className={`${forecastData.riskBarColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${forecastData.riskPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Cognitive Battery */}
            <div className="p-5 rounded-2xl bg-brand-sand-100 border border-brand-sand-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800">Batería Mental Proyectada</span>
                  <Zap className="w-4 h-4 text-brand-terracotta-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{forecastData.batteryState}</h3>
                <p className="text-xs text-stone-700 mt-1.5 leading-relaxed">
                  {forecastData.batteryDescription}
                </p>
              </div>
              <div className="w-full bg-brand-sand-300 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className={`${forecastData.batteryBarColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${forecastData.batteryPercent}%` }}
                ></div>
              </div>
            </div>

            {/* AI Preventative Action */}
            <div className="p-5 rounded-2xl bg-white border border-brand-sand-300 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Acción Preventiva ({forecastPeriod})</span>
                  <CheckCircle2 className="w-4 h-4 text-brand-sage-600" />
                </div>
                <h3 className="text-base font-bold text-stone-900">{forecastData.actionTitle}</h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {forecastData.actionDesc}
                </p>
              </div>
              <span className="text-[11px] text-brand-sage-700 font-semibold mt-3">
                💡 {forecastData.actionType}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Mis Misiones Diarias */}
        <div className="mt-8 bg-brand-sand-100/70 rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-brand-sand-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-terracotta-100 text-brand-terracotta-600 flex items-center justify-center shadow-2xs">
                  <Flame className="w-5 h-5 fill-brand-terracotta-500 text-brand-terracotta-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                    Mis Misiones Diarias
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                    Retos prácticos completados a partir de tus guías de Explora y Aprende.
                  </p>
                </div>
              </div>
            </div>

            {/* Streak & Achievements Counter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-white px-4 py-2 rounded-2xl border border-brand-sand-300 shadow-2xs flex items-center gap-2">
                <Flame className="w-5 h-5 text-brand-terracotta-500 fill-brand-terracotta-400 animate-pulse" />
                <div>
                  <div className="text-xs font-extrabold text-stone-900">
                    🔥 {streakDays} {streakDays === 1 ? 'día seguido' : 'días seguidos'}
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Racha activa de hábitos
                  </span>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-2xl border border-brand-sand-300 shadow-2xs flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-sage-600" />
                <div>
                  <div className="text-xs font-extrabold text-stone-900">
                    {completedMissionsCount} completadas
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">
                    +{completedMissionsCount * 30} XP acumulados
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 pb-4">
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'completed'] as const).map((filter) => {
                const label = filter === 'all' 
                  ? `Todas (${missions.length})` 
                  : filter === 'pending' 
                    ? `Pendientes (${missions.filter(m => m.status === 'pending').length})` 
                    : `Completadas (${missions.filter(m => m.status === 'completed').length})`;
                const isActive = missionFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setMissionFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-sage-600 text-white shadow-2xs' 
                        : 'bg-white text-stone-600 hover:bg-brand-sand-200 border border-brand-sand-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {onNavigate && (
              <Button
                onClick={() => onNavigate('missions')}
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Ver Panel de Misiones
              </Button>
            )}
          </div>

          {/* Missions List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {filteredMissions.map((item) => {
              const isDone = item.status === 'completed';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-white/90 border-brand-sage-300 shadow-2xs opacity-90' 
                      : 'bg-white border-brand-sand-300 shadow-xs hover:border-brand-sage-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-2 py-0.5 rounded-full border border-brand-sage-200">
                      {item.mission.guideTitle}
                    </span>
                    <span className="text-xs font-black text-brand-terracotta-600">
                      +{item.mission.xp} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {item.mission.title}
                  </h3>
                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    {item.mission.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-brand-sand-200">
                    <span className="text-[11px] text-stone-500 font-medium">
                      ⏱️ {item.mission.durationMinutes} min
                    </span>

                    {isDone ? (
                      <span className="text-xs font-bold text-brand-sage-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-brand-sage-600" />
                        Completada
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleCompleteMission(item.id)}
                        variant="sage"
                        size="xs"
                      >
                        Completar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
