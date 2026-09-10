import React from 'react';

interface RachaIconProps {
  className?: string;
  alt?: string;
}

export const RachaIcon: React.FC<RachaIconProps> = ({ 
  className = "w-5 h-5", 
  alt = "Racha" 
}) => {
  return (
    <img 
      src="/assets/Extra/Racha.png" 
      alt={alt} 
      className={`object-contain inline-block shrink-0 ${className}`} 
      loading="eager"
    />
  );
};
