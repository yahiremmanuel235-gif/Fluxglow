/**
 * FluxGlow Gemini AI Service
 * Canalización segura a través del servidor backend (/api/chat y /api/gemini/analyze).
 * No expone API keys ni SDKs propietarios en el bundle cliente del navegador.
 */

// System Prompt especializado en acompañamiento empático de salud mental
export const FLUX_AI_SYSTEM_PROMPT = `Eres Flux AI, un asistente y compañero empático de salud mental, bienestar psicológico y regulación emocional integrado en la plataforma FluxGlow.

Tu misión es brindar un espacio seguro, comprensivo, cálido y libre de juicios para personas que buscan claridad, apoyo ante la ansiedad, sobrepensamiento, estrés, agotamiento o tristeza, así como herramientas prácticas de autocuidado.

Principios fundamentales de acompañamiento:
1. **Validación Emocional Primero**: Reconoce y normaliza las emociones del usuario con calidez humana antes de ofrecer soluciones. Evita el positivismo tóxico o minimizar lo que siente.
2. **Fundamentación Científica y Accesible**: Utiliza principios basados en Terapia Cognitivo-Conductual (TCC), Terapia de Aceptación y Compromiso (ACT), regulación del sistema nervioso y mindfulness. Explica conceptos de forma sencilla y desestigmatizante.
3. **Herramientas Prácticas y Micro-Pasos**: Ofrece ejercicios de bajo esfuerzo cognitivo (respiración diafragmática, suspiro fisiológico, técnica 5-4-3-2-1, preguntas de reencuadre o desgloses en tareas de 2 minutos).
4. **Formato Claro y Legible**: Estructura tus respuestas con espaciado agradable, subtítulos o viñetas cuando sea útil para reducir la fatiga mental del usuario.
5. **Preguntas Reflexivas**: Cierra habitualmente con una pregunta abierta, suave y no invasiva que invite a la autoobservación compasiva.
6. **Límites de Seguridad y Ética**: Recuerda que eres una herramienta de apoyo y psicoeducación. En situaciones de crisis aguda, daño autoinfligido o emergencia médica, guía con delicadeza al usuario para contactar a un profesional de salud o una línea de ayuda especializada local.`;

export interface ChatMessageHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export interface SendChatMessageParams {
  message: string;
  history?: ChatMessageHistoryItem[];
  mode?: string;
  userMood?: string;
  userContext?: {
    name?: string;
    ageGroup?: string;
    emotionalState?: string;
  };
}

/**
 * Genera la respuesta del asistente empático Flux AI utilizando el modelo Gemini.
 * Canalizada exclusivamente a través del proxy del servidor backend (/api/chat),
 * garantizando que las credenciales permanezcan privadas en el entorno de ejecución.
 */
export async function sendChatMessageToGemini(params: SendChatMessageParams): Promise<string> {
  const { message, history = [], mode = 'calm', userMood = '', userContext } = params;

  // Canalización segura a través del endpoint /api/chat del servidor backend
  try {
    const serverRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        userMood,
        context: `Modo: ${mode}. Estado: ${userMood}. Usuario: ${userContext?.name || 'Amigo de FluxGlow'}.`,
        userContext,
        history: history.slice(-8).map(h => ({
          role: h.role,
          parts: [{ text: h.text }]
        }))
      })
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.response && typeof data.response === 'string' && data.response.trim().length > 0) {
        return data.response.trim();
      }
    } else {
      console.warn('El servidor backend respondió con status:', serverRes.status);
    }
  } catch (proxyErr) {
    console.warn('Fallo de red al comunicar con el proxy /api/chat de Flux AI:', proxyErr);
  }

  // Fallback contextual de alta calidad y empatía si el servidor no está disponible
  return generateClientLocalFallback(message, mode, userMood);
}

export interface JournalAiAnalysis {
  dominantEmotion: string;
  sentimentScore: number;
  keywords: string[];
  aiInsight: string;
  suggestedAction: string;
}

/**
 * Analiza una entrada de diario para identificar emociones y sugerencias prácticas.
 * Canalizada a través del endpoint proxy del servidor (/api/gemini/analyze).
 */
export async function analyzeJournalWithGemini(entryText: string, mood?: string, tags?: string[]): Promise<JournalAiAnalysis> {
  try {
    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: entryText,
        entryText: entryText,
        mood: mood || 'En balance',
        tags: tags || ['Bienestar', 'Consciencia']
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.analysis) {
        return {
          dominantEmotion: data.analysis.dominantEmotion || mood || "Reflexión profunda",
          sentimentScore: typeof data.analysis.sentimentScore === 'number' ? data.analysis.sentimentScore : 75,
          keywords: Array.isArray(data.analysis.keywords) ? data.analysis.keywords : ["Consciencia", "Bienestar"],
          aiInsight: data.analysis.aiInsight || "Has expresado tus vivencias con autenticidad, lo cual es vital para el equilibrio emocional.",
          suggestedAction: data.analysis.suggestedAction || "Realiza una pausa de 2 minutos para relajar la respiración."
        };
      }
    }
  } catch (err) {
    console.warn('Error en /api/gemini/analyze, aplicando análisis contextual seguro:', err);
  }

  return {
    dominantEmotion: mood || "Reflexión profunda",
    sentimentScore: 75,
    keywords: ["Autoconocimiento", "Paz interior", "Resiliencia"],
    aiInsight: "Registrar lo que sientes con honestidad es el primer paso para procesar cualquier tensión de forma saludable.",
    suggestedAction: "Toma 3 respiraciones diafragmáticas conscientes y siente el apoyo de tus pies sobre el suelo."
  };
}

/**
 * Fallback contextual si la red no está disponible o el servidor está en arranque
 */
function generateClientLocalFallback(message: string, _mode: string, _mood?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('ansiedad') || lower.includes('ansioso') || lower.includes('pánico') || lower.includes('nervios')) {
    return `Comprendo profundamente lo incómoda e intensa que puede sentirse la ansiedad en el cuerpo y la mente. 

Cuando la mente se acelera, nuestro sistema nervioso entra en modo de alerta. Probemos un ejercicio de anclaje rápido:

1. **Suspiro Fisiológico**: Inhala hondo por la nariz, toma un segundo aire extra al final, y exhala muy lentamente por la boca. Hazlo 3 veces.
2. **Técnica 3-2-1**: Mira a tu alrededor y nombra 3 cosas que puedas ver, 2 que puedas tocar con tus manos y 1 sonido que alcances a escuchar.

Recuerda: esta sensación es temporal y tu cuerpo sabe cómo volver a la calma paso a paso. ¿Cómo se siente tu respiración en este instante?`;
  }

  if (lower.includes('abrumado') || lower.includes('estrés') || lower.includes('muchas cosas') || lower.includes('trabajo')) {
    return `Es completamente natural sentirse abrumado cuando las demandas superan nuestra energía del momento.

Para despejar la carga mental, te sugiero la **Técnica de Fricción Cero**:
- Elige una única acción que te tome menos de 2 minutos.
- Permítete pausar todo lo demás durante ese breve lapso.
- Recuerda que no necesitas resolver toda la semana hoy, solo el siguiente paso inmediato.

¿Te gustaría que dividamos lo que tienes pendiente en pasos muy pequeños y manejables?`;
  }

  if (lower.includes('triste') || lower.includes('desánimo') || lower.includes('llorar') || lower.includes('solo')) {
    return `Siento mucho que estés atravesando este momento de tristeza o desánimo. Quiero que sepas que tus emociones son completamente válidas y no tienes que fingir que todo está bien.

A veces, permitirnos sentir la tristeza sin juzgarnos es el primer paso para que el cuerpo libere esa carga. 

Si te apetece, cuéntame qué ha pesado más en tu mente hoy, o simplemente tómate este instante para descansar en calma. Estoy aquí contigo.`;
  }

  return `Gracias por compartir esto conmigo. En FluxGlow estamos aquí para escucharte y acompañarte con calma y claridad.

Tómate un momento para inhalar profundo y soltar los hombros. No tienes que tener todas las respuestas resueltas en este momento. 

¿Qué es lo que más te ayudaría a sentir un poco más de alivio o claridad ahora mismo?`;
}
