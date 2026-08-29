import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { FluxGlowLogo } from '../common/FluxGlowLogo';

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

  const handleAudioToggle = () => {
    if (onToggleAudio) {
      onToggleAudio();
    } else {
      soundEngine.toggleAmbient('zen');
    }
  };

  const navLinks: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'learn', 
      label: 'Explora y aprende', 
      icon: <Info className="w-4 h-4 text-[#548c71]" /> 
    },
    { 
      id: 'journal', 
      label: 'Diario Emocional', 
      icon: <BookOpen className="w-4 h-4 text-[#548c71]" /> 
    },
    { 
      id: 'analytics', 
      label: 'Análisis Predictivo', 
      icon: <TrendingUp className="w-4 h-4 text-[#548c71]" /> 
    },
    { 
      id: 'ai', 
      label: 'Flux ai', 
      icon: (
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#548c71] to-[#de6943] p-0.5 flex items-center justify-center shadow-2xs">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )
    },
    { 
      id: 'alert', 
      label: 'Alerta Emocional', 
      icon: <Bell className="w-4 h-4 text-[#548c71]" />,
      badge: '1'
    },
    { 
      id: 'profile', 
      label: 'Perfil y Personalización', 
      icon: <User className="w-4 h-4 text-[#548c71]" /> 
    },
    { 
      id: 'community', 
      label: 'Comunidad', 
      icon: <Users className="w-4 h-4 text-[#548c71]" /> 
    },
  ];

  const handleNavClick = (id: ViewMode) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f4] border-b border-[#eae3d9] shadow-xs">
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
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1 text-[13px] sm:text-[14px]">
            {navLinks.map((link, idx) => {
              const isActive = currentView === link.id;
              return (
                <React.Fragment key={link.id}>
                  {idx > 0 && (
                    <span className="text-[#c8bfb4] select-none font-light mx-0.5 sm:mx-1">|</span>
                  )}
                  <button
                    id={`nav-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all duration-150 cursor-pointer relative ${
                      isActive
                        ? 'font-bold text-[#253d33] bg-[#e2eee6] border-b-2 border-[#548c71] shadow-2xs'
                        : 'text-stone-700 hover:text-[#253d33] hover:bg-[#f2ece1]'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right helper tools: Audio sound + Landing view switcher + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-2">
            <button
              id="ambient-sound-toggle-btn"
              onClick={handleAudioToggle}
              aria-label={isAudioPlaying ? 'Silenciar música relajante' : 'Activar música relajante'}
              className={`p-2 rounded-full transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                isAudioPlaying 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse' 
                  : 'text-stone-500 hover:bg-[#eae3d9]'
              }`}
              title={isAudioPlaying ? 'Detener música relajante' : 'Reproducir música relajante'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px] font-semibold">{isAudioPlaying ? 'Música activa' : 'Audio Zen'}</span>
            </button>

            <button
              id="nav-home-landing-toggle"
              onClick={() => onNavigate(currentView === 'landing' ? 'learn' : 'landing')}
              aria-label={currentView === 'landing' ? 'Ver Módulos de la Aplicación' : 'Ir a la Portada de Inicio'}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-[#548c71] text-white border-[#548c71] shadow-2xs'
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
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf8f4] border-b border-[#eae3d9] px-4 py-3 shadow-lg animate-slideDown">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#548c71] text-white shadow-xs'
                      : 'text-stone-800 hover:bg-[#f2ece1]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : ''}>{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-[#548c71]' : 'bg-rose-500 text-white'
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


