import React, { useMemo, useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Flame, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Smile, 
  Heart, 
  Clock, 
  Zap, 
  Compass, 
  ShieldCheck, 
  Bot, 
  Bell, 
  TrendingUp, 
  Users, 
  Loader2, 
  RefreshCw, 
  ChevronRight, 
  Cloud, 
  UserPlus, 
  Lock,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { ViewMode, UserProfileData, MoodType, JournalEntry, UserDailyMissionRecord } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useJournal } from '../../hooks/useJournal';
import { useMissions } from '../../hooks/useMissions';
import { useToast } from '../common/Toast';
import { AuthModals } from '../common/AuthModals';

interface DashboardModuleProps {
  onNavigate: (view: ViewMode) => void;
  onOpenGuideById?: (guideId: string) => void;
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
}

interface MoodRecommendation {
  badge: string;
  title: string;
  message: string;
  guideId: string;
  guideTitle: string;
  guideSummary: string;
  recommendedMissionTitle: string;
  actionText: string;
  accentColor: string;
  bgLight: string;
  borderColor: string;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  onOpenGuideById,
  userProfile,
  onUpdateProfile
}) => {
  const { user, authLoading } = useAuth();
  const { success, info, warning } = useToast();

  // Auth modal state for guest users
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Hooks de datos reales sincronizados con Supabase y localStorage
  const { 
    entries, 
    loading: isJournalLoading, 
    error: journalError, 
    isUsingLocalFallback: isJournalFallback,
    refreshEntries 
  } = useJournal();

  const {
    missions,
    loading: isMissionsLoading,
    actionLoadingId,
    error: missionsError,
    isUsingLocalFallback: isMissionsFallback,
    userPoints,
    userLevel,
    streakDays,
    toggleCompleteMission,
    refreshMissions,
    isGuest
  } = useMissions(userProfile, onUpdateProfile);

  // 1. CÁLCULO DE PROGRESO REAL
  // Total de entradas escritas en el diario este mes
  const entriesThisMonth = useMemo(() => {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    return entries.filter(entry => {
      if (!entry.date) return false;
      const d = new Date(entry.date);
      return !isNaN(d.getTime()) && d.getMonth() === curMonth && d.getFullYear() === curYear;
    });
  }, [entries]);

  // Hábitos completados vs pendientes
  const completedMissions = useMemo(() => missions.filter(m => m.status === 'completed'), [missions]);
  const pendingMissions = useMemo(() => missions.filter(m => m.status === 'pending'), [missions]);
  const missionsProgressPercent = missions.length > 0 
    ? Math.round((completedMissions.length / missions.length) * 100) 
    : 0;

  // Última entrada de diario registrada
  const latestEntry: JournalEntry | null = entries.length > 0 ? entries[0] : null;

  // 2. MOTOR DE RECOMENDACIONES BASADO EN EL ESTADO EMOCIONAL
  const recommendation: MoodRecommendation = useMemo(() => {
    if (!latestEntry) {
      return {
        badge: 'Comienza tu viaje',
        title: 'Tu primer registro emocional',
        message: 'Aún no has registrado cómo te sientes hoy. Dedicar 2 minutos a nombrar tu estado interior disminuye la reactividad y aclara tus prioridades.',
        guideId: 'guide-mindfulness-7',
        guideTitle: 'Mindfulness y atención plena en la vida cotidiana',
        guideSummary: 'Aprende a pausar y conectar con el presente sin juzgar tus sensaciones.',
        recommendedMissionTitle: 'Suspiro Fisiológico Guiado',
        actionText: 'Escribir en el Diario Emocional',
        accentColor: '#548c71',
        bgLight: 'bg-[#548c71]/10',
        borderColor: 'border-[#548c71]/30'
      };
    }

    const moodStr = String(latestEntry.mood || '').toLowerCase().trim();

    // Categoría: Estrés / Ansiedad / Tensión / Enojo / Abrumado
    if (moodStr.includes('ansios') || moodStr.includes('estres') || moodStr.includes('abrumad') || moodStr.includes('enojad')) {
      return {
        badge: 'Regulación del Sistema Nervioso',
        title: `Atención preventiva para tu estado de ${latestEntry.mood}`,
        message: 'Detectamos que tu última reflexión reflejaba tensión o sobrecarga. Tu cuerpo necesita una señal somática de seguridad antes de continuar exigiendo concentración.',
        guideId: 'guide-stress-1',
        guideTitle: '5 estrategias para regular el estrés antes de que te controle',
        guideSummary: 'Desactiva la respuesta simpática mediante el suspiro fisiológico y vaciado mental estructurado.',
        recommendedMissionTitle: 'Suspiro Fisiológico Guiado',
        actionText: 'Abrir Guía contra el Estrés',
        accentColor: '#de6943',
        bgLight: 'bg-amber-500/10',
        borderColor: 'border-amber-400/40'
      };
    }

    // Categoría: Tristeza / Desánimo / Agotamiento
    if (moodStr.includes('trist') || moodStr.includes('cansad') || moodStr.includes('desmotivad')) {
      return {
        badge: 'Cuidado y Autocompasión',
        title: `Acompañando tu momento de ${latestEntry.mood}`,
        message: 'Sentir tristeza o cansancio es una respuesta natural de tu mente pidiendo descanso. Hoy trátate con la misma ternura y paciencia con la que tratarías a un buen amigo.',
        guideId: 'guide-sleep-6',
        guideTitle: 'Higiene del sueño para mentes activas y universitarias',
        guideSummary: 'Restaura tus reservas de energía y reduce la rumiación nocturna con hábitos de sueño saludables.',
        recommendedMissionTitle: 'Filtro de luz cálida nocturno',
        actionText: 'Explorar Higiene del Sueño',
        accentColor: '#548c71',
        bgLight: 'bg-emerald-500/10',
        borderColor: 'border-emerald-300'
      };
    }

    // Categoría: Bienestar / Feliz / Tranquilo / Motivado
    return {
      badge: 'Consolidación Positiva',
      title: `Impulsa tu balance de ${latestEntry.mood}`,
      message: '¡Excelente equilibrio! Cuando la mente está serena y con energía, es el momento idóneo para afianzar hábitos de concentración profunda y creatividad.',
      guideId: 'guide-productivity-5',
      guideTitle: 'Concentración profunda sin distracciones digitales',
      guideSummary: 'Canaliza tu enfoque con bloques pomodoro monotarea y gestión del tiempo libre de ruidos.',
      recommendedMissionTitle: 'Bloque Pomodoro Monotarea',
      actionText: 'Explorar Enfoque Profundo',
      accentColor: '#548c71',
      bgLight: 'bg-emerald-500/10',
      borderColor: 'border-emerald-300'
    };
  }, [latestEntry]);

  // Completar misión rápida directamente desde el Dashboard
  const handleToggleMission = async (mId: string, curStatus: string) => {
    if (actionLoadingId) return;
    const isCompleting = curStatus === 'pending';
    const res = await toggleCompleteMission(mId, curStatus);

    if (res.success) {
      if (isCompleting) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.8 }
        });
        success('¡Hábito cumplido! 🎉', `+${res.xpEarned} XP acumulados. Racha actual: ${res.streakDays} días.`);
      } else {
        info('Hábito reactivado', 'Marcado como pendiente nuevamente.');
      }
    } else {
      warning('Aviso', 'No se pudo sincronizar el estado del hábito. Revisa tu conexión.');
    }
  };

  // Recarga general de datos
  const handleRefreshAll = () => {
    refreshEntries();
    refreshMissions();
    info('Actualizando datos', 'Sincronizando información más reciente...');
  };

  // Saludo según la hora del día
  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const userName = userProfile?.name || user?.user_metadata?.name || 'Explorador';

  return (
    <div className="w-full bg-flux-brand-bath min-h-screen pb-24 pt-4 px-4 sm:px-6 lg:px-8 text-stone-800">
      <div className="max-w-[1280px] mx-auto space-y-6">

        {/* 1. TOP BAR HEADER: Marca, Estado de Conexión y Accesos directos */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-[#5F927B]/20">
          <div className="flex items-center gap-2">
            <FluxGlowLogo size="xs" showText={true} />
            <span className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-0.5 rounded-full ml-1 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#5F927B] animate-pulse" />
              <span>Centro de Control</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Estado de sincronización en tiempo real */}
            {authLoading || isJournalLoading || isMissionsLoading ? (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 px-2.5 py-1 rounded-full shadow-2xs">
                <Loader2 className="w-3 h-3 animate-spin text-[#5F927B]" />
                <span className="hidden sm:inline">Sincronizando...</span>
              </div>
            ) : user && (isJournalFallback || isMissionsFallback) ? (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shadow-2xs" title="Mostrando copia local por interrupción de conexión">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Respaldo Local (Offline)</span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#5F927B] animate-pulse"></span>
                <span>Supabase Conectado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#E87A52]"></span>
                <span>Modo Exploración (Local)</span>
              </div>
            )}

            {/* Recargar datos */}
            <button
              id="dashboard-refresh-btn"
              onClick={handleRefreshAll}
              title="Refrescar datos del Centro de Control"
              className="p-1.5 rounded-full text-stone-500 hover:text-[#5F927B] bg-white border border-stone-200 hover:border-[#5F927B]/50 hover:bg-[#EBF1EA]/50 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. GUEST NOTICE BANNER (si !user) */}
        {isGuest && !user && (
          <div className="bg-gradient-to-r from-[#FDF4F0] via-[#FAF7F2] to-[#EBF1EA] border-2 border-[#E87A52]/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center shrink-0 text-[#B54F2C] mt-0.5 shadow-2xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Modo Exploración Activo</span>
                  <span className="text-[10px] bg-[#E87A52] text-white px-2 py-0.5 rounded-full font-extrabold uppercase shadow-2xs">
                    Sin Cuenta
                  </span>
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
                  Tus misiones y reflexiones se están guardando localmente en este navegador. Crea una cuenta gratuita para sincronizar tus logros en Supabase y acceder desde cualquier dispositivo.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                id="dashboard-guest-register-btn"
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-[#5F927B] hover:bg-[#4D7764] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear Cuenta Gratis</span>
              </button>
              <button
                id="dashboard-guest-login-btn"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FDF4F0] text-[#B54F2C] text-xs font-bold border border-[#F7D3C3] transition-all shadow-2xs flex items-center justify-center cursor-pointer"
              >
                <span>Iniciar Sesión</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. HERO GREETING & STATUS BANNER (Bathed in Sage Green & Terracotta) */}
        <div className="bg-gradient-to-r from-white via-[#FBF9F5] to-white rounded-3xl border-2 border-[#5F927B]/30 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle brand ambient orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#5F927B]/10 via-[#E87A52]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#E87A52]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B]" />
                  <span>{greetingTime}</span>
                </span>
                {latestEntry && (
                  <span className="text-xs text-stone-500 font-medium">
                    • Último registro: {latestEntry.date}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 font-sans tracking-tight">
                Hola, <span className="bg-gradient-to-r from-[#3E6855] via-[#5F927B] to-[#E87A52] bg-clip-text text-transparent">{userName}</span>
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal">
                {latestEntry ? (
                  <>
                    Tu última reflexión en el diario registró un estado de <strong className="text-[#3E6855] capitalize font-bold">{latestEntry.mood}</strong> (intensidad {latestEntry.intensity}/10). Revisa tus recomendaciones personalizadas para equilibrar tu día.
                  </>
                ) : (
                  <>
                    Bienvenido a tu centro de control integral. Registra tu estado emocional de hoy o completa tus hábitos diarios para mantener tu bienestar y acumular experiencia.
                  </>
                )}
              </p>
            </div>

            {/* Quick action buttons with brand colors and local icons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                id="hero-quick-journal-btn"
                onClick={() => onNavigate('journal')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-[#5F927B] hover:bg-[#4D7764] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <img src="/assets/icons/send.png" alt="Escribir" className="w-4 h-4 object-contain brightness-0 invert group-hover:translate-x-0.5 transition-transform" />
                <span>Escribir en Diario</span>
              </button>
              <button
                id="hero-quick-missions-btn"
                onClick={() => onNavigate('missions')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-[#E87A52] hover:bg-[#D4653E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <img src="/assets/icons/medal.png" alt="Misiones" className="w-4 h-4 object-contain brightness-0 invert group-hover:scale-105 transition-transform" />
                <span>Ver Misiones</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. REAL PROGRESS METRIC CARDS (Bathed in Sage Green and Terracotta Orange) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Tarjeta 1: Entradas este mes (Sage Green Theme) */}
          <div 
            onClick={() => onNavigate('journal')}
            className="bg-gradient-to-br from-white to-[#F2F7F4] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#5F927B]/30 hover:border-[#5F927B] shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E6855] truncate">
                Diario este Mes
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <img src="/assets/icons/nav-journal.png" alt="Diario" className="w-4 h-4 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3E6855] font-serif">
                  {entriesThisMonth.length}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-stone-500">
                  {entriesThisMonth.length === 1 ? 'entrada' : 'entradas'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#3E6855] mt-1 flex items-center gap-1 font-semibold">
                <span>Total: {entries.length}</span>
                <ChevronRight className="w-3 h-3 text-[#5F927B] group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Hábitos completados (Sage Green Theme) */}
          <div 
            onClick={() => onNavigate('missions')}
            className="bg-gradient-to-br from-white to-[#F2F7F4] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#5F927B]/30 hover:border-[#5F927B] shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E6855] truncate">
                Hábitos Hoy
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <img src="/assets/badges/badge-explorer.png" alt="Hábitos" className="w-5 h-5 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 font-serif">
                  {completedMissions.length}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-stone-500">
                  de {missions.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#EBF1EA] rounded-full h-2 mt-2 overflow-hidden border border-[#C5DDD0]/50">
                <div 
                  className="bg-gradient-to-r from-[#5F927B] to-[#3E6855] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${missionsProgressPercent}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                <span className="font-semibold text-[#3E6855]">{missionsProgressPercent}%</span>
                <span className="text-[#E87A52] font-bold">{pendingMissions.length} pend.</span>
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Nivel y XP Acumulado (Terracotta Theme) */}
          <div 
            onClick={() => onNavigate('missions')}
            className="bg-gradient-to-br from-white to-[#FDF4F0] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#E87A52]/30 hover:border-[#E87A52] shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B54F2C] truncate">
                Nivel & XP
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <img src="/assets/icons/trophy.png" alt="XP" className="w-4 h-4 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B54F2C] font-serif">
                  +{userPoints}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#E87A52]">XP</span>
              </div>
              {/* Level Progress */}
              <div className="w-full bg-[#FDF4F0] rounded-full h-2 mt-2 overflow-hidden border border-[#F7D3C3]/50">
                <div 
                  className="bg-gradient-to-r from-[#E87A52] to-[#B54F2C] h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${userPoints % 100}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                <span className="font-bold text-[#B54F2C]">Nv. {userLevel}</span>
                <span>Faltan {100 - (userPoints % 100)} XP</span>
              </p>
            </div>
          </div>

          {/* Tarjeta 4: Racha Activa (Terracotta Orange Theme) */}
          <div 
            onClick={() => onNavigate('missions')}
            className="bg-gradient-to-br from-white to-[#FDF4F0] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#E87A52]/30 hover:border-[#E87A52] shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B54F2C] truncate">
                Racha Activa
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <img src="/assets/badges/badge-streak.png" alt="Racha" className="w-5 h-5 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B54F2C] font-serif">
                  {streakDays}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-stone-500">
                  {streakDays === 1 ? 'día' : 'días'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#E87A52] font-semibold mt-1 flex items-center gap-1">
                <span>Constancia Diaria</span>
                <ChevronRight className="w-3 h-3 text-[#E87A52] group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
          </div>

        </div>

        {/* 5. SECCIÓN PRINCIPAL: RECOMENDACIÓN BASADA EN EL ESTADO EMOCIONAL */}
        <div className="rounded-3xl border-2 border-[#5F927B]/30 bg-gradient-to-r from-white via-[#F2F7F4] to-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white text-[#3E6855] border border-[#C5DDD0] shadow-2xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E87A52]" />
                  <span>{recommendation.badge}</span>
                </span>
                {latestEntry && (
                  <span className="text-xs font-semibold text-stone-600 bg-white/80 border border-stone-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Basado en: {latestEntry.mood}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif leading-snug">
                {recommendation.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {recommendation.message}
              </p>

              {/* Guía recomendada embed */}
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-[#5F927B]/30 shadow-2xs mt-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3E6855]">
                      Guía recomendada
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                      {recommendation.guideTitle}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {recommendation.guideSummary}
                    </p>
                  </div>
                  {onOpenGuideById && (
                    <button
                      onClick={() => onOpenGuideById(recommendation.guideId)}
                      className="px-3.5 py-2 rounded-xl bg-[#5F927B] hover:bg-[#4D7764] text-white text-xs font-bold shrink-0 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Leer Guía</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: Acción complementaria o desahogo con Flux AI */}
            <div className="w-full lg:w-72 shrink-0 bg-white rounded-2xl p-5 border-2 border-[#5F927B]/30 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">¿Necesitas conversar?</h4>
                  <p className="text-[11px] text-stone-500">Flux AI está disponible 24/7 con escucha empática</p>
                </div>
              </div>

              <button
                id="dashboard-talk-ai-btn"
                onClick={() => onNavigate('ai')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#5F927B] to-[#E87A52] hover:opacity-95 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="/assets/icons/send.png" alt="Enviar" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
                <span>Conversar con Flux AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. GRID DE DOS COLUMNAS: HÁBITOS PENDIENTES DE HOY + ÚLTIMA REFLEXIÓN DEL DIARIO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Columna A: Hábitos y Misiones Diarias Prioritarias */}
          <div className="bg-white rounded-3xl border-2 border-[#E87A52]/30 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src="/assets/icons/medal.png" alt="Misiones" className="w-4 h-4 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      Hábitos Prioritarios de Hoy
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {pendingMissions.length} pendientes • {completedMissions.length} completados
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('missions')}
                  className="text-xs font-bold text-[#E87A52] hover:text-[#B54F2C] flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lista de misiones interactivas */}
              <div className="space-y-2.5">
                {missions.slice(0, 3).map((m) => {
                  const isDone = m.status === 'completed';
                  const isItemLoading = actionLoadingId === m.id || actionLoadingId === m.missionId;

                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isDone 
                          ? 'bg-[#EBF1EA]/60 border-[#C5DDD0] text-stone-600' 
                          : 'bg-[#FAF7F2] border-stone-200 hover:border-[#5F927B]/40 hover:bg-[#F2F7F4] text-stone-900'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleMission(m.id, m.status)}
                          disabled={isItemLoading}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${
                            isItemLoading
                              ? 'bg-[#FDF4F0] border border-[#F7D3C3] text-[#B54F2C]'
                              : isDone
                              ? 'bg-[#5F927B] text-white shadow-2xs'
                              : 'bg-white border border-stone-300 text-stone-400 hover:border-[#5F927B] hover:text-[#5F927B]'
                          }`}
                          title={isDone ? 'Misión completada. Clic para desmarcar.' : 'Completar misión'}
                        >
                          {isItemLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#E87A52]" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {m.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2 py-0.5 rounded-full shadow-2xs">
                          +{m.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Sincronización activa con {user ? 'Supabase' : 'almacenamiento local'}
              </span>
              <button
                onClick={() => onNavigate('missions')}
                className="font-bold text-[#3E6855] hover:text-[#5F927B] flex items-center gap-1 cursor-pointer"
              >
                <span>Ir al Módulo de Misiones</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Columna B: Diario Emocional y Última Reflexión */}
          <div className="bg-white rounded-3xl border-2 border-[#5F927B]/30 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src="/assets/icons/nav-journal.png" alt="Diario" className="w-4 h-4 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      Diario Emocional
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {entries.length} reflexiones registradas en total
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('journal')}
                  className="text-xs font-bold text-[#3E6855] hover:text-[#5F927B] flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Diario</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contenido de la última entrada o invitación a escribir */}
              {latestEntry ? (
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#C5DDD0] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF1EA] text-[#3E6855] border border-[#C5DDD0] capitalize shadow-2xs">
                        {latestEntry.mood}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Intensidad {latestEntry.intensity}/10
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{latestEntry.date} {latestEntry.time || ''}</span>
                    </span>
                  </div>

                  {latestEntry.notes ? (
                    <p className="text-xs text-stone-700 italic bg-white p-3 rounded-xl border border-stone-200/70 leading-relaxed line-clamp-3">
                      "{latestEntry.notes}"
                    </p>
                  ) : (
                    <p className="text-xs text-stone-500 italic">
                      Sin notas escritas en este registro.
                    </p>
                  )}

                  {latestEntry.triggers && latestEntry.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {latestEntry.triggers.map((trig, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-medium text-[#3E6855] bg-white border border-[#C5DDD0] px-2 py-0.5 rounded-full"
                        >
                          {trig}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-dashed border-[#5F927B]/40 text-center space-y-2">
                  <Smile className="w-8 h-8 text-[#5F927B] mx-auto" />
                  <h4 className="text-xs font-bold text-stone-800">
                    Aún no hay entradas registradas
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Tómate 2 minutos para registrar cómo te sientes hoy y recibirás retroalimentación psicológica personalizada.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                {latestEntry ? 'Último registro guardado' : 'Primer registro'}
              </span>
              <button
                onClick={() => onNavigate('journal')}
                className="px-3.5 py-2 rounded-xl bg-[#5F927B] hover:bg-[#4D7764] text-white font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <img src="/assets/icons/send.png" alt="Enviar" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
                <span>Nueva Entrada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 7. ACCESOS RÁPIDOS A MÓDULOS CLAVE (8 Ecosystem Apartados) */}
        <div className="bg-white rounded-3xl border-2 border-[#5F927B]/30 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E87A52]" />
            <span>Explora los 8 Módulos de FluxGlow</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('learn')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#F2F7F4] hover:bg-[#EBF1EA] border border-[#C5DDD0] hover:border-[#5F927B] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-info.png" alt="Aprende" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#3E6855]">Aprende y Explora</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Biblioteca de guías</p>
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#FDF4F0] hover:bg-[#FDF1EC] border border-[#F7D3C3] hover:border-[#E87A52] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-journal.png" alt="Diario" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#B54F2C]">Diario Emocional</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Registros y reflexiones</p>
            </button>

            <button
              onClick={() => onNavigate('missions')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#F2F7F4] hover:bg-[#EBF1EA] border border-[#C5DDD0] hover:border-[#5F927B] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/medal.png" alt="Misiones" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#3E6855]">Misiones & Hábitos</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Puntos XP y rachas</p>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#FDF4F0] hover:bg-[#FDF1EC] border border-[#F7D3C3] hover:border-[#E87A52] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-analytics.png" alt="Análisis" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#B54F2C]">Análisis Predictivo</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Detección de patrones</p>
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#F2F7F4] hover:bg-[#EBF1EA] border border-[#C5DDD0] hover:border-[#5F927B] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#3E6855]">Flux AI</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Asistente empático 24/7</p>
            </button>

            <button
              onClick={() => onNavigate('alert')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#FDF4F0] hover:bg-[#FDF1EC] border border-[#F7D3C3] hover:border-[#E87A52] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/alert-shield.png" alt="Alerta SOS" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#B54F2C]">Alerta Emocional</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Líneas SOS y grounding</p>
            </button>

            <button
              onClick={() => onNavigate('community')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#F2F7F4] hover:bg-[#EBF1EA] border border-[#C5DDD0] hover:border-[#5F927B] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EBF1EA] border border-[#C5DDD0] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-community.png" alt="Comunidad" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#3E6855]">Comunidad Segura</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Foro libre de juicios</p>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-white to-[#FDF4F0] hover:bg-[#FDF1EC] border border-[#F7D3C3] hover:border-[#E87A52] transition-all text-left group cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FDF4F0] border border-[#F7D3C3] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <img src="/assets/icons/nav-profile.png" alt="Perfil" className="w-4 h-4 object-contain" />
              </div>
              <h4 className="text-xs font-bold text-[#B54F2C]">Perfil y Progreso</h4>
              <p className="text-[10px] text-stone-500 mt-0.5">Métricas personales</p>
            </button>
          </div>
        </div>

      </div>

      {/* Auth Modal for guest prompt */}
      <AuthModals
        isOpen={authModalOpen}
        initialMode={authMode}
        currentUser={userProfile}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(targetView, updated) => {
          setAuthModalOpen(false);
          if (onUpdateProfile && updated) {
            onUpdateProfile(updated);
          }
          onNavigate(targetView || 'dashboard');
        }}
      />
    </div>
  );
};
