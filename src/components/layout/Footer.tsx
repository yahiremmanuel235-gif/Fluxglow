import React from 'react';
import { ViewMode } from '../../types';
import { Sparkles, Mail, Phone, Instagram, Facebook, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#242e28] text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#1b231e] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#E89A6B]" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                FLUXGLOW
              </span>
            </div>
            
            <p className="text-stone-400 text-sm leading-relaxed italic">
              "Iluminando tu bienestar, comprendiendo tus emociones"
            </p>

            <p className="text-stone-400 text-xs leading-relaxed">
              Plataforma digital inteligente diseñada para acompañar a los jóvenes en el conocimiento, gestión y fortalecimiento de su salud emocional.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidad y Confidencialidad Garantizada</span>
            </div>
          </div>

          {/* Col 2: Los 7 Apartados */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              7 Apartados Interactivos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  id="footer-nav-learn"
                  onClick={() => onNavigate('learn')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #1 Centro de Aprendizaje Emocional
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-journal"
                  onClick={() => onNavigate('journal')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #2 Diario Emocional Inteligente
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-analytics"
                  onClick={() => onNavigate('analytics')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #3 Análisis Predictivo Avanzado
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-ai"
                  onClick={() => onNavigate('ai')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #4 Asistente Virtual Flux AI
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-alert"
                  onClick={() => onNavigate('alert')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #5 Alerta Emocional Inteligente & SOS
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-profile"
                  onClick={() => onNavigate('profile')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #6 Perfil y Personalización
                </button>
              </li>
              <li>
                <button 
                  id="footer-nav-community"
                  onClick={() => onNavigate('community')} 
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  #7 Comunidad FluxGlow
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Valores y Equipo */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Nuestros Valores
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Empatía', 'Innovación', 'Compromiso', 'Confidencialidad', 'Inclusión', 'Responsabilidad', 'Bienestar'].map((val) => (
                <span key={val} className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-xs border border-stone-700">
                  {val}
                </span>
              ))}
            </div>

            <h4 className="text-white font-bold text-sm uppercase tracking-wider pt-3">
              Equipo Fundador
            </h4>
            <p className="text-xs text-stone-400">
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
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
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

            <button 
              id="scroll-to-top-btn"
              onClick={scrollToTop}
              className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Volver arriba</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} FluxGlow. Todos los derechos reservados. Desarrollado con vocación por el bienestar juvenil.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para iluminar el flujo de tus emociones</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
