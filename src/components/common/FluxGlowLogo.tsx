import React, { useState } from 'react';

interface FluxGlowLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'dark' | 'light' | 'auto' | 'secondary';
  className?: string;
  imgSrc?: string;
  alt?: string;
}

export const FluxGlowLogo: React.FC<FluxGlowLogoProps> = ({ 
  size = 'md', 
  showText = true,
  variant = 'dark',
  className = '',
  imgSrc,
  alt = 'FluxGlow'
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'h-5 sm:h-5.5 w-auto max-w-[105px]',
    sm: 'h-8 sm:h-9 w-auto max-w-[160px]',
    md: 'h-10 sm:h-12 w-auto max-w-[220px]',
    lg: 'h-14 sm:h-16 w-auto max-w-[280px]',
    xl: 'h-20 sm:h-24 md:h-28 w-auto max-w-[420px]',
  };

  const isLight = variant === 'light';
  const isSecondary = variant === 'secondary';

  const defaultSrc = '/assets/brand/logo-fluxglow.png';

  const resolvedSrc = (imgSrc && imgSrc !== '/logo2.png' && imgSrc !== '/Logo.png' && imgSrc !== '/logo.png') 
    ? imgSrc 
    : defaultSrc;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${sizeClasses[size]} object-contain transition-transform duration-200 hover:scale-[1.02]`}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('/assets/brand/logo-fluxglow.png')) {
            target.src = '/assets/brand/logo-fluxglow.png';
          } else {
            setImgError(true);
          }
        }}
      />
    </div>
  );
};

