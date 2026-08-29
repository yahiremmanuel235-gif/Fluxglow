import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { useToast } from '../common/Toast';
import { 
  getStoredMissions, 
  completeDailyMission, 
  calculateMissionStreak 
} from '../../utils/missionsManager';
import { UserDailyMissionRecord, ViewMode } from '../../types';
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

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<'7d' | '14d' | '30d'>('7d');
  
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
    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    return () => window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
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

  // 1. Monthly Learning Growth Data (Ene a Jun)
  const learningMonthlyData = [
    { month: 'Ene', guias: 6 },
    { month: 'Feb', guias: 11 },
    { month: 'Mar', guias: 14 },
    { month: 'Abr', guias: 19 },
    { month: 'May', guias: 24 },
    { month: 'Jun', guias: 28 },
  ];

  // 2. Topics of Interest (Donut Pie Chart)
  const topicsData = [
    { name: 'Resiliencia', value: 33, color: '#548c71' }, // Sage Green
    { name: 'Inteligencia Emocional', value: 28, color: '#3d6753' }, // Deep Sage
    { name: 'Productividad', value: 18, color: '#de6943' }, // Terracotta
    { name: 'Finanzas', value: 12, color: '#84cc16' }, // Lime Green
    { name: 'Otras', value: 9, color: '#eab308' }, // Yellow
  ];

  // 3. 30-Day Emotional Evolution Data across the 5 bands (June has 30 days)
  // Bands: 5: Felicidad, 4: Tranquilidad, 3: Preocupación, 2: Tristeza, 1: Enojo
  const monthlyMoodPath = [
    { day: 1, val: 5, mood: 'Felicidad', date: '01 Jun', note: 'Buen inicio de mes' },
    { day: 2, val: 4, mood: 'Tranquilidad', date: '02 Jun', note: 'Paseo al aire libre' },
    { day: 3, val: 4, mood: 'Tranquilidad', date: '03 Jun', note: 'Lectura guiada' },
    { day: 4, val: 3, mood: 'Preocupación', date: '04 Jun', note: 'Pendientes acumulados' },
    { day: 5, val: 3, mood: 'Preocupación', date: '05 Jun', note: 'Reunión de trabajo' },
    { day: 6, val: 2, mood: 'Tristeza', date: '06 Jun', note: 'Cansancio acumulado' },
    { day: 7, val: 3, mood: 'Preocupación', date: '07 Jun', note: 'Descanso activo' },
    { day: 8, val: 4, mood: 'Tranquilidad', date: '08 Jun', note: 'Meditación matutina' },
    { day: 9, val: 5, mood: 'Felicidad', date: '09 Jun', note: 'Completé proyecto' },
    { day: 10, val: 5, mood: 'Felicidad', date: '10 Jun', note: 'Salida con amigos' },
    { day: 11, val: 4, mood: 'Tranquilidad', date: '11 Jun', note: 'Día sereno' },
    { day: 12, val: 3, mood: 'Preocupación', date: '12 Jun', note: 'Examen académico' },
    { day: 13, val: 2, mood: 'Tristeza', date: '13 Jun', note: 'Insomnio leve' },
    { day: 14, val: 1, mood: 'Enojo', date: '14 Jun', note: 'Discusión externa' },
    { day: 15, val: 3, mood: 'Preocupación', date: '15 Jun', note: 'Respiración diafragmática' },
    { day: 16, val: 4, mood: 'Tranquilidad', date: '16 Jun', note: 'Retorno a la calma' },
    { day: 17, val: 5, mood: 'Felicidad', date: '17 Jun', note: 'Excelente sesión terapéutica' },
    { day: 18, val: 4, mood: 'Tranquilidad', date: '18 Jun', note: 'Hábitos consistentes' },
    { day: 19, val: 4, mood: 'Tranquilidad', date: '19 Jun', note: 'Buen descanso' },
    { day: 20, val: 5, mood: 'Felicidad', date: '20 Jun', note: 'Logro de meta mensual' },
    { day: 21, val: 5, mood: 'Felicidad', date: '21 Jun', note: 'Día familiar cálido' },
    { day: 22, val: 4, mood: 'Tranquilidad', date: '22 Jun', note: 'Planificación semanal' },
    { day: 23, val: 3, mood: 'Preocupación', date: '23 Jun', note: 'Cierre de entregables' },
    { day: 24, val: 4, mood: 'Tranquilidad', date: '24 Jun', note: 'Caminata en parque' },
    { day: 25, val: 5, mood: 'Felicidad', date: '25 Jun', note: 'Gran energía y foco' },
    { day: 26, val: 4, mood: 'Tranquilidad', date: '26 Jun', note: 'Noche de lectura' },
    { day: 27, val: 5, mood: 'Felicidad', date: '27 Jun', note: 'Reconocimiento laboral' },
    { day: 28, val: 5, mood: 'Felicidad', date: '28 Jun', note: 'Plena satisfacción' },
    { day: 29, val: 4, mood: 'Tranquilidad', date: '29 Jun', note: 'Reflexión en diario' },
    { day: 30, val: 5, mood: 'Felicidad', date: '30 Jun', note: 'Cierre de mes en bienestar óptimo' },
  ];

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="text-xs font-semibold text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#548c71]" />
            <span>Periodo: Junio 2026</span>
          </div>
        </div>

        {/* Big Display Title: Análisis Predictivo */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Análisis </span>
            <span className="text-[#de6943]">Predictivo</span>
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">Métricas de evolución cognitiva y modelos de estabilidad emocional</p>
        </div>

        {/* 2 Large Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* CARD 1 (LEFT): Aprendizaje y Conocimiento */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header inside Card 1 */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                    Aprendizaje y Conocimiento
                  </h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-stone-900">28 ↑</span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-600">
                      Guías completadas este mes
                    </span>
                  </div>
                  <p className="text-xs text-[#548c71] font-bold mt-0.5">
                    +53% Más que el mes anterior
                  </p>
                </div>

                <button
                  id="weekly-summary-btn"
                  onClick={() => setShowWeeklySummary(!showWeeklySummary)}
                  className="bg-[#faf8f4] hover:bg-stone-100 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition-all shrink-0 cursor-pointer"
                >
                  {showWeeklySummary ? 'Ocultar resumen' : 'Mostrar resumen semanal'}
                </button>
              </div>

              {/* Weekly summary drawer if opened */}
              {showWeeklySummary && (
                <div className="my-4 p-3 bg-[#e2eee6] border border-[#548c71]/30 rounded-2xl text-xs text-[#253d33] animate-fadeIn">
                  <p className="font-bold mb-1">Resumen Semanal de Progreso:</p>
                  <p>Completaste 7 micro-módulos y mantuviste 5 días seguidos de hábitos de respiración activa.</p>
                </div>
              )}

              {/* Bottom Visuals Split: Monthly Trend Chart & Topics Donut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                
                {/* Left Sub-chart: Line curve over months */}
                <div className="flex flex-col justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
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
                        <YAxis hide domain={[0, 30]} />
                        <Tooltip 
                          formatter={(val: any) => [`${val} guías`, 'Completadas']}
                          contentStyle={{ borderRadius: 12, fontSize: 11, border: '1px solid #e7e5e4' }}
                        />
                        <Area type="monotone" dataKey="guias" stroke="#548c71" strokeWidth={3} fillOpacity={1} fill="url(#learnGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Sub-chart: Temas de Interés (Donut) */}
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                    Temas de Interés
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
                          formatter={(val: any) => [`${val}%`, 'Interés']}
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
            <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-[#548c71]" />
                Enfoque cognitivo fortalecido
              </span>
              <span className="font-bold text-stone-800">Índice: 88/100</span>
            </div>
          </div>

          {/* CARD 2 (RIGHT): Evolución Emocional across 5 colored bands */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
                  Evolución Emocional
                </h2>
                <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2.5 py-1 rounded-full">
                  1 - 30 Días de Junio
                </span>
              </div>

              {/* Band Legend Labels */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-700 mb-2 px-1">
                <span className="flex items-center gap-1 text-amber-700">⭐ Felicidad</span>
                <span className="flex items-center gap-1 text-[#3d6753]">🍃 Calma</span>
                <span className="flex items-center gap-1 text-orange-700">❓ Inquietud</span>
                <span className="flex items-center gap-1 text-blue-700">💧 Tristeza</span>
                <span className="flex items-center gap-1 text-red-700">🔥 Tensión</span>
              </div>

              {/* Multi-colored Banded Graph Container */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
                {/* 5 Background Color Bands */}
                <div className="absolute inset-0 grid grid-rows-5 pointer-events-none opacity-30">
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
                                <p className="font-bold text-[#f59e0b]">Día {data.day} ({data.date})</p>
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
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#de6943]" />
                Tendencia Predominante: <strong className="text-[#548c71]">Felicidad & Calma (77%)</strong>
              </span>
              <span className="text-stone-400 text-[11px]">
                30 días analizados
              </span>
            </div>

          </div>

        </div>

        {/* SECTION 3: Tarjeta de Pronóstico Emocional Inteligente */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#548c71]"></span>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                  Pronóstico de Estabilidad Emocional
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Estimación predictiva basada en tus patrones de registro de las últimas semanas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['7d', '14d', '30d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setForecastPeriod(period)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    forecastPeriod === period
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {period === '7d' ? '7 días' : period === '14d' ? '14 días' : '30 días'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {/* Risk Gauge Card */}
            <div className="p-5 rounded-2xl bg-[#e2eee6] border border-[#548c71]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#253d33]">Nivel de Riesgo</span>
                  <ShieldCheck className="w-4 h-4 text-[#548c71]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1f332b]">Riesgo Bajo (12%)</h3>
                <p className="text-xs text-[#2e4c3f] mt-1 leading-relaxed">
                  Excelente consistencia. Tus factores protectores (sueño y pausas activas) superan los picos de estrés.
                </p>
              </div>
              <div className="w-full bg-white/60 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-[#548c71] h-full rounded-full w-[12%]"></div>
              </div>
            </div>

            {/* Cognitive Battery */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Batería Mental Proyectada</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-amber-950">84% Energía</h3>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Tendencia favorable para afrontar nuevos retos y compromisos con claridad mental.
                </p>
              </div>
              <div className="w-full bg-amber-200/60 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-[#de6943] h-full rounded-full w-[84%]"></div>
              </div>
            </div>

            {/* AI Preventative Action */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Acción Preventiva</span>
                  <CheckCircle2 className="w-4 h-4 text-[#548c71]" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Cierre de semana consciente</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Planifica una desconexión digital de 2 horas el viernes para mantener tu tasa de serenidad.
                </p>
              </div>
              <span className="text-[11px] text-stone-500 font-medium mt-3">Recomendación automatizada</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Mis Misiones Diarias (Golden / Warm Amber System) */}
        <div className="mt-8 bg-amber-50/60 rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-amber-200/70">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-950 font-serif">
                    Mis Misiones Diarias
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5">
                    Retos prácticos completados a partir de tus guías de Explora y Aprende.
                  </p>
                </div>
              </div>
            </div>

            {/* Streak & Achievements Counter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-white px-4 py-2 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
                <div>
                  <div className="text-xs font-extrabold text-amber-950">
                    🔥 {streakDays} {streakDays === 1 ? 'día seguido' : 'días seguidos'}
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium">
                    Racha activa de hábitos
                  </span>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-2">
                <Award className="w-5 h-5 text-[#548c71]" />
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
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-white/80 border border-amber-200 text-amber-900 hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-bold text-[#548c71] hover:text-[#43705a] flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs self-start sm:self-auto"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explorar más guías y activar misiones</span>
              </button>
            )}
          </div>

          {/* Missions List */}
          {filteredMissions.length === 0 ? (
            <div className="bg-white/90 rounded-2xl border border-amber-200 p-8 text-center my-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900">
                No hay misiones en esta sección
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                Visita el módulo de Explora y Aprende, abre cualquier guía interactiva y activa su misión diaria recomendada.
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('learn')}
                  className="bg-[#548c71] hover:bg-[#43705a] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ir a Explora y Aprende</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {filteredMissions.map((mission) => {
                const isDone = mission.status === 'completed';
                return (
                  <div
                    key={mission.id}
                    id={`mission-card-${mission.id}`}
                    className={`rounded-2xl p-4.5 border transition-all flex flex-col justify-between ${
                      isDone
                        ? 'bg-white/95 border-emerald-200 shadow-2xs'
                        : 'bg-white border-amber-300/80 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {mission.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mission.timeEstimate}
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                            +{mission.xp} XP
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {mission.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {mission.description}
                      </p>
                      
                      <p className="text-[11px] text-stone-400 mt-2 italic line-clamp-1">
                        Origen: {mission.guideTitle}
                      </p>
                    </div>

                    {/* Bottom Status & Actions */}
                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Completada hoy</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteMission(mission.id)}
                          className="bg-[#de6943] hover:bg-[#c55835] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marcar como hecha (+{mission.xp} XP)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

