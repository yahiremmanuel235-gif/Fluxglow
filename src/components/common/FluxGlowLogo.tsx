import React, { useState } from 'react';

interface FluxGlowLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'dark' | 'light' | 'auto';
  className?: string;
  imgSrc?: string;
}

export const FluxGlowLogo: React.FC<FluxGlowLogoProps> = ({ 
  size = 'md', 
  showText = true,
  variant = 'dark',
  className = '',
  imgSrc
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'h-6 w-auto max-w-[120px]',
    sm: 'h-8 sm:h-9 w-auto max-w-[160px]',
    md: 'h-10 sm:h-12 w-auto max-w-[220px]',
    lg: 'h-14 sm:h-16 w-auto max-w-[280px]',
    xl: 'h-20 sm:h-24 md:h-28 w-auto max-w-[420px]',
  };

  const isLight = variant === 'light';
  const resolvedSrc = imgSrc || (isLight ? '/logo-white.svg' : '/Logo.png');

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={resolvedSrc}
        alt="FluxGlow Logo Oficial"
        className={`${sizeClasses[size]} object-contain transition-transform duration-200 hover:scale-[1.02]`}
        onError={(e) => {
          // Si no encuentra Logo.png, intenta con logo.png o con el fallback SVG
          const target = e.currentTarget;
          if (target.src.endsWith('/Logo.png')) {
            target.src = '/logo.png';
          } else if (target.src.endsWith('/logo.png')) {
            target.src = isLight ? '/logo-white.svg' : '/logo.svg';
          } else {
            setImgError(true);
          }
        }}
      />
    </div>
  );
};
