import React, { useState, useEffect, useRef } from 'react';
import { ViewMode } from '../../types';
import { 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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

  // Close "Más Opciones" on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary navigation tabs in requested order:
  // Centro de Control, Explora y Aprende, Diario Emocional, Flux AI, Misiones Diarias
  const primaryTabs: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Centro de Control', 
      icon: <LayoutDashboard className="w-4 h-4 shrink-0 text-[#5F927B]" /> 
    },
    { 
      id: 'learn', 
      label: 'Explora y Aprende', 
      icon: <img src="/assets/icons/nav-info.png" alt="Explora" className="w-4 h-4 shrink-0 object-contain" /> 
    },
    { 
      id: 'journal', 
      label: 'Diario Emocional', 
      icon: <img src="/assets/icons/nav-journal.png" alt="Diario" className="w-4 h-4 shrink-0 object-contain" /> 
    },
    { 
      id: 'ai', 
      label: 'Flux AI', 
      icon: <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-4 h-4 shrink-0 object-contain" />
    },
    { 
      id: 'missions', 
      label: 'Misiones Diarias', 
      icon: <img src="/assets/icons/medal.png" alt="Misiones" className="w-4 h-4 shrink-0 object-contain" />,
      badge: pendingMissions > 0 ? `${pendingMissions}` : undefined
    },
    { 
      id: 'community', 
      label: 'Comunidad', 
      icon: <img src="/assets/icons/nav-community.png" alt="Comunidad" className="w-4 h-4 shrink-0 object-contain" /> 
    }
  ];

  // Secondary tabs under "Más Opciones":
  // Análisis Predictivo, Perfil, y Alerta Emocional
  const moreOptionsTabs: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'analytics', 
      label: 'Análisis Predictivo', 
      icon: <img src="/assets/icons/nav-analytics.png" alt="Análisis" className="w-4 h-4 shrink-0 object-contain" /> 
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: <img src="/assets/icons/nav-profile.png" alt="Perfil" className="w-4 h-4 shrink-0 object-contain" /> 
    },
    { 
      id: 'alert', 
      label: 'Alerta Emocional', 
      icon: <img src="/assets/icons/nav-bell.png" alt="Alertas" className={`w-4 h-4 shrink-0 object-contain ${currentRisk === 'elevado' ? 'animate-bounce' : ''}`} />,
      badge: currentRisk === 'elevado' ? 'SOS' : currentRisk === 'moderado' ? '!' : undefined
    }
  ];

  // For the mobile hamburger drawer: list all 9 modules without "Página de Inicio"
  const allDrawerLinks: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    ...primaryTabs,
    ...moreOptionsTabs
  ];

  const handleNavClick = (id: ViewMode) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const isMoreActive = moreOptionsTabs.some(tab => tab.id === currentView);
  const moreAlertBadge = currentRisk === 'elevado' ? 'SOS' : undefined;

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC] shadow-xs">
      {/* Top Brand Color Bath Accent Line (Sage Green & Terracotta Orange) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#5F927B] via-[#E87A52] to-[#5F927B]" />

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

          {/* Desktop Navigation Links with Active Sage & Terracotta Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-16">
            {primaryTabs.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative h-full flex items-center gap-1.5 px-3 xl:px-3.5 text-xs xl:text-[13px] whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'font-bold text-[#1A1A1A] bg-gradient-to-b from-transparent via-[#5F927B]/5 to-[#5F927B]/10'
                      : 'font-medium text-stone-600 hover:text-stone-900 hover:bg-[#5F927B]/5'
                  }`}
                >
                  <span className={isActive ? 'scale-110 drop-shadow-xs transition-transform' : 'opacity-80'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 min-w-4 h-4 text-[10px] font-bold text-white bg-[#E87A52] rounded-full shadow-2xs">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-[#5F927B] to-[#E87A52] rounded-full shadow-xs" />
                  )}
                </button>
              );
            })}

            {/* "Más Opciones" Dropdown Menu */}
            <div className="relative h-full flex items-center" ref={moreMenuRef}>
              <button
                id="nav-more-options-btn"
                onClick={() => setMoreMenuOpen(prev => !prev)}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
                className={`relative h-full flex items-center gap-1.5 px-3 xl:px-3.5 text-xs xl:text-[13px] whitespace-nowrap transition-all cursor-pointer ${
                  isMoreActive
                    ? 'font-bold text-[#1A1A1A] bg-gradient-to-b from-transparent via-[#5F927B]/5 to-[#5F927B]/10'
                    : 'font-medium text-stone-600 hover:text-stone-900 hover:bg-[#5F927B]/5'
                }`}
              >
                <span>Más Opciones</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-[#5F927B]' : 'text-stone-500'}`} />
                {moreAlertBadge && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 min-w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-2xs animate-pulse">
                    {moreAlertBadge}
                  </span>
                )}
                {isMoreActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-[#5F927B] to-[#E87A52] rounded-full shadow-xs" />
                )}
              </button>

              {/* Dropdown Floating Panel */}
              {moreMenuOpen && (
                <div 
                  id="nav-more-options-dropdown"
                  className="absolute top-[calc(100%-6px)] right-0 w-60 bg-white rounded-2xl shadow-xl border border-[#E8E4DC] p-2 z-50 animate-fadeIn"
                >
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 py-1.5">
                    Opciones adicionales
                  </div>
                  <div className="space-y-1">
                    {moreOptionsTabs.map((item) => {
                      const isItemActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`nav-more-${item.id}`}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                            isItemActive
                              ? 'bg-[#5F927B]/10 text-[#2F5343] font-bold'
                              : 'text-stone-700 hover:bg-[#FBF9F5] hover:text-stone-950 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isItemActive ? 'scale-105' : 'opacity-80'}>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              item.badge === 'SOS' 
                                ? 'bg-red-600 text-white animate-bounce' 
                                : 'bg-[#E87A52] text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right helper tools: SignOut button + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-1">
            {isLoggedIn && onSignOut && (
              <button
                id="nav-signout-btn"
                onClick={onSignOut}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-red-700 bg-white border border-stone-300 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer shadow-2xs"
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
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer shadow-2xs"
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
              className="mb-2.5 p-2.5 bg-[#FDF4F0] border border-[#F7D3C3] rounded-2xl flex items-center justify-between select-none shadow-2xs"
              title={`Progreso de Hábitos: ${userPoints} XP • Nivel ${userLevel || 1}`}
            >
              <div className="flex items-center gap-2">
                <img src="/assets/icons/trophy.png" alt="XP" className="w-4 h-4 object-contain" />
                <span className="text-xs font-bold text-[#3E6855]">Progreso de Hábitos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#B54F2C] font-mono">{userPoints} XP</span>
                <span className="text-[10px] bg-[#EBF1EA] text-[#3E6855] border border-[#C5DDD0] font-bold px-2 py-0.5 rounded-full">
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



