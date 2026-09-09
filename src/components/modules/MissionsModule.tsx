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
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { RachaIcon } from '../common/RachaIcon';
import { useToast } from '../common/Toast';
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

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Format relative completion date accurately
  const formatCompletionDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Completada';
      const now = new Date();
      const isSameDay = date.getDate() === now.getDate() && 
                        date.getMonth() === now.getMonth() && 
                        date.getFullYear() === now.getFullYear();
      if (isSameDay) return 'Completada hoy';
      
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() && 
                          date.getMonth() === yesterday.getMonth() && 
                          date.getFullYear() === yesterday.getFullYear();
      if (isYesterday) return 'Completada ayer';

      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1 && diffDays < 7) {
        return `Completada hace ${diffDays} días`;
      }
      return `Completada el ${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
    } catch {
      return 'Completada';
    }
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
        if (user) {
          success('¡Misión cumplida en Supabase! 🎉', `Sumaste +${res.xpEarned} XP directamente a tu perfil en Supabase y mantienes tu racha a ${res.streakDays} días.`);
        } else {
          success('¡Misión cumplida! 🎉', `Sumaste +${res.xpEarned} XP y fortaleciste tu racha a ${res.streakDays} días.`);
        }
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
    <div className="w-full bg-flux-brand-bath min-h-screen pb-24 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Top Header Row with Brand Logo, Connection Status & Back/Explore */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-[#5F927B]/20 mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo size="xs" showText={true} />
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
                <span>Supabase Conectado</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-1 rounded-full shadow-2xs" title="Tus misiones se gestionan en este navegador. Inicia sesión para sincronizarlas en Supabase.">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E87A52]"></span>
                <span>Modo Exploración (Local)</span>
              </div>
            )}

            {/* Level & Points synced Pill */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-white border border-[#C5DDD0] px-3 py-1 rounded-full shadow-2xs">
              <img src="/assets/icons/medal.png" alt="XP" className="w-3.5 h-3.5 object-contain" />
              <span>{userPoints} XP • Nivel {userLevel}</span>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-semibold text-stone-700 hover:text-[#3E6855] bg-white border border-[#C5DDD0] hover:border-[#5F927B] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all hover:bg-stone-50 cursor-pointer"
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
              <img src="/assets/badges/badge-streak.png" alt="Racha" className="w-8 h-8 object-contain" />
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
                Nivel {userLevel} • {user ? 'Supabase' : 'Local'}
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
              Consultando retos diarios y progreso en Supabase
            </p>
          </div>
        ) : filteredMissions.length > 0 ? (
          <div className="space-y-4">
            {filteredMissions.map((m) => {
              const isDone = m.status === 'completed';
              const isItemLoading = actionLoadingId === m.id || actionLoadingId === m.missionId;

              return (
                <div
                  key={m.id}
                  id={`mission-card-${m.id}`}
                  className={`relative rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 overflow-hidden ${
                    isDone 
                      ? 'bg-[#F2F7F4]/90 border-[#5F927B]/40 shadow-2xs' 
                      : 'bg-white border-[#E87A52]/30 hover:border-[#E87A52] shadow-xs hover:shadow-md group hover:-translate-y-0.5'
                  }`}
                >
                  {/* Decorative indicator accent on left */}
                  <div 
                    className={`absolute top-4 bottom-4 left-0 w-1.5 rounded-r-full transition-colors ${
                      isDone ? 'bg-[#5F927B]' : 'bg-[#E87A52]'
                    }`}
                  />

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pl-2">
                    
                    {/* Left: Status Icon & Details */}
                    <div className="flex items-start gap-4 flex-1">
                      
                      {/* Check Button */}
                      <button
                        onClick={() => handleToggleComplete(m.id, m.status)}
                        disabled={isItemLoading}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${
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
                        
                        {/* Origin Guide Pill & Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <button
                            onClick={() => handleGoToGuide(m.guideId)}
                            className="bg-white hover:bg-[#FAF7F2] text-stone-800 text-[11px] font-semibold px-3 py-0.5 rounded-full flex items-center gap-1.5 border border-stone-200/90 shadow-2xs transition-colors cursor-pointer group/guide"
                            title="Ver guía de origen"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#5F927B] group-hover/guide:scale-110 transition-transform" />
                            <span className="line-clamp-1 max-w-[220px] sm:max-w-none">Guía: {m.guideTitle}</span>
                          </button>

                          {/* Category Badge */}
                          <span className="text-[10px] font-bold text-[#B54F2C] bg-[#FDF4F0] border border-[#F7D3C3] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {m.category}
                          </span>

                          {/* Status Badge */}
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

                        {/* Mission Title */}
                        <h3 className={`text-base sm:text-lg font-bold leading-snug tracking-tight ${
                          isDone ? 'text-stone-400 line-through' : 'text-stone-900 group-hover:text-[#873418] transition-colors'
                        }`}>
                          {m.title}
                        </h3>

                        {/* Mission Description */}
                        <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${
                          isDone ? 'text-stone-400' : 'text-stone-600'
                        }`}>
                          {m.description}
                        </p>

                        {/* Time, XP and Real Relative Date Badges */}
                        <div className="flex items-center gap-3 mt-3 text-xs text-stone-600 flex-wrap">
                          <span className="flex items-center gap-1 font-medium bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md">
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
                      {isDone ? (
                        <div className="w-full md:w-auto flex items-center gap-2">
                          <span className="flex-1 md:flex-initial text-xs font-bold text-[#3E6855] bg-[#EBF1EA] border border-[#C5DDD0] px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-4 h-4 text-[#5F927B]" />
                            <span>Completada</span>
                          </span>
                          <button
                            onClick={() => handleToggleComplete(m.id, m.status)}
                            disabled={isItemLoading}
                            className="p-2.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                            title="Deshacer y marcar como pendiente"
                            aria-label="Deshacer completado"
                          >
                            {isItemLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleComplete(m.id, m.status)}
                          disabled={isItemLoading}
                          className="w-full md:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#E87A52] to-[#B54F2C] hover:opacity-95 text-white disabled:opacity-75 disabled:cursor-wait active:scale-95"
                        >
                          {isItemLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>{user ? 'Guardando en Supabase...' : 'Guardando...'}</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Completar misión</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              {filterTab === 'pending' 
                ? '¡Genial! No tienes misiones pendientes'
                : filterTab === 'completed'
                ? 'Aún no has completado ninguna misión hoy'
                : 'No se encontraron misiones con los filtros aplicados'}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Para desbloquear nuevas misiones diarias, abre cualquier guía en <strong>Explora y Aprende</strong> y haz clic en el botón <strong>"He terminado de leer la guía"</strong>.
            </p>

            {onNavigate && (
              <button
                onClick={() => onNavigate('learn')}
                className="bg-[#548c71] hover:bg-[#43705a] text-white px-7 py-3 rounded-full text-sm font-bold shadow-xs transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ir al catálogo de Guías</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
