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
  Image as ImageIcon
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
import { UserProfileData } from '../../types';
import { useToast } from '../common/Toast';

interface ProfileModuleProps {
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
}

const PRESET_AVATARS = [
  { id: 'default', label: 'Predeterminado', url: '/user.png' },
  { id: 'logo', label: 'FluxGlow Glow', url: '/logo2.png' },
  { id: 'calm', label: 'Serenidad', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'mindful', label: 'Mindful', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { id: 'nature', label: 'Armonía', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
];

export const ProfileModule: React.FC<ProfileModuleProps> = ({ 
  userProfile, 
  onUpdateProfile 
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

  // Recent 3-day history & chart
  const recentTableEntries = [
    { date: '03/06/2026', mood: 'Feliz', intensity: '8/10', numIntensity: 8, labelDate: '3/6/2026' },
    { date: '02/06/2026', mood: 'Ansioso', intensity: '5/10', numIntensity: 5, labelDate: '2/6/2026' },
    { date: '01/06/2026', mood: 'Tranquilo', intensity: '7/10', numIntensity: 7, labelDate: '1/6/2026' },
  ];

  const chartData = [
    { date: '1/6/2026', intensidad: 7 },
    { date: '2/6/2026', intensidad: 5 },
    { date: '3/6/2026', intensidad: 8 },
  ];

  // Achievements
  const achievements = [
    { id: 1, text: '7 días seguidos registrando emociones.', unlocked: true },
    { id: 2, text: 'Meta de meditación completada.', unlocked: true },
    { id: 3, text: 'Reducción del nivel de estrés.', unlocked: true },
    { id: 4, text: 'Primer mes utilizando la plataforma.', unlocked: true },
    { id: 5, text: 'Objetivo personal alcanzado.', unlocked: true },
  ];

  const currentAvatar = userProfile?.avatarUrl || '/user.png';

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Top Header with Brand Logo & Account Settings Button */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          {/* Right Button: Configuración de Cuenta y Seguridad */}
          <button
            id="account-settings-btn"
            onClick={() => setShowSettingsModal(true)}
            className="bg-white hover:bg-stone-50 text-stone-800 px-4 py-2 rounded-full text-xs font-semibold border border-stone-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#548c71]" />
            <span>Configuración de Cuenta y Seguridad</span>
          </button>
        </div>

        {/* Big Display Title: Perfil y Personalización */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#548c71]">Perfil y </span>
            <span className="text-[#de6943]">Personalización</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Espacio personalizado para <strong className="text-stone-900">{userName}</strong>
          </p>
        </div>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* LEFT COLUMN (Wide - 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* CARD 1: Mi Perfil */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Mi Perfil
                </h2>

                {isEditingProfile ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#548c71] hover:bg-[#43705a] text-white shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#548c71]" />
                    <span>Editar perfil</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Avatar with Camera edit badge */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-stone-200 shadow-sm bg-[#faf8f4] flex items-center justify-center">
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
                  <div className="bg-[#f0e6dc]/80 border border-[#e4d6c7] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Nombre Completo:
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#548c71] w-full"
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
                  <div className="bg-[#f0e6dc]/80 border border-[#e4d6c7] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Correo Electrónico:
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#548c71] w-full"
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
                  <div className="bg-[#f0e6dc]/80 border border-[#e4d6c7] rounded-2xl px-4 py-2.5 flex items-center justify-between">
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
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Objetivos Personales
                </h2>
                <button
                  onClick={() => setShowMoreGoalsModal(true)}
                  className="text-xs font-bold text-[#548c71] hover:underline cursor-pointer"
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
                        ? 'bg-[#e2eee6]/60 border-[#548c71]/40 shadow-2xs' 
                        : 'bg-[#faf8f4] border-stone-200 hover:bg-stone-100/80'
                    }`}
                  >
                    {obj.checked ? (
                      <CheckSquare className="w-5 h-5 text-[#548c71] shrink-0" />
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
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif">
                Registro Emocional
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Left: Minimalist Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-900 font-bold">
                        <th className="pb-2.5">Fecha</th>
                        <th className="pb-2.5">Estado de ánimo</th>
                        <th className="pb-2.5">Intensidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {recentTableEntries.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50 transition-colors">
                          <td className="py-2.5 text-stone-600 font-medium">{row.date}</td>
                          <td className="py-2.5 text-stone-900 font-semibold">{row.mood}</td>
                          <td className="py-2.5 text-stone-700 font-bold">{row.intensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right: Line Chart */}
                <div className="h-44 w-full bg-[#faf8f4] rounded-2xl p-3 border border-stone-200/80">
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

          {/* RIGHT COLUMN: ✨ Logros obtenidos (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7 sticky top-20">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#de6943]" />
                Logros obtenidos
              </h2>

              {/* Achievements Checklist */}
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#e2eee6]/70 border border-[#548c71]/20 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#548c71] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug">
                      {ach.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Motivational Footer */}
              <div className="mt-6 pt-4 border-t border-stone-100 text-center">
                <p className="text-xs text-stone-500 font-medium">
                  Racha activa: <strong className="text-[#548c71]">7 días consecutivos</strong>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Elige tu foto de perfil</h3>
              <button 
                onClick={() => setShowAvatarModal(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-5">
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-3">Avatares disponibles:</p>
                <div className="grid grid-cols-5 gap-3">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => handleSelectAvatar(av.url)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                        currentAvatar === av.url 
                          ? 'border-[#548c71] bg-[#e2eee6] ring-2 ring-[#548c71]/40' 
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-[9px] font-semibold text-stone-600 truncate w-full text-center">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  O pega una URL personalizada:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarInput}
                    onChange={(e) => setCustomAvatarInput(e.target.value)}
                    placeholder="https://ejemplo.com/mifoto.jpg"
                    className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#548c71]"
                  />
                  <button
                    onClick={() => {
                      if (customAvatarInput.trim()) {
                        handleSelectAvatar(customAvatarInput.trim());
                      }
                    }}
                    disabled={!customAvatarInput.trim()}
                    className="bg-[#548c71] hover:bg-[#43705a] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Usar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Configuración de Cuenta</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
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
                  className="mt-1 w-full border border-stone-300 rounded-xl p-2.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#548c71]"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-stone-700">Correo Electrónico:</span>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 w-full border border-stone-300 rounded-xl p-2.5 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#548c71]"
                />
              </label>
              <div className="pt-2">
                <p className="font-semibold text-stone-700 mb-1.5">Privacidad y Seguridad:</p>
                <label className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <input type="checkbox" defaultChecked className="accent-[#548c71] w-4 h-4 rounded-sm" />
                  <span className="text-stone-800 font-medium">Mantener registros en modo privado protegido</span>
                </label>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSettingsModal(false);
                onUpdateProfile?.({ name: userName, email: userEmail });
                success('Configuración guardada', 'Los ajustes de tu cuenta se han actualizado.');
              }}
              className="w-full bg-[#548c71] hover:bg-[#43705a] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* More Goals Modal */}
      {showMoreGoalsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Metas & Hábitos Sugeridos</h3>
              <button onClick={() => setShowMoreGoalsModal(false)} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs">
              {['Higiene del Sueño', 'Menos tiempo en pantallas', 'Diálogo interior positivo', 'Agradecimientos diarios'].map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#faf8f4] rounded-2xl border border-stone-200/80">
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
                    className="text-[#548c71] hover:text-[#43705a] font-bold cursor-pointer bg-[#e2eee6] px-3 py-1 rounded-full text-[11px]"
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

