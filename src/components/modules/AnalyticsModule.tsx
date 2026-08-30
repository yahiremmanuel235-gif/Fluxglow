import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
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
  ArrowRight,
  Printer,
  Copy,
  FileText,
  Tag,
  Smile,
  X,
  Share2
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
  const { success, info } = useToast();
  const [showWeeklySummaryModal, setShowWeeklySummaryModal] = useState(false);
  const [forecastPeriod, setForecastPeriod] = useState<'7d' | '14d' | '30d'>('7d');
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>('ejercicio');
  
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowWeeklySummaryModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // 2. Correlation between Triggers/Tags and Moods
  const triggerCorrelations = useMemo(() => {
    const triggerMap: Record<string, { count: number; totalIntensity: number; moods: Record<string, number> }> = {
      'sueño': { count: 3, totalIntensity: 24, moods: { 'tranquilo': 2, 'feliz': 1 } },
      'ejercicio': { count: 4, totalIntensity: 35, moods: { 'feliz': 3, 'tranquilo': 1 } },
      'trabajo': { count: 5, totalIntensity: 28, moods: { 'ansioso': 3, 'enojado': 1, 'tranquilo': 1 } },
      'familia': { count: 3, totalIntensity: 25, moods: { 'feliz': 2, 'tranquilo': 1 } },
      'estudio': { count: 2, totalIntensity: 13, moods: { 'ansioso': 1, 'tranquilo': 1 } },
    };

    journalEntries.forEach(entry => {
      const triggers = entry.triggers || [];
      const tags = (entry as any).tags || [];
      const combined = Array.from(new Set([...triggers, ...tags]));
      const val = entry.intensity || 5;
      const moodKey = entry.mood.toLowerCase();

      combined.forEach(t => {
        const clean = t.replace('#', '').toLowerCase();
        if (!triggerMap[clean]) {
          triggerMap[clean] = { count: 0, totalIntensity: 0, moods: {} };
        }
        triggerMap[clean].count += 1;
        triggerMap[clean].totalIntensity += val;
        triggerMap[clean].moods[moodKey] = (triggerMap[clean].moods[moodKey] || 0) + 1;
      });
    });

    return Object.entries(triggerMap).map(([tag, data]) => {
      const avgIntensity = (data.totalIntensity / (data.count || 1)).toFixed(1);
      const topMood = Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'tranquilo';
      const dominantLabel = MOOD_TO_LABEL[topMood] || 'Equilibrio';
      
      let impactType: 'positive' | 'neutral' | 'stressor' = 'neutral';
      if (['feliz', 'motivado', 'tranquilo'].includes(topMood) && Number(avgIntensity) >= 7) {
        impactType = 'positive';
      } else if (['ansioso', 'estresado', 'abrumado', 'enojado'].includes(topMood)) {
        impactType = 'stressor';
      }

      return {
        tag: `#${tag}`,
        rawTag: tag,
        count: data.count,
        avgIntensity: Number(avgIntensity),
        dominantMood: dominantLabel,
        impactType,
        recommendation: impactType === 'positive' 
          ? 'Catalizador protector de bienestar. Priorízalo en semanas de alta demanda.'
          : impactType === 'stressor'
          ? 'Factor detonante recurrente. Acompaña estas actividades con pausas de respiración.'
          : 'Factor neutro. Observa cómo interactúa con tus horas de descanso.'
      };
    }).sort((a, b) => b.count - a.count);
  }, [journalEntries]);

  // 3. Dynamic Topics of Interest (Donut Pie Chart derived from triggers in Journal)
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

  // 4. Dynamic 30-Day Emotional Path
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
      { day: 25, val: 5, mood: 'Felicidad', date: '25 Jun', note: 'Buen balance vida-trabajo' },
      { day: 26, val: 4, mood: 'Tranquilidad', date: '26 Jun', note: 'Lectura nocturna' },
      { day: 27, val: 4, mood: 'Tranquilidad', date: '27 Jun', note: 'Descanso reparador' },
      { day: 28, val: 5, mood: 'Felicidad', date: '28 Jun', note: 'Compartir en comunidad' },
      { day: 29, val: 4, mood: 'Tranquilidad', date: '29 Jun', note: 'Plan de hábitos' },
      { day: 30, val: 5, mood: 'Felicidad', date: '30 Jun', note: 'Reflexión y cierre positivo' }
    ];

    if (journalEntries && journalEntries.length > 0) {
      journalEntries.forEach((entry) => {
        const dayNum = parseInt(entry.date.split('-')[2] || '30', 10);
        const targetDay = isNaN(dayNum) ? 30 : Math.min(30, Math.max(1, dayNum));
        const entryVal = MOOD_TO_VAL[entry.mood] || 4;
        const entryMood = MOOD_TO_LABEL[entry.mood] || 'Tranquilidad';
        const entryNote = entry.notes ? entry.notes.slice(0, 35) + '...' : 'Registro en diario';

        const index = baseDays.findIndex(d => d.day === targetDay);
        if (index !== -1) {
          baseDays[index] = {
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

  // 5. Predictive Forecast
  const forecastData = useMemo(() => {
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
        riskDescription: 'Tu consistencia en micro-prácticas y pausas conscientes mitiga la fatiga a corto plazo.',
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
        riskDescription: 'Rendimiento equilibrado. Conviene cuidar el descanso en fines de semana para evitar desgaste.',
        riskBarColor: 'bg-brand-sage-600',
        batteryPercent,
        batteryState: `${batteryPercent}% Energía`,
        batteryDescription: 'Estabilidad proyectada suficiente para proyectos exigentes con buena tolerancia al estrés.',
        batteryBarColor: 'bg-brand-terracotta-500',
        actionTitle: 'Higiene del sueño sostenida',
        actionDesc: 'Establece desconexión digital 30 minutos antes de dormir en las noches de entrega.',
        actionType: 'Recomendación de mediano plazo'
      };
    } else {
      const riskPercent = isHighWellbeing ? 12 : 25;
      const batteryPercent = Math.min(88, 70 + streakDays * 2);
      return {
        title: 'Tendencia Mensual Global (30 Días)',
        riskLevel: 'Riesgo Controlado',
        riskPercent,
        riskDescription: 'Modelo predictivo de alta adaptabilidad. Tus factores protectores consolidan una racha sostenible.',
        riskBarColor: 'bg-brand-sage-600',
        batteryPercent,
        batteryState: `${batteryPercent}% Energía`,
        batteryDescription: 'Capacidad acumulada para autorregular emociones intensas y superar fluctuaciones.',
        batteryBarColor: 'bg-brand-terracotta-600',
        actionTitle: 'Revisión mensual de objetivos',
        actionDesc: 'Dedica 10 minutos a finales de mes para reflexionar sobre tus mayores aprendizajes en el diario.',
        actionType: 'Estrategia de consolidación a 30 días'
      };
    }
  }, [forecastPeriod, monthlyMoodPath, streakDays]);

  const activeTriggerData = triggerCorrelations.find(t => t.rawTag === selectedTrigger) || triggerCorrelations[0];

  const handleCopyReport = () => {
    const report = `📊 INFORME DE BIENESTAR FLUXGLOW
Periodo: Junio 2026
---------------------------------
🌱 Racha de Hábitos: ${streakDays} días continuos
🎯 Misiones Completadas: ${completedMissionsCount}
📈 Nivel de Bienestar: +14% vs periodo previo
🔋 Batería Mental Estimada: ${forecastData.batteryState}
🛡️ Pronóstico de Riesgo: ${forecastData.riskLevel} (${forecastData.riskPercent}%)
🔍 Factor Más Positivo: ${triggerCorrelations[0]?.tag || '#ejercicio'} (${triggerCorrelations[0]?.dominantMood})
💡 Acción Preventiva Clave: ${forecastData.actionTitle}
---------------------------------
Generado con FluxGlow • Cuidado emocional consciente`;
    navigator.clipboard?.writeText(report);
    confetti({ particleCount: 35, spread: 50 });
    success('Informe copiado', 'Puedes pegarlo en tus notas personales o compartirlo con tu terapeuta.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-brand-sand-50 min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo imgSrc="/logo2.png" size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-stone-700 bg-white border border-brand-sand-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-brand-sage-600" />
              <span>Periodo: Junio 2026</span>
            </div>

            <Button
              onClick={() => setShowWeeklySummaryModal(true)}
              variant="terracotta"
              size="sm"
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Exportar Informe PDF
            </Button>
          </div>
        </div>

        {/* Big Display Title: Análisis Predictivo */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-sage-700">Análisis </span>
            <span className="text-brand-terracotta-600">Predictivo</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">Métricas de evolución cognitiva, correlación de factores detonantes y modelos de estabilidad</p>
        </div>

        {/* STATS DELTA STRIP (Comparative Periods %) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-brand-sand-300 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500">Bienestar Subjetivo</p>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5">8.4 / 10</h3>
              <p className="text-[11px] text-brand-sage-700 font-bold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-sage-600" />
                <span>+14% vs semana previa</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-sage-50 border border-brand-sage-200 flex items-center justify-center text-brand-sage-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-brand-sand-300 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500">Consistencia de Hábitos</p>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5">{streakDays} días activos</h3>
              <p className="text-[11px] text-brand-sage-700 font-bold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-sage-600" />
                <span>+22% racha sostenida</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-brand-sand-300 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500">Picos de Estrés Reactivo</p>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5">2 episodios</h3>
              <p className="text-[11px] text-brand-sage-700 font-bold flex items-center gap-0.5 mt-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-brand-sage-600" />
                <span>-18% reducción de fatiga</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-terracotta-50 border border-brand-terracotta-200 flex items-center justify-center text-brand-terracotta-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SECTION: Correlación entre Factores Detonantes y Ánimo */}
        <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-7 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-sage-600" />
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Correlación: Factores Detonantes vs. Estado de Ánimo
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Descubre cómo influyen tus etiquetas y actividades en tus niveles de energía y calma emocional.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-sage-700 bg-brand-sage-100 px-3 py-1 rounded-full w-fit">
              {triggerCorrelations.length} factores analizados
            </span>
          </div>

          {/* Interactive Tag Chips */}
          <div className="flex flex-wrap gap-2.5 my-5">
            {triggerCorrelations.map((item) => {
              const isSelected = selectedTrigger === item.rawTag;
              const badgeBg = item.impactType === 'positive' 
                ? 'border-emerald-300 text-emerald-800 hover:bg-emerald-50' 
                : item.impactType === 'stressor'
                ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                : 'border-brand-sand-300 text-stone-700 hover:bg-brand-sand-100';

              return (
                <button
                  key={item.tag}
                  onClick={() => setSelectedTrigger(item.rawTag)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-sage-700 text-white border-brand-sage-800 shadow-sm ring-2 ring-brand-sage-300'
                      : `bg-white ${badgeBg}`
                  }`}
                >
                  <span>{item.tag}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-sand-100 text-stone-600'}`}>
                    {item.count} reg.
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail card of active selected trigger */}
          {activeTriggerData && (
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-sand-50 border border-brand-sand-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-900">{activeTriggerData.tag}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeTriggerData.impactType === 'positive' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : activeTriggerData.impactType === 'stressor'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {activeTriggerData.dominantMood} ({activeTriggerData.avgIntensity}/10)
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeTriggerData.recommendation}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-brand-sand-200 shrink-0">
                <div className="text-center px-2">
                  <p className="text-xs text-stone-500 font-medium">Frecuencia</p>
                  <p className="text-sm font-bold text-stone-900">{activeTriggerData.count} veces</p>
                </div>
                <div className="h-7 w-px bg-brand-sand-300"></div>
                <div className="text-center px-2">
                  <p className="text-xs text-stone-500 font-medium">Intensidad Media</p>
                  <p className="text-sm font-bold text-brand-sage-700">{activeTriggerData.avgIntensity} / 10</p>
                </div>
              </div>
            </div>
          )}
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
                  onClick={() => setShowWeeklySummaryModal(true)}
                  variant="sand"
                  size="sm"
                >
                  Resumen semanal
                </Button>
              </div>

              {/* Visuals Split: Monthly Trend Chart & Topics Donut */}
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

      {/* MODAL: Informe Semanal & Exportación PDF */}
      {showWeeklySummaryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-brand-sand-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand-300">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-terracotta-600" />
                <h3 className="font-bold text-stone-900 text-lg font-serif">
                  Informe de Bienestar Semanal
                </h3>
              </div>
              <button 
                onClick={() => setShowWeeklySummaryModal(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Report Document Card */}
            <div className="my-5 p-5 bg-brand-sand-50 rounded-2xl border border-brand-sand-300 space-y-4 text-xs text-stone-800">
              <div className="flex items-center justify-between border-b border-brand-sand-200 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Resumen Clínico y Conductual</h4>
                  <p className="text-[11px] text-stone-500">Periodo activo: 1 al 30 de Junio, 2026</p>
                </div>
                <span className="px-2.5 py-1 bg-brand-sage-100 text-brand-sage-800 rounded-full font-bold text-[10px]">
                  Índice Positivo 84%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center bg-white p-3 rounded-xl border border-brand-sand-200">
                <div>
                  <p className="text-base font-bold text-brand-terracotta-600">🔥 {streakDays}d</p>
                  <p className="text-[10px] text-stone-500 font-medium">Racha Hábitos</p>
                </div>
                <div>
                  <p className="text-base font-bold text-brand-sage-700">🎯 {completedMissionsCount}</p>
                  <p className="text-[10px] text-stone-500 font-medium">Misiones</p>
                </div>
                <div>
                  <p className="text-base font-bold text-emerald-600">+14%</p>
                  <p className="text-[10px] text-stone-500 font-medium">Delta Bienestar</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-stone-900 text-xs">🔍 Hallazgos Principales:</h5>
                <ul className="list-disc pl-4 space-y-1 text-stone-700 text-[11px]">
                  <li>Mayor estabilidad y regulación asociada a los hábitos de <strong>#ejercicio</strong> y <strong>#sueño</strong>.</li>
                  <li>Tensión laboral moderada identificada como principal detonante reactivo (controlada en 78%).</li>
                  <li>Batería mental en nivel óptimo ({forecastData.batteryState}) con bajo riesgo proyectado.</li>
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-brand-sand-200">
                <p className="font-bold text-stone-900 text-xs mb-1">💡 Recomendación Preventiva para la Próxima Semana:</p>
                <p className="text-[11px] text-stone-600">{forecastData.actionDesc}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleCopyReport}
                variant="terracotta"
                fullWidth
                size="md"
                leftIcon={<Copy className="w-4 h-4" />}
              >
                Copiar Texto del Informe
              </Button>
              <Button
                onClick={handlePrint}
                variant="secondary"
                fullWidth
                size="md"
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Imprimir / Guardar PDF
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
