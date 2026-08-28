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
  Home
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { FluxGlowLogo } from '../common/FluxGlowLogo';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userMood?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isZenPlaying, setIsZenPlaying] = useState(false);

  const toggleAmbientSound = () => {
    const playing = soundEngine.toggleAmbient('zen');
    setIsZenPlaying(playing);
  };

  const navLinks: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'learn', 
      label: 'Explora y aprende', 
      icon: <Info className="w-4 h-4 text-[#4a7c59]" /> 
    },
    { 
      id: 'journal', 
      label: 'Diario Emocional', 
      icon: <BookOpen className="w-4 h-4 text-[#4a7c59]" /> 
    },
    { 
      id: 'analytics', 
      label: 'Análisis Predictivo', 
      icon: <TrendingUp className="w-4 h-4 text-[#4a7c59]" /> 
    },
    { 
      id: 'ai', 
      label: 'Flux ai', 
      icon: (
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#4a7c59] to-[#d4622a] p-0.5 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )
    },
    { 
      id: 'alert', 
      label: 'Alerta Emocional', 
      icon: <Bell className="w-4 h-4 text-[#4a7c59]" />,
      badge: '1'
    },
    { 
      id: 'profile', 
      label: 'Perfil y Personalización', 
      icon: <User className="w-4 h-4 text-[#4a7c59]" /> 
    },
    { 
      id: 'community', 
      label: 'Comunidad', 
      icon: <Users className="w-4 h-4 text-[#4a7c59]" /> 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f4] border-b border-[#eae3d9] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo on Left */}
          <div 
            className="flex items-center cursor-pointer shrink-0 mr-1 sm:mr-3" 
            onClick={() => onNavigate('landing')}
            title="Volver a la Página de Inicio"
          >
            <FluxGlowLogo size="sm" showText={true} />
          </div>

          {/* Main Navigation Links exactly as in design images */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-[13px] sm:text-[14px]">
            {navLinks.map((link, idx) => {
              const isActive = currentView === link.id;
              return (
                <React.Fragment key={link.id}>
                  {idx > 0 && (
                    <span className="text-[#c8bfb4] select-none font-light mx-0.5 sm:mx-1">|</span>
                  )}
                  <button
                    id={`nav-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all relative ${
                      isActive
                        ? 'font-bold text-[#2d5a3f] bg-[#e8f1ec]/80 border-b-2 border-[#4a7c59]'
                        : 'text-stone-700 hover:text-[#2d5a3f] hover:bg-[#f3ede4]'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right helper tools: Audio sound + Landing view switcher */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <button
              id="ambient-sound-toggle-btn"
              onClick={toggleAmbientSound}
              className={`p-2 rounded-full transition-all text-xs font-medium flex items-center gap-1 ${
                isZenPlaying 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'text-stone-500 hover:bg-[#eae3d9]'
              }`}
              title={isZenPlaying ? 'Detener música relajante' : 'Reproducir música relajante'}
            >
              {isZenPlaying ? <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px]">{isZenPlaying ? 'Música activa' : 'Audio Zen'}</span>
            </button>

            <button
              id="nav-home-landing-toggle"
              onClick={() => onNavigate(currentView === 'landing' ? 'learn' : 'landing')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                currentView === 'landing'
                  ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentView === 'landing' ? 'Ver Módulos' : 'Página de Inicio'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

