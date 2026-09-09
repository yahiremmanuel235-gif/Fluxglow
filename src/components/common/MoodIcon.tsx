import React from 'react';

interface MoodIconProps {
  mood: string;
  className?: string;
  alt?: string;
}

export const MOOD_IMAGE_PATHS: Record<string, string> = {
  // 1: Enojado / Muy Mal
  enojado: '/assets/moods/mood-1-angry.png',
  enojo: '/assets/moods/mood-1-angry.png',
  ira: '/assets/moods/mood-1-angry.png',
  furia: '/assets/moods/mood-1-angry.png',
  tension: '/assets/moods/mood-1-angry.png',
  tensión: '/assets/moods/mood-1-angry.png',
  mal: '/assets/moods/mood-1-angry.png',
  muymal: '/assets/moods/mood-1-angry.png',
  'muy mal': '/assets/moods/mood-1-angry.png',
  
  // 2: Triste
  triste: '/assets/moods/mood-2-sad.png',
  tristeza: '/assets/moods/mood-2-sad.png',
  desanimo: '/assets/moods/mood-2-sad.png',
  desánimo: '/assets/moods/mood-2-sad.png',
  llanto: '/assets/moods/mood-2-sad.png',
  
  // 3: Neutral / Inquieto / Ansioso
  neutral: '/assets/moods/mood-3-neutral.png',
  ansioso: '/assets/moods/mood-3-neutral.png',
  ansiedad: '/assets/moods/mood-3-neutral.png',
  inquieto: '/assets/moods/mood-3-neutral.png',
  estres: '/assets/moods/mood-3-neutral.png',
  estrés: '/assets/moods/mood-3-neutral.png',
  abrumado: '/assets/moods/mood-3-neutral.png',
  
  // 4: Alegre / Tranquilo
  alegre: '/assets/moods/mood-4-happy.png',
  tranquilo: '/assets/moods/mood-4-happy.png',
  tranquilidad: '/assets/moods/mood-4-happy.png',
  calma: '/assets/moods/mood-4-happy.png',
  sereno: '/assets/moods/mood-4-happy.png',
  motivado: '/assets/moods/mood-4-happy.png',
  
  // 5: Muy Feliz
  feliz: '/assets/moods/mood-5-veryhappy.png',
  felicidad: '/assets/moods/mood-5-veryhappy.png',
  alegria: '/assets/moods/mood-5-veryhappy.png',
  alegría: '/assets/moods/mood-5-veryhappy.png',
  muyfeliz: '/assets/moods/mood-5-veryhappy.png',
  'muy feliz': '/assets/moods/mood-5-veryhappy.png',
};

export const getMoodImagePath = (rawMood: string): string => {
  const key = (rawMood || '').toLowerCase().trim();
  if (MOOD_IMAGE_PATHS[key]) return MOOD_IMAGE_PATHS[key];
  if (key.includes('enoj') || key.includes('ira') || key.includes('furia') || key.includes('mal')) return MOOD_IMAGE_PATHS.enojado;
  if (key.includes('trist') || key.includes('desanim') || key.includes('llanto')) return MOOD_IMAGE_PATHS.triste;
  if (key.includes('neutr') || key.includes('ansio') || key.includes('inquiet') || key.includes('estres') || key.includes('abrum')) return MOOD_IMAGE_PATHS.neutral;
  if (key.includes('muy feliz') || key.includes('super') || key.includes('excelente')) return MOOD_IMAGE_PATHS.muyfeliz;
  if (key.includes('feliz') || key.includes('alegr') || key.includes('content') || key.includes('motiv')) return MOOD_IMAGE_PATHS.alegre;
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
