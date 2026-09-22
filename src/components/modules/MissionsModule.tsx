import { STORAGE_KEYS, getDynamicStorageKey } from '../../constants/storageKeys';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Flame, 
  Award, 
  Clock, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Check,
  Tag,
  AlertCircle,
  RotateCcw,
  Loader2,
  Cloud,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RachaIcon } from '../common/RachaIcon';
import { EmptyStat } from '../common/EmptyStat';
import { formatFluxDate } from '../../utils/dateUtils';
import { useToast } from '../common/Toast';
import { decrementFluxStreak } from '../../utils/streakManager';
import { UserDailyMissionRecord, UserProfileData, ViewMode } from '../../types';
import { useMissions } from '../../hooks/useMissions';

interface MissionsModuleProps {
  onNavigate?: (view: ViewMode) => void;
  onOpenGuideById?: (guideId: string) => void;
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
}

export const MissionsModule: React.FC<MissionsModuleProps> = ({ 
  onNavigate,
  onOpenGuideById,
  userProfile,
  onUpdateProfile
}) => {
  const { success, info, warning } = useToast();
  
  // Custom hook para conectar las misiones con Supabase y modo invitado local
  const {
    missions,
    loading: isMissionsLoading,
    actionLoadingId,
    error: missionsError,
    userPoints,
    userLevel,
    streakDays,
    toggleCompleteMission,
    refreshMissions,
    isGuest,
    user
  } = useMissions(userProfile, onUpdateProfile);

  
  const [schedules, setSchedules] = useState<Record<string, string>>({});
  const [rejected, setRejected] = useState<string[]>([]);
  const [schedulingMissionId, setSchedulingMissionId] = useState<string | null>(null);
  const [scheduleDateInput, setScheduleDateInput] = useState<string>('');
  const [scheduleTimeInput, setScheduleTimeInput] = useState<string>('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.MISSION_SCHEDULES);
      if (s) setSchedules(JSON.parse(s));
      const r = localStorage.getItem(STORAGE_KEYS.MISSION_REJECTED);
      if (r) setRejected(JSON.parse(r));
    } catch (e) {}
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveSchedules = (newSchedules: Record<string, string>) => {
    setSchedules(newSchedules);
    localStorage.setItem(STORAGE_KEYS.MISSION_SCHEDULES, JSON.stringify(newSchedules));
  };
  const saveRejected = (newRejected: string[]) => {
    setRejected(newRejected);
    localStorage.setItem(STORAGE_KEYS.MISSION_REJECTED, JSON.stringify(newRejected));
  };

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleDateInput(formatLocalDate(d));
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };

  const confirmSchedule = (id: string) => {
    if (!scheduleTimeInput || !scheduleDateInput) return;
    const [year, month, day] = scheduleDateInput.split('-').map(Number);
    const [hours, minutes] = scheduleTimeInput.split(':').map(Number);
    const d = new Date();
    d.setFullYear(year, month - 1, day);
    d.setHours(hours, minutes, 0, 0);
    
    // Si la hora programada ya pasó, mostramos un aviso pero lo permitimos (o podemos bloquearlo)
    if (d.getTime() < Date.now()) {
        warning('La fecha seleccionada está en el pasado.');
        return;
    }
    
    const updated = { ...schedules, [id]: d.toISOString() };
    saveSchedules(updated);
    setSchedulingMissionId(null);
    success('Misión programada correctamente.');
  };

  const handleRejectMission = (id: string) => {
    const updated = [...rejected, id];
    saveRejected(updated);
    info('Has rechazado la misión.');
  };

  const [notified, setNotified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const n = localStorage.getItem(STORAGE_KEYS.MISSION_NOTIFIED);
      if (n) setNotified(JSON.parse(n));
    } catch (e) {}
  }, []);

  const saveNotified = (newNotified: Record<string, boolean>) => {
    setNotified(newNotified);
    localStorage.setItem(STORAGE_KEYS.MISSION_NOTIFIED, JSON.stringify(newNotified));
  };

  // Check for expirations and notifications
  useEffect(() => {
    let rejectedChanged = false;
    let notifiedChanged = false;
    const newRejected = [...rejected];
    const newNotified = { ...notified };

    Object.entries(schedules).forEach(([id, timeStr]) => {
      if (rejected.includes(id)) return;
      
      const targetMission = missions.find(m => m.id === id);
      if (targetMission?.status === 'completed') return;

      const scheduledTime = new Date(timeStr).getTime();
      const current = now.getTime();
      
      // Notify when it's time
      if (current >= scheduledTime && !newNotified[id]) {
        newNotified[id] = true;
        notifiedChanged = true;
        info(`¡Es hora de iniciar tu misión programada!`);
      }

      // Fail if 1 hour passed
      if (current > scheduledTime + 60 * 60 * 1000) {
        newRejected.push(id);
        rejectedChanged = true;
        warning('Has fallado una misión programada (pasó 1 hora). Se restó XP.');
      }
    });

    if (rejectedChanged) {
      saveRejected(newRejected);
    }
    if (notifiedChanged) {
      saveNotified(newNotified);
    }
  }, [now, schedules, rejected, notified, missions]);

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Format relative completion date accurately
  const formatCompletionDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const formatted = formatFluxDate(dateStr);
      return `Completada • ${formatted}`;
    } catch {
      return 'Completada';
    }
  };

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const pendingMissions = useMemo(() => missions.filter(m => m.status === 'pending'), [missions]);
  const completedMissions = useMemo(() => missions.filter(m => m.status === 'completed'), [missions]);

  // Extract unique categories and origin guides for filtering
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    missions.forEach(m => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [missions]);

  // Filtered list
  const filteredMissions = useMemo(() => {
    return missions.filter(item => {
      if (rejected.includes(item.id) || rejected.includes(item.missionId)) return false;
      // Tab filter
      if (filterTab === 'pending' && item.status !== 'pending') return false;
      if (filterTab === 'completed' && item.status !== 'completed') return false;

      // Category filter
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const guideMatch = (item.guideTitle || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !guideMatch && !catMatch) return false;
      }

      return true;
    });
  }, [missions, filterTab, selectedCategory, searchQuery]);

  // Group filtered missions by origin guide (Accordion structure)
  const groupedMissions = useMemo(() => {
    const map = new Map<string, {
      key: string;
      guideId: string;
      guideTitle: string;
      category: string;
      missions: UserDailyMissionRecord[];
      completedCount: number;
    }>();

    filteredMissions.forEach(m => {
      const key = m.guideTitle || 'Misiones Fundacionales de Bienestar';
      if (!map.has(key)) {
        map.set(key, {
          key,
          guideId: m.guideId,
          guideTitle: key,
          category: m.category || 'Bienestar',
          missions: [],
          completedCount: 0
        });
      }
      const group = map.get(key)!;
      group.missions.push(m);
      if (m.status === 'completed') {
        group.completedCount += 1;
      }
    });

    return Array.from(map.values());
  }, [filteredMissions]);

  const handleToggleComplete = async (recordId: string, currentStatus: string) => {
    if (actionLoadingId) return;
    const isCompleting = currentStatus === 'pending';
    const res = await toggleCompleteMission(recordId, currentStatus);
    if (res.success) {
      if (isCompleting) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
        success('¡Misión cumplida! 🎉', `Sumaste +${res.xpEarned} XP directamente a tu perfil y mantienes tu racha a ${res.streakDays} días.`);
      } else {
        info('Misión reactivada', 'La misión vuelve a estar marcada como pendiente.');
      }
    } else {
      warning('Aviso al actualizar', 'No se pudo cambiar el estado de la misión. Intenta nuevamente.');
    }
  };

  const handleGoToGuide = (guideId: string) => {
    if (onOpenGuideById) {
      onOpenGuideById(guideId);
    } else if (onNavigate) {
      onNavigate('learn');
    }
  };

  return (
    <div className="w-full bg-flux-brand-bath min-h-screen pb-24 pt-4 px-4 sm:px-6 md:px-10">
      <div className="w-full">
        
        {/* Top Header Row with Brand Logo, Connection Status & Back/Explore */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-[#5F927B]/20 mb-4">
          <div className="flex items-center gap-2">
            
            <span className="text-[11px] font-bold text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-0.5 rounded-full ml-1 flex items-center gap-1.5 shadow-2xs">
              <img src="/assets/icons/medal.png" alt="Misiones" className="w-3.5 h-3.5 object-contain" />
              <span>Hábitos y Retos Diarios</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isMissionsLoading ? (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 px-2.5 py-1 rounded-full shadow-2xs">
                <Loader2 className="w-3 h-3 animate-spin text-[#5F927B]" />
                <span>Cargando misiones...</span>
              </div>
            ) : user ? (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-1 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5F927B] animate-pulse"></span>
                <span>🟢 En vivo</span>
              </div>
            ) : null}

            {/* Level & Points synced Pill */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-white border border-stone-200 px-3 py-1 rounded-full shadow-2xs">
              <img src="/assets/icons/medal.png" alt="XP" className="w-3.5 h-3.5 object-contain" />
              <span>{userPoints} XP • Nivel {userLevel}</span>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-semibold text-stone-700 hover:text-[#3E6855] bg-white border border-stone-200 hover:border-[#5F927B] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all hover:bg-stone-50 cursor-pointer"
              >
                <img src="/assets/icons/nav-info.png" alt="Guías" className="w-3.5 h-3.5 object-contain" />
                <span>Explorar más Guías</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync notification if error occurs */}
        {missionsError && (
          <div className="mb-4 bg-[#FDF4F0] border border-[#F7D3C3] text-[#B54F2C] px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-[#E87A52]" />
              <span>Aviso de sincronización de misiones: {missionsError}</span>
            </span>
            <button
              onClick={() => refreshMissions()}
              className="text-[#873418] font-bold underline flex items-center gap-1 cursor-pointer hover:text-[#B54F2C]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {/* Big Display Title: Misiones Diarias */}
        <div className="text-center my-6 px-2 overflow-visible">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF4F0] border border-[#F7D3C3] text-xs font-bold text-[#B54F2C] mb-2 shadow-2xs">
            <img src="/assets/icons/trophy.png" alt="Retos" className="w-3.5 h-3.5 object-contain" />
            <span>Hábitos & Micro-Acciones</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal leading-normal overflow-visible">
            <span className="bg-gradient-to-r from-[#3E6855] via-[#5F927B] to-[#E87A52] bg-clip-text text-transparent">
              Misiones Diarias
            </span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
            Transforma los conceptos de tus lecturas en acciones prácticas de 3 a 5 minutos, suma experiencia y mantén encendida tu racha de bienestar.
          </p>
        </div>

        {/* TOP STATS DASHBOARD BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          {/* Card 1: Misiones Pendientes (Prominent Highlight with Terracotta) */}
          <div className="flux-card-terracotta p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B54F2C]">
                Pendientes Hoy
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#873418] font-serif">
                  {pendingMissions.length}
                </span>
                <span className="text-xs font-semibold text-[#B54F2C]">por realizar</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F7D3C3] flex items-center justify-center p-2.5 shadow-2xs shrink-0">
              <img src="/assets/badges/badge-explorer.png" alt="Pendientes" className="w-7 h-7 object-contain" />
            </div>
          </div>

          {/* Card 2: Misiones Completadas (Sage Green) */}
          <div className="flux-card-sage p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E6855]">
                Completadas
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#253D33] font-serif">
                  {completedMissions.length}
                </span>
                <span className="text-xs font-semibold text-[#3E6855]">retos listos</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#C5DDD0] flex items-center justify-center p-2.5 shadow-2xs shrink-0">
              <img src="/assets/icons/trophy.png" alt="Completadas" className="w-7 h-7 object-contain" />
            </div>
          </div>

          {/* Card 3: Racha Consecutiva (Terracotta Glow) */}
          <div className="flux-card-terracotta p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B54F2C]">
                Racha de Hábitos
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#873418] font-serif">
                  {streakDays}
                </span>
                <span className="text-xs font-semibold text-[#B54F2C]">días seguidos</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F7D3C3] flex items-center justify-center p-2 shadow-2xs shrink-0">
              <img src="/assets/Extra/Racha.png" alt="Racha" className="w-8 h-8 object-contain" />
            </div>
          </div>

          {/* Card 4: Puntos de Experiencia (XP) & Nivel */}
          <div className="flux-card-sage p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E6855] flex items-center gap-1">
                <span>XP y Nivel</span>
                {user && <span className="text-[9px] bg-[#EBF1EA] text-[#3E6855] px-1.5 py-0.2 rounded font-bold">Nube</span>}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#253D33] font-serif">
                  +{userPoints}
                </span>
                <span className="text-xs font-bold text-[#3E6855]">XP</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-600 block mt-0.5">
                Nivel {userLevel} • {user ? '🟢 En vivo' : 'Local'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#C5DDD0] flex items-center justify-center p-2 shadow-2xs shrink-0">
              <img src="/assets/badges/badge-mastery.png" alt="Nivel" className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-3xl border-2 border-[#5F927B]/20 p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs: Todas, Pendientes, Completadas */}
          <div className="flex items-center bg-[#f5f1ea] p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas ({missions.length})
            </button>

            <button
              onClick={() => setFilterTab('pending')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterTab === 'pending'
                  ? 'bg-[#E87A52] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#B54F2C]'
              }`}
            >
              <span>Pendientes</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                filterTab === 'pending' ? 'bg-[#873418] text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {pendingMissions.length}
              </span>
            </button>

            <button
              onClick={() => setFilterTab('completed')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterTab === 'completed'
                  ? 'bg-[#5F927B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#3E6855]'
              }`}
            >
              <span>Completadas</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                filterTab === 'completed' ? 'bg-[#253D33] text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {completedMissions.length}
              </span>
            </button>
          </div>

          {/* Search Box & Category Filter */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 max-w-lg justify-end">
            
            <div className="relative flex-1">
              <img src="/assets/icons/search.png" alt="Buscar" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 object-contain" />
              <input
                type="text"
                placeholder="Buscar misión o guía..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fbf9f5] border border-stone-200 focus:border-[#5F927B] rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5F927B]/30"
              />
            </div>

            {availableCategories.length > 0 && (
              <div className="relative flex items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#fbf9f5] border border-stone-200 focus:border-[#5F927B] rounded-2xl pl-3 pr-8 py-2 text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#5F927B]/30 cursor-pointer appearance-none"
                >
                  <option value="todos">Todas las categorías</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <img src="/assets/icons/filter.png" alt="Filtro" className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none object-contain" />
              </div>
            )}

          </div>

        </div>

        {/* MISSIONS LIST */}
        {isMissionsLoading && filteredMissions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-xs">
            <Loader2 className="w-10 h-10 text-[#548c71] animate-spin mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
              Sincronizando tus Misiones...
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm">
              Cargando hábitos y micro-acciones en tiempo real
            </p>
          </div>
        ) : filteredMissions.length > 0 ? (
          <div className="space-y-5">
            {groupedMissions.map((group) => {
              const isCollapsed = !!collapsedGroups[group.key];
              const allCompleted = group.completedCount === group.missions.length;

              return (
                <div
                  key={group.key}
                  className="bg-white rounded-3xl border-2 border-[#5F927B]/25 overflow-hidden shadow-xs transition-all"
                >
                  {/* Accordion Group Header */}
                  <div
                    onClick={() => toggleGroupCollapse(group.key)}
                    className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 select-none transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${allCompleted ? 'bg-[#EBF1EA] text-[#3E6855]' : 'bg-[#FDF4F0] text-[#B54F2C]'}`}>
                        <BookOpen className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 font-serif">
                            {group.guideTitle}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            allCompleted 
                              ? 'text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0]'
                              : 'text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3]'
                          }`}>
                            {group.completedCount}/{group.missions.length} completadas
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium">
                          Origen: {group.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {group.guideId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGoToGuide(group.guideId);
                          }}
                          className="text-[11px] font-semibold text-stone-700 hover:text-[#3E6855] bg-white border border-stone-200 hover:border-[#5F927B] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Abrir guía de origen"
                        >
                          <span>Ver guía</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Group Items list */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#FDFBF7]/40">
                      {group.missions.map((m) => {
                        const isDone = m.status === 'completed';
                        const isItemLoading = actionLoadingId === m.id || actionLoadingId === m.missionId;

                        return (
                          <div
                            key={m.id}
                            id={`mission-card-${m.id}`}
                            className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 overflow-hidden ${
                              isDone 
                                ? 'bg-[#F2F7F4]/90 border-[#5F927B]/40 shadow-2xs' 
                                : 'bg-white border-[#E87A52]/30 hover:border-[#E87A52] shadow-xs hover:shadow-md group hover:-translate-y-0.5'
                            }`}
                          >
                            {/* Decorative indicator accent on left */}
                            <div 
                              className={`absolute top-3 bottom-3 left-0 w-1.5 rounded-r-full transition-colors ${
                                isDone ? 'bg-[#5F927B]' : 'bg-[#E87A52]'
                              }`}
                            />

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pl-2">
                              {/* Left: Status Icon & Details */}
                              <div className="flex items-start gap-4 flex-1">
                                {/* Check Button */}
                                <button
                                  onClick={() => {
                                      const isScheduled = !!schedules[m.id];
                                      if (!isDone && (!isScheduled || now.getTime() < new Date(schedules[m.id]).getTime() + 60 * 1000)) return;
                                      handleToggleComplete(m.id, m.status);
                                  }}
                                  disabled={isItemLoading}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${
                                    isItemLoading
                                      ? 'bg-[#FDF4F0] border border-[#F7D3C3] text-[#B54F2C] cursor-wait'
                                      : isDone
                                      ? 'bg-[#5F927B] text-white shadow-xs hover:bg-[#3E6855]'
                                      : 'bg-[#FDF4F0] text-[#B54F2C] hover:bg-[#FCEAE2] border-2 border-[#F7D3C3] hover:border-[#E87A52]'
                                  }`}
                                  title={isItemLoading ? 'Guardando...' : isDone ? 'Misión completada. Clic para desmarcar.' : 'Clic para marcar como completada'}
                                >
                                  {isItemLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-[#E87A52]" />
                                  ) : isDone ? (
                                    <Check className="w-5 h-5 stroke-[3]" />
                                  ) : (
                                    <Circle className="w-5 h-5 stroke-[2.5]" />
                                  )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                    <span className="text-[10px] font-bold text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                      {m.category}
                                    </span>

                                    {isDone ? (
                                      <span className="text-[10px] font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5F927B]" />
                                        <span>Completada</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-[#873418] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-0.5 rounded-full">
                                        Pendiente
                                      </span>
                                    )}
                                  </div>

                                  <h3 className={`text-base sm:text-lg font-bold leading-snug tracking-tight ${
                                    isDone ? 'text-stone-400 line-through' : 'text-stone-900 group-hover:text-[#873418] transition-colors'
                                  }`}>
                                    {m.title}
                                  </h3>

                                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                                    isDone ? 'text-stone-400' : 'text-stone-600'
                                  }`}>
                                    {m.description}
                                  </p>

                                  <div className="flex items-center gap-3 mt-2.5 text-xs text-stone-600 flex-wrap">
                                    <span className="flex items-center gap-1 font-medium bg-white border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs">
                                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                                      <span>{m.timeEstimate || '5 min'}</span>
                                    </span>

                                    <span className="flex items-center gap-1 font-bold text-[#873418] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-0.5 rounded-full shadow-2xs">
                                      <Sparkles className="w-3.5 h-3.5 text-[#E87A52]" />
                                      <span>+{m.xp || 30} XP</span>
                                    </span>

                                    {m.completedAt && (
                                      <span className="text-[11px] font-semibold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5F927B]" />
                                        <span>{formatCompletionDate(m.completedAt)}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Action Button */}
                              <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                                {(() => {
                                  if (isDone) {
                                    return (
                                      <div className="w-full md:w-auto flex items-center gap-2">
                                        <span className="flex-1 md:flex-initial text-xs font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                                          <CheckCircle2 className="w-4 h-4 text-[#5F927B]" />
                                          <span>Completada</span>
                                        </span>
                                      </div>
                                    );
                                  }

                                  const isScheduled = !!schedules[m.id];
                                  if (isScheduled) {
                                    const scheduledTime = new Date(schedules[m.id]).getTime();
                                    const currentTime = now.getTime();
                                    const canComplete = currentTime >= scheduledTime + 60 * 1000;
                                    
                                    return (
                                      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                                        <span className="text-[11px] font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-2 py-1 rounded-md">
                                          Programada: {new Date(schedules[m.id]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        <button
                                          onClick={() => handleToggleComplete(m.id, m.status)}
                                          disabled={isItemLoading || !canComplete}
                                          title={!canComplete ? "Espera 1 minuto después de la hora programada" : ""}
                                          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                                            !canComplete 
                                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed' 
                                              : 'bg-gradient-to-r from-[#E87A52] to-[#B54F2C] hover:opacity-95 text-white cursor-pointer hover:shadow-md'
                                          }`}
                                        >
                                          {isItemLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : <Check className="w-4 h-4 stroke-[2.5]" />}
                                          <span>Completar misión</span>
                                        </button>
                                      </div>
                                    );
                                  }



                                  return (
                                    <div className="flex gap-2 w-full md:w-auto">
                                      <button
                                        onClick={() => handleRejectMission(m.id)}
                                        className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                                      >
                                        Rechazar
                                      </button>
                                      <button
                                        onClick={() => handleAcceptMission(m.id)}
                                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5F927B] hover:bg-[#3E6855] transition-colors cursor-pointer shadow-xs"
                                      >
                                        Aceptar
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State using EmptyStat */
          <div className="py-8 max-w-xl mx-auto">
            <EmptyStat
              variant="card"
              icon={Target}
              title={
                filterTab === 'pending' 
                  ? '¡Genial! No tienes misiones pendientes'
                  : filterTab === 'completed'
                  ? 'Aún no has completado ninguna misión hoy'
                  : 'No se encontraron misiones'
              }
              description="Para desbloquear nuevas misiones diarias, abre cualquier guía en Explora y Aprende y pulsa 'He terminado de leer la guía'."
              actionText="Ir al catálogo de Guías"
              onAction={() => onNavigate && onNavigate('learn')}
            />
          </div>
        )}

      </div>

      {/* SCHEDULE MODAL */}
      {schedulingMissionId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSchedulingMissionId(null)}
          ></div>
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-xl flex flex-col gap-5 border border-stone-100">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1">
                Programa tu misión
              </h3>
              <p className="text-stone-500 text-sm">
                Selecciona cuándo te comprometes a realizar esta acción.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Fecha</label>
                <input 
                  type="date" 
                  value={scheduleDateInput}
                  onChange={(e) => setScheduleDateInput(e.target.value)}
                  min={formatLocalDate(new Date())}
                  className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Hora</label>
                <input 
                  type="time" 
                  value={scheduleTimeInput}
                  onChange={(e) => setScheduleTimeInput(e.target.value)}
                  className="w-full bg-[#fbf9f5] border-2 border-stone-200 focus:border-[#5F927B] rounded-2xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-4 focus:ring-[#5F927B]/20 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setSchedulingMissionId(null)}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmSchedule(schedulingMissionId)}
                className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm text-white bg-[#5F927B] hover:bg-[#4C7563] shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
