import React from 'react';
import { ViewMode } from '../../types';
import { INTERFACES_DATA } from '../../data/mockData';
import { 
  BookOpen, 
  PenTool, 
  TrendingUp, 
  Bot, 
  ShieldAlert, 
  UserCheck, 
  Users, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';

interface InterfacesShowcaseProps {
  onNavigate: (view: ViewMode) => void;
}

export const InterfacesShowcase: React.FC<InterfacesShowcaseProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-[#faf7f2] relative" id="diseno">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89A6B]/15 text-[#d4622a] text-xs font-bold uppercase tracking-wider mb-4 border border-[#E89A6B]/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Arquitectura Funcional</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#4a7c59] via-[#8DB596] to-[#d4622a] bg-clip-text text-transparent mb-6">
            INTERFACES DE FLUXGLOW
          </h2>

          <p className="text-stone-700 text-base md:text-lg leading-relaxed text-justify sm:text-center">
            Hemos estructurado nuestra plataforma en <strong>7 apartados interactivos</strong>, cada uno diseñado para cumplir una función específica y complementaria en tu acompañamiento emocional diario. Puedes explorar y probar cada uno de ellos directamente a continuación:
          </p>
        </div>

        {/* Apartado 1: Full-width Hero Showcase (as in original HTML 'fila-explora') */}
        <div className="mb-10 bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Apartado #1</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold">Centro de Aprendizaje Emocional (Explora y Aprende)</h3>
                <p className="text-white/90 text-sm mt-1 max-w-2xl">
                  Biblioteca con videos de expertos, podcasts, artículos científicos simplificados, guías descargables y tests psicológicos orientativos.
                </p>
              </div>

              <button
                id="btn-launch-apartado-1"
                onClick={() => onNavigate('learn')}
                className="shrink-0 flex items-center gap-2 bg-white text-[#2d6a4f] hover:bg-stone-100 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform group-hover:translate-x-1"
              >
                <span>Abrir Apartado #1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Preview Cards inside */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25">
                <div className="text-2xl mb-2">📚</div>
                <h5 className="font-bold text-sm text-white">Artículos Científicos</h5>
                <p className="text-xs text-white/80 mt-1">Explicados en lenguaje claro para jóvenes de 15 a 30 años.</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25">
                <div className="text-2xl mb-2">🎙️</div>
                <h5 className="font-bold text-sm text-white">Podcasts Interactivos</h5>
                <p className="text-xs text-white/80 mt-1">Episodios sobre gestión de estrés académico y autocompasión.</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25">
                <div className="text-2xl mb-2">📋</div>
                <h5 className="font-bold text-sm text-white">Tests Psicológicos</h5>
                <p className="text-xs text-white/80 mt-1">Escalas orientativas tipo GAD-7 y nivel de burnout con feedback.</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25">
                <div className="text-2xl mb-2">📥</div>
                <h5 className="font-bold text-sm text-white">Guías Descargables</h5>
                <p className="text-xs text-white/80 mt-1">Cuadernos de trabajo en PDF para reestructuración de pensamientos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apartados 2 to 7 Grid (2 columns on md/lg, as in original 'fila-doble') */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INTERFACES_DATA.slice(1).map((item) => (
            <div
              key={item.id}
              id={`interface-card-${item.id}`}
              className="bg-gradient-to-br from-[#8DB596] via-[#D8C97B] to-[#E89A6B] p-6 sm:p-8 rounded-3xl text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                    {item.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white">
                    {getIcon(item.icon)}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">{item.subtitle}</p>

                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs text-white/80 font-medium">Completamente funcional</span>
                <button
                  id={`btn-open-${item.id}`}
                  onClick={() => onNavigate(item.id as ViewMode)}
                  className="flex items-center gap-2 bg-white text-[#2d6a4f] hover:bg-stone-100 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all transform group-hover:scale-105"
                >
                  <span>Explorar {item.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
