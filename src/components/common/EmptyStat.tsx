import React from 'react';
import { Sparkles, LucideIcon } from 'lucide-react';

interface EmptyStatProps {
  /** Text when replacing a simple 0 metric line */
  inlineMessage?: string;
  /** Or if rendered as a dedicated state card (like Mapa Emocional en Progreso) */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'inline' | 'card' | 'badge';
  className?: string;
}

export const EmptyStat: React.FC<EmptyStatProps> = ({
  inlineMessage = 'Aún sin registros — ¡Tu primer paso cuenta!',
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
  variant = 'inline',
  className = '',
}) => {
  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDF4F0] text-[#B54F2C] border border-[#F7D3C3] ${className}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{inlineMessage}</span>
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-xs font-medium text-[#8C6250] bg-[#FAF7F2] border border-[#F0EAE1] px-3 py-1.5 rounded-xl ${className}`}>
        <Icon className="w-3.5 h-3.5 text-[#E87A52] shrink-0" />
        <span>{inlineMessage}</span>
      </div>
    );
  }

  // Card variant modeled after 'Mapa Emocional en Progreso'
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border-2 border-[#5F927B]/30 bg-gradient-to-b from-white to-[#FBF9F5] shadow-xs flex flex-col items-center justify-center text-center p-6 ${className}`}>
      <div className="w-11 h-11 rounded-2xl bg-[#EBF1EA] text-[#3E6855] mx-auto flex items-center justify-center border border-[#C5DDD0] shadow-2xs mb-2.5">
        <Icon className="w-5 h-5" />
      </div>
      {title && <h4 className="text-sm font-bold text-stone-900 mb-1">{title}</h4>}
      {description && (
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mb-3">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 rounded-xl bg-[#5F927B] hover:bg-[#4E7D68] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
