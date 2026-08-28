import React from 'react';

interface FluxGlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const FluxGlowLogo: React.FC<FluxGlowLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', leaves: 'w-3.5 h-3.5 -top-1 -right-2' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', leaves: 'w-4 h-4 -top-1.5 -right-2.5' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl sm:text-5xl', leaves: 'w-6 h-6 -top-2.5 -right-4' },
    xl: { icon: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-5xl sm:text-6xl md:text-7xl', leaves: 'w-8 h-8 -top-3.5 -right-6' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      
      {/* Sunburst Star Logo SVG matching the screenshot */}
      <div className={`relative shrink-0 ${current.icon} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Radial ray accents */}
          {/* Top ray */}
          <line x1="50" y1="6" x2="50" y2="18" stroke="#d9774e" strokeWidth="5.5" strokeLinecap="round" />
          {/* Bottom ray */}
          <line x1="50" y1="82" x2="50" y2="94" stroke="#5a8c72" strokeWidth="5.5" strokeLinecap="round" />
          {/* Left ray */}
          <line x1="6" y1="50" x2="18" y2="50" stroke="#d9774e" strokeWidth="5.5" strokeLinecap="round" />
          {/* Right ray */}
          <line x1="82" y1="50" x2="94" stroke="#5a8c72" strokeWidth="5.5" strokeLinecap="round" />
          {/* Top-Left diagonal ray */}
          <line x1="18" y1="18" x2="27" y2="27" stroke="#e0845a" strokeWidth="5" strokeLinecap="round" />
          {/* Bottom-Right diagonal ray */}
          <line x1="73" y1="73" x2="82" y2="82" stroke="#48725c" strokeWidth="5" strokeLinecap="round" />
          {/* Top-Right diagonal ray */}
          <line x1="82" y1="18" x2="73" y2="27" stroke="#9bbd9e" strokeWidth="5" strokeLinecap="round" />
          {/* Bottom-Left diagonal ray */}
          <line x1="18" y1="82" x2="27" y2="73" stroke="#719e84" strokeWidth="5" strokeLinecap="round" />

          {/* Central 4-point curved star */}
          <path
            d="M50 24 C50 38 38 50 24 50 C38 50 50 62 50 76 C50 62 62 50 76 50 C62 50 50 38 50 24 Z"
            fill="none"
            stroke="url(#starGrad)"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Star inner fill glow */}
          <path
            d="M50 26 C50 39 39 50 26 50 C39 50 50 61 50 74 C50 61 61 50 74 50 C61 50 50 39 50 26 Z"
            fill="url(#starGradFill)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="starGrad" x1="24" y1="24" x2="76" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d9774e" />
              <stop offset="50%" stopColor="#c29b62" />
              <stop offset="100%" stopColor="#5a8c72" />
            </linearGradient>
            <linearGradient id="starGradFill" x1="26" y1="26" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e07a52" />
              <stop offset="100%" stopColor="#5a8c72" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography with decorative leaves on the 'w' */}
      {showText && (
        <div className="relative inline-flex items-baseline">
          <span className={`font-extrabold tracking-tight text-[#1c382f] ${current.text} font-sans`}>
            FluxGlow
          </span>

          {/* Leaves sprouting above the 'w' matching the reference */}
          <div className={`absolute ${current.leaves} pointer-events-none`}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Leaf 1 (Left curved) */}
              <path
                d="M12 28 C10 18 18 10 28 8 C26 18 20 26 12 28 Z"
                fill="#5a8c72"
                opacity="0.9"
              />
              {/* Leaf 2 (Right smaller) */}
              <path
                d="M16 28 C20 20 28 16 36 18 C32 26 24 30 16 28 Z"
                fill="#78a88e"
                opacity="0.95"
              />
              {/* Leaf stem */}
              <path
                d="M12 28 Q 18 22 26 12"
                stroke="#3f6551"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

    </div>
  );
};
