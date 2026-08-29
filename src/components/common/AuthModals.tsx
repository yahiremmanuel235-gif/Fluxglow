import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Heart
} from 'lucide-react';
import { FluxGlowLogo } from './FluxGlowLogo';
import { ViewMode, UserProfileData } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  currentUser?: UserProfileData;
  onClose: () => void;
  onSuccess: (targetView: ViewMode, updatedProfile?: Partial<UserProfileData>) => void;
}

export const AuthModals: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageGroup, setAgeGroup] = useState('19 - 24 años');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Gestión del Estrés',
    'Atención Plena',
    'Productividad',
    'Crecimiento Personal'
  ]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const goalOptions = [
    'Gestión del Estrés',
    'Atención Plena',
    'Productividad',
    'Crecimiento Personal',
    'Hábitos Saludables y Sueño',
    'Comunidad y Apoyo Mutuo'
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const formatTodaySpanish = () => {
    const today = new Date();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${today.getDate()} de ${months[today.getMonth()]}, ${today.getFullYear()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const formattedGoals = goalOptions.map((g, index) => ({
      id: `goal-${index}`,
      label: g,
      checked: selectedGoals.includes(g),
    }));

    let resolvedName = name.trim();
    if (!resolvedName) {
      if (email.trim()) {
        const handle = email.trim().split('@')[0];
        resolvedName = handle.charAt(0).toUpperCase() + handle.slice(1).replace(/[\._]/g, ' ');
      } else {
        resolvedName = 'Usuario FluxGlow';
      }
    }

    const resolvedEmail = email.trim() || 'usuario@fluxglow.com';

    const updatedProfile: Partial<UserProfileData> = {
      name: resolvedName,
      email: resolvedEmail,
      ageGroup: ageGroup,
      memberSince: currentUser?.memberSince || formatTodaySpanish(),
      goals: formattedGoals,
      isLoggedIn: true,
      avatarUrl: currentUser?.avatarUrl || '/user.png'
    };

    setTimeout(() => {
      onSuccess('learn', updatedProfile);
      onClose();
      setSubmitted(false);
    }, 900);
  };

  const handleGuestEntry = () => {
    onSuccess('learn');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#fbf9f5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-6 sm:px-8 text-center border-b border-stone-200/80 bg-white">
          <div className="flex justify-center mb-3">
            <FluxGlowLogo size="md" />
          </div>
          
          <h3 className="text-2xl font-extrabold text-stone-900 font-serif">
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu espacio de bienestar'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
            {mode === 'login' 
              ? 'Accede a tu diario emocional, análisis predictivo y asistente Flux AI.' 
              : 'Únete a FluxGlow de forma gratuita, confidencial y personalizada.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-[#ede8e1] rounded-2xl max-w-xs mx-auto mt-4">
            <button
              id="tab-auth-register"
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-[#5a8c72] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Registrarse
            </button>
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-[#e07a52] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 bg-[#5a8c72]/15 text-[#3e6852] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                {mode === 'login' ? '¡Sesión Iniciada con Éxito!' : '¡Bienvenido a FluxGlow!'}
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Preparando tu entorno emocional personalizado...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Register: Name & Age */}
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Nombre completo o apodo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="reg-input-name"
                        type="text"
                        required
                        placeholder="Ej. Tu nombre o apodo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8c72]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Rango de Edad
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['15 - 18 años', '19 - 24 años', '25 - 30 años'].map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setAgeGroup(group)}
                          className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                            ageGroup === group
                              ? 'bg-[#5a8c72]/15 border-[#5a8c72] text-[#325744]'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="auth-input-email"
                    type="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8c72]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Se ha enviado un enlace de recuperación a tu correo de demostración.')}
                      className="text-[11px] text-[#d4622a] hover:underline font-semibold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="auth-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a8c72]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Register: Personal goals */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#d4622a]" />
                    <span>¿En qué te gustaría enfocarte?</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {goalOptions.map((goal) => {
                      const isSelected = selectedGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleGoal(goal)}
                          className={`p-2 rounded-xl text-[11px] font-semibold text-left border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#5a8c72]/15 border-[#5a8c72] text-[#2c5240]'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span className="truncate">{goal}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#3f6551] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="auth-modal-submit-btn"
                type="submit"
                className={`w-full py-3 px-6 rounded-2xl font-bold text-sm text-white shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 ${
                  mode === 'register'
                    ? 'bg-[#5a8c72] hover:bg-[#48725c]'
                    : 'bg-[#e07a52] hover:bg-[#c9663e]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{mode === 'register' ? 'Comenzar mi experiencia' : 'Entrar a mi Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guest demo button */}
              <div className="pt-2 text-center">
                <button
                  id="auth-modal-guest-btn"
                  type="button"
                  onClick={handleGuestEntry}
                  className="text-xs text-stone-600 hover:text-stone-900 underline font-medium"
                >
                  O entrar de inmediato en Modo Exploración (Sin registro)
                </button>
              </div>

              {/* Privacy badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5a8c72]" />
                <span>Tus datos y registros están 100% protegidos y son privados</span>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
