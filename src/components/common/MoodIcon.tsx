import React from 'react';

interface MoodIconProps {
  mood: string;
  className?: string;
  alt?: string;
}

export const MOOD_IMAGE_PATHS: Record<string, string> = {
  enojado: '/Registro%20Emocional/Enojado.png',
  enojo: '/Registro%20Emocional/Enojado.png',
  ira: '/Registro%20Emocional/Enojado.png',
  tension: '/Registro%20Emocional/Enojado.png',
  tensión: '/Registro%20Emocional/Enojado.png',
  
  triste: '/Registro%20Emocional/Triste.png',
  tristeza: '/Registro%20Emocional/Triste.png',
  desanimo: '/Registro%20Emocional/Triste.png',
  desánimo: '/Registro%20Emocional/Triste.png',
  
  ansioso: '/Registro%20Emocional/Inquieto.png',
  ansiedad: '/Registro%20Emocional/Inquieto.png',
  inquieto: '/Registro%20Emocional/Inquieto.png',
  estres: '/Registro%20Emocional/Inquieto.png',
  estrés: '/Registro%20Emocional/Inquieto.png',
  
  tranquilo: '/Registro%20Emocional/Tranquilo.png',
  tranquilidad: '/Registro%20Emocional/Tranquilo.png',
  calma: '/Registro%20Emocional/Tranquilo.png',
  sereno: '/Registro%20Emocional/Tranquilo.png',
  
  feliz: '/Registro%20Emocional/Feliz.png',
  felicidad: '/Registro%20Emocional/Feliz.png',
  alegria: '/Registro%20Emocional/Feliz.png',
  alegría: '/Registro%20Emocional/Feliz.png',
};

export const getMoodImagePath = (rawMood: string): string => {
  const key = (rawMood || '').toLowerCase().trim();
  if (MOOD_IMAGE_PATHS[key]) return MOOD_IMAGE_PATHS[key];
  if (key.includes('enoj') || key.includes('ira') || key.includes('furia')) return MOOD_IMAGE_PATHS.enojado;
  if (key.includes('trist') || key.includes('desanim') || key.includes('llanto')) return MOOD_IMAGE_PATHS.triste;
  if (key.includes('ansio') || key.includes('inquiet') || key.includes('estres')) return MOOD_IMAGE_PATHS.ansioso;
  if (key.includes('feliz') || key.includes('alegr') || key.includes('content')) return MOOD_IMAGE_PATHS.feliz;
  return MOOD_IMAGE_PATHS.tranquilo;
};

export const MoodIcon: React.FC<MoodIconProps> = ({ 
  mood, 
  className = "w-6 h-6", 
  alt 
}) => {
  const imageSrc = getMoodImagePath(mood);
  return (
    <img 
      src={imageSrc} 
      alt={alt || mood || 'Emoción'} 
      className={`object-contain inline-block shrink-0 ${className}`} 
      loading="eager"
    />
  );
};
