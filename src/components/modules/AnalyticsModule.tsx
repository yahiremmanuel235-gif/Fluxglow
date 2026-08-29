import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
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

export const AnalyticsModule: React.FC = () => {
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<'7d' | '14d' | '30d'>('7d');

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

      </div>
    </div>
  );
};

