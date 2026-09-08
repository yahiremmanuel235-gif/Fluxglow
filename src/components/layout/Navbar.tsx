import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import { 
  Info, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  User, 
  Users, 
  Volume2, 
  VolumeX, 
  Home,
  Menu,
  X,
  Target,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { getPendingMissionsCount } from '../../utils/missionsManager';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userMood?: string;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  isLoggedIn?: boolean;
  onSignOut?: () => void;
  userPoints?: number;
  userLevel?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate,
  isAudioPlaying = false,
  onToggleAudio,
  isLoggedIn = false,
  onSignOut,
  userPoints,
  userLevel
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingMissions, setPendingMissions] = useState<number>(() => getPendingMissionsCount());
  const [currentRisk, setCurrentRisk] = useState<string>(() => {
    try {
      return localStorage.getItem('fluxglow_risk_level') || 'moderado';
    } catch {
      return 'moderado';
    }
  });

  useEffect(() => {
    const handleMissionsUpdate = () => {
      setPendingMissions(getPendingMissionsCount());
    };
    const handleRiskUpdate = (e: any) => {
      setCurrentRisk(e.detail || 'moderado');
    };

    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    window.addEventListener('fluxglow_risk_level_updated', handleRiskUpdate);
    return () => {
      window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
      window.removeEventListener('fluxglow_risk_level_updated', handleRiskUpdate);
    };
  }, []);

  const handleAudioToggle = () => {
    if (onToggleAudio) {
      onToggleAudio();
    } else {
      soundEngine.toggleAmbient('zen');
    }
  };

  // The 7 official tabs according to design guidelines
  const navTabs: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'learn', 
      label: 'Explora y aprende', 
      icon: <Info className="w-4 h-4 shrink-0" /> 
    },
    { 
      id: 'journal', 
      label: 'Diario Emocional', 
      icon: <Calendar className="w-4 h-4 shrink-0" /> 
    },
    { 
      id: 'analytics', 
      label: 'Análisis Predictivo', 
      icon: <TrendingUp className="w-4 h-4 shrink-0" /> 
    },
    { 
      id: 'ai', 
      label: 'Flux AI', 
      icon: <Sparkles className="w-4 h-4 shrink-0 text-[#E87A52]" />
    },
    { 
      id: 'alert', 
      label: 'Alerta Emocional', 
      icon: <Bell className={`w-4 h-4 shrink-0 ${currentRisk === 'elevado' ? 'text-rose-600 animate-bounce' : ''}`} />,
      badge: currentRisk === 'elevado' ? 'SOS' : currentRisk === 'moderado' ? '!' : undefined
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: <User className="w-4 h-4 shrink-0" /> 
    },
    { 
      id: 'community', 
      label: 'Comunidad', 
      icon: <Users className="w-4 h-4 shrink-0" /> 
    },
  ];

  const allDrawerLinks = [
    { id: 'dashboard' as ViewMode, label: 'Centro de Control', icon: <LayoutDashboard className="w-4 h-4" /> },
    ...navTabs,
    { 
      id: 'missions' as ViewMode, 
      label: 'Misiones Diarias', 
      icon: <Target className="w-4 h-4 text-[#E87A52]" />,
      badge: pendingMissions > 0 ? `${pendingMissions}` : undefined
    },
  ];

  const handleNavClick = (id: ViewMode) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo on Left */}
          <div 
            className="flex items-center cursor-pointer shrink-0 mr-2 sm:mr-4" 
            onClick={() => onNavigate('landing')}
            title="Volver a la Página de Inicio"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('landing')}
            aria-label="Ir a la página de inicio"
          >
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          {/* Desktop Navigation Links with Active Green Bottom Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-16">
            {navTabs.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative h-full flex items-center gap-1.5 px-2.5 xl:px-3 text-xs xl:text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'font-bold text-[#1A1A1A]'
                      : 'font-medium text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className={isActive ? 'text-[#5F927B]' : 'text-stone-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 min-w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#5F927B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right helper tools: Audio sound + Landing view switcher + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-2">
            {/* User XP & Level Pill */}
            {userPoints !== undefined && (
              <button
                id="nav-user-points-badge"
                onClick={() => onNavigate('missions')}
                title={`Nivel ${userLevel || 1} • ${userPoints} XP. Clic para ver Misiones Diarias.`}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-mono text-xs">{userPoints} XP</span>
                <span className="hidden sm:inline text-[10px] text-amber-800 font-semibold bg-amber-200/60 px-1.5 py-0.5 rounded-full">
                  Nv.{userLevel || 1}
                </span>
              </button>
            )}

            <button
              id="ambient-sound-toggle-btn"
              onClick={handleAudioToggle}
              aria-label={isAudioPlaying ? 'Silenciar música relajante' : 'Activar música relajante'}
              className={`p-2 rounded-full transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                isAudioPlaying 
                  ? 'bg-brand-gold-100 text-brand-gold-700 border border-brand-gold-300 shadow-2xs animate-pulse' 
                  : 'text-stone-500 hover:bg-brand-sand-200'
              }`}
              title={isAudioPlaying ? 'Detener música relajante' : 'Reproducir música relajante'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-brand-gold-700" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px] font-semibold">{isAudioPlaying ? 'Música activa' : 'Audio Zen'}</span>
            </button>

            <button
              id="nav-home-landing-toggle"
              onClick={() => onNavigate(currentView === 'landing' ? 'learn' : 'landing')}
              aria-label={currentView === 'landing' ? 'Ver Módulos de la Aplicación' : 'Ir a la Portada de Inicio'}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-[#5F927B] text-white border-[#5F927B] shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentView === 'landing' ? 'Ver Módulos' : 'Página de Inicio'}</span>
            </button>

            {isLoggedIn && onSignOut && (
              <button
                id="nav-signout-btn"
                onClick={onSignOut}
                aria-label="Cerrar sesión"
                title="Cerrar sesión de Supabase"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-red-700 bg-white border border-stone-300 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Salir</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              id="nav-mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF9F5] border-b border-[#E8E4DC] px-4 py-3 shadow-lg animate-fadeIn">
          {userPoints !== undefined && (
            <div 
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('missions');
              }}
              className="mb-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-950">Progreso de Hábitos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-900 font-mono">{userPoints} XP</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-full">
                  Nivel {userLevel || 1}
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allDrawerLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#5F927B] text-white shadow-xs'
                      : 'text-stone-800 hover:bg-[#F2ECE1]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-stone-500'}>{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {'badge' in link && link.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-[#5F927B]' : 'bg-[#E87A52] text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isLoggedIn && onSignOut && (
            <div className="pt-2.5 mt-2.5 border-t border-[#E8E4DC]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-3 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};



