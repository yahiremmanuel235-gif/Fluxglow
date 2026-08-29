import React from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface GuideTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideTutorialModal: React.FC<GuideTutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <BookOpen className="w-5 h-5 text-[#548c71]" />,
      number: '1',
      title: 'Resumen simple arriba',
      description: 'Cada guía comienza con una síntesis directa de 2-3 líneas para que captures la idea fundamental en menos de 30 segundos.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      number: '2',
      title: 'Aviso de contenido transparente',
      description: 'El recuadro de aviso te indica claramente si el recurso es un ejemplo demostrativo con IA o proviene de un especialista clínico.'
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-[#de6943]" />,
      number: '3',
      title: 'Consejos extra y glosario',
      description: 'Pautas de aplicación real para tu rutina diaria y definiciones claras de términos técnicos sin jerga compleja.'
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-600" />,
      number: '4',
      title: 'Misión diaria para practicar',
      description: 'Pasa de la teoría a la acción completando el reto práctico. Cada misión suma a tu racha de bienestar en Análisis.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-200 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#548c71] text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tutorial de Lectura</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Así funciona una guía
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              4 elementos clave diseñados para tu aprendizaje y bienestar práctico.
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Cerrar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Steps Grid */}
        <div className="py-5 space-y-3.5">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 hover:border-stone-300 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-stone-200 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700">
                    Paso {step.number}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-400">
            Puedes reabrir este tutorial con el ícono <strong className="text-stone-600">?</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-[#548c71] hover:bg-[#43705a] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>Entendido, ¡vamos!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
