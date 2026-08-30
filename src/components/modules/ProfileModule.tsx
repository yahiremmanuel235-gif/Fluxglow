import React, { useState, useEffect } from 'react';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { 
  Sparkles, 
  Settings, 
  Camera, 
  Edit3, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  Award, 
  Calendar, 
  User, 
  Mail, 
  Check, 
  X, 
  Plus, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon, 
  Flame, 
  HelpCircle, 
  BookOpen,
  Trophy,
  Star,
  ShieldCheck,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import confetti from 'canvas-confetti';
import { UserProfileData, ViewMode, JournalEntry } from '../../types';
import { useToast } from '../common/Toast';
import { Button } from '../common/Button';
import { getStoredMissions, calculateMissionStreak, getTotalMissionsXP } from '../../utils/missionsManager';
import { MOCK_JOURNAL_ENTRIES } from '../../data/mockData';

interface ProfileModuleProps {
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
  onNavigate?: (view: ViewMode) => void;
}

const PRESET_AVATARS = [
  { id: 'default', label: 'Estándar', url: '/user.png' },
  { id: 'logo', label: 'FluxGlow', url: '/logo2.png' },
  { id: 'calm', label: 'Serenidad', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'mindful', label: 'Mindful', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { id: 'nature', label: 'Armonía', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'zen', label: 'Zen', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
];

export const ProfileModule: React.FC<ProfileModuleProps> = ({ 
  userProfile, 
  onUpdateProfile,
  onNavigate
}) => {
  const { success, info } = useToast();
  const [userName, setUserName] = useState(userProfile?.name || 'Usuario FluxGlow');
  const [userEmail, setUserEmail] = useState(userProfile?.email || 'usuario@fluxglow.com');
  const [memberSinceDate, setMemberSinceDate] = useState(userProfile?.memberSince || '28 de Agosto, 2026');
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoreGoalsModal, setShowMoreGoalsModal] = useState(false);

  // Real Journal entries for emotional tracking
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_journal_entries');
      return saved ? JSON.parse(saved) : MOCK_JOURNAL_ENTRIES;
    } catch {
      return MOCK_JOURNAL_ENTRIES;
    }
  });

  // Dynamic Gamification data
  const [storedMissions, setStoredMissions] = useState(() => getStoredMissions());
  const activeStreak = calculateMissionStreak(storedMissions) || 1;
  const totalXP = getTotalMissionsXP() || 120;
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const completedMissionsCount = storedMissions.filter(m => m.status === 'completed').length;

  // Escape key handler for accessible modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAvatarModal) setShowAvatarModal(false);
        if (showSettingsModal) setShowSettingsModal(false);
        if (showMoreGoalsModal) setShowMoreGoalsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAvatarModal, showSettingsModal, showMoreGoalsModal]);

  useEffect(() => {
    const handleMissionsUpdate = () => {
      setStoredMissions(getStoredMissions());
    };
    const handleJournalUpdate = () => {
      try {
        const saved = localStorage.getItem('fluxglow_journal_entries');
        if (saved) setJournalEntries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    window.addEventListener('fluxglow_journal_updated', handleJournalUpdate);
    return () => {
      window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
      window.removeEventListener('fluxglow_journal_updated', handleJournalUpdate);
    };
  }, []);

  // Sync if prop changes
  useEffect(() => {
    if (userProfile?.name) {
      setUserName(userProfile.name);
      setTempName(userProfile.name);
    }
    if (userProfile?.email) {
      setUserEmail(userProfile.email);
      setTempEmail(userProfile.email);
    }
    if (userProfile?.memberSince) setMemberSinceDate(userProfile.memberSince);
  }, [userProfile?.name, userProfile?.email, userProfile?.memberSince]);

  // Objectives Checkboxes
  const [objectives, setObjectives] = useState(() => {
    if (userProfile?.goals && userProfile.goals.length > 0) {
      return userProfile.goals;
    }
    return [
      { id: 'stress', label: 'Gestión del Estrés', checked: true },
      { id: 'mindfulness', label: 'Atención Plena', checked: true },
      { id: 'productivity', label: 'Productividad', checked: true },
      { id: 'growth', label: 'Crecimiento Personal', checked: true },
    ];
  });

  useEffect(() => {
    if (userProfile?.goals && userProfile.goals.length > 0) {
      setObjectives(userProfile.goals);
    }
  }, [userProfile?.goals]);

  const toggleObjective = (id: string) => {
    const updated = objectives.map(obj => obj.id === id ? { ...obj, checked: !obj.checked } : obj);
    setObjectives(updated);
    onUpdateProfile?.({ goals: updated });
    const targetObj = updated.find(o => o.id === id);
    if (targetObj) {
      if (targetObj.checked) {
        success('Meta activada', `Has marcado "${targetObj.label}"`);
      } else {
        info('Meta pausada', `Has desmarcado "${targetObj.label}"`);
      }
    }
  };

  const handleStartEdit = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    const finalName = tempName.trim() || 'Usuario FluxGlow';
    const finalEmail = tempEmail.trim() || 'usuario@fluxglow.com';
    setUserName(finalName);
    setUserEmail(finalEmail);
    setIsEditingProfile(false);
    onUpdateProfile?.({ name: finalName, email: finalEmail });
    success('Perfil guardado', 'Tus datos se han actualizado correctamente.');
  };

  const handleCancelEdit = () => {
    setTempName(userName);
    setTempEmail(userEmail);
    setIsEditingProfile(false);
  };

  const handleSelectAvatar = (url: string) => {
    onUpdateProfile?.({ avatarUrl: url });
    setShowAvatarModal(false);
    setCustomAvatarInput('');
    confetti({ particleCount: 25, spread: 45 });
    success('Foto actualizada', 'Tu avatar ha sido modificado con éxito.');
  };

  // Recent 3-day history & chart dynamically derived
  const chartData = [
    { date: '1/6/2026', intensidad: 7 },
    { date: '2/6/2026', intensidad: 5 },
    { date: '3/6/2026', intensidad: 8 },
  ];

  const recentTableEntries = [
    { date: '03/06/2026', mood: 'Feliz', intensity: '8/10' },
    { date: '02/06/2026', mood: 'Ansioso', intensity: '5/10' },
    { date: '01/06/2026', mood: 'Tranquilo', intensity: '7/10' },
  ];

  // Dynamic Badges Hub
  const achievements = [
    { 
      id: 'streak', 
      title: 'Racha Activa', 
      desc: `${activeStreak} días seguidos cuidando tu bienestar`, 
      icon: '🔥', 
      unlocked: activeStreak >= 1 
    },
    { 
      id: 'missions', 
      title: 'Misiones Cumplidas', 
      desc: `${completedMissionsCount} retos de guías superados`, 
      icon: '🎯', 
      unlocked: completedMissionsCount >= 1 
    },
    { 
      id: 'xp', 
      title: `Nivel ${currentLevel} Alcanzado`, 
      desc: `${totalXP} puntos de experiencia acumulados`, 
      icon: '⭐', 
      unlocked: totalXP >= 50 
    },
    { 
      id: 'journal', 
      title: 'Diario Consciente', 
      desc: `${journalEntries.length} reflexiones y estados registrados`, 
      icon: '✍️', 
      unlocked: journalEntries.length >= 1 
    },
    { 
      id: 'community', 
      title: 'Comunidad Solidaria', 
      desc: 'Participación en foros seguros de apoyo mutuo', 
      icon: '🤝', 
      unlocked: true 
    },
  ];

  const currentAvatar = userProfile?.avatarUrl || '/user.png';

  return (
    <div className="w-full bg-brand-sand-50 min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo & Account Settings Button */}
        <div className="flex items-center justify-between py-2 border-b border-brand-sand-300 mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          <div className="flex items-center gap-2">
            {onNavigate && (
              <Button
                onClick={() => onNavigate('learn')}
                variant="sand"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-brand-sage-600" />}
              >
                <span className="hidden sm:inline">Explorar Guías</span>
              </Button>
            )}

            <Button
              id="account-settings-btn"
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              size="sm"
              leftIcon={<Settings className="w-3.5 h-3.5 text-brand-sage-600" />}
            >
              <span>Configuración</span>
            </Button>
          </div>
        </div>

        {/* Big Display Title: Perfil y Personalización */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-brand-sage-700">Perfil y </span>
            <span className="text-brand-terracotta-600">Personalización</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Espacio personalizado para <strong className="text-stone-900">{userName}</strong>
          </p>
        </div>

        {/* Consolidated Gamification Header Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-3xl border border-brand-sand-300 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-terracotta-100 text-brand-terracotta-600 flex items-center justify-center font-black text-xl shadow-2xs">
              <Flame className="w-6 h-6 fill-brand-terracotta-500 text-brand-terracotta-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Racha Activa</span>
                <span className="text-[10px] font-bold text-brand-sage-800 bg-brand-sage-100 px-2 py-0.5 rounded-full">Nivel {currentLevel}</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-stone-900">
                {activeStreak} {activeStreak === 1 ? 'día consecutivo' : 'días consecutivos'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-brand-sand-300 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-end">
            <div className="text-center sm:text-left">
              <span className="text-xs text-stone-500 block font-medium">Experiencia Total</span>
              <span className="text-base sm:text-lg font-bold text-brand-terracotta-600 flex items-center gap-1 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 text-brand-terracotta-500" />
                {totalXP} XP
              </span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs text-stone-500 block font-medium">Estado de Cuenta</span>
              <span className="text-xs font-bold text-brand-sage-800 bg-brand-sage-100 border border-brand-sage-300 px-2.5 py-1 rounded-full inline-block mt-0.5">
                🌱 Miembro Activo
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* LEFT COLUMN (Wide - 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* CARD 1: Mi Perfil */}
            <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Mi Perfil
                </h2>

                {isEditingProfile ? (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCancelEdit}
                      variant="sand"
                      size="xs"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      variant="primary"
                      size="xs"
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Guardar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleStartEdit}
                    variant="outline"
                    size="xs"
                    leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-sage-600" />}
                  >
                    Editar perfil
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Avatar with Camera edit badge */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-brand-sand-300 shadow-2xs bg-brand-sand-100 flex items-center justify-center">
                    <img
                      src={currentAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/user.png';
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Fields in Soft Capsules */}
                <div className="flex-1 w-full space-y-2.5">
                  
                  {/* Field 1: Nombre Completo */}
                  <div className="bg-brand-sand-100 border border-brand-sand-300 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Nombre Completo:
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-brand-sand-300 focus:outline-none focus:ring-2 focus:ring-brand-sage-500 w-full"
                          placeholder="Tu nombre"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-stone-800">
                          {userName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field 2: Correo Electrónico */}
                  <div className="bg-brand-sand-100 border border-brand-sand-300 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Correo Electrónico:
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-brand-sand-300 focus:outline-none focus:ring-2 focus:ring-brand-sage-500 w-full"
                          placeholder="tu@correo.com"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-stone-800">
                          {userEmail}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Miembro desde */}
                  <div className="bg-brand-sand-100 border border-brand-sand-300 rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        Miembro desde:
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-stone-800">
                        {memberSinceDate}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* CARD 2: Objetivos Personales */}
            <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Objetivos Personales
                </h2>
                <button
                  onClick={() => setShowMoreGoalsModal(true)}
                  className="text-xs font-bold text-brand-sage-700 hover:underline cursor-pointer"
                >
                  + Agregar meta
                </button>
              </div>

              {/* Checkbox items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => toggleObjective(obj.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      obj.checked 
                        ? 'bg-brand-sage-100 border-brand-sage-400 shadow-2xs' 
                        : 'bg-brand-sand-50 border-brand-sand-200 hover:bg-brand-sand-100'
                    }`}
                  >
                    {obj.checked ? (
                      <CheckSquare className="w-5 h-5 text-brand-sage-700 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-stone-800">
                      {obj.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CARD 3: Registro Emocional (Table + Chart Split) */}
            <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-7">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif">
                Registro Emocional Reciente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Left: Minimalist Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-brand-sand-300 text-stone-900 font-bold">
                        <th className="pb-2.5">Fecha</th>
                        <th className="pb-2.5">Estado</th>
                        <th className="pb-2.5">Intensidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-sand-200">
                      {recentTableEntries.map((row, idx) => (
                        <tr key={idx} className="hover:bg-brand-sand-50 transition-colors">
                          <td className="py-2.5 text-stone-600 font-medium">{row.date}</td>
                          <td className="py-2.5 text-stone-900 font-semibold">{row.mood}</td>
                          <td className="py-2.5 text-stone-700 font-bold">{row.intensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right: Line Chart */}
                <div className="h-44 w-full bg-brand-sand-50 rounded-2xl p-3 border border-brand-sand-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#78716c' }} />
                      <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 10, fill: '#78716c' }} />
                      <Tooltip 
                        formatter={(val: any) => [`${val}/10`, 'Intensidad']}
                        contentStyle={{ borderRadius: 12, fontSize: 11, border: '1px solid #e7e5e4' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="intensidad" 
                        stroke="#548c71" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#548c71' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ✨ Insignias y Logros Unificados (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-brand-sand-300 shadow-2xs p-6 sm:p-7 sticky top-20">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-terracotta-600" />
                Insignias & Logros
              </h2>

              {/* Achievements Checklist with Real Badges */}
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                      ach.unlocked 
                        ? 'bg-brand-sage-50 border-brand-sage-300 shadow-2xs' 
                        : 'bg-brand-sand-50 border-brand-sand-200 opacity-60'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{ach.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-stone-900">{ach.title}</p>
                        {ach.unlocked && (
                          <span className="text-[10px] font-bold text-brand-sage-700 bg-brand-sage-100 px-2 py-0.5 rounded-full">
                            Obtenido
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Motivational Footer */}
              <div className="mt-6 pt-4 border-t border-brand-sand-200 text-center">
                <p className="text-xs text-stone-600 font-medium">
                  Racha activa de hábitos: <strong className="text-brand-sage-700 font-bold">{activeStreak} días seguidos</strong>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-brand-sand-300">
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand-300">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Elige tu foto de perfil</h3>
              <button 
                onClick={() => setShowAvatarModal(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-5">
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-3">Avatares disponibles:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => handleSelectAvatar(av.url)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                        currentAvatar === av.url 
                          ? 'border-brand-sage-500 bg-brand-sage-100 ring-2 ring-brand-sage-400' 
                          : 'border-brand-sand-200 hover:border-brand-sand-300 bg-brand-sand-50'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-9 h-9 rounded-full object-cover" />
                      <span className="text-[9px] font-semibold text-stone-600 truncate w-full text-center">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-brand-sand-200">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  O pega una URL personalizada:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarInput}
                    onChange={(e) => setCustomAvatarInput(e.target.value)}
                    placeholder="https://ejemplo.com/mifoto.jpg"
                    className="flex-1 border border-brand-sand-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
                  />
                  <Button
                    onClick={() => {
                      if (customAvatarInput.trim()) {
                        handleSelectAvatar(customAvatarInput.trim());
                      }
                    }}
                    disabled={!customAvatarInput.trim()}
                    variant="primary"
                    size="sm"
                  >
                    Usar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-brand-sand-300">
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand-300">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Configuración de Cuenta</h3>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <label className="block">
                <span className="font-semibold text-stone-700">Nombre de Usuario:</span>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 w-full border border-brand-sand-300 rounded-xl p-2.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-stone-700">Correo Electrónico:</span>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 w-full border border-brand-sand-300 rounded-xl p-2.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-sage-500"
                />
              </label>
              <div className="pt-2">
                <p className="font-semibold text-stone-700 mb-1.5">Privacidad y Seguridad:</p>
                <label className="flex items-center gap-2 p-2.5 bg-brand-sand-50 rounded-xl border border-brand-sand-300">
                  <input type="checkbox" defaultChecked className="accent-brand-sage-600 w-4 h-4 rounded-sm" />
                  <span className="text-stone-800 font-medium">Mantener registros en modo privado protegido</span>
                </label>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowSettingsModal(false);
                onUpdateProfile?.({ name: userName, email: userEmail });
                success('Configuración guardada', 'Los ajustes de tu cuenta se han actualizado.');
              }}
              variant="primary"
              fullWidth
              size="md"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      )}

      {/* More Goals Modal */}
      {showMoreGoalsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-brand-sand-300">
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand-300">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Metas & Hábitos Sugeridos</h3>
              <button 
                onClick={() => setShowMoreGoalsModal(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs">
              {['Higiene del Sueño', 'Menos tiempo en pantallas', 'Diálogo interior positivo', 'Agradecimientos diarios'].map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-brand-sand-50 rounded-2xl border border-brand-sand-300">
                  <span className="font-semibold text-stone-800">{g}</span>
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 50 });
                      const newObj = { id: `custom-${Date.now()}-${idx}`, label: g, checked: true };
                      const updated = [...objectives, newObj];
                      setObjectives(updated);
                      onUpdateProfile?.({ goals: updated });
                      setShowMoreGoalsModal(false);
                      success('Meta agregada', `Has sumado "${g}" a tus objetivos.`);
                    }}
                    className="text-brand-sage-700 hover:text-brand-sage-900 font-bold cursor-pointer bg-brand-sage-100 px-3 py-1 rounded-full text-[11px]"
                  >
                    + Activar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
