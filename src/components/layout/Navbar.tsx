import React, { useState, useEffect, useRef } from 'react';
import { ViewMode } from '../../types';
import { 
  Info, 
  BookOpen, 
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
  ChevronDown
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
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate,
  isAudioPlaying = false,
  onToggleAudio
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [pendingMissions, setPendingMissions] = useState<number>(() => getPendingMissionsCount());
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMissionsUpdate = () => {
      setPendingMissions(getPendingMissionsCount());
    };
    window.addEventListener('fluxglow_missions_updated', handleMissionsUpdate);
    return () => window.removeEventListener('fluxglow_missions_updated', handleMissionsUpdate);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAudioToggle = () => {
    if (onToggleAudio) {
      onToggleAudio();
    } else {
      soundEngine.toggleAmbient('zen');
    }
  };

  const primaryNavLinks: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'learn', 
      label: 'Explora y Aprende', 
      icon: <Info className="w-4 h-4 text-brand-sage-600" /> 
    },
    { 
      id: 'journal', 
      label: 'Diario Emocional', 
      icon: <BookOpen className="w-4 h-4 text-brand-sage-600" /> 
    },
    { 
      id: 'missions', 
      label: 'Misiones', 
      icon: <Target className="w-4 h-4 text-brand-terracotta-600" />,
      badge: pendingMissions > 0 ? `${pendingMissions}` : undefined
    },
    { 
      id: 'ai', 
      label: 'Flux AI', 
      icon: (
        <div className="w-4.5 h-4.5 rounded-md bg-gradient-to-tr from-brand-sage-500 to-brand-terracotta-500 p-0.5 flex items-center justify-center shadow-2xs">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )
    },
    { 
      id: 'analytics', 
      label: 'Análisis', 
      icon: <TrendingUp className="w-4 h-4 text-brand-sage-600" /> 
    },
    { 
      id: 'alert', 
      label: 'Alerta', 
      icon: <Bell className="w-4 h-4 text-brand-sage-600" />
    }
  ];

  const secondaryNavLinks: { id: ViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'profile', 
      label: 'Perfil y Metas', 
      icon: <User className="w-4 h-4 text-brand-sage-600" />,
      desc: 'Avatares, objetivos personales y logros'
    },
    { 
      id: 'community', 
      label: 'Comunidad Segura', 
      icon: <Users className="w-4 h-4 text-brand-sage-600" />,
      desc: 'Foros moderados, retos y testimonios'
    },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const handleNavClick = (id: ViewMode) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  const isSecondaryActive = secondaryNavLinks.some(link => link.id === currentView);

  return (
    <header className="sticky top-0 z-50 bg-brand-sand-50/95 backdrop-blur-md border-b border-brand-sand-300 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo on Left */}
          <div 
            className="flex items-center cursor-pointer shrink-0 mr-1 sm:mr-3" 
            onClick={() => onNavigate('landing')}
            title="Volver a la Página de Inicio"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('landing')}
            aria-label="Ir a la página de inicio"
          >
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 py-1 text-[13px] sm:text-[14px]">
            {primaryNavLinks.map((link, idx) => {
              const isActive = currentView === link.id;
              return (
                <React.Fragment key={link.id}>
                  {idx > 0 && (
                    <span className="text-brand-sand-300 select-none font-light mx-0.5">|</span>
                  )}
                  <button
                    id={`nav-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 cursor-pointer relative ${
                      isActive
                        ? 'font-bold text-brand-sage-900 bg-brand-sage-100 border-b-2 border-brand-sage-500 shadow-2xs'
                        : 'text-stone-700 hover:text-brand-sage-900 hover:bg-brand-sand-200'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.2 min-w-4 h-4 text-[10px] font-bold text-white bg-brand-terracotta-600 rounded-full shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}

            {/* Always visible secondary links on very wide screens (2xl) */}
            <div className="hidden 2xl:flex items-center gap-1.5">
              {secondaryNavLinks.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <React.Fragment key={link.id}>
                    <span className="text-brand-sand-300 select-none font-light mx-0.5">|</span>
                    <button
                      id={`nav-2xl-${link.id}`}
                      onClick={() => handleNavClick(link.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'font-bold text-brand-sage-900 bg-brand-sage-100 border-b-2 border-brand-sage-500 shadow-2xs'
                          : 'text-stone-700 hover:text-brand-sage-900 hover:bg-brand-sand-200'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {/* "Más" Dropdown for Medium & Laptop Screens */}
            <div className="relative 2xl:hidden" ref={moreMenuRef}>
              <span className="text-brand-sand-300 select-none font-light mx-0.5">|</span>
              <button
                id="nav-more-menu-btn"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[13px] sm:text-[14px] font-medium transition-all cursor-pointer ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'font-bold text-brand-sage-900 bg-brand-sage-100 shadow-2xs'
                    : 'text-stone-700 hover:text-brand-sage-900 hover:bg-brand-sand-200'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>Más</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-brand-sage-700' : 'text-stone-400'}`} />
              </button>

              {/* Dropdown Menu */}
              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-sand-300 rounded-2xl shadow-lg py-1.5 z-50 animate-fadeIn">
                  {secondaryNavLinks.map((link) => {
                    const isActive = currentView === link.id;
                    return (
                      <button
                        key={link.id}
                        id={`dropdown-nav-${link.id}`}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 hover:bg-brand-sand-100 transition-colors cursor-pointer ${
                          isActive ? 'bg-brand-sage-50 text-brand-sage-900 font-bold' : 'text-stone-800'
                        }`}
                      >
                        <span className="mt-0.5">{link.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight">{link.label}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{link.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </nav>

          {/* Right helper tools: Audio sound + Landing view switcher + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-2">
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-brand-sage-500 text-white border-brand-sage-500 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentView === 'landing' ? 'Ver Módulos' : 'Página de Inicio'}</span>
            </button>

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
        <div className="lg:hidden bg-brand-sand-50 border-b border-brand-sand-300 px-4 py-3 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allNavLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-sage-500 text-white shadow-xs'
                      : 'text-stone-800 hover:bg-brand-sand-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : ''}>{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {'badge' in link && link.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-brand-sage-600' : 'bg-brand-terracotta-600 text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};



