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
  CheckCircle2
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

interface ProfileModuleProps {
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: Partial<UserProfileData>) => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({ 
  userProfile, 
  onUpdateProfile 
}) => {
  const [userName, setUserName] = useState(userProfile?.name || 'Usuario FluxGlow');
  const [userEmail, setUserEmail] = useState(userProfile?.email || 'usuario@fluxglow.com');
  const [memberSinceDate, setMemberSinceDate] = useState(userProfile?.memberSince || '28 de Agosto, 2026');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoreGoalsModal, setShowMoreGoalsModal] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Sync if prop changes (e.g. after registration or login)
  useEffect(() => {
    if (userProfile?.name) setUserName(userProfile.name);
    if (userProfile?.email) setUserEmail(userProfile.email);
    if (userProfile?.memberSince) setMemberSinceDate(userProfile.memberSince);
  }, [userProfile?.name, userProfile?.email, userProfile?.memberSince]);

  // Objectives Checkboxes matching Image 7
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
  };

  const handleSaveName = () => {
    const finalName = userName.trim() || 'Usuario FluxGlow';
    setUserName(finalName);
    setIsEditingName(false);
    onUpdateProfile?.({ name: finalName });
    triggerSaveFeedback();
  };

  const handleSaveEmail = () => {
    const finalEmail = userEmail.trim() || 'usuario@fluxglow.com';
    setUserEmail(finalEmail);
    setIsEditingEmail(false);
    onUpdateProfile?.({ email: finalEmail });
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  // Recent 3-day history & chart matching Image 7
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

  // Achievements matching Image 7
  const achievements = [
    { id: 1, text: '7 días seguidos registrando emociones.', unlocked: true },
    { id: 2, text: 'Meta de meditación completada.', unlocked: true },
    { id: 3, text: 'Reducción del nivel de estrés.', unlocked: true },
    { id: 4, text: 'Primer mes utilizando la plataforma.', unlocked: true },
    { id: 5, text: 'Objetivo personal alcanzado.', unlocked: true },
  ];

  // Get user initials for custom avatar display
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (nameStr[0] || 'Y').toUpperCase();
  };

  return (
    <div className="w-full bg-[#fbf9f5] min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">

        {/* Saved Toast */}
        {showSavedFeedback && (
          <div className="fixed top-20 right-6 z-50 bg-[#2d5a3f] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4 text-[#8DB596]" />
            <span>Perfil actualizado exitosamente</span>
          </div>
        )}

        {/* Top Header with Brand Logo & Account Settings Button */}
        <div className="flex items-center justify-between py-2 border-b border-[#ece4d9] mb-4">
          <div className="flex items-center gap-2">
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          {/* Right Button from Image 7: Configuración de Cuenta y Seguridad */}
          <button
            id="account-settings-btn"
            onClick={() => setShowSettingsModal(true)}
            className="bg-white hover:bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-xs font-semibold border border-stone-300 shadow-2xs transition-all flex items-center gap-2"
          >
            <Settings className="w-3.5 h-3.5 text-[#5a8c72]" />
            <span>Configuración de Cuenta y Seguridad</span>
          </button>
        </div>

        {/* Big Display Title: Perfil y Personalización */}
        <div className="text-center my-6">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-[#5a8c72]">Perfil y </span>
            <span className="text-[#e07a52]">Personalización</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Espacio personalizado para <strong className="text-stone-900">{userName}</strong>
          </p>
        </div>

        {/* Main 2-Column Grid Layout from Image 7 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* LEFT COLUMN (Wide - 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* CARD 1: Mi Perfil */}
            <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 sm:p-7">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif">
                Mi Perfil
              </h2>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Avatar with Camera edit badge & official user avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-stone-200 shadow-sm bg-[#dfe5e8] flex items-center justify-center">
                    {(() => {
                      const avatarSrc = (userProfile?.avatarUrl && !userProfile.avatarUrl.includes('unsplash.com'))
                        ? userProfile.avatarUrl 
                        : '/User.png';

                      return (
                        <img
                          src={avatarSrc}
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src.endsWith('/User.png')) {
                              target.src = '/user.png';
                            } else {
                              target.style.display = 'none';
                            }
                          }}
                        />
                      );
                    })()}
                  </div>
                  <button 
                    onClick={() => {
                      const newUrl = prompt('Ingresa la URL de tu foto de perfil (o déjalo vacío para usar la foto oficial /User.png):', userProfile?.avatarUrl || '');
                      if (newUrl !== null) {
                        onUpdateProfile?.({ avatarUrl: newUrl.trim() || '/User.png' });
                        triggerSaveFeedback();
                      }
                    }}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Fields in Soft Beige Capsules matching Image 7 */}
                <div className="flex-1 w-full space-y-2.5">
                  
                  {/* Field 1: Nombre Completo */}
                  <div className="bg-[#f0e6dc] rounded-2xl px-4 py-2.5 flex items-center justify-between transition-colors hover:bg-[#eadecf]">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Nombre Completo:
                      </span>
                      {isEditingName ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            autoFocus
                            className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#5a8c72] w-full"
                          />
                          <button
                            onClick={handleSaveName}
                            className="p-1 bg-[#5a8c72] text-white rounded-md hover:bg-[#4a755e]"
                            title="Guardar nombre"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-stone-800">
                          {userName}
                        </span>
                      )}
                    </div>

                    {!isEditingName && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-stone-600 hover:text-stone-900 p-1 hover:bg-stone-200/60 rounded-md transition-colors"
                        title="Editar nombre"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Field 2: Correo Electrónico */}
                  <div className="bg-[#f0e6dc] rounded-2xl px-4 py-2.5 flex items-center justify-between transition-colors hover:bg-[#eadecf]">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                        Correo Electrónico :
                      </span>
                      {isEditingEmail ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEmail()}
                            autoFocus
                            className="bg-white px-2.5 py-1 rounded-lg text-xs sm:text-sm text-stone-900 font-semibold border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#5a8c72] w-full"
                          />
                          <button
                            onClick={handleSaveEmail}
                            className="p-1 bg-[#5a8c72] text-white rounded-md hover:bg-[#4a755e]"
                            title="Guardar correo"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-stone-800">
                          {userEmail}
                        </span>
                      )}
                    </div>

                    {!isEditingEmail && (
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="text-stone-600 hover:text-stone-900 p-1 hover:bg-stone-200/60 rounded-md transition-colors"
                        title="Editar correo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Field 3: Miembro desde */}
                  <div className="bg-[#f0e6dc] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        Miembro desde :
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
            <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900 font-serif">
                  Objetivos Personales
                </h2>
                <button
                  onClick={() => setShowMoreGoalsModal(true)}
                  className="text-xs font-bold text-[#5a8c72] hover:underline"
                >
                  Ver más
                </button>
              </div>

              {/* 4 Checkbox items matching Image 7 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => toggleObjective(obj.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-all cursor-pointer"
                  >
                    {obj.checked ? (
                      <CheckSquare className="w-5 h-5 text-[#5a8c72] shrink-0" />
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
            <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 sm:p-7">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif">
                Registro Emocional
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Left: Minimalist Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b-2 border-stone-200 text-stone-900 font-bold">
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

                {/* Right: Line Chart matching Image 7 */}
                <div className="h-44 w-full bg-stone-50 rounded-2xl p-2 border border-stone-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#57534e' }} />
                      <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 10, fill: '#57534e' }} />
                      <Tooltip 
                        formatter={(val: any) => [`${val}/10`, 'Intensidad']}
                        contentStyle={{ borderRadius: 8, fontSize: 11 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="intensidad" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#3b82f6' }} 
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
            <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-sm p-6 sm:p-7 sticky top-20">
              <h2 className="text-xl font-bold text-stone-900 mb-5 font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e07a52]" />
                Logros obtenidos
              </h2>

              {/* Achievements Checklist matching Image 7 */}
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#5a8c72] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug">
                      {ach.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Motivational Footer */}
              <div className="mt-8 pt-4 border-t border-stone-100 text-center">
                <p className="text-xs text-stone-500 font-medium">
                  Racha activa: <strong className="text-emerald-700">7 días consecutivos</strong>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Configuración de Cuenta</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-stone-400 hover:text-stone-700">
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
                  className="mt-1 w-full border border-stone-300 rounded-lg p-2 text-stone-800 font-medium"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-stone-700">Correo Electrónico:</span>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 w-full border border-stone-300 rounded-lg p-2 text-stone-800 font-medium"
                />
              </label>
              <div className="pt-2">
                <p className="font-semibold text-stone-700 mb-1">Privacidad y Seguridad:</p>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#5a8c72] w-4 h-4 rounded-sm" />
                  <span>Mantener registros en modo ultra-privado</span>
                </label>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSettingsModal(false);
                onUpdateProfile?.({ name: userName, email: userEmail });
                triggerSaveFeedback();
              }}
              className="w-full bg-[#5a8c72] hover:bg-[#4a755e] text-white py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* More Goals Modal */}
      {showMoreGoalsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-serif">Metas & Hábitos</h3>
              <button onClick={() => setShowMoreGoalsModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs">
              {['Higiene del Sueño', 'Menos tiempo en pantallas', 'Diálogo interior positivo', 'Agradecimientos diarios'].map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                  <span className="font-medium text-stone-800">{g}</span>
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 50 });
                      const newObj = { id: `custom-${Date.now()}-${idx}`, label: g, checked: true };
                      const updated = [...objectives, newObj];
                      setObjectives(updated);
                      onUpdateProfile?.({ goals: updated });
                      setShowMoreGoalsModal(false);
                      triggerSaveFeedback();
                    }}
                    className="text-[#5a8c72] hover:text-[#4a755e] font-bold cursor-pointer"
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
