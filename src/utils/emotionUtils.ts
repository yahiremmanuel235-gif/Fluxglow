export const POSITIVE_EMOTIONS = ['feliz', 'calmo', 'entusiasmado', 'tranquilo', 'agradecido', 'motivado', 'creativo', 'energético'];
export const NEGATIVE_EMOTIONS = ['ansioso', 'triste', 'enojado', 'abrumado', 'inquieto', 'frustrado', 'cansado', 'desmotivado', 'tenso', 'estresado'];

export function calculateWellbeingScore(mood: string, intensity: number): number {
  const isPositive = isPositiveEmotion(mood);
  const isNegative = isNegativeEmotion(mood);
  
  if (isNegative) {
    // Para emociones negativas, mayor intensidad significa MENOR bienestar
    // Mapeamos 10 -> 0, 9 -> 1, etc.
    return Math.max(0, 10 - intensity);
  }
  
  // Para emociones positivas (o neutrales por defecto), mayor intensidad -> mayor bienestar
  return intensity;
}

export function isPositiveEmotion(mood: string): boolean {
  const m = mood.toLowerCase().replace(/^[^\w\s]+/, '').trim();
  return POSITIVE_EMOTIONS.includes(m);
}

export function isNegativeEmotion(mood: string): boolean {
  const m = mood.toLowerCase().replace(/^[^\w\s]+/, '').trim();
  return NEGATIVE_EMOTIONS.includes(m);
}

