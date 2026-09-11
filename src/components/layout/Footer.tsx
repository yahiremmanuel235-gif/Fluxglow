import React from 'react';
import { ViewMode } from '../../types';
import { FluxGlowLogo } from '../common/FluxGlowLogo';
import { Mail, Phone, Instagram, Facebook, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  variant?: 'full' | 'compact';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, variant = 'full' }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'compact') {
    return (
      <footer className="bg-[#1C2B26] text-stone-400 py-3.5 px-4 sm:px-6 lg:px-8 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div 
              className="cursor-pointer" 
              onClick={() => { onNavigate('landing'); scrollToTop(); }}
              title="Ir a Inicio"
            >
              <img src="/assets/brand/logo-fluxglowSF.png" alt="FluxGlow" className="h-8 sm:h-9 w-auto object-contain" />
            </div>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-stone-400 font-medium">Iluminando tu bienestar comprendiendo tus emociones · Versión Beta 1.0</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400">
            <a 
              href="mailto:fluxglow680@gmail.com?subject=Soporte%20FluxGlow"
              className="hover:text-emerald-400 transition-colors"
            >
              Soporte
            </a>
            <span className="text-stone-700">•</span>
            <span className="text-stone-400">Términos y Privacidad</span>
            <span className="text-stone-700">•</span>
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Volver arriba"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Arriba</span>
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1C2822] text-stone-300 relative border-t-2 border-[#5F927B]/40">
      {/* Top Brand Color Bath Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#5F927B] via-[#E87A52] to-[#5F927B]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div 
              className="cursor-pointer inline-block" 
              onClick={() => { onNavigate('landing'); scrollToTop(); }}
              title="Ir a Inicio"
            >
              <img src="/assets/brand/logo-fluxglowSF.png" alt="FluxGlow" className="h-10 sm:h-12 w-auto object-contain" />
            </div>
            
            <p className="text-stone-300 text-sm leading-relaxed italic font-serif">
              "Iluminando tu bienestar, comprendiendo tus emociones"
            </p>

            <p className="text-stone-400 text-xs leading-relaxed">
              Plataforma digital inteligente diseñada para acompañar a los jóvenes en el conocimiento, gestión y fortalecimiento de su salud emocional.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#8DB596] font-medium bg-[#5F927B]/10 p-2.5 rounded-xl border border-[#5F927B]/20">
              <img src="/assets/icons/alert-shield.png" alt="Seguridad" className="w-4 h-4 object-contain shrink-0" />
              <span>Privacidad y Confidencialidad Garantizada</span>
            </div>
          </div>

          {/* Col 2: Los 7 Apartados */}
          <div className="space-y-3">
            <h4 className="text-[#E87A52] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E87A52]" />
              7 Apartados Interactivos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  id="footer-nav-learn"
                  onClick={() => onNavigate('learn')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-info.png" alt="Aprende" className="w-4 h-4 object-contain shrink-0" />
                  <span>#1 Centro de Aprendizaje Emocional</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-journal"
                  onClick={() => onNavigate('journal')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-journal.png" alt="Diario" className="w-4 h-4 object-contain shrink-0" />
                  <span>#2 Diario Emocional Inteligente</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-analytics"
                  onClick={() => onNavigate('analytics')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-analytics.png" alt="Análisis" className="w-4 h-4 object-contain shrink-0" />
                  <span>#3 Análisis Predictivo Avanzado</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-ai"
                  onClick={() => onNavigate('ai')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-ai.png" alt="Flux AI" className="w-4 h-4 object-contain shrink-0" />
                  <span>#4 Asistente Virtual Flux AI</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-alert"
                  onClick={() => onNavigate('alert')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/alert-shield.png" alt="SOS" className="w-4 h-4 object-contain shrink-0" />
                  <span>#5 Alerta Emocional Inteligente & SOS</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-profile"
                  onClick={() => onNavigate('profile')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-profile.png" alt="Perfil" className="w-4 h-4 object-contain shrink-0" />
                  <span>#6 Perfil y Personalización</span>
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-community"
                  onClick={() => onNavigate('community')} 
                  className="hover:text-[#8DB596] transition-colors text-left flex items-center gap-2 cursor-pointer"
                >
                  <img src="/assets/icons/nav-community.png" alt="Comunidad" className="w-4 h-4 object-contain shrink-0" />
                  <span>#7 Comunidad FluxGlow</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Valores y Equipo */}
          <div className="space-y-3">
            <h4 className="text-[#8DB596] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8DB596]" />
              Nuestros Valores
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Empatía', 'Innovación', 'Compromiso', 'Confidencialidad', 'Inclusión', 'Responsabilidad', 'Bienestar'].map((val) => (
                <span key={val} className="px-2.5 py-1 rounded-md bg-[#24352D] text-[#C5DDD0] text-xs border border-[#5F927B]/30">
                  {val}
                </span>
              ))}
            </div>

            <h4 className="text-[#E87A52] font-bold text-sm uppercase tracking-wider pt-3">
              Equipo Fundador
            </h4>
            <p className="text-xs text-stone-300 font-medium">
              Gabriela (CEO) • Moisés (CTO) • Yahir (UX/UI) • Génesis (Marketing)
            </p>
          </div>

          {/* Col 4: Contacto directo */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Contacto y Enlaces
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:fluxglow680@gmail.com" className="hover:text-white transition-colors">
                  fluxglow680@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8DB596] shrink-0" />
                <a href="tel:+50378014680" className="hover:text-white transition-colors">
                  +503 7801-4680
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Facebook: Flux Glow</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Instagram: @fluxglow</span>
              </li>
            </ul>

            <div className="flex flex-col gap-2 pt-1">
              <button 
                id="scroll-to-top-btn"
                onClick={scrollToTop}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Volver arriba</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>Iluminando tu bienestar comprendiendo tus emociones · Versión Beta 1.0</p>
          <div className="flex items-center gap-1.5">
            <span>Hecho con</span>
            <img src="/assets/icons/heart.png" alt="Amor" className="w-4 h-4 object-contain" />
            <span>para iluminar el flujo de tus emociones</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
